const o={"/project-yarsha.html":{src:"/assets/images/project-yarsha-cover.svg",alt:"Yarsha Web3 mobile app product design case study cover"},"/project-mokshya.html":{src:"/assets/images/project-mokshya-cover.svg",alt:"Mokshya Web3 protocol website UX case study cover"},"/project-hamro-idea.html":{src:"/assets/images/project-hamro-idea-cover.svg",alt:"Hamro Idea software company website redesign case study cover"},"/project-morajaa.html":{src:"/assets/images/project-morajaa-cover.svg",alt:"Morajaa consulting website UX and lead flow case study cover"},"/project-neverwinter-parser.html":{src:"/assets/images/project-neverwinter-parser-cover.svg",alt:"Neverwinter Live Parser desktop tool case study cover"},"/project-orkest.html":{src:"/assets/images/project-orkest-cover.svg",alt:"Orkest HQ modular SaaS dashboard UX case study cover"},"/project-splashnode.html":{src:"/assets/images/project-splashnode-cover.svg",alt:"Splashnode technical website design and front-end case study cover"},"/project-zapp.html":{src:"/assets/images/project-zapp-cover.svg",alt:"Zapp Today delivery and scheduling mobile app case study cover"},"/project-masteriyo.html":{src:"/assets/images/project-masteriyo-cover.svg",alt:"Masteriyo LMS product design contribution case study cover"},"/project-pihub.html":{src:"/assets/images/project-pihub-cover.svg",alt:"piHub fintech workflow and app experience case study cover"},"/project-grid-labs.html":{src:"/assets/images/project-grid-labs-cover.svg",alt:"Grid Labs Hosting landing page and static front-end case study cover"},"/project-zakra-furniture.html":{src:"/assets/images/project-zakra-furniture-cover.svg",alt:"Zakra Furniture WordPress starter website case study cover"},"/project-designerex.html":{src:"/assets/images/project-designerex-cover.svg",alt:"Designerex luxury fashion marketplace design contribution case study cover"},"/project-sassboilerplate.html":{src:"/assets/images/project-sassboilerplate-cover.svg",alt:"sassBoilerplate front-end toolkit and developer workflow case study cover"}};function c(e){return e.endsWith("/")?e.slice(0,-1):e}function a(e){return new URL(e,window.location.origin).href}function i(e){let t=document.querySelector(".case-hero-img, .project-detail-hero img, .case-hero-img-container img"),r=document.querySelector(".case-hero-img-container, .project-detail-hero");if(!r){const s=document.querySelector("main .hero-section, main section");r=document.createElement("div"),r.className="case-hero-img-container reveal-on-scroll nrs-project-image-container",s==null||s.insertAdjacentElement("afterend",r)}t||(t=document.createElement("img"),t.className="case-hero-img",t.loading="eager",t.decoding="async",r.appendChild(t)),t.src=e.src,t.alt=e.alt,t.classList.add("nrs-project-detail-image"),t.removeAttribute("style"),r.classList.add("nrs-project-image-container")}function n(e){document.querySelectorAll('meta[property="og:image"], meta[name="twitter:image"]').forEach(r=>{r.setAttribute("content",a(e.src))});const t=document.querySelector('script[type="application/ld+json"]');if(t)try{const r=JSON.parse(t.textContent||"{}");r&&typeof r=="object"&&"image"in r&&(r.image=a(e.src),t.textContent=JSON.stringify(r,null,2))}catch{}}function l(){if(document.getElementById("nrs-project-image-styles"))return;const e=document.createElement("style");e.id="nrs-project-image-styles",e.textContent=`
    .nrs-project-image-container {
      width: min(100%, 1180px);
      margin: 0 auto clamp(72px, 9vw, 120px);
      border-radius: 30px;
      overflow: hidden;
      border: 1px solid var(--border-faint, rgba(255,255,255,.1));
      background: var(--bg-surface, #101010);
      box-shadow: 0 34px 120px rgba(0,0,0,.24);
    }

    .nrs-project-detail-image {
      display: block;
      width: 100%;
      height: auto;
      min-height: clamp(280px, 45vw, 560px);
      object-fit: cover;
      border: 0 !important;
      border-radius: 0 !important;
    }

    @media (max-width: 760px) {
      .nrs-project-image-container {
        border-radius: 20px;
        margin-bottom: 64px;
      }
    }
  `,document.head.appendChild(e)}function d(){const e=o[c(window.location.pathname)];e&&(l(),i(e),n(e))}export{d as useProjectDetailImages};
