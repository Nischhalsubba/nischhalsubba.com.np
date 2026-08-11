/**
 * @fileoverview src/scripts/features/navigation/share.js
 * Purpose: Implement share behavior inside the navigation browser-runtime domain.
 * Responsibilities:
 * - Own the navigation behavior represented by this module and keep unrelated domains outside the file.
 * - Read or update only the DOM/runtime state needed for this feature and preserve accessibility semantics.
 * - Expose stable initializer/helper exports consumed by runtime entrypoints or closely related features.
 * Execution context: Browser ES module loaded through the portfolio runtime.
 * Connected files:
 * - src/scripts/shared/dom.js
 * - src/runtime/script.js
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
import { $$ } from '../../shared/dom.js';

/**
 * Function contract: getShareText
 * Purpose: Return share text from the supplied inputs or current share browser feature state.
 * Inputs: None; derives required state from the enclosing module/runtime context.
 * Side effects: reads or updates DOM/browser state.
 * Returns: The requested share text; early-return/empty-state behavior follows the explicit branches in this function.
 */
function getShareText() {
  return encodeURIComponent(document.querySelector('h1')?.innerText || document.title);
}

/**
 * Function contract: initShareButtons
 * Purpose: Initialize share buttons for the share browser feature, including the listeners/state needed for safe runtime use.
 * Inputs: None; derives required state from the enclosing module/runtime context.
 * Side effects: registers or removes browser event listeners; reads or updates DOM/browser state.
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
 */
export function initShareButtons() {
  $$('[data-share]').forEach(/** Callback contract: Apply the enclosing side-effect operation to the current collection item. Inputs: `button`. Side effects: registers or removes browser listeners; reads or updates DOM/browser state. Returns: undefined; callback is side-effect-only. */ (button) => {
    button.addEventListener('click', /** Callback contract: Handle the click event for `button` and apply the related local state update. Inputs: `event`. Side effects: reads or updates DOM/browser state. Returns: Promise resolving after the callback side effects complete. */ async (event) => {
      event.preventDefault();

      const platform = button.dataset.share;
      const url = encodeURIComponent(window.location.href);
      const text = getShareText();

      if (platform === 'copy' && navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        button.classList.add('copied');
        window.setTimeout(/** Callback contract: Perform the local callback step required by the immediately enclosing operation. Inputs: none. Side effects: reads or updates DOM/browser state. Returns: computed expression result consumed by the enclosing operation. */ () => button.classList.remove('copied'), 1600);
        return;
      }

      if (platform === 'native' && navigator.share) {
        await navigator.share({ title: document.title, url: window.location.href }).catch(/** Callback contract: Convert or report the rejected asynchronous operation according to the surrounding failure-handling policy. Inputs: none. Side effects: no direct external side effect beyond invoked dependencies. Returns: undefined; callback is side-effect-only. */ () => {});
        return;
      }

      const targets = {
        x: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      };

      if (targets[platform]) {
        window.open(targets[platform], '_blank', 'noopener,noreferrer');
      }
    });
  });
}
