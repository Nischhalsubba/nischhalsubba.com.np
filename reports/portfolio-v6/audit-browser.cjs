// Local final-build audit. Run from repository root with the production preview on port 4173.
const {chromium}=require('../../site/node_modules/playwright');
const fs=require('node:fs');const crypto=require('node:crypto');
(async()=>{
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
const manifest=require('../../site/config/canonical-routes.json');const results=[];
for(const viewport of [{width:1440,height:900},{width:390,height:844}]){
const context=await browser.newContext({viewport,reducedMotion:'reduce'});
// This audit intentionally isolates local application behavior from blocked external services.
await context.route('**/*',route=>new URL(route.request().url()).hostname==='127.0.0.1'?route.continue():route.abort());
for(const file of manifest.html){
const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
const route=file==='index.html'?'/':file==='blog/index.html'?'/blog/':'/'+file.replace(/\.html$/,'');
try{
const response=await page.goto('http://127.0.0.1:4173'+route,{waitUntil:'networkidle',timeout:30000});
await page.evaluate(async()=>{await document.fonts.ready;for(let y=0;y<document.body.scrollHeight;y+=700)window.scrollTo(0,y);});
await page.waitForTimeout(250);await page.evaluate(()=>window.scrollTo(0,0));
const data=await page.evaluate(()=>({title:document.title,description:document.querySelector('meta[name="description"]')?.content,canonical:document.querySelector('link[rel="canonical"]')?.href,h1:[...document.querySelectorAll('h1')].map(x=>x.textContent.trim()),overflow:document.documentElement.scrollWidth>innerWidth,schemas:[...document.querySelectorAll('script[type="application/ld+json"]')].map(x=>{try{return JSON.parse(x.textContent)}catch{return {invalid:true}}}),images:[...document.images].map(x=>({src:x.getAttribute('src'),currentSrc:x.currentSrc,alt:x.getAttribute('alt'),width:x.width,height:x.height,naturalWidth:x.naturalWidth,loading:x.loading,srcset:x.srcset,complete:x.complete,caption:x.closest('figure')?.querySelector('figcaption')?.textContent.trim()})),links:[...document.querySelectorAll('a[href]')].map(x=>({href:x.getAttribute('href'),text:x.textContent.trim()})),text:document.querySelector('main')?.innerText}));
let screenshot;
if(['index.html','projects.html','blog/index.html','project-zapp.html','contact.html','about.html'].includes(file)){
screenshot=`evidence/${file.replaceAll('/','-').replace('.html','')}-${viewport.width}.png`;
await page.screenshot({path:'reports/portfolio-v6/'+screenshot});
}
results.push({file,route,viewport,status:response.status(),...data,errors,screenshot});
}catch(error){results.push({file,route,viewport,error:String(error)});}finally{await page.close();}
fs.writeFileSync('reports/portfolio-v6/browser-inventory.json',JSON.stringify(results,null,2));
}
await context.close();console.log('Completed viewport',viewport.width);
}await browser.close();
const images=results.flatMap(r=>(r.images||[]).map(i=>({route:r.route,viewport:r.viewport.width,...i})));
fs.writeFileSync('reports/portfolio-v6/media-placements.json',JSON.stringify(images,null,2));
const shots=results.filter(x=>x.screenshot).map(x=>({file:x.screenshot,sha256:crypto.createHash('sha256').update(fs.readFileSync('reports/portfolio-v6/'+x.screenshot)).digest('hex'),url:'http://127.0.0.1:4173'+x.route,viewport:x.viewport,capturedAt:new Date().toISOString(),scope:'Local portfolio QA, not independent third-party product evidence'}));
fs.writeFileSync('reports/portfolio-v6/screenshots.json',JSON.stringify(shots,null,2));
if(results.some(r=>r.error||r.status!==200||r.errors?.length||r.overflow))process.exitCode=1;
console.log(JSON.stringify({pages:results.length,errors:results.filter(x=>x.error||x.errors?.length).length,overflow:results.filter(x=>x.overflow).length,placements:images.length}));
})().catch(e=>{console.error(e);process.exit(1)});
