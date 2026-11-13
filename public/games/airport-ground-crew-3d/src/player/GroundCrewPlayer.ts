import * as THREE from 'three';
import { InputVector } from '../game/InputManager';

export class GroundCrewPlayer {
  public mesh: THREE.Group;
  public velocity: THREE.Vector3 = new THREE.Vector3();
  public isMarshalling: boolean = false;
  public marshallingSignal: 'straight' | 'stop' | 'turn_left' | 'turn_right' = 'straight';

  // Animation nodes
  private leftLeg: THREE.Group;
  private rightLeg: THREE.Group;
  private leftArm: THREE.Group;
  private rightArm: THREE.Group;
  private torso: THREE.Mesh;
  private leftWand: THREE.Mesh;
  private rightWand: THREE.Mesh;

  private walkCycle: number = 0;
  private speed: number = 5.8; // m/s (~21 km/h brisk jog)
  private rotationSpeed: number = 14.0;

  constructor(scene: THREE.Scene) {
    this.mesh = new THREE.Group();
    const { leftLeg, rightLeg, leftArm, rightArm, torso, leftWand, rightWand } = this.buildModel();
    this.leftLeg = leftLeg;
    this.rightLeg = rightLeg;
    this.leftArm = leftArm;
    this.rightArm = rightArm;
    this.torso = torso;
    this.leftWand = leftWand;
    this.rightWand = rightWand;

    // Spawn near garage facing the airport apron (rotation Math.PI)
    this.mesh.position.set(0, 0, 42);
    this.mesh.rotation.y = Math.PI;
    scene.add(this.mesh);
  }

  private buildModel() {
    // Materials
    const skinMat = new THREE.MeshLambertMaterial({ color: 0xffdbac });
    const navyMat = new THREE.MeshLambertMaterial({ color: 0x1e3799 });
    const vestMat = new THREE.MeshStandardMaterial({
      color: 0xf1c40f,
      roughness: 0.3,
      emissive: 0x7f6000,
      emissiveIntensity: 0.2
    });
    const stripeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const helmetMat = new THREE.MeshStandardMaterial({ color: 0xf39c12, roughness: 0.2 });
    const bootMat = new THREE.MeshLambertMaterial({ color: 0x2d3436 });
    const wandMat = new THREE.MeshBasicMaterial({ color: 0xff7675 }); // Glowing orange marshalling wand

    // Torso / Body
    const torsoGeo = new THREE.BoxGeometry(0.5, 0.65, 0.28);
    const torso = new THREE.Mesh(torsoGeo, navyMat);
    torso.position.y = 1.05;
    torso.castShadow = true;
    this.mesh.add(torso);

    // Hi-Vis Safety Vest
    const vestGeo = new THREE.BoxGeometry(0.52, 0.5, 0.3);
    const vest = new THREE.Mesh(vestGeo, vestMat);
    vest.position.set(0, 0.05, 0);
    torso.add(vest);

    // Reflective stripes on vest
    const stripeF = new THREE.Mesh(new THREE.PlaneGeometry(0.48, 0.08), stripeMat);
    stripeF.position.set(0, 0.05, 0.155);
    vest.add(stripeF);

    const stripeB = new THREE.Mesh(new THREE.PlaneGeometry(0.48, 0.08), stripeMat);
    stripeB.position.set(0, 0.05, -0.155);
    stripeB.rotation.y = Math.PI;
    vest.add(stripeB);

    // Head & Helmet
    const headGeo = new THREE.BoxGeometry(0.26, 0.28, 0.26);
    const head = new THREE.Mesh(headGeo, skinMat);
    head.position.set(0, 0.5, 0);
    torso.add(head);

    // Safety Hardhat
    const helmetGeo = new THREE.SphereGeometry(0.2, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2);
    const helmet = new THREE.Mesh(helmetGeo, helmetMat);
    helmet.position.set(0, 0.12, 0);
    head.add(helmet);

    // Helmet brim
    const brimGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.03, 12);
    const brim = new THREE.Mesh(brimGeo, helmetMat);
    brim.position.set(0, 0.1, 0);
    head.add(brim);

    // Earmuffs
    const earGeo = new THREE.BoxGeometry(0.08, 0.12, 0.08);
    const earL = new THREE.Mesh(earGeo, bootMat);
    earL.position.set(0.15, 0.02, 0);
    head.add(earL);
    const earR = new THREE.Mesh(earGeo, bootMat);
    earR.position.set(-0.15, 0.02, 0);
    head.add(earR);

    // Legs
    const buildLeg = (posX: number) => {
      const legGroup = new THREE.Group();
      legGroup.position.set(posX, 0.75, 0);

      // Thigh & Shin
      const legGeo = new THREE.BoxGeometry(0.18, 0.7, 0.18);
      const leg = new THREE.Mesh(legGeo, navyMat);
      leg.position.y = -0.35;
      leg.castShadow = true;
      legGroup.add(leg);

      // Boot
      const bootGeo = new THREE.BoxGeometry(0.2, 0.15, 0.26);
      const boot = new THREE.Mesh(bootGeo, bootMat);
      boot.position.set(0, -0.68, 0.04);
      legGroup.add(boot);

      this.mesh.add(legGroup);
      return legGroup;
    };

    const leftLeg = buildLeg(0.15);
    const rightLeg = buildLeg(-0.15);

