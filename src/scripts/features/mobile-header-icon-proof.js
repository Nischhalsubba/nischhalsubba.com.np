const STYLE_ID = 'nrs-mobile-header-icon-proof';

function ensureMobileHeaderIconStyle() {
  let style = document.getElementById(STYLE_ID);
  if (!style) {
    style = document.createElement('style');
    style.id = STYLE_ID;
    document.head.appendChild(style);
  }

  style.textContent = `
    @media (max-width: 850px) {
      .mobile-nav-toggle {
        display: inline-flex !important;
        flex-direction: column !important;
        gap: 6px !important;
        color: var(--text-primary, #111312) !important;
      }

      .mobile-nav-toggle span {
        display: block !important;
        width: 22px !important;
        height: 2px !important;
        min-height: 2px !important;
        border-radius: 999px !important;
        background: currentColor !important;
        opacity: 1 !important;
        visibility: visible !important;
        transform: none !important;
      }

      html[data-theme='light'] .mobile-nav-toggle {
        color: #111312 !important;
      }

      html[data-theme='dark'] .mobile-nav-toggle {
        color: #f4f5f2 !important;
      }
    }
  `;
}

export function proveMobileHeaderIcon() {
  ensureMobileHeaderIconStyle();
  requestAnimationFrame(ensureMobileHeaderIconStyle);
  window.setTimeout(ensureMobileHeaderIconStyle, 250);
  window.setTimeout(ensureMobileHeaderIconStyle, 1000);
}
