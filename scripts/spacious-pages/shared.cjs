/**
 * @fileoverview scripts/spacious-pages/shared.cjs
 * Purpose: Apply the shared production transformation or maintenance step while preserving canonical source/build contracts.
 * Responsibilities:
 * - Operate deterministically on canonical source or build output so repeated runs produce stable results.
 * - Surface invalid input or contract drift as explicit failures instead of silently masking it.
 * - Keep path assumptions synchronized with repository manifests and source-layout ownership.
 * Execution context: Node.js CLI during development, generation, build, CI, or repository maintenance.
 * Connected files:
 * - package.json
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '../..');
const targetRoot = process.argv.includes('--dist') ? path.join(root, 'dist') : root;
const email = 'hinischalsubba@gmail.com';

/**
 * Function contract: addBodyClasses
 * Purpose: Implement the add body classes responsibility owned by the shared repository tool.
 * Inputs: `html`: input consumed by this operation; `classes`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Boolean predicate result consumed by the caller.
 */
function addBodyClasses(html, classes) {
  return html.replace(/<body(?:\s+class="([^"]*)")?([^>]*)>/i, /** Callback contract: Processes the callback step for html without leaking orchestration details to the caller. Inputs: _match, current, rest. Side effects: no obvious external side effect beyond invoked dependencies. Returns a value to the invoking API. */ /** Callback contract: Perform the local callback step required by the enclosing shared repository tool operation. Inputs: `_match`, `current`, `rest`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Boolean predicate result consumed by the caller. */ (_match, current = '', rest = '') => {
    const all = new Set(`${current} ${classes}`.trim().split(/\s+/).filter(Boolean));
    return `<body class="${[...all].join(' ')}"${rest}>`;
  });
}

/**
 * Function contract: replaceMain
 * Purpose: Implements the replace main responsibility for this module.
 * Inputs: file, markup, classes.
 * Side effects: may read or write repository/filesystem state.
 * Returns: no explicit value unless an invoked dependency throws/rejects.
 */
/**
 * Function contract: replaceMain
 * Purpose: Implement the replace main responsibility owned by the shared repository tool.
 * Inputs: `file`: repository-relative or absolute file path being processed; `markup`: input consumed by this operation; `classes`: input consumed by this operation
 * Side effects: writes repository/filesystem state.
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
 */
function replaceMain(file, markup, classes) {
  const target = path.join(targetRoot, file);
  if (!fs.existsSync(target)) throw new Error(`Missing target page: ${path.relative(root, target)}`);

  let html = fs.readFileSync(target, 'utf8');
  if (!/<main\b[\s\S]*?<\/main>/i.test(html)) throw new Error(`Missing main element in ${file}`);

  html = html.replace(/<main\b[\s\S]*?<\/main>/i, markup.trim());
  html = addBodyClasses(html, `nrs-inner-page ${classes}`);
  fs.writeFileSync(target, html, 'utf8');
}

const actions = '<div class="nrs-actions"><a class="btn btn-primary" href="/projects">View selected work</a><a class="btn btn-secondary" href="/contact">Start a conversation</a></div>';

module.exports = { email, replaceMain, actions };
