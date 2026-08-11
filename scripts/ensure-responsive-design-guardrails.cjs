/**
 * @fileoverview scripts/ensure-responsive-design-guardrails.cjs
 * Purpose: Apply the ensure responsive design guardrails production transformation or maintenance step while preserving canonical source/build contracts.
 * Responsibilities:
 * - Operate deterministically on canonical source or build output so repeated runs produce stable results.
 * - Surface invalid input or contract drift as explicit failures instead of silently masking it.
 * - Keep path assumptions synchronized with repository manifests and source-layout ownership.
 * Execution context: Node.js CLI during development, generation, build, CI, or repository maintenance.
 * Connected files:
 * - scripts/build-dist.cjs
 * - scripts/generate-source.cjs
 * - package.json
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const target=process.argv.includes('--dist')?path.join(root,'dist'):root;
const file=path.join(target,'style.css');
if(!fs.existsSync(file))throw new Error('style.css missing');
const marker='/* nrs-responsive-design-guardrails-v52 */';
const css=`
${marker}
:root{--type-h1:clamp(3rem,5vw,5.5rem);--type-h2:clamp(2rem,3.4vw,3.8rem);--type-h3:clamp(1.3rem,1.8vw,1.8rem)}
body :is(h1,.hero-title){font-size:var(--type-h1)!important;line-height:1!important;letter-spacing:-.045em!important}
body :is(h2,.section-title){font-size:var(--type-h2)!important;line-height:1.05!important;letter-spacing:-.035em!important}
body h3{font-size:var(--type-h3)!important;line-height:1.15!important;letter-spacing:-.02em!important}
.eyebrow,.meta-text,.nrs-blog-meta,.card-meta-line,.nrs-row-index,.nrs-row-meta,.nrs-facts,.nrs-blog-utility{font-size:max(.875rem,14px)!important;line-height:1.45!important}
@media(max-width:1100px){.floating-resume-btn{display:none!important}}
body:is(.nrs-blog-detail-page,.nrs-contact-page,.nrs-contact-v2-page) .floating-resume-btn{display:none!important}
@media(max-width:960px){.nrs-section-heading,[class*='section-heading'][style*='sticky']{position:static!important;top:auto!important}}
@media(max-width:1024px) and (max-height:800px){.hero-section,.nrs-home-hero,.nrs-inner-page .hero-section{padding-top:112px!important;padding-bottom:56px!important}.nav-wrapper{top:16px!important}}
@media(max-width:760px){:root{--type-h1:clamp(2.55rem,11vw,3.75rem);--type-h2:clamp(2rem,8vw,3rem);--type-h3:clamp(1.25rem,5vw,1.65rem)}.hero-section,.nrs-home-hero,.nrs-inner-page .hero-section{min-height:auto!important;padding-top:112px!important;padding-bottom:48px!important}.section-container,.nrs-case-section,.nrs-services-section,.nrs-contact-section,article.section-container{padding-block:clamp(56px,14vw,80px)!important}}
@media(prefers-reduced-motion:reduce){.floating-resume-btn,.nrs-section-heading{transition:none!important}}
`;
let s=fs.readFileSync(file,'utf8').replace(/\/\* nrs-responsive-design-guardrails-v\d+ \*\/[\s\S]*$/g,'').trimEnd();
s+=`\n\n${css.trim()}\n`;
fs.writeFileSync(file,s,'utf8');
console.log('Applied responsive typography, sticky and floating-control guardrails.');
