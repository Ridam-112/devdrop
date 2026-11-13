import * as THREE from 'three';
import { GameState } from '../game/GameState';
import { AudioManager } from '../game/AudioManager';
import { AirportWorld } from '../world/AirportWorld';
import { GroundCrewPlayer } from '../player/GroundCrewPlayer';
import { BaggageTug } from '../vehicles/BaggageTug';
import { FuelTruck } from '../vehicles/FuelTruck';
import { CargoLoader } from '../vehicles/CargoLoader';
import { Aircraft } from '../aircraft/Aircraft';

export interface MissionStep {
  text: string;
  targetPos: THREE.Vector3;
  targetRadius: number;
  actionRequired?: 'enter_vehicle' | 'exit_vehicle' | 'interact' | 'marshall_stop' | 'reach_location';
  promptText?: string;
}

export interface MissionDef {
  id: number;
  title: string;
  description: string;
  rewardCash: number;
  rewardXp: number;
  timeLimit?: number; // seconds
}

export class MissionManager {
  public currentMissionId: number = 1;
  public currentStepIndex: number = 0;
  public isMissionActive: boolean = false;
  public missionTimeLeft: number = 0;

  // 3D Visual Objective Marker
  private markerGroup: THREE.Group;
  private markerRing: THREE.Mesh;
  private markerArrow: THREE.Mesh;
  private markerBeam: THREE.Mesh;
  private markerRipple: THREE.Mesh;
  private markerSprite: THREE.Sprite | null = null;
  private markerTime: number = 0;

  public activeSteps: MissionStep[] = [];
  public missionDefs: Record<number, MissionDef> = {
    1: {
      id: 1,
      title: 'First Day on the Ramp',
      description: 'Learn ramp basics. Walk to the service garage, enter the Baggage Tug, and drive safely to Stand A1.',
      rewardCash: 250,
      rewardXp: 150
    },
    2: {
      id: 2,
      title: 'Baggage Rush',
      description: 'Drive the Baggage Tug to the sorting depot, load passenger luggage, and deliver to Flight 101 at Stand A1.',
      rewardCash: 400,
      rewardXp: 220
    },
    3: {
      id: 3,
      title: 'Flight 102 Marshalling',
      description: 'Equip marshalling wands at Stand A2. Guide incoming Boeing 737 into the gate and stop it on the red mark!',
      rewardCash: 450,
      rewardXp: 300
    },
    4: {
      id: 4,
      title: 'Cargo High-Loader Express',
      description: 'Drive the Main Deck Cargo Loader to Stand A1. Raise the hydraulic scissor lift and transfer ULD container.',
      rewardCash: 500,
      rewardXp: 320
    },
    5: {
      id: 5,
      title: 'Aviation Fuel Delivery',
      description: 'Drive the Jet-A1 fuel tanker to Stand A1. Connect the heavy fuel hose and pump 100% fuel to the wing tank.',
      rewardCash: 600,
      rewardXp: 400
    },
    6: {
      id: 6,
      title: 'Express Turnaround (Timed)',
      description: 'Complete baggage delivery and cargo loading in under 3 minutes before passenger boarding begins!',
      rewardCash: 750,
      rewardXp: 500,
      timeLimit: 180
    },
    7: {
      id: 7,
      title: 'Busy Ramp Shift',
      description: 'Marshall the arriving flight at Stand A1, then deliver luggage to Stand A2 without delay.',
      rewardCash: 900,
      rewardXp: 600
    },
    8: {
      id: 8,
      title: 'Airport Master Turnaround',
      description: 'The ultimate ground crew test! Marshall arrival, deliver luggage, load cargo, and complete refueling.',
      rewardCash: 1500,
      rewardXp: 1000,
      timeLimit: 240
    }
  };

  constructor(scene: THREE.Scene) {
    this.markerGroup = new THREE.Group();
    const { ring, arrow, beam, ripple } = this.buildMarker();
    this.markerRing = ring;
    this.markerArrow = arrow;
    this.markerBeam = beam;
    this.markerRipple = ripple;
    this.markerGroup.visible = false;
    scene.add(this.markerGroup);
  }

