/**
 * @fileoverview scripts/agent-redesign.cjs
 * Purpose: Apply the agent redesign production transformation or maintenance step while preserving canonical source/build contracts.
 * Responsibilities:
 * - Operate deterministically on canonical source or build output so repeated runs produce stable results.
 * - Surface invalid input or contract drift as explicit failures instead of silently masking it.
 * - Keep path assumptions synchronized with repository manifests and source-layout ownership.
 * Execution context: Node.js CLI during development, generation, build, CI, or repository maintenance.
 * Connected files:
 * - scripts/build-dist.cjs
 * - src/scripts/entrypoints/agent-main.js
 * - src/scripts/features/portfolio/agent-portfolio.js
 * - package.json
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
const fs = require('node:fs');
const path = require('node:path');
const parts = [1, 2, 3].map(/** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `part`. Side effects: no direct external side effect beyond invoked dependencies. Returns: computed expression result consumed by the enclosing operation. */ (part) => path.join(__dirname, `agent-redesign-part-${part}.cjsfrag`));
if (parts.some(/** Callback contract: Processes the callback step for parts without leaking orchestration details to the caller. Inputs: file. Side effects: may read or write repository/filesystem state. No explicit return contract. */ /** Callback contract: Evaluate whether the current item satisfies the condition needed for the enclosing existential check. Inputs: `file`. Side effects: reads repository/filesystem state. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Evaluate whether the current item satisfies the enclosing existential condition. Inputs: `file`. Side effects: reads filesystem state. Returns: boolean predicate result. */ (file) => !fs.existsSync(file))) throw new Error('[agent-redesign] source fragments are missing');
const source = parts.map(/** Callback contract: Processes the callback step for parts without leaking orchestration details to the caller. Inputs: file. Side effects: may read or write repository/filesystem state. No explicit return contract. */ /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `file`. Side effects: reads repository/filesystem state. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `file`. Side effects: reads filesystem state. Returns: computed expression result consumed by the enclosing operation. */ (file) => fs.readFileSync(file, 'utf8')).join('');
new Function('require', '__dirname', '__filename', source)(require, __dirname, __filename);

const repositoryRoot = path.join(__dirname, '..');
const dist = path.join(repositoryRoot, 'dist');
const agentRuntimePath = path.join(dist, 'src', 'scripts', 'features', 'portfolio', 'agent-portfolio.js');
const runtimeEntryPath = path.join(dist, 'script.js');
const compatStylePath = path.join(repositoryRoot, 'src', 'styles', 'fragments', 'agent', 'compatibility.cssfrag');
const distStylePath = path.join(dist, 'style.css');

const customCaseTitles = new Map([
  ['project-yarsha.html', 'Yarsha'],
  ['project-mokshya.html', 'Mokshya.io'],
  ['project-pihub.html', 'piHub'],
  ['project-hamro-idea.html', 'Hamro Idea'],
]);

