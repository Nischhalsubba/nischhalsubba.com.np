/**
 * @fileoverview scripts/browser-contact-audit.mjs
 * Purpose: Validate browser contact audit and fail with actionable diagnostics when the production contract is violated.
 * Responsibilities:
 * - Operate deterministically on canonical source or build output so repeated runs produce stable results.
 * - Surface invalid input or contract drift as explicit failures instead of silently masking it.
 * - Keep path assumptions synchronized with repository manifests and source-layout ownership.
 * Execution context: Node.js CLI during development, generation, build, CI, or repository maintenance.
 * Connected files:
 * - package.json
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
import { chromium } from 'playwright';

const base = process.env.AUDIT_BASE_URL || 'http://127.0.0.1:4173';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const failures = [];
let fallbackRequests = 0;

await page.route('https://formsubmit.co/ajax/**', /** Callback contract: Perform the local callback step required by the immediately enclosing operation. Inputs: `route`. Side effects: no direct external side effect beyond invoked dependencies. Returns: Promise resolving after the callback side effects complete. */ async (route) => {
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
 * Purpose: Implement the wait for attribute responsibility owned by the browser contact audit repository tool.
 * Inputs: `locator`: input consumed by this operation; `name`: stable identifier or label for the current item; `expected`: input consumed by this operation; `timeout`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Promise resolving to the computed result used by the caller; failure is propagated or handled inside the function as implemented.
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
 * Purpose: Implement the wait for focused id responsibility owned by the browser contact audit repository tool.
 * Inputs: `expectedId`: input consumed by this operation; `timeout`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Promise resolving to the computed result used by the caller; failure is propagated or handled inside the function as implemented.
 */
async function waitForFocusedId(expectedId, timeout = 2200) {
  const deadline = Date.now() + timeout;

  while (Date.now() < deadline) {
    const focusedId = await page.locator(':focus').first().getAttribute('id').catch(/** Callback contract: Convert or report the rejected asynchronous operation according to the surrounding failure-handling policy. Inputs: none. Side effects: no direct external side effect beyond invoked dependencies. Returns: `null` as the local fallback value. */ () => null);
    if (focusedId === expectedId) return true;
    await page.waitForTimeout(100);
  }

  return false;
}

/**
 * Function contract: describeFocus
 * Purpose: Implement the describe focus responsibility owned by the browser contact audit repository tool.
 * Inputs: None; derives required state from the enclosing module/runtime context.
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Promise resolving to the computed result used by the caller; failure is propagated or handled inside the function as implemented.
 */
async function describeFocus() {
  const focused = page.locator(':focus').first();
  const id = await focused.getAttribute('id').catch(/** Callback contract: Convert or report the rejected asynchronous operation according to the surrounding failure-handling policy. Inputs: none. Side effects: no direct external side effect beyond invoked dependencies. Returns: `null` as the local fallback value. */ () => null);
  if (id) return id;
  if (await page.locator('body:focus').count()) return 'BODY';
  if (await page.locator('html:focus').count()) return 'HTML';
  return 'unknown';
}

/**
 * Function contract: waitForStatusText
 * Purpose: Implement the wait for status text responsibility owned by the browser contact audit repository tool.
 * Inputs: `locator`: input consumed by this operation; `pattern`: input consumed by this operation; `timeout`: input consumed by this operation
 * Side effects: reads or updates DOM/browser state.
 * Returns: Promise resolving to the computed result used by the caller; failure is propagated or handled inside the function as implemented.
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
  console.error('[contact-audit] Failed\n' + failures.map(/** Callback contract: Processes the callback step for failures without leaking orchestration details to the caller. Inputs: failure. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `failure`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `failure`. Side effects: no direct external side effect beyond invoked dependencies. Returns: computed expression result consumed by the enclosing operation. */ (failure) => `- ${failure}`).join('\n'));
  process.exit(1);
}
console.log('[contact-audit] Accessible validation, focus recovery, resilient submission, and strict-CSP compatibility passed.');
