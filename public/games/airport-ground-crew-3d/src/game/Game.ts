import * as THREE from 'three';
import { GameState } from './GameState';
import { AudioManager } from './AudioManager';
import { InputManager } from './InputManager';
import { CameraController } from './CameraController';
import { AirportWorld } from '../world/AirportWorld';
import { GroundCrewPlayer } from '../player/GroundCrewPlayer';
import { BaggageTug } from '../vehicles/BaggageTug';
import { FuelTruck } from '../vehicles/FuelTruck';
import { CargoLoader } from '../vehicles/CargoLoader';
import { VehicleController } from '../vehicles/VehicleController';
import { Aircraft } from '../aircraft/Aircraft';
import { MissionManager } from '../missions/MissionManager';
import { UIManager } from '../ui/UIManager';

export class Game {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private renderer: THREE.WebGLRenderer;
  private cameraCtrl: CameraController;
  private clock: THREE.Clock;

  // Subsystems
  public state: GameState;
  public audio: AudioManager;
  public input: InputManager;
  public world: AirportWorld;
  public player: GroundCrewPlayer;
  public tug: BaggageTug;
  public fuelTruck: FuelTruck;
  public cargoLoader: CargoLoader;
  public aircraft: Aircraft;
  public missions: MissionManager;
  public ui: UIManager;

  // Player vehicle state
  public currentVehicle: VehicleController | null = null;
  public isPaused: boolean = false;

  constructor(container: HTMLElement) {
    this.container = container;
    this.clock = new THREE.Clock();

    // 1. Scene & Renderer
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87ceeb); // Daytime airport sky
    this.scene.fog = new THREE.FogExp2(0xddeeff, 0.0035);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.container.appendChild(this.renderer.domElement);

    // 2. Camera
    this.cameraCtrl = new CameraController();

    // 3. Game State & Audio & Input
    this.state = new GameState();
    this.audio = new AudioManager();
    this.input = new InputManager();

    // 4. World & Entities
    this.world = new AirportWorld(this.scene);
    this.player = new GroundCrewPlayer(this.scene);
    this.tug = new BaggageTug(this.scene);
    this.fuelTruck = new FuelTruck(this.scene);
    this.cargoLoader = new CargoLoader(this.scene);
    this.aircraft = new Aircraft(this.scene);

    // 5. Missions & UI
    this.missions = new MissionManager(this.scene);
    this.ui = new UIManager(this.state, this.audio, this.missions);

    this.bindUIEvents();
    this.setupResize();

    // Start background jet sound
    this.audio.startJetAmbient(0.06);

    // Initial show menu
    this.ui.showMainMenu();

