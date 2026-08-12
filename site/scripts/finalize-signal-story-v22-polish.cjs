/**
 * @fileoverview scripts/finalize-signal-story-v22-polish.cjs
 * Purpose: Apply the finalize signal story v22 polish production transformation or maintenance step while preserving canonical source/build contracts.
 * Responsibilities:
 * - Operate deterministically on canonical source or build output so repeated runs produce stable results.
 * - Surface invalid input or contract drift as explicit failures instead of silently masking it.
 * - Keep path assumptions synchronized with repository manifests and source-layout ownership.
 * Execution context: Node.js CLI during development, generation, build, CI, or repository maintenance.
 * Connected files:
 * - package.json
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const base = process.argv.includes('--dist') ? path.join(root, 'dist') : root;
const stylePath = path.join(base, 'style.css');
if (!fs.existsSync(stylePath)) throw new Error('[hero-story-v22-polish] Missing style.css.');

let css = fs.readFileSync(stylePath, 'utf8');
const marker = /\/\* nrs-hero-story-v22-polish:start \*\/[\s\S]*?\/\* nrs-hero-story-v22-polish:end \*\//g;
css = css.replace(marker, '').trimEnd();
css += `

/* nrs-hero-story-v22-polish:start */
.nrs-uploaded-hero-v19 .nrs-visual-grid{opacity:var(--story-grid-alpha,.55)!important;filter:opacity(.62)!important}
.nrs-uploaded-hero-v19 .nrs-orbit{opacity:var(--story-orbit-alpha,1)!important;filter:opacity(.56) drop-shadow(0 0 7px color-mix(in srgb,var(--nrs-u-orange) 12%,transparent))!important}
html[data-theme="light"] .nrs-uploaded-hero-v19 .nrs-pixel-field{filter:opacity(.72)!important}
.nrs-uploaded-hero-v19 .nrs-uploaded-btn::before,.nrs-uploaded-hero-v19 .nrs-uploaded-btn::after{content:none!important;display:none!important}
.nrs-uploaded-hero-v19 .nrs-uploaded-btn span{position:relative!important;z-index:1!important;display:inline!important}
/* nrs-hero-story-v22-polish:end */\n`;
fs.writeFileSync(stylePath, css, 'utf8');
if (!css.includes('nrs-hero-story-v22-polish:start')) throw new Error('[hero-story-v22-polish] Verification failed.');
console.log('[hero-story-v22-polish] Safe opacity and CTA composition installed.');
