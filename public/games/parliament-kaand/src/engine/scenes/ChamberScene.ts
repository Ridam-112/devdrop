import * as THREE from 'three';
import { BaseScene } from './BaseScene';
import { ParliamentEnvironment } from '../../environment/ParliamentEnvironment';
import { InspectionCamera } from '../../camera/InspectionCamera';
import { ThirdPersonCamera } from '../../camera/ThirdPersonCamera';
import { PlayerCharacter } from '../../character/PlayerCharacter';
import { PlayerController } from '../../physics/PlayerController';
import { InteractionManager } from '../../interaction/InteractionManager';
import { PhysicsWorld } from '../../physics/PhysicsWorld';
import { PlayerRagdoll } from '../../physics/PlayerRagdoll';
import { PhysicsPropManager } from '../../physics/PhysicsPropManager';
import { PickupThrowSystem } from '../../physics/PickupThrowSystem';
import { CollisionEventSystem } from '../../physics/CollisionEventSystem';
import { PhysicsDebugViewer } from '../../physics/PhysicsDebugViewer';
import { useGameStore } from '../../store/useGameStore';
import { SoundManager } from '../../audio/SoundManager';
import { InspectionViewpoint } from '../../types/game';

interface Projectile {
  mesh: THREE.Mesh;
  velocity: THREE.Vector3;
  rotationSpeed: THREE.Vector3;
  lifetime: number;
}

export class ChamberScene extends BaseScene {
  public environment: ParliamentEnvironment;
  public inspectionCamera: InspectionCamera;
  public thirdPersonCamera: ThirdPersonCamera;

  // Phase 3 & 4: Player, Camera & Physics Systems
  public playerCharacter: PlayerCharacter;
  public playerController: PlayerController;
  public interactionManager: InteractionManager;

  public physicsWorld!: PhysicsWorld;
  public playerRagdoll!: PlayerRagdoll;
  public propManager!: PhysicsPropManager;
  public pickupThrowSystem!: PickupThrowSystem;
  public collisionEvents!: CollisionEventSystem;
  public debugViewer!: PhysicsDebugViewer;

  // Active camera mode
  public cameraMode: 'THIRD_PERSON' | 'INSPECTION' = 'THIRD_PERSON';

  // Chaos mechanics
  private projectiles: Projectile[] = [];
  private isGavelBanging = false;
  private gavelAngle = 0;
  private isPhysicsReady = false;

  constructor() {
    super();

    // 1. Initialize Cameras
    this.inspectionCamera = new InspectionCamera(50, window.innerWidth / window.innerHeight);
    this.thirdPersonCamera = new ThirdPersonCamera(55, window.innerWidth / window.innerHeight);
    this.camera = this.thirdPersonCamera.camera;

    // 2. Initialize Parliament Environment
    this.environment = new ParliamentEnvironment();

    // 3. Initialize Stylized MP Player Character & Controller
    this.playerCharacter = new PlayerCharacter();
    this.playerController = new PlayerController(this.playerCharacter);

    // 4. Initialize Interaction Manager
    this.interactionManager = new InteractionManager();
  }

