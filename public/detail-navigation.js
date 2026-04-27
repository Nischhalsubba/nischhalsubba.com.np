/* Detail page continuation, footer fallback, and resume download enhancement. */
(() => {
  const PROJECTS = [
    ['Yarsha', 'Web3 Messaging App', '/project-yarsha.html'],
    ['Mokshya.io', 'Web3 Protocol Website', '/project-mokshya.html'],
    ['Hamro Idea', 'Brand + Website', '/project-hamro-idea.html'],
    ['Morajaa', 'B2B Consulting Website', '/project-morajaa.html'],
    ['piHub', 'Fintech App Experience', '/project-pihub.html'],
    ['Masteriyo LMS', 'EdTech Design Contribution', '/project-masteriyo.html'],
    ['Zapp Today', 'Logistics Mobile App', '/project-zapp.html'],
    ['Orkest HQ', 'Modular SaaS UX', '/project-orkest.html'],
    ['Splashnode', 'Website Design + Front-End', '/project-splashnode.html'],
    ['Neverwinter Live Parser', 'Gaming UX + Desktop Tool', '/project-neverwinter-parser.html'],
    ['Grid Labs Hosting', 'Hosting Landing Page', '/project-grid-labs.html'],
    ['Zakra Furniture', 'WordPress Starter Website', '/project-zakra-furniture.html'],
    ['Designerex', 'Marketplace Design Contribution', '/project-designerex.html'],
    ['sassBoilerplate', 'Front-End Workflow Toolkit', '/project-sassboilerplate.html']
  ];

  const BLOGS = [
    ['Designing Web3 Products Without Making Users Feel Lost', 'Web3 UX', '/blog/blog-web3-products.html'],
    ['Why Good Handoff Matters More Than Perfect Screens', 'Design Handoff', '/blog/blog-good-handoff.html'],
    ['What I Learned Designing My Portfolio Like a Product', 'Portfolio Strategy', '/blog/blog-portfolio-product.html'],
    ['Designing Service Websites That Explain the Business Clearly', 'Website UX', '/blog/blog-service-websites.html'],
    ['What Gaming Taught Me About Interface Clarity', 'Gaming UX', '/blog/blog-gaming-interface-clarity.html'],
    ['How I Think About Design Systems as a Front-End-Aware Designer', 'Design Systems', '/blog/blog-design-systems-front-end.html']
  ];

  const styles = `
    .other-cases-section { display: none !important; }
    .nrs-detail-continuation { position: relative; z-index: 10; padding: clamp(72px, 10vw, 120px) clamp(24px, 5vw, 40px); border-top: 1px solid var(--border-faint, rgba(255,255,255,.08)); }
    .nrs-detail-continuation__inner { max-width: var(--max-width, 1200px); margin: 0 auto; }
    .nrs-detail-continuation__eyebrow { color: var(--text-tertiary, #a1a1aa); text-transform: uppercase; letter-spacing: .14em; font-size: .78rem; margin: 0 0 16px; }
    .nrs-detail-continuation__title { font-size: clamp(2rem, 4vw, 3.2rem); line-height: 1.1; margin: 0 0 32px; font-family: var(--font-serif, serif); font-weight: 400; color: var(--text-primary, #fff); }
    .nrs-detail-continuation__grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px; }
    .nrs-detail-card { min-height: 180px; padding: clamp(24px, 4vw, 40px); border: 1px solid var(--border-faint, rgba(255,255,255,.08)); border-radius: 24px; background: var(--bg-surface, #0a0a0a); color: inherit; text-decoration: none; display: flex; flex-direction: column; justify-content: space-between; transition: transform .3s ease, border-color .3s ease, background .3s ease; }
    .nrs-detail-card:hover { transform: translateY(-6px); border-color: var(--border-light, rgba(255,255,255,.18)); }
    .nrs-detail-card__kicker { color: var(--text-tertiary, #a1a1aa); text-transform: uppercase; letter-spacing: .12em; font-size: .75rem; margin-bottom: 18px; display: block; }
    .nrs-detail-card h3 { font-size: clamp(1.4rem, 2.5vw, 2rem); margin: 0 0 12px; font-family: var(--font-serif, serif); color: var(--text-primary, #fff); }
    .nrs-detail-card p { color: var(--text-secondary, #d4d4d8); margin: 0; }
    .nrs-detail-card__arrow { margin-top: 24px; color: var(--accent-blue, #3B82F6); font-weight: 700; }
    .nrs-auto-footer { padding: 96px clamp(24px, 5vw, 40px) 40px; background: var(--bg-surface, #0a0a0a); border-top: 1px solid var(--border-faint, rgba(255,255,255,.08)); }
    .nrs-auto-footer__inner { max-width: var(--max-width, 1200px); margin: 0 auto; display: grid; grid-template-columns: 1.3fr 1fr; gap: 48px; }
    .nrs-auto-footer h2 { font-size: clamp(2.4rem, 5vw, 4rem); line-height: 1.08; margin: 0 0 20px; font-family: var(--font-serif, serif); font-weight: 400; }
    .nrs-auto-footer p { color: var(--text-secondary, #d4d4d8); max-width: 560px; }
    .nrs-auto-footer a { color: inherit; text-decoration: none; }
    .nrs-auto-footer__links { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px; }
    .nrs-auto-footer__links h5 { color: var(--text-tertiary, #a1a1aa); text-transform: uppercase; letter-spacing: .12em; margin: 0 0 16px; }
    .nrs-auto-footer__links a { display: block; color: var(--text-secondary, #d4d4d8); margin-bottom: 12px; }
    .nrs-auto-footer__links a:hover { color: var(--text-primary, #fff); }
    @media (max-width: 768px) { .nrs-detail-continuation__grid, .nrs-auto-footer__inner, .nrs-auto-footer__links { grid-template-columns: 1fr; } }
  `;

  function addStyles() {
    if (document.getElementById('nrs-detail-navigation-styles')) return;
    const tag = document.createElement('style');
    tag.id = 'nrs-detail-navigation-styles';
    tag.textContent = styles;
    document.head.appendChild(tag);
  }

  function getCollection() {
    const path = window.location.pathname;
    if (path.includes('/project-')) return { items: PROJECTS, label: 'case study' };
    if (path.includes('/blog/blog-')) return { items: BLOGS, label: 'article' };
    return null;
  }

  function createFooter() {
    const footer = document.createElement('footer');
    footer.className = 'nrs-auto-footer';
    footer.innerHTML = `
      <div class="nrs-auto-footer__inner">
        <div>
          <h2>Let's design something clear.</h2>
          <p>Open for product design, Web3 UX, SaaS dashboards, service websites, design systems, and developer-ready handoff.</p>
          <a href="mailto:hinischalsubba@gmail.com">hinischalsubba@gmail.com</a>
        </div>
        <div class="nrs-auto-footer__links">
          <div><h5>Sitemap</h5><a href="/">Home</a><a href="/projects.html">Work</a><a href="/about.html">About</a><a href="/blog/">Writing</a><a href="/contact.html">Contact</a></div>
          <div><h5>Focus</h5><a href="/project-yarsha.html">Web3 UX</a><a href="/project-pihub.html">Fintech UX</a><a href="/project-orkest.html">SaaS UX</a><a href="/blog/blog-good-handoff.html">Design Handoff</a></div>
        </div>
      </div>`;
    return footer;
  }

  function buildContinuation(item, previous, next, label) {
    const section = document.createElement('section');
    section.className = 'nrs-detail-continuation';
    section.innerHTML = `
      <div class="nrs-detail-continuation__inner">
        <p class="nrs-detail-continuation__eyebrow">Continue exploring</p>
        <h2 class="nrs-detail-continuation__title">Previous and next ${label}</h2>
        <div class="nrs-detail-continuation__grid">
          <a class="nrs-detail-card" href="${previous[2]}">
            <div><span class="nrs-detail-card__kicker">Previous ${label}</span><h3>${previous[0]}</h3><p>${previous[1]}</p></div>
            <span class="nrs-detail-card__arrow">← View previous</span>
          </a>
          <a class="nrs-detail-card" href="${next[2]}">
            <div><span class="nrs-detail-card__kicker">Next ${label}</span><h3>${next[0]}</h3><p>${next[1]}</p></div>
            <span class="nrs-detail-card__arrow">View next →</span>
          </a>
        </div>
      </div>`;
    return section;
  }

  function enhanceDetailPage() {
    addStyles();
    const collection = getCollection();
    if (!collection || document.querySelector('.nrs-detail-continuation')) return;

    const path = window.location.pathname;
    const index = collection.items.findIndex((item) => path === item[2] || path.endsWith(item[2]));
    if (index < 0) return;

    const previous = collection.items[(index - 1 + collection.items.length) % collection.items.length];
    const next = collection.items[(index + 1) % collection.items.length];
    const section = buildContinuation(collection.items[index], previous, next, collection.label);

    const footer = document.querySelector('footer.site-footer, footer.nrs-auto-footer');
    if (footer) {
      footer.insertAdjacentElement('beforebegin', section);
    } else {
      document.body.appendChild(section);
      document.body.appendChild(createFooter());
    }
  }

  function enhanceResumeDownload() {
    document.querySelectorAll('a[href$="resume.pdf"], .floating-resume-btn').forEach((link) => {
      link.setAttribute('href', '/assets/resume.pdf');
      link.setAttribute('download', 'Nischhal-Raj-Subba-Resume-2026.pdf');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { enhanceDetailPage(); enhanceResumeDownload(); });
  } else {
    enhanceDetailPage();
    enhanceResumeDownload();
  }
})();
