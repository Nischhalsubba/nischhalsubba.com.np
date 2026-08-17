/**
 * @fileoverview scripts/browser-hero-ux-audit-v26.mjs
 * Purpose: Validate the production homepage hero after the approved right-side systems portrait replaces the retired interactive story-node composition.
 * Responsibilities:
 * - Confirm the right-side portrait artwork, particle canvas, and cursor surface render without changing the left-side hero contract.
 * - Verify fine-pointer movement activates the cursor response while the particle canvas remains populated.
 * - Verify mobile output stays measurable, overflow-free, and touch-safe without desktop-only cursor UI.
 * - Verify reduced-motion output keeps a static particle field and suppresses animated cursor feedback.
 * Execution context: Playwright regression audit run against the built production preview in CI.
 * Connected files:
 * - scripts/ensure-hero-system-visual-v28.cjs
 * - src/scripts/features/motion/hero-system-field.js
 * - .github/workflows/hero-ux-audit.yml
 * Maintenance: Keep this audit aligned with the final production hero contract rather than retired intermediate hero generators.
 */
import { chromium } from 'playwright';

const base = process.env.AUDIT_BASE_URL || 'http://127.0.0.1:4173';
const failures = [];

/**
 * Function contract: record
 * Purpose: Add one labeled audit failure without preventing the remaining viewport checks from running.
 * Inputs: `label` - audit group; `error` - thrown error or message.
 * Side effects: Appends to the shared failure collection.
 * Returns: Undefined.
 */
function record(label, error) {
  failures.push(`${label}: ${error?.message || error}`);
}

/**
 * Function contract: near
 * Purpose: Compare two measured browser values with a small tolerance for subpixel layout differences.
 * Inputs: `a`, `b` - numbers; `tolerance` - maximum absolute difference.
 * Side effects: None.
 * Returns: Boolean tolerance result.
 */
function near(a, b, tolerance = 1.5) {
  return Math.abs(a - b) <= tolerance;
}

/**
 * Function contract: goto
 * Purpose: Open the production homepage and require a successful network response.
 * Inputs: `page` - Playwright page.
 * Side effects: Navigates the browser page.
 * Returns: Promise resolving after homepage network idle.
 */
async function goto(page) {
  const response = await page.goto(`${base}/`, { waitUntil: 'networkidle', timeout: 30000 });
  if (!response || response.status() >= 400) throw new Error(`HTTP ${response?.status() || 'none'} for /`);
}

/**
 * Function contract: canvasState
 * Purpose: Read stable particle-canvas dimensions plus a compact alpha checksum without transferring the full bitmap to Node.
 * Inputs: `canvas` - Playwright locator for the particle canvas.
 * Side effects: Reads rendered canvas pixels.
 * Returns: Promise resolving to canvas backing dimensions and sampled nontransparent-pixel statistics.
 */
async function canvasState(canvas) {
  return canvas.evaluate(
    /** Callback contract: Sample alpha values across the rendered canvas to prove the field contains drawn particles. Inputs: `element`. Side effects: Reads canvas pixel data. Returns: Compact object with width, height, nonzero sample count, and alpha sum. */
    (element) => {
      const context = element.getContext('2d');
      const width = element.width;
      const height = element.height;
      if (!context || width < 1 || height < 1) return { width, height, nonzero: 0, alpha: 0 };
      const pixels = context.getImageData(0, 0, width, height).data;
      const stride = Math.max(4, Math.floor((width * height) / 18000) * 4);
      let nonzero = 0;
      let alpha = 0;
      for (let index = 3; index < pixels.length; index += stride) {
        if (pixels[index] > 0) nonzero += 1;
        alpha += pixels[index];
      }
      return { width, height, nonzero, alpha };
    },
  );
}

/**
 * Function contract: assertCoreVisual
 * Purpose: Validate the shared structural contract for the final right-side visual in any viewport.
 * Inputs: `page` - Playwright page.
 * Side effects: Reads DOM geometry and computed attributes.
 * Returns: Promise resolving to the visual, artwork, canvas, and cursor locators plus the initial visual bounds.
 */
