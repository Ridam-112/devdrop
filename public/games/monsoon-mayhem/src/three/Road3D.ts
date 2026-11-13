import * as THREE from 'three';

export interface RoadChunk {
  group: THREE.Group;
  baseZ: number;
}

export class Road3D {
  public scene: THREE.Scene;
  public chunks: RoadChunk[] = [];
  public groundMesh!: THREE.Mesh;
  public readonly chunkLength = 40; // 40m per chunk
  public readonly numChunks = 16; // 640m total continuous road ahead
  public readonly roadWidth = 12.0; // 12m wide straight roadway (Centerline strictly at X = 0)

  // Shared Procedural Textures & Materials
  private roadMaterial!: THREE.MeshStandardMaterial;
  private sidewalkMaterial!: THREE.MeshStandardMaterial;
  private puddleMaterial!: THREE.MeshStandardMaterial;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.initSharedMaterials();
    this.buildGroundAndRoad();
  }

  private initSharedMaterials(): void {
    // 1. Procedural Wet Asphalt Texture
    const roadCanvas = document.createElement('canvas');
    roadCanvas.width = 512;
    roadCanvas.height = 512;
    const rCtx = roadCanvas.getContext('2d');
    if (rCtx) {
      rCtx.fillStyle = '#181a20'; // Dark charcoal wet base
      rCtx.fillRect(0, 0, 512, 512);

      // Fine asphalt aggregate noise
      for (let i = 0; i < 4000; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const c = Math.random() < 0.5 ? '#101216' : '#232730';
        rCtx.fillStyle = c;
        rCtx.fillRect(x, y, 2, 2);
      }

      // Wet streaks & tire tracks
      rCtx.fillStyle = 'rgba(10, 12, 16, 0.45)';
      rCtx.fillRect(90, 0, 110, 512); // Left lane track
      rCtx.fillRect(312, 0, 110, 512); // Right lane track
    }

    const roadTex = new THREE.CanvasTexture(roadCanvas);
    roadTex.wrapS = THREE.RepeatWrapping;
    roadTex.wrapT = THREE.RepeatWrapping;
    roadTex.repeat.set(2, 6);

    this.roadMaterial = new THREE.MeshStandardMaterial({
      map: roadTex,
      roughness: 0.22, // Wet glossy road sheen
      metalness: 0.35
    });

    // 2. Procedural Sidewalk Slab Pavers
    const walkCanvas = document.createElement('canvas');
    walkCanvas.width = 256;
    walkCanvas.height = 256;
    const wCtx = walkCanvas.getContext('2d');
    if (wCtx) {
      wCtx.fillStyle = '#475569';
      wCtx.fillRect(0, 0, 256, 256);
      wCtx.strokeStyle = '#334155';
      wCtx.lineWidth = 4;
      for (let y = 0; y < 256; y += 64) {
        wCtx.strokeRect(0, y, 256, 64);
      }
    }
    const walkTex = new THREE.CanvasTexture(walkCanvas);
    walkTex.wrapS = THREE.RepeatWrapping;
    walkTex.wrapT = THREE.RepeatWrapping;
    walkTex.repeat.set(1, 8);

    this.sidewalkMaterial = new THREE.MeshStandardMaterial({
      map: walkTex,
      roughness: 0.75,
      metalness: 0.1
    });

    // 3. High-Gloss Wet Water Puddle Material
    this.puddleMaterial = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.04,
      metalness: 0.85,
      transparent: true,
      opacity: 0.75
    });
  }

  private buildGroundAndRoad(): void {
    // 1. Vast Solid Terrain Ground Plane
    const groundGeo = new THREE.PlaneGeometry(350, 900);
    groundGeo.rotateX(-Math.PI / 2);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a, // Deep slate rainy ground
      roughness: 0.9,
      metalness: 0.15
    });
    this.groundMesh = new THREE.Mesh(groundGeo, groundMat);
    this.groundMesh.position.set(0, -0.05, -300);
    this.groundMesh.receiveShadow = true;
    this.scene.add(this.groundMesh);

    // 2. Build Continuous 12m Road Chunks
    for (let i = 0; i < this.numChunks; i++) {
      const baseZ = -i * this.chunkLength;
      const chunkGroup = this.createRoadChunk(baseZ);
      this.chunks.push({ group: chunkGroup, baseZ });
      this.scene.add(chunkGroup);
    }
  }

  private createRoadChunk(baseZ: number): THREE.Group {
    const chunk = new THREE.Group();

    // 1. Wet Asphalt Road Surface (Centered at X = 0, Width = 12m)
    const roadGeo = new THREE.PlaneGeometry(this.roadWidth, this.chunkLength);
    roadGeo.rotateX(-Math.PI / 2);
    const roadMesh = new THREE.Mesh(roadGeo, this.roadMaterial);
    roadMesh.position.set(0, 0, -this.chunkLength / 2);
    roadMesh.receiveShadow = true;
    chunk.add(roadMesh);

    // 2. Yellow & Black Alternating Reflective Curbs (Width = 0.4m, Height = 0.2m)
    const curbW = 0.4;
    const curbH = 0.2;
    const curbGeo = new THREE.BoxGeometry(curbW, curbH, this.chunkLength);

    const yellowCurbMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.35 });
    const blackCurbMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.5 });

    const isEven = Math.abs(Math.round(baseZ / this.chunkLength)) % 2 === 0;
    const curbMatL = isEven ? yellowCurbMat : blackCurbMat;
    const curbMatR = isEven ? blackCurbMat : yellowCurbMat;

    const leftCurb = new THREE.Mesh(curbGeo, curbMatL);
    leftCurb.position.set(-this.roadWidth / 2 - curbW / 2, curbH / 2, -this.chunkLength / 2);
    leftCurb.castShadow = true;
    leftCurb.receiveShadow = true;
    chunk.add(leftCurb);

    const rightCurb = new THREE.Mesh(curbGeo, curbMatR);
    rightCurb.position.set(this.roadWidth / 2 + curbW / 2, curbH / 2, -this.chunkLength / 2);
    rightCurb.castShadow = true;
    rightCurb.receiveShadow = true;
    chunk.add(rightCurb);

    // 3. Sidewalks on Both Sides
    const walkW = 3.2;
    const walkH = 0.15;
    const walkGeo = new THREE.BoxGeometry(walkW, walkH, this.chunkLength);

    const leftWalk = new THREE.Mesh(walkGeo, this.sidewalkMaterial);
    leftWalk.position.set(-this.roadWidth / 2 - curbW - walkW / 2, walkH / 2, -this.chunkLength / 2);
    leftWalk.receiveShadow = true;
    chunk.add(leftWalk);

    const rightWalk = new THREE.Mesh(walkGeo, this.sidewalkMaterial);
    rightWalk.position.set(this.roadWidth / 2 + curbW + walkW / 2, walkH / 2, -this.chunkLength / 2);
    rightWalk.receiveShadow = true;
    chunk.add(rightWalk);

    // 4. White Dashed Center Line Markings
    const dashW = 0.28;
    const dashL = 4.2;
    const dashGeo = new THREE.PlaneGeometry(dashW, dashL);
    dashGeo.rotateX(-Math.PI / 2);
    const dashMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.25 });

    for (let dz = 4; dz < this.chunkLength; dz += 8.0) {
      const dash = new THREE.Mesh(dashGeo, dashMat);
      dash.position.set(0, 0.015, -dz);
      dash.receiveShadow = true;
      chunk.add(dash);
    }

    // 5. White Road Outer Edge Lines
    const edgeLineGeo = new THREE.PlaneGeometry(0.18, this.chunkLength);
    edgeLineGeo.rotateX(-Math.PI / 2);
    const edgeLineL = new THREE.Mesh(edgeLineGeo, dashMat);
    edgeLineL.position.set(-this.roadWidth / 2 + 0.35, 0.012, -this.chunkLength / 2);
    chunk.add(edgeLineL);

    const edgeLineR = new THREE.Mesh(edgeLineGeo, dashMat);
    edgeLineR.position.set(this.roadWidth / 2 - 0.35, 0.012, -this.chunkLength / 2);
    chunk.add(edgeLineR);

    // 6. Natural Roadside Water Puddles Scattered on Asphalt
    const puddleGeo = new THREE.CircleGeometry(1.4, 12);
    puddleGeo.rotateX(-Math.PI / 2);
    for (const pz of [8, 24]) {
      const puddle = new THREE.Mesh(puddleGeo, this.puddleMaterial);
      const px = (pz % 16 === 0 ? 1 : -1) * 2.6;
      puddle.position.set(px, 0.01, -pz);
      puddle.scale.set(1.0, 1.0, 1.6);
      chunk.add(puddle);
    }

    // 7. Iconic Zebra Crossings on Intersections (Every 3rd Chunk)
    if (Math.abs(Math.round(baseZ / this.chunkLength)) % 3 === 0) {
      const zebraStripeGeo = new THREE.PlaneGeometry(0.55, 3.8);
      zebraStripeGeo.rotateX(-Math.PI / 2);
      const zebraMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 });
      for (let zx = -4.8; zx <= 4.8; zx += 1.1) {
        const stripe = new THREE.Mesh(zebraStripeGeo, zebraMat);
        stripe.position.set(zx, 0.018, -18);
        chunk.add(stripe);
      }
    }

    // 8. Visual Roadside Reference Milestone Markers (every 20m)
    const postGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.9, 8);
    const postMatWhite = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });
    const postMatRed = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.4 });

    for (let pz of [10, 30]) {
      const postL = new THREE.Mesh(postGeo, postMatWhite);
      postL.position.set(-this.roadWidth / 2 - curbW - 0.4, 0.45, -pz);
      postL.castShadow = true;
      chunk.add(postL);

      const bandL = new THREE.Mesh(new THREE.CylinderGeometry(0.125, 0.125, 0.25, 8), postMatRed);
      bandL.position.set(-this.roadWidth / 2 - curbW - 0.4, 0.7, -pz);
      chunk.add(bandL);

      const postR = new THREE.Mesh(postGeo, postMatWhite);
      postR.position.set(this.roadWidth / 2 + curbW + 0.4, 0.45, -pz);
      postR.castShadow = true;
      chunk.add(postR);

      const bandR = new THREE.Mesh(new THREE.CylinderGeometry(0.125, 0.125, 0.25, 8), postMatRed);
      bandR.position.set(this.roadWidth / 2 + curbW + 0.4, 0.7, -pz);
      chunk.add(bandR);
    }

    chunk.position.set(0, 0, baseZ);
    return chunk;
  }

  public getCurveXAt(_z: number): number {
    return 0;
  }

  public update(playerZ: number): void {
    this.groundMesh.position.z = playerZ - 250;
    const activeLength = this.numChunks * this.chunkLength;

    for (const chunk of this.chunks) {
      while (chunk.group.position.z - this.chunkLength > playerZ + 25) {
        chunk.group.position.z -= activeLength;
      }
      while (chunk.group.position.z < playerZ - activeLength + this.chunkLength) {
        chunk.group.position.z += activeLength;
      }
      chunk.group.position.x = 0;
    }
  }
}
