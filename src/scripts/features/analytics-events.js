const TRACKING_ATTR = 'data-nrs-tracked';

function eventNameForLink(link) {
  const href = link.getAttribute('href') || '';
  if (href.includes('/assets/resume.pdf')) return 'resume_download_click';
  if (href.startsWith('mailto:')) return 'email_click';
  if (href.includes('/contact.html')) return 'contact_cta_click';
  if (href.includes('/project-')) return 'project_case_study_click';
  if (href.includes('/projects.html')) return 'portfolio_click';
  if (href.includes('/llms.txt') || href.includes('/ai-profile.json') || href.includes('/humans.txt')) return 'ai_discovery_file_click';
  if (href.includes('behance.net') || href.includes('uxcel.com') || href.includes('linkedin.com') || href.includes('github.com')) return 'external_proof_click';
  return '';
}

function emitEvent(name, detail) {
  if (!name) return;

  window.dispatchEvent(new CustomEvent('nrs:analytics', { detail: { name, ...detail } }));

  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ event: name, ...detail });
  }

  if (typeof window.gtag === 'function') {
    window.gtag('event', name, detail);
  }

  if (typeof window.plausible === 'function') {
    window.plausible(name, { props: detail });
  }
}

export function initAnalyticsEvents() {
  document.querySelectorAll('a[href], button[data-analytics-event]').forEach((element) => {
    if (element.dataset.nrsTracked === 'true') return;

    const explicitName = element.getAttribute('data-analytics-event');
    const eventName = explicitName || (element.tagName === 'A' ? eventNameForLink(element) : 'button_click');
    if (!eventName) return;

    element.setAttribute(TRACKING_ATTR, 'true');
    element.addEventListener('click', () => {
      emitEvent(eventName, {
        href: element.getAttribute('href') || '',
        label: element.textContent?.trim().replace(/\s+/g, ' ').slice(0, 120) || '',
        page_path: window.location.pathname,
      });
    });
  });
}
