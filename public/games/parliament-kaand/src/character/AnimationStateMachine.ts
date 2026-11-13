import * as THREE from 'three';
import { CharacterBones } from './PlayerCharacter';

export type AnimationState =
  | 'IDLE'
  | 'WALK'
  | 'RUN'
  | 'SPRINT'
  | 'JUMP_START'
  | 'JUMP_LOOP'
  | 'JUMP_LAND'
  | 'CROUCH_IDLE'
  | 'CROUCH_WALK'
  | 'TURN'
  | 'INTERACT'
  | 'SIT'
  | 'STAND';

interface BonePose {
  pelvisY: number;
  pelvisRot: THREE.Euler;
  spineRot: THREE.Euler;
  chestRot: THREE.Euler;
  neckRot: THREE.Euler;
  headRot: THREE.Euler;
  leftUpperArmRot: THREE.Euler;
  leftForearmRot: THREE.Euler;
  rightUpperArmRot: THREE.Euler;
  rightForearmRot: THREE.Euler;
  leftThighRot: THREE.Euler;
  leftKneeRot: THREE.Euler;
  leftFootRot: THREE.Euler;
  rightThighRot: THREE.Euler;
  rightKneeRot: THREE.Euler;
  rightFootRot: THREE.Euler;
}

function createEmptyPose(): BonePose {
  return {
    pelvisY: 0.92,
    pelvisRot: new THREE.Euler(),
    spineRot: new THREE.Euler(),
    chestRot: new THREE.Euler(),
    neckRot: new THREE.Euler(),
    headRot: new THREE.Euler(),
    leftUpperArmRot: new THREE.Euler(),
    leftForearmRot: new THREE.Euler(),
    rightUpperArmRot: new THREE.Euler(),
    rightForearmRot: new THREE.Euler(),
    leftThighRot: new THREE.Euler(),
    leftKneeRot: new THREE.Euler(),
    leftFootRot: new THREE.Euler(),
    rightThighRot: new THREE.Euler(),
    rightKneeRot: new THREE.Euler(),
    rightFootRot: new THREE.Euler(),
  };
}

export class AnimationStateMachine {
  private bones: CharacterBones;
  private currentState: AnimationState = 'IDLE';
  private previousState: AnimationState = 'IDLE';

  private stateTime = 0;
  private walkCyclePhase = 0;
  private transitionAlpha = 1.0;
  private transitionDuration = 0.22;

  private currentPose: BonePose = createEmptyPose();
  private prevPose: BonePose = createEmptyPose();
  private targetPose: BonePose = createEmptyPose();

  // Active interaction or emote timer
  private actionTimer = 0;
  private actionDuration = 0;

  constructor(bones: CharacterBones) {
    this.bones = bones;
  }

  public getState(): AnimationState {
    return this.currentState;
  }

  public setState(nextState: AnimationState): void {
    if (this.currentState === nextState && this.transitionAlpha >= 1.0) return;

    // Capture current pose snapshot for smooth blending
    this.prevPose = this.clonePose(this.currentPose);
    this.previousState = this.currentState;
    this.currentState = nextState;
    this.stateTime = 0;
    this.transitionAlpha = 0.0;
  }

  public triggerInteract(duration = 0.8): void {
    this.setState('INTERACT');
    this.actionTimer = 0;
    this.actionDuration = duration;
  }

  public update(delta: number, speed: number, isGrounded: boolean, verticalVelocity: number): void {
    this.stateTime += delta;

    // Handle temporary action timeout
    if (this.currentState === 'INTERACT') {
      this.actionTimer += delta;
      if (this.actionTimer >= this.actionDuration) {
        this.setState(speed > 0.2 ? 'WALK' : 'IDLE');
      }
    }

    // Advance walk cycle based on real ground travel
    if (speed > 0.1 && isGrounded) {
      const cycleRate = Math.max(3.0, speed * 2.2);
      this.walkCyclePhase += delta * cycleRate;
    }

    // Advance blend weight
    if (this.transitionAlpha < 1.0) {
      this.transitionAlpha = Math.min(1.0, this.transitionAlpha + delta / this.transitionDuration);
    }

    // 1. Calculate raw target pose for current state
    this.calculateTargetPose(speed, isGrounded, verticalVelocity);

    // 2. Smoothly interpolate from previous pose to target pose
    this.blendPoses(this.prevPose, this.targetPose, this.easeOutQuad(this.transitionAlpha), this.currentPose);

    // 3. Apply final pose to character bones
    this.applyPoseToBones(this.currentPose);
  }

