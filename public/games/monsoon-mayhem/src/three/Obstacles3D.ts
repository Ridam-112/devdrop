import * as THREE from 'three';
import { Road3D } from './Road3D';

export type Obstacle3DType =
  | 'POTHOLE_SMALL'
  | 'POTHOLE_LARGE'
  | 'POTHOLE_WATER'
  | 'OPEN_MANHOLE'
  | 'BARRICADE'
  | 'TRAFFIC_CONE'
  | 'FALLEN_BRANCH'
  | 'KOLKATA_BUS'
  | 'YELLOW_TAXI'
  | 'AUTO_RICKSHAW'
  | 'ELECTRIC_WIRE'
  | 'BUS_WAVE'
  | 'CHAI_PICKUP';

export interface Obstacle3DEntity {
  id: number;
  type: Obstacle3DType;
  mesh: THREE.Group;
  worldPos: THREE.Vector3;
  radius: number; // Exact Physical Collider Radius (Meters)
  damage: number;
  speedPenalty: number;
  requiredJumpHeight: number;
  hasCollided: boolean;
  forwardSpeed?: number; // Driving speed along -Z (m/s)
  lateralWeaveTimer?: number;
  isPickup?: boolean;
}

export class Obstacles3D {
  public scene: THREE.Scene;
  public road: Road3D;
  public group: THREE.Group;
  public activeObstacles: Obstacle3DEntity[] = [];

  private nextId = 1;
  private lastSpawnZ = -30;
  private busWaveCooldown = 0;

  constructor(scene: THREE.Scene, road: Road3D) {
    this.scene = scene;
    this.road = road;
    this.group = new THREE.Group();
    this.scene.add(this.group);

    // Initial obstacle spawning
    this.spawnInitialObstacles();
  }

  private spawnInitialObstacles(): void {
    for (let z = -35; z > -450; z -= 30) {
      this.spawnProceduralObstacle(z);
    }
  }

  public update(playerZ: number, _playerDistMeters: number, dt: number = 0.016): void {
    // 1. Move Dynamic Vehicles (Kolkata City Bus, Ambassador Taxi, Erratic Auto)
    for (const obs of this.activeObstacles) {
      if (obs.forwardSpeed) {
        obs.worldPos.z -= obs.forwardSpeed * dt;
        obs.mesh.position.z = obs.worldPos.z;

        // Erratic Lane Weaving for Auto-Rickshaw
        if (obs.type === 'AUTO_RICKSHAW') {
          obs.lateralWeaveTimer = (obs.lateralWeaveTimer || 0) + dt * 2.5;
          const weave = Math.sin(obs.lateralWeaveTimer) * 2.2;
          obs.mesh.position.x = THREE.MathUtils.clamp(obs.worldPos.x + weave, -4.5, 4.5);
          obs.mesh.rotation.y = Math.cos(obs.lateralWeaveTimer) * 0.25;
        }

        // Bus Bow Wave Generation when Bus is ~25m ahead of player
        if (obs.type === 'KOLKATA_BUS') {
          const distToPlayer = playerZ - obs.worldPos.z;
          if (distToPlayer > 12 && distToPlayer < 35 && this.busWaveCooldown <= 0) {
            this.spawnBusWave(obs.worldPos.clone());
            this.busWaveCooldown = 4.0; // Wave every 4 seconds
          }
        }
      }

      // Rotate floating Chai Pickup
      if (obs.type === 'CHAI_PICKUP') {
        obs.mesh.rotation.y += 2.5 * dt;
        obs.mesh.position.y = 0.4 + Math.sin(performance.now() * 0.004) * 0.08;
      }

      // Live electric wire spark flicker
      if (obs.type === 'ELECTRIC_WIRE') {
        const spark = obs.mesh.getObjectByName('electric_spark');
        if (spark) {
          spark.visible = Math.random() < 0.65;
        }
      }

      // Expand Bus Wave
      if (obs.type === 'BUS_WAVE') {
        obs.mesh.scale.x += 3.5 * dt;
        obs.radius = obs.mesh.scale.x * 1.8;
      }
    }

    if (this.busWaveCooldown > 0) this.busWaveCooldown -= dt;

    // 2. Procedural Spawning Ahead of Player
    const spawnDistanceAhead = 400;
    while (this.lastSpawnZ > playerZ - spawnDistanceAhead) {
      this.lastSpawnZ -= 24 + Math.random() * 12;
      this.spawnProceduralObstacle(this.lastSpawnZ);
    }

    // 3. Recycle Obstacles that passed behind the player
    for (let i = this.activeObstacles.length - 1; i >= 0; i--) {
      const obs = this.activeObstacles[i];
      if (obs.worldPos.z > playerZ + 25) {
        this.group.remove(obs.mesh);
        this.activeObstacles.splice(i, 1);
      }
    }
  }

