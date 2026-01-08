document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. VANILLA JS CUSTOM CURSOR (No GSAP dependency) ---
    const cursorDot = document.createElement('div');
    const cursorOutline = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    cursorOutline.className = 'cursor-outline';
    document.body.appendChild(cursorDot);
    document.body.appendChild(cursorOutline);

    // Enable custom cursor styles via class
    document.body.classList.add('custom-cursor-enabled');

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    
    // Smoothness config
    let outlineX = mouseX;
    let outlineY = mouseY;
    
    // Track mouse position
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Dot follows instantly
        cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    });

    // Animation Loop for smooth outline
    const animateCursor = () => {
        // Linear interpolation for smooth lag
        const speed = 0.15;
        outlineX += (mouseX - outlineX) * speed;
        outlineY += (mouseY - outlineY) * speed;
        
        cursorOutline.style.transform = `translate(${outlineX}px, ${outlineY}px) translate(-50%, -50%)`;
        
        requestAnimationFrame(animateCursor);
    };
    animateCursor();

    // Hover Scaling logic
    const clickables = document.querySelectorAll('a, button, input, textarea, select, .clickable, .faq-question');
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
    if (window.gsap && window.ScrollTrigger) {
        const gsap = window.gsap;
        const ScrollTrigger = window.ScrollTrigger;
        gsap.registerPlugin(ScrollTrigger);

        // Hero Fade In
        gsap.from(".fade-in", {
            y: 50,
            opacity: 0,
            duration: 1.2,
            stagger: 0.1,
            ease: "power3.out",
            delay: 0.2
        });

        // Scroll Reveal Elements
        const revealElements = document.querySelectorAll(".reveal-on-scroll");
        revealElements.forEach((element) => {
            gsap.from(element, {
                y: 50,
                opacity: 0,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: element,
                    start: "top 85%",
                }
            });
        });
    }

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
        const href = link.getAttribute('href');
        let isActive = false;
        const cleanHref = href.split('#')[0]; 

        if (cleanHref === 'index.html') {
             if (currentPath === '/' || currentPath.endsWith('/index.html') || currentPath.endsWith('/')) {
                 isActive = true;
             }
        } else if (cleanHref) {
             if (currentPath.endsWith(cleanHref)) {
                 isActive = true;
             }
        }

        if (isActive) {
            link.classList.add('active');
        }
        
        if(href.includes('#')) {
             link.addEventListener('click', (e) => {
                 const targetId = href.split('#')[1];
                 const targetEl = document.getElementById(targetId);
                 if(targetEl) {
                     navLinks.forEach(l => l.classList.remove('active'));
                     link.classList.add('active');
                 }
             });
        }
    });

    // --- 5. TESTIMONIAL CAROUSEL ---
    const slides = document.querySelectorAll('.testimonial-slide');
    if (slides.length > 0) {
        let currentSlide = 0;
        const dots = document.querySelectorAll('.t-dot');
        const totalSlides = slides.length;
        let slideInterval;

        const showSlide = (index) => {
            slides.forEach(s => s.classList.remove('active'));
            dots.forEach(d => d.classList.remove('active'));
            
            slides[index].classList.add('active');
            dots[index].classList.add('active');
        };

        const startSlideTimer = () => {
            slideInterval = setInterval(() => {
                currentSlide = (currentSlide + 1) % totalSlides;
                showSlide(currentSlide);
            }, 6000); 
        };

        dots.forEach((dot) => {
            dot.addEventListener('click', (e) => {
                clearInterval(slideInterval);
                const index = parseInt(e.target.getAttribute('data-index'));
                currentSlide = index;
                showSlide(currentSlide);
                startSlideTimer();
            });
        });

        startSlideTimer();
    }

    // --- 6. CASE STUDY SIDEBAR SCROLL SPY ---
    const tocLinks = document.querySelectorAll('.toc-link');
    if (tocLinks.length > 0) {
        window.addEventListener('scroll', () => {
            let current = "";
            const sections = ['challenge', 'approach', 'process', 'outcome'];
            
            sections.forEach(id => {
                const el = document.getElementById(id);
                if (el) {
                    const top = el.offsetTop;
                    if (window.scrollY >= top - 200) {
                        current = id;
                    }
                }
            });

            tocLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('onclick').includes(current)) {
                    link.classList.add('active');
                }
            });
        });
    }

    // --- 7. FAQ ACCORDION ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            // Close others (optional - can keep multiple open)
            faqItems.forEach(otherItem => {
                if (otherItem !== item) otherItem.classList.remove('active');
            });
            item.classList.toggle('active');
        });
    });

    // --- 8. FORM SUCCESS SIMULATION ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const successOverlay = document.getElementById('form-success');
            if (successOverlay) {
                successOverlay.classList.add('visible');
                contactForm.reset();
            }
        });
    }

});