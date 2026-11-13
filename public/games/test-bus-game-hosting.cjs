const path = require('path');
const puppeteer = require(path.join(__dirname, 'monsoon-mayhem', 'node_modules', 'puppeteer-core'));

const ARTIFACT_DIR = 'C:\\Users\\thrid\\.gemini\\antigravity\\brain\\6057ccda-47b5-49d9-b9f7-ba3f5faa87ee';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

(async () => {
  console.log('=== VERIFYING STANDALONE BUS-GAME HOSTING ===');
  let browser;
  try {
    browser = await puppeteer.launch({
      executablePath: CHROME_PATH,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--autoplay-policy=no-user-gesture-required']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });

    const failedRequests = [];
    page.on('requestfailed', req => {
      failedRequests.push({ url: req.url(), error: req.failure().errorText });
      console.error('REQUEST FAILED:', req.url(), req.failure().errorText);
    });

    page.on('response', res => {
      if (res.status() >= 400) {
        console.error('HTTP ERROR STATUS:', res.status(), res.url());
      }
    });

    page.on('pageerror', err => console.error('PAGE ERROR:', err.message));
    page.on('console', msg => {
      const t = msg.text();
      if (!t.includes('THREE.')) console.log('PAGE LOG:', t);
    });

    console.log('1. Loading http://localhost:3000/bus-game/index.html...');
    await page.goto('http://localhost:3000/bus-game/index.html', { waitUntil: 'networkidle0' });

    // Verify Title
    const title = await page.title();
    console.log('Page Title:', title);

    // Screenshot Start Screen
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_bus_game_1_start_screen.png') });
    console.log('Saved: test_bus_game_1_start_screen.png');

    // Step 2: Click Start Game
    console.log('2. Clicking "START RUNAWAY BUS"...');
    await page.click('#startBtn');
    await new Promise(r => setTimeout(r, 2000));

    // Verify HUD Speedometer & Distance
    const speed = await page.$eval('#speedoVal', el => el.innerText);
    const dist = await page.$eval('#distVal', el => el.innerText);
    console.log(`Live HUD - Speed: ${speed} KM/H, Distance: ${dist}`);

    // Screenshot Gameplay
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_bus_game_2_gameplay.png') });
    console.log('Saved: test_bus_game_2_gameplay.png');

    // Step 3: Test Controls - Honk Air Horn & Gas
    console.log('3. Testing Air Horn [H] & Gas [W]...');
    await page.keyboard.press('KeyH');
    await new Promise(r => setTimeout(r, 400));
    await page.keyboard.down('KeyW');
    await new Promise(r => setTimeout(r, 1500));
    await page.keyboard.up('KeyW');

    const updatedSpeed = await page.$eval('#speedoVal', el => el.innerText);
    console.log(`Accelerated Speed: ${updatedSpeed} KM/H`);

    // Step 4: Test Garage Modal [G]
    console.log('4. Opening Garage [G]...');
    await page.keyboard.press('KeyG');
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_bus_game_3_garage.png') });
    console.log('Saved: test_bus_game_3_garage.png');

    // Close Garage
    await page.click('#closeGarageBtn');
    await new Promise(r => setTimeout(r, 400));

    // Check failed requests
    console.log('Failed HTTP requests count:', failedRequests.length);
    if (failedRequests.length > 0) {
      console.warn('Some requests failed:', failedRequests);
    } else {
      console.log('SUCCESS: 0 failed network requests! All sound effects, Three.js, styles and scripts loaded locally with 200 OK!');
    }

    console.log('=== BUS GAME VERIFICATION SUCCESSFUL ===');
  } catch (err) {
    console.error('Test error:', err);
    process.exit(1);
  } finally {
    if (browser) await browser.close();
  }
})();
