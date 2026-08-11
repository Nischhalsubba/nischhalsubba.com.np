/**
 * @fileoverview src/scripts/features/analytics/analytics-events.js
 * Purpose: Implement analytics events behavior inside the analytics browser-runtime domain.
 * Responsibilities:
 * - Own the analytics behavior represented by this module and keep unrelated domains outside the file.
 * - Read or update only the DOM/runtime state needed for this feature and preserve accessibility semantics.
 * - Expose stable initializer/helper exports consumed by runtime entrypoints or closely related features.
 * Execution context: Browser ES module loaded through the portfolio runtime.
 * Connected files:
 * - README.md
 * - src/runtime/script.js
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
const TRACKING_ATTR = 'data-nrs-tracked';

/**
 * Function contract: normalizePath
 * Purpose: Apply path consistently while preserving the surrounding analytics events browser feature contract.
 * Inputs: `href`: input consumed by this operation
 * Side effects: reads or updates DOM/browser state.
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
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
 * Purpose: Implement the event name for link responsibility owned by the analytics events browser feature.
 * Inputs: `link`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
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
  if (href.includes('/llms.txt') || href.includes('/ai-profile.json') || href.includes('/humans.txt')) return 'ai_discovery_file_click';
  if (href.includes('behance.net') || href.includes('uxcel.com') || href.includes('linkedin.com') || href.includes('github.com')) return 'external_proof_click';
  return '';
}

/**
 * Function contract: emitEvent
 * Purpose: Implement the emit event responsibility owned by the analytics events browser feature.
 * Inputs: `name`: stable identifier or label for the current item; `detail`: input consumed by this operation
 * Side effects: reads or updates DOM/browser state.
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
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
 * Purpose: Initialize analytics events for the analytics events browser feature, including the listeners/state needed for safe runtime use.
 * Inputs: None; derives required state from the enclosing module/runtime context.
 * Side effects: registers or removes browser event listeners; reads or updates DOM/browser state.
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
 */
export function initAnalyticsEvents() {
  document.querySelectorAll('a[href], button[data-analytics-event]').forEach(/** Callback contract: Apply the enclosing side-effect operation to the current collection item. Inputs: `element`. Side effects: registers or removes browser listeners; reads or updates DOM/browser state. Returns: undefined; callback is side-effect-only. */ (element) => {
    if (element.dataset.nrsTracked === 'true') return;

    const explicitName = element.getAttribute('data-analytics-event');
    const eventName = explicitName || (element.tagName === 'A' ? eventNameForLink(element) : 'button_click');
    if (!eventName) return;

    element.setAttribute(TRACKING_ATTR, 'true');
    element.addEventListener('click', /** Callback contract: Handle the click event for `element` and apply the related local state update. Inputs: none. Side effects: reads or updates DOM/browser state. Returns: undefined; callback is side-effect-only. */ () => {
      emitEvent(eventName, {
        href: element.getAttribute('href') || '',
        label: element.textContent?.trim().replace(/\s+/g, ' ').slice(0, 120) || '',
        page_path: window.location.pathname,
      });
    });
  });
}
