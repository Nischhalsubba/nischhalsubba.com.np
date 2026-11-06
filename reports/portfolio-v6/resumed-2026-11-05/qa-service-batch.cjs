// Verify the two service examples in the final build; scroll lazy images before decode.
const {chromium}=require('../../../site/node_modules/playwright');
const AxeBuilder=require('../../../site/node_modules/@axe-core/playwright').default;
const fs=require('node:fs');const path=require('node:path');
(async()=>{const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});const results=[];
try{for(const width of [320,390,768,1440])for(const route of ['figma-design-systems','web3-ux-designer']){
 const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const response=await page.goto('http://127.0.0.1:4173/'+route,{waitUntil:'networkidle'});
 await page.evaluate(async()=>{await document.fonts.ready;for(let y=0;y<document.body.scrollHeight;y+=600){scrollTo({top:y,behavior:'instant'});await new Promise(r=>setTimeout(r,50));}await Promise.all([...document.querySelectorAll('main img')].map(x=>x.decode()));scrollTo({top:0,behavior:'instant'});});
 const text=await page.locator('main').innerText();if(!text.toLowerCase().includes(route==='figma-design-systems'?'a concrete handoff example':'review the action, then verify'))throw Error('Missing new section');
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
 if(response.status()!==200||overflow>2||errors.length||axe.violations.length)throw Error(JSON.stringify({route,width,overflow,errors,violations:axe.violations}));
 results.push({route,width,status:response.status(),overflow,errors,axeViolations:axe.violations.length});console.log('Passed',route,width);
 if(width===390||width===1440)await page.screenshot({path:path.join(__dirname,`${route}-${width}.png`),fullPage:true});await context.close();
}}finally{await browser.close();}
fs.writeFileSync(path.join(__dirname,'service-batch-qa.json'),JSON.stringify({checkedAt:new Date().toISOString(),results},null,2));console.log('Eight service route/viewport checks passed.');
})().catch(e=>{console.error(e);process.exit(1)});
