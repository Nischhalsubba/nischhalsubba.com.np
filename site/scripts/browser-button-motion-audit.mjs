/**
 * @fileoverview scripts/browser-button-motion-audit.mjs
 * Purpose: Verify that the production preview decorates and animates every intended button-like control across desktop and touch input without relying on the runtime's own selector as the test oracle.
 * Responsibilities:
 * - Discover semantic buttons and button-like anchors independently across canonical routes and fail on undecorated controls.
 * - Confirm controls inside initially hidden mobile navigation are decorated before the drawer opens.
 * - Exercise primary CTA hover, genuinely held pointer press, release recovery, and generated motion structure on desktop.
 * - Exercise coarse/touch held feedback so a fine-hover media query cannot silently disable the runtime.
 * Execution context: Playwright browser audit against the built Vite preview server in CI or local validation.
 * Connected files:
 * - src/scripts/features/motion/refined-button-motion.js
 * - src/styles/systems/interaction-motion.css
 * - scripts/finalize-refined-button-motion.cjs
 * - .github/workflows/browser-audit.yml
 * Maintenance: Keep discovery intentionally independent from runtime implementation details so new button families cannot pass merely by being absent from both selector lists.
 */
import { chromium } from 'playwright';

const base = process.env.AUDIT_BASE_URL || 'http://127.0.0.1:4173';
const routes = ['/', '/projects', '/services', '/about', '/contact', '/blog/'];
const primarySelector = '.nrs-layout-home-hero-actions .nrs-uploaded-btn-primary, .nrs-uploaded-actions .nrs-uploaded-btn-primary, .hero-actions .btn.btn-primary';
const failures = [];

/**
 * Function contract: recordFailure
 * Purpose: Accumulate one actionable motion-audit failure without aborting later route/input checks.
 * Inputs: `message` - human-readable failure detail.
 * Side effects: Appends to the shared failures array.
 * Returns: Undefined.
 */
function recordFailure(message) {
  failures.push(message);
}

/**
 * Function contract: waitForMotionRuntime
 * Purpose: Wait until GSAP and at least one decorated control are active on the current page.
 * Inputs: `page` - Playwright Page instance.
 * Side effects: Waits on browser runtime state and may throw on timeout.
 * Returns: Promise resolving when the motion runtime is ready.
 */
async function waitForMotionRuntime(page) {
  await page.waitForFunction(
    /** Callback contract: Inspect browser runtime state until GSAP 3.15 and one decorated control are present. Inputs: None. Side effects: Reads page DOM/global runtime state. Returns: Boolean readiness predicate. */
    () => Boolean(window.gsap?.version === '3.15.0' && document.querySelector('.nrs-motion-control[data-nrs-motion-decorated="true"]')),
    { timeout: 15000 },
  );
}

/**
 * Function contract: auditRouteCoverage
 * Purpose: Independently discover intended controls on one route and confirm each is decorated by the motion runtime.
 * Inputs: `page` - Playwright Page; `route` - route pathname being audited.
 * Side effects: Reads browser DOM/runtime state and records failures.
 * Returns: Promise resolving after route coverage checks complete.
 */
