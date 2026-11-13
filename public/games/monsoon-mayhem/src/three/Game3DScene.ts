import * as THREE from 'three';
import { ThreeCore } from './ThreeCore';
import { PlayerScooter3D } from './PlayerScooter3D';
import { Road3D } from './Road3D';
import { Environment3D } from './Environment3D';
import { Obstacles3D, Obstacle3DEntity } from './Obstacles3D';
import { Physics3D } from './Physics3D';
import { AudioManager } from '../systems/AudioManager';
import { GameStateManager } from '../game/GameState';

export class Game3DScene {
  private container: HTMLElement;
  public threeCore!: ThreeCore;
  public scooter!: PlayerScooter3D;
  public road!: Road3D;
  public environment!: Environment3D;
  public obstacles!: Obstacles3D;
  public physics!: Physics3D;

  private gameState: GameStateManager;
  private audio: AudioManager;

  // Running Loop state
  private isRunning = false;
  private isGameOver = false;
  private lastTime = 0;
  private distanceTraveled = 0;

  // Camera Shake
  private cameraShakeIntensity = 0;
  private cameraShakeTimer = 0;

  // HUD Elements
  private hudContainer!: HTMLElement;
  private telemetryText!: HTMLElement;
  private coordinateText!: HTMLElement;
  private healthFill!: HTMLElement;
  private healthText!: HTMLElement;
  private silencerFill!: HTMLElement;
  private silencerText!: HTMLElement;
  private warningBanner!: HTMLElement;
  private gameOverModal!: HTMLElement;
  private debugBtn!: HTMLElement;

  // Comic Bengali Speech Bubble
  private speechBubble!: HTMLElement;
  private speechBubbleTimer = 0;
  private lastShoutTime = 0;

  // Fullscreen Mud & Water Splatter Canvas
  private mudCanvas!: HTMLCanvasElement;
  private mudCtx!: CanvasRenderingContext2D | null;
  private mudDrops: Array<{ x: number; y: number; radius: number; color: string; alpha: number; dripSpeed: number }> = [];

  // Input Controls
  public input = {
    steerLeft: false,
    steerRight: false,
    accelerate: false,
    brake: false,
    jump: false
  };

  constructor(container: HTMLElement) {
    this.container = container;
    this.gameState = GameStateManager.getInstance();
    this.gameState.resetRun();
    this.audio = AudioManager.getInstance();
    (window as any).game3DScene = this;
    this.init();
  }

  private init(): void {
    // 1. Initialize Three.js Engine & Renderer (Daytime lighting, shadows, rain)
    this.threeCore = new ThreeCore(this.container);

    // 2. Initialize 3D Road Network (Centerline strictly at X = 0, Width = 12m)
    this.road = new Road3D(this.threeCore.scene);

    // 3. Initialize 3D Roadside Kolkata Environment
    this.environment = new Environment3D(this.threeCore.scene, this.road);

    // 4. Initialize 3D Obstacles, Traffic & Pickups
    this.obstacles = new Obstacles3D(this.threeCore.scene, this.road);

    // 5. Initialize 3D Player Scooter & Rider
    this.scooter = new PlayerScooter3D(this.threeCore.scene);

    // 6. Initialize Rapier 3D / Precise Wheel-Level Collision Engine
    this.physics = new Physics3D(this.threeCore.scene, this.scooter, this.obstacles);
    this.physics.onCameraShake = (durationMs, intensity) => {
      this.cameraShakeTimer = durationMs / 1000;
      this.cameraShakeIntensity = intensity;
    };

    this.physics.onCollisionOccurred = (obs) => {
      if (obs.type === 'BUS_WAVE' || obs.type.includes('WATER') || obs.type === 'POTHOLE_LARGE') {
        this.triggerMudSplatter();
      }
      if (obs.isPickup) {
        this.mudDrops = []; // Tea clears mud!
        this.showBengaliShout('☕ আহহ! মাটির ভাঁড়ের গরম চা! ফুল পাওয়ার!');
      }
    };

    // 7. Start Procedural Audio Engine
    this.audio.startEngine();

    // 8. Build Clean HUD, Mud Canvas, and Controls Overlay
    this.buildMudCanvas();
    this.buildHUD();
    this.setupControls();

    // 9. Start 60 FPS Render Loop
    this.isRunning = true;
    this.lastTime = performance.now();
    requestAnimationFrame((t) => this.gameLoop(t));
  }

