/**
 * @fileoverview scripts/browser-button-motion-audit.mjs
 * Purpose: Verify that the production preview executes the refined sitewide GSAP button interaction rather than the retired generic hover treatment.
 * Responsibilities:
 * - Confirm canonical routes load the stable production runtime and decorate every eligible shared control family, including final uploaded/agent CTAs.
 * - Assert the primary CTA keeps one semantic label and receives icon, fill, glow, impact, and SplitText character layers.
 * - Exercise hover plus a genuinely held pointer active state and verify release recovery.
 * Execution context: Playwright browser audit against the built Vite preview server in CI or local validation.
 * Connected files:
 * - src/scripts/features/motion/refined-button-motion.js
 * - src/styles/systems/interaction-motion.css
 * - scripts/normalize-html-runtime.cjs
 * - scripts/finalize-refined-button-motion.cjs
 * - .github/workflows/browser-audit.yml
 * Maintenance: Keep assertions behavioral and production-facing; avoid snapshots of transient animation frames when state/property checks are more stable.
 */
import { chromium } from 'playwright';

const base = process.env.AUDIT_BASE_URL || 'http://127.0.0.1:4173';
const routes = ['/', '/projects', '/services', '/about', '/contact', '/blog/'];
const controlSelector = [
  'button',
  '[role="button"]',
  'a.btn',
  'a.btn-primary',
  'a.btn-secondary',
  '.nrs-uploaded-btn',
  '.agent-btn',
  '.footer-email-btn',
  '.floating-resume-btn',
  '.filter-btn',
  '.link-pill',
  '.nav-link',
  '.mobile-nav-links a',
  '.mobile-logo',
].join(',');
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  reducedMotion: 'no-preference',
});
const page = await context.newPage();
const failures = [];

/**
 * Function contract: recordFailure
 * Purpose: Accumulate one actionable motion-audit failure without aborting later route checks.
 * Inputs: `message` - human-readable failure detail.
 * Side effects: Appends to the shared failures array.
 * Returns: Undefined.
 */
function recordFailure(message) {
  failures.push(message);
}

/**
 * Function contract: waitForMotionRuntime
 * Purpose: Wait until the refined runtime has decorated at least one control on the current route.
 * Inputs: None.
 * Side effects: Waits on page runtime state and may throw on timeout.
 * Returns: Promise resolving when GSAP 3.15 and decorated controls are present.
 */
async function waitForMotionRuntime() {
  await page.waitForFunction(
    /** Callback contract: Inspect browser runtime state until GSAP 3.15 and one decorated control are present. Inputs: `selector`. Side effects: Reads page DOM and global GSAP state. Returns: Boolean readiness predicate. */
    (selector) => {
      const control = document.querySelector(selector);
      return Boolean(window.gsap?.version === '3.15.0' && control?.classList.contains('nrs-motion-control'));
    },
    controlSelector,
    { timeout: 15000 },
  );
}

/**
 * Function contract: auditRouteCoverage
 * Purpose: Confirm every eligible shared control on the current route is decorated by the refined runtime and the stable script entry is present.
 * Inputs: `route` - route pathname currently being audited.
 * Side effects: Reads page DOM/runtime state and records failures.
 * Returns: Promise resolving after route coverage checks complete.
 */
async function auditRouteCoverage(route) {
  const result = await page.evaluate(
    /** Callback contract: Collect production runtime and control-decoration evidence from the current browser page. Inputs: `selector`. Side effects: Reads DOM/runtime state. Returns: Route coverage summary object. */
    (selector) => {
      const controls = [...document.querySelectorAll(selector)].filter(
        /** Callback contract: Keep only visible semantic controls eligible for the refined motion system. Inputs: `control`. Side effects: Reads DOM attributes and ancestor state. Returns: Boolean eligibility predicate. */
        (control) => {
          if (!(control instanceof HTMLElement)) return false;
          if (control.matches('[data-motion="off"], [aria-hidden="true"]')) return false;
          if (control.closest('[aria-hidden="true"]')) return false;
          if ('disabled' in control && control.disabled) return false;
          return true;
        },
      );
      const missing = controls
        .filter(
          /** Callback contract: Select eligible controls that were not decorated by the refined runtime. Inputs: `control`. Side effects: Reads dataset state. Returns: Boolean missing-decoration predicate. */
          (control) => control.dataset.nrsMotionDecorated !== 'true',
        )
        .map(
          /** Callback contract: Convert one undecorated control into an actionable selector-like diagnostic string. Inputs: `control`. Side effects: Reads element id/classes. Returns: Diagnostic string. */
          (control) => `${control.tagName.toLowerCase()}${control.id ? `#${control.id}` : ''}.${[...control.classList].join('.')}`,
        );
      const runtimeSrcs = [...document.scripts]
        .map(
          /** Callback contract: Read one script element source for stable-runtime verification. Inputs: `script`. Side effects: Reads DOM attribute state. Returns: Script src value or null. */
          (script) => script.getAttribute('src'),
        )
        .filter(Boolean);
      return {
        total: controls.length,
        decorated: controls.length - missing.length,
        missing,
        runtimeSrcs,
        gsapVersion: window.gsap?.version || null,
      };
    },
    controlSelector,
  );

  if (result.total === 0) recordFailure(`${route}: no eligible shared controls were discovered.`);
  if (result.missing.length) recordFailure(`${route}: undecorated controls: ${result.missing.join(', ')}`);
  if (!result.runtimeSrcs.some(
    /** Callback contract: Determine whether one loaded script uses the required stable production runtime entry. Inputs: `src`. Side effects: None. Returns: Boolean stable-runtime predicate. */
    (src) => src?.startsWith('/script.js?v=36.0'),
  )) {
    recordFailure(`${route}: final HTML is not using the stable /script.js?v=36.0 runtime entry.`);
  }
  if (result.gsapVersion !== '3.15.0') recordFailure(`${route}: expected GSAP 3.15.0, received ${result.gsapVersion || 'none'}.`);
}

