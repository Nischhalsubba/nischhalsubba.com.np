// Capture a public source for review only. Usage: node reports/portfolio-v6/capture-source.cjs https://verified.example/path project-id
// Requires the environment's approved network route; never bypass an access denial.
const {chromium}=require('../../site/node_modules/playwright');const fs=require('node:fs');const crypto=require('node:crypto');
(async()=>{const [url,id]=process.argv.slice(2);if(!url||!(/^https:\/\//.test(url)||/^http:\/\/127\.0\.0\.1:\d+\//.test(url))||!id||!/^[a-z0-9-]+$/.test(id))throw Error('Expected HTTPS source URL and safe project ID');
const directory='reports/portfolio-v6/acquisition/'+id;fs.mkdirSync(directory,{recursive:true});
const proxy=process.env.HTTPS_PROXY||process.env.HTTP_PROXY;
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox'],...(proxy&&!url.startsWith('http://127.0.0.1:')?{proxy:{server:proxy}}:{})});const manifest=[];
try{for(const viewport of [{width:1440,height:900},{width:390,height:844}]){
const context=await browser.newContext({viewport});const page=await context.newPage();const errors=[];const failedResources=[];page.on('pageerror',e=>errors.push(e.message));page.on('requestfailed',r=>{if(['stylesheet','font','script','image'].includes(r.resourceType())){const u=new URL(r.url());failedResources.push({url:u.origin+u.pathname,type:r.resourceType(),error:r.failure()?.errorText});}});
try{const response=await page.goto(url,{waitUntil:'networkidle',timeout:45000});if(!response?.ok())throw Error('HTTP '+response?.status());
await page.evaluate(async()=>{await document.fonts.ready;for(let y=0;y<document.body.scrollHeight;y+=700){scrollTo(0,y);await new Promise(r=>setTimeout(r,100));}await Promise.all([...document.images].filter(x=>x.getClientRects().length).map(x=>x.decode()));scrollTo(0,0);});
const filename=viewport.width+'.png';const path=directory+'/'+filename;if(fs.existsSync(path))throw Error('Refusing to overwrite an immutable original');await page.screenshot({path,fullPage:true});
manifest.push({source:url,finalUrl:page.url(),viewport,capturedAt:new Date().toISOString(),filename,sha256:crypto.createHash('sha256').update(fs.readFileSync(path)).digest('hex'),status:errors.length||failedResources.length?'REJECTED_RENDER_ERRORS':'CAPTURED_NEEDS_VISUAL_AND_RIGHTS_REVIEW',permission:'UNVERIFIED_DO_NOT_PUBLISH',role:'CURRENT_PUBLIC_SITE_NOT_PROOF_OF_HISTORICAL_AUTHORSHIP',errors,failedResources});
}catch(e){manifest.push({source:url,viewport,status:'BLOCKED_SOURCE',error:String(e),observedAt:new Date().toISOString()});}finally{await context.close();}
}}finally{await browser.close();fs.writeFileSync(directory+'/manifest.json',JSON.stringify(manifest,null,2));console.log(JSON.stringify(manifest));if(manifest.some(item=>item.status==='BLOCKED_SOURCE'||item.status==='REJECTED_RENDER_ERRORS'))process.exitCode=1;}
})().catch(e=>{console.error(e);process.exit(1)});
