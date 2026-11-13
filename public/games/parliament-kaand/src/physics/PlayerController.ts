import * as THREE from 'three';
import { PlayerCharacter } from '../character/PlayerCharacter';
import { AnimationStateMachine, AnimationState } from '../character/AnimationStateMachine';
import { EnvironmentColliders } from './EnvironmentColliders';
import { SoundManager } from '../audio/SoundManager';

export interface PlayerInputState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  sprint: boolean;
  crouch: boolean;
  jump: boolean;
  interact: boolean;
  emote: boolean;
}

export class PlayerController {
  public character: PlayerCharacter;
  public animStateMachine: AnimationStateMachine;

  // Transform & Kinematics
  public position = new THREE.Vector3(0, 0, 18); // Spawn at central aisle facing Speaker
  public velocity = new THREE.Vector3(0, 0, 0);
  public facingAngle = Math.PI; // Face north toward Speaker dais (Z < 0)

  // Physical Speeds (m/s)
  private readonly CROUCH_SPEED = 1.9;
  private readonly WALK_SPEED = 3.3;
  private readonly RUN_SPEED = 5.4;
  private readonly SPRINT_SPEED = 8.2;

  private readonly ACCELERATION = 28.0;
  private readonly DECELERATION = 22.0;
  private readonly ROTATION_SPEED = 12.0;
  private readonly GRAVITY = -20.0;
  private readonly JUMP_IMPULSE = 6.8;

  // Physical Status
  public isGrounded = true;
  public isCrouching = false;
  public isSprinting = false;
  public isRagdollActive = false;
  public stamina = 100.0;
  public maxStamina = 100.0;
  private staminaExhausted = false;

  // Jump tracking
  private jumpTimer = 0;
  private isJumping = false;

  // External / Mobile Joystick inputs
  private mobileMoveVector = new THREE.Vector2(0, 0);

