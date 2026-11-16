"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck } from "lucide-react";

interface AdvertisementSlotProps {
  slotId?: string;
  format?: "banner" | "rectangle" | "horizontal" | "sidebar" | "mobile" | "native" | "smartlink";
  className?: string;
}

export const AdvertisementSlot: React.FC<AdvertisementSlotProps> = ({
  slotId = "ad-slot-default",
  format = "horizontal",
  className = "",
}) => {
  const adRef = useRef<HTMLDivElement>(null);
  const [adLoaded, setAdLoaded] = useState(false);

  useEffect(() => {
    try {
      if (typeof window !== "undefined" && (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle) {
        ((window as unknown as { adsbygoogle: unknown[] }).adsbygoogle =
          (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle || []).push({});
        setAdLoaded(true);
      }
    } catch {
      // AdSense auto-handled
    }
  }, []);

  const getMinHeightClass = () => {
    switch (format) {
      case "sidebar":
        return "min-h-[250px]";
      case "rectangle":
        return "min-h-[250px]";
      case "mobile":
        return "min-h-[60px]";
      case "banner":
        return "min-h-[70px]";
      case "smartlink":
        return "min-h-[60px]";
      case "horizontal":
      case "native":
      default:
        return "min-h-[90px]";
    }
  };

  return (
    <aside
      className={`mx-auto w-full my-4 flex flex-col items-center justify-center ${getMinHeightClass()} ${className}`}
      aria-label="Sponsored Space"
    >
      <div className="w-full flex items-center justify-between mb-1 px-2 opacity-60">
        <span className="text-[9px] uppercase font-mono tracking-wider text-slate-400 px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800">
          Sponsored
        </span>
        <span className="text-[9px] font-mono text-emerald-400 flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          <span>Zero Redirects &bull; Safe Browsing</span>
        </span>
      </div>

      <div
        id={slotId}
        ref={adRef}
        className={`w-full flex justify-center items-center py-2 px-1 border border-neutral-800/80 rounded-2xl bg-neutral-900/40 transition-colors duration-200 overflow-hidden ${getMinHeightClass()}`}
      >
        {/* Google AdSense Responsive Unit */}
        <ins
          className="adsbygoogle"
          style={{ display: "block", width: "100%", textAlign: "center" }}
          data-ad-client="ca-pub-9589062360097471"
          data-ad-slot="1234567890"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />

        {/* Fallback Clean Internal Promo Banner (never redirects to external spam) */}
        <div className="w-full p-3 rounded-xl bg-gradient-to-r from-[#12162e] via-[#0f1326] to-[#0a0d1a] border border-[#232a52] flex flex-wrap items-center justify-between gap-3 text-left">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 text-sm flex-shrink-0">
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                <span>DevDrop Web Utilities &amp; Gaming Hub</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-sans font-bold">100% Free</span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans">
                Fast client-side tools: Portfolio Builder, AI BG Remover, PDF Maker, and 56+ Games.
              </p>
            </div>
          </div>
          <Link
            href="/tools"
            className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs flex items-center gap-1 transition-colors flex-shrink-0"
          >
            <span>Explore Tools</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </aside>
  );
};
