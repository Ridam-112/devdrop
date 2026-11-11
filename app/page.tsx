import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import {
  Terminal,
  Search,
  Sparkles,
  Shield,
  Cpu,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { TOOLS, CATEGORIES } from "@/lib/data/tools";
import { ToolCard } from "@/components/ToolCard";
import { AdvertisementSlot } from "@/components/AdvertisementSlot";
import { LiveSearchBar } from "@/components/LiveSearchBar";

export const metadata: Metadata = {
  title: "DEVDROP — Enter the Digital Underground | Cyber Simulator Platform",
  description:
    "Explore 80+ interactive cybersecurity tools, orbital satellite tracking radars, virtual smartphone diagnostics, and terminal command environments.",
  alternates: {
    canonical: "https://devdrop.vercel.app",
  },
  openGraph: {
    title: "DEVDROP — Enter the Digital Underground",
    description:
      "Explore 80+ interactive cybersecurity tools, orbital satellite tracking radars, and terminal command environments.",
    url: "https://devdrop.vercel.app",
    type: "website",
  },
};

export default function HomePage() {
  const popularTools = TOOLS.filter((t) => t.isPopular);
  const featuredTools = TOOLS.slice(0, 4);

  return (
    <div className="flex flex-col gap-12 sm:gap-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 border-b border-cyber-borderSubtle">
        {/* Cyberpunk backdrop ambient lighting */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-cyber-green/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] bg-cyber-cyan/10 blur-[110px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10">
          {/* Underground Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyber-panel/80 border border-cyber-border text-xs font-mono text-cyber-green mb-6 shadow-neon-green/20 animate-in fade-in zoom-in duration-300">
            <span className="w-2 h-2 rounded-full bg-cyber-green animate-ping" />
            <span>CYBER TELEMETRY & SECURITY LAB v4.2</span>
          </div>

          {/* Hero Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-6 font-mono">
            Enter the <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-green via-cyber-cyan to-white">Digital Underground</span>.
          </h1>

          {/* Supporting Subtext */}
          <p className="text-base sm:text-lg text-slate-300/90 max-w-2xl mx-auto mb-8 leading-relaxed">
            Explore interactive cybersecurity tools, orbital satellite tracking radars, virtual device security challenges, and terminal command environments.
          </p>

          {/* Prominent Live Search Engine */}
          <LiveSearchBar className="max-w-xl mx-auto mb-8 text-left" />

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-cyber-green text-black font-bold font-mono text-sm tracking-wider shadow-neon-green hover:bg-cyber-green/90 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>EXPLORE ALL TOOLS</span>
            </Link>

            <Link
              href="/tools/hacker-terminal"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-cyber-panel border border-cyber-borderSubtle text-slate-200 font-mono text-sm hover:text-white hover:border-cyber-cyan/50 hover:bg-cyber-card transition-all"
            >
              <Terminal className="w-4 h-4 text-cyber-cyan" />
              <span>LAUNCH TERMINAL CLI</span>
            </Link>
          </div>
        </div>
      </section>

      {/* TOP ADVERTISEMENT SLOT */}
      <div className="max-w-5xl mx-auto px-4 w-full">
        <AdvertisementSlot slotId="home-top-banner" format="horizontal" />
      </div>

      {/* 2. CATEGORIES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyber-green">
              Security Catalogue
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Browse by Category
            </h2>
          </div>
          <Link
            href="/tools"
            className="text-xs font-mono font-semibold text-cyber-cyan hover:underline flex items-center gap-1"
          >
            View all categories <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="group p-5 rounded-2xl bg-cyber-card/70 border border-cyber-borderSubtle hover:border-cyber-green/40 hover:bg-cyber-card transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-cyber-panel border border-cyber-borderSubtle flex items-center justify-center text-cyber-green group-hover:text-cyber-cyan transition-colors mb-3">
                  <Cpu className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-cyber-green transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <span className="text-[11px] font-mono font-semibold text-cyber-cyan mt-4 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Explore tools <ArrowRight className="w-3 h-3" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. FEATURED TOOLS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyber-cyan">
              Hand-picked
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Featured Security Tools
            </h2>
          </div>
          <Link
            href="/tools"
            className="text-xs font-mono font-semibold text-cyber-green hover:underline flex items-center gap-1"
          >
            See full directory <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredTools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} featured={true} />
          ))}
        </div>
      </section>

      {/* 4. POPULAR SIMULATORS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="mb-8">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyber-purple">
            High Engagement
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Trending Cyber Experiences
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            The most utilized interactive tools across our network.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {popularTools.slice(0, 6).map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>

      {/* MID-PAGE ADVERTISEMENT */}
      <div className="max-w-5xl mx-auto px-4 w-full">
        <AdvertisementSlot slotId="home-middle-banner" format="banner" />
      </div>

      {/* 5. HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="rounded-2xl bg-cyber-card/80 border border-cyber-borderSubtle p-8 sm:p-12">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyber-green">
              Architecture & Transparency
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              How DEVDROP Tools Work
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2">
              Every tool executes in your web browser. No external servers are breached, no data is stored, and personal privacy is strictly maintained.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl bg-cyber-dark/60 border border-cyber-borderSubtle">
              <div className="w-10 h-10 rounded-lg bg-cyber-panel flex items-center justify-center text-cyber-green mb-4">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white mb-2 font-mono">
                1. Safe Client-Side Execution
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Inputs like telephone numbers, handles, or test strings are processed locally in browser memory. Nothing is transmitted or saved.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-cyber-dark/60 border border-cyber-borderSubtle">
              <div className="w-10 h-10 rounded-lg bg-cyber-panel flex items-center justify-center text-cyber-cyan mb-4">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white mb-2 font-mono">
                2. Real-Time Telemetry & Graphics
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                High-performance animations, radar sweeps, and terminal interfaces recreate cinematic cybersecurity concepts accurately.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-cyber-dark/60 border border-cyber-borderSubtle">
              <div className="w-10 h-10 rounded-lg bg-cyber-panel flex items-center justify-center text-cyber-purple mb-4">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white mb-2 font-mono">
                3. Clear Compliance
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                All legal disclaimers and privacy notices are detailed on our dedicated Disclaimer page to ensure clear transparency.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
