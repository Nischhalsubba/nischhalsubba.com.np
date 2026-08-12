/**
 * @fileoverview src/scripts/features/layout/typography-refinement.js
 * Purpose: Implement typography refinement behavior inside the layout browser-runtime domain.
 * Responsibilities:
 * - Own the layout behavior represented by this module and keep unrelated domains outside the file.
 * - Read or update only the DOM/runtime state needed for this feature and preserve accessibility semantics.
 * - Expose stable initializer/helper exports consumed by runtime entrypoints or closely related features.
 * Execution context: Browser ES module loaded through the portfolio runtime.
 * Connected files:
 * - src/runtime/script.js
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
const STYLE_ID = 'nrs-typography-refinement-style';


/**
 * Function contract: applyTypographyRefinement
 * Purpose: Apply typography refinement consistently while preserving the surrounding typography refinement browser feature contract.
 * Inputs: None; derives required state from its enclosing module/runtime context.
 * Side effects: reads or updates DOM/browser state
 * Returns: Undefined; the function exists for the documented side effects, validation, or orchestration.
 */
export function applyTypographyRefinement() {
  if (document.getElementById(STYLE_ID)) return;

  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    h1, h2, h3, h4, h5, h6,
    .hero-title,
    .section-title,
    .w-title,
    .card-content h3,
    .journey-card h3,
    .clarity-row-list h3,
    .clarity-steps h3,
    .btn,
    .nav-link,
    .filter-btn,
    .badge-pill,
    .link-pill,
    .eyebrow,
    .meta-text,
    .w-date,
    .card-meta-line,
    .case-label,
    .nrs-card-kicker {
      letter-spacing: 0 !important;
    }

    .nrs-blog-detail-page article.section-container > h1,
    .nrs-blog-detail-page article.section-container > .hero-title,
    .nrs-blog-detail-page .nrs-article-frame > h1,
    .nrs-blog-detail-page .nrs-article-frame > .hero-title {
      max-width: 980px !important;
      line-height: .98 !important;
      text-wrap: balance;
    }

    .nrs-blog-detail-page article.section-container > p,
    .nrs-blog-detail-page article.section-container li,
    .nrs-blog-detail-page .blog-prose p,
    .nrs-blog-detail-page .blog-prose li,
    .nrs-blog-detail-page .body-large p {
      max-width: 760px !important;
      font-size: clamp(1rem, 1.05vw, 1.125rem) !important;
      line-height: 1.78 !important;
      letter-spacing: 0 !important;
    }

    .nrs-blog-detail-page article.section-container > h2,
    .nrs-blog-detail-page .blog-prose h2,
    .nrs-blog-detail-page .body-large h3 {
      max-width: 760px !important;
      margin-top: clamp(44px, 6vw, 76px) !important;
      margin-bottom: clamp(14px, 2vw, 22px) !important;
      line-height: 1.14 !important;
      text-wrap: balance;
    }
  `;

  document.head.appendChild(style);
}
