/**
 * @fileoverview scripts/ensure-interface-polish.cjs
 * Purpose: Apply the final layout and micro-interaction polish contract to the canonical stylesheet and the organized portfolio runtime source used by production builds.
 * Responsibilities:
 * - Append one idempotent CSS polish block covering page-title geometry, project-row feedback, focus states, controls, responsive layouts, and reduced-motion behavior.
 * - Tune the portfolio runtime's reveal/parallax motion values without creating a second runtime implementation.
 * - Resolve both source and `dist/` runtime paths through the responsibility-based `features/portfolio/` folder introduced by the repository organization.
 * - Fail when the stylesheet or required CSS contract disappears instead of silently producing partially polished output.
 * Execution context: Node.js during source generation and `--dist` production build refinement.
 * Connected files:
 * - scripts/build-dist.cjs
 * - scripts/generate-source.cjs
 * - src/scripts/features/portfolio/agent-portfolio.js
 * - src/styles/style.css
 * Maintenance: Keep `runtimePaths` synchronized with the organized runtime tree; do not reintroduce the historical flat `src/scripts/features/agent-portfolio.js` path.
 */
const fs = require('node:fs');
const path = require('node:path');

const repositoryRoot = path.resolve(__dirname, '..');
const useDist = process.argv.includes('--dist');
const base = useDist ? path.join(repositoryRoot, 'dist') : repositoryRoot;
const stylePath = path.join(base, 'style.css');
const runtimePaths = useDist
  ? [
      path.join(base, 'script.js'),
      path.join(base, 'src', 'scripts', 'features', 'portfolio', 'agent-portfolio.js'),
    ]
  : [path.join(repositoryRoot, 'src', 'scripts', 'features', 'portfolio', 'agent-portfolio.js')];

const startMarker = '/* interface-polish-v1:start */';
const endMarker = '/* interface-polish-v1:end */';
const markerPattern = /\/\* interface-polish-v1:start \*\/[\s\S]*?\/\* interface-polish-v1:end \*\//g;

const polishCss = `${startMarker}
.agent-portfolio .agent-page-hero-grid > div:first-child {
  grid-column: 1 / span 8;
  min-width: 0;
}

.agent-portfolio .agent-page-hero h1 {
  grid-column: auto;
  max-width: 11ch;
  overflow-wrap: normal;
  word-break: normal;
  text-wrap: balance;
}

.agent-portfolio .agent-case-title-wrap {
  grid-column: 1 / span 9;
  min-width: 0;
}

.agent-portfolio .agent-case-title {
  grid-column: auto;
  width: auto;
  max-width: 10ch;
  overflow-wrap: normal;
  word-break: normal;
  text-wrap: balance;
}

.agent-portfolio .agent-about-copy {
  grid-column: 1 / span 7;
}

.agent-portfolio .agent-about-aside {
  grid-column: 9 / -1;
}

.agent-portfolio .agent-section-head {
  grid-template-columns: repeat(12, minmax(0, 1fr));
}

.agent-portfolio .agent-section-head .agent-kicker {
  grid-column: 1 / span 3;
}

.agent-portfolio .agent-section-title {
  grid-column: 7 / -1;
}

.agent-portfolio .agent-capabilities {
  align-items: stretch;
}

.agent-portfolio .agent-capability,
.agent-portfolio .agent-capability:nth-child(2),
.agent-portfolio .agent-capability:nth-child(4) {
  transform: none;
}

.agent-portfolio .agent-project-row,
.agent-portfolio .agent-index-item {
  transition:
    background-color var(--ap-standard) var(--ap-ease),
    color var(--ap-standard) var(--ap-ease),
    transform var(--ap-quick) var(--ap-ease);
}

.agent-portfolio .agent-project-copy h3,
.agent-portfolio .agent-index-item h2,
.agent-portfolio .agent-index-item h3 {
  transition: color var(--ap-standard) var(--ap-ease);
}

.agent-portfolio .agent-project-row:focus-visible,
.agent-portfolio .agent-index-item:focus-visible {
  background: color-mix(in srgb, var(--ap-signal) 8%, transparent);
}

.agent-portfolio .agent-project-row:focus-visible .agent-project-copy h3,
.agent-portfolio .agent-index-item:focus-visible h2,
.agent-portfolio .agent-index-item:focus-visible h3 {
  color: var(--ap-signal);
}

.agent-portfolio .agent-project-row:active,
.agent-portfolio .agent-index-item:active {
  transform: translateY(1px);
}

.agent-portfolio .agent-btn::after {
  transition: transform var(--ap-standard) var(--ap-ease);
}

.agent-portfolio .agent-btn:hover::after,
.agent-portfolio .agent-btn:focus-visible::after {
  transform: translate(2px, -2px);
}

.agent-portfolio .agent-btn:active {
  transform: translateY(1px) scale(.985);
}

.agent-portfolio .theme-toggle-btn:active,
.agent-portfolio .mobile-nav-toggle:active {
  transform: scale(.96);
}

.agent-portfolio .agent-case-rail a {
  display: inline-flex;
  width: fit-content;
  color: inherit;
  text-decoration: none;
  transition: color var(--ap-standard) var(--ap-ease), transform var(--ap-standard) var(--ap-ease);
}

.agent-portfolio .agent-case-rail a[aria-current='true'],
.agent-portfolio .agent-case-rail a:focus-visible {
  color: var(--ap-signal);
  transform: translateX(2px);
}

@media (hover: hover) and (pointer: fine) {
  .agent-portfolio .agent-project-row:hover,
  .agent-portfolio .agent-index-item:hover {
    background: color-mix(in srgb, var(--ap-signal) 7%, transparent);
  }

  .agent-portfolio .agent-project-row:hover .agent-project-copy h3,
  .agent-portfolio .agent-index-item:hover h2,
  .agent-portfolio .agent-index-item:hover h3 {
    color: var(--ap-signal);
  }

  .agent-portfolio .agent-case-rail a:hover {
    color: var(--ap-signal);
    transform: translateX(2px);
  }
}

@media (max-width: 1023px) {
  .agent-portfolio .agent-page-hero-grid > div:first-child,
  .agent-portfolio .agent-case-title-wrap {
    grid-column: 1 / span 6;
  }

  .agent-portfolio .agent-about-copy {
    grid-column: 1 / span 5;
  }

  .agent-portfolio .agent-about-aside {
    grid-column: 6 / -1;
  }

  .agent-portfolio .agent-section-head {
    grid-template-columns: repeat(8, minmax(0, 1fr));
  }

  .agent-portfolio .agent-section-head .agent-kicker {
    grid-column: 1 / span 2;
  }

  .agent-portfolio .agent-section-title {
    grid-column: 4 / -1;
  }
}

@media (max-width: 767px) {
  .agent-portfolio .agent-page-hero-grid > div:first-child,
  .agent-portfolio .agent-case-title-wrap,
  .agent-portfolio .agent-about-copy,
  .agent-portfolio .agent-about-aside,
  .agent-portfolio .agent-section-head .agent-kicker,
  .agent-portfolio .agent-section-title {
    grid-column: 1;
  }

  .agent-portfolio .agent-page-hero h1,
  .agent-portfolio .agent-case-title {
    max-width: 100%;
  }

  .agent-portfolio .agent-section-head {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .agent-portfolio .agent-project-row,
  .agent-portfolio .agent-index-item,
  .agent-portfolio .agent-project-copy h3,
  .agent-portfolio .agent-index-item h2,
  .agent-portfolio .agent-index-item h3,
  .agent-portfolio .agent-btn::after,
  .agent-portfolio .agent-case-rail a,
  .agent-portfolio .theme-toggle-btn,
  .agent-portfolio .mobile-nav-toggle {
    transition-duration: 0ms;
  }
}
${endMarker}`;

