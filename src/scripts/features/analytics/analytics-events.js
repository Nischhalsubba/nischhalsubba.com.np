/**
 * @fileoverview src/scripts/features/analytics/analytics-events.js
 * Purpose: Browser runtime feature in the analytics domain responsible for analytics events behavior.
 * Responsibilities:
 * - Own the behavior/content implied by this file's single responsibility.
 * - Keep public routes, build contracts, and imported module boundaries stable unless the connected owners are updated together.
 * Execution context: Browser ES module loaded by the portfolio runtime.
 * Connected files:
 * - README.md
 * - docs/repository/file-catalog.md
 * - src/scripts/entrypoints/agent-main.js
 * - src/scripts/entrypoints/main.js
 * Maintenance: Update this header when responsibility or dependencies change; generated/vendor files are documented at their source instead.
 */
const TRACKING_ATTR = 'data-nrs-tracked';

/**
 * Function contract: normalizePath
 * Purpose: Applies normalize path while preserving the surrounding repository/runtime contract.
 * Inputs: href.
 * Side effects: may read or update browser DOM/state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
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
 * Purpose: Implements the event name for link responsibility for this module.
 * Inputs: link.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
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
 * Purpose: Implements the emit event responsibility for this module.
 * Inputs: name, detail.
 * Side effects: may read or update browser DOM/state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
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
 * Purpose: Implements the init analytics events responsibility for this module.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may read or update browser DOM/state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
export function initAnalyticsEvents() {
  document.querySelectorAll('a[href], button[data-analytics-event]').forEach(/** Callback contract: Processes the callback step for document.query selector all('a[href], button[data analytics event]') without leaking orchestration details to the caller. Inputs: element. Side effects: may read or update browser DOM/state. Returns a value to the invoking API. */ (element) => {
    if (element.dataset.nrsTracked === 'true') return;

    const explicitName = element.getAttribute('data-analytics-event');
    const eventName = explicitName || (element.tagName === 'A' ? eventNameForLink(element) : 'button_click');
    if (!eventName) return;

    element.setAttribute(TRACKING_ATTR, 'true');
    element.addEventListener('click', /** Callback contract: Processes the callback step for element without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: may read or update browser DOM/state. No explicit return contract. */ () => {
      emitEvent(eventName, {
        href: element.getAttribute('href') || '',
        label: element.textContent?.trim().replace(/\s+/g, ' ').slice(0, 120) || '',
        page_path: window.location.pathname,
      });
    });
  });
}
