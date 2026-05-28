export function injectGlobalStyles() {
  document.documentElement.classList.add('js-enabled');

  if (document.getElementById('nrs-runtime-base-styles')) return;

  const style = document.createElement('style');
  style.id = 'nrs-runtime-base-styles';
  style.textContent = `
    .js-enabled .reveal-on-scroll,
    .js-enabled .project-card,
    .js-enabled .impact-card,
    .js-enabled .writing-item,
    .js-enabled .achieve-item {
      opacity: 0;
      transform: translate3d(0, 28px, 0);
      transition: opacity .7s var(--ease-out, cubic-bezier(0, 0, .2, 1)) var(--reveal-delay, 0ms), transform .7s var(--ease-out, cubic-bezier(0, 0, .2, 1)) var(--reveal-delay, 0ms), border-color .35s ease, background-color .35s ease, box-shadow .35s ease;
      will-change: transform, opacity;
    }

    .js-enabled .is-visible {
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
      background: radial-gradient(circle at 50% 15%, rgba(59,130,246,.22), transparent 58%), var(--bg-surface, #0a0a0a);
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

    .project-card,
    .impact-card,
    .blog-card-modern {
      transform-style: preserve-3d;
      backface-visibility: hidden;
    }

    .project-card.is-tilting,
    .impact-card.is-tilting,
    .blog-card-modern.is-tilting {
      transform: perspective(1100px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) translateY(-8px) !important;
      box-shadow: 0 24px 90px rgba(0,0,0,.22);
      border-color: color-mix(in srgb, var(--accent-blue, #3B82F6) 42%, var(--border-light, rgba(255,255,255,.15)));
    }

    .project-card:hover,
    .impact-card:hover,
    .writing-item:hover {
      border-color: color-mix(in srgb, var(--accent-blue, #3B82F6) 28%, var(--border-light, rgba(255,255,255,.15)));
    }

    .custom-cursor-dot,
    .custom-cursor-outline {
      left: 0;
      top: 0;
    }

    .custom-cursor-dot {
      width: 8px;
      height: 8px;
      background: var(--text-primary, #fff);
      opacity: .92;
    }

    .custom-cursor-outline {
      width: 44px;
      height: 44px;
      border-color: color-mix(in srgb, var(--accent-blue, #3B82F6) 46%, transparent);
      transition: width .28s ease, height .28s ease, border-color .28s ease, background-color .28s ease;
    }

    body.cursor-hover .custom-cursor-outline {
      width: 68px;
      height: 68px;
      background: color-mix(in srgb, var(--accent-blue, #3B82F6) 10%, transparent);
      border-color: color-mix(in srgb, var(--accent-blue, #3B82F6) 72%, transparent);
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
      .js-enabled .reveal-on-scroll,
      .js-enabled .project-card,
      .js-enabled .impact-card,
      .js-enabled .writing-item,
      .js-enabled .achieve-item {
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
