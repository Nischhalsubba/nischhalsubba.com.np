(() => {
  const path = window.location.pathname === '/blog' ? '/blog/' : window.location.pathname;

  function html(strings) {
    return strings.join('');
  }

  function normalizeBlogLinks() {
    document.querySelectorAll('a[href^="/blog/"]').forEach((link) => {
      const href = link.getAttribute('href');
      if (!href || href === '/blog/' || href.endsWith('/')) return;
      link.setAttribute('href', href.replace(/\.html$/, ''));
    });
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
      '<article><span>01</span><strong>Useful for hiring</strong><p>Articles shaped around decisions product teams actually need to make.</p></article>',
      '<article><span>02</span><strong>Complex UX</strong><p>Wallets, dashboards, verification, states, handoff, and product flows.</p></article>',
      '<article><span>03</span><strong>Build clarity</strong><p>Writing that connects interface decisions with engineering reality.</p></article>'
    ]);
    hero.appendChild(proof);

    const controls = document.createElement('section');
    controls.className = 'section-container nrs-blog-controls-panel';
    controls.innerHTML = html([
      '<div class="search-wrapper"><input class="search-input" type="search" data-blog-search placeholder="Search Web3, SaaS, audits, handoff..." aria-label="Search writing"></div>',
      '<div class="filter-row" data-blog-filters></div>'
    ]);
    list.closest('.section-container')?.insertAdjacentElement('beforebegin', controls);

    fetch('/data/blog-posts.json?v=20260612')
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
      normalizeBlogLinks();
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

  const projectCopy = {
    yarsha: {
      focus: [
        ['Messaging-first Web3 UX', 'Made chat, groups, wallet actions, and bot interactions feel like one coherent mobile product instead of separate crypto features stitched together.'],
        ['Wallet and transfer review states', 'Clarified amounts, recipients, network context, fees, and confirmation moments so users could pause before committing risky actions.'],
        ['Signing context', 'Reduced blind-signing anxiety by making action intent, status, and next steps visible inside the flow.'],
        ['Reusable mobile patterns', 'Kept recurring states, cards, menus, and interaction patterns consistent enough for a product system, not just a screen set.']
      ]
    },
    mokshya: {
      focus: [
        ['Homepage hierarchy', 'Reordered the story so visitors could understand what Mokshya does, who it serves, and why the protocol matters before reading technical details.'],
        ['Protocol storytelling', 'Turned dense Web3 language into clearer sections that explain value, experiments, infrastructure, and trust signals.'],
        ['Developer-facing context', 'Balanced product ambition with practical cues for builders, partners, and protocol-aware visitors.'],
        ['Responsive website direction', 'Designed sections that keep the narrative legible across desktop and smaller screens without losing the product mood.']
      ]
    },
    'hamro-idea': {
      focus: [
        ['Service hierarchy', 'Separated software services, process, proof, and contact paths so clients could quickly understand where the studio fits.'],
        ['Local business clarity', 'Wrote and structured content for founders and businesses that need practical software help without agency jargon.'],
        ['Conversion paths', 'Made enquiry moments easier to find through clearer CTAs, section order, and service framing.'],
        ['Static website polish', 'Prepared the site as a clean, fast, SEO-aware front-end build instead of a bloated marketing page.']
      ]
    },
    pihub: {
      focus: [
        ['Fintech state clarity', 'Made account, product, credit, and verification states easier to distinguish in creditor, investor, and admin workflows.'],
        ['Trust-sensitive flows', 'Used clearer labels, review moments, and status language for actions that carry financial risk.'],
        ['Role-based dashboards', 'Separated user needs across creditors, investors, and admins instead of forcing one generic dashboard pattern.'],
        ['Prototype proof', 'Kept prototype paths available so the flows can be reviewed as product decisions, not only static screens.']
      ]
    },
    zapp: {
      focus: [
        ['Customer booking flow', 'Clarified request, pickup, delivery, tracking, and support moments for a logistics app experience.'],
        ['Driver task flow', 'Structured driver-side actions around jobs, status updates, and operational context.'],
        ['Tracking and visibility', 'Made delivery progress, timing, and next actions easier to scan for customers and operators.'],
        ['Admin exploration', 'Outlined operational dashboard ideas for reviewing logistics activity beyond the mobile screens.']
      ]
    },
    masteriyo: {
      focus: [
        ['Course creation UX', 'Contributed product UI thinking around course-building workflows for WordPress LMS users.'],
        ['Student learning flows', 'Worked within learning-product patterns where progress, lessons, quizzes, and completion states needed clarity.'],
        ['Admin-facing patterns', 'Supported interface decisions for creators and admins managing course content.'],
        ['Team contribution', 'Kept the case study scoped to contribution work instead of pretending to own the whole product.']
      ]
    },
    morajaa: {
      focus: [
        ['Premium service positioning', 'Structured the website around consulting credibility, sector clarity, and high-consideration service discovery.'],
        ['Lead pathway design', 'Made contact and enquiry paths more obvious without making the page feel desperate for clicks.'],
        ['Sector and service hierarchy', 'Separated what the business offers from who it serves so visitors can orient faster.'],
        ['Figma prototype', 'Prepared a reviewable prototype that shows page flow, content rhythm, and visual direction.']
      ]
    },
    orkest: {
      focus: [
        ['Modular SaaS architecture', 'Organized CRM, sales, inventory, finance, and workspace ideas into a product structure that could scale.'],
        ['Workflow clarity', 'Mapped business operations into flows instead of treating every module like an isolated admin page.'],
        ['Dashboard hierarchy', 'Prioritized what teams need to see first across dense product areas.'],
        ['Reusable SaaS patterns', 'Kept layouts and states repeatable so the product could grow without visual drift.']
      ]
    },
    splashnode: {
      focus: [
        ['Technical product explanation', 'Translated display, content, data, and device-management features into clearer website sections.'],
        ['Capability framing', 'Connected platform features to buyer benefits without burying the page in technical copy.'],
        ['Responsive front-end', 'Built the page direction so sections stay understandable across screen sizes.'],
        ['Action paths', 'Clarified where visitors should explore, compare, or start a conversation.']
      ]
    },
    'grid-labs': {
      focus: [
        ['Hosting buyer decisions', 'Focused the landing page around domain search, pricing, services, trust, and contact.'],
        ['Static Bootstrap build', 'Used a straightforward front-end structure suitable for a hosting-service landing page.'],
        ['Pricing clarity', 'Presented plan and feature areas so visitors could compare without digging.'],
        ['Service scanning', 'Organized cards and sections for quick skimming instead of heavy platform storytelling.']
      ]
    },
    'zakra-furniture': {
      focus: [
        ['Starter-site structure', 'Designed reusable furniture-site sections for products, categories, business details, and contact.'],
        ['WordPress implementation', 'Worked within Zakra and Elementor patterns rather than inventing a custom product from scratch.'],
        ['Catalog presentation', 'Kept product browsing and business information clear for furniture-shop visitors.'],
        ['Theme-ready sections', 'Built the case around a practical starter layout that others could reuse.']
      ]
    },
    designerex: {
      focus: [
        ['Marketplace contribution', 'Supported product design work for a luxury fashion rental marketplace experience.'],
        ['Listing quality', 'Focused on product discovery, item presentation, and browsing patterns that matter in rental decisions.'],
        ['Premium visual tone', 'Worked within a marketplace context where trust and perceived quality affect user confidence.'],
        ['Scoped ownership', 'Kept the page honest by framing the work as contribution, not full product ownership.']
      ]
    },
    sassboilerplate: {
      focus: [
        ['Sass organization', 'Created a starter structure for cleaner static website styling and repeatable front-end setup.'],
        ['Developer workflow', 'Reduced setup repetition for small sites by packaging common front-end patterns.'],
        ['Static site speed', 'Kept the project lightweight and practical instead of turning a starter into a framework circus.'],
        ['Reusable foundation', 'Made the tool useful as a base for future static builds and experiments.']
      ]
    },
    'neverwinter-parser': {
      focus: [
        ['Combat-log readability', 'Turned dense game data into a more readable product direction for reviewing encounters.'],
        ['Data-heavy UI', 'Structured filters, summaries, and review patterns for users trying to understand performance.'],
        ['Encounter feedback', 'Focused on making results useful after gameplay instead of dumping raw logs on users.'],
        ['Concept clarity', 'Kept the page scoped as an ongoing desktop-tool concept with honest product framing.']
      ]
    }
  };

  function enhanceRelatedPages(article) {
    const headings = [...article.querySelectorAll('h2')];
    const heading = headings.find((item) => item.textContent.trim().toLowerCase() === 'related pages');
    if (!heading || heading.closest('.nrs-related-pages')) return;

    const list = heading.nextElementSibling?.classList?.contains('writing-list') ? heading.nextElementSibling : null;
    if (!list) return;

    const section = document.createElement('section');
    section.className = 'nrs-related-pages';
    const intro = document.createElement('div');
    intro.className = 'nrs-related-pages-intro';
    const copy = document.createElement('p');
    copy.textContent = 'Useful next pages if you want to check project proof, compare services, or start a design conversation.';

    heading.parentElement.insertBefore(section, heading);
    section.appendChild(intro);
    intro.appendChild(heading);
    intro.appendChild(copy);
    section.appendChild(list);

    list.querySelectorAll('.writing-item').forEach((item, index) => {
      item.classList.add('nrs-related-card');
      item.dataset.relatedIndex = String(index + 1).padStart(2, '0');
    });
  }

  function enhanceBlogDetail() {
    if (!path.startsWith('/blog/') || path === '/blog/') return;
    document.body.classList.add('nrs-enhanced-blog-detail');
    const article = document.querySelector('article, main .section-container');
    if (!article) return;

    article.classList.add('nrs-blog-detail-surface');

    const title = article.querySelector('h1, .hero-title');
    const lead = article.querySelector('.body-large, .section-lead, p');
    if (title && !document.querySelector('.nrs-article-frame')) {
      const frame = document.createElement('div');
      frame.className = 'nrs-article-frame';
      title.parentElement?.insertBefore(frame, title);
      frame.appendChild(title);
      if (lead && lead.parentElement === article) frame.appendChild(lead);
    }

    enhanceRelatedPages(article);
  }

  function applyProjectSpecificCopy(main) {
    const slug = path.replace(/^\/project-/, '').replace(/\.html$/, '');
    const data = projectCopy[slug];
    if (!data) return;

    const roleSection = [...main.querySelectorAll('.nrs-case-section')].find((section) => {
      return /my role/i.test(section.textContent || '');
    });

    const roleCards = roleSection ? [...roleSection.querySelectorAll('.journey-card')] : [];
    data.focus.forEach(([title, copy], index) => {
      const card = roleCards[index];
      if (!card) return;
      const heading = card.querySelector('h3');
      const paragraph = card.querySelector('p');
      if (heading) heading.textContent = title;
      if (paragraph) paragraph.textContent = copy;
    });
  }

  function enhanceProjectDetail() {
    if (!/\/project-[^/]+\.html$/.test(path)) return;

    document.body.classList.add('nrs-case-study-page');
    const main = document.querySelector('main.container');
    if (!main) return;
    main.classList.add('nrs-case-study');

    const hero = main.querySelector('.hero-section');
    const image = main.querySelector('.case-hero-img-container');
    const snapshot = main.querySelector('.snapshot-grid')?.closest('.section-container');

    if (hero) hero.classList.add('nrs-case-hero');
    if (image) image.classList.add('nrs-case-visual');
    if (snapshot) snapshot.classList.add('nrs-case-snapshot-section');

    const sections = [...main.querySelectorAll('.section-container.reveal-on-scroll')].filter((section) => !section.matches('#proof'));
    sections.forEach((section, index) => {
      section.classList.add('nrs-case-section');
      const title = section.querySelector('.section-title, h2');
      const label = section.querySelector('.case-label, .eyebrow');
      const body = section.querySelector('.body-large, .section-lead');
      const cards = section.querySelector('.journey-grid, .case-list, .prototype-link-list, .case-callout');

      if (!section.querySelector('.nrs-case-section-head') && (title || label || body)) {
        const head = document.createElement('div');
        head.className = 'nrs-case-section-head';
        if (label) head.appendChild(label);
        if (title) head.appendChild(title);
        if (body) head.appendChild(body);
        section.insertBefore(head, section.firstChild);
      }

      if (cards && !cards.closest('.nrs-case-section-body')) {
        const sectionBody = document.createElement('div');
        sectionBody.className = 'nrs-case-section-body';
        cards.parentElement?.insertBefore(sectionBody, cards);
        sectionBody.appendChild(cards);
      }

      section.dataset.caseStep = String(index + 1).padStart(2, '0');
    });

    const proof = main.querySelector('#proof');
    if (proof) proof.classList.add('nrs-case-proof');
    applyProjectSpecificCopy(main);
  }

  function run() {
    normalizeBlogLinks();
    enhanceBlogIndex();
    enhanceBlogDetail();
    enhanceProjectDetail();
    addUxcelProof();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();
