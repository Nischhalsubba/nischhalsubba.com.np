function ensureSharedDesignStylesheet() {
  if (document.querySelector('link[href^="/seo-ui-enhancements.css"]')) return;

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/seo-ui-enhancements.css?v=1.4';
  document.head.appendChild(link);
}

function applyPageShellClasses() {
  const path = window.location.pathname;
  const fileName = path.split('/').filter(Boolean).pop() || 'index.html';
  const isHome = path === '/' || fileName === 'index.html';
  const isProjectDetail = fileName.startsWith('project-');
  const isBlogRoute = path.startsWith('/blog/') || fileName.startsWith('blog-');
  const isBlogListing = path === '/blog/' || fileName === 'blog.html';
  const isServicePage = [
    'product-design-nepal.html',
    'web3-ux-designer.html',
    'saas-ux-designer.html',
    'website-ux-design.html',
    'figma-design-systems.html',
    'ux-audit.html',
  ].includes(fileName);

  document.body.classList.add('nrs-uniform-shell');
  document.body.classList.toggle('nrs-home-page', isHome);
  document.body.classList.toggle('nrs-inner-page', !isHome);
  document.body.classList.toggle('nrs-project-detail-page', isProjectDetail);
  document.body.classList.toggle('nrs-blog-page', isBlogRoute || isBlogListing);
  document.body.classList.toggle('nrs-blog-detail-page', isBlogRoute && !isBlogListing);
  document.body.classList.toggle('nrs-service-page', isServicePage);
}

