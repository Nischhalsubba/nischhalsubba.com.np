/**
 * @fileoverview src/scripts/features/layout/mobile-header-icon-proof.js
 * Purpose: Browser runtime feature in the layout domain responsible for mobile header icon proof behavior.
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
const STYLE_ID = 'nrs-mobile-header-icon-proof';

/**
 * Function contract: ensureMobileHeaderIconStyle
 * Purpose: Applies ensure mobile header icon style while preserving the surrounding repository/runtime contract.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may read or update browser DOM/state.
 * Returns: no explicit value unless an invoked dependency throws/rejects.
 */
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

/**
 * Function contract: proveMobileHeaderIcon
 * Purpose: Implements the prove mobile header icon responsibility for this module.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may read or update browser DOM/state.
 * Returns: no explicit value unless an invoked dependency throws/rejects.
 */
export function proveMobileHeaderIcon() {
  ensureMobileHeaderIconStyle();
  requestAnimationFrame(ensureMobileHeaderIconStyle);
  window.setTimeout(ensureMobileHeaderIconStyle, 250);
  window.setTimeout(ensureMobileHeaderIconStyle, 1000);
}
