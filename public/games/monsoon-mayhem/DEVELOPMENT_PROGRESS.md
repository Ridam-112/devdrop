# 🌧️ Monsoon Mayhem — Development Progress Tracker

**Project:** Monsoon Mayhem (মনসুন মেহেম: বর্ষার রাস্তায় স্কুটার সারভাইভাল)  
**Visual Guide:** `public/assets/references/monsoon-mayhem-visual-reference.png`  
**Asset Bible:** `docs/VISUAL_ASSET_BIBLE.md`  
**Stack:** Phaser 3 (`v3.87.0`), TypeScript (`v5.6.3`), Vite (`v5.4.21`)  
**Target:** Desktop & Mobile Browsers (CrazyGames, Itch.io, Web)

---

## 🚀 12-Phase Development Roadmap

### [x] PHASE 1: Project Foundation (Completed & Tested)
- [x] Initialize Vite project with TypeScript & Phaser 3 (Tested)
- [x] Configure canvas scaling (1280x720, Scale.FIT, Center) (Tested)
- [x] Set up modular architecture (`game/`, `scenes/`, `entities/`, `systems/`, `controls/`, `ui/`, `data/`) (Tested)
- [x] Implement scene management (`BootScene`, `PreloadScene`, `MainMenuScene`, `GameScene`) (Tested)
- [x] Create initial asset generators (Scooter, Pothole, Rain particles, Coins) (Tested)
- [x] Build Main Menu with rain particles, animated scooter, high score & play button (Tested)
- [x] Create Input Manager (Keyboard: Arrows/WASD/Space/Shift + Mobile Touch controls) (Tested)
- [x] Build & verify TypeScript compilation and runtime launch (Tested)

### [x] PHASE 2: Pseudo-3D Engine & Curved Flooded Road (Completed & Tested)
- [x] Copy official visual reference sheet to `public/assets/references/monsoon-mayhem-visual-reference.png` (Tested)
- [x] Create `docs/VISUAL_ASSET_BIBLE.md` with complete art direction guidelines (Tested)
- [x] Perspective projection system (`PerspectiveSystem.ts` with horizon vanishing point & scale) (Tested)
- [x] Trapezoidal curved road rendering (`RoadSystem.ts` with smooth left/right and S-curves) (Tested)
- [x] Alternating wet dark asphalt road tiles and reflective yellow/black road curbs (Tested)
- [x] Flooded water-depth visual zones (Shallow, Moderate, Deep Flood) with animated water sheens (Tested)
- [x] Procedural roadside Kolkata environment with object pooling (Tested)
- [x] Atmospheric weather (Heavy rain particles, lightning flash, Howrah bridge skyline silhouette) (Tested)

### [x] PHASE 3: Player Character, Scooter & Driving Physics (Completed & Tested)
- [x] **Road Rendering Bug Investigation & Fix (Tested):**
  - **Root Cause:** When `cameraPos % SEGMENT_LENGTH` caused `relZ1 <= 0` at the nearest segment, the closest road polygon was skipped. In addition, the far vertex of segment $n$ was computed with a different curve accumulator than the near vertex of segment $n+1$, causing vertex shear, and the foreground below $Y=587$ lacked coverage down to $Y=720$.
  - **The Fix:** Implemented a continuous node chain where segment $n$ and segment $n+1$ share identical projected vertices. Extended the nearest node point to flush with canvas bottom ($Y \ge 720$), and added a solid wet embankment ground fill below the horizon. Tested on straightaways, left turns, right turns, and S-curves: **Zero black polygons or gaps remain**.
