import React from "react";
import Link from "next/link";
import { Terminal, Shield, Sparkles, Heart, CheckCircle2, ArrowRight } from "lucide-react";

export const metadata = {
  title: "About HACKVERSE — Cybersecurity Simulation Platform",
  description:
    "Learn about HACKVERSE's mission to provide honest, entertaining, and educational cybersecurity-themed simulators without deception.",
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyber-green px-3 py-1 rounded-full bg-cyber-green/10 border border-cyber-green/30 inline-block mb-3">
          ABOUT OUR UNDERGROUND LAB
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">
          Enter the Digital Underground
        </h1>
        <p className="text-sm text-slate-300 mt-3 leading-relaxed">
          HACKVERSE was built for tech enthusiasts, gamers, and curious minds who love cyberpunk aesthetics, movie hacker tropes, and interactive cybersecurity demonstrations.
        </p>
      </div>

      <div className="space-y-8 text-sm text-slate-300 leading-relaxed">
        <section className="p-6 rounded-2xl bg-cyber-card border border-cyber-borderSubtle">
          <h2 className="text-xl font-bold text-white font-mono mb-3 flex items-center gap-2">
            <Terminal className="w-5 h-5 text-cyber-green" />
            Our Core Mission: Honest Entertainment
          </h2>
          <p className="mb-3">
            Across the web, millions of users search for tools like &quot;phone location tracker&quot;, &quot;Wi-Fi password unblocker&quot;, or &quot;social account unlocker&quot;. Unfortunately, predatory websites often exploit these users by delivering dangerous spyware, deceptive surveys, or fake phishing pages.
          </p>
          <p>
            <strong>HACKVERSE takes the opposite approach:</strong> We build transparent, beautifully designed, and hilarious simulations that allow users to experience cinematic hacker visual effects while educating them on real-world security mechanisms.
          </p>
        </section>

        <section className="p-6 rounded-2xl bg-cyber-card border border-cyber-borderSubtle">
          <h2 className="text-xl font-bold text-white font-mono mb-3 flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyber-cyan" />
            Our Strict Safety Commitments
          </h2>
          <ul className="space-y-3 mt-4">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-cyber-green flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-mono text-xs">Zero Credential Collection</strong>
                <span>We never ask for passwords, OTP verification codes, private cookies, or private tokens.</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-cyber-green flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-mono text-xs">No Real Exploits or Intrusions</strong>
                <span>Our simulators run 100% locally in browser memory. No external servers or real endpoints are scanned or targeted.</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-cyber-green flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-mono text-xs">Transparent Parody & Simulation Disclosures</strong>
                <span>Every tool clearly presents a &quot;SIMULATION ONLY&quot; badge and never claims to have breached actual hardware or private accounts.</span>
              </div>
            </li>
          </ul>
        </section>

        <section className="p-6 rounded-2xl bg-cyber-card border border-cyber-borderSubtle">
          <h2 className="text-xl font-bold text-white font-mono mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyber-purple" />
            Designed for Creators, Gamers, & Tech Enthusiasts
          </h2>
          <p>
            Whether you want to test interactive cybersecurity tools, customize a retro green-phosphor hacker terminal for a movie prop, or evaluate your knowledge against password entropy mathematics, HACKVERSE is your playground.
          </p>

          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyber-green text-black font-mono font-bold text-xs"
            >
              <span>Explore All Simulators</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyber-panel border border-cyber-borderSubtle text-slate-300 font-mono text-xs hover:text-white"
            >
              <span>Get In Touch</span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
