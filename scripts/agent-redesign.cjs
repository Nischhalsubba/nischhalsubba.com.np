const fs = require('node:fs');
const path = require('node:path');
const parts = [1, 2, 3].map((part) => path.join(__dirname, `agent-redesign-part-${part}.cjsfrag`));
if (parts.some((file) => !fs.existsSync(file))) throw new Error('[agent-redesign] source fragments are missing');
const source = parts.map((file) => fs.readFileSync(file, 'utf8')).join('');
new Function('require', '__dirname', '__filename', source)(require, __dirname, __filename);

const repositoryRoot = path.join(__dirname, '..');
const dist = path.join(repositoryRoot, 'dist');
const agentRuntimePath = path.join(dist, 'src', 'scripts', 'features', 'agent-portfolio.js');
const runtimeEntryPath = path.join(dist, 'script.js');
const compatStylePath = path.join(repositoryRoot, 'src', 'styles', 'agent-compat.cssfrag');
const distStylePath = path.join(dist, 'style.css');

const customCaseTitles = new Map([
  ['project-yarsha.html', 'Yarsha'],
  ['project-mokshya.html', 'Mokshya.io'],
  ['project-pihub.html', 'piHub'],
  ['project-hamro-idea.html', 'Hamro Idea'],
]);

function escapeAttribute(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

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

for (const fileName of fs.readdirSync(dist).filter((name) => /^project-.*\.html$/.test(name))) {
  const filePath = path.join(dist, fileName);
  let html = fs.readFileSync(filePath, 'utf8');
  let replaced = 0;
  html = html.replace(/<iframe\b([^>]*)>[\s\S]*?<\/iframe>/gi, (_match, attrs) => {
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

fs.writeFileSync(runtimeEntryPath, "import './src/scripts/agent-main.js';\n", 'utf8');

if (!fs.existsSync(compatStylePath) || !fs.existsSync(distStylePath)) {
  throw new Error('[agent-redesign] compatibility stylesheet target is missing');
}
fs.appendFileSync(distStylePath, `\n${fs.readFileSync(compatStylePath, 'utf8')}\n`, 'utf8');
