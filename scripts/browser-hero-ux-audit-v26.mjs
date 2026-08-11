/**
 * @fileoverview scripts/browser-hero-ux-audit-v26.mjs
 * Purpose: Node-based build, content transformation, QA, or maintenance tool for browser hero ux audit v26.
 * Responsibilities:
 * - Own the behavior/content implied by this file's single responsibility.
 * - Keep public routes, build contracts, and imported module boundaries stable unless the connected owners are updated together.
 * Execution context: Node.js CLI during local development, CI, build, or maintenance.
 * Connected files:
 * - .github/workflows/hero-ux-audit.yml
 * - docs/repository/file-catalog.md
 * - package.json
 * - scripts/build-dist.cjs
 * Maintenance: Update this header when responsibility or dependencies change; generated/vendor files are documented at their source instead.
 */
import { chromium } from 'playwright';

const base = process.env.AUDIT_BASE_URL || 'http://127.0.0.1:4173';
const failures = [];

/**
 * Function contract: record
 * Purpose: Implements the record responsibility for this module.
 * Inputs: label, error.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: no explicit value unless an invoked dependency throws/rejects.
 */
function record(label, error) {
  failures.push(`${label}: ${error?.message || error}`);
}

/**
 * Function contract: near
 * Purpose: Implements the near responsibility for this module.
 * Inputs: a, b, tolerance.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function near(a, b, tolerance = 1.5) {
  return Math.abs(a - b) <= tolerance;
}

/**
 * Function contract: overlaps
 * Purpose: Implements the overlaps responsibility for this module.
 * Inputs: a, b.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function overlaps(a, b) {
  return Boolean(a && b && a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y);
}

/**
 * Function contract: goto
 * Purpose: Implements the goto responsibility for this module.
 * Inputs: page.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: no explicit value unless an invoked dependency throws/rejects.
 */
async function goto(page) {
  const response = await page.goto(`${base}/`, { waitUntil: 'networkidle', timeout: 30000 });
  if (!response || response.status() >= 400) throw new Error(`HTTP ${response?.status() || 'none'} for /`);
}

/**
 * Function contract: desktopAudit
 * Purpose: Implements the desktop audit responsibility for this module.
 * Inputs: browser.
 * Side effects: may read or update browser DOM/state.
 * Returns: no explicit value unless an invoked dependency throws/rejects.
 */
async function desktopAudit(browser) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  try {
    await goto(page);
    await page.waitForTimeout(1800);

    const visual = page.locator('.nrs-uploaded-visual');
    const portrait = page.locator('.nrs-original-portrait:not(.nrs-original-portrait-ghost)');
    const field = page.locator('.nrs-decision-field');
    const readout = page.locator('#nrsStoryReadout');
    const choice = page.locator('.nrs-story-node[data-story="choice"]');
    const problem = page.locator('.nrs-story-node[data-story="problem"]');
    const signal = page.locator('.nrs-story-node[data-story="signal"]');

    if (await page.locator('.nrs-story-node').count() !== 5) throw new Error('expected five story nodes');

    const basePortrait = await portrait.boundingBox();
    const baseField = await field.boundingBox();
    if (!basePortrait || !baseField) throw new Error('portrait or decision field is not measurable');

    await problem.hover();
    await page.waitForTimeout(360);
    if (await visual.getAttribute('data-story-active') !== 'problem') throw new Error('Problem hover did not activate');
    if (await readout.getAttribute('aria-hidden') !== 'false') throw new Error('Problem hover did not reveal readout');

    const pointerEvents = await readout.evaluate(/** Callback contract: Processes the callback step for readout without leaking orchestration details to the caller. Inputs: el. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (el) => getComputedStyle(el).pointerEvents);
    if (pointerEvents !== 'none') throw new Error(`readout intercepts pointer events: ${pointerEvents}`);

    const readoutBox = await readout.boundingBox();
    const choiceBox = await choice.boundingBox();
    if (overlaps(readoutBox, choiceBox)) throw new Error('readout visually overlaps the Choice hit target');

    await choice.hover({ timeout: 2500 });
    await page.waitForTimeout(360);
    if (await visual.getAttribute('data-story-active') !== 'choice') throw new Error('Choice cannot be reached directly after another active story state');

    await problem.hover();
    await page.waitForTimeout(360);
    const problemPixels = Number.parseFloat(await page.locator('.nrs-field-pixels').evaluate(/** Callback contract: Processes the callback step for page.locator('.nrs field pixels') without leaking orchestration details to the caller. Inputs: el. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (el) => getComputedStyle(el).opacity));
    await signal.hover({ timeout: 2500 });
    await page.waitForTimeout(420);
    const signalPixels = Number.parseFloat(await page.locator('.nrs-field-pixels').evaluate(/** Callback contract: Processes the callback step for page.locator('.nrs field pixels') without leaking orchestration details to the caller. Inputs: el. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (el) => getComputedStyle(el).opacity));
    if (!(Number.isFinite(problemPixels) && Number.isFinite(signalPixels) && signalPixels < problemPixels * 0.35)) {
      throw new Error(`Signal reduction is too weak: problem=${problemPixels}, signal=${signalPixels}`);
    }

    const afterPortrait = await portrait.boundingBox();
    const afterField = await field.boundingBox();
    if (!afterPortrait || !afterField) throw new Error('hero geometry disappeared after interaction');
    const portraitValues = [afterPortrait.x, afterPortrait.y, afterPortrait.width, afterPortrait.height];
    const portraitBase = [basePortrait.x, basePortrait.y, basePortrait.width, basePortrait.height];
    const fieldValues = [afterField.x, afterField.y, afterField.width, afterField.height];
    const fieldBase = [baseField.x, baseField.y, baseField.width, baseField.height];
    if (!portraitValues.every(/** Callback contract: Processes the callback step for portrait values without leaking orchestration details to the caller. Inputs: value, index. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (value, index) => near(value, portraitBase[index]))) throw new Error('settled portrait moves or scales during story interaction');
    if (!fieldValues.every(/** Callback contract: Processes the callback step for field values without leaking orchestration details to the caller. Inputs: value, index. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (value, index) => near(value, fieldBase[index]))) throw new Error('settled decision field moves or scales during story interaction');

    const overflow = await page.evaluate(/** Callback contract: Processes the callback step for page without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: may read or update browser DOM/state. No explicit return contract. */ () => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (overflow > 1) throw new Error(`desktop hero introduces ${overflow}px horizontal overflow`);
  } catch (error) {
    record('desktop hero interaction', error);
  } finally {
    await context.close();
  }
}

