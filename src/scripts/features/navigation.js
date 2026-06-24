import { $$ } from '../utils/dom.js';

function normalizePath(pathname) {
  const path = pathname.endsWith('/') && pathname.length > 1 ? pathname.slice(0, -1) : pathname;

  if (path === '/home-v2' || path === '/home-v2.html' || path === '/home' || path === '/home.html' || path === '/index.html') return '/';
  if (path === '/projects') return '/projects.html';
  if (path === '/services') return '/services.html';
  if (path === '/about') return '/about.html';
  if (path === '/contact') return '/contact.html';
  if (path === '/blog.html') return '/blog';

  return path;
}

function getActiveSection(pathname) {
  const path = normalizePath(pathname);
  const file = path.split('/').filter(Boolean).pop() || '';

  if (path === '/') return 'home';
  if (path === '/projects.html' || file.startsWith('project-')) return 'work';
  if (path === '/services.html') return 'services';
  if (path === '/about.html') return 'about';
  if (path === '/contact.html') return 'contact';
  if (path === '/blog' || path.startsWith('/blog/') || file.startsWith('blog-')) return 'writing';

  const servicePages = new Set([
    'product-design-nepal.html',
    'web3-ux-designer.html',
    'saas-ux-designer.html',
    'website-ux-design.html',
    'figma-design-systems.html',
    'ux-audit.html',
  ]);

  if (servicePages.has(file)) return 'services';
  return '';
}

function getLinkSection(href) {
  const path = normalizePath(new URL(href, window.location.origin).pathname);

  if (path === '/') return 'home';
  if (path === '/projects.html') return 'work';
  if (path === '/services.html') return 'services';
  if (path === '/about.html') return 'about';
  if (path === '/contact.html') return 'contact';
  if (path === '/blog') return 'writing';

  return '';
}

export function initActiveNavigation() {
  const activeSection = getActiveSection(window.location.pathname);

  $$('.nav-link, .mobile-nav-links a, .footer-col a').forEach((link) => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('http') || href.startsWith('mailto:')) return;

    const linkSection = getLinkSection(href);
    const active = Boolean(linkSection && activeSection && linkSection === activeSection);

    link.classList.toggle('active', active);
    if (active) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}
