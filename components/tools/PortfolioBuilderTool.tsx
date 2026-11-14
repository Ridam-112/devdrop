"use client";

import React, { useState, useRef } from "react";
import {
  Sparkles,
  Download,
  Copy,
  Maximize2,
  ExternalLink,
  Code2,
  Check,
  ShieldCheck,
  Smartphone,
  Globe,
  Layers,
  ArrowRight
} from "lucide-react";

export default function PortfolioBuilderTool() {
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleOpenNewTab = () => {
    window.open("/tools/portfolio-builder.html", "_blank");
  };

  const handleToggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Banner Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-cyber-card/90 border border-cyber-borderSubtle backdrop-blur-md shadow-card-cyber">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyber-green/10 border border-cyber-green/30 flex items-center justify-center text-cyber-green">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold font-mono text-white flex items-center gap-2">
              <span>Interactive Portfolio Website Builder</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyber-green/20 text-cyber-green border border-cyber-green/40">
                100% In-Browser
              </span>
            </h2>
            <p className="text-xs text-cyber-muted font-sans mt-0.5">
              Fill details, preview animations, and download a ready-to-deploy, self-contained <code className="text-cyber-cyan">index.html</code> file.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleToggleFullscreen}
            className="px-3 py-2 rounded-xl bg-cyber-dark hover:bg-cyber-card text-xs font-mono text-slate-200 border border-cyber-borderSubtle hover:border-cyber-green transition-all flex items-center gap-1.5"
            title="Toggle Full View"
          >
            <Maximize2 className="w-3.5 h-3.5 text-cyber-cyan" />
            <span className="hidden sm:inline">{isFullscreen ? "Exit Fullscreen" : "Fullscreen View"}</span>
          </button>

          <button
            onClick={handleOpenNewTab}
            className="px-3 py-2 rounded-xl bg-cyber-green/10 hover:bg-cyber-green text-xs font-mono font-bold text-cyber-green hover:text-black border border-cyber-green/40 hover:border-cyber-green transition-all flex items-center gap-1.5"
            title="Open in new window"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Standalone Window</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Builder View */}
      <div
        className={`w-full rounded-2xl overflow-hidden border border-cyber-border shadow-2xl transition-all duration-300 relative bg-[#0a0a0a] ${
          isFullscreen
            ? "fixed inset-0 z-50 rounded-none border-0 h-screen w-screen"
            : "h-[860px] max-h-[92vh]"
        }`}
      >
        {isFullscreen && (
          <div className="absolute top-4 right-4 z-50">
            <button
              onClick={() => setIsFullscreen(false)}
              className="px-4 py-2 rounded-xl bg-black/80 text-white font-mono text-xs border border-white/20 hover:border-white shadow-xl flex items-center gap-2"
            >
              <span>✕ Close Fullscreen</span>
            </button>
          </div>
        )}

        <iframe
          ref={iframeRef}
          src="/tools/portfolio-builder.html"
          title="Portfolio Website Builder"
          className="w-full h-full border-0 block"
          allow="clipboard-write; fullscreen"
          sandbox="allow-scripts allow-same-origin allow-modals allow-downloads allow-popups"
        />
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
        <div className="p-4 rounded-xl bg-cyber-card/40 border border-cyber-borderSubtle space-y-1.5">
          <div className="flex items-center gap-2 text-cyber-green font-mono text-xs font-bold uppercase">
            <ShieldCheck className="w-4 h-4" />
            <span>100% Client-Side Privacy</span>
          </div>
          <p className="text-xs text-cyber-muted font-sans leading-relaxed">
            Your personal details, contact info, and career highlights are never saved on remote databases. Everything executes in browser memory.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-cyber-card/40 border border-cyber-borderSubtle space-y-1.5">
          <div className="flex items-center gap-2 text-cyber-cyan font-mono text-xs font-bold uppercase">
            <Globe className="w-4 h-4" />
            <span>Zero Build Dependencies</span>
          </div>
          <p className="text-xs text-cyber-muted font-sans leading-relaxed">
            Outputs a production-grade, self-contained <code className="text-white">index.html</code> ready to host instantly on GitHub Pages, Netlify, Vercel, or Apache.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-cyber-card/40 border border-cyber-borderSubtle space-y-1.5">
          <div className="flex items-center gap-2 text-yellow-400 font-mono text-xs font-bold uppercase">
            <Smartphone className="w-4 h-4" />
            <span>Fluid Mobile &amp; Dark Mode</span>
          </div>
          <p className="text-xs text-cyber-muted font-sans leading-relaxed">
            Includes sticky expanding 3D cards, horizontal scroll journey, dynamic dark/light theme switcher, and responsive grid layouts.
          </p>
        </div>
      </div>
    </div>
  );
}
