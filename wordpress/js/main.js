document.addEventListener('DOMContentLoaded', () => {

    const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const IS_TOUCH = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Default Config
    const defaultConfig = {
        animSpeed: 1.0,
        cursorStyle: 'classic', // classic, liquid, modern, exclusion, blur, crosshair, spotlight, brackets, elastic, echo
        cursorSize: 20,
        cursorTrailLen: 5,
        cursorText: 'VIEW',
        gridHighlight: true,
        gridRadius: 300
    };
    const config = typeof themeConfig !== 'undefined' ? { ...defaultConfig, ...themeConfig } : defaultConfig;

    // --- 0. THEME TOGGLE ---
    const themeBtn = document.getElementById('theme-toggle');
    const htmlEl = document.documentElement;
    const sunIcon = `<svg viewBox="0 0 24 24"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 00-1.41 0 .996.996 0 000 1.41l1.29 1.29c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L5.99 4.58zm12.37 12.37a.996.996 0 00-1.41 0 .996.996 0 000 1.41l1.29 1.29c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41l-1.29-1.29zm1.41-13.78c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41l1.29 1.29c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41l-1.29-1.29zM7.28 17.28c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41l1.29 1.29c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41l-1.29-1.29z"/></svg>`;
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

    // --- 1. PREMIUM CURSOR ENGINE (10 STYLES) ---
    // Using a strategy pattern to render different cursors based on Customizer
    if (!REDUCED_MOTION && !IS_TOUCH) {
        const cursorContainer = document.createElement('div');
        cursorContainer.id = 'cursor-container';
        document.body.appendChild(cursorContainer);
        document.body.classList.add('custom-cursor-active');

        let mouse = { x: window.innerWidth/2, y: window.innerHeight/2 };
        window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

        // Hover State
        let isHover = false;
        document.querySelectorAll('a, button, input, .project-card').forEach(el => {
            el.addEventListener('mouseenter', () => isHover = true);
            el.addEventListener('mouseleave', () => isHover = false);
        });

        // Initialize Specific Cursor Strategy
        initCursorStrategy(config.cursorStyle, cursorContainer, mouse, isHover);
    }

    function initCursorStrategy(style, container, mouse, getHoverState) {
        const size = parseInt(config.cursorSize) || 20;
        const trailLen = parseInt(config.cursorTrailLen) || 5;
        const labelText = config.cursorText || 'OPEN';

        // Helper: Create Div
        const createDiv = (cls) => {
            const d = document.createElement('div');
            d.className = cls;
            container.appendChild(d);
            return d;
        };

        // --- STYLE 1: CLASSIC (Dot + Ring) ---
        if (style === 'classic') {
            const dot = createDiv('c-dot');
            const ring = createDiv('c-ring');
            
            // CSS
            Object.assign(dot.style, { width:`8px`, height:`8px`, background:'var(--text-primary)', borderRadius:'50%', position:'fixed', pointerEvents:'none', zIndex:9999, transform:'translate(-50%, -50%)' });
            Object.assign(ring.style, { width:`${size*2}px`, height:`${size*2}px`, border:'1px solid var(--text-primary)', borderRadius:'50%', position:'fixed', pointerEvents:'none', zIndex:9998, transform:'translate(-50%, -50%)', transition:'width 0.2s, height 0.2s' });

            let rx = mouse.x, ry = mouse.y;
            const render = () => {
                gsap.set(dot, { x: mouse.x, y: mouse.y });
                rx += (mouse.x - rx) * 0.15;
                ry += (mouse.y - ry) * 0.15;
                gsap.set(ring, { x: rx, y: ry });
                
                if(getHoverState) {
                    ring.style.width = ring.style.height = `${size*3}px`;
                    ring.style.opacity = 0.5;
                } else {
                    ring.style.width = ring.style.height = `${size*2}px`;
                    ring.style.opacity = 1;
                }
                requestAnimationFrame(render);
            };
            render();
        }

        // --- STYLE 2: MODERN (Delayed Ring + Text) ---
        else if (style === 'modern') {
            const ring = createDiv('c-modern-ring');
            const label = createDiv('c-label');
            label.textContent = labelText;
            
            Object.assign(ring.style, { width:`${size}px`, height:`${size}px`, border:'2px solid var(--text-primary)', borderRadius:'50%', position:'fixed', pointerEvents:'none', zIndex:9999, transform:'translate(-50%, -50%)', transition:'all 0.3s ease' });
            Object.assign(label.style, { position:'fixed', color:'var(--bg-root)', background:'var(--text-primary)', padding:'4px 8px', borderRadius:'4px', fontSize:'10px', fontWeight:'bold', opacity:0, transform:'translate(20px, 0)', zIndex:9999 });

            let mx = mouse.x, my = mouse.y;
            const render = () => {
                mx += (mouse.x - mx) * (1 / trailLen * 0.5); // Use trail config
                my += (mouse.y - my) * (1 / trailLen * 0.5);
                gsap.set(ring, { x: mx, y: my });
                gsap.set(label, { x: mouse.x, y: mouse.y });

                if(getHoverState) {
                    ring.style.width = ring.style.height = `${size*0.5}px`;
                    ring.style.background = 'var(--text-primary)';
                    label.style.opacity = 1;
                } else {
                    ring.style.width = ring.style.height = `${size}px`;
                    ring.style.background = 'transparent';
                    label.style.opacity = 0;
                }
                requestAnimationFrame(render);
            };
            render();
        }

        // --- STYLE 3: LIQUID TRAIL (Canvas) ---
        else if (style === 'liquid') {
            const cvs = document.createElement('canvas');
            container.appendChild(cvs);
            const ctx = cvs.getContext('2d');
            let w, h;
            const resize = () => { w = cvs.width = window.innerWidth; h = cvs.height = window.innerHeight; };
            window.addEventListener('resize', resize);
            resize();

            const trails = Array.from({length: parseInt(config.cursorTrailLen) + 5}, () => ({x: mouse.x, y: mouse.y}));
            
            const render = () => {
                ctx.clearRect(0, 0, w, h);
                let tx = mouse.x, ty = mouse.y;
                
                trails.forEach((p, i) => {
                    p.x += (tx - p.x) * 0.25;
                    p.y += (ty - p.y) * 0.25;
                    
                    const radius = size * (1 - i/trails.length);
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, radius, 0, Math.PI*2);
                    ctx.fillStyle = getHoverState ? 'rgba(59,130,246,0.5)' : (document.documentElement.getAttribute('data-theme')==='light'?'rgba(0,0,0,0.8)':'rgba(255,255,255,0.8)');
                    ctx.fill();
                    
                    tx = p.x; ty = p.y;
                });
                requestAnimationFrame(render);
            };
            render();
        }

        // --- STYLE 4: EXCLUSION ORB ---
        else if (style === 'exclusion') {
            const orb = createDiv('c-orb');
            Object.assign(orb.style, { width:`${size*2}px`, height:`${size*2}px`, background:'#FFF', borderRadius:'50%', position:'fixed', pointerEvents:'none', zIndex:9999, transform:'translate(-50%, -50%)', mixBlendMode:'difference', transition:'transform 0.3s' });
            
            let ox = mouse.x, oy = mouse.y;
            const render = () => {
                ox += (mouse.x - ox) * 0.2;
                oy += (mouse.y - oy) * 0.2;
                gsap.set(orb, { x: ox, y: oy });
                if(getHoverState) orb.style.transform = 'translate(-50%, -50%) scale(2.5)';
                else orb.style.transform = 'translate(-50%, -50%) scale(1)';
                requestAnimationFrame(render);
            };
            render();
        }

        // --- STYLE 5: SOFT GLOW BLUR ---
        else if (style === 'blur') {
            const glow = createDiv('c-glow');
            const color = config.cursorColor || 'var(--accent-color)';
            Object.assign(glow.style, { width:`${size*4}px`, height:`${size*4}px`, background:color, filter:'blur(20px)', borderRadius:'50%', position:'fixed', pointerEvents:'none', zIndex:9999, transform:'translate(-50%, -50%)', opacity: 0.6 });
            
            let gx = mouse.x, gy = mouse.y;
            const render = () => {
                gx += (mouse.x - gx) * 0.1;
                gy += (mouse.y - gy) * 0.1;
                gsap.set(glow, { x: gx, y: gy });
                glow.style.opacity = getHoverState ? 0.9 : 0.6;
                requestAnimationFrame(render);
            };
            render();
        }

        // --- STYLE 6: CROSSHAIR ---
        else if (style === 'crosshair') {
            const v = createDiv('c-v');
            const h = createDiv('c-h');
            const common = { position:'fixed', background:'var(--text-primary)', pointerEvents:'none', zIndex:9999, transform:'translate(-50%, -50%)' };
            Object.assign(v.style, { ...common, width:'1px', height:`${size*2}px` });
            Object.assign(h.style, { ...common, height:'1px', width:`${size*2}px` });
            
            let cx = mouse.x, cy = mouse.y;
            const render = () => {
                cx += (mouse.x - cx) * 0.3;
                cy += (mouse.y - cy) * 0.3;
                gsap.set([v, h], { x: cx, y: cy });
                const s = getHoverState ? 1.5 : 1;
                v.style.height = `${size*2*s}px`;
                h.style.width = `${size*2*s}px`;
                if(getHoverState) { v.style.transform = h.style.transform = 'translate(-50%, -50%) rotate(45deg)'; }
                else { v.style.transform = h.style.transform = 'translate(-50%, -50%) rotate(0deg)'; }
                requestAnimationFrame(render);
            };
            render();
        }

        // --- STYLE 7: SPOTLIGHT MASK ---
        else if (style === 'spotlight') {
            const spot = createDiv('c-spot');
            Object.assign(spot.style, { 
                position: 'fixed', inset:0, zIndex:9998, pointerEvents:'none',
                background: 'radial-gradient(circle at var(--x) var(--y), transparent 50px, rgba(0,0,0,0.8) 150px)'
            });
            const render = () => {
                spot.style.setProperty('--x', `${mouse.x}px`);
                spot.style.setProperty('--y', `${mouse.y}px`);
                requestAnimationFrame(render);
            };
            render();
        }

        // --- STYLE 8: BRACKETS [ ] ---
        else if (style === 'brackets') {
            const left = createDiv('c-l'); left.textContent = '[';
            const right = createDiv('c-r'); right.textContent = ']';
            const common = { position:'fixed', color:'var(--text-primary)', fontSize:`${size}px`, fontWeight:'bold', zIndex:9999, pointerEvents:'none' };
            Object.assign(left.style, common);
            Object.assign(right.style, common);
            
            let bx = mouse.x, by = mouse.y;
            const render = () => {
                bx += (mouse.x - bx) * 0.2;
                by += (mouse.y - by) * 0.2;
                const gap = getHoverState ? 20 : 5;
                gsap.set(left, { x: bx - gap - 10, y: by - 10 });
                gsap.set(right, { x: bx + gap, y: by - 10 });
                requestAnimationFrame(render);
            };
            render();
        }

        // --- STYLE 9: ELASTIC TETHER ---
        else if (style === 'elastic') {
            const dot = createDiv('c-edot');
            const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            svg.style.cssText = "position:fixed; inset:0; pointer-events:none; z-index:9998;";
            line.setAttribute("stroke", "var(--text-primary)");
            line.setAttribute("stroke-width", "1");
            svg.appendChild(line);
            container.appendChild(svg);
            
            Object.assign(dot.style, { width:'6px', height:'6px', background:'var(--text-primary)', borderRadius:'50%', position:'fixed', pointerEvents:'none', zIndex:9999, transform:'translate(-50%, -50%)' });
            
            let tx = mouse.x, ty = mouse.y;
            const render = () => {
                tx += (mouse.x - tx) * 0.1;
                ty += (mouse.y - ty) * 0.1;
                gsap.set(dot, { x: tx, y: ty });
                line.setAttribute("x1", mouse.x);
                line.setAttribute("y1", mouse.y);
                line.setAttribute("x2", tx);
                line.setAttribute("y2", ty);
                requestAnimationFrame(render);
            };
            render();
        }

        // --- STYLE 10: GHOST ECHO ---
        else if (style === 'echo') {
            const ghosts = Array.from({length: 3}, () => {
                const g = createDiv('c-ghost');
                Object.assign(g.style, { width:`${size}px`, height:`${size}px`, border:'1px solid var(--text-primary)', position:'fixed', pointerEvents:'none', zIndex:9999, transform:'translate(-50%, -50%)' });
                return { el: g, x: mouse.x, y: mouse.y };
            });
            
            const render = () => {
                ghosts.forEach((g, i) => {
                    const delay = (i+1) * 0.1;
                    g.x += (mouse.x - g.x) * delay;
                    g.y += (mouse.y - g.y) * delay;
                    gsap.set(g.el, { x: g.x, y: g.y });
                    if(getHoverState) g.el.style.backgroundColor = 'var(--text-primary)';
                    else g.el.style.backgroundColor = 'transparent';
                });
                requestAnimationFrame(render);
            };
            render();
        }
    }

    // --- 2. ADVANCED GRID HIGHLIGHT (Flashlight) ---
    const gridCanvas = document.getElementById('grid-canvas');
    if (gridCanvas && !REDUCED_MOTION && config.gridHighlight) {
        const ctx = gridCanvas.getContext('2d');
        let w, h;
        let mouse = { x: -500, y: -500 };
        const radius = parseInt(config.gridRadius) || 300;

        window.addEventListener('resize', () => { w = gridCanvas.width = window.innerWidth; h = gridCanvas.height = window.innerHeight; });
        window.dispatchEvent(new Event('resize'));
        
        window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

        const drawGrid = () => {
            ctx.clearRect(0, 0, w, h);
            
            const isLight = htmlEl.getAttribute('data-theme') === 'light';
            const baseColor = isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)';
            const highColor = isLight ? 'rgba(37,99,235,0.3)' : 'rgba(59,130,246,0.3)';
            
            ctx.lineWidth = 1;
            const step = 60;

            // Draw Full Grid Faint
            ctx.strokeStyle = baseColor;
            ctx.beginPath();
            for(let x=0; x<=w; x+=step) { ctx.moveTo(x,0); ctx.lineTo(x,h); }
            for(let y=0; y<=h; y+=step) { ctx.moveTo(0,y); ctx.lineTo(w,y); }
            ctx.stroke();

            // Draw Highlight Mask
            const grad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, radius);
            grad.addColorStop(0, highColor);
            grad.addColorStop(1, 'transparent');
            
            ctx.strokeStyle = grad;
            ctx.beginPath();
            // Optimize: Only draw lines near mouse
            const startX = Math.floor((mouse.x - radius)/step)*step;
            const endX = Math.ceil((mouse.x + radius)/step)*step;
            const startY = Math.floor((mouse.y - radius)/step)*step;
            const endY = Math.ceil((mouse.y + radius)/step)*step;

            for(let x=startX; x<=endX; x+=step) {
                if(x<0 || x>w) continue;
                ctx.moveTo(x, Math.max(0, mouse.y - radius));
                ctx.lineTo(x, Math.min(h, mouse.y + radius));
            }
            for(let y=startY; y<=endY; y+=step) {
                if(y<0 || y>h) continue;
                ctx.moveTo(Math.max(0, mouse.x - radius), y);
                ctx.lineTo(Math.min(w, mouse.x + radius), y);
            }
            ctx.stroke();

            requestAnimationFrame(drawGrid);
        };
        drawGrid();
    }

    // --- 3. SCROLL REVEAL FIX ---
    if(window.gsap && window.ScrollTrigger && !REDUCED_MOTION) {
        gsap.registerPlugin(ScrollTrigger);
        
        // Text Fill Effect
        document.querySelectorAll('.text-reveal-wrap').forEach(el => {
            const fill = el.querySelector('.text-fill');
            if(fill) {
                gsap.to(fill, {
                    clipPath: "inset(0 0% 0 0)", // Reveal fully
                    ease: "none",
                    scrollTrigger: {
                        trigger: el,
                        start: "top 85%", // Start when text hits bottom of viewport
                        end: "center 40%", // Finish when text is higher up
                        scrub: 0.5 // Smooth scrubbing
                    }
                });
            }
        });

        // Block Reveals
        document.querySelectorAll('.reveal-on-scroll').forEach(el => {
            gsap.fromTo(el, { y: 40, opacity: 0 }, {
                y: 0, opacity: 1, duration: 0.8 * config.animSpeed,
                scrollTrigger: { trigger: el, start: "top 90%" }
            });
        });
    }

    // --- 4. PAGE TRANSITIONS ---
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', e => {
            const href = link.getAttribute('href');
            if(href && !href.startsWith('#') && link.hostname === window.location.hostname && !link.target) {
                e.preventDefault();
                const curtain = document.querySelector('.page-transition-curtain');
                curtain.style.height = '100%';
                curtain.style.transition = `height ${0.5 * config.animSpeed}s cubic-bezier(0.4,0,0.2,1)`;
                setTimeout(() => window.location.href = href, 500 * config.animSpeed);
            }
        });
    });
});