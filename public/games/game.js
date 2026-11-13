// Dino Escape: Adventure Game - Core Engine
// Handles canvas rendering, game loop, physics, animations, and state management.

(function () {
  'use strict';

  // Polyfill roundRect if needed
  if (typeof CanvasRenderingContext2D !== 'undefined' && !CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
      if (typeof r === 'undefined') r = 5;
      if (typeof r === 'number') r = { tl: r, tr: r, br: r, bl: r };
      this.beginPath();
      this.moveTo(x + r.tl, y);
      this.lineTo(x + w - r.tr, y);
      this.quadraticCurveTo(x + w, y, x + w, y + r.tr);
      this.lineTo(x + w, y + h - r.br);
      this.quadraticCurveTo(x + w, y + h, x + w - r.br, y + h);
      this.lineTo(x + r.bl, y + h);
      this.quadraticCurveTo(x, y + h, x, y + h - r.bl);
      this.lineTo(x, y + r.tl);
      this.quadraticCurveTo(x, y, x + r.tl, y);
      this.closePath();
      return this;
    };
  }

  // --- Constants & Config ---
  const CANVAS_WIDTH = 960;
  const CANVAS_HEIGHT = 540;
  const GROUND_Y = 440;
  const GRAVITY = 0.65;
  const JUMP_FORCE = -13.5;
  const DOUBLE_JUMP_FORCE = -11.5;

  // Dinosaur Skins
  const SKINS = {
    green: {
      name: 'Emerald Rex',
      body: '#2e7d32',
      belly: '#81c784',
      spines: '#ff9800',
      eye: '#ffffff',
      pupil: '#1b5e20',
      glow: 'rgba(76, 175, 80, 0.4)'
    },
    volcano: {
      name: 'Magma Dino',
      body: '#262626',
      belly: '#ff5722',
      spines: '#ffeb3b',
      eye: '#fff',
      pupil: '#d84315',
      glow: 'rgba(255, 87, 34, 0.6)'
    },
    cyber: {
      name: 'Cyber Neon',
      body: '#00bcd4',
      belly: '#e91e63',
      spines: '#00e676',
      eye: '#fff',
      pupil: '#006064',
      glow: 'rgba(0, 229, 255, 0.6)'
    },
    golden: {
      name: 'Golden Fossil',
      body: '#fbc02d',
      belly: '#fff9c4',
      spines: '#f57c00',
      eye: '#fff',
      pupil: '#e65100',
      glow: 'rgba(255, 215, 0, 0.6)'
    }
  };

  // Biomes configuration
  const BIOMES = [
    {
      name: 'Jurassic Jungle',
      skyTop: '#1a2a3a',
      skyBottom: '#ff7043',
      mountainColor: '#2b394a',
      treeColor: '#1e382b',
      groundColor: '#385723',
      groundBase: '#263b18',
      lavaGlow: false
    },
    {
      name: 'Volcanic Ridge',
      skyTop: '#2b0f0f',
      skyBottom: '#d84315',
      mountainColor: '#3e1b1b',
      treeColor: '#42281d',
      groundColor: '#4e342e',
      groundBase: '#2c1e1a',
      lavaGlow: true
    },
    {
      name: 'Obsidian Canyons',
      skyTop: '#1b1429',
      skyBottom: '#7b1fa2',
      mountainColor: '#2d203f',
      treeColor: '#2e1c38',
      groundColor: '#30263d',
      groundBase: '#1a1424',
      lavaGlow: false
    }
  ];

  class Game {
    constructor() {
      this.canvas = document.getElementById('gameCanvas');
      this.ctx = this.canvas.getContext('2d');
      this.canvas.width = CANVAS_WIDTH;
      this.canvas.height = CANVAS_HEIGHT;

      // State
      this.state = 'MENU'; // 'MENU', 'PLAYING', 'PAUSED', 'GAMEOVER'
      this.score = 0;
      this.distance = 0;
      this.highScore = parseInt(localStorage.getItem('dino_escape_highscore') || '0', 10);
      this.totalAmber = parseInt(localStorage.getItem('dino_escape_amber') || '0', 10);
      this.currentAmberInRun = 0;
      this.lives = 3;
      this.maxLives = 3;
      this.roarEnergy = 100;
      this.gameSpeed = 6;
      this.baseSpeed = 6;
      this.activeSkin = localStorage.getItem('dino_escape_skin') || 'green';

      // Shake & VFX
      this.screenShake = 0;
      this.biomeIndex = 0;
      this.biomeDistance = 0;

      // Entities
      this.dino = null;
      this.obstacles = [];
      this.collectibles = [];
      this.particles = [];
      this.bgElements = [];
      this.shockwaves = [];
      this.activePowerup = null; // { type, timer }

      // Timers for spawning
      this.obstacleSpawnTimer = 0;
      this.collectibleSpawnTimer = 0;
      this.meteorTimer = 0;

      // Controls
      this.keys = {};
      this.initInput();
      this.initUI();
      this.resetGame();

      // Start loop
      this.lastTime = performance.now();
      requestAnimationFrame(this.loop.bind(this));
    }

    initInput() {
      window.addEventListener('keydown', (e) => {
        if (['Space', 'ArrowUp', 'ArrowDown'].includes(e.code)) {
          e.preventDefault();
        }
        this.keys[e.code] = true;
        if (e.code === 'KeyP' || e.code === 'Escape') {
          if (this.state === 'PLAYING') this.pauseGame();
          else if (this.state === 'PAUSED') this.resumeGame();
        }

        if (this.state === 'PLAYING') {
          if ((e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW')) {
            this.dinoJump();
          }
          if (e.code === 'KeyX' || e.code === 'KeyZ' || e.code === 'KeyJ') {
            this.dinoRoar();
          }
        }
      });

      window.addEventListener('keyup', (e) => {
        this.keys[e.code] = false;
        if (this.dino && (e.code === 'ArrowDown' || e.code === 'KeyS')) {
          this.dino.isSliding = false;
        }
      });

      // Mobile Touch Buttons
      const btnJump = document.getElementById('touch-jump');
      const btnSlide = document.getElementById('touch-slide');
      const btnRoar = document.getElementById('touch-roar');

      if (btnJump) {
        btnJump.addEventListener('touchstart', (e) => {
          e.preventDefault();
          if (this.state === 'PLAYING') this.dinoJump();
        });
      }

      if (btnSlide) {
        btnSlide.addEventListener('touchstart', (e) => {
          e.preventDefault();
          if (this.state === 'PLAYING' && this.dino) this.dino.isSliding = true;
        });
        btnSlide.addEventListener('touchend', (e) => {
          e.preventDefault();
          if (this.dino) this.dino.isSliding = false;
        });
      }

      if (btnRoar) {
        btnRoar.addEventListener('touchstart', (e) => {
          e.preventDefault();
          if (this.state === 'PLAYING') this.dinoRoar();
        });
      }

      // Canvas touch for quick tap to jump
      this.canvas.addEventListener('touchstart', (e) => {
        if (this.state === 'PLAYING') {
          // If tap upper half jump, bottom half slide
          const rect = this.canvas.getBoundingClientRect();
          const touchY = e.touches[0].clientY - rect.top;
          if (touchY < rect.height * 0.7) {
            this.dinoJump();
          }
        }
      });
    }

    initUI() {
      // Buttons
      document.getElementById('btn-play').addEventListener('click', () => this.startGame());
      document.getElementById('btn-restart').addEventListener('click', () => this.startGame());
      const btnGameOverMenu = document.getElementById('btn-gameover-menu');
      if (btnGameOverMenu) btnGameOverMenu.addEventListener('click', () => this.showMenu());
      document.getElementById('btn-resume').addEventListener('click', () => this.resumeGame());
      document.getElementById('btn-quit').addEventListener('click', () => this.showMenu());

      // Audio mute toggle button
      const muteBtn = document.getElementById('btn-mute');
      if (muteBtn) {
        muteBtn.addEventListener('click', () => {
          const muted = window.soundSystem.toggleMute();
          muteBtn.innerHTML = muted ? '🔇' : '🔊';
        });
      }

      // Skin Selector Chips
      document.querySelectorAll('.skin-chip').forEach((chip) => {
        chip.addEventListener('click', () => {
          const skin = chip.getAttribute('data-skin');
          this.activeSkin = skin;
          localStorage.setItem('dino_escape_skin', skin);
          document.querySelectorAll('.skin-chip').forEach(c => c.classList.remove('active'));
          chip.classList.add('active');
          if (this.dino) this.dino.skin = SKINS[skin] || SKINS.green;
        });
      });

      this.updateHUD();
    }

    startGame() {
      window.soundSystem.resume();
      window.soundSystem.startMusic();
      this.resetGame();
      this.state = 'PLAYING';

      document.getElementById('menu-screen').classList.add('hidden');
      document.getElementById('gameover-screen').classList.add('hidden');
      document.getElementById('pause-screen').classList.add('hidden');
      document.getElementById('hud').style.display = 'flex';
      document.getElementById('touch-controls').style.display = 'flex';
    }

    pauseGame() {
      this.state = 'PAUSED';
      document.getElementById('pause-screen').classList.remove('hidden');
    }

    resumeGame() {
      this.state = 'PLAYING';
      document.getElementById('pause-screen').classList.add('hidden');
    }

    showMenu() {
      this.state = 'MENU';
      window.soundSystem.stopMusic();
      document.getElementById('pause-screen').classList.add('hidden');
      document.getElementById('gameover-screen').classList.add('hidden');
      document.getElementById('menu-screen').classList.remove('hidden');
    }

    gameOver() {
      this.state = 'GAMEOVER';
      window.soundSystem.stopMusic();
      window.soundSystem.playGameOver();

      this.totalAmber += this.currentAmberInRun;
      localStorage.setItem('dino_escape_amber', this.totalAmber);

      if (this.score > this.highScore) {
        this.highScore = this.score;
        localStorage.setItem('dino_escape_highscore', this.highScore);
      }

      document.getElementById('final-score').innerText = Math.floor(this.score);
      document.getElementById('final-distance').innerText = Math.floor(this.distance) + 'm';
      document.getElementById('final-amber').innerText = this.currentAmberInRun;
      document.getElementById('best-score').innerText = Math.floor(this.highScore);

      document.getElementById('gameover-screen').classList.remove('hidden');
    }

    resetGame() {
      this.score = 0;
      this.distance = 0;
      this.currentAmberInRun = 0;
      this.lives = this.maxLives;
      this.roarEnergy = 100;
      this.baseSpeed = 6;
      this.gameSpeed = this.baseSpeed;
      this.speedLevel = 1;
      this.nextSpeedMilestone = 200;
      this.speedNotification = null;
      this.biomeIndex = 0;
      this.biomeDistance = 0;
      this.screenShake = 0;
      this.obstacles = [];
      this.collectibles = [];
      this.particles = [];
      this.shockwaves = [];
      this.activePowerup = null;

      this.dino = {
        x: 140,
        y: GROUND_Y - 60,
        vy: 0,
        width: 60,
        height: 60,
        standHeight: 60,
        slideHeight: 34,
        isGrounded: true,
        canDoubleJump: true,
        isSliding: false,
        invulnerableTimer: 0,
        frenzyTimer: 0,
        hasShield: false,
        legPhase: 0,
        skin: SKINS[this.activeSkin] || SKINS.green
      };

      // Populate background parallax mountains and trees
      this.initBackground();
    }

    initBackground() {
      this.bgMountains = [];
      for (let i = 0; i < 7; i++) {
        this.bgMountains.push({
          x: i * 200,
          w: 220 + Math.random() * 80,
          h: 140 + Math.random() * 100
        });
      }

      this.bgTrees = [];
      for (let i = 0; i < 10; i++) {
        this.bgTrees.push({
          x: i * 140,
          w: 50 + Math.random() * 30,
          h: 80 + Math.random() * 50
        });
      }

      this.ambientEmbers = [];
      for (let i = 0; i < 25; i++) {
        this.ambientEmbers.push({
          x: Math.random() * CANVAS_WIDTH,
          y: Math.random() * CANVAS_HEIGHT,
          vx: -(1 + Math.random() * 2),
          vy: (Math.random() - 0.5) * 1.5,
          size: 1.5 + Math.random() * 2.5,
          alpha: 0.3 + Math.random() * 0.7
        });
      }
    }

    dinoJump() {
      if (!this.dino) return;
      if (this.dino.isGrounded) {
        this.dino.vy = JUMP_FORCE;
        this.dino.isGrounded = false;
        this.dino.canDoubleJump = true;
        this.createDust(this.dino.x + 20, GROUND_Y, 8);
        window.soundSystem.playJump();
      } else if (this.dino.canDoubleJump) {
        this.dino.vy = DOUBLE_JUMP_FORCE;
        this.dino.canDoubleJump = false;
        this.createDoubleJumpPuff(this.dino.x + 20, this.dino.y + 40);
        window.soundSystem.playDoubleJump();
      }
    }

    dinoRoar() {
      if (!this.dino || this.roarEnergy < 35) return;
      this.roarEnergy -= 35;
      window.soundSystem.playRoar();
      this.screenShake = 12;

      // Create shockwave ring
      this.shockwaves.push({
        x: this.dino.x + 50,
        y: this.dino.y + 20,
        radius: 20,
        maxRadius: 280,
        alpha: 1.0
      });

      // Blast nearby obstacles
      this.obstacles.forEach(obs => {
        if (obs.x > this.dino.x && obs.x < this.dino.x + 360) {
          obs.destroyed = true;
          this.createExplosion(obs.x + obs.width / 2, obs.y + obs.height / 2, '#ff9800', 16);
          this.score += 100;
        }
      });
    }

    // --- Main Game Loop ---
    loop(currentTime) {
      const dt = Math.min((currentTime - this.lastTime) / 1000, 0.1);
      this.lastTime = currentTime;

      if (this.state === 'PLAYING') {
        this.update(dt);
      }

      this.render();
      requestAnimationFrame(this.loop.bind(this));
    }

    update(dt) {
      // Speed and progression
      this.distance += this.gameSpeed * dt * 2.5;
      this.score += this.gameSpeed * dt * 3;
      this.biomeDistance += this.gameSpeed * dt * 2.5;

      // Speed increases every 200m milestone!
      if (this.distance >= this.nextSpeedMilestone) {
        this.speedLevel++;
        this.nextSpeedMilestone += 200;

        // Increase running speed by +1.0 per 200m passed
        this.gameSpeed = this.baseSpeed + (this.speedLevel - 1) * 1.0;

        // Play energetic speed-up sound
        if (window.soundSystem && window.soundSystem.playSpeedUp) {
          window.soundSystem.playSpeedUp();
        }

        // Show animated notification banner
        this.speedNotification = {
          level: this.speedLevel,
          timer: 2.2
        };

        // Flash speed burst sparkles
        this.createSparkles(this.dino.x + 30, this.dino.y + 30, '#00e5ff', 24);
        this.createSparkles(this.dino.x + 10, GROUND_Y, '#ffeb3b', 16);
      }

      // Update speed notification timer
      if (this.speedNotification) {
        this.speedNotification.timer -= dt;
        if (this.speedNotification.timer <= 0) {
          this.speedNotification = null;
        }
      }

      // Biome switch every 1000m
      if (this.biomeDistance > 1000) {
        this.biomeDistance = 0;
        this.biomeIndex = (this.biomeIndex + 1) % BIOMES.length;
      }

      // Roar energy recharge
      if (this.roarEnergy < 100) {
        this.roarEnergy = Math.min(100, this.roarEnergy + 10 * dt);
      }

      // Check down key for slide
      if (this.keys['ArrowDown'] || this.keys['KeyS']) {
        if (!this.dino.isSliding) {
          window.soundSystem.playSlide();
        }
        this.dino.isSliding = true;
      }

      // Dino Physics
      this.updateDino(dt);

      // Spawning
      this.handleSpawns(dt);

      // Update Obstacles
      this.updateObstacles(dt);

      // Update Collectibles
      this.updateCollectibles(dt);

      // Update VFX & Shockwaves
      this.updateVFX(dt);

      // Screen Shake Decay
      if (this.screenShake > 0) {
        this.screenShake -= dt * 30;
        if (this.screenShake < 0) this.screenShake = 0;
      }

      this.updateHUD();
    }

    updateDino(dt) {
      const dino = this.dino;

      // Invulnerability blink timer
      if (dino.invulnerableTimer > 0) {
        dino.invulnerableTimer -= dt;
      }

      // Frenzy timer
      if (dino.frenzyTimer > 0) {
        dino.frenzyTimer -= dt;
        if (dino.frenzyTimer <= 0) {
          this.activePowerup = null;
        }
      }

      // Slide / Stand height
      const targetHeight = dino.isSliding ? dino.slideHeight : dino.standHeight;
      dino.height = targetHeight;

      // Gravity & Vertical movement
      dino.vy += GRAVITY;
      dino.y += dino.vy;

      if (dino.y >= GROUND_Y - dino.height) {
        dino.y = GROUND_Y - dino.height;
        dino.vy = 0;
        if (!dino.isGrounded) {
          this.createDust(dino.x + 20, GROUND_Y, 6);
        }
        dino.isGrounded = true;
      } else {
        dino.isGrounded = false;
      }

      // Running animation cycle
      if (dino.isGrounded) {
        dino.legPhase += dt * (this.gameSpeed * 1.8);
        if (Math.random() < 0.2) {
          this.createDust(dino.x + 5, GROUND_Y, 1);
        }
      }
    }

    handleSpawns(dt) {
      // Obstacle Spawner
      this.obstacleSpawnTimer -= dt;
      if (this.obstacleSpawnTimer <= 0) {
        this.spawnRandomObstacle();
        const minTime = Math.max(1.1, 2.4 - this.gameSpeed * 0.12);
        const maxTime = minTime + 1.2;
        this.obstacleSpawnTimer = minTime + Math.random() * (maxTime - minTime);
      }

      // Collectible Spawner
      this.collectibleSpawnTimer -= dt;
      if (this.collectibleSpawnTimer <= 0) {
        this.spawnRandomCollectible();
        this.collectibleSpawnTimer = 3.5 + Math.random() * 4;
      }

      // Meteor Strike Spawner (Biome 2 has frequent meteors, others occasional)
      this.meteorTimer -= dt;
      if (this.meteorTimer <= 0) {
        this.spawnMeteor();
        this.meteorTimer = (this.biomeIndex === 1 ? 8 : 15) + Math.random() * 10;
      }
    }

    spawnRandomObstacle() {
      const types = ['spikes', 'boulder', 'pterodactyl'];
      const r = Math.random();
      let type;
      if (r < 0.4) type = 'spikes';
      else if (r < 0.72) type = 'boulder';
      else type = 'pterodactyl';

      if (type === 'spikes') {
        const count = Math.random() > 0.5 ? 2 : 1;
        this.obstacles.push({
          type: 'spikes',
          x: CANVAS_WIDTH + 40,
          y: GROUND_Y - 36,
          width: 32 * count,
          height: 36,
          destroyed: false
        });
      } else if (type === 'boulder') {
        const size = 42 + Math.random() * 14;
        this.obstacles.push({
          type: 'boulder',
          x: CANVAS_WIDTH + 40,
          y: GROUND_Y - size,
          width: size,
          height: size,
          rotation: 0,
          rotSpeed: 3 + Math.random() * 3,
          destroyed: false
        });
      } else if (type === 'pterodactyl') {
        // High (can run under), Mid (must duck/slide!), Low (must jump)
        const heights = [GROUND_Y - 95, GROUND_Y - 55, GROUND_Y - 120];
        const flyY = heights[Math.floor(Math.random() * heights.length)];
        this.obstacles.push({
          type: 'pterodactyl',
          x: CANVAS_WIDTH + 40,
          y: flyY,
          width: 52,
          height: 32,
          wingPhase: 0,
          flySpeed: this.gameSpeed + 2.5,
          destroyed: false
        });
      }
    }

    spawnRandomCollectible() {
      const isPowerup = Math.random() < 0.28;
      const spawnY = GROUND_Y - (50 + Math.random() * 90);

      if (!isPowerup) {
        // Arc of amber gems
        const count = 3;
        for (let i = 0; i < count; i++) {
          this.collectibles.push({
            type: 'amber',
            x: CANVAS_WIDTH + 40 + i * 40,
            y: spawnY - Math.sin((i / (count - 1)) * Math.PI) * 40,
            radius: 12,
            collected: false
          });
        }
      } else {
        const powerTypes = ['shield', 'frenzy', 'fruit'];
        const chosen = powerTypes[Math.floor(Math.random() * powerTypes.length)];
        this.collectibles.push({
          type: chosen,
          x: CANVAS_WIDTH + 40,
          y: spawnY,
          radius: 18,
          floatPhase: Math.random() * Math.PI * 2,
          collected: false
        });
      }
    }

    spawnMeteor() {
      window.soundSystem.playMeteorWarning();
      const targetX = 220 + Math.random() * (CANVAS_WIDTH - 300);
      this.obstacles.push({
        type: 'meteor',
        startX: targetX + 260,
        startY: -80,
        targetX: targetX,
        targetY: GROUND_Y,
        x: targetX + 260,
        y: -80,
        progress: 0,
        width: 44,
        height: 44,
        warningTimer: 1.4,
        landed: false,
        destroyed: false
      });
    }

    updateObstacles(dt) {
      for (let i = this.obstacles.length - 1; i >= 0; i--) {
        const obs = this.obstacles[i];

        if (obs.type === 'meteor') {
          if (obs.warningTimer > 0) {
            obs.warningTimer -= dt;
          } else if (!obs.landed) {
            obs.progress += dt * 2.2;
            obs.x = obs.startX + (obs.targetX - obs.startX) * obs.progress;
            obs.y = obs.startY + (obs.targetY - obs.startY) * obs.progress;

            // Tail smoke
            this.createSmoke(obs.x, obs.y, '#ff5722');

            if (obs.progress >= 1) {
              obs.landed = true;
              this.screenShake = 18;
              window.soundSystem.playExplosion();
              this.createExplosion(obs.targetX, obs.targetY, '#ff3d00', 28);
              // Leave a crater rock for a brief moment
              obs.x = obs.targetX - 22;
              obs.y = GROUND_Y - 32;
              obs.width = 44;
              obs.height = 32;
            }
          } else {
            obs.x -= this.gameSpeed * 60 * dt;
          }
        } else if (obs.type === 'pterodactyl') {
          obs.x -= (obs.flySpeed * 60) * dt;
          obs.wingPhase += dt * 12;
        } else {
          obs.x -= (this.gameSpeed * 60) * dt;
          if (obs.type === 'boulder') {
            obs.rotation += obs.rotSpeed * dt;
          }
        }

        // Check collision with Dino
        if (!obs.destroyed && this.checkCollision(this.dino, obs)) {
          this.handleDinoCollision(obs);
        }

        // Remove offscreen
        if (obs.x + obs.width < -100 || obs.destroyed) {
          this.obstacles.splice(i, 1);
        }
      }
    }

    checkCollision(dino, obs) {
      if (obs.type === 'meteor' && !obs.landed) return false;

      // Bounding box with forgiving inner padding
      const dBox = {
        x: dino.x + 8,
        y: dino.y + (dino.isSliding ? 14 : 6),
        w: dino.width - 16,
        h: dino.height - (dino.isSliding ? 14 : 10)
      };

      const oBox = {
        x: obs.x + 4,
        y: obs.y + 4,
        w: obs.width - 8,
        h: obs.height - 8
      };

      return (
        dBox.x < oBox.x + oBox.w &&
        dBox.x + dBox.w > oBox.x &&
        dBox.y < oBox.y + oBox.h &&
        dBox.y + dBox.h > oBox.y
      );
    }

    handleDinoCollision(obs) {
      // Frenzy Mode smashes everything!
      if (this.dino.frenzyTimer > 0) {
        obs.destroyed = true;
        this.score += 150;
        this.createExplosion(obs.x + obs.width / 2, obs.y + obs.height / 2, '#ffeb3b', 18);
        window.soundSystem.playHit();
        return;
      }

      // Shield absorbs hit
      if (this.dino.hasShield) {
        this.dino.hasShield = false;
        obs.destroyed = true;
        this.createExplosion(this.dino.x + 30, this.dino.y + 30, '#00e5ff', 20);
        this.dino.invulnerableTimer = 1.0;
        window.soundSystem.playHit();
        return;
      }

      // Normal hit if not invulnerable
      if (this.dino.invulnerableTimer <= 0) {
        this.lives--;
        this.screenShake = 14;
        this.dino.invulnerableTimer = 1.8;
        window.soundSystem.playHit();
        this.createExplosion(this.dino.x + 30, this.dino.y + 30, '#f44336', 15);

        if (this.lives <= 0) {
          this.gameOver();
        }
      }
    }

    updateCollectibles(dt) {
      for (let i = this.collectibles.length - 1; i >= 0; i--) {
        const item = this.collectibles[i];
        item.x -= (this.gameSpeed * 60) * dt;

        if (item.floatPhase !== undefined) {
          item.floatPhase += dt * 4;
          item.drawY = item.y + Math.sin(item.floatPhase) * 6;
        } else {
          item.drawY = item.y;
        }

        // Collision with dino
        const dinoCenter = { x: this.dino.x + this.dino.width / 2, y: this.dino.y + this.dino.height / 2 };
        const dist = Math.hypot(dinoCenter.x - item.x, dinoCenter.y - item.drawY);

        if (dist < item.radius + 30) {
          this.collectItem(item);
          this.collectibles.splice(i, 1);
          continue;
        }

        if (item.x < -50) {
          this.collectibles.splice(i, 1);
        }
      }
    }

    collectItem(item) {
      if (item.type === 'amber') {
        this.currentAmberInRun++;
        this.score += 50;
        window.soundSystem.playGem();
        this.createSparkles(item.x, item.drawY, '#ffb300', 8);
      } else if (item.type === 'fruit') {
        this.roarEnergy = 100;
        this.score += 100;
        window.soundSystem.playPowerup();
        this.createSparkles(item.x, item.drawY, '#e91e63', 12);
      } else if (item.type === 'shield') {
        this.dino.hasShield = true;
        this.score += 150;
        window.soundSystem.playPowerup();
        this.createSparkles(item.x, item.drawY, '#00e5ff', 16);
      } else if (item.type === 'frenzy') {
        this.dino.frenzyTimer = 7.0; // 7 seconds frenzy
        this.activePowerup = { type: 'FRENZY RUSH!', timer: 7.0 };
        this.score += 250;
        window.soundSystem.playPowerup();
        this.createSparkles(item.x, item.drawY, '#ffeb3b', 22);
      }
    }

    updateVFX(dt) {
      // Shockwaves
      for (let i = this.shockwaves.length - 1; i >= 0; i--) {
        const sw = this.shockwaves[i];
        sw.radius += dt * 600;
        sw.alpha = 1 - sw.radius / sw.maxRadius;
        if (sw.radius >= sw.maxRadius) {
          this.shockwaves.splice(i, 1);
        }
      }

      // Particles
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.x += p.vx * 60 * dt;
        p.y += p.vy * 60 * dt;
        p.alpha -= dt * p.decay;
        p.size *= (1 - dt * 0.5);

        if (p.alpha <= 0 || p.size <= 0.3) {
          this.particles.splice(i, 1);
        }
      }

      // Ambient Embers
      const biome = BIOMES[this.biomeIndex];
      this.ambientEmbers.forEach(e => {
        e.x += e.vx;
        e.y += e.vy;
        if (e.x < -10) e.x = CANVAS_WIDTH + 10;
        if (e.y < 0) e.y = CANVAS_HEIGHT;
        if (e.y > CANVAS_HEIGHT) e.y = 0;
      });
    }

    // --- Particle Emitters ---
    createDust(x, y, count = 4) {
      for (let i = 0; i < count; i++) {
        this.particles.push({
          x: x + (Math.random() - 0.5) * 10,
          y: y - 2,
          vx: -(1 + Math.random() * 2),
          vy: -(Math.random() * 1.5),
          size: 3 + Math.random() * 4,
          color: '#a1887f',
          alpha: 0.8,
          decay: 2.2
        });
      }
    }

    createDoubleJumpPuff(x, y) {
      for (let i = 0; i < 8; i++) {
        const angle = (Math.PI / 8) * i + Math.PI / 4;
        this.particles.push({
          x,
          y,
          vx: Math.cos(angle) * 3,
          vy: Math.sin(angle) * 2,
          size: 4 + Math.random() * 3,
          color: '#ffffff',
          alpha: 0.9,
          decay: 2.5
        });
      }
    }

    createExplosion(x, y, color, count = 15) {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const spd = 2 + Math.random() * 6;
        this.particles.push({
          x,
          y,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd - 2,
          size: 4 + Math.random() * 5,
          color: color,
          alpha: 1,
          decay: 1.8
        });
      }
    }

    createSparkles(x, y, color, count = 10) {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const spd = 1.5 + Math.random() * 4;
        this.particles.push({
          x,
          y,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd,
          size: 3 + Math.random() * 3,
          color: color,
          alpha: 1,
          decay: 1.6
        });
      }
    }

    createSmoke(x, y, color) {
      this.particles.push({
        x: x + (Math.random() - 0.5) * 8,
        y: y + (Math.random() - 0.5) * 8,
        vx: -(this.gameSpeed * 0.4),
        vy: -0.5,
        size: 5 + Math.random() * 5,
        color: color,
        alpha: 0.7,
        decay: 1.8
      });
    }

    updateHUD() {
      // Score, distance, and speed tier
      document.getElementById('hud-score').innerText = Math.floor(this.score);
      document.getElementById('hud-distance').innerText = Math.floor(this.distance) + 'm';
      const speedLvlElem = document.getElementById('hud-speed-lvl');
      if (speedLvlElem) {
        speedLvlElem.innerText = `LVL ${this.speedLevel}`;
      }
      document.getElementById('hud-amber').innerText = this.currentAmberInRun;

      // Roar energy bar fill
      const energyBar = document.getElementById('energy-fill');
      if (energyBar) {
        energyBar.style.width = this.roarEnergy + '%';
      }

      // Hearts
      const hearts = document.querySelectorAll('.heart');
      hearts.forEach((h, idx) => {
        if (idx < this.lives) {
          h.classList.remove('lost');
        } else {
          h.classList.add('lost');
        }
      });
    }

    // --- Rendering Engine ---
    render() {
      const ctx = this.ctx;
      ctx.save();

      // Screen Shake translation
      if (this.screenShake > 0) {
        const shakeX = (Math.random() - 0.5) * this.screenShake;
        const shakeY = (Math.random() - 0.5) * this.screenShake;
        ctx.translate(shakeX, shakeY);
      }

      // 1. Parallax Sky & Background
      this.renderBackground(ctx);

      // 2. Obstacles & Hazards
      this.renderObstacles(ctx);

      // 3. Collectibles
      this.renderCollectibles(ctx);

      // 4. Player Dinosaur
      if (this.dino) {
        this.renderDino(ctx);
      }

      // 5. Visual Effects & Particles
      this.renderVFX(ctx);

      // 6. Foreground Terrain & Lava
      this.renderForeground(ctx);

      ctx.restore();
    }

    renderBackground(ctx) {
      const biome = BIOMES[this.biomeIndex];

      // Sky gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, GROUND_Y);
      skyGrad.addColorStop(0, biome.skyTop);
      skyGrad.addColorStop(1, biome.skyBottom);
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Distant Volcano / Sun
      const sunGrad = ctx.createRadialGradient(820, 140, 10, 820, 140, 120);
      sunGrad.addColorStop(0, 'rgba(255, 204, 128, 0.9)');
      sunGrad.addColorStop(0.5, 'rgba(255, 109, 0, 0.4)');
      sunGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = sunGrad;
      ctx.beginPath();
      ctx.arc(820, 140, 120, 0, Math.PI * 2);
      ctx.fill();

      // Parallax Mountain Layer (Layer 1 - slow)
      const mOffset = (this.distance * 0.15) % 200;
      ctx.fillStyle = biome.mountainColor;
      ctx.beginPath();
      ctx.moveTo(-50, GROUND_Y);
      for (let x = -50; x <= CANVAS_WIDTH + 100; x += 120) {
        const peakHeight = 160 + Math.sin((x + this.distance * 0.1) * 0.015) * 50;
        ctx.lineTo(x - mOffset, GROUND_Y - peakHeight);
      }
      ctx.lineTo(CANVAS_WIDTH + 100, GROUND_Y);
      ctx.closePath();
      ctx.fill();

      // Erupting volcano plume in background if biome is Volcanic Ridge
      if (biome.lavaGlow) {
        ctx.fillStyle = 'rgba(255, 87, 34, 0.35)';
        ctx.beginPath();
        ctx.arc(580, 240, 65, 0, Math.PI * 2);
        ctx.fill();
      }

      // Parallax Prehistoric Jungle/Rock Layer (Layer 2 - mid speed)
      const tOffset = (this.distance * 0.55) % 180;
      ctx.fillStyle = biome.treeColor;
      for (let i = -1; i < 8; i++) {
        const tx = i * 180 - tOffset;
        ctx.beginPath();
        ctx.moveTo(tx, GROUND_Y);
        ctx.lineTo(tx + 40, GROUND_Y - 110);
        ctx.lineTo(tx + 80, GROUND_Y);
        ctx.fill();

        // Canopy foliage arches
        ctx.beginPath();
        ctx.arc(tx + 40, GROUND_Y - 110, 32, 0, Math.PI, true);
        ctx.fill();
      }

      // Ambient Embers drifting across screen
      ctx.fillStyle = '#ffb74d';
      this.ambientEmbers.forEach(e => {
        ctx.globalAlpha = e.alpha;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;
    }

    renderForeground(ctx) {
      const biome = BIOMES[this.biomeIndex];

      // Ground Base
      ctx.fillStyle = biome.groundBase;
      ctx.fillRect(0, GROUND_Y, CANVAS_WIDTH, CANVAS_HEIGHT - GROUND_Y);

      // Top ground grass / moss stripe
      ctx.fillStyle = biome.groundColor;
      ctx.fillRect(0, GROUND_Y, CANVAS_WIDTH, 14);

      // Animated scrolling pebbles/cracks
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      const pebbleOffset = (this.distance * 2.5) % 80;
      for (let x = -40; x < CANVAS_WIDTH + 60; x += 80) {
        ctx.fillRect(x - pebbleOffset, GROUND_Y + 18, 18, 5);
        ctx.fillRect(x - pebbleOffset + 35, GROUND_Y + 36, 12, 4);
      }

      // Glowing lava crevice if active
      if (biome.lavaGlow) {
        ctx.fillStyle = '#ff5722';
        ctx.shadowColor = '#ffab40';
        ctx.shadowBlur = 10;
        ctx.fillRect(0, GROUND_Y + 65, CANVAS_WIDTH, 6);
        ctx.shadowBlur = 0;
      }
    }

    renderDino(ctx) {
      const dino = this.dino;
      const s = dino.skin;

      // Invulnerability blink effect
      if (dino.invulnerableTimer > 0 && Math.floor(Date.now() / 80) % 2 === 0) {
        return;
      }

      ctx.save();
      ctx.translate(dino.x, dino.y);

      // Frenzy mode glow aura
      if (dino.frenzyTimer > 0) {
        const auraColor = `hsl(${(Date.now() / 4) % 360}, 100%, 60%)`;
        ctx.shadowColor = auraColor;
        ctx.shadowBlur = 24;
      }

      // Amber Shield bubble
      if (dino.hasShield) {
        ctx.strokeStyle = '#00e5ff';
        ctx.lineWidth = 3.5;
        ctx.shadowColor = '#00e5ff';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.ellipse(30, dino.height / 2, 40, dino.height / 2 + 12, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      if (dino.isSliding) {
        // --- Sliding Dino Pose ---
        // Elongated body
        ctx.fillStyle = s.body;
        ctx.beginPath();
        ctx.roundRect(0, 10, 68, 22, 10);
        ctx.fill();

        // Belly
        ctx.fillStyle = s.belly;
        ctx.beginPath();
        ctx.roundRect(14, 18, 40, 12, 6);
        ctx.fill();

        // Head thrust forward low
        ctx.fillStyle = s.body;
        ctx.beginPath();
        ctx.roundRect(48, 6, 26, 20, 6);
        ctx.fill();

        // Eye
        ctx.fillStyle = s.eye;
        ctx.beginPath();
        ctx.arc(65, 12, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = s.pupil;
        ctx.beginPath();
        ctx.arc(66, 12, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Spines on back
        ctx.fillStyle = s.spines;
        for (let i = 0; i < 3; i++) {
          ctx.beginPath();
          ctx.moveTo(12 + i * 14, 10);
          ctx.lineTo(18 + i * 14, 2);
          ctx.lineTo(24 + i * 14, 10);
          ctx.fill();
        }

        // Sliding dust trail
        if (Math.random() < 0.3) {
          this.createDust(dino.x + 10, GROUND_Y, 2);
        }
      } else {
        // --- Standing / Running / Jumping Dino Pose ---
        const legSwing = Math.sin(dino.legPhase) * 16;

        // Tail
        ctx.fillStyle = s.body;
        ctx.beginPath();
        ctx.moveTo(14, 30);
        ctx.quadraticCurveTo(-14, 24, -22, 16);
        ctx.quadraticCurveTo(-10, 36, 14, 42);
        ctx.fill();

        // Body Torso
        ctx.beginPath();
        ctx.roundRect(8, 16, 40, 34, 14);
        ctx.fill();

        // Underbelly patch
        ctx.fillStyle = s.belly;
        ctx.beginPath();
        ctx.roundRect(24, 26, 20, 20, 8);
        ctx.fill();

        // Back Spines
        ctx.fillStyle = s.spines;
        for (let i = 0; i < 3; i++) {
          ctx.beginPath();
          ctx.moveTo(14 + i * 10, 16);
          ctx.lineTo(19 + i * 10, 7);
          ctx.lineTo(24 + i * 10, 16);
          ctx.fill();
        }

        // Head & Snout
        ctx.fillStyle = s.body;
        ctx.beginPath();
        ctx.roundRect(30, 2, 32, 24, 8);
        ctx.fill();

        // Jaw / Mouth
        ctx.fillStyle = '#b71c1c';
        ctx.fillRect(44, 20, 18, 3);
        // Sharp tooth!
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(48, 20);
        ctx.lineTo(51, 23);
        ctx.lineTo(54, 20);
        ctx.fill();

        // Eye
        ctx.fillStyle = s.eye;
        ctx.beginPath();
        ctx.arc(46, 10, 5.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = s.pupil;
        ctx.beginPath();
        ctx.arc(48, 10, 3, 0, Math.PI * 2);
        ctx.fill();
        // Eye shine
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(47, 8.5, 1.2, 0, Math.PI * 2);
        ctx.fill();

        // Tiny cute T-Rex Arm
        ctx.fillStyle = s.body;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(34, 30);
        ctx.lineTo(44, 33);
        ctx.lineTo(46, 38);
        ctx.stroke();

        // Legs (Running or In-air tuck)
        ctx.fillStyle = s.body;
        if (dino.isGrounded) {
          // Leg 1 (Back)
          ctx.fillRect(18 - legSwing * 0.4, 46, 8, 14);
          ctx.fillRect(18 - legSwing * 0.4, 57, 12, 5);

          // Leg 2 (Front)
          ctx.fillRect(28 + legSwing * 0.4, 46, 8, 14);
          ctx.fillRect(28 + legSwing * 0.4, 57, 12, 5);
        } else {
          // Tucked jump legs
          ctx.fillRect(16, 44, 10, 10);
          ctx.fillRect(26, 44, 10, 10);
        }
      }

      ctx.restore();
    }

    renderObstacles(ctx) {
      this.obstacles.forEach(obs => {
        ctx.save();
        if (obs.type === 'spikes') {
          // Spiky prehistoric obsidian crystals / thorns
          ctx.fillStyle = '#37474f';
          const count = Math.round(obs.width / 32);
          for (let i = 0; i < count; i++) {
            const sx = obs.x + i * 32;
            ctx.beginPath();
            ctx.moveTo(sx, obs.y + obs.height);
            ctx.lineTo(sx + 16, obs.y);
            ctx.lineTo(sx + 32, obs.y + obs.height);
            ctx.fill();

            // Shiny edge
            ctx.strokeStyle = '#90a4ae';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(sx + 6, obs.y + obs.height);
            ctx.lineTo(sx + 16, obs.y);
            ctx.stroke();
          }
        } else if (obs.type === 'boulder') {
          // Rolling volcanic rock
          ctx.translate(obs.x + obs.width / 2, obs.y + obs.height / 2);
          ctx.rotate(obs.rotation);

          ctx.fillStyle = '#4e342e';
          ctx.beginPath();
          ctx.arc(0, 0, obs.width / 2, 0, Math.PI * 2);
          ctx.fill();

          // Internal rock crack details
          ctx.fillStyle = '#ff5722';
          ctx.beginPath();
          ctx.arc(4, 4, obs.width / 5, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = '#271915';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(0, 0, obs.width / 2, 0, Math.PI * 2);
          ctx.stroke();
        } else if (obs.type === 'pterodactyl') {
          // Flying Pterosaur
          ctx.translate(obs.x, obs.y);
          const wingOffset = Math.sin(obs.wingPhase) * 16;

          ctx.fillStyle = '#d84315';
          // Body
          ctx.beginPath();
          ctx.ellipse(26, 16, 18, 8, 0, 0, Math.PI * 2);
          ctx.fill();

          // Head with sharp beak crest
          ctx.beginPath();
          ctx.moveTo(12, 14);
          ctx.lineTo(-4, 18);
          ctx.lineTo(14, 22);
          ctx.fill();

          // Crest
          ctx.fillStyle = '#fbc02d';
          ctx.beginPath();
          ctx.moveTo(18, 12);
          ctx.lineTo(34, 4);
          ctx.lineTo(24, 15);
          ctx.fill();

          // Wings flapping
          ctx.fillStyle = '#ff7043';
          ctx.beginPath();
          ctx.moveTo(22, 14);
          ctx.lineTo(10, 14 + wingOffset);
          ctx.lineTo(38, 14 + wingOffset);
          ctx.closePath();
          ctx.fill();
        } else if (obs.type === 'meteor') {
          if (!obs.landed) {
            // Flaming falling meteor
            ctx.translate(obs.x, obs.y);
            // Fire streak trail
            const streak = ctx.createLinearGradient(0, 0, 60, -60);
            streak.addColorStop(0, '#ff9800');
            streak.addColorStop(1, 'transparent');
            ctx.fillStyle = streak;
            ctx.beginPath();
            ctx.moveTo(-15, -15);
            ctx.lineTo(60, -70);
            ctx.lineTo(15, 15);
            ctx.fill();

            // Meteor core
            ctx.fillStyle = '#d50000';
            ctx.shadowColor = '#ff6d00';
            ctx.shadowBlur = 18;
            ctx.beginPath();
            ctx.arc(0, 0, obs.width / 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
          } else {
            // Smashed smoking crater rock
            ctx.fillStyle = '#37474f';
            ctx.beginPath();
            ctx.roundRect(obs.x, obs.y, obs.width, obs.height, 8);
            ctx.fill();
          }

          // Ground Warning Target Marker while meteor is descending
          if (obs.warningTimer !== undefined && obs.warningTimer > 0) {
            ctx.save();
            ctx.fillStyle = 'rgba(244, 67, 54, 0.4)';
            ctx.shadowColor = '#f44336';
            ctx.shadowBlur = 12;
            ctx.beginPath();
            ctx.ellipse(obs.targetX, GROUND_Y - 4, 34, 10, 0, 0, Math.PI * 2);
            ctx.fill();

            // Warning Exclamation
            ctx.fillStyle = '#ffeb3b';
            ctx.font = 'bold 22px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('⚠', obs.targetX, GROUND_Y - 26);
            ctx.restore();
          }
        }
        ctx.restore();
      });
    }

    renderCollectibles(ctx) {
      this.collectibles.forEach(item => {
        ctx.save();
        ctx.translate(item.x, item.drawY);

        if (item.type === 'amber') {
          // Glowing Prehistoric Amber Gem
          ctx.shadowColor = '#ffc107';
          ctx.shadowBlur = 10;
          ctx.fillStyle = '#ffb300';
          ctx.beginPath();
          ctx.moveTo(0, -item.radius);
          ctx.lineTo(item.radius, 0);
          ctx.lineTo(0, item.radius);
          ctx.lineTo(-item.radius, 0);
          ctx.closePath();
          ctx.fill();

          // Internal amber glint
          ctx.fillStyle = '#fff9c4';
          ctx.beginPath();
          ctx.arc(-2, -2, item.radius * 0.35, 0, Math.PI * 2);
          ctx.fill();
        } else if (item.type === 'shield') {
          // Shield Egg
          ctx.shadowColor = '#00e5ff';
          ctx.shadowBlur = 12;
          ctx.fillStyle = '#00bcd4';
          ctx.beginPath();
          ctx.ellipse(0, 0, item.radius, item.radius * 1.25, 0, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 15px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('🛡', 0, 0);
        } else if (item.type === 'frenzy') {
          // Fire Pepper / Star Shroom
          ctx.shadowColor = '#ffeb3b';
          ctx.shadowBlur = 15;
          ctx.fillStyle = '#ff5722';
          ctx.beginPath();
          ctx.arc(0, 0, item.radius, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 16px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('⚡', 0, 0);
        } else if (item.type === 'fruit') {
          // Prehistoric Dragon Fruit (Roar Refill)
          ctx.shadowColor = '#e91e63';
          ctx.shadowBlur = 10;
          ctx.fillStyle = '#e91e63';
          ctx.beginPath();
          ctx.arc(0, 0, item.radius, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 15px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('🥩', 0, 0);
        }

        ctx.restore();
      });
    }

    renderVFX(ctx) {
      // Roar Shockwaves
      this.shockwaves.forEach(sw => {
        ctx.save();
        ctx.strokeStyle = `rgba(255, 171, 0, ${sw.alpha})`;
        ctx.lineWidth = 6 * sw.alpha;
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      });

      // Particles
      this.particles.forEach(p => {
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.5, p.size), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Active Frenzy HUD Banner in Game
      if (this.dino && this.dino.frenzyTimer > 0) {
        ctx.save();
        ctx.fillStyle = 'rgba(255, 193, 7, 0.9)';
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'center';
        ctx.shadowColor = '#ff6f00';
        ctx.shadowBlur = 10;
        ctx.fillText(
          `⚡ FRENZY RUSH! ${this.dino.frenzyTimer.toFixed(1)}s ⚡`,
          CANVAS_WIDTH / 2,
          75
        );
        ctx.restore();
      }

      // Speed Level Up Banner (Every 200m)
      if (this.speedNotification) {
        ctx.save();
        const fade = Math.min(1, this.speedNotification.timer);
        ctx.globalAlpha = fade;
        ctx.fillStyle = '#00e5ff';
        ctx.font = '900 24px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.shadowColor = '#00e5ff';
        ctx.shadowBlur = 16;
        ctx.fillText(
          `⚡ SPEED UP! LEVEL ${this.speedNotification.level} ⚡`,
          CANVAS_WIDTH / 2,
          112
        );

        ctx.font = 'bold 13px Arial, sans-serif';
        ctx.fillStyle = '#ffeb3b';
        ctx.shadowColor = '#ffb300';
        ctx.shadowBlur = 8;
        ctx.fillText(
          `Speed Boost: +${((this.speedNotification.level - 1) * 1.0).toFixed(1)}x`,
          CANVAS_WIDTH / 2,
          134
        );
        ctx.restore();
      }
    }
  }

  // Initialize on load
  window.addEventListener('DOMContentLoaded', () => {
    window.game = new Game();
  });
})();
