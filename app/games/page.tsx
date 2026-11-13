import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import {
  Gamepad2,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  Code2,
  Cpu,
  Flame,
  ArrowRight,
} from "lucide-react";
import { OPEN_SOURCE_GAMES } from "@/lib/data/games";
import { GamesClient } from "@/components/games/GamesClient";
import { AdvertisementSlot } from "@/components/AdvertisementSlot";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Play Free HTML5 & 3D Browser Games Online | DevDrop",
  description:
    "Play free HTML5 and 3D browser games with zero downloads. Enjoy flight simulators, retro arcade classics, 2048, sports games, and puzzles directly in your browser.",
  alternates: {
    canonical: `${SITE_URL}/games`,
  },
  openGraph: {
    title: "Play Free HTML5 & 3D Browser Games Online | DevDrop",
    description:
      "Play free browser games online with zero downloads. Explore flight simulators, 3D racers, 2048, and classic arcade titles.",
    url: `${SITE_URL}/games`,
    siteName: "DevDrop",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Free HTML5 & 3D Browser Games on DevDrop",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Play Free HTML5 & 3D Browser Games Online | DevDrop",
    description:
      "Play free browser games online with zero downloads. Explore flight simulators, 3D racers, 2048, and classic arcade titles.",
  },
};

export default function GamesHubPage() {
  const canonicalUrl = `${SITE_URL}/games`;

  // Structured Data: BreadcrumbList
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Browser Games",
        item: canonicalUrl,
      },
    ],
  };

  // Structured Data: CollectionPage & ItemList of VideoGames
  const gamesCollectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Free Online HTML5 & 3D Browser Games Directory",
    headline: "Play Free HTML5 & 3D Browser Games Online",
    description:
      "Curated index of playable HTML5 Canvas, WebGL, and verified open-source web games.",
    url: canonicalUrl,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: OPEN_SOURCE_GAMES.length,
      itemListElement: OPEN_SOURCE_GAMES.map((game, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "VideoGame",
          name: game.name,
          headline: game.h1,
          description: game.description,
          genre: game.genre,
          operatingSystem: "All (Web Browser)",
          gamePlatform: ["Web Browser", "HTML5 Canvas", "WebGL"],
          url: `${SITE_URL}/games/${game.slug}`,
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
        },
      })),
    },
  };

  // Structured Data: FAQPage
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What are online open source HTML5 games?",
        answer:
          "Online open source HTML5 games are video games built with open web standards (HTML5 Canvas, WebGL, WebAssembly, and JavaScript) whose underlying source code is released publicly under permissive licenses like MIT or GPL. They can be played instantly in any modern web browser without downloads, installation, or account registration.",
      },
      {
        "@type": "Question",
        name: "Are these open source games safe to play in browser?",
        answer:
          "Yes, completely. Because they run in standard web browser sandboxes using client-side JavaScript and HTML5 Canvas, they do not execute native machine binaries or require administrative device privileges. Furthermore, their open-source nature means anyone can audit their codebase on GitHub for privacy and security.",
      },
      {
        "@type": "Question",
        name: "Where are these open source games sourced from?",
        answer:
          "The games in this directory are cataloged from premier open-source gaming repositories, primarily the bobeff/open-source-games GitHub compilation and independent open-source developers worldwide.",
      },
      {
        "@type": "Question",
        name: "Can I inspect the source code and build my own version?",
        answer:
          "Yes! Every game listed includes a direct link to its official GitHub or git source code repository, enabling developers, students, and indie game creators to learn, fork, and contribute.",
      },
    ],
  };

  return (
    <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Structured Data Script Tags */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(gamesCollectionJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center gap-2 text-xs font-mono text-cyber-muted">
          <li>
            <Link href="/" className="hover:text-cyber-green transition-colors">
              Home
            </Link>
          </li>
          <li>/</li>
          <li className="text-white font-semibold">Browser Games</li>
        </ol>
      </nav>

      {/* Hero Header Section */}
      <header className="mb-8 relative">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-[10px] uppercase font-mono font-bold tracking-widest px-2.5 py-1 rounded bg-cyber-green/10 text-cyber-green border border-cyber-green/30">
            Browser Gaming Hub
          </span>
          <span className="text-[10px] uppercase font-mono tracking-wider px-2.5 py-1 rounded bg-cyber-dark text-cyber-muted border border-cyber-borderSubtle">
            HTML5 Canvas &amp; WebGL 3D
          </span>
          <span className="text-[10px] uppercase font-mono tracking-wider px-2.5 py-1 rounded bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/30">
            Zero Download Required
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-mono tracking-tight text-white mb-4 leading-tight">
          Play Free HTML5 &amp; 3D Browser Games Online
        </h1>

        {/* Front-loaded self-contained answer block (GEO / Claude-SEO standard) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-cyber-card/60 border border-cyber-borderSubtle text-slate-300 font-sans text-sm sm:text-base leading-relaxed max-w-4xl backdrop-blur-md">
          <p>
            Experience our curated collection of <strong>free online HTML5 and 3D browser games</strong> playable directly in your web browser. Built on modern web standards including <strong>HTML5 Canvas, WebGL, and JavaScript</strong>, these games require zero software downloads, emulators, or accounts. Enjoy fast-paced arcade action, flight simulators, 3D racers, and verified open-source classics like <em>2048</em> and <em>3D Hartwig Chess</em> with instant client-side execution.
          </p>
        </div>

        {/* Quick Highlights Telemetry Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
          <div className="p-3 rounded-xl bg-cyber-dark/80 border border-cyber-borderSubtle text-center font-mono">
            <div className="text-xl sm:text-2xl font-black text-cyber-green">100%</div>
            <div className="text-[10px] text-cyber-muted uppercase mt-0.5">Free to Play</div>
          </div>
          <div className="p-3 rounded-xl bg-cyber-dark/80 border border-cyber-borderSubtle text-center font-mono">
            <div className="text-xl sm:text-2xl font-black text-cyber-cyan">60 FPS</div>
            <div className="text-[10px] text-cyber-muted uppercase mt-0.5">Hardware Accelerated</div>
          </div>
          <div className="p-3 rounded-xl bg-cyber-dark/80 border border-cyber-borderSubtle text-center font-mono">
            <div className="text-xl sm:text-2xl font-black text-white">0 MB</div>
            <div className="text-[10px] text-cyber-muted uppercase mt-0.5">No Downloads</div>
          </div>
          <div className="p-3 rounded-xl bg-cyber-dark/80 border border-cyber-borderSubtle text-center font-mono">
            <div className="text-xl sm:text-2xl font-black text-cyber-green">HTML5</div>
            <div className="text-[10px] text-cyber-muted uppercase mt-0.5">Open Web Standards</div>
          </div>
        </div>
      </header>

      {/* Top Banner Ad Slot */}
      <AdvertisementSlot slotId="games-top-banner" format="banner" className="my-6" />

      {/* Interactive Catalog and Instant Player */}
      <GamesClient />

      {/* Educational & Technical SEO Guide Section */}
      <section className="mt-16 pt-12 border-t border-cyber-borderSubtle space-y-12">
        {/* Article: Why Open Source HTML5 Gaming Matters */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tight">
              Why Play Open Source HTML5 Games Online?
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed font-sans">
              Unlike commercial web portals filled with deceptive download links, pay-to-win mechanics, and aggressive tracking cookies, <strong>open-source browser games</strong> are created by passionate developers and game archivists for the joy of computing and software preservation.
            </p>
            <p className="text-sm text-slate-300 leading-relaxed font-sans">
              By using modern web standards such as <strong>HTML5 Canvas 2D, WebGL 3D, and WebAssembly (Wasm)</strong>, these games run at native desktop speeds directly inside Chrome, Firefox, Safari, and Edge. Whether you are on a high-end gaming PC, a school Chromebook, or an iPhone, the experience is instant, lightweight, and completely private.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-xl bg-cyber-card/40 border border-cyber-borderSubtle space-y-1.5">
                <div className="flex items-center gap-2 text-cyber-green font-mono font-bold text-xs uppercase">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Zero Bloat & Telemetry</span>
                </div>
                <p className="text-xs text-cyber-muted font-sans leading-relaxed">
                  Games execute locally in your browser memory without installing intrusive software or collecting personal identifying information.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-cyber-card/40 border border-cyber-borderSubtle space-y-1.5">
                <div className="flex items-center gap-2 text-cyber-cyan font-mono font-bold text-xs uppercase">
                  <Code2 className="w-4 h-4" />
                  <span>Inspect & Learn the Code</span>
                </div>
                <p className="text-xs text-cyber-muted font-sans leading-relaxed">
                  Every game links directly to its GitHub repository. Study game loops, collision math, and WebGL shaders authored by seasoned engineers.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar Info Card */}
          <div className="bg-cyber-card border border-cyber-borderSubtle rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-cyber-green font-mono text-xs font-bold uppercase mb-2">
                <Cpu className="w-4 h-4" />
                <span>Under The Hood</span>
              </div>
              <h3 className="text-base font-bold font-mono text-white mb-2">
                Supported Game Technologies
              </h3>
              <ul className="text-xs font-mono text-cyber-muted space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyber-green" />
                  <span>HTML5 2D Canvas (60 FPS rendering)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyber-cyan" />
                  <span>WebGL / Three.js (3D acceleration)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                  <span>WebAssembly (Compiled C/C++/Rust)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  <span>Web Audio API (Procedural sound fx)</span>
                </li>
              </ul>
            </div>

            <div className="pt-6 border-t border-cyber-borderSubtle/60 mt-6">
              <Link
                href="/tools"
                className="w-full py-2.5 px-4 rounded-xl bg-cyber-dark hover:bg-cyber-green text-slate-200 hover:text-black font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all border border-cyber-borderSubtle hover:border-cyber-green"
              >
                <span>Browse Cyber Diagnostic Tools</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Frequently Asked Questions Section */}
        <section aria-label="Frequently Asked Questions" className="pt-8 border-t border-cyber-borderSubtle">
          <div className="flex items-center gap-2 mb-6">
            <HelpCircle className="w-6 h-6 text-cyber-green" />
            <h2 className="text-2xl font-extrabold font-mono text-white">
              Frequently Asked Questions (HTML5 Gaming)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-cyber-card/40 border border-cyber-borderSubtle space-y-2">
              <h3 className="text-base font-bold font-mono text-white">
                What are online open source HTML5 games?
              </h3>
              <p className="text-xs text-cyber-muted font-sans leading-relaxed">
                Online open source HTML5 games are video games built with open web standards (HTML5 Canvas, WebGL, WebAssembly, and JavaScript) whose underlying source code is released publicly under permissive licenses like MIT or GPL. They can be played instantly in any modern web browser without downloads, installation, or account registration.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-cyber-card/40 border border-cyber-borderSubtle space-y-2">
              <h3 className="text-base font-bold font-mono text-white">
                Are these open source games safe to play in my browser?
              </h3>
              <p className="text-xs text-cyber-muted font-sans leading-relaxed">
                Yes, completely. Because they run in standard web browser sandboxes using client-side JavaScript and HTML5 Canvas, they do not execute native machine binaries or require administrative device privileges. Furthermore, their open-source nature means anyone can audit their codebase on GitHub for privacy and security.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-cyber-card/40 border border-cyber-borderSubtle space-y-2">
              <h3 className="text-base font-bold font-mono text-white">
                Where are these open source games sourced from?
              </h3>
              <p className="text-xs text-cyber-muted font-sans leading-relaxed">
                The games in this directory are cataloged from premier open-source gaming repositories, primarily the <code>bobeff/open-source-games</code> GitHub compilation and independent open-source developers worldwide.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-cyber-card/40 border border-cyber-borderSubtle space-y-2">
              <h3 className="text-base font-bold font-mono text-white">
                Can I inspect the source code and build my own version?
              </h3>
              <p className="text-xs text-cyber-muted font-sans leading-relaxed">
                Yes! Every game listed includes a direct link to its official GitHub or git source code repository, enabling developers, students, and indie game creators to learn, fork, and contribute.
              </p>
            </div>
          </div>
        </section>
      </section>

      {/* Bottom Ad Placement */}
      <AdvertisementSlot slotId="games-bottom-banner" format="horizontal" className="mt-12" />
    </article>
  );
}
