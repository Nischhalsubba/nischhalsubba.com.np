const THREE_MODULE_URL = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.185.1/three.module.min.js';
const LOCAL_GSAP_URL = '/assets/vendor/gsap.min.js';
const LOCAL_SCROLL_TRIGGER_URL = '/assets/vendor/ScrollTrigger.min.js';

function reducedMotionRequested() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function loadClassicScript(src, globalName) {
  if (window[globalName]) return Promise.resolve(window[globalName]);
  const existing = document.querySelector(`script[data-nrs-runtime="${globalName}"]`);
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener('load', () => resolve(window[globalName]), { once: true });
      existing.addEventListener('error', reject, { once: true });
    });
  }
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.dataset.nrsRuntime = globalName;
    script.addEventListener('load', () => resolve(window[globalName]), { once: true });
    script.addEventListener('error', () => reject(new Error(`Failed to load ${src}`)), { once: true });
    document.head.appendChild(script);
  });
}

function syncThemeToBody() {
  const body = document.body;
  if (!body) return () => {};
  const sync = () => {
    body.dataset.nrsTheme = document.documentElement.getAttribute('data-theme') || 'dark';
  };
  sync();
  const observer = new MutationObserver(sync);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  return () => observer.disconnect();
}

function initHeaderState() {
  const header = document.querySelector('[data-nrs-site-header]');
  if (!header) return () => {};
  let frame = 0;
  const update = () => {
    frame = 0;
    header.classList.toggle('is-condensed', window.scrollY > 24);
  };
  const onScroll = () => {
    if (frame) return;
    frame = window.requestAnimationFrame(update);
  };
  update();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  return () => {
    if (frame) window.cancelAnimationFrame(frame);
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onScroll);
  };
}

function initFallbackReveals() {
  const elements = [...document.querySelectorAll('.nrs-motion-reveal')];
  if (!elements.length || reducedMotionRequested() || !('IntersectionObserver' in window)) {
    elements.forEach((element) => element.classList.add('is-visible'));
    return () => {};
  }
  document.body.classList.add('motion-ready');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  elements.forEach((element) => observer.observe(element));
  return () => observer.disconnect();
}

