import { chromium } from 'playwright';

/**
 * @fileoverview scripts/repository/debug-project-hover.mjs
 * Purpose: Diagnose the single failing homepage project-row hover interaction using the exact timing/context of the Interface polish audit and a settled network-idle comparison.
 * Responsibilities:
 * - Compare `DOMContentLoaded + 450ms` against a settled `networkidle` load at the audit viewport.
 * - Report hover/pointer media capabilities, body/row classes, bounding boxes, and computed row/title colors.
 * - Report whether the row still matches `:hover` immediately after Playwright hover and after the audit's 220ms observation delay.
 * - Inspect CSSOM hover rules and their enclosing media-query match state.
 * Execution context: Node.js + Playwright inside a temporary PR-only GitHub Actions workflow.
 * Connected files:
 * - scripts/browser-interface-polish-audit.mjs
 * - scripts/ensure-interface-polish.cjs
 * - src/styles/fragments/agent/portfolio-components.cssfrag
 * Maintenance: Temporary diagnostic only; remove after the hover regression is identified.
 */

const baseUrl = process.env.AUDIT_BASE_URL || 'http://127.0.0.1:4173';

/**
 * Function contract: collectMatchingRules
 * Purpose: Recursively inspect same-origin CSSOM rules and return project-row hover rules with enclosing media-query text and match state.
 * Inputs: `page`, Playwright page containing the built homepage.
 * Side effects: Reads CSSOM/media-query state only.
 * Returns: Promise resolving to diagnostic records for matching hover rules.
 */
async function collectMatchingRules(page) {
  return page.evaluate(() => {
    const results = [];

    /** Callback contract: Recursively visit CSS rules, carrying the nearest enclosing media-query condition so matching hover rules report whether they are active. Inputs: `rules`, `mediaText`. Side effects: appends diagnostic records to `results`. Returns: undefined; traversal is side-effect-only. */
    function visitRules(rules, mediaText = '') {
      for (const rule of Array.from(rules || [])) {
        if (rule.type === CSSRule.MEDIA_RULE) {
          visitRules(rule.cssRules, rule.conditionText || rule.media?.mediaText || '');
          continue;
        }
        const text = rule.cssText || '';
        if (!text.includes('.agent-project-row:hover')) continue;
        results.push({
          cssText: text,
          mediaText,
          mediaMatches: mediaText ? window.matchMedia(mediaText).matches : true,
        });
      }
    }

    for (const sheet of Array.from(document.styleSheets)) {
      try {
        visitRules(sheet.cssRules);
      } catch {
        // Cross-origin stylesheets are irrelevant to the local production stylesheet diagnostic.
      }
    }
    return results;
  });
}

/**
 * Function contract: snapshot
 * Purpose: Capture the exact project-row state needed to explain hover readiness, pointer retention, movement, and cascade results.
 * Inputs: `page`, Playwright page containing the homepage.
 * Side effects: Reads DOM/computed-style/media-query state only.
 * Returns: Promise resolving to a serializable hover-state snapshot.
 */
async function snapshot(page) {
  return page.evaluate(() => {
    const element = document.querySelector('.agent-project-row');
    const heading = element?.querySelector('.agent-project-copy h3');
    const rect = element?.getBoundingClientRect();
    return {
      bodyClass: document.body.className,
      rowClass: element?.className || '',
      rowMatchesHover: Boolean(element?.matches(':hover')),
      hoverHover: window.matchMedia('(hover: hover)').matches,
      pointerFine: window.matchMedia('(pointer: fine)').matches,
      combinedHoverPointer: window.matchMedia('(hover: hover) and (pointer: fine)').matches,
      background: element ? getComputedStyle(element).backgroundColor : null,
      titleColor: heading ? getComputedStyle(heading).color : null,
      rect: rect ? { x: rect.x, y: rect.y, width: rect.width, height: rect.height } : null,
    };
  });
}

/**
 * Function contract: runScenario
 * Purpose: Execute one load/readiness strategy, hover the first project row, and capture state before, immediately after, and 220ms after hover.
 * Inputs: `browser`, Playwright browser; `name`, scenario label; `waitUntil`, page navigation readiness mode; `settleMs`, additional delay after navigation.
 * Side effects: Opens/closes one browser context/page and moves the virtual pointer over the project row.
 * Returns: Promise resolving to structured scenario diagnostics.
 */
async function runScenario(browser, name, waitUntil, settleMs) {
  const context = await browser.newContext({ reducedMotion: 'no-preference' });
  const page = await context.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${baseUrl}/`, { waitUntil, timeout: 30000 });
  if (settleMs) await page.waitForTimeout(settleMs);

  const row = page.locator('.agent-project-row').first();
  await row.scrollIntoViewIfNeeded();
  const before = await snapshot(page);
  await row.hover();
  const immediatelyAfterHover = await snapshot(page);
  await page.waitForTimeout(220);
  const after220ms = await snapshot(page);
  const cssRules = await collectMatchingRules(page);

  await context.close();
  return { name, before, immediatelyAfterHover, after220ms, cssRules };
}

/**
 * Function contract: main
 * Purpose: Run audit-timing and settled-load hover scenarios side by side and print one JSON payload for direct CI comparison.
 * Inputs: None; uses `AUDIT_BASE_URL` or the local preview URL.
 * Side effects: Launches headless Chromium, opens pages, performs hover interactions, and prints diagnostics.
 * Returns: Promise resolving after Chromium closes; failures propagate to the top-level error handler.
 */
async function main() {
  const browser = await chromium.launch({ headless: true });
  try {
    const auditTiming = await runScenario(browser, 'domcontentloaded+450ms', 'domcontentloaded', 450);
    const settled = await runScenario(browser, 'networkidle', 'networkidle', 0);
    console.log('[project-hover-debug] ' + JSON.stringify({ auditTiming, settled }, null, 2));
  } finally {
    await browser.close();
  }
}

main().catch(/** Callback contract: Report a diagnostic runner failure and mark the temporary workflow unsuccessful when Chromium/page inspection itself cannot complete. Inputs: `error`. Side effects: writes the error to stderr and sets process failure state. Returns: undefined; callback is side-effect-only. */ (error) => {
  console.error(error);
  process.exitCode = 1;
});
