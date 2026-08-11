/**
 * @fileoverview src/scripts/features/system/design-system-standards.js
 * Purpose: Implement design system standards behavior inside the system browser-runtime domain.
 * Responsibilities:
 * - Own the system behavior represented by this module and keep unrelated domains outside the file.
 * - Read or update only the DOM/runtime state needed for this feature and preserve accessibility semantics.
 * - Expose stable initializer/helper exports consumed by runtime entrypoints or closely related features.
 * Execution context: Browser ES module loaded through the portfolio runtime.
 * Connected files:
 * - src/runtime/script.js
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
const DESIGN_SYSTEM_STYLE_ID = 'nrs-design-system-standards';

/**
 * Function contract: ensureDesignSystemStyles
 * Purpose: Apply design system styles consistently while preserving the surrounding design system standards browser feature contract.
 * Inputs: None; derives required state from the enclosing module/runtime context.
 * Side effects: reads or updates DOM/browser state.
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
 */
function ensureDesignSystemStyles() {
  let style = document.getElementById(DESIGN_SYSTEM_STYLE_ID);
  if (!style) {
    style = document.createElement('style');
    style.id = DESIGN_SYSTEM_STYLE_ID;
    document.head.appendChild(style);
  }

  style.textContent = `
    :root {
      --radius-card: 18px;
      --radius-control: 18px;
      --card-bg: transparent;
      --card-bg-hover: rgba(255, 255, 255, 0.035);
      --card-border: var(--border-faint);
      --card-border-hover: var(--border-strong);
      --card-padding: clamp(22px, 2.8vw, 34px);
      --card-gap: 16px;
      --card-shadow: none;
      --component-gap: clamp(18px, 2.4vw, 28px);
      --section-gap: clamp(38px, 5.4vw, 72px);
      --focus-ring-neutral: rgba(224, 224, 224, 0.34);
    }

    html[data-theme='light'] {
      --card-bg: #ffffff;
      --card-bg-hover: #ffffff;
      --focus-ring-neutral: rgba(68, 68, 68, 0.22);
    }

    .impact-card,
    .project-card,
    .writing-item,
    .journey-card,
    .comparison-card,
    .metric-plan-card,
    .story-card,
    .quote-card,
    .contact-form,
    .blog-note,
    .blog-toc,
    .blog-author-card,
    .blog-share-card,
    .nrs-uxcel-proof,
    .prototype-link-card,
    .embed-frame-wrapper,
    .nrs-case-proof,
    .snapshot-grid,
    .case-list li,
    .clarity-row-list article,
    .nrs-blog-proof-grid article,
    .nrs-related-card {
      border: 1px solid var(--card-border) !important;
      border-radius: var(--radius-card) !important;
      background: var(--card-bg) !important;
      background-color: var(--card-bg) !important;
      background-image: none !important;
      box-shadow: var(--card-shadow) !important;
      filter: none !important;
      color: inherit !important;
    }

    .impact-card,
    .journey-card,
    .comparison-card,
    .metric-plan-card,
    .story-card,
    .quote-card,
    .prototype-link-card,
    .blog-note,
    .blog-toc,
    .blog-author-card,
    .blog-share-card,
    .nrs-uxcel-proof,
    .nrs-case-proof,
    .case-list li,
    .clarity-row-list article,
    .nrs-blog-proof-grid article,
    .nrs-related-card {
      padding: var(--card-padding) !important;
    }

    .impact-card:hover,
    .project-card:hover,
    .writing-item:hover,
    .journey-card:hover,
    .comparison-card:hover,
    .metric-plan-card:hover,
    .story-card:hover,
    .quote-card:hover,
    .prototype-link-card:hover,
    .nrs-related-card:hover {
      transform: translateY(-2px) !important;
      border-color: var(--card-border-hover) !important;
      background: var(--card-bg-hover) !important;
      background-image: none !important;
      box-shadow: none !important;
    }

    html[data-theme='light'] .impact-card,
    html[data-theme='light'] .project-card,
    html[data-theme='light'] .writing-item,
    html[data-theme='light'] .journey-card,
    html[data-theme='light'] .comparison-card,
    html[data-theme='light'] .metric-plan-card,
    html[data-theme='light'] .story-card,
    html[data-theme='light'] .quote-card,
    html[data-theme='light'] .contact-form,
    html[data-theme='light'] .blog-note,
    html[data-theme='light'] .blog-toc,
    html[data-theme='light'] .blog-author-card,
    html[data-theme='light'] .blog-share-card,
    html[data-theme='light'] .nrs-uxcel-proof,
    html[data-theme='light'] .prototype-link-card,
    html[data-theme='light'] .embed-frame-wrapper,
    html[data-theme='light'] .nrs-case-proof,
    html[data-theme='light'] .snapshot-grid,
    html[data-theme='light'] .case-list li,
    html[data-theme='light'] .clarity-row-list article,
    html[data-theme='light'] .nrs-blog-proof-grid article,
    html[data-theme='light'] .nrs-related-card {
      background: #ffffff !important;
      background-image: none !important;
      border-color: rgba(23, 23, 23, 0.14) !important;
      box-shadow: none !important;
    }

    .journey-grid,
    main:has(.case-hero-img-container) .journey-grid,
    .nrs-project-detail-page .journey-grid,
    .impact-summary-grid,
    .nrs-blog-proof-grid,
    .prototype-link-list,
    .clarity-row-list,
    .writing-list,
    .case-list,
    .project-grid {
      gap: var(--component-gap) !important;
    }

    .journey-card,
    main:has(.case-hero-img-container) .journey-card,
    .nrs-project-detail-page .journey-card {
      display: grid !important;
      align-content: start !important;
      gap: 14px !important;
      min-height: auto !important;
      padding: var(--card-padding) !important;
      border: 1px solid var(--card-border) !important;
      border-radius: var(--radius-card) !important;
      background: var(--card-bg) !important;
      box-shadow: none !important;
      counter-increment: none !important;
    }

    .journey-card::before,
    main:has(.case-hero-img-container) .journey-card::before,
    .nrs-project-detail-page .journey-card::before {
      display: none !important;
      content: none !important;
    }

    .journey-card .eyebrow,
    main:has(.case-hero-img-container) .journey-card .eyebrow,
    .nrs-project-detail-page .journey-card .eyebrow {
      display: inline-flex !important;
      width: max-content !important;
      margin: 0 !important;
    }

    .journey-card h3,
    main:has(.case-hero-img-container) .journey-card h3,
    .nrs-project-detail-page .journey-card h3 {
      font-family: var(--font-sans) !important;
      font-size: clamp(1.08rem, 1.35vw, 1.28rem) !important;
      letter-spacing: 0!important;
      line-height: 1.25 !important;
      margin: 0 !important;
      color: var(--text-primary) !important;
    }

    .journey-card p,
    main:has(.case-hero-img-container) .journey-card p,
    .nrs-project-detail-page .journey-card p {
      margin: 0 !important;
      color: var(--text-secondary) !important;
      line-height: 1.65 !important;
    }

    .project-grid {
      display: grid !important;
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
      align-items: stretch !important;
    }

    .project-card {
      display: grid !important;
      grid-template-rows: auto 1fr !important;
      overflow: hidden !important;
      border: 1px solid var(--card-border) !important;
      border-radius: var(--radius-card) !important;
      background: var(--card-bg) !important;
      box-shadow: none !important;
      text-decoration: none !important;
      transform: none !important;
      height: 100% !important;
      min-height: 0 !important;
    }

    .project-card:hover {
      transform: translateY(-2px) !important;
      border-color: var(--card-border-hover) !important;
      box-shadow: none !important;
      background: var(--card-bg-hover) !important;
    }

    .card-media-wrap {
      aspect-ratio: 16 / 10 !important;
      overflow: hidden !important;
      border-bottom: 1px solid var(--card-border) !important;
      border-radius: 0 !important;
      background: var(--bg-surface) !important;
    }

    .card-media-wrap img {
      display: block !important;
      width: 100% !important;
      height: 100% !important;
      object-fit: cover !important;
    }

    .card-content {
      display: grid !important;
      align-content: start !important;
      gap: 14px !important;
      padding: var(--card-padding) !important;
      min-width: 0 !important;
    }

    .card-content h3,
    .project-card h3 {
      margin: 0 !important;
      font-family: var(--font-serif) !important;
      font-size: clamp(1.35rem, 1.8vw, 1.75rem) !important;
      line-height: 1.12 !important;
      letter-spacing: 0!important;
      color: var(--text-primary) !important;
    }

    .card-summary {
      margin: 0 !important;
      max-width: 62ch !important;
      color: var(--text-secondary) !important;
      line-height: 1.65 !important;
    }

    .card-meta-line {
      display: flex !important;
      flex-wrap: wrap !important;
      gap: 8px !important;
      align-items: center !important;
      min-width: 0 !important;
      color: var(--text-tertiary) !important;
    }

    .badge-pill,
    .tag,
    .pill,
    .link-pill,
    .filter-btn,
    .card-meta-line span,
    .hero-proof-strip span,
    .nrs-blog-tags b,
    .w-date {
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      min-height: 34px !important;
      padding: 7px 12px !important;
      border: 1px solid var(--card-border) !important;
      border-radius: var(--radius-card) !important;
      background: transparent !important;
      background-image: none !important;
      color: var(--text-secondary) !important;
      font-size: 0.76rem !important;
      font-weight: 800 !important;
      line-height: 1 !important;
      letter-spacing: 0!important;
      text-transform: uppercase !important;
      box-shadow: none !important;
    }

    .filter-btn.active,
    .filter-btn:hover,
    .badge-pill:hover,
    .tag:hover,
    .pill:hover,
    .link-pill:hover {
      border-color: var(--card-border-hover) !important;
      background: var(--card-bg-hover) !important;
      color: var(--text-primary) !important;
      box-shadow: none !important;
      transform: none !important;
    }

    .btn,
    .btn-primary,
    .btn-secondary,
    button.btn,
    a.btn {
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      min-height: 46px !important;
      padding: 0 18px !important;
      border-radius: var(--radius-card) !important;
      font-weight: 850 !important;
      letter-spacing: 0!important;
      box-shadow: none !important;
      transition: transform 160ms ease, border-color 160ms ease, background-color 160ms ease, color 160ms ease !important;
    }

    .btn:hover,
    .btn-primary:hover,
    .btn-secondary:hover,
    button.btn:hover,
    a.btn:hover {
      transform: translateY(-2px) !important;
      box-shadow: none !important;
    }

    .nav-pill {
      border-radius: var(--radius-card) !important;
      padding: 6px !important;
      box-shadow: none !important;
      background-image: none !important;
      border: 1px solid var(--card-border) !important;
    }

    .nav-link,
    .mobile-nav-links a,
    .mobile-logo,
    .theme-toggle-btn,
    .mobile-nav-toggle {
      border-radius: calc(var(--radius-card) - 6px) !important;
      box-shadow: none !important;
    }

    .nav-glider {
      border-radius: calc(var(--radius-card) - 6px) !important;
      box-shadow: none !important;
      background-image: none !important;
    }

    input,
    select,
    textarea,
    .search-input,
    .form-field input,
    .form-field select,
    .form-field textarea {
      border-radius: var(--radius-card) !important;
      border: 1px solid var(--card-border) !important;
      background: transparent !important;
      background-image: none !important;
      box-shadow: none !important;
    }

    .search-input {
      min-height: 52px !important;
      padding-inline: 18px !important;
    }

    input:focus,
    select:focus,
    textarea:focus,
    .search-input:focus,
    .filter-btn:focus-visible,
    .nav-link:focus-visible,
    .btn:focus-visible,
    .project-card:focus-visible,
    .writing-item:focus-visible,
    .link-pill:focus-visible,
    .theme-toggle-btn:focus-visible,
    .mobile-nav-toggle:focus-visible,
    .mobile-logo:focus-visible {
      outline: 3px solid var(--focus-ring-neutral) !important;
      outline-offset: 3px !important;
      border-color: var(--card-border-hover) !important;
      box-shadow: none !important;
    }

    .case-list {
      margin-top: var(--section-gap) !important;
      padding: 0 !important;
    }

    .case-list li {
      min-height: auto !important;
      align-items: flex-start !important;
      padding: var(--card-padding) !important;
      padding-left: calc(var(--card-padding) + 28px) !important;
      line-height: 1.65 !important;
    }

    .case-list li::before {
      left: var(--card-padding) !important;
      top: calc(var(--card-padding) + 0.62em) !important;
      transform: none !important;
      width: 7px !important;
      height: 7px !important;
      background: var(--text-tertiary) !important;
      box-shadow: none !important;
    }

    .snapshot-grid {
      overflow: hidden !important;
      padding: 0 !important;
    }

    .snapshot-grid > div {
      padding: var(--card-padding) !important;
    }

    .writing-item {
      align-items: start !important;
      min-height: 0 !important;
      padding: var(--card-padding) !important;
    }

    .w-arrow {
      border-radius: var(--radius-card) !important;
      border-color: var(--card-border) !important;
      box-shadow: none !important;
    }

    .w-arrow::before {
      border-color: var(--text-tertiary) !important;
    }

    .w-arrow::after {
      background: var(--text-tertiary) !important;
    }

    blockquote,
    .case-callout {
      border-radius: var(--radius-card) !important;
      border-color: var(--card-border) !important;
      border-left: 1px solid var(--card-border) !important;
      background: transparent !important;
      box-shadow: none !important;
    }

    .section-container,
    main:has(.case-hero-img-container) .section-container.reveal-on-scroll:not(#proof) {
      border-top-color: var(--card-border) !important;
    }

    .project-card,
    .writing-item,
    .journey-card,
    .impact-card,
    .story-card,
    .quote-card,
    .metric-plan-card,
    .comparison-card,
    .prototype-link-card,
    .case-list li,
    .btn,
    .filter-btn,
    .link-pill {
      transition: transform 160ms ease, border-color 160ms ease, background-color 160ms ease, color 160ms ease !important;
    }

    @media (max-width: 920px) {
      .project-grid,
      .journey-grid,
      main:has(.case-hero-img-container) .journey-grid,
      .impact-summary-grid,
      .nrs-blog-proof-grid,
      .prototype-link-list,
      .case-list {
        grid-template-columns: 1fr !important;
      }

      .writing-item,
      .writing-list[data-blog-posts] .writing-item {
        grid-template-columns: 1fr !important;
      }

      .w-arrow {
        display: none !important;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .project-card:hover,
      .writing-item:hover,
      .journey-card:hover,
      .impact-card:hover,
      .story-card:hover,
      .quote-card:hover,
      .metric-plan-card:hover,
      .comparison-card:hover,
      .prototype-link-card:hover,
      .btn:hover {
        transform: none !important;
      }
    }
  `;
}

/**
 * Function contract: applyDesignSystemStandards
 * Purpose: Apply design system standards consistently while preserving the surrounding design system standards browser feature contract.
 * Inputs: None; derives required state from the enclosing module/runtime context.
 * Side effects: reads or updates DOM/browser state.
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
 */
export function applyDesignSystemStandards() {
  ensureDesignSystemStyles();
  requestAnimationFrame(ensureDesignSystemStyles);
  window.setTimeout(ensureDesignSystemStyles, 250);
  window.setTimeout(ensureDesignSystemStyles, 1000);
}
