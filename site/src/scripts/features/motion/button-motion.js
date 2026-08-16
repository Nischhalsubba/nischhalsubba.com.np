/**
 * @fileoverview src/scripts/features/motion/button-motion.js
 * Purpose: Apply the shared GSAP hover and held-active interaction language to sitewide buttons and button-like navigation controls.
 * Responsibilities:
 * - Load the pinned GSAP runtime and SplitText enhancement without blocking baseline navigation or form behavior.
 * - Discover existing controls without duplicating their labels, then layer pointer-origin fill, text, navigation, and press feedback by role.
 * - Keep pointer, touch, keyboard, reduced-motion, dynamic-content, and teardown behavior consistent across routes.
 * Execution context: Browser ES module loaded by the interaction-motion runtime entrypoint after the canonical page shell is available.
 * Connected files:
 * - src/scripts/entrypoints/interaction-motion.js
 * - src/styles/systems/interaction-motion.css
 * - src/scripts/features/forms/contact-form.js
 * Maintenance: Keep control discovery role-based and non-destructive; new controls should inherit this system through shared classes instead of page-local listeners.
 */

const GSAP_VERSION = '3.15.0';
const GSAP_SOURCE = `https://cdn.jsdelivr.net/npm/gsap@${GSAP_VERSION}/dist/gsap.min.js`;
const SPLIT_TEXT_SOURCE = `https://cdn.jsdelivr.net/npm/gsap@${GSAP_VERSION}/dist/SplitText.min.js`;
const CONTROL_SELECTOR = [
  'button',
  '[role="button"]',
  'a.btn',
  'a.btn-primary',
  'a.btn-secondary',
  '.footer-email-btn',
  '.floating-resume-btn',
  '.filter-btn',
  '.link-pill',
  '.nav-link',
  '.mobile-nav-links a',
  '.mobile-logo',
].join(',');
const NAV_SELECTOR = '.nav-link, .mobile-nav-links a, .mobile-logo';
const PRIMARY_SELECTOR = '.btn-primary, .footer-email-btn';
const ICON_ONLY_SELECTOR = '.theme-toggle-btn, .mobile-nav-toggle';
const GENERATED_SELECTOR = '.nrs-motion-fill, .nrs-motion-glow, .nrs-motion-impact, .nrs-motion-nav-dot';
const MOTION = {
  hoverEase: 'power4.out',
  settleEase: 'power3.out',
  releaseEase: 'back.out(1.35)',
  hoverDuration: 0.42,
  pressIn: 0.095,
  release: 0.30,
};

let activeTeardown = null;
let runtimePromise = null;
let initGeneration = 0;

/**
 * Function contract: loadExternalScript
 * Purpose: Load one external browser script exactly once and reuse an existing matching node when another runtime path already requested it.
 * Inputs: `source` - absolute script URL; `key` - stable data-attribute identifier for the dependency.
 * Side effects: Reads and mutates document head; registers one-time load/error listeners; performs network I/O.
 * Returns: Promise resolving after the script loads or rejecting when the dependency cannot be loaded.
 */
function loadExternalScript(source, key) {
  const selector = `script[data-nrs-motion-runtime="${key}"]`;
  const existing = document.querySelector(selector);
  if (existing?.dataset.loaded === 'true') return Promise.resolve();

  if (existing) {
    return new Promise(
      /** Callback contract: Wait for an already-requested dependency script to finish. Inputs: `resolve`, `reject`. Side effects: Registers one-time script listeners. Returns: Undefined; resolves or rejects the surrounding promise. */
      (resolve, reject) => {
      /**
       * Function contract: onLoad
       * Purpose: Mark an existing dependency script loaded and resolve the pending dependency promise.
       * Inputs: None.
       * Side effects: Updates script dataset state and resolves the enclosing promise.
       * Returns: Undefined.
       */
      const onLoad = () => {
        existing.dataset.loaded = 'true';
        resolve();
      };
      /**
       * Function contract: onError
       * Purpose: Reject the pending dependency promise when an existing script fails to load.
       * Inputs: `error` - browser script error event.
       * Side effects: Rejects the enclosing promise.
       * Returns: Undefined.
       */
      const onError = (error) => reject(error);
      existing.addEventListener('load', onLoad, { once: true });
      existing.addEventListener('error', onError, { once: true });
    });
  }

  return new Promise(
    /** Callback contract: Create and insert a missing dependency script. Inputs: `resolve`, `reject`. Side effects: Creates a script node, registers listeners, and mutates document head. Returns: Undefined; resolves or rejects the surrounding promise. */
    (resolve, reject) => {
    const script = document.createElement('script');
    script.src = source;
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.dataset.nrsMotionRuntime = key;
    script.addEventListener('load',
      /** Callback contract: Mark the inserted dependency loaded and resolve its promise. Inputs: None. Side effects: Updates script dataset state and resolves the enclosing promise. Returns: Undefined. */
      () => {
      script.dataset.loaded = 'true';
        resolve();
      }, { once: true });
    /** Callback contract: Reject the dependency wait when the newly inserted script fails to load. Inputs: Browser error event. Side effects: None. Returns: Undefined. */
    script.addEventListener('error', reject, { once: true });
    document.head.appendChild(script);
  });
}

/**
 * Function contract: resolveGsapRuntime
 * Purpose: Load the pinned GSAP core and optional SplitText plugin, then register the plugin when available.
 * Inputs: None; derives dependency state from browser globals and the current document.
 * Side effects: May insert external script nodes, perform network I/O, register SplitText, and emit a fallback warning.
 * Returns: Promise resolving to `{ gsap, SplitText }`; SplitText may be null when its optional enhancement fails.
 */
