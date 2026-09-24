// Run with Playwright installed (or available through NODE_PATH). No build step is needed.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import http from 'node:http';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const root = path.resolve('.');
const shots = process.env.FORMA_SCREENSHOTS || fs.mkdtempSync(path.join(os.tmpdir(), 'forma-qa-'));
fs.mkdirSync(shots, { recursive: true });
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml' };
const server = http.createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  let file = path.resolve(root, '.' + pathname);
  if (file !== root && !file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!fs.existsSync(file)) { res.writeHead(404).end(); return; }
  res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ headless: true, ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}) });
const errors = [];
const pageErrors = page => {
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('requestfailed', request => errors.push(request.url() + ': ' + request.failure().errorText));
  page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
};
const settle = page => page.waitForFunction(() => document.querySelector('#product-stage').getAttribute('aria-busy') === 'false' && document.querySelectorAll('.product-layer').length === 1);
async function noCyrillic(page) {
  const leftovers = await page.evaluate(() => {
    const strings = [];
    const walk = document.createTreeWalker(document.documentElement, NodeFilter.SHOW_TEXT);
    while (walk.nextNode()) if (!walk.currentNode.parentElement.closest('script,style')) strings.push(walk.currentNode.textContent);
    for (const element of document.querySelectorAll('*')) for (const name of ['alt', 'title', 'placeholder', 'aria-label', 'content']) if (element.hasAttribute(name)) strings.push(element.getAttribute(name));
    return strings.filter(value => /[А-Яа-яЁё]/.test(value));
  });
  assert.deepEqual(leftovers, [], 'Untranslated English text');
}
async function capture(page, name, fullPage = false) {
  await page.screenshot({ path: path.join(shots, name + '.png'), fullPage });
}
try {
  for (const lang of ['ru', 'en']) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, locale: lang === 'ru' ? 'en-US' : 'ru-RU' });
    await context.addInitScript(language => localStorage.setItem('axilium-language', language), lang);
    const page = await context.newPage();
    pageErrors(page);
    await page.goto(base + '/demos/forma/');
    await page.waitForFunction(() => !document.documentElement.hasAttribute('data-i18n-loading'));
    assert.equal(await page.locator('html').getAttribute('lang'), lang, 'Saved language overrides browser locale');
    assert.equal(await page.locator('select').count(), 0, 'No separate language selector');
    await page.waitForTimeout(1000);
    await capture(page, `hero-${lang}-1440`);
    for (const width of [1920, 1440, 1280, 1024, 768, 430, 390, 360]) {
      await page.setViewportSize({ width, height: width < 600 ? 844 : 1000 });
      await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
      await page.waitForTimeout(350);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${lang} ${width}: horizontal overflow`);
      const clipped = await page.locator('h1,h2,h3,.config-options,.swatches').evaluateAll(elements => elements.filter(el => el.scrollWidth > el.clientWidth + 1).map(el => el.textContent));
      assert.deepEqual(clipped, [], `${lang} ${width}: clipped text`);
      if ([1440, 768, 390, 360].includes(width)) await capture(page, `hero-${lang}-${width}`);
    }
    // Native radio groups support Tab and arrow keys without custom key handlers.
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.locator('[name="configuration"][value="classic"]').focus();
    await page.keyboard.press('ArrowLeft');
    await settle(page);
    assert.ok(await page.locator('[name="configuration"][value="compact"]').isChecked());
    await page.keyboard.press('ArrowRight');
    await settle(page);
    const prices = { compact: 149900, classic: 189900, corner: 239900 };
    const fabrics = { sand: 0, moss: 6000, graphite: 6000, clay: 9000 };
    const heights = [];
    for (const [config, amount] of Object.entries(prices)) {
      await page.locator(`[name="configuration"][value="${config}"]`).check();
      for (const [fabric, extra] of Object.entries(fabrics)) {
        await page.locator(`[name="fabric"][value="${fabric}"]`).check();
        await settle(page);
        await page.waitForFunction(total => Number(document.querySelector('#price').textContent.replace(/\D/g, '')) === total, amount + extra);
        assert.equal(await page.locator('.product-layer.is-current').getAttribute('src'), `assets/${config}-${fabric}.webp`);
        assert.match(await page.locator('#order-summary').textContent(), new RegExp(config, 'i'));
        assert.match(await page.locator('#order-summary').textContent(), new RegExp(fabric, 'i'));
        heights.push((await page.locator('#product-stage').boundingBox()).height);
        if (lang === 'en') await noCyrillic(page);
      }
    }
    assert.equal(new Set(heights).size, 1, 'No product-stage layout shifts');
    // Rapid input while a previous transition is in progress must end on the last choice.
    await page.locator('[name="configuration"][value="compact"]').check();
    await page.locator('[name="fabric"][value="moss"]').check();
    await page.locator('[name="configuration"][value="corner"]').check();
    await page.locator('[name="fabric"][value="graphite"]').check();
    await settle(page);
    assert.match(await page.locator('.is-current').getAttribute('src'), /corner-graphite/);
    await page.locator('#configurator').scrollIntoViewIfNeeded();
    await page.waitForTimeout(850);
    await capture(page, `config-${lang}-1440`);
    await page.locator('.config-controls>.button').click();
    await page.waitForTimeout(600);
    assert.equal(new URL(page.url()).hash, '#contact');
    assert.match(await page.locator('#order-summary').textContent(), /Corner · Graphite/);
    // Required fields reject an empty submission; a completed demo sends no requests.
    await page.locator('button[type="submit"]').click();
    assert.equal(await page.locator('#form-status').textContent(), '');
    await page.locator('#name').fill('Demo Visitor');
    await page.locator('#contact-detail').fill('@demo_visitor');
    await page.locator('#comment').fill('Demo: please keep all data local.');
    const submissions = [];
    const watch = req => { if (['fetch', 'xhr', 'document'].includes(req.resourceType())) submissions.push(req.url()); };
    page.on('request', watch);
    await page.locator('button[type="submit"]').click();
    await page.waitForTimeout(450);
    assert.match(await page.locator('#form-status').textContent(), lang === 'en' ? /no enquiry or personal details have been sent/ : /никуда не отправлены/);
    assert.deepEqual(submissions, [], 'Demo submission must not send requests');
    page.off('request', watch);
    assert.equal(await page.locator('#form-status').getAttribute('aria-live'), 'polite');
    if (lang === 'en') await noCyrillic(page);
    for (const model of ['M2 Low', 'M3 Lounge']) {
      await page.locator(`[data-model="${model}"]`).click();
      assert.match(await page.locator('#order-summary').textContent(), new RegExp(model));
    }
    await page.locator('[data-samples]').click();
    assert.match(await page.locator('#order-summary').textContent(), /Sand \/ Moss \/ Graphite \/ Clay/);
    await page.locator('.config-controls>.button').click();
    assert.match(await page.locator('#order-summary').textContent(), /M1 · Corner · Graphite/);
    // All page anchors resolve, including the two portfolio return links.
    const links = await page.locator('a[href]').evaluateAll(elements => elements.map(el => el.getAttribute('href')));
    for (const href of links.filter(href => href.startsWith('#'))) assert.equal(await page.locator(href).count(), 1, `Broken anchor ${href}`);
    assert.equal(links.filter(href => href === '../../').length, 2);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
    await page.locator('.menu-toggle').click();
    assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'true');
    await page.waitForTimeout(300);
    await capture(page, `menu-${lang}-390`);
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'false');
    assert.ok(await page.locator('.menu-toggle').evaluate(el => el === document.activeElement));
    await page.locator('.menu-toggle').click();
    await page.locator('.navigation a[href="#configurator"]').first().click();
    assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'false');
    await page.waitForTimeout(800);
    await capture(page, `config-${lang}-390`);
    await page.locator('.config-controls').scrollIntoViewIfNeeded();
    await capture(page, `controls-${lang}-390`);
    for (const selector of ['.hero', '.modular', '#configurator', '#materials', '#collection', '.interiors', '#about', '#contact', '.footer']) {
      await page.locator(selector).scrollIntoViewIfNeeded();
      await page.waitForTimeout(800);
      if (['#materials', '#contact'].includes(selector)) await page.locator(selector).screenshot({ path: path.join(shots, `${selector.slice(1)}-${lang}-390.png`) });
    }
    await page.evaluate(() => Promise.all([...document.images].map(img => img.decode())));
    assert.deepEqual(await page.locator('img').evaluateAll(images => images.filter(img => !img.naturalWidth).map(img => img.src)), []);
    await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
    await page.waitForTimeout(350);
    await capture(page, `full-${lang}-390`, true);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.locator('[name="fabric"][value="clay"]').check();
    await settle(page);
    assert.equal(await page.locator('.product-layer').evaluate(el => getComputedStyle(el).transitionDuration), '0s');
    assert.equal(await page.locator('.parallax-image').first().evaluate(el => getComputedStyle(el).transform), 'none');
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
    await capture(page, `full-${lang}-1440`, true);
    if (process.argv.includes('--previews')) {
      // A real page screenshot at the existing portfolio card's aspect ratio.
      await page.setViewportSize({ width: 1440, height: 945 });
      await page.locator('.hero').screenshot({ path: path.join(root, 'assets', `forma-preview${lang === 'en' ? '-en' : ''}.png`) });
    }
    console.log(`OK ${lang}: 8 widths, 12 combinations, keyboard, rapid input, price, form, menu, links, images, reduced motion`);
    await context.close();
  }
  // Browser-language fallback and invalid saved preferences.
  for (const [locale, saved, expected] of [['ru-RU', null, 'ru'], ['ru-KZ', null, 'ru'], ['fr-FR', null, 'en'], ['ru-RU', 'invalid', 'ru']]) {
    const context = await browser.newContext({ locale });
    if (saved) await context.addInitScript(value => localStorage.setItem('axilium-language', value), saved);
    const page = await context.newPage();
    await page.goto(base + '/demos/forma/');
    assert.equal(await page.locator('html').getAttribute('lang'), expected);
    await context.close();
  }
  // A slow / failed image must never blank the stage or commit stale selections.
  {
    const context = await browser.newContext({ locale: 'en-US', reducedMotion: 'reduce' });
    await context.addInitScript(() => Object.defineProperty(navigator, 'connection', { value: { saveData: true } }));
    await context.route('**/compact-clay.webp', async route => {
      await new Promise(resolve => setTimeout(resolve, 900));
      await route.continue();
    });
    const page = await context.newPage();
    await page.goto(base + '/demos/forma/');
    await page.locator('[name="configuration"][value="compact"]').check();
    await settle(page);
    await page.locator('[name="fabric"][value="clay"]').check();
    assert.equal(await page.locator('#product-stage').getAttribute('aria-busy'), 'true');
    assert.match(await page.locator('.is-current').getAttribute('src'), /compact-sand/);
    await page.locator('[name="configuration"][value="corner"]').check();
    await settle(page);
    await page.waitForTimeout(1000);
    assert.match(await page.locator('.is-current').getAttribute('src'), /corner-clay/);
    await context.route('**/corner-graphite.webp', route => route.abort());
    await page.locator('[name="fabric"][value="graphite"]').check();
    await settle(page);
    assert.match(await page.locator('.is-current').getAttribute('src'), /corner-clay/);
    assert.ok(await page.locator('[name="fabric"][value="clay"]').isChecked());
    assert.match(await page.locator('#config-status').textContent(), /could not load/);
    await context.unroute('**/corner-graphite.webp');
    await page.locator('[name="fabric"][value="graphite"]').check();
    await settle(page);
    assert.match(await page.locator('.is-current').getAttribute('src'), /corner-graphite/);
    await noCyrillic(page);
    await context.close();
    console.log('OK delayed image, stale request, failed image rollback and retry');
  }
  // Real language selection on the portfolio is inherited by its new demo card.
  {
    const context = await browser.newContext({ locale: 'en-US' });
    const page = await context.newPage();
    await page.goto(base + '/');
    assert.equal(await page.locator('.project').count(), 4);
    assert.match(await page.locator('.project').nth(2).textContent(), /FORMA/);
    for (const lang of ['ru', 'en']) {
      await Promise.all([page.waitForEvent('load'), page.locator('#language-select').selectOption(lang)]);
      const [demo] = await Promise.all([context.waitForEvent('page'), page.locator('.project-link[href="demos/forma/"]').click()]);
      await demo.waitForLoadState();
      assert.equal(await demo.locator('html').getAttribute('lang'), lang);
      await demo.locator('.demo-notice a').click();
      assert.equal(new URL(demo.url()).pathname, '/');
      assert.equal(await demo.locator('#language-select').inputValue(), lang);
      assert.ok(await demo.locator('img[src*="forma-preview"]').evaluate(image => image.complete && image.naturalWidth > 0));
      await demo.close();
    }
    await context.close();
    console.log('OK portfolio project order, language inheritance, preview assets and return links');
  }
  assert.deepEqual(errors, [], 'Console or network errors');
  console.log('OK language fallback; no console errors, failed requests or broken assets');
  console.log('Screenshots: ' + shots);
} finally {
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}
