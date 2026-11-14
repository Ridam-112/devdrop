"use client";

import React, { useState, useRef, useEffect } from "react";
import { Play, Maximize2, Minimize2, RotateCcw, Volume2, ShieldCheck, Sparkles, Smartphone, X } from "lucide-react";

interface IframeGamePlayerProps {
  iframeUrl: string;
  gameName: string;
  genre?: string;
  badge?: string;
}

export const IframeGamePlayer: React.FC<IframeGamePlayerProps> = ({
  iframeUrl,
  gameName,
  genre = "Arcade",
  badge,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleStartGame = () => {
    setIsPlaying(true);
  };

  const handleToggleFullscreen = async () => {
    if (!containerRef.current) return;

    try {
      if (!document.fullscreenElement && !isFullscreen) {
        if (containerRef.current.requestFullscreen) {
          await containerRef.current.requestFullscreen().catch(() => {
            // Fallback for mobile browsers restricting requestFullscreen inside iframe parent
            setIsFullscreen(true);
          });
          setIsFullscreen(true);
        } else {
          setIsFullscreen(true);
        }
      } else {
        if (document.fullscreenElement) {
          await document.exitFullscreen().catch(() => {});
        }
        setIsFullscreen(false);
      }
    } catch {
      setIsFullscreen((prev) => !prev);
    }
  };

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
    };
  }, []);

  useEffect(() => {
    if (isFullscreen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isFullscreen]);

  const handleRestart = () => {
    if (iframeRef.current) {
      // Reload iframe directly without reloading page
      const currentSrc = iframeRef.current.src;
      iframeRef.current.src = "";
      setTimeout(() => {
        if (iframeRef.current) {
          iframeRef.current.src = currentSrc;
        }
      }, 50);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`w-full flex flex-col items-center select-none transition-all ${
        isFullscreen
          ? "fixed inset-0 z-50 bg-black flex items-center justify-center p-0 m-0 w-screen h-screen"
          : "relative"
      }`}
    >
      {/* Game Viewport Container */}
      <div
        style={{ touchAction: isPlaying ? "none" : "auto", transform: "translateZ(0)", willChange: "transform" }}
        className={`w-full bg-neutral-950 overflow-hidden relative shadow-2xl transition-all duration-300 ${
          isFullscreen
            ? "h-full w-full rounded-none border-0"
            : "h-[72vh] min-h-[460px] max-h-[840px] sm:h-[680px] md:h-[760px] lg:h-[820px] rounded-2xl border-2 border-cyber-green/40 shadow-cyber-green/10"
        }`}
      >
        {/* Floating Quick Action Overlay when playing (instant mobile fullscreen & restart) */}
        {isPlaying && (
          <div className="absolute top-3 right-3 z-30 flex items-center gap-2">
            <button
              onClick={handleRestart}
              title="Restart Game"
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-black/80 hover:bg-black border border-white/20 text-white font-mono text-xs backdrop-blur-md transition-all active:scale-95 flex items-center gap-1.5 shadow-lg"
            >
              <RotateCcw className="w-3.5 h-3.5 text-cyber-green" />
              <span className="hidden sm:inline">Restart</span>
            </button>
            <button
              onClick={handleToggleFullscreen}
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Mode"}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-black/80 hover:bg-black border border-cyber-green/50 text-white font-mono text-xs backdrop-blur-md transition-all active:scale-95 flex items-center gap-1.5 shadow-lg"
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5 text-cyber-cyan" />
                  <span className="hidden sm:inline">Exit Fullscreen</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5 text-cyber-cyan" />
                  <span className="hidden sm:inline">Fullscreen</span>
                </>
              )}
            </button>
          </div>
        )}
        {!isPlaying ? (
          /* High-Performance Click-to-Play Cover: Saves 100% bandwidth until user actually plays */
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-neutral-900/95 via-neutral-950/98 to-black">
            {/* Background Glow */}
            <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-cyber-green/10 blur-3xl pointer-events-none" />

            {/* Badges */}
            <div className="flex items-center gap-2 mb-4 relative z-10">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-cyber-green/10 text-cyber-green border border-cyber-green/30 flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3 h-3" />
                {badge || `${genre} 60 FPS`}
              </span>
              <span className="text-[11px] font-mono tracking-wider px-2.5 py-1 rounded-full bg-neutral-900 text-neutral-400 border border-neutral-800">
                100% Client-Side
              </span>
            </div>

            {/* Game Name */}
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black font-mono tracking-tight text-white mb-3 max-w-xl relative z-10">
              {gameName}
            </h2>

            <p className="text-xs sm:text-sm font-mono text-neutral-400 max-w-md mb-8 leading-relaxed relative z-10">
              Browser-native high-performance engine. Zero downloads, hardware GPU accelerated, and local state saving.
            </p>

            {/* Neon Play Trigger Button */}
            <button
              onClick={handleStartGame}
              className="relative z-10 group px-8 sm:px-10 py-4 sm:py-5 rounded-2xl bg-cyber-green hover:bg-emerald-400 text-black font-mono font-extrabold text-sm sm:text-base tracking-wider uppercase transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-xl shadow-cyber-green/30 flex items-center gap-3 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center">
                <Play className="w-4 h-4 fill-black text-black ml-0.5" />
              </div>
              <span>START PLAYING</span>
            </button>

            {/* Specs Footer */}
            <div className="flex items-center gap-4 mt-8 text-[11px] font-mono text-neutral-500 relative z-10">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-cyber-green" />
                Zero Latency
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Volume2 className="w-3.5 h-3.5 text-cyber-cyan" />
                Procedural Web Audio
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Smartphone className="w-3.5 h-3.5 text-cyber-cyan" />
                Phone Touch & Responsive
              </span>
            </div>
          </div>
        ) : (
          /* Live Embedded Game Iframe */
          <iframe
            ref={iframeRef}
            src={iframeUrl}
            title={gameName}
            className="w-full h-full border-0 block"
            allow="fullscreen; autoplay; accelerometer; gyroscope; gamepad"
            allowFullScreen
            loading="lazy"
          />
        )}
      </div>

      {/* Control Bar (Only shown when not fullscreen or at top/bottom in normal mode) */}
      {!isFullscreen && (
        <div className="flex items-center justify-between w-full mt-3 px-2 text-xs font-mono text-neutral-400">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-cyber-green font-bold text-[11px]">
              <span className="w-2 h-2 rounded-full bg-cyber-green animate-ping" />
              {isPlaying ? "LIVE GPU ARENA" : "READY TO LAUNCH"}
            </span>
            <span className="hidden sm:inline text-neutral-600">|</span>
            <span className="hidden sm:inline text-[11px] text-neutral-500">
              Ultra Low Latency • Cached In Browser
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isPlaying && (
              <button
                onClick={handleRestart}
                title="Restart Game"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Restart</span>
              </button>
            )}

            <button
              onClick={handleToggleFullscreen}
              title="Fullscreen Mode"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyber-card hover:bg-neutral-800 border border-cyber-borderSubtle text-white font-mono text-xs transition-colors"
            >
              <Maximize2 className="w-3.5 h-3.5 text-cyber-cyan" />
              <span>Fullscreen</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};