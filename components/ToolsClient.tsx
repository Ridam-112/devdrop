"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search, Filter, X, RefreshCw, ArrowRight, CheckCircle2,
  Sparkles, Image as ImageIcon, FileText, Code2, Wrench, ExternalLink,
} from "lucide-react";
import { TOOLS, CATEGORIES, ToolItem, INDEXABLE_TOOLS_LABEL, isToolIndexable } from "@/lib/data/tools";
import { ToolCard } from "@/components/ToolCard";
import { AdvertisementSlot } from "@/components/AdvertisementSlot";
import { searchTools } from "@/lib/utils/searchEngine";
import Link from "next/link";

// ── Curated real tool quick-access grid ─────────────────────────────────────
const REAL_TOOL_QUICK_ACCESS = [
  {
    slug: "portfolio-builder",
    name: "Portfolio Builder",
    description: "Build an interactive developer portfolio & download a ready-to-deploy index.html",
    icon: "🗂️",
    color: "from-indigo-900/60 to-purple-900/60",
    border: "border-indigo-500/30 hover:border-indigo-400/60",
    badge: "Popular",
  },
  {
    slug: "photo-bg-remover",
    name: "Background Remover",
    description: "AI-powered photo background removal — instant, private, no server upload",
    icon: "✂️",
    color: "from-pink-900/60 to-rose-900/60",
    border: "border-pink-500/30 hover:border-pink-400/60",
    badge: "AI Tool",
  },
  {
    slug: "image-compressor",
    name: "Image Compressor",
    description: "Compress JPG, PNG & WebP images up to 90% smaller — 100% client-side",
    icon: "🖼️",
    color: "from-cyan-900/60 to-teal-900/60",
    border: "border-cyan-500/30 hover:border-cyan-400/60",
    badge: "Free",
  },
  {
    slug: "qr-code-generator",
    name: "QR Code Generator",
    description: "Create custom HD QR codes for URLs, WiFi, text — download SVG or PNG",
    icon: "📱",
    color: "from-green-900/60 to-emerald-900/60",
    border: "border-green-500/30 hover:border-green-400/60",
    badge: "Free",
  },
  {
    slug: "pdf-maker",
    name: "PDF Maker",
    description: "Convert text, notes & Markdown into formatted PDF documents instantly",
    icon: "📄",
    color: "from-orange-900/60 to-amber-900/60",
    border: "border-orange-500/30 hover:border-orange-400/60",
    badge: "Free",
  },
  {
    slug: "photo-to-pdf",
    name: "Photo to PDF",
    description: "Merge multiple JPG/PNG/WebP images into a single consolidated PDF file",
    icon: "🖼️",
    color: "from-violet-900/60 to-fuchsia-900/60",
    border: "border-violet-500/30 hover:border-violet-400/60",
    badge: "Free",
  },
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    description: "Beautify, minify & validate JSON — syntax highlighting included",
    icon: "{ }",
    color: "from-yellow-900/60 to-lime-900/60",
    border: "border-yellow-500/30 hover:border-yellow-400/60",
    badge: "Dev Tool",
  },
  {
    slug: "password-generator",
    name: "Password Generator",
    description: "Generate cryptographically strong random passwords — stays on your device",
    icon: "🔑",
    color: "from-red-900/60 to-orange-900/60",
    border: "border-red-500/30 hover:border-red-400/60",
    badge: "Security",
  },
  {
    slug: "barcode-generator",
    name: "Barcode Generator",
    description: "Create Code 128 barcodes for retail, shipping & inventory — free download",
    icon: "▤",
    color: "from-slate-800/60 to-zinc-800/60",
    border: "border-slate-500/30 hover:border-slate-400/60",
    badge: "Free",
  },
  {
    slug: "word-counter",
    name: "Word Counter",
    description: "Real-time word, character, sentence & reading time analyzer",
    icon: "📝",
    color: "from-blue-900/60 to-sky-900/60",
    border: "border-blue-500/30 hover:border-blue-400/60",
    badge: "Free",
  },
  {
    slug: "base64-encoder-decoder",
    name: "Base64 Encoder / Decoder",
    description: "Encode plain text to Base64 or decode Base64 strings instantly",
    icon: "🔁",
    color: "from-teal-900/60 to-cyan-900/60",
    border: "border-teal-500/30 hover:border-teal-400/60",
    badge: "Dev Tool",
  },
  {
    slug: "age-calculator",
    name: "Age Calculator",
    description: "Find your exact age in years, months, days & total days lived",
    icon: "🎂",
    color: "from-pink-900/60 to-purple-900/60",
    border: "border-pink-500/30 hover:border-pink-400/60",
    badge: "Free",
  },
];

