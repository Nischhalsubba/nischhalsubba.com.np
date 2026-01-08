document.addEventListener('DOMContentLoaded', () => {
    
    // Initialize Icons
    if (window.lucide) {
        lucide.createIcons();
    }

    // --- CUSTOM CURSOR LOGIC ---
    const cursorDot = document.createElement('div');
    const cursorOutline = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    cursorOutline.className = 'cursor-outline';
    document.body.appendChild(cursorDot);
    document.body.appendChild(cursorOutline);

    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        // Dot follows instantly
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        // Outline follows with lag via GSAP
        if (window.gsap) {
            window.gsap.to(cursorOutline, {
                x: posX,
                y: posY,
                duration: 0.1,
                ease: "power2.out"
            });
        }
    });

    // General Clickable Hover
    const clickables = document.querySelectorAll('a, button, .clickable, .nav-item');
    clickables.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
    });

    // Project Card Specific Hover (Requirement 1 & 5)
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => document.body.classList.add('hovering-card'));
        card.addEventListener('mouseleave', () => document.body.classList.remove('hovering-card'));
    });


    // --- GSAP ANIMATIONS ---
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    
    if (gsap && ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);

        // Hero Reveal
        const tl = gsap.timeline();
        tl.to(".fade-in", {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.1,
            ease: "power3.out",
            delay: 0.2
        });

        // Parallax
        const heroImg = document.querySelector('.hero-img');
        if (heroImg) {
            gsap.to(heroImg, {
                yPercent: 15,
                ease: "none",
                scrollTrigger: {
                    trigger: ".hero-image-wrapper",
                    start: "top top", 
                    end: "bottom top",
                    scrub: true
                }
            });
        }

        // Scroll Reveals
        const revealElements = document.querySelectorAll(".reveal-on-scroll");
        revealElements.forEach((element) => {
            gsap.fromTo(element, 
                { y: 40, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: element,
                        start: "top 85%",
                    }
                }
            );
        });
    }

    // --- TESTIMONIAL CAROUSEL ---
    const slides = document.querySelectorAll('.testimonial-slide');
    const dotsContainer = document.querySelector('.testi-dots');
    
    if (slides.length > 0 && dotsContainer) {
        let currentSlide = 0;
        const totalSlides = slides.length;
        let slideInterval;

        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            
            dot.addEventListener('click', () => {
                goToSlide(index);
                resetTimer();
            });
            dotsContainer.appendChild(dot);
        });

        const dots = document.querySelectorAll('.dot');

        function goToSlide(index) {
            slides.forEach(s => s.classList.remove('active'));
            dots.forEach(d => d.classList.remove('active'));
            slides[index].classList.add('active');
            dots[index].classList.add('active');
            currentSlide = index;
        }

        function nextSlide() {
            let next = (currentSlide + 1) % totalSlides;
            goToSlide(next);
        }

        function startTimer() {
            slideInterval = setInterval(nextSlide, 5000);
        }

        function resetTimer() {
            clearInterval(slideInterval);
            startTimer();
        }

        startTimer();
    }

    // --- NAV ACTIVE STATE ---
    const navItems = document.querySelectorAll(".nav-item");
    const currentPath = window.location.pathname;
    
    navItems.forEach(item => {
        item.classList.remove('active');
        const href = item.getAttribute('href').replace('./', '');
        
        if (currentPath.endsWith(href) || (href === 'index.html' && currentPath === '/')) {
            item.classList.add('active');
        }
    });

});