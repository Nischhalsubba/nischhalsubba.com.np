/**
 * @fileoverview scripts/repository/source-layout.cjs
 * Purpose: Repository architecture and maintenance utility for source layout.
 * Responsibilities:
 * - Own the behavior/content implied by this file's single responsibility.
 * - Keep public routes, build contracts, and imported module boundaries stable unless the connected owners are updated together.
 * Execution context: Node.js CLI during local development, CI, build, or maintenance.
 * Connected files:
 * - config/repository/root-policy.json
 * - docs/repository/file-catalog.md
 * - docs/repository/file-map.md
 * - scripts/repository/README.md
 * Maintenance: Update this header when responsibility or dependencies change; generated/vendor files are documented at their source instead.
 */
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

const ROOT_PAGE_NAMES = manifest.html.filter(/** Callback contract: Processes the callback step for manifest.html without leaking orchestration details to the caller. Inputs: file. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (file) => !file.includes('/'));
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

const SERVICE_PAGE_NAMES = new Set([
  'figma-design-systems.html',
  'product-design-nepal.html',
  'saas-ux-designer.html',
  'ux-audit.html',
  'web3-ux-designer.html',
  'website-ux-design.html',
]);

/**
 * Function contract: organizedPageSource
 * Purpose: Resolves a historical root-page filename to its responsibility-based canonical source folder.
 * Inputs: name, the root-compatible HTML filename from the canonical route manifest.
 * Side effects: no external side effects.
 * Returns: a repository-relative source path under src/pages/core, src/pages/projects, or src/pages/services.
 */
function organizedPageSource(name) {
  if (name.startsWith('project-')) return path.join('src', 'pages', 'projects', name);
  if (SERVICE_PAGE_NAMES.has(name)) return path.join('src', 'pages', 'services', name);
  return path.join('src', 'pages', 'core', name);
}

const mappings = [
  ...ROOT_PAGE_NAMES.map(/** Callback contract: Processes the callback step for root page names without leaking orchestration details to the caller. Inputs: name. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (name) => ({ source: organizedPageSource(name), target: name, sync: true })),
  ...LEGACY_COMPATIBILITY_NAMES.map(/** Callback contract: Processes the callback step for legacy compatibility names without leaking orchestration details to the caller. Inputs: name. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (name) => ({ source: path.join('src', 'compat', 'legacy-pages', name), target: name, sync: true })),
  { source: path.join('src', 'styles', 'style.css'), target: 'style.css', sync: true },
  { source: path.join('src', 'runtime', 'script.js'), target: 'script.js', sync: false },
  ...DISCOVERY_NAMES.map(/** Callback contract: Processes the callback step for discovery names without leaking orchestration details to the caller. Inputs: name. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (name) => ({ source: path.join('src', 'discovery', name), target: name, sync: false })),
];

/**
 * Function contract: ensureParent
 * Purpose: Applies ensure parent while preserving the surrounding repository/runtime contract.
 * Inputs: file.
 * Side effects: may read or write repository/filesystem state.
 * Returns: no explicit value unless an invoked dependency throws/rejects.
 */
function ensureParent(file) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
}

/**
 * Function contract: copyRequired
 * Purpose: Implements the copy required responsibility for this module.
 * Inputs: source, target.
 * Side effects: may read or write repository/filesystem state.
 * Returns: no explicit value unless an invoked dependency throws/rejects.
 */
function copyRequired(source, target) {
  if (!fs.existsSync(source)) throw new Error(`Missing organized source: ${path.relative(ROOT, source)}`);
  ensureParent(target);
  fs.copyFileSync(source, target);
}

/**
 * Function contract: materializeRootSources
 * Purpose: Implements the materialize root sources responsibility for this module.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function materializeRootSources() {
  for (const mapping of mappings) {
    copyRequired(path.join(ROOT, mapping.source), path.join(ROOT, mapping.target));
  }
  return mappings.length;
}

/**
 * Function contract: syncRootSources
 * Purpose: Implements the sync root sources responsibility for this module.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may read or write repository/filesystem state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function syncRootSources() {
  let synced = 0;
  for (const mapping of mappings.filter(/** Callback contract: Processes the callback step for mappings without leaking orchestration details to the caller. Inputs: item. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (item) => item.sync)) {
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

/**
 * Function contract: cleanRootSources
 * Purpose: Removes or cleans clean root sources while keeping required outputs intact.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may read or write repository/filesystem state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
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