async function resolveGsapRuntime() {
  if (!window.gsap || window.gsap.version !== GSAP_VERSION) {
    await loadExternalScript(GSAP_SOURCE, `gsap-${GSAP_VERSION}`);
  }

  const gsap = window.gsap;
  if (!gsap) throw new Error('GSAP core did not initialize.');

  let SplitText = window.SplitText || null;
  if (!SplitText) {
    try {
      await loadExternalScript(SPLIT_TEXT_SOURCE, `split-text-${GSAP_VERSION}`);
      SplitText = window.SplitText || null;
    } catch (error) {
      console.warn('[portfolio] SplitText unavailable; button motion will use whole-label fallback.', error);
    }
  }

  if (SplitText) gsap.registerPlugin(SplitText);
  return { gsap, SplitText };
}

/**
 * Function contract: loadGsapRuntime
 * Purpose: Reuse one in-flight/resolved GSAP dependency promise so multiple initializations never insert duplicate runtime scripts.
 * Inputs: None.
 * Side effects: Initializes or resets the shared runtime promise.
 * Returns: Promise resolving to the pinned GSAP runtime and optional SplitText plugin.
 */
function loadGsapRuntime() {
  if (runtimePromise) return runtimePromise;

  runtimePromise = resolveGsapRuntime().catch(
    /** Callback contract: Reset the shared dependency promise after a failed runtime load so a later initialization may retry. Inputs: `error`. Side effects: Clears module runtime state. Returns: Never; rethrows the original error. */
    (error) => {
      runtimePromise = null;
      throw error;
    },
  );

  return runtimePromise;
}

/**
 * Function contract: controlRole
 * Purpose: Classify one discovered interactive control so the shared motion system can apply an appropriate weight and visual treatment.
 * Inputs: `control` - candidate HTMLElement matching the sitewide control selector.
 * Side effects: None.
 * Returns: One of `icon`, `nav`, `primary`, or `secondary`.
 */
function controlRole(control) {
  if (control.matches(ICON_ONLY_SELECTOR)) return 'icon';
  if (control.matches(NAV_SELECTOR)) return 'nav';
  if (control.matches(PRIMARY_SELECTOR)) return 'primary';
  return 'secondary';
}

/**
 * Function contract: isEligibleControl
 * Purpose: Reject inert, hidden-helper, or explicitly opted-out elements before attaching motion behavior.
 * Inputs: `control` - candidate Element.
 * Side effects: Reads element attributes and ancestor state.
 * Returns: Boolean indicating whether the element should participate in the interaction system.
 */
function isEligibleControl(control) {
  if (!(control instanceof HTMLElement)) return false;
  if (control.matches('[data-motion="off"], [aria-hidden="true"]')) return false;
  if (control.closest('[aria-hidden="true"]')) return false;
  if ('disabled' in control && control.disabled) return false;
  return true;
}

/**
 * Function contract: generatedLayer
 * Purpose: Return or create one generated visual layer while keeping the authored control label and semantics untouched.
 * Inputs: `control` - decorated control; `className` - generated layer class.
 * Side effects: May append an aria-hidden span to the control.
 * Returns: Existing or newly created HTMLElement for the requested layer.
 */
function generatedLayer(control, className) {
  let layer = control.querySelector(`:scope > .${className}`);
  if (layer) return layer;
  layer = document.createElement('span');
  layer.className = className;
  layer.setAttribute('aria-hidden', 'true');
  control.appendChild(layer);
  return layer;
}

/**
 * Function contract: simpleTextLabel
 * Purpose: Wrap a simple text-only control label once so SplitText can animate the authored label without creating a second copy.
 * Inputs: `content` - generated content wrapper containing the control's original child nodes.
 * Side effects: Replaces direct text-only content with a single semantic-neutral label span containing the same text.
 * Returns: Label HTMLElement when the content is text-only; otherwise null so complex markup remains intact.
 */
function simpleTextLabel(content) {
  const meaningfulNodes = [...content.childNodes].filter(
    /** Callback contract: Keep direct text/element nodes that contribute visible control content. Inputs: `node`. Side effects: None. Returns: Boolean indicating meaningful authored content. */
    (node) => {
    if (node.nodeType === Node.TEXT_NODE) return Boolean(node.textContent?.trim());
      return node.nodeType === Node.ELEMENT_NODE;
    },
  );
  if (meaningfulNodes.length !== 1 || meaningfulNodes[0].nodeType !== Node.TEXT_NODE) return null;

  const label = document.createElement('span');
  label.className = 'nrs-motion-label';
  label.textContent = meaningfulNodes[0].textContent;
  meaningfulNodes[0].replaceWith(label);
  return label;
}

/**
 * Function contract: decorateControl
 * Purpose: Add reusable visual layers around an existing control while preserving exactly one authored label and the control's original semantics.
 * Inputs: `control` - eligible interactive control.
 * Side effects: Adds role/data classes, wraps non-icon content, appends generated visual layers, and constrains CSS transform transitions so GSAP owns transforms.
 * Returns: Structure object containing the control, role, content, label, and generated motion layers.
 */
function decorateControl(control) {
  const role = controlRole(control);
  control.classList.add('nrs-motion-control');
  control.dataset.nrsMotionRole = role;
  control.style.transitionProperty = 'color, background-color, border-color, box-shadow, opacity';
  if (window.getComputedStyle(control).position === 'static') control.style.position = 'relative';

  if (role === 'icon') {
    control.dataset.nrsMotionDecorated = 'true';
    return { control, role, content: control, label: null, fill: null, glow: null, impact: null, dot: null };
  }

  let content = control.querySelector(':scope > .nrs-motion-content');
  if (!content) {
    content = document.createElement('span');
    content.className = 'nrs-motion-content';
    const originalNodes = [...control.childNodes].filter((node) => {
      return !(node instanceof Element && node.matches(GENERATED_SELECTOR));
    });
    originalNodes.forEach((node) => content.appendChild(node));
    control.appendChild(content);
  }

  let label = content.querySelector(':scope > .nrs-motion-label');
  if (!label) label = simpleTextLabel(content);

  let fill = null;
  let glow = null;
  let impact = null;
  let dot = null;

  if (role === 'nav') {
    dot = generatedLayer(control, 'nrs-motion-nav-dot');
  } else {
    fill = generatedLayer(control, 'nrs-motion-fill');
    impact = generatedLayer(control, 'nrs-motion-impact');
    if (role === 'primary') glow = generatedLayer(control, 'nrs-motion-glow');
  }

  control.dataset.nrsMotionDecorated = 'true';
  return { control, role, content, label, fill, glow, impact, dot };
}

