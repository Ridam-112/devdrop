"use client";

import React, { useState, useEffect, useRef } from "react";
import { Terminal, Maximize2, Minimize2 } from "lucide-react";
import { sound } from "@/lib/utils/audio";
import confetti from "canvas-confetti";

export const HackerTerminalSim: React.FC = () => {
  const [alias, setAlias] = useState("cipher");
  const [inputVal, setInputVal] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMatrixMode, setIsMatrixMode] = useState(false);
  const [history, setHistory] = useState<string[]>([
    "===========================================================",
    "         HACKVERSE UNDERGROUND TERMINAL v4.2.0             ",
    "===========================================================",
    "Type 'help' to inspect available system commands.",
    "Try 'matrix', 'scan', 'decrypt', or 'access-grant'.",
    "-----------------------------------------------------------",
  ]);

  const terminalContainerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (terminalContainerRef.current) {
      terminalContainerRef.current.scrollTop = terminalContainerRef.current.scrollHeight;
    }
  }, [history]);

  const commandHandlers: Record<string, (args: string[]) => void> = {
    help: () => {
      setHistory((prev) => [
        ...prev,
        "Available Terminal Commands:",
        "  help         - Display this manual page",
        "  matrix       - Toggle the green digital rain stream",
        "  scan         - Perform network subnet vulnerability sweep",
        "  decrypt      - Execute cryptographic key derivation test",
        "  access-grant - Trigger visual ACCESS GRANTED sequence",
        "  sat-link     - Calibrate orbital communication link",
        "  whoami       - View current operative profile",
        "  alias <name> - Change your terminal shell username",
        "  clear        - Clear terminal screen",
      ]);
    },
    clear: () => {
      setHistory([]);
    },
    whoami: () => {
      setHistory((prev) => [
        ...prev,
        `User: ${alias}@underground.local`,
        "Privilege: Superuser (Root Sandbox)",
        "Session: TTY /dev/pts/42 (Encrypted)",
      ]);
    },
    alias: (args) => {
      if (args[0]) {
        const newAlias = args[0].replace(/[^a-zA-Z0-9_-]/g, "");
        setAlias(newAlias || "cipher");
        setHistory((prev) => [...prev, `[CONFIG] Terminal alias updated to: ${newAlias}`]);
      } else {
        setHistory((prev) => [...prev, "Usage: alias <your-hacker-name>"]);
      }
    },
    matrix: () => {
      setIsMatrixMode((prev) => !prev);
      setHistory((prev) => [
        ...prev,
        "[MATRIX] Toggling digital rain streaming canvas...",
      ]);
    },
    scan: () => {
      setHistory((prev) => [
        ...prev,
        "[SCAN] Initializing SYN stealth port sweep across 198.51.100.0/24...",
        "[HOST 198.51.100.12] Port 22/SSH: OPEN",
        "[HOST 198.51.100.45] Port 443/HTTPS: OPEN",
        "[HOST 198.51.100.89] Port 8080/HTTP-PROXY: FILTERED",
        "[COMPLETE] Subnet sweep finished. 3 active nodes identified.",
      ]);
    },
    decrypt: () => {
      setHistory((prev) => [
        ...prev,
        "[DECRYPT] Loading AES-256 ciphertext block: 0x9f4a...b21c",
        "[ROUNDS] Permuting S-boxes (Round 1/14)...",
        "[ROUNDS] Permuting S-boxes (Round 8/14)...",
        "[ROUNDS] Permuting S-boxes (Round 14/14)...",
        "[RESULT] Plaintext payload recovered: 'THE EAGLE HAS LANDED'",
      ]);
    },
    "access-grant": () => {
      sound.playAccessGranted();
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {}
      setHistory((prev) => [
        ...prev,
        "***********************************************************",
        "  [✓] OVERRIDE ACCEPTED: ACCESS GRANTED TO MAINFRAME       ",
        "***********************************************************",
      ]);
    },
    "sat-link": () => {
      setHistory((prev) => [
        ...prev,
        "[SAT-LINK] Tuning parabolic dish to 14.2 GHz Ku-band...",
        "[CARRIER] Uplink to orbital satellite ASTRA-99 established.",
        "[BANDWIDTH] 10 Gbps atmospheric microwave conduit synchronized.",
      ]);
    },
  };

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = inputVal.trim();
    if (!raw) return;

    sound.playKeyClick();
    const promptLine = `${alias}@hackverse:~$ ${raw}`;
    const parts = raw.split(" ");
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    setHistory((prev) => [...prev, promptLine]);
    setInputVal("");

    if (commandHandlers[cmd]) {
      commandHandlers[cmd](args);
    } else {
      setHistory((prev) => [
        ...prev,
        `bash: command not found: ${cmd}. Type 'help' for available commands.`,
      ]);
      sound.playErrorBuzz();
    }
  };

  return (
    <div className={`w-full flex flex-col gap-4 ${isFullscreen ? "fixed inset-0 z-50 bg-black p-6" : ""}`}>
      {/* Terminal Window Frame */}
      <div className="w-full rounded-2xl bg-[#03060a] border border-cyber-green/40 shadow-[0_0_35px_rgba(0,255,102,0.15)] flex flex-col overflow-hidden">
        {/* Terminal Window Header Bar */}
        <div className="bg-[#090f18] px-4 py-3 flex items-center justify-between border-b border-cyber-borderSubtle">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
            <span className="text-xs font-mono text-slate-300 ml-2">
              bash — {alias}@underground.local
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <button
              onClick={() => setIsMatrixMode(!isMatrixMode)}
              className={`px-2 py-0.5 rounded border transition-colors ${
                isMatrixMode
                  ? "bg-cyber-green text-black border-cyber-green font-bold"
                  : "bg-cyber-panel text-slate-300 border-cyber-borderSubtle hover:text-white"
              }`}
            >
              Matrix Mode
            </button>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1 rounded text-slate-400 hover:text-white"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Terminal Output Screen */}
        <div
          ref={terminalContainerRef}
          onClick={() => inputRef.current?.focus()}
          className={`p-5 font-mono text-xs sm:text-sm text-cyber-green min-h-[380px] max-h-[520px] overflow-y-auto space-y-1 relative cursor-text select-text ${
            isMatrixMode ? "bg-[radial-gradient(#052e16_1px,transparent_1px)] [background-size:16px_16px]" : ""
          }`}
        >
          {history.map((line, idx) => (
            <div key={idx} className="leading-relaxed whitespace-pre-wrap break-all">
              {line}
            </div>
          ))}

          {/* Active Command Input Line */}
          <form onSubmit={handleCommandSubmit} className="flex items-center gap-2 mt-2">
            <span className="text-cyber-cyan font-bold select-none whitespace-nowrap">
              {alias}@hackverse:~$
            </span>
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-white font-mono text-xs sm:text-sm p-0 focus:ring-0"
              placeholder="type 'help'..."
            />
          </form>
        </div>

        {/* Quick Command Toolbar */}
        <div className="bg-[#090f18] px-4 py-2.5 border-t border-cyber-borderSubtle/60 flex items-center justify-between flex-wrap gap-2 text-[11px] font-mono text-cyber-muted">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span>Quick:</span>
            {["help", "matrix", "scan", "decrypt", "access-grant", "clear"].map((cmd) => (
              <button
                key={cmd}
                onClick={() => {
                  setInputVal(cmd);
                  inputRef.current?.focus();
                }}
                className="px-2 py-0.5 rounded bg-cyber-dark border border-cyber-borderSubtle text-slate-300 hover:text-cyber-green hover:border-cyber-green transition-colors"
              >
                {cmd}
              </button>
            ))}
          </div>
          <span>Active Terminal Shell</span>
        </div>
      </div>
    </div>
  );
};
