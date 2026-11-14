import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import {
  Sparkles,
  ShieldCheck,
  Cpu,
  ArrowRight,
  CheckCircle2,
  Lock,
  Zap,
  Sliders,
  QrCode,
  Layers,
  Gamepad2,
  HelpCircle,
  Trophy,
  Play,
  Star,
  Wrench,
  Shield,
  BookOpen,
  FolderTree,
  Crosshair,
  ExternalLink,
  ChevronRight,
  Terminal,
  FileText,
  Flame,
  Globe
} from "lucide-react";
import { TOOLS, CATEGORIES, INDEXABLE_TOOLS_LABEL, ToolItem } from "@/lib/data/tools";
import { OPEN_SOURCE_GAMES } from "@/lib/data/games";
import { GUIDES } from "@/lib/data/guides";
import { SITE_URL } from "@/lib/constants";
import { ToolCard } from "@/components/ToolCard";
import { AdvertisementSlot } from "@/components/AdvertisementSlot";
import { LiveSearchBar } from "@/components/LiveSearchBar";

export const metadata: Metadata = {
  title: "DevDrop — Free Online Web Tools, Utilities & Browser Games",
  description:
    "DevDrop provides free online utilities: portfolio website builder, image compressors, photo background remover, QR code generator, PDF makers, and 56+ free browser games.",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "DevDrop — Free Online Web Tools, Utilities & Browser Games",
    description:
      "Free client-side tools for portfolio creation, file conversion, image compression, QR codes, PDFs, developer utilities, and free HTML5 games.",
    url: SITE_URL,
    siteName: "DevDrop",
    type: "website",
    images: [
      {
        url: `${SITE_URL}/logo.png`,
        width: 1024,
        height: 1024,
        alt: "DevDrop Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DevDrop — Free Online Web Tools & Utilities",
    description:
      "Free everyday web utilities, developer tools, and browser games running fast with zero sign-up required.",
    images: [`${SITE_URL}/logo.png`],
  },
};

export default function HomePage() {
  // Top selected tools (Handpicked essentials with Portfolio Builder at the very top)
  const topSelectedToolSlugs = [
    "portfolio-builder",
    "photo-bg-remover",
    "image-compressor",
    "qr-code-generator",
    "pdf-maker",
    "barcode-generator"
  ];
  const topSelectedTools = TOOLS.filter((t) => topSelectedToolSlugs.includes(t.slug));

  // Top selected games (60 FPS, user favorites)
  const topSelectedGameSlugs = [
    "chaos-skies-3d",
    "fruit-slice-master",
    "minesweeper-logic-puzzle",
    "parking-jam-puzzle",
    "water-sort-puzzle",
    "pinball-classic-arcade"
  ];
  const topSelectedGames = OPEN_SOURCE_GAMES.filter((g) => topSelectedGameSlugs.includes(g.slug));

  // Core Categories
  const allCategories = CATEGORIES;

  return (
    <div className="flex flex-col gap-12 sm:gap-16 w-full">
      {/* ========================================================= */}
      {/* 1. HERO & "WHAT IS DEVDROP.ONLINE" INTRO SECTION           */}
      {/* ========================================================= */}
      <section className="relative overflow-hidden pt-8 pb-12 md:pt-12 md:pb-16 rounded-3xl bg-gradient-to-b from-[#131936] via-[#0d1226] to-[#080b18] border border-[#232c54] shadow-2xl p-6 sm:p-10">
        {/* Subtle Ambient Cosmic Glows */}
        <div className="hidden sm:block absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[280px] bg-indigo-500/15 blur-[90px] rounded-full pointer-events-none" />
        <div className="hidden sm:block absolute top-1/2 right-10 w-[350px] h-[250px] bg-cyan-500/10 blur-[80px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          {/* Top Status Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1b2347] border border-[#344279] text-xs font-mono text-cyan-300 shadow-md">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-bold tracking-wider uppercase">ALL-IN-ONE WEB HUB &bull; ZERO SIGN-UP &bull; 100% IN-BROWSER</span>
          </div>

          {/* Brand Header */}
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-cyan-400/50 shadow-xl shadow-cyan-500/20 p-1 bg-[#090d1f]">
              <img src="/logo.png" alt="DevDrop Brand" width={80} height={80} className="w-full h-full object-cover rounded-xl" />
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white font-mono">
              DevDrop<span className="text-cyan-400">.online</span>
            </h1>

            <p className="text-sm sm:text-base font-mono font-medium text-purple-300 tracking-wide uppercase">
              Web Tools &bull; 56+ Browser Games &bull; Cyber Security Lab &bull; Tech Guides
            </p>
          </div>

          {/* "What is DevDrop.online" Description Card */}
          <div className="max-w-3xl mx-auto p-5 sm:p-6 rounded-2xl bg-[#141b38]/80 border border-[#2b376b] text-slate-200 text-sm sm:text-base leading-relaxed text-left shadow-lg backdrop-blur-md">
            <div className="flex items-center gap-2 text-cyan-400 font-mono font-bold text-xs uppercase mb-2">
              <Sparkles className="w-4 h-4" />
              <span>What is DevDrop.online?</span>
            </div>
            <p className="text-slate-300 font-sans leading-relaxed">
              <strong>DevDrop (devdrop.online)</strong> is a free, all-in-one web suite engineered for students, developers, and tech enthusiasts. It provides high-performance everyday utilities, an interactive portfolio builder, 56+ original 3D and 2D browser games, cyber security diagnostic labs, and comprehensive how-to guides. Everything runs <strong>100% inside your browser memory</strong> with zero installations, zero tracking, and no account sign-up required.
            </p>
          </div>

          {/* Prominent Live Search Engine */}
          <div className="pt-2">
            <LiveSearchBar className="max-w-2xl mx-auto text-left" />
          </div>

          {/* Quick Telemetry Counters (Like reference image dashboard stats) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 max-w-4xl mx-auto">
            <div className="p-3.5 rounded-xl bg-[#111730]/90 border border-[#25305c] text-center font-mono">
              <div className="text-xl sm:text-2xl font-black text-emerald-400">140+</div>
              <div className="text-[11px] text-slate-400 uppercase mt-0.5">Web Tools &amp; Sims</div>
            </div>
            <div className="p-3.5 rounded-xl bg-[#111730]/90 border border-[#25305c] text-center font-mono">
              <div className="text-xl sm:text-2xl font-black text-cyan-400">56</div>
              <div className="text-[11px] text-slate-400 uppercase mt-0.5">Browser Games</div>
            </div>
            <div className="p-3.5 rounded-xl bg-[#111730]/90 border border-[#25305c] text-center font-mono">
              <div className="text-xl sm:text-2xl font-black text-purple-400">100%</div>
              <div className="text-[11px] text-slate-400 uppercase mt-0.5">Client-Side Privacy</div>
            </div>
            <div className="p-3.5 rounded-xl bg-[#111730]/90 border border-[#25305c] text-center font-mono">
              <div className="text-xl sm:text-2xl font-black text-amber-400">0 MB</div>
              <div className="text-[11px] text-slate-400 uppercase mt-0.5">No Downloads</div>
            </div>
          </div>
        </div>
      </section>

      {/* TOP ADVERTISEMENT SLOT */}
      <div className="max-w-5xl mx-auto px-4 w-full">
        <AdvertisementSlot slotId="home-top-banner" format="horizontal" />
      </div>

      {/* ========================================================= */}
      {/* 2. MAIN CARDS VIEW: TOOLS, GAMES, CYBER, GAME TOOLS,      */}
      {/*    CATEGORIES, BLOGS & GUIDES                             */}
      {/* ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#242c52] pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
              <Layers className="w-4 h-4" /> Explore DevDrop Ecosystem
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-mono mt-1">
              Platform Dashboard &amp; Hubs
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">Select any hub to launch instantly</span>
        </div>

        {/* 6 High-Impact Cards Grid (Inspired by the Reference Image) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Tools (Everyday & Developer Tools) */}
          <div className="group rounded-3xl bg-gradient-to-b from-[#182142] via-[#121833] to-[#0c1024] border-2 border-[#2b376b] hover:border-emerald-400/60 p-6 shadow-xl transition-all duration-300 flex flex-col justify-between hover:shadow-emerald-500/10 hover:-translate-y-1">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase">
                  Top Utilities
                </span>
                <span className="text-xs font-mono text-amber-300 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-current" /> 4.9 (High-Utility)
                </span>
              </div>

              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-400/40 flex items-center justify-center text-emerald-400 text-3xl shadow-lg">
                🛠️
              </div>

              <div>
                <h3 className="text-xl font-black font-mono text-white group-hover:text-emerald-300 transition-colors">
                  Web Tools &amp; Utilities
                </h3>
                <p className="text-xs text-slate-300 font-sans mt-2 leading-relaxed">
                  Portfolio Website Builder, Image Compressor, Background Remover, PDF Maker, QR Code &amp; Barcode Generators, and JSON Formatters.
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0b0e1b] text-slate-300 border border-[#232c54]">
                  Portfolio Builder
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0b0e1b] text-slate-300 border border-[#232c54]">
                  Image Compress
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0b0e1b] text-slate-300 border border-[#232c54]">
                  PDF Tools
                </span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#232c54]">
              <Link
                href="/tools"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 group-hover:opacity-95 transition-all"
              >
                <span>EXPLORE ALL TOOLS</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 2: Games (56+ Browser Games) */}
          <div className="group rounded-3xl bg-gradient-to-b from-[#24173d] via-[#18112d] to-[#0e0a1f] border-2 border-[#43296d] hover:border-purple-400/60 p-6 shadow-xl transition-all duration-300 flex flex-col justify-between hover:shadow-purple-500/10 hover:-translate-y-1">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 uppercase">
                  60 FPS In-Browser
                </span>
                <span className="text-xs font-mono text-amber-300 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-current" /> 4.9 (56 Games)
                </span>
              </div>

              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/10 border border-purple-400/40 flex items-center justify-center text-purple-300 text-3xl shadow-lg">
                🎮
              </div>

              <div>
                <h3 className="text-xl font-black font-mono text-white group-hover:text-purple-300 transition-colors">
                  HTML5 &amp; 3D Games Hub
                </h3>
                <p className="text-xs text-slate-300 font-sans mt-2 leading-relaxed">
                  Chaos Skies 3D, Fruit Slice Master, Minesweeper, Parking Jam Puzzle, Water Sort, Pinball Classic, Tower Defense &amp; sports arcade.
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0b0e1b] text-slate-300 border border-[#232c54]">
                  Chaos Skies 3D
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0b0e1b] text-slate-300 border border-[#232c54]">
                  Minesweeper
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0b0e1b] text-slate-300 border border-[#232c54]">
                  Parking Jam
                </span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#232c54]">
              <Link
                href="/games"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 group-hover:opacity-95 transition-all"
              >
                <span>PLAY BROWSER GAMES</span>
                <Play className="w-3.5 h-3.5 fill-current" />
              </Link>
            </div>
          </div>

          {/* Card 3: Cyber Tools (Wi-Fi & Network Security) */}
          <div className="group rounded-3xl bg-gradient-to-b from-[#14233c] via-[#0f1a2e] to-[#09101d] border-2 border-[#223a63] hover:border-cyan-400/60 p-6 shadow-xl transition-all duration-300 flex flex-col justify-between hover:shadow-cyan-500/10 hover:-translate-y-1">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 uppercase">
                  Security Lab
                </span>
                <span className="text-xs font-mono text-amber-300 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-current" /> 4.8 (Diagnostics)
                </span>
              </div>

              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/10 border border-cyan-400/40 flex items-center justify-center text-cyan-400 text-3xl shadow-lg">
                🛡️
              </div>

              <div>
                <h3 className="text-xl font-black font-mono text-white group-hover:text-cyan-300 transition-colors">
                  Cyber &amp; Network Tools
                </h3>
                <p className="text-xs text-slate-300 font-sans mt-2 leading-relaxed">
                  Interactive Wi-Fi beacon sniffers, WPA handshake crackers, signal radars, router gateways, IP telemetry, and penetration simulators.
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0b0e1b] text-slate-300 border border-[#232c54]">
                  Wi-Fi Radar
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0b0e1b] text-slate-300 border border-[#232c54]">
                  WPA Handshake
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0b0e1b] text-slate-300 border border-[#232c54]">
                  IP Trace
                </span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#232c54]">
              <Link
                href="/category/wifi-network"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 group-hover:opacity-95 transition-all"
              >
                <span>LAUNCH CYBER TOOLS</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 4: Game Tools (Free Fire & BGMI Gaming Sims) */}
          <div className="group rounded-3xl bg-gradient-to-b from-[#331d16] via-[#21130e] to-[#140b08] border-2 border-[#5c3022] hover:border-amber-400/60 p-6 shadow-xl transition-all duration-300 flex flex-col justify-between hover:shadow-amber-500/10 hover:-translate-y-1">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase">
                  Esports Telemetry
                </span>
                <span className="text-xs font-mono text-amber-300 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-current" /> 4.8 (Gaming Hub)
                </span>
              </div>

              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-400/40 flex items-center justify-center text-amber-400 text-3xl shadow-lg">
                🎯
              </div>

              <div>
                <h3 className="text-xl font-black font-mono text-white group-hover:text-amber-300 transition-colors">
                  Game Data &amp; Esports Tools
                </h3>
                <p className="text-xs text-slate-300 font-sans mt-2 leading-relaxed">
                  Esports tournament predictors, Free Fire &amp; BGMI weapon armory viewers, rank ELO calculators, and live air-drop telemetry simulations.
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0b0e1b] text-slate-300 border border-[#232c54]">
                  Rank Calculator
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0b0e1b] text-slate-300 border border-[#232c54]">
                  Weapon Armory
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0b0e1b] text-slate-300 border border-[#232c54]">
                  Air-Drop Sim
                </span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#232c54]">
              <Link
                href="/category/gaming-sims"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 group-hover:opacity-95 transition-all"
              >
                <span>OPEN GAME TOOLS</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 5: Categories Hub */}
          <div className="group rounded-3xl bg-gradient-to-b from-[#1f1938] via-[#151126] to-[#0c0a17] border-2 border-[#382b63] hover:border-indigo-400/60 p-6 shadow-xl transition-all duration-300 flex flex-col justify-between hover:shadow-indigo-500/10 hover:-translate-y-1">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 uppercase">
                  12 Categories
                </span>
                <span className="text-xs font-mono text-amber-300 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-current" /> 5.0 (Organized)
                </span>
              </div>

              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/10 border border-indigo-400/40 flex items-center justify-center text-indigo-300 text-3xl shadow-lg">
                📂
              </div>

              <div>
                <h3 className="text-xl font-black font-mono text-white group-hover:text-indigo-300 transition-colors">
                  Explore All Categories
                </h3>
                <p className="text-xs text-slate-300 font-sans mt-2 leading-relaxed">
                  Browse by category: Developer &amp; Web Utilities, Image Processing, PDF &amp; Documents, Cyber Labs, AI Cognitive, Finance, and Stealth.
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0b0e1b] text-slate-300 border border-[#232c54]">
                  Image Media
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0b0e1b] text-slate-300 border border-[#232c54]">
                  PDF Docs
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0b0e1b] text-slate-300 border border-[#232c54]">
                  Web Dev
                </span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#232c54]">
              <Link
                href="#categories-hub"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 group-hover:opacity-95 transition-all"
              >
                <span>BROWSE CATEGORIES</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 6: Blogs, Guides & Tutorials */}
          <div className="group rounded-3xl bg-gradient-to-b from-[#132626] via-[#0d1c1c] to-[#071010] border-2 border-[#1f4242] hover:border-teal-400/60 p-6 shadow-xl transition-all duration-300 flex flex-col justify-between hover:shadow-teal-500/10 hover:-translate-y-1">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40 uppercase">
                  Tech Knowledge
                </span>
                <span className="text-xs font-mono text-amber-300 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-current" /> 4.9 (Articles)
                </span>
              </div>

              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500/20 to-emerald-500/10 border border-teal-400/40 flex items-center justify-center text-teal-300 text-3xl shadow-lg">
                📝
              </div>

              <div>
                <h3 className="text-xl font-black font-mono text-white group-hover:text-teal-300 transition-colors">
                  Blogs &amp; Technical Guides
                </h3>
                <p className="text-xs text-slate-300 font-sans mt-2 leading-relaxed">
                  In-depth tutorials: compress photos to 100KB, convert JPG to PDF without upload, generate permanent QR codes, and math breakdowns.
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0b0e1b] text-slate-300 border border-[#232c54]">
                  Image to 100KB
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0b0e1b] text-slate-300 border border-[#232c54]">
                  JPG to PDF
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0b0e1b] text-slate-300 border border-[#232c54]">
                  Custom QR
                </span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#232c54]">
              <Link
                href="/guides"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-500 text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 group-hover:opacity-95 transition-all"
              >
                <span>READ BLOGS &amp; GUIDES</span>
                <BookOpen className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. "NICHE TOP SELECTED KORA JINISH": TOP SELECTED TOOLS    */}
      {/* ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#242c52] pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
              <Trophy className="w-4 h-4" /> Top Selected Utilities
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-mono mt-1">
              Top Selected Tools &amp; Web Generators
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              The highest-rated, client-side tools ready for work, portfolio creation, and daily productivity.
            </p>
          </div>
          <Link
            href="/tools"
            className="text-xs font-mono font-bold text-emerald-400 hover:underline flex items-center gap-1"
          >
            View all {INDEXABLE_TOOLS_LABEL} <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Selected Tools Grid with Portfolio Builder at #1 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {topSelectedTools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} featured={true} />
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. "NICHE TOP SELECTED KORA JINISH": TOP SELECTED GAMES    */}
      {/* ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#242c52] pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-purple-400">
              <Gamepad2 className="w-4 h-4" /> Top Selected Games
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-mono mt-1">
              Top Selected HTML5 &amp; 3D Games
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Handpicked 60 FPS browser games with zero downloads, instant controls, and saved high scores.
            </p>
          </div>
          <Link
            href="/games"
            className="text-xs font-mono font-bold text-purple-400 hover:underline flex items-center gap-1"
          >
            View all 56 games <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Selected Games Showcase Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {topSelectedGames.map((game) => (
            <div
              key={game.slug}
              className="group rounded-3xl bg-gradient-to-b from-[#181a33] via-[#121324] to-[#0a0c17] border border-[#262c54] hover:border-purple-400/60 p-5 shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 uppercase">
                    {game.genre}
                  </span>
                  <span className="text-xs font-mono text-amber-300 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-current" /> {game.rating || 4.9}
                  </span>
                </div>

                <Link href={`/games/${game.slug}`}>
                  <h3 className="text-lg font-bold font-mono text-white group-hover:text-purple-300 transition-colors line-clamp-1">
                    {game.name}
                  </h3>
                </Link>

                <p className="text-xs text-cyan-300 font-mono mt-0.5 line-clamp-1">
                  {game.tagline}
                </p>

                <p className="text-xs text-slate-300 font-sans mt-2.5 line-clamp-2 leading-relaxed">
                  {game.description}
                </p>

                <div className="flex flex-wrap gap-1.5 my-3.5">
                  {game.techStack.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#080a14] text-slate-300 border border-[#202747]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-[#202747] flex items-center gap-2 mt-2">
                <Link
                  href={`/games/${game.slug}`}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-purple-500/20 group-hover:opacity-95 transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>PLAY NOW</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MID-PAGE ADVERTISEMENT */}
      <div className="max-w-5xl mx-auto px-4 w-full">
        <AdvertisementSlot slotId="home-middle-banner" format="banner" />
      </div>

      {/* ========================================================= */}
      {/* 5. ALL CATEGORIES HUB                                     */}
      {/* ========================================================= */}
      <section id="categories-hub" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-6">
        <div className="flex items-end justify-between border-b border-[#242c52] pb-4">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
              Browse Directories
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-mono mt-1">
              All Tool Categories
            </h2>
          </div>
          <Link
            href="/tools"
            className="text-xs font-mono font-semibold text-cyan-400 hover:underline flex items-center gap-1"
          >
            All tools <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {allCategories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="group p-5 rounded-2xl bg-[#111730]/80 border border-[#222e59] hover:border-cyan-400/50 hover:bg-[#151d3d] transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#090d1f] border border-[#222e59] flex items-center justify-center text-cyan-400 group-hover:text-emerald-400 transition-colors mb-3">
                  <Sliders className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed line-clamp-2">
                  {cat.description}
                </p>
              </div>

              <span className="text-[11px] font-mono font-semibold text-cyan-400 mt-4 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Open category <ArrowRight className="w-3 h-3" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 6. TRUST & PRIVACY GUARANTEE                              */}
      {/* ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="rounded-3xl bg-gradient-to-br from-[#121833] via-[#0e1226] to-[#080b18] border border-[#232c54] p-8 sm:p-12 shadow-xl">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
              Verified Client-Side Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Why Users Worldwide Rely On DevDrop
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2">
              Every portfolio build, file conversion, and computation executes inside your local browser memory sandbox.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-[#0a0e1f] border border-[#1f284d]">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white mb-2">
                1. In-Browser Privacy
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Most tools run entirely in your browser. The Photo Background Remover is the exception: it sends the image to the Remove.bg API over encrypted HTTPS without data retention.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0a0e1f] border border-[#1f284d]">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white mb-2">
                2. Instant Zero-Latency
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                No server queues or waiting for remote cloud jobs. Code builds, calculations, and PDF compiles happen in milliseconds.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0a0e1f] border border-[#1f284d]">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white mb-2">
                3. Zero Sign-Ups or Paywalls
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                No credit cards, accounts, or mandatory emails. All utilities are unconditionally free for personal and commercial projects.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0a0e1f] border border-[#1f284d]">
              <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 mb-4">
                <Gamepad2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white mb-2">
                4. 56+ Browser Games
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Enjoy 3D flight simulators, parking logic puzzles, minesweeper, and pinball with responsive mobile touch and keyboard controls.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 7. FREQUENTLY ASKED QUESTIONS & STRUCTURED DATA          */}
      {/* ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="rounded-3xl bg-[#11162e] border border-[#242c52] p-8 sm:p-10 space-y-6">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider">
            <HelpCircle className="w-4 h-4" /> Transparency &amp; Answers
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Frequently Asked Questions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-white">
                What is DevDrop (devdrop.online)?
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                DevDrop (https://devdrop.online) is a free online platform offering client-side developer tools, everyday utilities, image optimization engines, QR generators, and 56+ free browser games. Everything is accessible instantly without accounts, subscriptions, or downloads.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-bold text-white">
                Are my files or images uploaded to any server?
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Most tools on DevDrop (including portfolio creation, image compression, QR generation, PDF compilation, JSON formatting, and hashing) run 100% locally in your browser memory without uploading files anywhere. For the Photo Background Remover, images are sent over encrypted HTTPS to the Remove.bg API for cutout processing and are never retained.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-bold text-white">
                Is DevDrop completely free for commercial and personal projects?
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Yes. Every utility, generator, and code formatter on DevDrop is completely free to use with no registration, subscriptions, or hidden charges.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-bold text-white">
                How does the Portfolio Website Builder work?
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                The Portfolio Builder guides you through 5 quick steps to fill your bio, work milestones, featured projects, and skills. It lets you preview the site live in an interactive emulator and download a standalone, production-ready index.html file that you can host anywhere for free.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-bold text-white">
                Do generated QR codes or barcodes expire?
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Never. DevDrop generates static standard QR codes and ISO barcodes containing direct data that remain scannable indefinitely without relying on redirect URLs.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-bold text-white">
                Are the browser games free to play?
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Yes, all 56 games are free HTML5 and WebGL titles that run directly in your browser with zero installation and support both mobile and desktop controls.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Schema for Google Search Rich Snippets */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "What is DevDrop (devdrop.online)?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "DevDrop (https://devdrop.online) is a free online platform offering client-side developer tools, everyday utilities, image optimization engines, QR generators, and 56+ free HTML5 browser games with zero sign-up."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Are files or images uploaded to any server on DevDrop?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Most tools on DevDrop run 100% locally in your browser memory without uploading files anywhere. For the Photo Background Remover, images are sent over encrypted HTTPS to the Remove.bg API for cutout processing and are never retained."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Is DevDrop completely free?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, every tool on DevDrop is completely free with no registration, subscriptions, or paywalls."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How does the Portfolio Website Builder work?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "The Portfolio Builder guides you through 5 quick steps to fill your bio, work milestones, featured projects, and skills. It lets you preview the site live in an interactive emulator and download a standalone, production-ready index.html file."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Do generated QR codes or barcodes expire?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Never. DevDrop generates static standard QR codes and ISO barcodes containing direct data that remain scannable indefinitely."
                  }
                }
              ]
            })
          }}
        />
      </section>
    </div>
  );
}
