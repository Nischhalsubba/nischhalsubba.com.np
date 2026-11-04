/**
 * @fileoverview Focused homepage CPU evidence without changing production behavior.
 * Purpose: Locate startup work behind the measured mobile TBT gap.
 * Responsibilities: Sample Chromium stacks, long tasks and fonts with source locations.
 * Execution context: Read-only preview profiling in a separate CI job.
 * Connected files: seo-evidence-audit.yml, workspace-home/index.html, browser-evidence.mjs.
 * Maintenance: Lab samples are not field INP or proof of a particular fix.
 */
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
const base=process.env.AUDIT_BASE_URL || 'http://127.0.0.1:4173';
const output=process.env.AUDIT_OUTPUT || 'tests/seo-evidence/profile';
fs.mkdirSync(output,{recursive:true});
const browser=await chromium.launch({headless:true});const summaries=[];
try {
  for(const device of ['mobile','desktop']) {
    const rate=device==='mobile'?4:1;
    const context=await browser.newContext({viewport:device==='mobile'?{width:390,height:844}:{width:1440,height:900},reducedMotion:'no-preference'});
    const page=await context.newPage();
    await page.addInitScript(/** Callback contract: Observe startup tasks. Inputs: none. Side effects: installs a timing buffer. Returns: void. */ ()=>{
      window.__portfolioLongTasks=[];
      new PerformanceObserver(/** Callback contract: Collect task timing without changing UI. Inputs: entry list. Side effects: appends timing rows. Returns: void. */ list=>{
        for(const item of list.getEntries())window.__portfolioLongTasks.push({startTime:item.startTime,duration:item.duration,name:item.name});
      }).observe({type:'longtask',buffered:true});
    });
    const session=await context.newCDPSession(page);
    await session.send('Emulation.setCPUThrottlingRate',{rate});
    await session.send('Profiler.enable');await session.send('Profiler.setSamplingInterval',{interval:1000});await session.send('Profiler.start');
    await page.goto(base+'/',{waitUntil:'networkidle'});await page.waitForTimeout(6500);
    const {profile}=await session.send('Profiler.stop');
    fs.writeFileSync(path.join(output,device+'-home.cpuprofile'),JSON.stringify(profile));
    const parents=new Map();for(const node of profile.nodes)for(const child of node.children||[])parents.set(child,node.id);
    const self=new Map();const inclusive=new Map();
    for(let index=0;index<(profile.samples||[]).length;index++){
      const id=profile.samples[index];const ms=(profile.timeDeltas?.[index]||1000)/1000;self.set(id,(self.get(id)||0)+ms);
      let ancestor=id;let depth=0;
      while(ancestor!==undefined&&depth++<512){inclusive.set(ancestor,(inclusive.get(ancestor)||0)+ms);ancestor=parents.get(ancestor);}
    }
    const locations=profile.nodes.map(/** Callback contract: Attach sample costs to source locations. Inputs: CPU node. Side effects: none. Returns: row. */ node=>({function:node.callFrame.functionName||'(anonymous)',url:node.callFrame.url,line:node.callFrame.lineNumber+1,column:node.callFrame.columnNumber+1,selfMs:self.get(node.id)||0,inclusiveMs:inclusive.get(node.id)||0}));
    const ranked=[...locations].sort(/** Callback contract: Rank sampled self time. Inputs: diagnostic rows. Side effects: none. Returns: order. */ (a,b)=>b.selfMs-a.selfMs).slice(0,35);
    const inclusiveRanked=locations.filter(/** Callback contract: Keep site call frames. Inputs: diagnostic row. Side effects: none. Returns: match flag. */ item=>item.url.startsWith(base)).sort(/** Callback contract: Rank inclusive site work. Inputs: diagnostic rows. Side effects: none. Returns: order. */ (a,b)=>b.inclusiveMs-a.inclusiveMs).slice(0,25);
    const observed=await page.evaluate(/** Callback contract: Read public page timings and font resource sizes. Inputs: none. Side effects: none. Returns: diagnostics. */ ()=>({longTasks:window.__portfolioLongTasks,fonts:performance.getEntriesByType('resource').filter(/** Callback contract: Select fonts. Inputs: resource. Side effects: none. Returns: flag. */ item=>item.name.includes('.woff2')).map(/** Callback contract: Read font timings. Inputs: resource. Side effects: none. Returns: plain row. */ item=>({url:item.name,transferSize:item.transferSize,duration:item.duration}))}));
    const summary={device,cpuRate:rate,kind:'LAB_SAMPLED_CPU_NOT_FIELD_INP',ranked,inclusiveRanked,...observed};summaries.push(summary);console.log(JSON.stringify({homeCPUProfile:summary}));
    await context.close();
  }
}finally{await browser.close();}
fs.writeFileSync(path.join(output,'summary.json'),JSON.stringify({base,sourceCommit:process.env.GITHUB_SHA,results:summaries},null,2));
