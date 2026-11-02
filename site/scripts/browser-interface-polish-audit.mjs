/**
 * @fileoverview scripts/browser-interface-polish-audit.mjs
 * Purpose: Validate browser interface polish audit and fail with actionable diagnostics when the production contract is violated.
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

const base = process.env.AUDIT_BASE_URL || 'http://127.0.0.1:4173';
const browser = await chromium.launch({ headless: true });
const failures = [];


/**
 * Function contract: fail
 * Purpose: Implement the fail responsibility owned by the browser interface polish audit repository tool.
 * Inputs: `label`, `message`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Undefined; the function exists for the documented side effects, validation, or orchestration.
 */
function fail(label, message) {
  failures.push(`${label}: ${message}`);
}



/**
 * Function contract: openPage
 * Purpose: Implement the open page responsibility owned by the browser interface polish audit repository tool.
 * Inputs: `context`, `route`, `viewport`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Promise resolving to the computed function result.
 */
async function openPage(context, route, viewport) {
  const page = await context.newPage();
  await page.setViewportSize(viewport);
  const response = await page.goto(`${base}${route}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  if (!response || response.status() >= 400) {
    throw new Error(`HTTP ${response?.status() || 'none'} for ${route}`);
  }
  await page.waitForTimeout(450);
  return page;
}

const standard = await browser.newContext({ reducedMotion: 'no-preference' });

for (const viewport of [
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 },
]) {
  const label = `Zapp title ${viewport.width}x${viewport.height}`;
  let page;
  try {
    page = await openPage(standard, '/project-zapp', viewport);
    const metrics = await page.evaluate(   /** Callback contract: Perform the local callback step required by the immediately enclosing browser interface polish audit repository tool operation. Inputs: None; derives required state from its enclosing module/runtime context. Side effects: reads or updates DOM/browser state Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior. */ () => {
      const wrapper = document.querySelector('.agent-case-title-wrap');
      const title = document.querySelector('.agent-case-title');
      const frame = document.querySelector('.agent-case-grid');
      if (!wrapper || !title || !frame) return null;

      const range = document.createRange();
      range.selectNodeContents(title);
      const lineRects = [...range.getClientRects()].filter(   /** Callback contract: Decide whether the current item remains in the filtered result consumed by the enclosing operation. Inputs: `rect` Side effects: No direct external side effect beyond invoked dependencies. Returns: Boolean predicate result consumed by the enclosing collection lookup/filter. */ (rect) => rect.width > 0 && rect.height > 0);
      const uniqueLines = [...new Set(lineRects.map(   /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `rect` Side effects: No direct external side effect beyond invoked dependencies. Returns: Computed expression result consumed by the enclosing operation. */ (rect) => Math.round(rect.top)))];
      const wrapperRect = wrapper.getBoundingClientRect();
      const titleRect = title.getBoundingClientRect();
      const frameRect = frame.getBoundingClientRect();
      const fontSize = Number.parseFloat(getComputedStyle(title).fontSize);

      return {
        text: title.textContent.trim(),
        lineCount: uniqueLines.length,
        wrapperWidth: wrapperRect.width,
        titleWidth: titleRect.width,
        frameWidth: frameRect.width,
        fontSize,
        overflow: titleRect.right - document.documentElement.clientWidth,
      };
    });

    if (!metrics) throw new Error('case title structure is missing');
    if (metrics.text !== 'Zapp Today') throw new Error(`unexpected title: ${metrics.text}`);
    const minimumRatio = viewport.width <= 767 ? 0.82 : 0.52;
    if (metrics.wrapperWidth / metrics.frameWidth < minimumRatio) {
      throw new Error(`title wrapper is too narrow (${Math.round(metrics.wrapperWidth)}px of ${Math.round(metrics.frameWidth)}px)`);
    }
    const maximumLines = viewport.width <= 430 ? 3 : 2;
    if (metrics.lineCount > maximumLines) throw new Error(`title wraps into ${metrics.lineCount} lines`);
    if (metrics.titleWidth < metrics.fontSize * 4) {
      throw new Error(`title width ${Math.round(metrics.titleWidth)}px is too small for ${Math.round(metrics.fontSize)}px type`);
    }
    if (metrics.overflow > 1) throw new Error(`title overflows viewport by ${Math.round(metrics.overflow)}px`);
  } catch (error) {
    fail(label, error.message);
  } finally {
    await page?.close();
  }
}

for (const viewport of [
  { width: 1024, height: 768 },
  { width: 1440, height: 900 },
]) {
  const label = `About alignment ${viewport.width}x${viewport.height}`;
  let page;
  try {
    page = await openPage(standard, '/about', viewport);
    const metrics = await page.evaluate(   /** Callback contract: Perform the local callback step required by the immediately enclosing browser interface polish audit repository tool operation. Inputs: None; derives required state from its enclosing module/runtime context. Side effects: reads or updates DOM/browser state Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior. */ () => {
      const grid = document.querySelector('.agent-about-grid');
      const copy = document.querySelector('.agent-about-copy');
      const aside = document.querySelector('.agent-about-aside');
      const heroGrid = document.querySelector('.agent-page-hero-grid');
      const heroTitleWrap = heroGrid?.querySelector(':scope > div:first-child');
      if (!grid || !copy || !aside || !heroGrid || !heroTitleWrap) return null;

      const gridRect = grid.getBoundingClientRect();
      const copyRect = copy.getBoundingClientRect();
      const asideRect = aside.getBoundingClientRect();
      const heroRect = heroGrid.getBoundingClientRect();
      const heroWrapRect = heroTitleWrap.getBoundingClientRect();
      const gridStyle = getComputedStyle(grid);
      const expectedContentLeft = gridRect.left + Number.parseFloat(gridStyle.paddingLeft || '0');

      return {
        topDelta: Math.abs(copyRect.top - asideRect.top),
        leftDelta: Math.abs(copyRect.left - expectedContentLeft),
        heroRatio: heroWrapRect.width / heroRect.width,
      };
    });

    if (!metrics) throw new Error('agent about layout is missing');
    if (metrics.topDelta > 4) throw new Error(`copy/aside start positions differ by ${metrics.topDelta.toFixed(1)}px`);
    if (metrics.leftDelta > 4) throw new Error(`about copy misses the primary grid edge by ${metrics.leftDelta.toFixed(1)}px`);
    if (metrics.heroRatio < 0.52) throw new Error(`about hero title wrapper is too narrow (${metrics.heroRatio.toFixed(2)} of grid)`);
  } catch (error) {
    fail(label, error.message);
  } finally {
    await page?.close();
  }
}

// The replaced homepage is covered by browser-workspace-home-audit.mjs.
await standard.close();

await browser.close();

if (failures.length) {
  console.error(`[interface-polish-audit] ${failures.length} failure(s)\n${failures.map( /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `failure` Side effects: No direct external side effect beyond invoked dependencies. Returns: Computed expression result consumed by the enclosing operation. */ (failure) => `- ${failure}`).join('\n')}`);
  process.exit(1);
}

console.log('[interface-polish-audit] Retained project title and About alignment checks passed; workspace homepage uses its dedicated regression audit.');
