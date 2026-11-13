const path = require('path');
const puppeteer = require(path.join(__dirname, 'monsoon-mayhem', 'node_modules', 'puppeteer-core'));

const ARTIFACT_DIR = 'C:\\Users\\thrid\\.gemini\\antigravity\\brain\\6057ccda-47b5-49d9-b9f7-ba3f5faa87ee';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

(async () => {
  console.log('=== VERIFYING MOBILE PHONE LAYOUT FOR BUS GAME ===');
  let browser;
  try {
    browser = await puppeteer.launch({
      executablePath: CHROME_PATH,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--autoplay-policy=no-user-gesture-required']
    });

    const page = await browser.newPage();
    // Emulate Mobile Device (Portrait, e.g. Pixel 7 / iPhone 14)
    await page.setViewport({ width: 412, height: 860, isMobile: true, hasTouch: true });

    page.on('pageerror', err => console.error('PAGE ERROR:', err.message));
    page.on('console', msg => {
      const t = msg.text();
      if (!t.includes('THREE.')) console.log('PAGE LOG:', t);
    });

    console.log('1. Loading mobile bus game...');
    await page.goto('http://localhost:3000/bus-game/index.html', { waitUntil: 'networkidle0' });

    // Step 2: Click Start
    console.log('2. Starting game on phone...');
    await page.click('#startBtn');
    await new Promise(r => setTimeout(r, 1200));

    // Step 3: Check positions of controls
    const positions = await page.evaluate(() => {
      const getRect = (el) => {
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { top: r.top, left: r.left, right: r.right, bottom: r.bottom, width: r.width, height: r.height };
      };
      const horn = getRect(document.getElementById('btnHorn'));
      const left = getRect(document.getElementById('btnLeft'));
      const right = getRect(document.getElementById('btnRight'));
      const speedo = getRect(document.querySelector('.speedo-card'));
      return { horn, left, right, speedo, windowWidth: window.innerWidth, windowHeight: window.innerHeight };
    });

    console.log('Layout positions:', JSON.stringify(positions, null, 2));

    // Verify conditions:
    // 1. Horn is above Left button (horn.top < left.top)
    const isHornAboveLeft = positions.horn.top < positions.left.top && Math.abs(positions.horn.left - positions.left.left) < 30;
    console.log('Horn strictly above Left button:', isHornAboveLeft);

    // 2. Left is on the left side of the screen
    const isLeftOnLeft = positions.left.left < positions.windowWidth * 0.35;
    console.log('Left button on left side:', isLeftOnLeft);

    // 3. Right is on the right side of the screen
    const isRightOnRight = positions.right.right > positions.windowWidth * 0.65;
    console.log('Right button on right side:', isRightOnRight);

    // 4. Speedo is in between left and right
    const isSpeedoBetween = positions.speedo.left >= positions.left.right - 10 && positions.speedo.right <= positions.right.left + 10;
    console.log('Speedo between Left & Right buttons:', isSpeedoBetween);

    // 5. Test tapping Horn
    console.log('3. Tapping Horn button via touch...');
    await page.tap('#btnHorn');
    await new Promise(r => setTimeout(r, 600));

    // 6. Test tapping Left and Right
    console.log('4. Tapping Left and Right steer buttons...');
    await page.tap('#btnLeft');
    await new Promise(r => setTimeout(r, 400));
    await page.tap('#btnRight');
    await new Promise(r => setTimeout(r, 400));

    // Save screenshot
    const shotPath = path.join(ARTIFACT_DIR, 'test_bus_game_mobile_phone_layout.png');
    await page.screenshot({ path: shotPath });
    console.log('Saved screenshot:', shotPath);

    if (isHornAboveLeft && isLeftOnLeft && isRightOnRight && isSpeedoBetween) {
      console.log('✅ ALL MOBILE PHONE LAYOUT VERIFICATIONS PASSED!');
    } else {
      console.error('❌ LAYOUT VERIFICATION MISMATCH!');
    }
  } catch (err) {
    console.error('Test error:', err);
    process.exit(1);
  } finally {
    if (browser) await browser.close();
  }
})();
