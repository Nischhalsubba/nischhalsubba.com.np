/**
 * @fileoverview scripts/portfolio-redesign.cjs
 * Purpose: Assemble the redesigned portfolio production layer from its source fragments and apply final runtime, case-study, contact, resume, and compatibility-style adjustments to `dist/`.
 * Responsibilities:
 * - Execute the three portfolio redesign source fragments in their established order.
 * - Add missing case-study breadcrumbs and normalize selected project actions.
 * - Replace embedded prototype iframes with external prototype links.
 * - Remove duplicate floating resume controls and ensure the mobile brand exists.
 * - Prepare the portfolio runtime module and write the redesigned production entrypoint.
 * - Append the redesign compatibility stylesheet required by the generated markup.
 * Execution context: Node.js production build stage executed after canonical runtime and route output exist in `dist/`.
 * Connected files:
 * - scripts/build-dist.cjs
 * - scripts/portfolio-redesign-part-1.cjsfrag
 * - scripts/portfolio-redesign-part-2.cjsfrag
 * - scripts/portfolio-redesign-part-3.cjsfrag
 * - src/scripts/entrypoints/portfolio-main.js
 * - src/scripts/features/portfolio/agent-portfolio.js
 * - src/styles/fragments/portfolio/compatibility.cssfrag
 * Maintenance: Preserve the transformation order and existing DOM contracts until shared selectors are migrated across markup, CSS, browser runtime, and audits together. This stage should remain production-only and must not become a second owner of canonical page source.
 */
const fs = require('node:fs');
const path = require('node:path');

const parts = [];
for (const part of [1, 2, 3]) {
  parts.push(path.join(__dirname, `portfolio-redesign-part-${part}.cjsfrag`));
}
for (const file of parts) {
  if (!fs.existsSync(file)) throw new Error(`[portfolio-redesign] missing source fragment: ${path.basename(file)}`);
}

let source = '';
for (const file of parts) {
  source += fs.readFileSync(file, 'utf8');
}
new Function('require', '__dirname', '__filename', source)(require, __dirname, __filename);

const repositoryRoot = path.join(__dirname, '..');
const dist = path.join(repositoryRoot, 'dist');
const portfolioRuntimePath = path.join(dist, 'src', 'scripts', 'features', 'portfolio', 'agent-portfolio.js');
const runtimeEntryPath = path.join(dist, 'script.js');
const compatibilityStylePath = path.join(repositoryRoot, 'src', 'styles', 'fragments', 'portfolio', 'compatibility.cssfrag');
const distStylePath = path.join(dist, 'style.css');

const customCaseTitles = new Map([
  ['project-yarsha.html', 'Yarsha'],
  ['project-mokshya.html', 'Mokshya.io'],
  ['project-pihub.html', 'piHub'],
  ['project-hamro-idea.html', 'Hamro Idea'],
]);

/**
 * Function contract: escapeAttribute
 * Purpose: Escape a URL or text value before inserting it into a generated HTML attribute.
 * Inputs: `value` - Value to convert to text and escape.
 * Side effects: None.
 * Returns: HTML-attribute-safe string.
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
 * Purpose: Resolve an embedded Figma URL to the actual external prototype URL when the embed wrapper stores it in the `url` query parameter.
 * Inputs: `raw` - Raw iframe source value, possibly HTML-escaped.
 * Side effects: None.
 * Returns: External prototype URL, normalized original URL, or an empty string when no source was provided.
 */
function externalPrototypeUrl(raw) {
  if (!raw) return '';
  try {
    const url = new URL(raw.replaceAll('&amp;', '&'));
    if (url.hostname.endsWith('figma.com') && url.searchParams.get('url')) {
      return url.searchParams.get('url');
    }
    return url.href;
  } catch {
    return raw.replaceAll('&amp;', '&');
  }
}

/**
 * Function contract: htmlFiles
 * Purpose: Recursively collect generated HTML files beneath a directory.
 * Inputs: `directory` - Directory to scan; `output` - optional accumulator used during recursion.
 * Side effects: Reads filesystem directory entries.
 * Returns: Array of absolute HTML file paths.
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

const projectFiles = [];
for (const name of fs.readdirSync(dist)) {
  if (/^project-.*\.html$/.test(name)) projectFiles.push(name);
}
for (const fileName of projectFiles) {
  const filePath = path.join(dist, fileName);
  let html = fs.readFileSync(filePath, 'utf8');
  let replaced = 0;
  html = html.replace(
    /<iframe\b([^>]*)>[\s\S]*?<\/iframe>/gi,
    /** Callback contract: Replace one embedded prototype frame with a normal external link while preserving a useful fallback when no target URL can be resolved. Inputs: `_match`, `attrs`. Side effects: Increments the local replacement counter. Returns: Replacement HTML for the matched iframe. */
    (_match, attrs) => {
      replaced += 1;
      const src = attrs.match(/\bsrc=["']([^"']+)["']/i)?.[1] || '';
      const href = externalPrototypeUrl(src);
      if (!href) return '<p class="agent-embed-note">Interactive prototype available on request.</p>';
      return `<p class="agent-embed-note"><a class="agent-btn" href="${escapeAttribute(href)}" target="_blank" rel="noopener noreferrer">Open external prototype</a></p>`;
    },
  );
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

if (!fs.existsSync(portfolioRuntimePath) || !fs.existsSync(runtimeEntryPath)) {
  throw new Error('[portfolio-redesign] copied runtime files are missing');
}

let portfolioRuntime = fs.readFileSync(portfolioRuntimePath, 'utf8');
portfolioRuntime = portfolioRuntime
  .replace(/\n  setupThemeToggle\(\);/, '')
  .replace(/\n  setupMobileNavigation\(\);/, '');
fs.writeFileSync(portfolioRuntimePath, portfolioRuntime, 'utf8');

fs.writeFileSync(runtimeEntryPath, "import './src/scripts/entrypoints/portfolio-main.js';\n", 'utf8');

if (!fs.existsSync(compatibilityStylePath) || !fs.existsSync(distStylePath)) {
  throw new Error('[portfolio-redesign] compatibility stylesheet target is missing');
}
fs.appendFileSync(distStylePath, `\n${fs.readFileSync(compatibilityStylePath, 'utf8')}\n`, 'utf8');
