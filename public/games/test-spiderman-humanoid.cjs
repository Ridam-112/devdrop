const path = require('path');
const puppeteer = require(path.join(__dirname, 'monsoon-mayhem', 'node_modules', 'puppeteer-core'));

const ARTIFACT_DIR = 'C:\\Users\\thrid\\.gemini\\antigravity\\brain\\6057ccda-47b5-49d9-b9f7-ba3f5faa87ee';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

(async () => {
  console.log('Testing Spider-Man with 3D Human Character...');
  let browser;
  try {
    browser = await puppeteer.launch({
      executablePath: CHROME_PATH,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--allow-file-access-from-files']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });

    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', err => console.error('PAGE ERROR:', err.message));

    const fileUrl = 'file:///C:/Users/thrid/Downloads/game/40_spiderman_web_swing_2d.html';
    await page.goto(fileUrl, { waitUntil: 'load', timeout: 30000 });

    // Wait a brief moment
    await new Promise(r => setTimeout(r, 1000));

    // Click start button if present or start game
    await page.evaluate(() => {
      const startBtn = document.getElementById('startModalBtn') || document.querySelector('.start-btn') || document.querySelector('button');
      if (startBtn) startBtn.click();
    });

    await new Promise(r => setTimeout(r, 1200));

    // Capture screenshot 1: Character flight
    const shot1 = path.join(ARTIFACT_DIR, 'test_spiderman_humanoid_flight.png');
    await page.screenshot({ path: shot1 });
    console.log('Saved screenshot 1:', shot1);

    // Trigger a web swing to test dynamic body physics
    await page.evaluate(() => {
      // Simulate left mouse down or space key to attach web
      window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', code: 'Space' }));
    });

    await new Promise(r => setTimeout(r, 1500));

    // Capture screenshot 2: Web swing with dynamic body physics
    const shot2 = path.join(ARTIFACT_DIR, 'test_spiderman_humanoid_swing.png');
    await page.screenshot({ path: shot2 });
    console.log('Saved screenshot 2:', shot2);

    console.log('TEST COMPLETE SUCCESSFUL!');
  } catch (err) {
    console.error('Test error:', err);
  } finally {
    if (browser) await browser.close();
  }
})();
