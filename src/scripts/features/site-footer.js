import { $ } from '../utils/dom.js';

function buildFooter() {
  const footer = document.createElement('footer');
  footer.className = 'site-footer nrs-generated-footer';
  footer.innerHTML = `
    <div class="container">
      <div class="footer-top-grid">
        <div class="footer-cta">
          <h2>Let's design<br>something<br><span style="font-style:italic;">clear.</span></h2>
          <p>Available for product design, Web3 UX, SaaS dashboards, service websites, Figma design systems, UX audits, and developer-ready handoff.</p>
          <a href="mailto:hinischalsubba@gmail.com" class="footer-email-btn">hinischalsubba@gmail.com</a>
        </div>
        <div class="footer-nav-grid">
          <div class="footer-col">
            <h5>Sitemap</h5>
            <a href="/">Home</a>
            <a href="/projects.html">Work</a>
            <a href="/about.html">About</a>
            <a href="/blog/">Writing</a>
            <a href="/contact.html">Contact</a>
          </div>
          <div class="footer-col">
            <h5>Services</h5>
            <a href="/product-design-nepal.html">Product Design</a>
            <a href="/web3-ux-designer.html">Web3 UX</a>
            <a href="/saas-ux-designer.html">SaaS UX</a>
            <a href="/website-ux-design.html">Website UX</a>
            <a href="/figma-design-systems.html">Figma Systems</a>
            <a href="/ux-audit.html">UX Audit</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom-bar">
        <span>(c) 2026 Nischhal Raj Subba. Product Designer in Nepal.</span>
      </div>
    </div>`;
  return footer;
}

export function ensureSiteFooter() {
  if ($('footer.site-footer, footer.nrs-auto-footer')) return;
  document.body.appendChild(buildFooter());
}