async function initGsapMotion() {
  if (reducedMotionRequested()) {
    document.querySelectorAll('.nrs-motion-reveal').forEach((element) => element.classList.add('is-visible'));
    return () => {};
  }
  try {
    await loadClassicScript(LOCAL_GSAP_URL, 'gsap');
    await loadClassicScript(LOCAL_SCROLL_TRIGGER_URL, 'ScrollTrigger');
  } catch (error) {
    console.warn('[portfolio] GSAP enhancement unavailable; using observer fallback.', error);
    return initFallbackReveals();
  }
  const { gsap, ScrollTrigger } = window;
  if (!gsap) return initFallbackReveals();
  if (ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  document.body.classList.add('motion-ready');
  const mm = gsap.matchMedia();
  mm.add({
    desktop: '(min-width: 851px)',
    finePointer: '(hover: hover) and (pointer: fine)',
    reduceMotion: '(prefers-reduced-motion: reduce)',
  }, (context) => {
    const { desktop, finePointer, reduceMotion } = context.conditions;
    const hero = [...document.querySelectorAll('[data-nrs-hero-reveal]')];
    const reveals = [...document.querySelectorAll('.nrs-motion-reveal')];

    if (reduceMotion) {
      gsap.set([...hero, ...reveals], { clearProps: 'all' });
      reveals.forEach((element) => element.classList.add('is-visible'));
      return undefined;
    }

    if (hero.length) {
      gsap.fromTo(hero, { autoAlpha: 0, y: 20 }, {
        autoAlpha: 1,
        y: 0,
        duration: 0.68,
        stagger: 0.055,
        ease: 'power3.out',
        clearProps: 'opacity,visibility,transform',
      });
    }

    reveals.forEach((element) => {
      gsap.fromTo(element, { autoAlpha: 0, y: 18 }, {
        autoAlpha: 1,
        y: 0,
        duration: 0.54,
        ease: 'power3.out',
        clearProps: 'opacity,visibility,transform',
        onStart: () => element.classList.add('is-visible'),
        scrollTrigger: ScrollTrigger ? { trigger: element, start: 'top 88%', once: true } : undefined,
      });
    });

    if (desktop && ScrollTrigger) {
      document.querySelectorAll('[data-nrs-project-media] img').forEach((image) => {
        gsap.fromTo(image, { '--nrs-project-y': '-3%' }, {
          '--nrs-project-y': '3%',
          ease: 'none',
          scrollTrigger: {
            trigger: image.closest('[data-nrs-project-media]'),
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.5,
          },
        });
      });
    }

    if (finePointer) {
      document.querySelectorAll('[data-nrs-project]').forEach((project) => {
        const media = project.querySelector('[data-nrs-project-media]');
        if (!media) return;
        gsap.set(media, { transformPerspective: 900, transformOrigin: 'center' });
        const rotateX = gsap.quickTo(media, 'rotationX', { duration: 0.45, ease: 'power3.out', overwrite: 'auto' });
        const rotateY = gsap.quickTo(media, 'rotationY', { duration: 0.45, ease: 'power3.out', overwrite: 'auto' });
        const onMove = (event) => {
          const rect = media.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width - 0.5;
          const y = (event.clientY - rect.top) / rect.height - 0.5;
          rotateX(y * -3.2);
          rotateY(x * 3.2);
        };
        const onLeave = () => {
          rotateX(0);
          rotateY(0);
        };
        project.addEventListener('pointermove', onMove, { passive: true });
        project.addEventListener('pointerleave', onLeave, { passive: true });
        context.add(() => {
          project.removeEventListener('pointermove', onMove);
          project.removeEventListener('pointerleave', onLeave);
        });
      });
    }
    return undefined;
  });
  window.requestAnimationFrame(() => ScrollTrigger?.refresh());
  return () => mm.revert();
}

function seededRandom(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function canUseWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

async function initThreeField() {
  const mount = document.querySelector('[data-nrs-three-field]');
  if (!mount) return () => {};
  const host = mount.closest('.nrs-hero-field');
  const reducedMotion = reducedMotionRequested();
  const saveData = navigator.connection?.saveData === true;
  const lowMemory = typeof navigator.deviceMemory === 'number' && navigator.deviceMemory <= 2;
  if (!canUseWebGL() || saveData || lowMemory) {
    host?.classList.add('nrs-three-unavailable');
    return () => {};
  }

  let THREE;
  try {
    THREE = await import(/* @vite-ignore */ THREE_MODULE_URL);
  } catch (error) {
    host?.classList.add('nrs-three-unavailable');
    console.warn('[portfolio] Three.js signature unavailable; keeping CSS fallback.', error);
    return () => {};
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 40);
  camera.position.set(0, 0, 5.2);
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  mount.appendChild(renderer.domElement);

  const group = new THREE.Group();
  scene.add(group);
  const style = getComputedStyle(document.body);
  const accent = new THREE.Color(style.getPropertyValue('--nrs-ed-accent').trim() || '#d8ff48');
  const muted = new THREE.Color(style.getPropertyValue('--nrs-ed-muted').trim() || '#aeb5a6');

  const sourceGeometry = new THREE.IcosahedronGeometry(1.25, 1);
  const edgeGeometry = new THREE.EdgesGeometry(sourceGeometry, 16);
  sourceGeometry.dispose();
  const edgeMaterial = new THREE.LineBasicMaterial({ color: accent, transparent: true, opacity: 0.76 });
  const core = new THREE.LineSegments(edgeGeometry, edgeMaterial);
  core.rotation.set(0.32, -0.48, 0.08);
  group.add(core);

  const random = seededRandom(845324);
  const pointCount = 86;
  const pointPositions = new Float32Array(pointCount * 3);
  const vectors = [];
  for (let index = 0; index < pointCount; index += 1) {
    const radius = 1.7 + random() * 1.35;
    const theta = random() * Math.PI * 2;
    const phi = Math.acos(2 * random() - 1);
    const vector = new THREE.Vector3(radius * Math.sin(phi) * Math.cos(theta), radius * Math.cos(phi) * 0.84, radius * Math.sin(phi) * Math.sin(theta));
    vectors.push(vector);
    pointPositions[index * 3] = vector.x;
    pointPositions[index * 3 + 1] = vector.y;
    pointPositions[index * 3 + 2] = vector.z;
  }
  const pointsGeometry = new THREE.BufferGeometry();
  pointsGeometry.setAttribute('position', new THREE.BufferAttribute(pointPositions, 3));
  const pointsMaterial = new THREE.PointsMaterial({ color: muted, size: 0.026, sizeAttenuation: true, transparent: true, opacity: 0.64 });
  const points = new THREE.Points(pointsGeometry, pointsMaterial);
  group.add(points);

  const segmentPositions = [];
  const maxSegments = 130;
  let segmentCount = 0;
  for (let first = 0; first < vectors.length && segmentCount < maxSegments; first += 1) {
    for (let second = first + 1; second < vectors.length && segmentCount < maxSegments; second += 1) {
      if (vectors[first].distanceToSquared(vectors[second]) > 0.72) continue;
      segmentPositions.push(vectors[first].x, vectors[first].y, vectors[first].z, vectors[second].x, vectors[second].y, vectors[second].z);
      segmentCount += 1;
    }
  }
  const networkGeometry = new THREE.BufferGeometry();
  networkGeometry.setAttribute('position', new THREE.Float32BufferAttribute(segmentPositions, 3));
  const networkMaterial = new THREE.LineBasicMaterial({ color: muted, transparent: true, opacity: 0.12 });
  const network = new THREE.LineSegments(networkGeometry, networkMaterial);
  group.add(network);

  const pointerTarget = new THREE.Vector2(0, 0);
  const pointerCurrent = new THREE.Vector2(0, 0);
  const clock = new THREE.Clock();
  let active = !document.hidden;
  let inView = true;

  const resize = () => {
    const width = Math.max(1, mount.clientWidth);
    const height = Math.max(1, mount.clientHeight);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.render(scene, camera);
  };
  const render = () => {
    const elapsed = clock.getElapsedTime();
    pointerCurrent.lerp(pointerTarget, 0.055);
    group.rotation.x = pointerCurrent.y * 0.14 + Math.sin(elapsed * 0.18) * 0.035;
    group.rotation.y = pointerCurrent.x * 0.18 + elapsed * 0.075;
    core.rotation.z = elapsed * -0.045;
    renderer.render(scene, camera);
  };
  const updateLoop = () => {
    const shouldAnimate = active && inView && !reducedMotion;
    renderer.setAnimationLoop(shouldAnimate ? render : null);
    if (!shouldAnimate) renderer.render(scene, camera);
  };
  const onPointerMove = (event) => {
    if (reducedMotion || !host) return;
    const rect = host.getBoundingClientRect();
    pointerTarget.set(((event.clientX - rect.left) / rect.width - 0.5) * 2, ((event.clientY - rect.top) / rect.height - 0.5) * 2);
  };
  const onPointerLeave = () => pointerTarget.set(0, 0);
  const onVisibility = () => {
    active = !document.hidden;
    updateLoop();
  };

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(mount);
  const viewObserver = new IntersectionObserver((entries) => {
    inView = entries.some((entry) => entry.isIntersecting);
    updateLoop();
  }, { rootMargin: '120px' });
  viewObserver.observe(mount);
  host?.addEventListener('pointermove', onPointerMove, { passive: true });
  host?.addEventListener('pointerleave', onPointerLeave, { passive: true });
  document.addEventListener('visibilitychange', onVisibility);
  resize();
  updateLoop();

  return () => {
    renderer.setAnimationLoop(null);
    resizeObserver.disconnect();
    viewObserver.disconnect();
    host?.removeEventListener('pointermove', onPointerMove);
    host?.removeEventListener('pointerleave', onPointerLeave);
    document.removeEventListener('visibilitychange', onVisibility);
    edgeGeometry.dispose();
    edgeMaterial.dispose();
    pointsGeometry.dispose();
    pointsMaterial.dispose();
    networkGeometry.dispose();
    networkMaterial.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  };
}

export function initEditorialRedesign() {
  if (!document.body || document.body.dataset.nrsEditorialReady === 'true') return;
  document.body.dataset.nrsEditorialReady = 'true';
  document.body.classList.add('nrs-editorial-redesign');
  const cleanups = [syncThemeToBody(), initHeaderState()];
  Promise.allSettled([initGsapMotion(), initThreeField()]).then((results) => {
    results.forEach((result) => {
      if (result.status === 'fulfilled' && typeof result.value === 'function') cleanups.push(result.value);
    });
  });
  const cleanup = () => {
    while (cleanups.length) {
      const dispose = cleanups.pop();
      try {
        dispose?.();
      } catch (error) {
        console.warn('[portfolio] redesign cleanup failed', error);
      }
    }
  };
  window.addEventListener('pagehide', cleanup, { once: true });
}
