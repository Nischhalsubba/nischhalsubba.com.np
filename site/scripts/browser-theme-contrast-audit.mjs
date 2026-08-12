/**
 * @fileoverview scripts/browser-theme-contrast-audit.mjs
 * Purpose: Validate browser theme contrast audit and fail with actionable diagnostics when the production contract is violated.
 * Responsibilities:
 * - Operate deterministically on canonical source or build output so repeated runs produce stable results.
 * - Surface invalid input or contract drift as explicit failures instead of silently masking it.
 * - Keep path assumptions synchronized with repository manifests and source-layout ownership.
 * Execution context: Node.js CLI during development, generation, build, CI, or repository maintenance.
 * Connected files:
 * - docs/quality-gates.md
 * - package.json
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
import { chromium } from 'playwright';
import fs from 'node:fs';

const base = (process.env.AUDIT_BASE_URL || 'http://127.0.0.1:4173').replace(/\/$/, '');
const sitemapPath = 'dist/sitemap.xml';
const sitemap = fs.existsSync(sitemapPath) ? fs.readFileSync(sitemapPath, 'utf8') : '';
const discovered = [...sitemap.matchAll(/<loc>https?:\/\/[^/]+([^<]*)<\/loc>/gi)]
  .map( /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `match` Side effects: No direct external side effect beyond invoked dependencies. Returns: Boolean predicate result. */ (match) => match[1] || '/')
  .filter( /** Callback contract: Decide whether the current item remains in the filtered result consumed by the enclosing operation. Inputs: `route`, `index`, `array` Side effects: No direct external side effect beyond invoked dependencies. Returns: Boolean predicate result consumed by the enclosing collection lookup/filter. */ (route, index, array) => array.indexOf(route) === index);
const routes = discovered.length ? discovered : ['/', '/projects', '/services', '/about', '/contact', '/project-yarsha', '/blog/'];
const themes = ['light', 'dark'];
const viewports = [[390, 844], [1440, 1000]];
const failures = [];
let inspected = 0;

const browser = await chromium.launch({ headless: true });

