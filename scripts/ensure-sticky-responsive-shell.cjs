/**
 * @fileoverview scripts/ensure-sticky-responsive-shell.cjs
 * Purpose: Node-based build, content transformation, QA, or maintenance tool for ensure sticky responsive shell.
 * Responsibilities:
 * - Own the behavior/content implied by this file's single responsibility.
 * - Keep public routes, build contracts, and imported module boundaries stable unless the connected owners are updated together.
 * Execution context: Node.js CLI during local development, CI, build, or maintenance.
 * Connected files:
 * - docs/repository/file-catalog.md
 * - scripts/build-dist.cjs
 * - package.json
 * Maintenance: Update this header when responsibility or dependencies change; generated/vendor files are documented at their source instead.
 */
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const target = process.argv.includes('--dist') ? path.join(root, 'dist') : root;
const stylePath = path.join(target, 'style.css');
const start = '/* nrs-sticky-responsive-shell-v3:start */';
const end = '/* nrs-sticky-responsive-shell-v3:end */';
const marker = /\/\* nrs-sticky-responsive-shell-v\d+:start \*\/[\s\S]*?\/\* nrs-sticky-responsive-shell-v\d+:end \*\//g;

if (!fs.existsSync(stylePath)) throw new Error(`[sticky-responsive-shell] Missing ${stylePath}`);

