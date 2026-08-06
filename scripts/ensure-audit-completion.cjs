const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const site = 'https://nischhalsubba.com.np';

function walk(directory, files = []) {
  if (!fs.existsSync(directory)) return files;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else files.push(full);
  }
  return files;
}

function footerMarkup() {
  return `<footer class="site-footer" aria-label="Portfolio footer">
  <div class="container">
    <div class="footer-top-grid">
      <div class="footer-cta">
        <p class="eyebrow">Product designer in Nepal · Remote collaboration</p>
        <h2>Clear product thinking, polished interfaces and practical handoff.</h2>
        <p>Available for product design roles, focused UX/UI projects, design systems, Web3 and SaaS work, website UX and product audits.</p>
        <a href="mailto:hinischalsubba@gmail.com" class="footer-email-btn">hinischalsubba@gmail.com</a>
      </div>
      <div class="footer-nav-grid">
        <div class="footer-col">
          <h3>Pages</h3>
          <a href="/">Home</a><a href="/projects">Work</a><a href="/services">Services</a><a href="/about">About</a><a href="/blog/">Writing</a><a href="/contact">Contact</a>
        </div>
        <div class="footer-col">
          <h3>Proof</h3>
          <a href="https://www.behance.net/nischhal" target="_blank" rel="noopener noreferrer">Behance</a>
          <a href="https://linkedin.com/in/nischhal/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href="https://github.com/Nischhalsubba" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="/assets/resume.pdf" download="Nischhal-Raj-Subba-Resume.pdf" data-resume-download>Resume</a>
        </div>
        <div class="footer-col">
          <h3>Services</h3>
          <a href="/product-design-nepal">Product design</a><a href="/saas-ux-designer">SaaS UX</a><a href="/web3-ux-designer">Web3 UX</a><a href="/figma-design-systems">Design systems</a><a href="/ux-audit">UX audit</a>
        </div>
      </div>
    </div>
    <div class="footer-bottom-bar"><span>© 2026 Nischhal Raj Subba.</span><span>Based in Nepal · UTC+5:45</span><a href="/privacy">Privacy</a></div>
  </div>
</footer>`;
}

function ensureFooter(html) {
  if (/<footer\b[^>]*class=["'][^"']*site-footer/i.test(html)) return html;
  return html.replace(/\s*(<script\b[^>]*src=["']\/script\.js[^>]*><\/script>\s*<\/body>)/i, `\n${footerMarkup()}\n    $1`);
}

function ensureContactPrivacy(html, relativePath) {
  if (relativePath !== 'contact.html') return html;
  const output = html.replace(/\s*<input[^>]+name=["']_captcha["'][^>]*>/gi, '');
  if (output.includes('id="contact-privacy-note"') || output.includes("id='contact-privacy-note'")) return output;
  if (output.includes('class="nrs-contact-privacy"')) return output;
  return output.replace(/(<p[^>]+id=["']contact-form-status["'][^>]*><\/p>)/i, `$1<p class="nrs-contact-privacy">Your message is sent through this website only to respond to your enquiry. Do not include sensitive personal information. <a href="/privacy">Read the privacy notice</a>.</p>`);
}

function projectCoverFor(relativePath) {
  const match = path.basename(relativePath).match(/^project-(.+)\.html$/);
  if (!match) return null;
  const candidate = `assets/images/project-${match[1]}-cover.svg`;
  return fs.existsSync(path.join(dist, candidate)) ? `/${candidate}` : '/assets/images/portrait.png';
}

function ensureStaticFigmaProof(html, relativePath) {
  if (!/<iframe\b[^>]*figma\.com/i.test(html)) return html;
  const cover = projectCoverFor(relativePath) || '/assets/images/portrait.png';
  const title = path.basename(relativePath, '.html').replace(/^project-/, '').replaceAll('-', ' ');

  return html.replace(/(<iframe\b[^>]*figma\.com[^>]*><\/iframe>)/gi, (frame, _match, offset, source) => {
    const before = source.slice(Math.max(0, offset - 400), offset);
    if (before.includes('nrs-static-figma-proof')) return frame;
    return `<figure class="nrs-static-figma-proof"><img src="${cover}" alt="Static project preview for ${title}" loading="lazy" decoding="async" /><figcaption>Static project evidence remains available even when the optional Figma preview is blocked.</figcaption></figure>${frame}`;
  });
}

function ensurePrivacyMetadata(html) {
  if (!html.includes('class="nrs-privacy-page"')) return html;
  let output = html;
  if (!/property=["']og:title["']/i.test(output)) output = output.replace('</head>', '    <meta property="og:title" content="Privacy | Nischhal Raj Subba" />\n  </head>');
  if (!/property=["']og:description["']/i.test(output)) output = output.replace('</head>', '    <meta property="og:description" content="How contact messages and basic portfolio analytics are handled on nischhalsubba.com.np." />\n  </head>');
  if (!/name=["']twitter:card["']/i.test(output)) output = output.replace('</head>', '    <meta name="twitter:card" content="summary" />\n  </head>');
  return output;
}

function processHtml() {
  for (const file of walk(dist).filter((item) => item.endsWith('.html'))) {
    const relativePath = path.relative(dist, file).replaceAll(path.sep, '/');
    const original = fs.readFileSync(file, 'utf8');
    const updated = ensurePrivacyMetadata(ensureStaticFigmaProof(ensureContactPrivacy(ensureFooter(original), relativePath), relativePath));
    if (updated !== original) fs.writeFileSync(file, updated, 'utf8');
  }
}

function ensureRedirects() {
  const file = path.join(dist, '_redirects');
  const original = fs.existsSync(file) ? fs.readFileSync(file, 'utf8').trimEnd() : '';
  const additions = [];
  if (!/^\/writing\s+\/blog\/\s+301$/m.test(original)) additions.push('/writing /blog/ 301');
  if (!/^\/writing\/\s+\/blog\/\s+301$/m.test(original)) additions.push('/writing/ /blog/ 301');
  if (additions.length) fs.writeFileSync(file, `${original}\n${additions.join('\n')}\n`, 'utf8');
}

function ensurePrivacyInSitemap() {
  const file = path.join(dist, 'sitemap.xml');
  if (!fs.existsSync(file)) return;
  const original = fs.readFileSync(file, 'utf8');
  if (original.includes(`${site}/privacy`)) return;
  const lastmod = new Date().toISOString().slice(0, 10);
  const node = `  <url>\n    <loc>${site}/privacy</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>\n`;
  fs.writeFileSync(file, original.replace('</urlset>', `${node}</urlset>`), 'utf8');
}

if (!fs.existsSync(dist)) throw new Error('dist directory is missing. Run the build first.');
processHtml();
ensureRedirects();
ensurePrivacyInSitemap();
console.log('Applied final audit completion rules: authored footers, privacy messaging, static Figma proof and legacy writing redirects.');
