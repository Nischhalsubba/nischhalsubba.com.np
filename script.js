document.addEventListener('DOMContentLoaded', () => {
    console.log("Portfolio Script Loaded");

    // 0. Page Transition (Fade In)
    document.body.classList.add('loaded');

    // Initialize Lucide Icons
    if (window.lucide) {
        lucide.createIcons();
    }

    // GSAP Setup
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    
    if (gsap && ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);

        // 1. Hero Parallax (Requirement 8)
        // Image moves at 50% scroll speed relative to scroll
        const heroImg = document.querySelector('.hero-img');
        if (heroImg) {
            gsap.to(heroImg, {
                yPercent: 20, // Move down slightly as we scroll down
                ease: "none",
                scrollTrigger: {
                    trigger: ".hero-image-wrapper",
                    start: "top top",
                    end: "bottom top",
                    scrub: true
                }
            });
        }

        // 2. Hero Content Fade In
        const tl = gsap.timeline();
        tl.from(".fade-in", {
            y: 30,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: "power3.out"
        });

        // 3. Scroll Reveals
        const revealElements = document.querySelectorAll(".reveal-on-scroll");
        revealElements.forEach((element) => {
            gsap.from(element, {
                scrollTrigger: {
                    trigger: element,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                },
                y: 40,
                opacity: 0,
                duration: 1,
                ease: "power2.out"
            });
        });

        // 4. Staggered Blog Animation (Requirement 6)
        // Select all blog rows and animate them sequentially
        const blogRows = document.querySelectorAll('.blog-row');
        if (blogRows.length > 0) {
            gsap.to(blogRows, {
                scrollTrigger: {
                    trigger: ".blog-list",
                    start: "top 80%"
                },
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.25, // 0.25s delay between each
                ease: "power2.out",
                onStart: () => {
                    // Ensure they are set to visible if CSS hid them differently
                    blogRows.forEach(row => row.style.opacity = '1');
                }
            });
            // Initial state set via GSAP to ensure smooth start
            gsap.set(blogRows, { y: 20, opacity: 0 });
        }
    }

    // 5. Custom Cursor (Requirement 4)
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

        // Outline follows with slight delay (GSAP)
        gsap.to(cursorOutline, {
            x: posX,
            y: posY,
            duration: 0.15, // smooth lag
            ease: "power2.out"
        });
    });

    // Hover effects for cursor
    const interactiveElements = document.querySelectorAll('a, button, .clickable, .project-card, .blog-row');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.add('hovering');
        });
        el.addEventListener('mouseleave', () => {
            document.body.classList.remove('hovering');
        });
    });

    // 6. Testimonial Carousel (Requirement 7)
    const slides = document.querySelectorAll('.testimonial-slide');
    const dotsContainer = document.querySelector('.testi-dots');
    
    if (slides.length > 0 && dotsContainer) {
        let currentSlide = 0;
        const totalSlides = slides.length;
        let slideInterval;

        // Create dots
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
            // Hide all
            slides.forEach(s => s.classList.remove('active'));
            dots.forEach(d => d.classList.remove('active'));

            // Show current
            slides[index].classList.add('active');
            dots[index].classList.add('active');
            currentSlide = index;
        }

        function nextSlide() {
            let next = (currentSlide + 1) % totalSlides;
            goToSlide(next);
        }

        function startTimer() {
            slideInterval = setInterval(nextSlide, 5000); // 5 seconds
        }

        function resetTimer() {
            clearInterval(slideInterval);
            startTimer();
        }

        // Start
        startTimer();
    }

    // 7. Navigation Active State
    const navItems = document.querySelectorAll(".nav-item");
    const currentPath = window.location.pathname;

    // Highlight based on page
    navItems.forEach(item => {
        item.classList.remove('active');
        const href = item.getAttribute('href');
        
        if (currentPath.includes('index.html') || currentPath === '/') {
             if (href === 'index.html' || href === '#home') item.classList.add('active');
        } else if (currentPath.includes('projects') && href.includes('projects')) {
            item.classList.add('active');
        } else if (currentPath.includes('blog') && href.includes('blog')) {
            item.classList.add('active');
        } else if (href === '#contact' && window.location.hash === '#contact') {
            item.classList.add('active');
        }
    });

});