/**
 * @fileoverview src/scripts/features/layout/layout-system-uniformity.js
 * Purpose: Implement layout system uniformity behavior inside the layout browser-runtime domain.
 * Responsibilities:
 * - Own the layout behavior represented by this module and keep unrelated domains outside the file.
 * - Read or update only the DOM/runtime state needed for this feature and preserve accessibility semantics.
 * - Expose stable initializer/helper exports consumed by runtime entrypoints or closely related features.
 * Execution context: Browser ES module loaded through the portfolio runtime.
 * Connected files:
 * - src/runtime/script.js
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
const STYLE_ID = 'nrs-layout-system-uniformity';

/**
 * Function contract: ensureUniformityStyles
 * Purpose: Apply uniformity styles consistently while preserving the surrounding layout system uniformity browser feature contract.
 * Inputs: None; derives required state from the enclosing module/runtime context.
 * Side effects: reads or updates DOM/browser state.
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
 */
function ensureUniformityStyles() {
  let style = document.getElementById(STYLE_ID);
  if (!style) {
    style = document.createElement('style');
    style.id = STYLE_ID;
    document.head.appendChild(style);
  }

  style.textContent = `
    :root {
      --page-max: 1480px !important;
      --case-max: 1180px !important;
      --read-max: 820px !important;
      --pad-x: clamp(24px, 5vw, 96px) !important;
      --nrs-site-width: min(1480px, calc(100vw - var(--pad-x) * 2)) !important;
      --nrs-readable-width: min(820px, 100%) !important;
      --radius-card: 22px !important;
      --radius-control: 999px !important;
      --radius-shell: 34px !important;
      --component-gap: clamp(20px, 2.4vw, 34px) !important;
      --section-gap: clamp(48px, 6vw, 88px) !important;
      --section-y: clamp(68px, 7vw, 112px) !important;
      --card-padding: clamp(24px, 2.6vw, 38px) !important;
    }

    .container,
    main.container,
    .nrs-uniform-shell .container,
    .nrs-uniform-shell main.container,
    .site-footer > .container {
      width: var(--nrs-site-width) !important;
      max-width: var(--nrs-site-width) !important;
      margin-left: auto !important;
      margin-right: auto !important;
    }

    .section-container,
    .nrs-case-section,
    .nrs-services-section,
    main:has(.case-hero-img-container) .section-container.reveal-on-scroll:not(#proof) {
      padding-top: var(--section-y) !important;
      padding-bottom: var(--section-y) !important;
      border-top: 1px solid var(--border-faint) !important;
    }

    .hero-section {
      padding-top: clamp(120px, 11vw, 172px) !important;
      padding-bottom: clamp(52px, 7vw, 96px) !important;
    }

    .hero-title,
    h1.hero-title {
      max-width: min(1060px, 100%) !important;
    }

    .body-large,
    .section-lead {
      max-width: min(820px, 100%) !important;
    }

    .section-header {
      max-width: min(920px, 100%) !important;
    }

    .nav-wrapper {
      width: max-content !important;
      max-width: calc(100vw - 32px) !important;
    }

    .nav-pill {
      gap: 5px !important;
      padding: 7px !important;
      border-radius: 999px !important;
    }

    .nav-link {
      min-height: 40px !important;
      padding: 0 clamp(13px, 1.1vw, 18px) !important;
      border-radius: 999px !important;
      white-space: nowrap !important;
    }

    .btn,
    .btn-primary,
    .btn-secondary,
    .footer-email-btn,
    .floating-resume-btn,
    .filter-btn,
    .link-pill,
    .badge-pill,
    .tag,
    .pill,
    .hero-proof-strip span,
    .nrs-blog-tags b {
      border-radius: 999px !important;
    }

    .btn,
    .btn-primary,
    .btn-secondary,
    .footer-email-btn {
      min-height: 48px !important;
      padding-inline: 22px !important;
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
    .prototype-link-card,
    .embed-frame-wrapper,
    .nrs-case-proof,
    .snapshot-grid,
    .case-list li,
    .clarity-row-list article,
    .nrs-blog-proof-grid article,
    .nrs-related-card {
      border-radius: var(--radius-card) !important;
      border-color: var(--border-faint) !important;
    }

    .impact-summary-grid,
    .project-grid,
    .journey-grid,
    .nrs-blog-proof-grid,
    .prototype-link-list,
    .clarity-row-list,
    .writing-list,
    .case-list {
      gap: var(--component-gap) !important;
    }

    .project-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
    }

    .impact-summary-grid,
    .nrs-blog-proof-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
    }

    .journey-grid,
    .prototype-link-list {
      grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
    }

    .writing-item {
      grid-template-columns: 170px minmax(0, 1fr) 38px !important;
    }

    body.nrs-services-redesign main.container {
      width: min(1520px, calc(100vw - clamp(48px, 7vw, 144px))) !important;
      max-width: min(1520px, calc(100vw - clamp(48px, 7vw, 144px))) !important;
    }

    body.nrs-services-redesign .nrs-services-shell {
      padding-top: clamp(132px, 11vw, 176px) !important;
      padding-bottom: clamp(78px, 8vw, 118px) !important;
    }

    body.nrs-services-redesign .nrs-services-hero {
      grid-template-columns: minmax(0, 1.08fr) minmax(360px, .92fr) !important;
      gap: clamp(48px, 6.5vw, 110px) !important;
      align-items: center !important;
    }

    body.nrs-services-redesign .nrs-services-title {
      max-width: 880px !important;
      font-size: clamp(4.2rem, 6.8vw, 8rem) !important;
      line-height: .9 !important;
      letter-spacing: 0!important;
    }

    body.nrs-services-redesign .nrs-services-lead {
      max-width: 780px !important;
      font-size: clamp(1.05rem, 1.08vw, 1.22rem) !important;
    }

    body.nrs-services-redesign .nrs-services-panel {
      max-width: 560px !important;
      justify-self: end !important;
    }

    body.nrs-services-redesign .nrs-services-panel h2 {
      max-width: 470px !important;
      font-size: clamp(2.2rem, 2.9vw, 3.75rem) !important;
    }

    body.nrs-services-redesign .nrs-services-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
      gap: var(--component-gap) !important;
    }

    body.nrs-services-redesign .nrs-service-card,
    body.nrs-services-redesign .nrs-services-panel,
    body.nrs-services-redesign .nrs-services-fit-card,
    body.nrs-services-redesign .nrs-services-cta {
      border-radius: var(--radius-shell) !important;
    }

    body.nrs-services-redesign .nrs-service-card {
      min-height: clamp(300px, 22vw, 360px) !important;
    }

    body.nrs-services-redesign .nrs-services-process {
      grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
    }

    @media (max-width: 1180px) {
      :root {
        --pad-x: clamp(22px, 4vw, 56px) !important;
      }

      .impact-summary-grid,
      .journey-grid,
      .prototype-link-list,
      body.nrs-services-redesign .nrs-services-grid,
      body.nrs-services-redesign .nrs-services-process {
        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
      }

      body.nrs-services-redesign .nrs-services-hero {
        grid-template-columns: 1fr !important;
      }

      body.nrs-services-redesign .nrs-services-panel {
        max-width: none !important;
        justify-self: stretch !important;
      }
    }

    @media (max-width: 760px) {
      :root {
        --pad-x: 20px !important;
        --section-y: clamp(48px, 10vw, 70px) !important;
      }

      .nav-wrapper {
        display: none !important;
      }

      .project-grid,
      .impact-summary-grid,
      .journey-grid,
      .nrs-blog-proof-grid,
      .prototype-link-list,
      .case-list,
      body.nrs-services-redesign .nrs-services-grid,
      body.nrs-services-redesign .nrs-services-process,
      body.nrs-services-redesign .nrs-services-proof,
      body.nrs-services-redesign .nrs-services-fit,
      body.nrs-services-redesign .nrs-services-section-head,
      body.nrs-services-redesign .nrs-services-list li {
        grid-template-columns: 1fr !important;
      }

      .writing-item,
      .writing-list[data-blog-posts] .writing-item {
        grid-template-columns: 1fr !important;
      }

      body.nrs-services-redesign .nrs-services-title {
        font-size: clamp(3.1rem, 15vw, 5.1rem) !important;
      }

      body.nrs-services-redesign main.container {
        width: calc(100vw - 40px) !important;
        max-width: calc(100vw - 40px) !important;
      }
    }
  `;
}

/**
 * Function contract: applyLayoutSystemUniformity
 * Purpose: Apply layout system uniformity consistently while preserving the surrounding layout system uniformity browser feature contract.
 * Inputs: None; derives required state from the enclosing module/runtime context.
 * Side effects: reads or updates DOM/browser state.
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
 */
export function applyLayoutSystemUniformity() {
  ensureUniformityStyles();
  requestAnimationFrame(ensureUniformityStyles);
  window.setTimeout(ensureUniformityStyles, 250);
  window.setTimeout(ensureUniformityStyles, 1000);
}
