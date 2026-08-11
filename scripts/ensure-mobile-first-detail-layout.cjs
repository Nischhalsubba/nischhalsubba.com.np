/**
 * @fileoverview scripts/ensure-mobile-first-detail-layout.cjs
 * Purpose: Apply the ensure mobile first detail layout production transformation or maintenance step while preserving canonical source/build contracts.
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
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const target = process.argv.includes('--dist') ? path.join(root, 'dist') : root;
const file = path.join(target, 'style.css');
if (!fs.existsSync(file)) throw new Error('style.css missing');

const marker = '/* nrs-mobile-first-detail-layout-v1 */';
const css = `${marker}
/* Mobile is the baseline. Larger screens enhance spacing below. */
.nrs-detail-breadcrumb{width:100%;margin:0 0 24px;color:var(--text-tertiary);font-family:var(--font-sans);font-size:.78rem;font-weight:750}
.nrs-detail-breadcrumb ol{display:flex;align-items:center;flex-wrap:wrap;gap:8px;margin:0;padding:0;list-style:none}
.nrs-detail-breadcrumb li{display:inline-flex;align-items:center;min-width:0}
.nrs-detail-breadcrumb li+li::before{content:'/';margin-right:8px;color:color-mix(in srgb,var(--text-tertiary) 48%,transparent)}
.nrs-detail-breadcrumb a,.nrs-detail-breadcrumb span{display:block;max-width:min(28ch,72vw);overflow:hidden;color:inherit;text-decoration:none;text-overflow:ellipsis;white-space:nowrap}
.nrs-detail-breadcrumb a:is(:hover,:focus-visible),.nrs-detail-breadcrumb [aria-current='page']{color:var(--text-primary)}

#nrs-scroll-progress{background:transparent!important;opacity:0!important;transition:opacity 160ms ease!important}
html[data-nrs-scrolled='true'] #nrs-scroll-progress{opacity:1!important}

@media (max-width:850px){
  :root{--mobile-header-clearance:88px;--mobile-hero-end:48px}
  body main.container{padding-top:0!important}
  body main.container>.hero-section:first-child,
  body main.container>.nrs-home-hero:first-child,
  body main.container>.nrs-services-shell:first-child,
  body main.container>article.section-container:first-child,
  body main.container>.nrs-blog-detail-surface:first-child,
  body main.container>.nrs-article-frame:first-child{
    min-height:0!important;height:auto!important;margin-top:0!important;padding-top:var(--mobile-header-clearance)!important;padding-bottom:var(--mobile-hero-end)!important;align-content:start!important;align-items:start!important
  }
  .hero-section,.nrs-home-hero,.nrs-services-hero,.nrs-contact-v3-hero{min-height:0!important;height:auto!important;align-content:start!important;align-items:start!important}
  .nrs-home-hero,.nrs-services-hero{grid-template-columns:1fr!important}
  .nrs-detail-breadcrumb{margin-bottom:22px}
  .nrs-blog-detail-page article.section-container{padding-top:var(--mobile-header-clearance)!important}
}

@media (min-width:851px){
  .nrs-detail-breadcrumb{margin-bottom:clamp(28px,3vw,44px)}
  .nrs-detail-breadcrumb a,.nrs-detail-breadcrumb span{max-width:min(38ch,42vw)}
}
`;

let source = fs.readFileSync(file, 'utf8');
source = source.replace(/\/\* nrs-mobile-first-detail-layout-v\d+ \*\/[\s\S]*$/g, '').trimEnd();
fs.writeFileSync(file, `${source}\n\n${css}\n`, 'utf8');
console.log('Applied mobile-first detail spacing and breadcrumb styles.');
