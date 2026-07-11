import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
await page.waitForTimeout(500);

for (let i = 0; i < 4; i++) {
  await page.screenshot({ path: `/Users/harishk/Documents/GitHub/my-portfolio/.flicker-${i}.png` });
  await page.waitForTimeout(400);
}
await browser.close();
