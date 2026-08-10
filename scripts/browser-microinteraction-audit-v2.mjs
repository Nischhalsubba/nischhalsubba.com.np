import { chromium } from 'playwright';

const base = process.env.AUDIT_BASE_URL || 'http://127.0.0.1:4173';
const failures = [];
const passes = [];

const fail = (scope, message) => failures.push(`${scope}: ${message}`);
const pass = (message) => passes.push(message);

async function open(page, route = '/') {
  const response = await page.goto(`${base}${route}`, { waitUntil: 'networkidle', timeout: 30000 });
  if (!response || response.status() >= 400) throw new Error(`HTTP ${response?.status() || 'none'} for ${route}`);
}

function boxesOverlap(a, b, pad = 0) {
  if (!a || !b) return false;
  return a.x < b.x + b.width - pad && a.x + a.width > b.x + pad && a.y < b.y + b.height - pad && a.y + a.height > b.y + pad;
}

function stableBox(a, b, tolerance = 1.5) {
  if (!a || !b) return false;
  return ['x', 'y', 'width', 'height'].every((key) => Math.abs(a[key] - b[key]) <= tolerance);
}

async function buttonMetrics(page) {
  return page.evaluate(() => {
    const parse = (value) => {
      const m = value.match(/rgba?\(([^)]+)\)/i);
      if (!m) return [0, 0, 0, 1];
      const p = m[1].split(/[ ,/]+/).filter(Boolean).map(Number);
      return [p[0] || 0, p[1] || 0, p[2] || 0, Number.isFinite(p[3]) ? p[3] : 1];
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
    const lum = (rgb) => {
      const c = rgb.slice(0, 3).map((v) => {
        const n = v / 255;
        return n <= .03928 ? n / 12.92 : ((n + .055) / 1.055) ** 2.4;
      });
      return .2126 * c[0] + .7152 * c[1] + .0722 * c[2];
    };
    const ratio = (a, b) => (Math.max(lum(a), lum(b)) + .05) / (Math.min(lum(a), lum(b)) + .05);
    const bgFor = (el) => {
      let bg = [0, 0, 0, 0];
      let node = el;
      while (node && node.nodeType === 1 && bg[3] < .995) {
        bg = blend(parse(getComputedStyle(node).backgroundColor), bg);
        node = node.parentElement;
      }
      return bg[3] < .995 ? blend([255, 255, 255, 1], bg) : bg;
    };
    return [...document.querySelectorAll('.nrs-uploaded-btn')].map((el) => {
      const s = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return {
        text: (el.textContent || '').replace(/\s+/g, ' ').trim(),
        href: el.getAttribute('href'),
        width: r.width,
        height: r.height,
        visible: s.display !== 'none' && s.visibility !== 'hidden' && Number(s.opacity) > .05 && r.width > 0 && r.height > 0,
        contrast: ratio(parse(s.color), bgFor(el)),
      };
    });
  });
}

