/*
 * Nischhal Portfolio Global UI
 * Handles theme, mobile navigation, search/filter, light page transitions,
 * share actions, contact mailto behavior, and optional canvas grid.
 *
 * Detail page previous/next navigation lives in /public/detail-navigation.js.
 * SEO/schema/FAQ/performance enhancements live in /public/seo-enhancements.js.
 */

(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  const enhancementStyles = `
    .page-transition-overlay {
      position: fixed;
      inset: 0;
      z-index: 99997;
      background: var(--bg-root, #050505);
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
      transform: translateY(8px);
      transition: opacity .24s ease, transform .24s ease, visibility .24s ease;
    }
    body.page-is-leaving .page-transition-overlay { opacity: 1; visibility: visible; transform: translateY(0); }
    body.page-is-leaving main,
    body.page-is-leaving .site-footer { opacity: .08; transform: translateY(-8px); transition: opacity .2s ease, transform .2s ease; }

    @media (max-width: 768px), (prefers-reduced-motion: reduce) {
      .page-transition-overlay,
      #grid-canvas,
      .custom-cursor-dot,
      .custom-cursor-outline { display: none !important; }
    }
  `;

  function injectGlobalStyles() {
    if (document.getElementById('nrs-global-ui-styles')) return;
    const style = document.createElement('style');
    style.id = 'nrs-global-ui-styles';
    style.textContent = enhancementStyles;
    document.head.appendChild(style);
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
      setTimeout(() => { window.location.href = url.href; }, 220);
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
    if (!canvas || reducedMotion || isTouch || window.innerWidth < 900) return;

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

      ctx.strokeStyle = light ? 'rgba(0,0,0,.045)' : 'rgba(255,255,255,.045)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x <= width; x += grid) { ctx.moveTo(x, 0); ctx.lineTo(x, height); }
      for (let y = 0; y <= height; y += grid) { ctx.moveTo(0, y); ctx.lineTo(width, y); }
      ctx.stroke();

      const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 320);
      gradient.addColorStop(0, light ? 'rgba(12,140,233,.12)' : 'rgba(59,130,246,.14)');
      gradient.addColorStop(1, 'rgba(59,130,246,0)');
      ctx.strokeStyle = gradient;
      ctx.beginPath();
      for (let x = 0; x <= width; x += grid) { ctx.moveTo(x, Math.max(0, mouse.y - 320)); ctx.lineTo(x, Math.min(height, mouse.y + 320)); }
      for (let y = 0; y <= height; y += grid) { ctx.moveTo(Math.max(0, mouse.x - 320), y); ctx.lineTo(Math.min(width, mouse.x + 320), y); }
      ctx.stroke();

      requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', (event) => { mouse = { x: event.clientX, y: event.clientY }; }, { passive: true });
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

  function initResumeDownload() {
    document.querySelectorAll('a[href$="resume.pdf"], .floating-resume-btn').forEach((link) => {
      link.setAttribute('href', '/assets/resume.pdf');
      link.setAttribute('download', 'Nischhal-Raj-Subba-Resume.pdf');
    });
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
    initTheme();
    initMobileMenu();
    initGridCanvas();
    initActiveNavigation();
    initFilters();
    initPageTransition();
    initResumeDownload();
    initShareButtons();
    initContactForm();
  });
})();
