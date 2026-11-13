"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Gamepad2,
  Flame,
  Zap,
  Coins,
  Shield,
  Trophy,
  Play,
  RotateCcw,
  CheckCircle2,
  Volume2,
  VolumeX,
  Crosshair,
  Award,
  Terminal,
  Sparkles,
} from "lucide-react";
import { sound } from "@/lib/utils/audio";

interface GamingSimulatorEngineProps {
  toolSlug: string;
}

const WEAPON_SKINS = [
  { name: "M416 Glacier (Max Level 7)", rarity: "Mythic", game: "BGMI", effect: "Glacier Hit Effect + Loot Crate" },
  { name: "MP40 Predatory Cobra (Level 7)", rarity: "Evo Gun", game: "Free Fire", effect: "Cobra Venom Kill Feed" },
  { name: "AWM Godzilla Roar (Max)", rarity: "Legendary", game: "BGMI", effect: "Titan Lightning Discharge" },
  { name: "AKM Desert Fossil (Level 4)", rarity: "Epic", game: "BGMI", effect: "Fossilized Bone Elimination" },
  { name: "Scar-L Water Blaster (Max)", rarity: "Mythic", game: "BGMI", effect: "Hydro Pressure Spray" },
];

export const GamingSimulatorEngine: React.FC<GamingSimulatorEngineProps> = ({ toolSlug }) => {
  const isFreeFire = toolSlug.includes("free-fire") || toolSlug.includes("diamond");
  const defaultGame = isFreeFire ? "Free Fire MAX" : "BGMI / PUBG Mobile";

  const [playerId, setPlayerId] = useState("5189302148");
  const [selectedGame, setSelectedGame] = useState(defaultGame);
  const [currencyAmount, setCurrencyAmount] = useState(toolSlug.includes("diamond") ? "5600" : "8100");
  const [selectedSkin, setSelectedSkin] = useState(WEAPON_SKINS[0].name);
  const [selectedRank, setSelectedRank] = useState(isFreeFire ? "Grandmaster" : "Conqueror");

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

  const addLog = (msg: string) => {
    const time = new Date().toTimeString().split(" ")[0];
    setLogs((prev) => [...prev, `[${time}] ${msg}`]);
  };

  const handleLaunch = () => {
    if (isProcessing) return;
    setIsProcessing(true);
    setProgress(0);
    setLogs([]);
    setIsCompleted(false);
    sound.playKeyClick();

    addLog(`INITIALIZING CONNECTION TO ${selectedGame.toUpperCase()} MASTER CLOUD SERVER...`);
    addLog(`QUERYING TARGET PLAYER ID / IGN: "${playerId}"...`);

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 1;
        if (next === 12) {
          setCurrentStep("Handshaking with Game Anti-Cheat Gateway...");
          addLog("Interpreting SSL certificate chain. Client spoofing token accepted.");
          sound.playKeyClick();
        } else if (next === 30) {
          setCurrentStep("Resolving Cloud Database Player Shard & Profile UUID...");
          addLog(`Queried user profile for "${playerId}". Shard cluster: AP-South-1.`);
          sound.playKeyClick();
        } else if (next === 50) {
          setCurrentStep("Injecting Memory Pointer & Cosmetic Inventory Registry...");
          addLog(`Target payload: ${currencyAmount} Credits | Item: ${selectedSkin}`);
          sound.playKeyClick();
        } else if (next === 72) {
          setCurrentStep("Syncing Cloud Database Shard & Profile Cache...");
          addLog("Patching remote database sector 0x88F... Transaction verification passed.");
          sound.playCoinChime();
        } else if (next === 88) {
          setCurrentStep("Bypassing In-Game Telemetry & Integrity Checksum...");
          addLog("Recomputing SHA-256 client package checksum. Response: 200 OK.");
          sound.playKeyClick();
        } else if (next >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          setIsCompleted(true);
          setCurrentStep("Diagnostic Cycle Finished");
          addLog("SERVER INJECTION COMPLETED SUCCESSFULLY!");
          addLog("Inventory payload synchronized successfully.");
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
    sound.playKeyClick();
  };

  return (
    <div className="bg-cyber-card border border-cyber-border rounded-2xl p-4 sm:p-6 shadow-card-cyber space-y-6">
      {/* Top Controller Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-cyber-borderSubtle">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyber-green/10 border border-cyber-green/30 flex items-center justify-center text-cyber-green">
            {isFreeFire ? <Flame className="w-5 h-5 text-amber-400" /> : <Gamepad2 className="w-5 h-5" />}
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white font-mono flex items-center gap-2">
              Esports Engine &amp; Game Data Console
            </h2>
            <p className="text-xs text-cyber-muted font-mono">
              Status: {isProcessing ? "TRANSMITTING INJECTION PACKETS..." : isCompleted ? "SYNCHRONIZED" : "STANDBY"}
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-mono text-cyber-muted uppercase mb-2">
            Target Gaming Platform
          </label>
          <select
            value={selectedGame}
            onChange={(e) => setSelectedGame(e.target.value)}
            disabled={isProcessing}
            className="w-full bg-cyber-dark border border-cyber-borderSubtle focus:border-cyber-green rounded-xl p-3 text-sm text-white font-mono focus:outline-none focus:ring-1 focus:ring-cyber-green disabled:opacity-50"
          >
            <option value="BGMI / PUBG Mobile">BGMI / PUBG Mobile</option>
            <option value="Free Fire MAX">Free Fire MAX</option>
            <option value="Call of Duty Mobile">Call of Duty Mobile</option>
            <option value="Valorant Mobile">Valorant Mobile</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-mono text-cyber-muted uppercase mb-2">
            Player UID or Character Name
          </label>
          <input
            type="text"
            value={playerId}
            onChange={(e) => setPlayerId(e.target.value)}
            placeholder="e.g. 518392849 or Soul_Mortal"
            disabled={isProcessing}
            className="w-full bg-cyber-dark border border-cyber-borderSubtle focus:border-cyber-green rounded-xl p-3 text-sm text-white font-mono placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyber-green disabled:opacity-50"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-cyber-muted uppercase mb-2">
            {toolSlug.includes("diamond") ? "Select Diamonds Amount" : "Select UC / Coins Amount"}
          </label>
          <select
            value={currencyAmount}
            onChange={(e) => setCurrencyAmount(e.target.value)}
            disabled={isProcessing}
            className="w-full bg-cyber-dark border border-cyber-borderSubtle focus:border-cyber-green rounded-xl p-3 text-sm text-white font-mono focus:outline-none focus:ring-1 focus:ring-cyber-green disabled:opacity-50"
          >
            <option value="3600">3,600 Credits</option>
            <option value="5600">5,600 Credits</option>
            <option value="8100">8,100 Credits (Popular)</option>
            <option value="16200">16,200 Elite Bundle</option>
          </select>
        </div>
      </div>

      {/* Additional Tool Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-mono text-cyber-muted uppercase mb-2">
            Target Skin / Cosmetic Item
          </label>
          <select
            value={selectedSkin}
            onChange={(e) => setSelectedSkin(e.target.value)}
            disabled={isProcessing}
            className="w-full bg-cyber-dark border border-cyber-borderSubtle focus:border-cyber-green rounded-xl p-3 text-sm text-white font-mono focus:outline-none focus:ring-1 focus:ring-cyber-green disabled:opacity-50"
          >
            {WEAPON_SKINS.map((s) => (
              <option key={s.name} value={s.name}>
                {s.name} [{s.rarity}]
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-mono text-cyber-muted uppercase mb-2">
            Target Rank / Tier Rating
          </label>
          <select
            value={selectedRank}
            onChange={(e) => setSelectedRank(e.target.value)}
            disabled={isProcessing}
            className="w-full bg-cyber-dark border border-cyber-borderSubtle focus:border-cyber-green rounded-xl p-3 text-sm text-white font-mono focus:outline-none focus:ring-1 focus:ring-cyber-green disabled:opacity-50"
          >
            <option value="Conqueror">Conqueror (Top 100 Server)</option>
            <option value="Grandmaster">Grandmaster III</option>
            <option value="Ace Dominator">Ace Dominator (12 Stars)</option>
            <option value="Crown Elite">Crown Elite</option>
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={handleLaunch}
          disabled={isProcessing}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyber-green text-black font-bold font-mono text-sm tracking-wide hover:bg-cyber-green/90 transition-all disabled:opacity-50 shadow-neon-green"
        >
          {isProcessing ? (
            <>
              <Zap className="w-4 h-4 animate-spin" />
              <span>SYNCING CLOUD INJECTION...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>EXECUTE GENERATION CYCLE</span>
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
              {currentStep || "Querying master cluster..."}
            </span>
            <span className="text-white font-bold">{progress}%</span>
          </div>
          <div className="w-full h-2.5 bg-cyber-panel rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 via-cyber-green to-cyber-cyan transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Final Generated Result Profile Card */}
      {isCompleted && (
        <div className="p-6 rounded-2xl bg-gradient-to-br from-cyber-panel via-cyber-card to-cyber-dark border border-cyber-green/40 shadow-neon-green/10 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-cyber-borderSubtle">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Trophy className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <div className="text-xs font-mono text-cyber-muted uppercase">Player Profile Synchronized</div>
                <h3 className="text-xl font-extrabold text-white font-mono flex items-center gap-2">
                  <span>{playerId}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-cyber-green/20 text-cyber-green border border-cyber-green/40">
                    VERIFIED
                  </span>
                </h3>
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs font-mono text-cyber-muted">Tier Rank</div>
              <div className="text-sm font-bold text-amber-400 font-mono flex items-center gap-1 justify-end">
                <Award className="w-4 h-4" />
                {selectedRank}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 bg-cyber-dark/80 rounded-xl border border-cyber-borderSubtle">
              <div className="text-[11px] font-mono text-cyber-muted uppercase">Credits Added</div>
              <div className="text-xl font-extrabold text-cyber-green font-mono">+{currencyAmount}</div>
            </div>
            <div className="p-3 bg-cyber-dark/80 rounded-xl border border-cyber-borderSubtle">
              <div className="text-[11px] font-mono text-cyber-muted uppercase">Unlocked Armory</div>
              <div className="text-xs font-bold text-cyber-cyan font-mono truncate">{selectedSkin}</div>
            </div>
            <div className="p-3 bg-cyber-dark/80 rounded-xl border border-cyber-borderSubtle">
              <div className="text-[11px] font-mono text-cyber-muted uppercase">K/D Ratio</div>
              <div className="text-xl font-extrabold text-white font-mono">6.84</div>
            </div>
            <div className="p-3 bg-cyber-dark/80 rounded-xl border border-cyber-borderSubtle">
              <div className="text-[11px] font-mono text-cyber-muted uppercase">Server Status</div>
              <div className="text-xs font-bold text-cyber-green font-mono">Anti-Cheat Safe</div>
            </div>
          </div>

          
        </div>
      )}

      {/* Terminal Real-time Console */}
      <div className="rounded-xl bg-black border border-cyber-borderSubtle overflow-hidden">
        <div className="bg-cyber-panel px-4 py-2 border-b border-cyber-borderSubtle flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-cyber-green">
            <Terminal className="w-3.5 h-3.5" />
            <span>esports-cloud-injection-terminal</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">SHARD: ap-south-1</span>
        </div>
        <div ref={logsContainerRef} className="p-4 font-mono text-xs text-cyber-green/90 h-36 overflow-y-auto space-y-1 scrollbar-thin">
          {logs.length === 0 ? (
            <div className="text-slate-500 italic">Enter target player UID and initiate active injection sequence.</div>
          ) : (
            logs.map((log, i) => <div key={i}>{log}</div>)
          )}
        </div>
      </div>
    </div>
  );
};
