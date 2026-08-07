import { chromium } from 'playwright';

const base = process.env.AUDIT_BASE_URL || 'http://127.0.0.1:4173';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const failures = [];
let fallbackRequests = 0;

await page.route('https://formsubmit.co/ajax/**', async (route) => {
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

try {
  await page.goto(`${base}/contact`, { waitUntil: 'domcontentloaded' });
  const form = page.locator('#contact-form');
  const name = page.locator('#contact-name');

  await page.waitForFunction(
    () => document.querySelector('#contact-form')?.dataset.contactFormReady === 'true',
    { timeout: 3000 },
  );

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
  try {
    await page.waitForFunction(
      (id) => Boolean(id) && document.activeElement?.id === id,
      firstId,
      { timeout: 1000 },
    );
  } catch (_) {
    const active = await page.evaluate(() => document.activeElement?.id || document.activeElement?.tagName || 'none');
    failures.push(`focus did not move to first invalid field; active=${active}`);
  }

  if (await name.inputValue() !== 'Nischhal') failures.push('entered value was not preserved');

  const status = page.locator('#contact-form-status');
  if (!/review the highlighted fields/i.test(await status.textContent() || '')) failures.push('status region did not announce validation failure');
  if (await status.getAttribute('role') !== 'status') failures.push('status region role is missing');

  // The local audit intentionally has no production Turnstile site key. A valid
  // submission must therefore remain usable through the provider fallback.
  await page.locator('#contact-email').fill('nischhal@example.com');
  await page.locator('#contact-need').selectOption({ label: 'Freelance UX/UI project' });
  await page.locator('#contact-timeline').selectOption({ label: 'This month' });
  await page.locator('#contact-message').fill('I need help simplifying a product workflow with several unclear states and handoff constraints.');
  await form.locator('button[type="submit"]').click();

  try {
    await page.waitForFunction(
      () => /sent successfully|thanks/i.test(document.querySelector('#contact-form-status')?.textContent || ''),
      { timeout: 3000 },
    );
  } catch (_) {
    failures.push(`valid fallback submission did not announce success; status=${await status.textContent() || ''}`);
  }

  if (fallbackRequests !== 1) failures.push(`expected one fallback delivery request; received ${fallbackRequests}`);
  if (await name.inputValue() !== '') failures.push('successful fallback submission did not reset the form');
  if (await form.locator('button[type="submit"]').isDisabled()) failures.push('submit button remained disabled after fallback success');
} catch (error) {
  failures.push(error.message);
}

await browser.close();
if (failures.length) {
  console.error('[contact-audit] Failed\n' + failures.map((failure) => `- ${failure}`).join('\n'));
  process.exit(1);
}
console.log('[contact-audit] Accessible validation and resilient submission behavior passed.');
