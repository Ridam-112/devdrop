const path = require('path');
const puppeteer = require(path.join(__dirname, 'monsoon-mayhem', 'node_modules', 'puppeteer-core'));

const ARTIFACT_DIR = 'C:\\Users\\thrid\\.gemini\\antigravity\\brain\\6057ccda-47b5-49d9-b9f7-ba3f5faa87ee';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

(async () => {
  console.log('=== VERIFYING GAME 46 IN ARCADE HUB ===');
  let browser;
  try {
    browser = await puppeteer.launch({
      executablePath: CHROME_PATH,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--allow-file-access-from-files']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    page.on('pageerror', err => console.error('PAGE ERROR:', err.message));

    console.log('1. Loading arcade_hub.html on localhost:3000...');
    await page.goto('http://localhost:3000/arcade_hub.html', { waitUntil: 'networkidle0' });

    // Verify Game 46 card exists
    const game46Card = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('.game-card'));
      const card46 = cards.find(c => c.innerText.includes('46. Sledge Rider 3D'));
      return card46 ? card46.innerText : null;
    });

    console.log('Game 46 Card in Hub:', game46Card);

    // Save screenshot of Hub showing Game 46
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_hub_game_46.png') });
    console.log('Saved test_hub_game_46.png');

    // 2. Click Play Now on Game 46
    console.log('2. Loading 46_sledge_rider_3d.html...');
    await page.goto('http://localhost:3000/46_sledge_rider_3d.html', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 800));

    // Verify Title & Start Button
    const title = await page.title();
    console.log('Page Title:', title);

    // Click Start Ride
    await page.click('#go');
    await new Promise(r => setTimeout(r, 1500));

    const hudDist = await page.$eval('#sc', el => el.innerText);
    const hudSpeed = await page.$eval('#sp', el => el.innerText);
    console.log(`Live Game 46 - Distance: ${hudDist}, Speed: ${hudSpeed} KM/H`);

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_game_46_active.png') });
    console.log('Saved test_game_46_active.png');

    // Test Hub link
    console.log('3. Clicking Hub button in game HUD...');
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'load' }),
      page.click('a[href="arcade_hub.html"]')
    ]);
    const hubTitle = await page.title();
    console.log('Navigated back to Hub:', hubTitle);

    if (game46Card && hubTitle.includes('46 Games')) {
      console.log('🎉 ALL GAME 46 CHECKS PASSED PERFECTLY!');
    } else {
      console.error('❌ Check mismatch');
      process.exit(1);
    }
  } catch (err) {
    console.error('Test error:', err);
    process.exit(1);
  } finally {
    if (browser) await browser.close();
  }
})();
