/**
 * @fileoverview functions/api/contact.js
 * Purpose: Handle contact server-side requests with validation and deployment-compatible response behavior.
 * Responsibilities:
 * - Validate request data before performing server-side work.
 * - Return predictable status, error, and success responses compatible with the deployed client.
 * Execution context: Serverless/API runtime used by supported deployment targets.
 * Connected files:
 * - README.md
 * - src/worker.js
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
import { EmailMessage } from 'cloudflare:email';

const ALLOWED_ORIGINS = new Set([
  'https://nischhalsubba.com.np',
  'https://www.nischhalsubba.com.np',
]);
const DESTINATION_EMAIL = 'hinischalsubba@gmail.com';
const SENDER_EMAIL = 'portfolio@nischhalsubba.com.np';

/**
 * Function contract: json
 * Purpose: Implement the json responsibility owned by the contact API handler.
 * Inputs: `payload`: input consumed by this operation; `status`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function json(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      'x-content-type-options': 'nosniff',
    },
  });
}

/**
 * Function contract: clean
 * Purpose: Remove module behavior without disturbing required surrounding contact API handler state.
 * Inputs: `value`: input value being transformed or evaluated; `maxLength`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Boolean predicate result consumed by the caller.
 */
function clean(value, maxLength) {
  return String(value || '').trim().slice(0, maxLength);
}

/**
 * Function contract: validate
 * Purpose: Validate module behavior and surface actionable failures when the contact API handler contract is violated.
 * Inputs: `fields`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
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
 * Inputs: `secret`: input consumed by this operation; `token`: input consumed by this operation; `remoteip`: input consumed by this operation
 * Side effects: performs network I/O.
 * Returns: Promise resolving to the computed result used by the caller; failure is propagated or handled inside the function as implemented.
 */
async function verifyTurnstile(secret, token, remoteip) {
  const body = new FormData();
  body.set('secret', secret);
  body.set('response', token);
  if (remoteip) body.set('remoteip', remoteip);
  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body });
  if (!response.ok) return { success: false };
  return response.json();
}

/**
 * Function contract: safeHeader
 * Purpose: Implement the safe header responsibility owned by the contact API handler.
 * Inputs: `value`: input value being transformed or evaluated
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Boolean predicate result consumed by the caller.
 */
function safeHeader(value) {
  return String(value || '').replace(/[\r\n]+/g, ' ').trim();
}

/**
 * Function contract: buildRawEmail
 * Purpose: Build raw email from the supplied inputs in the form expected by downstream contact API handler consumers.
 * Inputs: `fields`: input consumed by this operation; `sourcePage`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Array containing the values selected or transformed by this function.
 */
function buildRawEmail(fields, sourcePage) {
  const boundary = `portfolio-${crypto.randomUUID()}`;
  const subject = safeHeader(`Portfolio inquiry: ${fields.need} from ${fields.name}`);
  const text = [
    'New portfolio inquiry',
    '',
    `Name: ${fields.name}`,
    `Email: ${fields.email}`,
    `Project type: ${fields.need}`,
    `Timeline: ${fields.timeline}`,
    `Source: ${sourcePage || 'Unknown'}`,
    '',
    'Message:',
    fields.message,
  ].join('\n');

  return [
    `From: Nischhal Portfolio <${SENDER_EMAIL}>`,
    `To: ${DESTINATION_EMAIL}`,
    `Reply-To: ${safeHeader(fields.email)}`,
    `Subject: ${subject}`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    '',
    `--${boundary}`,
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    '',
    text,
    `--${boundary}--`,
    '',
  ].join('\r\n');
}

/**
 * Function contract: onRequestPost
 * Purpose: Handles on request post and coordinates the required state or UI response.
 * Inputs: { request, env }.
 * Side effects: may emit diagnostics or inspect process state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: onRequestPost
 * Purpose: Handle request post and coordinate the resulting contact API handler state changes.
 * Inputs: `{ request, env }`: input consumed by this operation
 * Side effects: emits diagnostics or changes process failure state.
 * Returns: Promise resolving to the computed result used by the caller; failure is propagated or handled inside the function as implemented.
 */
export async function onRequestPost({ request, env }) {
  try {
    const origin = request.headers.get('origin');
    if (origin && !ALLOWED_ORIGINS.has(origin) && !origin.endsWith('.pages.dev')) {
      return json({ ok: false, message: 'This submission origin is not allowed.' }, 403);
    }
    if (!env.TURNSTILE_SECRET_KEY) {
      return json({ ok: false, message: 'The anti-spam service is not configured.' }, 503);
    }
    if (!env.CONTACT_EMAIL) {
      return json({ ok: false, message: 'Email delivery is not configured yet.' }, 503);
    }

    const data = await request.formData();
    if (clean(data.get('_honey'), 200)) return json({ ok: true });

    const fields = {
      name: clean(data.get('name'), 100),
      email: clean(data.get('email'), 254),
      need: clean(data.get('need'), 100),
      timeline: clean(data.get('timeline'), 100),
      message: clean(data.get('message'), 5000),
    };
    const errors = validate(fields);
    if (Object.keys(errors).length) return json({ ok: false, message: 'Review the highlighted fields.', errors }, 422);

    const token = clean(data.get('cf-turnstile-response'), 2048);
    if (!token) return json({ ok: false, message: 'Complete the anti-spam check and try again.' }, 422);
    const verification = await verifyTurnstile(env.TURNSTILE_SECRET_KEY, token, request.headers.get('CF-Connecting-IP'));
    if (!verification.success) return json({ ok: false, message: 'The anti-spam check could not be verified. Please try again.' }, 403);

    const raw = buildRawEmail(fields, clean(data.get('source_page'), 500));
    await env.CONTACT_EMAIL.send(new EmailMessage(SENDER_EMAIL, DESTINATION_EMAIL, raw));
    return json({ ok: true, message: 'Thanks. Your message was sent successfully.' });
  } catch (error) {
    console.error('[portfolio] contact submission failed', error);
    return json({ ok: false, message: 'The form could not send your message. Please use the email button while this is fixed.' }, 502);
  }
}

/**
 * Function contract: onRequestOptions
 * Purpose: Handles on request options and coordinates the required state or UI response.
 * Inputs: { request }.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: onRequestOptions
 * Purpose: Handle request options and coordinate the resulting contact API handler state changes.
 * Inputs: `{ request }`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
export function onRequestOptions({ request }) {
  const origin = request.headers.get('origin');
  if (origin && !ALLOWED_ORIGINS.has(origin) && !origin.endsWith('.pages.dev')) return new Response(null, { status: 403 });
  return new Response(null, {
    status: 204,
    headers: {
      'access-control-allow-origin': origin || 'https://nischhalsubba.com.np',
      'access-control-allow-methods': 'POST, OPTIONS',
      'access-control-allow-headers': 'content-type',
      'access-control-max-age': '86400',
    },
  });
}
