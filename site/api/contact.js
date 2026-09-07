/**
 * @fileoverview api/contact.js
 * Purpose: Handle contact server-side requests with validation and deployment-compatible response behavior.
 * Responsibilities:
 * - Validate request data before performing server-side work.
 * - Restrict browser submissions and anti-spam verification to known portfolio hosts.
 * - Return predictable status, error, and success responses compatible with the deployed client.
 * Execution context: Serverless/API runtime used by supported deployment targets.
 * Connected files:
 * - README.md
 * - functions/api/contact.js
 * - src/worker.js
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
const CONTACT_EMAIL = 'hinischhalsubba@gmail.com';
const ALLOWED_ORIGINS = new Set([
  'https://nischhalsubba.com.np',
  'https://www.nischhalsubba.com.np',
  'https://nischhalsubba-com-np.vercel.app',
  'https://nischhalsubba-com-np-cdx.pages.dev',
]);
const ALLOWED_TURNSTILE_HOSTNAMES = new Set(
  [...ALLOWED_ORIGINS].map((origin) => new URL(origin).hostname),
);
const MAX_REQUEST_BYTES = 32 * 1024;

export const config = { runtime: 'edge' };

/**
 * Function contract: json
 * Purpose: Implement the json responsibility owned by the contact API handler.
 * Inputs: `payload`, `status`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function json(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      'referrer-policy': 'no-referrer',
      'x-content-type-options': 'nosniff',
    },
  });
}

/**
 * Function contract: clean
 * Purpose: Remove module behavior without disturbing required surrounding contact API handler state.
 * Inputs: `value`, `maxLength`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function clean(value, maxLength) {
  return String(value || '').trim().slice(0, maxLength);
}

/**
 * Function contract: originAllowed
 * Purpose: Accept only canonical HTTPS origins explicitly owned by a supported deployment.
 * Inputs: `request`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Boolean indicating whether the browser Origin is trusted.
 */
function originAllowed(request) {
  const origin = request.headers.get('origin');
  if (!origin) return false;

  try {
    const parsed = new URL(origin);
    if (parsed.protocol !== 'https:') return false;
    if (parsed.username || parsed.password) return false;
    if (parsed.pathname !== '/' || parsed.search || parsed.hash) return false;
    return ALLOWED_ORIGINS.has(parsed.origin);
  } catch {
    return false;
  }
}

/**
 * Function contract: validate
 * Purpose: Validate module behavior and surface actionable failures when the contact API handler contract is violated.
 * Inputs: `fields`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function validate(fields) {
  const errors = {};
  if (fields.name.length < 2) errors.name = 'Enter your name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) errors.email = 'Enter a valid email address.';
  if (!fields.need) errors.need = 'Select a project type.';
  if (!fields.timeline) errors.timeline = 'Select a timeline.';
  if (fields.message.length < 20) errors.message = 'Add at least 20 characters of project context.';
  return errors;
}

/**
 * Function contract: verifyTurnstile
 * Purpose: Validate turnstile and surface actionable failures when the contact API handler contract is violated.
 * Inputs: `secret`, `token`, `remoteip`
 * Side effects: performs network I/O
 * Returns: Promise resolving to the computed function result.
 */
async function verifyTurnstile(secret, token, remoteip) {
  const body = new FormData();
  body.set('secret', secret);
  body.set('response', token);
  if (remoteip) body.set('remoteip', remoteip);

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body,
  });

  if (!response.ok) return { success: false };
  return response.json();
}

/**
 * Function contract: handler
 * Purpose: Implement the handler responsibility owned by the contact API handler.
 * Inputs: `request`
 * Side effects: performs network I/O
 * Returns: Promise resolving to the computed function result.
 */
export default async function handler(request) {
  if (request.method === 'OPTIONS') {
    const origin = request.headers.get('origin');
    if (!originAllowed(request)) return new Response(null, { status: 403 });
    return new Response(null, {
      status: 204,
      headers: {
        'access-control-allow-origin': origin,
        'access-control-allow-methods': 'POST, OPTIONS',
        'access-control-allow-headers': 'content-type',
        'access-control-max-age': '86400',
        'cache-control': 'no-store',
        vary: 'Origin',
      },
    });
  }

  if (request.method !== 'POST') {
    return json({ ok: false, message: 'Method not allowed.' }, 405);
  }

  if (!originAllowed(request)) {
    return json({ ok: false, message: 'This submission origin is not allowed.' }, 403);
  }

  const contentLength = Number(request.headers.get('content-length') || 0);
  if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BYTES) {
    return json({ ok: false, message: 'This submission is too large.' }, 413);
  }

  const contentType = (request.headers.get('content-type') || '').toLowerCase();
  const supportedContentType = contentType.startsWith('multipart/form-data')
    || contentType.startsWith('application/x-www-form-urlencoded');
  if (!supportedContentType) {
    return json({ ok: false, message: 'Unsupported submission format.' }, 415);
  }

  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    return json({
      ok: false,
      message: 'The protected contact form is not configured yet. Please use email instead.',
    }, 503);
  }

  let data;
  try {
    data = await request.formData();
  } catch {
    return json({ ok: false, message: 'The form payload could not be read.' }, 400);
  }

  if (clean(data.get('_honey'), 200)) return json({ ok: true });

  const fields = {
    name: clean(data.get('name'), 100),
    email: clean(data.get('email'), 254),
    need: clean(data.get('need'), 100),
    timeline: clean(data.get('timeline'), 100),
    message: clean(data.get('message'), 5000),
  };
  const errors = validate(fields);
  if (Object.keys(errors).length) {
    return json({ ok: false, message: 'Review the highlighted fields.', errors }, 422);
  }

  const token = clean(data.get('cf-turnstile-response'), 2048);
  if (!token) {
    return json({ ok: false, message: 'Complete the anti-spam check and try again.' }, 422);
  }

  const forwardedFor = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  const verification = await verifyTurnstile(secret, token, forwardedFor);
  const verifiedHostname = String(verification.hostname || '').toLowerCase();
  if (!verification.success || !ALLOWED_TURNSTILE_HOSTNAMES.has(verifiedHostname)) {
    return json({
      ok: false,
      message: 'The anti-spam check could not be verified. Please try again.',
    }, 403);
  }

  const outbound = new FormData();
  outbound.set('name', fields.name);
  outbound.set('email', fields.email);
  outbound.set('need', fields.need);
  outbound.set('timeline', fields.timeline);
  outbound.set('message', fields.message);
  outbound.set('_subject', 'Portfolio inquiry from nischhalsubba.com.np');
  outbound.set('_template', 'table');
  outbound.set('_replyto', fields.email);
  outbound.set('source_page', clean(data.get('source_page'), 500));
  outbound.set('submitted_at', new Date().toISOString());

  const delivery = await fetch(`https://formsubmit.co/ajax/${CONTACT_EMAIL}`, {
    method: 'POST',
    body: outbound,
    headers: { Accept: 'application/json' },
  });

  if (!delivery.ok) {
    return json({
      ok: false,
      message: 'The message service is temporarily unavailable. Please use email instead.',
    }, 502);
  }

  return json({ ok: true, message: 'Thanks. Your message was sent successfully.' });
}
