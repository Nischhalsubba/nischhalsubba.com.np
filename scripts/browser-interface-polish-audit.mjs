/**
 * @fileoverview scripts/browser-interface-polish-audit.mjs
 * Purpose: Node-based build, content transformation, QA, or maintenance tool for browser interface polish audit.
 * Responsibilities:
 * - Own the behavior/content implied by this file's single responsibility.
 * - Keep public routes, build contracts, and imported module boundaries stable unless the connected owners are updated together.
 * Execution context: Node.js CLI during local development, CI, build, or maintenance.
 * Connected files:
 * - .github/workflows/interface-polish-audit.yml
 * - docs/repository/file-catalog.md
 * - package.json
 * - scripts/build-dist.cjs
 * Maintenance: Update this header when responsibility or dependencies change; generated/vendor files are documented at their source instead.
 */
import { chromium } from 'playwright';

const base = process.env.AUDIT_BASE_URL || 'http://127.0.0.1:4173';
const browser = await chromium.launch({ headless: true });
const failures = [];

/**
 * Function contract: fail
 * Purpose: Implements the fail responsibility for this module.
 * Inputs: label, message.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: no explicit value unless an invoked dependency throws/rejects.
 */
function fail(label, message) {
  failures.push(`${label}: ${message}`);
}

/**
 * Function contract: openPage
 * Purpose: Implements the open page responsibility for this module.
 * Inputs: context, route, viewport.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
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
    const metrics = await page.evaluate(/** Callback contract: Processes the callback step for page without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: may read or update browser DOM/state. Returns a value to the invoking API. */ () => {
      const wrapper = document.querySelector('.agent-case-title-wrap');
      const title = document.querySelector('.agent-case-title');
      const frame = document.querySelector('.agent-case-grid');
      if (!wrapper || !title || !frame) return null;

      const range = document.createRange();
      range.selectNodeContents(title);
      const lineRects = [...range.getClientRects()].filter(/** Callback contract: Processes the callback step for [...range.get client rects()] without leaking orchestration details to the caller. Inputs: rect. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (rect) => rect.width > 0 && rect.height > 0);
      const uniqueLines = [...new Set(lineRects.map(/** Callback contract: Processes the callback step for line rects without leaking orchestration details to the caller. Inputs: rect. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (rect) => Math.round(rect.top)))];
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
    const metrics = await page.evaluate(/** Callback contract: Processes the callback step for page without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: may read or update browser DOM/state. Returns a value to the invoking API. */ () => {
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

{
  const label = 'Three habits alignment 1440x900';
  let page;
  try {
    page = await openPage(standard, '/', { width: 1440, height: 900 });
    const geometry = await page.locator('.nrs-home-habit').evaluateAll(/** Callback contract: Processes the callback step for page.locator('.nrs home habit') without leaking orchestration details to the caller. Inputs: elements. Side effects: no obvious external side effect beyond invoked dependencies. Returns a value to the invoking API. */ (elements) => elements.map(/** Callback contract: Processes the callback step for elements without leaking orchestration details to the caller. Inputs: element. Side effects: no obvious external side effect beyond invoked dependencies. Returns a value to the invoking API. */ (element) => {
      const rect = element.getBoundingClientRect();
      return { top: rect.top, width: rect.width };
    }));
    if (geometry.length !== 3) throw new Error(`expected 3 habit cards, found ${geometry.length}`);
    const topDelta = Math.max(...geometry.map(/** Callback contract: Processes the callback step for geometry without leaking orchestration details to the caller. Inputs: item. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (item) => item.top)) - Math.min(...geometry.map(/** Callback contract: Processes the callback step for geometry without leaking orchestration details to the caller. Inputs: item. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (item) => item.top));
    if (topDelta > 2) throw new Error(`habit cards are vertically staggered by ${topDelta.toFixed(1)}px`);
    const widthDelta = Math.max(...geometry.map(/** Callback contract: Processes the callback step for geometry without leaking orchestration details to the caller. Inputs: item. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (item) => item.width)) - Math.min(...geometry.map(/** Callback contract: Processes the callback step for geometry without leaking orchestration details to the caller. Inputs: item. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (item) => item.width));
    if (widthDelta > 3) throw new Error(`habit columns differ in width by ${widthDelta.toFixed(1)}px`);
  } catch (error) {
    fail(label, error.message);
  } finally {
    await page?.close();
  }
}

{
  const label = 'Project-row micro interaction';
  let page;
  try {
    page = await openPage(standard, '/', { width: 1440, height: 900 });
    const row = page.locator('.agent-project-row').first();
    const before = await row.evaluate(/** Callback contract: Processes the callback step for row without leaking orchestration details to the caller. Inputs: element. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (element) => ({
      background: getComputedStyle(element).backgroundColor,
      title: getComputedStyle(element.querySelector('h3')).color,
    }));
    await row.hover();
    await page.waitForTimeout(220);
    const after = await row.evaluate(/** Callback contract: Processes the callback step for row without leaking orchestration details to the caller. Inputs: element. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (element) => ({
      background: getComputedStyle(element).backgroundColor,
      title: getComputedStyle(element.querySelector('h3')).color,
    }));
    if (before.background === after.background && before.title === after.title) {
      throw new Error('hover produces no visible feedback');
    }

    const button = page.locator('.agent-btn').first();
    await button.focus();
    const focus = await button.evaluate(/** Callback contract: Processes the callback step for button without leaking orchestration details to the caller. Inputs: element. Side effects: no obvious external side effect beyond invoked dependencies. Returns a value to the invoking API. */ (element) => {
      const style = getComputedStyle(element);
      const afterStyle = getComputedStyle(element, '::after');
      return {
        outlineStyle: style.outlineStyle,
        outlineWidth: Number.parseFloat(style.outlineWidth),
        arrowTransform: afterStyle.transform,
      };
    });
    if (focus.outlineStyle === 'none' || focus.outlineWidth < 2) throw new Error('button focus state is not visibly outlined');
    if (focus.arrowTransform === 'none') throw new Error('button focus does not reinforce direction with the arrow micro-interaction');
  } catch (error) {
    fail(label, error.message);
  } finally {
    await page?.close();
  }
}

{
  const label = 'Reveal final-state stability';
  let page;
  try {
    page = await openPage(standard, '/', { width: 1440, height: 900 });
    await page.evaluate(/** Callback contract: Processes the callback step for page without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: may read or update browser DOM/state. No explicit return contract. */ () => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
    await page.waitForTimeout(900);
    const hidden = await page.locator('[data-agent-reveal]').evaluateAll(/** Callback contract: Processes the callback step for page.locator('[data agent reveal]') without leaking orchestration details to the caller. Inputs: elements. Side effects: no obvious external side effect beyond invoked dependencies. Returns a value to the invoking API. */ (elements) => elements
      .filter(/** Callback contract: Processes the callback step for elements without leaking orchestration details to the caller. Inputs: element. Side effects: no obvious external side effect beyond invoked dependencies. Returns a value to the invoking API. */ (element) => {
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0 && (Number.parseFloat(style.opacity) < 0.95 || style.visibility === 'hidden');
      })
      .map(/** Callback contract: Processes the callback step for elements
      .filter((element) => {
        const style = get computed style(element);
        const rect = element.get bounding client rect();
        return rect.width > 0 && rect.height > 0 && (number.parse float(style.opacity) < 0.95 || style.visibility === 'hidden');
      }) without leaking orchestration details to the caller. Inputs: element. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (element) => element.className || element.tagName));
    if (hidden.length) throw new Error(`reveal targets remained hidden after animation: ${hidden.slice(0, 5).join(', ')}`);
  } catch (error) {
    fail(label, error.message);
  } finally {
    await page?.close();
  }
}

await standard.close();

{
  const label = 'Reduced-motion readability';
  const reduced = await browser.newContext({ reducedMotion: 'reduce' });
  let page;
  try {
    page = await openPage(reduced, '/', { width: 1440, height: 900 });
    await page.evaluate(/** Callback contract: Processes the callback step for page without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: may read or update browser DOM/state. No explicit return contract. */ () => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
    await page.waitForTimeout(250);
    const result = await page.locator('[data-agent-reveal]').evaluateAll(/** Callback contract: Processes the callback step for page.locator('[data agent reveal]') without leaking orchestration details to the caller. Inputs: elements. Side effects: no obvious external side effect beyond invoked dependencies. Returns a value to the invoking API. */ (elements) => ({
      hidden: elements.filter(/** Callback contract: Processes the callback step for elements without leaking orchestration details to the caller. Inputs: element. Side effects: no obvious external side effect beyond invoked dependencies. Returns a value to the invoking API. */ (element) => {
        const style = getComputedStyle(element);
        return Number.parseFloat(style.opacity) < 0.95 || style.visibility === 'hidden';
      }).length,
      longTransitions: elements.filter(/** Callback contract: Processes the callback step for elements without leaking orchestration details to the caller. Inputs: element. Side effects: no obvious external side effect beyond invoked dependencies. Returns a value to the invoking API. */ (element) => {
        const durations = getComputedStyle(element).transitionDuration.split(',').map(/** Callback contract: Processes the callback step for get computed style(element).transition duration.split(',') without leaking orchestration details to the caller. Inputs: value. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (value) => Number.parseFloat(value) || 0);
        return durations.some(/** Callback contract: Processes the callback step for durations without leaking orchestration details to the caller. Inputs: duration. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (duration) => duration > 0.05);
      }).length,
    }));
    if (result.hidden) throw new Error(`${result.hidden} reveal targets are hidden with reduced motion`);
  } catch (error) {
    fail(label, error.message);
  } finally {
    await page?.close();
    await reduced.close();
  }
}

await browser.close();

if (failures.length) {
  console.error(`[interface-polish-audit] ${failures.length} failure(s)\n${failures.map(/** Callback contract: Processes the callback step for failures without leaking orchestration details to the caller. Inputs: failure. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (failure) => `- ${failure}`).join('\n')}`);
  process.exit(1);
}

console.log('[interface-polish-audit] Project title, About alignment, Three habits grid, micro-interactions, focus, reveal stability, and reduced-motion checks passed.');
