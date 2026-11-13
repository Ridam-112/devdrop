import * as THREE from 'three';
import { InspectionViewpoint } from '../types/game';

interface ViewpointConfig {
  pos: THREE.Vector3;
  target: THREE.Vector3;
}

export class InspectionCamera {
  public camera: THREE.PerspectiveCamera;
  private currentTarget = new THREE.Vector3(0, 2.0, 0);
  private desiredTarget = new THREE.Vector3(0, 2.0, 0);
  private desiredPos = new THREE.Vector3(0, 11, 22);

  // Manual Orbit controls
  private isDragging = false;
  private prevPointer = { x: 0, y: 0 };
  private spherical = { radius: 24, theta: 0, phi: Math.PI / 3.4 };

  // Viewpoint Presets
  private presets: Record<InspectionViewpoint, ViewpointConfig> = {
    OVERVIEW: {
      pos: new THREE.Vector3(0, 12, 22),
      target: new THREE.Vector3(0, 2.5, -3),
    },
    SPEAKER: {
      pos: new THREE.Vector3(0, 3.2, -3.5),
      target: new THREE.Vector3(0, 2.4, -8.5),
    },
    TREASURY: {
      pos: new THREE.Vector3(7, 3.8, -1),
      target: new THREE.Vector3(-6, 2.0, 1),
    },
    OPPOSITION: {
      pos: new THREE.Vector3(-7, 3.8, -1),
      target: new THREE.Vector3(6, 2.0, 1),
    },
    GALLERY: {
      pos: new THREE.Vector3(0, 8.5, 17),
      target: new THREE.Vector3(0, 1.5, -4),
    },
    ENTRANCE: {
      pos: new THREE.Vector3(0, 3.2, 16.5),
      target: new THREE.Vector3(0, 3.2, 0),
    },
  };

  private activePreset: InspectionViewpoint = 'OVERVIEW';

  constructor(fov = 50, aspect = 16 / 9) {
    this.camera = new THREE.PerspectiveCamera(fov, aspect, 0.1, 500);
    this.setViewpoint('OVERVIEW');
    this.camera.position.copy(this.desiredPos);
    this.currentTarget.copy(this.desiredTarget);
    this.camera.lookAt(this.currentTarget);
  }

  public setViewpoint(vp: InspectionViewpoint): void {
    this.activePreset = vp;
    const config = this.presets[vp];
    if (config) {
      this.desiredPos.copy(config.pos);
      this.desiredTarget.copy(config.target);

      // Recalculate spherical for smooth manual orbit resumption
      const offset = this.desiredPos.clone().sub(this.desiredTarget);
      this.spherical.radius = offset.length();
      this.spherical.theta = Math.atan2(offset.x, offset.z);
      this.spherical.phi = Math.acos(Math.max(-1, Math.min(1, offset.y / this.spherical.radius)));
    }
  }

  public update(delta: number): void {
    if (this.isDragging) {
      // Manual spherical positioning
      this.spherical.phi = Math.max(0.1, Math.min(Math.PI / 2.05, this.spherical.phi));
      this.spherical.radius = Math.max(4, Math.min(38, this.spherical.radius));

      const x = this.spherical.radius * Math.sin(this.spherical.phi) * Math.sin(this.spherical.theta);
      const y = this.spherical.radius * Math.cos(this.spherical.phi);
      const z = this.spherical.radius * Math.sin(this.spherical.phi) * Math.cos(this.spherical.theta);

      this.desiredPos.set(
        this.desiredTarget.x + x,
        this.desiredTarget.y + y,
        this.desiredTarget.z + z
      );
    }

    // Smooth Lerp transitions
    const lerpSpeed = 5.0 * delta;
    this.camera.position.lerp(this.desiredPos, lerpSpeed);
    this.currentTarget.lerp(this.desiredTarget, lerpSpeed);
    this.camera.lookAt(this.currentTarget);
  }

  public onPointerDown(e: MouseEvent | TouchEvent): void {
    this.isDragging = true;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    this.prevPointer = { x: clientX, y: clientY };
  }

  public onPointerMove(e: MouseEvent | TouchEvent, sensitivity = 1.0): void {
    if (!this.isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const dx = clientX - this.prevPointer.x;
    const dy = clientY - this.prevPointer.y;

    this.spherical.theta -= dx * sensitivity * 0.005;
    this.spherical.phi -= dy * sensitivity * 0.005;

    this.prevPointer = { x: clientX, y: clientY };
  }

  public onPointerUp(): void {
    this.isDragging = false;
  }

  public onWheel(deltaY: number): void {
    this.spherical.radius += deltaY * 0.02;
    this.spherical.radius = Math.max(4, Math.min(38, this.spherical.radius));
  }

  public onResize(width: number, height: number): void {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }
}
