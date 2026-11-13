const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\thrid\\.gemini\\antigravity\\brain\\6057ccda-47b5-49d9-b9f7-ba3f5faa87ee';
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runDrivingTest() {
  console.log('🚀 Starting Automated 3D Driving Verification...');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: [
      '--window-size=1280,720',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--user-data-dir=C:\\Users\\thrid\\AppData\\Local\\Temp\\chrome_driving_test'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });

  console.log('Navigating to http://localhost:5173/ ...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });
  await sleep(1500);

  // Helper to read telemetry
  async function getTelemetry() {
    return await page.evaluate(() => {
      const sp = document.querySelector('#hud-overlay')?.innerText || '';
      return sp;
    });
  }

  // 1. Frame 1: Spawn Stationary at Road Center
  console.log('1. Checking Initial Spawn at Road Center...');
  const initialTelemetry = await getTelemetry();
  console.log('Initial Telemetry:\n' + initialTelemetry);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_1_spawn_center.png') });

  // 2. Accelerate Straight with W
  console.log('2. Accelerating forward with KeyW for 3.5 seconds...');
  await page.keyboard.down('KeyW');
  await sleep(3500);
  const accelTelemetry = await getTelemetry();
  console.log('Acceleration Telemetry:\n' + accelTelemetry);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_2_accelerate_straight.png') });

  // 3. Steer Left (Hold W + A)
  console.log('3. Steering Left (W + A) for 1.5 seconds...');
  await page.keyboard.down('KeyA');
  await sleep(1500);
  await page.keyboard.up('KeyA');
  const steerLeftTelemetry = await getTelemetry();
  console.log('Steer Left Telemetry:\n' + steerLeftTelemetry);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_3_steer_left.png') });

  // 4. Steer Right (Hold W + D)
  console.log('4. Steering Right (W + D) for 2.2 seconds...');
  await page.keyboard.down('KeyD');
  await sleep(2200);
  await page.keyboard.up('KeyD');
  const steerRightTelemetry = await getTelemetry();
  console.log('Steer Right Telemetry:\n' + steerRightTelemetry);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_4_steer_right.png') });

  // 5. Brake to Stop (Release W, Hold S)
  console.log('5. Releasing W and Braking with KeyS for 2 seconds...');
  await page.keyboard.up('KeyW');
  await page.keyboard.down('KeyS');
  await sleep(2000);
  await page.keyboard.up('KeyS');
  const brakeTelemetry = await getTelemetry();
  console.log('Braking Telemetry:\n' + brakeTelemetry);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_5_braked_stop.png') });

  await browser.close();
  console.log('✅ Automated 3D Driving Verification Complete! All screenshots saved.');
}

runDrivingTest().catch((err) => {
  console.error('❌ Driving test error:', err);
  process.exit(1);
});
