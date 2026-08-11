/**
 * @fileoverview scripts/repository/source-layout.cjs
 * Purpose: Define the canonical organized-source to historical-root compatibility mappings used by development and build tooling.
 * Responsibilities:
 * - Operate deterministically on canonical source or build output so repeated runs produce stable results.
 * - Surface invalid input or contract drift as explicit failures instead of silently masking it.
 * - Keep path assumptions synchronized with repository manifests and source-layout ownership.
 * Execution context: Node.js CLI during development, generation, build, CI, or repository maintenance.
 * Connected files:
 * - config/repository/root-policy.json
 * - scripts/repository/audit-repository-structure.cjs
 * - scripts/repository/clean-root-sources.cjs
 * - package.json
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
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

const ROOT_PAGE_NAMES = manifest.html.filter(/** Callback contract: Decide whether the current item should remain in the filtered result used by the enclosing operation. Inputs: `file`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ (file) => !file.includes('/'));
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
 * Purpose: Resolve a historical root-compatible HTML filename to its canonical core, project, or service source folder.
 * Inputs: `name`: stable identifier or label for the current item
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function organizedPageSource(name) {
  if (name.startsWith('project-')) return path.join('src', 'pages', 'projects', name);
  if (SERVICE_PAGE_NAMES.has(name)) return path.join('src', 'pages', 'services', name);
  return path.join('src', 'pages', 'core', name);
}

const mappings = [
  ...ROOT_PAGE_NAMES.map(/** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `name`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ (name) => ({ source: organizedPageSource(name), target: name, sync: true })),
  ...LEGACY_COMPATIBILITY_NAMES.map(/** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `name`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ (name) => ({ source: path.join('src', 'compat', 'legacy-pages', name), target: name, sync: true })),
  { source: path.join('src', 'styles', 'style.css'), target: 'style.css', sync: true },
  { source: path.join('src', 'runtime', 'script.js'), target: 'script.js', sync: false },
  ...DISCOVERY_NAMES.map(/** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `name`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ (name) => ({ source: path.join('src', 'discovery', name), target: name, sync: false })),
];

/**
 * Function contract: ensureParent
 * Purpose: Apply parent consistently while preserving the surrounding source layout repository tool contract.
 * Inputs: `file`: repository-relative or absolute file path being processed
 * Side effects: writes repository/filesystem state.
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
 */
function ensureParent(file) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
}

/**
 * Function contract: copyRequired
 * Purpose: Implement the copy required responsibility owned by the source layout repository tool.
 * Inputs: `source`: source text or source object being processed; `target`: input consumed by this operation
 * Side effects: writes repository/filesystem state.
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
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
/**
 * Function contract: materializeRootSources
 * Purpose: Implement the materialize root sources responsibility owned by the source layout repository tool.
 * Inputs: None; derives required state from the enclosing module/runtime context.
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
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
/**
 * Function contract: syncRootSources
 * Purpose: Synchronize root sources with the requested state while preserving related source layout repository tool invariants.
 * Inputs: None; derives required state from the enclosing module/runtime context.
 * Side effects: writes repository/filesystem state.
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function syncRootSources() {
  let synced = 0;
  for (const mapping of mappings.filter(/** Callback contract: Processes the callback step for mappings without leaking orchestration details to the caller. Inputs: item. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Decide whether the current item should remain in the filtered result used by the enclosing operation. Inputs: `item`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ (item) => item.sync)) {
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
/**
 * Function contract: cleanRootSources
 * Purpose: Remove root sources without disturbing required surrounding source layout repository tool state.
 * Inputs: None; derives required state from the enclosing module/runtime context.
 * Side effects: writes repository/filesystem state.
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
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
