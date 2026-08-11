/**
 * @fileoverview src/scripts/features/content/filters.js
 * Purpose: Browser runtime feature in the content domain responsible for filters behavior.
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
import { $, $$ } from '../../shared/dom.js';

/**
 * Function contract: getActiveFilter
 * Purpose: Retrieves get active filter and returns it in the form expected by its caller.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function getActiveFilter() {
  return $('.filter-btn.active, .blog-filter-btn.active')?.dataset.filter || 'all';
}

/**
 * Function contract: getSearchQuery
 * Purpose: Retrieves get search query and returns it in the form expected by its caller.
 * Inputs: searchWork, searchBlog.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function getSearchQuery(searchWork, searchBlog) {
  return (searchWork?.value || searchBlog?.value || '').toLowerCase().trim();
}

/**
 * Function contract: getSearchableText
 * Purpose: Retrieves get searchable text and returns it in the form expected by its caller.
 * Inputs: item.
 * Side effects: may read or update browser DOM/state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function getSearchableText(item) {
  return [item.textContent || '', item.dataset.category || '', item.getAttribute('href') || ''].join(' ').toLowerCase();
}

/**
 * Function contract: updateWorkSummary
 * Purpose: Applies update work summary while preserving the surrounding repository/runtime contract.
 * Inputs: { visibleCount, totalCount, activeFilter, query }.
 * Side effects: may read or update browser DOM/state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
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
function applyFilters({ searchWork, searchBlog }) {
  const activeFilter = getActiveFilter();
  const query = getSearchQuery(searchWork, searchBlog);
  const items = $$('.project-card, .writing-item');
  let visibleCount = 0;

  items.forEach(/** Callback contract: Processes the callback step for items without leaking orchestration details to the caller. Inputs: item. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (item) => {
    const tags = (item.dataset.category || '').toLowerCase();
    const searchableText = getSearchableText(item);
    const matchesFilter = activeFilter === 'all' || tags.includes(activeFilter);
    const matchesQuery = !query || query.split(/\s+/).every(/** Callback contract: Processes the callback step for query.split(/\s+/) without leaking orchestration details to the caller. Inputs: term. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (term) => searchableText.includes(term));
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
function setActiveFilter(button, selector) {
  $$(selector).forEach(/** Callback contract: Processes the callback step for $$(selector) without leaking orchestration details to the caller. Inputs: item. Side effects: may read or update browser DOM/state. No explicit return contract. */ (item) => {
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
export function initFilters() {
  const searchWork = $('#search-work');
  const searchBlog = $('#search-blog');
  const controls = { searchWork, searchBlog };

  $$('.filter-btn, .blog-filter-btn').forEach(/** Callback contract: Processes the callback step for $$('.filter btn, .blog filter btn') without leaking orchestration details to the caller. Inputs: button. Side effects: may read or update browser DOM/state. No explicit return contract. */ (button) => {
    button.setAttribute('aria-pressed', button.classList.contains('active') ? 'true' : 'false');
    button.addEventListener('click', /** Callback contract: Processes the callback step for button without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: may read or update browser DOM/state. No explicit return contract. */ () => {
      const selector = button.classList.contains('blog-filter-btn') ? '.blog-filter-btn' : '.filter-btn';
      setActiveFilter(button, selector);
      applyFilters(controls);
    });
  });

  [searchWork, searchBlog].filter(Boolean).forEach(/** Callback contract: Processes the callback step for [search work, search blog].filter(boolean) without leaking orchestration details to the caller. Inputs: input. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (input) => {
    input.addEventListener('input', /** Callback contract: Processes the callback step for input without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ () => applyFilters(controls));
  });

  $('#clear-work')?.addEventListener('click', /** Callback contract: Processes the callback step for $('#clear work')? without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: no obvious external side effect beyond invoked dependencies. Returns a value to the invoking API. */ () => {
    if (!searchWork) return;
    searchWork.value = '';
    const allButton = $('.filter-btn[data-filter="all"]');
    if (allButton) setActiveFilter(allButton, '.filter-btn');
    applyFilters(controls);
    searchWork.focus();
  });

  applyFilters(controls);
}
