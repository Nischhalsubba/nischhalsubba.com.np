/**
 * @fileoverview src/scripts/features/layout/contact-page-polish.js
 * Purpose: Implement contact page polish behavior inside the layout browser-runtime domain.
 * Responsibilities:
 * - Own the layout behavior represented by this module and keep unrelated domains outside the file.
 * - Read or update only the DOM/runtime state needed for this feature and preserve accessibility semantics.
 * - Expose stable initializer/helper exports consumed by runtime entrypoints or closely related features.
 * Execution context: Browser ES module loaded through the portfolio runtime.
 * Connected files:
 * - src/runtime/script.js
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
/**
 * Function contract: ensureContactPagePolishStyle
 * Purpose: Apply contact page polish style consistently while preserving the surrounding contact page polish browser feature contract.
 * Inputs: None; derives required state from the enclosing module/runtime context.
 * Side effects: reads or updates DOM/browser state.
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
 */
function ensureContactPagePolishStyle() {
  let style = document.getElementById('nrs-contact-page-polish');
  if (!style) {
    style = document.createElement('style');
    style.id = 'nrs-contact-page-polish';
    document.head.appendChild(style);
  }

  style.textContent = `
    .contact-layout {
      display: grid !important;
      grid-template-columns: minmax(120px, 0.22fr) minmax(0, 1fr) !important;
      column-gap: clamp(24px, 5vw, 76px) !important;
      align-items: start !important;
      width: 100% !important;
    }

    .contact-layout .clarity-section-label {
      min-width: 0 !important;
    }

    .contact-layout .clarity-section-body {
      display: grid !important;
      grid-template-columns: minmax(260px, 0.62fr) minmax(460px, 0.9fr) !important;
      column-gap: clamp(36px, 6vw, 92px) !important;
      row-gap: clamp(22px, 3vw, 34px) !important;
      align-items: start !important;
      justify-content: space-between !important;
      width: 100% !important;
      min-width: 0 !important;
    }

    .contact-layout .clarity-section-body > .section-title,
    .contact-layout .clarity-section-body > .section-lead {
      grid-column: 1 !important;
      max-width: 390px !important;
      margin-inline: 0 !important;
    }

    .contact-layout .clarity-section-body > .section-title {
      margin-bottom: clamp(18px, 2.6vw, 30px) !important;
      text-wrap: balance !important;
    }

    .contact-layout .clarity-section-body > .section-lead {
      margin-top: 0 !important;
      line-height: 1.72 !important;
    }

    .contact-layout .contact-form {
      grid-column: 2 !important;
      grid-row: 1 / span 3 !important;
      display: grid !important;
      gap: clamp(20px, 2.4vw, 28px) !important;
      width: min(100%, 620px) !important;
      max-width: 620px !important;
      min-width: 0 !important;
      justify-self: end !important;
      margin: 0 !important;
      padding: clamp(30px, 4vw, 50px) !important;
      border: 1px solid var(--border-faint) !important;
      border-radius: clamp(22px, 2.8vw, 34px) !important;
      background: transparent !important;
      background-color: transparent !important;
      background-image: none !important;
      box-shadow: none !important;
      filter: none !important;
    }

    .contact-form .form-grid {
      display: grid !important;
      grid-template-columns: 1fr !important;
      gap: clamp(18px, 2.2vw, 26px) !important;
      margin: 0 !important;
      width: 100% !important;
    }

    .contact-form .form-field,
    .contact-form > .form-field {
      display: grid !important;
      gap: 10px !important;
      min-width: 0 !important;
      margin: 0 !important;
      color: var(--text-secondary) !important;
      font-weight: 750 !important;
      line-height: 1.35 !important;
    }

    .contact-form input,
    .contact-form select,
    .contact-form textarea {
      display: block !important;
      width: 100% !important;
      max-width: 100% !important;
      min-width: 0 !important;
      min-height: 58px !important;
      border: 1px solid var(--border-faint) !important;
      border-radius: 999px !important;
      padding: 16px 22px !important;
      background: transparent !important;
      background-color: transparent !important;
      color: var(--text-primary) !important;
      font: inherit !important;
      line-height: 1.45 !important;
      box-shadow: none !important;
      filter: none !important;
    }

    .contact-form input::placeholder,
    .contact-form textarea::placeholder {
      white-space: normal !important;
      text-overflow: clip !important;
    }

    .contact-form select {
      padding-right: 46px !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
    }

    .contact-form textarea {
      min-height: clamp(220px, 28vw, 330px) !important;
      resize: vertical !important;
      border-radius: 28px !important;
      padding: 22px 24px !important;
    }

    .contact-form input:focus,
    .contact-form select:focus,
    .contact-form textarea:focus {
      outline: 3px solid var(--border-faint) !important;
      outline-offset: 3px !important;
      border-color: var(--border-strong) !important;
    }

    .contact-form .form-actions {
      display: grid !important;
      grid-template-columns: 1fr !important;
      gap: 14px !important;
      align-items: stretch !important;
      margin-top: 0 !important;
      width: 100% !important;
    }

    .contact-form .form-actions .btn,
    .contact-form .form-actions a.btn,
    .contact-form .form-actions button.btn {
      width: 100% !important;
      min-width: 0 !important;
      min-height: 54px !important;
    }

    .contact-form .form-status {
      min-height: 1.4em !important;
      margin-top: 0 !important;
      color: var(--text-secondary) !important;
      font-weight: 700 !important;
    }

    .contact-form .form-status[data-tone='success'] {
      color: var(--text-primary) !important;
    }

    .contact-form .form-status[data-tone='error'] {
      color: var(--text-secondary) !important;
    }

    html[data-theme='light'] .contact-form,
    html[data-theme='light'] .contact-form input,
    html[data-theme='light'] .contact-form select,
    html[data-theme='light'] .contact-form textarea {
      background: transparent !important;
      background-color: transparent !important;
      background-image: none !important;
      border-color: #E5E5E5 !important;
      box-shadow: none !important;
      filter: none !important;
    }

    html[data-theme='light'] .contact-form input:focus,
    html[data-theme='light'] .contact-form select:focus,
    html[data-theme='light'] .contact-form textarea:focus {
      border-color: #444444 !important;
      outline-color: #E5E5E5 !important;
    }

    @media (max-width: 1120px) {
      .contact-layout {
        grid-template-columns: 1fr !important;
        row-gap: 18px !important;
      }

      .contact-layout .clarity-section-body {
        grid-template-columns: 1fr !important;
      }

      .contact-layout .contact-form,
      .contact-layout .clarity-section-body > .section-title,
      .contact-layout .clarity-section-body > .section-lead {
        grid-column: 1 !important;
        grid-row: auto !important;
        max-width: 100% !important;
      }

      .contact-layout .contact-form {
        width: 100% !important;
        max-width: 760px !important;
        justify-self: stretch !important;
      }
    }

    @media (max-width: 720px) {
      .contact-layout .contact-form {
        padding: 24px !important;
      }
    }
  `;
}

/**
 * Function contract: polishContactPage
 * Purpose: Apply contact page consistently while preserving the surrounding contact page polish browser feature contract.
 * Inputs: None; derives required state from the enclosing module/runtime context.
 * Side effects: reads or updates DOM/browser state.
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
 */
export function polishContactPage() {
  ensureContactPagePolishStyle();
  requestAnimationFrame(ensureContactPagePolishStyle);
  window.setTimeout(ensureContactPagePolishStyle, 250);
  window.setTimeout(ensureContactPagePolishStyle, 700);
}