async function assertCoreVisual(page) {
  const visual = page.locator('[data-hero-system-field]');
  const artwork = visual.locator('.nrs-hero-system-v28__art');
  const canvas = visual.locator('[data-hero-system-particles]');
  const cursor = visual.locator('[data-hero-system-cursor]');

  if (await visual.count() !== 1) throw new Error(`expected one final systems visual, found ${await visual.count()}`);
  if (await page.locator('.nrs-story-node').count() !== 0) throw new Error('retired story nodes are still present in final hero output');
  if (await artwork.count() !== 1 || await canvas.count() !== 1 || await cursor.count() !== 1) {
    throw new Error('artwork, particle canvas, or cursor surface is missing');
  }
  if (await visual.getAttribute('data-hero-system-ready') !== 'true') throw new Error('hero systems browser module did not initialize');

  const visualBox = await visual.boundingBox();
  const artworkBox = await artwork.boundingBox();
  const canvasBox = await canvas.boundingBox();
  if (!visualBox || !artworkBox || !canvasBox) throw new Error('right-side systems visual is not measurable');
  if (visualBox.width < 280 || visualBox.height < 240) throw new Error(`systems visual is unexpectedly small: ${visualBox.width.toFixed(1)}x${visualBox.height.toFixed(1)}px`);
  if (!near(artworkBox.width, visualBox.width, 2) || !near(artworkBox.height, visualBox.height, 2)) throw new Error('approved artwork does not fill the final systems visual');
  if (!near(canvasBox.width, visualBox.width, 2) || !near(canvasBox.height, visualBox.height, 2)) throw new Error('particle canvas does not fill the final systems visual');

  const state = await canvasState(canvas);
  if (state.width < 1 || state.height < 1 || state.nonzero < 3 || state.alpha < 100) {
    throw new Error(`particle field is empty: ${JSON.stringify(state)}`);
  }

  return { visual, artwork, canvas, cursor, visualBox };
}

/**
 * Function contract: desktopAudit
 * Purpose: Validate desktop composition, pointer response, particle rendering, and unchanged left/right hero separation.
 * Inputs: `browser` - Playwright browser.
 * Side effects: Opens a browser context and moves the mouse across the right-side visual.
 * Returns: Promise resolving after the desktop audit completes.
 */
async function desktopAudit(browser) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  try {
    await goto(page);
    await page.waitForTimeout(1400);
    const { visual, canvas, cursor, visualBox } = await assertCoreVisual(page);
    const copy = page.locator('.nrs-uploaded-hero-copy');
    const copyBox = await copy.boundingBox();
    if (!copyBox) throw new Error('left-side hero copy is not measurable');
    if (visualBox.x < copyBox.x + copyBox.width - 8) throw new Error('right-side visual overlaps the existing left-side hero copy');

    const targetX = visualBox.x + visualBox.width * 0.24;
    const targetY = visualBox.y + visualBox.height * 0.30;
    await page.mouse.move(targetX, targetY);
    await page.waitForTimeout(260);

    const cursorOpacity = Number.parseFloat(await cursor.evaluate(
      /** Callback contract: Read the cursor orbit opacity after fine-pointer movement. Inputs: `element`. Side effects: Reads computed style. Returns: Computed opacity string. */
      (element) => getComputedStyle(element).opacity,
    ));
    if (!(cursorOpacity > 0.4)) throw new Error(`fine-pointer cursor response did not appear: opacity=${cursorOpacity}`);

    const after = await canvasState(canvas);
    if (after.nonzero < 3 || after.alpha < 100) throw new Error('particle canvas became empty after pointer interaction');

    await page.mouse.move(4, 4);
    await page.waitForTimeout(300);
    const hiddenOpacity = Number.parseFloat(await cursor.evaluate(
      /** Callback contract: Read the cursor orbit opacity after leaving the hero visual. Inputs: `element`. Side effects: Reads computed style. Returns: Computed opacity string. */
      (element) => getComputedStyle(element).opacity,
    ));
    if (hiddenOpacity > 0.12) throw new Error(`cursor orbit did not settle after pointer leave: opacity=${hiddenOpacity}`);

    const overflow = await page.evaluate(
      /** Callback contract: Measure root horizontal overflow after desktop interaction. Inputs: None. Side effects: Reads document geometry. Returns: Horizontal overflow in CSS pixels. */
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    if (overflow > 1) throw new Error(`desktop hero introduces ${overflow}px horizontal overflow`);
    if (await visual.getAttribute('aria-label') === null) throw new Error('right-side visual lost its accessible label');
  } catch (error) {
    record('desktop hero systems visual', error);
  } finally {
    await context.close();
  }
}

