import { onReady } from './utils/dom.js';
import { initMobileMenu } from './features/mobile-menu.js';

/*
 * Behaviour only. Visual styling is owned by /style.css so every route uses
 * the same container, typography, spacing, and component rules.
 */
const globalFeatures = [
  ['theme', () => import('./features/theme.js').then((module) => module.initTheme)],
  ['audit remediations', () => import('./features/audit-remediations.js').then((module) => module.applyAuditRemediations)],
  ['design-system shell', () => import('./features/nav-consistency.js').then((module) => module.enforceDesignSystemShell)],
  ['layout integrity', () => import('./features/layout-integrity.js').then((module) => module.applyLayoutIntegrity)],
  ['active navigation', () => import('./features/navigation.js').then((module) => module.init