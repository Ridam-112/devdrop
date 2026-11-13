import React from "react";
import Link from "next/link";
import { FileQuestion, Home, Wrench, Gamepad2, BookOpen } from "lucide-react";

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center my-auto flex flex-col items-center justify-center">
      <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-emerald-400 mb-6 shadow-xl shadow-emerald-500/10">
        <FileQuestion className="w-8 h-8" />
      </div>

      <span className="text-xs font-mono font-bold tracking-widest text-emerald-400 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-4 inline-block">
        404 — PAGE NOT FOUND
      </span>

      <h1 className="text-3xl sm:text-4xl font-black font-mono text-white mb-3">
        Page Not Found
      </h1>

      <p className="text-sm text-neutral-400 max-w-md mx-auto mb-8 leading-relaxed">
        The page or utility you requested does not exist or may have been moved. Explore our popular tools and games below:
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-mono">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-neutral-950 font-bold hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
        >
          <Home className="w-4 h-4" />
          <span>Home</span>
        </Link>
        <Link
          href="/tools"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-neutral-200 hover:text-white hover:border-emerald-500/50 transition-colors"
        >
          <Wrench className="w-4 h-4 text-emerald-400" />
          <span>All Tools</span>
        </Link>
        <Link
          href="/games"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-neutral-200 hover:text-white hover:border-purple-500/50 transition-colors"
        >
          <Gamepad2 className="w-4 h-4 text-purple-400" />
          <span>Browser Games</span>
        </Link>
        <Link
          href="/guides"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-neutral-200 hover:text-white hover:border-cyan-500/50 transition-colors"
        >
          <BookOpen className="w-4 h-4 text-cyan-400" />
          <span>Guides</span>
        </Link>
      </div>
    </div>
  );
}