- [x] **Visual & Camera Correction Pass (Tested):**
  - **1. Excessive Camera Roll Tilt Eliminated:** Completely removed whole-canvas tilt (`cameras.main.setAngle(0)`). The horizon remains 100% strictly level, black triangular edge void gaps are eliminated, and road curvature is handled purely by road geometry. The scooter sprite leans independently up to ±14° during steering.
  - **2. High-Definition Character & Rider Visuals:** Implemented Canary yellow hooded raincoat with storm flap zipper, flap pockets, arms gripping handlebars, brown shoes on footboard, denim jeans, black backpack with dual straps, and retro glossy black helmet with chin strap directly referencing the Visual Asset Bible.
  - **3. Authentic Vintage Blue Chetak Scooter:** Rendered classic bulbous aqua-blue engine cowls with chrome side spears and 3 cooling louvers, chrome tubular rear carrier with mounted spare wheel, chrome handlebars with dual round rearview mirrors, yellow WB registration plate, lower exhaust pipe, and ruby red jewel taillight.
  - **4. Rich Kolkata Roadside Environment:** Added dense, authentic Kolkata scenery along the roadway with proper perspective scaling: 3-story colonial buildings, market shops with red/yellow striped awnings and sweets stalls ("ঘোষ সুইটস & টি"), roadside tea stalls with boiling aluminum kettles and tilted umbrella ("Cha-er Dokan"), blue Kolkata bus stop shelters ("বাস স্টপ"), parked classic yellow Ambassador taxis, street food signboards ("Bhaat Gorom • গরম ভাত"), concrete electric utility poles with red insulators, British cast-iron streetlights with amber lanterns, coconut palms, and red postal boxes.
  - **5. Precision Alignment & Effects:** Sized Chetak sprite to proportional scale (`0.72`), aligned ground shadow (`baseScreenY + 98`), brake light flare centered on ruby taillight, and tire water spray emitting from the tire-road contact point.
- [x] **Player Character (`PlayerScooter.ts`) (Tested):**
  - Young Bengali rider wearing bright canary yellow raincoat with hood and black backpack.
  - Glossy black retro helmet with chin strap.
  - Animation states: `IDLE`, `RIDING`, `STEERING_LEFT`, `STEERING_RIGHT`, `BRAKING`, `JUMPING`, `LANDING`.
- [x] **Starting Scooter (Vintage Blue Chetak) (Tested):**
  - Rounded vintage aqua/sky-blue monocoque body with chrome luggage rack, rear spare wheel, red tail lamp, and yellow WB registration plate.
  - Front, side, and rear perspective views generated in `PreloadScene.ts`.
- [x] **Arcade Driving Physics (`physicsConfig.ts` & `PlayerScooter.ts`) (Tested):**
  - Smooth acceleration up to 85 km/h with natural coasting deceleration.
  - Smooth steering interpolation with speed-dependent response and automatic return-to-center recovery.
  - Dynamic motorcycle lean up to 14° when steering.
  - Glowing red brake light flare on deceleration.
- [x] **Jump & Landing Mechanics (Tested):**
  - `Space` / Mobile `JUMP` triggers a smooth parabolic jump arc with gravity.
  - Scooter ground shadow stays on the road surface and dynamically scales with height.
  - Landing triggers suspension compression squash (`scaleY: 1.35`), water splash, and subtle camera shake.
  - Jump cooldown timer prevents rapid spamming.
- [x] **Flooded Water Interaction (Tested):**
  - Water depth drag modifiers (Shallow: 95% speed, Moderate: 84% speed, Deep: 68% speed).
  - Dynamic water wheel spray emitting from rear tire with lateral deflection during turns.
- [x] **Camera & Audio Integration (`AudioManager.ts`) (Tested):**
  - Level camera horizon with independent rider lean.
  - Web Audio procedural synthesis for 2-stroke engine idle, revving pitch modulation, water splashes, jump whoosh, and landing thud.
- [x] **Desktop & Mobile Controls (Tested):**
  - Keyboard (WASD / Arrows + Space + Esc/P) and mobile on-screen multi-touch buttons (`LEFT`, `RIGHT`, `GAS`, `BRAKE`, `JUMP`).
- [x] **Production Build Verification (Tested):**
  - `npm run build` completed in 11.81s with 0 errors.

---

