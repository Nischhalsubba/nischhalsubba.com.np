
document.addEventListener('DOMContentLoaded', () => {

    const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const IS_TOUCH = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Default Config (Merged with PHP localize)
    const defaultConfig = { 
        animSpeed: 1.0, 
        enableCursor: true,
        cursorStyle: 'classic', 
        gridHighlight: true,
        gridOpacity: 0.05
    };
    const config = typeof themeConfig !== 'undefined' ? { ...defaultConfig, ...themeConfig } : defaultConfig;

    // --- 0. THEME TOGGLE ---
    const themeBtn = document.getElementById('theme-toggle');
    const htmlEl = document.documentElement;
    const sunIcon = `<svg viewBox="0 0 24 24"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 00-1.41 0 .996.996 0 000 1.41l1.29 1.29c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L5.99 4.58zm12.37 12.37a.996.996 0 00-1.41 0 .996.996 0 000 1.41l1.29 1.29c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41l-1.29-1.29zm1.41-13.78c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41l1.29 1.29c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41l-1.29-1.29zM7.28 17.28c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41l1.29 1.29c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41l-1.29-1.29z"/></svg>`;
    const moonIcon = `<svg viewBox="0 0 24 24"><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-3.03 0-5.5-2.47-5.5-5.5 0-1.82.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/></svg>`;

    const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    htmlEl.setAttribute('data-theme', savedTheme);
    if(themeBtn) themeBtn.innerHTML = savedTheme === 'light' ? moonIcon : sunIcon;

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const current = htmlEl.getAttribute('data-theme');
            const next = current === 'light' ? 'dark' : 'light';
            htmlEl.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
            themeBtn.innerHTML = next === 'light' ? moonIcon : sunIcon;
        });
    }

    // --- 1. AUTOMATIC HEADING WRAPPER ---
    const headings = document.querySelectorAll('h1, h2, h3');
    headings.forEach(heading => {
        if(heading.classList.contains('text-reveal-wrap') || 
           heading.querySelector('.text-outline') ||
           heading.closest('.no-reveal') || 
           heading.textContent.trim() === '') return;

        const originalText = heading.textContent;
        heading.classList.add('text-reveal-wrap');
        heading.innerHTML = ''; 
        
        const outlineSpan = document.createElement('span');
        outlineSpan.className = 'text-outline';
        outlineSpan.textContent = originalText;
        
        const fillSpan = document.createElement('span');
        fillSpan.className = 'text-fill';
        fillSpan.textContent = originalText;
        
        heading.appendChild(outlineSpan);
        heading.appendChild(fillSpan);
    });

    // --- 2. SCROLL ANIMATIONS ---
    if(window.gsap && window.ScrollTrigger && !REDUCED_MOTION) {
        gsap.registerPlugin(ScrollTrigger);

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
                        scrub: 0.5 
                    }
                });
            }
        });

        document.querySelectorAll('.reveal-on-scroll').forEach(el => {
            gsap.fromTo(el, { y: 40, opacity: 0 }, {
                y: 0, opacity: 1, duration: 0.8 * config.animSpeed,
                scrollTrigger: { trigger: el, start: "top 90%" }
            });
        });
    }

    // --- 3. CUSTOM CURSOR (Restored & Configurable) ---
    if (!REDUCED_MOTION && !IS_TOUCH && config.enableCursor) {
        const cursorContainer = document.createElement('div');
        cursorContainer.id = 'cursor-container';
        document.body.appendChild(cursorContainer);
        document.body.classList.add('custom-cursor-active');

        let mouse = { x: window.innerWidth/2, y: window.innerHeight/2 };
        window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

        let isHover = false;
        document.querySelectorAll('a, button, input, .project-card, .blog-card-modern').forEach(el => {
            el.addEventListener('mouseenter', () => isHover = true);
            el.addEventListener('mouseleave', () => isHover = false);
        });

        // Configurable Style Logic
        const dot = document.createElement('div'); dot.className = 'c-dot';
        const ring = document.createElement('div'); ring.className = 'c-ring';
        
        if (config.cursorStyle === 'classic' || config.cursorStyle === 'dot') cursorContainer.appendChild(dot);
        if (config.cursorStyle === 'classic' || config.cursorStyle === 'outline') cursorContainer.appendChild(ring);
        
        let rx = mouse.x, ry = mouse.y;
        const render = () => {
            if(dot) gsap.set(dot, { x: mouse.x, y: mouse.y });
            
            if(ring) {
                rx += (mouse.x - rx) * 0.15;
                ry += (mouse.y - ry) * 0.15;
                gsap.set(ring, { x: rx, y: ry });
                
                if(isHover) {
                    ring.style.width = '60px'; ring.style.height = '60px'; ring.style.opacity = '0.5';
                } else {
                    ring.style.width = '40px'; ring.style.height = '40px'; ring.style.opacity = '1';
                }
            }
            requestAnimationFrame(render);
        };
        render();
    }

    // --- 4. GRID HIGHLIGHT (Restored) ---
    const gridCanvas = document.getElementById('grid-canvas');
    if (gridCanvas && !REDUCED_MOTION && config.enableGrid) {
        const ctx = gridCanvas.getContext('2d');
        let w, h, mouse = { x: -500, y: -500 };
        const gridSize = parseInt(config.gridSize) || 60;

        window.addEventListener('resize', () => { w = gridCanvas.width = window.innerWidth; h = gridCanvas.height = window.innerHeight; });
        window.dispatchEvent(new Event('resize'));
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
            
            // Spotlight
            if(config.gridSpotlight) {
                const grad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 300);
                const accent = getComputedStyle(document.body).getPropertyValue('--accent-color').trim() || '#3B82F6';
                grad.addColorStop(0, accent + '40'); 
                grad.addColorStop(1, 'transparent');
                ctx.strokeStyle = grad;
                ctx.beginPath();
                const startX = Math.floor((mouse.x - 300)/gridSize)*gridSize;
                const endX = Math.ceil((mouse.x + 300)/gridSize)*gridSize;
                const startY = Math.floor((mouse.y - 300)/gridSize)*gridSize;
                const endY = Math.ceil((mouse.y + 300)/gridSize)*gridSize;
                for(let x=startX; x<=endX; x+=gridSize) { ctx.moveTo(x, Math.max(0, mouse.y - 300)); ctx.lineTo(x, Math.min(h, mouse.y + 300)); }
                for(let y=startY; y<=endY; y+=gridSize) { ctx.moveTo(Math.max(0, mouse.x - 300), y); ctx.lineTo(Math.min(w, mouse.x + 300), y); }
                ctx.stroke();
            }
            requestAnimationFrame(drawGrid);
        };
        drawGrid();
    }

    // --- 5. TESTIMONIAL CAROUSEL ---
    const tTrack = document.querySelector('.t-track');
    if(tTrack) {
        let idx = 0;
        const slides = document.querySelectorAll('.t-slide');
        const prev = document.getElementById('t-prev');
        const next = document.getElementById('t-next');
        
        const update = () => {
            tTrack.style.transform = `translateX(-${idx * 100}%)`;
            slides.forEach((s,i) => s.classList.toggle('active', i===idx));
        }
        
        if(next) next.addEventListener('click', () => { idx = (idx < slides.length-1) ? idx+1 : 0; update(); });
        if(prev) prev.addEventListener('click', () => { idx = (idx > 0) ? idx-1 : slides.length-1; update(); });
    }
});
