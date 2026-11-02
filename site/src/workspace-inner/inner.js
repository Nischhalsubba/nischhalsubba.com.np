/**
 * @fileoverview Workspace navigation, reading motion and retained contact runtime.
 * Purpose: Bring homepage interactions to content pages without loading retired shell mutations.
 * Responsibilities: Accessible mobile navigation, progress, local clock and secure contact behavior.
 * Execution context: Browser ES module, on every workspace inner route.
 * Connected files: inner.css, install-workspace-inner.cjs, features/forms/contact-form.js.
 * Maintenance: Keep content readable without JS and honor reduced-motion preferences.
 */
const nav = document.querySelector('#pill');
const toggle = document.querySelector('#tbMb');
const menu = document.querySelector('#tbMp');
const main = document.querySelector('main');
/** Function contract: setMenu
 * Purpose: Synchronize mobile navigation visibility, focus and background availability.
 * Inputs: open boolean and restoreFocus boolean. Side effects: DOM attributes and focus. Returns: void.
 */
function setMenu(open, restoreFocus = false) {
  nav.classList.toggle('mopen', open);
  toggle?.setAttribute('aria-expanded', String(open));
  menu?.setAttribute('aria-hidden', String(!open));
  if (menu) menu.inert = !open;
  main.inert = open;
  if (open) menu?.querySelector('a')?.focus();
  else if (restoreFocus) toggle?.focus();
}
if (toggle && menu) {
  setMenu(false);
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  menu.addEventListener('click', event => { if (event.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', /** Callback contract: Close on Escape and trap Tab within expanded mobile navigation. Inputs: keyboard event. Side effects: focus and navigation state. Returns: void. */ event => {
    if (toggle.getAttribute('aria-expanded') !== 'true') return;
    if (event.key === 'Escape') { event.preventDefault(); setMenu(false, true); }
    if (event.key === 'Tab') {
      const links = [...menu.querySelectorAll('a[href]')];
      const first = links[0]; const last = links.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); toggle.focus(); }
      else if (event.shiftKey && document.activeElement === toggle) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); toggle.focus(); }
    }
  });
  matchMedia('(min-width:641px)').addEventListener('change', () => setMenu(false));
}
/** Function contract: updateProgress
 * Purpose: Update reading progress without animating content outside the user's scroll position.
 * Inputs: none. Side effects: inline progress transform. Returns: void.
 */
function updateProgress() {
  const distance = document.documentElement.scrollHeight - innerHeight;
  document.querySelector('.workspace-progress').style.transform = `scaleX(${distance > 0 ? scrollY / distance : 0})`;
}
addEventListener('scroll', updateProgress, { passive: true });
updateProgress();
/** Function contract: updateClock
 * Purpose: Render the shared homepage footer clock in Nepal time.
 * Inputs: none. Side effects: clock and awake/asleep text. Returns: void.
 */
function updateClock() {
  const now = new Date();
  const clock = document.querySelector('#clock');
  if (clock) clock.textContent = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kathmandu', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(now);
}
updateClock();
setInterval(updateClock, 1000);
if (!matchMedia('(prefers-reduced-motion:reduce)').matches) document.querySelector('.agent-page-hero,.agent-case-hero')?.classList.add('workspace-enter');
if (document.querySelector('#contact-form')) {
  const { initContactForm } = await import('/src/scripts/features/forms/contact-form.js');
  initContactForm();
}
