import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { BookOpen, Clock, Calendar, ArrowRight, Sparkles } from "lucide-react";
import { GUIDES } from "@/lib/data/guides";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Free Online Tool Guides & Tutorials | DevDrop",
  description:
    "Explore practical guides on image compression, converting JPG to PDF, custom QR code generation, loan EMI calculations, and JSON validation.",
  alternates: {
    canonical: `${SITE_URL}/guides`,
  },
  openGraph: {
    title: "Free Online Tool Guides & Tutorials | DevDrop",
    description:
      "Step-by-step developer and everyday productivity tutorials for browser utilities.",
    url: `${SITE_URL}/guides`,
    siteName: "DevDrop",
    type: "website",
  },
};

export default function GuidesIndexPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-10">
      <header className="rounded-2xl bg-gradient-to-br from-neutral-900/90 via-neutral-900 to-neutral-950 border border-neutral-800 p-8 sm:p-12 text-center max-w-4xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>KNOWLEDGE BASE &amp; GUIDES</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-mono tracking-tight">
          How-To Guides &amp; Utility Tutorials
        </h1>
        <p className="text-sm sm:text-base text-neutral-300 max-w-2xl mx-auto leading-relaxed">
          Step-by-step explanations, formulas, and technical guides to help you get the most out of DevDrop&apos;s free browser utilities.
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {GUIDES.map((guide) => (
          <Link
            key={guide.slug}
            href={`/guides/${guide.slug}`}
            className="group flex flex-col justify-between p-6 rounded-2xl bg-neutral-900/80 border border-neutral-800 hover:border-emerald-500/50 hover:bg-neutral-900 transition-all duration-200"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-emerald-400" />
                  {guide.publishedAt}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-cyan-400" />
                  {guide.readingTime}
                </span>
              </div>

              <h2 className="text-lg font-bold text-white font-mono group-hover:text-emerald-400 transition-colors leading-snug">
                {guide.title}
              </h2>

              <p className="text-xs text-neutral-400 leading-relaxed line-clamp-3">
                {guide.summary}
              </p>
            </div>

            <div className="pt-5 mt-5 border-t border-neutral-800/80 flex items-center justify-between text-xs font-mono">
              <span className="text-emerald-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Read guide <ArrowRight className="w-3.5 h-3.5" />
              </span>
              <span className="text-neutral-500 text-[10px]">
                Tool: {guide.targetToolName}
              </span>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
