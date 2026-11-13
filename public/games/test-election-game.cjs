const path = require('path');
const puppeteer = require(path.join(__dirname, 'monsoon-mayhem', 'node_modules', 'puppeteer-core'));

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\thrid\\.gemini\\antigravity\\brain\\6057ccda-47b5-49d9-b9f7-ba3f5faa87ee';
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runElectionDilemmaTest() {
  console.log('🗳️ Starting Election Mayhem Minister Dilemma Test...');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: [
      '--window-size=1280,720',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--user-data-dir=C:\\Users\\thrid\\AppData\\Local\\Temp\\chrome_dilemma_test'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  console.log('Navigating to http://localhost:3000/44_election_mayhem_voting_battle.html ...');
  await page.goto('http://localhost:3000/44_election_mayhem_voting_battle.html', { waitUntil: 'networkidle2' });
  await sleep(1000);

  // 1. Capture Leader Select
  console.log('1. Capturing Leader Selection Screen...');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_dilemma_1_roster.png') });

  // 2. Select Modi (নরেন্দ্র মোদী)
  console.log('2. Selecting Narendra Modi (নমো)...');
  await page.click('#card-modi');
  await sleep(500);

  // 3. Enter Government and receive funds
  console.log('3. Entering Government & Receiving First Fund...');
  await page.click('#btnStartGame');
  await sleep(1000);

  // 4. Capture Dilemma 1: Highway Fund (₹800 Crore) before decode
  console.log('4. Capturing Fund 1 before decode...');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_dilemma_2_highway_fund.png') });

  // 5. Click the Decoder button to reveal hidden audit notes
  console.log('5. Clicking Fine Print Decoder...');
  await page.click('#btnDecodeFinePrint');
  await sleep(600);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_dilemma_2b_decoded_audit.png') });

  // 6. Select Option 1 (Genuine Work) on Dilemma 1
  console.log('6. Selecting Option 1 (Genuine Work)...');
  await page.evaluate(() => {
    const cards = document.querySelectorAll('.choice-card');
    if (cards[0]) cards[0].click();
  });
  await sleep(800);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_dilemma_3_outcome_modal.png') });

  // 7. Click Next on Outcome Modal
  await page.click('#btnNextDilemmaModal');
  await sleep(800);

  // 8. Go through Dilemmas 2 to 5 (e.g. pick a corrupt choice on 2 to test ED risk!)
  console.log('8. Testing Fund 2 (Hospital) with cut-money steal...');
  await page.evaluate(() => {
    // Click corrupt choice (first choice in hospital is corrupt steal)
    const cards = document.querySelectorAll('.choice-card');
    if (cards[0]) cards[0].click();
  });
  await sleep(800);
  await page.click('#btnNextDilemmaModal');
  await sleep(800);

  // Check if ED raid triggered or continue
  const edBackdrop = await page.$('#edRaidModalBackdrop.active');
  if (edBackdrop) {
    console.log('🚨 ED Raid triggered! Hiding cash in tank...');
    await page.evaluate(() => handleEdRaidAction('tank'));
    await sleep(1200);
  }

  // Advance remaining dilemmas
  console.log('9. Advancing remaining dilemmas...');
  for (let d = 2; d < 5; d++) {
    await page.evaluate(() => {
      const cards = document.querySelectorAll('.choice-card');
      if (cards[1]) cards[1].click();
      else if (cards[0]) cards[0].click();
    });
    await sleep(700);

    const modalActive = await page.$('#outcomeModalBackdrop.active');
    if (modalActive) {
      await page.click('#btnNextDilemmaModal');
      await sleep(800);
    }

    const edActive = await page.$('#edRaidModalBackdrop.active');
    if (edActive) {
      await page.evaluate(() => handleEdRaidAction('tank'));
      await sleep(1000);
    }
  }

  // Wait for TV Debate Arena
  console.log('10. Arriving at TV Studio Jhogra Debate...');
  await sleep(2000);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_dilemma_4_tv_jhogra.png') });

  // Trigger Jhogra moves
  console.log('11. Triggering Jhogra Moves...');
  await page.evaluate(() => triggerJhograMove('fact'));
  await sleep(400);
  await page.evaluate(() => triggerJhograMove('meme'));
  await sleep(400);
  await page.evaluate(() => triggerJhograMove('special'));
  await sleep(1200);

  // Wait for EVM Victory & Certificate
  console.log('12. Waiting for EVM Count & Victory Certificate...');
  await sleep(2500);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_dilemma_5_final_verdict.png') });

  console.log('✅ All tests completed successfully!');
  await browser.close();
}

runElectionDilemmaTest().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
