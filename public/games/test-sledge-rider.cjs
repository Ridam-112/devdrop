const path = require('path');
const puppeteer = require(path.join(__dirname, 'monsoon-mayhem', 'node_modules', 'puppeteer-core'));

const ARTIFACT_DIR = 'C:\\Users\\thrid\\.gemini\\antigravity\\brain\\6057ccda-47b5-49d9-b9f7-ba3f5faa87ee';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const FILE_URL = 'file:///C:/Users/thrid/Downloads/Sledge%20Rider%203D.html';

(async () => {
  console.log('=== VERIFYING SLEDGE RIDER 3D ENHANCEMENTS ===');
  let browser;
  try {
    browser = await puppeteer.launch({
      executablePath: CHROME_PATH,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--autoplay-policy=no-user-gesture-required', '--allow-file-access-from-files']
    });

    const page = await browser.newPage();
    // Emulate Mobile Device (Portrait 412x860)
    await page.setViewport({ width: 412, height: 860, isMobile: true, hasTouch: true });

    const errors = [];
    page.on('pageerror', err => {
      console.error('PAGE ERROR:', err.message);
      errors.push(err.message);
    });

    page.on('console', msg => {
      const t = msg.text();
      if (!t.includes('THREE.')) console.log('PAGE LOG:', t);
    });

    console.log('1. Loading file:', FILE_URL);
    await page.goto(FILE_URL, { waitUntil: 'load' });
    await new Promise(r => setTimeout(r, 1000));

    // Screenshot Start Screen
    const shot1 = path.join(ARTIFACT_DIR, 'test_sledge_rider_1_start.png');
    await page.screenshot({ path: shot1 });
    console.log('Saved:', shot1);

    // Verify Control Positions
    const layout = await page.evaluate(() => {
      const getRect = (el) => {
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { top: r.top, left: r.left, right: r.right, bottom: r.bottom, width: r.width, height: r.height };
      };
      return {
        jump: getRect(document.getElementById('btnJump')),
        left: getRect(document.getElementById('btnLeft')),
        right: getRect(document.getElementById('btnRight')),
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight
      };
    });

    console.log('Mobile Layout Coordinates:', JSON.stringify(layout, null, 2));

    const isJumpAboveLeft = layout.jump.top < layout.left.top && Math.abs(layout.jump.left - layout.left.left) < 30;
    const isLeftOnLeft = layout.left.left < layout.windowWidth * 0.35;
    const isRightOnRight = layout.right.right > layout.windowWidth * 0.65;

    console.log('Jump strictly above Left button:', isJumpAboveLeft);
    console.log('Left button on left side:', isLeftOnLeft);
    console.log('Right button on right side:', isRightOnRight);

    // Click Start Ride
    console.log('2. Clicking "Start Ride"...');
    await page.click('#go');
    await new Promise(r => setTimeout(r, 1500));

    // Test Tapping Jump
    console.log('3. Tapping JUMP button...');
    await page.tap('#btnJump');
    await new Promise(r => setTimeout(r, 400));

    // Test Steer Left & Right
    console.log('4. Tapping LEFT & RIGHT steer buttons...');
    await page.tap('#btnLeft');
    await new Promise(r => setTimeout(r, 300));
    await page.tap('#btnRight');
    await new Promise(r => setTimeout(r, 600));

    // Verify HUD Distance & Speed
    const hud = await page.evaluate(() => {
      return {
        dist: document.getElementById('sc').innerText,
        speed: document.getElementById('sp').innerText,
        coins: document.getElementById('co').innerText
      };
    });
    console.log('Live HUD stats:', hud);

    // Screenshot Gameplay
    const shot2 = path.join(ARTIFACT_DIR, 'test_sledge_rider_2_gameplay.png');
    await page.screenshot({ path: shot2 });
    console.log('Saved:', shot2);

    if (errors.length === 0 && isJumpAboveLeft && isLeftOnLeft && isRightOnRight) {
      console.log('🎉 SLEDGE RIDER 3D VERIFICATION SUCCESSFUL! 0 ERRORS!');
    } else {
      console.error('❌ VERIFICATION FAILED:', errors);
      process.exit(1);
    }
  } catch (err) {
    console.error('Test script error:', err);
    process.exit(1);
  } finally {
    if (browser) await browser.close();
  }
})();
