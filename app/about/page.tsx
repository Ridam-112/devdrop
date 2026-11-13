import React from "react";
import Link from "next/link";
import { Wrench, Shield, Sparkles, CheckCircle2, ArrowRight, Heart, Mail } from "lucide-react";
import { SITE_URL } from "@/lib/constants";

export const metadata = {
  title: "About DevDrop — Free Online Web Utilities & Browser Games",
  description:
    "Learn about DevDrop (devdrop.online): privacy-first client-side web tools, image and PDF utilities, developer helpers, and browser games.",
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 inline-block mb-3">
          ABOUT DEVDROP
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">
          Everyday Utilities, Built for Speed &amp; Privacy
        </h1>
        <p className="text-sm text-neutral-300 mt-3 leading-relaxed">
          DevDrop (devdrop.online) is an independent web utility platform built to provide free, accessible, and privacy-focused tools and browser games for students, creators, and developers worldwide.
        </p>
      </div>

      <div className="space-y-8 text-sm text-neutral-300 leading-relaxed">
        <section className="p-6 rounded-2xl bg-neutral-900/80 border border-neutral-800">
          <h2 className="text-xl font-bold text-white font-mono mb-3 flex items-center gap-2">
            <Wrench className="w-5 h-5 text-emerald-400" />
            Our Core Mission: High Utility with Zero Friction
          </h2>
          <p className="mb-3">
            Every day, millions of people need to compress an image for a job application, combine photos into a PDF, generate a clean QR code, or format a JSON payload. Unfortunately, most websites lock these basic tasks behind paywalls, intrusive subscription popups, or mandatory account creation.
          </p>
          <p>
            <strong>DevDrop is built differently:</strong> Every tool is immediately accessible right in your web browser. No accounts, no subscriptions, and no paywalls.
          </p>
        </section>

        <section className="p-6 rounded-2xl bg-neutral-900/80 border border-neutral-800">
          <h2 className="text-xl font-bold text-white font-mono mb-3 flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyan-400" />
            Our Privacy &amp; Data Principles
          </h2>
          <ul className="space-y-4 mt-4">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-mono text-xs">Client-Side Architecture First</strong>
                <span>Whenever technologically possible, our tools run 100% inside your local browser memory using JavaScript and WebAssembly. Your photos, text documents, and code never touch a remote server.</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-mono text-xs">Transparent API Disclosures</strong>
                <span>When a feature requires external computational power — such as our Photo Background Remover using the Remove.bg API — we disclose that clearly and ensure data is encrypted in transit and never stored.</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-mono text-xs">Zero Tracking &amp; Zero Paywalls</strong>
                <span>We do not require user accounts, passwords, or credit card details. All utilities are unconditionally free for personal, educational, and commercial workflows.</span>
              </div>
            </li>
          </ul>
        </section>

        <section className="p-6 rounded-2xl bg-neutral-900/80 border border-neutral-800">
          <h2 className="text-xl font-bold text-white font-mono mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            The Team &amp; Contact
          </h2>
          <p className="mb-4">
            DevDrop is maintained by a dedicated group of open-web engineers and designers. We welcome feedback, bug reports, and suggestions for new utilities from our global user community.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-neutral-950 font-bold hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20"
            >
              <span>Explore All Tools</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-700 text-neutral-200 hover:text-white hover:border-neutral-500 transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-emerald-400" />
              <span>Contact Support (support@devdrop.online)</span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