### [x] PHASE 4: Movement Fix, Obstacles & Collision System (Completed & Tested)
- [x] **Root Cause Investigation of Forward Movement:**
  - **Identified Root Causes:**
    1. In `RoadSystem.ts`, forward track movement was scaled by an overly small factor `0.035` (`playerSpeedMps * SEGMENT_LENGTH * dt * 0.035`). At 60 km/h ($16.67$ m/s), only 0.58 segments were passing per second (taking ~1.7 seconds per stripe), creating the illusion that the scooter was frozen in place.
    2. In `physicsConfig.ts`, `BASE_CRUISE_SPEED` was set to 50 km/h with an automatic acceleration loop in `PlayerScooter.ts`, causing ghost cruise control rather than authentic stationary-at-rest arcade mechanics.
    3. In `InputManager.ts`, keyboard checks were overwriting mobile touch button events every frame, dropping gas inputs.
- [x] **Forward Movement System Fix (Tested):**
  - **Dynamic Frame-Independent Progression:** Implemented `PHYSICS_CONFIG.WORLD_SPEED_SCALE = 110`. At 60 km/h, road segments and markings now travel towards the camera at a thrilling 11.5 segments/second; at 85 km/h, 16.2 segments/second; when stationary, 0 segments/second.
  - **Arcade Speed Model:** Scooter starts at 0 km/h. Pressing W / Arrow Up / Mobile `GAS` accelerates rapidly up to 85 km/h with 2-stroke engine pitch modulation. Releasing gas naturally coasts down to 0 km/h; pressing S / Down / `BRAKE` brakes sharply to a stop with glowing brake lights.
  - **Desktop & Mobile Input Coexistence:** Added keyboard capture prevention for arrow keys and space, plus unified `touchState` and keyboard state so mobile multi-touch buttons and desktop controls function in parallel without interference.
- [x] **Modular Obstacle System (`ObstacleSystem.ts`) (Tested):**
  - **8 Distinct Kolkata Obstacle Types:**
    1. Small Potholes (`POTHOLE_SMALL`) with fractured asphalt edges.
    2. Large Potholes (`POTHOLE_LARGE`) with muddy crater centers and water ripples.
    3. Water-Filled Submerged Potholes (`POTHOLE_WATER`) with visible bubbles and sky reflection.
    4. Signature Open Kolkata Manholes (`OPEN_MANHOLE`) with pitch-black vortex hole, red/white safety perimeter, displaced heavy iron lid, and swirling water.
    5. Yellow-Black Police Barricades (`BARRICADE`) with steel tube legs and "KOLKATA POLICE" lettering.
    6. Fluorescent Traffic Cones (`TRAFFIC_CONE`) with reflective white stripes and heavy black rubber bases.
    7. Wet Fallen Monsoon Tree Branches (`FALLEN_BRANCH`) with leafy foliage.
    8. Urban Flood Debris (`FLOATING_DEBRIS`) including floating plastic crates and garbage bags.
  - **Pseudo-3D Projection & Pooling:** Obstacles accurately project along road curvature, scale smoothly as they approach from horizon to foreground, and recycle into sprite pools when passing behind the camera.
  - **Fairness & Safe Path Algorithm:** Lane generator ensures at least one lane remains clear and navigable. Spawning frequency scales gracefully with distance traveled.
- [x] **Depth-Based Collision System (`CollisionSystem.ts`) (Tested):**
  - **Z-Depth Contact Patch Detection:** Evaluates collisions strictly when world distance $relZ \in [25, 90]$ units and lateral offset $|scooterX - obstacleX| < collisionRadius$, preventing false collisions with distant or roadside objects.
  - **Jump Dodge Mechanic:** When the player jumps (`Space` / Mobile `JUMP`), obstacles are cleared safely if $jumpHeight \ge requiredJumpHeight$.
  - **Collision Reactions & Feedback:**
    - Potholes: Suspension squash compression, -15 km/h speed penalty, camera shake (`140ms, 0.007`), splash particles, -12 HP condition loss, and muddy crunch audio.
    - Open Manholes: Major catastrophe! -36 km/h speed penalty, heavy camera shake (`300ms, 0.018`), red screen damage flash, spark & splash explosion, metallic rim clang audio, and -35 HP damage.
    - Police Barricades: Heavy metallic impact, -32 km/h slowdown, spark bursts, and -25 HP damage.
    - Cones & Debris: Minor water splash, -8 to -10 km/h slowdown, and -6 to -8 HP condition loss.
