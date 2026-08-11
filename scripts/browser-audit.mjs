/**
 * @fileoverview scripts/browser-audit.mjs
 * Purpose: Validate browser audit and fail with actionable diagnostics when the production contract is violated.
 * Responsibilities:
 * - Operate deterministically on canonical source or build output so repeated runs produce stable results.
 * - Surface invalid input or contract drift as explicit failures instead of silently masking it.
 * - Keep path assumptions synchronized with repository manifests and source-layout ownership.
 * Execution context: Node.js CLI during development, generation, build, CI, or repository maintenance.
 * Connected files:
 * - package.json
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const base = process.env.AUDIT_BASE_URL || 'http://127.0.0.1:4173';
const xml = fs.readFileSync(path.resolve('dist/sitemap.xml'), 'utf8');
const routes = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map( /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `match` Side effects: No direct external side effect beyond invoked dependencies. Returns: The selected `pathname` value. */ (match) => new URL(match[1]).pathname);
const viewports = [[360, 800], [390, 844], [430, 932], [768, 1024], [1024, 768], [1280, 720], [1440, 900], [1920, 1080]];
const failures = [];
const browser = await chromium.launch({ headless: true });
const serviceRoutes = new Set(['/product-design-nepal', '/web3-ux-designer', '/saas-ux-designer', '/website-ux-design', '/figma-design-systems', '/ux-audit']);


/**
 * Function contract: isHtmlRoute
 * Purpose: Determine whether html route satisfies the condition represented by this browser audit repository tool.
 * Inputs: `route`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Boolean indicating whether html route satisfies the documented condition.
 */
function isHtmlRoute(route) {
  return !/\.(?:txt|json|xml|webmanifest)$/i.test(route);
}


/**
 * Function contract: isDetailRoute
 * Purpose: Determine whether detail route satisfies the condition represented by this browser audit repository tool.
 * Inputs: `route`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Boolean indicating whether detail route satisfies the documented condition.
 */
function isDetailRoute(route) {
  return /^\/project-[^/]+$/.test(route) || (route.startsWith('/blog/') && route !== '/blog/') || serviceRoutes.has(route);
}


/**
 * Function contract: isSameOrigin
 * Purpose: Determine whether same origin satisfies the condition represented by this browser audit repository tool.
 * Inputs: `url`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Boolean indicating whether same origin satisfies the documented condition.
 */
function isSameOrigin(url) {
  try {
    return new URL(url).origin === new URL(base).origin;
  } catch {
    return false;
  }
}


/**
 * Function contract: isCloudflareTelemetry
 * Purpose: Determine whether cloudflare telemetry satisfies the condition represented by this browser audit repository tool.
 * Inputs: `url`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Boolean indicating whether cloudflare telemetry satisfies the documented condition.
 */
function isCloudflareTelemetry(url) {
  try {
    const parsed = new URL(url, base);
    return parsed.origin === new URL(base).origin && /^\/cdn-cgi\/(?:rum|trace)(?:\/|$)/i.test(parsed.pathname);
  } catch {
    return false;
  }
}


/**
 * Function contract: isTurnstileResource
 * Purpose: Determine whether turnstile resource satisfies the condition represented by this browser audit repository tool.
 * Inputs: `url`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Boolean indicating whether turnstile resource satisfies the documented condition.
 */
function isTurnstileResource(url) {
  try {
    return new URL(url, base).hostname === 'challenges.cloudflare.com';
  } catch {
    return false;
  }
}


/**
 * Function contract: isAllowedConsoleMessage
 * Purpose: Determine whether allowed console message satisfies the condition represented by this browser audit repository tool.
 * Inputs: `message`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Boolean indicating whether allowed console message satisfies the documented condition.
 */
function isAllowedConsoleMessage(message) {
  const text = message.text();
  const locationUrl = message.location()?.url || '';
  if (message.type() === 'warning' && /third-party cookie|favicon/i.test(text)) return true;
  if (/Failed to load resource: the server responded with a status of 400/i.test(text) && isTurnstileResource(locationUrl)) return true;
  return false;
}

