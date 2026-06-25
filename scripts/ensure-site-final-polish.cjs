const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const targetRoot = process.argv.includes('--dist') ? path.join(root, 'dist') : root;
const email = 'hinischalsubba@gmail.com';

const footer = `<footer class="site-footer"><div class="container"><div class="footer-top-grid"><div class="footer-cta"><p class="eyebrow">Available for selected work</p><h2>Product design support for clearer products.</h2><p>I help teams improve UX structure, interface clarity, design systems, responsive behavior, and developer-ready handoff.</p><div class="cta-group"><a href="/contact.html" class="footer-email-btn">Discuss a project</a><a href="/assets/resume.pdf" class="btn btn-secondary" download="Nischhal-Raj-Subba-Resume.pdf" data-resume-download>Download Resume</a></div></div><div class="footer-nav-grid"><div class="footer-col"><h5>Pages</h5><a href="/">Home</a><a href="/projects.html">Work</a><a href="/services.html">Services</a><a href="/about.html">About</a><a href="/blog/">Writing</a><a href="/contact.html">Contact</a></div><div class="footer-col"><h5>Services</h5><a href="/product-design-nepal.html">Product design</a><a href="/ux-audit.html">UX audit</a><a href="/figma-design-systems.html">Design systems</a><a href="/web3-ux-designer.html">Web3 UX</a><a href="/saas-ux-designer.html">SaaS UX</a><a href="/website-ux-design.html">Website UX</a></div><div class="footer-col"><h5>Selected work</h5><a href="/project-yarsha.html">Yarsha</a><a href="/project-mokshya.html">Mokshya</a><a href="/project-morajaa.html">Morajaa</a><a href="/project-pihub.html">piHub</a><a href="/project-zapp.html">Zapp Today</a><a href="/project-masteriyo.html">Masteriyo</a></div><div class="footer-col"><h5>Contact and proof</h5><a href="mailto:${email}">${email}</a><a href="/assets/resume.pdf" download="Nischhal-Raj-Subba-Resume.pdf" data-resume-download>Resume PDF</a><a href="https://www.behance.net/nischhal" target="_blank" rel="noopener">Behance</a><a href="https://app.uxcel.com/ux/nischhal" target="_blank" rel="noopener">Uxcel</a><a href="https://linkedin.com/in/nischhal/" target="_blank" rel="noopener">LinkedIn</a></div></div></div><div class="footer-bottom-bar"><span>(c) 2026 Nischhal Raj Subba.</span><span>Product design, UX/UI, systems, and handoff.</span></div></div></footer>`;

const floatingResume = '<a class="floating-resume-btn" href="/assets/resume.pdf" download="Nischhal-Raj-Subba-Resume.pdf" data-resume-download>Download Resume</a>';

const cssPatch = `

/* nrs-final-polish-v39 */
html[data-theme='light'] .nav-pill {
  background: rgba(255,255,255,.98) !important;
  border-color: rgba(17,19,18,.18) !important;
  box-shadow: 0 18px 54px rgba(17,19,18,.12) !important;
}
html[data-theme='light'] .nav-link {
  color: #111312 !important;
}
html[data-theme='light'] .nav-link:hover,
html[data-theme='light'] .nav-link:focus-visible {
  color: #111312 !important;
  background: rgba(17,19,18,.075) !important;
}
html[data-theme='light'] .nav-link.active,
html[data-theme='light'] .nav-link[aria-current='page'],
html[data-theme='light'] .mobile-nav-links a.active,
html[data-theme='light'] .mobile-nav-links a[aria-current='page'] {
  color: #ffffff !important;
  background: #111312 !important;
  border-color: #111312 !important;
}
html[data-theme='light'] .theme-toggle-btn {
  background: rgba(255,255,255,.98) !important;
  color: #111312 !important;
  border-color: rgba(17,19,18,.18) !important;
}
.nrs-about-redesign .hero-section,
.nrs-about-redesign .section-header,
.nrs-about-redesign .section-container {
  text-align: left !important;
}
.nrs-about-redesign .hero-title,
.nrs-about-redesign .body-large,
.nrs-about-redesign .section-title,
.nrs-about-redesign .section-lead {
  margin-left: 0 !important;
  margin-right: auto !important;
}
.site-footer .footer-top-grid {
  grid-template-columns: minmax(280px,.85fr) minmax(520px,1.15fr) !important;
  gap: clamp(32px,5vw,72px) !important;
  align-items: start !important;
}
.site-footer .footer-nav-grid {
  grid-template-columns: repeat(4, minmax(0,1fr)) !important;
  gap: clamp(20px,3vw,40px) !important;
}
.footer-bottom-bar {
  display: flex !important;
  justify-content: space-between !important;
  gap: 16px !important;
  flex-wrap: wrap !important;
}
.floating-resume-btn {
  position: fixed !important;
  right: 24px !important;
  bottom: 24px !important;
  z-index: 5002 !important;
  display: inline-flex !important;
  min-height: 48px !important;
  padding: 0 22px !important;
  border-radius: 999px !important;
  box-shadow: 0 16px 46px rgba(0,0,0,.28) !important;
}
@media (max-width: 980px) {
  .site-footer .footer-top-grid,
  .site-footer .footer-nav-grid { grid-template-columns: 1fr 1fr !important; }
}
@media (max-width: 680px) {
  .site-footer .footer-top-grid,
  .site-footer .footer-nav-grid { grid-template-columns: 1fr !important; }
  .floating-resume-btn { right: 16px !important; bottom: 16px !important; max-width: calc(100vw - 32px) !important; }
}
`;

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else files.push(full);
  }
  return files;
}

