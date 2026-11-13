import Phaser from 'phaser';
import { SCENE_KEYS, GAME_WIDTH, GAME_HEIGHT, DEPTH_LAYERS } from '../game/GameConstants';
import { GameStateManager } from '../game/GameState';

export class MainMenuScene extends Phaser.Scene {
  private rainEmitter!: Phaser.GameObjects.Particles.ParticleEmitter;
  private scooterSprite!: Phaser.GameObjects.Sprite;

  constructor() {
    super(SCENE_KEYS.MAIN_MENU);
  }

  create(): void {
    const state = GameStateManager.getInstance();
    state.currentState = 'MAIN_MENU';

    // 1. Dark Monsoon Sky & Background
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x0284c7, 0x0284c7, 0x090d16, 0x090d16, 1);
    bg.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // 2. Continuous Rain Particles
    this.createRainEffect();

    // 3. Flooded Street Reflection at bottom
    const water = this.add.graphics();
    water.fillStyle(0x0369a1, 0.4);
    water.fillRect(0, GAME_HEIGHT - 180, GAME_WIDTH, 180);

    // 4. Scooter Illustration in Center Bottom
    this.scooterSprite = this.add.sprite(GAME_WIDTH / 2, GAME_HEIGHT - 130, 'vehicle_old_chetak');
    this.scooterSprite.setScale(1.0);
    this.scooterSprite.setDepth(DEPTH_LAYERS.PLAYER);

    // Idle vibration
    this.tweens.add({
      targets: this.scooterSprite,
      y: GAME_HEIGHT - 134,
      duration: 120,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // 5. Title & Tagline
    const title = this.add.text(GAME_WIDTH / 2, 110, '🌧️ MONSOON MAYHEM', {
      fontFamily: 'Fredoka, sans-serif',
      fontSize: '62px',
      color: '#facc15'
    }).setOrigin(0.5);

    title.setStroke('#020617', 10);
    title.setShadow(0, 8, 'rgba(0,0,0,0.6)', 12, true, true);

    const taglineEn = this.add.text(GAME_WIDTH / 2, 180, 'KOLKATA ROADS. YOUR WORST NIGHTMARE.', {
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: '18px',
      color: '#38bdf8'
    }).setOrigin(0.5);

    const taglineBn = this.add.text(GAME_WIDTH / 2, 215, '"বাড়ি ফিরতে বেরিয়েছিলাম, সাবমেরিন হয়ে গেলাম!"', {
      fontFamily: 'Fredoka, sans-serif',
      fontSize: '20px',
      color: '#fef08a'
    }).setOrigin(0.5);

    // 6. Stats Bar (Best Distance & Coins)
    const statsBg = this.add.graphics();
    statsBg.fillStyle(0x1e293b, 0.85);
    statsBg.fillRoundedRect(GAME_WIDTH / 2 - 220, 260, 440, 48, 16);
    statsBg.lineStyle(2, 0x38bdf8, 0.5);
    statsBg.strokeRoundedRect(GAME_WIDTH / 2 - 220, 260, 440, 48, 16);

    this.add.text(GAME_WIDTH / 2 - 130, 284, `🏆 BEST: ${state.highDistance}m`, {
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: '16px',
      color: '#4ade80'
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2 + 130, 284, `🪙 COINS: ${state.totalCoins}`, {
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: '16px',
      color: '#facc15'
    }).setOrigin(0.5);

    // 7. Interactive PLAY Button
    this.createButton(GAME_WIDTH / 2, 380, '🚗 ড্রাইভ শুরু করুন (START RUN)', 0x22c55e, () => {
      this.scene.start(SCENE_KEYS.GAME);
    });

    // Sub-buttons: Garage & Daily Challenge (Future-ready)
    this.createButton(GAME_WIDTH / 2 - 140, 460, '🔧 গ্যারেজ (GARAGE)', 0x0284c7, () => {
      // Future Garage Scene
    }, 240, 44, 15);

    this.createButton(GAME_WIDTH / 2 + 140, 460, '📅 ডেইলি চ্যালেঞ্জ', 0xeab308, () => {
      // Future Daily Challenge Scene
    }, 240, 44, 15);
  }

  private createRainEffect(): void {
    this.rainEmitter = this.add.particles(0, 0, 'rain_drop', {
      x: { min: 0, max: GAME_WIDTH + 200 },
      y: -20,
      speedY: { min: 600, max: 850 },
      speedX: { min: -120, max: -80 },
      scaleY: { min: 0.8, max: 1.4 },
      alpha: { min: 0.3, max: 0.7 },
      lifespan: 1200,
      frequency: 18
    });
    this.rainEmitter.setDepth(DEPTH_LAYERS.WEATHER_RAIN);
  }

  private createButton(
    x: number,
    y: number,
    text: string,
    color: number,
    callback: () => void,
    width = 340,
    height = 56,
    fontSize = 19
  ): Phaser.GameObjects.Container {
    const container = this.add.container(x, y);

    const btnBg = this.add.graphics();
    btnBg.fillStyle(color, 1);
    btnBg.fillRoundedRect(-width / 2, -height / 2, width, height, 18);
    btnBg.lineStyle(2, 0xffffff, 0.4);
    btnBg.strokeRoundedRect(-width / 2, -height / 2, width, height, 18);

    const btnText = this.add.text(0, 0, text, {
      fontFamily: 'Fredoka, sans-serif',
      fontSize: `${fontSize}px`,
      color: '#ffffff'
    }).setOrigin(0.5);

    container.add([btnBg, btnText]);
    container.setSize(width, height);
    container.setInteractive({ useHandCursor: true });

    container.on('pointerover', () => {
      container.setScale(1.04);
    });

    container.on('pointerout', () => {
      container.setScale(1.0);
    });

    container.on('pointerdown', () => {
      container.setScale(0.96);
      callback();
    });

    return container;
  }
}
