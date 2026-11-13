/* =========================================================
   SPIDER-MAN 3D CHARACTER MODEL & THREE.JS SCENE SETUP
   High-performance, zero-allocation skeletal hierarchy
   ========================================================= */

// Coordinate System & Canyon Bounds
window.ROAD_WIDTH = 27;
window.LEFT_WALL_X = -13.5;
window.RIGHT_WALL_X = 13.5;
window.ROAD_Y = 0;
window.SPIDEY_BASE_Y = 16;

// Three.js Scene & Camera
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x38bdf8); // Vibrant Manhattan sky blue
scene.fog = new THREE.FogExp2(0x38bdf8, 0.0075); // Atmospheric depth fog

const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.5, 350);
camera.position.set(0, SPIDEY_BASE_Y + 4.2, 12.5);

// WebGL Renderer with High-Performance Settings for 60 FPS locked on all devices
const container = document.getElementById('gameCanvas');
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  powerPreference: "high-performance",
  precision: "mediump"
});
renderer.setSize(window.innerWidth, window.innerHeight);
// Clamp pixel ratio to max 1.25 to prevent 4K/retina GPU lag while maintaining sharp visuals
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
renderer.shadowMap.enabled = false; // Disable expensive real-time shadow maps for smooth 60fps
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
if (container) {
  container.appendChild(renderer.domElement);
}

// Sunlight & City Ambience
const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
scene.add(ambientLight);

const sunLight = new THREE.DirectionalLight(0xfffbeb, 1.15);
sunLight.position.set(-30, 80, 40);
scene.add(sunLight);

const fillLight = new THREE.DirectionalLight(0x93c5fd, 0.4);
fillLight.position.set(30, 30, -20);
scene.add(fillLight);

// Endless Asphalt Road
const roadGroup = new THREE.Group();
const roadGeo = new THREE.PlaneGeometry(ROAD_WIDTH, 700);
const roadMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.85 });
const roadMesh = new THREE.Mesh(roadGeo, roadMat);
roadMesh.rotation.x = -Math.PI / 2;
roadMesh.position.set(0, ROAD_Y, -200);
roadGroup.add(roadMesh);

// Yellow Lane Markings
const stripeGeo = new THREE.PlaneGeometry(0.3, 700);
const stripeMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });
const stripeLeft = new THREE.Mesh(stripeGeo, stripeMat);
stripeLeft.rotation.x = -Math.PI / 2;
stripeLeft.position.set(-4.5, ROAD_Y + 0.02, -200);
roadGroup.add(stripeLeft);

const stripeRight = new THREE.Mesh(stripeGeo, stripeMat);
stripeRight.rotation.x = -Math.PI / 2;
stripeRight.position.set(4.5, ROAD_Y + 0.02, -200);
roadGroup.add(stripeRight);

scene.add(roadGroup);

// Spider-Man Character Materials (Heroic & Comic-Accurate)
const spideyRedMat = new THREE.MeshStandardMaterial({
  color: 0xef233c,
  roughness: 0.32,
  metalness: 0.12
});

const spideyBlueMat = new THREE.MeshStandardMaterial({
  color: 0x1d4ed8,
  roughness: 0.36,
  metalness: 0.1
});

const spideyDarkMat = new THREE.MeshStandardMaterial({
  color: 0x090d16,
  roughness: 0.45,
  metalness: 0.25
});

const spideySilverMat = new THREE.MeshStandardMaterial({
  color: 0xd4d4d8,
  roughness: 0.2,
  metalness: 0.8
});

const eyeWhiteMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

// Spider-Man Skeletal Hierarchy
const spideyRoot = new THREE.Group();
scene.add(spideyRoot);

const spideyGroup = new THREE.Group();
spideyGroup.rotation.y = Math.PI; // Face forward down -Z
spideyRoot.add(spideyGroup);

// Torso (Heroic Athletic V-Taper)
const torsoMesh = new THREE.Mesh(new THREE.BoxGeometry(1.28, 1.65, 0.88), spideyRedMat);
torsoMesh.castShadow = false;
spideyGroup.add(torsoMesh);

