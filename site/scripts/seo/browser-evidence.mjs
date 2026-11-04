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
const routes = process.argv.includes('--home-only') ? ['/'] : ['/', '/projects', '/project-orkest', '/services', '/blog/', '/blog/figma-handoff-notes-for-developers'];
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
        if(result.violations.length) console.error(JSON.stringify({accessibilityFailure:{route,width,violations:result.violations}}));
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
  const motionContext = await browser.newContext({viewport:{width:390,height:844},reducedMotion:'no-preference'});
  const motionPage = await motionContext.newPage();
  await motionPage.addInitScript(/** Callback contract: Count layout reads on the offscreen work scene. Inputs: none. Side effects: wraps a native DOM reader in this test context only. Returns: void. */ () => {
    const original = Element.prototype.getBoundingClientRect;
    window.__workLayoutReads = 0;
    window.__aboutLayoutReads = 0;
    window.__footerLayoutReads = 0;
    window.__processLayoutReads = 0;
    window.__contactLayoutReads = 0;
    window.__layerLayoutReads = 0;
    Element.prototype.getBoundingClientRect = /** Callback contract: Preserve the native rectangle while counting work-scene reads. Inputs: DOM receiver. Side effects: updates a test-only counter. Returns: native DOMRect. */ function () {
      if (this.id === 'wk') window.__workLayoutReads++;
      if (this.id === 'abx') window.__aboutLayoutReads++;
      if (this.id === 'ftName') window.__footerLayoutReads++;
      if (this.id === 'od') window.__processLayoutReads++;
      if (this.id === 'contact') window.__contactLayoutReads++;
      if (this.classList.contains('layer')) window.__layerLayoutReads++;
      return original.call(this);
    };
  });
  await motionPage.goto(base+'/',{waitUntil:'networkidle'});
  await motionPage.waitForFunction(/** Callback contract: Measure stationary reads after intro, font and adaptive-tier startup settles. Inputs: none. Side effects: none. Returns: readiness. */ () => performance.now() > 10000 && document.fonts.status === 'loaded' && !document.getElementById('hrIntro'));
  await motionPage.evaluate(/** Callback contract: Confirm offscreen position and start the idle measurement. Inputs: none. Side effects: resets a test counter. Returns: offscreen flag. */ () => {
    const away = document.getElementById('wk').getBoundingClientRect().top > innerHeight + 600 && document.getElementById('abx').getBoundingClientRect().top >= innerHeight;
    window.__workLayoutReads = 0;
    window.__aboutLayoutReads = 0;
    window.__footerLayoutReads = 0;
    window.__processLayoutReads = 0;
    window.__contactLayoutReads = 0;
    window.__layerLayoutReads = 0;
    return away;
  }).then(/** Callback contract: Require the intended offscreen test precondition. Inputs: flag. Side effects: assertion only. Returns: void. */ away => assert.equal(away,true));
  await motionPage.waitForTimeout(250);
  assert.equal(await motionPage.evaluate(/** Callback contract: Read the isolated work-layout counter. Inputs: none. Side effects: none. Returns: count. */ () => window.__workLayoutReads),0,'Offscreen work scene must not read layout every frame');
  assert.equal(await motionPage.evaluate(/** Callback contract: Read the offscreen About-scene counter. Inputs: none. Side effects: none. Returns: count. */ () => window.__aboutLayoutReads),0,'Offscreen About scene must not read layout every frame');
  assert.equal(await motionPage.evaluate(/** Callback contract: Read the unseen footer-scene counter. Inputs: none. Side effects: none. Returns: count. */ () => window.__footerLayoutReads),0,'Unseen footer must not read layout every frame');
  assert.equal(await motionPage.evaluate(/** Callback contract: Read the offscreen process-scene counter. Inputs: none. Side effects: none. Returns: count. */ () => window.__processLayoutReads),0,'Offscreen process scene must not read layout every frame');
  assert.equal(await motionPage.evaluate(/** Callback contract: Read the offscreen contact-scene counter. Inputs: none. Side effects: none. Returns: count. */ () => window.__contactLayoutReads),0,'Offscreen contact scene must not read layout every frame');
  assert.equal(await motionPage.evaluate(/** Callback contract: Read stationary scroll-layer geometry calls. Inputs: none. Side effects: none. Returns: count. */ () => window.__layerLayoutReads),0,'Stationary scroll layers must not reread geometry every frame');
  await motionPage.evaluate(/** Callback contract: Exercise native navigation into the work scene. Inputs: none. Side effects: scrolls the test page. Returns: void. */ () => document.getElementById('work').scrollIntoView({block:'start',behavior:'instant'}));
  await motionPage.waitForFunction(/** Callback contract: Wait for a usable project and completed navigation frame. Inputs: none. Side effects: none. Returns: readiness. */ () => document.querySelector('#wkWorld .wf.on .whit')?.tabIndex === 0 && document.querySelector('.tb-t.act')?.dataset.sec === 'work');
  assert.equal(await motionPage.locator('.tb-t.act').getAttribute('data-sec'),'work');
  assert.equal(await motionPage.evaluate(/** Callback contract: Verify deferred pixel buffers paint before visible use. Inputs: none. Side effects: reads canvas pixels. Returns: painted flag. */ () => {
    const canvas=document.querySelector('#wkPx canvas.dio');
    const pixels=canvas.getContext('2d').getImageData(0,0,20,20).data;
    return pixels.some(/** Callback contract: Detect a painted alpha sample. Inputs: channel and index. Side effects: none. Returns: opaque flag. */ (value,index) => index%4===3 && value>0);
  }),true);
  await motionPage.evaluate(/** Callback contract: Exercise reverse navigation into the About scene. Inputs: none. Side effects: scrolls the test page. Returns: void. */ () => document.getElementById('about').scrollIntoView({block:'start',behavior:'instant'}));
  await motionPage.waitForFunction(/** Callback contract: Wait for the About chapter and completed reverse-navigation frame. Inputs: none. Side effects: none. Returns: readiness. */ () => Boolean(document.querySelector('#abCh .abx-c.on')) && document.querySelector('.tb-t.act')?.dataset.sec === 'about');
  assert.equal(await motionPage.locator('.tb-t.act').getAttribute('data-sec'),'about');
  await motionPage.evaluate(/** Callback contract: Activate the deferred process dial. Inputs: none. Side effects: scrolls the test page. Returns: void. */ () => document.getElementById('process').scrollIntoView({block:'start',behavior:'instant'}));
  await motionPage.waitForFunction(/** Callback contract: Require the process dial to initialize visibly. Inputs: none. Side effects: none. Returns: readiness. */ () => Boolean(document.querySelector('#odC #odN')) && document.querySelector('.tb-t.act')?.dataset.sec === 'process');
  await motionPage.evaluate(/** Callback contract: Activate the deferred contact canvas. Inputs: none. Side effects: scrolls the test page. Returns: void. */ () => document.getElementById('contact').scrollIntoView({block:'start',behavior:'instant'}));
  await motionPage.waitForFunction(/** Callback contract: Verify the contact field paints when visible. Inputs: none. Side effects: reads canvas pixels. Returns: painted flag. */ () => document.querySelector('#cpDots').getContext('2d').getImageData(0,0,30,30).data.some((value,index) => index%4===3 && value>0));
  const chapters = ['top','about','exp','work','services','process','testi','pricing','contact'];
  for (const id of [...chapters, ...chapters.slice(0,-1).reverse()]) {
    console.log('[chapter-navigation]',id);
    await motionPage.evaluate(/** Callback contract: Exercise every chapter in both directions, matching the Home control's explicit zero destination. Inputs: chapter ID. Side effects: scrolls the page. Returns: void. */ id => { if (id === 'top') scrollTo({top:0,behavior:'instant'}); else document.getElementById(id).scrollIntoView({block:'start',behavior:'instant'}); },id);
    await motionPage.waitForFunction(/** Callback contract: Check the universal chapter indicator, including Contact's separate CTA. Inputs: chapter ID. Side effects: none. Returns: readiness. */ id => document.querySelector('#tbMp a.act[data-sec]')?.dataset.sec === id,id);
    assert.equal(await motionPage.locator('#'+id).isVisible(),true,'Navigated chapter must remain visible: '+id);
  }
  await motionPage.setViewportSize({width:768,height:1024});
  await motionPage.evaluate(/** Callback contract: Verify navigation after viewport geometry invalidation. Inputs: none. Side effects: scrolls the page. Returns: void. */ () => document.getElementById('process').scrollIntoView({block:'start',behavior:'instant'}));
  await motionPage.waitForFunction(/** Callback contract: Require the resized process chapter to become current and visible. Inputs: none. Side effects: none. Returns: readiness. */ () => document.querySelector('.tb-t.act')?.dataset.sec === 'process' && getComputedStyle(document.getElementById('process')).visibility === 'visible');
  await motionPage.screenshot({path:path.join(output,'normal-motion-process-resized.png')});
  await motionContext.close();
  console.log('[homepage-motion] Offscreen layout, deferred buffers and bidirectional section navigation passed.');
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
