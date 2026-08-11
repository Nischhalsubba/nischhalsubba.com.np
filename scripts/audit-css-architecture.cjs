/**
 * @fileoverview scripts/audit-css-architecture.cjs
 * Purpose: Validate audit css architecture and fail with actionable diagnostics when the production contract is violated.
 * Responsibilities:
 * - Operate deterministically on canonical source or build output so repeated runs produce stable results.
 * - Surface invalid input or contract drift as explicit failures instead of silently masking it.
 * - Keep path assumptions synchronized with repository manifests and source-layout ownership.
 * Execution context: Node.js CLI during development, generation, build, CI, or repository maintenance.
 * Connected files:
 * - package.json
 * - scripts/compile-single-stylesheet.cjs
 * - scripts/repository/generate-file-catalog.cjs
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const stylesRoot = path.join(root, 'src', 'styles');
const compatibilityRelativePath = 'systems/inner-pages.css';
const globalStylesheetRelativePath = 'style.css';
const issues = [];

/**
 * Function contract: walkCssFiles
 * Purpose: Recursively discover authored CSS files so nested style systems remain inside the architecture audit.
 * Inputs: `directory`: input consumed by this operation; `output`: input consumed by this operation
 * Side effects: reads repository/filesystem state.
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
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
 * Purpose: Normalize an absolute stylesheet path into a stable forward-slash path relative to the style source root.
 * Inputs: `file`: repository-relative or absolute file path being processed
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function relativeStylePath(file) {
  return path.relative(stylesRoot, file).split(path.sep).join('/');
}

/**
 * Function contract: readCommitted
 * Purpose: Read the committed version of a compatibility stylesheet when available so generated working-tree mutations cannot hide architecture regressions.
 * Inputs: `relativePath`: input consumed by this operation; `fallbackPath`: input consumed by this operation
 * Side effects: reads repository/filesystem state; spawns child processes.
 * Returns: The requested committed; early-return/empty-state behavior follows the explicit branches in this function.
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
/**
 * Function contract: withoutComments
 * Purpose: Remove CSS block comments before selector and declaration policy checks to avoid false positives from commented examples.
 * Inputs: `css`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
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
  console.error('[css-architecture] Failed\n' + issues.map(/** Callback contract: Processes the callback step for issues without leaking orchestration details to the caller. Inputs: issue. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `issue`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ (issue) => `- ${issue}`).join('\n'));
  process.exit(1);
}

console.log(`[css-architecture] ${files.length} recursively discovered source stylesheet(s) passed; modular styles contain no forbidden importance declarations or global document selectors.`);
