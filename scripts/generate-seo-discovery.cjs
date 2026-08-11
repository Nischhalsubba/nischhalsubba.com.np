const fs = require('node:fs');
const path = require('node:path');
const {
  loadManifest,
  buildSitemap,
  buildRobots,
  buildRedirectFile,
  buildRedirectModule,
  normalizeOwnedUrlsInText,
  normalizeJsonUrls,
} = require('./seo-discovery-lib.cjs');

/*
 * Generates and normalizes crawler/search/AI discovery source.
 *
 * Canonical discovery files live in src/discovery/. Root copies are temporary
 * compatibility material created by scripts/repository/materialize-root-sources.cjs.
 * Redirect output remains under public/ and src/generated/ because those paths are
 * direct build/runtime contracts.
 */

const root = path.resolve(__dirname, '..');
const discoveryRoot = path.join(root, 'src', 'discovery');
const manifest = loadManifest(root);
const failures = [];

function writeFile(target, content) {
  fs.mkdirSync(path.dirname(target), { recursive: true });
  const previous = fs.existsSync(target) ? fs.readFileSync(target, 'utf8') : null;
  if (previous !== content) fs.writeFileSync(target, content, 'utf8');
  return previous !== content;
}

function writeDiscoveryText(relativePath, content) {
  return writeFile(path.join(discoveryRoot, relativePath), content);
}

function normalizeTextFile(relativePath) {
  const target = path.join(discoveryRoot, relativePath);
  if (!fs.existsSync(target)) return failures.push(`src/discovery/${relativePath}: missing discovery file`);
  const source = fs.readFileSync(target, 'utf8');
  const { output, unknown } = normalizeOwnedUrlsInText(source, manifest);
  if (unknown.length) failures.push(`src/discovery/${relativePath}: unknown owned URL(s): ${unknown.join(', ')}`);
  if (!unknown.length && output !== source) fs.writeFileSync(target, output, 'utf8');
}

function normalizeJsonFile(relativePath) {
  const target = path.join(discoveryRoot, relativePath);
  if (!fs.existsSync(target)) return failures.push(`src/discovery/${relativePath}: missing discovery file`);

  let parsed;
  try {
    parsed = JSON.parse(fs.readFileSync(target, 'utf8'));
  } catch (error) {
    return failures.push(`src/discovery/${relativePath}: invalid JSON (${error.message})`);
  }

  const unknown = new Set();
  const normalized = normalizeJsonUrls(parsed, manifest, unknown);
  if (unknown.size) failures.push(`src/discovery/${relativePath}: unknown owned URL(s): ${[...unknown].join(', ')}`);
  if (!unknown.size) fs.writeFileSync(target, `${JSON.stringify(normalized, null, 2)}\n`, 'utf8');
}

const changed = [];
if (writeDiscoveryText('sitemap.xml', buildSitemap(manifest))) changed.push('src/discovery/sitemap.xml');
if (writeDiscoveryText('robots.txt', buildRobots())) changed.push('src/discovery/robots.txt');
if (writeFile(path.join(root, 'public', '_redirects'), buildRedirectFile(manifest))) changed.push('public/_redirects');
if (writeFile(path.join(root, 'src', 'generated', 'legacy-redirects.js'), buildRedirectModule(manifest))) changed.push('src/generated/legacy-redirects.js');

normalizeTextFile('llms.txt');
normalizeTextFile('llms-full.txt');
normalizeJsonFile('ai-profile.json');

if (fs.existsSync(path.join(root, 'public', 'nischhal-raj-subba.html'))) {
  failures.push('public/nischhal-raj-subba.html: duplicate entity page must remain retired; homepage is the canonical entity page');
}

if (failures.length) {
  console.error(`[seo-discovery] ${failures.length} failure(s)\n${failures.map((item) => `- ${item}`).join('\n')}`);
  process.exit(1);
}

console.log(`[seo-discovery] Canonical discovery assets synchronized from ${manifest.html.length} routes and ${Object.keys(manifest.redirects).length} redirects${changed.length ? `; rewrote ${changed.join(', ')}` : ''}.`);