// Blue Rib / Flank Panels
const ribMesh = new THREE.Mesh(new THREE.BoxGeometry(1.30, 0.95, 0.72), spideyBlueMat);
ribMesh.position.set(0, -0.32, 0);
spideyGroup.add(ribMesh);

// Red Utility Belt with Dark Buckle
const beltMesh = new THREE.Mesh(new THREE.BoxGeometry(1.31, 0.18, 0.89), spideyRedMat);
beltMesh.position.set(0, -0.74, 0);
spideyGroup.add(beltMesh);

const buckleMesh = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.22, 0.91), spideyDarkMat);
buckleMesh.position.set(0, -0.74, 0);
spideyGroup.add(buckleMesh);

// Front Iconic Spider Emblem
const emblemMesh = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.52, 0.92), spideyDarkMat);
emblemMesh.position.set(0, 0.22, 0);
spideyGroup.add(emblemMesh);

// Back Spider Emblem (Iconic Comic Back Symbol)
const backEmblemMesh = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.65, 0.91), spideyDarkMat);
backEmblemMesh.position.set(0, 0.18, -0.01);
spideyGroup.add(backEmblemMesh);

// Sculpted Aerodynamic Head
const headMesh = new THREE.Mesh(new THREE.SphereGeometry(0.66, 18, 18), spideyRedMat);
headMesh.position.set(0, 1.34, 0.08);
headMesh.scale.set(0.88, 1.04, 0.94);
spideyGroup.add(headMesh);

// Mask Expressive Eyes (Flared Black Bezel + Radiant White Lens)
function createSpiderEye(isLeft) {
  const eyeGroup = new THREE.Group();
  const outerMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.38, 0.28), spideyDarkMat);
  const innerMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.30, 0.20), eyeWhiteMat);
  innerMesh.position.z = 0.015;
  eyeGroup.add(outerMesh);
  eyeGroup.add(innerMesh);

  const sign = isLeft ? -1 : 1;
  eyeGroup.position.set(sign * 0.24, 1.38, 0.68);
  eyeGroup.rotation.y = sign * 0.26;
  eyeGroup.rotation.z = -sign * 0.22;
  return eyeGroup;
}
spideyGroup.add(createSpiderEye(true));
spideyGroup.add(createSpiderEye(false));

// =========================================================
// 2-SEGMENT ARTICULATED ARMS (SHOULDER & ELBOW JOINTS)
// =========================================================
// Left Shoulder
const leftArmPivot = new THREE.Group();
leftArmPivot.position.set(-0.84, 0.68, 0);

// Left Upper Arm (Bicep/Tricep)
const leftArmMesh = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.58, 0.34), spideyRedMat);
leftArmMesh.position.set(0, -0.29, 0);
leftArmPivot.add(leftArmMesh);

// Left Elbow Joint Pivot (Bends on X axis)
const leftElbowPivot = new THREE.Group();
leftElbowPivot.position.set(0, -0.58, 0);

// Elbow hinge joint ball
const leftElbowJoint = new THREE.Mesh(new THREE.SphereGeometry(0.17, 10, 10), spideyRedMat);
leftElbowPivot.add(leftElbowJoint);

// Forearm (Lower Arm)
const leftForearmMesh = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.52, 0.32), spideyRedMat);
leftForearmMesh.position.set(0, -0.26, 0);
leftElbowPivot.add(leftForearmMesh);

// Metallic Web-Shooter Cuff on Wrist
const leftWebShooter = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.12, 10), spideySilverMat);
leftWebShooter.position.set(0, -0.48, 0);
leftElbowPivot.add(leftWebShooter);

// Hand / Gloved Web-Slinging Fist
const leftHandMesh = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.26, 0.28), spideyRedMat);
leftHandMesh.position.set(0, -0.62, 0);
leftElbowPivot.add(leftHandMesh);

leftArmPivot.add(leftElbowPivot);
spideyGroup.add(leftArmPivot);

// Right Shoulder
const rightArmPivot = new THREE.Group();
rightArmPivot.position.set(0.84, 0.68, 0);

