document.addEventListener('DOMContentLoaded', () => {
    
    // --- CONFIGURATION ---
    const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // --- 1. CANVAS GRID PARTICLE SYSTEM ---
    // A glowing particle moving on grid lines that leaves a trail and flees mouse.
    const canvas = document.getElementById('grid-canvas');
    if (canvas && !REDUCED_MOTION) {
        const ctx = canvas.getContext('2d');
        let width, height;
        const gridSize = 60; // Size of grid cells
        
        // Particle State
        let p = {
            x: 0, y: 0,
            vx: 0, vy: 0,
            speed: 2,
            trail: [] // Stores last positions for corntail
        };

        let mouse = { x: -1000, y: -1000 };

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            // Snap starting pos to grid
            p.x = Math.floor(width / 2 / gridSize) * gridSize;
            p.y = Math.floor(height / 2 / gridSize) * gridSize;
            p.vx = p.speed; // Start moving right
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
            
            // Draw Vertical Lines
            for (let x = 0; x <= width; x += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
                ctx.stroke();
            }
            // Draw Horizontal Lines
            for (let y = 0; y <= height; y += gridSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
                ctx.stroke();
            }
        }

        function updateParticle() {
            // 1. Record trail
            p.trail.push({ x: p.x, y: p.y, alpha: 1.0 });
            if (p.trail.length > 20) p.trail.shift();

            // 2. Flee Mouse Logic
            // If mouse is close (radius 150), force move away
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            
            if (dist < 150) {
                // If moving towards mouse, reverse immediately
                // Simple logic: if dx is negative (mouse is right of particle) and moving right, reverse.
                if (Math.abs(dx) > Math.abs(dy)) {
                   // Horizontal conflict
                   if (dx < 0 && p.vx > 0) p.vx = -p.speed;
                   if (dx > 0 && p.vx < 0) p.vx = p.speed;
                } else {
                   // Vertical conflict
                   if (dy < 0 && p.vy > 0) p.vy = -p.speed;
                   if (dy > 0 && p.vy < 0) p.vy = p.speed;
                }
            }

            // 3. Move
            p.x += p.vx;
            p.y += p.vy;

            // 4. Grid Intersection Logic
            // If we hit a grid intersection (modulo gridSize is near 0)
            // Note: Use a small threshold because floating point math
            const atX = Math.abs(p.x % gridSize) < p.speed;
            const atY = Math.abs(p.y % gridSize) < p.speed;

            if (atX && atY) {
                // We are at an intersection. 10% chance to turn.
                if (Math.random() < 0.1) {
                    const dirs = [
                        { vx: p.speed, vy: 0 },
                        { vx: -p.speed, vy: 0 },
                        { vx: 0, vy: p.speed },
                        { vx: 0, vy: -p.speed }
                    ];
                    // Pick random valid direction (stay on screen)
                    const next = dirs[Math.floor(Math.random() * dirs.length)];
                    p.vx = next.vx;
                    p.vy = next.vy;
                }
            }

            // 5. Bounds Check (Wrap around or Bounce)
            if (p.x < 0) { p.x = 0; p.vx = p.speed; }
            if (p.x > width) { p.x = width; p.vx = -p.speed; }
            if (p.y < 0) { p.y = 0; p.vy = p.speed; }
            if (p.y > height) { p.y = height; p.vy = -p.speed; }
        }

        function drawParticle() {
            // Draw Trail
            p.trail.forEach((pos, i) => {
                const ratio = i / p.trail.length; // 0 to 1
                ctx.fillStyle = `rgba(59, 130, 246, ${ratio * 0.4})`;
                ctx.fillRect(pos.x - 1, pos.y - 1, 3, 3);
            });

            // Draw Head
            ctx.fillStyle = '#3B82F6';
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#3B82F6';
            ctx.beginPath();
            ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);
            drawGrid();
            updateParticle();
            drawParticle();
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
            outlineX += (mouseX - outlineX) * 0.15;
            outlineY += (mouseY - outlineY) * 0.15;
            cursorOutline.style.transform = `translate(${outlineX}px, ${outlineY}px) translate(-50%, -50%)`;
            requestAnimationFrame(animateCursor);
        };
        animateCursor();

        const clickables = document.querySelectorAll('a, button, input, select, textarea');
        clickables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorOutline.style.width = '60px';
                cursorOutline.style.height = '60px';
                cursorOutline.style.background = 'rgba(255, 255, 255, 0.05)';
            });
            el.addEventListener('mouseleave', () => {
                cursorOutline.style.width = '40px';
                cursorOutline.style.height = '40px';
                cursorOutline.style.background = 'transparent';
            });
        });
    }

    // --- 3. NAV GLIDER (Fix) ---
    const navLinks = document.querySelectorAll('.nav-link');
    const glider = document.querySelector('.nav-glider');
    const navPill = document.querySelector('.nav-pill');
    
    // Helper to get relative path filename
    const getPageName = (path) => path.split('/').pop() || 'index.html';
    const currentName = getPageName(window.location.pathname);

    // Set Active Class
    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkName = getPageName(link.getAttribute('href'));
        if (linkName === currentName) {
            link.classList.add('active');
        }
    });

    if (glider && navPill) {
        function moveGlider(element) {
            if (!element) return;
            const rect = element.getBoundingClientRect();
            const parentRect = navPill.getBoundingClientRect();
            
            // Calculate relative position carefully
            const x = rect.left - parentRect.left;
            const y = rect.top - parentRect.top;
            
            gsap.to(glider, {
                x: x,
                y: y,
                width: rect.width,
                height: rect.height,
                opacity: 1,
                duration: 0.3,
                ease: "power2.out"
            });
        }

        navLinks.forEach(link => {
            link.addEventListener('mouseenter', () => moveGlider(link));
            // On mouse leave, return to active link or hide
            link.addEventListener('mouseleave', () => {
                 const active = document.querySelector('.nav-link.active');
                 if (active) moveGlider(active);
                 else gsap.to(glider, { opacity: 0 });
            });
        });

        // Initialize position on active link
        const initialActive = document.querySelector('.nav-link.active');
        if (initialActive) setTimeout(() => moveGlider(initialActive), 200);
    }

    // --- 4. ANIMATIONS (GSAP) ---
    if (window.gsap && window.ScrollTrigger && !REDUCED_MOTION) {
        gsap.registerPlugin(ScrollTrigger);

        // A. Hero Load
        const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
        timeline.fromTo(".nav-wrapper", { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 })
                .fromTo(".ticker-container", { opacity: 0 }, { opacity: 1, duration: 0.8 }, "-=0.6")
                .fromTo(".hero-title", { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, "-=0.6")
                .fromTo(".body-large.fade-in", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, "-=0.8")
                .fromTo(".hero-actions", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, "-=0.8")
                .fromTo(".hero-visual", { opacity: 0, scale: 0.95 }, { opacity: 0.9, scale: 1, duration: 1.2 }, "-=0.5");

        // B. Scroll Reveal
        document.querySelectorAll(".reveal-on-scroll").forEach(el => {
            gsap.fromTo(el, 
                { y: 30, opacity: 0 },
                {
                    y: 0, opacity: 1, duration: 0.8, ease: "power2.out",
                    scrollTrigger: { trigger: el, start: "top 85%" }
                }
            );
        });

        // C. Text Reveal
        document.querySelectorAll(".text-reveal-wrap").forEach(title => {
            const fill = title.querySelector(".text-fill");
            if (fill) {
                gsap.fromTo(fill, 
                    { clipPath: "inset(0 100% 0 0)" },
                    {
                        clipPath: "inset(0 0% 0 0)",
                        ease: "none",
                        scrollTrigger: {
                            trigger: title,
                            start: "top 90%",
                            end: "top 40%",
                            scrub: 1
                        }
                    }
                );
            }
        });
    }

    // --- 5. CONTACT FORM ---
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button');
            const successMsg = form.querySelector('.form-success-msg');
            const originalText = btn.textContent;
            
            btn.textContent = "Sending...";
            btn.style.opacity = "0.7";
            
            setTimeout(() => {
                btn.textContent = "Sent";
                btn.style.opacity = "1";
                form.reset();
                if(successMsg) successMsg.classList.add('visible');

                setTimeout(() => {
                    btn.textContent = originalText;
                    if(successMsg) successMsg.classList.remove('visible');
                }, 3000);
            }, 1500);
        });
    }
});