async function auditDesktop(browser) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  try {
    await open(page, '/');

    const buttons = await buttonMetrics(page);
    if (buttons.length !== 2) fail('desktop CTA', `expected 2 hero CTAs, found ${buttons.length}`);
    for (const button of buttons) {
      if (!button.visible || !button.text) fail('desktop CTA', `not visibly labeled: ${button.href}`);
      if (button.height < 44) fail('desktop CTA', `${button.text} is only ${button.height.toFixed(1)}px high`);
      if (button.contrast < 4.5) fail('desktop CTA', `${button.text} contrast is ${button.contrast.toFixed(2)}:1`);
    }
    if (!failures.some((x) => x.startsWith('desktop CTA'))) pass('Desktop hero CTAs are visible, labeled, >=44px, and AA-contrast.');

    const primary = page.locator('.nrs-uploaded-btn-primary');
    await primary.focus();
    const focus = await primary.evaluate((el) => {
      const s = getComputedStyle(el);
      return s.outlineStyle !== 'none' && Number.parseFloat(s.outlineWidth) >= 1;
    });
    if (!focus) fail('desktop keyboard', 'primary hero CTA has no visible focus outline');
    if (await page.locator('#selected-work').count() !== 1) fail('desktop CTA', 'View selected work points to a missing #selected-work target');

    const visual = page.locator('.nrs-uploaded-visual');
    const portrait = page.locator('.nrs-original-portrait:not(.nrs-original-portrait-ghost)');
    const field = page.locator('.nrs-decision-field');
    const readout = page.locator('#nrsStoryReadout');
    const nodes = page.locator('.nrs-story-node');
    const nodeCount = await nodes.count();
    if (nodeCount !== 5) fail('story structure', `expected 5 story nodes, found ${nodeCount}`);

    const basePortrait = await portrait.boundingBox();
    const baseField = await field.boundingBox();
    const keys = ['problem', 'rules', 'state', 'choice', 'signal'];
    const opacities = {};

    for (const key of keys) {
      const node = page.locator(`.nrs-story-node[data-story="${key}"]`);
      if (!(await node.getAttribute('aria-label'))) fail(`story ${key}`, 'missing accessible name');

      let realHover = true;
      try {
        await node.hover({ timeout: 1800 });
        await page.waitForTimeout(450);
      } catch (error) {
        realHover = false;
        fail(`story ${key}`, `real pointer hover is obstructed: ${(error.message || error).split('\n')[0]}`);
        await node.focus();
        await page.waitForTimeout(80);
      }

      const active = await visual.getAttribute('data-story-active');
      if (active !== key) fail(`story ${key}`, `did not activate after ${realHover ? 'hover' : 'keyboard fallback'}; active=${active}`);
      if (await readout.getAttribute('aria-hidden') !== 'false') fail(`story ${key}`, 'readout remains aria-hidden');
      const title = (await page.locator('#nrsStoryTitle').textContent())?.trim();
      const rule = (await page.locator('#nrsStoryRule').textContent())?.trim();
      if (!title || !rule) fail(`story ${key}`, 'readout copy is incomplete');

      const portraitBox = await portrait.boundingBox();
      const fieldBox = await field.boundingBox();
      if (!stableBox(basePortrait, portraitBox)) fail(`story ${key}`, 'main portrait moves or scales during state change');
      if (!stableBox(baseField, fieldBox)) fail(`story ${key}`, 'decision-field container moves or scales during state change');

      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      if (overflow > 1) fail(`story ${key}`, `introduces ${overflow}px horizontal overflow`);

      opacities[key] = Number.parseFloat(await page.locator('.nrs-field-pixels').evaluate((el) => getComputedStyle(el).opacity));

      const readoutBox = await readout.boundingBox();
      for (const other of keys) {
        if (other === key) continue;
        const otherBox = await page.locator(`.nrs-story-node[data-story="${other}"]`).boundingBox();
        if (boxesOverlap(readoutBox, otherBox, 2)) fail(`story ${key}`, `readout overlaps the ${other} node hit area`);
      }

      await page.keyboard.press('Escape');
      await page.waitForTimeout(60);
    }

    if (!(Number.isFinite(opacities.problem) && Number.isFinite(opacities.signal) && opacities.signal < opacities.problem * .35)) {
      fail('Signal reduction', `pixel noise does not reduce enough: problem=${opacities.problem}, signal=${opacities.signal}`);
    } else {
      pass(`Signal reduces pixel noise from ${opacities.problem.toFixed(2)} to ${opacities.signal.toFixed(2)} opacity.`);
    }

    const signal = page.locator('.nrs-story-node[data-story="signal"]');
    try {
      await signal.click({ timeout: 1800 });
    } catch {
      await signal.focus();
      await page.keyboard.press('Enter');
    }
    await page.waitForTimeout(100);
    if (await visual.getAttribute('data-story-pinned') !== 'true') fail('story pinning', 'click/Enter does not pin Signal');
    await page.mouse.move(20, 200);
    await page.waitForTimeout(160);
    if (await visual.getAttribute('data-story-active') !== 'signal') fail('story pinning', 'pinned Signal resets when pointer leaves');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(120);
    if (await visual.getAttribute('data-story-pinned') !== 'false' || await visual.getAttribute('data-story-active')) fail('story pinning', 'Escape does not fully reset pinned state');

    const theme = page.locator('.theme-toggle-btn:visible').first();
    const beforeTheme = await page.evaluate(() => document.documentElement.dataset.theme || '');
    if (await theme.count() !== 1) {
      fail('theme', 'desktop theme toggle missing');
    } else {
      await theme.click();
      await page.waitForTimeout(100);
      const afterTheme = await page.evaluate(() => document.documentElement.dataset.theme || '');
      if (!afterTheme || afterTheme === beforeTheme) fail('theme', 'toggle does not change theme');
      for (const button of await buttonMetrics(page)) if (button.contrast < 4.5) fail('theme', `CTA contrast after switch is ${button.contrast.toFixed(2)}:1 for ${button.text}`);
      await page.reload({ waitUntil: 'networkidle' });
      const persisted = await page.evaluate(() => document.documentElement.dataset.theme || '');
      if (persisted !== afterTheme) fail('theme', `selection does not persist after reload (${afterTheme} -> ${persisted})`);
    }
  } catch (error) {
    fail('desktop fatal', error.message || error);
  } finally {
    await context.close();
  }
}

