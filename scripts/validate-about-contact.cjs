const fs = require('node:fs');
const path = require('node:path');

const useDist = process.argv.includes('--dist');
const root = path.resolve(__dirname, '..', useDist ? 'dist' : '');

function read(name) {
  const file = path.join(root, name);
  if (!fs.existsSync(file)) throw new Error(`Missing ${name}`);
  return fs.readFileSync(file, 'utf8');
}

function count(html, token) {
  return html.split(token).length - 1;
}

const about = read('about.html');
const contact = read('contact.html');
const errors = [];

if (count(about, '<h1') !== 1) errors.push('About must contain exactly one H1.');
if (!about.includes('nrs-about-spacious')) errors.push('About spacious layout missing.');
['about-title', 'about-approach', 'about-experience', 'about-capabilities'].forEach((id) => {
  if (!about.includes(`id="${id}"`)) errors.push(`About section ${id} missing.`);
});
if (count(about, 'nrs-section reveal-on-scroll') > 5) errors.push('About has too many primary content sections.');

if (count(contact, '<h1') !== 1) errors.push('Contact must contain exactly one H1.');
if (!contact.includes('nrs-contact-spacious')) errors.push('Contact spacious layout missing.');
['contact-name', 'contact-email', 'contact-need', 'contact-timeline', 'contact-message', 'contact-form-status', 'contact-privacy-note'].forEach((id) => {
  if (!contact.includes(`id="${id}"`)) errors.push(`Contact control ${id} missing.`);
});
['for="contact-name"', 'for="contact-email"', 'for="contact-need"', 'for="contact-timeline"', 'for="contact-message"'].forEach((token) => {
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
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`[about-contact] ${useDist ? 'Build' : 'Source'} validation passed.`);
