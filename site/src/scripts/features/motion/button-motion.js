/**
 * @fileoverview src/scripts/features/motion/button-motion.js
 * Purpose: Apply the approved kinetic GSAP button interaction language to sitewide portfolio controls.
 * Responsibilities:
 * - Load pinned GSAP 3.15 and SplitText as progressive enhancements without blocking navigation or form behavior.
 * - Decorate primary and secondary CTAs with pointer-origin fill, masked label reels, arrow follow-through, pointer intent, and press impact.
 * - Keep navigation and icon controls lighter while preserving keyboard, touch, reduced-motion, dynamic-content, and teardown behavior.
 * Execution context: Browser ES module loaded by the interaction-motion runtime entrypoint after the canonical page shell is available.
 * Connected files:
 * - src/scripts/entrypoints/interaction-motion.js
 * - src/styles/systems/interaction-motion.css
 * - src/scripts/features/forms/contact-form.js
 * Maintenance: Keep authored semantics as the source of truth and treat all generated motion layers as aria-hidden presentation.
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
const GENERATED_SELECTOR = [
  '.nrs-motion-fill',
  '.nrs-motion-glow',
  '.nrs-motion-impact',
  '.nrs-motion-nav-dot',
  '.nrs-motion-content',
].join(',');
const ALT_LABELS = new Map([
  ['view selected work', 'Explore selected work'],
  ['discuss a project', 'Start a conversation'],
  ['download resume', 'Get the resume'],
  ['all work', 'Explore all work'],
  ['send the context', 'Start a conversation'],
  ['send message', 'Send the message'],
  ['contact me', 'Start a conversation'],
  ['email me instead', 'Email me directly'],
  ['view resume', 'Open resume'],
  ['view full resume', 'Open full resume'],
  ['view case studies', 'Explore case studies'],
  ['explore service', 'View service details'],
  ['review the work', 'Review selected work'],
  ['learn more', 'Explore more'],
]);
const MOTION = {
  hoverScale: 1.015,
  hoverY: -2,
  hoverDuration: 0.42,
  fillDuration: 0.62,
  labelOut: 0.34,
  labelIn: 0.45,
  pressIn: 0.085,
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
    return new Promise((resolve, reject) => {
      existing.addEventListener('load', () => {
        existing.dataset.loaded = 'true';
        resolve();
      }, { once: true });
      existing.addEventListener('error', reject, { once: true });
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = source;
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.dataset.nrsMotionRuntime = key;
    script.addEventListener('load', () => {
      script.dataset.loaded = 'true';
      resolve();
    }, { once: true });
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
      console.warn('[portfolio] SplitText unavailable; kinetic labels will use the whole-label fallback.', error);
    }
  }

  if (SplitText) gsap.registerPlugin(SplitText);
  return { gsap, SplitText };
}

/**
 * Function contract: loadGsapRuntime
 * Purpose: Reuse one in-flight or resolved GSAP dependency promise so repeated initialization never inserts duplicate runtime scripts.
 * Inputs: None.
 * Side effects: Initializes or resets the shared runtime promise.
 * Returns: Promise resolving to the pinned GSAP runtime and optional SplitText plugin.
 */
function loadGsapRuntime() {
  if (runtimePromise) return runtimePromise;
  runtimePromise = resolveGsapRuntime().catch((error) => {
    runtimePromise = null;
    throw error;
  });
  return runtimePromise;
}

/**
 * Function contract: controlRole
 * Purpose: Classify one discovered interactive control so the shared motion system can apply an appropriate visual weight.
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
 * Function contract: normalizedLabel
 * Purpose: Collapse whitespace around a visible control label so alternate-label lookup and aria preservation use stable text.
 * Inputs: `value` - arbitrary label-like value.
 * Side effects: None.
 * Returns: Trimmed single-space text.
 */
