/**
 * @fileoverview src/scripts/features/navigation/share.js
 * Purpose: Browser runtime feature in the navigation domain responsible for share behavior.
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
import { $$ } from '../../shared/dom.js';

/**
 * Function contract: getShareText
 * Purpose: Retrieves get share text and returns it in the form expected by its caller.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may read or update browser DOM/state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function getShareText() {
  return encodeURIComponent(document.querySelector('h1')?.innerText || document.title);
}

/**
 * Function contract: initShareButtons
 * Purpose: Implements the init share buttons responsibility for this module.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may read or update browser DOM/state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
export function initShareButtons() {
  $$('[data-share]').forEach(/** Callback contract: Processes the callback step for $$('[data share]') without leaking orchestration details to the caller. Inputs: button. Side effects: may read or update browser DOM/state. Returns a value to the invoking API. */ (button) => {
    button.addEventListener('click', /** Callback contract: Processes the callback step for button without leaking orchestration details to the caller. Inputs: event. Side effects: may read or update browser DOM/state. Returns a value to the invoking API. */ async (event) => {
      event.preventDefault();

      const platform = button.dataset.share;
      const url = encodeURIComponent(window.location.href);
      const text = getShareText();

      if (platform === 'copy' && navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        button.classList.add('copied');
        window.setTimeout(/** Callback contract: Processes the callback step for window without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: may read or update browser DOM/state. No explicit return contract. */ () => button.classList.remove('copied'), 1600);
        return;
      }

      if (platform === 'native' && navigator.share) {
        await navigator.share({ title: document.title, url: window.location.href }).catch(/** Callback contract: Processes the callback step for navigator.share({ title: document.title, url: window.location.href }) without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ () => {});
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
