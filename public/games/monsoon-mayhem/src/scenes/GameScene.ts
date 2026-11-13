import Phaser from 'phaser';
import { SCENE_KEYS, GAME_WIDTH, GAME_HEIGHT, DEPTH_LAYERS } from '../game/GameConstants';
import { GameStateManager } from '../game/GameState';
import { InputManager } from '../controls/InputManager';
import { RoadSystem } from '../systems/RoadSystem';
import { PerspectiveSystem } from '../systems/PerspectiveSystem';
import { PlayerScooter } from '../entities/PlayerScooter';
import { AudioManager } from '../systems/AudioManager';
import { ObstacleSystem } from '../systems/ObstacleSystem';
import { CollisionSystem } from '../systems/CollisionSystem';

export class GameScene extends Phaser.Scene {
  private inputManager!: InputManager;
  private roadSystem!: RoadSystem;
  private playerScooter!: PlayerScooter;
  private obstacleSystem!: ObstacleSystem;
  private collisionSystem!: CollisionSystem;

  private rainEmitter!: Phaser.GameObjects.Particles.ParticleEmitter;
  private lightningGfx!: Phaser.GameObjects.Graphics;

  private distanceText!: Phaser.GameObjects.Text;
  private speedText!: Phaser.GameObjects.Text;
  private waterDepthText!: Phaser.GameObjects.Text;
  private jumpCooldownGfx!: Phaser.GameObjects.Graphics;
  private engineBar!: Phaser.GameObjects.Graphics;
  private dangerBanner!: Phaser.GameObjects.Container;
  private dangerText!: Phaser.GameObjects.Text;
  private gameOverModal?: Phaser.GameObjects.Container;

  private lightningTimer: number = 7.0;
  private isGameOver: boolean = false;

  constructor() {
    super(SCENE_KEYS.GAME);
  }

  create(): void {
    const state = GameStateManager.getInstance();
    state.currentState = 'PLAYING';
    state.resetRun();
    this.isGameOver = false;

    this.inputManager = new InputManager(this);

    // 1. Stormy Monsoon Sky & Distant Kolkata Horizon
    this.createSkyAndHorizon();

    // 2. Initialize Gapless Curved Flooded Road System
    this.roadSystem = new RoadSystem(this);

    // 3. Initialize Dedicated Player Scooter & Rider Entity
    this.playerScooter = new PlayerScooter(this);

    // 4. Initialize Modular Obstacle & Collision Systems
    this.obstacleSystem = new ObstacleSystem(this, this.roadSystem);
    this.collisionSystem = new CollisionSystem(this, this.playerScooter, this.obstacleSystem, this.roadSystem);

    // 5. Start Procedural Audio Engine
    const audio = AudioManager.getInstance();
    audio.startEngine();

    // 6. Heavy Monsoon Rain Particle System
    this.rainEmitter = this.add.particles(0, 0, 'rain_drop', {
      x: { min: 0, max: GAME_WIDTH + 250 },
      y: -20,
      speedY: { min: 750, max: 1000 },
      speedX: { min: -140, max: -90 },
      scaleY: { min: 0.9, max: 1.5 },
      alpha: { min: 0.4, max: 0.85 },
      lifespan: 1100,
      frequency: 10
    }).setDepth(DEPTH_LAYERS.WEATHER_RAIN);

    // 7. Full Screen Lightning Flash Effect
    this.lightningGfx = this.add.graphics().setDepth(DEPTH_LAYERS.MODALS);

    // 8. Full Arcade HUD (Speedometer, Water Depth, Distance, Jump Cooldown, Engine, Danger Alerts)
    this.createHUD();

    // 9. Mobile Multi-Touch Controls (Simultaneous Gas, Brake, Steer, Jump)
    this.createMobileTouchControls();

    // Pause Key (Esc / P)
    this.input.keyboard?.on('keydown-ESC', () => this.togglePause());
    this.input.keyboard?.on('keydown-P', () => this.togglePause());
  }

