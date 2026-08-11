/**
 * @fileoverview src/scripts/features/content/filters.js
 * Purpose: Implement filters behavior inside the content browser-runtime domain.
 * Responsibilities:
 * - Own the content behavior represented by this module and keep unrelated domains outside the file.
 * - Read or update only the DOM/runtime state needed for this feature and preserve accessibility semantics.
 * - Expose stable initializer/helper exports consumed by runtime entrypoints or closely related features.
 * Execution context: Browser ES module loaded through the portfolio runtime.
 * Connected files:
 * - src/scripts/shared/dom.js
 * - src/runtime/script.js
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
import { $, $$ } from '../../shared/dom.js';

/**
 * Function contract: getActiveFilter
 * Purpose: Return active filter from the supplied inputs or current filters browser feature state.
 * Inputs: None; derives required state from the enclosing module/runtime context.
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: The requested active filter; early-return/empty-state behavior follows the explicit branches in this function.
 */
function getActiveFilter() {
  return $('.filter-btn.active, .blog-filter-btn.active')?.dataset.filter || 'all';
}

/**
 * Function contract: getSearchQuery
 * Purpose: Return search query from the supplied inputs or current filters browser feature state.
 * Inputs: `searchWork`: input consumed by this operation; `searchBlog`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: The requested search query; early-return/empty-state behavior follows the explicit branches in this function.
 */
function getSearchQuery(searchWork, searchBlog) {
  return (searchWork?.value || searchBlog?.value || '').toLowerCase().trim();
}

/**
 * Function contract: getSearchableText
 * Purpose: Return searchable text from the supplied inputs or current filters browser feature state.
 * Inputs: `item`: input consumed by this operation
 * Side effects: reads or updates DOM/browser state.
 * Returns: The requested searchable text; early-return/empty-state behavior follows the explicit branches in this function.
 */
function getSearchableText(item) {
  return [item.textContent || '', item.dataset.category || '', item.getAttribute('href') || ''].join(' ').toLowerCase();
}

/**
 * Function contract: updateWorkSummary
 * Purpose: Apply work summary consistently while preserving the surrounding filters browser feature contract.
 * Inputs: `{ visibleCount, totalCount, activeFilter, query }`: input consumed by this operation
 * Side effects: reads or updates DOM/browser state.
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
 */
function updateWorkSummary({ visibleCount, totalCount, activeFilter, query }) {
  const summary = $('#nrs-work-summary');
  if (!summary) return;
  const filterLabel = activeFilter === 'all' ? 'all work' : activeFilter;
  const queryLabel = query ? ` matching “${query}”` : '';
  summary.textContent = `${visibleCount} of ${totalCount} projects · ${filterLabel}${queryLabel}`;
  summary.setAttribute('aria-live', 'polite');
}

/**
 * Function contract: updateNoResults
 * Purpose: Applies update no results while preserving the surrounding repository/runtime contract.
 * Inputs: visibleCount.
 * Side effects: may read or update browser DOM/state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: updateNoResults
 * Purpose: Apply no results consistently while preserving the surrounding filters browser feature contract.
 * Inputs: `visibleCount`: input consumed by this operation
 * Side effects: reads or updates DOM/browser state.
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
 */
function updateNoResults(visibleCount) {
  const noResults = $('#nrs-no-results');
  if (!noResults) return;
  noResults.classList.toggle('is-visible', visibleCount === 0);
  noResults.setAttribute('aria-hidden', visibleCount === 0 ? 'false' : 'true');
}

/**
 * Function contract: applyFilters
 * Purpose: Applies apply filters while preserving the surrounding repository/runtime contract.
 * Inputs: { searchWork, searchBlog }.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: no explicit value unless an invoked dependency throws/rejects.
 */
/**
 * Function contract: applyFilters
 * Purpose: Apply filters consistently while preserving the surrounding filters browser feature contract.
 * Inputs: `{ searchWork, searchBlog }`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
 */
function applyFilters({ searchWork, searchBlog }) {
  const activeFilter = getActiveFilter();
  const query = getSearchQuery(searchWork, searchBlog);
  const items = $$('.project-card, .writing-item');
  let visibleCount = 0;

  items.forEach(/** Callback contract: Processes the callback step for items without leaking orchestration details to the caller. Inputs: item. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Apply the enclosing side-effect operation to the current collection item. Inputs: `item`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Apply the enclosing side-effect operation to the current collection item. Inputs: `item`. Side effects: no direct external side effect beyond invoked dependencies. Returns: undefined; callback is side-effect-only. */ (item) => {
    const tags = (item.dataset.category || '').toLowerCase();
    const searchableText = getSearchableText(item);
    const matchesFilter = activeFilter === 'all' || tags.includes(activeFilter);
    const matchesQuery = !query || query.split(/\s+/).every(/** Callback contract: Processes the callback step for query.split(/\s+/) without leaking orchestration details to the caller. Inputs: term. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Evaluate whether the current item satisfies the condition required by the enclosing all-items check. Inputs: `term`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Evaluate whether the current item satisfies the enclosing all-items condition. Inputs: `term`. Side effects: no direct external side effect beyond invoked dependencies. Returns: computed expression result consumed by the enclosing operation. */ (term) => searchableText.includes(term));
    const visible = matchesFilter && matchesQuery;
    item.hidden = !visible;
    item.style.display = visible ? '' : 'none';
    if (visible) visibleCount += 1;
  });

  if (searchWork) {
    updateWorkSummary({ visibleCount, totalCount: items.length, activeFilter, query });
    updateNoResults(visibleCount);
  }
}

