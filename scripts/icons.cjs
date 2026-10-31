// Renders the app icon (no text, per house rule) to PNG at 192 and 512 px.
// Run once: npm run icons. Requires the pre-installed Chromium through Playwright.
const path = require('path');
const { chromium } = require('playwright');

const SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">
  <rect width="300" height="300" fill="#f3eee4"/>
  <polygon points="150,70 230,110 150,150 70,110" fill="#5b3a6e"/>
  <polygon points="70,110 150,150 150,166 70,126" fill="#37233f"/>
  <polygon points="150,150 230,110 230,126 150,166" fill="#4a2f5a"/>
  <polygon points="150,130 230,170 150,210 70,170" fill="#1f3558"/>
  <polygon points="70,170 150,210 150,226 70,186" fill="#111f38"/>
  <polygon points="150,210 230,170 230,186 150,226" fill="#18294a"/>
  <polygon points="150,190 230,230 150,270 70,230" fill="#4f6b3a"/>
  <polygon points="70,230 150,270 150,286 70,246" fill="#2f4224"/>
  <polygon points="150,270 230,230 230,246 150,286" fill="#3e5630"/>
</svg>`;

(async () => {
  const browser = await chromium.launch();
  for (const size of [192, 512]) {
    const page = await browser.newPage({ viewport: { width: size, height: size } });
    await page.setContent(`<html><body style="margin:0">${SVG.replace('<svg ', `<svg width="${size}" height="${size}" `)}</body></html>`);
    const out = path.join(__dirname, '..', 'public', `icon-${size}.png`);
    await page.screenshot({ path: out, omitBackground: false, clip: { x: 0, y: 0, width: size, height: size } });
    console.log('wrote', out);
    await page.close();
  }
  await browser.close();
})();
