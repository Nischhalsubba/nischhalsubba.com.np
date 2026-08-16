/**
 * @fileoverview src/scripts/features/motion/refined-button-motion.js
 * Purpose: Apply the approved refined GSAP hover and held-active interaction language to every shared portfolio control family used by the final production templates.
 * Responsibilities:
 * - Load pinned GSAP 3.15 and SplitText as progressive enhancements without blocking native control behavior.
 * - Preserve one semantic source label while layering pointer-origin fill, restrained character motion, pointer intent, glow, and impact feedback.
 * - Cover legacy `.btn` controls plus the final `.nrs-uploaded-btn` and `.agent-btn` CTA families without requiring page-local listeners.
 * - Preserve pointer, touch, keyboard, reduced-motion, dynamic-content, and teardown behavior across route transitions.
 * Execution context: Browser ES module initialized by the production portfolio entrypoint after DOM readiness.
 * Connected files:
 * - src/scripts/entrypoints/portfolio-main.js
 * - src/scripts/entrypoints/interaction-motion.js
 * - src/styles/systems/interaction-motion.css
 * - scripts/browser-button-motion-audit.mjs
 * Maintenance: Keep authored control text as the only semantic label; generated visual layers must remain decorative and lifecycle-safe.
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
  '.nrs-uploaded-btn',
  '.agent-btn',
  '.footer-email-btn',
  '.floating-resume-btn',
  '.filter-btn',
  '.link-pill',
  '.nav-link',
  '.mobile-nav-links a',
  '.mobile-logo',
].join(',');
const NAV_SELECTOR = '.nav-link, .mobile-nav-links a, .mobile-logo';
const PRIMARY_SELECTOR = '.btn-primary, .footer-email-btn, .nrs-uploaded-btn-primary, .agent-btn--primary';
const ICON_ONLY_SELECTOR = '.theme-toggle-btn, .mobile-nav-toggle, .agent-mobile-theme-toggle';
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

  /**
   * Function contract: dependencyExecutor
   * Purpose: Resolve or reject one dependency request while reusing an existing matching script when available.
   * Inputs: `resolve`, `reject` - Promise settlement callbacks.
   * Side effects: Registers script listeners and may append a script element to document head.
   * Returns: Undefined; settles the enclosing Promise.
   */
  function dependencyExecutor(resolve, reject) {
    const script = existing || document.createElement('script');

    /**
     * Function contract: dependencyLoaded
     * Purpose: Mark the dependency ready before resolving its pending request.
     * Inputs: None.
     * Side effects: Updates script dataset state and resolves the enclosing Promise.
     * Returns: Undefined.
     */
    function dependencyLoaded() {
      script.dataset.loaded = 'true';
      resolve();
    }

    script.addEventListener('load', dependencyLoaded, { once: true });
    script.addEventListener('error', reject, { once: true });

    if (!existing) {
      script.src = source;
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.dataset.nrsMotionRuntime = key;
      document.head.appendChild(script);
    }
  }

  return new Promise(dependencyExecutor);
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
 * Function contract: resetRuntimePromise
 * Purpose: Clear failed shared dependency state before propagating the original initialization error.
 * Inputs: `error` - dependency initialization error.
 * Side effects: Clears the module-level runtime Promise reference.
 * Returns: Never; rethrows the supplied error.
 */
function resetRuntimePromise(error) {
  runtimePromise = null;
  throw error;
}

/**
 * Function contract: loadGsapRuntime
 * Purpose: Reuse one in-flight or resolved GSAP dependency Promise across repeated initialization attempts.
 * Inputs: None.
 * Side effects: Initializes shared runtime Promise state when needed.
 * Returns: Promise resolving to the motion runtime.
 */
function loadGsapRuntime() {
  if (runtimePromise) return runtimePromise;
  runtimePromise = resolveGsapRuntime().catch(resetRuntimePromise);
  return runtimePromise;
}

/**
 * Function contract: controlRole
 * Purpose: Classify one shared control so the motion system can apply the appropriate interaction weight.
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
 * Purpose: Reject hidden, disabled, or explicitly opted-out controls before attaching motion behavior.
 * Inputs: `control` - candidate Element.
 * Side effects: Reads element and ancestor DOM state.
 * Returns: Boolean indicating whether the control should participate.
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
 * Side effects: Creates a DOM element.
 * Returns: Newly created span element.
 */
function createSpan(className, text = '') {
  const node = document.createElement('span');
  node.className = className;
  if (text) node.textContent = text;
  return node;
}

