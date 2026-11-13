/* =========================================================
   FUNNY DELIVERY RIDER 3D - MAIN GAME LOGIC & LOOP
   Order cycle, ticking bomb timer, blast physics & controls
   ========================================================= */

// Game Constants
const START_POS = new THREE.Vector3(0, 0, 0);

class DeliveryGame {
  constructor() {
    this.state = 'START'; // 'START', 'SEEKING_PICKUP', 'DELIVERING', 'GAMEOVER', 'PAUSED'
    window.gameInstance = this;
    this.score = 0;
    this.cashEarned = 0;
    this.deliveriesCompleted = 0;
    this.nearMissCount = 0;
    this.orderTimer = 0;
    this.maxOrderTime = 45.0; // 45 seconds to deliver
    this.currentOrder = null;

    // Multiple Camera modes: 'CHASE', 'FPP', 'DRONE'
    this.cameraMode = 'CHASE';

    // Dynamic Weather system: 'SUNNY', 'SUNSET', 'NIGHT', 'RAIN'
    this.weatherModes = ['SUNNY', 'SUNSET', 'NIGHT', 'RAIN'];
    this.weatherIdx = 0;

    // Vehicle Garage & Upgrades
    this.unlockedVehicles = ['CYCLE', 'BIKE'];
    try {
      const saved = localStorage.getItem('deliveryRider_unlockedVehicles');
      if (saved) this.unlockedVehicles = JSON.parse(saved);
    } catch (e) {}
    this.currentVehicleType = 'BIKE';

    // Delivery Bags Gear Upgrades
    this.unlockedBags = ['STANDARD'];
    try {
      const savedBags = localStorage.getItem('deliveryRider_unlockedBags');
      if (savedBags) this.unlockedBags = JSON.parse(savedBags);
    } catch (e) {}
    this.currentBagType = 'STANDARD';
    this.garageTab = 'VEHICLES'; // 'VEHICLES' or 'BAGS'

    // Controls input state
    this.input = {
      throttle: false,
      brake: false,
      left: false,
      right: false,
      drift: false,
      nitro: false,
      wheelie: false
    };

    this.initThree();
    this.city = new CityManager(this.scene);
    this.city.buildCity();

    this.vehicle = new DeliveryVehicle(this.scene);
    this.traffic = new TrafficManager(
      this.scene,
      this.city.cityExtent,
      this.city.blockSize,
      this.city.streetWidth,
      this.city.gridSize
    );

    this.createGpsArrow();
    this.bindInputs();
    this.bindUI();

    this.lastTime = performance.now();
    requestAnimationFrame(this.animate.bind(this));
  }

