import React from "react";
import Link from "next/link";
import { Terminal, ArrowLeft, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center my-auto flex flex-col items-center justify-center">
      <div className="w-16 h-16 rounded-2xl bg-cyber-dark border border-cyber-red/50 flex items-center justify-center text-cyber-red mb-6 shadow-[0_0_30px_rgba(255,51,102,0.3)] animate-pulse">
        <Terminal className="w-8 h-8" />
      </div>

      <span className="text-xs font-mono font-bold tracking-widest text-cyber-red px-3 py-1 rounded-full bg-cyber-red/10 border border-cyber-red/30 mb-4 inline-block">
        ERROR CODE: 404_PACKET_DROPPED
      </span>

      <h1 className="text-4xl sm:text-5xl font-black font-mono text-white mb-3">
        Subnet Sector Not Found
      </h1>

      <p className="text-sm text-slate-300 max-w-md mx-auto mb-8 font-mono leading-relaxed">
        The requested URL path or virtual device terminal does not exist or has been routed to a null interface.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyber-green text-black font-bold hover:bg-cyber-green/90 transition-all shadow-neon-green/30"
        >
          <Home className="w-4 h-4" />
          <span>Return to Headquarters</span>
        </Link>
        <Link
          href="/tools"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyber-panel border border-cyber-borderSubtle text-slate-200 hover:text-white hover:border-cyber-cyan/50 transition-colors"
        >
          <Search className="w-4 h-4 text-cyber-cyan" />
          <span>Browse All 8 Tools</span>
        </Link>
      </div>
    </div>
  );
}
