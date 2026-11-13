/* =========================================================
   FUNNY DELIVERY RIDER 3D - EXPANSIVE CITY & TRAFFIC RULES
   6x6 Urban Grid, 16 Traffic Signal Intersections,
   Dynamic Shop Pickups, Distant Residential Dropoffs,
   150m Sky Beacons & Hazard Perimeter Barriers
   ========================================================= */

class CityManager {
  constructor(scene) {
    this.scene = scene;
    this.blockSize = 60; // Size of each block
    this.streetWidth = 24; // Width of 2-way road
    this.gridSize = 6; // 6x6 grid = 25 rich city blocks
    this.buildings = [];
    this.shops = [];
    this.houses = [];
    this.trafficSignals = [];
    this.beacons = {};
    this.customerMesh = null;
    this.pickupIcon = null;
    this.pickupRings = [];
    this.dropoffRings = [];

    // New Features: Speed Bumps, Dogs, Power-Ups & Weather
    this.speedBumps = [];
    this.stuntRamps = [];
    this.puddles = [];
    this.speedTraps = [];
    this.lastSpeedTrapTime = 0;
    this.weddingParty = null;
    this.policeNaka = null;
    this.lastPuddleTime = 0;
    this.lastDholTime = 0;

    this.dogs = [];
    this.powerUps = [];
    this.rainMesh = null;
    this.weather = 'SUNNY';

    // Street step and urban boundary
    this.step = this.blockSize + this.streetWidth; // 84m
    this.half = (this.gridSize - 1) * this.step / 2; // 210m
    this.cityExtent = this.half + this.step / 2; // ~252m

    this.lastShopName = null;
    this.lastHouseName = null;
  }

  buildCity() {
    this.createDistantHorizon();
    this.createGroundAndRoads();
    this.createCityBlocks();
    this.createStreetFurniture();
    this.createTrafficSignals();
    this.createPerimeterBarriers();
    this.createSpeedBumps();
    this.createStuntRamps();
    this.createPotholesAndPuddles();
    this.createWeddingProcession();
    this.createPoliceNaka();
    this.createSpeedTrapCamera();
    this.createStreetDogs();
    this.createPowerUps();
    this.createRainSystem();
    this.createObjectiveBeacons();
  }

