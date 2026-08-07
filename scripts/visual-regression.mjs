import fs from 'node:fs';
import path from 'node:path';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import { chromium } from 'playwright';

const base = process.env.AUDIT_BASE_URL || 'http://127.0.0.1:4173';
const update = process.env.UPDATE_VISUAL_BASELINES === '1';
const maximumDifferenceRatio = Number(process.env.VISUAL_MAX_DIFF_RATIO || 0.005);
const root = path.resolve('tests', 'visual');
const baselineDirectory = path.join(root, 'baselines');
const resultDirectory = path.join(root, 'results');
const routes = [
  ['home', '/'],
  ['work', '/projects'],
  ['services', '/services'],
  ['about', '/about'],
  ['writing', '/blog/'],
  ['contact', '/contact'],
  ['product-design', '/product-design-nepal'],
  ['yarsha', '/project-yarsha'],
  ['mokshya', '/project-mokshya'],
];
const viewports = [
  ['mobile', { width: 390, height: 844 }],
  ['desktop', { width: 1440, height: 900 }],
];
const themes = ['light', 'dark'];

if (update) fs.rmSync(baselineDirectory, { recursive: true, force: true });
fs.mkdirSync(baselineDirectory, { recursive: true });
fs.rmSync(resultDirectory, { recursive: true, force: true });
fs.mkdirSync(resultDirectory, { recursive: true });

const browser = await chromium.launch({ headless: true });
const failures = [];

for (const theme of themes) {
  for (const [viewportName, viewport] of viewports) {
    const context = await browser.newContext({
      viewport,
      colorScheme: theme,
      deviceScaleFactor: 1,
      reducedMotion: 'reduce',
    });
    const page = await context.newPage();

    await page.route('**/*', async (route) => {
      const url = new URL(route.request().url());
      if (url.origin === new URL(base).origin || url.protocol === 'data:' || url.protocol === 'blob:') return route.continue();
      return route.abort();
    });

    for (const [routeName, routePath] of routes) {
      const name = `${routeName}-${viewportName}-${theme}.png`;
      const baselinePath = path.join(baselineDirectory, name);
      const actualPath = path.join(resultDirectory, name);
      const diffPath = path.join(resultDirectory, `${routeName}-${viewportName}-${theme}-diff.png`);

      try {
        const response = await page.goto(`${base}${routePath}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
        if (!response || response.status() >= 400) throw new Error(`HTTP ${response?.status() || 'none'}`);
        await page.evaluate(async (resolvedTheme) => {
          await document.fonts?.ready;
          document.documentElement.dataset.theme = resolvedTheme;
          document.documentElement.style.colorScheme = resolvedTheme;
          document.querySelectorAll('iframe, video').forEach((element) => element.setAttribute('hidden', ''));
          const turnstile = document.querySelector('.nrs-turnstile');
          if (turnstile) {
            turnstile.innerHTML = '<div aria-hidden="true">Anti-spam verification</div>';
            turnstile.setAttribute('data-visual-placeholder', 'true');
          }
        }, theme);
        await page.addStyleTag({ content: `
          *, *::before, *::after { animation: none !important; caret-color: transparent !important; transition: none !important; }
          html { scroll-behavior: auto !important; }
          .reveal-on-scroll { opacity: 1 !important; transform: none !important; }
          [data-agent-reveal] { opacity: 1 !important; transform: none !important; }
          [data-visual-placeholder="true"] { min-height: 68px; display: grid; place-items: center; border: 1px solid var(--border-faint); border-radius: 0; }
        ` });
        await page.waitForTimeout(250);
        await page.screenshot({ path: actualPath, fullPage: true, animations: 'disabled' });

        if (update) {
          fs.copyFileSync(actualPath, baselinePath);
          continue;
        }
        if (!fs.existsSync(baselinePath)) throw new Error(`missing baseline ${name}`);

        const expected = PNG.sync.read(fs.readFileSync(baselinePath));
        const actual = PNG.sync.read(fs.readFileSync(actualPath));
        if (expected.width !== actual.width || expected.height !== actual.height) {
          throw new Error(`dimensions changed from ${expected.width}x${expected.height} to ${actual.width}x${actual.height}`);
        }

        const diff = new PNG({ width: actual.width, height: actual.height });
        const differentPixels = pixelmatch(expected.data, actual.data, diff.data, actual.width, actual.height, {
          threshold: 0.12,
          includeAA: false,
        });
        const ratio = differentPixels / (actual.width * actual.height);
        if (ratio > maximumDifferenceRatio) {
          fs.writeFileSync(diffPath, PNG.sync.write(diff));
          throw new Error(`${(ratio * 100).toFixed(3)}% pixels differ; allowed ${(maximumDifferenceRatio * 100).toFixed(3)}%`);
        }
        fs.rmSync(actualPath, { force: true });
      } catch (error) {
        failures.push(`${name}: ${error.message}`);
      }
    }
    await context.close();
  }
}

await browser.close();
if (failures.length) {
  console.error(`[visual-regression] ${failures.length} failure(s)\n${failures.map((failure) => `- ${failure}`).join('\n')}`);
  process.exit(1);
}
console.log(`[visual-regression] ${routes.length * viewports.length * themes.length} snapshots ${update ? 'updated' : 'passed'} at ${(maximumDifferenceRatio * 100).toFixed(2)}% tolerance.`);
