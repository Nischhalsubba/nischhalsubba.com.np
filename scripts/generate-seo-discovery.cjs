/**
 * @fileoverview scripts/generate-seo-discovery.cjs
 * Purpose: Node-based build, content transformation, QA, or maintenance tool for generate seo discovery.
 * Responsibilities:
 * - Own the behavior/content implied by this file's single responsibility.
 * - Keep public routes, build contracts, and imported module boundaries stable unless the connected owners are updated together.
 * Execution context: Node.js CLI during local development, CI, build, or maintenance.
 * Connected files:
 * - docs/repository/file-catalog.md
 * - docs/repository/file-map.md
 * - docs/seo-maintenance.md
 * - package.json
 * Maintenance: Update this header when responsibility or dependencies change; generated/vendor files are documented at their source instead.
 */
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

/**
 * Function contract: writeFile
 * Purpose: Applies write file while preserving the surrounding repository/runtime contract.
 * Inputs: target, content.
 * Side effects: may read or write repository/filesystem state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function writeFile(target, content) {
  fs.mkdirSync(path.dirname(target), { recursive: true });
  const previous = fs.existsSync(target) ? fs.readFileSync(target, 'utf8') : null;
  if (previous !== content) fs.writeFileSync(target, content, 'utf8');
  return previous !== content;
}

/**
 * Function contract: writeDiscoveryText
 * Purpose: Applies write discovery text while preserving the surrounding repository/runtime contract.
 * Inputs: relativePath, content.
 * Side effects: may read or write repository/filesystem state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function writeDiscoveryText(relativePath, content) {
  return writeFile(path.join(discoveryRoot, relativePath), content);
}

/**
 * Function contract: normalizeTextFile
 * Purpose: Applies normalize text file while preserving the surrounding repository/runtime contract.
 * Inputs: relativePath.
 * Side effects: may read or write repository/filesystem state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function normalizeTextFile(relativePath) {
  const target = path.join(discoveryRoot, relativePath);
  if (!fs.existsSync(target)) return failures.push(`src/discovery/${relativePath}: missing discovery file`);
  const source = fs.readFileSync(target, 'utf8');
  const { output, unknown } = normalizeOwnedUrlsInText(source, manifest);
  if (unknown.length) failures.push(`src/discovery/${relativePath}: unknown owned URL(s): ${unknown.join(', ')}`);
  if (!unknown.length && output !== source) fs.writeFileSync(target, output, 'utf8');
}

/**
 * Function contract: normalizeJsonFile
 * Purpose: Applies normalize json file while preserving the surrounding repository/runtime contract.
 * Inputs: relativePath.
 * Side effects: may read or write repository/filesystem state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
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
  console.error(`[seo-discovery] ${failures.length} failure(s)\n${failures.map(/** Callback contract: Processes the callback step for failures without leaking orchestration details to the caller. Inputs: item. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (item) => `- ${item}`).join('\n')}`);
  process.exit(1);
}

console.log(`[seo-discovery] Canonical discovery assets synchronized from ${manifest.html.length} routes and ${Object.keys(manifest.redirects).length} redirects${changed.length ? `; rewrote ${changed.join(', ')}` : ''}.`);
