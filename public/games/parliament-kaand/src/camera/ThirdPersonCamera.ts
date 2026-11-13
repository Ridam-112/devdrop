import * as THREE from 'three';
import { useGameStore } from '../store/useGameStore';

export class ThirdPersonCamera {
  public camera: THREE.PerspectiveCamera;

  // Orbit angles & distance
  private yaw = 0;       // Horizontal rotation (rad)
  private pitch = 0.24;  // Vertical inclination (rad)
  private distance = 4.2;
  private targetDistance = 4.2;
  private minDistance = 1.6;
  private maxDistance = 7.5;

  // Smoothing
  private currentPosition = new THREE.Vector3();
  private currentLookAt = new THREE.Vector3();
  private smoothSpeed = 10.0;

  // Drag interaction
  private isPointerDown = false;
  private prevPointerX = 0;
  private prevPointerY = 0;

  // Environment collision bounding radius
  private chamberRadius = 36.8;

  constructor(fov = 55, aspect = window.innerWidth / window.innerHeight) {
    this.camera = new THREE.PerspectiveCamera(fov, aspect, 0.1, 500);
    this.camera.position.set(0, 3, 22);
  }

  public getYaw(): number {
    return this.yaw;
  }

  public setYaw(yaw: number): void {
    this.yaw = yaw;
  }

  public rotate(deltaX: number, deltaY: number, sensitivity = 1.0): void {
    const sens = 0.003 * sensitivity;
    this.yaw -= deltaX * sens;
    this.pitch += deltaY * sens;

    // Clamp pitch to avoid gimbal flipping or under-floor angles
    const minPitch = -0.35; // ~-20 degrees (looking slightly up)
    const maxPitch = 1.15;  // ~+66 degrees (high angle view)
    this.pitch = Math.max(minPitch, Math.min(maxPitch, this.pitch));
  }

  public zoom(deltaZoom: number): void {
    this.targetDistance = Math.max(
      this.minDistance,
      Math.min(this.maxDistance, this.targetDistance + deltaZoom * 0.003)
    );
  }

  public update(delta: number, playerPosition: THREE.Vector3, shakeIntensity = 0): void {
    // Smooth zoom distance
    this.distance = THREE.MathUtils.lerp(this.distance, this.targetDistance, delta * 8.0);

    // Target focus point (Upper chest / neck of player)
    const targetFocus = playerPosition.clone().add(new THREE.Vector3(0, 1.35, 0));

    // Calculate spherical offset based on yaw and pitch
    const horizontalDist = this.distance * Math.cos(this.pitch);
    const verticalDist = this.distance * Math.sin(this.pitch);

    const desiredOffset = new THREE.Vector3(
      Math.sin(this.yaw) * horizontalDist,
      verticalDist,
      Math.cos(this.yaw) * horizontalDist
    );

    let desiredPos = targetFocus.clone().add(desiredOffset);

    // Environment Collision Prevention
    // 1. Minimum height above chamber floor / dais
    const minHeightAboveGround = 0.4;
    if (desiredPos.y < minHeightAboveGround) {
      desiredPos.y = minHeightAboveGround;
    }

    // 2. Chamber Outer Wall Cylinder collision prevention
    const horizontalRadius = Math.sqrt(desiredPos.x * desiredPos.x + desiredPos.z * desiredPos.z);
    if (horizontalRadius > this.chamberRadius) {
      const angle = Math.atan2(desiredPos.x, desiredPos.z);
      desiredPos.x = Math.sin(angle) * this.chamberRadius;
      desiredPos.z = Math.cos(angle) * this.chamberRadius;
    }

    // Smooth position and look-at interpolation
    const lerpFactor = Math.min(1.0, delta * this.smoothSpeed);
    this.currentPosition.lerp(desiredPos, lerpFactor);
    this.currentLookAt.lerp(targetFocus, lerpFactor);

    this.camera.position.copy(this.currentPosition);
    if (shakeIntensity > 0) {
      const shakeAmt = shakeIntensity * 0.22;
      this.camera.position.x += (Math.random() - 0.5) * shakeAmt;
      this.camera.position.y += (Math.random() - 0.5) * shakeAmt;
      this.camera.position.z += (Math.random() - 0.5) * shakeAmt;
    }
    this.camera.lookAt(this.currentLookAt);
  }

  public onPointerDown(e: MouseEvent | TouchEvent): void {
    this.isPointerDown = true;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    this.prevPointerX = clientX;
    this.prevPointerY = clientY;
  }

  public onPointerMove(e: MouseEvent | TouchEvent): void {
    if (!this.isPointerDown) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const deltaX = clientX - this.prevPointerX;
    const deltaY = clientY - this.prevPointerY;
    this.prevPointerX = clientX;
    this.prevPointerY = clientY;

    const sens = useGameStore.getState().settings.cameraSensitivity;
    this.rotate(deltaX, deltaY, sens);
  }

  public onPointerUp(): void {
    this.isPointerDown = false;
  }

  public onWheel(deltaY: number): void {
    this.zoom(deltaY);
  }

  public onResize(width: number, height: number): void {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  public resetToPlayer(playerPosition: THREE.Vector3, playerFacingAngle: number): void {
    this.yaw = playerFacingAngle;
    this.pitch = 0.24;
    this.distance = 4.2;
    this.targetDistance = 4.2;

    const targetFocus = playerPosition.clone().add(new THREE.Vector3(0, 1.35, 0));
    const horizontalDist = this.distance * Math.cos(this.pitch);
    const verticalDist = this.distance * Math.sin(this.pitch);

    this.currentPosition.set(
      targetFocus.x + Math.sin(this.yaw) * horizontalDist,
      targetFocus.y + verticalDist,
      targetFocus.z + Math.cos(this.yaw) * horizontalDist
    );
    this.currentLookAt.copy(targetFocus);

    this.camera.position.copy(this.currentPosition);
    this.camera.lookAt(this.currentLookAt);
  }
}