function normalizedLabel(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

/**
 * Function contract: alternateLabelFor
 * Purpose: Resolve the approved kinetic alternate copy for a control while keeping unknown labels visually stable.
 * Inputs: `label` - normalized authored control label.
 * Side effects: None.
 * Returns: Alternate label string; falls back to the authored label when no explicit copy exists.
 */
function alternateLabelFor(label) {
  return ALT_LABELS.get(label.toLowerCase()) || label;
}

/**
 * Function contract: generatedLayer
 * Purpose: Return or create one aria-hidden visual layer under an existing control.
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
 * Function contract: createKineticContent
 * Purpose: Replace a simple text-only pill label with aria-hidden base/alternate visual rails and dual arrows while preserving the authored accessible name on the control.
 * Inputs: `control` - pill control; `sourceText` - normalized authored label.
 * Side effects: Replaces authored child nodes with generated visual content and may set an aria-label when one is absent.
 * Returns: Generated content wrapper with label and arrow references.
 */
function createKineticContent(control, sourceText) {
  if (!control.hasAttribute('aria-label')) control.setAttribute('aria-label', sourceText);

  const alternateText = alternateLabelFor(sourceText);
  const content = document.createElement('span');
  content.className = 'nrs-motion-content nrs-motion-content--kinetic';
  content.setAttribute('aria-hidden', 'true');

  const clip = document.createElement('span');
  clip.className = 'nrs-motion-label-clip';

  const sizer = document.createElement('span');
  sizer.className = 'nrs-motion-label-sizer';
  sizer.textContent = alternateText.length > sourceText.length ? alternateText : sourceText;

  const baseLabel = document.createElement('span');
  baseLabel.className = 'nrs-motion-label nrs-motion-label--base';
  baseLabel.textContent = sourceText;

  const altLabel = document.createElement('span');
  altLabel.className = 'nrs-motion-label nrs-motion-label--alt';
  altLabel.textContent = alternateText;

  clip.append(sizer, baseLabel, altLabel);

  const arrowBox = document.createElement('span');
  arrowBox.className = 'nrs-motion-arrowbox';
  const arrowBase = document.createElement('span');
  arrowBase.className = 'nrs-motion-arrow nrs-motion-arrow--base';
  arrowBase.textContent = '↗';
  const arrowAlt = document.createElement('span');
  arrowAlt.className = 'nrs-motion-arrow nrs-motion-arrow--alt';
  arrowAlt.textContent = '↗';
  arrowBox.append(arrowBase, arrowAlt);

  content.append(clip, arrowBox);
  control.replaceChildren(content);
  return { content, baseLabel, altLabel, arrowBase, arrowAlt };
}

/**
 * Function contract: createAuthoredContent
 * Purpose: Wrap existing complex control children without cloning their authored content so non-text controls remain functional.
 * Inputs: `control` - control whose authored nodes should remain intact.
 * Side effects: Moves existing non-generated child nodes into one content wrapper.
 * Returns: Generated content wrapper.
 */
function createAuthoredContent(control) {
  const content = document.createElement('span');
  content.className = 'nrs-motion-content';
  const originalNodes = [...control.childNodes].filter((node) => {
    return !(node instanceof Element && node.matches(GENERATED_SELECTOR));
  });
  originalNodes.forEach((node) => content.appendChild(node));
  control.appendChild(content);
  return content;
}

/**
 * Function contract: hasSimpleTextContent
 * Purpose: Determine whether a control can safely use the two-label kinetic rail without discarding authored child markup.
 * Inputs: `control` - candidate control before decoration.
 * Side effects: Reads direct child nodes.
 * Returns: Boolean true when every meaningful direct child is text only.
 */
function hasSimpleTextContent(control) {
  const meaningful = [...control.childNodes].filter((node) => {
    if (node.nodeType === Node.TEXT_NODE) return Boolean(node.textContent?.trim());
    return node.nodeType === Node.ELEMENT_NODE;
  });
  return meaningful.length === 1 && meaningful[0].nodeType === Node.TEXT_NODE;
}

/**
 * Function contract: readDecoratedStructure
 * Purpose: Rehydrate references from a control that was already decorated during an earlier matchMedia capability state.
 * Inputs: `control` - previously decorated control.
 * Side effects: Reads generated child structure.
 * Returns: Structure object used by the role-specific motion builder.
 */
function readDecoratedStructure(control) {
  const role = control.dataset.nrsMotionRole || controlRole(control);
  if (role === 'icon') {
    return { control, role, content: control, baseLabel: null, altLabel: null, arrowBase: null, arrowAlt: null, fill: null, glow: null, impact: null, dot: null };
  }

  return {
    control,
    role,
    content: control.querySelector(':scope > .nrs-motion-content'),
    baseLabel: control.querySelector('.nrs-motion-label--base'),
    altLabel: control.querySelector('.nrs-motion-label--alt'),
    arrowBase: control.querySelector('.nrs-motion-arrow--base'),
    arrowAlt: control.querySelector('.nrs-motion-arrow--alt'),
    fill: control.querySelector(':scope > .nrs-motion-fill'),
    glow: control.querySelector(':scope > .nrs-motion-glow'),
    impact: control.querySelector(':scope > .nrs-motion-impact'),
    dot: control.querySelector(':scope > .nrs-motion-nav-dot'),
  };
}

/**
 * Function contract: decorateControl
 * Purpose: Add role-appropriate generated visual structure while keeping native link/button semantics and behavior intact.
 * Inputs: `control` - eligible interactive control.
 * Side effects: Adds role/data classes, may replace simple visual text with aria-hidden rails, wraps complex content, and appends generated motion layers.
 * Returns: Structure object consumed by the role-specific motion builder.
 */
function decorateControl(control) {
  if (control.dataset.nrsMotionDecorated === 'true') return readDecoratedStructure(control);

  const role = controlRole(control);
  control.classList.add('nrs-motion-control');
  control.dataset.nrsMotionRole = role;
  control.style.transitionProperty = 'color, background-color, border-color, box-shadow, opacity';
  if (window.getComputedStyle(control).position === 'static') control.style.position = 'relative';

  if (role === 'icon') {
    control.dataset.nrsMotionDecorated = 'true';
    return readDecoratedStructure(control);
  }

  let content;
  let baseLabel = null;
  let altLabel = null;
  let arrowBase = null;
  let arrowAlt = null;

  if (role !== 'nav' && hasSimpleTextContent(control)) {
    const sourceText = normalizedLabel(control.textContent);
    const kinetic = createKineticContent(control, sourceText);
    ({ content, baseLabel, altLabel, arrowBase, arrowAlt } = kinetic);
  } else {
    content = createAuthoredContent(control);
  }

  let fill = null;
  let glow = null;
  let impact = null;
  let dot = null;

  if (role === 'nav') {
    dot = generatedLayer(control, 'nrs-motion-nav-dot');
  } else {
    fill = generatedLayer(control, 'nrs-motion-fill');
    glow = generatedLayer(control, 'nrs-motion-glow');
    impact = generatedLayer(control, 'nrs-motion-impact');
  }

  control.dataset.nrsMotionDecorated = 'true';
  return { control, role, content, baseLabel, altLabel, arrowBase, arrowAlt, fill, glow, impact, dot };
}

/**
 * Function contract: structureIsIntact
 * Purpose: Detect whether another feature replaced a decorated control's child content so motion can be rebuilt around the new label.
 * Inputs: `structure` - decorated control structure.
 * Side effects: Reads DOM connectivity and direct-child structure.
 * Returns: Boolean indicating whether the stored structure is still usable.
 */
function structureIsIntact(structure) {
  if (!structure?.control?.isConnected) return false;
  if (structure.role === 'icon') return true;
  if (!structure.content?.isConnected || structure.content.parentElement !== structure.control) return false;
  if (structure.baseLabel && !structure.baseLabel.isConnected) return false;
  if (structure.altLabel && !structure.altLabel.isConnected) return false;
  return true;
}

/**
 * Function contract: pointIn
 * Purpose: Convert pointer or keyboard activation into clamped local control coordinates, normalized intent, and a fill scale that reaches the farthest corner.
 * Inputs: `event` - optional PointerEvent/KeyboardEvent-like object; `element` - target control.
 * Side effects: Reads one bounding client rectangle.
 * Returns: Local x/y coordinates, normalized x/y intent, and required radial fill scale.
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
    fillScale: Math.max(1, (radius * 2) / 66),
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
 * Purpose: Recognize the keyboard release phase for Enter or Space.
 * Inputs: `event` - KeyboardEvent.
 * Side effects: None.
 * Returns: Boolean true for Enter or Space release.
 */
function isActivationKeyUp(event) {
  return event.key === 'Enter' || event.key === ' ';
}

/**
 * Function contract: splitKineticLabel
 * Purpose: Split one visual label into masked characters when SplitText is available while retaining a whole-label fallback.
 * Inputs: `label` - visual label HTMLElement; `SplitText` - optional registered plugin constructor.
 * Side effects: SplitText may replace label text with generated mask/character spans until reverted.
 * Returns: Object containing the SplitText instance and animated targets.
 */
function splitKineticLabel(label, SplitText) {
  if (!label) return { split: null, targets: [] };
  if (!SplitText) return { split: null, targets: [label] };
  const split = SplitText.create(label, {
    type: 'chars',
    mask: 'chars',
    charsClass: 'nrs-motion-char++',
    aria: 'none',
  });
  return { split, targets: split.chars || [] };
}

/**
 * Function contract: createPillMotion
 * Purpose: Apply the approved pointer-origin fill, masked label reel, arrow launch, pointer intent, and press-impact choreography to pill CTAs.
 * Inputs: `structure` - decorated control structure; `gsap` - GSAP runtime; `SplitText` - optional plugin; `canHover` - fine-pointer hover capability.
 * Side effects: Creates GSAP timelines/quickTo setters and registers pointer/keyboard listeners.
 * Returns: Instance object exposing a `destroy` function for lifecycle cleanup.
 */
function createPillMotion(structure, gsap, SplitText, canHover) {
  const { control, content, baseLabel, altLabel, arrowBase, arrowAlt, fill, glow, impact } = structure;
  const base = splitKineticLabel(baseLabel, SplitText);
  const alternate = splitKineticLabel(altLabel, SplitText);
  const splitMode = Boolean(base.split && alternate.split);
  const state = { hovered: false };

  gsap.set(control, { x: 0, y: 0, scale: 1, transformOrigin: '50% 50%' });
  gsap.set(content, { x: 0, y: 0 });
  if (fill) gsap.set(fill, { scale: 0.001, x: -100, y: -100, transformOrigin: '50% 50%' });
  if (glow) gsap.set(glow, { opacity: 0, x: -120, y: -120 });
  if (impact) gsap.set(impact, { opacity: 0, scale: 0.2 });
  if (arrowBase) gsap.set(arrowBase, { x: 0, y: 0, rotate: 0 });
  if (arrowAlt) gsap.set(arrowAlt, { x: -18, y: 18, rotate: -10 });

  if (baseLabel && altLabel) {
    gsap.set(altLabel, { autoAlpha: 1, yPercent: splitMode ? 0 : 120 });
    gsap.set(baseLabel, { yPercent: 0 });
    if (splitMode) {
      gsap.set(base.targets, { yPercent: 0, rotate: 0 });
      gsap.set(alternate.targets, { yPercent: 120, rotate: 5 });
    }
  }

  const hover = gsap.timeline({ paused: true, defaults: { overwrite: 'auto' } });
  hover.to(control, {
    y: MOTION.hoverY,
    scale: MOTION.hoverScale,
    color: '#11110f',
    boxShadow: '0 20px 44px rgba(0,0,0,.23)',
    duration: MOTION.hoverDuration,
    ease: 'power3.out',
    easeReverse: 'power2.inOut',
  }, 0);

  if (baseLabel && altLabel) {
    const outgoing = splitMode ? base.targets : [baseLabel];
    const incoming = splitMode ? alternate.targets : [altLabel];
    hover
      .to(outgoing, {
        yPercent: -125,
        rotate: splitMode ? -5 : 0,
        duration: MOTION.labelOut,
        stagger: splitMode ? { each: 0.014, from: 'start' } : 0,
        ease: 'power3.in',
      }, 0.06)
      .to(incoming, {
        yPercent: 0,
        rotate: 0,
        duration: MOTION.labelIn,
        stagger: splitMode ? { each: 0.016, from: 'start' } : 0,
        ease: 'power4.out',
      }, 0.11);
  }

  if (arrowBase && arrowAlt) {
    hover
      .to(arrowBase, { x: 17, y: -17, rotate: 14, duration: 0.26, ease: 'power3.in' }, 0.12)
      .to(arrowAlt, { x: 0, y: 0, rotate: 0, duration: 0.46, ease: 'power4.out' }, 0.20);
  }

  const moveContentX = gsap.quickTo(content, 'x', { duration: 0.35, ease: 'power3.out' });
  const moveContentY = gsap.quickTo(content, 'y', { duration: 0.35, ease: 'power3.out' });
  const moveGlowX = glow ? gsap.quickTo(glow, 'x', { duration: 0.28, ease: 'power3.out' }) : null;
  const moveGlowY = glow ? gsap.quickTo(glow, 'y', { duration: 0.28, ease: 'power3.out' }) : null;

  /**
   * Function contract: enter
   * Purpose: Start kinetic hover choreography from the actual pointer entry point.
   * Inputs: `event` - PointerEvent-like object.
   * Side effects: Updates hover state and starts fill, glow, label, arrow, and control tweens.
   * Returns: Undefined.
   */
  function enter(event) {
    if (!canHover) return;
    state.hovered = true;
    const point = pointIn(event, control);
    if (fill) {
      gsap.set(fill, { x: point.x, y: point.y, scale: 0.001 });
      gsap.to(fill, {
        scale: point.fillScale * 1.08,
        duration: MOTION.fillDuration,
        ease: 'expo.out',
        overwrite: 'auto',
      });
    }
    if (glow) {
      gsap.set(glow, { x: point.x, y: point.y });
      gsap.to(glow, { opacity: 1, duration: 0.28, ease: 'power2.out', overwrite: 'auto' });
    }
    hover.play();
  }

  /**
   * Function contract: move
   * Purpose: Apply high-frequency pointer intent to the visual content and glow without displacing the native hit target.
   * Inputs: `event` - PointerEvent.
   * Side effects: Updates quickTo tween destinations.
   * Returns: Undefined.
   */
  function move(event) {
    if (!canHover) return;
    const point = pointIn(event, control);
    moveContentX(point.nx * 2.5);
    moveContentY(point.ny * 2);
    if (moveGlowX && moveGlowY) {
      moveGlowX(point.x);
      moveGlowY(point.y);
    }
  }

  /**
   * Function contract: leave
   * Purpose: Reverse the kinetic hover sequence and restore pointer-follow layers to rest.
   * Inputs: None.
   * Side effects: Updates hover state and reverses active GSAP work.
   * Returns: Undefined.
   */
  function leave() {
    if (!canHover) return;
    state.hovered = false;
    moveContentX(0);
    moveContentY(0);
    if (fill) gsap.to(fill, { scale: 0.001, duration: 0.36, ease: 'power3.inOut', overwrite: 'auto' });
    if (glow) gsap.to(glow, { opacity: 0, duration: 0.20, ease: 'power2.out', overwrite: 'auto' });
    hover.reverse();
  }

  /**
   * Function contract: press
   * Purpose: Fire the approved pointer-origin impact ring with compression, overshoot, and elastic settle while preserving native activation.
   * Inputs: `event` - PointerEvent/KeyboardEvent-like object.
   * Side effects: Starts an impact timeline on the control and ring.
   * Returns: Undefined.
   */
  function press(event) {
    if (event?.type === 'pointerdown' && event.button !== 0) return;
    const point = pointIn(event, control);
    if (impact) gsap.set(impact, { x: point.x, y: point.y, scale: 0.2, opacity: 0.82 });
    const settleScale = state.hovered && canHover ? MOTION.hoverScale : 1;
    const settleY = state.hovered && canHover ? MOTION.hoverY : 0;
    const timeline = gsap.timeline({ defaults: { overwrite: 'auto' } });
    timeline.to(control, { scale: 0.955, y: 1, duration: MOTION.pressIn, ease: 'power3.in' }, 0);
    if (impact) timeline.to(impact, { scale: 3.2, opacity: 0, duration: 0.52, ease: 'power3.out' }, 0);
    timeline
      .to(control, { scale: 1.025, y: settleY, duration: 0.21, ease: 'power4.out' }, MOTION.pressIn)
      .to(control, { scale: settleScale, y: settleY, duration: 0.34, ease: 'elastic.out(1, .42)' }, 0.20);
  }

  /**
   * Function contract: keyDown
   * Purpose: Trigger kinetic press feedback for keyboard activation without preventing the native link/button action.
   * Inputs: `event` - KeyboardEvent.
   * Side effects: Delegates to the press timeline when applicable.
   * Returns: Undefined.
   */
  function keyDown(event) {
    if (isActivationKey(event)) press(event);
  }

  control.addEventListener('pointerenter', enter);
  control.addEventListener('pointermove', move);
  control.addEventListener('pointerleave', leave);
  control.addEventListener('pointerdown', press);
  control.addEventListener('keydown', keyDown);

  return {
    structure,
    destroy() {
      hover.kill();
      base.split?.revert();
      alternate.split?.revert();
      gsap.killTweensOf([control, content, fill, glow, impact, arrowBase, arrowAlt, ...base.targets, ...alternate.targets].filter(Boolean));
      control.removeEventListener('pointerenter', enter);
      control.removeEventListener('pointermove', move);
      control.removeEventListener('pointerleave', leave);
      control.removeEventListener('pointerdown', press);
      control.removeEventListener('keydown', keyDown);
    },
  };
}

/**
 * Function contract: createNavMotion
 * Purpose: Keep navigation motion compact so CTA choreography remains the strongest interaction layer.
 * Inputs: `structure` - decorated nav structure; `gsap` - GSAP runtime; `canHover` - fine-pointer hover capability.
 * Side effects: Registers pointer/keyboard listeners and starts small transform/dot tweens.
 * Returns: Instance object exposing a `destroy` function.
 */
function createNavMotion(structure, gsap, canHover) {
  const { control, dot } = structure;
  const state = { hovered: false };
  gsap.set(control, { x: 0, y: 0, scale: 1, transformOrigin: '50% 50%' });
  if (dot) gsap.set(dot, { scale: 0.2, opacity: 0, y: 0 });

  /**
   * Function contract: settle
   * Purpose: Resolve navigation control and dot to hovered or resting state.
   * Inputs: None.
   * Side effects: Starts GSAP transform/opacity tweens.
   * Returns: Undefined.
   */
  function settle() {
    gsap.to(control, {
      y: state.hovered && canHover ? -1 : 0,
      scale: state.hovered && canHover ? 1.02 : 1,
      duration: 0.26,
      ease: 'power3.out',
      overwrite: 'auto',
    });
    if (dot) {
      gsap.to(dot, {
        scale: state.hovered && canHover ? 1 : 0.2,
        opacity: state.hovered && canHover ? 0.82 : 0,
        y: state.hovered && canHover ? -1 : 0,
        duration: 0.26,
        ease: 'back.out(1.6)',
        overwrite: 'auto',
      });
    }
  }

  /**
   * Function contract: enter
   * Purpose: Mark navigation control hovered on fine-pointer entry.
   * Inputs: None.
   * Side effects: Updates local state and settles the control.
   * Returns: Undefined.
   */
  function enter() {
    if (!canHover) return;
    state.hovered = true;
    settle();
  }

  /**
   * Function contract: leave
   * Purpose: Clear navigation hover state on fine-pointer exit.
   * Inputs: None.
   * Side effects: Updates local state and settles the control.
   * Returns: Undefined.
   */
  function leave() {
    if (!canHover) return;
    state.hovered = false;
    settle();
  }

  /**
   * Function contract: press
   * Purpose: Give navigation controls decisive active compression without delaying native activation.
   * Inputs: `event` - PointerEvent/KeyboardEvent-like object.
   * Side effects: Starts a short compression/release timeline.
   * Returns: Undefined.
   */
  function press(event) {
    if (event?.type === 'pointerdown' && event.button !== 0) return;
    gsap.timeline({ defaults: { overwrite: 'auto' } })
      .to(control, { scale: 0.955, y: 0.5, duration: 0.08, ease: 'power2.in' })
      .to(control, { scale: state.hovered && canHover ? 1.02 : 1, y: state.hovered && canHover ? -1 : 0, duration: 0.24, ease: 'back.out(1.4)' });
  }

  /**
   * Function contract: keyDown
   * Purpose: Trigger navigation press feedback for Enter or Space.
   * Inputs: `event` - KeyboardEvent.
   * Side effects: Delegates to press when applicable.
   * Returns: Undefined.
   */
  function keyDown(event) {
    if (isActivationKey(event)) press(event);
  }

  control.addEventListener('pointerenter', enter);
  control.addEventListener('pointerleave', leave);
  control.addEventListener('pointerdown', press);
  control.addEventListener('keydown', keyDown);

  return {
    structure,
    destroy() {
      gsap.killTweensOf([control, dot].filter(Boolean));
      control.removeEventListener('pointerenter', enter);
      control.removeEventListener('pointerleave', leave);
      control.removeEventListener('pointerdown', press);
      control.removeEventListener('keydown', keyDown);
    },
  };
}

/**
 * Function contract: createIconMotion
 * Purpose: Give icon-only controls small hover lift and press weight without wrapping children that other features may replace.
 * Inputs: `structure` - icon control structure; `gsap` - GSAP runtime; `canHover` - fine-pointer hover capability.
 * Side effects: Registers pointer/keyboard listeners and starts transform tweens.
 * Returns: Instance object exposing a `destroy` function.
 */
function createIconMotion(structure, gsap, canHover) {
  const { control } = structure;
  const state = { hovered: false };
  gsap.set(control, { x: 0, y: 0, scale: 1, transformOrigin: '50% 50%' });

  /**
   * Function contract: settle
   * Purpose: Resolve icon hover or resting transform.
   * Inputs: None.
   * Side effects: Starts a GSAP transform tween.
   * Returns: Undefined.
   */
  function settle() {
    gsap.to(control, {
      y: state.hovered && canHover ? -1 : 0,
      scale: state.hovered && canHover ? 1.035 : 1,
      duration: 0.26,
      ease: 'power3.out',
      overwrite: 'auto',
    });
  }

  /**
   * Function contract: enter
   * Purpose: Mark an icon control hovered on fine-pointer entry.
   * Inputs: None.
   * Side effects: Updates local state and settles the control.
   * Returns: Undefined.
   */
  function enter() {
    if (!canHover) return;
    state.hovered = true;
    settle();
  }

  /**
   * Function contract: leave
   * Purpose: Clear icon hover state on fine-pointer exit.
   * Inputs: None.
   * Side effects: Updates local state and settles the control.
   * Returns: Undefined.
   */
  function leave() {
    if (!canHover) return;
    state.hovered = false;
    settle();
  }

  /**
   * Function contract: press
   * Purpose: Give an icon-only control a short active compression and rebound.
   * Inputs: `event` - PointerEvent/KeyboardEvent-like object.
   * Side effects: Starts a GSAP press timeline.
   * Returns: Undefined.
   */
  function press(event) {
    if (event?.type === 'pointerdown' && event.button !== 0) return;
    gsap.timeline({ defaults: { overwrite: 'auto' } })
      .to(control, { scale: 0.91, y: 0.5, duration: 0.08, ease: 'power2.in' })
      .to(control, { scale: state.hovered && canHover ? 1.035 : 1, y: state.hovered && canHover ? -1 : 0, duration: 0.24, ease: 'back.out(1.5)' });
  }

  /**
   * Function contract: keyDown
   * Purpose: Trigger icon press feedback for Enter or Space.
   * Inputs: `event` - KeyboardEvent.
   * Side effects: Delegates to press when applicable.
   * Returns: Undefined.
   */
  function keyDown(event) {
    if (isActivationKey(event)) press(event);
  }

  control.addEventListener('pointerenter', enter);
  control.addEventListener('pointerleave', leave);
  control.addEventListener('pointerdown', press);
  control.addEventListener('keydown', keyDown);

  return {
    structure,
    destroy() {
      gsap.killTweensOf(control);
      control.removeEventListener('pointerenter', enter);
      control.removeEventListener('pointerleave', leave);
      control.removeEventListener('pointerdown', press);
      control.removeEventListener('keydown', keyDown);
    },
  };
}

/**
 * Function contract: createReducedMotion
 * Purpose: Preserve immediate active-state feedback for reduced-motion users without spatial choreography.
 * Inputs: `structure` - decorated control structure; `gsap` - GSAP runtime.
 * Side effects: Registers pointer/keyboard listeners and starts short opacity tweens.
 * Returns: Instance object exposing a `destroy` function.
 */
function createReducedMotion(structure, gsap) {
  const { control } = structure;

  /**
   * Function contract: press
   * Purpose: Provide a brief opacity response for reduced-motion activation.
   * Inputs: `event` - PointerEvent/KeyboardEvent-like object.
   * Side effects: Starts an opacity down/up timeline.
   * Returns: Undefined.
   */
  function press(event) {
    if (event?.type === 'pointerdown' && event.button !== 0) return;
    gsap.timeline({ defaults: { overwrite: 'auto' } })
      .to(control, { opacity: 0.78, duration: 0.08 })
      .to(control, { opacity: 1, duration: 0.10 });
  }

  /**
   * Function contract: keyDown
   * Purpose: Trigger reduced-motion active feedback for Enter or Space.
   * Inputs: `event` - KeyboardEvent.
   * Side effects: Delegates to press when applicable.
   * Returns: Undefined.
   */
  function keyDown(event) {
    if (isActivationKey(event)) press(event);
  }

  control.addEventListener('pointerdown', press);
  control.addEventListener('keydown', keyDown);

  return {
    structure,
    destroy() {
      gsap.killTweensOf(control);
      control.removeEventListener('pointerdown', press);
      control.removeEventListener('keydown', keyDown);
    },
  };
}

/**
 * Function contract: createControlMotion
 * Purpose: Route one decorated control to the role-appropriate full or reduced motion implementation.
 * Inputs: `structure` - decorated structure; `gsap` - GSAP runtime; `SplitText` - optional plugin; `conditions` - capability conditions.
 * Side effects: Delegates listener and tween setup to the selected motion implementation.
 * Returns: Motion instance exposing `destroy`.
 */
function createControlMotion(structure, gsap, SplitText, conditions) {
  if (conditions.reduce) return createReducedMotion(structure, gsap);
  if (structure.role === 'nav') return createNavMotion(structure, gsap, conditions.canHover);
  if (structure.role === 'icon') return createIconMotion(structure, gsap, conditions.canHover);
  return createPillMotion(structure, gsap, SplitText, conditions.canHover);
}

/**
 * Function contract: initializeMotionScope
 * Purpose: Attach role-aware motion to current and future controls for one GSAP matchMedia capability state.
 * Inputs: `gsap` - GSAP runtime; `SplitText` - optional plugin; `conditions` - current pointer/reduced-motion conditions.
 * Side effects: Decorates controls, registers listeners, and starts a MutationObserver for dynamically inserted or replaced controls.
 * Returns: Cleanup function that removes observer/listener state and kills active GSAP work.
 */
function initializeMotionScope(gsap, SplitText, conditions) {
  const instances = new Map();

  /**
   * Function contract: setupControl
   * Purpose: Decorate and initialize one eligible control once, rebuilding it when another feature replaced its generated content.
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
      const existing = readDecoratedStructure(control);
      if (!structureIsIntact(existing)) {
        control.querySelectorAll(':scope > .nrs-motion-fill, :scope > .nrs-motion-glow, :scope > .nrs-motion-impact, :scope > .nrs-motion-nav-dot').forEach((node) => node.remove());
        delete control.dataset.nrsMotionDecorated;
      }
    }

    const structure = decorateControl(control);
    instances.set(control, createControlMotion(structure, gsap, SplitText, conditions));
  }

  /**
   * Function contract: scanRoot
   * Purpose: Discover controls within one added DOM root without rescanning the full document.
   * Inputs: `root` - Element-like mutation root.
   * Side effects: Calls setupControl for matching controls.
   * Returns: Undefined.
   */
  function scanRoot(root) {
    if (!(root instanceof Element)) return;
    if (root.matches(CONTROL_SELECTOR)) setupControl(root);
    root.querySelectorAll(CONTROL_SELECTOR).forEach((control) => setupControl(control));
  }

  document.querySelectorAll(CONTROL_SELECTOR).forEach((control) => setupControl(control));

  const observer = new MutationObserver((records) => {
    records.forEach((record) => {
      if (record.target instanceof Element) {
        const owner = record.target.matches(CONTROL_SELECTOR) ? record.target : record.target.closest(CONTROL_SELECTOR);
        const current = owner ? instances.get(owner) : null;
        if (current && !structureIsIntact(current.structure)) setupControl(owner);
      }
      record.addedNodes.forEach((node) => scanRoot(node));
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });

  /**
   * Function contract: cleanupMotionScope
   * Purpose: Tear down dynamic discovery and every interaction instance created for the current media-query capability scope.
   * Inputs: None.
   * Side effects: Disconnects the observer, removes listeners, and kills GSAP work through each instance.
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
 * Purpose: Tear down the current sitewide button motion capability scope so reinitialization cannot leave duplicate listeners or tweens.
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
 * Purpose: Initialize the approved kinetic GSAP sitewide button interaction system with pointer capability and reduced-motion branching.
 * Inputs: None; derives controls and user motion capabilities from the current document/browser.
 * Side effects: Loads GSAP dependencies, decorates interactive controls, registers matchMedia/DOM listeners, and logs a non-fatal diagnostic if enhancement loading fails.
 * Returns: Undefined; initialization continues asynchronously without blocking baseline site behavior.
 */
export function initButtonMotion() {
  destroyButtonMotion();
  const generation = initGeneration;

  loadGsapRuntime()
    .then(({ gsap, SplitText }) => {
      if (generation !== initGeneration || !document.body) return;

      const matchMedia = gsap.matchMedia();
      matchMedia.add({
        canHover: '(hover: hover) and (pointer: fine)',
        reduce: '(prefers-reduced-motion: reduce)',
      }, (context) => {
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
      }

      activeTeardown = teardown;
      window.addEventListener('pagehide', teardown, { once: true });
    })
    .catch((error) => {
      console.warn('[portfolio] GSAP button motion enhancement unavailable; baseline controls remain active.', error);
    });
}
