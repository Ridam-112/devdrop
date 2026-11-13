# 🚌 No Brakes Desi Bus Driver 3D — Standalone Web Game

Ekdom standalone 3D Desi Bus Game folder! Ekhane shob assets, sound effects, meme sounds, Three.js library, CSS ebong JavaScript code ekta folder-er bhetore rakha hoyeche jate tumi shojei jekono static web host ba local server-e host korte paro kono dependency chara.

---

## 📁 Folder Structure

```
bus-game/
├── index.html          # Main Entrypoint (Game Canvas + HUD + Garage Modals)
├── three.min.js        # Offline Standalone Three.js Library (r128)
├── css/
│   └── style.css       # Complete UI/HUD Styling, Claymorphic Controls & Overlays
├── js/
│   ├── audio.js        # Web Audio Engine (Diesel Synth, Turbos, Horns, Sirens)
│   ├── bus.js          # 3D Procedural Indian Bus Model, Physics, Suspensions, Liveries
│   ├── traffic.js      # Procedural Indian Traffic (Autorickshaws, Trucks, Cows, Scooters)
│   ├── city.js         # Infinite Highway, Chai Tapri, Toll Booths, Coconut Trees
│   └── game.js         # Core Game Loop, Input Handlers, Chaos Engine, Garage System
├── audio/              # All 13 Desi & Meme Audio Clips:
│   ├── bus_horn_0001.mp3
│   ├── bhai-ne-bola-karnekka.mp3
│   ├── gian-hain-aap.mp3
│   ├── hindi-dhimdom_MhPSSy9.mp3
│   ├── im-gonna-put-some-dirt-in-your-eye.mp3
│   ├── i_am_spiderman.mp3
│   ├── jaldi_waha_se_hato.mp3
│   ├── ma-ka-bhosda-aag.mp3
│   ├── my-back_mLIbOp0.mp3
│   ├── sourav-joshi-ki-amma-tmkb-(slowed)-made-with-Voicemod.mp3
│   ├── spiderman-meme-song.mp3
│   ├── tobey-i-missed-the-part-where-thats-my-problem.mp3
│   └── uth-jaa.mp3
└── README.md
```

---

## 🚀 How to Host (Kivabe Host Korbe)

### 1. GitHub Pages (Sobcheye Shoj & Free)
1. Ei `bus-game` folder-er bhetorer file gulo ekta nuton GitHub Repository-te upload koro (ba repository-r root-e rakho).
2. GitHub Repository Settings > **Pages** e jao.
3. Source select koro **Deploy from a branch** > branch **main** / **root** > **Save**.
4. 1-2 minite-er modhye tomar free live link peye jabe!

### 2. Vercel (One-Click Drag & Drop)
1. [vercel.com](https://vercel.com) e login koro.
2. Direct ei `bus-game` folder-ta drag & drop koro ba GitHub theke import koro.
3. Kono build command lagbe na (Static HTML). Just **Deploy** click koro.

### 3. Netlify
1. [app.netlify.com/drop](https://app.netlify.com/drop) e jao.
2. Direct ei `bus-game` folder drag & drop koro.
3. Instant live link ready!

### 4. Local Computer / Mobile Test
Jodi nijer computer-e run korte chao:
- **VS Code Live Server**: `bus-game/index.html`-e right-click kore **Open with Live Server**.
- **Python**: `cd bus-game` then `python -m http.server 8000`
- **Node.js**: `npx serve bus-game`

---

## 🎮 Game Controls
- **W / Up Arrow**: Full Throttle (Speed Barano)
- **A / D / Left & Right Arrows**: Steering (Left/Right Mor)
- **Space**: Handbrake / Drift
- **H**: Musical 5-Tone Indian Pressure Air Horn (Pee-Poo-Pee!)
- **Shift**: Nitrous Boost (NOS Fire)
- **R**: Desi Cassette Radio (Dhaba Beats / 90s Highway / Lofi)
- **G**: Open / Close Bus Garage (Liveries, Roof Luggage, Spoilers)
- **C**: Camera Switch (Third Person / Driver POV / Cinema Bumper)
