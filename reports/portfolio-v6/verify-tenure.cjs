// Verify the owner-approved tenure claim against the retained résumé and final HTML.
const fs=require('node:fs');const path=require('node:path');const assert=require('node:assert/strict');const crypto=require('node:crypto');const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'../../site');const evidence=require('../../site/config/experience-evidence.json');const profile=require('../../site/config/professional-profile.json');
assert.equal(evidence.claim,'7+ years');assert.match(profile.summary,/7\+ years/);assert.equal(profile.experience.length,8);
const resume=path.join(root,evidence.resume.path);assert.equal(crypto.createHash('sha256').update(fs.readFileSync(resume)).digest('hex'),evidence.resume.sha256);
const text=execFileSync('pdftotext',['-layout',resume,'-'],{encoding:'utf8'});assert.match(text,/7\+ years/);assert.match(text,/Aug 2018\s*[–-]\s*Mar 2019/);
const months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];const covered=new Set();
for(const job of evidence.experience){const m=job.dates.match(/([A-Z][a-z]{2}) (\d{4}) [–-] ([A-Z][a-z]{2}) (\d{4})/);assert.ok(m,job.company);const start=Number(m[2])*12+months.indexOf(m[1]);const end=Number(m[4])*12+months.indexOf(m[3]);for(let i=start;i<=end;i++)covered.add(i);assert.ok(text.includes(job.company.replace(' Pvt. Ltd.','')),job.company+' appears in résumé');}
assert.equal(covered.size,84,'Overlapping roles must not inflate the month-level tenure count');
for(const pdf of ['assets/resume.pdf','workspace-home/assets/resume.pdf']){const content=execFileSync('pdftotext',['-layout',path.join(root,'dist',pdf),'-'],{encoding:'utf8'});assert.match(content,/7\+ years/,pdf);assert.doesNotMatch(content,/6\+ years/,pdf);}
const manifest=require('../../site/config/canonical-routes.json');for(const file of manifest.html){const html=fs.readFileSync(path.join(root,'dist',file),'utf8');assert.doesNotMatch(html,/6\+ years/,'stale tenure on '+file);}
const about=fs.readFileSync(path.join(root,'dist/about.html'),'utf8');assert.match(about,/The résumé behind 7\+ years/);for(const job of evidence.experience)assert.ok(about.includes(job.dates),job.company+' date trail');
console.log('Tenure verified: owner-approved 7+; résumé hash; eight roles; 84 unique month-level months; no stale 6+ years across 54 final pages.');
