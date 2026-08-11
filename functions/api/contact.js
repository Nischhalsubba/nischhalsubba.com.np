/**
 * @fileoverview functions/api/contact.js
 * Purpose: Server-side API handler for contact behavior.
 * Responsibilities:
 * - Own the behavior/content implied by this file's single responsibility.
 * - Keep public routes, build contracts, and imported module boundaries stable unless the connected owners are updated together.
 * Execution context: Serverless/API runtime.
 * Connected files:
 * - README.md
 * - docs/repository/file-catalog.md
 * - src/worker.js
 * Maintenance: Update this header when responsibility or dependencies change; generated/vendor files are documented at their source instead.
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
 * Purpose: Implements the json responsibility for this module.
 * Inputs: payload, status.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
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
 * Purpose: Removes or cleans clean while keeping required outputs intact.
 * Inputs: value, maxLength.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function clean(value, maxLength) {
  return String(value || '').trim().slice(0, maxLength);
}

/**
 * Function contract: validate
 * Purpose: Validates validate and reports violations instead of silently accepting invalid state.
 * Inputs: fields.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
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
 * Purpose: Validates verify turnstile and reports violations instead of silently accepting invalid state.
 * Inputs: secret, token, remoteip.
 * Side effects: may perform network I/O.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
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
 * Purpose: Implements the safe header responsibility for this module.
 * Inputs: value.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function safeHeader(value) {
  return String(value || '').replace(/[\r\n]+/g, ' ').trim();
}

/**
 * Function contract: buildRawEmail
 * Purpose: Creates build raw email from the supplied inputs and repository state.
 * Inputs: fields, sourcePage.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
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
