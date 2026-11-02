/**
 * @fileoverview Workspace navigation, reading motion and retained contact runtime.
 * Purpose: Bring homepage interactions to content pages without loading retired shell mutations.
 * Responsibilities: Accessible mobile navigation, progress, local clock and secure contact behavior.
 * Execution context: Browser ES module, on every workspace inner route.
 * Connected files: inner.css, install-workspace-inner.cjs, features/forms/contact-form.js.
 * Maintenance: Keep content readable without JS and honor reduced-motion preferences.
 */
import { Decoder, chSize, initFooter } from './homepage-primitives.js';
const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
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
  const progress = distance > 0 ? scrollY / distance : 0;
  document.querySelector('.workspace-progress').style.transform = `scaleX(${progress})`;
  nav.style.setProperty('--p', progress.toFixed(4));
  const ring = document.querySelector('#ring'); if (ring) ring.style.strokeDashoffset = 282.7 * (1 - progress);
  const percent = document.querySelector('#ftPc');
  if (percent) percent.textContent = Math.round(progress * 100);
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

if (document.querySelector('#contact-form')) {
  const { initContactForm } = await import('/src/scripts/features/forms/contact-form.js');
  initContactForm();
}

/** Function contract: sizeWorkspace
 * Purpose: Use the homepage display scale, frame geometry and active tool position verbatim.
 * Inputs: none. Side effects: root scale and SVG paths. Returns: void.
 */
function sizeWorkspace() {
  document.documentElement.style.setProperty('--zk', Math.min(1.8, Math.max(1, Math.min(innerWidth / 1440, innerHeight / 900))).toFixed(4));
  document.querySelectorAll('#pill,.chbtn').forEach(/** Callback contract: Size each homepage frame. Inputs: element. Side effects: SVG paths. Returns: void. */ element => { element._fr = element.querySelector('svg.fr'); chSize(element); });
  const current = document.querySelector('#tbTools a[aria-current="page"]');
  document.querySelectorAll('.tb-t').forEach(link => link.classList.toggle('act', link === current));
  const active = document.querySelector('#tbAct');
  if (active) { active.style.opacity = current ? '1' : '0'; if (current) active.style.setProperty('--ax', current.offsetLeft + 'px'); }
}
const arrow = '<svg class="ar" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18.5 12L4.99997 12" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M13 18C13 18 19 13.5811 19 12C19 10.4188 13 6 13 6" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>';
/** Function contract: plateButton
 * Purpose: Construct the exact homepage chamfered button markup without changing behavior or destination.
 * Inputs: anchor or button. Side effects: child DOM and classes. Returns: void.
 */
function plateButton(element) {
  if (element.querySelector('svg.fr')) return;
  const label = element.textContent.trim().replace(/\s*↗$/, '');
  const small = element.classList.contains('sm'); const navButton = element.classList.contains('isl-ct');
  element.className = 'chbtn' + (small ? ' sm' : '') + (navButton ? ' isl-ct' : '');
  const frame = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  frame.setAttribute('class', 'fr'); frame.setAttribute('aria-hidden', 'true'); frame.setAttribute('preserveAspectRatio', 'none');
  frame.innerHTML = '<path class="body"/><path class="flood"/><path class="ringp"/><path class="brk"/>';
  const text = document.createElement('span'); text.className = 'lb'; text.textContent = label;
  element.replaceChildren(frame, text); element.insertAdjacentHTML('beforeend', arrow);
  element._fr = frame; chSize(element);
}
document.querySelectorAll('.agent-btn,.workspace-button,.agent-service-link,.bracket-link,.btn').forEach(plateButton);
const submit = document.querySelector('#contact-form button[type="submit"]');
if (submit) new MutationObserver(() => { plateButton(submit); }).observe(submit, { childList: true });
const frameObserver = new ResizeObserver(() => sizeWorkspace());
frameObserver.observe(nav);
addEventListener('resize', sizeWorkspace); sizeWorkspace();
document.fonts?.ready.then(sizeWorkspace);

/** Function contract: decodeHeading
 * Purpose: Animate visible heading glyphs through the homepage Decoder while retaining semantic source text.
 * Inputs: heading Element. Side effects: accessible and visual heading children, animation frames. Returns: void.
 */
