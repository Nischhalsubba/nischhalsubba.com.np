document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. FAQ ACCORDION LOGIC ---
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const trigger = item.querySelector('.faq-trigger');
        const content = item.querySelector('.faq-content');
        
        trigger.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all others
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                const otherContent = otherItem.querySelector('.faq-content');
                if(otherContent) otherContent.style.maxHeight = null;
            });

            // Toggle current
            if (!isActive) {
                item.classList.add('active');
                content.style.maxHeight = content.scrollHeight + "px";
            } else {
                item.classList.remove('active');
                content.style.maxHeight = null;
            }
        });
    });

    // --- 2. GSAP SCROLL ANIMATIONS ---
    if (window.gsap && window.ScrollTrigger) {
        const gsap = window.gsap;
        const ScrollTrigger = window.ScrollTrigger;
        gsap.registerPlugin(ScrollTrigger);

        // Hero Fade In sequence
        const heroElements = document.querySelectorAll(".hero-section .fade-in");
        if(heroElements.length > 0) {
            gsap.from(heroElements, {
                y: 30,
                opacity: 0,
                duration: 1.2,
                stagger: 0.15,
                ease: "power3.out",
                delay: 0.2
            });
        }

        // General Scroll Reveal
        const revealElements = document.querySelectorAll(".reveal-on-scroll");
        revealElements.forEach((element) => {
            gsap.fromTo(element, 
                { y: 40, opacity: 0 },
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
    }

    // --- 3. TIME DISPLAY ---
    const timeDisplay = document.getElementById('time-display');
    if (timeDisplay) {
        const updateTime = () => {
            const now = new Date();
            const options = { timeZone: 'Asia/Kathmandu', hour: '2-digit', minute: '2-digit', hour12: true };
            timeDisplay.textContent = now.toLocaleTimeString('en-US', options) + " KTH";
        };
        updateTime();
        setInterval(updateTime, 1000);
    }
});