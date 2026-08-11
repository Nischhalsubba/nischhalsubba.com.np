/**
 * @fileoverview scripts/validate-about-contact.cjs
 * Purpose: Node-based build, content transformation, QA, or maintenance tool for validate about contact.
 * Responsibilities:
 * - Own the behavior/content implied by this file's single responsibility.
 * - Keep public routes, build contracts, and imported module boundaries stable unless the connected owners are updated together.
 * Execution context: Node.js CLI during local development, CI, build, or maintenance.
 * Connected files:
 * - docs/repository/file-catalog.md
 * - scripts/build-dist.cjs
 * - scripts/generate-source.cjs
 * - package.json
 * Maintenance: Update this header when responsibility or dependencies change; generated/vendor files are documented at their source instead.
 */
const fs = require('node:fs');
const path = require('node:path');

const useDist = process.argv.includes('--dist');
const root = path.resolve(__dirname, '..', useDist ? 'dist' : '');

/**
 * Function contract: read
 * Purpose: Retrieves read and returns it in the form expected by its caller.
 * Inputs: name.
 * Side effects: may read or write repository/filesystem state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
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
function count(html, token) {
  return html.split(token).length - 1;
}

const about = read('about.html');
const contact = read('contact.html');
const errors = [];

if (count(about, '<h1') !== 1) errors.push('About must contain exactly one H1.');
if (!about.includes('nrs-about-spacious')) errors.push('About spacious layout missing.');
['about-title', 'about-approach', 'about-experience', 'about-capabilities'].forEach(/** Callback contract: Processes the callback step for ['about title', 'about approach', 'about experience', 'about capabilities'] without leaking orchestration details to the caller. Inputs: id. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (id) => {
  if (!about.includes(`id="${id}"`)) errors.push(`About section ${id} missing.`);
});
if (count(about, 'nrs-section reveal-on-scroll') > 5) errors.push('About has too many primary content sections.');

if (count(contact, '<h1') !== 1) errors.push('Contact must contain exactly one H1.');
if (!contact.includes('nrs-contact-spacious')) errors.push('Contact spacious layout missing.');
['contact-name', 'contact-email', 'contact-need', 'contact-timeline', 'contact-message', 'contact-form-status', 'contact-privacy-note'].forEach(/** Callback contract: Processes the callback step for ['contact name', 'contact email', 'contact need', 'contact timeline', 'contact message', 'contact form status', 'contact privacy note'] without leaking orchestration details to the caller. Inputs: id. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (id) => {
  if (!contact.includes(`id="${id}"`)) errors.push(`Contact control ${id} missing.`);
});
['for="contact-name"', 'for="contact-email"', 'for="contact-need"', 'for="contact-timeline"', 'for="contact-message"'].forEach(/** Callback contract: Processes the callback step for ['for="contact name"', 'for="contact email"', 'for="contact need"', 'for="contact timeline"', 'for="contact message"'] without leaking orchestration details to the caller. Inputs: token. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (token) => {
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
  errors.forEach(/** Callback contract: Processes the callback step for errors without leaking orchestration details to the caller. Inputs: error. Side effects: may emit diagnostics or inspect process state. No explicit return contract. */ (error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`[about-contact] ${useDist ? 'Build' : 'Source'} validation passed.`);