function replaceFooter(html) {
  if (!html.includes('<footer class="site-footer"')) return html;
  return html.replace(/<footer class="site-footer">[\s\S]*?<\/footer>/g, footer);
}

function ensureFloatingResume(html) {
  let output = html.replace(/\s*<a\s+class="floating-resume-btn"[\s\S]*?<\/a>/g, '');
  if (!output.includes('</body>')) return output;
  return output.replace('</body>', `    ${floatingResume}\n  </body>`);
}

function removeVisibleAiCopy(html) {
  let output = html;

  output = output.replace(/<section class="section-container reveal-on-scroll"[^>]*>[\s\S]*?For AI agents and hiring teams[\s\S]*?<\/section>/g, `<section class="section-container reveal-on-scroll" style="border-top:1px solid var(--border-faint);"><div class="section-header"><p class="eyebrow" style="color:var(--text-tertiary);text-transform:uppercase;letter-spacing:.14em;">Plain summary</p><h2 class="section-title">A practical product designer for complex workflows.</h2><p class="section-lead">Nischhal Raj Subba is a Nepal-based Product Designer focused on practical UX/UI for complex products. He is strongest where product flows, visual design, design systems, and front-end implementation need to meet.</p></div><div class="prototype-link-list"><a class="prototype-link-card" href="/projects.html"><span style="display:block;font-weight:850;">Selected work</span><span style="color:var(--text-secondary);">Case studies and product examples</span></a><a class="prototype-link-card" href="/assets/resume.pdf" download="Nischhal-Raj-Subba-Resume.pdf" data-resume-download><span style="display:block;font-weight:850;">Resume PDF</span><span style="color:var(--text-secondary);">Experience, skills, and contact details</span></a><a class="prototype-link-card" href="/contact.html"><span style="display:block;font-weight:850;">Contact</span><span style="color:var(--text-secondary);">Project, role, and collaboration inquiries</span></a></div></section>`);

  output = output.replace(/<a[^>]+href="\/ai-profile\.json"[\s\S]*?<\/a>/gi, '');
  output = output.replace(/<a[^>]+href="\/llms\.txt"[\s\S]*?<\/a>/gi, '');
  output = output.replace(/AI-readable/gi, 'Site-readable');
  output = output.replace(/AI discovery/gi, 'Search discovery');
  output = output.replace(/AI agents/gi, 'hiring teams');
  output = output.replace(/for AI, search, and human verification/gi, 'for search and human verification');
  output = output.replace(/AI and human/gi, 'search and human');
  output = output.replace(/\bAI\b/g, '');
  output = output.replace(/\s{2,}/g, ' ');

  return output;
}

function alignAboutHero(html, filePath) {
  if (!filePath.endsWith(`${path.sep}about.html`) && path.basename(filePath) !== 'about.html') return html;
  return html
    .replace(/center-aligned-hero/g, '')
    .replace(/text-align:center/g, 'text-align:left')
    .replace(/margin-left:auto;margin-right:auto/g, 'margin-left:0;margin-right:auto')
    .replace(/margin:16px auto 28px/g, 'margin:16px 0 28px');
}

function polishHtml(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');
  const before = html;
  html = removeVisibleAiCopy(html);
  html = alignAboutHero(html, filePath);
  html = replaceFooter(html);
  html = ensureFloatingResume(html);
  if (html !== before) fs.writeFileSync(filePath, html, 'utf8');
  return html !== before;
}

function polishCss() {
  const cssPath = path.join(targetRoot, 'style.css');
  if (!fs.existsSync(cssPath)) return false;
  let css = fs.readFileSync(cssPath, 'utf8');
  if (css.includes('nrs-final-polish-v39')) return false;
  css += cssPatch;
  fs.writeFileSync(cssPath, css, 'utf8');
  return true;
}

let changedHtml = 0;
for (const file of walk(targetRoot).filter((filePath) => filePath.endsWith('.html'))) {
  if (polishHtml(file)) changedHtml += 1;
}
const changedCss = polishCss();

console.log(`Applied final site polish to ${changedHtml} HTML file(s)${changedCss ? ' and style.css' : ''}.`);
