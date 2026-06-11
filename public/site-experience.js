(() => {
  const path = window.location.pathname === '/blog' ? '/blog/' : window.location.pathname;

  function html(strings) {
    return strings.join('');
  }

  function enhanceBlogIndex() {
    if (path !== '/blog/') return;
    const hero = document.querySelector('.hero-section');
    const list = document.querySelector('.writing-list');
    if (!hero || !list || document.querySelector('.nrs-blog-proof-grid')) return;

    document.querySelector('main')?.classList.add('nrs-blog-hub');
    hero.classList.add('nrs-blog-hub-shell');
    hero.querySelector('.hero-title')?.classList.add('nrs-blog-hub-title');
    hero.querySelector('.body-large')?.classList.add('nrs-blog-hub-copy');

    const proof = document.createElement('div');
    proof.className = 'nrs-blog-proof-grid';
    proof.innerHTML = html([
      '<article><span>01</span><strong>Hiring intent</strong><p>Guides for teams looking for product design help.</p></article>',
      '<article><span>02</span><strong>Complex UX</strong><p>Wallets, dashboards, verification, states, and flows.</p></article>',
      '<article><span>03</span><strong>Build clarity</strong><p>Figma systems, handoff, QA, and developer context.</p></article>'
    ]);
    hero.appendChild(proof);

    const controls = document.createElement('section');
    controls.className = 'section-container nrs-blog-controls-panel';
    controls.innerHTML = html([
      '<div class="search-wrapper"><input class="search-input" type="search" data-blog-search placeholder="Search by Web3, SaaS, UX audit, handoff..." aria-label="Search writing"></div>',
      '<div class="filter-row" data-blog-filters></div>'
    ]);
    list.closest('.section-container')?.insertAdjacentElement('beforebegin', controls);

    fetch('/data/blog-posts.json?v=20260611')
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((posts) => renderBlogPosts(posts, list, controls))
      .catch(() => {
        list.querySelectorAll('.writing-item').forEach((item) => item.classList.add('nrs-blog-index-card'));
      });
  }

  function renderBlogPosts(posts, list, controls) {
    const tags = ['All'].concat([...new Set(posts.flatMap((post) => post.tags || []))].slice(0, 10));
    const filters = controls.querySelector('[data-blog-filters]');
    const search = controls.querySelector('[data-blog-search]');

    filters.innerHTML = tags.map((tag, index) => '<button class="filter-btn' + (index === 0 ? ' active' : '') + '" type="button" data-tag="' + tag.toLowerCase() + '">' + tag + '</button>').join('');

    function formatDate(value) {
      return new Intl.DateTimeFormat('en', { month: 'short', day: '2-digit', year: 'numeric' }).format(new Date(value));
    }

    function postCard(post) {
      const tagHtml = (post.tags || []).map((tag) => '<b>' + tag + '</b>').join('');
      return html([
        '<a href="' + post.url + '" class="writing-item nrs-blog-index-card">',
        '<span class="w-date">' + formatDate(post.date) + '</span>',
        '<div class="w-info"><span class="nrs-card-kicker">' + post.label + '</span>',
        '<span class="w-title">' + post.title + '</span>',
        '<span class="w-summary">' + post.summary + '</span>',
        '<span class="nrs-blog-tags">' + tagHtml + '</span></div>',
        '<span class="w-arrow">&rarr;</span></a>'
      ]);
    }

    function draw() {
      const active = filters.querySelector('.active')?.dataset.tag || 'all';
      const query = (search.value || '').toLowerCase().trim();
      const filtered = posts.filter((post) => {
        const haystack = [post.title, post.summary, post.label].concat(post.tags || []).join(' ').toLowerCase();
        const tagOk = active === 'all' || (post.tags || []).some((tag) => tag.toLowerCase() === active);
        return tagOk && (!query || haystack.includes(query));
      });
      list.innerHTML = filtered.map(postCard).join('');
    }

    filters.addEventListener('click', (event) => {
      const button = event.target.closest('button');
      if (!button) return;
      filters.querySelectorAll('button').forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      draw();
    });
    search.addEventListener('input', draw);
    draw();
  }

  function addUxcelProof() {
    if (document.querySelector('.nrs-uxcel-proof')) return;
    if (!(path === '/' || path === '/about.html' || path === '/home.html' || path === '/home-v2.html')) return;

    const target = document.querySelector('.impact-summary-grid');
    if (!target) return;

    const section = document.createElement('section');
    section.className = 'nrs-uxcel-proof reveal-on-scroll';
    section.innerHTML = html([
      '<p class="eyebrow">External proof</p>',
      '<h2>Recognized by Uxcel among top product designers globally.</h2>',
      '<p>Uxcel recognized Nischhal Raj Subba in its designer rankings, including a #1 Product Designer placement and global ranking context across its design community. This is shown here as hiring proof, not random badge confetti.</p>',
      '<div class="nrs-uxcel-proof-metrics">',
      '<div><strong>#1</strong><span>Product Designer ranking mentioned in Uxcel recognition.</span></div>',
      '<div><strong>Top 10</strong><span>Global designer recognition context from Uxcel award assets.</span></div>',
      '<div><strong>500K+</strong><span>Product professionals referenced on Uxcel Rankings.</span></div>',
      '</div>',
      '<div class="nrs-featured-actions" style="margin-top:24px;display:flex;gap:12px;flex-wrap:wrap;">',
      '<a class="btn btn-primary" href="https://app.uxcel.com/ux/nischhal" target="_blank" rel="noopener noreferrer">View Uxcel profile</a>',
      '<a class="btn btn-secondary" href="https://uxcel.com/uxcel-rankings" target="_blank" rel="noopener noreferrer">View Uxcel rankings</a>',
      '</div>'
    ]);
    target.insertAdjacentElement('afterend', section);
  }

  function enhanceBlogDetail() {
    if (!path.startsWith('/blog/') || path === '/blog/') return;
    document.body.classList.add('nrs-enhanced-blog-detail');
    const article = document.querySelector('article, main .section-container');
    if (article) article.classList.add('nrs-blog-detail-surface');
  }

  function run() {
    enhanceBlogIndex();
    enhanceBlogDetail();
    addUxcelProof();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();