function decodeHeading(heading) {
  const text = heading.textContent.trim();
  const source = document.createElement('span'); source.className = 'workspace-heading-source'; source.textContent = text;
  const visual = document.createElement('span'); visual.className = 'workspace-heading-visual'; visual.setAttribute('aria-hidden', 'true');
  visual.dataset.decode = JSON.stringify([[text, 'bright']]);
  heading.replaceChildren(source, visual);
  const decoder = new Decoder(visual);
  /** Function contract: playHeading
   * Purpose: Start one finite homepage glyph animation, immediately settled for reduced motion.
   * Inputs: none. Side effects: visual glyph text and animation frames. Returns: void.
   */
  const playHeading = () => {
    decoder.play();
    if (reduce) return;
    const start = performance.now(); const speed = Math.max(1, text.length / 30);
    /** Function contract: tickHeading
     * Purpose: Advance the extracted decoder until all real text is restored.
     * Inputs: frame timestamp. Side effects: decoder DOM. Returns: void.
     */
    const tickHeading = now => { decoder.tick(start + (now - start) * speed); if (!decoder.finished) requestAnimationFrame(tickHeading); };
    requestAnimationFrame(tickHeading);
  };
  if (reduce) { decoder.render(1e9); return; }
  const observer = new IntersectionObserver(entries => { if (entries.some(entry => entry.isIntersecting)) { playHeading(); observer.disconnect(); } }, { threshold: .2 });
  observer.observe(heading);
  visual.addEventListener('mouseenter', playHeading);
}
document.querySelectorAll('[data-workspace-decode]').forEach(decodeHeading);
if (!reduce) {
  const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('workspace-in'); revealObserver.unobserve(entry.target); } }), { threshold: .1 });
  document.querySelectorAll('.agent-decision,.agent-service,.nrs-writing-featured-item,.nrs-article-v4-section').forEach(/** Callback contract: Register a visible content reveal. Inputs: element. Side effects: classes and observer. Returns: void. */ element => { element.classList.add('workspace-reveal-ready'); revealObserver.observe(element); });
}
const footerCards = document.querySelectorAll('.ft-c');
document.querySelector('#ftx')?.addEventListener('pointermove', event => footerCards.forEach(/** Callback contract: Move the homepage card spotlight. Inputs: card. Side effects: pointer CSS variables. Returns: void. */ card => { const bounds = card.getBoundingClientRect(); const scale = Number(getComputedStyle(document.documentElement).getPropertyValue('--zk')) || 1; card.style.setProperty('--mx', (event.clientX - bounds.left) / scale + 'px'); card.style.setProperty('--my', (event.clientY - bounds.top) / scale + 'px'); }));
const keys = {v:'top',a:'about',e:'exp',w:'work',s:'services',p:'process',t:'testi',r:'pricing',c:'contact'};
addEventListener('keydown', /** Callback contract: Route homepage keyboard tools while respecting text entry. Inputs: keyboard event. Side effects: link activation. Returns: void. */ event => { if (event.ctrlKey || event.metaKey || event.altKey || /input|textarea|select/i.test(document.activeElement.tagName) || document.activeElement.isContentEditable) return; const section = keys[event.key.toLowerCase()]; if (section) { const link = document.querySelector(`#pill a[data-sec="${section}"]`) || document.querySelector('#pill .isl-ct'); link?.click(); } });
const preview = document.querySelector('#mediaPreview');
document.querySelectorAll('.agent-case-cover,.nrs-case-v4-gallery figure').forEach(/** Callback contract: Add an accessible full-size project preview. Inputs: figure. Side effects: button and dialog wiring. Returns: void. */ figure => {
  const image = figure.querySelector('img'); if (!image) return;
  figure.dataset.frameLabel = '❖ ' + (document.querySelector('h1 .workspace-heading-source')?.textContent || 'Project preview');
  const button = document.createElement('button'); button.type = 'button'; button.className = 'workspace-zoom'; button.textContent = 'Open image ↗'; button.setAttribute('aria-label', 'Open preview: ' + image.alt);
  button.addEventListener('click', /** Callback contract: Open the selected original image. Inputs: none. Side effects: dialog image and open state. Returns: void. */ () => { const target = preview.querySelector('img'); target.src = image.currentSrc || image.src; target.alt = image.alt; preview.showModal(); });
  figure.appendChild(button);
});
document.querySelector('#closeMedia')?.addEventListener('click', () => preview.close());
if (!reduce && window.Lenis) {
/** Function contract: easing
 * Purpose: Match the homepage scroll curve.
 * Inputs: value. Side effects: none. Returns: eased progress.
 */
  const easing = value => Math.min(1, 1.001 - Math.pow(2, -10 * value));
  const lenis = new window.Lenis({ duration: 1.15, easing });
  /** Function contract: smoothTick
   * Purpose: Advance the same Lenis scrolling configuration used on the homepage.
   * Inputs: animation timestamp. Side effects: scroll interpolation. Returns: void.
   */
  const smoothTick = now => { lenis.raf(now); requestAnimationFrame(smoothTick); };
  requestAnimationFrame(smoothTick);
  preview.addEventListener('close', () => lenis.start());
  document.querySelectorAll('.workspace-zoom').forEach(button => button.addEventListener('click', () => lenis.stop()));
}

initFooter();
/** Function contract: updateFooterDay
 * Purpose: Match the homepage Nepal-time sun track and awake status.
 * Inputs: none. Side effects: footer day marker and status text. Returns: void.
 */
function updateFooterDay() {
  const now = new Date(Date.now() + 5.75 * 3600e3); const hour = now.getUTCHours() + now.getUTCMinutes() / 60;
  document.querySelector('#ftDay')?.style.setProperty('--t', (hour / 24 * 100).toFixed(2) + '%');
  const awake = document.querySelector('#ftAw'); if (awake) awake.textContent = hour >= 8 && hour < 23.5 ? 'Awake' : 'Probably asleep';
}
updateFooterDay(); setInterval(updateFooterDay, 60000);