/**
 * Function contract: setActiveFilter
 * Purpose: Applies set active filter while preserving the surrounding repository/runtime contract.
 * Inputs: button, selector.
 * Side effects: may read or update browser DOM/state.
 * Returns: no explicit value unless an invoked dependency throws/rejects.
 */
/**
 * Function contract: setActiveFilter
 * Purpose: Synchronize active filter with the requested state while preserving related filters browser feature invariants.
 * Inputs: `button`: interactive trigger/control element; `selector`: input consumed by this operation
 * Side effects: reads or updates DOM/browser state.
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
 */
function setActiveFilter(button, selector) {
  $$(selector).forEach(/** Callback contract: Processes the callback step for $$(selector) without leaking orchestration details to the caller. Inputs: item. Side effects: may read or update browser DOM/state. No explicit return contract. */ /** Callback contract: Apply the enclosing side-effect operation to the current collection item. Inputs: `item`. Side effects: reads or updates DOM/browser state. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Apply the enclosing side-effect operation to the current collection item. Inputs: `item`. Side effects: reads or updates DOM/browser state. Returns: undefined; callback is side-effect-only. */ (item) => {
    item.classList.remove('active');
    item.setAttribute('aria-pressed', 'false');
  });
  button.classList.add('active');
  button.setAttribute('aria-pressed', 'true');
}

/**
 * Function contract: initFilters
 * Purpose: Implements the init filters responsibility for this module.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may read or update browser DOM/state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: initFilters
 * Purpose: Initialize filters for the filters browser feature, including the listeners/state needed for safe runtime use.
 * Inputs: None; derives required state from the enclosing module/runtime context.
 * Side effects: registers or removes browser event listeners; reads or updates DOM/browser state.
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
 */
export function initFilters() {
  const searchWork = $('#search-work');
  const searchBlog = $('#search-blog');
  const controls = { searchWork, searchBlog };

  $$('.filter-btn, .blog-filter-btn').forEach(/** Callback contract: Processes the callback step for $$('.filter btn, .blog filter btn') without leaking orchestration details to the caller. Inputs: button. Side effects: may read or update browser DOM/state. No explicit return contract. */ /** Callback contract: Apply the enclosing side-effect operation to the current collection item. Inputs: `button`. Side effects: registers or removes browser event listeners; reads or updates DOM/browser state. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Apply the enclosing side-effect operation to the current collection item. Inputs: `button`. Side effects: registers or removes browser listeners; reads or updates DOM/browser state. Returns: undefined; callback is side-effect-only. */ (button) => {
    button.setAttribute('aria-pressed', button.classList.contains('active') ? 'true' : 'false');
    button.addEventListener('click', /** Callback contract: Processes the callback step for button without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: may read or update browser DOM/state. No explicit return contract. */ /** Callback contract: Handle the click event for `button` and apply this module's related state update. Inputs: none. Side effects: reads or updates DOM/browser state. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Handle the click event for `button` and apply the related local state update. Inputs: none. Side effects: reads or updates DOM/browser state. Returns: undefined; callback is side-effect-only. */ () => {
      const selector = button.classList.contains('blog-filter-btn') ? '.blog-filter-btn' : '.filter-btn';
      setActiveFilter(button, selector);
      applyFilters(controls);
    });
  });

  [searchWork, searchBlog].filter(Boolean).forEach(/** Callback contract: Processes the callback step for [search work, search blog].filter(boolean) without leaking orchestration details to the caller. Inputs: input. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Apply the enclosing side-effect operation to the current collection item. Inputs: `input`. Side effects: registers or removes browser event listeners. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Apply the enclosing side-effect operation to the current collection item. Inputs: `input`. Side effects: registers or removes browser listeners. Returns: undefined; callback is side-effect-only. */ (input) => {
    input.addEventListener('input', /** Callback contract: Processes the callback step for input without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Handle the input event for `input` and apply this module's related state update. Inputs: none. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Handle the input event for `input` and apply the related local state update. Inputs: none. Side effects: no direct external side effect beyond invoked dependencies. Returns: computed expression result consumed by the enclosing operation. */ () => applyFilters(controls));
  });

  $('#clear-work')?.addEventListener('click', /** Callback contract: Processes the callback step for $('#clear work')? without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: no obvious external side effect beyond invoked dependencies. Returns a value to the invoking API. */ /** Callback contract: Handle the click event for `$('#clear-work')` and apply this module's related state update. Inputs: none. Side effects: reads or updates DOM/browser state. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Handle the click event for `$('#clear-work')` and apply the related local state update. Inputs: none. Side effects: reads or updates DOM/browser state. Returns: undefined; callback is side-effect-only. */ () => {
    if (!searchWork) return;
    searchWork.value = '';
    const allButton = $('.filter-btn[data-filter="all"]');
    if (allButton) setActiveFilter(allButton, '.filter-btn');
    applyFilters(controls);
    searchWork.focus();
  });

  applyFilters(controls);
}
