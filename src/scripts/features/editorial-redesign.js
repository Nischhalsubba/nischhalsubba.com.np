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
  const sync = () => {
    document.body.dataset.nrsTheme = document.documentElement.getAttribute('data-theme') || 'dark';
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
    header.classList.toggle('is-condensed', window.scrollY > 18);
  };
  const requestUpdate = () => {
    if (!frame) frame = window.requestAnimationFrame(update);
  };
  update();
  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate, { passive: true });
  return () => {
    if (frame) window.cancelAnimationFrame(frame);
    window.removeEventListener('scroll', requestUpdate);
    window.removeEventListener('resize', requestUpdate);
  };
}

function revealImmediately() {
  document.querySelectorAll('.nrs-motion-reveal').forEach((element) => element.classList.add('is-visible'));
}

function initObserverReveals() {
  const elements = [...document.querySelectorAll('.nrs-motion-reveal')];
  if (!elements.length || reducedMotionRequested() || !('IntersectionObserver' in window)) {
    revealImmediately();
    return () => {};
  }
  document.body.classList.add('motion-ready');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });
  elements.forEach((element) => observer.observe(element));
  return () => observer.disconnect();
}

async function initGsapMotion() {
  const hero = [...document.querySelectorAll('[data-nrs-hero-reveal]')];
  const reveals = [...document.querySelectorAll('.nrs-motion-reveal')];
  const projectMedia = [...document.querySelectorAll('[data-nrs-project-media]')];
  if (!hero.length && !reveals.length && !projectMedia.length) return () => {};
  if (reducedMotionRequested()) {
    revealImmediately();
    return () => {};
  }
  try {
    await loadClassicScript(LOCAL_GSAP_URL, 'gsap');
    if (projectMedia.length) await loadClassicScript(LOCAL_SCROLL_TRIGGER_URL, 'ScrollTrigger');
  } catch (error) {
    console.warn('[portfolio] Motion enhancement unavailable; using direct reveals.', error);
    return initObserverReveals();
  }
  const { gsap, ScrollTrigger } = window;
  if (!gsap) return initObserverReveals();
  if (ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
  document.body.classList.add('motion-ready');
  const mm = gsap.matchMedia();
  mm.add({ desktop: '(min-width: 901px)', finePointer: '(hover: hover) and (pointer: fine)', reduceMotion: '(prefers-reduced-motion: reduce)' }, (context) => {
    const { desktop, finePointer, reduceMotion } = context.conditions;
    if (reduceMotion) {
      gsap.set([...hero, ...reveals], { clearProps: 'all' });
      revealImmediately();
      return undefined;
    }
    if (hero.length) {
      gsap.fromTo(hero, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.62, stagger: 0.045, ease: 'power3.out', clearProps: 'opacity,visibility,transform' });
    }
    reveals.forEach((element) => {
      const isLargeSection = element.matches('.nrs-editorial-section__heading, .nrs-home-proof-v49, .nrs-editorial-closing');
      gsap.fromTo(element, { autoAlpha: 0, y: isLargeSection ? 18 : 12 }, { autoAlpha: 1, y: 0, duration: isLargeSection ? 0.58 : 0.46, ease: 'power3.out', clearProps: 'opacity,visibility,transform', onStart: () => element.classList.add('is-visible'), scrollTrigger: ScrollTrigger ? { trigger: element, start: 'top 91%', once: true } : undefined });
    });
    if (desktop && ScrollTrigger) {
      projectMedia.forEach((media) => {
        const image = media.querySelector('img');
        if (!image) return;
        gsap.fromTo(image, { '--nrs-project-y': '-1.5%' }, { '--nrs-project-y': '1.5%', ease: 'none', scrollTrigger: { trigger: media, start: 'top bottom', end: 'bottom top', scrub: 0.35 } });
      });
    }
    if (finePointer) {
      document.querySelectorAll('[data-nrs-project]').forEach((project) => {
        const media = project.querySelector('[data-nrs-project-media]');
        if (!media) return;
        gsap.set(media, { transformPerspective: 1100, transformOrigin: 'center' });
        const rotateX = gsap.quickTo(media, 'rotationX', { duration: 0.34, ease: 'power3.out', overwrite: 'auto' });
        const rotateY = gsap.quickTo(media, 'rotationY', { duration: 0.34, ease: 'power3.out', overwrite: 'auto' });
        const onMove = (event) => {
          const rect = media.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width - 0.5;
          const y = (event.clientY - rect.top) / rect.height - 0.5;
          rotateX(y * -1.6);
          rotateY(x * 1.6);
        };
        const onLeave = () => { rotateX(0); rotateY(0); };
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
  const suitableViewport = window.matchMedia('(min-width: 960px) and (hover: hover) and (pointer: fine)').matches;
  const saveData = navigator.connection?.saveData === true;
  const lowMemory = typeof navigator.deviceMemory === 'number' && navigator.deviceMemory <= 2;
  if (!suitableViewport || reducedMotionRequested() || saveData || lowMemory || !canUseWebGL()) {
    host?.classList.add('nrs-three-unavailable');
    return () => {};
  }
  let THREE;
  try {
    THREE = await import(/* @vite-ignore */ THREE_MODULE_URL);
  } catch (error) {
    host?.classList.add('nrs-three-unavailable');
    console.warn('[portfolio] Three.js signature unavailable; the project collage remains complete.', error);
    return () => {};
  }
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 30);
  camera.position.set(0, 0, 5.5);
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.35));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.domElement.setAttribute('aria-hidden', 'true');
  mount.appendChild(renderer.domElement);
  const group = new THREE.Group();
  group.position.set(0.8, -0.05, 0);
  scene.add(group);
  const style = getComputedStyle(document.body);
  const accent = new THREE.Color(style.getPropertyValue('--nrs-ed-accent').trim() || '#d8ff48');
  const muted = new THREE.Color(style.getPropertyValue('--nrs-ed-muted').trim() || '#b5bdb0');
  const geometry = new THREE.IcosahedronGeometry(1.18, 1);
  const edges = new THREE.EdgesGeometry(geometry, 18);
  geometry.dispose();
  const edgeMaterial = new THREE.LineBasicMaterial({ color: accent, transparent: true, opacity: 0.34 });
  const core = new THREE.LineSegments(edges, edgeMaterial);
  core.rotation.set(0.2, -0.4, 0.1);
  group.add(core);
  const random = seededRandom(845324);
  const pointCount = 46;
  const positions = new Float32Array(pointCount * 3);
  for (let index = 0; index < pointCount; index += 1) {
    const radius = 1.6 + random() * 1.15;
    const theta = random() * Math.PI * 2;
    const phi = Math.acos(2 * random() - 1);
    positions[index * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[index * 3 + 1] = radius * Math.cos(phi) * 0.78;
    positions[index * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
  }
  const pointGeometry = new THREE.BufferGeometry();
  pointGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const pointMaterial = new THREE.PointsMaterial({ color: muted, size: 0.025, transparent: true, opacity: 0.42 });
  group.add(new THREE.Points(pointGeometry, pointMaterial));
  const pointerTarget = new THREE.Vector2();
  const pointerCurrent = new THREE.Vector2();
  const clock = new THREE.Clock();
  let visible = true;
  let pageActive = !document.hidden;
  const resize = () => {
    const width = Math.max(1, mount.clientWidth);
    const height = Math.max(1, mount.clientHeight);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.35));
    renderer.render(scene, camera);
  };
  const render = () => {
    const elapsed = clock.getElapsedTime();
    pointerCurrent.lerp(pointerTarget, 0.06);
    group.rotation.x = pointerCurrent.y * 0.08 + Math.sin(elapsed * 0.22) * 0.02;
    group.rotation.y = pointerCurrent.x * 0.1 + elapsed * 0.045;
    core.rotation.z = elapsed * -0.025;
    renderer.render(scene, camera);
  };
  const syncLoop = () => {
    renderer.setAnimationLoop(visible && pageActive ? render : null);
    if (!visible || !pageActive) renderer.render(scene, camera);
  };
  const onPointerMove = (event) => {
    if (!host) return;
    const rect = host.getBoundingClientRect();
    pointerTarget.set(((event.clientX - rect.left) / rect.width - 0.5) * 2, ((event.clientY - rect.top) / rect.height - 0.5) * 2);
  };
  const onPointerLeave = () => pointerTarget.set(0, 0);
  const onVisibility = () => { pageActive = !document.hidden; syncLoop(); };
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(mount);
  const viewObserver = new IntersectionObserver((entries) => { visible = entries.some((entry) => entry.isIntersecting); syncLoop(); }, { rootMargin: '100px' });
  viewObserver.observe(mount);
  host?.addEventListener('pointermove', onPointerMove, { passive: true });
  host?.addEventListener('pointerleave', onPointerLeave, { passive: true });
  document.addEventListener('visibilitychange', onVisibility);
  resize();
  syncLoop();
  return () => {
    renderer.setAnimationLoop(null);
    resizeObserver.disconnect();
    viewObserver.disconnect();
    host?.removeEventListener('pointermove', onPointerMove);
    host?.removeEventListener('pointerleave', onPointerLeave);
    document.removeEventListener('visibilitychange', onVisibility);
    edges.dispose();
    edgeMaterial.dispose();
    pointGeometry.dispose();
    pointMaterial.dispose();
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
    while (cleanups.length) cleanups.pop()?.();
  };
  window.addEventListener('pagehide', cleanup, { once: true });
}
