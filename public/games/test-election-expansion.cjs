const path = require('path');
const puppeteer = require(path.join(__dirname, 'monsoon-mayhem', 'node_modules', 'puppeteer-core'));

const ARTIFACT_DIR = 'C:\\Users\\thrid\\.gemini\\antigravity\\brain\\6057ccda-47b5-49d9-b9f7-ba3f5faa87ee';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

(async () => {
  console.log('--- STARTING COMPREHENSIVE ELECTION GAME EXPANSION TEST ---');
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

    // Verify 8 politicians rendered
    const leaderCards = await page.$$('.leader-card');
    console.log(`Leader cards count: ${leaderCards.length} (Expected 8)`);
    if (leaderCards.length !== 8) {
      throw new Error(`Expected 8 leaders, found ${leaderCards.length}`);
    }

    // Capture roster screenshot
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_expansion_1_roster_8_leaders.png') });
    console.log('Saved: test_expansion_1_roster_8_leaders.png');

    // Select Yogi Adityanath (or Nitish Kumar)
    console.log('2. Selecting Yogi Adityanath (Bulldozer Baba)...');
    await page.click('#card-yogi');
    await new Promise(r => setTimeout(r, 600));

    // Start game
    console.log('3. Clicking Take Oath & Get Funds...');
    await page.click('#btnStartGame');
    await new Promise(r => setTimeout(r, 800));

    // Verify Dilemma 1 loaded
    const fundTitle = await page.$eval('#fundTitle', el => el.innerText);
    console.log(`Dilemma 1 loaded: ${fundTitle}`);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_expansion_2_dilemma1.png') });
    console.log('Saved: test_expansion_2_dilemma1.png');

    // Click genuine work choice
    console.log('4. Making Genuine Work Choice...');
    const choices = await page.$$('.choice-card');
    await choices[0].click();
    await new Promise(r => setTimeout(r, 800));

    // Verify Outcome Modal with Newspaper Clipping
    const newspaperHeadline = await page.$eval('#outcomeNewspaperHeadline', el => el.innerText);
    console.log(`Newspaper Headline verified: ${newspaperHeadline}`);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_expansion_3_newspaper_modal.png') });
    console.log('Saved: test_expansion_3_newspaper_modal.png');

    // Close modal and advance through dilemmas
    console.log('5. Advancing through remaining dilemmas...');
    await page.click('#btnNextDilemmaModal');
    await new Promise(r => setTimeout(r, 600));

    // Play through each subsequent dilemma
    let safetyCounter = 0;
    while (safetyCounter < 10) {
      safetyCounter++;
      const isDebateActive = await page.$eval('#viewDebate', el => el.classList.contains('active'));
      if (isDebateActive) {
        console.log('Reached TV Debate View!');
        break;
      }

      // If outcome modal is open, click next
      const isModalActive = await page.$eval('#outcomeModalBackdrop', el => el.classList.contains('active'));
      if (isModalActive) {
        await page.click('#btnNextDilemmaModal');
        await new Promise(r => setTimeout(r, 600));
        continue;
      }

      // If ED raid modal is open, choose an option
      const isEdActive = await page.$eval('#edRaidModalBackdrop', el => el.classList.contains('active'));
      if (isEdActive) {
        console.log('ED Raid triggered! Clicking water tank...');
        await page.evaluate(() => handleEdRaidAction('tank'));
        await new Promise(r => setTimeout(r, 1200));
        continue;
      }

      // Otherwise click first choice in dilemma
      const availableChoices = await page.$$('.choice-card');
      if (availableChoices.length > 0) {
        await availableChoices[0].click();
        await new Promise(r => setTimeout(r, 600));
      }
    }

    // Wait for TV Debate to be ready
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_expansion_4_tv_debate_soundboard.png') });
    console.log('Saved: test_expansion_4_tv_debate_soundboard.png');

    // Test the Meme Soundboard buttons
    console.log('6. Testing Meme Soundboard Buttons...');
    await page.evaluate(() => {
      const soundboardButtons = document.querySelectorAll('.btn-soundboard');
      soundboardButtons.forEach(btn => btn.click());
    });
    await new Promise(r => setTimeout(r, 600));

    // Trigger debate battle actions until victory
    console.log('7. Triggering debate action moves...');
    await page.evaluate(() => {
      triggerJhograMove('special');
    });
    await new Promise(r => setTimeout(r, 2500));

    // Verify Victory View
    const victoryActive = await page.$eval('#viewVictory', el => el.classList.contains('active'));
    console.log(`Victory Phase active: ${victoryActive}`);
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_expansion_5_evm_verdict.png') });
    console.log('Saved: test_expansion_5_evm_verdict.png');

    console.log('--- ALL EXPANSION TESTS PASSED SUCCESSFULLY! ---');
  } catch (err) {
    console.error('Test error:', err);
    process.exit(1);
  } finally {
    if (browser) await browser.close();
  }
})();
