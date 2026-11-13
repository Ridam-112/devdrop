import Phaser from 'phaser';
import { PlayerScooter } from '../entities/PlayerScooter';
import { ObstacleSystem, ObstacleData } from './ObstacleSystem';
import { RoadSystem } from './RoadSystem';
import { AudioManager } from './AudioManager';
import { GameStateManager } from '../game/GameState';

export class CollisionSystem {
  private scene: Phaser.Scene;
  private playerScooter: PlayerScooter;
  private obstacleSystem: ObstacleSystem;
  private roadSystem: RoadSystem;
  private audio: AudioManager;

  // Collision Particle Emitters
  private impactSplashEmitter: Phaser.GameObjects.Particles.ParticleEmitter;
  private sparkEmitter: Phaser.GameObjects.Particles.ParticleEmitter;

  // Screen flash graphics for damage feedback
  private flashGraphics: Phaser.GameObjects.Graphics;

  constructor(
    scene: Phaser.Scene,
    playerScooter: PlayerScooter,
    obstacleSystem: ObstacleSystem,
    roadSystem: RoadSystem
  ) {
    this.scene = scene;
    this.playerScooter = playerScooter;
    this.obstacleSystem = obstacleSystem;
    this.roadSystem = roadSystem;
    this.audio = AudioManager.getInstance();

    // Damage flash graphic
    this.flashGraphics = this.scene.add.graphics().setDepth(999);

    // Muddy water impact splash
    this.impactSplashEmitter = this.scene.add.particles(0, 0, 'effect_water_spray', {
      speed: { min: 80, max: 260 },
      angle: { min: 200, max: 340 },
      scale: { start: 1.2, end: 2.2 },
      alpha: { start: 0.9, end: 0 },
      lifespan: 350,
      emitting: false
    }).setDepth(50);

    // Metal collision spark
    this.sparkEmitter = this.scene.add.particles(0, 0, 'particle_impact_spark', {
      speed: { min: 90, max: 220 },
      angle: { min: 0, max: 360 },
      scale: { start: 1.0, end: 0.2 },
      alpha: { start: 1.0, end: 0 },
      lifespan: 250,
      emitting: false
    }).setDepth(51);
  }

  /**
   * Evaluates depth-based pseudo-3D collisions each frame
   */
  public update(): void {
    const cameraZ = this.roadSystem.cameraPos;
    const state = GameStateManager.getInstance();

    for (const obs of this.obstacleSystem.activeObstacles) {
      if (obs.hasCollided || obs.isPassed) continue;

      const relZ = obs.worldZ - cameraZ;

      // Contact window: scooter wheels contact road at relZ between 25 and 85 world units
      if (relZ >= 25 && relZ <= 90) {
        const lateralDist = Math.abs(this.playerScooter.normalizedX - obs.normalizedX);

        if (lateralDist <= obs.collisionRadius) {
          // Check if player jumped over the obstacle
          if (this.playerScooter.isAirborne && this.playerScooter.jumpHeight >= obs.requiredJumpHeight) {
            // Jump Dodge Successful!
            this.handleJumpDodge(obs);
            continue;
          }

          // True Collision Occurred!
          obs.hasCollided = true;
          this.handleCollision(obs, state);
        }
      }
    }
  }

  private handleJumpDodge(obs: ObstacleData): void {
    obs.hasCollided = true; // Prevents re-triggering while passing beneath
    // Subtle whoosh and reward
    this.audio.playJump();
  }

  private handleCollision(obs: ObstacleData, state: GameStateManager): void {
    state.runStats.potholesHit++;

    // 1. Velocity reduction penalty
    this.playerScooter.currentSpeed = Math.max(0, this.playerScooter.currentSpeed - obs.speedPenalty);

    // 2. Health / Condition reduction
    state.runStats.engineHealth = Math.max(0, state.runStats.engineHealth - obs.damage);

    // 3. Scooter physical reaction: Suspension compression squash
    this.playerScooter.landingSquashTimer = 0.22;

    // 4. Collision Particles at player position
    const contactX = this.playerScooter.screenX;
    const contactY = this.playerScooter.baseScreenY + 70;

    // 5. Obstacle-Specific Reaction & Audio
    switch (obs.type) {
      case 'POTHOLE_SMALL':
      case 'POTHOLE_LARGE':
      case 'POTHOLE_WATER':
        this.audio.playImpactPothole();
        this.scene.cameras.main.shake(140, 0.007);
        this.impactSplashEmitter.explode(18, contactX, contactY);
        this.triggerRedFlash(0.18);
        break;

      case 'OPEN_MANHOLE':
        this.audio.playImpactManhole();
        // Heavy impact: violent camera shake + speed drop
        this.scene.cameras.main.shake(300, 0.018);
        this.impactSplashEmitter.explode(28, contactX, contactY);
        this.sparkEmitter.explode(16, contactX, contactY);
        this.triggerRedFlash(0.35);
        state.runStats.causeOfDeath = 'Swallowed by an Open Kolkata Manhole!';
        break;

      case 'BARRICADE':
        this.audio.playImpactBarricade();
        this.scene.cameras.main.shake(220, 0.012);
        this.sparkEmitter.explode(22, contactX, contactY);
        this.triggerRedFlash(0.25);
        state.runStats.causeOfDeath = 'Crashed into Police Hazard Barricade!';
        break;

      case 'TRAFFIC_CONE':
      case 'FALLEN_BRANCH':
      case 'FLOATING_DEBRIS':
        this.audio.playWaterSplash(1.4);
        this.scene.cameras.main.shake(110, 0.005);
        this.impactSplashEmitter.explode(14, contactX, contactY);
        this.triggerRedFlash(0.12);
        break;
    }
  }

  private triggerRedFlash(alpha: number): void {
    this.flashGraphics.clear();
    this.flashGraphics.fillStyle(0xdc2626, alpha);
    this.flashGraphics.fillRect(0, 0, this.scene.scale.width, this.scene.scale.height);

    this.scene.time.delayedCall(75, () => {
      this.flashGraphics.clear();
    });
  }
}
