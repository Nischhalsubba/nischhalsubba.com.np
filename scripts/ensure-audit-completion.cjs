/**
 * @fileoverview scripts/ensure-audit-completion.cjs
 * Purpose: Node-based build, content transformation, QA, or maintenance tool for ensure audit completion.
 * Responsibilities:
 * - Own the behavior/content implied by this file's single responsibility.
 * - Keep public routes, build contracts, and imported module boundaries stable unless the connected owners are updated together.
 * Execution context: Node.js CLI during local development, CI, build, or maintenance.
 * Connected files:
 * - docs/repository/file-catalog.md
 * - scripts/build-dist.cjs
 * - package.json
 * Maintenance: Update this header when responsibility or dependencies change; generated/vendor files are documented at their source instead.
 */
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const site = 'https://nischhalsubba.com.np';

/**
 * Function contract: walk
 * Purpose: Implements the walk responsibility for this module.
 * Inputs: directory, files.
 * Side effects: may read or write repository/filesystem state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function walk(directory, files = []) {
  if (!fs.existsSync(directory)) return files;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else files.push(full);
  }
  return files;
}

/**
 * Function contract: footerMarkup
 * Purpose: Implements the footer markup responsibility for this module.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
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

/**
 * Function contract: ensureFooter
 * Purpose: Applies ensure footer while preserving the surrounding repository/runtime contract.
 * Inputs: html.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function ensureFooter(html) {
  if (/<footer\b[^>]*class=["'][^"']*site-footer/i.test(html)) return html;
  return html.replace(/\s*(<script\b[^>]*src=["']\/script\.js[^>]*><\/script>\s*<\/body>)/i, `\n${footerMarkup()}\n    $1`);
}

/**
 * Function contract: ensureContactPrivacy
 * Purpose: Applies ensure contact privacy while preserving the surrounding repository/runtime contract.
 * Inputs: html, relativePath.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function ensureContactPrivacy(html, relativePath) {
  if (relativePath !== 'contact.html') return html;
  let output = html.replace(/\s*<input[^>]+name=["']_captcha["'][^>]*>/gi, '');

  // The canonical Contact generator owns the visible disclosure through
  // #contact-privacy-note. Older builds appended a second privacy paragraph here,
  // which duplicated legal copy and changed the page height after later rewrites.
  if (/id=["']contact-privacy-note["']/i.test(output)) {
    return output.replace(/\s*<p[^>]+class=["'][^"']*nrs-contact-privacy[^"']*["'][^>]*>[\s\S]*?<\/p>/gi, '');
  }

  if (!output.includes('class="nrs-contact-privacy"')) {
    output = output.replace(/(<p[^>]+id=["']contact-form-status["'][^>]*><\/p>)/i, `$1<p class="nrs-contact-privacy">Your message is used only to respond to this enquiry. Do not include sensitive personal information. <a href="/privacy">Read the privacy notice</a>.</p>`);
  }
  return output;
}

/**
 * Function contract: projectCoverFor
 * Purpose: Implements the project cover for responsibility for this module.
 * Inputs: relativePath.
 * Side effects: may read or write repository/filesystem state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function projectCoverFor(relativePath) {
  const match = path.basename(relativePath).match(/^project-(.+)\.html$/);
  if (!match) return null;
  const candidate = `assets/images/project-${match[1]}-cover.svg`;
  return fs.existsSync(path.join(dist, candidate)) ? `/${candidate}` : '/assets/images/portrait.png';
}

/**
 * Function contract: ensureStaticFigmaProof
 * Purpose: Applies ensure static figma proof while preserving the surrounding repository/runtime contract.
 * Inputs: html, relativePath.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function ensureStaticFigmaProof(html, relativePath) {
  if (!/<iframe\b[^>]*figma\.com/i.test(html)) return html;
  const cover = projectCoverFor(relativePath) || '/assets/images/portrait.png';
  const title = path.basename(relativePath, '.html').replace(/^project-/, '').replaceAll('-', ' ');

  return html.replace(/(<iframe\b[^>]*figma\.com[^>]*><\/iframe>)/gi, /** Callback contract: Processes the callback step for html without leaking orchestration details to the caller. Inputs: frame, _match, offset, source. Side effects: no obvious external side effect beyond invoked dependencies. Returns a value to the invoking API. */ (frame, _match, offset, source) => {
    const before = source.slice(Math.max(0, offset - 400), offset);
    if (before.includes('nrs-static-figma-proof')) return frame;
    return `<figure class="nrs-static-figma-proof"><img src="${cover}" alt="Static project preview for ${title}" loading="lazy" decoding="async" /><figcaption>Static project evidence remains available even when the optional Figma preview is blocked.</figcaption></figure>${frame}`;
  });
}

/**
 * Function contract: ensurePrivacyMetadata
 * Purpose: Applies ensure privacy metadata while preserving the surrounding repository/runtime contract.
 * Inputs: html.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function ensurePrivacyMetadata(html) {
  if (!html.includes('class="nrs-privacy-page"')) return html;
  let output = html;
  if (!/property=["']og:title["']/i.test(output)) output = output.replace('</head>', '    <meta property="og:title" content="Privacy | Nischhal Raj Subba" />\n  </head>');
  if (!/property=["']og:description["']/i.test(output)) output = output.replace('</head>', '    <meta property="og:description" content="How contact messages and basic portfolio analytics are handled on nischhalsubba.com.np." />\n  </head>');
  if (!/name=["']twitter:card["']/i.test(output)) output = output.replace('</head>', '    <meta name="twitter:card" content="summary" />\n  </head>');
  return output;
}

/**
 * Function contract: processHtml
 * Purpose: Implements the process html responsibility for this module.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may read or write repository/filesystem state.
 * Returns: no explicit value unless an invoked dependency throws/rejects.
 */
function processHtml() {
  for (const file of walk(dist).filter(/** Callback contract: Processes the callback step for walk(dist) without leaking orchestration details to the caller. Inputs: item. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (item) => item.endsWith('.html'))) {
    const relativePath = path.relative(dist, file).replaceAll(path.sep, '/');
    const original = fs.readFileSync(file, 'utf8');
    const updated = ensurePrivacyMetadata(ensureStaticFigmaProof(ensureContactPrivacy(ensureFooter(original), relativePath), relativePath));
    if (updated !== original) fs.writeFileSync(file, updated, 'utf8');
  }
}

/**
 * Function contract: ensureRedirects
 * Purpose: Applies ensure redirects while preserving the surrounding repository/runtime contract.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may read or write repository/filesystem state.
 * Returns: no explicit value unless an invoked dependency throws/rejects.
 */
function ensureRedirects() {
  const file = path.join(dist, '_redirects');
  const original = fs.existsSync(file) ? fs.readFileSync(file, 'utf8').trimEnd() : '';
  const additions = [];
  if (!/^\/writing\s+\/blog\/\s+301$/m.test(original)) additions.push('/writing /blog/ 301');
  if (!/^\/writing\/\s+\/blog\/\s+301$/m.test(original)) additions.push('/writing/ /blog/ 301');
  if (additions.length) fs.writeFileSync(file, `${original}\n${additions.join('\n')}\n`, 'utf8');
}

/**
 * Function contract: ensurePrivacyInSitemap
 * Purpose: Applies ensure privacy in sitemap while preserving the surrounding repository/runtime contract.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may read or write repository/filesystem state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
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
