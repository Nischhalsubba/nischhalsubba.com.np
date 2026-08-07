import { chromium } from 'playwright';

const base = process.env.AUDIT_BASE_URL || 'http://127.0.0.1:4173';
const routes = ['/', '/projects', '/services', '/about', '/blog/', '/contact', '/project-yarsha'];
const viewports = [
  [320, 700],
  [360, 800],
  [375, 812],
  [390, 844],
  [430, 932],
  [667, 375],
  [844, 390],
  [768, 1024],
  [1024, 768],
  [1440, 900],
];
const failures = [];
const browser = await chromium.launch({ headless: true });

function intersects(a, b) {
  return !(a.right <= b.left || a.left >= b.right || a.bottom <= b.top || a.top >= b.bottom);
}

for (const [width, height] of viewports) {
  const context = await browser.newContext({ viewport: { width, height } });
  const page = await context.newPage();

  for (const route of routes) {
    try {
      const response = await page.goto(`${base}${route}`, { waitUntil: 'networkidle', timeout: 30000 });
      if (!response || response.status() >= 400) throw new Error(`HTTP ${response?.status() || 'none'}`);

      const initial = await page.evaluate(() => {
        const visible = (element) => {
          if (!element) return false;
          const style = getComputedStyle(element);
          const rect = element.getBoundingClientRect();
          return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
        };
        const rect = (element) => element ? element.getBoundingClientRect().toJSON() : null;
        const nav = document.querySelector('.nav-wrapper');
        const progress = document.querySelector('#nrs-scroll-progress');
        const h1 = [...document.querySelectorAll('h1')].find(visible);
        const menu = document.querySelector('.mobile-nav-toggle');
        const theme = document.querySelector('.theme-toggle-btn');
        const brand = document.querySelector('.agent-brand');
        const fields = [...document.querySelectorAll('#contact-form input:not([type="hidden"]), #contact-form select, #contact-form textarea')]
          .filter(visible)
          .map((field) => ({
            tag: field.tagName,
            name: field.getAttribute('name') || field.id,
            height: field.getBoundingClientRect().height,
            width: field.getBoundingClientRect().width,
            fontSize: Number.parseFloat(getComputedStyle(field).fontSize),
          }));
        const importantButtons = [...document.querySelectorAll('.agent-btn, .mobile-nav-toggle, .theme-toggle-btn')]
          .filter(visible)
          .map((element) => ({
            label: element.getAttribute('aria-label') || element.textContent?.trim().slice(0, 40) || element.className,
            width: element.getBoundingClientRect().width,
            height: element.getBoundingClientRect().height,
          }));
        const mediaOverflow = [...document.querySelectorAll('main img, main video, main iframe, main canvas')]
          .filter(visible)
          .filter((element) => {
            const box = element.getBoundingClientRect();
            return box.left < -1 || box.right > document.documentElement.clientWidth + 1;
          })
          .map((element) => element.currentSrc || element.src || element.tagName);

        return {
          docWidth: document.documentElement.scrollWidth,
          viewportWidth: document.documentElement.clientWidth,
          navVisible: visible(nav),
          navPosition: nav ? getComputedStyle(nav).position : '',
          navRect: rect(nav),
          progressReady: progress?.dataset.stickyProgressReady || '',
          progressOpacity: progress ? Number.parseFloat(getComputedStyle(progress).opacity) : -1,
          progressRect: rect(progress),
          h1Rect: rect(h1),
          menuVisible: visible(menu),
          menuRect: rect(menu),
          themeVisible: visible(theme),
          themeRect: rect(theme),
          brandVisible: visible(brand),
          brandRect: rect(brand),
          fields,
          importantButtons,
          mediaOverflow,
        };
      });

      if (initial.docWidth - initial.viewportWidth > 1) throw new Error(`horizontal overflow ${initial.docWidth - initial.viewportWidth}px`);
      if (!initial.navVisible) throw new Error('sticky navigation is not visible');
      if (!['fixed', 'sticky'].includes(initial.navPosition)) throw new Error(`navigation position is ${initial.navPosition || 'unset'}`);
      if (!initial.navRect || Math.abs(initial.navRect.top - 3) > 2) throw new Error(`navigation top is ${initial.navRect?.top ?? 'missing'}px, expected 3px`);
      if (!initial.progressRect || Math.abs(initial.progressRect.top) > 1) throw new Error('scroll progress is not fixed to the viewport top');
      if (initial.progressReady !== 'true') throw new Error('scroll progress runtime did not initialize');
      if (initial.progressOpacity > 0.05) throw new Error(`scroll progress should be quiet at page top, opacity=${initial.progressOpacity}`);
      if (initial.h1Rect && initial.h1Rect.top < initial.navRect.bottom - 2) throw new Error('first heading is obscured by sticky navigation');
      if (initial.mediaOverflow.length) throw new Error(`media escapes viewport: ${initial.mediaOverflow.join(', ')}`);

      for (const button of initial.importantButtons) {
        if (width <= 767 && (button.width < 44 || button.height < 44)) {
          throw new Error(`mobile target too small: ${button.label} ${Math.round(button.width)}x${Math.round(button.height)}`);
        }
      }

      if (route === '/contact' && width <= 767) {
        for (const field of initial.fields) {
          if (field.width < 44 || field.height < 44) throw new Error(`contact field too small: ${field.name}`);
          if (field.fontSize < 16) throw new Error(`contact field ${field.name} uses ${field.fontSize}px text`);
        }
      }

      if (width <= 1023) {
        if (!initial.menuVisible || !initial.themeVisible || !initial.brandVisible) throw new Error('mobile/tablet header controls are incomplete');
        if (intersects(initial.menuRect, initial.themeRect)) throw new Error('menu and theme controls overlap');
        if (intersects(initial.brandRect, initial.menuRect) || intersects(initial.brandRect, initial.themeRect)) throw new Error('brand overlaps mobile header controls');
        for (const box of [initial.menuRect, initial.themeRect, initial.brandRect]) {
          if (box.left < -1 || box.right > width + 1) throw new Error('mobile header control escapes viewport');
        }
      }

      const scrollable = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);
      if (scrollable > 100) {
        await page.evaluate(() => window.scrollTo({ top: Math.round((document.documentElement.scrollHeight - window.innerHeight) * .58), behavior: 'instant' }));
        await page.waitForTimeout(100);

        const scrolled = await page.evaluate(() => {
          const nav = document.querySelector('.nav-wrapper');
          const progress = document.querySelector('#nrs-scroll-progress');
          const navRect = nav?.getBoundingClientRect();
          const progressRect = progress?.getBoundingClientRect();
          return {
            navTop: navRect?.top ?? null,
            progressTop: progressRect?.top ?? null,
            progressOpacity: progress ? Number.parseFloat(getComputedStyle(progress).opacity) : 0,
            progressValue: Number.parseFloat(progress?.dataset.progress || '0'),
            overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          };
        });

        if (scrolled.navTop === null || Math.abs(scrolled.navTop - 3) > 2) throw new Error(`navigation moved while scrolling: top=${scrolled.navTop}`);
        if (scrolled.progressTop === null || Math.abs(scrolled.progressTop) > 1) throw new Error('scroll progress moved away from viewport top');
        if (scrolled.progressOpacity < .9) throw new Error(`scroll progress did not become visible: opacity=${scrolled.progressOpacity}`);
        if (scrolled.progressValue < .45 || scrolled.progressValue > .7) throw new Error(`scroll progress value is implausible: ${scrolled.progressValue}`);
        if (scrolled.overflow > 1) throw new Error(`horizontal overflow after scroll ${scrolled.overflow}px`);
      }
    } catch (error) {
      failures.push(`${width}x${height} ${route}: ${error.message}`);
    }
  }

  await context.close();
}

await browser.close();
if (failures.length) {
  console.error(`[sticky-responsive-audit] ${failures.length} failure(s)\n${failures.map((failure) => `- ${failure}`).join('\n')}`);
  process.exit(1);
}

console.log(`[sticky-responsive-audit] ${routes.length} critical routes passed across ${viewports.length} portrait, landscape, tablet, and desktop viewports.`);
