import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';
import { PlayerScooter3D } from './PlayerScooter3D';
import { Obstacles3D, Obstacle3DEntity } from './Obstacles3D';
import { AudioManager } from '../systems/AudioManager';
import { GameStateManager } from '../game/GameState';

export interface CollisionEventResult {
  obstacle: Obstacle3DEntity;
  contactPoint: THREE.Vector3;
  colliderType: 'FRONT_WHEEL' | 'REAR_WHEEL' | 'CHASSIS';
}

export class Physics3D {
  public rapierReady: boolean = false;
  public world!: RAPIER.World;
  public scene: THREE.Scene;
  public scooter: PlayerScooter3D;
  public obstacles: Obstacles3D;
  public audio: AudioManager;

  // Collision Debug Wireframe Overlay
  public debugMode: boolean = false;
  private debugGroup: THREE.Group;
  private frontWheelDebugMesh!: THREE.Mesh;
  private rearWheelDebugMesh!: THREE.Mesh;
  private chassisDebugMesh!: THREE.Mesh;
  private obstacleDebugMeshes: Map<number, THREE.Mesh> = new Map();

  // Screen camera shake callback
  public onCameraShake?: (durationMs: number, intensity: number) => void;
  public onCollisionOccurred?: (obs: Obstacle3DEntity) => void;

  constructor(scene: THREE.Scene, scooter: PlayerScooter3D, obstacles: Obstacles3D) {
    this.scene = scene;
    this.scooter = scooter;
    this.obstacles = obstacles;
    this.audio = AudioManager.getInstance();

    this.debugGroup = new THREE.Group();
    this.debugGroup.visible = false;
    this.scene.add(this.debugGroup);

    this.initRapier();
  }

  public async initRapier(): Promise<void> {
    try {
      await RAPIER.init();
      const gravity = { x: 0.0, y: -9.81, z: 0.0 };
      this.world = new RAPIER.World(gravity);
      this.rapierReady = true;

      this.buildDebugVisualizers();
      console.log('✅ Rapier 3D Physics successfully initialized.');
    } catch (e) {
      console.warn('Rapier 3D init note: using high-precision geometric fallback.', e);
      this.buildDebugVisualizers();
    }
  }

