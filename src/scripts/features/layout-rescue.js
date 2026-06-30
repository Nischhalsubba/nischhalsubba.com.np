function injectLayoutRescueStyles() {
  if (document.getElementById('nrs-layout-rescue-styles')) return;

  const style = document.createElement('style');
  style.id = 'nrs-layout-rescue-styles';
  style.textContent = `
    :root {
      --nrs-readable-width: 820px;
      --nrs-content-width: 1120px;
      --nrs-wide-width: 1360px;
      --nrs-page-gutter: clamp(20px, 5vw, 72px);
      --nrs-divider: rgba(255, 255, 255, .09);
    }

    html,
    body {
      overflow-x: clip;
    }

    .nrs-uniform-shell .container,
    .nrs-uniform-shell main.container {
      width: min(100%, var(--max-width, 1320px)) !important;
      margin-inline: auto !important;
    }

    /* Inner pages should feel like clean editorial pages, not cards inside cards. */
    .nrs-inner-page main.container {
      padding-top: clamp(104px, 10vw, 150px) !important;
      padding-bottom: clamp(70px, 10vw, 124px) !important;
    }

    .nrs-inner-page .hero-section {
      width: min(100%, var(--nrs-content-width)) !important;
      min-height: auto !important;
      margin: 0 auto clamp(42px, 7vw, 88px) !important;
      padding: clamp(46px, 7vw, 96px) 0 clamp(34px, 5vw, 62px) !important;
      text-align: left !important;
      align-items: flex-start !important;
      overflow: visible !important;
      border: 0 !important;
      border-radius: 0 !important;
      background: transparent !important;
      box-shadow: none !important;
    }

    .nrs-inner-page .hero-section::before {
      display: none !important;
      content: none !important;
    }

    .nrs-inner-page .hero-section::after {
      content: '' !important;
      display: block !important;
      width: min(760px, 100%);
      height: 1px;
      margin-top: clamp(30px, 5vw, 54px);
      background: linear-gradient(90deg, var(--nrs-divider), rgba(255,255,255,.02), transparent);
    }

    .nrs-inner-page .hero-title {
      max-width: 1060px !important;
      font-size: clamp(3rem, 8.4vw, 7.2rem) !important;
      line-height: .94 !important;
      letter-spacing: 0!important;
      text-wrap: balance;
    }

    .nrs-inner-page .body-large,
    .nrs-inner-page .section-lead {
      max-width: var(--nrs-readable-width) !important;
      text-wrap: pretty;
    }

    /* Section rhythm: open dividers instead of large rounded boxes. */
    .nrs-inner-page .section-container,
    .nrs-project-detail-page .section-container,
    .nrs-blog-detail-page .section-container,
    .nrs-service-page .section-container {
      width: min(100%, var(--nrs-content-width)) !important;
      max-width: var(--nrs-content-width) !important;
      margin-inline: auto !important;
      margin-block: 0 !important;
      padding: clamp(44px, 7vw, 86px) 0 !important;
      border: 0 !important;
      border-top: 1px solid var(--nrs-divider) !important;
      border-radius: 0 !important;
      background: transparent !important;
      box-shadow: none !important;
    }

    .nrs-inner-page .section-container:first-of-type {
      border-top-color: rgba(255, 255, 255, .06) !important;
    }

    .nrs-inner-page .section-title {
      max-width: 980px;
      text-wrap: balance;
    }

    /* Keep project cards as cards on the listing page. Remove boxed treatment from explanatory/detail blocks. */
    .nrs-project-detail-page .snapshot-grid,
    .nrs-project-detail-page .journey-grid,
    .nrs-project-detail-page .comparison-grid,
    .nrs-project-detail-page .metric-plan-grid,
    .nrs-project-detail-page .story-grid,
    .nrs-project-detail-page .prototype-link-list,
    .nrs-service-page .snapshot-grid,
    .nrs-service-page .journey-grid,
    .nrs-blog-detail-page .writing-list,
    .nrs-inner-page .impact-summary-grid:not(.project-grid) {
      display: grid !important;
      gap: 0 !important;
      border-top: 1px solid var(--nrs-divider);
    }

    .nrs-project-detail-page .snapshot-grid,
    .nrs-service-page .snapshot-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
    }

    .nrs-project-detail-page .journey-grid,
    .nrs-project-detail-page .comparison-grid,
    .nrs-project-detail-page .metric-plan-grid,
    .nrs-project-detail-page .story-grid,
    .nrs-project-detail-page .prototype-link-list,
    .nrs-service-page .journey-grid,
    .nrs-blog-detail-page .writing-list,
    .nrs-inner-page .impact-summary-grid:not(.project-grid) {
      grid-template-columns: 1fr !important;
    }

    .nrs-project-detail-page .snapshot-grid > div,
    .nrs-project-detail-page .journey-card,
    .nrs-project-detail-page .comparison-card,
    .nrs-project-detail-page .metric-plan-card,
    .nrs-project-detail-page .story-card,
    .nrs-project-detail-page .quote-card,
    .nrs-project-detail-page .prototype-link-card,
    .nrs-service-page .snapshot-grid > div,
    .nrs-service-page .journey-card,
    .nrs-blog-detail-page .blog-note,
    .nrs-blog-detail-page .blog-author-card,
    .nrs-blog-detail-page .blog-share-card,
    .nrs-blog-detail-page .blog-toc,
    .nrs-inner-page .impact-summary-grid .impact-card,
    .nrs-inner-page .writing-list .writing-item,
    .nrs-inner-page .achieve-item {
      border: 0 !important;
      border-bottom: 1px solid var(--nrs-divider) !important;
      border-radius: 0 !important;
      background: transparent !important;
      box-shadow: none !important;
      padding: clamp(22px, 4vw, 42px) 0 !important;
    }

    .nrs-project-detail-page .journey-card,
    .nrs-project-detail-page .prototype-link-card,
    .nrs-inner-page .impact-summary-grid .impact-card,
    .nrs-inner-page .writing-list .writing-item,
    .nrs-inner-page .achieve-item {
      display: grid !important;
      grid-template-columns: minmax(120px, 190px) minmax(0, 1fr);
      gap: clamp(20px, 4vw, 54px);
      align-items: start;
    }

    .nrs-project-detail-page .journey-card .eyebrow,
    .nrs-project-detail-page .prototype-link-card span:first-child,
    .nrs-inner-page .impact-summary-grid .impact-card .eyebrow,
    .nrs-inner-page .writing-list .w-date,
    .nrs-inner-page .achieve-item .eyebrow,
    .nrs-project-detail-page .snapshot-grid h5,
    .nrs-service-page .snapshot-grid h5 {
      color: var(--text-tertiary, #8d93a1) !important;
      font-family: var(--font-sans, Inter, sans-serif) !important;
      font-size: .73rem !important;
      letter-spacing: 0!important;
      text-transform: uppercase !important;
      line-height: 1.35 !important;
    }

    .nrs-project-detail-page .journey-card h3,
    .nrs-project-detail-page .prototype-link-card span:nth-child(2),
    .nrs-inner-page .impact-summary-grid .impact-card h3,
    .nrs-inner-page .writing-list .w-title,
    .nrs-inner-page .achieve-item h3,
    .nrs-project-detail-page .snapshot-grid p,
    .nrs-service-page .snapshot-grid p {
      color: var(--text-primary, #fff) !important;
      font-size: clamp(1.18rem, 2vw, 1.75rem) !important;
      line-height: 1.22 !important;
      margin-top: 0 !important;
    }

    .nrs-project-detail-page .journey-card p,
    .nrs-project-detail-page .comparison-card p,
    .nrs-project-detail-page .metric-plan-card p,
    .nrs-project-detail-page .story-card p,
    .nrs-project-detail-page .prototype-link-card span:last-child,
    .nrs-inner-page .impact-summary-grid .impact-card p,
    .nrs-inner-page .writing-list .w-summary,
    .nrs-inner-page .achieve-item p {
      max-width: 760px;
      color: var(--text-secondary, #d1d5db) !important;
      line-height: 1.75 !important;
    }

    .case-list {
      display: grid !important;
      gap: 0 !important;
      margin-top: clamp(22px, 4vw, 34px) !important;
      padding: 0 !important;
      list-style: none !important;
      border-top: 1px solid var(--nrs-divider);
    }

    .case-list li {
      position: relative;
      padding: clamp(18px, 3vw, 30px) 0 clamp(18px, 3vw, 30px) clamp(28px, 4vw, 42px) !important;
      border: 0 !important;
      border-bottom: 1px solid var(--nrs-divider) !important;
      border-radius: 0 !important;
      background: transparent !important;
      box-shadow: none !important;
    }

    .case-list li::before {
      left: 0 !important;
      top: clamp(28px, 4vw, 40px) !important;
      width: 7px !important;
      height: 7px !important;
      background: var(--accent-blue, #e8e8e8) !important;
      box-shadow: 0 0 18px rgba(96, 165, 250, .38) !important;
    }

    .case-callout,
    .nrs-inner-page blockquote {
      border: 0 !important;
      border-left: 2px solid rgba(96, 165, 250, .46) !important;
      border-radius: 0 !important;
      padding: clamp(18px, 3vw, 28px) 0 clamp(18px, 3vw, 28px) clamp(22px, 3vw, 32px) !important;
      background: transparent !important;
      box-shadow: none !important;
    }

    .case-hero-img-container,
    .blog-hero-img-container,
    .embed-frame-wrapper {
      padding: 0 !important;
      border: 0 !important;
      border-radius: clamp(18px, 2.5vw, 28px) !important;
      background: transparent !important;
      box-shadow: none !important;
    }

    .case-hero-img,
    .case-hero-img-container img,
    .blog-hero-img-container img,
    .nrs-article img {
      display: block;
      max-width: 100% !important;
      height: auto !important;
      border: 0 !important;
      border-radius: clamp(18px, 2.5vw, 28px) !important;
      box-shadow: 0 22px 90px rgba(0, 0, 0, .22) !important;
    }

    .contact-form {
      border: 0 !important;
      border-top: 1px solid var(--nrs-divider) !important;
      border-bottom: 1px solid var(--nrs-divider) !important;
      border-radius: 0 !important;
      background: transparent !important;
      box-shadow: none !important;
      padding: clamp(28px, 5vw, 52px) 0 !important;
    }

    .form-field input,
    .form-field select,
    .form-field textarea,
    .search-input {
      width: 100% !important;
      max-width: 100% !important;
      border-color: rgba(255, 255, 255, .13) !important;
      background: rgba(255, 255, 255, .035) !important;
    }

    .form-field input,
    .form-field select,
    .search-input {
      min-height: 48px;
      border-radius: 999px !important;
    }

    .form-field textarea {
      min-height: 150px;
      border-radius: 22px !important;
    }

    .nrs-work-intelligence {
      margin: 0 0 clamp(28px, 5vw, 56px);
      padding: 0 0 clamp(24px, 4vw, 42px);
      border-bottom: 1px solid var(--nrs-divider);
    }

    .nrs-work-search-panel {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 14px;
      align-items: center;
      margin-top: 22px;
    }

    .nrs-work-search-panel .search-wrapper {
      max-width: none !important;
      margin: 0 !important;
    }

    .nrs-work-search-panel #clear-work {
      margin-top: 0 !important;
      min-height: 48px;
    }

    .nrs-work-summary,
    .nrs-work-suggestion-row {
      max-width: var(--nrs-readable-width);
    }

    .nrs-work-summary {
      margin-top: 16px;
      color: var(--text-secondary, #d1d5db);
      font-size: .92rem;
    }

    .nrs-work-suggestion-row {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 14px;
    }

    .nrs-search-chip {
      border: 1px solid rgba(255,255,255,.1);
      border-radius: 999px;
      padding: 8px 12px;
      color: var(--text-secondary, #d1d5db);
      background: rgba(255,255,255,.025);
      font-size: .84rem;
      cursor: pointer;
    }

    .nrs-search-chip:hover,
    .nrs-search-chip:focus-visible {
      border-color: rgba(96,165,250,.45);
      color: var(--text-primary, #fff);
    }

    .nrs-no-results {
      display: none;
      padding: clamp(28px, 5vw, 54px) 0;
      border-top: 1px solid var(--nrs-divider);
      color: var(--text-secondary, #d1d5db);
    }

    .nrs-no-results.is-visible {
      display: block;
    }

    .project-grid {
      width: 100% !important;
    }

    .project-card {
      min-width: 0;
    }

    [data-theme="light"] {
      --nrs-divider: rgba(15, 23, 42, .1);
    }

    [data-theme="light"] .nrs-project-detail-page .snapshot-grid > div,
    [data-theme="light"] .nrs-project-detail-page .journey-card,
    [data-theme="light"] .nrs-project-detail-page .comparison-card,
    [data-theme="light"] .nrs-project-detail-page .metric-plan-card,
    [data-theme="light"] .nrs-project-detail-page .story-card,
    [data-theme="light"] .nrs-project-detail-page .quote-card,
    [data-theme="light"] .nrs-project-detail-page .prototype-link-card,
    [data-theme="light"] .nrs-service-page .snapshot-grid > div,
    [data-theme="light"] .nrs-service-page .journey-card,
    [data-theme="light"] .nrs-blog-detail-page .blog-note,
    [data-theme="light"] .nrs-blog-detail-page .blog-author-card,
    [data-theme="light"] .nrs-blog-detail-page .blog-share-card,
    [data-theme="light"] .nrs-blog-detail-page .blog-toc,
    [data-theme="light"] .nrs-inner-page .impact-summary-grid .impact-card,
    [data-theme="light"] .nrs-inner-page .writing-list .writing-item,
    [data-theme="light"] .nrs-inner-page .achieve-item,
    [data-theme="light"] .contact-form {
      background: transparent !important;
      box-shadow: none !important;
    }

    @media (max-width: 920px) {
      .nrs-uniform-shell .container,
      .nrs-uniform-shell main.container,
      .nrs-inner-page .section-container,
      .nrs-project-detail-page .section-container,
      .nrs-blog-detail-page .section-container,
      .nrs-service-page .section-container,
      .nrs-inner-page .hero-section {
        width: 100% !important;
        max-width: 100% !important;
      }

      .nrs-inner-page main.container {
        padding-top: 94px !important;
      }

      .nrs-inner-page .hero-section {
        padding-top: 32px !important;
        padding-bottom: 28px !important;
        margin-bottom: 28px !important;
      }

      .nrs-inner-page .hero-title {
        font-size: clamp(2.35rem, 12vw, 4rem) !important;
        line-height: .98 !important;
      }

      .nrs-project-detail-page .snapshot-grid,
      .nrs-service-page .snapshot-grid,
      .nrs-project-detail-page .journey-card,
      .nrs-project-detail-page .prototype-link-card,
      .nrs-inner-page .impact-summary-grid .impact-card,
      .nrs-inner-page .writing-list .writing-item,
      .nrs-inner-page .achieve-item,
      .nrs-work-search-panel {
        grid-template-columns: 1fr !important;
      }

      .nrs-work-search-panel #clear-work {
        width: 100% !important;
      }
    }

    @media (max-width: 760px) {
      html,
      body {
        overflow-x: hidden !important;
        background-attachment: scroll !important;
      }

      .container,
      main.container,
      .section-container,
      .nrs-article-main {
        padding-left: max(20px, env(safe-area-inset-left)) !important;
        padding-right: max(20px, env(safe-area-inset-right)) !important;
      }

      .nrs-inner-page .hero-section,
      .nrs-inner-page .section-container,
      .nrs-project-detail-page .section-container,
      .nrs-blog-detail-page .section-container,
      .nrs-service-page .section-container {
        padding-left: 0 !important;
        padding-right: 0 !important;
      }

      .nrs-inner-page .hero-title {
        font-size: clamp(2.2rem, 13vw, 3.35rem) !important;
        letter-spacing: 0!important;
      }

      .nrs-inner-page .body-large,
      .nrs-inner-page .section-lead,
      .nrs-article p,
      .nrs-article li {
        font-size: 1rem !important;
        line-height: 1.7 !important;
      }

      .hero-actions,
      .cta-group,
      .form-actions,
      .contact-actions {
        display: grid !important;
        grid-template-columns: 1fr !important;
        gap: 12px !important;
        width: 100% !important;
      }

      .btn,
      .hero-actions .btn,
      .cta-group .btn,
      .form-actions .btn,
      .contact-actions .btn,
      .footer-email-btn {
        width: 100% !important;
        min-width: 0 !important;
        max-width: 100% !important;
        min-height: 48px !important;
        justify-content: center !important;
        text-align: center !important;
        white-space: normal !important;
      }

      .filter-row {
        display: flex !important;
        flex-wrap: nowrap !important;
        overflow-x: auto !important;
        gap: 8px !important;
        padding-bottom: 10px;
        -webkit-overflow-scrolling: touch;
      }

      .filter-row .filter-btn,
      .filter-row .blog-filter-btn {
        flex: 0 0 auto;
        width: auto !important;
        min-width: max-content !important;
      }

      .floating-resume-btn {
        display: none !important;
      }

      img,
      svg,
      video,
      iframe {
        max-width: 100% !important;
      }
    }
  `;

  document.head.appendChild(style);
}

export function stabilizeLayout() {
  injectLayoutRescueStyles();
}
