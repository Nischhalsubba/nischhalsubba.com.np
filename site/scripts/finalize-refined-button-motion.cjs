/**
 * @fileoverview scripts/finalize-refined-button-motion.cjs
 * Purpose: Finalize production-only compatibility for the refined GSAP button system after generated CSS and runtime files have been materialized.
 * Responsibilities:
 * - Remove late-generated homepage CTA CSS declarations that would override GSAP transforms and generated visual layers.
 * - Normalize the final motion runtime to support hybrid pointer devices while still respecting reduced-motion preferences.
 * - Route pinned GSAP dependencies through the production origin so client motion does not depend on direct third-party CDN access.
 * - Fail explicitly when expected generated contracts drift so incompatible production output cannot ship silently.
 * Execution context: Node.js CLI during the final production build stage after `build-dist.cjs` and runtime normalization.
 * Connected files:
 * - scripts/finalize-signal-typography-v24.cjs
 * - src/styles/systems/interaction-motion.css
 * - src/scripts/features/motion/refined-button-motion.js
 * - src/worker.js
 * - package.json
 * Maintenance: Keep replacements narrow and deterministic; remove compatibility patches when their upstream source owners absorb the same behavior directly.
 */
const fs = require('node:fs');
const path = require('node:path');

const repositoryRoot = path.resolve(__dirname, '..');
const root = process.argv.includes('--dist') ? path.join(repositoryRoot, 'dist') : repositoryRoot;
const stylePath = path.join(root, 'style.css');
const motionScriptPath = path.join(root, 'src', 'scripts', 'features', 'motion', 'refined-button-motion.js');

if (!fs.existsSync(stylePath)) {
  throw new Error(`[refined-button-motion] Stylesheet target does not exist: ${stylePath}`);
}
if (!fs.existsSync(motionScriptPath)) {
  throw new Error(`[refined-button-motion] Motion runtime target does not exist: ${motionScriptPath}`);
}

let css = fs.readFileSync(stylePath, 'utf8');
const heroTypePattern = /\/\* nrs-hero-type-v24:start \*\/[\s\S]*?\/\* nrs-hero-type-v24:end \*\//;
const heroTypeMatch = css.match(heroTypePattern);
if (!heroTypeMatch) {
  throw new Error('[refined-button-motion] Expected final hero typography block was not found.');
}

const original = css;
const originalHeroType = heroTypeMatch[0];
const ctaBlockPattern = /\.nrs-uploaded-hero-v19 \.nrs-uploaded-btn\{[\s\S]*?\n\}/;
const ctaBlockMatch = originalHeroType.match(ctaBlockPattern);
if (!ctaBlockMatch) {
  throw new Error('[refined-button-motion] Expected final homepage CTA block was not found inside hero typography v24.');
}

const originalCtaBlock = ctaBlockMatch[0];
const normalizedCtaBlock = originalCtaBlock
  .replace('overflow:visible!important;', 'overflow:hidden!important;')
  .replace(
    'transition:transform .16s cubic-bezier(.2,0,0,1),border-color .16s ease,background-color .16s ease!important;',
    'transition:border-color .16s ease,background-color .16s ease,color .16s ease!important;',
  );

if (normalizedCtaBlock === originalCtaBlock) {
  throw new Error('[refined-button-motion] Final homepage CTA block did not contain the expected transform/overflow compatibility declarations.');
}

const normalizedHeroType = originalHeroType
  .replace(ctaBlockPattern, normalizedCtaBlock)
  .replace(
    '.nrs-uploaded-hero-v19 .nrs-uploaded-btn span{',
    '.nrs-uploaded-hero-v19 .nrs-uploaded-btn > span[aria-hidden="true"]:not([class]){',
  )
  .replace(
    /@media\(hover:hover\) and \(pointer:fine\)\{\s*\.nrs-uploaded-hero-v19 \.nrs-uploaded-btn:hover\{transform:translateY\(-2px\)!important\}\s*\}/g,
    '',
  );

css = css.replace(heroTypePattern, normalizedHeroType);
if (css === original) {
  throw new Error('[refined-button-motion] No production CTA compatibility changes were applied.');
}

