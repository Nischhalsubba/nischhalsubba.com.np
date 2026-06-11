/*
 * Compatibility entrypoint for existing HTML files.
 * Runtime modules live in src/scripts/ for maintainability.
 */
const runtimeStylesheets = [
  '/production-fixes.css?v=20260611',
  '/light-theme-polish.css?v=20260611',
];

runtimeStylesheets.forEach((href) => {
  if (document.querySelector(`link[href^="${href.split('?')[0]}"]`)) return;

  const stylesheet = document.createElement('link');
  stylesheet.rel = 'stylesheet';
  stylesheet.href = href;
  document.head.appendChild(stylesheet);
});

import './src/scripts/main.js';
