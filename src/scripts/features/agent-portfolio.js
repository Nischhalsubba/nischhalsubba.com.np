const root = document.querySelector('.agent-portfolio');

if (root) {
  const html = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(pointer: fine)');
  const desktop = window.matchMedia('(min-width: 900px)');
  const saveData = Boolean(navigator.connection && navigator.connection.saveData);
  let threeThemeSync = null;

  const qs = (selector, scope = document) => scope.querySelector(selector);
  const qsa = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

  function setTheme(nextTheme) {
    const theme = nextTheme === 'dark' ? 'dark' : 'light';
    html.setAttribute('data-theme', theme);
    html.style.colorScheme = theme;
    html.setAttribute('data-theme-source', 'manual');
    try {
      sessionStorage.setItem('nrs-theme-override', theme);
    } catch (_) {
      // Storage can be blocked. The current page theme still works.
    }
    threeThemeSync?.();
  }

  function setupThemeToggle() {
    const toggle = qs('#theme-toggle');
    if (!toggle) return;
    toggle.setAttribute('aria-label', 'Switch color theme');
    toggle.addEventListener('click', () => {
      setTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });
  }

  function setupMobileNavigation() {
    const toggle = qs('.mobile-nav-toggle');
    const overlay = qs('#mobile-nav-overlay');
    if (!toggle || !overlay) return;

    const links = qsa('a, button', overlay).filter((el) => !el.hasAttribute('disabled'));
    overlay.inert = true;

    const close = ({ restoreFocus = true } = {}) => {
      overlay.classList.remove('is-open');
      overlay.dataset.open = 'false';
      overlay.inert = true;
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open navigation menu');
      root.classList.remove('agent-menu-open');
      if (restoreFocus) toggle.focus({ preventScroll: true });
    };

    const open = () => {
      overlay.inert = false;
      overlay.classList.add('is-open');
      overlay.dataset.open = 'true';
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Close navigation menu');
      root.classList.add('agent-menu-open');
      requestAnimationFrame(() => links[0]?.focus({ preventScroll: true }));
    };

    toggle.addEventListener('click', () => {
      if (toggle.getAttribute('aria-expanded') === 'true') close();
      else open();
    });

    overlay.addEventListener('click', (event) => {
      if (event.target.closest('a')) close({ restoreFocus: false });
    });

    document.addEventListener('keydown', (event) => {
      if (toggle.getAttribute('aria-expanded') !== 'true') return;
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== 'Tab' || links.length === 0) return;
      const first = links[0];
      const last = links[links.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    desktop.addEventListener('change', (event) => {
      if (event.matches && toggle.getAttribute('aria-expanded') === 'true') {
        close({ restoreFocus: false });
      }
    });
  }

  function setupScrollProgress() {
    const progress = qs('#agent-progress');
    if (!progress) return;
    let ticking = false;

    const update = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      root.style.setProperty('--agent-scroll', String(clamp(window.scrollY / max, 0.01, 1)));
      ticking = false;
    };

    const requestUpdate = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    update();
    addEventListener('scroll', requestUpdate, { passive: true });
    addEventListener('resize', requestUpdate, { passive: true });
    addEventListener('pageshow', requestUpdate, { passive: true });
  }

  function setupFallbackReveal() {
    const targets = qsa('[data-agent-reveal]');
    if (!targets.length) return;
    root.classList.add('agent-motion-ready');

    if (reduceMotion.matches || !('IntersectionObserver' in window)) {
      targets.forEach((el) => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.animate(
          [
            { opacity: 0, transform: 'translateY(20px)' },
            { opacity: 1, transform: 'translateY(0)' },
          ],
          { duration: 360, easing: 'cubic-bezier(0.2, 0, 0, 1)', fill: 'forwards' },
        );
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    targets.forEach((el) => observer.observe(el));
  }

  async function setupGsapMotion() {
    if (reduceMotion.matches) return false;
    const targets = qsa('[data-agent-reveal]');
    if (!targets.length) return false;

    try {
      const [{ gsap }, scrollModule] = await Promise.all([
        import('https://cdn.jsdelivr.net/npm/gsap@3.13.0/index.js'),
        import('https://cdn.jsdelivr.net/npm/gsap@3.13.0/ScrollTrigger.js'),
      ]);
      const { ScrollTrigger } = scrollModule;
      gsap.registerPlugin(ScrollTrigger);
      root.classList.add('agent-motion-ready');

      const heroTargets = qsa('.agent-hero [data-agent-reveal]');
      if (heroTargets.length) {
        gsap.fromTo(
          heroTargets,
          { y: 28, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.62,
            stagger: 0.055,
            ease: 'power3.out',
            clearProps: 'transform,opacity,visibility',
          },
        );
      }

      const sectionTargets = targets.filter((el) => !el.closest('.agent-hero'));
      ScrollTrigger.batch(sectionTargets, {
        start: 'top 88%',
        once: true,
        onEnter: (elements) => {
          gsap.fromTo(
            elements,
            { y: 20, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.42,
              stagger: 0.045,
              ease: 'power3.out',
              overwrite: 'auto',
              clearProps: 'transform,opacity,visibility',
            },
          );
        },
      });

      if (desktop.matches) {
        qsa('.agent-project-media img').forEach((image) => {
          gsap.fromTo(
            image,
            { yPercent: -2 },
            {
              yPercent: 5,
              ease: 'none',
              scrollTrigger: {
                trigger: image.closest('.agent-project-row') || image,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.7,
              },
            },
          );
        });
      }

      qsa('.agent-project-row').forEach((row) => {
        const media = qs('.agent-project-media', row);
        if (!media || !finePointer.matches) return;
        const move = gsap.quickTo(media, 'x', { duration: 0.18, ease: 'power2.out' });
        row.addEventListener('pointermove', (event) => {
          const bounds = row.getBoundingClientRect();
          move(((event.clientX - bounds.left) / bounds.width - 0.5) * 3);
        });
        row.addEventListener('pointerleave', () => move(0));
      });

      const cleanup = () => {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      };
      addEventListener('pagehide', cleanup, { once: true });
      return true;
    } catch (_) {
      return false;
    }
  }

  async function setupThreeField() {
    const canvas = qs('.agent-three-canvas');
    const figure = qs('.agent-system-figure');
    const hero = qs('.agent-hero');
    if (!canvas || !figure || !hero) return;
    if (reduceMotion.matches || saveData || !finePointer.matches || !desktop.matches) return;

    let THREE;
    try {
      THREE = await import('https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js');
    } catch (_) {
      return;
    }

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch (_) {
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0, 7.2);

    const group = new THREE.Group();
    scene.add(group);

    const count = 112;
    const positions = new Float32Array(count * 3);
    const scattered = new Float32Array(count * 3);
    const targets = new Float32Array(count * 3);
    const phases = new Float32Array(count);

    const cols = 14;
    const rows = 8;
    for (let i = 0; i < count; i += 1) {
      const ix = i * 3;
      const col = i % cols;
      const row = Math.floor(i / cols) % rows;
      const sx = (Math.random() - 0.5) * 7.2;
      const sy = (Math.random() - 0.5) * 5.2;
      const sz = (Math.random() - 0.5) * 3.8;
      scattered[ix] = sx;
      scattered[ix + 1] = sy;
      scattered[ix + 2] = sz;
      positions[ix] = sx;
      positions[ix + 1] = sy;
      positions[ix + 2] = sz;
      targets[ix] = (col - (cols - 1) / 2) * 0.39;
      targets[ix + 1] = ((rows - 1) / 2 - row) * 0.42;
      targets[ix + 2] = Math.sin(col * 0.72 + row * 0.55) * 0.18;
      phases[i] = Math.random() * Math.PI * 2;
    }

    const pointsGeometry = new THREE.BufferGeometry();
    const positionAttribute = new THREE.BufferAttribute(positions, 3);
    pointsGeometry.setAttribute('position', positionAttribute);

    const pointsMaterial = new THREE.PointsMaterial({
      color: 0xff4d00,
      size: 0.055,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });

    const points = new THREE.Points(pointsGeometry, pointsMaterial);
    group.add(points);

    const gridVertices = [];
    for (let c = 0; c < cols; c += 1) {
      const x = (c - (cols - 1) / 2) * 0.39;
      gridVertices.push(x, -1.55, 0, x, 1.55, 0);
    }
    for (let r = 0; r < rows; r += 1) {
      const y = ((rows - 1) / 2 - r) * 0.42;
      gridVertices.push(-2.55, y, 0, 2.55, y, 0);
    }
    const gridGeometry = new THREE.BufferGeometry();
    gridGeometry.setAttribute('position', new THREE.Float32BufferAttribute(gridVertices, 3));
    const gridMaterial = new THREE.LineBasicMaterial({
      color: 0x11110f,
      transparent: true,
      opacity: 0.14,
      depthWrite: false,
    });
    const grid = new THREE.LineSegments(gridGeometry, gridMaterial);
    grid.position.z = -0.3;
    group.add(grid);

    const pointer = { x: 0, y: 0 };
    let order = 0.08;
    let targetOrder = 0.08;
    let frame = 0;
    let active = true;
    let visible = true;
    const clock = new THREE.Clock();

    function syncTheme() {
      const styles = getComputedStyle(root);
      const signal = styles.getPropertyValue('--ap-signal').trim() || '#FF4D00';
      const ink = styles.getPropertyValue('--ap-ink').trim() || '#11110F';
      pointsMaterial.color.set(signal);
      gridMaterial.color.set(ink);
    }
    threeThemeSync = syncTheme;
    syncTheme();

    function resize() {
      const rect = figure.getBoundingClientRect();
      const width = Math.max(1, Math.round(rect.width));
      const height = Math.max(1, Math.round(rect.height));
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }

    function updateScrollOrder() {
      const rect = hero.getBoundingClientRect();
      const travel = Math.max(window.innerHeight * 0.72, hero.offsetHeight * 0.74);
      targetOrder = clamp((-rect.top + window.innerHeight * 0.06) / travel, 0.08, 1);
    }

    function onPointer(event) {
      const rect = figure.getBoundingClientRect();
      pointer.x = clamp((event.clientX - rect.left) / rect.width, 0, 1) * 2 - 1;
      pointer.y = clamp((event.clientY - rect.top) / rect.height, 0, 1) * 2 - 1;
    }

    const observer = new IntersectionObserver((entries) => {
      visible = entries.some((entry) => entry.isIntersecting);
    }, { rootMargin: '15% 0px' });
    observer.observe(figure);

    function tick() {
      if (!active) return;
      frame = requestAnimationFrame(tick);
      if (!visible || document.hidden) return;

      const elapsed = clock.getElapsedTime();
      order += (targetOrder - order) * 0.045;
      const pos = positionAttribute.array;
      for (let i = 0; i < count; i += 1) {
        const ix = i * 3;
        const ambient = (1 - order) * 0.11;
        const nx = Math.sin(elapsed * 0.35 + phases[i]) * ambient;
        const ny = Math.cos(elapsed * 0.28 + phases[i] * 1.3) * ambient;
        const tx = scattered[ix] + (targets[ix] - scattered[ix]) * order + nx;
        const ty = scattered[ix + 1] + (targets[ix + 1] - scattered[ix + 1]) * order + ny;
        const tz = scattered[ix + 2] + (targets[ix + 2] - scattered[ix + 2]) * order;
        pos[ix] += (tx - pos[ix]) * 0.08;
        pos[ix + 1] += (ty - pos[ix + 1]) * 0.08;
        pos[ix + 2] += (tz - pos[ix + 2]) * 0.08;
      }
      positionAttribute.needsUpdate = true;
      group.rotation.y += (pointer.x * 0.055 - group.rotation.y) * 0.035;
      group.rotation.x += (-pointer.y * 0.04 - group.rotation.x) * 0.035;
      gridMaterial.opacity = 0.05 + order * 0.13;
      renderer.render(scene, camera);
    }

    resize();
    updateScrollOrder();
    figure.addEventListener('pointermove', onPointer, { passive: true });
    addEventListener('resize', resize, { passive: true });
    addEventListener('scroll', updateScrollOrder, { passive: true });
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) clock.getDelta();
    });
    tick();

    const cleanup = () => {
      active = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
      figure.removeEventListener('pointermove', onPointer);
      removeEventListener('resize', resize);
      removeEventListener('scroll', updateScrollOrder);
      pointsGeometry.dispose();
      pointsMaterial.dispose();
      gridGeometry.dispose();
      gridMaterial.dispose();
      renderer.dispose();
      renderer.forceContextLoss?.();
      threeThemeSync = null;
    };

    addEventListener('pagehide', cleanup, { once: true });
    reduceMotion.addEventListener('change', (event) => {
      if (event.matches) cleanup();
    }, { once: true });
  }

  function setupCaseRail() {
    const railLinks = qsa('.agent-case-rail a');
    const sections = qsa('.agent-case-chapter[id]');
    if (!railLinks.length || !sections.length || !('IntersectionObserver' in window)) return;

    const byId = new Map(railLinks.map((link) => [link.getAttribute('href')?.slice(1), link]));
    const observer = new IntersectionObserver((entries) => {
      const current = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!current) return;
      railLinks.forEach((link) => link.removeAttribute('aria-current'));
      byId.get(current.target.id)?.setAttribute('aria-current', 'true');
    }, { threshold: [0.25, 0.5, 0.75], rootMargin: '-18% 0px -55% 0px' });
    sections.forEach((section) => observer.observe(section));
  }

  function setupProjectKeyboardAffordance() {
    qsa('.agent-project-row, .agent-index-item').forEach((link) => {
      link.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') link.click();
      });
    });
  }

  setupThemeToggle();
  setupMobileNavigation();
  setupScrollProgress();
  setupCaseRail();
  setupProjectKeyboardAffordance();

  setupGsapMotion().then((loaded) => {
    if (!loaded) setupFallbackReveal();
  });
  setupThreeField();
}
