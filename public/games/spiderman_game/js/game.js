/* =========================================================
   PROCEDURAL CANYON, GAMEPLAY MECHANICS & 60 FPS MAIN LOOP
   Ultra-optimized for silky-smooth performance on any device
   ========================================================= */

// Procedural Skyscraper Facade Canvas Textures (Zero mesh overhead!)
function createSkyscraperTexture(baseColorHex, litWindowHex, isGlass) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Skyscraper wall background
  ctx.fillStyle = baseColorHex;
  ctx.fillRect(0, 0, 256, 512);

  // Vertical architectural mullions / steel beams
  ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
  for (let x = 0; x < 256; x += 32) {
    ctx.fillRect(x, 0, 4, 512);
  }

  // Windows grid
  const cols = 6;
  const rows = 14;
  const cellW = 256 / cols;
  const cellH = 512 / rows;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const wx = c * cellW + 6;
      const wy = r * cellH + 6;
      const ww = cellW - 12;
      const wh = cellH - 12;

      const rand = Math.random();
      if (rand < 0.35) {
        ctx.fillStyle = litWindowHex; // Lit warm/cyan office light
      } else if (rand < 0.65) {
        ctx.fillStyle = isGlass ? '#93c5fd' : '#bae6fd'; // Sky reflection
      } else {
        ctx.fillStyle = '#334155'; // Dim tinted glass
      }
      ctx.fillRect(wx, wy, ww, wh);

      // Window sill & frame
      ctx.strokeStyle = 'rgba(15, 23, 42, 0.35)';
      ctx.lineWidth = 1.2;
      ctx.strokeRect(wx, wy, ww, wh);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 4);
  return texture;
}

// 4 High-End Procedural Facades
const facadeTextures = [
  createSkyscraperTexture('#0284c7', '#fef08a', true),  // Cyan Glass Tower
  createSkyscraperTexture('#1e293b', '#38bdf8', false), // Slate Modern Tower
  createSkyscraperTexture('#0f172a', '#facc15', true),  // Dark Penthouse
  createSkyscraperTexture('#334155', '#bae6fd', false)  // Steel Highrise
];

const buildingMaterials = facadeTextures.map(tex => {
  return new THREE.MeshStandardMaterial({
    map: tex,
    roughness: 0.35,
    metalness: 0.15
  });
});

// Procedural Skyscraper Pool (24 buildings total, 1 mesh each = ultra fast!)
const buildingPool = [];
const BUILDING_COUNT = 24;
const BUILDING_DEPTH = 36;
const BUILDING_SPACING = 38;

function createBuildingMesh(isLeft, zPos) {
  const width = 18 + Math.random() * 8;
  const height = 48 + Math.random() * 45;
  const depth = BUILDING_DEPTH;

  const mat = buildingMaterials[Math.floor(Math.random() * buildingMaterials.length)];
  const bodyMesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), mat);
  bodyMesh.position.y = height / 2;

  const posX = isLeft ? (LEFT_WALL_X - width / 2) : (RIGHT_WALL_X + width / 2);
  bodyMesh.position.set(posX, height / 2, zPos);

  // Rooftop Details: Wooden Water Tower & Radio Transmitter
  if (Math.random() > 0.3) {
    const waterTowerMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.85 });
    const tower = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.8, 2.8, 8), waterTowerMat);
    tower.position.set((Math.random() - 0.5) * (width * 0.4), height / 2 + 1.4, (Math.random() - 0.5) * (depth - 8));
    bodyMesh.add(tower);
  }
  if (Math.random() > 0.4) {
    const antennaMat = new THREE.MeshBasicMaterial({ color: 0xd1d5db });
    const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 4.5, 6), antennaMat);
    antenna.position.set((Math.random() - 0.5) * (width * 0.5), height / 2 + 2.25, 0);
    const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.25, 6, 6), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
    beacon.position.y = 2.25;
    antenna.add(beacon);
    bodyMesh.add(antenna);
  }

  bodyMesh.userData = { isLeft: isLeft, width: width, height: height };
  scene.add(bodyMesh);
  return bodyMesh;
}

for (let i = 0; i < BUILDING_COUNT; i++) {
  const isLeft = i % 2 === 0;
  const pairIndex = Math.floor(i / 2);
  const zPos = -pairIndex * BUILDING_SPACING + 80;
  buildingPool.push(createBuildingMesh(isLeft, zPos));
}

// Rooftop Steam Particles
const STEAM_COUNT = 45;
const steamGeo = new THREE.BufferGeometry();
const steamPositions = new Float32Array(STEAM_COUNT * 3);
const steamVelocities = [];
for (let i = 0; i < STEAM_COUNT; i++) {
  steamPositions[i * 3] = (Math.random() - 0.5) * 24;
  steamPositions[i * 3 + 1] = 20 + Math.random() * 30;
  steamPositions[i * 3 + 2] = -Math.random() * 300;
  steamVelocities.push({
    vy: 1.2 + Math.random() * 2.0,
    vx: (Math.random() - 0.5) * 0.8,
    life: Math.random() * 3.0
  });
}
steamGeo.setAttribute('position', new THREE.BufferAttribute(steamPositions, 3));
const steamMat = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 1.6,
  transparent: true,
  opacity: 0.35
});
const steamPoints = new THREE.Points(steamGeo, steamMat);
scene.add(steamPoints);

function updateSteamParticles(dt) {
  const posArr = steamGeo.attributes.position.array;
  for (let i = 0; i < STEAM_COUNT; i++) {
    posArr[i * 3 + 1] += steamVelocities[i].vy * dt * 4;
    posArr[i * 3] += steamVelocities[i].vx * dt * 4;
    steamVelocities[i].life += dt;
    if (steamVelocities[i].life > 3.0 || posArr[i * 3 + 2] > (GAME.spidey.z + 40)) {
      steamVelocities[i].life = 0;
      posArr[i * 3] = (Math.random() - 0.5) * 24;
      posArr[i * 3 + 1] = 20 + Math.random() * 25;
      posArr[i * 3 + 2] = GAME.spidey.z - 40 - Math.random() * 240;
    }
  }
  steamGeo.attributes.position.needsUpdate = true;
}

// Ground Traffic Cars
const trafficPool = [];
const TRAFFIC_COUNT = 12;
const LANES_X = [-7.5, -2.5, 2.5, 7.5];
const carColors = [0xfacc15, 0xfacc15, 0xef4444, 0x3b82f6, 0x1e293b, 0xffffff];

function createCarMesh(colorHex, isPolice) {
  const carGroup = new THREE.Group();
  const bodyMat = new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.4, metalness: 0.3 });
  const darkMat = new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.7 });

  const body = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.7, 4.2), bodyMat);
  body.position.y = 0.55;
  carGroup.add(body);

  const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.65, 2.2), darkMat);
  cabin.position.set(0, 1.15, -0.2);
  carGroup.add(cabin);

  for (let wx of [-1.0, 1.0]) {
    for (let wz of [-1.3, 1.3]) {
      const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.25, 8), darkMat);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(wx, 0.35, wz);
      carGroup.add(wheel);
    }
  }

  const lightMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
  for (let lx of [-0.65, 0.65]) {
    const hl = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.2, 0.1), lightMat);
    hl.position.set(lx, 0.6, -2.12);
    carGroup.add(hl);
  }

  const tailMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
  for (let lx of [-0.65, 0.65]) {
    const tl = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.2, 0.1), tailMat);
    tl.position.set(lx, 0.6, 2.12);
    carGroup.add(tl);
  }

  if (isPolice) {
    const lightbar = new THREE.Group();
    const sirenRed = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.2, 0.2), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
    sirenRed.position.x = -0.3;
    const sirenBlue = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.2, 0.2), new THREE.MeshBasicMaterial({ color: 0x3b82f6 }));
    sirenBlue.position.x = 0.3;
    lightbar.add(sirenRed);
    lightbar.add(sirenBlue);
    lightbar.position.set(0, 1.55, -0.2);
    carGroup.add(lightbar);
    carGroup.userData.sirenRed = sirenRed;
    carGroup.userData.sirenBlue = sirenBlue;
  }

  carGroup.userData.isPolice = isPolice;
  carGroup.userData.speed = 22 + Math.random() * 12;
  scene.add(carGroup);
  return carGroup;
}

