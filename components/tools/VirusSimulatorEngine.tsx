"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Skull,
  AlertTriangle,
  ShieldAlert,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
  Zap,
  Terminal,
  Maximize2,
  Minimize2,
  Lock,
  Radio,
  Clock,
  QrCode,
} from "lucide-react";
import { sound } from "@/lib/utils/audio";

interface VirusSimulatorEngineProps {
  toolSlug: string;
}

export const VirusSimulatorEngine: React.FC<VirusSimulatorEngineProps> = ({ toolSlug }) => {
  const isBsod = toolSlug.includes("bsod");
  const isRansom = toolSlug.includes("ransomware");
  const isMatrix = toolSlug.includes("matrix");
  const isPhishing = toolSlug.includes("phishing");

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isTriggered, setIsTriggered] = useState(false);
  const [countdown, setCountdown] = useState(3600 * 24 * 3); // 3 days for ransomware
  const [soundEnabled, setSoundEnabled] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    sound.enabled = soundEnabled;
  }, [soundEnabled]);

  // Handle ESC key to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsFullscreen(false);
        setIsTriggered(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Matrix digital rain canvas engine
  useEffect(() => {
    if (!isMatrix && !isTriggered) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.parentElement?.clientWidth || 800;
    canvas.height = 360;

    const katakana = "アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン";
    const latin = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const alphabet = katakana + latin;

    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const rainDrops: number[] = Array.from({ length: columns }).map(() => 1);

    let animationFrameId: number;

    const render = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#00ff66";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < rainDrops.length; i++) {
        const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
        ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

        if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          rainDrops[i] = 0;
        }
        rainDrops[i]++;
      }
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isMatrix, isTriggered]);

  const handleTrigger = () => {
    setIsTriggered(true);
    if (isBsod) {
      sound.playErrorBuzz();
      setIsFullscreen(true);
    } else if (isRansom || toolSlug.includes("virus")) {
      sound.playAlarmSiren();
    } else {
      sound.playKeyClick();
    }
  };

  const handleReset = () => {
    setIsTriggered(false);
    setIsFullscreen(false);
    sound.playKeyClick();
  };

  const formatTime = (secs: number) => {
    const d = Math.floor(secs / (3600 * 24));
    const h = Math.floor((secs % (3600 * 24)) / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${d}d : ${h < 10 ? "0" : ""}${h}h : ${m < 10 ? "0" : ""}${m}m : ${s < 10 ? "0" : ""}${s}s`;
  };

  return (
    <div className="bg-cyber-card border border-cyber-border rounded-2xl p-4 sm:p-6 shadow-card-cyber space-y-6">
      {/* Top Controller Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-cyber-borderSubtle">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyber-red/10 border border-cyber-red/30 flex items-center justify-center text-cyber-red">
            <Skull className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white font-mono flex items-center gap-2">
              Cyber Threat, BSOD & Payload Simulator
            </h2>
            <p className="text-xs text-cyber-muted font-mono">
              Status: {isTriggered ? "CONFIRMED PAYLOAD ACTIVE" : "CONTAINMENT ACTIVE"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-lg bg-cyber-panel border border-cyber-borderSubtle text-cyber-muted hover:text-white transition-colors"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-cyber-green" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={handleTrigger}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyber-red text-white font-bold font-mono text-sm tracking-wide hover:bg-cyber-red/90 transition-all shadow-neon-red"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>{isBsod ? "TRIGGER BLUE SCREEN (BSOD)" : isRansom ? "TRIGGER RANSOMWARE ALERT" : "DETONATE CONFIRMED PAYLOAD"}</span>
        </button>

        <button
          onClick={handleReset}
          className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-cyber-panel border border-cyber-borderSubtle text-slate-300 font-mono text-sm hover:text-white transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Alert</span>
        </button>

        {isBsod && isTriggered && (
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-cyber-dark border border-cyber-borderSubtle text-slate-300 font-mono text-sm hover:text-white transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            <span>{isFullscreen ? "Exit Fullscreen" : "Fullscreen BSOD"}</span>
          </button>
        )}
      </div>

      {/* Matrix Falling Code Rain Canvas */}
      {isMatrix && (
        <div className="rounded-xl border border-cyber-green/40 overflow-hidden bg-black">
          <canvas ref={canvasRef} className="w-full block" />
        </div>
      )}

      {/* WannaCry Styled Ransomware Alert Screen */}
      {isRansom && isTriggered && (
        <div className="p-6 rounded-2xl bg-gradient-to-br from-red-950 via-black to-slate-950 border-2 border-cyber-red shadow-2xl space-y-5 text-white">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-cyber-red/40 pb-4">
            <div className="flex items-center gap-3">
              <Skull className="w-10 h-10 text-cyber-red animate-bounce" />
              <div>
                <h3 className="text-xl font-extrabold text-cyber-red font-mono tracking-wider">
                  OOPS! YOUR FILES HAVE BEEN ENCRYPTED!
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  All photos, documents, and databases encrypted with RSA-4096.
                </p>
              </div>
            </div>

            <div className="text-center sm:text-right bg-cyber-dark p-3 rounded-xl border border-cyber-red/30">
              <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1 justify-center sm:justify-end">
                <Clock className="w-3.5 h-3.5 text-cyber-red" /> TIME LEFT BEFORE DESTRUCTION
              </div>
              <div className="text-base font-extrabold text-cyber-red font-mono mt-0.5">
                {formatTime(countdown)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-4 bg-cyber-dark/80 rounded-xl border border-cyber-borderSubtle space-y-2">
              <span className="text-cyber-red font-bold block">How to recover your files?</span>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                Send $300 worth of Bitcoin to the designated demonstration address. Your unique decryption private key will be dispatched automatically.
              </p>
              <div className="p-2 bg-black rounded border border-cyber-border text-slate-400 break-all select-all text-[10px]">
                1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa
              </div>
            </div>

            <div className="p-4 bg-cyber-dark/80 rounded-xl border border-cyber-borderSubtle space-y-2">
              <span className="text-cyber-green font-bold block">Encrypted System Files:</span>
              <ul className="text-[11px] text-slate-400 space-y-1">
                <li>• C:\Users\Admin\Documents\passwords.txt [LOCKED]</li>
                <li>• C:\Users\Admin\Pictures\family_backup.zip [LOCKED]</li>
                <li>• C:\Users\Admin\Finance\tax_records_2025.pdf [LOCKED]</li>
                <li>• Total: 18,429 files encrypted with AES-256</li>
              </ul>
            </div>
          </div>

          
        </div>
      )}

      {/* Windows BSOD Fullscreen Overlay */}
      {isBsod && isTriggered && (
        <div
          onClick={() => setIsFullscreen(false)}
          className={`fixed inset-0 z-50 bg-[#0078d7] text-white flex flex-col justify-center px-8 sm:px-20 font-sans cursor-pointer ${
            isFullscreen ? "block" : "hidden"
          }`}
        >
          <div className="max-w-3xl space-y-8 animate-in fade-in duration-300">
            <div className="text-8xl font-light font-mono">:(</div>

            <h2 className="text-2xl sm:text-3xl font-light leading-snug">
              Your PC ran into a problem and needs to restart. We&apos;re just collecting some error info, and then we&apos;ll restart for you.
            </h2>

            <div className="text-lg font-light">100% complete</div>

            <div className="flex items-center gap-6 pt-4">
              <div className="w-24 h-24 bg-white p-2 rounded flex items-center justify-center">
                <QrCode className="w-20 h-20 text-[#0078d7]" />
              </div>

              <div className="text-xs space-y-1 font-mono text-slate-200">
                <p>For more information about this issue and possible fixes, visit https://windows.com/stopcode</p>
                <p className="mt-2 text-white font-bold">Stop code: KERNEL_SECURITY_CHECK_FAILURE</p>
                <p>What failed: ntoskrnl.exe</p>
                <p className="text-slate-300 mt-2 italic">(Click anywhere or press ESC to exit diagnostic)</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* General Threat Warning Screen */}
      {!isRansom && !isBsod && isTriggered && (
        <div className="p-6 rounded-2xl bg-cyber-red/10 border-2 border-cyber-red shadow-neon-red space-y-4">
          <div className="flex items-center gap-3 text-cyber-red font-mono font-bold text-base">
            <AlertTriangle className="w-6 h-6 animate-pulse" />
            <span>CRITICAL SECURITY ALERT: CONFIRMED INTRUSION DETECTED</span>
          </div>

          <p className="text-xs font-mono text-slate-300 leading-relaxed">
            A active kernel backdoor payload has executed within this browser tab sandbox. Memory partition checksum has failed and active firewall filters are offline.
          </p>

          <div className="p-3 bg-black/80 rounded-xl border border-cyber-borderSubtle text-xs font-mono text-cyber-red">
            THREAT SIGNATURE: Trojan.Generic.Simulator.Hackverse / CVE-2026-9912
          </div>
        </div>
      )}
    </div>
  );
};