  private createSkyAndHorizon(): void {
    // Stormy Monsoon Sky Gradient
    const sky = this.add.graphics().setDepth(DEPTH_LAYERS.SKY);
    sky.fillGradientStyle(0x0c4a6e, 0x0c4a6e, 0x075985, 0x075985, 1);
    sky.fillRect(0, 0, GAME_WIDTH, PerspectiveSystem.HORIZON_Y);

    // Distant Kolkata Silhouette Skyline (Howrah Bridge & Buildings)
    const skyline = this.add.graphics().setDepth(DEPTH_LAYERS.HORIZON_BG);
    skyline.fillStyle(0x082f49, 0.9);

    for (let x = 0; x < GAME_WIDTH; x += 36) {
      const bh = Phaser.Math.Between(24, 65);
      skyline.fillRect(x, PerspectiveSystem.HORIZON_Y - bh, 34, bh);
    }

    // Howrah Bridge Cantilever Truss Silhouette
    const bx = GAME_WIDTH / 2;
    skyline.fillPoints([
      { x: bx - 140, y: PerspectiveSystem.HORIZON_Y },
      { x: bx - 70, y: PerspectiveSystem.HORIZON_Y - 95 },
      { x: bx, y: PerspectiveSystem.HORIZON_Y - 50 },
      { x: bx + 70, y: PerspectiveSystem.HORIZON_Y - 95 },
      { x: bx + 140, y: PerspectiveSystem.HORIZON_Y }
    ], true);

    // Fog & Rain Mist across Horizon Line
    const mist = this.add.graphics().setDepth(DEPTH_LAYERS.HORIZON_BG + 1);
    mist.fillGradientStyle(0x38bdf8, 0x38bdf8, 0x0284c7, 0x0284c7, 0.35, 0.35, 0, 0);
    mist.fillRect(0, PerspectiveSystem.HORIZON_Y - 25, GAME_WIDTH, 50);
  }

