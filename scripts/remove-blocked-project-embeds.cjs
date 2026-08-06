const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const base = process.argv.includes('--dist') ? path.join(root, 'dist') : root;
const files = fs.existsSync(base)
  ? fs.readdirSync(base).filter((name) => /^project-[a-z0-9-]+\.html$/i.test(name))
  : [];

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function externalTarget(source) {
  try {
    const parsed = new URL(source, 'https://nischhalsubba.com.np');
    const nested = parsed.searchParams.get('url');
    if (nested) return decodeURIComponent(nested);
    return parsed.href;
  } catch {
    return source;
  }
}

let replaced = 0;
for (const fileName of files) {
  const filePath = path.join(base, fileName);
  let html = fs.readFileSync(filePath, 'utf8');
  html = html.replace(/<iframe\b([^>]*)>[\s\S]*?<\/iframe>/gi, (_match, attributes) => {
    const source = attributes.match(/\bsrc=["']([^"']+)["']/i)?.[1] || '';
    const title = attributes.match(/\btitle=["']([^"']+)["']/i)?.[1] || 'Project prototype';
    const target = externalTarget(source);
    replaced += 1;
    return `<div class="nrs-embed-fallback-card"><strong>${escapeHtml(title)}</strong><p>The interactive embed was removed so the case study remains fast and reliable when third-party previews are blocked.</p>${target ? `<a href="${escapeHtml(target)}" target="_blank" rel="noopener noreferrer">Open the external prototype ↗</a>` : ''}</div>`;
  });
  fs.writeFileSync(filePath, html, 'utf8');
}

console.log(`Replaced ${replaced} project iframe(s) with reliable external prototype links.`);
