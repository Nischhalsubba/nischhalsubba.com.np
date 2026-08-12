(() => {
  const endpoint = '/api/analytics';
  const once = new Set();
  const localPreview = ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname);

  function send(event, details = {}) {
    if (localPreview) return;
    const payload = {
      event,
      path: window.location.pathname,
      context: String(details.context || '').slice(0, 80),
      metric: String(details.metric || '').slice(0, 40),
      value: Number.isFinite(details.value) ? details.value : 1,
    };
    const body = JSON.stringify(payload);
    try {
      if (navigator.sendBeacon) {
        const blob = new Blob([body], { type: 'application/json' });
        if (navigator.sendBeacon(endpoint, blob)) return;
      }
      fetch(endpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body,
        keepalive: true,
        credentials: 'same-origin',
      }).catch(() => {});
    } catch (_) {}
  }

  function sendOnce(key, event, details) {
    if (once.has(key)) return;
    once.add(key);
    send(event, details);
  }

  if (/^\/project-[^/]+$/.test(window.location.pathname)) {
    sendOnce('project-view', 'project_view', { context: window.location.pathname.replace('/project-', '') });
  }

  document.addEventListener('click', (event) => {
    const link = event.target.closest?.('a[href]');
    if (!link) return;
    if (link.matches('[data-resume-download], a[href*="resume.pdf"]')) {
      send('resume_download', { context: window.location.pathname });
    }
    try {
      const url = new URL(link.href, window.location.href);
      const profiles = ['linkedin.com', 'behance.net', 'github.com', 'uxcel.com', 'app.uxcel.com'];
      if (profiles.some((host) => url.hostname === host || url.hostname.endsWith(`.${host}`))) {
        send('external_profile_click', { context: url.hostname });
      }
    } catch (_) {}
  }, { capture: true, passive: true });

  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('focusin', () => sendOnce('contact-start', 'contact_start'));
    form.addEventListener('submit', () => send('contact_submit'));
    const status = document.getElementById('contact-form-status');
    if (status) {
      new MutationObserver(() => {
        const text = status.textContent || '';
        if (/sent successfully|thanks|on its way/i.test(text)) sendOnce('contact-success', 'contact_success');
      }).observe(status, { childList: true, characterData: true, subtree: true });
    }
  }

  let lcp = 0;
  let cls = 0;
  let interaction = 0;
  try {
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const latest = entries[entries.length - 1];
      if (latest) lcp = latest.startTime;
    }).observe({ type: 'largest-contentful-paint', buffered: true });
  } catch (_) {}
  try {
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) if (!entry.hadRecentInput) cls += entry.value || 0;
    }).observe({ type: 'layout-shift', buffered: true });
  } catch (_) {}
  try {
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) interaction = Math.max(interaction, entry.duration || 0);
    }).observe({ type: 'event', buffered: true, durationThreshold: 40 });
  } catch (_) {}

  function flushVitals() {
    if (document.visibilityState !== 'visible') return;
    sendOnce('perf-lcp', 'performance_metric', { metric: 'lcp_ms', value: Math.round(lcp) });
    sendOnce('perf-cls', 'performance_metric', { metric: 'cls_x1000', value: Math.round(cls * 1000) });
    if (interaction) sendOnce('perf-interaction', 'performance_metric', { metric: 'max_interaction_ms', value: Math.round(interaction) });
  }

  // Do not emit analytics during pagehide/visibility teardown. Those requests are
  // routinely aborted by browsers while navigating and create false production errors.
  // Local previews skip telemetry entirely so browser audits do not hit a production-only API route.
  window.setTimeout(flushVitals, 10000);
})();
