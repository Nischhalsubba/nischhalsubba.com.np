import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const base=process.env.AUDIT_BASE_URL||'http://127.0.0.1:4173';
const xml=fs.readFileSync(path.resolve('dist/sitemap.xml'),'utf8');
const routes=[...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>new URL(m[1]).pathname);
const viewports=[[360,800],[390,844],[430,932],[768,1024],[1024,768],[1280,720],[1440,900],[1920,1080]];
const failures=[];
const browser=await chromium.launch({headless:true});

for(const [width,height] of viewports){
 const context=await browser.newContext({viewport:{width,height}});
 const page=await context.newPage();
 for(const route of routes){
  try{
   const response=await page.goto(`${base}${route}`,{waitUntil:'domcontentloaded',timeout:30000});
   if(!response||response.status()>=400)throw new Error(`HTTP ${response?.status()||'none'}`);
   const result=await page.evaluate(()=>{
    const visible=e=>{const s=getComputedStyle(e),r=e.getBoundingClientRect();return s.display!=='none'&&s.visibility!=='hidden'&&r.width>0&&r.height>0};
    const ids=[...document.querySelectorAll('[id]')].map(e=>e.id).filter(Boolean);
    const duplicates=[...new Set(ids.filter((id,i)=>ids.indexOf(id)!==i))];
    const localCss=[...document.querySelectorAll('link[rel="stylesheet"]')].map(e=>e.getAttribute('href')).filter(h=>h&&!/^https?:/i.test(h));
    return {
     overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,
     h1:[...document.querySelectorAll('h1')].filter(visible).length,
     duplicates,
     brokenImages:[...document.images].filter(i=>i.complete&&i.naturalWidth===0).map(i=>i.getAttribute('src')),
     footer:!!document.querySelector('.site-footer'),
     localCss,
     current:[...document.querySelectorAll('[aria-current="page"]')].filter(visible).length
    };
   });
   if(result.overflow>1)throw new Error(`horizontal overflow ${result.overflow}px`);
   if(result.h1!==1)throw new Error(`${result.h1} visible H1 elements`);
   if(result.duplicates.length)throw new Error(`duplicate IDs: ${result.duplicates.join(', ')}`);
   if(result.brokenImages.length)throw new Error(`broken images: ${result.brokenImages.join(', ')}`);
   if(!result.footer)throw new Error('missing footer');
   if(result.localCss.length!==1||!result.localCss[0].startsWith('/style.css'))throw new Error(`local CSS: ${result.localCss.join(', ')}`);
   if(result.current>1)throw new Error(`${result.current} active navigation links`);
  }catch(error){failures.push(`${width}x${height} ${route}: ${error.message}`)}
 }
 if(width<=430){
  try{
   await page.goto(base,{waitUntil:'domcontentloaded'});
   const toggle=page.locator('.mobile-nav-toggle');
   await toggle.click();
   if(await toggle.getAttribute('aria-expanded')!=='true')throw new Error('mobile menu did not open');
   await page.keyboard.press('Escape');
   if(await toggle.getAttribute('aria-expanded')!=='false')throw new Error('mobile menu did not close with Escape');
  }catch(error){failures.push(`${width}x${height} mobile navigation: ${error.message}`)}
 }
 await context.close();
}
await browser.close();
if(failures.length){console.error(`[browser-audit] ${failures.length} failure(s)\n${failures.map(x=>`- ${x}`).join('\n')}`);process.exit(1)}
console.log(`[browser-audit] ${routes.length} routes passed across ${viewports.length} viewports.`);
