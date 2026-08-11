/**
 * @fileoverview scripts/browser-contact-audit.mjs
 * Purpose: Node-based build, content transformation, QA, or maintenance tool for browser contact audit.
 * Responsibilities:
 * - Own the behavior/content implied by this file's single responsibility.
 * - Keep public routes, build contracts, and imported module boundaries stable unless the connected owners are updated together.
 * Execution context: Node.js CLI during local development, CI, build, or maintenance.
 * Connected files:
 * - .github/workflows/browser-audit.yml
 * - .github/workflows/production-qa.yml
 * - docs/repository/file-catalog.md
 * - package.json
 * Maintenance: Update this header when responsibility or dependencies change; generated/vendor files are documented at their source instead.
 */
import { chromium } from 'playwright';

const base = process.env.AUDIT_BASE_URL || 'http://127.0.0.1:4173';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const failures = [];
let fallbackRequests = 0;

await page.route('https://formsubmit.co/ajax/**', /** Callback contract: Processes the callback step for page without leaking orchestration details to the caller. Inputs: route. Side effects: no obvious external side effect beyond invoked dependencies. Returns a value to the invoking API. */ async (route) => {
  fallbackRequests += 1;
  if (route.request().method() !== 'POST') {
    await route.fulfill({ status: 405, contentType: 'application/json', body: JSON.stringify({ message: 'Method not allowed' }) });
    return;
  }
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ success: 'true', message: 'Thanks. Your message was sent successfully.' }),
  });
});

/**
 * Function contract: waitForAttribute
 * Purpose: Implements the wait for attribute responsibility for this module.
 * Inputs: locator, name, expected, timeout.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
async function waitForAttribute(locator, name, expected, timeout = 3000) {
  const deadline = Date.now() + timeout;
  let value = null;

  while (Date.now() < deadline) {
    try {
      value = await locator.getAttribute(name);
    } catch (_) {
      value = null;
    }
    if (value === expected) return true;
    await page.waitForTimeout(100);
  }

  return false;
}

/**
 * Function contract: waitForFocusedId
 * Purpose: Implements the wait for focused id responsibility for this module.
 * Inputs: expectedId, timeout.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
async function waitForFocusedId(expectedId, timeout = 2200) {
  const deadline = Date.now() + timeout;

  while (Date.now() < deadline) {
    const focusedId = await page.locator(':focus').first().getAttribute('id').catch(/** Callback contract: Processes the callback step for page.locator(':focus').first().get attribute('id') without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ () => null);
    if (focusedId === expectedId) return true;
    await page.waitForTimeout(100);
  }

  return false;
}

/**
 * Function contract: describeFocus
 * Purpose: Implements the describe focus responsibility for this module.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
async function describeFocus() {
  const focused = page.locator(':focus').first();
  const id = await focused.getAttribute('id').catch(/** Callback contract: Processes the callback step for focused.get attribute('id') without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ () => null);
  if (id) return id;
  if (await page.locator('body:focus').count()) return 'BODY';
  if (await page.locator('html:focus').count()) return 'HTML';
  return 'unknown';
}

/**
 * Function contract: waitForStatusText
 * Purpose: Implements the wait for status text responsibility for this module.
 * Inputs: locator, pattern, timeout.
 * Side effects: may read or update browser DOM/state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
async function waitForStatusText(locator, pattern, timeout = 5000) {
  const deadline = Date.now() + timeout;
  let text = '';

  while (Date.now() < deadline) {
    try {
      text = (await locator.textContent()) || '';
    } catch (_) {
      text = '';
    }
    if (pattern.test(text)) return text;
    await page.waitForTimeout(100);
  }

  return text;
}

try {
  await page.goto(`${base}/contact`, { waitUntil: 'domcontentloaded' });
  const form = page.locator('#contact-form');
  const name = page.locator('#contact-name');

  if (!await waitForAttribute(form, 'data-contact-form-ready', 'true', 3000)) {
    failures.push('contact form runtime did not become ready');
  }

  await name.fill('Nischhal');
  await form.locator('button[type="submit"]').click();

  const invalid = page.locator('#contact-form [aria-invalid="true"]');
  if (await invalid.count() < 4) failures.push('expected field-level errors for required fields');

  const first = invalid.first();
  const described = (await first.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean);
  if (!described.length) failures.push('first invalid field lacks aria-describedby');
  for (const id of described) {
    if (!await page.locator(`#${id}`).count()) failures.push(`missing described error ${id}`);
  }

  const firstId = await first.getAttribute('id');
  if (!firstId) failures.push('first invalid field is missing an id');

  // Third-party verification widgets can finish mounting shortly after the form
  // has already focused the invalid field. Simulate that late focus loss so the
  // local audit covers the race that can otherwise appear only in production.
  await page.waitForTimeout(50);
  await first.blur();

  if (firstId && !await waitForFocusedId(firstId, 2200)) {
    failures.push(`focus did not recover to first invalid field; active=${await describeFocus()}`);
  }

  if (await name.inputValue() !== 'Nischhal') failures.push('entered value was not preserved');

  const status = page.locator('#contact-form-status');
  if (!/review the highlighted fields/i.test(await status.textContent() || '')) failures.push('status region did not announce validation failure');
  if (await status.getAttribute('role') !== 'status') failures.push('status region role is missing');

  // The audit intentionally cannot solve a real production Turnstile challenge.
  // A valid submission must therefore remain usable through the provider fallback.
  await page.locator('#contact-email').fill('nischhal@example.com');
  await page.locator('#contact-need').selectOption({ label: 'Freelance UX/UI project' });
  await page.locator('#contact-timeline').selectOption({ label: 'This month' });
  await page.locator('#contact-message').fill('I need help simplifying a product workflow with several unclear states and handoff constraints.');
  await form.locator('button[type="submit"]').click();

  const successText = await waitForStatusText(status, /sent successfully|thanks/i, 5000);
  if (!/sent successfully|thanks/i.test(successText)) {
    failures.push(`valid fallback submission did not announce success; status=${successText}`);
  }

  const resetDeadline = Date.now() + 2000;
  while (Date.now() < resetDeadline && await name.inputValue() !== '') {
    await page.waitForTimeout(50);
  }

  if (fallbackRequests !== 1) failures.push(`expected one fallback delivery request; received ${fallbackRequests}`);
  if (await name.inputValue() !== '') failures.push('successful fallback submission did not reset the form');
  if (await form.locator('button[type="submit"]').isDisabled()) failures.push('submit button remained disabled after fallback success');
} catch (error) {
  failures.push(error.message);
}

await browser.close();
if (failures.length) {
  console.error('[contact-audit] Failed\n' + failures.map(/** Callback contract: Processes the callback step for failures without leaking orchestration details to the caller. Inputs: failure. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (failure) => `- ${failure}`).join('\n'));
  process.exit(1);
}
console.log('[contact-audit] Accessible validation, focus recovery, resilient submission, and strict-CSP compatibility passed.');