for (let i = 0; i < TRAFFIC_COUNT; i++) {
  const isPolice = (i === 0);
  const color = isPolice ? 0xffffff : carColors[i % carColors.length];
  const car = createCarMesh(color, isPolice);
  const lane = LANES_X[i % LANES_X.length];
  car.position.set(lane, ROAD_Y, -(i * 35 + 30));
  trafficPool.push(car);
}

function updateTraffic(dt, spideyZ) {
  const time = performance.now() * 0.008;
  for (let i = 0; i < TRAFFIC_COUNT; i++) {
    const car = trafficPool[i];
    car.position.z -= car.userData.speed * dt;

    if (car.userData.isPolice && car.userData.sirenRed) {
      const strobe = Math.sin(time * 8.0) > 0;
      car.userData.sirenRed.visible = strobe;
      car.userData.sirenBlue.visible = !strobe;
    }

    if (car.position.z > spideyZ + 60) {
      const lane = LANES_X[Math.floor(Math.random() * LANES_X.length)];
      car.position.x = lane;
      car.position.z = spideyZ - 260 - Math.random() * 140;
      car.userData.speed = 22 + Math.random() * 12;
    }
  }
}

// Mid-Air Acrobat Boost Rings
const ringPool = [];
const RING_COUNT = 6;
const ringGeo = new THREE.TorusGeometry(2.4, 0.18, 8, 24);
const ringMat = new THREE.MeshStandardMaterial({
  color: 0xfbbf24,
  emissive: 0xf59e0b,
  emissiveIntensity: 0.8,
  metalness: 0.9,
  roughness: 0.15
});

for (let i = 0; i < RING_COUNT; i++) {
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.position.set(
    (Math.random() - 0.5) * 12,
    14 + Math.random() * 14,
    -(i * 65 + 60)
  );
  ring.userData = { active: true };
  scene.add(ring);
  ringPool.push(ring);
}

function updateRings(dt, s) {
  for (let i = 0; i < RING_COUNT; i++) {
    const ring = ringPool[i];
    ring.rotation.z += dt * 1.5;

    const dz = Math.abs(ring.position.z - s.z);
    const dx = Math.abs(ring.position.x - s.x);
    const dy = Math.abs(ring.position.y - s.y);

    if (ring.userData.active && dz < 2.5 && dx < 2.4 && dy < 2.4) {
      ring.userData.active = false;
      ring.visible = false;
      triggerWebHitSparks(ring.position.x, ring.position.y, ring.position.z, true);
      sound.playStuntChime();
      spawnComicPopup('RING BOOST!', s.x, s.y);
      showComboPopup('⚡ ACROBAT RING BOOST! +350 PTS +SPEED!');
      GAME.score += 350;
      GAME.combo = Math.min(GAME.combo + 0.3, 5.0);
      s.vz = Math.min(s.vz + 12.0, 72.0);
      drawSpeedLines(1.0);
    }

    if (ring.position.z > s.z + 40) {
      ring.position.set(
        (Math.random() - 0.5) * 12,
        14 + Math.random() * 14,
        s.z - 260 - Math.random() * 90
      );
      ring.userData.active = true;
      ring.visible = true;
    }
  }
}

// Oscorp Aerial Patrol Drones
const dronePool = [];
const DRONE_COUNT = 4;

function createDroneMesh() {
  const group = new THREE.Group();
  const droneMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.3, metalness: 0.7 });
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0x22c55e });
  const bladeMat = new THREE.MeshBasicMaterial({ color: 0x94a3b8 });

  const body = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.35, 1.4), droneMat);
  group.add(body);

  const eye = new THREE.Mesh(new THREE.SphereGeometry(0.22, 8, 8), eyeMat);
  eye.position.set(0, 0, 0.72);
  group.add(eye);

  const blades = [];
  const armOffsets = [
    [-0.9, -0.9],
    [0.9, -0.9],
    [-0.9, 0.9],
    [0.9, 0.9]
  ];
  for (let [ax, az] of armOffsets) {
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.9, 6), droneMat);
    arm.rotation.z = Math.PI / 2;
    arm.position.set(ax * 0.5, 0, az * 0.5);
    group.add(arm);

    const blade = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.04, 0.12), bladeMat);
    blade.position.set(ax, 0.2, az);
    group.add(blade);
    blades.push(blade);
  }

  group.userData = { blades, active: true, baseY: 18 };
  scene.add(group);
  return group;
}

for (let i = 0; i < DRONE_COUNT; i++) {
  const drone = createDroneMesh();
  drone.position.set(
    (Math.random() - 0.5) * 14,
    16 + Math.random() * 12,
    -(i * 90 + 90)
  );
  drone.userData.baseY = drone.position.y;
  dronePool.push(drone);
}

function updateDrones(dt, s) {
  const time = performance.now() * 0.005;
  for (let i = 0; i < DRONE_COUNT; i++) {
    const drone = dronePool[i];
    drone.userData.blades.forEach(b => b.rotation.y += dt * 32.0);
    drone.position.y = drone.userData.baseY + Math.sin(time * 3.0 + i) * 1.2;

    const dz = Math.abs(drone.position.z - s.z);
    const dx = Math.abs(drone.position.x - s.x);
    const dy = Math.abs(drone.position.y - s.y);

    if (drone.userData.active && dz < 2.8 && dx < 2.5 && dy < 2.5) {
      drone.userData.active = false;
      drone.visible = false;
      triggerWebHitSparks(drone.position.x, drone.position.y, drone.position.z, true);
      sound.playWallCrash();
      spawnComicPopup('BOOM!', s.x, s.y);
      showComboPopup('💥 OSCORP DRONE SMASH! +1000 PTS +CATAPULT!');
      GAME.score += 1000;
      GAME.combo = Math.min(GAME.combo + 0.5, 5.0);
      s.vz = Math.min(s.vz + 16.0, 75.0);
      s.vy = Math.max(s.vy, 10.0);
      triggerAcrobaticStunt('FRONT_FLIP');
      drawSpeedLines(1.0);
    }

    if (drone.position.z > s.z + 40) {
      drone.position.set(
        (Math.random() - 0.5) * 14,
        16 + Math.random() * 12,
        s.z - 300 - Math.random() * 120
      );
      drone.userData.baseY = drone.position.y;
      drone.userData.active = true;
      drone.visible = true;
    }
  }
}

// Web Zip-to-Point Perch System
const perchReticleGeo = new THREE.RingGeometry(0.8, 1.05, 16);
const perchReticleMat = new THREE.MeshBasicMaterial({
  color: 0x38bdf8,
  side: THREE.DoubleSide,
  transparent: true,
  opacity: 0.85
});
const perchReticle = new THREE.Mesh(perchReticleGeo, perchReticleMat);
scene.add(perchReticle);

const currentPerchTarget = new THREE.Vector3();
let hasPerchTarget = false;

