/**
 * @fileoverview src/scripts/features/layout/section-rhythm-fix.js
 * Purpose: Implement section rhythm fix behavior inside the layout browser-runtime domain.
 * Responsibilities:
 * - Own the layout behavior represented by this module and keep unrelated domains outside the file.
 * - Read or update only the DOM/runtime state needed for this feature and preserve accessibility semantics.
 * - Expose stable initializer/helper exports consumed by runtime entrypoints or closely related features.
 * Execution context: Browser ES module loaded through the portfolio runtime.
 * Connected files:
 * - src/runtime/script.js
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
const SECTION_RHYTHM_STYLE_ID = 'nrs-section-rhythm-fix';


/**
 * Function contract: ensureSectionRhythmStyles
 * Purpose: Apply section rhythm styles consistently while preserving the surrounding section rhythm fix browser feature contract.
 * Inputs: None; derives required state from its enclosing module/runtime context.
 * Side effects: reads or updates DOM/browser state
 * Returns: Undefined; the function exists for the documented side effects, validation, or orchestration.
 */
function ensureSectionRhythmStyles() {
  let style = document.getElementById(SECTION_RHYTHM_STYLE_ID);
  if (!style) {
    style = document.createElement('style');
    style.id = SECTION_RHYTHM_STYLE_ID;
    document.head.appendChild(style);
  }

  style.textContent = `
    :root {
      --nrs-title-grid-gap: clamp(34px, 4.2vw, 58px);
      --nrs-label-title-gap: clamp(10px, 1.3vw, 16px);
      --nrs-section-header-gap: clamp(26px, 3.2vw, 42px);
    }

    .section-container,
    .nrs-about-redesign .section-container,
    .nrs-contact-redesign .section-container,
    main:has(.case-hero-img-container) .section-container {
      overflow: visible !important;
    }

    .case-label,
    .section-container > .eyebrow,
    .section-header > .eyebrow {
      display: inline-flex !important;
      margin-top: 0 !important;
      margin-bottom: var(--nrs-label-title-gap) !important;
    }

    .case-label + .section-title,
    .section-container > .eyebrow + .section-title,
    .section-header > .eyebrow + .section-title {
      margin-top: 0 !important;
      margin-bottom: 0 !important;
    }

    .section-title,
    .nrs-project-detail-page .section-title,
    main:has(.case-hero-img-container) .section-title {
      display: block !important;
      clear: both !important;
      margin-top: 0 !important;
      margin-bottom: 0 !important;
      padding-bottom: 0 !important;
      position: relative !important;
      z-index: 2 !important;
      background: var(--bg-primary) !important;
    }

    html[data-theme='light'] .section-title {
      background: var(--bg-primary) !important;
    }

    .section-header {
      margin-bottom: var(--nrs-section-header-gap) !important;
    }

    .section-header + :where(
      .case-list,
      .outcome-list,
      .nrs-outcome-list,
      .journey-grid,
      .prototype-link-list,
      .clarity-row-list,
      .writing-list,
      .project-grid,
      .impact-summary-grid,
      .snapshot-grid,
      .nrs-blog-proof-grid,
      .nrs-proof-grid
    ) {
      margin-top: 0 !important;
      margin-block-start: 0 !important;
    }

    .section-title + :where(
      .case-list,
      .outcome-list,
      .nrs-outcome-list,
      .journey-grid,
      .prototype-link-list,
      .clarity-row-list,
      .writing-list,
      .project-grid,
      .impact-summary-grid,
      .snapshot-grid,
      .nrs-blog-proof-grid,
      .nrs-proof-grid
    ),
    .case-label + .section-title + :where(
      .case-list,
      .outcome-list,
      .nrs-outcome-list,
      .journey-grid,
      .prototype-link-list,
      .clarity-row-list,
      .writing-list,
      .project-grid,
      .impact-summary-grid,
      .snapshot-grid,
      .nrs-blog-proof-grid,
      .nrs-proof-grid
    ),
    .section-container > .eyebrow + .section-title + :where(
      .case-list,
      .outcome-list,
      .nrs-outcome-list,
      .journey-grid,
      .prototype-link-list,
      .clarity-row-list,
      .writing-list,
      .project-grid,
      .impact-summary-grid,
      .snapshot-grid,
      .nrs-blog-proof-grid,
      .nrs-proof-grid
    ),
    .body-large + :where(
      .case-list,
      .outcome-list,
      .nrs-outcome-list,
      .journey-grid,
      .prototype-link-list,
      .clarity-row-list,
      .writing-list,
      .project-grid,
      .impact-summary-grid,
      .snapshot-grid,
      .nrs-blog-proof-grid,
      .nrs-proof-grid
    ),
    .section-lead + :where(
      .case-list,
      .outcome-list,
      .nrs-outcome-list,
      .journey-grid,
      .prototype-link-list,
      .clarity-row-list,
      .writing-list,
      .project-grid,
      .impact-summary-grid,
      .snapshot-grid,
      .nrs-blog-proof-grid,
      .nrs-proof-grid
    ) {
      margin-top: var(--nrs-title-grid-gap) !important;
      margin-block-start: var(--nrs-title-grid-gap) !important;
    }

    .section-container > :where(
      .case-list,
      .outcome-list,
      .nrs-outcome-list,
      .journey-grid,
      .prototype-link-list,
      .clarity-row-list,
      .writing-list,
      .project-grid,
      .impact-summary-grid,
      .snapshot-grid,
      .nrs-blog-proof-grid,
      .nrs-proof-grid
    ):not(:first-child):not(.section-header + *) {
      margin-top: var(--nrs-title-grid-gap) !important;
      margin-block-start: var(--nrs-title-grid-gap) !important;
    }

    .case-list,
    .outcome-list,
    .nrs-outcome-list,
    .journey-grid,
    .prototype-link-list,
    .clarity-row-list,
    .writing-list,
    .project-grid,
    .impact-summary-grid,
    .snapshot-grid,
    .nrs-blog-proof-grid,
    .nrs-proof-grid {
      position: relative !important;
      z-index: 0 !important;
      border-top: 0 !important;
      padding-top: 0 !important;
    }

    .case-list,
    .outcome-list,
    .nrs-outcome-list {
      padding-top: 0 !important;
    }

    .case-list::before,
    .case-list::after,
    .outcome-list::before,
    .outcome-list::after,
    .nrs-outcome-list::before,
    .nrs-outcome-list::after {
      display: none !important;
      content: none !important;
      border: 0 !important;
    }

    .section-container > :where(.case-list, .outcome-list, .nrs-outcome-list, .journey-grid, .prototype-link-list, .clarity-row-list, .writing-list, .project-grid, .impact-summary-grid, .snapshot-grid, .nrs-blog-proof-grid, .nrs-proof-grid):first-child {
      margin-top: 0 !important;
      margin-block-start: 0 !important;
    }

    @media (max-width: 760px) {
      :root {
        --nrs-title-grid-gap: clamp(26px, 7vw, 40px);
        --nrs-section-header-gap: 26px;
      }
    }
  `;
}


/**
 * Function contract: fixSectionRhythm
 * Purpose: Implement the fix section rhythm responsibility owned by the section rhythm fix browser feature.
 * Inputs: None; derives required state from its enclosing module/runtime context.
 * Side effects: reads or updates DOM/browser state
 * Returns: Undefined; the function exists for the documented side effects, validation, or orchestration.
 */
export function fixSectionRhythm() {
  ensureSectionRhythmStyles();
  requestAnimationFrame(ensureSectionRhythmStyles);
  window.setTimeout(ensureSectionRhythmStyles, 250);
  window.setTimeout(ensureSectionRhythmStyles, 1000);
}
