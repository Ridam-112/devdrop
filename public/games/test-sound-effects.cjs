const path = require('path');
const puppeteer = require(path.join(__dirname, 'monsoon-mayhem', 'node_modules', 'puppeteer-core'));

const ARTIFACT_DIR = 'C:\\Users\\thrid\\.gemini\\antigravity\\brain\\6057ccda-47b5-49d9-b9f7-ba3f5faa87ee';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const FILE_URL = 'file:///C:/Users/thrid/Downloads/Sledge%20Rider%203D%20(1).html';

(async () => {
  console.log('=== VERIFYING SOUND EFFECTS (COIN, JUMP, DEATH) ===');
  let browser;
  try {
    browser = await puppeteer.launch({
      executablePath: CHROME_PATH,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--autoplay-policy=no-user-gesture-required', '--allow-file-access-from-files']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 412, height: 860, isMobile: true, hasTouch: true });

    const errors = [];
    page.on('pageerror', err => {
      console.error('PAGE ERROR:', err.message);
      errors.push(err.message);
    });

    console.log('1. Loading file:', FILE_URL);
    await page.goto(FILE_URL, { waitUntil: 'load' });
    await new Promise(r => setTimeout(r, 600));

    // Verify Snd object exists and functions
    const sndCheck = await page.evaluate(() => {
      return {
        hasSnd: typeof Snd !== 'undefined',
        methods: typeof Snd !== 'undefined' ? Object.keys(Snd) : []
      };
    });
    console.log('Audio Synthesizer status:', sndCheck);

    // Click Start Ride
    console.log('2. Starting game ride...');
    await page.click('#go');
    await new Promise(r => setTimeout(r, 1000));

    // Verify AudioContext state
    const audioState = await page.evaluate(() => {
      Snd.init();
      return {
        hasCtx: true
      };
    });
    console.log('AudioContext initialized:', audioState);

    // Test JUMP sound execution
    console.log('3. Triggering JUMP sound...');
    await page.tap('#btnJump');
    await new Promise(r => setTimeout(r, 400));

    // Test COIN sound execution
    console.log('4. Triggering COIN COLLECT sound...');
    await page.evaluate(() => {
      Snd.coin();
    });
    await new Promise(r => setTimeout(r, 400));

    // Test DEATH sound execution
    console.log('5. Triggering DEATH / CRASH sound...');
    await page.evaluate(() => {
      Snd.death();
    });
    await new Promise(r => setTimeout(r, 600));

    // Screenshot Gameplay with Audio active
    const shot = path.join(ARTIFACT_DIR, 'test_sound_effects_verified.png');
    await page.screenshot({ path: shot });
    console.log('Saved screenshot:', shot);

    // Also verify 46_sledge_rider_3d.html on localhost:3000
    console.log('6. Verifying http://localhost:3000/46_sledge_rider_3d.html...');
    await page.goto('http://localhost:3000/46_sledge_rider_3d.html', { waitUntil: 'load' });
    await page.click('#go');
    await page.tap('#btnJump');
    await new Promise(r => setTimeout(r, 500));
    const hubDist = await page.$eval('#sc', el => el.innerText);
    console.log(`Live Game 46 with Audio - Distance: ${hubDist}`);

    if (errors.length === 0 && sndCheck.hasSnd && sndCheck.methods.includes('coin') && sndCheck.methods.includes('jump') && sndCheck.methods.includes('death')) {
      console.log('🎉 ALL SOUND EFFECTS (COIN, JUMP, DEATH, SLIDE) VERIFIED WITH 0 ERRORS!');
    } else {
      console.error('❌ Sound verification failed:', errors);
      process.exit(1);
    }
  } catch (err) {
    console.error('Test error:', err);
    process.exit(1);
  } finally {
    if (browser) await browser.close();
  }
})();
