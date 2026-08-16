/**
 * @fileoverview src/scripts/features/motion/button-motion.js
 * Purpose: Apply the approved kinetic GSAP button interaction language to sitewide portfolio controls.
 * Responsibilities:
 * - Load pinned GSAP 3.15 and SplitText as progressive enhancements without blocking native navigation or form behavior.
 * - Decorate primary and secondary CTAs with pointer-origin fill, masked label reels, arrow follow-through, pointer intent, and press impact.
 * - Keep navigation and icon controls lighter while preserving keyboard, touch, reduced-motion, dynamic-content, and teardown behavior.
 * Execution context: Browser ES module loaded by the interaction-motion runtime entrypoint after the canonical page shell is available.
 * Connected files:
 * - src/scripts/entrypoints/interaction-motion.js
 * - src/styles/systems/interaction-motion.css
 * - src/scripts/features/forms/contact-form.js
 * Maintenance: Keep authored semantics as the source of truth and treat generated motion layers as aria-hidden presentation.
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
const ICON_SELECTOR = '.theme-toggle-btn, .mobile-nav-toggle';
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

/** Function contract: loadExternalScript. Purpose: Implement loadExternalScript behavior for the kinetic button motion system. Inputs: `source`, `key`. Side effects: May create a script node, mutate document head, and perform network I/O. Returns: Promise resolving when the dependency loads. */
function loadExternalScript(source, key) {
  const selector = `script[data-nrs-motion-runtime="${key}"]`;
  const existing = document.querySelector(selector);
  if (existing?.dataset.loaded === 'true') return Promise.resolve();

  /** Function contract: scriptExecutor. Purpose: Implement scriptExecutor behavior for the kinetic button motion system. Inputs: `resolve`, `reject`. Side effects: Creates or observes one dependency script and registers load/error listeners. Returns: Undefined; resolves or rejects the enclosing promise. */
  function scriptExecutor(resolve, reject) {
    const script = existing || document.createElement('script');

    /** Function contract: onLoad. Purpose: Implement onLoad behavior for the kinetic button motion system. Inputs: None. Side effects: Marks the dependency script loaded and resolves the enclosing promise. Returns: Undefined. */
    function onLoad() {
      script.dataset.loaded = 'true';
      resolve();
    }

    if (!existing) {
      script.src = source;
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.dataset.nrsMotionRuntime = key;
      document.head.appendChild(script);
    }
    script.addEventListener('load', onLoad, { once: true });
    script.addEventListener('error', reject, { once: true });
  }

  return new Promise(scriptExecutor);
}

/** Function contract: resolveGsapRuntime. Purpose: Implement resolveGsapRuntime behavior for the kinetic button motion system. Inputs: None. Side effects: Loads GSAP/SplitText browser scripts and registers SplitText when available. Returns: Promise resolving to `{ gsap, SplitText }`. */
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

/** Function contract: loadGsapRuntime. Purpose: Implement loadGsapRuntime behavior for the kinetic button motion system. Inputs: None. Side effects: Initializes or resets the shared dependency promise. Returns: Promise resolving to the pinned GSAP runtime. */
function loadGsapRuntime() {
  if (runtimePromise) return runtimePromise;

  /** Function contract: resetRuntime. Purpose: Implement resetRuntime behavior for the kinetic button motion system. Inputs: `error`. Side effects: Clears shared runtime state. Returns: Never; rethrows the original error. */
  function resetRuntime(error) {
    runtimePromise = null;
    throw error;
  }

  runtimePromise = resolveGsapRuntime().catch(resetRuntime);
  return runtimePromise;
}