  // Active Key inputs
  private inputs: PlayerInputState = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    sprint: false,
    crouch: false,
    jump: false,
    interact: false,
    emote: false,
  };

  constructor(character: PlayerCharacter) {
    this.character = character;
    this.animStateMachine = new AnimationStateMachine(this.character.bones);
    this.character.group.position.copy(this.position);
    this.character.group.rotation.y = this.facingAngle;
  }

  public setInput(input: Partial<PlayerInputState>): void {
    this.inputs = { ...this.inputs, ...input };
  }

  public setMobileMove(x: number, y: number): void {
    this.mobileMoveVector.set(x, y);
  }

  public triggerJump(): void {
    if (this.isGrounded && !this.isCrouching) {
      this.isGrounded = false;
      this.isJumping = true;
      this.velocity.y = this.JUMP_IMPULSE;
      this.animStateMachine.setState('JUMP_START');
      SoundManager.playWhoosh();
    }
  }

  public toggleCrouch(): void {
    this.isCrouching = !this.isCrouching;
    if (this.isCrouching) {
      this.isSprinting = false;
    }
  }

  public setSprinting(sprint: boolean): void {
    if (sprint && !this.staminaExhausted && !this.isCrouching) {
      this.isSprinting = true;
    } else {
      this.isSprinting = false;
    }
  }

  public recoverFromRagdoll(newPos: THREE.Vector3): void {
    this.isRagdollActive = false;
    this.position.copy(newPos);
    this.velocity.set(0, 0, 0);
    this.isGrounded = true;
    this.character.group.position.copy(this.position);
    this.character.group.rotation.y = this.facingAngle;
    this.animStateMachine.setState('IDLE');
  }

  public update(delta: number, cameraYaw: number): void {
    if (this.isRagdollActive) {
      return;
    }

    // 1. Process Stamina
    this.updateStamina(delta);

    // 2. Compute Desired Horizontal Movement Direction relative to camera
    const moveDir = this.calculateInputDirection(cameraYaw);
    const hasMoveInput = moveDir.lengthSq() > 0.001;

    // 3. Determine Target Speed
    let targetSpeed = 0;
    if (hasMoveInput) {
      if (this.isCrouching) {
        targetSpeed = this.CROUCH_SPEED;
      } else if (this.isSprinting && !this.staminaExhausted) {
        targetSpeed = this.SPRINT_SPEED;
      } else {
        targetSpeed = this.RUN_SPEED;
      }
    }

    // 4. Smooth Acceleration / Deceleration
    const currentSpeed = new THREE.Vector2(this.velocity.x, this.velocity.z).length();
    const accelRate = hasMoveInput ? this.ACCELERATION : this.DECELERATION;
    const newSpeed = THREE.MathUtils.lerp(currentSpeed, targetSpeed, Math.min(1.0, delta * accelRate));

    if (hasMoveInput) {
      this.velocity.x = moveDir.x * newSpeed;
      this.velocity.z = moveDir.z * newSpeed;

      // Smooth Character Facing Rotation toward movement direction
      const targetFacing = Math.atan2(moveDir.x, moveDir.z);
      this.facingAngle = this.lerpAngle(this.facingAngle, targetFacing, delta * this.ROTATION_SPEED);
    } else {
      this.velocity.x *= Math.max(0, 1 - delta * this.DECELERATION);
      this.velocity.z *= Math.max(0, 1 - delta * this.DECELERATION);
    }

    // 5. Vertical Kinematics & Gravity
    if (!this.isGrounded) {
      this.velocity.y += this.GRAVITY * delta;
    }

    // 6. Integrate Position & Resolve Collisions
    const oldPosition = this.position.clone();
    const desiredPosition = this.position.clone();

    desiredPosition.x += this.velocity.x * delta;
    desiredPosition.z += this.velocity.z * delta;
    desiredPosition.y += this.velocity.y * delta;

    // Collision Resolution with environment solids
    const resolvedPosition = EnvironmentColliders.resolveCollisions(oldPosition, desiredPosition, 0.38);

    // Ground Height & Landing Check
    const groundHeight = EnvironmentColliders.getGroundHeight(resolvedPosition.x, resolvedPosition.z);

    if (resolvedPosition.y <= groundHeight) {
      resolvedPosition.y = groundHeight;
      this.velocity.y = 0;

      if (!this.isGrounded) {
        // Landing transition
        this.isGrounded = true;
        this.isJumping = false;
        this.animStateMachine.setState('JUMP_LAND');
      }
    } else {
      // In air
      this.isGrounded = false;
    }

    this.position.copy(resolvedPosition);

    // 7. Synchronize 3D Mesh Group
    this.character.group.position.copy(this.position);
    this.character.group.rotation.y = this.facingAngle;

    // 8. Update Animation State Machine
    this.updateAnimationState(currentSpeed);
    this.animStateMachine.update(delta, currentSpeed, this.isGrounded, this.velocity.y);
  }

  private calculateInputDirection(cameraYaw: number): THREE.Vector3 {
    let inputX = 0;
    let inputZ = 0;

    // Desktop WASD
    if (this.inputs.forward) inputZ -= 1;
    if (this.inputs.backward) inputZ += 1;
    if (this.inputs.left) inputX -= 1;
    if (this.inputs.right) inputX += 1;

    // Mobile Joystick
    if (this.mobileMoveVector.lengthSq() > 0.05) {
      inputX += this.mobileMoveVector.x;
      inputZ += this.mobileMoveVector.y;
    }

    const inputVec = new THREE.Vector2(inputX, inputZ);
    if (inputVec.lengthSq() < 0.001) {
      return new THREE.Vector3(0, 0, 0);
    }

    // Normalize diagonal input vector
    inputVec.normalize();

    // Rotate input vector by camera yaw angle so forward is always looking forward
    const forward = new THREE.Vector3(-Math.sin(cameraYaw), 0, -Math.cos(cameraYaw));
    const right = new THREE.Vector3(forward.z, 0, -forward.x);

    const worldDir = new THREE.Vector3()
      .addScaledVector(forward, -inputVec.y)
      .addScaledVector(right, inputVec.x)
      .normalize();

    return worldDir;
  }

  private updateStamina(delta: number): void {
    const isMoving = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.z * this.velocity.z) > 0.2;

    if (this.isSprinting && isMoving) {
      // Drain stamina
      this.stamina = Math.max(0, this.stamina - delta * 22.0);
      if (this.stamina <= 0) {
        this.stamina = 0;
        this.isSprinting = false;
        this.staminaExhausted = true;
      }
    } else {
      // Regenerate stamina
      const regenRate = isMoving ? 16.0 : 25.0;
      this.stamina = Math.min(this.maxStamina, this.stamina + delta * regenRate);
      if (this.stamina >= 20.0) {
        this.staminaExhausted = false;
      }
    }
  }

  private updateAnimationState(speed: number): void {
    const current = this.animStateMachine.getState();

    // Do not interrupt active temporary actions like jump land or interact
    if (current === 'INTERACT' || (current === 'JUMP_LAND' && speed < 0.2)) {
      return;
    }

    if (!this.isGrounded) {
      this.animStateMachine.setState('JUMP_LOOP');
      return;
    }

    if (this.isCrouching) {
      if (speed > 0.2) {
        this.animStateMachine.setState('CROUCH_WALK');
      } else {
        this.animStateMachine.setState('CROUCH_IDLE');
      }
      return;
    }

    if (speed < 0.2) {
      this.animStateMachine.setState('IDLE');
    } else if (speed < 4.0) {
      this.animStateMachine.setState('WALK');
    } else if (this.isSprinting && speed > 6.0) {
      this.animStateMachine.setState('SPRINT');
    } else {
      this.animStateMachine.setState('RUN');
    }
  }

  private lerpAngle(from: number, to: number, t: number): number {
    const diff = (to - from + Math.PI * 3) % (Math.PI * 2) - Math.PI;
    return from + diff * Math.min(1.0, t);
  }
}