function updatePerchReticle(s) {
  let closestDist = 999;
  hasPerchTarget = false;

  for (let i = 0; i < BUILDING_COUNT; i++) {
    const b = buildingPool[i];
    const bz = b.position.z;
    const dz = bz - s.z;
    if (dz < -18 && dz > -80) {
      const bx = b.userData.isLeft ? (LEFT_WALL_X + 1.5) : (RIGHT_WALL_X - 1.5);
      const by = Math.min(b.userData.height + 1.0, 48);
      const dist = Math.hypot(bx - s.x, by - s.y, dz);
      if (dist < closestDist) {
        closestDist = dist;
        currentPerchTarget.set(bx, by, bz);
        hasPerchTarget = true;
      }
    }
  }

  if (hasPerchTarget && GAME.state === 'PLAYING') {
    perchReticle.position.copy(currentPerchTarget);
    perchReticle.rotation.z += 0.05;
    perchReticle.lookAt(camera.position);
    perchReticle.visible = true;
  } else {
    perchReticle.visible = false;
  }
}

function triggerWebZip() {
  if (GAME.state !== 'PLAYING') return;
  sound.init();

  if (hasPerchTarget) {
    GAME.isZipping = true;
    GAME.zipTarget.copy(currentPerchTarget);
    GAME.swinging = false;
    GAME.swingSide = null;
    sound.playWallVault();
    sound.playIAmSpiderman();
    spawnComicPopup('ZIP!', GAME.spidey.x, GAME.spidey.y);
  } else {
    triggerPointLaunch();
  }
}
window.triggerWebZip = triggerWebZip;

// Comic Book Text Popups Helper
function spawnComicPopup(text, x, y) {
  const container = document.getElementById('comic-container');
  if (!container) return;
  const el = document.createElement('div');
  el.className = 'comic-popup';
  el.textContent = text;
  const randRot = (Math.random() - 0.5) * 24;
  el.style.transform = `translate(-50%, -50%) rotate(${randRot}deg) scale(0.6)`;
  el.style.left = `${50 + (Math.random() - 0.5) * 25}%`;
  el.style.top = `${40 + (Math.random() - 0.5) * 20}%`;
  container.appendChild(el);
  requestAnimationFrame(() => {
    el.style.transform = `translate(-50%, -50px) rotate(${randRot}deg) scale(1.15)`;
    el.style.opacity = '1';
  });
  setTimeout(() => {
    el.style.opacity = '0';
    setTimeout(() => el.remove(), 250);
  }, 650);
}
window.spawnComicPopup = spawnComicPopup;

// Collectibles: Golden Spider Tokens
const tokenPool = [];
const TOKEN_COUNT = 8;
const tokenGeo = new THREE.TorusGeometry(0.85, 0.22, 10, 16);
const tokenMat = new THREE.MeshStandardMaterial({
  color: 0xfbbf24,
  emissive: 0xf59e0b,
  emissiveIntensity: 0.6,
  metalness: 0.9,
  roughness: 0.2
});

for (let i = 0; i < TOKEN_COUNT; i++) {
  const token = new THREE.Mesh(tokenGeo, tokenMat);
  token.position.set(
    (Math.random() - 0.5) * 14,
    SPIDEY_BASE_Y + (Math.random() - 0.5) * 4,
    -(i * 45 + 50)
  );
  token.userData = { active: true };
  scene.add(token);
  tokenPool.push(token);
}

// Game State Object
const GAME = {
  state: 'START',
  score: 0,
  highScore: parseInt(localStorage.getItem('spidey_highscore_3d') || '0', 10),
  distance: 0,
  combo: 1.0,
  centerStreakTimer: 0,
  hearts: 3,
  isInvincible: false,
  invincibleTimer: 0,

  spidey: {
    x: 0,
    y: SPIDEY_BASE_Y,
    z: 0,
    vx: 0,
    vy: 0,
    vz: 26
  },

  // Web Pendulum State
  swinging: false,
  swingSide: null, // 'LEFT' or 'RIGHT'
  swingPose: 'CLASSIC', // 'CLASSIC', 'TWO_HANDED', 'BETWEEN_LEGS', 'UPSIDE_DOWN', 'SWING_KICK', 'FORWARD_DIVE_SWING', 'LOOP_DE_LOOP'
  apexStyleCounter: 0,
  webAnchor: new THREE.Vector3(),
  webRestLength: 22,
  swingTime: 0,

  // Acrobatic Stunt System
  stuntState: 'NONE',
  stuntProgress: 0.0,
  stuntIndex: 0,
  trickStreak: 0,

  // Dive & Spiral System
  isDiving: false,
  isDiveSwinging: false,
  diveSwingTimer: 0.0,
  spiralAngle: 0.0,

  // Point Launch
  isPointLaunching: false,

  // Skyscraper Wall-Running System
  isWallRunning: false,
  wallRunSide: null,
  wallRunTimer: 0.0,
  wallRunStepTimer: 0.0,

  // Web Zip-to-Point System
  isZipping: false,
  zipTarget: new THREE.Vector3(),

  // Spider-Sense Bullet Time System
  spiderSenseActive: false,
  spiderSenseEnergy: 100.0,

  // Parkour Wall Vault
  isWallVaulting: false,
  wallVaultSide: null,
  wallVaultTimer: 0.0,

  // Crosswind drift
  driftTimer: 0,

  // Fast alternating tap rhythm pump
  lastTapSide: null,
  lastTapTime: 0,
  rhythmStreak: 0,

  // Dual-web rubberband slingshot
  isSlingshotting: false,
  slingshotCharge: 0,
  slingshotAnchorLeft: new THREE.Vector3(),
  slingshotAnchorRight: new THREE.Vector3(),
  slingshotSoundTimer: 0,
  fullChargeTime: 0,

  // Button inputs
  leftPressed: false,
  rightPressed: false
};
window.GAME = GAME;

// DOM Elements
const scoreValEl = document.getElementById('scoreVal');
const distValEl = document.getElementById('distVal');
const comboValEl = document.getElementById('comboVal');
const altValEl = document.getElementById('altVal');
const gaugeNeedleEl = document.getElementById('gaugeNeedle');
const wallWarningBannerEl = document.getElementById('wallWarningBanner');
const damageFlashEl = document.getElementById('damageFlash');
const comboCalloutEl = document.getElementById('combo-callout');

const startModal = document.getElementById('startModal');
const gameOverModal = document.getElementById('gameOverModal');
const pauseModal = document.getElementById('pauseModal');

