/**
 * @fileoverview src/scripts/features/motion/button-motion.js
 * Purpose: Apply the refined GSAP hover and held-active interaction language to sitewide controls.
 * Responsibilities:
 * - Load pinned GSAP and SplitText as progressive enhancements without blocking native control behavior.
 * - Keep one authored label per control while layering pointer-origin fill, restrained character motion, glow, and impact feedback.
 * - Preserve pointer, touch, keyboard, reduced-motion, dynamic-content, and teardown behavior across routes.
 * Execution context: Browser ES module initialized by the production portfolio entrypoint after DOM readiness.
 * Connected files:
 * - src/scripts/entrypoints/portfolio-main.js
 * - src/scripts/entrypoints/interaction-motion.js
 * - src/styles/systems/interaction-motion.css
 * - src/scripts/features/forms/contact-form.js
 * Maintenance: Keep the authored control text as the only semantic label; generated visual layers must remain decorative.
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
const GENERATED_LAYER_SELECTOR = '.nrs-motion-fill, .nrs-motion-glow, .nrs-motion-impact, .nrs-motion-nav-dot';
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
 * Purpose: Load one pinned browser dependency exactly once and share an existing matching request.
 * Inputs: `source` - absolute dependency URL; `key` - stable dependency identifier.
 * Side effects: May append a script to document head and register one-time load/error listeners.
 * Returns: Promise that resolves when the script is ready.
 */
function loadExternalScript(source, key) {
  const selector = `script[data-nrs-motion-runtime="${key}"]`;
  const existing = document.querySelector(selector);
  if (existing?.dataset.loaded === 'true') return Promise.resolve();

  return new Promise(
    /** Callback contract: Resolve or reject one dependency request. Inputs: `resolve`, `reject`. Side effects: Registers script listeners and may append a script element. Returns: Undefined. */
    (resolve, reject) => {
      const script = existing || document.createElement('script');

      /** Function contract: onLoad. Purpose: Mark the dependency ready and resolve the pending request. Inputs: None. Side effects: Updates script dataset state. Returns: Undefined. */
      function onLoad() {
        script.dataset.loaded = 'true';
        resolve();
      }

      script.addEventListener('load', onLoad, { once: true });
      script.addEventListener('error', reject, { once: true });

      if (!existing) {
        script.src = source;
        script.async = true;
        script.crossOrigin = 'anonymous';
        script.dataset.nrsMotionRuntime = key;
        document.head.appendChild(script);
      }
    },
  );
}

/**
 * Function contract: resolveGsapRuntime
 * Purpose: Resolve the pinned GSAP core and optional SplitText enhancement used by the control motion system.
 * Inputs: None.
 * Side effects: May perform dependency network requests and register SplitText with GSAP.
 * Returns: Promise resolving to `{ gsap, SplitText }`.
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
 * Purpose: Reuse one in-flight or resolved GSAP dependency promise across repeated initialization attempts.
 * Inputs: None.
 * Side effects: Initializes or clears shared runtime promise state.
 * Returns: Promise resolving to the motion runtime.
 */
function loadGsapRuntime() {
  if (runtimePromise) return runtimePromise;
  runtimePromise = resolveGsapRuntime().catch(
    /** Callback contract: Reset failed shared runtime state before propagating the dependency error. Inputs: `error`. Side effects: Clears module runtime promise. Returns: Never; rethrows the original error. */
    (error) => {
      runtimePromise = null;
      throw error;
    },
  );
  return runtimePromise;
}

/**
 * Function contract: controlRole
 * Purpose: Classify a site control so the shared motion language can use the appropriate visual weight.
 * Inputs: `control` - candidate interactive HTMLElement.
 * Side effects: None.
 * Returns: `icon`, `nav`, `primary`, or `secondary`.
 */
function controlRole(control) {
  if (control.matches(ICON_ONLY_SELECTOR)) return 'icon';
  if (control.matches(NAV_SELECTOR)) return 'nav';
  if (control.matches(PRIMARY_SELECTOR)) return 'primary';
  return 'secondary';
}

/**
 * Function contract: isEligibleControl
 * Purpose: Reject hidden, inert, disabled, or explicitly opted-out controls before attaching motion behavior.
 * Inputs: `control` - candidate Element.
 * Side effects: Reads DOM attributes and ancestor state.
 * Returns: Boolean indicating whether the element should participate.
 */