// Right Upper Arm (Bicep/Tricep)
const rightArmMesh = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.58, 0.34), spideyRedMat);
rightArmMesh.position.set(0, -0.29, 0);
rightArmPivot.add(rightArmMesh);

// Right Elbow Joint Pivot (Bends on X axis)
const rightElbowPivot = new THREE.Group();
rightElbowPivot.position.set(0, -0.58, 0);

// Elbow hinge joint ball
const rightElbowJoint = new THREE.Mesh(new THREE.SphereGeometry(0.17, 10, 10), spideyRedMat);
rightElbowPivot.add(rightElbowJoint);

// Forearm (Lower Arm)
const rightForearmMesh = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.52, 0.32), spideyRedMat);
rightForearmMesh.position.set(0, -0.26, 0);
rightElbowPivot.add(rightForearmMesh);

// Metallic Web-Shooter Cuff on Wrist
const rightWebShooter = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.12, 10), spideySilverMat);
rightWebShooter.position.set(0, -0.48, 0);
rightElbowPivot.add(rightWebShooter);

// Hand / Gloved Web-Slinging Fist
const rightHandMesh = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.26, 0.28), spideyRedMat);
rightHandMesh.position.set(0, -0.62, 0);
rightElbowPivot.add(rightHandMesh);

rightArmPivot.add(rightElbowPivot);
spideyGroup.add(rightArmPivot);

// =========================================================
// 2-SEGMENT ARTICULATED LEGS (HIP & KNEE JOINTS)
// =========================================================
// Left Hip
const leftLegPivot = new THREE.Group();
leftLegPivot.position.set(-0.44, -0.85, 0);

// Left Thigh (Upper Leg Pants)
const leftPants = new THREE.Mesh(new THREE.BoxGeometry(0.40, 0.70, 0.40), spideyBlueMat);
leftPants.position.set(0, -0.35, 0);
leftLegPivot.add(leftPants);

// Left Knee Joint Pivot (Bends on X axis)
const leftKneePivot = new THREE.Group();
leftKneePivot.position.set(0, -0.70, 0);

// Athletic Knee Cap Guard
const leftKnee = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.22, 0.44), spideyBlueMat);
leftKnee.position.set(0, 0, 0.05);
leftKneePivot.add(leftKnee);

// Calf / Lower Leg (Blue suit shin)
const leftCalfMesh = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.46, 0.38), spideyBlueMat);
leftCalfMesh.position.set(0, -0.23, 0);
leftKneePivot.add(leftCalfMesh);

// Spider-Man Boot (Shin + Foot)
const leftBoot = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.52, 0.54), spideyRedMat);
leftBoot.position.set(0, -0.48, 0.06);
leftKneePivot.add(leftBoot);

leftLegPivot.add(leftKneePivot);
spideyGroup.add(leftLegPivot);

// Right Hip
const rightLegPivot = new THREE.Group();
rightLegPivot.position.set(0.44, -0.85, 0);

// Right Thigh (Upper Leg Pants)
const rightPants = new THREE.Mesh(new THREE.BoxGeometry(0.40, 0.70, 0.40), spideyBlueMat);
rightPants.position.set(0, -0.35, 0);
rightLegPivot.add(rightPants);

// Right Knee Joint Pivot (Bends on X axis)
const rightKneePivot = new THREE.Group();
rightKneePivot.position.set(0, -0.70, 0);

// Athletic Knee Cap Guard
const rightKnee = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.22, 0.44), spideyBlueMat);
rightKnee.position.set(0, 0, 0.05);
rightKneePivot.add(rightKnee);

// Calf / Lower Leg (Blue suit shin)
const rightCalfMesh = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.46, 0.38), spideyBlueMat);
rightCalfMesh.position.set(0, -0.23, 0);
rightKneePivot.add(rightCalfMesh);

// Spider-Man Boot (Shin + Foot)
const rightBoot = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.52, 0.54), spideyRedMat);
rightBoot.position.set(0, -0.48, 0.06);
rightKneePivot.add(rightBoot);

rightLegPivot.add(rightKneePivot);
spideyGroup.add(rightLegPivot);

