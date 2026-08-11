/**
 * @fileoverview scripts/ensure-mobile-drawer-final.cjs
 * Purpose: Apply the ensure mobile drawer final production transformation or maintenance step while preserving canonical source/build contracts.
 * Responsibilities:
 * - Operate deterministically on canonical source or build output so repeated runs produce stable results.
 * - Surface invalid input or contract drift as explicit failures instead of silently masking it.
 * - Keep path assumptions synchronized with repository manifests and source-layout ownership.
 * Execution context: Node.js CLI during development, generation, build, CI, or repository maintenance.
 * Connected files:
 * - scripts/build-dist.cjs
 * - package.json
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const base = process.argv.includes('--dist') ? path.join(root, 'dist') : root;
const stylePath = path.join(base, 'style.css');
const start = '/* nrs-mobile-drawer-final-v1:start */';
const end = '/* nrs-mobile-drawer-final-v1:end */';
const marker = /\/\* nrs-mobile-drawer-final-v\d+:start \*\/[\s\S]*?\/\* nrs-mobile-drawer-final-v\d+:end \*\//g;

if (!fs.existsSync(stylePath)) throw new Error(`[mobile-drawer-final] Missing ${stylePath}`);

const css = `${start}
@media (max-width: 1023px) {
  body.agent-portfolio.menu-open,
  html.menu-open body.agent-portfolio {
    overflow: hidden !important;
    overscroll-behavior: none !important;
  }

  .agent-portfolio .mobile-nav-overlay {
    --nrs-menu-bg: #11110f;
    --nrs-menu-ink: #f7f2e8;
    --nrs-menu-muted: #bdb6aa;
    position: fixed !important;
    inset: 0 !important;
    z-index: 2147483003 !important;
    display: grid !important;
    grid-template-rows: minmax(0, 1fr) auto !important;
    align-items: start !important;
    align-content: start !important;
    width: 100vw !important;
    min-width: 0 !important;
    height: 100dvh !important;
    min-height: 100dvh !important;
    max-height: 100dvh !important;
    margin: 0 !important;
    padding: calc(env(safe-area-inset-top, 0px) + 72px)
      max(18px, env(safe-area-inset-right, 0px))
      max(18px, env(safe-area-inset-bottom, 0px))
      max(18px, env(safe-area-inset-left, 0px)) !important;
    overflow-x: hidden !important;
    overflow-y: auto !important;
    overscroll-behavior: contain !important;
    background: var(--nrs-menu-bg) !important;
    color: var(--nrs-menu-ink) !important;
    -webkit-overflow-scrolling: touch;
    scrollbar-gutter: stable both-edges;
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    transform: translateY(-8px);
  }

  .agent-portfolio .mobile-nav-overlay[hidden] {
    display: none !important;
  }

  .agent-portfolio.menu-open .mobile-nav-overlay,
  .agent-portfolio .mobile-nav-overlay.is-open,
  .agent-portfolio .mobile-nav-overlay[data-open='true'],
  .agent-portfolio .mobile-nav-overlay[aria-hidden='false'] {
    opacity: 1 !important;
    visibility: visible !important;
    pointer-events: auto !important;
    transform: translateY(0) !important;
  }

  .agent-portfolio.menu-open .agent-mobile-brand,
  .agent-portfolio.menu-open .theme-toggle-btn,
  .agent-portfolio.menu-open #theme-toggle {
    opacity: 0 !important;
    visibility: hidden !important;
    pointer-events: none !important;
  }

  .agent-portfolio.menu-open .mobile-nav-toggle {
    z-index: 2147483005 !important;
    border-color: rgba(247, 242, 232, .45) !important;
    background: #11110f !important;
    color: #f7f2e8 !important;
    box-shadow: none !important;
  }

  .agent-portfolio .mobile-nav-links {
    display: grid !important;
    grid-template-columns: minmax(0, 1fr) !important;
    align-content: start !important;
    width: min(100%, 52rem) !important;
    min-width: 0 !important;
    max-width: 52rem !important;
    margin: 0 auto !important;
    padding: 0 !important;
    border-top: 1px solid rgba(247, 242, 232, .28);
  }

  .agent-portfolio .mobile-nav-links a {
    display: flex !important;
    align-items: center !important;
    width: 100% !important;
    min-width: 0 !important;
    min-height: clamp(56px, 9svh, 76px) !important;
    padding: .65rem 0 !important;
    border: 0 !important;
    border-bottom: 1px solid rgba(247, 242, 232, .24) !important;
    border-radius: 0 !important;
    background: transparent !important;
    color: var(--nrs-menu-ink) !important;
    font-family: var(--ap-font-display) !important;
    font-size: clamp(2rem, 8.8vw, 4rem) !important;
    font-weight: 720 !important;
    line-height: .96 !important;
    letter-spacing: -.05em !important;
    text-decoration: none !important;
    text-wrap: balance;
    overflow-wrap: normal !important;
  }

  .agent-portfolio .mobile-nav-links a[aria-current='page'] {
    color: #ff6b2c !important;
  }

  .agent-portfolio .mobile-nav-links a:hover,
  .agent-portfolio .mobile-nav-links a:focus-visible {
    color: #ff6b2c !important;
  }

  .agent-portfolio .agent-mobile-theme-toggle {
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
    gap: 1rem !important;
    align-self: end !important;
    width: min(100%, 52rem) !important;
    min-width: 0 !important;
    max-width: 52rem !important;
    min-height: 56px !important;
    margin: 1rem auto 0 !important;
    padding: .85rem 0 !important;
    border: 0 !important;
    border-top: 1px solid rgba(247, 242, 232, .28) !important;
    border-bottom: 1px solid rgba(247, 242, 232, .28) !important;
    border-radius: 0 !important;
    background: transparent !important;
    color: var(--nrs-menu-ink) !important;
    font: 650 .78rem/1.25 var(--ap-font-mono) !important;
    letter-spacing: .045em !important;
    text-align: left !important;
    text-transform: uppercase !important;
  }

  .agent-portfolio .agent-mobile-theme-toggle span:last-child {
    color: var(--nrs-menu-muted) !important;
    text-align: right !important;
  }

  .agent-portfolio .agent-mobile-theme-toggle:focus-visible {
    outline: 3px solid #ff6b2c !important;
    outline-offset: 4px !important;
  }
}

@media (max-width: 430px) {
  .agent-portfolio .mobile-nav-overlay {
    padding-top: calc(env(safe-area-inset-top, 0px) + 68px) !important;
    padding-right: max(16px, env(safe-area-inset-right, 0px)) !important;
    padding-left: max(16px, env(safe-area-inset-left, 0px)) !important;
  }

  .agent-portfolio .mobile-nav-links a {
    min-height: 58px !important;
    font-size: clamp(1.95rem, 10vw, 2.75rem) !important;
  }
}

@media (max-width: 1023px) and (max-height: 650px) {
  .agent-portfolio .mobile-nav-overlay {
    grid-template-rows: auto auto !important;
    padding-top: calc(env(safe-area-inset-top, 0px) + 62px) !important;
    padding-bottom: max(12px, env(safe-area-inset-bottom, 0px)) !important;
  }

  .agent-portfolio .mobile-nav-links a {
    min-height: 48px !important;
    padding-block: .35rem !important;
    font-size: clamp(1.55rem, 6.5vh, 2.35rem) !important;
  }

  .agent-portfolio .agent-mobile-theme-toggle {
    min-height: 48px !important;
    margin-top: .65rem !important;
    padding-block: .6rem !important;
  }
}

@media (max-width: 1023px) and (orientation: landscape) and (max-height: 500px) {
  .agent-portfolio .mobile-nav-overlay {
    padding-top: calc(env(safe-area-inset-top, 0px) + 58px) !important;
  }

  .agent-portfolio .mobile-nav-links {
    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
    column-gap: 1rem !important;
  }

  .agent-portfolio .mobile-nav-links a {
    min-height: 44px !important;
    font-size: clamp(1.35rem, 7vh, 1.9rem) !important;
  }
}

@media (prefers-reduced-motion: reduce) {
  .agent-portfolio .mobile-nav-overlay {
    transition: none !important;
    transform: none !important;
  }
}
${end}`;

let style = fs.readFileSync(stylePath, 'utf8');
style = style.replace(marker, '').trimEnd();
style += `\n\n${css}\n`;
fs.writeFileSync(stylePath, style, 'utf8');

const required = [
  start,
  'z-index: 2147483003',
  'grid-template-rows: minmax(0, 1fr) auto',
  '.agent-portfolio.menu-open .agent-mobile-brand',
  '.agent-portfolio .agent-mobile-theme-toggle',
  "orientation: landscape",
];
for (const item of required) {
  if (!style.includes(item)) throw new Error(`[mobile-drawer-final] Missing contract: ${item}`);
}

console.log(`[mobile-drawer-final] Applied final expanded-menu contract to ${path.relative(root, stylePath)}.`);
