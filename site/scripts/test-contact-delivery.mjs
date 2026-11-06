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
const { sendPayload, sendContact, recordContactSuccess } = await import('../src/scripts/features/forms/contact-form.js');
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

 const calls = [];
 let replies = [];
 globalThis.fetch = /** Callback contract: Mock isolated provider responses. Inputs: URL and fetch options. Side effects: Captures requests and consumes a controlled response queue. Returns: Queued Response or network failure. */ async (url, options) => {
  calls.push({url, body: options.body});
  const reply = replies.shift();
  if (reply instanceof Error) throw reply;
  assert.ok(reply, 'Unexpected duplicate delivery attempt');
  return reply;
 };
 const input = new FormData(); input.set('email','visitor@example.com'); input.set('message','A contact-delivery regression check.'); input.set('cf-turnstile-response','private-challenge-token');
 replies = [Response.json({ok:false},{status:503}), Response.json({success:true})];
 const fallback = await sendContact(input,{firstParty:true});
 assert.equal(fallback.transport,'fallback'); assert.equal(fallback.response.ok,true); assert.equal(calls.length,2);
 assert.equal(calls[0].body.get('cf-turnstile-response'),'private-challenge-token');
 assert.equal(calls[1].body.get('cf-turnstile-response'),null,'Never forward a challenge token to the external provider');
 assert.equal(input.get('cf-turnstile-response'),'private-challenge-token','Preserve the original form values');
 for (const status of [403,422,502]) {
  calls.length=0; replies=[Response.json({ok:false},{status})];
  const failed=await sendContact(input,{firstParty:true});
  assert.equal(failed.response.status,status); assert.equal(calls.length,1,'Do not retry challenge, validation or uncertain-delivery failures');
 }
 calls.length=0; replies=[new TypeError('network interrupted')];
 await assert.rejects(sendContact(input,{firstParty:true}),/network interrupted/); assert.equal(calls.length,1);
 calls.length=0; replies=[Response.json({ok:true,accepted:true})];
 assert.equal((await sendContact(input,{firstParty:true})).transport,'first_party'); assert.equal(calls.length,1);
 calls.length=0; replies=[Response.json({success:false,message:'Activation required'})];
 assert.equal((await sendContact(input)).response.ok,false); assert.equal(calls.length,1);
 input.set('_honey','bot'); calls.length=0; replies=[];
 const discarded=await sendContact(input,{firstParty:true});
 assert.equal(discarded.transport,'discarded'); assert.equal(discarded.result.accepted,undefined); assert.equal(calls.length,0);
 console.log('Shared contact routing, safe fallback, duplicate prevention, token isolation and honeypot exclusion passed.');
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
