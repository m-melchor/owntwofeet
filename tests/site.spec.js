// Checks for the built site, English and Spanish. `npm run check` builds, then runs these.
import { test, expect } from '@playwright/test';
import { readFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';

const B = '/owntwofeet/';
const DIST = 'dist';

// Every built page, as a path after the base ('' is home). es.html is only a redirect.
const walk = dir => readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)]);
const FILES = walk(DIST).filter(f => f.endsWith('.html')).map(f => relative(DIST, f).replace(/\\/g, '/'));
const toPath = f => f.replace(/(^|\/)index\.html$/, '$1');
const PAGES = FILES.filter(f => f !== 'es.html').map(toPath);
const html = f => readFileSync(join(DIST, f), 'utf8');

// GoatCounter is the only outside service a page loads. Answer it locally so tests never count or wait on it.
test.beforeEach(async ({ context }) => {
  await context.route('https://gc.zgo.at/**', r => r.fulfill({ contentType: 'text/javascript', body: '' }));
});

function watch(page) {
  const errors = [], outside = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', e => errors.push(e.message));
  page.on('request', r => { const u = new URL(r.url()); if (u.hostname !== 'localhost' && u.hostname !== 'gc.zgo.at') outside.push(r.url()); });
  return { errors, outside };
}

test('sitemap lists every page except the 404 and the old es.html', () => {
  const locs = [...readFileSync('public/sitemap.xml', 'utf8').matchAll(/<loc>https:\/\/m-melchor\.github\.io\/owntwofeet\/([^<]*)<\/loc>/g)].map(m => m[1]);
  expect(new Set(locs).size).toBe(locs.length);
  expect([...locs].sort()).toEqual(PAGES.filter(p => !p.endsWith('404.html')).sort());
});

for (const pg of PAGES) {
  test(`/${pg}: no errors, nothing loads from outside, no sideways scroll`, async ({ page }) => {
    const w = watch(page);
    for (const width of [390, 1366]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(B + pg);
      await page.waitForTimeout(600);
      const sw = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      expect(sw, `sideways scroll at ${width}`).toBeLessThanOrEqual(0);
    }
    expect(w.errors).toEqual([]);
    expect(w.outside).toEqual([]);
  });
}

