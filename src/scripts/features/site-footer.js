import { $ } from '../utils/dom.js';

const footerMarkup = `
  <div class="container">
    <div class="footer-top-grid">
      <div class="footer-cta">
        <p class="eyebrow">Product designer in Nepal · Remote collaboration</p>
        <h2>Clear product thinking, polished interfaces and practical handoff.</h2>
        <p>Available for product design roles, focused UX/UI projects, design systems, Web3 and SaaS work, website UX and product audits.</p>
        <a href="mailto:hinischalsubba@gmail.com" class="footer-email-btn">hinischalsubba@gmail.com</a>
      </div>
      <div class="footer-nav-grid">
        <div class="footer-col"><h3>Pages</h3><a href="/">Home</a><a href="/projects">Work</a><a href="/services">Services</a><a href="/about">About</a><a href="/blog/">Writing</a><a href="/contact">Contact</a></div>
        <div class="footer-col"><h3>Proof</h3><a href="https://www.behance.net/nischhal" target="_blank" rel="noopener noreferrer">Behance</a><a href="https://linkedin.com/in/nischhal/" target="_blank" rel="noopener noreferrer">LinkedIn</a><a href="https://github.com/Nischhalsubba" target="_blank" rel="noopener noreferrer">GitHub</a><a href="/assets/resume.pdf" download="Nischhal-Raj-Subba-Resume.pdf" data-resume-download>Resume</a></div>
        <div class="footer-col"><h3>Services</h3><a href="/product-design-nepal">Product design</a><a href="/saas-ux-designer">SaaS UX</a><a href="/web3-ux-designer">Web3 UX</a><a href="/figma-design-systems">Design systems</a><a href="/ux-audit">UX audit</a></div>
      </div>
    </div>
    <div class="footer-bottom-bar"><span>© 2026 Nischhal Raj Subba.</span><span>Based in Nepal · UTC+5:45</span><a href="/privacy">Privacy</a></div>
  </div>`;

function buildFooter() {
  const footer = document.createElement('footer');
  footer.className = 'site-footer nrs-generated-footer';
  footer.setAttribute('aria-label', 'Portfolio footer');
  footer.innerHTML = footerMarkup;
  return footer;
}

export function ensureSiteFooter() {
  if ($('footer.site-footer, footer.nrs-auto-footer')) return;
  document.body.appendChild(buildFooter());
}
