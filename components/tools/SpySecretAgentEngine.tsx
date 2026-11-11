"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Eye,
  Radio,
  Shield,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
  Zap,
  Terminal,
  Crosshair,
  UserCheck,
  Bomb,
  Lock,
  Unlock,
  Key,
  Award,
} from "lucide-react";
import { sound } from "@/lib/utils/audio";

interface SpySecretAgentEngineProps {
  toolSlug: string;
}

const MORSE_CODE_MAP: Record<string, string> = {
  A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.",
  G: "--.", H: "....", I: "..", J: ".---", K: "-.-", L: ".-..",
  M: "--", N: "-.", O: "---", P: ".--.", Q: "--.-", R: ".-.",
  S: "...", T: "-", U: "..-", V: "...-", W: ".--", X: "-..-",
  Y: "-.--", Z: "--..", " ": "/",
};

export const SpySecretAgentEngine: React.FC<SpySecretAgentEngineProps> = ({ toolSlug }) => {
  const isIdGen = toolSlug.includes("id");
  const isSelfDestruct = toolSlug.includes("self-destruct");
  const isMorse = toolSlug.includes("morse");
  const isSatellite = toolSlug.includes("satellite");
  const isAdmin = toolSlug.includes("admin");

  // Agent ID generator states
  const [agentName, setAgentName] = useState("Alexander Vance");
  const [codename, setCodename] = useState("Agent Spectre-09");
  const [agency, setAgency] = useState("MI6 Cyber Operations");
  const [clearance, setClearance] = useState("Level 5 (Cosmic Top Secret)");

  // Self-destruct states
  const [destructCountdown, setDestructCountdown] = useState(10);
  const [isDestructing, setIsDestructing] = useState(false);
  const [isExploded, setIsExploded] = useState(false);

  // Morse code states
  const [morseInput, setMorseInput] = useState("TOP SECRET MISSION");
  const [morseOutput, setMorseOutput] = useState("");

  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");
  const [logs, setLogs] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const logsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    sound.enabled = soundEnabled;
  }, [soundEnabled]);

  useEffect(() => {
    if (logsContainerRef.current) {
      logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
    }
  }, [logs]);

  // Convert text to morse code dynamically
  useEffect(() => {
    if (isMorse) {
      const upper = morseInput.toUpperCase();
      const encoded = upper
        .split("")
        .map((char) => MORSE_CODE_MAP[char] || "")
        .join(" ");
      setMorseOutput(encoded);
    }
  }, [morseInput, isMorse]);

  // Self-destruct countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isDestructing && destructCountdown > 0) {
      timer = setTimeout(() => {
        setDestructCountdown((c) => c - 1);
        sound.playAlarmSiren();
      }, 1000);
    } else if (isDestructing && destructCountdown === 0) {
      setIsDestructing(false);
      setIsExploded(true);
      sound.playErrorBuzz();
    }
    return () => clearTimeout(timer);
  }, [isDestructing, destructCountdown]);

  const addLog = (msg: string) => {
    const time = new Date().toTimeString().split(" ")[0];
    setLogs((prev) => [...prev, `[${time}] ${msg}`]);
  };

  const handleStart = () => {
    if (isSelfDestruct) {
      setIsDestructing(true);
      setDestructCountdown(10);
      setIsExploded(false);
      sound.playAlarmSiren();
      return;
    }

    if (isProcessing) return;
    setIsProcessing(true);
    setProgress(0);
    setLogs([]);
    setIsCompleted(false);
    sound.playKeyClick();

    addLog(`INITIALIZING CLASSIFIED AGENT PROTOCOL: [${agency.toUpperCase()}]...`);

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 1;
        if (next === 15) {
          setCurrentStep("Authenticating Biometric Cryptographic Iris Hash...");
          addLog("Iris verification match: 99.8%. Clearance authorized.");
          sound.playKeyClick();
        } else if (next === 40) {
          setCurrentStep("Interrogating Global Security Agency Quantum Directory...");
          addLog("Cross-referencing agency database clearance: Level 5 Top Secret.");
          sound.playKeyClick();
        } else if (next === 68) {
          setCurrentStep("Encoding Microchip Hologram & Watermark...");
          addLog("Injecting quantum-resistant digital seal into credentials.");
          sound.playCoinChime();
        } else if (next === 88) {
          setCurrentStep("Compiling Encrypted Dossier & Field Identity Matrix...");
          addLog("Biometric cryptographic passport generated.");
          sound.playKeyClick();
        } else if (next >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          setIsCompleted(true);
          setCurrentStep("Protocol Authorization Verified");
          addLog("CLASSIFIED IDENTIFICATION PASSED.");
          sound.playAccessGranted();
          return 100;
        }
        return next;
      });
    }, 650);
  };

  const playMorseSound = () => {
    if (!soundEnabled) return;
    const symbols = morseOutput.split("");
    let delay = 0;
    symbols.forEach((s) => {
      if (s === ".") {
        setTimeout(() => sound.playMorseBeep(false), delay * 1000);
        delay += 0.15;
      } else if (s === "-") {
        setTimeout(() => sound.playMorseBeep(true), delay * 1000);
        delay += 0.28;
      } else if (s === " ") {
        delay += 0.2;
      }
    });
  };

  const handleReset = () => {
    setIsProcessing(false);
    setProgress(0);
    setCurrentStep("");
    setLogs([]);
    setIsCompleted(false);
    setIsDestructing(false);
    setIsExploded(false);
    setDestructCountdown(10);
    sound.playKeyClick();
  };

  return (
    <div className="bg-cyber-card border border-cyber-border rounded-2xl p-4 sm:p-6 shadow-card-cyber space-y-6">
      {/* Top Controller Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-cyber-borderSubtle">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Crosshair className="w-5 h-5 animate-spin" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white font-mono flex items-center gap-2">
              Classified Intelligence & Secret Agent Protocol
            </h2>
            <p className="text-xs text-cyber-muted font-mono">
              Status: {isDestructing ? "SELF-DESTRUCT ARMED" : isProcessing ? "AUTHORIZING..." : "STANDBY"}
            </p>
          </div>
        </div>

        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="p-2 rounded-lg bg-cyber-panel border border-cyber-borderSubtle text-cyber-muted hover:text-white transition-colors"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-cyber-green" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>

      {/* Inputs for Agent ID Generator */}
      {isIdGen && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-mono text-cyber-muted uppercase mb-2">Agent Name</label>
            <input
              type="text"
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              disabled={isProcessing}
              className="w-full bg-cyber-dark border border-cyber-borderSubtle focus:border-cyan-400 rounded-xl p-3 text-sm text-white font-mono placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-cyber-muted uppercase mb-2">Codename</label>
            <input
              type="text"
              value={codename}
              onChange={(e) => setCodename(e.target.value)}
              disabled={isProcessing}
              className="w-full bg-cyber-dark border border-cyber-borderSubtle focus:border-cyan-400 rounded-xl p-3 text-sm text-white font-mono placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-cyber-muted uppercase mb-2">Agency Branch</label>
            <select
              value={agency}
              onChange={(e) => setAgency(e.target.value)}
              disabled={isProcessing}
              className="w-full bg-cyber-dark border border-cyber-borderSubtle focus:border-cyan-400 rounded-xl p-3 text-sm text-white font-mono focus:outline-none focus:ring-1 focus:ring-cyan-400 disabled:opacity-50"
            >
              <option value="MI6 Cyber Operations">MI6 Cyber Operations</option>
              <option value="CIA Directorate of Operations">CIA Directorate of Operations</option>
              <option value="Interpol Cybercrime Unit">Interpol Cybercrime Unit</option>
              <option value="Mossad Special Operations">Mossad Special Operations</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono text-cyber-muted uppercase mb-2">Clearance Level</label>
            <select
              value={clearance}
              onChange={(e) => setClearance(e.target.value)}
              disabled={isProcessing}
              className="w-full bg-cyber-dark border border-cyber-borderSubtle focus:border-cyan-400 rounded-xl p-3 text-sm text-white font-mono focus:outline-none focus:ring-1 focus:ring-cyan-400 disabled:opacity-50"
            >
              <option value="Level 5 (Cosmic Top Secret)">Level 5 (Cosmic Top Secret)</option>
              <option value="Level 4 (Eyes Only)">Level 4 (Eyes Only)</option>
              <option value="Level 3 (Secret Classified)">Level 3 (Secret Classified)</option>
            </select>
          </div>
        </div>
      )}

      {/* Morse Code Text Input */}
      {isMorse && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-cyber-muted uppercase mb-2">
              Type Message to Convert into Morse Code Beeps
            </label>
            <input
              type="text"
              value={morseInput}
              onChange={(e) => setMorseInput(e.target.value)}
              className="w-full bg-cyber-dark border border-cyber-borderSubtle focus:border-cyan-400 rounded-xl p-3 text-sm text-white font-mono placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400"
            />
          </div>

          <div className="p-4 bg-cyber-dark rounded-xl border border-cyber-borderSubtle">
            <div className="text-xs font-mono text-cyber-muted uppercase mb-1">Morse Transmission Stream:</div>
            <div className="text-xl font-bold font-mono text-cyan-400 tracking-widest break-all">
              {morseOutput}
            </div>
            <button
              onClick={playMorseSound}
              className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500 text-black font-bold font-mono text-xs hover:bg-cyan-400 transition-colors"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>PLAY MORSE AUDIO BEEPS</span>
            </button>
          </div>
        </div>
      )}

      {/* Self-Destruct Red Countdown Panel */}
      {isSelfDestruct && (
        <div className="p-8 rounded-3xl bg-gradient-to-br from-red-950 via-black to-slate-950 border-2 border-cyber-red shadow-neon-red text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-cyber-red/20 border-2 border-cyber-red flex items-center justify-center mx-auto text-cyber-red animate-pulse">
            <Bomb className="w-10 h-10" />
          </div>

          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-cyber-red font-bold">
              CLASSIFIED DEVICE DESTRUCTION SEQUENCE
            </div>
            <div className="text-6xl sm:text-7xl font-extrabold font-mono mt-2 text-white">
              00:{destructCountdown < 10 ? `0${destructCountdown}` : destructCountdown}
            </div>
            <div className="text-xs text-slate-400 font-mono mt-2">
              {isExploded
                ? "💥 CONFIRMED DETONATION EXECUTED — MEMORY SHREDDED."
                : isDestructing
                ? "⚠️ AUTO-PURGE IN PROGRESS. HARD DISK DEGAUSSING INITIATED..."
                : "ARM SAFETY MECHANISM BEFORE TRIGGERING"}
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={handleStart}
          disabled={isProcessing || isDestructing}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 text-black font-bold font-mono text-sm tracking-wide hover:bg-cyan-400 transition-all disabled:opacity-50 shadow-neon-cyan"
        >
          {isProcessing ? (
            <>
              <Zap className="w-4 h-4 animate-spin" />
              <span>AUTHORIZING CREDENTIALS...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>{isSelfDestruct ? "ARM & DETONATE (10s)" : "GENERATE CLASSIFIED BADGE"}</span>
            </>
          )}
        </button>

        <button
          onClick={handleReset}
          disabled={isProcessing}
          className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-cyber-panel border border-cyber-borderSubtle text-slate-300 font-mono text-sm hover:text-white transition-colors disabled:opacity-50"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset</span>
        </button>
      </div>

      {/* Progress Bar */}
      {isProcessing && (
        <div className="space-y-2 p-4 bg-cyber-dark/80 rounded-xl border border-cyber-borderSubtle">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-cyan-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              {currentStep || "Querying agency database..."}
            </span>
            <span className="text-white font-bold">{progress}%</span>
          </div>
          <div className="w-full h-2.5 bg-cyber-panel rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-cyber-green to-cyan-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Printable / Viewable Agent ID Card */}
      {isIdGen && isCompleted && (
        <div className="max-w-md mx-auto p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-black to-slate-950 border-2 border-cyan-400 shadow-2xl space-y-4 text-white font-mono">
          <div className="flex items-center justify-between border-b border-cyan-400/30 pb-3">
            <div className="text-xs uppercase font-bold text-cyan-400">{agency}</div>
            <div className="text-[10px] bg-red-600 px-2 py-0.5 rounded text-white font-bold">TOP SECRET</div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-20 h-24 rounded-lg bg-cyber-panel border border-cyan-400/40 flex flex-col items-center justify-center text-slate-400">
              <UserCheck className="w-10 h-10 text-cyan-400" />
              <span className="text-[9px] mt-1 uppercase">ID: 0092-X</span>
            </div>

            <div className="space-y-1 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">OPERATIVE NAME:</span>
                <span className="font-bold text-white text-sm">{agentName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">CODENAME:</span>
                <span className="text-cyan-400 font-bold">{codename}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">SECURITY CLEARANCE:</span>
                <span className="text-emerald-400 font-bold">{clearance}</span>
              </div>
            </div>
          </div>

          <div className="border-t border-cyan-400/30 pt-2 text-[10px] text-slate-400 text-center">
            OFFICIAL AGENT CREDENTIAL • AUTHORIZED ACCESS ONLY
          </div>
        </div>
      )}

      {/* Terminal Real-time Console */}
      <div className="rounded-xl bg-black border border-cyber-borderSubtle overflow-hidden">
        <div className="bg-cyber-panel px-4 py-2 border-b border-cyber-borderSubtle flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <Terminal className="w-3.5 h-3.5" />
            <span>classified-c4i-telemetry</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">SATELLITE LINK: NRO-KEYHOLE</span>
        </div>
        <div ref={logsContainerRef} className="p-4 font-mono text-xs text-cyan-300/90 h-32 overflow-y-auto space-y-1 scrollbar-thin">
          {logs.length === 0 ? (
            <div className="text-slate-500 italic">Select classified action and execute protocol sequence.</div>
          ) : (
            logs.map((log, i) => <div key={i}>{log}</div>)
          )}
        </div>
      </div>
    </div>
  );
};
