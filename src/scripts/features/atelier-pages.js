function ensureAtelierStylesheet() {
  if (document.querySelector('link[href*="atelier-zero.css"]')) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/atelier-zero.css?v=1.1';
  document.head.appendChild(link);
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
    <div class="side-rail right"><span class="rail-text">Nischhal Raj Subba — Product Design · Systems · Handoff</span></div>
    <div class="side-rail left"><span class="rail-text">Senior UI/Product Designer · Nepal / Remote</span></div>
    <div class="topbar">
      <div class="container topbar-inner">
        <span><b>NRS / 2026</b> · Portfolio Nº 01</span>
        <span class="mid"><span>Filed under <b class="coral">Product · Interface</b></span><span>Lalitpur · Nepal · Remote</span></span>
        <span class="right"><span><span class="pulse"></span>Available for selected work</span><span><b>EN</b> · Product Design</span></span>
      </div>
    </div>
    <header class="az-nav">
      <div class="container az-nav-inner">
        <a href="/" class="brand"><span class="brand-mark">N</span><span>Nischhal</span><span class="brand-meta"><b>Studio Practice</b>Product UX / UI</span></a>
        <nav aria-label="Primary navigation">
          <ul class="az-nav-links">
            <li><a href="/projects.html" data-az-nav="Work">Work<span class="num">06</span></a></li>
            <li><a href="/about.html" data-az-nav="About">About<span class="num">01</span></a></li>
            <li><a href="/blog/" data-az-nav="Writing">Writing<span class="num">05</span></a></li>
            <li><a href="/contact.html" data-az-nav="Contact">Contact</a></li>
          </ul>
        </nav>
        <div class="nav-side">
          <a class="nav-cta ghost" href="/assets/resume.pdf" download="Nischhal-Raj-Subba-Resume.pdf" data-resume-download>Resume</a>
          <a class="nav-cta" href="mailto:hinischalsubba@gmail.com">Hire / Email</a>
          <span class="status-dot" aria-hidden="true"></span>
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
  if (!main || main.querySelector('.sec-rule')) return;

  const label = getActiveLabel();
  const title = label === 'Work' ? 'Case Study / Detail' : label === 'Writing' ? 'Article / Note' : `${label} / Page`;
  main.insertAdjacentHTML('afterbegin', `
    <div class="container az-subpage-rule">
      <div class="sec-rule"><span class="roman">I.</span><span class="meta-grp"><span>${title}</span><span class="dot-mark">•</span><span>Senior Designer Portfolio</span></span><span>001 / 001</span></div>
    </div>
  `);
}

function normalizeSubpageLayout() {
  if (isHomePage()) return;
  document.documentElement.classList.add('atelier-subpage');
  document.body.classList.add('atelier-subpage-body');

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
  document.querySelectorAll('.case-hero-img, .nrs-project-detail-image, article img').forEach((image) => {
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
