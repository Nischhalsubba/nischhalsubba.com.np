import { onRequestOptions, onRequestPost } from '../functions/api/contact.js';
import { LEGACY_REDIRECTS } from './generated/legacy-redirects.js';

const ANALYTICS_EVENTS = new Set([
  'project_view',
  'resume_download',
  'contact_start',
  'contact_submit',
  'contact_success',
  'external_profile_click',
  'performance_metric',
]);

function methodNotAllowed() {
  return new Response(JSON.stringify({
    ok: false,
    message: 'Method not allowed.',
  }), {
    status: 405,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      allow: 'POST, OPTIONS',
      'x-content-type-options': 'nosniff',
    },
  });
}

function legacyRedirect(request, url) {
  if (request.method !== 'GET' && request.method !== 'HEAD') return null;
  const targetPath = LEGACY_REDIRECTS.get(url.pathname);
  if (!targetPath) return null;

  const target = new URL(targetPath, url.origin);
  target.search = url.search;
  return Response.redirect(target.toString(), 301);
}

function analyticsResponse(status = 204) {
  return new Response(null, {
    status,
    headers: {
      'cache-control': 'no-store',
      'x-content-type-options': 'nosniff',
      'access-control-allow-origin': 'https://nischhalsubba.com.np',
      'access-control-allow-methods': 'POST, OPTIONS',
      'access-control-allow-headers': 'content-type',
    },
  });
}

async function recordAnalytics(request) {
  if (request.method === 'OPTIONS') return analyticsResponse();
  if (request.method !== 'POST') return methodNotAllowed();

  const length = Number(request.headers.get('content-length') || 0);
  if (length > 4096) return analyticsResponse(413);

  let payload;
  try {
    payload = await request.json();
  } catch {
    return analyticsResponse(400);
  }

  const event = String(payload?.event || '');
  if (!ANALYTICS_EVENTS.has(event)) return analyticsResponse(400);

  const pathName = String(payload?.path || '/').slice(0, 160);
  const context = String(payload?.context || '').slice(0, 80);
  const metric = String(payload?.metric || '').slice(0, 40);
  const numericValue = Number(payload?.value);
  const value = Number.isFinite(numericValue) ? numericValue : 1;

  console.log(JSON.stringify({
    type: 'portfolio_event',
    event,
    path: pathName,
    context,
    metric,
    value,
  }));

  return analyticsResponse();
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    const redirect = legacyRedirect(request, url);
    if (redirect) return redirect;

    if (url.pathname === '/api/contact') {
      if (request.method === 'POST') return onRequestPost({ request, env });
      if (request.method === 'OPTIONS') return onRequestOptions({ request, env });
      return methodNotAllowed();
    }

    if (url.pathname === '/api/analytics') {
      return recordAnalytics(request);
    }

    return env.ASSETS.fetch(request);
  },
};