  initThree() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x38bdf8); // Sky blue
    this.scene.fog = new THREE.FogExp2(0x38bdf8, 0.0016); // Clear panoramic visibility

    // Expansive 1400m far plane to eliminate blank horizon
    this.camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.5, 1400);
    this.camera.position.set(0, 6, 12);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;

    const container = document.getElementById('gameCanvas');
    if (container) container.appendChild(this.renderer.domElement);

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.75);
    this.scene.add(ambient);

    this.sunLight = new THREE.DirectionalLight(0xfffbeb, 1.25);
    this.sunLight.position.set(60, 100, 60);
    this.scene.add(this.sunLight);

    const fill = new THREE.DirectionalLight(0x93c5fd, 0.45);
    fill.position.set(-60, 40, -40);
    this.scene.add(fill);

    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  createGpsArrow() {
    // High-tech 3D Glowing Compass Arrow hovering above bike
    const group = new THREE.Group();
    const arrowMat = new THREE.MeshBasicMaterial({
      color: 0x22c55e, // Emerald Green / Fluorescent Lime
      depthTest: false // Renders on top so never obstructed by camera
    });

    // Arrow tip points along local +Z axis so lookAt() points directly at target!
    const cone = new THREE.Mesh(new THREE.ConeGeometry(0.75, 1.8, 10), arrowMat);
    cone.rotation.x = Math.PI / 2; // Tip (+Y) moves to +Z
    cone.position.z = 0.5;
    cone.renderOrder = 999;
    group.add(cone);

    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 1.4, 8), arrowMat);
    shaft.position.z = -0.55;
    shaft.rotation.x = Math.PI / 2;
    shaft.renderOrder = 999;
    group.add(shaft);

    // Futuristic chevron rear fins
    const finMat = new THREE.MeshBasicMaterial({ color: 0xfacc15, depthTest: false });
    const finL = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.35, 1.1), finMat);
    finL.position.set(-0.65, 0, -0.4);
    finL.rotation.y = 0.6;
    finL.renderOrder = 999;
    group.add(finL);

    const finR = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.35, 1.1), finMat);
    finR.position.set(0.65, 0, -0.4);
    finR.rotation.y = -0.6;
    finR.renderOrder = 999;
    group.add(finR);

    group.position.y = 4.2;
    this.scene.add(group);
    this.gpsArrow = group;
  }

  startNewGame(company = 'ZOMATO') {
    window.soundEngine.init();
    this.state = 'PLAYING';
    this.score = 0;
    this.cashEarned = 0;
    this.deliveriesCompleted = 0;
    this.nearMissCount = 0;
    window.soundEngine.stopUrgentPanic();

    this.vehicle.setCompany(company);
    if (this.currentVehicleType) {
      this.vehicle.setVehicleType(this.currentVehicleType);
    }
    if (this.currentBagType) {
      this.vehicle.setBagType(this.currentBagType);
    }
    this.vehicle.reset(0, 0, 0);

    // Start Order Lifecycle
    this.spawnNextPickup();

    document.getElementById('startModal').style.display = 'none';
    document.getElementById('gameOverModal').style.display = 'none';
    this.updateHUD();
  }

  spawnNextPickup() {
    this.state = 'SEEKING_PICKUP';

    // Truly random and different shop across the 25 blocks every single order!
    const shop = this.city.getRandomShopPickup();
    this.currentPickupSpot = shop.pos;
    this.currentShop = shop;
    this.city.setPickupTarget(this.currentPickupSpot);
    this.city.hideDropoffTarget();

    // Fast, challenging countdown timer to reach restaurant before cancel!
    const dist = this.vehicle.position.distanceTo(this.currentPickupSpot);
    this.orderTimer = Math.max(16, Math.floor(dist / 14 + 9));
    this.maxOrderTime = this.orderTimer;
    this.lastTickSec = Math.ceil(this.orderTimer);

    this.showAppNotification(`📱 NEW ORDER: Rush to ${shop.name}! (${this.orderTimer}s before cancel!)`, '#10b981');
    window.soundEngine.playOrderReceived(); // "Bhai ne bola karne ka!"
    document.getElementById('orderStatusBadge').textContent = 'STEP 1: PICKUP ORDER (CHALLENGE)';
    document.getElementById('orderStatusBadge').style.background = '#10b981';
    document.getElementById('orderItemTxt').textContent = `${shop.item} @ ${shop.name}`;
    document.getElementById('timerVal').textContent = `${this.orderTimer}s`;
    document.getElementById('timerVal').classList.remove('urgent');
  }

  onOrderPickedUp() {
    this.state = 'DELIVERING';
    window.soundEngine.playPickup();
    setTimeout(() => {
      window.soundEngine.playOrderReceived(); // "Bhai ne bola karne ka toh karne ka!"
    }, 250);
    this.city.hidePickupTarget();

    // Distant residential dropoff house across town (at least 100m away!)
    const dropoff = this.city.getRandomDropoffHouse(this.currentPickupSpot, 100);
    this.currentDropoffSpot = dropoff.pos;
    this.currentCustomer = dropoff;
    this.city.setDropoffTarget(this.currentDropoffSpot);

    // Tight, adrenaline-fueled delivery dropoff timer!
    const dist = this.vehicle.position.distanceTo(this.currentDropoffSpot);
    this.orderTimer = Math.max(18, Math.floor(dist / 13.5 + 8));
    this.maxOrderTime = this.orderTimer;
    this.lastTickSec = Math.ceil(this.orderTimer);

    this.showAppNotification(`📦 ORDER PICKED! Deliver to ${dropoff.customer} in ${this.orderTimer}s before bike BLASTS!`, '#f97316');
    this.spawnComicPopup('PICKED UP!', this.vehicle.position);

    document.getElementById('orderStatusBadge').textContent = 'STEP 2: RUSH TO CUSTOMER!';
    document.getElementById('orderStatusBadge').style.background = '#ef4444';
    document.getElementById('orderItemTxt').textContent = `Deliver to: ${dropoff.customer} • ${dropoff.address}`;
  }

  onOrderDelivered() {
    this.deliveriesCompleted++;
    window.soundEngine.stopUrgentPanic();

    const timeRatio = this.orderTimer / this.maxOrderTime;
    let stars = 5;
    let reviewText = '⭐⭐⭐⭐⭐ Superfast & Piping Hot! "Best delivery rider!"';
    let tip = 140 + Math.floor(this.orderTimer * 6);

    if (timeRatio >= 0.38) {
      stars = 5;
      reviewText = '⭐⭐⭐⭐⭐ Superfast & Piping Hot! "Best delivery rider!" +₹65 Bonus Tip!';
      tip += 65;
      if (window.soundEngine) window.soundEngine.play5StarCheer();
    } else if (timeRatio >= 0.20) {
      stars = 4;
      reviewText = '⭐⭐⭐⭐ On time delivery! "Bhaiyya extra sauce mast tha!" +₹35 Tip!';
      tip += 35;
      if (window.soundEngine) window.soundEngine.playDelivered();
    } else if (timeRatio >= 0.08) {
      stars = 3;
      reviewText = '⭐⭐⭐ Just made it! "Khana thoda thanda ho gaya bhaiyya!"';
      tip = Math.floor(tip * 0.7);
      if (window.soundEngine) window.soundEngine.playDelivered();
    } else {
      stars = 2;
      reviewText = '⭐⭐ Barely made it! "Lift kharab thi to seedhi se aane me itna late?"';
      tip = 25;
      if (window.soundEngine) window.soundEngine.play1StarDisappoint();
    }

    this.cashEarned += tip;
    this.score += 500 + stars * 150 + Math.floor(this.orderTimer * 30);

    this.showAppNotification(`🎉 ${reviewText}`, stars >= 4 ? '#22c55e' : '#f59e0b');
    this.spawnComicPopup(`DELIVERED! ${stars}★`, this.vehicle.position);

    // Lucky Diwali Tip Surprise Box (35% chance on 4★ or 5★ deliveries)
    if (stars >= 4 && Math.random() < 0.35) {
      this.triggerLuckyDiwaliBonus();
    }

    this.updateHUD();

    // Prepare next order
    setTimeout(() => {
      if (this.state === 'DELIVERING' || this.state === 'SEEKING_PICKUP') {
        this.spawnNextPickup();
      }
    }, 1800);
  }

  // Lucky Diwali Tip Surprise Box
  triggerLuckyDiwaliBonus() {
    const bonusCash = 100;
    this.cashEarned += bonusCash;
    this.score += 400;
    this.vehicle.nitroFuel = 100; // full nitro refill
    if (window.soundEngine) window.soundEngine.playLuckyBonus();
    this.showAppNotification('🎁 DIWALI LUCKY BONUS! Customer gave ₹100 Tip + 100% NITRO BOOST!', '#eab308');
    this.spawnComicPopup('🎁 DIWALI BONUS! +₹100', this.vehicle.position);
  }

  // Speed Trap Flash & E-Challan
  triggerSpeedCameraFlash(kmh) {
    const fine = 45;
    this.cashEarned = Math.max(0, this.cashEarned - fine);
    if (window.soundEngine) window.soundEngine.playCameraShutter();

    const overlay = document.getElementById('speedFlashOverlay');
    if (overlay) {
      overlay.classList.add('flash');
      setTimeout(() => overlay.classList.remove('flash'), 160);
    }

    this.showAppNotification(`📸 E-CHALLAN: Speed Trap caught you at ${kmh} km/h! -₹${fine} Fine!`, '#ef4444');
    this.spawnComicPopup(`📸 E-CHALLAN! -₹${fine}`, this.vehicle.position);
    this.updateHUD();
  }

  // Trigger catastrophic bomb explosion when delivery timer runs out!
  triggerBombBlast(reason = 'TIMER') {
    this.state = 'GAMEOVER';
    this.vehicle.explode();
    window.soundEngine.playBlast();
    window.soundEngine.stopEngine();
    window.soundEngine.stopUrgentPanic();

    if (reason === 'TIMER') {
      window.soundEngine.playBlastLate(); // "ma-ka-bhosda-aag.mp3"!
      this.showAppNotification('💥 TIME\'S UP! ORDER CANCELLED! BIKE EXPLODED!', '#ef4444');
      this.spawnComicPopup('BOOM! BLAST!', this.vehicle.position);
    } else {
      window.soundEngine.playAccidentMeme(); // "gian-hain-aap.mp3" or "uth-jaa.mp3"!
      this.showAppNotification('💥 CATASTROPHIC CRASH! BIKE WRECKED!', '#ef4444');
      this.spawnComicPopup('CRASH!', this.vehicle.position);
    }

    setTimeout(() => {
      document.getElementById('finalCashVal').textContent = '₹' + this.cashEarned;
      document.getElementById('finalOrdersVal').textContent = this.deliveriesCompleted;
      document.getElementById('finalOvertakesVal').textContent = this.nearMissCount;
      document.getElementById('finalScoreVal').textContent = Math.floor(this.score).toLocaleString();
      document.getElementById('gameOverModal').style.display = 'flex';
    }, 1800);
  }

  updateHUD() {
    const scoreRounded = Math.floor(this.score);
    if (this._lastScore !== scoreRounded) {
      this._lastScore = scoreRounded;
      const el = document.getElementById('scoreVal');
      if (el) el.textContent = scoreRounded.toLocaleString();
    }

    if (this._lastCash !== this.cashEarned) {
      this._lastCash = this.cashEarned;
      const el = document.getElementById('cashVal');
      if (el) el.textContent = '₹' + this.cashEarned;
    }

    if (this._lastOrders !== this.deliveriesCompleted) {
      this._lastOrders = this.deliveriesCompleted;
      const el = document.getElementById('ordersVal');
      if (el) el.textContent = this.deliveriesCompleted;
    }

    const kmh = Math.floor(Math.abs(this.vehicle.speed) * 3.6);
    if (this._lastKmh !== kmh) {
      this._lastKmh = kmh;
      const el = document.getElementById('speedoVal');
      if (el) el.textContent = kmh;
    }

    const nitroInt = Math.floor(this.vehicle.nitroFuel);
    if (this._lastNitro !== nitroInt) {
      this._lastNitro = nitroInt;
      const nitroFill = document.getElementById('nitroFill');
      if (nitroFill) nitroFill.style.width = nitroInt + '%';
    }
  }

  showAppNotification(text, bgColor = '#10b981') {
    const el = document.getElementById('appNotification');
    if (!el) return;
    el.textContent = text;
    el.style.background = bgColor;
    el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), 3000);
  }

  spawnComicPopup(text, pos) {
    const container = document.getElementById('comic-container');
    if (!container) return;
    const el = document.createElement('div');
    el.className = 'comic-popup';
    el.textContent = text;
    const rot = (Math.random() - 0.5) * 20;
    el.style.transform = `translate(-50%, -50%) rotate(${rot}deg) scale(0.6)`;
    el.style.left = `${50 + (Math.random() - 0.5) * 20}%`;
    el.style.top = `${45 + (Math.random() - 0.5) * 15}%`;
    container.appendChild(el);
    requestAnimationFrame(() => {
      el.style.transform = `translate(-50%, -50px) rotate(${rot}deg) scale(1.1)`;
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
      if (k === 'w' || k === 'arrowup') this.input.throttle = true;
      if (k === 's' || k === 'arrowdown') this.input.brake = true;
      if (k === 'a' || k === 'arrowleft') this.input.left = true;
      if (k === 'd' || k === 'arrowright') this.input.right = true;
      if (k === ' ' || k === 'x') this.input.drift = true;
      if (k === 'shift') {
        this.input.nitro = true;
        window.soundEngine.playNitro();
      }
      if (k === 'h') {
        window.soundEngine.playHorn();
        window.soundEngine.playJaldiWahaSe(); // "Jaldi waha se hato!"
        this.traffic.honkReaction(this.vehicle.position);
        this.city.honkScareDogs(this.vehicle.position);
        this.spawnComicPopup('📢 JALDI WAHA SE HATO!', this.vehicle.position);
      }
      if (k === 'c') {
        this.toggleCamera();
      }
      if (k === 'v') {
        this.toggleWeather();
      }
      if (k === 'g') {
        this.toggleGarageModal();
      }
      if (k === 'f') {
        this.input.wheelie = true;
      }
      if (k === 'r') {
        if (window.soundEngine) {
          const station = window.soundEngine.cycleRadioStation();
          const radioTxt = document.getElementById('radioStationTxt');
          if (radioTxt) radioTxt.textContent = station.name;
          this.showAppNotification(`📻 FM RADIO: ${station.name}`, '#a855f7');
          this.spawnComicPopup(`📻 ${station.name}`, this.vehicle.position);
        }
      }
    });

    window.addEventListener('keyup', (e) => {
      const k = e.key.toLowerCase();
      if (k === 'w' || k === 'arrowup') this.input.throttle = false;
      if (k === 's' || k === 'arrowdown') this.input.brake = false;
      if (k === 'a' || k === 'arrowleft') this.input.left = false;
      if (k === 'd' || k === 'arrowright') this.input.right = false;
      if (k === ' ' || k === 'x') this.input.drift = false;
      if (k === 'shift') this.input.nitro = false;
      if (k === 'f') this.input.wheelie = false;
    });

    // Mobile Virtual Touch Buttons
    const bindTouch = (id, prop) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('pointerdown', (e) => { e.preventDefault(); this.input[prop] = true; });
      el.addEventListener('pointerup', (e) => { e.preventDefault(); this.input[prop] = false; });
      el.addEventListener('pointercancel', (e) => { e.preventDefault(); this.input[prop] = false; });
    };

    bindTouch('btnGas', 'throttle');
    bindTouch('btnBrake', 'brake');
    bindTouch('btnLeft', 'left');
    bindTouch('btnRight', 'right');
    bindTouch('btnDrift', 'drift');
    bindTouch('btnNitro', 'nitro');
    bindTouch('btnWheelie', 'wheelie');

    const hornBtn = document.getElementById('btnHorn');
    if (hornBtn) {
      hornBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.soundEngine.playHorn();
        window.soundEngine.playJaldiWahaSe();
        this.traffic.honkReaction(this.vehicle.position);
        this.city.honkScareDogs(this.vehicle.position);
        this.spawnComicPopup('📢 JALDI WAHA SE HATO!', this.vehicle.position);
      });
    }
  }

  bindUI() {
    document.querySelectorAll('.company-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.company-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    const startBtn = document.getElementById('startBtn');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        const activeComp = document.querySelector('.company-btn.active');
        const company = activeComp ? activeComp.getAttribute('data-company') : 'ZOMATO';
        this.startNewGame(company);
      });
    }

    const restartBtn = document.getElementById('restartBtn');
    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        this.startNewGame(this.vehicle.company);
      });
    }

    const memeBgmBtn = document.getElementById('memeBgmBtn');
    if (memeBgmBtn) {
      memeBgmBtn.addEventListener('click', () => {
        const playing = window.soundEngine.toggleMemeSong();
        memeBgmBtn.classList.toggle('active', playing);
      });
    }

    const btnRadio = document.getElementById('btnRadio');
    if (btnRadio) {
      btnRadio.addEventListener('click', () => {
        if (window.soundEngine) {
          const station = window.soundEngine.cycleRadioStation();
          const radioTxt = document.getElementById('radioStationTxt');
          if (radioTxt) radioTxt.textContent = station.name;
          this.showAppNotification(`📻 FM RADIO: ${station.name}`, '#a855f7');
          this.spawnComicPopup(`📻 ${station.name}`, this.vehicle.position);
        }
      });
    }

    const btnCam = document.getElementById('btnCam');
    if (btnCam) btnCam.addEventListener('click', () => this.toggleCamera());

    const btnWeather = document.getElementById('btnWeather');
    if (btnWeather) btnWeather.addEventListener('click', () => this.toggleWeather());

    const btnGarage = document.getElementById('btnGarage');
    if (btnGarage) btnGarage.addEventListener('click', () => this.toggleGarageModal());

    const closeGarageBtn = document.getElementById('closeGarageBtn');
    if (closeGarageBtn) closeGarageBtn.addEventListener('click', () => this.toggleGarageModal());

    const tabVehicles = document.getElementById('tabVehicles');
    if (tabVehicles) {
      tabVehicles.addEventListener('click', () => {
        this.garageTab = 'VEHICLES';
        this.updateGarageUI();
      });
    }

    const tabBags = document.getElementById('tabBags');
    if (tabBags) {
      tabBags.addEventListener('click', () => {
        this.garageTab = 'BAGS';
        this.updateGarageUI();
      });
    }
  }

  animate(now) {
    requestAnimationFrame(this.animate.bind(this));

    const rawDt = (now - this.lastTime) / 1000;
    const dt = Math.min(Math.max(rawDt, 0.008), 0.04);
    this.lastTime = now;

    if (this.state === 'SEEKING_PICKUP' || this.state === 'DELIVERING') {
      this.updateGameplay(dt);
    }

    // Vehicle physics & explosion animation
    this.vehicle.updatePhysics(dt, this.input);

    // Engine Audio
    if (this.state === 'SEEKING_PICKUP' || this.state === 'DELIVERING') {
      window.soundEngine.updateEngine(this.vehicle.speed, this.vehicle.maxSpeed, this.input.throttle);
    }

    // Traffic simulation & near-miss detection
    this.traffic.update(
      dt,
      this.vehicle.position,
      this.vehicle.speed,
      (v) => {
        // High-Speed Near Miss!
        this.nearMissCount++;
        this.score += 150;
        this.vehicle.nitroFuel = Math.min(100, this.vehicle.nitroFuel + 25);
        window.soundEngine.playNearMiss();
        this.spawnComicPopup('🔥 NEAR MISS! +NITRO!', this.vehicle.position);
        if (Math.random() > 0.6) window.soundEngine.playDirtInEye();
        this.updateHUD();
      },
      (v) => {
        const kmh = Math.floor(Math.abs(this.vehicle.speed) * 3.6);
        // Direct crash collision!
        if (Math.abs(this.vehicle.speed) > 17.0) {
          this.triggerBombBlast('CRASH');
        } else if (kmh <= 18 || Math.abs(this.vehicle.speed) <= 5.0) {
          // Low speed collision (15 km/h or below) -> Sourav Joshi meme!
          this.vehicle.speed *= -0.4;
          window.soundEngine.playHorn();
          window.soundEngine.playSouravJoshi();
          this.spawnComicPopup('🤬 OYE ARAM SE! (SLOW BUMP)', this.vehicle.position);
          this.showAppNotification('💥 15 KM/H BUMP! "OYE ARAM SE CHALA!"', '#f59e0b');
        } else {
          // Medium speed bump & bounce
          this.vehicle.speed *= -0.55;
          window.soundEngine.playHorn();
          window.soundEngine.playAccidentMeme(); // "Gian hain aap!" or "Uth jaa!"
          this.spawnComicPopup('CRASH!', this.vehicle.position);
        }
      },
      this.vehicle.isShieldActive
    );

    // City animations (burger spin, customer waving, street dog chasing, power-ups)
    this.city.update(dt, this.vehicle.position);

    // Chase Camera
    this.updateCamera(dt);

    // GPS Navigation Arrow
    this.updateGpsArrow();

    this.renderer.render(this.scene, this.camera);
  }

  updateGameplay(dt) {
    const kmh = Math.floor(Math.abs(this.vehicle.speed) * 3.6);
    document.getElementById('speedoVal').textContent = kmh;

    const nitroFill = document.getElementById('nitroFill');
    if (nitroFill) nitroFill.style.width = this.vehicle.nitroFuel + '%';

    // 0. Speed Bump Jump & Airtime Stunt Check
    const bump = this.city.checkSpeedBumps(this.vehicle.position);
    if (bump && !this.vehicle.isAirborne && Math.abs(this.vehicle.speed) > 7.0) {
      this.vehicle.triggerJump(8.8);
      if (window.soundEngine) window.soundEngine.playJump();
      this.spawnComicPopup('AIRTIME JUMP! 🚀', this.vehicle.position);
      this.score += 75;
      this.updateHUD();
    }

    // 0. Roadside Power-Up Collection Check
    const powerUp = this.city.checkPowerUpCollect(this.vehicle.position);
    if (powerUp) {
      if (powerUp === 'CHAI') {
        this.orderTimer += 7;
        if (window.soundEngine) window.soundEngine.playChaiPickup();
        this.spawnComicPopup('☕ CHAI BOOST! +7s', this.vehicle.position);
        this.showAppNotification('☕ TAPRI CHAI! +7 Seconds added to Bomb Timer!', '#f59e0b');
      } else if (powerUp === 'SHIELD') {
        this.vehicle.activateShield(8.0);
        if (window.soundEngine) window.soundEngine.playShieldActivate();
        this.spawnComicPopup('🛡️ DABANG SHIELD!', this.vehicle.position);
        this.showAppNotification('🛡️ DABANG SHIELD! Invincible: Smashes cars away for 8s!', '#38bdf8');
      } else if (powerUp === 'COIN') {
        this.cashEarned += 35;
        this.score += 200;
        if (window.soundEngine) window.soundEngine.playCoin();
        this.spawnComicPopup('🪙 CASH BONUS +₹35', this.vehicle.position);
        this.showAppNotification('🪙 BONUS CASH! +₹35 Extra Tip!', '#22c55e');
      }
      this.updateHUD();
    }

    // 0. Stunt Ramp Leaps Check (Bollywood high jump over traffic!)
    const ramp = this.city.checkStuntRamps(this.vehicle.position);
    if (ramp && !this.vehicle.isAirborne && Math.abs(this.vehicle.speed) > 6.5) {
      this.vehicle.triggerJump(14.0);
      if (window.soundEngine) window.soundEngine.playJump();
      this.spawnComicPopup('🚀 MEGA RAMP JUMP! AIRTIME +150', this.vehicle.position);
      this.score += 150;
      this.updateHUD();
    }

    // 0. Muddy Road Puddle Splash Slip Check
    const puddle = this.city.checkPuddleSlip(this.vehicle.position);
    if (puddle) {
      this.vehicle.heading += (Math.random() - 0.5) * 0.42;
      this.vehicle.speed *= 0.86;
      if (window.soundEngine) window.soundEngine.playSplash();
      this.spawnComicPopup('💦 MUD PUDDLE! SLIP!', this.vehicle.position);
      this.showMudSplatter();
    }

    // 0. Indian Wedding Barat Street Crowd Encounter
    const wedding = this.city.checkWeddingParty(this.vehicle.position, this.input.horn);
    if (wedding === 'BLOCKING') {
      this.vehicle.speed = Math.min(this.vehicle.speed, 5.0);
    } else if (wedding === 'CLEARED') {
      this.spawnComicPopup('🎉 SHAVA SHAVA! +50', this.vehicle.position);
      this.score += 50;
    }

    // 0. Police Naka Checkpoint Overspeed Check
    if (this.city.checkPoliceNaka(this.vehicle.position, kmh)) {
      this.traffic.triggerPoliceChase(this.vehicle.position);
    }

    // 0. Overhead Speed Trap Camera (MG Road)
    if (this.city.checkSpeedTrap && this.city.checkSpeedTrap(this.vehicle.position, kmh)) {
      this.triggerSpeedCameraFlash(kmh);
    }

    // 1. APP TELEMATICS RULE: Max Speed Limit 80 km/h (Normal riding at 60-70 km/h is safe!)
    const speedLimit = 80;
    const speedoCard = document.querySelector('.speedo-card');
    const speedoVal = document.getElementById('speedoVal');

    if (kmh > speedLimit) {
      this.overspeedTime = (this.overspeedTime || 0) + dt;
      if (speedoVal) speedoVal.classList.add('overspeed');
      if (speedoCard) speedoCard.classList.add('overspeed-card');

      // Only penalty if reckless sustained speeding for > 3.0 consecutive seconds!
      if (this.overspeedTime > 3.0) {
        this.overspeedTime = 0;
        window.soundEngine.playOverspeedBeep();
        const penalty = 20;
        this.cashEarned = Math.max(0, this.cashEarned - penalty);
        this.showAppNotification(`⚠️ OVERSPEED VIOLATION! (${kmh} km/h > 80 Limit) -₹${penalty} Fine!`, '#ef4444');
        this.spawnComicPopup('OVERSPEED! -₹20', this.vehicle.position);
        this.updateHUD();
      }
    } else {
      this.overspeedTime = 0;
      if (speedoVal) speedoVal.classList.remove('overspeed');
      if (speedoCard) speedoCard.classList.remove('overspeed-card');
    }

    // 2. TRAFFIC RULE: Red Light Intersection Violation Check
    const sigViolation = this.city.checkTrafficLightViolation(this.vehicle.position, kmh);
    if (sigViolation) {
      window.soundEngine.playPoliceWhistle();
      this.cashEarned = Math.max(0, this.cashEarned - sigViolation.fine);
      this.showAppNotification(`🚨 TRAFFIC COP: Red Light Jumped! -₹${sigViolation.fine} Challan!`, '#ef4444');
      this.spawnComicPopup('RED LIGHT! -₹50', this.vehicle.position);
      this.updateHUD();
    }

    // 3. Challenging Countdown Timer (Runs during BOTH pickup & delivery!)
    if (this.state === 'SEEKING_PICKUP' || this.state === 'DELIVERING') {
      const decayRate = (this.vehicle && this.vehicle.timerMultiplier) ? this.vehicle.timerMultiplier : 1.0;
      this.orderTimer -= dt * decayRate;
      const currentSec = Math.ceil(this.orderTimer);
      const timerEl = document.getElementById('timerVal');
      timerEl.textContent = Math.max(0, currentSec) + 's';

      // Urgent Ticking Clock Audio & Pulse when timer < 8 seconds!
      if (this.orderTimer <= 8.0 && this.orderTimer > 0) {
        timerEl.classList.add('urgent');
        if (currentSec !== this.lastTickSec) {
          this.lastTickSec = currentSec;
          window.soundEngine.playTick();
        }
      } else {
        timerEl.classList.remove('urgent');
      }

      // Check Bomb Blast failure!
      if (this.orderTimer <= 0) {
        this.triggerBombBlast('TIMER');
        return;
      }
    }

    // 4. Check Roadside Pickup Zone Arrival (Generous 7.0m parking curb radius)
    if (this.state === 'SEEKING_PICKUP' && this.currentPickupSpot) {
      const dist = this.vehicle.position.distanceTo(this.currentPickupSpot);
      document.getElementById('distVal').textContent = Math.floor(dist) + 'm to Restaurant';
      if (dist < 7.0) {
        this.onOrderPickedUp();
      }
    }

    // 5. Check Roadside Customer Dropoff Zone Arrival (Generous 7.0m parking curb radius)
    if (this.state === 'DELIVERING' && this.currentDropoffSpot) {
      const dist = this.vehicle.position.distanceTo(this.currentDropoffSpot);
      document.getElementById('distVal').textContent = Math.floor(dist) + 'm to Customer';

      // Dramatic panic meme music when delivery is far away (> 65m) and time is low (<= 12s)!
      if (dist > 65 && this.orderTimer <= 12.0) {
        window.soundEngine.playUrgentPanic();
      }

      if (dist < 7.0) {
        this.onOrderDelivered();
      }
    }

    this.updateHUD();
  }

  updateGpsArrow() {
    if (!this.gpsArrow) return;

    const targetPos = (this.state === 'SEEKING_PICKUP')
      ? this.currentPickupSpot
      : (this.state === 'DELIVERING' ? this.currentDropoffSpot : null);

    if (targetPos) {
      this.gpsArrow.visible = true;

      // Position right above player's bike with gentle bobbing
      this.gpsArrow.position.copy(this.vehicle.position);
      this.gpsArrow.position.y += 4.2 + Math.sin(performance.now() * 0.007) * 0.35;

      // 3D Arrow points DIRECTLY to destination in world space with 100% precision
      this.gpsArrow.lookAt(targetPos.x, this.gpsArrow.position.y, targetPos.z);

      // Color arrow based on state (Green for Pickup, Hot Orange/Red for Dropoff)
      const arrowColor = (this.state === 'SEEKING_PICKUP') ? 0x22c55e : 0xf97316;
      this.gpsArrow.children.forEach(c => {
        if (c.material) c.material.color.setHex(arrowColor);
      });

      // Update On-Screen Turn-by-Turn GPS HUD Banner & Rotating Needle
      this.updateGpsHUD(targetPos);

      // Update Mini-Map Radar
      this.drawRadar(targetPos);
    } else {
      this.gpsArrow.visible = false;
      const navBanner = document.getElementById('gpsNavBanner');
      if (navBanner) navBanner.style.display = 'none';
    }
  }

  // Turn-by-turn navigation banner update (Google Maps style)
  updateGpsHUD(targetPos) {
    const navBanner = document.getElementById('gpsNavBanner');
    const needle = document.getElementById('gpsNeedle');
    const instructionTxt = document.getElementById('gpsInstructionTxt');
    const distTxt = document.getElementById('gpsDistTxt');
    if (!navBanner || !needle) return;

    navBanner.style.display = 'flex';

    const dx = targetPos.x - this.vehicle.position.x;
    const dz = targetPos.z - this.vehicle.position.z;
    const dist = Math.hypot(dx, dz);

    // Angle of target vector (dx, dz):
    const targetAngle = Math.atan2(dx, dz);
    // Relative angle in radians (difference between target angle and vehicle heading)
    let relAngle = targetAngle - (this.vehicle.heading + Math.PI);
    while (relAngle > Math.PI) relAngle -= Math.PI * 2;
    while (relAngle < -Math.PI) relAngle += Math.PI * 2;

    const deg = relAngle * (180 / Math.PI);
    needle.style.transform = `rotate(${-deg}deg)`;

    // Human-readable turn directions
    let instruction = '';
    let icon = '⬆';
    if (dist < 7.5) {
      instruction = (this.state === 'SEEKING_PICKUP') ? 'STOP IN GREEN CIRCLE TO PICKUP!' : 'STOP IN RED CIRCLE TO DELIVER!';
      icon = '🎯';
    } else if (Math.abs(deg) < 28) {
      instruction = `STRAIGHT AHEAD (${Math.floor(dist)}m)`;
      icon = '⬆';
    } else if (deg > 28 && deg < 150) {
      instruction = `TURN RIGHT (${Math.floor(dist)}m)`;
      icon = '➡';
    } else if (deg < -28 && deg > -150) {
      instruction = `TURN LEFT (${Math.floor(dist)}m)`;
      icon = '⬅';
    } else {
      instruction = `MAKE A U-TURN (${Math.floor(dist)}m)`;
      icon = '🔄';
    }

    if (instructionTxt) instructionTxt.textContent = `${icon} ${instruction}`;
    if (distTxt) distTxt.textContent = `${Math.floor(dist)}m`;
  }

  // Mini-Map Radar Drawing
  drawRadar(targetPos) {
    const canvas = document.getElementById('radarCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const radius = w / 2 - 4;

    ctx.clearRect(0, 0, w, h);

    // Radar circular background
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#38bdf8';
    ctx.stroke();
    ctx.clip();

    // Radar concentric rings
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.28)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 0.45, 0, Math.PI * 2);
    ctx.arc(cx, cy, radius * 0.8, 0, Math.PI * 2);
    ctx.stroke();

    // Crosshairs
    ctx.beginPath();
    ctx.moveTo(cx, 4);
    ctx.lineTo(cx, h - 4);
    ctx.moveTo(4, cy);
    ctx.lineTo(w - 4, cy);
    ctx.stroke();

    // Scale: 200 meters = radius
    const scale = (radius * 0.8) / 200;

    // Draw Target Blip
    if (targetPos) {
      const dx = targetPos.x - this.vehicle.position.x;
      const dz = targetPos.z - this.vehicle.position.z;

      // Rotate coordinates by vehicle heading so UP is always bike facing direction
      const cosH = Math.cos(this.vehicle.heading);
      const sinH = Math.sin(this.vehicle.heading);
      const rotX = dx * cosH - dz * sinH;
      const rotZ = dx * sinH + dz * cosH;

      const blipX = cx + rotX * scale;
      const blipY = cy + rotZ * scale;

      // Clamp to radar perimeter
      const bDist = Math.hypot(blipX - cx, blipY - cy);
      let finalX = blipX;
      let finalY = blipY;
      if (bDist > radius - 8) {
        finalX = cx + ((blipX - cx) / bDist) * (radius - 8);
        finalY = cy + ((blipY - cy) / bDist) * (radius - 8);
      }

      // Glowing pulsating blip
      const blipCol = (this.state === 'SEEKING_PICKUP') ? '#10b981' : '#ef4444';
      ctx.fillStyle = blipCol;
      ctx.shadowColor = blipCol;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(finalX, finalY, 5.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // Draw Player Bike at Center (White triangle pointing UP)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(cx, cy - 7);
    ctx.lineTo(cx - 5, cy + 6);
    ctx.lineTo(cx + 5, cy + 6);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  updateCamera(dt) {
    const s = this.vehicle;
    const forwardX = -Math.sin(s.heading);
    const forwardZ = -Math.cos(s.heading);

    if (this.cameraMode === 'FPP') {
      // First-person handlebar rider view
      const fpp = s.fppPosition || s.position.clone().add(new THREE.Vector3(0, 1.45, 0));
      this.camera.position.copy(fpp);
      const lookTarget = new THREE.Vector3(
        fpp.x + forwardX * 16.0,
        fpp.y + 0.15,
        fpp.z + forwardZ * 16.0
      );
      this.camera.lookAt(lookTarget);
    } else if (this.cameraMode === 'DRONE') {
      // Bird's-eye tactical drone view
      const damp = 1.0 - Math.exp(-10.0 * dt);
      const targetX = s.position.x;
      const targetY = s.position.y + 36.0;
      const targetZ = s.position.z + 16.0;
      this.camera.position.x = THREE.MathUtils.lerp(this.camera.position.x, targetX, damp);
      this.camera.position.y = THREE.MathUtils.lerp(this.camera.position.y, targetY, damp);
      this.camera.position.z = THREE.MathUtils.lerp(this.camera.position.z, targetZ, damp);
      this.camera.lookAt(s.position.x, s.position.y, s.position.z);
    } else {
      // Default: Dynamic third-person chase camera
      const camDist = 9.5;
      const camHeight = 4.8;

      const targetX = s.position.x - forwardX * camDist;
      const targetY = s.position.y + camHeight;
      const targetZ = s.position.z - forwardZ * camDist;

      const damp = 1.0 - Math.exp(-12.0 * dt);
      this.camera.position.x = THREE.MathUtils.lerp(this.camera.position.x, targetX, damp);
      this.camera.position.y = THREE.MathUtils.lerp(this.camera.position.y, targetY, damp);
      this.camera.position.z = THREE.MathUtils.lerp(this.camera.position.z, targetZ, damp);

      const lookTarget = new THREE.Vector3(
        s.position.x + forwardX * 6.0,
        s.position.y + 1.2,
        s.position.z + forwardZ * 6.0
      );
      this.camera.lookAt(lookTarget);
    }

    // Follow sunlight
    if (this.sunLight) {
      this.sunLight.position.set(s.position.x + 40, 80, s.position.z + 50);
      this.sunLight.target.position.copy(s.position);
      this.sunLight.target.updateMatrixWorld();
    }
  }

  toggleCamera() {
    if (this.cameraMode === 'CHASE') this.cameraMode = 'FPP';
    else if (this.cameraMode === 'FPP') this.cameraMode = 'DRONE';
    else this.cameraMode = 'CHASE';

    const labelMap = {
      CHASE: '🎥 CHASE',
      FPP: '🏍️ FPP',
      DRONE: '🛸 DRONE'
    };
    const el = document.getElementById('camModeTxt');
    if (el) el.textContent = labelMap[this.cameraMode];
    this.showAppNotification(`📹 Camera switched to ${this.cameraMode} View!`, '#6366f1');
  }

  toggleWeather() {
    this.weatherIdx = (this.weatherIdx + 1) % this.weatherModes.length;
    const mode = this.weatherModes[this.weatherIdx];
    this.city.setWeather(mode);

    const weatherIcons = {
      SUNNY: '☀️ SUNNY',
      SUNSET: '🌅 SUNSET',
      NIGHT: '🌙 NIGHT',
      RAIN: '🌧️ RAIN'
    };
    const el = document.getElementById('weatherTxt');
    if (el) el.textContent = weatherIcons[mode];
    this.showAppNotification(`🌤️ Weather switched to ${mode}!`, '#0ea5e9');
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

    // Update Tab button active styles
    const tabVehicles = document.getElementById('tabVehicles');
    const tabBags = document.getElementById('tabBags');
    if (tabVehicles) tabVehicles.classList.toggle('active', this.garageTab === 'VEHICLES');
    if (tabBags) tabBags.classList.toggle('active', this.garageTab === 'BAGS');

    if (this.garageTab === 'BAGS') {
      const bags = [
        { id: 'STANDARD', name: 'Standard Delivery Bag', price: 0, icon: '🎒', desc: 'Standard cloth bag. Normal food cooling rate.' },
        { id: 'THERMAL', name: '⚡ Thermal Heated Bag', price: 150, icon: '💼', desc: 'Keeps food warm! Timer runs 15% slower, +25% nitro refill rate.' },
        { id: 'ROCKET_GOLD', name: '🚀 Rocket Jet Gold Box', price: 350, icon: '🏆', desc: 'Twin jet thrusters! Piping hot meals! Timer runs 28% slower, +50% nitro!' }
      ];

      bags.forEach(b => {
        const isUnlocked = this.unlockedBags.includes(b.id);
        const isCurrent = this.currentBagType === b.id;

        const card = document.createElement('div');
        card.className = `garage-card ${isCurrent ? 'selected' : ''}`;
        card.innerHTML = `
          <div class="garage-card-icon">${b.icon}</div>
          <div class="garage-card-details">
            <div class="garage-card-name">${b.name}</div>
            <div class="garage-card-desc">${b.desc}</div>
          </div>
          <div class="garage-card-action">
            ${
              isCurrent
                ? `<button class="garage-btn equipped" disabled>EQUIPPED</button>`
                : isUnlocked
                  ? `<button class="garage-btn select-bag-btn" data-id="${b.id}">EQUIP</button>`
                  : `<button class="garage-btn buy-bag-btn" data-id="${b.id}" data-price="${b.price}">BUY ₹${b.price}</button>`
            }
          </div>
        `;
        list.appendChild(card);
      });

      list.querySelectorAll('.select-bag-btn').forEach(b => {
        b.addEventListener('click', () => {
          this.selectBag(b.getAttribute('data-id'));
        });
      });

      list.querySelectorAll('.buy-bag-btn').forEach(b => {
        b.addEventListener('click', () => {
          const id = b.getAttribute('data-id');
          const price = parseInt(b.getAttribute('data-price'), 10);
          if (this.cashEarned >= price) {
            this.cashEarned -= price;
            this.unlockedBags.push(id);
            try {
              localStorage.setItem('deliveryRider_unlockedBags', JSON.stringify(this.unlockedBags));
            } catch (e) {}
            window.soundEngine.playCoin();
            this.showAppNotification(`🎉 Purchased ${id} Bag!`, '#22c55e');
            this.selectBag(id);
          } else {
            this.showAppNotification(`❌ Not enough cash! Need ₹${price} (You have ₹${this.cashEarned})`, '#ef4444');
          }
        });
      });
    } else {
      // VEHICLES
      const vehicles = [
        { id: 'CYCLE', name: 'Eco Delivery E-Cycle', price: 0, topSpeed: '59 km/h', icon: '🚲', desc: 'Ultra nimble, silent motor, quick steering.' },
        { id: 'BIKE', name: '100cc Splendor Bike', price: 0, topSpeed: '72 km/h (Nitro 125)', icon: '🛵', desc: 'The legendary Indian delivery workhorse! Solid balance.' },
        { id: 'TURBO_AUTO', name: 'Turbo 3-Wheeler Auto', price: 300, topSpeed: '80 km/h (Nitro 135)', icon: '🛺', desc: 'Heavy drift beast! Massive road presence.' },
        { id: 'SUPERBIKE', name: '1300cc Hayabusa Rocket', price: 600, topSpeed: '95 km/h (Nitro 155)', icon: '🚀', desc: 'Hyper-speed delivery machine with aero race box!' }
      ];

      vehicles.forEach(v => {
        const isUnlocked = this.unlockedVehicles.includes(v.id);
        const isCurrent = this.currentVehicleType === v.id;

        const card = document.createElement('div');
        card.className = `garage-card ${isCurrent ? 'selected' : ''}`;
        card.innerHTML = `
          <div class="garage-card-icon">${v.icon}</div>
          <div class="garage-card-details">
            <div class="garage-card-name">${v.name}</div>
            <div class="garage-card-desc">${v.desc}</div>
            <div class="garage-card-stats">⚡ Top Speed: <b>${v.topSpeed}</b></div>
          </div>
          <div class="garage-card-action">
            ${
              isCurrent
                ? `<button class="garage-btn equipped" disabled>EQUIPPED</button>`
                : isUnlocked
                  ? `<button class="garage-btn select-btn" data-id="${v.id}">EQUIP</button>`
                  : `<button class="garage-btn buy-btn" data-id="${v.id}" data-price="${v.price}">BUY ₹${v.price}</button>`
            }
          </div>
        `;
        list.appendChild(card);
      });

      list.querySelectorAll('.select-btn').forEach(b => {
        b.addEventListener('click', () => {
          const id = b.getAttribute('data-id');
          this.selectVehicle(id);
        });
      });

      list.querySelectorAll('.buy-btn').forEach(b => {
        b.addEventListener('click', () => {
          const id = b.getAttribute('data-id');
          const price = parseInt(b.getAttribute('data-price'), 10);
          if (this.cashEarned >= price) {
            this.cashEarned -= price;
            this.unlockedVehicles.push(id);
            try {
              localStorage.setItem('deliveryRider_unlockedVehicles', JSON.stringify(this.unlockedVehicles));
            } catch (e) {}
            window.soundEngine.playCoin();
            this.showAppNotification(`🎉 Purchased ${id}!`, '#22c55e');
            this.selectVehicle(id);
          } else {
            this.showAppNotification(`❌ Not enough cash! Need ₹${price} (You have ₹${this.cashEarned})`, '#ef4444');
          }
        });
      });
    }
  }

  selectVehicle(type) {
    this.currentVehicleType = type;
    this.vehicle.setVehicleType(type);
    this.updateHUD();
    this.updateGarageUI();
    this.showAppNotification(`🛵 Equipped ${type}!`, '#10b981');
  }

  selectBag(type) {
    this.currentBagType = type;
    this.vehicle.setBagType(type);
    this.updateHUD();
    this.updateGarageUI();
    this.showAppNotification(`🎒 Equipped ${type} Delivery Gear!`, '#10b981');
  }

  onPoliceEvaded() {
    this.cashEarned += 75;
    this.score += 350;
    this.showAppNotification('🚨 WANTED EVADED! Outran police through alleys! +₹75 Cash Tip!', '#22c55e');
    this.spawnComicPopup('🚨 WANTED EVADED! +₹75', this.vehicle.position);
    this.updateHUD();
  }

  showMudSplatter() {
    const el = document.getElementById('mudSplatter');
    if (!el) return;
    el.classList.add('active');
    setTimeout(() => {
      el.classList.remove('active');
    }, 1800);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.deliveryGame = new DeliveryGame();
});
