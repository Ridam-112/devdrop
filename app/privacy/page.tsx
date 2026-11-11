import React from "react";
import Link from "next/link";
import { Shield } from "lucide-react";

export const metadata = {
  title: "Privacy Policy — HACKVERSE",
  description: "Read HACKVERSE's comprehensive privacy policy regarding data collection, client-side processing, and advertising standards.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full text-slate-300 text-sm leading-relaxed space-y-6">
      <div className="border-b border-cyber-borderSubtle pb-6 mb-8">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyber-green block mb-2">
          LEGAL & DATA COMPLIANCE
        </span>
        <h1 className="text-3xl font-extrabold text-white font-mono">
          Privacy Policy
        </h1>
        <p className="text-xs text-cyber-muted mt-1 font-mono">
          Last Updated: October 2026 • Effective Immediately
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white font-mono">1. Introduction</h2>
        <p>
          HACKVERSE (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) operates the entertainment website hackverse-sim.vercel.app. We are dedicated to maintaining the highest privacy standards. This Privacy Policy details how information is handled when you visit our website and use our interactive cyber prank and simulation tools.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white font-mono">2. Strict Zero Sensitive Data Collection Policy</h2>
        <p>
          Unlike fraudulent websites, HACKVERSE operates under a strict principle of non-collection for tool inputs:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-slate-300">
          <li><strong>No Passwords or Credentials:</strong> We never prompt for, collect, process, or transmit real passwords, social media access tokens, OTP codes, or session cookies.</li>
          <li><strong>No Geolocation Tracking:</strong> Our satellite tracker and IP trace tools do not track or store your live GPS coordinates. All visual radar outputs are self-contained client-side simulations.</li>
          <li><strong>Client-Side Execution:</strong> All simulation algorithms run ephemerally within your web browser&apos;s JavaScript engine and are never logged on our servers.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white font-mono">3. Information We Collect Automatically</h2>
        <p>
          When accessing our website, standard web server logs may temporarily register generic technical metadata, including your browser user-agent, operating system type, referring URL, and page request timestamps. This data is used solely for traffic analytics, DDoS mitigation, and performance monitoring.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white font-mono">4. Advertising and Third-Party Cookies</h2>
        <p>
          To maintain free access to our simulators, HACKVERSE may display ads served by compliant third-party advertising partners (such as Google AdSense). These third-party vendors may use cookies, web beacons, or similar technologies to serve advertisements based on your prior visits to this and other websites.
        </p>
        <p>
          Users may opt out of personalized advertising by visiting Google&apos;s Ads Settings (<a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-cyber-cyan hover:underline">adssettings.google.com</a>) or via the Network Advertising Initiative opt-out portal (<a href="https://optout.networkadvertising.org" target="_blank" rel="noopener noreferrer" className="text-cyber-cyan hover:underline">optout.networkadvertising.org</a>).
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white font-mono">5. Data Retention & Security</h2>
        <p>
          Because our simulators do not store user-submitted text, phone numbers, or passwords, there is no persistent storage of personal simulation inputs on our systems. We apply modern SSL/TLS cryptographic protocols across all site traffic.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white font-mono">6. Contact for Privacy Matters</h2>
        <p>
          If you have questions regarding this Privacy Policy, please reach out to us via our <Link href="/contact" className="text-cyber-green hover:underline">Contact Page</Link> or email our privacy desk at <code>privacy@hackverse-sim.example.com</code>.
        </p>
      </section>
    </div>
  );
}
