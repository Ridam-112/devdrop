import * as THREE from 'three';

export class ThreeCore {
  public renderer: THREE.WebGLRenderer;
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;

  // Lights
  public ambientLight: THREE.AmbientLight;
  public directionalLight: THREE.DirectionalLight;

  // Volumetric 3D Rain System (Falling Raindrops as Slanted Line Streaks)
  private rainGeometry!: THREE.BufferGeometry;
  private rainLines!: THREE.LineSegments;
  private rainCount = 2400;
  private rainVelocities: Float32Array = new Float32Array(this.rainCount);

  // Ground Raindrop Splash Rings (Ripples on Road Surface)
  private splashGeometry!: THREE.BufferGeometry;
  private splashPoints!: THREE.Points;
  private splashCount = 300;
  private splashLifetimes: Float32Array = new Float32Array(this.splashCount);

  // Stormy Kolkata Sky Dome
  private skyMesh!: THREE.Mesh;

  // Lightning Flash State
  private lightningTimer = 9.0;
  private lightningDuration = 0;
  private defaultBgColor = new THREE.Color(0x1e293b);
  private flashBgColor = new THREE.Color(0xcfd8dc);

  constructor(container: HTMLElement) {
    // 1. High-Performance WebGL Renderer with ACES Tone Mapping
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(1280, 720);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    // Attach canvas to container
    container.innerHTML = '';
    container.appendChild(this.renderer.domElement);

    // 2. Scene with Monsoon Atmosphere
    this.scene = new THREE.Scene();
    this.scene.background = this.defaultBgColor.clone();
    this.scene.fog = new THREE.FogExp2(0x1e293b, 0.0052);

    // 3. Perspective Camera (Third-Person Rear View)
    this.camera = new THREE.PerspectiveCamera(54, 1280 / 720, 0.1, 450);
    this.camera.position.set(0, 2.3, 5.2);
    this.camera.lookAt(0, 1.1, -16.0);

    // 4. Dramatic Monsoon Lighting Setup (High contrast, warm street glow vs cold rain)
    this.ambientLight = new THREE.AmbientLight(0x8da2b5, 1.35);
    this.scene.add(this.ambientLight);

    this.directionalLight = new THREE.DirectionalLight(0xf1f5f9, 1.7);
    this.directionalLight.position.set(14, 30, 10);
    this.directionalLight.castShadow = true;
    this.directionalLight.shadow.mapSize.width = 1024;
    this.directionalLight.shadow.mapSize.height = 1024;
    this.directionalLight.shadow.camera.near = 0.5;
    this.directionalLight.shadow.camera.far = 70;
    this.directionalLight.shadow.camera.left = -16;
    this.directionalLight.shadow.camera.right = 16;
    this.directionalLight.shadow.camera.top = 16;
    this.directionalLight.shadow.camera.bottom = -16;
    this.directionalLight.shadow.bias = -0.0004;
    this.scene.add(this.directionalLight);

    // 5. Build Storm Sky Dome
    this.buildSkyDome();

    // 6. Initialize 3D Volumetric Rain & Ground Splash Particles
    this.initVolumetricRain();
    this.initGroundSplashes();

    // 7. Handle Window Resize
    window.addEventListener('resize', () => this.onWindowResize());
    this.onWindowResize();
  }

  private buildSkyDome(): void {
    // Large hemisphere sky dome with vertical storm gradient
    const skyGeo = new THREE.SphereGeometry(380, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createLinearGradient(0, 0, 0, 256);
      grad.addColorStop(0.0, '#090d16'); // Dark stormy upper sky
      grad.addColorStop(0.4, '#1e293b'); // Slate storm clouds
      grad.addColorStop(0.75, '#334155'); // Low rainy haze
      grad.addColorStop(1.0, '#475569'); // Glowing wet urban horizon
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 128, 256);
    }

