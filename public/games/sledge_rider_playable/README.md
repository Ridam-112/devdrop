# Sledge Rider 3D - YouTube Playables Integration

This directory and the accompanying `sledge_rider_playable.zip` contain the production-ready build of **Sledge Rider 3D** formatted and certified for **YouTube Playables**.

Official Google Playables Guide: [YouTube Playables Developer Documentation](https://developers.google.com/youtube/gaming/playables/reference/getting_started)  
Test Suite Guide: [YouTube Playables Test Suite Guide](https://developers.google.com/youtube/gaming/playables/reference/test_suite_guide)

---

## 🔒 Content Security Policy (CSP)

The game incorporates Google's mandatory CSP policy for YouTube Playables:
```http
Content-Security-Policy: default-src 'none'; script-src 'report-sample' 'self' 'unsafe-eval' 'unsafe-inline' blob: https://www.youtube.com/game_api/v0 https://www.youtube.com/game_api/v0/ https://www.youtube.com/game_api/v1 https://www.youtube.com/game_api/v1/; object-src 'none'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' blob: data:; media-src 'self' blob:; font-src 'self' data: https://fonts.googleapis.com https://fonts.gstatic.com; connect-src 'self' blob: data:; sandbox allow-pointer-lock allow-same-origin allow-scripts; base-uri 'self'; manifest-src 'self'; worker-src 'self' blob:
```

- Embedded directly in `<head>` of `index.html` via `<meta http-equiv="Content-Security-Policy">`.
- Enforced as HTTP response headers by `serve_test_suite.cjs` and automated test runners.

---

## 🚀 YouTube Playables SDK Compliance Checklist

| Requirement | Implementation Details | Status |
| :--- | :--- | :--- |
| **Content Security Policy** | Configured as per Google's Test Suite Guide without any violations or blocked assets. | ✅ Compliant |
| **SDK Script Injection** | `<script src="https://www.youtube.com/game_api/v1"></script>` is loaded in `<head>` **first**, before any other script. | ✅ Compliant |
| **Root index.html** | `index.html` is at the root of the `.zip` package. | ✅ Compliant |
| **No External Assets / CDNs** | `three.min.js` is bundled locally. Audio & graphics are 100% procedurally generated (zero remote fetches). | ✅ Compliant |
| **Bundle Sizing** | Total zip bundle size is **~163 KB** (limit is 30 MiB). Instant loading. | ✅ Compliant |
| **Lifecycle: `firstFrameReady`** | Called right after the first WebGL frame renders to canvas. | ✅ Compliant |
| **Lifecycle: `gameReady`** | Called once cloud data is loaded and user can interact with the start menu (`firstFrameReady` is called strictly before `gameReady`). | ✅ Compliant |
| **System Pause / Resume** | Handled via `ytgame.system.onPause` & `ytgame.system.onResume` + in-game pause button `⏸️`. | ✅ Compliant |
| **System Audio Policy** | Synchronized with `ytgame.system.isAudioEnabled` and `ytgame.system.onAudioEnabledChange` with Web Audio muting. | ✅ Compliant |
| **Cloud Save (`loadData`/`saveData`)** | `loadData()` is awaited on boot before calling `saveData()`. Saves `highScore`, `totalCoins`, and `runs`. | ✅ Compliant |
| **Score Engagement** | `ytgame.engagement.sendScore({ value: distance })` sent on game over / wipeout. | ✅ Compliant |
| **Mobile & Touch Friendly** | Safe area insets (`env(safe-area-inset-bottom)`), responsive on-screen touch steering (Left, Right, Jump above Left). | ✅ Compliant |

---

## 📦 Package Files

1. **`index.html`** - The game source with YouTube Playables SDK integration and CSP meta tag.
2. **`three.min.js`** - Standalone local Three.js build (no CDN network calls).
3. **`../sledge_rider_playable.zip`** - Pre-built zip archive containing `index.html` and `three.min.js` directly at the root, ready to upload to YouTube Playables.
4. **`../serve_test_suite.cjs`** - Local HTTP server that injects the required CSP header for testing in the official YouTube Playables Test Suite.

---

## 🧪 Testing with YouTube Playables Test Suite

1. Start the CSP-enabled local server:
   ```bash
   node serve_test_suite.cjs
   ```
2. Open the [YouTube Playables Test Suite Guide](https://developers.google.com/youtube/gaming/playables/reference/test_suite_guide) in your browser.
3. Enter your local URL: `http://localhost:8080/`.
4. Run all checks (Lifecycle, Pause/Resume, Mute, CSP validation).