    // Arms & Marshalling wands
    const buildArm = (posX: number) => {
      const armGroup = new THREE.Group();
      armGroup.position.set(posX, 1.3, 0);

      const armGeo = new THREE.BoxGeometry(0.14, 0.55, 0.14);
      const arm = new THREE.Mesh(armGeo, navyMat);
      arm.position.y = -0.25;
      arm.castShadow = true;
      armGroup.add(arm);

      // Hand
      const handGeo = new THREE.BoxGeometry(0.12, 0.12, 0.12);
      const hand = new THREE.Mesh(handGeo, skinMat);
      hand.position.y = -0.55;
      armGroup.add(hand);

      // Marshalling Wand (glowing orange stick)
      const wandGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.45, 8);
      const wand = new THREE.Mesh(wandGeo, wandMat);
      wand.position.set(0, -0.7, 0.1);
      wand.rotation.x = Math.PI / 4;
      wand.visible = false;
      armGroup.add(wand);

      this.mesh.add(armGroup);
      return { armGroup, wand };
    };

    const leftArmData = buildArm(0.35);
    const rightArmData = buildArm(-0.35);

    return {
      leftLeg,
      rightLeg,
      leftArm: leftArmData.armGroup,
      rightArm: rightArmData.armGroup,
      torso,
      leftWand: leftArmData.wand,
      rightWand: rightArmData.wand
    };
  }

  public setMarshallingMode(active: boolean) {
    this.isMarshalling = active;
    this.leftWand.visible = active;
    this.rightWand.visible = active;
    if (active) {
      this.mesh.rotation.y = 0; // Face the oncoming aircraft at -Z
      this.velocity.set(0, 0, 0);
    }
  }

  public update(moveInput: InputVector, delta: number) {
    if (this.isMarshalling) {
      this.updateMarshallingAnim(delta);
      return;
    }

    // Walk physics
    const isMoving = Math.abs(moveInput.x) > 0.05 || Math.abs(moveInput.y) > 0.05;

    if (isMoving) {
      // Calculate target angle based on input (x = left/right, y = back/front)
      // W (y=1): faces -Z (Math.PI)
      // S (y=-1): faces +Z (0)
      // D (x=1): faces +X (Math.PI / 2)
      // A (x=-1): faces -X (-Math.PI / 2)
      const targetAngle = Math.atan2(moveInput.x, -moveInput.y);

      // Smooth rotation towards target angle
      let diff = targetAngle - this.mesh.rotation.y;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      this.mesh.rotation.y += diff * Math.min(1, this.rotationSpeed * delta);

      // Move forward along facing direction
      const inputMag = Math.min(1, Math.sqrt(moveInput.x * moveInput.x + moveInput.y * moveInput.y));
      const moveDistance = this.speed * inputMag * delta;

      const forwardX = Math.sin(this.mesh.rotation.y) * moveDistance;
      const forwardZ = Math.cos(this.mesh.rotation.y) * moveDistance;

      this.mesh.position.x += forwardX;
      this.mesh.position.z += forwardZ;

      // Animate walk cycle
      this.walkCycle += delta * 10.0;
      const legAngle = Math.sin(this.walkCycle) * 0.65;
      this.leftLeg.rotation.x = legAngle;
      this.rightLeg.rotation.x = -legAngle;

      this.leftArm.rotation.x = -legAngle * 0.7;
      this.rightArm.rotation.x = legAngle * 0.7;

      // Torso bobbing
      this.torso.position.y = 1.05 + Math.abs(Math.sin(this.walkCycle * 2)) * 0.04;
    } else {
      // Idle pose lerp back to 0
      this.leftLeg.rotation.x *= 0.85;
      this.rightLeg.rotation.x *= 0.85;
      this.leftArm.rotation.x *= 0.85;
      this.rightArm.rotation.x *= 0.85;
      this.torso.position.y = 1.05;
    }

    // Boundary constraints
    this.mesh.position.x = Math.max(-90, Math.min(90, this.mesh.position.x));
    this.mesh.position.z = Math.max(-60, Math.min(65, this.mesh.position.z));
    this.mesh.position.y = 0;
  }

  private updateMarshallingAnim(delta: number) {
    this.walkCycle += delta * 4;

    if (this.marshallingSignal === 'stop') {
      // Cross wands overhead (EMERGENCY STOP)
      this.leftArm.rotation.z = -2.2;
      this.leftArm.rotation.x = 0;
      this.rightArm.rotation.z = 2.2;
      this.rightArm.rotation.x = 0;
    } else {
      // Come-ahead beckoning gesture: both wands waving up and back toward shoulders
      const wave = (Math.sin(this.walkCycle) + 1) * 0.5;
      this.leftArm.rotation.x = -1.2 - wave * 0.8;
      this.leftArm.rotation.z = -0.3;
      this.rightArm.rotation.x = -1.2 - wave * 0.8;
      this.rightArm.rotation.z = 0.3;
    }
  }

  public getPosition(): THREE.Vector3 {
    return this.mesh.position;
  }

  public setPosition(x: number, y: number, z: number, rotationY: number = Math.PI) {
    this.mesh.position.set(x, y, z);
    this.mesh.rotation.y = rotationY;
    this.walkCycle = 0;
  }
}
