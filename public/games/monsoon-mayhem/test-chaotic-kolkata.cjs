const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\thrid\\.gemini\\antigravity\\brain\\6057ccda-47b5-49d9-b9f7-ba3f5faa87ee';
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runChaosTest() {
  console.log('🚀 Starting Extreme Kolkata Monsoon Chaos Verification...');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: [
      '--window-size=1280,720',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--user-data-dir=C:\\Users\\thrid\\AppData\\Local\\Temp\\chrome_chaos_test'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  console.log('Navigating to http://localhost:5173/ ...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });
  await sleep(1500);

  // 1. Initial State: Check new Silencer Flooding bar & HUD
  console.log('1. Checking Initial HUD with Silencer Flooding Bar...');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_chaos_1_hud.png') });

  // 2. Accelerate forward into traffic
  console.log('2. Accelerating with KeyW for 3.5 seconds...');
  await page.keyboard.down('KeyW');
  await sleep(3500);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_chaos_2_driving.png') });

  // 3. Trigger Screen Mud Splatter & Bengali Comic Speech Bubble
  console.log('3. Triggering Mud Splatter and Bengali Speech Bubble...');
  await page.evaluate(() => {
    if (window.game3DScene) {
      window.game3DScene.triggerMudSplatter();
      window.game3DScene.showBengaliShout('🌊 বাসের ঢেউ আসছে রে! জাম্প কর!');
    }
  });
  await sleep(100);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_chaos_3_mud_splatter_bubble.png') });

  // 4. Continue driving to encounter erratic autos, wires, and chai
  console.log('4. Driving further forward for 4 seconds...');
  await sleep(4000);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_chaos_4_traffic_chaos.png') });

  await page.keyboard.up('KeyW');

  const hudText = await page.evaluate(() => document.querySelector('#hud-overlay')?.innerText || '');
  console.log('Final HUD Telemetry:\n', hudText);

  await browser.close();
  console.log('✅ Extreme Kolkata Monsoon Chaos verification completed!');
}

runChaosTest().catch(err => {
  console.error('Error during test:', err);
  process.exit(1);
});
