import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import {
  Gamepad2,
  Play,
  Github,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  Code2,
  Cpu,
  Trophy,
  ArrowRight,
  Sparkles,
  Info,
} from "lucide-react";
import { OPEN_SOURCE_GAMES, OpenSourceGame } from "@/lib/data/games";
import { PlayableGameCanvas } from "@/components/games/PlayableGameCanvas";
import { Playable2048 } from "@/components/games/Playable2048";
import { AdvertisementSlot } from "@/components/AdvertisementSlot";

interface Props {
  params: {
    gameSlug: string;
  };
}

export async function generateStaticParams() {
  return OPEN_SOURCE_GAMES.map((g) => ({
    gameSlug: g.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const game = OPEN_SOURCE_GAMES.find((g) => g.slug === params.gameSlug);

  if (!game) {
    return {
      title: "Game Not Found | DEVDROP",
      robots: { index: false, follow: false },
    };
  }

  const canonicalUrl = `https://devdrop.online/games/${game.slug}`;

  return {
    title: game.metaTitle,
    description: game.metaDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title: game.metaTitle,
      description: game.metaDescription,
      url: canonicalUrl,
      siteName: "DEVDROP",
      locale: "en_US",
      type: "website",
      images: [
        {
          url: "https://devdrop.online/og-image.png",
          width: 1200,
          height: 630,
          alt: `${game.name} open source HTML5 game preview`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: game.metaTitle,
      description: game.metaDescription,
    },
  };
}

export default function GameDetailPage({ params }: Props) {
  const game = OPEN_SOURCE_GAMES.find((g) => g.slug === params.gameSlug);

  if (!game) {
    notFound();
  }

  const canonicalUrl = `https://devdrop.online/games/${game.slug}`;
  const relatedGames = OPEN_SOURCE_GAMES.filter(
    (g) => g.slug !== game.slug && (g.genre === game.genre || g.isPlayableDirectly)
  ).slice(0, 3);

  // Structured Data: BreadcrumbList
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://devdrop.online",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Open Source Games",
        item: "https://devdrop.online/games",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: game.name,
        item: canonicalUrl,
      },
    ],
  };

  // Structured Data: VideoGame Schema
  const videoGameJsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    name: game.name,
    headline: game.h1,
    description: game.description,
    genre: game.genre,
    gamePlatform: ["Web Browser", "HTML5 Canvas", "WebGL"],
    applicationCategory: "Game",
    operatingSystem: "All (Modern Web Browsers)",
    browserRequirements: "Requires JavaScript. Requires HTML5 Canvas.",
    url: canonicalUrl,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: game.rating,
      ratingCount: game.ratingCount,
      bestRating: "5",
      worstRating: "1",
    },
  };

  // Structured Data: FAQPage
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: game.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoGameJsonLd) }}
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
          <li>
            <Link href="/games" className="hover:text-cyber-green transition-colors">
              Open Source Games
            </Link>
          </li>
          <li>/</li>
          <li className="text-white font-semibold truncate max-w-[200px] sm:max-w-none">
            {game.name}
          </li>
        </ol>
      </nav>

      {/* Hero Header */}
      <header className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-cyber-green/10 text-cyber-green border border-cyber-green/30">
            {game.genre} Game
          </span>
          <span className="text-[10px] font-mono tracking-wider px-2.5 py-1 rounded bg-cyber-dark text-cyber-cyan border border-cyber-borderSubtle">
            {game.license} License
          </span>
          <span className="text-[10px] font-mono tracking-wider px-2.5 py-1 rounded bg-cyber-card text-cyber-muted border border-cyber-borderSubtle">
            Release: {game.releaseYear}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-mono tracking-tight text-white mb-3 leading-tight">
          {game.h1}
        </h1>

        <p className="text-base sm:text-lg font-mono text-cyber-cyan mb-4">
          {game.tagline}
        </p>

        {/* Self-contained description passage for GEO & Answer Engines */}
        <div className="p-4 sm:p-5 rounded-2xl bg-cyber-card/60 border border-cyber-borderSubtle text-slate-300 font-sans text-sm sm:text-base leading-relaxed max-w-4xl backdrop-blur-md">
          <p>{game.longDescription}</p>
        </div>
      </header>

      {/* Top Banner Ad Placement */}
      <AdvertisementSlot slotId={`game-${game.slug}-top-banner`} format="banner" className="my-6" />

      {/* Game Player Arena Section */}
      <section className="my-8">
        {game.builtInGameType === "2048" ? (
          <Playable2048 />
        ) : game.builtInGameType && game.builtInGameType !== "iframe" ? (
          <PlayableGameCanvas
            gameType={game.builtInGameType}
            gameName={game.name}
          />
        ) : (
          /* External Open-Source Game Launcher Arena */
          <div className="w-full bg-cyber-card border border-cyber-border rounded-2xl p-6 sm:p-10 text-center shadow-2xl relative overflow-hidden backdrop-blur-md">
            <div className="absolute top-0 right-0 w-80 h-80 bg-cyber-green/5 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-2xl mx-auto space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan flex items-center justify-center mx-auto shadow-lg shadow-cyber-cyan/20">
                <Gamepad2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-2xl font-bold font-mono text-white">
                  Launch {game.name} in Web Browser
                </h3>
                <p className="text-xs sm:text-sm text-cyber-muted font-sans mt-2 leading-relaxed">
                  This game runs directly in any modern browser via open web technologies. No native downloads, software installs, or accounts are required.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                <a
                  href={game.liveDemoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyber-green to-emerald-400 text-black font-mono font-black text-sm uppercase tracking-wider hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-neon-green/40 hover:scale-105"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Launch Live Game</span>
                  <ExternalLink className="w-4 h-4 ml-1" />
                </a>

                <a
                  href={game.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-cyber-dark hover:bg-cyber-card border border-cyber-borderSubtle text-slate-200 hover:text-white font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                >
                  <Github className="w-4 h-4" />
                  <span>Inspect Source Code</span>
                </a>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-4 text-xs font-mono text-cyber-muted border-t border-cyber-borderSubtle/60">
                <span className="flex items-center gap-1.5 text-cyber-green">
                  <ShieldCheck className="w-4 h-4" />
                  <span>100% Free Open Source</span>
                </span>
                <span>•</span>
                <span>License: {game.license}</span>
                <span>•</span>
                <span>Engine: {game.techStack.join(" + ")}</span>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Game Details, Controls, and Specifications Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 my-12">
        {/* Main Content (Features & How to play) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Key Features */}
          <section className="bg-cyber-card/40 border border-cyber-borderSubtle rounded-2xl p-6">
            <h2 className="text-xl font-bold font-mono text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyber-green" />
              <span>Key Game Features & Engine Capabilities</span>
            </h2>
            <ul className="space-y-3 font-sans text-sm text-slate-300">
              {game.features.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-cyber-green shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* How to Play Guide */}
          <section className="bg-cyber-card/40 border border-cyber-borderSubtle rounded-2xl p-6">
            <h2 className="text-xl font-bold font-mono text-white mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-cyber-cyan" />
              <span>How to Play & Strategic Rules</span>
            </h2>
            <ol className="space-y-3 font-sans text-sm text-slate-300 list-decimal list-inside">
              {game.howToPlay.map((step, idx) => (
                <li key={idx} className="leading-relaxed">
                  <span className="text-slate-200">{step}</span>
                </li>
              ))}
            </ol>
          </section>

          {/* Controls Matrix */}
          <section className="bg-cyber-card/40 border border-cyber-borderSubtle rounded-2xl p-6">
            <h2 className="text-xl font-bold font-mono text-white mb-4 flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-cyber-green" />
              <span>Game Controls & Key Bindings</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {game.controls.map((ctrl, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-cyber-dark/80 border border-cyber-borderSubtle flex items-center justify-between font-mono text-xs"
                >
                  <span className="px-2 py-1 rounded bg-cyber-card border border-cyber-borderSubtle text-cyber-cyan font-bold">
                    {ctrl.key}
                  </span>
                  <span className="text-slate-300 text-right">{ctrl.action}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Technical FAQs */}
          <section className="bg-cyber-card/40 border border-cyber-borderSubtle rounded-2xl p-6">
            <h2 className="text-xl font-bold font-mono text-white mb-4 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-cyber-green" />
              <span>Frequently Asked Questions</span>
            </h2>
            <div className="space-y-4">
              {game.faqs.map((faq, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-cyber-dark/60 border border-cyber-borderSubtle/60 space-y-1.5">
                  <h3 className="text-sm font-bold font-mono text-white">
                    {faq.question}
                  </h3>
                  <p className="text-xs text-cyber-muted font-sans leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar Information & Related Games */}
        <aside className="space-y-6">
          {/* Tech Specs Card */}
          <div className="bg-cyber-card border border-cyber-borderSubtle rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-cyber-green font-mono text-xs font-bold uppercase">
              <Code2 className="w-4 h-4" />
              <span>Technical Specifications</span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-cyber-borderSubtle">
                <span className="text-cyber-muted">Genre</span>
                <span className="text-white font-bold">{game.genre}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-cyber-borderSubtle">
                <span className="text-cyber-muted">License</span>
                <span className="text-cyber-green font-bold">{game.license}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-cyber-borderSubtle">
                <span className="text-cyber-muted">Release Year</span>
                <span className="text-white">{game.releaseYear}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-cyber-borderSubtle">
                <span className="text-cyber-muted">Rating</span>
                <span className="text-yellow-400 font-bold">★ {game.rating} / 5</span>
              </div>
              <div>
                <span className="text-cyber-muted block mb-1.5">Technologies</span>
                <div className="flex flex-wrap gap-1">
                  {game.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 rounded bg-cyber-dark text-[10px] text-slate-300 border border-cyber-borderSubtle"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <a
              href={game.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full mt-4 py-2.5 px-4 rounded-xl bg-cyber-dark hover:bg-cyber-card border border-cyber-borderSubtle hover:border-cyber-green text-xs font-mono font-bold text-white flex items-center justify-center gap-2 transition-all"
            >
              <Github className="w-4 h-4" />
              <span>GitHub Repository</span>
            </a>
          </div>

          {/* Sidebar Ad Placement */}
          <AdvertisementSlot slotId={`game-${game.slug}-sidebar`} format="rectangle" />

          {/* Related Open-Source Games */}
          {relatedGames.length > 0 && (
            <div className="bg-cyber-card border border-cyber-borderSubtle rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
                <Gamepad2 className="w-4 h-4 text-cyber-green" />
                <span>Related Open-Source Games</span>
              </h3>
              <div className="space-y-3">
                {relatedGames.map((rel) => (
                  <Link
                    key={rel.slug}
                    href={`/games/${rel.slug}`}
                    className="block p-3 rounded-xl bg-cyber-dark/80 hover:bg-cyber-card border border-cyber-borderSubtle hover:border-cyber-cyan transition-all group"
                  >
                    <div className="text-xs font-bold font-mono text-white group-hover:text-cyber-cyan transition-colors">
                      {rel.name}
                    </div>
                    <div className="text-[11px] font-sans text-cyber-muted mt-0.5 line-clamp-1">
                      {rel.tagline}
                    </div>
                  </Link>
                ))}
              </div>
              <Link
                href="/games"
                className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-mono text-cyber-green hover:underline pt-2 font-bold"
              >
                <span>View All Open Source Games</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </aside>
      </div>

      {/* Bottom Ad Placement */}
      <AdvertisementSlot slotId={`game-${game.slug}-bottom`} format="horizontal" className="my-8" />
    </article>
  );
}
