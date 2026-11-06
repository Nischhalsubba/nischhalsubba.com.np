/**
 * @fileoverview Contact delivery regression tests.
 * Purpose: Prevent false success and unsafe recipient or verification handling.
 * Responsibilities: Exercise real contact logic with isolated external network boundaries.
 * Execution context: Node.js validation and CI.
 * Connected files: src/scripts/features/forms/contact-form.js, functions/api/contact.js.
 * Maintenance: Assert observable delivery and rejection behavior rather than implementation text.
 */
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
// Import the browser module without running its DOM initializer; network is the only substituted boundary.
const { sendPayload, recordContactSuccess } = await import('../src/scripts/features/forms/contact-form.js');
globalThis.window = {location: {href: 'https://nischhalsubba.com.np/contact'}};
const form = new FormData(); form.set('email', 'visitor@example.com');
const originalFetch = globalThis.fetch;
try {
 for (const rejected of [{success:'false',message:'This form needs Activation'},{success:false},{}, {ok:false}]) {
  globalThis.fetch = async () => Response.json(rejected);
  const result = await sendPayload('https://formsubmit.co/ajax/hinischalsubba@gmail.com', form);
  assert.equal(result.response.ok, false, 'HTTP 200 provider rejection must not become a sent message');
 }
 for (const accepted of [{success:'true'},{success:true},{ok:true}]) {
  globalThis.fetch = async () => Response.json(accepted);
  assert.equal((await sendPayload('/api/contact', form)).response.ok, true);
 }
} finally { globalThis.fetch = originalFetch; }
console.log('Contact delivery acceptance tests passed.');

// Accepted-contact measurement contains only an allowlisted route and transport, never submitted PII.
const emitted = [];
globalThis.window = { dispatchEvent: emitted.push.bind(emitted), dataLayer: [] };
recordContactSuccess('first_party');
assert.deepEqual(window.dataLayer[0], { event: 'contact_success', page_path: '/contact', transport: 'first_party' });
assert.equal(emitted[0].detail.name, 'contact_success');
assert.equal(JSON.stringify(emitted).includes('visitor@example.com'), false);
window.gtag = JSON.parse; // Rejects the event name; a provider failure must remain nonfatal.
assert.doesNotThrow(() => recordContactSuccess('fallback'));
console.log('PII-free confirmed-contact measurement tests passed.');
