/**
 * @fileoverview scripts/lint-project.cjs
 * Purpose: Apply the lint project production transformation or maintenance step while preserving canonical source/build contracts.
 * Responsibilities:
 * - Operate deterministically on canonical source or build output so repeated runs produce stable results.
 * - Surface invalid input or contract drift as explicit failures instead of silently masking it.
 * - Keep path assumptions synchronized with repository manifests and source-layout ownership.
 * Execution context: Node.js CLI during development, generation, build, CI, or repository maintenance.
 * Connected files:
 * - package.json
 * - src/styles/fragments/agent/portfolio-components.cssfrag
 * - src/styles/fragments/agent/portfolio-finishing.cssfrag
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const jsExtensions = new Set(['.js', '.cjs', '.mjs']);
const jsRoots = [path.join(root, 'scripts'), path.join(root, 'src', 'scripts')];
const cssRoots = [path.join(root, 'src', 'styles')];
const failures = [];
const checked = { javascript: 0, css: 0, production: 0 };

/**
 * Function contract: walk
 * Purpose: Implement the walk responsibility owned by the lint project repository tool.
 * Inputs: `directory`: input consumed by this operation; `predicate`: input consumed by this operation; `output`: input consumed by this operation
 * Side effects: reads repository/filesystem state.
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function walk(directory, predicate, output = []) {
  if (!fs.existsSync(directory)) return output;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === 'dist') continue;
      walk(fullPath, predicate, output);
    } else if (predicate(fullPath)) {
      output.push(fullPath);
    }
  }
  return output;
}

/**
 * Function contract: relative
 * Purpose: Implement the relative responsibility owned by the lint project repository tool.
 * Inputs: `file`: repository-relative or absolute file path being processed
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function relative(file) {
  return path.relative(root, file).replaceAll(path.sep, '/');
}

/**
 * Function contract: addFailure
 * Purpose: Implement the add failure responsibility owned by the lint project repository tool.
 * Inputs: `file`: repository-relative or absolute file path being processed; `message`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
 */
function addFailure(file, message) {
  failures.push(`${relative(file)}: ${message}`);
}

/**
 * Function contract: hasBalancedBraces
 * Purpose: Implements the has balanced braces responsibility for this module.
 * Inputs: source.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: hasBalancedBraces
 * Purpose: Determine whether balanced braces satisfies the condition represented by this lint project repository tool.
 * Inputs: `source`: source text or source object being processed
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Boolean indicating whether balanced braces satisfies the documented condition.
 */
function hasBalancedBraces(source) {
  let depth = 0;
  let quote = '';
  let inComment = false;
  let escaped = false;

  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    const next = source[index + 1];

    if (inComment) {
      if (char === '*' && next === '/') {
        inComment = false;
        index += 1;
      }
      continue;
    }

    if (quote) {
      if (escaped) {
        escaped = false;
      } else if (char === '\\') {
        escaped = true;
      } else if (char === quote) {
        quote = '';
      }
      continue;
    }

    if (char === '/' && next === '*') {
      inComment = true;
      index += 1;
      continue;
    }

    if (char === '"' || char === "'") {
      quote = char;
      continue;
    }

    if (char === '{') depth += 1;
    if (char === '}') depth -= 1;
    if (depth < 0) return false;
  }

  return depth === 0 && !quote && !inComment;
}