  // Prevents blank horizon: Distant mountains, outer suburban terrain and city skyline
  createDistantHorizon() {
    const terrainGeo = new THREE.PlaneGeometry(2800, 2800);
    const terrainMat = new THREE.MeshStandardMaterial({
      color: 0x166534, // Lush green suburban outskirts
      roughness: 0.95
    });
    const terrain = new THREE.Mesh(terrainGeo, terrainMat);
    terrain.rotation.x = -Math.PI / 2;
    terrain.position.y = -0.05;
    this.scene.add(terrain);

    // Distant mountain silhouettes
    const mountainMat = new THREE.MeshStandardMaterial({
      color: 0x0f3b28,
      roughness: 0.9,
      flatShading: true
    });

    const mtnCount = 28;
    const mtnRadius = 780;
    for (let i = 0; i < mtnCount; i++) {
      const angle = (i / mtnCount) * Math.PI * 2;
      const dist = mtnRadius + (Math.random() - 0.5) * 80;
      const mx = Math.cos(angle) * dist;
      const mz = Math.sin(angle) * dist;
      const mHeight = 90 + Math.random() * 120;
      const mRadius = 70 + Math.random() * 60;

      const mGeo = new THREE.ConeGeometry(mRadius, mHeight, 6);
      const mtn = new THREE.Mesh(mGeo, mountainMat);
      mtn.position.set(mx, mHeight / 2 - 5, mz);
      this.scene.add(mtn);
    }

    // Distant City Skyline Towers
    const towerMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.7
    });
    for (let t = 0; t < 24; t++) {
      const tx = (t - 12) * 55;
      const tz = 520 + (t % 3) * 45;
      const th = 80 + (t % 5) * 35;
      const tower = new THREE.Mesh(new THREE.BoxGeometry(32, th, 32), towerMat);
      tower.position.set(tx, th / 2, tz);
      this.scene.add(tower);
    }
  }

  createGroundAndRoads() {
    const totalRoadSize = this.cityExtent * 2 + 60; // ~564m

    const groundGeo = new THREE.PlaneGeometry(totalRoadSize, totalRoadSize);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.85
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    this.scene.add(ground);

    const yellowStripeMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });
    const whiteStripeMat = new THREE.MeshBasicMaterial({ color: 0xf8fafc });

    // Avenues (along Z axis)
    for (let i = 0; i < this.gridSize; i++) {
      const x = -this.half + i * this.step;

      // Double yellow center divider
      const lineGeo = new THREE.PlaneGeometry(0.35, totalRoadSize);
      const lineL = new THREE.Mesh(lineGeo, yellowStripeMat);
      lineL.rotation.x = -Math.PI / 2;
      lineL.position.set(x - 0.28, 0.02, 0);
      this.scene.add(lineL);

      const lineR = new THREE.Mesh(lineGeo, yellowStripeMat);
      lineR.rotation.x = -Math.PI / 2;
      lineR.position.set(x + 0.28, 0.02, 0);
      this.scene.add(lineR);

      // White lane dashes
      for (let d = -totalRoadSize / 2; d < totalRoadSize / 2; d += 8) {
        const dashGeo = new THREE.PlaneGeometry(0.2, 4);
        const dash1 = new THREE.Mesh(dashGeo, whiteStripeMat);
        dash1.rotation.x = -Math.PI / 2;
        dash1.position.set(x - 6.0, 0.025, d);
        this.scene.add(dash1);

        const dash2 = new THREE.Mesh(dashGeo, whiteStripeMat);
        dash2.rotation.x = -Math.PI / 2;
        dash2.position.set(x + 6.0, 0.025, d);
        this.scene.add(dash2);
      }
    }

    // Streets (along X axis)
    for (let j = 0; j < this.gridSize; j++) {
      const z = -this.half + j * this.step;

      const lineGeo = new THREE.PlaneGeometry(totalRoadSize, 0.35);
      const line = new THREE.Mesh(lineGeo, yellowStripeMat);
      line.rotation.x = -Math.PI / 2;
      line.position.set(0, 0.02, z);
      this.scene.add(line);
    }
  }

  createCityBlocks() {
    const blockGeo = new THREE.BoxGeometry(this.blockSize, 0.45, this.blockSize);
    const sidewalkMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.65 });

    const buildingColors = [
      0x0284c7, 0xef4444, 0xf97316, 0x10b981, 0x8b5cf6,
      0x0f172a, 0xec4899, 0x64748b, 0x0d9488, 0xeab308
    ];

    const shopCatalog = [
      { name: 'Royal Biryani Hub 🍗', item: '2x Chicken Dum Biryani + Raita + Coke' },
      { name: 'Pizza Blast 🍕', item: '1x Large Cheese Burst Farmhouse Pizza' },
      { name: 'Blinkit 10-Min Mart ⚡', item: 'Urgent Grocery Crate: Milk, Eggs, Bread & Butter' },
      { name: 'Chai & Samosa Tapri ☕', item: '6x Kadak Masala Chai + 4x Garam Samosa' },
      { name: 'Burger Galaxy 🍔', item: '3x Double Cheese Crunch Burgers + Peri-Peri Fries' },
      { name: 'Spicy Roll Corner 🌯', item: '4x Kolkata Egg Chicken Rolls + Green Chutney' },
      { name: 'Ice Cream Bliss 🍨', item: 'Family Belgian Chocolate Tub + 2 Waffle Cones' },
      { name: 'Momos Junction 🥟', item: '16x Steamed Darjeeling Chicken Momos + Schezwan' },
      { name: 'Swiggy Instamart 🛒', item: 'Ice Cubes, Cold Drinks & Party Snacks Pack' },
      { name: 'Tandoori Nights 🔥', item: 'Butter Chicken Handi + 4x Garlic Naan' },
      { name: 'Dosa Express 🥞', item: '2x Mysore Masala Dosa + Idli Sambar Platter' },
      { name: 'Cold Coffee Cafe 🥤', item: '2x Thick Hazelnut Frappe + Chocolate Brownie' }
    ];

    const customerNames = [
      'Rahul Sharma', 'Priya Verma', 'Aman Patel', 'Auntie Ji (Flat 402)',
      'Dr. Anirban Roy', 'Sneha Bannerjee', 'Tech Office 5th Floor', 'Vikram Mehta',
      'Pooja Hegde', 'Rohan Sengupta', 'Uncle Bose (Floor 3)', 'Hostel Room 108'
    ];

    let shopIdx = 0;
    let custIdx = 0;

    for (let bx = 0; bx < this.gridSize - 1; bx++) {
      for (let bz = 0; bz < this.gridSize - 1; bz++) {
        const cx = -this.half + bx * this.step + this.step / 2;
        const cz = -this.half + bz * this.step + this.step / 2;

        const sidewalk = new THREE.Mesh(blockGeo, sidewalkMat);
        sidewalk.position.set(cx, 0.22, cz);
        this.scene.add(sidewalk);

        const subCount = 2;
        const subW = (this.blockSize - 5) / subCount;
        const subD = (this.blockSize - 5) / subCount;

        for (let sx = 0; sx < subCount; sx++) {
          for (let sz = 0; sz < subCount; sz++) {
            const px = cx - (this.blockSize / 2) + 2.5 + sx * subW + subW / 2;
            const pz = cz - (this.blockSize / 2) + 2.5 + sz * subD + subD / 2;

            const height = 18 + Math.random() * 34;
            const col = buildingColors[Math.floor(Math.random() * buildingColors.length)];
            const bldgMat = new THREE.MeshStandardMaterial({ color: col, roughness: 0.45 });
            const bldg = new THREE.Mesh(new THREE.BoxGeometry(subW - 1.8, height, subD - 1.8), bldgMat);
            bldg.position.set(px, height / 2 + 0.45, pz);
            this.scene.add(bldg);

            const isShop = (sx === 0 && sz === 0);
            if (isShop) {
              const shopData = shopCatalog[shopIdx % shopCatalog.length];
              shopIdx++;

              // Shop front sign facing the South street
              const signMesh = new THREE.Mesh(
                new THREE.BoxGeometry(subW * 0.82, 2.6, 0.8),
                new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 })
              );
              signMesh.position.set(px, 3.2, cz - this.blockSize / 2 + 0.4);
              this.scene.add(signMesh);

              // Striped awning canopy over sidewalk
              const awningCol = (shopIdx % 2 === 0) ? 0xdc2626 : 0xf59e0b;
              const awning = new THREE.Mesh(
                new THREE.BoxGeometry(subW * 0.86, 0.4, 3.0),
                new THREE.MeshStandardMaterial({ color: awningCol })
              );
              awning.rotation.x = -0.22;
              awning.position.set(px, 4.4, cz - this.blockSize / 2 - 1.2);
              this.scene.add(awning);

              // 100% ROADSIDE CURB PICKUP: Right on the street asphalt, 3.8m past the curb line!
              const roadsideZ = cz - (this.blockSize / 2 + 3.8);
              this.shops.push({
                name: shopData.name,
                item: shopData.item,
                pos: new THREE.Vector3(px, 0, roadsideZ)
              });
            } else if (sx === 1 && sz === 1) {
              // Residential apartment for customer delivery dropoff facing North street
              const cust = customerNames[custIdx % customerNames.length];
              custIdx++;
              const aptName = `Tower ${String.fromCharCode(65 + bx)} (Flat ${101 + bz * 20})`;

              // 100% ROADSIDE CURB DROPOFF: Right on the North street asphalt!
              const roadsideZ = cz + (this.blockSize / 2 + 3.8);
              this.houses.push({
                customer: cust,
                address: aptName,
                pos: new THREE.Vector3(px, 0, roadsideZ)
              });
            } else if (sx === 1 && sz === 0) {
              // East avenue roadside dropoff
              const cust = customerNames[custIdx % customerNames.length];
              custIdx++;
              const aptName = `Residency Block ${bx + 1} (Door #${10 + bz * 4})`;
              const roadsideX = cx + (this.blockSize / 2 + 3.8);
              this.houses.push({
                customer: cust,
                address: aptName,
                pos: new THREE.Vector3(roadsideX, 0, pz)
              });
            } else {
              // West avenue roadside dropoff
              const cust = customerNames[custIdx % customerNames.length];
              custIdx++;
              const aptName = `Greenfield Court ${bz + 1} (Villa #${bx * 3 + 1})`;
              const roadsideX = cx - (this.blockSize / 2 + 3.8);
              this.houses.push({
                customer: cust,
                address: aptName,
                pos: new THREE.Vector3(roadsideX, 0, pz)
              });
            }

            this.buildings.push({
              x: px,
              z: pz,
              w: subW - 1.8,
              d: subD - 1.8,
              h: height,
              isShop
            });
          }
        }
      }
    }
  }

  createStreetFurniture() {
    const lampMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8 });
    const bulbMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
    const treeTrunkMat = new THREE.MeshStandardMaterial({ color: 0x5a3d28, roughness: 0.9 });
    const treeLeavesMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.7 });

    for (let bx = 0; bx < this.gridSize - 1; bx++) {
      for (let bz = 0; bz < this.gridSize - 1; bz++) {
        const cx = -this.half + bx * this.step + this.step / 2;
        const cz = -this.half + bz * this.step + this.step / 2;
        const bHalf = this.blockSize / 2;

        // Streetlamps at corners
        const corners = [
          { lx: cx - bHalf + 1.2, lz: cz - bHalf + 1.2 },
          { lx: cx + bHalf - 1.2, lz: cz - bHalf + 1.2 },
          { lx: cx - bHalf + 1.2, lz: cz + bHalf - 1.2 },
          { lx: cx + bHalf - 1.2, lz: cz + bHalf - 1.2 }
        ];

        corners.forEach(c => {
          const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 7.5, 8), lampMat);
          pole.position.set(c.lx, 3.75, c.lz);
          this.scene.add(pole);

          const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.38, 8, 8), bulbMat);
          bulb.position.set(c.lx + (c.lx > cx ? -0.8 : 0.8), 7.2, c.lz);
          this.scene.add(bulb);
        });

        // Curbside Trees along block edges
        const treePositions = [
          { tx: cx, tz: cz - bHalf - 1.5 },
          { tx: cx, tz: cz + bHalf + 1.5 },
          { tx: cx - bHalf - 1.5, tz: cz },
          { tx: cx + bHalf + 1.5, tz: cz }
        ];

        treePositions.forEach(tp => {
          const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.35, 3.5, 8), treeTrunkMat);
          trunk.position.set(tp.tx, 1.75, tp.tz);
          this.scene.add(trunk);

          const leaves = new THREE.Mesh(new THREE.DodecahedronGeometry(1.8, 1), treeLeavesMat);
          leaves.position.set(tp.tx, 4.4, tp.tz);
          this.scene.add(leaves);
        });
      }
    }
  }

  // 16 3D Traffic Signals at City Street Intersections
  createTrafficSignals() {
    const postMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8 });
    const boxMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3 });

    // Inner intersections (i from 1 to 4, j from 1 to 4) = 16 cross-intersections
    for (let i = 1; i < this.gridSize - 1; i++) {
      for (let j = 1; j < this.gridSize - 1; j++) {
        const ix = -this.half + i * this.step;
        const iz = -this.half + j * this.step;

        const group = new THREE.Group();
        group.position.set(ix + 10.5, 0, iz + 10.5);

        // Vertical pole
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.25, 8.5, 10), postMat);
        pole.position.y = 4.25;
        group.add(pole);

        // Horizontal cantilever arm over road
        const arm = new THREE.Mesh(new THREE.BoxGeometry(6.5, 0.25, 0.25), postMat);
        arm.position.set(-3.25, 8.2, 0);
        group.add(arm);

        // Signal Housing Box
        const box = new THREE.Mesh(new THREE.BoxGeometry(1.2, 3.2, 0.9), boxMat);
        box.position.set(-5.5, 7.8, 0);
        group.add(box);

        // 3 LED Bulbs: Red (top), Yellow (mid), Green (bot)
        const redMat = new THREE.MeshStandardMaterial({
          color: 0x450a0a,
          emissive: 0xef4444,
          emissiveIntensity: 0.2
        });
        const redBulb = new THREE.Mesh(new THREE.SphereGeometry(0.32, 10, 10), redMat);
        redBulb.position.set(-5.5, 8.8, 0.45);
        group.add(redBulb);

        const yellowMat = new THREE.MeshStandardMaterial({
          color: 0x422006,
          emissive: 0xfacc15,
          emissiveIntensity: 0.1
        });
        const yellowBulb = new THREE.Mesh(new THREE.SphereGeometry(0.32, 10, 10), yellowMat);
        yellowBulb.position.set(-5.5, 7.8, 0.45);
        group.add(yellowBulb);

        const greenMat = new THREE.MeshStandardMaterial({
          color: 0x052e16,
          emissive: 0x22c55e,
          emissiveIntensity: 1.2
        });
        const greenBulb = new THREE.Mesh(new THREE.SphereGeometry(0.32, 10, 10), greenMat);
        greenBulb.position.set(-5.5, 6.8, 0.45);
        group.add(greenBulb);

        this.scene.add(group);

        this.trafficSignals.push({
          id: `${i}_${j}`,
          pos: new THREE.Vector3(ix, 0, iz),
          state: 'GREEN', // 'GREEN', 'YELLOW', 'RED'
          cycleOffset: (i * 3 + j * 7) % 24, // Varied phase offset for realistic city traffic
          redMat,
          yellowMat,
          greenMat,
          hasViolatedRecently: false
        });
      }
    }
  }

  // Guardrails with yellow/black hazard striping at city limits
  createPerimeterBarriers() {
    const limit = this.cityExtent;
    const barrierMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      roughness: 0.4
    });
    const stripeMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });

    const createWallSegment = (x, z, rotY, len) => {
      const group = new THREE.Group();
      group.position.set(x, 0, z);
      group.rotation.y = rotY;

      const curb = new THREE.Mesh(new THREE.BoxGeometry(len, 0.9, 1.2), barrierMat);
      curb.position.y = 0.45;
      group.add(curb);

      for (let p = -len / 2 + 15; p < len / 2; p += 30) {
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 2.8, 8), stripeMat);
        post.position.set(p, 1.4, 0);
        group.add(post);

        const sign = new THREE.Mesh(new THREE.BoxGeometry(4.5, 1.8, 0.2), barrierMat);
        sign.position.set(p, 2.5, 0);
        group.add(sign);
      }

      this.scene.add(group);
    };

    const wallLen = limit * 2 + 10;
    createWallSegment(0, limit, 0, wallLen);
    createWallSegment(0, -limit, 0, wallLen);
    createWallSegment(limit, 0, Math.PI / 2, wallLen);
    createWallSegment(-limit, 0, Math.PI / 2, wallLen);
  }

  // 150m Soaring Sky Beacons
  createObjectiveBeacons() {
    // 1. RESTAURANT PICKUP BEACON (Emerald Green)
    const pickupGroup = new THREE.Group();

    const beamGeo = new THREE.CylinderGeometry(3.6, 3.6, 150, 16, 1, true);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.42,
      side: THREE.DoubleSide
    });
    const beam = new THREE.Mesh(beamGeo, beamMat);
    beam.position.y = 75;
    pickupGroup.add(beam);

    const coreGeo = new THREE.CylinderGeometry(0.8, 0.8, 150, 12, 1, true);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.75,
      side: THREE.DoubleSide
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.position.y = 75;
    pickupGroup.add(core);

    const ringHeights = [2, 12, 28, 55, 90, 130];
    ringHeights.forEach(rh => {
      const ringGeo = new THREE.RingGeometry(3.8, 5.8, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x34d399,
        transparent: true,
        opacity: 0.65,
        side: THREE.DoubleSide
      });
      const rMesh = new THREE.Mesh(ringGeo, ringMat);
      rMesh.rotation.x = -Math.PI / 2;
      rMesh.position.y = rh;
      pickupGroup.add(rMesh);
      this.pickupRings.push(rMesh);
    });

    const groundZoneGeo = new THREE.RingGeometry(1.0, 7.5, 32);
    const groundZone = new THREE.Mesh(groundZoneGeo, new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide
    }));
    groundZone.rotation.x = -Math.PI / 2;
    groundZone.position.y = 0.08;
    pickupGroup.add(groundZone);

    // Floating 3D Burger & Food Box Emblem
    const iconGroup = new THREE.Group();
    iconGroup.position.y = 8.5;

    const bunTop = new THREE.Mesh(
      new THREE.SphereGeometry(1.8, 14, 14, 0, Math.PI * 2, 0, Math.PI / 2),
      new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.3 })
    );
    iconGroup.add(bunTop);

    const patty = new THREE.Mesh(
      new THREE.CylinderGeometry(1.85, 1.85, 0.5, 14),
      new THREE.MeshStandardMaterial({ color: 0x451a03 })
    );
    patty.position.y = -0.3;
    iconGroup.add(patty);

    const cheese = new THREE.Mesh(
      new THREE.BoxGeometry(3.0, 0.15, 3.0),
      new THREE.MeshStandardMaterial({ color: 0xfacc15 })
    );
    cheese.position.y = -0.05;
    cheese.rotation.y = 0.4;
    iconGroup.add(cheese);

    const bunBot = new THREE.Mesh(
      new THREE.CylinderGeometry(1.7, 1.7, 0.6, 14),
      new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.3 })
    );
    bunBot.position.y = -0.7;
    iconGroup.add(bunBot);

    pickupGroup.add(iconGroup);
    pickupGroup.visible = false;
    this.scene.add(pickupGroup);

    this.beacons.pickup = pickupGroup;
    this.pickupIcon = iconGroup;

    // 2. CUSTOMER DROPOFF BEACON (Hot Crimson Red)
    const dropGroup = new THREE.Group();

    const dropBeam = new THREE.Mesh(beamGeo, new THREE.MeshBasicMaterial({
      color: 0xef4444,
      transparent: true,
      opacity: 0.44,
      side: THREE.DoubleSide
    }));
    dropBeam.position.y = 75;
    dropGroup.add(dropBeam);

    const dropCore = new THREE.Mesh(coreGeo, coreMat);
    dropCore.position.y = 75;
    dropGroup.add(dropCore);

    ringHeights.forEach(rh => {
      const ringGeo = new THREE.RingGeometry(3.8, 5.8, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xf87171,
        transparent: true,
        opacity: 0.65,
        side: THREE.DoubleSide
      });
      const rMesh = new THREE.Mesh(ringGeo, ringMat);
      rMesh.rotation.x = -Math.PI / 2;
      rMesh.position.y = rh;
      dropGroup.add(rMesh);
      this.dropoffRings.push(rMesh);
    });

    const dropGroundZone = new THREE.Mesh(groundZoneGeo, new THREE.MeshBasicMaterial({
      color: 0xef4444,
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide
    }));
    dropGroundZone.rotation.x = -Math.PI / 2;
    dropGroundZone.position.y = 0.08;
    dropGroup.add(dropGroundZone);

    // 3D Impatient Customer Avatar
    const custGroup = new THREE.Group();
    custGroup.position.y = 0;

    const custBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.7, 0.85, 2.8, 12),
      new THREE.MeshStandardMaterial({ color: 0x2563eb })
    );
    custBody.position.y = 1.6;
    custGroup.add(custBody);

    const custHead = new THREE.Mesh(
      new THREE.SphereGeometry(0.65, 14, 14),
      new THREE.MeshStandardMaterial({ color: 0xfbbf24 })
    );
    custHead.position.y = 3.6;
    custGroup.add(custHead);

    const armL = new THREE.Mesh(
      new THREE.CylinderGeometry(0.15, 0.15, 1.8, 8),
      new THREE.MeshStandardMaterial({ color: 0x2563eb })
    );
    armL.position.set(-0.95, 2.5, 0);
    custGroup.add(armL);

    const armR = new THREE.Mesh(
      new THREE.CylinderGeometry(0.15, 0.15, 1.8, 8),
      new THREE.MeshStandardMaterial({ color: 0x2563eb })
    );
    armR.position.set(0.95, 2.5, 0);
    custGroup.add(armR);

    // Floating 3D Gift Delivery Parcel Box
    const giftBox = new THREE.Mesh(
      new THREE.BoxGeometry(2.2, 2.2, 2.2),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3 })
    );
    giftBox.position.y = 6.2;
    custGroup.add(giftBox);

    custGroup.userData = { armL, armR, giftBox };
    dropGroup.add(custGroup);
    dropGroup.visible = false;
    this.scene.add(dropGroup);

    this.beacons.dropoff = dropGroup;
    this.customerMesh = custGroup;
  }

  // Pick a truly random and different shop for pickup every time
  getRandomShopPickup() {
    if (!this.shops || this.shops.length === 0) {
      return {
        name: 'Royal Biryani Hub 🍗',
        item: '2x Chicken Biryani',
        pos: new THREE.Vector3(0, 0, 40)
      };
    }

    const available = this.shops.filter(s => s.name !== this.lastShopName);
    const chosen = available[Math.floor(Math.random() * available.length)] || this.shops[0];
    this.lastShopName = chosen.name;
    return chosen;
  }

  // Pick a distant residential dropoff spot across town (minimum 100m away!)
  getRandomDropoffHouse(avoidPos, minDistance = 100) {
    if (!this.houses || this.houses.length === 0) {
      return {
        customer: 'Rahul Sharma',
        address: 'Skyline Flat 204',
        pos: new THREE.Vector3(80, 0, 80)
      };
    }

    const distant = this.houses.filter(h =>
      h.customer !== this.lastHouseName &&
      (!avoidPos || h.pos.distanceTo(avoidPos) >= minDistance)
    );

    const chosen = (distant.length > 0)
      ? distant[Math.floor(Math.random() * distant.length)]
      : this.houses[Math.floor(Math.random() * this.houses.length)];

    this.lastHouseName = chosen.customer;
    return chosen;
  }

  setPickupTarget(pos) {
    this.beacons.pickup.position.copy(pos);
    this.beacons.pickup.visible = true;
  }

  hidePickupTarget() {
    this.beacons.pickup.visible = false;
  }

  setDropoffTarget(pos) {
    this.beacons.dropoff.position.copy(pos);
    this.beacons.dropoff.visible = true;
  }

  hideDropoffTarget() {
    this.beacons.dropoff.visible = false;
  }

  // Check if rider ran through a RED traffic light at an intersection
  checkTrafficLightViolation(riderPos, riderSpeedKmh) {
    if (riderSpeedKmh < 14) return null; // Slow crawling or stopping is allowed

    for (let i = 0; i < this.trafficSignals.length; i++) {
      const sig = this.trafficSignals[i];
      const dist = Math.hypot(riderPos.x - sig.pos.x, riderPos.z - sig.pos.z);

      // Inside intersection danger zone (within 8.5m of intersection center)
      if (dist < 8.5) {
        if (sig.state === 'RED' && !sig.hasViolatedRecently) {
          sig.hasViolatedRecently = true;
          setTimeout(() => { sig.hasViolatedRecently = false; }, 6000);
          return {
            type: 'RED_LIGHT',
            fine: 50,
            pos: sig.pos
          };
        }
      }
    }
    return null;
  }

  // 1. Raised Speed Bumps (Speed Breakers with Hazard Stripes)
  createSpeedBumps() {
    const bumpMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.5 });
    const stripeMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });

    // Place speed bumps mid-block along busy avenues & streets
    for (let i = 1; i < this.gridSize - 1; i++) {
      for (let j = 1; j < this.gridSize - 1; j++) {
        if ((i + j) % 2 === 0) {
          const bx = -this.half + i * this.step;
          const bz = -this.half + j * this.step + this.step / 2;

          const group = new THREE.Group();
          group.position.set(bx, 0, bz);

          // Raised asphalt hump
          const hump = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 22, 12, 1, false, 0, Math.PI), bumpMat);
          hump.rotation.z = Math.PI / 2;
          hump.rotation.y = Math.PI / 2;
          hump.position.y = 0.08;
          hump.scale.set(0.35, 1, 1);
          group.add(hump);

          // Black hazard stripes across bump
          for (let s = -9; s <= 9; s += 3) {
            const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.28, 1.2), stripeMat);
            stripe.position.set(s, 0.12, 0);
            group.add(stripe);
          }

          this.scene.add(group);
          this.speedBumps.push({ pos: new THREE.Vector3(bx, 0, bz), w: 22, d: 2.2 });
        }
      }
    }
  }

  // Stunt Ramps for Bollywood leaps over buses!
  createStuntRamps() {
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.7 });
    const chevronMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });

    const rampConfigs = [
      { x: -42, z: 21, rotY: 0 },
      { x: 42, z: -21, rotY: Math.PI },
      { x: 21, z: 126, rotY: Math.PI / 2 },
      { x: -21, z: -126, rotY: -Math.PI / 2 }
    ];

    rampConfigs.forEach(rc => {
      const group = new THREE.Group();
      group.position.set(rc.x, 0, rc.z);
      group.rotation.y = rc.rotY;

      // Sloped wooden ramp wedge
      const slope = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.25, 4.0), woodMat);
      slope.position.set(0, 0.65, 0);
      slope.rotation.x = -0.32;
      group.add(slope);

      // Warning chevron
      const chev = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.05, 0.5), chevronMat);
      chev.position.set(0, 1.25, -1.6);
      chev.rotation.x = -0.32;
      group.add(chev);

      this.scene.add(group);
      this.stuntRamps.push({ pos: new THREE.Vector3(rc.x, 0, rc.z), w: 4.5, d: 4.5 });
    });
  }

  // Muddy Indian monsoon road puddles with splash physics!
  createPotholesAndPuddles() {
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.08,
      metalness: 0.4
    });
    const mudMat = new THREE.MeshStandardMaterial({
      color: 0x5c2e0b,
      roughness: 0.95
    });

    const puddleLocations = [
      { x: -42, z: -84 },
      { x: 42, z: 84 },
      { x: 84, z: -42 },
      { x: -84, z: 42 },
      { x: 0, z: 42 },
      { x: -42, z: 0 },
      { x: 42, z: 0 },
      { x: 126, z: -42 },
      { x: -126, z: 42 }
    ];

    puddleLocations.forEach(loc => {
      const group = new THREE.Group();
      group.position.set(loc.x + 3.0, 0.03, loc.z + 2.0);

      // Shiny water surface
      const water = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 2.0, 0.02, 16), waterMat);
      group.add(water);

      // Mud rim
      const rim = new THREE.Mesh(new THREE.RingGeometry(1.8, 2.6, 16), mudMat);
      rim.rotation.x = -Math.PI / 2;
      rim.position.y = 0.01;
      group.add(rim);

      this.scene.add(group);
      this.puddles.push({ pos: new THREE.Vector3(loc.x + 3.0, 0, loc.z + 2.0), r: 2.2 });
    });
  }

  // Indian Wedding Barat Street Procession (Dhol player, dancing baraatis & fairy lights)
  createWeddingProcession() {
    const group = new THREE.Group();
    const bx = 42;
    const bz = 84;
    group.position.set(bx, 0, bz);

    // Decorative overhead fairy light arch across road
    const archMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.8 });
    const archL = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 6.5, 8), archMat);
    archL.position.set(-8.5, 3.25, 0);
    group.add(archL);

    const archR = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 6.5, 8), archMat);
    archR.position.set(8.5, 3.25, 0);
    group.add(archR);

    const crossbeam = new THREE.Mesh(new THREE.BoxGeometry(17.5, 0.2, 0.2), archMat);
    crossbeam.position.set(0, 6.4, 0);
    group.add(crossbeam);

    // Dhol Drum Master
    const dholGroup = new THREE.Group();
    dholGroup.position.set(-2.0, 0, 0);

    const turbanMat = new THREE.MeshStandardMaterial({ color: 0xef4444 });
    const kurtaMat = new THREE.MeshStandardMaterial({ color: 0xfacc15 });
    const dholMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.4 });

    const drummerBody = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.2, 0.5), kurtaMat);
    drummerBody.position.y = 1.0;
    dholGroup.add(drummerBody);

    const drummerHead = new THREE.Mesh(new THREE.SphereGeometry(0.28, 8, 8), new THREE.MeshStandardMaterial({ color: 0xfde047 }));
    drummerHead.position.set(0, 1.8, 0);
    dholGroup.add(drummerHead);

    const turban = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.38, 0.3, 8), turbanMat);
    turban.position.set(0, 2.05, 0);
    dholGroup.add(turban);

    // Big Dhol Drum
    const drum = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 1.1, 12), dholMat);
    drum.rotation.z = Math.PI / 2;
    drum.position.set(0, 0.9, -0.45);
    dholGroup.add(drum);

    group.add(dholGroup);

    // 4 Dancing Baraatis in Sherwanis
    const baraatis = [];
    const colors = [0xec4899, 0xf97316, 0x10b981, 0x8b5cf6];
    [-5.0, -3.2, 3.2, 5.0].forEach((ox, idx) => {
      const b = new THREE.Group();
      b.position.set(ox, 0, (idx % 2 === 0 ? 1.5 : -1.5));
      const mat = new THREE.MeshStandardMaterial({ color: colors[idx] });
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.65, 1.2, 0.45), mat);
      body.position.y = 1.0;
      b.add(body);

      const head = new THREE.Mesh(new THREE.SphereGeometry(0.26, 8, 8), new THREE.MeshStandardMaterial({ color: 0xfde047 }));
      head.position.set(0, 1.75, 0);
      b.add(head);

      group.add(b);
      baraatis.push({ group: b, baseX: ox });
    });

    this.scene.add(group);
    this.weddingParty = {
      group,
      pos: new THREE.Vector3(bx, 0, bz),
      dholGroup,
      baraatis,
      cleared: false
    };
  }

  // Police Naka Checkpoint (Striped barriers & flashing lightbar)
  createPoliceNaka() {
    const group = new THREE.Group();
    const nx = -42;
    const nz = -42;
    group.position.set(nx, 0, nz);

    const barMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.5 });
    const stripeMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });

    // Barricade blocking half of the intersection lane
    const bar = new THREE.Mesh(new THREE.BoxGeometry(7.0, 0.8, 0.35), barMat);
    bar.position.set(-4.0, 0.9, 0);
    group.add(bar);

    for (let s = -6.5; s <= -1.5; s += 1.2) {
      const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.82, 0.38), stripeMat);
      stripe.position.set(s, 0.9, 0);
      group.add(stripe);
    }

    // Flashing Beacon
    const redBeacon = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.25, 0.4), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
    redBeacon.position.set(-4.0, 1.45, 0);
    group.add(redBeacon);

    this.scene.add(group);
    this.policeNaka = { pos: new THREE.Vector3(nx, 0, nz), beacon: redBeacon };
  }

  // Speed Trap Radar Camera Gantry (Overhead on MG Road)
  createSpeedTrapCamera() {
    const group = new THREE.Group();
    const sx = 0;
    const sz = 42;
    group.position.set(sx, 0, sz);

    const metalMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.7 });
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc });

    // Vertical Gantry Pillars
    const pillarL = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 7.5, 8), metalMat);
    pillarL.position.set(-11.5, 3.75, 0);
    group.add(pillarL);

    const pillarR = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 7.5, 8), metalMat);
    pillarR.position.set(11.5, 3.75, 0);
    group.add(pillarR);

    // Overhead crossbeam
    const beam = new THREE.Mesh(new THREE.BoxGeometry(23.5, 0.5, 0.5), metalMat);
    beam.position.set(0, 7.4, 0);
    group.add(beam);

    // 2 Radar Cameras mounted overhead
    for (let cx of [-4.0, 4.0]) {
      const camBox = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.65, 1.2), whiteMat);
      camBox.position.set(cx, 7.0, 0);
      group.add(camBox);

      const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.15, 12), new THREE.MeshBasicMaterial({ color: 0x0f172a }));
      lens.rotation.x = Math.PI / 2;
      lens.position.set(cx, 7.0, 0.65);
      group.add(lens);

      const strobe = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.2, 0.1), new THREE.MeshBasicMaterial({ color: 0xfacc15 }));
      strobe.position.set(cx, 7.4, 0.6);
      group.add(strobe);
    }

    // Speed Limit Circular Sign
    const sign = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, 0.08, 16), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
    sign.rotation.x = Math.PI / 2;
    sign.position.set(0, 8.6, 0);
    group.add(sign);

    this.scene.add(group);
    this.speedTraps.push({ pos: new THREE.Vector3(sx, 0, sz), w: 22, d: 5.5 });
  }

  // 2. 3D Animated Street Dogs (Indian Pariah Dogs)
  createStreetDogs() {
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.8 });

    // 5 well-spaced neighborhood dogs across different districts (rare & funny, not annoying!)
    const dogLocations = [
      { x: -54, z: 24, col: 0xb45309 },  // West Market Dog
      { x: 54, z: -24, col: 0xd97706 },  // East Avenue Dog
      { x: -114, z: -60, col: 0x78350f }, // North-West Street Dog
      { x: 114, z: 60, col: 0x1e293b },   // South-East Alley Dog
      { x: 0, z: -114, col: 0xfef3c7 }    // North Suburban Dog
    ];

    dogLocations.forEach((loc) => {
      const dog = new THREE.Group();
      dog.position.set(loc.x, 0, loc.z);

      const dogMat = new THREE.MeshStandardMaterial({ color: loc.col, roughness: 0.8 });

      // Body
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.7, 1.4), dogMat);
      body.position.y = 0.7;
      dog.add(body);

      // White chest
      const chest = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.45, 0.6), whiteMat);
      chest.position.set(0, 0.6, -0.4);
      dog.add(chest);

      // Head
      const head = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.55, 0.65), dogMat);
      head.position.set(0, 1.2, -0.85);
      dog.add(head);

      // Snout
      const snout = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.3, 0.45), whiteMat);
      snout.position.set(0, 1.1, -1.25);
      dog.add(snout);

      // Pointy Ears
      for (let ex of [-0.22, 0.22]) {
        const ear = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.35, 4), dogMat);
        ear.position.set(ex, 1.55, -0.85);
        dog.add(ear);
      }

      // 4 Animated Running Legs with hip pivots
      const legs = [];
      for (let lx of [-0.25, 0.25]) {
        for (let lz of [-0.45, 0.45]) {
          const legPivot = new THREE.Group();
          legPivot.position.set(lx, 0.65, lz);

          const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.65, 8), dogMat);
          leg.position.y = -0.32;
          legPivot.add(leg);

          dog.add(legPivot);
          legs.push({ pivot: legPivot, isFront: lz < 0, isLeft: lx < 0 });
        }
      }

      // Wagging Tail
      const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.09, 0.7, 8), dogMat);
      tail.position.set(0, 0.95, 0.85);
      tail.rotation.x = -0.6;
      dog.add(tail);

      dog.userData = {
        tail,
        legs,
        body,
        basePos: new THREE.Vector3(loc.x, 0, loc.z),
        chaseSpeed: 11.5, // Fair speed (~41 km/h), rider easily escapes
        isChasing: false,
        chaseTimeRemaining: 0,
        cooldownTimer: 0,
        scaredTimer: 0,
        lastBarkTime: 0
      };

      this.scene.add(dog);
      this.dogs.push(dog);
    });
  }

  // 3. Roadside Power-Ups: Chai ☕ (+6s Time), Dabang Shield 🛡️, Cash Coins 🪙
  createPowerUps() {
    const powerTypes = ['CHAI', 'SHIELD', 'COIN'];

    // 14 powerup locations along curbs
    for (let p = 0; p < 14; p++) {
      const type = powerTypes[p % 3];
      const i = 1 + (p % 4);
      const j = 1 + Math.floor(p / 4);

      const px = -this.half + i * this.step + (p % 2 === 0 ? 10.5 : -10.5);
      const pz = -this.half + j * this.step + ((p * 3) % 40) - 20;

      const group = new THREE.Group();
      group.position.set(px, 1.2, pz);

      if (type === 'CHAI') {
        // ☕ Floating Tapri Chai Cup with Saucer
        const cupMat = new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.3 });
        const teaMat = new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.2 });

        const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.45, 0.9, 12), cupMat);
        group.add(cup);

        const tea = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.1, 12), teaMat);
        tea.position.y = 0.35;
        group.add(tea);

        const saucer = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.0, 0.12, 14), cupMat);
        saucer.position.y = -0.45;
        group.add(saucer);
      } else if (type === 'SHIELD') {
        // 🛡️ Golden Dabang Shield
        const shieldMat = new THREE.MeshStandardMaterial({
          color: 0x38bdf8,
          metalness: 0.85,
          roughness: 0.2,
          emissive: 0x0284c7,
          emissiveIntensity: 0.4
        });
        const shield = new THREE.Mesh(new THREE.SphereGeometry(0.9, 14, 14), shieldMat);
        group.add(shield);
      } else {
        // 🪙 Golden Cash Coin
        const coinMat = new THREE.MeshStandardMaterial({
          color: 0xfacc15,
          metalness: 0.9,
          roughness: 0.2,
          emissive: 0xeab308,
          emissiveIntensity: 0.5
        });
        const coin = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 0.18, 14), coinMat);
        coin.rotation.x = Math.PI / 2;
        group.add(coin);
      }

      this.scene.add(group);
      this.powerUps.push({
        group,
        type,
        pos: new THREE.Vector3(px, 1.2, pz),
        active: true,
        respawnTime: 0
      });
    }
  }

  // 4. Rain Particle System
  createRainSystem() {
    const rainCount = 1800;
    const rainGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(rainCount * 3);

    for (let i = 0; i < rainCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 600;
      positions[i + 1] = Math.random() * 90;
      positions[i + 2] = (Math.random() - 0.5) * 600;
    }

    rainGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const rainMat = new THREE.PointsMaterial({
      color: 0x93c5fd,
      size: 0.4,
      transparent: true,
      opacity: 0.65
    });

    this.rainMesh = new THREE.Points(rainGeo, rainMat);
    this.rainMesh.visible = false;
    this.scene.add(this.rainMesh);
  }

  // Weather Manager: SUNNY, SUNSET, NIGHT, RAIN
  setWeather(mode) {
    this.weather = mode;
    if (this.rainMesh) this.rainMesh.visible = (mode === 'RAIN');

    if (mode === 'SUNSET') {
      this.scene.background = new THREE.Color(0xf97316);
      this.scene.fog.color.setHex(0xf97316);
    } else if (mode === 'NIGHT') {
      this.scene.background = new THREE.Color(0x090d16);
      this.scene.fog.color.setHex(0x090d16);
    } else if (mode === 'RAIN') {
      this.scene.background = new THREE.Color(0x334155);
      this.scene.fog.color.setHex(0x334155);
    } else {
      // SUNNY
      this.scene.background = new THREE.Color(0x38bdf8);
      this.scene.fog.color.setHex(0x38bdf8);
    }
  }

  // Check Speed Bump Jump Collisions
  checkSpeedBumps(riderPos) {
    for (let b of this.speedBumps) {
      const dx = Math.abs(riderPos.x - b.pos.x);
      const dz = Math.abs(riderPos.z - b.pos.z);
      if (dx < b.w / 2 && dz < b.d) {
        return b;
      }
    }
    return null;
  }

  // Check Stunt Ramp Leaps
  checkStuntRamps(riderPos) {
    for (let r of this.stuntRamps) {
      const dist = Math.hypot(riderPos.x - r.pos.x, riderPos.z - r.pos.z);
      if (dist < 3.2) {
        return r;
      }
    }
    return null;
  }

  // Check Mud Puddle Splash Slip
  checkPuddleSlip(riderPos) {
    const now = performance.now();
    if (now - this.lastPuddleTime < 1800) return null;
    for (let p of this.puddles) {
      const dist = Math.hypot(riderPos.x - p.pos.x, riderPos.z - p.pos.z);
      if (dist < p.r) {
        this.lastPuddleTime = now;
        return p;
      }
    }
    return null;
  }

  // Check Wedding Party Barat Encounter
  checkWeddingParty(riderPos, isHonking = false) {
    if (!this.weddingParty) return null;
    const dist = this.weddingParty.pos.distanceTo(riderPos);
    if (dist < 28) {
      if (isHonking && !this.weddingParty.cleared) {
        this.weddingParty.cleared = true;
        this.weddingParty.baraatis.forEach(b => {
          b.group.position.x = Math.sign(b.baseX) * 9.5;
        });
        if (window.soundEngine) window.soundEngine.playDholBeat();
        return 'CLEARED';
      }
      return 'BLOCKING';
    } else if (dist > 50) {
      if (this.weddingParty.cleared) {
        this.weddingParty.cleared = false;
        this.weddingParty.baraatis.forEach(b => {
          b.group.position.x = b.baseX;
        });
      }
    }
    return null;
  }

  // Check Police Naka Overspeeding Violation
  checkPoliceNaka(riderPos, speedKmh) {
    if (!this.policeNaka) return false;
    const dist = this.policeNaka.pos.distanceTo(riderPos);
    if (dist < 14.0 && speedKmh > 75) {
      return true;
    }
    return false;
  }

  // Check Overhead Speed Trap Camera Violation
  checkSpeedTrap(riderPos, speedKmh) {
    const now = performance.now();
    if (now - this.lastSpeedTrapTime < 6000) return false;
    for (let st of this.speedTraps) {
      const dx = Math.abs(riderPos.x - st.pos.x);
      const dz = Math.abs(riderPos.z - st.pos.z);
      if (dx < st.w / 2 && dz < st.d && speedKmh > 80) {
        this.lastSpeedTrapTime = now;
        return true;
      }
    }
    return false;
  }

  // Check Power-Up Collection
  checkPowerUpCollect(riderPos) {
    for (let pu of this.powerUps) {
      if (pu.active && pu.group.position.distanceTo(riderPos) < 3.2) {
        pu.active = false;
        pu.group.visible = false;
        pu.respawnTime = performance.now() + 18000; // Respawns in 18s
        return pu.type;
      }
    }
    return null;
  }

  // Honk scares nearby street dogs back to the sidewalk
  honkScareDogs(riderPos) {
    this.dogs.forEach(d => {
      if (d.position.distanceTo(riderPos) < 32) {
        d.userData.isChasing = false;
        d.userData.scaredTimer = 6.0;
        d.userData.cooldownTimer = 30.0;
      }
    });
  }

  update(dt, riderPos) {
    const nowSec = performance.now() * 0.001;
    const nowMs = performance.now();

    // 1. Update Traffic Lights State & Emissive Glow
    this.trafficSignals.forEach(sig => {
      const cycleTime = (nowSec + sig.cycleOffset) % 24;
      if (cycleTime < 11) {
        sig.state = 'GREEN';
        sig.greenMat.emissiveIntensity = 1.6;
        sig.yellowMat.emissiveIntensity = 0.05;
        sig.redMat.emissiveIntensity = 0.05;
      } else if (cycleTime < 14) {
        sig.state = 'YELLOW';
        sig.greenMat.emissiveIntensity = 0.05;
        sig.yellowMat.emissiveIntensity = 1.6;
        sig.redMat.emissiveIntensity = 0.05;
      } else {
        sig.state = 'RED';
        sig.greenMat.emissiveIntensity = 0.05;
        sig.yellowMat.emissiveIntensity = 0.05;
        sig.redMat.emissiveIntensity = 1.8;
      }
    });

    // 2. Street Dogs AI (Brief, rare funny 3-second chase with 35s cooldown, no screen-blocking text!)
    this.dogs.forEach(dog => {
      const u = dog.userData;
      u.tail.rotation.z = Math.sin(nowSec * 16) * 0.5; // Natural tail wag

      // Handle cooldown
      if (u.cooldownTimer > 0) {
        u.cooldownTimer -= dt;
      }

      // If scared by rider honking
      if (u.scaredTimer > 0) {
        u.scaredTimer -= dt;
        u.isChasing = false;
        const homeDir = new THREE.Vector3().subVectors(u.basePos, dog.position);
        if (homeDir.length() > 1.2) {
          dog.lookAt(u.basePos.x, dog.position.y, u.basePos.z);
          dog.position.addScaledVector(homeDir.normalize(), 5.0 * dt);
          u.legs.forEach(l => {
            l.pivot.rotation.x = Math.sin(nowSec * 14) * 0.4;
          });
        }
        return;
      }

      if (riderPos) {
        const dist = dog.position.distanceTo(riderPos);

        // Only trigger if very close (< 22m), not already chasing, and cooldown expired
        if (dist < 22 && !u.isChasing && u.cooldownTimer <= 0 && u.scaredTimer <= 0) {
          u.isChasing = true;
          u.chaseTimeRemaining = 3.5; // Quick 3.5 second funny sprint!
          if (window.soundEngine) window.soundEngine.playDogBark();
        }

        if (u.isChasing) {
          u.chaseTimeRemaining -= dt;
          // Gives up quickly if timer ends or player accelerates away (> 26m)
          if (u.chaseTimeRemaining <= 0 || dist > 26) {
            u.isChasing = false;
            u.cooldownTimer = 35.0; // Enters 35-second cooldown so it won't harass you again!
          } else {
            // Short sprint towards rider
            dog.lookAt(riderPos.x, dog.position.y, riderPos.z);
            const dir = new THREE.Vector3().subVectors(riderPos, dog.position).normalize();
            dog.position.addScaledVector(dir, u.chaseSpeed * dt);

            // Animate running legs
            u.legs.forEach(l => {
              const phase = (l.isFront ? 0 : Math.PI) + (l.isLeft ? 0 : Math.PI);
              l.pivot.rotation.x = Math.sin(nowSec * 20 + phase) * 0.7;
            });
            u.body.position.y = 0.7 + Math.abs(Math.sin(nowSec * 20)) * 0.1;

            if (nowMs - u.lastBarkTime > 2200) {
              u.lastBarkTime = nowMs;
              if (window.soundEngine) window.soundEngine.playDogBark();
            }
            return;
          }
        }

        // Return to roadside home base if not chasing
        const homeDir = new THREE.Vector3().subVectors(u.basePos, dog.position);
        if (homeDir.length() > 1.2) {
          dog.lookAt(u.basePos.x, dog.position.y, u.basePos.z);
          dog.position.addScaledVector(homeDir.normalize(), 4.0 * dt);
          u.legs.forEach(l => {
            l.pivot.rotation.x = Math.sin(nowSec * 8) * 0.3;
          });
          u.body.position.y = 0.7;
        } else {
          // Standing idle on sidewalk
          u.legs.forEach(l => { l.pivot.rotation.x = 0; });
          u.body.position.y = 0.7;
        }
      }
    });

    // 3. Power-Ups Animation (Floating & spinning & respawning)
    this.powerUps.forEach(pu => {
      if (!pu.active && nowMs > pu.respawnTime) {
        pu.active = true;
        pu.group.visible = true;
      }
      if (pu.active) {
        pu.group.rotation.y += dt * 2.8;
        pu.group.position.y = 1.2 + Math.sin(nowSec * 4 + pu.group.position.x) * 0.35;
      }
    });

    // 4. Rain Particles Fall
    if (this.rainMesh && this.rainMesh.visible) {
      const pos = this.rainMesh.geometry.attributes.position.array;
      for (let i = 1; i < pos.length; i += 3) {
        pos[i] -= 120 * dt;
        if (pos[i] < 0) pos[i] = 90;
      }
      this.rainMesh.geometry.attributes.position.needsUpdate = true;
    }

    // 5. Spin floating burger icon & pulse rings
    if (this.pickupIcon && this.beacons.pickup.visible) {
      this.pickupIcon.rotation.y += dt * 2.5;
      this.pickupIcon.position.y = 8.5 + Math.sin(nowSec * 4) * 0.8;

      this.pickupRings.forEach((r, idx) => {
        r.rotation.z += dt * (idx % 2 === 0 ? 1.2 : -1.2);
        r.scale.setScalar(1.0 + Math.sin(nowSec * 3 + idx) * 0.12);
      });
    }

    // 6. Waving customer & spinning gift box
    if (this.customerMesh && this.beacons.dropoff.visible) {
      const wave = Math.sin(nowSec * 9) * 0.7;
      this.customerMesh.userData.armL.rotation.z = -1.2 + wave;
      this.customerMesh.userData.armR.rotation.z = 1.2 - wave;

      if (this.customerMesh.userData.giftBox) {
        this.customerMesh.userData.giftBox.rotation.y += dt * 2.0;
        this.customerMesh.userData.giftBox.position.y = 6.2 + Math.sin(nowSec * 4) * 0.5;
      }

      this.dropoffRings.forEach((r, idx) => {
        r.rotation.z += dt * (idx % 2 === 0 ? 1.2 : -1.2);
        r.scale.setScalar(1.0 + Math.sin(nowSec * 3 + idx) * 0.12);
      });
    }

    // 7. Animate Wedding Procession Baraatis
    if (this.weddingParty) {
      this.weddingParty.baraatis.forEach((b, i) => {
        b.group.position.y = Math.abs(Math.sin(nowSec * 8 + i)) * 0.35;
        b.group.rotation.y = Math.sin(nowSec * 5 + i) * 0.4;
      });
      if (this.weddingParty.dholGroup) {
        this.weddingParty.dholGroup.position.y = Math.abs(Math.sin(nowSec * 8)) * 0.15;
      }
      if (riderPos && this.weddingParty.pos.distanceTo(riderPos) < 38) {
        if (nowMs - this.lastDholTime > 1400) {
          this.lastDholTime = nowMs;
          if (window.soundEngine) window.soundEngine.playDholBeat();
        }
      }
    }

    // 8. Flash Police Naka Beacon
    if (this.policeNaka && this.policeNaka.beacon) {
      this.policeNaka.beacon.visible = (Math.sin(nowSec * 16) > 0);
    }
  }
}

window.CityManager = CityManager;