  private buildMudCanvas(): void {
    this.mudCanvas = document.createElement('canvas');
    this.mudCanvas.id = 'mud-canvas';
    this.mudCanvas.width = 1280;
    this.mudCanvas.height = 720;
    this.mudCanvas.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 95;
    `;
    this.mudCtx = this.mudCanvas.getContext('2d');
    this.container.appendChild(this.mudCanvas);
  }

  public triggerMudSplatter(): void {
    if (!this.mudCtx) return;
    const colors = ['rgba(120, 53, 15, ', 'rgba(180, 83, 9, ', 'rgba(69, 26, 3, ', 'rgba(30, 41, 59, '];
    for (let i = 0; i < 28; i++) {
      this.mudDrops.push({
        x: Math.random() * this.mudCanvas.width,
        y: Math.random() * this.mudCanvas.height,
        radius: 8 + Math.random() * 26,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 0.85 + Math.random() * 0.15,
        dripSpeed: 1.5 + Math.random() * 3.5
      });
    }
  }

  private updateMudCanvas(dt: number): void {
    if (!this.mudCtx) return;
    this.mudCtx.clearRect(0, 0, this.mudCanvas.width, this.mudCanvas.height);

    for (let i = this.mudDrops.length - 1; i >= 0; i--) {
      const drop = this.mudDrops[i];
      drop.alpha -= 0.28 * dt; // Mud lasts ~3.5 seconds
      drop.y += drop.dripSpeed * 35 * dt;

      if (drop.alpha <= 0) {
        this.mudDrops.splice(i, 1);
        continue;
      }

      this.mudCtx.fillStyle = `${drop.color}${drop.alpha})`;
      this.mudCtx.beginPath();
      this.mudCtx.arc(drop.x, drop.y, drop.radius, 0, Math.PI * 2);
      this.mudCtx.fill();

      // Drip trail
      this.mudCtx.beginPath();
      this.mudCtx.moveTo(drop.x - drop.radius * 0.4, drop.y);
      this.mudCtx.lineTo(drop.x, drop.y - drop.radius * 1.8);
      this.mudCtx.lineTo(drop.x + drop.radius * 0.4, drop.y);
      this.mudCtx.fill();
    }
  }

  public showBengaliShout(text: string): void {
    this.speechBubble.innerText = text;
    this.speechBubble.style.display = 'block';
    this.speechBubbleTimer = 2.2;
    this.audio.speakBengali(text);
  }

  private buildHUD(): void {
    this.hudContainer = document.createElement('div');
    this.hudContainer.id = 'hud-overlay';
    this.hudContainer.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      font-family: 'Fredoka', cursive, sans-serif;
      z-index: 100;
      overflow: hidden;
    `;

    // 1. Top-Left Telemetry & Health Panel
    const statsBox = document.createElement('div');
    statsBox.style.cssText = `
      position: absolute;
      top: 20px;
      left: 20px;
      background: rgba(15, 23, 42, 0.92);
      border: 2px solid #38bdf8;
      border-radius: 14px;
      padding: 14px 20px;
      min-width: 320px;
      color: #fff;
      box-shadow: 0 8px 30px rgba(0,0,0,0.5);
    `;

    this.telemetryText = document.createElement('div');
    this.telemetryText.style.cssText = "font-family: 'JetBrains Mono', monospace; font-size: 18px; color: #facc15; font-weight: bold;";
    this.telemetryText.innerText = 'SPEED: 0 KM/H | DIST: 0m';
    statsBox.appendChild(this.telemetryText);

    // Scooter Health Bar
    const healthRow = document.createElement('div');
    healthRow.style.cssText = 'display: flex; align-items: center; gap: 10px; margin-top: 10px;';

    const healthLabel = document.createElement('span');
    healthLabel.style.cssText = 'font-size: 12px; font-weight: bold; color: #94a3b8; width: 72px;';
    healthLabel.innerText = 'HEALTH:';
    healthRow.appendChild(healthLabel);

    const healthTrack = document.createElement('div');
    healthTrack.style.cssText = 'flex: 1; height: 12px; background: #334155; border-radius: 6px; overflow: hidden;';
    this.healthFill = document.createElement('div');
    this.healthFill.style.cssText = 'width: 100%; height: 100%; background: #22c55e; transition: width 0.2s ease;';
    healthTrack.appendChild(this.healthFill);
    healthRow.appendChild(healthTrack);

