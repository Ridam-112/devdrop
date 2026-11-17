"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  Settings,
  Sparkles,
  Gamepad2,
  Wrench,
  Shield,
  Target,
  FolderOpen,
  BookOpen,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Star,
  Trophy,
  Flame,
  Zap,
} from "lucide-react";

interface ConsoleDashboardProps {
  onSearchChange?: (query: string) => void;
}

export const ConsoleDashboard: React.FC<ConsoleDashboardProps> = () => {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [searchVal, setSearchVal] = useState<string>("");

  return (
    <div className="relative w-full rounded-[32px] bg-gradient-to-b from-[#0d1024] via-[#090c1a] to-[#060813] border border-[#21274f] shadow-2xl overflow-hidden p-4 sm:p-6 lg:p-8 space-y-7 text-white font-sans">
      {/* Ambient background glows matching Nixtendo cosmic theme */}
      <div className="pointer-events-none absolute -top-40 left-1/4 w-[500px] h-[350px] bg-indigo-600/15 blur-[120px] rounded-full" />
      <div className="pointer-events-none absolute top-1/3 -right-20 w-[450px] h-[350px] bg-purple-600/15 blur-[120px] rounded-full" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 w-[500px] h-[300px] bg-cyan-600/10 blur-[100px] rounded-full" />

      {/* ========================================================= */}
      {/* TOP CONSOLE APP BAR: Search, User Profile, Settings       */}
      {/* ========================================================= */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4 border-b border-[#1c2347] pb-5">
        {/* Brand / Title indicator */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 p-0.5 shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-[#0a0d1e] rounded-[10px] flex items-center justify-center">
                <span className="font-mono font-black text-cyan-400 text-sm">D</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-black tracking-wider text-white text-base">
                  DEVDROP<span className="text-cyan-400">.ONLINE</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase font-bold">
                  v2.4
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans -mt-0.5">
                Gaming &amp; Web Utilities Console
              </p>
            </div>
          </div>
        </div>

        {/* Console Search Input (like the Nixtendo top bar) */}
        <div className="relative w-full md:max-w-md">
          <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder="Search 140+ tools &amp; 56 games..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#141833]/90 border border-[#2a3262] text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all shadow-inner"
          />
          {searchVal && (
            <Link
              href={`/tools?q=${encodeURIComponent(searchVal)}`}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-xl bg-cyan-500 text-black text-[11px] font-mono font-bold hover:bg-cyan-400 transition-colors"
            >
              Search
            </Link>
          )}
        </div>

        {/* User Profile Pill & Settings (Alex Ryan / DevDrop Member) */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-[#151936] border border-[#283161] shadow-md">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-purple-500 p-0.5">
              <div className="w-full h-full bg-[#0b0e1e] rounded-full flex items-center justify-center text-xs">
                👾
              </div>
            </div>
            <div className="text-left font-sans">
              <div className="text-xs font-bold text-white leading-tight">Alex Ryan</div>
              <div className="text-[10px] text-slate-400 leading-tight">@devdrop.gg</div>
            </div>
            <span className="text-[10px] font-mono font-bold text-amber-400 ml-1">★ PRO</span>
          </div>

          <Link
            href="/about"
            className="p-2 rounded-xl bg-[#151936] border border-[#283161] text-slate-300 hover:text-white hover:bg-[#1d234a] transition-colors"
            title="Console Settings & About"
          >
            <Settings className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 1. POPULAR GAMES & FEATURED HUBS (4 TALL NIXTENDO CARDS)   */}
      {/* ========================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
              Popular Hubs &amp; Games
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400 hidden sm:inline">
            Direct In-Browser Access &bull; 0ms Install
          </span>
        </div>

        {/* 4 Featured Tall Console Cards (Ditto to Nixtendo UI) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* ------------------------------------------------------- */}
          {/* CARD 1: Web Tools & Utilities (Mario 3D Theme)          */}
          {/* ------------------------------------------------------- */}
          <div className="group relative rounded-[28px] bg-gradient-to-b from-[#281533]/90 via-[#181024]/90 to-[#0e0917]/95 border-2 border-[#ff3b69]/40 hover:border-[#ff3b69] p-5 flex flex-col justify-between shadow-xl shadow-red-950/20 hover:shadow-red-500/20 transition-all duration-300 hover:-translate-y-1">
            {/* Ambient card top glow */}
            <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-28 bg-[#ff3b69]/20 blur-2xl rounded-full" />

            <div className="space-y-3 relative z-10 text-center">
              {/* Badge */}
              <div className="flex justify-center">
                <span className="text-[11px] font-sans font-semibold text-pink-200 bg-white/10 backdrop-blur-md px-3 py-0.5 rounded-full border border-white/10">
                  New Released
                </span>
              </div>

              {/* 3D Floating Mario Character */}
              <div className="relative h-36 flex items-center justify-center my-1">
                <div className="absolute inset-0 bg-gradient-to-b from-[#ff3b69]/20 to-transparent rounded-full blur-xl" />
                <img
                  src="/console-ui/mario.png"
                  alt="Super Smash Bros & Web Tools"
                  className="max-h-36 w-auto object-contain drop-shadow-[0_15px_20px_rgba(255,59,105,0.35)] group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Star Rating */}
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[11px] font-bold text-amber-300">
                <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                <span>4.9</span>
              </div>

              {/* Title & Subtitle */}
              <div>
                <div className="text-base sm:text-lg font-black text-white font-mono tracking-tight group-hover:text-pink-300 transition-colors">
                  Web Tools &amp; Utilities
                </div>
                <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                  Portfolio Builder, AI BG Remover, PDF &amp; Compressor
                </p>
              </div>

              {/* Direct Quick-Tool Tags */}
              <div className="flex flex-wrap justify-center gap-1 pt-1">
                <Link
                  href="/tools/portfolio-builder"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#100d1c] text-emerald-300 border border-emerald-500/30 hover:border-emerald-400 transition-colors"
                >
                  Portfolio ↗
                </Link>
                <Link
                  href="/tools/photo-bg-remover"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#100d1c] text-pink-300 border border-pink-500/30 hover:border-pink-400 transition-colors"
                >
                  BG Remover ↗
                </Link>
                <Link
                  href="/tools/image-compressor"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#100d1c] text-cyan-300 border border-cyan-500/30 hover:border-cyan-400 transition-colors"
                >
                  Compress ↗
                </Link>
              </div>
            </div>

            {/* Glowing Rounded Pill Action Button */}
            <div className="pt-4 relative z-10">
              <Link
                href="/tools"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-full bg-gradient-to-r from-[#FF3B30] via-[#FF5E3A] to-[#FF9500] text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-red-500/30 hover:shadow-red-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span>EXPLORE ALL TOOLS</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* ------------------------------------------------------- */}
          {/* CARD 2: HTML5 & 3D Games Hub (Turtle Koopa Theme)       */}
          {/* ------------------------------------------------------- */}
          <div className="group relative rounded-[28px] bg-gradient-to-b from-[#132c20]/90 via-[#0e1d15]/90 to-[#07120c]/95 border-2 border-[#34c759]/40 hover:border-[#34c759] p-5 flex flex-col justify-between shadow-xl shadow-green-950/20 hover:shadow-green-500/20 transition-all duration-300 hover:-translate-y-1">
            <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-28 bg-[#34c759]/20 blur-2xl rounded-full" />

            <div className="space-y-3 relative z-10 text-center">
              <div className="flex justify-center">
                <span className="text-[11px] font-sans font-semibold text-emerald-200 bg-white/10 backdrop-blur-md px-3 py-0.5 rounded-full border border-white/10">
                  New Released
                </span>
              </div>

              {/* 3D Floating Turtle Character */}
              <div className="relative h-36 flex items-center justify-center my-1">
                <div className="absolute inset-0 bg-gradient-to-b from-[#34c759]/20 to-transparent rounded-full blur-xl" />
                <img
                  src="/console-ui/turtle.png"
                  alt="HTML5 3D Games"
                  className="max-h-36 w-auto object-contain drop-shadow-[0_15px_20px_rgba(52,199,89,0.35)] group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[11px] font-bold text-amber-300">
                <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                <span>4.9</span>
              </div>

              <div>
                <div className="text-base sm:text-lg font-black text-white font-mono tracking-tight group-hover:text-emerald-300 transition-colors">
                  HTML5 &amp; 3D Games
                </div>
                <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                  Fighter Jet Dogfight, Fruit Slice, Minesweeper &amp; 56+ Games
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-1 pt-1">
                <Link
                  href="/games/fighter-jet-dogfight-3d"
                  className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#09150f] text-emerald-300 border border-emerald-500/30 hover:border-emerald-400 transition-colors"
                >
                  Fighter Jet 3D
                </Link>
                <Link
                  href="/games/fruit-slice-master"
                  className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#09150f] text-teal-300 border border-teal-500/30 hover:border-teal-400 transition-colors"
                >
                  Fruit Slice
                </Link>
                <Link
                  href="/games/parking-jam-puzzle"
                  className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#09150f] text-cyan-300 border border-cyan-500/30 hover:border-cyan-400 transition-colors"
                >
                  Parking Jam
                </Link>
              </div>
            </div>

            <div className="pt-4 relative z-10">
              <Link
                href="/games"
                className="w-full py-3 px-4 rounded-full bg-gradient-to-r from-[#34C759] via-[#30B0C7] to-[#007AFF] text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-green-500/30 hover:shadow-green-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span>PLAY BROWSER GAMES</span>
                <Gamepad2 className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* ------------------------------------------------------- */}
          {/* CARD 3: Cyber & Network Tools (Sonic 3D Theme)          */}
          {/* ------------------------------------------------------- */}
          <div className="group relative rounded-[28px] bg-gradient-to-b from-[#102244]/90 via-[#0c162e]/90 to-[#060b18]/95 border-2 border-[#007aff]/40 hover:border-[#007aff] p-5 flex flex-col justify-between shadow-xl shadow-blue-950/20 hover:shadow-blue-500/20 transition-all duration-300 hover:-translate-y-1">
            <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-28 bg-[#007aff]/20 blur-2xl rounded-full" />

            <div className="space-y-3 relative z-10 text-center">
              <div className="flex justify-center">
                <span className="text-[11px] font-sans font-semibold text-sky-200 bg-white/10 backdrop-blur-md px-3 py-0.5 rounded-full border border-white/10">
                  New Released
                </span>
              </div>

              {/* 3D Floating Sonic Character */}
              <div className="relative h-36 flex items-center justify-center my-1">
                <div className="absolute inset-0 bg-gradient-to-b from-[#007aff]/20 to-transparent rounded-full blur-xl" />
                <img
                  src="/console-ui/sonic.png"
                  alt="Cyber & Security Tools"
                  className="max-h-36 w-auto object-contain drop-shadow-[0_15px_20px_rgba(0,122,255,0.35)] group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[11px] font-bold text-amber-300">
                <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                <span>4.8</span>
              </div>

              <div>
                <div className="text-base sm:text-lg font-black text-white font-mono tracking-tight group-hover:text-cyan-300 transition-colors">
                  Cyber &amp; Network Tools
                </div>
                <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                  Wi-Fi Radar, WPA Handshake &amp; IP Telemetry
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-1 pt-1">
                <Link
                  href="/category/wifi-network"
                  className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#09101f] text-cyan-300 border border-cyan-500/30 hover:border-cyan-400 transition-colors"
                >
                  Wi-Fi Radar
                </Link>
                <Link
                  href="/tools/handshake-capture-sim"
                  className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#09101f] text-sky-300 border border-sky-500/30 hover:border-sky-400 transition-colors"
                >
                  Handshake
                </Link>
                <Link
                  href="/tools/ip-geolocation-lookup"
                  className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#09101f] text-blue-300 border border-blue-500/30 hover:border-blue-400 transition-colors"
                >
                  IP Trace
                </Link>
              </div>
            </div>

            <div className="pt-4 relative z-10">
              <Link
                href="/category/wifi-network"
                className="w-full py-3 px-4 rounded-full bg-gradient-to-r from-[#007AFF] via-[#3880FF] to-[#5856D6] text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span>LAUNCH CYBER LAB</span>
                <Shield className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* ------------------------------------------------------- */}
          {/* CARD 4: Game Tools & Esports Hub (Bowser 3D Theme)      */}
          {/* ------------------------------------------------------- */}
          <div className="group relative rounded-[28px] bg-gradient-to-b from-[#331c10]/90 via-[#211108]/90 to-[#120904]/95 border-2 border-[#ff9500]/40 hover:border-[#ff9500] p-5 flex flex-col justify-between shadow-xl shadow-orange-950/20 hover:shadow-orange-500/20 transition-all duration-300 hover:-translate-y-1">
            <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-28 bg-[#ff9500]/20 blur-2xl rounded-full" />

            <div className="space-y-3 relative z-10 text-center">
              <div className="flex justify-center">
                <span className="text-[11px] font-sans font-semibold text-amber-200 bg-white/10 backdrop-blur-md px-3 py-0.5 rounded-full border border-white/10">
                  New Released
                </span>
              </div>

              {/* 3D Floating Bowser Character */}
              <div className="relative h-36 flex items-center justify-center my-1">
                <div className="absolute inset-0 bg-gradient-to-b from-[#ff9500]/20 to-transparent rounded-full blur-xl" />
                <img
                  src="/console-ui/bowser.png"
                  alt="Esports & Game Telemetry"
                  className="max-h-36 w-auto object-contain drop-shadow-[0_15px_20px_rgba(255,149,0,0.35)] group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[11px] font-bold text-amber-300">
                <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                <span>4.8</span>
              </div>

              <div>
                <div className="text-base sm:text-lg font-black text-white font-mono tracking-tight group-hover:text-amber-300 transition-colors">
                  Game Tools &amp; Esports
                </div>
                <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                  Free Fire &amp; BGMI Weapon Armory &amp; Rank ELO
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-1 pt-1">
                <Link
                  href="/tools/free-fire-rank-calculator"
                  className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#160d05] text-amber-300 border border-amber-500/30 hover:border-amber-400 transition-colors"
                >
                  Rank Calc
                </Link>
                <Link
                  href="/tools/weapon-damage-calculator"
                  className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#160d05] text-orange-300 border border-orange-500/30 hover:border-orange-400 transition-colors"
                >
                  Armory
                </Link>
                <Link
                  href="/tools/free-fire-airdrop-simulator"
                  className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#160d05] text-yellow-300 border border-yellow-500/30 hover:border-yellow-400 transition-colors"
                >
                  Air-Drop
                </Link>
              </div>
            </div>

            <div className="pt-4 relative z-10">
              <Link
                href="/category/gaming-sims"
                className="w-full py-3 px-4 rounded-full bg-gradient-to-r from-[#FF9500] via-[#FF5E3A] to-[#FF3B30] text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span>OPEN GAME TOOLS</span>
                <Target className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. BOTTOM SECTION: QUEST REWARDS, CONSOLE PROMO, LEADERBOARD */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-2">
        {/* ------------------------------------------------------- */}
        {/* COLUMN 1: QUEST REWARDS / TOP REAL UTILITIES (5 cols)   */}
        {/* ------------------------------------------------------- */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white font-mono tracking-tight flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Quest Rewards &bull; Top Real Utilities
            </h3>
            <span className="text-[11px] font-mono text-cyan-400">100% Free</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Quest 1: Portfolio Website Builder */}
            <Link
              href="/tools/portfolio-builder"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-3.5 rounded-2xl bg-gradient-to-br from-[#1a1c36] to-[#0f1124] border border-[#2b315b] hover:border-cyan-400 transition-all flex items-center justify-between shadow-md hover:-translate-y-0.5"
            >
              <div className="space-y-1">
                <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                  Portfolio Builder
                </div>
                <div className="text-[10px] text-amber-300 font-mono font-bold flex items-center gap-1">
                  <span>🟡</span> 100% Free
                </div>
                <div className="flex items-center gap-1 pt-1">
                  <div className="flex -space-x-1.5 overflow-hidden">
                    <span className="inline-block h-4 w-4 rounded-full ring-1 ring-slate-800 bg-indigo-500 text-[8px] text-center leading-4">🧑‍💻</span>
                    <span className="inline-block h-4 w-4 rounded-full ring-1 ring-slate-800 bg-pink-500 text-[8px] text-center leading-4">👩‍🎨</span>
                    <span className="inline-block h-4 w-4 rounded-full ring-1 ring-slate-800 bg-emerald-500 text-[8px] text-center leading-4">👨‍💼</span>
                  </div>
                  <span className="text-[9px] text-slate-400 font-mono">50k+ built</span>
                </div>
              </div>
              <div className="w-11 h-11 flex-shrink-0 flex items-center justify-center">
                <img src="/console-ui/boo.png" alt="Portfolio" className="max-h-10 w-auto object-contain drop-shadow-md group-hover:scale-110 transition-transform" />
              </div>
            </Link>

            {/* Quest 2: AI Background Remover */}
            <Link
              href="/tools/photo-bg-remover"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-3.5 rounded-2xl bg-gradient-to-br from-[#1a1c36] to-[#0f1124] border border-[#2b315b] hover:border-pink-400 transition-all flex items-center justify-between shadow-md hover:-translate-y-0.5"
            >
              <div className="space-y-1">
                <div className="text-xs font-bold text-white group-hover:text-pink-300 transition-colors">
                  AI BG Remover
                </div>
                <div className="text-[10px] text-amber-300 font-mono font-bold flex items-center gap-1">
                  <span>🟡</span> Instant Cutout
                </div>
                <div className="flex items-center gap-1 pt-1">
                  <div className="flex -space-x-1.5 overflow-hidden">
                    <span className="inline-block h-4 w-4 rounded-full ring-1 ring-slate-800 bg-purple-500 text-[8px] text-center leading-4">📸</span>
                    <span className="inline-block h-4 w-4 rounded-full ring-1 ring-slate-800 bg-amber-500 text-[8px] text-center leading-4">🖼️</span>
                    <span className="inline-block h-4 w-4 rounded-full ring-1 ring-slate-800 bg-cyan-500 text-[8px] text-center leading-4">🎨</span>
                  </div>
                  <span className="text-[9px] text-slate-400 font-mono">40k+ cuts</span>
                </div>
              </div>
              <div className="w-11 h-11 flex-shrink-0 flex items-center justify-center">
                <img src="/console-ui/heart.png" alt="BG Remover" className="max-h-10 w-auto object-contain drop-shadow-md group-hover:scale-110 transition-transform" />
              </div>
            </Link>

            {/* Quest 3: Smart Image Compressor */}
            <Link
              href="/tools/image-compressor"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-3.5 rounded-2xl bg-gradient-to-br from-[#1a1c36] to-[#0f1124] border border-[#2b315b] hover:border-emerald-400 transition-all flex items-center justify-between shadow-md hover:-translate-y-0.5"
            >
              <div className="space-y-1">
                <div className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                  Image Compress
                </div>
                <div className="text-[10px] text-amber-300 font-mono font-bold flex items-center gap-1">
                  <span>🟡</span> Up to 90%
                </div>
                <div className="flex items-center gap-1 pt-1">
                  <div className="flex -space-x-1.5 overflow-hidden">
                    <span className="inline-block h-4 w-4 rounded-full ring-1 ring-slate-800 bg-emerald-500 text-[8px] text-center leading-4">⚡</span>
                    <span className="inline-block h-4 w-4 rounded-full ring-1 ring-slate-800 bg-blue-500 text-[8px] text-center leading-4">🚀</span>
                    <span className="inline-block h-4 w-4 rounded-full ring-1 ring-slate-800 bg-teal-500 text-[8px] text-center leading-4">📦</span>
                  </div>
                  <span className="text-[9px] text-slate-400 font-mono">80k+ done</span>
                </div>
              </div>
              <div className="w-11 h-11 flex-shrink-0 flex items-center justify-center">
                <img src="/console-ui/goomba.png" alt="Compressor" className="max-h-10 w-auto object-contain drop-shadow-md group-hover:scale-110 transition-transform" />
              </div>
            </Link>

            {/* Quest 4: Universal PDF Maker */}
            <Link
              href="/tools/pdf-maker"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-3.5 rounded-2xl bg-gradient-to-br from-[#1a1c36] to-[#0f1124] border border-[#2b315b] hover:border-amber-400 transition-all flex items-center justify-between shadow-md hover:-translate-y-0.5"
            >
              <div className="space-y-1">
                <div className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                  Universal PDF Maker
                </div>
                <div className="text-[10px] text-amber-300 font-mono font-bold flex items-center gap-1">
                  <span>🟡</span> Zero Upload
                </div>
                <div className="flex items-center gap-1 pt-1">
                  <div className="flex -space-x-1.5 overflow-hidden">
                    <span className="inline-block h-4 w-4 rounded-full ring-1 ring-slate-800 bg-amber-500 text-[8px] text-center leading-4">📄</span>
                    <span className="inline-block h-4 w-4 rounded-full ring-1 ring-slate-800 bg-red-500 text-[8px] text-center leading-4">📑</span>
                    <span className="inline-block h-4 w-4 rounded-full ring-1 ring-slate-800 bg-orange-500 text-[8px] text-center leading-4">📚</span>
                  </div>
                  <span className="text-[9px] text-slate-400 font-mono">35k+ made</span>
                </div>
              </div>
              <div className="w-11 h-11 flex-shrink-0 flex items-center justify-center">
                <img src="/console-ui/star.png" alt="PDF Maker" className="max-h-10 w-auto object-contain drop-shadow-md group-hover:scale-110 transition-transform" />
              </div>
            </Link>
          </div>
        </div>

        {/* ------------------------------------------------------- */}
        {/* COLUMN 2: HARDWARE CONSOLE / INSTANT GAMES SHOWCASE (4) */}
        {/* ------------------------------------------------------- */}
        <div className="lg:col-span-4 rounded-[28px] bg-gradient-to-b from-[#112a28]/90 via-[#0d1f1d]/90 to-[#071312]/95 border border-[#1f4a47] p-5 flex flex-col justify-between items-center text-center shadow-xl">
          <div className="w-full space-y-2">
            <div className="relative h-28 flex items-center justify-center my-1">
              <div className="absolute inset-0 bg-[#00f2fe]/10 blur-xl rounded-full" />
              <img
                src="/console-ui/switch.png"
                alt="DevDrop Browser Console"
                className="max-h-24 w-auto object-contain drop-shadow-[0_10px_15px_rgba(0,242,254,0.25)]"
              />
            </div>
            <div className="text-base font-bold text-white font-mono">
              Join and Earn Rewards
            </div>
            <p className="text-xs text-emerald-200/80 leading-relaxed max-w-xs mx-auto">
              Play 56+ Free Browser Games &bull; 60 FPS Canvas &bull; Fullscreen Controls
            </p>
          </div>

          <div className="w-full pt-4">
            <Link
              href="/games"
              className="w-full py-3 px-5 rounded-full bg-gradient-to-r from-[#FF3B30] to-[#FF9500] text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-red-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span>PLAY GAMES FULLSCREEN</span>
              <Gamepad2 className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* ------------------------------------------------------- */}
        {/* COLUMN 3: LEADERBOARD & HALL OF FAME (3 cols)           */}
        {/* ------------------------------------------------------- */}
        <div className="lg:col-span-3 rounded-[28px] bg-[#11142b]/90 border border-[#242b58] p-5 flex flex-col justify-between shadow-xl space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-[#212750] pb-2 mb-3">
              <h3 className="text-sm font-bold text-white font-mono flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-400" />
                Leaderboard
              </h3>
              <span className="text-[10px] font-mono text-slate-400">Top Weekly</span>
            </div>

            {/* Podium (1st, 2nd, 3rd) */}
            <div className="grid grid-cols-3 gap-2 text-center pt-1 pb-3 border-b border-[#212750]">
              {/* 2nd place: Robert */}
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-slate-600 border border-slate-400 p-0.5 flex items-center justify-center text-xs">
                  👳
                </div>
                <div className="text-[10px] font-bold text-white mt-1 truncate max-w-[60px]">Robert</div>
                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-slate-500/20 text-slate-300 font-mono font-bold mt-0.5">2nd</span>
                <span className="text-[9px] text-slate-400 font-mono">1200 Pts</span>
              </div>

              {/* 1st place: Alex Ryan (elevated) */}
              <div className="flex flex-col items-center -mt-2">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 border-2 border-amber-300 p-0.5 shadow-md shadow-amber-500/30 flex items-center justify-center text-sm">
                  🧔
                </div>
                <div className="text-[10px] font-bold text-amber-300 mt-1 truncate max-w-[65px]">Alex Ryan</div>
                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold mt-0.5">1st 👑</span>
                <span className="text-[9px] text-amber-400 font-mono font-bold">1500 Pts</span>
              </div>

              {/* 3rd place: Danial */}
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-amber-800 border border-amber-600 p-0.5 flex items-center justify-center text-xs">
                  🧑
                </div>
                <div className="text-[10px] font-bold text-white mt-1 truncate max-w-[60px]">Danial</div>
                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-700/20 text-amber-400 font-mono font-bold mt-0.5">3rd</span>
                <span className="text-[9px] text-slate-400 font-mono">1100 Pts</span>
              </div>
            </div>

            {/* Ranking List */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-[11px] font-sans">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-indigo-500/20 text-indigo-300 text-[9px] flex items-center justify-center">4</span>
                  <span className="text-slate-300">Esther Howard</span>
                </div>
                <span className="text-slate-400 font-mono text-[10px]">1050 Pts</span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-sans">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-indigo-500/20 text-indigo-300 text-[9px] flex items-center justify-center">5</span>
                  <span className="text-slate-300">Jacob Jones</span>
                </div>
                <span className="text-slate-400 font-mono text-[10px]">980 Pts</span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-sans">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-indigo-500/20 text-indigo-300 text-[9px] flex items-center justify-center">6</span>
                  <span className="text-slate-300">Cody Fisher</span>
                </div>
                <span className="text-slate-400 font-mono text-[10px]">920 Pts</span>
              </div>
            </div>
          </div>

          {/* Controller status indicator at bottom of sidebar/dashboard */}
          <div className="p-2.5 rounded-2xl bg-[#0b0e20] border border-[#1e2448] flex items-center gap-3">
            <div className="relative w-8 h-8 flex-shrink-0 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin duration-1000" />
              <Zap className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-left font-mono">
              <div className="text-[10px] text-emerald-400 font-bold">100% READY &bull; 0ms</div>
              <div className="text-[9px] text-slate-400">Client-Side Engine Active</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
