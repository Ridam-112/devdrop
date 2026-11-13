const fs = require('fs');

const indexableSlugs = new Set([
  'chaos-skies-3d',
  'fruit-slice-master',
  'endless-runner-clay',
  'balloon-pop-frenzy',
  'brick-breaker-clay',
  'mini-car-racing-circuit',
  'moto-traffic-rider-3d',
  'car-parking-simulator-3d',
  'no-brakes-desi-bus-3d',
  'sledge-rider-3d',
  'space-defender-html5',
  'cyber-snake-html5',
  '2048-html5-open-source',
  'neon-breakout-html5',
  'clumsy-bird-html5',
  'hexgl-3d-racing',
  'browserquest-html5',
  'sandboxels-physics-sandbox',
  'freeciv-web-html5',
  '3d-hartwig-chess'
]);

// Author and source metadata mapping
const gameMeta = {
  'chaos-skies-3d': {
    author: 'DevDrop Team',
    sourceUrl: 'https://github.com/Ridam-112/devdrop',
    license: 'MIT / Open Source',
    lastmod: '2026-11-10',
    tips: [
      'Use afterburners in short bursts to save fuel while closing distance to bogies.',
      'Deploy thermal flares the moment incoming missile radar alert tones reach maximum pitch.',
      'Perform barrel rolls to break hard radar missile locks.'
    ]
  },
  'fruit-slice-master': {
    author: 'DevDrop Team',
    sourceUrl: 'https://github.com/Ridam-112/devdrop',
    license: 'MIT / Open Source',
    lastmod: '2026-11-08',
    tips: [
      'Wait for multiple fruits to reach peak trajectory before slicing to trigger combo multipliers.',
      'Avoid slashing wildly near bottom corners where bombs spawn unexpectedly.',
      'Slice freeze bananas to slow down game physics for effortless combos.'
    ]
  },
  'endless-runner-clay': {
    author: 'DevDrop Team',
    sourceUrl: 'https://github.com/Ridam-112/devdrop',
    license: 'MIT / Open Source',
    lastmod: '2026-11-07',
    tips: [
      'Keep your eyes on oncoming hazards two tiles ahead rather than directly under your character.',
      'Save your jump boosts for multi-tier spikes.',
      'Slide early when approaching hanging overhangs.'
    ]
  },
  'balloon-pop-frenzy': {
    author: 'DevDrop Team',
    sourceUrl: 'https://github.com/Ridam-112/devdrop',
    license: 'MIT / Open Source',
    lastmod: '2026-11-06',
    tips: [
      'Prioritize golden balloons for temporary double points multipliers.',
      'Never pop skull balloons as they penalize your lives.',
      'Use wide swipe gestures on mobile to burst clustered balloon flotillas.'
    ]
  },
  'brick-breaker-clay': {
    author: 'DevDrop Team',
    sourceUrl: 'https://github.com/Ridam-112/devdrop',
    license: 'MIT / Open Source',
    lastmod: '2026-11-06',
    tips: [
      'Angle the ball off the edges of your paddle to hit tight corner bricks.',
      'Catch multi-ball capsules to clear dense stone layers quickly.',
      'Aim to lodge the ball above the ceiling bricks for rapid rebound damage.'
    ]
  },
  'mini-car-racing-circuit': {
    author: 'DevDrop Team',
    sourceUrl: 'https://github.com/Ridam-112/devdrop',
    license: 'MIT / Open Source',
    lastmod: '2026-11-05',
    tips: [
      'Brake slightly before entering sharp hairpins to maintain traction.',
      'Follow the inside apex on turns to shave tenths of a second off lap times.',
      'Draft behind rivals on long straights to build slipstream velocity.'
    ]
  },
  'moto-traffic-rider-3d': {
    author: 'DevDrop Team',
    sourceUrl: 'https://github.com/Ridam-112/devdrop',
    license: 'MIT / Open Source',
    lastmod: '2026-11-08',
    tips: [
      'Ride in the center dotted lane to react swiftly to cars merging from either side.',
      'Near-miss passes at high speeds award bonus nitro charge.',
      'Tap brakes early when brake lights on preceding SUVs flash.'
    ]
  },
  'car-parking-simulator-3d': {
    author: 'DevDrop Team',
    sourceUrl: 'https://github.com/Ridam-112/devdrop',
    license: 'MIT / Open Source',
    lastmod: '2026-11-04',
    tips: [
      'Switch between top-down camera and chase view when reversing into parallel slots.',
      'Align your rear bumper with the obstacle marker before turning full lock.',
      'Crawl at slow speeds to avoid boundary penalty points.'
    ]
  },
  'no-brakes-desi-bus-3d': {
    author: 'DevDrop Team',
    sourceUrl: 'https://github.com/Ridam-112/devdrop',
    license: 'MIT / Open Source',
    lastmod: '2026-11-09',
    tips: [
      'Counter-steer through highway curves to prevent top-heavy bus rollovers.',
      'Sound the musical horn to clear autorickshaws and cattle from the fast lane.',
      'Use steep uphill grades to naturally decelerate if highway traffic halts.'
    ]
  },
  'sledge-rider-3d': {
    author: 'DevDrop Team',
    sourceUrl: 'https://github.com/Ridam-112/devdrop',
    license: 'MIT / Open Source',
    lastmod: '2026-11-09',
    tips: [
      'Time your jumps over icy cliffs to maintain forward downhill momentum.',
      'Avoid dark gray rocks which shatter the wooden runners on impact.',
      'Collect pine cones and snow crystals to unlock custom painted sledges.'
    ]
  },
  'space-defender-html5': {
    author: 'bobeff & Open-Source Contributors',
    sourceUrl: 'https://github.com/bobeff/open-source-games',
    license: 'MIT',
    lastmod: '2026-11-03',
    tips: [
      'Focus fire on elite command ships before they deploy homing drones.',
      'Collect blue shield orbs to absorb stray plasma impacts.',
      'Stay near the bottom center for the broadest lateral firing arc.'
    ]
  },
  'cyber-snake-html5': {
    author: 'bobeff & Open-Source Contributors',
    sourceUrl: 'https://github.com/bobeff/open-source-games',
    license: 'MIT',
    lastmod: '2026-11-02',
    tips: [
      'Circle the exterior boundary perimeter once your tail reaches over 40 nodes.',
      'Never cut through the center grid when moving at boosted speeds.',
      'Plan your turning corridor before gobbling bonus data packets.'
    ]
  },
  '2048-html5-open-source': {
    author: 'Gabriele Cirulli',
    sourceUrl: 'https://github.com/gabrielecirulli/2048',
    license: 'MIT',
    lastmod: '2026-11-01',
    tips: [
      'Anchor your highest value tile permanently in one corner (e.g. bottom-right).',
      'Never swipe in the direction opposite to your corner anchor.',
      'Keep your rows monotonically descending to facilitate chain merges.'
    ]
  },
  'neon-breakout-html5': {
    author: 'bobeff & Open-Source Contributors',
    sourceUrl: 'https://github.com/bobeff/open-source-games',
    license: 'MIT',
    lastmod: '2026-11-02',
    tips: [
      'Keep the ball bouncing near the ceiling to trigger multi-hit chain reactions.',
      'Expand paddle powerups should be prioritized over laser upgrades.',
      'Watch ball velocity increases after clearing high-density brick lines.'
    ]
  },
  'clumsy-bird-html5': {
    author: 'Ellison Leao',
    sourceUrl: 'https://github.com/ellisonleao/clumsy-bird',
    license: 'GPL-3.0',
    lastmod: '2026-11-01',
    tips: [
      'Tap in steady, rhythmic cadences rather than reactive panic flaps.',
      'Aim for the lower half of pipe gaps to account for upward wing lift.',
      'Stay calm between pipe sets to reset your visual center.'
    ]
  },
  'hexgl-3d-racing': {
    author: 'Thibaut Despoulain (BKcore)',
    sourceUrl: 'https://github.com/BKcore/HexGL',
    license: 'MIT / CC BY-NC 3.0',
    lastmod: '2026-11-04',
    tips: [
      'Hit green boost pads consistently to maintain supersonic cruising velocity.',
      'Use air-brakes on high-angle chicanes to prevent scraping track guardrails.',
      'Watch your ship shield integrity meter on high-speed track segments.'
    ]
  },
  'browserquest-html5': {
    author: 'Mozilla Foundation & Little Workshop',
    sourceUrl: 'https://github.com/mozilla/BrowserQuest',
    license: 'MPL-2.0 / CC BY-SA 3.0',
    lastmod: '2026-11-03',
    tips: [
      'Defeat forest bats and rats early to upgrade from cloth rags to leather armor.',
      'Lure cave skeletons one at a time to prevent getting overwhelmed.',
      'Drink red health potions before engaging boss gargoyles.'
    ]
  },
  'sandboxels-physics-sandbox': {
    author: 'R74n',
    sourceUrl: 'https://github.com/R74nCom/sandboxels',
    license: 'GPL-3.0',
    lastmod: '2026-11-05',
    tips: [
      'Mix oil and fire to experiment with atmospheric convection currents.',
      'Use glass or bedrock boundaries to contain high-temperature radioactive reactions.',
      'Explore the hidden elements menu to uncover exotic chemical interactions.'
    ]
  },
  'freeciv-web-html5': {
    author: 'Freeciv-web Contributors',
    sourceUrl: 'https://github.com/freeciv/freeciv-web',
    license: 'GPL-2.0 / AGPL-3.0',
    lastmod: '2026-11-05',
    tips: [
      'Establish your first city on river tiles or coastal grasslands for optimal food yields.',
      'Prioritize Bronze Working and Iron Working for early military deterrence.',
      'Send triremes along coastlines to discover trade partners and boost scientific output.'
    ]
  },
  '3d-hartwig-chess': {
    author: 'Julien Garnier',
    sourceUrl: 'https://github.com/juliangarnier/3D-Hartwig-chess-set',
    license: 'MIT',
    lastmod: '2026-11-02',
    tips: [
      'Rotate the 3D board view to spot diagonal bishop threats obscured by perspective.',
      'Control the 4 center squares early with your geometric pawns.',
      'Castle early to tuck your King into safety.'
    ]
  }
};

