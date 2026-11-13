import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';
import { PhysicsWorld } from './PhysicsWorld';
import { PlayerCharacter, CharacterBones } from '../character/PlayerCharacter';
import { SoundManager } from '../audio/SoundManager';

export interface RagdollPart {
  name: string;
  body: RAPIER.RigidBody;
  collider: RAPIER.Collider;
  boneGroup: THREE.Group;
  initialLocalOffset: THREE.Vector3;
}

export type RagdollState = 'INACTIVE' | 'FALLING' | 'STABILIZING' | 'RECOVERING';

export class PlayerRagdoll {
  private physicsWorld: PhysicsWorld;
  private character: PlayerCharacter;

  public state: RagdollState = 'INACTIVE';
  public parts: RagdollPart[] = [];
  public joints: RAPIER.ImpulseJoint[] = [];

  // Core references
  public pelvisBody!: RAPIER.RigidBody;
  public chestBody!: RAPIER.RigidBody;
  public headBody!: RAPIER.RigidBody;

  // Recovery tracking
  private stableTimer = 0;
  private recoveryTimer = 0;
  private readonly RECOVERY_DURATION = 0.45;
  private isFaceUp = true;
  private preRecoveryPelvisPos = new THREE.Vector3();

  // Callback when recovery completes
  public onRecoveryComplete?: (newPosition: THREE.Vector3) => void;

  constructor(physicsWorld: PhysicsWorld, character: PlayerCharacter) {
    this.physicsWorld = physicsWorld;
    this.character = character;

    this.buildRagdoll();
    this.setSleeping();
  }

