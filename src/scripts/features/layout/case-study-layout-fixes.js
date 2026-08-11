/**
 * @fileoverview src/scripts/features/layout/case-study-layout-fixes.js
 * Purpose: Implement case study layout fixes behavior inside the layout browser-runtime domain.
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
 * Function contract: normalizeText
 * Purpose: Apply text consistently while preserving the surrounding case study layout fixes browser feature contract.
 * Inputs: `value`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function normalizeText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim().toLowerCase();
}


/**
 * Function contract: markSection
 * Purpose: Implement the mark section responsibility owned by the case study layout fixes browser feature.
 * Inputs: `section`
 * Side effects: reads or updates DOM/browser state
 * Returns: Undefined; the function exists for the documented side effects, validation, or orchestration.
 */
function markSection(section) {
  const heading = section.querySelector(':scope > h2, :scope > .section-title, :scope > .section-header h2');
  const label = section.querySelector(':scope > .case-label, :scope > .eyebrow, :scope > .section-header .eyebrow');
  const headingText = normalizeText(heading?.textContent);
  const labelText = normalizeText(label?.textContent);

  if (headingText === 'my role' || headingText.startsWith('my role ')) {
    section.classList.add('nrs-case-role-section');
  }

  if (labelText.includes('design decisions') || headingText.includes('how i approached the work')) {
    section.classList.add('nrs-case-decisions-section');
  }
}


/**
 * Function contract: improveCaseStudySections
 * Purpose: Implement the improve case study sections responsibility owned by the case study layout fixes browser feature.
 * Inputs: None; derives required state from its enclosing module/runtime context.
 * Side effects: reads or updates DOM/browser state
 * Returns: Undefined; the function exists for the documented side effects, validation, or orchestration.
 */
export function improveCaseStudySections() {
  const path = (window.location.pathname || '/').replace(/\/+$/, '').replace(/\.html$/, '');
  if (!/^\/project-[^/]+$/.test(path)) return;

  document.querySelectorAll('main section').forEach(markSection);
}
