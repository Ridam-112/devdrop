"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Share2,
  Camera,
  Play,
  RotateCcw,
  CheckCircle2,
  Volume2,
  VolumeX,
  UserCheck,
  Terminal,
  Zap,
  Sparkles,
  Award,
  Shield,
  Key,
  QrCode,
  Users,
} from "lucide-react";
import { sound } from "@/lib/utils/audio";

interface SocialMediaEngineProps {
  toolSlug: string;
}

export const SocialMediaEngine: React.FC<SocialMediaEngineProps> = ({ toolSlug }) => {
  const isBlueTick = toolSlug.includes("blue-tick") || toolSlug.includes("verification");
  const isFollowers = toolSlug.includes("followers");
  const isWhatsApp = toolSlug.includes("whatsapp");
  const isRecovery = toolSlug.includes("recovery");

  const [username, setUsername] = useState("cyber_shadow_99");
  const [displayName, setDisplayName] = useState("Alex Vance");
  const [targetFollowers, setTargetFollowers] = useState("250,000");
  const [selectedPlatform, setSelectedPlatform] = useState(
    isWhatsApp ? "WhatsApp" : toolSlug.includes("facebook") ? "Facebook" : toolSlug.includes("youtube") ? "YouTube" : "Instagram"
  );

  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");
  const [logs, setLogs] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Live follower count animation
  const [followerCount, setFollowerCount] = useState(1280);

  // Recovery codes
  const [backupCodes, setBackupCodes] = useState<string[]>([]);

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

    addLog(`INITIATING ${selectedPlatform.toUpperCase()} PUBLIC API HANDSHAKE...`);
    addLog(`TARGET PROFILE IDENTIFIER: @${username}`);

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 1;
        if (next === 12) {
          setCurrentStep("Resolving Public Graph API Endpoint & CDN Nodes...");
          addLog("Connecting to edge cluster. Public endpoint TLS 1.3 negotiated.");
          sound.playKeyClick();
        } else if (next === 25) {
          setCurrentStep("Extracting OpenGraph Metadata & Edge CDN Routing...");
          addLog("Querying public endpoint graph. Token authorization layer checked.");
          sound.playKeyClick();
        } else if (next === 42) {
          setCurrentStep("Inspecting Public Engagement Ratios & Graph Index...");
          addLog("Analyzing follower velocity and account creation timestamp index.");
          sound.playKeyClick();
        } else if (next === 60) {
          setCurrentStep("Running Cryptographic Token & Session Diagnostic...");
          addLog("Parsing JWT headers... Bearer token diagnostic complete.");
          sound.playKeyClick();
        } else if (next === 78) {
          setCurrentStep("Compiling Verification Badge & Profile Authority Score...");
          addLog(`Injected verified verification metadata for @${username}.`);
          sound.playCoinChime();
        } else if (next === 90) {
          setCurrentStep("Generating Cryptographic Backup & Recovery Keys...");
          addLog("Generated 4 unique SHA-256 HMAC backup recovery keys.");
          sound.playKeyClick();
        } else if (next >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          setIsCompleted(true);
          setCurrentStep("Profile Audit & Verification Complete");
          setBackupCodes(["9481-2094", "4102-8841", "7719-3320", "5510-9284"]);
          setFollowerCount(254800);
          addLog("OPERATION COMPLETED — Result Preview Rendered.");
          sound.playAccessGranted();
          return 100;
        }
        return next;
      });
    }, 650);
  };

  const handleReset = () => {
    setIsProcessing(false);
    setProgress(0);
    setCurrentStep("");
    setLogs([]);
    setIsCompleted(false);
    setFollowerCount(1280);
    sound.playKeyClick();
  };

  return (
    <div className="bg-cyber-card border border-cyber-border rounded-2xl p-4 sm:p-6 shadow-card-cyber space-y-6">
      {/* Top Controller Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-cyber-borderSubtle">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyber-cyan/10 border border-cyber-cyan/30 flex items-center justify-center text-cyber-cyan">
            {isBlueTick ? <UserCheck className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white font-mono flex items-center gap-2">
              Social Media Protocol & Profile Simulator
            </h2>
            <p className="text-xs text-cyber-muted font-mono">
              Status: {isProcessing ? "PROCESSING PROTOCOL..." : isCompleted ? "SYNCHRONIZED" : "STANDBY"}
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

      {/* Target Setup Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-mono text-cyber-muted uppercase mb-2">Platform</label>
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            disabled={isProcessing}
            className="w-full bg-cyber-dark border border-cyber-borderSubtle focus:border-cyber-green rounded-xl p-3 text-sm text-white font-mono focus:outline-none focus:ring-1 focus:ring-cyber-green disabled:opacity-50"
          >
            <option value="Instagram">Instagram</option>
            <option value="Facebook">Facebook</option>
            <option value="Snapchat">Snapchat</option>
            <option value="WhatsApp">WhatsApp</option>
            <option value="YouTube">YouTube</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-mono text-cyber-muted uppercase mb-2">Target Username / Handle</label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyber-muted font-mono text-sm">@</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="username"
              disabled={isProcessing}
              className="w-full bg-cyber-dark border border-cyber-borderSubtle focus:border-cyber-green rounded-xl py-3 pl-8 pr-3 text-sm text-white font-mono placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyber-green disabled:opacity-50"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono text-cyber-muted uppercase mb-2">Display Name</label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="e.g. Alex Vance"
            disabled={isProcessing}
            className="w-full bg-cyber-dark border border-cyber-borderSubtle focus:border-cyber-green rounded-xl p-3 text-sm text-white font-mono placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyber-green disabled:opacity-50"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={handleStart}
          disabled={isProcessing}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyber-green text-black font-bold font-mono text-sm tracking-wide hover:bg-cyber-green/90 transition-all disabled:opacity-50 shadow-neon-green"
        >
          {isProcessing ? (
            <>
              <Zap className="w-4 h-4 animate-spin" />
              <span>SIMULATING PROTOCOL...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>EXECUTE AUDIT PROTOCOL</span>
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
            <span className="text-cyber-green flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyber-green animate-ping" />
              {currentStep || "Querying social endpoint..."}
            </span>
            <span className="text-white font-bold">{progress}%</span>
          </div>
          <div className="w-full h-2.5 bg-cyber-panel rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyber-cyan via-cyber-green to-cyber-purple transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Social Profile Preview Card (Blue Tick or Followers) */}
      {isCompleted && (
        <div className="p-6 rounded-2xl bg-gradient-to-br from-cyber-panel via-cyber-card to-cyber-dark border border-cyber-cyan/40 shadow-neon-cyan/10 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-cyber-borderSubtle">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-pink-500 via-purple-500 to-amber-500 p-0.5">
                <div className="w-full h-full bg-cyber-dark rounded-full flex items-center justify-center text-white font-bold text-lg font-mono">
                  {displayName.charAt(0).toUpperCase()}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-lg font-bold text-white font-mono">{displayName}</h3>
                  <div className="w-4 h-4 rounded-full bg-sky-500 flex items-center justify-center text-white shadow-sm" title="Verified Badge">
                    <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                  </div>
                </div>
                <div className="text-xs text-cyber-muted font-mono">@{username} • {selectedPlatform}</div>
              </div>
            </div>

            <div className="text-right">
              <span className="px-2.5 py-1 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/40 text-xs font-mono font-bold">
                VERIFIED BADGE
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-cyber-dark/80 rounded-xl border border-cyber-borderSubtle">
              <div className="text-[11px] font-mono text-cyber-muted uppercase">Followers</div>
              <div className="text-lg font-extrabold text-white font-mono">
                {followerCount.toLocaleString()}
              </div>
            </div>
            <div className="p-3 bg-cyber-dark/80 rounded-xl border border-cyber-borderSubtle">
              <div className="text-[11px] font-mono text-cyber-muted uppercase">Following</div>
              <div className="text-lg font-extrabold text-white font-mono">482</div>
            </div>
            <div className="p-3 bg-cyber-dark/80 rounded-xl border border-cyber-borderSubtle">
              <div className="text-[11px] font-mono text-cyber-muted uppercase">Security Index</div>
              <div className="text-lg font-extrabold text-cyber-green font-mono">98% Protected</div>
            </div>
          </div>

          {/* Recovery Codes Box if recovery */}
          {isRecovery && (
            <div className="p-3 rounded-xl bg-cyber-dark border border-cyber-borderSubtle">
              <div className="text-xs font-mono text-cyber-green mb-2 flex items-center gap-1.5 font-bold">
                <Key className="w-3.5 h-3.5" />
                Target 2FA Emergency Backup Keys:
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs text-white">
                {backupCodes.map((code, i) => (
                  <div key={i} className="p-2 bg-black rounded border border-cyber-border text-center select-all">
                    {code}
                  </div>
                ))}
              </div>
            </div>
          )}

          
        </div>
      )}

      {/* Terminal Real-time Console */}
      <div className="rounded-xl bg-black border border-cyber-borderSubtle overflow-hidden">
        <div className="bg-cyber-panel px-4 py-2 border-b border-cyber-borderSubtle flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-cyber-green">
            <Terminal className="w-3.5 h-3.5" />
            <span>social-metadata-telemetry-cli</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">GRAPH API v19.0</span>
        </div>
        <div ref={logsContainerRef} className="p-4 font-mono text-xs text-cyber-green/90 h-36 overflow-y-auto space-y-1 scrollbar-thin">
          {logs.length === 0 ? (
            <div className="text-slate-500 italic">Enter profile handle to preview verification and security attributes.</div>
          ) : (
            logs.map((log, i) => <div key={i}>{log}</div>)
          )}
        </div>
      </div>
    </div>
  );
};