  public async init(): Promise<void> {
    // 1. Fog & Scene Background
    this.scene.background = new THREE.Color(0x0a0f1d);
    this.scene.fog = new THREE.FogExp2(0x0a0f1d, 0.012);

    // 2. Add Complete Environment
    this.scene.add(this.environment.group);

    // 3. Add Player Character to Scene
    this.scene.add(this.playerCharacter.group);

    // 4. Position Third-Person Camera relative to Player Spawn Position
    this.thirdPersonCamera.resetToPlayer(this.playerController.position, this.playerController.facingAngle);

    // 5. Initialize Rapier 3D Physics World
    await PhysicsWorld.initRapier();
    this.physicsWorld = new PhysicsWorld({ x: 0, y: -18.0, z: 0 });

    // 6. Build Static Environment Colliders in Physics World
    this.buildStaticPhysicsColliders();

    // 7. Initialize Ragdoll System
    this.playerRagdoll = new PlayerRagdoll(this.physicsWorld, this.playerCharacter);
    this.playerRagdoll.onRecoveryComplete = (newPos) => {
      this.playerController.recoverFromRagdoll(newPos);
      this.thirdPersonCamera.resetToPlayer(this.playerController.position, this.playerController.facingAngle);
    };

    // 8. Initialize Dynamic Props Manager & Spawn Interactive Chamber Props
    this.propManager = new PhysicsPropManager(this.physicsWorld, this.scene);
    this.spawnChamberProps();

    // 9. Initialize Pickup and Throw System
    this.pickupThrowSystem = new PickupThrowSystem(this.physicsWorld, this.propManager, this.playerCharacter);

    // 10. Initialize Collision Events System
    this.collisionEvents = new CollisionEventSystem(this.physicsWorld);

    // 11. Initialize Physics Debug Wireframe Viewer
    this.debugViewer = new PhysicsDebugViewer(this.physicsWorld, this.scene);

    this.isPhysicsReady = true;

    // 12. Compute and store geometry stats for Dev HUD
    const stats = this.environment.getGeometryStats();
    useGameStore.getState().setEnvStats({
      triangles: stats.triangles + 1240,
      geometries: stats.geometries + 32,
    });

    // 13. Welcome Quorum Chime
    SoundManager.playChamberBell();

    // 14. Subscribe to viewpoint changes in store
    useGameStore.subscribe((state, prev) => {
      if (state.session.activeViewpoint !== prev.session.activeViewpoint) {
        if (this.cameraMode === 'INSPECTION') {
          this.inspectionCamera.setViewpoint(state.session.activeViewpoint);
        }
      }
    });
  }

  private buildStaticPhysicsColliders(): void {
    // 1. Chamber Floor
    this.physicsWorld.createStaticBox(new THREE.Vector3(0, -0.25, 0), new THREE.Vector3(40, 0.25, 40));

    // 2. Speaker Dais Elevated Platform (+1.2m)
    this.physicsWorld.createStaticBox(new THREE.Vector3(0, 0.6, -14.0), new THREE.Vector3(5.5, 0.6, 4.0));

    // 3. Table of the House
    this.physicsWorld.createStaticBox(new THREE.Vector3(0, 0.42, -3.5), new THREE.Vector3(3.0, 0.42, 1.5));

    // 4. Speaker Desk
    this.physicsWorld.createStaticBox(new THREE.Vector3(0, 1.6, -13.5), new THREE.Vector3(2.2, 0.4, 0.8));
  }

  private spawnChamberProps(): void {
    // Spawn interactive chairs on front rows (Treasury and Opposition)
    this.propManager.spawnChair(new THREE.Vector3(3.2, 0.0, 7.5), Math.PI * 0.9, true);
    this.propManager.spawnChair(new THREE.Vector3(5.2, 0.0, 8.2), Math.PI * 0.95, true);
    this.propManager.spawnChair(new THREE.Vector3(-3.2, 0.0, 7.5), Math.PI * 1.1, false);
    this.propManager.spawnChair(new THREE.Vector3(-5.2, 0.0, 8.2), Math.PI * 1.05, false);

    // Spawn Water Bottles near Table of House and on Desks
    this.propManager.spawnWaterBottle(new THREE.Vector3(-1.2, 0.95, -3.2));
    this.propManager.spawnWaterBottle(new THREE.Vector3(1.2, 0.95, -3.2));
    this.propManager.spawnWaterBottle(new THREE.Vector3(2.8, 0.2, 6.8));
    this.propManager.spawnWaterBottle(new THREE.Vector3(-2.8, 0.2, 6.8));

    // Spawn Official Bill Dossiers / Files
    this.propManager.spawnFileDossier(new THREE.Vector3(-0.6, 0.88, -3.5), 0.1);
    this.propManager.spawnFileDossier(new THREE.Vector3(0.6, 0.88, -3.5), -0.15);
    this.propManager.spawnFileDossier(new THREE.Vector3(3.0, 0.1, 7.0), 0.2);

    // Spawn Microphones
    this.propManager.spawnMicrophone(new THREE.Vector3(-0.9, 0.86, -3.3));
    this.propManager.spawnMicrophone(new THREE.Vector3(0.9, 0.86, -3.3));
  }

