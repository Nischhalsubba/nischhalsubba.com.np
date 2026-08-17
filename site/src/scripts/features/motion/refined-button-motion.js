/**
 * @fileoverview src/scripts/features/motion/refined-button-motion.js
 * Purpose: Own the sitewide GSAP interaction language for button-like portfolio controls across mouse, touch, keyboard, reduced-motion, and dynamically generated UI.
 * Responsibilities:
 * - Discover semantic buttons and button-like links independently of one brittle class whitelist.
 * - Load pinned GSAP 3.15 and SplitText from same-origin production routes with a CDN fallback for local development.
 * - Apply pointer-origin fill, restrained label motion, hover intent, held compression, and release physics without changing native activation behavior.
 * - Initialize controls even when they begin inside hidden navigation and rebuild motion safely when dynamic content replaces control children.
 * - Keep one lifecycle owner so reinitialization, media changes, and page teardown cannot leave duplicate listeners or dead decorations.
 * Execution context: Browser ES module initialized by the production portfolio entrypoint after DOM readiness.
 * Connected files:
 * - src/scripts/entrypoints/portfolio-main.js
 * - src/scripts/entrypoints/interaction-motion.js
 * - src/styles/systems/interaction-motion.css
 * - scripts/browser-button-motion-audit.mjs
 * - scripts/finalize-refined-button-motion.cjs
 * Maintenance: Add new control families through the semantic discovery helpers, not route-local animation listeners.
 */

const GSAP_VERSION = '3.15.0';
const PRODUCTION_HOSTS = new Set(['nischhalsubba.com.np', 'www.nischhalsubba.com.np']);
const USE_SAME_ORIGIN_RUNTIME = PRODUCTION_HOSTS.has(window.location.hostname);
const GSAP_SOURCE = USE_SAME_ORIGIN_RUNTIME
  ? `/runtime/gsap/gsap-${GSAP_VERSION}.min.js`
  : `https://cdn.jsdelivr.net/npm/gsap@${GSAP_VERSION}/dist/gsap.min.js`;
const SPLIT_TEXT_SOURCE = USE_SAME_ORIGIN_RUNTIME
  ? `/runtime/gsap/SplitText-${GSAP_VERSION}.min.js`
  : `https://cdn.jsdelivr.net/npm/gsap@${GSAP_VERSION}/dist/SplitText.min.js`;

const DISCOVERY_SELECTOR = 'button, [role="button"], a[href]';
const EXPLICIT_LINK_CONTROL_SELECTOR = [
  'a.btn',
  'a.btn-primary',
  'a.btn-secondary',
  '.resume-btn',
  '.cta-button',
  '.cta-link',
  '.footer-cta',
  '.link-pill',
  '.download-resume',
  '.project-filter',
  '.filter-btn',
  '.nrs-uploaded-btn',
  '.agent-btn',
  '.footer-email-btn',
  '.floating-resume-btn',
  '.nav-link',
  '.quick-nav-list a',
  '.bottom-nav a',
  '.footer-nav a',
  '.social-link',
  '.mobile-nav-links a',
  '.mobile-logo',
  '.agent-mobile-brand',
].join(',');
const NAV_SELECTOR = [
  '.nav-link',
  '.quick-nav-list a',
  '.bottom-nav a',
  '.footer-nav a',
  '.mobile-nav-links a',
  '.mobile-logo',
  '.agent-mobile-brand',
].join(',');
const PRIMARY_SELECTOR = [
  '.btn-primary',
  '.footer-email-btn',
  '.nrs-uploaded-btn-primary',
  '.agent-btn--primary',
  '[data-motion-role="primary"]',
].join(',');
const ICON_ONLY_SELECTOR = [
  '.theme-toggle-btn',
  '.mobile-nav-toggle',
  '.agent-mobile-theme-toggle',
  '.hamburger',
  '.menu-close',
  '.back-to-top',
  '[data-theme-toggle]',
].join(',');
const GENERATED_LAYER_SELECTOR = '.nrs-motion-fill, .nrs-motion-glow, .nrs-motion-impact, .nrs-motion-nav-dot';
const BUTTONISH_CLASS_PATTERN = /(?:^|[-_])(btn|button|cta)(?:[-_]|$)/i;
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
 * Inputs: `source` - dependency URL; `key` - stable dependency identifier.
 * Side effects: May append a script element and register one-time load/error listeners.
 * Returns: Promise resolving when the dependency script has loaded.
 */
