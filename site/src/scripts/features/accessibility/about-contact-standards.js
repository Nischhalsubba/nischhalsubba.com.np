/**
 * @fileoverview src/scripts/features/accessibility/about-contact-standards.js
 * Purpose: Implement about contact standards behavior inside the accessibility browser-runtime domain.
 * Responsibilities:
 * - Own the accessibility behavior represented by this module and keep unrelated domains outside the file.
 * - Read or update only the DOM/runtime state needed for this feature and preserve accessibility semantics.
 * - Expose stable initializer/helper exports consumed by runtime entrypoints or closely related features.
 * Execution context: Browser ES module loaded through the portfolio runtime.
 * Connected files:
 * - src/runtime/script.js
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
const ABOUT_CONTACT_STYLE_ID = 'nrs-about-contact-standards';


/**
 * Function contract: ensureAboutContactStyles
 * Purpose: Apply about contact styles consistently while preserving the surrounding about contact standards browser feature contract.
 * Inputs: None; derives required state from its enclosing module/runtime context.
 * Side effects: reads or updates DOM/browser state
 * Returns: Undefined; the function exists for the documented side effects, validation, or orchestration.
 */
function ensureAboutContactStyles() {
  let style = document.getElementById(ABOUT_CONTACT_STYLE_ID);
  if (!style) {
    style = document.createElement('style');
    style.id = ABOUT_CONTACT_STYLE_ID;
    document.head.appendChild(style);
  }

  style.textContent = `
    .nrs-about-redesign,
    .nrs-contact-redesign {
      max-width: min(1160px, calc(100vw - var(--pad-x) * 2)) !important;
    }

    .nrs-about-redesign .hero-section,
    .nrs-contact-redesign .hero-section {
      max-width: 980px !important;
      margin-inline: auto !important;
    }

    .nrs-about-redesign .section-container,
    .nrs-contact-redesign .section-container {
      max-width: var(--case-max) !important;
      margin-inline: auto !important;
      padding-block: clamp(52px, 7vw, 88px) !important;
    }

    .nrs-about-redesign .section-container:first-of-type,
    .nrs-contact-redesign .section-container:first-of-type {
      padding-top: 0 !important;
    }

    .nrs-about-redesign .section-header,
    .nrs-contact-redesign .section-header {
      display: grid !important;
      gap: 14px !important;
    }

    .nrs-about-redesign .section-title,
    .nrs-contact-redesign .section-title {
      margin: 0 !important;
    }

    .nrs-about-redesign .section-lead,
    .nrs-contact-redesign .section-lead {
      margin: 0 !important;
      max-width: 760px !important;
      color: var(--text-secondary) !important;
    }

    .nrs-contact-redesign .contact-layout {
      display: grid !important;
      grid-template-columns: minmax(260px, 0.72fr) minmax(420px, 1.28fr) !important;
      gap: clamp(28px, 5vw, 72px) !important;
      align-items: start !important;
    }

    .nrs-contact-redesign aside {
      position: sticky !important;
      top: 104px !important;
      display: grid !important;
      gap: var(--component-gap) !important;
    }

    .nrs-contact-redesign .contact-form {
      width: 100% !important;
      max-width: 100% !important;
      padding: clamp(24px, 3vw, 36px) !important;
      display: grid !important;
      gap: 18px !important;
    }

    .nrs-contact-redesign .contact-form .form-grid,
    .nrs-contact-redesign .contact-form .form-grid-single {
      display: grid !important;
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
      gap: 16px !important;
      margin: 0 !important;
    }

    .nrs-contact-redesign .contact-form .form-field {
      display: grid !important;
      gap: 8px !important;
      margin: 0 !important;
    }

    .nrs-contact-redesign .contact-form textarea {
      min-height: 180px !important;
    }

    .nrs-contact-redesign .form-note {
      margin: 0 !important;
      color: var(--text-tertiary) !important;
      line-height: 1.55 !important;
    }

    .nrs-contact-redesign .form-actions {
      display: grid !important;
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
      gap: 12px !important;
      margin: 0 !important;
    }

    .nrs-about-redesign .snapshot-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
    }

    .nrs-about-redesign .prototype-link-list {
      display: grid !important;
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
      gap: var(--component-gap) !important;
    }

    .nav-link.active,
    .mobile-nav-links a.active,
    .footer-col a.active,
    .nav-link[aria-current='page'],
    .mobile-nav-links a[aria-current='page'] {
      color: var(--text-primary) !important;
      background: var(--card-bg-hover) !important;
      border-color: var(--card-border-hover) !important;
    }

    @media (max-width: 980px) {
      .nrs-contact-redesign .contact-layout {
        grid-template-columns: 1fr !important;
      }

      .nrs-contact-redesign aside {
        position: static !important;
      }

      .nrs-about-redesign .snapshot-grid,
      .nrs-about-redesign .prototype-link-list {
        grid-template-columns: 1fr !important;
      }
    }

    @media (max-width: 720px) {
      .nrs-contact-redesign .contact-form .form-grid,
      .nrs-contact-redesign .contact-form .form-grid-single,
      .nrs-contact-redesign .form-actions {
        grid-template-columns: 1fr !important;
      }

      .nrs-about-redesign .hero-section,
      .nrs-contact-redesign .hero-section {
        padding-top: 118px !important;
        padding-bottom: 36px !important;
      }
    }
  `;
}


/**
 * Function contract: applyAboutContactStandards
 * Purpose: Apply about contact standards consistently while preserving the surrounding about contact standards browser feature contract.
 * Inputs: None; derives required state from its enclosing module/runtime context.
 * Side effects: reads or updates DOM/browser state
 * Returns: Undefined; the function exists for the documented side effects, validation, or orchestration.
 */
export function applyAboutContactStandards() {
  ensureAboutContactStyles();
  requestAnimationFrame(ensureAboutContactStyles);
  window.setTimeout(ensureAboutContactStyles, 250);
  window.setTimeout(ensureAboutContactStyles, 1000);
}
