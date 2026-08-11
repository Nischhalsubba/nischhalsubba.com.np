/**
 * @fileoverview scripts/generate-seo-discovery.cjs
 * Purpose: Generate the standard search-engine and routing discovery files used by the production site.
 * Responsibilities:
 * - Rebuild the sitemap and robots file from the canonical route manifest.
 * - Keep deployment redirects synchronized with the same route definitions.
 * - Write generated files only when their contents have changed.
 * - Report conflicting public entity pages before deployment.
 * Execution context: Node.js CLI used during source generation, prebuild, and repository validation.
 * Connected files:
 * - scripts/seo-discovery-lib.cjs
 * - config/canonical-routes.json
 * - docs/seo-maintenance.md
 * - scripts/repository/source-layout.cjs
 * Maintenance: Keep this generator limited to standard web discovery and routing assets. Add new generated outputs only when they are part of the site's public deployment contract.
 */
const fs = require('node:fs');
const path = require('node:path');
const {
  loadManifest,
  buildSitemap,
  buildRobots,
  buildRedirectFile,
  buildRedirectModule,
} = require('./seo-discovery-lib.cjs');

const root = path.resolve(__dirname, '..');
const discoveryRoot = path.join(root, 'src', 'discovery');
const manifest = loadManifest(root);
const failures = [];

/**
 * Function contract: writeFile
 * Purpose: Write generated content only when it differs from the existing file.
 * Inputs: `target` - absolute output path; `content` - complete UTF-8 file contents.
 * Side effects: Creates parent directories and may write a file.
 * Returns: `true` when the file changed, otherwise `false`.
 */
function writeFile(target, content) {
  fs.mkdirSync(path.dirname(target), { recursive: true });
  const previous = fs.existsSync(target) ? fs.readFileSync(target, 'utf8') : null;
  if (previous !== content) fs.writeFileSync(target, content, 'utf8');
  return previous !== content;
}

/**
 * Function contract: writeDiscoveryText
 * Purpose: Write a canonical text discovery file under `src/discovery`.
 * Inputs: `relativePath` - filename under the discovery directory; `content` - generated contents.
 * Side effects: May update the canonical discovery file.
 * Returns: `true` when the file changed, otherwise `false`.
 */
function writeDiscoveryText(relativePath, content) {
  return writeFile(path.join(discoveryRoot, relativePath), content);
}

const changed = [];
if (writeDiscoveryText('sitemap.xml', buildSitemap(manifest))) changed.push('src/discovery/sitemap.xml');
if (writeDiscoveryText('robots.txt', buildRobots())) changed.push('src/discovery/robots.txt');
if (writeFile(path.join(root, 'public', '_redirects'), buildRedirectFile(manifest))) changed.push('public/_redirects');
if (writeFile(path.join(root, 'src', 'generated', 'legacy-redirects.js'), buildRedirectModule(manifest))) changed.push('src/generated/legacy-redirects.js');

if (fs.existsSync(path.join(root, 'public', 'nischhal-raj-subba.html'))) {
  failures.push('public/nischhal-raj-subba.html: duplicate entity page must remain retired; homepage is the canonical entity page');
}

if (failures.length) {
  console.error(`[seo-discovery] ${failures.length} failure(s)\n${failures.map( /** Callback contract: Format each validation failure as a readable list item. Inputs: `item` Side effects: None. Returns: Formatted diagnostic line. */ (item) => `- ${item}`).join('\n')}`);
  process.exit(1);
}

console.log(`[seo-discovery] Canonical web discovery assets synchronized from ${manifest.html.length} routes and ${Object.keys(manifest.redirects).length} redirects${changed.length ? `; rewrote ${changed.join(', ')}` : ''}.`);
