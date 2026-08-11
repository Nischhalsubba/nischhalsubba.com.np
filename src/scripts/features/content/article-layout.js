/**
 * @fileoverview src/scripts/features/content/article-layout.js
 * Purpose: Browser runtime feature in the content domain responsible for article layout behavior.
 * Responsibilities:
 * - Own the behavior/content implied by this file's single responsibility.
 * - Keep public routes, build contracts, and imported module boundaries stable unless the connected owners are updated together.
 * Execution context: Browser ES module loaded by the portfolio runtime.
 * Connected files:
 * - docs/repository/file-catalog.md
 * - src/scripts/entrypoints/main.js
 * - src/runtime/script.js
 * Maintenance: Update this header when responsibility or dependencies change; generated/vendor files are documented at their source instead.
 */
import { $, $$ } from '../../shared/dom.js';

/**
 * Function contract: isArticlePage
 * Purpose: Implements the is article page responsibility for this module.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may read or update browser DOM/state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function isArticlePage() {
  return window.location.pathname.startsWith('/blog/') || Boolean($('article'));
}

/**
 * Function contract: ensureContainer
 * Purpose: Applies ensure container while preserving the surrounding repository/runtime contract.
 * Inputs: element.
 * Side effects: may read or update browser DOM/state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function ensureContainer(element) {
  if (!element || element.classList.contains('container')) return;
  if (element.closest('.container')) return;
  element.classList.add('container');
}

/**
 * Function contract: normalizeArticle
 * Purpose: Applies normalize article while preserving the surrounding repository/runtime contract.
 * Inputs: article.
 * Side effects: may read or update browser DOM/state.
 * Returns: no explicit value unless an invoked dependency throws/rejects.
 */
function normalizeArticle(article) {
  article.classList.add('nrs-article', 'blog-prose');

  const header = $('header', article);
  if (header) header.classList.add('nrs-article-header');

  $$('section', article).forEach(/** Callback contract: Processes the callback step for $$('section', article) without leaking orchestration details to the caller. Inputs: section. Side effects: may read or update browser DOM/state. No explicit return contract. */ (section) => {
    section.classList.add('nrs-article-section');
  });

  $$('article img').forEach(/** Callback contract: Processes the callback step for $$('article img') without leaking orchestration details to the caller. Inputs: image. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (image) => {
    image.loading = image.loading || 'lazy';
    image.decoding = image.decoding || 'async';
  });
}

/**
 * Function contract: normalizeArticleLayout
 * Purpose: Applies normalize article layout while preserving the surrounding repository/runtime contract.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may read or update browser DOM/state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
export function normalizeArticleLayout() {
  if (!isArticlePage()) return;

  const main = $('main');
  if (main) {
    main.classList.add('nrs-article-main');
    if (!main.classList.contains('container') && !$('article .container')) {
      main.classList.add('container');
    }
  }

  $$('article').forEach(normalizeArticle);
  $$('.nrs-article-main > section, .nrs-article-main > article').forEach(ensureContainer);
}
