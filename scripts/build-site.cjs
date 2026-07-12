const { spawnSync } = require('node:child_process');

const stages = [
  ['Sanitize source CSS', ['node', 'scripts/sanitize-source-css.cjs']],
  ['Generate portfolio content', ['node', 'scripts/update-portfolio-content.cjs']],
  ['Generate about and contact pages', ['node', 'scripts/generate-about-contact-pages.cjs']],
  ['Apply contact redesign', ['node', 'scripts/ensure-contact-redesign.cjs']],
  ['Apply about/contact v2', ['node', 'scripts/ensure-about-contact-v2.cjs']],
  ['Apply homepage audit copy', ['node', 'scripts/ensure-homepage-audit-copy.cjs']],
  ['Apply entity proof signals', ['node', 'scripts/ensure-entity-proof-signals.cjs']],
  ['Generate SEO growth assets', ['node', 'scripts/ensure-seo-growth-assets.cjs']],
  ['Apply search intent metadata', ['node', 'scripts/ensure-search-intents.cjs']],
  ['Apply SEO code fixes', ['node', 'scripts/ensure-seo-code-fixes.cjs']],
  ['Generate blog covers', ['node', 'scripts/ensure-blog-generated-covers.cjs']],
  ['Apply homepage hero layout', ['node', 'scripts/ensure-homepage-hero-layout.cjs']],
  ['Normalize source HTML runtime', ['node', 'scripts/normalize-html-runtime.cjs']],
  ['Build Vite site', ['npx', 'vite', 'build']],
  ['Copy production assets', ['node', 'scripts/copy-static-assets.cjs']],
  ['Apply final site polish', ['node', 'scripts/ensure-site-final-polish.cjs', '--dist']],
  ['Apply about/contact v2 styles', ['node', 'scripts/ensure-about-contact-v2-styles.cjs', '--dist']],
  ['Apply mobile header polish', ['node', 'scripts/ensure-mobile-header-polish.cjs', '--dist']],
  ['Apply canonical and redirect cleanup', ['node', 'scripts/ensure-final-seo-canonical-cleanup.cjs', '--dist']],
  ['Apply blog detail polish', ['node', 'scripts/ensure-blog-detail-polish.cjs', '--dist']],
  ['Apply audit completion pass', ['node', 'scripts/ensure-audit-completion.cjs']],
  ['Generate resume PDF', ['node', 'scripts/generate-resume-pdf.cjs']],
];

for (const [label, [command, ...args]] of stages) {
  console.log(`\n[build] ${label}`);
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });

  if (result.error) {
    console.error(`[build] Could not start ${label}:`, result.error.message);
    process.exit(1);
  }

  if (result.status !== 0) {
    console.error(`[build] ${label} failed with exit code ${result.status}.`);
    process.exit(result.status || 1);
  }
}

console.log('\n[build] Portfolio build completed successfully.');
