import * as THREE from 'three';
import { CharacterCustomizationConfig, DEFAULT_MP_CUSTOMIZATION } from './CharacterCustomization';

export interface CharacterBones {
  root: THREE.Group;
  pelvis: THREE.Group;
  spine: THREE.Group;
  chest: THREE.Group;
  neck: THREE.Group;
  head: THREE.Group;
  leftShoulder: THREE.Group;
  leftUpperArm: THREE.Group;
  leftForearm: THREE.Group;
  leftHand: THREE.Group;
  rightShoulder: THREE.Group;
  rightUpperArm: THREE.Group;
  rightForearm: THREE.Group;
  rightHand: THREE.Group;
  leftHip: THREE.Group;
  leftThigh: THREE.Group;
  leftKnee: THREE.Group;
  leftShin: THREE.Group;
  leftFoot: THREE.Group;
  rightHip: THREE.Group;
  rightThigh: THREE.Group;
  rightKnee: THREE.Group;
  rightShin: THREE.Group;
  rightFoot: THREE.Group;
}

export class PlayerCharacter {
  public group: THREE.Group;
  public bones!: CharacterBones;
  public config: CharacterCustomizationConfig;

  // Tracked meshes for customization
  private jacketMesh: THREE.Mesh | null = null;
  private collarMesh: THREE.Mesh | null = null;
  private kurtaSkirtMesh: THREE.Mesh | null = null;
  private hairMesh: THREE.Mesh | null = null;
  private hatMesh: THREE.Mesh | null = null;
  private glassesGroup: THREE.Group | null = null;
  private stoleGroup: THREE.Group | null = null;
  private badgeMesh: THREE.Mesh | null = null;

  // Cached materials
  private skinMaterial!: THREE.MeshStandardMaterial;
  private jacketMaterial!: THREE.MeshStandardMaterial;
  private kurtaMaterial!: THREE.MeshStandardMaterial;
  private trouserMaterial!: THREE.MeshStandardMaterial;
  private shoeMaterial!: THREE.MeshStandardMaterial;
  private hairMaterial!: THREE.MeshStandardMaterial;
  private goldMaterial!: THREE.MeshStandardMaterial;

  constructor(config: CharacterCustomizationConfig = DEFAULT_MP_CUSTOMIZATION) {
    this.config = { ...config };
    this.group = new THREE.Group();
    this.group.name = 'PlayerCharacter';

    this.initMaterials();
    this.buildSkeleton();
    this.buildGeometry();
    this.applyCustomization(this.config);
  }

