(() => {
  const root = document.querySelector('.agent-portfolio');
  if (!root) return;

  document.querySelector('#nrs-scroll-progress')?.remove();

  const html = document.documentElement;
  try {
    const stored = sessionStorage.getItem('nrs-theme-override');
    const theme = stored === 'dark' || stored === 'light' ? stored : 'light';
    html.setAttribute('data-theme', theme);
    html.style.colorScheme = theme;
  } catch (_) {
    html.setAttribute('data-theme', 'light');
    html.style.colorScheme = 'light';
  }

  const toggle = document.querySelector('.mobile-nav-toggle');
  const overlay = document.querySelector('.mobile-nav-overlay');
  const main = document.querySelector('main');
  if (!toggle || !overlay || !main) return;

  toggle.dataset.mobileMenuReady = 'true';

  const sync = () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    overlay.setAttribute('aria-hidden', open ? 'false' : 'true');
    overlay.hidden = !open;
    overlay.inert = !open;
    main.inert = open;
  };

  sync();
  const observer = new MutationObserver(sync);
  observer.observe(toggle, { attributes: true, attributeFilter: ['aria-expanded'] });

  window.addEventListener('pagehide', () => observer.disconnect(), { once: true });
})();
