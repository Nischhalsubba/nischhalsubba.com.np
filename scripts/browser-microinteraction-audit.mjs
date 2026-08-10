import { chromium } from 'playwright';

const base = process.env.AUDIT_BASE_URL || 'http://127.0.0.1:4173';
const failures = [];

function record(label, error) {
  failures.push(`${label}: ${error?.message || error}`);
}

async function goto(page, route = '/') {
  const response = await page.goto(`${base}${route}`, { waitUntil: 'networkidle', timeout: 30000 });
  if (!response || response.status() >= 400) throw new Error(`HTTP ${response?.status() || 'none'} for ${route}`);
}

async function measureButtons(page) {
  return page.evaluate(() => {
    const parse = (value) => {
      const match = value.match(/rgba?\(([^)]+)\)/i);
      if (!match) return [0, 0, 0, 1];
      const parts = match[1].split(/[ ,/]+/).filter(Boolean).map(Number);
      return [parts[0] || 0, parts[1] || 0, parts[2] || 0, Number.isFinite(parts[3]) ? parts[3] : 1];
    };
    const blend = (fg, bg) => {
      const a = fg[3] + bg[3] * (1 - fg[3]);
      if (!a) return [0, 0, 0, 0];
      return [
        (fg[0] * fg[3] + bg[0] * bg[3] * (1 - fg[3])) / a,
        (fg[1] * fg[3] + bg[1] * bg[3] * (1 - fg[3])) / a,
        (fg[2] * fg[3] + bg[2] * bg[3] * (1 - fg[3])) / a,
        a,
      ];
    };
    const luminance = (rgb) => {
      const channels = rgb.slice(0, 3).map((v) => {
        const n = v / 255;
        return n <= 0.03928 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
    };
    const contrast = (a, b) => {
      const la = luminance(a);
      const lb = luminance(b);
      return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
    };
    const effectiveBackground = (el) => {
      let result = [0, 0, 0, 0];
      let current = el;
      while (current && current.nodeType === 1 && result[3] < 0.995) {
        result = blend(parse(getComputedStyle(current).backgroundColor), result);
        current = current.parentElement;
      }
      if (result[3] < 0.995) result = blend([255, 255, 255, 1], result);
      return result;
    };
    return [...document.querySelectorAll('.nrs-uploaded-btn')].map((el) => {
      const style = getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      const color = parse(style.color);
      const background = effectiveBackground(el);
      return {
        text: (el.textContent || '').replace(/\s+/g, ' ').trim(),
        href: el.getAttribute('href'),
        width: rect.width,
        height: rect.height,
        visible: style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) > 0.05 && rect.width > 0 && rect.height > 0,
        contrast: contrast(color, background),
      };
    });
  });
}

function near(a, b, tolerance = 1.5) {
  return Math.abs(a - b) <= tolerance;
}

