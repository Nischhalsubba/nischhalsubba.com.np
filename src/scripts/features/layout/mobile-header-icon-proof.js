/**
 * @fileoverview src/scripts/features/layout/mobile-header-icon-proof.js
 * Purpose: Implement mobile header icon proof behavior inside the layout browser-runtime domain.
 * Responsibilities:
 * - Own the layout behavior represented by this module and keep unrelated domains outside the file.
 * - Read or update only the DOM/runtime state needed for this feature and preserve accessibility semantics.
 * - Expose stable initializer/helper exports consumed by runtime entrypoints or closely related features.
 * Execution context: Browser ES module loaded through the portfolio runtime.
 * Connected files:
 * - src/runtime/script.js
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
const STYLE_ID = 'nrs-mobile-header-icon-proof';


/**
 * Function contract: ensureMobileHeaderIconStyle
 * Purpose: Apply mobile header icon style consistently while preserving the surrounding mobile header icon proof browser feature contract.
 * Inputs: None; derives required state from its enclosing module/runtime context.
 * Side effects: reads or updates DOM/browser state
 * Returns: Undefined; the function exists for the documented side effects, validation, or orchestration.
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
 * Purpose: Implement the prove mobile header icon responsibility owned by the mobile header icon proof browser feature.
 * Inputs: None; derives required state from its enclosing module/runtime context.
 * Side effects: reads or updates DOM/browser state
 * Returns: Undefined; the function exists for the documented side effects, validation, or orchestration.
 */
export function proveMobileHeaderIcon() {
  ensureMobileHeaderIconStyle();
  requestAnimationFrame(ensureMobileHeaderIconStyle);
  window.setTimeout(ensureMobileHeaderIconStyle, 250);
  window.setTimeout(ensureMobileHeaderIconStyle, 1000);
}
