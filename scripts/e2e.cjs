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
    await context.route('**/ai-menu.js', (route) => route.fulfill({ contentType: 'application/javascript', body: STUB }));
    await context.route(/fonts\.(googleapis|gstatic)\.com/, (route) => route.abort());
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => {
      if (m.type() === 'error' && !/favicon|Failed to load resource/.test(m.text())) errors.push(m.text());
    });

    // Home and the bar
    await page.goto(BASE);
    await page.waitForSelector('h1');
    ok((await page.getAttribute('html', 'dir')) === 'rtl', 'html is RTL');
    ok((await page.textContent('h1')).includes('התנ"ך'), 'home headline in Hebrew');
    ok((await page.locator('ai-menu .logo').count()) === 1, 'single A&I logo button in the bar');
    ok((await page.locator('.topbar .app-mark').count()) === 1, 'bar shows the app mark');
    ok((await page.locator('header >> text=העתקת קישור').count()) === 0, 'no loose development buttons in the bar');
    const brandBox = await page.locator('.topbar .brand').boundingBox();
    const logoBox = await page.locator('ai-menu').boundingBox();
    ok(brandBox.x > 900, 'brand and nav start on the right side of the bar');
    ok(logoBox.x < 200, 'logo menu sits on the left side of the bar');
    await page.locator('.hero-stack .floor-btn', { hasText: 'סוד' }).click();
    ok((await page.locator('.hero-stack h2').textContent()) === 'סוד', 'home floor selection updates the panel');

    // Context bar and search with a clear button
    await page.goto(`${BASE}#/stories/akedah`);
    await page.waitForSelector('.contextbar .crumbs');
    const crumbs = await page.locator('.contextbar .crumbs').textContent();
    ok(crumbs.includes('תנ"ך') && crumbs.includes('בראשית') && crumbs.includes('העקידה'), 'context bar shows the open path: תנ"ך › ספר › סיפור');
    await page.locator('#site-search').fill('יוסף');
    await page.waitForSelector('.search-results li button');
    ok((await page.locator('.search-results li button').count()) >= 1, 'search finds a story by keyword');
    ok((await page.locator('.search-clear').count()) === 1, 'search shows the ✕ clear button while typing');
    await page.locator('.search-clear').click();
    ok((await page.locator('#site-search').inputValue()) === '', 'the ✕ clears the search');

    // Stories as rows
    await page.goto(`${BASE}#/stories`);
    await page.waitForSelector('.story-rows');
    ok((await page.locator('.story-rows a.story-row').count()) === 16, 'sixteen stories listed as rows');

    // Books: three levels on one page
    await page.goto(`${BASE}#/books`);
    await page.waitForSelector('.book-row');
    ok((await page.locator('.book-row').count()) === 24, 'twenty-four books shown');
    ok((await page.locator('.book-row:disabled').count()) === 21, 'twenty-one books planned, three active');
    await page.locator('.book-row', { hasText: 'בראשית' }).click();
    ok((await page.locator('.story-rows.nested a.story-row').count()) === 8, 'opening a book shows its stories in place');

    // Story page: quotation marks and nikud on every story
    await page.goto(`${BASE}#/stories/har-sinai`);
    await page.waitForSelector('.level-panel');
    ok((await page.locator('.level-panel .source').count()) === 1, 'new Exodus story renders its term');
    const quote = await page.locator('.quote-text').textContent();
    ok(quote.startsWith('“') && quote.endsWith('”'), 'quotation has quotation marks');
    ok(/[ְ-ֽ]/.test(quote), 'quotation is vocalized (nikud)');
    await page.goto(`${BASE}#/stories/akedah`);
    await page.waitForSelector('.level-panel');
    await page.locator('.story-side .floor-btn', { hasText: 'סוד' }).click();
    await page.waitForFunction(() => location.hash.includes('level=sod'));
    ok((await page.textContent('.level-panel .eyebrow')).includes('קריאה פנימית'), 'choosing sod shows its defined term');
    ok((await page.locator('.level-panel .source').count()) === 1, 'each term names its source');
    ok((await page.locator('.correlation').count()) === 1, 'story page shows its lenses');

    // Map: the stage, numbered stops, the journey
    await page.goto(`${BASE}#/map`);
    await page.waitForSelector('.stage-map .station');
    ok((await page.locator('.stage-map .station').count()) === 9, 'abraham route shows nine stations');
    const firstLabel = await page.locator('.stage-map .st-he').first().textContent();
    ok(/^1\./.test(firstLabel.trim()), 'stations are numbered on the map');
    await page.locator('.route-switch button', { hasText: 'מסע היציאה' }).click();
    await page.waitForFunction(() => document.querySelectorAll('.stage-map .station').length === 8);
    ok((await page.locator('.stage-map .station').count()) === 8, 'exodus route shows eight stations');
    await page.locator('.stop-row', { hasText: 'ים סוף' }).click();
    ok((await page.locator('.stop-rows .row-detail').count()) === 1, 'choosing a stop opens its archaeological note');
    await page.locator('.stage-tools button', { hasText: 'הפעל מסע' }).click();
    await page.waitForSelector('.traveler');
    ok((await page.locator('.traveler').count()) === 1, 'journey traveler appears on the map');

    // Time: the same stage, the year scale in its place
    await page.goto(`${BASE}#/time`);
    await page.waitForSelector('.stage-band .track-dot');
    ok((await page.locator('.stage-band .track-dot').count()) === 10, 'year scale shows ten events');
    ok((await page.locator('.stop-row.event-row').count()) === 10, 'events listed as numbered rows');

    // People: the tree, its zoom, relations
    await page.goto(`${BASE}#/people`);
    await page.waitForSelector('.chip-cloud');
    ok((await page.locator('.family-tree .tree-node').count()) >= 8, 'family tree shows its people');
    await page.locator('.tree-zoom button', { hasText: '+' }).click();
    ok((await page.locator('.tree-zoom button').nth(1).textContent()).includes('125%'), 'tree zooms in');
    await page.locator('.chip-cloud button', { hasText: 'יעקב' }).click();
    ok((await page.locator('.rel-list li').count()) >= 3, 'selecting a person lists its relations with sources');

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
    for (const hash of ['', '#/stories', '#/stories/yosef', '#/map', '#/time', '#/people', '#/journal', '#/books']) {
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
    await r.waitForSelector('.stage-map .station');
    ok((await r.locator('.stage-map .station').count()) === 9, 'map renders with reduced motion');

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
