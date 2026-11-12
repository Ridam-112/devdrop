"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import QRCode from "qrcode";
import {
  QrCode,
  Type,
  Key,
  FileImage,
  ArrowRight,
  Copy,
  Check,
  Download,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  Scissors
} from "lucide-react";

export function HomeQuickTools() {
  const [activeTab, setActiveTab] = useState<"qr" | "word" | "password" | "bg">("qr");

  // QR State
  const [qrText, setQrText] = useState("https://devdrop.online");
  const [qrDataUrl, setQrDataUrl] = useState("");
  useEffect(() => {
    if (!qrText.trim()) return;
    QRCode.toDataURL(qrText, {
      width: 240,
      margin: 2,
      color: { dark: "#00ff9d", light: "#0a0a0c" },
    }).then(setQrDataUrl).catch(() => {});
  }, [qrText]);

  // Word Counter State
  const [wordText, setWordText] = useState("DevDrop provides 140+ free developer and everyday utilities. Fast, client-side, and private.");
  const words = wordText.trim() ? wordText.trim().split(/\s+/).length : 0;
  const chars = wordText.length;
  const readingTime = Math.ceil(words / 200);

  // Password Generator State
  const [pwdLength, setPwdLength] = useState(16);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const generatePwd = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=";
    let res = "";
    for (let i = 0; i < pwdLength; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(res);
  };

  useEffect(() => {
    generatePwd();
  }, [pwdLength]);

  const copyPwd = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full rounded-2xl bg-gradient-to-b from-neutral-900/90 to-neutral-950 border border-neutral-800 p-6 sm:p-8 shadow-2xl">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Interactive Sandbox
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white">
            Try Everyday Utilities Instantly
          </h3>
          <p className="text-xs sm:text-sm text-neutral-400">
            Test our client-side engines live on this page without navigating away.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-1.5 bg-neutral-950 p-1.5 rounded-xl border border-neutral-800">
          {[
            { id: "qr", label: "Quick QR Maker", icon: QrCode },
            { id: "word", label: "Live Word Counter", icon: Type },
            { id: "password", label: "Password Generator", icon: Key },
            { id: "bg", label: "Photo BG Remover", icon: Scissors },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  active
                    ? "bg-emerald-500 text-neutral-950 shadow-md shadow-emerald-500/20"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-900"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Panels */}
      <div className="pt-6">
        {/* 1. QR Code */}
        {activeTab === "qr" && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-8 space-y-4">
              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1.5">
                  Type or Paste URL / Text
                </label>
                <input
                  type="text"
                  value={qrText}
                  onChange={(e) => setQrText(e.target.value)}
                  placeholder="https://yourwebsite.com"
                  className="w-full bg-neutral-950 border border-neutral-700 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm text-neutral-100 outline-none"
                />
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href="/tools/qr-code-generator"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:underline"
                >
                  Open Full QR Studio (Wi-Fi, Colors, SVG) <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="md:col-span-4 flex flex-col items-center justify-center p-4 bg-neutral-950 rounded-xl border border-neutral-800">
              {qrDataUrl && (
                <img
                  src={qrDataUrl}
                  alt="Live QR Code"
                  className="w-36 h-36 object-contain rounded-lg border border-neutral-800"
                />
              )}
              <span className="text-[11px] text-neutral-500 mt-2">Scan with any smartphone</span>
            </div>
          </div>
        )}

        {/* 2. Word Counter */}
        {activeTab === "word" && (
          <div className="space-y-4">
            <textarea
              rows={3}
              value={wordText}
              onChange={(e) => setWordText(e.target.value)}
              placeholder="Paste any article or text snippet to count words in real-time..."
              className="w-full bg-neutral-950 border border-neutral-700 focus:border-emerald-500 rounded-xl p-3 text-sm text-neutral-100 outline-none"
            />
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 text-center">
                <span className="text-xs text-neutral-400">Words</span>
                <p className="text-xl font-bold text-emerald-400">{words}</p>
              </div>
              <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 text-center">
                <span className="text-xs text-neutral-400">Characters</span>
                <p className="text-xl font-bold text-white">{chars}</p>
              </div>
              <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 text-center">
                <span className="text-xs text-neutral-400">Read Time</span>
                <p className="text-xl font-bold text-cyan-400">~{readingTime} min</p>
              </div>
            </div>
            <div className="pt-2">
              <Link
                href="/tools/word-counter"
                className="text-xs font-bold text-emerald-400 hover:underline inline-flex items-center gap-1"
              >
                Open Full Text Analyzer <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* 3. Password Generator */}
        {activeTab === "password" && (
          <div className="space-y-4">
            <div className="bg-neutral-950 border border-neutral-700 p-4 rounded-xl flex items-center justify-between gap-4">
              <span className="text-base sm:text-lg font-mono text-emerald-400 select-all font-bold truncate">
                {password}
              </span>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={generatePwd}
                  className="p-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg"
                  title="Generate New Password"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  onClick={copyPwd}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold rounded-lg text-xs flex items-center gap-1.5"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex justify-between text-xs text-neutral-400 mb-1">
                  <span>Length</span>
                  <span className="text-emerald-400 font-bold">{pwdLength} chars</span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="32"
                  value={pwdLength}
                  onChange={(e) => setPwdLength(Number(e.target.value))}
                  className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>
              <Link
                href="/tools/password-generator"
                className="text-xs font-bold text-emerald-400 hover:underline inline-flex items-center gap-1 whitespace-nowrap"
              >
                Advanced Generator <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* 4. Photo BG Remover */}
        {activeTab === "bg" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono">
                Powered by Remove.bg AI & rembg
              </div>
              <h4 className="text-lg font-bold text-white">
                Instant Automatic Background Removal
              </h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Remove backgrounds from portraits, product photos, and graphics with crystal clarity. Replace backdrops with pure white for eCommerce or download transparent PNG cutouts.
              </p>
              <Link
                href="/tools/photo-bg-remover"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-500/20 hover:opacity-95 transition"
              >
                <Scissors className="w-4 h-4" /> Launch Photo BG Remover Tool
              </Link>
            </div>

            <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 flex items-center justify-center text-center">
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mx-auto">
                  <FileImage className="w-6 h-6" />
                </div>
                <p className="text-xs font-semibold text-neutral-300">
                  Ready to process your photos
                </p>
                <p className="text-[11px] text-neutral-500">
                  Click Launch to upload PNG, JPG, or WebP files
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
