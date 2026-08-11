/**
 * @fileoverview src/scripts/features/analytics/analytics-events.js
 * Purpose: Attach consistent analytics events to important portfolio interactions.
 * Responsibilities:
 * - Translate important links and calls to action into stable event names.
 * - Forward interaction details to the analytics providers already present on the page.
 * - Avoid registering duplicate listeners when initialization runs more than once.
 * Execution context: Browser ES module initialized by the main portfolio runtime.
 * Connected files:
 * - src/scripts/entrypoints/main.js
 * - src/runtime/script.js
 * Maintenance: Keep event names stable once they are used in reporting. Add tracking only for interactions that answer a real product or portfolio question.
 */
const TRACKING_ATTR = 'data-nrs-tracked';

/**
 * Function contract: normalizePath
 * Purpose: Convert a link into the clean pathname used by route-based analytics rules.
 * Inputs: `href` - link value from the DOM.
 * Side effects: Reads the current browser origin when resolving relative URLs.
 * Returns: Normalized pathname, or the original value when URL parsing fails.
 */
function normalizePath(href) {
  try {
    return new URL(href, window.location.origin).pathname.replace(/\.html$/, '') || '/';
  } catch {
    return href;
  }
}

/**
 * Function contract: eventNameForLink
 * Purpose: Choose the analytics event name that best describes a tracked link.
 * Inputs: `link` - anchor element being evaluated.
 * Side effects: Reads attributes from the supplied DOM element.
 * Returns: Stable event name, or an empty string when the link does not need explicit tracking.
 */
function eventNameForLink(link) {
  const href = link.getAttribute('href') || '';
  const path = normalizePath(href);

  if (href.includes('/assets/resume.pdf')) return 'resume_download_click';
  if (href.startsWith('mailto:')) return 'email_click';
  if (path === '/contact') return 'contact_cta_click';
  if (path.startsWith('/project-')) return 'project_case_study_click';
  if (path === '/projects') return 'portfolio_click';
  if (href.includes('figma.com')) return 'prototype_open_click';
  if (href.includes('behance.net') || href.includes('uxcel.com') || href.includes('linkedin.com') || href.includes('github.com')) return 'external_proof_click';
  return '';
}

/**
 * Function contract: emitEvent
 * Purpose: Send one normalized interaction to each analytics integration available on the page.
 * Inputs: `name` - event name; `detail` - event properties such as href, label, and page path.
 * Side effects: Dispatches a browser event and may call configured analytics providers.
 * Returns: Nothing.
 */
function emitEvent(name, detail) {
  if (!name) return;

  window.dispatchEvent(new CustomEvent('nrs:analytics', { detail: { name, ...detail } }));

  if (Array.isArray(window.dataLayer)) window.dataLayer.push({ event: name, ...detail });
  if (typeof window.gtag === 'function') window.gtag('event', name, detail);
  if (typeof window.plausible === 'function') window.plausible(name, { props: detail });
}

/**
 * Function contract: initAnalyticsEvents
 * Purpose: Register click tracking for supported links and explicitly named analytics buttons.
 * Inputs: None.
 * Side effects: Reads the document and registers click listeners on matching elements.
 * Returns: Nothing.
 */
export function initAnalyticsEvents() {
  document.querySelectorAll('a[href], button[data-analytics-event]').forEach( /** Callback contract: Configure analytics for one candidate link or button unless it was already initialized. Inputs: `element` Side effects: Reads DOM attributes and may register a click listener. Returns: Nothing. */ (element) => {
    if (element.dataset.nrsTracked === 'true') return;

    const explicitName = element.getAttribute('data-analytics-event');
    const eventName = explicitName || (element.tagName === 'A' ? eventNameForLink(element) : 'button_click');
    if (!eventName) return;

    element.setAttribute(TRACKING_ATTR, 'true');
    element.addEventListener('click',  /** Callback contract: Capture the clicked element's current destination, label, and route for reporting. Inputs: None. Side effects: Emits an analytics event. Returns: Nothing. */ () => {
      emitEvent(eventName, {
        href: element.getAttribute('href') || '',
        label: element.textContent?.trim().replace(/\s+/g, ' ').slice(0, 120) || '',
        page_path: window.location.pathname,
      });
    });
  });
}
