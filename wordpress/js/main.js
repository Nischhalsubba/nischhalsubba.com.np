
document.addEventListener('DOMContentLoaded', () => {

    const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const IS_TOUCH = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Default Config (Merged with PHP localize)
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

    // --- 1. AUTOMATIC HEADING WRAPPER ---
    document.querySelectorAll('h1, h2, h3').forEach(heading => {
        if(heading.classList.contains('text-reveal-wrap') || heading.querySelector('.text-outline') || heading.textContent.trim() === '') return;
        const originalText = heading.textContent;
        heading.classList.add('text-reveal-wrap');
        heading.innerHTML = ''; 
        const outlineSpan = document.createElement('span'); outlineSpan.className = 'text-outline'; outlineSpan.textContent = originalText;
        const fillSpan = document.createElement('span'); fillSpan.className = 'text-fill'; fillSpan.textContent = originalText;
        heading.appendChild(outlineSpan); heading.appendChild(fillSpan);
    });

    // --- 2. SCROLL ANIMATIONS (Controlled by Customizer) ---
    if(window.gsap && window.ScrollTrigger && !REDUCED_MOTION) {
        gsap.registerPlugin(ScrollTrigger);
        const speed = parseFloat(config.animSpeed) || 1.0;

        document.querySelectorAll('.text-reveal-wrap').forEach(el => {
            const fill = el.querySelector('.text-fill');
            if(fill) {
                gsap.to(fill, {
                    clipPath: "inset(0 0% 0 0)",
                    ease: "none",
                    scrollTrigger: { 
                        trigger: el, 
                        start: "top 90%", 
                        end: "center 45%", 
                        scrub: 0.5 
                    }
                });
            }
        });

        document.querySelectorAll('.reveal-on-scroll').forEach(el => {
            gsap.fromTo(el, { y: 40, opacity: 0 }, {
                y: 0, opacity: 1, duration: 0.8 * speed,
                scrollTrigger: { trigger: el, start: "top 90%" }
            });
        });
    }

    // --- 3. CUSTOM CURSOR (10 Styles) ---
    if (!REDUCED_MOTION && !IS_TOUCH && config.cursorEnable) {
        const cursorContainer = document.createElement('div');
        cursorContainer.id = 'cursor-container';
        document.body.appendChild(cursorContainer);
        document.body.classList.add('custom-cursor-active');
        if(config.cursorStyle === 'blend') document.body.classList.add('cursor-blend');

        let mouse = { x: window.innerWidth/2, y: window.innerHeight/2 };
        window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

        let isHover = false;
        document.querySelectorAll('a, button, input, .project-card').forEach(el => {
            el.addEventListener('mouseenter', () => isHover = true);
            el.addEventListener('mouseleave', () => isHover = false);
        });

        const dot = document.createElement('div'); dot.className = 'custom-cursor-dot';
        const ring = document.createElement('div'); ring.className = 'custom-cursor-outline';
        
        if(['classic', 'dot', 'blend', 'trail', 'magnetic', 'fluid', 'glitch'].includes(config.cursorStyle)) cursorContainer.appendChild(dot);
        if(['classic', 'outline', 'blend', 'magnetic', 'fluid', 'focus', 'spotlight'].includes(config.cursorStyle)) cursorContainer.appendChild(ring);

        let rx = mouse.x, ry = mouse.y;
        const renderCursor = () => {
            switch(config.cursorStyle) {
                case 'dot':
                    gsap.set(dot, { x: mouse.x, y: mouse.y });
                    gsap.to(dot, { scale: isHover ? 2 : 1, duration: 0.2 });
                    break;
                case 'spotlight':
                    gsap.set(ring, { x: mouse.x, y: mouse.y });
                    ring.style.width = '300px'; ring.style.height = '300px';
                    ring.style.background = 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)';
                    ring.style.border = 'none';
                    break;
                default: // Classic & Outline
                    gsap.set(dot, { x: mouse.x, y: mouse.y });
                    rx += (mouse.x - rx) * 0.15; ry += (mouse.y - ry) * 0.15;
                    gsap.set(ring, { x: rx, y: ry });
                    if(isHover) { ring.style.width = '60px'; ring.style.height = '60px'; ring.style.opacity = 0.5; }
                    else { ring.style.width = '40px'; ring.style.height = '40px'; ring.style.opacity = 1; }
                    break;
            }
            requestAnimationFrame(renderCursor);
        };
        renderCursor();
    }

    // --- 4. GRID HIGHLIGHT ---
    const gridCanvas = document.getElementById('grid-canvas');
    if (gridCanvas && !REDUCED_MOTION && config.gridEnable) {
        const ctx = gridCanvas.getContext('2d');
        let w, h, mouse = { x: -500, y: -500 };
        const gridSize = 60;

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
});
