/**
 * @fileoverview End-to-end contract for the homepage-aligned inner page system.
 * Purpose: Check every inner route at mobile, tablet and desktop widths in CI.
 * Responsibilities: Validate identity, fonts, overflow, images, keyboard menu and article/project navigation.
 * Execution context: Playwright Chromium in GitHub Actions, using built or live output.
 * Connected files: src/workspace-inner, audit-workspace-inner.cjs, browser-audit.yml.
 * Maintenance: Keep screenshots as review evidence; geometry and behavior remain hard assertions.
 */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
const base = process.env.AUDIT_BASE_URL || 'http://127.0.0.1:4173';
const allRoutes = JSON.parse(fs.readFileSync('dist/workspace-inner/routes.json', 'utf8'));
const representative = ['project-yarsha.html', 'blog/index.html', 'blog/beautiful-interface-poor-ux.html', 'projects.html', 'services.html', 'about.html', 'contact.html'];
const inventory = process.argv.includes('--quick') ? allRoutes.filter(route => representative.includes(route.file)) : allRoutes;
const screenshotRoot = path.resolve('tests/workspace-inner/results');
fs.mkdirSync(screenshotRoot, { recursive: true });
const browser = await chromium.launch({ headless: true });
const failures = [];
try {
  for (const width of [360, 768, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
    for (const route of inventory) {
      const errors = [];
      /** Function contract: onError
       * Purpose: Capture uncaught runtime exceptions for the current route.
       * Inputs: browser Error. Side effects: appends diagnostic message. Returns: void.
       */
      const onError = error => errors.push(error.message);
      page.on('pageerror', onError);
      try {
        const response = await page.goto(`${base}/${route.file}`, { waitUntil: 'networkidle' });
        assert.ok(response.ok(), `${route.file} returned ${response.status()}`);
        await page.locator('body[data-portfolio-design="workspace-inner-v1"]').waitFor();
        assert.equal(await page.locator('main h1').count(), 1);
        const geometry = await page.evaluate(/** Callback contract: Read visible layout and media state for route assertions. Inputs: none. Side effects: none. Returns: serializable DOM measurements. */ () => ({
          overflow: document.documentElement.scrollWidth - innerWidth,
          font: getComputedStyle(document.body).fontFamily,
          background: getComputedStyle(document.body).backgroundColor,
          missing: [...document.querySelectorAll('main img')].filter(image => image.complete && image.currentSrc && image.naturalWidth === 0).map(image => image.getAttribute('src')),
          navigation: [...document.querySelectorAll('#tbTools a')].filter(link => link.getAttribute('aria-label') === 'Writing').length,
        }));
        assert.ok(geometry.overflow <= 2, `Horizontal overflow: ${geometry.overflow}px`);
        assert.match(geometry.font, /Geist/);
        assert.equal(geometry.background, 'rgb(7, 7, 10)');
        assert.deepEqual(geometry.missing, []);
        assert.equal(geometry.navigation, 1);
        assert.deepEqual(errors, []);
        if (width === 360) {
          await page.locator('#tbMb').click();
          assert.equal(await page.locator('#tbMb').getAttribute('aria-expanded'), 'true');
          assert.equal(await page.locator('main').evaluate(element => element.inert), true);
          await page.keyboard.press('Escape');
          assert.equal(await page.locator('#tbMb').getAttribute('aria-expanded'), 'false');
          assert.equal(await page.locator('main').evaluate(element => element.inert), false);
        }
        if (['project-yarsha.html', 'blog/index.html', 'blog/beautiful-interface-poor-ux.html', 'projects.html', 'services.html', 'about.html', 'contact.html'].includes(route.file)) {
          await page.screenshot({ path: path.join(screenshotRoot, `${width}-${route.file.replaceAll('/', '-')}.png`), fullPage: true });
        }
      } catch (error) { failures.push(`${width}px ${route.file}: ${error.message}`); }
      finally { page.off('pageerror', onError); }
    }
    await page.close();
  }
} finally { await browser.close(); }
assert.deepEqual(failures, []);
console.log(`[workspace-inner-browser] ${inventory.length} routes passed at 360, 768 and 1440px, with project/article/menu and image checks.`);