/**
 * Function contract: mobileAudit
 * Purpose: Implements the mobile audit responsibility for this module.
 * Inputs: browser.
 * Side effects: may read or update browser DOM/state.
 * Returns: no explicit value unless an invoked dependency throws/rejects.
 */
async function mobileAudit(browser) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  try {
    await goto(page);
    await page.waitForTimeout(900);

    const nodes = page.locator('.nrs-story-node:visible');
    if (await nodes.count() !== 5) throw new Error(`expected five visible mobile story nodes, found ${await nodes.count()}`);
    for (let index = 0; index < await nodes.count(); index += 1) {
      const node = nodes.nth(index);
      const box = await node.boundingBox();
      const key = await node.getAttribute('data-story');
      if (!box) throw new Error(`${key} target is not measurable`);
      if (box.width < 44 || box.height < 44) throw new Error(`${key} target is ${box.width.toFixed(1)}x${box.height.toFixed(1)}px`);
    }

    const thesisSize = Number.parseFloat(await page.locator('.nrs-uploaded-thesis').evaluate(/** Callback contract: Processes the callback step for page.locator('.nrs uploaded thesis') without leaking orchestration details to the caller. Inputs: el. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (el) => getComputedStyle(el).fontSize));
    if (thesisSize < 11) throw new Error(`hero thesis is only ${thesisSize}px`);

    const overflow = await page.evaluate(/** Callback contract: Processes the callback step for page without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: may read or update browser DOM/state. No explicit return contract. */ () => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (overflow > 1) throw new Error(`mobile hero introduces ${overflow}px horizontal overflow`);

    const problem = page.locator('.nrs-story-node[data-story="problem"]');
    await problem.tap();
    await page.waitForTimeout(120);
    const visual = page.locator('.nrs-uploaded-visual');
    if (await visual.getAttribute('data-story-active') !== 'problem') throw new Error('mobile tap does not activate Problem');
    if (await visual.getAttribute('data-story-pinned') !== 'true') throw new Error('mobile tap does not pin the story state');
    if (await page.locator('#nrsStoryReadout').getAttribute('aria-hidden') !== 'false') throw new Error('mobile tap does not reveal the readout');
  } catch (error) {
    record('mobile touch and readability', error);
  } finally {
    await context.close();
  }
}

/**
 * Function contract: reducedMotionAudit
 * Purpose: Implements the reduced motion audit responsibility for this module.
 * Inputs: browser.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: no explicit value unless an invoked dependency throws/rejects.
 */
async function reducedMotionAudit(browser) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  try {
    await goto(page);
    const state = page.locator('.nrs-story-node[data-story="state"]');
    await state.hover();
    await page.waitForTimeout(80);
    const visual = page.locator('.nrs-uploaded-visual');
    if (await visual.getAttribute('data-story-active') !== 'state') throw new Error('reduced motion removes story state feedback');
    if (await page.locator('#nrsStoryReadout').getAttribute('aria-hidden') !== 'false') throw new Error('reduced motion hides the story readout');
    const transitions = await page.locator('#nrsStoryReadout').evaluate(/** Callback contract: Processes the callback step for page.locator('#nrs story readout') without leaking orchestration details to the caller. Inputs: el. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (el) => getComputedStyle(el).transitionDuration);
    if (transitions.split(',').some(/** Callback contract: Processes the callback step for transitions.split(',') without leaking orchestration details to the caller. Inputs: value. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (value) => Number.parseFloat(value) > 0.05)) throw new Error(`readout still has long transitions under reduced motion: ${transitions}`);
  } catch (error) {
    record('reduced motion', error);
  } finally {
    await context.close();
  }
}

const browser = await chromium.launch({ headless: true });
await desktopAudit(browser);
await mobileAudit(browser);
await reducedMotionAudit(browser);
await browser.close();

if (failures.length) {
  console.error(`[hero-ux-v26-audit] ${failures.length} failure(s)\n${failures.map(/** Callback contract: Processes the callback step for failures without leaking orchestration details to the caller. Inputs: failure. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (failure) => `- ${failure}`).join('\n')}`);
  process.exit(1);
}

console.log('[hero-ux-v26-audit] Sequential hover, readout collision, settled geometry, Signal reduction, mobile targets/readability, overflow and reduced motion passed.');
