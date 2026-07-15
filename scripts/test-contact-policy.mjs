import assert from 'node:assert/strict';
import {
  CONTACT_LIMITS,
  clean,
  exceedsRequestLimit,
  isAllowedOrigin,
  isSupportedContentType,
  isValidTurnstileResult,
  validateContactFields,
} from '../functions/api/contact-policy.js';

assert.equal(isAllowedOrigin('https://nischhalsubba.com.np'), true);
assert.equal(isAllowedOrigin('https://www.nischhalsubba.com.np'), true);
assert.equal(isAllowedOrigin('https://preview-name.pages.dev'), true);
assert.equal(isAllowedOrigin('https://pages.dev.attacker.example'), false);
assert.equal(isAllowedOrigin('not a url'), false);
assert.equal(isAllowedOrigin(null), true);

assert.equal(isSupportedContentType('multipart/form-data; boundary=test'), true);
assert.equal(isSupportedContentType('application/x-www-form-urlencoded'), true);
assert.equal(isSupportedContentType('application/json'), false);

assert.equal(exceedsRequestLimit(String(CONTACT_LIMITS.requestBytes)), false);
assert.equal(exceedsRequestLimit(String(CONTACT_LIMITS.requestBytes + 1)), true);
assert.equal(exceedsRequestLimit('invalid'), false);

assert.equal(clean('  hello  ', 100), 'hello');
assert.equal(clean('abcdef', 3), 'abc');

assert.deepEqual(validateContactFields({
  name: 'Nischhal',
  email: 'hello@example.com',
  need: 'Product design role',
  timeline: 'This month',
  message: 'This message contains enough useful project context.',
}), {});

assert.deepEqual(Object.keys(validateContactFields({
  name: '',
  email: 'invalid',
  need: '',
  timeline: '',
  message: 'short',
})).sort(), ['email', 'message', 'name', 'need', 'timeline']);

assert.equal(isValidTurnstileResult({
  success: true,
  action: 'portfolio-contact',
  hostname: 'nischhalsubba.com.np',
}, 'nischhalsubba.com.np'), true);
assert.equal(isValidTurnstileResult({
  success: true,
  action: 'wrong-action',
  hostname: 'nischhalsubba.com.np',
}, 'nischhalsubba.com.np'), false);
assert.equal(isValidTurnstileResult({
  success: true,
  action: 'portfolio-contact',
  hostname: 'attacker.example',
}, 'nischhalsubba.com.np'), false);
assert.equal(isValidTurnstileResult({ success: false }, 'nischhalsubba.com.np'), false);

console.log('[contact-policy] Request, validation, origin, and Turnstile policy tests passed.');
