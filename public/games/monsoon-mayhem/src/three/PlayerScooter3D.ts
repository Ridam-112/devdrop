import * as THREE from 'three';
import { PHYSICS_CONFIG } from '../data/physicsConfig';
import { AudioManager } from '../systems/AudioManager';

export class PlayerScooter3D {
  public mesh: THREE.Group;
  public chassisGroup: THREE.Group;
  public steerGroup: THREE.Group;
  public frontWheelMesh!: THREE.Mesh;
  public rearWheelMesh!: THREE.Mesh;
  public brakeLightMesh!: THREE.Mesh;
  public headlightLight!: THREE.SpotLight;
  public waterSprayMesh!: THREE.Mesh;
  public exhaustSmokeMesh!: THREE.Mesh;

  // Physical Movement State
  public position: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
  public currentSpeedKmh: number = 0; // KM/H
  public leanAngle: number = 0; // Radians
  public steerAngle: number = 0; // Radians
  public wheelRotation: number = 0; // Radians

  // Silencer Flooding & Sputter State
  public exhaustWaterLevel: number = 0; // 0% to 100%
  public sputterTimer: number = 0;

  // Jump Physics State
  public isAirborne: boolean = false;
  public jumpHeight: number = 0; // In 3D meters
  public jumpVelocityY: number = 0;
  public jumpCooldownTimer: number = 0;
  public landingSquashTimer: number = 0;

  // Wheel Collider dimensions for Rapier
  public readonly wheelRadius = 0.24;
  public readonly frontWheelOffsetZ = -0.72;
  public readonly rearWheelOffsetZ = 0.52;

  constructor(scene: THREE.Scene) {
    this.mesh = new THREE.Group();
    this.chassisGroup = new THREE.Group();
    this.steerGroup = new THREE.Group();

    this.build3DScooter();
    this.build3DRider();

    this.mesh.add(this.chassisGroup);
    this.mesh.position.set(0, 0, 0);
    scene.add(this.mesh);
  }

