import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import {
  Sparkles,
  Shield,
  ShieldCheck,
  Cpu,
  ArrowRight,
  CheckCircle2,
  Lock,
  Zap,
  Image as ImageIcon,
  FileText,
  Sliders,
  QrCode,
  Barcode,
  Layers,
  Gamepad2,
  Flame,
  HelpCircle,
  Trophy,
  Play,
  Star
} from "lucide-react";
import { TOOLS, CATEGORIES } from "@/lib/data/tools";
import { ToolCard } from "@/components/ToolCard";
import { AdvertisementSlot } from "@/components/AdvertisementSlot";
import { LiveSearchBar } from "@/components/LiveSearchBar";
import { HomeQuickTools } from "@/components/HomeQuickTools";

export const metadata: Metadata = {
  title: "DevDrop — Free Online Web Tools, Utilities & 70+ Games",
  description:
    "DevDrop provides free online utilities: image compressors, photo background remover, QR code generator, PDF makers, and 70+ browser games.",
  alternates: {
    canonical: "https://devdrop.online",
  },
  openGraph: {
    title: "DevDrop — Free Online Web Tools, Utilities & 70+ Games",
    description:
      "Free client-side tools for file conversion, image compression, QR codes, PDFs, developer utilities, and 70+ open-source HTML5 games.",
    url: "https://devdrop.online",
    siteName: "DevDrop",
    type: "website",
    images: [
      {
        url: "https://devdrop.online/logo.png",
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
    images: ["https://devdrop.online/logo.png"],
  },
};

export default function HomePage() {
  // Curated spotlight of real everyday utilities
  const coreUtilitySlugs = [
    "photo-bg-remover",
    "image-compressor",
    "qr-code-generator",
    "barcode-generator",
    "pdf-maker",
    "photo-to-pdf",
    "json-formatter",
    "word-counter",
    "password-generator",
    "loan-emi-calculator",
    "age-calculator",
    "base64-converter",
  ];

  const featuredUtilities = TOOLS.filter((t) => coreUtilitySlugs.includes(t.slug));
  const additionalUtilities = TOOLS.filter(
    (t) =>
      (t.categorySlug === "developer-utils" ||
        t.categorySlug === "image-media" ||
        t.categorySlug === "pdf-document") &&
      !coreUtilitySlugs.includes(t.slug)
  ).slice(0, 8);

  const indexableCategories = CATEGORIES.filter((c) => c.indexable !== false);

  return (
    <div className="flex flex-col gap-12 sm:gap-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-14 md:pt-16 md:pb-20 border-b border-neutral-800">
        {/* Ambient lighting */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-purple-500/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[300px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10">
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-900/90 border border-neutral-700/80 text-xs font-mono text-emerald-400 mb-6 shadow-lg shadow-emerald-500/10">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold">FREE ONLINE UTILITIES &bull; ZERO SIGNUP &bull; PRIVACY-FIRST</span>
          </div>

          {/* Hero Headline with Brand Logo */}
          <div className="flex flex-col items-center justify-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-purple-500/40 shadow-2xl shadow-purple-500/30 p-1 bg-neutral-950">
              <img src="/logo.png" alt="DevDrop Brand" width={80} height={80} className="w-full h-full object-cover rounded-xl" />
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white font-mono max-w-4xl">
              Everyday Tools &amp; Utilities,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-emerald-400">
                100% In Your Browser
              </span>
              .
            </h1>
          </div>

          {/* Subtitle */}
          <p className="text-sm sm:text-base md:text-lg text-neutral-300 max-w-2xl mx-auto mb-8 leading-relaxed">
            Compress images, remove photo backgrounds, generate custom QR codes &amp; barcodes, compile PDFs, format JSON, calculate loans, and play 70+ open-source 3D and HTML5 browser games.
          </p>

          {/* Prominent Live Search Engine */}
          <LiveSearchBar className="max-w-xl mx-auto mb-6 text-left" />

          {/* Trust Highlights Row */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-neutral-400 mb-8 font-mono">
            <span className="flex items-center gap-1.5 text-neutral-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Client-Side Privacy
            </span>
            <span className="flex items-center gap-1.5 text-neutral-300">
              <Zap className="w-4 h-4 text-cyan-400" /> Instant Processing
            </span>
            <span className="flex items-center gap-1.5 text-neutral-300">
              <Lock className="w-4 h-4 text-purple-400" /> No Account Required
            </span>
          </div>

          {/* Quick Action Navigation */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold font-mono text-xs sm:text-sm tracking-wider shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02]"
            >
              <Sparkles className="w-4 h-4" />
              <span>EXPLORE ALL TOOLS</span>
            </Link>

            <Link
              href="/games"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-neutral-900 border border-neutral-700 hover:border-purple-500/50 text-neutral-200 hover:text-white font-mono text-xs sm:text-sm transition-all"
            >
              <Gamepad2 className="w-4 h-4 text-purple-400" />
              <span>PLAY BROWSER GAMES</span>
            </Link>
          </div>
        </div>
      </section>

      {/* TOP ADVERTISEMENT SLOT */}
      <div className="max-w-5xl mx-auto px-4 w-full">
        <AdvertisementSlot slotId="home-top-banner" format="horizontal" />
      </div>

      {/* 2. INTERACTIVE QUICK-TOOLS COMPONENT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <HomeQuickTools />
      </section>

      {/* 3. FEATURED REAL EVERYDAY UTILITIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1 text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 mb-1">
              <Sparkles className="w-3.5 h-3.5" /> High-Utility Suite
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Featured Everyday & Developer Tools
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1">
              Real high-performance tools ready for work, design, study, and daily productivity.
            </p>
          </div>
          <Link
            href="/tools"
            className="text-xs font-mono font-bold text-emerald-400 hover:underline flex items-center gap-1"
          >
            Browse all 140+ tools <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredUtilities.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} featured={true} />
          ))}
        </div>
      </section>

      {/* 4. SECURITY & TRUST GUARANTEES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="rounded-2xl bg-gradient-to-br from-neutral-900/90 via-neutral-900 to-neutral-950 border border-neutral-800 p-8 sm:p-12">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
              Verified Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Why Professionals & Students Trust DevDrop
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-2">
              Every conversion, encryption, and document operation executes locally in your browser memory sandbox.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-5 rounded-xl bg-neutral-950/80 border border-neutral-800">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white mb-2">
                1. 100% In-Browser Privacy
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Your photos, passwords, text notes, and receipts are never uploaded to remote cloud databases. Everything runs on your machine.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-neutral-950/80 border border-neutral-800">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white mb-2">
                2. Instant Zero-Latency Speed
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                No file upload queues or sluggish remote server processing. Conversions and calculations happen in milliseconds.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-neutral-950/80 border border-neutral-800">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white mb-2">
                3. Zero Paywalls or Sign-Ups
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                No credit cards, subscriptions, or accounts required. All 140+ tools are unconditionally free for personal and commercial use.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-neutral-950/80 border border-neutral-800">
              <div className="w-10 h-10 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 mb-4">
                <Gamepad2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white mb-2">
                4. 70+ Open-Source Games
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Enjoy 70+ open-source 3D flight simulators, clay arcade classics, sports games, and retro puzzles with zero installs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED GAME SPOTLIGHT: CHAOS SKIES 3D */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-neutral-950 via-purple-950/30 to-neutral-900 border-2 border-amber-500/40 p-6 sm:p-10 lg:p-12 shadow-2xl shadow-amber-500/10">
          {/* Ambient decorative glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
            <div className="flex-1 space-y-5 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold tracking-wide">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>FEATURED 3D BROWSER COMBAT SIMULATOR</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-mono tracking-tight">
                ✈ CHAOS SKIES 3D
              </h2>

              <p className="text-sm sm:text-base text-neutral-300 font-sans leading-relaxed max-w-2xl">
                A browser-based 3D fighter jet combat simulator built with Three.js. Pilot legendary jets — including the <strong>Sukhoi Su-30MKI</strong> and <strong>HAL Tejas Mk1</strong> — across Neon City, Desert Canyons, and Pacific Isles with high-performance 60 FPS physics directly in your browser with zero installs.
              </p>

              {/* Highlights tags */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1">
                <span className="px-3 py-1 rounded-lg bg-neutral-900 border border-neutral-700 text-xs font-mono text-emerald-400">
                  ✓ Su-30MKI &amp; Tejas Mk1
                </span>
                <span className="px-3 py-1 rounded-lg bg-neutral-900 border border-neutral-700 text-xs font-mono text-cyan-400">
                  ✓ Homing Missiles &amp; Flares
                </span>
                <span className="px-3 py-1 rounded-lg bg-neutral-900 border border-neutral-700 text-xs font-mono text-purple-400">
                  ✓ Mobile Joystick + PC Mouse
                </span>
                <span className="px-3 py-1 rounded-lg bg-neutral-900 border border-neutral-700 text-xs font-mono text-amber-400">
                  ✓ 60 FPS WebGL
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-3">
                <Link
                  href="/games/chaos-skies-3d"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-black font-mono font-black text-sm uppercase tracking-wider hover:opacity-95 transition-all flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 hover:scale-105"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>PLAY CHAOS SKIES 3D NOW</span>
                </Link>

                <Link
                  href="/games"
                  className="w-full sm:w-auto px-6 py-4 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-700 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                >
                  <Gamepad2 className="w-4 h-4 text-purple-400" />
                  <span>Browse All 70+ Games</span>
                </Link>
              </div>
            </div>

            {/* Visual Preview / Badge Card */}
            <div className="w-full lg:w-96 flex-shrink-0">
              <Link
                href="/games/chaos-skies-3d"
                className="group block relative rounded-2xl overflow-hidden border-2 border-amber-500/30 hover:border-amber-400 transition-all bg-neutral-950 p-6 text-center space-y-4 shadow-xl"
              >
                <div className="w-20 h-20 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto text-4xl shadow-lg shadow-amber-500/10 group-hover:scale-110 transition-transform">
                  ✈️
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest block">
                    Three.js WebGL Engine
                  </span>
                  <h3 className="text-xl font-black text-white font-mono mt-1">
                    Chaos Skies 3D
                  </h3>
                  <p className="text-xs text-neutral-400 font-sans mt-1">
                    Play instantly in Full 3D with 60 FPS flight dynamics
                  </p>
                </div>
                <div className="w-full py-2.5 rounded-lg bg-amber-400 text-black font-mono font-bold text-xs flex items-center justify-center gap-2 group-hover:bg-amber-300 transition-colors">
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>LAUNCH GAME</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CATEGORIES CATALOGUE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-400">
              Core Categories
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Browse Tool Categories
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
          {indexableCategories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="group p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 hover:border-emerald-500/40 hover:bg-neutral-900 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-center text-emerald-400 group-hover:text-cyan-400 transition-colors mb-3">
                  <Sliders className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed line-clamp-2">
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

      {/* MID-PAGE ADVERTISEMENT */}
      <div className="max-w-5xl mx-auto px-4 w-full">
        <AdvertisementSlot slotId="home-middle-banner" format="banner" />
      </div>

      {/* 6. ADDITIONAL PRODUCTIVITY & DEVELOPER UTILITIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="mb-8">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
            More Utilities
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Productivity &amp; Developer Utilities
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Formatting, encoding, generation, and calculation tools running entirely in your browser.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {additionalUtilities.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>

      {/* 7. WHAT IS DEVDROP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="rounded-2xl bg-neutral-900/90 border border-neutral-800 p-8 sm:p-10 space-y-6">
          <div className="flex items-center gap-2 text-purple-400 text-xs font-mono font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" /> About DevDrop
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            What is DevDrop?
          </h2>
          <p className="text-sm text-neutral-300 leading-relaxed max-w-4xl">
            DevDrop (<strong>devdrop.online</strong>) is a free web suite designed to provide fast, privacy-focused online utilities and browser games. We believe essential tools like image compressors, PDF converters, and code formatters should be readily accessible without mandatory account registration, paywalls, or privacy intrusions.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="bg-neutral-950 border border-neutral-800 p-5 rounded-xl space-y-2">
              <span className="text-emerald-400 font-bold text-sm font-mono block">Everyday Web Utilities</span>
              <p className="text-xs text-neutral-400 leading-relaxed">
                From image compression and PDF makers to JSON formatters, JWT decoders, Pomodoro timers, and password generators — client-side utilities execute in your browser with zero data retention.
              </p>
            </div>
            <div className="bg-neutral-950 border border-neutral-800 p-5 rounded-xl space-y-2">
              <span className="text-cyan-400 font-bold text-sm font-mono block">QR Codes &amp; Barcodes</span>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Generate standard static QR codes and ISO barcodes for URLs, Wi-Fi networks, text, and vCards with instant client-side rendering.
              </p>
            </div>
            <div className="bg-neutral-950 border border-neutral-800 p-5 rounded-xl space-y-2">
              <span className="text-purple-400 font-bold text-sm font-mono block">70+ Open-Source Games</span>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Enjoy open-source HTML5 and WebGL games including Chaos Skies 3D, Desi Bus Driver, Cricket 2D, and classic puzzles directly in your browser.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FREQUENTLY ASKED QUESTIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="rounded-2xl bg-neutral-900/90 border border-neutral-800 p-8 sm:p-10 space-y-6">
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
              <p className="text-xs text-neutral-400 leading-relaxed">
                DevDrop (https://devdrop.online) is a free online platform offering client-side developer tools, everyday utilities, image optimization engines, QR generators, and open-source HTML5 browser games. Everything is accessible instantly without accounts, subscriptions, or downloads.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-bold text-white">
                Are my files or images uploaded to any server?
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Most tools on DevDrop (including image compression, QR generation, PDF compilation, JSON formatting, and hashing) run 100% locally in your browser memory without uploading files anywhere. For the Photo Background Remover, images are sent over encrypted HTTPS to the Remove.bg API for cutout processing and are never retained.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-bold text-white">
                Is DevDrop completely free for commercial and personal projects?
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Yes. Every utility, generator, and code formatter on DevDrop is completely free to use with no registration, subscriptions, or hidden charges.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-bold text-white">
                How does the Photo Background Remover work?
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                The Photo Background Remover uses the Remove.bg API to detect subjects and produce clean transparent PNGs. When an API key is not configured, it can run a local color-clustering fallback in your browser.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-bold text-white">
                Do generated QR codes or barcodes expire?
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Never. DevDrop generates static standard QR codes and ISO barcodes containing direct data that remain scannable indefinitely without relying on redirect URLs.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-bold text-white">
                Are the browser games free to play?
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Yes, all 70+ games are open-source HTML5 and WebGL titles that run directly in your browser with zero installation and support both mobile and desktop controls.
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
                    "text": "DevDrop (https://devdrop.online) is a free online platform offering client-side developer tools, everyday utilities, image optimization engines, QR generators, and open-source HTML5 browser games with zero sign-up."
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