  private spawnBusWave(busPos: THREE.Vector3): void {
    const waveMesh = this.buildBusWaveMesh();
    // Wave erupts from side of bus rushing across adjacent lanes
    const wavePos = new THREE.Vector3(busPos.x > 0 ? busPos.x - 1.8 : busPos.x + 1.8, 0, busPos.z + 1.5);
    waveMesh.position.copy(wavePos);
    this.group.add(waveMesh);

    const waveEntity: Obstacle3DEntity = {
      id: this.nextId++,
      type: 'BUS_WAVE',
      mesh: waveMesh,
      worldPos: wavePos,
      radius: 2.2,
      damage: 15,
      speedPenalty: 28,
      requiredJumpHeight: 0.45, // JUMPING AVOIDS THE TSUNAMI WAVE!
      hasCollided: false,
      forwardSpeed: 4.5
    };

    this.activeObstacles.push(waveEntity);
  }

  private spawnProceduralObstacle(z: number): void {
    const curveX = this.road.getCurveXAt(z);

    // Lanes: Left (-2.8m), Center (0m), Right (+2.8m)
    const laneOffsets = [-2.8, 0, 2.8];
    const laneX = curveX + laneOffsets[Math.floor(Math.random() * laneOffsets.length)];

    const rand = Math.random();
    let type: Obstacle3DType = 'POTHOLE_SMALL';

    if (rand < 0.16) type = 'POTHOLE_SMALL';
    else if (rand < 0.30) type = 'POTHOLE_WATER';
    else if (rand < 0.42) type = 'POTHOLE_LARGE';
    else if (rand < 0.54) type = 'OPEN_MANHOLE';
    else if (rand < 0.64) type = 'BARRICADE';
    else if (rand < 0.72) type = 'AUTO_RICKSHAW';
    else if (rand < 0.80) type = 'YELLOW_TAXI';
    else if (rand < 0.88) type = 'KOLKATA_BUS';
    else if (rand < 0.94) type = 'ELECTRIC_WIRE';
    else type = 'CHAI_PICKUP'; // Energy Tea Cup Pickup!

    this.createObstacle(type, new THREE.Vector3(laneX, 0, z));
  }

