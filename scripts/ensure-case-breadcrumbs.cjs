/**
 * @fileoverview scripts/ensure-case-breadcrumbs.cjs
 * Purpose: Apply the ensure case breadcrumbs production transformation or maintenance step while preserving canonical source/build contracts.
 * Responsibilities:
 * - Operate deterministically on canonical source or build output so repeated runs produce stable results.
 * - Surface invalid input or contract drift as explicit failures instead of silently masking it.
 * - Keep path assumptions synchronized with repository manifests and source-layout ownership.
 * Execution context: Node.js CLI during development, generation, build, CI, or repository maintenance.
 * Connected files:
 * - scripts/build-dist.cjs
 * - package.json
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const useDist = process.argv.includes('--dist');
const base = useDist ? path.join(root, 'dist') : root;
const stylePath = path.join(base, 'style.css');
const start = '/* case-breadcrumbs-v1:start */';
const end = '/* case-breadcrumbs-v1:end */';
const markerPattern = /\/\* case-breadcrumbs-v1:start \*\/[\s\S]*?\/\* case-breadcrumbs-v1:end \*\//g;

const breadcrumbCss = `${start}
.agent-portfolio .agent-case-breadcrumb {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: .5rem;
  margin-bottom: clamp(1.25rem, 2.5vw, 2.5rem);
  color: var(--ap-ink-faint);
  font: 600 .72rem/1.35 var(--ap-font-mono);
  letter-spacing: .08em;
  text-transform: uppercase;
}

.agent-portfolio .agent-case-breadcrumb a {
  color: inherit;
  text-decoration: none;
  text-underline-offset: .2em;
  transition: color var(--ap-standard) var(--ap-ease);
}

.agent-portfolio .agent-case-breadcrumb a:hover,
.agent-portfolio .agent-case-breadcrumb a:focus-visible {
  color: var(--ap-signal);
}

.agent-portfolio .agent-case-breadcrumb [aria-current='page'] {
  color: var(--ap-ink);
}

@media (prefers-reduced-motion: reduce) {
  .agent-portfolio .agent-case-breadcrumb a {
    transition-duration: 0ms;
  }
}
${end}`;

/**
 * Function contract: titleFromHtml
 * Purpose: Implements the title from html responsibility for this module.
 * Inputs: html, file.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: titleFromHtml
 * Purpose: Implement the title from html responsibility owned by the ensure case breadcrumbs repository tool.
 * Inputs: `html`: input consumed by this operation; `file`: repository-relative or absolute file path being processed
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function titleFromHtml(html, file) {
  const match = html.match(/<h1\b[^>]*class="[^"]*agent-case-title[^"]*"[^>]*>([\s\S]*?)<\/h1>/i);
  if (match) return match[1].replace(/<[^>]+>/g, '').trim();
  return path.basename(file, '.html').replace(/^project-/, '').replaceAll('-', ' ');
}

/**
 * Function contract: patchCase
 * Purpose: Implements the patch case responsibility for this module.
 * Inputs: file.
 * Side effects: may read or write repository/filesystem state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: patchCase
 * Purpose: Implement the patch case responsibility owned by the ensure case breadcrumbs repository tool.
 * Inputs: `file`: repository-relative or absolute file path being processed
 * Side effects: writes repository/filesystem state.
 * Returns: Boolean predicate result consumed by the caller.
 */
function patchCase(file) {
  const fullPath = path.join(base, file);
  let html = fs.readFileSync(fullPath, 'utf8');
  if (!html.includes('agent-case-hero')) return false;
  if (/nav\b[^>]*aria-label=["']Breadcrumb["']/i.test(html)) return false;

  const title = titleFromHtml(html, file);
  const breadcrumb = `<nav class="agent-case-breadcrumb" aria-label="Breadcrumb"><a href="/projects">Work</a><span aria-hidden="true">/</span><span aria-current="page">${title}</span></nav>`;
  const next = html.replace(/(<div class="agent-frame agent-case-grid">)/i, `$1${breadcrumb}`);
  if (next === html) {
    throw new Error(`${file}: unable to find the case-study grid for breadcrumb insertion`);
  }
  fs.writeFileSync(fullPath, next, 'utf8');
  return true;
}

if (!fs.existsSync(base)) {
  console.error(`[case-breadcrumbs] Missing build root: ${base}`);
  process.exit(1);
}

let patched = 0;
for (const file of fs.readdirSync(base).filter(/** Callback contract: Processes the callback step for fs.readdir sync(base) without leaking orchestration details to the caller. Inputs: name. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Decide whether the current item should remain in the filtered result used by the enclosing operation. Inputs: `name`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Decide whether the current item remains in the filtered result consumed by the enclosing operation. Inputs: `name`. Side effects: no direct external side effect beyond invoked dependencies. Returns: computed expression result consumed by the enclosing operation. */ (name) => /^project-[a-z0-9-]+\.html$/i.test(name))) {
  if (patchCase(file)) patched += 1;
}

if (fs.existsSync(stylePath)) {
  const before = fs.readFileSync(stylePath, 'utf8');
  const clean = before.replace(markerPattern, '').trimEnd();
  fs.writeFileSync(stylePath, `${clean}\n\n${breadcrumbCss}\n`, 'utf8');
}

const missing = [];
for (const file of fs.readdirSync(base).filter(/** Callback contract: Processes the callback step for fs.readdir sync(base) without leaking orchestration details to the caller. Inputs: name. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Decide whether the current item should remain in the filtered result used by the enclosing operation. Inputs: `name`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Decide whether the current item remains in the filtered result consumed by the enclosing operation. Inputs: `name`. Side effects: no direct external side effect beyond invoked dependencies. Returns: computed expression result consumed by the enclosing operation. */ (name) => /^project-(?:yarsha|mokshya|morajaa|pihub|masteriyo|zapp)\.html$/i.test(name))) {
  const html = fs.readFileSync(path.join(base, file), 'utf8');
  const count = (html.match(/nav\b[^>]*aria-label=["']Breadcrumb["']/gi) || []).length;
  if (count !== 1) missing.push(`${file}: ${count} breadcrumb navigations`);
}

if (missing.length) {
  console.error(`[case-breadcrumbs] Failed:\n- ${missing.join('\n- ')}`);
  process.exit(1);
}

console.log(`[case-breadcrumbs] Restored ${patched} missing case-study breadcrumb${patched === 1 ? '' : 's'} for ${useDist ? 'dist' : 'source'} output.`);
