/**
 * No Brakes Desi Bus Driver 3D - Highway City Environment & Weather
 * Features: Procedural road chunks, Chai Tapris, Wedding Barat bands,
 * Bollywood billboard cutouts, Mud puddles & Dynamic Weather (Day, Sunset, Night, Rain)
 */

class DesiCity {
  constructor(scene) {
    this.scene = scene;

    this.chunkLength = 120;
    this.numChunks = 5;
    this.chunks = [];
    this.roadWidth = 24.0; // Expanded to Wide 6-Lane Grand Trunk Highway

    // Obstacle Pools
    this.smashables = [];
    this.stuntRamps = [];
    this.cows = [];
    this.weddingBands = [];
    this.puddles = [];
    this.debrisPool = [];
    this.debrisIndex = 0;

    // Weather & Rain
    this.currentWeather = 'DAY';
    this.rainParticles = null;

    // Performance Optimization: Shared Reusable Unit Geometries
    this.sharedBoxGeo = new THREE.BoxGeometry(1, 1, 1);
    this.sharedBoxGeo._isShared = true;
    this.sharedCylinderGeo = new THREE.CylinderGeometry(1, 1, 1, 8);
    this.sharedCylinderGeo._isShared = true;
    this.sharedSphereGeo = new THREE.SphereGeometry(1, 8, 8);
    this.sharedSphereGeo._isShared = true;
    this.sharedPicketGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.95, 6);
    this.sharedPicketGeo._isShared = true;

    // Cache High-Performance Procedural Road Surface & Shop Sign Textures
    this.roadTexture = this.createRoadTexture();
    this.shopSigns = [];
    this.initShopTextures();