async function auditMobile(browser) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  try {
    await open(page, '/');
    for (const button of await buttonMetrics(page)) {
      if (!button.visible || !button.text) fail('mobile CTA', `not visibly labeled: ${button.href}`);
      if (button.height < 44) fail('mobile CTA', `${button.text} is only ${button.height.toFixed(1)}px high`);
      if (button.contrast < 4.5) fail('mobile CTA', `${button.text} contrast is ${button.contrast.toFixed(2)}:1`);
    }

    const geometry = await page.evaluate(() => {
      const visual = document.querySelector('.nrs-uploaded-visual')?.getBoundingClientRect();
      const portrait = document.querySelector('.nrs-original-portrait:not(.nrs-original-portrait-ghost)')?.getBoundingClientRect();
      const thesis = document.querySelector('.nrs-uploaded-thesis');
      const thesisStyle = thesis ? getComputedStyle(thesis) : null;
      return {
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        visual: visual ? { left: visual.left, right: visual.right, width: visual.width } : null,
        portrait: portrait ? { left: portrait.left, right: portrait.right, width: portrait.width } : null,
        thesisFont: thesisStyle ? Number.parseFloat(thesisStyle.fontSize) : null,
        thesisLineHeight: thesisStyle ? thesisStyle.lineHeight : null,
      };
    });
    if (geometry.overflow > 1) fail('mobile layout', `${geometry.overflow}px horizontal overflow`);
    if (!geometry.visual || !geometry.portrait) fail('mobile layout', 'portrait visual missing');
    if (geometry.visual && (geometry.visual.left < -2 || geometry.visual.right > 392)) fail('mobile layout', `visual escapes viewport: ${JSON.stringify(geometry.visual)}`);
    if (geometry.thesisFont !== null && geometry.thesisFont < 11) fail('mobile readability', `hero thesis is ${geometry.thesisFont}px; technical copy is too small for comfortable reading`);

    const visible = page.locator('.nrs-story-node:visible');
    const count = await visible.count();
    for (let i = 0; i < count; i += 1) {
      const node = visible.nth(i);
      const key = await node.getAttribute('data-story');
      const box = await node.boundingBox();
      if (box && (box.width < 44 || box.height < 44)) fail(`mobile story ${key}`, `hit target is ${box.width.toFixed(1)}x${box.height.toFixed(1)}px`);
    }
    if (count) {
      const first = visible.first();
      try {
        await first.tap({ timeout: 2000 });
        await page.waitForTimeout(100);
        if (await page.locator('.nrs-uploaded-visual').getAttribute('data-story-pinned') !== 'true') fail('mobile story tap', 'tap does not pin state');
      } catch (error) {
        fail('mobile story tap', `tap failed: ${(error.message || error).split('\n')[0]}`);
      }
    }
  } catch (error) {
    fail('mobile fatal', error.message || error);
  } finally {
    await context.close();
  }
}