const startGameBtn = document.getElementById('startGameBtn');
const restartGameBtn = document.getElementById('restartGameBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resumeGameBtn = document.getElementById('resumeGameBtn');

const leftSteerBtn = document.getElementById('leftSteerBtn');
const rightSteerBtn = document.getElementById('rightSteerBtn');
const centerZipBtn = document.getElementById('centerZipBtn');
const stuntBtn = document.getElementById('stuntBtn');

const screenLeftZone = document.getElementById('screenLeftZone');
const screenRightZone = document.getElementById('screenRightZone');

const heart1 = document.getElementById('heart1');
const heart2 = document.getElementById('heart2');
const heart3 = document.getElementById('heart3');

window.wallWarningBannerEl = wallWarningBannerEl;
window.leftSteerBtn = leftSteerBtn;
window.rightSteerBtn = rightSteerBtn;

function showComboPopup(text) {
  comboCalloutEl.textContent = text;
  comboCalloutEl.classList.remove('show');
  void comboCalloutEl.offsetWidth;
  comboCalloutEl.classList.add('show');
  setTimeout(() => {
    comboCalloutEl.classList.remove('show');
  }, 750);
}
window.showComboPopup = showComboPopup;

function updateHUD() {
  scoreValEl.textContent = Math.floor(GAME.score).toLocaleString();
  distValEl.textContent = Math.floor(GAME.distance) + 'm';
  comboValEl.textContent = GAME.combo.toFixed(1) + 'x';
  altValEl.textContent = Math.max(0, Math.floor(GAME.spidey.y)) + 'm';
}
window.updateHUD = updateHUD;

// Dual-Web Slingshot
function startSlingshot() {
  if (GAME.state !== 'PLAYING') return;
  sound.init();

  GAME.isSlingshotting = true;
  GAME.slingshotCharge = 0.0;
  GAME.swinging = false;
  GAME.swingSide = null;
  GAME.isDiveSwinging = false;
  GAME.stuntState = 'NONE';

  const s = GAME.spidey;
  const anchorY = Math.max(s.y + 12, 28);
  const anchorZ = s.z - 28;

  GAME.slingshotAnchorLeft.set(LEFT_WALL_X, anchorY, anchorZ);
  GAME.slingshotAnchorRight.set(RIGHT_WALL_X, anchorY, anchorZ);

  triggerWebHitSparks(LEFT_WALL_X, anchorY, anchorZ, true);
  triggerWebHitSparks(RIGHT_WALL_X, anchorY, anchorZ, false);
  sound.playThwip(true);
  sound.playThwip(false);
  sound.playWebHit();
}

function launchSlingshot() {
  if (!GAME.isSlingshotting) return;
  GAME.isSlingshotting = false;

  const charge = Math.max(GAME.slingshotCharge, 0.2);
  const s = GAME.spidey;

  s.x = 0;
  s.vx = 0;
  s.vy = 8.0 + charge * 20.0;
  s.vz = Math.min(28.0 + charge * 44.0, 78.0);

  triggerApexRelease();
  sound.playSlingshotLaunch();
  drawSpeedLines(1.0);

  const bonus = Math.floor(charge * 750);
  GAME.score += bonus;
  GAME.combo = Math.min(GAME.combo + 0.5, 5.0);
  updateHUD();

  showComboPopup(`🏹 RUBBERBAND SLINGSHOT! ${Math.floor(s.vz)} m/s! +${bonus} PTS ⚡`);

  wallWarningBannerEl.style.display = 'none';
  wallWarningBannerEl.style.background = '#ef4444';
  leftWebMesh.visible = false;
  rightWebMesh.visible = false;
  leftWebSplat.visible = false;
  rightWebSplat.visible = false;
}

// Single-Web Swing Attach
function attachWeb(side) {
  if (GAME.state !== 'PLAYING') return;
  sound.init();

  const now = performance.now();

  if (side === 'LEFT') {
    GAME.leftPressed = true;
    leftSteerBtn.classList.add('active');
  } else if (side === 'RIGHT') {
    GAME.rightPressed = true;
    rightSteerBtn.classList.add('active');
  }

  // Dual button press -> Slingshot!
  if (GAME.leftPressed && GAME.rightPressed) {
    startSlingshot();
    return;
  }

  if (GAME.isSlingshotting) return;

  // Rhythm speed pump
  const isAlternating = (side === 'LEFT' && GAME.lastTapSide === 'RIGHT') ||
                        (side === 'RIGHT' && GAME.lastTapSide === 'LEFT');
  const timeSinceLastTap = now - GAME.lastTapTime;

  if (isAlternating && timeSinceLastTap < 480) {
    GAME.rhythmStreak++;
    const boost = Math.min(4.5 + GAME.rhythmStreak * 0.8, 10.0);
    GAME.spidey.vz = Math.min(GAME.spidey.vz + boost, 64.0);
    GAME.spidey.vy = Math.max(GAME.spidey.vy + 3.5, 11.0);

    if (GAME.rhythmStreak >= 2) {
      showComboPopup(`⚡ FAST SWING! ${Math.floor(GAME.spidey.vz)} m/s 🔥`);
    }
  } else if (timeSinceLastTap >= 600) {
    GAME.rhythmStreak = 0;
  }

  GAME.lastTapSide = side;
  GAME.lastTapTime = now;

  const s = GAME.spidey;
  const isSteepDive = (s.vy < -5.5);

  GAME.swinging = true;
  GAME.swingSide = side;
  GAME.swingTime = 0;
  GAME.stuntState = 'NONE';
  GAME.stuntProgress = 0;
  spideyGroup.rotation.set(0, Math.PI, 0);

  if (isSteepDive) {
    GAME.isDiveSwinging = true;
    GAME.diveSwingTimer = 0;
    GAME.swingPose = 'FORWARD_DIVE_SWING';
    showComboPopup(`🌊 DIVE SWING SWOOP! ${Math.floor(s.vz)} m/s ⚡`);
    sound.playZipBoost();
  } else if (s.vz > 44 && Math.random() < 0.35) {
    GAME.isDiveSwinging = false;
    GAME.swingPose = 'LOOP_DE_LOOP';
    showComboPopup(`🌀 360° VERTICAL LOOP-DE-LOOP! ${Math.floor(s.vz)} m/s ⚡`);
    sound.playFlipWhoosh();
  } else {
    GAME.isDiveSwinging = false;
    const r = Math.random();
    if (r < 0.38) {
      GAME.swingPose = 'CLASSIC';
    } else if (r < 0.58) {
      GAME.swingPose = 'TWO_HANDED';
      showComboPopup("🕸️ TWO-HANDED POWER SWING! 💪");
    } else if (r < 0.74) {
      GAME.swingPose = 'BETWEEN_LEGS';
      showComboPopup("🕸️ BETWEEN-THE-LEGS SLING! 🤸");
    } else if (r < 0.88) {
      GAME.swingPose = 'SWING_KICK';
      showComboPopup("👟 HURDLE SWING KICK! 💥");
    } else {
      GAME.swingPose = 'UPSIDE_DOWN';
      showComboPopup("🙃 UPSIDE-DOWN WEB SWING! 🕸️");
    }
  }

  const isLeft = (side === 'LEFT');
  const anchorX = isLeft ? LEFT_WALL_X : RIGHT_WALL_X;
  const anchorY = Math.max(s.y + 14, 25);
  const anchorZ = s.z - 22;

  GAME.webAnchor.set(anchorX, anchorY, anchorZ);
  const initialDist = Math.hypot(anchorX - s.x, anchorY - s.y, anchorZ - s.z);
  GAME.webRestLength = initialDist * 0.94;

  triggerWebHitSparks(anchorX, anchorY, anchorZ, isLeft);
  sound.playThwip(isLeft);
  sound.playWebHit();
}

function detachWeb(side) {
  if (side === 'LEFT') {
    GAME.leftPressed = false;
    leftSteerBtn.classList.remove('active');
  } else if (side === 'RIGHT') {
    GAME.rightPressed = false;
    rightSteerBtn.classList.remove('active');
  }

  if (GAME.isSlingshotting) {
    launchSlingshot();
    return;
  }

  if (!GAME.leftPressed && !GAME.rightPressed) {
    if (GAME.swinging) {
      const s = GAME.spidey;
      const dz = GAME.webAnchor.z - s.z;
      const isApexRelease = (s.vy > 0 || dz > -7 || GAME.isDiveSwinging) && (GAME.swingTime > 0.2);
      if (isApexRelease) {
        triggerApexRelease();
      } else if (s.vy > 0) {
        s.vy = Math.min(s.vy + 5.0, 22.0);
        s.vz = Math.min(s.vz + 5.0, 42.0);
      }
    }
    GAME.swinging = false;
    GAME.swingSide = null;
    GAME.swingPose = 'CLASSIC';
    GAME.isDiveSwinging = false;
    leftWebMesh.visible = false;
    rightWebMesh.visible = false;
    leftWebSplat.visible = false;
    rightWebSplat.visible = false;
  }
}
window.attachWeb = attachWeb;
window.detachWeb = detachWeb;

// Lifecycle & State
function startGame() {
  sound.init();
  sound.playIAmSpiderman();
  sound.playMemeSong(true);
  GAME.state = 'PLAYING';
  GAME.score = 0;
  GAME.distance = 0;
  GAME.combo = 1.0;
  GAME.centerStreakTimer = 0;
  GAME.hearts = 3;
  GAME.isInvincible = false;
  GAME.invincibleTimer = 0;

  GAME.swinging = false;
  GAME.swingSide = null;
  GAME.swingPose = 'CLASSIC';
  GAME.isDiveSwinging = false;
  GAME.isDiving = false;
  GAME.isPointLaunching = false;
  GAME.isWallVaulting = false;
  GAME.isSlingshotting = false;
  GAME.slingshotCharge = 0;
  GAME.stuntState = 'NONE';
  GAME.stuntProgress = 0;
  GAME.stuntIndex = 0;
  GAME.trickStreak = 0;
  GAME.apexStyleCounter = 0;
  GAME.leftPressed = false;
  GAME.rightPressed = false;

  // Reset Physics
  GAME.spidey.x = 0;
  GAME.spidey.y = SPIDEY_BASE_Y;
  GAME.spidey.z = 0;
  GAME.spidey.vx = 0;
  GAME.spidey.vy = 0;
  GAME.spidey.vz = 26;

  spideyRoot.position.set(0, SPIDEY_BASE_Y, 0);
  spideyRoot.rotation.set(0, 0, 0);
  spideyGroup.rotation.set(0, Math.PI, 0);
  headMesh.rotation.set(0, 0, 0);
  spideyRoot.visible = true;

  leftArmPivot.rotation.set(0, 0, 0);
  rightArmPivot.rotation.set(0, 0, 0);
  leftLegPivot.rotation.set(0, 0, 0);
  rightLegPivot.rotation.set(0, 0, 0);
  leftWebWing.visible = false;
  rightWebWing.visible = false;

  shadowMesh.position.set(0, ROAD_Y + 0.05, 0);

  // Reset buildings
  for (let i = 0; i < BUILDING_COUNT; i++) {
    const pairIndex = Math.floor(i / 2);
    const zPos = -pairIndex * BUILDING_SPACING + 80;
    buildingPool[i].position.z = zPos;
  }

  roadGroup.position.set(0, 0, 0);

  // Reset tokens
  for (let i = 0; i < TOKEN_COUNT; i++) {
    const token = tokenPool[i];
    token.position.set(
      (Math.random() - 0.5) * 14,
      SPIDEY_BASE_Y + (Math.random() - 0.5) * 4,
      -(i * 45 + 50)
    );
    token.userData.active = true;
    token.visible = true;
  }

  camera.position.set(0, SPIDEY_BASE_Y + 4.2, 12.5);
  camera.lookAt(0, SPIDEY_BASE_Y + 1.0, -20);

  leftWebMesh.visible = false;
  rightWebMesh.visible = false;
  leftWebSplat.visible = false;
  rightWebSplat.visible = false;

  damageFlashEl.style.opacity = '0';
  wallWarningBannerEl.style.display = 'none';
  speedCtx.clearRect(0, 0, speedCanvas.width, speedCanvas.height);

  leftSteerBtn.classList.remove('active', 'alert-pulse');
  rightSteerBtn.classList.remove('active', 'alert-pulse');

  lastTime = performance.now();

  updateHeartsUI();
  updateHUD();
  gaugeNeedleEl.style.left = '50%';
  gaugeNeedleEl.classList.add('in-center');

  startModal.style.display = 'none';
  gameOverModal.style.display = 'none';
  pauseModal.style.display = 'none';
}

function togglePause() {
  if (GAME.state === 'PLAYING') {
    GAME.state = 'PAUSED';
    pauseModal.style.display = 'flex';
  } else if (GAME.state === 'PAUSED') {
    GAME.state = 'PLAYING';
    pauseModal.style.display = 'none';
  }
}

function triggerGameOver() {
  GAME.state = 'GAMEOVER';
  sound.playWallCrash();
  sound.playMyBack();

  if (GAME.score > GAME.highScore) {
    GAME.highScore = GAME.score;
    localStorage.setItem('spidey_highscore_3d', GAME.highScore.toString());
  }

  document.getElementById('finalScoreVal').textContent = Math.floor(GAME.score).toLocaleString();
  document.getElementById('finalDistVal').textContent = Math.floor(GAME.distance) + 'm';
  document.getElementById('finalComboVal').textContent = GAME.combo.toFixed(1) + 'x';
  document.getElementById('bestScoreVal').textContent = Math.floor(GAME.highScore).toLocaleString();

  gameOverModal.style.display = 'flex';
}

function updateHeartsUI() {
  heart1.classList.toggle('heart-lost', GAME.hearts < 1);
  heart2.classList.toggle('heart-lost', GAME.hearts < 2);
  heart3.classList.toggle('heart-lost', GAME.hearts < 3);
}

function takeDamage(isLeftWall) {
  if (GAME.isInvincible || GAME.state !== 'PLAYING') return;

  GAME.hearts--;
  updateHeartsUI();
  sound.playWallCrash();
  sound.playMyBack();

  damageFlashEl.style.opacity = '1';
  setTimeout(() => { damageFlashEl.style.opacity = '0'; }, 180);

  triggerWallSparks(GAME.spidey.x, GAME.spidey.y, GAME.spidey.z, isLeftWall);

  const s = GAME.spidey;
  s.vx = isLeftWall ? 8.0 : -8.0;
  s.vz = Math.max(s.vz * 0.7, 18.0);
  GAME.combo = 1.0;

  if (GAME.hearts <= 0) {
    triggerGameOver();
  } else {
    GAME.isInvincible = true;
    GAME.invincibleTimer = 1.6;
  }
}

// Speed Lines 2D Overlay Canvas (Optimized: only draws when high speed)
const speedCanvas = document.getElementById('speed-overlay');
const speedCtx = speedCanvas.getContext('2d');
let lastSpeedWasZero = true;

function resizeSpeedCanvas() {
  speedCanvas.width = window.innerWidth;
  speedCanvas.height = window.innerHeight;
}
resizeSpeedCanvas();
window.addEventListener('resize', resizeSpeedCanvas);

function drawSpeedLines(speedRatio) {
  if (speedRatio < 0.65) {
    if (!lastSpeedWasZero) {
      speedCtx.clearRect(0, 0, speedCanvas.width, speedCanvas.height);
      lastSpeedWasZero = true;
    }
    return;
  }
  lastSpeedWasZero = false;
  speedCtx.clearRect(0, 0, speedCanvas.width, speedCanvas.height);

  const count = Math.floor((speedRatio - 0.6) * 24);
  const cx = speedCanvas.width / 2;
  const cy = speedCanvas.height / 2;

  speedCtx.strokeStyle = 'rgba(255, 255, 255, 0.28)';
  speedCtx.lineWidth = 1.8;

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist1 = 160 + Math.random() * 220;
    const dist2 = dist1 + 70 + Math.random() * 110;

    speedCtx.beginPath();
    speedCtx.moveTo(cx + Math.cos(angle) * dist1, cy + Math.sin(angle) * dist1);
    speedCtx.lineTo(cx + Math.cos(angle) * dist2, cy + Math.sin(angle) * dist2);
    speedCtx.stroke();
  }
}
window.drawSpeedLines = drawSpeedLines;

