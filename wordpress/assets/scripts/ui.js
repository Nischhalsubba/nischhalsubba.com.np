/* 
  UI Interactions
  Handles Cursor, Sliders, and Navigation State.
*/

const gsap = window.gsap;

// 1. Custom Cursor
const cursorDot = document.querySelector('.custom-cursor-dot');
const cursorOutline = document.querySelector('.custom-cursor-outline');
const hoverElements = document.querySelectorAll('a, button, input, .cursor-hover');

if (window.matchMedia("(pointer: fine)").matches && cursorDot && cursorOutline) {
    window.addEventListener('mousemove', (e) => {
      const posX = e.clientX;
      const posY = e.clientY;
      cursorDot.style.left = `${posX}px`;
      cursorDot.style.top = `${posY}px`;

      gsap.to(cursorOutline, {
        x: posX,
        y: posY,
        duration: 0.15,
        ease: "power2.out"
      });
    });

    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        document.body.classList.add('hovering');
      });
      el.addEventListener('mouseleave', () => {
        document.body.classList.remove('hovering');
      });
    });
}

// 2. Testimonial Carousel
let currentSlide = 0;
const slides = document.querySelectorAll('.testimonial-slide');
const dots = document.querySelectorAll('.t-dot');
const totalSlides = slides.length;
let slideInterval;

function showSlide(index) {
    slides.forEach(slide => {
        slide.style.opacity = '0';
        slide.style.zIndex = '0';
        slide.style.pointerEvents = 'none';
    });
    dots.forEach(dot => {
        dot.classList.replace('bg-accent', 'bg-white/20');
        dot.classList.replace('w-6', 'w-2.5'); 
    });

    if(slides[index]) {
        slides[index].style.opacity = '1';
        slides[index].style.zIndex = '10';
        slides[index].style.pointerEvents = 'auto';
        if(dots[index]) dots[index].classList.replace('bg-white/20', 'bg-accent');
    }
}

function startSlideTimer() {
    slideInterval = setInterval(() => {
        currentSlide = (currentSlide + 1) % totalSlides;
        showSlide(currentSlide);
    }, 5000); 
}

dots.forEach((dot) => {
    dot.addEventListener('click', (e) => {
        clearInterval(slideInterval);
        const target = e.target;
        const index = parseInt(target.getAttribute('data-index') || '0');
        currentSlide = index;
        showSlide(currentSlide);
        startSlideTimer();
    });
});

if (slides.length > 0) {
    showSlide(0);
    startSlideTimer();
}

// 3. Nav Active State
const sections = document.querySelectorAll("section");
const navIcons = document.querySelectorAll(".nav-icon");

window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      if (window.scrollY >= sectionTop - 300) {
        current = section.getAttribute("id") || "";
      }
    });

    navIcons.forEach((a) => {
      a.classList.remove("active");
      if (a.getAttribute("href")?.includes(current)) {
        a.classList.add("active");
      }
    });
});
