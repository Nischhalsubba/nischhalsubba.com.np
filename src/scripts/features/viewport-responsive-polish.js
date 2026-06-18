function injectViewportResponsivePolish() {
  if (document.getElementById('nrs-viewport-responsive-polish')) return;

  const style = document.createElement('style');
  style.id = 'nrs-viewport-responsive-polish';
  style.textContent = `
    :root {
      --nrs-site-width: min(1200px, calc(100vw - 48px));
      --max-width: var(--nrs-site-width) !important;
      --nrs-blue-wash: rgba(255, 255, 255, .06);
      --nrs-blue-wash-soft: rgba(255, 255, 255, .025);
    }

    html,
    body {
      width: 100% !important;
      min-width: 100% !important;
      overflow-x: clip !important;
      background-color: var(--bg-page, #121212) !important;
      background-image: none !important;
      background-attachment: fixed !important;
    }

    body.nrs-uniform-shell::before {
      background-image: none !important;
      opacity: 0 !important;
    }

    body.nrs-uniform-shell::after {
      background: none !important;
      opacity: 0 !important;
    }

    .nrs-article-main::before,
    .case-content-body::before,
    .blog-prose::before,
    main.container::before {
      display: none !important;
      content: none !important;
      background: transparent !important;
    }

    .container,
    main.container,
    .section-container,
    .hero-section,
    .nrs-inner-page .hero-section,
    .nrs-inner-page .section-container,
    .nrs-project-detail-page .section-container,
    .nrs-blog-detail-page .section-container,
    .nrs-service-page .section-container,
    .site-footer > .container {
      width: var(--nrs-site-width) !important;
      max-width: var(--nrs-site-width) !important;
      margin-left: auto !important;
      margin-right: auto !important;
    }

    .nav-wrapper {
      position: fixed !important;
      top: 28px !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
      z-index: 1200 !important;
      width: auto !important;
      pointer-events: auto;
    }

    .nav-pill {
      gap: 4px !important;
      padding: 5px !important;
      border: 1px solid rgba(255,255,255,.12) !important;
      background: rgba(8, 10, 14, .72) !important;
      box-shadow: 0 16px 70px rgba(0,0,0,.32), inset 0 1px 0 rgba(255,255,255,.08) !important;
      backdrop-filter: blur(24px) saturate(1.2) !important;
      -webkit-backdrop-filter: blur(24px) saturate(1.2) !important;
    }

    .nav-link {
      border-radius: 999px !important;
      padding: 12px 18px !important;
      color: rgba(255,255,255,.68) !important;
      transition: color .2s ease, background .2s ease, box-shadow .2s ease !important;
    }

    .nav-link:hover,
    .nav-link.active,
    .nav-link[aria-current='page'] {
      color: #fff !important;
      background: rgba(255,255,255,.105) !important;
      box-shadow: inset 0 1px 0 rgba(255,255,255,.12), 0 0 20px rgba(255,255,255,.08) !important;
    }

    .nav-link.active::after,
    .nav-link[aria-current='page']::after {
      opacity: 1 !important;
      transform: translateX(-50%) scale(1) !important;
      background: #fff !important;
    }

    .mobile-logo,
    .mobile-nav-toggle {
      display: none !important;
    }

    .mobile-nav-overlay {
      display: none;
    }

    .mobile-nav-links a.active,
    .mobile-nav-links a[aria-current='page'] {
      color: #fff !important;
      background: rgba(255,255,255,.095) !important;
    }

    @media (max-width: 1180px) {
      :root {
        --nrs-site-width: calc(100vw - 56px);
        --max-width: var(--nrs-site-width) !important;
      }

      .nrs-inner-page .hero-title {
        font-size: clamp(2.8rem, 8.8vw, 5.8rem) !important;
      }
    }

    @media (max-width: 1024px) {
      :root {
        --nrs-site-width: calc(100vw - 44px);
        --max-width: var(--nrs-site-width) !important;
      }

      html,
      body {
        background-attachment: scroll !important;
      }

      .nav-wrapper {
        display: none !important;
      }

      .mobile-logo {
        display: inline-flex !important;
        position: fixed !important;
        top: max(18px, env(safe-area-inset-top)) !important;
        left: max(22px, env(safe-area-inset-left)) !important;
        z-index: 1302 !important;
        align-items: center;
        justify-content: center;
        min-width: 46px;
        height: 46px;
        padding: 0 14px;
        border: 1px solid rgba(255,255,255,.12);
        border-radius: 999px;
        color: #fff !important;
        background: rgba(8,10,14,.72);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        font-weight: 800;
        letter-spacing: .08em;
        text-decoration: none;
      }

      .mobile-nav-toggle {
        display: inline-flex !important;
        position: fixed !important;
        top: max(18px, env(safe-area-inset-top)) !important;
        right: max(22px, env(safe-area-inset-right)) !important;
        z-index: 1303 !important;
        width: 46px !important;
        height: 46px !important;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        gap: 5px;
        border: 1px solid rgba(255,255,255,.12) !important;
        border-radius: 999px !important;
        background: rgba(8,10,14,.72) !important;
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        box-shadow: 0 14px 46px rgba(0,0,0,.26);
      }

      .mobile-nav-toggle span {
        display: block !important;
        width: 18px !important;
        height: 2px !important;
        border-radius: 999px;
        background: #fff !important;
        transform-origin: center;
        transition: transform .24s ease, opacity .2s ease;
      }

      .menu-open .mobile-nav-toggle span:first-child {
        transform: translateY(3.5px) rotate(45deg);
      }

      .menu-open .mobile-nav-toggle span:last-child {
        transform: translateY(-3.5px) rotate(-45deg);
      }

      .mobile-nav-overlay {
        display: flex !important;
        position: fixed !important;
        inset: 0 !important;
        z-index: 1301 !important;
        min-height: 100svh;
        padding: max(94px, calc(env(safe-area-inset-top) + 94px)) 22px 32px !important;
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
        transform: translateY(-10px);
        transition: opacity .24s ease, visibility .24s ease, transform .24s ease;
        background: rgba(5,5,5,.94) !important;
        backdrop-filter: blur(22px) saturate(1.1);
        -webkit-backdrop-filter: blur(22px) saturate(1.1);
      }

      .menu-open .mobile-nav-overlay {
        opacity: 1;
        visibility: visible;
        pointer-events: auto;
        transform: translateY(0);
      }

      .menu-open {
        overflow: hidden !important;
      }

      .mobile-nav-links {
        width: min(100%, 560px);
        margin: 0 auto;
        display: grid !important;
        gap: 10px;
        align-content: start;
      }

      .mobile-nav-links a {
        display: flex !important;
        align-items: center;
        justify-content: space-between;
        min-height: 62px;
        padding: 0 18px;
        border: 1px solid rgba(255,255,255,.09);
        border-radius: 18px;
        color: rgba(255,255,255,.76) !important;
        background: rgba(255,255,255,.035);
        text-decoration: none;
        font-size: clamp(1rem, 3.2vw, 1.18rem);
        font-weight: 750;
      }

      .mobile-nav-links a::after {
        content: '→';
        opacity: .42;
      }

      .mobile-nav-links a.active,
      .mobile-nav-links a[aria-current='page'] {
        border-color: rgba(255,255,255,.18) !important;
        color: #fff !important;
        background: rgba(255,255,255,.11) !important;
      }

      .theme-toggle-btn {
        top: max(18px, env(safe-area-inset-top)) !important;
        right: max(78px, calc(env(safe-area-inset-right) + 78px)) !important;
        width: 46px !important;
        height: 46px !important;
        z-index: 1302 !important;
      }

      .hero-section,
      .nrs-home-hero,
      .nrs-inner-page .hero-section {
        padding-top: clamp(112px, 18vw, 148px) !important;
      }

      .hero-actions,
      .cta-group,
      .form-actions {
        gap: 12px !important;
      }

      .project-grid,
      .blog-grid,
      .footer-top-grid,
      .footer-nav-grid,
      .impact-summary-grid {
        grid-template-columns: 1fr !important;
      }

      .project-card:hover,
      .impact-card:hover,
      .blog-card-modern:hover,
      .journey-card:hover {
        transform: none !important;
      }
    }

    @media (max-width: 760px) {
      :root {
        --nrs-site-width: calc(100vw - 40px);
        --max-width: var(--nrs-site-width) !important;
      }

      .container,
      main.container,
      .section-container,
      .hero-section,
      .nrs-inner-page .hero-section,
      .nrs-inner-page .section-container,
      .nrs-project-detail-page .section-container,
      .nrs-blog-detail-page .section-container,
      .nrs-service-page .section-container {
        width: var(--nrs-site-width) !important;
        max-width: var(--nrs-site-width) !important;
        padding-left: 0 !important;
        padding-right: 0 !important;
      }

      .nrs-home-hero,
      .hero-section,
      .nrs-inner-page .hero-section {
        min-height: auto !important;
        padding-top: 112px !important;
        padding-bottom: 48px !important;
      }

      .hero-title,
      .nrs-inner-page .hero-title,
      .section-title {
        font-size: clamp(2.28rem, 12.4vw, 3.5rem) !important;
        line-height: 1 !important;
        letter-spacing: -.052em !important;
        max-width: 100% !important;
      }

      .body-large,
      .section-lead,
      .card-summary,
      .nrs-article p,
      .nrs-article li {
        font-size: 1rem !important;
        line-height: 1.7 !important;
      }

      .hero-actions,
      .cta-group,
      .form-actions,
      .contact-actions {
        display: grid !important;
        grid-template-columns: 1fr !important;
        width: 100% !important;
      }

      .btn,
      .hero-actions .btn,
      .cta-group .btn,
      .form-actions .btn,
      .footer-email-btn {
        width: 100% !important;
        min-width: 0 !important;
        max-width: 100% !important;
        min-height: 48px !important;
        justify-content: center !important;
        text-align: center !important;
      }

      .hero-proof-strip,
      .case-meta-chips {
        display: grid !important;
        grid-template-columns: 1fr !important;
        width: 100%;
      }

      .hero-proof-strip span,
      .badge-pill {
        width: 100%;
        justify-content: center;
        text-align: center;
      }

      .section-container,
      .nrs-inner-page .section-container,
      .nrs-project-detail-page .section-container,
      .nrs-blog-detail-page .section-container,
      .nrs-service-page .section-container {
        padding-top: 34px !important;
        padding-bottom: 34px !important;
      }

      .filter-row {
        margin-left: -20px;
        margin-right: -20px;
        padding-left: 20px;
        padding-right: 20px;
        scrollbar-width: none;
      }

      .filter-row::-webkit-scrollbar {
        display: none;
      }

      .floating-resume-btn {
        display: none !important;
      }
    }
  `;

  document.head.appendChild(style);
}

export function applyViewportResponsivePolish() {
  injectViewportResponsivePolish();
}