// Spider-Man 2 Web Wings (deployable underarm gliding wings)
const webWingMat = new THREE.MeshStandardMaterial({
  color: 0x93c5fd,
  roughness: 0.25,
  metalness: 0.1,
  transparent: true,
  opacity: 0.75,
  side: THREE.DoubleSide
});
const wingShape = new THREE.Shape();
wingShape.moveTo(0, 0);
wingShape.lineTo(1.1, -0.25);
wingShape.lineTo(0.9, -1.1);
wingShape.lineTo(0.1, -0.8);
wingShape.closePath();
const wingGeo = new THREE.ShapeGeometry(wingShape);

const leftWebWing = new THREE.Mesh(wingGeo, webWingMat);
leftWebWing.position.set(-0.65, 0.45, 0);
leftWebWing.scale.set(-1, 1, 1);
leftWebWing.visible = false;
spideyGroup.add(leftWebWing);

const rightWebWing = new THREE.Mesh(wingGeo, webWingMat);
rightWebWing.position.set(0.65, 0.45, 0);
rightWebWing.visible = false;
spideyGroup.add(rightWebWing);

// =========================================================
// SUIT ACCESSORIES: IRON SPIDER WALDOES & SCARLET HOODIE
// =========================================================
const ironGoldMat = new THREE.MeshStandardMaterial({
  color: 0xf59e0b,
  roughness: 0.22,
  metalness: 0.88
});

// Iron Spider 4 Articulated Golden Waldoes (Mechanical Spider Legs)
const ironWaldoesGroup = new THREE.Group();
ironWaldoesGroup.position.set(0, 0.35, -0.38);

function createWaldoArm(isLeft, isUpper) {
  const root = new THREE.Group();
  const signX = isLeft ? -1 : 1;
  const signY = isUpper ? 1 : -1;

  // Base socket
  const socket = new THREE.Mesh(new THREE.SphereGeometry(0.15, 8, 8), ironGoldMat);
  root.add(socket);

  // Upper segment
  const seg1Geo = new THREE.CylinderGeometry(0.08, 0.08, 1.2, 8);
  seg1Geo.translate(0, 0.6, 0);
  const seg1 = new THREE.Mesh(seg1Geo, ironGoldMat);
  seg1.rotation.z = signX * (isUpper ? -0.85 : -1.2);
  seg1.rotation.x = isUpper ? -0.4 : 0.4;
  root.add(seg1);

  // Elbow Joint & Claw Segment
  const elbow = new THREE.Group();
  elbow.position.set(signX * (isUpper ? 0.9 : 1.1), isUpper ? 0.8 : -0.7, 0.2);

  const clawGeo = new THREE.ConeGeometry(0.12, 1.3, 8);
  clawGeo.translate(0, 0.65, 0);
  const claw = new THREE.Mesh(clawGeo, ironGoldMat);
  claw.rotation.z = signX * (isUpper ? 1.4 : 0.8);
  claw.rotation.x = isUpper ? 0.6 : -0.3;
  elbow.add(claw);

  root.add(elbow);
  root.userData = { elbow, signX, signY, isUpper };
  return root;
}

const waldoUpperL = createWaldoArm(true, true);
const waldoUpperR = createWaldoArm(false, true);
const waldoLowerL = createWaldoArm(true, false);
const waldoLowerR = createWaldoArm(false, false);

ironWaldoesGroup.add(waldoUpperL);
ironWaldoesGroup.add(waldoUpperR);
ironWaldoesGroup.add(waldoLowerL);
ironWaldoesGroup.add(waldoLowerR);
ironWaldoesGroup.visible = false;
spideyGroup.add(ironWaldoesGroup);

// Scarlet Spider Denim Hoodie Vest
const denimBlueMat = new THREE.MeshStandardMaterial({
  color: 0x0284c7,
  roughness: 0.65,
  metalness: 0.05
});
const scarletHoodieMesh = new THREE.Mesh(
  new THREE.BoxGeometry(1.36, 1.62, 0.96),
  denimBlueMat
);
scarletHoodieMesh.position.set(0, 0, 0);
scarletHoodieMesh.visible = false;
spideyGroup.add(scarletHoodieMesh);

