/**
 * @fileoverview src/scripts/entrypoints/agent-main.js
 * Purpose: Bootstrap agent-era enhancement modules while keeping optional contact and portfolio behavior route-scoped.
 * Responsibilities:
 * - Orchestrate feature loading and initialization order without absorbing feature-domain implementation details.
 * - Keep route checks and lazy imports explicit so optional code runs only where it is needed.
 * - Isolate one feature failure from unrelated features while still surfacing diagnostics.
 * Execution context: Browser ES module loaded through the portfolio runtime.
 * Connected files:
 * - src/scripts/shared/dom.js
 * - src/scripts/features/navigation/mobile-menu.js
 * - src/scripts/features/navigation/theme.js
 * - src/scripts/features/navigation/resume.js
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
import { onReady } from '../shared/dom.js';
import { initMobileMenu } from '../features/navigation/mobile-menu.js';
import { initTheme } from '../features/navigation/theme.js';
import { initResumeDownload } from '../features/navigation/resume.js';
import { initAnalyticsEvents } from '../features/analytics/analytics-events.js';

onReady( /** Callback contract: Lazy-load the contact form module. Inputs: None; derives required state from its enclosing module/runtime context. Side effects: dynamically imports code; reads or updates DOM/browser state; emits diagnostics or changes process failure state Returns: Promise resolving after the documented asynchronous side effects complete. */ async () => {
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