async function auditReducedMotion(browser) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  try {
    await open(page, '/');
    const portrait = page.locator('.nrs-original-portrait:not(.nrs-original-portrait-ghost)');
    const before = await portrait.boundingBox();
    const node = page.locator('.nrs-story-node[data-story="state"]');
    await node.focus();
    await page.waitForTimeout(100);
    const after = await portrait.boundingBox();
    if (!stableBox(before, after)) fail('reduced motion', 'main portrait moves or scales');
    if (await page.locator('.nrs-uploaded-visual').getAttribute('data-story-active') !== 'state') fail('reduced motion', 'story meaning is removed instead of simplifying motion');
    if (await page.locator('#nrsStoryReadout').getAttribute('aria-hidden') !== 'false') fail('reduced motion', 'story feedback is hidden');
  } catch (error) {
    fail('reduced motion fatal', error.message || error);
  } finally {
    await context.close();
  }
}

async function auditExperienceLinks(browser) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  try {
    await open(page, '/about');
    const expected = new Map([
      ['Idealaya', 'https://idealaya.com/'],
      ['Mokshya Protocol', 'https://mokshya.io/'],
      ['Tegzy', 'https://www.tegzy.com.au/'],
      ['ESR Tech', 'https://esrtech.io/'],
      ['ThemeGrill', 'https://themegrill.com/'],
      ['Gurzu', 'https://gurzu.com/'],
    ]);
    const links = page.locator('.nrs-experience-list .nrs-company-link');
    if (await links.count() !== 6) fail('experience links', `expected 6 official company links, found ${await links.count()}`);
    const data = await links.evaluateAll((els) => els.map((el) => ({
      text: el.querySelector('strong')?.textContent?.trim() || '',
      href: el.href,
      target: el.target,
      rel: el.rel,
      aria: el.getAttribute('aria-label') || '',
    })));
    for (const [name, href] of expected) {
      const item = data.find((x) => x.text === name);
      if (!item) { fail('experience links', `missing ${name}`); continue; }
      if (item.href !== href) fail('experience links', `${name} points to ${item.href}, expected ${href}`);
      if (item.target !== '_blank') fail('experience links', `${name} does not open in a new tab`);
      if (!/\bnoopener\b/.test(item.rel) || !/\bnoreferrer\b/.test(item.rel)) fail('experience links', `${name} lacks noopener/noreferrer`);
      if (!item.aria) fail('experience links', `${name} lacks an accessible label`);
    }
    const first = links.first();
    await first.focus();
    const outlined = await first.evaluate((el) => {
      const s = getComputedStyle(el);
      return s.outlineStyle !== 'none' && Number.parseFloat(s.outlineWidth) >= 1;
    });
    if (!outlined) fail('experience links', 'keyboard focus is not visibly outlined');
  } catch (error) {
    fail('experience links fatal', error.message || error);
  } finally {
    await context.close();
  }
}

const browser = await chromium.launch({ headless: true });
await auditDesktop(browser);
await auditMobile(browser);
await auditReducedMotion(browser);
await auditExperienceLinks(browser);
await browser.close();

console.log(`[microinteraction-audit-v2] ${passes.length} explicit pass note(s)`);
for (const item of passes) console.log(`PASS: ${item}`);
if (failures.length) {
  console.error(`[microinteraction-audit-v2] ${failures.length} failure(s)\n${failures.map((x) => `- ${x}`).join('\n')}`);
  process.exit(1);
}
console.log('[microinteraction-audit-v2] All audited microinteraction and UX contracts passed.');
