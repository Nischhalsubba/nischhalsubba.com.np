/**
 * @fileoverview Browser regression contract for the approved workspace homepage.
 * Purpose: Validate actual desktop/mobile structure, project browsing and scope-to-contact state.
 * Responsibilities: Keep the approved homepage, dependency paths and retained routes coherent.
 * Execution context: Playwright in GitHub Actions, alongside retained-page browser audits.
 * Connected files: .github/workflows/browser-audit.yml, src/workspace-home.
 * Maintenance: Test behavior, not snapshots of historical editorial CSS classes.
 */
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
const base = process.env.AUDIT_BASE_URL || 'http://127.0.0.1:4173';
const browser = await chromium.launch({ headless: true });
try {
  for (const width of [360, 390, 768, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.locator('body[data-portfolio-design="workspace-v1"]').waitFor();
    assert.equal(await page.locator('h1').count(), 1);
    assert.equal(await page.locator('#wkWorld .wf').count(), 14);
    assert.equal(await page.locator('#heroImg').evaluate(img => img.complete && img.naturalWidth > 0), true);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 2));
    if (width <= 640) {
      await page.locator('#tbMb').click();
      assert.equal(await page.locator('#tbMb').getAttribute('aria-expanded'), 'true');
      await page.locator('#tbMp a[href="#work"]').click();
      assert.equal(await page.locator('#tbMb').getAttribute('aria-expanded'), 'false');
    } else await page.locator('#tbTools a[href="#work"]').click();
    await page.locator('#openIndex').click();
    assert.equal(await page.locator('#projectIndex').evaluate(dialog => dialog.open), true);
    assert.equal(await page.locator('#projectIndex .project-grid > a').count(), 14);
    await page.locator('#closeIndex').click();
    await page.locator('#prLib .pr-c').first().press('Enter');
    assert.match(await page.locator('#prTot').textContent(), /Custom quote/);
    await page.locator('#prGo').click();
    await page.locator('#shAtt').waitFor({ state: 'visible' });
    assert.match(await page.locator('#shMsg').inputValue(), /Hi Nischhal/);
    assert.deepEqual(errors, []);
    await page.close();
  }
  console.log('[workspace-home] Desktop/mobile menu, 14 projects, scope selection and contact attachment passed.');
} finally { await browser.close(); }
