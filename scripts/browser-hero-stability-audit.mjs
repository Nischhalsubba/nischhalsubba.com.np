import { chromium } from 'playwright';

const base = process.env.AUDIT_BASE_URL || 'http://127.0.0.1:4173';
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();
const response = await page.goto(`${base}/`, { waitUntil: 'networkidle', timeout: 30000 });
if (!response || response.status() >= 400) throw new Error(`HTTP ${response?.status() || 'none'}`);
await page.waitForTimeout(1800);

const portrait = page.locator('.nrs-original-portrait:not(.nrs-original-portrait-ghost)');
const field = page.locator('.nrs-decision-field');
const visual = page.locator('.nrs-uploaded-visual');
const basePortrait = await portrait.boundingBox();
const baseField = await field.boundingBox();
const keys = ['problem', 'rules', 'state', 'choice', 'signal'];
const failures = [];

function delta(a, b) {
  if (!a || !b) return null;
  return Object.fromEntries(['x','y','width','height'].map((key) => [key, Number((b[key] - a[key]).toFixed(3))]));
}
function stable(a, b, tolerance = 1.5) {
  if (!a || !b) return false;
  return ['x','y','width','height'].every((key) => Math.abs(b[key] - a[key]) <= tolerance);
}

for (const key of keys) {
  const node = page.locator(`.nrs-story-node[data-story="${key}"]`);
  await node.focus();
  await page.waitForTimeout(520);
  const nextPortrait = await portrait.boundingBox();
  const nextField = await field.boundingBox();
  console.log(`[hero-stability] ${key} portrait delta`, JSON.stringify(delta(basePortrait, nextPortrait)), 'field delta', JSON.stringify(delta(baseField, nextField)));
  if (!stable(basePortrait, nextPortrait)) failures.push(`${key}: portrait changed after settle ${JSON.stringify(delta(basePortrait, nextPortrait))}`);
  if (!stable(baseField, nextField)) failures.push(`${key}: decision field changed after settle ${JSON.stringify(delta(baseField, nextField))}`);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(220);
}

const active = await visual.getAttribute('data-story-active');
if (active) failures.push(`Escape left active state ${active}`);
await context.close();
await browser.close();

if (failures.length) {
  console.error(`[hero-stability] ${failures.length} failure(s)\n${failures.map((x) => `- ${x}`).join('\n')}`);
  process.exit(1);
}
console.log('[hero-stability] Portrait and decision-field geometry remain stable after entrance settles.');