    const skyTex = new THREE.CanvasTexture(canvas);
    const skyMat = new THREE.MeshBasicMaterial({
      map: skyTex,
      side: THREE.BackSide,
      fog: false
    });
    this.skyMesh = new THREE.Mesh(skyGeo, skyMat);
    this.skyMesh.position.set(0, -10, 0);
    this.scene.add(this.skyMesh);
  }

  private initVolumetricRain(): void {
    this.rainGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.rainCount * 6); // 2 vertices per raindrop line

    for (let i = 0; i < this.rainCount; i++) {
      const x = (Math.random() - 0.5) * 44;
      const y = Math.random() * 26;
      const z = (Math.random() - 0.5) * 55;
      const len = 0.65 + Math.random() * 0.45;

      // Top vertex
      positions[i * 6 + 0] = x;
      positions[i * 6 + 1] = y;
      positions[i * 6 + 2] = z;

      // Bottom slanted vertex (monsoon wind slant)
      positions[i * 6 + 3] = x - 0.14;
      positions[i * 6 + 4] = y - len;
      positions[i * 6 + 5] = z + 0.08;

      this.rainVelocities[i] = 26 + Math.random() * 12; // Falling velocity (m/s)
    }

    this.rainGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const rainMaterial = new THREE.LineBasicMaterial({
      color: 0x94a3b8,
      transparent: true,
      opacity: 0.38,
      blending: THREE.AdditiveBlending
    });

    this.rainLines = new THREE.LineSegments(this.rainGeometry, rainMaterial);
    this.scene.add(this.rainLines);
  }

  private initGroundSplashes(): void {
    // Soft circular gradient texture for ground ripples (never renders as square)
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0.0, 'rgba(224, 242, 254, 0.7)');
      grad.addColorStop(0.4, 'rgba(147, 197, 253, 0.3)');
      grad.addColorStop(1.0, 'rgba(147, 197, 253, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(16, 16, 16, 0, Math.PI * 2);
      ctx.fill();
    }
    const splashTex = new THREE.CanvasTexture(canvas);

    this.splashGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.splashCount * 3);

    for (let i = 0; i < this.splashCount; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 13; // On road / curbs
      positions[i * 3 + 1] = 0.03; // Just above road asphalt
      positions[i * 3 + 2] = (Math.random() - 0.5) * 35;
      this.splashLifetimes[i] = Math.random();
    }

    this.splashGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const splashMaterial = new THREE.PointsMaterial({
      map: splashTex,
      color: 0xe0f2fe,
      size: 0.35,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    this.splashPoints = new THREE.Points(this.splashGeometry, splashMaterial);
    this.scene.add(this.splashPoints);
  }

  public update(dt: number, cameraFollowZ: number): void {
    // 1. Keep directional sunlight & sky dome tracking player
    this.directionalLight.position.z = cameraFollowZ + 10;
    this.directionalLight.target.position.set(0, 0, cameraFollowZ - 10);
    this.directionalLight.target.updateMatrixWorld();

    if (this.skyMesh) {
      this.skyMesh.position.z = cameraFollowZ - 40;
    }

    // 2. Animate 3D Rain Line Segments (High speed rain streaks)
    if (this.rainGeometry) {
      const positions = this.rainGeometry.attributes.position.array as Float32Array;
      for (let i = 0; i < this.rainCount; i++) {
        const fallDist = this.rainVelocities[i] * dt;
        const windDist = 3.2 * dt;

        positions[i * 6 + 0] -= windDist;
        positions[i * 6 + 1] -= fallDist;
        positions[i * 6 + 3] -= windDist;
        positions[i * 6 + 4] -= fallDist;

        if (positions[i * 6 + 4] < 0) {
          const x = (Math.random() - 0.5) * 44;
          const y = 22 + Math.random() * 6;
          const z = cameraFollowZ + 10 - Math.random() * 50;
          const len = 0.65 + Math.random() * 0.45;

          positions[i * 6 + 0] = x;
          positions[i * 6 + 1] = y;
          positions[i * 6 + 2] = z;

          positions[i * 6 + 3] = x - 0.14;
          positions[i * 6 + 4] = y - len;
          positions[i * 6 + 5] = z + 0.08;
        }

        const zRel = positions[i * 6 + 2] - cameraFollowZ;
        if (zRel > 15) {
          positions[i * 6 + 2] -= 55;
          positions[i * 6 + 5] -= 55;
        } else if (zRel < -40) {
          positions[i * 6 + 2] += 55;
          positions[i * 6 + 5] += 55;
        }
      }
      this.rainGeometry.attributes.position.needsUpdate = true;
    }

    // 3. Animate Ground Splashes (Water Ripples)
    if (this.splashGeometry) {
      const positions = this.splashGeometry.attributes.position.array as Float32Array;
      for (let i = 0; i < this.splashCount; i++) {
        this.splashLifetimes[i] += dt * 3.5;
        if (this.splashLifetimes[i] > 1.0) {
          this.splashLifetimes[i] = 0;
          positions[i * 3 + 0] = (Math.random() - 0.5) * 12.0;
          positions[i * 3 + 2] = cameraFollowZ - Math.random() * 32.0;
        }
      }
      this.splashGeometry.attributes.position.needsUpdate = true;
    }

    // 4. Atmospheric Lightning Flash
    this.lightningTimer -= dt;
    if (this.lightningTimer <= 0) {
      this.lightningTimer = 8 + Math.random() * 9;
      this.lightningDuration = 0.18; // 180ms flash
    }

    if (this.lightningDuration > 0) {
      this.lightningDuration -= dt;
      this.ambientLight.intensity = 3.8;
      this.scene.background = this.flashBgColor;
    } else {
      this.ambientLight.intensity = 1.35;
      this.scene.background = this.defaultBgColor;
    }
  }

  public onWindowResize(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;

    const targetAspect = 16 / 9;
    let w = width;
    let h = width / targetAspect;

    if (h > height) {
      h = height;
      w = height * targetAspect;
    }

    this.renderer.setSize(w, h, false);
    this.camera.aspect = targetAspect;
    this.camera.updateProjectionMatrix();
  }

  public render(): void {
    this.renderer.render(this.scene, this.camera);
  }
}
