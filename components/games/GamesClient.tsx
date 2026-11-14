"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Gamepad2,
  Play,
  Search,
  LayoutDashboard,
  List,
  Store,
  ShoppingBag,
  Users,
  Bell,
  Star,
  Trophy,
  ChevronRight,
  Zap,
  Settings,
  ExternalLink,
} from "lucide-react";
import { OPEN_SOURCE_GAMES, GAME_GENRES, OpenSourceGame } from "@/lib/data/games";
import { PlayableGameCanvas } from "@/components/games/PlayableGameCanvas";
import { Playable2048 } from "@/components/games/Playable2048";
import { AdvertisementSlot } from "@/components/AdvertisementSlot";

// Game emoji/icon mapping based on genre
const GAME_EMOJIS: Record<string, string[]> = {
  Action: ["✈️", "🚀", "⚔️", "💥", "🎯", "🔥"],
  Arcade: ["👾", "🕹️", "⚡", "🌟", "💎", "🎮"],
  Puzzle: ["🧩", "🎲", "🔮", "💡", "🌀", "🎯"],
  Sports: ["⚽", "🏀", "🏆", "🎾", "⛳", "🏋️"],
  Racing: ["🏎️", "🚗", "⚡", "🏁", "🔥", "💨"],
  Strategy: ["♟️", "🧠", "🗺️", "⚙️", "🎯", "👑"],
  Simulation: ["🌍", "🏙️", "🔬", "🛸", "🌊", "⚗️"],
  Shooter: ["🎯", "💥", "🚀", "⚡", "🔫", "🎮"],
  RPG: ["🧙", "⚔️", "🛡️", "👑", "💫", "🗡️"],
  Boardgame: ["🎲", "♟️", "🃏", "🎯", "🏆", "🎪"],
};

// Gradient backgrounds for game cards
const CARD_GRADIENTS = [
  "from-purple-900 via-purple-800 to-indigo-900",
  "from-green-900 via-emerald-800 to-teal-900",
  "from-blue-900 via-blue-800 to-cyan-900",
  "from-orange-900 via-amber-800 to-yellow-900",
  "from-pink-900 via-rose-800 to-red-900",
  "from-violet-900 via-purple-800 to-fuchsia-900",
  "from-teal-900 via-cyan-800 to-sky-900",
  "from-red-900 via-rose-800 to-pink-900",
];

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "My Dashboard", href: "/games" },
  { icon: List, label: "Game's List", href: "/games" },
  { icon: Store, label: "Explore Store", href: "/games" },
  { icon: ShoppingBag, label: "Purchased", href: "/games" },
  { icon: Users, label: "Friends", href: "/games" },
  { icon: Bell, label: "Notification", href: "/games" },
];

function getGameEmoji(game: OpenSourceGame, index: number): string {
  const emojis = GAME_EMOJIS[game.genre] || GAME_EMOJIS.Arcade;
  return emojis[index % emojis.length];
}

function getCardGradient(index: number): string {
  return CARD_GRADIENTS[index % CARD_GRADIENTS.length];
}

// Leaderboard mock data using game names
const LEADERBOARD_TOP3 = [
  { name: "DevDrop", score: "1200 Pts", avatar: "🥇", rank: 2 },
  { name: "Alex Pro", score: "1400 Pts", avatar: "🥈", rank: 1 },
  { name: "GameKing", score: "1100 Pts", avatar: "🥉", rank: 3 },
];

const LEADERBOARD_REST = [
  { name: "Esther H.", score: "1200 Pts" },
  { name: "Jacob J.", score: "1150 Pts" },
  { name: "Cody F.", score: "1100 Pts" },
  { name: "Ryan A.", score: "1080 Pts" },
];

