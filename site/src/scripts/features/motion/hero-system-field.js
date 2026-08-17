/**
 * @fileoverview src/scripts/features/motion/hero-system-field.js
 * Purpose: Animate the homepage hero's systems-map particles around the approved portrait artwork without changing the artwork, hero copy, or native navigation behavior.
 * Responsibilities:
 * - Draw deterministic orange and warm-white particles over the right-side portrait composition.
 * - Repel nearby particles from fine-pointer movement and spring them back to their authored field positions.
 * - Use pinned GSAP for the cursor-orbit response when available, with a direct transform fallback.
 * - Keep coarse-pointer and reduced-motion experiences static and preserve lifecycle cleanup.
 * Execution context: Browser ES module loaded by the portfolio entrypoint after DOM readiness.
 * Connected files:
 * - src/scripts/entrypoints/portfolio-main.js
 * - scripts/ensure-hero-system-visual-v28.cjs
 * - src/scripts/features/motion/refined-button-motion.js
 * Maintenance: Keep this module scoped to the right-side hero visual. The static composition remains owned by the production finalizer and approved artwork asset.
 */

const figure = document.querySelector('[data-hero-system-field]');

if (figure && figure.dataset.heroSystemReady !== 'true') {
  figure.dataset.heroSystemReady = 'true';

  const canvas = figure.querySelector('[data-hero-system-particles]');
  const cursor = figure.querySelector('[data-hero-system-cursor]');
  const context = canvas?.getContext('2d', { alpha: true });
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const canHover = window.matchMedia('(any-hover: hover) and (any-pointer: fine)');
  const aborter = new AbortController();
  const { signal } = aborter;

  let width = 1;
  let height = 1;
  let dpr = 1;
  let animationFrame = 0;
  let lastTime = 0;
  let visible = true;
  let particles = [];
  let resizeObserver = null;
  let intersectionObserver = null;
  let gsapInstance = null;
  let cursorX = null;
  let cursorY = null;

  const pointer = {
    x: 0,
    y: 0,
    previousX: 0,
    previousY: 0,
    inside: false,
    speed: 0,
  };

  /**
   * Function contract: deterministicUnit
   * Purpose: Produce a stable pseudo-random unit value for one particle-grid index so the field does not reshuffle between frames or resizes.
   * Inputs: `index` - deterministic integer seed.
   * Side effects: None.
   * Returns: Number in the inclusive-exclusive range [0, 1).
   */
  function deterministicUnit(index) {
    const raw = Math.sin(index * 12.9898 + 78.233) * 43758.5453;
    return raw - Math.floor(raw);
  }

  /**
   * Function contract: seedParticles
   * Purpose: Rebuild the portrait-surrounding particle field for the current rendered figure size while keeping the face and central body visually clear.
   * Inputs: None.
   * Side effects: Replaces the in-memory particle collection.
   * Returns: Undefined.
   */
  function seedParticles() {
    particles = [];
    const step = Math.max(24, Math.min(34, width / 24));
    const left = width * 0.055;
    const right = width * 0.965;
    const top = height * 0.055;
    const bottom = height * 0.73;
    let index = 0;

    for (let y = top; y < bottom; y += step) {
      for (let x = left; x < right; x += step) {
        const random = deterministicUnit(index);
        const nx = x / width;
        const ny = y / height;
        const faceMask = ((nx - 0.57) / 0.19) ** 2 + ((ny - 0.34) / 0.24) ** 2 < 1;
        const bodyMask = ((nx - 0.56) / 0.31) ** 2 + ((ny - 0.62) / 0.34) ** 2 < 1;
        const sparseLabelZone = nx > 0.78 && random < 0.62;

        if (faceMask || bodyMask || sparseLabelZone || random < 0.46) {
          index += 1;
          continue;
        }

        const warm = random > 0.69;
        particles.push({
          originX: x,
          originY: y,
          x,
          y,
          velocityX: 0,
          velocityY: 0,
          phase: index * 0.618,
          radius: warm ? 1.7 : 1.05,
          alpha: warm ? 0.78 : 0.54,
          warm,
        });
        index += 1;
      }
    }
  }

  /**
   * Function contract: resizeCanvas
   * Purpose: Match the canvas backing store to the rendered figure while capping device-pixel density for predictable performance.
   * Inputs: None.
   * Side effects: Updates canvas dimensions, context transform, and particle seed positions.
   * Returns: Undefined.
   */
  function resizeCanvas() {
    if (!canvas || !context) return;
    const bounds = figure.getBoundingClientRect();
    width = Math.max(1, bounds.width);
    height = Math.max(1, bounds.height);
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    seedParticles();
    if (reduceMotion.matches || !canHover.matches) drawParticles(performance.now());
  }

  /**
   * Function contract: drawParticles
   * Purpose: Advance spring physics, render particle pulses, and draw temporary pointer connections for the active systems field.
   * Inputs: `timestamp` - requestAnimationFrame timestamp.
   * Side effects: Clears and redraws the canvas and schedules the next animation frame when motion is active.
   * Returns: Undefined.
   */
  function drawParticles(timestamp = 0) {
    if (!context) return;
    const delta = Math.min(2.1, (timestamp - lastTime) / 16.667 || 1);
    lastTime = timestamp;
    context.clearRect(0, 0, width, height);
    const animated = !reduceMotion.matches && canHover.matches;
    const influence = Math.max(82, Math.min(148, width * 0.145));

    for (const particle of particles) {
      const dx = particle.x - pointer.x;
      const dy = particle.y - pointer.y;
      const distance = Math.hypot(dx, dy) || 1;

      if (animated && pointer.inside && distance < influence) {
        const force = (1 - distance / influence) * (3.2 + pointer.speed * 0.15);
        particle.velocityX += (dx / distance) * force;
        particle.velocityY += (dy / distance) * force;
        particle.velocityX += (pointer.x - pointer.previousX) * 0.008;
        particle.velocityY += (pointer.y - pointer.previousY) * 0.008;
      }

      particle.velocityX += (particle.originX - particle.x) * 0.038 * delta;
      particle.velocityY += (particle.originY - particle.y) * 0.038 * delta;
      particle.velocityX *= Math.pow(0.86, delta);
      particle.velocityY *= Math.pow(0.86, delta);

      if (animated) {
        particle.x += particle.velocityX * delta;
        particle.y += particle.velocityY * delta;
      } else {
        particle.x = particle.originX;
        particle.y = particle.originY;
      }

      const pulse = animated ? 0.82 + Math.sin(timestamp * 0.0016 + particle.phase) * 0.18 : 0.92;
      const alpha = particle.alpha * pulse;
      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fillStyle = particle.warm
        ? `rgba(255,90,0,${alpha})`
        : `rgba(236,233,225,${alpha})`;
      context.fill();

      if (animated && pointer.inside && distance < influence * 0.74) {
        const lineAlpha = (1 - distance / (influence * 0.74)) * 0.13;
        context.beginPath();
        context.moveTo(particle.x, particle.y);
        context.lineTo(pointer.x, pointer.y);
        context.strokeStyle = `rgba(255,90,0,${lineAlpha})`;
        context.lineWidth = 0.7;
        context.stroke();
      }
    }

    if (animated && visible) animationFrame = window.requestAnimationFrame(drawParticles);
  }

  /**
   * Function contract: startAnimation
   * Purpose: Start the particle animation loop exactly once when the figure is visible and interactive motion is allowed.
   * Inputs: None.
   * Side effects: Schedules requestAnimationFrame work.
   * Returns: Undefined.
   */
  function startAnimation() {
    if (animationFrame || reduceMotion.matches || !canHover.matches || !visible) return;
    lastTime = 0;
    animationFrame = window.requestAnimationFrame(
      /** Callback contract: Run the first visible particle frame and hand scheduling back to the draw loop. Inputs: `timestamp`. Side effects: Clears the pending-frame marker and renders the particle field. Returns: Undefined; callback is side-effect-only. */
      (timestamp) => {
        animationFrame = 0;
        drawParticles(timestamp);
      },
    );
  }

  /**
   * Function contract: stopAnimation
   * Purpose: Stop active particle frames when the hero leaves the viewport or the page is being torn down.
   * Inputs: None.
   * Side effects: Cancels an outstanding animation frame.
   * Returns: Undefined.
   */
  function stopAnimation() {
    if (!animationFrame) return;
    window.cancelAnimationFrame(animationFrame);
    animationFrame = 0;
  }

  /**
   * Function contract: positionCursorFallback
   * Purpose: Move the cursor orbit directly when GSAP is unavailable while retaining transform-only pointer performance.
   * Inputs: `x`, `y`, `active` - local figure coordinates and visibility state.
   * Side effects: Updates cursor inline transform and opacity.
   * Returns: Undefined.
   */
  function positionCursorFallback(x, y, active) {
    if (!cursor) return;
    cursor.style.opacity = active ? '0.94' : '0';
    cursor.style.transform = `translate3d(${x}px,${y}px,0) scale(${active ? 1 : 0.58})`;
  }

  /**
   * Function contract: updatePointer
   * Purpose: Convert a pointer event to local figure coordinates, track pointer speed, and update the cursor orbit.
   * Inputs: `event` - pointermove event from the figure.
   * Side effects: Updates pointer state and cursor-orbit motion.
   * Returns: Undefined.
   */
  function updatePointer(event) {
    if (reduceMotion.matches || !canHover.matches || event.pointerType === 'touch') return;
    const bounds = figure.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    const dx = x - pointer.x;
    const dy = y - pointer.y;
    pointer.previousX = pointer.x;
    pointer.previousY = pointer.y;
    pointer.x = x;
    pointer.y = y;
    pointer.speed = Math.min(24, Math.hypot(dx, dy));
    pointer.inside = true;

    if (gsapInstance && cursorX && cursorY && cursor) {
      cursorX(x);
      cursorY(y);
      gsapInstance.to(cursor, {
        autoAlpha: 0.94,
        scale: 1,
        duration: 0.2,
        ease: 'power3.out',
        overwrite: 'auto',
      });
    } else {
      positionCursorFallback(x, y, true);
    }
  }

  /**
   * Function contract: releasePointer
   * Purpose: Hide the cursor orbit and give displaced particles a brief outward impulse before the field springs home.
   * Inputs: None.
   * Side effects: Updates pointer state, particle velocity, and cursor-orbit motion.
   * Returns: Undefined.
   */
  function releasePointer() {
    pointer.inside = false;
    for (const particle of particles) {
      const dx = particle.x - pointer.x;
      const dy = particle.y - pointer.y;
      const distance = Math.hypot(dx, dy) || 1;
      if (distance > 150) continue;
      const impulse = (1 - distance / 150) * 1.5;
      particle.velocityX += (dx / distance) * impulse + Math.sin(particle.phase) * 0.35;
      particle.velocityY += (dy / distance) * impulse + Math.cos(particle.phase) * 0.35;
    }

    if (gsapInstance && cursor) {
      gsapInstance.to(cursor, {
        autoAlpha: 0,
        scale: 0.58,
        duration: 0.24,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    } else {
      positionCursorFallback(pointer.x, pointer.y, false);
    }
  }

  /**
   * Function contract: loadGsap
   * Purpose: Reuse the pinned GSAP runtime loaded by the sitewide motion system, loading the same source only when it has not begun loading yet.
   * Inputs: None.
   * Side effects: May append one pinned GSAP script and then prepare quick cursor setters.
   * Returns: Promise resolving after GSAP setup succeeds or a graceful fallback is retained.
   */
  async function loadGsap() {
    if (reduceMotion.matches || !canHover.matches || !cursor) return;
    const version = '3.15.0';
    const production = new Set(['nischhalsubba.com.np', 'www.nischhalsubba.com.np']).has(window.location.hostname);
    const source = production
      ? `/runtime/gsap/gsap-${version}.min.js`
      : `https://cdn.jsdelivr.net/npm/gsap@${version}/dist/gsap.min.js`;
    const selector = `script[data-nrs-motion-runtime="gsap-${version}"]`;

    try {
      if (!window.gsap || window.gsap.version !== version) {
        const existing = document.querySelector(selector);
        await new Promise(
          /** Callback contract: Reuse or create the shared pinned GSAP script and settle when it loads. Inputs: `resolve`, `reject`. Side effects: Registers script listeners and may append a script element. Returns: Undefined; settles the enclosing Promise. */
          (resolve, reject) => {
          const script = existing || document.createElement('script');
          if (existing?.dataset.loaded === 'true' || window.gsap?.version === version) {
            resolve();
            return;
          }
          script.addEventListener('load', resolve, { once: true });
          script.addEventListener('error', reject, { once: true });
          if (!existing) {
            script.src = source;
            script.async = true;
            script.crossOrigin = 'anonymous';
            script.dataset.nrsMotionRuntime = `gsap-${version}`;
            document.head.appendChild(script);
          }
          },
        );
      }

      gsapInstance = window.gsap || null;
      if (!gsapInstance) return;
      cursorX = gsapInstance.quickTo(cursor, 'x', { duration: 0.22, ease: 'power3.out' });
      cursorY = gsapInstance.quickTo(cursor, 'y', { duration: 0.22, ease: 'power3.out' });
      gsapInstance.set(cursor, { autoAlpha: 0, scale: 0.58, x: -80, y: -80 });
    } catch (error) {
      console.warn('[portfolio] Hero systems cursor is using the transform fallback because GSAP was unavailable.', error);
    }
  }

  /**
   * Function contract: syncMotionPreference
   * Purpose: Reconcile the field immediately after pointer or reduced-motion media conditions change.
   * Inputs: None.
   * Side effects: Starts/stops animation, clears pointer state, and redraws a static field when required.
   * Returns: Undefined.
   */
  function syncMotionPreference() {
    releasePointer();
    stopAnimation();
    resizeCanvas();
    if (!reduceMotion.matches && canHover.matches) {
      loadGsap();
      startAnimation();
    }
  }

  /**
   * Function contract: cleanup
   * Purpose: Release observers, animation frames, and GSAP cursor tweens during page teardown.
   * Inputs: None.
   * Side effects: Cancels browser work and aborts registered listeners.
   * Returns: Undefined.
   */
  function cleanup() {
    aborter.abort();
    stopAnimation();
    resizeObserver?.disconnect();
    intersectionObserver?.disconnect();
    if (gsapInstance && cursor) gsapInstance.killTweensOf(cursor);
  }

  if (canvas && context) {
    resizeCanvas();

    if ('ResizeObserver' in window) {
      resizeObserver = new ResizeObserver(resizeCanvas);
      resizeObserver.observe(figure);
    } else {
      window.addEventListener('resize', resizeCanvas, { passive: true, signal });
    }

    if ('IntersectionObserver' in window) {
      intersectionObserver = new IntersectionObserver(
        /** Callback contract: Pause or resume particle frames as the hero visual enters or leaves the extended viewport. Inputs: `entries`. Side effects: Updates visibility state and animation scheduling. Returns: Undefined; callback is side-effect-only. */
        (entries) => {
        visible = entries.some((entry) => entry.isIntersecting);
        if (visible) startAnimation();
        else stopAnimation();
        },
        { rootMargin: '120px 0px', threshold: 0.01 },
      );
      intersectionObserver.observe(figure);
    }

    figure.addEventListener('pointermove', updatePointer, { passive: true, signal });
    figure.addEventListener('pointerleave', releasePointer, { passive: true, signal });

    reduceMotion.addEventListener('change', syncMotionPreference, { signal });
    canHover.addEventListener('change', syncMotionPreference, { signal });
    window.addEventListener('pagehide', cleanup, { once: true, signal });

    loadGsap();
    startAnimation();
  }
}
