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

  await page.addInitScript(() => {
    window.__nrsPerf = { lcp: 0, cls: 0 };
    try {
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const latest = entries[entries.length - 1];
        if (latest) window.__nrsPerf.lcp = latest.startTime;
      }).observe({ type: 'largest-contentful-paint', buffered: true });
    } catch {}
    try {
      new PerformanceObserver((list) => {
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

      const metrics = await page.evaluate(() => {
        const resources = performance.getEntriesByType('resource');
        const navigation = performance.getEntriesByType('navigation')[0];
        return {
          lcp: Math.round(window.__nrsPerf?.lcp || 0),
          cls: Number((window.__nrsPerf?.cls || 0).toFixed(3)),
          transfer: Math.round(resources.reduce((sum, entry) => sum + (entry.transferSize || 0), 0)),
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
