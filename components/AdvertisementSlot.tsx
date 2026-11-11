"use client";

import React, { useEffect, useRef } from "react";

// Adsterra 468x60 Banner Component
export const AdsterraBanner468x60: React.FC = () => {
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = bannerRef.current;
    if (!el) return;

    // Clear previous elements if any
    el.innerHTML = "";

    try {
      const confScript = document.createElement("script");
      confScript.type = "text/javascript";
      confScript.innerHTML = `
        atOptions = {
          'key' : '78ad68ffa16b9dd6ea75e8ddcc2c0a84',
          'format' : 'iframe',
          'height' : 60,
          'width' : 468,
          'params' : {}
        };
      `;

      const adScript = document.createElement("script");
      adScript.type = "text/javascript";
      adScript.src = "https://bauval.org/22/78ad68ffa16b9dd6ea75e8ddcc2c0a84";

      el.appendChild(confScript);
      el.appendChild(adScript);
    } catch (err) {
      console.warn("Adsterra 468x60 initialization note:", err);
    }
  }, []);

  return (
    <div className="w-full flex justify-center items-center my-3 overflow-hidden min-h-[60px]">
      <div ref={bannerRef} className="max-w-full overflow-x-auto flex justify-center" />
    </div>
  );
};

// Adsterra Native Ad Container Component
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
    <div className="w-full my-4 flex justify-center items-center overflow-hidden">
      <div
        id="container-e3fd0062bd8745fa6fca6aa87545b640"
        ref={containerRef}
        className="w-full max-w-4xl min-h-[80px]"
      />
    </div>
  );
};

interface AdvertisementSlotProps {
  slotId?: string;
  format?: "banner" | "rectangle" | "horizontal" | "sidebar" | "native";
  className?: string;
}

export const AdvertisementSlot: React.FC<AdvertisementSlotProps> = ({
  slotId = "ad-slot-default",
  format = "horizontal",
  className = "",
}) => {
  return (
    <aside
      className={`mx-auto w-full my-6 flex flex-col items-center justify-center ${className}`}
      aria-label="Advertisement Placement"
    >
      <div className="w-full flex items-center justify-center mb-1.5 opacity-60">
        <span className="text-[10px] uppercase font-mono tracking-wider text-cyber-muted px-2 py-0.5 rounded bg-cyber-dark/80 border border-cyber-borderSubtle">
          Advertisement
        </span>
      </div>

      <div
        id={slotId}
        className="w-full flex justify-center items-center py-2 px-1 border border-cyber-borderSubtle/40 rounded-xl bg-cyber-card/20 backdrop-blur-sm transition-colors duration-200 hover:border-cyber-cyan/30"
      >
        {format === "horizontal" || format === "native" ? (
          <AdsterraNativeBanner />
        ) : (
          <AdsterraBanner468x60 />
        )}
      </div>
    </aside>
  );
};
