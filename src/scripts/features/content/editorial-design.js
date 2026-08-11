/**
 * @fileoverview src/scripts/features/content/editorial-design.js
 * Purpose: Browser runtime feature in the content domain responsible for editorial design behavior.
 * Responsibilities:
 * - Own the behavior/content implied by this file's single responsibility.
 * - Keep public routes, build contracts, and imported module boundaries stable unless the connected owners are updated together.
 * Execution context: Browser ES module loaded by the portfolio runtime.
 * Connected files:
 * - docs/repository/file-catalog.md
 * - src/runtime/script.js
 * - src/scripts/entrypoints/main.js
 * Maintenance: Update this header when responsibility or dependencies change; generated/vendor files are documented at their source instead.
 */
/**
 * Function contract: injectEditorialDesignStyles
 * Purpose: Implements the inject editorial design styles responsibility for this module.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may read or update browser DOM/state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function injectEditorialDesignStyles() {
  if (document.getElementById('nrs-editorial-design-styles')) return;

  const style = document.createElement('style');
  style.id = 'nrs-editorial-design-styles';
  style.textContent = `
    .nrs-inner-page main.container {
      padding-top: clamp(112px, 10vw, 156px) !important;
    }

    .nrs-inner-page .hero-section {
      max-width: min(1160px, 100%) !important;
      min-height: auto !important;
      margin: 0 auto clamp(48px, 8vw, 104px) !important;
      padding: clamp(48px, 8vw, 110px) 0 clamp(34px, 5vw, 72px) !important;
      border: 0 !important;
      border-radius: 0 !important;
      background: transparent !important;
      box-shadow: none !important;
      overflow: visible !important;
      align-items: flex-start !important;
      text-align: left !important;
    }

    .nrs-inner-page .hero-section::before,
    .nrs-inner-page .hero-section::after {
      display: none !important;
      content: none !important;
    }

    .nrs-inner-page .hero-section::after {
      content: '';
      display: block !important;
      width: min(720px, 72vw);
      height: 1px;
      margin-top: clamp(32px, 5vw, 54px);
      background: linear-gradient(90deg, rgba(255,255,255,.18), rgba(255,255,255,.02), transparent);
    }

    .nrs-inner-page .hero-title {
      max-width: 1060px !important;
      font-size: clamp(3rem, 8vw, 7.1rem) !important;
      line-height: .94 !important;
      letter-spacing: 0!important;
      text-wrap: balance;
    }

    .nrs-inner-page .body-large,
    .nrs-inner-page .section-lead {
      max-width: 760px !important;
    }

    .nrs-inner-page .section-container {
      max-width: min(1120px, 100%) !important;
      margin-inline: auto !important;
      padding: clamp(44px, 7vw, 86px) 0 !important;
      border: 0 !important;
      border-top: 1px solid rgba(255,255,255,.08) !important;
      border-radius: 0 !important;
      background: transparent !important;
      box-shadow: none !important;
    }

    .nrs-project-detail-page .section-container,
    .nrs-blog-detail-page .section-container,
    .nrs-service-page .section-container {
      margin-block: 0 !important;
      padding: clamp(44px, 7vw, 86px) 0 !important;
      border: 0 !important;
      border-top: 1px solid rgba(255,255,255,.08) !important;
      border-radius: 0 !important;
      background: transparent !important;
      box-shadow: none !important;
    }

    .nrs-inner-page .section-header,
    .nrs-inner-page .section-container > .section-header {
      max-width: 760px;
    }

    .nrs-inner-page .section-title {
      max-width: 920px;
      text-wrap: balance;
    }

    .nrs-project-detail-page .section-container,
    .nrs-service-page .section-container,
    .nrs-blog-detail-page .section-container {
      display: block;
    }

    .snapshot-grid,
    .journey-grid,
    .writing-list,
    .impact-summary-grid,
    .comparison-grid,
    .metric-plan-grid,
    .story-grid,
    .prototype-link-list {
      display: grid !important;
      gap: 0 !important;
      border-top: 1px solid rgba(255,255,255,.08);
    }

    .snapshot-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
    }

    .journey-grid,
    .comparison-grid,
    .metric-plan-grid,
    .story-grid,
    .prototype-link-list,
    .impact-summary-grid {
      grid-template-columns: 1fr !important;
    }

    .snapshot-grid > div,
    .journey-card,
    .comparison-card,
    .metric-plan-card,
    .story-card,
    .quote-card,
    .prototype-link-card,
    .writing-item,
    .achieve-item,
    .impact-card,
    .blog-note,
    .blog-author-card,
    .blog-share-card,
    .blog-toc,
    .link-pill,
    .filter-btn {
      border: 0 !important;
      border-bottom: 1px solid rgba(255,255,255,.08) !important;
      border-radius: 0 !important;
      background: transparent !important;
      box-shadow: none !important;
    }

    .snapshot-grid > div,
    .journey-card,
    .comparison-card,
    .metric-plan-card,
    .story-card,
    .quote-card,
    .prototype-link-card,
    .writing-item,
    .achieve-item,
    .impact-card,
    .blog-note,
    .blog-author-card,
    .blog-share-card,
    .blog-toc {
      padding: clamp(22px, 3.6vw, 42px) 0 !important;
    }

    .impact-summary-grid .impact-card,
    .writing-list .writing-item,
    .journey-card,
    .prototype-link-card {
      display: grid !important;
      grid-template-columns: minmax(110px, 180px) minmax(0, 1fr);
      gap: clamp(18px, 4vw, 52px);
      align-items: start;
    }

    .impact-summary-grid .impact-card .eyebrow,
    .writing-list .w-date,
    .journey-card .eyebrow,
    .prototype-link-card span:first-child,
    .snapshot-grid h5 {
      color: var(--text-tertiary, #8a8f98) !important;
      font-family: var(--font-sans, Inter, sans-serif) !important;
      font-size: .74rem !important;
      line-height: 1.35 !important;
      letter-spacing: 0!important;
      text-transform: uppercase !important;
    }

    .impact-summary-grid .impact-card h3,
    .writing-list .w-title,
    .journey-card h3,
    .prototype-link-card span:first-child + span,
    .snapshot-grid p {
      font-size: clamp(1.15rem, 2.15vw, 1.85rem) !important;
      line-height: 1.22 !important;
      color: var(--text-primary, #fff) !important;
    }

    .impact-summary-grid .impact-card p,
    .writing-list .w-summary,
    .journey-card p,
    .comparison-card p,
    .metric-plan-card p,
    .story-card p,
    .prototype-link-card span:last-child {
      max-width: 720px;
      color: var(--text-secondary, #d1d5db) !important;
      line-height: 1.75 !important;
    }

    .case-list {
      display: grid !important;
      gap: 0 !important;
      border-top: 1px solid rgba(255,255,255,.08);
      list-style: none !important;
      padding: 0 !important;
    }

    .case-list li {
      position: relative;
      padding: clamp(18px, 3vw, 30px) 0 clamp(18px, 3vw, 30px) clamp(28px, 4vw, 42px) !important;
      border: 0 !important;
      border-bottom: 1px solid rgba(255,255,255,.08) !important;
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
      box-shadow: 0 0 18px rgba(96,165,250,.38) !important;
    }

    .case-callout,
    blockquote {
      border: 0 !important;
      border-left: 2px solid rgba(96,165,250,.42) !important;
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
      border-radius: clamp(16px, 2vw, 24px) !important;
      background: transparent !important;
      box-shadow: none !important;
    }

    .case-hero-img,
    .case-hero-img-container img,
    .nrs-article img {
      border: 0 !important;
      border-radius: clamp(16px, 2vw, 24px) !important;
      box-shadow: 0 22px 90px rgba(0,0,0,.24) !important;
    }

    .contact-form {
      border: 0 !important;
      border-top: 1px solid rgba(255,255,255,.08) !important;
      border-bottom: 1px solid rgba(255,255,255,.08) !important;
      border-radius: 0 !important;
      background: transparent !important;
      box-shadow: none !important;
      padding: clamp(26px, 5vw, 48px) 0 !important;
    }

    .form-field input,
    .form-field select,
    .form-field textarea,
    .search-input {
      border-radius: 999px !important;
      border-color: rgba(255,255,255,.13) !important;
      background: rgba(255,255,255,.035) !important;
    }

    .form-field textarea {
      border-radius: 22px !important;
    }

    .project-card {
      border-radius: 24px !important;
    }

    .project-card:hover {
      transform: translateY(-4px) !important;
    }

    .nrs-work-intelligence {
      margin: 0 0 clamp(28px, 5vw, 56px);
      padding: 0 0 clamp(26px, 4vw, 42px);
      border-bottom: 1px solid rgba(255,255,255,.08);
    }

    .nrs-work-search-panel {
      display: grid;
      grid-template-columns: minmax(0, 1.2fr) auto;
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

    .nrs-work-summary {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 18px;
      color: var(--text-secondary, #d1d5db);
      font-size: .92rem;
    }

    .nrs-work-suggestion-row {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 16px;
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
      border-top: 1px solid rgba(255,255,255,.08);
      color: var(--text-secondary, #d1d5db);
    }

    .nrs-no-results.is-visible {
      display: block;
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
      background: transparent !important;
      box-shadow: none !important;
      border-color: rgba(15,23,42,.1) !important;
    }

    @media (max-width: 920px) {
      .nrs-inner-page main.container {
        padding-top: 96px !important;
      }

      .nrs-inner-page .hero-section {
        padding: 34px 0 28px !important;
        margin-bottom: 26px !important;
      }

      .snapshot-grid,
      .impact-summary-grid .impact-card,
      .writing-list .writing-item,
      .journey-card,
      .prototype-link-card,
      .nrs-work-search-panel {
        grid-template-columns: 1fr !important;
      }

      .nrs-work-search-panel #clear-work {
        width: 100%;
      }
    }

    @media (max-width: 760px) {
      .nrs-inner-page .hero-title {
        font-size: clamp(2.2rem, 13vw, 3.6rem) !important;
        letter-spacing: 0!important;
      }

      .nrs-inner-page .section-container,
      .nrs-project-detail-page .section-container,
      .nrs-blog-detail-page .section-container,
      .nrs-service-page .section-container {
        padding: 34px 0 !important;
      }

      .snapshot-grid > div,
      .journey-card,
      .comparison-card,
      .metric-plan-card,
      .story-card,
      .quote-card,
      .prototype-link-card,
      .writing-item,
      .achieve-item,
      .impact-card,
      .blog-note,
      .blog-author-card,
      .blog-share-card,
      .blog-toc {
        padding: 20px 0 !important;
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
    }
  `;
  document.head.appendChild(style);
}

/**
 * Function contract: refineEditorialDesign
 * Purpose: Implements the refine editorial design responsibility for this module.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: no explicit value unless an invoked dependency throws/rejects.
 */
export function refineEditorialDesign() {
  injectEditorialDesignStyles();
}
