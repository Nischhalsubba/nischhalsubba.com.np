const signalFigure = document.querySelector('[data-signal-portrait]');

if (signalFigure && signalFigure.dataset.signalReady !== 'true') {
  signalFigure.dataset.signalReady = 'true';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const stateNodes = Array.from(signalFigure.querySelectorAll('[data-signal-state]'));
  const signalNode = signalFigure.querySelector('[data-signal-node="signal"]');
  const connector = signalFigure.querySelector('[data-signal-connector]');
  const portrait = signalFigure.querySelector('.nrs-signal-portrait--main');
  const ghost = signalFigure.querySelector('.nrs-signal-portrait--ghost');
  const canvas = signalFigure.querySelector('.agent-three-canvas');
  const thesis = signalFigure.querySelector('[data-signal-thesis]');
  const insight = signalFigure.querySelector('[data-signal-insight]');
  const insightKicker = signalFigure.querySelector('[data-signal-kicker]');
  const insightTitle = signalFigure.querySelector('[data-signal-title]');
  const insightCopy = signalFigure.querySelector('[data-signal-copy]');
  const concepts = Array.from(signalFigure.querySelectorAll('[data-signal-concept]'));

  const meanings = {
    intent: {
      kicker: 'Intent',
      title: 'What is the person actually trying to accomplish?',
      copy: 'Start from user intent, not from the amount of interface the product is capable of showing.',
    },
    logic: {
      kicker: 'Product logic',
      title: 'What rules decide what can happen next?',
      copy: 'Inputs, constraints and permissions form the system underneath the visible screen.',
    },
    state: {
      kicker: 'Important state',
      title: 'What must the interface expose right now?',
      copy: 'The useful state is the one that changes what the person understands or can do next.',
    },
    decision: {
      kicker: 'Decision',
      title: 'What makes the next action obvious?',
      copy: 'The goal is not more information. It is a clearer and safer next move.',
    },
  };

  let lockedState = '';
  let activeState = '';
  let signalMode = false;
  let gsapInstance = null;

  const showPanel = (panel, show) => {
    if (!panel) return;
    panel.setAttribute('aria-hidden', String(!show));
    if (gsapInstance && !reduceMotion.matches) {
      gsapInstance.to(panel, {
        y: show ? 0 : 7,
        autoAlpha: show ? 1 : 0,
        duration: show ? 0.26 : 0.14,
        ease: show ? 'power3.out' : 'power2.in',
        overwrite: 'auto',
      });
    } else {
      panel.style.opacity = show ? '1' : '0';
      panel.style.visibility = show ? 'visible' : 'hidden';
      panel.style.transform = show ? 'translateY(0)' : 'translateY(7px)';
    }
  };

  const syncQuote = (state) => {
    concepts.forEach((concept) => {
      concept.classList.toggle('is-highlighted', concept.dataset.signalConcept === state);
    });
  };

  const syncNodePressedState = (state) => {
    stateNodes.forEach((node) => {
      const active = node.dataset.signalState === state;
      node.classList.toggle('is-active', active);
      node.setAttribute('aria-pressed', String(active && lockedState === state));
    });
  };

  const moveConnector = (node) => {
    if (!connector || !node) return;
    connector.setAttribute('x2', node.dataset.signalX || '22');
    connector.setAttribute('y2', node.dataset.signalY || '59');
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

  const animateReasoning = (state) => {
    const reasoning = state === 'logic' || state === 'state';
    signalFigure.classList.toggle('is-reasoning', reasoning || signalMode);
    if (!gsapInstance || reduceMotion.matches || !ghost) return;
    gsapInstance.to(ghost, {
      x: reasoning ? -8 : 0,
      autoAlpha: reasoning ? 0.3 : (signalMode ? 0.32 : 0.11),
      duration: 0.34,
      ease: 'power3.out',
      overwrite: 'auto',
    });
  };

  const activateState = (node) => {
    const state = node?.dataset.signalState || '';
    const meaning = meanings[state];
    if (!state || !meaning) return;
    activeState = state;
    syncNodePressedState(state);
    syncQuote(state);
    moveConnector(node);
    signalFigure.dataset.signalState = state;
    animateReasoning(state);

    if (insightKicker) insightKicker.textContent = meaning.kicker;
    if (insightTitle) insightTitle.textContent = meaning.title;
    if (insightCopy) insightCopy.textContent = meaning.copy;
    showPanel(insight, true);
  };

  const clearState = ({ force = false } = {}) => {
    if (lockedState && !force) {
      const lockedNode = stateNodes.find((node) => node.dataset.signalState === lockedState);
      if (lockedNode) activateState(lockedNode);
      return;
    }
    activeState = '';
    signalFigure.removeAttribute('data-signal-state');
    syncNodePressedState('');
    syncQuote('');
    showPanel(insight, false);
    if (connector) {
      if (gsapInstance && !reduceMotion.matches) {
        gsapInstance.to(connector, { autoAlpha: 0, duration: 0.14, overwrite: 'auto' });
      } else {
        connector.style.opacity = '0';
      }
    }
    animateReasoning('');
  };

  const toggleStateLock = (node) => {
    const state = node.dataset.signalState || '';
    lockedState = lockedState === state ? '' : state;
    if (lockedState) activateState(node);
    else clearState({ force: true });
  };

  const setSignalMode = (next) => {
    signalMode = next;
    signalFigure.classList.toggle('is-signal-mode', next);
    signalNode?.classList.toggle('is-active', next);
    signalNode?.setAttribute('aria-pressed', String(next));
    signalFigure.classList.toggle('is-reasoning', next || activeState === 'logic' || activeState === 'state');
    showPanel(thesis, next);

    if (gsapInstance && !reduceMotion.matches) {
      if (canvas) gsapInstance.to(canvas, { autoAlpha: next ? 0.16 : 0.52, duration: 0.32, ease: 'power2.out', overwrite: 'auto' });
      if (portrait) gsapInstance.to(portrait, { autoAlpha: next ? 0.82 : 0.72, duration: 0.32, ease: 'power2.out', overwrite: 'auto' });
      if (ghost) gsapInstance.to(ghost, { x: next ? -8 : 0, autoAlpha: next ? 0.32 : (activeState === 'logic' || activeState === 'state' ? 0.3 : 0.11), duration: 0.36, ease: 'power3.out', overwrite: 'auto' });
    }
  };

  stateNodes.forEach((node) => {
    node.addEventListener('click', () => toggleStateLock(node));
    node.addEventListener('focus', () => activateState(node));
    node.addEventListener('blur', () => clearState());
    if (finePointer.matches) {
      node.addEventListener('pointerenter', () => activateState(node));
      node.addEventListener('pointerleave', () => clearState());
    }
  });

  signalNode?.addEventListener('click', () => setSignalMode(!signalMode));

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    lockedState = '';
    clearState({ force: true });
    setSignalMode(false);
  });

  const setupGsap = async () => {
    if (reduceMotion.matches) return;
    try {
      const [{ gsap }, scrollModule] = await Promise.all([
        import('https://cdn.jsdelivr.net/npm/gsap@3.13.0/index.js'),
        import('https://cdn.jsdelivr.net/npm/gsap@3.13.0/ScrollTrigger.js'),
      ]);
      const { ScrollTrigger } = scrollModule;
      gsap.registerPlugin(ScrollTrigger);
      gsapInstance = gsap;

      const nodeTargets = stateNodes.concat(signalNode ? [signalNode] : []);
      gsap.fromTo(portrait, { x: 10, autoAlpha: 0 }, { x: 0, autoAlpha: 0.72, duration: 0.56, ease: 'power3.out', overwrite: 'auto' });
      gsap.fromTo(ghost, { x: 16, autoAlpha: 0 }, { x: 0, autoAlpha: 0.11, duration: 0.52, delay: 0.06, ease: 'power3.out', overwrite: 'auto' });
      gsap.fromTo(nodeTargets, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.24, stagger: 0.035, delay: 0.14, ease: 'power2.out', overwrite: 'auto' });

      if (finePointer.matches && portrait && ghost) {
        const portraitX = gsap.quickTo(portrait, 'x', { duration: 0.34, ease: 'power3.out' });
        const portraitY = gsap.quickTo(portrait, 'y', { duration: 0.34, ease: 'power3.out' });
        const ghostX = gsap.quickTo(ghost, 'x', { duration: 0.42, ease: 'power3.out' });
        const ghostY = gsap.quickTo(ghost, 'y', { duration: 0.42, ease: 'power3.out' });

        signalFigure.addEventListener('pointermove', (event) => {
          if (activeState || signalMode) return;
          const rect = signalFigure.getBoundingClientRect();
          const nx = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
          const ny = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
          portraitX(nx * 3);
          portraitY(ny * 2);
          ghostX(nx * -7);
          ghostY(ny * -5);
        }, { passive: true });

        signalFigure.addEventListener('pointerleave', () => {
          if (activeState || signalMode) return;
          portraitX(0); portraitY(0); ghostX(0); ghostY(0);
        }, { passive: true });
      }

      ScrollTrigger.refresh();
    } catch (error) {
      console.warn('[portfolio] Signal portrait GSAP enhancement unavailable; static interaction remains active.', error);
    }
  };

  setupGsap();
}
