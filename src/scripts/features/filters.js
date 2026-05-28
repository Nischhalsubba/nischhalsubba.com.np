import { $, $$ } from '../utils/dom.js';

function getActiveFilter() {
  return $('.filter-btn.active, .blog-filter-btn.active')?.dataset.filter || 'all';
}

function getSearchQuery(searchWork, searchBlog) {
  return (searchWork?.value || searchBlog?.value || '').toLowerCase().trim();
}

function applyFilters({ searchWork, searchBlog }) {
  const activeFilter = getActiveFilter();
  const query = getSearchQuery(searchWork, searchBlog);

  $$('.project-card, .writing-item').forEach((item) => {
    const tags = (item.dataset.category || '').toLowerCase();
    const text = (item.textContent || '').toLowerCase();
    const matchesFilter = activeFilter === 'all' || tags.includes(activeFilter);
    const matchesQuery = !query || text.includes(query);

    item.style.display = matchesFilter && matchesQuery ? '' : 'none';
  });
}

export function initFilters() {
  const searchWork = $('#search-work');
  const searchBlog = $('#search-blog');
  const controls = { searchWork, searchBlog };

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
}
