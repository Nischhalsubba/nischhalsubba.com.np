const ALLOWED_ORIGINS = new Set([
  'https://nischhalsubba.com.np',
  'https://www.nischhalsubba.com.np',
]);
const CONTACT_EMAIL = 'hinischhalsubba@gmail.com';
const DELIVERY_TIMEOUT_MS = 10000;

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

function clean(value, maxLength) {
  return String(value || '').trim().slice(0, maxLength);
}

function validate(fields) {
  const errors = {};
  if (fields.name.length < 2) errors.name = 'Enter your name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) errors.email = 'Enter a valid email address.';
  if (!fields.need) errors.need = 'Select a project type.';
  if (!fields.timeline) errors.timeline = 'Select a timeline.';
  if (fields.message.length < 20) errors.message = 'Add at least 20 characters of project context.';
  return errors;
}

async function verifyTurnstile(secret, token, remoteip) {
  const body = new FormData();
  body.set('secret', secret);
  body.set('response', token);
  if (remoteip) body.set('remoteip', remoteip);

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body,
  });
  if (!response.ok) return { success: false, reason: `verification returned ${response.status}` };
  return response.json();
}

async function deliverMessage(fields, data) {
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

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), DELIVERY_TIMEOUT_MS);

  try {
    return await fetch(`https://formsubmit.co/ajax/${CONTACT_EMAIL}`, {
      method: 'POST',
      body: outbound,
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function onRequestPost({ request, env }) {
  const origin = request.headers.get('origin');
  if (origin && !ALLOWED_ORIGINS.has(origin) && !origin.endsWith('.pages.dev')) {
    return json({ ok: false, message: 'This submission origin is not allowed.' }, 403);
  }

  if (!env.TURNSTILE_SECRET_KEY) {
    return json({ ok: false, message: 'The protected contact form is not configured yet. Please use email instead.' }, 503);
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
  if (Object.keys(errors).length) return json({ ok: false, message: 'Review the highlighted fields.', errors }, 422);

  const token = clean(data.get('cf-turnstile-response'), 2048);
  if (!token) return json({ ok: false, message: 'Complete the anti-spam check and try again.' }, 422);

  const verification = await verifyTurnstile(
    env.TURNSTILE_SECRET_KEY,
    token,
    request.headers.get('CF-Connecting-IP'),
  );
  if (!verification.success) {
    return json({ ok: false, message: 'The anti-spam check could not be verified. Please try again.' }, 403);
  }

  try {
    const delivery = await deliverMessage(fields, data);
    if (!delivery.ok) {
      return json({ ok: false, message: 'The message service is temporarily unavailable. Please use email instead.' }, 502);
    }
  } catch (error) {
    const timedOut = error?.name === 'AbortError';
    console.error('[portfolio] contact delivery failed', error);
    return json({
      ok: false,
      message: timedOut
        ? 'The message service took too long to respond. Please use email instead.'
        : 'The message service is temporarily unavailable. Please use email instead.',
    }, 502);
  }

  return json({ ok: true, message: 'Thanks. Your message was sent successfully.' });
}

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
