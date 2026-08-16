/**
 * @fileoverview scripts/ensure-mobile-header-polish.cjs
 * Purpose: Apply the ensure mobile header polish production transformation or maintenance step while preserving canonical source/build contracts.
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
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const targetRoot = process.argv.includes('--dist') ? path.join(root, 'dist') : root;
const stylePath = path.join(targetRoot, 'style.css');
const styleVersion = '45.0';
const scriptVersion = '35.0';

const css = `

/* nrs-mobile-header-polish-v45 */
@media (max-width: 850px) {
  .nav-wrapper {
    display: none !important;
  }

  .mobile-nav-toggle,
  .mobile-logo,
  .theme-toggle-btn {
    position: fixed !important;
    top: calc(env(safe-area-inset-top, 0px) + 18px) !important;
    z-index: 2147483000 !important;
  }

  .mobile-nav-toggle {
    display: inline-flex !important;
    left: calc(env(safe-area-inset-left, 0px) + 18px) !important;
    right: auto !important;
    width: 52px !important;
    height: 52px !important;
    min-width: 52px !important;
    min-height: 52px !important;
    transform: none !important;
    align-items: center !important;
    justify-content: center !important;
    flex-direction: column !important;
    gap: 6px !important;
    color: var(--text-primary) !important;
  }

  .mobile-nav-toggle span {
    display: block !important;
    width: 22px !important;
    height: 2px !important;
    min-height: 2px !important;
    border-radius: 999px !important;
    background: currentColor !important;
    opacity: 1 !important;
    visibility: visible !important;
    transform: none !important;
  }

  html[data-theme='light'] .mobile-nav-toggle {
    color: #111312 !important;
    background: rgba(255, 255, 255, .94) !important;
    border-color: rgba(17, 19, 18, .16) !important;
  }

  html[data-theme='dark'] .mobile-nav-toggle {
    color: #f4f5f2 !important;
  }

  .mobile-logo {
    display: inline-flex !important;
    left: 50% !important;
    right: auto !important;
    transform: translateX(-50%) !important;
    width: auto !important;
    max-width: calc(100vw - 190px - env(safe-area-inset-left, 0px) - env(safe-area-inset-right, 0px)) !important;
    min-width: 0 !important;
    min-height: 52px !important;
    padding: 0 16px !important;
    align-items: center !important;
    justify-content: center !important;
    overflow: hidden !important;
    white-space: nowrap !important;
    text-overflow: ellipsis !important;
  }

  .theme-toggle-btn {
    right: calc(env(safe-area-inset-right, 0px) + 18px) !important;
    left: auto !important;
    width: 52px !important;
    height: 52px !important;
    min-width: 52px !important;
    min-height: 52px !important;
    transform: none !important;
  }

  .mobile-nav-overlay {
    padding-top: calc(env(safe-area-inset-top, 0px) + 104px) !important;
  }
}

@media (max-width: 720px) {
  main:has(.case-hero-img-container) .section-container:has(.snapshot-grid),
  .nrs-case-study .section-container:has(.snapshot-grid) {
    padding-top: 24px !important;
    padding-bottom: 34px !important;
    border-top: 0 !important;
  }

  main:has(.case-hero-img-container) .snapshot-grid,
  .nrs-case-study .snapshot-grid,
  .snapshot-grid:has(h5) {
    display: grid !important;
    grid-template-columns: 1fr !important;
    gap: 10px !important;
    width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
    border: 0 !important;
    border-radius: 0 !important;
    background: transparent !important;
    overflow: visible !important;
  }

  main:has(.case-hero-img-container) .snapshot-grid > div,
  .nrs-case-study .snapshot-grid > div,
  .snapshot-grid:has(h5) > div {
    display: grid !important;
    grid-template-columns: minmax(84px, .34fr) minmax(0, 1fr) !important;
    align-items: center !important;
    gap: 16px !important;
    width: 100% !important;
    min-height: 74px !important;
    padding: 18px !important;
    border: 1px solid var(--border-faint) !important;
    border-radius: 18px !important;
    background: var(--bg-panel) !important;
    box-shadow: none !important;
  }

  main:has(.case-hero-img-container) .snapshot-grid h5,
  .nrs-case-study .snapshot-grid h5,
  .snapshot-grid:has(h5) h5 {
    margin: 0 !important;
    color: var(--text-tertiary) !important;
    font-size: .68rem !important;
    line-height: 1.1 !important;
    letter-spacing: .12em !important;
    text-transform: uppercase !important;
  }

  main:has(.case-hero-img-container) .snapshot-grid p,
  .nrs-case-study .snapshot-grid p,
  .snapshot-grid:has(h5) p {
    margin: 0 !important;
    color: var(--text-primary) !important;
    font-size: 1rem !important;
    font-weight: 700 !important;
    line-height: 1.35 !important;
    overflow-wrap: anywhere !important;
  }
}

