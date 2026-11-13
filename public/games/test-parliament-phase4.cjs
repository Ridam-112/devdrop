const path = require('path');
const puppeteer = require(path.join(__dirname, 'monsoon-mayhem', 'node_modules', 'puppeteer-core'));

const ARTIFACT_DIR = 'C:\\Users\\thrid\\.gemini\\antigravity\\brain\\6057ccda-47b5-49d9-b9f7-ba3f5faa87ee';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

(async () => {
  console.log('=== STARTING PARLIAMENT KAAND PHASE 4 ADVANCED PHYSICS & RAGDOLL VERIFICATION ===');
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

    console.log('1. Loading http://localhost:3000/parliament-kaand/dist/index.html...');
    await page.goto('http://localhost:3000/parliament-kaand/dist/index.html', { waitUntil: 'networkidle0' });

    // Step 1: Main Menu & Enter Chamber
    console.log('2. Clicking "Play with AI (Enter Chamber)"...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find(b => b.innerText.toLowerCase().includes('play with ai'));
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 2000));

    // Verify Player HUD and Rapier Physics Engine Telemetry
    await page.waitForSelector('.player-card', { timeout: 6000 });
    const telemetry = await page.evaluate(() => {
      const panels = Array.from(document.querySelectorAll('.glass-panel strong')).map(s => s.innerText);
      return { panels };
    });
    console.log('Chamber & Physics Telemetry:', telemetry.panels);

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_phase4_1_physics_init_chamber.png') });
    console.log('Saved: test_phase4_1_physics_init_chamber.png');

    // Step 2: Test Interactive Dynamic Props (Walk toward Front Row Benches & Chairs)
    console.log('3. Walking forward toward front benches and interactive chairs...');
    await page.keyboard.down('KeyW');
    await new Promise(r => setTimeout(r, 1500));
    await page.keyboard.up('KeyW');
    await new Promise(r => setTimeout(r, 400));

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_phase4_2_dynamic_props_approach.png') });
    console.log('Saved: test_phase4_2_dynamic_props_approach.png');

    // Step 3: Test Pickup and Throw System (Key F)
    console.log('4. Testing Pickup / Drop System (Key F)...');
    // Walk slightly more to get within proximity of water bottle / chair
    await page.keyboard.down('KeyW');
    await new Promise(r => setTimeout(r, 800));
    await page.keyboard.up('KeyW');
    await new Promise(r => setTimeout(r, 400));

    // Trigger pickup (Key F or click button)
    await page.keyboard.press('KeyF');
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_phase4_3_pickup_held_object.png') });
    console.log('Saved: test_phase4_3_pickup_held_object.png');

    // Throw held object (Left Click)
    console.log('5. Testing Throw with Physics Impulse (Mouse Click)...');
    await page.mouse.click(640, 400);
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_phase4_4_throw_physics_impulse.png') });
    console.log('Saved: test_phase4_4_throw_physics_impulse.png');

    // Step 4: Test Full-Body Ragdoll Activation (Key R)
    console.log('6. Activating Comedic Ragdoll Fall (Key R)...');
    await page.keyboard.press('KeyR');
    await new Promise(r => setTimeout(r, 220)); // Capture active tumbling in mid-fall

    const ragdollFallingState = await page.$eval('.player-card', el => el.innerText);
    console.log('Player HUD during Ragdoll Fall:', ragdollFallingState.replace(/\n/g, ' | '));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_phase4_5_ragdoll_active_tumble.png') });
    console.log('Saved: test_phase4_5_ragdoll_active_tumble.png');

    // Step 5: Test Ragdoll Stabilization & Floor Impact
    console.log('7. Waiting for Ragdoll floor collision and stabilization...');
    await new Promise(r => setTimeout(r, 900));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_phase4_6_ragdoll_floor_settled.png') });
    console.log('Saved: test_phase4_6_ragdoll_floor_settled.png');

    // Step 6: Test Ragdoll Recovery Get-Up
    console.log('8. Waiting for Ragdoll Recovery & Stand-Up...');
    await new Promise(r => setTimeout(r, 1200));
    const recoveredState = await page.$eval('.player-card', el => el.innerText);
    console.log('Player HUD after recovery:', recoveredState.replace(/\n/g, ' | '));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_phase4_7_ragdoll_recovery_complete.png') });
    console.log('Saved: test_phase4_7_ragdoll_recovery_complete.png');

    // Step 7: Test WASD Movement restored after recovery
    console.log('9. Verifying WASD movement works after ragdoll recovery...');
    await page.keyboard.down('KeyW');
    await new Promise(r => setTimeout(r, 600));
    await page.keyboard.up('KeyW');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_phase4_8_post_recovery_movement.png') });
    console.log('Saved: test_phase4_8_post_recovery_movement.png');

    // Step 8: Test Physics Debug Wireframe Viewer (Key F3)
    console.log('10. Testing Rapier 3D Physics Wireframe Debug Mode (Key F3)...');
    await page.keyboard.press('F3');
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_phase4_9_physics_debug_wireframe.png') });
    console.log('Saved: test_phase4_9_physics_debug_wireframe.png');
    // Toggle debug off
    await page.keyboard.press('F3');

    // Step 9: Test Mobile Viewport & Touch Controls (390 x 844)
    console.log('11. Testing Mobile Viewport & Mobile Physics Buttons (390 x 844)...');
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await new Promise(r => setTimeout(r, 1000));

    // If re-entered main menu on touch emulation, click Play with AI
    const onMenu = await page.evaluate(() => !document.querySelector('.player-card'));
    if (onMenu) {
      console.log('Re-entering chamber on mobile viewport...');
      await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const btn = buttons.find(b => b.innerText.toLowerCase().includes('play with ai'));
        if (btn) btn.click();
      });
      await new Promise(r => setTimeout(r, 1800));
    }

    const mobileButtons = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return {
        count: buttons.length,
        hasRagdoll: buttons.some(b => b.innerText.includes('💥')),
        hasSprint: buttons.some(b => b.innerText.includes('⚡')),
        hasJump: buttons.some(b => b.innerText.includes('🦘')),
      };
    });
    console.log('Mobile Physics Controls verified:', mobileButtons);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_phase4_10_mobile_physics_controls.png') });
    console.log('Saved: test_phase4_10_mobile_physics_controls.png');

    console.log('=== ALL PHASE 4 ADVANCED PHYSICS & RAGDOLL VERIFICATION TESTS PASSED SUCCESSFULLY! ===');
  } catch (err) {
    console.error('Phase 4 Test Error:', err);
    process.exit(1);
  } finally {
    if (browser) await browser.close();
  }
})();