  private calculateTargetPose(speed: number, isGrounded: boolean, verticalVelocity: number): void {
    const t = this.stateTime;
    const p = this.walkCyclePhase;
    const pose = this.targetPose;

    // Reset default pose
    pose.pelvisY = 0.92;
    pose.pelvisRot.set(0, 0, 0);
    pose.spineRot.set(0, 0, 0);
    pose.chestRot.set(0, 0, 0);
    pose.neckRot.set(0, 0, 0);
    pose.headRot.set(0, 0, 0);
    pose.leftUpperArmRot.set(0, 0, 0);
    pose.leftForearmRot.set(0, 0, 0);
    pose.rightUpperArmRot.set(0, 0, 0);
    pose.rightForearmRot.set(0, 0, 0);
    pose.leftThighRot.set(0, 0, 0);
    pose.leftKneeRot.set(0, 0, 0);
    pose.leftFootRot.set(0, 0, 0);
    pose.rightThighRot.set(0, 0, 0);
    pose.rightKneeRot.set(0, 0, 0);
    pose.rightFootRot.set(0, 0, 0);

    switch (this.currentState) {
      case 'IDLE': {
        // Natural resting posture: subtle breathing rise and gentle weight shift
        const breath = Math.sin(t * 2.2) * 0.03;
        pose.pelvisY = 0.92 + Math.sin(t * 1.5) * 0.005;
        pose.chestRot.x = breath;
        pose.spineRot.x = breath * 0.5;
        pose.neckRot.x = -breath * 0.4;
        pose.headRot.y = Math.sin(t * 0.8) * 0.04;

        // Arms rest naturally beside torso with relaxed elbows
        pose.leftUpperArmRot.z = 0.08 + breath * 0.2;
        pose.leftUpperArmRot.x = -0.04;
        pose.leftForearmRot.x = 0.18;

        pose.rightUpperArmRot.z = -0.08 - breath * 0.2;
        pose.rightUpperArmRot.x = -0.04;
        pose.rightForearmRot.x = 0.18;
        break;
      }

      case 'WALK': {
        const stride = Math.sin(p);
        const cosStride = Math.cos(p);

        // Pelvis bobbing and sway
        pose.pelvisY = 0.92 + Math.abs(cosStride) * 0.03;
        pose.pelvisRot.y = stride * 0.08;
        pose.spineRot.x = 0.08; // Slight forward walk lean
        pose.spineRot.y = -stride * 0.06;

        // Legs: Sinusoidal anti-phase stride
        pose.leftThighRot.x = stride * 0.55;
        pose.rightThighRot.x = -stride * 0.55;

        // Knee flexion on rear swing
        pose.leftKneeRot.x = stride < 0 ? -Math.sin(p) * 0.75 : 0;
        pose.rightKneeRot.x = stride > 0 ? Math.sin(p) * 0.75 : 0;

        // Foot pitch
        pose.leftFootRot.x = -pose.leftThighRot.x * 0.3;
        pose.rightFootRot.x = -pose.rightThighRot.x * 0.3;

        // Arms: Natural counter-swing
        pose.leftUpperArmRot.x = -stride * 0.45;
        pose.leftForearmRot.x = 0.25;
        pose.rightUpperArmRot.x = stride * 0.45;
        pose.rightForearmRot.x = 0.25;
        break;
      }

      case 'RUN': {
        const stride = Math.sin(p);
        const cosStride = Math.cos(p);

        pose.pelvisY = 0.92 + Math.abs(cosStride) * 0.05;
        pose.pelvisRot.y = stride * 0.12;
        pose.spineRot.x = 0.16; // Deeper running lean
        pose.chestRot.x = 0.06;

        pose.leftThighRot.x = stride * 0.78;
        pose.rightThighRot.x = -stride * 0.78;

        pose.leftKneeRot.x = stride < 0 ? -Math.sin(p) * 1.15 : 0;
        pose.rightKneeRot.x = stride > 0 ? Math.sin(p) * 1.15 : 0;

        // Athletic bent-arm swing
        pose.leftUpperArmRot.x = -stride * 0.70;
        pose.leftForearmRot.x = 0.65;
        pose.rightUpperArmRot.x = stride * 0.70;
        pose.rightForearmRot.x = 0.65;
        break;
      }

      case 'SPRINT': {
        const stride = Math.sin(p);
        const cosStride = Math.cos(p);

        pose.pelvisY = 0.90 + Math.abs(cosStride) * 0.07;
        pose.pelvisRot.y = stride * 0.18;
        pose.spineRot.x = 0.28; // Aggressive forward dash lean
        pose.chestRot.x = 0.10;

        pose.leftThighRot.x = stride * 1.05;
        pose.rightThighRot.x = -stride * 1.05;

        pose.leftKneeRot.x = stride < 0 ? -Math.sin(p) * 1.45 : 0;
        pose.rightKneeRot.x = stride > 0 ? Math.sin(p) * 1.45 : 0;

        // High intensity pumping arms
        pose.leftUpperArmRot.x = -stride * 1.0;
        pose.leftUpperArmRot.z = 0.15;
        pose.leftForearmRot.x = 0.85;

        pose.rightUpperArmRot.x = stride * 1.0;
        pose.rightUpperArmRot.z = -0.15;
        pose.rightForearmRot.x = 0.85;
        break;
      }

      case 'JUMP_START': {
        // Crouch compression prior to launch
        pose.pelvisY = 0.78;
        pose.spineRot.x = 0.25;
        pose.leftThighRot.x = -0.4;
        pose.rightThighRot.x = -0.4;
        pose.leftKneeRot.x = 0.6;
        pose.rightKneeRot.x = 0.6;
        pose.leftUpperArmRot.x = -0.4;
        pose.rightUpperArmRot.x = -0.4;
        break;
      }

      case 'JUMP_LOOP': {
        // Airborne posture: legs trailing/tucked, arms balancing
        pose.pelvisY = 0.95;
        pose.spineRot.x = verticalVelocity > 0 ? -0.1 : 0.15;
        pose.leftThighRot.x = 0.35;
        pose.rightThighRot.x = 0.20;
        pose.leftKneeRot.x = 0.70;
        pose.rightKneeRot.x = 0.55;
        pose.leftUpperArmRot.x = -0.65;
        pose.leftUpperArmRot.z = 0.35;
        pose.rightUpperArmRot.x = -0.65;
        pose.rightUpperArmRot.z = -0.35;
        break;
      }

      case 'JUMP_LAND': {
        // Landing impact compression
        pose.pelvisY = 0.74;
        pose.spineRot.x = 0.30;
        pose.leftThighRot.x = -0.45;
        pose.rightThighRot.x = -0.45;
        pose.leftKneeRot.x = 0.85;
        pose.rightKneeRot.x = 0.85;
        pose.leftUpperArmRot.x = 0.3;
        pose.rightUpperArmRot.x = 0.3;
        break;
      }

      case 'CROUCH_IDLE': {
        pose.pelvisY = 0.60;
        pose.spineRot.x = 0.35;
        pose.chestRot.x = 0.15;
        pose.leftThighRot.x = -0.85;
        pose.rightThighRot.x = -0.85;
        pose.leftKneeRot.x = 1.35;
        pose.rightKneeRot.x = 1.35;
        pose.leftUpperArmRot.x = 0.25;
        pose.leftForearmRot.x = 0.45;
        pose.rightUpperArmRot.x = 0.25;
        pose.rightForearmRot.x = 0.45;
        break;
      }

      case 'CROUCH_WALK': {
        const stride = Math.sin(p);
        pose.pelvisY = 0.60 + Math.abs(stride) * 0.02;
        pose.spineRot.x = 0.40;
        pose.leftThighRot.x = -0.85 + stride * 0.35;
        pose.rightThighRot.x = -0.85 - stride * 0.35;
        pose.leftKneeRot.x = 1.35 + (stride < 0 ? -stride * 0.4 : 0);
        pose.rightKneeRot.x = 1.35 + (stride > 0 ? stride * 0.4 : 0);
        pose.leftUpperArmRot.x = -stride * 0.3;
        pose.rightUpperArmRot.x = stride * 0.3;
        break;
      }

      case 'TURN': {
        pose.pelvisRot.y = Math.sin(t * 8) * 0.12;
        pose.spineRot.y = Math.sin(t * 8) * 0.16;
        pose.leftUpperArmRot.z = 0.15;
        pose.rightUpperArmRot.z = -0.15;
        break;
      }

      case 'INTERACT': {
        // Dignified parliamentary gesture: right arm extends forward to touch or inspect
        const reach = Math.min(1.0, t / 0.25);
        pose.chestRot.y = 0.12 * reach;
        pose.headRot.y = 0.15 * reach;
        pose.headRot.x = 0.10 * reach;
        pose.rightUpperArmRot.x = -1.15 * reach; // Point arm forward
        pose.rightUpperArmRot.z = -0.15 * reach;
        pose.rightForearmRot.x = 0.35 * reach;

        pose.leftUpperArmRot.z = 0.10;
        pose.leftForearmRot.x = 0.20;
        break;
      }

      case 'SIT': {
        // Seated on bench: 90 degree knees and thighs, hands resting on table
        pose.pelvisY = 0.48;
        pose.spineRot.x = 0.05;
        pose.leftThighRot.x = -1.55;
        pose.rightThighRot.x = -1.55;
        pose.leftKneeRot.x = 1.55;
        pose.rightKneeRot.x = 1.55;

        // Hands resting forward
        pose.leftUpperArmRot.x = -0.55;
        pose.leftForearmRot.x = 0.95;
        pose.rightUpperArmRot.x = -0.55;
        pose.rightForearmRot.x = 0.95;
        break;
      }

      case 'STAND': {
        pose.pelvisY = 0.88;
        pose.spineRot.x = 0.1;
        break;
      }
    }
  }

