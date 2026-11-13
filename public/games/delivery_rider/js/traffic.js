/* =========================================================
   FUNNY DELIVERY RIDER 3D - TRAFFIC & OBSTACLE SIMULATOR
   Auto-Rickshaws, City Buses, Stray Cows, Cabs & Pedestrians
   ========================================================= */

class TrafficManager {
  constructor(scene, cityExtent, blockSize, streetWidth, gridSize) {
    this.scene = scene;
    this.cityExtent = cityExtent;
    this.blockSize = blockSize;
    this.streetWidth = streetWidth;
    this.gridSize = gridSize;
    this.vehicles = [];
    this.cows = [];
    this.step = this.blockSize + this.streetWidth;
    this.half = (this.gridSize - 1) * this.step / 2;

    this.policeChaseTimer = 0;
    this.chasingPoliceCar = null;

    this.spawnTraffic();
    this.spawnCows();
  }

  triggerPoliceChase(playerPos) {
    if (this.policeChaseTimer > 0) return;
    this.policeChaseTimer = 8.5;
    let closest = null;
    let minDist = 9999;
    this.vehicles.forEach(v => {
      if (v.type === 'POLICE') {
        const d = v.mesh.position.distanceTo(playerPos);
        if (d < minDist) {
          minDist = d;
          closest = v;
        }
      }
    });
    this.chasingPoliceCar = closest;
    if (window.soundEngine) window.soundEngine.playPoliceSiren();
    if (window.gameInstance) {
      window.gameInstance.showAppNotification('🚨 WANTED: POLICE CHASE ACTIVE! Ditch them in the alleys!', '#ef4444');
      window.gameInstance.spawnComicPopup('🚨 WANTED! POLICE CHASE!', playerPos);
    }
  }

  // 1. Create Heavy Traffic: Auto-Rickshaws, Buses, Cabs, Delivery Tempos
  spawnTraffic() {
    const count = 54;
    for (let i = 0; i < count; i++) {
      let type = 'CAR';
      if (i === 12 || i === 32) type = 'POLICE';
      else if (i === 18 || i === 38) type = 'AMBULANCE';
      else if (i % 5 === 0) type = 'AUTO';
      else if (i % 5 === 1) type = 'BUS';
      else if (i % 5 === 2) type = 'CAB';
      else if (i % 5 === 3) type = 'TEMPO';
      else type = 'CAR';

      const mesh = this.createVehicleMesh(type);

      // Random avenue or street lane
      const isAvenue = Math.random() > 0.5;
      const roadIdx = Math.floor(Math.random() * this.gridSize);
      const roadCoord = -this.half + roadIdx * this.step;
      const dir = Math.random() > 0.5 ? 1 : -1;
      const laneOffset = dir * 4.5; // Offset to right or left lane

      let px, pz, heading;
      if (isAvenue) {
        px = roadCoord + laneOffset;
        pz = (Math.random() - 0.5) * (this.cityExtent * 1.8);
        heading = (dir > 0) ? Math.PI : 0;
      } else {
        pz = roadCoord + laneOffset;
        px = (Math.random() - 0.5) * (this.cityExtent * 1.8);
        heading = (dir > 0) ? Math.PI / 2 : -Math.PI / 2;
      }

      mesh.position.set(px, 0, pz);
      mesh.rotation.y = heading;
      this.scene.add(mesh);

      const baseSpeed = (type === 'BUS')
        ? (9 + Math.random() * 5)
        : (type === 'AUTO' ? (11 + Math.random() * 6) : (13 + Math.random() * 8));

      this.vehicles.push({
        mesh,
        type,
        heading,
        speed: baseSpeed,
        isAvenue,
        dir,
        lastNearMissTime: 0,
        boxW: (type === 'BUS' ? 3.4 : (type === 'TEMPO' ? 2.6 : 2.0)),
        boxL: (type === 'BUS' ? 9.6 : (type === 'TEMPO' ? 5.2 : 3.8))
      });
    }
  }

