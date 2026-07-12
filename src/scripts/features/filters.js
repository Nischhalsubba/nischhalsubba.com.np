import { $, $$ } from '../utils/dom.js';

function getActiveFilter() {
  return $('.filter-btn.active, .blog-filter-btn.active')?.dataset.filter || 'all';
}

function getSearchQuery(searchWork, searchBlog) {
  return (searchWork?.value || searchBlog?.value || '').toLowerCase().trim();
}

function getSearchableText(item) {
  return [item.textContent || '', item.dataset.category || '', item.getAttribute('href') || ''].join(' ').toLowerCase();
}

function updateWorkSummary({ visibleCount, totalCount, activeFilter, query }) {
  const summary = $('#nrs-work-summary');
  if (!summary) return;
  const filterLabel = activeFilter === 'all' ? 'all work' : activeFilter;
  const queryLabel = query ? ` matching “${query}”` : '';
  summary.textContent = `${visibleCount} of ${totalCount} projects · ${filterLabel}${queryLabel}`;
  summary.setAttribute('aria-live', 'polite');
}

function updateNoResults(visibleCount) {
  const noResults = $('#nrs-no-results');
  if (!noResults) return;
  noResults.classList.toggle('is-visible', visibleCount === 0);
  noResults.setAttribute('aria-hidden', visibleCount === 0 ? 'false' : 'true');
}

function applyFilters({ searchWork, searchBlog }) {
  const activeFilter = getActiveFilter();
  const query = getSearchQuery(searchWork, searchBlog);
  const items = $$('.project-card, .writing-item');
  let visibleCount = 0;

  items.forEach((item) => {
    const tags = (item.dataset.category || '').toLowerCase();
    const searchableText = getSearchableText(item);
    const matchesFilter = activeFilter === 'all' || tags.includes(activeFilter);
    const matchesQuery = !query || query.split(/\s+/).every((term) => searchableText.includes(term));
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

function setActiveFilter(button, selector) {
  $$(selector).forEach((item) => {
    item.classList.remove('active');
    item.setAttribute('aria-pressed', 'false');
  });
  button.classList.add('active');
  button.setAttribute('aria-pressed', 'true');
}

export function initFilters() {
  const searchWork = $('#search-work');
  const searchBlog = $('#search-blog');
  const controls = { searchWork, searchBlog };

  $$('.filter-btn, .blog-filter-btn').forEach((button) => {
    button.setAttribute('aria-pressed', button.classList.contains('active') ? 'true' : 'false');
    button.addEventListener('click', () => {
      const selector = button.classList.contains('blog-filter-btn') ? '.blog-filter-btn' : '.filter-btn';
      setActiveFilter(button, selector);
      applyFilters(controls);
    });
  });

  [searchWork, searchBlog].filter(Boolean).forEach((input) => {
    input.addEventListener('input', () => applyFilters(controls));
  });

  $('#clear-work')?.addEventListener('click', () => {
    if (!searchWork) return;
    searchWork.value = '';
    const allButton = $('.filter-btn[data-filter="all"]');
    if (allButton) setActiveFilter(allButton, '.filter-btn');
    applyFilters(controls);
    searchWork.focus();
  });

  applyFilters(controls);
}
