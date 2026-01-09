
document.addEventListener('DOMContentLoaded', () => {
    
    const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const htmlEl = document.documentElement;

    // --- THEME ENGINE ---
    const themeBtn = document.getElementById('theme-toggle');
    const DARK_IMG = "https://i.imgur.com/ixsEpYM.png";
    const LIGHT_IMG = "https://i.imgur.com/oFHdPUS.png";

    const sunIcon = `<svg viewBox="0 0 24 24"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 00-1.41 0 .996.996 0 000 1.41l1.29 1.29c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L5.99 4.58zm12.37 12.37a.996.996 0 00-1.41 0 .996.996 0 000 1.41l1.29 1.29c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L5.99 4.58zm1.41-13.78c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41l1.29 1.29c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41l-1.29-1.29zM7.28 17.28c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41l1.29 1.29c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41l-1.29-1.29z"/></svg>`;
    const moonIcon = `<svg viewBox="0 0 24 24"><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-3.03 0-5.5-2.47-5.5-5.5 0-1.82.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/></svg>`;

    function setTheme(theme) {
        htmlEl.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        if (themeBtn) themeBtn.innerHTML = theme === 'light' ? moonIcon : sunIcon;
        document.querySelectorAll('.hero-portrait-img, .footer-portrait-img, .profile-img').forEach(img => {
            img.src = theme === 'light' ? LIGHT_IMG : DARK_IMG;
        });
    }

    const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    setTheme(savedTheme);

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const current = htmlEl.getAttribute('data-theme');
            setTheme(current === 'light' ? 'dark' : 'light');
        });
    }

    // --- NAVIGATION GLIDER ---
    const navLinks = document.querySelectorAll('.nav-link');
    const glider = document.querySelector('.nav-glider');
    if (glider) {
        const moveGlider = (el) => {
            gsap.to(glider, { x: el.offsetLeft, width: el.offsetWidth, opacity: 1, duration: 0.4, ease: "power4.out" });
        };
        const activeLink = document.querySelector('.nav-link.active');
        if(activeLink) setTimeout(() => moveGlider(activeLink), 150);
        
        navLinks.forEach(link => {
            link.addEventListener('mouseenter', () => moveGlider(link));
            link.addEventListener('mouseleave', () => activeLink ? moveGlider(activeLink) : gsap.to(glider, { opacity: 0 }));
        });
    }

    // --- SEARCH SYSTEM ---
    const setupSearch = (inputId, clearId, itemsClass, categoryAttr) => {
        const input = document.getElementById(inputId);
        const clear = document.getElementById(clearId);
        const items = document.querySelectorAll(itemsClass);
        if (!input) return;

        const filter = () => {
            const query = input.value.toLowerCase();
            clear.classList.toggle('visible', query.length > 0);
            
            items.forEach(item => {
                const text = item.textContent.toLowerCase();
                const tags = (item.getAttribute(categoryAttr) || "").toLowerCase();
                const isMatch = text.includes(query) || tags.includes(query);
                
                if(isMatch) {
                    item.style.display = itemsClass.includes('writing') ? 'grid' : 'flex';
                    gsap.to(item, { opacity: 1, y: 0, duration: 0.3 });
                } else {
                    item.style.display = 'none';
                    gsap.set(item, { opacity: 0, y: 10 });
                }
            });
        };

        input.addEventListener('input', filter);
        clear.addEventListener('click', () => {
            input.value = "";
            filter();
            input.focus();
        });
    };

    setupSearch('search-work', 'clear-work', '.project-card', 'data-category');
    setupSearch('search-blog', 'clear-blog', '.writing-item', 'data-category');

    // --- TESTIMONIAL CAROUSEL ---
    const tTrack = document.querySelector('.t-track');
    const tSlides = document.querySelectorAll('.t-slide');
    if(tTrack && tSlides.length > 0) {
        let idx = 0;
        const update = () => {
            tTrack.style.transform = `translateX(-${idx * 100}%)`;
            tSlides.forEach((s, i) => s.classList.toggle('active', i === idx));
        };
        document.getElementById('t-next')?.addEventListener('click', () => { idx = (idx + 1) % tSlides.length; update(); });
        document.getElementById('t-prev')?.addEventListener('click', () => { idx = (idx - 1 + tSlides.length) % tSlides.length; update(); });
    }

    // --- GSAP REVEALS ---
    if (!REDUCED_MOTION && window.gsap && window.ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
        document.querySelectorAll('.text-reveal-wrap').forEach(wrap => {
            const fill = wrap.querySelector('.text-fill');
            if(fill) gsap.to(fill, { clipPath: 'inset(0 0% 0 0)', scrollTrigger: { trigger: wrap, start: 'top 85%', scrub: 1 } });
        });
        document.querySelectorAll(".reveal-on-scroll").forEach(el => {
            gsap.fromTo(el, {y:20, opacity:0}, { y:0, opacity:1, duration:0.6, scrollTrigger: { trigger: el, start: "top 90%" } });
        });
    }
});
