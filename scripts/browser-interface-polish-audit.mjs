import { chromium } from 'playwright';

const base = process.env.AUDIT_BASE_URL || 'http://127.0.0.1:4173';
const browser = await chromium.launch({ headless: true });
const failures = [];

function fail(label, message) {
  failures.push(`${label}: ${message}`);
}

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
    const metrics = await page.evaluate(() => {
      const wrapper = document.querySelector('.agent-case-title-wrap');
      const title = document.querySelector('.agent-case-title');
      const frame = document.querySelector('.agent-case-grid');
      if (!wrapper || !title || !frame) return null;

      const range = document.createRange();
      range.selectNodeContents(title);
      const lineRects = [...range.getClientRects()].filter((rect) => rect.width > 0 && rect.height > 0);
      const uniqueLines = [...new Set(lineRects.map((rect) => Math.round(rect.top)))];
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
    const metrics = await page.evaluate(() => {
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
  const label = 'Capability alignment 1440x900';
  let page;
  try {
    page = await openPage(standard, '/', { width: 1440, height: 900 });
    const tops = await page.locator('.agent-capability').evaluateAll((elements) => elements.map((element) => element.getBoundingClientRect().top));
    if (tops.length !== 4) throw new Error(`expected 4 capability cards, found ${tops.length}`);
    const delta = Math.max(...tops) - Math.min(...tops);
    if (delta > 2) throw new Error(`capability cards are vertically staggered by ${delta.toFixed(1)}px`);
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
    const before = await row.evaluate((element) => ({
      background: getComputedStyle(element).backgroundColor,
      title: getComputedStyle(element.querySelector('h3')).color,
    }));
    await row.hover();
    await page.waitForTimeout(220);
    const after = await row.evaluate((element) => ({
      background: getComputedStyle(element).backgroundColor,
      title: getComputedStyle(element.querySelector('h3')).color,
    }));
    if (before.background === after.background && before.title === after.title) {
      throw new Error('hover produces no visible feedback');
    }

    const button = page.locator('.agent-btn').first();
    await button.focus();
    const focus = await button.evaluate((element) => {
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
    await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
    await page.waitForTimeout(900);
    const hidden = await page.locator('[data-agent-reveal]').evaluateAll((elements) => elements
      .filter((element) => {
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0 && (Number.parseFloat(style.opacity) < 0.95 || style.visibility === 'hidden');
      })
      .map((element) => element.className || element.tagName));
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
    await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
    await page.waitForTimeout(250);
    const result = await page.locator('[data-agent-reveal]').evaluateAll((elements) => ({
      hidden: elements.filter((element) => {
        const style = getComputedStyle(element);
        return Number.parseFloat(style.opacity) < 0.95 || style.visibility === 'hidden';
      }).length,
      longTransitions: elements.filter((element) => {
        const durations = getComputedStyle(element).transitionDuration.split(',').map((value) => Number.parseFloat(value) || 0);
        return durations.some((duration) => duration > 0.05);
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
  console.error(`[interface-polish-audit] ${failures.length} failure(s)\n${failures.map((failure) => `- ${failure}`).join('\n')}`);
  process.exit(1);
}

console.log('[interface-polish-audit] Project title, About alignment, capability grid, micro-interactions, focus, reveal stability, and reduced-motion checks passed.');