- [x] **HUD Danger Alerts & Health Integration (Tested):**
  - Dynamic Red Danger Banner pops up when high-danger hazards (open manholes, barricades) appear within 150m ahead.
  - Color-coded Engine/Scooter condition bar (Green $\to$ Yellow $\to$ Red).
  - Scooter Break-down Modal with cause of death ("Swallowed by an Open Kolkata Manhole!"), final distance traveled, and instant restart.
- [x] **Build & Verification (Tested):**
  - `npm run build` completed in 12.24s with 0 errors. All assets and systems hot-reloaded and verified on `http://localhost:5173/`.

### [x] PHASE 5: Full 3D Game Conversion & Accurate Collision System (Completed & Tested)
- [x] **Genuine Real-Time 3D Technology Migration:**
  - Migrated game rendering architecture to **Three.js (`WebGLRenderer`)**, **TypeScript**, **PerspectiveCamera**, and **Rapier 3D Physics (`@dimforge/rapier3d-compat`)**.
  - PBR materials with soft shadow maps (`PCFSoftShadowMap`), tone mapping (`ACESFilmicToneMapping`), and true 3D spatial depth.
- [x] **Full 3D Player & Scooter (`PlayerScooter3D.ts`):**
  - **Vintage Sky-Blue Bajaj Chetak Scooter:** 3D curved monocoque steel frame, bulbous engine cowls with louvers, chrome luggage carrier, mounted rear spare wheel, spinning 3D rubber tires with silver hubcaps, steerable fork and handlebars, dual chrome rearview mirrors, chrome exhaust, glowing taillight, and functional 3D forward halogen headlight spotlight.
  - **3D Bengali Rider:** Seated naturally on the saddle, hands holding handlebars, wearing bright canary yellow hooded raincoat with storm flap, black retro helmet with tinted visor, denim blue trousers, brown shoes on footboard, and black backpack.
  - **Vehicle Physics:** Frame-independent 3D movement, dynamic motorcycle lean up to ±14° during steering, speed-proportional wheel spin, and 3D parabolic jumping with real-time shadow projection and suspension squash.
- [x] **Full 3D Kolkata Monsoon Environment (`Road3D.ts` & `Environment3D.ts`):**
  - Endless 3D curved asphalt roadway with yellow/black curbs, sidewalks, dashed center markings, and wet reflective water sheens.
  - 3-story North Kolkata colonial heritage mansions, market shops with striped awnings, British cast-iron streetlights with ambient lanterns, concrete utility poles with insulators, parked yellow Ambassador taxis, tea stalls with kettles, and blue bus stops.
  - Volumetric 3D rain (3,500 raindrops falling with wind angle), stormy atmospheric fog, and real-time lightning flash lighting.
- [x] **Critical False Pothole Collision Fix (`Physics3D.ts`):**
  - Completely replaced broad 2D lane-based bounding box overlap with **accurate wheel-level 3D colliders** (Front Wheel: $r=0.24\text{m}$, Rear Wheel: $r=0.24\text{m}$, Chassis Box) against exact 3D pothole depression geometry ($r=0.52\text{m}$ to $0.92\text{m}$).
  - **Verified 5-Path Collision Scenarios in `PHASE_5_TEST_REPORT.md`:**
    1. Direct Center: Collision detected, damage applied.
    2. Pass Left (25cm outside rim): **Zero damage, zero camera shake (Bug Fixed!)**
    3. Pass Right (25cm outside rim): **Zero damage, zero camera shake (Bug Fixed!)**
    4. Opposite side of road: **Zero damage.**
    5. Airborne Jump Over: Wheels elevated in 3D Y-space above road crater $\implies$ **Zero damage, clean jump.**
- [x] **Collider Debug Mode:**
  - Pressing `F1` or clicking `[F1] COLLIDER DEBUG` toggles real-time 3D wireframes of Front Wheel, Rear Wheel, Chassis, and Pothole/Manhole colliders, turning RED on contact.
- [x] **Third-Person 3D Perspective Camera:**
  - Camera follows behind scooter with smooth interpolation, locked level horizon (`camera.rotation.z = 0`), and impact camera shake.
- [x] **HUD & Control Integration:**
  - High-definition telemetry (Distance, Speed, Water Depth, Condition Bar, Danger Alerts, Mobile Touch Controls) and game-over modal.
