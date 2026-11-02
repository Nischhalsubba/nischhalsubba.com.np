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
const source = (await readFile(new URL('../functions/api/contact.js', import.meta.url), 'utf8'))
 .replace("import { EmailMessage } from 'cloudflare:email';", 'class EmailMessage { constructor(from, to, raw) { Object.assign(this, {from,to,raw}); } }');
const { onRequestPost } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
const originalFetch = globalThis.fetch;
let sent = [];
const env = {TURNSTILE_SECRET_KEY:'test-secret', CONTACT_EMAIL:{
 /** Function contract: send
  * Purpose: Capture the email emitted by the real handler instead of contacting an external inbox.
  * Inputs: `email` - constructed envelope and raw message.
  * Side effects: Adds the envelope to the test's sent collection.
  * Returns: Promise resolving after capture.
  */
 send:async email=>sent.push(email)}};
const payload = {form_kind:'brief',email:'visitor@example.com', need:'Product design inquiry',timeline:'Not specified',message:'I need help with a complex SaaS interface.', 'cf-turnstile-response':'test-token'};
/** Function contract: request
 * Purpose: Build a real submission request with controlled browser origin and fields.
 * Inputs: `fields`, `origin` - encoded form values and trusted or untrusted origin.
 * Side effects: None.
 * Returns: A real Request consumed by the production handler.
 */
const request = (fields,origin='https://nischhalsubba.com.np') => new Request('https://nischhalsubba.com.np/api/contact',{method:'POST',headers:{origin},body:new URLSearchParams(fields)});
try {
 globalThis.fetch = async()=>Response.json({success:true,hostname:'nischhalsubba.com.np'});
 const brief = await onRequestPost({request:request(payload),env});
 assert.equal(brief.status,200); assert.equal(sent[0].to,'hinischalsubba@gmail.com');
 assert.match(sent[0].raw,/Reply-To: visitor@example.com/);
 assert.equal((await onRequestPost({request:request(payload,'https://attacker.example'),env})).status,403);
 const before=sent.length;
 globalThis.fetch = async()=>Response.json({success:true,hostname:'attacker.example'});
 assert.equal((await onRequestPost({request:request(payload),env})).status,403);
 assert.equal(sent.length,before);
 assert.equal((await onRequestPost({request:request(payload),env:{}})).status,503);
} finally {globalThis.fetch=originalFetch;}
console.log('Contact handler: brief delivery, fixed recipient, reply-to, origin and challenge verification passed.');
