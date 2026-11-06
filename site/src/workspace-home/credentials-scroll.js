/**
 * @fileoverview Scroll-linked credentials gallery.
 * Purpose: Reveal readable credential cards while their section stays in view.
 * Responsibilities: Map vertical progress to native horizontal scrolling; preserve focused links and native controls.
 * Execution context: Homepage browser module, after credentials are rendered.
 * Connected files: index.html, scripts/install-workspace-home.cjs.
 * Maintenance: Use the existing sticky layout; never intercept wheel, touch or keyboard input.
 */
/**
 * Function contract: initCredentialScroll
 * Purpose: Connect the credential track to its section's existing sticky scroll interval.
 * Inputs: section, content, track and spacer elements; browser viewport and motion preference.
 * Side effects: Updates local scroll position/spacer and registers passive lifecycle listeners.
 * Returns: Cleanup function for the controller.
 */
export function initCredentialScroll(section, content, track, spacer) {
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let enabled = false, frame = 0, distance = 0, lastY = null;
  /** Function contract: render
   * Purpose: Reveal the next cards as vertical section progress increases.
   * Inputs: Current section rectangle and viewport position.
   * Side effects: Sets track.scrollLeft; never moves a focused credential link.
   * Returns: Undefined.
   */
  function render() {
    frame = 0;
    if (!enabled || scrollY === lastY) return;
    lastY = scrollY;
    if (track.contains(document.activeElement) || track.classList.contains('drag')) return;
    const top = Math.min(0, innerHeight - content.offsetHeight);
    const progress = Math.max(0, Math.min(1, (top - section.getBoundingClientRect().top) / distance));
    track.scrollLeft = progress * Math.max(0, track.scrollWidth - track.clientWidth);
  }
  /** Function contract: schedule
   * Purpose: Coalesce native scroll events into one paint update.
   * Inputs: Browser event notification.
   * Side effects: Queues at most one animation frame.
   * Returns: Undefined.
   */
  function schedule() { if (!frame) frame = requestAnimationFrame(render); }
  /** Function contract: measure
   * Purpose: Size the sticky interval from actual horizontal overflow and available viewport height.
   * Inputs: Current element dimensions and motion preference.
   * Side effects: Updates section mode, spacer height and current progress.
   * Returns: Undefined.
   */
  function measure() {
    const overflow = Math.max(0, track.scrollWidth - track.clientWidth);
    enabled = !motion.matches && innerWidth >= 768 && content.offsetHeight <= innerHeight + 2 && overflow > 0;
    distance = Math.max(innerHeight * .75, overflow * .8);
    section.classList.toggle('credential-scroll', enabled);
    spacer.style.height = enabled ? `${distance}px` : '0px';
    lastY = null;
    schedule();
  }
  const observer = new ResizeObserver(measure);
  observer.observe(content); observer.observe(track);
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', measure, { passive: true });
  motion.addEventListener('change', measure);
  measure();
  /** Function contract: cleanup
   * Purpose: Release listeners when the gallery is removed.
   * Inputs: None.
   * Side effects: Disconnects observer, cancels pending paint and restores native layout.
   * Returns: Undefined.
   */
  return function cleanup() {
    observer.disconnect(); cancelAnimationFrame(frame);
    removeEventListener('scroll', schedule); removeEventListener('resize', measure);
    motion.removeEventListener('change', measure);
    section.classList.remove('credential-scroll'); spacer.style.height = '';
  };
}
