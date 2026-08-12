/* 
  Animations (GSAP)
  Handles all scroll-based and timeline animations.
*/

const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;
gsap.registerPlugin(ScrollTrigger);

// 1. Hero Parallax (Move the image up slightly as user scrolls)
gsap.to("#home img", {
    yPercent: 20, 
    ease: "none",
    scrollTrigger: {
      trigger: "#home",
      start: "top top",
      end: "bottom top",
      scrub: true
    }
});

// 2. Ticker
gsap.to("#hero-ticker", {
    x: "-50%",
    repeat: -1,
    duration: 20,
    ease: "linear"
});

// 3. Staggered Blog Reveal
gsap.to(".blog-card", {
    scrollTrigger: {
      trigger: "#blog",
      start: "top 75%",
    },
    opacity: 1,
    y: 0,
    stagger: 0.25,
    duration: 0.8,
    ease: "power2.out"
});
// Initial set
gsap.set(".blog-card", { y: 40, opacity: 0 });

// 4. General Reveal
const revealElements = document.querySelectorAll(".reveal-el");
revealElements.forEach((element) => {
    gsap.to(element, {
      scrollTrigger: {
        trigger: element,
        start: "top 85%", 
        toggleActions: "play none none reverse"
      },
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out"
    });
    gsap.set(element, { y: 40, opacity: 0 });
});
