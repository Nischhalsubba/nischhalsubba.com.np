/**
 * @fileoverview scripts/finalize-refined-button-motion.cjs
 * Purpose: Remove late-generated homepage CTA CSS declarations that would otherwise override the refined GSAP button transform and generated visual layers in the final production artifact.
 * Responsibilities:
 * - Operate only on the final source or dist stylesheet after all hero/style generators have completed.
 * - Preserve the homepage CTA visual baseline while releasing transform, overflow, transition, and descendant-span ownership to the refined motion system.
 * - Fail explicitly when the expected generated hero contract is missing so build drift cannot silently reintroduce a competing hover implementation.
 * Execution context: Node.js CLI during the final production build stage after `build-dist.cjs` and runtime normalization.
 * Connected files:
 * - scripts/finalize-signal-typography-v24.cjs
 * - src/styles/systems/interaction-motion.css
 * - src/scripts/features/motion/refined-button-motion.js
 * - package.json
 * Maintenance: Keep replacements narrow and deterministic; remove this compatibility stage only when the upstream hero generator no longer emits competing CTA motion declarations.
 */
const fs = require('node:fs');
const path = require('node:path');

const repositoryRoot = path.resolve(__dirname, '..');
const root = process.argv.includes('--dist') ? path.join(repositoryRoot, 'dist') : repositoryRoot;
const stylePath = path.join(root, 'style.css');

if (!fs.existsSync(stylePath)) {
  throw new Error(`[refined-button-motion] Stylesheet target does not exist: ${stylePath}`);
}

let css = fs.readFileSync(stylePath, 'utf8');
const ctaBlockPattern = /\.nrs-uploaded-hero-v19 \.nrs-uploaded-btn\{[\s\S]*?\n\}/;
const ctaBlockMatch = css.match(ctaBlockPattern);
if (!ctaBlockMatch) {
  throw new Error('[refined-button-motion] Expected generated homepage CTA contract was not found.');
}

const original = css;
const originalCtaBlock = ctaBlockMatch[0];
const normalizedCtaBlock = originalCtaBlock
  .replace('overflow:visible!important;', 'overflow:hidden!important;')
  .replace(
    'transition:transform .16s cubic-bezier(.2,0,0,1),border-color .16s ease,background-color .16s ease!important;',
    'transition:border-color .16s ease,background-color .16s ease,color .16s ease!important;',
  );

if (normalizedCtaBlock === originalCtaBlock) {
  throw new Error('[refined-button-motion] Homepage CTA block did not contain the expected transform/overflow compatibility declarations.');
}

css = css
  .replace(ctaBlockPattern, normalizedCtaBlock)
  .replace(
    '.nrs-uploaded-hero-v19 .nrs-uploaded-btn span{',
    '.nrs-uploaded-hero-v19 .nrs-uploaded-btn > span[aria-hidden="true"]:not([class]){',
  )
  .replace(
    /@media\(hover:hover\) and \(pointer:fine\)\{\s*\.nrs-uploaded-hero-v19 \.nrs-uploaded-btn:hover\{transform:translateY\(-2px\)!important\}\s*\}/g,
    '',
  );

if (css === original) {
  throw new Error('[refined-button-motion] No production CTA compatibility changes were applied.');
}

const finalCtaBlock = css.match(ctaBlockPattern)?.[0] || '';
if (!finalCtaBlock.includes('overflow:hidden!important;')) {
  throw new Error('[refined-button-motion] Homepage CTA overflow is not clipped for pointer-origin fill.');
}

if (finalCtaBlock.includes('transition:transform')) {
  throw new Error('[refined-button-motion] Competing CSS transform transition remains in the homepage CTA block.');
}

if (/\.nrs-uploaded-hero-v19 \.nrs-uploaded-btn:hover\{transform:[^}]*!important\}/.test(css)) {
  throw new Error('[refined-button-motion] Competing uploaded CTA hover transform remains in the final stylesheet.');
}

if (/\.nrs-uploaded-hero-v19 \.nrs-uploaded-btn span\{/.test(css)) {
  throw new Error('[refined-button-motion] Broad uploaded CTA descendant-span override remains in the final stylesheet.');
}

fs.writeFileSync(stylePath, css, 'utf8');
console.log(`Finalized refined button motion compatibility in ${path.relative(repositoryRoot, stylePath)}.`);