- [x] **Production Build:**
  - `npm run build` compiled cleanly in **5.22s** with 0 errors. Live on `http://localhost:5173/`.

### [x] PHASE 5A: Critical 3D Road Alignment & Playable Driving Prototype (Completed & Tested)
- [x] **Root Cause Diagnosis of Coordinate & Rendering Bug:**
  - `Road3D.ts` had an active uncoordinated curve displacement (`curveAmplitude = 18m`) shifting road chunks to the far left ($X = -18\text{m}$), while the scooter drove straight along $X = 0.0\text{m}$ into a dark unlit void.
- [x] **Unified 3D Cartesian Coordinate Standard:**
  - $X = 0.00\text{m}$: Exact road centerline and scooter spawn lateral point.
  - $X \in [-5.0\text{m}, +5.0\text{m}]$: Strict road lane clamping ensuring wheels never drift off asphalt.
  - $Y = 0.00\text{m}$: Ground road contact plane. Wheels rest flush on road.
  - $-Z$: Forward driving direction. $+Z$: Rearward direction towards third-person camera.
- [x] **Temporary Clean Daytime Test Environment:**
  - 12m wide straight asphalt road with yellow/black curbs, sidewalks, white center lines, and red/white milestone posts every 20m.
  - Solid 350m continuous terrain ground mesh below road eliminating all dark voids.
  - Bright daytime sky (`#7dd3fc`) with crisp direct sunlight and soft shadows.
- [x] **Stable Third-Person Camera Correction:**
  - Positioned at $(X \times 0.75, 2.4\text{m}, Z + 5.5\text{m})$ looking forward along $-Z$.
  - Horizon is locked strictly level (`camera.rotation.z = 0`). Road remains centered in the screen at all times.
- [x] **Automated 15-Second Driving Verification (`PHASE_5A_TEST_REPORT.md`):**
  - **1. Spawn:** Scooter spawns directly at road center ($X=0.00, Y=0.00, Z=0.0$).
  - **2. Acceleration:** `KeyW` accelerates smoothly to 85 km/h, road markings pass beneath wheels.
  - **3. Steer Left:** `A` steers left into left lane ($X = -5.00\text{m}$), scooter leans into turn.
  - **4. Steer Right:** `D` steers right across lanes ($X = +5.00\text{m}$), leaning right, road chunks continuous.
  - **5. Braking:** `S` brakes to complete stop at $0\text{ km/h}$, zero sideways drift.
- [x] **Verified Browser Screenshots:**
  - Saved `test_1_spawn_center.png`, `test_2_accelerate_straight.png`, `test_3_steer_left.png`, `test_4_steer_right.png`, `test_5_braked_stop.png`.
- [x] **Production Build:**
  - `npm run build` succeeds in **2.22s** with 0 errors.

### [x] PHASE 5B: 3D Potholes, Hazards & Collision Integration (Completed & Tested)
- [x] **3D Road Potholes & Hazards (`Obstacles3D.ts`):**
  - **Potholes (Small, Large, Muddy Water):** 3D cylindrical bowls sunken into road plane ($Y = -0.10$m) with fractured asphalt outer rims (`#475569`), inner rims, scattered stone debris, and glistening sky-reflective puddles with water foam bubbles.
  - **Open Manholes:** 3D dark deep shaft ($Y = -0.6$m), metallic cast-iron lip, displaced heavy manhole lid slab, and red/yellow warning hazard flag marker.
  - **Police Barricades:** Heavy steel tubular frames with yellow/black diagonal warning stripes and flashing hazard blinker.
  - **Traffic Cones & Branches:** High-visibility orange cones with reflective white collar and fallen tree branches.
  - **Safe-Path Rule:** Generates obstacles across Left ($-2.8$m), Center ($0$m), and Right ($+2.8$m) lanes while guaranteeing at least one clear lane for dodging.
