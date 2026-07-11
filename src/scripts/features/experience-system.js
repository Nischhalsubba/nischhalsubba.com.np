const ROUTE_LABELS = new Map([
  ['/', 'Home'],
  ['/projects', 'Work'],
  ['/services', 'Services'],
  ['/about', 'About'],
  ['/contact', 'Contact'],
  ['/blog', 'Writing'],
  ['/privacy', 'Privacy'],
]);

function canonicalPath() {
  const path = window.location.pathname || '/';
  if (path === '/') return '/';
  return path.replace(/\/+$/, '').replace(/\.html$/, '') || '/';
}

function pageTitle() {
  const heading = document.querySelector('main h1, main .hero-title');
  const text = heading?.textContent?.trim();
  if (text) return text;
  return document.title.split('|')[0].trim() || 'Page';
}

function routeContext(path) {
  if (/^\/project-[^/]+$/.test(path)) return { parentHref: '/projects', parentLabel: 'Work', backLabel: 'Back to work' };
  if (path.startsWith('/blog/') && path !== '/blog') return { parentHref: '/blog/', parentLabel: 'Writing', backLabel: 'Back to writing' };
  if (['/product-design-nepal', '/web3-ux-designer', '/saas-ux-designer', '/website-ux-design', '/figma-design-systems', '/ux-audit'].includes(path)) {
    return { parentHref: '/services', parentLabel: 'Services', backLabel: 'Back to services' };
  }
  return { parentHref: '/', parentLabel: 'Home', backLabel: 'Back home' };
}

function addWayfinding() {
  const path = canonicalPath();
  if (path === '/' || document.querySelector('.nrs-wayfinding')) return;

  const main = document.querySelector('main');
  if (!main) return;

  const context = routeContext(path);
  const currentLabel = ROUTE_LABELS.get(path) || pageTitle();
  const nav = document.createElement('nav');
  nav.className = 'nrs-wayfinding';
  nav.setAttribute('aria-label', 'Breadcrumb');

  const crumbs = document.createElement('ol');
  crumbs.className = 'nrs-breadcrumbs';

  const homeItem = document.createElement('li');
  const homeLink = document.createElement('a');
  homeLink.href = '/';
  homeLink.textContent = 'Home';
  homeItem.appendChild(homeLink);
  crumbs.appendChild(homeItem);

  if (context.parentHref !== '/') {
    const parentItem = document.createElement('li');
    const parentLink = document.createElement('a');
    parentLink.href = context.parentHref;
    parentLink.textContent = context.parentLabel;
    parentItem.appendChild(parentLink);
    crumbs.appendChild(parentItem);
  }

  if (currentLabel !== context.parentLabel) {
    const currentItem = document.createElement('li');
    const current = document.createElement('span');
    current.setAttribute('aria-current', 'page');
    current.textContent = currentLabel;
    currentItem.appendChild(current);
    crumbs.appendChild(currentItem);
  }

  const back = document.createElement('a');
  back.className = 'nrs-back-link';
  back.href = context.parentHref;
  back.textContent = context.backLabel;

  nav.append(crumbs, back);

  const anchor = main.querySelector('.hero-section, .nrs-services-hero, .nrs-contact-v3-hero, article, section');
  if (anchor) anchor.before(nav);
  else main.prepend(nav);
}

function ensureGridCanvas() {
  if (document.getElementById('grid-canvas')) return;
  const canvas = document.createElement('canvas');
  canvas.id = 'grid-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.prepend(canvas);
}

function addSkeleton(media) {
  if (media.dataset.nrsLoadingReady === 'true') return;
  media.dataset.nrsLoadingReady = 'true';
  media.classList.add('nrs-lazy-media');

  const parent = media.parentElement;
  if (!parent) {
    media.classList.add('nrs-standalone-skeleton');
    return;
  }

  parent.classList.add('nrs-skeleton-host');
  let skeleton = parent.querySelector(':scope > .nrs-skeleton-layer');
  if (!skeleton) {
    skeleton = document.createElement('span');
    skeleton.className = 'nrs-skeleton-layer';
    skeleton.setAttribute('aria-hidden', 'true');
    parent.prepend(skeleton);
  }

  const ready = () => {
    media.classList.add('is-loaded');
    parent.classList.add('nrs-media-ready');
  };
  const failed = () => parent.classList.add('nrs-media-error');

  if (media instanceof HTMLImageElement) {
    if (media.complete && media.naturalWidth > 0) ready();
    else {
      media.addEventListener('load', ready, { once: true });
      media.addEventListener('error', failed, { once: true });
    }
  } else {
    media.addEventListener('load', ready, { once: true });
    media.addEventListener('error', failed, { once: true });
  }
}

function improveMediaLoading() {
  const heroMedia = new Set(document.querySelectorAll('.hero-section img, .nrs-services-hero img, .nrs-contact-v3-hero img, .case-hero-img-container img'));

  document.querySelectorAll('main img').forEach((image) => {
    image.decoding = 'async';
    if (heroMedia.has(image)) {
      image.loading = 'eager';
      image.fetchPriority = 'high';
    } else {
      image.loading = 'lazy';
    }
    addSkeleton(image);
  });

  document.querySelectorAll('main iframe').forEach((frame) => {
    frame.loading = 'lazy';
    addSkeleton(frame);
  });
}

function markInteractiveElements() {
  const selector = [
    'a', 'button', 'input', 'textarea', 'select', 'summary', 'label',
    '[role="button"]', '[tabindex]:not([tabindex="-1"])',
    '.project-card', '.writing-item', '.journey-card', '.impact-card',
    '.prototype-link-card', '.nrs-service-card', '.nrs-services-step',
    '.case-list li', '.filter-btn', '.btn', '.nav-link', '.mobile-nav-links a',
  ].join(',');

  document.querySelectorAll(selector).forEach((element) => element.classList.add('nrs-cursor-target'));
  document.querySelectorAll('main img, main video, main iframe').forEach((element) => element.setAttribute('data-cursor-mode', 'media'));
  document.querySelectorAll('main p, main li, main h1, main h2, main h3, main h4').forEach((element) => element.setAttribute('data-cursor-mode', 'text'));
  document.querySelectorAll('[data-cursor-label]').forEach((element) => element.classList.add('nrs-cursor-target'));
}

export function initExperienceSystem() {
  ensureGridCanvas();
  addWayfinding();
  improveMediaLoading();
  markInteractiveElements();
}
