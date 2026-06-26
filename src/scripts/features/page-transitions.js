const TRANSITION_MS = 220;

function prefersReducedMotion() {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

function isModifiedClick(event) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
}

function shouldTransition(link) {
  if (!link) return false;
  if (link.target && link.target !== '_self') return false;
  if (link.hasAttribute('download')) return false;
  if (link.dataset.noTransition === 'true') return false;

  const href = link.getAttribute('href');
  if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return false;

  const url = new URL(href, window.location.href);
  if (url.origin !== window.location.origin) return false;

  const samePath = url.pathname === window.location.pathname;
  const sameSearch = url.search === window.location.search;
  if (samePath && sameSearch && url.hash) return false;

  return true;
}

export function initPageTransitions() {
  if (prefersReducedMotion()) return;

  document.body.classList.add('nrs-page-enter');
  window.setTimeout(() => document.body.classList.remove('nrs-page-enter'), 520);

  window.addEventListener('pageshow', () => {
    document.body.classList.remove('nrs-page-leave');
    document.body.classList.add('nrs-page-enter');
    window.setTimeout(() => document.body.classList.remove('nrs-page-enter'), 520);
  });

  document.addEventListener('click', (event) => {
    if (isModifiedClick(event)) return;

    const link = event.target.closest?.('a[href]');
    if (!shouldTransition(link)) return;

    event.preventDefault();
    document.body.classList.remove('nrs-page-enter');
    document.body.classList.add('nrs-page-leave');

    window.setTimeout(() => {
      window.location.href = link.href;
    }, TRANSITION_MS);
  });
}