// Main Physics Loop (Clamped 60 FPS target, silky smooth on all hardware)
let lastTime = performance.now();

function animate(now) {
  requestAnimationFrame(animate);

  // Delta time clamped between 8ms and 40ms (smooth 60fps locked, no jumps)
  const rawDt = (now - lastTime) / 1000;
  const dt = Math.min(Math.max(rawDt, 0.008), 0.04);
  lastTime = now;

  if (GAME.state === 'PLAYING') {
    updateGame(dt, now);
  }

  updateVisuals(dt);
  renderer.render(scene, camera);
}

function updateGame(dt, now) {
  const s = GAME.spidey;

  // Spider-Sense Bullet-Time Slow Motion
  if (GAME.spiderSenseActive) {
    GAME.spiderSenseEnergy = Math.max(0, GAME.spiderSenseEnergy - dt * 25.0);
    const senseFill = document.getElementById('senseFill');
    if (senseFill) senseFill.style.width = GAME.spiderSenseEnergy + '%';
    dt *= 0.25; // 4x Bullet-Time Slow Motion
    if (GAME.spiderSenseEnergy <= 0) {
      toggleSpiderSense(false);
    }
  } else {
    GAME.spiderSenseEnergy = Math.min(100.0, GAME.spiderSenseEnergy + dt * 12.0);
    const senseFill = document.getElementById('senseFill');
    if (senseFill) senseFill.style.width = GAME.spiderSenseEnergy + '%';
  }

  // Crosswind drift
  GAME.driftTimer += dt * 0.8;
  const naturalDrift = Math.sin(GAME.driftTimer) * 1.5 + Math.cos(GAME.driftTimer * 0.4) * 0.8;
  s.vx += naturalDrift * dt;

  // Web Zip-to-Point Perch Pull
  if (GAME.isZipping && GAME.zipTarget) {
    const dx = GAME.zipTarget.x - s.x;
    const dy = GAME.zipTarget.y - s.y;
    const dz = GAME.zipTarget.z - s.z;
    const dist = Math.hypot(dx, dy, dz);

    if (dist > 2.2) {
      const zipSpeed = 72.0;
      s.vx = (dx / dist) * zipSpeed;
      s.vy = (dy / dist) * zipSpeed;
      s.vz = -(dz / dist) * zipSpeed;
      s.x += s.vx * dt;
      s.y += s.vy * dt;
      s.z -= s.vz * dt;
      return;
    } else {
      GAME.isZipping = false;
      s.x = THREE.MathUtils.lerp(s.x, 0, 0.4);
      s.vy = 16.0;
      s.vz = Math.min(s.vz + 24.0, 75.0);
      triggerAcrobaticStunt('FRONT_FLIP');
      sound.playPointLaunch();
      sound.playDirtInEye();
      spawnComicPopup('THWIP!', s.x, s.y);
      showComboPopup('🎯 POINT PERCH VAULT! +500 PTS');
      GAME.score += 500;
      GAME.combo = Math.min(GAME.combo + 0.5, 5.0);
      drawSpeedLines(1.0);
    }
  }

  // Skyscraper Wall-Running Check
  const isNearLeftWall = (s.x <= LEFT_WALL_X + 2.5);
  const isNearRightWall = (s.x >= RIGHT_WALL_X - 2.5);
  const wantsWallRun = (isNearLeftWall && (GAME.leftPressed || s.vx < -1.5)) ||
                       (isNearRightWall && (GAME.rightPressed || s.vx > 1.5));

  if (!GAME.swinging && !GAME.isSlingshotting && !GAME.isZipping && wantsWallRun && s.vy > -16.0 && s.y > 6.0) {
    GAME.isWallRunning = true;
    GAME.wallRunSide = isNearLeftWall ? 'LEFT' : 'RIGHT';
    GAME.wallRunTimer += dt;
    GAME.wallRunStepTimer = (GAME.wallRunStepTimer || 0) + dt;

    s.x = THREE.MathUtils.lerp(s.x, isNearLeftWall ? (LEFT_WALL_X + 1.2) : (RIGHT_WALL_X - 1.2), 0.25);
    s.vx = 0;
    s.vy = Math.max(s.vy * 0.9, -1.8);
    s.vz = Math.min(s.vz + 22.0 * dt, 56.0);

    if (GAME.wallRunStepTimer > 0.12) {
      GAME.wallRunStepTimer = 0;
      triggerWallSparks(s.x, s.y, s.z, isNearLeftWall);
    }

    wallWarningBannerEl.textContent = `👟 SKYSCRAPER WALL-RUN! [SPACE / TAP TO VAULT] 👟`;
    wallWarningBannerEl.style.display = 'block';
    wallWarningBannerEl.style.background = '#0284c7';
  } else {
    if (GAME.isWallRunning) {
      GAME.isWallRunning = false;
      const isLeft = (GAME.wallRunSide === 'LEFT');
      s.vx = isLeft ? 15.0 : -15.0;
      s.vy = 14.0;
      s.vz += 18.0;
      sound.playWallVault();
      sound.playMissedThePart();
      spawnComicPopup('WALL RUN!', s.x, s.y);
      showComboPopup('👟 WALL RUN LAUNCH! +600 PTS');
      GAME.score += 600;
      GAME.combo = Math.min(GAME.combo + 0.4, 5.0);
    }
  }

  if (GAME.isSlingshotting) {
    GAME.slingshotCharge = Math.min(GAME.slingshotCharge + dt * 1.5, 1.0);

    GAME.slingshotSoundTimer = (GAME.slingshotSoundTimer || 0) + dt;
    if (GAME.slingshotSoundTimer > 0.1) {
      GAME.slingshotSoundTimer = 0;
      sound.playRubberStretch(GAME.slingshotCharge);
    }

    s.x = THREE.MathUtils.lerp(s.x, 0, 0.25);
    s.vx = 0;
    s.vz = THREE.MathUtils.lerp(s.vz, 2, 0.2);
    s.vy = THREE.MathUtils.lerp(s.vy, 0, 0.2);

    const vibration = Math.sin(now * 0.08) * (0.16 * GAME.slingshotCharge);
    s.x += vibration;

    const pct = Math.floor(GAME.slingshotCharge * 100);
    wallWarningBannerEl.textContent = `🏹 RUBBERBAND STRETCH: ${pct}% ... RELEASE TO LAUNCH! 🏹`;
    wallWarningBannerEl.style.display = 'block';
    wallWarningBannerEl.style.background = '#8b5cf6';

    if (GAME.slingshotCharge >= 1.0) {
      GAME.fullChargeTime = (GAME.fullChargeTime || 0) + dt;
      if (GAME.fullChargeTime > 0.4) {
        GAME.fullChargeTime = 0;
        launchSlingshot();
      }
    } else {
      GAME.fullChargeTime = 0;
    }
  } else if (GAME.swinging) {
    GAME.swingTime += dt;

    const dx = GAME.webAnchor.x - s.x;
    const dy = GAME.webAnchor.y - s.y;
    const dz = GAME.webAnchor.z - s.z;
    const dist = Math.hypot(dx, dy, dz);

    const ux = dx / dist;
    const uy = dy / dist;
    const uz = dz / dist;

    // Gravity
    s.vy -= 26 * dt;

    if (dist >= GAME.webRestLength) {
      const stretch = dist - GAME.webRestLength;
      const tension = stretch * 48 + 20;

      s.vx += ux * tension * dt;
      s.vy += uy * tension * dt;
      s.vz += -uz * tension * 0.75 * dt;
    }

    // Dynamic style boosts
    if (GAME.swingPose === 'LOOP_DE_LOOP') {
      s.vz = Math.min(s.vz + 26 * dt, 72.0);
      s.vy += 14 * dt;
    } else if (GAME.swingPose === 'SWING_KICK' && dz > -8 && dz < 4) {
      s.vz = Math.min(s.vz + 24 * dt, 70.0);
      s.vy += 16 * dt;
    }

    if (dz > -12 && dz < 6) {
      s.vy += 22 * dt;
      s.vz += 16 * dt;

      if (GAME.isDiveSwinging) {
        s.vy += 32 * dt;
        s.vz += 20 * dt;
        drawSpeedLines(1.0);
      }
    }

    s.vz = Math.max(s.vz, 24);
    s.vz = Math.min(s.vz, 68);

    if (dz > 6.0) {
      GAME.swinging = false;
      GAME.swingSide = null;
      GAME.swingPose = 'CLASSIC';
      GAME.isDiveSwinging = false;
      leftWebMesh.visible = false;
      rightWebMesh.visible = false;
      leftWebSplat.visible = false;
      rightWebSplat.visible = false;
      triggerApexRelease();
    }
  } else {
    // Free falling physics
    leftWebMesh.visible = false;
    rightWebMesh.visible = false;
    leftWebSplat.visible = false;
    rightWebSplat.visible = false;

    if (s.vy < 3.0 && GAME.stuntState === 'NONE') {
      if (GAME.leftPressed) {
        attachWeb('LEFT');
      } else if (GAME.rightPressed) {
        attachWeb('RIGHT');
      }
    }

    s.vy -= 28 * dt;
    s.vy = Math.max(s.vy, -42);

    s.vz = THREE.MathUtils.lerp(s.vz, 26, 0.04);
    s.vz = Math.max(s.vz, 22);
  }

  // Acrobatic Stunts Progression
  if (GAME.stuntState !== 'NONE') {
    if (GAME.stuntState === 'WEB_WINGS') {
      s.vy = Math.max(s.vy, -3.2); // Aerodynamic glide lift
      s.vz = Math.min(s.vz + 16.0 * dt, 68.0);
    }

    GAME.stuntProgress += dt * 2.2;
    if (GAME.stuntProgress >= 1.0) {
      GAME.stuntState = 'NONE';
      GAME.stuntProgress = 0;
      spideyGroup.rotation.set(0, Math.PI, 0);
    }
  }

  // Dive & Spiral Corkscrew
  if (GAME.isDiving) {
    s.vy -= 46 * dt;
    s.vz += 15 * dt;
    GAME.spiralAngle += dt * 12.0;

    GAME.spiralSoundTimer = (GAME.spiralSoundTimer || 0) + dt;
    if (GAME.spiralSoundTimer > 0.3) {
      GAME.spiralSoundTimer = 0;
      sound.playSpiralWhoosh();
    }
    drawSpeedLines(0.9);
  } else if (!GAME.swinging && s.vy < -6.5) {
    GAME.spiralAngle += dt * 7.5;
  } else {
    GAME.spiralAngle = 0;
    GAME.spiralSoundTimer = 0.3;
  }

  // Wall Vault Timer
  if (GAME.isWallVaulting) {
    GAME.wallVaultTimer -= dt;
    if (GAME.wallVaultTimer <= 0) {
      GAME.isWallVaulting = false;
    }
  }

  // Air resistance damping
  s.vx *= 0.96;
  s.vy *= 0.985;

  // Integrate positions
  s.x += s.vx * dt;
  s.y += s.vy * dt;
  s.z -= s.vz * dt;

  // Road Danger & Collision Check
  if (s.y < 5.5) {
    wallWarningBannerEl.textContent = "⚠️ LOW ALTITUDE! TAP OR HOLD TO SHOOT WEB! ⚠️";
    wallWarningBannerEl.style.display = 'block';
  }

  if (s.y <= 1.8) {
    s.y = 1.8;
    takeDamage(false);
    s.vy = 20.0;
    s.vz = 22.0;
    sound.playWallCrash();
  }

  if (s.y > 58.0) {
    s.y = 58.0;
    s.vy = Math.min(s.vy, -1.0);
  }

  GAME.distance = -s.z * 0.8;

  // Center Maintenance Check
  const absX = Math.abs(s.x);
  if (absX < 3.2 && s.y >= 5.5) {
    GAME.centerStreakTimer += dt;
    GAME.score += (30 + GAME.combo * 20) * dt;

    if (GAME.centerStreakTimer > 2.8) {
      if (GAME.combo < 5.0) {
        GAME.combo = Math.min(GAME.combo + 0.5, 5.0);
        GAME.centerStreakTimer = 0;
        showComboPopup("PERFECT CENTER! " + GAME.combo.toFixed(1) + "X 🔥");
      }
    }
  } else {
    GAME.centerStreakTimer = 0;
    GAME.score += 10 * dt;
  }

  // Wall Collision & Parkour Vault
  const CRASH_LIMIT = 11.2;
  const WARNING_LIMIT = 7.8;

  if (s.x <= -CRASH_LIMIT) {
    s.x = -CRASH_LIMIT;
    triggerWallParkourVault(true);
  } else if (s.x >= CRASH_LIMIT) {
    s.x = CRASH_LIMIT;
    triggerWallParkourVault(false);
  }

  if (s.y >= 5.5) {
    if (s.x < -WARNING_LIMIT) {
      wallWarningBannerEl.textContent = "⚠️ TOO FAR LEFT! CLICK WEB RIGHT ▶ TO CENTER ⚠️";
      wallWarningBannerEl.style.display = 'block';
      rightSteerBtn.classList.add('alert-pulse');
      leftSteerBtn.classList.remove('alert-pulse');
    } else if (s.x > WARNING_LIMIT) {
      wallWarningBannerEl.textContent = "⚠️ TOO FAR RIGHT! CLICK ◀ WEB LEFT TO CENTER ⚠️";
      wallWarningBannerEl.style.display = 'block';
      leftSteerBtn.classList.add('alert-pulse');
      rightSteerBtn.classList.remove('alert-pulse');
    } else {
      wallWarningBannerEl.style.display = 'none';
      leftSteerBtn.classList.remove('alert-pulse');
      rightSteerBtn.classList.remove('alert-pulse');
    }
  }

  // Invincibility Flicker
  if (GAME.isInvincible) {
    GAME.invincibleTimer -= dt;
    spideyRoot.visible = Math.floor(now / 80) % 2 === 0;
    if (GAME.invincibleTimer <= 0) {
      GAME.isInvincible = false;
      spideyRoot.visible = true;
    }
  } else {
    spideyRoot.visible = true;
  }

  // Collectibles Check
  tokenPool.forEach(token => {
    token.rotation.y += dt * 3;
    const dz = Math.abs(token.position.z - s.z);
    const dx = Math.abs(token.position.x - s.x);
    const dy = Math.abs(token.position.y - s.y);

    if (dz < 2.5 && dx < 2.2 && dy < 2.5 && token.userData.active) {
      token.userData.active = false;
      token.visible = false;
      GAME.score += 250 * GAME.combo;
      sound.playCoin();
    }

    if (token.position.z > s.z + 30) {
      token.position.z = s.z - (200 + Math.random() * 50);
      token.position.x = (Math.random() - 0.5) * 16;
      token.position.y = SPIDEY_BASE_Y + (Math.random() - 0.5) * 5;
      token.userData.active = true;
      token.visible = true;
    }
  });

  // Skyscraper Recycling down -Z
  buildingPool.forEach(bldg => {
    if (bldg.position.z > s.z + 60) {
      bldg.position.z -= BUILDING_SPACING * (BUILDING_COUNT / 2);
    }
  });

  // Endless Road Cycling
  if (roadGroup.position.z > s.z + 300) {
    roadGroup.position.z = s.z;
  }

  // Update HUD Metrics
  updateHUD();

  // Center Gauge
  const needlePercent = Math.max(0, Math.min(100, ((s.x - LEFT_WALL_X) / (RIGHT_WALL_X - LEFT_WALL_X)) * 100));
  gaugeNeedleEl.style.left = needlePercent + '%';
  gaugeNeedleEl.classList.toggle('in-center', absX < 3.2);

  // Sound Wind & Speed Lines
  const fallSpeed = Math.max(0, -s.vy);
  sound.updateWind(Math.min(s.vz / 36, 1.0), Math.min(fallSpeed / 30, 1.0));
  drawSpeedLines(Math.max(s.vz / 36, fallSpeed / 28));

  // Update living city elements: Traffic, Drones, Rings, Steam, and Perch Reticle
  updateTraffic(dt, s.z);
  updateDrones(dt, s);
  updateRings(dt, s);
  updateSteamParticles(dt);
  updatePerchReticle(s);
}

