# PARLIAMENT KAAND — PRODUCT REQUIREMENTS DOCUMENT (PRD)
**Version:** 1.0.0  
**Project:** Parliament Kaand (সংসদ কাণ্ড / সংসদীয় তুলকালাম)  
**Genre:** 3D Comedy Chaos Simulator / Political Sandbox  
**Target Platform:** Modern Web Browsers (Desktop & Mobile WebGL)  
**Tech Stack:** React 18, TypeScript 5, Vite, Three.js (r128+), Rapier 3D Physics (`@dimforge/rapier3d-compat`), Zustand 4, Howler.js 2  

---

## 1. Executive Summary & Game Vision
**Parliament Kaand** is a stylized, physics-driven, high-energy 3D comedy chaos simulator set inside a fictionalized, grandiose Indian Parliament chamber (*"Lok Bhavan"* / *"Janata Sabha"*). Players take on the role of a newly elected MP or an independent troublemaker attending a high-stakes legislative session. 

Beneath the veneer of solemn constitutional democracy lies hilarious chaos: opposition MPs waving pamphlets and shouting slogans, ruling party members thumping wooden desks in unison, flying paper aeroplanes and projectile files, security marshals scrambling to maintain decorum, dramatic walkouts, and the Honorable Speaker banging an oversized wooden gavel shouting *"Baith Jaiye!"* (*"অর্ডার! অর্ডার! সবাই নিজের জায়গায় বসুন!"*).

---

## 2. Core Game Principles
1. **Playable Game Over Static Demo:** Every element (desks, mics, bills, benches, gavels, chairs) is interactive and reactive.
2. **Physical Comedy & Controlled Ragdolls:** Rapier 3D rigid bodies govern throwing mechanics, falling chairs, and slapstick collisions.
3. **Fictional & Satirical Setting:** 100% original fictional parties (e.g., *Rashtriya Pragati Dal (RPD)*, *Janata Kranti Front (JKF)*, *United Vikas Morcha (UVM)*), parody MP archetypes, and exaggerated comedic dialogue.
4. **Modular & Maintainable Architecture:** Clean separation of concerns between Three.js WebGL engine, React UI layer, Rapier physics step, and Zustand state store.
5. **No Broken Links or Fake Buttons:** Every menu item, setting, audio toggle, and gameplay mechanic is functional.
6. **Robust 60 FPS Browser Performance:** Level of Detail (LOD), batched/instanced rendering where appropriate, low memory allocations in the requestAnimationFrame loop.

---

## 3. Technology Architecture
- **Rendering Engine:** Three.js with WebGLRenderer, PerspectiveCamera, PBR materials (`MeshStandardMaterial`), directional sunlight, and shadow maps.
- **Physics Engine:** Rapier 3D (`@dimforge/rapier3d-compat`), running deterministic physics ticks synchronized with visual Three.js object meshes.
- **UI & State Management:** React 18 + Zustand store for game state (`menu`, `loading`, `playing`, `paused`, `debate`, `voting`, `chaos_mode`), MP stats, and HUD overlay.
- **Audio System:** Howler.js managing spatial sound, gavel slams, shouting murmurs, comedic airhorns, desk thumping, and satirical voice bytes.
- **Bundler & Build Pipeline:** Vite with React TypeScript plugin ensuring zero-error strict typing and production bundle optimization.

---

## 4. Multi-Phase Development Roadmap

### Phase 1: Engine Foundation, Architecture & Functional Main Menu (STATUS: ✅ COMPLETED & VERIFIED)
- Scaffolded Vite + React + TypeScript project architecture.
- Three.js Canvas container with resize handler, aspect ratio tracking, and cleanup on unmount.
- Rendering loop with delta-time clamping, FPS tracker, and animation dispatcher.
- Scene management with `SceneManager` supporting scene transitions.
- Zustand store (`useGameStore`) with state machine, audio toggles, and graphics presets.
- Functional Main Menu UI with Play, Customization (Soon), Settings, Controls, and Satirical Credits.

### Phase 2: Complete 3D Parliament Chamber Environment (STATUS: ✅ COMPLETED & VERIFIED)
- **Central Elevated Speaker Dais:** 3-tier elevation, Speaker's carved throne, mahogany desk, microphones, brass bell, gavel, and canopy crest.
- **Semicircular MP Seating:** 4 concentric curved tiers, desks, swiveling chairs, push-to-talk microphones, official dossiers, and water bottles; visually split into Treasury (Crimson) and Opposition (Blue) with central aisle.
- **The Well (Central Floor):** Spacious floor for future debates and ragdoll comedy, Table of the House, Secretariat chairs, and ceremonial Golden Mace.
- **Mezzanine Gallery:** Semicircular elevated balcony with brass and safety glass balustrades for press and visitors.
- **Grand Entrance:** Double mahogany doors, portal frame, illuminated signage, walk-through security scanner, and brass stanchions with velvet ropes.
- **Architecture & Dome:** Semicircular acoustic wainscoting, 16 monumental fluted sandstone columns, ribbed dome with central oculus and chandelier.
- **Materials & Lighting:** PBR material library (`MaterialLibrary`), realistic lighting (`ParliamentLighting`).
- **Inspection Camera System:** Orbit controls with damping, zoom limits, and 6 camera viewpoints (`1` to `6`).
- **Live HUD & Telemetry:** Decorum/Chaos meters, active legislation banner, geometry/FPS counters, action hotbar (Paper planes, Gavel, Desk thumping).
- **Automated Verification:** 10 browser screenshots captured, mobile responsiveness verified, zero TypeScript/Vite errors.

