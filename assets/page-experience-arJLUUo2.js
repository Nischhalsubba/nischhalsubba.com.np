const r="nrs-page-experience-style",o="nrs-scroll-progress";function a(){let t=document.getElementById(r);t||(t=document.createElement("style"),t.id=r,document.head.appendChild(t)),t.textContent=`
    html {
      scroll-behavior: smooth;
    }

    #${o} {
      position: fixed !important;
      inset: 0 auto auto 0 !important;
      z-index: 2147483647 !important;
      display: block !important;
      width: 100vw !important;
      height: 6px !important;
      min-height: 6px !important;
      max-height: 6px !important;
      pointer-events: none !important;
      opacity: 1 !important;
      visibility: visible !important;
      background: rgba(255, 255, 255, 0.18) !important;
      transform: none !important;
      translate: none !important;
      scale: none !important;
      rotate: none !important;
      overflow: hidden !important;
      contain: paint !important;
      isolation: isolate !important;
      border: 0 !important;
      border-bottom: 1px solid rgba(255, 255, 255, 0.10) !important;
      border-radius: 0 !important;
      box-shadow: none !important;
    }

    #${o}::before {
      content: '' !important;
      position: absolute !important;
      inset: 0 auto 0 0 !important;
      display: block !important;
      width: 100% !important;
      height: 100% !important;
      transform: scaleX(var(--nrs-scroll-progress-scale, .02)) !important;
      transform-origin: left center !important;
      background: #E0E0E0 !important;
      transition: transform 80ms linear, background-color 180ms ease !important;
      will-change: transform !important;
      opacity: 1 !important;
      visibility: visible !important;
    }

    html[data-theme='light'] #${o} {
      background: rgba(68, 68, 68, 0.18) !important;
      border-bottom-color: rgba(68, 68, 68, 0.10) !important;
    }

    html[data-theme='light'] #${o}::before {
      background: #444444 !important;
    }

    html[data-theme='dark'] #${o}::before,
    html:not([data-theme='light']) #${o}::before {
      background: #E0E0E0 !important;
    }

    body {
      opacity: 1;
      transform: none !important;
    }

    body.nrs-page-visible {
      opacity: 1;
      transform: none !important;
    }

    body.nrs-page-exiting {
      opacity: 0;
      transform: none !important;
      transition: opacity 180ms ease;
    }

    @media (max-width: 760px) {
      #${o} {
        height: 5px !important;
        min-height: 5px !important;
        max-height: 5px !important;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      html {
        scroll-behavior: auto;
      }

      body,
      body.nrs-page-visible,
      body.nrs-page-exiting {
        opacity: 1 !important;
        transform: none !important;
        transition: none !important;
      }

      #${o},
      #${o}::before {
        transition: none !important;
      }
    }
  `}function s(t){const e=window.matchMedia("(max-width: 760px)").matches;Object.assign(t.style,{position:"fixed",top:"0px",left:"0px",right:"auto",bottom:"auto",zIndex:"2147483647",display:"block",width:"100vw",height:e?"5px":"6px",minHeight:e?"5px":"6px",maxHeight:e?"5px":"6px",pointerEvents:"none",opacity:"1",visibility:"visible",transform:"none",overflow:"hidden",borderRadius:"0",border:"0",background:document.documentElement.dataset.theme==="light"?"rgba(68, 68, 68, 0.18)":"rgba(255, 255, 255, 0.18)"})}function m(){let t=document.getElementById(o);return t||(t=document.createElement("div"),t.id=o,t.setAttribute("aria-hidden","true")),t.parentElement!==document.documentElement&&document.documentElement.prepend(t),s(t),t}function n(){a();const t=m(),e=document.documentElement.scrollHeight-window.innerHeight,i=e>0?Math.min(1,Math.max(.02,window.scrollY/e)):1;document.documentElement.style.setProperty("--nrs-scroll-progress-scale",String(i)),s(t)}function p(){requestAnimationFrame(()=>document.body.classList.add("nrs-page-visible")),document.addEventListener("click",t=>{const e=t.target.closest("a[href]");if(!e)return;const i=new URL(e.href,window.location.href),d=i.origin===window.location.origin,l=t.metaKey||t.ctrlKey||t.shiftKey||t.altKey||t.button!==0;!d||l||e.target==="_blank"||e.hasAttribute("download")||e.href.startsWith("mailto:")||e.href.startsWith("tel:")||i.href===window.location.href||i.pathname===window.location.pathname&&i.hash||(t.preventDefault(),document.body.classList.add("nrs-page-exiting"),window.setTimeout(()=>{window.location.href=i.href},160))})}function c(){new MutationObserver(()=>{n()}).observe(document.documentElement,{childList:!0,subtree:!1,attributes:!0,attributeFilter:["data-theme","style","class"]}),window.setInterval(n,1e3)}function u(){a(),m(),n(),p(),c(),window.addEventListener("scroll",n,{passive:!0}),window.addEventListener("resize",n),window.addEventListener("visibilitychange",n),window.addEventListener("pageshow",()=>{document.body.classList.remove("nrs-page-exiting"),document.body.classList.add("nrs-page-visible"),n()}),requestAnimationFrame(n),window.setTimeout(n,250),window.setTimeout(n,1e3)}export{u as initPageExperience};
