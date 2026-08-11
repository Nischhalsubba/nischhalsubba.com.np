/**
 * @fileoverview scripts/browser-mobile-menu-expanded-audit.mjs
 * Purpose: Validate browser mobile menu expanded audit and fail with actionable diagnostics when the production contract is violated.
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
import fs from 'node:fs';
import path from 'node:path';

const base = process.env.AUDIT_BASE_URL || 'http://127.0.0.1:4173';
const routes = ['/', '/projects', '/services', '/about', '/contact', '/project-yarsha'];
const viewports = [
  [320, 700],
  [360, 800],
  [375, 812],
  [390, 844],
  [430, 932],
  [667, 375],
  [844, 390],
  [768, 1024],
  [1023, 768],
];
const failures = [];
const evidenceDir = path.resolve('tests', 'mobile-menu', 'results');
fs.mkdirSync(evidenceDir, { recursive: true });

const browser = await chromium.launch({ headless: true });

for (const [width, height] of viewports) {
  const context = await browser.newContext({ viewport: { width, height } });
  const page = await context.newPage();

  for (const route of routes) {
    try {
      const response = await page.goto(`${base}${route}`, { waitUntil: 'networkidle', timeout: 30000 });
      if (!response || response.status() >= 400) throw new Error(`HTTP ${response?.status() || 'none'}`);

      const button = page.locator('.mobile-nav-toggle');
      if (!(await button.isVisible())) throw new Error('mobile menu button is not visible');
      const buttonBox = await button.boundingBox();
      if (!buttonBox || buttonBox.width < 44 || buttonBox.height < 44) throw new Error(`menu target is ${buttonBox?.width || 0}x${buttonBox?.height || 0}`);

      const beforeScroll = await page.evaluate(   /** Callback contract: Perform the local callback step required by the immediately enclosing browser mobile menu expanded audit repository tool operation. Inputs: None; derives required state from its enclosing module/runtime context. Side effects: reads or updates DOM/browser state Returns: The selected `scrollY` value. */ () => window.scrollY);
      await button.click();
      await page.waitForTimeout(120);

      const state = await page.evaluate(   /** Callback contract: Perform the local callback step required by the immediately enclosing browser mobile menu expanded audit repository tool operation. Inputs: None; derives required state from its enclosing module/runtime context. Side effects: reads or updates DOM/browser state Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior. */ () => {
        
        
        /**
         * Function contract: visible
         * Purpose: Implement the visible responsibility owned by the browser mobile menu expanded audit repository tool.
         * Inputs: `element`
         * Side effects: No direct external side effect beyond invoked dependencies.
         * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
         */
        const visible = (element) => {
          if (!element) return false;
          const style = getComputedStyle(element);
          const rect = element.getBoundingClientRect();
          return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0' && rect.width > 0 && rect.height > 0;
        };
        
        
        /**
         * Function contract: box
         * Purpose: Implement the box responsibility owned by the browser mobile menu expanded audit repository tool.
         * Inputs: `element`
         * Side effects: No direct external side effect beyond invoked dependencies.
         * Returns: Computed expression result consumed by the enclosing operation.
         */
        const box = (element) => element ? element.getBoundingClientRect().toJSON() : null;
        const overlay = document.querySelector('.mobile-nav-overlay');
        const menu = document.querySelector('.mobile-nav-toggle');
        const brand = document.querySelector('.agent-mobile-brand');
        const theme = document.querySelector('.theme-toggle-btn, #theme-toggle');
        const drawerTheme = document.querySelector('.agent-mobile-theme-toggle');
        const links = [...document.querySelectorAll('.mobile-nav-links a')].map(   /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `link` Side effects: reads or updates DOM/browser state Returns: Computed expression result consumed by the enclosing operation. */ (link) => ({
          label: link.textContent.trim(),
          box: box(link),
          visible: visible(link),
        }));
        const overlayStyle = overlay ? getComputedStyle(overlay) : null;
        const menuStyle = menu ? getComputedStyle(menu) : null;
        return {
          bodyOpen: document.body.classList.contains('menu-open'),
          htmlOpen: document.documentElement.classList.contains('menu-open'),
          expanded: menu?.getAttribute('aria-expanded'),
          overlayHidden: overlay?.hidden,
          overlayVisible: visible(overlay),
          overlayBox: box(overlay),
          overlayOverflowY: overlayStyle?.overflowY || '',
          menuVisible: visible(menu),
          menuZ: Number.parseInt(menuStyle?.zIndex || '0', 10),
          overlayZ: Number.parseInt(overlayStyle?.zIndex || '0', 10),
          brandVisible: visible(brand),
          themeVisible: visible(theme),
          drawerThemeVisible: visible(drawerTheme),
          drawerThemeBox: box(drawerTheme),
          links,
          pageOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          bodyOverflow: getComputedStyle(document.body).overflow,
          viewportWidth: window.innerWidth,
          viewportHeight: window.innerHeight,
        };
      });

      if (!state.bodyOpen || !state.htmlOpen || state.expanded !== 'true') throw new Error('open-state attributes/classes are out of sync');
      if (state.overlayHidden || !state.overlayVisible || !state.overlayBox) throw new Error('expanded drawer is not visible');
      if (Math.abs(state.overlayBox.left) > 1 || Math.abs(state.overlayBox.top) > 1) throw new Error(`drawer is offset ${state.overlayBox.left},${state.overlayBox.top}`);
      if (Math.abs(state.overlayBox.width - width) > 2 || Math.abs(state.overlayBox.height - height) > 2) throw new Error(`drawer does not cover viewport: ${state.overlayBox.width}x${state.overlayBox.height}`);
      if (!['auto', 'scroll'].includes(state.overlayOverflowY)) throw new Error(`drawer overflow-y is ${state.overlayOverflowY}`);
      if (!state.menuVisible || state.menuZ <= state.overlayZ) throw new Error(`close control stacking is wrong: menu ${state.menuZ}, overlay ${state.overlayZ}`);
      if (state.brandVisible) throw new Error('mobile brand remains visible above expanded drawer');
      if (state.themeVisible) throw new Error('desktop theme control remains visible above expanded drawer');
      if (!state.drawerThemeVisible || !state.drawerThemeBox || state.drawerThemeBox.height < 44) throw new Error('drawer theme control is missing or too small');
      if (state.pageOverflow > 1) throw new Error(`horizontal overflow while menu is open: ${state.pageOverflow}px`);
      if (state.bodyOverflow !== 'hidden') throw new Error(`body scroll is not locked: ${state.bodyOverflow}`);

      for (const link of state.links) {
        if (!link.visible || !link.box) throw new Error(`menu link is not visible: ${link.label}`);
        if (link.box.left < -1 || link.box.right > width + 1) throw new Error(`menu link escapes viewport: ${link.label}`);
        if (link.box.height < 44) throw new Error(`menu link target below 44px: ${link.label} ${link.box.height}`);
      }

      await page.screenshot({
        path: path.join(evidenceDir, `${route.replace(/\W+/g, '-') || 'home'}-${width}x${height}.png`),
        fullPage: false,
      });

      await page.keyboard.press('Escape');
      await page.waitForTimeout(80);
      const closed = await page.evaluate(   /** Callback contract: Perform the local callback step required by the immediately enclosing browser mobile menu expanded audit repository tool operation. Inputs: None; derives required state from its enclosing module/runtime context. Side effects: reads or updates DOM/browser state Returns: Computed expression result consumed by the enclosing operation. */ () => ({
        bodyOpen: document.body.classList.contains('menu-open'),
        expanded: document.querySelector('.mobile-nav-toggle')?.getAttribute('aria-expanded'),
        hidden: document.querySelector('.mobile-nav-overlay')?.hidden,
        activeIsButton: document.activeElement === document.querySelector('.mobile-nav-toggle'),
        scrollY: window.scrollY,
      }));
      if (closed.bodyOpen || closed.expanded !== 'false' || !closed.hidden) throw new Error('Escape did not fully close the drawer');
      if (!closed.activeIsButton) throw new Error('focus did not return to the menu button');
      if (Math.abs(closed.scrollY - beforeScroll) > 2) throw new Error('opening the drawer changed page scroll position');
    } catch (error) {
      failures.push(`${width}x${height} ${route}: ${error.message}`);
    }
  }

  await context.close();
}

await browser.close();

if (failures.length) {
  console.error(`[mobile-menu-expanded-audit] ${failures.length} failure(s)\n${failures.map( /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `failure` Side effects: No direct external side effect beyond invoked dependencies. Returns: Computed expression result consumed by the enclosing operation. */ (failure) => `- ${failure}`).join('\n')}`);
  process.exit(1);
}

console.log(`[mobile-menu-expanded-audit] ${routes.length} routes passed expanded-menu checks across ${viewports.length} phone, tablet and landscape viewports.`);