  public triggerRagdoll(impulse?: THREE.Vector3): void {
    if (!this.isPhysicsReady) return;
    this.playerController.isRagdollActive = true;
    this.playerRagdoll.activate(impulse);
  }

  public pickupOrDrop(): void {
    if (!this.isPhysicsReady) return;
    this.pickupThrowSystem.togglePickup(this.playerController.position, this.playerController.facingAngle);
  }

  public throwHeldObject(): void {
    if (!this.isPhysicsReady) return;
    const throwDir = this.thirdPersonCamera.camera.getWorldDirection(new THREE.Vector3());
    this.pickupThrowSystem.throwHeld(throwDir, 22.0);
  }

  public togglePhysicsDebug(): void {
    if (this.debugViewer) {
      this.debugViewer.toggle();
    }
  }

  public setCameraMode(mode: 'THIRD_PERSON' | 'INSPECTION'): void {
    this.cameraMode = mode;
    if (mode === 'THIRD_PERSON') {
      this.camera = this.thirdPersonCamera.camera;
      this.thirdPersonCamera.resetToPlayer(this.playerController.position, this.playerController.facingAngle);
    } else {
      this.camera = this.inspectionCamera.camera;
      this.inspectionCamera.setViewpoint(useGameStore.getState().session.activeViewpoint);
    }
  }

  public toggleCameraMode(): void {
    this.setCameraMode(this.cameraMode === 'THIRD_PERSON' ? 'INSPECTION' : 'THIRD_PERSON');
  }

  public setViewpoint(vp: InspectionViewpoint): void {
    if (this.cameraMode !== 'INSPECTION') {
      this.setCameraMode('INSPECTION');
    }
    this.inspectionCamera.setViewpoint(vp);
    useGameStore.getState().setViewpoint(vp);
  }

  public interact(): void {
    const success = this.interactionManager.triggerInteract();
    if (success) {
      this.playerController.animStateMachine.triggerInteract();
    }
  }

  public throwPaperProjectile(): void {
    SoundManager.playWhoosh();
    useGameStore.getState().incrementFlyingObjects();
    useGameStore.getState().addChaos(4);

    const planeGeo = new THREE.ConeGeometry(0.18, 0.6, 3);
    const planeMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.7,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(planeGeo, planeMat);

    const spawnPos = this.playerController.position
      .clone()
      .add(new THREE.Vector3(0, 1.4, 0))
      .add(
        new THREE.Vector3(
          Math.sin(this.playerController.facingAngle) * 0.8,
          0.1,
          Math.cos(this.playerController.facingAngle) * 0.8
        )
      );
    mesh.position.copy(spawnPos);

    const dir = this.cameraMode === 'THIRD_PERSON'
      ? this.thirdPersonCamera.camera.getWorldDirection(new THREE.Vector3())
      : new THREE.Vector3(
          Math.sin(this.playerController.facingAngle),
          0.25,
          Math.cos(this.playerController.facingAngle)
        ).normalize();

    const speed = 15 + Math.random() * 5;
    const velocity = dir.multiplyScalar(speed);

    this.scene.add(mesh);
    this.projectiles.push({
      mesh,
      velocity,
      rotationSpeed: new THREE.Vector3(Math.random() * 4, Math.random() * 5, Math.random() * 3),
      lifetime: 5.0,
    });

    this.playerController.animStateMachine.triggerInteract(0.4);
  }

  public bangSpeakerGavel(): void {
    if (this.isGavelBanging) return;
    this.isGavelBanging = true;
    this.gavelAngle = 0;
    SoundManager.playGavel();
    useGameStore.getState().adjustDecorum(12);

    // Gavel bang physical shockwave: shakes camera and jostles nearby props on dais
    if (this.collisionEvents) {
      this.collisionEvents.triggerDirectImpact(6.0);
    }
  }

