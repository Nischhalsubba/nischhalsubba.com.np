/**
 * @fileoverview src/scripts/features/layout/case-study-layout-fixes.js
 * Purpose: Browser runtime feature in the layout domain responsible for case study layout fixes behavior.
 * Responsibilities:
 * - Own the behavior/content implied by this file's single responsibility.
 * - Keep public routes, build contracts, and imported module boundaries stable unless the connected owners are updated together.
 * Execution context: Browser ES module loaded by the portfolio runtime.
 * Connected files:
 * - docs/repository/file-catalog.md
 * - src/scripts/entrypoints/main.js
 * - src/runtime/script.js
 * Maintenance: Update this header when responsibility or dependencies change; generated/vendor files are documented at their source instead.
 */
/**
 * Function contract: normalizeText
 * Purpose: Applies normalize text while preserving the surrounding repository/runtime contract.
 * Inputs: value.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function normalizeText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim().toLowerCase();
}

/**
 * Function contract: markSection
 * Purpose: Implements the mark section responsibility for this module.
 * Inputs: section.
 * Side effects: may read or update browser DOM/state.
 * Returns: no explicit value unless an invoked dependency throws/rejects.
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
 * Purpose: Implements the improve case study sections responsibility for this module.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may read or update browser DOM/state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
export function improveCaseStudySections() {
  const path = (window.location.pathname || '/').replace(/\/+$/, '').replace(/\.html$/, '');
  if (!/^\/project-[^/]+$/.test(path)) return;

  document.querySelectorAll('main section').forEach(markSection);
}
