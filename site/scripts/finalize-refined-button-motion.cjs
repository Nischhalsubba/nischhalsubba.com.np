/**
 * @fileoverview scripts/finalize-refined-button-motion.cjs
 * Purpose: Finalize generated CSS compatibility for the refined GSAP button system and verify the built runtime already contains its production-safe source contracts.
 * Responsibilities:
 * - Remove late-generated homepage CTA CSS declarations that would compete with GSAP transforms and generated visual layers.
 * - Verify the copied motion runtime initializes every pointer type and uses hybrid-pointer hover capability.
 * - Verify production GSAP dependencies are resolved through same-origin runtime routes directly by canonical source.
 * - Fail explicitly when generated CSS or runtime contracts drift so incompatible production output cannot ship silently.
 * Execution context: Node.js CLI during the final production build stage after `build-dist.cjs` and runtime normalization.
 * Connected files:
 * - src/styles/systems/interaction-motion.css
 * - src/scripts/features/motion/refined-button-motion.js
 * - src/worker.js
 * - package.json
 * Maintenance: Keep this stage limited to generated-output compatibility and validation; browser runtime behavior belongs in canonical source.
 */
const fs = require('node:fs');
const path = require('node:path');

const repositoryRoot = path.resolve(__dirname, '..');
const root = process.argv.includes('--dist') ? path.join(repositoryRoot, 'dist') : repositoryRoot;
const stylePath = path.join(root, 'style.css');
const motionScriptPath = path.join(root, 'src', 'scripts', 'features', 'motion', 'refined-button-motion.js');

/**
 * Function contract: requireFile
 * Purpose: Fail the build with a focused diagnostic when one generated compatibility target is missing.
 * Inputs: `filePath` - absolute target path; `label` - human-readable target description.
 * Side effects: Reads filesystem existence state and may throw.
 * Returns: Undefined when the target exists.
 */
function requireFile(filePath, label) {
  if (!fs.existsSync(filePath)) throw new Error(`[refined-button-motion] ${label} does not exist: ${filePath}`);
}

/**
 * Function contract: finalizeHeroButtonCss
 * Purpose: Remove final generated homepage CTA declarations that would override GSAP transform ownership or visual-layer clipping.
 * Inputs: `css` - complete generated stylesheet text.
 * Side effects: None.
 * Returns: Updated stylesheet text with the final homepage CTA block normalized.
 */
function finalizeHeroButtonCss(css) {
  const heroTypePattern = /\/\* nrs-hero-type-v24:start \*\/[\s\S]*?\/\* nrs-hero-type-v24:end \*\//;
  const heroTypeMatch = css.match(heroTypePattern);
  if (!heroTypeMatch) throw new Error('[refined-button-motion] Expected final hero typography block was not found.');

  const originalHeroType = heroTypeMatch[0];
  const ctaBlockPattern = /\.nrs-uploaded-hero-v19 \.nrs-uploaded-btn\{[\s\S]*?\n\}/;
  const ctaBlockMatch = originalHeroType.match(ctaBlockPattern);
  if (!ctaBlockMatch) throw new Error('[refined-button-motion] Expected final homepage CTA block was not found inside hero typography v24.');

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

  const updated = css.replace(heroTypePattern, normalizedHeroType);
  const finalHeroType = updated.match(heroTypePattern)?.[0] || '';
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

  return updated;
}

/**
 * Function contract: validateMotionRuntime
 * Purpose: Verify the built runtime already owns production dependency routing, baseline input initialization, and hybrid hover capability without post-build source rewriting.
 * Inputs: `source` - complete copied refined motion runtime source.
 * Side effects: May throw focused build diagnostics when required contracts are absent.
 * Returns: Undefined when every runtime contract is present.
 */
function validateMotionRuntime(source) {
  const required = [
    "baseline: '(min-width: 0px)'",
    "canHover: '(any-hover: hover) and (any-pointer: fine)'",
    "? `/runtime/gsap/gsap-${GSAP_VERSION}.min.js`",
    "? `/runtime/gsap/SplitText-${GSAP_VERSION}.min.js`",
    "const DISCOVERY_SELECTOR = 'button, [role=\"button\"], a[href]'",
    "control.matches('[data-motion=\"off\"], [aria-hidden=\"true\"]')",
  ];

  for (const contract of required) {
    if (!source.includes(contract)) throw new Error(`[refined-button-motion] Built runtime is missing source contract: ${contract}`);
  }

  if (source.includes("canHover: '(hover: hover) and (pointer: fine)'")) {
    throw new Error('[refined-button-motion] Built runtime regressed to primary-pointer-only hover capability.');
  }
  if (source.includes("control.closest('[aria-hidden=\"true\"]')")) {
    throw new Error('[refined-button-motion] Built runtime still excludes controls solely because a hidden ancestor has not opened yet.');
  }
}

requireFile(stylePath, 'Stylesheet target');
requireFile(motionScriptPath, 'Motion runtime target');

const originalCss = fs.readFileSync(stylePath, 'utf8');
const finalizedCss = finalizeHeroButtonCss(originalCss);
if (finalizedCss === originalCss) throw new Error('[refined-button-motion] No production CTA compatibility changes were applied.');

const motionSource = fs.readFileSync(motionScriptPath, 'utf8');
validateMotionRuntime(motionSource);

fs.writeFileSync(stylePath, finalizedCss, 'utf8');
console.log(`Finalized refined button CSS compatibility and verified canonical runtime in ${path.relative(repositoryRoot, stylePath)}.`);