// Trademark renamings
const trademarkRenames = {
  'command-and-conquer-html5': {
    name: 'Tactical Warfare RTS (HTML5)',
    h1: 'Tactical Warfare RTS: Classic Real-Time Strategy HTML5',
    tagline: 'Classic command base building, tank production & tactical warfare in browser'
  },
  'duckhunt-javascript-html5': {
    name: 'Marshland Bird Hunt (JavaScript)',
    h1: 'Marshland Bird Hunt: Classic Target Arcade HTML5',
    tagline: 'Test your target reflexes in this classic marshland hunting arcade game'
  },
  'blockrain-tetris-html5': {
    name: 'Blockrain Falling Blocks HTML5',
    h1: 'Blockrain Falling Blocks: Arcade Brick Puzzle HTML5',
    tagline: 'Rotate and slot falling blocks to clear rows and score high'
  },
  'beyblade-spin-battle-2d': {
    name: 'Spin Top Battle 2D',
    h1: 'Spin Top Battle 2D: Physics Combat Arena',
    tagline: 'High-speed spinning tops collision battle arena in 2D physics'
  },
  'micropolis-js': {
    name: 'MicropolisJS City Simulator',
    h1: 'MicropolisJS: Open-Source City Construction Simulator',
    tagline: 'Classic open-source municipal city planning, zoning & disaster simulator'
  }
};