  private blendPoses(from: BonePose, to: BonePose, alpha: number, result: BonePose): void {
    result.pelvisY = THREE.MathUtils.lerp(from.pelvisY, to.pelvisY, alpha);

    this.lerpEuler(from.pelvisRot, to.pelvisRot, alpha, result.pelvisRot);
    this.lerpEuler(from.spineRot, to.spineRot, alpha, result.spineRot);
    this.lerpEuler(from.chestRot, to.chestRot, alpha, result.chestRot);
    this.lerpEuler(from.neckRot, to.neckRot, alpha, result.neckRot);
    this.lerpEuler(from.headRot, to.headRot, alpha, result.headRot);

    this.lerpEuler(from.leftUpperArmRot, to.leftUpperArmRot, alpha, result.leftUpperArmRot);
    this.lerpEuler(from.leftForearmRot, to.leftForearmRot, alpha, result.leftForearmRot);
    this.lerpEuler(from.rightUpperArmRot, to.rightUpperArmRot, alpha, result.rightUpperArmRot);
    this.lerpEuler(from.rightForearmRot, to.rightForearmRot, alpha, result.rightForearmRot);

    this.lerpEuler(from.leftThighRot, to.leftThighRot, alpha, result.leftThighRot);
    this.lerpEuler(from.leftKneeRot, to.leftKneeRot, alpha, result.leftKneeRot);
    this.lerpEuler(from.leftFootRot, to.leftFootRot, alpha, result.leftFootRot);

    this.lerpEuler(from.rightThighRot, to.rightThighRot, alpha, result.rightThighRot);
    this.lerpEuler(from.rightKneeRot, to.rightKneeRot, alpha, result.rightKneeRot);
    this.lerpEuler(from.rightFootRot, to.rightFootRot, alpha, result.rightFootRot);
  }

