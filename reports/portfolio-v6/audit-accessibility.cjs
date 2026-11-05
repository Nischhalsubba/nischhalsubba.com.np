const {chromium}=require('../../site/node_modules/playwright');const fs=require('node:fs');
(async()=>{const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});const rows=[];
for(const width of [320,375,390,768,1024,1440,1920]){
const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});
await context.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
for(const route of ['/','/projects','/blog/','/contact','/project-yarsha','/blog/designing-handoffs-between-people']){
const page=await context.newPage();await page.goto('http://127.0.0.1:4173'+route,{waitUntil:'networkidle'});
await page.addScriptTag({path:'site/node_modules/axe-core/axe.min.js'});
const result=await page.evaluate(async()=>({overflow:document.documentElement.scrollWidth>innerWidth,breadcrumbs:document.querySelectorAll('nav[aria-label="Breadcrumb"]').length,axe:await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}})}));
await page.keyboard.press('Tab');result.firstFocus=await page.evaluate(()=>({tag:document.activeElement.tagName,href:document.activeElement.getAttribute('href'),text:document.activeElement.textContent.trim()}));
rows.push({route,width,...result});await page.close();fs.writeFileSync('reports/portfolio-v6/accessibility.json',JSON.stringify(rows,null,2));
}await context.close();console.log('Axe/responsive completed',width);
}await browser.close();})().catch(e=>{console.error(e);process.exit(1)});