    this.initDebrisPool();
    this.initRain();
    this.buildInitialCity();
  }

  // Pre-bake asphalt highway with double yellow center lines, lane dividers & shoulders into 1 draw call!
  createRoadTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Asphalt Highway Surface
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, 512, 256);

    const pxPerMeter = 512 / 24.0;
    const centerX = 256;

    // Solid Double Yellow Center Lines (NH Style)
    ctx.fillStyle = '#facc15';
    const c1 = centerX - 0.22 * pxPerMeter;
    const c2 = centerX + 0.22 * pxPerMeter;
    const lineWidth = Math.max(3, 0.2 * pxPerMeter);
    ctx.fillRect(c1 - lineWidth / 2, 0, lineWidth, 256);
    ctx.fillRect(c2 - lineWidth / 2, 0, lineWidth, 256);

    // Solid White Shoulder Edge Lines
    ctx.fillStyle = '#ffffff';
    const shL = centerX - 10.8 * pxPerMeter;
    const shR = centerX + 10.8 * pxPerMeter;
    const shWidth = Math.max(3, 0.24 * pxPerMeter);
    ctx.fillRect(shL - shWidth / 2, 0, shWidth, 256);
    ctx.fillRect(shR - shWidth / 2, 0, shWidth, 256);

    // 4 Dashed White Lane Divider Lines (3.2m dash / 2.8m gap -> repeat 6m)
    const dashY = (3.2 / 6.0) * 256;
    const laneDivX = [-7.05, -3.55, 3.55, 7.05];
    laneDivX.forEach(lx => {
      const x = centerX + lx * pxPerMeter;
      ctx.fillRect(x - lineWidth / 2, 0, lineWidth, dashY);
    });

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1, this.chunkLength / 6.0);
    return tex;
  }

  initShopTextures() {
    this.shopSigns = [
      this.createSignTexture('★ HDFC BANK / 24x7 ATM ★', '#1e3a8a', '#ffffff'),
      this.createSignTexture('★ MAA TARA SWEETS • ROSOGOLLA ★', '#b45309', '#fef08a'),
      this.createSignTexture('★ KOLKATA METRO STATION ★', '#0f766e', '#ffffff'),
      this.createSignTexture('★ BENGAL CHAI & SNACKS ★', '#15803d', '#ffffff'),
      this.createSignTexture('★ BARASAT ELECTRONICS ★', '#b91c1c', '#fef08a')
    ];
  }

  createSignTexture(text, bgCol, textCol) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = bgCol;
    ctx.fillRect(0, 0, 512, 128);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 6;
    ctx.strokeRect(6, 6, 500, 116);
    ctx.fillStyle = textCol;
    ctx.font = '900 28px "Arial Black", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 256, 64);
    return new THREE.CanvasTexture(canvas);
  }

  initDebrisPool() {
    const matWood = new THREE.MeshLambertMaterial({ color: 0x92400e });
    const matMelon = new THREE.MeshLambertMaterial({ color: 0x16a34a });
    const matYellow = new THREE.MeshLambertMaterial({ color: 0xfacc15 });

    for (let i = 0; i < 48; i++) {
      const geo = (i % 3 === 0)
        ? new THREE.BoxGeometry(0.35, 0.15, 0.8)
        : (i % 3 === 1)
          ? new THREE.SphereGeometry(0.3, 8, 8)
          : new THREE.CylinderGeometry(0.08, 0.08, 0.9, 8);

      const mat = (i % 3 === 0) ? matWood : (i % 3 === 1) ? matMelon : matYellow;
      const mesh = new THREE.Mesh(geo, mat);
      mesh.visible = false;
      this.scene.add(mesh);

      this.debrisPool.push({
        mesh: mesh,
        life: 0,
        maxLife: 1.2,
        vel: new THREE.Vector3(),
        rotVel: new THREE.Vector3()
      });
    }
  }

  initRain() {
    const count = 350;
    const rainGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 1] = Math.random() * 30;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 120;
    }

    rainGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const rainMat = new THREE.PointsMaterial({
      color: 0x93c5fd,
      size: 0.28,
      transparent: true,
      opacity: 0.6
    });

    this.rainParticles = new THREE.Points(rainGeo, rainMat);
    this.rainParticles.visible = false;
    this.scene.add(this.rainParticles);
  }

  spawnDebrisExplosion(pos, count = 10) {
    for (let k = 0; k < count; k++) {
      const d = this.debrisPool[this.debrisIndex];
      this.debrisIndex = (this.debrisIndex + 1) % this.debrisPool.length;

      d.mesh.position.set(
        pos.x + (Math.random() - 0.5) * 1.5,
        pos.y + 0.6 + Math.random() * 0.8,
        pos.z + (Math.random() - 0.5) * 1.5
      );
      d.mesh.visible = true;
      d.life = 0;
      d.maxLife = 1.0 + Math.random() * 0.5;

      d.vel.set(
        (Math.random() - 0.5) * 14.0,
        6.0 + Math.random() * 9.0,
        -Math.random() * 9.0 - 4.0
      );
      d.rotVel.set(
        (Math.random() - 0.5) * 16.0,
        (Math.random() - 0.5) * 16.0,
        (Math.random() - 0.5) * 16.0
      );
    }
  }

  buildInitialCity() {
    for (let i = 0; i < this.numChunks; i++) {
      const chunkZ = -i * this.chunkLength;
      const chunk = this.createRoadChunk(chunkZ);
      this.chunks.push(chunk);
      this.spawnChunkObstacles(chunkZ);
    }
  }

  createRoadChunk(chunkZ) {
    const group = new THREE.Group();
    group.position.z = chunkZ;

    // Single-Pass Asphalt Road Surface with Pre-baked NH Markings (1 Draw Call!)
    const roadGeo = new THREE.PlaneGeometry(this.roadWidth, this.chunkLength);
    roadGeo.rotateX(-Math.PI / 2);
    const roadMat = new THREE.MeshLambertMaterial({ map: this.roadTexture });
    const road = new THREE.Mesh(roadGeo, roadMat);
    group.add(road);

    // Sidewalk Curbs, Kolkata Blue-White Railings, & Tropical Trees
    const blueMat = new THREE.MeshLambertMaterial({ color: 0x0284c7 }); // Kolkata Sky Blue
    const whiteRailingMat = new THREE.MeshLambertMaterial({ color: 0xf8fafc }); // Kolkata Crisp White
    const trunkMat = new THREE.MeshLambertMaterial({ color: 0x78350f });
    const leafMat1 = new THREE.MeshLambertMaterial({ color: 0x15803d });
    const leafMat2 = new THREE.MeshLambertMaterial({ color: 0x16a34a });
    const awningMat = new THREE.MeshLambertMaterial({ color: 0xd97706 });
    const shutterMat = new THREE.MeshLambertMaterial({ color: 0x94a3b8 });
    const curbMat = new THREE.MeshLambertMaterial({ color: 0x64748b });
    const poleMat = new THREE.MeshLambertMaterial({ color: 0x475569 });
    const lampMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });

    const dummy = new THREE.Object3D();

    for (let side = -1; side <= 1; side += 2) {
      const curbX = side * (this.roadWidth / 2 + 1.2);
      const curb = new THREE.Mesh(this.sharedBoxGeo, curbMat);
      curb.scale.set(2.4, 0.35, this.chunkLength);
      curb.position.set(curbX, 0.15, 0);
      group.add(curb);

      // --- Kolkata Iconic Blue & White Pedestrian Safety Railings ---
      const railEdgeX = side * (this.roadWidth / 2 + 0.15);
      
      // Top Rail (Blue)
      const topRail = new THREE.Mesh(this.sharedBoxGeo, blueMat);
      topRail.scale.set(0.08, 0.08, this.chunkLength);
      topRail.position.set(railEdgeX, 1.05, 0);
      group.add(topRail);

      // Bottom Rail (Blue)
      const btmRail = new THREE.Mesh(this.sharedBoxGeo, blueMat);
      btmRail.scale.set(0.08, 0.08, this.chunkLength);
      btmRail.position.set(railEdgeX, 0.35, 0);
      group.add(btmRail);

      // Instanced Railing Pickets (All vertical bars rendered in 1 single GPU draw call!)
      const picketCount = Math.floor(this.chunkLength / 1.6);
      const instancedPickets = new THREE.InstancedMesh(this.sharedPicketGeo, whiteRailingMat, picketCount);
      let pIdx = 0;
      for (let rz = -this.chunkLength / 2 + 0.8; rz < this.chunkLength / 2; rz += 1.6) {
        dummy.position.set(railEdgeX, 0.65, rz);
        dummy.scale.set(1, 1, 1);
        dummy.rotation.set(0, 0, 0);
        dummy.updateMatrix();
        instancedPickets.setMatrixAt(pIdx++, dummy.matrix);
      }
      instancedPickets.instanceMatrix.needsUpdate = true;
      group.add(instancedPickets);

      // Highway Streetlight Poles every 30m
      for (let z = -this.chunkLength / 2 + 15; z < this.chunkLength / 2; z += 30.0) {
        const poleGroup = new THREE.Group();
        const pole = new THREE.Mesh(this.sharedCylinderGeo, poleMat);
        pole.scale.set(0.14, 7.5, 0.14);
        pole.position.y = 3.75;
        poleGroup.add(pole);

        // Overhanging arm with lamp
        const arm = new THREE.Mesh(this.sharedBoxGeo, poleMat);
        arm.scale.set(2.2, 0.15, 0.15);
        arm.position.set(side * -0.9, 7.4, 0);
        poleGroup.add(arm);

        const lamp = new THREE.Mesh(this.sharedBoxGeo, lampMat);
        lamp.scale.set(0.8, 0.25, 0.45);
        lamp.position.set(side * -1.8, 7.25, 0);
        poleGroup.add(lamp);

        poleGroup.position.set(curbX, 0, z);
        group.add(poleGroup);
      }

      // Roadside Tropical Shade Trees along Sidewalk every 24m (Shared geometries)
      for (let tz = -this.chunkLength / 2 + 6; tz < this.chunkLength / 2; tz += 24.0) {
        const treeGroup = new THREE.Group();
        const treeX = side * (this.roadWidth / 2 + 2.8);

        // Trunk
        const trunk = new THREE.Mesh(this.sharedCylinderGeo, trunkMat);
        trunk.scale.set(0.28, 4.0, 0.28);
        trunk.position.y = 2.0;
        treeGroup.add(trunk);

        // Lush Green Canopy
        const canopy1 = new THREE.Mesh(this.sharedSphereGeo, leafMat1);
        canopy1.position.set(0, 4.6, 0);
        canopy1.scale.set(2.3, 1.9, 2.3);
        treeGroup.add(canopy1);

        const canopy2 = new THREE.Mesh(this.sharedSphereGeo, leafMat2);
        canopy2.position.set(0.3, 5.7, -0.2);
        canopy2.scale.set(1.7, 1.4, 1.7);
        treeGroup.add(canopy2);

        treeGroup.position.set(treeX, 0, tz);
        group.add(treeGroup);
      }
    }

    // Commercial Kolkata Buildings & Ground-Floor Storefronts along Sidewalks
    const bldgColors = [0xdbeafe, 0xfef3c7, 0xfce7f3, 0xe0e7ff, 0xf3f4f6, 0xfee2e2];
    let signIdx = 0;

    for (let side = -1; side <= 1; side += 2) {
      const bldgX = side * (this.roadWidth / 2 + 9.5);
      for (let z = -this.chunkLength / 2 + 15; z < this.chunkLength / 2; z += 24.0) {
        const bHeight = 12 + Math.random() * 16;
        const bWidth = 8 + Math.random() * 3;
        const col = bldgColors[Math.floor(Math.random() * bldgColors.length)];
        const bMat = new THREE.MeshLambertMaterial({ color: col });
        const building = new THREE.Mesh(this.sharedBoxGeo, bMat);
        building.scale.set(bWidth, bHeight, 20);
        building.position.set(bldgX, bHeight / 2, z);
        group.add(building);

        // Storefront on Ground Floor facing the Highway
        const facadeX = side * (this.roadWidth / 2 + 9.5 - (bWidth / 2) - 0.05);

        // Roll-up Shutter
        const shutter = new THREE.Mesh(this.sharedBoxGeo, shutterMat);
        shutter.scale.set(0.1, 3.2, 7.5);
        shutter.position.set(facadeX, 1.6, z);
        group.add(shutter);

        // Striped Awning (Canopy)
        const awning = new THREE.Mesh(this.sharedBoxGeo, awningMat);
        awning.scale.set(1.8, 0.2, 8.2);
        awning.rotation.z = side * 0.25;
        awning.position.set(facadeX + side * -0.8, 3.5, z);
        group.add(awning);

        // Storefront Signboard (HDFC Bank, Maa Tara Sweets, etc.)
        if (this.shopSigns.length > 0) {
          const signTex = this.shopSigns[signIdx % this.shopSigns.length];
          signIdx++;
          const signMat = new THREE.MeshBasicMaterial({ map: signTex });
          const signGeo = new THREE.PlaneGeometry(8.0, 1.6);
          signGeo.rotateY(side === 1 ? -Math.PI / 2 : Math.PI / 2);
          const signMesh = new THREE.Mesh(signGeo, signMat);
          signMesh.position.set(facadeX + side * -0.15, 4.5, z);
          group.add(signMesh);
        }
      }
    }

    this.scene.add(group);
    return { group: group, z: chunkZ };
  }

  // Spawn obstacles along a given Z segment
  spawnChunkObstacles(chunkZ) {
    // 1. Chai Tapri (Tea Stall)
    if (Math.random() > 0.4) {
      const tapriX = (Math.random() > 0.5 ? 1 : -1) * (10.0 + Math.random() * 2.2);
      this.spawnChaiTapri(tapriX, chunkZ + (Math.random() - 0.5) * 60);
    }

    // 2. Fruit Stall
    if (Math.random() > 0.4) {
      const cartX = (Math.random() > 0.5 ? 1 : -1) * (4.5 + Math.random() * 5.5);
      this.spawnFruitCart(cartX, chunkZ + (Math.random() - 0.5) * 60);
    }

    // 3. Toll Plaza
    if (Math.random() > 0.65) {
      this.spawnTollBarrier(chunkZ + (Math.random() - 0.5) * 40);
    }

    // 4. Bollywood Hero Hoarding Cutout
    if (Math.random() > 0.55) {
      const heroX = (Math.random() > 0.5 ? 3.8 : -3.8);
      this.spawnBollywoodCutout(heroX, chunkZ + (Math.random() - 0.5) * 50);
    }

    // 5. Wedding Barat Band
    if (Math.random() > 0.6) {
      const bandX = (Math.random() > 0.5 ? 10.5 : -10.5);
      this.spawnWeddingBand(bandX, chunkZ + (Math.random() - 0.5) * 45);
    }

    // 6. Stunt Ramp
    if (Math.random() > 0.5) {
      const rampX = (Math.random() > 0.5 ? 5.5 : -5.5);
      this.spawnStuntRamp(rampX, chunkZ + (Math.random() - 0.5) * 45);
    }

    // 7. Mud Puddle
    if (Math.random() > 0.5) {
      const pudX = (Math.random() - 0.5) * 16.0;
      this.spawnMudPuddle(pudX, chunkZ + (Math.random() - 0.5) * 55);
    }

    // 8. Sacred Cow
    if (Math.random() > 0.6) {
      const cowX = (Math.random() - 0.5) * 14.0;
      this.spawnHolyCow(cowX, chunkZ + (Math.random() - 0.5) * 50);
    }
  }

  clearAllObstacles() {
    this.smashables.forEach(s => {
      if (s.mesh && s.mesh.parent) s.mesh.parent.remove(s.mesh);
      this.disposeObject(s.mesh);
    });
    this.smashables = [];

    this.stuntRamps.forEach(r => {
      if (r.mesh && r.mesh.parent) r.mesh.parent.remove(r.mesh);
      this.disposeObject(r.mesh);
    });
    this.stuntRamps = [];

    this.cows.forEach(c => {
      if (c.mesh && c.mesh.parent) c.mesh.parent.remove(c.mesh);
      this.disposeObject(c.mesh);
    });
    this.cows = [];

    this.weddingBands.forEach(b => {
      if (b.mesh && b.mesh.parent) b.mesh.parent.remove(b.mesh);
      this.disposeObject(b.mesh);
    });
    this.weddingBands = [];

    this.puddles.forEach(p => {
      if (p.mesh && p.mesh.parent) p.mesh.parent.remove(p.mesh);
      this.disposeObject(p.mesh);
    });
    this.puddles = [];

    this.debrisPool.forEach(d => {
      d.mesh.visible = false;
      d.life = 0;
    });
  }

  reset() {
    this.clearAllObstacles();
    for (let i = 0; i < this.numChunks; i++) {
      const chunkZ = -i * this.chunkLength;
      this.chunks[i].group.position.z = chunkZ;
      this.spawnChunkObstacles(chunkZ);
    }
    if (this.rainParticles) {
      this.rainParticles.position.set(0, 0, 0);
    }
  }

  // Roadside Chai Tapri (Tea Stall)
  spawnChaiTapri(x, z) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    // Wooden stall frame with corrugated tin roof
    const stallGeo = new THREE.BoxGeometry(2.6, 2.2, 1.8);
    const stallMat = new THREE.MeshLambertMaterial({ color: 0x78350f });
    const stall = new THREE.Mesh(stallGeo, stallMat);
    stall.position.y = 1.1;
    group.add(stall);

    // Aluminum tin roof
    const roofGeo = new THREE.BoxGeometry(3.0, 0.15, 2.2);
    const roofMat = new THREE.MeshLambertMaterial({ color: 0x94a3b8 });
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.y = 2.25;
    group.add(roof);

    // Boiling Aluminum Tea Kettle on bench
    const kettleGeo = new THREE.CylinderGeometry(0.22, 0.28, 0.45, 12);
    const kettleMat = new THREE.MeshLambertMaterial({ color: 0xf1f5f9 });
    const kettle = new THREE.Mesh(kettleGeo, kettleMat);
    kettle.position.set(0.4, 1.25, 0.4);
    group.add(kettle);

    this.scene.add(group);
    this.smashables.push({
      type: 'CHAI_TAPRI',
      mesh: group,
      radius: 1.9,
      smashed: false
    });
  }

  // Giant Bollywood Movie Hero Wooden Cutout
  spawnBollywoodCutout(x, z) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    // Massive wooden billboard stand
    const boardGeo = new THREE.BoxGeometry(3.6, 4.2, 0.22);
    const boardMat = new THREE.MeshLambertMaterial({ color: 0xfacc15 });
    const board = new THREE.Mesh(boardGeo, boardMat);
    board.position.y = 2.1;
    group.add(board);

    // Painted Hero silhouette cutout
    const heroGeo = new THREE.BoxGeometry(1.6, 3.2, 0.25);
    const heroMat = new THREE.MeshLambertMaterial({ color: 0xef4444 });
    const hero = new THREE.Mesh(heroGeo, heroMat);
    hero.position.set(0, 2.0, 0.05);
    group.add(hero);

    this.scene.add(group);
    this.smashables.push({
      type: 'BOLLYWOOD_CUTOUT',
      mesh: group,
      radius: 2.1,
      smashed: false
    });
  }

  // Fruit Thela
  spawnFruitCart(x, z) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    const cartGeo = new THREE.BoxGeometry(2.4, 0.4, 1.8);
    const cartMat = new THREE.MeshLambertMaterial({ color: 0x78350f });
    const cart = new THREE.Mesh(cartGeo, cartMat);
    cart.position.y = 0.75;
    group.add(cart);

    const melonGeo = new THREE.SphereGeometry(0.24, 8, 8);
    const melonMat = new THREE.MeshLambertMaterial({ color: 0x16a34a });
    const pumpkinMat = new THREE.MeshLambertMaterial({ color: 0xf97316 });

    for (let i = 0; i < 6; i++) {
      const m = new THREE.Mesh(melonGeo, (i % 2 === 0 ? melonMat : pumpkinMat));
      m.position.set((i % 3 - 1) * 0.65, 1.15, (Math.floor(i / 3) - 0.5) * 0.6);
      group.add(m);
    }

    this.scene.add(group);
    this.smashables.push({
      type: 'FRUIT_CART',
      mesh: group,
      radius: 1.8,
      smashed: false
    });
  }

  // Toll Barrier Plaza (Multi-Lane 24m Span)
  spawnTollBarrier(z) {
    const group = new THREE.Group();
    group.position.set(0, 0, z);

    const boothPositions = [-12.2, -4.5, 4.5, 12.2];
    boothPositions.forEach(bx => {
      const boothGeo = new THREE.BoxGeometry(1.8, 3.8, 2.8);
      const booth = new THREE.Mesh(boothGeo, new THREE.MeshLambertMaterial({ color: 0xf1f5f9 }));
      booth.position.set(bx, 1.9, 0);
      group.add(booth);

      // Yellow/Black crash barrier curb under booth
      const cCurbGeo = new THREE.BoxGeometry(2.2, 0.45, 3.4);
      const cCurb = new THREE.Mesh(cCurbGeo, new THREE.MeshLambertMaterial({ color: 0xfacc15 }));
      cCurb.position.set(bx, 0.22, 0);
      group.add(cCurb);
    });

    // Overhead truss gantry
    const trussGeo = new THREE.BoxGeometry(this.roadWidth + 3.0, 0.65, 0.65);
    const trussMat = new THREE.MeshLambertMaterial({ color: 0x334155 });
    const truss = new THREE.Mesh(trussGeo, trussMat);
    truss.position.set(0, 4.2, 0);
    group.add(truss);

    const barGeo = new THREE.BoxGeometry(this.roadWidth + 1.0, 0.32, 0.32);
    const bar = new THREE.Mesh(barGeo, new THREE.MeshLambertMaterial({ color: 0xef4444 }));
    bar.position.set(0, 1.4, 0);
    group.add(bar);

    this.scene.add(group);
    this.smashables.push({
      type: 'TOLL_BARRIER',
      mesh: group,
      radius: 3.2,
      smashed: false
    });
  }

  // Wedding Barat Brass Band
  spawnWeddingBand(x, z) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    // 3 Musicians in bright red uniforms
    for (let i = 0; i < 3; i++) {
      const man = new THREE.Group();
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.22, 0.65, 8), new THREE.MeshLambertMaterial({ color: 0xef4444 }));
      body.position.y = 0.4;
      man.add(body);

      const head = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 8), new THREE.MeshLambertMaterial({ color: 0xfbbf24 }));
      head.position.y = 0.85;
      man.add(head);

      man.position.set(0, 0, (i - 1) * 1.1);
      group.add(man);
    }

    this.scene.add(group);
    this.weddingBands.push({
      mesh: group,
      radius: 2.2,
      cleared: false
    });
  }

  // Mud Puddle on Asphalt
  spawnMudPuddle(x, z) {
    const pudGeo = new THREE.CircleGeometry(1.8, 14);
    pudGeo.rotateX(-Math.PI / 2);
    const pudMat = new THREE.MeshBasicMaterial({ color: 0x451a03, transparent: true, opacity: 0.85 });
    const pud = new THREE.Mesh(pudGeo, pudMat);
    pud.position.set(x, 0.03, z);

    this.scene.add(pud);
    this.puddles.push({
      mesh: pud,
      radius: 1.8,
      used: false
    });
  }

  spawnStuntRamp(x, z) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    const rampGeo = new THREE.BoxGeometry(3.2, 1.5, 5.0);
    rampGeo.rotateX(0.28);
    const ramp = new THREE.Mesh(rampGeo, new THREE.MeshLambertMaterial({ color: 0xe11d48 }));
    ramp.position.y = 0.45;
    group.add(ramp);

    this.scene.add(group);
    this.stuntRamps.push({
      mesh: group,
      radius: 2.4,
      used: false
    });
  }

  spawnHolyCow(x, z) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    const body = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.85, 2.0), new THREE.MeshLambertMaterial({ color: 0xf8fafc }));
    body.position.y = 0.6;
    group.add(body);

    const head = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.6, 0.7), new THREE.MeshLambertMaterial({ color: 0xf8fafc }));
    head.position.set(0, 0.95, -1.05);
    group.add(head);

    this.scene.add(group);
    this.cows.push({
      mesh: group,
      radius: 1.8,
      scared: false,
      runDir: (x > 0 ? 1 : -1)
    });
  }

  // Clean GPU memory when obstacles are removed
  disposeObject(obj) {
    if (!obj) return;
    obj.traverse(child => {
      if (child.geometry && !child.geometry._isShared) {
        child.geometry.dispose();
      }
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach(m => { if (!m._isShared) m.dispose(); });
        } else {
          if (!child.material._isShared) child.material.dispose();
        }
      }
    });
  }

  honkScareCows(busPos) {
    let scaredCount = 0;
    const bz = busPos.z;
    const bx = busPos.x;

    this.cows.forEach(cow => {
      if (cow.scared) return;
      const dz = Math.abs(cow.mesh.position.z - bz);
      if (dz < 40.0) {
        const dx = Math.abs(cow.mesh.position.x - bx);
        if (dx < 18.0) {
          cow.scared = true;
          scaredCount++;
        }
      }
    });

    // Also scare Wedding Barat musicians
    this.weddingBands.forEach(b => {
      if (b.cleared) return;
      const dz = Math.abs(b.mesh.position.z - bz);
      if (dz < 42.0) {
        b.cleared = true;
        b.mesh.position.x += (b.mesh.position.x > 0 ? 3.5 : -3.5);
      }
    });

    return scaredCount;
  }

  // Fast axis-aligned early rejection (Avoids Math.sqrt on every frame)
  checkSmashables(busPos) {
    const bz = busPos.z;
    const bx = busPos.x;
    for (let i = 0; i < this.smashables.length; i++) {
      const s = this.smashables[i];
      if (s.smashed) continue;
      const dz = Math.abs(s.mesh.position.z - bz);
      if (dz > 4.5) continue;
      const dx = Math.abs(s.mesh.position.x - bx);
      if (dx < s.radius + 1.2) {
        s.smashed = true;
        s.mesh.visible = false;
        this.spawnDebrisExplosion(s.mesh.position, 8);
        return s;
      }
    }
    return null;
  }

  checkPuddles(busPos) {
    const bz = busPos.z;
    const bx = busPos.x;
    for (let i = 0; i < this.puddles.length; i++) {
      const p = this.puddles[i];
      if (p.used) continue;
      const dz = Math.abs(p.mesh.position.z - bz);
      if (dz > 3.0) continue;
      const dx = Math.abs(p.mesh.position.x - bx);
      if (dx < p.radius + 1.2) {
        p.used = true;
        return true;
      }
    }
    return false;
  }

  checkStuntRamps(busPos) {
    const bz = busPos.z;
    const bx = busPos.x;
    for (let i = 0; i < this.stuntRamps.length; i++) {
      const r = this.stuntRamps[i];
      if (r.used) continue;
      const dz = Math.abs(r.mesh.position.z - bz);
      if (dz > 3.0) continue;
      const dx = Math.abs(r.mesh.position.x - bx);
      if (dx < 2.2) {
        r.used = true;
        return true;
      }
    }
    return false;
  }

  checkCowHit(busPos) {
    const bz = busPos.z;
    const bx = busPos.x;
    for (let i = 0; i < this.cows.length; i++) {
      const c = this.cows[i];
      if (c.scared) continue;
      const dz = Math.abs(c.mesh.position.z - bz);
      if (dz > 3.2) continue;
      const dx = Math.abs(c.mesh.position.x - bx);
      if (dx < 1.8) {
        c.scared = true;
        return true;
      }
    }
    return false;
  }

  // DYNAMIC DAY/NIGHT & WEATHER
  setWeather(mode) {
    this.currentWeather = mode;

    if (mode === 'SUNSET') {
      this.scene.background.setHex(0xf97316);
      this.scene.fog.color.setHex(0xf97316);
      if (this.rainParticles) this.rainParticles.visible = false;
    } else if (mode === 'NIGHT') {
      this.scene.background.setHex(0x090d16);
      this.scene.fog.color.setHex(0x090d16);
      if (this.rainParticles) this.rainParticles.visible = false;
    } else if (mode === 'RAIN') {
      this.scene.background.setHex(0x475569);
      this.scene.fog.color.setHex(0x475569);
      if (this.rainParticles) this.rainParticles.visible = true;
    } else {
      // SUNNY DAY
      this.scene.background.setHex(0x38bdf8);
      this.scene.fog.color.setHex(0x38bdf8);
      if (this.rainParticles) this.rainParticles.visible = false;
    }
  }

  update(dt, busPos) {
    // 1. Recycle road chunks
    this.chunks.forEach(chunk => {
      if (chunk.group.position.z > busPos.z + this.chunkLength * 1.5) {
        const furthestZ = Math.min(...this.chunks.map(c => c.group.position.z));
        const newZ = furthestZ - this.chunkLength;
        chunk.group.position.z = newZ;
        this.spawnChunkObstacles(newZ);
      }
    });

    // Clean up trailing obstacles far behind the bus to prevent memory leak and visual bugs
    const cullZ = busPos.z + 90.0;
    for (let i = this.smashables.length - 1; i >= 0; i--) {
      const s = this.smashables[i];
      if (s.mesh.position.z > cullZ) {
        if (s.mesh.parent) s.mesh.parent.remove(s.mesh);
        this.disposeObject(s.mesh);
        this.smashables.splice(i, 1);
      }
    }
    for (let i = this.stuntRamps.length - 1; i >= 0; i--) {
      const r = this.stuntRamps[i];
      if (r.mesh.position.z > cullZ) {
        if (r.mesh.parent) r.mesh.parent.remove(r.mesh);
        this.disposeObject(r.mesh);
        this.stuntRamps.splice(i, 1);
      }
    }
    for (let i = this.cows.length - 1; i >= 0; i--) {
      const c = this.cows[i];
      if (c.mesh.position.z > cullZ) {
        if (c.mesh.parent) c.mesh.parent.remove(c.mesh);
        this.disposeObject(c.mesh);
        this.cows.splice(i, 1);
      }
    }
    for (let i = this.weddingBands.length - 1; i >= 0; i--) {
      const b = this.weddingBands[i];
      if (b.mesh.position.z > cullZ) {
        if (b.mesh.parent) b.mesh.parent.remove(b.mesh);
        this.disposeObject(b.mesh);
        this.weddingBands.splice(i, 1);
      }
    }
    for (let i = this.puddles.length - 1; i >= 0; i--) {
      const p = this.puddles[i];
      if (p.mesh.position.z > cullZ) {
        if (p.mesh.parent) p.mesh.parent.remove(p.mesh);
        this.disposeObject(p.mesh);
        this.puddles.splice(i, 1);
      }
    }

    // 2. Animate rain particles following the bus
    if (this.currentWeather === 'RAIN' && this.rainParticles) {
      this.rainParticles.position.x = busPos.x;
      this.rainParticles.position.z = busPos.z;
      const pos = this.rainParticles.geometry.attributes.position.array;
      for (let i = 1; i < pos.length; i += 3) {
        pos[i] -= dt * 38.0;
        if (pos[i] < 0) pos[i] = 30.0;
      }
      this.rainParticles.geometry.attributes.position.needsUpdate = true;
    }

    // 3. Cows running away
    this.cows.forEach(cow => {
      if (cow.scared && Math.abs(cow.mesh.position.x) < 11.0) {
        cow.mesh.position.x += cow.runDir * dt * 9.0;
      }
    });

    // 4. Debris particles
    this.debrisPool.forEach(d => {
      if (!d.mesh.visible) return;
      d.life += dt;
      if (d.life >= d.maxLife) {
        d.mesh.visible = false;
      } else {
        d.vel.y -= 19.0 * dt;
        d.mesh.position.addScaledVector(d.vel, dt);
        d.mesh.rotation.x += d.rotVel.x * dt;
        d.mesh.rotation.y += d.rotVel.y * dt;
        if (d.mesh.position.y < 0.1) {
          d.mesh.position.y = 0.1;
          d.vel.y *= -0.3;
        }
      }
    });
  }
}

window.DesiCity = DesiCity;
