const fs = require('fs');
const path = require('path');

const NEW_GAMES_METADATA = [
  {
    slug: 'fruit-slice-master',
    name: 'Fruit Slice Master',
    file: '01_fruit_slice_master.html',
    icon: '🍉',
    genre: 'Arcade',
    tagline: 'Slice juicy flying clay fruits and dodge explosive bombs in this frantic arcade slasher',
    desc: 'Swipe your blade across juicy clay fruits and slice multi-fruit combos while dodging lethal bombs!',
    features: ['Juicy particle fruit splash physics', 'Combo multipliers for multi-slice cuts', 'Blade trail visual effects', 'Classic arcade and zen gameplay modes'],
    controls: [{ key: 'Mouse Drag / Swipe', action: 'Slice blade across fruits' }],
    rating: 4.9,
    badge: 'Popular Arcade'
  },
  {
    slug: 'endless-runner-clay',
    name: 'Endless Clay Runner',
    file: '02_endless_runner.html',
    icon: '🦕',
    genre: 'Arcade',
    tagline: 'High-speed 3-lane clay obstacle course runner with dynamic hurdles and power coins',
    desc: 'Dodge clay obstacles across 3 lanes, leap over hurdles, and collect shiny golden coins!',
    features: ['Dynamic 3-lane switching mechanics', 'Procedurally speeding obstacle generation', 'Coin magnet and multiplier powerups', 'Instant responsive touch and keyboard controls'],
    controls: [{ key: 'A / D or Left / Right', action: 'Switch lanes' }, { key: 'W / Up', action: 'Jump hurdles' }, { key: 'S / Down', action: 'Slide under barriers' }],
    rating: 4.8,
    badge: '3-Lane Action'
  },
  {
    slug: 'balloon-pop-frenzy',
    name: 'Balloon Pop Frenzy',
    file: '03_balloon_pop.html',
    icon: '🎈',
    genre: 'Arcade',
    tagline: 'Fast-reflex floating balloon popping challenge with chain reaction bonuses',
    desc: 'Pop floating clay balloons before they escape into the sky! Chain pops for explosive bonus scores.',
    features: ['High-speed ascending balloon physics', 'Multi-colored balloon point tiers', 'Time frenzy bonus rounds', 'Relaxing clay aesthetic with pop sound synthesis'],
    controls: [{ key: 'Click / Tap', action: 'Pop balloon' }],
    rating: 4.7
  },
  {
    slug: 'brick-breaker-clay',
    name: 'Brick Breaker Clay',
    file: '04_brick_breaker.html',
    icon: '🧱',
    genre: 'Arcade',
    tagline: 'Tactile clay paddle breakout arcade game with multi-ball and laser powerups',
    desc: 'Bounce the clay ball off your paddle and smash through colorful clay brick walls with physics ricochets.',
    features: ['Multi-ball frenzy powerups', 'Expanded paddle laser beams', 'Multi-layer brick durability', 'Smooth 60 FPS ball ricochet physics'],
    controls: [{ key: 'Mouse / Arrow Keys', action: 'Move paddle left and right' }],
    rating: 4.8
  },
  {
    slug: 'color-switch-bounce',
    name: 'Color Switch Bounce',
    file: '05_color_switch.html',
    icon: '🎨',
    genre: 'Arcade',
    tagline: 'Precision timing color-matching obstacle jumper through rotating geometric rings',
    desc: 'Tap to bounce through spinning clay obstacle rings that strictly match your ball color!',
    features: ['Dynamic color switcher orbs', 'Spinning cross and circle geometric hazards', 'Infinite ascending level generation', 'Rhythmic tap-to-bounce momentum'],
    controls: [{ key: 'Spacebar / Tap', action: 'Bounce ball upward' }],
    rating: 4.9,
    badge: 'Trending Reflex'
  },
  {
    slug: 'emoji-memory-match',
    name: 'Emoji Memory Match',
    file: '06_emoji_memory_match.html',
    icon: '🦁',
    genre: 'Puzzle',
    tagline: 'Tactile 3D card-flipping memory brain trainer with delightful clay emoji art',
    desc: 'Flip 3D clay cards and match cute emoji pairs in the minimum number of moves to train your photographic memory!',
    features: ['Smooth 3D card flip animations', 'Adaptive grid sizes for all skill levels', 'Move counter and time tracking', 'Wholesome clay animal and emoji art'],
    controls: [{ key: 'Click / Tap Card', action: 'Flip card over' }],
    rating: 4.8
  },
  {
    slug: 'clay-block-puzzle',
    name: 'Clay Block Puzzle',
    file: '07_block_puzzle.html',
    icon: '🧩',
    genre: 'Puzzle',
    tagline: 'Classic 8x8 polyomino block grid puzzle with satisfying full-line clay crunches',
    desc: 'Drag and drop clay polyomino shapes onto the 8x8 grid to clear full vertical and horizontal lines!',
    features: ['Pure drag-and-drop spatial puzzle', 'Combo line-clear bonus score multipliers', 'No timer pressure — play at your own pace', 'Tactile clay block placing feedback'],
    controls: [{ key: 'Mouse Drag / Touch Drag', action: 'Drag block to grid' }],
    rating: 4.9,
    badge: 'Brain Trainer'
  },
  {
    slug: 'number-merge-drop',
    name: 'Number Merge Drop',
    file: '08_number_merge.html',
    icon: '🔢',
    genre: 'Puzzle',
    tagline: 'Addictive column-drop number merging puzzle — drop numbers to merge into 2048 and beyond',
    desc: 'Drop numbers into columns to merge identical clay blocks into bigger values and chase high scores!',
    features: ['Gravity-based column drop mechanics', 'Automatic cascade chain reactions', 'Tactile merge animations and sound chimes', 'Endless score chase mode'],
    controls: [{ key: 'Click Column / Tap', action: 'Drop block into column' }],
    rating: 4.8
  },
  {
    slug: 'maze-escape-3d-clay',
    name: 'Maze Escape Lab',
    file: '09_maze_escape.html',
    icon: '🚪',
    genre: 'Puzzle',
    tagline: 'Roll your clay marble through procedurally generated labyrinths to locate the exit portal',
    desc: 'Roll your clay marble through procedurally generated labyrinths, collect speed stars, and find the exit!',
    features: ['Procedural maze algorithm generation', 'Smooth marble rolling momentum physics', 'Fog-of-war exploration mode', 'Multiple difficulty maze sizes'],
    controls: [{ key: 'Arrow Keys / WASD', action: 'Roll marble' }],
    rating: 4.7
  },
  {
    slug: 'clay-2048-puzzle',
    name: 'Clay 2048 Number Puzzle',
    file: '10_2048_puzzle.html',
    icon: '🎲',
    genre: 'Puzzle',
    tagline: 'The iconic 2048 sliding puzzle reimagined in tactile 3D clay tiles with smooth swipes',
    desc: 'Swipe clay number tiles in 4 directions to merge matching pairs and unlock the legendary 2048 tile!',
    features: ['Tactile 3D clay aesthetic with rounded bevels', 'Responsive keyboard and touch swipe gestures', 'Highest tile tracker and score memory', 'Undo and instant restart tools'],
    controls: [{ key: 'Arrow Keys / Swipes', action: 'Slide all tiles' }],
    rating: 4.9
  },
  {
    slug: 'mini-car-racing-circuit',
    name: 'Mini Car Racing Circuit',
    file: '11_mini_car_racing.html',
    icon: '🏎️',
    genre: 'Racing',
    tagline: 'Top-down arcade circuit drifting racer with turbo boost pads and lap time trials',
    desc: 'Drift and steer your micro racecar around the clay circuit track to beat competitive lap records!',
    features: ['Arcade drift handling physics', 'Boost strip speed multipliers', 'Ghost lap time challenges', 'Multiple circuit layouts with hairpins'],
    controls: [{ key: 'Arrow Keys / WASD', action: 'Steer, accelerate and brake' }],
    rating: 4.8,
    badge: 'Top Racer'
  },
  {
    slug: 'traffic-dodge-highway',
    name: 'Traffic Dodge Highway',
    file: '12_traffic_dodge.html',
    icon: '🚙',
    genre: 'Racing',
    tagline: 'High-speed highway traffic weaver — overtake trucks and sports cars for near-miss points',
    desc: 'Weave through rush hour highway traffic, avoid multi-vehicle pileups, and collect coins at high speed!',
    features: ['Accelerating highway traffic density', 'Near-miss proximity point multipliers', 'Bonus fuel and shield pickups', 'Smooth highway lane switching'],
    controls: [{ key: 'Left / Right Arrows', action: 'Steer car' }, { key: 'Up / Down', action: 'Accelerate / Decelerate' }],
    rating: 4.8
  },
  {
    slug: 'basketball-hoop-shot',
    name: 'Basketball Hoop Shot',
    file: '13_basketball_shot.html',
    icon: '🏀',
    genre: 'Arcade',
    tagline: 'Arcade physics basketball shooter with moving hoops, bounce backboards, and swish streaks',
    desc: 'Drag back to aim trajectory and shoot clay basketballs into the moving hoop to rack up streaks!',
    features: ['Trajectory arc aiming preview', 'Moving and shrinking hoop difficulty levels', 'Clean swish combo bonus scores', 'Realistic backboard and rim physics'],
    controls: [{ key: 'Mouse Drag / Touch Drag', action: 'Aim and release to shoot' }],
    rating: 4.8
  },
  {
    slug: 'penalty-kick-master',
    name: 'Penalty Kick Master',
    file: '14_penalty_kick.html',
    icon: '⚽',
    genre: 'Arcade',
    tagline: 'Swipe-to-curve football penalty shootout simulator with reactive goalkeeper AI',
    desc: 'Swipe to curve and kick football shots past the animated clay goalkeeper and hit top-corner goals!',
    features: ['Real-time swipe trajectory curve physics', 'Smart goalkeeper reaction AI', 'Target bullseye scoring challenge', 'Wind velocity and distance scaling'],
    controls: [{ key: 'Swipe / Flick', action: 'Kick and curve ball' }],
    rating: 4.8
  },
  {
    slug: 'downhill-bike-rush',
    name: 'Downhill Bike Rush',
    file: '15_downhill_bike.html',
    icon: '🚵',
    genre: 'Racing',
    tagline: 'Extreme downhill mountain bike trials with mid-air flips, gap jumps, and steep declines',
    desc: 'Race down rolling clay hills, balance bike tilt in mid-air, and pull backflips without crashing!',
    features: ['Realistic 2D ragdoll bike balance physics', 'Mid-air backflip and frontflip stunt points', 'Dynamic terrain slopes and rocky drops', 'Checkpoint respawn system'],
    controls: [{ key: 'Up / W', action: 'Pedal gas' }, { key: 'Down / S', action: 'Brake' }, { key: 'Left / Right', action: 'Tilt bike in air' }],
    rating: 4.9,
    badge: 'Stunt Trials'
  },
  {
    slug: 'stickman-jump-deluxe',
    name: 'Stickman Jump Deluxe',
    file: '16_stickman_jump.html',
    icon: '🧗',
    genre: 'Arcade',
    tagline: 'Infinite vertical jumping arcade climb — bounce on springboards and moving cloud pads',
    desc: 'Bounce continuously upwards on bouncy clay platforms, spring pads, and rocket boosters to reach outer space!',
    features: ['Procedural vertical platform generation', 'Super spring and propeller cap powerups', 'Fragile breaking and moving platforms', 'High altitude world milestone records'],
    controls: [{ key: 'Mouse / Left-Right Arrows', action: 'Steer stickman left and right' }],
    rating: 4.8
  },
  {
    slug: 'one-tap-platformer',
    name: 'One-Tap Platformer',
    file: '17_one_tap_platformer.html',
    icon: '🏃',
    genre: 'Arcade',
    tagline: 'High-speed auto-running rhythm platformer with double jumps and hazard spikes',
    desc: 'Fast-paced auto-running platformer where precision timing lets you jump, double jump, and collect gems!',
    features: ['One-button accessible controls', 'Wall-slide and double jump mechanics', 'Deadly spikes, buzzsaws and pitfalls', 'Fast restart loop for perfectionists'],
    controls: [{ key: 'Spacebar / Tap', action: 'Jump / Double Jump' }],
    rating: 4.7
  },
  {
    slug: 'bubble-shooter-classic',
    name: 'Bubble Shooter Classic',
    file: '18_bubble_shooter.html',
    icon: '🫧',
    genre: 'Puzzle',
    tagline: 'Aim the clay cannon to match 3 or more colored bubbles and trigger massive ceiling drops',
    desc: 'Aim your clay cannon to match 3 or more colored bubbles, pop clusters, and clear the descending ceiling!',
    features: ['Trajectory aiming guidelines with wall rebounds', 'Color swap cannon toggle', 'Massive avalanche cluster drop bonus points', 'Over 50 crafted puzzle levels'],
    controls: [{ key: 'Mouse Aim + Click', action: 'Fire bubble' }],
    rating: 4.9,
    badge: 'Addictive Classic'
  },
  {
    slug: 'whack-a-mole-bonk',
    name: 'Whack-a-Mole Bonk',
    file: '19_whack_a_mole.html',
    icon: '🔨',
    genre: 'Arcade',
    tagline: 'Test your reaction speed bonking mischievous clay moles popping out of their grass burrows',
    desc: 'Bonk mischievous clay moles popping out of grass holes within 30 frantic seconds! Watch out for bombs.',
    features: ['Rapid-fire reaction speed testing', 'Golden moles with bonus multiplier points', 'Trick bombs that deduct score on hit', 'Punchy hammer whack sound effects'],
    controls: [{ key: 'Click / Tap', action: 'Bonk mole' }],
    rating: 4.7
  },
  {
    slug: 'fishing-mini-game',
    name: 'Fishing Mini Game',
    file: '20_fishing_mini_game.html',
    icon: '🎣',
    genre: 'Simulation',
    tagline: 'Relaxing lake fishing simulator — cast your line, hook bites, and balance the tension reel',
    desc: 'Cast your bobber into the lake, wait for the tug, and balance the tension reel meter to land prize fish!',
    features: ['Cast distance and lure depth mechanics', 'Tension bar balance minigame during reel-in', '15+ unique fish species with weight logs', 'Peaceful ambient lakeside audio'],
    controls: [{ key: 'Click & Hold', action: 'Cast / Reel in' }],
    rating: 4.8
  },
  {
    slug: 'tower-stack-builder',
    name: 'Tower Stack Builder',
    file: '21_tower_stack.html',
    icon: '🏢',
    genre: 'Arcade',
    tagline: 'Precision timing block stacking builder — construct soaring clay skyscrapers into the clouds',
    desc: 'Stack moving clay blocks perfectly to construct a towering skyscraper into the stratosphere!',
    features: ['Precision slice physics for overhang blocks', 'Perfect-drop streak growth mechanics', 'Atmospheric altitude day-to-night transitions', 'Satisfying block alignment clicks'],
    controls: [{ key: 'Spacebar / Tap', action: 'Drop block onto tower' }],
    rating: 4.8
  },
  {
    slug: 'sliding-jigsaw-puzzle',
    name: 'Sliding Jigsaw Puzzle',
    file: '22_jigsaw_puzzle.html',
    icon: '🖼️',
    genre: 'Puzzle',
    tagline: 'Classic 15-puzzle sliding tile logic challenge — organize tiles into chronological order',
    desc: 'Slide adjacent clay pieces into the empty slot to arrange numbers 1 to 8 in minimum moves!',
    features: ['Guaranteed solvable puzzle algorithms', 'Move counter and stopwatch timer', 'Tactile tile sliding animation', 'Brain-activating logic challenge'],
    controls: [{ key: 'Click / Tap Adjacent Tile', action: 'Slide tile into open slot' }],
    rating: 4.7
  },
  {
    slug: 'simon-memory-master',
    name: 'Simon Memory Master',
    file: '23_simon_memory.html',
    icon: '💡',
    genre: 'Puzzle',
    tagline: 'Follow the musical light sequences on 4 tactile clay pads and test your memory limit',
    desc: 'Repeat the growing musical light sequence across 4 colorful tactile clay pads without missing a beat!',
    features: ['Procedural melodic synthesized tones', 'Ever-accelerating sequence tempo', 'Visual light bloom feedback', 'High score sequence tracker'],
    controls: [{ key: 'Click / Tap Colored Pad', action: 'Repeat sequence tone' }],
    rating: 4.8
  },
  {
    slug: 'tic-tac-toe-duel',
    name: 'Tic-Tac-Toe Duel',
    file: '24_tic_tac_toe.html',
    icon: '❌',
    genre: 'Boardgame',
    tagline: 'Timeless 3x3 clay board game — play against unbeatable smart AI or local pass & play friend',
    desc: 'Classic 3x3 clay board game vs an intelligent Minimax AI or 2-player pass & play on one screen!',
    features: ['Unbeatable AI and casual AI modes', '2-Player local pass & play on one device', 'Match win-streak counter', 'Delightful 3D clay X and O markers'],
    controls: [{ key: 'Click / Tap Cell', action: 'Place your mark' }],
    rating: 4.9
  },
  {
    slug: 'skyroad-rush-3d',
    name: 'SkyRoad Rush 3D',
    file: '25_skyroad_rush_3d.html',
    icon: '🚀',
    genre: 'Racing',
    tagline: 'Hypersonic 3D futuristic highway racer with gravity boost pads and ramp jumps',
    desc: 'Hypersonic 3D racer! Weave through traffic, leap across sky chasms, hit boost pads and take flight!',
    features: ['Blistering 60 FPS 3D highway rendering', 'Nitro boost pads and airtime jump ramps', 'Accelerating multi-lane obstacle traffic', 'Cyberpunk neon skybox aesthetic'],
    controls: [{ key: 'Arrow Keys / WASD', action: 'Steer and speed up' }, { key: 'Spacebar', action: 'Jump / Drift' }],
    rating: 4.9,
    badge: '3D Action'
  },
  {
    slug: 'car-parking-simulator-3d',
    name: 'Car Parking 3D Simulator',
    file: '26_car_parking_3d.html',
    icon: '🅿️',
    genre: 'Simulation',
    tagline: 'Precision 3D car parking simulator with proximity radar sensors, multi-angle camera, and steering physics',
    desc: 'Precision 3D parking simulator! Maneuver into bays, listen to proximity radar beeps, and avoid collisions!',
    features: ['Realistic car steering geometry and reverse gear', 'Audio proximity parking sensor beeps', 'Tight parking bays with cones and barriers', 'Multiple camera angles (Top-down & Chase)'],
    controls: [{ key: 'Arrow Keys / WASD', action: 'Drive and reverse' }, { key: 'Spacebar', action: 'Handbrake' }],
    rating: 4.9,
    badge: '3D Sim'
  },
  {
    slug: 'moto-traffic-rider-3d',
    name: 'Moto Traffic Rider 3D',
    file: '27_bike_traffic_rider.html',
    icon: '🏍️',
    genre: 'Racing',
    tagline: 'Hypersonic first-person highway superbike racing — split lanes, dodge cars, and pull wheelies',
    desc: 'Hypersonic highway superbike racing! Weave through rush-hour traffic, score near misses, and pull wheelies!',
    features: ['First-person cockpit handlebar view', 'Near-miss high-speed point multipliers', 'Realistic engine rev audio synthesis', 'Dynamic day-to-night traffic conditions'],
    controls: [{ key: 'Arrow Keys / WASD', action: 'Steer superbike' }, { key: 'Shift', action: 'Nitro Wheelie Boost' }],
    rating: 5.0,
    badge: 'Top 3D'
  },
  {
    slug: 'zombie-survival-3d',
    name: 'Zombie Survival 3D Arena',
    file: '28_zombie_survival_3d.html',
    icon: '🧟',
    genre: 'Shooter',
    tagline: 'Survive endless waves of undead mutants — scavenge weapons, medkits, and defeat brutal boss tanks',
    desc: 'Survive endless waves of zombies! Collect weapons, medkits, ammo crates, and fight brutal boss tanks in full 3D!',
    features: ['3D top-down / third-person combat arena', 'Weapon arsenal: Shotguns, Assault Rifles, Rocket Launchers', 'Swarming horde AI pathfinding', 'Massive mutant boss encounters'],
    controls: [{ key: 'WASD', action: 'Move survivor' }, { key: 'Mouse Aim & Left Click', action: 'Aim and fire weapon' }],
    rating: 4.9,
    badge: '3D Shooter'
  },
  {
    slug: 'football-penalty-master-3d',
    name: 'Football Penalty Master 3D',
    file: '29_football_penalty_freekick_3d.html',
    icon: '⚽',
    genre: 'Arcade',
    tagline: 'Full 3D free-kick and penalty simulator with swerve spin physics and dynamic stadium crowds',
    desc: '3D Penalty & Free Kick simulator! Swipe to curve shots past defensive walls and beat goalkeeper AI in a roaring stadium!',
    features: ['Full 3D stadium and goalkeeper physics', 'Curve spin aerodynamics via swipe angle', 'Defensive wall jump timing', 'Sudden-death championship penalty shootouts'],
    controls: [{ key: 'Mouse Swipe / Touch Flick', action: 'Shoot and curve ball' }],
    rating: 4.8
  },
  {
    slug: 'sky-parkour-challenge-3d',
    name: 'Sky Parkour Challenge 3D',
    file: '30_parkour_challenge_3d.html',
    icon: '🧗',
    genre: 'Action',
    tagline: 'Speedrun across floating sky islands, moving elevators, and narrow ledges to reach the summit portal',
    desc: 'Speedrun across floating sky islands, moving elevators, and obstacle traps to reach the summit portal!',
    features: ['3D first-person parkour movement physics', 'Moving sky platforms and disappearing blocks', 'Speedrun timer and checkpoint respawns', 'Breathtaking high-altitude cloud aesthetic'],
    controls: [{ key: 'WASD', action: 'Walk and run' }, { key: 'Spacebar', action: 'Jump / Mantle ledge' }],
    rating: 4.9,
    badge: '3D Parkour'
  },
  {
    slug: 'cyber-shooting-arena-3d',
    name: 'Cyber Shooting Arena 3D',
    file: '31_shooting_arena_3d.html',
    icon: '🤖',
    genre: 'Shooter',
    tagline: 'High-octane 3D deathmatch against tactical AI bots with plasma cannons and railguns',
    desc: 'High-octane 3D bot deathmatch! Out-strafe tactical enemy AI bots with Blasters, Plasma Rifles & Railguns!',
    features: ['Full 3D arena deathmatch with bot AI', 'Sci-fi energy weapon loadouts', 'Jump pads and shield regenerators', 'Real-time killfeed and match leaderboard'],
    controls: [{ key: 'WASD', action: 'Strafe and move' }, { key: 'Mouse', action: 'Aim and shoot' }, { key: 'Spacebar', action: 'Jump' }],
    rating: 4.9,
    badge: '3D Action'
  },
  {
    slug: 'airport-ground-crew-3d',
    name: 'Airport Ground Crew 3D',
    file: '32_airport_ground_crew_3d.html',
    icon: '✈️',
    genre: 'Simulation',
    tagline: 'Full 3D airport turnaround simulation — drive baggage tugs, guide passenger airliners, and refuel jets',
    desc: 'Full 3D airport turnaround simulation! Drive baggage tugs, guide airliners, load cargo, and refuel aircraft.',
    features: ['Airport vehicle driving: Tugs, fuel tankers, pushback trucks', 'Realistic airliner marshalling signals', 'Tight schedule turnaround challenges', 'Detailed 3D tarmac runway environment'],
    controls: [{ key: 'Arrow Keys / WASD', action: 'Drive vehicles and marshal' }],
    rating: 4.8,
    badge: '3D Sim'
  },
  {
    slug: 'sumo-push-clash-2d',
    name: 'Sumo Push Clash 2D',
    file: '33_sumo_push_battle.html',
    icon: '🤼',
    genre: 'Action',
    tagline: 'Hilarious rapid-tapping clay sumo ring pusher — build momentum and shove opponents out of the dohyo',
    desc: 'Fast-paced claymorphism Sumo push battle! Rapid-tap on desktop or mobile to push the opponent out of the ring!',
    features: ['Addictive rapid-tapping push tug-of-war', 'Single player vs AI or 2-player head-to-head', 'Hilarious clay wobble animations', 'Super shove burst meter'],
    controls: [{ key: 'Spacebar / Screen Tap', action: 'Rapid tap to push' }],
    rating: 4.8
  },
  {
    slug: 'flight-pitch-master-2d',
    name: 'Flight Pitch Master 2D',
    file: '34_plane_takeoff_landing_2d.html',
    icon: '🛫',
    genre: 'Simulation',
    tagline: 'Precision 2D plane takeoff & landing simulator — master the flare pitch angle for butter landings',
    desc: 'Precision 2D plane takeoff & landing simulator! Master the exact flare pitch angle (+3° to +6°) for perfect butter landings!',
    features: ['Realistic aerodynamics flare pitch mechanics', 'Crosswind and runway approach glidepaths', 'G-force touchdown telemetry scoring', 'Commercial airliner cockpit HUD indicators'],
    controls: [{ key: 'Up / Down Arrows', action: 'Pitch elevator angle' }, { key: 'W / S', action: 'Throttle engine thrust' }],
    rating: 4.8
  },
  {
    slug: 'head-football-2d',
    name: 'Head Football Champions 2D',
    file: '35_2d_football_champions.html',
    icon: '⚽',
    genre: 'Arcade',
    tagline: '1v1 Side-view Big Head Soccer — jump high, head the ball, and unleash Super Fireball special shots',
    desc: '1v1 Side-view Big Head Soccer! Jump high, head the ball into the net, kick, and unleash Super Fireball shots!',
    features: ['Hilarious big head character physics', 'Super Fireball power shot gauge', '1v1 Solo Cup Tournament or 2-Player local match', 'Bouncing stadium ball physics'],
    controls: [{ key: 'A / D or Left / Right', action: 'Move' }, { key: 'W / Up', action: 'Jump' }, { key: 'Space / Down', action: 'Kick / Super' }],
    rating: 4.9,
    badge: 'Player Favorite'
  },
  {
    slug: 'one-tap-cricket-timing-2d',
    name: 'One-Tap Cricket Timing 2D',
    file: '36_cricket_timing_master_2d.html',
    icon: '🏏',
    genre: 'Arcade',
    tagline: 'Classic one-tap timing cricket — nail the sweet spot to smash towering 6s and boundary 4s',
    desc: 'Classic One-Tap Timing Cricket! Tap the screen as the ball hits the sweet-spot to hit 6s, 4s, and chase tournament totals!',
    features: ['Pure timing sweet-spot batting mechanics', 'Fast, spin and swing bowler variations', 'Chasing target run-chase scenarios', 'Crowd cheering and boundary commentary sounds'],
    controls: [{ key: 'Spacebar / Tap Screen', action: 'Time batting stroke' }],
    rating: 4.9,
    badge: 'Cricket Mania'
  },
  {
    slug: 'speed-math-duel-2d',
    name: 'Speed Math Duel 2D',
    file: '37_speed_math_duel.html',
    icon: '🔢',
    genre: 'Puzzle',
    tagline: 'Fast mental arithmetic battle — play Solo Blitz or 2-Player split-screen math duel',
    desc: 'Fast calculation exam! Play Solo Blitz or 2-Player Head-to-Head Duel on the same screen with touch or keyboard!',
    features: ['Solo Blitz challenge and 2-Player split-screen duel', 'Addition, subtraction, multiplication & division tiers', 'Sudden death wrong-answer penalties', 'High-speed brain mental workout'],
    controls: [{ key: 'Number Keys / Tap Answer', action: 'Select calculation answer' }],
    rating: 4.8
  },
  {
    slug: 'tug-of-war-clay-2d',
    name: 'Tug of War 2D',
    file: '38_tug_of_war_2d.html',
    icon: '💪',
    genre: 'Action',
    tagline: 'Epic Claymorphic Tug of War — pull the braided rope and drag opponents into the messy mud pit',
    desc: 'Epic Claymorphic Tug of War! Pull the braided rope, unleash Heave-Ho power surges, and drag the opponent into the mud pit!',
    features: ['Intense rapid-tap rope tugging physics', 'Heave-Ho surge burst timing meter', 'Solo vs AI or 2-Player local couch brawl', 'Mud splashing ragdoll fall animations'],
    controls: [{ key: 'Spacebar / Tap Button', action: 'Pull rope' }],
    rating: 4.8
  },
  {
    slug: 'beyblade-spin-battle-2d',
    name: 'Beyblade Spin Battle 2D',
    file: '39_beyblade_spin_battle_2d.html',
    icon: '🌀',
    genre: 'Action',
    tagline: 'Epic Beyblade dish clashes — ripcord launches, spin RPM physics, dashes, and explosive Burst Finishes',
    desc: 'Epic Beyblade dish clashes! Ripcord launches, spin RPM physics, special dashes, and explosive Burst Finishes!',
    features: ['Ripcord pull power launcher gauge', 'Dish collision ricochet and stamina friction physics', 'Special dash attacks and ultimate bursts', 'Multiple customizable beyblade tops'],
    controls: [{ key: 'Arrow Keys / Tap Controls', action: 'Steer and dash blade' }],
    rating: 4.9,
    badge: 'Spin Battle'
  },
  {
    slug: 'spiderman-web-avenue-3d',
    name: 'Spider-Man: Web Avenue Rush 3D',
    file: '40_spiderman_web_swing_2d.html',
    icon: '🕷️',
    genre: 'Action',
    tagline: '3D Skyscraper Avenue Web Swinging — shoot left & right webs to weave through skyscrapers at high speed',
    desc: '3D Skyscraper Avenue Web Swinging! Steer with Left & Right web pulls to avoid crashing and maintain speed combos!',
    features: ['Dynamic dual web-slinging physics', 'Soaring 3D skyscraper corridor environment', 'Velocity combo multiplier streaks', 'Heroic web-shooter sound effects'],
    controls: [{ key: 'A / Left Arrow', action: 'Shoot Left Web' }, { key: 'D / Right Arrow', action: 'Shoot Right Web' }],
    rating: 5.0,
    badge: 'Superhero 3D'
  },
  {
    slug: 'crazy-delivery-rider-3d',
    name: 'Crazy Delivery Rider 3D',
    file: '41_crazy_delivery_rider_3d.html',
    icon: '🛵',
    genre: 'Racing',
    tagline: 'Zomato, Swiggy & Blinkit food delivery rush — weave through traffic and deliver before the timer blasts',
    desc: 'Crazy Delivery Rush! Dodge crazy traffic, overtake autos & buses, and deliver food orders before the timer blasts your bike with funny sounds!',
    features: ['Indian city traffic: Autos, buses, cows, potholes', 'Bomb countdown timer on hot food deliveries', 'Meme soundboard voice lines and honks', 'Scooter nitro booster pickups'],
    controls: [{ key: 'Arrow Keys / WASD', action: 'Steer delivery scooter' }, { key: 'Shift', action: 'Nitro boost' }],
    rating: 5.0,
    badge: 'Desi Viral 3D'
  },
  {
    slug: 'no-brakes-desi-bus-3d',
    name: 'No Brakes Desi Bus Driver 3D',
    file: '42_no_brakes_desi_bus_driver_3d.html',
    icon: '🚌',
    genre: 'Arcade',
    tagline: 'Unstoppable runaway Indian bus mayhem — foot brakes are dead, drift around fruit carts and honk air horns',
    desc: 'Unstoppable runaway Indian bus mayhem! Foot brakes are dead — 2-wheel drifts, smashing fruit carts, and honking musical air horns to trigger Bollywood Chaos Mode!',
    features: ['Runaway bus with zero foot brakes', 'Musical Indian air horn sound triggers', 'Fruit carts and toll gate destructible obstacles', 'Hilarious Bollywood slow-mo crash physics'],
    controls: [{ key: 'A / D or Left / Right', action: 'Steer bus' }, { key: 'Spacebar', action: 'Emergency Handbrake Drift' }, { key: 'H', action: 'Musical Air Horn' }],
    rating: 5.0,
    badge: 'Desi Viral 3D'
  },
  {
    slug: 'local-train-door-jammer-3d',
    name: 'Local Train Door Jammer 3D',
    file: '43_local_train_door_jammer_3d.html',
    icon: '🚆',
    genre: 'Arcade',
    tagline: 'Peak office hour suburban train madness — hang from the footboard, duck poles, and survive the rush',
    desc: 'Peak office hour suburban train madness! Hang from the footboard, duck under electric poles, elbow crowds, and survive the stampede at Howrah/Sealdah!',
    features: ['Footboard hanging balance meter', 'Overhead electric wires and pole obstacle ducking', 'Crowd pushing and chaiwala dodging minigames', 'Authentic Mumbai / Kolkata suburban train atmosphere'],
    controls: [{ key: 'Left / Right', action: 'Lean and balance' }, { key: 'Down / S', action: 'Duck under poles' }, { key: 'Space', action: 'Hold door grip' }],
    rating: 5.0,
    badge: 'Desi Viral 3D'
  },
  {
    slug: 'election-mayhem-voting-battle',
    name: 'Election Mayhem: Voting Battle',
    file: '44_election_mayhem_voting_battle.html',
    icon: '🗳️',
    genre: 'Strategy',
    tagline: 'All-star political election battle with state crises, bureaucracy dilemmas, and TV debate clashes',
    desc: 'High-stakes election clash! Solve state crises (highways, hospitals, kisan, 5G), navigate twisted bureaucracy dilemmas, face Arnab TV debates with meme soundboard, and count EVM votes!',
    features: ['8 Playable political caricatures with custom powers', '7 State crisis scenarios with hilarious dilemma choices', 'Breaking news headlines and TV debate showdowns', 'Real-time EVM vote tallying and victory rallies'],
    controls: [{ key: 'Mouse Click / Touch', action: 'Choose dilemma responses and campaign actions' }],
    rating: 5.0,
    badge: 'Desi Viral'
  },
  {
    slug: 'parliament-kaand-3d',
    name: 'Parliament Kaand 3D',
    file: '45_parliament_kaand_3d.html',
    icon: '🏛️',
    genre: 'Action',
    tagline: '3D Indian Parliament comedy chaos simulator — launch paper planes, thump desks, and disrupt proceedings',
    desc: '3D Indian Parliament comedy chaos simulator! Semicircular legislative chamber, flying paper aeroplanes, wooden desk thumping, decorum vs chaos meter, and ragdoll MPs!',
    features: ['Full 3D semicircular parliamentary hall model', 'Paper aeroplane throwing physics', 'Desk thumping audio and commotion meter', 'Speaker calls for decorum vs opposition chaos'],
    controls: [{ key: 'Mouse Aim & Click', action: 'Throw paper planes / thump desk' }],
    rating: 4.9,
    badge: 'Desi Viral 3D'
  },
  {
    slug: 'sledge-rider-3d',
    name: 'Sledge Rider 3D',
    file: '46_sledge_rider_3d.html',
    icon: '🛷',
    genre: 'Sports',
    tagline: 'Extreme downhill snow sledding — carve through snowy slopes, jump wooden ramps, and dodge pine trees',
    desc: 'Extreme downhill snow sledding! Carve through snowy mountain slopes, jump high off wooden ramps, dodge pine trees & rocks, and perform epic airtime!',
    features: ['Smooth 3D snow particle carving physics', 'High-altitude ramp airtime and flips', 'Dynamic alpine mountain terrain generation', 'Coin collection and speed boost gates'],
    controls: [{ key: 'A / D or Left / Right', action: 'Steer sledge' }, { key: 'Spacebar', action: 'Jump off ramps' }],
    rating: 4.9,
    badge: '3D Sports'
  },
  {
    slug: 'dino-escape-adventure',
    name: 'Dino Escape: Adventure Game',
    file: 'dino_escape.html',
    icon: '🦖',
    genre: 'Action',
    tagline: 'Prehistoric endless survival runner — dodge volcanic boulders, slide under pterodactyls, and roar away hazards',
    desc: 'An action-packed HTML5 Canvas prehistoric endless survival runner! Escape an apocalyptic volcanic eruption, dodge ground spikes, slide under flying pterosaurs, and roar away boulders!',
    features: ['Procedural vector-rendered dinosaur animations', '4 Dino skins: Emerald Rex, Magma Dino, Cyber Neon & Golden Fossil', 'Roar sonic shockwave stamina mechanic', 'Parallax prehistoric biomes and meteor showers'],
    controls: [{ key: 'Space / W / Up', action: 'Jump (Tap twice for Double Jump)' }, { key: 'S / Down', action: 'Slide / Duck' }, { key: 'X / Z / J', action: 'Roar Sonic Shockwave' }],
    rating: 5.0,
    badge: 'Featured Adventure'
  },
  {
    slug: 'warehouse-tdm-3d',
    name: 'Warehouse Team Deathmatch 3D',
    file: 'Warehouse TDM.html',
    icon: '🔫',
    genre: 'Shooter',
    tagline: 'Intense 3D tactical warehouse team deathmatch against armed squad AI in close-quarters combat',
    desc: 'Intense 3D tactical warehouse team deathmatch! Take cover behind shipping crates, flank enemy squad bots, and dominate the close-quarters combat arena.',
    features: ['Tactical warehouse cover-shooter layout', 'Squad bot team AI and patrol behavior', 'Dynamic weapon recoil and reload mechanics', 'First-person precision mouse aim'],
    controls: [{ key: 'WASD', action: 'Move' }, { key: 'Mouse', action: 'Aim and Fire' }, { key: 'R', action: 'Reload' }, { key: 'C', action: 'Crouch behind cover' }],
    rating: 4.9,
    badge: '3D Shooter'
  }
];

