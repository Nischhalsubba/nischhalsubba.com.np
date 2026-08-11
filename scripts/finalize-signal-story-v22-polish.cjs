/**
 * @fileoverview scripts/finalize-signal-story-v22-polish.cjs
 * Purpose: Node-based build, content transformation, QA, or maintenance tool for finalize signal story v22 polish.
 * Responsibilities:
 * - Own the behavior/content implied by this file's single responsibility.
 * - Keep public routes, build contracts, and imported module boundaries stable unless the connected owners are updated together.
 * Execution context: Node.js CLI during local development, CI, build, or maintenance.
 * Connected files:
 * - docs/repository/file-catalog.md
 * - package.json
 * - scripts/build-dist.cjs
 * Maintenance: Update this header when responsibility or dependencies change; generated/vendor files are documented at their source instead.
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