/**
 * Function contract: isGeneratedLayer
 * Purpose: Identify visual layers previously generated by this motion system so authored content discovery does not treat them as source content.
 * Inputs: `node` - candidate direct child node.
 * Side effects: None.
 * Returns: Boolean generated-layer predicate.
 */
function isGeneratedLayer(node) {
  return node instanceof Element && node.matches(GENERATED_LAYER_SELECTOR);
}

/**
 * Function contract: meaningfulChildren
 * Purpose: Return direct child nodes that contribute authored visible control content.
 * Inputs: `control` - control or wrapper to inspect.
 * Side effects: Reads child nodes.
 * Returns: Array of meaningful text and element nodes.
 */
function meaningfulChildren(control) {
  const result = [];
  for (const node of control.childNodes) {
    if (node.nodeType === Node.TEXT_NODE) {
      if (node.textContent?.trim()) result.push(node);
      continue;
    }
    if (node.nodeType === Node.ELEMENT_NODE && !isGeneratedLayer(node)) result.push(node);
  }
  return result;
}

/**
 * Function contract: isDecorativeArrow
 * Purpose: Recognize the simple aria-hidden arrow span used by final homepage CTA markup so it can become the visual motion icon without duplication.
 * Inputs: `node` - candidate authored element.
 * Side effects: Reads element attributes/text.
 * Returns: Boolean decorative-arrow predicate.
 */
function isDecorativeArrow(node) {
  if (!(node instanceof HTMLElement)) return false;
  if (node.getAttribute('aria-hidden') !== 'true') return false;
  const text = (node.textContent || '').replace(/\s+/g, '').trim();
  return text === '↗' || text === '→';
}

/**
 * Function contract: createContentLayer
 * Purpose: Wrap existing authored control content without duplicating its semantic label and expose one label plus optional decorative arrow for refined choreography.
 * Inputs: `control` - control being decorated.
 * Side effects: Moves existing child nodes, may replace one direct text node with one label span, and may classify an authored arrow span as the visual icon.
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
  const textNodes = [];
  const elementNodes = [];

  for (const node of children) {
    if (node.nodeType === Node.TEXT_NODE) textNodes.push(node);
    else if (node.nodeType === Node.ELEMENT_NODE) elementNodes.push(node);
  }

  const optionalArrow = elementNodes.length === 1 && isDecorativeArrow(elementNodes[0]) ? elementNodes[0] : null;
  const canNormalizeLabel = textNodes.length === 1 && (elementNodes.length === 0 || optionalArrow);
  let label = null;
  let icon = null;

  if (canNormalizeLabel) {
    label = createSpan('nrs-motion-label', textNodes[0].textContent?.trim() || '');
    content.appendChild(label);
    textNodes[0].remove();

    if (optionalArrow) {
      icon = optionalArrow;
      icon.classList.add('nrs-motion-icon');
      content.appendChild(icon);
    }
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
  control.style.setProperty('transition-property', 'color, background-color, border-color, box-shadow, opacity');
  if (window.getComputedStyle(control).position === 'static') control.style.position = 'relative';

  if (role === 'icon') {
    control.dataset.nrsMotionDecorated = 'true';
    return readStructure(control);
  }

  const contentStructure = createContentLayer(control);
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
  return {
    control,
    role,
    content: contentStructure.content,
    label: contentStructure.label,
    icon: contentStructure.icon,
    fill,
    glow,
    impact,
    dot,
  };
}

/**
 * Function contract: structureIsIntact
 * Purpose: Detect when another feature has replaced a decorated control's children so motion can be safely rebuilt around current content.
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
 * Inputs: `structure` - decorated CTA structure; `gsap` - GSAP runtime; `SplitText` - optional plugin; `canHover` - fine-pointer capability.
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
  const hoverForeground = isPrimary ? '#ffffff' : '#f7f3eb';

  gsap.set(control, { x: 0, y: 0, scaleX: 1, scaleY: 1, transformOrigin: '50% 50%' });
  gsap.set(content, { x: 0, y: 0 });
  gsap.set(textTargets, { transformOrigin: '50% 70%', backfaceVisibility: 'hidden' });
  if (fill) gsap.set(fill, { scale: 0.001, x: -120, y: -120, transformOrigin: '50% 50%' });
  if (glow) gsap.set(glow, { opacity: 0, x: -160, y: -160 });
  if (impact) gsap.set(impact, { opacity: 0, scale: 0.35 });

  const hover = gsap.timeline({ paused: true, defaults: { overwrite: 'auto' } });
  hover.to(content, { color: hoverForeground, duration: 0.30, ease: 'power2.out' }, 0);
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

  /**
   * Function contract: settleControl
   * Purpose: Resolve the outer CTA to its current hover/rest pose without interrupting a held press.
   * Inputs: `immediate` - whether to resolve without interpolation.
   * Side effects: Starts or replaces a GSAP transform tween on the control.
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
   * Purpose: Start hover choreography from the real pointer entry point.
   * Inputs: `event` - PointerEvent-like entry event.
   * Side effects: Updates state/classes and starts fill, glow, text, icon, and transform tweens.
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

  /**
   * Function contract: move
   * Purpose: Apply restrained high-frequency pointer intent to inner content and primary glow.
   * Inputs: `event` - PointerEvent.
   * Side effects: Updates quickTo destinations without moving the native hit target.
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
   * Purpose: Reverse hover choreography while preserving a held active state until release.
   * Inputs: None.
   * Side effects: Updates hover state and reverses active tweens.
   * Returns: Undefined.
   */
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

  /**
   * Function contract: pressStart
   * Purpose: Enter the held physical active state at the actual pointer or keyboard activation point.
   * Inputs: `event` - PointerEvent/KeyboardEvent-like activation event.
   * Side effects: Captures pointer when possible and starts compression/content/impact tweens.
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

  /**
   * Function contract: keyDown
   * Purpose: Start held CTA active feedback for Enter/Space without key-repeat duplication.
   * Inputs: `event` - KeyboardEvent.
   * Side effects: Delegates to `pressStart` when applicable.
   * Returns: Undefined.
   */
  function keyDown(event) {
    if (isActivationKey(event)) pressStart(event);
  }

  /**
   * Function contract: keyUp
   * Purpose: Release held CTA active feedback when Enter/Space is released.
   * Inputs: `event` - KeyboardEvent.
   * Side effects: Delegates to `pressEnd` when applicable.
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

  /**
   * Function contract: destroy
   * Purpose: Tear down one CTA interaction instance and revert SplitText.
   * Inputs: None.
   * Side effects: Kills GSAP work, removes state classes/listeners, and reverts split text.
   * Returns: Undefined.
   */
  function destroy() {
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
  }

  return { structure, destroy };
}