async function desktopHeroAudit(browser) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  try {
    await goto(page, '/');

    const buttons = await measureButtons(page);
    if (buttons.length !== 2) throw new Error(`expected 2 hero CTAs, found ${buttons.length}`);
    for (const button of buttons) {
      if (!button.visible) throw new Error(`CTA is not visible: ${button.text || button.href}`);
      if (!button.text) throw new Error(`CTA has no readable text: ${button.href}`);
      if (button.width < 120 || button.height < 44) throw new Error(`CTA target too small: ${button.text} ${button.width.toFixed(1)}x${button.height.toFixed(1)}`);
      if (button.contrast < 4.5) throw new Error(`CTA contrast below 4.5:1: ${button.text} ${button.contrast.toFixed(2)}:1`);
    }

    const primary = page.locator('.nrs-uploaded-btn-primary');
    await primary.focus();
    const focusVisible = await primary.evaluate((el) => {
      const style = getComputedStyle(el);
      return style.outlineStyle !== 'none' && Number.parseFloat(style.outlineWidth) >= 1;
    });
    if (!focusVisible) throw new Error('primary hero CTA has no visible keyboard focus indicator');

    const selectedTarget = page.locator('#selected-work');
    if (await selectedTarget.count() !== 1) throw new Error('View selected work points to missing #selected-work target');
    await primary.click();
    await page.waitForTimeout(120);
    if (!page.url().endsWith('#selected-work')) throw new Error('View selected work did not navigate to #selected-work');

    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.waitForTimeout(60);

    const visual = page.locator('.nrs-uploaded-visual');
    const portrait = page.locator('.nrs-original-portrait:not(.nrs-original-portrait-ghost)');
    const field = page.locator('.nrs-decision-field');
    const nodes = page.locator('.nrs-story-node');
    if (await nodes.count() !== 5) throw new Error(`expected 5 story nodes, found ${await nodes.count()}`);

    const basePortrait = await portrait.boundingBox();
    const baseField = await field.boundingBox();
    if (!basePortrait || !baseField) throw new Error('portrait or decision field is not measurable');

    const keys = ['problem', 'rules', 'state', 'choice', 'signal'];
    let problemPixels = null;
    let signalPixels = null;
    for (const key of keys) {
      const node = page.locator(`.nrs-story-node[data-story="${key}"]`);
      if (await node.getAttribute('aria-label') === null) throw new Error(`${key} story node has no accessible name`);
      await node.hover();
      await page.waitForTimeout(460);

      const state = await visual.getAttribute('data-story-active');
      if (state !== key) throw new Error(`${key} hover did not activate story state; active=${state}`);
      if (await page.locator('#nrsStoryReadout').getAttribute('aria-hidden') !== 'false') throw new Error(`${key} hover did not expose the story readout`);
      const title = (await page.locator('#nrsStoryTitle').textContent())?.trim() || '';
      const rule = (await page.locator('#nrsStoryRule').textContent())?.trim() || '';
      if (!title || !rule) throw new Error(`${key} story readout is missing title/rule copy`);

      const afterPortrait = await portrait.boundingBox();
      const afterField = await field.boundingBox();
      if (!afterPortrait || !afterField) throw new Error(`${key} hover hid portrait or decision field`);
      if (![afterPortrait.x, afterPortrait.y, afterPortrait.width, afterPortrait.height].every((v, i) => near(v, [basePortrait.x, basePortrait.y, basePortrait.width, basePortrait.height][i]))) {
        throw new Error(`${key} hover moves/scales the main portrait`);
      }
      if (![afterField.x, afterField.y, afterField.width, afterField.height].every((v, i) => near(v, [baseField.x, baseField.y, baseField.width, baseField.height][i]))) {
        throw new Error(`${key} hover moves/scales the decision field container`);
      }

      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      if (overflow > 1) throw new Error(`${key} hover introduces ${overflow}px horizontal overflow`);

      const pixelOpacity = Number.parseFloat(await page.locator('.nrs-field-pixels').evaluate((el) => getComputedStyle(el).opacity));
      if (key === 'problem') problemPixels = pixelOpacity;
      if (key === 'signal') signalPixels = pixelOpacity;
    }
    if (!(Number.isFinite(problemPixels) && Number.isFinite(signalPixels) && signalPixels < problemPixels * 0.35)) {
      throw new Error(`Signal state does not visibly reduce noise enough: problem=${problemPixels}, signal=${signalPixels}`);
    }

    const signalNode = page.locator('.nrs-story-node[data-story="signal"]');
    await signalNode.click();
    await page.waitForTimeout(80);
    if (await visual.getAttribute('data-story-pinned') !== 'true') throw new Error('clicking a story node does not pin the state');
    await page.mouse.move(20, 20);
    await page.waitForTimeout(180);
    if (await visual.getAttribute('data-story-active') !== 'signal') throw new Error('pinned Signal state resets on pointer leave');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(180);
    if (await visual.getAttribute('data-story-pinned') !== 'false') throw new Error('Escape does not clear pinned story state');
    if (await visual.getAttribute('data-story-active')) throw new Error('Escape leaves a story state active');

    const rulesNode = page.locator('.nrs-story-node[data-story="rules"]');
    await rulesNode.focus();
    await page.waitForTimeout(60);
    if (await visual.getAttribute('data-story-active') !== 'rules') throw new Error('keyboard focus does not activate story state');
    if (await page.locator('#nrsStoryReadout').getAttribute('aria-hidden') !== 'false') throw new Error('keyboard focus does not expose readout');

    const themeToggle = page.locator('.theme-toggle-btn:visible').first();
    if (await themeToggle.count() !== 1) throw new Error('desktop theme toggle is missing');
    const beforeTheme = await page.evaluate(() => document.documentElement.dataset.theme || '');
    await themeToggle.click();
    await page.waitForTimeout(80);
    const afterTheme = await page.evaluate(() => document.documentElement.dataset.theme || '');
    if (!afterTheme || afterTheme === beforeTheme) throw new Error('desktop theme toggle does not switch theme');
    const afterThemeButtons = await measureButtons(page);
    for (const button of afterThemeButtons) {
      if (button.contrast < 4.5) throw new Error(`CTA contrast fails after theme switch: ${button.text} ${button.contrast.toFixed(2)}:1`);
    }
    await page.reload({ waitUntil: 'networkidle' });
    const persistedTheme = await page.evaluate(() => document.documentElement.dataset.theme || '');
    if (persistedTheme !== afterTheme) throw new Error(`theme choice does not persist after reload: expected ${afterTheme}, got ${persistedTheme}`);
  } catch (error) {
    record('desktop hero + microinteractions', error);
  } finally {
    await context.close();
  }
}

