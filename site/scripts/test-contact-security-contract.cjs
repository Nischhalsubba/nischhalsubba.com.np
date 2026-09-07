/**
 * @fileoverview test-contact-security-contract.cjs
 * Purpose: Prevent contact-endpoint origin, request-boundary, and Turnstile protections from drifting silently.
 * Responsibilities:
 * - Verify both contact handlers use explicit origin allowlists rather than wildcard preview suffixes.
 * - Verify request size/content-type limits and Turnstile hostname validation remain present.
 * - Verify the Worker routes contact preflight through the contact-specific handler.
 * Execution context: Node.js validation script run by `npm run validate`.
 */
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const cloudflareContact = fs.readFileSync(path.join(root, 'functions/api/contact.js'), 'utf8');
const fallbackContact = fs.readFileSync(path.join(root, 'api/contact.js'), 'utf8');
const worker = fs.readFileSync(path.join(root, 'src/worker.js'), 'utf8');

function requirePattern(source, pattern, label) {
  if (!pattern.test(source)) {
    throw new Error(`Contact security contract missing: ${label}`);
  }
}

function rejectPattern(source, pattern, label) {
  if (pattern.test(source)) {
    throw new Error(`Contact security contract regression: ${label}`);
  }
}

for (const [label, source] of [
  ['Cloudflare contact handler', cloudflareContact],
  ['fallback contact handler', fallbackContact],
]) {
  requirePattern(source, /MAX_REQUEST_BYTES\s*=\s*32\s*\*\s*1024/, `${label} request-size limit`);
  requirePattern(source, /multipart\/form-data/, `${label} multipart content-type allowlist`);
  requirePattern(source, /application\/x-www-form-urlencoded/, `${label} urlencoded content-type allowlist`);
  requirePattern(source, /ALLOWED_TURNSTILE_HOSTNAMES/, `${label} Turnstile hostname allowlist`);
  requirePattern(source, /verification\.hostname/, `${label} Turnstile hostname verification`);
  requirePattern(source, /https:\\?'?\s*\)|parsed\.protocol\s*!==\s*'https:'/, `${label} HTTPS origin requirement`);
  rejectPattern(source, /endsWith\(['"]\.pages\.dev['"]\)/, `${label} wildcard pages.dev trust`);
  rejectPattern(source, /startsWith\(['"]nischhalsubba-com-['"]\)/, `${label} wildcard Vercel preview trust`);
}

requirePattern(
  worker,
  /url\.pathname\s*===\s*['"]\/api\/contact['"][\s\S]*request\.method\s*===\s*['"]OPTIONS['"][\s\S]*onRequestOptions/,
  'Worker contact-specific OPTIONS routing',
);

console.log('Contact security contract passed.');
