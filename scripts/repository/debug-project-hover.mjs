import { chromium } from 'playwright';

/**
 * @fileoverview scripts/repository/debug-project-hover.mjs
 * Purpose: Diagnose the single failing homepage project-row hover interaction without changing production behavior.
 * Responsibilities:
 * - Open the locally built homepage in the same Chromium family used by browser audits.
 * - Report hover/pointer media capabilities, body/row classes, and computed project-row/title colors before and after Playwright hover.
 * - Inspect loaded CSSOM rules for project-row hover selectors and report whether their enclosing media query currently matches.
 * - Exit successfully after printing diagnostics so the temporary workflow always preserves the evidence needed for analysis.
 * Execution context: Node.js + Playwright inside a temporary PR-only GitHub Actions workflow after the production build and preview server are running.
 * Connected files:
 * - scripts/browser-interface-polish-audit.mjs
 * - scripts/ensure-interface-polish.cjs
 * - src/styles/fragments/agent/portfolio-components.cssfrag
 * Maintenance: Temporary diagnostic only; remove this file after the hover regression is identified.
 */

const baseUrl = process.env.AUDIT_BASE_URL || 'http://127.0.0.1:4173';

/**
 * Function contract: collectMatchingRules
 * Purpose: Recursively inspect same-origin CSSOM rules and return the rules that mention project-row hover, including enclosing media-query text and match state.
 * Inputs: None; executes inside the loaded browser page and reads `document.styleSheets`.
 * Side effects: Reads CSSOM/media-query state only; does not mutate page styling.
 * Returns: Array of diagnostic objects containing selector/css text, media query text, and whether the media query matches.
 */
async function collectMatchingRules(page) {
  return page.evaluate(() => {
    const results = [];

    /**
     * Callback contract: Recursively visit CSS rules, carrying the nearest enclosing media-query condition so matching hover rules can report whether they are active. Inputs: `rules`, `mediaText`. Side effects: appends diagnostic records to the local `results` array. Returns: undefined; traversal is side-effect-only.
     */
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
 * Function contract: main
 * Purpose: Run the focused hover diagnostic and print one structured JSON payload that can be read directly from GitHub Actions logs.
 * Inputs: None; uses `AUDIT_BASE_URL` or the local preview URL.
 * Side effects: Launches headless Chromium, loads the homepage, moves the virtual pointer over one project row, and prints diagnostics to stdout.
 * Returns: Promise resolving after Chromium closes; runtime failures set a non-zero process exit code.
 */
async function main() {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    await page.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });

    const row = page.locator('.agent-project-row').first();
    const title = row.locator('.agent-project-copy h3').first();
    await row.scrollIntoViewIfNeeded();

    const before = await page.evaluate(() => {
      const element = document.querySelector('.agent-project-row');
      const heading = element?.querySelector('.agent-project-copy h3');
      return {
        bodyClass: document.body.className,
        rowClass: element?.className || '',
        rowMatchesHover: Boolean(element?.matches(':hover')),
        hoverHover: window.matchMedia('(hover: hover)').matches,
        pointerFine: window.matchMedia('(pointer: fine)').matches,
        combinedHoverPointer: window.matchMedia('(hover: hover) and (pointer: fine)').matches,
        background: element ? getComputedStyle(element).backgroundColor : null,
        titleColor: heading ? getComputedStyle(heading).color : null,
      };
    });

    await row.hover();
    await page.waitForTimeout(220);

    const after = await page.evaluate(() => {
      const element = document.querySelector('.agent-project-row');
      const heading = element?.querySelector('.agent-project-copy h3');
      return {
        rowMatchesHover: Boolean(element?.matches(':hover')),
        background: element ? getComputedStyle(element).backgroundColor : null,
        titleColor: heading ? getComputedStyle(heading).color : null,
      };
    });

    const cssRules = await collectMatchingRules(page);
    console.log('[project-hover-debug] ' + JSON.stringify({ before, after, cssRules }, null, 2));
  } finally {
    await browser.close();
  }
}

main().catch(/** Callback contract: Report a diagnostic runner failure and mark the temporary workflow unsuccessful when Chromium/page inspection itself cannot complete. Inputs: `error`. Side effects: writes the error to stderr and sets the Node.js process exit code. Returns: undefined; callback is side-effect-only. */ (error) => {
  console.error(error);
  process.exitCode = 1;
});
