"use client";

import React, { useState, useEffect, useCallback } from "react";
import { RotateCcw, Trophy, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";

type Grid = number[][];

export const Playable2048: React.FC = () => {
  const [grid, setGrid] = useState<Grid>([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [hasWon, setHasWon] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("devdrop_2048_best");
      if (saved) setBestScore(parseInt(saved, 10));
    } catch {}
  }, []);

  const addRandomTile = (currentGrid: Grid): Grid => {
    const emptyCells: { r: number; c: number }[] = [];
    currentGrid.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (cell === 0) emptyCells.push({ r, c });
      });
    });

    if (emptyCells.length === 0) return currentGrid;

    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const newGrid = currentGrid.map((row) => [...row]);
    newGrid[randomCell.r][randomCell.c] = Math.random() < 0.9 ? 2 : 4;
    return newGrid;
  };

  const initGame = useCallback(() => {
    let newGrid: Grid = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    newGrid = addRandomTile(newGrid);
    newGrid = addRandomTile(newGrid);
    setGrid(newGrid);
    setScore(0);
    setGameOver(false);
    setHasWon(false);
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const slideRow = (row: number[]) => {
    const filtered = row.filter((val) => val !== 0);
    const newRow = [];
    let addedScore = 0;

    for (let i = 0; i < filtered.length; i++) {
      if (filtered[i] === filtered[i + 1]) {
        const mergedVal = filtered[i] * 2;
        newRow.push(mergedVal);
        addedScore += mergedVal;
        if (mergedVal === 2048) setHasWon(true);
        i++;
      } else {
        newRow.push(filtered[i]);
      }
    }

    while (newRow.length < 4) {
      newRow.push(0);
    }

    return { newRow, addedScore };
  };

  const moveLeft = (currentGrid: Grid) => {
    let totalAdded = 0;
    const newGrid = currentGrid.map((row) => {
      const { newRow, addedScore } = slideRow(row);
      totalAdded += addedScore;
      return newRow;
    });
    return { newGrid, addedScore: totalAdded };
  };

  const rotateClockwise = (currentGrid: Grid): Grid => {
    const newGrid: Grid = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        newGrid[c][3 - r] = currentGrid[r][c];
      }
    }
    return newGrid;
  };

  const checkGameOver = (currentGrid: Grid): boolean => {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (currentGrid[r][c] === 0) return false;
        if (c < 3 && currentGrid[r][c] === currentGrid[r][c + 1]) return false;
        if (r < 3 && currentGrid[r][c] === currentGrid[r + 1][c]) return false;
      }
    }
    return true;
  };

  const makeMove = useCallback((direction: "left" | "right" | "up" | "down") => {
    setGrid((prevGrid) => {
      let transformedGrid = prevGrid;
      let rotations = 0;

      if (direction === "up") {
        transformedGrid = rotateClockwise(rotateClockwise(rotateClockwise(prevGrid)));
        rotations = 3;
      } else if (direction === "right") {
        transformedGrid = rotateClockwise(rotateClockwise(prevGrid));
        rotations = 2;
      } else if (direction === "down") {
        transformedGrid = rotateClockwise(prevGrid);
        rotations = 1;
      }

      const { newGrid, addedScore } = moveLeft(transformedGrid);

      let finalGrid = newGrid;
      const reverseRotations = (4 - rotations) % 4;
      for (let i = 0; i < reverseRotations; i++) {
        finalGrid = rotateClockwise(finalGrid);
      }

      // Check if grid changed
      const changed = JSON.stringify(prevGrid) !== JSON.stringify(finalGrid);
      if (changed) {
        finalGrid = addRandomTile(finalGrid);
        const newScore = score + addedScore;
        setScore(newScore);
        if (newScore > bestScore) {
          setBestScore(newScore);
          try {
            localStorage.setItem("devdrop_2048_best", newScore.toString());
          } catch {}
        }
        if (checkGameOver(finalGrid)) {
          setGameOver(true);
        }
      }

      return finalGrid;
    });
  }, [score, bestScore]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
      }
      if (e.key === "ArrowLeft" || e.key === "a") makeMove("left");
      if (e.key === "ArrowRight" || e.key === "d") makeMove("right");
      if (e.key === "ArrowUp" || e.key === "w") makeMove("up");
      if (e.key === "ArrowDown" || e.key === "s") makeMove("down");
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [makeMove]);

  const getTileColor = (val: number) => {
    switch (val) {
      case 2:
        return "bg-slate-800 text-slate-100 border-slate-700";
      case 4:
        return "bg-slate-700 text-slate-100 border-slate-600";
      case 8:
        return "bg-amber-600/80 text-white border-amber-500 shadow-md shadow-amber-500/20";
      case 16:
        return "bg-orange-600/80 text-white border-orange-500 shadow-md shadow-orange-500/20";
      case 32:
        return "bg-rose-600/80 text-white border-rose-500 shadow-md shadow-rose-500/20";
      case 64:
        return "bg-red-600 text-white border-red-500 shadow-lg shadow-red-500/30";
      case 128:
        return "bg-cyan-600 text-white border-cyan-400 shadow-lg shadow-cyan-500/30 font-bold";
      case 256:
        return "bg-blue-600 text-white border-blue-400 shadow-lg shadow-blue-500/30 font-bold";
      case 512:
        return "bg-emerald-600 text-white border-emerald-400 shadow-lg shadow-emerald-500/30 font-bold";
      case 1024:
        return "bg-purple-600 text-white border-purple-400 shadow-xl shadow-purple-500/40 font-black";
      case 2048:
        return "bg-gradient-to-r from-yellow-400 to-amber-500 text-black border-yellow-300 shadow-2xl shadow-yellow-400/50 font-black animate-pulse";
      default:
        return "bg-cyber-dark/40 border-cyber-borderSubtle text-transparent";
    }
  };

  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);

  const triggerHaptic = () => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate(10);
      } catch {}
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1) {
      setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!touchStart || e.changedTouches.length === 0) return;
    const deltaX = e.changedTouches[0].clientX - touchStart.x;
    const deltaY = e.changedTouches[0].clientY - touchStart.y;
    const minSwipeDistance = 24;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (Math.abs(deltaX) > minSwipeDistance) {
        triggerHaptic();
        if (deltaX > 0) makeMove("right");
        else makeMove("left");
      }
    } else {
      if (Math.abs(deltaY) > minSwipeDistance) {
        triggerHaptic();
        if (deltaY > 0) makeMove("down");
        else makeMove("up");
      }
    }
    setTouchStart(null);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-cyber-dark/90 border border-cyber-border rounded-2xl p-4 sm:p-6 backdrop-blur-md shadow-2xl">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-cyber-borderSubtle mb-4">
        <div>
          <h3 className="text-xl font-black font-mono text-white flex items-center gap-2">
            2048 HTML5
            <span className="text-[10px] font-sans px-2 py-0.5 rounded bg-cyber-green/10 text-cyber-green border border-cyber-green/30">
              Swipe & Touch Ready
            </span>
          </h3>
          <p className="text-xs font-mono text-cyber-muted mt-0.5">
            Swipe on screen or tap arrows to slide tiles!
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="bg-cyber-card px-2.5 py-1.5 rounded-lg border border-cyber-borderSubtle text-center">
            <div className="text-[9px] text-cyber-muted uppercase">Score</div>
            <div className="text-cyber-cyan font-bold">{score}</div>
          </div>
          <div className="bg-cyber-card px-2.5 py-1.5 rounded-lg border border-cyber-borderSubtle text-center">
            <div className="text-[9px] text-cyber-muted uppercase">Best</div>
            <div className="text-cyber-green font-bold flex items-center gap-1">
              <Trophy className="w-3 h-3" />
              <span>{bestScore}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid container with Touch Swipe Support */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{ touchAction: "none" }}
        className="relative aspect-square w-full bg-black/60 rounded-xl p-3 border border-cyber-borderSubtle shadow-inner grid grid-cols-4 gap-2.5 select-none cursor-grab active:cursor-grabbing"
      >
        {grid.map((row, r) =>
          row.map((cell, c) => (
            <div
              key={`${r}-${c}`}
              className={`rounded-lg flex items-center justify-center font-mono text-xl sm:text-2xl font-bold transition-all duration-100 border ${getTileColor(
                cell
              )}`}
            >
              {cell !== 0 ? cell : ""}
            </div>
          ))
        )}

        {/* Game Over Overlay */}
        {(gameOver || hasWon) && (
          <div className="absolute inset-0 z-20 bg-black/85 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center p-4 text-center">
            <h4 className="text-2xl font-black font-mono text-white mb-2">
              {hasWon ? "🎉 YOU REACHED 2048!" : "GAME OVER"}
            </h4>
            <p className="text-xs font-mono text-cyber-muted mb-4">
              Final score: <span className="text-cyber-green font-bold">{score}</span>
            </p>
            <button
              onClick={initGame}
              className="px-5 py-2 rounded-xl bg-cyber-green text-black font-mono font-bold text-xs uppercase tracking-wider hover:bg-cyber-green/90 transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Try Again</span>
            </button>
          </div>
        )}
      </div>

      {/* Mobile Touch Controller: D-Pad */}
      <div className="mt-4 flex flex-col items-center gap-2">
        <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 sm:hidden">
          📱 Swipe Grid or Tap Arrows
        </div>
        <div className="flex flex-col items-center gap-1">
          <button
            onClick={() => {
              triggerHaptic();
              makeMove("up");
            }}
            className="w-14 h-12 flex items-center justify-center rounded-xl bg-cyber-card border border-cyber-cyan/40 text-cyber-cyan hover:bg-cyber-cyan/20 active:scale-95 active:bg-cyber-cyan active:text-black transition-all shadow-md touch-manipulation"
            aria-label="Up"
          >
            <ArrowUp className="w-6 h-6" />
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => {
                triggerHaptic();
                makeMove("left");
              }}
              className="w-14 h-12 flex items-center justify-center rounded-xl bg-cyber-card border border-cyber-cyan/40 text-cyber-cyan hover:bg-cyber-cyan/20 active:scale-95 active:bg-cyber-cyan active:text-black transition-all shadow-md touch-manipulation"
              aria-label="Left"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => {
                triggerHaptic();
                makeMove("down");
              }}
              className="w-14 h-12 flex items-center justify-center rounded-xl bg-cyber-card border border-cyber-cyan/40 text-cyber-cyan hover:bg-cyber-cyan/20 active:scale-95 active:bg-cyber-cyan active:text-black transition-all shadow-md touch-manipulation"
              aria-label="Down"
            >
              <ArrowDown className="w-6 h-6" />
            </button>
            <button
              onClick={() => {
                triggerHaptic();
                makeMove("right");
              }}
              className="w-14 h-12 flex items-center justify-center rounded-xl bg-cyber-card border border-cyber-cyan/40 text-cyber-cyan hover:bg-cyber-cyan/20 active:scale-95 active:bg-cyber-cyan active:text-black transition-all shadow-md touch-manipulation"
              aria-label="Right"
            >
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Controls Hint & Reset Button */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-cyber-borderSubtle/60 text-xs font-mono text-cyber-muted">
        <span>Use Arrow keys or WASD</span>
        <button
          onClick={initGame}
          className="hover:text-white transition-colors flex items-center gap-1 text-cyber-cyan"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>New Game</span>
        </button>
      </div>
    </div>
  );
};