/**
 * Function contract: createNavMotion
 * Purpose: Apply the smaller refined character lift, nav-dot response, and held compression used by navigation controls.
 * Inputs: `structure` - decorated nav structure; `gsap` - GSAP runtime; `SplitText` - optional plugin; `canHover` - fine-pointer capability.
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

  /**
   * Function contract: pressStart
   * Purpose: Enter the held navigation active state.
   * Inputs: `event` - PointerEvent/KeyboardEvent-like activation event.
   * Side effects: Captures pointer when possible and starts compression.
   * Returns: Undefined.
   */
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

  /**
   * Function contract: pressEnd
   * Purpose: Release the held navigation state with refined spring recovery.
   * Inputs: `event` - optional PointerEvent-like release event.
   * Side effects: Releases pointer capture and starts recovery.
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

  /** Function contract: destroy. Purpose: Tear down one navigation interaction instance and revert SplitText. Inputs: None. Side effects: Kills GSAP work and removes listeners. Returns: Undefined. */
  function destroy() {
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
  }

  return { structure, destroy };
}

/**
 * Function contract: createIconMotion
 * Purpose: Give icon-only controls refined hover lift and held compression without altering their internal SVG/menu markup.
 * Inputs: `structure` - icon control structure; `gsap` - GSAP runtime; `canHover` - fine-pointer capability.
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

  /**
   * Function contract: pressStart
   * Purpose: Enter the held icon active state.
   * Inputs: `event` - PointerEvent/KeyboardEvent-like activation event.
   * Side effects: Captures pointer when possible and starts compression.
   * Returns: Undefined.
   */
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

  /**
   * Function contract: pressEnd
   * Purpose: Release the held icon state back to its current hover/rest pose.
   * Inputs: `event` - optional PointerEvent-like release event.
   * Side effects: Releases pointer capture and starts recovery.
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

  /** Function contract: destroy. Purpose: Tear down one icon interaction instance. Inputs: None. Side effects: Kills GSAP work and removes listeners. Returns: Undefined. */
  function destroy() {
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
  }

  return { structure, destroy };
}

