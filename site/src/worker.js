/**
 * @fileoverview src/worker.js
 * Purpose: Route Cloudflare Worker requests across canonical redirects, static assets, pinned motion-runtime delivery, and server-side API behavior.
 * Responsibilities:
 * - Keep canonical redirects and first-party API endpoints deterministic.
 * - Serve pinned GSAP runtime files through the portfolio origin so client-side motion does not depend on direct access to a third-party CDN.
 * - Fall through all remaining requests to the generated static asset binding.
 * Execution context: Cloudflare Workers runtime.
 * Connected files:
 * - functions/api/contact.js
 * - src/scripts/features/motion/refined-button-motion.js
 * - scripts/finalize-refined-button-motion.cjs
 * - docs/production-delivery.md
 * Maintenance: Keep pinned runtime routes version-aligned with the refined motion module and preserve immutable caching only for versioned assets.
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

const MOTION_RUNTIME_ASSETS = new Map([
  ['/runtime/gsap/gsap-3.15.0.min.js', 'https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js'],
  ['/runtime/gsap/SplitText-3.15.0.min.js', 'https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/SplitText.min.js'],
]);

/**
 * Function contract: methodNotAllowed
 * Purpose: Return the API-specific method-not-allowed response used by POST/OPTIONS endpoints.
 * Inputs: None.
 * Side effects: None.
 * Returns: HTTP 405 JSON response.
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
 * Function contract: runtimeMethodNotAllowed
 * Purpose: Return a method-not-allowed response for immutable GET/HEAD motion-runtime assets.
 * Inputs: None.
 * Side effects: None.
 * Returns: HTTP 405 plain-text response with the correct Allow header.
 */
function runtimeMethodNotAllowed() {
  return new Response('Method not allowed.', {
    status: 405,
    headers: {
      allow: 'GET, HEAD',
      'cache-control': 'no-store',
      'content-type': 'text/plain; charset=utf-8',
      'x-content-type-options': 'nosniff',
    },
  });
}

/**
 * Function contract: legacyRedirect
 * Purpose: Resolve one canonical redirect for a legacy GET/HEAD path while preserving the incoming query string.
 * Inputs: `request`, `url` - incoming request and parsed URL.
 * Side effects: None.
 * Returns: Redirect response when the path is known, otherwise null.
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
 * Purpose: Build the compact no-store response shared by analytics ingestion outcomes.
 * Inputs: `status` - HTTP status code, defaulting to 204.
 * Side effects: None.
 * Returns: Analytics endpoint response.
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
 * Purpose: Validate and emit one bounded first-party portfolio analytics event.
 * Inputs: `request` - incoming analytics request.
 * Side effects: Reads request JSON and writes a structured event to Worker logs.
 * Returns: Promise resolving to an analytics response.
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

/**
 * Function contract: motionRuntimeResponse
 * Purpose: Proxy one pinned GSAP runtime asset through the portfolio origin with immutable versioned caching.
 * Inputs: `request`, `upstreamUrl` - incoming GET/HEAD request and pinned jsDelivr source URL.
 * Side effects: Performs one server-side network request to the pinned upstream asset.
 * Returns: Promise resolving to a same-origin JavaScript response or an explicit upstream failure response.
 */
async function motionRuntimeResponse(request, upstreamUrl) {
  if (request.method !== 'GET' && request.method !== 'HEAD') return runtimeMethodNotAllowed();

  let upstream;
  try {
    upstream = await fetch(upstreamUrl, {
      headers: {
        accept: 'application/javascript,text/javascript,*/*;q=0.1',
      },
    });
  } catch {
    return new Response('Motion runtime upstream unavailable.', {
      status: 502,
      headers: {
        'cache-control': 'no-store',
        'content-type': 'text/plain; charset=utf-8',
        'x-content-type-options': 'nosniff',
      },
    });
  }

  if (!upstream.ok) {
    return new Response('Motion runtime upstream unavailable.', {
      status: 502,
      headers: {
        'cache-control': 'no-store',
        'content-type': 'text/plain; charset=utf-8',
        'x-content-type-options': 'nosniff',
      },
    });
  }

  const headers = new Headers(upstream.headers);
  headers.set('cache-control', 'public, max-age=31536000, immutable');
  headers.set('content-type', 'application/javascript; charset=utf-8');
  headers.set('x-content-type-options', 'nosniff');
  headers.delete('set-cookie');

  return new Response(request.method === 'HEAD' ? null : upstream.body, {
    status: 200,
    headers,
  });
}

export default {
  /**
   * Function contract: fetch
   * Purpose: Route each incoming request to canonical redirect, motion runtime, first-party API, or static asset handling.
   * Inputs: `request`, `env` - incoming Request and Worker environment bindings.
   * Side effects: May perform network I/O, write analytics logs, or read the ASSETS binding.
   * Returns: Promise resolving to the routed HTTP response.
   */
  async fetch(request, env) {
    const url = new URL(request.url);

    const redirect = legacyRedirect(request, url);
    if (redirect) return redirect;

    const motionRuntimeUrl = MOTION_RUNTIME_ASSETS.get(url.pathname);
    if (motionRuntimeUrl) return motionRuntimeResponse(request, motionRuntimeUrl);

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