  private buildRagdoll(): void {
    const world = this.physicsWorld.world;
    const bones = this.character.bones;

    // Common collision group for ragdoll limbs:
    // Interacts with Static environment and Props, but not other character controller
    const ragdollFilter = PhysicsWorld.createCollisionFilter(
      PhysicsWorld.GROUP_RAGDOLL,
      PhysicsWorld.GROUP_STATIC | PhysicsWorld.GROUP_PROP
    );

    const createPart = (
      name: string,
      bone: THREE.Group,
      colliderDesc: RAPIER.ColliderDesc,
      mass: number,
      linDamp = 0.6,
      angDamp = 1.2
    ): RagdollPart => {
      const worldPos = new THREE.Vector3();
      bone.getWorldPosition(worldPos);

      const bodyDesc = RAPIER.RigidBodyDesc.dynamic()
        .setTranslation(worldPos.x, worldPos.y, worldPos.z)
        .setLinearDamping(linDamp)
        .setAngularDamping(angDamp)
        .setCanSleep(true);

      const body = world.createRigidBody(bodyDesc);
      colliderDesc.setMass(mass).setCollisionGroups(ragdollFilter);
      const collider = world.createCollider(colliderDesc, body);

      const part: RagdollPart = {
        name,
        body,
        collider,
        boneGroup: bone,
        initialLocalOffset: new THREE.Vector3(),
      };
      this.parts.push(part);
      return part;
    };

    // 1. Pelvis (Center of Mass base)
    const pelvisPart = createPart(
      'pelvis',
      bones.pelvis,
      RAPIER.ColliderDesc.cuboid(0.18, 0.10, 0.14).setFriction(0.8),
      22.0
    );
    this.pelvisBody = pelvisPart.body;

    // 2. Chest / Torso
    const chestPart = createPart(
      'chest',
      bones.chest,
      RAPIER.ColliderDesc.cuboid(0.22, 0.18, 0.16).setFriction(0.6),
      26.0
    );
    this.chestBody = chestPart.body;

    // 3. Head
    const headPart = createPart(
      'head',
      bones.head,
      RAPIER.ColliderDesc.ball(0.15).setFriction(0.5).setRestitution(0.2),
      5.0
    );
    this.headBody = headPart.body;

    // 4. Arms
    const lUpperArm = createPart(
      'leftUpperArm',
      bones.leftUpperArm,
      RAPIER.ColliderDesc.capsule(0.12, 0.065),
      4.0
    );
    const lForearm = createPart(
      'leftForearm',
      bones.leftForearm,
      RAPIER.ColliderDesc.capsule(0.11, 0.055),
      3.0
    );

    const rUpperArm = createPart(
      'rightUpperArm',
      bones.rightUpperArm,
      RAPIER.ColliderDesc.capsule(0.12, 0.065),
      4.0
    );
    const rForearm = createPart(
      'rightForearm',
      bones.rightForearm,
      RAPIER.ColliderDesc.capsule(0.11, 0.055),
      3.0
    );

    // 5. Legs
    const lThigh = createPart(
      'leftThigh',
      bones.leftThigh,
      RAPIER.ColliderDesc.capsule(0.18, 0.075),
      8.0
    );
    const lShin = createPart(
      'leftShin',
      bones.leftShin,
      RAPIER.ColliderDesc.capsule(0.18, 0.065),
      5.0
    );

    const rThigh = createPart(
      'rightThigh',
      bones.rightThigh,
      RAPIER.ColliderDesc.capsule(0.18, 0.075),
      8.0
    );
    const rShin = createPart(
      'rightShin',
      bones.rightShin,
      RAPIER.ColliderDesc.capsule(0.18, 0.065),
      5.0
    );

    // --- CONFIGURE JOINTS ---
    const addJoint = (body1: RAPIER.RigidBody, body2: RAPIER.RigidBody, jointData: RAPIER.JointData) => {
      const joint = world.createImpulseJoint(jointData, body1, body2, true);
      this.joints.push(joint);
    };

    // Spine: Pelvis <-> Chest
    addJoint(
      this.pelvisBody,
      this.chestBody,
      RAPIER.JointData.spherical({ x: 0, y: 0.18, z: 0 }, { x: 0, y: -0.16, z: 0 })
    );

    // Neck: Chest <-> Head
    addJoint(
      this.chestBody,
      this.headBody,
      RAPIER.JointData.spherical({ x: 0, y: 0.22, z: 0 }, { x: 0, y: -0.12, z: 0 })
    );

    // Left Arm: Chest <-> LeftUpperArm <-> LeftForearm
    addJoint(
      this.chestBody,
      lUpperArm.body,
      RAPIER.JointData.spherical({ x: -0.26, y: 0.12, z: 0 }, { x: 0, y: 0.13, z: 0 })
    );
    addJoint(
      lUpperArm.body,
      lForearm.body,
      RAPIER.JointData.revolute({ x: 0, y: -0.14, z: 0 }, { x: 0, y: 0.13, z: 0 }, { x: 1, y: 0, z: 0 })
    );

    // Right Arm: Chest <-> RightUpperArm <-> RightForearm
    addJoint(
      this.chestBody,
      rUpperArm.body,
      RAPIER.JointData.spherical({ x: 0.26, y: 0.12, z: 0 }, { x: 0, y: 0.13, z: 0 })
    );
    addJoint(
      rUpperArm.body,
      rForearm.body,
      RAPIER.JointData.revolute({ x: 0, y: -0.14, z: 0 }, { x: 0, y: 0.13, z: 0 }, { x: 1, y: 0, z: 0 })
    );

    // Left Leg: Pelvis <-> LeftThigh <-> LeftShin
    addJoint(
      this.pelvisBody,
      lThigh.body,
      RAPIER.JointData.spherical({ x: -0.14, y: -0.10, z: 0 }, { x: 0, y: 0.19, z: 0 })
    );
    addJoint(
      lThigh.body,
      lShin.body,
      RAPIER.JointData.revolute({ x: 0, y: -0.20, z: 0 }, { x: 0, y: 0.19, z: 0 }, { x: 1, y: 0, z: 0 })
    );

    // Right Leg: Pelvis <-> RightThigh <-> RightShin
    addJoint(
      this.pelvisBody,
      rThigh.body,
      RAPIER.JointData.spherical({ x: 0.14, y: -0.10, z: 0 }, { x: 0, y: 0.19, z: 0 })
    );
    addJoint(
      rThigh.body,
      rShin.body,
      RAPIER.JointData.revolute({ x: 0, y: -0.20, z: 0 }, { x: 0, y: 0.19, z: 0 }, { x: 1, y: 0, z: 0 })
    );
  }

  public setSleeping(): void {
    for (const part of this.parts) {
      part.body.setBodyType(RAPIER.RigidBodyType.KinematicPositionBased, true);
    }
  }

  public activate(initialImpulse?: THREE.Vector3, angularImpulse?: THREE.Vector3): void {
    if (this.state === 'FALLING' || this.state === 'STABILIZING') return;

    this.state = 'FALLING';
    this.stableTimer = 0;
    this.recoveryTimer = 0;

    SoundManager.playWhoosh();

    // Snap ragdoll bodies to current character bone world transforms
    const worldPos = new THREE.Vector3();
    const worldQuat = new THREE.Quaternion();

    for (const part of this.parts) {
      part.boneGroup.getWorldPosition(worldPos);
      part.boneGroup.getWorldQuaternion(worldQuat);

      part.body.setBodyType(RAPIER.RigidBodyType.Dynamic, true);
      part.body.setTranslation({ x: worldPos.x, y: worldPos.y, z: worldPos.z }, true);
      part.body.setRotation({ x: worldQuat.x, y: worldQuat.y, z: worldQuat.z, w: worldQuat.w }, true);
      part.body.setLinvel({ x: 0, y: 0, z: 0 }, true);
      part.body.setAngvel({ x: 0, y: 0, z: 0 }, true);
    }

    // Apply comedic impulse to chest and pelvis
    const impulse = initialImpulse || new THREE.Vector3((Math.random() - 0.5) * 8, 4.5, -6.0);
    this.chestBody.applyImpulse({ x: impulse.x * 24, y: impulse.y * 20, z: impulse.z * 24 }, true);
    this.pelvisBody.applyImpulse({ x: impulse.x * 18, y: impulse.y * 15, z: impulse.z * 18 }, true);

    const angImp = angularImpulse || new THREE.Vector3(Math.random() * 4, (Math.random() - 0.5) * 6, Math.random() * 4);
    this.chestBody.applyTorqueImpulse({ x: angImp.x * 12, y: angImp.y * 12, z: angImp.z * 12 }, true);
  }

