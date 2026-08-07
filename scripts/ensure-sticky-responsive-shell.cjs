const fs = require('node:fs');
const path = require('node:path');

const repositoryRoot = path.resolve(__dirname, '..');
const useDist = process.argv.includes('--dist');
const targetRoot = useDist ? path.join(repositoryRoot, 'dist') : repositoryRoot;
const stylesheetPath = path.join(targetRoot, 'style.css');
const startMarker = '/* nrs-sticky-responsive-shell-v1:start */';
const endMarker = '/* nrs-sticky-responsive-shell-v1:end */';
const markerPattern = /\/\* nrs-sticky-responsive-shell-v\d+:start \*\/[\s\S]*?\/\* nrs-sticky-responsive-shell-v\d+:end \*\//g;

if (!fs.existsSync(stylesheetPath)) {
  throw new Error(`[sticky-responsive-shell] Missing stylesheet: ${path.relative(repositoryRoot, stylesheetPath)}`);
}

const css = `${startMarker}
/*
 * Final production contract for the persistent header, scroll progress and
 * narrow-screen layout. This block intentionally runs after every redesign
 * layer so older responsive overrides cannot make the fixed controls overlap.
 */
:root {
  --nrs-fixed-progress-height: 3px;
  --nrs-mobile-control-size: 44px;
  --nrs-mobile-control-gap: 10px;
}

#nrs-scroll-progress,
.agent-portfolio #agent-progress {
  position: fixed !important;
  inset: 0 0 auto 0 !important;
  width: 100% !important;
  max-width: none !important;
  height: var(--nrs-fixed-progress-height) !important;
  margin: 0 !important;
  z-index: 2147483647 !important;
  pointer-events: none !important;
}

#nrs-scroll-progress {
  transform: none !important;
}

.agent-portfolio #agent-progress {
  transform: scaleX(var(--agent-scroll, .01)) !important;
  transform-origin: left center !important;
}

/* The production redesign uses a full-width fixed navigation bar on desktop. */
.agent-portfolio .nav-wrapper {
  position: fixed !important;
  inset: 0 0 auto 0 !important;
  width: 100% !important;
  max-width: none !important;
  margin: 0 !important;
  transform: none !important;
  z-index: 2147483000 !important;
}

.agent-portfolio .agent-main {
  min-width: 0 !important;
  max-width: 100% !important;
  padding-top: var(--ap-nav-h) !important;
}

/* Keep in-page links visible below the pinned shell. */
.agent-portfolio :is([id], .agent-case-chapter),
body:not(.agent-portfolio) main [id] {
  scroll-margin-top: calc(var(--nrs-sticky-nav-height, var(--ap-nav-h, 72px)) + 24px) !important;
}

html,
body {
  max-width: 100%;
  overflow-x: clip;
}

.agent-portfolio :is(
  .agent-main,
  .agent-frame,
  .agent-hero-grid,
  .agent-page-hero-grid,
  .agent-about-grid,
  .agent-service-grid,
  .agent-contact-grid,
  .agent-case-grid,
  .agent-project-row,
  .agent-index-item,
  .agent-footer-grid
),
.agent-portfolio :is(
  .agent-main,
  .agent-frame,
  .agent-hero-grid,
  .agent-page-hero-grid,
  .agent-about-grid,
  .agent-service-grid,
  .agent-contact-grid,
  .agent-case-grid,
  .agent-project-row,
  .agent-index-item,
  .agent-footer-grid
) > * {
  min-width: 0 !important;
  max-width: 100%;
}

.agent-portfolio :is(img, svg, video, iframe, canvas),
body:not(.agent-portfolio) :is(img, svg, video, iframe, canvas) {
  max-width: 100% !important;
}

.agent-portfolio :is(pre, table),
body:not(.agent-portfolio) :is(pre, table) {
  max-width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.agent-portfolio :is(button, a, input, select, textarea, summary),
body:not(.agent-portfolio) :is(button, a, input, select, textarea, summary) {
  touch-action: manipulation;
}

@media (max-width: 1023px) {
  .agent-portfolio {
    --nrs-mobile-safe-left: max(var(--ap-gutter), env(safe-area-inset-left, 0px));
    --nrs-mobile-safe-right: max(var(--ap-gutter), env(safe-area-inset-right, 0px));
    --nrs-mobile-control-top: calc(env(safe-area-inset-top, 0px) + 10px);
  }

  .agent-portfolio .nav-wrapper {
    display: none !important;
  }

  /* Brand on the left, menu + theme on the right. No shared coordinates. */
  .agent-portfolio .agent-mobile-brand {
    position: fixed !important;
    top: var(--nrs-mobile-control-top) !important;
    left: var(--nrs-mobile-safe-left) !important;
    right: auto !important;
    z-index: 2147483001 !important;
    display: flex !important;
    min-width: 0 !important;
    min-height: var(--nrs-mobile-control-size) !important;
    max-width: calc(100vw - 9.5rem - env(safe-area-inset-left, 0px) - env(safe-area-inset-right, 0px)) !important;
    margin: 0 !important;
  }

  .agent-portfolio .mobile-nav-toggle,
  .agent-portfolio .theme-toggle-btn,
  .agent-portfolio #theme-toggle {
    position: fixed !important;
    top: var(--nrs-mobile-control-top) !important;
    width: var(--nrs-mobile-control-size) !important;
    height: var(--nrs-mobile-control-size) !important;
    min-width: var(--nrs-mobile-control-size) !important;
    min-height: var(--nrs-mobile-control-size) !important;
    margin: 0 !important;
    padding: 0 !important;
    z-index: 2147483002 !important;
  }

  .agent-portfolio .theme-toggle-btn,
  .agent-portfolio #theme-toggle {
    right: var(--nrs-mobile-safe-right) !important;
    left: auto !important;
    transform: none !important;
  }

  .agent-portfolio .mobile-nav-toggle {
    right: calc(var(--nrs-mobile-safe-right) + var(--nrs-mobile-control-size) + var(--nrs-mobile-control-gap)) !important;
    left: auto !important;
    transform: none !important;
  }

  .agent-portfolio .mobile-nav-overlay {
    position: fixed !important;
    inset: 0 !important;
    z-index: 2147482000 !important;
    width: 100% !important;
    max-width: none !important;
    height: 100dvh !important;
    max-height: 100dvh !important;
    padding-top: calc(env(safe-area-inset-top, 0px) + 76px) !important;
    padding-right: var(--nrs-mobile-safe-right) !important;
    padding-bottom: max(24px, env(safe-area-inset-bottom, 0px)) !important;
    padding-left: var(--nrs-mobile-safe-left) !important;
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

  .agent-portfolio .agent-mobile-theme-toggle {
    width: 100% !important;
    min-width: 0 !important;
  }
}

/* The preserved non-agent shell uses an 850px mobile breakpoint. */
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
    right: auto !important;
  }

  body:not(.agent-portfolio) .mobile-logo {
    left: 50% !important;
    right: auto !important;
    max-width: calc(100vw - 168px - env(safe-area-inset-left, 0px) - env(safe-area-inset-right, 0px)) !important;
    transform: translateX(-50%) !important;
  }

  body:not(.agent-portfolio) .theme-toggle-btn,
  body:not(.agent-portfolio) #theme-toggle {
    right: calc(env(safe-area-inset-right, 0px) + 16px) !important;
    left: auto !important;
  }

  body:not(.agent-portfolio) .mobile-nav-overlay {
    height: 100dvh !important;
    max-height: 100dvh !important;
    padding-top: calc(env(safe-area-inset-top, 0px) + 88px) !important;
    padding-bottom: max(24px, env(safe-area-inset-bottom, 0px)) !important;
    overflow-y: auto !important;
    overscroll-behavior: contain;
    -webkit-overflow-scrolling: touch;
  }

  body:not(.agent-portfolio) .mobile-nav-links a {
    min-height: 52px !important;
  }
}

@media (max-width: 767px) {
  .agent-portfolio :is(input, select, textarea),
  body:not(.agent-portfolio) :is(input, select, textarea) {
    max-width: 100% !important;
    min-width: 0 !important;
    font-size: 16px !important;
  }

  .agent-portfolio .agent-hero-title {
    max-width: 100% !important;
    font-size: clamp(3.4rem, 18vw, 6.2rem) !important;
    overflow-wrap: normal !important;
  }

  .agent-portfolio :is(.agent-page-hero h1, .agent-case-title) {
    max-width: 100% !important;
    font-size: clamp(3.2rem, 17vw, 5.8rem) !important;
    overflow-wrap: normal !important;
  }

  .agent-portfolio .agent-project-copy h3 {
    max-width: 100% !important;
    font-size: clamp(2.35rem, 12.5vw, 4.25rem) !important;
    overflow-wrap: normal !important;
  }

  .agent-portfolio .agent-btn {
    min-width: 0 !important;
    max-width: 100% !important;
    white-space: normal !important;
  }
}

@media (max-width: 420px) {
  .agent-portfolio {
    --nrs-mobile-control-size: 44px;
    --nrs-mobile-control-gap: 8px;
  }

  .agent-portfolio .agent-mobile-brand {
    max-width: calc(100vw - 8.75rem - env(safe-area-inset-left, 0px) - env(safe-area-inset-right, 0px)) !important;
  }

  .agent-portfolio .agent-project-meta,
  .agent-portfolio .agent-case-facts {
    grid-template-columns: minmax(0, 1fr) !important;
  }

  .agent-portfolio .agent-actions {
    width: 100%;
  }

  .agent-portfolio .agent-actions .agent-btn {
    width: 100% !important;
  }
}

@media (max-width: 1023px) and (max-height: 600px) {
  .agent-portfolio .mobile-nav-overlay,
  body:not(.agent-portfolio) .mobile-nav-overlay {
    align-items: start !important;
  }

  .agent-portfolio .mobile-nav-links,
  body:not(.agent-portfolio) .mobile-nav-links {
    margin-block: 0 !important;
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
${endMarker}`;

let stylesheet = fs.readFileSync(stylesheetPath, 'utf8');
stylesheet = stylesheet.replace(markerPattern, '').trimEnd();
stylesheet += `\n\n${css}\n`;
fs.writeFileSync(stylesheetPath, stylesheet, 'utf8');

const finalCss = fs.readFileSync(stylesheetPath, 'utf8');
const requiredContracts = [
  startMarker,
  '.agent-portfolio #agent-progress',
  '.agent-portfolio .nav-wrapper',
  '.agent-portfolio .mobile-nav-toggle',
  'var(--nrs-mobile-control-size) + var(--nrs-mobile-control-gap)',
  'env(safe-area-inset-top, 0px)',
  'height: 100dvh !important',
  'font-size: 16px !important',
  '@media (prefers-reduced-motion: reduce)',
];
const missing = requiredContracts.filter((contract) => !finalCss.includes(contract));
if (missing.length) {
  throw new Error(`[sticky-responsive-shell] Missing CSS contracts: ${missing.join(', ')}`);
}

console.log(`[sticky-responsive-shell] Applied persistent header/progress and mobile responsive guardrails to ${path.relative(repositoryRoot, stylesheetPath)}.`);
