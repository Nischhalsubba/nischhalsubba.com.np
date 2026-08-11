/**
 * @fileoverview scripts/spacious-pages/shared.cjs
 * Purpose: Node-based build, content transformation, QA, or maintenance tool for shared.
 * Responsibilities:
 * - Own the behavior/content implied by this file's single responsibility.
 * - Keep public routes, build contracts, and imported module boundaries stable unless the connected owners are updated together.
 * Execution context: Node.js CLI during local development, CI, build, or maintenance.
 * Connected files:
 * - docs/repository/file-catalog.md
 * - scripts/spacious-pages/about.cjs
 * - scripts/spacious-pages/contact.cjs
 * - scripts/spacious-pages/services.cjs
 * Maintenance: Update this header when responsibility or dependencies change; generated/vendor files are documented at their source instead.
 */
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '../..');
const targetRoot = process.argv.includes('--dist') ? path.join(root, 'dist') : root;
const email = 'hinischalsubba@gmail.com';

/**
 * Function contract: addBodyClasses
 * Purpose: Implements the add body classes responsibility for this module.
 * Inputs: html, classes.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function addBodyClasses(html, classes) {
  return html.replace(/<body(?:\s+class="([^"]*)")?([^>]*)>/i, /** Callback contract: Processes the callback step for html without leaking orchestration details to the caller. Inputs: _match, current, rest. Side effects: no obvious external side effect beyond invoked dependencies. Returns a value to the invoking API. */ (_match, current = '', rest = '') => {
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