    this.healthText = document.createElement('span');
    this.healthText.style.cssText = "font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: bold; color: #22c55e; width: 44px; text-align: right;";
    this.healthText.innerText = '100%';
    healthRow.appendChild(this.healthText);
    statsBox.appendChild(healthRow);

    // Silencer Exhaust Flooding Bar
    const silencerRow = document.createElement('div');
    silencerRow.style.cssText = 'display: flex; align-items: center; gap: 10px; margin-top: 8px;';

    const silencerLabel = document.createElement('span');
    silencerLabel.style.cssText = 'font-size: 12px; font-weight: bold; color: #38bdf8; width: 72px;';
    silencerLabel.innerText = 'SILENCER:';
    silencerRow.appendChild(silencerLabel);

    const silencerTrack = document.createElement('div');
    silencerTrack.style.cssText = 'flex: 1; height: 12px; background: #334155; border-radius: 6px; overflow: hidden;';
    this.silencerFill = document.createElement('div');
    this.silencerFill.style.cssText = 'width: 0%; height: 100%; background: #38bdf8; transition: width 0.2s ease;';
    silencerTrack.appendChild(this.silencerFill);
    silencerRow.appendChild(silencerTrack);

    this.silencerText = document.createElement('span');
    this.silencerText.style.cssText = "font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: bold; color: #38bdf8; width: 44px; text-align: right;";
    this.silencerText.innerText = '0%';
    silencerRow.appendChild(this.silencerText);
    statsBox.appendChild(silencerRow);

    this.coordinateText = document.createElement('div');
    this.coordinateText.style.cssText = "font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #94a3b8; margin-top: 8px;";
    this.coordinateText.innerText = 'POS: X: 0.0m | Y: 0.0m | Z: 0.0m';
    statsBox.appendChild(this.coordinateText);

    const helpText = document.createElement('div');
    helpText.style.cssText = 'font-size: 11px; color: #38bdf8; margin-top: 8px; border-top: 1px solid rgba(255,255,255,0.15); padding-top: 6px;';
    helpText.innerText = 'W Gas (Clear Silencer) | S Brake | A/D Steer | Space Jump | F1 Wireframes';
    statsBox.appendChild(helpText);

    this.hudContainer.appendChild(statsBox);

    // 2. Comic Bengali Speech Bubble (Center-Screen Pop)
    this.speechBubble = document.createElement('div');
    this.speechBubble.id = 'rider-speech-bubble';
    this.speechBubble.style.cssText = `
      position: absolute;
      top: 180px;
      left: 50%;
      transform: translateX(-50%);
      background: #fef08a;
      color: #000;
      border: 3px solid #000;
      border-radius: 20px;
      padding: 10px 24px;
      font-size: 20px;
      font-weight: 900;
      box-shadow: 4px 6px 0px rgba(0,0,0,0.8);
      display: none;
      z-index: 150;
      pointer-events: none;
      animation: pop 0.25s ease-out;
    `;
    this.hudContainer.appendChild(this.speechBubble);

    // 3. Top-Right Debug Toggle Button
    this.debugBtn = document.createElement('button');
    this.debugBtn.innerText = '🛠️ [F1] Colliders: OFF';
    this.debugBtn.style.cssText = `
      position: absolute;
      top: 20px;
      right: 20px;
      background: rgba(30, 41, 59, 0.85);
      border: 1px solid #64748b;
      color: #94a3b8;
      border-radius: 8px;
      padding: 8px 14px;
      font-size: 13px;
      font-weight: bold;
      cursor: pointer;
      pointer-events: auto;
    `;
    this.debugBtn.addEventListener('click', () => this.toggleColliderDebug());
    this.hudContainer.appendChild(this.debugBtn);

    // 4. Imminent Danger Warning Banner (Center Screen Top)
    this.warningBanner = document.createElement('div');
    this.warningBanner.style.cssText = `
      position: absolute;
      top: 85px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(220, 38, 38, 0.95);
      border: 2px solid #fef08a;
      border-radius: 30px;
      padding: 10px 28px;
      color: #fff;
      font-size: 17px;
      font-weight: 800;
      letter-spacing: 1px;
      box-shadow: 0 4px 20px rgba(220, 38, 38, 0.6);
      display: none;
    `;
    this.hudContainer.appendChild(this.warningBanner);

    // 5. Mobile Multi-Touch Controls (Bottom)
    this.buildMobileControls();

