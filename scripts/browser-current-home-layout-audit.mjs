import { chromium } from 'playwright';

const base = process.env.AUDIT_BASE_URL || 'http://127.0.0.1:4173';
const failures = [];
const browser = await chromium.launch({ headless: true });

async function check(viewport) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  try {
    const response = await page.goto(`${base}/`, { waitUntil: 'networkidle', timeout: 30000 });
    if (!response || response.status() >= 400) throw new Error(`HTTP ${response?.status() || 'none'}`);
    const result = await page.evaluate(() => {
      const section = document.querySelector('.nrs-home-habits');
      const cards = [...document.querySelectorAll('.nrs-home-habit')];
      const heading = document.querySelector('#practice-heading');
      const rects = cards.map((card) => {
        const r = card.getBoundingClientRect();
        return { x: r.x, y: r.y, width: r.width, height: r.height };
      });
      return {
        section: !!section,
        heading: heading?.textContent?.trim() || '',
        count: cards.length,
        labels: cards.map((card) => card.querySelector('.agent-meta')?.textContent?.trim() || ''),
        rects,
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      };
    });
    if (!result.section) throw new Error('current Three habits section is missing');
    if (result.count !== 3) throw new Error(`expected 3 current habit cards, found ${result.count}`);
    if (!result.heading.startsWith('Three habits')) throw new Error(`unexpected section heading: ${result.heading}`);
    if (result.overflow > 1) throw new Error(`${result.overflow}px horizontal overflow`);
    if (viewport.width > 900) {
      const topDelta = Math.max(...result.rects.map((r) => r.y)) - Math.min(...result.rects.map((r) => r.y));
      if (topDelta > 2) throw new Error(`desktop habit cards are vertically staggered by ${topDelta.toFixed(1)}px`);
      const widths = result.rects.map((r) => r.width);
      if (Math.max(...widths) - Math.min(...widths) > 3) throw new Error('desktop habit columns are not balanced');
    } else {
      for (let i = 1; i < result.rects.length; i += 1) {
        if (result.rects[i].y <= result.rects[i - 1].y) throw new Error('mobile habit cards do not stack in reading order');
      }
    }
  } catch (error) {
    failures.push(`${viewport.width}x${viewport.height}: ${error.message || error}`);
  } finally {
    await context.close();
  }
}

await check({ width: 1440, height: 900 });
await check({ width: 768, height: 1024 });
await check({ width: 390, height: 844 });
await browser.close();

if (failures.length) {
  console.error(`[current-home-layout-audit] ${failures.length} failure(s)\n${failures.map((x) => `- ${x}`).join('\n')}`);
  process.exit(1);
}
console.log('[current-home-layout-audit] Three-habit homepage layout passed desktop, tablet, and mobile checks.');