  private buildDebugVisualizers(): void {
    const greenLineMat = new THREE.MeshBasicMaterial({ color: 0x22c55e, wireframe: true });
    const blueLineMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true });

    // 1. Front Wheel Wireframe
    const fWheelGeo = new THREE.SphereGeometry(this.scooter.wheelRadius, 8, 8);
    this.frontWheelDebugMesh = new THREE.Mesh(fWheelGeo, greenLineMat);
    this.debugGroup.add(this.frontWheelDebugMesh);

    // 2. Rear Wheel Wireframe
    const rWheelGeo = new THREE.SphereGeometry(this.scooter.wheelRadius, 8, 8);
    this.rearWheelDebugMesh = new THREE.Mesh(rWheelGeo, greenLineMat);
    this.debugGroup.add(this.rearWheelDebugMesh);

    // 3. Chassis Wireframe Box
    const chassisGeo = new THREE.BoxGeometry(0.64, 0.9, 1.3);
    this.chassisDebugMesh = new THREE.Mesh(chassisGeo, blueLineMat);
    this.debugGroup.add(this.chassisDebugMesh);
  }

  public toggleDebugMode(): boolean {
    this.debugMode = !this.debugMode;
    this.debugGroup.visible = this.debugMode;
    return this.debugMode;
  }

  // Reusable scratch vectors to avoid GC pauses
  private static _frontWheelWorldPos = new THREE.Vector3();
  private static _rearWheelWorldPos = new THREE.Vector3();
  private static _chassisWorldPos = new THREE.Vector3();

  /**
   * Evaluates exact wheel-level collision detection between scooter and obstacles
   */
  public update(): void {
    const state = GameStateManager.getInstance();

    // Calculate Exact 3D Positions of Front & Rear Wheel Contact Patches
    const scooterPos = this.scooter.position;
    const isAirborne = this.scooter.isAirborne;
    const jumpY = this.scooter.jumpHeight;

    // Reuse scratch vectors
    const frontWheelWorldPos = Physics3D._frontWheelWorldPos.set(
      scooterPos.x,
      jumpY + this.scooter.wheelRadius,
      scooterPos.z + this.scooter.frontWheelOffsetZ
    );

    const rearWheelWorldPos = Physics3D._rearWheelWorldPos.set(
      scooterPos.x,
      jumpY + this.scooter.wheelRadius,
      scooterPos.z + this.scooter.rearWheelOffsetZ
    );

    const chassisWorldPos = Physics3D._chassisWorldPos.set(
      scooterPos.x,
      jumpY + 0.65,
      scooterPos.z
    );

    // Update Debug Visualizer Transforms
    if (this.debugMode) {
      this.frontWheelDebugMesh.position.copy(frontWheelWorldPos);
      this.rearWheelDebugMesh.position.copy(rearWheelWorldPos);
      this.chassisDebugMesh.position.copy(chassisWorldPos);
      this.chassisDebugMesh.rotation.z = this.scooter.leanAngle;
    }

    // Check against active 3D obstacles
    for (const obs of this.obstacles.activeObstacles) {
      if (obs.hasCollided) continue;

      // Distance optimization: only check obstacles within 6 meters in Z
      const dz = Math.abs(scooterPos.z - obs.worldPos.z);
      if (dz > 6.0) continue;

      // Update / Create Obstacle Debug Wireframe
      if (this.debugMode && !this.obstacleDebugMeshes.has(obs.id)) {
        const obsWireMat = new THREE.MeshBasicMaterial({ color: 0xfacc15, wireframe: true });
        const obsWireGeo = new THREE.CylinderGeometry(obs.radius, obs.radius, 0.15, 12);
        const obsMesh = new THREE.Mesh(obsWireGeo, obsWireMat);
        obsMesh.position.copy(obs.worldPos);
        this.debugGroup.add(obsMesh);
        this.obstacleDebugMeshes.set(obs.id, obsMesh);
      }

      // === ACCURATE 3D COLLISION DETECTION ===
      // Rule 4: If scooter is airborne and jump height clears the hazard, NO DAMAGE!
      const isRoadSurfaceHazard = obs.type.includes('POTHOLE') || obs.type === 'OPEN_MANHOLE';

      if (isRoadSurfaceHazard && isAirborne && jumpY >= obs.requiredJumpHeight) {
        // Successfully jumped over pothole/manhole!
        continue;
      }

      // Check Front Wheel Contact (2D distance in X-Z ground plane to pothole center)
      const fDistXZ = Math.hypot(frontWheelWorldPos.x - obs.worldPos.x, frontWheelWorldPos.z - obs.worldPos.z);
      const rDistXZ = Math.hypot(rearWheelWorldPos.x - obs.worldPos.x, rearWheelWorldPos.z - obs.worldPos.z);

      // Contact threshold: Wheel radius (0.24m) + Pothole radius
      const collisionThreshold = obs.radius + 0.12; // Configurable physical tolerance

      let isCollision = false;
      let colliderType: 'FRONT_WHEEL' | 'REAR_WHEEL' | 'CHASSIS' = 'FRONT_WHEEL';
      let contactPos = frontWheelWorldPos;

      if (fDistXZ < collisionThreshold) {
        isCollision = true;
        colliderType = 'FRONT_WHEEL';
        contactPos = frontWheelWorldPos;
      } else if (rDistXZ < collisionThreshold) {
        isCollision = true;
        colliderType = 'REAR_WHEEL';
        contactPos = rearWheelWorldPos;
      } else if (!isRoadSurfaceHazard) {
        // Upright obstacles (Barricades, Trees): check chassis bounding volume
        const cDistXZ = Math.hypot(chassisWorldPos.x - obs.worldPos.x, chassisWorldPos.z - obs.worldPos.z);
        if (cDistXZ < obs.radius + 0.35) {
          isCollision = true;
          colliderType = 'CHASSIS';
          contactPos = chassisWorldPos;
        }
      }

      // === TRIGGER ACCURATE COLLISION REACTION ===
      if (isCollision) {
        obs.hasCollided = true; // Prevents multiple damage events from single crossing!

        if (this.debugMode) {
          const debugMesh = this.obstacleDebugMeshes.get(obs.id);
          if (debugMesh) {
            (debugMesh.material as THREE.MeshBasicMaterial).color.setHex(0xef4444); // Flash RED on contact!
          }
        }

        this.applyCollisionReaction(obs, state, contactPos, colliderType);
      }
    }
  }

  private applyCollisionReaction(
    obs: Obstacle3DEntity,
    state: GameStateManager,
    contactPos: THREE.Vector3,
    colliderType: string
  ): void {
    // 0. Handle Beneficial Street Chai Pickups
    if (obs.isPickup) {
      state.runStats.engineHealth = Math.min(100, state.runStats.engineHealth + 25);
      this.scooter.exhaustWaterLevel = 0; // Blows all water out of exhaust!
      this.scooter.currentSpeedKmh = Math.min(85, this.scooter.currentSpeedKmh + 15); // Nitro speed boost!
      this.audio.playChaiSlurp();
      obs.mesh.visible = false;
      if (this.onCollisionOccurred) this.onCollisionOccurred(obs);
      return;
    }

    // 1. Increment Run Stats
    state.runStats.potholesHit++;

    // 2. Velocity reduction
    this.scooter.currentSpeedKmh = Math.max(0, this.scooter.currentSpeedKmh - obs.speedPenalty);

    // 3. Condition / Health deduction
    state.runStats.engineHealth = Math.max(0, state.runStats.engineHealth - obs.damage);

    // 4. Scooter physical reaction: Suspension compression squash
    this.scooter.landingSquashTimer = 0.22;

    // 5. Sound & Camera Shake per obstacle type
    switch (obs.type) {
      case 'POTHOLE_SMALL':
      case 'POTHOLE_LARGE':
      case 'POTHOLE_WATER':
        this.audio.playImpactPothole();
        if (this.onCameraShake) this.onCameraShake(140, 0.08);
        break;

      case 'OPEN_MANHOLE':
        this.audio.playImpactManhole();
        if (this.onCameraShake) this.onCameraShake(300, 0.22);
        state.runStats.causeOfDeath = 'Swallowed by an Open Kolkata Manhole!';
        break;

      case 'BARRICADE':
        this.audio.playImpactBarricade();
        if (this.onCameraShake) this.onCameraShake(220, 0.15);
        state.runStats.causeOfDeath = 'Crashed into Kolkata Police Barricade!';
        break;

      case 'KOLKATA_BUS':
        this.audio.playBusHorn();
        this.audio.playConductorWhistle();
        this.audio.playImpactBarricade();
        if (this.onCameraShake) this.onCameraShake(350, 0.35);
        state.runStats.causeOfDeath = 'Crushed by a speeding Kolkata City Bus!';
        break;

      case 'BUS_WAVE':
        this.audio.playWaveCrash();
        // Massive lateral displacement wash!
        this.scooter.position.x = THREE.MathUtils.clamp(
          this.scooter.position.x + (obs.worldPos.x > 0 ? -2.4 : 2.4),
          -5.0,
          5.0
        );
        this.scooter.exhaustWaterLevel = Math.min(100, this.scooter.exhaustWaterLevel + 45);
        if (this.onCameraShake) this.onCameraShake(360, 0.32);
        state.runStats.causeOfDeath = 'Drowned by a Giant Kolkata Bus Tsunami Wave!';
        break;

      case 'AUTO_RICKSHAW':
        this.audio.playTaxiHorn();
        this.audio.playImpactBarricade();
        if (this.onCameraShake) this.onCameraShake(240, 0.2);
        state.runStats.causeOfDeath = 'Crashed by Erratic Kolkata Auto-Rickshaw!';
        break;

      case 'ELECTRIC_WIRE':
        this.audio.playElectricSpark();
        if (this.onCameraShake) this.onCameraShake(300, 0.28);
        state.runStats.causeOfDeath = 'Electrocuted by Snapped Street Cable!';
        break;

      case 'YELLOW_TAXI':
        this.audio.playTaxiHorn();
        this.audio.playImpactBarricade();
        if (this.onCameraShake) this.onCameraShake(220, 0.18);
        state.runStats.causeOfDeath = 'Rear-ended a Kolkata Ambassador Taxi!';
        break;

      case 'TRAFFIC_CONE':
      case 'FALLEN_BRANCH':
        this.audio.playWaterSplash(1.5);
        if (this.onCameraShake) this.onCameraShake(110, 0.06);
        break;
    }

    if (this.onCollisionOccurred) {
      this.onCollisionOccurred(obs);
    }
  }
}