    // 6. Game Over Modal Overlay
    this.buildGameOverModal();

    this.container.appendChild(this.hudContainer);
  }

  private toggleColliderDebug(): void {
    const isDebug = this.physics.toggleDebugMode();
    this.debugBtn.innerText = isDebug ? '🟢 [F1] Colliders: ON' : '🛠️ [F1] Colliders: OFF';
    this.debugBtn.style.borderColor = isDebug ? '#22c55e' : '#64748b';
    this.debugBtn.style.color = isDebug ? '#22c55e' : '#94a3b8';
  }

  private buildMobileControls(): void {
    const touchPanel = document.createElement('div');
    touchPanel.style.cssText = `
      position: absolute;
      bottom: 20px;
      left: 0;
      width: 100%;
      display: flex;
      justify-content: space-between;
      padding: 0 25px;
      pointer-events: none;
    `;

    // Left Steering Buttons
    const steerGroup = document.createElement('div');
    steerGroup.style.cssText = 'display: flex; gap: 12px; pointer-events: auto;';

    const btnL = this.createTouchButton('◀ LEFT', '#1e293b', () => { this.input.steerLeft = true; }, () => { this.input.steerLeft = false; });
    const btnR = this.createTouchButton('RIGHT ▶', '#1e293b', () => { this.input.steerRight = true; }, () => { this.input.steerRight = false; });
    steerGroup.appendChild(btnL);
    steerGroup.appendChild(btnR);
    touchPanel.appendChild(steerGroup);

    // Right Action Buttons (GAS, BRAKE, JUMP)
    const actGroup = document.createElement('div');
    actGroup.style.cssText = 'display: flex; gap: 12px; pointer-events: auto;';

    const btnGas = this.createTouchButton('⚡ GAS', '#15803d', () => { this.input.accelerate = true; }, () => { this.input.accelerate = false; });
    const btnBrake = this.createTouchButton('🛑 BRAKE', '#ef4444', () => { this.input.brake = true; }, () => { this.input.brake = false; });
    const btnJump = this.createTouchButton('🦘 JUMP', '#0284c7', () => { this.input.jump = true; }, () => { this.input.jump = false; });

    actGroup.appendChild(btnGas);
    actGroup.appendChild(btnBrake);
    actGroup.appendChild(btnJump);
    touchPanel.appendChild(actGroup);

    this.hudContainer.appendChild(touchPanel);
  }

  private createTouchButton(label: string, bg: string, onDown: () => void, onUp: () => void): HTMLElement {
    const btn = document.createElement('button');
    btn.innerText = label;
    btn.style.cssText = `
      background: ${bg};
      color: #fff;
      border: 1px solid rgba(255,255,255,0.25);
      border-radius: 12px;
      padding: 16px 20px;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
      user-select: none;
      touch-action: none;
      box-shadow: 0 4px 16px rgba(0,0,0,0.5);
    `;

    btn.addEventListener('pointerdown', (e) => { e.preventDefault(); onDown(); });
    btn.addEventListener('pointerup', (e) => { e.preventDefault(); onUp(); });
    btn.addEventListener('pointercancel', (e) => { e.preventDefault(); onUp(); });
    return btn;
  }

  private buildGameOverModal(): void {
    this.gameOverModal = document.createElement('div');
    this.gameOverModal.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(15, 23, 42, 0.88);
      backdrop-filter: blur(6px);
      display: none;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      pointer-events: auto;
      z-index: 200;
    `;

    const box = document.createElement('div');
    box.style.cssText = `
      background: #1e293b;
      border: 3px solid #ef4444;
      border-radius: 20px;
      padding: 30px 40px;
      text-align: center;
      color: #fff;
      max-width: 480px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.8);
    `;

    const title = document.createElement('h1');
    title.innerText = '💥 SCOOTER BROKEN DOWN!';
    title.style.cssText = 'color: #ef4444; font-size: 28px; margin-bottom: 12px;';
    box.appendChild(title);

    const causeText = document.createElement('div');
    causeText.id = 'modal-cause-text';
    causeText.style.cssText = 'color: #cbd5e1; font-size: 17px; margin-bottom: 20px; font-style: italic;';
    box.appendChild(causeText);

    const statsDetail = document.createElement('div');
    statsDetail.id = 'modal-stats-detail';
    statsDetail.style.cssText = "font-family: 'JetBrains Mono', monospace; background: #0f172a; border-radius: 10px; padding: 15px; margin-bottom: 25px; color: #facc15; font-size: 15px; text-align: left;";
    box.appendChild(statsDetail);

    const retryBtn = document.createElement('button');
    retryBtn.innerText = '🔧 REPAIR & RETRY';
    retryBtn.style.cssText = `
      background: #22c55e;
      color: #000;
      border: none;
      border-radius: 12px;
      padding: 14px 28px;
      font-size: 18px;
      font-weight: 800;
      cursor: pointer;
      box-shadow: 0 4px 16px rgba(34, 197, 94, 0.4);
    `;
    retryBtn.addEventListener('click', () => this.restartGame());
    box.appendChild(retryBtn);

    this.gameOverModal.appendChild(box);
    this.hudContainer.appendChild(this.gameOverModal);
  }

  private triggerGameOver(): void {
    if (this.isGameOver) return;
    this.isGameOver = true;
    this.scooter.currentSpeedKmh = 0;
    this.audio.stopEngine();

    const cause = this.gameState.runStats.causeOfDeath || 'Engine Knocked Out by Severe Kolkata Monsoon Chaos!';
    const causeEl = document.getElementById('modal-cause-text');
    if (causeEl) causeEl.innerText = `"${cause}"`;

    const statsEl = document.getElementById('modal-stats-detail');
    if (statsEl) {
      statsEl.innerHTML = `
        <div>📍 Distance Traveled: <b>${Math.floor(this.distanceTraveled)}m</b></div>
        <div style="margin-top: 6px;">🕳️ Hazards / Potholes Encountered: <b>${this.gameState.runStats.potholesHit}</b></div>
      `;
    }

    this.gameOverModal.style.display = 'flex';
  }

  private restartGame(): void {
    this.gameState.resetRun();
    this.scooter.position.set(0, 0, 0);
    this.scooter.currentSpeedKmh = 0;
    this.scooter.leanAngle = 0;
    this.scooter.steerAngle = 0;
    this.scooter.exhaustWaterLevel = 0;
    this.distanceTraveled = 0;
    this.mudDrops = [];
    this.isGameOver = false;
    this.gameOverModal.style.display = 'none';

    // Clear active obstacles and respawn
    for (const obs of this.obstacles.activeObstacles) {
      this.obstacles.group.remove(obs.mesh);
    }
    this.obstacles.activeObstacles = [];
    (this.obstacles as any).lastSpawnZ = -30;
    (this.obstacles as any).spawnInitialObstacles();

    this.audio.startEngine();
  }

  private setupControls(): void {
    window.addEventListener('keydown', (e) => {
      if (e.code === 'KeyW' || e.code === 'ArrowUp') this.input.accelerate = true;
      if (e.code === 'KeyS' || e.code === 'ArrowDown') this.input.brake = true;
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') this.input.steerLeft = true;
      if (e.code === 'KeyD' || e.code === 'ArrowRight') this.input.steerRight = true;
      if (e.code === 'Space') this.input.jump = true;
      if (e.code === 'F1') {
        e.preventDefault();
        this.toggleColliderDebug();
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.code === 'KeyW' || e.code === 'ArrowUp') this.input.accelerate = false;
      if (e.code === 'KeyS' || e.code === 'ArrowDown') this.input.brake = false;
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') this.input.steerLeft = false;
      if (e.code === 'KeyD' || e.code === 'ArrowRight') this.input.steerRight = false;
      if (e.code === 'Space') this.input.jump = false;
    });
  }

  private gameLoop(time: number): void {
    if (!this.isRunning) return;

    const dt = Math.min((time - this.lastTime) / 1000, 0.1);
    this.lastTime = time;

    this.update(dt);
    this.threeCore.render();

    requestAnimationFrame((t) => this.gameLoop(t));
  }

  private update(dt: number): void {
    if (this.isGameOver) return;

    // 1. Update Scooter Driving Physics & Synchronized 3D Translation
    this.scooter.update(this.input, 0, dt);

    // 2. Track Forward Distance Traveled
    const speedMps = (this.scooter.currentSpeedKmh * 1000) / 3600;
    this.distanceTraveled += speedMps * dt;

    // Reset one-shot jump trigger
    this.input.jump = false;

    // 3. Update Road Chunks Recycling
    this.road.update(this.scooter.position.z);

    // 4. Update Roadside 3D Kolkata Environment Props Recycling
    this.environment.update(this.scooter.position.z);

    // 5. Update 3D Obstacles, Moving Traffic & Pickups
    this.obstacles.update(this.scooter.position.z, this.distanceTraveled, dt);

    // 6. Precise 3D Wheel-Level Collision Detection
    this.physics.update();

    // 7. Update Directional Sunlight and Rain particles
    this.threeCore.update(dt, this.scooter.position.z);

    // 8. STABLE THIRD-PERSON CAMERA FOLLOW + DYNAMIC SPEED FOV
    this.updateCameraFollow(dt);

    // 9. Update Mud Splatter Canvas
    this.updateMudCanvas(dt);

    // 10. Update Speech Bubble Timer
    if (this.speechBubbleTimer > 0) {
      this.speechBubbleTimer -= dt;
      if (this.speechBubbleTimer <= 0) {
        this.speechBubble.style.display = 'none';
      }
    }

    // 11. Exhaust Silencer Water Drowning check
    if (this.scooter.exhaustWaterLevel >= 100) {
      this.gameState.runStats.engineHealth -= 20 * dt;
      this.gameState.runStats.causeOfDeath = 'Exhaust Drowned in Flooded Water! (সাইলেন্সারে জল ঢুকে ইঞ্জিন বন্ধ!)';
    }

    // 12. Update HUD Telemetry, Condition Bar, and Danger Banner
    this.updateHUD();

    // 13. Check Game Over Condition
    if (this.gameState.runStats.engineHealth <= 0) {
      this.triggerGameOver();
    }
  }

  private updateCameraFollow(dt: number): void {
    const cam = this.threeCore.camera;
    const scooterPos = this.scooter.position;

    // Camera sits rigidly behind the scooter in Z & Y, with smooth lateral tracking
    const targetCamX = scooterPos.x * 0.65;
    const targetCamY = 2.3 + this.scooter.jumpHeight * 0.35;
    const targetCamZ = scooterPos.z + 5.2;

    cam.position.x = THREE.MathUtils.lerp(cam.position.x, targetCamX, 16.0 * dt);
    cam.position.y = targetCamY;
    cam.position.z = targetCamZ;

    // Dynamic Speed Sensation: Camera FOV expands as speed increases
    const speedRatio = Math.min(1.0, this.scooter.currentSpeedKmh / 85);
    const targetFov = 53 + speedRatio * 8.0;
    cam.fov = THREE.MathUtils.lerp(cam.fov, targetFov, 5.0 * dt);
    cam.updateProjectionMatrix();

    // Camera Shake Decay
    if (this.cameraShakeTimer > 0) {
      this.cameraShakeTimer -= dt;
      const shakeAmt = this.cameraShakeIntensity * (this.cameraShakeTimer > 0 ? 1 : 0);
      cam.position.x += (Math.random() - 0.5) * shakeAmt;
      cam.position.y += (Math.random() - 0.5) * shakeAmt;
    }

    // Camera looks forward along the road (-Z direction): HORIZON STRICTLY LEVEL!
    cam.lookAt(scooterPos.x * 0.35, 1.1 + this.scooter.jumpHeight * 0.3, scooterPos.z - 16.0);
    cam.rotation.z = 0;
  }

  private updateHUD(): void {
    // Speed & Distance
    this.telemetryText.innerText = `SPEED: ${Math.round(this.scooter.currentSpeedKmh)} KM/H | DIST: ${Math.floor(this.distanceTraveled)}m`;
    this.coordinateText.innerText = `POS: X: ${this.scooter.position.x.toFixed(2)}m | Y: ${this.scooter.position.y.toFixed(2)}m | Z: ${this.scooter.position.z.toFixed(1)}m`;

    // Engine Condition / Health
    const health = Math.max(0, Math.round(this.gameState.runStats.engineHealth));
    this.healthFill.style.width = `${health}%`;
    this.healthText.innerText = `${health}%`;

    let color = '#22c55e';
    if (health <= 30) color = '#ef4444';
    else if (health <= 60) color = '#eab308';
    this.healthFill.style.background = color;
    this.healthText.style.color = color;

    // Silencer Exhaust Flooding Bar
    const waterLvl = Math.round(this.scooter.exhaustWaterLevel);
    this.silencerFill.style.width = `${waterLvl}%`;
    this.silencerText.innerText = `${waterLvl}%`;

    let silencerColor = '#38bdf8';
    if (waterLvl > 75) {
      silencerColor = '#ef4444';
      if (performance.now() - this.lastShoutTime > 6000) {
        this.showBengaliShout('⚠️ সাইলেন্সারে জল ঢুকলো রে! এক্সিলারেটর চাপ!');
        this.lastShoutTime = performance.now();
      }
    } else if (waterLvl > 40) {
      silencerColor = '#facc15';
    }
    this.silencerFill.style.background = silencerColor;
    this.silencerText.style.color = silencerColor;

    // Scan for Imminent Obstacles Ahead (within 32m)
    let closestObs: Obstacle3DEntity | null = null;
    let closestDist = 999;
    const playerZ = this.scooter.position.z;

    for (const obs of this.obstacles.activeObstacles) {
      const dist = playerZ - obs.worldPos.z;
      if (dist > 0 && dist < 32 && !obs.hasCollided && !obs.isPickup) {
        if (dist < closestDist) {
          closestDist = dist;
          closestObs = obs;
        }
      }
    }

    if (closestObs && closestDist < 26) {
      this.warningBanner.style.display = 'block';
      const distM = Math.round(closestDist);

      if (closestObs.type === 'BUS_WAVE') {
        this.warningBanner.style.background = 'rgba(2, 132, 199, 0.95)';
        this.warningBanner.innerText = `🌊 GIANT BUS WAVE (${distM}m) — JUMP!`;
        if (performance.now() - this.lastShoutTime > 5000) {
          this.showBengaliShout('🌊 বাসের ঢেউ আসছে রে! জাম্প কর!');
          this.lastShoutTime = performance.now();
        }
      } else if (closestObs.type === 'KOLKATA_BUS') {
        this.warningBanner.style.background = 'rgba(2, 132, 199, 0.95)';
        this.warningBanner.innerText = `🚌 SPEEDING BUS AHEAD (${distM}m) — CHANGE LANE!`;
        if (performance.now() - this.lastShoutTime > 6000) {
          this.showBengaliShout('🚌 ওরে বাবারে! বাস আসছে!');
          this.lastShoutTime = performance.now();
        }
      } else if (closestObs.type === 'AUTO_RICKSHAW') {
        this.warningBanner.style.background = 'rgba(21, 128, 61, 0.95)';
        this.warningBanner.innerText = `🛺 ERRATIC AUTO-RICKSHAW (${distM}m) — DODGE!`;
        if (performance.now() - this.lastShoutTime > 5000) {
          this.showBengaliShout('🛺 অটোওয়ালা মারল রে! সাইড নে!');
          this.lastShoutTime = performance.now();
        }
      } else if (closestObs.type === 'ELECTRIC_WIRE') {
        this.warningBanner.style.background = 'rgba(14, 165, 233, 0.95)';
        this.warningBanner.innerText = `⚡ SPARKING ELECTRIC WIRE (${distM}m) — JUMP!`;
      } else if (closestObs.type === 'YELLOW_TAXI') {
        this.warningBanner.style.background = 'rgba(202, 138, 4, 0.95)';
        this.warningBanner.innerText = `🚖 AMBASSADOR TAXI AHEAD (${distM}m) — OVERTAKE!`;
      } else if (closestObs.type === 'OPEN_MANHOLE') {
        this.warningBanner.style.background = 'rgba(220, 38, 38, 0.95)';
        this.warningBanner.innerText = `🚨 DANGER: OPEN MANHOLE (${distM}m) — JUMP!`;
      } else if (closestObs.type === 'BARRICADE') {
        this.warningBanner.style.background = 'rgba(234, 88, 12, 0.95)';
        this.warningBanner.innerText = `🚧 BARRICADE AHEAD (${distM}m) — STEER CLEAR!`;
      } else if (closestObs.type.includes('POTHOLE')) {
        this.warningBanner.style.background = 'rgba(202, 138, 4, 0.95)';
        this.warningBanner.innerText = `⚠️ POTHOLE AHEAD (${distM}m)`;
      } else {
        this.warningBanner.style.background = 'rgba(202, 138, 4, 0.9)';
        this.warningBanner.innerText = `⚠️ HAZARD AHEAD (${distM}m)`;
      }
    } else {
      this.warningBanner.style.display = 'none';
    }
  }

  public destroy(): void {
    this.isRunning = false;
    this.audio.stopEngine();
    this.threeCore.renderer.dispose();
    this.container.innerHTML = '';
  }
}
