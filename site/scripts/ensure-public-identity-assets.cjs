/**
 * @fileoverview scripts/ensure-public-identity-assets.cjs
 * Purpose: Generate the small public identity files used by browsers, people, and deployment tooling without duplicating the site's page content.
 * Responsibilities:
 * - Write the web app manifest used by browsers and install surfaces.
 * - Write `humans.txt` with concise ownership and public profile references.
 * - Keep these files deterministic so repeated generation produces the same result.
 * Execution context: Node.js source-generation stage run before the production build.
 * Connected files:
 * - scripts/generate-source.cjs
 * - src/discovery/site.webmanifest
 * - src/discovery/humans.txt
 * - scripts/repository/source-layout.cjs
 * Maintenance: Keep identity details factual and public. Search metadata and page-specific structured data belong to their existing page/SEO owners rather than this utility.
 */
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const SITE = 'https://nischhalsubba.com.np';
const email = 'hinischalsubba@gmail.com';
const discoveryDir = path.join(root, 'src', 'discovery');

const manifest = {
  name: 'Nischhal Raj Subba - Product Designer in Nepal',
  short_name: 'Nischhal',
  description: 'Product design portfolio by Nischhal Raj Subba, focused on UX/UI, Web3 UX, SaaS dashboards, fintech workflows, service websites, design systems, UX audits and developer-ready handoff.',
  start_url: '/',
  scope: '/',
  display: 'standalone',
  background_color: '#111111',
  theme_color: '#111111',
  icons: [
    {
      src: '/assets/images/favicon.svg',
      sizes: '512x512',
      type: 'image/svg+xml',
      purpose: 'any maskable',
    },
  ],
  categories: ['portfolio', 'design', 'productivity'],
  lang: 'en',
};

const humans = `/* TEAM */
Owner: Nischhal Raj Subba
Role: Product Designer
Location: Kathmandu, Nepal
Contact: ${email}
Website: ${SITE}/
About: ${SITE}/about
Work: ${SITE}/projects
Resume: ${SITE}/assets/resume.pdf

/* PUBLIC PROFILES */
Uxcel: https://app.uxcel.com/ux/nischhal
Behance: https://www.behance.net/nischhal
LinkedIn: https://www.linkedin.com/in/nischhal/
GitHub: https://github.com/Nischhalsubba

/* CONTENT POLICY */
Public claims should remain consistent with the website, resume, and linked public profiles.
`;

/**
 * Function contract: writeIfChanged
 * Purpose: Write a generated UTF-8 file only when its contents differ from the existing version.
 * Inputs: `target` - Absolute output path; `content` - complete file contents.
 * Side effects: Creates the parent directory and may update a file.
 * Returns: `true` when a file was written, otherwise `false`.
 */
function writeIfChanged(target, content) {
  fs.mkdirSync(path.dirname(target), { recursive: true });
  const previous = fs.existsSync(target) ? fs.readFileSync(target, 'utf8') : null;
  if (previous === content) return false;
  fs.writeFileSync(target, content, 'utf8');
  return true;
}

const changed = [];
if (writeIfChanged(path.join(discoveryDir, 'site.webmanifest'), `${JSON.stringify(manifest, null, 2)}\n`)) {
  changed.push('src/discovery/site.webmanifest');
}
if (writeIfChanged(path.join(discoveryDir, 'humans.txt'), humans)) {
  changed.push('src/discovery/humans.txt');
}

console.log(`[public-identity] Identity assets are current${changed.length ? `; updated ${changed.join(', ')}` : ''}.`);
