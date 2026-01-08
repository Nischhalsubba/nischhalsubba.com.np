document.addEventListener('DOMContentLoaded', () => {
    
    // --- CONFIGURATION ---
    const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // --- 1. CANVAS GRID PARTICLE SYSTEM (Updated) ---
    // Multiple particles, dimmer, longer trails.
    const canvas = document.getElementById('grid-canvas');
    if (canvas && !REDUCED_MOTION) {
        const ctx = canvas.getContext('2d');
        let width, height;
        const gridSize = 60; 
        
        // Particle Class
        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.floor(Math.random() * (width / gridSize)) * gridSize;
                this.y = Math.floor(Math.random() * (height / gridSize)) * gridSize;
                this.vx = Math.random() < 0.5 ? 2 : -2;
                this.vy = 0;
                this.trail = [];
                this.trailLength = 40; // Longer trail
            }

            update(mouse) {
                // Record trail
                this.trail.push({ x: this.x, y: this.y });
                if (this.trail.length > this.trailLength) this.trail.shift();

                // Mouse Flee
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                
                if (dist < 150) {
                    if (Math.abs(dx) > Math.abs(dy)) {
                       if (dx < 0 && this.vx > 0) this.vx = -2;
                       if (dx > 0 && this.vx < 0) this.vx = 2;
                    } else {
                       if (dy < 0 && this.vy > 0) this.vy = -2;
                       if (dy > 0 && this.vy < 0) this.vy = 2;
                    }
                }

                this.x += this.vx;
                this.y += this.vy;

                // Intersection turn
                const atX = Math.abs(this.x % gridSize) < 2;
                const atY = Math.abs(this.y % gridSize) < 2;

                if (atX && atY && Math.random() < 0.2) {
                    const dirs = [ {vx:2,vy:0}, {vx:-2,vy:0}, {vx:0,vy:2}, {vx:0,vy:-2} ];
                    const next = dirs[Math.floor(Math.random() * dirs.length)];
                    this.vx = next.vx; this.vy = next.vy;
                }

                // Bounds
                if (this.x < 0) { this.x = 0; this.vx = 2; }
                if (this.x > width) { this.x = width; this.vx = -2; }
                if (this.y < 0) { this.y = 0; this.vy = 2; }
                if (this.y > height) { this.y = height; this.vy = -2; }
            }

            draw(ctx) {
                // Dimmer trail
                this.trail.forEach((pos, i) => {
                    const ratio = i / this.trail.length;
                    ctx.fillStyle = `rgba(59, 130, 246, ${ratio * 0.15})`; // Very dim
                    ctx.fillRect(pos.x - 1, pos.y - 1, 3, 3);
                });
                
                // Head
                ctx.fillStyle = 'rgba(59, 130, 246, 0.6)';
                ctx.beginPath();
                ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        let particles = [];
        let mouse = { x: -1000, y: -1000 };

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            particles = [new Particle(), new Particle(), new Particle()]; // 3 Particles
        }
        window.addEventListener('resize', resize);
        resize();

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        function drawGrid() {
            ctx.strokeStyle = 'rgba(59, 130, 246, 0.03)';
            ctx.lineWidth = 1;
            for (let x = 0; x <= width; x += gridSize) {
                ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
            }
            for (let y = 0; y <= height; y += gridSize) {
                ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
            }
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);
            drawGrid();
            particles.forEach(p => {
                p.update(mouse);
                p.draw(ctx);
            });
            requestAnimationFrame(animate);
        }
        animate();
    }

    // --- 2. CUSTOM CURSOR ---
    const cursorDot = document.querySelector('.custom-cursor-dot');
    const cursorOutline = document.querySelector('.custom-cursor-outline');
    
    if (!REDUCED_MOTION && window.matchMedia('(pointer: fine)').matches && cursorDot) {
        let outlineX = window.innerWidth / 2;
        let outlineY = window.innerHeight / 2;
        let mouseX = outlineX;
        let mouseY = outlineY;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
        });

        const animateCursor = () => {
            outlineX += (mouseX - outlineX) * 0.2; // Faster follow
            outlineY += (mouseY - outlineY) * 0.2;
            cursorOutline.style.transform = `translate(${outlineX}px, ${outlineY}px) translate(-50%, -50%)`;
            requestAnimationFrame(animateCursor);
        };
        animateCursor();

        document.querySelectorAll('a, button, input').forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorOutline.style.width = '50px'; cursorOutline.style.height = '50px';
                cursorOutline.style.background = 'rgba(255, 255, 255, 0.05)';
            });
            el.addEventListener('mouseleave', () => {
                cursorOutline.style.width = '40px'; cursorOutline.style.height = '40px';
                cursorOutline.style.background = 'transparent';
            });
        });
    }

    // --- 3. NAV GLIDER (Improved Alignment) ---
    const navLinks = document.querySelectorAll('.nav-link');
    const glider = document.querySelector('.nav-glider');
    
    // Set active class
    const page = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(page)) link.classList.add('active');
    });

    if (glider) {
        function moveGlider(el) {
            if (!el) return;
            const parent = el.parentElement.getBoundingClientRect();
            const rect = el.getBoundingClientRect();
            
            // Calculate center-based positioning relative to parent padding
            const relX = rect.left - parent.left;
            
            gsap.to(glider, {
                x: relX,
                width: rect.width,
                opacity: 1,
                duration: 0.3,
                ease: "power2.out"
            });
        }
        
        // Initial pos
        const activeLink = document.querySelector('.nav-link.active');
        if (activeLink) setTimeout(() => moveGlider(activeLink), 100);

        navLinks.forEach(link => {
            link.addEventListener('mouseenter', () => moveGlider(link));
            link.addEventListener('mouseleave', () => {
                 if (activeLink) moveGlider(activeLink);
                 else gsap.to(glider, { opacity: 0 });
            });
        });
    }

    // --- 4. FAQ ACCORDION + CAROUSEL ---
    // Accordion Logic
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.parentElement;
            const isActive = item.classList.contains('active');
            
            // Close all in this group
            item.parentElement.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
            
            if (!isActive) item.classList.add('active');
        });
    });

    // Carousel Logic
    const faqTrack = document.querySelector('.faq-track');
    const btnPrev = document.getElementById('faq-prev');
    const btnNext = document.getElementById('faq-next');
    
    if (faqTrack && btnPrev && btnNext) {
        let faqIndex = 0;
        const faqSlides = document.querySelectorAll('.faq-slide');
        const maxIndex = faqSlides.length - 1;

        function updateCarousel() {
            faqTrack.style.transform = `translateX(-${faqIndex * 100}%)`;
            btnPrev.disabled = faqIndex === 0;
            btnNext.disabled = faqIndex === maxIndex;
        }

        btnPrev.addEventListener('click', () => {
            if (faqIndex > 0) { faqIndex--; updateCarousel(); }
        });

        btnNext.addEventListener('click', () => {
            if (faqIndex < maxIndex) { faqIndex++; updateCarousel(); }
        });
        
        updateCarousel(); // Init
    }

    // --- 5. GSAP ANIMATIONS ---
    if (window.gsap && window.ScrollTrigger && !REDUCED_MOTION) {
        gsap.registerPlugin(ScrollTrigger);
        
        // Hero
        const tl = gsap.timeline();
        tl.fromTo(".nav-wrapper", {y:-20, opacity:0}, {y:0, opacity:1, duration:0.8})
          .fromTo(".hero-title", {y:30, opacity:0}, {y:0, opacity:1, duration:1}, "-=0.6")
          .fromTo(".hero-visual", {scale:0.95, opacity:0}, {scale:1, opacity:0.9, duration:1.2}, "-=0.8");

        // Scroll Reveals
        document.querySelectorAll(".reveal-on-scroll").forEach(el => {
            gsap.fromTo(el, {y:30, opacity:0}, {
                y:0, opacity:1, duration:0.8,
                scrollTrigger: { trigger: el, start: "top 85%" }
            });
        });
    }
});