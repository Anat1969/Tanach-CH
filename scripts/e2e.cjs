// End-to-end check against `vite preview`. The logo menu script is stubbed, because the sandbox
// cannot reach appofapp-gh.vercel.app. Fonts are blocked for the same reason.
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

const PORT = 4173;
const BASE = `http://localhost:${PORT}/`;
const SHOTS = process.env.SHOTS_DIR || path.join(__dirname, '..', 'shots');
fs.mkdirSync(SHOTS, { recursive: true });

const STUB = `
class AiMenu extends HTMLElement {
  connectedCallback() {
    if (!this.querySelector('.logo')) {
      this.innerHTML = '<button class="logo" type="button">אד\\' ענת שטיבלמן A&amp;I</button>';
    }
  }
}
customElements.define('ai-menu', AiMenu);
`;

const results = [];
function ok(cond, name) {
  results.push({ ok: !!cond, name });
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}`);
}

function waitForServer(url, tries = 60) {
  return new Promise((resolve, reject) => {
    const tick = (n) => {
      fetch(url)
        .then((r) => (r.ok ? resolve() : retry(n)))
        .catch(() => retry(n));
    };
    const retry = (n) => (n <= 0 ? reject(new Error('preview did not start')) : setTimeout(() => tick(n - 1), 500));
    tick(tries);
  });
}

async function run() {
  const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
    cwd: path.join(__dirname, '..'),
    stdio: 'ignore',
  });
  try {
    await waitForServer(BASE);
    const browser = await chromium.launch();
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, locale: 'he-IL' });
    await context.route('**/ai-menu.js', (route) =>
      route.fulfill({ contentType: 'application/javascript', body: STUB }),
    );
    await context.route(/fonts\.(googleapis|gstatic)\.com/, (route) => route.abort());
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => {
      if (m.type() === 'error' && !/favicon|Failed to load resource/.test(m.text())) errors.push(m.text());
    });

    // Home
    await page.goto(BASE);
    await page.waitForSelector('h1');
    ok((await page.getAttribute('html', 'dir')) === 'rtl', 'html is RTL');
    ok((await page.textContent('h1')).includes('התנ"ך'), 'home headline in Hebrew');
    ok((await page.locator('ai-menu .logo').count()) === 1, 'single A&I logo button in the bar');
    ok((await page.locator('header >> text=העתקת קישור').count()) === 0, 'no loose development buttons in the bar');
    await page.screenshot({ path: path.join(SHOTS, 'home-desktop.png'), fullPage: false });

    // Home: floor selection
    await page.locator('.hero-stack .floor-btn', { hasText: 'סוד' }).click();
    ok((await page.locator('.hero-stack h2').textContent()) === 'סוד', 'home floor selection updates the panel');

    // Stories
    await page.goto(`${BASE}#/stories`);
    await page.waitForSelector('.stories a.card');
    ok((await page.locator('.stories a.card').count()) === 16, 'sixteen stories listed');
    await page.goto(`${BASE}#/books`);
    await page.waitForSelector('.book-card');
    ok((await page.locator('.book-card').count()) === 24, 'twenty-four books shown');
    ok((await page.locator('.book-card.is-planned').count()) === 21, 'twenty-one books planned, three active');
    await page.goto(`${BASE}#/stories/har-sinai`);
    await page.waitForSelector('.level-panel');
    ok((await page.locator('.level-panel .source').count()) === 1, 'new Exodus story renders its floor');

    // Story with floors
    await page.goto(`${BASE}#/stories/akedah`);
    await page.waitForSelector('.level-panel');
    ok((await page.textContent('.level-panel h2')).length > 0, 'story shows the pshat floor by default');
    await page.locator('.story-side .floor-btn', { hasText: 'סוד' }).click();
    await page.waitForFunction(() => location.hash.includes('level=sod'));
    ok((await page.textContent('.level-panel .eyebrow')).includes('הגג'), 'choosing sod shows the roof floor');
    ok((await page.locator('.level-panel .source').count()) === 1, 'each floor names its source');
    await page.screenshot({ path: path.join(SHOTS, 'story-desktop.png'), fullPage: true });

    // Map
    await page.goto(`${BASE}#/map`);
    await page.waitForSelector('.station');
    ok((await page.locator('.station').count()) === 9, 'abraham route shows nine stations');
    await page.locator('.route-switch button', { hasText: 'מסע היציאה' }).click();
    await page.waitForFunction(() => location.hash.includes('route=exodus'));
    ok((await page.locator('.station').count()) === 8, 'exodus route shows eight stations');
    await page.locator('.station', { hasText: 'ים סוף' }).first().locator('.station-hit').click();
    ok((await page.locator('.map-detail h2').textContent()).includes('ים סוף'), 'station click opens its detail');
    await page.waitForTimeout(1700);
    await page.screenshot({ path: path.join(SHOTS, 'map-desktop.png'), fullPage: true });

    // Timeline
    await page.goto(`${BASE}#/time`);
    await page.waitForSelector('.tl-item');
    ok((await page.locator('.tl-item').count()) === 10, 'timeline shows ten events');

    // People
    await page.goto(`${BASE}#/people`);
    await page.waitForSelector('.chip-cloud');
    await page.locator('.chip-cloud button', { hasText: 'יעקב' }).click();
    ok((await page.locator('.rel-list li').count()) >= 3, 'selecting a person lists its relations with sources');
    ok((await page.locator('.rel-list .source').first().textContent()).includes('מקור:'), 'each relation has a source line');

    // Journal: autosave and reload
    await page.goto(`${BASE}#/journal`);
    await page.waitForSelector('textarea');
    await page.locator('textarea').first().fill('הפתיע אותי שהכרעה נעשית בלילה.');
    await page.waitForFunction(() => document.querySelector('.save-status')?.textContent?.includes('נשמר'));
    ok(true, 'journal shows the saved status');
    await page.reload();
    await page.waitForSelector('textarea');
    ok((await page.locator('textarea').first().inputValue()).includes('הפתיע'), 'journal note survives reload');

    // Mobile: no horizontal scroll on any page
    const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: 'he-IL', isMobile: true, hasTouch: true });
    await mobile.route('**/ai-menu.js', (route) => route.fulfill({ contentType: 'application/javascript', body: STUB }));
    await mobile.route(/fonts\.(googleapis|gstatic)\.com/, (route) => route.abort());
    const m = await mobile.newPage();
    for (const hash of ['', '#/stories', '#/stories/yosef', '#/map', '#/time', '#/people', '#/journal']) {
      await m.goto(`${BASE}${hash}`);
      await m.waitForTimeout(400);
      const overflow = await m.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      ok(overflow <= 0, `no horizontal scroll at 390px: ${hash || '#/'}`);
    }
    await m.goto(`${BASE}#/`);
    await m.waitForTimeout(400);
    await m.screenshot({ path: path.join(SHOTS, 'home-mobile.png'), fullPage: true });

    // Reduced motion: the page still renders its content
    const rm = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce', locale: 'he-IL' });
    await rm.route('**/ai-menu.js', (route) => route.fulfill({ contentType: 'application/javascript', body: STUB }));
    await rm.route(/fonts\.(googleapis|gstatic)\.com/, (route) => route.abort());
    const r = await rm.newPage();
    await r.goto(`${BASE}#/map`);
    await r.waitForSelector('.station');
    ok((await r.locator('.station').count()) === 9, 'map renders with reduced motion');

    ok(errors.length === 0, `no JavaScript errors (${errors.length} found)${errors.length ? ': ' + errors.join(' | ') : ''}`);

    await browser.close();
  } finally {
    server.kill();
  }

  const failed = results.filter((r) => !r.ok);
  console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
  if (failed.length) process.exit(1);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
