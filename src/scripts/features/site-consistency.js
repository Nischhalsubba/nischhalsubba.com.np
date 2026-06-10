function applyConsistencyPageClasses() {
  const path = window.location.pathname;
  const fileName = path.split('/').filter(Boolean).pop() || 'index.html';

  document.body.classList.toggle('nrs-contact-page', fileName === 'contact.html');
  document.body.classList.toggle('nrs-work-page', fileName === 'projects.html');
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
      --nrs-content-width: var(--nrs-site-width);
      --nrs-wide-width: var(--nrs-site-width);
      --nrs-page-gutter: clamp(20px, 4vw, 48px);
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

    .nrs-inner-page .section-container,
    .nrs-project-detail-page .section-container,
    .nrs-blog-detail-page .section-container,
    .nrs-service-page .section-container {
      padding-top: clamp(40px, 6vw, 76px) !important;
      padding-bottom: clamp(40px, 6vw, 76px) !important;
    }

    /* Active nav should feel intentional in both desktop and mobile menus. */
    .nav-link.active,
    .mobile-nav-links a.active {
      color: var(--text-primary, #fff) !important;
    }

    .nav-link[aria-current='page'],
    .mobile-nav-links a[aria-current='page'] {
      font-weight: 700;
    }

    /* Contact page: make it useful, calm, and conversion-focused. */
    .nrs-contact-page .hero-section {
      display: grid !important;
      grid-template-columns: minmax(0, 1fr) minmax(280px, 420px);
      gap: clamp(28px, 6vw, 72px);
      align-items: end !important;
      border-bottom: 1px solid var(--nrs-divider, rgba(255,255,255,.09)) !important;
    }

    .nrs-contact-page .hero-section::after {
      display: none !important;
    }

    .nrs-contact-page .hero-section .hero-title {
      max-width: 760px !important;
      font-size: clamp(3.2rem, 7.2vw, 6.2rem) !important;
    }

    .nrs-contact-page .impact-summary-grid {
      display: grid !important;
      grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
      gap: 0 !important;
      border-top: 1px solid var(--nrs-divider, rgba(255,255,255,.09));
    }

    .nrs-contact-page .impact-card {
      padding: clamp(22px, 3vw, 34px) clamp(18px, 3vw, 28px) !important;
      border: 0 !important;
      border-right: 1px solid var(--nrs-divider, rgba(255,255,255,.09)) !important;
      border-bottom: 1px solid var(--nrs-divider, rgba(255,255,255,.09)) !important;
      border-radius: 0 !important;
      background: transparent !important;
      box-shadow: none !important;
    }

    .nrs-contact-page .impact-card:last-child {
      border-right: 0 !important;
    }

    .nrs-contact-page .contact-form {
      display: grid !important;
      grid-template-columns: minmax(0, 1fr);
      gap: 20px;
      max-width: 860px;
      border-top: 1px solid var(--nrs-divider, rgba(255,255,255,.09)) !important;
      border-bottom: 1px solid var(--nrs-divider, rgba(255,255,255,.09)) !important;
      padding: clamp(30px, 5vw, 56px) 0 !important;
    }

    .nrs-contact-page .form-grid {
      display: grid !important;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 18px;
    }

    .nrs-contact-page .form-field {
      display: grid !important;
      gap: 10px;
      color: var(--text-secondary, #d1d5db);
      font-size: .9rem;
      font-weight: 700;
    }

    .nrs-contact-page .form-field input,
    .nrs-contact-page .form-field select,
    .nrs-contact-page .form-field textarea {
      color: var(--text-primary, #fff);
      border: 1px solid rgba(255,255,255,.13) !important;
      background: rgba(255,255,255,.035) !important;
      transition: border-color .2s ease, background .2s ease, box-shadow .2s ease;
    }

    .nrs-contact-page .form-field input:focus,
    .nrs-contact-page .form-field select:focus,
    .nrs-contact-page .form-field textarea:focus {
      border-color: rgba(96,165,250,.72) !important;
      box-shadow: 0 0 0 4px rgba(96,165,250,.08);
      outline: none;
    }

    .nrs-contact-page .form-status {
      min-height: 1.4em;
      margin: 0 !important;
      color: var(--text-secondary, #d1d5db);
      font-size: .92rem;
    }

    .nrs-contact-page .form-status[data-tone='success'] {
      color: #86efac;
    }

    .nrs-contact-page .form-status[data-tone='error'] {
      color: #fca5a5;
    }

    .nrs-contact-page .writing-list {
      border-top: 1px solid var(--nrs-divider, rgba(255,255,255,.09));
    }

    .nrs-contact-page .writing-item {
      display: grid !important;
      grid-template-columns: minmax(92px, 140px) minmax(0, 1fr);
      gap: clamp(18px, 4vw, 52px);
      padding: clamp(20px, 3.5vw, 34px) 0 !important;
      border: 0 !important;
      border-bottom: 1px solid var(--nrs-divider, rgba(255,255,255,.09)) !important;
      border-radius: 0 !important;
      background: transparent !important;
      box-shadow: none !important;
    }

    /* Project detail: cleaner case-study reading flow. */
    .nrs-project-detail-page .hero-section {
      display: grid !important;
      grid-template-columns: minmax(0, 1fr);
      gap: 22px;
      border-bottom: 1px solid var(--nrs-divider, rgba(255,255,255,.09)) !important;
    }

    .nrs-project-detail-page .hero-section::after {
      display: none !important;
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
      color: var(--text-tertiary, #8d93a1) !important;
    }

    .nrs-project-detail-page .section-container {
      display: grid !important;
      grid-template-columns: minmax(130px, 220px) minmax(0, 1fr);
      column-gap: clamp(28px, 6vw, 86px);
      row-gap: 20px;
      align-items: start;
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

    .nrs-project-detail-page .section-container > .section-header .section-title,
    .nrs-project-detail-page .section-container > h2.section-title,
    .nrs-project-detail-page .section-container > h2 {
      font-size: clamp(2rem, 4vw, 3.4rem) !important;
      line-height: 1.02 !important;
      letter-spacing: -.045em !important;
      margin-bottom: 14px !important;
    }

    .nrs-project-detail-page .snapshot-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
      gap: 0 !important;
    }

    .nrs-project-detail-page .journey-card,
    .nrs-project-detail-page .prototype-link-card {
      grid-template-columns: minmax(110px, 160px) minmax(0, 1fr) !important;
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

      .nrs-contact-page .hero-section,
      .nrs-contact-page .impact-summary-grid,
      .nrs-contact-page .form-grid,
      .nrs-project-detail-page .section-container,
      .nrs-project-detail-page .snapshot-grid,
      .nrs-project-detail-page .journey-card,
      .nrs-project-detail-page .prototype-link-card {
        grid-template-columns: 1fr !important;
      }

      .nrs-contact-page .impact-card {
        border-right: 0 !important;
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

      .nrs-project-detail-page .section-container > .case-label,
      .nrs-project-detail-page .section-container > .eyebrow,
      .nrs-project-detail-page .section-container > .section-header > .eyebrow {
        position: static !important;
      }
    }

    @media (max-width: 760px) {
      :root {
        --max-width: calc(100vw - 40px) !important;
        --nrs-site-width: calc(100vw - 40px);
      }

      .nrs-inner-page .hero-title,
      .nrs-contact-page .hero-section .hero-title {
        font-size: clamp(2.2rem, 12vw, 3.35rem) !important;
      }

      .nrs-inner-page main.container {
        padding-top: 94px !important;
      }

      .nrs-contact-page .writing-item {
        grid-template-columns: 1fr !important;
        gap: 10px;
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
