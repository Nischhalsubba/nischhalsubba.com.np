/**
 * @fileoverview scripts/ensure-final-mobile-layout.cjs
 * Purpose: Node-based build, content transformation, QA, or maintenance tool for ensure final mobile layout.
 * Responsibilities:
 * - Own the behavior/content implied by this file's single responsibility.
 * - Keep public routes, build contracts, and imported module boundaries stable unless the connected owners are updated together.
 * Execution context: Node.js CLI during local development, CI, build, or maintenance.
 * Connected files:
 * - docs/repository/file-catalog.md
 * - scripts/build-dist.cjs
 * - package.json
 * Maintenance: Update this header when responsibility or dependencies change; generated/vendor files are documented at their source instead.
 */
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const targetRoot = process.argv.includes('--dist') ? path.join(root, 'dist') : root;
const stylesheetPath = path.join(targetRoot, 'style.css');
const marker = '/* nrs-final-mobile-layout-v3 */';

if (!fs.existsSync(stylesheetPath)) {
  throw new Error(`Missing stylesheet: ${path.relative(root, stylesheetPath)}`);
}

const rules = `${marker}
/*
 * Verified first-screen contract for phones and tablets.
 * This is deliberately the final generated CSS block. It neutralizes legacy
 * flex/grid centering, viewport heights, transforms, offsets and implicit rows
 * before the runtime geometry guard performs a final measured check.
 */
@media (max-width: 1100px) {
  :root {
    --nrs-responsive-header-clearance: calc(env(safe-area-inset-top, 0px) + 100px);
    --nrs-responsive-first-surface-end: 52px;
  }

  html body main,
  html body main.container {
    display: block !important;
    min-height: 0 !important;
    height: auto !important;
    margin-block-start: 0 !important;
    margin-top: 0 !important;
    padding-block-start: 0 !important;
    padding-top: 0 !important;
    align-content: start !important;
    align-items: start !important;
    justify-content: start !important;
    place-content: start !important;
  }

  html body main.container > :first-child {
    display: block !important;
    position: relative !important;
    inset: auto !important;
    top: auto !important;
    bottom: auto !important;
    min-height: 0 !important;
    height: auto !important;
    margin-block-start: 0 !important;
    margin-top: 0 !important;
    padding-block-start: var(--nrs-responsive-header-clearance) !important;
    padding-top: var(--nrs-responsive-header-clearance) !important;
    padding-bottom: var(--nrs-responsive-first-surface-end) !important;
    grid-template-rows: none !important;
    grid-auto-rows: auto !important;
    align-content: start !important;
    align-items: start !important;
    justify-content: start !important;
    place-content: start !important;
    align-self: auto !important;
    justify-self: auto !important;
    opacity: 1 !important;
    transform: none !important;
  }

  html body main.container > :first-child :is(
    .hero-section,
    .nrs-home-hero,
    .nrs-home-hero-clean,
    .nrs-page-hero,
    .nrs-about-v2-hero,
    .nrs-contact-v2-hero,
    .nrs-contact-v3-hero,
    .nrs-contact-redesign-hero,
    .nrs-services-shell,
    .nrs-services-hero,
    .nrs-services-index-hero,
    .nrs-services-v49,
    .nrs-services-v49-hero,
    .nrs-spacious-page,
    .nrs-blog-hub-shell,
    .nrs-blog-detail-surface,
    .nrs-article-frame,
    .nrs-case-study,
    .nrs-case-hero,
    article.section-container
  ) {
    position: static !important;
    inset: auto !important;
    top: auto !important;
    min-height: 0 !important;
    height: auto !important;
    margin-block-start: 0 !important;
    margin-top: 0 !important;
    padding-block-start: 0 !important;
    padding-top: 0 !important;
    grid-template-rows: none !important;
    grid-auto-rows: auto !important;
    align-content: start !important;
    align-items: start !important;
    justify-content: start !important;
    place-content: start !important;
    align-self: auto !important;
    justify-self: auto !important;
    opacity: 1 !important;
    transform: none !important;
  }

  html body main.container > :first-child :is(
    h1,
    .hero-title,
    .eyebrow,
    .nrs-wayfinding,
    .nrs-detail-breadcrumb,
    .nrs-blog-utility
  ) {
    min-height: 0 !important;
    height: auto !important;
    margin-block-start: 0 !important;
    margin-top: 0 !important;
    padding-block-start: 0 !important;
    top: auto !important;
    opacity: 1 !important;
    transform: none !important;
  }

  html body main.container > :first-child :is(.nrs-wayfinding, .nrs-detail-breadcrumb, .nrs-blog-utility) {
    margin-bottom: clamp(18px, 3vw, 32px) !important;
  }

  html body main.container > :first-child :is(.nrs-home-hero, .nrs-services-hero, .nrs-contact-v3-hero, .nrs-page-hero) {
    grid-template-columns: minmax(0, 1fr) !important;
  }

  html body main.container > :first-child[data-nrs-responsive-top-spacing-fixed='true'] {
    overflow: visible !important;
  }
}

@media (max-width: 850px) {
  :root {
    --nrs-responsive-header-clearance: calc(env(safe-area-inset-top, 0px) + 88px);
    --nrs-responsive-first-surface-end: 44px;
  }
}

@media (max-width: 480px) {
  :root {
    --nrs-responsive-header-clearance: calc(env(safe-area-inset-top, 0px) + 84px);
    --nrs-responsive-first-surface-end: 40px;
  }
}
`;

let stylesheet = fs.readFileSync(stylesheetPath, 'utf8');
stylesheet = stylesheet
  .replace(/\/\* nrs-final-mobile-layout-v\d+ \*\/[\s\S]*$/g, '')
  .trimEnd();
stylesheet += `\n\n${rules}`;
fs.writeFileSync(stylesheetPath, stylesheet, 'utf8');
console.log(`Applied verified mobile and tablet first-screen contract to ${path.relative(root, stylesheetPath)}.`);