/**
 * Function contract: readScaleY
 * Purpose: Read the current computed vertical scale from a control transform matrix.
 * Inputs: `selector` - CSS selector for the target control.
 * Side effects: Reads computed style in the page.
 * Returns: Promise resolving to the current scaleY value.
 */
async function readScaleY(selector) {
  return page.$eval(
    selector,
    /** Callback contract: Read the target element's computed transform matrix and return its vertical scale. Inputs: `element`. Side effects: Reads computed CSS. Returns: Numeric scaleY. */
    (element) => {
      const transform = getComputedStyle(element).transform;
      if (!transform || transform === 'none') return 1;
      return new DOMMatrixReadOnly(transform).m22;
    },
  );
}

for (const route of routes) {
  await page.goto(new URL(route, base).href, { waitUntil: 'domcontentloaded' });
  try {
    await waitForMotionRuntime();
    await auditRouteCoverage(route);
  } catch (error) {
    recordFailure(`${route}: refined motion runtime did not become ready: ${error.message}`);
  }
}

await page.goto(new URL('/', base).href, { waitUntil: 'domcontentloaded' });
try {
  await waitForMotionRuntime();
  const selector = '.nrs-layout-home-hero-actions .nrs-uploaded-btn-primary, .nrs-uploaded-actions .nrs-uploaded-btn-primary, .hero-actions .btn.btn-primary';
  await page.waitForSelector(selector, { state: 'visible' });

  const structure = await page.$eval(
    selector,
    /** Callback contract: Collect the primary CTA's generated refined-motion structure for contract assertions. Inputs: `control`. Side effects: Reads DOM structure/text. Returns: Structure summary object. */
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
    selector,
    /** Callback contract: Prevent one primary CTA navigation so the browser audit can hold and release the control on the same page. Inputs: `control`. Side effects: Registers one click listener. Returns: Undefined. */
    (control) => {
      control.addEventListener('click',
        /** Callback contract: Cancel the audited CTA's single click navigation while preserving pointer state transitions. Inputs: `event`. Side effects: Prevents default navigation. Returns: Undefined. */
        (event) => event.preventDefault(),
        { once: true },
      );
    },
  );
  await page.locator(selector).first().hover();
  await page.waitForTimeout(240);

  const hovered = await page.$eval(
    selector,
    /** Callback contract: Read primary CTA hover state and pointer-origin fill transform after hover settles. Inputs: `control`. Side effects: Reads DOM state/computed CSS. Returns: Hover evidence object. */
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

  const box = await page.locator(selector).first().boundingBox();
  if (!box) {
    recordFailure('primary CTA: could not resolve button bounds for held press audit.');
  } else {
    await page.mouse.move(box.x + box.width * 0.58, box.y + box.height * 0.48);
    await page.mouse.down();
    await page.waitForTimeout(140);
    const pressClass = await page.$eval(
      selector,
      /** Callback contract: Read whether pointerdown entered the refined held active state. Inputs: `control`. Side effects: Reads class state. Returns: Boolean held-state predicate. */
      (control) => control.classList.contains('is-motion-pressed'),
    );
    const pressedScaleY = await readScaleY(selector);
    if (!pressClass) recordFailure('primary CTA: pointerdown did not enter the held active state.');
    if (pressedScaleY >= 0.99) recordFailure(`primary CTA: press compression was not visible (scaleY=${pressedScaleY.toFixed(3)}).`);

    await page.waitForTimeout(280);
    const stillHeld = await page.$eval(
      selector,
      /** Callback contract: Read whether the active state persists while the pointer remains held. Inputs: `control`. Side effects: Reads class state. Returns: Boolean held-state predicate. */
      (control) => control.classList.contains('is-motion-pressed'),
    );
    const heldScaleY = await readScaleY(selector);
    if (!stillHeld) recordFailure('primary CTA: active state auto-released before pointerup.');
    if (heldScaleY >= 0.99) recordFailure(`primary CTA: held compression did not persist (scaleY=${heldScaleY.toFixed(3)}).`);

    await page.mouse.up();
    await page.waitForTimeout(360);
    const released = await page.$eval(
      selector,
      /** Callback contract: Read whether the held active-state marker clears after pointerup. Inputs: `control`. Side effects: Reads class state. Returns: Boolean remaining-state predicate. */
      (control) => control.classList.contains('is-motion-pressed'),
    );
    const releasedScaleY = await readScaleY(selector);
    if (released) recordFailure('primary CTA: active state remained after pointerup.');
    if (releasedScaleY <= 0.99) recordFailure(`primary CTA: release recovery did not settle (scaleY=${releasedScaleY.toFixed(3)}).`);
  }
} catch (error) {
  recordFailure(`primary CTA interaction audit failed: ${error.stack || error.message}`);
}

await context.close();
await browser.close();

if (failures.length) {
  console.error('[button-motion-audit] Refined motion contract failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`[button-motion-audit] Refined GSAP hover/held-active behavior passed across ${routes.length} canonical route families.`);