// Spider-Sense Corona Waves (Glowing golden arcs over head)
const spiderSenseGroup = new THREE.Group();
spiderSenseGroup.position.set(0, 2.2, 0.08);

const senseLineMat = new THREE.MeshBasicMaterial({
  color: 0xfacc15,
  wireframe: true
});
for (let i = 0; i < 3; i++) {
  const arc = new THREE.Mesh(
    new THREE.TorusGeometry(0.45 + i * 0.28, 0.035, 6, 16, Math.PI * 0.75),
    senseLineMat
  );
  arc.rotation.x = -Math.PI / 2;
  arc.rotation.z = (Math.PI * 0.125);
  arc.position.y = i * 0.22;
  spiderSenseGroup.add(arc);
}
spiderSenseGroup.visible = false;
spideyGroup.add(spiderSenseGroup);

// =========================================================
// SUIT PRESETS DEFINITION & SETTER
// =========================================================
const SUIT_PRESETS = {
  CLASSIC: {
    name: 'Classic Red & Blue',
    red: 0xef233c,
    blue: 0x1d4ed8,
    dark: 0x090d16,
    silver: 0xd4d4d8,
    eye: 0xffffff,
    roughness: 0.32,
    metalness: 0.12,
    waldoes: false,
    hoodie: false
  },
  SYMBIOTE: {
    name: 'Symbiote Black Suit',
    red: 0x0b0d13,
    blue: 0x050608,
    dark: 0xffffff,
    silver: 0x334155,
    eye: 0xffffff,
    roughness: 0.22,
    metalness: 0.35,
    waldoes: false,
    hoodie: false
  },
  MILES: {
    name: 'Miles Morales Track Suit',
    red: 0x18181b,
    blue: 0x09090b,
    dark: 0xe11d48,
    silver: 0xef4444,
    eye: 0xffffff,
    roughness: 0.38,
    metalness: 0.1,
    waldoes: false,
    hoodie: false
  },
  IRON_SPIDER: {
    name: 'Iron Spider Armor',
    red: 0x991b1b,
    blue: 0xb45309,
    dark: 0xf59e0b,
    silver: 0xfbbf24,
    eye: 0x67e8f9,
    roughness: 0.18,
    metalness: 0.85,
    waldoes: true,
    hoodie: false
  },
  SCARLET: {
    name: 'Scarlet Spider',
    red: 0xdc2626,
    blue: 0x0284c7,
    dark: 0x0f172a,
    silver: 0x94a3b8,
    eye: 0xffffff,
    roughness: 0.42,
    metalness: 0.08,
    waldoes: false,
    hoodie: true
  }
};

window.currentSuit = 'CLASSIC';

function setSuit(suitKey) {
  const suit = SUIT_PRESETS[suitKey] || SUIT_PRESETS.CLASSIC;
  window.currentSuit = suitKey;

  spideyRedMat.color.setHex(suit.red);
  spideyRedMat.roughness = suit.roughness;
  spideyRedMat.metalness = suit.metalness;

  spideyBlueMat.color.setHex(suit.blue);
  spideyBlueMat.roughness = suit.roughness;
  spideyBlueMat.metalness = suit.metalness;

  spideyDarkMat.color.setHex(suit.dark);
  spideySilverMat.color.setHex(suit.silver);
  eyeWhiteMat.color.setHex(suit.eye);

  ironWaldoesGroup.visible = !!suit.waldoes;
  scarletHoodieMesh.visible = !!suit.hoodie;

  console.log(`🕷️ Suit changed to: ${suit.name}`);
  return suit;
}

window.setSuit = setSuit;
window.SUIT_PRESETS = SUIT_PRESETS;
window.ironWaldoesGroup = ironWaldoesGroup;
window.spiderSenseGroup = spiderSenseGroup;

// =========================================================
// TIME OF DAY SYSTEM (DAY / SUNSET / NIGHT)
// =========================================================
window.currentTimeOfDay = 'DAY';