- [x] **Rapier 3D Wheel-Level Physics (`Physics3D.ts`):**
  - Independent wheel contact checking for Front Wheel ($Z - 0.72$m, $r=0.24$m) and Rear Wheel ($Z + 0.52$m, $r=0.24$m).
  - Passing beside a pothole triggers 0 damage (false collision bug permanently fixed).
  - Rolling directly into a pothole squashes suspension, plays impact crunch & water splash audio, triggers camera shake, and deducts health.
  - Jumping (`Space` / `🦘 JUMP`) clears potholes in 3D air without collision.
  - `F1` toggles real-time 3D wireframe colliders (green wheel spheres, blue chassis box, yellow hazard rings, red collision flashes).
- [x] **Dynamic HUD & Warning System (`Game3DScene.ts`):**
  - Live Imminent Danger Warning Banner ("🚨 DANGER: OPEN MANHOLE (18m) — JUMP!").
  - Dynamic Condition/Health Bar (100% down to 0% with Green > Yellow > Red states).
  - Breakdown Game Over modal with distance, hazard stats, and "REPAIR & RETRY" button.
- [x] **Automated Testing & Screenshots:**
  - Verified with `test-obstacles.cjs` capturing `test_obs_1_start.png`, `test_obs_2_approach.png`, `test_obs_3_debug_wireframe.png`, `test_obs_4_encounter.png`, `test_obs_5_jump_dodge.png`, and `test_obs_6_status.png`.
- [x] **Production Build:**
  - `npm run build` verified cleanly with 0 errors. Live at `http://localhost:5173/`.

### [x] PHASE 5C: 60 FPS Performance Optimization & Kolkata Monsoon Overhaul (Completed & Tested)
- [x] **Eliminated Frame Lag & Stuttering ("bike colar shomoy laggy laggy korche"):**
  - **Root Cause Identified:** Double forward decrement in `Game3DScene.ts` and `PlayerScooter3D.ts` caused the visual mesh to lag behind the camera and physics by 1 frame of variable `dt`, resulting in camera jitter. Furthermore, lerping camera $X$ while updating $Z$ instantly caused perspective wobble.
  - **The Fix:** Synchronized forward translation directly inside `PlayerScooter3D.update()`, setting `mesh.position` to the exact current frame position. Locked the camera rigidly in $Z$ and $Y$ relative to the scooter with responsive lateral follow.
  - **GC & Shadow Map Optimization:** Replaced $2048 \times 2048$ shadow map with high-performance $1024 \times 1024$ `PCFShadowMap`, and replaced runtime vector allocations in `Physics3D.ts` with static scratch vectors.
- [x] **Kolkata Monsoon Atmosphere & Weather Visuals (`ThreeCore.ts`):**
  - Atmospheric overcast slate storm sky (`#334155`) with realistic depth fog.
  - Volumetric 3D rain system (2,400 semi-transparent raindrops rushing down with wind angle).
  - Periodic atmospheric lightning flashes that light up the road and buildings in silhouette.
  - Dark, glossy wet asphalt road reflecting ambient light and streetlights.
- [x] **Speed Sensation & Arcade Handling:**
  - Dynamic Speed FOV: Camera FOV smoothly expands from 53° at rest to 61° at 85 km/h for an intense sensation of rushing through the storm.
  - Rear tire water spray cone emitting at speeds $> 12$ km/h.
  - Snappy, agile steering ($7.5$ m/s) with satisfying motorcycle lean up to ±14°.
- [x] **Moving Traffic Vehicles (`Obstacles3D.ts` & `AudioManager.ts`):**
  - **Kolkata City Bus:** 8.5m long blue & yellow state bus driving along the lanes at ~33 km/h with route board and loud dual-tone pneumatic horn ("প্যাঁ... প্যাঁ...").
  - **Yellow Ambassador Taxi:** Classic Kolkata yellow cab driving at ~43 km/h with roof taxi sign and electric horn.
  - Overtaking or changing lanes gives a dynamic, bustling Kolkata street survival experience!
- [x] **Production Build:**
  - `npm run build` succeeds in **4.26s** with 0 errors. Live at `http://localhost:5173/`.

