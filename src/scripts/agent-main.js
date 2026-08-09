import { onReady } from './utils/dom.js';
import { initMobileMenu } from './features/mobile-menu.js';
import { initTheme } from './features/theme.js';
import { initResumeDownload } from './features/resume.js';
import { initAnalyticsEvents } from './features/analytics-events.js';

onReady(async () => {
  initMobileMenu();
  initTheme();
  initResumeDownload();
  initAnalyticsEvents();

  const currentPath = window.location.pathname.replace(/\.html$/, '').replace(/\/$/, '') || '/';
  if (currentPath === '/contact') {
    try {
      const { initContactForm } = await import('./features/contact-form.js');
      initContactForm();
      const status = document.querySelector('#contact-form-status');
      if (status?.textContent.includes('anti-spam service is not configured')) {
        status.textContent = '';
        status.removeAttribute('data-tone');
      }
    } catch (error) {
      console.error('[portfolio] contact form failed to initialize', error);
    }
  }

  try {
    await import('./features/agent-portfolio.js');
    await import('./features/signal-portrait.js');
    await import('./features/agent-browser-contract.js');
  } catch (error) {
    console.error('[portfolio] redesign runtime failed to initialize', error);
  }
});
