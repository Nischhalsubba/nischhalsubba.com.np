document.addEventListener('DOMContentLoaded', () => {
    
    // --- CONFIGURATION ---
    const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // --- 1. CUSTOM CURSOR ---
    const cursorDot = document.querySelector('.custom-cursor-dot');
    const cursorOutline = document.querySelector('.custom-cursor-outline');
    
    if (!REDUCED_MOTION && window.matchMedia('(pointer: fine)').matches && cursorDot) {
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let outlineX = mouseX;
        let outlineY = mouseY;

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
                cursorOutline.style.background = 'rgba(255,255,255,0.05)';
            });
            el.addEventListener('mouseleave', () => {
                cursorOutline.style.width = '40px';
                cursorOutline.style.height = '40px';
                cursorOutline.style.background = 'transparent';
            });
        });
    }

    // --- 2. NAV ACTIVE STATE & GLIDER ---
    const navLinks = document.querySelectorAll('.nav-link');
    const glider = document.querySelector('.nav-glider');
    const navPill = document.querySelector('.nav-pill');
    
    const currentPath = window.location.pathname;
    
    // Set active class based on path
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        // Check for exact match or root match
        if (href === currentPath) {
            link.classList.add('active');
        } else if (currentPath === '/' && href === '/index.html') {
             link.classList.add('active');
        } else if (href !== '/index.html' && currentPath.includes(href)) {
             link.classList.add('active');
        }
    });

    if (glider && navPill) {
        function moveGlider(element) {
            if (!element) return;
            const rect = element.getBoundingClientRect();
            const parentRect = navPill.getBoundingClientRect();
            
            const relLeft = rect.left - parentRect.left;
            const relTop = rect.top - parentRect.top; 
            
            gsap.to(glider, {
                x: relLeft,
                y: relTop,
                width: rect.width,
                height: rect.height,
                opacity: 1,
                duration: 0.3,
                ease: "power2.out"
            });
        }

        navLinks.forEach(link => {
            link.addEventListener('mouseenter', () => moveGlider(link));
            link.addEventListener('mouseleave', () => {
                const active = document.querySelector('.nav-link.active');
                if (active) moveGlider(active);
                else gsap.to(glider, { opacity: 0 });
            });
        });

        // Initialize position on active element
        const initialActive = document.querySelector('.nav-link.active');
        if (initialActive) {
            setTimeout(() => moveGlider(initialActive), 100);
        }
    }

    // --- 3. FAQ ACCORDION ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const trigger = item.querySelector('.faq-trigger');
        const answer = item.querySelector('.faq-answer');
        
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const isActive = item.classList.contains('active');
            
            // Close others
            faqItems.forEach(other => {
                if (other !== item) {
                    other.classList.remove('active');
                    gsap.to(other.querySelector('.faq-answer'), { height: 0, duration: 0.3 });
                }
            });

            if (!isActive) {
                item.classList.add('active');
                gsap.set(answer, { height: "auto" });
                gsap.from(answer, { height: 0, duration: 0.3, ease: "power2.out" });
            } else {
                item.classList.remove('active');
                gsap.to(answer, { height: 0, duration: 0.3 });
            }
        });
    });

    // --- 4. ANIMATIONS (GSAP) ---
    if (window.gsap && window.ScrollTrigger && !REDUCED_MOTION) {
        const gsap = window.gsap;
        const ScrollTrigger = window.ScrollTrigger;
        gsap.registerPlugin(ScrollTrigger);

        // A. Hero Sequence
        const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
        
        timeline.fromTo(".nav-wrapper", { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 })
                .fromTo(".hero-pills-row", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, "-=0.6")
                .fromTo(".hero-title", { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, "-=0.6")
                .fromTo(".body-large.fade-in", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, "-=0.8")
                .fromTo(".hero-actions", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, "-=0.8");

        // B. Standard Scroll Reveal
        document.querySelectorAll(".reveal-on-scroll").forEach(el => {
            gsap.fromTo(el, 
                { y: 40, opacity: 0 },
                {
                    y: 0, opacity: 1, duration: 0.8, ease: "power2.out",
                    scrollTrigger: {
                        trigger: el,
                        start: "top 85%"
                    }
                }
            );
        });

        // C. Outline-to-Fill Text Animation
        document.querySelectorAll(".text-reveal-wrap").forEach(title => {
            const fill = title.querySelector(".text-fill");
            if (fill) {
                gsap.to(fill, {
                    clipPath: "inset(0 0% 0 0)",
                    duration: 1.2,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: title,
                        start: "top 80%",
                        toggleActions: "play none none reverse"
                    }
                });
            }
        });

        // D. Image Hover Parallax
        document.querySelectorAll('.project-card').forEach(card => {
            const img = card.querySelector('img');
            card.addEventListener('mouseenter', () => {
                gsap.to(img, { scale: 1.05, duration: 0.6, ease: "power2.out" });
            });
            card.addEventListener('mouseleave', () => {
                gsap.to(img, { scale: 1, duration: 0.6, ease: "power2.out" });
            });
        });

    }

    // --- 5. TIME DISPLAY ---
    const timeDisplay = document.getElementById('time-display');
    if (timeDisplay) {
        const updateTime = () => {
            const now = new Date();
            // Use try-catch to handle environments without timezone support
            try {
                const options = { timeZone: 'Asia/Kathmandu', hour: '2-digit', minute: '2-digit', hour12: true };
                const timeString = now.toLocaleTimeString('en-US', options);
                timeDisplay.textContent = `${timeString} Kathmandu`;
            } catch (e) {
                timeDisplay.textContent = "Kathmandu";
            }
        };
        updateTime();
        setInterval(updateTime, 1000);
    }
    
    // --- 6. FORM SUBMISSION ---
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
                
                // Show success message
                if(successMsg) successMsg.classList.add('visible');

                setTimeout(() => {
                    btn.textContent = originalText;
                    if(successMsg) successMsg.classList.remove('visible');
                }, 3000);
            }, 1500);
        });
    }
});