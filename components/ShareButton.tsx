"use client";

import React, { useState } from "react";
import { Share2, Check, Copy } from "lucide-react";

interface ShareButtonProps {
  title: string;
  text?: string;
  url?: string;
  className?: string;
  variant?: "primary" | "secondary" | "subtle";
}

export const ShareButton: React.FC<ShareButtonProps> = ({
  title,
  text = "Check out this cybersecurity tool on DEVDROP!",
  url,
  className = "",
  variant = "secondary",
}) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url: shareUrl,
        });
        return;
      } catch (err) {
        // User cancelled or platform error -> fallback to clipboard
      }
    }

    // Fallback: Copy to clipboard
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Direct prompt fallback
      window.prompt("Copy link:", shareUrl);
    }
  };

  const variantStyles = {
    primary:
      "bg-cyber-green text-black font-semibold hover:bg-cyber-green/90 shadow-neon-green",
    secondary:
      "bg-cyber-card border border-cyber-border text-cyber-green hover:bg-cyber-green/10 hover:border-cyber-green/50",
    subtle:
      "bg-cyber-panel/60 border border-cyber-borderSubtle text-slate-300 hover:text-white hover:border-cyber-cyan/40",
  };

  return (
    <button
      onClick={handleShare}
      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-cyber-green/50 ${variantStyles[variant]} ${className}`}
      title="Share tool with friends"
      aria-label="Share this tool"
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 text-cyber-green" />
          <span className="text-cyber-green font-medium">Link Copied!</span>
        </>
      ) : (
        <>
          <Share2 className="w-4 h-4" />
          <span>Share with Friends</span>
        </>
      )}
    </button>
  );
};