// User Interaction Listeners
function bindStart(btn) {
  if (!btn) return;
  btn.addEventListener('pointerdown', (e) => { e.preventDefault(); startGame(); });
  btn.addEventListener('click', (e) => { e.preventDefault(); startGame(); });
}
bindStart(startGameBtn);
bindStart(restartGameBtn);

pauseBtn.addEventListener('click', togglePause);
resumeGameBtn.addEventListener('click', togglePause);

const memeMusicBtn = document.getElementById('memeMusicBtn');
const memeMusicTxt = document.getElementById('memeMusicTxt');
if (memeMusicBtn) {
  memeMusicBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const isPlaying = sound.toggleMemeBgm();
    if (memeMusicTxt) memeMusicTxt.textContent = isPlaying ? 'Music: ON' : 'Music: OFF';
  });
}

leftSteerBtn.addEventListener('pointerdown', (e) => { e.preventDefault(); attachWeb('LEFT'); });
leftSteerBtn.addEventListener('pointerup', (e) => { e.preventDefault(); detachWeb('LEFT'); });
leftSteerBtn.addEventListener('pointercancel', (e) => { e.preventDefault(); detachWeb('LEFT'); });

rightSteerBtn.addEventListener('pointerdown', (e) => { e.preventDefault(); attachWeb('RIGHT'); });
rightSteerBtn.addEventListener('pointerup', (e) => { e.preventDefault(); detachWeb('RIGHT'); });
rightSteerBtn.addEventListener('pointercancel', (e) => { e.preventDefault(); detachWeb('RIGHT'); });