  private initMaterials(): void {
    this.skinMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(this.config.skinTone),
      roughness: 0.75,
      metalness: 0.05,
    });

    this.jacketMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(this.config.jacketColor),
      roughness: 0.65,
      metalness: 0.1,
    });

    this.kurtaMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(this.config.kurtaColor),
      roughness: 0.85,
      metalness: 0.0,
    });

    this.trouserMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(this.config.trouserColor),
      roughness: 0.85,
      metalness: 0.0,
    });

    this.shoeMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(this.config.shoeColor),
      roughness: 0.35,
      metalness: 0.2,
    });

    this.hairMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(this.config.hairColor),
      roughness: 0.9,
      metalness: 0.0,
    });

    this.goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.3,
      metalness: 0.8,
    });
  }

  private buildSkeleton(): void {
    // 1. Root
    const root = new THREE.Group();
    root.name = 'Root';
    this.group.add(root);

    // 2. Pelvis (height ~0.92m)
    const pelvis = new THREE.Group();
    pelvis.name = 'Pelvis';
    pelvis.position.set(0, 0.92, 0);
    root.add(pelvis);

    // 3. Spine (~0.16m above pelvis)
    const spine = new THREE.Group();
    spine.name = 'Spine';
    spine.position.set(0, 0.16, 0);
    pelvis.add(spine);

    // 4. Chest (~0.24m above spine)
    const chest = new THREE.Group();
    chest.name = 'Chest';
    chest.position.set(0, 0.24, 0);
    spine.add(chest);

    // 5. Neck (~0.20m above chest)
    const neck = new THREE.Group();
    neck.name = 'Neck';
    neck.position.set(0, 0.20, 0);
    chest.add(neck);

    // 6. Head (~0.10m above neck)
    const head = new THREE.Group();
    head.name = 'Head';
    head.position.set(0, 0.10, 0);
    neck.add(head);

    // 7. Shoulders & Arms
    const shoulderWidth = 0.24;
    const upperArmLength = 0.28;
    const forearmLength = 0.26;

    // Left Arm
    const leftShoulder = new THREE.Group();
    leftShoulder.name = 'LeftShoulder';
    leftShoulder.position.set(-shoulderWidth, 0.14, 0);
    chest.add(leftShoulder);

    const leftUpperArm = new THREE.Group();
    leftUpperArm.name = 'LeftUpperArm';
    leftShoulder.add(leftUpperArm);

    const leftForearm = new THREE.Group();
    leftForearm.name = 'LeftForearm';
    leftForearm.position.set(0, -upperArmLength, 0);
    leftUpperArm.add(leftForearm);

    const leftHand = new THREE.Group();
    leftHand.name = 'LeftHand';
    leftHand.position.set(0, -forearmLength, 0);
    leftForearm.add(leftHand);

    // Right Arm
    const rightShoulder = new THREE.Group();
    rightShoulder.name = 'RightShoulder';
    rightShoulder.position.set(shoulderWidth, 0.14, 0);
    chest.add(rightShoulder);

    const rightUpperArm = new THREE.Group();
    rightUpperArm.name = 'RightUpperArm';
    rightShoulder.add(rightUpperArm);

    const rightForearm = new THREE.Group();
    rightForearm.name = 'RightForearm';
    rightForearm.position.set(0, -upperArmLength, 0);
    rightUpperArm.add(rightForearm);

    const rightHand = new THREE.Group();
    rightHand.name = 'RightHand';
    rightHand.position.set(0, -forearmLength, 0);
    rightForearm.add(rightHand);

    // 8. Hips & Legs
    const hipWidth = 0.13;
    const thighLength = 0.44;
    const shinLength = 0.42;

    // Left Leg
    const leftHip = new THREE.Group();
    leftHip.name = 'LeftHip';
    leftHip.position.set(-hipWidth, 0, 0);
    pelvis.add(leftHip);

    const leftThigh = new THREE.Group();
    leftThigh.name = 'LeftThigh';
    leftHip.add(leftThigh);

    const leftKnee = new THREE.Group();
    leftKnee.name = 'LeftKnee';
    leftKnee.position.set(0, -thighLength, 0);
    leftThigh.add(leftKnee);

    const leftShin = new THREE.Group();
    leftShin.name = 'LeftShin';
    leftKnee.add(leftShin);

    const leftFoot = new THREE.Group();
    leftFoot.name = 'LeftFoot';
    leftFoot.position.set(0, -shinLength, 0.04);
    leftShin.add(leftFoot);

    // Right Leg
    const rightHip = new THREE.Group();
    rightHip.name = 'RightHip';
    rightHip.position.set(hipWidth, 0, 0);
    pelvis.add(rightHip);

    const rightThigh = new THREE.Group();
    rightThigh.name = 'RightThigh';
    rightHip.add(rightThigh);

    const rightKnee = new THREE.Group();
    rightKnee.name = 'RightKnee';
    rightKnee.position.set(0, -thighLength, 0);
    rightThigh.add(rightKnee);

    const rightShin = new THREE.Group();
    rightShin.name = 'RightShin';
    rightKnee.add(rightShin);

    const rightFoot = new THREE.Group();
    rightFoot.name = 'RightFoot';
    rightFoot.position.set(0, -shinLength, 0.04);
    rightShin.add(rightFoot);

    this.bones = {
      root,
      pelvis,
      spine,
      chest,
      neck,
      head,
      leftShoulder,
      leftUpperArm,
      leftForearm,
      leftHand,
      rightShoulder,
      rightUpperArm,
      rightForearm,
      rightHand,
      leftHip,
      leftThigh,
      leftKnee,
      leftShin,
      leftFoot,
      rightHip,
      rightThigh,
      rightKnee,
      rightShin,
      rightFoot,
    };
  }

  private buildGeometry(): void {
    // --- PELVIS & LOWER KURTA SKIRT ---
    const pelvisGeo = new THREE.CylinderGeometry(0.18, 0.16, 0.14, 12);
    const pelvisMesh = new THREE.Mesh(pelvisGeo, this.trouserMaterial);
    pelvisMesh.castShadow = true;
    pelvisMesh.receiveShadow = true;
    this.bones.pelvis.add(pelvisMesh);

    // Kurta Skirt (Drapes down from waist over upper thighs)
    const skirtGeo = new THREE.CylinderGeometry(0.19, 0.24, 0.38, 14, 1, true);
    skirtGeo.translate(0, -0.16, 0);
    this.kurtaSkirtMesh = new THREE.Mesh(skirtGeo, this.kurtaMaterial);
    this.kurtaSkirtMesh.castShadow = true;
    this.kurtaSkirtMesh.receiveShadow = true;
    this.bones.pelvis.add(this.kurtaSkirtMesh);

    // --- SPINE & TORSO ---
    const spineGeo = new THREE.CylinderGeometry(0.19, 0.18, 0.18, 12);
    const spineMesh = new THREE.Mesh(spineGeo, this.kurtaMaterial);
    spineMesh.castShadow = true;
    spineMesh.receiveShadow = true;
    this.bones.spine.add(spineMesh);

    // --- CHEST & NEHRU JACKET ---
    const chestGeo = new THREE.CylinderGeometry(0.23, 0.20, 0.28, 14);
    this.jacketMesh = new THREE.Mesh(chestGeo, this.jacketMaterial);
    this.jacketMesh.castShadow = true;
    this.jacketMesh.receiveShadow = true;
    this.bones.chest.add(this.jacketMesh);

    // Mandarin Collar (Nehru Jacket signature standing collar)
    const collarGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.07, 14);
    collarGeo.translate(0, 0.15, 0);
    this.collarMesh = new THREE.Mesh(collarGeo, this.jacketMaterial);
    this.collarMesh.castShadow = true;
    this.bones.chest.add(this.collarMesh);

    // Brass Jacket Buttons
    const buttonGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.01, 8);
    buttonGeo.rotateX(Math.PI / 2);
    for (let i = 0; i < 4; i++) {
      const buttonMesh = new THREE.Mesh(buttonGeo, this.goldMaterial);
      buttonMesh.position.set(0, 0.08 - i * 0.06, 0.21);
      this.bones.chest.add(buttonMesh);
    }

    // Breast Pocket & Pocket Square (Chamber Elegance)
    const pocketGeo = new THREE.BoxGeometry(0.06, 0.01, 0.02);
    const pocketMesh = new THREE.Mesh(pocketGeo, this.goldMaterial);
    pocketMesh.position.set(-0.11, 0.06, 0.21);
    this.bones.chest.add(pocketMesh);

    // MP Lapel Rosette / Party Badge
    const badgeGeo = new THREE.CylinderGeometry(0.024, 0.024, 0.01, 10);
    badgeGeo.rotateX(Math.PI / 2);
    this.badgeMesh = new THREE.Mesh(badgeGeo, this.goldMaterial);
    this.badgeMesh.position.set(0.10, 0.08, 0.21);
    this.bones.chest.add(this.badgeMesh);

    // --- NECK & HEAD ---
    const neckGeo = new THREE.CylinderGeometry(0.08, 0.09, 0.12, 12);
    const neckMesh = new THREE.Mesh(neckGeo, this.skinMaterial);
    neckMesh.castShadow = true;
    this.bones.neck.add(neckMesh);

    // Stylized Head
    const headGeo = new THREE.SphereGeometry(0.14, 16, 14);
    headGeo.scale(1.0, 1.15, 1.05);
    const headMesh = new THREE.Mesh(headGeo, this.skinMaterial);
    headMesh.castShadow = true;
    headMesh.receiveShadow = true;
    this.bones.head.add(headMesh);

    // Stylized Nose
    const noseGeo = new THREE.ConeGeometry(0.025, 0.05, 8);
    noseGeo.rotateX(-Math.PI / 2);
    const noseMesh = new THREE.Mesh(noseGeo, this.skinMaterial);
    noseMesh.position.set(0, 0.01, 0.15);
    this.bones.head.add(noseMesh);

    // Eyes
    const eyeWhiteGeo = new THREE.SphereGeometry(0.02, 8, 8);
    const eyeWhiteMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const eyePupilGeo = new THREE.SphereGeometry(0.01, 8, 8);
    const eyePupilMat = new THREE.MeshBasicMaterial({ color: 0x111827 });

    [-0.045, 0.045].forEach((x) => {
      const eyeWhite = new THREE.Mesh(eyeWhiteGeo, eyeWhiteMat);
      eyeWhite.position.set(x, 0.04, 0.135);
      const pupil = new THREE.Mesh(eyePupilGeo, eyePupilMat);
      pupil.position.set(x, 0.04, 0.15);
      this.bones.head.add(eyeWhite);
      this.bones.head.add(pupil);
    });

    // Dignified Parliament Mustache
    const mustacheGeo = new THREE.BoxGeometry(0.08, 0.02, 0.02);
    const mustacheMesh = new THREE.Mesh(mustacheGeo, this.hairMaterial);
    mustacheMesh.position.set(0, -0.025, 0.145);
    this.bones.head.add(mustacheMesh);

    // Hair: Stylized Side-Parted Hair
    const hairGeo = new THREE.SphereGeometry(0.148, 14, 12);
    hairGeo.scale(1.03, 0.65, 1.05);
    hairGeo.translate(0, 0.06, -0.01);
    this.hairMesh = new THREE.Mesh(hairGeo, this.hairMaterial);
    this.hairMesh.castShadow = true;
    this.bones.head.add(this.hairMesh);

    // Gandhi Topi Option (Folded White Cap)
    const topiGeo = new THREE.BoxGeometry(0.18, 0.08, 0.22);
    topiGeo.scale(1.0, 0.8, 1.0);
    this.hatMesh = new THREE.Mesh(
      topiGeo,
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.9 })
    );
    this.hatMesh.position.set(0, 0.14, -0.01);
    this.hatMesh.castShadow = true;
    this.hatMesh.visible = false;
    this.bones.head.add(this.hatMesh);

    // Round Wireframe Spectacles
    this.glassesGroup = new THREE.Group();
    const frameMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.8, roughness: 0.3 });
    const lensMat = new THREE.MeshStandardMaterial({
      color: 0x93c5fd,
      transparent: true,
      opacity: 0.4,
      roughness: 0.1,
    });

    [-0.045, 0.045].forEach((x) => {
      const ringGeo = new THREE.TorusGeometry(0.026, 0.004, 8, 16);
      const ringMesh = new THREE.Mesh(ringGeo, frameMat);
      ringMesh.position.set(x, 0.04, 0.155);
      const lensGeo = new THREE.CircleGeometry(0.024, 16);
      const lensMesh = new THREE.Mesh(lensGeo, lensMat);
      lensMesh.position.set(x, 0.04, 0.155);
      this.glassesGroup!.add(ringMesh);
      this.glassesGroup!.add(lensMesh);
    });

    const bridgeGeo = new THREE.CylinderGeometry(0.003, 0.003, 0.03, 8);
    bridgeGeo.rotateZ(Math.PI / 2);
    const bridge = new THREE.Mesh(bridgeGeo, frameMat);
    bridge.position.set(0, 0.042, 0.156);
    this.glassesGroup.add(bridge);
    this.bones.head.add(this.glassesGroup);

    // --- TRADITIONAL SILK STOLE (ANGAVASTRAM) ---
    this.stoleGroup = new THREE.Group();
    const stoleMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(this.config.stoleColor),
      roughness: 0.7,
      metalness: 0.1,
    });

    // Drapes over right shoulder down chest and back
    const stoleFrontGeo = new THREE.BoxGeometry(0.09, 0.45, 0.02);
    stoleFrontGeo.translate(0.12, -0.05, 0.22);
    const stoleFront = new THREE.Mesh(stoleFrontGeo, stoleMat);
    stoleFront.castShadow = true;

    const stoleBackGeo = new THREE.BoxGeometry(0.09, 0.45, 0.02);
    stoleBackGeo.translate(0.12, -0.05, -0.22);
    const stoleBack = new THREE.Mesh(stoleBackGeo, stoleMat);
    stoleBack.castShadow = true;

    const stoleShoulderGeo = new THREE.BoxGeometry(0.09, 0.03, 0.44);
    stoleShoulderGeo.translate(0.12, 0.18, 0);
    const stoleShoulder = new THREE.Mesh(stoleShoulderGeo, stoleMat);
    stoleShoulder.castShadow = true;

    this.stoleGroup.add(stoleFront, stoleBack, stoleShoulder);
    this.bones.chest.add(this.stoleGroup);

    // --- ARMS & HANDS ---
    const buildArm = (upperArm: THREE.Group, forearm: THREE.Group, hand: THREE.Group) => {
      // Upper arm (Kurta sleeve)
      const upperGeo = new THREE.CylinderGeometry(0.065, 0.055, 0.26, 10);
      upperGeo.translate(0, -0.13, 0);
      const upperMesh = new THREE.Mesh(upperGeo, this.kurtaMaterial);
      upperMesh.castShadow = true;
      upperArm.add(upperMesh);

      // Forearm (Kurta sleeve ending at wrist)
      const foreGeo = new THREE.CylinderGeometry(0.055, 0.048, 0.24, 10);
      foreGeo.translate(0, -0.12, 0);
      const foreMesh = new THREE.Mesh(foreGeo, this.kurtaMaterial);
      foreMesh.castShadow = true;
      forearm.add(foreMesh);

      // Stylized Hand
      const palmGeo = new THREE.BoxGeometry(0.065, 0.075, 0.03);
      palmGeo.translate(0, -0.035, 0);
      const palmMesh = new THREE.Mesh(palmGeo, this.skinMaterial);
      palmMesh.castShadow = true;
      hand.add(palmMesh);

      // Thumb
      const thumbGeo = new THREE.CylinderGeometry(0.012, 0.01, 0.035, 6);
      thumbGeo.translate(0.03, -0.02, 0.01);
      const thumbMesh = new THREE.Mesh(thumbGeo, this.skinMaterial);
      hand.add(thumbMesh);
    };

    buildArm(this.bones.leftUpperArm, this.bones.leftForearm, this.bones.leftHand);
    buildArm(this.bones.rightUpperArm, this.bones.rightForearm, this.bones.rightHand);

    // --- LEGS & FEET ---
    const buildLeg = (thigh: THREE.Group, shin: THREE.Group, foot: THREE.Group) => {
      // Thigh (Pajama trouser)
      const thighGeo = new THREE.CylinderGeometry(0.08, 0.065, 0.42, 10);
      thighGeo.translate(0, -0.21, 0);
      const thighMesh = new THREE.Mesh(thighGeo, this.trouserMaterial);
      thighMesh.castShadow = true;
      thigh.add(thighMesh);

      // Shin (Pajama trouser)
      const shinGeo = new THREE.CylinderGeometry(0.065, 0.05, 0.40, 10);
      shinGeo.translate(0, -0.20, 0);
      const shinMesh = new THREE.Mesh(shinGeo, this.trouserMaterial);
      shinMesh.castShadow = true;
      shin.add(shinMesh);

      // Foot (Formal Oxford shoe)
      const shoeGeo = new THREE.BoxGeometry(0.08, 0.06, 0.18);
      shoeGeo.translate(0, -0.03, 0.03);
      const shoeMesh = new THREE.Mesh(shoeGeo, this.shoeMaterial);
      shoeMesh.castShadow = true;
      shoeMesh.receiveShadow = true;
      foot.add(shoeMesh);

      // Shoe Sole
      const soleGeo = new THREE.BoxGeometry(0.084, 0.015, 0.185);
      soleGeo.translate(0, -0.06, 0.03);
      const soleMesh = new THREE.Mesh(
        soleGeo,
        new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.9 })
      );
      foot.add(soleMesh);
    };

    buildLeg(this.bones.leftThigh, this.bones.leftShin, this.bones.leftFoot);
    buildLeg(this.bones.rightThigh, this.bones.rightShin, this.bones.rightFoot);
  }

  public applyCustomization(config: CharacterCustomizationConfig): void {
    this.config = { ...config };

    this.skinMaterial.color.set(config.skinTone);
    this.jacketMaterial.color.set(config.jacketColor);
    this.kurtaMaterial.color.set(config.kurtaColor);
    this.trouserMaterial.color.set(config.trouserColor);
    this.shoeMaterial.color.set(config.shoeColor);
    this.hairMaterial.color.set(config.hairColor);

    if (this.hairMesh) this.hairMesh.visible = config.hairStyle !== 'GANDHI_TOPI';
    if (this.hatMesh) this.hatMesh.visible = config.hairStyle === 'GANDHI_TOPI';
    if (this.glassesGroup) this.glassesGroup.visible = config.glasses;
    if (this.stoleGroup) this.stoleGroup.visible = config.stole;
    if (this.badgeMesh) this.badgeMesh.visible = config.partyBadge;
  }

  public dispose(): void {
    this.group.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        mesh.geometry.dispose();
      }
    });
    this.skinMaterial.dispose();
    this.jacketMaterial.dispose();
    this.kurtaMaterial.dispose();
    this.trouserMaterial.dispose();
    this.shoeMaterial.dispose();
    this.hairMaterial.dispose();
    this.goldMaterial.dispose();
  }
}