function isEligibleControl(control) {
  if (!(control instanceof HTMLElement)) return false;
  if (control.matches('[data-motion="off"], [aria-hidden="true"]')) return false;
  if (control.closest('[aria-hidden="true"]')) return false;
  if ('disabled' in control && control.disabled) return false;
  return true;
}

/**
 * Function contract: createSpan
 * Purpose: Create one motion-system span with optional text content.
 * Inputs: `className` - CSS class string; `text` - optional text value.
 * Side effects: Creates a DOM node.
 * Returns: Newly created span element.
 */
function createSpan(className, text = '') {
  const node = document.createElement('span');
  node.className = className;
  if (text) node.textContent = text;
  return node;
}

/**
 * Function contract: meaningfulChildren
 * Purpose: Return direct child nodes that contribute authored visible control content.
 * Inputs: `control` - control or wrapper to inspect.
 * Side effects: Reads child nodes.
 * Returns: Array of meaningful text and element nodes.
 */
function meaningfulChildren(control) {
  return [...control.childNodes].filter(
    /** Callback contract: Decide whether a direct child contributes authored visible content. Inputs: `node`. Side effects: None. Returns: Boolean predicate. */
    (node) => {
      if (node.nodeType === Node.TEXT_NODE) return Boolean(node.textContent?.trim());
      return node.nodeType === Node.ELEMENT_NODE && !(node instanceof Element && node.matches(GENERATED_LAYER_SELECTOR));
    },
  );
}

/**
 * Function contract: createContentLayer
 * Purpose: Wrap the existing authored content without duplicating its semantic label and expose a label span when the source is simple text.
 * Inputs: `control` - control being decorated.
 * Side effects: Moves existing child nodes or replaces one text node with a single label span.
 * Returns: `{ content, label, icon }` references.
 */
function createContentLayer(control) {
  const existing = control.querySelector(':scope > .nrs-motion-content');
  if (existing) {
    return {
      content: existing,
      label: existing.querySelector('.nrs-motion-label'),
      icon: existing.querySelector('.nrs-motion-icon'),
    };
  }

  const content = createSpan('nrs-motion-content');
  const children = meaningfulChildren(control);
  let label = null;
  let icon = null;

  if (children.length === 1 && children[0].nodeType === Node.TEXT_NODE) {
    const sourceText = children[0].textContent || '';
    const arrowMatch = sourceText.match(/^(.*?)(\s*↗)\s*$/u);
    const labelText = (arrowMatch?.[1] ?? sourceText).trim();
    label = createSpan('nrs-motion-label', labelText);
    content.appendChild(label);
    if (arrowMatch) {
      icon = createSpan('nrs-motion-icon', '↗');
      icon.setAttribute('aria-hidden', 'true');
      content.appendChild(icon);
    }
    children[0].remove();
  } else {
    for (const node of children) content.appendChild(node);
    label = content.querySelector('.nrs-motion-label');
    icon = content.querySelector('.nrs-motion-icon');
  }

  control.appendChild(content);
  return { content, label, icon };
}

/**
 * Function contract: generatedLayer
 * Purpose: Return or create one aria-hidden visual layer directly beneath a decorated control.
 * Inputs: `control` - decorated control; `className` - generated layer class.
 * Side effects: May append an aria-hidden span.
 * Returns: Existing or newly created layer element.
 */
function generatedLayer(control, className) {
  const existing = control.querySelector(`:scope > .${className}`);
  if (existing) return existing;
  const layer = createSpan(className);
  layer.setAttribute('aria-hidden', 'true');
  control.appendChild(layer);
  return layer;
}

/**
 * Function contract: readStructure
 * Purpose: Rehydrate references from a control that has already been decorated by this motion system.
 * Inputs: `control` - previously decorated control.
 * Side effects: Reads generated DOM structure.
 * Returns: Structure object consumed by role-specific motion builders.
 */
