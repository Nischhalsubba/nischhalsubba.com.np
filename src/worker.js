/**
 * @fileoverview src/worker.js
 * Purpose: Routes Cloudflare Worker requests for static assets, canonical redirects, and API behavior.
 * Responsibilities:
 * - Own the behavior/content implied by this file's single responsibility.
 * - Keep public routes, build contracts, and imported module boundaries stable unless the connected owners are updated together.
 * Execution context: Cloudflare Workers runtime.
 * Connected files:
 * - README.md
 * - docs/production-delivery.md
 * - docs/repository/file-catalog.md
 * - docs/repository/file-map.md
 * Maintenance: Update this header when responsibility or dependencies change; generated/vendor files are documented at their source instead.
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
 * Purpose: Implements the method not allowed responsibility for this module.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
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
 * Purpose: Implements the legacy redirect responsibility for this module.
 * Inputs: request, url.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
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
 * Purpose: Implements the analytics response responsibility for this module.
 * Inputs: status.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
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
 * Purpose: Implements the record analytics responsibility for this module.
 * Inputs: request.
 * Side effects: may emit diagnostics or inspect process state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
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
   * Purpose: Retrieves fetch and returns it in the form expected by its caller.
   * Inputs: request, env.
   * Side effects: may perform network I/O.
   * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
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