function setTimeOfDay(mode) {
  window.currentTimeOfDay = mode;
  if (mode === 'SUNSET') {
    scene.background.setHex(0xf97316);
    scene.fog.color.setHex(0xc2410c);
    scene.fog.density = 0.0075;
    sunLight.color.setHex(0xfde047);
    sunLight.intensity = 1.35;
    sunLight.position.set(-50, 45, 30);
    ambientLight.color.setHex(0x7c2d12);
    ambientLight.intensity = 0.7;
    fillLight.color.setHex(0xa855f7);
    fillLight.intensity = 0.55;
    document.body.style.background = '#7c2d12';
  } else if (mode === 'NIGHT') {
    scene.background.setHex(0x060913);
    scene.fog.color.setHex(0x060913);
    scene.fog.density = 0.009;
    sunLight.color.setHex(0x60a5fa);
    sunLight.intensity = 0.55;
    sunLight.position.set(-20, 60, -20);
    ambientLight.color.setHex(0x1e1b4b);
    ambientLight.intensity = 0.55;
    fillLight.color.setHex(0x06b6d4);
    fillLight.intensity = 0.45;
    document.body.style.background = '#060913';
  } else {
    // Default DAY
    window.currentTimeOfDay = 'DAY';
    scene.background.setHex(0x38bdf8);
    scene.fog.color.setHex(0x38bdf8);
    scene.fog.density = 0.0075;
    sunLight.color.setHex(0xfffbeb);
    sunLight.intensity = 1.15;
    sunLight.position.set(-30, 80, 40);
    ambientLight.color.setHex(0xffffff);
    ambientLight.intensity = 0.75;
    fillLight.color.setHex(0x93c5fd);
    fillLight.intensity = 0.4;
    document.body.style.background = '#0284c7';
  }
  return window.currentTimeOfDay;
}

window.setTimeOfDay = setTimeOfDay;

// Lightweight Drop Shadow Mesh directly on Asphalt
const shadowMesh = new THREE.Mesh(
  new THREE.CircleGeometry(1.6, 16),
  new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.35 })
);
shadowMesh.rotation.x = -Math.PI / 2;
shadowMesh.position.y = ROAD_Y + 0.05;
scene.add(shadowMesh);

// Glowing 3D Web Strands
const webStrandMat = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  emissive: 0xffffff,
  emissiveIntensity: 0.85,
  roughness: 0.1,
  metalness: 0.1
});

function createWebStrand() {
  const geo = new THREE.CylinderGeometry(0.12, 0.12, 1, 6);
  geo.translate(0, 0.5, 0);
  geo.rotateX(Math.PI / 2);
  const mesh = new THREE.Mesh(geo, webStrandMat);
  mesh.visible = false;
  scene.add(mesh);
  return mesh;
}
const leftWebMesh = createWebStrand();
const rightWebMesh = createWebStrand();

// Web Splat Decals on Wall
function createWebSplatDecal() {
  const group = new THREE.Group();
  const splatDisc = new THREE.Mesh(
    new THREE.CircleGeometry(1.5, 12),
    new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.92 })
  );
  group.add(splatDisc);

  const spokePts = [];
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    spokePts.push(new THREE.Vector3(0, 0, 0.02));
    spokePts.push(new THREE.Vector3(Math.cos(a) * 2.1, Math.sin(a) * 2.1, 0.02));
  }
  const spokeGeo = new THREE.BufferGeometry().setFromPoints(spokePts);
  const spokeLines = new THREE.LineSegments(spokeGeo, new THREE.LineBasicMaterial({ color: 0x0f172a, linewidth: 2 }));
  group.add(spokeLines);
  group.visible = false;
  scene.add(group);
  return group;
}
const leftWebSplat = createWebSplatDecal();
const rightWebSplat = createWebSplatDecal();

// Wall Spark & Web Hit Particle System
const SPARK_COUNT = 60;
const sparkGeo = new THREE.BufferGeometry();
const sparkPositions = new Float32Array(SPARK_COUNT * 3);
const sparkVelocities = [];

