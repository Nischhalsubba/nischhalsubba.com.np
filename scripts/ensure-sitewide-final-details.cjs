const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const base = process.argv.includes('--dist') ? path.join(root, 'dist') : root;
const siteUrl = 'https://nischhalsubba.com.np';

function esc(value = '') {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
}

function setMeta(html, selector, tag) {
  return selector.test(html) ? html.replace(selector, tag) : html.replace('</head>', `${tag}\n</head>`);
}

function rewritePrivacy() {
  const file = path.join(base, 'privacy.html');
  if (!fs.existsSync(file)) return false;
  let html = fs.readFileSync(file, 'utf8');
  const main = `<main id="main-content" class="agent-main nrs-editorial-privacy"><header class="agent-page-hero"><div class="agent-frame agent-page-hero-grid"><div><span class="agent-kicker">Privacy</span><h1>A short explanation of what this portfolio collects.</h1></div><p class="agent-page-intro">This site exists to show my work and let people contact me. I do not sell personal information or build advertising profiles from portfolio visitors.</p></div></header><section class="agent-section"><div class="agent-frame nrs-privacy-v4"><article><span class="agent-meta">01 · Contact form</span><h2>What you send</h2><p>If you use the contact form, I receive the information you enter, such as your name, email address, inquiry type, timeline and message. The form may also include the page you submitted from and the submission time so the inquiry has useful context.</p><p>Please do not send passwords, account credentials, sensitive financial information, medical information or anything else that does not belong in an ordinary professional email.</p></article><article><span class="agent-meta">02 · Purpose</span><h2>How I use it</h2><p>I use contact details to reply to job opportunities, project inquiries, portfolio questions or professional collaborations. Messages may remain in my email history so a conversation can continue and I can keep a reasonable record of professional correspondence.</p></article><article><span class="agent-meta">03 · Site measurement</span><h2>Analytics</h2><p>The site may use limited analytics or interaction events to understand whether pages, project links and contact actions are working as intended. I do not use portfolio analytics to create third-party advertising audiences.</p></article><article><span class="agent-meta">04 · External sites</span><h2>Links leave this portfolio</h2><p>Links to services such as LinkedIn, Behance, GitHub, Uxcel or external project material are governed by those services once you leave this site.</p></article><article><span class="agent-meta">05 · Your request</span><h2>Correction or deletion</h2><p>If you want information you previously sent corrected or deleted, email <a href="mailto:hinischalsubba@gmail.com">hinischalsubba@gmail.com</a>. Include enough context for me to identify the relevant message.</p></article><article><span class="agent-meta">06 · Updates</span><h2>When this notice changes</h2><p>I update this page when the contact provider, analytics setup or site architecture changes in a way that affects how visitor information is handled. Last reviewed: August 2026.</p></article></div></section></main>`;
  html = html.replace(/<main\b[^>]*>[\s\S]*?<\/main>/i, main);
  html = html.replace(/<title>[\s\S]*?<\/title>/i, '<title>Privacy | Nischhal Raj Subba</title>');
  html = setMeta(html, /<meta\s+[^>]*name=["']description["'][^>]*>/i, '<meta name="description" content="Privacy information for nischhalsubba.com.np, including contact-form data, limited analytics, external links and deletion requests." />');
  html = html.replace(/aria-label=["']Open navigation menu["']/gi, 'aria-label="Open site navigation"');
  html = html.replace(/aria-label=["']Toggle theme["']/gi, 'aria-label="Switch color theme"');
  fs.writeFileSync(file, html, 'utf8');
  return true;
}

function rewrite404() {
  const file = path.join(base, '404.html');
  if (!fs.existsSync(file)) return false;
  let html = fs.readFileSync(file, 'utf8');
  const main = `<main id="main-content" class="agent-main"><section class="agent-page-hero"><div class="agent-frame agent-page-hero-grid"><div><span class="agent-kicker">404 · Page not found</span><h1>This route does not lead anywhere useful.</h1></div><div><p class="agent-page-intro">The page may have moved, the link may be old, or the URL may simply be wrong. The work and main site sections are still available below.</p><div class="agent-actions"><a class="agent-btn agent-btn--primary" href="/projects">Browse the work</a><a class="agent-btn" href="/">Go to the homepage</a></div></div></div></section></main>`;
  html = html.replace(/<main\b[^>]*>[\s\S]*?<\/main>/i, main);
  html = html.replace(/<title>[\s\S]*?<\/title>/i, '<title>Page Not Found | Nischhal Raj Subba</title>');
  html = setMeta(html, /<meta\s+[^>]*name=["']robots["'][^>]*>/i, '<meta name="robots" content="noindex, follow" />');
  fs.writeFileSync(file, html, 'utf8');
  return true;
}

function sanitizeMetadata() {
  const files = [];
  (function walk(directory) {
    if (!fs.existsSync(directory)) return;
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      if (['node_modules', '.git'].includes(entry.name)) continue;
      const full = path.join(directory, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.isFile() && entry.name.endsWith('.html')) files.push(full);
    }
  })(base);

  let cleaned = 0;
  for (const file of files) {
    let html = fs.readFileSync(file, 'utf8');
    const before = html;
    html = html.replace(/<meta\s+[^>]*(?:property=["']og:image["']|name=["']twitter:image["'])[^>]*content=["']https:\/\/nischhalsubba\.com\.np\/(?:data:image|https?:\/\/)[^"']*["'][^>]*>\s*/gi, '');
    html = html.replace(/<meta\s+[^>]*(?:property=["']og:image["']|name=["']twitter:image["'])[^>]*content=["']data:image[^"']*["'][^>]*>\s*/gi, '');
    html = html.replace(/aria-label=["']Open navigation menu["']/gi, 'aria-label="Open site navigation"');
    html = html.replace(/aria-label=["']Close navigation menu["']/gi, 'aria-label="Close site navigation"');
    html = html.replace(/aria-label=["']Toggle theme["']/gi, 'aria-label="Switch color theme"');
    if (html !== before) {
      fs.writeFileSync(file, html, 'utf8');
      cleaned += 1;
    }
  }
  return cleaned;
}

function appendStyles() {
  const file = path.join(base, 'style.css');
  if (!fs.existsSync(file)) return;
  const start = '/* nrs-sitewide-final-details-v1:start */';
  const end = '/* nrs-sitewide-final-details-v1:end */';
  const marker = /\/\* nrs-sitewide-final-details-v\d+:start \*\/[\s\S]*?\/\* nrs-sitewide-final-details-v\d+:end \*\//g;
  const css = `${start}
.agent-portfolio .nrs-privacy-v4 { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); border-top: 1px solid var(--ap-line-strong); }
.agent-portfolio .nrs-privacy-v4 article { min-width: 0; padding: 1.5rem 1.5rem 2rem 0; border-right: 1px solid var(--ap-line); border-bottom: 1px solid var(--ap-line); }
.agent-portfolio .nrs-privacy-v4 article:nth-child(even) { padding-left: 1.5rem; padding-right: 0; border-right: 0; }
.agent-portfolio .nrs-privacy-v4 h2 { margin: .8rem 0 1rem; color: var(--ap-ink); font: 700 clamp(1.7rem, 3vw, 3rem)/.96 var(--ap-font-display); letter-spacing: -.05em; }
.agent-portfolio .nrs-privacy-v4 p { max-width: 42rem; color: var(--ap-ink-soft); line-height: 1.7; }
@media (max-width: 700px) {
  .agent-portfolio .nrs-privacy-v4 { grid-template-columns: minmax(0, 1fr); }
  .agent-portfolio .nrs-privacy-v4 article,
  .agent-portfolio .nrs-privacy-v4 article:nth-child(even) { padding: 1.25rem 0 1.75rem; border-right: 0; }
}
${end}`;
  let style = fs.readFileSync(file, 'utf8');
  style = style.replace(marker, '').trimEnd();
  style += `\n\n${css}\n`;
  fs.writeFileSync(file, style, 'utf8');
}

const privacy = rewritePrivacy();
const notFound = rewrite404();
const cleaned = sanitizeMetadata();
appendStyles();

const privacyFile = path.join(base, 'privacy.html');
if (fs.existsSync(privacyFile) && !fs.readFileSync(privacyFile, 'utf8').includes('A short explanation of what this portfolio collects.')) {
  throw new Error('[sitewide-final-details] Privacy rewrite did not apply');
}

console.log(`[sitewide-final-details] privacy=${privacy}; 404=${notFound}; metadata/shell files cleaned=${cleaned}; site=${siteUrl}`);