  private build3DScooter(): void {
    // Materials
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7, // Classic Sky-Blue Chetak
      roughness: 0.35,
      metalness: 0.25
    });

    const darkBlueMat = new THREE.MeshStandardMaterial({
      color: 0x0369a1,
      roughness: 0.4
    });

    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.15,
      metalness: 0.85
    });

    const rubberMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.85,
      metalness: 0.05
    });

    const rimMat = new THREE.MeshStandardMaterial({
      color: 0xcbd5e1,
      roughness: 0.25,
      metalness: 0.75
    });

    const seatMat = new THREE.MeshStandardMaterial({
      color: 0x27272a,
      roughness: 0.7
    });

    // 1. Central Floorboard & Backbone Frame
    const floorGeo = new THREE.BoxGeometry(0.55, 0.08, 1.25);
    const floorMesh = new THREE.Mesh(floorGeo, darkBlueMat);
    floorMesh.position.set(0, 0.28, -0.05);
    floorMesh.castShadow = true;
    floorMesh.receiveShadow = true;
    this.chassisGroup.add(floorMesh);

    // Rubber Grip Strips on Floorboard
    const stripGeo = new THREE.BoxGeometry(0.04, 0.02, 1.1);
    for (const sx of [-0.18, -0.09, 0.09, 0.18]) {
      const strip = new THREE.Mesh(stripGeo, rubberMat);
      strip.position.set(sx, 0.33, -0.05);
      this.chassisGroup.add(strip);
    }

    // 2. Rear Monocoque Bulbous Engine Cowls
    const cowlGeo = new THREE.CylinderGeometry(0.32, 0.38, 0.75, 16);
    cowlGeo.rotateZ(Math.PI / 2);
    const cowlMesh = new THREE.Mesh(cowlGeo, bodyMat);
    cowlMesh.position.set(0, 0.48, 0.42);
    cowlMesh.scale.set(0.85, 1.15, 0.95);
    cowlMesh.castShadow = true;
    this.chassisGroup.add(cowlMesh);

    // Left & Right Bulbous Engine Side Covers
    const sideCowlGeo = new THREE.SphereGeometry(0.26, 16, 12);
    sideCowlGeo.scale(0.8, 1.0, 1.4);

    const leftCowl = new THREE.Mesh(sideCowlGeo, bodyMat);
    leftCowl.position.set(-0.28, 0.45, 0.45);
    leftCowl.castShadow = true;
    this.chassisGroup.add(leftCowl);

    const rightCowl = new THREE.Mesh(sideCowlGeo, bodyMat);
    rightCowl.position.set(0.28, 0.45, 0.45);
    rightCowl.castShadow = true;
    this.chassisGroup.add(rightCowl);

    // Chrome Side Crash Bars wrapping around rear cowls (Iconic vintage Bajaj Chetak safety guards)
    const crashBarGeo = new THREE.TorusGeometry(0.32, 0.015, 8, 16, Math.PI);
    crashBarGeo.rotateY(Math.PI / 2);

    const leftCrashBar = new THREE.Mesh(crashBarGeo, chromeMat);
    leftCrashBar.position.set(-0.35, 0.45, 0.45);
    this.chassisGroup.add(leftCrashBar);

    const rightCrashBar = new THREE.Mesh(crashBarGeo, chromeMat);
    rightCrashBar.position.set(0.35, 0.45, 0.45);
    this.chassisGroup.add(rightCrashBar);

    // Kickstart lever on right cowl
    const kickGeo = new THREE.CylinderGeometry(0.018, 0.018, 0.22, 6);
    kickGeo.rotateZ(0.5);
    const kickMesh = new THREE.Mesh(kickGeo, chromeMat);
    kickMesh.position.set(0.36, 0.32, 0.38);
    this.chassisGroup.add(kickMesh);

    // Chrome Spears on Cowls
    const spearGeo = new THREE.BoxGeometry(0.02, 0.025, 0.55);
    const leftSpear = new THREE.Mesh(spearGeo, chromeMat);
    leftSpear.position.set(-0.35, 0.46, 0.45);
    this.chassisGroup.add(leftSpear);

    const rightSpear = new THREE.Mesh(spearGeo, chromeMat);
    rightSpear.position.set(0.35, 0.46, 0.45);
    this.chassisGroup.add(rightSpear);

    // 3. Front Leg-Shield / Apron
    const apronGeo = new THREE.BoxGeometry(0.62, 0.65, 0.06);
    const apronMesh = new THREE.Mesh(apronGeo, bodyMat);
    apronMesh.position.set(0, 0.62, -0.55);
    apronMesh.rotation.x = -0.18;
    apronMesh.castShadow = true;
    this.chassisGroup.add(apronMesh);

    // Iconic Vintage Chetak Horncast (central front grill)
    const horncastGeo = new THREE.BoxGeometry(0.12, 0.32, 0.04);
    const horncastMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5, metalness: 0.8 });
    const horncastMesh = new THREE.Mesh(horncastGeo, horncastMat);
    horncastMesh.position.set(0, 0.66, -0.59);
    horncastMesh.rotation.x = -0.18;
    this.chassisGroup.add(horncastMesh);

    // Front Chetak Chrome Badge Emblem
    const badgeGeo = new THREE.BoxGeometry(0.08, 0.04, 0.02);
    const badgeMesh = new THREE.Mesh(badgeGeo, chromeMat);
    badgeMesh.position.set(0, 0.78, -0.61);
    badgeMesh.rotation.x = -0.18;
    this.chassisGroup.add(badgeMesh);

    // Amber Turn Indicators on front apron flanks
    const amberMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xd97706,
      emissiveIntensity: 0.5,
      roughness: 0.2
    });
    const indGeo = new THREE.BoxGeometry(0.07, 0.05, 0.03);
    const leftInd = new THREE.Mesh(indGeo, amberMat);
    leftInd.position.set(-0.25, 0.76, -0.58);
    leftInd.rotation.x = -0.18;
    this.chassisGroup.add(leftInd);

    const rightInd = new THREE.Mesh(indGeo, amberMat);
    rightInd.position.set(0.25, 0.76, -0.58);
    rightInd.rotation.x = -0.18;
    this.chassisGroup.add(rightInd);

    // 4. Cushioned Seat Saddle
    const seatGeo = new THREE.BoxGeometry(0.36, 0.12, 0.68);
    const seatMesh = new THREE.Mesh(seatGeo, seatMat);
    seatMesh.position.set(0, 0.76, 0.28);
    seatMesh.castShadow = true;
    this.chassisGroup.add(seatMesh);

    // 5. Rear Wheels with Spoked Rims & Rubber Tire
    const wheelGeo = new THREE.TorusGeometry(this.wheelRadius, 0.075, 12, 24);
    const rimGeo = new THREE.CylinderGeometry(this.wheelRadius * 0.72, this.wheelRadius * 0.72, 0.09, 16);
    rimGeo.rotateZ(Math.PI / 2);

    this.rearWheelMesh = new THREE.Mesh(wheelGeo, rubberMat);
    this.rearWheelMesh.rotation.y = Math.PI / 2;
    this.rearWheelMesh.position.set(0, this.wheelRadius, this.rearWheelOffsetZ);
    this.rearWheelMesh.castShadow = true;

    const rearRim = new THREE.Mesh(rimGeo, rimMat);
    this.rearWheelMesh.add(rearRim);
    this.chassisGroup.add(this.rearWheelMesh);

    // Rear Mudguard
    const rearGuardGeo = new THREE.CylinderGeometry(0.34, 0.34, 0.22, 12, 1, true, 0, Math.PI);
    rearGuardGeo.rotateZ(Math.PI / 2);
    const rearGuard = new THREE.Mesh(rearGuardGeo, bodyMat);
    rearGuard.position.set(0, 0.28, 0.52);
    this.chassisGroup.add(rearGuard);

    // 6. Steerable Front Fork & Handlebars
    this.steerGroup.position.set(0, 0, this.frontWheelOffsetZ);

    this.frontWheelMesh = new THREE.Mesh(wheelGeo, rubberMat);
    this.frontWheelMesh.rotation.y = Math.PI / 2;
    this.frontWheelMesh.position.set(0, this.wheelRadius, 0);
    this.frontWheelMesh.castShadow = true;

    const frontRim = new THREE.Mesh(rimGeo, rimMat);
    this.frontWheelMesh.add(frontRim);
    this.steerGroup.add(this.frontWheelMesh);

    // Steering Column & Fork
    const columnGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.85, 8);
    const columnMesh = new THREE.Mesh(columnGeo, chromeMat);
    columnMesh.position.set(0, 0.65, 0.08);
    columnMesh.rotation.x = -0.18;
    this.steerGroup.add(columnMesh);

    // Chrome Handlebars
    const barGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.78, 12);
    barGeo.rotateZ(Math.PI / 2);
    const barMesh = new THREE.Mesh(barGeo, chromeMat);
    barMesh.position.set(0, 1.05, 0.02);
    this.steerGroup.add(barMesh);

    // Rubber Grips
    const gripGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.14, 8);
    gripGeo.rotateZ(Math.PI / 2);
    const leftGrip = new THREE.Mesh(gripGeo, rubberMat);
    leftGrip.position.set(-0.35, 1.05, 0.02);
    this.steerGroup.add(leftGrip);

    const rightGrip = new THREE.Mesh(gripGeo, rubberMat);
    rightGrip.position.set(0.35, 1.05, 0.02);
    this.steerGroup.add(rightGrip);

    // Dual Round Rearview Mirrors
    const mirrorStemGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.22, 6);
    const mirrorGlassGeo = new THREE.CircleGeometry(0.07, 16);
    const mirrorGlassMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.1, metalness: 0.9 });

    for (const mx of [-0.34, 0.34]) {
      const stem = new THREE.Mesh(mirrorStemGeo, chromeMat);
      stem.position.set(mx, 1.15, 0.05);
      stem.rotation.z = (mx > 0 ? -1 : 1) * 0.35;
      this.steerGroup.add(stem);

      const mirror = new THREE.Mesh(mirrorGlassGeo, mirrorGlassMat);
      mirror.position.set(mx * 1.25, 1.25, 0.06);
      mirror.rotation.y = Math.PI;
      this.steerGroup.add(mirror);
    }

    // Front Headlight (Round with chrome ring)
    const headGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.08, 16);
    headGeo.rotateX(Math.PI / 2);
    const headMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xfef08a, emissiveIntensity: 0.8 });
    const headlightMesh = new THREE.Mesh(headGeo, headMat);
    headlightMesh.position.set(0, 0.98, -0.06);
    this.steerGroup.add(headlightMesh);

    // Chrome Bezel Ring around Headlight
    const bezelGeo = new THREE.TorusGeometry(0.092, 0.012, 8, 16);
    const bezelMesh = new THREE.Mesh(bezelGeo, chromeMat);
    bezelMesh.position.set(0, 0.98, -0.1);
    this.steerGroup.add(bezelMesh);

    // Retro Speedometer / Instrument Cluster on Handlebar Cowl
    const speedoGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.03, 12);
    speedoGeo.rotateX(0.45);
    const speedoMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.35,
      roughness: 0.2
    });
    const speedoMesh = new THREE.Mesh(speedoGeo, speedoMat);
    speedoMesh.position.set(0, 1.09, 0.04);
    this.steerGroup.add(speedoMesh);

    // Actual 3D Spotlight throwing light forward onto road
    this.headlightLight = new THREE.SpotLight(0xfef08a, 4.5, 40, Math.PI / 5, 0.45);
    this.headlightLight.position.set(0, 0.98, -0.08);
    this.headlightLight.target.position.set(0, 0, -18);
    this.steerGroup.add(this.headlightLight);
    this.steerGroup.add(this.headlightLight.target);

    this.chassisGroup.add(this.steerGroup);

    // 7. Ruby Red Taillight
    const tailGeo = new THREE.CylinderGeometry(0.065, 0.065, 0.05, 12);
    tailGeo.rotateX(Math.PI / 2);
    const tailMat = new THREE.MeshStandardMaterial({
      color: 0xdc2626,
      emissive: 0xdc2626,
      emissiveIntensity: 0.4
    });
    this.brakeLightMesh = new THREE.Mesh(tailGeo, tailMat);
    this.brakeLightMesh.position.set(0, 0.55, 0.82);
    this.chassisGroup.add(this.brakeLightMesh);

    // 8. Tubular Chrome Rear Carrier with Spare Wheel
    const carrierGeo = new THREE.BoxGeometry(0.36, 0.03, 0.28);
    const carrierMesh = new THREE.Mesh(carrierGeo, chromeMat);
    carrierMesh.position.set(0, 0.65, 0.88);
    this.chassisGroup.add(carrierMesh);

    // Mounted Spare Tire
    const spareMesh = new THREE.Mesh(wheelGeo, rubberMat);
    spareMesh.scale.set(0.85, 0.85, 0.85);
    spareMesh.position.set(0, 0.78, 0.85);
    this.chassisGroup.add(spareMesh);

    // 9. Chrome Exhaust Pipe
    const exhaustGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.55, 8);
    exhaustGeo.rotateX(Math.PI / 2);
    const exhaustMesh = new THREE.Mesh(exhaustGeo, chromeMat);
    exhaustMesh.position.set(-0.25, 0.18, 0.55);
    this.chassisGroup.add(exhaustMesh);

    // 10. Yellow WB Registration Plate
    const plateGeo = new THREE.BoxGeometry(0.24, 0.08, 0.02);
    const plateMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.5 });
    const plateMesh = new THREE.Mesh(plateGeo, plateMat);
    plateMesh.position.set(0, 0.35, 0.85);
    this.chassisGroup.add(plateMesh);

    // 11. Rear Tire Water Spray Mesh
    const sprayGeo = new THREE.ConeGeometry(0.32, 1.3, 8);
    sprayGeo.rotateX(-Math.PI / 2);
    const sprayMat = new THREE.MeshBasicMaterial({
      color: 0x93c5fd,
      transparent: true,
      opacity: 0.45,
      wireframe: true
    });
    this.waterSprayMesh = new THREE.Mesh(sprayGeo, sprayMat);
    this.waterSprayMesh.position.set(0, 0.1, 1.1);
    this.waterSprayMesh.visible = false;
    this.chassisGroup.add(this.waterSprayMesh);

    // 12. Exhaust Smoke Puff Mesh
    const smokeGeo = new THREE.SphereGeometry(0.18, 8, 8);
    const smokeMat = new THREE.MeshBasicMaterial({ color: 0x94a3b8, transparent: true, opacity: 0.7 });
    this.exhaustSmokeMesh = new THREE.Mesh(smokeGeo, smokeMat);
    this.exhaustSmokeMesh.position.set(-0.25, 0.22, 0.95);
    this.exhaustSmokeMesh.visible = false;
    this.chassisGroup.add(this.exhaustSmokeMesh);
  }

  private build3DRider(): void {
    const raincoatMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15, // Bright Canary Yellow
      roughness: 0.35,
      metalness: 0.05
    });

    const helmetMat = new THREE.MeshStandardMaterial({
      color: 0x09090b, // Glossy Black Retro Helmet
      roughness: 0.15,
      metalness: 0.35
    });

    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.15,
      metalness: 0.85
    });

    const visorMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.1,
      metalness: 0.9,
      transparent: true,
      opacity: 0.65
    });

    const jeanMat = new THREE.MeshStandardMaterial({
      color: 0x1e3a8a, // Denim Blue Trousers
      roughness: 0.75
    });

    const shoeMat = new THREE.MeshStandardMaterial({
      color: 0x713f12, // Brown Shoes
      roughness: 0.6
    });

    const backpackMat = new THREE.MeshStandardMaterial({
      color: 0x18181b, // Black Backpack
      roughness: 0.8
    });

    // 1. Torso / Raincoat Body
    const torsoGeo = new THREE.BoxGeometry(0.42, 0.52, 0.28);
    const torsoMesh = new THREE.Mesh(torsoGeo, raincoatMat);
    torsoMesh.position.set(0, 1.15, 0.25);
    torsoMesh.rotation.x = -0.15; // Natural lean forward to handlebar
    torsoMesh.castShadow = true;
    this.chassisGroup.add(torsoMesh);

    // Dark Raincoat Front Storm-Flap & Zipper
    const zipperMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.6 });
    const zipperGeo = new THREE.BoxGeometry(0.04, 0.48, 0.02);
    const zipperMesh = new THREE.Mesh(zipperGeo, zipperMat);
    zipperMesh.position.set(0, 1.15, 0.105);
    zipperMesh.rotation.x = -0.15;
    this.chassisGroup.add(zipperMesh);

    // Black Backpack on Back
    const packGeo = new THREE.BoxGeometry(0.32, 0.38, 0.18);
    const packMesh = new THREE.Mesh(packGeo, backpackMat);
    packMesh.position.set(0, 1.18, 0.42);
    packMesh.rotation.x = -0.15;
    packMesh.castShadow = true;
    this.chassisGroup.add(packMesh);

    // Backpack Shoulder Harness Straps over chest
    const strapGeo = new THREE.BoxGeometry(0.05, 0.44, 0.02);
    for (const sx of [-0.14, 0.14]) {
      const strap = new THREE.Mesh(strapGeo, backpackMat);
      strap.position.set(sx, 1.16, 0.11);
      strap.rotation.x = -0.15;
      this.chassisGroup.add(strap);
    }

    // 2. Retro Helmet & Head
    const helmetGeo = new THREE.SphereGeometry(0.18, 16, 14);
    const helmetMesh = new THREE.Mesh(helmetGeo, helmetMat);
    helmetMesh.position.set(0, 1.58, 0.16);
    helmetMesh.castShadow = true;
    this.chassisGroup.add(helmetMesh);

    // Helmet Classic Racing Stripe (White centerline stripe)
    const stripeGeo = new THREE.BoxGeometry(0.04, 0.38, 0.38);
    const stripeMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2 });
    const stripeMesh = new THREE.Mesh(stripeGeo, stripeMat);
    stripeMesh.position.set(0, 1.58, 0.16);
    this.chassisGroup.add(stripeMesh);

    // Helmet Side Pivot Chrome Screws
    for (const px of [-0.185, 0.185]) {
      const pivotGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.015, 8);
      pivotGeo.rotateZ(Math.PI / 2);
      const pivot = new THREE.Mesh(pivotGeo, chromeMat);
      pivot.position.set(px, 1.57, 0.14);
      this.chassisGroup.add(pivot);
    }

    // Helmet Front Visor
    const visorGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.08, 12, 1, true, -Math.PI / 3, (2 * Math.PI) / 3);
    const visorMesh = new THREE.Mesh(visorGeo, visorMat);
    visorMesh.position.set(0, 1.57, 0.12);
    this.chassisGroup.add(visorMesh);

    // Raincoat Hood Collar
    const collarGeo = new THREE.TorusGeometry(0.14, 0.045, 8, 16);
    collarGeo.rotateX(Math.PI / 2);
    const collarMesh = new THREE.Mesh(collarGeo, raincoatMat);
    collarMesh.position.set(0, 1.42, 0.2);
    this.chassisGroup.add(collarMesh);

    // 3. Arms Gripping Handlebars
    const armGeo = new THREE.CylinderGeometry(0.065, 0.055, 0.48, 8);

    // Left Arm
    const leftArm = new THREE.Mesh(armGeo, raincoatMat);
    leftArm.position.set(-0.25, 1.18, 0.08);
    leftArm.rotation.set(-0.9, -0.2, 0.35);
    leftArm.castShadow = true;
    this.chassisGroup.add(leftArm);

    // Right Arm
    const rightArm = new THREE.Mesh(armGeo, raincoatMat);
    rightArm.position.set(0.25, 1.18, 0.08);
    rightArm.rotation.set(-0.9, 0.2, -0.35);
    rightArm.castShadow = true;
    this.chassisGroup.add(rightArm);

    // 4. Legs / Thighs Resting on Footboard
    const thighGeo = new THREE.BoxGeometry(0.14, 0.14, 0.42);
    const leftThigh = new THREE.Mesh(thighGeo, jeanMat);
    leftThigh.position.set(-0.18, 0.68, 0.12);
    leftThigh.castShadow = true;
    this.chassisGroup.add(leftThigh);

    const rightThigh = new THREE.Mesh(thighGeo, jeanMat);
    rightThigh.position.set(0.18, 0.68, 0.12);
    rightThigh.castShadow = true;
    this.chassisGroup.add(rightThigh);

    // Lower Legs
    const calfGeo = new THREE.BoxGeometry(0.12, 0.38, 0.14);
    const leftCalf = new THREE.Mesh(calfGeo, jeanMat);
    leftCalf.position.set(-0.19, 0.44, -0.12);
    this.chassisGroup.add(leftCalf);

    const rightCalf = new THREE.Mesh(calfGeo, jeanMat);
    rightCalf.position.set(0.19, 0.44, -0.12);
    this.chassisGroup.add(rightCalf);

    // Brown Shoes on Footboard
    const shoeGeo = new THREE.BoxGeometry(0.11, 0.08, 0.24);
    const leftShoe = new THREE.Mesh(shoeGeo, shoeMat);
    leftShoe.position.set(-0.19, 0.32, -0.18);
    this.chassisGroup.add(leftShoe);

    const rightShoe = new THREE.Mesh(shoeGeo, shoeMat);
    rightShoe.position.set(0.19, 0.32, -0.18);
    this.chassisGroup.add(rightShoe);
  }

  /**
   * Main driving physics update: Accelerates, brakes, steers, leans, and jumps in 3D
   */
  public update(
    input: { steerLeft: boolean; steerRight: boolean; accelerate: boolean; brake: boolean; jump: boolean },
    waterDepth: number,
    dt: number
  ): void {
    const audio = AudioManager.getInstance();

    // 1. Water Depth Resistance Modifiers
    const waterConfig = PHYSICS_CONFIG.WATER_EFFECTS[waterDepth as keyof typeof PHYSICS_CONFIG.WATER_EFFECTS] || PHYSICS_CONFIG.WATER_EFFECTS[1];
    let effectiveMaxSpeed = PHYSICS_CONFIG.MAX_SPEED * waterConfig.dragFactor;

    // 2. Silencer Exhaust Flooding Mechanics
    if (!this.isAirborne) {
      if (!input.accelerate || this.currentSpeedKmh < 10) {
        // Water enters low Chetak exhaust pipe!
        this.exhaustWaterLevel = Math.min(100, this.exhaustWaterLevel + 22.0 * dt);
      } else {
        // Pinning full throttle blows water out of silencer!
        this.exhaustWaterLevel = Math.max(0, this.exhaustWaterLevel - 38.0 * dt);
      }
    }

    // Sputtering behavior when silencer is > 40% flooded
    if (this.exhaustWaterLevel > 40) {
      this.sputterTimer -= dt;
      if (this.sputterTimer <= 0) {
        audio.playEngineSputter();
        this.sputterTimer = 0.28;
        this.exhaustSmokeMesh.visible = true;
        this.exhaustSmokeMesh.scale.set(1.1, 1.1, 1.1);
      }
      // Severely choke top speed if exhaust is full of water
      effectiveMaxSpeed *= Math.max(0.25, 1 - (this.exhaustWaterLevel - 40) / 70);
    }

    if (this.exhaustSmokeMesh.visible) {
      const s = this.exhaustSmokeMesh.scale.x;
      if (s > 0.1) {
        this.exhaustSmokeMesh.scale.set(s - 2.5 * dt, s - 2.5 * dt, s - 2.5 * dt);
      } else {
        this.exhaustSmokeMesh.visible = false;
      }
    }

    // 3. Acceleration & Braking Dynamics
    const isAccelerating = input.accelerate && !this.isAirborne;
    const isBraking = input.brake && !this.isAirborne;

    if (isAccelerating) {
      this.currentSpeedKmh = Math.min(
        effectiveMaxSpeed,
        this.currentSpeedKmh + PHYSICS_CONFIG.ACCELERATION_RATE * waterConfig.accelFactor * dt
      );
    } else if (isBraking) {
      this.currentSpeedKmh = Math.max(0, this.currentSpeedKmh - PHYSICS_CONFIG.BRAKING_RATE * dt);
    } else {
      // Natural rolling deceleration towards 0 km/h
      if (this.currentSpeedKmh > 0) {
        this.currentSpeedKmh = Math.max(0, this.currentSpeedKmh - PHYSICS_CONFIG.NATURAL_DECEL_RATE * dt);
      }
    }

    // Update procedural audio engine
    audio.updateEngine(this.currentSpeedKmh, isAccelerating);

    // Brake Light visual toggle
    if (this.brakeLightMesh.material instanceof THREE.MeshStandardMaterial) {
      this.brakeLightMesh.material.emissiveIntensity = isBraking ? 1.8 : 0.35;
    }

    // 3. 3D Steering, Wheel Turn & Motorcycle Lean
    const steerSpeed = 7.5 * dt; // Responsive, snappy arcade steering!
    const maxRoadX = 5.0; // 12m Road Width (-6m to +6m), safely keeps wheels on asphalt

    let targetLean = 0;
    let targetSteer = 0;

    if (input.steerLeft) {
      this.position.x = Math.max(-maxRoadX, this.position.x - steerSpeed * Math.max(0.6, this.currentSpeedKmh / 30));
      targetLean = THREE.MathUtils.degToRad(PHYSICS_CONFIG.MAX_LEAN_ANGLE);
      targetSteer = THREE.MathUtils.degToRad(18);
    } else if (input.steerRight) {
      this.position.x = Math.min(maxRoadX, this.position.x + steerSpeed * Math.max(0.6, this.currentSpeedKmh / 30));
      targetLean = -THREE.MathUtils.degToRad(PHYSICS_CONFIG.MAX_LEAN_ANGLE);
      targetSteer = -THREE.MathUtils.degToRad(18);
    } else {
      // No input: Maintain steady lateral trajectory without sideways drift!
      targetLean = 0;
      targetSteer = 0;
    }

    // Smoothly interpolate lean and handlebar steering angles
    this.leanAngle = THREE.MathUtils.lerp(this.leanAngle, targetLean, 12.0 * dt);
    this.steerAngle = THREE.MathUtils.lerp(this.steerAngle, targetSteer, 14.0 * dt);

    // Apply lean only to scooter and rider group (HORIZON REMAINS LEVEL!)
    this.chassisGroup.rotation.z = this.leanAngle;
    this.steerGroup.rotation.y = this.steerAngle;

    // 4. Forward Movement along Road (-Z direction) — SYNCHRONIZED IN SAME STEP!
    const speedMps = (this.currentSpeedKmh * 1000) / 3600;
    this.position.z -= speedMps * dt;

    // Physical 3D Wheel Rotation based on forward speed
    const angularVelocity = speedMps / this.wheelRadius;
    this.wheelRotation -= angularVelocity * dt;

    this.frontWheelMesh.rotation.x = this.wheelRotation;
    this.rearWheelMesh.rotation.x = this.wheelRotation;

    // Water Spray Effect behind rear wheel
    if (this.currentSpeedKmh > 12 && !this.isAirborne) {
      this.waterSprayMesh.visible = true;
      const s = Math.min(1.4, this.currentSpeedKmh / 45);
      this.waterSprayMesh.scale.set(s, s, s);
    } else {
      this.waterSprayMesh.visible = false;
    }

    // 5. Jump Physics in 3D Y-Space
    if (this.jumpCooldownTimer > 0) this.jumpCooldownTimer -= dt;

    if (input.jump && !this.isAirborne && this.jumpCooldownTimer <= 0) {
      this.isAirborne = true;
      this.jumpVelocityY = 6.8; // 6.8 m/s upward jump velocity
      this.jumpCooldownTimer = PHYSICS_CONFIG.JUMP_COOLDOWN;
      audio.playJump();
    }

    if (this.isAirborne) {
      this.jumpHeight += this.jumpVelocityY * dt;
      this.jumpVelocityY -= 18.5 * dt; // Gravity: 18.5 m/s^2

      if (this.jumpHeight <= 0) {
        // Landing impact!
        this.jumpHeight = 0;
        this.isAirborne = false;
        this.landingSquashTimer = 0.18;
        audio.playLanding();
      }
    }

    // Suspension compression squash
    let suspensionY = 0;
    if (this.landingSquashTimer > 0) {
      this.landingSquashTimer -= dt;
      suspensionY = -0.08; // Suspension compressed
    }

    // 6. Update Final 3D Position — MESH IS 100% SYNCHRONIZED!
    this.mesh.position.set(this.position.x, this.jumpHeight + suspensionY, this.position.z);
  }
}
