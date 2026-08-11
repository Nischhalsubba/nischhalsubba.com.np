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
 * Inputs: None; derives required state from its enclosing module/runtime context.
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: The requested active filter; explicit early-return branches define empty/fallback behavior.
 */
function getActiveFilter() {
  return $('.filter-btn.active, .blog-filter-btn.active')?.dataset.filter || 'all';
}


/**
 * Function contract: getSearchQuery
 * Purpose: Return search query from the supplied inputs or current filters browser feature state.
 * Inputs: `searchWork`, `searchBlog`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: The requested search query; explicit early-return branches define empty/fallback behavior.
 */
function getSearchQuery(searchWork, searchBlog) {
  return (searchWork?.value || searchBlog?.value || '').toLowerCase().trim();
}


/**
 * Function contract: getSearchableText
 * Purpose: Return searchable text from the supplied inputs or current filters browser feature state.
 * Inputs: `item`
 * Side effects: reads or updates DOM/browser state
 * Returns: The requested searchable text; explicit early-return branches define empty/fallback behavior.
 */
function getSearchableText(item) {
  return [item.textContent || '', item.dataset.category || '', item.getAttribute('href') || ''].join(' ').toLowerCase();
}


/**
 * Function contract: updateWorkSummary
 * Purpose: Apply work summary consistently while preserving the surrounding filters browser feature contract.
 * Inputs: `{ visibleCount, totalCount, activeFilter, query }`
 * Side effects: reads or updates DOM/browser state
 * Returns: Undefined; the function exists for the documented side effects, validation, or orchestration.
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
 * Purpose: Apply no results consistently while preserving the surrounding filters browser feature contract.
 * Inputs: `visibleCount`
 * Side effects: reads or updates DOM/browser state
 * Returns: Undefined; the function exists for the documented side effects, validation, or orchestration.
 */
function updateNoResults(visibleCount) {
  const noResults = $('#nrs-no-results');
  if (!noResults) return;
  noResults.classList.toggle('is-visible', visibleCount === 0);
  noResults.setAttribute('aria-hidden', visibleCount === 0 ? 'false' : 'true');
}



/**
 * Function contract: applyFilters
 * Purpose: Apply filters consistently while preserving the surrounding filters browser feature contract.
 * Inputs: `{ searchWork, searchBlog }`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Undefined; the function exists for the documented side effects, validation, or orchestration.
 */
function applyFilters({ searchWork, searchBlog }) {
  const activeFilter = getActiveFilter();
  const query = getSearchQuery(searchWork, searchBlog);
  const items = $$('.project-card, .writing-item');
  let visibleCount = 0;

  items.forEach(   /** Callback contract: Apply the enclosing side-effect operation to the current collection item. Inputs: `item` Side effects: No direct external side effect beyond invoked dependencies. Returns: Undefined; this callback is side-effect-only. */ (item) => {
    const tags = (item.dataset.category || '').toLowerCase();
    const searchableText = getSearchableText(item);
    const matchesFilter = activeFilter === 'all' || tags.includes(activeFilter);
    const matchesQuery = !query || query.split(/\s+/).every(   /** Callback contract: Evaluate whether the current item satisfies the enclosing all-items condition. Inputs: `term` Side effects: No direct external side effect beyond invoked dependencies. Returns: Boolean predicate result consumed by the enclosing collection lookup/filter. */ (term) => searchableText.includes(term));
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
 * Purpose: Synchronize active filter with the requested state while preserving related filters browser feature invariants.
 * Inputs: `button`, `selector`
 * Side effects: reads or updates DOM/browser state
 * Returns: Undefined; the function exists for the documented side effects, validation, or orchestration.
 */
function setActiveFilter(button, selector) {
  $$(selector).forEach(   /** Callback contract: Apply the enclosing side-effect operation to the current collection item. Inputs: `item` Side effects: reads or updates DOM/browser state Returns: Undefined; this callback is side-effect-only. */ (item) => {
    item.classList.remove('active');
    item.setAttribute('aria-pressed', 'false');
  });
  button.classList.add('active');
  button.setAttribute('aria-pressed', 'true');
}



/**
 * Function contract: initFilters
 * Purpose: Initialize filters for the filters browser feature, including the listeners/state needed for safe runtime use.
 * Inputs: None; derives required state from its enclosing module/runtime context.
 * Side effects: registers or removes browser listeners; reads or updates DOM/browser state
 * Returns: Undefined; the function exists for the documented side effects, validation, or orchestration.
 */
export function initFilters() {
  const searchWork = $('#search-work');
  const searchBlog = $('#search-blog');
  const controls = { searchWork, searchBlog };

  $$('.filter-btn, .blog-filter-btn').forEach(   /** Callback contract: Apply the enclosing side-effect operation to the current collection item. Inputs: `button` Side effects: registers or removes browser listeners; reads or updates DOM/browser state Returns: Undefined; this callback is side-effect-only. */ (button) => {
    button.setAttribute('aria-pressed', button.classList.contains('active') ? 'true' : 'false');
    button.addEventListener('click',    /** Callback contract: Handle the click event for `button` and apply the related local state update. Inputs: None; derives required state from its enclosing module/runtime context. Side effects: reads or updates DOM/browser state Returns: Undefined; this callback is side-effect-only. */ () => {
      const selector = button.classList.contains('blog-filter-btn') ? '.blog-filter-btn' : '.filter-btn';
      setActiveFilter(button, selector);
      applyFilters(controls);
    });
  });

  [searchWork, searchBlog].filter(Boolean).forEach(   /** Callback contract: Apply the enclosing side-effect operation to the current collection item. Inputs: `input` Side effects: registers or removes browser listeners Returns: Undefined; this callback is side-effect-only. */ (input) => {
    input.addEventListener('input',    /** Callback contract: Handle the input event for `input` and apply the related local state update. Inputs: None; derives required state from its enclosing module/runtime context. Side effects: No direct external side effect beyond invoked dependencies. Returns: Undefined; this callback is side-effect-only. */ () => applyFilters(controls));
  });

  $('#clear-work')?.addEventListener('click',    /** Callback contract: Handle the click event for `$('#clear-work')` and apply the related local state update. Inputs: None; derives required state from its enclosing module/runtime context. Side effects: reads or updates DOM/browser state Returns: Undefined; this callback is side-effect-only. */ () => {
    if (!searchWork) return;
    searchWork.value = '';
    const allButton = $('.filter-btn[data-filter="all"]');
    if (allButton) setActiveFilter(allButton, '.filter-btn');
    applyFilters(controls);
    searchWork.focus();
  });

  applyFilters(controls);
}