### [x] PHASE 5D: Extreme Kolkata Monsoon Chaos (All 7 Chaos Features Completed & Tested)
- [x] **1. 🌊 The Legendary Bus Bow Wave:** Passing Kolkata buses periodically trigger a massive lateral water wave wall rushing across adjacent lanes. Jumping (`Space` / `🦘 JUMP`) safely clears the wave, otherwise it forcefully shoves the scooter sideways and floods the exhaust!
- [x] **2. 💨 Exhaust Flooding & Throttle Balance Mechanics:** Chetak's low exhaust pipe accumulates flooded water if gas is released or speed drops below 10 km/h. Sputtering kicks in above 40% water level with grey exhaust smoke puffs ("ভট... ভট... ফুসসস..."). Keeping throttle pinned blows the water out! If exhaust reaches 100% water, the engine stalls.
- [x] **3. 🛺 Erratic Kolkata Auto-Rickshaw (`AUTO_RICKSHAW`):** 3D green & yellow 3-wheeler weaving dynamically across lanes with lateral sine oscillation and tilt, honking violently.
- [x] **4. ⚡ Live Electric Sparking Wire (`ELECTRIC_WIRE`):** Snapped storm utility cable dangling into road floodwater with blue electric sparks and pulsating arc light (`BZZZZT!`). Causes heavy electric shock unless jumped over.
- [x] **5. 💩 Fullscreen Mud & Water Splatters (`mud-canvas`):** High-velocity water pothole hits and bus bow waves trigger thick brown mud splashes and dripping water droplets across the camera lens that gradually drip and fade away.
- [x] **6. 🗣️ Authentic Kolkata Voice Reactions & Comic Speech Bubbles:** Contextual Bengali speech bubbles pop up over the rider with Web Speech audio synthesis:
  - Bus incoming: *"ওরে বাবারে! বাস আসছে!"*
  - Bus wave: *"🌊 বাসের ঢেউ আসছে রে! জাম্প কর!"*
  - Auto swerving: *"🛺 অটোওয়ালা মারল রে! সাইড নে!"*
  - Silencer flooded: *"⚠️ সাইলেন্সারে জল ঢুকলো রে! এক্সিলারেটর চাপ!"*
  - Chai pickup: *"☕ আহহ! মাটির ভাঁড়ের গরম চা! ফুল পাওয়ার!"*
  - Audio includes conductor pea whistle & bus body thumping ("ঠাস... ঠাস...").
- [x] **7. ☕ Kolkata Street Chai Pickups (`CHAI_PICKUP`):** Floating terracotta clay cups (মাটির ভাঁড়) with steaming milk tea and golden halo glow. Picking up grants +25 Health, blows 100% water out of exhaust, grants +15 km/h nitro boost, instantly cleans mud off the screen, and plays tea slurping audio.
- [x] **Production Build:** `npm run build` completed in **3.75s** with 0 errors. Verified with live browser test.

### [x] PHASE 5E: Visual Fidelity Overhaul & Kolkata Aesthetic Polish (Completed & Tested)
- [x] **Dynamic Storm Sky Dome (`ThreeCore.ts`):**
  - Hemispherical sky dome with vertical canvas gradient from dark stormy slate (`#090d16` $\to$ `#1e293b`) down to low rainy horizon haze (`#475569`).
  - Atmospheric lightning flashes with dynamic background sky and ambient illumination.
  - Balanced tone mapping (`ACESFilmicToneMapping`, exposure 1.15) with soft PCF shadows.
- [x] **Realistic Monsoon Rain Streaks & Water Ripples (`ThreeCore.ts`):**
  - Upgraded rain system to 2,400 fast-falling `THREE.LineSegments` streaks with wind slant angle, eliminating pixelation and square-block artifacts.
  - Dual water splash ripple rings using procedural circular canvas textures (`THREE.CanvasTexture`) animated on wet road asphalt.
- [x] **Wet Road & Sidewalk Realism (`Road3D.ts`):**
  - Procedural wet dark asphalt texture with aggregate noise, wet tire tracks, and specular sheen.
  - High-gloss reflective water puddles (`metalness: 0.85, roughness: 0.04`) reflecting sky and streetlights.
  - Sidewalk paver slabs texture with longitudinal joint lines.
  - Iconic white zebra crossings at intersections every 3rd chunk (every 120m).
  - Alternating yellow/black curbs with red-and-white milestone reflector posts.