for (let i = 0; i < SPARK_COUNT; i++) {
  sparkPositions[i * 3] = 0;
  sparkPositions[i * 3 + 1] = 0;
  sparkPositions[i * 3 + 2] = 0;
  sparkVelocities.push({ x: 0, y: 0, z: 0, life: 0 });
}
sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPositions, 3));
const sparkMat = new THREE.PointsMaterial({
  color: 0xfef08a,
  size: 0.7,
  transparent: true,
  opacity: 0.9,
  blending: THREE.AdditiveBlending
});
const sparkPoints = new THREE.Points(sparkGeo, sparkMat);
scene.add(sparkPoints);

function triggerWallSparks(x, y, z, isLeft) {
  const count = 16;
  const posArr = sparkGeo.attributes.position.array;
  for (let i = 0; i < count; i++) {
    const idx = (Math.floor(Math.random() * SPARK_COUNT)) * 3;
    posArr[idx] = x;
    posArr[idx + 1] = y;
    posArr[idx + 2] = z;
    const vIdx = idx / 3;
    sparkVelocities[vIdx].x = (isLeft ? 1 : -1) * (2 + Math.random() * 4);
    sparkVelocities[vIdx].y = (Math.random() - 0.5) * 4;
    sparkVelocities[vIdx].z = (Math.random() - 0.5) * 4;
    sparkVelocities[vIdx].life = 0.25;
  }
  sparkGeo.attributes.position.needsUpdate = true;
}

function triggerWebHitSparks(x, y, z, isLeft) {
  const count = 12;
  const posArr = sparkGeo.attributes.position.array;
  for (let i = 0; i < count; i++) {
    const idx = (Math.floor(Math.random() * SPARK_COUNT)) * 3;
    posArr[idx] = x;
    posArr[idx + 1] = y;
    posArr[idx + 2] = z;
    const vIdx = idx / 3;
    sparkVelocities[vIdx].x = (isLeft ? 1 : -1) * (1.5 + Math.random() * 3);
    sparkVelocities[vIdx].y = (Math.random() - 0.5) * 3;
    sparkVelocities[vIdx].z = (Math.random() - 0.5) * 3;
    sparkVelocities[vIdx].life = 0.2;
  }
  sparkGeo.attributes.position.needsUpdate = true;
}

// Scratch Vectors to eliminate garbage collection pauses (100% GC-free rendering loop)
const _scratchWristL = new THREE.Vector3();
const _scratchWristR = new THREE.Vector3();
const _scratchActiveWrist = new THREE.Vector3();
const _scratchLookAhead = new THREE.Vector3();

// Export globals to window for modular access
window.scene = scene;
window.camera = camera;
window.renderer = renderer;
window.sunLight = sunLight;
window.roadGroup = roadGroup;
window.spideyRoot = spideyRoot;
window.spideyGroup = spideyGroup;
window.headMesh = headMesh;
window.leftArmPivot = leftArmPivot;
window.rightArmPivot = rightArmPivot;
window.leftElbowPivot = leftElbowPivot;
window.rightElbowPivot = rightElbowPivot;
window.leftLegPivot = leftLegPivot;
window.rightLegPivot = rightLegPivot;
window.leftKneePivot = leftKneePivot;
window.rightKneePivot = rightKneePivot;
window.leftWebWing = leftWebWing;
window.rightWebWing = rightWebWing;
window.shadowMesh = shadowMesh;
window.leftWebMesh = leftWebMesh;
window.rightWebMesh = rightWebMesh;
window.leftWebSplat = leftWebSplat;
window.rightWebSplat = rightWebSplat;
window.sparkGeo = sparkGeo;
window.sparkVelocities = sparkVelocities;
window.SPARK_COUNT = SPARK_COUNT;
window.triggerWallSparks = triggerWallSparks;
window.triggerWebHitSparks = triggerWebHitSparks;
window._scratchWristL = _scratchWristL;
window._scratchWristR = _scratchWristR;
window._scratchActiveWrist = _scratchActiveWrist;
window._scratchLookAhead = _scratchLookAhead;

// Procedural Heroic Spider-Man is ready and fully articulated!
console.log('🕷️ Authentic Procedural Spider-Man Model Initialized with Full Physics & Movement!');
