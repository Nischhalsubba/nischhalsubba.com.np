/**
 * @fileoverview scripts/lint-project.cjs
 * Purpose: Node-based build, content transformation, QA, or maintenance tool for lint project.
 * Responsibilities:
 * - Own the behavior/content implied by this file's single responsibility.
 * - Keep public routes, build contracts, and imported module boundaries stable unless the connected owners are updated together.
 * Execution context: Node.js CLI during local development, CI, build, or maintenance.
 * Connected files:
 * - docs/repository/file-catalog.md
 * - package.json
 * - scripts/repository/fix-deep-style-contracts.cjs
 * - scripts/build-dist.cjs
 * Maintenance: Update this header when responsibility or dependencies change; generated/vendor files are documented at their source instead.
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
 * Purpose: Implements the walk responsibility for this module.
 * Inputs: directory, predicate, output.
 * Side effects: may read or write repository/filesystem state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
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
 * Purpose: Implements the relative responsibility for this module.
 * Inputs: file.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function relative(file) {
  return path.relative(root, file).replaceAll(path.sep, '/');
}

/**
 * Function contract: addFailure
 * Purpose: Implements the add failure responsibility for this module.
 * Inputs: file, message.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: no explicit value unless an invoked dependency throws/rejects.
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

const jsFiles = [...new Set(jsRoots.flatMap(/** Callback contract: Processes the callback step for js roots without leaking orchestration details to the caller. Inputs: directory. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (directory) => walk(directory, /** Callback contract: Processes the callback step for walk without leaking orchestration details to the caller. Inputs: file. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (file) => jsExtensions.has(path.extname(file)))))]
  .sort();

for (const file of jsFiles) {
  checked.javascript += 1;
  const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
  if (result.status !== 0) {
    addFailure(file, `${result.stdout || ''}${result.stderr || ''}`.trim() || 'JavaScript syntax check failed');
  }
}

const cssFiles = [...new Set(cssRoots.flatMap(/** Callback contract: Processes the callback step for css roots without leaking orchestration details to the caller. Inputs: directory. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (directory) => walk(directory, /** Callback contract: Processes the callback step for walk without leaking orchestration details to the caller. Inputs: file. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (file) => /\.css(?:frag)?$/i.test(file))))]
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
  .map(/** Callback contract: Processes the callback step for portfolio fragment order without leaking orchestration details to the caller. Inputs: name. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (name) => cssFiles.find(/** Callback contract: Processes the callback step for css files without leaking orchestration details to the caller. Inputs: file. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (file) => path.basename(file) === name))
  .filter(Boolean);
if (agentFragments.length) {
  const combined = agentFragments.map(/** Callback contract: Processes the callback step for agent fragments without leaking orchestration details to the caller. Inputs: file. Side effects: may read or write repository/filesystem state. No explicit return contract. */ (file) => fs.readFileSync(file, 'utf8')).join('\n');
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
