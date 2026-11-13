# 🦖 Dino Escape: Adventure Game

An action-packed HTML5 Canvas 2D prehistoric endless survival runner and adventure game built with zero external dependencies.

---

## 🌟 Game Overview

In **Dino Escape: Adventure Game**, you play as a brave dinosaur escaping an apocalyptic volcanic eruption across multiple prehistoric biomes. Dodge obsidian ground spikes, roll or jump past volcanic boulders, slide under flying pterodactyls, roar away hazards with sonic shockwaves, and survive flaming meteor showers!

---

## 🎮 How to Play

### Launching the Game
Simply open [index.html](file:///c:/Users/thrid/Downloads/game/index.html) in any modern web browser (Google Chrome, Microsoft Edge, Firefox, Safari).

### Controls

| Action | Keyboard Controls | Mobile / Touch |
| :--- | :--- | :--- |
| **Jump** | `Space`, `W`, or `↑` (Tap twice for **Double Jump**) | ⬆️ Jump button or upper canvas tap |
| **Slide / Duck** | `S` or `↓` | ⬇️ Slide button |
| **Roar Shockwave** | `X`, `Z`, or `J` (Uses 35% stamina) | 📢 Roar button |
| **Pause Game** | `Escape` or `P` | Top bar / menu |

---

## 🌋 Features & Mechanics

1. **Dynamic Dinosaur Character & Animations**
   - Procedural vector-rendered dinosaur with running leg cycles, head bobbing, tail physics, sliding crouch, jump tuck, and blink invulnerability.
   - 4 Dino Skins:
     - 🦖 **Emerald Rex** (Classic Jungle Raptor)
     - 🌋 **Magma Dino** (Molten Rock & Fiery Spines)
     - ⚡ **Cyber Neon** (Futuristic Glowing Cyber Dinosaur)
     - 👑 **Golden Fossil** (Legendary Amber Sheen)

2. **Prehistoric Hazards & Enemies**
   - **Obsidian Spikes & Cacti**: Sharp ground hazards to jump over.
   - **Volcanic Boulders**: Rolling and stationary rocks that can be blasted with your Roar.
   - **Pterodactyls**: Flying at high, mid, and low elevations (requires sliding under mid-level pterosaurs!).
   - **Meteor Strikes**: Flaming meteorites crash with smoke trails, ground impact warnings, and screen shake!

3. **Power-Ups & Collectibles**
   - 💎 **Amber Gems**: Collect gems to increase your score and unlock prehistoric glory.
   - 🥩 **Dragon Fruit / Meat**: Refills your Roar shockwave stamina bar.
   - 🛡 **Shield Egg**: Grants a glowing bubble that absorbs 1 obstacle hit.
   - ⚡ **Frenzy Pepper / Star Shroom**: Activates **Frenzy Rush** — temporary invulnerability that pulverizes every obstacle in your path!

4. **Biomes & Parallax Landscapes**
   - Smooth multi-layer parallax scrolling:
     - 🌲 **Jurassic Jungle**: Rich dusk skies, lush ferns, distant smoking peaks.
     - 🌋 **Volcanic Ridge**: Crimson skies, active volcanic eruptions, and bubbling magma crevices.
     - 🔮 **Obsidian Canyons**: Twilight obsidian spires with glowing prehistoric atmosphere.

5. **Built-in Procedural Audio Synthesizer**
   - 100% offline, zero-asset Web Audio API sound system:
     - Melodic retro chiptune and drum beat loop.
     - Retro jump, double jump, duck slide, roar blast, gem chime, explosion, and game over sounds.
     - Mute/Unmute sound toggle at any time.

6. **Local Record Saving**
   - High score and collected gems are persistently saved via `localStorage`.

---

## 📁 File Structure

- [index.html](file:///c:/Users/thrid/Downloads/game/index.html) - **Complete All-in-One Standalone File** containing HTML, CSS, procedural audio engine, and canvas game loop. Just open this single file anywhere to play!
