/**
 * @fileoverview src/scripts/features/content/list-spacing.js
 * Purpose: Implement list spacing behavior inside the content browser-runtime domain.
 * Responsibilities:
 * - Own the content behavior represented by this module and keep unrelated domains outside the file.
 * - Read or update only the DOM/runtime state needed for this feature and preserve accessibility semantics.
 * - Expose stable initializer/helper exports consumed by runtime entrypoints or closely related features.
 * Execution context: Browser ES module loaded through the portfolio runtime.
 * Connected files:
 * - src/runtime/script.js
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
/**
 * Function contract: ensureListSpacingStyle
 * Purpose: Apply list spacing style consistently while preserving the surrounding list spacing browser feature contract.
 * Inputs: None; derives required state from the enclosing module/runtime context.
 * Side effects: reads or updates DOM/browser state.
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
 */
function ensureListSpacingStyle() {
  let style = document.getElementById('nrs-list-spacing-polish');
  if (!style) {
    style = document.createElement('style');
    style.id = 'nrs-list-spacing-polish';
    document.head.appendChild(style);
  }

  style.textContent = `
    :root {
      --nrs-section-content-gap: clamp(38px, 5.4vw, 72px);
      --nrs-section-content-gap-compact: clamp(24px, 3.4vw, 44px);
    }

    .case-list,
    .outcome-list,
    .nrs-outcome-list {
      display: grid !important;
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
      gap: clamp(16px, 2.4vw, 30px) !important;
      padding: 0 !important;
      margin: 0 !important;
      margin-top: var(--nrs-section-content-gap) !important;
      list-style: none !important;
    }

    .section-container > :where(.case-list, .outcome-list, .nrs-outcome-list, .journey-grid, .prototype-link-list, .clarity-row-list, .writing-list),
    .section-title + :where(.case-list, .outcome-list, .nrs-outcome-list, .journey-grid, .prototype-link-list, .clarity-row-list, .writing-list),
    .body-large + :where(.case-list, .outcome-list, .nrs-outcome-list, .journey-grid, .prototype-link-list, .clarity-row-list, .writing-list),
    .section-lead + :where(.case-list, .outcome-list, .nrs-outcome-list, .journey-grid, .prototype-link-list, .clarity-row-list, .writing-list) {
      margin-top: var(--nrs-section-content-gap) !important;
    }

    .section-container > .section-header + :where(.case-list, .outcome-list, .nrs-outcome-list, .journey-grid, .prototype-link-list, .clarity-row-list, .writing-list),
    .case-label + .section-title + :where(.case-list, .outcome-list, .nrs-outcome-list, .journey-grid, .prototype-link-list, .clarity-row-list, .writing-list) {
      margin-top: var(--nrs-section-content-gap) !important;
    }

    main:has(.case-hero-img-container) .section-container {
      scroll-margin-top: 120px;
    }

    main:has(.case-hero-img-container) .section-container > .section-title,
    .nrs-project-detail-page .section-container > .section-title {
      margin-bottom: 0 !important;
    }

    main:has(.case-hero-img-container) .section-container > .body-large,
    .nrs-project-detail-page .section-container > .body-large {
      margin-top: var(--space-5) !important;
      margin-bottom: 0 !important;
    }

    main:has(.case-hero-img-container) .section-container > .body-large + :where(.case-list, .journey-grid, .prototype-link-list),
    .nrs-project-detail-page .section-container > .body-large + :where(.case-list, .journey-grid, .prototype-link-list) {
      margin-top: var(--nrs-section-content-gap-compact) !important;
    }

    .case-list li,
    .outcome-list li,
    .nrs-outcome-list li {
      position: relative !important;
      display: flex !important;
      align-items: center !important;
      min-height: clamp(94px, 9vw, 124px) !important;
      padding: clamp(26px, 3.2vw, 38px) clamp(34px, 4vw, 56px) clamp(26px, 3.2vw, 38px) clamp(58px, 5.2vw, 82px) !important;
      border: 1px solid var(--border-faint) !important;
      border-radius: 0 !important;
      line-height: 1.65 !important;
      overflow-wrap: anywhere !important;
      background: transparent !important;
      background-color: transparent !important;
      background-image: none !important;
      box-shadow: none !important;
      filter: none !important;
    }

    .case-list li::before,
    .outcome-list li::before,
    .nrs-outcome-list li::before {
      left: clamp(24px, 2.6vw, 34px) !important;
      top: 50% !important;
      transform: translateY(-50%) !important;
      width: 8px !important;
      height: 8px !important;
      box-shadow: none !important;
    }

    .case-list li > *,
    .outcome-list li > *,
    .nrs-outcome-list li > * {
      margin-top: 0 !important;
      margin-bottom: 0 !important;
    }

    .prototype-link-list,
    main:has(.case-hero-img-container) .journey-grid,
    .nrs-project-detail-page .journey-grid,
    .clarity-row-list,
    .writing-list {
      padding: 0 !important;
    }

    main:has(.case-hero-img-container) .journey-grid,
    .nrs-project-detail-page .journey-grid {
      margin-top: var(--nrs-section-content-gap) !important;
    }

    @media (max-width: 860px) {
      :root {
        --nrs-section-content-gap: clamp(26px, 7vw, 42px);
        --nrs-section-content-gap-compact: clamp(20px, 6vw, 32px);
      }

      .case-list,
      .outcome-list,
      .nrs-outcome-list {
        grid-template-columns: 1fr !important;
        gap: 14px !important;
      }

      .case-list li,
      .outcome-list li,
      .nrs-outcome-list li {
        min-height: auto !important;
        padding: 22px 24px 22px 52px !important;
      }

      .case-list li::before,
      .outcome-list li::before,
      .nrs-outcome-list li::before {
        left: 24px !important;
      }
    }
  `;
}

/**
 * Function contract: polishListSpacing
 * Purpose: Apply list spacing consistently while preserving the surrounding list spacing browser feature contract.
 * Inputs: None; derives required state from the enclosing module/runtime context.
 * Side effects: reads or updates DOM/browser state.
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
 */
export function polishListSpacing() {
  ensureListSpacingStyle();
  requestAnimationFrame(ensureListSpacingStyle);
  window.setTimeout(ensureListSpacingStyle, 250);
}
