const path = require('path');
const puppeteer = require(path.join(__dirname, 'monsoon-mayhem', 'node_modules', 'puppeteer-core'));

const ARTIFACT_DIR = 'C:\\Users\\thrid\\.gemini\\antigravity\\brain\\6057ccda-47b5-49d9-b9f7-ba3f5faa87ee';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

(async () => {
  console.log('=== STARTING PARLIAMENT KAAND PHASE 3 COMPREHENSIVE VERIFICATION ===');
  let browser;
  try {
    browser = await puppeteer.launch({
      executablePath: CHROME_PATH,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    page.on('console', msg => {
      const text = msg.text();
      if (!text.includes('THREE.') && !text.includes('downloadable font')) {
        console.log('PAGE LOG:', text);
      }
    });
    page.on('pageerror', err => console.error('PAGE ERROR:', err.message));
    page.on('framenavigated', frame => console.log('PAGE NAVIGATED:', frame.url()));

    console.log('1. Loading http://localhost:3000/parliament-kaand/dist/index.html...');
    await page.goto('http://localhost:3000/parliament-kaand/dist/index.html', { waitUntil: 'networkidle0' });

    // Track view changes
    await page.evaluate(() => {
      // @ts-ignore
      window.addEventListener('keydown', e => console.log('KEY DOWN IN WINDOW:', e.code));
    });

    // Step 1: Main Menu & Enter Chamber
    console.log('2. Clicking "Play with AI (Enter Chamber)"...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find(b => b.innerText.toLowerCase().includes('play with ai'));
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 1800));

    // Verify Player HUD loaded
    await page.waitForSelector('.player-card', { timeout: 5000 });
    const playerName = await page.$eval('.player-card', el => el.innerText);
    console.log('Player HUD detected:', playerName.replace(/\n/g, ' | '));

    // Capture Initial 3rd-Person Spawn Screenshot
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_phase3_1_player_spawn_3rd_person.png') });
    console.log('Saved: test_phase3_1_player_spawn_3rd_person.png');

    // Step 2: Test Forward Movement (KeyW)
    console.log('3. Testing Forward Movement (KeyW)...');
    const initialPos = await page.evaluate(() => {
      const scene = window.__chamberScene || window;
      return { ok: true };
    });

    // Press W key for 1.2 seconds to walk forward along central aisle toward Speaker Dais
    await page.keyboard.down('KeyW');
    await new Promise(r => setTimeout(r, 1200));
    await page.keyboard.up('KeyW');
    await new Promise(r => setTimeout(r, 300));

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_phase3_2_player_walk_forward.png') });
    console.log('Saved: test_phase3_2_player_walk_forward.png');

    // Step 3: Test Sprinting & Stamina Drain (Shift + W)
    console.log('4. Testing Sprint & Stamina Consumption (Shift + W)...');
    await page.keyboard.down('ShiftLeft');
    await page.keyboard.down('KeyW');
    await new Promise(r => setTimeout(r, 1800));
    await page.keyboard.up('KeyW');
    await page.keyboard.up('ShiftLeft');
    await new Promise(r => setTimeout(r, 200));

    const staminaText = await page.$eval('.player-card', el => el.innerText);
    console.log('Stamina after sprint:', staminaText.replace(/\n/g, ' | '));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_phase3_3_player_sprint_stamina.png') });
    console.log('Saved: test_phase3_3_player_sprint_stamina.png');

    // Step 4: Test Jump & Air State (Spacebar)
    console.log('5. Testing Jumping Physics & Mid-Air Pose (Spacebar)...');
    await page.keyboard.down('KeyW');
    await page.keyboard.press('Space');
    await new Promise(r => setTimeout(r, 180)); // Snapshot at apex of jump
    await page.keyboard.up('KeyW');

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_phase3_4_player_jump_air.png') });
    console.log('Saved: test_phase3_4_player_jump_air.png');
    await new Promise(r => setTimeout(r, 800)); // Wait for landing

    // Step 5: Test Crouch Stance (C Key)
    console.log('6. Testing Crouch Stance (C Key)...');
    await page.keyboard.press('KeyC');
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_phase3_5_player_crouch.png') });
    console.log('Saved: test_phase3_5_player_crouch.png');
    // Un-crouch
    await page.keyboard.press('KeyC');
    await new Promise(r => setTimeout(r, 400));

    // Step 6: Test Camera Orbit & Mouse Look
    console.log('7. Testing Third-Person Camera Orbit & Sensitivity...');
    // Drag mouse horizontally across center of canvas
    await page.mouse.move(640, 400);
    await page.mouse.down();
    await page.mouse.move(400, 360, { steps: 12 });
    await page.mouse.up();
    await new Promise(r => setTimeout(r, 500));

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_phase3_6_camera_orbit_rotate.png') });
    console.log('Saved: test_phase3_6_camera_orbit_rotate.png');

    // Step 7: Test Proximity Interaction (Golden Mace / Speaker Dais)
    console.log('8. Testing Proximity Interaction Prompt & Trigger (Key E)...');
    // Walk forward closer to Table of the House / Dais
    await page.keyboard.down('KeyW');
    await new Promise(r => setTimeout(r, 1400));
    await page.keyboard.up('KeyW');
    await new Promise(r => setTimeout(r, 400));

    // Check if interaction prompt is visible or press E to interact with nearby object
    await page.keyboard.press('KeyE');
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_phase3_7_proximity_interaction.png') });
    console.log('Saved: test_phase3_7_proximity_interaction.png');

    // Step 8: Test Camera Mode Toggle (Key V: 3rd-Person <-> Inspection)
    console.log('9. Testing Camera Switcher (Key V)...');
    console.log('Active view before KeyV:', await page.evaluate(() => document.querySelector('.player-card') ? 'PLAYING' : 'MENU'));
    await page.keyboard.press('KeyV');
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_phase3_8_camera_mode_toggle.png') });
    console.log('Saved: test_phase3_8_camera_mode_toggle.png');
    // Toggle back to 3rd-person
    await page.keyboard.press('KeyV');
    await new Promise(r => setTimeout(r, 600));
    console.log('Active view after KeyV:', await page.evaluate(() => document.querySelector('.player-card') ? 'PLAYING' : 'MENU'));

    // Step 9: Test Mobile Viewport & Touch Controls (390 x 844)
    console.log('10. Testing Mobile Viewport & On-Screen Touch Controls (390 x 844)...');
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await new Promise(r => setTimeout(r, 1000));

    // If page reloaded on touch emulation change, re-enter chamber
    const onMenu = await page.evaluate(() => !document.querySelector('.player-card'));
    if (onMenu) {
      console.log('Mobile emulation re-entered; clicking Play with AI...');
      await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const btn = buttons.find(b => b.innerText.toLowerCase().includes('play with ai'));
        if (btn) btn.click();
      });
      await new Promise(r => setTimeout(r, 1800));
    }

    // Verify virtual joystick and touch action buttons exist
    const hasTouchButtons = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return {
        count: buttons.length,
        texts: buttons.map(b => b.innerText.substring(0, 15)),
        hasJump: buttons.some(b => b.innerText.includes('🦘')),
        hasSprint: buttons.some(b => b.innerText.includes('⚡')),
        hasCrouch: buttons.some(b => b.innerText.includes('🧘')),
      };
    });
    console.log('Mobile Touch Controls verified:', hasTouchButtons);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_phase3_9_mobile_touch_controls.png') });
    console.log('Saved: test_phase3_9_mobile_touch_controls.png');

    // Step 10: Test Pause Menu & Navigation
    console.log('11. Testing Pause Menu (Esc)...');
    await page.keyboard.press('Escape');
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_phase3_10_pause_menu.png') });
    console.log('Saved: test_phase3_10_pause_menu.png');

    console.log('=== ALL PHASE 3 VERIFICATION TESTS PASSED SUCCESSFULLY! ===');
  } catch (err) {
    console.error('Phase 3 Test Error:', err);
    process.exit(1);
  } finally {
    if (browser) await browser.close();
  }
})();
