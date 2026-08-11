/**
 * @fileoverview src/scripts/features/navigation/resume.js
 * Purpose: Browser runtime feature in the navigation domain responsible for resume behavior.
 * Responsibilities:
 * - Own the behavior/content implied by this file's single responsibility.
 * - Keep public routes, build contracts, and imported module boundaries stable unless the connected owners are updated together.
 * Execution context: Browser ES module loaded by the portfolio runtime.
 * Connected files:
 * - docs/repository/file-catalog.md
 * - src/scripts/entrypoints/agent-main.js
 * - src/scripts/entrypoints/main.js
 * - src/runtime/script.js
 * Maintenance: Update this header when responsibility or dependencies change; generated/vendor files are documented at their source instead.
 */
import { $$ } from '../../shared/dom.js';

const RESUME_URL = '/assets/resume.pdf';
const RESUME_FILENAME = 'Nischhal-Raj-Subba-Resume.pdf';

/**
 * Function contract: removeDuplicateFloatingResumeControls
 * Purpose: Removes or cleans remove duplicate floating resume controls while keeping required outputs intact.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: no explicit value unless an invoked dependency throws/rejects.
 */
function removeDuplicateFloatingResumeControls() {
  const floatingControls = $$('.floating-resume-btn');

  floatingControls.slice(1).forEach(/** Callback contract: Processes the callback step for floating controls.slice(1) without leaking orchestration details to the caller. Inputs: control. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (control) => control.remove());
}

/**
 * Function contract: initResumeDownload
 * Purpose: Implements the init resume download responsibility for this module.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may read or update browser DOM/state.
 * Returns: no explicit value unless an invoked dependency throws/rejects.
 */
export function initResumeDownload() {
  removeDuplicateFloatingResumeControls();

  $$('a[href$="resume.pdf"], .floating-resume-btn, [data-resume-download]').forEach(/** Callback contract: Processes the callback step for $$('a[href$="resume.pdf"], .floating resume btn, [data resume download]') without leaking orchestration details to the caller. Inputs: link. Side effects: may read or update browser DOM/state. No explicit return contract. */ (link) => {
    link.setAttribute('href', RESUME_URL);
    link.setAttribute('download', RESUME_FILENAME);
    link.setAttribute('type', 'application/pdf');

    link.addEventListener('click', /** Callback contract: Processes the callback step for link without leaking orchestration details to the caller. Inputs: event. Side effects: may read or update browser DOM/state. No explicit return contract. */ (event) => {
      event.preventDefault();

      const downloadLink = document.createElement('a');
      downloadLink.href = `${RESUME_URL}?download=1`;
      downloadLink.download = RESUME_FILENAME;
      downloadLink.rel = 'noopener';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      downloadLink.remove();
    });
  });
}