  private lerpEuler(a: THREE.Euler, b: THREE.Euler, t: number, out: THREE.Euler): void {
    out.x = THREE.MathUtils.lerp(a.x, b.x, t);
    out.y = THREE.MathUtils.lerp(a.y, b.y, t);
    out.z = THREE.MathUtils.lerp(a.z, b.z, t);
  }

  private applyPoseToBones(pose: BonePose): void {
    this.bones.pelvis.position.y = pose.pelvisY;
    this.bones.pelvis.rotation.copy(pose.pelvisRot);

    this.bones.spine.rotation.copy(pose.spineRot);
    this.bones.chest.rotation.copy(pose.chestRot);
    this.bones.neck.rotation.copy(pose.neckRot);
    this.bones.head.rotation.copy(pose.headRot);

    this.bones.leftUpperArm.rotation.copy(pose.leftUpperArmRot);
    this.bones.leftForearm.rotation.copy(pose.leftForearmRot);
    this.bones.rightUpperArm.rotation.copy(pose.rightUpperArmRot);
    this.bones.rightForearm.rotation.copy(pose.rightForearmRot);

    this.bones.leftThigh.rotation.copy(pose.leftThighRot);
    this.bones.leftKnee.rotation.copy(pose.leftKneeRot);
    this.bones.leftFoot.rotation.copy(pose.leftFootRot);

    this.bones.rightThigh.rotation.copy(pose.rightThighRot);
    this.bones.rightKnee.rotation.copy(pose.rightKneeRot);
    this.bones.rightFoot.rotation.copy(pose.rightFootRot);
  }

  private easeOutQuad(x: number): number {
    return 1 - (1 - x) * (1 - x);
  }

  private clonePose(source: BonePose): BonePose {
    return {
      pelvisY: source.pelvisY,
      pelvisRot: source.pelvisRot.clone(),
      spineRot: source.spineRot.clone(),
      chestRot: source.chestRot.clone(),
      neckRot: source.neckRot.clone(),
      headRot: source.headRot.clone(),
      leftUpperArmRot: source.leftUpperArmRot.clone(),
      leftForearmRot: source.leftForearmRot.clone(),
      rightUpperArmRot: source.rightUpperArmRot.clone(),
      rightForearmRot: source.rightForearmRot.clone(),
      leftThighRot: source.leftThighRot.clone(),
      leftKneeRot: source.leftKneeRot.clone(),
      leftFootRot: source.leftFootRot.clone(),
      rightThighRot: source.rightThighRot.clone(),
      rightKneeRot: source.rightKneeRot.clone(),
      rightFootRot: source.rightFootRot.clone(),
    };
  }
}
