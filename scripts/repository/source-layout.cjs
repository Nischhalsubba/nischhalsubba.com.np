const fs = require('node:fs');
const path = require('node:path');

/*
 * Repository source-layout contract.
 *
 * Canonical authored files live under src/. Historical build scripts still expect
 * selected HTML, CSS, runtime, and discovery files at repository root. This module
 * materializes those compatibility paths for dev/build and can sync intentional
 * source-generation changes back into the organized source tree.
 *
 * Connected files:
 * - config/canonical-routes.json: canonical route inventory.
 * - scripts/repository/materialize-root-sources.cjs: canonical -> compatibility.
 * - scripts/repository/sync-root-sources.cjs: compatibility -> canonical.
 * - scripts/repository/clean-root-sources.cjs: removes compatibility copies.
 * - scripts/build-dist.cjs and vite.config.ts: consume materialized root paths.
 */

const ROOT = path.resolve(__dirname, '../..');
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'config', 'canonical-routes.json'), 'utf8'));

const ROOT_PAGE_NAMES = manifest.html.filter((file) => !file.includes('/'));
const LEGACY_COMPATIBILITY_NAMES = ['home.html', 'home-v2.html', 'blog.html'];
const DISCOVERY_NAMES = [
  '_headers',
  'ai-profile.json',
  'humans.txt',
  'llms.txt',
  'llms-full.txt',
  'robots.txt',
  'sitemap.xml',
  'site.webmanifest',
];

const mappings = [
  ...ROOT_PAGE_NAMES.map((name) => ({ source: path.join('src', 'pages', name), target: name, sync: true })),
  ...LEGACY_COMPATIBILITY_NAMES.map((name) => ({ source: path.join('src', 'compat', 'legacy-pages', name), target: name, sync: true })),
  { source: path.join('src', 'styles', 'style.css'), target: 'style.css', sync: true },
  { source: path.join('src', 'runtime', 'script.js'), target: 'script.js', sync: false },
  ...DISCOVERY_NAMES.map((name) => ({ source: path.join('src', 'discovery', name), target: name, sync: false })),
];

function ensureParent(file) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
}

function copyRequired(source, target) {
  if (!fs.existsSync(source)) throw new Error(`Missing organized source: ${path.relative(ROOT, source)}`);
  ensureParent(target);
  fs.copyFileSync(source, target);
}

function materializeRootSources() {
  for (const mapping of mappings) {
    copyRequired(path.join(ROOT, mapping.source), path.join(ROOT, mapping.target));
  }
  return mappings.length;
}

function syncRootSources() {
  let synced = 0;
  for (const mapping of mappings.filter((item) => item.sync)) {
    const rootFile = path.join(ROOT, mapping.target);
    if (!fs.existsSync(rootFile)) continue;
    const sourceFile = path.join(ROOT, mapping.source);
    ensureParent(sourceFile);
    const before = fs.existsSync(sourceFile) ? fs.readFileSync(sourceFile) : null;
    const after = fs.readFileSync(rootFile);
    if (!before || !before.equals(after)) {
      fs.writeFileSync(sourceFile, after);
      synced += 1;
    }
  }
  return synced;
}

function cleanRootSources() {
  let removed = 0;
  for (const mapping of mappings) {
    const target = path.join(ROOT, mapping.target);
    if (!fs.existsSync(target)) continue;
    fs.rmSync(target, { force: true });
    removed += 1;
  }
  return removed;
}

module.exports = {
  ROOT,
  ROOT_PAGE_NAMES,
  LEGACY_COMPATIBILITY_NAMES,
  DISCOVERY_NAMES,
  mappings,
  materializeRootSources,
  syncRootSources,
  cleanRootSources,
};
