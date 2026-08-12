import{p as y,i as f}from"./script.js_v_32-B_qKUDlB.js";const w="nrs-decorative-cursor-style",E=["a","button","input","textarea","select","summary","label",'[role="button"]','[tabindex]:not([tabindex="-1"])',".project-card",".impact-card",".blog-card-modern",".writing-item",".link-pill",".filter-btn",".btn",".nrs-cursor-target"].join(",");function l(){let t=document.getElementById(w);t||(t=document.createElement("style"),t.id=w,document.head.appendChild(t)),t.textContent=`
    .nrs-premium-cursor,
    .nrs-premium-cursor * {
      cursor: auto !important;
    }

    .nrs-cursor-dot,
    .nrs-cursor-ring {
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      pointer-events: none !important;
      z-index: 2147483647 !important;
      opacity: 0 !important;
      display: block !important;
      visibility: visible !important;
      will-change: transform, opacity, width, height, border-color, background-color !important;
    }

    .nrs-cursor-dot {
      width: 7px !important;
      height: 7px !important;
      border-radius: 999px !important;
      background: #E0E0E0 !important;
      box-shadow: none !important;
      transition: opacity 160ms ease, width 180ms ease, height 180ms ease, background-color 180ms ease !important;
    }

    .nrs-cursor-ring {
      width: 34px !important;
      height: 34px !important;
      border-radius: 999px !important;
      border: 1px solid #888888 !important;
      background: transparent !important;
      box-shadow: none !important;
      transition: opacity 160ms ease, width 220ms ease, height 220ms ease, border-color 220ms ease, background-color 220ms ease !important;
    }

    .nrs-cursor-visible .nrs-cursor-dot,
    .nrs-cursor-visible .nrs-cursor-ring {
      opacity: 1 !important;
    }

    .nrs-cursor-interactive .nrs-cursor-dot {
      width: 5px !important;
      height: 5px !important;
      background: #B0B0B0 !important;
    }

    .nrs-cursor-interactive .nrs-cursor-ring {
      width: 56px !important;
      height: 56px !important;
      border-color: #B0B0B0 !important;
      background: transparent !important;
    }

    .nrs-cursor-pressed .nrs-cursor-ring {
      width: 44px !important;
      height: 44px !important;
    }

    html[data-theme='light'] .nrs-cursor-dot {
      background: #444444 !important;
    }

    html[data-theme='light'] .nrs-cursor-ring {
      border-color: #444444 !important;
      background: transparent !important;
    }

    html[data-theme='light'] .nrs-cursor-interactive .nrs-cursor-dot {
      background: #1A1A1A !important;
    }

    html[data-theme='light'] .nrs-cursor-interactive .nrs-cursor-ring {
      border-color: #1A1A1A !important;
      background: transparent !important;
    }
  `}function x(t){const r=document.createElement("div");return r.className=t,r.setAttribute("aria-hidden","true"),document.body.appendChild(r),r}function A(){if(y()||f()||document.querySelector(".nrs-cursor-dot"))return;l();const t=x("nrs-cursor-dot"),r=x("nrs-cursor-ring");let o=window.innerWidth/2,n=window.innerHeight/2,a=o,d=n,s=0;document.body.classList.add("nrs-premium-cursor");function p(){a+=(o-a)*.18,d+=(n-d)*.18,t.style.transform=`translate3d(${o}px, ${n}px, 0) translate(-50%, -50%)`,r.style.transform=`translate3d(${a}px, ${d}px, 0) translate(-50%, -50%)`,s=requestAnimationFrame(p)}function b(){l(),document.body.classList.add("nrs-cursor-visible")}function g(){document.body.classList.remove("nrs-cursor-visible","nrs-cursor-interactive","nrs-cursor-pressed","nrs-cursor-text","nrs-cursor-media","nrs-cursor-labeled"),r.removeAttribute("data-label")}window.addEventListener("pointermove",e=>{e.pointerType&&e.pointerType!=="mouse"||(o=e.clientX,n=e.clientY,b())},{passive:!0}),window.addEventListener("scroll",b,{passive:!0}),window.addEventListener("resize",l),window.addEventListener("pointerleave",g,{passive:!0}),document.addEventListener("mouseleave",g,{passive:!0}),document.addEventListener("pointerover",e=>{const i=e.target;if(!(i instanceof Element))return;const h=i.closest(E),c=i.closest("[data-cursor-mode]"),u=i.closest("[data-cursor-label]"),v=c==null?void 0:c.getAttribute("data-cursor-mode"),m=(u==null?void 0:u.getAttribute("data-cursor-label"))||"";document.body.classList.toggle("nrs-cursor-interactive",!!h),document.body.classList.toggle("nrs-cursor-text",v==="text"&&!h),document.body.classList.toggle("nrs-cursor-media",v==="media"),document.body.classList.toggle("nrs-cursor-labeled",!!m),m?r.setAttribute("data-label",m):r.removeAttribute("data-label")},{passive:!0}),document.addEventListener("pointerdown",()=>{document.body.classList.add("nrs-cursor-pressed")},{passive:!0}),document.addEventListener("pointerup",()=>{document.body.classList.remove("nrs-cursor-pressed")},{passive:!0}),s=requestAnimationFrame(p),window.addEventListener("beforeunload",()=>{s&&cancelAnimationFrame(s)},{once:!0})}export{A as initPointerGlow};