  public update(delta: number): void {
    if (this.state === 'INACTIVE') return;

    if (this.state === 'FALLING' || this.state === 'STABILIZING') {
      // 1. Synchronize Three.js character bones to follow ragdoll rigid body physics
      this.syncBonesFromRagdoll();

      // 2. Check for kinetic energy stabilization
      const linvel = this.pelvisBody.linvel();
      const speedSq = linvel.x * linvel.x + linvel.y * linvel.y + linvel.z * linvel.z;

      if (speedSq < 0.25) {
        this.state = 'STABILIZING';
        this.stableTimer += delta;

        // If stable for 0.75 seconds, initiate recovery get-up
        if (this.stableTimer > 0.75) {
          this.beginRecovery();
        }
      } else {
        this.state = 'FALLING';
        this.stableTimer = 0;
      }
    } else if (this.state === 'RECOVERING') {
      // 3. Smooth recovery transition
      this.recoveryTimer += delta;
      const progress = Math.min(1.0, this.recoveryTimer / this.RECOVERY_DURATION);

      if (progress >= 1.0) {
        this.completeRecovery();
      }
    }
  }

  private syncBonesFromRagdoll(): void {
    // Character root stays fixed at world origin; local bone transforms update to match bodies
    const rootPos = this.character.group.position;
    const invRootQuat = this.character.group.quaternion.clone().invert();

    const bodyPos = new THREE.Vector3();
    const bodyQuat = new THREE.Quaternion();

    for (const part of this.parts) {
      const t = part.body.translation();
      const r = part.body.rotation();

      bodyPos.set(t.x, t.y, t.z).sub(rootPos).applyQuaternion(invRootQuat);
      bodyQuat.set(r.x, r.y, r.z, r.w).premultiply(invRootQuat);

      if (part.name === 'pelvis') {
        part.boneGroup.position.copy(bodyPos);
        part.boneGroup.quaternion.copy(bodyQuat);
      } else {
        // Update rotation for limbs
        part.boneGroup.quaternion.copy(bodyQuat);
      }
    }
  }

  private beginRecovery(): void {
    this.state = 'RECOVERING';
    this.recoveryTimer = 0;

    // Determine face-up vs face-down by checking chest Y orientation
    const chestRot = this.chestBody.rotation();
    const chestQuat = new THREE.Quaternion(chestRot.x, chestRot.y, chestRot.z, chestRot.w);
    const chestUp = new THREE.Vector3(0, 0, 1).applyQuaternion(chestQuat);
    this.isFaceUp = chestUp.y > 0;

    const t = this.pelvisBody.translation();
    this.preRecoveryPelvisPos.set(t.x, t.y, t.z);

    SoundManager.playClick();
  }

  private completeRecovery(): void {
    this.state = 'INACTIVE';
    this.setSleeping();

    // Reset character root to stabilized pelvis X and Z coordinates
    const t = this.pelvisBody.translation();
    const finalRecoveryPos = new THREE.Vector3(t.x, 0.0, t.z);

    // Reset character local root bones to default upright stance
    this.character.bones.pelvis.position.set(0, 0.92, 0);
    this.character.bones.pelvis.rotation.set(0, 0, 0);
    this.character.bones.chest.rotation.set(0, 0, 0);
    this.character.bones.head.rotation.set(0, 0, 0);
    this.character.bones.leftUpperArm.rotation.set(0, 0, 0);
    this.character.bones.rightUpperArm.rotation.set(0, 0, 0);
    this.character.bones.leftThigh.rotation.set(0, 0, 0);
    this.character.bones.rightThigh.rotation.set(0, 0, 0);

    if (this.onRecoveryComplete) {
      this.onRecoveryComplete(finalRecoveryPos);
    }
  }

  public destroy(): void {
    const world = this.physicsWorld.world;
    for (const joint of this.joints) {
      world.removeImpulseJoint(joint, true);
    }
    this.joints = [];

    for (const part of this.parts) {
      world.removeRigidBody(part.body);
    }
    this.parts = [];
  }
}
