const fs = require('node:fs');
const path = require('node:path');

/**
 * @fileoverview Temporary follow-up patch for the deep source-organization migration.
 * Purpose: Teach the compatibility materializer how to locate categorized page sources after `src/pages/` is split into core, projects, and services.
 * Responsibilities:
 * - Replace the old computed `src/pages/<name>` assumption with responsibility-aware source resolution.
 * - Keep root compatibility targets and public filenames exactly unchanged.
 * Execution context: Node.js inside the one-shot deep-organization GitHub Actions workflow.
 * Connected files:
 * - scripts/repository/source-layout.cjs
 * - scripts/repository/apply-deep-organization.cjs
 * - config/canonical-routes.json
 * Maintenance: Temporary migration helper; deleted before the migration commit is created.
 */

const ROOT = path.resolve(__dirname, '../..');
const TARGET = path.join(ROOT, 'scripts/repository/source-layout.cjs');

/**
 * Function contract: patchSourceLayout
 * Purpose: Rewrites the page-source resolver so materialization follows the new categorized page folders without changing target filenames.
 * Inputs: none; reads the known source-layout module from the repository checkout.
 * Side effects: rewrites `scripts/repository/source-layout.cjs` in place.
 * Returns: no explicit value; throws if the expected pre-migration mapping pattern is not found.
 */
function patchSourceLayout() {
  let source = fs.readFileSync(TARGET, 'utf8');
  const oldBlock = `const mappings = [\n  ...ROOT_PAGE_NAMES.map((name) => ({ source: path.join('src', 'pages', name), target: name, sync: true })),`;
  const newBlock = `const SERVICE_PAGE_NAMES = new Set([\n  'figma-design-systems.html',\n  'product-design-nepal.html',\n  'saas-ux-designer.html',\n  'ux-audit.html',\n  'web3-ux-designer.html',\n  'website-ux-design.html',\n]);\n\n/**\n * Function contract: organizedPageSource\n * Purpose: Resolves a historical root-page filename to its responsibility-based canonical source folder.\n * Inputs: name, the root-compatible HTML filename from the canonical route manifest.\n * Side effects: no external side effects.\n * Returns: a repository-relative source path under src/pages/core, src/pages/projects, or src/pages/services.\n */\nfunction organizedPageSource(name) {\n  if (name.startsWith('project-')) return path.join('src', 'pages', 'projects', name);\n  if (SERVICE_PAGE_NAMES.has(name)) return path.join('src', 'pages', 'services', name);\n  return path.join('src', 'pages', 'core', name);\n}\n\nconst mappings = [\n  ...ROOT_PAGE_NAMES.map((name) => ({ source: organizedPageSource(name), target: name, sync: true })),`;

  if (!source.includes(oldBlock)) {
    throw new Error('Could not find the expected root page mapping block in source-layout.cjs');
  }

  source = source.replace(oldBlock, newBlock);
  fs.writeFileSync(TARGET, source, 'utf8');
  console.log('[deep-organize] Updated compatibility materializer for categorized page sources.');
}

patchSourceLayout();
