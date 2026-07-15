const { spawnSync } = require('node:child_process');

const stages = [
  ['Preflight build script syntax', ['node', 'scripts/preflight-build-scripts.cjs']],
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
  ['Apply spacious core page layouts', ['node', 'scripts/ensure-spacious-core-pages.cjs']],
  ['Normalize case study system in source', ['node', 'scripts/normalize-case-study-system.cjs']],
  ['Validate About and Contact source', ['node', 'scripts/validate-about-contact.cjs']],
  ['Enforce homepage and work source', ['node', 'scripts/enforce-home-work-contract.cjs']],
  ['Enforce canonical Services source', ['node', 'scripts/enforce-services-template.cjs']],
  ['Normalize semantic headings in source', ['node', 'scripts/ensure-semantic-headings.cjs']],
  ['Compile single design stylesheet', ['node', 'scripts/compile-single-stylesheet.cjs']],
  ['Normalize article navigation and typography', ['node', 'scripts/ensure-navigation-font-consistency.cjs']],
  ['Enforce two-role typography in source', ['node', 'scripts/ensure-typography-system.cjs']],
  ['Apply responsive guardrails in source', ['node', 'scripts/ensure-responsive-design-guardrails.cjs']],
  ['Enforce one article navigation in source', ['node', 'scripts/normalize-blog-detail-template.cjs']],
  ['Normalize shared site shell in source', ['node', 'scripts/ensure-shared-site-shell.cjs']],
  ['Normalize source HTML runtime', ['node', 'scripts/normalize-html-runtime.cjs']],
  ['Build Vite site', ['npx', 'vite', 'build']],
  ['Clean initial Vite public output', ['node', 'scripts/clean-vite-public-output.cjs']],
  ['Copy canonical HTML routes', ['node', 'scripts/copy-canonical-routes.cjs']],
  ['Configure protected contact output', ['node', 'scripts/configure-contact-protection.cjs', '--dist']],
  ['Copy production assets', ['node', 'scripts/copy-static-assets.cjs']],
  ['Localize portrait assets in build', ['node', 'scripts/normalize-portrait-assets.cjs', '--dist']],
  ['Apply final site polish', ['node', 'scripts/ensure-site-final-polish.cjs', '--dist']],
  ['Apply about/contact v2 styles', ['node', 'scripts/ensure-about-contact-v2-styles.cjs', '--dist']],
  ['Apply mobile header polish', ['node', 'scripts/ensure-mobile-header-polish.cjs', '--dist']],
  ['Apply canonical and redirect cleanup', ['node', 'scripts/ensure-final-seo-canonical-cleanup.cjs', '--dist']],
  ['Normalize all production canonicals', ['node', 'scripts/normalize-production-canonicals.cjs', '--dist']],
  ['Reapply single design stylesheet to build', ['node', 'scripts/compile-single-stylesheet.cjs', '--dist']],
  ['Finalize article navigation and typography', ['node', 'scripts/ensure-navigation-font-consistency.cjs', '--dist']],
  ['Enforce two-role typography in build', ['node', 'scripts/ensure-typography-system.cjs', '--dist']],
  ['Apply responsive guardrails in build', ['node', 'scripts/ensure-responsive-design-guardrails.cjs', '--dist']],
  ['Enforce one article navigation in build', ['node', 'scripts/normalize-blog-detail-template.cjs', '--dist']],
  ['Normalize semantic headings in build', ['node', 'scripts/ensure-semantic-headings.cjs', '--dist']],
  ['Apply audit completion pass', ['node', 'scripts/ensure-audit-completion.cjs']],
  ['Finalize shared site shell in build', ['node', 'scripts/ensure-shared-site-shell.cjs', '--dist']],
  ['Normalize case study system in build', ['node', 'scripts/normalize-case-study-system.cjs', '--dist']],
  ['Clean retired output before validation', ['node', 'scripts/clean-vite-public-output.cjs']],
  ['Validate About and Contact build', ['node', 'scripts/validate-about-contact.cjs', '--dist']],
  ['Enforce homepage and work build', ['node', 'scripts/enforce-home-work-contract.cjs', '--dist']],
  ['Enforce canonical Services build', ['node', 'scripts/enforce-services-template.cjs', '--dist']],
  ['Enforce canonical production routes', ['node', 'scripts/enforce-production-routes.cjs']],
  ['Generate resume PDF', ['node', 'scripts/generate-resume-pdf.cjs']],
];

for (const [label, [command, ...args]] of stages) {
  console.log(`\n[build] ${label}`);
  const result = spawnSync(command, args, { stdio: 'inherit', shell: process.platform === 'win32' });
  if (result.error) { console.error(`[build] Could not start ${label}:`, result.error.message); process.exit(1); }
  if (result.status !== 0) { console.error(`[build] ${label} failed with exit code ${result.status}.`); process.exit(result.status || 1); }
}
console.log('\n[build] Portfolio build completed successfully.');