  private createHUD(): void {
    const hudBg = this.add.graphics();
    hudBg.fillStyle(0x0f172a, 0.88);
    hudBg.fillRoundedRect(18, 18, 340, 98, 16);
    hudBg.lineStyle(2, 0x38bdf8, 0.5);
    hudBg.strokeRoundedRect(18, 18, 340, 98, 16);
    hudBg.setDepth(DEPTH_LAYERS.HUD);

    this.distanceText = this.add.text(32, 28, 'DISTANCE: 0m', {
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: '18px',
      color: '#facc15'
    }).setDepth(DEPTH_LAYERS.HUD);

    this.speedText = this.add.text(32, 53, 'SPEED: 0 KM/H', {
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: '15px',
      color: '#38bdf8'
    }).setDepth(DEPTH_LAYERS.HUD);

    this.waterDepthText = this.add.text(190, 53, 'WATER: SHALLOW', {
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: '13px',
      color: '#38bdf8'
    }).setDepth(DEPTH_LAYERS.HUD);

    // Engine Health Indicator
    this.add.text(32, 80, 'ENGINE:', {
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: '12px',
      color: '#94a3b8'
    }).setDepth(DEPTH_LAYERS.HUD);

    this.engineBar = this.add.graphics().setDepth(DEPTH_LAYERS.HUD);
    this.updateEngineBar(100);

    // Danger Warning Banner (Approaching Manhole or Heavy Hazard)
    this.dangerBanner = this.add.container(GAME_WIDTH / 2, 45).setDepth(DEPTH_LAYERS.HUD).setVisible(false);
    const bannerBg = this.add.graphics();
    bannerBg.fillStyle(0xdc2626, 0.92);
    bannerBg.fillRoundedRect(-180, -18, 360, 36, 10);
    bannerBg.lineStyle(2, 0xfacc15, 1);
    bannerBg.strokeRoundedRect(-180, -18, 360, 36, 10);
    this.dangerBanner.add(bannerBg);

    this.dangerText = this.add.text(0, 0, '🚨 DANGER: OPEN MANHOLE AHEAD!', {
      fontFamily: 'Fredoka, sans-serif',
      fontSize: '15px',
      color: '#ffffff'
    }).setOrigin(0.5);
    this.dangerBanner.add(this.dangerText);

    // Jump Ready indicator
    this.jumpCooldownGfx = this.add.graphics().setDepth(DEPTH_LAYERS.HUD);

    // Back to Menu button
    const backBtn = this.add.text(GAME_WIDTH - 110, 28, '🚪 MENU', {
      fontFamily: 'Fredoka, sans-serif',
      fontSize: '16px',
      color: '#f8fafc',
      backgroundColor: '#334155',
      padding: { x: 14, y: 8 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(DEPTH_LAYERS.HUD);

    backBtn.on('pointerdown', () => {
      AudioManager.getInstance().stopEngine();
      this.scene.start(SCENE_KEYS.MAIN_MENU);
    });
  }

  private updateEngineBar(pct: number): void {
    this.engineBar.clear();
    this.engineBar.fillStyle(0x334155, 1);
    this.engineBar.fillRoundedRect(95, 80, 160, 12, 6);

    const barColor = pct > 50 ? 0x22c55e : pct > 25 ? 0xeab308 : 0xef4444;
    this.engineBar.fillStyle(barColor, 1);
    this.engineBar.fillRoundedRect(96, 81, Math.max(0, (158 * pct) / 100), 10, 5);
  }

  private createMobileTouchControls(): void {
    const isMobile = !this.sys.game.device.os.desktop;
    if (!isMobile) return;

    // Mobile Steer Left
    const btnL = this.add.rectangle(90, GAME_HEIGHT - 75, 110, 75, 0x1e293b, 0.82)
      .setInteractive()
      .setDepth(DEPTH_LAYERS.HUD);
    this.add.text(90, GAME_HEIGHT - 75, '◀ LEFT', { fontFamily: 'Fredoka', fontSize: '18px', color: '#fff' })
      .setOrigin(0.5)
      .setDepth(DEPTH_LAYERS.HUD);

    btnL.on('pointerdown', () => { this.inputManager.touchState.steerLeft = true; });
    btnL.on('pointerup', () => { this.inputManager.touchState.steerLeft = false; });
    btnL.on('pointerout', () => { this.inputManager.touchState.steerLeft = false; });

    // Mobile Steer Right
    const btnR = this.add.rectangle(215, GAME_HEIGHT - 75, 110, 75, 0x1e293b, 0.82)
      .setInteractive()
      .setDepth(DEPTH_LAYERS.HUD);
    this.add.text(215, GAME_HEIGHT - 75, 'RIGHT ▶', { fontFamily: 'Fredoka', fontSize: '18px', color: '#fff' })
      .setOrigin(0.5)
      .setDepth(DEPTH_LAYERS.HUD);

    btnR.on('pointerdown', () => { this.inputManager.touchState.steerRight = true; });
    btnR.on('pointerup', () => { this.inputManager.touchState.steerRight = false; });
    btnR.on('pointerout', () => { this.inputManager.touchState.steerRight = false; });

    // Accelerate (GAS)
    const btnGas = this.add.rectangle(GAME_WIDTH - 295, GAME_HEIGHT - 75, 95, 75, 0x15803d, 0.85)
      .setInteractive()
      .setDepth(DEPTH_LAYERS.HUD);
    this.add.text(GAME_WIDTH - 295, GAME_HEIGHT - 75, '⚡ GAS', { fontFamily: 'Fredoka', fontSize: '17px', color: '#fff' })
      .setOrigin(0.5)
      .setDepth(DEPTH_LAYERS.HUD);

    btnGas.on('pointerdown', () => { this.inputManager.touchState.accelerate = true; });
    btnGas.on('pointerup', () => { this.inputManager.touchState.accelerate = false; });
    btnGas.on('pointerout', () => { this.inputManager.touchState.accelerate = false; });

    // Brake
    const btnBrake = this.add.rectangle(GAME_WIDTH - 190, GAME_HEIGHT - 75, 95, 75, 0xef4444, 0.85)
      .setInteractive()
      .setDepth(DEPTH_LAYERS.HUD);
    this.add.text(GAME_WIDTH - 190, GAME_HEIGHT - 75, '🛑 BRAKE', { fontFamily: 'Fredoka', fontSize: '16px', color: '#fff' })
      .setOrigin(0.5)
      .setDepth(DEPTH_LAYERS.HUD);

    btnBrake.on('pointerdown', () => { this.inputManager.touchState.brake = true; });
    btnBrake.on('pointerup', () => { this.inputManager.touchState.brake = false; });
    btnBrake.on('pointerout', () => { this.inputManager.touchState.brake = false; });

    // Jump
    const btnJump = this.add.rectangle(GAME_WIDTH - 85, GAME_HEIGHT - 75, 95, 75, 0x0284c7, 0.85)
      .setInteractive()
      .setDepth(DEPTH_LAYERS.HUD);
    this.add.text(GAME_WIDTH - 85, GAME_HEIGHT - 75, '🦘 JUMP', { fontFamily: 'Fredoka', fontSize: '16px', color: '#fff' })
      .setOrigin(0.5)
      .setDepth(DEPTH_LAYERS.HUD);

    btnJump.on('pointerdown', () => { this.inputManager.touchState.jump = true; });
    btnJump.on('pointerup', () => { this.inputManager.touchState.jump = false; });
  }

  private triggerLightning(): void {
    this.lightningGfx.clear();
    this.lightningGfx.fillStyle(0xe0f2fe, 0.85);
    this.lightningGfx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    this.lightningGfx.lineStyle(4, 0xffffff, 1);
    const startX = Phaser.Math.Between(GAME_WIDTH * 0.25, GAME_WIDTH * 0.75);
    let lx = startX;
    let ly = 10;
    this.lightningGfx.beginPath();
    this.lightningGfx.moveTo(lx, ly);

    while (ly < PerspectiveSystem.HORIZON_Y - 10) {
      lx += Phaser.Math.Between(-28, 28);
      ly += Phaser.Math.Between(15, 35);
      this.lightningGfx.lineTo(lx, ly);
    }
    this.lightningGfx.strokePath();

    this.cameras.main.shake(180, 0.008);

    this.time.delayedCall(80, () => {
      this.lightningGfx.clear();
      this.time.delayedCall(60, () => {
        this.lightningGfx.fillStyle(0x38bdf8, 0.3);
        this.lightningGfx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
        this.time.delayedCall(60, () => this.lightningGfx.clear());
      });
    });
  }

  private togglePause(): void {
    if (this.scene.isPaused()) {
      this.scene.resume();
    } else {
      this.scene.pause();
    }
  }

  override update(time: number, delta: number): void {
    if (this.isGameOver) return;

    this.inputManager.update();
    const dt = delta / 1000;
    const state = GameStateManager.getInstance();

    // 1. Determine Current Water Depth at camera track position
    const currentSegIdx = Math.floor(this.roadSystem.cameraPos / PerspectiveSystem.SEGMENT_LENGTH) % this.roadSystem.segments.length;
    const currentWaterDepth = this.roadSystem.segments[currentSegIdx]?.waterDepth || 1;

    // 2. Update Player Scooter (Physics, Steering, Jump, Water Drag, Lean, Sound)
    this.playerScooter.update(this.inputManager.state, currentWaterDepth, dt);

    const speedMps = (this.playerScooter.currentSpeed * 1000) / 3600;
    state.runStats.distance += speedMps * dt;
    state.runStats.speed = this.playerScooter.currentSpeed;

    // 3. Update Road System with Gapless Seamless Projection
    const cameraWorldX = this.playerScooter.normalizedX * (PerspectiveSystem.ROAD_WIDTH * 0.65);
    this.roadSystem.update(speedMps, cameraWorldX, dt);
    this.roadSystem.render(time);

    // 4. Update Obstacles System (Spawning & Pseudo-3D Perspective Projection)
    this.obstacleSystem.update(speedMps, state.runStats.distance);

    // 5. Update Collision System (Depth-based detection & reaction)
    this.collisionSystem.update();

    // 6. Camera Horizon Locked strictly Level (No camera roll tilting!)
    this.cameras.main.setAngle(0);

    // 7. Imminent Danger Warning Detection (Open manholes, barricades, deep craters ahead)
    const imminentHazard = this.obstacleSystem.getImminentDanger(this.roadSystem.cameraPos);
    if (imminentHazard) {
      this.dangerBanner.setVisible(true);
      let warningMsg = '⚠️ CAUTION: HAZARD AHEAD!';
      if (imminentHazard.type === 'OPEN_MANHOLE') warningMsg = '🚨 DANGER: OPEN MANHOLE AHEAD!';
      else if (imminentHazard.type === 'BARRICADE') warningMsg = '🚧 WARNING: POLICE BARRICADE!';
      else if (imminentHazard.type === 'POTHOLE_LARGE') warningMsg = '⚠️ WARNING: DEEP POTHOLE AHEAD!';
      this.dangerText.setText(warningMsg);
    } else {
      this.dangerBanner.setVisible(false);
    }

    // 8. Random Lightning Flash
    this.lightningTimer -= dt;
    if (this.lightningTimer <= 0) {
      this.triggerLightning();
      this.lightningTimer = Phaser.Math.FloatBetween(6.0, 14.0);
    }

    // 9. Update HUD Telemetry
    this.distanceText.setText(`DISTANCE: ${Math.floor(state.runStats.distance)}m`);
    this.speedText.setText(`SPEED: ${Math.round(this.playerScooter.currentSpeed)} KM/H`);

    const depthNames = ['DRY', 'SHALLOW', 'MODERATE', 'DEEP FLOOD', 'EXTREME'];
    const depthColors = ['#94a3b8', '#38bdf8', '#facc15', '#f87171', '#ef4444'];
    this.waterDepthText.setText(`WATER: ${depthNames[currentWaterDepth]}`);
    this.waterDepthText.setColor(depthColors[currentWaterDepth]);

    // Update Engine Health bar
    this.updateEngineBar(state.runStats.engineHealth);

    // 10. Check Game Over Condition
    if (state.runStats.engineHealth <= 0) {
      this.triggerGameOver();
    }

    // Reset one-shot jump trigger
    this.inputManager.state.jump = false;
  }

  private triggerGameOver(): void {
    if (this.isGameOver) return;
    this.isGameOver = true;
    AudioManager.getInstance().stopEngine();

    const state = GameStateManager.getInstance();
    if (state.runStats.distance > state.highDistance) {
      state.highDistance = Math.floor(state.runStats.distance);
      state.saveToStorage();
    }

    // Modal Background Overlay
    this.gameOverModal = this.add.container(0, 0).setDepth(DEPTH_LAYERS.MODALS);
    const bg = this.add.graphics();
    bg.fillStyle(0x09090b, 0.82);
    bg.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    this.gameOverModal.add(bg);

    const box = this.add.graphics();
    box.fillStyle(0x0f172a, 0.98);
    box.fillRoundedRect(GAME_WIDTH / 2 - 250, GAME_HEIGHT / 2 - 160, 500, 320, 20);
    box.lineStyle(3, 0xef4444, 0.9);
    box.strokeRoundedRect(GAME_WIDTH / 2 - 250, GAME_HEIGHT / 2 - 160, 500, 320, 20);
    this.gameOverModal.add(box);

    const title = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 110, '💥 SCOOTER BROKE DOWN!', {
      fontFamily: 'Fredoka, sans-serif',
      fontSize: '28px',
      color: '#ef4444'
    }).setOrigin(0.5);
    this.gameOverModal.add(title);

    const sub = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 68, state.runStats.causeOfDeath || 'কলকাতার রাস্তায় স্কুটার অচল!', {
      fontFamily: 'Fredoka, sans-serif',
      fontSize: '16px',
      color: '#facc15'
    }).setOrigin(0.5);
    this.gameOverModal.add(sub);

    const distTxt = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 15, `DISTANCE REACHED: ${Math.floor(state.runStats.distance)} METERS\nPOTHOLES / HAZARDS HIT: ${state.runStats.potholesHit}`, {
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: '15px',
      color: '#94a3b8',
      align: 'center'
    }).setOrigin(0.5);
    this.gameOverModal.add(distTxt);

    // Try Again Button
    const retryBtn = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 55, 200, 48, 0x15803d, 1)
      .setInteractive({ useHandCursor: true });
    const retryTxt = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 55, '🔄 TRY AGAIN', {
      fontFamily: 'Fredoka',
      fontSize: '18px',
      color: '#fff'
    }).setOrigin(0.5);
    this.gameOverModal.add(retryBtn);
    this.gameOverModal.add(retryTxt);

    retryBtn.on('pointerdown', () => {
      this.scene.restart();
    });

    // Space to retry
    this.input.keyboard?.once('keydown-SPACE', () => {
      this.scene.restart();
    });
  }
}
