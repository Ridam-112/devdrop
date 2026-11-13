const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\thrid\\.gemini\\antigravity\\brain\\6057ccda-47b5-49d9-b9f7-ba3f5faa87ee';
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runVisualTest() {
  console.log('🎨 Starting Visual Upgrade Verification...');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: [
      '--window-size=1280,720',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--user-data-dir=C:\\Users\\thrid\\AppData\\Local\\Temp\\chrome_visual_test'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  console.log('Navigating to http://localhost:5173/ ...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });
  await sleep(1500);

  // 1. Initial State: Storm Sky, Wet Asphalt, Scooter Details
  console.log('1. Capturing Initial Scene (Sky Dome, Wet Asphalt, Chetak Scooter & Rider)...');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_visual_1_sky_and_road.png') });

  // 2. Drive forward to show Colonial Heritage Mansions & Neon Signs
  console.log('2. Accelerating forward to approach Colonial Mansions & Neon Shops...');
  await page.keyboard.down('KeyW');
  await sleep(2500);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_visual_2_colonial_architecture.png') });

  // 3. Drive further to pass Kolkata Props (Post box, Tea Stall, Zebra crossing)
  console.log('3. Driving forward towards props & zebra crossings...');
  await sleep(3000);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_visual_3_props_and_details.png') });

  // 4. Steer slightly to inspect scooter lean, mirrors, crash bars, rain ripples
  console.log('4. Steering right to capture dynamic lean & road lighting...');
  await page.keyboard.down('KeyD');
  await sleep(800);
  await page.keyboard.up('KeyD');
  await sleep(1200);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_visual_4_rain_and_splashes.png') });

  await page.keyboard.up('KeyW');

  console.log('Visual upgrade tests completed successfully!');
  await browser.close();
}

runVisualTest().catch(err => {
  console.error('Visual Test failed:', err);
  process.exit(1);
});
