/* =========================================================
   FUNNY DELIVERY RIDER 3D - VEHICLE & RIDER PHYSICS
   Bike / Scooter / Cycle with company branding & explosion ragdoll
   ========================================================= */

class DeliveryVehicle {
  constructor(scene) {
    this.scene = scene;
    this.root = new THREE.Group();
    this.scene.add(this.root);

    // Physics parameters
    this.position = new THREE.Vector3(0, 0, 0);
    this.velocity = new THREE.Vector3(0, 0, 0);
    this.heading = 0; // Yaw angle in radians
    this.speed = 0; // Forward speed (units/sec)
    this.maxSpeed = 19.5; // ~70 km/h normal cruising top speed
    this.accelRate = 12.0; // Responsive, controllable acceleration
    this.brakeRate = 28.0; // Powerful brakes to stop cleanly at roadside
    this.reverseMaxSpeed = 7.0;
    this.steerAngle = 0;
    this.maxSteerAngle = 0.52; // ~30 degrees
    this.steerSpeed = 3.6;
    this.leanAngle = 0;
    this.isDrifting = false;
    this.isNitro = false;
    this.nitroFuel = 100; // 0 to 100%

    // Vertical Jump & Airtime Physics
    this.vy = 0;
    this.isAirborne = false;

    // Dabang Shield Power-Up
    this.isShieldActive = false;
    this.shieldTimer = 0;
    this.shieldMesh = null;

    // Wheelie Stunt State
    this.isWheelie = false;
    this.wheeliePitch = 0;
    this.wheelieTime = 0;
    this.lastWheelieScoreTime = 0;

    // Delivery Bag Gear Upgrades
    this.bagType = 'STANDARD'; // 'STANDARD', 'THERMAL', 'ROCKET_GOLD'
    this.timerMultiplier = 1.0;
    this.nitroRegenBonus = 1.0;

    // First-Person Camera Anchor
    this.fppPosition = new THREE.Vector3();

    // State
    this.isExploded = false;
    this.company = 'ZOMATO'; // 'ZOMATO', 'SWIGGY', 'BLINKIT'
    this.vehicleType = 'BIKE'; // 'CYCLE', 'BIKE', 'SUPERBIKE', 'TURBO_AUTO'

    // Mesh references
    this.chassisMesh = null;
    this.frontFork = null;
    this.frontWheel = null;
    this.rearWheel = null;
    this.riderGroup = null;
    this.backpackMesh = null;
    this.helmetMesh = null;
    this.exhaustFlame = null;

    // Explosion debris
    this.debrisPieces = [];

    // Pre-allocated Tire Smoke Particle Pool (Zero GC allocation at 60 FPS!)
    this.smokeParticles = [];
    const smokeGeo = new THREE.SphereGeometry(0.35, 6, 6);
    const smokeMat = new THREE.MeshBasicMaterial({
      color: 0xe2e8f0,
      transparent: true,
      opacity: 0.45
    });
    for (let i = 0; i < 20; i++) {
      const p = new THREE.Mesh(smokeGeo, smokeMat);
      p.visible = false;
      this.scene.add(p);
      this.smokeParticles.push({
        mesh: p,
        life: 0,
        maxLife: 0.55,
        vx: 0,
        vy: 0,
        vz: 0
      });
    }
    this.smokePoolIdx = 0;

    this.buildVehicle();
  }

  emitSmoke(pos) {
    const p = this.smokeParticles[this.smokePoolIdx];
    this.smokePoolIdx = (this.smokePoolIdx + 1) % this.smokeParticles.length;
    p.mesh.position.set(
      pos.x + (Math.random() - 0.5) * 0.35,
      0.15 + Math.random() * 0.2,
      pos.z + (Math.random() - 0.5) * 0.35
    );
    p.mesh.scale.setScalar(0.55 + Math.random() * 0.35);
    p.mesh.visible = true;
    p.life = 0;
    p.vx = (Math.random() - 0.5) * 1.5;
    p.vy = 1.0 + Math.random() * 1.5;
    p.vz = (Math.random() - 0.5) * 1.5;
  }

