function ensureStylesheet(href, marker) {
  if (document.querySelector(`link[href*="${marker}"]`)) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  document.head.appendChild(link);
}

function ensureAtelierStylesheet() {
  ensureStylesheet('/assets/styles/portfolio-system.css?v=1.0', 'portfolio-system.css');
  ensureStylesheet('/assets/styles/page-redesign.css?v=2.0', 'page-redesign.css');
  ensureStylesheet('/assets/styles/responsive-foundation.css?v=1.0', 'responsive-foundation.css');
  ensureStylesheet('/assets/styles/web-friendly-system.css?v=1.0', 'web-friendly-system.css');
}

function isHomePage() {
  const path = window.location.pathname;
  return path === '/' || path.endsWith('/index.html') || path.endsWith('/home-v2') || path.endsWith('/home-v2.html');
}

function getActiveLabel() {
  const path = window.location.pathname;
  if (path.includes('project') || path.includes('/projects')) return 'Work';
  if (path.includes('blog')) return 'Writing';
  if (path.includes('about')) return 'About';
  if (path.includes('contact')) return 'Contact';
  return 'Home';
}

function ensureAtelierChrome() {
  if (document.querySelector('.az-nav')) return;

  document.body.insertAdjacentHTML('afterbegin', `
    <header class="az-nav" data-stable-nav>
      <div class="container az-nav-inner">
        <a href="/" class="brand" aria-label="Nischhal Raj Subba home"><span class="brand-mark">N</span><span>Nischhal</span><span class="brand-meta"><b>Senior Product Designer</b>UX · UI · Systems</span></a>
        <nav aria-label="Primary navigation">
          <ul class="az-nav-links">
            <li><a href="/" data-az-nav="Home">Home</a></li>
            <li><a href="/projects.html" data-az-nav="Work">Work<span class="num">06</span></a></li>
            <li><a href="/about.html" data-az-nav="About">About</a></li>
            <li><a href="/blog/" data-az-nav="Writing">Writing</a></li>
            <li><a href="/contact.html" data-az-nav="Contact">Contact</a></li>
          </ul>
        </nav>
        <div class="nav-side">
          <a class="nav-cta ghost" href="/assets/resume.pdf" download="Nischhal-Raj-Subba-Resume.pdf" data-resume-download>Resume</a>
          <a class="nav-cta" href="mailto:hinischalsubba@gmail.com">Email me</a>
        </div>
      </div>
    </header>
  `);

  const activeLabel = getActiveLabel();
  document.querySelector(`[data-az-nav="${activeLabel}"]`)?.classList.add('active');
}

function addSectionRules() {
  if (isHomePage()) return;
  const main = document.querySelector('main');
  if (!main || main.querySelector('.sec-rule') || main.classList.contains('nrs-page')) return;

  const label = getActiveLabel();
  const title = label === 'Work' ? 'Case Study / Detail' : label === 'Writing' ? 'Article / Insight' : `${label} / Page`;
  main.insertAdjacentHTML('afterbegin', `
    <div class="container az-subpage-rule">
      <div class="sec-rule"><span class="roman">I.</span><span class="meta-grp"><span>${title}</span><span class="dot-mark">•</span><span>Nischhal Raj Subba Portfolio</span></span><span>001 / 001</span></div>
    </div>
  `);
}

function normalizeSubpageLayout() {
  if (isHomePage()) return;
  document.documentElement.classList.add('atelier-subpage');
  document.body.classList.add('atelier-subpage-body');

  if (document.querySelector('main.nrs-page')) return;

  document.querySelectorAll('.hero-title, h1').forEach((heading) => heading.classList.add('display'));
  document.querySelectorAll('.body-large, .section-lead, article p').forEach((text) => text.classList.add('lead'));
  document.querySelectorAll('.badge-pill, .tag, .eyebrow').forEach((item) => item.classList.add('label'));

  const main = document.querySelector('main');
  if (main) main.classList.add('az-page-main');

  document.querySelectorAll('.project-card').forEach((card) => card.classList.add('az-card'));
  document.querySelectorAll('article').forEach((article) => article.classList.add('az-article-card'));
}

function normalizeArticleAndProjectImages() {
  document.querySelectorAll('.case-hero-img-container, .project-detail-hero, .nrs-project-image-container').forEach((container) => {
    container.classList.add('az-feature-media');
  });
  document.querySelectorAll('.case-hero-img, .nrs-project-detail-image, .project-detail-hero img, article img').forEach((image) => {
    image.classList.add('az-media-img');
  });
}

export function initAtelierPages() {
  ensureAtelierStylesheet();
  ensureAtelierChrome();
  addSectionRules();
  normalizeSubpageLayout();
  normalizeArticleAndProjectImages();
}
