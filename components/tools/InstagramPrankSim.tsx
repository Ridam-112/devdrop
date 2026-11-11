"use client";

import React, { useState, useRef } from "react";
import { Camera, Play, RotateCcw, CheckCircle2, ShieldCheck } from "lucide-react";
import { sound } from "@/lib/utils/audio";

export const InstagramProtocolSim: React.FC = () => {
  const [username, setUsername] = useState("cyber_explorer");
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Auditor Standby");
  const [logs, setLogs] = useState<string[]>([]);
  const [auditResult, setAuditResult] = useState<any | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startAudit = () => {
    if (isRunning) return;
    const cleanUser = username.trim().replace(/^@/, "") || "sample_user";
    setIsRunning(true);
    setProgress(0);
    setAuditResult(null);
    setLogs([`[PUBLIC QUERY] Inspecting public profile namespace: @${cleanUser}`]);
    sound.playKeyClick();

    const sequence = [
      { pct: 10, text: "Connecting to public OpenGraph endpoint & resolving profile CDN...", log: "[ENDPOINT] Resolved Meta CDN edge node: 157.240.22.174." },
      { pct: 22, text: "Scanning public engagement metadata & hashtag density...", log: "[METADATA] Public post headers & media object IDs parsed." },
      { pct: 36, text: "Analyzing public profile visibility & search crawler index...", log: "[VISIBILITY] Profile indexing: Standard Public Web Endpoint." },
      { pct: 50, text: "Interrogating OAuth 2.0 app permissions & third-party tokens...", log: "[OAUTH] 0 rogue third-party app tokens detected." },
      { pct: 64, text: "Auditing credential hygiene & Two-Factor Authentication readiness...", log: "[HYGIENE] Two-Factor Authentication readiness benchmark: CALCULATING." },
      { pct: 78, text: "Checking leaked credential databases (HaveIBeenPwned API sync)...", log: "[BREACH-CHECK] Cross-referencing public username against 12B leak records." },
      { pct: 90, text: "Compiling account protection score & privacy posture matrix...", log: "[SYNTHESIS] Security checklist & protection scorecard assembled." },
      { pct: 100, text: "Public Audit Complete", log: "[FINISH] Security audit report compiled." },
    ];

    let step = 0;
    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 1;
        if (step < sequence.length && next >= sequence[step].pct) {
          const item = sequence[step];
          setStatus(item.text);
          setLogs((l) => [...l, item.log]);
          sound.playKeyClick();
          step++;
        }
        if (next >= 100) {
          if (timerRef.current) clearInterval(timerRef.current);
          finishAudit(cleanUser);
          return 100;
        }
        return next;
      });
    }, 650);
  };

  const finishAudit = (user: string) => {
    setIsRunning(false);
    sound.playAccessGranted();
    setAuditResult({
      user: `@${user}`,
      score: "Grade A+ (Verified)",
      twoFaStatus: "Recommended (Authenticator App / FIDO2 Key)",
      passwordHygieneTip: "Always use a unique 16+ character password with 2FA enabled.",
      phishingResilience: "High (Aware of unauthorized direct message phishing links)",
    });
  };

  const handleReset = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRunning(false);
    setProgress(0);
    setAuditResult(null);
    setLogs([]);
    setStatus("Auditor Standby");
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="p-6 rounded-2xl bg-cyber-card border border-cyber-borderSubtle shadow-card-cyber">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-cyber-borderSubtle/60">
          <div>
            <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
              <Camera className="w-5 h-5 text-pink-500" />
              Public Social Profile Security Auditor
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              Enter any public social media username for a security hygiene inspection.
            </p>
          </div>
          <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full bg-pink-500/10 text-pink-400 border border-pink-500/30">
            AUDITOR ONLINE
          </span>
        </div>

        {/* Input */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="md:col-span-2">
            <label className="block text-xs font-mono text-slate-300 mb-1.5">
              Target Public Username:
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyber-muted font-mono text-sm">@</span>
              <input
                type="text"
                value={username}
                disabled={isRunning}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="username"
                className="w-full bg-cyber-dark border border-cyber-borderSubtle focus:border-pink-500 rounded-xl py-2.5 pl-8 pr-4 text-sm font-mono text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-pink-500"
              />
            </div>
          </div>

          <div className="flex items-end gap-2">
            <button
              onClick={startAudit}
              disabled={isRunning}
              className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-mono font-bold text-xs flex items-center justify-center gap-2 hover:opacity-90 shadow-[0_0_20px_rgba(219,39,119,0.3)] disabled:opacity-50 transition-all"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{isRunning ? "Auditing..." : "Audit Public Handle"}</span>
            </button>
            <button
              onClick={handleReset}
              disabled={isRunning && progress === 0}
              className="p-2.5 rounded-xl bg-cyber-panel border border-cyber-borderSubtle text-slate-300 hover:text-white"
              title="Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2 mb-6">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-300">{status}</span>
            <span className="text-pink-400 font-bold">{progress}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-cyber-dark overflow-hidden border border-cyber-borderSubtle">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Terminal Logs */}
        <div className="p-3.5 rounded-xl bg-cyber-dark border border-cyber-borderSubtle/80 font-mono text-xs max-h-32 overflow-y-auto space-y-1">
          {logs.map((l, i) => (
            <div key={i} className="text-slate-300">
              <span className="text-pink-400">❯</span> {l}
            </div>
          ))}
          {logs.length === 0 && (
            <span className="text-cyber-muted">Awaiting input. Click &apos;Audit Public Handle&apos; to begin scan.</span>
          )}
        </div>
      </div>

      {/* Result Card */}
      {auditResult && (
        <div className="p-6 rounded-2xl bg-cyber-panel border-2 border-pink-500/50 shadow-[0_0_25px_rgba(236,72,153,0.15)] animate-in fade-in duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-pink-500/20 border border-pink-500 flex items-center justify-center text-pink-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-mono uppercase text-pink-400 font-bold tracking-wider">
                AUDIT ASSESSMENT COMPLETE
              </div>
              <h4 className="text-lg font-bold text-white font-mono">
                Security Profile: {auditResult.user}
              </h4>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-cyber-dark border border-cyber-borderSubtle text-xs font-mono mb-4">
            <div>
              <span className="text-cyber-muted block">Security Grade:</span>
              <span className="text-cyber-green font-bold">{auditResult.score}</span>
            </div>
            <div>
              <span className="text-cyber-muted block">Two-Factor Authentication:</span>
              <span className="text-cyber-cyan font-bold">{auditResult.twoFaStatus}</span>
            </div>
            <div>
              <span className="text-cyber-muted block">Phishing Resilience:</span>
              <span className="text-white font-bold">{auditResult.phishingResilience}</span>
            </div>
            <div>
              <span className="text-cyber-muted block">Best Practice:</span>
              <span className="text-slate-300">{auditResult.passwordHygieneTip}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-cyber-dark/80 border border-cyber-borderSubtle text-xs text-slate-300 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-cyber-green flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Account Protection:</strong> Enable Two-Factor Authentication (2FA) with an Authenticator app (like Google Authenticator or 1Password) to safeguard your account against unauthorized access.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export const InstagramPrankSim = InstagramProtocolSim;
