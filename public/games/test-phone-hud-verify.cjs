const path = require('path');
const puppeteer = require(path.join(__dirname, 'monsoon-mayhem', 'node_modules', 'puppeteer-core'));

const ARTIFACT_DIR = 'C:\\Users\\thrid\\.gemini\\antigravity\\brain\\6057ccda-47b5-49d9-b9f7-ba3f5faa87ee';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

(async () => {
  console.log('Testing Phone HUD layout on bus game...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });

  // 1. Verify 42_no_brakes_desi_bus_driver_3d.html
  await page.goto('http://localhost:3000/42_no_brakes_desi_bus_driver_3d.html', { waitUntil: 'networkidle0' });
  await page.evaluate(() => {
    const btn = document.getElementById('startBtn');
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_bus_phone_hud_42.png') });
  console.log('Saved test_bus_phone_hud_42.png');

  // 2. Verify bus-game/index.html
  await page.goto('http://localhost:3000/bus-game/index.html', { waitUntil: 'networkidle0' });
  await page.evaluate(() => {
    const btn = document.getElementById('startBtn');
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_bus_phone_hud_busgame.png') });
  console.log('Saved test_bus_phone_hud_busgame.png');

  await browser.close();
  console.log('All tests completed successfully!');
})();
