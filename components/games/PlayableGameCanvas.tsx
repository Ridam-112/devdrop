"use client";

import React, { useEffect, useRef, useState } from "react";
import { Play, RotateCcw, Volume2, VolumeX, Maximize2, Trophy, Shield, Zap, Sparkles } from "lucide-react";

interface PlayableGameCanvasProps {
  gameType: "space-defender" | "cyber-snake" | "2048" | "neon-breakout" | "clumsy-bird";
  gameName: string;
}

export const PlayableGameCanvas: React.FC<PlayableGameCanvasProps> = ({ gameType, gameName }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Load high score from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`devdrop_game_highscore_${gameType}`);
      if (saved) setHighScore(parseInt(saved, 10));
    } catch {
      // LocalStorage not available or blocked
    }
  }, [gameType]);

  const updateHighScore = (newScore: number) => {
    if (newScore > highScore) {
      setHighScore(newScore);
      try {
        localStorage.setItem(`devdrop_game_highscore_${gameType}`, newScore.toString());
      } catch {}
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let localScore = 0;
    let localGameOver = false;

    // Fixed canvas internal resolution
    const WIDTH = 640;
    const HEIGHT = 480;
    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    // -------------------------------------------------------------
    // GAME 1: SPACE DEFENDER (Shooter)
    // -------------------------------------------------------------
    if (gameType === "space-defender") {
      let player = { x: WIDTH / 2 - 16, y: HEIGHT - 50, w: 32, h: 24, speed: 6 };
      let bullets: { x: number; y: number; vx: number; vy: number; radius: number }[] = [];
      let enemies: { x: number; y: number; w: number; h: number; hp: number; speed: number; color: string }[] = [];
      let particles: { x: number; y: number; vx: number; vy: number; life: number; color: string }[] = [];
      let stars = Array.from({ length: 70 }, () => ({
        x: Math.random() * WIDTH,
        y: Math.random() * HEIGHT,
        s: Math.random() * 2 + 0.5,
        speed: Math.random() * 1.5 + 0.5,
      }));

      const keys: Record<string, boolean> = {};
      let lastShot = 0;

      const onKeyDown = (e: KeyboardEvent) => {
        keys[e.key.toLowerCase()] = true;
        if (e.key === " " && isPlaying) e.preventDefault();
      };
      const onKeyUp = (e: KeyboardEvent) => {
        keys[e.key.toLowerCase()] = false;
      };

      window.addEventListener("keydown", onKeyDown);
      window.addEventListener("keyup", onKeyUp);

      let spawnTimer = 0;

      const loop = () => {
        if (!isPlaying || localGameOver) {
          // Render idle / menu background
          ctx.fillStyle = "#05070f";
          ctx.fillRect(0, 0, WIDTH, HEIGHT);
          stars.forEach((st) => {
            ctx.fillStyle = "rgba(255,255,255,0.4)";
            ctx.fillRect(st.x, st.y, st.s, st.s);
          });
          return;
        }

        ctx.fillStyle = "#030611";
        ctx.fillRect(0, 0, WIDTH, HEIGHT);

        // Update & draw background stars
        stars.forEach((st) => {
          st.y += st.speed;
          if (st.y > HEIGHT) {
            st.y = 0;
            st.x = Math.random() * WIDTH;
          }
          ctx.fillStyle = "rgba(0, 240, 255, 0.5)";
          ctx.fillRect(st.x, st.y, st.s, st.s);
        });

        // Player input
        if (keys["arrowleft"] || keys["a"]) player.x -= player.speed;
        if (keys["arrowright"] || keys["d"]) player.x += player.speed;
        if (keys["arrowup"] || keys["w"]) player.y -= player.speed;
        if (keys["arrowdown"] || keys["s"]) player.y += player.speed;

        // Clamp
        player.x = Math.max(0, Math.min(WIDTH - player.w, player.x));
        player.y = Math.max(100, Math.min(HEIGHT - player.h - 10, player.y));

        // Auto/Key shooting
        const now = Date.now();
        if ((keys[" "] || keys["spacebar"]) && now - lastShot > 140) {
          bullets.push({ x: player.x + 8, y: player.y, vx: 0, vy: -10, radius: 3 });
          bullets.push({ x: player.x + player.w - 8, y: player.y, vx: 0, vy: -10, radius: 3 });
          lastShot = now;
        }

        // Draw Player Ship (Neon Cyber Starfighter)
        ctx.fillStyle = "#00ff66";
        ctx.shadowColor = "#00ff66";
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(player.x + player.w / 2, player.y);
        ctx.lineTo(player.x + player.w, player.y + player.h);
        ctx.lineTo(player.x + player.w / 2, player.y + player.h - 6);
        ctx.lineTo(player.x, player.y + player.h);
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0;

        // Update bullets
        ctx.fillStyle = "#00f0ff";
        ctx.shadowColor = "#00f0ff";
        ctx.shadowBlur = 8;
        bullets.forEach((b, idx) => {
          b.y += b.vy;
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
          ctx.fill();
          if (b.y < -10) bullets.splice(idx, 1);
        });
        ctx.shadowBlur = 0;

        // Spawn Enemies
        spawnTimer++;
        if (spawnTimer % 40 === 0) {
          const colors = ["#ff0055", "#ffaa00", "#cc00ff"];
          enemies.push({
            x: Math.random() * (WIDTH - 40),
            y: -30,
            w: 28,
            h: 24,
            hp: 1,
            speed: Math.random() * 2 + 2,
            color: colors[Math.floor(Math.random() * colors.length)],
          });
        }

        // Update Enemies
        enemies.forEach((en, eIdx) => {
          en.y += en.speed;

          // Enemy ship rendering
          ctx.fillStyle = en.color;
          ctx.shadowColor = en.color;
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.moveTo(en.x, en.y);
          ctx.lineTo(en.x + en.w, en.y);
          ctx.lineTo(en.x + en.w / 2, en.y + en.h);
          ctx.closePath();
          ctx.fill();
          ctx.shadowBlur = 0;

          // Check collision with bullets
          bullets.forEach((b, bIdx) => {
            if (
              b.x > en.x &&
              b.x < en.x + en.w &&
              b.y > en.y &&
              b.y < en.y + en.h
            ) {
              bullets.splice(bIdx, 1);
              enemies.splice(eIdx, 1);
              localScore += 50;
              setScore(localScore);
              updateHighScore(localScore);

              // Spawn explosion particles
              for (let i = 0; i < 8; i++) {
                particles.push({
                  x: en.x + en.w / 2,
                  y: en.y + en.h / 2,
                  vx: (Math.random() - 0.5) * 6,
                  vy: (Math.random() - 0.5) * 6,
                  life: 20,
                  color: en.color,
                });
              }
            }
          });

          // Check collision with player
          if (
            en.x < player.x + player.w &&
            en.x + en.w > player.x &&
            en.y < player.y + player.h &&
            en.y + en.h > player.y
          ) {
            localGameOver = true;
            setGameOver(true);
            setIsPlaying(false);
          }

          if (en.y > HEIGHT) enemies.splice(eIdx, 1);
        });

        // Update particles
        particles.forEach((p, pIdx) => {
          p.x += p.vx;
          p.y += p.vy;
          p.life--;
          ctx.fillStyle = p.color;
          ctx.fillRect(p.x, p.y, 2, 2);
          if (p.life <= 0) particles.splice(pIdx, 1);
        });

        // HUD overlay
        ctx.fillStyle = "#ffffff";
        ctx.font = "14px 'JetBrains Mono', monospace";
        ctx.fillText(`SCORE: ${localScore}`, 16, 28);
        ctx.fillText(`ARMADA DESTROYED: ${Math.floor(localScore / 50)}`, 16, 48);

        animationFrameId = requestAnimationFrame(loop);
      };

      if (isPlaying) {
        animationFrameId = requestAnimationFrame(loop);
      }

      return () => {
        window.removeEventListener("keydown", onKeyDown);
        window.removeEventListener("keyup", onKeyUp);
        cancelAnimationFrame(animationFrameId);
      };
    }

    // -------------------------------------------------------------
    // GAME 2: CYBER SNAKE (Arcade)
    // -------------------------------------------------------------
    if (gameType === "cyber-snake") {
      const GRID_SIZE = 20;
      const COLS = Math.floor(WIDTH / GRID_SIZE);
      const ROWS = Math.floor(HEIGHT / GRID_SIZE);

      let snake = [
        { x: 10, y: 12 },
        { x: 9, y: 12 },
        { x: 8, y: 12 },
      ];
      let dir = { x: 1, y: 0 };
      let nextDir = { x: 1, y: 0 };
      let food = { x: 18, y: 12 };
      let tickCount = 0;

      const onKeyDown = (e: KeyboardEvent) => {
        if (!isPlaying) return;
        if (e.key === "ArrowUp" || e.key === "w") {
          if (dir.y === 0) nextDir = { x: 0, y: -1 };
          e.preventDefault();
        } else if (e.key === "ArrowDown" || e.key === "s") {
          if (dir.y === 0) nextDir = { x: 0, y: 1 };
          e.preventDefault();
        } else if (e.key === "ArrowLeft" || e.key === "a") {
          if (dir.x === 0) nextDir = { x: -1, y: 0 };
          e.preventDefault();
        } else if (e.key === "ArrowRight" || e.key === "d") {
          if (dir.x === 0) nextDir = { x: 1, y: 0 };
          e.preventDefault();
        }
      };

      window.addEventListener("keydown", onKeyDown);

      const loop = () => {
        if (!isPlaying || localGameOver) return;

        tickCount++;
        // Speed up slightly as snake gets longer
        const speedInterval = Math.max(4, 9 - Math.floor(snake.length / 4));

        if (tickCount % speedInterval === 0) {
          dir = nextDir;
          const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

          // Wall collision
          if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
            localGameOver = true;
            setGameOver(true);
            setIsPlaying(false);
            return;
          }

          // Self collision
          for (const seg of snake) {
            if (seg.x === head.x && seg.y === head.y) {
              localGameOver = true;
              setGameOver(true);
              setIsPlaying(false);
              return;
            }
          }

          snake.unshift(head);

          // Eat food
          if (head.x === food.x && head.y === food.y) {
            localScore += 100;
            setScore(localScore);
            updateHighScore(localScore);
            food = {
              x: Math.floor(Math.random() * (COLS - 2)) + 1,
              y: Math.floor(Math.random() * (ROWS - 2)) + 1,
            };
          } else {
            snake.pop();
          }
        }

        // Draw Board
        ctx.fillStyle = "#040714";
        ctx.fillRect(0, 0, WIDTH, HEIGHT);

        // Cyber Grid Lines
        ctx.strokeStyle = "rgba(0, 240, 255, 0.05)";
        ctx.lineWidth = 1;
        for (let x = 0; x < WIDTH; x += GRID_SIZE) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, HEIGHT);
          ctx.stroke();
        }
        for (let y = 0; y < HEIGHT; y += GRID_SIZE) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(WIDTH, y);
          ctx.stroke();
        }

        // Draw Food (Data Packet)
        ctx.fillStyle = "#ff0077";
        ctx.shadowColor = "#ff0077";
        ctx.shadowBlur = 12;
        ctx.fillRect(
          food.x * GRID_SIZE + 2,
          food.y * GRID_SIZE + 2,
          GRID_SIZE - 4,
          GRID_SIZE - 4
        );
        ctx.shadowBlur = 0;

        // Draw Snake
        snake.forEach((seg, i) => {
          ctx.fillStyle = i === 0 ? "#00ff66" : "#00f0ff";
          ctx.shadowColor = i === 0 ? "#00ff66" : "#00f0ff";
          ctx.shadowBlur = i === 0 ? 10 : 4;
          ctx.fillRect(
            seg.x * GRID_SIZE + 1,
            seg.y * GRID_SIZE + 1,
            GRID_SIZE - 2,
            GRID_SIZE - 2
          );
        });
        ctx.shadowBlur = 0;

        // HUD
        ctx.fillStyle = "#ffffff";
        ctx.font = "14px 'JetBrains Mono', monospace";
        ctx.fillText(`DATA PACKETS: ${localScore / 100}`, 16, 28);
        ctx.fillText(`LENGTH: ${snake.length}`, 16, 48);

        animationFrameId = requestAnimationFrame(loop);
      };

      if (isPlaying) {
        animationFrameId = requestAnimationFrame(loop);
      }

      return () => {
        window.removeEventListener("keydown", onKeyDown);
        cancelAnimationFrame(animationFrameId);
      };
    }

    // -------------------------------------------------------------
    // GAME 3: NEON BREAKOUT (Brick Breaker)
    // -------------------------------------------------------------
    if (gameType === "neon-breakout") {
      let paddle = { x: WIDTH / 2 - 50, y: HEIGHT - 30, w: 100, h: 12, speed: 8 };
      let ball = { x: WIDTH / 2, y: HEIGHT - 50, vx: 4, vy: -5, r: 6 };
      let bricks: { x: number; y: number; w: number; h: number; color: string; alive: boolean }[] = [];

      const rows = 5;
      const cols = 9;
      const brickW = 60;
      const brickH = 18;
      const padLeft = 40;
      const padTop = 50;
      const colors = ["#ff0055", "#ffaa00", "#00ff66", "#00f0ff", "#cc00ff"];

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          bricks.push({
            x: padLeft + c * (brickW + 6),
            y: padTop + r * (brickH + 8),
            w: brickW,
            h: brickH,
            color: colors[r % colors.length],
            alive: true,
          });
        }
      }

      const keys: Record<string, boolean> = {};
      const onKeyDown = (e: KeyboardEvent) => {
        keys[e.key.toLowerCase()] = true;
      };
      const onKeyUp = (e: KeyboardEvent) => {
        keys[e.key.toLowerCase()] = false;
      };
      const onMouseMove = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        const scaleX = WIDTH / rect.width;
        const mouseX = (e.clientX - rect.left) * scaleX;
        paddle.x = Math.max(0, Math.min(WIDTH - paddle.w, mouseX - paddle.w / 2));
      };

      window.addEventListener("keydown", onKeyDown);
      window.addEventListener("keyup", onKeyUp);
      canvas.addEventListener("mousemove", onMouseMove);

      const loop = () => {
        if (!isPlaying || localGameOver) return;

        // Move paddle
        if (keys["arrowleft"] || keys["a"]) paddle.x -= paddle.speed;
        if (keys["arrowright"] || keys["d"]) paddle.x += paddle.speed;
        paddle.x = Math.max(0, Math.min(WIDTH - paddle.w, paddle.x));

        // Move ball
        ball.x += ball.vx;
        ball.y += ball.vy;

        // Bounce walls
        if (ball.x - ball.r < 0 || ball.x + ball.r > WIDTH) ball.vx *= -1;
        if (ball.y - ball.r < 0) ball.vy *= -1;

        // Paddle collision
        if (
          ball.y + ball.r >= paddle.y &&
          ball.y - ball.r <= paddle.y + paddle.h &&
          ball.x >= paddle.x &&
          ball.x <= paddle.x + paddle.w
        ) {
          // Angle deflection depending on impact spot
          const hitSpot = (ball.x - (paddle.x + paddle.w / 2)) / (paddle.w / 2);
          ball.vx = hitSpot * 6;
          ball.vy = -Math.abs(ball.vy);
        }

        // Bottom loss
        if (ball.y > HEIGHT) {
          localGameOver = true;
          setGameOver(true);
          setIsPlaying(false);
          return;
        }

        // Brick collision
        let aliveBricks = 0;
        bricks.forEach((b) => {
          if (!b.alive) return;
          aliveBricks++;
          if (
            ball.x + ball.r > b.x &&
            ball.x - ball.r < b.x + b.w &&
            ball.y + ball.r > b.y &&
            ball.y - ball.r < b.y + b.h
          ) {
            b.alive = false;
            ball.vy *= -1;
            localScore += 20;
            setScore(localScore);
            updateHighScore(localScore);
          }
        });

        // Clear screen
        ctx.fillStyle = "#030612";
        ctx.fillRect(0, 0, WIDTH, HEIGHT);

        // Render bricks
        bricks.forEach((b) => {
          if (!b.alive) return;
          ctx.fillStyle = b.color;
          ctx.shadowColor = b.color;
          ctx.shadowBlur = 8;
          ctx.fillRect(b.x, b.y, b.w, b.h);
        });
        ctx.shadowBlur = 0;

        // Render paddle
        ctx.fillStyle = "#00f0ff";
        ctx.shadowColor = "#00f0ff";
        ctx.shadowBlur = 10;
        ctx.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);

        // Render ball
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // HUD
        ctx.fillStyle = "#ffffff";
        ctx.font = "14px 'JetBrains Mono', monospace";
        ctx.fillText(`SCORE: ${localScore}`, 16, 28);
        ctx.fillText(`BRICKS LEFT: ${aliveBricks}`, 16, 48);

        animationFrameId = requestAnimationFrame(loop);
      };

      if (isPlaying) {
        animationFrameId = requestAnimationFrame(loop);
      }

      return () => {
        window.removeEventListener("keydown", onKeyDown);
        window.removeEventListener("keyup", onKeyUp);
        canvas.removeEventListener("mousemove", onMouseMove);
        cancelAnimationFrame(animationFrameId);
      };
    }

    // -------------------------------------------------------------
    // GAME 4: CLUMSY BIRD (Flappy Bird)
    // -------------------------------------------------------------
    if (gameType === "clumsy-bird") {
      let bird = { x: 80, y: HEIGHT / 2, vy: 0, gravity: 0.38, jump: -7, r: 14 };
      let pipes: { x: number; topH: number; bottomY: number; w: number; passed: boolean }[] = [];
      const PIPE_WIDTH = 54;
      const PIPE_GAP = 135;
      let frameCount = 0;

      const flap = () => {
        if (!isPlaying) return;
        bird.vy = bird.jump;
      };

      const onKeyDown = (e: KeyboardEvent) => {
        if (e.code === "Space" || e.key === "ArrowUp" || e.key === "w") {
          e.preventDefault();
          flap();
        }
      };
      const onMouseDown = () => flap();

      window.addEventListener("keydown", onKeyDown);
      canvas.addEventListener("mousedown", onMouseDown);
      canvas.addEventListener("touchstart", flap);

      const loop = () => {
        if (!isPlaying || localGameOver) return;

        frameCount++;
        bird.vy += bird.gravity;
        bird.y += bird.vy;

        // Ground / Ceiling collision
        if (bird.y + bird.r >= HEIGHT || bird.y - bird.r <= 0) {
          localGameOver = true;
          setGameOver(true);
          setIsPlaying(false);
          return;
        }

        // Spawn pipes
        if (frameCount % 85 === 0) {
          const topH = Math.floor(Math.random() * (HEIGHT - PIPE_GAP - 100)) + 40;
          pipes.push({
            x: WIDTH,
            topH: topH,
            bottomY: topH + PIPE_GAP,
            w: PIPE_WIDTH,
            passed: false,
          });
        }

        // Clear screen
        ctx.fillStyle = "#030816";
        ctx.fillRect(0, 0, WIDTH, HEIGHT);

        // Update & Render pipes
        ctx.fillStyle = "#00ff66";
        ctx.shadowColor = "#00ff66";
        ctx.shadowBlur = 8;
        pipes.forEach((p, idx) => {
          p.x -= 3.2;

          // Top pipe
          ctx.fillRect(p.x, 0, p.w, p.topH);
          // Bottom pipe
          ctx.fillRect(p.x, p.bottomY, p.w, HEIGHT - p.bottomY);

          // Score check
          if (!p.passed && p.x + p.w < bird.x) {
            p.passed = true;
            localScore += 1;
            setScore(localScore);
            updateHighScore(localScore);
          }

          // Collision detection
          if (
            bird.x + bird.r > p.x &&
            bird.x - bird.r < p.x + p.w &&
            (bird.y - bird.r < p.topH || bird.y + bird.r > p.bottomY)
          ) {
            localGameOver = true;
            setGameOver(true);
            setIsPlaying(false);
          }

          if (p.x + p.w < -10) pipes.splice(idx, 1);
        });
        ctx.shadowBlur = 0;

        // Render Bird (Neon cyber orb)
        ctx.fillStyle = "#00f0ff";
        ctx.shadowColor = "#00f0ff";
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(bird.x, bird.y, bird.r, 0, Math.PI * 2);
        ctx.fill();

        // Eye
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(bird.x + 6, bird.y - 3, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // HUD
        ctx.fillStyle = "#ffffff";
        ctx.font = "14px 'JetBrains Mono', monospace";
        ctx.fillText(`PIPES CLEARED: ${localScore}`, 16, 28);

        animationFrameId = requestAnimationFrame(loop);
      };

      if (isPlaying) {
        animationFrameId = requestAnimationFrame(loop);
      }

      return () => {
        window.removeEventListener("keydown", onKeyDown);
        canvas.removeEventListener("mousedown", onMouseDown);
        canvas.removeEventListener("touchstart", flap);
        cancelAnimationFrame(animationFrameId);
      };
    }
  }, [isPlaying, gameType]);

  const handleStartGame = () => {
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
  };

  const handleRestart = () => {
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
  };

  return (
    <div className="w-full flex flex-col items-center bg-cyber-dark/90 border border-cyber-border rounded-2xl p-4 sm:p-6 backdrop-blur-md shadow-2xl relative overflow-hidden">
      {/* Top telemetry bar */}
      <div className="w-full flex items-center justify-between pb-4 border-b border-cyber-borderSubtle mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyber-green/10 text-cyber-green border border-cyber-green/30">
            <Zap className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold font-mono text-white flex items-center gap-2">
              {gameName}
              <span className="text-[10px] font-sans px-2 py-0.5 rounded-full bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/30">
                HTML5 Canvas 60FPS
              </span>
            </h3>
            <p className="text-xs font-mono text-cyber-muted">
              Zero install, browser-native client-side simulation.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="flex items-center gap-1.5 text-cyber-green bg-cyber-dark/80 px-3 py-1.5 rounded-lg border border-cyber-borderSubtle">
            <Trophy className="w-4 h-4" />
            <span>BEST: {highScore}</span>
          </div>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1.5 rounded-lg bg-cyber-card border border-cyber-borderSubtle text-cyber-muted hover:text-white transition-colors"
            title="Toggle Audio Feedback"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Canvas Viewport Container */}
      <div className="relative w-full max-w-[640px] aspect-[4/3] bg-black rounded-xl overflow-hidden border border-cyber-borderSubtle flex items-center justify-center shadow-inner">
        <canvas ref={canvasRef} className="w-full h-full object-contain cursor-crosshair" />

        {/* Start / Overlay Screen */}
        {!isPlaying && (
          <div className="absolute inset-0 z-20 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            {gameOver ? (
              <div className="space-y-3">
                <span className="text-xs font-mono px-3 py-1 rounded bg-red-500/20 text-red-400 border border-red-500/40 uppercase tracking-widest font-bold">
                  Mission Terminated
                </span>
                <h4 className="text-2xl sm:text-3xl font-black font-mono text-white">
                  GAME OVER
                </h4>
                <p className="text-sm font-mono text-cyber-green">
                  Final Score: <span className="text-white font-bold">{score}</span>
                </p>
                <button
                  onClick={handleRestart}
                  className="mt-4 px-6 py-2.5 rounded-xl bg-cyber-green text-black font-mono font-black text-sm uppercase tracking-wider hover:bg-cyber-green/90 transition-all flex items-center gap-2 mx-auto shadow-neon-green/40 hover:scale-105"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Play Again</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-cyber-green/20 border border-cyber-green/40 text-cyber-green flex items-center justify-center mx-auto shadow-neon-green/30 animate-bounce">
                  <Play className="w-7 h-7 ml-1" />
                </div>
                <div>
                  <h4 className="text-xl sm:text-2xl font-bold font-mono text-white">
                    {gameName}
                  </h4>
                  <p className="text-xs font-mono text-cyber-muted mt-1 max-w-sm">
                    Press start to launch instant hardware-accelerated HTML5 session.
                  </p>
                </div>
                <button
                  onClick={handleStartGame}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyber-green to-emerald-400 text-black font-mono font-black text-sm uppercase tracking-wider hover:opacity-90 transition-all flex items-center gap-2 mx-auto shadow-neon-green/40 hover:scale-105"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Launch Game (No Install)</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Control instructions bottom bar */}
      <div className="w-full max-w-[640px] flex flex-wrap items-center justify-between gap-2 mt-4 text-[11px] font-mono text-cyber-muted pt-3 border-t border-cyber-borderSubtle/60">
        <div className="flex items-center gap-2">
          <span className="px-1.5 py-0.5 rounded bg-cyber-card border border-cyber-borderSubtle text-slate-300">
            ARROWS / WASD
          </span>
          <span>Move</span>
          <span className="px-1.5 py-0.5 rounded bg-cyber-card border border-cyber-borderSubtle text-slate-300 ml-2">
            SPACE
          </span>
          <span>Action / Fire</span>
        </div>
        <div className="text-cyber-green flex items-center gap-1">
          <Shield className="w-3.5 h-3.5" />
          <span>Pure In-Browser Client</span>
        </div>
      </div>
    </div>
  );
};
