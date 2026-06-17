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
      grid-template-columns: minmax(170px, 0.28fr) minmax(0, 1fr) !important;
      column-gap: clamp(28px, 5vw, 82px) !important;
      align-items: start !important;
      width: 100% !important;
    }

    .contact-layout .clarity-section-label {
      min-width: 0 !important;
    }

    .contact-layout .clarity-section-body {
      display: grid !important;
      grid-template-columns: minmax(260px, 0.82fr) minmax(560px, 1.18fr) !important;
      column-gap: clamp(34px, 5vw, 78px) !important;
      row-gap: clamp(22px, 3vw, 34px) !important;
      align-items: start !important;
      width: 100% !important;
      min-width: 0 !important;
    }

    .contact-layout .clarity-section-body > .section-title,
    .contact-layout .clarity-section-body > .section-lead {
      grid-column: 1 !important;
      max-width: 380px !important;
      margin-inline: 0 !important;
    }

    .contact-layout .clarity-section-body > .section-title {
      margin-bottom: clamp(16px, 2.4vw, 28px) !important;
      text-wrap: balance !important;
    }

    .contact-layout .clarity-section-body > .section-lead {
      margin-top: 0 !important;
      line-height: 1.72 !important;
    }

    .contact-layout .contact-form {
      grid-column: 2 !important;
      grid-row: 1 / span 3 !important;
      width: 100% !important;
      max-width: none !important;
      min-width: 0 !important;
      margin: 0 !important;
      padding: clamp(34px, 4.4vw, 58px) !important;
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
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
      gap: clamp(20px, 2.4vw, 32px) !important;
      margin: 0 0 clamp(22px, 2.8vw, 34px) !important;
      width: 100% !important;
    }

    .contact-form .form-field {
      display: grid !important;
      gap: 11px !important;
      min-width: 0 !important;
      color: var(--text-secondary) !important;
      font-weight: 750 !important;
      line-height: 1.35 !important;
    }

    .contact-form > .form-field {
      margin-top: 0 !important;
    }

    .contact-form input,
    .contact-form select,
    .contact-form textarea {
      width: 100% !important;
      max-width: 100% !important;
      min-width: 0 !important;
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
      min-height: clamp(220px, 25vw, 320px) !important;
      resize: vertical !important;
      border-radius: 26px !important;
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
      display: flex !important;
      flex-wrap: wrap !important;
      gap: 14px !important;
      align-items: center !important;
      margin-top: clamp(22px, 3vw, 34px) !important;
    }

    .contact-form .form-actions .btn {
      min-width: 170px !important;
    }

    .contact-form .form-status {
      min-height: 1.4em !important;
      margin-top: 18px !important;
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
        max-width: 100% !important;
      }
    }

    @media (max-width: 720px) {
      .contact-form .form-grid {
        grid-template-columns: 1fr !important;
      }

      .contact-layout .contact-form {
        padding: 24px !important;
      }

      .contact-form .form-actions .btn {
        width: 100% !important;
      }
    }
  `;
}

export function polishContactPage() {
  ensureContactPagePolishStyle();
  requestAnimationFrame(ensureContactPagePolishStyle);
  window.setTimeout(ensureContactPagePolishStyle, 250);
  window.setTimeout(ensureContactPagePolishStyle, 700);
}