export function injectGlobalStyles() {
  document.documentElement.classList.add('js-enabled');
  ensureSharedDesignStylesheet();
  applyPageShellClasses();

  if (document.getElementById('nrs-runtime-base-styles')) return;

  const style = document.createElement('style');
  style.id = 'nrs-runtime-base-styles';
  style.textContent = `
    html,
    body {
      background-color: #050505 !important;
      background-image:
        radial-gradient(ellipse 76% 46% at 50% -8%, rgba(74, 116, 165, .026), rgba(28, 48, 76, .014) 36%, rgba(5, 5, 5, 0) 72%),
        linear-gradient(90deg, #050505 0%, #050607 16%, #06080b 50%, #050607 84%, #050505 100%) !important;
      background-attachment: fixed !important;
    }

    body::before {
      background-image:
        linear-gradient(rgba(255, 255, 255, .018) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, .018) 1px, transparent 1px),
        radial-gradient(ellipse 62% 38% at 50% 0%, rgba(74, 116, 165, .026), transparent 74%) !important;
      background-size: 72px 72px, 72px 72px, 100% 100% !important;
      opacity: .48 !important;
    }

    body::after {
      background:
        linear-gradient(90deg, #050505 0%, rgba(5, 5, 5, .94) 8%, rgba(5, 5, 5, .58) 20%, rgba(5, 5, 5, .16) 35%, rgba(5, 5, 5, 0) 50%, rgba(5, 5, 5, .16) 65%, rgba(5, 5, 5, .58) 80%, rgba(5, 5, 5, .94) 92%, #050505 100%),
        linear-gradient(180deg, rgba(5, 5, 5, 0) 0%, rgba(5, 5, 5, .12) 62%, rgba(5, 5, 5, .68) 100%) !important;
    }

    [data-theme="light"] html,
    [data-theme="light"] body {
      background-color: #ffffff !important;
      background-image:
        radial-gradient(ellipse 74% 44% at 50% -8%, rgba(74, 116, 165, .032), transparent 72%),
        linear-gradient(90deg, #ffffff 0%, #fbfdff 50%, #ffffff 100%) !important;
    }

    [data-theme="light"] body::before {
      background-image:
        linear-gradient(rgba(15, 23, 42, .026) 1px, transparent 1px),
        linear-gradient(90deg, rgba(15, 23, 42, .026) 1px, transparent 1px),
        radial-gradient(ellipse 62% 38% at 50% 0%, rgba(59, 130, 246, .032), transparent 74%) !important;
      opacity: .36 !important;
    }

    [data-theme="light"] body::after {
      background:
        linear-gradient(90deg, #ffffff 0%, rgba(255, 255, 255, .92) 10%, rgba(255, 255, 255, .48) 22%, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, .48) 78%, rgba(255, 255, 255, .92) 90%, #ffffff 100%),
        linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, .68) 100%) !important;
    }

    .motion-ready .reveal-on-scroll,
    .motion-ready .project-card,
    .motion-ready .impact-card,
    .motion-ready .writing-item,
    .motion-ready .achieve-item {
      transition: border-color .35s ease, background-color .35s ease, box-shadow .35s ease;
      will-change: transform, opacity;
    }

    .is-visible {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }

    .page-ready body { opacity: 1; }
    .menu-open { overflow: hidden; }
    .copied::after { content: 'Copied'; margin-left: .5rem; font-size: .85em; }
    :focus-visible { outline: 2px solid currentColor; outline-offset: 4px; }

    .nrs-static-project-context,
    .nrs-static-related-links,
    .nrs-static-faq {
      display: none !important;
    }

    .nav-wrapper {
      z-index: 1000;
    }

    .nav-pill {
      border: 1px solid rgba(255, 255, 255, .1);
      background: rgba(15, 15, 18, .68);
      backdrop-filter: blur(24px) saturate(1.2);
      -webkit-backdrop-filter: blur(24px) saturate(1.2);
      box-shadow: 0 18px 60px rgba(0, 0, 0, .18), inset 0 1px 0 rgba(255,255,255,.08);
    }

    .nav-link {
      position: relative;
    }

    .nav-link::after {
      content: '';
      position: absolute;
      left: 50%;
      bottom: 8px;
      width: 4px;
      height: 4px;
      border-radius: 999px;
      background: currentColor;
      opacity: 0;
      transform: translateX(-50%) scale(.4);
      transition: opacity .25s ease, transform .25s ease;
    }

    .nav-link.active::after,
    .nav-link:hover::after {
      opacity: .75;
      transform: translateX(-50%) scale(1);
    }

    .nrs-uniform-shell .container {
      width: min(100%, var(--max-width, 1320px));
    }

    .nrs-uniform-shell .section-container {
      position: relative;
    }

    .nrs-inner-page main.container {
      padding-top: clamp(118px, 10vw, 156px);
      padding-bottom: clamp(72px, 10vw, 128px);
    }

    .nrs-inner-page .hero-section {
      position: relative;
      width: 100%;
      min-height: auto !important;
      margin: 0 auto clamp(34px, 5vw, 72px);
      padding: clamp(42px, 7vw, 92px) clamp(24px, 5vw, 72px) !important;
      overflow: hidden;
      align-items: flex-start !important;
      text-align: left !important;
      border: 1px solid rgba(255, 255, 255, .09);
      border-radius: clamp(26px, 4vw, 44px);
      background:
        radial-gradient(ellipse at 16% 0%, rgba(96, 165, 250, .1), transparent 34%),
        linear-gradient(180deg, rgba(255, 255, 255, .045), rgba(255, 255, 255, .014));
      box-shadow: 0 26px 100px rgba(0, 0, 0, .24), inset 0 1px 0 rgba(255, 255, 255, .05);
    }

    .nrs-inner-page .hero-section::before {
      content: '';
      position: absolute;
      inset: 0;
      pointer-events: none;
      background-image:
        linear-gradient(rgba(255,255,255,.022) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,.022) 1px, transparent 1px),
        radial-gradient(ellipse at 50% 0%, rgba(96,165,250,.08), transparent 52%);
      background-size: 52px 52px, 52px 52px, 100% 100%;
      opacity: .82;
    }

    .nrs-inner-page .hero-section > * {
      position: relative;
      z-index: 1;
    }

    .nrs-inner-page .hero-title {
      max-width: 1120px !important;
      margin-bottom: clamp(16px, 3vw, 28px) !important;
      font-size: clamp(3rem, 9vw, 7.6rem) !important;
      line-height: .93 !important;
      letter-spacing: -.065em !important;
    }

    .nrs-inner-page .body-large,
    .nrs-inner-page .section-lead {
      max-width: 880px;
      color: var(--text-secondary, #d1d5db) !important;
    }

    .nrs-inner-page .section-container {
      width: 100%;
      max-width: min(1280px, 100%);
      margin-inline: auto;
      padding-block: clamp(42px, 6vw, 86px) !important;
    }

    .nrs-project-detail-page .section-container,
    .nrs-blog-detail-page .section-container,
    .nrs-service-page .section-container {
      margin-block: clamp(18px, 3vw, 32px);
      padding: clamp(26px, 4vw, 54px) !important;
      border: 1px solid rgba(255, 255, 255, .08);
      border-radius: clamp(24px, 3vw, 36px);
      background: linear-gradient(180deg, rgba(255, 255, 255, .032), rgba(255, 255, 255, .012));
      box-shadow: 0 20px 80px rgba(0, 0, 0, .18), inset 0 1px 0 rgba(255, 255, 255, .035);
    }

    .nrs-blog-page:not(.nrs-blog-detail-page) .section-container,
    .nrs-inner-page:not(.nrs-project-detail-page):not(.nrs-blog-detail-page):not(.nrs-service-page) .section-container {
      border-top: 1px solid rgba(255, 255, 255, .07);
    }

    .case-hero-img-container,
    .blog-hero-img-container,
    .embed-frame-wrapper {
      overflow: hidden;
      padding: clamp(10px, 1.5vw, 16px);
      border: 1px solid rgba(255, 255, 255, .08) !important;
      border-radius: clamp(24px, 3vw, 36px) !important;
      background:
        radial-gradient(ellipse at 50% 0%, rgba(96, 165, 250, .08), transparent 50%),
        rgba(255, 255, 255, .026) !important;
      box-shadow: 0 28px 110px rgba(0, 0, 0, .26), inset 0 1px 0 rgba(255, 255, 255, .04);
    }

    .case-hero-img,
    .case-hero-img-container img,
    .nrs-inner-page .section-container > .container > img,
    .nrs-article img {
      border-radius: clamp(18px, 2.5vw, 28px) !important;
      border-color: rgba(255, 255, 255, .08) !important;
      background: rgba(255, 255, 255, .02);
    }

    .snapshot-grid > div,
    .journey-card,
    .comparison-card,
    .metric-plan-card,
    .story-card,
    .quote-card,
    .prototype-link-card,
    .blog-card-modern,
    .writing-item,
    .achieve-item,
    .impact-card,
    .contact-form,
    .blog-note,
    .blog-author-card,
    .blog-share-card,
    .blog-toc,
    .link-pill,
    .filter-btn {
      border: 1px solid rgba(255, 255, 255, .08) !important;
      border-radius: clamp(18px, 2vw, 26px) !important;
      background: linear-gradient(180deg, rgba(255, 255, 255, .036), rgba(255, 255, 255, .014)) !important;
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, .035);
    }

    .snapshot-grid > div,
    .journey-card,
    .comparison-card,
    .metric-plan-card,
    .story-card,
    .quote-card,
    .prototype-link-card,
    .blog-note,
    .blog-author-card,
    .blog-share-card,
    .blog-toc {
      padding: clamp(20px, 3vw, 32px) !important;
    }

    .journey-grid,
    .snapshot-grid,
    .blog-grid,
    .project-grid,
    .impact-summary-grid {
      gap: clamp(18px, 3vw, 34px) !important;
    }

    .case-label,
    .badge-pill,
    .eyebrow {
      letter-spacing: .12em !important;
    }

    .badge-pill,
    .case-label {
      display: inline-flex;
      align-items: center;
      min-height: 34px;
      padding: 7px 12px;
      border: 1px solid rgba(255, 255, 255, .1);
      border-radius: 999px;
      color: var(--text-secondary, #d1d5db);
      background: rgba(255, 255, 255, .035);
      font-size: .78rem;
      font-weight: 700;
      text-transform: uppercase;
    }

    .case-list {
      display: grid;
      gap: 12px;
      padding: 0 !important;
      margin: clamp(20px, 3vw, 30px) 0 0 !important;
      list-style: none !important;
    }

    .case-list li {
      position: relative;
      padding: 16px 18px 16px 44px;
      border: 1px solid rgba(255, 255, 255, .07);
      border-radius: 18px;
      background: rgba(255, 255, 255, .024);
      color: var(--text-secondary, #d1d5db);
      line-height: 1.7;
    }

    .case-list li::before {
      content: '';
      position: absolute;
      left: 18px;
      top: 24px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--accent-blue, #60a5fa);
      box-shadow: 0 0 18px rgba(96, 165, 250, .42);
    }

    .case-callout,
    blockquote {
      border: 1px solid rgba(96, 165, 250, .18) !important;
      border-left: 4px solid var(--accent-blue, #60a5fa) !important;
      border-radius: 20px !important;
      padding: clamp(20px, 3vw, 30px) !important;
      background: rgba(96, 165, 250, .045) !important;
    }

    .nrs-article-main {
      padding-top: clamp(112px, 12vw, 172px);
      padding-bottom: clamp(72px, 10vw, 128px);
      width: min(100%, var(--max-width, 1200px));
      margin-inline: auto;
      padding-inline: var(--container-padding, 40px);
    }

    .nrs-article-main > article,
    .nrs-article {
      width: min(100%, 980px);
      margin-inline: auto;
    }

    .nrs-article-header {
      min-height: auto !important;
      padding: 0 0 clamp(40px, 6vw, 72px) !important;
      align-items: flex-start !important;
      text-align: left !important;
    }

    .nrs-article-section {
      padding-block: clamp(32px, 5vw, 72px) !important;
    }

    .nrs-article img {
      width: 100%;
      max-width: 100%;
      height: auto;
      margin: 0 0 clamp(32px, 5vw, 56px);
    }

    .nrs-article p,
    .nrs-article li {
      color: var(--text-secondary, #d4d4d8);
      font-size: clamp(1.03rem, 1.5vw, 1.16rem);
      line-height: 1.85;
    }

    .nrs-article p { margin-bottom: 1.35em; }
    .nrs-article h1 { max-width: 980px; }
    .nrs-article h2,
    .nrs-article h3 { margin-top: clamp(40px, 6vw, 72px); margin-bottom: 18px; }

    .hero-portrait-container {
      width: min(560px, 92vw);
      margin: clamp(48px, 7vw, 88px) auto 0;
      border-radius: 32px;
      overflow: hidden;
      border: 1px solid var(--border-faint, rgba(255,255,255,.1));
      background: radial-gradient(circle at 50% 15%, rgba(59,130,246,.12), transparent 58%), var(--bg-surface, #0a0a0a);
      box-shadow: 0 28px 90px rgba(0,0,0,.28);
      transform-style: preserve-3d;
    }

    .hero-portrait-img {
      width: 100%;
      aspect-ratio: 1 / 1;
      object-fit: cover;
      opacity: .98;
    }

    .nrs-home-hero .body-large {
      max-width: 820px;
    }

    .project-card:hover,
    .impact-card:hover,
    .writing-item:hover,
    .journey-card:hover,
    .prototype-link-card:hover,
    .blog-card-modern:hover {
      border-color: color-mix(in srgb, var(--accent-blue, #3B82F6) 28%, var(--border-light, rgba(255,255,255,.15))) !important;
      box-shadow: 0 22px 70px rgba(59, 130, 246, .1), inset 0 1px 0 rgba(255, 255, 255, .055) !important;
    }

    .site-footer {
      margin-top: clamp(44px, 8vw, 96px);
      border-top: 1px solid rgba(255, 255, 255, .08);
      background:
        radial-gradient(ellipse at 50% 0%, rgba(96, 165, 250, .045), transparent 48%),
        rgba(5, 5, 5, .72);
    }

    [data-theme="light"] .nrs-inner-page .hero-section,
    [data-theme="light"] .nrs-project-detail-page .section-container,
    [data-theme="light"] .nrs-blog-detail-page .section-container,
    [data-theme="light"] .nrs-service-page .section-container,
    [data-theme="light"] .snapshot-grid > div,
    [data-theme="light"] .journey-card,
    [data-theme="light"] .comparison-card,
    [data-theme="light"] .metric-plan-card,
    [data-theme="light"] .story-card,
    [data-theme="light"] .quote-card,
    [data-theme="light"] .prototype-link-card,
    [data-theme="light"] .blog-card-modern,
    [data-theme="light"] .writing-item,
    [data-theme="light"] .achieve-item,
    [data-theme="light"] .impact-card,
    [data-theme="light"] .contact-form,
    [data-theme="light"] .blog-note,
    [data-theme="light"] .blog-author-card,
    [data-theme="light"] .blog-share-card,
    [data-theme="light"] .blog-toc,
    [data-theme="light"] .link-pill,
    [data-theme="light"] .filter-btn {
      border-color: rgba(15, 23, 42, .08) !important;
      background: rgba(255, 255, 255, .78) !important;
      box-shadow: 0 20px 70px rgba(15, 23, 42, .07), inset 0 1px 0 rgba(255, 255, 255, .9) !important;
    }

    @media (prefers-reduced-motion: reduce) {
      .reveal-on-scroll,
      .project-card,
      .impact-card,
      .writing-item,
      .achieve-item {
        opacity: 1 !important;
        transform: none !important;
        transition: none !important;
      }
    }

    @media (max-width: 920px) {
      .nrs-inner-page main.container {
        padding-top: 104px;
      }

      .nrs-inner-page .hero-section {
        border-radius: 26px;
        padding: 34px 22px !important;
      }

      .nrs-inner-page .hero-title {
        font-size: clamp(2.4rem, 13vw, 4rem) !important;
      }

      .nrs-project-detail-page .section-container,
      .nrs-blog-detail-page .section-container,
      .nrs-service-page .section-container {
        border-radius: 22px;
        padding: 24px 20px !important;
      }

      .case-hero-img-container,
      .blog-hero-img-container,
      .embed-frame-wrapper {
        padding: 8px;
        border-radius: 22px !important;
      }

      iframe {
        min-height: 420px;
      }
    }

    @media (max-width: 760px) {
      .nrs-article-main { padding-top: 104px; }
      .nrs-article-header { text-align: left !important; }
      .nrs-article .hero-title { font-size: clamp(2.15rem, 12vw, 3.1rem); }
      .nrs-inner-page .hero-section { margin-bottom: 24px; }
      .nrs-inner-page .section-container { padding-block: 32px !important; }
      .case-list li { padding: 14px 14px 14px 38px; }
      .case-list li::before { left: 15px; }
    }
  `;
  document.head.appendChild(style);
}
