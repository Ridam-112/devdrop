const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\thrid\\.gemini\\antigravity\\brain\\6057ccda-47b5-49d9-b9f7-ba3f5faa87ee';
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runObstacleTest() {
  console.log('🚀 Starting 3D Obstacle & Pothole Integration Verification...');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: [
      '--window-size=1280,720',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--user-data-dir=C:\\Users\\thrid\\AppData\\Local\\Temp\\chrome_obstacle_test'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  console.log('Navigating to http://localhost:5173/ ...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });
  await sleep(1500);

  // 1. Initial view: Road with roadside colonial buildings & streetlights
  console.log('1. Checking Road & Environment...');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_obs_1_start.png') });

  // 2. Drive forward towards first obstacles (~25m ahead)
  console.log('2. Driving forward with KeyW for 2.8 seconds...');
  await page.keyboard.down('KeyW');
  await sleep(2800);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_obs_2_approach.png') });

  // 3. Turn on F1 Debug Colliders
  console.log('3. Pressing F1 to toggle 3D collider wireframes...');
  await page.keyboard.press('F1');
  await sleep(600);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_obs_3_debug_wireframe.png') });

  // 4. Continue driving to encounter potholes/hazards
  console.log('4. Driving further forward for 3 seconds...');
  await sleep(3000);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_obs_4_encounter.png') });

  // 5. Test Jump Dodge with Space
  console.log('5. Pressing Space to Jump over hazard...');
  await page.keyboard.press('Space');
  await sleep(400);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_obs_5_jump_dodge.png') });

  await sleep(1500);
  await page.keyboard.up('KeyW');

  // 6. Check final status
  const finalHUD = await page.evaluate(() => {
    return document.querySelector('#hud-overlay')?.innerText || '';
  });
  console.log('Final HUD Telemetry:\n', finalHUD);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_obs_6_status.png') });

  await browser.close();
  console.log('✅ Obstacle and Pothole Verification Completed successfully!');
}

runObstacleTest().catch(err => {
  console.error('Test run error:', err);
  process.exit(1);
});