  public thumpDesk(): void {
    SoundManager.playDeskThump();
    useGameStore.getState().addChaos(3);

    if (this.collisionEvents) {
      this.collisionEvents.triggerDirectImpact(4.0);
    }
  }

  public update(delta: number, _elapsed: number): void {
    // 1. Step Rapier 3D Physics Simulation
    if (this.isPhysicsReady) {
      this.physicsWorld.step(delta);

      // Collision events & camera shake
      this.collisionEvents.update(delta, (impact) => {
        if (impact.strength > 9.0 && !this.playerController.isRagdollActive) {
          // Strong collision knocks down player character into ragdoll!
          this.triggerRagdoll();
        }
      });

      // Update Ragdoll
      if (this.playerController.isRagdollActive) {
        this.playerRagdoll.update(delta);
      }

      // Update Pickup and Throw System
      this.pickupThrowSystem.update(delta, this.playerController.position, this.playerController.facingAngle);

      // Update Physics Debug Viewer
      this.debugViewer.update();
    }

    // 2. Update Player Controller & Third Person Camera
    if (this.cameraMode === 'THIRD_PERSON') {
      const shake = this.collisionEvents ? this.collisionEvents.cameraShakeIntensity : 0;
      this.playerController.update(delta, this.thirdPersonCamera.getYaw());

      // If ragdoll is active, camera tracks ragdoll pelvis body
      const cameraFollowPos = this.playerController.isRagdollActive && this.playerRagdoll
        ? new THREE.Vector3(
            this.playerRagdoll.pelvisBody.translation().x,
            this.playerRagdoll.pelvisBody.translation().y,
            this.playerRagdoll.pelvisBody.translation().z
          )
        : this.playerController.position;

      this.thirdPersonCamera.update(delta, cameraFollowPos, shake);
      this.interactionManager.update(delta, this.playerController.position);
    } else {
      this.inspectionCamera.update(delta);
    }

    // 3. Process Paper Projectiles
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      p.lifetime -= delta;

      p.velocity.y -= 7.5 * delta;
      p.velocity.x *= 0.985;
      p.velocity.z *= 0.985;

      p.mesh.position.addScaledVector(p.velocity, delta);
      p.mesh.rotation.x += p.rotationSpeed.x * delta;
      p.mesh.rotation.y += p.rotationSpeed.y * delta;
      p.mesh.rotation.z += p.rotationSpeed.z * delta;

      if (p.mesh.position.y < 0.1) {
        p.mesh.position.y = 0.1;
        p.velocity.set(0, 0, 0);
        p.rotationSpeed.set(0, 0, 0);
      }

      if (p.lifetime <= 0) {
        this.scene.remove(p.mesh);
        p.mesh.geometry.dispose();
        this.projectiles.splice(i, 1);
      }
    }

