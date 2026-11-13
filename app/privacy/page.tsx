import React from "react";
import Link from "next/link";
import { Shield } from "lucide-react";
import { SITE_URL } from "@/lib/constants";

export const metadata = {
  title: "Privacy Policy — DevDrop",
  description:
    "Read DevDrop's privacy policy regarding client-side processing, external AI API disclosures, advertising, and data safety.",
  alternates: {
    canonical: `${SITE_URL}/privacy`,
  },
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full text-neutral-300 text-sm leading-relaxed space-y-6">
      <div className="border-b border-neutral-800 pb-6 mb-8">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 block mb-2">
          LEGAL &amp; DATA COMPLIANCE
        </span>
        <h1 className="text-3xl font-extrabold text-white font-mono">
          Privacy Policy
        </h1>
        <p className="text-xs text-neutral-400 mt-1 font-mono">
          Last Updated: November 2026 • Effective Immediately
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white font-mono">1. Introduction</h2>
        <p>
          DevDrop (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) operates the free online utilities and browser games website at <strong className="text-white">https://devdrop.online</strong>. We are committed to upholding rigorous privacy standards. This Privacy Policy details how data is handled when you visit our website and use our web utilities.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white font-mono">2. Client-Side Processing Architecture</h2>
        <p>
          Whenever technologically feasible, DevDrop utilities run 100% inside your client-side browser sandbox using native JavaScript, HTML5 Canvas, and WebAssembly APIs:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-neutral-300">
          <li><strong>Image Compression:</strong> Photos and graphics are resized and quantized locally in your device memory. They are never uploaded to any server.</li>
          <li><strong>PDF Compilation &amp; Image-to-PDF:</strong> Documents and receipts are rendered and compiled directly in your browser. Files remain strictly on your device.</li>
          <li><strong>QR Code &amp; Barcode Generators:</strong> Standard static QR codes and Code 128 barcodes are drawn on local HTML5 canvas elements.</li>
          <li><strong>Developer Tools (JSON, Base64, Hashing, UUID, Password):</strong> All text parsing, hashing (MD5, SHA-256), and encryption operations execute locally in browser memory.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white font-mono">3. Photo Background Remover &amp; External AI Processing</h2>
        <p>
          For the Photo Background Remover tool, image subject segmentation can be processed via the Remove.bg AI API over encrypted SSL/TLS connections:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-neutral-300">
          <li>Images submitted for AI cutout are transmitted securely to the official Remove.bg API endpoint solely for processing and returning the transparent PNG.</li>
          <li>Uploaded images are not permanently retained, logged for marketing, or used to train artificial intelligence models.</li>
          <li>If an external API key is not configured, the tool falls back to a browser-based client-side color-clustering algorithm.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white font-mono">4. Information Collected Automatically</h2>
        <p>
          When accessing DevDrop, standard server logs and CDN providers (e.g. Vercel) may log standard technical metadata, including your IP address, browser user-agent, operating system, referring URL, and page request timestamps. This data is used solely for performance monitoring, DDoS mitigation, and traffic reliability.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white font-mono">5. Advertising &amp; Third-Party Cookies</h2>
        <p>
          To keep DevDrop free without charging fees or requiring paid subscriptions, we may display advertising served by compliant partners (such as Google AdSense). These advertising vendors may use cookies, web beacons, or local storage to serve ads based on prior visits to this and other websites across the Internet.
        </p>
        <p>
          You can opt out of personalized advertising by visiting Google&apos;s Ads Settings (<a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">adssettings.google.com</a>) or via the Network Advertising Initiative opt-out portal (<a href="https://optout.networkadvertising.org" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">optout.networkadvertising.org</a>).
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white font-mono">6. Contact for Privacy Matters</h2>
        <p>
          For any privacy questions, security disclosures, or data queries, please contact our privacy desk directly via our <Link href="/contact" className="text-emerald-400 hover:underline">Contact Page</Link> or by email at <a href="mailto:support@devdrop.online" className="text-emerald-400 hover:underline">support@devdrop.online</a>.
        </p>
      </section>
    </div>
  );
}
