const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const targetRoot = process.argv.includes('--dist') ? path.join(root, 'dist') : root;
const stylesheetPath = path.join(targetRoot, 'style.css');
const marker = '/* nrs-final-mobile-layout-v2 */';

if (!fs.existsSync(stylesheetPath)) {
  throw new Error(`Missing stylesheet: ${path.relative(root, stylesheetPath)}`);
}

const rules = `${marker}
/*
 * Final above-the-fold contract for phones and tablets.
 * The shared header is fixed, so the first content surface only needs explicit
 * header clearance. Legacy page-specific viewport heights and centering rules
 * must not create an empty first screen.
 */
@media (max-width: 1100px) {
  :root {
    --nrs-responsive-header-clearance: calc(env(safe-area-inset-top, 0px) + 104px);
    --nrs-responsive-first-surface-end: 52px;
  }

  body main.container {
    min-height: 0 !important;
    height: auto !important;
    margin-top: 0 !important;
    padding-top: 0 !important;
  }

  body main.container > :first-child {
    min-height: 0 !important;
    height: auto !important;
    margin-top: 0 !important;
    padding-top: var(--nrs-responsive-header-clearance) !important;
    align-content: start !important;
    align-items: start !important;
    justify-content: start !important;
    place-content: start !important;
  }

  body main.container > :first-child:is(
    .hero-section,
    .nrs-home-hero,
    .nrs-home-hero-clean,
    .nrs-page-hero,
    .nrs-about-v2-hero,
    .nrs-contact-v2-hero,
    .nrs-contact-v3-hero,
    .nrs-services-shell,
    .nrs-services-hero,
    .nrs-services-index-hero,
    .nrs-services-v49,
    .nrs-services-v49-hero,
    .nrs-blog-hub-shell,
    .nrs-blog-detail-surface,
    .nrs-article-frame,
    .nrs-case-hero,
    article.section-container
  ) {
    padding-bottom: var(--nrs-responsive-first-surface-end) !important;
  }

  body main.container > :first-child :is(
    .hero-section,
    .nrs-page-hero,
    .nrs-about-v2-hero,
    .nrs-contact-v2-hero,
    .nrs-contact-v3-hero,
    .nrs-services-hero,
    .nrs-services-v49-hero,
    .nrs-case-hero
  ) {
    min-height: 0 !important;
    height: auto !important;
    margin-top: 0 !important;
    padding-top: 0 !important;
    align-content: start !important;
    align-items: start !important;
    justify-content: start !important;
    place-content: start !important;
  }

  body main.container > :first-child > :first-child,
  body main.container > :first-child h1,
  body main.container > :first-child .hero-title,
  body main.container > :first-child .nrs-wayfinding,
  body main.container > :first-child .nrs-detail-breadcrumb,
  body main.container > :first-child .nrs-blog-utility {
    margin-top: 0 !important;
  }

  body.nrs-contact-page .nrs-contact-v3-hero,
  body.nrs-inner-page .hero-section,
  body.nrs-project-detail-page .hero-section,
  body.nrs-blog-detail-page article.section-container,
  body.nrs-service-page .hero-section {
    min-height: 0 !important;
    height: auto !important;
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
    --nrs-responsive-header-clearance: calc(env(safe-area-inset-top, 0px) + 82px);
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
console.log(`Applied final mobile and tablet layout contract to ${path.relative(root, stylesheetPath)}.`);
