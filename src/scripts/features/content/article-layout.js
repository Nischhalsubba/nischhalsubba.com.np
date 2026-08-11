/**
 * @fileoverview src/scripts/features/content/article-layout.js
 * Purpose: Implement article layout behavior inside the content browser-runtime domain.
 * Responsibilities:
 * - Own the content behavior represented by this module and keep unrelated domains outside the file.
 * - Read or update only the DOM/runtime state needed for this feature and preserve accessibility semantics.
 * - Expose stable initializer/helper exports consumed by runtime entrypoints or closely related features.
 * Execution context: Browser ES module loaded through the portfolio runtime.
 * Connected files:
 * - src/scripts/shared/dom.js
 * - src/runtime/script.js
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
import { $, $$ } from '../../shared/dom.js';

/**
 * Function contract: isArticlePage
 * Purpose: Determine whether article page satisfies the condition represented by this article layout browser feature.
 * Inputs: None; derives required state from the enclosing module/runtime context.
 * Side effects: reads or updates DOM/browser state.
 * Returns: Boolean indicating whether article page satisfies the documented condition.
 */
function isArticlePage() {
  return window.location.pathname.startsWith('/blog/') || Boolean($('article'));
}

/**
 * Function contract: ensureContainer
 * Purpose: Apply container consistently while preserving the surrounding article layout browser feature contract.
 * Inputs: `element`: DOM element currently being evaluated or updated
 * Side effects: reads or updates DOM/browser state.
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
 */
function ensureContainer(element) {
  if (!element || element.classList.contains('container')) return;
  if (element.closest('.container')) return;
  element.classList.add('container');
}

/**
 * Function contract: normalizeArticle
 * Purpose: Apply article consistently while preserving the surrounding article layout browser feature contract.
 * Inputs: `article`: input consumed by this operation
 * Side effects: reads or updates DOM/browser state.
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
 */
function normalizeArticle(article) {
  article.classList.add('nrs-article', 'blog-prose');

  const header = $('header', article);
  if (header) header.classList.add('nrs-article-header');

  $$('section', article).forEach(/** Callback contract: Apply the enclosing side-effect operation to the current collection item. Inputs: `section`. Side effects: reads or updates DOM/browser state. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ (section) => {
    section.classList.add('nrs-article-section');
  });

  $$('article img').forEach(/** Callback contract: Apply the enclosing side-effect operation to the current collection item. Inputs: `image`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ (image) => {
    image.loading = image.loading || 'lazy';
    image.decoding = image.decoding || 'async';
  });
}

/**
 * Function contract: normalizeArticleLayout
 * Purpose: Apply article layout consistently while preserving the surrounding article layout browser feature contract.
 * Inputs: None; derives required state from the enclosing module/runtime context.
 * Side effects: reads or updates DOM/browser state.
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
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
