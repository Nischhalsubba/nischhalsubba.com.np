/**
 * @fileoverview Repeatable portfolio accessibility and performance evidence.
 * Purpose: Produce dated axe results and three-run Lighthouse distributions without claiming field CWV.
 * Responsibilities: Audit representative templates, verify screenshot controls and save full reports.
 * Execution context: Chromium in local QA or GitHub Actions, against a separately started preview.
 * Connected files: seo-evidence-audit.yml, package.json, curated-evidence.cjs.
 * Maintenance: Do not turn lab scores into indexing claims or suppress reproducible accessibility failures.
 */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
const base = (process.env.AUDIT_BASE_URL || 'http://127.0.0.1:4173').replace(/\/$/, '');
const output = process.env.AUDIT_OUTPUT || 'tests/seo-evidence/results';
fs.mkdirSync(output, { recursive:true });
const routes = ['/', '/projects', '/project-orkest', '/services', '/blog/', '/blog/figma-handoff-notes-for-developers'];
const failures = []; const accessibility = []; const performance = [];
if (!process.argv.includes('--performance-only')) {
const browser = await chromium.launch({headless:true});
try {
  for (const width of [320,375,390,768,1024,1440,1920]) {
    const context = await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});
    const page = await context.newPage();
    for (const route of routes) {
      const response = await page.goto(base+route,{waitUntil:'networkidle'});
      assert.ok(response.ok(), `${route}: HTTP ${response.status()}`);
      await page.evaluate(/** Callback contract: Wait for loaded fonts before measuring settled layout. Inputs: none. Side effects: none. Returns: font readiness. */ () => document.fonts.ready);
      const overflow = await page.evaluate(/** Callback contract: Measure page-level reflow. Inputs: none. Side effects: none. Returns: overflow in CSS pixels. */ () => document.documentElement.scrollWidth-innerWidth);
      if (overflow>2) failures.push(`${width}px ${route}: ${overflow}px overflow`);
      if ([390,1440].includes(width)) {
        const result = await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
        accessibility.push({route,width,violations:result.violations,incomplete:result.incomplete,passes:result.passes.length});
        for (const violation of result.violations) failures.push(`${width}px ${route}: ${violation.id}: ${violation.nodes.map(node=>node.target.join(' ')).join('; ')}`);
      }
      if (route.includes('project-orkest') && width===390) {
        const figure = page.locator('.workspace-evidence-figure').first(); await figure.scrollIntoViewIfNeeded();
        await figure.locator('button').click(); await page.locator('#mediaPreview').waitFor({state:'visible'});
        await page.keyboard.press('Escape');
        assert.equal(await page.locator('#mediaPreview').evaluate(/** Callback contract: Read native modal state. Inputs: dialog. Side effects: none. Returns: open flag. */ dialog=>dialog.open),false);
        assert.equal(await figure.locator('button').evaluate(/** Callback contract: Verify focus restoration to the image trigger. Inputs: button. Side effects: none. Returns: focus equality. */ button=>button===document.activeElement),true);
        const before=page.url();await page.keyboard.press('w');assert.equal(page.url(),before,'Single character must not navigate');
      }
      if ([320,390,1440].includes(width)) await page.screenshot({path:path.join(output,`${width}-${route.replaceAll('/','_')||'home'}.png`),fullPage:true});
    }
    await context.close();
  }
} finally {await browser.close();}
fs.writeFileSync(path.join(output,'accessibility.json'),JSON.stringify({base,checkedAt:new Date().toISOString(),results:accessibility,failures},null,2));
}
if (!process.argv.includes('--axe-only')) {
  const chrome=await chromeLauncher.launch({chromePath:chromium.executablePath(),chromeFlags:['--headless','--no-sandbox','--disable-dev-shm-usage']});
  try {
    for(const device of ['mobile','desktop']) for(const route of routes) {
      const runs=[];
      for(let iteration=1;iteration<=3;iteration++) {
        const report=await lighthouse(base+route,{port:chrome.port,output:'json',logLevel:'error',onlyCategories:['performance','accessibility','best-practices','seo'],...(device==='desktop'?{formFactor:'desktop',screenEmulation:{mobile:false,width:1440,height:900,deviceScaleFactor:1,disabled:false},throttling:{rttMs:40,throughputKbps:10240,cpuSlowdownMultiplier:1,requestLatencyMs:0,downloadThroughputKbps:0,uploadThroughputKbps:0}}:{})});
        const lhr=report.lhr;const metrics={iteration,performance:lhr.categories.performance.score*100,accessibility:lhr.categories.accessibility.score*100,seo:lhr.categories.seo.score*100,lcp:lhr.audits['largest-contentful-paint'].numericValue,cls:lhr.audits['cumulative-layout-shift'].numericValue,tbt:lhr.audits['total-blocking-time'].numericValue,lighthouseVersion:lhr.lighthouseVersion,fetchTime:lhr.fetchTime};
        runs.push(metrics);fs.writeFileSync(path.join(output,`${device}-${route.replaceAll('/','_')||'home'}-${iteration}.json`),report.report);
        console.log(JSON.stringify({base,device,route,...metrics}));
        if (iteration === 1) {
          const audits = {};
          for (const [id, audit] of Object.entries(lhr.audits)) if (/(lcp|render-blocking|font|compression|document-latency|network-dependency|image-delivery|total-byte|unused)/i.test(id)) audits[id] = {title:audit.title,score:audit.score,displayValue:audit.displayValue,details:JSON.stringify(audit.details || null).slice(0,6000)};
          console.log(JSON.stringify({portfolioDiagnostics:{base,device,route,audits}}));
        }
      }
      const median=Object.fromEntries(['performance','accessibility','seo','lcp','cls','tbt'].map(key=>[key,runs.map(run=>run[key]).sort((a,b)=>a-b)[1]]));
      performance.push({device,route,runs,median});
    }
  } finally {await chrome.kill();}
  fs.writeFileSync(path.join(output,'performance.json'),JSON.stringify({base,sourceCommit:process.env.AUDIT_SOURCE_SHA || process.env.GITHUB_SHA || 'local',kind:'LAB_SIMULATED_NOT_FIELD_CWV',runsPerDeviceRoute:3,results:performance},null,2));
}
assert.deepEqual(failures,[],'Verified accessibility and reflow failures require repair');
console.log(`[seo-evidence] ${accessibility.length} axe template/device scans, seven-width reflow and image dialog checks passed.`);
