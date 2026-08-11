/**
 * @fileoverview scripts/repository/audit-repository-structure.cjs
 * Purpose: Enforce repository ownership boundaries, canonical source mappings, and required architecture documentation.
 * Responsibilities:
 * - Operate deterministically on canonical source or build output so repeated runs produce stable results.
 * - Surface invalid input or contract drift as explicit failures instead of silently masking it.
 * - Keep path assumptions synchronized with repository manifests and source-layout ownership.
 * Execution context: Node.js CLI during development, generation, build, CI, or repository maintenance.
 * Connected files:
 * - scripts/repository/source-layout.cjs
 * - config/repository/root-policy.json
 * - package.json
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { ROOT, ROOT_PAGE_NAMES, DISCOVERY_NAMES, mappings } = require('./source-layout.cjs');

const policyPath = path.join(ROOT, 'config', 'repository', 'root-policy.json');
const policy = JSON.parse(fs.readFileSync(policyPath, 'utf8'));
const result = spawnSync('git', ['ls-files', '-z'], { cwd: ROOT, encoding: 'utf8' });

if (result.status !== 0) {
  throw new Error(`git ls-files failed: ${result.stderr || result.stdout}`);
}

const tracked = result.stdout.split('\0').filter(Boolean);
const rootFiles = tracked.filter(   /** Callback contract: Decide whether the current item remains in the filtered result consumed by the enclosing operation. Inputs: `file` Side effects: No direct external side effect beyond invoked dependencies. Returns: Boolean predicate result consumed by the enclosing collection lookup/filter. */ (file) => !file.includes('/')).sort();
const unexpectedRoot = rootFiles.filter(   /** Callback contract: Decide whether the current item remains in the filtered result consumed by the enclosing operation. Inputs: `file` Side effects: No direct external side effect beyond invoked dependencies. Returns: Boolean predicate result consumed by the enclosing collection lookup/filter. */ (file) => !policy.allowedRootFiles.includes(file));
const failures = [];



/**
 * Function contract: sourceForRootTarget
 * Purpose: Resolve a root-compatible target filename through the materialization mapping instead of duplicating source-folder assumptions.
 * Inputs: `target`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function sourceForRootTarget(target) {
  return mappings.find(   /** Callback contract: Identify whether the current item matches the lookup condition for the enclosing search. Inputs: `mapping` Side effects: No direct external side effect beyond invoked dependencies. Returns: Boolean predicate result consumed by the enclosing collection lookup/filter. */ (mapping) => mapping.target === target && mapping.sync)?.source || '';
}

if (unexpectedRoot.length) {
  failures.push(`Unexpected tracked root file(s): ${unexpectedRoot.join(', ')}`);
}

for (const prefix of policy.forbiddenTrackedPrefixes) {
  const matches = tracked.filter(   /** Callback contract: Decide whether the current item remains in the filtered result consumed by the enclosing operation. Inputs: `file` Side effects: No direct external side effect beyond invoked dependencies. Returns: Boolean predicate result consumed by the enclosing collection lookup/filter. */ (file) => file.startsWith(prefix));
  if (matches.length) {
    failures.push(`Forbidden tracked prefix ${prefix}: ${matches.length} file(s)`);
  }
}

for (const page of ROOT_PAGE_NAMES) {
  const source = sourceForRootTarget(page);
  if (!source) {
    failures.push(`Missing source-layout mapping for canonical page target: ${page}`);
  } else if (!tracked.includes(source)) {
    failures.push(`Missing canonical page source: ${source}`);
  }
}

for (const name of ['home.html', 'home-v2.html', 'blog.html']) {
  const source = `src/compat/legacy-pages/${name}`;
  if (!tracked.includes(source)) {
    failures.push(`Missing Vite compatibility page source: ${source}`);
  }
}

if (!tracked.includes('src/styles/style.css')) {
  failures.push('Missing canonical stylesheet source: src/styles/style.css');
}

if (!tracked.includes('src/runtime/script.js')) {
  failures.push('Missing canonical runtime entry template: src/runtime/script.js');
}

for (const name of DISCOVERY_NAMES) {
  const source = `src/discovery/${name}`;
  if (!tracked.includes(source)) {
    failures.push(`Missing discovery source: ${source}`);
  }
}

for (const doc of policy.requiredDocumentation) {
  if (!tracked.includes(doc)) {
    failures.push(`Missing repository documentation: ${doc}`);
  }
}

if (failures.length) {
  console.error(`[repository-structure] ${failures.length} failure(s)\n${failures.map( /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `item` Side effects: No direct external side effect beyond invoked dependencies. Returns: Computed expression result consumed by the enclosing operation. */ (item) => `- ${item}`).join('\n')}`);
  process.exit(1);
}

console.log(`[repository-structure] Root policy passed with ${rootFiles.length} tracked root file(s), ${ROOT_PAGE_NAMES.length} mapped canonical page source(s), and ${DISCOVERY_NAMES.length} organized discovery source(s).`);
