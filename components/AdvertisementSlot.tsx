"use client";

import React, { useEffect, useRef } from "react";
import { ExternalLink, Sparkles } from "lucide-react";

export const ADSTERRA_SMARTLINK = "https://araplhn.org/4/2dc767af72284fa0e3453ab9103c1429";
export const MONETAG_DIRECT_LINK = "https://uplcm.com/4/12244922";

// Active primary direct link for maximum CPM
export const PRIMARY_DIRECT_LINK = MONETAG_DIRECT_LINK;

// Generic Adsterra Iframe Banner component
interface AdsterraIframeProps {
  adKey: string;
  width: number;
  height: number;
  className?: string;
}

export const AdsterraIframeBanner: React.FC<AdsterraIframeProps> = ({
  adKey,
  width,
  height,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    el.innerHTML = "";

    try {
      const confScript = document.createElement("script");
      confScript.type = "text/javascript";
      confScript.innerHTML = `
        atOptions = {
          'key' : '${adKey}',
          'format' : 'iframe',
          'height' : ${height},
          'width' : ${width},
          'params' : {}
        };
      `;

      const adScript = document.createElement("script");
      adScript.type = "text/javascript";
      adScript.src = `https://bauval.org/22/${adKey}`;

      el.appendChild(confScript);
      el.appendChild(adScript);
    } catch (err) {
      console.warn(`Adsterra banner (${width}x${height}) init note:`, err);
    }
  }, [adKey, width, height]);

  return (
    <div
      ref={containerRef}
      style={{ minHeight: `${height}px`, minWidth: `${Math.min(width, 300)}px` }}
      className={`flex justify-center items-center overflow-x-auto overflow-y-hidden max-w-full ${className}`}
    />
  );
};

// 468x60 Banner (Desktop / Tablet)
export const AdsterraBanner468x60: React.FC = () => (
  <AdsterraIframeBanner
    adKey="78ad68ffa16b9dd6ea75e8ddcc2c0a84"
    width={468}
    height={60}
  />
);

// 320x50 Banner (Mobile standard)
export const AdsterraBanner320x50: React.FC = () => (
  <AdsterraIframeBanner
    adKey="25e4b7a687ebb6cca3b287b9b31b1091"
    width={320}
    height={50}
  />
);

// 160x300 Vertical Banner
export const AdsterraBanner160x300: React.FC = () => (
  <AdsterraIframeBanner
    adKey="d36713b0622a14d0f7c813eeef0ba3c3"
    width={160}
    height={300}
  />
);

// 160x600 Skyscraper Sidebar Banner
export const AdsterraBanner160x600: React.FC = () => (
  <AdsterraIframeBanner
    adKey="d71d068f03039eea4cf854034ee08268"
    width={160}
    height={600}
  />
);

// Responsive Horizontal Banner: 468x60 on sm/md/lg, 320x50 on mobile
export const AdsterraResponsiveBanner: React.FC = () => {
  return (
    <div className="w-full flex justify-center items-center">
      <div className="hidden sm:flex justify-center">
        <AdsterraBanner468x60 />
      </div>
      <div className="flex sm:hidden justify-center">
        <AdsterraBanner320x50 />
      </div>
    </div>
  );
};

// Native Ad Container
export const AdsterraNativeBanner: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const existing = document.querySelector(
      'script[src="https://bauval.org/21/e3fd0062bd8745fa6fca6aa87545b640"]'
    );
    if (!existing) {
      const script = document.createElement("script");
      script.async = true;
      script.setAttribute("data-cfasync", "false");
      script.src = "https://bauval.org/21/e3fd0062bd8745fa6fca6aa87545b640";
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className="w-full my-3 flex justify-center items-center overflow-hidden">
      <div
        id="container-e3fd0062bd8745fa6fca6aa87545b640"
        ref={containerRef}
        className="w-full max-w-4xl min-h-[80px]"
      />
    </div>
  );
};

// High-Converting Smartlink Card
export const AdsterraSmartlinkCard: React.FC<{ title?: string; subtitle?: string; link?: string }> = ({
  title = "⚡ Exclusive Partner Offers & Cloud Boosters",
  subtitle = "High-speed developer nodes, proxy proxies, and cybersecurity perks curated by our partner network.",
  link = PRIMARY_DIRECT_LINK,
}) => {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="w-full p-4 rounded-xl bg-gradient-to-r from-cyber-card via-cyber-dark to-cyber-card border border-cyber-cyan/30 hover:border-cyber-cyan transition-all duration-300 flex items-center justify-between gap-4 group shadow-lg hover:shadow-cyber-cyan/10"
    >
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-lg bg-cyber-cyan/10 text-cyber-cyan group-hover:scale-110 transition-transform">
          <Sparkles className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <h4 className="text-xs sm:text-sm font-mono font-bold text-white group-hover:text-cyber-cyan transition-colors">
            {title}
          </h4>
          <p className="text-[11px] text-cyber-muted font-sans mt-0.5 line-clamp-1">
            {subtitle}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyber-cyan/10 text-cyber-cyan text-xs font-mono font-bold group-hover:bg-cyber-cyan group-hover:text-black transition-all shrink-0">
        <span>Explore</span>
        <ExternalLink className="w-3.5 h-3.5" />
      </div>
    </a>
  );
};

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
  const renderAdFormat = () => {
    switch (format) {
      case "horizontal":
      case "native":
        return <AdsterraNativeBanner />;
      case "banner":
        return <AdsterraResponsiveBanner />;
      case "sidebar":
        return <AdsterraBanner160x600 />;
      case "rectangle":
        return <AdsterraBanner160x300 />;
      case "mobile":
        return <AdsterraBanner320x50 />;
      case "smartlink":
        return <AdsterraSmartlinkCard />;
      default:
        return <AdsterraResponsiveBanner />;
    }
  };

  return (
    <aside
      className={`mx-auto w-full my-6 flex flex-col items-center justify-center ${className}`}
      aria-label="Advertisement Placement"
    >
      <div className="w-full flex items-center justify-between mb-1.5 px-2 opacity-60">
        <span className="text-[9px] uppercase font-mono tracking-wider text-cyber-muted px-2 py-0.5 rounded bg-cyber-dark/80 border border-cyber-borderSubtle">
          Sponsored Network
        </span>
        <a
          href={PRIMARY_DIRECT_LINK}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="text-[9px] font-mono text-cyber-cyan/80 hover:text-cyber-cyan flex items-center gap-1 hover:underline"
        >
          <span>Featured Partner</span>
          <ExternalLink className="w-2.5 h-2.5" />
        </a>
      </div>

      <div
        id={slotId}
        className="w-full flex justify-center items-center py-2 px-1 border border-cyber-borderSubtle/40 rounded-xl bg-cyber-card/20 backdrop-blur-sm transition-colors duration-200 hover:border-cyber-cyan/30"
      >
        {renderAdFormat()}
      </div>
    </aside>
  );
};
