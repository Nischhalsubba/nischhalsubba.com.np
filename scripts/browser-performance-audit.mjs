/**
 * @fileoverview scripts/browser-performance-audit.mjs
 * Purpose: Validate browser performance audit and fail with actionable diagnostics when the production contract is violated.
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

const base = (process.env.AUDIT_BASE_URL || 'http://127.0.0.1:4173').replace(/\/$/, '');
const routes = ['/', '/projects', '/project-yarsha', '/services'];
const viewports = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'desktop', width: 1440, height: 900 },
];

const failures = [];
const warnings = [];
const rows = [];
const browser = await chromium.launch({ headless: true });

for (const viewport of viewports) {
  const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } });
  const page = await context.newPage();

  await page.addInitScript(/** Callback contract: Perform the local callback step required by the enclosing browser performance audit repository tool operation. Inputs: none. Side effects: reads or updates DOM/browser state. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ () => {
    window.__nrsPerf = { lcp: 0, cls: 0 };
    try {
      new PerformanceObserver(/** Callback contract: Perform the local callback step required by the enclosing browser performance audit repository tool operation. Inputs: `list`. Side effects: reads or updates DOM/browser state. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ (list) => {
        const entries = list.getEntries();
        const latest = entries[entries.length - 1];
        if (latest) window.__nrsPerf.lcp = latest.startTime;
      }).observe({ type: 'largest-contentful-paint', buffered: true });
    } catch {}
    try {
      new PerformanceObserver(/** Callback contract: Perform the local callback step required by the enclosing browser performance audit repository tool operation. Inputs: `list`. Side effects: reads or updates DOM/browser state. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ (list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) window.__nrsPerf.cls += entry.value || 0;
        }
      }).observe({ type: 'layout-shift', buffered: true });
    } catch {}
  });

  for (const route of routes) {
    try {
      const response = await page.goto(`${base}${route}`, { waitUntil: 'networkidle', timeout: 30000 });
      if (!response || response.status() >= 400) throw new Error(`HTTP ${response?.status() || 'none'}`);
      await page.waitForTimeout(900);

      const metrics = await page.evaluate(/** Callback contract: Processes the callback step for page without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: may read or update browser DOM/state. Returns a value to the invoking API. */ /** Callback contract: Perform the local callback step required by the enclosing browser performance audit repository tool operation. Inputs: none. Side effects: reads or updates DOM/browser state. Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation. */ () => {
        const resources = performance.getEntriesByType('resource');
        const navigation = performance.getEntriesByType('navigation')[0];
        return {
          lcp: Math.round(window.__nrsPerf?.lcp || 0),
          cls: Number((window.__nrsPerf?.cls || 0).toFixed(3)),
          transfer: Math.round(resources.reduce(/** Callback contract: Processes the callback step for resources without leaking orchestration details to the caller. Inputs: sum, entry. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Fold the current item into the accumulator used by the enclosing reduction. Inputs: `sum`, `entry`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ (sum, entry) => sum + (entry.transferSize || 0), 0)),
          requests: resources.length,
          domContentLoaded: Math.round(navigation?.domContentLoadedEventEnd || 0),
          load: Math.round(navigation?.loadEventEnd || 0),
        };
      });

      rows.push({ viewport: viewport.name, route, ...metrics });
      const label = `${viewport.name} ${route}`;

      if (metrics.lcp > 6000) failures.push(`${label}: LCP ${metrics.lcp}ms exceeds 6000ms hard guard`);
      else if (metrics.lcp > 2500) warnings.push(`${label}: LCP ${metrics.lcp}ms is above the 2500ms target`);

      if (metrics.cls > 0.25) failures.push(`${label}: CLS ${metrics.cls} exceeds 0.25 hard guard`);
      else if (metrics.cls > 0.1) warnings.push(`${label}: CLS ${metrics.cls} is above the 0.10 target`);

      if (metrics.transfer > 8_000_000) failures.push(`${label}: transferred ${(metrics.transfer / 1_000_000).toFixed(2)}MB, above 8MB hard guard`);
      else if (metrics.transfer > 4_000_000) warnings.push(`${label}: transferred ${(metrics.transfer / 1_000_000).toFixed(2)}MB`);

      if (metrics.requests > 160) failures.push(`${label}: ${metrics.requests} resource requests exceed 160 hard guard`);
      else if (metrics.requests > 100) warnings.push(`${label}: ${metrics.requests} resource requests`);
    } catch (error) {
      failures.push(`${viewport.name} ${route}: ${error.message}`);
    }
  }

  await context.close();
}

await browser.close();

console.log('[performance-audit] Live synthetic measurements');
for (const row of rows) {
  console.log(`- ${row.viewport} ${row.route}: LCP=${row.lcp}ms CLS=${row.cls} transfer=${(row.transfer / 1_000_000).toFixed(2)}MB requests=${row.requests} DCL=${row.domContentLoaded}ms load=${row.load}ms`);
}
if (warnings.length) {
  console.log(`[performance-audit] ${warnings.length} target warning(s):`);
  for (const warning of warnings) console.log(`- ${warning}`);
}
if (failures.length) {
  console.error(`[performance-audit] ${failures.length} hard failure(s):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log('[performance-audit] Passed hard performance regression guards.');