  public createObstacle(type: Obstacle3DType, pos: THREE.Vector3): Obstacle3DEntity {
    const mesh = new THREE.Group();
    let radius = 0.55;
    let damage = 12;
    let speedPenalty = 14;
    let requiredJumpHeight = 0.45;
    let forwardSpeed = 0;
    let isPickup = false;

    switch (type) {
      case 'POTHOLE_SMALL':
        radius = 0.52;
        damage = 10;
        speedPenalty = 12;
        requiredJumpHeight = 0.4;
        this.buildPotholeMesh(mesh, radius, 0x1e293b, 0.08);
        break;

      case 'POTHOLE_LARGE':
        radius = 0.92;
        damage = 18;
        speedPenalty = 22;
        requiredJumpHeight = 0.55;
        this.buildPotholeMesh(mesh, radius, 0x451a03, 0.14);
        break;

      case 'POTHOLE_WATER':
        radius = 0.74;
        damage = 14;
        speedPenalty = 16;
        requiredJumpHeight = 0.45;
        this.buildPotholeMesh(mesh, radius, 0x0284c7, 0.09, true);
        break;

      case 'OPEN_MANHOLE':
        radius = 0.55;
        damage = 35;
        speedPenalty = 36;
        requiredJumpHeight = 0.65;
        this.buildOpenManholeMesh(mesh, radius);
        break;

      case 'BARRICADE':
        radius = 0.85;
        damage = 25;
        speedPenalty = 32;
        requiredJumpHeight = 0.9;
        this.buildBarricadeMesh(mesh);
        break;

      case 'TRAFFIC_CONE':
        radius = 0.35;
        damage = 6;
        speedPenalty = 8;
        requiredJumpHeight = 0.45;
        this.buildConeMesh(mesh);
        break;

      case 'FALLEN_BRANCH':
        radius = 0.80;
        damage = 15;
        speedPenalty = 18;
        requiredJumpHeight = 0.55;
        this.buildBranchMesh(mesh);
        break;

      case 'KOLKATA_BUS':
        radius = 1.35;
        damage = 42;
        speedPenalty = 40;
        requiredJumpHeight = 4.0;
        forwardSpeed = 9.2;
        this.buildKolkataBusMesh(mesh);
        break;

      case 'YELLOW_TAXI':
        radius = 1.1;
        damage = 28;
        speedPenalty = 28;
        requiredJumpHeight = 3.0;
        forwardSpeed = 12.0;
        this.buildMovingTaxiMesh(mesh);
        break;

      case 'AUTO_RICKSHAW':
        radius = 0.95;
        damage = 24;
        speedPenalty = 25;
        requiredJumpHeight = 3.0;
        forwardSpeed = 10.5; // ~38 km/h erratic weaving
        this.buildAutoRickshawMesh(mesh);
        break;

      case 'ELECTRIC_WIRE':
        radius = 1.2;
        damage = 30; // High electric shock!
        speedPenalty = 35;
        requiredJumpHeight = 0.55; // Can jump over the water spark!
        this.buildElectricWireMesh(mesh);
        break;

      case 'CHAI_PICKUP':
        radius = 0.85;
        damage = -25; // Heals +25 health!
        speedPenalty = -15; // Gives +15 km/h boost!
        requiredJumpHeight = 0.0;
        isPickup = true;
        this.buildChaiPickupMesh(mesh);
        break;
    }

    mesh.position.copy(pos);
    this.group.add(mesh);

    const obs: Obstacle3DEntity = {
      id: this.nextId++,
      type,
      mesh,
      worldPos: pos,
      radius,
      damage,
      speedPenalty,
      requiredJumpHeight,
      hasCollided: false,
      forwardSpeed,
      isPickup
    };

    this.activeObstacles.push(obs);
    return obs;
  }

  // === 3D GEOMETRY BUILDERS ===

