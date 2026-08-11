/**
 * @fileoverview src/scripts/features/motion/grid-canvas.js
 * Purpose: Browser runtime feature in the motion domain responsible for grid canvas behavior.
 * Responsibilities:
 * - Own the behavior/content implied by this file's single responsibility.
 * - Keep public routes, build contracts, and imported module boundaries stable unless the connected owners are updated together.
 * Execution context: Browser ES module loaded by the portfolio runtime.
 * Connected files:
 * - docs/repository/file-catalog.md
 * - src/runtime/script.js
 * - src/scripts/entrypoints/main.js
 * Maintenance: Update this header when responsibility or dependencies change; generated/vendor files are documented at their source instead.
 */
import { $, isTouchDevice, prefersReducedMotion } from '../../shared/dom.js';

/**
 * Function contract: initGridCanvas
 * Purpose: Implements the init grid canvas responsibility for this module.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may read or update browser DOM/state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
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
   * Purpose: Implements the is light theme responsibility for this module.
   * Inputs: none; the function derives state from its enclosing module/runtime context.
   * Side effects: may read or update browser DOM/state.
   * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
   */
  function isLightTheme() {
    return document.documentElement.getAttribute('data-theme') === 'light';
  }

  /**
   * Function contract: shouldRun
   * Purpose: Implements the should run responsibility for this module.
   * Inputs: none; the function derives state from its enclosing module/runtime context.
   * Side effects: may read or update browser DOM/state.
   * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
   */
  function shouldRun() {
    return !document.hidden && window.innerWidth >= 900;
  }

  /**
   * Function contract: resize
   * Purpose: Implements the resize responsibility for this module.
   * Inputs: none; the function derives state from its enclosing module/runtime context.
   * Side effects: may read or update browser DOM/state.
   * Returns: no explicit value unless an invoked dependency throws/rejects.
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
  function syncAnimationState() {
    if (shouldRun()) start();
    else stop();
  }

  resize();
  syncAnimationState();

  window.addEventListener('resize', /** Callback contract: Processes the callback step for window without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ () => {
    resize();
    syncAnimationState();
  }, { passive: true });

  window.addEventListener('mousemove', /** Callback contract: Processes the callback step for window without leaking orchestration details to the caller. Inputs: event. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (event) => {
    mouse = { x: event.clientX, y: event.clientY };
  }, { passive: true });

  document.addEventListener('visibilitychange', syncAnimationState);
  window.addEventListener('nrs:themechange', syncAnimationState);
}