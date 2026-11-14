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
              <div className="w-8 h-8 rounded-lg overflow-hidden bg-neutral-950 border border-purple-500/40 flex items-center justify-center shadow-md">
                <img src="/logo.png" alt="DevDrop" width={32} height={32} className="w-full h-full object-cover" />
              </div>
              <span className="text-base font-black font-mono tracking-wider text-white">
                DEVDROP
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Fast, privacy-first web utilities, PDF creators, image tools, developer converters, and open-source browser games.
            </p>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800 text-[11px] font-mono text-slate-300">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Client-Side Processing &bull; Free Forever</span>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 mb-4">
              Categories
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>
                <Link href="/category/image-media" className="hover:text-emerald-400 transition-colors">
                  Image &amp; Photo Utilities
                </Link>
              </li>
              <li>
                <Link href="/category/pdf-document" className="hover:text-emerald-400 transition-colors">
                  PDF &amp; Document Tools
                </Link>
              </li>
              <li>
                <Link href="/category/developer-utils" className="hover:text-emerald-400 transition-colors">
                  Productivity &amp; Web Utilities
                </Link>
              </li>
              <li>
                <Link href="/games" className="hover:text-emerald-400 transition-colors">
                  70+ Open-Source Games
                </Link>
              </li>
              <li>
                <Link href="/guides" className="hover:text-emerald-400 transition-colors">
                  How-To Guides &amp; Tutorials
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Popular Tools */}
          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 mb-4">
              Featured Tools
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>
                <Link href="/tools/image-compressor" className="hover:text-emerald-400 transition-colors">
                  Image Size Compressor
                </Link>
              </li>
              <li>
                <Link href="/tools/photo-bg-remover" className="hover:text-emerald-400 transition-colors">
                  Photo Background Remover
                </Link>
              </li>
              <li>
                <Link href="/tools/qr-code-generator" className="hover:text-emerald-400 transition-colors">
                  Custom QR Code Generator
                </Link>
              </li>
              <li>
                <Link href="/tools/photo-to-pdf" className="hover:text-emerald-400 transition-colors">
                  Photo to PDF Converter
                </Link>
              </li>
              <li>
                <Link href="/tools/json-formatter" className="hover:text-emerald-400 transition-colors">
                  JSON Formatter &amp; Validator
                </Link>
              </li>
              <li>
                <Link href="/tools/loan-emi-calculator" className="hover:text-emerald-400 transition-colors">
                  Loan EMI Calculator
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Legal & Policy Compliance */}
          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 mb-4">
              Platform &amp; Legal
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>
                <Link href="/about" className="hover:text-emerald-400 transition-colors">
                  About DevDrop
                </Link>
              </li>
              <li>
                <Link href="/guides" className="hover:text-emerald-400 transition-colors">
                  Guides &amp; Articles
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-emerald-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-emerald-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-emerald-400 transition-colors">
                  Disclaimer &amp; Notices
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-emerald-400 transition-colors">
                  Contact &amp; Support
                </Link>
              </li>
              <li>
                <a
                  href="https://asiafilm.org/4/afb750cc6ce803e2aa45d8e7ee8321b0"
                  target="_blank"
                  rel="sponsored nofollow noopener"
                  className="text-amber-400/90 hover:text-amber-300 transition-colors flex items-center gap-1 font-mono text-[11px]"
                >
                  <span>Partner Deals (Sponsored)</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer Link Strip */}
        <div className="mt-8 p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 text-xs text-slate-400 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>
              DevDrop is a free utility platform. Client tools run directly in your browser. Review our{" "}
              <Link href="/privacy" className="text-emerald-400 underline hover:text-white">
                Privacy Policy
              </Link>{" "}
              and{" "}
              <Link href="/disclaimer" className="text-emerald-400 underline hover:text-white">
                Disclaimer
              </Link>{" "}
              for complete details.
            </span>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-neutral-500">
          <p>&copy; {new Date().getFullYear()} DevDrop. All tools free for personal and commercial use.</p>
          <p>
            Built for developers, creators, and everyday productivity.
          </p>
        </div>
      </div>
    </footer>
  );
};
