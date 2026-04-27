/*
 * Nischhal Portfolio Global UI
 * Handles theme, navigation, search/filter, page transitions, skeleton loading,
 * resume download, share actions, and project/blog detail navigation.
 */

(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  const routes = {
    projects: [
      { title: 'Yarsha', type: 'Web3 Messaging App', url: '/project-yarsha.html' },
      { title: 'Mokshya.io', type: 'Web3 Protocol Website', url: '/project-mokshya.html' },
      { title: 'Hamro Idea', type: 'Brand + Website', url: '/project-hamro-idea.html' },
      { title: 'Morajaa', type: 'B2B Consulting Website', url: '/project-morajaa.html' },
      { title: 'piHub', type: 'Fintech App Experience', url: '/project-pihub.html' },
      { title: 'Masteriyo LMS', type: 'EdTech Design Contribution', url: '/project-masteriyo.html' },
      { title: 'Zapp Today', type: 'Logistics Mobile App', url: '/project-zapp.html' },
      { title: 'Orkest HQ', type: 'Modular SaaS UX', url: '/project-orkest.html' },
      { title: 'Splashnode', type: 'Website Design + Front-End', url: '/project-splashnode.html' },
      { title: 'Neverwinter Live Parser', type: 'Gaming UX + Desktop Tool', url: '/project-neverwinter-parser.html' },
      { title: 'Grid Labs Hosting', type: 'Hosting Landing Page', url: '/project-grid-labs.html' },
      { title: 'Zakra Furniture', type: 'WordPress Starter Website', url: '/project-zakra-furniture.html' },
      { title: 'Designerex', type: 'Marketplace Design Contribution', url: '/project-designerex.html' },
      { title: 'sassBoilerplate', type: 'Front-End Workflow Toolkit', url: '/project-sassboilerplate.html' }
    ],
    blogs: [
      { title: 'Designing Web3 Products Without Making Users Feel Lost', type: 'Web3 UX', url: '/blog/blog-web3-products.html' },
      { title: 'Why Good Handoff Matters More Than Perfect Screens', type: 'Design Handoff', url: '/blog/blog-good-handoff.html' },
      { title: 'What I Learned Designing My Portfolio Like a Product', type: 'Portfolio Strategy', url: '/blog/blog-portfolio-product.html' },
      { title: 'Designing Service Websites That Explain the Business Clearly', type: 'Website UX', url: '/blog/blog-service-websites.html' },
      { title: 'What Gaming Taught Me About Interface Clarity', type: 'Gaming UX', url: '/blog/blog-gaming-interface-clarity.html' },
      { title: 'How I Think About Design Systems as a Front-End-Aware Designer', type: 'Design Systems', url: '/blog/blog-design-systems-front-end.html' }
    ]
  };

  const enhancementStyles = `
    .page-skeleton {
      position: fixed;
      inset: 0;
      z-index: 99998;
      display: grid;
      place-items: center;
      background: var(--bg-root, #050505);
      transition: opacity .45s ease, visibility .45s ease;
    }
    .page-skeleton.is-hidden { opacity: 0; visibility: hidden; pointer-events: none; }
    .skeleton-card { width: min(720px, calc(100vw - 48px)); }
    .skeleton-line, .skeleton-block {
      display: block;
      border-radius: 999px;
      background: linear-gradient(90deg, rgba(255,255,255,.06), rgba(255,255,255,.14), rgba(255,255,255,.06));
      background-size: 240% 100%;
      animation: skeleton-pulse 1.1s linear infinite;
    }
    [data-theme="light"] .skeleton-line,
    [data-theme="light"] .skeleton-block { background: linear-gradient(90deg, rgba(0,0,0,.05), rgba(0,0,0,.12), rgba(0,0,0,.05)); background-size: 240% 100%; }
    .skeleton-line { height: 18px; margin: 14px auto; }
    .skeleton-line.wide { width: 78%; }
    .skeleton-line.medium { width: 56%; }
    .skeleton-line.short { width: 34%; }
    .skeleton-block { width: 100%; height: 220px; border-radius: 28px; margin-top: 32px; }
    @keyframes skeleton-pulse { from { background-position: 200% 0; } to { background-position: -200% 0; } }

    .page-transition-overlay {
      position: fixed;
      inset: 0;
      z-index: 99997;
      background: var(--bg-root, #050505);
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
      transform: translateY(8px);
      transition: opacity .28s ease, transform .28s ease, visibility .28s ease;
    }
    body.page-is-leaving .page-transition-overlay { opacity: 1; visibility: visible; transform: translateY(0); }
    body.page-is-leaving main,
    body.page-is-leaving .site-footer { opacity: .08; transform: translateY(-8px); transition: opacity .22s ease, transform .22s ease; }

    .detail-continuation {
      position: relative;
      z-index: var(--z-content, 10);
      padding: clamp(72px, 10vw, 120px) var(--container-padding, 32px);
      border-top: 1px solid var(--border-faint, rgba(255,255,255,.08));
    }
    .detail-continuation-inner { max-width: var(--max-width, 1200px); margin: 0 auto; }
    .detail-continuation-eyebrow { color: var(--text-tertiary); text-transform: uppercase; letter-spacing: .14em; font-size: .78rem; margin-bottom: 16px; }
    .detail-continuation-title { font-size: clamp(2rem, 4vw, 3.2rem); margin-bottom: 32px; }
    .detail-nav-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px; }
    .detail-nav-card {
      min-height: 180px;
      padding: clamp(24px, 4vw, 40px);
      border: 1px solid var(--border-faint, rgba(255,255,255,.08));
      border-radius: 24px;
      background: var(--bg-surface, #0a0a0a);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: transform .3s ease, border-color .3s ease, background .3s ease;
    }
    .detail-nav-card:hover { transform: translateY(-6px); border-color: var(--border-light, rgba(255,255,255,.18)); }
    .detail-nav-kicker { color: var(--text-tertiary); text-transform: uppercase; letter-spacing: .12em; font-size: .75rem; margin-bottom: 18px; }
    .detail-nav-card h3 { font-size: clamp(1.4rem, 2.5vw, 2rem); margin: 0 0 12px; }
    .detail-nav-type { color: var(--text-secondary); margin: 0; }
    .detail-nav-arrow { margin-top: 24px; color: var(--accent-blue, #3B82F6); font-weight: 700; }

    .site-footer.auto-footer { margin-top: 0; }
    .footer-mini-grid { display: grid; grid-template-columns: 1.3fr 1fr; gap: 48px; align-items: start; }
    .footer-mini-links { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px; }
    .footer-mini-links a { display: block; color: var(--text-secondary); margin-bottom: 12px; }
    .footer-mini-links a:hover { color: var(--text-primary); }

    @media (max-width: 768px) {
      .detail-nav-grid, .footer-mini-grid, .footer-mini-links { grid-template-columns: 1fr; }
      .detail-nav-card { min-height: 150px; }
      .page-transition-overlay, .page-skeleton { display: none; }
    }
  `;

  function injectGlobalStyles() {
    if (document.getElementById('nrs-enhancement-styles')) return;
    const style = document.createElement('style');
    style.id = 'nrs-enhancement-styles';
    style.textContent = enhancementStyles;
    document.head.appendChild(style);
  }

  function showSkeleton() {
    if (reducedMotion || isTouch || document.getElementById('page-skeleton')) return;
    const skeleton = document.createElement('div');
    skeleton.id = 'page-skeleton';
    skeleton.className = 'page-skeleton';
    skeleton.setAttribute('aria-hidden', 'true');
    skeleton.innerHTML = `<div class="skeleton-card"><span class="skeleton-line short"></span><span class="skeleton-line wide"></span><span class="skeleton-line medium"></span><span class="skeleton-block"></span></div>`;
    document.body.appendChild(skeleton);
    const hide = () => {
      skeleton.classList.add('is-hidden');
      setTimeout(() => skeleton.remove(), 480);
    };
    window.addEventListener('load', hide, { once: true });
    setTimeout(hide, 900);
  }

  function initPageTransition() {
    if (reducedMotion || isTouch || document.getElementById('page-transition-overlay')) return;
    const overlay = document.createElement('div');
    overlay.id = 'page-transition-overlay';
    overlay.className = 'page-transition-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    document.body.appendChild(overlay);

    document.addEventListener('click', (event) => {
      const link = event.target.closest('a[href]');
      if (!link) return;
      const href = link.getAttribute('href') || '';
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
      if (link.target === '_blank' || link.hasAttribute('download')) return;

      const url = new URL(href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.hash) return;

      event.preventDefault();
      document.body.classList.add('page-is-leaving');
      setTimeout(() => { window.location.href = url.href; }, 240);
    });
  }

  function initTheme() {
    const button = document.getElementById('theme-toggle');
    const root = document.documentElement;
    const saved = localStorage.getItem('theme');
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    const theme = saved || (prefersLight ? 'light' : 'dark');

    function setTheme(next) {
      root.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      if (button) button.setAttribute('aria-label', next === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
    }

    setTheme(theme);
    if (button) button.addEventListener('click', () => setTheme(root.getAttribute('data-theme') === 'light' ? 'dark' : 'light'));
  }

  function initMobileMenu() {
    const button = document.querySelector('.mobile-nav-toggle');
    if (!button) return;
    const overlay = document.querySelector('.mobile-nav-overlay');
    if (overlay && !overlay.id) overlay.id = 'mobile-nav-overlay';
    if (overlay) button.setAttribute('aria-controls', overlay.id);
    button.setAttribute('aria-expanded', 'false');
    button.addEventListener('click', () => {
      const open = document.body.classList.toggle('menu-open');
      button.setAttribute('aria-expanded', String(open));
    });
    document.querySelectorAll('.mobile-nav-links a').forEach((link) => {
      link.addEventListener('click', () => {
        document.body.classList.remove('menu-open');
        button.setAttribute('aria-expanded', 'false');
      });
    });
  }

  function initGridCanvas() {
    const canvas = document.getElementById('grid-canvas');
    if (!canvas || reducedMotion || isTouch) return;
    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let mouse = { x: -1000, y: -1000 };

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);
      const light = document.documentElement.getAttribute('data-theme') === 'light';
      const grid = 60;
      ctx.strokeStyle = light ? 'rgba(0,0,0,.05)' : 'rgba(255,255,255,.05)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x <= width; x += grid) { ctx.moveTo(x, 0); ctx.lineTo(x, height); }
      for (let y = 0; y <= height; y += grid) { ctx.moveTo(0, y); ctx.lineTo(width, y); }
      ctx.stroke();

      const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 380);
      gradient.addColorStop(0, light ? 'rgba(12,140,233,.14)' : 'rgba(59,130,246,.16)');
      gradient.addColorStop(1, 'rgba(59,130,246,0)');
      ctx.strokeStyle = gradient;
      ctx.beginPath();
      for (let x = 0; x <= width; x += grid) { ctx.moveTo(x, Math.max(0, mouse.y - 380)); ctx.lineTo(x, Math.min(height, mouse.y + 380)); }
      for (let y = 0; y <= height; y += grid) { ctx.moveTo(Math.max(0, mouse.x - 380), y); ctx.lineTo(Math.min(width, mouse.x + 380), y); }
      ctx.stroke();
      requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', (event) => { mouse = { x: event.clientX, y: event.clientY }; });
    draw();
  }

  function initActiveNavigation() {
    const path = window.location.pathname;
    document.querySelectorAll('.nav-link, .mobile-nav-links a').forEach((link) => {
      const href = new URL(link.getAttribute('href'), window.location.origin).pathname;
      const active = (path === '/' && href === '/') ||
        (path.startsWith('/project-') && href.includes('projects')) ||
        (path.includes('/blog') && href.includes('blog')) ||
        (path === href);
      link.classList.toggle('active', active);
    });
  }

  function initFilters() {
    const searchWork = document.getElementById('search-work');
    const searchBlog = document.getElementById('search-blog');
    const filterButtons = document.querySelectorAll('.filter-btn, .blog-filter-btn');

    function apply(scope = document) {
      const activeFilter = document.querySelector('.filter-btn.active, .blog-filter-btn.active')?.dataset.filter || 'all';
      const query = (searchWork?.value || searchBlog?.value || '').toLowerCase().trim();
      scope.querySelectorAll('.project-card, .writing-item').forEach((item) => {
        const tags = (item.dataset.category || '').toLowerCase();
        const text = item.textContent.toLowerCase();
        const matchesFilter = activeFilter === 'all' || tags.includes(activeFilter);
        const matchesQuery = !query || text.includes(query);
        item.style.display = matchesFilter && matchesQuery ? '' : 'none';
      });
    }

    filterButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const group = button.classList.contains('blog-filter-btn') ? '.blog-filter-btn' : '.filter-btn';
        document.querySelectorAll(group).forEach((btn) => btn.classList.remove('active'));
        button.classList.add('active');
        apply();
      });
    });
    [searchWork, searchBlog].filter(Boolean).forEach((input) => input.addEventListener('input', () => apply()));
    document.getElementById('clear-work')?.addEventListener('click', () => {
      if (searchWork) { searchWork.value = ''; apply(); searchWork.focus(); }
    });
  }

  function escapePdfText(value) {
    return String(value).replace(/[\\()]/g, '\\$&').replace(/[\r\n]+/g, ' ');
  }

  function buildResumePdf() {
    const lines = [
      { text: 'Nischhal Raj Subba', size: 22 },
      { text: 'Senior UI/Product Designer | Consumer Mobile Apps + Design Systems', size: 12 },
      { text: 'Lalitpur (Kathmandu Valley), Nepal | hinischalsubba@gmail.com | +977 9842552348', size: 10 },
      { text: 'Uxcel: https://app.uxcel.com/ux/nischhal | GitHub: https://github.com/Nischhalsubba | Behance: https://www.behance.net/nischhal', size: 9 },
      { text: '', size: 8 },
      { text: 'SUMMARY', size: 13 },
      { text: 'Senior UI/Product Designer with 6+ years of experience designing consumer mobile apps, product-led experiences, and scalable design systems.', size: 10 },
      { text: 'Strong in original visual direction, high-fidelity mobile UI, component systems, interactive prototypes, and developer-ready handoffs.', size: 10 },
      { text: '', size: 8 },
      { text: 'CORE SKILLS', size: 13 },
      { text: 'Product Design (UI/UX), Design Systems, Enterprise & Dashboard UX, Prototyping, Developer Handoff, Design QA, Cross-functional Collaboration.', size: 10 },
      { text: '', size: 8 },
      { text: 'AWARDS', size: 13 },
      { text: 'Ranked #1 Designer - Uxcel Global Rankings 2024', size: 10 },
      { text: '#1 Product Designer - Uxcel Global Rankings 2024', size: 10 },
      { text: 'Top 10 Product Designer - Uxcel Global Rankings 2023', size: 10 },
      { text: '', size: 8 },
      { text: 'SELECTED PROJECTS', size: 13 },
      { text: 'Yarsha - Web3 Chat + Transfers: designed messaging and transfer flows under Web3 constraints.', size: 10 },
      { text: 'Morajaa - Consulting Website + Lead Collection Flow: designed service/sector page architecture and segmented inquiry flows.', size: 10 },
      { text: 'Zapp Today - Delivery + Scheduling Mobile App: owned mobile app UX/UI for on-demand delivery and scheduled bookings.', size: 10 },
      { text: 'MAS DataHub - Enterprise Data Integration Platform: designed workflow-heavy UX for enterprise data integration and automation.', size: 10 },
      { text: '', size: 8 },
      { text: 'EXPERIENCE', size: 13 },
      { text: 'Idealaya - Product Designer, Aug 2025 - Dec 2025', size: 10 },
      { text: 'Mokshya Protocol - Product Designer, Mar 2024 - Jul 2025', size: 10 },
      { text: 'Tegzy - Lead User Experience Designer, Feb 2023 - Nov 2023', size: 10 },
      { text: 'ESR Tech - Senior UI/UX Designer, Oct 2021 - Feb 2023', size: 10 },
      { text: 'ThemeGrill - Senior UI/UX Designer, Apr 2021 - Sep 2021', size: 10 },
      { text: 'Gurzu - UI/UX Designer, Jul 2019 - Jan 2021', size: 10 },
      { text: 'Diagonal Softwares - User Experience Designer (Part-time), Apr 2019 - Sep 2020', size: 10 },
      { text: '', size: 8 },
      { text: 'CERTIFICATIONS', size: 13 },
      { text: 'Uxcel UI Designer, Product Designer, UX Designer, UX Writer, and UX Researcher certifications.', size: 10 },
      { text: 'BA (Hons) Business Management - University of Wolverhampton, 2014 - 2018.', size: 10 }
    ];

    const pageWidth = 612;
    const pageHeight = 792;
    const marginX = 48;
    const startY = 744;
    const lineGap = 16;
    let objects = [];
    let pageIds = [];

    function addObject(content) {
      const id = objects.length + 1;
      objects.push(`${id} 0 obj\n${content}\nendobj\n`);
      return id;
    }

    const catalogId = addObject('<< /Type /Catalog /Pages 2 0 R >>');
    const pagesPlaceholderId = addObject('PAGES_PLACEHOLDER');
    const fontId = addObject('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');

    let currentLines = [];
    let y = startY;
    const pages = [];
    lines.forEach((line) => {
      const size = line.size || 10;
      if (y < 72) {
        pages.push(currentLines);
        currentLines = [];
        y = startY;
      }
      currentLines.push({ ...line, y });
      y -= line.text ? lineGap + Math.max(0, size - 10) : 8;
    });
    if (currentLines.length) pages.push(currentLines);

    pages.forEach((pageLines) => {
      const commands = pageLines.map((line) => {
        if (!line.text) return '';
        return `BT /F1 ${line.size || 10} Tf ${marginX} ${line.y} Td (${escapePdfText(line.text)}) Tj ET`;
      }).join('\n');
      const contentId = addObject(`<< /Length ${commands.length} >>\nstream\n${commands}\nendstream`);
      const pageId = addObject(`<< /Type /Page /Parent ${pagesPlaceholderId} 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 ${fontId} 0 R >> >> /Contents ${contentId} 0 R >>`);
      pageIds.push(pageId);
    });

    objects[pagesPlaceholderId - 1] = `${pagesPlaceholderId} 0 obj\n<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${pageIds.length} >>\nendobj\n`;

    let pdf = '%PDF-1.4\n';
    const offsets = [0];
    objects.forEach((obj) => {
      offsets.push(pdf.length);
      pdf += obj;
    });
    const xrefOffset = pdf.length;
    pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
    offsets.slice(1).forEach((offset) => { pdf += `${String(offset).padStart(10, '0')} 00000 n \n`; });
    pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
    return new Blob([pdf], { type: 'application/pdf' });
  }

  function initResumeDownload() {
    const resumeLinks = document.querySelectorAll('a[href$="resume.pdf"], .floating-resume-btn');
    resumeLinks.forEach((link) => {
      link.setAttribute('download', 'Nischhal-Raj-Subba-Resume-2026.pdf');
      link.addEventListener('click', (event) => {
        event.preventDefault();
        const blob = buildResumePdf();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Nischhal-Raj-Subba-Resume-2026.pdf';
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 500);
      });
    });
  }

  function createAutoFooter() {
    const footer = document.createElement('footer');
    footer.className = 'site-footer auto-footer';
    footer.innerHTML = `
      <div class="container footer-mini-grid">
        <div>
          <h2 style="font-size:clamp(2.4rem,5vw,4rem);margin-bottom:20px;">Let's design something clear.</h2>
          <p style="color:var(--text-secondary);max-width:560px;">Open for product design, Web3 UX, SaaS dashboards, service websites, design systems, and developer-ready handoff.</p>
          <a href="mailto:hinischalsubba@gmail.com" class="footer-email-btn">hinischalsubba@gmail.com</a>
        </div>
        <div class="footer-mini-links">
          <div><h5>Sitemap</h5><a href="/">Home</a><a href="/projects.html">Work</a><a href="/about.html">About</a><a href="/blog/">Writing</a><a href="/contact.html">Contact</a></div>
          <div><h5>Focus</h5><a href="/project-yarsha.html">Web3 UX</a><a href="/project-orkest.html">SaaS UX</a><a href="/project-pihub.html">Fintech UX</a><a href="/blog/blog-good-handoff.html">Design Handoff</a></div>
        </div>
      </div>
      <div class="container footer-bottom-bar"><span>(c) 2026 Nischhal Raj Subba. Product Designer in Nepal.</span></div>`;
    return footer;
  }

  function initDetailContinuation() {
    const path = window.location.pathname;
    const isProject = path.includes('/project-');
    const isBlog = path.includes('/blog/blog-');
    if (!isProject && !isBlog) return;

    const collection = isProject ? routes.projects : routes.blogs;
    const index = collection.findIndex((item) => item.url === path || path.endsWith(item.url));
    if (index === -1 || document.querySelector('.detail-continuation')) return;

    const previous = collection[(index - 1 + collection.length) % collection.length];
    const next = collection[(index + 1) % collection.length];
    const label = isProject ? 'case study' : 'article';
    const section = document.createElement('section');
    section.className = 'detail-continuation';
    section.innerHTML = `
      <div class="detail-continuation-inner">
        <p class="detail-continuation-eyebrow">Continue exploring</p>
        <h2 class="detail-continuation-title">Read the previous or next ${label}.</h2>
        <div class="detail-nav-grid">
          <a class="detail-nav-card" href="${previous.url}"><div><span class="detail-nav-kicker">Previous ${label}</span><h3>${previous.title}</h3><p class="detail-nav-type">${previous.type}</p></div><span class="detail-nav-arrow">← View previous</span></a>
          <a class="detail-nav-card" href="${next.url}"><div><span class="detail-nav-kicker">Next ${label}</span><h3>${next.title}</h3><p class="detail-nav-type">${next.type}</p></div><span class="detail-nav-arrow">View next →</span></a>
        </div>
      </div>`;

    let footer = document.querySelector('.site-footer');
    if (!footer) {
      footer = createAutoFooter();
      document.body.appendChild(section);
      document.body.appendChild(footer);
      return;
    }
    footer.parentNode.insertBefore(section, footer);
  }

  function initShareButtons() {
    document.querySelectorAll('[data-share]').forEach((button) => {
      button.addEventListener('click', async (event) => {
        event.preventDefault();
        const platform = button.dataset.share;
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent(document.querySelector('h1')?.innerText || document.title);
        if (platform === 'copy' && navigator.clipboard) {
          await navigator.clipboard.writeText(window.location.href);
          button.classList.add('copied');
          setTimeout(() => button.classList.remove('copied'), 1600);
          return;
        }
        if (platform === 'native' && navigator.share) {
          await navigator.share({ title: document.title, url: window.location.href }).catch(() => {});
          return;
        }
        const targets = {
          x: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
          linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
        };
        if (targets[platform]) window.open(targets[platform], '_blank', 'noopener,noreferrer');
      });
    });
  }

  function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const button = form.querySelector('button[type="submit"], button');
      const name = form.querySelector('[name="name"]')?.value || '';
      const email = form.querySelector('[name="email"]')?.value || '';
      const message = form.querySelector('[name="message"]')?.value || '';
      const subject = encodeURIComponent(`Portfolio inquiry from ${name || 'website visitor'}`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nProject brief:\n${message}`);
      if (button) button.textContent = 'Opening email...';
      window.location.href = `mailto:hinischalsubba@gmail.com?subject=${subject}&body=${body}`;
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    injectGlobalStyles();
    showSkeleton();
    initTheme();
    initMobileMenu();
    initGridCanvas();
    initActiveNavigation();
    initFilters();
    initPageTransition();
    initResumeDownload();
    initDetailContinuation();
    initShareButtons();
    initContactForm();
  });
})();
