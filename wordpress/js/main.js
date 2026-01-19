
/**
 * MAIN.JS
 * Core interaction logic for Nischhal Pro Theme.
 * Handles Cursor, GSAP Animations, Canvas Grid, and UI Events.
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- CONSTANTS ---
    const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const IS_TOUCH = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const htmlEl = document.documentElement;
    const body = document.body;

    // Merge PHP config with defaults
    const defaultConfig = { 
        animSpeed: 1.0, 
        enableCursor: true, 
        gridEnable: true,
        gridOpacity: 0.05
    };
    const config = typeof themeConfig !== 'undefined' ? { ...defaultConfig, ...themeConfig } : defaultConfig;


    /* -------------------------------------------------------------------------- */
    /*  1. THEME TOGGLE (Light/Dark)
    /* -------------------------------------------------------------------------- */
    const themeBtn = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    
    // Apply initial theme
    htmlEl.setAttribute('data-theme', savedTheme);

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const current = htmlEl.getAttribute('data-theme');
            const next = current === 'light' ? 'dark' : 'light';
            htmlEl.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
        });
    }


    /* -------------------------------------------------------------------------- */
    /*  2. MOBILE MENU
    /* -------------------------------------------------------------------------- */
    const mobileBtn = document.querySelector('.mobile-nav-toggle');
    const mobileOverlay = document.querySelector('.mobile-nav-overlay');

    if(mobileBtn && mobileOverlay) {
        mobileBtn.addEventListener('click', () => {
            mobileOverlay.classList.toggle('active');
            body.classList.toggle('menu-open');
            
            // Animate links in if opening
            if(mobileOverlay.classList.contains('active') && window.gsap) {
                gsap.fromTo('.mobile-nav-links a', 
                    { y: 40, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out", delay: 0.1 }
                );
            }
        });
        
        // Close menu on link click
        document.querySelectorAll('.mobile-nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                mobileOverlay.classList.remove('active');
                body.classList.remove('menu-open');
            });
        });
    }


    /* -------------------------------------------------------------------------- */
    /*  3. CUSTOM CURSOR ENGINE (Bulletproofed)
    /* -------------------------------------------------------------------------- */
    // Only run if cursor is enabled, motion is allowed, and NOT on touch device
    if (!REDUCED_MOTION && !IS_TOUCH && config.enableCursor) {
        
        const dot = document.querySelector('.custom-cursor-dot');
        const ring = document.querySelector('.custom-cursor-outline');
        
        // Only proceed if elements exist in DOM
        if (dot && ring) {
            
            let mouse = { x: window.innerWidth/2, y: window.innerHeight/2 };
            let ringPos = { x: window.innerWidth/2, y: window.innerHeight/2 };
            let isHover = false;

            // TRACK MOUSE
            window.addEventListener('mousemove', e => { 
                mouse.x = e.clientX; 
                mouse.y = e.clientY; 
                
                // IMPORTANT: Activate cursor visibility on first movement
                if (!body.classList.contains('cursor-visible')) {
                    body.classList.add('cursor-visible');
                }
            });

            // HOVER DETECTION (Links, Buttons, Inputs)
            const interactiveSelectors = 'a, button, input, .project-card, .nav-pill, .t-btn';
            document.querySelectorAll(interactiveSelectors).forEach(el => {
                el.addEventListener('mouseenter', () => isHover = true);
                el.addEventListener('mouseleave', () => isHover = false);
            });

            // ANIMATION LOOP (GSAP)
            const renderCursor = () => {
                if(window.gsap) {
                    // Dot follows mouse instantly
                    gsap.set(dot, { x: mouse.x, y: mouse.y });
                    
                    // Ring follows with lerp (smooth delay)
                    ringPos.x += (mouse.x - ringPos.x) * 0.15;
                    ringPos.y += (mouse.y - ringPos.y) * 0.15;
                    gsap.set(ring, { x: ringPos.x, y: ringPos.y });
                    
                    // Hover State Transformations
                    if(isHover) {
                        gsap.to(ring, { width: 60, height: 60, opacity: 0.5, duration: 0.3, overwrite: true });
                        gsap.to(dot, { scale: 0.5, duration: 0.3, overwrite: true });
                    } else {
                        gsap.to(ring, { width: 44, height: 44, opacity: 1, duration: 0.3, overwrite: true });
                        gsap.to(dot, { scale: 1, duration: 0.3, overwrite: true });
                    }
                }
                requestAnimationFrame(renderCursor);
            };
            
            renderCursor();
        }
    }


    /* -------------------------------------------------------------------------- */
    /*  4. SCROLL REVEAL (GSAP ScrollTrigger)
    /* -------------------------------------------------------------------------- */
    if(window.gsap && window.ScrollTrigger && !REDUCED_MOTION) {
        gsap.registerPlugin(ScrollTrigger);

        // A. Heading Reveal (Text Fill)
        const targets = document.querySelectorAll('.text-reveal-wrap');
        targets.forEach(wrapper => {
            const fill = wrapper.querySelector('.text-fill');
            if(fill) {
                gsap.to(fill, {
                    clipPath: "inset(0 0% 0 0)", // Reveal from left to right
                    ease: "none",
                    scrollTrigger: { 
                        trigger: wrapper, 
                        start: "top 90%", // Start when element enters viewport
                        end: "bottom 60%", // Complete when closer to center
                        scrub: 0.5 // Smooth scrub
                    }
                });
            }
        });

        // B. Element Fade Up
        const revealElements = document.querySelectorAll('.reveal-on-scroll, .project-card, .metric-item, .body-large');
        revealElements.forEach(el => {
            // Avoid double animating headings
            if(el.classList.contains('text-reveal-wrap')) return;
            
            gsap.fromTo(el, 
                { y: 40, opacity: 0 }, 
                {
                    y: 0, opacity: 1, duration: 0.8,
                    ease: "power2.out",
                    scrollTrigger: { trigger: el, start: "top 90%" }
                }
            );
        });
    }


    /* -------------------------------------------------------------------------- */
    /*  5. CANVAS GRID BACKGROUND
    /* -------------------------------------------------------------------------- */
    const gridCanvas = document.getElementById('grid-canvas');
    if (gridCanvas && !REDUCED_MOTION && config.gridEnable && !IS_TOUCH) {
        const ctx = gridCanvas.getContext('2d');
        let w, h, mouse = { x: -1000, y: -1000 };
        const gridSize = 60;

        const resize = () => { w = gridCanvas.width = window.innerWidth; h = gridCanvas.height = window.innerHeight; };
        window.addEventListener('resize', resize);
        resize();
        
        window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

        const drawGrid = () => {
            ctx.clearRect(0, 0, w, h);
            const isLight = htmlEl.getAttribute('data-theme') === 'light';
            const baseOp = parseFloat(config.gridOpacity) || 0.05;
            
            // Draw Lines
            ctx.strokeStyle = isLight ? `rgba(0,0,0,${baseOp})` : `rgba(255,255,255,${baseOp})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            for(let x=0; x<=w; x+=gridSize) { ctx.moveTo(x,0); ctx.lineTo(x,h); }
            for(let y=0; y<=h; y+=gridSize) { ctx.moveTo(0,y); ctx.lineTo(w,y); }
            ctx.stroke();
            
            // Draw Spotlight
            const grad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 300);
            const accent = getComputedStyle(body).getPropertyValue('--accent-blue').trim() || '#3B82F6';
            grad.addColorStop(0, accent + '33'); // 20% opacity hex
            grad.addColorStop(1, 'transparent');
            ctx.strokeStyle = grad;
            ctx.beginPath();
            
            const region = 300;
            const startX = Math.floor((mouse.x - region)/gridSize)*gridSize;
            const endX = Math.ceil((mouse.x + region)/gridSize)*gridSize;
            const startY = Math.floor((mouse.y - region)/gridSize)*gridSize;
            const endY = Math.ceil((mouse.y + region)/gridSize)*gridSize;
            
            for(let x=startX; x<=endX; x+=gridSize) { ctx.moveTo(x, Math.max(0, mouse.y - region)); ctx.lineTo(x, Math.min(h, mouse.y + region)); }
            for(let y=startY; y<=endY; y+=gridSize) { ctx.moveTo(Math.max(0, mouse.x - region), y); ctx.lineTo(Math.min(w, mouse.x + region), y); }
            ctx.stroke();
            
            requestAnimationFrame(drawGrid);
        };
        drawGrid();
    }
    
    /* -------------------------------------------------------------------------- */
    /*  6. TESTIMONIAL CAROUSEL LOGIC
    /* -------------------------------------------------------------------------- */
    const tTracks = document.querySelectorAll('.t-track');
    tTracks.forEach(track => {
        let idx = 0;
        const slides = track.querySelectorAll('.t-slide');
        const prev = track.parentElement.querySelector('#t-prev') || track.parentElement.querySelector('.t-prev');
        const next = track.parentElement.querySelector('#t-next') || track.parentElement.querySelector('.t-next');
        
        const update = () => {
            // Using percentage transform for smooth sliding
            track.style.transform = `translateX(-${idx * 100}%)`;
            slides.forEach((s,i) => s.classList.toggle('active', i===idx));
        }
        
        if(next) next.addEventListener('click', () => { idx = (idx < slides.length-1) ? idx+1 : 0; update(); });
        if(prev) prev.addEventListener('click', () => { idx = (idx > 0) ? idx-1 : slides.length-1; update(); });
    });
});