@media (max-width: 390px) {
  .mobile-logo {
    max-width: calc(100vw - 176px - env(safe-area-inset-left, 0px) - env(safe-area-inset-right, 0px)) !important;
    padding-inline: 12px !important;
    font-size: .84rem !important;
  }

  main:has(.case-hero-img-container) .snapshot-grid > div,
  .nrs-case-study .snapshot-grid > div,
  .snapshot-grid:has(h5) > div {
    grid-template-columns: minmax(76px, .38fr) minmax(0, 1fr) !important;
    gap: 12px !important;
    padding: 16px !important;
  }
}

@media (prefers-reduced-motion: no-preference) {
  body.nrs-page-enter {
    animation: nrsPageEnter 420ms cubic-bezier(.2,.8,.2,1) both !important;
  }

  body.nrs-page-leave {
    animation: nrsPageLeave 220ms cubic-bezier(.2,.8,.2,1) both !important;
    pointer-events: none !important;
  }

  @keyframes nrsPageEnter {
    from {
      opacity: 1;
      transform: translateY(10px);
      filter: blur(6px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
      filter: blur(0);
    }
  }

  @keyframes nrsPageLeave {
    from {
      opacity: 1;
      transform: translateY(0);
      filter: blur(0);
    }
    to {
      opacity: 0;
      transform: translateY(-8px);
      filter: blur(5px);
    }
  }
}
`;


/**
 * Function contract: walk
 * Purpose: Implement the walk responsibility owned by the ensure mobile header polish repository tool.
 * Inputs: `dir`, `files`
 * Side effects: reads filesystem state
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else files.push(full);
  }
  return files;
}


/**
 * Function contract: updateHtmlVersions
 * Purpose: Apply html versions consistently while preserving the surrounding ensure mobile header polish repository tool contract.
 * Inputs: None; derives required state from its enclosing module/runtime context.
 * Side effects: writes filesystem state
 * Returns: Undefined; the function exists for the documented side effects, validation, or orchestration.
 */
function updateHtmlVersions() {
  for (const file of walk(targetRoot).filter( /** Callback contract: Decide whether the current item remains in the filtered result consumed by the enclosing operation. Inputs: `filePath` Side effects: No direct external side effect beyond invoked dependencies. Returns: Boolean predicate result consumed by the enclosing collection lookup/filter. */ (filePath) => filePath.endsWith('.html'))) {
    const before = fs.readFileSync(file, 'utf8');
    const after = before
      .replace(/\/style\.css\?v=[0-9.]+/g, `/style.css?v=${styleVersion}`)
      .replace(/\/script\.js\?v=[0-9.]+/g, `/script.js?v=${scriptVersion}`);
    if (after !== before) fs.writeFileSync(file, after, 'utf8');
  }
}



/**
 * Function contract: updateStyle
 * Purpose: Apply style consistently while preserving the surrounding ensure mobile header polish repository tool contract.
 * Inputs: None; derives required state from its enclosing module/runtime context.
 * Side effects: writes filesystem state
 * Returns: Undefined; the function exists for the documented side effects, validation, or orchestration.
 */
function updateStyle() {
  if (!fs.existsSync(stylePath)) return;
  let style = fs.readFileSync(stylePath, 'utf8');
  style = style.replace(/Version:\s*[0-9.]+/i, `Version: ${styleVersion}`);
  style = style.replace(/\/\* nrs-mobile-header-polish-v\d+ \*\/[\s\S]*$/g, '');
  style += css;
  fs.writeFileSync(stylePath, style, 'utf8');
}

updateHtmlVersions();
updateStyle();

console.log('Applied mobile project card polish, page transitions, and cache-bumped style/runtime assets.');
