/**
 * @fileoverview src/scripts/features/motion/grid-canvas.js
 * Purpose: Implement grid canvas behavior inside the motion browser-runtime domain.
 * Responsibilities:
 * - Own the motion behavior represented by this module and keep unrelated domains outside the file.
 * - Read or update only the DOM/runtime state needed for this feature and preserve accessibility semantics.
 * - Expose stable initializer/helper exports consumed by runtime entrypoints or closely related features.
 * Execution context: Browser ES module loaded through the portfolio runtime.
 * Connected files:
 * - src/scripts/shared/dom.js
 * - src/runtime/script.js
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
import { $, isTouchDevice, prefersReducedMotion } from '../../shared/dom.js';

/**
 * Function contract: initGridCanvas
 * Purpose: Initialize grid canvas for the grid canvas browser feature, including the listeners/state needed for safe runtime use.
 * Inputs: None; derives required state from the enclosing module/runtime context.
 * Side effects: registers or removes browser event listeners; reads or updates DOM/browser state.
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
 */
export function initGridCanvas() {
  const canvas = $('#grid-canvas');
  if (!canvas || prefersReducedMotion() || isTouchDevice() || window.innerWidth < 900) return;

  const context = canvas.getContext('2d');
  if (!context) return;

  let width = 0;
  let height = 0;
  let animationFrame = 0;
  let running = false;
  let mouse = { x: -1000, y: -1000 };

  /**
   * Function contract: isLightTheme
   * Purpose: Determine whether light theme satisfies the condition represented by this grid canvas browser feature.
   * Inputs: None; derives required state from the enclosing module/runtime context.
   * Side effects: reads or updates DOM/browser state.
   * Returns: Boolean indicating whether light theme satisfies the documented condition.
   */
  function isLightTheme() {
    return document.documentElement.getAttribute('data-theme') === 'light';
  }

  /**
   * Function contract: shouldRun
   * Purpose: Determine whether run satisfies the condition represented by this grid canvas browser feature.
   * Inputs: None; derives required state from the enclosing module/runtime context.
   * Side effects: reads or updates DOM/browser state.
   * Returns: Boolean indicating whether run satisfies the documented condition.
   */
  function shouldRun() {
    return !document.hidden && window.innerWidth >= 900;
  }

  /**
   * Function contract: resize
   * Purpose: Implement the resize responsibility owned by the grid canvas browser feature.
   * Inputs: None; derives required state from the enclosing module/runtime context.
   * Side effects: reads or updates DOM/browser state.
   * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
   */
  function resize() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  /**
   * Function contract: renderFrame
   * Purpose: Implements the render frame responsibility for this module.
   * Inputs: none; the function derives state from its enclosing module/runtime context.
   * Side effects: may read or update browser DOM/state.
   * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
   */
  /**
   * Function contract: renderFrame
   * Purpose: Implement the render frame responsibility owned by the grid canvas browser feature.
   * Inputs: None; derives required state from the enclosing module/runtime context.
   * Side effects: reads or updates DOM/browser state.
   * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
   */
  function renderFrame() {
    if (!running || !shouldRun()) {
      stop();
      return;
    }

    context.clearRect(0, 0, width, height);
    canvas.style.opacity = '1';

    const light = isLightTheme();
    const grid = 60;
    context.strokeStyle = light ? 'rgba(17,19,18,.055)' : 'rgba(255,255,255,.045)';
    context.lineWidth = 1;
    context.beginPath();

    for (let x = 0; x <= width; x += grid) {
      context.moveTo(x, 0);
      context.lineTo(x, height);
    }

    for (let y = 0; y <= height; y += grid) {
      context.moveTo(0, y);
      context.lineTo(width, y);
    }

    context.stroke();

    const gradient = context.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 320);
    gradient.addColorStop(0, light ? 'rgba(17,19,18,.13)' : 'rgba(244,245,242,.18)');
    gradient.addColorStop(1, light ? 'rgba(17,19,18,0)' : 'rgba(244,245,242,0)');

    context.strokeStyle = gradient;
    context.beginPath();

    for (let x = 0; x <= width; x += grid) {
      context.moveTo(x, Math.max(0, mouse.y - 320));
      context.lineTo(x, Math.min(height, mouse.y + 320));
    }

    for (let y = 0; y <= height; y += grid) {
      context.moveTo(Math.max(0, mouse.x - 320), y);
      context.lineTo(Math.min(width, mouse.x + 320), y);
    }

    context.stroke();
    animationFrame = window.requestAnimationFrame(renderFrame);
  }

  /**
   * Function contract: start
   * Purpose: Implements the start responsibility for this module.
   * Inputs: none; the function derives state from its enclosing module/runtime context.
   * Side effects: may read or update browser DOM/state.
   * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
   */
  /**
   * Function contract: start
   * Purpose: Implement the start responsibility owned by the grid canvas browser feature.
   * Inputs: None; derives required state from the enclosing module/runtime context.
   * Side effects: reads or updates DOM/browser state.
   * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
   */
  function start() {
    if (running || !shouldRun()) return;
    running = true;
    animationFrame = window.requestAnimationFrame(renderFrame);
  }

  /**
   * Function contract: stop
   * Purpose: Implements the stop responsibility for this module.
   * Inputs: none; the function derives state from its enclosing module/runtime context.
   * Side effects: may read or update browser DOM/state.
   * Returns: no explicit value unless an invoked dependency throws/rejects.
   */
  /**
   * Function contract: stop
   * Purpose: Implement the stop responsibility owned by the grid canvas browser feature.
   * Inputs: None; derives required state from the enclosing module/runtime context.
   * Side effects: reads or updates DOM/browser state.
   * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
   */
  function stop() {
    running = false;
    if (animationFrame) window.cancelAnimationFrame(animationFrame);
    animationFrame = 0;
    context.clearRect(0, 0, width, height);
    canvas.style.opacity = '0';
  }

  /**
   * Function contract: syncAnimationState
   * Purpose: Implements the sync animation state responsibility for this module.
   * Inputs: none; the function derives state from its enclosing module/runtime context.
   * Side effects: no obvious external side effect beyond invoked dependencies.
   * Returns: no explicit value unless an invoked dependency throws/rejects.
   */
  /**
   * Function contract: syncAnimationState
   * Purpose: Synchronize animation state with the requested state while preserving related grid canvas browser feature invariants.
   * Inputs: None; derives required state from the enclosing module/runtime context.
   * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
   * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
   */
  function syncAnimationState() {
    if (shouldRun()) start();
    else stop();
  }

  resize();
  syncAnimationState();

  window.addEventListener('resize', /** Callback contract: Processes the callback step for window without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Handle the resize event for `window` and apply this module's related state update. Inputs: none. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Handle the resize event for `window` and apply the related local state update. Inputs: none. Side effects: no direct external side effect beyond invoked dependencies. Returns: undefined; callback is side-effect-only. */ () => {
    resize();
    syncAnimationState();
  }, { passive: true });

  window.addEventListener('mousemove', /** Callback contract: Processes the callback step for window without leaking orchestration details to the caller. Inputs: event. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Handle the mousemove event for `window` and apply this module's related state update. Inputs: `event`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Handle the mousemove event for `window` and apply the related local state update. Inputs: `event`. Side effects: no direct external side effect beyond invoked dependencies. Returns: undefined; callback is side-effect-only. */ (event) => {
    mouse = { x: event.clientX, y: event.clientY };
  }, { passive: true });

  document.addEventListener('visibilitychange', syncAnimationState);
  window.addEventListener('nrs:themechange', syncAnimationState);
}