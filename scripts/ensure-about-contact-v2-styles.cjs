/**
 * @fileoverview scripts/ensure-about-contact-v2-styles.cjs
 * Purpose: Apply the ensure about contact v2 styles production transformation or maintenance step while preserving canonical source/build contracts.
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
const version = '42.0';

const css = `

/* nrs-about-contact-v2 */
.nrs-about-v2,
.nrs-contact-v2 {
  width: var(--site-width) !important;
  max-width: var(--site-width) !important;
  margin-inline: auto !important;
}
.nrs-about-v2 section,
.nrs-contact-v2 section {
  width: 100% !important;
  max-width: none !important;
}
.nrs-about-v2-hero,
.nrs-contact-v2-hero {
  display: grid !important;
  grid-template-columns: minmax(0, .95fr) minmax(420px, .75fr) !important;
  gap: clamp(38px, 6vw, 96px) !important;
  align-items: end !important;
  min-height: auto !important;
  padding-top: clamp(148px, 13vw, 210px) !important;
  padding-bottom: clamp(76px, 8vw, 126px) !important;
  border-bottom: 1px solid var(--hairline) !important;
}
.nrs-about-v2-copy,
.nrs-contact-v2-copy,
.nrs-about-v2-panel,
.nrs-contact-v2-form,
.nrs-about-v2-proof article,
.nrs-about-v2-steps article,
.nrs-contact-v2-context article,
.nrs-contact-v2-footer-cta,
.nrs-about-v2-cta {
  position: relative !important;
}
.nrs-about-v2 .hero-title,
.nrs-contact-v2 .hero-title {
  max-width: 980px !important;
  margin: 0 !important;
  font-size: clamp(3rem, 6vw, 6.7rem) !important;
  line-height: .96 !important;
  letter-spacing: 0 !important;
}
.nrs-about-v2 .body-large,
.nrs-contact-v2 .body-large {
  max-width: 740px !important;
  margin: 28px 0 0 !important;
}
.nrs-about-v2 .cta-group,
.nrs-contact-v2 .cta-group {
  margin-top: 34px !important;
}
.nrs-about-v2-panel,
.nrs-contact-v2-form {
  display: grid !important;
  gap: 22px !important;
  padding: clamp(28px, 3.5vw, 48px) !important;
  border: 1px solid var(--border-faint) !important;
  border-radius: var(--radius-xl) !important;
  background: linear-gradient(180deg, var(--bg-panel-2), var(--bg-panel)) !important;
  box-shadow: var(--shadow-card) !important;
}
.nrs-about-v2-panel h2,
.nrs-contact-form-head h2 {
  max-width: 520px !important;
  margin: 0 !important;
  font-size: clamp(2rem, 3.1vw, 3.45rem) !important;
  line-height: 1 !important;
}
.nrs-about-v2-panel p,
.nrs-contact-form-head p {
  margin: 0 !important;
  color: var(--text-secondary) !important;
}
.nrs-about-v2-panel dl {
  display: grid !important;
  grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
  gap: 1px !important;
  overflow: hidden !important;
  margin: 8px 0 0 !important;
  border: 1px solid var(--border-faint) !important;
  border-radius: var(--radius-lg) !important;
  background: var(--border-faint) !important;
}
.nrs-about-v2-panel dl div {
  min-height: 104px !important;
  padding: 18px !important;
  background: var(--bg-surface) !important;
}
.nrs-about-v2-panel dt {
  color: var(--text-tertiary) !important;
  font-size: .72rem !important;
  font-weight: 800 !important;
  letter-spacing: .12em !important;
  text-transform: uppercase !important;
}
.nrs-about-v2-panel dd {
  margin: 10px 0 0 !important;
  color: var(--text-primary) !important;
  font-weight: 800 !important;
  line-height: 1.15 !important;
}
.nrs-about-v2-proof,
.nrs-contact-v2-context {
  display: grid !important;
  grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
  gap: clamp(18px, 2.4vw, 32px) !important;
  padding-block: clamp(58px, 7vw, 106px) !important;
  border-bottom: 1px solid var(--hairline) !important;
}
.nrs-contact-v2-context {
  grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
}
.nrs-about-v2-proof article,
.nrs-about-v2-steps article,
.nrs-contact-v2-context article {
  display: grid !important;
  align-content: start !important;
  gap: 20px !important;
  min-height: 260px !important;
  padding: clamp(26px, 3vw, 42px) !important;
  border: 1px solid var(--border-faint) !important;
  border-radius: var(--radius-lg) !important;
  background: var(--bg-panel) !important;
}
.nrs-contact-v2-context article {
  min-height: 230px !important;
}
.nrs-about-v2-proof h2,
.nrs-about-v2-steps h3,
.nrs-contact-v2-context h2 {
  margin: 0 !important;
  max-width: 360px !important;
  font-size: clamp(1.45rem, 2vw, 2.25rem) !important;
  line-height: 1.05 !important;
}
.nrs-about-v2-proof p,
.nrs-about-v2-steps p,
.nrs-contact-v2-context p {
  margin: 0 !important;
  color: var(--text-secondary) !important;
}
.nrs-about-v2-section {
  display: grid !important;
  gap: clamp(34px, 5vw, 76px) !important;
  padding-block: clamp(76px, 8vw, 126px) !important;
  border-bottom: 1px solid var(--hairline) !important;
}
.nrs-about-v2-section .nrs-section-intro {
  display: grid !important;
  grid-template-columns: minmax(180px, 260px) minmax(0, 1fr) !important;
  gap: clamp(28px, 5vw, 80px) !important;
  align-items: end !important;
}
.nrs-about-v2-section .section-title {
  max-width: 900px !important;
  margin: 0 !important;
}
.nrs-about-v2-steps {
  display: grid !important;
  grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
  gap: clamp(18px, 2.4vw, 32px) !important;
}
.nrs-about-v2-steps article span {
  color: var(--text-tertiary) !important;
  font-weight: 800 !important;
  letter-spacing: .12em !important;
}
.nrs-about-v2-split {
  grid-template-columns: minmax(0, .95fr) minmax(420px, 1.05fr) !important;
  align-items: start !important;
}
.nrs-about-v2-tags {
  display: flex !important;
  flex-wrap: wrap !important;
  gap: 12px !important;
}
.nrs-about-v2-tags span {
  min-height: 46px !important;
  display: inline-flex !important;
  align-items: center !important;
  padding: 0 18px !important;
  border: 1px solid var(--border-faint) !important;
  border-radius: var(--radius-pill) !important;
  background: var(--bg-surface) !important;
  color: var(--text-primary) !important;
  font-weight: 800 !important;
}
.nrs-about-v2-cta,
.nrs-contact-v2-footer-cta {
  display: grid !important;
  grid-template-columns: minmax(0, 1fr) auto !important;
  gap: clamp(28px, 5vw, 76px) !important;
  align-items: end !important;
  margin-block: clamp(74px, 8vw, 124px) !important;
  padding: clamp(38px, 5vw, 76px) !important;
  border: 1px solid var(--border-faint) !important;
  border-radius: var(--radius-xl) !important;
  background: var(--bg-panel) !important;
}
.nrs-about-v2-cta h2,
.nrs-contact-v2-footer-cta h2 {
  max-width: 840px !important;
  margin: 0 !important;
  font-size: clamp(2.35rem, 4.7vw, 5rem) !important;
}
.nrs-about-v2-cta p,
.nrs-contact-v2-footer-cta p {
  max-width: 660px !important;
  margin: 18px 0 0 !important;
  color: var(--text-secondary) !important;
}
.nrs-contact-v2-hero {
  grid-template-columns: minmax(0, .75fr) minmax(520px, .95fr) !important;
  align-items: start !important;
}
.nrs-contact-v2-meta {
  display: grid !important;
  grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
  gap: 14px !important;
  margin-top: 36px !important;
}
.nrs-contact-v2-meta a {
  display: grid !important;
  gap: 8px !important;
  min-height: 118px !important;
  padding: 22px !important;
  border: 1px solid var(--border-faint) !important;
  border-radius: var(--radius-lg) !important;
  background: var(--bg-panel) !important;
  text-decoration: none !important;
}
.nrs-contact-v2-meta span {
  color: var(--text-tertiary) !important;
  font-size: .72rem !important;
  font-weight: 800 !important;
  letter-spacing: .12em !important;
  text-transform: uppercase !important;
}
.nrs-contact-v2-meta strong {
  color: var(--text-primary) !important;
  overflow-wrap: anywhere !important;
}
.nrs-contact-v2-form label {
  display: grid !important;
  gap: 8px !important;
  margin: 0 !important;
}
.nrs-contact-form-grid {
  display: grid !important;
  grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
  gap: 18px !important;
}
.nrs-contact-v2-form input,
.nrs-contact-v2-form select,
.nrs-contact-v2-form textarea {
  width: 100% !important;
}
.nrs-hidden-field {
  position: absolute !important;
  left: -9999px !important;
  width: 1px !important;
  height: 1px !important;
  opacity: 0 !important;
}
.nrs-contact-form-actions {
  display: grid !important;
  grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
  gap: 14px !important;
}
.form-status {
  margin: 0 !important;
  padding: 14px 16px !important;
  border: 1px solid var(--border-faint) !important;
  border-radius: var(--radius-md) !important;
  background: var(--bg-surface) !important;
  color: var(--text-secondary) !important;
}
.form-status[data-tone='success'] { border-color: rgba(120, 220, 160, .45) !important; color: #bdf0cf !important; }
.form-status[data-tone='error'] { border-color: rgba(255, 120, 120, .45) !important; color: #ffd0d0 !important; }
html[data-theme='light'] .form-status[data-tone='success'] { color: #146b35 !important; }
html[data-theme='light'] .form-status[data-tone='error'] { color: #9b2323 !important; }
@media (max-width: 1100px) {
  .nrs-about-v2-hero,
  .nrs-contact-v2-hero,
  .nrs-about-v2-split,
  .nrs-about-v2-cta,
  .nrs-contact-v2-footer-cta,
  .nrs-about-v2-section .nrs-section-intro {
    grid-template-columns: 1fr !important;
  }
  .nrs-about-v2-proof,
  .nrs-about-v2-steps,
  .nrs-contact-v2-context {
    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
  }
  .nrs-contact-v2-hero {
    padding-top: clamp(132px, 13vw, 180px) !important;
  }
}
@media (max-width: 720px) {
  .nrs-about-v2-proof,
  .nrs-about-v2-steps,
  .nrs-contact-v2-context,
  .nrs-contact-v2-meta,
  .nrs-contact-form-grid,
  .nrs-contact-form-actions,
  .nrs-about-v2-panel dl {
    grid-template-columns: 1fr !important;
  }
  .nrs-about-v2 .hero-title,
  .nrs-contact-v2 .hero-title {
    font-size: clamp(2.6rem, 13vw, 4.3rem) !important;
  }
  .nrs-contact-v2-form,
  .nrs-about-v2-panel,
  .nrs-about-v2-cta,
  .nrs-contact-v2-footer-cta {
    padding: 24px !important;
  }
}
`;

/**
 * Function contract: walk
 * Purpose: Implement the walk responsibility owned by the ensure about contact v2 styles repository tool.
 * Inputs: `dir`: input consumed by this operation; `files`: input consumed by this operation
 * Side effects: reads repository/filesystem state.
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
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
 * Function contract: updateHtmlStylesheetVersion
 * Purpose: Apply html stylesheet version consistently while preserving the surrounding ensure about contact v2 styles repository tool contract.
 * Inputs: None; derives required state from the enclosing module/runtime context.
 * Side effects: writes repository/filesystem state.
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
 */
function updateHtmlStylesheetVersion() {
  for (const file of walk(targetRoot).filter(/** Callback contract: Decide whether the current item should remain in the filtered result used by the enclosing operation. Inputs: `filePath`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ (filePath) => filePath.endsWith('.html'))) {
    const before = fs.readFileSync(file, 'utf8');
    const after = before.replace(/\/style\.css\?v=[0-9.]+/g, `/style.css?v=${version}`);
    if (after !== before) fs.writeFileSync(file, after, 'utf8');
  }
}

/**
 * Function contract: updateStyle
 * Purpose: Applies update style while preserving the surrounding repository/runtime contract.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may read or write repository/filesystem state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: updateStyle
 * Purpose: Apply style consistently while preserving the surrounding ensure about contact v2 styles repository tool contract.
 * Inputs: None; derives required state from the enclosing module/runtime context.
 * Side effects: writes repository/filesystem state.
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
 */
function updateStyle() {
  if (!fs.existsSync(stylePath)) return;
  let style = fs.readFileSync(stylePath, 'utf8');
  style = style.replace(/Version:\s*[0-9.]+/i, `Version: ${version}`);
  style = style.replace(/\/\* nrs-about-contact-v2 \*\/[\s\S]*$/g, '');
  style += css;
  fs.writeFileSync(stylePath, style, 'utf8');
}

updateHtmlStylesheetVersion();
updateStyle();

console.log('Applied About v2 and Contact v2 styling to the single shared stylesheet.');