/**
 * Function contract: createReducedMotion
 * Purpose: Preserve immediate held active-state feedback for reduced-motion users without spatial choreography.
 * Inputs: `structure` - decorated control; `gsap` - GSAP runtime.
 * Side effects: Registers pointer/keyboard listeners and starts short opacity tweens.
 * Returns: Motion instance exposing `destroy`.
 */
function createReducedMotion(structure, gsap) {
  const { control } = structure;
  let pressed = false;

  /** Function contract: pressStart. Purpose: Enter reduced-motion pressed feedback. Inputs: `event`. Side effects: Starts an opacity tween and state class. Returns: Undefined. */
  function pressStart(event) {
    if (pressed) return;
    if (event?.type === 'pointerdown' && event.button !== 0) return;
    pressed = true;
    control.classList.add('is-motion-pressed');
    gsap.to(control, { opacity: 0.78, duration: 0.08, overwrite: 'auto' });
  }

  /** Function contract: pressEnd. Purpose: Release reduced-motion pressed feedback. Inputs: None. Side effects: Restores opacity and state class. Returns: Undefined. */
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

  /** Function contract: destroy. Purpose: Tear down one reduced-motion interaction instance. Inputs: None. Side effects: Kills opacity tweens and removes listeners. Returns: Undefined. */
  function destroy() {
    gsap.killTweensOf(control);
    control.classList.remove('is-motion-pressed');
    control.removeEventListener('pointerdown', pressStart);
    control.removeEventListener('pointerup', pressEnd);
    control.removeEventListener('pointercancel', pressEnd);
    control.removeEventListener('keydown', keyDown);
    control.removeEventListener('keyup', keyUp);
    control.removeEventListener('blur', pressEnd);
  }

  return { structure, destroy };
}

/**
 * Function contract: createControlMotion
 * Purpose: Route a decorated control to its role-appropriate full or reduced motion implementation.
 * Inputs: `structure`, `gsap`, `SplitText`, `conditions` - decorated structure, runtime, plugin, and media capability state.
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
 * Inputs: `gsap`, `SplitText`, `conditions` - runtime, plugin, and media capability state.
 * Side effects: Decorates controls, registers listeners, and starts a MutationObserver for dynamic content.
 * Returns: Cleanup function for the capability scope.
 */
function initializeMotionScope(gsap, SplitText, conditions) {
  const instances = new Map();

  /**
   * Function contract: resetBrokenDecoration
   * Purpose: Remove stale generated layers when another feature replaced a decorated control's content.
   * Inputs: `control` - stale decorated control.
   * Side effects: Mutates control children and dataset state.
   * Returns: Undefined.
   */
  function resetBrokenDecoration(control) {
    const layers = control.querySelectorAll(':scope > .nrs-motion-fill, :scope > .nrs-motion-glow, :scope > .nrs-motion-impact, :scope > .nrs-motion-nav-dot');
    for (const node of layers) node.remove();
    delete control.dataset.nrsMotionDecorated;
  }

  /**
   * Function contract: setupControl
   * Purpose: Decorate and initialize one eligible control, rebuilding stale dynamic content when necessary.
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

    if (control.dataset.nrsMotionDecorated === 'true') {
      const stored = readStructure(control);
      if (!structureIsIntact(stored)) resetBrokenDecoration(control);
    }

    const structure = decorateControl(control);
    instances.set(control, createControlMotion(structure, gsap, SplitText, conditions));
  }

  /**
   * Function contract: scanRoot
   * Purpose: Discover matching controls within one newly added DOM root.
   * Inputs: `root` - Element-like added DOM root.
   * Side effects: Calls `setupControl` for matching controls.
   * Returns: Undefined.
   */
  function scanRoot(root) {
    if (!(root instanceof Element)) return;
    if (root.matches(CONTROL_SELECTOR)) setupControl(root);
    for (const control of root.querySelectorAll(CONTROL_SELECTOR)) setupControl(control);
  }

  /**
   * Function contract: onMutations
   * Purpose: Rebuild controls whose content was replaced and initialize controls inserted after initial page setup.
   * Inputs: `records` - MutationRecord list.
   * Side effects: May destroy/recreate motion instances and scan added DOM.
   * Returns: Undefined.
   */
  function onMutations(records) {
    for (const record of records) {
      if (record.target instanceof Element) {
        const owner = record.target.matches(CONTROL_SELECTOR) ? record.target : record.target.closest(CONTROL_SELECTOR);
        const current = owner ? instances.get(owner) : null;
        if (current && !structureIsIntact(current.structure)) setupControl(owner);
      }
      for (const node of record.addedNodes) scanRoot(node);
    }
  }

  for (const control of document.querySelectorAll(CONTROL_SELECTOR)) setupControl(control);

  const observer = new MutationObserver(onMutations);
  observer.observe(document.body, { childList: true, subtree: true });

  /**
   * Function contract: cleanupMotionScope
   * Purpose: Tear down dynamic discovery and all interaction instances in the current media capability scope.
   * Inputs: None.
   * Side effects: Disconnects observer and destroys motion instances.
   * Returns: Undefined.
   */
  function cleanupMotionScope() {
    observer.disconnect();
    for (const instance of instances.values()) instance.destroy();
    instances.clear();
  }

  return cleanupMotionScope;
}