function loadExternalScript(source, key) {
  const selector = `script[data-nrs-motion-runtime="${key}"]`;
  const existing = document.querySelector(selector);
  if (existing?.dataset.loaded === 'true') return Promise.resolve();

  /**
   * Function contract: dependencyExecutor
   * Purpose: Settle one dependency request while reusing an existing matching script when possible.
   * Inputs: `resolve`, `reject` - Promise settlement callbacks.
   * Side effects: Registers script listeners and may append the script to document head.
   * Returns: Undefined; settles the enclosing Promise asynchronously.
   */
  function dependencyExecutor(resolve, reject) {
    const script = existing || document.createElement('script');

    /**
     * Function contract: dependencyLoaded
     * Purpose: Mark a dependency script ready before resolving its shared request.
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
 * Purpose: Resolve pinned GSAP core plus optional SplitText for the control motion system.
 * Inputs: None.
 * Side effects: May load browser dependencies and register SplitText with GSAP.
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
 * Purpose: Reuse one in-flight or resolved GSAP dependency request across repeated initialization attempts.
 * Inputs: None.
 * Side effects: Initializes module-level runtime Promise state when needed.
 * Returns: Promise resolving to the motion runtime.
 */
function loadGsapRuntime() {
  if (runtimePromise) return runtimePromise;
  runtimePromise = resolveGsapRuntime().catch(resetRuntimePromise);
  return runtimePromise;
}

/**
 * Function contract: hasButtonishClass
 * Purpose: Detect class-token naming conventions that clearly identify an anchor as a button or CTA without enumerating every generated variant.
 * Inputs: `control` - candidate HTMLElement.
 * Side effects: Reads class tokens.
 * Returns: Boolean indicating whether any class token is button-like.
 */
function hasButtonishClass(control) {
  for (const token of control.classList) {
    if (BUTTONISH_CLASS_PATTERN.test(token)) return true;
  }
  return false;
}

/**
 * Function contract: isMotionControlCandidate
 * Purpose: Decide whether a discovered semantic element belongs to the sitewide button-motion system.
 * Inputs: `control` - candidate Element discovered as button, role button, or link.
 * Side effects: Reads tag, role, class, and motion opt-in state.
 * Returns: Boolean candidate predicate.
 */
function isMotionControlCandidate(control) {
  if (!(control instanceof HTMLElement)) return false;
  if (control.matches('button, [role="button"], [data-motion-control]')) return true;
  if (!(control instanceof HTMLAnchorElement)) return false;
  return control.matches(EXPLICIT_LINK_CONTROL_SELECTOR) || hasButtonishClass(control);
}

/**
 * Function contract: isEligibleControl
 * Purpose: Reject disabled or explicitly opted-out controls while allowing initially hidden navigation controls to initialize before they become visible.
 * Inputs: `control` - candidate Element.
 * Side effects: Reads control attributes and disabled state.
 * Returns: Boolean indicating whether the control should receive motion behavior.
 */
function isEligibleControl(control) {
  if (!isMotionControlCandidate(control)) return false;
  if (control.matches('[data-motion="off"], [aria-hidden="true"]')) return false;
  if (control.getAttribute('aria-disabled') === 'true') return false;
  if ('disabled' in control && control.disabled) return false;
  return true;
}

/**
 * Function contract: controlRole
 * Purpose: Classify one control so the motion system can apply role-appropriate interaction weight.
 * Inputs: `control` - eligible interactive HTMLElement.
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
 * Function contract: createSpan
 * Purpose: Create one motion-system span with optional text content.
 * Inputs: `className` - CSS class string; `text` - optional text content.
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
 * Purpose: Identify visual layers already generated by the motion system.
 * Inputs: `node` - candidate direct child node.
 * Side effects: None.
 * Returns: Boolean generated-layer predicate.
 */
function isGeneratedLayer(node) {
  return node instanceof Element && node.matches(GENERATED_LAYER_SELECTOR);
}

/**
 * Function contract: meaningfulChildren
 * Purpose: Return direct child nodes that represent authored visible control content.
 * Inputs: `control` - control to inspect.
 * Side effects: Reads child nodes.
 * Returns: Array of meaningful text and element nodes.
 */
function meaningfulChildren(control) {
  const result = [];
  for (const node of control.childNodes) {
    if (node.nodeType === Node.TEXT_NODE) {
      if (node.textContent?.trim()) result.push(node);
    } else if (node.nodeType === Node.ELEMENT_NODE && !isGeneratedLayer(node)) {
      result.push(node);
    }
  }
  return result;
}

/**
 * Function contract: isDecorativeArrow
 * Purpose: Recognize the simple aria-hidden arrow used by CTA markup so it can participate in visual choreography without duplicating semantics.
 * Inputs: `node` - candidate authored element.
 * Side effects: Reads element attributes and text.
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
 * Purpose: Wrap authored control content once while exposing a single label and optional decorative arrow for motion.
 * Inputs: `control` - control being decorated.
 * Side effects: Moves authored child nodes and may normalize one direct text label into a span.
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
    else elementNodes.push(node);
  }

  const arrow = elementNodes.length === 1 && isDecorativeArrow(elementNodes[0]) ? elementNodes[0] : null;
  const canNormalizeLabel = textNodes.length === 1 && (elementNodes.length === 0 || arrow);
  let label = null;
  let icon = null;

  if (canNormalizeLabel) {
    label = createSpan('nrs-motion-label', textNodes[0].textContent?.trim() || '');
    content.appendChild(label);
    textNodes[0].remove();
    if (arrow) {
      icon = arrow;
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
 * Purpose: Return or create one aria-hidden visual layer beneath a decorated control.
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
 * Purpose: Rehydrate references from a control that was already decorated by this motion system.
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
 * Purpose: Add reusable visual layers around an eligible control without duplicating its semantic label.
 * Inputs: `control` - eligible interactive control.
 * Side effects: Adds classes/data, wraps authored content, and appends decorative layers.
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

  const authored = createContentLayer(control);
  const dot = role === 'nav' ? generatedLayer(control, 'nrs-motion-nav-dot') : null;
  const fill = role === 'nav' ? null : generatedLayer(control, 'nrs-motion-fill');
  const impact = role === 'nav' ? null : generatedLayer(control, 'nrs-motion-impact');
  const glow = role === 'primary' ? generatedLayer(control, 'nrs-motion-glow') : null;
  control.dataset.nrsMotionDecorated = 'true';

  return {
    control,
    role,
    content: authored.content,
    label: authored.label,
    icon: authored.icon,
    fill,
    glow,
    impact,
    dot,
  };
}

/**
 * Function contract: structureIsIntact
 * Purpose: Detect when another feature has replaced a decorated control's children so motion can be rebuilt around current content.
 * Inputs: `structure` - stored decorated structure.
 * Side effects: Reads DOM connectivity.
 * Returns: Boolean indicating whether the structure remains reusable.
 */
function structureIsIntact(structure) {
  if (!structure?.control?.isConnected) return false;
  if (structure.role === 'icon') return true;
  return Boolean(structure.content?.isConnected && structure.content.parentElement === structure.control);
}

/**
 * Function contract: pointIn
 * Purpose: Convert pointer or keyboard activation into local coordinates, normalized intent, and fill coverage scale.
 * Inputs: `event` - optional pointer/keyboard event; `element` - target control.
 * Side effects: Reads one bounding client rectangle.
 * Returns: Local x/y, normalized nx/ny, and radial fill scale.
 */
function pointIn(event, element) {
  const rect = element.getBoundingClientRect();
  const clientX = Number.isFinite(event?.clientX) ? event.clientX : rect.left + rect.width * 0.5;
  const clientY = Number.isFinite(event?.clientY) ? event.clientY : rect.top + rect.height * 0.5;
  const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
  const y = Math.max(0, Math.min(rect.height, clientY - rect.top));
  const farX = Math.max(x, rect.width - x);
  const farY = Math.max(y, rect.height - y);
  return {
    x,
    y,
    nx: rect.width ? Math.max(-1, Math.min(1, ((clientX - rect.left) / rect.width - 0.5) * 2)) : 0,
    ny: rect.height ? Math.max(-1, Math.min(1, ((clientY - rect.top) / rect.height - 0.5) * 2)) : 0,
    fillScale: Math.max(1, (Math.hypot(farX, farY) * 2) / 76),
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
 * Purpose: Recognize Enter/Space release for held keyboard feedback.
 * Inputs: `event` - KeyboardEvent.
 * Side effects: None.
 * Returns: Boolean release-key predicate.
 */
function isActivationKeyUp(event) {
  return event.key === 'Enter' || event.key === ' ';
}

/**
 * Function contract: splitExistingLabel
 * Purpose: Split one normalized label into characters while preserving accessible text and whole-label fallback.
 * Inputs: `label` - label element; `SplitText` - optional plugin constructor.
 * Side effects: SplitText may replace label text with generated character spans until reverted.
 * Returns: SplitText instance or null.
 */
function splitExistingLabel(label, SplitText) {
  if (!label || !SplitText) return null;
  return SplitText.create(label, { type: 'chars', charsClass: 'nrs-motion-char++', aria: 'auto' });
}

/**
 * Function contract: capturePointer
 * Purpose: Capture an active pointer when supported so held feedback survives small pointer drift outside the control.
 * Inputs: `control` - target control; `pointerId` - pointer identifier or null.
 * Side effects: May call setPointerCapture.
 * Returns: Captured pointer id or null when capture is unavailable/fails.
 */
function capturePointer(control, pointerId) {
  if (pointerId == null || !control.setPointerCapture) return null;
  try {
    control.setPointerCapture(pointerId);
    return pointerId;
  } catch {
    return null;
  }
}

/**
 * Function contract: releasePointer
 * Purpose: Release a previously captured pointer without surfacing browser timing races.
 * Inputs: `control` - target control; `pointerId` - pointer identifier or null.
 * Side effects: May call releasePointerCapture.
 * Returns: Undefined.
 */
function releasePointer(control, pointerId) {
  if (pointerId == null || !control.releasePointerCapture || !control.hasPointerCapture?.(pointerId)) return;
  try {
    control.releasePointerCapture(pointerId);
  } catch {
    // The browser may already have released capture after cancellation.
  }
}

/**
 * Function contract: createPillMotion
 * Purpose: Apply pointer-origin fill, label choreography, pointer intent, held compression, and release physics to CTA-style controls.
 * Inputs: `structure` - decorated CTA structure; `gsap` - runtime; `SplitText` - optional plugin; `canHover` - hover capability.
 * Side effects: Creates GSAP work and registers pointer/keyboard listeners.
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

  gsap.set(control, { x: 0, y: 0, scaleX: 1, scaleY: 1, transformOrigin: '50% 50%' });
  gsap.set(content, { x: 0, y: 0 });
  gsap.set(textTargets, { transformOrigin: '50% 70%', backfaceVisibility: 'hidden' });
  if (fill) gsap.set(fill, { scale: 0.001, x: -120, y: -120, transformOrigin: '50% 50%' });
  if (glow) gsap.set(glow, { opacity: 0, x: -160, y: -160 });
  if (impact) gsap.set(impact, { opacity: 0, scale: 0.35 });

  const hover = gsap.timeline({ paused: true, defaults: { overwrite: 'auto' } });
  hover.to(content, { color: isPrimary ? '#ffffff' : '#f7f3eb', duration: 0.30, ease: 'power2.out' }, 0);
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
   * Purpose: Resolve the outer CTA to its hover/rest pose without interrupting a held press.
   * Inputs: `immediate` - whether to settle without interpolation.
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
   * Purpose: Start hover choreography from the actual fine-pointer entry point.
   * Inputs: `event` - pointer entry event.
   * Side effects: Updates state/classes and starts fill, glow, label, icon, and transform tweens.
   * Returns: Undefined.
   */
  function enter(event) {
    if (!canHover) return;
    state.hovered = true;
    control.classList.add('is-motion-hovered');
    const point = pointIn(event, control);
    if (fill) {
      gsap.set(fill, { x: point.x, y: point.y, scale: 0.001 });
      gsap.to(fill, { scale: point.fillScale * (isPrimary ? 1.08 : 1.04), duration: 0.52, ease: 'expo.out', overwrite: 'auto' });
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
   * Purpose: Reverse hover choreography while preserving any held active state until release.
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
   * Purpose: Enter the held physical active state for pointer or keyboard input.
   * Inputs: `event` - pointer or keyboard activation event.
   * Side effects: Captures pointer when possible and starts compression/content/impact tweens.
   * Returns: Undefined.
   */
  function pressStart(event) {
    if (state.pressed) return;
    if (event?.type === 'pointerdown' && event.button !== 0) return;
    state.pressed = true;
    state.pointerId = capturePointer(control, event?.pointerId ?? null);
    control.classList.add('is-motion-pressed');
    const point = pointIn(event, control);
    if (impact) {
      gsap.fromTo(impact,
        { x: point.x, y: point.y, scale: 0.35, opacity: 0.34 },
        { scale: isPrimary ? 2.7 : 2.35, opacity: 0, duration: 0.44, ease: 'power3.out', overwrite: 'auto' });
    }
    gsap.to(control, {
      y: state.hovered && canHover ? -0.4 : 0.6,
      scaleX: isPrimary ? 0.982 : 0.986,
      scaleY: isPrimary ? 0.952 : 0.963,
      duration: MOTION.pressIn,
      ease: 'power2.out',
      overwrite: 'auto',
    });
    gsap.to(content, { y: isPrimary ? 1.35 : 0.85, duration: MOTION.pressIn, ease: 'power2.out', overwrite: 'auto' });
  }

  /**
   * Function contract: pressEnd
   * Purpose: Release the held active state to the current hover/rest pose with controlled spring weight.
   * Inputs: `event` - optional pointer release event.
   * Side effects: Releases pointer capture and starts recovery tweens.
   * Returns: Undefined.
   */
  function pressEnd(event) {
    if (!state.pressed) return;
    state.pressed = false;
    control.classList.remove('is-motion-pressed');
    releasePointer(control, event?.pointerId ?? state.pointerId);
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
   * Purpose: Start held CTA feedback for Enter/Space without key-repeat duplication.
   * Inputs: `event` - KeyboardEvent.
   * Side effects: Delegates to pressStart when applicable.
   * Returns: Undefined.
   */
  function keyDown(event) {
    if (isActivationKey(event)) pressStart(event);
  }

  /**
   * Function contract: keyUp
   * Purpose: Release held CTA feedback when Enter/Space is released.
   * Inputs: `event` - KeyboardEvent.
   * Side effects: Delegates to pressEnd when applicable.
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
 * Purpose: Apply compact nav-dot/label hover and held compression to navigation controls.
 * Inputs: `structure` - decorated nav structure; `gsap` - runtime; `SplitText` - optional plugin; `canHover` - hover capability.
 * Side effects: Creates GSAP work and registers pointer/keyboard listeners.
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
  if (textTargets.length) hover.to(textTargets, { y: -1.4, duration: 0.20, stagger: chars.length ? { each: 0.009, from: 'center' } : 0, ease: MOTION.settleEase }, 0);
  if (dot) hover.to(dot, { scale: 1, opacity: 1, y: -1, duration: 0.26, ease: 'back.out(1.65)' }, 0.035);

  /** Function contract: enter. Purpose: Play nav hover choreography for hover-capable input. Inputs: None. Side effects: Starts the hover timeline. Returns: Undefined. */
  function enter() { if (canHover) hover.play(); }

  /** Function contract: leave. Purpose: Reverse nav hover choreography for hover-capable input. Inputs: None. Side effects: Reverses the hover timeline. Returns: Undefined. */
  function leave() { if (canHover) hover.reverse(); }

  /**
   * Function contract: pressStart
   * Purpose: Enter the held navigation active state.
   * Inputs: `event` - pointer or keyboard activation event.
   * Side effects: Captures pointer when possible and starts compression.
   * Returns: Undefined.
   */
  function pressStart(event) {
    if (state.pressed) return;
    if (event?.type === 'pointerdown' && event.button !== 0) return;
    state.pressed = true;
    state.pointerId = capturePointer(control, event?.pointerId ?? null);
    control.classList.add('is-motion-pressed');
    gsap.to(control, { scaleX: 0.972, scaleY: 0.94, y: 0.7, duration: 0.08, ease: 'power2.out', overwrite: 'auto' });
  }

  /**
   * Function contract: pressEnd
   * Purpose: Release the held navigation state with refined spring recovery.
   * Inputs: `event` - optional pointer release event.
   * Side effects: Releases pointer capture and starts recovery.
   * Returns: Undefined.
   */
  function pressEnd(event) {
    if (!state.pressed) return;
    state.pressed = false;
    control.classList.remove('is-motion-pressed');
    releasePointer(control, event?.pointerId ?? state.pointerId);
    state.pointerId = null;
    gsap.to(control, { scaleX: 1, scaleY: 1, y: 0, duration: 0.24, ease: MOTION.releaseEase, overwrite: 'auto' });
  }

  /** Function contract: keyDown. Purpose: Start nav active feedback for Enter/Space. Inputs: `event`. Side effects: Delegates to pressStart. Returns: Undefined. */
  function keyDown(event) { if (isActivationKey(event)) pressStart(event); }

  /** Function contract: keyUp. Purpose: Release nav active feedback for Enter/Space. Inputs: `event`. Side effects: Delegates to pressEnd. Returns: Undefined. */
  function keyUp(event) { if (isActivationKeyUp(event)) pressEnd(event); }

  control.addEventListener('pointerenter', enter);
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
   * Purpose: Tear down one navigation interaction instance and revert SplitText.
   * Inputs: None.
   * Side effects: Kills GSAP work and removes listeners/state classes.
   * Returns: Undefined.
   */
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
 * Purpose: Give icon-only controls hover lift and held compression without altering internal SVG/menu markup.
 * Inputs: `structure` - icon control structure; `gsap` - runtime; `canHover` - hover capability.
 * Side effects: Registers pointer/keyboard listeners and creates transform tweens.
 * Returns: Motion instance exposing `destroy`.
 */
function createIconMotion(structure, gsap, canHover) {
  const { control } = structure;
  const state = { hovered: false, pressed: false, pointerId: null };
  gsap.set(control, { x: 0, y: 0, scaleX: 1, scaleY: 1, transformOrigin: '50% 50%' });

  /**
   * Function contract: settle
   * Purpose: Resolve icon hover/rest pose without interrupting a held press.
   * Inputs: None.
   * Side effects: Starts or replaces a control transform tween.
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

  /** Function contract: enter. Purpose: Enter icon hover state. Inputs: None. Side effects: Updates hover state and transform. Returns: Undefined. */
  function enter() { if (canHover) { state.hovered = true; settle(); } }

  /** Function contract: leave. Purpose: Leave icon hover state. Inputs: None. Side effects: Updates hover state and transform. Returns: Undefined. */
  function leave() { if (canHover) { state.hovered = false; settle(); } }

  /**
   * Function contract: pressStart
   * Purpose: Enter the held icon active state.
   * Inputs: `event` - pointer or keyboard activation event.
   * Side effects: Captures pointer when possible and starts compression.
   * Returns: Undefined.
   */
  function pressStart(event) {
    if (state.pressed) return;
    if (event?.type === 'pointerdown' && event.button !== 0) return;
    state.pressed = true;
    state.pointerId = capturePointer(control, event?.pointerId ?? null);
    control.classList.add('is-motion-pressed');
    gsap.to(control, { y: 0.5, scaleX: 0.94, scaleY: 0.90, duration: 0.08, ease: 'power2.out', overwrite: 'auto' });
  }

  /**
   * Function contract: pressEnd
   * Purpose: Release the held icon state back to its current hover/rest pose.
   * Inputs: `event` - optional pointer release event.
   * Side effects: Releases pointer capture and starts recovery.
   * Returns: Undefined.
   */
  function pressEnd(event) {
    if (!state.pressed) return;
    state.pressed = false;
    control.classList.remove('is-motion-pressed');
    releasePointer(control, event?.pointerId ?? state.pointerId);
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

  /** Function contract: keyDown. Purpose: Start icon active feedback for Enter/Space. Inputs: `event`. Side effects: Delegates to pressStart. Returns: Undefined. */
  function keyDown(event) { if (isActivationKey(event)) pressStart(event); }

  /** Function contract: keyUp. Purpose: Release icon active feedback for Enter/Space. Inputs: `event`. Side effects: Delegates to pressEnd. Returns: Undefined. */
  function keyUp(event) { if (isActivationKeyUp(event)) pressEnd(event); }

  control.addEventListener('pointerenter', enter);
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
   * Purpose: Tear down one icon interaction instance.
   * Inputs: None.
   * Side effects: Kills transform tweens and removes listeners/state classes.
   * Returns: Undefined.
   */
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
 * Purpose: Preserve immediate active-state feedback for reduced-motion users without spatial choreography.
 * Inputs: `structure` - decorated control; `gsap` - runtime.
 * Side effects: Registers pointer/keyboard listeners and starts short opacity tweens.
 * Returns: Motion instance exposing `destroy`.
 */
function createReducedMotion(structure, gsap) {
  const { control } = structure;
  let pressed = false;

  /** Function contract: pressStart. Purpose: Enter reduced-motion pressed feedback. Inputs: `event`. Side effects: Starts an opacity tween and state class. Returns: Undefined. */
  function pressStart(event) {
    if (pressed || (event?.type === 'pointerdown' && event.button !== 0)) return;
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

  /** Function contract: keyDown. Purpose: Start reduced-motion feedback for Enter/Space. Inputs: `event`. Side effects: Delegates to pressStart. Returns: Undefined. */
  function keyDown(event) { if (isActivationKey(event)) pressStart(event); }

  /** Function contract: keyUp. Purpose: Release reduced-motion feedback for Enter/Space. Inputs: `event`. Side effects: Delegates to pressEnd. Returns: Undefined. */
  function keyUp(event) { if (isActivationKeyUp(event)) pressEnd(); }

  control.addEventListener('pointerdown', pressStart);
  control.addEventListener('pointerup', pressEnd);
  control.addEventListener('pointercancel', pressEnd);
  control.addEventListener('keydown', keyDown);
  control.addEventListener('keyup', keyUp);
  control.addEventListener('blur', pressEnd);

  /**
   * Function contract: destroy
   * Purpose: Tear down one reduced-motion interaction instance.
   * Inputs: None.
   * Side effects: Kills opacity tweens and removes listeners/state classes.
   * Returns: Undefined.
   */
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
 * Purpose: Route a decorated control to its role-appropriate full or reduced-motion implementation.
 * Inputs: `structure`, `gsap`, `SplitText`, `conditions` - structure, runtime, optional plugin, and media capability state.
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
 * Function contract: resetBrokenDecoration
 * Purpose: Remove stale generated layers/data after another feature replaces a decorated control's children.
 * Inputs: `control` - stale decorated control.
 * Side effects: Removes generated layers/classes/data used by motion decoration.
 * Returns: Undefined.
 */
function resetBrokenDecoration(control) {
  for (const node of control.querySelectorAll(`:scope > ${GENERATED_LAYER_SELECTOR.split(', ').join(', :scope > ')}`)) node.remove();
  control.classList.remove('nrs-motion-control', 'is-motion-hovered', 'is-motion-pressed');
  delete control.dataset.nrsMotionDecorated;
  delete control.dataset.nrsMotionRole;
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
   * Purpose: Discover semantic button candidates within one newly added DOM root.
   * Inputs: `root` - added Element-like DOM root.
   * Side effects: Calls setupControl for eligible descendants.
   * Returns: Undefined.
   */
  function scanRoot(root) {
    if (!(root instanceof Element)) return;
    if (root.matches(DISCOVERY_SELECTOR)) setupControl(root);
    for (const control of root.querySelectorAll(DISCOVERY_SELECTOR)) setupControl(control);
  }

  /**
   * Function contract: pruneDisconnectedInstances
   * Purpose: Destroy motion instances whose controls were removed from the document.
   * Inputs: None.
   * Side effects: Destroys stale instances and removes them from the scope map.
   * Returns: Undefined.
   */
  function pruneDisconnectedInstances() {
    for (const [control, instance] of instances) {
      if (control.isConnected) continue;
      instance.destroy();
      instances.delete(control);
    }
  }

  /**
   * Function contract: onMutations
   * Purpose: Rebuild controls whose content was replaced and initialize controls inserted after initial setup.
   * Inputs: `records` - MutationRecord list.
   * Side effects: May destroy/recreate motion instances and scan added DOM.
   * Returns: Undefined.
   */
  function onMutations(records) {
    for (const record of records) {
      if (record.target instanceof Element) {
        const owner = record.target.closest('.nrs-motion-control');
        const current = owner ? instances.get(owner) : null;
        if (current && !structureIsIntact(current.structure)) setupControl(owner);
      }
      for (const node of record.addedNodes) scanRoot(node);
    }
    pruneDisconnectedInstances();
  }

  for (const control of document.querySelectorAll(DISCOVERY_SELECTOR)) setupControl(control);
  const observer = new MutationObserver(onMutations);
  observer.observe(document.body, { childList: true, subtree: true });

  /**
   * Function contract: cleanupMotionScope
   * Purpose: Tear down dynamic discovery and every interaction instance in the current media capability scope.
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
 * Function contract: applyMediaConditions
 * Purpose: Initialize controls for pointer and reduced-motion capability state supplied by GSAP matchMedia.
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
 * Function contract: destroyRefinedButtonMotion
 * Purpose: Tear down the active sitewide motion scope so reinitialization cannot leave duplicate listeners or tweens.
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
 * Function contract: initRefinedButtonMotion
 * Purpose: Initialize the sitewide GSAP button interaction system for all pointer types with hover and reduced-motion branching.
 * Inputs: None.
 * Side effects: Loads dependencies, decorates controls, registers media/DOM listeners, and logs non-fatal enhancement failures.
 * Returns: Undefined; initialization continues asynchronously.
 */
export function initRefinedButtonMotion() {
  destroyRefinedButtonMotion();
  const generation = initGeneration;

  /**
   * Function contract: runtimeReady
   * Purpose: Build the responsive motion capability context after GSAP dependencies resolve.
   * Inputs: `runtime` - resolved `{ gsap, SplitText }` dependency object.
   * Side effects: Registers GSAP matchMedia and page lifecycle cleanup.
   * Returns: Undefined.
   */
  function runtimeReady(runtime) {
    if (generation !== initGeneration || !document.body) return;
    const { gsap, SplitText } = runtime;
    const matchMedia = gsap.matchMedia();

    /**
     * Function contract: mediaContext
     * Purpose: Bridge GSAP matchMedia context into the shared control initializer.
     * Inputs: `context` - GSAP matchMedia context.
     * Side effects: Delegates capability setup to applyMediaConditions.
     * Returns: Cleanup function for the active media state.
     */
    function mediaContext(context) {
      return applyMediaConditions(context, gsap, SplitText);
    }

    matchMedia.add({
      baseline: '(min-width: 0px)',
      canHover: '(any-hover: hover) and (any-pointer: fine)',
      reduce: '(prefers-reduced-motion: reduce)',
    }, mediaContext);

    /**
     * Function contract: teardown
     * Purpose: Revert active media-query motion state and remove its page lifecycle listener.
     * Inputs: None.
     * Side effects: Reverts matchMedia and clears the root reduced-motion marker.
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