screenLeftZone.addEventListener('pointerdown', (e) => { e.preventDefault(); attachWeb('LEFT'); });
screenLeftZone.addEventListener('pointerup', (e) => { e.preventDefault(); detachWeb('LEFT'); });
screenLeftZone.addEventListener('pointercancel', (e) => { e.preventDefault(); detachWeb('LEFT'); });

screenRightZone.addEventListener('pointerdown', (e) => { e.preventDefault(); attachWeb('RIGHT'); });
screenRightZone.addEventListener('pointerup', (e) => { e.preventDefault(); detachWeb('RIGHT'); });
screenRightZone.addEventListener('pointercancel', (e) => { e.preventDefault(); detachWeb('RIGHT'); });

centerZipBtn.addEventListener('click', (e) => { e.preventDefault(); triggerPointLaunch(); });
stuntBtn.addEventListener('click', (e) => { e.preventDefault(); triggerManualStunt(); });

const pointZipBtn = document.getElementById('pointZipBtn');
if (pointZipBtn) {
  pointZipBtn.addEventListener('click', (e) => { e.preventDefault(); triggerWebZip(); });
}

// Time of Day Toggle Button
const timeBtn = document.getElementById('timeBtn');
const timeTxt = document.getElementById('timeTxt');
const timeModes = ['DAY', 'SUNSET', 'NIGHT'];
let timeModeIdx = 0;
function cycleTimeOfDay() {
  timeModeIdx = (timeModeIdx + 1) % timeModes.length;
  const mode = timeModes[timeModeIdx];
  window.setTimeOfDay(mode);
  if (timeTxt) timeTxt.textContent = mode.charAt(0) + mode.slice(1).toLowerCase();
  spawnComicPopup(mode + '!', GAME.spidey.x, GAME.spidey.y);
}
if (timeBtn) {
  timeBtn.addEventListener('click', (e) => { e.preventDefault(); cycleTimeOfDay(); });
}

