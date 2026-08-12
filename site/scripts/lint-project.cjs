/**
 * @fileoverview scripts/lint-project.cjs
 * Purpose: Run lightweight repository syntax and CSS-contract checks before broader production validation.
 * Responsibilities:
 * - Syntax-check authored JavaScript tooling and browser modules with Node.
 * - Check authored CSS for structural balance and reject broad `transition: all` usage.
 * - Validate the three core portfolio style fragments as one combined stylesheet unit.
 * - Inspect production artifacts when `dist/` exists for known reveal, motion, and layout regressions.
 * Execution context: Node.js quality check used by `npm run lint` and the full repository validation workflow.
 * Connected files:
 * - package.json
 * - src/styles/fragments/portfolio/portfolio-foundation.cssfrag
 * - src/styles/fragments/portfolio/portfolio-components.cssfrag
 * - src/styles/fragments/portfolio/portfolio-finishing.cssfrag
 * - scripts/ensure-interface-polish.cjs
 * Maintenance: Keep checks deterministic and focused on repository contracts that can be verified without a browser. Browser behavior belongs in the dedicated browser/visual audit suite.
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
 * Purpose: Recursively collect files beneath a directory that satisfy a caller-provided predicate.
 * Inputs: `directory` - directory to scan; `predicate` - function deciding whether a file belongs in the result; `output` - optional accumulator used during recursion.
 * Side effects: Reads directory entries from disk.
 * Returns: Array of matching absolute file paths.
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
 * Purpose: Convert an absolute repository path into a forward-slash-separated path suitable for diagnostics.
 * Inputs: `file` - absolute path beneath the repository root.
 * Side effects: None.
 * Returns: Repository-relative normalized path.
 */
function relative(file) {
  return path.relative(root, file).replaceAll(path.sep, '/');
}

/**
 * Function contract: addFailure
 * Purpose: Record one lint failure with a normalized repository-relative filename.
 * Inputs: `file` - absolute file path; `message` - human-readable failure explanation.
 * Side effects: Appends to the shared `failures` array.
 * Returns: Nothing.
 */
function addFailure(file, message) {
  failures.push(`${relative(file)}: ${message}`);
}

/**
 * Function contract: hasBalancedBraces
 * Purpose: Check CSS-like source for balanced braces while ignoring quoted strings and block comments.
 * Inputs: `source` - complete stylesheet source text.
 * Side effects: None.
 * Returns: `true` when braces, quotes, and block comments close cleanly; otherwise `false`.
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

const jsFiles = [...new Set(jsRoots.flatMap(
  /** Callback contract: Collect JavaScript-family files beneath one configured source root. Inputs: `directory`. Side effects: Reads filesystem state through `walk`. Returns: Array of JavaScript-family file paths. */
  (directory) => walk(
    directory,
    /** Callback contract: Decide whether one discovered file uses a JavaScript-family extension. Inputs: `file`. Side effects: None. Returns: Boolean extension match. */
    (file) => jsExtensions.has(path.extname(file)),
  ),
))].sort();

for (const file of jsFiles) {
  checked.javascript += 1;
  const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
  if (result.status !== 0) {
    addFailure(file, `${result.stdout || ''}${result.stderr || ''}`.trim() || 'JavaScript syntax check failed');
  }
}

const cssFiles = [...new Set(cssRoots.flatMap(
  /** Callback contract: Collect CSS and CSS-fragment files beneath one configured style root. Inputs: `directory`. Side effects: Reads filesystem state through `walk`. Returns: Array of stylesheet source paths. */
  (directory) => walk(
    directory,
    /** Callback contract: Decide whether one discovered file is CSS or a CSS fragment. Inputs: `file`. Side effects: None. Returns: Boolean filename match. */
    (file) => /\.css(?:frag)?$/i.test(file),
  ),
))].sort();

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
const portfolioFragments = portfolioFragmentOrder
  .map(
    /** Callback contract: Resolve one required core portfolio fragment by basename from the discovered stylesheet set. Inputs: `name`. Side effects: None. Returns: Matching absolute stylesheet path or `undefined`. */
    (name) => cssFiles.find(
      /** Callback contract: Compare one discovered stylesheet basename with the requested fragment name. Inputs: `file`. Side effects: None. Returns: Boolean basename match. */
      (file) => path.basename(file) === name,
    ),
  )
  .filter(Boolean);

if (portfolioFragments.length) {
  const combined = portfolioFragments.map(
    /** Callback contract: Read one core portfolio fragment for combined structural validation. Inputs: `file`. Side effects: Reads filesystem state. Returns: UTF-8 stylesheet text. */
    (file) => fs.readFileSync(file, 'utf8'),
  ).join('\n');
  if (!hasBalancedBraces(combined)) {
    addFailure(portfolioFragments[0], 'combined portfolio CSS fragments are not structurally balanced');
  }
}

const productionChecks = [
  {
    file: path.join(root, 'dist', 'style.css'),
    rules: [
      [/\.agent-portfolio\.agent-motion-ready\s+\[data-agent-reveal\][^{]*\{[^}]*opacity\s*:\s*0/si, 'production CSS can globally hide reveal content'],
      [/transition\s*:\s*all\b/i, 'production CSS contains `transition: all`'],
      [/\.agent-portfolio\s+\.agent-case-title-wrap\s*\{/i, null],
      [/\.agent-portfolio\s+\.agent-page-hero-grid\s*>\s*div:first-child\s*\{/i, null],
    ],
  },
  {
    file: path.join(root, 'dist', 'script.js'),
    rules: [
      [/root\.classList\.add\(['"]agent-motion-ready['"]\)/, 'production runtime still enables the global reveal-hiding state'],
    ],
  },
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