### Phase 3: Player Character & Third-Person Controller (STATUS: ✅ COMPLETED & VERIFIED)
- **Stylized Fictional MP Character (`PlayerCharacter.ts`):**
  - Fully rigged articulated humanoid skeleton with natural proportions (head, torso, arms, hands, legs, feet).
  - Indian Parliament formal attire: Royal blue Nehru jacket with mandarin collar and brass buttons, white khadi kurta, white pajamas, formal black Oxford shoes, gold wireframe spectacles, and traditional silk stole (angavastram).
  - Modular Customization architecture foundation (`CharacterCustomizationConfig`) supporting hairstyles, glasses, jackets, kurtas, colors, and party rosettes.
- **Third-Person Follow Camera (`ThirdPersonCamera.ts`):**
  - Smooth follow behind and slightly above the player with spherical yaw/pitch orbit.
  - Mouse look rotation with sensitivity controls, mouse wheel distance clamping ($1.6\text{m}$ to $7.5\text{m}$).
  - Environment boundary collision raycasting preventing camera clipping through walls, columns, or dais.
  - Seamless toggle with Inspection Camera (`V` key).
- **Player Movement & Kinematic Controller (`PlayerController.ts`):**
  - Desktop controls: WASD (camera-relative normalized diagonal vectors), Sprint (`Shift`), Jump (`Space`), Crouch (`C`), Interact (`E`), Emote (`Q`), Pause (`Esc`).
  - Speeds: Crouch ($1.9\text{m/s}$), Walk ($3.3\text{m/s}$), Run ($5.4\text{m/s}$), Sprint ($8.2\text{m/s}$).
  - Dynamic stamina system: drains at $22\text{pts/sec}$ when sprinting, regenerates when walking or idle.
  - Gravity ($g = -20\text{m/s}^2$), jump impulse ($+6.8\text{m/s}$), ground elevation queries, and landing detection.
- **Environment Collision System (`EnvironmentColliders.ts`):**
  - Resolves horizontal collisions with outer chamber wall, Table of the House, Speaker's Dais desk, and 16 columns.
  - Sliding collision resolution preventing getting stuck on corners or clipping through solid geometry.
  - Elevation queries supporting tier risers ($+0.5\text{m}$ to $+2.0\text{m}$) and dais stairs ($+1.2\text{m}$).
- **Procedural Animation State Machine (`AnimationStateMachine.ts`):**
  - 13 distinct animation states: `IDLE`, `WALK`, `RUN`, `SPRINT`, `JUMP_START`, `JUMP_LOOP`, `JUMP_LAND`, `CROUCH_IDLE`, `CROUCH_WALK`, `TURN`, `INTERACT`, `SIT`, `STAND`.
  - Smooth cross-fade blending ($0.22\text{s}$ duration) preventing animation snapping.
  - Kinematic bone driving with ground-speed synchronized gait cycles.
