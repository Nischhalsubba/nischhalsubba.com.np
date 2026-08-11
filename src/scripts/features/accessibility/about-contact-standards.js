/**
 * @fileoverview src/scripts/features/accessibility/about-contact-standards.js
 * Purpose: Browser runtime feature in the accessibility domain responsible for about contact standards behavior.
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
const ABOUT_CONTACT_STYLE_ID = 'nrs-about-contact-standards';

/**
 * Function contract: ensureAboutContactStyles
 * Purpose: Applies ensure about contact styles while preserving the surrounding repository/runtime contract.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may read or update browser DOM/state.
 * Returns: no explicit value unless an invoked dependency throws/rejects.
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
 * Purpose: Applies apply about contact standards while preserving the surrounding repository/runtime contract.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may read or update browser DOM/state.
 * Returns: no explicit value unless an invoked dependency throws/rejects.
 */
export function applyAboutContactStandards() {
  ensureAboutContactStyles();
  requestAnimationFrame(ensureAboutContactStyles);
  window.setTimeout(ensureAboutContactStyles, 250);
  window.setTimeout(ensureAboutContactStyles, 1000);
}