function readStructure(control) {
  const role = control.dataset.nrsMotionRole || controlRole(control);
  if (role === 'icon') {
    return { control, role, content: control, label: null, icon: null, fill: null, glow: null, impact: null, dot: null };
  }

  const content = control.querySelector(':scope > .nrs-motion-content');
  return {
    control,
    role,
    content,
    label: content?.querySelector('.nrs-motion-label') || null,
    icon: content?.querySelector('.nrs-motion-icon') || null,
    fill: control.querySelector(':scope > .nrs-motion-fill'),
    glow: control.querySelector(':scope > .nrs-motion-glow'),
    impact: control.querySelector(':scope > .nrs-motion-impact'),
    dot: control.querySelector(':scope > .nrs-motion-nav-dot'),
  };
}

/**
 * Function contract: decorateControl
 * Purpose: Add reusable visual layers around an existing control while preserving exactly one authored semantic label.
 * Inputs: `control` - eligible interactive control.
 * Side effects: Adds role/data classes, wraps authored content, and appends decorative visual layers.
 * Returns: Decorated structure object.
 */
function decorateControl(control) {
  if (control.dataset.nrsMotionDecorated === 'true') return readStructure(control);

  const role = controlRole(control);
  control.classList.add('nrs-motion-control');
  control.dataset.nrsMotionRole = role;
  control.style.transitionProperty = 'color, background-color, border-color, box-shadow, opacity';
  if (window.getComputedStyle(control).position === 'static') control.style.position = 'relative';

  if (role === 'icon') {
    control.dataset.nrsMotionDecorated = 'true';
    return readStructure(control);
  }

  const { content, label, icon } = createContentLayer(control);
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
  return { control, role, content, label, icon, fill, glow, impact, dot };
}

/**
 * Function contract: structureIsIntact
 * Purpose: Detect when another feature has replaced a decorated control's children so motion can be safely rebuilt.
 * Inputs: `structure` - stored decorated structure.
 * Side effects: Reads DOM connectivity.
 * Returns: Boolean indicating whether the structure can still be reused.
 */
function structureIsIntact(structure) {
  if (!structure?.control?.isConnected) return false;
  if (structure.role === 'icon') return true;
  return Boolean(structure.content?.isConnected && structure.content.parentElement === structure.control);
}

/**
 * Function contract: pointIn
 * Purpose: Convert pointer or keyboard activation into local coordinates, normalized pointer intent, and radial fill scale.
 * Inputs: `event` - optional PointerEvent/KeyboardEvent-like object; `element` - target control.
 * Side effects: Reads one bounding client rectangle.
 * Returns: Local x/y, normalized nx/ny, and the scale required to cover the control.
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
    fillScale: Math.max(1, (radius * 2) / 76),
  };
}

/**
 * Function contract: isActivationKey
 * Purpose: Recognize the initial Enter/Space activation phase without key-repeat duplication.
 * Inputs: `event` - KeyboardEvent.
 * Side effects: None.
 * Returns: Boolean activation-key predicate.
 */
function isActivationKey(event) {
  return !event.repeat && (event.key === 'Enter' || event.key === ' ');
}

/**
 * Function contract: isActivationKeyUp
 * Purpose: Recognize the Enter/Space release phase for held active-state feedback.
 * Inputs: `event` - KeyboardEvent.
 * Side effects: None.
 * Returns: Boolean release-key predicate.
 */
function isActivationKeyUp(event) {
  return event.key === 'Enter' || event.key === ' ';
}

/**
 * Function contract: splitExistingLabel
 * Purpose: Split one existing label into characters while preserving accessible text and a whole-label fallback.
 * Inputs: `label` - label element; `SplitText` - optional plugin constructor.
 * Side effects: SplitText may replace label text with generated character spans until reverted.
 * Returns: SplitText instance or null.
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
 * Purpose: Apply pointer-origin fill, restrained character choreography, pointer intent, and held physical press feedback to CTA-style controls.
 * Inputs: `structure`, `gsap`, `SplitText`, `canHover`.
 * Side effects: Creates GSAP timelines/tweens and registers pointer/keyboard listeners.
 * Returns: Motion instance exposing `destroy`.
 */
