const s=[{match:/saas|dashboard|empty-state|empty-states|enterprise|metric|data-dense/i,src:"/assets/images/blog-saas-empty-states-cover.png",alt:"Generated product design cover showing SaaS dashboard empty states and product clarity artifacts"},{match:/handoff|figma|design-system|design-systems|front-end|developer/i,src:"/assets/images/blog-design-systems-handoff-cover.png",alt:"Generated product design cover showing design system components, handoff notes, and interface states"},{match:/web3|wallet|crypto|transaction|governance/i,src:"/assets/images/blog-web3-wallet-ux-cover.png",alt:"Generated product design cover showing Web3 wallet review, permissions, and trust-focused interface states"},{match:/audit|accessibility|research|redesign|emerging/i,src:"/assets/images/blog-ux-audit-research-cover.png",alt:"Generated product design cover showing UX audit boards, research notes, and prioritization artifacts"},{match:/service|website|pricing|plans|software-companies|business/i,src:"/assets/images/blog-service-pricing-ux-cover.png",alt:"Generated product design cover showing service website structure, pricing panels, and conversion paths"}],l=s[1];function g(){const t=window.location.pathname;return t.startsWith("/blog/")&&t!=="/blog/"&&!t.endsWith("/blog/index.html")}function d(){var a;const t=document.title||"",n=((a=document.querySelector("h1"))==null?void 0:a.textContent)||"",r=`${window.location.pathname} ${t} ${n}`;return s.find(c=>c.match.test(r))||l}function i(t){return new URL(t,window.location.origin).href}function o(t,n){let e=document.head.querySelector(t);e||(e=document.createElement("meta"),document.head.appendChild(e)),Object.entries(n).forEach(([r,a])=>e.setAttribute(r,a))}function p(t){const n=document.querySelector("article");if(!n)return;let e=n.querySelector('img[src*="blog-"][src$=".png"], img[src*="blog-"][src$=".svg"], img[src*="unsplash"]');if(!e){const r=document.createElement("figure");r.className="nrs-blog-cover",e=document.createElement("img"),e.className="nrs-blog-cover-img",e.width=1600,e.height=900,e.loading="eager",e.decoding="async",r.appendChild(e);const a=n.querySelector(".body-large, h1 + p, header + section");(a==null?void 0:a.tagName)==="SECTION"?a.prepend(r):a==null||a.insertAdjacentElement("afterend",r)}e.src=t.src,e.alt=t.alt,e.classList.add("nrs-blog-cover-img"),e.width=e.width||1600,e.height=e.height||900,e.loading="eager",e.decoding="async"}function m(){if(document.getElementById("nrs-blog-visuals-style"))return;const t=document.createElement("style");t.id="nrs-blog-visuals-style",t.textContent=`
    .nrs-blog-detail-page {
      --nrs-readable-width: 760px;
      --nrs-article-wide: min(1040px, 100%);
    }

    .nrs-blog-detail-page .nrs-blog-cover {
      width: var(--nrs-article-wide);
      margin: clamp(32px, 5vw, 58px) 0 clamp(42px, 6vw, 72px);
    }

    .nrs-blog-detail-page .nrs-blog-cover-img,
    .nrs-blog-detail-page article img[src*="blog-"] {
      display: block;
      width: 100% !important;
      aspect-ratio: 16 / 9;
      height: auto !important;
      max-height: none !important;
      object-fit: cover;
      border: 1px solid var(--border-faint) !important;
      border-radius: clamp(18px, 2.4vw, 28px) !important;
      background: var(--bg-surface) !important;
      box-shadow: 0 28px 86px rgba(0, 0, 0, .24) !important;
    }

    .nrs-blog-detail-page article.section-container > h1,
    .nrs-blog-detail-page article.section-container > .hero-title,
    .nrs-blog-detail-page .nrs-article-header h1 {
      max-width: 980px !important;
      letter-spacing: 0 !important;
      text-wrap: balance;
    }

    .nrs-blog-detail-page article.section-container > p,
    .nrs-blog-detail-page article.section-container li,
    .nrs-blog-detail-page .blog-prose p,
    .nrs-blog-detail-page .blog-prose li {
      max-width: var(--nrs-readable-width) !important;
      font-size: clamp(1rem, 1.05vw, 1.125rem) !important;
      line-height: 1.78 !important;
      letter-spacing: 0 !important;
    }

    .nrs-blog-detail-page article.section-container > h2,
    .nrs-blog-detail-page .blog-prose h2,
    .nrs-blog-detail-page .body-large h3 {
      max-width: var(--nrs-readable-width) !important;
      margin-top: clamp(44px, 6vw, 76px) !important;
      letter-spacing: 0 !important;
      text-wrap: balance;
    }

    .nrs-blog-detail-page blockquote {
      max-width: var(--nrs-readable-width) !important;
      margin-block: clamp(34px, 5vw, 58px) !important;
      padding-left: clamp(20px, 2.5vw, 30px) !important;
      border-left: 2px solid var(--text-primary) !important;
      color: var(--text-primary) !important;
    }

    @media (max-width: 760px) {
      .nrs-blog-detail-page .nrs-blog-cover {
        margin-top: 28px;
      }
    }
  `,document.head.appendChild(t)}function h(){if(!g())return;const t=d();m(),p(t),o('meta[property="og:image"]',{property:"og:image",content:i(t.src)}),o('meta[name="twitter:image"]',{name:"twitter:image",content:i(t.src)})}export{h as ensureBlogGeneratedVisuals};
