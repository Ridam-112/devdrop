import React from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ShieldCheck,
  Terminal,
  Smartphone,
  Lock,
  Globe,
  KeyRound,
  Activity,
  Wifi,
  Gamepad2,
  DollarSign,
  Skull,
  Eye,
} from "lucide-react";

export const metadata = {
  title: "Disclaimer & Parody Statement — DEVDROP",
  description:
    "Read DEVDROP's comprehensive disclaimer regarding our fictional cyber simulators, visual effects, and educational demonstrations.",
  alternates: {
    canonical: "https://devdrop.vercel.app/disclaimer",
  },
};

export default function DisclaimerPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full text-slate-300 text-sm leading-relaxed space-y-6">
      <div className="border-b border-cyber-borderSubtle pb-6 mb-8">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyber-amber block mb-2">
          LEGAL NOTICE &amp; ENTERTAINMENT PARODY DISCLOSURE
        </span>
        <h1 className="text-3xl font-extrabold text-white font-mono">
          Disclaimer, Simulation &amp; Prank Policy
        </h1>
        <p className="text-xs text-cyber-muted mt-1 font-mono">
          Comprehensive disclosure regarding all tools, algorithms, mock outputs, and operational boundaries on DEVDROP.
        </p>
      </div>

      <div className="p-5 rounded-2xl bg-cyber-card border border-cyber-amber/40 flex items-start gap-3 text-xs leading-relaxed">
        <AlertTriangle className="w-5 h-5 text-cyber-amber flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-white mb-1">
            PRIMARY COMPLIANCE &amp; SIMULATION STATEMENT:
          </p>
          <p>
            DEVDROP (devdrop.vercel.app) is an interactive cybersecurity entertainment, video parody, educational demonstration, and harmless cyber prank platform. <strong>None of the tools, diagnostic scanners, satellite radar sweeps, terminal interfaces, gaming utilities, payment receipt generators, or network consoles on this platform possess actual hacking capabilities or interact with third-party operating systems, banks, networks, or social platforms.</strong>
          </p>
          <p className="mt-2 text-slate-400">
            All tools operate 100% locally in your browser memory as simulated visual interfaces. They are designed for harmless amusement, cinematic media production, and cybersecurity awareness.
          </p>
        </div>
      </div>

      {/* 1. Wi-Fi & Network */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
          <Wifi className="w-5 h-5 text-cyber-green" />
          1. Wi-Fi &amp; Network Tools
        </h2>
        <p>
          The <strong>Wi-Fi Network Penetration Suite</strong>, <strong>WPA Key Decryption Engine</strong>, and <strong>Router Admin Exploit Console</strong> do not access your device&apos;s physical Wi-Fi hardware, place network cards into promiscuous monitor mode, or capture real packets. All discovered networks, handshakes, and recovered keys are purely illustrative mockups generated inside your browser tab.
        </p>
      </section>

      {/* 2. Gaming Tools */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
          <Gamepad2 className="w-5 h-5 text-cyber-cyan" />
          2. Free Fire, BGMI &amp; Gaming Utilities
        </h2>
        <p>
          The <strong>Unknown Cash (UC) Allocator</strong>, <strong>Diamond Air-Drop Resource Loader</strong>, and <strong>Free Fire / BGMI Profile Auditors</strong> are fictional visual generators for gaming video creators and harmless entertainment. They do not connect to Krafton, Tencent, Garena, or any official gaming servers, and they cannot modify game currency, inventory, or player rankings.
        </p>
      </section>

      {/* 3. Financial & Payment Receipt Tools */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-amber-400" />
          3. UPI Payments, Bank Statements &amp; Financial Protocols
        </h2>
        <p>
          The <strong>UPI Payment Transaction Receipt Generator</strong>, <strong>Bank Account Statement Previewer</strong>, and <strong>ATM Cash Dispenser Interface</strong> are design templates for video props and creative mockups. <strong>No real financial institution, bank account, or payment gateway (NPCI, Google Pay, PhonePe, Paytm, SWIFT) is ever contacted or processed.</strong>
        </p>
        <p className="text-amber-400 text-xs font-mono">
          ⚠️ LEGAL WARNING: Using simulated payment screens or bank balance statements to misrepresent transactions to merchants, law enforcement, or individuals is strictly prohibited by our Terms of Service and constitutes criminal fraud under applicable laws.
        </p>
      </section>

      {/* 4. Mobile & Screen Lock */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
          <Smartphone className="w-5 h-5 text-cyber-cyan" />
          4. Smartphone Screen Lock &amp; Location Tracking
        </h2>
        <p>
          The <strong>Smartphone Screen Lock Interface</strong>, <strong>Android Pattern Lock</strong>, and <strong>Satellite Telemetry Triangulator</strong> do not unlock real physical smartphones or track actual GPS locations. Modern smartphones protect user data with hardware security enclaves (Apple Secure Enclave, Samsung Knox, Google Titan M2) and file-based encryption (FBE). If your real phone is locked, visit official Apple or Google customer support.
        </p>
      </section>

      {/* 5. Threat & Malware Simulators */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
          <Skull className="w-5 h-5 text-cyber-red" />
          5. BSOD System Crash &amp; Malware Alert Simulators
        </h2>
        <p>
          The <strong>Windows Blue Screen System Crash (BSOD)</strong> and <strong>Encrypted Files Security Lockdown</strong> are safe visual animations. They contain no destructive payloads, viruses, or ransomware. They do not delete, alter, or encrypt any files on your computer. Users can exit fullscreen simulations at any time by pressing the Escape (ESC) key.
        </p>
      </section>

      {/* 6. Espionage & Secret Agent Tools */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
          <Eye className="w-5 h-5 text-cyan-400" />
          6. Secret Agent Credentials &amp; Self-Destruct
        </h2>
        <p>
          The <strong>Secret Agent Intelligence Credential Card</strong> and <strong>Hardware Self-Destruct Protocol</strong> are novelty parody props for costume parties, video skits, and entertainment. Impersonating intelligence or law enforcement personnel is a violation of law.
        </p>
      </section>

      {/* 7. Zero-Data Retention */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-cyber-green" />
          7. Privacy &amp; Zero-Data Retention
        </h2>
        <p>
          All calculations, visual animations, and inputs on DEVDROP run client-side in your browser. We never collect, transmit, or store passwords, OTPs, telephone numbers, gamer UIDs, or personal credentials.
        </p>
      </section>

      <div className="pt-6 border-t border-cyber-borderSubtle flex items-center justify-between text-xs font-mono">
        <Link href="/tools" className="text-cyber-green hover:underline">
          ← Return to All Tools Directory
        </Link>
        <Link href="/terms" className="text-cyber-cyan hover:underline">
          Read Terms of Service →
        </Link>
      </div>
    </div>
  );
}
