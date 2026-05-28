import { $$ } from '../utils/dom.js';

function getShareText() {
  return encodeURIComponent(document.querySelector('h1')?.innerText || document.title);
}

export function initShareButtons() {
  $$('[data-share]').forEach((button) => {
    button.addEventListener('click', async (event) => {
      event.preventDefault();

      const platform = button.dataset.share;
      const url = encodeURIComponent(window.location.href);
      const text = getShareText();

      if (platform === 'copy' && navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        button.classList.add('copied');
        window.setTimeout(() => button.classList.remove('copied'), 1600);
        return;
      }

      if (platform === 'native' && navigator.share) {
        await navigator.share({ title: document.title, url: window.location.href }).catch(() => {});
        return;
      }

      const targets = {
        x: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      };

      if (targets[platform]) {
        window.open(targets[platform], '_blank', 'noopener,noreferrer');
      }
    });
  });
}
