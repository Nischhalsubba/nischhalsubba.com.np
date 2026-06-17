function ensureListSpacingStyle() {
  if (document.getElementById('nrs-list-spacing-polish')) return;

  const style = document.createElement('style');
  style.id = 'nrs-list-spacing-polish';
  style.textContent = `
    .case-list,
    .outcome-list,
    .nrs-outcome-list {
      display: grid !important;
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
      gap: clamp(16px, 2.4vw, 30px) !important;
      padding: 0 !important;
      margin-top: clamp(26px, 4vw, 42px) !important;
      list-style: none !important;
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

    @media (max-width: 860px) {
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

  document.head.appendChild(style);
}

export function polishListSpacing() {
  ensureListSpacingStyle();
  requestAnimationFrame(ensureListSpacingStyle);
  window.setTimeout(ensureListSpacingStyle, 250);
}