let content = fs.readFileSync('lib/data/games.ts', 'utf8');

// Update OpenSourceGame interface
const interfaceTarget = `export interface OpenSourceGame {
  slug: string;
  name: string;
  tagline: string;
  h1: string;
  genre: "Action" | "Strategy" | "Simulation" | "Puzzle" | "Arcade" | "Shooter" | "RPG" | "Racing" | "Sports" | "Boardgame";
  description: string;
  longDescription: string;
  techStack: string[];
  license: string;
  githubUrl: string;
  liveDemoUrl: string;
  isPlayableDirectly: boolean;
  builtInGameType?: "space-defender" | "cyber-snake" | "2048" | "neon-breakout" | "clumsy-bird" | "iframe";
  iframeUrl?: string;
  features: string[];
  howToPlay: string[];
  controls: GameControl[];
  metaTitle: string;
  metaDescription: string;
  rating?: number;
  ratingCount?: number;
  badge?: string;
  releaseYear: number;
  faqs: GameFaq[];
}`;

const interfaceReplacement = `export interface OpenSourceGame {
  slug: string;
  name: string;
  tagline: string;
  h1: string;
  genre: "Action" | "Strategy" | "Simulation" | "Puzzle" | "Arcade" | "Shooter" | "RPG" | "Racing" | "Sports" | "Boardgame";
  description: string;
  longDescription: string;
  techStack: string[];
  license: string;
  githubUrl: string;
  liveDemoUrl: string;
  isPlayableDirectly: boolean;
  builtInGameType?: "space-defender" | "cyber-snake" | "2048" | "neon-breakout" | "clumsy-bird" | "iframe";
  iframeUrl?: string;
  features: string[];
  howToPlay: string[];
  controls: GameControl[];
  metaTitle: string;
  metaDescription: string;
  rating?: number;
  ratingCount?: number;
  badge?: string;
  releaseYear: number;
  faqs: GameFaq[];
  sourceUrl?: string;
  author?: string;
  indexable?: boolean;
  tips?: string[];
  lastmod?: string;
}`;

