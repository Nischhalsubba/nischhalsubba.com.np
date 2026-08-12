/**
 * @fileoverview src/worker.js
 * Purpose: Route Cloudflare Worker requests across canonical redirects, static assets, and server-side API behavior.
 * Responsibilities:
 * - Keep this file focused on its stated responsibility and stable public/build interfaces.
 * - Update connected owners whenever this file changes a shared contract.
 * Execution context: Cloudflare Workers runtime.
 * Connected files:
 * - functions/api/contact.js
 * - README.md
 * - api/contact.js
 * - docs/production-delivery.md
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
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


/**
 * Function contract: methodNotAllowed
 * Purpose: Implement the method not allowed responsibility owned by the worker module.
 * Inputs: None; derives required state from its enclosing module/runtime context.
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
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


/**
 * Function contract: legacyRedirect
 * Purpose: Implement the legacy redirect responsibility owned by the worker module.
 * Inputs: `request`, `url`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function legacyRedirect(request, url) {
  if (request.method !== 'GET' && request.method !== 'HEAD') return null;
  const targetPath = LEGACY_REDIRECTS.get(url.pathname);
  if (!targetPath) return null;

  const target = new URL(targetPath, url.origin);
  target.search = url.search;
  return Response.redirect(target.toString(), 301);
}


/**
 * Function contract: analyticsResponse
 * Purpose: Implement the analytics response responsibility owned by the worker module.
 * Inputs: `status`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
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


/**
 * Function contract: recordAnalytics
 * Purpose: Implement the record analytics responsibility owned by the worker module.
 * Inputs: `request`
 * Side effects: emits diagnostics or changes process failure state
 * Returns: Promise resolving to the computed function result.
 */
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
  
  /**
   * Function contract: fetch
   * Purpose: Return module behavior from the supplied inputs or current worker module state.
   * Inputs: `request`, `env`
   * Side effects: performs network I/O
   * Returns: Promise resolving to the computed function result.
   */
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
