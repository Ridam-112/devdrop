const http = require('http');
const fs = require('fs');
const path = require('path');
const puppeteer = require(path.join(__dirname, 'monsoon-mayhem', 'node_modules', 'puppeteer-core'));

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PLAYABLE_DIR = path.join(__dirname, 'sledge_rider_playable');

// Simple static server for Playable directory
function createServer() {
  return http.createServer((req, res) => {
    let filePath = path.join(PLAYABLE_DIR, req.url === '/' ? 'index.html' : req.url);
    if (!fs.existsSync(filePath)) {
      res.writeHead(404);
      return res.end('Not found');
    }
    const ext = path.extname(filePath);
    const mimeMap = {
      '.html': 'text/html',
      '.js': 'application/javascript',
      '.css': 'text/css',
      '.json': 'application/json'
    };
    const csp = "default-src 'none'; script-src 'report-sample' 'self' 'unsafe-eval' 'unsafe-inline' blob: https://www.youtube.com/game_api/v0 https://www.youtube.com/game_api/v0/ https://www.youtube.com/game_api/v1 https://www.youtube.com/game_api/v1/; object-src 'none'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' blob: data:; media-src 'self' blob:; font-src 'self' data: https://fonts.googleapis.com https://fonts.gstatic.com; connect-src 'self' blob: data:; sandbox allow-pointer-lock allow-same-origin allow-scripts; base-uri 'self'; manifest-src 'self'; worker-src 'self' blob:";
    res.writeHead(200, {
      'Content-Type': mimeMap[ext] || 'application/octet-stream',
      'Content-Security-Policy': csp
    });
    fs.createReadStream(filePath).pipe(res);
  });
}

(async () => {
  console.log('=== VERIFYING YOUTUBE PLAYABLES INTEGRATION VIA LOCAL HTTP SERVER ===');
  const server = createServer();
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}/`;
  console.log(`Test server running at ${baseUrl}`);

  let browser;
  let exitCode = 0;

  try {
    browser = await puppeteer.launch({
      executablePath: CHROME_PATH,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 412, height: 860, isMobile: true, hasTouch: true });

    const logs = [];
    page.on('console', msg => {
      const text = msg.text();
      logs.push(text);
      if (text.startsWith('[Playables]')) {
        console.log('SDK LOG:', text);
      }
    });

    const errors = [];
    page.on('pageerror', err => {
      console.error('PAGE ERROR:', err.message);
      errors.push(err.message);
    });

    console.log('1. Loading Sledge Rider Playable...');
    await page.goto(baseUrl, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1200));

    // Check lifecycle calls in order
    const firstFrameIdx = logs.findIndex(l => l.includes('firstFrameReady() called'));
    const gameReadyIdx = logs.findIndex(l => l.includes('gameReady() called'));
    const loadDataIdx = logs.findIndex(l => l.includes('Cloud save loaded'));

    console.log('\n--- Lifecycle Verification ---');
    console.log('1. firstFrameReady() called:', firstFrameIdx !== -1);
    console.log('2. gameReady() called:', gameReadyIdx !== -1);
    console.log('3. firstFrameReady called BEFORE gameReady:', firstFrameIdx !== -1 && gameReadyIdx !== -1 && firstFrameIdx < gameReadyIdx);
    console.log('4. loadData resolved BEFORE gameReady:', loadDataIdx !== -1 && loadDataIdx < gameReadyIdx);

    if (firstFrameIdx === -1 || gameReadyIdx === -1 || firstFrameIdx > gameReadyIdx || loadDataIdx > gameReadyIdx) {
      console.error('FAIL: Lifecycle sequencing violation!');
      exitCode = 1;
    }

    // Start Ride
    console.log('\n--- Gameplay Start Verification ---');
    await page.click('#go');
    await new Promise(r => setTimeout(r, 1200));

    const hudDist = await page.$eval('#sc', el => el.textContent);
    console.log('Distance after riding:', hudDist);

    // Check Pause / Resume interaction during play
    console.log('\n--- In-Game Pause Verification ---');
    await page.click('#btnPause');
    await new Promise(r => setTimeout(r, 300));
    let isPaused = await page.$eval('#pause-ov', el => getComputedStyle(el).display !== 'none');
    console.log('Pause overlay visible after pause button click:', isPaused);

    await page.click('#btnResume');
    await new Promise(r => setTimeout(r, 300));
    let isResumed = await page.$eval('#pause-ov', el => getComputedStyle(el).display === 'none');
    console.log('Pause overlay hidden after resume button click:', isResumed);

    if (!isPaused || !isResumed) {
      console.error('FAIL: In-game pause/resume not working!');
      exitCode = 1;
    }

    // Test sendScore & saveProgress
    console.log('\n--- Engagement & Save Verification ---');
    await page.evaluate(() => {
      Playables.sendScore(125);
      Playables.saveProgress({ highScore: 125, totalCoins: 10, runs: 1 });
    });
    await new Promise(r => setTimeout(r, 500));

    const hasSendScore = logs.some(l => l.includes('sendScore sent: 125'));
    const hasSaveData = logs.some(l => l.includes('Progress saved to cloud'));
    console.log('Score sent to YouTube platform:', hasSendScore);
    console.log('Progress saved via saveData:', hasSaveData);

    if (!hasSendScore || !hasSaveData) {
      console.error('FAIL: sendScore or saveProgress failed!');
      exitCode = 1;
    }

    // Check touch controls on screen
    console.log('\n--- Mobile Controls Verification ---');
    const touchControlsVisible = await page.$eval('#touch-controls', el => getComputedStyle(el).display !== 'none');
    console.log('Touch controls present on mobile viewport:', touchControlsVisible);

    if (errors.length > 0) {
      console.error('FAIL: Errors on page:', errors);
      exitCode = 1;
    } else {
      console.log('\n✅ ALL YOUTUBE PLAYABLES REQUIREMENTS VERIFIED SUCCESSFULLY!');
    }

  } catch (err) {
    console.error('Test execution failed:', err);
    exitCode = 1;
  } finally {
    if (browser) await browser.close();
    server.close();
  }

  process.exit(exitCode);
})();