function createPillMotion(structure, gsap, SplitText, canHover) {
  const { control, role, content, label, icon, fill, glow, impact } = structure;
  const split = splitExistingLabel(label, SplitText);
  const chars = split?.chars || [];
  const textTargets = chars.length ? chars : label ? [label] : [];
  const isPrimary = role === 'primary';
  const state = { hovered: false, pressed: false, pointerId: null };
  const hoverScale = isPrimary ? 1.009 : 1.006;
  const hoverY = isPrimary ? -2 : -1.25;
  const hoverForeground = window.getComputedStyle(control).getPropertyValue('--nrs-motion-hover-fg').trim() || (isPrimary ? '#ffffff' : '#f7f3eb');

  gsap.set(control, { x: 0, y: 0, scaleX: 1, scaleY: 1, transformOrigin: '50% 50%' });
  gsap.set(content, { x: 0, y: 0 });
  gsap.set(textTargets, { transformOrigin: '50% 70%', backfaceVisibility: 'hidden' });
  if (fill) gsap.set(fill, { scale: 0.001, x: -120, y: -120, transformOrigin: '50% 50%' });
  if (glow) gsap.set(glow, { opacity: 0, x: -160, y: -160 });
  if (impact) gsap.set(impact, { opacity: 0, scale: 0.35 });

  const hover = gsap.timeline({ paused: true, defaults: { overwrite: 'auto' } });
  hover.to(control, { color: hoverForeground, duration: 0.30, ease: 'power2.out' }, 0);
  if (textTargets.length) {
    hover
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
  if (icon) {
    hover.to(icon, {
      x: isPrimary ? 3.5 : 3,
      y: isPrimary ? -3.5 : -3,
      rotate: 4,
      scale: 1.045,
      duration: 0.34,
      ease: MOTION.hoverEase,
    }, 0.075);
  }

  const moveContentX = gsap.quickTo(content, 'x', { duration: 0.30, ease: 'power3.out' });
  const moveGlowX = glow ? gsap.quickTo(glow, 'x', { duration: 0.22, ease: 'power3.out' }) : null;
  const moveGlowY = glow ? gsap.quickTo(glow, 'y', { duration: 0.22, ease: 'power3.out' }) : null;

  /** Function contract: settleControl. Purpose: Resolve the outer control to the current hover/rest pose without interrupting a held press. Inputs: `immediate`. Side effects: Starts/replaces a GSAP transform tween. Returns: Undefined. */
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

  /** Function contract: enter. Purpose: Start hover choreography from the real pointer entry point. Inputs: `event`. Side effects: Updates state/classes and starts fill, glow, text, and transform tweens. Returns: Undefined. */
  function enter(event) {
    if (!canHover) return;
    state.hovered = true;
    control.classList.add('is-motion-hovered');
    const point = pointIn(event, control);

    if (fill) {
      gsap.set(fill, { x: point.x, y: point.y, scale: 0.001 });
      gsap.to(fill, {
        scale: point.fillScale * (isPrimary ? 1.08 : 1.04),
        duration: 0.52,
        ease: 'expo.out',
        overwrite: 'auto',
      });
    }
    if (glow) {
      gsap.set(glow, { x: point.x, y: point.y });
      gsap.to(glow, { opacity: 0.62, duration: 0.22, ease: 'power2.out', overwrite: 'auto' });
    }

    settleControl();
    hover.play();
  }

  /** Function contract: move. Purpose: Apply restrained high-frequency pointer intent to inner content and primary glow. Inputs: `event`. Side effects: Updates quickTo destinations. Returns: Undefined. */
  function move(event) {
    if (!canHover) return;
    const point = pointIn(event, control);
    moveContentX(point.nx * (isPrimary ? 1.7 : 1.1));
    if (moveGlowX && moveGlowY) {
      moveGlowX(point.x);
      moveGlowY(point.y);
    }
  }

  /** Function contract: leave. Purpose: Reverse hover choreography while preserving a held active state until release. Inputs: None. Side effects: Updates hover state and reverses active tweens. Returns: Undefined. */
  function leave() {
    if (!canHover) return;
    state.hovered = false;
    control.classList.remove('is-motion-hovered');
    moveContentX(0);
    if (fill) gsap.to(fill, { scale: 0.001, duration: 0.34, ease: 'power3.inOut', overwrite: 'auto' });
    if (glow) gsap.to(glow, { opacity: 0, duration: 0.18, ease: 'power2.out', overwrite: 'auto' });
    hover.reverse();
    settleControl();
  }

  /** Function contract: pressStart. Purpose: Enter the held physical active state at the actual pointer or keyboard activation point. Inputs: `event`. Side effects: Captures pointer when possible and starts compression/content/impact tweens. Returns: Undefined. */
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
        { x: point.x, y: point.y, scale: 0.35, opacity: 0.34 },
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

  /** Function contract: pressEnd. Purpose: Release the held active state back to the current hover/rest pose with controlled spring weight. Inputs: `event`. Side effects: Releases pointer capture and starts recovery tweens. Returns: Undefined. */
  function pressEnd(event) {
    if (!state.pressed) return;
    state.pressed = false;
    control.classList.remove('is-motion-pressed');

    const pointerId = event?.pointerId ?? state.pointerId;
    if (pointerId != null && control.releasePointerCapture && control.hasPointerCapture?.(pointerId)) {
      try {
        control.releasePointerCapture(pointerId);
      } catch {
        // Pointer capture may already have been released by cancellation.
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

  /** Function contract: keyDown. Purpose: Start held active feedback for Enter/Space without key-repeat duplication. Inputs: `event`. Side effects: Delegates to `pressStart`. Returns: Undefined. */
  function keyDown(event) {
    if (isActivationKey(event)) pressStart(event);
  }

  /** Function contract: keyUp. Purpose: Release held active feedback when Enter/Space is released. Inputs: `event`. Side effects: Delegates to `pressEnd`. Returns: Undefined. */
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
    /** Function contract: destroy. Purpose: Tear down one CTA interaction instance and revert SplitText. Inputs: None. Side effects: Kills GSAP work, removes state classes/listeners, and reverts split text. Returns: Undefined. */
    destroy() {
      hover.kill();
      split?.revert();
      gsap.killTweensOf([control, content, fill, glow, impact, icon, ...textTargets].filter(Boolean));
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
 * Purpose: Apply the smaller refined character lift, nav-dot response, and held compression used by navigation controls.
 * Inputs: `structure`, `gsap`, `SplitText`, `canHover`.
 * Side effects: Creates GSAP timeline/tweens and registers pointer/keyboard listeners.
 * Returns: Motion instance exposing `destroy`.
 */
function createNavMotion(structure, gsap, SplitText, canHover) {
  const { control, label, dot } = structure;
  const split = splitExistingLabel(label, SplitText);
  const chars = split?.chars || [];
  const textTargets = chars.length ? chars : label ? [label] : [];
  const state = { pressed: false, pointerId: null };

  gsap.set(control, { x: 0, y: 0, scaleX: 1, scaleY: 1, transformOrigin: '50% 50%' });
  if (dot) gsap.set(dot, { scale: 0, opacity: 0, y: 0 });

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
      opacity: 1,
      y: -1,
      duration: 0.26,
      ease: 'back.out(1.65)',
    }, 0.035);
  }

  /** Function contract: enter. Purpose: Play nav hover choreography for fine-pointer input. Inputs: None. Side effects: Starts the nav hover timeline. Returns: Undefined. */
  function enter() {
    if (canHover) hover.play();
  }

  /** Function contract: leave. Purpose: Reverse nav hover choreography for fine-pointer input. Inputs: None. Side effects: Reverses the nav hover timeline. Returns: Undefined. */
  function leave() {
    if (canHover) hover.reverse();
  }

  /** Function contract: pressStart. Purpose: Enter the held nav active state. Inputs: `event`. Side effects: Captures pointer when possible and starts compression. Returns: Undefined. */
  function pressStart(event) {
    if (state.pressed) return;
    if (event?.type === 'pointerdown' && event.button !== 0) return;
    state.pressed = true;
    state.pointerId = event?.pointerId ?? null;
    control.classList.add('is-motion-pressed');
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

  /** Function contract: pressEnd. Purpose: Release the held nav state with the refined spring recovery. Inputs: `event`. Side effects: Releases pointer capture and starts recovery. Returns: Undefined. */
  function pressEnd(event) {
    if (!state.pressed) return;
    state.pressed = false;
    control.classList.remove('is-motion-pressed');
    const pointerId = event?.pointerId ?? state.pointerId;
    if (pointerId != null && control.releasePointerCapture && control.hasPointerCapture?.(pointerId)) {
      try {
        control.releasePointerCapture(pointerId);
      } catch {
        // Browser may already have released pointer capture.
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

  /** Function contract: keyDown. Purpose: Start nav active feedback for Enter/Space. Inputs: `event`. Side effects: Delegates to `pressStart`. Returns: Undefined. */
  function keyDown(event) {
    if (isActivationKey(event)) pressStart(event);
  }

  /** Function contract: keyUp. Purpose: Release nav active feedback for Enter/Space. Inputs: `event`. Side effects: Delegates to `pressEnd`. Returns: Undefined. */
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
    /** Function contract: destroy. Purpose: Tear down one navigation interaction instance and revert SplitText. Inputs: None. Side effects: Kills GSAP work and removes listeners. Returns: Undefined. */
    destroy() {
      hover.kill();
      split?.revert();
      gsap.killTweensOf([control, dot, ...textTargets].filter(Boolean));
      control.classList.remove('is-motion-pressed');
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
 * Purpose: Give icon-only controls refined hover lift and held compression without altering their internal SVG/menu markup.
 * Inputs: `structure`, `gsap`, `canHover`.
 * Side effects: Registers pointer/keyboard listeners and starts GSAP transform tweens.
 * Returns: Motion instance exposing `destroy`.
 */
function createIconMotion(structure, gsap, canHover) {
  const { control } = structure;
  const state = { hovered: false, pressed: false, pointerId: null };
  gsap.set(control, { x: 0, y: 0, scaleX: 1, scaleY: 1, transformOrigin: '50% 50%' });

  /** Function contract: settle. Purpose: Resolve icon hover/rest pose without interrupting a held press. Inputs: None. Side effects: Starts/replaces a GSAP transform tween. Returns: Undefined. */
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

  /** Function contract: enter. Purpose: Enter icon hover state. Inputs: None. Side effects: Updates hover state and transform. Returns: Undefined. */
  function enter() {
    if (!canHover) return;
    state.hovered = true;
    settle();
  }

  /** Function contract: leave. Purpose: Leave icon hover state. Inputs: None. Side effects: Updates hover state and transform. Returns: Undefined. */
  function leave() {
    if (!canHover) return;
    state.hovered = false;
    settle();
  }

  /** Function contract: pressStart. Purpose: Enter the held icon active state. Inputs: `event`. Side effects: Captures pointer when possible and starts compression. Returns: Undefined. */
  function pressStart(event) {
    if (state.pressed) return;
    if (event?.type === 'pointerdown' && event.button !== 0) return;
    state.pressed = true;
    state.pointerId = event?.pointerId ?? null;
    control.classList.add('is-motion-pressed');
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

  /** Function contract: pressEnd. Purpose: Release the held icon state back to its current hover/rest pose. Inputs: `event`. Side effects: Releases pointer capture and starts recovery. Returns: Undefined. */
  function pressEnd(event) {
    if (!state.pressed) return;
    state.pressed = false;
    control.classList.remove('is-motion-pressed');
    const pointerId = event?.pointerId ?? state.pointerId;
    if (pointerId != null && control.releasePointerCapture && control.hasPointerCapture?.(pointerId)) {
      try {
        control.releasePointerCapture(pointerId);
      } catch {
        // Browser may already have released pointer capture.
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

  /** Function contract: keyDown. Purpose: Start icon active feedback for Enter/Space. Inputs: `event`. Side effects: Delegates to `pressStart`. Returns: Undefined. */
  function keyDown(event) {
    if (isActivationKey(event)) pressStart(event);
  }

  /** Function contract: keyUp. Purpose: Release icon active feedback for Enter/Space. Inputs: `event`. Side effects: Delegates to `pressEnd`. Returns: Undefined. */
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
    /** Function contract: destroy. Purpose: Tear down one icon interaction instance. Inputs: None. Side effects: Kills GSAP work and removes listeners. Returns: Undefined. */
    destroy() {
      gsap.killTweensOf(control);
      control.classList.remove('is-motion-pressed');
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
 * Purpose: Preserve immediate held active-state feedback for reduced-motion users without spatial choreography.
 * Inputs: `structure`, `gsap`.
 * Side effects: Registers pointer/keyboard listeners and starts short opacity tweens.
 * Returns: Motion instance exposing `destroy`.
 */
function createReducedMotion(structure, gsap) {
  const { control } = structure;
  let pressed = false;

  /** Function contract: pressStart. Purpose: Enter reduced-motion pressed feedback. Inputs: `event`. Side effects: Starts an opacity tween. Returns: Undefined. */
  function pressStart(event) {
    if (pressed) return;
    if (event?.type === 'pointerdown' && event.button !== 0) return;
    pressed = true;
    control.classList.add('is-motion-pressed');
    gsap.to(control, { opacity: 0.78, duration: 0.08, overwrite: 'auto' });
  }

  /** Function contract: pressEnd. Purpose: Release reduced-motion pressed feedback. Inputs: None. Side effects: Restores opacity. Returns: Undefined. */
  function pressEnd() {
    if (!pressed) return;
    pressed = false;
    control.classList.remove('is-motion-pressed');
    gsap.to(control, { opacity: 1, duration: 0.10, overwrite: 'auto' });
  }

  /** Function contract: keyDown. Purpose: Start reduced-motion feedback for Enter/Space. Inputs: `event`. Side effects: Delegates to `pressStart`. Returns: Undefined. */
  function keyDown(event) {
    if (isActivationKey(event)) pressStart(event);
  }

  /** Function contract: keyUp. Purpose: Release reduced-motion feedback for Enter/Space. Inputs: `event`. Side effects: Delegates to `pressEnd`. Returns: Undefined. */
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
    /** Function contract: destroy. Purpose: Tear down one reduced-motion interaction instance. Inputs: None. Side effects: Kills opacity tweens and removes listeners. Returns: Undefined. */
    destroy() {
      gsap.killTweensOf(control);
      control.classList.remove('is-motion-pressed');
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
 * Purpose: Route a decorated control to its role-appropriate full or reduced motion implementation.
 * Inputs: `structure`, `gsap`, `SplitText`, `conditions`.
 * Side effects: Delegates listener/tween setup to the selected implementation.
 * Returns: Motion instance exposing `destroy`.
 */
function createControlMotion(structure, gsap, SplitText, conditions) {
  if (conditions.reduce) return createReducedMotion(structure, gsap);
  if (structure.role === 'nav') return createNavMotion(structure, gsap, SplitText, conditions.canHover);
  if (structure.role === 'icon') return createIconMotion(structure, gsap, conditions.canHover);
  return createPillMotion(structure, gsap, SplitText, conditions.canHover);
}

/**
 * Function contract: initializeMotionScope
 * Purpose: Attach role-aware motion to current and future controls for one pointer/reduced-motion capability state.
 * Inputs: `gsap`, `SplitText`, `conditions`.
 * Side effects: Decorates controls, registers listeners, and starts a MutationObserver for dynamic content.
 * Returns: Cleanup function for the capability scope.
 */
function initializeMotionScope(gsap, SplitText, conditions) {
  const instances = new Map();

  /** Function contract: resetBrokenDecoration. Purpose: Remove stale generated layers when another feature replaced a decorated control's content. Inputs: `control`. Side effects: Mutates control children/data state. Returns: Undefined. */
  function resetBrokenDecoration(control) {
    for (const node of control.querySelectorAll(`:scope > ${GENERATED_LAYER_SELECTOR.split(', ').join(', :scope > ')}`)) {
      node.remove();
    }
    delete control.dataset.nrsMotionDecorated;
  }

  /** Function contract: setupControl. Purpose: Decorate and initialize one eligible control, rebuilding stale dynamic content when necessary. Inputs: `control`. Side effects: May destroy stale motion, mutate control structure, and attach listeners/tweens. Returns: Undefined. */
  function setupControl(control) {
    if (!isEligibleControl(control)) return;

    const current = instances.get(control);
    if (current && structureIsIntact(current.structure)) return;
    if (current) {
      current.destroy();
      instances.delete(control);
    }

    if (control.dataset.nrsMotionDecorated === 'true') {
      const structure = readStructure(control);
      if (!structureIsIntact(structure)) resetBrokenDecoration(control);
    }

    const structure = decorateControl(control);
    instances.set(control, createControlMotion(structure, gsap, SplitText, conditions));
  }

  /** Function contract: scanRoot. Purpose: Discover matching controls within one newly added DOM root. Inputs: `root`. Side effects: Calls `setupControl` for matching controls. Returns: Undefined. */
  function scanRoot(root) {
    if (!(root instanceof Element)) return;
    if (root.matches(CONTROL_SELECTOR)) setupControl(root);
    for (const control of root.querySelectorAll(CONTROL_SELECTOR)) setupControl(control);
  }

  for (const control of document.querySelectorAll(CONTROL_SELECTOR)) setupControl(control);

  const observer = new MutationObserver(
    /** Callback contract: Rebuild controls whose content was replaced and initialize newly inserted controls. Inputs: `records`. Side effects: May destroy/recreate motion instances and scan added DOM. Returns: Undefined. */
    (records) => {
      for (const record of records) {
        if (record.target instanceof Element) {
          const owner = record.target.matches(CONTROL_SELECTOR) ? record.target : record.target.closest(CONTROL_SELECTOR);
          const current = owner ? instances.get(owner) : null;
          if (current && !structureIsIntact(current.structure)) setupControl(owner);
        }
        for (const node of record.addedNodes) scanRoot(node);
      }
    },
  );
  observer.observe(document.body, { childList: true, subtree: true });

  /** Function contract: cleanupMotionScope. Purpose: Tear down dynamic discovery and all interaction instances in the current media capability scope. Inputs: None. Side effects: Disconnects observer and destroys motion instances. Returns: Undefined. */
  function cleanupMotionScope() {
    observer.disconnect();
    for (const instance of instances.values()) instance.destroy();
    instances.clear();
  }

  return cleanupMotionScope;
}

/**
 * Function contract: destroyButtonMotion
 * Purpose: Tear down the active sitewide button motion scope so reinitialization cannot leave duplicate listeners or tweens.
 * Inputs: None.
 * Side effects: Reverts GSAP matchMedia state and invalidates pending initialization.
 * Returns: Undefined.
 */
export function destroyButtonMotion() {
  activeTeardown?.();
  activeTeardown = null;
  initGeneration += 1;
}

/**
 * Function contract: initButtonMotion
 * Purpose: Initialize the refined sitewide GSAP button interaction system with pointer capability and reduced-motion branching.
 * Inputs: None.
 * Side effects: Loads GSAP dependencies, decorates controls, registers media/DOM listeners, and logs non-fatal enhancement failures.
 * Returns: Undefined; initialization continues asynchronously.
 */
export function initButtonMotion() {
  destroyButtonMotion();
  const generation = initGeneration;

  loadGsapRuntime()
    .then(
      /** Callback contract: Build the responsive motion capability context after GSAP dependencies resolve. Inputs: `runtime`. Side effects: Registers matchMedia and page lifecycle cleanup. Returns: Undefined. */
      ({ gsap, SplitText }) => {
        if (generation !== initGeneration || !document.body) return;

        const matchMedia = gsap.matchMedia();
        matchMedia.add({
          canHover: '(hover: hover) and (pointer: fine)',
          reduce: '(prefers-reduced-motion: reduce)',
        },
        /** Callback contract: Initialize controls for current pointer and reduced-motion conditions. Inputs: `context`. Side effects: Toggles reduced-motion root state and creates listeners/observer. Returns: Cleanup function. */
        (context) => {
          const conditions = {
            canHover: Boolean(context.conditions?.canHover),
            reduce: Boolean(context.conditions?.reduce),
          };
          document.documentElement.classList.toggle('nrs-motion-reduced', conditions.reduce);
          return initializeMotionScope(gsap, SplitText, conditions);
        });

        /** Function contract: teardown. Purpose: Revert the active media-query motion context and remove its page lifecycle listener. Inputs: None. Side effects: Tears down matchMedia/listeners and clears root state. Returns: Undefined. */
        function teardown() {
          window.removeEventListener('pagehide', teardown);
          matchMedia.revert();
          document.documentElement.classList.remove('nrs-motion-reduced');
        }

        activeTeardown = teardown;
        window.addEventListener('pagehide', teardown, { once: true });
      },
    )
    .catch(
      /** Callback contract: Report a non-fatal progressive-enhancement failure while leaving native controls usable. Inputs: `error`. Side effects: Writes a console warning. Returns: Undefined. */
      (error) => {
        console.warn('[portfolio] GSAP button motion enhancement unavailable; baseline controls remain active.', error);
      },
    );
}
