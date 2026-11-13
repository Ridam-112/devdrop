"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X, ArrowRight, Sparkles, Smartphone, Wifi, Shield, Terminal, Skull, Gamepad2, Heart, Award } from "lucide-react";
import { searchTools } from "@/lib/utils/searchEngine";
import { ToolItem, INDEXABLE_TOOLS_LABEL } from "@/lib/data/tools";

interface LiveSearchBarProps {
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
  size?: "default" | "large";
}

export const LiveSearchBar: React.FC<LiveSearchBarProps> = ({
  placeholder = `Search ${INDEXABLE_TOOLS_LABEL} (e.g. image compress, background remover, qr code, pdf)...`,
  autoFocus = false,
  className = "",
  size = "large",
}) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<ToolItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update live results on typing
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length > 0) {
      const matches = searchTools(trimmed);
      setResults(matches.slice(0, 6));
      setIsOpen(true);
      setSelectedIndex(-1);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIndex >= 0 && results[selectedIndex]) {
      router.push(`/tools/${results[selectedIndex].slug}`);
      setIsOpen(false);
      return;
    }
    const cleanQ = query.trim();
    if (cleanQ) {
      router.push(`/tools?q=${encodeURIComponent(cleanQ)}`);
      setIsOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const isLarge = size === "large";

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <Search
          className={`absolute left-4 text-slate-400 pointer-events-none transition-colors ${
            isLarge ? "w-5 h-5" : "w-4 h-4"
          }`}
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          autoFocus={autoFocus}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (query.trim().length > 0) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`w-full bg-cyber-dark/95 border border-cyber-borderSubtle focus:border-cyber-green rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyber-green/40 shadow-card-cyber transition-all ${
            isLarge ? "py-4 pl-12 pr-28 text-sm sm:text-base" : "py-2.5 pl-10 pr-24 text-xs sm:text-sm"
          }`}
        />

        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setIsOpen(false);
              inputRef.current?.focus();
            }}
            className={`absolute right-24 text-slate-400 hover:text-white transition-colors ${
              isLarge ? "right-24" : "right-20"
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <button
          type="submit"
          className={`absolute right-2.5 rounded-xl bg-cyber-green text-black font-mono font-bold hover:bg-cyber-green/90 transition-all shadow-neon-green/30 ${
            isLarge ? "px-5 py-2.5 text-xs tracking-wider" : "px-3.5 py-1.5 text-xs"
          }`}
        >
          SEARCH
        </button>
      </form>

      {/* Floating Dropdown Results */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#0c1322] border border-cyber-borderSubtle rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] z-50 overflow-hidden divide-y divide-cyber-borderSubtle/50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-4 py-2.5 bg-[#090f1a] flex items-center justify-between text-[11px] font-mono text-slate-400 border-b border-cyber-borderSubtle/60">
            <span className="flex items-center gap-1.5 text-cyber-green font-bold">
              <Sparkles className="w-3.5 h-3.5 text-cyber-green" />
              TOP MATCHING TOOLS
            </span>
            <span>Use ↑ ↓ to navigate, Enter to open</span>
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-cyber-borderSubtle/40">
            {results.map((tool, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <Link
                  key={tool.slug}
                  href={`/tools/${tool.slug}`}
                  onClick={() => setIsOpen(false)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-4 py-3 transition-colors ${
                    isSelected
                      ? "bg-cyber-green/10 text-white border-l-4 border-l-cyber-green pl-3"
                      : "hover:bg-cyber-panel/50 text-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 pr-3">
                    <div className="w-8 h-8 rounded-lg bg-cyber-dark border border-cyber-borderSubtle flex items-center justify-center text-cyber-cyan shrink-0">
                      <Terminal className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-bold font-mono text-white truncate flex items-center gap-2">
                        <span>{tool.name}</span>
                        {tool.badge && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded font-sans bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/30">
                            {tool.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 font-mono truncate mt-0.5">
                        {tool.tagline || tool.description}
                      </p>
                    </div>
                  </div>

                  <ArrowRight
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      isSelected ? "text-cyber-green translate-x-1" : "text-slate-500"
                    }`}
                  />
                </Link>
              );
            })}
          </div>

          <div className="p-2.5 bg-[#090f1a] text-center">
            <button
              type="button"
              onClick={handleSubmit}
              className="text-xs font-mono text-cyber-green hover:underline inline-flex items-center gap-1.5"
            >
              <span>View all matching results for &quot;{query}&quot;</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Zero results floating helper */}
      {isOpen && query.trim().length > 0 && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#0c1322] border border-cyber-borderSubtle rounded-2xl shadow-2xl z-50 p-5 text-center font-mono text-xs text-slate-300">
          <p className="text-white font-bold mb-1">No direct tool matches found for &quot;{query}&quot;</p>
          <p className="text-slate-400 text-[11px] mb-3">
            Try searching for common terms like:
          </p>
          <div className="flex flex-wrap justify-center gap-1.5">
            {["image compress", "bg remover", "qr code", "pdf merge", "json format", "password gen", "aspect ratio", "timer"].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => {
                  setQuery(preset);
                  inputRef.current?.focus();
                }}
                className="px-2.5 py-1 rounded-lg bg-cyber-dark border border-cyber-borderSubtle hover:border-cyber-green hover:text-cyber-green text-[11px] transition-colors"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