  // 2. Create Iconic Stray Cows in Road Lanes
  spawnCows() {
    const cowCount = 6;
    for (let i = 0; i < cowCount; i++) {
      const cow = this.createCowMesh();
      const roadIdx = Math.floor(Math.random() * this.gridSize);
      const roadCoord = -this.half + roadIdx * this.step;
      const laneOffset = (Math.random() > 0.5 ? 4.2 : -4.2);

      cow.position.set(
        roadCoord + laneOffset,
        0,
        (Math.random() - 0.5) * (this.cityExtent * 1.5)
      );
      cow.rotation.y = Math.random() * Math.PI * 2;
      this.scene.add(cow);
      this.cows.push(cow);
    }
  }

  createVehicleMesh(type) {
    const group = new THREE.Group();

    if (type === 'AUTO') {
      // 🛺 Iconic Green & Yellow Bajaj Auto-Rickshaw!
      const greenMat = new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.4 });
      const yellowMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.4 });
      const canvasMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.8 });

      // Lower green body
      const lowerBody = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.75, 2.8), greenMat);
      lowerBody.position.y = 0.55;
      group.add(lowerBody);

      // Upper yellow hood & windshield frame
      const upperBody = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.9, 2.5), yellowMat);
      upperBody.position.set(0, 1.35, -0.15);
      group.add(upperBody);

      // Black canvas soft-top roof
      const roof = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.25, 2.7), canvasMat);
      roof.position.set(0, 1.85, -0.1);
      group.add(roof);

      // Front Single Wheel
      const wheelGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.25, 12);
      const tireMat = new THREE.MeshStandardMaterial({ color: 0x1e293b });
      const frontW = new THREE.Mesh(wheelGeo, tireMat);
      frontW.rotation.z = Math.PI / 2;
      frontW.position.set(0, 0.35, -1.2);
      group.add(frontW);

      // Rear 2 Wheels
      for (let rx of [-0.85, 0.85]) {
        const rearW = new THREE.Mesh(wheelGeo, tireMat);
        rearW.rotation.z = Math.PI / 2;
        rearW.position.set(rx, 0.35, 0.85);
        group.add(rearW);
      }

      // Yellow Headlight
      const hl = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), new THREE.MeshBasicMaterial({ color: 0xfef08a }));
      hl.position.set(0, 0.85, -1.45);
      group.add(hl);
    } else if (type === 'BUS') {
      // 🚌 Heavy Red & Cream Local City Bus ("HORN OK PLEASE")
      const busRedMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.35 });
      const busCreamMat = new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.4 });
      const glassMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.1 });

      // Lower Red Body
      const body = new THREE.Mesh(new THREE.BoxGeometry(3.0, 1.6, 9.2), busRedMat);
      body.position.y = 1.2;
      group.add(body);

      // Upper Cream Roof
      const roof = new THREE.Mesh(new THREE.BoxGeometry(2.95, 1.4, 9.0), busCreamMat);
      roof.position.set(0, 2.65, 0);
      group.add(roof);

      // Continuous passenger window stripe
      const winL = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.85, 8.2), glassMat);
      winL.position.set(-1.52, 2.4, 0);
      group.add(winL);

      const winR = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.85, 8.2), glassMat);
      winR.position.set(1.52, 2.4, 0);
      group.add(winR);

      // Wheels
      const busWheelGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.45, 12);
      const tireMat = new THREE.MeshStandardMaterial({ color: 0x0f172a });
      for (let z of [-2.8, 2.8]) {
        for (let x of [-1.35, 1.35]) {
          const w = new THREE.Mesh(busWheelGeo, tireMat);
          w.rotation.z = Math.PI / 2;
          w.position.set(x, 0.55, z);
          group.add(w);
        }
      }
    } else if (type === 'CAB') {
      // 🚕 Yellow Ambassador Taxi
      const cabYellow = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.35 });
      const darkMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.8 });

      const body = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.75, 4.2), cabYellow);
      body.position.y = 0.55;
      group.add(body);

      const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.7, 2.4), darkMat);
      cabin.position.set(0, 1.2, -0.15);
      group.add(cabin);

      // Yellow Taxi Roof Sign
      const sign = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.25, 0.4), cabYellow);
      sign.position.set(0, 1.65, -0.15);
      group.add(sign);

      const wheelGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.25, 10);
      for (let x of [-1.0, 1.0]) {
        for (let z of [-1.3, 1.3]) {
          const w = new THREE.Mesh(wheelGeo, darkMat);
          w.rotation.z = Math.PI / 2;
          w.position.set(x, 0.35, z);
          group.add(w);
        }
      }
    } else if (type === 'TEMPO') {
      // 🚚 Mini Delivery Truck / Cargo Tempo
      const cabBlue = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.4 });
      const cargoWhite = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.5 });
      const darkMat = new THREE.MeshStandardMaterial({ color: 0x1e293b });

      // Cabin
      const cabin = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.2, 1.8), cabBlue);
      cabin.position.set(0, 0.9, -1.4);
      group.add(cabin);

      // Cargo Container Box
      const cargo = new THREE.Mesh(new THREE.BoxGeometry(2.3, 1.6, 3.4), cargoWhite);
      cargo.position.set(0, 1.2, 1.1);
      group.add(cargo);

      const wheelGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 10);
      for (let x of [-1.05, 1.05]) {
        for (let z of [-1.3, 1.5]) {
          const w = new THREE.Mesh(wheelGeo, darkMat);
          w.rotation.z = Math.PI / 2;
          w.position.set(x, 0.4, z);
          group.add(w);
        }
      }
    } else if (type === 'POLICE') {
      // 🚔 Police Patrol Interceptor with Flashing Lightbar
      const whiteMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 });
      const blueMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8 });
      const darkMat = new THREE.MeshStandardMaterial({ color: 0x0f172a });

      const body = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.75, 4.2), whiteMat);
      body.position.y = 0.55;
      group.add(body);

      const stripeL = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.35, 3.8), blueMat);
      stripeL.position.set(-1.06, 0.6, 0);
      group.add(stripeL);
      const stripeR = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.35, 3.8), blueMat);
      stripeR.position.set(1.06, 0.6, 0);
      group.add(stripeR);

      const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.7, 2.4), darkMat);
      cabin.position.set(0, 1.2, -0.15);
      group.add(cabin);

      const redLight = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.15, 0.4), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
      redLight.position.set(-0.35, 1.65, -0.15);
      group.add(redLight);
      const blueLight = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.15, 0.4), new THREE.MeshBasicMaterial({ color: 0x3b82f6 }));
      blueLight.position.set(0.35, 1.65, -0.15);
      group.add(blueLight);
      group.userData.redLight = redLight;
      group.userData.blueLight = blueLight;

      const wheelGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.25, 10);
      for (let x of [-1.0, 1.0]) {
        for (let z of [-1.3, 1.3]) {
          const w = new THREE.Mesh(wheelGeo, darkMat);
          w.rotation.z = Math.PI / 2;
          w.position.set(x, 0.35, z);
          group.add(w);
        }
      }
    } else if (type === 'AMBULANCE') {
      // 🚑 Emergency Hospital Ambulance Van
      const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
      const redMat = new THREE.MeshStandardMaterial({ color: 0xef4444 });
      const darkMat = new THREE.MeshStandardMaterial({ color: 0x0f172a });

      const body = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.3, 4.4), whiteMat);
      body.position.y = 0.95;
      group.add(body);

      // Red cross on sides
      for (let sx of [-1.11, 1.11]) {
        const crossH = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.25, 0.8), redMat);
        crossH.position.set(sx, 1.1, 0.5);
        group.add(crossH);
        const crossV = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.8, 0.25), redMat);
        crossV.position.set(sx, 1.1, 0.5);
        group.add(crossV);
      }

      // Flashing Siren Bar
      const redLight = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.18, 0.4), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
      redLight.position.set(-0.35, 1.7, -0.6);
      group.add(redLight);
      const blueLight = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.18, 0.4), new THREE.MeshBasicMaterial({ color: 0x3b82f6 }));
      blueLight.position.set(0.35, 1.7, -0.6);
      group.add(blueLight);
      group.userData.redLight = redLight;
      group.userData.blueLight = blueLight;

      const wheelGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.28, 10);
      for (let x of [-1.05, 1.05]) {
        for (let z of [-1.4, 1.4]) {
          const w = new THREE.Mesh(wheelGeo, darkMat);
          w.rotation.z = Math.PI / 2;
          w.position.set(x, 0.38, z);
          group.add(w);
        }
      }
    } else {
      // 🚗 White/Red Hatchback Car
      const carCol = (Math.random() > 0.5) ? 0xf8fafc : 0xef4444;
      const carMat = new THREE.MeshStandardMaterial({ color: carCol, roughness: 0.4 });
      const darkMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });

      const body = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.7, 4.0), carMat);
      body.position.y = 0.55;
      group.add(body);

      const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.65, 2.2), darkMat);
      cabin.position.set(0, 1.15, -0.2);
      group.add(cabin);

      const wheelGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.25, 10);
      for (let x of [-0.95, 0.95]) {
        for (let z of [-1.2, 1.2]) {
          const w = new THREE.Mesh(wheelGeo, darkMat);
          w.rotation.z = Math.PI / 2;
          w.position.set(x, 0.35, z);
          group.add(w);
        }
      }
    }

    return group;
  }

  createCowMesh() {
    const cowGroup = new THREE.Group();
    const cowWhite = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.7 });
    const cowBrown = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.7 });

    // Cow Body (Lying down peacefully on street)
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.9, 2.2), cowWhite);
    body.position.y = 0.55;
    cowGroup.add(body);

    // Brown patches
    const patch = new THREE.Mesh(new THREE.BoxGeometry(1.42, 0.5, 0.9), cowBrown);
    patch.position.set(0, 0.6, -0.2);
    cowGroup.add(patch);

    // Head
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.7, 0.9), cowWhite);
    head.position.set(0, 1.1, -1.2);
    cowGroup.add(head);

    // Horns
    const hornMat = new THREE.MeshStandardMaterial({ color: 0x1e293b });
    for (let hx of [-0.35, 0.35]) {
      const horn = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.4, 6), hornMat);
      horn.rotation.x = -0.4;
      horn.position.set(hx, 1.55, -1.2);
      cowGroup.add(horn);
    }

    return cowGroup;
  }

  // Check collision & near-miss against delivery bike
  update(dt, playerPos, playerSpeed, onNearMiss, onCrash, isShieldActive = false) {
    const maxExtent = this.cityExtent * 1.5;
    const nowSec = performance.now() * 0.001;

    this.vehicles.forEach(v => {
      // Flashing police & ambulance patrol lights
      if ((v.type === 'POLICE' || v.type === 'AMBULANCE') && v.mesh.userData.redLight) {
        const isRed = (Math.sin(nowSec * 16) > 0);
        v.mesh.userData.redLight.visible = isRed;
        v.mesh.userData.blueLight.visible = !isRed;
      }

      // Ambulance Siren & Good Karma Giving Way
      if (v.type === 'AMBULANCE') {
        const d = v.mesh.position.distanceTo(playerPos);
        if (d < 36 && performance.now() - (v.lastSirenTime || 0) > 1600) {
          v.lastSirenTime = performance.now();
          if (window.soundEngine) window.soundEngine.playAmbulanceSiren();
        }
        if (d < 16 && !v.karmaAwarded && d > 2.8) {
          v.karmaAwarded = true;
          if (window.gameInstance) {
            window.gameInstance.cashEarned += 40;
            window.gameInstance.score += 200;
            window.gameInstance.showAppNotification('🚑 GAVE WAY TO AMBULANCE! +₹40 Good Karma Bonus!', '#22c55e');
            window.gameInstance.spawnComicPopup('🚑 +₹40 KARMA!', playerPos);
            window.gameInstance.updateHUD();
          }
        }
      }

      // Active Police Chase pursuit
      if (this.policeChaseTimer > 0 && v === this.chasingPoliceCar) {
        this.policeChaseTimer -= dt;
        v.mesh.lookAt(playerPos.x, v.mesh.position.y, playerPos.z);
        const dir = new THREE.Vector3().subVectors(playerPos, v.mesh.position).normalize();
        v.mesh.position.addScaledVector(dir, 20.0 * dt);

        const distToPlayer = v.mesh.position.distanceTo(playerPos);
        if (distToPlayer > 52.0 || this.policeChaseTimer <= 0) {
          this.policeChaseTimer = 0;
          this.chasingPoliceCar = null;
          if (window.gameInstance) {
            window.gameInstance.onPoliceEvaded();
          }
        }
        return;
      }

      // Dabang Shield flung physics
      if (v.isFlung) {
        v.flungVy -= 30 * dt;
        v.mesh.position.y += v.flungVy * dt;
        v.mesh.position.x += v.flungVx * dt;
        v.mesh.rotation.x += 10 * dt;
        v.mesh.rotation.z += 8 * dt;
        if (v.mesh.position.y <= 0) {
          v.mesh.position.y = 0;
          v.isFlung = false;
          v.mesh.rotation.x = 0;
          v.mesh.rotation.z = 0;
        }
        return;
      }

      // Move vehicle along road
      const forwardX = -Math.sin(v.heading);
      const forwardZ = -Math.cos(v.heading);
      v.mesh.position.x += forwardX * v.speed * dt;
      v.mesh.position.z += forwardZ * v.speed * dt;

      // Wrap around grid boundaries
      if (Math.abs(v.mesh.position.x) > maxExtent) {
        v.mesh.position.x = -Math.sign(v.mesh.position.x) * (maxExtent - 5);
      }
      if (Math.abs(v.mesh.position.z) > maxExtent) {
        v.mesh.position.z = -Math.sign(v.mesh.position.z) * (maxExtent - 5);
      }

      // Check distance to player
      const dx = playerPos.x - v.mesh.position.x;
      const dz = playerPos.z - v.mesh.position.z;
      const dist = Math.hypot(dx, dz);

      // Direct collision
      const crashDist = (v.type === 'BUS') ? 2.6 : 1.6;
      if (dist < crashDist) {
        if (isShieldActive) {
          // Dabang Shield smashes traffic car into air!
          v.isFlung = true;
          v.flungVy = 13.5;
          v.flungVx = (Math.random() - 0.5) * 16.0;
          if (window.soundEngine) window.soundEngine.playShieldSmash();
          if (window.gameInstance) {
            window.gameInstance.spawnComicPopup('DABANG SMASH! 💥', v.mesh.position);
            window.gameInstance.score += 250;
            window.gameInstance.updateHUD();
          }
        } else {
          onCrash(v);
        }
      } else if (dist < (crashDist + 2.0) && playerSpeed > 18.0) {
        // High-speed close-call near miss!
        const now = performance.now();
        if (now - v.lastNearMissTime > 2500) {
          v.lastNearMissTime = now;
          onNearMiss(v);
        }
      }
    });

    // Check cow collisions
    this.cows.forEach(cow => {
      const dx = playerPos.x - cow.position.x;
      const dz = playerPos.z - cow.position.z;
      const dist = Math.hypot(dx, dz);
      if (dist < 1.8) {
        if (!isShieldActive) {
          onCrash({ type: 'COW' });
        }
      }
    });
  }

  // Honk reaction: Traffic swerves aside to make way, cows turn and moo!
  honkReaction(playerPos) {
    this.vehicles.forEach(v => {
      const dist = v.mesh.position.distanceTo(playerPos);
      if (dist < 45) {
        // Veer quickly to the side to give way for delivery rider!
        if (v.isAvenue) {
          v.mesh.position.x += v.dir * 2.4;
        } else {
          v.mesh.position.z += v.dir * 2.4;
        }
        v.speed = Math.max(v.speed * 0.6, 3.5);
      }
    });

    // Cows react to loud bike horn!
    this.cows.forEach(cow => {
      const dist = cow.position.distanceTo(playerPos);
      if (dist < 36) {
        cow.rotation.y += 0.6;
        if (window.soundEngine) window.soundEngine.playCowMoo();
      }
    });
  }
}

window.TrafficManager = TrafficManager;
