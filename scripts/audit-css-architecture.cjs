const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

/**
 * @fileoverview scripts/audit-css-architecture.cjs
 * Purpose: Enforce the authored CSS architecture after styles are grouped into global, reusable systems, and responsibility-based fragment folders.
 * Responsibilities:
 * - Recursively discover authored `.css` source under `src/styles/`.
 * - Treat only `src/styles/style.css` as the intentionally global production stylesheet.
 * - Preserve the historical compatibility exception for `src/styles/systems/inner-pages.css` while still checking its dangerous resource patterns.
 * - Reject `!important`, global document selectors, remote imports, and inline data URLs from modular CSS where those constructs are not allowed.
 * - Fail when the canonical global stylesheet or required compatibility system disappears.
 * Execution context: Node.js during `npm run audit:css-architecture` and the repository validation workflows.
 * Connected files:
 * - src/styles/style.css
 * - src/styles/systems/inner-pages.css
 * - src/styles/systems/case-study.css
 * - scripts/compile-single-stylesheet.cjs
 * - package.json
 * Maintenance: Keep exemptions path-specific. New nested folders should be discovered automatically instead of being added to manual allow-lists.
 */

const root = path.resolve(__dirname, '..');
const stylesRoot = path.join(root, 'src', 'styles');
const compatibilityRelativePath = 'systems/inner-pages.css';
const globalStylesheetRelativePath = 'style.css';
const issues = [];

/**
 * Function contract: walkCssFiles
 * Purpose: Recursively discover authored `.css` files so nested style systems remain inside the architecture audit instead of escaping it by moving folders.
 * Inputs: `directory`, the absolute directory currently being scanned; `output`, the mutable accumulator used during recursion.
 * Side effects: Reads filesystem directory metadata and appends discovered absolute CSS paths to `output`.
 * Returns: The accumulator containing every discovered absolute `.css` file path.
 */
function walkCssFiles(directory, output = []) {
  if (!fs.existsSync(directory)) return output;

  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      walkCssFiles(fullPath, output);
    } else if (entry.isFile() && entry.name.endsWith('.css')) {
      output.push(fullPath);
    }
  }

  return output;
}

/**
 * Function contract: relativeStylePath
 * Purpose: Normalize an absolute stylesheet path into the stable forward-slash form used by policy comparisons and diagnostics.
 * Inputs: `file`, an absolute path beneath `src/styles/`.
 * Side effects: No external side effects.
 * Returns: A forward-slash path relative to `src/styles/`, such as `systems/inner-pages.css`.
 */
function relativeStylePath(file) {
  return path.relative(stylesRoot, file).split(path.sep).join('/');
}

/**
 * Function contract: readCommitted
 * Purpose: Read the committed compatibility stylesheet when possible so build-time working-tree mutations cannot hide architecture regressions.
 * Inputs: `relativePath`, a repository-relative path for `git show`; `fallbackPath`, the absolute working-tree file used when the committed version is unavailable.
 * Side effects: Spawns a read-only Git command and may read the fallback file from disk.
 * Returns: CSS source text from the current commit or the fallback working tree.
 */
function readCommitted(relativePath, fallbackPath) {
  const result = spawnSync('git', ['show', `HEAD:${relativePath}`], {
    cwd: root,
    encoding: 'utf8',
  });

  if (result.status === 0 && result.stdout) return result.stdout;
  return fs.readFileSync(fallbackPath, 'utf8');
}

/**
 * Function contract: withoutComments
 * Purpose: Remove CSS block comments before selector/declaration policy checks so commented examples do not produce false violations.
 * Inputs: `css`, complete stylesheet source text.
 * Side effects: No external side effects.
 * Returns: CSS source with block comments removed.
 */
function withoutComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, '');
}

const files = walkCssFiles(stylesRoot).sort();

for (const filePath of files) {
  const relativePath = relativeStylePath(filePath);
  const css = relativePath === compatibilityRelativePath
    ? readCommitted(`src/styles/${relativePath}`, filePath)
    : fs.readFileSync(filePath, 'utf8');
  const declarations = withoutComments(css);
  const importantCount = (declarations.match(/!\s*important\b/gi) || []).length;
  const isGlobalStylesheet = relativePath === globalStylesheetRelativePath;

  if (!isGlobalStylesheet && importantCount) {
    issues.push(`${relativePath}: ${importantCount} importance declaration(s) are forbidden`);
  }

  if (/@import\s+(?:url\()?['"]?https?:/i.test(declarations)) {
    issues.push(`${relativePath}: remote CSS imports are forbidden`);
  }

  if (/url\(['"]?data:/i.test(declarations)) {
    issues.push(`${relativePath}: inline data URLs are forbidden`);
  }

  if (
    !isGlobalStylesheet &&
    relativePath !== compatibilityRelativePath &&
    /(^|[}\n])\s*(?:html|body|\*)\s*(?:[,>{.:#\[])/m.test(declarations)
  ) {
    issues.push(`${relativePath}: global document selectors are forbidden in modular CSS`);
  }
}

const relativeFiles = files.map(relativeStylePath);

if (!relativeFiles.includes(globalStylesheetRelativePath)) {
  issues.push(`${globalStylesheetRelativePath}: canonical global stylesheet is missing`);
}

if (!relativeFiles.includes(compatibilityRelativePath)) {
  issues.push(`${compatibilityRelativePath}: compatibility stylesheet is missing`);
}

if (!files.length) {
  issues.push('No CSS source files found');
}

if (issues.length) {
  console.error('[css-architecture] Failed\n' + issues.map((issue) => `- ${issue}`).join('\n'));
  process.exit(1);
}

console.log(`[css-architecture] ${files.length} recursively discovered source stylesheet(s) passed; modular styles contain no forbidden importance declarations or global document selectors.`);
