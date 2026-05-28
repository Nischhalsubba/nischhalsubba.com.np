import { $, $$ } from '../utils/dom.js';

function isArticlePage() {
  return window.location.pathname.startsWith('/blog/') || Boolean($('article'));
}

function ensureContainer(element) {
  if (!element || element.classList.contains('container')) return;
  if (element.closest('.container')) return;
  element.classList.add('container');
}

function normalizeArticle(article) {
  article.classList.add('nrs-article', 'blog-prose');

  const header = $('header', article);
  if (header) header.classList.add('nrs-article-header');

  $$('section', article).forEach((section) => {
    section.classList.add('nrs-article-section');
  });

  $$('article img').forEach((image) => {
    image.loading = image.loading || 'lazy';
    image.decoding = image.decoding || 'async';
  });
}

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
