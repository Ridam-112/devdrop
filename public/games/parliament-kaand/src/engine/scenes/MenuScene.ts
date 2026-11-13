import * as THREE from 'three';
import { BaseScene } from './BaseScene';

export class MenuScene extends BaseScene {
  private particles: THREE.Points | null = null;
  private rotundaGroup: THREE.Group = new THREE.Group();
  private mouseTarget = { x: 0, y: 0 };
  private mouseCurrent = { x: 0, y: 0 };

  constructor() {
    super();
  }

  public init(): void {
    // 1. Scene Fog & Sky
    this.scene.background = new THREE.Color(0x0a0f1d);
    this.scene.fog = new THREE.FogExp2(0x0a0f1d, 0.025);

    // 2. Camera Setup
    this.camera.position.set(0, 3.5, 12);
    this.camera.lookAt(0, 2.2, 0);

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0xffedd5, 0.6);
    this.scene.add(ambientLight);

    // Golden Chandelier Center Spotlight
    const mainSpot = new THREE.SpotLight(0xf59e0b, 3.5);
    mainSpot.position.set(0, 14, 0);
    mainSpot.angle = Math.PI / 3;
    mainSpot.penumbra = 0.6;
    mainSpot.castShadow = true;
    this.scene.add(mainSpot);

    // Back rim light (Saffron tint)
    const rimLight = new THREE.DirectionalLight(0xf97316, 1.2);
    rimLight.position.set(-6, 8, -6);
    this.scene.add(rimLight);

    // Fill blue light
    const fillLight = new THREE.PointLight(0x38bdf8, 1.0, 25);
    fillLight.position.set(6, 4, 4);
    this.scene.add(fillLight);

    // 4. Grand Rotunda Geometry
    this.buildRotunda();
    this.scene.add(this.rotundaGroup);

    // 5. Floating Dust & Sparkle Particles
    this.buildAtmosphericParticles();
  }

  private buildRotunda(): void {
    // Polished Circular Marble Dais
    const floorGeo = new THREE.CylinderGeometry(14, 14.5, 0.8, 36);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.15,
      metalness: 0.35,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.position.y = -0.4;
    floor.receiveShadow = true;
    this.rotundaGroup.add(floor);

    // Inner Green Carpet Ring
    const carpetGeo = new THREE.CylinderGeometry(8.5, 8.5, 0.82, 32);
    const carpetMat = new THREE.MeshStandardMaterial({
      color: 0x065f46,
      roughness: 0.85,
    });
    const carpet = new THREE.Mesh(carpetGeo, carpetMat);
    carpet.position.y = -0.38;
    this.rotundaGroup.add(carpet);

    // Center Gold Emblem Base
    const emblemGeo = new THREE.CylinderGeometry(2.5, 2.5, 0.85, 24);
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      metalness: 0.85,
      roughness: 0.25,
    });
    const emblem = new THREE.Mesh(emblemGeo, goldMat);
    emblem.position.y = -0.36;
    this.rotundaGroup.add(emblem);

    // Classical Parliament Pillars (12 Sandstone Columns)
    const columnCount = 12;
    const radius = 11;
    const colGeo = new THREE.CylinderGeometry(0.55, 0.65, 12, 16);
    const colMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.4,
    });

    const capGeo = new THREE.BoxGeometry(1.6, 0.4, 1.6);

    for (let i = 0; i < columnCount; i++) {
      const angle = (i / columnCount) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      const colMesh = new THREE.Mesh(colGeo, colMat);
      colMesh.position.set(x, 5.5, z);
      colMesh.castShadow = true;
      colMesh.receiveShadow = true;

      // Base & Capital
      const base = new THREE.Mesh(capGeo, colMat);
      base.position.set(x, 0.2, z);
      const cap = new THREE.Mesh(capGeo, colMat);
      cap.position.set(x, 11.2, z);

      this.rotundaGroup.add(colMesh, base, cap);
    }

    // Grand Architrave Ring
    const ringGeo = new THREE.TorusGeometry(radius, 0.65, 12, 36);
    const ringMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.35 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 11.6;
    this.rotundaGroup.add(ring);

    // Center Speaker's Throne Replica in background
    this.buildThronePlaceholder();
  }

  private buildThronePlaceholder(): void {
    const throneGroup = new THREE.Group();
    throneGroup.position.set(0, 0, -5.5);

    // Dais Steps
    [1.8, 1.4, 1.0].forEach((w, idx) => {
      const stepGeo = new THREE.CylinderGeometry(w, w + 0.2, 0.25, 16);
      const stepMat = new THREE.MeshStandardMaterial({ color: 0x881337, roughness: 0.7 });
      const step = new THREE.Mesh(stepGeo, stepMat);
      step.position.y = idx * 0.25 + 0.125;
      throneGroup.add(step);
    });

    // High Carved Backrest
    const backGeo = new THREE.BoxGeometry(1.2, 2.6, 0.25);
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xb45309, metalness: 0.6, roughness: 0.3 });
    const back = new THREE.Mesh(backGeo, goldMat);
    back.position.set(0, 2.0, -0.2);
    throneGroup.add(back);

    // Cushion
    const cushionGeo = new THREE.BoxGeometry(1.0, 0.3, 0.8);
    const velvetMat = new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.8 });
    const cushion = new THREE.Mesh(cushionGeo, velvetMat);
    cushion.position.set(0, 1.0, 0.1);
    throneGroup.add(cushion);

    // Large Golden Gavel on cushion
    const handleGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.9, 8);
    const headGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.45, 12);
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.3 });
    const handle = new THREE.Mesh(handleGeo, woodMat);
    handle.rotation.z = Math.PI / 3;
    handle.position.set(0, 1.25, 0.1);

    const head = new THREE.Mesh(headGeo, woodMat);
    head.rotation.x = Math.PI / 2;
    head.position.set(-0.25, 1.4, 0.1);

    throneGroup.add(handle, head);
    this.rotundaGroup.add(throneGroup);
  }

  private buildAtmosphericParticles(): void {
    const particleCount = 200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 1] = Math.random() * 10 + 0.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 18;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0xfacc15,
      size: 0.12,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  public update(delta: number, elapsed: number): void {
    // Gentle cinematic rotunda rotation
    this.rotundaGroup.rotation.y = elapsed * 0.06;

    // Smooth mouse parallax
    this.mouseCurrent.x += (this.mouseTarget.x - this.mouseCurrent.x) * 0.05;
    this.mouseCurrent.y += (this.mouseTarget.y - this.mouseCurrent.y) * 0.05;

    this.camera.position.x = Math.sin(elapsed * 0.1) * 1.5 + this.mouseCurrent.x * 2.0;
    this.camera.position.y = 3.5 + Math.cos(elapsed * 0.12) * 0.4 - this.mouseCurrent.y * 1.0;
    this.camera.lookAt(0, 2.2, 0);

    // Animate floating dust motes
    if (this.particles) {
      const positions = this.particles.geometry.attributes.position.array as Float32Array;
      for (let i = 1; i < positions.length; i += 3) {
        positions[i] += Math.sin(elapsed + i) * 0.005;
        if (positions[i] > 11) positions[i] = 0.5;
      }
      this.particles.geometry.attributes.position.needsUpdate = true;
    }
  }

  public onPointerMove(e: MouseEvent | TouchEvent): void {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    this.mouseTarget.x = (clientX / window.innerWidth) * 2 - 1;
    this.mouseTarget.y = (clientY / window.innerHeight) * 2 - 1;
  }

  public destroy(): void {
    this.scene.clear();
  }
}
