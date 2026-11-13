const path = require('path');
const puppeteer = require(path.join(__dirname, 'monsoon-mayhem', 'node_modules', 'puppeteer-core'));

const ARTIFACT_DIR = 'C:\\Users\\thrid\\.gemini\\antigravity\\brain\\6057ccda-47b5-49d9-b9f7-ba3f5faa87ee';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const FILE_URL = 'file:///C:/Users/thrid/Downloads/Sledge%20Rider%203D%20(1).html';

(async () => {
  console.log('=== VERIFYING SLEDGE RIDER 3D (1) ENHANCEMENTS ===');
  let browser;
  try {
    browser = await puppeteer.launch({
      executablePath: CHROME_PATH,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--allow-file-access-from-files']
    });

    const page = await browser.newPage();
    // Emulate Mobile Device (Portrait 412x860)
    await page.setViewport({ width: 412, height: 860, isMobile: true, hasTouch: true });

    const errors = [];
    page.on('pageerror', err => {
      console.error('PAGE ERROR:', err.message);
      errors.push(err.message);
    });

    console.log('1. Loading file:', FILE_URL);
    await page.goto(FILE_URL, { waitUntil: 'load' });
    await new Promise(r => setTimeout(r, 1000));

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
        avb: getRect(document.getElementById('avb')),
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight
      };
    });

    console.log('Mobile Layout Coordinates:', JSON.stringify(layout, null, 2));

    const isJumpAboveLeft = layout.jump.top < layout.left.top && Math.abs(layout.jump.left - layout.left.left) < 30;
    const isLeftOnLeft = layout.left.left < layout.windowWidth * 0.35;
    const isRightOnRight = layout.right.right > layout.windowWidth * 0.65;
    const isAvbBetween = layout.avb.left >= layout.left.right - 20 && layout.avb.right <= layout.right.left + 20;

    console.log('Jump strictly above Left button:', isJumpAboveLeft);
    console.log('Left button on left side:', isLeftOnLeft);
    console.log('Right button on right side:', isRightOnRight);
    console.log('Avalanche bar centered between buttons:', isAvbBetween);

    // Click Start Ride
    console.log('2. Clicking "Start Ride"...');
    await page.click('#go');
    await new Promise(r => setTimeout(r, 1500));

    // Test Tapping Jump
    console.log('3. Tapping JUMP button...');
    await page.tap('#btnJump');
    await new Promise(r => setTimeout(r, 500));

    // Test Steer Left & Right
    console.log('4. Tapping LEFT & RIGHT steer buttons...');
    await page.tap('#btnLeft');
    await new Promise(r => setTimeout(r, 400));
    await page.tap('#btnRight');
    await new Promise(r => setTimeout(r, 800));

    // Verify HUD Distance & Speed
    const hud = await page.evaluate(() => {
      return {
        dist: document.getElementById('sc').innerText,
        speed: document.getElementById('sp').innerText,
        coins: document.getElementById('co').innerText,
        avbWidth: document.querySelector('#avb i').style.width
      };
    });
    console.log('Live HUD stats:', hud);

    // Screenshot Gameplay
    const shot = path.join(ARTIFACT_DIR, 'test_sledge_rider_1_gameplay.png');
    await page.screenshot({ path: shot });
    console.log('Saved:', shot);

    // Step 5: Test Game 46 on localhost
    console.log('5. Loading http://localhost:3000/46_sledge_rider_3d.html...');
    await page.goto('http://localhost:3000/46_sledge_rider_3d.html', { waitUntil: 'load' });
    await page.click('#go');
    await new Promise(r => setTimeout(r, 1200));
    const shot46 = path.join(ARTIFACT_DIR, 'test_46_sledge_rider_mobile.png');
    await page.screenshot({ path: shot46 });
    console.log('Saved:', shot46);

    if (errors.length === 0 && isJumpAboveLeft && isLeftOnLeft && isRightOnRight) {
      console.log('🎉 SLEDGE RIDER 3D (1) & GAME 46 VERIFICATION SUCCESSFUL!');
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
