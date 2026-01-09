
document.addEventListener('DOMContentLoaded', () => {

    const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Check for touch device to optimize performance
    const IS_TOUCH = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // --- 0. THEME HANDLING ---
    const themeBtn = document.getElementById('theme-toggle');
    const htmlEl = document.documentElement;

    // Images
    const DARK_IMG = "https://i.imgur.com/ixsEpYM.png";
    const LIGHT_IMG = "https://i.imgur.com/oFHdPUS.png";

    const sunIcon = `<svg viewBox="0 0 24 24"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 00-1.41 0 .996.996 0 000 1.41l1.29 1.29c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L5.99 4.58zm12.37 12.37a.996.996 0 00-1.41 0 .996.996 0 000 1.41l1.29 1.29c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41l-1.29-1.29zm1.41-13.78c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41l1.29 1.29c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41l-1.29-1.29zM7.28 17.28c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41l1.29 1.29c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41l-1.29-1.29z"/></svg>`;
    const moonIcon = `<svg viewBox="0 0 24 24"><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-3.03 0-5.5-2.47-5.5-5.5 0-1.82.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/></svg>`;

    function updateImages(theme) {
        const targetSrc = theme === 'light' ? LIGHT_IMG : DARK_IMG;

        const heroImg = document.querySelector('.hero-portrait-img');
        if (heroImg) heroImg.src = targetSrc;

        const footerImg = document.querySelector('.footer-portrait-img');
        if (footerImg) footerImg.src = targetSrc;

        const aboutImg = document.querySelector('.profile-img');
        if (aboutImg) aboutImg.src = targetSrc;
    }

    function setTheme(theme) {
        htmlEl.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        if (themeBtn) themeBtn.innerHTML = theme === 'light' ? moonIcon : sunIcon;
        updateImages(theme);
    }

    // Initialize Theme
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

    if (savedTheme) {
        setTheme(savedTheme);
    } else if (systemPrefersLight) {
        setTheme('light');
    } else {
        setTheme('dark');
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const currentTheme = htmlEl.getAttribute('data-theme') || 'dark';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            setTheme(newTheme);
        });
    }

    // --- MOBILE MENU TOGGLE ---
    const mobileBtn = document.querySelector('.mobile-nav-toggle');
    const body = document.body;
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            const isOpen = body.classList.toggle('menu-open');
            
            if (isOpen && window.gsap) {
                // Staggered animation for links opening
                gsap.fromTo(mobileLinks, 
                    { y: 30, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out", delay: 0.1 }
                );
            }
        });

        // Close menu when a link is clicked
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                body.classList.remove('menu-open');
            });
        });
    }

    // --- 1. SPOTLIGHT GRID CANVAS ---
    // DISABLED ON MOBILE/TOUCH FOR PERFORMANCE OPTIMIZATION
    const canvas = document.getElementById('grid-canvas');
    if (canvas && !REDUCED_MOTION && !IS_TOUCH) {
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

            const isLight = htmlEl.getAttribute('data-theme') === 'light';
            const gridSize = 60;
            const spotlightRadius = 400;

            const gridColor = isLight ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)';
            const spotlightColorStart = isLight ? 'rgba(37, 99, 235, 0.15)' : 'rgba(59, 130, 246, 0.15)';
            const spotlightColorEnd = isLight ? 'rgba(37, 99, 235, 0)' : 'rgba(59, 130, 246, 0)';

            ctx.lineWidth = 1;
            ctx.strokeStyle = gridColor;
            ctx.beginPath();
            for (let x = 0; x <= width; x += gridSize) { ctx.moveTo(x, 0); ctx.lineTo(x, height); }
            for (let y = 0; y <= height; y += gridSize) { ctx.moveTo(0, y); ctx.lineTo(width, y); }
            ctx.stroke();

            const grad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, spotlightRadius);
            grad.addColorStop(0, spotlightColorStart);
            grad.addColorStop(1, spotlightColorEnd);

            ctx.strokeStyle = grad;
            ctx.beginPath();

            const startX = Math.floor((mouse.x - spotlightRadius) / gridSize) * gridSize;
            const endX = Math.floor((mouse.x + spotlightRadius) / gridSize) * gridSize;
            const startY = Math.floor((mouse.y - spotlightRadius) / gridSize) * gridSize;
            const endY = Math.floor((mouse.y + spotlightRadius) / gridSize) * gridSize;

            for (let x = startX; x <= endX; x += gridSize) {
                if (x < 0 || x > width) continue;
                ctx.moveTo(x, Math.max(0, mouse.y - spotlightRadius));
                ctx.lineTo(x, Math.min(height, mouse.y + spotlightRadius));
            }
            for (let y = startY; y <= endY; y += gridSize) {
                if (y < 0 || y > height) continue;
                ctx.moveTo(Math.max(0, mouse.x - spotlightRadius), y);
                ctx.lineTo(Math.min(width, mouse.x + spotlightRadius), y);
            }
            ctx.stroke();

            requestAnimationFrame(drawGrid);
        }
        drawGrid();
    }

    // --- 2. CUSTOM CURSOR (Fixed & Safe) ---
    const cursorDot = document.querySelector('.custom-cursor-dot');
    const cursorOutline = document.querySelector('.custom-cursor-outline');

    // Only enable if pointer is fine (mouse) and elements exist
    // DISABLED ON TOUCH DEVICES
    if (!REDUCED_MOTION && window.matchMedia('(pointer: fine)').matches && !IS_TOUCH && cursorDot) {

        // Add class to body to hide default cursor ONLY when this logic is active
        document.body.classList.add('custom-cursor-active');

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
        const interactiveSelectors = 'a, button, input, textarea, .project-card, .nav-pill, .writing-item, .project-nav-card, .social-icon-btn, .award-item, .t-btn, .theme-toggle-btn, .mobile-nav-toggle';

        document.querySelectorAll(interactiveSelectors).forEach(el => {
            el.addEventListener('mouseenter', () => {
                gsap.to(cursorOutline, {
                    width: 60,
                    height: 60,
                    backgroundColor: 'rgba(128, 128, 128, 0.1)',
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
                    borderColor: 'var(--cursor-border)',
                    duration: 0.3
                });
                gsap.to(cursorDot, { scale: 1, duration: 0.3 });
            });
        });
    }

    // --- 3. TITLE SCROLL REVEAL (Outline to Fill) ---
    if (window.gsap && window.ScrollTrigger && !REDUCED_MOTION) {
        gsap.registerPlugin(ScrollTrigger);

        document.querySelectorAll('.text-reveal-wrap').forEach(title => {
            const fillText = title.querySelector('.text-fill');
            if (fillText) {
                gsap.to(fillText, {
                    clipPath: 'inset(0 0% 0 0)',
                    ease: 'none',
                    scrollTrigger: {
                        trigger: title,
                        start: 'top 90%', // Earlier start for mobile
                        end: 'bottom 20%', // Earlier end for mobile
                        scrub: 0.5 // Smoother scrubbing
                    }
                });
            }
        });

        document.querySelectorAll(".reveal-on-scroll").forEach(el => {
            gsap.fromTo(el, { y: 40, opacity: 0 }, {
                y: 0, opacity: 1, duration: 0.8,
                scrollTrigger: { trigger: el, start: "top 85%" }
            });
        });
    }

    // --- 4. NAV GLIDER LOGIC (Fixed) ---
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
        if (homeLink) homeLink.classList.add('active');
    }

    if (glider && !IS_TOUCH) { // Disable glider hover effect on touch
        const moveGlider = (el) => {
            // Use offsetLeft/Width which are relative to the parent (.nav-pill)
            // This is safer than getBoundingClientRect regarding padding.
            gsap.to(glider, {
                x: el.offsetLeft, // Positions glider at exact start of link
                width: el.offsetWidth, // Matches link width (including padding)
                opacity: 1,
                duration: 0.3,
                ease: "power2.out"
            });
        };
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

    // --- 5. FILTER & SEARCH LOGIC ---
    const setupFilters = (btnClass, itemClass, attrName, searchId) => {
        const filterBtns = document.querySelectorAll(btnClass);
        const items = document.querySelectorAll(itemClass);
        const searchInput = document.getElementById(searchId);

        if (filterBtns.length === 0 && !searchInput) return;

        let currentCategory = 'all';
        let currentSearch = '';

        const filterItems = () => {
            items.forEach(el => {
                const tags = el.getAttribute(attrName);
                // For text search, we look at the entire text content of the card/item
                const textContent = el.innerText.toLowerCase();

                const matchesCategory = currentCategory === 'all' || (tags && tags.includes(currentCategory));
                const matchesSearch = currentSearch === '' || textContent.includes(currentSearch);

                if (matchesCategory && matchesSearch) {
                    el.classList.remove('hidden');
                    // Reset animation trigger if hidden
                    gsap.to(el, { opacity: 1, y: 0, duration: 0.4, display: 'flex' }); // Flex or Grid depending on CSS
                } else {
                    el.classList.add('hidden');
                    gsap.to(el, { opacity: 0, display: 'none', duration: 0 });
                }
            });
        };

        // Button Clicks
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentCategory = btn.getAttribute('data-filter');
                filterItems();
            });
        });

        // Search Input
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                currentSearch = e.target.value.toLowerCase();
                filterItems();
            });
        }
    };

    // Apply to Work and Writing pages if present
    setupFilters('.filter-btn', '.project-card', 'data-category', 'search-work');
    setupFilters('.blog-filter-btn', '.writing-item', 'data-category', 'search-blog');


    // --- 6. TESTIMONIAL CAROUSEL ---
    const tTrack = document.querySelector('.t-track');
    const tPrev = document.getElementById('t-prev');
    const tNext = document.getElementById('t-next');
    const tSlides = document.querySelectorAll('.t-slide');

    if (tTrack && tSlides.length > 0) {
        let tIndex = 0;
        const updateT = () => {
            tTrack.style.transform = `translateX(-${tIndex * 100}%)`;
            tSlides.forEach((s, i) => {
                s.classList.toggle('active', i === tIndex);
            });
        };

        if (tPrev) tPrev.addEventListener('click', () => {
            tIndex = (tIndex > 0) ? tIndex - 1 : tSlides.length - 1;
            updateT();
        });

        if (tNext) tNext.addEventListener('click', () => {
            tIndex = (tIndex < tSlides.length - 1) ? tIndex + 1 : 0;
            updateT();
        });
        updateT();
    }

    // --- 7. CONTACT FORM HANDLER ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerText;

            btn.innerText = 'Sending...';
            btn.style.opacity = '0.7';

            // Simulate sending
            setTimeout(() => {
                btn.innerText = 'Message Sent!';
                btn.style.background = '#4CAF50';
                btn.style.color = '#fff';
                btn.style.opacity = '1';
                contactForm.reset();

                // Reset button after 3 seconds
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.style.background = ''; // Revert to CSS default
                    btn.style.color = '';
                }, 3000);
            }, 1500);
        });
    }
});