  buildVehicle() {
    // Clear root
    while (this.root.children.length > 0) {
      this.root.remove(this.root.children[0]);
    }

    const companyColors = {
      ZOMATO: { primary: 0xef4444, secondary: 0xffffff, bag: 0xdc2626, name: 'Zomato' },
      SWIGGY: { primary: 0xf97316, secondary: 0xffffff, bag: 0xea580c, name: 'Swiggy' },
      BLINKIT: { primary: 0xfacc15, secondary: 0x16a34a, bag: 0xeab308, name: 'Blinkit' }
    };
    const colors = companyColors[this.company] || companyColors.ZOMATO;

    const frameMat = new THREE.MeshStandardMaterial({
      color: colors.primary,
      roughness: 0.35,
      metalness: 0.4
    });
    const metalMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.25,
      metalness: 0.85
    });
    const tireMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.9
    });

    // 1. Main Bike Frame
    const frame = new THREE.Group();
    const bodyGeo = new THREE.BoxGeometry(0.7, 0.8, 2.2);
    const bodyMesh = new THREE.Mesh(bodyGeo, frameMat);
    bodyMesh.position.y = 0.9;
    frame.add(bodyMesh);

    // Fuel Tank / Battery Pack
    const tankGeo = new THREE.BoxGeometry(0.65, 0.45, 1.0);
    const tank = new THREE.Mesh(tankGeo, frameMat);
    tank.position.set(0, 1.35, -0.2);
    frame.add(tank);

    // Headlight
    const lightGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.25, 12);
    const lightMesh = new THREE.Mesh(lightGeo, new THREE.MeshBasicMaterial({ color: 0xfef08a }));
    lightMesh.rotation.x = Math.PI / 2;
    lightMesh.position.set(0, 1.3, -1.2);
    frame.add(lightMesh);

    // Rear Wheel
    const wheelGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.24, 16);
    this.rearWheel = new THREE.Mesh(wheelGeo, tireMat);
    this.rearWheel.rotation.z = Math.PI / 2;
    this.rearWheel.position.set(0, 0.55, 0.85);
    frame.add(this.rearWheel);

    // Front Steerable Fork & Wheel
    this.frontFork = new THREE.Group();
    this.frontFork.position.set(0, 0.55, -1.0);

    const forkStem = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.1, 8), metalMat);
    forkStem.position.y = 0.45;
    this.frontFork.add(forkStem);

    // Handlebars
    const handleBar = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.08, 0.08), metalMat);
    handleBar.position.set(0, 0.95, 0);
    this.frontFork.add(handleBar);

    // Front Wheel
    this.frontWheel = new THREE.Mesh(wheelGeo, tireMat);
    this.frontWheel.rotation.z = Math.PI / 2;
    this.frontFork.add(this.frontWheel);

    frame.add(this.frontFork);

    // Exhaust Pipe & Nitro Flame
    const exhaust = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 1.2, 8), metalMat);
    exhaust.rotation.x = Math.PI / 2 - 0.2;
    exhaust.position.set(0.38, 0.5, 0.75);
    frame.add(exhaust);

    // Blue/Orange Nitro Jet Flame
    const flameGeo = new THREE.ConeGeometry(0.2, 0.9, 8);
    flameGeo.translate(0, -0.45, 0);
    flameGeo.rotateX(-Math.PI / 2);
    this.exhaustFlame = new THREE.Mesh(flameGeo, new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));
    this.exhaustFlame.position.set(0.38, 0.45, 1.35);
    this.exhaustFlame.visible = false;
    frame.add(this.exhaustFlame);

    this.root.add(frame);
    this.chassisMesh = frame;

    // 2. Rider Humanoid Avatar
    this.riderGroup = new THREE.Group();
    this.riderGroup.position.set(0, 0.95, 0.15);

    // Rider Torso in Company Uniform
    const torsoMat = new THREE.MeshStandardMaterial({ color: colors.primary });
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.85, 0.45), torsoMat);
    torso.position.y = 0.65;
    torso.rotation.x = 0.25; // Leaning forward towards handlebars
    this.riderGroup.add(torso);

    // Big Iconic Delivery Backpack Box with Upgrades!
    let bagColor = colors.bag;
    let bagRoughness = 0.5;
    let bagMetalness = 0.1;
    if (this.bagType === 'THERMAL') {
      bagColor = 0xd1d5db; // Metallic silver thermal casing
      bagRoughness = 0.25;
      bagMetalness = 0.6;
    } else if (this.bagType === 'ROCKET_GOLD') {
      bagColor = 0xf59e0b; // Gold plated
      bagRoughness = 0.2;
      bagMetalness = 0.85;
    }

    const bagMat = new THREE.MeshStandardMaterial({
      color: bagColor,
      roughness: bagRoughness,
      metalness: bagMetalness
    });
    this.backpackMesh = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.88, 0.62), bagMat);
    this.backpackMesh.position.set(0, 0.8, 0.48);
    this.backpackMesh.rotation.x = 0.25;
    this.riderGroup.add(this.backpackMesh);

    // Rocket Thrusters if Rocket Gold Bag
    if (this.bagType === 'ROCKET_GOLD') {
      const thrusterMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8 });
      const flameMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
      for (let tx of [-0.44, 0.44]) {
        const pod = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.14, 0.65, 8), thrusterMat);
        pod.rotation.x = Math.PI / 2 + 0.25;
        pod.position.set(tx, 0.8, 0.55);
        this.riderGroup.add(pod);

        const flame = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.35, 6), flameMat);
        flame.rotation.x = -Math.PI / 2;
        flame.position.set(tx, 0.72, 0.95);
        this.riderGroup.add(flame);
      }
    }

    // Rider Helmet & Head
    const helmetMat = new THREE.MeshStandardMaterial({ color: colors.secondary, roughness: 0.2 });
    this.helmetMesh = new THREE.Mesh(new THREE.SphereGeometry(0.35, 12, 12), helmetMat);
    this.helmetMesh.position.set(0, 1.35, -0.15);
    this.riderGroup.add(this.helmetMesh);

    // Visor
    const visor = new THREE.Mesh(
      new THREE.BoxGeometry(0.42, 0.16, 0.15),
      new THREE.MeshBasicMaterial({ color: 0x0f172a })
    );
    visor.position.set(0, 1.35, -0.42);
    this.riderGroup.add(visor);

    // Rider Arms gripping handlebars
    const armL = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.85, 8), torsoMat);
    armL.position.set(-0.45, 0.9, -0.4);
    armL.rotation.x = -1.0;
    this.riderGroup.add(armL);

    const armR = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.85, 8), torsoMat);
    armR.position.set(0.45, 0.9, -0.4);
    armR.rotation.x = -1.0;
    this.riderGroup.add(armR);

    // Rider Legs on Footrests
    const pantsMat = new THREE.MeshStandardMaterial({ color: 0x1e293b });
    const legL = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.7, 0.28), pantsMat);
    legL.position.set(-0.35, 0.15, -0.1);
    this.riderGroup.add(legL);

    const legR = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.7, 0.28), pantsMat);
    legR.position.set(0.35, 0.15, -0.1);
    this.riderGroup.add(legR);

    this.root.add(this.riderGroup);

    // Glowing Dabang Force-Field Shield Sphere
    const shieldGeo = new THREE.SphereGeometry(2.2, 16, 16);
    const shieldMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.38,
      wireframe: true
    });
    this.shieldMesh = new THREE.Mesh(shieldGeo, shieldMat);
    this.shieldMesh.position.y = 1.2;
    this.shieldMesh.visible = false;
    this.root.add(this.shieldMesh);
  }

  setCompany(company) {
    this.company = company;
    this.buildVehicle();
  }

  setBagType(type) {
    this.bagType = type; // 'STANDARD', 'THERMAL', 'ROCKET_GOLD'
    if (type === 'THERMAL') {
      this.timerMultiplier = 0.85; // 15% slower decay!
      this.nitroRegenBonus = 1.25;
    } else if (type === 'ROCKET_GOLD') {
      this.timerMultiplier = 0.72; // 28% slower decay!
      this.nitroRegenBonus = 1.5;
    } else {
      this.timerMultiplier = 1.0;
      this.nitroRegenBonus = 1.0;
    }
    this.buildVehicle();
  }

  setVehicleType(type) {
    this.vehicleType = type; // 'CYCLE', 'BIKE', 'SUPERBIKE', 'TURBO_AUTO'
    if (type === 'CYCLE') {
      this.maxSpeed = 16.5; // ~59 km/h
      this.accelRate = 13.5;
      this.steerSpeed = 4.4;
    } else if (type === 'SUPERBIKE') {
      this.maxSpeed = 26.5; // ~95 km/h (Nitro ~138 km/h!)
      this.accelRate = 17.5;
      this.steerSpeed = 3.4;
    } else if (type === 'TURBO_AUTO') {
      this.maxSpeed = 18.5; // ~66 km/h
      this.accelRate = 11.5;
      this.steerSpeed = 3.0;
    } else {
      // Default 100cc 'BIKE'
      this.maxSpeed = 19.5; // ~70 km/h
      this.accelRate = 12.0;
      this.steerSpeed = 3.6;
    }
    this.buildVehicle();
  }

  triggerJump(force = 8.5) {
    if (!this.isAirborne) {
      this.isAirborne = true;
      this.vy = force;
      if (window.soundEngine) window.soundEngine.playJump();
    }
  }

  activateShield(duration = 8.0) {
    this.isShieldActive = true;
    this.shieldTimer = duration;
    if (this.shieldMesh) this.shieldMesh.visible = true;
    if (window.soundEngine) window.soundEngine.playShieldActivate();
  }

  updatePhysics(dt, input) {
    if (this.isExploded) {
      this.updateExplosionPhysics(dt);
      return;
    }

    // 1. Steering & Drifting
    const steerInput = (input.right ? 1 : 0) - (input.left ? 1 : 0);
    this.isDrifting = input.drift;
    this.isNitro = input.nitro && (this.nitroFuel > 0);

    // Turning rate scales with speed
    const speedRatio = Math.abs(this.speed) / this.maxSpeed;
    const effectiveSteerSpeed = this.isDrifting ? this.steerSpeed * 1.5 : this.steerSpeed;
    this.steerAngle = THREE.MathUtils.lerp(
      this.steerAngle,
      steerInput * this.maxSteerAngle,
      dt * effectiveSteerSpeed
    );

    if (Math.abs(this.speed) > 0.5) {
      const turnDir = (this.speed >= 0 ? 1 : -1);
      this.heading -= this.steerAngle * turnDir * (1.2 + speedRatio * 1.6) * dt;
    }

    // 2. Throttle & Acceleration
    let currentMaxSpeed = this.maxSpeed;
    let accel = this.accelRate;

    if (this.isNitro) {
      currentMaxSpeed *= 1.58; // Nitro reaches ~111 km/h!
      accel *= 1.8;
      this.nitroFuel = Math.max(0, this.nitroFuel - dt * 25);
      this.exhaustFlame.visible = true;
      this.exhaustFlame.scale.set(1, 1 + Math.random() * 0.4, 1);
    } else {
      this.exhaustFlame.visible = false;
      this.nitroFuel = Math.min(100, this.nitroFuel + dt * 6);
    }

    if (input.throttle) {
      this.speed = Math.min(this.speed + accel * dt, currentMaxSpeed);
    } else if (input.brake) {
      if (this.speed > 0.5) {
        this.speed = Math.max(this.speed - this.brakeRate * dt, 0);
      } else {
        this.speed = Math.max(this.speed - this.accelRate * 0.6 * dt, -this.reverseMaxSpeed);
      }
    } else {
      // Natural rolling friction
      const friction = this.isDrifting ? 18.0 : 9.0;
      if (this.speed > 0) {
        this.speed = Math.max(this.speed - friction * dt, 0);
      } else if (this.speed < 0) {
        this.speed = Math.min(this.speed + friction * dt, 0);
      }
    }

    // 3. Position integration
    const forwardX = -Math.sin(this.heading);
    const forwardZ = -Math.cos(this.heading);

    this.velocity.set(forwardX * this.speed, 0, forwardZ * this.speed);
    this.position.addScaledVector(this.velocity, dt);

    // World Boundary Guard: Keep player safely inside the active urban grid!
    const bound = 248;
    if (Math.abs(this.position.x) > bound) {
      this.position.x = Math.sign(this.position.x) * bound;
      this.speed = -this.speed * 0.35;
      if (window.gameInstance) {
        window.gameInstance.showAppNotification('⚠️ CITY ROAD LIMIT! TURN AROUND!', '#f59e0b');
      }
    }
    if (Math.abs(this.position.z) > bound) {
      this.position.z = Math.sign(this.position.z) * bound;
      this.speed = -this.speed * 0.35;
      if (window.gameInstance) {
        window.gameInstance.showAppNotification('⚠️ CITY ROAD LIMIT! TURN AROUND!', '#f59e0b');
      }
    }

    // Vertical Jump & Gravity Integration
    if (this.isAirborne || this.position.y > 0) {
      this.vy -= 26.0 * dt;
      this.position.y += this.vy * dt;
      if (this.position.y <= 0) {
        this.position.y = 0;
        this.vy = 0;
        this.isAirborne = false;
      }
    }

    // Dabang Shield Timer & Force-Field Rotation
    if (this.isShieldActive) {
      this.shieldTimer -= dt;
      if (this.shieldMesh) {
        this.shieldMesh.visible = true;
        this.shieldMesh.rotation.y += dt * 3.5;
        this.shieldMesh.rotation.z += dt * 2.0;
      }
      if (this.shieldTimer <= 0) {
        this.isShieldActive = false;
        if (this.shieldMesh) this.shieldMesh.visible = false;
      }
    }

    // FPP Camera Anchor position
    this.fppPosition.set(
      this.position.x - forwardX * 0.35,
      this.position.y + 1.45,
      this.position.z - forwardZ * 0.35
    );

    // 4. Visual Mesh Updates
    this.root.position.copy(this.position);
    this.root.rotation.y = this.heading;

    // Wheelie Stunt Pitch (Front wheel lifts up!)
    if (input.wheelie && Math.abs(this.speed) > 4.5 && !this.isAirborne) {
      this.isWheelie = true;
      this.wheeliePitch = THREE.MathUtils.lerp(this.wheeliePitch, -0.42, dt * 9);
      this.wheelieTime += dt;
      this.nitroFuel = Math.min(100, this.nitroFuel + dt * 18 * this.nitroRegenBonus);

      const now = performance.now();
      if (now - this.lastWheelieScoreTime > 650) {
        this.lastWheelieScoreTime = now;
        if (window.soundEngine) window.soundEngine.playWheelieStunt();
        if (window.gameInstance) {
          window.gameInstance.score += 45;
          window.gameInstance.spawnComicPopup('🔥 WHEELIE STUNT! +45', this.position);
          window.gameInstance.updateHUD();
        }
      }
    } else {
      this.isWheelie = false;
      this.wheeliePitch = THREE.MathUtils.lerp(this.wheeliePitch, 0, dt * 10);
      this.wheelieTime = 0;
    }
    this.root.rotation.x = this.wheeliePitch;

    // Lean into turns
    const targetLean = -this.steerAngle * speedRatio * (this.isDrifting ? 1.4 : 0.85);
    this.leanAngle = THREE.MathUtils.lerp(this.leanAngle, targetLean, dt * 10);
    this.root.rotation.z = this.leanAngle;

    // Front fork steering turn
    if (this.frontFork) {
      this.frontFork.rotation.y = -this.steerAngle * 1.2;
    }

    // Wheel spin
    const wheelRot = (this.speed * dt) / 0.55;
    if (this.rearWheel) this.rearWheel.rotation.x += wheelRot;
    if (this.frontWheel) this.frontWheel.rotation.x += wheelRot;

    // Update active smoke particles
    this.smokeParticles.forEach(p => {
      if (p.mesh.visible) {
        p.life += dt;
        if (p.life >= p.maxLife) {
          p.mesh.visible = false;
        } else {
          p.mesh.position.x += p.vx * dt;
          p.mesh.position.y += p.vy * dt;
          p.mesh.position.z += p.vz * dt;
          p.mesh.scale.multiplyScalar(1.0 + dt * 1.5);
          p.mesh.material.opacity = 0.45 * (1.0 - p.life / p.maxLife);
        }
      }
    });

    // Emit smoke on drift, wheelie or hard burnouts
    if ((this.isDrifting || this.isWheelie || (input.throttle && Math.abs(this.speed) < 5.0)) && Math.abs(this.speed) > 1.5) {
      if (Math.random() > 0.35) {
        this.emitSmoke(this.position);
      }
    }
  }

  // Trigger catastrophic bomb blast explosion
  explode() {
    if (this.isExploded) return;
    this.isExploded = true;
    this.speed = 0;

    // Hide normal bike and rider
    if (this.chassisMesh) this.chassisMesh.visible = false;
    if (this.riderGroup) this.riderGroup.visible = false;

    // Spawn flying debris pieces (wheels, handlebar, food boxes, rider ragdoll)
    const debrisMats = [
      new THREE.MeshStandardMaterial({ color: 0xef4444 }), // Food bag
      new THREE.MeshStandardMaterial({ color: 0x0f172a }), // Wheels
      new THREE.MeshStandardMaterial({ color: 0xfacc15 }), // Burger / groceries
      new THREE.MeshStandardMaterial({ color: 0x3b82f6 })  // Rider body
    ];

    const count = 16;
    for (let i = 0; i < count; i++) {
      const isRiderPiece = (i === 0);
      const geo = isRiderPiece
        ? new THREE.SphereGeometry(0.8, 8, 8)
        : new THREE.BoxGeometry(0.6 + Math.random() * 0.4, 0.6, 0.6);

      const mat = debrisMats[i % debrisMats.length];
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.copy(this.position);
      mesh.position.y += 1.0;

      const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5);
      const blastPower = isRiderPiece ? (16 + Math.random() * 8) : (10 + Math.random() * 12);

      const vel = new THREE.Vector3(
        Math.cos(angle) * blastPower * 0.6,
        isRiderPiece ? 18.0 : (8.0 + Math.random() * 10),
        Math.sin(angle) * blastPower * 0.6
      );

      const rotSpeed = new THREE.Vector3(
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 15
      );

      this.scene.add(mesh);
      this.debrisPieces.push({ mesh, vel, rotSpeed });
    }
  }

  updateExplosionPhysics(dt) {
    const gravity = 32.0;
    this.debrisPieces.forEach(p => {
      p.vel.y -= gravity * dt;
      p.mesh.position.addScaledVector(p.vel, dt);
      p.mesh.rotation.x += p.rotSpeed.x * dt;
      p.mesh.rotation.y += p.rotSpeed.y * dt;
      p.mesh.rotation.z += p.rotSpeed.z * dt;

      // Bounce on ground
      if (p.mesh.position.y < 0.3) {
        p.mesh.position.y = 0.3;
        p.vel.y = -p.vel.y * 0.4;
        p.vel.x *= 0.7;
        p.vel.z *= 0.7;
      }
    });
  }

  reset(x = 0, z = 0, heading = 0) {
    // Clear debris
    this.debrisPieces.forEach(p => this.scene.remove(p.mesh));
    this.debrisPieces = [];

    this.isExploded = false;
    this.position.set(x, 0, z);
    this.velocity.set(0, 0, 0);
    this.speed = 0;
    this.heading = heading;
    this.steerAngle = 0;
    this.leanAngle = 0;
    this.nitroFuel = 100;

    if (this.chassisMesh) this.chassisMesh.visible = true;
    if (this.riderGroup) this.riderGroup.visible = true;
    if (this.exhaustFlame) this.exhaustFlame.visible = false;

    this.root.position.copy(this.position);
    this.root.rotation.set(0, this.heading, 0);
  }
}

window.DeliveryVehicle = DeliveryVehicle;
