const path = require('path');
const puppeteer = require(path.join(__dirname, 'monsoon-mayhem', 'node_modules', 'puppeteer-core'));

const ARTIFACT_DIR = 'C:\\Users\\thrid\\.gemini\\antigravity\\brain\\6057ccda-47b5-49d9-b9f7-ba3f5faa87ee';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

(async () => {
  console.log('--- STARTING 3D POLITICIAN & 2x2 COMPACT LAYOUT TEST ---');
  let browser;
  try {
    browser = await puppeteer.launch({
      executablePath: CHROME_PATH,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 850 });

    console.log('1. Loading http://localhost:3000/44_election_mayhem_voting_battle.html...');
    await page.goto('http://localhost:3000/44_election_mayhem_voting_battle.html', { waitUntil: 'networkidle0' });

    // Select Mamata Banerjee (Didi) to specifically verify user's "mamta banerjjee ba jei charater thakbe"
    console.log('2. Selecting Mamata Banerjee (Didi)...');
    await page.click('#card-didi');
    await new Promise(r => setTimeout(r, 600));

    // Click start game
    console.log('3. Clicking Take Oath & Get Funds...');
    await page.click('#btnStartGame');
    await new Promise(r => setTimeout(r, 1200));

    // Verify 3D Canvas
    const canvasExists = await page.$eval('#character3DCanvasContainer canvas', el => !!el);
    console.log(`3D Character Canvas initialized: ${canvasExists}`);

    // Verify 3D character speech and name
    const charName = await page.$eval('#charStageName', el => el.innerText);
    const speechText = await page.$eval('#charStageSpeech', el => el.innerText);
    console.log(`3D Character Stage: ${charName} | Speech: ${speechText}`);

    // Verify 4 compact choice cards in 2x2 grid
    const choicesCount = await page.$$eval('.choice-card-compact', els => els.length);
    console.log(`Compact choice cards count: ${choicesCount} (Expected 4)`);

    // Verify 2x2 grid styling
    const gridCols = await page.$eval('#choicesGrid', el => getComputedStyle(el).gridTemplateColumns);
    console.log(`Choices Grid Template Columns: ${gridCols}`);

    // Screenshot of Initial 3D Character + Crisis Stage + 2x2 Grid
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_3d_dilemma_1_didi_stage.png') });
    console.log('Saved: test_3d_dilemma_1_didi_stage.png');

    // Click DECODE button
    console.log('4. Clicking DECODE button to reveal fine print...');
    await page.click('#btnDecodeFinePrint');
    await new Promise(r => setTimeout(r, 600));

    // Verify revealed audit notes
    const isRevealed = await page.$eval('.choice-card-compact', el => el.classList.contains('revealed'));
    console.log(`Audit notes revealed on cards: ${isRevealed}`);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_3d_dilemma_2_decoded_stage.png') });
    console.log('Saved: test_3d_dilemma_2_decoded_stage.png');

    // Click Top-Left Choice (Option 1: Genuine Work)
    console.log('5. Clicking Top-Left Choice (Option 1)...');
    await page.click('#choiceCard-0');
    await new Promise(r => setTimeout(r, 800));

    // Verify Outcome Modal with Newspaper headline
    const modalActive = await page.$eval('#outcomeModalBackdrop', el => el.classList.contains('active'));
    console.log(`Outcome Modal active: ${modalActive}`);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_3d_dilemma_3_outcome_modal.png') });
    console.log('Saved: test_3d_dilemma_3_outcome_modal.png');

    // Close modal to see the 3D character reaction on stage
    await page.click('#btnNextDilemmaModal');
    await new Promise(r => setTimeout(r, 1000));

    // Check Dilemma 2 (Hospital) with 3D character
    const crisis2 = await page.$eval('#crisisName', el => el.innerText);
    console.log(`Advanced to Dilemma 2: ${crisis2}`);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_3d_dilemma_4_hospital_stage.png') });
    console.log('Saved: test_3d_dilemma_4_hospital_stage.png');

    console.log('--- ALL 3D DILEMMA TESTS COMPLETED SUCCESSFULLY! ---');
  } catch (err) {
    console.error('Test error:', err);
    process.exit(1);
  } finally {
    if (browser) await browser.close();
  }
})();
