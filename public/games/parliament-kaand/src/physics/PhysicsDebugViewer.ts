import * as THREE from 'three';
import { PhysicsWorld } from './PhysicsWorld';

export class PhysicsDebugViewer {
  private physicsWorld: PhysicsWorld;
  private scene: THREE.Scene;

  public enabled = false;
  private lines: THREE.LineSegments | null = null;
  private geometry: THREE.BufferGeometry | null = null;
  private material: THREE.LineBasicMaterial | null = null;

  constructor(physicsWorld: PhysicsWorld, scene: THREE.Scene) {
    this.physicsWorld = physicsWorld;
    this.scene = scene;
  }

  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    if (this.lines) {
      this.lines.visible = enabled;
    }
  }

  public toggle(): boolean {
    this.setEnabled(!this.enabled);
    return this.enabled;
  }

  public update(): void {
    if (!this.enabled) return;

    const { vertices, colors } = this.physicsWorld.getDebugBuffers();

    if (!this.lines) {
      this.geometry = new THREE.BufferGeometry();
      this.geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
      this.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 4));

      this.material = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        depthTest: false,
      });

      this.lines = new THREE.LineSegments(this.geometry, this.material);
      this.lines.renderOrder = 999;
      this.scene.add(this.lines);
    } else if (this.geometry) {
      this.geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
      this.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 4));
    }
  }

  public destroy(): void {
    if (this.lines) {
      this.scene.remove(this.lines);
      this.geometry?.dispose();
      this.material?.dispose();
      this.lines = null;
    }
  }
}
