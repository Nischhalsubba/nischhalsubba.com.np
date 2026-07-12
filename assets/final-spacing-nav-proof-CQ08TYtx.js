const e="nrs-final-spacing-nav-proof";function p(t){const r=t.endsWith("/")&&t.length>1?t.slice(0,-1):t,a=r.split("/").filter(Boolean).pop()||"";return!a||r==="/index.html"||r==="/home.html"||r==="/home-v2.html"?"home":r==="/projects.html"||r==="/projects"||a.startsWith("project-")?"work":r==="/about.html"||r==="/about"?"about":r==="/contact.html"||r==="/contact"?"contact":r==="/blog"||r==="/blog.html"||r.startsWith("/blog/")||a.startsWith("blog-")?"writing":new Set(["product-design-nepal.html","web3-ux-designer.html","saas-ux-designer.html","website-ux-design.html","figma-design-systems.html","ux-audit.html"]).has(a)?"work":""}function s(t){if(!t||t.startsWith("http")||t.startsWith("mailto:")||t.startsWith("tel:"))return"";try{return p(new URL(t,window.location.origin).pathname)}catch{return""}}function i(){const t=p(window.location.pathname);document.querySelectorAll(".nav-link, .mobile-nav-links a, .footer-col a").forEach(r=>{const a=s(r.getAttribute("href")),o=!!(a&&t&&a===t);r.classList.toggle("active",o),o?r.setAttribute("aria-current","page"):r.removeAttribute("aria-current")})}function n(){let t=document.getElementById(e);t||(t=document.createElement("style"),t.id=e,document.head.appendChild(t)),t.textContent=`
    :root {
      --nrs-page-max: min(1080px, calc(100vw - var(--pad-x) * 2));
      --nrs-section-pad-y: clamp(40px, 5.2vw, 72px);
      --nrs-section-pad-y-tight: clamp(28px, 4vw, 52px);
      --nrs-block-gap: clamp(22px, 3vw, 36px);
      --nrs-card-grid-gap: clamp(18px, 2.4vw, 28px);
    }

    .container,
    .nrs-about-redesign,
    .nrs-contact-redesign,
    .nrs-project-detail-page,
    .nrs-case-study,
    main:has(.case-hero-img-container) {
      max-width: var(--nrs-page-max) !important;
    }

    .section-container,
    .nrs-about-redesign .section-container,
    .nrs-contact-redesign .section-container,
    main:has(.case-hero-img-container) .section-container.reveal-on-scroll:not(#proof) {
      max-width: var(--nrs-page-max) !important;
      margin-inline: auto !important;
      padding-block: var(--nrs-section-pad-y) !important;
    }

    .section-container:first-of-type,
    .nrs-about-redesign .section-container:first-of-type,
    .nrs-contact-redesign .section-container:first-of-type {
      padding-top: 0 !important;
    }

    .hero-section + .section-container,
    .nrs-about-redesign .hero-section + .section-container,
    .nrs-contact-redesign .hero-section + .section-container {
      padding-top: var(--nrs-section-pad-y-tight) !important;
    }

    .section-header,
    .nrs-about-redesign .section-header,
    .nrs-contact-redesign .section-header,
    .nrs-case-section-head {
      display: grid !important;
      gap: 14px !important;
      max-width: 780px !important;
      margin: 0 0 var(--nrs-block-gap) !important;
    }

    .section-title,
    .section-header .section-title,
    .nrs-case-section-head .section-title {
      margin: 0 !important;
    }

    .section-lead,
    .section-header .section-lead,
    .body-large {
      margin-top: 0 !important;
    }

    .section-header + :where(.journey-grid, .case-list, .snapshot-grid, .prototype-link-list, .project-grid, .impact-summary-grid, .writing-list, .nrs-blog-proof-grid),
    .section-title + :where(.journey-grid, .case-list, .snapshot-grid, .prototype-link-list, .project-grid, .impact-summary-grid, .writing-list, .nrs-blog-proof-grid),
    .section-lead + :where(.journey-grid, .case-list, .snapshot-grid, .prototype-link-list, .project-grid, .impact-summary-grid, .writing-list, .nrs-blog-proof-grid),
    .body-large + :where(.journey-grid, .case-list, .snapshot-grid, .prototype-link-list, .project-grid, .impact-summary-grid, .writing-list, .nrs-blog-proof-grid) {
      margin-top: 0 !important;
    }

    :where(.journey-grid, .case-list, .snapshot-grid, .prototype-link-list, .project-grid, .impact-summary-grid, .writing-list, .nrs-blog-proof-grid) {
      gap: var(--nrs-card-grid-gap) !important;
    }

    .snapshot-grid,
    .nrs-about-redesign .snapshot-grid,
    main:has(.case-hero-img-container) .snapshot-grid {
      display: grid !important;
      grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
      gap: var(--nrs-card-grid-gap) !important;
      border: 0 !important;
      border-radius: 0 !important;
      background: transparent !important;
      background-image: none !important;
      box-shadow: none !important;
      overflow: visible !important;
      padding: 0 !important;
    }

    .snapshot-grid > div,
    .nrs-about-redesign .snapshot-grid > div,
    main:has(.case-hero-img-container) .snapshot-grid > div {
      border: 1px solid var(--card-border) !important;
      border-radius: var(--radius-card) !important;
      background: var(--card-bg) !important;
      padding: var(--card-padding) !important;
      border-right: 1px solid var(--card-border) !important;
      min-height: 126px !important;
      display: grid !important;
      align-content: center !important;
      gap: 10px !important;
    }

    html[data-theme='light'] .snapshot-grid > div {
      background: #fff !important;
      border-color: rgba(23, 23, 23, 0.14) !important;
    }

    .snapshot-grid h5,
    .snapshot-grid p {
      margin: 0 !important;
    }

    .case-list,
    .nrs-about-redesign .case-list,
    main:has(.case-hero-img-container) .case-list {
      margin-top: 0 !important;
      padding: 0 !important;
    }

    .case-list li {
      min-height: 106px !important;
      display: flex !important;
      align-items: flex-start !important;
      padding: var(--card-padding) !important;
      padding-left: calc(var(--card-padding) + 28px) !important;
    }

    .case-list li::before {
      left: var(--card-padding) !important;
      top: calc(var(--card-padding) + 0.72em) !important;
      transform: none !important;
      width: 7px !important;
      height: 7px !important;
      background: var(--text-tertiary) !important;
      box-shadow: none !important;
    }

    .nav-link,
    .mobile-nav-links a {
      border: 1px solid transparent !important;
      color: var(--text-secondary) !important;
    }

    .nav-link.active,
    .nav-link[aria-current='page'],
    .mobile-nav-links a.active,
    .mobile-nav-links a[aria-current='page'] {
      color: var(--text-primary) !important;
      border-color: var(--card-border-hover) !important;
      background: rgba(255, 255, 255, 0.075) !important;
      font-weight: 900 !important;
    }

    html[data-theme='light'] .nav-link.active,
    html[data-theme='light'] .nav-link[aria-current='page'],
    html[data-theme='light'] .mobile-nav-links a.active,
    html[data-theme='light'] .mobile-nav-links a[aria-current='page'] {
      background: rgba(23, 23, 23, 0.06) !important;
    }

    .nav-glider {
      display: none !important;
    }

    .nrs-proof-grid {
      display: grid !important;
      grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
      gap: var(--nrs-card-grid-gap) !important;
    }

    .nrs-proof-card {
      display: grid !important;
      gap: 12px !important;
      align-content: start !important;
      min-height: 180px !important;
      border: 1px solid var(--card-border) !important;
      border-radius: var(--radius-card) !important;
      background: var(--card-bg) !important;
      padding: var(--card-padding) !important;
      text-decoration: none !important;
    }

    .nrs-proof-card:hover {
      transform: translateY(-2px) !important;
      border-color: var(--card-border-hover) !important;
      background: var(--card-bg-hover) !important;
    }

    .nrs-proof-card h3,
    .nrs-proof-card p {
      margin: 0 !important;
    }

    .nrs-proof-card p {
      color: var(--text-secondary) !important;
      line-height: 1.65 !important;
    }

    @media (max-width: 980px) {
      .snapshot-grid,
      .nrs-about-redesign .snapshot-grid,
      .nrs-proof-grid {
        grid-template-columns: 1fr !important;
      }
    }

    @media (max-width: 850px) {
      .nav-wrapper {
        display: none !important;
      }

      .mobile-nav-toggle,
      .mobile-logo,
      .theme-toggle-btn {
        position: fixed !important;
        top: calc(env(safe-area-inset-top, 0px) + 18px) !important;
        z-index: 2147483000 !important;
      }

      .mobile-nav-toggle {
        display: inline-flex !important;
        left: calc(env(safe-area-inset-left, 0px) + 18px) !important;
        right: auto !important;
        width: 52px !important;
        height: 52px !important;
        min-width: 52px !important;
        min-height: 52px !important;
        transform: none !important;
        align-items: center !important;
        justify-content: center !important;
      }

      .mobile-logo {
        display: inline-flex !important;
        left: 50% !important;
        right: auto !important;
        transform: translateX(-50%) !important;
        width: auto !important;
        max-width: calc(100vw - 190px - env(safe-area-inset-left, 0px) - env(safe-area-inset-right, 0px)) !important;
        min-width: 0 !important;
        min-height: 52px !important;
        padding: 0 16px !important;
        align-items: center !important;
        justify-content: center !important;
        overflow: hidden !important;
        white-space: nowrap !important;
        text-overflow: ellipsis !important;
      }

      .theme-toggle-btn {
        right: calc(env(safe-area-inset-right, 0px) + 18px) !important;
        left: auto !important;
        width: 52px !important;
        height: 52px !important;
        min-width: 52px !important;
        min-height: 52px !important;
        transform: none !important;
      }

      .mobile-nav-overlay {
        padding-top: calc(env(safe-area-inset-top, 0px) + 104px) !important;
      }
    }

    @media (max-width: 720px) {
      :root {
        --nrs-section-pad-y: clamp(32px, 8vw, 50px);
        --nrs-block-gap: 24px;
      }

      .snapshot-grid > div {
        min-height: auto !important;
      }
    }

    @media (max-width: 390px) {
      .mobile-logo {
        max-width: calc(100vw - 176px - env(safe-area-inset-left, 0px) - env(safe-area-inset-right, 0px)) !important;
        padding-inline: 12px !important;
        font-size: .84rem !important;
      }
    }
  `}function m(){n(),i(),requestAnimationFrame(()=>{n(),i()}),window.setTimeout(()=>{n(),i()},250),window.setTimeout(()=>{n(),i()},1e3)}export{m as applyFinalSpacingNavProof};
