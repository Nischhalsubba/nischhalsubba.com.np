/**
 * @fileoverview scripts/browser-sticky-responsive-audit.mjs
 * Purpose: Node-based build, content transformation, QA, or maintenance tool for browser sticky responsive audit.
 * Responsibilities:
 * - Own the behavior/content implied by this file's single responsibility.
 * - Keep public routes, build contracts, and imported module boundaries stable unless the connected owners are updated together.
 * Execution context: Node.js CLI during local development, CI, build, or maintenance.
 * Connected files:
 * - .github/workflows/browser-audit.yml
 * - .github/workflows/production-qa.yml
 * - docs/repository/file-catalog.md
 * - package.json
 * Maintenance: Update this header when responsibility or dependencies change; generated/vendor files are documented at their source instead.
 */
import fs from 'node:fs';
import path from 'node:path';
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
const screenshotWidths = new Set([375, 768, 1024, 1440]);
const screenshotRoot = path.resolve('tests', 'sticky-responsive', 'results');
fs.rmSync(screenshotRoot, { recursive: true, force: true });
fs.mkdirSync(screenshotRoot, { recursive: true });

const failures = [];
const browser = await chromium.launch({ headless: true });

/**
 * Function contract: intersects
 * Purpose: Implements the intersects responsibility for this module.
 * Inputs: a, b.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function intersects(a, b) {
  if (!a || !b) return false;
  return !(a.right <= b.left || a.left >= b.right || a.bottom <= b.top || a.top >= b.bottom);
}

/**
 * Function contract: routeSlug
 * Purpose: Implements the route slug responsibility for this module.
 * Inputs: route.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function routeSlug(route) {
  return route === '/' ? 'home' : route.replace(/^\/+|\/+$/g, '').replaceAll('/', '-');
}

/**
 * Function contract: capture
 * Purpose: Implements the capture responsibility for this module.
 * Inputs: page, width, route, position.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
async function capture(page, width, route, position) {
  if (!screenshotWidths.has(width)) return;
  const target = path.join(screenshotRoot, `${width}-${routeSlug(route)}-${position}.png`);
  await page.screenshot({ path: target, fullPage: false });
}

for (const [width, height] of viewports) {
  const context = await browser.newContext({ viewport: { width, height } });
  const page = await context.newPage();

  for (const route of routes) {
    try {
      const response = await page.goto(`${base}${route}`, { waitUntil: 'networkidle', timeout: 30000 });
      if (!response || response.status() >= 400) throw new Error(`HTTP ${response?.status() || 'none'}`);
      await capture(page, width, route, 'top');

      const initial = await page.evaluate(/** Callback contract: Processes the callback step for page without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: may read or update browser DOM/state. Returns a value to the invoking API. */ () => {
        /**
         * Function contract: visible
         * Purpose: Implements the visible responsibility for this module.
         * Inputs: element.
         * Side effects: no obvious external side effect beyond invoked dependencies.
         * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
         */
        const visible = (element) => {
          if (!element) return false;
          const style = getComputedStyle(element);
          const rect = element.getBoundingClientRect();
          return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
        };
        /**
         * Function contract: rect
         * Purpose: Implements the rect responsibility for this module.
         * Inputs: element.
         * Side effects: no obvious external side effect beyond invoked dependencies.
         * Returns: no explicit value unless an invoked dependency throws/rejects.
         */
        const rect = (element) => element ? element.getBoundingClientRect().toJSON() : null;
        const root = document.querySelector('.agent-portfolio');
        const nav = document.querySelector('.nav-wrapper');
        const progress = document.querySelector('#agent-progress');
        const h1 = [...document.querySelectorAll('h1')].find(visible);
        const menu = document.querySelector('.mobile-nav-toggle');
        const desktopTheme = document.querySelector('.theme-toggle-btn');
        const mobileTheme = document.querySelector('.agent-mobile-theme-toggle');
        const brand = document.querySelector('.agent-mobile-brand') || document.querySelector('.agent-brand');
        const brandStrong = brand?.querySelector('strong') || null;
        const brandDetail = brand?.querySelector('span') || null;
        const fields = [...document.querySelectorAll('#contact-form input:not([type="hidden"]), #contact-form select, #contact-form textarea')]
          .filter(/** Callback contract: Processes the callback step for [...document.query selector all('#contact form input:not([type="hidden"]), #contact form select, #contact form textarea')] without leaking orchestration details to the caller. Inputs: field. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (field) => field.name !== '_honey' && visible(field))
          .map(/** Callback contract: Processes the callback step for [...document.query selector all('#contact form input:not([type="hidden"]), #contact form select, #contact form textarea')]
          .filter((field) => field.name !== ' honey' && visible(field)) without leaking orchestration details to the caller. Inputs: field. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (field) => ({
            tag: field.tagName,
            name: field.getAttribute('name') || field.id,
            height: field.getBoundingClientRect().height,
            width: field.getBoundingClientRect().width,
            fontSize: Number.parseFloat(getComputedStyle(field).fontSize),
          }));
        const importantButtons = [...document.querySelectorAll('.agent-btn, .mobile-nav-toggle, .theme-toggle-btn')]
          .filter(visible)
          .map(/** Callback contract: Processes the callback step for [...document.query selector all('.agent btn, .mobile nav toggle, .theme toggle btn')]
          .filter(visible) without leaking orchestration details to the caller. Inputs: element. Side effects: may read or update browser DOM/state. No explicit return contract. */ (element) => ({
            label: element.getAttribute('aria-label') || element.textContent?.trim().slice(0, 40) || element.className,
            width: element.getBoundingClientRect().width,
            height: element.getBoundingClientRect().height,
          }));
        const mediaOverflow = [...document.querySelectorAll('main img, main video, main iframe, main canvas')]
          .filter(visible)
          .filter(/** Callback contract: Processes the callback step for [...document.query selector all('main img, main video, main iframe, main canvas')]
          .filter(visible) without leaking orchestration details to the caller. Inputs: element. Side effects: may read or update browser DOM/state. Returns a value to the invoking API. */ (element) => {
            const box = element.getBoundingClientRect();
            return box.left < -1 || box.right > document.documentElement.clientWidth + 1;
          })
          .map(/** Callback contract: Processes the callback step for [...document.query selector all('main img, main video, main iframe, main canvas')]
          .filter(visible)
          .filter((element) => {
            const box = element.get bounding client rect();
            return box.left <  1 || box.right > document.document element.client width + 1;
          }) without leaking orchestration details to the caller. Inputs: element. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (element) => element.currentSrc || element.src || element.tagName);

        return {
          docWidth: document.documentElement.scrollWidth,
          viewportWidth: document.documentElement.clientWidth,
          navVisible: visible(nav),
          navPosition: nav ? getComputedStyle(nav).position : '',
          menuPosition: menu ? getComputedStyle(menu).position : '',
          brandPosition: brand ? getComputedStyle(brand).position : '',
          navRect: rect(nav),
          progressReady: progress?.dataset.stickyProgressReady || '',
          progressVisible: visible(progress),
          progressRect: rect(progress),
          progressValue: Number.parseFloat(root ? getComputedStyle(root).getPropertyValue('--agent-scroll') : '0'),
          h1Rect: rect(h1),
          menuVisible: visible(menu),
          menuRect: rect(menu),
          desktopThemeVisible: visible(desktopTheme),
          mobileThemeExists: Boolean(mobileTheme),
          brandVisible: visible(brand),
          brandRect: rect(brand),
          brandStrongVisible: visible(brandStrong),
          brandStrongRect: rect(brandStrong),
          brandDetailVisible: visible(brandDetail),
          brandDetailRect: rect(brandDetail),
          fields,
          importantButtons,
          mediaOverflow,
        };
      });

      if (initial.docWidth - initial.viewportWidth > 1) throw new Error(`horizontal overflow ${initial.docWidth - initial.viewportWidth}px`);
      if (width > 1023) {
        if (!initial.navVisible) throw new Error('desktop sticky navigation is not visible');
        if (!['fixed', 'sticky'].includes(initial.navPosition)) throw new Error(`navigation position is ${initial.navPosition || 'unset'}`);
        if (!initial.navRect || Math.abs(initial.navRect.top) > 1) throw new Error(`navigation is not pinned to viewport top: ${initial.navRect?.top ?? 'missing'}px`);
        if (initial.h1Rect && initial.h1Rect.top < initial.navRect.bottom - 2) throw new Error('first heading is obscured by sticky navigation');
      }
      if (!initial.progressVisible || !initial.progressRect || Math.abs(initial.progressRect.top) > 1) throw new Error('scroll progress is not fixed to the viewport top');
      if (initial.progressReady !== 'true') throw new Error('scroll progress runtime did not initialize');
      if (!Number.isFinite(initial.progressValue) || initial.progressValue < 0 || initial.progressValue > .04) throw new Error(`scroll progress has an invalid page-top value: ${initial.progressValue}`);
      if (initial.mediaOverflow.length) throw new Error(`media escapes viewport: ${initial.mediaOverflow.join(', ')}`);

      for (const button of initial.importantButtons) {
        if (width <= 767 && (button.width < 44 || button.height < 44)) {
          throw new Error(`mobile target too small: ${button.label} ${button.width.toFixed(2)}x${button.height.toFixed(2)}`);
        }
      }

      if (route === '/contact' && width <= 767) {
        for (const field of initial.fields) {
          if (field.width < 44 || field.height < 44) throw new Error(`contact field too small: ${field.name}`);
          if (field.fontSize < 16) throw new Error(`contact field ${field.name} uses ${field.fontSize}px text`);
        }
      }

      if (width <= 1023) {
        if (!initial.menuVisible || !initial.brandVisible) throw new Error('mobile/tablet sticky masthead is incomplete');
        if (!['fixed', 'sticky'].includes(initial.menuPosition) || !['fixed', 'sticky'].includes(initial.brandPosition)) throw new Error('mobile masthead controls are not pinned');
        if (initial.desktopThemeVisible) throw new Error('desktop theme control should move into the mobile drawer');
        if (!initial.mobileThemeExists) throw new Error('mobile drawer theme control is missing');
        if (intersects(initial.brandRect, initial.menuRect)) throw new Error('brand overlaps the mobile menu control');
        for (const box of [initial.menuRect, initial.brandRect]) {
          if (box.left < -1 || box.right > width + 1) throw new Error('mobile header control escapes viewport');
        }
        const mobileBottom = Math.max(initial.menuRect?.bottom || 0, initial.brandRect?.bottom || 0);
        if (initial.h1Rect && initial.h1Rect.top < mobileBottom - 2) throw new Error('first heading is obscured by the mobile masthead');
        if (width <= 430 && initial.brandStrongVisible && initial.brandDetailVisible && intersects(initial.brandStrongRect, initial.brandDetailRect)) {
          throw new Error('mobile brand name overlaps the product-designer label');
        }

        if (route === '/') {
          const themeBefore = await page.evaluate(/** Callback contract: Processes the callback step for page without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: may read or update browser DOM/state. No explicit return contract. */ () => document.documentElement.dataset.theme || '');
          await page.click('.mobile-nav-toggle');
          await page.waitForTimeout(80);
          const drawerControl = await page.evaluate(/** Callback contract: Processes the callback step for page without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: may read or update browser DOM/state. Returns a value to the invoking API. */ () => {
            const element = document.querySelector('.agent-mobile-theme-toggle');
            if (!element) return null;
            const style = getComputedStyle(element);
            const rect = element.getBoundingClientRect();
            return {
              visible: style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0,
              width: rect.width,
              height: rect.height,
            };
          });
          if (!drawerControl?.visible) throw new Error('mobile drawer theme control is not visible when navigation opens');
          if (drawerControl.width < 44 || drawerControl.height < 44) throw new Error('mobile drawer theme control is below the 44px target');
          await page.click('.agent-mobile-theme-toggle');
          await page.waitForTimeout(40);
          const themeAfter = await page.evaluate(/** Callback contract: Processes the callback step for page without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: may read or update browser DOM/state. No explicit return contract. */ () => document.documentElement.dataset.theme || '');
          if (themeBefore === themeAfter) throw new Error('mobile drawer theme control did not switch theme');
          await page.keyboard.press('Escape');
          await page.waitForTimeout(40);
        }
      }

      const scrollable = await page.evaluate(/** Callback contract: Processes the callback step for page without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: may read or update browser DOM/state. No explicit return contract. */ () => document.documentElement.scrollHeight - window.innerHeight);
      if (scrollable > 100) {
        await page.evaluate(/** Callback contract: Processes the callback step for page without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: may read or update browser DOM/state. No explicit return contract. */ () => window.scrollTo({ top: Math.round((document.documentElement.scrollHeight - window.innerHeight) * .58), behavior: 'instant' }));
        await page.waitForTimeout(100);
        await capture(page, width, route, 'scroll58');

        const scrolled = await page.evaluate(/** Callback contract: Processes the callback step for page without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: may read or update browser DOM/state. Returns a value to the invoking API. */ () => {
          const root = document.querySelector('.agent-portfolio');
          const nav = document.querySelector('.nav-wrapper');
          const progress = document.querySelector('#agent-progress');
          const menu = document.querySelector('.mobile-nav-toggle');
          const brand = document.querySelector('.agent-mobile-brand') || document.querySelector('.agent-brand');
          const navRect = nav?.getBoundingClientRect();
          const menuRect = menu?.getBoundingClientRect();
          const brandRect = brand?.getBoundingClientRect();
          const progressRect = progress?.getBoundingClientRect();
          return {
            navTop: navRect?.top ?? null,
            menuTop: menuRect?.top ?? null,
            brandTop: brandRect?.top ?? null,
            progressTop: progressRect?.top ?? null,
            progressValue: Number.parseFloat(root ? getComputedStyle(root).getPropertyValue('--agent-scroll') : '0'),
            overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          };
        });

        if (width > 1023) {
          if (scrolled.navTop === null || Math.abs(scrolled.navTop) > 1) throw new Error(`navigation moved while scrolling: top=${scrolled.navTop}`);
        } else {
          if (scrolled.menuTop === null || scrolled.brandTop === null) throw new Error('mobile masthead disappeared while scrolling');
          if (Math.abs(scrolled.menuTop - initial.menuRect.top) > 1 || Math.abs(scrolled.brandTop - initial.brandRect.top) > 1) throw new Error('mobile masthead moved while scrolling');
        }
        if (scrolled.progressTop === null || Math.abs(scrolled.progressTop) > 1) throw new Error('scroll progress moved away from viewport top');
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
  console.error(`[sticky-responsive-audit] ${failures.length} failure(s)\n${failures.map(/** Callback contract: Processes the callback step for failures without leaking orchestration details to the caller. Inputs: failure. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (failure) => `- ${failure}`).join('\n')}`);
  process.exit(1);
}

console.log(`[sticky-responsive-audit] ${routes.length} critical routes passed across ${viewports.length} portrait, landscape, tablet, and desktop viewports. Evidence: ${screenshotRoot}`);