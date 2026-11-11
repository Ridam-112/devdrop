import React from "react";
import Link from "next/link";
import { Terminal, Shield, AlertTriangle } from "lucide-react";
import { CATEGORIES } from "@/lib/data/tools";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-cyber-dark border-t border-cyber-borderSubtle mt-20 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-cyber-borderSubtle/60">
          {/* Col 1: Brand & Purpose */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyber-card border border-cyber-border flex items-center justify-center text-cyber-green">
                <Terminal className="w-4 h-4" />
              </div>
              <span className="text-base font-black font-mono tracking-wider text-white">
                HACKVERSE
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enter the Digital Underground. Advanced cybersecurity intelligence, hardware telemetry, and interactive diagnostic consoles.
            </p>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-cyber-panel border border-cyber-borderSubtle text-[11px] font-mono text-slate-300">
              <Shield className="w-3.5 h-3.5 text-cyber-green" />
              <span>100% Client-Side • Non-Destructive</span>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyber-green mb-4">
              Categories
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-300">
              {CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="hover:text-cyber-cyan transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Popular Tools */}
          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyber-green mb-4">
              Featured Tools
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>
                <Link href="/tools/phone-location-prank" className="hover:text-cyber-cyan transition-colors">
                  Satellite Location Triangulator
                </Link>
              </li>
              <li>
                <Link href="/tools/mobile-hacker" className="hover:text-cyber-cyan transition-colors">
                  Mobile Kernel Security Auditor
                </Link>
              </li>
              <li>
                <Link href="/tools/phone-unlock-simulator" className="hover:text-cyber-cyan transition-colors">
                  Smartphone Screen Lock Interface
                </Link>
              </li>
              <li>
                <Link href="/tools/fake-hacker-terminal" className="hover:text-cyber-cyan transition-colors">
                  Cyberpunk Underground Terminal
                </Link>
              </li>
              <li>
                <Link href="/tools/password-strength-checker" className="hover:text-cyber-cyan transition-colors">
                  Password Cryptographic Entropy
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Legal & Policy Compliance */}
          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyber-green mb-4">
              Compliance & Legal
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>
                <Link href="/about" className="hover:text-cyber-cyan transition-colors">
                  About HACKVERSE
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-cyber-cyan transition-colors">
                  Disclaimer & Simulation Notice
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-cyber-cyan transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-cyber-cyan transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-cyber-cyan transition-colors">
                  Contact & Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer Link Strip */}
        <div className="mt-8 p-4 rounded-xl bg-cyber-panel/40 border border-cyber-borderSubtle text-xs text-slate-400 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-cyber-amber flex-shrink-0" />
            <span>
              All tools on HACKVERSE are for educational demonstration and simulation. Review our full{" "}
              <Link href="/disclaimer" className="text-cyber-green underline hover:text-white">
                Disclaimer Page
              </Link>{" "}
              for complete legal details.
            </span>
          </div>
          <span className="font-mono text-[11px] text-cyber-muted">Version 4.2.0</span>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-cyber-muted">
          <p>© {new Date().getFullYear()} HACKVERSE Platform. All rights reserved.</p>
          <p>
            Designed for cybersecurity education & entertainment
          </p>
        </div>
      </div>
    </footer>
  );
};