/**
 * Function contract: structureIsIntact
 * Purpose: Detect whether another feature replaced a decorated control's child content so motion can be rebuilt around the new single source label.
 * Inputs: `structure` - decorated control structure.
 * Side effects: Reads DOM connectivity and direct-child structure.
 * Returns: Boolean indicating whether the stored structure is still usable.
 */
function structureIsIntact(structure) {
  if (!structure?.control?.isConnected) return false;
  if (structure.role === 'icon') return true;
  return structure.content?.isConnected && structure.content.parentElement === structure.control;
}

/**
 * Function contract: pointIn
 * Purpose: Convert a pointer or keyboard activation into clamped local control coordinates and normalized pointer intent.
 * Inputs: `event` - optional PointerEvent/KeyboardEvent-like object; `element` - target control.
 * Side effects: Reads one bounding client rectangle.
 * Returns: Local x/y coordinates, normalized x/y intent, rectangle dimensions, and the required radial fill scale.
 */
function pointIn(event, element) {
  const rect = element.getBoundingClientRect();
  const clientX = Number.isFinite(event?.clientX) ? event.clientX : rect.left + rect.width * 0.5;
  const clientY = Number.isFinite(event?.clientY) ? event.clientY : rect.top + rect.height * 0.5;
  const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
  const y = Math.max(0, Math.min(rect.height, clientY - rect.top));
  const farX = Math.max(x, rect.width - x);
  const farY = Math.max(y, rect.height - y);
  const radius = Math.hypot(farX, farY);

  return {
    x,
    y,
    nx: rect.width ? Math.max(-1, Math.min(1, ((clientX - rect.left) / rect.width - 0.5) * 2)) : 0,
    ny: rect.height ? Math.max(-1, Math.min(1, ((clientY - rect.top) / rect.height - 0.5) * 2)) : 0,
    fillScale: Math.max(1, (radius * 2) / 72),
  };
}

/**
 * Function contract: isActivationKey
 * Purpose: Recognize the initial keyboard activation phase shared by native button and link controls.
 * Inputs: `event` - KeyboardEvent.
 * Side effects: None.
 * Returns: Boolean true for a non-repeating Enter or Space press.
 */
function isActivationKey(event) {
  return !event.repeat && (event.key === 'Enter' || event.key === ' ');
}

/**
 * Function contract: isActivationKeyUp
 * Purpose: Recognize the keyboard release phase for the held active-state animation.
 * Inputs: `event` - KeyboardEvent.
 * Side effects: None.
 * Returns: Boolean true for Enter or Space release.
 */
function isActivationKeyUp(event) {
  return event.key === 'Enter' || event.key === ' ';
}

/**
 * Function contract: splitExistingLabel
 * Purpose: Split one existing authored label into accessible character spans when SplitText is available, while retaining a whole-label fallback.
 * Inputs: `label` - label HTMLElement; `SplitText` - optional registered plugin constructor.
 * Side effects: SplitText may replace label text with generated character spans and accessibility metadata until reverted.
 * Returns: SplitText instance or null when the label/plugin is unavailable.
 */
function splitExistingLabel(label, SplitText) {
  if (!label || !SplitText) return null;
  return SplitText.create(label, {
    type: 'chars',
    charsClass: 'nrs-motion-char++',
    aria: 'auto',
  });
}

/**
 * Function contract: createPillMotion
 * Purpose: Apply the full pointer-origin fill, subtle label choreography, pointer intent, held compression, impact, and controlled release motion to primary/secondary controls.
 * Inputs: `structure` - decorated control structure; `gsap` - GSAP runtime; `SplitText` - optional plugin; `canHover` - fine-pointer hover capability.
 * Side effects: Creates GSAP timelines/tweens and registers pointer/keyboard listeners on the control.
 * Returns: Instance object exposing a `destroy` function for lifecycle cleanup.
 */
