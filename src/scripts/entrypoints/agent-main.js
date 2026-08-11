/**
 * @fileoverview src/scripts/entrypoints/agent-main.js
 * Purpose: Bootstraps the agent-redesign browser runtime and conditionally loads contact and portfolio enhancement modules.
 * Responsibilities:
 * - Own the behavior/content implied by this file's single responsibility.
 * - Keep public routes, build contracts, and imported module boundaries stable unless the connected owners are updated together.
 * Execution context: Browser ES module loaded by the portfolio runtime.
 * Connected files:
 * - docs/repository/file-catalog.md
 * - scripts/agent-redesign.cjs
 * - scripts/repository/apply-deep-organization.cjs
 * - src/runtime/script.js
 * Maintenance: Update this header when responsibility or dependencies change; generated/vendor files are documented at their source instead.
 */
import { onReady } from '../shared/dom.js';
import { initMobileMenu } from '../features/navigation/mobile-menu.js';
import { initTheme } from '../features/navigation/theme.js';
import { initResumeDownload } from '../features/navigation/resume.js';
import { initAnalyticsEvents } from '../features/analytics/analytics-events.js';

onReady(/** Callback contract: Processes the callback step for on ready without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: may read or update browser DOM/state; may emit diagnostics or inspect process state. No explicit return contract. */ async () => {
  initMobileMenu();
  initTheme();
  initResumeDownload();
  initAnalyticsEvents();

  const currentPath = window.location.pathname.replace(/\.html$/, '').replace(/\/$/, '') || '/';
  if (currentPath === '/contact') {
    try {
      const { initContactForm } = await import('../features/forms/contact-form.js');
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
    await import('../features/portfolio/agent-portfolio.js');
    await import('../features/motion/signal-portrait.js');
    await import('../features/system/agent-browser-contract.js');
  } catch (error) {
    console.error('[portfolio] redesign runtime failed to initialize', error);
  }
});
