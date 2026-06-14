function getCurrentFileName() {
  const path = window.location.pathname;
  return path.split('/').filter(Boolean).pop() || 'index.html';
}

function applyConsistencyPageClasses() {
  const path = window.location.pathname;
  const fileName = getCurrentFileName();

  document.body.classList.toggle('nrs-contact-page', fileName === 'contact.html');
  document.body.classList.toggle('nrs-about-page', fileName === 'about.html');
  document.body.classList.toggle('nrs-work-page', fileName === 'projects.html');
  document.body.classList.toggle('nrs-project-detail-page', /^\/project-[^/]+\.html$/.test(path));
  document.body.classList.toggle('nrs-blog-detail-page', path.startsWith('/blog/') && path !== '/blog/');
}

function injectConsistencyStyles() {
  if (document.getElementById('nrs-site-consistency-styles')) return;

  const style = document.createElement('style');
  style.id = 'nrs-site-consistency-styles';
  style.textContent = `
    :root {
      --max-width: min(1200px, calc(100vw - 48px)) !important;
      --nrs-site-width: min(1200px, calc(100vw - 48px));
      --nrs-readable-width: 780px;
      --nrs-card-pad: clamp(28px, 3.2vw, 42px);
      --nrs-card-gap: clamp(14px, 2vw, 22px);
      --nrs-section-gap: clamp(28px, 4vw, 48px);
      --nrs-divider: rgba(255, 255, 255, 0.10);
    }

    [data-theme='light'] {
      --nrs-divider: rgba(15, 23, 42, 0.12);
    }

    .container,
    main.container,
    .nrs-uniform-shell .container,
    .nrs-uniform-shell main.container,
    .nrs-inner-page .hero-section,
    .nrs-inner-page .section-container,
    .nrs-project-detail-page .section-container,
    .nrs-blog-detail-page .section-container,
    .nrs-service-page .section-container,
    .site-footer > .container {
      width: var(--nrs-site-width) !important;
      max-width: var(--nrs-site-width) !important;
      margin-left: auto !important;
      margin-right: auto !important;
    }

    .nrs-home-page .hero-section,
    .nrs-home-page .section-container {
      width: var(--nrs-site-width) !important;
      max-width: var(--nrs-site-width) !important;
      margin-left: auto !important;
      margin-right: auto !important;
    }

    .nrs-inner-page main.container {
      padding-top: clamp(104px, 9vw, 144px) !important;
    }

    .nrs-inner-page .hero-section {
      padding-top: clamp(42px, 7vw, 86px) !important;
      padding-bottom: clamp(30px, 5vw, 58px) !important;
      margin-bottom: clamp(34px, 6vw, 76px) !important;
    }

    .nrs-inner-page .hero-title {
      max-width: 1060px !important;
      font-size: clamp(3rem, 7.8vw, 6.8rem) !important;
      line-height: .96 !important;
      letter-spacing: -.06em !important;
    }

    .nrs-inner-page .body-large,
    .nrs-inner-page .section-lead,
    .nrs-article p,
    .nrs-article li {
      max-width: var(--nrs-readable-width) !important;
    }

    .nav-link.active,
    .mobile-nav-links a.active,
    .nav-link[aria-current='page'],
    .mobile-nav-links a[aria-current='page'] {
      color: var(--text-primary, #fff) !important;
      font-weight: 800 !important;
    }

    .nrs-clarity-page .clarity-hero {
      display: grid !important;
      gap: clamp(18px, 3vw, 30px) !important;
      border-bottom: 1px solid var(--nrs-divider) !important;
      padding-bottom: clamp(34px, 5vw, 64px) !important;
    }

    .nrs-clarity-page .clarity-hero::after,
    .nrs-project-detail-page .hero-section::after {
      display: none !important;
    }

    .nrs-clarity-page .hero-title {
      max-width: 980px !important;
      font-size: clamp(3rem, 7.4vw, 6.35rem) !important;
      line-height: .98 !important;
      letter-spacing: -.058em !important;
    }

    .nrs-clarity-page .body-large {
      max-width: 780px !important;
      font-size: clamp(1.05rem, 1.5vw, 1.22rem) !important;
      line-height: 1.72 !important;
    }

    .clarity-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-top: 6px;
    }

    .clarity-snapshot {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 0;
      margin: clamp(24px, 4vw, 44px) 0 0;
      padding: 0;
      border-top: 1px solid var(--nrs-divider);
      border-bottom: 1px solid var(--nrs-divider);
    }

    .clarity-snapshot div {
      padding: clamp(18px, 2.6vw, 28px) clamp(18px, 2.4vw, 26px);
      border-right: 1px solid var(--nrs-divider);
    }

    .clarity-snapshot div:last-child {
      border-right: 0;
    }

    .clarity-snapshot dt,
    .nrs-project-detail-page .case-label,
    .nrs-project-detail-page .eyebrow {
      margin: 0 0 8px;
      color: var(--text-tertiary, #8d93a1) !important;
      font-size: .72rem;
      font-weight: 850;
      letter-spacing: .14em;
      text-transform: uppercase;
    }

    .clarity-snapshot dd {
      margin: 0;
      color: var(--text-primary, #fff);
      font-size: clamp(.98rem, 1.4vw, 1.12rem);
      line-height: 1.35;
      font-weight: 750;
    }

    .clarity-section {
      display: grid !important;
      grid-template-columns: minmax(120px, 190px) minmax(0, 1fr);
      gap: clamp(24px, 5vw, 76px);
      align-items: start;
      border-top: 1px solid var(--nrs-divider) !important;
    }

    .clarity-section-label {
      position: sticky;
      top: 112px;
    }

    .clarity-section-body {
      display: grid;
      gap: clamp(20px, 3vw, 34px);
      min-width: 0;
    }

    .clarity-section .section-title {
      max-width: 820px;
      font-size: clamp(2rem, 4vw, 3.7rem) !important;
      line-height: 1.02 !important;
      letter-spacing: -.044em !important;
      margin: 0 !important;
    }

    .clarity-row-list,
    .clarity-steps {
      display: grid;
      gap: clamp(18px, 2.6vw, 28px) !important;
      border-top: 0 !important;
    }

    .clarity-steps {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    .clarity-row-list article,
    .clarity-row-list article.nrs-article.blog-prose,
    .clarity-steps article,
    .nrs-article.blog-prose {
      display: grid !important;
      grid-template-columns: 1fr !important;
      align-content: start !important;
      gap: var(--nrs-card-gap) !important;
      width: 100%;
      min-width: 0;
      padding: var(--nrs-card-pad) !important;
      border: 1px solid var(--border-faint, rgba(255,255,255,.14)) !important;
      border-radius: var(--radius-xl, 30px) !important;
      background: linear-gradient(180deg, rgba(255,255,255,.08), rgba(255,255,255,.036)) !important;
      box-shadow: none !important;
      overflow: hidden !important;
    }

    .clarity-row-list article > span,
    .clarity-steps article > span {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: max-content;
      min-width: 34px;
      min-height: 28px;
      margin: 0 0 4px;
      padding: 6px 10px;
      border: 1px solid rgba(147,197,253,.28);
      border-radius: 999px;
      background: rgba(96,165,250,.10);
      color: var(--accent-blue, #60a5fa);
      font-size: .72rem;
      font-weight: 850;
      letter-spacing: .12em;
      text-transform: uppercase;
    }

    .clarity-row-list article > div,
    .clarity-steps article > div {
      display: grid;
      gap: 8px;
      min-width: 0;
    }

    .clarity-row-list h3,
    .clarity-steps h3,
    .clarity-pill-grid span,
    .contact-fit-grid h3,
    .principle-grid h3 {
      margin: 0;
      color: var(--text-primary, #fff);
      font-family: var(--font-serif, serif);
      font-size: clamp(1.25rem, 2vw, 1.72rem);
      line-height: 1.18;
      letter-spacing: -.025em;
    }

    .clarity-row-list p,
    .clarity-steps p,
    .principle-grid p,
    .contact-fit-grid p,
    .nrs-article.blog-prose p {
      margin: 0;
      max-width: 72ch;
      color: var(--text-secondary, #d1d5db);
      line-height: 1.72;
    }

    .clarity-pill-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0;
      border-top: 1px solid var(--nrs-divider);
    }

    .clarity-pill-grid span {
      display: flex;
      align-items: center;
      min-height: 84px;
      padding: clamp(18px, 2.4vw, 26px);
      border-bottom: 1px solid var(--nrs-divider);
      border-right: 1px solid var(--nrs-divider);
    }

    .clarity-pill-grid span:nth-child(2n) {
      border-right: 0;
    }

    [data-theme='light'] .clarity-row-list article,
    [data-theme='light'] .clarity-row-list article.nrs-article.blog-prose,
    [data-theme='light'] .clarity-steps article,
    [data-theme='light'] .nrs-article.blog-prose {
      background: #ffffff !important;
      border-color: rgba(23,70,200,.18) !important;
      box-shadow: none !important;
    }

    .nrs-contact-page .contact-form {
      max-width: 860px !important;
      margin-top: 0;
    }

    .nrs-contact-page .form-note {
      display: none;
    }

    .nrs-project-detail-page .hero-section {
      display: grid !important;
      grid-template-columns: minmax(0, 1fr);
      gap: 22px;
      border-bottom: 1px solid var(--nrs-divider) !important;
    }

    .nrs-project-detail-page .case-meta-chips {
      gap: 8px !important;
    }

    .nrs-project-detail-page .badge-pill,
    .nrs-project-detail-page .case-label {
      border: 0 !important;
      border-radius: 0 !important;
      background: transparent !important;
      padding: 0 !important;
    }

    .nrs-project-detail-page .section-container {
      display: grid !important;
      grid-template-columns: minmax(130px, 220px) minmax(0, 1fr);
      column-gap: clamp(28px, 6vw, 86px);
      row-gap: var(--nrs-section-gap) !important;
      align-items: start;
      padding-top: clamp(58px, 7vw, 96px) !important;
      padding-bottom: clamp(58px, 7vw, 96px) !important;
      border-top: 1px solid var(--nrs-divider) !important;
    }

    .nrs-project-detail-page .section-container > .case-label,
    .nrs-project-detail-page .section-container > .eyebrow,
    .nrs-project-detail-page .section-container > .section-header > .eyebrow {
      grid-column: 1;
      grid-row: 1;
      position: sticky;
      top: 110px;
      align-self: start;
    }

    .nrs-project-detail-page .section-container > h2,
    .nrs-project-detail-page .section-container > .section-title,
    .nrs-project-detail-page .section-container > p,
    .nrs-project-detail-page .section-container > .body-large,
    .nrs-project-detail-page .section-container > ul,
    .nrs-project-detail-page .section-container > .case-list,
    .nrs-project-detail-page .section-container > .journey-grid,
    .nrs-project-detail-page .section-container > .snapshot-grid,
    .nrs-project-detail-page .section-container > .prototype-link-list,
    .nrs-project-detail-page .section-container > .embed-frame-wrapper,
    .nrs-project-detail-page .section-container > .section-header,
    .nrs-project-detail-page .section-container > div:not(.case-label) {
      grid-column: 2;
    }

    .nrs-project-detail-page .section-container > .section-header {
      margin-bottom: 0 !important;
    }

    .nrs-project-detail-page .section-container > .section-header + .journey-grid,
    .nrs-project-detail-page .section-container > h2 + .journey-grid,
    .nrs-project-detail-page .section-container > .section-title + .journey-grid {
      margin-top: clamp(20px, 3vw, 36px) !important;
    }

    .nrs-project-detail-page .section-container > .section-header .section-title,
    .nrs-project-detail-page .section-container > h2.section-title,
    .nrs-project-detail-page .section-container > h2 {
      font-size: clamp(2rem, 4vw, 3.4rem) !important;
      line-height: 1.02 !important;
      letter-spacing: -.045em !important;
      margin-bottom: 0 !important;
    }

    .nrs-project-detail-page .snapshot-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
      gap: 0 !important;
    }

    .nrs-project-detail-page .journey-grid {
      display: grid !important;
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
      gap: clamp(22px, 3vw, 34px) !important;
      align-items: stretch !important;
      padding-top: clamp(10px, 1.8vw, 24px) !important;
      margin-top: 0 !important;
      min-width: 0 !important;
    }

    .nrs-project-detail-page .journey-card,
    .nrs-project-detail-page .prototype-link-card {
      display: grid !important;
      grid-template-columns: 1fr !important;
      align-content: start !important;
      gap: var(--nrs-card-gap) !important;
      min-width: 0 !important;
      min-height: clamp(230px, 22vw, 280px) !important;
      padding: var(--nrs-card-pad) !important;
      border: 1px solid rgba(147,197,253,.22) !important;
      border-radius: var(--radius-xl, 30px) !important;
      background: linear-gradient(135deg, rgba(96,165,250,.12), transparent 38%), linear-gradient(180deg, rgba(255,255,255,.105), rgba(255,255,255,.038)) !important;
      box-shadow: none !important;
      overflow: hidden !important;
    }

    .nrs-project-detail-page .journey-card::before {
      position: static !important;
      margin: 0 0 clamp(8px, 1vw, 12px) 0 !important;
      align-self: start !important;
      justify-self: start !important;
    }

    .nrs-project-detail-page .journey-card h3,
    .nrs-project-detail-page .prototype-link-card h3 {
      margin: 0 !important;
      max-width: 100% !important;
      overflow-wrap: anywhere;
      line-height: 1.16 !important;
    }

    .nrs-project-detail-page .journey-card p,
    .nrs-project-detail-page .prototype-link-card p {
      margin: 0 !important;
      max-width: 66ch !important;
      line-height: 1.68 !important;
    }

    [data-theme='light'] .nrs-project-detail-page .journey-card,
    [data-theme='light'] .nrs-project-detail-page .prototype-link-card {
      background: #ffffff !important;
      border-color: rgba(23,70,200,.18) !important;
      box-shadow: none !important;
    }

    .nrs-project-detail-page iframe {
      width: 100% !important;
      min-height: min(620px, 72vh);
      border-radius: 18px;
    }

    @media (max-width: 920px) {
      :root {
        --max-width: calc(100vw - 40px) !important;
        --nrs-site-width: calc(100vw - 40px);
      }

      .clarity-snapshot,
      .clarity-steps,
      .clarity-pill-grid,
      .nrs-contact-page .form-grid,
      .nrs-project-detail-page .section-container,
      .nrs-project-detail-page .snapshot-grid,
      .nrs-project-detail-page .journey-grid,
      .nrs-project-detail-page .journey-card,
      .nrs-project-detail-page .prototype-link-card {
        grid-template-columns: 1fr !important;
      }

      .clarity-section {
        grid-template-columns: 1fr !important;
        gap: 16px;
      }

      .clarity-section-label,
      .nrs-project-detail-page .section-container > .case-label,
      .nrs-project-detail-page .section-container > .eyebrow,
      .nrs-project-detail-page .section-container > .section-header > .eyebrow {
        position: static !important;
      }

      .clarity-snapshot div,
      .clarity-pill-grid span,
      .clarity-steps article {
        border-right: 0;
      }

      .nrs-project-detail-page .section-container > .case-label,
      .nrs-project-detail-page .section-container > .eyebrow,
      .nrs-project-detail-page .section-container > .section-header > .eyebrow,
      .nrs-project-detail-page .section-container > h2,
      .nrs-project-detail-page .section-container > .section-title,
      .nrs-project-detail-page .section-container > p,
      .nrs-project-detail-page .section-container > .body-large,
      .nrs-project-detail-page .section-container > ul,
      .nrs-project-detail-page .section-container > .case-list,
      .nrs-project-detail-page .section-container > .journey-grid,
      .nrs-project-detail-page .section-container > .snapshot-grid,
      .nrs-project-detail-page .section-container > .prototype-link-list,
      .nrs-project-detail-page .section-container > .embed-frame-wrapper,
      .nrs-project-detail-page .section-container > .section-header,
      .nrs-project-detail-page .section-container > div:not(.case-label) {
        grid-column: 1 !important;
      }
    }

    @media (max-width: 760px) {
      :root {
        --max-width: calc(100vw - 40px) !important;
        --nrs-site-width: calc(100vw - 40px);
      }

      .nrs-clarity-page .hero-title,
      .nrs-inner-page .hero-title {
        font-size: clamp(2.2rem, 12vw, 3.35rem) !important;
      }

      .nrs-inner-page main.container {
        padding-top: 94px !important;
      }

      .clarity-row-list article,
      .clarity-row-list article.nrs-article.blog-prose,
      .nrs-article.blog-prose,
      .nrs-project-detail-page .journey-card,
      .nrs-project-detail-page .prototype-link-card {
        grid-template-columns: 1fr !important;
        gap: 12px !important;
        padding: clamp(22px, 6vw, 30px) !important;
        min-height: auto !important;
      }

      .nrs-project-detail-page .journey-grid {
        padding-top: clamp(12px, 4vw, 24px) !important;
      }

      .clarity-actions,
      .hero-actions,
      .form-actions {
        display: grid !important;
        grid-template-columns: 1fr !important;
        width: 100% !important;
      }

      .clarity-actions .btn,
      .hero-actions .btn,
      .form-actions .btn {
        width: 100% !important;
      }

      .nrs-project-detail-page iframe {
        min-height: 420px;
      }
    }
  `;

  document.head.appendChild(style);
}

export function polishSiteConsistency() {
  applyConsistencyPageClasses();
  injectConsistencyStyles();
}