- [x] **Authentic Kolkata Architecture & Street Props (`Environment3D.ts`):**
  - Fixed building orientations: Facades, windows, and shops face directly toward the player driving down the road.
  - 3-story Colonial Heritage Mansions: Arched ground-floor veranda with pillars, green French shuttered windows with warm glowing lit interior panes, and 2nd/3rd floor ornate black wrought-iron balconies.
  - Red brick market shops with glowing neon signboards ("ঘোষ সুইটস & টি"), red & yellow striped weather awnings, and warm glowing interior counters.
  - Authentic Kolkata props: Red British Pillar Post Boxes, bilingual yellow "KOLKATA • কলকাতা" signboards, tea stalls with smoking aluminium kettles and clay cups (মাটির ভাঁড়), cast-iron streetlights with amber light pools.
- [x] **Detailed Bajaj Chetak Scooter & Rider (`PlayerScooter3D.ts`):**
  - Chetak Scooter: Chrome tubular crash bars around bulbous engine cowls, kickstart lever, central vintage horncast grill emblem, dual front amber turn indicators, chrome bezel around halogen headlight with road beam spotlight, speedometer cluster, spare tire bracket, and yellow license plate.
  - Rider: Canary yellow raincoat with dark waterproof zipper flap, dual backpack shoulder harness straps, glossy retro helmet with white racing stripe and chrome visor pivot screws.
- [x] **Verified Automated Visual Verification:**
  - `test-visual-upgrade.cjs` captured:
    - `test_visual_1_sky_and_road.png`: Sky dome, line rain streaks, asphalt puddles, Chetak details.
    - `test_visual_2_colonial_architecture.png`: Heritage mansions, live wire spark pool, street poles.
    - `test_visual_3_props_and_details.png`: Parked yellow taxi, tea stall, steaming chai pickup.
    - `test_visual_4_rain_and_splashes.png`: Moving bus encounter, screen mud splatters, bike steering lean.
- [x] **Production Build:**
  - `npm run build` compiled cleanly in **3.38s** with 0 errors. Live at `http://localhost:5173/`.


### [ ] PHASE 7: Weather and Chaos Events
- [ ] Dynamic weather (Normal Rain, Heavy Monsoon, Thunderstorm, Night Rain)
- [ ] Chaos Event Manager (12+ weighted random events)
- [ ] Street dog crossing, auto U-turns, floating garbage waves
- [ ] Difficulty Director (distance-based scaling and fairness rules)

### [ ] PHASE 8: Meme and Audio Identity
- [ ] Centralized Meme Manager with context-aware dialogue
- [ ] Bengali voice & speech bubbles ("ও মা গো!", "বাস দাদা একটু আস্তে!", "গেলাম রে!")
- [ ] Procedural engine audio, rain ambience, horn blasts, and water splashes
- [ ] Funny game-over death messages

### [ ] PHASE 9: Progression and Garage
- [ ] Distance, combo, and coin scoring economy
- [ ] Garage scene with 5+ playable vehicles (Chetak, Splendor, XL moped, Auto, Boat scooter)
- [ ] Vehicle upgrades (Engine durability, water resistance, tyre grip)
- [ ] Daily challenge generator with date-based seed
- [ ] LocalStorage save manager with schema versioning

### [ ] PHASE 10: UI and Replayability
- [ ] Arcade HUD (Speed, Engine Health, Water Depth, Distance to Home)
- [ ] "Almost Home" destination milestones (Tea Stall, Pharmacy, Home Street)
- [ ] Lightweight 3-second death snapshot replay
- [ ] Shareable Death Scorecard generator
- [ ] Settings menu (Sound, Bengali meme toggle, screen shake)

### [ ] PHASE 11: Polish and Optimization
- [ ] Object pooling for raindrops, splashes, and obstacles
- [ ] 60 FPS mobile and desktop performance profiling
- [ ] Touch target adjustments and landscape orientation lock
- [ ] Quality settings fallback

### [ ] PHASE 12: Final Release & Deployment
- [ ] Vite production build
- [ ] CrazyGames & Itch.io packaging
- [ ] Integration with the local Arcade Hub
