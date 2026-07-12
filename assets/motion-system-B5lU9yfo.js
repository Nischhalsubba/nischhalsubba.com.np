const n="nrs-professional-motion-style",a=[".hero-section > .eyebrow",".hero-section > .hero-title",".hero-section > .body-large",".hero-actions",".project-card",".writing-item",".contact-form",".nrs-case-study-snapshot"].join(","),i=[".project-card",".writing-item",".impact-card",".journey-card",".comparison-card",".metric-plan-card",".story-card",".quote-card"].join(",");function c(){return window.matchMedia("(prefers-reduced-motion: reduce)").matches}function m(){let r=document.getElementById(n);r||(r=document.createElement("style"),r.id=n,document.head.appendChild(r)),r.textContent=`
    .nrs-motion-ready ${a} {
      will-change: transform, opacity;
    }

    .nrs-motion-ready ${i} {
      transition:
        transform 260ms cubic-bezier(.16, 1, .3, 1),
        border-color 180ms ease,
        color 180ms ease,
        opacity 320ms cubic-bezier(.16, 1, .3, 1) !important;
    }

    .nrs-motion-ready ${i}:hover {
      transform: translate3d(0, -3px, 0) !important;
    }

    .nrs-motion-ready .btn,
    .nrs-motion-ready .nav-link,
    .nrs-motion-ready .filter-btn,
    .nrs-motion-ready .link-pill,
    .nrs-motion-ready .badge-pill,
    .nrs-motion-ready .theme-toggle-btn {
      transition:
        transform 160ms cubic-bezier(.16, 1, .3, 1),
        background-color 160ms ease,
        border-color 160ms ease,
        color 160ms ease !important;
    }

    .nrs-motion-ready .btn:hover,
    .nrs-motion-ready .nav-link:hover,
    .nrs-motion-ready .filter-btn:hover,
    .nrs-motion-ready .link-pill:hover,
    .nrs-motion-ready .badge-pill:hover,
    .nrs-motion-ready .theme-toggle-btn:hover {
      transform: translate3d(0, -2px, 0) !important;
    }

    .nrs-motion-ready .btn:active,
    .nrs-motion-ready .nav-link:active,
    .nrs-motion-ready .filter-btn:active,
    .nrs-motion-ready .link-pill:active,
    .nrs-motion-ready .theme-toggle-btn:active {
      transform: translate3d(0, 0, 0) scale(.985) !important;
    }

    @media (prefers-reduced-motion: reduce) {
      .nrs-motion-ready *,
      .nrs-motion-ready *::before,
      .nrs-motion-ready *::after {
        animation-duration: .001ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: .001ms !important;
        scroll-behavior: auto !important;
      }
    }
  `}function l(){return Array.from(document.querySelectorAll(a)).filter(r=>r instanceof HTMLElement)}function d(r){const t=window.gsap,o=window.ScrollTrigger;return!t||!o?!1:(t.registerPlugin(o),r.forEach((e,s)=>{t.fromTo(e,{autoAlpha:0,y:12},{autoAlpha:1,y:0,duration:.46,delay:Math.min(s*.008,.06),ease:"power2.out",clearProps:"transform,opacity,visibility",scrollTrigger:{trigger:e,start:"top 92%",once:!0}})}),!0)}function u(r){const t=new IntersectionObserver(o=>{o.forEach(e=>{e.isIntersecting&&(e.target.animate([{opacity:0,transform:"translate3d(0, 20px, 0)"},{opacity:1,transform:"translate3d(0, 0, 0)"}],{duration:420,easing:"cubic-bezier(.16, 1, .3, 1)",fill:"both"}),t.unobserve(e.target))})},{rootMargin:"0px 0px -10% 0px",threshold:.08});r.forEach(o=>t.observe(o))}function p(){if(c())return;m(),document.documentElement.classList.add("nrs-motion-ready");const r=l();d(r)||u(r)}export{p as initProfessionalMotionSystem};