const finalHeroType = css.match(heroTypePattern)?.[0] || '';
const finalCtaBlock = finalHeroType.match(ctaBlockPattern)?.[0] || '';
if (!finalCtaBlock.includes('overflow:hidden!important;')) {
  throw new Error('[refined-button-motion] Final homepage CTA overflow is not clipped for pointer-origin fill.');
}
if (finalCtaBlock.includes('transition:transform')) {
  throw new Error('[refined-button-motion] Competing CSS transform transition remains in the final homepage CTA block.');
}
if (/\.nrs-uploaded-hero-v19 \.nrs-uploaded-btn:hover\{transform:[^}]*!important\}/.test(finalHeroType)) {
  throw new Error('[refined-button-motion] Competing uploaded CTA hover transform remains in final hero typography.');
}
if (/\.nrs-uploaded-hero-v19 \.nrs-uploaded-btn span\{/.test(finalHeroType)) {
  throw new Error('[refined-button-motion] Broad uploaded CTA descendant-span override remains in final hero typography.');
}

let motionSource = fs.readFileSync(motionScriptPath, 'utf8');
const originalMotionSource = motionSource;
const gsapSourceLine = "const GSAP_SOURCE = `https://cdn.jsdelivr.net/npm/gsap@${GSAP_VERSION}/dist/gsap.min.js`;";
const splitTextSourceLine = "const SPLIT_TEXT_SOURCE = `https://cdn.jsdelivr.net/npm/gsap@${GSAP_VERSION}/dist/SplitText.min.js`;";
const productionGsapSource = "const GSAP_SOURCE = window.location.hostname === 'nischhalsubba.com.np'\n  ? `/runtime/gsap/gsap-${GSAP_VERSION}.min.js`\n  : `https://cdn.jsdelivr.net/npm/gsap@${GSAP_VERSION}/dist/gsap.min.js`;";
const productionSplitTextSource = "const SPLIT_TEXT_SOURCE = window.location.hostname === 'nischhalsubba.com.np'\n  ? `/runtime/gsap/SplitText-${GSAP_VERSION}.min.js`\n  : `https://cdn.jsdelivr.net/npm/gsap@${GSAP_VERSION}/dist/SplitText.min.js`;";
const originalMediaConditions = "      canHover: '(hover: hover) and (pointer: fine)',\n      reduce: '(prefers-reduced-motion: reduce)',";
const compatibleMediaConditions = "      canHover: '(any-hover: hover) and (any-pointer: fine)',\n      reduce: '(prefers-reduced-motion: reduce)',\n      baseline: '(min-width: 0px)',";

if (!motionSource.includes(gsapSourceLine) || !motionSource.includes(splitTextSourceLine)) {
  throw new Error('[refined-button-motion] Expected pinned CDN runtime declarations were not found.');
}
if (!motionSource.includes(originalMediaConditions)) {
  throw new Error('[refined-button-motion] Expected primary-pointer media conditions were not found.');
}

motionSource = motionSource
  .replace(gsapSourceLine, productionGsapSource)
  .replace(splitTextSourceLine, productionSplitTextSource)
  .replace(originalMediaConditions, compatibleMediaConditions);

if (motionSource === originalMotionSource) {
  throw new Error('[refined-button-motion] No production motion runtime compatibility changes were applied.');
}
if (!motionSource.includes("canHover: '(any-hover: hover) and (any-pointer: fine)'")) {
  throw new Error('[refined-button-motion] Hybrid fine-pointer hover capability was not enabled.');
}
if (!motionSource.includes("baseline: '(min-width: 0px)'")) {
  throw new Error('[refined-button-motion] Baseline control initialization condition was not added.');
}
if (!motionSource.includes("? `/runtime/gsap/gsap-${GSAP_VERSION}.min.js`")) {
  throw new Error('[refined-button-motion] Production GSAP source was not rewritten to the same-origin runtime route.');
}

fs.writeFileSync(stylePath, css, 'utf8');
fs.writeFileSync(motionScriptPath, motionSource, 'utf8');
console.log(`Finalized refined button motion compatibility in ${path.relative(repositoryRoot, stylePath)} and ${path.relative(repositoryRoot, motionScriptPath)}.`);