/**
 * Function contract: appendPolishCss
 * Purpose: Replace any previous interface-polish marker block and append exactly one current polish block to the selected source or production stylesheet.
 * Inputs: `file`, absolute stylesheet path to update.
 * Side effects: Reads and rewrites the stylesheet on disk.
 * Returns: Boolean indicating whether the target stylesheet existed and was rewritten.
 */
function appendPolishCss(file) {
  if (!fs.existsSync(file)) return false;
  const before = fs.readFileSync(file, 'utf8');
  const cleaned = before.replace(markerPattern, '').trimEnd();
  fs.writeFileSync(file, `${cleaned}\n\n${polishCss}\n`, 'utf8');
  return true;
}

/**
 * Function contract: patchRuntime
 * Purpose: Apply the approved reduced-motion/reveal/parallax tuning replacements to one organized portfolio runtime copy when those source patterns are present.
 * Inputs: `file`, absolute path to the source or copied production runtime module.
 * Side effects: Reads the runtime file and rewrites it only when at least one approved tuning pattern changes.
 * Returns: Boolean indicating whether the runtime file existed and changed.
 */
function patchRuntime(file) {
  if (!fs.existsSync(file)) return false;
  const before = fs.readFileSync(file, 'utf8');
  let after = before;

  const replacements = [
    ['{ y: 28, autoAlpha: 0 }', '{ y: 18, autoAlpha: 0 }'],
    ['duration: 0.62,', 'duration: 0.48,'],
    ['stagger: 0.055,', 'stagger: 0.04,'],
    ['{ y: 20, autoAlpha: 0 }', '{ y: 12, autoAlpha: 0 }'],
    ['duration: 0.42,', 'duration: 0.34,'],
    ['stagger: 0.045,', 'stagger: 0.035,'],
    ['{ yPercent: -2 },', '{ yPercent: -1.5 },'],
    ['yPercent: 5,', 'yPercent: 3,'],
    ["move(((event.clientX - bounds.left) / bounds.width - 0.5) * 3);", "move(((event.clientX - bounds.left) / bounds.width - 0.5) * 2);"]
  ];

  for (const [from, to] of replacements) after = after.replace(from, to);

  if (after === before) return false;
  fs.writeFileSync(file, after, 'utf8');
  return true;
}

const stylePatched = appendPolishCss(stylePath);
let runtimePatched = 0;
for (const file of runtimePaths) {
  if (patchRuntime(file)) runtimePatched += 1;
}

if (!stylePatched) {
  console.error(`[interface-polish] Missing stylesheet: ${path.relative(repositoryRoot, stylePath)}`);
  process.exit(1);
}

const finalCss = fs.readFileSync(stylePath, 'utf8');
const requiredSelectors = [
  '.agent-portfolio .agent-case-title-wrap',
  '.agent-portfolio .agent-page-hero-grid > div:first-child',
  '.agent-portfolio .agent-capability:nth-child(2)',
  '.agent-portfolio .agent-project-row:focus-visible',
  '@media (prefers-reduced-motion: reduce)'
];
const missing = requiredSelectors.filter(/** Callback contract: Keep only required CSS contract selectors missing from the final stylesheet so the transform can fail with an exact list. Inputs: `selector`. Side effects: none. Returns: boolean predicate result. */ (selector) => !finalCss.includes(selector));
if (missing.length) {
  console.error(`[interface-polish] Missing required CSS contracts: ${missing.join(', ')}`);
  process.exit(1);
}

console.log(`[interface-polish] Applied layout + micro-interaction polish to ${useDist ? 'dist' : 'source'} (${runtimePatched} runtime file${runtimePatched === 1 ? '' : 's'} tuned).`);
