import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Terms of Service — DEVDROP",
  description: "Review the Terms of Service governing access and acceptable use of the DEVDROP platform.",
  alternates: {
    canonical: "https://devdrop.online/terms",
  },
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full text-slate-300 text-sm leading-relaxed space-y-6">
      <div className="border-b border-cyber-borderSubtle pb-6 mb-8">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyber-green block mb-2">
          USER AGREEMENT
        </span>
        <h1 className="text-3xl font-extrabold text-white font-mono">
          Terms of Service
        </h1>
        <p className="text-xs text-cyber-muted mt-1 font-mono">
          Last Updated: October 2026
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white font-mono">1. Acceptance of Terms</h2>
        <p>
          By accessing or using DEVDROP (devdrop.vercel.app), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any part of these terms, you are prohibited from using or accessing this site.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white font-mono">2. Nature of Service: Entertainment, Prank &amp; Parody Only</h2>
        <p>
          DEVDROP provides simulated, fictional, and educational cybersecurity experiences designed exclusively for harmless amusement, creative content creation, cyber pranks, and awareness. All outputs, terminal messages, radar sweeps, diagnostic graphs, payment slips, and scan reports are computer-generated mock simulations.
        </p>
        <p>
          <strong>You acknowledge and agree that:</strong>
        </p>
        <ul className="list-disc pl-6 space-y-1.5 text-slate-300">
          <li>Every tool on this platform is a visual simulation designed solely for entertainment and prank purposes.</li>
          <li>None of our tools possess real hacking, intercepting, cracking, balance modifying, or GPS tracking capabilities.</li>
          <li>You will not misrepresent our simulations or mock receipt outputs to third parties to commit fraud, extortion, or deception.</li>
          <li>All tools execute locally inside your web browser sandbox and do not interact with actual remote services or physical devices.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white font-mono">3. Acceptable Use Policy</h2>
        <p>
          You agree to use DEVDROP strictly for lawful, personal, and entertainment purposes. You agree NOT to:
        </p>
        <ul className="list-disc pl-6 space-y-1.5 text-slate-300">
          <li>Use simulated tool outputs to harass, blackmail, extort, or defraud any individual or organization.</li>
          <li>Embed our simulators within phishing emails or malicious web campaigns.</li>
          <li>Attempt to reverse-engineer, exploit, or cause distributed denial of service (DDoS) against our infrastructure.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white font-mono">4. Intellectual Property</h2>
        <p>
          All trademarks, interface designs, original text, sound effects, and code implementations on DEVDROP are the intellectual property of DEVDROP or its licensors.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white font-mono">5. Disclaimer of Warranties & Limitation of Liability</h2>
        <p>
          The materials on DEVDROP are provided on an &apos;as is&apos; basis. DEVDROP makes no warranties, expressed or implied, and hereby disclaims all other warranties including fitness for a particular purpose. In no event shall DEVDROP be liable for any damages arising out of the use or inability to use our simulations.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white font-mono">6. Governing Law & Contact</h2>
        <p>
          For any inquiries concerning these Terms of Service, please reach out through our <Link href="/contact" className="text-cyber-green hover:underline">Contact Page</Link>.
        </p>
      </section>
    </div>
  );
}
