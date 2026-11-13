/**
 * No Brakes Desi Bus Driver 3D - Main Game Engine
 * Features:
 * - Live Passenger Chaos & Speech Bubbles ("Ulti aa gayi!", "Shaadi ka lehenga!", "Ande toot gaye!")
 * - Chai Tapri & Bollywood Cutout Smashes
 * - Mud Puddle Splatter & Windshield Wiping
 * - Highway Police Interceptor Chase AI
 * - Garage Customization: Liveries (Toofan Red, Royal Gold, Cyber Lime) & Roof Gear (Soundbox, Goat, Nitro)
 * - Dynamic Weather (Day, Sunset, Night, Rain) & Cassette Radio Channels
 */

class BusGame {
  constructor() {
    this.state = 'MENU';

    // Scoring & Stats
    this.distance = 0;
    this.chaosMeter = 0;
    this.damageCost = 0; // ₹
    this.cashEarned = 0; // ₹ tips earned
    this.score = 0;
    this.isBollywoodMode = false;
    this.bollywoodTimer = 0;
    this.passengerReactionTimer = 0;

    // Customization & Garage State
    this.unlockedLiveries = ['KOLKATA', 'TOOFAN'];
    this.unlockedRoofItems = ['STANDARD'];

    // Camera & Weather
    this.cameraMode = 'CHASE';
    this.screenShake = 0;
    this.weatherModes = ['DAY', 'SUNSET', 'NIGHT', 'RAIN'];
    this.weatherIdx = 0;

    // Inputs
    this.input = {
      left: false,
      right: false,
      drift: false,
      nitro: false,
      throttle: false
    };

    // Cached HUD state
    this._lastKmh = -1;
    this._lastDist = -1;
    this._lastChaos = -1;
    this._lastDamage = -1;

    this.lastTime = performance.now();

    this.initThree();
    this.initEntities();
    this.bindInputs();
    this.bindUI();

    requestAnimationFrame(this.animate.bind(this));
  }

