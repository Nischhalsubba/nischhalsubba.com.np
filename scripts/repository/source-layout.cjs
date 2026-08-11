/**
 * @fileoverview scripts/repository/source-layout.cjs
 * Purpose: Define how organized source files are exposed at legacy root paths required by the development and build pipeline.
 * Responsibilities:
 * - Keep canonical authored source under `src/` while preserving established root-level build contracts.
 * - Provide one shared mapping for materializing, synchronizing, and cleaning compatibility files.
 * - Fail clearly when a required canonical source file is missing.
 * Execution context: Node.js repository tooling used by development, generation, build, and cleanup commands.
 * Connected files:
 * - config/canonical-routes.json
 * - scripts/repository/materialize-root-sources.cjs
 * - scripts/repository/sync-root-sources.cjs
 * - scripts/repository/clean-root-sources.cjs
 * Maintenance: Add files here only when a root-level compatibility path is genuinely required by the current build or deployment contract.
 */
const fs = require('node:fs');
const path = require('node:path');

/*
 * Canonical authored files live under src/. Historical build scripts still expect
 * selected HTML, CSS, runtime, and discovery files at repository root. This module
 * materializes those compatibility paths for development/build and can sync
 * intentional source-generation changes back into the organized source tree.
 */

const ROOT = path.resolve(__dirname, '../..');
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'config', 'canonical-routes.json'), 'utf8'));

const ROOT_PAGE_NAMES = manifest.html.filter( /** Callback contract: Keep only route files that belong at repository root. Inputs: `file` Side effects: None. Returns: `true` when the route filename has no directory component. */ (file) => !file.includes('/'));
const LEGACY_COMPATIBILITY_NAMES = ['home.html', 'home-v2.html', 'blog.html'];
const DISCOVERY_NAMES = [
  '_headers',
  'humans.txt',
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
 * Purpose: Choose the canonical source folder for a root-compatible HTML page.
 * Inputs: `name` - HTML filename from the canonical route manifest.
 * Side effects: None.
 * Returns: Relative path to the page under `src/pages/`.
 */
function organizedPageSource(name) {
  if (name.startsWith('project-')) return path.join('src', 'pages', 'projects', name);
  if (SERVICE_PAGE_NAMES.has(name)) return path.join('src', 'pages', 'services', name);
  return path.join('src', 'pages', 'core', name);
}

const mappings = [
  ...ROOT_PAGE_NAMES.map( /** Callback contract: Map each root page to the canonical source file that owns it. Inputs: `name` Side effects: None. Returns: A source/target mapping that may be synchronized back to canonical source. */ (name) => ({ source: organizedPageSource(name), target: name, sync: true })),
  ...LEGACY_COMPATIBILITY_NAMES.map( /** Callback contract: Map each retained legacy route to its compatibility source. Inputs: `name` Side effects: None. Returns: A source/target mapping for the legacy page. */ (name) => ({ source: path.join('src', 'compat', 'legacy-pages', name), target: name, sync: true })),
  { source: path.join('src', 'styles', 'style.css'), target: 'style.css', sync: true },
  { source: path.join('src', 'runtime', 'script.js'), target: 'script.js', sync: false },
  ...DISCOVERY_NAMES.map( /** Callback contract: Map each crawler or platform discovery file to its canonical source. Inputs: `name` Side effects: None. Returns: A source/target mapping that is materialized but not synchronized from root. */ (name) => ({ source: path.join('src', 'discovery', name), target: name, sync: false })),
];

/**
 * Function contract: ensureParent
 * Purpose: Ensure the destination directory exists before writing a compatibility file.
 * Inputs: `file` - Absolute destination path.
 * Side effects: Creates missing directories on disk.
 * Returns: Nothing.
 */
function ensureParent(file) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
}

/**
 * Function contract: copyRequired
 * Purpose: Copy one required canonical source file to its compatibility path.
 * Inputs: `source` - Absolute canonical source path; `target` - absolute compatibility destination.
 * Side effects: Reads and writes filesystem state.
 * Returns: Nothing.
 */
function copyRequired(source, target) {
  if (!fs.existsSync(source)) throw new Error(`Missing organized source: ${path.relative(ROOT, source)}`);
  ensureParent(target);
  fs.copyFileSync(source, target);
}

/**
 * Function contract: materializeRootSources
 * Purpose: Create all root-level compatibility files required by development and build tooling.
 * Inputs: None.
 * Side effects: Copies canonical source files into their configured compatibility paths.
 * Returns: Number of mappings materialized.
 */
function materializeRootSources() {
  for (const mapping of mappings) {
    copyRequired(path.join(ROOT, mapping.source), path.join(ROOT, mapping.target));
  }
  return mappings.length;
}

/**
 * Function contract: syncRootSources
 * Purpose: Copy intentional edits from sync-enabled root compatibility files back to canonical source.
 * Inputs: None.
 * Side effects: Reads compatibility files and may update canonical source files.
 * Returns: Number of canonical files changed.
 */
function syncRootSources() {
  let synced = 0;
  for (const mapping of mappings.filter(   /** Callback contract: Select only mappings that explicitly allow reverse synchronization. Inputs: `item` Side effects: None. Returns: The mapping's synchronization flag. */ (item) => item.sync)) {
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
 * Purpose: Remove materialized root compatibility files after they are no longer needed.
 * Inputs: None.
 * Side effects: Deletes configured compatibility files from the repository root.
 * Returns: Number of files removed.
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
