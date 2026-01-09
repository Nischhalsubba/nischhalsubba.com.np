document.addEventListener('DOMContentLoaded', () => {
    
    const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // --- 1. SPOTLIGHT GRID CANVAS ---
    const canvas = document.getElementById('grid-canvas');
    if (canvas && !REDUCED_MOTION) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let mouse = { x: -1000, y: -1000 };

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resize);
        resize();

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        function drawGrid() {
            ctx.clearRect(0, 0, width, height);
            
            const gridSize = 60; 
            const spotlightRadius = 400;

            ctx.lineWidth = 1;
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)'; 
            ctx.beginPath();
            for(let x=0; x<=width; x+=gridSize) { ctx.moveTo(x,0); ctx.lineTo(x,height); }
            for(let y=0; y<=height; y+=gridSize) { ctx.moveTo(0,y); ctx.lineTo(width,y); }
            ctx.stroke();

            const grad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, spotlightRadius);
            grad.addColorStop(0, 'rgba(59, 130, 246, 0.6)'); 
            grad.addColorStop(1, 'rgba(59, 130, 246, 0)');

            ctx.strokeStyle = grad;
            ctx.beginPath();
            
            const startX = Math.floor((mouse.x - spotlightRadius)/gridSize) * gridSize;
            const endX = Math.floor((mouse.x + spotlightRadius)/gridSize) * gridSize;
            const startY = Math.floor((mouse.y - spotlightRadius)/gridSize) * gridSize;
            const endY = Math.floor((mouse.y + spotlightRadius)/gridSize) * gridSize;

            for(let x=startX; x<=endX; x+=gridSize) {
                 if(x<0 || x>width) continue;
                 ctx.moveTo(x, Math.max(0, mouse.y - spotlightRadius));
                 ctx.lineTo(x, Math.min(height, mouse.y + spotlightRadius));
            }
            for(let y=startY; y<=endY; y+=gridSize) {
                 if(y<0 || y>height) continue;
                 ctx.moveTo(Math.max(0, mouse.x - spotlightRadius), y);
                 ctx.lineTo(Math.min(width, mouse.x + spotlightRadius), y);
            }
            ctx.stroke();

            requestAnimationFrame(drawGrid);
        }
        drawGrid();
    }

    // --- 2. CUSTOM CURSOR (Fixed & Smooth) ---
    const cursorDot = document.querySelector('.custom-cursor-dot');
    const cursorOutline = document.querySelector('.custom-cursor-outline');
    
    // Only enable if pointer is fine (mouse) and elements exist
    if (!REDUCED_MOTION && window.matchMedia('(pointer: fine)').matches && cursorDot) {
        
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let outlineX = mouseX;
        let outlineY = mouseY;
        
        // Initial setup
        gsap.set([cursorDot, cursorOutline], { xPercent: -50, yPercent: -50, opacity: 1 });

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Dot follows instantly
            gsap.to(cursorDot, { x: mouseX, y: mouseY, duration: 0 });
        });

        // Smooth outline loop
        const animateCursor = () => {
            outlineX += (mouseX - outlineX) * 0.15;
            outlineY += (mouseY - outlineY) * 0.15;
            
            gsap.set(cursorOutline, { x: outlineX, y: outlineY });
            requestAnimationFrame(animateCursor);
        };
        animateCursor();

        // Hover Effect Logic
        // Select all interactive elements
        const interactiveSelectors = 'a, button, input, .project-card, .nav-pill, .writing-item, .project-nav-card, .social-icon-btn';
        
        document.querySelectorAll(interactiveSelectors).forEach(el => {
            el.addEventListener('mouseenter', () => {
                gsap.to(cursorOutline, { 
                    width: 60, 
                    height: 60, 
                    backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                    borderColor: 'transparent',
                    duration: 0.3 
                });
                gsap.to(cursorDot, { scale: 0.5, duration: 0.3 });
            });
            el.addEventListener('mouseleave', () => {
                gsap.to(cursorOutline, { 
                    width: 40, 
                    height: 40, 
                    backgroundColor: 'transparent', 
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    duration: 0.3 
                });
                gsap.to(cursorDot, { scale: 1, duration: 0.3 });
            });
        });
    }

    // --- 3. TITLE SCROLL REVEAL ---
    if (window.gsap && window.ScrollTrigger && !REDUCED_MOTION) {
        gsap.registerPlugin(ScrollTrigger);
        
        document.querySelectorAll('.text-reveal-wrap').forEach(title => {
            const fillText = title.querySelector('.text-fill');
            if(fillText) {
                gsap.to(fillText, {
                    clipPath: 'inset(0 0% 0 0)',
                    ease: 'none',
                    scrollTrigger: {
                        trigger: title,
                        start: 'top 80%',
                        end: 'bottom 50%',
                        scrub: 1
                    }
                });
            }
        });

        document.querySelectorAll(".reveal-on-scroll").forEach(el => {
            gsap.fromTo(el, {y:40, opacity:0}, {
                y:0, opacity:1, duration:0.8,
                scrollTrigger: { trigger: el, start: "top 85%" }
            });
        });
    }

    // --- 4. NAV GLIDER LOGIC ---
    const navLinks = document.querySelectorAll('.nav-link');
    const glider = document.querySelector('.nav-glider');
    
    const page = window.location.pathname.split('/').pop() || 'index.html';
    let activeFound = false;
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === page) {
            link.classList.add('active');
            activeFound = true;
        }
    });
    if (!activeFound && page === 'index.html') {
         const homeLink = document.querySelector('a[href="index.html"]');
         if(homeLink) homeLink.classList.add('active');
    }

    if (glider) {
        const moveGlider = (el) => {
            const rect = el.getBoundingClientRect();
            const parent = el.parentElement.getBoundingClientRect();
            gsap.to(glider, {
                x: rect.left - parent.left,
                width: rect.width,
                opacity: 1,
                duration: 0.3
            });
        };
        const activeLink = document.querySelector('.nav-link.active');
        if(activeLink) setTimeout(() => moveGlider(activeLink), 100);

        navLinks.forEach(link => {
            link.addEventListener('mouseenter', () => moveGlider(link));
            link.addEventListener('mouseleave', () => {
                if(activeLink) moveGlider(activeLink);
                else gsap.to(glider, { opacity: 0 });
            });
        });
    }

    // --- 5. FILTER LOGIC (Projects & Blog) ---
    const setupFilters = (btnClass, itemClass, attrName) => {
        const filterBtns = document.querySelectorAll(btnClass);
        const items = document.querySelectorAll(itemClass);
        
        if(filterBtns.length === 0) return;

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const category = btn.getAttribute('data-filter');
                
                items.forEach(el => {
                    const tags = el.getAttribute(attrName);
                    if (category === 'all' || tags.includes(category)) {
                        el.classList.remove('hidden');
                        gsap.fromTo(el, {y: 20, opacity:0}, {y:0, opacity:1, duration: 0.4});
                    } else {
                        el.classList.add('hidden');
                    }
                });
            });
        });
    };

    // Initialize Project Filters
    setupFilters('.filter-btn', '.project-card', 'data-category');
    // Initialize Blog Filters
    setupFilters('.blog-filter-btn', '.writing-item', 'data-category');


    // --- 6. TESTIMONIAL CAROUSEL ---
    const tTrack = document.querySelector('.t-track');
    const tPrev = document.getElementById('t-prev');
    const tNext = document.getElementById('t-next');
    const tSlides = document.querySelectorAll('.t-slide');
    
    if(tTrack && tSlides.length > 0) {
        let tIndex = 0;
        const updateT = () => {
            tTrack.style.transform = `translateX(-${tIndex * 100}%)`;
            tSlides.forEach((s, i) => {
                s.classList.toggle('active', i === tIndex);
            });
        };
        
        if(tPrev) tPrev.addEventListener('click', () => {
            tIndex = (tIndex > 0) ? tIndex - 1 : tSlides.length - 1;
            updateT();
        });
        
        if(tNext) tNext.addEventListener('click', () => {
            tIndex = (tIndex < tSlides.length - 1) ? tIndex + 1 : 0;
            updateT();
        });
        updateT();
    }
});