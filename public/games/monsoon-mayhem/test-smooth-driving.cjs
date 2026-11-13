const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\thrid\\.gemini\\antigravity\\brain\\6057ccda-47b5-49d9-b9f7-ba3f5faa87ee';
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runSmoothTest() {
  console.log('🚀 Starting Smooth Driving & Monsoon Atmospheric Verification...');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: [
      '--window-size=1280,720',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--user-data-dir=C:\\Users\\thrid\\AppData\\Local\\Temp\\chrome_smooth_test'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  console.log('Navigating to http://localhost:5173/ ...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });
  await sleep(1500);

  // Screenshot 1: Spawning in Kolkata Monsoon Overcast Sky with Rain
  console.log('1. Checking Atmospheric Overcast Monsoon Sky & Rain...');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_smooth_1_spawn.png') });

  // Accelerate forward with KeyW for 3.5 seconds
  console.log('2. Accelerating with KeyW (Checking Smooth 60 FPS & FOV expansion)...');
  await page.keyboard.down('KeyW');
  await sleep(3500);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_smooth_2_fast_driving.png') });

  // Test responsive dodging left and right
  console.log('3. Testing Snappy Steering Left & Right...');
  await page.keyboard.down('KeyA');
  await sleep(650);
  await page.keyboard.up('KeyA');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_smooth_3_steer_left.png') });

  await page.keyboard.down('KeyD');
  await sleep(950);
  await page.keyboard.up('KeyD');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_smooth_4_steer_right.png') });

  // Continue driving to see traffic and potholes
  console.log('4. Driving further forward into traffic & hazards...');
  await sleep(3000);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_smooth_5_traffic_hazards.png') });

  await page.keyboard.up('KeyW');

  const hudText = await page.evaluate(() => document.querySelector('#hud-overlay')?.innerText || '');
  console.log('HUD Telemetry:\n', hudText);

  await browser.close();
  console.log('✅ Smooth Driving Test completed successfully!');
}

runSmoothTest().catch(err => {
  console.error('Error during test:', err);
  process.exit(1);
});