async function mobileHeroAudit(browser) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  try {
    await goto(page, '/');
    const buttons = await measureButtons(page);
    if (buttons.length !== 2) throw new Error(`expected 2 mobile hero CTAs, found ${buttons.length}`);
    for (const button of buttons) {
      if (!button.visible || !button.text) throw new Error(`mobile CTA is not visibly labeled: ${button.href}`);
      if (button.height < 44) throw new Error(`mobile CTA is below 44px: ${button.text} ${button.height.toFixed(1)}px`);
      if (button.contrast < 4.5) throw new Error(`mobile CTA contrast below 4.5:1: ${button.text} ${button.contrast.toFixed(2)}:1`);
    }
    const geometry = await page.evaluate(() => {
      const visual = document.querySelector('.nrs-uploaded-visual')?.getBoundingClientRect();
      const portrait = document.querySelector('.nrs-original-portrait:not(.nrs-original-portrait-ghost)')?.getBoundingClientRect();
      return {
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        visual: visual ? { left: visual.left, right: visual.right, width: visual.width } : null,
        portrait: portrait ? { left: portrait.left, right: portrait.right, width: portrait.width } : null,
      };
    });
    if (geometry.overflow > 1) throw new Error(`mobile hero causes ${geometry.overflow}px horizontal overflow`);
    if (!geometry.visual || !geometry.portrait) throw new Error('mobile portrait visual is missing');
    if (geometry.visual.left < -2 || geometry.visual.right > 392) throw new Error(`mobile visual escapes viewport: ${JSON.stringify(geometry.visual)}`);

    const visibleNodes = await page.locator('.nrs-story-node:visible').count();
    if (visibleNodes > 0) {
      const first = page.locator('.nrs-story-node:visible').first();
      const box = await first.boundingBox();
      if (box && (box.width < 44 || box.height < 44)) throw new Error(`visible mobile story target is below 44px: ${box.width.toFixed(1)}x${box.height.toFixed(1)}`);
      await first.tap();
      await page.waitForTimeout(80);
      if (await page.locator('.nrs-uploaded-visual').getAttribute('data-story-pinned') !== 'true') throw new Error('tap does not activate/pin mobile story node');
    }
  } catch (error) {
    record('mobile hero + touch targets', error);
  } finally {
    await context.close();
  }
}