const jsFiles = [...new Set(jsRoots.flatMap(/** Callback contract: Processes the callback step for js roots without leaking orchestration details to the caller. Inputs: directory. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Perform the local callback step required by the enclosing lint project repository tool operation. Inputs: `directory`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ (directory) => walk(directory, /** Callback contract: Processes the callback step for walk without leaking orchestration details to the caller. Inputs: file. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Perform the local callback step required by the enclosing lint project repository tool operation. Inputs: `file`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ (file) => jsExtensions.has(path.extname(file)))))]
  .sort();

for (const file of jsFiles) {
  checked.javascript += 1;
  const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
  if (result.status !== 0) {
    addFailure(file, `${result.stdout || ''}${result.stderr || ''}`.trim() || 'JavaScript syntax check failed');
  }
}

const cssFiles = [...new Set(cssRoots.flatMap(/** Callback contract: Processes the callback step for css roots without leaking orchestration details to the caller. Inputs: directory. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Perform the local callback step required by the enclosing lint project repository tool operation. Inputs: `directory`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ (directory) => walk(directory, /** Callback contract: Processes the callback step for walk without leaking orchestration details to the caller. Inputs: file. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Perform the local callback step required by the enclosing lint project repository tool operation. Inputs: `file`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ (file) => /\.css(?:frag)?$/i.test(file))))]
  .sort();

for (const file of cssFiles) {
  checked.css += 1;
  const source = fs.readFileSync(file, 'utf8');
  if (path.extname(file) === '.css' && !hasBalancedBraces(source)) {
    addFailure(file, 'unbalanced CSS braces/comments/strings');
  }
  if (/transition\s*:\s*all\b/i.test(source)) {
    addFailure(file, 'avoid `transition: all`; transition only the properties that move');
  }
}

const portfolioFragmentOrder = [
  'portfolio-foundation.cssfrag',
  'portfolio-components.cssfrag',
  'portfolio-finishing.cssfrag',
];
const agentFragments = portfolioFragmentOrder
  .map(/** Callback contract: Processes the callback step for portfolio fragment order without leaking orchestration details to the caller. Inputs: name. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `name`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ (name) => cssFiles.find(/** Callback contract: Processes the callback step for css files without leaking orchestration details to the caller. Inputs: file. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Return true for the first collection item matching the lookup condition used by the enclosing operation. Inputs: `file`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ (file) => path.basename(file) === name))
  .filter(Boolean);
if (agentFragments.length) {
  const combined = agentFragments.map(/** Callback contract: Processes the callback step for agent fragments without leaking orchestration details to the caller. Inputs: file. Side effects: may read or write repository/filesystem state. No explicit return contract. */ /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `file`. Side effects: reads repository/filesystem state. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ (file) => fs.readFileSync(file, 'utf8')).join('\n');
  if (!hasBalancedBraces(combined)) {
    addFailure(agentFragments[0], 'combined agent portfolio CSS fragments are not structurally balanced');
  }
}

const productionChecks = [
  {
    file: path.join(root, 'dist', 'style.css'),
    rules: [
      [/\.agent-portfolio\.agent-motion-ready\s+\[data-agent-reveal\][^{]*\{[^}]*opacity\s*:\s*0/si, 'production CSS can globally hide reveal content'],
      [/transition\s*:\s*all\b/i, 'production CSS contains `transition: all`'],
      [/\.agent-portfolio\s+\.agent-case-title-wrap\s*\{/i, null],
      [/\.agent-portfolio\s+\.agent-page-hero-grid\s*>\s*div:first-child\s*\{/i, null]
    ]
  },
  {
    file: path.join(root, 'dist', 'script.js'),
    rules: [
      [/root\.classList\.add\(['"]agent-motion-ready['"]\)/, 'production runtime still enables the global reveal-hiding state']
    ]
  }
];

for (const check of productionChecks) {
  if (!fs.existsSync(check.file)) continue;
  checked.production += 1;
  const source = fs.readFileSync(check.file, 'utf8');
  for (const [pattern, failureMessage] of check.rules) {
    const matches = pattern.test(source);
    if (failureMessage && matches) addFailure(check.file, failureMessage);
    if (!failureMessage && !matches) addFailure(check.file, `required interface-polish contract missing: ${pattern}`);
  }
}

if (failures.length) {
  console.error(`[lint] ${failures.length} failure(s):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`[lint] Passed: ${checked.javascript} JavaScript files, ${checked.css} CSS source files, ${checked.production} production artifact checks.`);
