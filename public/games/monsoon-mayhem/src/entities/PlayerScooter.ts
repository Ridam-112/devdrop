import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, DEPTH_LAYERS } from '../game/GameConstants';
import { PHYSICS_CONFIG } from '../data/physicsConfig';
import { AudioManager } from '../systems/AudioManager';

export type RiderAnimationState =
  | 'IDLE'
  | 'RIDING'
  | 'STEERING_LEFT'
  | 'STEERING_RIGHT'
  | 'BRAKING'
  | 'JUMPING'
  | 'LANDING'
  | 'COLLISION';

export class PlayerScooter {
  public scene: Phaser.Scene;
  public container: Phaser.GameObjects.Container;
  public scooterSprite: Phaser.GameObjects.Sprite;
  public shadowSprite: Phaser.GameObjects.Graphics;
  public brakeLightGfx: Phaser.GameObjects.Graphics;
  public waterSprayEmitter: Phaser.GameObjects.Particles.ParticleEmitter;

  // Physical State
  public normalizedX: number = 0; // -1 (left road curb) to +1 (right road curb)
  public screenX: number = GAME_WIDTH / 2;
  public baseScreenY: number = GAME_HEIGHT - 120;
  public currentSpeed: number = 0; // KM/H
  public leanAngle: number = 0;

  // Base Render Scale for 240x300 Chetak Sprite
  private static readonly BASE_SCALE = 0.72;

  // Jump State
  public isAirborne: boolean = false;
  public jumpHeight: number = 0; // Pixels above ground
  public jumpVelocityY: number = 0;
  public jumpCooldownTimer: number = 0;
  public landingSquashTimer: number = 0;

  // Animation State
  public animState: RiderAnimationState = 'IDLE';

  constructor(scene: Phaser.Scene) {
    this.scene = scene;

    // 1. Scooter Ground Shadow (stretches and stays on road when jumping)
    this.shadowSprite = this.scene.add.graphics();
    this.shadowSprite.fillStyle(0x020617, 0.45);
    this.shadowSprite.fillEllipse(0, 0, 110, 26);
    this.shadowSprite.setDepth(DEPTH_LAYERS.ROAD_OBJECTS);

    // 2. Main Scooter Container (Holds scooter sprite & brake light)
    this.container = this.scene.add.container(this.screenX, this.baseScreenY);
    this.container.setDepth(DEPTH_LAYERS.PLAYER);

    // 3. Vintage Blue Chetak Scooter Sprite with Yellow Raincoat Rider
    this.scooterSprite = this.scene.add.sprite(0, 0, 'vehicle_old_chetak');
    this.scooterSprite.setScale(PlayerScooter.BASE_SCALE);
    this.container.add(this.scooterSprite);

    // 4. Glowing Red Brake Light Flare (Aligned with Chetak jewel taillight at y = -6)
    this.brakeLightGfx = this.scene.add.graphics();
    this.brakeLightGfx.fillStyle(0xef4444, 0.85);
    this.brakeLightGfx.fillCircle(0, -6, 14);
    this.brakeLightGfx.fillStyle(0xffffff, 0.95);
    this.brakeLightGfx.fillCircle(0, -6, 5);
    this.brakeLightGfx.setVisible(false);
    this.container.add(this.brakeLightGfx);

    // 5. Water Wheel Spray Particle System
    this.waterSprayEmitter = this.scene.add.particles(0, 0, 'effect_water_spray', {
      x: this.screenX,
      y: this.baseScreenY + 98,
      speedX: { min: -140, max: 140 },
      speedY: { min: -180, max: -30 },
      scale: { start: 0.5, end: 1.7 },
      alpha: { start: 0.85, end: 0 },
      lifespan: 260,
      frequency: 20
    }).setDepth(DEPTH_LAYERS.WATER_SPLASH);
  }

