const NAV_ITEMS = [
  { href: '/', label: 'Home', key: 'home' },
  { href: '/projects.html', label: 'Work', key: 'work' },
  { href: '/services.html', label: 'Services', key: 'services' },
  { href: '/about.html', label: 'About', key: 'about' },
  { href: '/blog/', label: 'Writing', key: 'writing' },
  { href: '/contact.html', label: 'Contact', key: 'contact' },
];

function currentKey() {
  const path = window.location.pathname;
  if (path === '/' || path.includes('home')) return 'home';
  if (path.includes('services')) return 'services';
  if (path.includes('about')) return 'about';
  if (path.includes('contact')) return 'contact';
  if (path.startsWith('/blog')) return 'writing';
  if (path.includes('project') || path.includes('projects')) return 'work';
  return '';
}

function syncLinks(container, selector, className = '') {
  if (!container) return;
  const active = currentKey();
  const existing = Array.from(container.querySelectorAll(selector));

  const byLabel = new Map(existing.map((link) => [link.textContent.trim().toLowerCase(), link]));

  for (const item of NAV_ITEMS) {
    let link = byLabel.get(item.label.toLowerCase());
    if (!link) {
      link = document.createElement('a');
      link.textContent = item.label;
      if (className) link.className = className;
      const before = byLabel.get('about');
      if (item.key === 'services' && before) container.insertBefore(link, before);
      else container.appendChild(link);
    }

    link.href = item.href;
    link.classList.toggle('active', item.key === active);
    if (item.key === active) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  }
}

function normalizePrimaryNav() {
  const desktopPill = document.querySelector('.nav-pill');
  const mobileLinks = document.querySelector('.mobile-nav-links');

  syncLinks(desktopPill, 'a.nav-link', 'nav-link');
  syncLinks(mobileLinks, 'a');
}

function normalizeFooterNav() {
  const pagesHeading = Array.from(document.querySelectorAll('.footer-col h5'))
    .find((heading) => heading.textContent.trim().toLowerCase() === 'pages');
  const footerColumn = pagesHeading?.parentElement;
  if (!footerColumn) return;

  const links = Array.from(footerColumn.querySelectorAll('a'));
  const byLabel = new Map(links.map((link) => [link.textContent.trim().toLowerCase(), link]));

  for (const item of NAV_ITEMS) {
    let link = byLabel.get(item.label.toLowerCase());
    if (!link) {
      link = document.createElement('a');
      link.textContent = item.label;
      const before = byLabel.get('about');
      if (item.key === 'services' && before) footerColumn.insertBefore(link, before);
      else footerColumn.appendChild(link);
    }
    link.href = item.href;
  }
}

function applyRouteClasses() {
  const path = window.location.pathname;
  document.body.classList.toggle('nrs-service-page', path.includes('services'));
  document.body.classList.toggle('nrs-inner-page', path !== '/');
}

export function enforceDesignSystemShell() {
  applyRouteClasses();
  normalizePrimaryNav();
  normalizeFooterNav();
}
