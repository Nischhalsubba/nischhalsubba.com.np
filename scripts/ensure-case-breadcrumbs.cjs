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
 * Purpose: Implement the title from html responsibility owned by the ensure case breadcrumbs repository tool.
 * Inputs: `html`, `file`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function titleFromHtml(html, file) {
  const match = html.match(/<h1\b[^>]*class="[^"]*agent-case-title[^"]*"[^>]*>([\s\S]*?)<\/h1>/i);
  if (match) return match[1].replace(/<[^>]+>/g, '').trim();
  return path.basename(file, '.html').replace(/^project-/, '').replaceAll('-', ' ');
}



/**
 * Function contract: patchCase
 * Purpose: Implement the patch case responsibility owned by the ensure case breadcrumbs repository tool.
 * Inputs: `file`
 * Side effects: writes filesystem state
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
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
for (const file of fs.readdirSync(base).filter(   /** Callback contract: Decide whether the current item remains in the filtered result consumed by the enclosing operation. Inputs: `name` Side effects: No direct external side effect beyond invoked dependencies. Returns: Boolean predicate result consumed by the enclosing collection lookup/filter. */ (name) => /^project-[a-z0-9-]+\.html$/i.test(name))) {
  if (patchCase(file)) patched += 1;
}

if (fs.existsSync(stylePath)) {
  const before = fs.readFileSync(stylePath, 'utf8');
  const clean = before.replace(markerPattern, '').trimEnd();
  fs.writeFileSync(stylePath, `${clean}\n\n${breadcrumbCss}\n`, 'utf8');
}

const missing = [];
for (const file of fs.readdirSync(base).filter(   /** Callback contract: Decide whether the current item remains in the filtered result consumed by the enclosing operation. Inputs: `name` Side effects: No direct external side effect beyond invoked dependencies. Returns: Boolean predicate result consumed by the enclosing collection lookup/filter. */ (name) => /^project-(?:yarsha|mokshya|morajaa|pihub|masteriyo|zapp)\.html$/i.test(name))) {
  const html = fs.readFileSync(path.join(base, file), 'utf8');
  const count = (html.match(/nav\b[^>]*aria-label=["']Breadcrumb["']/gi) || []).length;
  if (count !== 1) missing.push(`${file}: ${count} breadcrumb navigations`);
}

if (missing.length) {
  console.error(`[case-breadcrumbs] Failed:\n- ${missing.join('\n- ')}`);
  process.exit(1);
}

console.log(`[case-breadcrumbs] Restored ${patched} missing case-study breadcrumb${patched === 1 ? '' : 's'} for ${useDist ? 'dist' : 'source'} output.`);
