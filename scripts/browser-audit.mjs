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
   const result=await page.evaluate(()=>{const visible=e=>{const s=getComputedStyle(e),r=e.getBoundingClientRect();return s.display!=='none'&&s.visibility!=='hidden'&&r.width>0&&r.height>0};const ids=[...document.querySelectorAll('[id]')].map(e=>e.id).filter(Boolean);const css=[...document.querySelectorAll('link[rel="stylesheet"]')].map(e=>e.getAttribute('href')).filter(h=>h&&!/^https?:/i.test(h));return{overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,h1:[...document.querySelectorAll('h1')].filter(visible).length,duplicates:[...new Set(ids.filter((id,i)=>ids.indexOf(id)!==i))],broken:[...document.images].filter(i=>i.complete&&i.naturalWidth===0).map(i=>i.getAttribute('src')),footer:!!document.querySelector('.site-footer'),css,current:[...document.querySelectorAll('[aria-current="page"]')].filter(visible).length}});
   if(result.overflow>1)throw new Error(`horizontal overflow ${result.overflow}px`);
   if(result.h1!==1)throw new Error(`${result.h1} visible H1 elements`);
   if(result.duplicates.length)throw new Error(`duplicate IDs: ${result.duplicates.join(', ')}`);
   if(result.broken.length)throw new Error(`broken images: ${result.broken.join(', ')}`);
   if(!result.footer)throw new Error('missing footer');
   if(result.css.length!==1||!result.css[0].startsWith('/style.css'))throw new Error(`local CSS: ${result.css.join(', ')}`);
   if(result.current>1)throw new Error(`${result.current} active navigation links`);
  }catch(error){failures.push(`${width}x${height} ${route}: ${error.message}`)}
 }
 if(width<=430){
  try{
   await page.goto(base,{waitUntil:'domcontentloaded'});
   const toggle=page.locator('.mobile-nav-toggle');
   const overlay=page.locator('.mobile-nav-overlay');
   const links=overlay.locator('a[href]');
   await toggle.focus();await toggle.click();
   if(await toggle.getAttribute('aria-expanded')!=='true')throw new Error('menu did not open');
   if(await overlay.getAttribute('aria-hidden')!=='false')throw new Error('open menu remains aria-hidden');
   if(!await page.evaluate(()=>document.querySelector('.mobile-nav-overlay')?.contains(document.activeElement)))throw new Error('focus did not enter menu');
   if(!await page.evaluate(()=>document.querySelector('main')?.inert))throw new Error('background is not inert');
   const count=await links.count();if(!count)throw new Error('menu has no links');
   await links.nth(count-1).focus();await page.keyboard.press('Tab');
   if(!await links.first().evaluate(e=>e===document.activeElement))throw new Error('focus trap did not wrap');
   await page.keyboard.press('Escape');
   if(await toggle.getAttribute('aria-expanded')!=='false')throw new Error('Escape did not close menu');
   if(await overlay.getAttribute('aria-hidden')!=='true')throw new Error('closed menu is not aria-hidden');
   if(!await toggle.evaluate(e=>e===document.activeElement))throw new Error('focus did not return to toggle');
   if(await page.evaluate(()=>document.querySelector('main')?.inert))throw new Error('background remained inert');
   await page.keyboard.press('Tab');
   if(await page.evaluate(()=>document.querySelector('.mobile-nav-overlay')?.contains(document.activeElement)))throw new Error('closed menu remained keyboard reachable');
  }catch(error){failures.push(`${width}x${height} mobile navigation: ${error.message}`)}
 }
 await context.close();
}
await browser.close();
if(failures.length){console.error(`[browser-audit] ${failures.length} failure(s)\n${failures.map(x=>`- ${x}`).join('\n')}`);process.exit(1)}
console.log(`[browser-audit] ${routes.length} routes passed across ${viewports.length} viewports.`);