// Spider-Sense Bullet Time Button & Function
const senseBtn = document.getElementById('senseBtn');
function toggleSpiderSense(force) {
  if (GAME.state !== 'PLAYING') return;
  GAME.spiderSenseActive = (typeof force === 'boolean') ? force : !GAME.spiderSenseActive;
  if (window.spiderSenseGroup) {
    window.spiderSenseGroup.visible = GAME.spiderSenseActive;
  }
  if (senseBtn) {
    senseBtn.classList.toggle('active', GAME.spiderSenseActive);
  }
  const flash = document.getElementById('damageFlash');
  if (GAME.spiderSenseActive) {
    sound.playSpiralWhoosh();
    spawnComicPopup('SPIDER-SENSE!', GAME.spidey.x, GAME.spidey.y);
    if (flash) {
      flash.style.background = 'radial-gradient(circle, rgba(250, 204, 21, 0.35) 0%, transparent 75%)';
      flash.style.opacity = '1';
    }
  } else {
    if (flash) {
      flash.style.opacity = '0';
      flash.style.background = 'radial-gradient(circle, rgba(239, 68, 68, 0.6) 0%, transparent 80%)';
    }
  }
}
window.toggleSpiderSense = toggleSpiderSense;
if (senseBtn) {
  senseBtn.addEventListener('click', (e) => { e.preventDefault(); toggleSpiderSense(); });
}

// Suit Wardrobe Modal Handling
const suitBtn = document.getElementById('suitBtn');
const suitModal = document.getElementById('suitModal');
const closeSuitBtn = document.getElementById('closeSuitBtn');

if (suitBtn && suitModal) {
  suitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    suitModal.style.display = 'flex';
  });
}
if (closeSuitBtn && suitModal) {
  closeSuitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    suitModal.style.display = 'none';
  });
}
document.querySelectorAll('.suit-card').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.suit-card').forEach(c => c.classList.remove('active'));
    card.classList.add('active');
    const suitKey = card.getAttribute('data-suit');
    window.setSuit(suitKey);
    spawnComicPopup(suitKey + ' SUIT!', GAME.spidey.x, GAME.spidey.y);
  });
});

// Keyboard Controls
window.addEventListener('keydown', (e) => {
  if (e.repeat) return;
  const key = e.key.toLowerCase();

  if (GAME.state === 'START' || GAME.state === 'GAMEOVER') {
    if (key === ' ' || key === 'enter' || key === 'a' || key === 'd' || key === 'arrowleft' || key === 'arrowright') {
      startGame();
      return;
    }
  }

  if (key === 'a' || key === 'arrowleft') {
    attachWeb('LEFT');
  } else if (key === 'd' || key === 'arrowright') {
    attachWeb('RIGHT');
  } else if (key === 'w' || key === 'arrowup') {
    triggerManualStunt();
  } else if (key === 's' || key === 'arrowdown') {
    GAME.isDiving = true;
  } else if (key === 'f') {
    triggerWebZip();
  } else if (key === ' ' || key === 'e') {
    triggerPointLaunch();
  } else if (key === 'q' || key === 'shift') {
    toggleSpiderSense();
  } else if (key === 't') {
    cycleTimeOfDay();
  } else if (key === 'p' || key === 'escape') {
    togglePause();
  }
});

window.addEventListener('keyup', (e) => {
  const key = e.key.toLowerCase();
  if (key === 'a' || key === 'arrowleft') {
    detachWeb('LEFT');
  } else if (key === 'd' || key === 'arrowright') {
    detachWeb('RIGHT');
  } else if (key === 's' || key === 'arrowdown') {
    GAME.isDiving = false;
  }
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
});

// Kick off rendering loop
requestAnimationFrame(animate);
