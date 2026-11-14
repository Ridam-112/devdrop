"use client";

import React, { useState, useId } from "react";
import Link from "next/link";
import {
  Gamepad2,
  Play,
  Github,
  ExternalLink,
  Search,
  Sparkles,
  Trophy,
  Code2,
  ShieldCheck,
  CheckCircle2,
  Filter,
  Flame,
  Terminal,
  HelpCircle,
} from "lucide-react";
import { OPEN_SOURCE_GAMES, GAME_GENRES, OpenSourceGame } from "@/lib/data/games";
import { PlayableGameCanvas } from "@/components/games/PlayableGameCanvas";
import { Playable2048 } from "@/components/games/Playable2048";
import { AdvertisementSlot } from "@/components/AdvertisementSlot";

export const GamesClient: React.FC = () => {
  const [selectedGenre, setSelectedGenre] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [onlyDirectlyPlayable, setOnlyDirectlyPlayable] = useState(false);

  // Active quick play modal state
  const [activePlayGame, setActivePlayGame] = useState<OpenSourceGame | null>(null);

  const searchInputId = useId();

  const filteredGames = OPEN_SOURCE_GAMES.filter((game) => {
    const matchesGenre = selectedGenre === "All" || game.genre === selectedGenre;
    const matchesPlayable = !onlyDirectlyPlayable || game.isPlayableDirectly;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      q === "" ||
      game.name.toLowerCase().includes(q) ||
      game.tagline.toLowerCase().includes(q) ||
      game.genre.toLowerCase().includes(q) ||
      game.techStack.some((t) => t.toLowerCase().includes(q));

    return matchesGenre && matchesPlayable && matchesSearch;
  });

  return (
    <div className="w-full">
      {/* Search and Category Filter Toolbar */}
      <div className="bg-cyber-card/70 border border-cyber-border rounded-2xl p-4 sm:p-6 mb-8 backdrop-blur-md shadow-xl">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Genre Badges / Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
            {GAME_GENRES.map((genre) => {
              const isSelected = selectedGenre === genre;
              return (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-mono whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-cyber-green text-black font-bold shadow-neon-green/30"
                      : "bg-cyber-dark/80 text-cyber-muted hover:text-white hover:bg-cyber-card border border-cyber-borderSubtle"
                  }`}
                >
                  {genre === "All" && <Sparkles className="w-3.5 h-3.5" />}
                  <span>{genre}</span>
                </button>
              );
            })}
          </div>

          {/* Search bar & Playable toggle */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            <button
              onClick={() => setOnlyDirectlyPlayable(!onlyDirectlyPlayable)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all flex items-center gap-2 border ${
                onlyDirectlyPlayable
                  ? "bg-cyber-cyan/20 border-cyber-cyan text-cyber-cyan font-bold"
                  : "bg-cyber-dark/80 border-cyber-borderSubtle text-cyber-muted hover:text-white"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${onlyDirectlyPlayable ? "bg-cyber-cyan animate-pulse" : "bg-cyber-muted"}`} />
              <span>Instant In-Browser Only</span>
            </button>

            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-cyber-muted" />
              <input
                id={searchInputId}
                type="text"
                placeholder="Search game, canvas, genre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-cyber-dark/90 border border-cyber-borderSubtle rounded-xl text-xs font-mono text-white placeholder-cyber-muted/50 focus:outline-none focus:border-cyber-green transition-all"
              />
            </div>
          </div>
        </div>

        {/* Counter telemetry */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-cyber-borderSubtle/50 text-xs font-mono text-cyber-muted">
          <div className="flex items-center gap-2">
            <span>SHOWING:</span>
            <span className="text-white font-bold">{filteredGames.length}</span>
            <span>OF {OPEN_SOURCE_GAMES.length} ORIGINAL BROWSER GAMES</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-cyber-green">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>100% Free Client-Side Browser Games</span>
          </div>
        </div>
      </div>

      {/* Featured Instant Play Section */}
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <Flame className="w-5 h-5 text-cyber-green animate-pulse" />
          <h2 className="text-xl sm:text-2xl font-black font-mono text-white tracking-tight">
            Featured Playable Browser Games
          </h2>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyber-green/20 text-cyber-green border border-cyber-green/40">
            60 FPS In-Browser
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Chaos Skies 3D */}
          <div className="bg-cyber-card border border-cyber-border hover:border-cyber-green/50 rounded-2xl p-5 shadow-xl transition-all group flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyber-green/10 text-cyber-green border border-cyber-green/30">
                  3D DOGFIGHT SIMULATOR
                </span>
                <span className="text-xs font-mono text-cyber-muted">Free-to-Play</span>
              </div>
              <h3 className="text-lg font-bold font-mono text-white group-hover:text-cyber-green transition-colors">
                Chaos Skies 3D
              </h3>
              <p className="text-xs text-cyber-muted font-sans mt-1 line-clamp-2">
                High-octane 3D aerial combat simulator built with Three.js. Pilot your jet through canyon rings, lock onto enemy squadrons, and engage in frantic dogfights at 60 FPS.
              </p>
              <div className="flex flex-wrap gap-1.5 my-3">
                {["Three.js", "WebGL", "HTML5 Canvas", "Web Audio API"].map((tech) => (
                  <span key={tech} className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyber-dark text-slate-300 border border-cyber-borderSubtle">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3 mt-4 pt-3 border-t border-cyber-borderSubtle/60">
              <button
                onClick={() =>
                  setActivePlayGame(
                    OPEN_SOURCE_GAMES.find((g) => g.slug === "chaos-skies-3d") || null
                  )
                }
                className="flex-1 py-2.5 px-4 rounded-xl bg-cyber-green text-black font-mono font-bold text-xs uppercase tracking-wider hover:bg-cyber-green/90 transition-all flex items-center justify-center gap-2 shadow-neon-green/30"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Play Now</span>
              </button>
              <Link
                href="/games/chaos-skies-3d"
                className="py-2.5 px-4 rounded-xl bg-cyber-dark hover:bg-cyber-card border border-cyber-borderSubtle text-xs font-mono text-slate-300 hover:text-white transition-all flex items-center justify-center"
              >
                Game Guide
              </Link>
            </div>
          </div>

          {/* Card 2: Fruit Slice Master */}
          <div className="bg-cyber-card border border-cyber-border hover:border-cyber-cyan/50 rounded-2xl p-5 shadow-xl transition-all group flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/30">
                  ARCADE SLASHER
                </span>
                <span className="text-xs font-mono text-cyber-muted">Free-to-Play</span>
              </div>
              <h3 className="text-lg font-bold font-mono text-white group-hover:text-cyber-cyan transition-colors">
                Fruit Slice Master
              </h3>
              <p className="text-xs text-cyber-muted font-sans mt-1 line-clamp-2">
                Swipe your blade across juicy flying clay fruits and slice multi-fruit combos while dodging lethal bombs! High-speed tactile physics and particle splashes.
              </p>
              <div className="flex flex-wrap gap-1.5 my-3">
                {["HTML5 Canvas", "JavaScript", "Touch Physics", "Procedural Audio"].map((tech) => (
                  <span key={tech} className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyber-dark text-slate-300 border border-cyber-borderSubtle">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3 mt-4 pt-3 border-t border-cyber-borderSubtle/60">
              <button
                onClick={() =>
                  setActivePlayGame(
                    OPEN_SOURCE_GAMES.find((g) => g.slug === "fruit-slice-master") || null
                  )
                }
                className="flex-1 py-2.5 px-4 rounded-xl bg-cyber-cyan text-black font-mono font-bold text-xs uppercase tracking-wider hover:bg-cyber-cyan/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyber-cyan/20"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Play Now</span>
              </button>
              <Link
                href="/games/fruit-slice-master"
                className="py-2.5 px-4 rounded-xl bg-cyber-dark hover:bg-cyber-card border border-cyber-borderSubtle text-xs font-mono text-slate-300 hover:text-white transition-all flex items-center justify-center"
              >
                Game Guide
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mid-Page Ad Placement */}
      <AdvertisementSlot slotId="games-catalog-mid-banner" format="horizontal" className="my-8" />

      {/* Complete Open-Source Game Directory Grid */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black font-mono text-white tracking-tight flex items-center gap-2">
              <Gamepad2 className="w-6 h-6 text-cyber-green" />
              <span>DevDrop Browser Games Directory</span>
            </h2>
            <p className="text-xs sm:text-sm text-cyber-muted font-mono mt-1">
              46 original 3D &amp; HTML5 games built with Canvas, WebGL &amp; Three.js.
            </p>
          </div>
        </div>

        {filteredGames.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGames.map((game) => (
              <div
                key={game.slug}
                className="bg-cyber-card/60 border border-cyber-borderSubtle hover:border-cyber-green/50 rounded-2xl p-5 flex flex-col justify-between transition-all group hover:shadow-xl hover:shadow-cyber-green/5 relative overflow-hidden"
              >
                <div>
                  {/* Header badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyber-dark text-cyber-green border border-cyber-green/30 font-bold uppercase">
                      {game.genre}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyber-card border border-cyber-borderSubtle text-cyber-muted">
                      {game.license}
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <Link href={`/games/${game.slug}`}>
                    <h3 className="text-base font-bold font-mono text-white group-hover:text-cyber-green transition-colors line-clamp-1">
                      {game.name}
                    </h3>
                  </Link>
                  <p className="text-xs text-cyber-cyan font-mono mt-0.5 line-clamp-1">
                    {game.tagline}
                  </p>

                  <p className="text-xs text-cyber-muted font-sans mt-2.5 line-clamp-3 leading-relaxed">
                    {game.description}
                  </p>

                  {/* Tech stack pills */}
                  <div className="flex flex-wrap gap-1.5 my-3.5">
                    {game.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyber-dark/80 text-slate-300 border border-cyber-borderSubtle"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer action buttons */}
                <div className="pt-3 border-t border-cyber-borderSubtle/60 flex items-center gap-2 mt-2">
                  {game.isPlayableDirectly ? (
                    <button
                      onClick={() => setActivePlayGame(game)}
                      className="flex-1 py-2 px-3 rounded-xl bg-cyber-green/10 hover:bg-cyber-green text-cyber-green hover:text-black font-mono font-bold text-xs uppercase tracking-wider border border-cyber-green/40 hover:border-cyber-green transition-all flex items-center justify-center gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Play Now</span>
                    </button>
                  ) : (
                    <a
                      href={game.liveDemoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2 px-3 rounded-xl bg-cyber-cyan/10 hover:bg-cyber-cyan text-cyber-cyan hover:text-black font-mono font-bold text-xs uppercase tracking-wider border border-cyber-cyan/40 hover:border-cyber-cyan transition-all flex items-center justify-center gap-1.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Launch Game</span>
                    </a>
                  )}

                  <Link
                    href={`/games/${game.slug}`}
                    className="p-2 rounded-xl bg-cyber-dark hover:bg-cyber-card border border-cyber-borderSubtle text-cyber-muted hover:text-white transition-colors"
                    title="View Detailed Specs & Guide"
                  >
                    <Code2 className="w-4 h-4" />
                  </Link>

                  <a
                    href={game.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-cyber-dark hover:bg-cyber-card border border-cyber-borderSubtle text-cyber-muted hover:text-white transition-colors"
                    title="View GitHub Source Repository"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center font-mono text-sm text-cyber-muted bg-cyber-card/30 rounded-2xl border border-cyber-borderSubtle">
            No browser games matched your search criteria.
          </div>
        )}
      </section>

      {/* Quick Play Modal */}
      {activePlayGame && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-cyber-card border border-cyber-border rounded-2xl p-4 sm:p-6 shadow-2xl relative text-left overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-cyber-borderSubtle mb-4">
              <div className="flex items-center gap-2">
                <Gamepad2 className="w-5 h-5 text-cyber-green" />
                <h3 className="text-base sm:text-lg font-bold font-mono text-white">
                  {activePlayGame.name}
                </h3>
              </div>
              <button
                onClick={() => setActivePlayGame(null)}
                className="text-cyber-muted hover:text-white font-mono text-lg px-2"
              >
                ✕
              </button>
            </div>

            {/* Embedded Game Canvas / Player */}
            {activePlayGame.builtInGameType === "2048" ? (
              <Playable2048 />
            ) : activePlayGame.builtInGameType === "iframe" && activePlayGame.iframeUrl ? (
              <div className="w-full h-[550px] sm:h-[650px] rounded-xl overflow-hidden border border-cyber-green/40 bg-black relative">
                <iframe
                  src={activePlayGame.iframeUrl}
                  title={activePlayGame.name}
                  className="w-full h-full border-0 block"
                  allow="fullscreen; autoplay; accelerometer; gyroscope; gamepad"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            ) : activePlayGame.builtInGameType && activePlayGame.builtInGameType !== "iframe" ? (
              <PlayableGameCanvas
                gameType={activePlayGame.builtInGameType}
                gameName={activePlayGame.name}
              />
            ) : null}

            {/* Modal Footer link */}
            <div className="mt-4 pt-3 border-t border-cyber-borderSubtle/60 flex items-center justify-between text-xs font-mono text-cyber-muted">
              <span>License: {activePlayGame.license}</span>
              <Link
                href={`/games/${activePlayGame.slug}`}
                onClick={() => setActivePlayGame(null)}
                className="text-cyber-cyan hover:underline flex items-center gap-1"
              >
                <span>Read Full Game Guide & FAQs</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