async function auditRouteCoverage(page, route) {
  const result = await page.evaluate(
    /**
     * Callback contract: Discover intended button-like controls without reusing the runtime selector and collect decoration/runtime evidence.
     * Inputs: None.
     * Side effects: Reads DOM attributes/classes, visibility-independent navigation markup, loaded scripts, and GSAP state.
     * Returns: Coverage summary containing totals, missing diagnostics, hidden-nav failures, script sources, and GSAP version.
     */
    () => {
      const explicitAnchorSelector = [
        '.resume-btn',
        '.cta-button',
        '.cta-link',
        '.footer-cta',
        '.link-pill',
        '.download-resume',
        '.project-filter',
        '.filter-btn',
        '.nrs-uploaded-btn',
        '.agent-btn',
        '.footer-email-btn',
        '.floating-resume-btn',
        '.nav-link',
        '.quick-nav-list a',
        '.bottom-nav a',
        '.footer-nav a',
        '.social-link',
        '.mobile-nav-links a',
        '.mobile-logo',
        '.agent-mobile-brand',
      ].join(',');
      const buttonish = /(?:^|[-_])(btn|button|cta)(?:[-_]|$)/i;
      const candidates = [...document.querySelectorAll('button, [role="button"], a[href]')];
      const controls = [];

      for (const control of candidates) {
        if (!(control instanceof HTMLElement)) continue;
        if (control.matches('[data-motion="off"], [aria-hidden="true"], [aria-disabled="true"]')) continue;
        if ('disabled' in control && control.disabled) continue;

        const semanticButton = control.matches('button, [role="button"], [data-motion-control]');
        const explicitAnchor = control instanceof HTMLAnchorElement && control.matches(explicitAnchorSelector);
        let namedLikeButton = false;
        if (control instanceof HTMLAnchorElement) {
          for (const token of control.classList) {
            if (buttonish.test(token)) {
              namedLikeButton = true;
              break;
            }
          }
        }
        if (semanticButton || explicitAnchor || namedLikeButton) controls.push(control);
      }

      const missing = [];
      for (const control of controls) {
        if (control.dataset.nrsMotionDecorated === 'true') continue;
        missing.push(`${control.tagName.toLowerCase()}${control.id ? `#${control.id}` : ''}.${[...control.classList].join('.')}`);
      }

      const hiddenNavMissing = [];
      for (const control of document.querySelectorAll('.mobile-nav-links a')) {
        if (control.dataset.nrsMotionDecorated !== 'true') hiddenNavMissing.push(control.textContent?.trim() || control.getAttribute('href') || 'mobile-nav-link');
      }

      const runtimeSrcs = [];
      for (const script of document.scripts) {
        const src = script.getAttribute('src');
        if (src) runtimeSrcs.push(src);
      }

      return {
        total: controls.length,
        decorated: controls.length - missing.length,
        missing,
        hiddenNavMissing,
        runtimeSrcs,
        gsapVersion: window.gsap?.version || null,
      };
    },
  );

  if (result.total === 0) recordFailure(`${route}: no eligible button-like controls were independently discovered.`);
  if (result.missing.length) recordFailure(`${route}: undecorated controls: ${result.missing.join(', ')}`);
  if (result.hiddenNavMissing.length) recordFailure(`${route}: initially hidden mobile navigation controls were not pre-decorated: ${result.hiddenNavMissing.join(', ')}`);
  if (!result.runtimeSrcs.some((src) => src?.startsWith('/script.js?v=36.0'))) {
    recordFailure(`${route}: final HTML is not using the stable /script.js?v=36.0 runtime entry.`);
  }
  if (result.gsapVersion !== '3.15.0') recordFailure(`${route}: expected GSAP 3.15.0, received ${result.gsapVersion || 'none'}.`);
}

/**
 * Function contract: readScaleY
 * Purpose: Read the current vertical scale from a control's computed transform matrix.
 * Inputs: `page` - Playwright Page; `selector` - CSS selector for the target control.
 * Side effects: Reads computed style in the browser page.
 * Returns: Promise resolving to numeric scaleY.
 */
async function readScaleY(page, selector) {
  return page.$eval(
    selector,
    /** Callback contract: Read one element's computed transform matrix and return vertical scale. Inputs: `element`. Side effects: Reads computed CSS. Returns: Numeric scaleY. */
    (element) => {
      const transform = getComputedStyle(element).transform;
      if (!transform || transform === 'none') return 1;
      return new DOMMatrixReadOnly(transform).m22;
    },
  );
}

/**
 * Function contract: auditPrimaryDesktopInteraction
 * Purpose: Verify the flagship primary CTA retains correct structure and expressive hover/held/release behavior on desktop input.
 * Inputs: `page` - desktop Playwright Page.
 * Side effects: Navigates, dispatches pointer input, reads generated DOM/CSS state, and records failures.
 * Returns: Promise resolving after desktop interaction checks complete.
 */
async function auditPrimaryDesktopInteraction(page) {
  await page.goto(new URL('/', base).href, { waitUntil: 'domcontentloaded' });
  await waitForMotionRuntime(page);
  await page.waitForSelector(primarySelector, { state: 'visible' });

  const structure = await page.$eval(
    primarySelector,
    /** Callback contract: Collect generated primary-CTA motion structure for contract assertions. Inputs: `control`. Side effects: Reads DOM structure/text. Returns: Structure summary. */
    (control) => ({
      labelCount: control.querySelectorAll('.nrs-motion-label').length,
      alternateLabelCount: control.querySelectorAll('.nrs-motion-label--alt').length,
      iconCount: control.querySelectorAll('.nrs-motion-icon').length,
      fillCount: control.querySelectorAll(':scope > .nrs-motion-fill').length,
      glowCount: control.querySelectorAll(':scope > .nrs-motion-glow').length,
      impactCount: control.querySelectorAll(':scope > .nrs-motion-impact').length,
      charCount: control.querySelectorAll('[class^="nrs-motion-char"]').length,
      visibleText: control.innerText.replace(/\s+/g, ' ').trim(),
    }),
  );

  if (structure.labelCount !== 1) recordFailure(`primary CTA: expected one real motion label, found ${structure.labelCount}.`);
  if (structure.alternateLabelCount !== 0) recordFailure(`primary CTA: retired alternate-label reel is still present (${structure.alternateLabelCount}).`);
  if (structure.iconCount !== 1) recordFailure(`primary CTA: expected one authored arrow motion icon, found ${structure.iconCount}.`);
  if (structure.fillCount !== 1 || structure.glowCount !== 1 || structure.impactCount !== 1) {
    recordFailure(`primary CTA: expected one fill/glow/impact layer, got ${structure.fillCount}/${structure.glowCount}/${structure.impactCount}.`);
  }
  if (structure.charCount < 2) recordFailure(`primary CTA: SplitText character layer did not initialize (${structure.charCount} chars).`);
  if (!/View selected work/i.test(structure.visibleText)) recordFailure(`primary CTA: authored label changed unexpectedly to "${structure.visibleText}".`);

  await page.$eval(
    primarySelector,
    /** Callback contract: Prevent one audited CTA click from navigating away during held-state checks. Inputs: `control`. Side effects: Registers a one-time click prevention listener. Returns: Undefined. */
    (control) => control.addEventListener('click', (event) => event.preventDefault(), { once: true }),
  );
  await page.locator(primarySelector).first().hover();
  await page.waitForTimeout(240);

  const hovered = await page.$eval(
    primarySelector,
    /** Callback contract: Read hover class, fill transform/position, and clipping state after hover settles. Inputs: `control`. Side effects: Reads DOM/computed CSS. Returns: Hover evidence object. */
    (control) => ({
      hovered: control.classList.contains('is-motion-hovered'),
      fillTransform: getComputedStyle(control.querySelector('.nrs-motion-fill')).transform,
      fillPosition: getComputedStyle(control.querySelector('.nrs-motion-fill')).position,
      overflow: getComputedStyle(control).overflow,
    }),
  );
  if (!hovered.hovered) recordFailure('primary CTA: hover state class was not applied.');
  if (!hovered.fillTransform || hovered.fillTransform === 'none') recordFailure('primary CTA: pointer-origin fill did not transform on hover.');
  if (hovered.fillPosition !== 'absolute') recordFailure(`primary CTA: generated fill was overridden to position=${hovered.fillPosition}.`);
  if (hovered.overflow !== 'hidden') recordFailure(`primary CTA: radial fill is not clipped by the button (overflow=${hovered.overflow}).`);

  const box = await page.locator(primarySelector).first().boundingBox();
  if (!box) {
    recordFailure('primary CTA: could not resolve button bounds for held press audit.');
    return;
  }

  await page.mouse.move(box.x + box.width * 0.58, box.y + box.height * 0.48);
  await page.mouse.down();
  await page.waitForTimeout(140);
  const pressClass = await page.$eval(primarySelector, (control) => control.classList.contains('is-motion-pressed'));
  const pressedScaleY = await readScaleY(page, primarySelector);
  if (!pressClass) recordFailure('primary CTA: pointerdown did not enter the held active state.');
  if (pressedScaleY >= 0.99) recordFailure(`primary CTA: press compression was not visible (scaleY=${pressedScaleY.toFixed(3)}).`);

  await page.waitForTimeout(280);
  const stillHeld = await page.$eval(primarySelector, (control) => control.classList.contains('is-motion-pressed'));
  const heldScaleY = await readScaleY(page, primarySelector);
  if (!stillHeld) recordFailure('primary CTA: active state auto-released before pointerup.');
  if (heldScaleY >= 0.99) recordFailure(`primary CTA: held compression did not persist (scaleY=${heldScaleY.toFixed(3)}).`);

  await page.mouse.up();
  await page.waitForTimeout(360);
  const released = await page.$eval(primarySelector, (control) => control.classList.contains('is-motion-pressed'));
  const releasedScaleY = await readScaleY(page, primarySelector);
  if (released) recordFailure('primary CTA: active state remained after pointerup.');
  if (releasedScaleY <= 0.99) recordFailure(`primary CTA: release recovery did not settle (scaleY=${releasedScaleY.toFixed(3)}).`);
}

/**
 * Function contract: auditTouchInteraction
 * Purpose: Verify coarse/touch input receives decorated controls and held active feedback even when no hover media query matches.
 * Inputs: `browser` - Playwright Browser instance.
 * Side effects: Creates a touch browser context, navigates, dispatches pointer events, reads state, and closes the context.
 * Returns: Promise resolving after touch checks complete.
 */
async function auditTouchInteraction(browser) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    reducedMotion: 'no-preference',
  });
  const page = await context.newPage();

  try {
    await page.goto(new URL('/', base).href, { waitUntil: 'domcontentloaded' });
    await waitForMotionRuntime(page);
    await page.waitForSelector(primarySelector, { state: 'attached' });

    const hiddenNavMissing = await page.$$eval(
      '.mobile-nav-links a',
      /** Callback contract: Return initially hidden mobile-nav labels that were not decorated before drawer activation. Inputs: `controls`. Side effects: Reads dataset/text state. Returns: Array of missing labels. */
      (controls) => controls.filter((control) => control.dataset.nrsMotionDecorated !== 'true').map((control) => control.textContent?.trim() || 'mobile-nav-link'),
    );
    if (hiddenNavMissing.length) recordFailure(`touch: mobile navigation controls were skipped while initially hidden: ${hiddenNavMissing.join(', ')}`);

    const box = await page.locator(primarySelector).first().boundingBox();
    if (!box) {
      recordFailure('touch: could not resolve primary CTA bounds.');
      return;
    }

    const eventInit = {
      pointerId: 41,
      pointerType: 'touch',
      isPrimary: true,
      button: 0,
      buttons: 1,
      clientX: box.x + box.width * 0.5,
      clientY: box.y + box.height * 0.5,
    };
    await page.locator(primarySelector).first().dispatchEvent('pointerdown', eventInit);
    await page.waitForTimeout(140);
    const pressed = await page.$eval(primarySelector, (control) => control.classList.contains('is-motion-pressed'));
    const pressedScaleY = await readScaleY(page, primarySelector);
    if (!pressed) recordFailure('touch: pointerdown did not enter held active state on a coarse pointer context.');
    if (pressedScaleY >= 0.99) recordFailure(`touch: held compression was not visible (scaleY=${pressedScaleY.toFixed(3)}).`);

    await page.locator(primarySelector).first().dispatchEvent('pointerup', { ...eventInit, buttons: 0 });
    await page.waitForTimeout(360);
    const released = await page.$eval(primarySelector, (control) => control.classList.contains('is-motion-pressed'));
    if (released) recordFailure('touch: held active state remained after pointerup.');
  } finally {
    await context.close();
  }
}

const browser = await chromium.launch({ headless: true });
const desktopContext = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  reducedMotion: 'no-preference',
});
const desktopPage = await desktopContext.newPage();

for (const route of routes) {
  try {
    await desktopPage.goto(new URL(route, base).href, { waitUntil: 'domcontentloaded' });
    await waitForMotionRuntime(desktopPage);
    await auditRouteCoverage(desktopPage, route);
  } catch (error) {
    recordFailure(`${route}: refined motion runtime audit failed: ${error.stack || error.message}`);
  }
}

try {
  await auditPrimaryDesktopInteraction(desktopPage);
} catch (error) {
  recordFailure(`primary CTA desktop interaction audit failed: ${error.stack || error.message}`);
}

try {
  await auditTouchInteraction(browser);
} catch (error) {
  recordFailure(`touch interaction audit failed: ${error.stack || error.message}`);
}

await desktopContext.close();
await browser.close();

if (failures.length) {
  console.error('[button-motion-audit] Sitewide motion contract failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`[button-motion-audit] Sitewide GSAP hover/held-active behavior passed across ${routes.length} canonical route families plus coarse touch input.`);
