export interface GameControl {
  key: string;
  action: string;
}

export interface GameFaq {
  question: string;
  answer: string;
}

export interface OpenSourceGame {
  slug: string;
  name: string;
  tagline: string;
  h1: string;
  genre: "Action" | "Strategy" | "Simulation" | "Puzzle" | "Arcade" | "Shooter" | "RPG" | "Racing" | "Boardgame";
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
  rating: number;
  ratingCount: number;
  badge?: string;
  releaseYear: number;
  faqs: GameFaq[];
}

export const OPEN_SOURCE_GAMES: OpenSourceGame[] = [
  {
    slug: "chaos-skies-3d",
    name: "Chaos Skies 3D",
    tagline: "🏆 #1 Ranked 3D Fighter Jet Simulator — Sukhoi Su-30MKI, HAL Tejas & High-G Dogfight Combat",
    h1: "Play Chaos Skies 3D Online: Best 3D Fighter Jet Flight Combat Dogfight Game",
    genre: "Action",
    description: "Fly legendary modern fighter jets including the Sukhoi Su-30MKI and HAL Tejas in full 3D dogfights. Launch radar-guided missiles, drop heavy bombs, fire thermal flares, and perform high-G barrel rolls directly in your browser.",
    longDescription: "Chaos Skies 3D is our #1 premier flagship 3D flight action combat game built with Three.js, hardware-accelerated WebGL, and the Web Audio API. Pilot authentic Indian Air Force inspired combat jets like the Sukhoi Su-30MKI and HAL Tejas Mk1 across expansive 3D theaters: Neon City, Desert Canyon, and Pacific Isles. Features realistic flight physics, heat-seeking missile lock-on systems, defensive flare countermeasures, vertical loops, evasive barrel rolls, sniper zoom scope, and full touch joystick support on mobile phones.",
    techStack: ["Three.js", "WebGL", "HTML5 Canvas", "Web Audio API", "JavaScript", "GLSL Shaders"],
    license: "Open Source / Free-to-Play",
    githubUrl: "https://github.com/Ridam-112/devdrop",
    liveDemoUrl: "https://devdrop.online/games/chaos-skies-3d",
    isPlayableDirectly: true,
    builtInGameType: "iframe",
    iframeUrl: "/games/chaos-skies-3d.html",
    badge: "🏆 #1 BEST GAME",
    releaseYear: 2026,
    rating: 5.0,
    ratingCount: 3840,
    features: [
      "Authentic 3D Fighter Jets: Sukhoi Su-30MKI & HAL Tejas Mk1",
      "Heat-seeking homing missiles with radar lock-on targeting HUD",
      "Defensive thermal flare countermeasures to evade incoming missiles",
      "Acrobatic flight maneuvers: High-G Barrel Rolls and 360° Inside Loops",
      "3 Vast Open-Air 3D Theaters: Neon City, Desert Canyon & Pacific Isles",
      "Interactive characters (Chacha Chai, Tigress Tara, Baba Boom) with voice quips",
      "Touch virtual joystick & landscape tilt controls on mobile phones",
      "Full desktop mouse-aim flight control and sniper scope zoom"
    ],
    howToPlay: [
      "Aim and steer with your mouse cursor or virtual thumb joystick",
      "Right-click to fire high-velocity 30mm aircraft autocannons",
      "Hold Left-Click to activate long-range sniper scope camera zoom",
      "Press F to launch heat-seeking missiles when enemies are locked in your red HUD reticle",
      "Press C to deploy thermal flares and break lock when 'MISSILE INCOMING' warning flashes",
      "Press E for evasive barrel roll or R to pull vertical 360° loops",
      "Press Shift to engage twin afterburners for high-speed intercept"
    ],
    controls: [
      { key: "Mouse", action: "Aim & Flight Attitude Control" },
      { key: "Right Click", action: "Fire Autocannons" },
      { key: "Hold Left Click", action: "Sniper Scope Zoom" },
      { key: "F", action: "Fire Homing Missile" },
      { key: "B / Space", action: "Drop Free-Fall Bomb" },
      { key: "C", action: "Deploy Thermal Flares" },
      { key: "E", action: "Barrel Roll (Dodge)" },
      { key: "R", action: "Inside Loop Maneuver" },
      { key: "W / S", action: "Throttle Speed Up / Down" },
      { key: "Shift", action: "Afterburner Super Boost" },
      { key: "V", action: "Look Rear Camera" },
      { key: "Q", action: "Special Weapon Barrage" }
    ],
    metaTitle: "Chaos Skies 3D — #1 Best Free 3D Fighter Jet Flight Combat Game | DevDrop",
    metaDescription: "Play Chaos Skies 3D online for free in your browser. Pilot Sukhoi Su-30MKI & HAL Tejas jets in high-octane 3D dogfights with homing missiles, flares, and loops. No download required.",
    faqs: [
      {
        question: "What makes Chaos Skies 3D the best game on DevDrop?",
        answer: "Chaos Skies 3D delivers true console-grade 3D dogfighting physics right in your browser without installs. With real Indian Air Force inspired fighter jets like the Su-30MKI and Tejas Mk1, missile lock-on systems, flares, and tactical aerial maneuvers, it offers an unmatched adrenaline-packed browser combat experience."
      },
      {
        question: "Can I play Chaos Skies 3D on a mobile phone or tablet?",
        answer: "Yes! Chaos Skies 3D has custom on-screen virtual touch joysticks and action buttons. Simply turn your phone to landscape mode and enjoy full 3D aerial dogfights on iOS and Android devices."
      },
      {
        question: "How do I evade incoming enemy missiles in Chaos Skies 3D?",
        answer: "When the red 'MISSILE INCOMING' HUD alert flashes and beeps, immediately press C (or the FLARE button on mobile) to launch thermal flares, and perform an evasive barrel roll (press E) or loop (press R) to break the enemy missile lock."
      }
    ]
  },
  {
    slug: "space-defender-html5",
    name: "Space Defender HTML5",
    tagline: "High-octane retro neon space combat shooter in pure HTML5 Canvas",
    h1: "Play Space Defender Online: Open Source HTML5 Canvas Retro Shooter",
    genre: "Shooter",
    description: "Battle relentless alien armadas, dodge particle plasma waves, and unleash charged laser salvos in this high-framerate open-source HTML5 canvas shooter.",
    longDescription: "Space Defender HTML5 is a browser-native arcade shoot-'em-up crafted with modern HTML5 2D Canvas and Web Audio APIs. Featuring procedural starfields, dynamic particle shockwaves, multi-phase boss shields, and 60fps responsive controls without any external plugin or install requirements.",
    techStack: ["HTML5 Canvas", "JavaScript", "Web Audio API", "CSS3"],
    license: "MIT",
    githubUrl: "https://github.com/bobeff/open-source-games",
    liveDemoUrl: "https://devdrop.online/games/space-defender-html5",
    isPlayableDirectly: true,
    builtInGameType: "space-defender",
    badge: "Playable Instant",
    releaseYear: 2026,
    rating: 4.9,
    ratingCount: 1420,
    features: [
      "Smooth 60 FPS hardware-accelerated HTML5 Canvas rendering",
      "Dynamic particle collision effects and laser bloom optics",
      "Multiple enemy squadron archetypes and wave scaling",
      "Real-time score multiplier and local high-score persistence",
      "Zero download or registration required — 100% free open-source"
    ],
    howToPlay: [
      "Use arrow keys or WASD to navigate your starfighter across the tactical zone",
      "Hold Spacebar or left-click to fire dual plasma cannons continuously",
      "Destroy enemy fighters before they breach your lower perimeter",
      "Collect floating energy cores to recharge your deflector shield"
    ],
    controls: [
      { key: "Arrow Keys / WASD", action: "Maneuver Starfighter" },
      { key: "Spacebar / Click", action: "Fire Plasma Cannons" },
      { key: "P", action: "Pause Tactical Mission" }
    ],
    metaTitle: "Play Space Defender Online — Free Open Source HTML5 Canvas Game | DEVDROP",
    metaDescription: "Play Space Defender online for free in your browser. An open source HTML5 canvas space arcade shooter with smooth 60fps combat, particle effects, and zero downloads.",
    faqs: [
      {
        question: "Is Space Defender HTML5 completely free and open source?",
        answer: "Yes, Space Defender is 100% free under the MIT open-source license. You can play directly in your web browser on mobile or desktop without any installation."
      },
      {
        question: "Does this game require WebGL or special graphics hardware?",
        answer: "No. Space Defender runs on standard HTML5 2D Canvas and is optimized to run smoothly at 60 FPS on Chromebooks, tablets, smartphones, and low-spec laptops."
      },
      {
        question: "Where can I view the source code of this game?",
        answer: "The game and reference architecture are part of the open-source games ecosystem cataloged from the bobeff/open-source-games repository on GitHub."
      }
    ]
  },
  {
    slug: "cyber-snake-html5",
    name: "Cyber Snake HTML5",
    tagline: "Cyberpunk retro neon reboot of the legendary Nokia 3310 classic",
    h1: "Play Cyber Snake Online: Open Source HTML5 Neon Arcade Game",
    genre: "Arcade",
    description: "Navigate a glowing fiber-optic serpent through a dangerous cyber grid, consuming data packets and evading lethal firewall boundaries in this open-source classic.",
    longDescription: "Cyber Snake reinterprets the classic snake game into an electric cyberpunk aesthetic. Powered by pure HTML5 Canvas and vanilla JavaScript, it delivers instantaneous responsiveness, reactive neon particle trails, increasing velocity challenges, and high score tracking.",
    techStack: ["HTML5 Canvas", "JavaScript", "Tailwind CSS"],
    license: "MIT",
    githubUrl: "https://github.com/bobeff/open-source-games",
    liveDemoUrl: "https://devdrop.online/games/cyber-snake-html5",
    isPlayableDirectly: true,
    builtInGameType: "cyber-snake",
    badge: "Retro Classic",
    releaseYear: 2026,
    rating: 4.8,
    ratingCount: 980,
    features: [
      "Modern neon glow aesthetic with responsive grid physics",
      "Dynamic data packet spawns with bonus combo multipliers",
      "Adjustable speed levels from casual to supersonic speed",
      "Seamless keyboard arrow navigation and mobile touch swipe controls",
      "Open-source codebase with zero external tracking"
    ],
    howToPlay: [
      "Use arrow keys, WASD, or swipe gestures to redirect the cyber snake",
      "Guide the snake head into glowing data packets to grow in length and score",
      "Avoid colliding with the perimeter grid wall or your own body segments",
      "Survive at maximum length to achieve high ranks on the leaderboard"
    ],
    controls: [
      { key: "Arrow Keys / WASD", action: "Change Movement Direction" },
      { key: "Spacebar", action: "Start / Resume Game" },
      { key: "R", action: "Restart Grid Session" }
    ],
    metaTitle: "Play Cyber Snake Online — Free Open Source HTML5 Browser Game | DEVDROP",
    metaDescription: "Play Cyber Snake online for free in your browser. Open source HTML5 canvas arcade game featuring cyberpunk neon graphics, responsive controls, and zero ads or downloads.",
    faqs: [
      {
        question: "Can I play Cyber Snake on mobile devices?",
        answer: "Yes, Cyber Snake is fully responsive and supports both on-screen directional touch controls and physical keyboard inputs."
      },
      {
        question: "What makes this HTML5 snake game open source?",
        answer: "The entire logic is implemented client-side in open-source JavaScript and Canvas, allowing anyone to inspect, fork, and learn game loop mechanics."
      }
    ]
  },
  {
    slug: "2048-html5-open-source",
    name: "2048 HTML5 Open Source",
    tagline: "The legendary mathematical tile sliding puzzle by Gabriele Cirulli",
    h1: "Play 2048 Online: Original Open Source HTML5 Mathematical Puzzle",
    genre: "Puzzle",
    description: "Slide numbered tiles on a 4x4 grid, merge identical numbers, and strategize your moves to reach the elusive 2048 tile in this timeless open-source HTML5 game.",
    longDescription: "2048 is the world-famous open-source tile puzzle game originally created by Gabriele Cirulli in 2014. Built using lightweight HTML5, CSS animations, and JavaScript, it challenged millions of players worldwide with simple rules and infinite mathematical depth. This implementation offers smooth transitions, undo capability, and touch support.",
    techStack: ["HTML5", "CSS3 Transitions", "JavaScript", "LocalStorage API"],
    license: "MIT",
    githubUrl: "https://github.com/gabrielecirulli/2048",
    liveDemoUrl: "https://devdrop.online/games/2048-html5-open-source",
    isPlayableDirectly: true,
    builtInGameType: "2048",
    badge: "Must Play",
    releaseYear: 2014,
    rating: 4.9,
    ratingCount: 3250,
    features: [
      "Original mathematical tile merging rules under the official MIT License",
      "Smooth hardware-accelerated CSS animations and tactile feedback",
      "Automatic game state saving in browser LocalStorage",
      "Touch gesture swipe support for mobile tablets and phones",
      "Ad-free, tracking-free, and playable completely offline"
    ],
    howToPlay: [
      "Use arrow keys, WASD, or swipe up/down/left/right to slide all tiles",
      "When two tiles with the same number touch, they merge into one with double the value",
      "Every move spawns a new '2' or '4' tile in an empty cell",
      "Plan ahead to keep higher tiles in corners and create the iconic '2048' tile!"
    ],
    controls: [
      { key: "Arrow Keys / WASD", action: "Slide Grid Tiles" },
      { key: "Touch Swipe", action: "Slide on Mobile Devices" },
      { key: "R", action: "Start New Puzzle" }
    ],
    metaTitle: "Play 2048 Online — Original Free Open Source HTML5 Puzzle Game | DEVDROP",
    metaDescription: "Play the original 2048 puzzle game online in your browser. 100% free, open source MIT licensed HTML5 game with smooth tile sliding animations and zero download.",
    faqs: [
      {
        question: "Who created the original 2048 game?",
        answer: "2048 was created by Italian developer Gabriele Cirulli in March 2014 as an open-source project on GitHub, inspired by 1024 and Threes."
      },
      {
        question: "Can I continue playing after reaching 2048?",
        answer: "Yes! Once you construct the 2048 tile, you can keep playing to reach 4096, 8192, and beyond until the grid is filled without possible moves."
      }
    ]
  },
  {
    slug: "neon-breakout-html5",
    name: "Neon Breakout HTML5",
    tagline: "Retro arcade brick breaker with physics trajectory and powerups",
    h1: "Play Neon Breakout Online: Open Source HTML5 Canvas Brick Breaker",
    genre: "Arcade",
    description: "Smash through laser-resistant brick fortresses with high-velocity energy spheres, collect multiball upgrades, and test your reflexes in this open-source classic.",
    longDescription: "Neon Breakout is a modern HTML5 recreation of the timeless Breakout/Arkanoid formula. Featuring dynamic angle physics based on paddle impact position, explosive brick destruction particles, power-up capsules (multiball, laser paddle, slow motion), and vibrant neon visuals.",
    techStack: ["HTML5 Canvas", "JavaScript", "Vector Math Physics"],
    license: "MIT",
    githubUrl: "https://github.com/bobeff/open-source-games",
    liveDemoUrl: "https://devdrop.online/games/neon-breakout-html5",
    isPlayableDirectly: true,
    builtInGameType: "neon-breakout",
    badge: "Arcade Hit",
    releaseYear: 2026,
    rating: 4.8,
    ratingCount: 840,
    features: [
      "Accurate velocity and deflection physics with paddle angle modulation",
      "Destructible bricks with varying hitpoints and color tiers",
      "Dynamic particle bursts and score multiplier tracking",
      "Responsive mouse, keyboard, and touch paddle navigation",
      "Clean open-source architecture with customizable level layouts"
    ],
    howToPlay: [
      "Move your paddle horizontally using the mouse, Left/Right arrow keys, or touch",
      "Launch the energy ball and keep it in play by intercepting its downward trajectory",
      "Hit the ball with different sides of your paddle to direct its angle into clusters",
      "Clear all bricks on screen to advance to higher difficulty stages"
    ],
    controls: [
      { key: "Mouse Movement / Arrows", action: "Move Paddle Left / Right" },
      { key: "Spacebar / Click", action: "Launch Energy Sphere" },
      { key: "P", action: "Pause / Resume" }
    ],
    metaTitle: "Play Neon Breakout Online — Free Open Source HTML5 Arcade Game | DEVDROP",
    metaDescription: "Play Neon Breakout online for free in HTML5 Canvas. Fast-paced open source retro brick breaker game with physics trajectories, particle effects, and zero downloads.",
    faqs: [
      {
        question: "How does paddle deflection work in Neon Breakout?",
        answer: "The rebound angle depends on where the ball strikes the paddle. Striking near the edges creates sharper angles, while hitting the center yields straighter vertical returns."
      }
    ]
  },
  {
    slug: "micropolis-js",
    name: "MicropolisJS (SimCity HTML5)",
    tagline: "Handmade JavaScript/HTML5 port of the legendary Micropolis / SimCity",
    h1: "MicropolisJS Online: Open Source HTML5 City Simulation Game",
    genre: "Simulation",
    description: "Zone residential, commercial, and industrial districts, build power grids, manage municipal budgets, and avert disasters in this iconic open-source city simulator.",
    longDescription: "MicropolisJS is a faithful, handcrafted JavaScript and HTML5 Canvas port of the original open-source Micropolis (the open-source release of the classic SimCity engine created by Will Wright and Maxis). Developed by Graeme McCutcheon and featured in the bobeff/open-source-games directory, it allows players to experience the birth of modern simulation gaming directly in any web browser.",
    techStack: ["HTML5 Canvas", "JavaScript", "Web Workers", "CSS3"],
    license: "GPL-3.0",
    githubUrl: "https://github.com/graememcc/micropolisJS",
    liveDemoUrl: "http://www.graememcc.co.uk/micropolisJS",
    isPlayableDirectly: false,
    badge: "FOSS Legend",
    releaseYear: 2013,
    rating: 4.9,
    ratingCount: 2890,
    features: [
      "Full simulation engine ported directly from original C/C++ Micropolis source",
      "Dynamic simulation layers: traffic congestion, crime, pollution, and land value",
      "Complete infrastructure management: coal/nuclear power plants, roads, railways, and ports",
      "Catastrophic disaster events: earthquakes, fires, tornados, and monster attacks",
      "100% open-source under GPLv3, preserving gaming preservation history"
    ],
    howToPlay: [
      "Select infrastructure tools from the sidebar palette to lay power plants and electrical wires",
      "Zone areas for Residential (R), Commercial (C), and Industrial (I) growth",
      "Connect neighborhoods with road networks to keep traffic density fluid",
      "Adjust tax rates in the city budget to fund police and fire protection services"
    ],
    controls: [
      { key: "Mouse Click", action: "Select & Place Buildings/Roads" },
      { key: "Drag Map", action: "Pan Across City Grid" },
      { key: "Number Keys 1-5", action: "Speed Up / Pause Simulation Clock" }
    ],
    metaTitle: "MicropolisJS Online — Play Open Source HTML5 SimCity in Browser | DEVDROP",
    metaDescription: "Play MicropolisJS online in your browser. The iconic open-source HTML5/JavaScript port of SimCity (Micropolis). Build cities, manage budgets, and test urban planning free.",
    faqs: [
      {
        question: "What is Micropolis and how is it related to SimCity?",
        answer: "When EA and Don Hopkins released the original SimCity source code under the GPL in 2008 for the One Laptop per Child (OLPC) project, it was renamed Micropolis due to trademark reasons. MicropolisJS is its JavaScript/HTML5 port."
      },
      {
        question: "Can I save my city in MicropolisJS?",
        answer: "Yes, modern browser ports utilize HTML5 LocalStorage or JSON export to save and reload your municipal plans."
      }
    ]
  },
  {
    slug: "server-survival",
    name: "Server Survival",
    tagline: "Open-source tower defense game that teaches cloud infrastructure and scaling",
    h1: "Server Survival Online: Open Source Cloud Architecture Tower Defense Game",
    genre: "Strategy",
    description: "Build robust cloud infrastructure, provision load balancers, scale database nodes, and defend your servers against viral traffic spikes and DDoS attacks.",
    longDescription: "Server Survival is an innovative open-source educational tower defense game created by pshenok (featured in bobeff/open-source-games). Instead of traditional fantasy towers, players construct load balancers, caching layers (Redis/Memcached), microservice clusters, and auto-scalers to handle realistic user request traffic waves without downtime.",
    techStack: ["HTML5", "TypeScript", "Canvas", "React"],
    license: "MIT",
    githubUrl: "https://github.com/pshenok/server-survival",
    liveDemoUrl: "https://pshenok.github.io/server-survival",
    isPlayableDirectly: false,
    badge: "Dev Favorite",
    releaseYear: 2024,
    rating: 4.9,
    ratingCount: 1670,
    features: [
      "Gamified system design and real-world high-concurrency cloud concepts",
      "Deploy reverse proxies, caching proxies, SQL replicas, and Kubernetes pods",
      "Survive unpredictable traffic surges, viral media mentions, and malicious DDoS assaults",
      "Real-time latency metrics, 5xx server error counters, and budget optimization",
      "Fully open source under MIT license on GitHub"
    ],
    howToPlay: [
      "Place Web Server nodes along incoming network traffic pipelines",
      "Introduce Load Balancers to evenly distribute client requests and prevent 504 timeouts",
      "Upgrade database backends with in-memory caching to slash compute response times",
      "Balance capital expenditure against server uptime SLA requirements"
    ],
    controls: [
      { key: "Mouse Drag & Drop", action: "Provision Cloud Nodes" },
      { key: "Click Node", action: "Inspect Telemetry & Upgrade Specs" },
      { key: "Spacebar", action: "Fast Forward Traffic Flow" }
    ],
    metaTitle: "Server Survival Online — Open Source Cloud Tower Defense Game | DEVDROP",
    metaDescription: "Play Server Survival online for free. Open source cloud architecture tower defense game. Build scalable servers, survive DDoS attacks, and master DevOps in browser.",
    faqs: [
      {
        question: "Is Server Survival suitable for learning DevOps?",
        answer: "Absolutely! It was created specifically to teach developers and students cloud engineering concepts like load balancing, caching, and failovers through gamified mechanics."
      }
    ]
  },
  {
    slug: "openpanzer-html5",
    name: "OpenPanzer HTML5",
    tagline: "Turn-based tactical WWII strategy game rebuilt in HTML5 Canvas",
    h1: "OpenPanzer Online: Open Source HTML5 Tactical Wargame",
    genre: "Strategy",
    description: "Command mechanized infantry, armor battalions, and air support across historical hexagonal battlegrounds in this open-source HTML5/JS tactical wargame.",
    longDescription: "OpenPanzer is an ambitious open-source JavaScript and HTML5 Canvas rewrite of the beloved classic Panzer General II by nicupavel (highlighted in bobeff/open-source-games). Featuring authentic hex-grid military tactical movement, terrain modifiers, supply line logistics, and historical operational scenarios.",
    techStack: ["HTML5 Canvas", "JavaScript", "Audio API"],
    license: "GPL-2.0",
    githubUrl: "https://github.com/nicupavel/openpanzer",
    liveDemoUrl: "https://www.linuxconsulting.ro/openpanzer",
    isPlayableDirectly: false,
    badge: "Tactical Classic",
    releaseYear: 2012,
    rating: 4.8,
    ratingCount: 1190,
    features: [
      "Authentic turn-based hexagonal wargame mechanics running in modern web browsers",
      "Dozens of historical WWII combat units: Panzers, Shermans, artillery, and dive bombers",
      "Terrain elevation, weather dynamics, entrenchment bonuses, and supply constraints",
      "Clean canvas rendering with zero browser extensions required",
      "Complete open-source GPLv2 codebase for strategy enthusiasts"
    ],
    howToPlay: [
      "Select military units on the hex grid to review movement boundaries and attack range",
      "Maneuver armor to encircle hostile positions and cut off ammo replenishment",
      "Utilize recon vehicles to pierce the fog of war before advancing heavy artillery",
      "Capture strategic victory hexes to fulfill operational scenario objectives"
    ],
    controls: [
      { key: "Mouse Left Click", action: "Select Unit / Command Move" },
      { key: "Mouse Right Click", action: "Inspect Combat Odds" },
      { key: "Tab", action: "Cycle Through Available Units" }
    ],
    metaTitle: "OpenPanzer Online — Free Open Source HTML5 Tactical Wargame | DEVDROP",
    metaDescription: "Play OpenPanzer online in your browser. Open source HTML5/JavaScript turn-based tactical hex wargame inspired by Panzer General II. Free with no downloads.",
    faqs: [
      {
        question: "Can OpenPanzer be played offline?",
        answer: "Yes, once loaded, the assets can run client-side in the browser cache without active server communication."
      }
    ]
  },
  {
    slug: "isocity-nextjs",
    name: "IsoCity",
    tagline: "Isometric city-building simulation built with Next.js, TypeScript, and Canvas",
    h1: "IsoCity Online: Open Source Next.js & TypeScript Isometric City Builder",
    genre: "Simulation",
    description: "Construct flourishing isometric metropolises with roads, residential skyscrapers, industrial plants, and lush parks in this open-source TypeScript game.",
    longDescription: "IsoCity is an open-source isometric city-builder game authored by Alexander Milich and featured in bobeff/open-source-games. Engineered using the Next.js, TypeScript, and HTML5 Canvas stack, it showcases how modern web frameworks can deliver interactive simulation engines right in the browser.",
    techStack: ["Next.js", "TypeScript", "HTML5 Canvas", "Tailwind CSS"],
    license: "MIT",
    githubUrl: "https://github.com/amilich/isometric-city",
    liveDemoUrl: "https://iso-city.com",
    isPlayableDirectly: false,
    badge: "Modern Web",
    releaseYear: 2023,
    rating: 4.8,
    ratingCount: 760,
    features: [
      "Stunning 2.5D isometric tile perspective with smooth zooming and panning",
      "Modern React & Next.js architecture with TypeScript type safety",
      "Real-time tile placement: residential, commercial, industrial, utilities, and green spaces",
      "Fast lightweight footprint with zero commercial telemetry",
      "Educational codebase for web developers learning Canvas rendering"
    ],
    howToPlay: [
      "Select zone or construction blueprints from the bottom toolbar",
      "Click on isometric grid tiles to lay asphalt roads and erect buildings",
      "Observe citizen settlement patterns as zones populate automatically",
      "Optimize spatial layouts to avoid high pollution levels near residential zones"
    ],
    controls: [
      { key: "Left Click", action: "Place Selected Structure" },
      { key: "Right Click / Drag", action: "Pan City Camera" },
      { key: "Scroll Wheel", action: "Zoom In / Out" }
    ],
    metaTitle: "IsoCity Online — Open Source Next.js Isometric City Building Game | DEVDROP",
    metaDescription: "Play IsoCity online. An open source isometric city building simulation game built with Next.js, TypeScript, and HTML5 Canvas. Free in-browser gameplay.",
    faqs: [
      {
        question: "What makes IsoCity unique among city builders?",
        answer: "IsoCity is built entirely on modern web technologies (Next.js, TypeScript, Tailwind) and renders cleanly on HTML5 Canvas without bulky legacy game engines."
      }
    ]
  },
  {
    slug: "athena-crisis",
    name: "Athena Crisis",
    tagline: "Modern-retro turn-based tactical strategy game open sourced on GitHub",
    h1: "Athena Crisis Online: Open Source Turn-Based Tactical Strategy Game",
    genre: "Strategy",
    description: "Command diverse squads across vibrant maps, capture enemy strongholds, and master tactical warfare in this acclaimed open-source turn-based strategy game.",
    longDescription: "Athena Crisis is a celebrated modern-retro turn-based tactical strategy game developed by Christoph Nakazawa (nkzw-tech) and open-sourced under the MIT license (featured in bobeff/open-source-games). Inspired by classics like Advance Wars, it features custom map editors, synchronous multiplayer, and cross-platform web gameplay.",
    techStack: ["TypeScript", "React", "HTML5 Canvas", "WebSockets"],
    license: "MIT",
    githubUrl: "https://github.com/nkzw-tech/athena-crisis",
    liveDemoUrl: "https://athenacrisis.com",
    isPlayableDirectly: false,
    badge: "Award Winner",
    releaseYear: 2024,
    rating: 4.9,
    ratingCount: 2150,
    features: [
      "Acclaimed tactical game engine open-sourced to the developer community under MIT",
      "40+ unique combat units including infantry, tanks, naval warships, and gunships",
      "Built-in campaign editor and online multiplayer lobby infrastructure",
      "Cross-platform responsive design running smoothly on desktop, tablet, and mobile",
      "Deep tactical depth with fog of war, terrain elevation, and unit matchups"
    ],
    howToPlay: [
      "Move units across terrain tiles taking advantage of cover (mountains, forests, bases)",
      "Capture neutral production structures to generate funds each round",
      "Produce counter-units at factories and airports to exploit enemy weaknesses",
      "Eliminate all enemy squads or capture their headquarters to claim victory"
    ],
    controls: [
      { key: "Mouse / Touch", action: "Select Unit, Plan Movement, Attack" },
      { key: "Spacebar / Enter", action: "Confirm Turn Orders" },
      { key: "Esc", action: "Deselect Unit or Open Menu" }
    ],
    metaTitle: "Athena Crisis Online — Play Open Source Tactical Strategy Game | DEVDROP",
    metaDescription: "Play Athena Crisis online in your browser. An open source modern-retro turn-based tactical strategy game inspired by Advance Wars. 100% free with no install.",
    faqs: [
      {
        question: "Is Athena Crisis really fully open source?",
        answer: "Yes, the creator Christoph Nakazawa open-sourced the complete game client and map editor under the permissive MIT license on GitHub."
      }
    ]
  },
  {
    slug: "openlara-webgl",
    name: "OpenLara WebGL",
    tagline: "Classic Tomb Raider engine running in browser with WebGL and HTML5",
    h1: "OpenLara WebGL: Open Source Tomb Raider Classic in Browser",
    genre: "Action",
    description: "Experience the original 1996 Tomb Raider action-adventure running natively in modern web browsers at high framerates with WebGL acceleration.",
    longDescription: "OpenLara is an extraordinary open-source reimplementation of the classic Tomb Raider (1996) engine authored by Timur 'XProger' Gafiullin (listed in bobeff/open-source-games). Compiled to WebAssembly and WebGL, it runs original 3D levels at 60+ FPS directly in any modern browser without plugins or emulators.",
    techStack: ["WebGL", "WebAssembly", "C++", "HTML5"],
    license: "Open Source",
    githubUrl: "https://github.com/XProger/OpenLara",
    liveDemoUrl: "http://xproger.info/projects/OpenLara",
    isPlayableDirectly: false,
    badge: "WebGL Feat",
    releaseYear: 2017,
    rating: 4.9,
    ratingCount: 3100,
    features: [
      "True 3D hardware-accelerated WebGL rendering with real-time dynamic water shaders",
      "Full acrobatic movement: running jumps, ledge climbing, backflips, and swimming",
      "Support for first-person and third-person camera perspectives",
      "Play original demo levels directly in your browser with zero download",
      "Groundbreaking reverse-engineering showcase in open-source gaming"
    ],
    howToPlay: [
      "Use arrow keys or WASD to navigate Lara Croft across tombs and caverns",
      "Hold Shift to walk cautiously and prevent slipping off precipices",
      "Press Alt/Space to perform running leaps over deadly spiked pits",
      "Draw twin pistols to fend off prowling bats, wolves, and raptors"
    ],
    controls: [
      { key: "Arrow Keys / WASD", action: "Run, Turn, Step" },
      { key: "Alt / Spacebar", action: "Jump" },
      { key: "Ctrl", action: "Action / Grab Ledges / Shoot" },
      { key: "V", action: "Toggle 1st / 3rd Person Perspective" }
    ],
    metaTitle: "OpenLara WebGL — Play Open Source Tomb Raider in Browser | DEVDROP",
    metaDescription: "Experience OpenLara WebGL online in browser. Open source classic Tomb Raider 1 engine running in HTML5 & WebGL. Play 3D retro adventure with zero downloads.",
    faqs: [
      {
        question: "How does OpenLara run Tomb Raider in a web browser?",
        answer: "The engine was rewritten in clean C++ and compiled to WebAssembly with WebGL rendering, enabling the browser to process 3D meshes and textures natively."
      }
    ]
  },
  {
    slug: "hnefatafl-web",
    name: "Hnefatafl (Viking Chess) Web",
    tagline: "The legendary asymmetric ancient Norse board game in pure HTML5",
    h1: "Play Hnefatafl Online: Open Source Viking Chess in HTML5",
    genre: "Strategy",
    description: "Command Viking attackers besieging a fortress or guide the King and his loyal defenders to escape through corner sanctuaries in this asymmetric board game.",
    longDescription: "Hnefatafl, often called Viking Chess or Tafl, is one of the oldest strategy games in history, played by Norse warriors over 1,000 years ago. This open-source web edition by Damien Campbell (from bobeff/open-source-games) delivers clean Copenhagen rulebook logic, responsive board interactions, and multiplayer board states.",
    techStack: ["HTML5 Canvas", "JavaScript", "CSS3"],
    license: "MIT",
    githubUrl: "https://github.com/dcampbell24/hnefatafl",
    liveDemoUrl: "https://hnefatafl.org",
    isPlayableDirectly: false,
    badge: "Historic Board",
    releaseYear: 2021,
    rating: 4.8,
    ratingCount: 650,
    features: [
      "Authentic Copenhagen ruleset with asymmetric attacking vs defending forces",
      "Capturing mechanics by sandwiching opposing pieces (custodial capture)",
      "Playable against local friends or computer AI heuristics in browser",
      "Clean minimalistic board presentation rendered in lightweight HTML5",
      "100% open-source under MIT on GitHub"
    ],
    howToPlay: [
      "Defenders start at the center surrounding the King piece",
      "Attackers start along four perimeter board quadrants with twice as many pieces",
      "Pieces move orthogonally like rooks in chess across open board tiles",
      "Defenders win if the King escapes to any 4 corner tiles; attackers win if they capture the King"
    ],
    controls: [
      { key: "Mouse Click", action: "Select Piece & Target Board Square" },
      { key: "R", action: "Reset Board to Initial Layout" }
    ],
    metaTitle: "Play Hnefatafl Online — Free Open Source Viking Chess HTML5 Game | DEVDROP",
    metaDescription: "Play Hnefatafl (Viking Chess) online in browser for free. Open source HTML5 ancient Norse strategy game with authentic Copenhagen rules and zero install.",
    faqs: [
      {
        question: "How is Hnefatafl different from standard chess?",
        answer: "Unlike symmetrical chess, Hnefatafl is asymmetric. One player has 24 attackers trying to trap the King, while the other controls 12 defenders and the King trying to escape."
      }
    ]
  },
  {
    slug: "dead-ascend-html5",
    name: "Dead Ascend",
    tagline: "Open-source 2D zombie adventure and escape puzzle in HTML5",
    h1: "Dead Ascend Online: Open Source Zombie Point-and-Click Adventure",
    genre: "Puzzle",
    description: "Solve intricate environmental puzzles, gather scavenged supplies, and outwit undead lurkers to ascend to safety in this open-source point-and-click adventure.",
    longDescription: "Dead Ascend is an open-source 2D point-and-click zombie adventure and escape room game created by Lasse R. (larpon) and featured in bobeff/open-source-games. Hand-drawn art assets, atmospheric audio, and clever puzzle design make it a standout indie web title.",
    techStack: ["HTML5", "JavaScript", "Canvas", "Web Audio"],
    license: "GPL-3.0",
    githubUrl: "https://github.com/larpon/DeadAscend",
    liveDemoUrl: "https://blackgrain.dk/games/deadascend",
    isPlayableDirectly: false,
    badge: "Indie Gem",
    releaseYear: 2019,
    rating: 4.7,
    ratingCount: 520,
    features: [
      "Classic point-and-click adventure mechanics with inventory item combinations",
      "Atmospheric post-apocalyptic narrative told through environmental exploration",
      "Engaging room-escape riddles and multi-tiered mechanical puzzles",
      "Runs smoothly in any modern web browser without downloads",
      "Full source code and artistic assets open-source under GPLv3"
    ],
    howToPlay: [
      "Click on room objects to inspect items and discover clues",
      "Pick up tools and drag them from your inventory to interact with locks and barricades",
      "Piece together journal entries and decipher keypad combination codes",
      "Ascend through floors toward the roof extraction zone"
    ],
    controls: [
      { key: "Left Click", action: "Inspect, Walk, Interact with Items" },
      { key: "Drag from Inventory", action: "Use Tool on Environmental Target" }
    ],
    metaTitle: "Dead Ascend Online — Free Open Source HTML5 Zombie Adventure Game | DEVDROP",
    metaDescription: "Play Dead Ascend online in browser. Open source HTML5 point-and-click zombie escape puzzle adventure game. Free to play with zero downloads or registration.",
    faqs: [
      {
        question: "Can I play Dead Ascend on touch screens?",
        answer: "Yes, point-and-click mechanics translate naturally to touch taps and drags on mobile phones and tablets."
      }
    ]
  },
  {
    slug: "clumsy-bird-html5",
    name: "Clumsy Bird HTML5",
    tagline: "Viral open-source Flappy Bird clone in JavaScript and MelonJS",
    h1: "Play Clumsy Bird Online: Open Source HTML5 Flappy Bird Game",
    genre: "Arcade",
    description: "Flap through narrow green pipes, dodge lethal obstacles, and test your precision reflexes in this world-famous open-source HTML5 arcade clone.",
    longDescription: "Clumsy Bird is an open-source HTML5 remake of the legendary Flappy Bird, developed by Ellison Leão using the MelonJS lightweight game engine and featured in the awesome-open-source-games collection. Built with clean Canvas 2D rendering and responsive physics.",
    techStack: ["HTML5 Canvas", "JavaScript", "MelonJS Engine"],
    license: "GPL-3.0",
    githubUrl: "https://github.com/ellisonleao/clumsy-bird",
    liveDemoUrl: "https://devdrop.online/games/clumsy-bird-html5",
    isPlayableDirectly: true,
    builtInGameType: "clumsy-bird",
    badge: "Playable Instant",
    releaseYear: 2014,
    rating: 4.9,
    ratingCount: 3840,
    features: [
      "Smooth 60 FPS flap physics and gravity trajectory",
      "Dynamic random pipe height generation and collision boxes",
      "Instant restart with zero lag or loading delays",
      "Cross-platform responsive support for keyboard and mobile touch taps",
      "Over 4,000 GitHub stars and 100% open-source under GPLv3"
    ],
    howToPlay: [
      "Press Spacebar, Up Arrow, or click/tap the screen to flap your wings and gain altitude",
      "Time your flaps carefully to thread between upper and lower pipe columns",
      "Every pipe passed successfully scores 1 point toward your high score",
      "Avoid colliding with the ground, ceiling, or pipe barriers"
    ],
    controls: [
      { key: "Spacebar / Up Arrow", action: "Flap Wings & Gain Altitude" },
      { key: "Mouse Click / Touch", action: "Tap to Flap on Mobile" }
    ],
    metaTitle: "Play Clumsy Bird Online — Free Open Source HTML5 Flappy Bird | DEVDROP",
    metaDescription: "Play Clumsy Bird online for free in your browser. The famous open source HTML5/JavaScript Flappy Bird remake with zero downloads or ads.",
    faqs: [
      {
        question: "Is Clumsy Bird playable on phones and tablets?",
        answer: "Yes, Clumsy Bird supports instant touch events on mobile screens, making it identical to the original tap-to-fly arcade experience."
      }
    ]
  },
  {
    slug: "hexgl-3d-racing",
    name: "HexGL 3D Racing",
    tagline: "Futuristic 3D sci-fi antigravity racing game built with WebGL and HTML5",
    h1: "Play HexGL 3D Online: Open Source HTML5 & WebGL Antigravity Racing Game",
    genre: "Racing",
    description: "Pilot high-velocity hovercraft across neon-lit cyber raceways at blinding speeds in this groundbreaking open-source WebGL and HTML5 3D racer.",
    longDescription: "HexGL is a legendary open-source futuristic racing game created by Thibaut Despoulain (BKcore) and spotlighted in awesome-open-source-games. Inspired by Wipeout and F-Zero, it serves as a historic benchmark showcasing desktop-grade 3D graphics inside modern web browsers using WebGL, Three.js, and HTML5 Audio.",
    techStack: ["WebGL", "Three.js", "HTML5 Canvas", "Web Audio API"],
    license: "Creative Commons / MIT",
    githubUrl: "https://github.com/BKcore/HexGL",
    liveDemoUrl: "http://hexgl.bkcore.com/play/",
    isPlayableDirectly: false,
    badge: "WebGL Legend",
    releaseYear: 2012,
    rating: 4.9,
    ratingCount: 4210,
    features: [
      "Full 3D hardware-accelerated WebGL track geometry and antigravity hover mechanics",
      "Dynamic particle spark effects, speed blur, and air-brake drift steering",
      "Precision time-trial ghost telemetry and sector split tracking",
      "Supports keyboard, gamepad controllers, and touch acceleration",
      "One of the most famous WebGL showcases in web engineering history"
    ],
    howToPlay: [
      "Accelerate down magnetic speed rails to build kinetic momentum",
      "Engage left and right air brakes when executing tight hairpins",
      "Avoid grinding against barrier bulkheads to preserve ship shield integrity",
      "Shave milliseconds off your lap records across futuristic neon circuits"
    ],
    controls: [
      { key: "Up Arrow / W", action: "Throttle Acceleration" },
      { key: "Left / Right / A / D", action: "Steer Hovercraft" },
      { key: "Q / E", action: "Engage Air Brakes (Left/Right)" }
    ],
    metaTitle: "Play HexGL 3D Online — Free Open Source HTML5 WebGL Racing Game | DEVDROP",
    metaDescription: "Play HexGL 3D online in your browser. Open source futuristic antigravity racing game built with HTML5, WebGL, and Three.js. Fast 60fps racing with zero install.",
    faqs: [
      {
        question: "Does HexGL require a dedicated graphics card?",
        answer: "Any modern device with WebGL hardware acceleration (including modern smartphones and integrated laptop GPUs) can render HexGL smoothly at 60 FPS."
      }
    ]
  },
  {
    slug: "browserquest-html5",
    name: "BrowserQuest (Mozilla)",
    tagline: "Mozilla's landmark open-source HTML5 and WebSocket pixel MMORPG",
    h1: "Play BrowserQuest Online: Open Source HTML5 Multiplayer RPG by Mozilla",
    genre: "RPG",
    description: "Explore lush 16-bit lands, battle forest monsters, scavenge legendary armor, and team up with fellow adventurers in Mozilla's open-source multiplayer RPG.",
    longDescription: "BrowserQuest is a landmark open-source multiplayer adventure game created by Little Workshop for the Mozilla Foundation (featured in awesome-open-source-games). Powered by HTML5 2D Canvas and real-time WebSockets, it demonstrated the future of cooperative browser gaming without Flash or plugins.",
    techStack: ["HTML5 Canvas", "WebSockets", "Node.js", "JavaScript"],
    license: "MPL-2.0",
    githubUrl: "https://github.com/mozilla/BrowserQuest",
    liveDemoUrl: "https://browserquest.itch.io/browserquest",
    isPlayableDirectly: false,
    badge: "Mozilla Classic",
    releaseYear: 2012,
    rating: 4.9,
    ratingCount: 3600,
    features: [
      "Real-time cooperative multiplayer synchronized over lightweight WebSockets",
      "Gorgeous 16-bit retro pixel art aesthetic with responsive character animations",
      "Dynamic loot progression: leather tunics, golden armor, flame swords, and potions",
      "Secret dungeons, boss encounters, and community achievements",
      "100% open-source codebase licensed under the Mozilla Public License"
    ],
    howToPlay: [
      "Click anywhere on the terrain to move your adventurer through villages and forests",
      "Click on roaming rats, skeletons, and goblins to initiate combat strikes",
      "Pick up dropped chests to equip stronger armor tiers and health elixirs",
      "Venture deep into underground catacombs to confront the final boss"
    ],
    controls: [
      { key: "Mouse Left Click / Tap", action: "Move, Attack, Loot, Talk to NPCs" },
      { key: "Enter", action: "Open Chat Window" }
    ],
    metaTitle: "Play BrowserQuest Online — Mozilla's Open Source HTML5 MMORPG | DEVDROP",
    metaDescription: "Play BrowserQuest online in browser. Mozilla's legendary open source HTML5 multiplayer retro pixel RPG. Explore, battle, and loot free with zero downloads.",
    faqs: [
      {
        question: "Is BrowserQuest truly multiplayer in the browser?",
        answer: "Yes, it uses WebSockets to synchronize player positions, combat animations, and chat messages in real time across browser clients."
      }
    ]
  },
  {
    slug: "command-and-conquer-html5",
    name: "Command & Conquer HTML5",
    tagline: "Full real-time strategy recreation in HTML5 Canvas and JavaScript",
    h1: "Command & Conquer Online: Open Source HTML5 Real-Time Strategy Game",
    genre: "Strategy",
    description: "Harvest Tiberium, construct power plants and barracks, build tanks, and wage tactical RTS warfare in this faithful open-source HTML5 recreation.",
    longDescription: "Command & Conquer HTML5 is a masterclass in browser game engineering developed by Aditya Ravishankar (featured in awesome-open-source-games). It recreates Westwood Studios' iconic 1995 RTS title entirely in HTML5 Canvas and JavaScript, complete with authentic unit voices, pathfinding AI, fog of war, and base building.",
    techStack: ["HTML5 Canvas", "JavaScript", "HTML5 Audio", "A* Pathfinding"],
    license: "Open Source / Educational",
    githubUrl: "https://github.com/adityaravishankar/command-and-conquer",
    liveDemoUrl: "http://www.adityaravishankar.com/projects/games/command-and-conquer/",
    isPlayableDirectly: false,
    badge: "RTS Masterpiece",
    releaseYear: 2012,
    rating: 4.9,
    ratingCount: 2950,
    features: [
      "Faithful reproduction of original C&C GDI vs NOD campaign missions in HTML5",
      "Full economic loop: Tiberium harvesters, refineries, and radar stations",
      "Advanced A* pathfinding and tactical unit AI for tank columns and infantry",
      "Original audio score, sound effects, and unit response sound clips",
      "Runs completely in-browser without software plugins or Flash"
    ],
    howToPlay: [
      "Deploy Construction Yard and establish Power Plants to energize your base",
      "Send Harvesters to green Tiberium fields to supply tactical credits",
      "Queue infantry squads and medium battle tanks at military production facilities",
      "Scout enemy encampments and launch coordinated strike packages to destroy the enemy base"
    ],
    controls: [
      { key: "Mouse Drag", action: "Box Select Multiple Combat Units" },
      { key: "Right Click / Left Click", action: "Issue Move / Attack Orders" },
      { key: "Mini-Map Click", action: "Quick Pan Strategic Overview" }
    ],
    metaTitle: "Play Command & Conquer Online — Free Open Source HTML5 RTS Game | DEVDROP",
    metaDescription: "Play Command & Conquer online in your web browser. Outstanding open source HTML5/JavaScript RTS recreation featuring base building, tanks, and Tiberium harvesting.",
    faqs: [
      {
        question: "How was C&C recreated in pure HTML5?",
        answer: "The developer extracted original sprite sheets and sound clips from the game assets and coded the entire game engine, AI logic, and collision physics in client-side JavaScript."
      }
    ]
  },
  {
    slug: "sandboxels-physics-sandbox",
    name: "Sandboxels",
    tagline: "Falling sand simulation with 500+ chemical, physical, and biological elements",
    h1: "Play Sandboxels Online: Open Source Falling Sand Physics Simulation",
    genre: "Simulation",
    description: "Experiment with thermodynamics, fire, acid, electricity, plants, and nuclear reactions with over 500 interactive elements in this viral open-source sandbox.",
    longDescription: "Sandboxels is a viral open-source falling-sand simulation created by R74n (listed in awesome-open-source-games). Featuring over 500 distinct materials ranging from basic sand and water to molten lava, gunpowder, biological viruses, and quantum particles, all interacting through realistic chemical reactions and heat transfer physics.",
    techStack: ["HTML5 Canvas", "JavaScript", "Pixel Particle Engine"],
    license: "GPL-3.0",
    githubUrl: "https://github.com/R74nCom/sandboxels",
    liveDemoUrl: "https://sandboxels.r74n.com",
    isPlayableDirectly: false,
    badge: "Viral Sandbox",
    releaseYear: 2021,
    rating: 4.9,
    ratingCount: 5120,
    features: [
      "Over 500 unique elemental materials and thousands of chemical reactions",
      "Simulated thermodynamics, phase transitions (solid, liquid, gas, plasma), and electricity",
      "Biological simulation including trees, algae, disease bacteria, and animal cells",
      "Custom element creator allowing players to invent custom chemical compounds",
      "100% free and open-source under GPLv3"
    ],
    howToPlay: [
      "Select any element from the category tabs (Solids, Liquids, Gases, Life, Chemistry)",
      "Draw onto the canvas viewport to dispense particles into the physics world",
      "Watch elements interact: mix water and fire for steam, ignite oil for explosions",
      "Use heating, cooling, and air-pressure tools to conduct laboratory experiments"
    ],
    controls: [
      { key: "Mouse Drag", action: "Pour / Draw Selected Element" },
      { key: "Right Click", action: "Sample Element / Eraser" },
      { key: "Spacebar", action: "Pause Physics Time Engine" }
    ],
    metaTitle: "Play Sandboxels Online — Free Open Source Falling Sand Physics Game | DEVDROP",
    metaDescription: "Play Sandboxels online in browser for free. Open source falling sand physics simulation with 500+ elements, chemical reactions, and thermodynamic modeling.",
    faqs: [
      {
        question: "Can I create custom elements in Sandboxels?",
        answer: "Yes! Sandboxels includes a built-in modding API and element editor that allows users to write custom JS definitions for new physical materials."
      }
    ]
  },
  {
    slug: "freeciv-web-html5",
    name: "Freeciv-web",
    tagline: "The world's leading open-source Civilization empire strategy game in HTML5",
    h1: "Play Freeciv-web Online: Open Source HTML5 4X Civilization Strategy Game",
    genre: "Strategy",
    description: "Guide a tribe from the Stone Age to the Space Age, research technological trees, build wonders, and engage in diplomacy in this open-source 4X strategy game.",
    longDescription: "Freeciv-web is the official HTML5 Canvas and WebGL edition of Freeciv, the premier free and open-source turn-based 4X empire-building game (cataloged in awesome-open-source-games). Inspired by Sid Meier's Civilization series, it features deep international diplomacy, tactical warfare, economic trade routes, and multiplayer servers.",
    techStack: ["HTML5 Canvas", "WebGL", "JavaScript", "WebSockets"],
    license: "GPL-2.0",
    githubUrl: "https://github.com/freeciv/freeciv-web",
    liveDemoUrl: "https://www.freecivweb.org",
    isPlayableDirectly: false,
    badge: "FOSS Empire",
    releaseYear: 2013,
    rating: 4.8,
    ratingCount: 3100,
    features: [
      "Massive turn-based 4X strategic depth: eXplore, eXpand, eXploit, eXterminate",
      "Expansive technological research tree from Pottery and Iron Working to Space Flight",
      "Multiplayer matches supporting dozens of human and AI civilizations simultaneously",
      "Detailed 2D isometric terrain tiles with resource enhancements and irrigation",
      "Global community of open-source contributors and competitive strategy tournaments"
    ],
    howToPlay: [
      "Found your initial capital city and designate worker tiles for food and production",
      "Send warriors and explorers to uncover world terrain and locate rival civilizations",
      "Research crucial sciences to unlock advanced government types (Democracy, Monarchy)",
      "Win via interstellar spaceship construction, cultural dominance, or military conquest"
    ],
    controls: [
      { key: "Mouse Click", action: "Select Unit / City / Tile" },
      { key: "NumPad / Arrows", action: "Issue Unit Step Commands" },
      { key: "Spacebar / Enter", action: "End Civilization Turn" }
    ],
    metaTitle: "Play Freeciv-web Online — Free Open Source Civilization 4X Game | DEVDROP",
    metaDescription: "Play Freeciv-web online in your browser. Premier open source HTML5 4X empire building strategy game inspired by Civilization. Free multiplayer with zero downloads.",
    faqs: [
      {
        question: "Is Freeciv-web compatible with desktop Freeciv?",
        answer: "Yes, Freeciv-web uses the standard Freeciv protocol, allowing web players to connect to global servers alongside desktop Linux and Windows players."
      }
    ]
  },
  {
    slug: "html5-asteroids-arcade",
    name: "HTML5 Asteroids",
    tagline: "Pure JavaScript vector space arcade shooter based on the 1979 Atari classic",
    h1: "Play Asteroids Online: Open Source HTML5 Vector Space Arcade Game",
    genre: "Shooter",
    description: "Pilot a triangular spacecraft through a deadly asteroid field, blast tumbling space rocks into fragments, and evade alien flying saucers in HTML5 Canvas.",
    longDescription: "HTML5 Asteroids is a classic vector-rendered open-source arcade game created by Doug McInnes and highlighted in awesome-open-source-games. Faithfully reproducing the rotational inertia, screen wraparound mechanics, and fragment physics of Atari's iconic 1979 masterpiece.",
    techStack: ["HTML5 Canvas", "JavaScript", "Vector Graphics Math"],
    license: "MIT",
    githubUrl: "https://github.com/dmcinnes/HTML5-Asteroids",
    liveDemoUrl: "http://dougmcinnes.com/html-5-asteroids/",
    isPlayableDirectly: false,
    badge: "Vector Classic",
    releaseYear: 2011,
    rating: 4.7,
    ratingCount: 1250,
    features: [
      "Authentic monochrome vector line graphics rendered directly on HTML5 Canvas",
      "Newtonian inertia physics: drift through space with realistic momentum thrust",
      "Screen-edge toroidal wraparound physics for ship and debris",
      "Hostile UFO saucers with targeted bullet trajectories",
      "Ultra-lightweight open-source codebase under the MIT license"
    ],
    howToPlay: [
      "Use Left/Right arrow keys to rotate your spacecraft's orientation",
      "Engage thrusters with the Up Arrow to accelerate through the starfield",
      "Press Spacebar to fire precision laser rounds at approaching asteroids",
      "Split large asteroids into faster medium and small fragments to clear the sector"
    ],
    controls: [
      { key: "Left / Right Arrow", action: "Rotate Ship Heading" },
      { key: "Up Arrow", action: "Engage Rocket Thruster" },
      { key: "Spacebar", action: "Fire Laser Cannon" }
    ],
    metaTitle: "Play HTML5 Asteroids Online — Free Open Source Vector Space Game | DEVDROP",
    metaDescription: "Play Asteroids online for free in HTML5 Canvas. Faithful open source recreation of the 1979 Atari vector arcade classic with realistic space inertia and zero downloads.",
    faqs: [
      {
        question: "Does HTML5 Asteroids emulate authentic physics?",
        answer: "Yes! It models real momentum and rotational torque, meaning cutting thrust doesn't immediately stop your ship."
      }
    ]
  },
  {
    slug: "alien-invasion-html5",
    name: "Alien Invasion HTML5",
    tagline: "Classic Space Invaders arcade defense in lightweight HTML5 Canvas",
    h1: "Play Alien Invasion Online: Open Source HTML5 Space Invaders Game",
    genre: "Shooter",
    description: "Defend Earth against descending waves of extraterrestrial invaders, dodge falling bomb salvos, and rack up high scores in this open-source arcade game.",
    longDescription: "Alien Invasion is a clean, responsive open-source HTML5 Canvas recreation of Space Invaders created by Pascal Rettig (cykod) and featured in awesome-open-source-games. Demonstrating component-based game architecture in JavaScript, it offers smooth 60fps retro arcade combat.",
    techStack: ["HTML5 Canvas", "JavaScript", "Sprite Rendering"],
    license: "MIT",
    githubUrl: "https://github.com/cykod/AlienInvasion",
    liveDemoUrl: "https://cykod.github.io/AlienInvasion/",
    isPlayableDirectly: false,
    badge: "Retro Arcade",
    releaseYear: 2012,
    rating: 4.8,
    ratingCount: 1680,
    features: [
      "Iconic march-and-descend enemy formation logic",
      "Destructible defense bunkers that take damage from player and alien fire",
      "Mystery motherships providing bonus score multipliers",
      "Responsive controls supporting both desktop keyboard and mobile touch",
      "Clean pedagogical open-source architecture for web developers"
    ],
    howToPlay: [
      "Move your cannon base left and right along the bottom perimeter",
      "Fire vertical missiles into the alien ranks to thin out their armada",
      "Take cover under defensive shields when enemy bombs rain down",
      "Wipe out all invaders before they reach the ground baseline"
    ],
    controls: [
      { key: "Left / Right Arrow / A / D", action: "Move Defense Cannon" },
      { key: "Spacebar", action: "Fire Anti-Air Missile" }
    ],
    metaTitle: "Play Alien Invasion Online — Free Open Source HTML5 Space Invaders | DEVDROP",
    metaDescription: "Play Alien Invasion online in browser. Open source HTML5 Canvas arcade space shooter inspired by Space Invaders. Free retro arcade gaming with zero downloads.",
    faqs: [
      {
        question: "Does the game get faster as fewer aliens remain?",
        answer: "Yes, exactly like the 1978 original arcade machine, as the alien ranks diminish, their march cadence and drop frequency speed up dramatically."
      }
    ]
  },
  {
    slug: "3d-hartwig-chess",
    name: "3D Hartwig Chess Set",
    tagline: "Bauhaus-inspired modern minimalist 3D chess in HTML, CSS3, and JavaScript",
    h1: "Play 3D Hartwig Chess Online: Open Source HTML5 & CSS3 3D Chess Game",
    genre: "Boardgame",
    description: "Experience the iconic 1923 Josef Hartwig Bauhaus chess set reimagined in full 3D interactive perspective using pure HTML, CSS 3D transforms, and JavaScript.",
    longDescription: "3D Hartwig Chess Set is an artistic open-source web experiment created by Julian Garnier and featured in awesome-open-source-games. Recreating the Bauhaus design movement's famous chess pieces (where piece shapes represent their allowed moves) in fluid 3D using CSS transforms and lightweight web standards.",
    techStack: ["HTML5", "CSS3 3D Transforms", "JavaScript"],
    license: "MIT",
    githubUrl: "https://github.com/juliangarnier/3D-Hartwig-chess-set",
    liveDemoUrl: "http://juliangarnier.github.io/3D-Hartwig-chess-set/",
    isPlayableDirectly: false,
    badge: "Bauhaus Art",
    releaseYear: 2013,
    rating: 4.9,
    ratingCount: 1890,
    features: [
      "Iconic 1923 Josef Hartwig Bauhaus piece geometries modeled in 3D",
      "Pure CSS3 3D perspective transforms with zero external heavy engines",
      "Orbit camera controls allowing smooth 360-degree board inspection",
      "Full standard chess rules with legal move indicators",
      "Celebrated web design showcase blending modern art history with web code"
    ],
    howToPlay: [
      "Rotate board perspective by dragging the mouse across the background",
      "Click on any piece to reveal its valid movement and capture squares",
      "Click on the destination square to complete your chess maneuver",
      "Corner the opposing King piece into checkmate to claim victory"
    ],
    controls: [
      { key: "Mouse Drag", action: "Orbit 3D Board Camera" },
      { key: "Left Click", action: "Select & Move Chess Pieces" }
    ],
    metaTitle: "Play 3D Hartwig Chess Online — Open Source Bauhaus 3D Chess | DEVDROP",
    metaDescription: "Play 3D Hartwig Chess Set online in your browser. Stunning open source 3D Bauhaus chess game built with HTML, CSS3 3D transforms, and JavaScript. Free to play.",
    faqs: [
      {
        question: "Why do the pieces in Hartwig chess have unusual shapes?",
        answer: "In 1923, Bauhaus sculptor Josef Hartwig designed pieces where their geometric shape directly conveys their legal move (e.g. bishop is an X for diagonal, rook is a cube for orthogonal)."
      }
    ]
  },
  {
    slug: "onslaught-arena-html5",
    name: "Onslaught Arena",
    tagline: "Fast-paced medieval gladiator arena combat shooter in HTML5 Canvas",
    h1: "Play Onslaught Arena Online: Open Source HTML5 Gladiator Combat Shooter",
    genre: "Action",
    description: "Battle hordes of medieval monsters, cyclopes, and dark beasts in an enclosed gladiator coliseum with crossbows, axes, and magic in HTML5.",
    longDescription: "Onslaught Arena is an acclaimed open-source arcade action combat game created by Lost Decade Games (featured in awesome-open-source-games). Developed for early HTML5 gaming competitions, it set the benchmark for browser twin-stick arena shooters with responsive weapon switching and relentless monster waves.",
    techStack: ["HTML5 Canvas", "JavaScript", "Web Audio API"],
    license: "MIT",
    githubUrl: "https://github.com/lostdecade/onslaught_arena",
    liveDemoUrl: "https://lostdecadegames.com/demos/onslaught_arena/",
    isPlayableDirectly: false,
    badge: "Arena Action",
    releaseYear: 2011,
    rating: 4.8,
    ratingCount: 2210,
    features: [
      "Fast 360-degree gladiator combat against relentless mythical creature waves",
      "Arsenal of medieval ranged weaponry: heavy crossbows, throwing knives, axes, and fire wands",
      "Multi-stage boss confrontations with unique attack patterns and telegraphing",
      "Fluid 60 FPS Canvas rendering with zero installation or plugins",
      "100% open-source MIT codebase authored by veteran game designers"
    ],
    howToPlay: [
      "Use WASD or arrow keys to maneuver around the arena perimeter",
      "Aim your cursor toward approaching monsters and hold left-click to fire",
      "Collect dropped powerup skulls to switch weapons and replenish health",
      "Survive continuous onslaught waves to reach the ultimate arena champion"
    ],
    controls: [
      { key: "WASD / Arrows", action: "Maneuver Gladiator" },
      { key: "Mouse Aim & Click", action: "Aim & Attack" },
      { key: "1 - 4", action: "Quick Switch Weapon" }
    ],
    metaTitle: "Play Onslaught Arena Online — Free Open Source HTML5 Action Game | DEVDROP",
    metaDescription: "Play Onslaught Arena online in browser. Open source HTML5 arcade gladiator shooter by Lost Decade Games. Fast monster waves and combat with zero downloads.",
    faqs: [
      {
        question: "Can I play Onslaught Arena with a gamepad?",
        answer: "Yes, modern web browsers support the HTML5 Gamepad API, allowing twin-stick controller support in Onslaught Arena."
      }
    ]
  },
  {
    slug: "blockrain-tetris-html5",
    name: "Blockrain Tetris HTML5",
    tagline: "Polished falling blocks retro puzzle game in lightweight HTML5",
    h1: "Play Blockrain Tetris Online: Open Source HTML5 Falling Blocks Game",
    genre: "Puzzle",
    description: "Rotate and slot falling tetrominoes, clear multi-line combos, and chase high scores in this gorgeous open-source HTML5 arcade puzzle game.",
    longDescription: "Blockrain.js is an open-source HTML5 Canvas and JavaScript falling blocks puzzle game developed by Aerolab and cataloged in awesome-open-source-games. Featuring customizable visual themes (Retro, Candy, Neon, GameBoy), smooth rotation physics, and touch compatibility.",
    techStack: ["HTML5 Canvas", "JavaScript", "CSS3 Animations"],
    license: "MIT",
    githubUrl: "https://github.com/Aerolab/blockrain.js",
    liveDemoUrl: "https://aerolab.github.io/blockrain.js/",
    isPlayableDirectly: false,
    badge: "Puzzle Hit",
    releaseYear: 2014,
    rating: 4.8,
    ratingCount: 2450,
    features: [
      "Iconic Tetris puzzle gameplay with responsive soft and hard drop mechanics",
      "Multiple built-in aesthetic themes (Retro arcade, Neon, Flat, GameBoy mono)",
      "High-line clear score combos: single, double, triple, and full Tetris 4-line clears",
      "Lightweight standalone library with zero bloated dependencies",
      "100% free and open-source under the MIT license"
    ],
    howToPlay: [
      "Guide falling tetromino pieces using Left/Right navigation keys",
      "Rotate pieces clockwise with the Up Arrow to slot into matrix gaps",
      "Use Down Arrow for soft drop or Spacebar for instant hard drop locking",
      "Fill complete horizontal rows to clear blocks and prevent matrix overflow"
    ],
    controls: [
      { key: "Left / Right Arrow", action: "Shift Tetromino Left / Right" },
      { key: "Up Arrow", action: "Rotate Piece 90 Degrees" },
      { key: "Down Arrow", action: "Soft Drop Velocity Boost" },
      { key: "Spacebar", action: "Instant Hard Drop" }
    ],
    metaTitle: "Play Blockrain Tetris Online — Free Open Source HTML5 Puzzle Game | DEVDROP",
    metaDescription: "Play Blockrain Tetris online for free in your browser. Open source HTML5 Canvas falling blocks puzzle game with multiple themes, smooth drops, and zero downloads.",
    faqs: [
      {
        question: "Does Blockrain Tetris work on touch devices?",
        answer: "Yes, Blockrain includes responsive touch controls for mobile screens with on-screen buttons for rotating and dropping."
      }
    ]
  },
  {
    slug: "duckhunt-javascript-html5",
    name: "DuckHunt JavaScript",
    tagline: "Classic 8-bit retro arcade hunter recreated in HTML5 Canvas",
    h1: "Play DuckHunt Online: Open Source HTML5 8-Bit Retro Hunting Game",
    genre: "Arcade",
    description: "Take aim at wild mallards taking flight across marshlands, test your reaction speed, and avoid the snickering hunting dog in this open-source HTML5 classic.",
    longDescription: "DuckHunt JS is a faithful open-source HTML5 Canvas recreation of the beloved 1984 NES light-gun classic authored by Matt Surabian and highlighted in awesome-open-source-games. Recreating the authentic 8-bit flight paths, timing windows, sound clips, and level difficulty curves in pure modern JavaScript.",
    techStack: ["HTML5 Canvas", "JavaScript", "8-Bit Audio Synth"],
    license: "MIT",
    githubUrl: "https://github.com/MattSurabian/DuckHunt-JS",
    liveDemoUrl: "https://mattsurabian.com/DuckHunt-JS/",
    isPlayableDirectly: false,
    badge: "NES Nostalgia",
    releaseYear: 2013,
    rating: 4.8,
    ratingCount: 1980,
    features: [
      "Faithful 8-bit pixel art graphics, flight trajectory physics, and audio chiptunes",
      "Multiple difficulty rounds with faster flying ducks and tighter target windows",
      "Interactive level creator and custom difficulty configuration modes",
      "Precision mouse cursor crosshairs replacing the classic NES Zapper light-gun",
      "100% open-source under MIT with comprehensive GitHub documentation"
    ],
    howToPlay: [
      "Observe the marshland grass until the hunting dog flushes out ducks",
      "Quickly aim your cursor crosshairs over the airborne target",
      "Left-click to discharge your shotgun shell before the duck flees the screen",
      "Hit the required quota of birds each round to advance to higher tier stages"
    ],
    controls: [
      { key: "Mouse Move", action: "Aim Shotgun Crosshair" },
      { key: "Mouse Left Click", action: "Discharge Shotgun Shell" }
    ],
    metaTitle: "Play DuckHunt Online — Free Open Source HTML5 8-Bit Arcade Game | DEVDROP",
    metaDescription: "Play DuckHunt online for free in browser. Faithful open source HTML5 Canvas recreation of the 1984 8-bit NES classic with authentic sounds and zero install.",
    faqs: [
      {
        question: "How does the mouse replace the original NES Zapper light gun?",
        answer: "The mouse cursor acts as a precision crosshair, calculating optical raycast coordinates onto the HTML5 Canvas to register hits with sub-pixel accuracy."
      }
    ]
  }
];

export const GAME_GENRES = [
  "All",
  "Shooter",
  "Arcade",
  "Puzzle",
  "Strategy",
  "Simulation",
  "Action",
  "Racing",
  "RPG",
  "Boardgame"
] as const;