/** Function contract: normalizedLabel. Purpose: Implement normalizedLabel behavior for the kinetic button motion system. Inputs: `value`. Side effects: None. Returns: Trimmed single-space text. */
function normalizedLabel(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

/** Function contract: roleFor. Purpose: Implement roleFor behavior for the kinetic button motion system. Inputs: `control`. Side effects: None. Returns: One of `icon`, `nav`, `primary`, or `secondary`. */
function roleFor(control) {
  if (control.matches(ICON_SELECTOR)) return 'icon';
  if (control.matches(NAV_SELECTOR)) return 'nav';
  if (control.matches(PRIMARY_SELECTOR)) return 'primary';
  return 'secondary';
}

/** Function contract: eligible. Purpose: Implement eligible behavior for the kinetic button motion system. Inputs: `control`. Side effects: Reads DOM state. Returns: Boolean indicating whether the control should receive motion. */
function eligible(control) {
  if (!(control instanceof HTMLElement)) return false;
  if (control.matches('[data-motion="off"], [aria-hidden="true"]')) return false;
  if (control.closest('[aria-hidden="true"]')) return false;
  if ('disabled' in control && control.disabled) return false;
  return true;
}

/** Function contract: simpleTextOnly. Purpose: Implement simpleTextOnly behavior for the kinetic button motion system. Inputs: `control`. Side effects: Reads direct child nodes. Returns: Boolean true when visible authored content is one text node. */
function simpleTextOnly(control) {
  let count = 0;
  let textOnly = false;
  for (const node of control.childNodes) {
    if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
      count += 1;
      textOnly = true;
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      count += 1;
      textOnly = false;
    }
  }
  return count === 1 && textOnly;
}

/** Function contract: span. Purpose: Implement span behavior for the kinetic button motion system. Inputs: `className`, `text`. Side effects: Creates a DOM element. Returns: Newly created span element. */
function span(className, text = '') {
  const node = document.createElement('span');
  node.className = className;
  if (text) node.textContent = text;
  return node;
}

/** Function contract: generatedLayer. Purpose: Implement generatedLayer behavior for the kinetic button motion system. Inputs: `control`, `className`. Side effects: May append one aria-hidden visual layer. Returns: Existing or newly created visual layer. */
function generatedLayer(control, className) {
  const existing = control.querySelector(`:scope > .${className}`);
  if (existing) return existing;
  const layer = span(className);
  layer.setAttribute('aria-hidden', 'true');
  control.appendChild(layer);
  return layer;
}

/** Function contract: createKineticContent. Purpose: Implement createKineticContent behavior for the kinetic button motion system. Inputs: `control`, `sourceText`. Side effects: Replaces simple visual text with aria-hidden label and arrow rails while preserving the accessible name. Returns: Generated content references. */
function createKineticContent(control, sourceText) {
  const alternateText = ALT_LABELS.get(sourceText.toLowerCase()) || sourceText;
  if (!control.hasAttribute('aria-label')) control.setAttribute('aria-label', sourceText);

  const content = span('nrs-motion-content nrs-motion-content--kinetic');
  content.setAttribute('aria-hidden', 'true');
  const clip = span('nrs-motion-label-clip');
  const sizerText = alternateText.length > sourceText.length ? alternateText : sourceText;
  const sizer = span('nrs-motion-label-sizer', sizerText);
  const baseLabel = span('nrs-motion-label nrs-motion-label--base', sourceText);
  const altLabel = span('nrs-motion-label nrs-motion-label--alt', alternateText);
  const arrowBox = span('nrs-motion-arrowbox');
  const arrowBase = span('nrs-motion-arrow nrs-motion-arrow--base', '↗');
  const arrowAlt = span('nrs-motion-arrow nrs-motion-arrow--alt', '↗');
  clip.append(sizer, baseLabel, altLabel);
  arrowBox.append(arrowBase, arrowAlt);
  content.append(clip, arrowBox);
  control.replaceChildren(content);
  return { content, baseLabel, altLabel, arrowBase, arrowAlt };
}

/** Function contract: wrapAuthoredContent. Purpose: Implement wrapAuthoredContent behavior for the kinetic button motion system. Inputs: `control`. Side effects: Moves existing authored child nodes into one generated wrapper. Returns: Generated content wrapper. */
function wrapAuthoredContent(control) {
  const content = span('nrs-motion-content');
  const preserved = [];
  for (const node of control.childNodes) {
    if (!(node instanceof Element && node.matches('.nrs-motion-fill, .nrs-motion-glow, .nrs-motion-impact, .nrs-motion-nav-dot, .nrs-motion-content'))) {
      preserved.push(node);
    }
  }
  for (const node of preserved) content.appendChild(node);
  control.appendChild(content);
  return content;
}

