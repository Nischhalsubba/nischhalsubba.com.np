/**
 * @fileoverview scripts/validate-about-contact.cjs
 * Purpose: Validate validate about contact and fail with actionable diagnostics when the production contract is violated.
 * Responsibilities:
 * - Operate deterministically on canonical source or build output so repeated runs produce stable results.
 * - Surface invalid input or contract drift as explicit failures instead of silently masking it.
 * - Keep path assumptions synchronized with repository manifests and source-layout ownership.
 * Execution context: Node.js CLI during development, generation, build, CI, or repository maintenance.
 * Connected files:
 * - scripts/build-dist.cjs
 * - scripts/generate-source.cjs
 * - package.json
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
const fs = require('node:fs');
const path = require('node:path');

const useDist = process.argv.includes('--dist');
const root = path.resolve(__dirname, '..', useDist ? 'dist' : '');

/**
 * Function contract: read
 * Purpose: Return module behavior from the supplied inputs or current validate about contact repository tool state.
 * Inputs: `name`: stable identifier or label for the current item
 * Side effects: reads repository/filesystem state.
 * Returns: The requested module behavior; early-return/empty-state behavior follows the explicit branches in this function.
 */
function read(name) {
  const file = path.join(root, name);
  if (!fs.existsSync(file)) throw new Error(`Missing ${name}`);
  return fs.readFileSync(file, 'utf8');
}

/**
 * Function contract: count
 * Purpose: Implements the count responsibility for this module.
 * Inputs: html, token.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: count
 * Purpose: Implement the count responsibility owned by the validate about contact repository tool.
 * Inputs: `html`: input consumed by this operation; `token`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function count(html, token) {
  return html.split(token).length - 1;
}

const about = read('about.html');
const contact = read('contact.html');
const errors = [];

if (count(about, '<h1') !== 1) errors.push('About must contain exactly one H1.');
if (!about.includes('nrs-about-spacious')) errors.push('About spacious layout missing.');
['about-title', 'about-approach', 'about-experience', 'about-capabilities'].forEach(/** Callback contract: Processes the callback step for ['about title', 'about approach', 'about experience', 'about capabilities'] without leaking orchestration details to the caller. Inputs: id. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Apply the enclosing side-effect operation to the current collection item. Inputs: `id`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Apply the enclosing side-effect operation to the current collection item. Inputs: `id`. Side effects: no direct external side effect beyond invoked dependencies. Returns: undefined; callback is side-effect-only. */ (id) => {
  if (!about.includes(`id="${id}"`)) errors.push(`About section ${id} missing.`);
});
if (count(about, 'nrs-section reveal-on-scroll') > 5) errors.push('About has too many primary content sections.');

if (count(contact, '<h1') !== 1) errors.push('Contact must contain exactly one H1.');
if (!contact.includes('nrs-contact-spacious')) errors.push('Contact spacious layout missing.');
['contact-name', 'contact-email', 'contact-need', 'contact-timeline', 'contact-message', 'contact-form-status', 'contact-privacy-note'].forEach(/** Callback contract: Processes the callback step for ['contact name', 'contact email', 'contact need', 'contact timeline', 'contact message', 'contact form status', 'contact privacy note'] without leaking orchestration details to the caller. Inputs: id. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Apply the enclosing side-effect operation to the current collection item. Inputs: `id`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Apply the enclosing side-effect operation to the current collection item. Inputs: `id`. Side effects: no direct external side effect beyond invoked dependencies. Returns: undefined; callback is side-effect-only. */ (id) => {
  if (!contact.includes(`id="${id}"`)) errors.push(`Contact control ${id} missing.`);
});
['for="contact-name"', 'for="contact-email"', 'for="contact-need"', 'for="contact-timeline"', 'for="contact-message"'].forEach(/** Callback contract: Processes the callback step for ['for="contact name"', 'for="contact email"', 'for="contact need"', 'for="contact timeline"', 'for="contact message"'] without leaking orchestration details to the caller. Inputs: token. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Apply the enclosing side-effect operation to the current collection item. Inputs: `token`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Apply the enclosing side-effect operation to the current collection item. Inputs: `token`. Side effects: no direct external side effect beyond invoked dependencies. Returns: undefined; callback is side-effect-only. */ (token) => {
  if (!contact.includes(token)) errors.push(`Contact label ${token} missing.`);
});
if (!contact.includes('role="status"') || !contact.includes('aria-live="polite"')) errors.push('Contact live status region missing.');
if (!contact.includes('Avoid passwords') && !contact.includes('Do not include passwords')) errors.push('Contact privacy guidance missing.');
if (!contact.includes('action="/api/contact"')) errors.push('Contact HTML must prefer the first-party /api/contact endpoint.');
if (/action=["']https:\/\/formsubmit\.co/i.test(contact)) errors.push('Contact HTML must not make FormSubmit the primary form action.');
if (!contact.includes('name="_honey"')) errors.push('Contact honeypot field missing.');
if (!contact.includes('minlength="20"') || !contact.includes('maxlength="5000"')) errors.push('Contact message length limits missing.');

if (errors.length) {
  console.error(`[about-contact] ${useDist ? 'Build' : 'Source'} validation failed:`);
  errors.forEach(/** Callback contract: Processes the callback step for errors without leaking orchestration details to the caller. Inputs: error. Side effects: may emit diagnostics or inspect process state. No explicit return contract. */ /** Callback contract: Apply the enclosing side-effect operation to the current collection item. Inputs: `error`. Side effects: emits diagnostics or changes process failure state. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Apply the enclosing side-effect operation to the current collection item. Inputs: `error`. Side effects: emits diagnostics or changes process failure state. Returns: computed expression result consumed by the enclosing operation. */ (error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`[about-contact] ${useDist ? 'Build' : 'Source'} validation passed.`);