    // 4. Animate Gavel Bang
    if (this.isGavelBanging && this.environment.speakerPlatform.speakerDesk.gavelMesh) {
      this.gavelAngle += delta * 18;
      this.environment.speakerPlatform.speakerDesk.gavelMesh.rotation.x = Math.sin(this.gavelAngle) * 0.6;
      if (this.gavelAngle > Math.PI * 2) {
        this.isGavelBanging = false;
        this.environment.speakerPlatform.speakerDesk.gavelMesh.rotation.x = 0;
      }
    }
  }

  public onPointerDown(e: MouseEvent | TouchEvent): void {
    // If left click and holding an object, throw it!
    if ('button' in e && e.button === 0 && this.pickupThrowSystem?.heldProp) {
      this.throwHeldObject();
      return;
    }

    if (this.cameraMode === 'THIRD_PERSON') {
      this.thirdPersonCamera.onPointerDown(e);
    } else {
      this.inspectionCamera.onPointerDown(e);
    }
  }

  public onPointerMove(e: MouseEvent | TouchEvent): void {
    if (this.cameraMode === 'THIRD_PERSON') {
      this.thirdPersonCamera.onPointerMove(e);
    } else {
      const sens = useGameStore.getState().settings.cameraSensitivity;
      this.inspectionCamera.onPointerMove(e, sens);
    }
  }

  public onPointerUp(): void {
    if (this.cameraMode === 'THIRD_PERSON') {
      this.thirdPersonCamera.onPointerUp();
    } else {
      this.inspectionCamera.onPointerUp();
    }
  }

  public onWheel(deltaY: number): void {
    if (this.cameraMode === 'THIRD_PERSON') {
      this.thirdPersonCamera.onWheel(deltaY);
    } else {
      this.inspectionCamera.onWheel(deltaY);
    }
  }

  public onResize(width: number, height: number): void {
    this.thirdPersonCamera.onResize(width, height);
    this.inspectionCamera.onResize(width, height);
  }

  public onKeyDown(e: KeyboardEvent): void {
    // Ragdoll trigger test (Key K or Key R)
    if (e.code === 'KeyK' || e.code === 'KeyR') {
      this.triggerRagdoll();
      return;
    }

    // Pickup / Drop toggle (Key F)
    if (e.code === 'KeyF') {
      this.pickupOrDrop();
      return;
    }

    // Physics Debug Wireframe (F3)
    if (e.code === 'F3') {
      this.togglePhysicsDebug();
      return;
    }

    // Movement inputs
    if (e.code === 'KeyW' || e.code === 'ArrowUp') {
      this.playerController.setInput({ forward: true });
    } else if (e.code === 'KeyS' || e.code === 'ArrowDown') {
      this.playerController.setInput({ backward: true });
    } else if (e.code === 'KeyA' || e.code === 'ArrowLeft') {
      this.playerController.setInput({ left: true });
    } else if (e.code === 'KeyD' || e.code === 'ArrowRight') {
      this.playerController.setInput({ right: true });
    } else if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
      this.playerController.setSprinting(true);
    } else if (e.code === 'Space') {
      this.playerController.triggerJump();
    } else if (e.code === 'KeyC') {
      this.playerController.toggleCrouch();
    } else if (e.code === 'KeyE') {
      this.interact();
    } else if (e.code === 'KeyV') {
      this.toggleCameraMode();
    } else if (e.code === 'KeyG') {
      this.bangSpeakerGavel();
    } else if (e.code === 'KeyT') {
      this.thumpDesk();
    } else if (e.code === 'KeyP') {
      this.throwPaperProjectile();
    } else if (e.code === 'Digit1') {
      this.setViewpoint('OVERVIEW');
    } else if (e.code === 'Digit2') {
      this.setViewpoint('SPEAKER');
    } else if (e.code === 'Digit3') {
      this.setViewpoint('TREASURY');
    } else if (e.code === 'Digit4') {
      this.setViewpoint('OPPOSITION');
    } else if (e.code === 'Digit5') {
      this.setViewpoint('GALLERY');
    } else if (e.code === 'Digit6') {
      this.setViewpoint('ENTRANCE');
    }
  }

  public onKeyUp(e: KeyboardEvent): void {
    if (e.code === 'KeyW' || e.code === 'ArrowUp') {
      this.playerController.setInput({ forward: false });
    } else if (e.code === 'KeyS' || e.code === 'ArrowDown') {
      this.playerController.setInput({ backward: false });
    } else if (e.code === 'KeyA' || e.code === 'ArrowLeft') {
      this.playerController.setInput({ left: false });
    } else if (e.code === 'KeyD' || e.code === 'ArrowRight') {
      this.playerController.setInput({ right: false });
    } else if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
      this.playerController.setSprinting(false);
    }
  }

  public destroy(): void {
    this.projectiles.forEach((p) => {
      this.scene.remove(p.mesh);
      p.mesh.geometry.dispose();
    });
    this.projectiles = [];
    this.debugViewer?.destroy();
    this.propManager?.destroy();
    this.playerRagdoll?.destroy();
    this.physicsWorld?.destroy();
    this.playerCharacter.dispose();
    this.environment.dispose();
    this.scene.clear();
  }
}
