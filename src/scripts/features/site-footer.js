import { $ } from '../utils/dom.js';

function buildFooter() {
  const footer = document.createElement('footer');
  footer.className = 'site-footer nrs-generated-footer';
  footer.innerHTML = `
    <div class="container">
      <div class="footer-top-grid">
        <div class="footer-cta">
          <h2>Available for<br>senior product<br><span style="font-style:italic;">design work.</span></h2>
          <p>Mobile apps, Web3 UX, SaaS dashboards, websites, design systems, prototypes, design QA, and developer-ready handoff.</p>
          <a href="mailto:hinischalsubba@gmail.com" class="footer-email-btn">hinischalsubba@gmail.com</a>
        </div>
        <div class="footer-nav-grid">
          <div class="footer-col">
            <h5>Pages</h5>
            <a href="/">Home</a>
            <a href="/projects.html">Work</a>
            <a href="/about.html">About</a>
            <a href="/blog/">Writing</a>
            <a href="/contact.html">Contact</a>
          </div>
          <div class="footer-col">
            <h5>Links</h5>
            <a href="https://linkedin.com/in/nischhal/" target="_blank" rel="noopener">LinkedIn</a>
            <a href="https://www.behance.net/nischhal" target="_blank" rel="noopener">Behance</a>
            <a href="https://github.com/Nischhalsubba" target="_blank" rel="noopener">GitHub</a>
            <a href="/assets/resume.pdf" download="Nischhal-Raj-Subba-Resume.pdf" data-resume-download>Resume</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom-bar">
        <span>(c) 2026 Nischhal Raj Subba.</span>
      </div>
    </div>`;
  return footer;
}

export function ensureSiteFooter() {
  if ($('footer.site-footer, footer.nrs-auto-footer')) return;
  document.body.appendChild(buildFooter());
}
