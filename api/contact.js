const CONTACT_EMAIL = 'hinischhalsubba@gmail.com';
const ALLOWED_HOSTS = new Set([
  'nischhalsubba.com.np',
  'www.nischhalsubba.com.np',
  'nischhalsubba-com-np.vercel.app',
]);

export const config = { runtime: 'edge' };

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

function originAllowed(request) {
  const origin = request.headers.get('origin');
  if (!origin) return true;

  try {
    const hostname = new URL(origin).hostname;
    return ALLOWED_HOSTS.has(hostname)
      || hostname.endsWith('-nischhalsubbas-projects.vercel.app')
      || hostname.startsWith('nischhalsubba-com-') && hostname.endsWith('.vercel.app');
  } catch {
    return false;
  }
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

  if (!response.ok) return { success: false };
  return response.json();
}

export default async function handler(request) {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'access-control-allow-methods': 'POST, OPTIONS',
        'access-control-allow-headers': 'content-type',
        'access-control-max-age': '86400',
      },
    });
  }

  if (request.method !== 'POST') {
    return json({ ok: false, message: 'Method not allowed.' }, 405);
  }

  if (!originAllowed(request)) {
    return json({ ok: false, message: 'This submission origin is not allowed.' }, 403);
  }

  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
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
  if (Object.keys(errors).length) {
    return json({ ok: false, message: 'Review the highlighted fields.', errors }, 422);
  }

  const token = clean(data.get('cf-turnstile-response'), 2048);
  if (!token) return json({ ok: false, message: 'Complete the anti-spam check and try again.' }, 422);

  const forwardedFor = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  const verification = await verifyTurnstile(secret, token, forwardedFor);
  if (!verification.success) {
    return json({ ok: false, message: 'The anti-spam check could not be verified. Please try again.' }, 403);
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
    return json({ ok: false, message: 'The message service is temporarily unavailable. Please use email instead.' }, 502);
  }

  return json({ ok: true, message: 'Thanks. Your message was sent successfully.' });
}