  initThree() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x38bdf8);
    this.scene.fog = new THREE.FogExp2(0x38bdf8, 0.007);

    this.camera = new THREE.PerspectiveCamera(62, window.innerWidth / window.innerHeight, 0.1, 600);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));

    this._camLookTarget = new THREE.Vector3();

    const container = document.getElementById('gameCanvas');
    if (container) container.appendChild(this.renderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(ambient);

    this.sunLight = new THREE.DirectionalLight(0xffedd5, 1.15);
    this.sunLight.position.set(40, 80, 50);
    this.scene.add(this.sunLight);

    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  initEntities() {
    this.bus = new DesiBus(this.scene);
    this.city = new DesiCity(this.scene);
    this.traffic = new DesiTraffic(this.scene);

    // Police Evaded Callback
    this.traffic.onPoliceEvadedCallback = () => {
      this.cashEarned += 1500;
      this.score += 800;
      this.showAppNotification('🚨 WANTED EVADED! Outran police interceptor! +₹1,500 Bonus!', '#22c55e');
      this.spawnComicPopup('🚨 WANTED EVADED! +₹1,500', this.bus.position);
      this.updateHUD();
    };
  }

  startNewGame() {
    if (window.busAudio) {
      window.busAudio.init();
      window.busAudio.playBhaiNeBola();
    }

    this.state = 'RUNAWAY';
    this.distance = 0;
    this.chaosMeter = 0;
    this.damageCost = 0;
    this.cashEarned = 0;
    this.score = 0;
    this.isBollywoodMode = false;
    this.bollywoodTimer = 0;
    this.passengerReactionTimer = 0;
    this.screenShake = 0;

    // 1. Reset City chunks and remove old obstacles
    this.city.reset();

    // 2. Reset Traffic vehicles
    this.traffic.reset(0);

    // 3. Reset Bus Physics & Kinematics
    this.bus.reset(0, 0, 0);

    // 4. Snap Camera cleanly behind bus
    this.resetCamera();

    // 5. Clean overlays & UI
    const startModal = document.getElementById('startModal');
    if (startModal) startModal.style.display = 'none';

    const gameOverModal = document.getElementById('gameOverModal');
    if (gameOverModal) gameOverModal.style.display = 'none';

    const discoOverlay = document.getElementById('discoOverlay');
    if (discoOverlay) discoOverlay.classList.remove('active');

    const comicContainer = document.getElementById('comic-container');
    if (comicContainer) comicContainer.innerHTML = '';

    // 6. Resume Engine Sound
    if (window.busAudio) {
      window.busAudio.stopPanicMusic();
      window.busAudio.stopPoliceSiren();
      window.busAudio.startEngine();
    }

    this.showAppNotification('🚨 BRAKES HAVE SNAPPED! HOLD GAS [W] TO FLOOR IT!', '#ef4444');
    this.spawnComicPopup('🚨 NO BRAKES! RUNAWAY!', this.bus.position);
    this.updateHUD();
  }

  resetCamera() {
    this.screenShake = 0;
    const s = this.bus;
    const forwardX = -Math.sin(s.heading);
    const forwardZ = -Math.cos(s.heading);
    const camDist = 13.5 + (s.speed / 30.0) * 4.0;
    const camHeight = 5.2 + (s.speed / 30.0) * 1.5;

    this.camera.position.set(
      s.position.x - forwardX * camDist,
      s.position.y + camHeight,
      s.position.z - forwardZ * camDist
    );
    const lookTarget = new THREE.Vector3(s.position.x + forwardX * 8.0, s.position.y + 2.0, s.position.z + forwardZ * 8.0);
    this.camera.lookAt(lookTarget);
    this.camera.rotation.z = 0;
  }

  triggerGameOver(reason = 'CRASH') {
    this.state = 'GAMEOVER';
    this.bus.explode();
    this.traffic.stopPoliceChase();

    if (window.busAudio) {
      window.busAudio.stopEngine();
      window.busAudio.stopPanicMusic();
      window.busAudio.playBlastLate();
    }

    this.screenShake = 1.2;
    this.showAppNotification('💥 CATASTROPHIC BUS CRASH! BUS OVERTURNED!', '#ef4444');
    this.spawnComicPopup('BOOM! WRECKED!', this.bus.position);

    setTimeout(() => {
      const finalDist = document.getElementById('finalDistVal');
      if (finalDist) finalDist.textContent = Math.floor(this.distance) + ' Meters';

      const finalDamage = document.getElementById('finalDamageVal');
      if (finalDamage) finalDamage.textContent = '₹' + this.damageCost.toLocaleString();

      const finalScore = document.getElementById('finalScoreVal');
      if (finalScore) finalScore.textContent = Math.floor(this.score).toLocaleString();

      const modal = document.getElementById('gameOverModal');
      if (modal) modal.style.display = 'flex';
    }, 1800);
  }

  activateBollywoodMode() {
    this.isBollywoodMode = true;
    this.bollywoodTimer = 7.0;
    this.screenShake = 0.6;

    if (window.busAudio) {
      window.busAudio.playChaosModeFanfare();
      window.busAudio.startPanicMusic();
    }

    this.showAppNotification('🌟 BOLLYWOOD DISASTER MODE! 2X CHAOS & INVINCIBLE!', '#facc15');
    this.spawnComicPopup('🌟 BOLLYWOOD CHAOS!', this.bus.position);

    const discoOverlay = document.getElementById('discoOverlay');
    if (discoOverlay) discoOverlay.classList.add('active');
  }

  deactivateBollywoodMode() {
    this.isBollywoodMode = false;
    this.chaosMeter = 0;
    if (window.busAudio) window.busAudio.stopPanicMusic();

    const discoOverlay = document.getElementById('discoOverlay');
    if (discoOverlay) discoOverlay.classList.remove('active');
  }

  addChaos(amount, bonusScore = 150) {
    const mult = this.isBollywoodMode ? 2 : 1;
    this.chaosMeter = Math.min(100, this.chaosMeter + amount);
    this.score += bonusScore * mult;

    if (this.chaosMeter >= 100 && !this.isBollywoodMode) {
      this.activateBollywoodMode();
    }
    this.updateHUD();
  }

  animate(now) {
    requestAnimationFrame(this.animate.bind(this));

    const rawDt = (now - this.lastTime) / 1000;
    const dt = Math.min(Math.max(rawDt, 0.008), 0.04);
    this.lastTime = now;

    if (this.state === 'RUNAWAY') {
      this.updateGameplay(dt);
    }

    this.bus.updatePhysics(dt, this.input);

    const kmh = Math.floor(this.bus.speed * 3.6);
    if (window.busAudio && (this.state === 'RUNAWAY')) {
      window.busAudio.updateEngine(kmh, this.bus.isDrifting, this.bus.isNitro, this.input.throttle);
    }

    this.city.update(dt, this.bus.position);
    this.updateCamera(dt);

    this.renderer.render(this.scene, this.camera);
  }

  updateGameplay(dt) {
    const kmh = Math.floor(this.bus.speed * 3.6);
    this.distance += this.bus.speed * dt;
    this.score += this.bus.speed * dt * 2.0;

    // 1. Bollywood Mode Countdown
    if (this.isBollywoodMode) {
      this.bollywoodTimer -= dt;
      if (this.bollywoodTimer <= 0) {
        this.deactivateBollywoodMode();
      }
    } else {
      this.chaosMeter = Math.max(0, this.chaosMeter - dt * 2.5);
    }

    // 2. Handbrake Drift Chaos & Thrill Tips
    if (this.bus.isDrifting) {
      this.addChaos(dt * 9.0, 60);
      if (Math.random() < 0.04) {
        this.triggerPassengerReaction('DRIFT');
      }
    }

    // 3. Periodic Passenger Reactions
    this.passengerReactionTimer += dt;
    if (this.passengerReactionTimer > 7.0) {
      this.passengerReactionTimer = 0;
      if (kmh > 100) {
        this.triggerPassengerReaction('SPEED');
      }
    }

    // 4. Highway Police Interceptor Chase Check
    if (this.damageCost >= 12000 && !this.traffic.policeActive) {
      this.traffic.triggerPoliceChase(this.bus.position);
      this.showAppNotification('🚨 POLICE INTERCEPTOR JOINED THE CHASE! OUTRUN THEM!', '#ef4444');
      this.spawnComicPopup('🚨 POLICE CHASE!', this.bus.position);
    }

    // 5. Check Smashable Obstacles
    const smashed = this.city.checkSmashables(this.bus.position);
    if (smashed) {
      this.screenShake = 0.5;
      if (smashed.type === 'CHAI_TAPRI') {
        this.damageCost += 1800;
        this.addChaos(15, 800);
        if (window.busAudio) {
          window.busAudio.playChaiTapriSmash();
          window.busAudio.playPassengerScream();
        }
        this.spawnComicPopup('☕ CHAI TAPRI OBLITERATED! +₹1,800', this.bus.position);
        this.showAppNotification('☕ CHAI TAPRI SMASHED! Tea kettle & glass shattered!', '#f59e0b');
      } else if (smashed.type === 'BOLLYWOOD_CUTOUT') {
        this.damageCost += 2500;
        this.addChaos(22, 1100);
        if (window.busAudio) window.busAudio.playFruitStallSmash();
        this.spawnComicPopup('🎬 HERO POSTER SHATTERED! +₹2,500', this.bus.position);
      } else if (smashed.type === 'FRUIT_CART') {
        this.damageCost += 1200;
        this.addChaos(12, 600);
        if (window.busAudio) {
          window.busAudio.playFruitStallSmash();
          window.busAudio.playPassengerScream();
        }
        this.spawnComicPopup('🍉 SABZI THELA SMASHED! +₹1,200', this.bus.position);
      } else if (smashed.type === 'TOLL_BARRIER') {
        this.damageCost += 3500;
        this.addChaos(20, 1000);
        if (window.busAudio) {
          window.busAudio.playTollBarrierSmash();
          window.busAudio.playGianCrash();
        }
        this.spawnComicPopup('💥 TOLL NAKA SMASHED! FREE PASS!', this.bus.position);
      }
    }

    // 6. Check Mud Puddle Splash
    if (this.city.checkPuddles(this.bus.position)) {
      if (window.busAudio) window.busAudio.playPuddleSplash();
      this.showMudSplatter();
      this.spawnComicPopup('💦 MUD PUDDLE SPLASH!', this.bus.position);
    }

    // 7. Check Stunt Ramp Jump
    if (this.city.checkStuntRamps(this.bus.position)) {
      this.bus.triggerRampJump(15.8);
      this.addChaos(25, 1200);
      this.spawnComicPopup('🚀 MEGA BOLLYWOOD JUMP!', this.bus.position);
      if (window.busAudio) window.busAudio.playPassengerScream();
    }

    // 8. Check Holy Cow Hit
    if (this.city.checkCowHit(this.bus.position)) {
      this.screenShake = 0.7;
      this.bus.speed = Math.max(12.0, this.bus.speed * 0.6);
      if (window.busAudio) window.busAudio.playSlowBump();
      this.spawnComicPopup('🐮 COW BUMP! SLOW DOWN!', this.bus.position);
    }

    // 9. Traffic Simulation & Crash Handling
    this.traffic.update(
      dt,
      this.bus.position,
      this.bus.speed,
      (v) => {
        this.addChaos(6, 300);
        this.spawnComicPopup('🔥 NEAR MISS! +300', this.bus.position);
      },
      (v) => {
        if (this.isBollywoodMode) {
          this.traffic.launchVehiclePhysics(v, this.bus.position, this.bus.speed * 1.35);
          this.damageCost += 5000;
          this.addChaos(15, 800);
          this.screenShake = 0.65;
          this.spawnComicPopup('💥 BOLLYWOOD SMASH!', this.bus.position);
          if (window.busAudio) window.busAudio.playFruitStallSmash();
        } else {
          if (this.bus.speed > 24.0) {
            this.traffic.launchVehiclePhysics(v, this.bus.position, this.bus.speed);
            this.triggerGameOver('CRASH');
          } else {
            this.traffic.launchVehiclePhysics(v, this.bus.position, this.bus.speed * 0.75);
            this.bus.speed *= 0.65;
            this.damageCost += 2000;
            this.screenShake = 0.55;
            if (window.busAudio) {
              window.busAudio.playGianCrash();
              window.busAudio.playSlowBump();
            }
            this.spawnComicPopup('💥 CRASH BUMP! -₹2000', this.bus.position);
          }
        }
      }
    );

    // Highway Shoulder Curb Bounce (Keeps bus on the 24m wide National Highway)
    const maxRoadX = 13.0;
    if (Math.abs(this.bus.position.x) > maxRoadX) {
      this.bus.position.x = Math.sign(this.bus.position.x) * maxRoadX;
      this.bus.heading *= -0.3;
      this.screenShake = 0.4;
      if (Math.random() < 0.25 && window.busAudio) {
        window.busAudio.playSlowBump();
      }
    }

    this.updateHUD();
  }

  // Live Comic Passenger Speech Bubbles & Reactions
  triggerPassengerReaction(type) {
    const reactions = [
      { text: '🤢 "Arey bhaiyya mere ko ulti aa gayi!"', isVomit: true },
      { text: '👵 "Oye driver! Baas me shaadi ka lehenga hai!"' },
      { text: '🥚 "Aaram se chalao, ande phut jayenge!"' },
      { text: '🎫 "Chhotu aakhri seat se ticket kaat re!"' },
      { text: '🔥 "Mast drift mara bhaiyya! +₹500 Tip!"', isTip: true }
    ];

    const r = reactions[Math.floor(Math.random() * reactions.length)];
    if (r.isVomit && window.busAudio) {
      window.busAudio.playPassengerVomitGag();
    }
    if (r.isTip) {
      this.cashEarned += 500;
      this.score += 250;
      this.spawnComicPopup('💵 THRILL TIP +₹500!', this.bus.position);
    }

    this.showAppNotification(r.text, r.isVomit ? '#16a34a' : '#9333ea');
  }

  showMudSplatter() {
    const el = document.getElementById('mudSplatter');
    if (!el) return;
    el.classList.add('active');
    setTimeout(() => el.classList.remove('active'), 1800);
  }

  toggleWeather() {
    this.weatherIdx = (this.weatherIdx + 1) % this.weatherModes.length;
    const mode = this.weatherModes[this.weatherIdx];
    this.city.setWeather(mode);

    const weatherIcons = {
      DAY: '☀️ DAY',
      SUNSET: '🌅 SUNSET',
      NIGHT: '🌙 NIGHT',
      RAIN: '🌧️ RAIN'
    };
    const el = document.getElementById('weatherTxt');
    if (el) el.textContent = weatherIcons[mode];
    this.showAppNotification(`🌤️ Weather switched to ${mode}!`, '#0ea5e9');
  }

  cycleRadio() {
    if (!window.busAudio) return;
    const station = window.busAudio.cycleRadio();
    const el = document.getElementById('radioStationTxt');
    if (el) el.textContent = station.name;
    this.showAppNotification(`📻 FM RADIO: ${station.name}`, '#a855f7');
    this.spawnComicPopup(`📻 ${station.name}`, this.bus.position);
  }

  toggleCamera() {
    if (this.cameraMode === 'CHASE') this.cameraMode = 'HOOD';
    else if (this.cameraMode === 'HOOD') this.cameraMode = 'DRONE';
    else this.cameraMode = 'CHASE';

    const el = document.getElementById('camModeTxt');
    if (el) el.textContent = this.cameraMode;
    this.showAppNotification(`📹 Camera switched to ${this.cameraMode} View!`, '#6366f1');
  }

  toggleGarageModal() {
    const modal = document.getElementById('garageModal');
    if (!modal) return;
    const isVisible = (modal.style.display === 'flex');
    if (isVisible) {
      modal.style.display = 'none';
    } else {
      this.updateGarageUI();
      modal.style.display = 'flex';
    }
  }

  updateGarageUI() {
    const cashEl = document.getElementById('garageCashVal');
    if (cashEl) cashEl.textContent = '₹' + this.cashEarned;

    const list = document.getElementById('garageList');
    if (!list) return;
    list.innerHTML = '';

    const liveries = [
      { id: 'KOLKATA', name: '🚌 Kolkata 206 Special (WB 04 05711)', price: 0, icon: '🚍', desc: 'Iconic Sky Blue & Yellow Private Bus with Safety Grill & AWAZ DANGER KARO Bumper!' },
      { id: 'TOOFAN', name: '🔥 Toofan Superfast', price: 0, icon: '🚌', desc: 'Classic Deep Crimson & Golden Yellow State Express!' },
      { id: 'ROYAL', name: '👑 Royal Rajdhani Sleeper', price: 1500, icon: '💜', desc: 'Rich Purple & Gold Luxury Deluxe Livery.' },
      { id: 'ROCKET', name: '🚀 Cyber Rocket Express', price: 3000, icon: '⚡', desc: 'Electric Emerald Green & Cyber Cyan with Turbo Decals!' }
    ];

    liveries.forEach(l => {
      const isUnlocked = this.unlockedLiveries.includes(l.id);
      const isCurrent = this.bus.currentLivery === l.id;

      const card = document.createElement('div');
      card.className = `garage-card ${isCurrent ? 'selected' : ''}`;
      card.innerHTML = `
        <div class="garage-card-icon">${l.icon}</div>
        <div class="garage-card-details">
          <div class="garage-card-name">${l.name}</div>
          <div class="garage-card-desc">${l.desc}</div>
        </div>
        <div class="garage-card-action">
          ${isCurrent
            ? `<button class="garage-btn equipped" disabled>EQUIPPED</button>`
            : isUnlocked
              ? `<button class="garage-btn select-liv-btn" data-id="${l.id}">EQUIP</button>`
              : `<button class="garage-btn buy-liv-btn" data-id="${l.id}" data-price="${l.price}">BUY ₹${l.price}</button>`}
        </div>
      `;
      list.appendChild(card);
    });

    list.querySelectorAll('.select-liv-btn').forEach(b => {
      b.addEventListener('click', () => {
        const id = b.getAttribute('data-id');
        this.bus.setLivery(id);
        this.updateGarageUI();
        this.showAppNotification(`🎨 Equipped ${id} Bus Paint!`, '#10b981');
      });
    });

    list.querySelectorAll('.buy-liv-btn').forEach(b => {
      b.addEventListener('click', () => {
        const id = b.getAttribute('data-id');
        const price = parseInt(b.getAttribute('data-price'), 10);
        if (this.cashEarned >= price) {
          this.cashEarned -= price;
          this.unlockedLiveries.push(id);
          this.bus.setLivery(id);
          this.updateGarageUI();
          this.updateHUD();
          this.showAppNotification(`🎉 Purchased ${id}!`, '#22c55e');
        } else {
          this.showAppNotification(`❌ Need ₹${price}! (You have ₹${this.cashEarned})`, '#ef4444');
        }
      });
    });
  }

  updateCamera(dt) {
    const s = this.bus;
    const forwardX = -Math.sin(s.heading);
    const forwardZ = -Math.cos(s.heading);

    let shakeX = 0;
    let shakeY = 0;
    if (this.screenShake > 0) {
      shakeX = (Math.random() - 0.5) * this.screenShake;
      shakeY = (Math.random() - 0.5) * this.screenShake;
      this.screenShake = Math.max(0, this.screenShake - dt * 2.2);
    }

    if (this.cameraMode === 'HOOD') {
      this.camera.position.set(s.position.x, s.position.y + 2.2 + shakeY, s.position.z - 3.8);
      this.camera.lookAt(s.position.x + forwardX * 18, s.position.y + 1.2, s.position.z + forwardZ * 18);
    } else if (this.cameraMode === 'DRONE') {
      this.camera.position.set(s.position.x + shakeX, s.position.y + 38.0 + shakeY, s.position.z + 18.0);
      this.camera.lookAt(s.position.x, s.position.y, s.position.z);
    } else {
      const camDist = 13.5 + (s.speed / 30.0) * 4.0;
      const camHeight = 5.2 + (s.speed / 30.0) * 1.5;

      // Dynamic camera swing on lateral drift
      const driftLagX = (s.lateralSlip || 0) * 0.25;
      const targetX = s.position.x - forwardX * camDist + driftLagX + shakeX;
      const targetY = s.position.y + camHeight + shakeY;
      const targetZ = s.position.z - forwardZ * camDist;

      const damp = 1.0 - Math.exp(-12.0 * dt);
      this.camera.position.x = THREE.MathUtils.lerp(this.camera.position.x, targetX, damp);
      this.camera.position.y = THREE.MathUtils.lerp(this.camera.position.y, targetY, damp);
      this.camera.position.z = THREE.MathUtils.lerp(this.camera.position.z, targetZ, damp);

      this._camLookTarget.set(s.position.x + forwardX * 8.0, s.position.y + 2.0, s.position.z + forwardZ * 8.0);
      this.camera.lookAt(this._camLookTarget);
      this.camera.rotation.z = s.rollAngle * 0.45;

      // Dynamic FOV speed warp physics
      const targetFov = 62 + (s.speed / 42.0) * 14.0;
      if (Math.abs(this.camera.fov - targetFov) > 0.2) {
        this.camera.fov = THREE.MathUtils.lerp(this.camera.fov, targetFov, dt * 5.0);
        this.camera.updateProjectionMatrix();
      }
    }
  }

  updateHUD() {
    const kmh = Math.floor(this.bus.speed * 3.6);
    if (this._lastKmh !== kmh) {
      this._lastKmh = kmh;
      const el = document.getElementById('speedoVal');
      if (el) el.textContent = kmh;
    }

    const distInt = Math.floor(this.distance);
    if (this._lastDist !== distInt) {
      this._lastDist = distInt;
      const el = document.getElementById('distVal');
      if (el) el.textContent = distInt + 'm';
    }

    const chaosInt = Math.floor(this.chaosMeter);
    if (this._lastChaos !== chaosInt) {
      this._lastChaos = chaosInt;
      const bar = document.getElementById('chaosFill');
      if (bar) bar.style.width = chaosInt + '%';
      const txt = document.getElementById('chaosTxt');
      if (txt) txt.textContent = chaosInt + '%';
    }

    if (this._lastDamage !== this.damageCost) {
      this._lastDamage = this.damageCost;
      const el = document.getElementById('damageVal');
      if (el) el.textContent = '₹' + this.damageCost.toLocaleString();
    }

    const nitroFill = document.getElementById('nitroFill');
    if (nitroFill) nitroFill.style.width = this.bus.nitroFuel + '%';
  }

  showAppNotification(text, bgColor = '#ef4444') {
    const el = document.getElementById('appNotification');
    if (!el) return;
    el.textContent = text;
    el.style.background = bgColor;
    el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), 2800);
  }

  spawnComicPopup(text, pos) {
    const container = document.getElementById('comic-container');
    if (!container) return;
    const el = document.createElement('div');
    el.className = 'comic-popup';
    el.textContent = text;
    const rot = (Math.random() - 0.5) * 24;
    el.style.transform = `translate(-50%, -50%) rotate(${rot}deg) scale(0.6)`;
    el.style.left = `${50 + (Math.random() - 0.5) * 24}%`;
    el.style.top = `${45 + (Math.random() - 0.5) * 18}%`;
    container.appendChild(el);
    requestAnimationFrame(() => {
      el.style.transform = `translate(-50%, -50px) rotate(${rot}deg) scale(1.15)`;
      el.style.opacity = '1';
    });
    setTimeout(() => {
      el.style.opacity = '0';
      setTimeout(() => el.remove(), 250);
    }, 750);
  }

  bindInputs() {
    window.addEventListener('keydown', (e) => {
      const k = e.key.toLowerCase();
      if (k === 'w' || k === 'arrowup') {
        this.input.throttle = true;
        const b = document.getElementById('btnGas');
        if (b) b.classList.add('pressed');
      }
      if (k === 'a' || k === 'arrowleft') {
        this.input.left = true;
        const b = document.getElementById('btnLeft');
        if (b) b.classList.add('pressed');
      }
      if (k === 'd' || k === 'arrowright') {
        this.input.right = true;
        const b = document.getElementById('btnRight');
        if (b) b.classList.add('pressed');
      }
      if (k === ' ' || k === 'x') {
        this.input.drift = true;
      }
      if (k === 'shift') {
        this.input.nitro = true;
        const b = document.getElementById('btnNitro');
        if (b) b.classList.add('pressed');
        if (window.busAudio) window.busAudio.playNitroRoar();
      }
      if (k === 'h') {
        const b = document.getElementById('btnHorn');
        if (b) b.classList.add('pressed');
        if (window.busAudio) window.busAudio.playMusicalAirHorn();
        const cleared = this.traffic.honkReaction(this.bus.position);
        const scared = this.city.honkScareCows(this.bus.position);
        if (scared > 0) this.spawnComicPopup('🐮 COWS EVADED! +300', this.bus.position);
        if (cleared > 0) {
          this.spawnComicPopup(`📢 GADI SIDE DILO! (${cleared})`, this.bus.position);
          this.score += cleared * 100;
        } else {
          this.spawnComicPopup('📢 PA-PA-POO-POO!', this.bus.position);
        }
      }
      if (k === 'c') this.toggleCamera();
      if (k === 'v') this.toggleWeather();
      if (k === 'r') this.cycleRadio();
      if (k === 'g') this.toggleGarageModal();
    });

    window.addEventListener('keyup', (e) => {
      const k = e.key.toLowerCase();
      if (k === 'w' || k === 'arrowup') {
        this.input.throttle = false;
        const b = document.getElementById('btnGas');
        if (b) b.classList.remove('pressed');
      }
      if (k === 'a' || k === 'arrowleft') {
        this.input.left = false;
        const b = document.getElementById('btnLeft');
        if (b) b.classList.remove('pressed');
      }
      if (k === 'd' || k === 'arrowright') {
        this.input.right = false;
        const b = document.getElementById('btnRight');
        if (b) b.classList.remove('pressed');
      }
      if (k === ' ' || k === 'x') {
        this.input.drift = false;
      }
      if (k === 'shift') {
        this.input.nitro = false;
        const b = document.getElementById('btnNitro');
        if (b) b.classList.remove('pressed');
      }
      if (k === 'h') {
        const b = document.getElementById('btnHorn');
        if (b) b.classList.remove('pressed');
      }
    });

    const bindTouch = (id, prop, onStart) => {
      const el = document.getElementById(id);
      if (!el) return;
      const start = (e) => {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
        this.input[prop] = true;
        el.classList.add('pressed');
        if (onStart) onStart();
      };
      const end = (e) => {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
        this.input[prop] = false;
        el.classList.remove('pressed');
      };
      el.addEventListener('pointerdown', start);
      el.addEventListener('pointerup', end);
      el.addEventListener('pointercancel', end);
      el.addEventListener('pointerleave', end);
      el.addEventListener('contextmenu', (e) => e.preventDefault());
    };

    bindTouch('btnGas', 'throttle');
    bindTouch('btnNitro', 'nitro', () => {
      if (window.busAudio) window.busAudio.playNitroRoar();
    });
    bindTouch('btnLeft', 'left');
    bindTouch('btnRight', 'right');
    bindTouch('btnDrift', 'drift');

    const hornBtn = document.getElementById('btnHorn');
    if (hornBtn) {
      let lastHonkTime = 0;
      const doHonk = (e) => {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
        const now = Date.now();
        if (now - lastHonkTime < 250) return;
        lastHonkTime = now;

        hornBtn.classList.add('pressed');
        setTimeout(() => hornBtn.classList.remove('pressed'), 180);

        if (window.busAudio) window.busAudio.playMusicalAirHorn();
        const cleared = this.traffic.honkReaction(this.bus.position);
        const scared = this.city.honkScareCows(this.bus.position);
        if (scared > 0) this.spawnComicPopup('🐮 COWS EVADED! +300', this.bus.position);
        if (cleared > 0) {
          this.spawnComicPopup(`📢 GADI SIDE DILO! (${cleared})`, this.bus.position);
          this.score += cleared * 100;
        } else {
          this.spawnComicPopup('📢 PA-PA-POO-POO!', this.bus.position);
        }
      };

      hornBtn.addEventListener('pointerdown', doHonk);
      hornBtn.addEventListener('click', doHonk);
    }
  }

  bindUI() {
    const startBtn = document.getElementById('startBtn');
    if (startBtn) startBtn.addEventListener('click', () => this.startNewGame());

    const restartBtn = document.getElementById('restartBtn');
    if (restartBtn) restartBtn.addEventListener('click', () => this.startNewGame());

    const btnCam = document.getElementById('btnCam');
    if (btnCam) btnCam.addEventListener('click', () => this.toggleCamera());

    const btnWeather = document.getElementById('btnWeather');
    if (btnWeather) btnWeather.addEventListener('click', () => this.toggleWeather());

    const btnRadio = document.getElementById('btnRadio');
    if (btnRadio) btnRadio.addEventListener('click', () => this.cycleRadio());

    const btnGarage = document.getElementById('btnGarage');
    if (btnGarage) btnGarage.addEventListener('click', () => this.toggleGarageModal());

    const closeGarageBtn = document.getElementById('closeGarageBtn');
    if (closeGarageBtn) closeGarageBtn.addEventListener('click', () => this.toggleGarageModal());
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.busGame = new BusGame();
});