test('every internal link loads and its #target exists', async ({ request }) => {
  // Old one-page hashes on home are sent to their new pages by script, so they have no target on home.
  const OLD = ['tools', 'workshops', 'involved', 'ageTabs', 'previews', 'home'];
  const links = new Set(FILES.flatMap(f => [...html(f).matchAll(/href="(\/owntwofeet\/[^"]*)"/g)].map(m => m[1])));
  const bodies = {};
  for (const l of links) {
    const [path, hash] = l.slice(B.length).split('#');
    bodies[path] ??= await request.get(B + path).then(async r => (r.ok() ? r.text() : null));
    expect(bodies[path], `${l} loads`).not.toBeNull();
    if (hash && !((path === '' || path === 'es/') && OLD.includes(hash))) expect(bodies[path], `${l} target`).toContain(`id="${hash}"`);
  }
});

test('old one-page links land on the new pages', async ({ page }) => {
  const REDIR = [['#tools', 'activities/tools/'], ['#workshops', 'workshops/'], ['#involved', 'get-involved/'], ['#ageTabs', 'workshops/#ageTabs'], ['#previews', 'activities/#previews'], ['#interest', '#interest'], ['#faq', '#faq'], ['#home', '']];
  for (const [h, want] of REDIR) {
    await page.goto('about:blank');
    await page.goto(B + h);
    await expect(page).toHaveURL(B + want);
  }
  await page.goto(B + 'activities/#previews');
  await expect.poll(() => page.evaluate(() => document.querySelector('#previews').open)).toBe(true);
});

test('es.html sends visitors to the Spanish site', async ({ page }) => {
  await page.goto(B + 'es.html');
  await expect(page).toHaveURL(B + 'es/');
});

test('language switch keeps the page and hash, and the choice is remembered', async ({ page }) => {
  await page.goto(B + 'es/workshops/#ageTabs');
  await page.locator('a[data-setlang]:visible').first().click();
  await expect(page).toHaveURL(B + 'workshops/#ageTabs');
  await page.goto('about:blank');
  await page.goto(B + 'story/');
  await expect(page).toHaveURL(B + 'story/');
  await page.locator('a[data-setlang]:visible').first().click();
  await expect(page).toHaveURL(B + 'es/story/');
  await page.goto('about:blank');
  await page.goto(B + 'workshops/');
  await expect(page).toHaveURL(B + 'es/workshops/');
});

test('Spanish pages are marked Spanish and their links stay in Spanish', async ({ page }) => {
  for (const pg of PAGES.filter(p => p.startsWith('es/') && !p.endsWith('404.html'))) {
    await page.goto(B + pg);
    expect(await page.evaluate(() => document.documentElement.lang), pg).toBe('es-MX');
    const en = await page.evaluate(() => [...document.querySelectorAll('main a[href^="/owntwofeet/"]')].filter(a => !a.getAttribute('href').includes('/es/') && !a.dataset.setlang).map(a => a.getAttribute('href')));
    expect(en, pg).toEqual([]);
  }
});

async function fillForm(page) {
  const step = n => page.locator(`#interestForm [data-step="${n}"]`);
  const advance = async n => { // picking a choice may move on by itself; press Next only if it didn't
    await page.waitForTimeout(400);
    if (await step(n).evaluate(e => e.classList.contains('on'))) await step(n).locator(`[data-go="${n + 1}"]`).click();
    await expect(step(n + 1)).toHaveClass(/\bon\b/);
  };
  await step(1).locator('label:has(input[value="Teacher"])').click();
  await advance(1);
  await step(2).locator('label.check:visible').first().click();
  await advance(2);
  await page.fill('#f-name', 'Test Teacher');
  await page.fill('#f-email', 'test@example.com');
  await advance(3);
  await page.locator('label.agree').click();
  await page.click('#formSend');
}

for (const lang of ['', 'es/']) {
  test(`interest form sends and thanks (${lang || 'en'})`, async ({ page }) => {
    let body = '';
    await page.route('https://formspree.io/**', r => { body = r.request().postDataBuffer()?.toString('utf8') || ''; r.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' }); });
    await page.goto(B + lang + 'get-involved/');
    await fillForm(page);
    await expect(page.locator('#formDone')).toBeVisible();
    expect(body).toContain('Teacher');
    expect(body).toContain('test@example.com');
    if (lang) expect(body).toContain('español');
  });
}

test('interest form keeps the answers when sending fails', async ({ page }) => {
  await page.route('https://formspree.io/**', r => r.fulfill({ status: 500, body: '' }));
  await page.goto(B + 'get-involved/');
  await fillForm(page);
  await expect(page.locator('#formErr')).toBeVisible();
  await expect(page.locator('#formDone')).toBeHidden();
  await expect(page.locator('#f-name')).toHaveValue('Test Teacher');
});

test('finishing activities: practiced card, Next button, Done marks', async ({ page }) => {
  await page.goto(B + 'activities/budget/');
  await page.evaluate(() => { localStorage.clear(); finish('budget'); });
  await expect(page.locator('#pracBudget')).toBeVisible();
  await page.locator('[data-pnext]').click();
  await expect(page).toHaveURL(B + 'activities/scams/');
  await page.waitForFunction(() => typeof doneSet === 'function');
  await page.evaluate(() => ['tools', 'scams', 'call'].forEach(x => doneSet(x)));
  await page.goto(B + 'activities/laundry/');
  await page.evaluate(() => finish('laundry'));
  await expect(page.locator('[data-pnext]')).toHaveText('See all activities');
  await page.locator('[data-pnext]').click();
  await expect(page).toHaveURL(B + 'activities/');
  await expect(page.locator('[data-done]:not([hidden])')).toHaveCount(5);
});

test('Tool Time draws its 3D bench', async ({ page }) => {
  await page.goto(B + 'activities/tools/');
  await expect(page.locator('.act-back')).toHaveAttribute('href', B + 'activities/');
  await expect(page.locator('.act-next b')).toHaveText('Saturday on $25');
  await expect(page.locator('#benchWrap canvas')).toHaveCount(1, { timeout: 10000 });
});

for (const f of FILES.filter(f => /^(es\/)?manuals\/(?!index)[^/]+\.html$/.test(f))) {
  test(`manual /${f}: every screen opens`, async ({ page }) => {
    await page.goto(B + f);
    const ids = await page.evaluate(() => [...document.querySelectorAll('section[data-screen][id]')].map(s => s.id));
    expect(ids.length).toBeGreaterThan(1);
    for (const id of ids) {
      await page.evaluate(h => { location.hash = h; }, id);
      await expect(page.locator('#' + id)).toHaveClass(/\bon\b/);
    }
  });
}

test('with scripts blocked, every main page still shows its content', async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1366, height: 900 } });
  const page = await ctx.newPage();
  for (const pg of ['', 'workshops/', 'activities/', 'story/', 'get-involved/', 'monthly-plan/', 'activities/tools/', 'activities/budget/', 'activities/scams/', 'activities/call/', 'activities/laundry/']) {
    for (const lang of ['', 'es/']) {
      await page.goto(B + lang + pg);
      const h = await page.evaluate(() => (document.querySelector('[data-view]') || {}).offsetHeight || 0);
      expect(h, lang + pg).toBeGreaterThan(600);
    }
  }
  await ctx.close();
});
