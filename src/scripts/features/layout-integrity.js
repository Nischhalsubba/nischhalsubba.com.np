export function applyLayoutIntegrity() {
  if (document.querySelector('link[href^="/layout-integrity.css"]')) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/layout-integrity.css?v=1.0';
  document.head.appendChild(link);
}