  private buildPotholeMesh(group: THREE.Group, radius: number, centerColor: number, depth: number, hasBubbles = false): void {
    const bowlGeo = new THREE.CylinderGeometry(radius, radius * 0.7, depth, 16);
    const bowlMat = new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.95 });
    const bowl = new THREE.Mesh(bowlGeo, bowlMat);
    bowl.position.y = -depth / 2;
    group.add(bowl);

    const rimGeo = new THREE.RingGeometry(radius * 0.85, radius * 1.25, 16);
    rimGeo.rotateX(-Math.PI / 2);
    const rimMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.9 });
    const rim = new THREE.Mesh(rimGeo, rimMat);
    rim.position.y = 0.015;
    group.add(rim);

    const innerRimGeo = new THREE.RingGeometry(radius * 0.75, radius * 0.9, 16);
    innerRimGeo.rotateX(-Math.PI / 2);
    const innerRimMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.95 });
    const innerRim = new THREE.Mesh(innerRimGeo, innerRimMat);
    innerRim.position.y = 0.018;
    group.add(innerRim);

    const waterGeo = new THREE.CircleGeometry(radius * 0.85, 16);
    waterGeo.rotateX(-Math.PI / 2);
    const waterMat = new THREE.MeshStandardMaterial({
      color: centerColor,
      roughness: 0.05,
      metalness: 0.45,
      transparent: true,
      opacity: 0.88
    });
    const water = new THREE.Mesh(waterGeo, waterMat);
    water.position.y = 0.008;
    group.add(water);

    const stoneGeo = new THREE.BoxGeometry(0.12, 0.06, 0.12);
    const stoneMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.9 });
    for (let s = 0; s < 4; s++) {
      const angle = (s / 4) * Math.PI * 2 + 0.3;
      const stone = new THREE.Mesh(stoneGeo, stoneMat);
      stone.position.set(Math.cos(angle) * (radius * 1.1), 0.03, Math.sin(angle) * (radius * 1.1));
      stone.rotation.y = angle;
      group.add(stone);
    }

    if (hasBubbles) {
      const bubbleGeo = new THREE.SphereGeometry(0.05, 8, 8);
      const bubbleMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1 });
      for (let b = 0; b < 5; b++) {
        const bubble = new THREE.Mesh(bubbleGeo, bubbleMat);
        bubble.position.set((Math.random() - 0.5) * radius * 0.7, 0.02, (Math.random() - 0.5) * radius * 0.7);
        group.add(bubble);
      }
    }
  }

  private buildOpenManholeMesh(group: THREE.Group, radius: number): void {
    const shaftGeo = new THREE.CylinderGeometry(radius, radius, 1.2, 16, 1, true);
    const shaftMat = new THREE.MeshStandardMaterial({ color: 0x020202, roughness: 0.95, side: THREE.BackSide });
    const shaft = new THREE.Mesh(shaftGeo, shaftMat);
    shaft.position.y = -0.6;
    group.add(shaft);

    const rimGeo = new THREE.TorusGeometry(radius, 0.08, 8, 24);
    rimGeo.rotateX(Math.PI / 2);
    const rimMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.3, metalness: 0.9 });
    const rim = new THREE.Mesh(rimGeo, rimMat);
    rim.position.y = 0.03;
    group.add(rim);

    const lidGeo = new THREE.CylinderGeometry(radius * 0.98, radius * 0.98, 0.08, 16);
    const lidMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5, metalness: 0.8 });
    const lid = new THREE.Mesh(lidGeo, lidMat);
    lid.position.set(radius * 1.25, 0.05, radius * 0.4);
    lid.rotation.z = 0.2;
    lid.castShadow = true;
    group.add(lid);

    const poleGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.9, 8);
    const poleMat = new THREE.MeshStandardMaterial({ color: 0xef4444 });
    const pole = new THREE.Mesh(poleGeo, poleMat);
    pole.position.set(-radius * 1.1, 0.45, 0);
    group.add(pole);

    const flagGeo = new THREE.BoxGeometry(0.3, 0.18, 0.02);
    const flagMat = new THREE.MeshStandardMaterial({ color: 0xfacc15 });
    const flag = new THREE.Mesh(flagGeo, flagMat);
    flag.position.set(-radius * 1.1 - 0.15, 0.8, 0);
    group.add(flag);
  }

  private buildBarricadeMesh(group: THREE.Group): void {
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.4, metalness: 0.8 });
    const hazardMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.3 });
    const stripeMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.5 });

    const legGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.1, 8);
    const leftLeg = new THREE.Mesh(legGeo, metalMat);
    leftLeg.position.set(-0.85, 0.55, 0);
    group.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeo, metalMat);
    rightLeg.position.set(0.85, 0.55, 0);
    group.add(rightLeg);

    const boardGeo = new THREE.BoxGeometry(1.9, 0.45, 0.06);
    const board = new THREE.Mesh(boardGeo, hazardMat);
    board.position.set(0, 0.75, 0);
    board.castShadow = true;
    group.add(board);

    const stripeGeo = new THREE.BoxGeometry(0.2, 0.46, 0.07);
    for (const sx of [-0.6, 0, 0.6]) {
      const stripe = new THREE.Mesh(stripeGeo, stripeMat);
      stripe.position.set(sx, 0.75, 0);
      stripe.rotation.z = 0.4;
      group.add(stripe);
    }

    const lightBoxGeo = new THREE.BoxGeometry(0.18, 0.18, 0.12);
    const lightBoxMat = new THREE.MeshStandardMaterial({ color: 0xf97316, emissive: 0xea580c, emissiveIntensity: 0.6 });
    const blinker = new THREE.Mesh(lightBoxGeo, lightBoxMat);
    blinker.position.set(0, 1.06, 0);
    group.add(blinker);
  }

  private buildConeMesh(group: THREE.Group): void {
    const orangeMat = new THREE.MeshStandardMaterial({ color: 0xea580c, roughness: 0.3 });
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 });
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.8 });

    const baseGeo = new THREE.BoxGeometry(0.55, 0.05, 0.55);
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = 0.025;
    group.add(base);

    const coneGeo = new THREE.ConeGeometry(0.24, 0.75, 12);
    const cone = new THREE.Mesh(coneGeo, orangeMat);
    cone.position.y = 0.4;
    cone.castShadow = true;
    group.add(cone);

    const bandGeo = new THREE.CylinderGeometry(0.14, 0.18, 0.18, 12, 1, true);
    const band = new THREE.Mesh(bandGeo, whiteMat);
    band.position.y = 0.42;
    group.add(band);
  }

  private buildBranchMesh(group: THREE.Group): void {
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.85 });
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.6 });

    const branchGeo = new THREE.CylinderGeometry(0.08, 0.12, 1.8, 8);
    branchGeo.rotateZ(Math.PI / 2.3);
    const branch = new THREE.Mesh(branchGeo, woodMat);
    branch.position.y = 0.12;
    branch.castShadow = true;
    group.add(branch);

    const leafGeo = new THREE.SphereGeometry(0.25, 8, 8);
    for (const lx of [-0.6, 0, 0.5]) {
      const leaf = new THREE.Mesh(leafGeo, leafMat);
      leaf.position.set(lx, 0.22, 0.15);
      group.add(leaf);
    }
  }

  private buildKolkataBusMesh(group: THREE.Group): void {
    const blueMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.4 });
    const yellowMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.4 });
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.1, metalness: 0.8 });
    const rubberMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.8 });

    const lowerBodyGeo = new THREE.BoxGeometry(2.5, 1.4, 7.8);
    const lowerBody = new THREE.Mesh(lowerBodyGeo, blueMat);
    lowerBody.position.y = 1.0;
    lowerBody.castShadow = true;
    group.add(lowerBody);

    const upperBodyGeo = new THREE.BoxGeometry(2.46, 1.3, 7.7);
    const upperBody = new THREE.Mesh(upperBodyGeo, yellowMat);
    upperBody.position.y = 2.25;
    upperBody.castShadow = true;
    group.add(upperBody);

    const windGeo = new THREE.BoxGeometry(2.3, 0.9, 0.1);
    const windshield = new THREE.Mesh(windGeo, glassMat);
    windshield.position.set(0, 2.2, -3.86);
    group.add(windshield);

    const rearGlass = new THREE.Mesh(windGeo, glassMat);
    rearGlass.position.set(0, 2.2, 3.86);
    group.add(rearGlass);

    const routeGeo = new THREE.BoxGeometry(1.8, 0.35, 0.08);
    const routeMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const routeSign = new THREE.Mesh(routeGeo, routeMat);
    routeSign.position.set(0, 2.9, -3.88);
    group.add(routeSign);

    const bumpGeo = new THREE.BoxGeometry(2.6, 0.28, 0.25);
    const bumperF = new THREE.Mesh(bumpGeo, rubberMat);
    bumperF.position.set(0, 0.45, -3.95);
    group.add(bumperF);

    const bumperR = new THREE.Mesh(bumpGeo, rubberMat);
    bumperR.position.set(0, 0.45, 3.95);
    group.add(bumperR);

    const busWheelGeo = new THREE.CylinderGeometry(0.44, 0.44, 0.35, 16);
    busWheelGeo.rotateZ(Math.PI / 2);
    for (const wz of [-2.4, 2.2]) {
      for (const wx of [-1.22, 1.22]) {
        const wheel = new THREE.Mesh(busWheelGeo, rubberMat);
        wheel.position.set(wx, 0.44, wz);
        group.add(wheel);
      }
    }
  }

  private buildMovingTaxiMesh(group: THREE.Group): void {
    const yellowMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.35 });
    const blackMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.6 });
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.1, metalness: 0.85 });
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.2, metalness: 0.85 });

    const bodyGeo = new THREE.BoxGeometry(1.8, 0.72, 4.2);
    const body = new THREE.Mesh(bodyGeo, yellowMat);
    body.position.y = 0.55;
    body.castShadow = true;
    group.add(body);

    const cabinGeo = new THREE.BoxGeometry(1.65, 0.62, 2.3);
    const cabin = new THREE.Mesh(cabinGeo, yellowMat);
    cabin.position.set(0, 1.15, -0.15);
    cabin.castShadow = true;
    group.add(cabin);

    const winFGeo = new THREE.BoxGeometry(1.55, 0.48, 0.08);
    const winF = new THREE.Mesh(winFGeo, glassMat);
    winF.position.set(0, 1.15, -1.32);
    winF.rotation.x = -0.3;
    group.add(winF);

    const winR = new THREE.Mesh(winFGeo, glassMat);
    winR.position.set(0, 1.15, 1.02);
    winR.rotation.x = 0.3;
    group.add(winR);

    const taxiSignGeo = new THREE.BoxGeometry(0.45, 0.14, 0.22);
    const taxiSignMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xfef08a, emissiveIntensity: 0.8 });
    const taxiSign = new THREE.Mesh(taxiSignGeo, taxiSignMat);
    taxiSign.position.set(0, 1.54, -0.15);
    group.add(taxiSign);

    const bumpGeo = new THREE.BoxGeometry(1.9, 0.15, 0.15);
    const bumpF = new THREE.Mesh(bumpGeo, chromeMat);
    bumpF.position.set(0, 0.32, -2.15);
    group.add(bumpF);

    const bumpR = new THREE.Mesh(bumpGeo, chromeMat);
    bumpR.position.set(0, 0.32, 2.15);
    group.add(bumpR);

    const taxiWheelGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.22, 16);
    taxiWheelGeo.rotateZ(Math.PI / 2);
    for (const wz of [-1.2, 1.2]) {
      for (const wx of [-0.92, 0.92]) {
        const wheel = new THREE.Mesh(taxiWheelGeo, blackMat);
        wheel.position.set(wx, 0.32, wz);
        group.add(wheel);
      }
    }
  }

  private buildAutoRickshawMesh(group: THREE.Group): void {
    const greenMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.4 });
    const yellowMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.4 });
    const blackMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.7 });
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.1, metalness: 0.8 });

    // Lower Green Body
    const lowerGeo = new THREE.BoxGeometry(1.35, 0.65, 2.6);
    const lower = new THREE.Mesh(lowerGeo, greenMat);
    lower.position.y = 0.5;
    lower.castShadow = true;
    group.add(lower);

    // Yellow Canopy Hood
    const canopyGeo = new THREE.BoxGeometry(1.28, 0.85, 2.1);
    const canopy = new THREE.Mesh(canopyGeo, yellowMat);
    canopy.position.set(0, 1.15, 0.15);
    canopy.castShadow = true;
    group.add(canopy);

    // Front Windshield
    const windGeo = new THREE.BoxGeometry(1.2, 0.5, 0.06);
    const wind = new THREE.Mesh(windGeo, glassMat);
    wind.position.set(0, 1.05, -0.92);
    group.add(wind);

    // 1 Front Wheel
    const wheelGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.14, 12);
    wheelGeo.rotateZ(Math.PI / 2);
    const wheelF = new THREE.Mesh(wheelGeo, blackMat);
    wheelF.position.set(0, 0.24, -1.1);
    group.add(wheelF);

    // 2 Rear Wheels
    for (const rx of [-0.65, 0.65]) {
      const wheelR = new THREE.Mesh(wheelGeo, blackMat);
      wheelR.position.set(rx, 0.24, 0.85);
      group.add(wheelR);
    }
  }

  private buildElectricWireMesh(group: THREE.Group): void {
    const blackMat = new THREE.MeshStandardMaterial({ color: 0x09090b });
    const sparkMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });

    // Hanging Wire Curve
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(-1.8, 2.5, 0),
      new THREE.Vector3(-0.6, 0.1, 0.5),
      new THREE.Vector3(0.5, 0.02, 0)
    );
    const points = curve.getPoints(16);
    const wireGeo = new THREE.BufferGeometry().setFromPoints(points);
    const wire = new THREE.Line(wireGeo, blackMat);
    group.add(wire);

    // Sparkling Blue Water Arc
    const sparkGeo = new THREE.RingGeometry(0.3, 1.1, 12);
    sparkGeo.rotateX(-Math.PI / 2);
    const sparkMesh = new THREE.Mesh(sparkGeo, sparkMat);
    sparkMesh.name = 'electric_spark';
    sparkMesh.position.set(0.5, 0.02, 0);
    group.add(sparkMesh);

    // Pulsing Light
    const sparkLight = new THREE.PointLight(0x38bdf8, 3.5, 8);
    sparkLight.position.set(0.5, 0.3, 0);
    group.add(sparkLight);
  }

  public buildBusWaveMesh(): THREE.Group {
    const waveGroup = new THREE.Group();
    // Sweeping Curved Water Wave Wall
    const waveGeo = new THREE.CylinderGeometry(0.8, 1.8, 0.65, 12, 1, false, 0, Math.PI);
    waveGeo.rotateX(-Math.PI / 2);
    const waveMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.1,
      metalness: 0.5,
      transparent: true,
      opacity: 0.75
    });
    const waveMesh = new THREE.Mesh(waveGeo, waveMat);
    waveMesh.position.y = 0.32;
    waveGroup.add(waveMesh);

    // White Foaming Crest
    const foamGeo = new THREE.TorusGeometry(1.6, 0.12, 8, 16, Math.PI);
    foamGeo.rotateX(-Math.PI / 2);
    const foamMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
    const foam = new THREE.Mesh(foamGeo, foamMat);
    foam.position.y = 0.55;
    waveGroup.add(foam);

    return waveGroup;
  }

  private buildChaiPickupMesh(group: THREE.Group): void {
    const clayMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.75 }); // Terracotta
    const teaMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.2 }); // Steaming Milk Tea
    const glowMat = new THREE.MeshBasicMaterial({ color: 0xfacc15, wireframe: true });

    // Terracotta Clay Cup (মাটির ভাঁড়)
    const cupGeo = new THREE.CylinderGeometry(0.24, 0.16, 0.38, 16);
    const cup = new THREE.Mesh(cupGeo, clayMat);
    cup.position.y = 0.2;
    cup.castShadow = true;
    group.add(cup);

    // Milk Chai Liquid Surface
    const teaGeo = new THREE.CircleGeometry(0.22, 16);
    teaGeo.rotateX(-Math.PI / 2);
    const tea = new THREE.Mesh(teaGeo, teaMat);
    tea.position.y = 0.38;
    group.add(tea);

    // Golden Floating Energy Glow Ring
    const haloGeo = new THREE.TorusGeometry(0.48, 0.04, 8, 16);
    haloGeo.rotateX(Math.PI / 2);
    const halo = new THREE.Mesh(haloGeo, glowMat);
    halo.position.y = 0.22;
    group.add(halo);

    const chaiLight = new THREE.PointLight(0xfacc15, 2.5, 6);
    chaiLight.position.y = 0.45;
    group.add(chaiLight);
  }
}