/**
 * Function contract: destroyRefinedButtonMotion
 * Purpose: Tear down the active sitewide refined button motion scope so reinitialization cannot leave duplicate listeners or tweens.
 * Inputs: None.
 * Side effects: Reverts GSAP matchMedia state and invalidates pending initialization.
 * Returns: Undefined.
 */
export function destroyRefinedButtonMotion() {
  activeTeardown?.();
  activeTeardown = null;
  initGeneration += 1;
}

/**
 * Function contract: applyMediaConditions
 * Purpose: Initialize controls for the current pointer and reduced-motion capability state supplied by GSAP matchMedia.
 * Inputs: `context`, `gsap`, `SplitText` - matchMedia context, runtime, and optional plugin.
 * Side effects: Toggles reduced-motion root state and creates control listeners/observer.
 * Returns: Cleanup function for the media capability state.
 */
function applyMediaConditions(context, gsap, SplitText) {
  const conditions = {
    canHover: Boolean(context.conditions?.canHover),
    reduce: Boolean(context.conditions?.reduce),
  };
  document.documentElement.classList.toggle('nrs-motion-reduced', conditions.reduce);
  return initializeMotionScope(gsap, SplitText, conditions);
}

/**
 * Function contract: initRefinedButtonMotion
 * Purpose: Initialize the approved sitewide GSAP button interaction system with pointer capability and reduced-motion branching.
 * Inputs: None.
 * Side effects: Loads GSAP dependencies, decorates controls, registers media/DOM listeners, and logs non-fatal enhancement failures.
 * Returns: Undefined; initialization continues asynchronously.
 */
export function initRefinedButtonMotion() {
  destroyRefinedButtonMotion();
  const generation = initGeneration;

  /**
   * Function contract: runtimeReady
   * Purpose: Build the responsive motion capability context after GSAP dependencies resolve.
   * Inputs: `runtime` - resolved `{ gsap, SplitText }` dependency object.
   * Side effects: Registers matchMedia and page lifecycle cleanup.
   * Returns: Undefined.
   */
  function runtimeReady(runtime) {
    if (generation !== initGeneration || !document.body) return;
    const { gsap, SplitText } = runtime;
    const matchMedia = gsap.matchMedia();

    /**
     * Function contract: mediaContext
     * Purpose: Bridge GSAP matchMedia context into the shared refined-control initializer.
     * Inputs: `context` - GSAP matchMedia context.
     * Side effects: Delegates media capability setup to `applyMediaConditions`.
     * Returns: Cleanup function for the current media state.
     */
    function mediaContext(context) {
      return applyMediaConditions(context, gsap, SplitText);
    }

    matchMedia.add({
      canHover: '(hover: hover) and (pointer: fine)',
      reduce: '(prefers-reduced-motion: reduce)',
    }, mediaContext);

    /**
     * Function contract: teardown
     * Purpose: Revert the active media-query motion context and remove its page lifecycle listener.
     * Inputs: None.
     * Side effects: Tears down matchMedia/listeners and clears root reduced-motion state.
     * Returns: Undefined.
     */
    function teardown() {
      window.removeEventListener('pagehide', teardown);
      matchMedia.revert();
      document.documentElement.classList.remove('nrs-motion-reduced');
    }

    activeTeardown = teardown;
    window.addEventListener('pagehide', teardown, { once: true });
  }

  /**
   * Function contract: runtimeFailed
   * Purpose: Report a non-fatal progressive-enhancement failure while leaving native controls usable.
   * Inputs: `error` - dependency or initialization error.
   * Side effects: Writes a console warning.
   * Returns: Undefined.
   */
  function runtimeFailed(error) {
    console.warn('[portfolio] Refined GSAP button motion enhancement unavailable; baseline controls remain active.', error);
  }

  loadGsapRuntime().then(runtimeReady).catch(runtimeFailed);
}
