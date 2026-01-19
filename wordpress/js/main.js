
document.addEventListener('DOMContentLoaded', () => {

    const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const IS_TOUCH = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Default Config
    const defaultConfig = { 
        animSpeed: 1.0, 
        enableCursor: true,
        cursorStyle: 'classic', 
        gridHighlight: true,
        gridOpacity: 0.05,
        transStyle: 'fade'
    };
    const config = typeof themeConfig !== 'undefined' ? { ...defaultConfig, ...themeConfig } : defaultConfig;

    // --- 0. THEME TOGGLE ---
    const themeBtn = document.getElementById('theme-toggle');
    const htmlEl = document.documentElement;
    const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    htmlEl.setAttribute('data-theme', savedTheme);

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const current = htmlEl.getAttribute('data-theme');
            const next = current === 'light' ? 'dark' : 'light';
            htmlEl.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
        });
    }

    // --- 1. MOBILE MENU ---
    const mobileBtn = document.querySelector('.mobile-nav-toggle');
    const mobileOverlay = document.querySelector('.mobile-nav-overlay');
    const body = document.body;

    if(mobileBtn && mobileOverlay) {
        mobileBtn.addEventListener('click', () => {
            mobileOverlay.classList.toggle('active');
            body.classList.toggle('menu-open');
            
            if(mobileOverlay.classList.contains('active') && window.gsap) {
                gsap.fromTo('.mobile-nav-links a', 
                    { y: 40, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out", delay: 0.1 }
                );
            }
        });
        
        document.querySelectorAll('.mobile-nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                mobileOverlay.classList.remove('active');
                body.classList.remove('menu-open');
            });
        });
    }

    // --- 2. AUTOMATIC OUTLINE-TO-FILL ANIMATION ---
    if(window.gsap && window.ScrollTrigger && !REDUCED_MOTION) {
        gsap.registerPlugin(ScrollTrigger);

        // Select all major headings that should have the outline effect
        const targets = document.querySelectorAll('h1, h2, h3, .hero-title, .section-title, .project-card h3');

        targets.forEach(heading => {
            // Avoid double wrapping if already applied
            if(heading.classList.contains('text-reveal-wrap') || heading.querySelector('.text-outline') || heading.textContent.trim() === '') return;
            
            // Skip tiny headings or those explicitly excluded
            if(heading.classList.contains('no-reveal')) return;

            const originalText = heading.innerHTML; // Use innerHTML to preserve line breaks if any, though plain text is safer
            const cleanText = heading.textContent; // Using textContent allows safe re-wrapping

            // Clear and restructure
            heading.classList.add('text-reveal-wrap');
            heading.innerHTML = ''; 

            // Create structure: Relative Parent -> Absolute Fill + Relative Outline
            const outlineSpan = document.createElement('span'); 
            outlineSpan.className = 'text-outline'; 
            outlineSpan.innerHTML = originalText; // Preserve markup like <br>

            const fillSpan = document.createElement('span'); 
            fillSpan.className = 'text-fill'; 
            fillSpan.innerHTML = originalText;

            heading.appendChild(outlineSpan); 
            heading.appendChild(fillSpan);

            // Animate the fill layer
            gsap.to(fillSpan, {
                clipPath: "inset(0 0% 0 0)",
                ease: "none",
                scrollTrigger: { 
                    trigger: heading, 
                    start: "top 85%", // Start filling when heading enters bottom of screen
                    end: "center 45%", // Finish filling when heading is near center
                    scrub: 0.6 // Smooth follow
                }
            });
        });

        // Also animate specifically pre-wrapped elements if any exist from PHP
        document.querySelectorAll('.text-reveal-wrap').forEach(el => {
            const fill = el.querySelector('.text-fill');
            if(fill) {
                gsap.to(fill, {
                    clipPath: "inset(0 0% 0 0)",
                    ease: "none",
                    scrollTrigger: { 
                        trigger: el, 
                        start: "top 85%", 
                        end: "center 45%", 
                        scrub: 0.6 
                    }
                });
            }
        });

        // Generic fade-up reveal for body text, cards, etc.
        const revealElements = document.querySelectorAll('.reveal-on-scroll, .project-card, .metric-item, .body-large');
        revealElements.forEach(el => {
            // Avoid double animating if it's also a heading we just wrapped
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

    // --- 3. CUSTOM CURSOR ENGINE ---
    if (!REDUCED_MOTION && !IS_TOUCH && config.cursorEnable) {
        const cursorContainer = document.createElement('div');
        cursorContainer.id = 'cursor-container';
        document.body.appendChild(cursorContainer);
        document.body.classList.add('custom-cursor-active');
        
        let mouse = { x: window.innerWidth/2, y: window.innerHeight/2 };
        
        window.addEventListener('mousemove', e => { 
            mouse.x = e.clientX; 
            mouse.y = e.clientY; 
        });

        // Interactive hover detection
        let isHover = false;
        const interactiveSelectors = 'a, button, input, .project-card, .btn, .nav-pill';
        document.querySelectorAll(interactiveSelectors).forEach(el => {
            el.addEventListener('mouseenter', () => isHover = true);
            el.addEventListener('mouseleave', () => isHover = false);
        });

        // Create Elements
        const dot = document.createElement('div'); dot.className = 'custom-cursor-dot';
        const ring = document.createElement('div'); ring.className = 'custom-cursor-outline';
        
        cursorContainer.appendChild(dot);
        cursorContainer.appendChild(ring);

        // Physics State
        let rx = mouse.x, ry = mouse.y; 

        const renderCursor = () => {
            // Smooth follow for ring
            rx += (mouse.x - rx) * 0.15; 
            ry += (mouse.y - ry) * 0.15;

            // Direct follow for dot
            gsap.set(dot, { x: mouse.x, y: mouse.y });
            gsap.set(ring, { x: rx, y: ry });
            
            // Hover State Animation
            if(isHover) {
                gsap.to(ring, { width: 60, height: 60, opacity: 0.5, duration: 0.3 });
                gsap.to(dot, { scale: 0.5, duration: 0.3 });
            } else {
                gsap.to(ring, { width: 44, height: 44, opacity: 1, duration: 0.3 });
                gsap.to(dot, { scale: 1, duration: 0.3 });
            }
            
            requestAnimationFrame(renderCursor);
        };
        renderCursor();
    }

    // --- 4. GRID HIGHLIGHT ---
    const gridCanvas = document.getElementById('grid-canvas');
    if (gridCanvas && !REDUCED_MOTION && config.gridEnable) {
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
            
            ctx.strokeStyle = isLight ? `rgba(0,0,0,${baseOp})` : `rgba(255,255,255,${baseOp})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            for(let x=0; x<=w; x+=gridSize) { ctx.moveTo(x,0); ctx.lineTo(x,h); }
            for(let y=0; y<=h; y+=gridSize) { ctx.moveTo(0,y); ctx.lineTo(w,y); }
            ctx.stroke();
            
            if(config.gridHighlight) {
                const grad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 300);
                const accent = getComputedStyle(document.body).getPropertyValue('--accent-color').trim() || '#3B82F6';
                grad.addColorStop(0, accent + '33'); 
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
            }
            requestAnimationFrame(drawGrid);
        };
        drawGrid();
    }
    
    // --- 5. TESTIMONIAL CAROUSEL ---
    const tTracks = document.querySelectorAll('.t-track');
    tTracks.forEach(track => {
        let idx = 0;
        const slides = track.querySelectorAll('.t-slide');
        const prev = track.parentElement.querySelector('#t-prev') || track.parentElement.querySelector('.t-prev');
        const next = track.parentElement.querySelector('#t-next') || track.parentElement.querySelector('.t-next');
        
        const update = () => {
            track.style.transform = `translateX(-${idx * 100}%)`;
            slides.forEach((s,i) => s.classList.toggle('active', i===idx));
        }
        
        if(next) next.addEventListener('click', () => { idx = (idx < slides.length-1) ? idx+1 : 0; update(); });
        if(prev) prev.addEventListener('click', () => { idx = (idx > 0) ? idx-1 : slides.length-1; update(); });
    });
});
