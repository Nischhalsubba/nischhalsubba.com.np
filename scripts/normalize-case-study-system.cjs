/**
 * @fileoverview scripts/normalize-case-study-system.cjs
 * Purpose: Node-based build, content transformation, QA, or maintenance tool for normalize case study system.
 * Responsibilities:
 * - Own the behavior/content implied by this file's single responsibility.
 * - Keep public routes, build contracts, and imported module boundaries stable unless the connected owners are updated together.
 * Execution context: Node.js CLI during local development, CI, build, or maintenance.
 * Connected files:
 * - docs/repository/file-catalog.md
 * - scripts/build-dist.cjs
 * - scripts/generate-source.cjs
 * - package.json
 * Maintenance: Update this header when responsibility or dependencies change; generated/vendor files are documented at their source instead.
 */
const fs=require('node:fs'),path=require('node:path');
const dist=process.argv.includes('--dist'),root=path.resolve(__dirname,'..',dist?'dist':'');
const skip=new Set(['project-detail.html','project-archive.html','project-jeweltrek.html']);
const files=fs.existsSync(root)?fs.readdirSync(root).filter(/** Callback contract: Processes the callback step for fs.readdir sync(root) without leaking orchestration details to the caller. Inputs: n. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ n=>/^project-[a-z0-9-]+\.html$/i.test(n)&&!skip.has(n)):[];
/**
 * Function contract: cls
 * Purpose: Implements the cls responsibility for this module.
 * Inputs: h, t, c.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function cls(h,t,c){return h.replace(new RegExp(`<${t}([^>]*)>`,'i'),/** Callback contract: Processes the callback step for h without leaking orchestration details to the caller. Inputs: m, a. Side effects: no obvious external side effect beyond invoked dependencies. Returns a value to the invoking API. */ (m,a)=>{const f=a.match(/class=["']([^"']*)["']/i);if(!f)return `<${t}${a} class="${c}">`;const s=new Set(f[1].split(/\s+/).filter(Boolean));s.add(c);return `<${t}${a.replace(f[0],`class="${[...s].join(' ')}"`)}>`})}
/**
 * Function contract: swap
 * Purpose: Implements the swap responsibility for this module.
 * Inputs: h, a, b.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function swap(h,a,b){return h.includes(a)?h.replace(a,b):h}
/**
 * Function contract: run
 * Purpose: Implements the run responsibility for this module.
 * Inputs: n.
 * Side effects: may read or write repository/filesystem state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function run(n){const p=path.join(root,n);let h=fs.readFileSync(p,'utf8');h=cls(cls(h,'body','nrs-case-study-page'),'main','nrs-case-study');
h=h.replace(/<section class="hero-section"/i,'<section class="hero-section nrs-case-hero" aria-labelledby="case-title"').replace(/<h1 class="hero-title"/i,'<h1 id="case-title" class="hero-title"');
h=h.replace(/<div><h5([^>]*)>(Role|Domain|Users)<\/h5><p>([\s\S]*?)<\/p><\/div>/gi,'<div><dt$1>$2</dt><dd>$3</dd></div>').replace(/<section class="section-container"><div class="snapshot-grid"([^>]*)>((?:<div><dt[\s\S]*?<\/div>){3})<\/div><\/section>/i,'<section class="section-container nrs-case-facts" aria-label="Project facts"><dl class="snapshot-grid"$1>$2</dl></section>');
const pairs=[
['<section class="section-container reveal-on-scroll"><div class="case-label">PRODUCT CONTEXT</div><h2 class="section-title"','<section id="case-problem" class="section-container reveal-on-scroll" aria-labelledby="case-problem-title"><p class="case-label">Problem</p><h2 id="case-problem-title" class="section-title"'],
['<section class="section-container reveal-on-scroll"><h2 class="section-title" style="font-size:2rem;margin-bottom:20px;">My role</h2>','<section id="case-role" class="section-container reveal-on-scroll" aria-labelledby="case-role-title"><p class="case-label">Role and scope</p><h2 id="case-role-title" class="section-title" style="font-size:2rem;margin-bottom:20px;">My role and contribution</h2>'],
['<section class="section-container reveal-on-scroll"><div class="case-label">DESIGN DECISIONS</div><h2 class="section-title" style="font-size:2rem;margin-bottom:20px;">How I approached the work</h2>','<section id="case-decisions" class="section-container reveal-on-scroll" aria-labelledby="case-decisions-title"><p class="case-label">Key decisions</p><h2 id="case-decisions-title" class="section-title" style="font-size:2rem;margin-bottom:20px;">How I approached the work</h2>']];pairs.forEach(/** Callback contract: Processes the callback step for pairs without leaking orchestration details to the caller. Inputs: x. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ x=>h=swap(h,...x));
h=h.replace(/<section class="section-container reveal-on-scroll"><div class="case-label">OUTCOME<\/div><h2 class="section-title" style="font-size:2rem;margin-bottom:20px;">What the design made easier<\/h2>/i,'<section id="case-contribution" class="section-container reveal-on-scroll" aria-labelledby="case-contribution-title"><p class="case-label">Intended design effect</p><h2 id="case-contribution-title" class="section-title" style="font-size:2rem;margin-bottom:20px;">What the design aimed to make easier</h2><div class="nrs-evidence-status" data-evidence-status="intended"><strong>Evidence status:</strong> Intended design effect, not a measured product result.</div>');
h=h.replace(/<section id="proof" class="section-container reveal-on-scroll">/i,'<section id="proof" class="section-container reveal-on-scroll" aria-labelledby="case-proof-title">').replace(/<h2 class="section-title" style="margin-bottom:14px;">Project image and resources<\/h2>/i,'<h2 id="case-proof-title" class="section-title" style="margin-bottom:14px;">Project evidence and resources</h2><div class="nrs-evidence-status" data-evidence-status="artifact"><strong>Evidence status:</strong> Public or scoped portfolio artifacts are available below.</div>');
h=h.replace(/<section class="section-container reveal-on-scroll" style="border-top:1px solid var\(--border-faint\);"><h2 class="section-title">What I would discuss in an interview<\/h2>/i,'<section id="case-validation" class="section-container reveal-on-scroll" style="border-top:1px solid var(--border-faint);" aria-labelledby="case-validation-title"><p class="case-label">Limitations and next validation</p><h2 id="case-validation-title" class="section-title">What still needs evidence</h2><div class="nrs-evidence-status" data-evidence-status="proposed"><strong>Evidence status:</strong> Proposed validation, not a measured outcome.</div>');
fs.writeFileSync(p,h,'utf8');return h}
const err=[];for(const n of files){const h=run(n),m=h.match(/<main\b[\s\S]*?<\/main>/i)?.[0]||h;if((m.match(/<h1\b/gi)||[]).length!==1)err.push(`${n}: H1`);for(const id of ['case-title','case-problem-title','case-role-title','case-decisions-title','case-contribution-title','case-proof-title','case-validation-title'])if(!m.includes(`id="${id}"`))err.push(`${n}: ${id}`);for(const s of ['intended','artifact','proposed'])if(!m.includes(`data-evidence-status="${s}"`))err.push(`${n}: ${s}`)}
if(!files.length)err.push('No project pages');if(err.length){console.error('[case-study] Failed\n'+err.join('\n'));process.exit(1)}console.log(`[case-study] Validated ${files.length} ${dist?'build':'source'} page(s).`);