async function reducedMotionAudit(browser) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  try {
    await goto(page, '/');
    const portrait = page.locator('.nrs-original-portrait:not(.nrs-original-portrait-ghost)');
    const before = await portrait.boundingBox();
    await page.locator('.nrs-story-node[data-story="state"]').hover();
    await page.waitForTimeout(500);
    const after = await portrait.boundingBox();
    if (!before || !after) throw new Error('portrait is not measurable under reduced motion');
    if (![after.x, after.y, after.width, after.height].every((v, i) => near(v, [before.x, before.y, before.width, before.height][i]))) {
      throw new Error('reduced-motion story interaction moves/scales the main portrait');
    }
    if (await page.locator('.nrs-uploaded-visual').getAttribute('data-story-active') !== 'state') throw new Error('reduced motion removes story meaning instead of simplifying motion');
    if (await page.locator('#nrsStoryReadout').getAttribute('aria-hidden') !== 'false') throw new Error('reduced motion hides story feedback');
  } catch (error) {
    record('reduced motion', error);
  } finally {
    await context.close();
  }
}

async function experienceLinksAudit(browser) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  try {
    await goto(page, '/about');
    const expected = {
      Idealaya: 'https://idealaya.com/',
      'Mokshya Protocol': 'https://mokshya.io/',
      Tegzy: 'https://www.tegzy.com.au/',
      'ESR Tech': 'https://esrtech.io/',
      ThemeGrill: 'https://themegrill.com/',
      Gurzu: 'https://gurzu.com/',
    };
    const links = await page.locator('.nrs-experience-list .nrs-company-link').evaluateAll((els) => els.map((el) => ({
      text: el.querySelector('strong')?.textContent?.trim() || '',
      href: el.href,
      target: el.target,
      rel: el.rel,
      aria: el.getAttribute('aria-label') || '',
      visible: getComputedStyle(el).display !== 'none' && el.getBoundingClientRect().width > 0 && el.getBoundingClientRect().height > 0,
    })));
    if (links.length !== 6) throw new Error(`expected 6 company links, found ${links.length}`);
    for (const [name, href] of Object.entries(expected)) {
      const link = links.find((item) => item.text === name);
      if (!link) throw new Error(`missing company link: ${name}`);
      if (link.href !== href) throw new Error(`${name} points to ${link.href}, expected ${href}`);
      if (!link.visible) throw new Error(`${name} link is not visible`);
      if (link.target !== '_blank') throw new Error(`${name} external link does not open in a new tab`);
      if (!/\bnoopener\b/.test(link.rel) || !/\bnoreferrer\b/.test(link.rel)) throw new Error(`${name} external link is missing noopener/noreferrer`);
      if (!link.aria) throw new Error(`${name} external link has no accessible label`);
    }
    const first = page.locator('.nrs-company-link').first();
    await first.focus();
    const focusVisible = await first.evaluate((el) => {
      const style = getComputedStyle(el);
      return style.outlineStyle !== 'none' && Number.parseFloat(style.outlineWidth) >= 1;
    });
    if (!focusVisible) throw new Error('company links have no visible keyboard focus state');
  } catch (error) {
    record('experience company links', error);
  } finally {
    await context.close();
  }
}

const browser = await chromium.launch({ headless: true });
await desktopHeroAudit(browser);
await mobileHeroAudit(browser);
await reducedMotionAudit(browser);
await experienceLinksAudit(browser);
await browser.close();

if (failures.length) {
  console.error(`[microinteraction-audit] ${failures.length} failure(s)\n${failures.map((failure) => `- ${failure}`).join('\n')}`);
  process.exit(1);
}
console.log('[microinteraction-audit] Hero CTAs, GSAP story states, theme behavior, reduced motion, mobile targets, and experience links passed.');