/**
 * Function contract: escapeAttribute
 * Purpose: Implements the escape attribute responsibility for this module.
 * Inputs: value.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: escapeAttribute
 * Purpose: Implement the escape attribute responsibility owned by the agent redesign repository tool.
 * Inputs: `value`: input value being transformed or evaluated
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function escapeAttribute(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

/**
 * Function contract: externalPrototypeUrl
 * Purpose: Implements the external prototype url responsibility for this module.
 * Inputs: raw.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: externalPrototypeUrl
 * Purpose: Implement the external prototype url responsibility owned by the agent redesign repository tool.
 * Inputs: `raw`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function externalPrototypeUrl(raw) {
  if (!raw) return '';
  try {
    const url = new URL(raw.replaceAll('&amp;', '&'));
    if (url.hostname.endsWith('figma.com') && url.searchParams.get('url')) {
      return url.searchParams.get('url');
    }
    return url.href;
  } catch (_) {
    return raw.replaceAll('&amp;', '&');
  }
}

/**
 * Function contract: htmlFiles
 * Purpose: Implements the html files responsibility for this module.
 * Inputs: directory, output.
 * Side effects: may read or write repository/filesystem state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: htmlFiles
 * Purpose: Implement the html files responsibility owned by the agent redesign repository tool.
 * Inputs: `directory`: input consumed by this operation; `output`: input consumed by this operation
 * Side effects: reads repository/filesystem state.
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function htmlFiles(directory, output = []) {
  if (!fs.existsSync(directory)) return output;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) htmlFiles(file, output);
    else if (entry.isFile() && entry.name.endsWith('.html')) output.push(file);
  }
  return output;
}

for (const [fileName, title] of customCaseTitles) {
  const filePath = path.join(dist, fileName);
  if (!fs.existsSync(filePath)) continue;
  let html = fs.readFileSync(filePath, 'utf8');
  if (!/class=["'][^"']*breadcrumbs/i.test(html)) {
    const breadcrumb = `<div class="agent-frame agent-breadcrumb-wrap"><nav class="breadcrumbs agent-breadcrumbs" aria-label="Breadcrumb"><a href="/projects">Work</a><span aria-hidden="true">/</span><span aria-current="page">${title}</span></nav></div>`;
    html = html.replace(/<header class="agent-case-hero">/i, `<header class="agent-case-hero">${breadcrumb}`);
  }
  if (fileName === 'project-hamro-idea.html') {
    html = html.replace(/>\s*Back to all work\s*</gi, '>View all projects<');
  }
  fs.writeFileSync(filePath, html, 'utf8');
}

const contactPath = path.join(dist, 'contact.html');
if (fs.existsSync(contactPath)) {
  let contactHtml = fs.readFileSync(contactPath, 'utf8');
  contactHtml = contactHtml.replace(
    /<div data-agent-reveal>(<form\b[^>]*class=["'][^"']*agent-contact-form[^"']*["'])/i,
    '<div class="agent-contact-form-wrap" data-agent-reveal>$1',
  );
  fs.writeFileSync(contactPath, contactHtml, 'utf8');
}

for (const fileName of fs.readdirSync(dist).filter(/** Callback contract: Processes the callback step for fs.readdir sync(dist) without leaking orchestration details to the caller. Inputs: name. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Decide whether the current item should remain in the filtered result used by the enclosing operation. Inputs: `name`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Decide whether the current item remains in the filtered result consumed by the enclosing operation. Inputs: `name`. Side effects: no direct external side effect beyond invoked dependencies. Returns: computed expression result consumed by the enclosing operation. */ (name) => /^project-.*\.html$/.test(name))) {
  const filePath = path.join(dist, fileName);
  let html = fs.readFileSync(filePath, 'utf8');
  let replaced = 0;
  html = html.replace(/<iframe\b([^>]*)>[\s\S]*?<\/iframe>/gi, /** Callback contract: Processes the callback step for html without leaking orchestration details to the caller. Inputs: _match, attrs. Side effects: no obvious external side effect beyond invoked dependencies. Returns a value to the invoking API. */ /** Callback contract: Perform the local callback step required by the enclosing agent redesign repository tool operation. Inputs: `_match`, `attrs`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Boolean predicate result consumed by the caller. */ /** Callback contract: Perform the local callback step required by the immediately enclosing operation. Inputs: `_match`, `attrs`. Side effects: no direct external side effect beyond invoked dependencies. Returns: boolean predicate/result. */ (_match, attrs) => {
    replaced += 1;
    const src = attrs.match(/\bsrc=["']([^"']+)["']/i)?.[1] || '';
    const href = externalPrototypeUrl(src);
    if (!href) return '<p class="agent-embed-note">Interactive prototype available on request.</p>';
    return `<p class="agent-embed-note"><a class="agent-btn" href="${escapeAttribute(href)}" target="_blank" rel="noopener noreferrer">Open external prototype</a></p>`;
  });
  if (replaced) fs.writeFileSync(filePath, html, 'utf8');
}

const floatingResumePattern = /\s*<a\b(?=[^>]*\bclass=["'][^"']*\bfloating-resume-btn\b[^"']*["'])[^>]*>[\s\S]*?<\/a>/gi;
const mobileBrand = '<a class="agent-mobile-brand" href="/" aria-label="Nischhal Raj Subba, home"><strong>Nischhal Raj Subba</strong><span>Product designer</span></a>';
for (const filePath of htmlFiles(dist)) {
  let html = fs.readFileSync(filePath, 'utf8');
  html = html.replace(floatingResumePattern, '');
  if (!html.includes('agent-mobile-brand')) {
    html = html.replace(/(<button\b[^>]*class=["'][^"']*\bmobile-nav-toggle\b[^"']*["'][^>]*>)/i, `${mobileBrand}$1`);
  }
  fs.writeFileSync(filePath, html, 'utf8');
}

if (!fs.existsSync(agentRuntimePath) || !fs.existsSync(runtimeEntryPath)) {
  throw new Error('[agent-redesign] copied runtime files are missing');
}

let agentRuntime = fs.readFileSync(agentRuntimePath, 'utf8');
agentRuntime = agentRuntime
  .replace(/\n  setupThemeToggle\(\);/, '')
  .replace(/\n  setupMobileNavigation\(\);/, '');
fs.writeFileSync(agentRuntimePath, agentRuntime, 'utf8');

fs.writeFileSync(runtimeEntryPath, "import './src/scripts/entrypoints/agent-main.js';\n", 'utf8');

if (!fs.existsSync(compatStylePath) || !fs.existsSync(distStylePath)) {
  throw new Error('[agent-redesign] compatibility stylesheet target is missing');
}
fs.appendFileSync(distStylePath, `\n${fs.readFileSync(compatStylePath, 'utf8')}\n`, 'utf8');