export const GamesClient: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeNav, setActiveNav] = useState("My Dashboard");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [activePlayGame, setActivePlayGame] = useState<OpenSourceGame | null>(null);
  const [showAllGames, setShowAllGames] = useState(false);

  const filteredGames = OPEN_SOURCE_GAMES.filter((game) => {
    const matchesGenre = selectedGenre === "All" || game.genre === selectedGenre;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      q === "" ||
      game.name.toLowerCase().includes(q) ||
      game.tagline.toLowerCase().includes(q) ||
      game.genre.toLowerCase().includes(q);
    return matchesGenre && matchesSearch;
  });

  const popularGames = OPEN_SOURCE_GAMES.slice(0, 4);
  const displayedGames = showAllGames ? filteredGames : filteredGames.slice(0, 12);

  return (
    <div className="flex min-h-screen bg-[#0d0f1a] rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
      {/* ───── LEFT SIDEBAR ───── */}
      <aside className="hidden lg:flex flex-col w-56 bg-[#0a0c18] border-r border-white/5 py-6 px-3 shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-3 mb-8">
          <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
            <Gamepad2 className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-bold text-base tracking-wide">DevDrop</span>
        </div>

        {/* Nav Items */}
        <nav className="flex flex-col gap-1 flex-1">
          {NAV_ITEMS.map(({ icon: Icon, label }) => {
            const isActive = activeNav === label;
            return (
              <button
                key={label}
                onClick={() => setActiveNav(label)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left w-full ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{label}</span>
              </button>
            );
          })}
        </nav>

        {/* Controller Widget */}
        <div className="mt-auto mx-2 p-3 rounded-2xl bg-gradient-to-b from-[#1a1f35] to-[#0d1020] border border-white/10">
          <p className="text-white/60 text-[11px] font-medium mb-2 text-center">Controller</p>
          <div className="flex items-center justify-center gap-2">
            {/* Circular progress */}
            <div className="relative w-12 h-12">
              <svg viewBox="0 0 36 36" className="w-12 h-12 -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#ffffff10" strokeWidth="3" />
                <circle
                  cx="18" cy="18" r="15.9" fill="none"
                  stroke="#6366f1" strokeWidth="3"
                  strokeDasharray="75 25"
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-indigo-400">75%</span>
            </div>
            {/* Controller icon */}
            <div className="text-3xl opacity-80">🎮</div>
          </div>
          <p className="text-white/40 text-[10px] text-center mt-1">Battery Level</p>
        </div>
      </aside>

      {/* ───── MAIN CONTENT ───── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TOP NAV BAR */}
        <header className="flex items-center gap-4 px-6 py-4 border-b border-white/5 bg-[#0d0f1a]/80 backdrop-blur-sm">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-white/30" />
            <input
              type="text"
              placeholder="Search for games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/60 transition-all"
            />
          </div>

          {/* Genre Pills - compact */}
          <div className="hidden xl:flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {GAME_GENRES.slice(0, 6).map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  selectedGenre === genre
                    ? "bg-indigo-600 text-white"
                    : "bg-white/5 text-white/50 hover:text-white hover:bg-white/10 border border-white/10"
                }`}
              >
                {genre}
              </button>
            ))}
          </div>

          {/* Right side: user avatar + settings */}
          <div className="flex items-center gap-3 ml-auto shrink-0">
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1.5">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">D</div>
              <div className="hidden sm:block">
                <p className="text-xs font-semibold text-white leading-none">DevDrop</p>
                <p className="text-[10px] text-white/40">@devdrop.gg</p>
              </div>
              <ChevronRight className="w-3 h-3 text-white/30" />
            </div>
            <button className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* BODY: main + right leaderboard */}
        <div className="flex flex-1 overflow-auto">
          {/* CENTER CONTENT */}
          <main className="flex-1 p-6 space-y-8 min-w-0">

            {/* ── POPULAR GAMES ── */}
            <section>
              <h2 className="text-white font-bold text-lg mb-4">Popular Games</h2>
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                {popularGames.map((game, i) => (
                  <div
                    key={game.slug}
                    className={`relative rounded-2xl overflow-hidden bg-gradient-to-br ${getCardGradient(i)} p-4 flex flex-col items-center cursor-pointer group transition-transform hover:-translate-y-1 hover:shadow-2xl`}
                    onClick={() => game.isPlayableDirectly ? setActivePlayGame(game) : undefined}
                  >
                    {/* Badge */}
                    <div className="absolute top-2 left-2 right-2 flex justify-center">
                      <span className="text-[9px] font-bold uppercase tracking-wider bg-black/30 text-white/70 px-2 py-0.5 rounded-full backdrop-blur-sm">
                        New Released
                      </span>
                    </div>

                    {/* Game Emoji Art */}
                    <div className="mt-6 mb-3 text-6xl drop-shadow-2xl group-hover:scale-110 transition-transform duration-300">
                      {getGameEmoji(game, i)}
                    </div>

                    {/* Stars */}
                    <div className="flex items-center gap-1 mb-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-white text-xs font-bold">{game.rating || 4.7}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-white font-bold text-sm text-center leading-tight line-clamp-1">{game.name}</h3>
                    <p className="text-white/50 text-[10px] text-center mt-0.5 line-clamp-1">{game.genre}</p>

                    {/* Play Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (game.isPlayableDirectly) {
                          setActivePlayGame(game);
                        } else {
                          window.open(game.liveDemoUrl, "_blank");
                        }
                      }}
                      className="mt-3 w-full py-1.5 rounded-xl text-[11px] font-bold text-white transition-all group-hover:scale-105"
                      style={{
                        background: i === 0 ? "#ef4444" : i === 1 ? "#22c55e" : i === 2 ? "#3b82f6" : "#f97316",
                        boxShadow: `0 4px 15px ${i === 0 ? "rgba(239,68,68,0.4)" : i === 1 ? "rgba(34,197,94,0.4)" : i === 2 ? "rgba(59,130,246,0.4)" : "rgba(249,115,22,0.4)"}`,
                      }}
                    >
                      ▶ Play Now
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Ad Slot */}
            <AdvertisementSlot slotId="games-nixtendo-mid" format="banner" className="rounded-2xl overflow-hidden" />

            {/* ── QUEST REWARDS + FEATURED BANNER ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Quest Rewards */}
              <div className="lg:col-span-2">
                <h2 className="text-white font-bold text-lg mb-4">🎯 More Games</h2>
                <div className="grid grid-cols-2 gap-3">
                  {filteredGames.slice(4, 8).map((game, i) => {
                    const pts = [39, 56, 40, 60][i];
                    const emoji = getGameEmoji(game, i + 2);
                    const colors = ["from-blue-900/60 to-indigo-900/60", "from-pink-900/60 to-rose-900/60", "from-green-900/60 to-emerald-900/60", "from-yellow-900/60 to-amber-900/60"];
                    return (
                      <div
                        key={game.slug}
                        className={`relative rounded-2xl bg-gradient-to-br ${colors[i]} border border-white/10 p-4 flex items-center gap-3 cursor-pointer hover:border-white/20 transition-all group`}
                        onClick={() => game.isPlayableDirectly ? setActivePlayGame(game) : window.open(game.liveDemoUrl, "_blank")}
                      >
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-bold text-sm leading-tight line-clamp-2">{game.name}</h4>
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-yellow-400 text-[10px]">●</span>
                            <span className="text-white/60 text-[10px] font-medium">{pts} Points</span>
                          </div>
                          <div className="flex items-center gap-1 mt-1.5">
                            <div className="flex -space-x-1">
                              {["👤", "👤", "👤"].map((u, ui) => (
                                <span key={ui} className="w-4 h-4 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-[8px]">{u}</span>
                              ))}
                            </div>
                            <span className="text-white/40 text-[10px]">20+ joined</span>
                          </div>
                        </div>
                        <div className="text-3xl shrink-0">{emoji}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Featured / Join and Earn Banner */}
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-teal-800 via-emerald-700 to-cyan-800 border border-teal-500/30 flex flex-col items-center justify-center p-6 min-h-[200px]">
                <div className="absolute inset-0 opacity-20" style={{backgroundImage: "radial-gradient(circle at 50% 50%, #22d3ee 0%, transparent 70%)"}} />
                <div className="relative text-center">
                  <div className="text-5xl mb-3">🎮</div>
                  <h3 className="text-white font-bold text-base leading-tight">Join and Earn<br />Rewards</h3>
                  <p className="text-teal-200/70 text-xs mt-1 mb-3">Ultimate Open World</p>
                  <Link
                    href="/games"
                    className="inline-block px-4 py-2 bg-orange-500 hover:bg-orange-400 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-orange-500/30"
                  >
                    Play Now
                  </Link>
                </div>
              </div>
            </div>

            {/* ── ALL GAMES GRID ── */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white font-bold text-lg flex items-center gap-2">
                  <Gamepad2 className="w-5 h-5 text-indigo-400" />
                  All Browser Games
                  <span className="text-xs font-normal text-white/40 ml-1">({filteredGames.length})</span>
                </h2>
                {/* Genre filter */}
                <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none max-w-sm">
                  {GAME_GENRES.slice(0, 5).map((genre) => (
                    <button
                      key={genre}
                      onClick={() => setSelectedGenre(genre)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-all ${
                        selectedGenre === genre
                          ? "bg-indigo-600 text-white"
                          : "bg-white/5 text-white/40 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                {displayedGames.map((game, i) => (
                  <div
                    key={game.slug}
                    className={`relative rounded-2xl bg-gradient-to-br ${getCardGradient(i + 4)} border border-white/5 hover:border-white/20 p-3 flex flex-col cursor-pointer group transition-all hover:-translate-y-0.5 hover:shadow-xl`}
                    onClick={() => game.isPlayableDirectly ? setActivePlayGame(game) : undefined}
                  >
                    {/* Genre badge */}
                    <span className="text-[9px] font-bold uppercase tracking-wider text-white/50 mb-1">{game.genre}</span>

                    {/* Emoji art */}
                    <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">{getGameEmoji(game, i)}</div>

                    {/* Stars */}
                    <div className="flex items-center gap-0.5 mb-1">
                      {[...Array(5)].map((_, si) => (
                        <Star key={si} className={`w-2.5 h-2.5 ${si < Math.floor(game.rating || 4) ? "fill-yellow-400 text-yellow-400" : "text-white/20"}`} />
                      ))}
                    </div>

                    {/* Title */}
                    <h3 className="text-white font-bold text-xs leading-tight line-clamp-2 flex-1">{game.name}</h3>
                    <p className="text-white/40 text-[10px] mt-0.5 line-clamp-1">{game.tagline.split("–")[0].split("—")[0].trim()}</p>

                    {/* Play button */}
                    <div className="flex gap-1.5 mt-2.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (game.isPlayableDirectly) setActivePlayGame(game);
                          else window.open(game.liveDemoUrl, "_blank");
                        }}
                        className="flex-1 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold flex items-center justify-center gap-1 transition-all"
                      >
                        <Play className="w-2.5 h-2.5 fill-current" />
                        Play
                      </button>
                      <Link
                        href={`/games/${game.slug}`}
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-all flex items-center justify-center"
                        title="Game Details"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Show More / Less */}
              {filteredGames.length > 12 && (
                <div className="text-center mt-6">
                  <button
                    onClick={() => setShowAllGames(!showAllGames)}
                    className="px-6 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-all shadow-lg shadow-indigo-600/30"
                  >
                    {showAllGames ? "Show Less" : `Show All ${filteredGames.length} Games`}
                  </button>
                </div>
              )}
            </section>

            {/* Bottom Ad */}
            <AdvertisementSlot slotId="games-nixtendo-bottom" format="horizontal" className="rounded-2xl overflow-hidden mt-4" />
          </main>

          {/* ───── RIGHT LEADERBOARD SIDEBAR ───── */}
          <aside className="hidden xl:flex flex-col w-64 shrink-0 border-l border-white/5 bg-[#0a0c18] p-5 gap-6">
            <div>
              <h3 className="text-white font-bold text-base mb-4 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-400" />
                Leaderboard
              </h3>

              {/* Top 3 Podium */}
              <div className="flex items-end justify-center gap-2 mb-5 h-28">
                {/* 2nd place */}
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 border-2 border-slate-300 flex items-center justify-center text-lg mb-1">D</div>
                  <p className="text-white/70 text-[10px] font-medium text-center leading-tight">{LEADERBOARD_TOP3[0].name}</p>
                  <div className="mt-1 w-14 h-10 bg-slate-600/60 rounded-t-lg flex items-center justify-center">
                    <span className="text-slate-300 text-xs font-bold">2nd</span>
                  </div>
                  <p className="text-[9px] text-white/40 mt-1">{LEADERBOARD_TOP3[0].score}</p>
                </div>
                {/* 1st place */}
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 border-2 border-yellow-300 flex items-center justify-center text-xl mb-1">A</div>
                  <p className="text-white/70 text-[10px] font-medium text-center leading-tight">{LEADERBOARD_TOP3[1].name}</p>
                  <div className="mt-1 w-16 h-14 bg-indigo-600/60 rounded-t-lg flex items-center justify-center">
                    <span className="text-yellow-300 text-xs font-bold">1st</span>
                  </div>
                  <p className="text-[9px] text-white/40 mt-1">{LEADERBOARD_TOP3[1].score}</p>
                </div>
                {/* 3rd place */}
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 border-2 border-amber-500 flex items-center justify-center text-lg mb-1">G</div>
                  <p className="text-white/70 text-[10px] font-medium text-center leading-tight">{LEADERBOARD_TOP3[2].name}</p>
                  <div className="mt-1 w-14 h-8 bg-amber-700/60 rounded-t-lg flex items-center justify-center">
                    <span className="text-amber-300 text-xs font-bold">3rd</span>
                  </div>
                  <p className="text-[9px] text-white/40 mt-1">{LEADERBOARD_TOP3[2].score}</p>
                </div>
              </div>

              {/* Rest of leaderboard */}
              <div className="space-y-2">
                {LEADERBOARD_REST.map((player, i) => (
                  <div key={player.name} className="flex items-center gap-2.5 py-2 px-3 rounded-xl bg-white/5 hover:bg-white/8 transition-colors">
                    <span className="text-white/30 text-xs font-mono w-4 text-center">{i + 4}</span>
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500/50 to-purple-600/50 border border-white/10 flex items-center justify-center text-xs font-bold text-white/70">
                      {player.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white/80 text-xs font-medium leading-none truncate">{player.name}</p>
                    </div>
                    <span className="text-indigo-400 text-[10px] font-bold shrink-0">{player.score}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Genre Quick Filter */}
            <div>
              <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-indigo-400" />
                Quick Filter
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {GAME_GENRES.map((genre) => (
                  <button
                    key={genre}
                    onClick={() => setSelectedGenre(genre)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                      selectedGenre === genre
                        ? "bg-indigo-600 text-white"
                        : "bg-white/5 text-white/40 hover:text-white hover:bg-white/10 border border-white/8"
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/20">
              <h4 className="text-white/70 text-xs font-medium mb-3">Game Stats</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-white/50 text-xs">Total Games</span>
                  <span className="text-indigo-400 font-bold text-sm">{OPEN_SOURCE_GAMES.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/50 text-xs">Instant Play</span>
                  <span className="text-green-400 font-bold text-sm">{OPEN_SOURCE_GAMES.filter(g => g.isPlayableDirectly).length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/50 text-xs">Genres</span>
                  <span className="text-purple-400 font-bold text-sm">{GAME_GENRES.length - 1}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* ───── QUICK PLAY MODAL ───── */}
      {activePlayGame && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="w-full max-w-3xl bg-[#0d0f1a] border border-indigo-500/30 rounded-2xl shadow-2xl shadow-indigo-500/20 overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{getGameEmoji(activePlayGame, 0)}</span>
                <div>
                  <h3 className="text-white font-bold">{activePlayGame.name}</h3>
                  <span className="text-white/40 text-xs">{activePlayGame.genre}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/games/${activePlayGame.slug}`}
                  onClick={() => setActivePlayGame(null)}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-400 text-xs font-medium transition-all"
                >
                  Full Page
                </Link>
                <button
                  onClick={() => setActivePlayGame(null)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all text-sm"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Game Canvas */}
            <div className="p-4">
              {activePlayGame.builtInGameType === "2048" ? (
                <Playable2048 />
              ) : activePlayGame.builtInGameType === "iframe" && activePlayGame.iframeUrl ? (
                <div className="w-full h-[520px] rounded-xl overflow-hidden border border-indigo-500/20 bg-black">
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