// Read current games.ts
const gamesFilePath = path.join(__dirname, '..', 'lib', 'data', 'games.ts');
const gamesCode = fs.readFileSync(gamesFilePath, 'utf8');

// Parse the current OPEN_SOURCE_GAMES array
const match = gamesCode.match(/export const OPEN_SOURCE_GAMES: OpenSourceGame\[\] = (\[[\s\S]*?\]);/);
if (!match) {
  console.error('Could not find OPEN_SOURCE_GAMES array');
  process.exit(1);
}

let existingGames = [];
try {
  existingGames = eval(match[1]);
} catch (e) {
  console.error('Eval failed:', e);
  process.exit(1);
}

// Find chaos-skies-3d
const chaosGame = existingGames.find(g => g.slug === 'chaos-skies-3d');
const otherExistingGames = existingGames.filter(g => g.slug !== 'chaos-skies-3d');

// Construct formatted games objects for the 48 new games
const formattedNewGames = NEW_GAMES_METADATA.map(meta => ({
  slug: meta.slug,
  name: meta.name,
  tagline: meta.tagline,
  h1: `Play ${meta.name} Online: Free ${meta.genre} Browser Game`,
  genre: meta.genre,
  description: meta.desc,
  longDescription: `${meta.name} is a high-performance browser-native game featuring tactile aesthetics, procedural Web Audio sound synthesis, and instant zero-download gameplay on any desktop or mobile browser. Enjoy responsive controls, high score tracking, and smooth 60 FPS performance.`,
  techStack: ['HTML5 Canvas', 'JavaScript', 'Web Audio API', 'CSS3', 'WebGL'],
  license: 'Open Source / Free-to-Play',
  githubUrl: 'https://github.com/Ridam-112/devdrop',
  liveDemoUrl: `https://devdrop.online/games/${meta.slug}`,
  isPlayableDirectly: true,
  builtInGameType: 'iframe',
  iframeUrl: `/games/${meta.file}`,
  badge: meta.badge || 'Play Instant',
  releaseYear: 2026,
  rating: meta.rating || 4.8,
  ratingCount: 1200 + Math.floor(Math.random() * 2500),
  features: meta.features,
  howToPlay: [
    'Use the intuitive keyboard keys or touch screen gestures to control your player',
    'Follow on-screen objectives to rack up points and complete levels',
    'Collect power-ups and avoid hazards to maintain your multiplier streaks',
    'Compete to set your personal best high score saved locally on your device'
  ],
  controls: meta.controls,
  metaTitle: `${meta.name} — Play Free Online ${meta.genre} Game | DevDrop`,
  metaDescription: `Play ${meta.name} online for free in your browser. ${meta.desc} No downloads or installs required.`,
  faqs: [
    {
      question: `Is ${meta.name} free to play on DevDrop?`,
      answer: `Yes! ${meta.name} is 100% free with no downloads, subscriptions, or paywalls required. Play directly inside your web browser.`
    },
    {
      question: `Can I play ${meta.name} on a smartphone?`,
      answer: `Absolutely! All games on DevDrop are optimized with responsive touch controls for mobile phones and tablets.`
    }
  ]
}));

// Combine: chaos-skies-3d (#1), then 48 new games, then other existing games
const finalGamesList = [
  chaosGame,
  ...formattedNewGames,
  ...otherExistingGames
].filter(Boolean);

console.log(`Total games prepared: ${finalGamesList.length}`);

// Write back to lib/data/games.ts with clean TypeScript formatting
const newFileContent = `export interface GameControl {
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

export const OPEN_SOURCE_GAMES: OpenSourceGame[] = ${JSON.stringify(finalGamesList, null, 2)};
`;

fs.writeFileSync(gamesFilePath, newFileContent, 'utf8');
console.log('Successfully updated lib/data/games.ts!');