// ── Category icons ────────────────────────────────────────────────────────────
const CAT_ICONS: Record<string, React.ReactNode> = {
  "image-media": <ImageIcon className="w-4 h-4" />,
  "pdf-document": <FileText className="w-4 h-4" />,
  "developer-utils": <Code2 className="w-4 h-4" />,
};

function ToolsContent() {
  const searchParams = useSearchParams();
  const qParam = searchParams.get("q") || "";
  const catParam = searchParams.get("category") || "all";

  const [searchQuery, setSearchQuery] = useState(qParam);
  const [selectedCategory, setSelectedCategory] = useState(catParam);

  useEffect(() => {
    if (qParam !== searchQuery) setSearchQuery(qParam);
  }, [qParam]);

  useEffect(() => {
    if (catParam !== selectedCategory) setSelectedCategory(catParam);
  }, [catParam]);

  const filteredTools = useMemo(() => {
    return searchTools(searchQuery, selectedCategory);
  }, [searchQuery, selectedCategory]);

  // Split into real vs entertainment
  const realTools = useMemo(() => filteredTools.filter(isToolIndexable), [filteredTools]);
  const otherTools = useMemo(() => filteredTools.filter(t => !isToolIndexable(t)), [filteredTools]);

  const handleReset = () => {
    setSearchQuery("");
    setSelectedCategory("all");
  };

  const isFiltering = searchQuery.trim() !== "" || selectedCategory !== "all";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">

      {/* ── HERO HEADER ─────────────────────────────────── */}
      <div className="mb-10">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-[10px] uppercase font-mono font-bold tracking-widest px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            ✓ Real Working Tools
          </span>
          <span className="text-[10px] uppercase font-mono tracking-wider px-2.5 py-1 rounded bg-cyber-dark text-cyber-muted border border-cyber-borderSubtle">
            100% Client-Side
          </span>
          <span className="text-[10px] uppercase font-mono tracking-wider px-2.5 py-1 rounded bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/30">
            No Upload Required
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white mb-3">
          Web Tools &amp; Utilities
        </h1>
        <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
          Genuine, fully functional browser tools — Portfolio Builder, AI Background Remover, Image Compressor, PDF Maker, QR Generator and 50+ more.
          Everything runs <strong className="text-emerald-400">directly in your browser</strong> with zero server uploads.
        </p>
      </div>

      {/* ── FEATURED REAL TOOLS QUICK-ACCESS GRID ──────── */}
      {!isFiltering && (
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <h2 className="text-xl font-bold font-mono text-white">Real Tools &amp; Utilities</h2>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              Opens in new tab
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {REAL_TOOL_QUICK_ACCESS.map((t) => (
              <Link
                key={t.slug}
                href={`/tools/${t.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative bg-gradient-to-br ${t.color} rounded-2xl border ${t.border} p-4 flex flex-col gap-2 transition-all hover:-translate-y-0.5 hover:shadow-xl`}
              >
                {/* Badge */}
                <span className="absolute top-2.5 right-2.5 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-white/10 text-white/60 backdrop-blur-sm">
                  {t.badge}
                </span>

                {/* Icon */}
                <div className="text-3xl mb-1">{t.icon}</div>

                {/* Title */}
                <h3 className="text-white font-bold text-sm leading-tight pr-4 group-hover:text-white/90">
                  {t.name}
                </h3>

                {/* Description */}
                <p className="text-white/50 text-[11px] leading-relaxed line-clamp-2 flex-1">
                  {t.description}
                </p>

                {/* Open link */}
                <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 group-hover:text-emerald-300 mt-1">
                  <ExternalLink className="w-3 h-3" />
                  <span>Open Tool</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── SEARCH + CATEGORY FILTER ───────────────────── */}
      <div className="bg-cyber-card/80 border border-cyber-borderSubtle rounded-2xl p-4 sm:p-6 mb-10 shadow-card-cyber space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-cyber-muted pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${INDEXABLE_TOOLS_LABEL} tools — e.g. background remover, pdf, qr code, json...`}
              className="w-full bg-cyber-dark border border-cyber-borderSubtle focus:border-cyber-cyan rounded-xl py-2.5 pl-10 pr-10 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyber-cyan/30 transition-all font-mono"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-cyber-muted hover:text-white"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Reset */}
          {isFiltering && (
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyber-panel border border-cyber-borderSubtle text-xs font-mono text-slate-300 hover:text-white hover:border-cyber-green transition-colors whitespace-nowrap"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Search feedback */}
        {searchQuery.trim() && (
          <div className="flex items-center justify-between text-xs font-mono pt-1 text-slate-300 border-t border-cyber-borderSubtle/40">
            <span>
              Showing <strong className="text-cyber-green">{filteredTools.length}</strong> tools matching &ldquo;<span className="text-white">{searchQuery}</span>&rdquo;
            </span>
            <span className="text-slate-400 text-[11px]">Ranked by relevance</span>
          </div>
        )}

        {/* Category filter pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin pt-2">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium whitespace-nowrap transition-all ${
              selectedCategory === "all"
                ? "bg-cyber-green text-black font-bold shadow-neon-green/30"
                : "bg-cyber-panel border border-cyber-borderSubtle text-slate-300 hover:text-white hover:border-cyber-green/50"
            }`}
          >
            All ({TOOLS.length})
          </button>

          {/* Real categories first */}
          {CATEGORIES.filter(c => c.indexable).map((cat) => {
            const count = TOOLS.filter((t) => t.categorySlug === cat.slug).length;
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.slug}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-emerald-500 text-black font-bold"
                    : "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
                }`}
              >
                {CAT_ICONS[cat.slug]}
                {cat.name} ({count})
              </button>
            );
          })}

          {/* Separator */}
          <div className="w-px h-5 bg-cyber-borderSubtle shrink-0" />

          {/* Sim categories */}
          {CATEGORIES.filter(c => !c.indexable).map((cat) => {
            const count = TOOLS.filter((t) => t.categorySlug === cat.slug).length;
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.slug}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? "bg-cyber-cyan text-black font-bold shadow-neon-cyan/30"
                    : "bg-cyber-panel border border-cyber-borderSubtle text-slate-300 hover:text-white hover:border-cyber-cyan/50"
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* ── AD ──────────────────────────────────────────── */}
      <div className="mb-10">
        <AdvertisementSlot slotId="tools-directory-top" format="horizontal" />
      </div>

      {/* ── TOOLS GRID ──────────────────────────────────── */}
      {filteredTools.length > 0 ? (
        <>
          {/* Real/indexable tools — shown first with section header */}
          {realTools.length > 0 && (
            <section className="mb-10">
              {!isFiltering || selectedCategory === "all" || CATEGORIES.find(c=>c.slug===selectedCategory)?.indexable ? (
                <div className="flex items-center gap-2 mb-5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <h2 className="text-base font-bold font-mono text-white">
                    Real Tools & Utilities
                    <span className="ml-2 text-xs font-normal text-emerald-400/70">({realTools.length}) — open in new tab</span>
                  </h2>
                </div>
              ) : null}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {realTools.map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} />
                ))}
              </div>
            </section>
          )}

          {/* Other/simulation tools */}
          {otherTools.length > 0 && (
            <section>
              {realTools.length > 0 && (
                <div className="flex items-center gap-2 mb-5 pt-6 border-t border-cyber-borderSubtle">
                  <Sparkles className="w-4 h-4 text-cyber-cyan" />
                  <h2 className="text-base font-bold font-mono text-white">
                    Entertainment & Simulation Tools
                    <span className="ml-2 text-xs font-normal text-cyber-muted">({otherTools.length})</span>
                  </h2>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {otherTools.map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} />
                ))}
              </div>
            </section>
          )}
        </>
      ) : (
        /* Empty State */
        <div className="text-center py-16 px-4 rounded-2xl bg-cyber-card border border-cyber-borderSubtle max-w-xl mx-auto">
          <div className="w-12 h-12 rounded-xl bg-cyber-panel border border-cyber-border flex items-center justify-center text-cyber-muted mx-auto mb-4">
            <Filter className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-white font-mono mb-2">No Matching Tools Found</h2>
          <p className="text-xs text-slate-300 mb-4 leading-relaxed">
            No tools matched &ldquo;<span className="text-cyber-green font-mono">{searchQuery}</span>&rdquo;.
          </p>
          <div className="flex flex-wrap justify-center gap-1.5 mb-6">
            {["background remover", "image compress", "qr code", "pdf maker", "json formatter", "password generator"].map((term) => (
              <button
                key={term}
                onClick={() => setSearchQuery(term)}
                className="px-2.5 py-1 rounded-lg bg-cyber-panel border border-cyber-borderSubtle text-[11px] font-mono text-slate-300 hover:text-cyber-green hover:border-cyber-green transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
          <button
            onClick={handleReset}
            className="px-5 py-2.5 rounded-xl bg-cyber-green text-black font-mono font-bold text-xs hover:bg-cyber-green/90 transition-all shadow-neon-green"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
}

export default function ToolsClient() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-20 text-center text-cyber-green font-mono text-sm">
          Loading tools catalogue...
        </div>
      }
    >
      <ToolsContent />
    </Suspense>
  );
}