  /**
   * Main driving physics update
   */
  public update(
    input: { steerLeft: boolean; steerRight: boolean; accelerate: boolean; brake: boolean; jump: boolean },
    waterDepth: number,
    dt: number
  ): void {
    const audio = AudioManager.getInstance();

    // 1. Water Depth Resistance Modifiers
    const waterConfig = PHYSICS_CONFIG.WATER_EFFECTS[waterDepth as keyof typeof PHYSICS_CONFIG.WATER_EFFECTS] || PHYSICS_CONFIG.WATER_EFFECTS[1];
    const effectiveMaxSpeed = PHYSICS_CONFIG.MAX_SPEED * waterConfig.dragFactor;

    // 2. Acceleration & Braking Dynamics
    const isAccelerating = input.accelerate && !this.isAirborne;
    const isBraking = input.brake && !this.isAirborne;

    if (isAccelerating) {
      this.currentSpeed = Math.min(
        effectiveMaxSpeed,
        this.currentSpeed + PHYSICS_CONFIG.ACCELERATION_RATE * waterConfig.accelFactor * dt
      );
    } else if (isBraking) {
      this.currentSpeed = Math.max(
        0,
        this.currentSpeed - PHYSICS_CONFIG.BRAKING_RATE * dt
      );
    } else {
      // Natural rolling deceleration towards 0 km/h (coasting to a stop)
      if (this.currentSpeed > 0) {
        this.currentSpeed = Math.max(0, this.currentSpeed - PHYSICS_CONFIG.NATURAL_DECEL_RATE * dt);
      }
    }

    // Update procedural audio engine
    audio.updateEngine(this.currentSpeed, isAccelerating);

    // Brake Light visual toggle
    this.brakeLightGfx.setVisible(isBraking);

    // 3. Smooth Steering & Natural Centering
    let targetLean = 0;
    const steerResponsiveness = this.currentSpeed > 2 ? Math.min(1.0, 0.45 + (this.currentSpeed / 35)) : 0.35;
    const effectiveSteerSpeed = PHYSICS_CONFIG.STEERING_SPEED * steerResponsiveness * dt;

    if (input.steerLeft) {
      this.normalizedX = Math.max(-0.92, this.normalizedX - effectiveSteerSpeed);
      targetLean = -PHYSICS_CONFIG.MAX_LEAN_ANGLE;
      this.animState = 'STEERING_LEFT';
    } else if (input.steerRight) {
      this.normalizedX = Math.min(0.92, this.normalizedX + effectiveSteerSpeed);
      targetLean = PHYSICS_CONFIG.MAX_LEAN_ANGLE;
      this.animState = 'STEERING_RIGHT';
    } else {
      // Natural return-to-center recovery when steering is released
      this.normalizedX = Phaser.Math.Linear(this.normalizedX, 0, PHYSICS_CONFIG.STEERING_RETURN_RATE * dt * 0.4);
      targetLean = 0;
      this.animState = isBraking ? 'BRAKING' : (this.currentSpeed > 5 ? 'RIDING' : 'IDLE');
    }

    // Smooth lean angle interpolation
    this.leanAngle = Phaser.Math.Linear(this.leanAngle, targetLean, PHYSICS_CONFIG.LEAN_INTERPOLATION * dt);
    this.scooterSprite.setAngle(this.leanAngle);

    // 4. Screen Position Mapping (Normalized -1 to +1 -> Screen X)
    this.screenX = (GAME_WIDTH / 2) + this.normalizedX * (GAME_WIDTH * 0.38);

    // 5. Jump Physics
    if (this.jumpCooldownTimer > 0) this.jumpCooldownTimer -= dt;

    if (input.jump && !this.isAirborne && this.jumpCooldownTimer <= 0) {
      this.isAirborne = true;
      this.jumpVelocityY = PHYSICS_CONFIG.JUMP_FORCE;
      this.jumpCooldownTimer = PHYSICS_CONFIG.JUMP_COOLDOWN;
      this.animState = 'JUMPING';
      audio.playJump();
    }

    if (this.isAirborne) {
      this.jumpHeight += this.jumpVelocityY * dt;
      this.jumpVelocityY -= PHYSICS_CONFIG.GRAVITY * dt;

      if (this.jumpHeight <= 0) {
        // Landing Impact!
        this.jumpHeight = 0;
        this.isAirborne = false;
        this.landingSquashTimer = PHYSICS_CONFIG.LANDING_SQUASH_DURATION;
        this.animState = 'LANDING';
        audio.playLanding();

        // Subtle camera shake on hard landing
        this.scene.cameras.main.shake(120, 0.005);
      }
    }

    // Suspension bounce squash and stretch on landing
    let squashScaleY = PlayerScooter.BASE_SCALE;
    if (this.landingSquashTimer > 0) {
      this.landingSquashTimer -= dt;
      squashScaleY = PlayerScooter.BASE_SCALE * 0.85; // Squash down on landing
    } else if (this.isAirborne) {
      squashScaleY = PlayerScooter.BASE_SCALE * 1.05; // Slight stretch in air
    }
    this.scooterSprite.setScale(PlayerScooter.BASE_SCALE, squashScaleY);

    // 6. Update Container Position & Ground Shadow
    const currentY = this.baseScreenY - this.jumpHeight;
    this.container.setPosition(this.screenX, currentY);

    // Ground Shadow stays on road surface
    this.shadowSprite.setPosition(this.screenX, this.baseScreenY + 98);
    // Shadow shrinks and fades as scooter jumps higher
    const shadowScale = Math.max(0.4, 1.0 - (this.jumpHeight / 250));
    this.shadowSprite.setScale(shadowScale);
    this.shadowSprite.setAlpha(Math.max(0.2, 0.5 - (this.jumpHeight / 300)));

    // 7. Water Spray Particle Update
    if (!this.isAirborne && this.currentSpeed > 10) {
      this.waterSprayEmitter.setPosition(this.screenX, this.baseScreenY + 98);
      // Lateral water spray when turning
      const lateralSpeed = this.leanAngle * 6;
      (this.waterSprayEmitter as any).speedX = { min: -140 + lateralSpeed, max: 140 + lateralSpeed };
      this.waterSprayEmitter.setQuantity(Math.max(1, Math.round((this.currentSpeed / 20) * waterConfig.sprayIntensity)));
    } else {
      this.waterSprayEmitter.setQuantity(0);
    }
  }
}
