"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Cpu,
  Brain,
  Heart,
  MessageSquare,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
  Zap,
  Terminal,
  Activity,
  Award,
} from "lucide-react";
import { sound } from "@/lib/utils/audio";

interface AiFunnyEngineProps {
  toolSlug: string;
}

const ROASTS = [
  "Your code has more unhandled promises than your ex, and your GitHub looks like a cemetery for dead side-projects.",
  "You spent 6 hours centering a div just to realize you forgot to commit it before your terminal crashed.",
  "Your password is probably 'Password123!' and you think using incognito mode hides you from the NSA.",
  "You talk about microservices like you're building Netflix, but your server has 3 active users: you, your mom, and a Google bot.",
];

const HACKER_NAMES = [
  "0xPhantom_Viper",
  "Shadow_Kernel_X",
  "NullPointer_Monk",
  "Cipher_Ghost_99",
  "Quantum_Spectre",
  "Byte_Surgeon",
  "Vortex_Rootkit",
];

export const AiFunnyEngine: React.FC<AiFunnyEngineProps> = ({ toolSlug }) => {
  const isLove = toolSlug.includes("love");
  const isFriend = toolSlug.includes("friendship");
  const isRoast = toolSlug.includes("roast");
  const isHackerName = toolSlug.includes("name");
  const isMindReader = toolSlug.includes("mind");
  const isFuture = toolSlug.includes("future") || toolSlug.includes("fortune");

  const [input1, setInput1] = useState(isLove || isFriend ? "Alex" : "Neo_Coder");
  const [input2, setInput2] = useState(isLove || isFriend ? "Jordan" : "React.js Developer");
  const [mindNumber, setMindNumber] = useState("42");

  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");
  const [logs, setLogs] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Results
  const [score, setScore] = useState(94);
  const [roastResult, setRoastResult] = useState("");
  const [hackerNameResult, setHackerNameResult] = useState("");

  const logsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    sound.enabled = soundEnabled;
  }, [soundEnabled]);

  useEffect(() => {
    if (logsContainerRef.current) {
      logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const addLog = (msg: string) => {
    const time = new Date().toTimeString().split(" ")[0];
    setLogs((prev) => [...prev, `[${time}] ${msg}`]);
  };

  const handleStart = () => {
    if (isProcessing) return;
    setIsProcessing(true);
    setProgress(0);
    setLogs([]);
    setIsCompleted(false);
    sound.playKeyClick();

    addLog("SPAWNING NEURAL TENSORFLOW COGNITIVE INFERENCE ENGINE...");
    addLog(`INPUT VECTORS: Subject="${input1}" | Secondary="${input2}"`);

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 10;
        if (next === 30) {
          setCurrentStep("Calculating Quantum Synapse Weights & Entropy Coefficient...");
          addLog("Running 50,000 epoch backpropagation pass. Loss: 0.0012.");
          sound.playKeyClick();
        } else if (next === 70) {
          setCurrentStep("Analyzing Emotional Telemetry & Behavioral Matrices...");
          addLog("Sentiment variance classified: +94.2% alignment.");
          sound.playCoinChime();
        } else if (next >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          setIsCompleted(true);
          setCurrentStep("Inference Analysis Finalized");

          // Pick random results deterministically
          setRoastResult(ROASTS[Math.floor(Math.random() * ROASTS.length)]);
          setHackerNameResult(HACKER_NAMES[Math.floor(Math.random() * HACKER_NAMES.length)]);
          setScore(85 + Math.floor(Math.random() * 14));

          addLog("INFERENCE COMPLETED. Displaying analysis output.");
          sound.playAccessGranted();
          return 100;
        }
        return next;
      });
    }, 140);
  };

  const handleReset = () => {
    setIsProcessing(false);
    setProgress(0);
    setCurrentStep("");
    setLogs([]);
    setIsCompleted(false);
    sound.playKeyClick();
  };

  return (
    <div className="bg-cyber-card border border-cyber-border rounded-2xl p-4 sm:p-6 shadow-card-cyber space-y-6">
      {/* Top Controller Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-cyber-borderSubtle">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Brain className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white font-mono flex items-center gap-2">
              Neural Cognitive & AI Personality Matrix
            </h2>
            <p className="text-xs text-cyber-muted font-mono">
              Status: {isProcessing ? "EVALUATING SYNAPSE TENSORS..." : isCompleted ? "INFERENCE READY" : "STANDBY"}
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

      {/* Target Setup Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-mono text-cyber-muted uppercase mb-2">
            {isLove ? "Your Name" : isFriend ? "First Friend's Name" : isRoast ? "Target Handle / Nickname" : isMindReader ? "Think of a Secret Number" : "Subject Name"}
          </label>
          <input
            type="text"
            value={input1}
            onChange={(e) => setInput1(e.target.value)}
            disabled={isProcessing}
            className="w-full bg-cyber-dark border border-cyber-borderSubtle focus:border-purple-400 rounded-xl p-3 text-sm text-white font-mono placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-400 disabled:opacity-50"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-cyber-muted uppercase mb-2">
            {isLove ? "Partner / Crush's Name" : isFriend ? "Second Friend's Name" : isRoast ? "Bio / Favorite Tech Stack" : "Secondary Seed Keyword"}
          </label>
          <input
            type="text"
            value={input2}
            onChange={(e) => setInput2(e.target.value)}
            disabled={isProcessing}
            className="w-full bg-cyber-dark border border-cyber-borderSubtle focus:border-purple-400 rounded-xl p-3 text-sm text-white font-mono placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-400 disabled:opacity-50"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={handleStart}
          disabled={isProcessing}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-500 text-white font-bold font-mono text-sm tracking-wide hover:bg-purple-600 transition-all disabled:opacity-50 shadow-neon-purple"
        >
          {isProcessing ? (
            <>
              <Zap className="w-4 h-4 animate-spin" />
              <span>RUNNING NEURAL MODEL...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>ACTIVATE COGNITIVE SCAN</span>
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
            <span className="text-purple-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
              {currentStep || "Running transformer layers..."}
            </span>
            <span className="text-white font-bold">{progress}%</span>
          </div>
          <div className="w-full h-2.5 bg-cyber-panel rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyber-cyan transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Results View */}
      {isCompleted && (
        <div className="p-6 rounded-2xl bg-gradient-to-br from-cyber-panel via-cyber-card to-cyber-dark border border-purple-500/40 shadow-neon-purple/10 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-cyber-borderSubtle">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
                {isLove ? <Heart className="w-6 h-6 text-pink-500 fill-current animate-bounce" /> : <Sparkles className="w-6 h-6 text-purple-400" />}
              </div>
              <div>
                <div className="text-xs font-mono text-cyber-muted uppercase">Cognitive Result Summary</div>
                <h3 className="text-xl font-extrabold text-white font-mono">
                  {isLove ? `${input1} + ${input2}` : isHackerName ? "Generated Callsign" : "AI Assessment"}
                </h3>
              </div>
            </div>

            <div className="text-right">
              <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-mono font-bold">
                SCORE: {score}%
              </span>
            </div>
          </div>

          {/* Conditional Result Body */}
          {isRoast && (
            <div className="p-4 bg-cyber-dark rounded-xl border border-cyber-borderSubtle">
              <div className="text-xs font-mono text-pink-400 mb-1 font-bold">🔥 AI Savage Roast Verdict:</div>
              <p className="text-sm font-mono text-white leading-relaxed">&ldquo;{roastResult}&rdquo;</p>
            </div>
          )}

          {isHackerName && (
            <div className="p-4 bg-cyber-dark rounded-xl border border-cyber-borderSubtle text-center">
              <div className="text-xs font-mono text-cyber-muted uppercase mb-1">Your Elite Underground Alias:</div>
              <div className="text-2xl font-extrabold text-cyber-green font-mono tracking-wider select-all">
                {hackerNameResult}
              </div>
            </div>
          )}

          {isMindReader && (
            <div className="p-4 bg-cyber-dark rounded-xl border border-cyber-borderSubtle text-center">
              <div className="text-xs font-mono text-cyber-muted uppercase mb-1">Neural Mind Reading Result:</div>
              <p className="text-base font-mono text-white">
                The number / concept you were visualizing was: <span className="text-cyber-cyan font-bold text-xl">{input1}</span>
              </p>
              <p className="text-xs text-slate-400 mt-1">Brainwave sync verified via quantum heuristic pulse.</p>
            </div>
          )}

          {(isLove || isFriend) && (
            <div className="p-4 bg-cyber-dark rounded-xl border border-cyber-borderSubtle text-center space-y-2">
              <div className="text-4xl font-extrabold text-pink-400 font-mono">{score}% Match</div>
              <p className="text-xs font-mono text-slate-300">
                &ldquo;Exceptional emotional resonance frequency! Unbreakable bond detected across all cognitive dimensions.&rdquo;
              </p>
            </div>
          )}

          
        </div>
      )}

      {/* Terminal Real-time Console */}
      <div className="rounded-xl bg-black border border-cyber-borderSubtle overflow-hidden">
        <div className="bg-cyber-panel px-4 py-2 border-b border-cyber-borderSubtle flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-purple-400">
            <Terminal className="w-3.5 h-3.5" />
            <span>tensorflow-cognitive-runtime</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">CORE: PYTORCH_CUDA</span>
        </div>
        <div ref={logsContainerRef} className="p-4 font-mono text-xs text-purple-300/90 h-32 overflow-y-auto space-y-1 scrollbar-thin">
          {logs.length === 0 ? (
            <div className="text-slate-500 italic">Enter parameters to initiate AI personality and prediction analysis.</div>
          ) : (
            logs.map((log, i) => <div key={i}>{log}</div>)
          )}
        </div>
      </div>
    </div>
  );
};
