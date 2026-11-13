import * as THREE from 'three';

export type CameraMode = 'third_person' | 'top_down';

export class CameraController {
  public camera: THREE.PerspectiveCamera;
  public mode: CameraMode = 'third_person';

  // Orbit / Look angles
  public yaw: number = Math.PI; // Face towards airport apron (-Z)
  public pitch: number = 0.32; // Elevation angle (radians)
  public distance: number = 9.8;

  private userControlled: boolean = false;
  private idleTime: number = 0;

  private targetPosition: THREE.Vector3 = new THREE.Vector3();
  private targetLookAt: THREE.Vector3 = new THREE.Vector3();
  private currentLookAt: THREE.Vector3 = new THREE.Vector3();

  constructor() {
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 15, 25);
  }

  public resize(width: number, height: number) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  public cycleMode() {
    if (this.mode === 'third_person') {
      this.mode = 'top_down';
    } else {
      this.mode = 'third_person';
    }
  }

  public update(
    targetObj: THREE.Object3D,
    isVehicle: boolean,
    delta: number,
    isMarshalling: boolean = false,
    lookDelta: { x: number; y: number } = { x: 0, y: 0 }
  ) {
    const targetPos = targetObj.position;
    const targetRotation = targetObj.rotation.y;

    if (isMarshalling) {
      // Cinematic angle directly behind marshaller looking at incoming plane
      this.targetPosition.set(targetPos.x, targetPos.y + 2.4, targetPos.z + 4.2);
      this.targetLookAt.set(targetPos.x, targetPos.y + 2.8, targetPos.z - 40.0);
    } else if (this.mode === 'top_down') {
      this.targetPosition.set(targetPos.x, targetPos.y + 36, targetPos.z);
      this.targetLookAt.copy(targetPos);
    } else {
      // 3rd Person Orbit Camera
      this.distance = isVehicle ? 9.8 : 5.8;

      // Handle user mouse/touch look input
      if (Math.abs(lookDelta.x) > 0.01 || Math.abs(lookDelta.y) > 0.01) {
        this.yaw -= lookDelta.x * 0.0055;
        this.pitch = Math.max(-0.05, Math.min(1.2, this.pitch + lookDelta.y * 0.0055));
        this.userControlled = true;
        this.idleTime = 0;
      } else {
        this.idleTime += delta;
      }

      // Auto-realign camera behind vehicle if driving and no recent user look input
      if (isVehicle) {
        if (!this.userControlled || this.idleTime > 1.8) {
          const targetYaw = targetRotation;
          let diff = targetYaw - this.yaw;
          while (diff < -Math.PI) diff += Math.PI * 2;
          while (diff > Math.PI) diff -= Math.PI * 2;
          this.yaw += diff * Math.min(1, 3.5 * delta);
        }
      } else {
        // When on foot, maintain gentle follow
        if (!this.userControlled) {
          this.yaw = Math.PI;
          this.pitch = 0.35;
        }
      }

      // Calculate camera position in sphere orbit around target
      const hDist = this.distance * Math.cos(this.pitch);
      const vDist = this.distance * Math.sin(this.pitch);

      const camX = targetPos.x - Math.sin(this.yaw) * hDist;
      const camZ = targetPos.z - Math.cos(this.yaw) * hDist;
      const camY = targetPos.y + Math.max(1.5, vDist + (isVehicle ? 1.5 : 1.0));

      this.targetPosition.set(camX, camY, camZ);
      this.targetLookAt.set(
        targetPos.x,
        targetPos.y + (isVehicle ? 1.5 : 1.2),
        targetPos.z
      );
    }

    // Smooth camera damping
    const lerpFactor = Math.min(1, delta * (isVehicle ? 6.5 : 9.0));
    this.camera.position.lerp(this.targetPosition, lerpFactor);
    this.currentLookAt.lerp(this.targetLookAt, lerpFactor);
    this.camera.lookAt(this.currentLookAt);
  }
}
