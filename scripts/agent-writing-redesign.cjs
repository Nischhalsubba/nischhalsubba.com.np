const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const files = [path.join(dist, 'blog', 'index.html'), path.join(dist, 'blog.html')].filter(fs.existsSync);

function text(value = '') {
  return value
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&rarr;/g, '→')
    .replace(/\s+/g, ' ')
    .trim();
}

function escape(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

for (const file of files) {
  let html = fs.readFileSync(file, 'utf8');
  const posts = [];
  const itemPattern = /<a\b([^>]*class=["'][^"']*writing-item[^"']*["'][^>]*)>([\s\S]*?)<\/a>/gi;
  for (const match of html.matchAll(itemPattern)) {
    const attrs = match[1];
    const body = match[2];
    const href = attrs.match(/\bhref=["']([^"']+)["']/i)?.[1];
    const date = text(body.match(/class=["'][^"']*w-date[^"']*["'][^>]*>([\s\S]*?)<\/span>/i)?.[1]);
    const title = text(body.match(/class=["'][^"']*w-title[^"']*["'][^>]*>([\s\S]*?)<\/span>/i)?.[1]);
    const summary = text(body.match(/class=["'][^"']*w-summary[^"']*["'][^>]*>([\s\S]*?)<\/span>/i)?.[1]);
    if (href && title) posts.push({ href, date, title, summary });
  }

  if (!posts.length) continue;

  const list = posts.map((post, index) => `<a class="agent-index-item" href="${escape(post.href)}" data-agent-reveal><span class="agent-project-index">${String(index + 1).padStart(2, '0')}</span><h2>${escape(post.title)}</h2><span class="agent-meta">${escape(post.date || 'Essay')}</span><p>${escape(post.summary)}</p><span class="agent-project-arrow" aria-hidden="true">↗</span></a>`).join('');
  const main = `<main id="main-content" class="agent-main"><header class="agent-page-hero"><div class="agent-frame agent-page-hero-grid"><div><span class="agent-kicker">Writing</span><h1>Notes from the difficult parts.</h1></div><p class="agent-page-intro">Product-design writing about audits, SaaS dashboards, Web3 flows, design systems, responsive behavior, implementation handoff, and the decisions hidden between screens.</p></div></header><section class="agent-section agent-section--compact"><div class="agent-frame"><div class="agent-index-list">${list}</div></div></section></main>`;
  html = html.replace(/<main\b[^>]*>[\s\S]*?<\/main>/i, main);
  fs.writeFileSync(file, html, 'utf8');
}

console.log(`[agent-writing] Rebuilt ${files.length} writing index route(s).`);
