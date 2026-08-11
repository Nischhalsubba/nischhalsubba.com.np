/**
 * @fileoverview src/scripts/features/motion/signal-portrait.js
 * Purpose: Implement signal portrait behavior inside the motion browser-runtime domain.
 * Responsibilities:
 * - Own the motion behavior represented by this module and keep unrelated domains outside the file.
 * - Read or update only the DOM/runtime state needed for this feature and preserve accessibility semantics.
 * - Expose stable initializer/helper exports consumed by runtime entrypoints or closely related features.
 * Execution context: Browser ES module loaded through the portfolio runtime.
 * Connected files:
 * - src/runtime/script.js
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
const signalFigure = document.querySelector('[data-signal-portrait]');

if (signalFigure && signalFigure.dataset.signalReady !== 'true') {
  signalFigure.dataset.signalReady = 'true';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const stateNodes = Array.from(signalFigure.querySelectorAll('[data-signal-state]'));
  const signalNode = signalFigure.querySelector('[data-signal-node="signal"]');
  const connector = signalFigure.querySelector('[data-signal-connector]');
  const signalHalo = signalFigure.querySelector('[data-signal-halo]');
  const orbitMain = signalFigure.querySelector('[data-signal-orbit-main]');
  const orbitPaths = Array.from(signalFigure.querySelectorAll('.nrs-signal-orbit-path'));
  const orbitSvg = signalFigure.querySelector('.nrs-signal-orbit');
  const portrait = signalFigure.querySelector('.nrs-signal-portrait--main');
  const ghost = signalFigure.querySelector('.nrs-signal-portrait--ghost');
  const thesis = signalFigure.querySelector('[data-signal-thesis]');
  const insight = signalFigure.querySelector('[data-signal-insight]');
  const insightKicker = signalFigure.querySelector('[data-signal-kicker]');
  const insightTitle = signalFigure.querySelector('[data-signal-title]');
  const insightCopy = signalFigure.querySelector('[data-signal-copy]');

  const meanings = {
    intent: {
      kicker: 'Intent',
      title: 'What is the person actually trying to accomplish?',
      copy: 'The system begins with user intent, not interface decoration.',
    },
    logic: {
      kicker: 'Product logic',
      title: 'What rules decide what can happen next?',
      copy: 'The orbit behaves like a rule system: inputs enter, constraints shape them, decisions leave.',
    },
    state: {
      kicker: 'Important state',
      title: 'What does the system need to expose right now?',
      copy: 'This node deliberately brightens the reasoning layer, because good state is usually discovered before it is displayed.',
    },
    decision: {
      kicker: 'Decision',
      title: 'What information makes the next action obvious?',
      copy: 'The end of the loop is not more data. It is a clearer next move.',
    },
  };

  let activeState = '';
  let signalMode = false;
  let gsapInstance = null;

  /**
   * Function contract: setPanel
   * Purpose: Synchronize panel with the requested state while preserving related signal portrait browser feature invariants.
   * Inputs: `panel`: input consumed by this operation; `show`: input consumed by this operation; `hiddenY`: input consumed by this operation
   * Side effects: reads or updates DOM/browser state.
   * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
   */
  const setPanel = (panel, show, hiddenY = 8) => {
    if (!panel) return;
    panel.setAttribute('aria-hidden', String(!show));
    if (gsapInstance && !reduceMotion.matches) {
      gsapInstance.to(panel, {
        y: show ? 0 : hiddenY,
        autoAlpha: show ? 1 : 0,
        duration: show ? 0.26 : 0.16,
        ease: show ? 'power3.out' : 'power2.out',
        overwrite: 'auto',
      });
      return;
    }
    panel.style.opacity = show ? '1' : '0';
    panel.style.visibility = show ? 'visible' : 'hidden';
    panel.style.transform = `translateY(${show ? 0 : hiddenY}px)`;
  };

  /**
   * Function contract: connect
   * Purpose: Implements the connect responsibility for this module.
   * Inputs: node.
   * Side effects: may read or update browser DOM/state.
   * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
   */
  /**
   * Function contract: connect
   * Purpose: Implement the connect responsibility owned by the signal portrait browser feature.
   * Inputs: `node`: input consumed by this operation
   * Side effects: reads or updates DOM/browser state.
   * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
   */
  const connect = (node) => {
    if (!connector || !node) return;
    connector.setAttribute('x2', node.dataset.signalX || '12');
    connector.setAttribute('y2', node.dataset.signalY || '52');
    if (gsapInstance && !reduceMotion.matches) {
      gsapInstance.fromTo(connector, {
        autoAlpha: 0,
        strokeDashoffset: 4,
      }, {
        autoAlpha: 1,
        strokeDashoffset: 0,
        duration: 0.24,
        ease: 'power3.out',
        overwrite: 'auto',
      });
    } else {
      connector.style.opacity = '1';
    }
  };

  /**
   * Function contract: showInsight
   * Purpose: Implements the show insight responsibility for this module.
   * Inputs: state.
   * Side effects: may read or update browser DOM/state.
   * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
   */
  /**
   * Function contract: showInsight
   * Purpose: Implement the show insight responsibility owned by the signal portrait browser feature.
   * Inputs: `state`: input consumed by this operation
   * Side effects: reads or updates DOM/browser state.
   * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
   */
  const showInsight = (state) => {
    const meaning = meanings[state];
    if (!meaning) return;
    if (insightKicker) insightKicker.textContent = meaning.kicker;
    if (insightTitle) insightTitle.textContent = meaning.title;
    if (insightCopy) insightCopy.textContent = meaning.copy;
    setPanel(insight, true, 8);
  };

  /**
   * Function contract: activateState
   * Purpose: Implements the activate state responsibility for this module.
   * Inputs: node.
   * Side effects: may read or update browser DOM/state.
   * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
   */
  /**
   * Function contract: activateState
   * Purpose: Implement the activate state responsibility owned by the signal portrait browser feature.
   * Inputs: `node`: input consumed by this operation
   * Side effects: reads or updates DOM/browser state.
   * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
   */
  const activateState = (node) => {
    const state = node?.dataset.signalState || '';
    if (!state || !meanings[state]) return;
    activeState = state;

    stateNodes.forEach(/** Callback contract: Processes the callback step for state nodes without leaking orchestration details to the caller. Inputs: candidate. Side effects: may read or update browser DOM/state. No explicit return contract. */ /** Callback contract: Apply the enclosing side-effect operation to the current collection item. Inputs: `candidate`. Side effects: reads or updates DOM/browser state. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Apply the enclosing side-effect operation to the current collection item. Inputs: `candidate`. Side effects: reads or updates DOM/browser state. Returns: undefined; callback is side-effect-only. */ (candidate) => {
      const active = candidate === node;
      candidate.classList.toggle('is-active', active);
      candidate.setAttribute('aria-pressed', String(active));
    });

    connect(node);
    showInsight(state);

    const reasoningState = state === 'logic' || state === 'state';
    if (gsapInstance && !reduceMotion.matches) {
      gsapInstance.to(stateNodes, {
        autoAlpha: 0.4,
        scale: 0.92,
        duration: 0.22,
        ease: 'power2.out',
        overwrite: 'auto',
      });
      gsapInstance.to(node, {
        autoAlpha: 1,
        scale: 1.34,
        duration: 0.2,
        ease: 'power3.out',
        overwrite: 'auto',
      });
      if (ghost) {
        gsapInstance.to(ghost, {
          autoAlpha: reasoningState ? 0.34 : 0.18,
          x: reasoningState ? -8 : 0,
          duration: 0.42,
          ease: 'power3.out',
          overwrite: 'auto',
        });
      }
      if (orbitMain) {
        gsapInstance.to(orbitMain, {
          stroke: 'rgba(255,132,70,.98)',
          duration: 0.22,
          overwrite: 'auto',
        });
      }
    } else if (ghost) {
      ghost.style.opacity = reasoningState ? '0.34' : '0.18';
    }
  };

  /**
   * Function contract: resetState
   * Purpose: Implements the reset state responsibility for this module.
   * Inputs: none; the function derives state from its enclosing module/runtime context.
   * Side effects: may read or update browser DOM/state.
   * Returns: no explicit value unless an invoked dependency throws/rejects.
   */
  /**
   * Function contract: resetState
   * Purpose: Implement the reset state responsibility owned by the signal portrait browser feature.
   * Inputs: None; derives required state from the enclosing module/runtime context.
   * Side effects: reads or updates DOM/browser state.
   * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
   */
  const resetState = () => {
    activeState = '';
    stateNodes.forEach(/** Callback contract: Processes the callback step for state nodes without leaking orchestration details to the caller. Inputs: node. Side effects: may read or update browser DOM/state. No explicit return contract. */ /** Callback contract: Apply the enclosing side-effect operation to the current collection item. Inputs: `node`. Side effects: reads or updates DOM/browser state. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Apply the enclosing side-effect operation to the current collection item. Inputs: `node`. Side effects: reads or updates DOM/browser state. Returns: undefined; callback is side-effect-only. */ (node) => {
      node.classList.remove('is-active');
      node.setAttribute('aria-pressed', 'false');
    });

    if (gsapInstance && !reduceMotion.matches) {
      gsapInstance.to(stateNodes, {
        autoAlpha: signalMode ? 0.78 : 1,
        scale: 1,
        duration: 0.2,
        ease: 'power2.out',
        overwrite: 'auto',
      });
      if (connector) gsapInstance.to(connector, { autoAlpha: 0, duration: 0.14, overwrite: 'auto' });
      if (ghost) {
        gsapInstance.to(ghost, {
          autoAlpha: signalMode ? 0.38 : 0,
          x: signalMode ? -4 : 12,
          duration: 0.3,
          overwrite: 'auto',
        });
      }
      if (orbitMain) {
        gsapInstance.to(orbitMain, {
          stroke: signalMode ? 'rgba(255,132,70,1)' : 'rgba(239,106,44,.78)',
          duration: 0.2,
          overwrite: 'auto',
        });
      }
    } else {
      if (connector) connector.style.opacity = '0';
      if (ghost) ghost.style.opacity = signalMode ? '0.38' : '0';
    }
    setPanel(insight, false, 8);
  };

  /**
   * Function contract: setSignalMode
   * Purpose: Applies set signal mode while preserving the surrounding repository/runtime contract.
   * Inputs: next.
   * Side effects: may read or update browser DOM/state.
   * Returns: no explicit value unless an invoked dependency throws/rejects.
   */
  /**
   * Function contract: setSignalMode
   * Purpose: Synchronize signal mode with the requested state while preserving related signal portrait browser feature invariants.
   * Inputs: `next`: input consumed by this operation
   * Side effects: reads or updates DOM/browser state.
   * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
   */
  const setSignalMode = (next) => {
    signalMode = next;
    signalFigure.classList.toggle('is-signal-mode', next);
    signalNode?.classList.toggle('is-active', next);
    signalNode?.setAttribute('aria-pressed', String(next));

    if (gsapInstance && !reduceMotion.matches) {
      if (portrait) {
        gsapInstance.to(portrait, {
          filter: next ? 'brightness(.62) saturate(.62)' : 'brightness(1) saturate(1)',
          duration: 0.35,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      }
      gsapInstance.to(stateNodes, {
        autoAlpha: next ? 0.78 : 1,
        duration: 0.3,
        overwrite: 'auto',
      });
      if (orbitMain) {
        gsapInstance.to(orbitMain, {
          stroke: next ? 'rgba(255,132,70,1)' : 'rgba(239,106,44,.78)',
          strokeWidth: next ? 0.28 : 0.18,
          duration: 0.35,
          overwrite: 'auto',
        });
      }
      if (signalHalo) {
        gsapInstance.to(signalHalo, {
          autoAlpha: next ? 1 : 0,
          attr: { r: next ? 4.2 : 2.4 },
          duration: 0.35,
          ease: 'power3.out',
          overwrite: 'auto',
        });
      }
      if (ghost) {
        gsapInstance.to(ghost, {
          autoAlpha: next ? 0.38 : 0,
          x: next ? -4 : 12,
          duration: 0.45,
          ease: 'power3.out',
          overwrite: 'auto',
        });
      }
    } else {
      if (portrait) portrait.style.filter = next ? 'brightness(.62) saturate(.62)' : 'none';
      if (signalHalo) signalHalo.style.opacity = next ? '1' : '0';
      if (ghost) ghost.style.opacity = next ? '0.38' : '0';
    }

    setPanel(thesis, next, 10);
    if (!next && activeState) {
      const activeNode = stateNodes.find(/** Callback contract: Processes the callback step for state nodes without leaking orchestration details to the caller. Inputs: node. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Return true for the first collection item matching the lookup condition used by the enclosing operation. Inputs: `node`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Identify whether the current item matches the lookup condition for the enclosing search. Inputs: `node`. Side effects: no direct external side effect beyond invoked dependencies. Returns: boolean predicate result. */ (node) => node.dataset.signalState === activeState);
      if (activeNode) activateState(activeNode);
    }
  };

  stateNodes.forEach(/** Callback contract: Processes the callback step for state nodes without leaking orchestration details to the caller. Inputs: node. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Apply the enclosing side-effect operation to the current collection item. Inputs: `node`. Side effects: registers or removes browser event listeners. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Apply the enclosing side-effect operation to the current collection item. Inputs: `node`. Side effects: registers or removes browser listeners. Returns: undefined; callback is side-effect-only. */ (node) => {
    node.addEventListener('click', /** Callback contract: Processes the callback step for node without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Handle the click event for `node` and apply this module's related state update. Inputs: none. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Handle the click event for `node` and apply the related local state update. Inputs: none. Side effects: no direct external side effect beyond invoked dependencies. Returns: computed expression result consumed by the enclosing operation. */ () => activateState(node));
    node.addEventListener('focus', /** Callback contract: Processes the callback step for node without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Handle the focus event for `node` and apply this module's related state update. Inputs: none. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Handle the focus event for `node` and apply the related local state update. Inputs: none. Side effects: no direct external side effect beyond invoked dependencies. Returns: computed expression result consumed by the enclosing operation. */ () => activateState(node));
    node.addEventListener('blur', /** Callback contract: Processes the callback step for node without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Handle the blur event for `node` and apply this module's related state update. Inputs: none. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Handle the blur event for `node` and apply the related local state update. Inputs: none. Side effects: no direct external side effect beyond invoked dependencies. Returns: undefined; callback is side-effect-only. */ () => {
      if (!signalMode) resetState();
    });
    if (finePointer.matches) {
      node.addEventListener('pointerenter', /** Callback contract: Processes the callback step for node without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Handle the pointerenter event for `node` and apply this module's related state update. Inputs: none. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Handle the pointerenter event for `node` and apply the related local state update. Inputs: none. Side effects: no direct external side effect beyond invoked dependencies. Returns: computed expression result consumed by the enclosing operation. */ () => activateState(node));
      node.addEventListener('pointerleave', /** Callback contract: Processes the callback step for node without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Handle the pointerleave event for `node` and apply this module's related state update. Inputs: none. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Handle the pointerleave event for `node` and apply the related local state update. Inputs: none. Side effects: no direct external side effect beyond invoked dependencies. Returns: undefined; callback is side-effect-only. */ () => {
        if (!signalMode) resetState();
      });
    }
  });

  signalNode?.addEventListener('click', /** Callback contract: Processes the callback step for signal node? without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Handle the click event for `signalNode` and apply this module's related state update. Inputs: none. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Handle the click event for `signalNode` and apply the related local state update. Inputs: none. Side effects: no direct external side effect beyond invoked dependencies. Returns: computed expression result consumed by the enclosing operation. */ () => setSignalMode(!signalMode));

  document.addEventListener('keydown', /** Callback contract: Processes the callback step for document without leaking orchestration details to the caller. Inputs: event. Side effects: no obvious external side effect beyond invoked dependencies. Returns a value to the invoking API. */ /** Callback contract: Handle keydown input for Escape/Tab behavior and keyboard focus containment. Inputs: `event`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Handle keydown input for Escape/Tab behavior and keyboard focus containment. Inputs: `event`. Side effects: no direct external side effect beyond invoked dependencies. Returns: undefined; callback is side-effect-only. */ (event) => {
    if (event.key !== 'Escape') return;
    setSignalMode(false);
    resetState();
  });

  /**
   * Function contract: setupGsap
   * Purpose: Applies setup gsap while preserving the surrounding repository/runtime contract.
   * Inputs: none; the function derives state from its enclosing module/runtime context.
   * Side effects: may emit diagnostics or inspect process state.
   * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
   */
  /**
   * Function contract: setupGsap
   * Purpose: Initialize gsap for the signal portrait browser feature, including the listeners/state needed for safe runtime use.
   * Inputs: None; derives required state from the enclosing module/runtime context.
   * Side effects: registers or removes browser event listeners; emits diagnostics or changes process failure state.
   * Returns: Promise that resolves when the asynchronous side effects complete.
   */
  const setupGsap = async () => {
    if (reduceMotion.matches) return;
    try {
      const { gsap } = await import('https://cdn.jsdelivr.net/npm/gsap@3.13.0/index.js');
      gsapInstance = gsap;

      gsap.killTweensOf([portrait, ghost, ...stateNodes, ...orbitPaths, insight, thesis]);
      if (insight) gsap.set(insight, { autoAlpha: 0, y: 8 });
      if (thesis) gsap.set(thesis, { autoAlpha: 0, y: 10 });

      const entrance = gsap.timeline({ defaults: { ease: 'power3.out' } });
      if (portrait) {
        entrance.fromTo(portrait, {
          autoAlpha: 0,
          scale: 1.018,
        }, {
          autoAlpha: 0.98,
          scale: 1.002,
          duration: 0.7,
        });
      }
      if (orbitPaths.length) {
        entrance.fromTo(orbitPaths, {
          strokeDasharray: 1,
          strokeDashoffset: 1,
          autoAlpha: 0,
        }, {
          strokeDashoffset: 0,
          autoAlpha: 1,
          duration: 0.62,
        }, '<.08');
      }
      if (stateNodes.length) {
        entrance.fromTo(stateNodes, {
          scale: 0,
          autoAlpha: 0,
        }, {
          scale: 1,
          autoAlpha: 1,
          duration: 0.3,
          stagger: 0.045,
        }, '-=.2');
      }

      if (finePointer.matches && portrait && ghost && orbitSvg) {
        const posterX = gsap.quickTo(portrait, 'x', { duration: 0.35, ease: 'power3.out' });
        const posterY = gsap.quickTo(portrait, 'y', { duration: 0.35, ease: 'power3.out' });
        const ghostX = gsap.quickTo(ghost, 'x', { duration: 0.45, ease: 'power3.out' });
        const ghostY = gsap.quickTo(ghost, 'y', { duration: 0.45, ease: 'power3.out' });
        const orbitX = gsap.quickTo(orbitSvg, 'x', { duration: 0.4, ease: 'power3.out' });
        const orbitY = gsap.quickTo(orbitSvg, 'y', { duration: 0.4, ease: 'power3.out' });

        signalFigure.addEventListener('pointermove', /** Callback contract: Processes the callback step for signal figure without leaking orchestration details to the caller. Inputs: event. Side effects: no obvious external side effect beyond invoked dependencies. Returns a value to the invoking API. */ /** Callback contract: Handle the pointermove event for `signalFigure` and apply this module's related state update. Inputs: `event`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Handle the pointermove event for `signalFigure` and apply the related local state update. Inputs: `event`. Side effects: no direct external side effect beyond invoked dependencies. Returns: undefined; callback is side-effect-only. */ (event) => {
          if (event.pointerType === 'touch') return;
          const rect = signalFigure.getBoundingClientRect();
          const nx = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
          const ny = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
          posterX(nx * 2);
          posterY(ny * 2);
          ghostX((signalMode ? -4 : 12) + nx * -7);
          ghostY(ny * -5);
          orbitX(nx * 5);
          orbitY(ny * 4);
        }, { passive: true });

        signalFigure.addEventListener('pointerleave', /** Callback contract: Processes the callback step for signal figure without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Handle the pointerleave event for `signalFigure` and apply this module's related state update. Inputs: none. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Handle the pointerleave event for `signalFigure` and apply the related local state update. Inputs: none. Side effects: no direct external side effect beyond invoked dependencies. Returns: undefined; callback is side-effect-only. */ () => {
          posterX(0);
          posterY(0);
          ghostX(signalMode ? -4 : 12);
          ghostY(0);
          orbitX(0);
          orbitY(0);
        }, { passive: true });
      }
    } catch (error) {
      console.warn('[portfolio] Signal portrait GSAP enhancement unavailable; static interaction remains active.', error);
    }
  };

  setupGsap();
}
