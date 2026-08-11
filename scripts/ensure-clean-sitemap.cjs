/**
 * @fileoverview scripts/ensure-clean-sitemap.cjs
 * Purpose: Apply the ensure clean sitemap production transformation or maintenance step while preserving canonical source/build contracts.
 * Responsibilities:
 * - Operate deterministically on canonical source or build output so repeated runs produce stable results.
 * - Surface invalid input or contract drift as explicit failures instead of silently masking it.
 * - Keep path assumptions synchronized with repository manifests and source-layout ownership.
 * Execution context: Node.js CLI during development, generation, build, CI, or repository maintenance.
 * Connected files:
 * - package.json
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const SITE = 'https://nischhalsubba.com.np';
const lastmod = '2026-06-24';

const routes = [
  ['/', '1.0'],
  ['/nischhal-raj-subba', '0.95'],
  ['/projects', '0.9'],
  ['/services', '0.9'],
  ['/about', '0.85'],
  ['/blog/', '0.85'],
  ['/contact', '0.8'],
  ['/product-design-nepal', '0.84'],
  ['/web3-ux-designer', '0.84'],
  ['/saas-ux-designer', '0.84'],
  ['/website-ux-design', '0.82'],
  ['/figma-design-systems', '0.82'],
  ['/ux-audit', '0.82'],
  ['/project-yarsha', '0.8'],
  ['/project-mokshya', '0.8'],
  ['/project-hamro-idea', '0.75'],
  ['/project-morajaa', '0.78'],
  ['/project-pihub', '0.76'],
  ['/project-masteriyo', '0.74'],
  ['/project-zapp', '0.74'],
  ['/project-neverwinter-parser', '0.7'],
  ['/project-orkest', '0.74'],
  ['/project-splashnode', '0.72'],
  ['/project-grid-labs', '0.72'],
  ['/project-zakra-furniture', '0.7'],
  ['/project-designerex', '0.7'],
  ['/project-sassboilerplate', '0.72'],
  ['/blog/blog-web3-products', '0.72'],
  ['/blog/blog-good-handoff', '0.72'],
  ['/blog/blog-portfolio-product', '0.7'],
  ['/blog/blog-service-websites', '0.72'],
  ['/blog/blog-gaming-interface-clarity', '0.68'],
  ['/blog/blog-design-systems-front-end', '0.72'],
  ['/blog/web3-wallet-ux-checklist', '0.78'],
  ['/blog/transaction-review-ux-crypto-apps', '0.76'],
  ['/blog/saas-dashboard-ux-checklist', '0.78'],
  ['/blog/website-ux-checklist-software-companies', '0.76'],
  ['/blog/ux-audit-checklist-before-redesign', '0.76'],
  ['/blog/figma-handoff-notes-for-developers', '0.76'],
  ['/blog/hire-product-designer-nepal-saas-web3', '0.76'],
  ['/media-kit', '0.65'],
  ['/llms.txt', '0.4'],
  ['/llms-full.txt', '0.4'],
  ['/ai-profile.json', '0.4'],
  ['/humans.txt', '0.2'],
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes
  .map(/** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `[route, priority]`. Side effects: no direct external side effect beyond invoked dependencies. Returns: boolean predicate/result. */ ([route, priority]) => {
    const loc = route === '/' ? `${SITE}/` : `${SITE}${route}`;
    return `  <url><loc>${loc}</loc><lastmod>${lastmod}</lastmod><priority>${priority}</priority></url>`;
  })
  .join('\n')}\n</urlset>\n`;

for (const relativePath of ['sitemap.xml', 'public/sitemap.xml']) {
  fs.writeFileSync(path.join(root, relativePath), xml, 'utf8');
}

console.log(`Generated clean canonical sitemap with ${routes.length} URLs.`);
