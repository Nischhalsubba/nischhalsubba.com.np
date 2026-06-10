import { $, $$ } from '../utils/dom.js';

const QUICK_SEARCHES = [
  'Web3 wallet UX',
  'SaaS dashboard',
  'Fintech flows',
  'Mobile app',
  'Website UX',
  'Design systems',
];

function getActiveFilter() {
  return $('.filter-btn.active, .blog-filter-btn.active')?.dataset.filter || 'all';
}

function getSearchQuery(searchWork, searchBlog) {
  return (searchWork?.value || searchBlog?.value || '').toLowerCase().trim();
}

function getSearchableText(item) {
  return [
    item.textContent || '',
    item.dataset.category || '',
    item.getAttribute('href') || '',
  ].join(' ').toLowerCase();
}

function updateWorkSummary({ visibleCount, totalCount, activeFilter, query }) {
  const summary = $('#nrs-work-summary');
  if (!summary) return;

  const filterLabel = activeFilter === 'all' ? 'all domains' : activeFilter;
  const queryLabel = query ? ` matching “${query}”` : '';
  summary.textContent = `${visibleCount} of ${totalCount} projects shown for ${filterLabel}${queryLabel}.`;
}

function updateNoResults({ visibleCount }) {
  const noResults = $('#nrs-no-results');
  if (!noResults) return;
  noResults.classList.toggle('is-visible', visibleCount === 0);
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
    const isVisible = matchesFilter && matchesQuery;

    item.hidden = !isVisible;
    item.style.display = isVisible ? '' : 'none';
    if (isVisible) visibleCount += 1;
  });

  if (searchWork) {
    updateWorkSummary({ visibleCount, totalCount: items.length, activeFilter, query });
    updateNoResults({ visibleCount });
  }
}

function enhanceWorkSearch(searchWork) {
  const controls = searchWork?.closest('.work-controls');
  if (!searchWork || !controls || controls.classList.contains('nrs-work-intelligence')) return;

  controls.classList.add('nrs-work-intelligence');

  const wrapper = searchWork.closest('.search-wrapper');
  const clearButton = $('#clear-work');
  if (wrapper && clearButton) {
    const panel = document.createElement('div');
    panel.className = 'nrs-work-search-panel';
    wrapper.before(panel);
    panel.append(wrapper, clearButton);
  }

  const summary = document.createElement('p');
  summary.id = 'nrs-work-summary';
  summary.className = 'nrs-work-summary';
  summary.textContent = 'Search by project, domain, role, platform, or tool.';
  controls.appendChild(summary);

  const suggestions = document.createElement('div');
  suggestions.className = 'nrs-work-suggestion-row';
  suggestions.setAttribute('aria-label', 'Suggested project searches');

  QUICK_SEARCHES.forEach((label) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'nrs-search-chip';
    button.textContent = label;
    button.addEventListener('click', () => {
      searchWork.value = label;
      searchWork.dispatchEvent(new Event('input', { bubbles: true }));
      searchWork.focus();
    });
    suggestions.appendChild(button);
  });

  controls.appendChild(suggestions);

  const noResults = document.createElement('div');
  noResults.id = 'nrs-no-results';
  noResults.className = 'nrs-no-results';
  noResults.innerHTML = '<h3>No matching projects yet.</h3><p>Try a broader term like Web3, SaaS, fintech, mobile, website, dashboard, or design system.</p>';
  controls.parentElement?.appendChild(noResults);
}

export function initFilters() {
  const searchWork = $('#search-work');
  const searchBlog = $('#search-blog');
  const controls = { searchWork, searchBlog };

  enhanceWorkSearch(searchWork);

  $$('.filter-btn, .blog-filter-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const groupSelector = button.classList.contains('blog-filter-btn') ? '.blog-filter-btn' : '.filter-btn';
      $$(groupSelector).forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      applyFilters(controls);
    });
  });

  [searchWork, searchBlog].filter(Boolean).forEach((input) => {
    input.addEventListener('input', () => applyFilters(controls));
  });

  $('#clear-work')?.addEventListener('click', () => {
    if (!searchWork) return;
    searchWork.value = '';
    applyFilters(controls);
    searchWork.focus();
  });

  applyFilters(controls);
}
