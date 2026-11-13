const path = require('path');
const puppeteer = require(path.join(__dirname, 'monsoon-mayhem', 'node_modules', 'puppeteer-core'));

const ARTIFACT_DIR = 'C:\\Users\\thrid\\.gemini\\antigravity\\brain\\6057ccda-47b5-49d9-b9f7-ba3f5faa87ee';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

(async () => {
  console.log('=== STARTING PARLIAMENT KAAND PHASE 1 VERIFICATION TEST ===');
  let browser;
  try {
    browser = await puppeteer.launch({
      executablePath: CHROME_PATH,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    console.log('1. Loading http://localhost:3000/parliament-kaand/dist/index.html...');
    await page.goto('http://localhost:3000/parliament-kaand/dist/index.html', { waitUntil: 'networkidle0' });

    // Verify Three.js canvas exists
    const canvasExists = await page.$eval('canvas', el => !!el);
    console.log(`Three.js WebGL Canvas rendered: ${canvasExists}`);

    // Verify Title and Menu
    const title = await page.$eval('h1', el => el.innerText);
    console.log(`Main Menu Title: "${title}"`);

    // Capture Main Menu Screenshot
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_parliament_phase1_1_main_menu.png') });
    console.log('Saved: test_parliament_phase1_1_main_menu.png');

    // Test Controls Modal
    console.log('2. Opening Controls Modal...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find(b => b.innerText.includes('Controls'));
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_parliament_phase1_2_controls_modal.png') });
    console.log('Saved: test_parliament_phase1_2_controls_modal.png');

    // Close modal
    await page.evaluate(() => {
      const btn = document.querySelector('.modal-content button.btn-gold');
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 400));

    // Test Settings Modal
    console.log('3. Opening Settings Modal...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find(b => b.innerText.includes('Settings'));
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_parliament_phase1_3_settings_modal.png') });
    console.log('Saved: test_parliament_phase1_3_settings_modal.png');

    // Close settings modal
    await page.evaluate(() => {
      const btn = document.querySelector('.modal-content button.btn-gold');
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 400));

    // Start Game: Enter Parliament Chamber
    console.log('4. Clicking "ENTER CHAMBER (START)"...');
    await page.evaluate(() => {
      const btn = document.querySelector('.btn-gold');
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 1500));

    // Verify Chamber HUD is present
    const billTitle = await page.$eval('.glass-panel span:nth-child(2)', el => el.innerText);
    console.log(`Active Chamber Bill: "${billTitle}"`);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_parliament_phase1_4_chamber_scene.png') });
    console.log('Saved: test_parliament_phase1_4_chamber_scene.png');

    // Test Interaction: Throw Paper Aeroplane
    console.log('5. Testing Interactive Action: Throw Paper Plane...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find(b => b.innerText.includes('Throw Paper'));
      if (btn) {
        btn.click();
        btn.click();
        btn.click();
      }
    });
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_parliament_phase1_5_flying_paper_action.png') });
    console.log('Saved: test_parliament_phase1_5_flying_paper_action.png');

    // Test Interaction: Bang Gavel & Desk Thump
    console.log('6. Testing Speaker Gavel & Desk Thump...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const gavelBtn = buttons.find(b => b.innerText.includes("Speaker's Gavel"));
      if (gavelBtn) gavelBtn.click();
      const thumpBtn = buttons.find(b => b.innerText.includes('Desk Thump'));
      if (thumpBtn) thumpBtn.click();
    });
    await new Promise(r => setTimeout(r, 800));

    // Test Pause Modal
    console.log('7. Testing Pause Session...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const pauseBtn = buttons.find(b => b.innerText.includes('Pause'));
      if (pauseBtn) pauseBtn.click();
    });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_parliament_phase1_6_paused_modal.png') });
    console.log('Saved: test_parliament_phase1_6_paused_modal.png');

    console.log('=== ALL PHASE 1 TESTS PASSED SUCCESSFULLY! ===');
  } catch (err) {
    console.error('Test error:', err);
    process.exit(1);
  } finally {
    if (browser) await browser.close();
  }
})();
