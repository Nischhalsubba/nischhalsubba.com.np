import { $$ } from '../utils/dom.js';

function normalizePath(pathname) {
  if (pathname === '/home-v2.html' || pathname === '/index.html') return '/';
  return pathname.endsWith('/') && pathname.length > 1 ? pathname.slice(0, -1) : pathname;
}

export function initActiveNavigation() {
  const currentPath = normalizePath(window.location.pathname);

  $$('.nav-link, .mobile-nav-links a').forEach((link) => {
    const href = link.getAttribute('href');
    if (!href) return;

    const linkPath = normalizePath(new URL(href, window.location.origin).pathname);
    const active =
      currentPath === linkPath ||
      (currentPath.startsWith('/project-') && linkPath.includes('projects')) ||
      (currentPath.startsWith('/blog') && linkPath.includes('blog'));

    link.classList.toggle('active', active);
  });
}
