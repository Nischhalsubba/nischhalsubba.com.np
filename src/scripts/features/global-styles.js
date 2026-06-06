function ensureSharedDesignStylesheet() {
  if (document.querySelector('link[href^="/seo-ui-enhancements.css"]')) return;

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/seo-ui-enhancements.css?v=1.3';
  document.head.appendChild(link);
}

export function injectGlobalStyles() {
  document.documentElement.classList.add('js-enabled');
  ensureSharedDesignStylesheet();

  if (document.getElementById('nrs-runtime-base-styles')) return;

  const style = document.createElement('style');
  style.id = 'nrs-runtime-base-styles';
  style.textContent = `
    html,
    body {
      background-color: #050505 !important;
      background-image:
        radial-gradient(ellipse 76% 46% at 50% -8%, rgba(74, 116, 165, .026), rgba(28, 48, 76, .014) 36%, rgba(5, 5, 5, 0) 72%),
        linear-gradient(90deg, #050505 0%, #050607 16%, #06080b 50%, #050607 84%, #050505 100%) !important;
      background-attachment: fixed !important;
    }

    body::before {
      background-image:
        linear-gradient(rgba(255, 255, 255, .018) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, .018) 1px, transparent 1px),
        radial-gradient(ellipse 62% 38% at 50% 0%, rgba(74, 116, 165, .026), transparent 74%) !important;
      background-size: 72px 72px, 72px 72px, 100% 100% !important;
      opacity: .48 !important;
    }

    body::after {
      background:
        linear-gradient(90deg, #050505 0%, rgba(5, 5, 5, .94) 8%, rgba(5, 5, 5, .58) 20%, rgba(5, 5, 5, .16) 35%, rgba(5, 5, 5, 0) 50%, rgba(5, 5, 5, .16) 65%, rgba(5, 5, 5, .58) 80%, rgba(5, 5, 5, .94) 92%, #050505 100%),
        linear-gradient(180deg, rgba(5, 5, 5, 0) 0%, rgba(5, 5, 5, .12) 62%, rgba(5, 5, 5, .68) 100%) !important;
    }

    [data-theme="light"] html,
    [data-theme="light"] body {
      background-color: #ffffff !important;
      background-image:
        radial-gradient(ellipse 74% 44% at 50% -8%, rgba(74, 116, 165, .032), transparent 72%),
        linear-gradient(90deg, #ffffff 0%, #fbfdff 50%, #ffffff 100%) !important;
    }

    [data-theme="light"] body::before {
      background-image:
        linear-gradient(rgba(15, 23, 42, .026) 1px, transparent 1px),
        linear-gradient(90deg, rgba(15, 23, 42, .026) 1px, transparent 1px),
        radial-gradient(ellipse 62% 38% at 50% 0%, rgba(59, 130, 246, .032), transparent 74%) !important;
      opacity: .36 !important;
    }

    [data-theme="light"] body::after {
      background:
        linear-gradient(90deg, #ffffff 0%, rgba(255, 255, 255, .92) 10%, rgba(255, 255, 255, .48) 22%, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, .48) 78%, rgba(255, 255, 255, .92) 90%, #ffffff 100%),
        linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, .68) 100%) !important;
    }

    .motion-ready .reveal-on-scroll,
    .motion-ready .project-card,
    .motion-ready .impact-card,
    .motion-ready .writing-item,
    .motion-ready .achieve-item {
      transition: border-color .35s ease, background-color .35s ease, box-shadow .35s ease;
      will-change: transform, opacity;
    }

    .is-visible {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }

    .page-ready body { opacity: 1; }
    .menu-open { overflow: hidden; }
    .copied::after { content: 'Copied'; margin-left: .5rem; font-size: .85em; }
    :focus-visible { outline: 2px solid currentColor; outline-offset: 4px; }

    .nrs-static-project-context,
    .nrs-static-related-links,
    .nrs-static-faq {
      display: none !important;
    }

    .nav-pill {
      box-shadow: 0 18px 60px rgba(0, 0, 0, .18), inset 0 1px 0 rgba(255,255,255,.08);
    }

    .nav-link {
      position: relative;
    }

    .nav-link::after {
      content: '';
      position: absolute;
      left: 50%;
      bottom: 8px;
      width: 4px;
      height: 4px;
      border-radius: 999px;
      background: currentColor;
      opacity: 0;
      transform: translateX(-50%) scale(.4);
      transition: opacity .25s ease, transform .25s ease;
    }

    .nav-link.active::after,
    .nav-link:hover::after {
      opacity: .75;
      transform: translateX(-50%) scale(1);
    }

    .hero-portrait-container {
      width: min(560px, 92vw);
      margin: clamp(48px, 7vw, 88px) auto 0;
      border-radius: 32px;
      overflow: hidden;
      border: 1px solid var(--border-faint, rgba(255,255,255,.1));
      background: radial-gradient(circle at 50% 15%, rgba(59,130,246,.12), transparent 58%), var(--bg-surface, #0a0a0a);
      box-shadow: 0 28px 90px rgba(0,0,0,.28);
      transform-style: preserve-3d;
    }

    .hero-portrait-img {
      width: 100%;
      aspect-ratio: 1 / 1;
      object-fit: cover;
      opacity: .98;
    }

    .nrs-home-hero .body-large {
      max-width: 820px;
    }

    .project-card:hover,
    .impact-card:hover,
    .writing-item:hover {
      border-color: color-mix(in srgb, var(--accent-blue, #3B82F6) 28%, var(--border-light, rgba(255,255,255,.15)));
    }

    .nrs-article-main {
      padding-top: clamp(112px, 12vw, 172px);
      padding-bottom: clamp(72px, 10vw, 128px);
      width: min(100%, var(--max-width, 1200px));
      margin-inline: auto;
      padding-inline: var(--container-padding, 40px);
    }

    .nrs-article-main > article,
    .nrs-article {
      width: min(100%, 980px);
      margin-inline: auto;
    }

    .nrs-article-header {
      min-height: auto !important;
      padding: 0 0 clamp(40px, 6vw, 72px) !important;
      align-items: flex-start !important;
      text-align: left !important;
    }

    .nrs-article-section {
      padding-block: clamp(32px, 5vw, 72px) !important;
    }

    .nrs-article img {
      width: 100%;
      max-width: 100%;
      height: auto;
      border-radius: 24px;
      border: 1px solid var(--border-faint, rgba(255,255,255,.1));
      margin: 0 0 clamp(32px, 5vw, 56px);
    }

    .nrs-article p,
    .nrs-article li {
      color: var(--text-secondary, #d4d4d8);
      font-size: clamp(1.03rem, 1.5vw, 1.16rem);
      line-height: 1.85;
    }

    .nrs-article p { margin-bottom: 1.35em; }
    .nrs-article h1 { max-width: 980px; }
    .nrs-article h2,
    .nrs-article h3 { margin-top: clamp(40px, 6vw, 72px); margin-bottom: 18px; }

    .nrs-article blockquote {
      margin: clamp(36px, 6vw, 64px) 0;
      padding-left: 24px;
      border-left: 4px solid var(--accent-blue, #3B82F6);
      color: var(--text-primary, #fff);
      font-family: var(--font-serif, serif);
      font-size: clamp(1.25rem, 2vw, 1.65rem);
      line-height: 1.55;
    }

    @media (prefers-reduced-motion: reduce) {
      .reveal-on-scroll,
      .project-card,
      .impact-card,
      .writing-item,
      .achieve-item {
        opacity: 1 !important;
        transform: none !important;
        transition: none !important;
      }
    }

    @media (max-width: 760px) {
      .nrs-article-main { padding-top: 104px; }
      .nrs-article-header { text-align: left !important; }
      .nrs-article .hero-title { font-size: clamp(2.15rem, 12vw, 3.1rem); }
    }
  `;
  document.head.appendChild(style);
}
