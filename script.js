document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. CUSTOM CURSOR (Redesigned for Smoothness) ---
    const cursorDot = document.createElement('div');
    const cursorOutline = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    cursorOutline.className = 'cursor-outline';
    document.body.appendChild(cursorDot);
    document.body.appendChild(cursorOutline);

    // Initial position to avoid jump
    gsap.set(cursorDot, {xPercent: -50, yPercent: -50});
    gsap.set(cursorOutline, {xPercent: -50, yPercent: -50});

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Dot follows instantly
        gsap.to(cursorDot, {
            x: mouseX, 
            y: mouseY, 
            duration: 0.01, 
            overwrite: true
        });

        // Outline follows with smooth lag
        gsap.to(cursorOutline, {
            x: mouseX,
            y: mouseY,
            duration: 0.15,
            ease: "power2.out",
            overwrite: true
        });
    });

    // Hover Scaling logic
    const clickables = document.querySelectorAll('a, button, input, textarea, .clickable');
    clickables.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
    });

    // Card Specific Hover
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => document.body.classList.add('hovering-card'));
        card.addEventListener('mouseleave', () => document.body.classList.remove('hovering-card'));
    });

    // --- 2. GSAP SCROLL ANIMATIONS ---
    const ScrollTrigger = window.ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);

    // Hero Fade In sequence
    const tl = gsap.timeline();
    tl.to(".fade-in", {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
        onStart: () => {
            gsap.set(".fade-in", {y: 30});
        }
    });

    // Scroll Reveal Elements
    const revealElements = document.querySelectorAll(".reveal-on-scroll");
    revealElements.forEach((element) => {
        gsap.fromTo(element, 
            { y: 50, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: element,
                    start: "top 85%",
                }
            }
        );
    });

    // --- 3. TIME DISPLAY ---
    const timeDisplay = document.getElementById('time-display');
    if (timeDisplay) {
        const updateTime = () => {
            const now = new Date();
            const options = { timeZone: 'Asia/Kathmandu', hour: '2-digit', minute: '2-digit', hour12: true };
            timeDisplay.textContent = now.toLocaleTimeString('en-US', options);
        };
        updateTime();
        setInterval(updateTime, 1000);
    }

    // --- 4. NAVIGATION ACTIVE STATE ---
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPath = window.location.pathname;
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href').replace('./', '');
        
        // Exact match for non-home pages or home page
        if (currentPath.endsWith(href) || (href === 'index.html' && currentPath === '/')) {
            link.classList.add('active');
        }
        
        // Hash link check
        if(href.startsWith('#')) {
             link.addEventListener('click', () => {
                 navLinks.forEach(l => l.classList.remove('active'));
                 link.classList.add('active');
             });
        }
    });

});