    // Start Loop
    this.animate();
  }

  private bindUIEvents() {
    this.ui.onStartMission = (id: number) => {
      this.isPaused = false;
      this.currentVehicle = null;
      this.player.mesh.visible = true;
      this.missions.startMission(
        id,
        this.world,
        this.player,
        this.tug,
        this.fuelTruck,
        this.cargoLoader,
        this.aircraft
      );
    };

    this.ui.onResumeGame = () => {
      this.isPaused = false;
    };

    this.ui.onRestartMission = () => {
      this.isPaused = false;
      if (this.ui.onStartMission) {
        this.ui.onStartMission(this.missions.currentMissionId);
      }
    };

    this.ui.onReturnToHub = () => {
      this.isPaused = false;
      this.missions.isMissionActive = false;
      this.currentVehicle = null;
      this.player.mesh.visible = true;
      this.player.setPosition(0, 0, 42);
    };
  }

  private setupResize() {
    window.addEventListener('resize', () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      this.renderer.setSize(w, h);
      this.cameraCtrl.resize(w, h);
    });
  }

  private handleVehicleInteraction() {
    const playerPos = this.player.getPosition();

    if (this.currentVehicle) {
      // Prompt to exit vehicle
      this.ui.showPrompt('Press [E] or tap EXIT to step out of vehicle');
      if (this.input.consumeInteract()) {
        this.exitVehicle();
      }
      return;
    }

    // Check proximity to enterable vehicles
    const vehicles: { name: string; v: VehicleController }[] = [
      { name: 'Baggage Tug', v: this.tug },
      { name: 'Fuel Tanker', v: this.fuelTruck },
      { name: 'Cargo Loader', v: this.cargoLoader }
    ];

    let foundVehicle: { name: string; v: VehicleController } | null = null;
    let minDist = 4.0;

    vehicles.forEach((item) => {
      const d = playerPos.distanceTo(item.v.getPosition());
      if (d < minDist) {
        foundVehicle = item;
      }
    });

    if (foundVehicle) {
      const item = foundVehicle as { name: string; v: VehicleController };
      this.ui.showPrompt(`Press [E] or tap ENTER to drive ${item.name}`);
      if (this.input.consumeInteract()) {
        this.enterVehicle(item.v);
      }
    } else {
      this.ui.hidePrompt();
    }
  }

  private enterVehicle(v: VehicleController) {
    this.currentVehicle = v;
    this.player.mesh.visible = false;
    this.audio.playInteract();
  }

  private exitVehicle() {
    if (!this.currentVehicle) return;
    const vPos = this.currentVehicle.getPosition();
    // Step out to the left side of the vehicle
    const angle = this.currentVehicle.mesh.rotation.y + Math.PI / 2;
    this.player.setPosition(
      vPos.x + Math.sin(angle) * 2.0,
      0,
      vPos.z + Math.cos(angle) * 2.0
    );
    this.player.mesh.visible = true;
    this.currentVehicle = null;
    this.audio.playInteract();
  }

  private checkMissionProgress() {
    const step = this.missions.getCurrentStep();
    if (!step) return;

    const currentPos = this.currentVehicle ? this.currentVehicle.getPosition() : this.player.getPosition();
    const distToTarget = currentPos.distanceTo(step.targetPos);
    const inRange = distToTarget <= step.targetRadius;

    if (step.promptText && inRange) {
      this.ui.showPrompt(step.promptText);
    }

    // Step logic
    if (step.actionRequired === 'enter_vehicle') {
      if (this.currentVehicle) {
        this.missions.advanceStep(this.audio);
      }
    } else if (step.actionRequired === 'exit_vehicle') {
      if (!this.currentVehicle && inRange) {
        this.missions.advanceStep(this.audio);
      }
    } else if (step.actionRequired === 'reach_location') {
      if (inRange) {
        this.missions.advanceStep(this.audio);
      }
    } else if (step.actionRequired === 'interact') {
      if (inRange && this.input.consumeInteract()) {
        // Handle specific mission props
        if (this.missions.currentMissionId === 2) {
          if (this.missions.currentStepIndex === 1) {
            this.tug.attachedCart?.setLuggageVisible(true);
          } else if (this.missions.currentStepIndex === 2) {
            this.tug.attachedCart?.setLuggageVisible(false);
          }
        } else if (this.missions.currentMissionId === 3) {
          if (this.missions.currentStepIndex === 0) {
            this.player.setMarshallingMode(true);
            this.aircraft.startTaxiArrival(new THREE.Vector3(15, 0, -55), new THREE.Vector3(15, 0, -10), -5);
          }
        } else if (this.missions.currentMissionId === 4) {
          if (this.missions.currentStepIndex === 2) {
            this.cargoLoader.raisePlatform();
            this.audio.playHydraulic();
          } else if (this.missions.currentStepIndex === 3) {
            this.cargoLoader.unloadCargo();
            this.cargoLoader.lowerPlatform();
            this.audio.playHydraulic();
          }
        } else if (this.missions.currentMissionId === 5) {
          if (this.missions.currentStepIndex === 2) {
            this.fuelTruck.connectHose(this.aircraft.wingFuelPort);
            this.audio.playInteract();
          } else if (this.missions.currentStepIndex === 3) {
            this.audio.playFuelPump();
          } else if (this.missions.currentStepIndex === 4) {
            this.fuelTruck.disconnectHose();
            this.audio.playInteract();
          }
        }

        this.missions.advanceStep(this.audio);
      }
    } else if (step.actionRequired === 'marshall_stop') {
      if (this.input.brakePressed || this.input.consumeInteract()) {
        this.player.marshallingSignal = 'stop';
        this.aircraft.stopAtGate();
        this.audio.playSuccess();
        this.missions.advanceStep(this.audio);
      }
    }

    // Check if mission finished
    if (!this.missions.isMissionActive && this.missions.currentStepIndex >= this.missions.activeSteps.length) {
      this.ui.showResults(this.missions.currentMissionId, true);
    }
  }

  private animate = () => {
    requestAnimationFrame(this.animate);

    const delta = Math.min(0.1, this.clock.getDelta());

    // Check pause input
    if (this.input.consumePause()) {
      this.isPaused = !this.isPaused;
      if (this.isPaused) this.ui.showPause();
      else this.ui.hideAllScreens();
    }

    if (this.isPaused) return;

    // Check camera cycle
    if (this.input.consumeCamera()) {
      this.cameraCtrl.cycleMode();
    }

    // Check horn
    if (this.input.consumeHorn() && this.currentVehicle) {
      this.audio.playHorn();
    }

    // Input Manager update
    this.input.update();
    const lookDelta = this.input.consumeLook();

    // Update active control entity
    let activeSpeed = 0;
    let isReverse = false;

    if (this.currentVehicle) {
      this.currentVehicle.update(this.input.move, this.input.brakePressed, delta);
      activeSpeed = this.currentVehicle.getKmh();
      isReverse = this.currentVehicle.inReverse;
      this.cameraCtrl.update(this.currentVehicle.mesh, true, delta, false, lookDelta);
      this.audio.updateVehicleSound(this.currentVehicle.speed, true);
    } else {
      this.player.update(this.input.move, delta);
      this.cameraCtrl.update(this.player.mesh, false, delta, this.player.isMarshalling, lookDelta);
      this.audio.updateVehicleSound(0, false);
    }

    // World & Aircraft updates
    this.world.update(delta);
    this.aircraft.update(delta);

    // Vehicle interaction prompt checks
    this.handleVehicleInteraction();

    // Mission loop & timer check
    if (this.missions.isMissionActive) {
      const active = this.missions.update(delta);
      if (!active && this.missions.missionTimeLeft <= 0) {
        // Timed mission failed
        this.audio.playFail();
        this.ui.showResults(this.missions.currentMissionId, false);
      } else {
        this.checkMissionProgress();
      }
    }

    // Update HUD telemetry
    const curStep = this.missions.getCurrentStep();
    const curDef = this.missions.missionDefs[this.missions.currentMissionId];
    this.ui.updateHUD(
      curDef ? `Mission ${curDef.id}: ${curDef.title}` : 'Free Roam',
      curStep ? curStep.text : 'Explore airport apron',
      activeSpeed,
      isReverse,
      !!this.currentVehicle
    );

    // Update Real-Time Waypoint Navigation Pin on Screen
    if (this.missions.isMissionActive && curStep) {
      const activePos = this.currentVehicle ? this.currentVehicle.getPosition() : this.player.getPosition();
      const dist = Math.round(activePos.distanceTo(curStep.targetPos));

      // Project target 3D position to 2D screen coordinates
      const target3D = curStep.targetPos.clone();
      target3D.y += 2.0;
      target3D.project(this.cameraCtrl.camera);

      const isBehind = target3D.z > 1.0;
      let sx = (target3D.x * 0.5 + 0.5) * window.innerWidth;
      let sy = (-target3D.y * 0.5 + 0.5) * window.innerHeight;

      const marginX = 90;
      const marginY = 80;
      let arrowText = '📍';

      if (isBehind || sx < marginX || sx > window.innerWidth - marginX || sy < marginY || sy > window.innerHeight - marginY) {
        // Target is off-screen! Pin to border with directional arrow
        if (isBehind) {
          sx = window.innerWidth - sx;
          sy = window.innerHeight - marginY;
          arrowText = sx < window.innerWidth / 2 ? '◀' : '▶';
        } else {
          if (sx < marginX) { sx = marginX; arrowText = '◀'; }
          else if (sx > window.innerWidth - marginX) { sx = window.innerWidth - marginX; arrowText = '▶'; }
          if (sy < marginY) { sy = marginY; arrowText = '▲'; }
          else if (sy > window.innerHeight - marginY) { sy = window.innerHeight - marginY; arrowText = '▼'; }
        }
      }

      let label = 'OBJECTIVE';
      const txt = curStep.text.toLowerCase();
      if (txt.includes('stand a1')) label = 'STAND A1';
      else if (txt.includes('stand a2')) label = 'STAND A2';
      else if (txt.includes('baggage')) label = 'BAGGAGE DEPOT';
      else if (txt.includes('cargo')) label = 'CARGO DECK';
      else if (txt.includes('fuel')) label = 'WING FUEL PORT';
      else if (txt.includes('tug')) label = 'BAGGAGE TUG';

      this.ui.updateWaypointHUD(true, sx, sy, arrowText, label, dist);
    } else {
      this.ui.updateWaypointHUD(false, 0, 0, '', '', 0);
    }

    // Render Scene
    this.renderer.render(this.scene, this.cameraCtrl.camera);
  };
}