for (const [width, height] of viewports) {
  const context = await browser.newContext({ viewport: { width, height } });
  const page = await context.newPage();

  for (const route of routes) {
    const runtimeErrors = [];
    const failedRequests = [];
    const consoleErrors = [];

    
    /**
     * Function contract: onPageError
     * Purpose: Handle page error and coordinate the resulting browser audit repository tool state changes.
     * Inputs: `error`
     * Side effects: No direct external side effect beyond invoked dependencies.
     * Returns: Computed expression result consumed by the enclosing operation.
     */
    const onPageError = (error) => runtimeErrors.push(error.message || String(error));
    
    /**
     * Function contract: onRequestFailed
     * Purpose: Handle request failed and coordinate the resulting browser audit repository tool state changes.
     * Inputs: `request`
     * Side effects: No direct external side effect beyond invoked dependencies.
     * Returns: Undefined; the function exists for the documented side effects, validation, or orchestration.
     */
    const onRequestFailed = (request) => {
      const url = request.url();
      if (!isSameOrigin(url) || isCloudflareTelemetry(url)) return;
      failedRequests.push(`${request.method()} ${url} (${request.failure()?.errorText || 'failed'})`);
    };
    
    
    /**
     * Function contract: onConsole
     * Purpose: Handle console and coordinate the resulting browser audit repository tool state changes.
     * Inputs: `message`
     * Side effects: No direct external side effect beyond invoked dependencies.
     * Returns: Undefined; the function exists for the documented side effects, validation, or orchestration.
     */
    const onConsole = (message) => {
      if (message.type() === 'error' && !isAllowedConsoleMessage(message)) consoleErrors.push(message.text());
    };

    page.on('pageerror', onPageError);
    page.on('requestfailed', onRequestFailed);
    page.on('console', onConsole);

    try {
      const response = await page.goto(`${base}${route}`, { waitUntil: 'networkidle', timeout: 30000 });
      if (!response || response.status() >= 400) throw new Error(`HTTP ${response?.status() || 'none'}`);
      if (runtimeErrors.length) throw new Error(`page errors: ${runtimeErrors.join(' | ')}`);
      if (consoleErrors.length) throw new Error(`console errors: ${consoleErrors.join(' | ')}`);
      if (failedRequests.length) throw new Error(`failed same-origin requests: ${failedRequests.join(' | ')}`);
      if (!isHtmlRoute(route)) continue;

      const result = await page.evaluate(   /** Callback contract: Perform the local callback step required by the immediately enclosing browser audit repository tool operation. Inputs: None; derives required state from its enclosing module/runtime context. Side effects: reads or updates DOM/browser state Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior. */ () => {
        
        
        /**
         * Function contract: visible
         * Purpose: Implement the visible responsibility owned by the browser audit repository tool.
         * Inputs: `element`
         * Side effects: No direct external side effect beyond invoked dependencies.
         * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
         */
        const visible = (element) => {
          const style = getComputedStyle(element);
          const rect = element.getBoundingClientRect();
          return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
        };
        const ids = [...document.querySelectorAll('[id]')].map(   /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `element` Side effects: No direct external side effect beyond invoked dependencies. Returns: The selected `id` value. */ (element) => element.id).filter(Boolean);
        const css = [...document.querySelectorAll('link[rel="stylesheet"]')]
          .map(   /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `element` Side effects: No direct external side effect beyond invoked dependencies. Returns: Computed expression result consumed by the enclosing operation. */ (element) => element.getAttribute('href'))
          .filter(   /** Callback contract: Decide whether the current item remains in the filtered result consumed by the enclosing operation. Inputs: `href` Side effects: No direct external side effect beyond invoked dependencies. Returns: Boolean predicate result consumed by the enclosing collection lookup/filter. */ (href) => href && !/^https?:/i.test(href));
        const activeByVisibleNav = [...document.querySelectorAll('nav')]
          .filter(visible)
          .map(   /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `nav` Side effects: No direct external side effect beyond invoked dependencies. Returns: The selected `length` value. */ (nav) => [...nav.querySelectorAll('[aria-current="page"]')].filter(visible).length);
        const h1 = [...document.querySelectorAll('h1')].find(visible);
        const progress = document.querySelector('#nrs-scroll-progress');

        return {
          overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          h1Count: [...document.querySelectorAll('h1')].filter(visible).length,
          h1Top: h1?.getBoundingClientRect().top ?? null,
          duplicates: [...new Set(ids.filter(   /** Callback contract: Decide whether the current item remains in the filtered result consumed by the enclosing operation. Inputs: `id`, `index` Side effects: No direct external side effect beyond invoked dependencies. Returns: Boolean predicate result consumed by the enclosing collection lookup/filter. */ (id, index) => ids.indexOf(id) !== index))],
          broken: [...document.images].filter(   /** Callback contract: Decide whether the current item remains in the filtered result consumed by the enclosing operation. Inputs: `image` Side effects: No direct external side effect beyond invoked dependencies. Returns: Boolean predicate result consumed by the enclosing collection lookup/filter. */ (image) => image.complete && image.naturalWidth === 0).map(   /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `image` Side effects: No direct external side effect beyond invoked dependencies. Returns: Boolean predicate result. */ (image) => image.currentSrc || image.getAttribute('src')),
          footer: Boolean(document.querySelector('.site-footer')),
          css,
          activeByVisibleNav,
          breadcrumbs: document.querySelectorAll('nav[aria-label="Breadcrumb"]').length,
          legacyBackLinks: [...document.querySelectorAll('main a')].filter(   /** Callback contract: Decide whether the current item remains in the filtered result consumed by the enclosing operation. Inputs: `link` Side effects: reads or updates DOM/browser state Returns: Boolean predicate result consumed by the enclosing collection lookup/filter. */ (link) => /^\s*(?:←|&larr;)?\s*Back to/i.test(link.textContent || '')).length,
          progressOpacity: progress ? Number.parseFloat(getComputedStyle(progress).opacity) : 0,
        };
      });

      if (result.overflow > 1) throw new Error(`horizontal overflow ${result.overflow}px`);
      if (result.h1Count !== 1) throw new Error(`${result.h1Count} visible H1 elements`);
      if (result.duplicates.length) throw new Error(`duplicate IDs: ${result.duplicates.join(', ')}`);
      if (result.broken.length) throw new Error(`broken images: ${result.broken.join(', ')}`);
      if (!result.footer) throw new Error('missing footer');
      if (result.css.length !== 1 || !result.css[0].startsWith('/style.css')) throw new Error(`local CSS: ${result.css.join(', ')}`);
      if (result.activeByVisibleNav.some(   /** Callback contract: Evaluate whether the current item satisfies the enclosing existential condition. Inputs: `count` Side effects: No direct external side effect beyond invoked dependencies. Returns: Boolean predicate result consumed by the enclosing collection lookup/filter. */ (count) => count > 1)) throw new Error(`multiple active links in one visible navigation: ${result.activeByVisibleNav.join(', ')}`);
      if (result.progressOpacity > 0.05) throw new Error(`scroll progress visible at page top (${result.progressOpacity})`);
      if (isDetailRoute(route) && result.breadcrumbs !== 1) throw new Error(`${result.breadcrumbs} breadcrumb navigations`);
      if (isDetailRoute(route) && result.legacyBackLinks !== 0) throw new Error(`${result.legacyBackLinks} legacy back links`);
      if (width <= 430 && result.h1Top !== null && result.h1Top > Math.min(460, height * 0.55)) throw new Error(`mobile H1 begins too low at ${Math.round(result.h1Top)}px`);
    } catch (error) {
      failures.push(`${width}x${height} ${route}: ${error.message}`);
    } finally {
      page.off('pageerror', onPageError);
      page.off('requestfailed', onRequestFailed);
      page.off('console', onConsole);
    }
  }

  if (width <= 430) {
    try {
      await page.goto(base, { waitUntil: 'networkidle', timeout: 30000 });
      const toggle = page.locator('.mobile-nav-toggle');
      const overlay = page.locator('.mobile-nav-overlay');
      const focusables = overlay.locator('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])');

      if (await toggle.count() !== 1) throw new Error('expected exactly one mobile menu toggle');
      if (await overlay.count() !== 1) throw new Error('expected exactly one mobile menu overlay');
      const ready = await toggle.getAttribute('data-mobile-menu-ready');
      if (ready !== 'true') throw new Error(`runtime did not initialize mobile menu; data-mobile-menu-ready=${ready}`);

      await toggle.focus();
      await toggle.click();
      await page.waitForTimeout(100);

      if (await toggle.getAttribute('aria-expanded') !== 'true') throw new Error('menu did not open');
      if (await overlay.getAttribute('aria-hidden') !== 'false') throw new Error('open menu remains aria-hidden');
      if (await overlay.getAttribute('hidden') !== null) throw new Error('open menu retains native hidden attribute');
      if (!await page.evaluate(   /** Callback contract: Perform the local callback step required by the immediately enclosing browser audit repository tool operation. Inputs: None; derives required state from its enclosing module/runtime context. Side effects: reads or updates DOM/browser state Returns: Computed expression result consumed by the enclosing operation. */ () => document.querySelector('.mobile-nav-overlay')?.contains(document.activeElement))) {
        const active = await page.evaluate(   /** Callback contract: Perform the local callback step required by the immediately enclosing browser audit repository tool operation. Inputs: None; derives required state from its enclosing module/runtime context. Side effects: reads or updates DOM/browser state Returns: Boolean predicate result. */ () => document.activeElement?.outerHTML || 'none');
        throw new Error(`focus did not enter menu; active element: ${active}`);
      }
      if (!await page.evaluate(   /** Callback contract: Perform the local callback step required by the immediately enclosing browser audit repository tool operation. Inputs: None; derives required state from its enclosing module/runtime context. Side effects: reads or updates DOM/browser state Returns: The selected `inert` value. */ () => document.querySelector('main')?.inert)) throw new Error('background is not inert');

      const count = await focusables.count();
      if (!count) throw new Error('menu has no focusable controls');
      await focusables.nth(count - 1).focus();
      await page.keyboard.press('Tab');
      if (!await focusables.first().evaluate(   /** Callback contract: Perform the local callback step required by the immediately enclosing browser audit repository tool operation. Inputs: `element` Side effects: reads or updates DOM/browser state Returns: Boolean predicate result. */ (element) => element === document.activeElement)) throw new Error('focus trap did not wrap');

      await page.keyboard.press('Escape');
      await page.waitForTimeout(100);
      if (await toggle.getAttribute('aria-expanded') !== 'false') throw new Error('Escape did not close menu');
      if (await overlay.getAttribute('aria-hidden') !== 'true') throw new Error('closed menu is not aria-hidden');
      if (await overlay.getAttribute('hidden') === null) throw new Error('closed menu is not natively hidden');
      if (!await toggle.evaluate(   /** Callback contract: Perform the local callback step required by the immediately enclosing browser audit repository tool operation. Inputs: `element` Side effects: reads or updates DOM/browser state Returns: Boolean predicate result. */ (element) => element === document.activeElement)) throw new Error('focus did not return to toggle');
      if (await page.evaluate(   /** Callback contract: Perform the local callback step required by the immediately enclosing browser audit repository tool operation. Inputs: None; derives required state from its enclosing module/runtime context. Side effects: reads or updates DOM/browser state Returns: The selected `inert` value. */ () => document.querySelector('main')?.inert)) throw new Error('background remained inert');
      await page.keyboard.press('Tab');
      if (await page.evaluate(   /** Callback contract: Perform the local callback step required by the immediately enclosing browser audit repository tool operation. Inputs: None; derives required state from its enclosing module/runtime context. Side effects: reads or updates DOM/browser state Returns: Computed expression result consumed by the enclosing operation. */ () => document.querySelector('.mobile-nav-overlay')?.contains(document.activeElement))) throw new Error('closed menu remained keyboard reachable');
    } catch (error) {
      failures.push(`${width}x${height} mobile navigation: ${error.message}`);
    }
  }

  await context.close();
}

await browser.close();
if (failures.length) {
  console.error(`[browser-audit] ${failures.length} failure(s)\n${failures.map( /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `failure` Side effects: No direct external side effect beyond invoked dependencies. Returns: Computed expression result consumed by the enclosing operation. */ (failure) => `- ${failure}`).join('\n')}`);
  process.exit(1);
}
console.log(`[browser-audit] ${routes.length} routes passed across ${viewports.length} viewports.`);