/**
 * Function contract: mobileAudit
 * Purpose: Validate the approved artwork and static particle surface on a touch viewport without horizontal overflow or desktop cursor UI.
 * Inputs: `browser` - Playwright browser.
 * Side effects: Opens a mobile browser context and reads layout/computed styles.
 * Returns: Promise resolving after the mobile audit completes.
 */
async function mobileAudit(browser) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  try {
    await goto(page);
    await page.waitForTimeout(900);
    const { visualBox, cursor } = await assertCoreVisual(page);
    if (visualBox.width < 340) throw new Error(`mobile systems visual is too narrow: ${visualBox.width.toFixed(1)}px`);

    const cursorDisplay = await cursor.evaluate(
      /** Callback contract: Read whether the desktop cursor orbit is suppressed for a coarse/touch viewport. Inputs: `element`. Side effects: Reads computed style. Returns: Computed display value. */
      (element) => getComputedStyle(element).display,
    );
    if (cursorDisplay !== 'none') throw new Error(`touch viewport still exposes desktop cursor orbit: ${cursorDisplay}`);

    const overflow = await page.evaluate(
      /** Callback contract: Measure root horizontal overflow in the mobile viewport. Inputs: None. Side effects: Reads document geometry. Returns: Horizontal overflow in CSS pixels. */
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    if (overflow > 1) throw new Error(`mobile hero introduces ${overflow}px horizontal overflow`);
  } catch (error) {
    record('mobile hero systems visual', error);
  } finally {
    await context.close();
  }
}

/**
 * Function contract: reducedMotionAudit
 * Purpose: Verify reduced-motion users receive a populated but static particle field and no animated cursor orbit.
 * Inputs: `browser` - Playwright browser.
 * Side effects: Opens a reduced-motion browser context and samples the rendered particle canvas twice.
 * Returns: Promise resolving after the reduced-motion audit completes.
 */
async function reducedMotionAudit(browser) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  try {
    await goto(page);
    await page.waitForTimeout(500);
    const { canvas, cursor, visualBox } = await assertCoreVisual(page);
    const before = await canvasState(canvas);
    await page.mouse.move(visualBox.x + visualBox.width * 0.22, visualBox.y + visualBox.height * 0.26);
    await page.waitForTimeout(220);
    const after = await canvasState(canvas);
    if (before.nonzero !== after.nonzero || before.alpha !== after.alpha) {
      throw new Error(`reduced-motion particle field is still animating: before=${JSON.stringify(before)}, after=${JSON.stringify(after)}`);
    }
    const cursorDisplay = await cursor.evaluate(
      /** Callback contract: Read the cursor-orbit display state under reduced motion. Inputs: `element`. Side effects: Reads computed style. Returns: Computed display value. */
      (element) => getComputedStyle(element).display,
    );
    if (cursorDisplay !== 'none') throw new Error(`reduced motion still exposes cursor orbit: ${cursorDisplay}`);
  } catch (error) {
    record('reduced motion hero systems visual', error);
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
  console.error(`[hero-ux-v28-audit] ${failures.length} failure(s)\n${failures.map(
    /** Callback contract: Format one collected audit failure for terminal output. Inputs: `failure`. Side effects: None. Returns: Bullet-formatted failure string. */
    (failure) => `- ${failure}`,
  ).join('\n')}`);
  process.exit(1);
}

console.log('[hero-ux-v28-audit] Right-side artwork, particle field, fine-pointer response, mobile containment, and reduced-motion behavior passed.');