const css = `${start}
:root {
  --nrs-progress-h: 3px;
  --nrs-mobile-control: 44px;
  --nrs-mobile-gap: 10px;
  --nrs-nav-edge: clamp(1rem, 1.7vw, 1.5rem);
}

#nrs-scroll-progress,
.agent-portfolio #agent-progress {
  position: fixed !important;
  inset: 0 0 auto 0 !important;
  width: 100% !important;
  height: var(--nrs-progress-h) !important;
  z-index: 2147483647 !important;
  pointer-events: none !important;
}

#nrs-scroll-progress { transform: none !important; }
.agent-portfolio #agent-progress {
  transform: scaleX(var(--agent-scroll, .01)) !important;
  transform-origin: left center !important;
}

/* Keep the desktop navbar compact and centered instead of stretching edge-to-edge. */
.agent-portfolio .nav-wrapper {
  position: fixed !important;
  top: 0 !important;
  left: 50% !important;
  right: auto !important;
  bottom: auto !important;
  width: min(calc(100vw - (2 * var(--nrs-nav-edge))), var(--ap-max)) !important;
  max-width: var(--ap-max) !important;
  margin: 0 !important;
  transform: translateX(-50%) !important;
  z-index: 2147483000 !important;
  border: 1px solid color-mix(in srgb, var(--ap-line) 76%, transparent) !important;
  border-top: 0 !important;
}

.agent-portfolio .agent-main {
  min-width: 0 !important;
  max-width: 100% !important;
  padding-top: var(--ap-nav-h) !important;
}

body:not(.agent-portfolio) .nav-wrapper {
  z-index: 2147483000 !important;
}

.agent-portfolio :is([id], .agent-case-chapter),
body:not(.agent-portfolio) main [id] {
  scroll-margin-top: calc(var(--nrs-sticky-nav-height, var(--ap-nav-h, 72px)) + 24px) !important;
}

html,
body {
  max-width: 100%;
  overflow-x: clip;
}

.agent-portfolio :is(.agent-main,.agent-frame,.agent-hero-grid,.agent-page-hero-grid,.agent-about-grid,.agent-service-grid,.agent-contact-grid,.agent-case-grid,.agent-project-row,.agent-index-item,.agent-footer-grid),
.agent-portfolio :is(.agent-main,.agent-frame,.agent-hero-grid,.agent-page-hero-grid,.agent-about-grid,.agent-service-grid,.agent-contact-grid,.agent-case-grid,.agent-project-row,.agent-index-item,.agent-footer-grid) > * {
  min-width: 0 !important;
  max-width: 100%;
}

.agent-portfolio :is(img,svg,video,iframe,canvas),
body:not(.agent-portfolio) :is(img,svg,video,iframe,canvas) {
  max-width: 100% !important;
}

.agent-portfolio :is(pre,table),
body:not(.agent-portfolio) :is(pre,table) {
  max-width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.agent-portfolio :is(a,button,input,select,textarea,summary),
body:not(.agent-portfolio) :is(a,button,input,select,textarea,summary) {
  touch-action: manipulation;
}

@media (max-width: 1023px) {
  .agent-portfolio {
    --nrs-safe-left: max(var(--ap-gutter), env(safe-area-inset-left, 0px));
    --nrs-safe-right: max(var(--ap-gutter), env(safe-area-inset-right, 0px));
    --nrs-control-top: calc(env(safe-area-inset-top, 0px) + 10px);
  }

  .agent-portfolio .nav-wrapper { display: none !important; }

  .agent-portfolio .agent-mobile-brand {
    position: fixed !important;
    top: var(--nrs-control-top) !important;
    left: var(--nrs-safe-left) !important;
    right: auto !important;
    z-index: 2147483001 !important;
    display: flex !important;
    min-width: 0 !important;
    min-height: var(--nrs-mobile-control) !important;
    max-width: calc(100vw - 9.5rem - env(safe-area-inset-left, 0px) - env(safe-area-inset-right, 0px)) !important;
  }

  .agent-portfolio .mobile-nav-toggle,
  .agent-portfolio .theme-toggle-btn,
  .agent-portfolio #theme-toggle {
    position: fixed !important;
    top: var(--nrs-control-top) !important;
    width: var(--nrs-mobile-control) !important;
    height: var(--nrs-mobile-control) !important;
    min-width: var(--nrs-mobile-control) !important;
    min-height: var(--nrs-mobile-control) !important;
    margin: 0 !important;
    padding: 0 !important;
    z-index: 2147483002 !important;
  }

  .agent-portfolio .theme-toggle-btn,
  .agent-portfolio #theme-toggle {
    right: var(--nrs-safe-right) !important;
    left: auto !important;
    transform: none !important;
  }

  .agent-portfolio .mobile-nav-toggle {
    right: calc(var(--nrs-safe-right) + var(--nrs-mobile-control) + var(--nrs-mobile-gap)) !important;
    left: auto !important;
    transform: none !important;
  }

  .agent-portfolio .mobile-nav-overlay {
    position: fixed !important;
    inset: 0 !important;
    z-index: 2147482000 !important;
    width: 100% !important;
    height: 100dvh !important;
    max-height: 100dvh !important;
    padding: calc(env(safe-area-inset-top, 0px) + 76px) var(--nrs-safe-right) max(24px, env(safe-area-inset-bottom, 0px)) var(--nrs-safe-left) !important;
    overflow-x: hidden !important;
    overflow-y: auto !important;
    overscroll-behavior: contain;
    -webkit-overflow-scrolling: touch;
  }

  .agent-portfolio .mobile-nav-links {
    width: 100% !important;
    min-width: 0 !important;
    max-width: 48rem !important;
    margin-inline: auto !important;
  }

  .agent-portfolio .mobile-nav-links a,
  .agent-portfolio .agent-mobile-theme-toggle {
    min-height: 52px !important;
  }
}

@media (max-width: 850px) {
  body:not(.agent-portfolio) .mobile-nav-toggle,
  body:not(.agent-portfolio) .mobile-logo,
  body:not(.agent-portfolio) .theme-toggle-btn,
  body:not(.agent-portfolio) #theme-toggle {
    top: calc(env(safe-area-inset-top, 0px) + 16px) !important;
    min-width: 48px !important;
    min-height: 48px !important;
  }

  body:not(.agent-portfolio) .mobile-nav-toggle {
    left: calc(env(safe-area-inset-left, 0px) + 16px) !important;
  }

  body:not(.agent-portfolio) .theme-toggle-btn,
  body:not(.agent-portfolio) #theme-toggle {
    right: calc(env(safe-area-inset-right, 0px) + 16px) !important;
  }

  body:not(.agent-portfolio) .mobile-nav-overlay {
    height: 100dvh !important;
    max-height: 100dvh !important;
    padding-top: calc(env(safe-area-inset-top, 0px) + 88px) !important;
    padding-bottom: max(24px, env(safe-area-inset-bottom, 0px)) !important;
    overflow-y: auto !important;
    overscroll-behavior: contain;
  }
}

@media (max-width: 767px) {
  .agent-portfolio :is(input,select,textarea),
  body:not(.agent-portfolio) :is(input,select,textarea) {
    min-width: 0 !important;
    max-width: 100% !important;
    font-size: 16px !important;
  }

  .agent-portfolio .agent-hero-title {
    max-width: 100% !important;
    font-size: clamp(3.4rem, 18vw, 6.2rem) !important;
  }

  .agent-portfolio :is(.agent-page-hero h1,.agent-case-title) {
    max-width: 100% !important;
    font-size: clamp(3.2rem, 17vw, 5.8rem) !important;
  }
}

@media (max-width: 1023px) and (max-height: 600px) {
  .agent-portfolio .mobile-nav-overlay,
  body:not(.agent-portfolio) .mobile-nav-overlay {
    align-items: start !important;
  }
}

@media (prefers-reduced-motion: reduce) {
  #nrs-scroll-progress::before,
  .agent-portfolio #agent-progress,
  .agent-portfolio .mobile-nav-overlay,
  .agent-portfolio .mobile-nav-toggle span {
    transition: none !important;
  }
}
${end}`;

let style = fs.readFileSync(stylePath, 'utf8');
style = style.replace(marker, '').trimEnd();
style += `\n\n${css}\n`;
fs.writeFileSync(stylePath, style, 'utf8');

for (const required of ['#agent-progress', '--nrs-nav-edge', 'width: min(calc(100vw - (2 * var(--nrs-nav-edge))), var(--ap-max)) !important', 'height: 100dvh !important', 'font-size: 16px !important']) {
  if (!style.includes(required)) throw new Error(`[sticky-responsive-shell] Missing contract: ${required}`);
}

console.log(`[sticky-responsive-shell] Applied to ${path.relative(root, stylePath)}.`);
