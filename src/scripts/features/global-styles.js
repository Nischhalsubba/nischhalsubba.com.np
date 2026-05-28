export function injectGlobalStyles() {
  document.documentElement.classList.add('js-enabled');

  if (document.getElementById('nrs-runtime-base-styles')) return;

  const style = document.createElement('style');
  style.id = 'nrs-runtime-base-styles';
  style.textContent = `
    .js-enabled .reveal-on-scroll { will-change: transform, opacity; }
    .page-ready body { opacity: 1; }
    .menu-open { overflow: hidden; }
    .copied::after { content: 'Copied'; margin-left: .5rem; font-size: .85em; }
    :focus-visible { outline: 2px solid currentColor; outline-offset: 4px; }
  `;
  document.head.appendChild(style);
}
