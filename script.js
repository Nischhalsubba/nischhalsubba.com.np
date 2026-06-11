/*
 * Compatibility entrypoint for existing HTML files.
 * Runtime modules live in src/scripts/ for maintainability.
 */
const productionFixesHref = '/production-fixes.css?v=20260611';

if (!document.querySelector(`link[href^="${productionFixesHref.split('?')[0]}"]`)) {
  const productionFixes = document.createElement('link');
  productionFixes.rel = 'stylesheet';
  productionFixes.href = productionFixesHref;
  document.head.appendChild(productionFixes);
}

import './src/scripts/main.js';
