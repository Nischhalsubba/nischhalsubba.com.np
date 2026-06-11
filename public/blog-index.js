(() => {
  const list = document.querySelector('[data-blog-posts]');
  const featured = document.querySelector('[data-featured-post]');
  const filters = document.querySelector('[data-blog-filters]');
  const search = document.querySelector('[data-blog-search]');

  if (!list) return;

  const formatDate = (value) => {
    try {
      return new Intl.DateTimeFormat('en', { month: 'short', day: '2-digit', year: 'numeric' }).format(new Date(value));
    } catch (_) {
      return value;
    }
  };

  const getAllTags = (posts) => [...new Set(posts.flatMap((post) => post.tags || []))].slice(0, 10);

  const renderPost = (post) => `
    <a href="${post.url}" class="writing-item nrs-blog-index-card" data-category="${(post.tags || []).join(' ').toLowerCase()}">
      <span class="w-date">${formatDate(post.date)}</span>
      <div class="w-info">
        <span class="nrs-card-kicker">${post.label}</span>
        <span class="w-title">${post.title}</span>
        <span class="w-summary">${post.summary}</span>
        <span class="nrs-blog-tags">${(post.tags || []).map((tag) => `<b>${tag}</b>`).join('')}</span>
      </div>
      <span class="w-arrow">&rarr;</span>
    </a>
  `;

  const renderFeatured = (post) => {
    if (!featured || !post) return;
    featured.innerHTML = `
      <p class="eyebrow">Featured guide</p>
      <h2>${post.title}</h2>
      <p>${post.summary}</p>
      <div class="nrs-featured-actions">
        <a class="btn btn-primary" href="${post.url}">Read the guide</a>
        <a class="btn btn-secondary" href="/contact.html">Discuss a project</a>
      </div>
    `;
  };

  const renderFilters = (posts) => {
    if (!filters) return;
    const tags = getAllTags(posts);
    filters.innerHTML = ['All', ...tags]
      .map((tag, index) => `<button class="filter-btn${index === 0 ? ' active' : ''}" type="button" data-tag="${tag.toLowerCase()}">${tag}</button>`)
      .join('');
  };

  const renderList = (posts) => {
    list.innerHTML = posts.map(renderPost).join('');
  };

  const applyFilters = (posts) => {
    const active = filters?.querySelector('.filter-btn.active')?.dataset.tag || 'all';
    const query = (search?.value || '').trim().toLowerCase();

    const filtered = posts.filter((post) => {
      const haystack = [post.title, post.summary, post.label, ...(post.tags || [])].join(' ').toLowerCase();
      const matchesTag = active === 'all' || (post.tags || []).some((tag) => tag.toLowerCase() === active);
      const matchesQuery = !query || haystack.includes(query);
      return matchesTag && matchesQuery;
    });

    renderList(filtered);
  };

  fetch('/data/blog-posts.json?v=20260611')
    .then((response) => {
      if (!response.ok) throw new Error('Blog data request failed');
      return response.json();
    })
    .then((posts) => {
      renderFeatured(posts[0]);
      renderFilters(posts);
      renderList(posts);

      filters?.addEventListener('click', (event) => {
        const button = event.target.closest('.filter-btn');
        if (!button) return;
        filters.querySelectorAll('.filter-btn').forEach((item) => item.classList.remove('active'));
        button.classList.add('active');
        applyFilters(posts);
      });

      search?.addEventListener('input', () => applyFilters(posts));
    })
    .catch(() => {
      list.innerHTML = '<p class="body-large">Writing is temporarily unavailable. The page is still intact, because apparently even failure needs graceful styling.</p>';
    });
})();
