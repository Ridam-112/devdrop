"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  KeyRound,
  ShieldCheck,
  Play,
  RotateCcw,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  Copy,
  RefreshCw,
  Hash,
  Sparkles,
} from "lucide-react";
import { sound } from "@/lib/utils/audio";

const COMMON_BREACH_PASSWORDS = [
  "123456", "password", "123456789", "12345", "12345678", "qwerty", "1234567",
  "111111", "123123", "admin", "welcome", "iloveyou", "password123", "monkey",
  "dragon", "master", "sunshine", "princess", "football", "solo",
];

export const PasswordCrackerSim: React.FC = () => {
  const [password, setPassword] = useState("CorrectHorseBatteryStaple!42");
  const [isSimulating, setIsSimulating] = useState(false);
  const [crackedChars, setCrackedChars] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [sha256Hash, setSha256Hash] = useState<string>("");

  // Generator settings
  const [genLength, setGenLength] = useState(16);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeUpper, setIncludeUpper] = useState(true);

  // Compute real SHA-256 hash using native Web Crypto API
  useEffect(() => {
    if (password.length === 0) {
      setSha256Hash("");
      return;
    }
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    if (typeof window !== "undefined" && window.crypto && window.crypto.subtle) {
      window.crypto.subtle
        .digest("SHA-256", data)
        .then((buf) => {
          const hashArray = Array.from(new Uint8Array(buf));
          const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
          setSha256Hash(hashHex);
        })
        .catch(() => {});
    }
  }, [password]);

  // Educational Shannon Entropy Calculation
  const stats = useMemo(() => {
    const len = password.length;
    let poolSize = 0;
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecial = /[^a-zA-Z0-9]/.test(password);

    if (hasLower) poolSize += 26;
    if (hasUpper) poolSize += 26;
    if (hasNumbers) poolSize += 10;
    if (hasSpecial) poolSize += 33;

    const isCommon = COMMON_BREACH_PASSWORDS.includes(password.toLowerCase().trim());

    if (poolSize === 0 || len === 0) {
      return {
        entropyBits: 0,
        crackTime: "Instant (0 seconds)",
        rating: "Very Weak",
        color: "text-red-400",
        poolSize: 0,
        hasLower,
        hasUpper,
        hasNumbers,
        hasSpecial,
        isCommon,
      };
    }

    // Entropy E = L * log2(poolSize)
    const entropyBits = isCommon ? 4 : Math.round(len * Math.log2(poolSize));

    let crackTime = "";
    let rating = "Weak";
    let color = "text-red-400";

    if (isCommon) {
      crackTime = "Instant (In known breach dictionaries)";
      rating = "Compromised / In Wordlist";
      color = "text-red-500";
    } else if (entropyBits < 30) {
      crackTime = "Less than 1 second";
      rating = "Very Weak";
      color = "text-red-400";
    } else if (entropyBits < 50) {
      crackTime = "A few minutes to hours";
      rating = "Weak";
      color = "text-amber-400";
    } else if (entropyBits < 70) {
      crackTime = "A few months to years";
      rating = "Moderate";
      color = "text-cyber-cyan";
    } else if (entropyBits < 90) {
      crackTime = "Several centuries (thousands of years)";
      rating = "Strong";
      color = "text-cyber-green";
    } else {
      crackTime = "Trillions of years (Exceeds age of Universe)";
      rating = "Immense (Quantum-Resistant)";
      color = "text-cyber-green";
    }

    return {
      entropyBits,
      crackTime,
      rating,
      color,
      poolSize,
      hasLower,
      hasUpper,
      hasNumbers,
      hasSpecial,
      isCommon,
    };
  }, [password]);

  // Real secure random password generator
  const generateStrongPassword = () => {
    sound.playKeyClick();
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const nums = "0123456789";
    const syms = "!@#$%^&*()_+~`|}{[]:;?><,./-=";

    let chars = lower;
    if (includeUpper) chars += upper;
    if (includeNumbers) chars += nums;
    if (includeSymbols) chars += syms;

    const array = new Uint32Array(genLength);
    if (typeof window !== "undefined" && window.crypto) {
      window.crypto.getRandomValues(array);
    }

    let result = "";
    for (let i = 0; i < genLength; i++) {
      result += chars[array[i] % chars.length];
    }
    setPassword(result);
  };

  const copyPassword = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    sound.playKeyClick();
    setTimeout(() => setCopied(false), 1500);
  };

  const runVisualCrackDiagnostic = () => {
    if (isSimulating || password.length === 0) return;
    setIsSimulating(true);
    setCrackedChars([]);
    sound.playKeyClick();

    const target = password.split("");
    let lockedCount = 0;
    let scrambleTicks = 0;
    const ticksPerChar = Math.max(12, Math.floor(600 / (target.length || 1))); // total ~60 seconds

    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";

    const interval = setInterval(() => {
      scrambleTicks++;

      if (scrambleTicks >= ticksPerChar) {
        scrambleTicks = 0;
        lockedCount++;
        sound.playKeyClick();
      }

      if (lockedCount >= target.length) {
        clearInterval(interval);
        setCrackedChars(target);
        setIsSimulating(false);
        sound.playAccessGranted();
      } else {
        // Build array with locked characters and current scrambling character
        const currentArr: string[] = [];
        for (let i = 0; i < lockedCount; i++) {
          currentArr.push(target[i]);
        }
        // Random scramble for current character
        const randomChar = charset[Math.floor(Math.random() * charset.length)];
        currentArr.push(randomChar);
        setCrackedChars(currentArr);
      }
    }, 100);
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="p-6 rounded-2xl bg-cyber-card border border-cyber-borderSubtle shadow-card-cyber">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-cyber-borderSubtle/60">
          <div>
            <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-cyber-green" />
              Cryptographic Password Strength &amp; Entropy Engine
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              Live mathematical entropy, SHA-256 digest, dictionary breach verification, and password generator.
            </p>
          </div>
          <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full bg-cyber-green/10 text-cyber-green border border-cyber-green/30">
            100% CLIENT-SIDE &amp; LOCAL
          </span>
        </div>

        {/* Password Input & Generator Actions */}
        <div className="mb-6 space-y-3">
          <label className="block text-xs font-mono text-slate-300">
            Password String (Zero network transmission &bull; Evaluated in browser RAM):
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Type or generate a sample password..."
              className="flex-1 bg-cyber-dark border border-cyber-borderSubtle focus:border-cyber-green rounded-xl py-3 px-4 text-sm sm:text-base font-mono text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyber-green"
            />
            <button
              onClick={copyPassword}
              type="button"
              className="px-4 py-3 rounded-xl bg-cyber-panel border border-cyber-borderSubtle hover:border-cyber-green text-xs font-mono text-slate-200 hover:text-white flex items-center gap-1.5 transition-colors"
              title="Copy to Clipboard"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-cyber-green" />
                  <span className="text-cyber-green font-bold">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </>
              )}
            </button>
            <button
              onClick={generateStrongPassword}
              type="button"
              className="px-4 py-3 rounded-xl bg-cyber-green text-black font-mono font-bold text-xs flex items-center gap-1.5 hover:bg-cyber-green/90 shadow-neon-green/30 transition-all"
              title="Generate New Random Password"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Generate</span>
            </button>
          </div>

          {/* Generator Controls */}
          <div className="p-3.5 rounded-xl bg-cyber-panel/60 border border-cyber-borderSubtle flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-[11px]">Length ({genLength}):</span>
              <input
                type="range"
                min={8}
                max={32}
                value={genLength}
                onChange={(e) => setGenLength(parseInt(e.target.value, 10))}
                className="w-24 accent-cyber-green cursor-pointer"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3 text-[11px]">
              <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeUpper}
                  onChange={(e) => setIncludeUpper(e.target.checked)}
                  className="rounded accent-cyber-green"
                />
                Uppercase (A-Z)
              </label>
              <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeNumbers}
                  onChange={(e) => setIncludeNumbers(e.target.checked)}
                  className="rounded accent-cyber-green"
                />
                Digits (0-9)
              </label>
              <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeSymbols}
                  onChange={(e) => setIncludeSymbols(e.target.checked)}
                  className="rounded accent-cyber-green"
                />
                Symbols (!@#$)
              </label>
            </div>
          </div>

          {/* Common Breach Warning */}
          {stats.isCommon && (
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/60 text-red-300 text-xs font-mono flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <span>
                <strong>Warning:</strong> This password matches one of the most common entries in known public credential breach dictionaries.
              </span>
            </div>
          )}
        </div>

        {/* Live Mathematical Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-cyber-dark border border-cyber-borderSubtle">
            <span className="text-xs font-mono text-cyber-muted block">Shannon Entropy:</span>
            <div className="text-2xl font-bold font-mono text-cyber-cyan mt-1">
              {stats.entropyBits} <span className="text-xs font-normal text-slate-400">bits</span>
            </div>
            <span className="text-[11px] text-slate-400 block mt-1">
              Pool size: {stats.poolSize} characters
            </span>
          </div>

          <div className="p-4 rounded-xl bg-cyber-dark border border-cyber-borderSubtle">
            <span className="text-xs font-mono text-cyber-muted block">Estimated Brute Force Time:</span>
            <div className={`text-sm sm:text-base font-bold font-mono mt-1 ${stats.color}`}>
              {stats.crackTime}
            </div>
            <span className="text-[11px] text-slate-400 block mt-1">
              Against 100 Billion guesses/sec
            </span>
          </div>

          <div className="p-4 rounded-xl bg-cyber-dark border border-cyber-borderSubtle">
            <span className="text-xs font-mono text-cyber-muted block">Complexity Rating:</span>
            <div className={`text-lg sm:text-xl font-bold font-mono mt-1 ${stats.color}`}>
              {stats.rating}
            </div>
            <span className="text-[11px] text-slate-400 block mt-1">
              {password.length} total characters
            </span>
          </div>
        </div>

        {/* Character Set Indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6 text-xs font-mono">
          <div
            className={`p-2.5 rounded-lg border flex items-center justify-between ${
              stats.hasLower
                ? "bg-cyber-green/10 border-cyber-green text-cyber-green"
                : "bg-cyber-dark border-cyber-borderSubtle text-cyber-muted"
            }`}
          >
            <span>Lowercase (a-z)</span>
            <span>{stats.hasLower ? "✓" : "✗"}</span>
          </div>
          <div
            className={`p-2.5 rounded-lg border flex items-center justify-between ${
              stats.hasUpper
                ? "bg-cyber-green/10 border-cyber-green text-cyber-green"
                : "bg-cyber-dark border-cyber-borderSubtle text-cyber-muted"
            }`}
          >
            <span>Uppercase (A-Z)</span>
            <span>{stats.hasUpper ? "✓" : "✗"}</span>
          </div>
          <div
            className={`p-2.5 rounded-lg border flex items-center justify-between ${
              stats.hasNumbers
                ? "bg-cyber-green/10 border-cyber-green text-cyber-green"
                : "bg-cyber-dark border-cyber-borderSubtle text-cyber-muted"
            }`}
          >
            <span>Numbers (0-9)</span>
            <span>{stats.hasNumbers ? "✓" : "✗"}</span>
          </div>
          <div
            className={`p-2.5 rounded-lg border flex items-center justify-between ${
              stats.hasSpecial
                ? "bg-cyber-green/10 border-cyber-green text-cyber-green"
                : "bg-cyber-dark border-cyber-borderSubtle text-cyber-muted"
            }`}
          >
            <span>Symbols (!@#)</span>
            <span>{stats.hasSpecial ? "✓" : "✗"}</span>
          </div>
        </div>

        {/* SHA-256 Hash Preview */}
        {sha256Hash && (
          <div className="mb-6 p-3.5 rounded-xl bg-cyber-dark border border-cyber-borderSubtle text-xs font-mono">
            <div className="flex items-center justify-between text-cyber-muted mb-1 text-[11px]">
              <span className="flex items-center gap-1.5 text-cyber-cyan">
                <Hash className="w-3.5 h-3.5" /> Client-Side SHA-256 Hash Digest:
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(sha256Hash);
                  sound.playKeyClick();
                }}
                className="text-slate-400 hover:text-white inline-flex items-center gap-1"
              >
                <Copy className="w-3 h-3" /> Copy Hash
              </button>
            </div>
            <div className="text-slate-300 break-all select-all text-[11px] bg-black/60 p-2 rounded">
              {sha256Hash}
            </div>
          </div>
        )}

        {/* Target Brute Force Visualizer */}
        <div className="p-4 rounded-xl bg-cyber-panel border border-cyber-borderSubtle">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono text-white font-bold">
              GPU Hashcat / Permutation Benchmark
            </span>
            <button
              onClick={runVisualCrackDiagnostic}
              disabled={isSimulating || password.length === 0}
              className="px-3 py-1.5 rounded-lg bg-cyber-green text-black font-mono font-bold text-xs hover:bg-cyber-green/90 disabled:opacity-50 transition-all flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-black" />
              <span>Run Brute-Force Benchmark</span>
            </button>
          </div>

          <div className="p-3 rounded-lg bg-cyber-dark font-mono text-sm tracking-wider text-cyber-green border border-cyber-borderSubtle flex items-center gap-1 min-h-[46px] overflow-x-auto">
            {crackedChars.length > 0 ? (
              crackedChars.map((ch, idx) => (
                <span key={idx} className="bg-cyber-green/20 px-1 rounded text-white animate-pulse">
                  {ch}
                </span>
              ))
            ) : (
              <span className="text-cyber-muted text-xs">
                Click &apos;Run Brute-Force Benchmark&apos; to watch character-by-character deduction.
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Educational Guidance */}
      <div className="p-4 rounded-xl bg-cyber-dark/80 border border-cyber-borderSubtle text-xs text-slate-300 flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-cyber-green flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Security Recommendation:</strong> Modern standards (NIST SP 800-63B) favor long passphrases (16+ characters) combined with multi-factor authentication (2FA/FIDO2) rather than short passwords with forced quarterly resets.
        </p>
      </div>
    </div>
  );
};
