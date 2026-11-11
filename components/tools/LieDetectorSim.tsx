"use client";

import React, { useState, useRef } from "react";
import { Activity, Play, RotateCcw, CheckCircle2, ShieldAlert } from "lucide-react";
import { sound } from "@/lib/utils/audio";

export const LieDetectorSim: React.FC = () => {
  const [statement, setStatement] = useState("I was reviewing the system audit logs all evening.");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stressLevel, setStressLevel] = useState(42);
  const [verdict, setVerdict] = useState<any | null>(null);

  const analysisVerdicts = [
    {
      outcome: "VERACITY INDEX: 99.4% (CONFIRMED TRUTH)",
      color: "text-cyber-green",
      border: "border-cyber-green",
      badge: "VERIFIED",
      comment: "Biometric stress metrics demonstrate stable autonomic baseline. High probability of factual consistency.",
    },
    {
      outcome: "STRESS DEVIATION DETECTED (HIGH VARIANCE)",
      color: "text-cyber-red",
      border: "border-cyber-red",
      badge: "STRESS ELEVATED",
      comment: "Linguistic cognitive load indicates elevated hesitation. Inconsistency probability exceeds normal baseline.",
    },
    {
      outcome: "COGNITIVE ANOMALY (UNUSUAL SYNTAX)",
      color: "text-cyber-purple",
      border: "border-cyber-purple",
      badge: "ANOMALY",
      comment: "Input sentence structure exhibits non-standard lexical density. Algorithmic confidence inconclusive.",
    },
    {
      outcome: "PARTIAL REALITY INDEX: 68% TRUTH RATIO",
      color: "text-cyber-amber",
      border: "border-cyber-amber",
      badge: "MODERATE",
      comment: "Key statements align with standard factual patterns, with moderate syntactic embellishment detected.",
    },
    {
      outcome: "NEURAL NETWORK CONFIDENCE: 94.2%",
      color: "text-cyber-cyan",
      border: "border-cyber-cyan",
      badge: "OPTIMAL",
      comment: "Autonomic response patterns indicate low deception coefficient.",
    },
  ];

  const polygraphInterval = useRef<NodeJS.Timeout | null>(null);

  const startPolygraph = () => {
    if (isAnalyzing || statement.trim().length === 0) return;
    setIsAnalyzing(true);
    setProgress(0);
    setVerdict(null);
    sound.playBiometricHum();

    let p = 0;
    polygraphInterval.current = setInterval(() => {
      p += 1;
      setProgress(p);
      setStressLevel(Math.floor(25 + Math.sin(p / 5) * 20 + Math.random() * 25));
      if (p % 8 === 0) {
        sound.playKeyClick();
      }

      if (p >= 100) {
        if (polygraphInterval.current) clearInterval(polygraphInterval.current);
        finishAnalysis();
      }
    }, 600);
  };

  const finishAnalysis = () => {
    setIsAnalyzing(false);
    const selected = analysisVerdicts[Math.floor(Math.random() * analysisVerdicts.length)];
    setVerdict(selected);
    sound.playAccessGranted();
  };

  const handleReset = () => {
    if (polygraphInterval.current) clearInterval(polygraphInterval.current);
    setIsAnalyzing(false);
    setProgress(0);
    setVerdict(null);
    setStressLevel(42);
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="p-6 rounded-2xl bg-cyber-card border border-cyber-borderSubtle shadow-card-cyber">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-cyber-borderSubtle/60">
          <div>
            <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyber-purple" />
              AI Neural Polygraph Analyzer
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              Analyze statements using active biometric heart-rate oscilloscope and cognitive stress indexing.
            </p>
          </div>
          <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full bg-cyber-purple/10 text-cyber-purple border border-cyber-purple/30">
            NEURAL ENGINE ACTIVE
          </span>
        </div>

        {/* Statement Input */}
        <div className="mb-6">
          <label className="block text-xs font-mono text-slate-300 mb-1.5">
            Statement to Evaluate:
          </label>
          <textarea
            value={statement}
            disabled={isAnalyzing}
            onChange={(e) => setStatement(e.target.value)}
            rows={3}
            placeholder="Type a statement to inspect..."
            className="w-full bg-cyber-dark border border-cyber-borderSubtle focus:border-cyber-purple rounded-xl p-3 text-sm font-mono text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyber-purple resize-none"
          />

          <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-cyber-muted">Presets:</span>
              {[
                "I was reviewing the code",
                "I was stuck in traffic",
                "I will be there in 5 minutes",
              ].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatement(s)}
                  disabled={isAnalyzing}
                  className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyber-panel text-slate-300 hover:text-cyber-purple transition-colors"
                >
                  &quot;{s}&quot;
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={startPolygraph}
                disabled={isAnalyzing || statement.trim().length === 0}
                className="py-2.5 px-5 rounded-xl bg-cyber-purple text-white font-mono font-bold text-xs flex items-center gap-2 hover:bg-cyber-purple/90 shadow-neon-purple/30 disabled:opacity-50 transition-all"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{isAnalyzing ? "Scanning Polygraph..." : "Analyze Statement"}</span>
              </button>
              <button
                onClick={handleReset}
                disabled={isAnalyzing && progress === 0}
                className="p-2.5 rounded-xl bg-cyber-panel border border-cyber-borderSubtle text-slate-300 hover:text-white"
                title="Reset"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Theatrical Polygraph Oscilloscope Graph */}
        <div className="p-4 rounded-xl bg-cyber-dark border border-cyber-borderSubtle mb-6 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="text-cyber-muted flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-cyber-green animate-pulse" />
              POLYGRAPH HEART-RATE OSCILLOSCOPE
            </span>
            <span className="text-cyber-purple font-bold">
              Stress Index: {stressLevel} BPM
            </span>
          </div>

          {/* Animated SVG Wave Line */}
          <div className="h-20 w-full relative flex items-center">
            <svg className="w-full h-full text-cyber-green" viewBox="0 0 500 100" preserveAspectRatio="none">
              <path
                d={
                  isAnalyzing
                    ? "M 0,50 Q 25,10 50,50 T 100,50 T 150,15 T 180,90 T 210,50 T 260,30 T 310,75 T 360,10 T 410,50 T 500,50"
                    : "M 0,50 Q 25,45 50,50 T 100,50 T 150,48 T 200,52 T 250,50 T 300,47 T 350,52 T 400,50 T 500,50"
                }
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className={isAnalyzing ? "animate-pulse" : ""}
              />
            </svg>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-300">Neural Network Cross-Examination</span>
            <span className="text-cyber-purple font-bold">{progress}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-cyber-dark overflow-hidden border border-cyber-borderSubtle">
            <div
              className="h-full bg-gradient-to-r from-cyber-cyan via-cyber-purple to-pink-500 transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Result Card */}
      {verdict && (
        <div className={`p-6 rounded-2xl bg-cyber-panel border-2 ${verdict.border} shadow-card-cyber animate-in fade-in duration-300`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-cyber-dark border border-white/10 flex items-center justify-center">
              <CheckCircle2 className={`w-6 h-6 ${verdict.color}`} />
            </div>
            <div>
              <span className={`text-xs font-mono uppercase font-bold tracking-wider ${verdict.color}`}>
                {verdict.badge}
              </span>
              <h4 className={`text-xl font-black font-mono ${verdict.color}`}>
                {verdict.outcome}
              </h4>
            </div>
          </div>

          <p className="text-sm text-white font-mono bg-cyber-dark p-4 rounded-xl border border-cyber-borderSubtle leading-relaxed">
            &quot;{statement}&quot;
            <br />
            <span className="text-xs text-slate-300 block mt-2 font-sans">
              Diagnostic Summary: {verdict.comment}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};