if (content.includes(interfaceTarget)) {
  content = content.replace(interfaceTarget, interfaceReplacement);
} else {
  console.log('Interface target not matched directly, inspecting interface...');
}

// Parse OPEN_SOURCE_GAMES array
const match = content.match(/export const OPEN_SOURCE_GAMES: OpenSourceGame\[\] = (\[[\s\S]*?\]);\s*$/);
if (!match) {
  console.error('Could not match OPEN_SOURCE_GAMES array!');
  process.exit(1);
}

const games = eval(match[1]);
console.log(`Auditing and updating ${games.length} games...`);

let indexableCount = 0;
let noindexCount = 0;

games.forEach(game => {
  // Check trademark renames
  if (trademarkRenames[game.slug]) {
    const ren = trademarkRenames[game.slug];
    game.name = ren.name;
    game.h1 = ren.h1;
    game.tagline = ren.tagline;
  }

  if (indexableSlugs.has(game.slug)) {
    game.indexable = true;
    indexableCount++;
    const meta = gameMeta[game.slug] || {};
    game.author = meta.author || 'Open-Source Contributors';
    game.sourceUrl = meta.sourceUrl || game.githubUrl;
    game.license = meta.license || game.license || 'MIT / Open Source';
    game.lastmod = meta.lastmod || '2026-11-05';
    game.tips = meta.tips || [
      'Take advantage of fluid browser controls for smoother gameplay.',
      'Pause and plan your movements on high-difficulty segments.',
      'Check keybindings matrix below for custom hotkeys.'
    ];
  } else {
    game.indexable = false;
    noindexCount++;
    game.sourceUrl = game.githubUrl;
    if (!game.author) {
      if (game.githubUrl.includes('bobeff')) game.author = 'bobeff & community';
      else if (game.githubUrl.includes('Ridam-112')) game.author = 'DevDrop Contributors';
      else game.author = 'Open-Source Authors';
    }
  }
});

console.log(`Set ${indexableCount} games to indexable: true, and ${noindexCount} games to indexable: false.`);

const updatedArrayStr = JSON.stringify(games, null, 2);
const updatedContent = content.slice(0, match.index) + `export const OPEN_SOURCE_GAMES: OpenSourceGame[] = ${updatedArrayStr};\n`;

fs.writeFileSync('lib/data/games.ts', updatedContent, 'utf8');
console.log('lib/data/games.ts successfully updated!');
