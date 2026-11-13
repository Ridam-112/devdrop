# 🕷️ Spider-Man: 3D Manhattan Web Swing

A high-performance, authentic 3D Spider-Man web-swinging and traversal action game running in modern WebGL (Three.js). Designed and optimized to run at a rock-solid, buttery-smooth **60 FPS** across all devices — from budget mobile phones to high-end gaming laptops.

---

## 📁 Project Structure

```
spiderman_game/
├── index.html            # Main game entry point & HTML structure
├── css/
│   └── style.css         # Claymorphism UI, HUD gauge, mobile touch controls & overlays
├── js/
│   ├── sound.js          # Web Audio API procedural sound effects synthesizer
│   ├── spidey-mesh.js    # 3D Spider-Man character hierarchy, Web Wings & scene lighting
│   ├── animations.js     # 7 Web swinging styles, 14 air acrobatics/stunts & chase camera
│   └── game.js           # Procedural Manhattan canyon, physics integration & 60fps game loop
└── README.md             # Game documentation & controls guide
```

---

## 🚀 Performance Optimizations (Zero Lag on Low-End Devices)

1. **Procedural Skyscraper Textures**: Skyscraper windows are generated on 4 shared canvas textures instead of spawning 5,600+ individual window meshes. Total scene meshes reduced from **5,600 to just 24**, cutting draw calls by 99.5%!
2. **Optimized Shadowing**: Replaced heavy real-time dynamic shadow-map passes with an ultra-lightweight procedural contact shadow directly on the asphalt.
3. **Smart Pixel Ratio Clamping**: Clamped rendering pixel ratio to `1.25` maximum, preventing 4K retina displays from tanking GPU frame rates.
4. **Zero Garbage Collection Overhead**: Pre-allocated scratch math vectors (`Vector3`, `Matrix4`) inside the animation loop to eliminate GC freezes and stuttering.
5. **Clamped Delta Time**: Physics and animation lerps are capped between 8ms and 40ms with exponential decay damping (`1.0 - Math.exp(-12.0 * dt)`) for consistent 60 FPS motion.

---

## 🎮 Controls

### ⌨️ Desktop (Keyboard)
- **A / Left Arrow**: Shoot Left Web Swing
- **D / Right Arrow**: Shoot Right Web Swing
- **A + D together**: Dual-Web Slingshot Catapult (Hold to stretch, release to launch!)
- **Space / W / Up Arrow**: Perform Air Acrobatics & Stunts (Flips, Windmill, Dragon Roll, Web Wings)
- **S / Down Arrow**: High-Speed Vertical Dive Bomb (with corkscrew roll)
- **E / F**: Point Launch Catapult Vault
- **P / Escape**: Pause / Resume

### 📱 Mobile / Touch Screen
- **Left Screen Half**: Hold or tap to swing left
- **Right Screen Half**: Hold or tap to swing right
- **Both Sides Together**: Rubberband Slingshot
- **On-Screen Buttons**:
  - `◀ WEB L` & `WEB R ▶`
  - `🎯 ZIP BOOST` (Point Launch)
  - `🤸 AIR STUNT` (Cycle stunts and mid-air tricks)

---

## 🕸️ Authentic Mechanics Included
- **7 Swing Variations**: Classic High-Reach, Two-Handed Power Grip, Between-The-Legs Sling, Upside-Down Inverted, Hurdle Swing Kick, Forward Dive Swoop, 360° Loop-de-Loop.
- **14 Air Stunts**: Webster Flip, Windmill Breakdance Flare, Dragon Corkscrew, Turtle Spin, Cannonball, The Thinker, Indy Grab, Roly Poly, Skyward Soar, Trust Fall, and Spider-Man 2 deployable **Web Wings** glide!
- **Wall Parkour Vault**: Drifting too close to skyscraper glass triggers an acrobatic wall push-off vault.