for (const [width, height] of viewports) {
  const context = await browser.newContext({ viewport: { width, height } });
  const page = await context.newPage();

  for (const route of routes) {
    for (const theme of themes) {
      try {
        const response = await page.goto(`${base}${route}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
        if (!response || response.status() >= 400) throw new Error(`HTTP ${response?.status() || 'none'}`);

        await page.evaluate(   /** Callback contract: Perform the local callback step required by the immediately enclosing browser theme contrast audit repository tool operation. Inputs: `nextTheme` Side effects: reads or updates DOM/browser state Returns: Undefined; the function exists for the documented side effects, validation, or orchestration. */ (nextTheme) => {
          try { sessionStorage.setItem('nrs-theme-override', nextTheme); } catch {}
          document.documentElement.setAttribute('data-theme', nextTheme);
          document.documentElement.style.colorScheme = nextTheme;
        }, theme);
        await page.waitForTimeout(80);

        // The homepage story readout is intentionally hidden until a story node is
        // focused/hovered. Exercise one representative state so its tiny text is
        // audited when it is actually rendered, rather than scoring hidden text.
        if (route === '/') {
          const storyNode = page.locator('[data-story="problem"]').first();
          if (await storyNode.count()) {
            await storyNode.focus();
            await page.waitForTimeout(80);
          }
        }

        const result = await page.evaluate(   /** Callback contract: Perform the local callback step required by the immediately enclosing browser theme contrast audit repository tool operation. Inputs: None; derives required state from its enclosing module/runtime context. Side effects: reads or updates DOM/browser state Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior. */ () => {
          
          
          /**
           * Function contract: parseColor
           * Purpose: Convert color into the structured representation consumed by the browser theme contrast audit repository tool.
           * Inputs: `value`
           * Side effects: No direct external side effect beyond invoked dependencies.
           * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
           */
          const parseColor = (value) => {
            if (!value) return null;
            const match = value.match(/rgba?\(([^)]+)\)/i);
            if (!match) return null;
            const parts = match[1].split(/[\s,\/]+/).filter(Boolean).map(Number);
            if (parts.length < 3 || parts.slice(0, 3).some(Number.isNaN)) return null;
            return [parts[0], parts[1], parts[2], Number.isFinite(parts[3]) ? parts[3] : 1];
          };

          
          
          /**
           * Function contract: blend
           * Purpose: Implement the blend responsibility owned by the browser theme contrast audit repository tool.
           * Inputs: `top`, `bottom`
           * Side effects: No direct external side effect beyond invoked dependencies.
           * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
           */
          const blend = (top, bottom) => {
            const alpha = top[3] + bottom[3] * (1 - top[3]);
            if (alpha <= 0) return [255, 255, 255, 1];
            return [
              (top[0] * top[3] + bottom[0] * bottom[3] * (1 - top[3])) / alpha,
              (top[1] * top[3] + bottom[1] * bottom[3] * (1 - top[3])) / alpha,
              (top[2] * top[3] + bottom[2] * bottom[3] * (1 - top[3])) / alpha,
              alpha,
            ];
          };

          
          
          /**
           * Function contract: luminance
           * Purpose: Implement the luminance responsibility owned by the browser theme contrast audit repository tool.
           * Inputs: `[r, g, b]`
           * Side effects: No direct external side effect beyond invoked dependencies.
           * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
           */
          const luminance = ([r, g, b]) => {
            const linear = [r, g, b].map(   /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `channel` Side effects: No direct external side effect beyond invoked dependencies. Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior. */ (channel) => {
              const value = channel / 255;
              return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
            });
            return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
          };

          
          
          /**
           * Function contract: contrast
           * Purpose: Implement the contrast responsibility owned by the browser theme contrast audit repository tool.
           * Inputs: `a`, `b`
           * Side effects: No direct external side effect beyond invoked dependencies.
           * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
           */
          const contrast = (a, b) => {
            const first = luminance(a);
            const second = luminance(b);
            return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
          };

          
          
          /**
           * Function contract: isVisible
           * Purpose: Determine whether visible satisfies the condition represented by this browser theme contrast audit repository tool.
           * Inputs: `element`
           * Side effects: No direct external side effect beyond invoked dependencies.
           * Returns: Boolean indicating whether visible satisfies the documented condition.
           */
          const isVisible = (element) => {
            const rect = element.getBoundingClientRect();
            if (rect.width <= 0 || rect.height <= 0) return false;

            // Visibility is inherited from ancestors. Without this walk, text
            // inside an aria-hidden/opacity-zero panel is incorrectly treated as
            // visible and its effective foreground blends to a bogus 1:1 ratio.
            for (let node = element; node; node = node.parentElement) {
              const style = getComputedStyle(node);
              if (node.hidden
                || node.getAttribute('aria-hidden') === 'true'
                || style.display === 'none'
                || style.visibility === 'hidden'
                || Number.parseFloat(style.opacity || '1') <= 0.01) return false;
            }
            return true;
          };

          
          
          /**
           * Function contract: backgroundFor
           * Purpose: Implement the background for responsibility owned by the browser theme contrast audit repository tool.
           * Inputs: `element`
           * Side effects: No direct external side effect beyond invoked dependencies.
           * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
           */
          const backgroundFor = (element) => {
            const chain = [];
            for (let node = element; node; node = node.parentElement) chain.push(node);
            chain.reverse();
            let result = [255, 255, 255, 1];
            for (const node of chain) {
              const color = parseColor(getComputedStyle(node).backgroundColor);
              if (color && color[3] > 0) result = blend(color, result);
            }
            return result;
          };

          
          
          /**
           * Function contract: pathFor
           * Purpose: Implement the path for responsibility owned by the browser theme contrast audit repository tool.
           * Inputs: `element`
           * Side effects: reads or updates DOM/browser state
           * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
           */
          const pathFor = (element) => {
            if (element.id) return `#${element.id}`;
            const classes = [...element.classList].slice(0, 3).join('.');
            return `${element.tagName.toLowerCase()}${classes ? `.${classes}` : ''}`;
          };

          const failures = [];
          let count = 0;
          for (const element of document.querySelectorAll('body *')) {
            if (!isVisible(element)) continue;
            const directText = [...element.childNodes]
              .filter( /** Callback contract: Decide whether the current item remains in the filtered result consumed by the enclosing operation. Inputs: `node` Side effects: No direct external side effect beyond invoked dependencies. Returns: Boolean predicate result consumed by the enclosing collection lookup/filter. */ (node) => node.nodeType === Node.TEXT_NODE)
              .map( /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `node` Side effects: reads or updates DOM/browser state Returns: Boolean predicate result. */ (node) => node.textContent || '')
              .join(' ')
              .replace(/\s+/g, ' ')
              .trim();
            if (!directText) continue;

            const style = getComputedStyle(element);
            const background = backgroundFor(element);
            const fill = style.webkitTextFillColor && style.webkitTextFillColor !== 'currentcolor'
              ? parseColor(style.webkitTextFillColor)
              : null;
            const foreground = fill || parseColor(style.color);
            if (!foreground || foreground[3] <= 0.01) continue;

            let opacity = Number.parseFloat(style.opacity || '1');
            for (let parent = element.parentElement; parent; parent = parent.parentElement) {
              opacity *= Number.parseFloat(getComputedStyle(parent).opacity || '1');
            }
            const renderedForeground = blend([foreground[0], foreground[1], foreground[2], Math.min(1, foreground[3] * opacity)], background);
            const ratio = contrast(renderedForeground, background);
            const fontSize = Number.parseFloat(style.fontSize || '16');
            const weight = Number.parseInt(style.fontWeight || '400', 10) || 400;
            const isLarge = fontSize >= 24 || (fontSize >= 18.66 && weight >= 700);
            const minimum = isLarge ? 3 : 4.5;
            count += 1;

            if (ratio + 0.02 < minimum) {
              failures.push({
                selector: pathFor(element),
                text: directText.slice(0, 90),
                ratio: Number(ratio.toFixed(2)),
                minimum,
                fontSize: Number(fontSize.toFixed(1)),
                weight,
                color: style.color,
                background: getComputedStyle(element).backgroundColor,
              });
            }
          }
          return { count, failures };
        });

        inspected += result.count;
        for (const failure of result.failures) {
          failures.push(`${width}x${height} ${theme} ${route} ${failure.selector}: ${failure.ratio}:1 < ${failure.minimum}:1 | ${failure.text}`);
        }
      } catch (error) {
        failures.push(`${width}x${height} ${theme} ${route}: audit error: ${error.message}`);
      }
    }
  }

  await context.close();
}

await browser.close();

if (failures.length) {
  console.error(`[theme-contrast-audit] ${failures.length} failure(s) across ${inspected} visible text runs\n${failures.slice(0, 250).map( /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `failure` Side effects: No direct external side effect beyond invoked dependencies. Returns: Computed expression result consumed by the enclosing operation. */ (failure) => `- ${failure}`).join('\n')}`);
  if (failures.length > 250) console.error(`- … ${failures.length - 250} additional failure(s) omitted from console output`);
  process.exit(1);
}

console.log(`[theme-contrast-audit] ${routes.length} route(s) passed light/dark text contrast at mobile and desktop widths across ${inspected} visible text runs.`);