/** Function contract: readStructure. Purpose: Implement readStructure behavior for the kinetic button motion system. Inputs: `control`. Side effects: Reads generated DOM. Returns: Structure references for an already decorated control. */
function readStructure(control) {
  const role = control.dataset.nrsMotionRole || roleFor(control);
  return {
    control,
    role,
    content: role === 'icon' ? control : control.querySelector(':scope > .nrs-motion-content'),
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

/** Function contract: decorate. Purpose: Implement decorate behavior for the kinetic button motion system. Inputs: `control`. Side effects: Adds generated presentation structure and role metadata while preserving native control semantics. Returns: Decorated control structure. */
function decorate(control) {
  if (control.dataset.nrsMotionDecorated === 'true') return readStructure(control);
  const role = roleFor(control);
  control.classList.add('nrs-motion-control');
  control.dataset.nrsMotionRole = role;
  control.style.transitionProperty = 'color, background-color, border-color, box-shadow, opacity';
  if (window.getComputedStyle(control).position === 'static') control.style.position = 'relative';

  if (role === 'icon') {
    control.dataset.nrsMotionDecorated = 'true';
    return readStructure(control);
  }

  if (role !== 'nav' && simpleTextOnly(control)) {
    createKineticContent(control, normalizedLabel(control.textContent));
  } else {
    wrapAuthoredContent(control);
  }

  if (role === 'nav') {
    generatedLayer(control, 'nrs-motion-nav-dot');
  } else {
    generatedLayer(control, 'nrs-motion-fill');
    generatedLayer(control, 'nrs-motion-glow');
    generatedLayer(control, 'nrs-motion-impact');
  }
  control.dataset.nrsMotionDecorated = 'true';
  return readStructure(control);
}

/** Function contract: intact. Purpose: Implement intact behavior for the kinetic button motion system. Inputs: `structure`. Side effects: Reads DOM connectivity. Returns: Boolean indicating whether generated structure can be reused. */
function intact(structure) {
  if (!structure?.control?.isConnected) return false;
  if (structure.role === 'icon') return true;
  return Boolean(structure.content?.isConnected && structure.content.parentElement === structure.control);
}

/** Function contract: pointIn. Purpose: Implement pointIn behavior for the kinetic button motion system. Inputs: `event`, `element`. Side effects: Reads one bounding client rectangle. Returns: Local pointer coordinates, normalized intent, and radial fill scale. */
function pointIn(event, element) {
  const rect = element.getBoundingClientRect();
  const clientX = Number.isFinite(event?.clientX) ? event.clientX : rect.left + rect.width * 0.5;
  const clientY = Number.isFinite(event?.clientY) ? event.clientY : rect.top + rect.height * 0.5;
  const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
  const y = Math.max(0, Math.min(rect.height, clientY - rect.top));
  const radius = Math.hypot(Math.max(x, rect.width - x), Math.max(y, rect.height - y));
  return {
    x,
    y,
    nx: rect.width ? Math.max(-1, Math.min(1, ((clientX - rect.left) / rect.width - 0.5) * 2)) : 0,
    ny: rect.height ? Math.max(-1, Math.min(1, ((clientY - rect.top) / rect.height - 0.5) * 2)) : 0,
    fillScale: Math.max(1, (radius * 2) / 66),
  };
}

/** Function contract: activationKey. Purpose: Implement activationKey behavior for the kinetic button motion system. Inputs: `event`. Side effects: None. Returns: Boolean true for a non-repeating Enter or Space press. */
function activationKey(event) {
  return !event.repeat && (event.key === 'Enter' || event.key === ' ');
}

/** Function contract: splitLabel. Purpose: Implement splitLabel behavior for the kinetic button motion system. Inputs: `label`, `SplitText`. Side effects: May let SplitText replace visual label text with masked character spans until reverted. Returns: SplitText instance and animated targets. */
function splitLabel(label, SplitText) {
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

/** Function contract: createPillMotion. Purpose: Implement createPillMotion behavior for the kinetic button motion system. Inputs: `structure`, `gsap`, `SplitText`, `canHover`. Side effects: Creates GSAP timelines/setters and registers pointer/keyboard listeners. Returns: Motion instance exposing `destroy`. */
function createPillMotion(structure, gsap, SplitText, canHover) {
  const { control, content, baseLabel, altLabel, arrowBase, arrowAlt, fill, glow, impact } = structure;
  const base = splitLabel(baseLabel, SplitText);
  const alternate = splitLabel(altLabel, SplitText);
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
    hover.to(splitMode ? base.targets : baseLabel, {
      yPercent: -125,
      rotate: splitMode ? -5 : 0,
      duration: MOTION.labelOut,
      stagger: splitMode ? { each: 0.014, from: 'start' } : 0,
      ease: 'power3.in',
    }, 0.06);
    hover.to(splitMode ? alternate.targets : altLabel, {
      yPercent: 0,
      rotate: 0,
      duration: MOTION.labelIn,
      stagger: splitMode ? { each: 0.016, from: 'start' } : 0,
      ease: 'power4.out',
    }, 0.11);
  }
  if (arrowBase && arrowAlt) {
    hover.to(arrowBase, { x: 17, y: -17, rotate: 14, duration: 0.26, ease: 'power3.in' }, 0.12);
    hover.to(arrowAlt, { x: 0, y: 0, rotate: 0, duration: 0.46, ease: 'power4.out' }, 0.20);
  }

  const moveContentX = gsap.quickTo(content, 'x', { duration: 0.35, ease: 'power3.out' });
  const moveContentY = gsap.quickTo(content, 'y', { duration: 0.35, ease: 'power3.out' });
  const moveGlowX = glow ? gsap.quickTo(glow, 'x', { duration: 0.28, ease: 'power3.out' }) : null;
  const moveGlowY = glow ? gsap.quickTo(glow, 'y', { duration: 0.28, ease: 'power3.out' }) : null;

  /** Function contract: enter. Purpose: Implement enter behavior for the kinetic button motion system. Inputs: `event`. Side effects: Starts pointer-origin fill, glow, label, arrow, and control hover motion. Returns: Undefined. */
  function enter(event) {
    if (!canHover) return;
    state.hovered = true;
    const point = pointIn(event, control);
    if (fill) {
      gsap.set(fill, { x: point.x, y: point.y, scale: 0.001 });
      gsap.to(fill, { scale: point.fillScale * 1.08, duration: MOTION.fillDuration, ease: 'expo.out', overwrite: 'auto' });
    }
    if (glow) {
      gsap.set(glow, { x: point.x, y: point.y });
      gsap.to(glow, { opacity: 1, duration: 0.28, ease: 'power2.out', overwrite: 'auto' });
    }
    hover.play();
  }

  /** Function contract: move. Purpose: Implement move behavior for the kinetic button motion system. Inputs: `event`. Side effects: Updates quickTo pointer-intent destinations for content and glow. Returns: Undefined. */
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

  /** Function contract: leave. Purpose: Implement leave behavior for the kinetic button motion system. Inputs: None. Side effects: Reverses hover motion and restores pointer-follow layers. Returns: Undefined. */
  function leave() {
    if (!canHover) return;
    state.hovered = false;
    moveContentX(0);
    moveContentY(0);
    if (fill) gsap.to(fill, { scale: 0.001, duration: 0.36, ease: 'power3.inOut', overwrite: 'auto' });
    if (glow) gsap.to(glow, { opacity: 0, duration: 0.20, ease: 'power2.out', overwrite: 'auto' });
    hover.reverse();
  }

  /** Function contract: press. Purpose: Implement press behavior for the kinetic button motion system. Inputs: `event`. Side effects: Starts pointer-origin impact, compression, overshoot, and elastic settle motion. Returns: Undefined. */
  function press(event) {
    if (event?.type === 'pointerdown' && event.button !== 0) return;
    const point = pointIn(event, control);
    const settleScale = state.hovered && canHover ? MOTION.hoverScale : 1;
    const settleY = state.hovered && canHover ? MOTION.hoverY : 0;
    if (impact) gsap.set(impact, { x: point.x, y: point.y, scale: 0.2, opacity: 0.82 });
    const timeline = gsap.timeline({ defaults: { overwrite: 'auto' } });
    timeline.to(control, { scale: 0.955, y: 1, duration: MOTION.pressIn, ease: 'power3.in' }, 0);
    if (impact) timeline.to(impact, { scale: 3.2, opacity: 0, duration: 0.52, ease: 'power3.out' }, 0);
    timeline.to(control, { scale: 1.025, y: settleY, duration: 0.21, ease: 'power4.out' }, MOTION.pressIn);
    timeline.to(control, { scale: settleScale, y: settleY, duration: 0.34, ease: 'elastic.out(1, .42)' }, 0.20);
  }

  /** Function contract: keyDown. Purpose: Implement keyDown behavior for the kinetic button motion system. Inputs: `event`. Side effects: Delegates Enter/Space activation to kinetic press feedback. Returns: Undefined. */
  function keyDown(event) {
    if (activationKey(event)) press(event);
  }

  control.addEventListener('pointerenter', enter);
  control.addEventListener('pointermove', move);
  control.addEventListener('pointerleave', leave);
  control.addEventListener('pointerdown', press);
  control.addEventListener('keydown', keyDown);

  /** Function contract: destroy. Purpose: Implement destroy behavior for the kinetic button motion system. Inputs: None. Side effects: Kills GSAP work, reverts SplitText, and removes registered listeners. Returns: Undefined. */
  function destroy() {
    hover.kill();
    base.split?.revert();
    alternate.split?.revert();
    gsap.killTweensOf(control);
    gsap.killTweensOf(content);
    if (fill) gsap.killTweensOf(fill);
    if (glow) gsap.killTweensOf(glow);
    if (impact) gsap.killTweensOf(impact);
    control.removeEventListener('pointerenter', enter);
    control.removeEventListener('pointermove', move);
    control.removeEventListener('pointerleave', leave);
    control.removeEventListener('pointerdown', press);
    control.removeEventListener('keydown', keyDown);
  }

  return { structure, destroy };
}

/** Function contract: createNavMotion. Purpose: Implement createNavMotion behavior for the kinetic button motion system. Inputs: `structure`, `gsap`, `canHover`. Side effects: Registers navigation pointer/keyboard listeners and starts compact transform/dot tweens. Returns: Motion instance exposing `destroy`. */
function createNavMotion(structure, gsap, canHover) {
  const { control, dot } = structure;
  const state = { hovered: false };
  gsap.set(control, { x: 0, y: 0, scale: 1, transformOrigin: '50% 50%' });

  /** Function contract: settle. Purpose: Implement settle behavior for the kinetic button motion system. Inputs: None. Side effects: Resolves navigation control and dot to current hover/rest pose. Returns: Undefined. */
  function settle() {
    gsap.to(control, {
      y: state.hovered && canHover ? -1 : 0,
      scale: state.hovered && canHover ? 1.02 : 1,
      duration: 0.26,
      ease: 'power3.out',
      overwrite: 'auto',
    });
    if (dot) gsap.to(dot, {
      scale: state.hovered && canHover ? 1 : 0.2,
      opacity: state.hovered && canHover ? 0.82 : 0,
      y: state.hovered && canHover ? -1 : 0,
      duration: 0.26,
      ease: 'back.out(1.6)',
      overwrite: 'auto',
    });
  }

  /** Function contract: enter. Purpose: Implement enter behavior for the kinetic button motion system. Inputs: None. Side effects: Marks navigation hovered and settles it. Returns: Undefined. */
  function enter() {
    if (!canHover) return;
    state.hovered = true;
    settle();
  }

  /** Function contract: leave. Purpose: Implement leave behavior for the kinetic button motion system. Inputs: None. Side effects: Clears navigation hover and settles it. Returns: Undefined. */
  function leave() {
    if (!canHover) return;
    state.hovered = false;
    settle();
  }

  /** Function contract: press. Purpose: Implement press behavior for the kinetic button motion system. Inputs: `event`. Side effects: Starts navigation active compression and rebound. Returns: Undefined. */
  function press(event) {
    if (event?.type === 'pointerdown' && event.button !== 0) return;
    gsap.timeline({ defaults: { overwrite: 'auto' } })
      .to(control, { scale: 0.955, y: 0.5, duration: 0.08, ease: 'power2.in' })
      .to(control, { scale: state.hovered && canHover ? 1.02 : 1, y: state.hovered && canHover ? -1 : 0, duration: 0.24, ease: 'back.out(1.4)' });
  }

  /** Function contract: keyDown. Purpose: Implement keyDown behavior for the kinetic button motion system. Inputs: `event`. Side effects: Delegates Enter/Space activation to navigation press feedback. Returns: Undefined. */
  function keyDown(event) {
    if (activationKey(event)) press(event);
  }

  /** Function contract: destroy. Purpose: Implement destroy behavior for the kinetic button motion system. Inputs: None. Side effects: Kills navigation GSAP work and removes registered listeners. Returns: Undefined. */
  function destroy() {
    gsap.killTweensOf(control);
    if (dot) gsap.killTweensOf(dot);
    control.removeEventListener('pointerenter', enter);
    control.removeEventListener('pointerleave', leave);
    control.removeEventListener('pointerdown', press);
    control.removeEventListener('keydown', keyDown);
  }

  control.addEventListener('pointerenter', enter);
  control.addEventListener('pointerleave', leave);
  control.addEventListener('pointerdown', press);
  control.addEventListener('keydown', keyDown);
  return { structure, destroy };
}

/** Function contract: createIconMotion. Purpose: Implement createIconMotion behavior for the kinetic button motion system. Inputs: `structure`, `gsap`, `canHover`. Side effects: Registers icon pointer/keyboard listeners and starts transform tweens. Returns: Motion instance exposing `destroy`. */
function createIconMotion(structure, gsap, canHover) {
  const { control } = structure;
  const state = { hovered: false };
  gsap.set(control, { x: 0, y: 0, scale: 1, transformOrigin: '50% 50%' });

  /** Function contract: settle. Purpose: Implement settle behavior for the kinetic button motion system. Inputs: None. Side effects: Resolves icon to current hover/rest pose. Returns: Undefined. */
  function settle() {
    gsap.to(control, {
      y: state.hovered && canHover ? -1 : 0,
      scale: state.hovered && canHover ? 1.035 : 1,
      duration: 0.26,
      ease: 'power3.out',
      overwrite: 'auto',
    });
  }

  /** Function contract: enter. Purpose: Implement enter behavior for the kinetic button motion system. Inputs: None. Side effects: Marks icon hovered and settles it. Returns: Undefined. */
  function enter() {
    if (!canHover) return;
    state.hovered = true;
    settle();
  }

  /** Function contract: leave. Purpose: Implement leave behavior for the kinetic button motion system. Inputs: None. Side effects: Clears icon hover and settles it. Returns: Undefined. */
  function leave() {
    if (!canHover) return;
    state.hovered = false;
    settle();
  }

  /** Function contract: press. Purpose: Implement press behavior for the kinetic button motion system. Inputs: `event`. Side effects: Starts icon active compression and rebound. Returns: Undefined. */
  function press(event) {
    if (event?.type === 'pointerdown' && event.button !== 0) return;
    gsap.timeline({ defaults: { overwrite: 'auto' } })
      .to(control, { scale: 0.91, y: 0.5, duration: 0.08, ease: 'power2.in' })
      .to(control, { scale: state.hovered && canHover ? 1.035 : 1, y: state.hovered && canHover ? -1 : 0, duration: 0.24, ease: 'back.out(1.5)' });
  }

  /** Function contract: keyDown. Purpose: Implement keyDown behavior for the kinetic button motion system. Inputs: `event`. Side effects: Delegates Enter/Space activation to icon press feedback. Returns: Undefined. */
  function keyDown(event) {
    if (activationKey(event)) press(event);
  }

  /** Function contract: destroy. Purpose: Implement destroy behavior for the kinetic button motion system. Inputs: None. Side effects: Kills icon GSAP work and removes registered listeners. Returns: Undefined. */
  function destroy() {
    gsap.killTweensOf(control);
    control.removeEventListener('pointerenter', enter);
    control.removeEventListener('pointerleave', leave);
    control.removeEventListener('pointerdown', press);
    control.removeEventListener('keydown', keyDown);
  }

  control.addEventListener('pointerenter', enter);
  control.addEventListener('pointerleave', leave);
  control.addEventListener('pointerdown', press);
  control.addEventListener('keydown', keyDown);
  return { structure, destroy };
}

/** Function contract: createReducedMotion. Purpose: Implement createReducedMotion behavior for the kinetic button motion system. Inputs: `structure`, `gsap`. Side effects: Registers pointer/keyboard listeners and starts opacity-only active feedback. Returns: Motion instance exposing `destroy`. */
function createReducedMotion(structure, gsap) {
  const { control } = structure;

  /** Function contract: press. Purpose: Implement press behavior for the kinetic button motion system. Inputs: `event`. Side effects: Starts a short opacity down/up timeline. Returns: Undefined. */
  function press(event) {
    if (event?.type === 'pointerdown' && event.button !== 0) return;
    gsap.timeline({ defaults: { overwrite: 'auto' } })
      .to(control, { opacity: 0.78, duration: 0.08 })
      .to(control, { opacity: 1, duration: 0.10 });
  }

  /** Function contract: keyDown. Purpose: Implement keyDown behavior for the kinetic button motion system. Inputs: `event`. Side effects: Delegates Enter/Space activation to reduced-motion feedback. Returns: Undefined. */
  function keyDown(event) {
    if (activationKey(event)) press(event);
  }

  /** Function contract: destroy. Purpose: Implement destroy behavior for the kinetic button motion system. Inputs: None. Side effects: Kills opacity GSAP work and removes registered listeners. Returns: Undefined. */
  function destroy() {
    gsap.killTweensOf(control);
    control.removeEventListener('pointerdown', press);
    control.removeEventListener('keydown', keyDown);
  }

  control.addEventListener('pointerdown', press);
  control.addEventListener('keydown', keyDown);
  return { structure, destroy };
}

/** Function contract: createMotion. Purpose: Implement createMotion behavior for the kinetic button motion system. Inputs: `structure`, `gsap`, `SplitText`, `conditions`. Side effects: Delegates setup to the role-appropriate motion implementation. Returns: Motion instance exposing `destroy`. */
function createMotion(structure, gsap, SplitText, conditions) {
  if (conditions.reduce) return createReducedMotion(structure, gsap);
  if (structure.role === 'nav') return createNavMotion(structure, gsap, conditions.canHover);
  if (structure.role === 'icon') return createIconMotion(structure, gsap, conditions.canHover);
  return createPillMotion(structure, gsap, SplitText, conditions.canHover);
}

/** Function contract: initializeScope. Purpose: Implement initializeScope behavior for the kinetic button motion system. Inputs: `gsap`, `SplitText`, `conditions`. Side effects: Decorates current/future controls, registers listeners, and starts a MutationObserver. Returns: Cleanup function for the capability scope. */
function initializeScope(gsap, SplitText, conditions) {
  const instances = new Map();

  /** Function contract: setup. Purpose: Implement setup behavior for the kinetic button motion system. Inputs: `control`. Side effects: May destroy stale motion, mutate control DOM, and register listeners/tweens. Returns: Undefined. */
  function setup(control) {
    if (!eligible(control)) return;
    const current = instances.get(control);
    if (current && intact(current.structure)) return;
    if (current) {
      current.destroy();
      instances.delete(control);
    }

    if (control.dataset.nrsMotionDecorated === 'true' && !intact(readStructure(control))) {
      for (const node of control.querySelectorAll(':scope > .nrs-motion-fill, :scope > .nrs-motion-glow, :scope > .nrs-motion-impact, :scope > .nrs-motion-nav-dot')) {
        node.remove();
      }
      delete control.dataset.nrsMotionDecorated;
    }

    const structure = decorate(control);
    instances.set(control, createMotion(structure, gsap, SplitText, conditions));
  }

  /** Function contract: scan. Purpose: Implement scan behavior for the kinetic button motion system. Inputs: `root`. Side effects: Discovers and initializes matching controls inside one added DOM root. Returns: Undefined. */
  function scan(root) {
    if (!(root instanceof Element)) return;
    if (root.matches(CONTROL_SELECTOR)) setup(root);
    for (const control of root.querySelectorAll(CONTROL_SELECTOR)) setup(control);
  }

  /** Function contract: onMutations. Purpose: Implement onMutations behavior for the kinetic button motion system. Inputs: `records`. Side effects: Rebuilds stale controls and initializes controls inside newly added DOM nodes. Returns: Undefined. */
  function onMutations(records) {
    for (const record of records) {
      if (record.target instanceof Element) {
        const owner = record.target.matches(CONTROL_SELECTOR) ? record.target : record.target.closest(CONTROL_SELECTOR);
        const current = owner ? instances.get(owner) : null;
        if (current && !intact(current.structure)) setup(owner);
      }
      for (const node of record.addedNodes) scan(node);
    }
  }

  for (const control of document.querySelectorAll(CONTROL_SELECTOR)) setup(control);
  const observer = new MutationObserver(onMutations);
  observer.observe(document.body, { childList: true, subtree: true });

  /** Function contract: cleanup. Purpose: Implement cleanup behavior for the kinetic button motion system. Inputs: None. Side effects: Disconnects dynamic discovery and destroys every active motion instance. Returns: Undefined. */
  function cleanup() {
    observer.disconnect();
    for (const instance of instances.values()) instance.destroy();
    instances.clear();
  }

  return cleanup;
}

/** Function contract: destroyButtonMotion. Purpose: Implement destroyButtonMotion behavior for the kinetic button motion system. Inputs: None. Side effects: Reverts the current GSAP media scope and invalidates pending initialization. Returns: Undefined. */
export function destroyButtonMotion() {
  activeTeardown?.();
  activeTeardown = null;
  initGeneration += 1;
}

/** Function contract: initButtonMotion. Purpose: Implement initButtonMotion behavior for the kinetic button motion system. Inputs: None. Side effects: Loads GSAP, decorates controls, registers responsive media behavior, and logs non-fatal enhancement failures. Returns: Undefined; initialization continues asynchronously. */
export function initButtonMotion() {
  destroyButtonMotion();
  const generation = initGeneration;

  /** Function contract: runtimeReady. Purpose: Implement runtimeReady behavior for the kinetic button motion system. Inputs: `runtime`. Side effects: Registers matchMedia, control motion, and page lifecycle cleanup. Returns: Undefined. */
  function runtimeReady(runtime) {
    if (generation !== initGeneration || !document.body) return;
    const { gsap, SplitText } = runtime;
    const matchMedia = gsap.matchMedia();

    /** Function contract: applyMedia. Purpose: Implement applyMedia behavior for the kinetic button motion system. Inputs: `context`. Side effects: Toggles reduced-motion state and initializes the current control scope. Returns: Cleanup function for the media capability state. */
    function applyMedia(context) {
      const conditions = {
        canHover: Boolean(context.conditions?.canHover),
        reduce: Boolean(context.conditions?.reduce),
      };
      document.documentElement.classList.toggle('nrs-motion-reduced', conditions.reduce);
      return initializeScope(gsap, SplitText, conditions);
    }

    matchMedia.add({
      canHover: '(hover: hover) and (pointer: fine)',
      reduce: '(prefers-reduced-motion: reduce)',
    }, applyMedia);

    /** Function contract: teardown. Purpose: Implement teardown behavior for the kinetic button motion system. Inputs: None. Side effects: Reverts matchMedia control motion and removes page lifecycle state. Returns: Undefined. */
    function teardown() {
      window.removeEventListener('pagehide', teardown);
      matchMedia.revert();
      document.documentElement.classList.remove('nrs-motion-reduced');
    }

    activeTeardown = teardown;
    window.addEventListener('pagehide', teardown, { once: true });
  }

  /** Function contract: runtimeFailed. Purpose: Implement runtimeFailed behavior for the kinetic button motion system. Inputs: `error`. Side effects: Emits a non-fatal console warning. Returns: Undefined. */
  function runtimeFailed(error) {
    console.warn('[portfolio] GSAP button motion enhancement unavailable; baseline controls remain active.', error);
  }

  loadGsapRuntime().then(runtimeReady).catch(runtimeFailed);
}