- **Player Interaction Foundation (`InteractionManager.ts`):**
  - Proximity detection radius ($2.5\text{m}$ to $3.0\text{m}$) for chamber relics (Speaker's Bell, Gavel, Golden Mace, Table of House, Benches, Security Scanner).
  - Dynamic HUD interaction prompt displaying `[E]` key and descriptive action text.
  - Interactive toast feedback banner on activation.
- **Mobile Touch Controls (`MobileControls.tsx`):**
  - Virtual joystick for analog movement, camera swipe touchpad on right side of screen.
  - Virtual action buttons for Jump (`🦘`), Sprint (`⚡`), Crouch (`🧘`), and Interact (`✋`).
- **Player HUD Overlay (`HUD.tsx`):**
  - Player identity badge ("Hon'ble MP Rajesh Sharma", "Jan Kalyan Front").
  - Animated stamina meter with color warning thresholds.
  - Live movement state indicator badge.
  - Camera mode toggle pill.
- **Automated Verification:** 10 end-to-end browser tests verified with zero errors, mobile touch controls validated, and 10 screenshot artifacts generated.

### Phase 4: Advanced Physics & Ragdoll System (STATUS: ✅ COMPLETED & VERIFIED)
- **Rapier 3D Integration (`PhysicsWorld.ts`):**
  - World initialized with gravity $(0, -18.0, 0)$ and $60\text{Hz}$ fixed sub-stepping accumulator.
  - 5 Collision filtering groups: Static Environment, Player Kinematic, Ragdoll Limbs, Dynamic Props, and Triggers.
  - Rigid body synchronization with Three.js object hierarchy.
  - Static colliders for chamber floor, elevated dais, Table of the House, and Speaker desk.
- **Full-Body Articulated Ragdoll System (`PlayerRagdoll.ts`):**
  - 11 Dynamic rigid bodies: Pelvis, Chest/Torso, Head, Left/Right Upper Arms, Forearms, Thighs, and Shins.
  - Linked via Rapier spherical and revolute impulse joints with damping ($0.6$ linear, $1.2$ angular).
  - Comedic ragdoll activation (`R` / `K` key or strong physical impact) with rotational impulse transfer.
  - Autonomous stabilization detection (kinetic energy threshold $< 0.25$) and face-up vs face-down orientation sensing.
  - Smooth get-up recovery transition ($0.45\text{s}$) restoring player controller stance at the settled position.
- **Interactive Chamber Physics Props (`PhysicsPropManager.ts`):**
  - MP Swivel Chairs: dynamic mass $14\text{kg}$, sliding and tipping physics.
  - Parliament Water Bottles: plastic/glass rolling and bouncing dynamics.
  - Official Bill Files / Dossiers: sliding and tumbling across desks and carpet.
  - Push-To-Talk Microphones: knockable gooseneck desktop props.
- **Pickup & Throw System (`PickupThrowSystem.ts`):**
  - Proximity detection ($2.2\text{m}$) for pickable props.
  - Hold socket positioning in front of character right chest with kinematic lock.
  - Throw mechanic (`Left Click`) with forward impulse arc ($18 - 28\text{N}\cdot\text{s}$).
  - Drop mechanic (`F` key).
- **Physical Collision Events & Impact Feedback (`CollisionEventSystem.ts`):**
  - Real-time Rapier `EventQueue` draining with impact velocity calculation.
  - Dynamic audio triggers: wood desk impact, bottle clatter, heavy body thuds.
  - Camera shake impulse proportional to physical impact force.
- **Physics Debug Viewer (`PhysicsDebugViewer.ts`):**
  - Development wireframe visualizer (`F3` key) rendering Rapier debug buffers.
- **Mobile Touch Controls Integration (`MobileControls.tsx`):**
  - Added Ragdoll Fall (`💥`) and Pick Up / Drop (`📦`) touch buttons.
- **Automated Verification:** 10 end-to-end browser tests verified with zero errors, 28 active physics bodies running at 60 FPS, and 10 screenshot artifacts generated.

### Phase 5: AI MP Personalities, Parliament Debate & Voting System (STATUS: PENDING AUTHORIZATION)

### Phase 5: AI Behaviors, Shouting, Walkouts & Marshals
- Crowd flocking and state machine for 16+ background MPs:
  - `IDLE_LISTENING`, `DESK_THUMPING`, `SHOUTING_SLOGANS`, `STORMING_THE_WELL`, `WALKOUT`.
- Security Marshals (*Sansad Suraksha Dal*):
  - Spawn when the Chaos Meter reaches 70%.
  - Physical interception: escort agitated MPs out of the chamber, create human cordons around the Speaker's dais.

### Phase 6: Debates, Voting, Speaker's Gavel & Chaos Events
- Dynamic Legislative Bills (satirical bills e.g., *"National Chai Subsidy Bill"*, *"Ban on Boring Speeches Act"*).
- Timed debate rounds with microphone privilege.
- Voting System:
  - Voice vote (*"Ayes"* vs *"Noes"* loudness competition).
  - Division voting with electronic voting switches on desks.
- Unscheduled Chaos Events:
  - Sudden Power Cut / Loadshedding in the chamber.
  - Intruder pigeon flying around the dome.
  - Microphones picking up accidental private phone gossip.

### Phase 7: Howler.js Audio System & Comedic Sound Design
- Layered procedural and sampled sound effects:
  - Resonant wooden gavel strikes with room reverb.
  - Crowd murmurs, desk thumping rumbles, shouting chants (*"Jawab Do!"*, *"Murdabad/Zindabad!"*).
  - Whistles, comedic slides, slapstick impacts, and dramatic breaking news musical stings.
- Audio ducking during Speaker interventions.

### Phase 8: Mobile/Responsive Controls, Performance Optimization & Arcade Hub Integration
- Virtual dual-stick / touch controls for mobile browsers.
- WebGL optimization: instanced meshes for parliament chairs, texture atlases, shadow map frustum culling.
- Integration with root `arcade_hub.html` as the premier 3D flagship title.
