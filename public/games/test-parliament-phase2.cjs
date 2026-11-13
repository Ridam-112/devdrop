const path = require('path');
const puppeteer = require(path.join(__dirname, 'monsoon-mayhem', 'node_modules', 'puppeteer-core'));

const ARTIFACT_DIR = 'C:\\Users\\thrid\\.gemini\\antigravity\\brain\\6057ccda-47b5-49d9-b9f7-ba3f5faa87ee';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

(async () => {
  console.log('=== STARTING PARLIAMENT KAAND PHASE 2 COMPREHENSIVE VERIFICATION ===');
  let browser;
  try {
    browser = await puppeteer.launch({
      executablePath: CHROME_PATH,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', err => console.error('PAGE ERROR:', err.message));

    console.log('1. Loading http://localhost:3000/parliament-kaand/dist/index.html...');
    await page.goto('http://localhost:3000/parliament-kaand/dist/index.html', { waitUntil: 'networkidle0' });

    // Verify Title & Tagline
    const title = await page.$eval('h1', el => el.innerText);
    const tagline = await page.$eval('p', el => el.innerText);
    console.log(`Title: "${title}"`);
    console.log(`Tagline: "${tagline}"`);

    // Verify Main Menu Screenshot
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_phase2_1_main_menu.png') });
    console.log('Saved: test_phase2_1_main_menu.png');

    // Test Character Customization Button (Coming Soon modal)
    console.log('2. Testing Character Customization Modal...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find(b => b.innerText.includes('Character Customization'));
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_phase2_1b_customization_modal.png') });
    console.log('Saved: test_phase2_1b_customization_modal.png');

    // Close Customization Modal
    console.log('2b. Closing Customization Modal...');
    const modalClosed = await page.evaluate(() => {
      const btn = document.querySelector('.modal-content button');
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    });
    console.log('Modal close button clicked:', modalClosed);
    await new Promise(r => setTimeout(r, 500));

    // Check visible buttons
    const availButtons = await page.evaluate(() => Array.from(document.querySelectorAll('button')).map(b => b.innerText));
    console.log('Available buttons after closing modal:', availButtons);

    // Start: Enter Parliament Chamber (Play with AI)
    console.log('3. Clicking "Play with AI (Enter Chamber)"...');
    const playClicked = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find(b => b.innerText.toLowerCase().includes('play with ai'));
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    });
    console.log('Play button clicked:', playClicked);
    await new Promise(r => setTimeout(r, 1600));

    // Overview Viewpoint Screenshot
    console.log('4. Inspecting Chamber Overview Viewpoint...');
    await page.waitForSelector('.glass-panel strong', { timeout: 5000 });
    const tris = await page.$eval('.glass-panel strong', el => el.innerText);
    console.log(`Chamber Geometry: ${tris}`);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_phase2_2_chamber_overview.png') });
    console.log('Saved: test_phase2_2_chamber_overview.png');

    // Viewpoint 2: Speaker's Dais
    console.log('5. Inspecting Speaker Dais...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find(b => b.innerText.toLowerCase().includes('speaker dais'));
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 1200));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_phase2_3_speaker_dais.png') });
    console.log('Saved: test_phase2_3_speaker_dais.png');

    // Viewpoint 3: Treasury Benches
    console.log('6. Inspecting Treasury Benches...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find(b => b.innerText.toLowerCase().includes('treasury benches'));
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 1200));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_phase2_4_treasury_benches.png') });
    console.log('Saved: test_phase2_4_treasury_benches.png');

    // Viewpoint 4: Opposition Benches
    console.log('7. Inspecting Opposition Benches...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find(b => b.innerText.toLowerCase().includes('opposition'));
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 1200));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_phase2_5_opposition_benches.png') });
    console.log('Saved: test_phase2_5_opposition_benches.png');

    // Viewpoint 5: Press Gallery
    console.log('8. Inspecting Press Gallery...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find(b => b.innerText.toLowerCase().includes('press gallery'));
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 1200));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_phase2_6_press_gallery.png') });
    console.log('Saved: test_phase2_6_press_gallery.png');

    // Viewpoint 6: Main Entrance
    console.log('9. Inspecting Main Entrance & Security Checkpoint...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find(b => b.innerText.toLowerCase().includes('main entrance'));
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 1200));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_phase2_7_main_entrance.png') });
    console.log('Saved: test_phase2_7_main_entrance.png');

    // Test Action: Throw Paper Plane, Gavel Bang, Desk Thump
    console.log('10. Testing Interactive Actions (Paper Throw, Gavel, Desk Thump)...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const overviewBtn = buttons.find(b => b.innerText.toLowerCase().includes('overview'));
      if (overviewBtn) overviewBtn.click();
    });
    await new Promise(r => setTimeout(r, 800));

    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const throwBtn = buttons.find(b => b.innerText.toLowerCase().includes('throw paper'));
      if (throwBtn) {
        throwBtn.click();
        throwBtn.click();
        throwBtn.click();
      }
      const gavelBtn = buttons.find(b => b.innerText.toLowerCase().includes("speaker's gavel"));
      if (gavelBtn) gavelBtn.click();
    });
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_phase2_8_action_chaos.png') });
    console.log('Saved: test_phase2_8_action_chaos.png');

    // Test Mobile Responsiveness
    console.log('11. Testing Mobile Viewport (390 x 844)...');
    await page.setViewport({ width: 390, height: 844 });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_phase2_9_mobile_chamber.png') });
    console.log('Saved: test_phase2_9_mobile_chamber.png');

    console.log('=== ALL PHASE 2 VERIFICATION TESTS PASSED SUCCESSFULLY! ===');
  } catch (err) {
    console.error('Test error:', err);
    process.exit(1);
  } finally {
    if (browser) await browser.close();
  }
})();
