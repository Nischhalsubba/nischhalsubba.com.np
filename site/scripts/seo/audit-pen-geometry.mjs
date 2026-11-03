/**
 * @fileoverview Native canvas parity for cooperative N geometry construction.
 * Purpose: Verify the scheduling change preserves every point and rendered animation state.
 * Responsibilities: Compare native SVG samples, cumulative timing and deterministic canvas pixels against synchronous construction.
 * Execution context: Chromium in the SEO profile CI job; no production writes.
 * Connected files: workspace-home/index.html, seo-evidence-audit.yml, profile-home.mjs.
 * Maintenance: The synchronous reference removes only the newly introduced scheduling boundary.
 */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
const html = fs.readFileSync('src/workspace-home/index.html', 'utf8');
const start = html.indexOf('  async function makePen(cv, opt) {');
const end = html.indexOf('\n\n  /* ---- About:', start);
assert.ok(start > 0 && end > start);
const current = html.slice(start, end).trim().replace('return { st, render, TOTAL };', 'return { st, render, TOTAL, geometry: { PTS, CUM, TIME_AT, ANCH } };');
const scheduling = 'if (PTS.length % 8 === 0) await new Promise(resolve => setTimeout(resolve, 0));';
assert.equal(current.split(scheduling).length, 2);
const reference = current.replace('async function makePen', 'function makePen').replace(scheduling, '');
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage();
  const result = await page.evaluate(/** Callback contract: Compare construction and canvas output using actual browser geometry. Inputs: async and synchronous source strings. Side effects: creates temporary canvases. Returns: parity counts; throws on any mismatch. */ async ({ current, reference }) => {
    /** Function contract: clamp. Purpose: Match the homepage bound operation. Inputs: value and bounds. Side effects: none. Returns: bounded value. */
    const clamp = (value, low = 0, high = 1) => Math.max(low, Math.min(high, value));
    const makeCurrent = new Function('clamp', 'RS', `return (${current})`)(clamp, () => 1);
    const makeReference = new Function('clamp', 'RS', `return (${reference})`)(clamp, () => 1);
    const canvases = [0, 1].map(/** Callback contract: Attach equal-sized native canvases. Inputs: ignored index. Side effects: appends canvas. Returns: element. */ () => { const cv = document.createElement('canvas'); cv.style.cssText = 'width:600px;height:700px'; document.body.append(cv); return cv; });
    const options = { /** Function contract: box. Purpose: Give both renderers identical bounds. Inputs: none. Side effects: none. Returns: fixed box. */ box: () => ({ x: 100, y: 100, w: 400, h: 450 }) };
    const first = makeReference(canvases[0], options);
    let yielded = false;
    setTimeout(() => { yielded = true; }, 0);
    const second = await makeCurrent(canvases[1], options);
    if (!yielded) throw new Error('Construction did not yield to pending work');
    if (JSON.stringify(first.geometry) !== JSON.stringify(second.geometry)) throw new Error('N samples or timing changed');
    const originalRandom = Math.random;
    let compared = 0;
    try {
      for (const lap of [0, 0.05, 0.2, 0.5, 0.85, 1]) {
        const pixels = [];
        for (const [index, pen] of [first, second].entries()) {
          let seed = 17;
          Math.random = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
          Object.assign(pen.st, { lap, heat: 0.8, fill: lap === 1 ? 1 : 0 });
          pen.render(); pixels.push(canvases[index].toDataURL());
        }
        if (pixels[0] !== pixels[1]) throw new Error(`Canvas pixels changed at lap ${lap}`);
        compared++;
      }
    } finally { Math.random = originalRandom; }
    return { samples: second.geometry.PTS.length, comparedStates: compared, yielded, nativePoints: first.geometry.PTS };
  }, { current, reference });
  console.log('[pen native points]', JSON.stringify(result.nativePoints));
  delete result.nativePoints;
  console.log('[pen geometry]', JSON.stringify(result));
} finally { await browser.close(); }
