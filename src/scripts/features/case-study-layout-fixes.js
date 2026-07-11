function normalizeText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim().toLowerCase();
}

function markSection(section) {
  const heading = section.querySelector(':scope > h2, :scope > .section-title, :scope > .section-header h2');
  const label = section.querySelector(':scope > .case-label, :scope > .eyebrow, :scope > .section-header .eyebrow');
  const headingText = normalizeText(heading?.textContent);
  const labelText = normalizeText(label?.textContent);

  if (headingText === 'my role' || headingText.startsWith('my role ')) {
    section.classList.add('nrs-case-role-section');
  }

  if (labelText.includes('design decisions') || headingText.includes('how i approached the work')) {
    section.classList.add('nrs-case-decisions-section');
  }
}

export function improveCaseStudySections() {
  const path = (window.location.pathname || '/').replace(/\/+$/, '').replace(/\.html$/, '');
  if (!/^\/project-[^/]+$/.test(path)) return;

  document.querySelectorAll('main section').forEach(markSection);
}
