import * as THREE from 'three';

export abstract class BaseScene {
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;

  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 500);
  }

  public abstract init(): Promise<void> | void;
  public abstract update(delta: number, elapsed: number): void;
  public abstract destroy(): void;

  public onResize(width: number, height: number): void {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  public onPointerDown?(_e: MouseEvent | TouchEvent): void;
  public onPointerMove?(_e: MouseEvent | TouchEvent): void;
  public onPointerUp?(_e: MouseEvent | TouchEvent): void;
  public onWheel?(_deltaY: number): void;
  public onKeyDown?(_e: KeyboardEvent): void;
  public onKeyUp?(_e: KeyboardEvent): void;
}
