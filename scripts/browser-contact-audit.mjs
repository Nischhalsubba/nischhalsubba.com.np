import{chromium}from'playwright';
const base=process.env.AUDIT_BASE_URL||'http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:390,height:844}});
const failures=[];
try{
 await page.goto(`${base}/contact`,{waitUntil:'domcontentloaded'});
 const form=page.locator('#contact-form');
 const name=page.locator('#contact-name');
 await name.fill('Nischhal');
 await form.locator('button[type="submit"]').click();
 const invalid=page.locator('#contact-form [aria-invalid="true"]');
 if(await invalid.count()<4)failures.push('expected field-level errors for required fields');
 const first=invalid.first();
 const described=(await first.getAttribute('aria-describedby')||'').split(/\s+/).filter(Boolean);
 if(!described.length)failures.push('first invalid field lacks aria-describedby');
 for(const id of described){if(!await page.locator(`#${id}`).count())failures.push(`missing described error ${id}`)}
 if(!await first.evaluate(e=>e===document.activeElement))failures.push('focus did not move to first invalid field');
 if(await name.inputValue()!=='Nischhal')failures.push('entered value was not preserved');
 const status=page.locator('#contact-form-status');
 if(!/review the highlighted fields/i.test(await status.textContent()||''))failures.push('status region did not announce validation failure');
 if(await status.getAttribute('role')!=='status')failures.push('status region role is missing');
}catch(error){failures.push(error.message)}
await browser.close();
if(failures.length){console.error('[contact-audit] Failed\n'+failures.map(x=>`- ${x}`).join('\n'));process.exit(1)}
console.log('[contact-audit] Accessible validation behavior passed.');