  private buildMarker() {
    // 1. Solid Landing Pad Disc
    const padGeo = new THREE.CircleGeometry(3.2, 32);
    padGeo.rotateX(-Math.PI / 2);
    const padMat = new THREE.MeshBasicMaterial({
      color: 0xf1c40f,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35
    });
    const pad = new THREE.Mesh(padGeo, padMat);
    this.markerGroup.add(pad);

    // 2. Thick Outer Hazard Ring
    const ringGeo = new THREE.RingGeometry(2.8, 3.4, 32);
    ringGeo.rotateX(-Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xffd32a,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.95
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    this.markerGroup.add(ring);

    // 3. Expanding Ripple Shockwave Ring
    const rippleGeo = new THREE.RingGeometry(1.0, 1.4, 32);
    rippleGeo.rotateX(-Math.PI / 2);
    const rippleMat = new THREE.MeshBasicMaterial({
      color: 0x00f3ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8
    });
    const ripple = new THREE.Mesh(rippleGeo, rippleMat);
    this.markerGroup.add(ripple);

    // 4. Giant 45-Meter Glowing Sky Pillar Beacon (Visible from entire airport)
    const beamGeo = new THREE.CylinderGeometry(0.8, 1.5, 48, 16, 1, true);
    beamGeo.translate(0, 24, 0);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0xf1c40f,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.45
    });
    const beam = new THREE.Mesh(beamGeo, beamMat);
    this.markerGroup.add(beam);

    // 5. Floating Glowing 3D Diamond Crystal Marker
    const arrowGeo = new THREE.OctahedronGeometry(1.1, 0);
    const arrowMat = new THREE.MeshBasicMaterial({ color: 0xffa502 });
    const arrow = new THREE.Mesh(arrowGeo, arrowMat);
    arrow.position.y = 4.2;
    this.markerGroup.add(arrow);

