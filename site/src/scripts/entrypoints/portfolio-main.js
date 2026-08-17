/**
 * @fileoverview src/scripts/entrypoints/portfolio-main.js
 * Purpose: Bootstrap the redesigned portfolio runtime and route-scoped enhancements used by the production portfolio shell.
 * Responsibilities:
 * - Initialize shared navigation, theme, resume, analytics, and refined interaction-motion behavior after DOM readiness.
 * - Load contact-form behavior only on the contact route.
 * - Load portfolio-specific visual/runtime modules without allowing one optional module failure to prevent unrelated features from initializing.
 * Execution context: Browser ES module written into the production `/script.js` entry by the portfolio redesign build stage.
 * Connected files:
 * - scripts/portfolio-redesign.cjs
 * - src/scripts/shared/dom.js
 * - src/scripts/features/forms/contact-form.js
 * - src/scripts/features/motion/refined-button-motion.js
 * - src/scripts/features/motion/hero-system-field.js
 * - src/scripts/features/portfolio/portfolio-runtime.js
 * - src/scripts/features/system/browser-contract.js
 * Maintenance: Keep this entrypoint focused on initialization and route gating. Feature implementation belongs in the feature module that owns the behavior.
 */
import { onReady } from '../shared/dom.js';
import { initMobileMenu } from '../features/navigation/mobile-menu.js';
import { initTheme } from '../features/navigation/theme.js';
import { initResumeDownload } from '../features/navigation/resume.js';
import { initAnalyticsEvents } from '../features/analytics/analytics-events.js';
import { initRefinedButtonMotion } from '../features/motion/refined-button-motion.js';

onReady(
  /** Callback contract: Initialize shared portfolio behavior and then load route-specific enhancements after the DOM is ready. Inputs: None. Side effects: Initializes browser features, may dynamically import route modules, updates DOM state, and reports module failures to the console. Returns: Promise that resolves after requested modules have loaded or been handled. */
  async () => {
    initMobileMenu();
    initTheme();
    initResumeDownload();
    initAnalyticsEvents();
    initRefinedButtonMotion();

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
      await import('../features/portfolio/portfolio-runtime.js');
      await import('../features/motion/hero-system-field.js');
      await import('../features/system/browser-contract.js');
    } catch (error) {
      console.error('[portfolio] redesign runtime failed to initialize', error);
    }
  },
);
