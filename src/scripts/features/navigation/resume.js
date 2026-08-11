/**
 * @fileoverview src/scripts/features/navigation/resume.js
 * Purpose: Implement resume behavior inside the navigation browser-runtime domain.
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

const RESUME_URL = '/assets/resume.pdf';
const RESUME_FILENAME = 'Nischhal-Raj-Subba-Resume.pdf';

/**
 * Function contract: removeDuplicateFloatingResumeControls
 * Purpose: Remove duplicate floating resume controls without disturbing required surrounding resume browser feature state.
 * Inputs: None; derives required state from the enclosing module/runtime context.
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
 */
function removeDuplicateFloatingResumeControls() {
  const floatingControls = $$('.floating-resume-btn');

  floatingControls.slice(1).forEach(/** Callback contract: Apply the enclosing side-effect operation to the current collection item. Inputs: `control`. Side effects: no direct external side effect beyond invoked dependencies. Returns: computed expression result consumed by the enclosing operation. */ (control) => control.remove());
}

/**
 * Function contract: initResumeDownload
 * Purpose: Initialize resume download for the resume browser feature, including the listeners/state needed for safe runtime use.
 * Inputs: None; derives required state from the enclosing module/runtime context.
 * Side effects: registers or removes browser event listeners; reads or updates DOM/browser state.
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
 */
export function initResumeDownload() {
  removeDuplicateFloatingResumeControls();

  $$('a[href$="resume.pdf"], .floating-resume-btn, [data-resume-download]').forEach(/** Callback contract: Apply the enclosing side-effect operation to the current collection item. Inputs: `link`. Side effects: registers or removes browser listeners; reads or updates DOM/browser state. Returns: undefined; callback is side-effect-only. */ (link) => {
    link.setAttribute('href', RESUME_URL);
    link.setAttribute('download', RESUME_FILENAME);
    link.setAttribute('type', 'application/pdf');

    link.addEventListener('click', /** Callback contract: Handle the click event for `link` and apply the related local state update. Inputs: `event`. Side effects: reads or updates DOM/browser state. Returns: undefined; callback is side-effect-only. */ (event) => {
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
