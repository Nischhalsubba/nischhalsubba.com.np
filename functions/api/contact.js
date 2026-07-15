import { EmailMessage } from 'cloudflare:email';
import {
  CONTACT_LIMITS,
  clean,
  exceedsRequestLimit,
  isAllowedOrigin,
  isSupportedContentType,
  isValidTurnstileResult,
  validateContactFields,
} from './contact-policy.js';

const DESTINATION_EMAIL = 'hinischalsubba@gmail.com';
const SENDER_EMAIL = 'portfolio@nischhalsubba.com.np';

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

async function verifyTurnstile(secret, token, remoteip, idempotencyKey) {
  const body = new FormData();
  body.set('secret', secret);
  body.set('response', token);
  if (remoteip) body.set('remoteip', remoteip);
  if (idempotencyKey) body.set('idempotency_key', idempotencyKey);

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body,
  });
  if (!response.ok) return { success: false };
  return response.json();
}

function safeHeader(value) {
  return String(value || '').replace(/[\r\n]+/g, ' ').trim();
}

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

export async function onRequestPost({ request, env }) {
  try {
    const origin = request.headers.get('origin');
    if (!isAllowedOrigin(origin)) {
      return json({ ok: false, message: 'This submission origin is not allowed.' }, 403);
    }
    if (!isSupportedContentType(request.headers.get('content-type'))) {
      return json({ ok: false, message: 'Unsupported contact request format.' }, 415);
    }
    if (exceedsRequestLimit(request.headers.get('content-length'))) {
      return json({ ok: false, message: 'The contact request is too large.' }, 413);
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
      name: clean(data.get('name'), CONTACT_LIMITS.name),
      email: clean(data.get('email'), CONTACT_LIMITS.email),
      need: clean(data.get('need'), CONTACT_LIMITS.category),
      timeline: clean(data.get('timeline'), CONTACT_LIMITS.category),
      message: clean(data.get('message'), CONTACT_LIMITS.message),
    };
    const errors = validateContactFields(fields);
    if (Object.keys(errors).length) {
      return json({ ok: false, message: 'Review the highlighted fields.', errors }, 422);
    }

    const token = clean(data.get('cf-turnstile-response'), CONTACT_LIMITS.turnstileToken);
    if (!token) {
      return json({ ok: false, message: 'Complete the anti-spam check and try again.' }, 422);
    }

    const url = new URL(request.url);
    const verification = await verifyTurnstile(
      env.TURNSTILE_SECRET_KEY,
      token,
      request.headers.get('CF-Connecting-IP'),
      crypto.randomUUID(),
    );
    if (!isValidTurnstileResult(verification, url.hostname)) {
      return json({ ok: false, message: 'The anti-spam check could not be verified. Please try again.' }, 403);
    }

    const sourcePage = clean(data.get('source_page'), CONTACT_LIMITS.sourcePage);
    const raw = buildRawEmail(fields, sourcePage);
    await env.CONTACT_EMAIL.send(new EmailMessage(SENDER_EMAIL, DESTINATION_EMAIL, raw));
    return json({ ok: true, message: 'Thanks. Your message was sent successfully.' });
  } catch (error) {
    console.error('[portfolio] contact submission failed', error);
    return json({ ok: false, message: 'The form could not send your message. Please use the email button while this is fixed.' }, 502);
  }
}

export function onRequestOptions({ request }) {
  const origin = request.headers.get('origin');
  if (!isAllowedOrigin(origin)) return new Response(null, { status: 403 });

  return new Response(null, {
    status: 204,
    headers: {
      'access-control-allow-origin': origin || 'https://nischhalsubba.com.np',
      'access-control-allow-methods': 'POST, OPTIONS',
      'access-control-allow-headers': 'content-type',
      'access-control-max-age': '86400',
      vary: 'Origin',
    },
  });
}