function createPillMotion(structure, gsap, SplitText, canHover) {
  const { control, role, content, label, fill, glow, impact } = structure;
  const split = splitExistingLabel(label, SplitText);
  const chars = split?.chars || [];
  const textTargets = chars.length ? chars : label ? [label] : [];
  const isPrimary = role === 'primary';
  const state = { hovered: false, pressed: false, pointerId: null };

  gsap.set(control, { x: 0, y: 0, scaleX: 1, scaleY: 1, transformOrigin: '50% 50%' });
  gsap.set(textTargets, { transformOrigin: '50% 70%', backfaceVisibility: 'hidden' });
  if (fill) gsap.set(fill, { scale: 0.001, x: -120, y: -120 });
  if (glow) gsap.set(glow, { opacity: 0, x: -160, y: -160 });

  const hoverText = gsap.timeline({ paused: true, defaults: { overwrite: 'auto' } });
  if (textTargets.length) {
    hoverText
      .to(textTargets, {
        y: isPrimary ? -1.8 : -1.4,
        rotationX: -6,
        duration: 0.17,
        stagger: chars.length ? { each: 0.009, from: 'start' } : 0,
        ease: 'power2.out',
      }, 0.055)
      .to(textTargets, {
        y: 0,
        rotationX: 0,
        duration: 0.28,
        stagger: chars.length ? { each: 0.008, from: 'start' } : 0,
        ease: MOTION.settleEase,
      }, 0.145);
  }

  const moveContentX = gsap.quickTo(content, 'x', { duration: 0.30, ease: 'power3.out' });
  const moveGlowX = glow ? gsap.quickTo(glow, 'x', { duration: 0.22, ease: 'power3.out' }) : null;
  const moveGlowY = glow ? gsap.quickTo(glow, 'y', { duration: 0.22, ease: 'power3.out' }) : null;
  const hoverScale = isPrimary ? 1.009 : 1.006;
  const hoverY = isPrimary ? -2 : -1.25;

  /**
   * Function contract: settleControl
   * Purpose: Resolve the outer control to its current hovered or resting pose without interrupting a held press.
   * Inputs: `immediate` - whether to resolve without interpolation.
   * Side effects: Starts/replaces a GSAP transform tween on the control.
   * Returns: Undefined.
   */
  function settleControl(immediate = false) {
    if (state.pressed) return;
    gsap.to(control, {
      y: state.hovered && canHover ? hoverY : 0,
      scaleX: state.hovered && canHover ? hoverScale : 1,
      scaleY: state.hovered && canHover ? hoverScale : 1,
      duration: immediate ? 0 : MOTION.hoverDuration,
      ease: MOTION.hoverEase,
      overwrite: 'auto',
    });
  }

  /**
   * Function contract: enter
   * Purpose: Start pointer-origin hover choreography from the actual cursor entry point.
   * Inputs: `event` - PointerEvent-like object.
   * Side effects: Updates hover state/classes and starts fill, glow, text, and transform tweens.
   * Returns: Undefined.
   */
  function enter(event) {
    if (!canHover) return;
    state.hovered = true;
    control.classList.add('is-motion-hovered');
    const point = pointIn(event, control);

    if (fill) {
      gsap.set(fill, { x: point.x, y: point.y, scale: 0.001 });
      gsap.to(fill, {
        scale: point.fillScale,
        duration: isPrimary ? 0.54 : 0.48,
        ease: 'expo.out',
        overwrite: 'auto',
      });
    }

    if (glow) {
      gsap.set(glow, { x: point.x, y: point.y });
      gsap.to(glow, { opacity: 0.55, duration: 0.22, ease: 'power2.out', overwrite: 'auto' });
    }

    settleControl();
    hoverText.play();
  }

  /**
   * Function contract: move
   * Purpose: Apply restrained high-frequency pointer intent to inner content and the primary glow without moving the control hit target.
   * Inputs: `event` - PointerEvent.
   * Side effects: Updates quickTo tween destinations.
   * Returns: Undefined.
   */
  function move(event) {
    if (!canHover) return;
    const point = pointIn(event, control);
    moveContentX(point.nx * (isPrimary ? 1.7 : 1.1));
    if (moveGlowX && moveGlowY) {
      moveGlowX(point.x);
      moveGlowY(point.y);
    }
  }

  /**
   * Function contract: leave
   * Purpose: Reverse hover choreography cleanly when the pointer leaves, while preserving any held active state until release.
   * Inputs: None.
   * Side effects: Updates hover state/classes and reverses active hover tweens.
   * Returns: Undefined.
   */
  function leave() {
    if (!canHover) return;
    state.hovered = false;
    control.classList.remove('is-motion-hovered');
    moveContentX(0);
    if (fill) gsap.to(fill, { scale: 0.001, duration: 0.34, ease: 'power3.inOut', overwrite: 'auto' });
    if (glow) gsap.to(glow, { opacity: 0, duration: 0.18, ease: 'power2.out', overwrite: 'auto' });
    hoverText.reverse();
    settleControl();
  }

  /**
   * Function contract: pressStart
   * Purpose: Enter the held physical active state and originate the impact response at the pointer or keyboard activation point.
   * Inputs: `event` - PointerEvent/KeyboardEvent-like object.
   * Side effects: Captures pointer input when available and starts GSAP compression/content/impact tweens.
   * Returns: Undefined.
   */
  function pressStart(event) {
    if (state.pressed) return;
    if (event?.type === 'pointerdown' && event.button !== 0) return;
    state.pressed = true;
    state.pointerId = event?.pointerId ?? null;
    control.classList.add('is-motion-pressed');
    const point = pointIn(event, control);

    if (state.pointerId != null && control.setPointerCapture) {
      try {
        control.setPointerCapture(state.pointerId);
      } catch {
        state.pointerId = null;
      }
    }

    if (impact) {
      gsap.fromTo(impact,
        { x: point.x, y: point.y, scale: 0.35, opacity: 0.30 },
        {
          scale: isPrimary ? 2.7 : 2.35,
          opacity: 0,
          duration: 0.44,
          ease: 'power3.out',
          overwrite: 'auto',
        });
    }

    gsap.to(control, {
      y: state.hovered && canHover ? -0.4 : 0.6,
      scaleX: isPrimary ? 0.982 : 0.986,
      scaleY: isPrimary ? 0.952 : 0.963,
      duration: MOTION.pressIn,
      ease: 'power2.out',
      overwrite: 'auto',
    });
    gsap.to(content, {
      y: isPrimary ? 1.35 : 0.85,
      duration: MOTION.pressIn,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  }

  /**
   * Function contract: pressEnd
   * Purpose: Release the held active state back to the current hover/rest pose with controlled spring weight.
   * Inputs: `event` - optional PointerEvent-like release event.
   * Side effects: Releases pointer capture and starts recovery tweens.
   * Returns: Undefined.
   */
  function pressEnd(event) {
    if (!state.pressed) return;
    state.pressed = false;
    control.classList.remove('is-motion-pressed');

    const pointerId = event?.pointerId ?? state.pointerId;
    if (pointerId != null && control.releasePointerCapture && control.hasPointerCapture?.(pointerId)) {
      try {
        control.releasePointerCapture(pointerId);
      } catch {
        // Pointer capture can already be released by the browser on cancellation.
      }
    }
    state.pointerId = null;

    gsap.to(control, {
      y: state.hovered && canHover ? hoverY : 0,
      scaleX: state.hovered && canHover ? hoverScale : 1,
      scaleY: state.hovered && canHover ? hoverScale : 1,
      duration: MOTION.release,
      ease: MOTION.releaseEase,
      overwrite: 'auto',
    });
    gsap.to(content, { y: 0, duration: 0.24, ease: MOTION.settleEase, overwrite: 'auto' });
  }

  /**
   * Function contract: keyDown
   * Purpose: Start the pill active state for Enter/Space without repeating while the key remains held.
   * Inputs: `event` - KeyboardEvent.
   * Side effects: Delegates to pressStart when the key is an activation key.
   * Returns: Undefined.
   */
  function keyDown(event) {
    if (isActivationKey(event)) pressStart(event);
  }

  /**
   * Function contract: keyUp
   * Purpose: Release the pill active state when Enter/Space is released.
   * Inputs: `event` - KeyboardEvent.
   * Side effects: Delegates to pressEnd when the key is an activation key.
   * Returns: Undefined.
   */
  function keyUp(event) {
    if (isActivationKeyUp(event)) pressEnd(event);
  }

  control.addEventListener('pointerenter', enter);
  control.addEventListener('pointermove', move);
  control.addEventListener('pointerleave', leave);
  control.addEventListener('pointerdown', pressStart);
  control.addEventListener('pointerup', pressEnd);
  control.addEventListener('pointercancel', pressEnd);
  control.addEventListener('lostpointercapture', pressEnd);
  control.addEventListener('keydown', keyDown);
  control.addEventListener('keyup', keyUp);
  control.addEventListener('blur', pressEnd);

  return {
    structure,
    /**
     * Function contract: destroy
     * Purpose: Tear down one pill interaction instance and revert its SplitText enhancement.
     * Inputs: None.
     * Side effects: Kills GSAP work, reverts split text, clears state classes, and removes listeners.
     * Returns: Undefined.
     */
    destroy() {
      hoverText.kill();
      split?.revert();
      gsap.killTweensOf([control, content, fill, glow, impact, ...textTargets].filter(Boolean));
      control.classList.remove('is-motion-hovered', 'is-motion-pressed');
      control.removeEventListener('pointerenter', enter);
      control.removeEventListener('pointermove', move);
      control.removeEventListener('pointerleave', leave);
      control.removeEventListener('pointerdown', pressStart);
      control.removeEventListener('pointerup', pressEnd);
      control.removeEventListener('pointercancel', pressEnd);
      control.removeEventListener('lostpointercapture', pressEnd);
      control.removeEventListener('keydown', keyDown);
      control.removeEventListener('keyup', keyUp);
      control.removeEventListener('blur', pressEnd);
    },
  };
}

/**
 * Function contract: createNavMotion
 * Purpose: Apply smaller character lift, current-color dot feedback, and held compression to desktop/mobile navigation controls.
 * Inputs: `structure` - decorated nav structure; `gsap` - GSAP runtime; `SplitText` - optional plugin; `canHover` - fine-pointer hover capability.
 * Side effects: Creates GSAP timelines/tweens and registers pointer/keyboard listeners.
 * Returns: Instance object exposing a `destroy` function.
 */
function createNavMotion(structure, gsap, SplitText, canHover) {
  const { control, label, dot } = structure;
  const split = splitExistingLabel(label, SplitText);
  const chars = split?.chars || [];
  const textTargets = chars.length ? chars : label ? [label] : [];
  const state = { hovered: false, pressed: false, pointerId: null };

  gsap.set(control, { x: 0, y: 0, scaleX: 1, scaleY: 1, transformOrigin: '50% 50%' });
  const hover = gsap.timeline({ paused: true, defaults: { overwrite: 'auto' } });
  if (textTargets.length) {
    hover.to(textTargets, {
      y: -1.4,
      duration: 0.20,
      stagger: chars.length ? { each: 0.009, from: 'center' } : 0,
      ease: MOTION.settleEase,
    }, 0);
  }
  if (dot) {
    hover.to(dot, {
      scale: 1,
      opacity: 0.82,
      y: -1,
      duration: 0.26,
      ease: 'back.out(1.65)',
    }, 0.035);
  }

  /**
   * Function contract: enter
   * Purpose: Play nav hover choreography on fine-pointer entry.
   * Inputs: None.
   * Side effects: Updates hover state and timeline playback.
   * Returns: Undefined.
   */
  function enter() {
    if (!canHover) return;
    state.hovered = true;
    hover.play();
  }

  /**
   * Function contract: leave
   * Purpose: Reverse nav hover choreography on fine-pointer exit.
   * Inputs: None.
   * Side effects: Updates hover state and timeline playback.
   * Returns: Undefined.
   */
  function leave() {
    if (!canHover) return;
    state.hovered = false;
    hover.reverse();
  }

  /**
   * Function contract: pressStart
   * Purpose: Enter the held nav active state.
   * Inputs: `event` - PointerEvent/KeyboardEvent-like object.
   * Side effects: Captures pointer when possible and starts a compression tween.
   * Returns: Undefined.
   */
  function pressStart(event) {
    if (state.pressed) return;
    if (event?.type === 'pointerdown' && event.button !== 0) return;
    state.pressed = true;
    state.pointerId = event?.pointerId ?? null;
    if (state.pointerId != null && control.setPointerCapture) {
      try {
        control.setPointerCapture(state.pointerId);
      } catch {
        state.pointerId = null;
      }
    }
    gsap.to(control, {
      scaleX: 0.972,
      scaleY: 0.94,
      y: 0.7,
      duration: 0.08,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  }

  /**
   * Function contract: pressEnd
   * Purpose: Release the held nav active state with controlled spring recovery.
   * Inputs: `event` - PointerEvent-like release event.
   * Side effects: Releases capture and starts a recovery tween.
   * Returns: Undefined.
   */
  function pressEnd(event) {
    if (!state.pressed) return;
    state.pressed = false;
    const pointerId = event?.pointerId ?? state.pointerId;
    if (pointerId != null && control.releasePointerCapture && control.hasPointerCapture?.(pointerId)) {
      try {
        control.releasePointerCapture(pointerId);
      } catch {
        // Browser may already have released capture.
      }
    }
    state.pointerId = null;
    gsap.to(control, {
      scaleX: 1,
      scaleY: 1,
      y: 0,
      duration: 0.24,
      ease: MOTION.releaseEase,
      overwrite: 'auto',
    });
  }

  /**
   * Function contract: keyDown
   * Purpose: Start nav active feedback for Enter/Space.
   * Inputs: `event` - KeyboardEvent.
   * Side effects: Delegates to pressStart when applicable.
   * Returns: Undefined.
   */
  function keyDown(event) {
    if (isActivationKey(event)) pressStart(event);
  }

  /**
   * Function contract: keyUp
   * Purpose: Release nav active feedback for Enter/Space.
   * Inputs: `event` - KeyboardEvent.
   * Side effects: Delegates to pressEnd when applicable.
   * Returns: Undefined.
   */
  function keyUp(event) {
    if (isActivationKeyUp(event)) pressEnd(event);
  }

  control.addEventListener('pointerenter', enter);
  control.addEventListener('pointerleave', leave);
  control.addEventListener('pointerdown', pressStart);
  control.addEventListener('pointerup', pressEnd);
  control.addEventListener('pointercancel', pressEnd);
  control.addEventListener('lostpointercapture', pressEnd);
  control.addEventListener('keydown', keyDown);
  control.addEventListener('keyup', keyUp);
  control.addEventListener('blur', pressEnd);

  return {
    structure,
    /**
     * Function contract: destroy
     * Purpose: Tear down one navigation interaction instance and revert its SplitText enhancement.
     * Inputs: None.
     * Side effects: Kills GSAP work, reverts split text, and removes listeners.
     * Returns: Undefined.
     */
    destroy() {
      hover.kill();
      split?.revert();
      gsap.killTweensOf([control, dot, ...textTargets].filter(Boolean));
      control.removeEventListener('pointerenter', enter);
      control.removeEventListener('pointerleave', leave);
      control.removeEventListener('pointerdown', pressStart);
      control.removeEventListener('pointerup', pressEnd);
      control.removeEventListener('pointercancel', pressEnd);
      control.removeEventListener('lostpointercapture', pressEnd);
      control.removeEventListener('keydown', keyDown);
      control.removeEventListener('keyup', keyUp);
      control.removeEventListener('blur', pressEnd);
    },
  };
}

/**
 * Function contract: createIconMotion
 * Purpose: Give icon-only controls the same held-input weight without wrapping children that other features may replace at runtime.
 * Inputs: `structure` - icon control structure; `gsap` - GSAP runtime; `canHover` - fine-pointer hover capability.
 * Side effects: Registers pointer/keyboard listeners and starts transform tweens.
 * Returns: Instance object exposing a `destroy` function.
 */
function createIconMotion(structure, gsap, canHover) {
  const { control } = structure;
  const state = { hovered: false, pressed: false, pointerId: null };
  gsap.set(control, { x: 0, y: 0, scaleX: 1, scaleY: 1, transformOrigin: '50% 50%' });

  /**
   * Function contract: settle
   * Purpose: Resolve icon hover/rest scale and vertical position without overriding a held press.
   * Inputs: None.
   * Side effects: Starts or replaces the control transform tween.
   * Returns: Undefined.
   */
  function settle() {
    if (state.pressed) return;
    gsap.to(control, {
      y: state.hovered && canHover ? -1 : 0,
      scaleX: state.hovered && canHover ? 1.035 : 1,
      scaleY: state.hovered && canHover ? 1.035 : 1,
      duration: 0.28,
      ease: MOTION.hoverEase,
      overwrite: 'auto',
    });
  }

  /**
   * Function contract: enter
   * Purpose: Mark an icon control hovered and settle it to the hover pose.
   * Inputs: None.
   * Side effects: Updates local hover state and starts a transform tween.
   * Returns: Undefined.
   */
  function enter() {
    if (!canHover) return;
    state.hovered = true;
    settle();
  }

  /**
   * Function contract: leave
   * Purpose: Clear icon hover state and settle back unless currently held.
   * Inputs: None.
   * Side effects: Updates local hover state and starts a transform tween.
   * Returns: Undefined.
   */
  function leave() {
    if (!canHover) return;
    state.hovered = false;
    settle();
  }

  /**
   * Function contract: pressStart
   * Purpose: Enter the held active pose for an icon-only control.
   * Inputs: `event` - PointerEvent/KeyboardEvent-like object.
   * Side effects: Captures pointer when possible and starts compression.
   * Returns: Undefined.
   */
  function pressStart(event) {
    if (state.pressed) return;
    if (event?.type === 'pointerdown' && event.button !== 0) return;
    state.pressed = true;
    state.pointerId = event?.pointerId ?? null;
    if (state.pointerId != null && control.setPointerCapture) {
      try {
        control.setPointerCapture(state.pointerId);
      } catch {
        state.pointerId = null;
      }
    }
    gsap.to(control, {
      y: 0.5,
      scaleX: 0.94,
      scaleY: 0.90,
      duration: 0.08,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  }

  /**
   * Function contract: pressEnd
   * Purpose: Release an icon-only active pose to the current hover/rest pose.
   * Inputs: `event` - PointerEvent-like release event.
   * Side effects: Releases pointer capture and starts spring recovery.
   * Returns: Undefined.
   */
  function pressEnd(event) {
    if (!state.pressed) return;
    state.pressed = false;
    const pointerId = event?.pointerId ?? state.pointerId;
    if (pointerId != null && control.releasePointerCapture && control.hasPointerCapture?.(pointerId)) {
      try {
        control.releasePointerCapture(pointerId);
      } catch {
        // Browser may already have released capture.
      }
    }
    state.pointerId = null;
    gsap.to(control, {
      y: state.hovered && canHover ? -1 : 0,
      scaleX: state.hovered && canHover ? 1.035 : 1,
      scaleY: state.hovered && canHover ? 1.035 : 1,
      duration: 0.24,
      ease: MOTION.releaseEase,
      overwrite: 'auto',
    });
  }

  /**
   * Function contract: keyDown
   * Purpose: Start icon active feedback for Enter/Space.
   * Inputs: `event` - KeyboardEvent.
   * Side effects: Delegates to pressStart when applicable.
   * Returns: Undefined.
   */
  function keyDown(event) {
    if (isActivationKey(event)) pressStart(event);
  }

  /**
   * Function contract: keyUp
   * Purpose: Release icon active feedback for Enter/Space.
   * Inputs: `event` - KeyboardEvent.
   * Side effects: Delegates to pressEnd when applicable.
   * Returns: Undefined.
   */
  function keyUp(event) {
    if (isActivationKeyUp(event)) pressEnd(event);
  }

  control.addEventListener('pointerenter', enter);
  control.addEventListener('pointerleave', leave);
  control.addEventListener('pointerdown', pressStart);
  control.addEventListener('pointerup', pressEnd);
  control.addEventListener('pointercancel', pressEnd);
  control.addEventListener('lostpointercapture', pressEnd);
  control.addEventListener('keydown', keyDown);
  control.addEventListener('keyup', keyUp);
  control.addEventListener('blur', pressEnd);

  return {
    structure,
    /**
     * Function contract: destroy
     * Purpose: Tear down one icon interaction instance.
     * Inputs: None.
     * Side effects: Kills GSAP work and removes listeners.
     * Returns: Undefined.
     */
    destroy() {
      gsap.killTweensOf(control);
      control.removeEventListener('pointerenter', enter);
      control.removeEventListener('pointerleave', leave);
      control.removeEventListener('pointerdown', pressStart);
      control.removeEventListener('pointerup', pressEnd);
      control.removeEventListener('pointercancel', pressEnd);
      control.removeEventListener('lostpointercapture', pressEnd);
      control.removeEventListener('keydown', keyDown);
      control.removeEventListener('keyup', keyUp);
      control.removeEventListener('blur', pressEnd);
    },
  };
}

/**
 * Function contract: createReducedMotion
 * Purpose: Preserve immediate active-state feedback for reduced-motion users without spatial movement, radial fills, or character choreography.
 * Inputs: `structure` - decorated control structure; `gsap` - GSAP runtime.
 * Side effects: Registers pointer/keyboard listeners and starts short opacity tweens.
 * Returns: Instance object exposing a `destroy` function.
 */
function createReducedMotion(structure, gsap) {
  const { control } = structure;
  let pressed = false;

  /**
   * Function contract: pressStart
   * Purpose: Enter reduced-motion pressed feedback.
   * Inputs: `event` - PointerEvent/KeyboardEvent-like object.
   * Side effects: Starts a short opacity tween.
   * Returns: Undefined.
   */
  function pressStart(event) {
    if (pressed) return;
    if (event?.type === 'pointerdown' && event.button !== 0) return;
    pressed = true;
    gsap.to(control, { opacity: 0.78, duration: 0.08, overwrite: 'auto' });
  }

  /**
   * Function contract: pressEnd
   * Purpose: Release reduced-motion pressed feedback.
   * Inputs: None.
   * Side effects: Starts a short opacity restoration tween.
   * Returns: Undefined.
   */
  function pressEnd() {
    if (!pressed) return;
    pressed = false;
    gsap.to(control, { opacity: 1, duration: 0.10, overwrite: 'auto' });
  }

  /**
   * Function contract: keyDown
   * Purpose: Start reduced-motion active feedback for Enter/Space.
   * Inputs: `event` - KeyboardEvent.
   * Side effects: Delegates to pressStart when applicable.
   * Returns: Undefined.
   */
  function keyDown(event) {
    if (isActivationKey(event)) pressStart(event);
  }

  /**
   * Function contract: keyUp
   * Purpose: Release reduced-motion active feedback for Enter/Space.
   * Inputs: `event` - KeyboardEvent.
   * Side effects: Delegates to pressEnd when applicable.
   * Returns: Undefined.
   */
  function keyUp(event) {
    if (isActivationKeyUp(event)) pressEnd();
  }

  control.addEventListener('pointerdown', pressStart);
  control.addEventListener('pointerup', pressEnd);
  control.addEventListener('pointercancel', pressEnd);
  control.addEventListener('keydown', keyDown);
  control.addEventListener('keyup', keyUp);
  control.addEventListener('blur', pressEnd);

  return {
    structure,
    /**
     * Function contract: destroy
     * Purpose: Tear down one reduced-motion interaction instance.
     * Inputs: None.
     * Side effects: Kills opacity tweens and removes listeners.
     * Returns: Undefined.
     */
    destroy() {
      gsap.killTweensOf(control);
      control.removeEventListener('pointerdown', pressStart);
      control.removeEventListener('pointerup', pressEnd);
      control.removeEventListener('pointercancel', pressEnd);
      control.removeEventListener('keydown', keyDown);
      control.removeEventListener('keyup', keyUp);
      control.removeEventListener('blur', pressEnd);
    },
  };
}

/**
 * Function contract: createControlMotion
 * Purpose: Route one decorated control to the role-appropriate full or reduced motion implementation.
 * Inputs: `structure`, `gsap`, `SplitText`, and capability conditions.
 * Side effects: Delegates listener/tween setup to the selected motion implementation.
 * Returns: Motion instance exposing `destroy`.
 */
function createControlMotion(structure, gsap, SplitText, { canHover, reduce }) {
  if (reduce) return createReducedMotion(structure, gsap);
  if (structure.role === 'nav') return createNavMotion(structure, gsap, SplitText, canHover);
  if (structure.role === 'icon') return createIconMotion(structure, gsap, canHover);
  return createPillMotion(structure, gsap, SplitText, canHover);
}

/**
 * Function contract: initializeMotionScope
 * Purpose: Attach the role-aware motion system to current and future controls for one GSAP matchMedia capability state.
 * Inputs: `gsap`, `SplitText`, and condition booleans from matchMedia.
 * Side effects: Decorates controls, registers listeners, and starts a MutationObserver for dynamically inserted/replaced control content.
 * Returns: Cleanup function that removes observers/listeners and kills active GSAP work for this capability state.
 */
function initializeMotionScope(gsap, SplitText, conditions) {
  const instances = new Map();

  /**
   * Function contract: setupControl
   * Purpose: Decorate and initialize one eligible control once, rebuilding it when another feature replaced its animated content.
   * Inputs: `control` - candidate HTMLElement.
   * Side effects: May destroy stale motion, mutate control structure, and attach listeners/tweens.
   * Returns: Undefined.
   */
  function setupControl(control) {
    if (!isEligibleControl(control)) return;

    const current = instances.get(control);
    if (current && structureIsIntact(current.structure)) return;
    if (current) {
      current.destroy();
      instances.delete(control);
    }

    if (control.dataset.nrsMotionDecorated === 'true' && !control.matches(ICON_ONLY_SELECTOR)) {
      const content = control.querySelector(':scope > .nrs-motion-content');
      if (!content) {
        control.querySelectorAll(':scope > .nrs-motion-fill, :scope > .nrs-motion-glow, :scope > .nrs-motion-impact, :scope > .nrs-motion-nav-dot').forEach((node) => node.remove());
        delete control.dataset.nrsMotionDecorated;
      }
    }

    const structure = decorateControl(control);
    instances.set(control, createControlMotion(structure, gsap, SplitText, conditions));
  }

  /**
   * Function contract: scanRoot
   * Purpose: Discover controls within one added DOM root without rescanning the entire document.
   * Inputs: `root` - Element/DocumentFragment-like mutation root.
   * Side effects: Calls setupControl for matching controls.
   * Returns: Undefined.
   */
  function scanRoot(root) {
    if (!(root instanceof Element)) return;
    if (root.matches(CONTROL_SELECTOR)) setupControl(root);
    root.querySelectorAll(CONTROL_SELECTOR).forEach((control) => setupControl(control));
  }

  document.querySelectorAll(CONTROL_SELECTOR).forEach((control) => setupControl(control));

  const observer = new MutationObserver(
    /** Callback contract: Rebuild controls whose authored content was replaced and initialize newly inserted controls. Inputs: `records` - mutation records. Side effects: Destroys/recreates motion instances and scans added DOM. Returns: Undefined. */
    (records) => {
      records.forEach(
        /** Callback contract: Process one DOM mutation for stale or newly added controls. Inputs: `record`. Side effects: May rebuild an instance and scan added nodes. Returns: Undefined. */
        (record) => {
          if (record.target instanceof HTMLElement && record.target.matches(CONTROL_SELECTOR)) {
            const current = instances.get(record.target);
            if (current && !structureIsIntact(current.structure)) setupControl(record.target);
          }
          record.addedNodes.forEach((node) => scanRoot(node));
        },
      );
    },
  );
  observer.observe(document.body, { childList: true, subtree: true });

  /**
   * Function contract: cleanupMotionScope
   * Purpose: Tear down dynamic discovery plus every interaction instance created for the current media-query capability scope.
   * Inputs: None.
   * Side effects: Disconnects the mutation observer, removes listeners, and kills GSAP work through each instance.
   * Returns: Undefined.
   */
  function cleanupMotionScope() {
    observer.disconnect();
    instances.forEach((instance) => instance.destroy());
    instances.clear();
  }

  return cleanupMotionScope;
}

/**
 * Function contract: destroyButtonMotion
 * Purpose: Tear down the current sitewide button motion capability scope so reinitialization or page lifecycle cleanup cannot leave duplicate listeners/tweens.
 * Inputs: None.
 * Side effects: Reverts GSAP matchMedia state and invokes registered cleanup callbacks.
 * Returns: Undefined.
 */
export function destroyButtonMotion() {
  activeTeardown?.();
  activeTeardown = null;
  initGeneration += 1;
}

/**
 * Function contract: initButtonMotion
 * Purpose: Initialize the pinned GSAP sitewide button interaction system with responsive pointer capability and reduced-motion branching.
 * Inputs: None; derives controls and user motion capabilities from the current document/browser.
 * Side effects: Loads GSAP dependencies, decorates interactive controls, registers matchMedia/DOM listeners, and logs a non-fatal diagnostic if enhancement loading fails.
 * Returns: Undefined; initialization continues asynchronously without blocking baseline site behavior.
 */
export function initButtonMotion() {
  destroyButtonMotion();
  const generation = initGeneration;

  loadGsapRuntime()
    .then(
      /** Callback contract: Build the responsive motion capability context after GSAP dependencies resolve. Inputs: `{ gsap, SplitText }`. Side effects: Registers matchMedia and page lifecycle cleanup. Returns: Undefined. */
      ({ gsap, SplitText }) => {
      if (generation !== initGeneration || !document.body) return;

      const matchMedia = gsap.matchMedia();
      matchMedia.add({
        canHover: '(hover: hover) and (pointer: fine)',
        reduce: '(prefers-reduced-motion: reduce)',
      },
      /** Callback contract: Initialize the control scope for the current pointer and reduced-motion conditions. Inputs: `context` - GSAP matchMedia context. Side effects: Toggles reduced-motion root state and creates control listeners/observer. Returns: Cleanup function for this capability state. */
      (context) => {
        const conditions = {
          canHover: Boolean(context.conditions?.canHover),
          reduce: Boolean(context.conditions?.reduce),
        };
        document.documentElement.classList.toggle('nrs-motion-reduced', conditions.reduce);
        return initializeMotionScope(gsap, SplitText, conditions);
      });

      /**
       * Function contract: teardown
       * Purpose: Revert the active media-query motion context and remove its page lifecycle listener.
       * Inputs: None.
       * Side effects: Tears down matchMedia/listeners and clears the root reduced-motion marker.
       * Returns: Undefined.
       */
      function teardown() {
        window.removeEventListener('pagehide', teardown);
        matchMedia.revert();
        document.documentElement.classList.remove('nrs-motion-reduced');
      };

      activeTeardown = teardown;
      window.addEventListener('pagehide', teardown, { once: true });
      },
    )
    .catch((error) => {
      console.warn('[portfolio] GSAP button motion enhancement unavailable; baseline controls remain active.', error);
    });
}
