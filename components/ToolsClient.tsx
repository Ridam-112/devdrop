"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Filter, Sparkles, X, RefreshCw, ArrowRight } from "lucide-react";
import { TOOLS, CATEGORIES, ToolItem, INDEXABLE_TOOLS_LABEL } from "@/lib/data/tools";
import { ToolCard } from "@/components/ToolCard";
import { AdvertisementSlot } from "@/components/AdvertisementSlot";
import { searchTools } from "@/lib/utils/searchEngine";

function ToolsContent() {
  const searchParams = useSearchParams();
  const qParam = searchParams.get("q") || "";
  const catParam = searchParams.get("category") || "all";

  const [searchQuery, setSearchQuery] = useState(qParam);
  const [selectedCategory, setSelectedCategory] = useState(catParam);

  // Sync state if URL query parameters change (e.g. from homepage or back button)
  useEffect(() => {
    if (qParam !== searchQuery) {
      setSearchQuery(qParam);
    }
  }, [qParam]);

  useEffect(() => {
    if (catParam !== selectedCategory) {
      setSelectedCategory(catParam);
    }
  }, [catParam]);

  // Use the smart multi-token synonym relevance search engine
  const filteredTools = useMemo(() => {
    return searchTools(searchQuery, selectedCategory);
  }, [searchQuery, selectedCategory]);

  const handleReset = () => {
    setSearchQuery("");
    setSelectedCategory("all");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyber-green px-3 py-1 rounded-full bg-cyber-green/10 border border-cyber-green/30 inline-block mb-3">
          COMPLETE TOOL CATALOGUE
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">
          All Web Tools &amp; Developer Utilities
        </h1>
        <p className="text-sm text-slate-300 mt-2 leading-relaxed">
          Filter and explore our collection of {INDEXABLE_TOOLS_LABEL}, including image optimizers, PDF processors, code formatters, unit converters, and client-side utilities.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-cyber-card/80 border border-cyber-borderSubtle rounded-2xl p-4 sm:p-6 mb-10 shadow-card-cyber space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-4">
          {/* Search Field */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-cyber-muted pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${INDEXABLE_TOOLS_LABEL} by keyword or feature (e.g. background remover, image compress, qr code, pdf)...`}
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

          {/* Reset Action */}
          {(searchQuery || selectedCategory !== "all") && (
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyber-panel border border-cyber-borderSubtle text-xs font-mono text-slate-300 hover:text-white hover:border-cyber-green transition-colors whitespace-nowrap"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Active Query Feedback */}
        {searchQuery.trim() && (
          <div className="flex items-center justify-between text-xs font-mono pt-1 text-slate-300 border-t border-cyber-borderSubtle/40">
            <span>
              Showing <strong className="text-cyber-green">{filteredTools.length}</strong> {filteredTools.length === 1 ? "tool" : "tools"} matching &ldquo;<span className="text-white">{searchQuery}</span>&rdquo;
            </span>
            <span className="text-slate-400 text-[11px]">Ranked by relevance</span>
          </div>
        )}

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin pt-2">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium whitespace-nowrap transition-all ${
              selectedCategory === "all"
                ? "bg-cyber-green text-black font-bold shadow-neon-green/30"
                : "bg-cyber-panel border border-cyber-borderSubtle text-slate-300 hover:text-white hover:border-cyber-green/50"
            }`}
          >
            All Categories ({TOOLS.length})
          </button>

          {CATEGORIES.map((cat) => {
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

      {/* Directory Ad Placement */}
      <div className="mb-10">
        <AdvertisementSlot slotId="tools-directory-top" format="horizontal" />
      </div>

      {/* Tools Grid */}
      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16 px-4 rounded-2xl bg-cyber-card border border-cyber-borderSubtle max-w-xl mx-auto">
          <div className="w-12 h-12 rounded-xl bg-cyber-panel border border-cyber-border flex items-center justify-center text-cyber-muted mx-auto mb-4">
            <Filter className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-white font-mono mb-2">No Matching Tools Found</h2>
          <p className="text-xs text-slate-300 mb-4 leading-relaxed">
            No tools matched your query &ldquo;<span className="text-cyber-green font-mono">{searchQuery}</span>&rdquo; in the selected category.
          </p>

          <p className="text-[11px] font-mono text-slate-400 mb-3">
            Popular searches you can try:
          </p>
          <div className="flex flex-wrap justify-center gap-1.5 mb-6">
            {[
              "background remover",
              "image compress",
              "qr code",
              "pdf merge",
              "json formatter",
              "password generator",
              "base64",
              "markdown preview",
            ].map((term) => (
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
