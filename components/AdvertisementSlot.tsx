"use client";

import React from "react";

interface AdvertisementSlotProps {
  slotId?: string;
  format?: "banner" | "rectangle" | "horizontal" | "sidebar";
  className?: string;
}

export const AdvertisementSlot: React.FC<AdvertisementSlotProps> = ({
  slotId = "ad-slot-default",
  format = "horizontal",
  className = "",
}) => {
  // Height reservations to prevent Cumulative Layout Shift (CLS)
  const formatClasses = {
    horizontal: "min-h-[100px] md:min-h-[120px] max-w-4xl",
    banner: "min-h-[90px] md:min-h-[100px] max-w-5xl",
    rectangle: "min-h-[250px] w-full max-w-[336px]",
    sidebar: "min-h-[600px] w-full max-w-[300px]",
  };

  return (
    <aside
      className={`mx-auto w-full my-6 flex flex-col items-center justify-center ${className}`}
      aria-label="Advertisement Area"
    >
      <div className="w-full flex items-center justify-center mb-1.5">
        <span className="text-[10px] uppercase font-mono tracking-wider text-cyber-muted px-2 py-0.5 rounded bg-cyber-dark/80 border border-cyber-borderSubtle">
          Advertisement Placement (Reserved Area)
        </span>
      </div>

      <div
        id={slotId}
        className={`w-full ${formatClasses[format]} border border-dashed border-cyber-borderSubtle/60 rounded-xl bg-cyber-card/40 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center transition-colors duration-200 hover:border-cyber-cyan/30`}
      >
        <div className="flex items-center gap-2 text-cyber-muted text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-cyber-green/40"></span>
          <span>Compliant Ad Container ({format})</span>
        </div>
        <p className="text-[11px] text-cyber-muted/80 max-w-md mt-1">
          Space reserved for verified advertising networks. Ads never obstruct tool controls or simulate user interaction.
        </p>
      </div>
    </aside>
  );
};
