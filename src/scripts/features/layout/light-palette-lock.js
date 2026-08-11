/**
 * @fileoverview src/scripts/features/layout/light-palette-lock.js
 * Purpose: Implement light palette lock behavior inside the layout browser-runtime domain.
 * Responsibilities:
 * - Own the layout behavior represented by this module and keep unrelated domains outside the file.
 * - Read or update only the DOM/runtime state needed for this feature and preserve accessibility semantics.
 * - Expose stable initializer/helper exports consumed by runtime entrypoints or closely related features.
 * Execution context: Browser ES module loaded through the portfolio runtime.
 * Connected files:
 * - src/runtime/script.js
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
const LIGHT_PALETTE_LOCK_ID = 'nrs-light-palette-lock';


/**
 * Function contract: ensureLightPaletteLockStyle
 * Purpose: Apply light palette lock style consistently while preserving the surrounding light palette lock browser feature contract.
 * Inputs: None; derives required state from its enclosing module/runtime context.
 * Side effects: reads or updates DOM/browser state
 * Returns: Undefined; the function exists for the documented side effects, validation, or orchestration.
 */
function ensureLightPaletteLockStyle() {
  let style = document.getElementById(LIGHT_PALETTE_LOCK_ID);
  if (!style) {
    style = document.createElement('style');
    style.id = LIGHT_PALETTE_LOCK_ID;
    document.head.appendChild(style);
  }

  style.textContent = `
    html[data-theme='light'] {
      --bg-page: #FFFFFF !important;
      --bg-surface: transparent !important;
      --bg-surface-2: transparent !important;
      --bg-pill: transparent !important;
      --bg-nav: transparent !important;
      --text-primary: #1A1A1A !important;
      --text-secondary: #555555 !important;
      --text-tertiary: #555555 !important;
      --text-soft: #555555 !important;
      --accent: #444444 !important;
      --accent-blue: #444444 !important;
      --accent-cyan: #555555 !important;
      --accent-gold: #444444 !important;
      --accent-glow: transparent !important;
      --border-faint: #E5E5E5 !important;
      --border-strong: #444444 !important;
      --nrs-divider: #E5E5E5 !important;
    }

    html[data-theme='light'],
    html[data-theme='light'] body,
    html[data-theme='light'] main,
    html[data-theme='light'] main.container {
      background: #FFFFFF !important;
      background-color: #FFFFFF !important;
      background-image: none !important;
      color: #1A1A1A !important;
    }

    html[data-theme='light'] body::before,
    html[data-theme='light'] body::after,
    html[data-theme='light'] #grid-canvas,
    html[data-theme='light'] .background-grid,
    html[data-theme='light'] .ambient-glow,
    html[data-theme='light'] .cursor-glow,
    html[data-theme='light'] .page-glow,
    html[data-theme='light'] .noise-layer,
    html[data-theme='light'] .hero-section::before,
    html[data-theme='light'] .hero-section::after,
    html[data-theme='light'] section::before,
    html[data-theme='light'] section::after,
    html[data-theme='light'] article::before,
    html[data-theme='light'] article::after {
      display: none !important;
      opacity: 0 !important;
      visibility: hidden !important;
      background: transparent !important;
      background-color: transparent !important;
      background-image: none !important;
      box-shadow: none !important;
      filter: none !important;
    }

    html[data-theme='light'] main,
    html[data-theme='light'] main.container,
    html[data-theme='light'] .container,
    html[data-theme='light'] section,
    html[data-theme='light'] article,
    html[data-theme='light'] footer,
    html[data-theme='light'] header,
    html[data-theme='light'] .hero-section,
    html[data-theme='light'] .section-container,
    html[data-theme='light'] .nrs-inner-page .hero-section,
    html[data-theme='light'] .nrs-inner-page .section-container,
    html[data-theme='light'] .nrs-project-detail-page .section-container,
    html[data-theme='light'] .nrs-blog-detail-page .section-container,
    html[data-theme='light'] .nrs-service-page .section-container,
    html[data-theme='light'] .case-hero,
    html[data-theme='light'] .case-hero-container,
    html[data-theme='light'] .case-hero-panel,
    html[data-theme='light'] .project-hero,
    html[data-theme='light'] .project-hero-inner,
    html[data-theme='light'] .nrs-blog-detail-surface,
    html[data-theme='light'] .nrs-article-frame,
    html[data-theme='light'] .nrs-blog-hub-shell,
    html[data-theme='light'] .clarity-hero,
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
    html[data-theme='light'] .prototype-link-card,
    html[data-theme='light'] .embed-frame-wrapper,
    html[data-theme='light'] .snapshot-grid,
    html[data-theme='light'] .snapshot-grid > div,
    html[data-theme='light'] .case-list li,
    html[data-theme='light'] .nrs-blog-proof-grid article,
    html[data-theme='light'] .clarity-row-list article,
    html[data-theme='light'] .clarity-steps article,
    html[data-theme='light'] .stat-card,
    html[data-theme='light'] .service-card,
    html[data-theme='light'] .related-card,
    html[data-theme='light'] .nrs-related-card,
    html[data-theme='light'] .blog-card-modern,
    html[data-theme='light'] .achieve-item,
    html[data-theme='light'] .case-hero-img-container,
    html[data-theme='light'] .blog-hero-img-container,
    html[data-theme='light'] .site-footer {
      background: transparent !important;
      background-color: transparent !important;
      background-image: none !important;
      box-shadow: none !important;
      filter: none !important;
      border-color: #E5E5E5 !important;
    }

    html[data-theme='light'] h1,
    html[data-theme='light'] h2,
    html[data-theme='light'] h3,
    html[data-theme='light'] h4,
    html[data-theme='light'] h5,
    html[data-theme='light'] h6,
    html[data-theme='light'] a,
    html[data-theme='light'] button,
    html[data-theme='light'] .btn,
    html[data-theme='light'] .nav-link,
    html[data-theme='light'] .hero-title,
    html[data-theme='light'] .section-title,
    html[data-theme='light'] .w-title {
      color: #1A1A1A !important;
    }

    html[data-theme='light'] p,
    html[data-theme='light'] li,
    html[data-theme='light'] label,
    html[data-theme='light'] small,
    html[data-theme='light'] .body-large,
    html[data-theme='light'] .section-lead,
    html[data-theme='light'] .card-summary,
    html[data-theme='light'] .w-summary {
      color: #555555 !important;
    }

    html[data-theme='light'] .eyebrow,
    html[data-theme='light'] .meta-text,
    html[data-theme='light'] .w-date,
    html[data-theme='light'] .case-label,
    html[data-theme='light'] .nrs-card-kicker,
    html[data-theme='light'] .badge-pill,
    html[data-theme='light'] .link-pill,
    html[data-theme='light'] .tag,
    html[data-theme='light'] .pill,
    html[data-theme='light'] .hero-proof-strip span,
    html[data-theme='light'] .nrs-blog-tags b {
      color: #555555 !important;
    }

    html[data-theme='light'] .nav-pill,
    html[data-theme='light'] .theme-toggle-btn,
    html[data-theme='light'] .mobile-logo,
    html[data-theme='light'] .mobile-nav-toggle,
    html[data-theme='light'] .mobile-nav-overlay,
    html[data-theme='light'] .btn-secondary,
    html[data-theme='light'] .badge-pill,
    html[data-theme='light'] .link-pill,
    html[data-theme='light'] .filter-btn,
    html[data-theme='light'] .tag,
    html[data-theme='light'] .pill,
    html[data-theme='light'] .hero-proof-strip span,
    html[data-theme='light'] .nrs-blog-tags b {
      background: transparent !important;
      background-color: transparent !important;
      background-image: none !important;
      border-color: #E5E5E5 !important;
      box-shadow: none !important;
      filter: none !important;
      color: #555555 !important;
    }

    html[data-theme='light'] .nav-link:hover,
    html[data-theme='light'] .nav-link:focus-visible,
    html[data-theme='light'] .nav-link.active,
    html[data-theme='light'] .nav-link[aria-current='page'],
    html[data-theme='light'] .mobile-nav-links a:hover,
    html[data-theme='light'] .mobile-nav-links a.active,
    html[data-theme='light'] .mobile-nav-links a[aria-current='page'],
    html[data-theme='light'] .btn-primary,
    html[data-theme='light'] .footer-email-btn,
    html[data-theme='light'] .floating-resume-btn,
    html[data-theme='light'] .btn:hover,
    html[data-theme='light'] .filter-btn:hover,
    html[data-theme='light'] .filter-btn.active,
    html[data-theme='light'] .badge-pill:hover,
    html[data-theme='light'] .link-pill:hover {
      background: #444444 !important;
      background-color: #444444 !important;
      background-image: none !important;
      border-color: #444444 !important;
      color: #FFFFFF !important;
      box-shadow: none !important;
      filter: none !important;
    }

    html[data-theme='light'] input,
    html[data-theme='light'] select,
    html[data-theme='light'] textarea,
    html[data-theme='light'] .search-input {
      background: transparent !important;
      background-color: transparent !important;
      background-image: none !important;
      border-color: #E5E5E5 !important;
      color: #1A1A1A !important;
      box-shadow: none !important;
      filter: none !important;
    }

    html[data-theme='light'] input::placeholder,
    html[data-theme='light'] textarea::placeholder,
    html[data-theme='light'] .search-input::placeholder {
      color: #555555 !important;
    }

    html[data-theme='light'] input:focus,
    html[data-theme='light'] select:focus,
    html[data-theme='light'] textarea:focus,
    html[data-theme='light'] .search-input:focus {
      outline-color: #E5E5E5 !important;
      border-color: #444444 !important;
      background: transparent !important;
      color: #1A1A1A !important;
    }

    html[data-theme='light'] .w-arrow,
    html[data-theme='light'] .nrs-cursor-ring {
      background: transparent !important;
      background-color: transparent !important;
      border-color: #444444 !important;
      box-shadow: none !important;
      filter: none !important;
    }

    html[data-theme='light'] .w-arrow::before { border-color: #444444 !important; }
    html[data-theme='light'] .w-arrow::after,
    html[data-theme='light'] .nrs-cursor-dot {
      background: #444444 !important;
      background-color: #444444 !important;
      box-shadow: none !important;
      filter: none !important;
    }

    html[data-theme='light'] [style*='blue'],
    html[data-theme='light'] [style*='#1d4ed8'],
    html[data-theme='light'] [style*='29,78,216'],
    html[data-theme='light'] [style*='59,130,246'],
    html[data-theme='light'] [style*='143,180,255'] {
      color: #555555 !important;
      background: transparent !important;
      background-color: transparent !important;
      background-image: none !important;
      border-color: #E5E5E5 !important;
      box-shadow: none !important;
      filter: none !important;
    }
  `;
}


/**
 * Function contract: lockLightThemePalette
 * Purpose: Implement the lock light theme palette responsibility owned by the light palette lock browser feature.
 * Inputs: None; derives required state from its enclosing module/runtime context.
 * Side effects: reads or updates DOM/browser state
 * Returns: Undefined; the function exists for the documented side effects, validation, or orchestration.
 */
export function lockLightThemePalette() {
  ensureLightPaletteLockStyle();
  requestAnimationFrame(ensureLightPaletteLockStyle);
  window.setTimeout(ensureLightPaletteLockStyle, 0);
  window.setTimeout(ensureLightPaletteLockStyle, 250);
  window.setTimeout(ensureLightPaletteLockStyle, 700);
}