    return { ring, arrow, beam, ripple };
  }

  private createTextSprite(text: string): THREE.Sprite {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;

    // Background pill
    ctx.fillStyle = 'rgba(12, 27, 51, 0.95)';
    ctx.strokeStyle = '#f1c40f';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.roundRect(10, 10, 492, 108, 28);
    ctx.fill();
    ctx.stroke();

    // Text label
    ctx.font = 'bold 36px "Segoe UI", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 256, 64);

    const texture = new THREE.CanvasTexture(canvas);
    const mat = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(8.5, 2.1, 1);
    sprite.position.y = 7.0;
    return sprite;
  }

  public startMission(
    id: number,
    world: AirportWorld,
    player: GroundCrewPlayer,
    tug: BaggageTug,
    fuelTruck: FuelTruck,
    cargoLoader: CargoLoader,
    aircraft: Aircraft
  ) {
    this.currentMissionId = id;
    this.currentStepIndex = 0;
    this.isMissionActive = true;
    const def = this.missionDefs[id];
    this.missionTimeLeft = def.timeLimit || 0;

    // Reset world entities based on mission
    player.setMarshallingMode(false);
    aircraft.stopAtGate();
    aircraft.closeCargoDoor();
    tug.attachedCart?.setLuggageVisible(false);
    fuelTruck.disconnectHose();
    cargoLoader.lowerPlatform();
    cargoLoader.loadCargo();

    // Spawn player and vehicles for mission
    this.setupMissionSteps(id, world, player, tug, fuelTruck, cargoLoader, aircraft);
    this.updateMarker();
  }

  private setupMissionSteps(
    id: number,
    world: AirportWorld,
    player: GroundCrewPlayer,
    tug: BaggageTug,
    fuelTruck: FuelTruck,
    cargoLoader: CargoLoader,
    aircraft: Aircraft
  ) {
    this.activeSteps = [];

    if (id === 1) {
      // Mission 1: First Day on the Ramp
      player.setPosition(0, 0, 48, Math.PI);
      tug.setPosition(0, 0, 40, Math.PI);

      this.activeSteps = [
        {
          text: 'Walk to the Baggage Tug vehicle at the garage',
          targetPos: tug.getPosition().clone(),
          targetRadius: 3.5,
          actionRequired: 'enter_vehicle',
          promptText: 'Press [E] or tap ENTER to drive Tug'
        },
        {
          text: 'Drive Baggage Tug to Stand A1 parking spot',
          targetPos: world.stands['A1'].position.clone(),
          targetRadius: 4.5,
          actionRequired: 'reach_location'
        },
        {
          text: 'Exit vehicle to complete ramp induction',
          targetPos: world.stands['A1'].position.clone(),
          targetRadius: 6.0,
          actionRequired: 'exit_vehicle',
          promptText: 'Press [E] or tap EXIT to leave vehicle'
        }
      ];
    } else if (id === 2) {
      // Mission 2: Baggage Rush
      player.setPosition(0, 0, 48, Math.PI);
      tug.setPosition(0, 0, 40, Math.PI);
      aircraft.setPosition(-25, 0, -10);

      this.activeSteps = [
        {
          text: 'Enter the Baggage Tug',
          targetPos: tug.getPosition().clone(),
          targetRadius: 3.5,
          actionRequired: 'enter_vehicle',
          promptText: 'Press [E] to drive Tug'
        },
        {
          text: 'Drive to Terminal Baggage Sorting Depot',
          targetPos: world.baggageDepotPos.clone(),
          targetRadius: 5.5,
          actionRequired: 'interact',
          promptText: 'Press [E] to load passenger luggage'
        },
        {
          text: 'Deliver luggage to Flight 101 at Stand A1',
          targetPos: aircraft.cargoDoorPos.clone(),
          targetRadius: 5.5,
          actionRequired: 'interact',
          promptText: 'Press [E] to unload luggage to aircraft hold'
        }
      ];
    } else if (id === 3) {
      // Mission 3: Flight 102 Marshalling
      player.setPosition(15, 0, 5); // Near Stand A2
      aircraft.setPosition(15, 0, -55); // Taxiing in from taxiway

      this.activeSteps = [
        {
          text: 'Walk to Stand A2 marshalling guide pad',
          targetPos: new THREE.Vector3(15, 0, 2),
          targetRadius: 2.5,
          actionRequired: 'interact',
          promptText: 'Press [E] to equip marshalling wands'
        },
        {
          text: 'Beckon aircraft forward with wands until stop line',
          targetPos: new THREE.Vector3(15, 0, 2),
          targetRadius: 3.5,
          actionRequired: 'reach_location'
        },
        {
          text: 'STOP! Cross wands overhead as wheels hit red bar!',
          targetPos: new THREE.Vector3(15, 0, 2),
          targetRadius: 3.5,
          actionRequired: 'marshall_stop',
          promptText: 'Press [SPACE] or tap STOP SIGNAL!'
        }
      ];
    } else if (id === 4) {
      // Mission 4: Cargo Loader Express
      player.setPosition(-48, 0, -28, Math.PI);
      cargoLoader.setPosition(-50, 0, -32, Math.PI);
      aircraft.setPosition(-25, 0, -10);
      aircraft.openCargoDoor();

      this.activeSteps = [
        {
          text: 'Enter the Main Deck Cargo Loader',
          targetPos: cargoLoader.getPosition().clone(),
          targetRadius: 3.5,
          actionRequired: 'enter_vehicle',
          promptText: 'Press [E] to drive Cargo Loader'
        },
        {
          text: 'Position Cargo Loader at Stand A1 cargo door',
          targetPos: aircraft.cargoDoorPos.clone().add(new THREE.Vector3(2.5, 0, 0)),
          targetRadius: 4.5,
          actionRequired: 'reach_location'
        },
        {
          text: 'Raise scissor lift platform to cargo door',
          targetPos: aircraft.cargoDoorPos.clone().add(new THREE.Vector3(2.5, 0, 0)),
          targetRadius: 5.5,
          actionRequired: 'interact',
          promptText: 'Press [E] to raise hydraulic lift'
        },
        {
          text: 'Transfer ULD container into plane hold & lower lift',
          targetPos: aircraft.cargoDoorPos.clone().add(new THREE.Vector3(2.5, 0, 0)),
          targetRadius: 5.5,
          actionRequired: 'interact',
          promptText: 'Press [E] to transfer cargo container'
        }
      ];
    } else if (id === 5) {
      // Mission 5: Aviation Fuel Delivery
      player.setPosition(42, 0, 28, Math.PI);
      fuelTruck.setPosition(45, 0, 32, Math.PI);
      aircraft.setPosition(-25, 0, -10);

      this.activeSteps = [
        {
          text: 'Enter the Jet-A1 Fuel Tanker Truck',
          targetPos: fuelTruck.getPosition().clone(),
          targetRadius: 3.5,
          actionRequired: 'enter_vehicle',
          promptText: 'Press [E] to drive Fuel Truck'
        },
        {
          text: 'Drive fuel truck to Stand A1 right wing fuel port',
          targetPos: aircraft.wingFuelPort.clone().add(new THREE.Vector3(2, 0, 3)),
          targetRadius: 5.5,
          actionRequired: 'reach_location'
        },
        {
          text: 'Connect aviation fuel hose to wing port',
          targetPos: aircraft.wingFuelPort.clone(),
          targetRadius: 4.5,
          actionRequired: 'interact',
          promptText: 'Press [E] to connect fuel hose'
        },
        {
          text: 'Pump fuel to 100% capacity',
          targetPos: aircraft.wingFuelPort.clone(),
          targetRadius: 4.5,
          actionRequired: 'interact',
          promptText: 'Hold [E] to pump aviation fuel'
        },
        {
          text: 'Disconnect hose & stow safely',
          targetPos: aircraft.wingFuelPort.clone(),
          targetRadius: 4.5,
          actionRequired: 'interact',
          promptText: 'Press [E] to disconnect hose'
        }
      ];
    } else if (id === 6) {
      // Mission 6: Express Turnaround (Timed)
      player.setPosition(0, 0, 48, Math.PI);
      tug.setPosition(0, 0, 40, Math.PI);
      aircraft.setPosition(-25, 0, -10);
      aircraft.openCargoDoor();

      this.activeSteps = [
        {
          text: 'Enter Baggage Tug and speed to Depot',
          targetPos: tug.getPosition().clone(),
          targetRadius: 3.5,
          actionRequired: 'enter_vehicle'
        },
        {
          text: 'Load passenger luggage at Baggage Depot',
          targetPos: world.baggageDepotPos.clone(),
          targetRadius: 5.5,
          actionRequired: 'interact',
          promptText: 'Press [E] to load bags'
        },
        {
          text: 'Deliver luggage to Flight 101 cargo door',
          targetPos: aircraft.cargoDoorPos.clone(),
          targetRadius: 5.5,
          actionRequired: 'interact',
          promptText: 'Press [E] to unload bags'
        }
      ];
    } else if (id === 7) {
      // Mission 7: Busy Ramp Shift
      player.setPosition(-25, 0, 5);
      aircraft.setPosition(-25, 0, -45); // Coming into A1

      this.activeSteps = [
        {
          text: 'Take position at Stand A1 marshalling point',
          targetPos: new THREE.Vector3(-25, 0, 2),
          targetRadius: 3.0,
          actionRequired: 'interact',
          promptText: 'Press [E] to marshall Flight 204'
        },
        {
          text: 'Guide plane and STOP on red mark!',
          targetPos: new THREE.Vector3(-25, 0, 2),
          targetRadius: 3.5,
          actionRequired: 'marshall_stop',
          promptText: 'Press [SPACE] to STOP aircraft'
        },
        {
          text: 'Drive Baggage Tug to Stand A1',
          targetPos: tug.getPosition().clone(),
          targetRadius: 3.5,
          actionRequired: 'enter_vehicle'
        },
        {
          text: 'Complete luggage delivery to Stand A1',
          targetPos: aircraft.cargoDoorPos.clone(),
          targetRadius: 5.5,
          actionRequired: 'interact'
        }
      ];
    } else {
      // Mission 8: Airport Master Turnaround
      player.setPosition(0, 0, 48, Math.PI);
      tug.setPosition(0, 0, 40, Math.PI);
      aircraft.setPosition(-25, 0, -10);

      this.activeSteps = [
        {
          text: 'Load baggage at Depot and deliver to Stand A1',
          targetPos: world.baggageDepotPos.clone(),
          targetRadius: 5.5,
          actionRequired: 'interact',
          promptText: 'Press [E] to load baggage'
        },
        {
          text: 'Deliver baggage to Stand A1 aircraft',
          targetPos: aircraft.cargoDoorPos.clone(),
          targetRadius: 5.5,
          actionRequired: 'interact',
          promptText: 'Press [E] to unload baggage'
        },
        {
          text: 'Complete aircraft turnaround service',
          targetPos: world.stands['A1'].position.clone(),
          targetRadius: 6.0,
          actionRequired: 'reach_location'
        }
      ];
    }
  }

  public getCurrentStep(): MissionStep | null {
    if (!this.isMissionActive || this.currentStepIndex >= this.activeSteps.length) {
      return null;
    }
    return this.activeSteps[this.currentStepIndex];
  }

  public advanceStep(audio: AudioManager) {
    audio.playInteract();
    this.currentStepIndex++;
    if (this.currentStepIndex >= this.activeSteps.length) {
      this.completeMission(audio);
    } else {
      this.updateMarker();
    }
  }

  public completeMission(audio: AudioManager) {
    this.isMissionActive = false;
    this.markerGroup.visible = false;
    audio.playSuccess();
  }

  public updateMarker() {
    const step = this.getCurrentStep();
    if (!step) {
      this.markerGroup.visible = false;
      return;
    }
    this.markerGroup.visible = true;
    this.markerGroup.position.set(step.targetPos.x, 0.05, step.targetPos.z);
    this.markerRing.scale.set(step.targetRadius / 2.5, step.targetRadius / 2.5, 1);

    // Update floating 3D billboard sign
    if (this.markerSprite) {
      this.markerGroup.remove(this.markerSprite);
      this.markerSprite.geometry.dispose();
      this.markerSprite = null;
    }

    let signText = '📍 OBJECTIVE DESTINATION';
    if (step.text.toLowerCase().includes('stand a1')) signText = '📍 STAND A1 (PARKING SPOT)';
    else if (step.text.toLowerCase().includes('stand a2')) signText = '📍 STAND A2 (GATE)';
    else if (step.text.toLowerCase().includes('baggage')) signText = '🧳 BAGGAGE SORT DEPOT';
    else if (step.text.toLowerCase().includes('cargo')) signText = '📦 CARGO HIGH-LOADER';
    else if (step.text.toLowerCase().includes('fuel')) signText = '⛽ JET-A1 FUEL DEPOT';
    else if (step.text.toLowerCase().includes('tug')) signText = '🚜 BAGGAGE TUG VEHICLE';

    this.markerSprite = this.createTextSprite(signText);
    this.markerGroup.add(this.markerSprite);
  }

  public update(delta: number): boolean {
    if (!this.isMissionActive) return false;

    // Timer countdown
    if (this.missionTimeLeft > 0) {
      this.missionTimeLeft -= delta;
      if (this.missionTimeLeft <= 0) {
        this.missionTimeLeft = 0;
        this.isMissionActive = false;
        return false; // Time expired
      }
    }

    // Animate marker beacon, ripple ring, and crystal arrow
    this.markerTime += delta;

    // Floating diamond crystal rotation and bounce
    this.markerArrow.position.y = 4.2 + Math.sin(this.markerTime * 3.5) * 0.45;
    this.markerArrow.rotation.y += 2.0 * delta;
    this.markerArrow.rotation.x = Math.sin(this.markerTime * 2.0) * 0.2;

    // Ripple shockwave ring expanding and fading
    const rippleProgress = (this.markerTime % 1.6) / 1.6;
    const rippleScale = 1.0 + rippleProgress * 3.5;
    this.markerRipple.scale.set(rippleScale, rippleScale, 1);
    (this.markerRipple.material as THREE.MeshBasicMaterial).opacity = (1 - rippleProgress) * 0.9;

    // Sky beam gentle pulse
    const beamPulse = (Math.sin(this.markerTime * 4.0) + 1) * 0.5;
    (this.markerBeam.material as THREE.MeshBasicMaterial).opacity = 0.35 + beamPulse * 0.3;

    return true;
  }
}
