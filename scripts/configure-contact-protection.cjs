/**
 * @fileoverview scripts/configure-contact-protection.cjs
 * Purpose: Apply the configure contact protection production transformation or maintenance step while preserving canonical source/build contracts.
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
const targetRoot = process.argv.includes('--dist') ? path.join(root, 'dist') : root;
const file = path.join(targetRoot, 'contact.html');
const siteKey = String(process.env.TURNSTILE_SITE_KEY || '').trim();

if (!fs.existsSync(file)) {
  console.error(`[contact-protection] Missing ${path.relative(root, file)}.`);
  process.exit(1);
}

let html = fs.readFileSync(file, 'utf8');
html = html.replace(/\s*<meta name="turnstile-site-key"[^>]*>/gi, '');
if (siteKey) {
  html = html.replace('</head>', `  <meta name="turnstile-site-key" content="${siteKey.replace(/["<>]/g, '')}" />\n</head>`);
  console.log('[contact-protection] Turnstile site key added to the contact page.');
} else {
  console.log('[contact-protection] TURNSTILE_SITE_KEY is not set; the contact form will use its provider fallback.');
}

const privacy = 'Your name, email and project context are sent securely through this website to the portfolio inbox. Cloudflare Turnstile may check submissions for abuse. Inquiry data is not sold or used for marketing. Avoid passwords, payment details or confidential credentials. <a href="/privacy">Read the privacy notice</a>.';
html = html.replace(/<p class="nrs-contact-privacy">[\s\S]*?<\/p>/i, `<p class="nrs-contact-privacy">${privacy}</p>`);
html = html.replace(/<p class="nrs-form-note" id="contact-privacy-note">[\s\S]*?<\/p>/i, `<p class="nrs-form-note" id="contact-privacy-note">${privacy}</p>`);

fs.writeFileSync(file, html, 'utf8');
console.log(`[contact-protection] Updated ${path.relative(root, file)}.`);
