/**
 * @fileoverview scripts/agent-redesign.cjs
 * Purpose: Node-based build, content transformation, QA, or maintenance tool for agent redesign.
 * Responsibilities:
 * - Own the behavior/content implied by this file's single responsibility.
 * - Keep public routes, build contracts, and imported module boundaries stable unless the connected owners are updated together.
 * Execution context: Node.js CLI during local development, CI, build, or maintenance.
 * Connected files:
 * - docs/repository/file-catalog.md
 * - scripts/build-dist.cjs
 * - scripts/repository/fix-deep-style-contracts.cjs
 * - package.json
 * Maintenance: Update this header when responsibility or dependencies change; generated/vendor files are documented at their source instead.
 */
const fs = require('node:fs');
const path = require('node:path');
const parts = [1, 2, 3].map(/** Callback contract: Processes the callback step for [1, 2, 3] without leaking orchestration details to the caller. Inputs: part. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (part) => path.join(__dirname, `agent-redesign-part-${part}.cjsfrag`));
if (parts.some(/** Callback contract: Processes the callback step for parts without leaking orchestration details to the caller. Inputs: file. Side effects: may read or write repository/filesystem state. No explicit return contract. */ (file) => !fs.existsSync(file))) throw new Error('[agent-redesign] source fragments are missing');
const source = parts.map(/** Callback contract: Processes the callback step for parts without leaking orchestration details to the caller. Inputs: file. Side effects: may read or write repository/filesystem state. No explicit return contract. */ (file) => fs.readFileSync(file, 'utf8')).join('');
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

for (const fileName of fs.readdirSync(dist).filter(/** Callback contract: Processes the callback step for fs.readdir sync(dist) without leaking orchestration details to the caller. Inputs: name. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (name) => /^project-.*\.html$/.test(name))) {
  const filePath = path.join(dist, fileName);
  let html = fs.readFileSync(filePath, 'utf8');
  let replaced = 0;
  html = html.replace(/<iframe\b([^>]*)>[\s\S]*?<\/iframe>/gi, /** Callback contract: Processes the callback step for html without leaking orchestration details to the caller. Inputs: _match, attrs. Side effects: no obvious external side effect beyond invoked dependencies. Returns a value to the invoking API. */ (_match, attrs) => {
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
