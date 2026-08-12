function r(){return window.location.pathname.split("/").filter(Boolean).pop()||"index.html"}function e(){const t=window.location.pathname,a=r();document.body.classList.toggle("nrs-contact-page",a==="contact.html"),document.body.classList.toggle("nrs-about-page",a==="about.html"),document.body.classList.toggle("nrs-work-page",a==="projects.html"),document.body.classList.toggle("nrs-project-detail-page",/^\/project-[^/]+\.html$/.test(t)),document.body.classList.toggle("nrs-blog-detail-page",t.startsWith("/blog/")&&t!=="/blog/")}function i(){if(document.getElementById("nrs-site-consistency-styles"))return;const t=document.createElement("style");t.id="nrs-site-consistency-styles",t.textContent=`
    :root {
      --max-width: min(1200px, calc(100vw - 48px)) !important;
      --nrs-site-width: min(1200px, calc(100vw - 48px));
      --nrs-readable-width: 780px;
      --nrs-card-pad: clamp(28px, 3.2vw, 42px);
      --nrs-card-gap: clamp(14px, 2vw, 22px);
      --nrs-section-gap: clamp(28px, 4vw, 48px);
      --nrs-divider: rgba(238, 232, 220, 0.12);
      --font-serif: 'Instrument Serif', 'Playfair Display', Georgia, serif;
      --font-sans: 'Manrope', Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      --bg-page: #050607;
      --bg-surface: rgba(238, 232, 220, 0.065);
      --bg-surface-2: rgba(238, 232, 220, 0.095);
      --bg-pill: rgba(238, 232, 220, 0.08);
      --bg-nav: rgba(7, 9, 12, 0.82);
      --text-primary: #f7f1e7;
      --text-secondary: #d8d1c4;
      --text-tertiary: #9fa8b3;
      --text-soft: #7b8491;
      --accent-blue: #e8e8e8;
      --accent-cyan: #d6d6d6;
      --accent-gold: #c8c8c8;
      --accent-glow: rgba(232, 232, 232, 0.12);
      --border-faint: rgba(238, 232, 220, 0.13);
      --border-strong: rgba(143, 180, 255, 0.30);
      --radius-md: 14px;
      --radius-lg: 20px;
      --radius-xl: 28px;
      --radius-2xl: 34px;
      --shadow-card: 0 28px 76px rgba(0, 0, 0, 0.34);
      --shadow-soft: 0 18px 48px rgba(0, 0, 0, 0.24);
    }

    [data-theme='light'] {
      --nrs-divider: rgba(20, 28, 40, 0.12);
      --bg-page: #f7f3ea;
      --bg-surface: #fffdf7;
      --bg-surface-2: #eee7da;
      --bg-pill: #f1eadf;
      --bg-nav: rgba(255, 253, 247, 0.90);
      --text-primary: #121820;
      --text-secondary: #314055;
      --text-tertiary: #627085;
      --text-soft: #7d8795;
      --accent-blue: #171717;
      --accent-cyan: #2f2f2f;
      --accent-gold: #555555;
      --accent-glow: rgba(23, 23, 23, 0.10);
      --border-faint: rgba(20, 28, 40, 0.13);
      --border-strong: rgba(29, 78, 216, 0.28);
      color-scheme: light;
    }

    html { text-rendering: optimizeLegibility; }

    body {
      color: var(--text-primary) !important;
      font-family: var(--font-sans) !important;
      font-feature-settings: 'kern' 1, 'liga' 1, 'calt' 1;
      background: var(--bg-page) !important;
      background-image: none !important;
    }

    [data-theme='light'] body {
      background: var(--bg-page) !important;
      background-image: none !important;
      color: var(--text-primary) !important;
    }

    body::before {
      opacity: 0 !important;
      background-image: none !important;
    }

    body::after {
      background: none !important;
      opacity: 0 !important;
    }

    [data-theme='light'] body::before,
    [data-theme='light'] body::after,
    [data-theme='light'] #grid-canvas {
      display: none !important;
      opacity: 0 !important;
      visibility: hidden !important;
    }

    h1, h2, .hero-title, .section-title,
    .w-title, .card-content h3, .footer-cta h2,
    .nrs-related-pages h2,
    .nrs-blog-detail-page article.section-container > h1,
    .nrs-blog-detail-page article.section-container > .hero-title {
      color: var(--text-primary) !important;
      font-family: var(--font-serif) !important;
      font-weight: 400 !important;
      letter-spacing: 0!important;
    }

    h3, h4, h5, h6,
    .journey-card h3,
    .clarity-row-list h3,
    .clarity-steps h3,
    .snapshot-grid p,
    .nav-link,
    .btn,
    .filter-btn,
    .badge-pill,
    .link-pill {
      font-family: var(--font-sans) !important;
    }

    h3, .journey-card h3, .clarity-row-list h3, .clarity-steps h3 {
      font-weight: 760 !important;
      letter-spacing: 0!important;
    }

    p, li, .body-large, .section-lead, .card-summary, .w-summary, label {
      color: var(--text-secondary) !important;
      font-weight: 500;
    }

    .eyebrow, .meta-text, .w-date, .card-meta-line, .case-label, .nrs-card-kicker,
    .clarity-snapshot dt,
    .nrs-project-detail-page .eyebrow,
    .nrs-project-detail-page .case-label {
      color: var(--text-tertiary) !important;
      font-family: var(--font-sans) !important;
      font-size: .72rem !important;
      font-weight: 800 !important;
      letter-spacing: 0!important;
      text-transform: uppercase !important;
    }

    .nav-pill {
      padding: 6px !important;
      border: 1px solid var(--border-faint) !important;
      background: color-mix(in srgb, var(--bg-nav) 88%, transparent) !important;
      box-shadow: 0 18px 54px rgba(0, 0, 0, .30) !important;
      backdrop-filter: blur(22px) saturate(1.08) !important;
      -webkit-backdrop-filter: blur(22px) saturate(1.08) !important;
    }

    .nav-link {
      min-height: 38px !important;
      padding: 0 17px !important;
      color: var(--text-secondary) !important;
      font-size: .78rem !important;
      font-weight: 800 !important;
      letter-spacing: 0!important;
    }

    .nav-link:hover,
    .nav-link:focus-visible,
    .nav-link.active,
    .nav-link[aria-current='page'],
    .mobile-nav-links a.active,
    .mobile-nav-links a[aria-current='page'] {
      color: var(--text-primary) !important;
      background: rgba(238, 232, 220, .105) !important;
      box-shadow: inset 0 0 0 1px rgba(238, 232, 220, .07) !important;
    }

    [data-theme='light'] .nav-pill,
    [data-theme='light'] .theme-toggle-btn,
    [data-theme='light'] .mobile-logo,
    [data-theme='light'] .mobile-nav-toggle {
      background: rgba(255, 253, 247, .88) !important;
      border-color: rgba(20, 28, 40, .12) !important;
      box-shadow: 0 16px 44px rgba(20, 28, 40, .11) !important;
    }

    [data-theme='light'] .nav-link:hover,
    [data-theme='light'] .nav-link:focus-visible,
    [data-theme='light'] .nav-link.active,
    [data-theme='light'] .nav-link[aria-current='page'] {
      color: #121820 !important;
      background: rgba(29, 78, 216, .105) !important;
      box-shadow: inset 0 0 0 1px rgba(29, 78, 216, .08) !important;
    }

    .theme-toggle-btn,
    .mobile-logo,
    .mobile-nav-toggle {
      border-color: var(--border-faint) !important;
      background: var(--bg-nav) !important;
      color: var(--text-primary) !important;
      box-shadow: 0 16px 46px rgba(0,0,0,.28) !important;
    }

    .btn, .btn-primary, .btn-secondary, .footer-email-btn, .floating-resume-btn,
    .badge-pill, .link-pill, .filter-btn {
      min-height: 46px !important;
      border-radius: 999px !important;
      font-size: .86rem !important;
      font-weight: 820 !important;
      letter-spacing: 0!important;
    }

    .btn-primary, .footer-email-btn, .floating-resume-btn {
      border: 1px solid rgba(238,232,220,.28) !important;
      background: #f2f2f2 !important;
      color: #111820 !important;
      box-shadow: 0 18px 46px rgba(0,0,0,.24), 0 0 0 1px rgba(255,255,255,.03) !important;
    }

    .btn-secondary, .badge-pill, .link-pill, .filter-btn {
      border: 1px solid var(--border-faint) !important;
      background: rgba(238,232,220,.058) !important;
      color: var(--text-primary) !important;
      box-shadow: none !important;
    }

    .btn:hover, .footer-email-btn:hover, .floating-resume-btn:hover,
    .project-card:hover, .writing-item:hover, .journey-card:hover {
      transform: translateY(-3px) !important;
    }

    [data-theme='light'] .btn-primary,
    [data-theme='light'] .footer-email-btn,
    [data-theme='light'] .floating-resume-btn {
      background: #171717 !important;
      color: #fffdf7 !important;
      border-color: rgba(23,23,23,.30) !important;
      box-shadow: 0 18px 42px rgba(23, 23, 23, .12) !important;
    }

    [data-theme='light'] .btn-secondary,
    [data-theme='light'] .badge-pill,
    [data-theme='light'] .link-pill,
    [data-theme='light'] .filter-btn {
      background: rgba(255, 253, 247, .78) !important;
      color: #121820 !important;
      border-color: rgba(20,28,40,.14) !important;
      box-shadow: none !important;
    }

    .impact-card, .project-card, .writing-item, .journey-card,
    .comparison-card, .metric-plan-card, .story-card, .quote-card,
    .contact-form, .blog-note, .blog-toc, .blog-author-card, .blog-share-card,
    .nrs-uxcel-proof, .prototype-link-card, .embed-frame-wrapper,
    .nrs-case-proof, .snapshot-grid, .case-list li,
    .nrs-blog-proof-grid article,
    .clarity-row-list article,
    .clarity-steps article {
      border: 1px solid var(--border-faint) !important;
      background:
        linear-gradient(145deg, rgba(238,232,220,.082), rgba(238,232,220,.032)) !important;
      box-shadow: 0 22px 68px rgba(0,0,0,.28) !important;
    }

    .project-card, .journey-card, .writing-item,
    .impact-card, .nrs-blog-proof-grid article,
    .clarity-row-list article, .clarity-steps article {
      transition: transform 220ms cubic-bezier(.2,.8,.2,1), border-color 220ms ease, background 220ms ease, box-shadow 220ms ease !important;
    }

    .project-card:hover, .journey-card:hover, .writing-item:hover,
    .impact-card:hover, .nrs-blog-proof-grid article:hover,
    .clarity-row-list article:hover, .clarity-steps article:hover {
      border-color: rgba(143, 180, 255, .34) !important;
      background:
        linear-gradient(145deg, rgba(255,255,255,.08), rgba(238,232,220,.038)) !important;
      box-shadow: 0 26px 76px rgba(0,0,0,.34) !important;
    }

    [data-theme='light'] .impact-card,
    [data-theme='light'] .project-card,
    [data-theme='light'] .writing-item,
    [data-theme='light'] .journey-card,
    [data-theme='light'] .comparison-card,
    [data-theme='light'] .metric-plan-card,
    [data-theme='light'] .story-card,
    [data-theme='light'] .quote-card,
    [data-theme='light'] .contact-form,
    [data-theme='light'] .blog-note,
    [data-theme='light'] .blog-toc,
    [data-theme='light'] .blog-author-card,
    [data-theme='light'] .blog-share-card,
    [data-theme='light'] .nrs-uxcel-proof,
    [data-theme='light'] .prototype-link-card,
    [data-theme='light'] .embed-frame-wrapper,
    [data-theme='light'] .nrs-case-proof,
    [data-theme='light'] .snapshot-grid,
    [data-theme='light'] .case-list li,
    [data-theme='light'] .nrs-blog-proof-grid article,
    [data-theme='light'] .clarity-row-list article,
    [data-theme='light'] .clarity-steps article {
      background: rgba(255, 253, 247, .84) !important;
      border-color: rgba(20,28,40,.12) !important;
      box-shadow: 0 18px 46px rgba(20,28,40,.06) !important;
    }

    [data-theme='light'] .project-card:hover,
    [data-theme='light'] .journey-card:hover,
    [data-theme='light'] .writing-item:hover,
    [data-theme='light'] .impact-card:hover,
    [data-theme='light'] .nrs-blog-proof-grid article:hover,
    [data-theme='light'] .clarity-row-list article:hover,
    [data-theme='light'] .clarity-steps article:hover {
      border-color: rgba(23,23,23,.24) !important;
      background: #fffdf7 !important;
      box-shadow: 0 22px 54px rgba(23,23,23,.08) !important;
    }

    .hero-proof-strip span, .tag, .pill, .nrs-blog-tags b,
    .journey-card::before, .clarity-row-list article > span, .clarity-steps article > span {
      border-color: rgba(232,232,232,.28) !important;
      background: rgba(232,232,232,.08) !important;
      color: var(--accent-blue) !important;
      font-family: var(--font-sans) !important;
      font-weight: 820 !important;
    }

    [data-theme='light'] .hero-proof-strip span,
    [data-theme='light'] .tag,
    [data-theme='light'] .pill,
    [data-theme='light'] .nrs-blog-tags b,
    [data-theme='light'] .journey-card::before,
    [data-theme='light'] .clarity-row-list article > span,
    [data-theme='light'] .clarity-steps article > span {
      border-color: rgba(23,23,23,.18) !important;
      background: rgba(23,23,23,.055) !important;
      color: #171717 !important;
    }

    .search-input, input, select, textarea {
      border-color: var(--border-faint) !important;
      background: rgba(238,232,220,.06) !important;
      color: var(--text-primary) !important;
      box-shadow: inset 0 1px 0 rgba(255,255,255,.025) !important;
    }

    input:focus, select:focus, textarea:focus, .search-input:focus {
      outline: 3px solid color-mix(in srgb, var(--accent-blue) 24%, transparent) !important;
      border-color: var(--border-strong) !important;
      background: rgba(238,232,220,.085) !important;
    }

    [data-theme='light'] .search-input,
    [data-theme='light'] input,
    [data-theme='light'] select,
    [data-theme='light'] textarea {
      background: rgba(255,253,247,.88) !important;
      color: #121820 !important;
      border-color: rgba(20,28,40,.14) !important;
    }

    .w-arrow {
      border-color: var(--border-faint) !important;
      background: rgba(232,232,232,.06) !important;
    }

    .w-arrow::before { border-color: var(--accent-blue) !important; }
    .w-arrow::after { background: var(--accent-blue) !important; }

    .site-footer {
      background: rgba(0,0,0,.10) !important;
      border-top-color: var(--border-faint) !important;
    }

    [data-theme='light'] .site-footer {
      background: #f1eadf !important;
      border-top-color: rgba(20,28,40,.10) !important;
    }

    .nrs-cursor-dot {
      background: var(--accent-blue) !important;
      box-shadow: 0 0 18px var(--accent-glow) !important;
    }

    .nrs-cursor-ring {
      border-color: color-mix(in srgb, var(--accent-blue) 54%, transparent) !important;
      box-shadow: 0 0 30px var(--accent-glow) !important;
    }

    .container,
    main.container,
    .nrs-uniform-shell .container,
    .nrs-uniform-shell main.container,
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

    .nrs-inner-page main.container {
      padding-top: clamp(104px, 9vw, 144px) !important;
    }

    .nrs-inner-page .body-large,
    .nrs-inner-page .section-lead,
    .nrs-article p,
    .nrs-article li {
      max-width: var(--nrs-readable-width) !important;
    }

    .clarity-section {
      display: grid !important;
      grid-template-columns: minmax(120px, 190px) minmax(0, 1fr);
      gap: clamp(24px, 5vw, 76px);
      align-items: start;
      border-top: 1px solid var(--nrs-divider) !important;
    }

    .clarity-section-label {
      position: sticky;
      top: 112px;
    }

    .clarity-section-body {
      display: grid;
      gap: clamp(20px, 3vw, 34px);
      min-width: 0;
    }

    .clarity-row-list,
    .clarity-steps {
      display: grid;
      gap: clamp(18px, 2.6vw, 28px) !important;
      border-top: 0 !important;
    }

    .clarity-steps { grid-template-columns: repeat(3, minmax(0, 1fr)); }

    .clarity-row-list article,
    .clarity-row-list article.nrs-article.blog-prose,
    .clarity-steps article,
    .nrs-article.blog-prose {
      display: grid !important;
      grid-template-columns: 1fr !important;
      align-content: start !important;
      gap: var(--nrs-card-gap) !important;
      width: 100%;
      min-width: 0;
      padding: var(--nrs-card-pad) !important;
      border-radius: var(--radius-xl) !important;
      overflow: hidden !important;
    }

    .clarity-row-list article > span,
    .clarity-steps article > span {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: max-content;
      min-width: 34px;
      min-height: 28px;
      margin: 0 0 4px;
      padding: 6px 10px;
      border-radius: 999px;
      font-size: .72rem;
      letter-spacing: 0;
      text-transform: uppercase;
    }

    .clarity-row-list article > div,
    .clarity-steps article > div {
      display: grid;
      gap: 8px;
      min-width: 0;
    }

    .clarity-pill-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0;
      border-top: 1px solid var(--nrs-divider);
    }

    .clarity-pill-grid span {
      display: flex;
      align-items: center;
      min-height: 84px;
      padding: clamp(18px, 2.4vw, 26px);
      border-bottom: 1px solid var(--nrs-divider);
      border-right: 1px solid var(--nrs-divider);
    }

    .clarity-pill-grid span:nth-child(2n) { border-right: 0; }

    .nrs-contact-page .contact-form {
      max-width: 860px !important;
      margin-top: 0;
    }

    .nrs-contact-page .form-note { display: none; }

    .nrs-blog-detail-page main.container {
      width: min(980px, calc(100vw - 48px)) !important;
      max-width: min(980px, calc(100vw - 48px)) !important;
      padding-top: clamp(112px, 10vw, 152px) !important;
    }

    .nrs-blog-detail-page article.section-container,
    .nrs-blog-detail-page .nrs-article-frame,
    .nrs-blog-detail-page .nrs-article.blog-prose,
    .nrs-blog-detail-page .blog-prose,
    .nrs-blog-detail-page .blog-note,
    .nrs-blog-detail-page .blog-toc,
    .nrs-blog-detail-page .blog-author-card,
    .nrs-blog-detail-page .blog-share-card {
      width: 100% !important;
      max-width: 100% !important;
      margin-left: auto !important;
      margin-right: auto !important;
      padding-left: 0 !important;
      padding-right: 0 !important;
      background: transparent !important;
      border: 0 !important;
      border-radius: 0 !important;
      box-shadow: none !important;
      overflow: visible !important;
    }

    .nrs-blog-detail-page article.section-container {
      display: block !important;
      padding-top: clamp(24px, 4vw, 44px) !important;
      padding-bottom: clamp(72px, 9vw, 118px) !important;
    }

    .nrs-blog-detail-page article.section-container > .badge-pill:first-child,
    .nrs-blog-detail-page .nrs-article-frame > .badge-pill:first-child {
      display: inline-flex !important;
      min-height: 0 !important;
      width: auto !important;
      margin: 0 0 clamp(28px, 4vw, 48px) !important;
      padding: 0 !important;
      border: 0 !important;
      border-radius: 0 !important;
      background: transparent !important;
      box-shadow: none !important;
      color: var(--text-tertiary) !important;
      font-size: .72rem !important;
      font-weight: 850 !important;
      letter-spacing: 0!important;
      text-transform: uppercase !important;
    }

    .nrs-blog-detail-page article.section-container > .hero-title,
    .nrs-blog-detail-page article.section-container > h1,
    .nrs-blog-detail-page .nrs-article-frame > .hero-title,
    .nrs-blog-detail-page .nrs-article-frame > h1 {
      max-width: 920px !important;
      margin: 0 0 clamp(24px, 4vw, 42px) !important;
      font-size: clamp(3.2rem, 7vw, 6.2rem) !important;
      line-height: .96 !important;
      letter-spacing: 0!important;
    }

    .nrs-blog-detail-page article.section-container > .body-large,
    .nrs-blog-detail-page article.section-container > p,
    .nrs-blog-detail-page article.section-container > h2,
    .nrs-blog-detail-page article.section-container > ul,
    .nrs-blog-detail-page article.section-container > ol,
    .nrs-blog-detail-page article.section-container > blockquote {
      max-width: var(--nrs-readable-width) !important;
    }

    .nrs-blog-detail-page article.section-container > p,
    .nrs-blog-detail-page article.section-container > li {
      font-size: clamp(1rem, 1.25vw, 1.12rem) !important;
      line-height: 1.82 !important;
    }

    .nrs-blog-detail-page article.section-container > h2 {
      margin-top: clamp(42px, 6vw, 72px) !important;
      margin-bottom: clamp(14px, 2vw, 22px) !important;
      font-size: clamp(1.7rem, 3.2vw, 2.7rem) !important;
      line-height: 1.12 !important;
    }

    .nrs-blog-detail-page .writing-list {
      max-width: var(--nrs-readable-width) !important;
      margin-top: clamp(20px, 3vw, 34px) !important;
    }

    .nrs-blog-detail-page .writing-item {
      border-radius: 0 !important;
      border-left: 0 !important;
      border-right: 0 !important;
      background: transparent !important;
      box-shadow: none !important;
      padding-left: 0 !important;
      padding-right: 0 !important;
    }

    .nrs-project-detail-page .hero-section {
      display: grid !important;
      grid-template-columns: minmax(0, 1fr);
      gap: 22px;
      border-bottom: 1px solid var(--nrs-divider) !important;
    }

    .nrs-project-detail-page .hero-section::after { display: none !important; }

    .nrs-project-detail-page .badge-pill,
    .nrs-project-detail-page .case-label {
      border: 0 !important;
      border-radius: 0 !important;
      background: transparent !important;
      padding: 0 !important;
    }

    .nrs-project-detail-page .section-container {
      display: grid !important;
      grid-template-columns: minmax(130px, 220px) minmax(0, 1fr);
      column-gap: clamp(28px, 6vw, 86px);
      row-gap: var(--nrs-section-gap) !important;
      align-items: start;
      padding-top: clamp(58px, 7vw, 96px) !important;
      padding-bottom: clamp(58px, 7vw, 96px) !important;
      border-top: 1px solid var(--nrs-divider) !important;
    }

    .nrs-project-detail-page .section-container > .case-label,
    .nrs-project-detail-page .section-container > .eyebrow,
    .nrs-project-detail-page .section-container > .section-header > .eyebrow {
      grid-column: 1;
      grid-row: 1;
      position: sticky;
      top: 110px;
      align-self: start;
    }

    .nrs-project-detail-page .section-container > h2,
    .nrs-project-detail-page .section-container > .section-title,
    .nrs-project-detail-page .section-container > p,
    .nrs-project-detail-page .section-container > .body-large,
    .nrs-project-detail-page .section-container > ul,
    .nrs-project-detail-page .section-container > .case-list,
    .nrs-project-detail-page .section-container > .journey-grid,
    .nrs-project-detail-page .section-container > .snapshot-grid,
    .nrs-project-detail-page .section-container > .prototype-link-list,
    .nrs-project-detail-page .section-container > .embed-frame-wrapper,
    .nrs-project-detail-page .section-container > .section-header,
    .nrs-project-detail-page .section-container > div:not(.case-label) {
      grid-column: 2;
    }

    .nrs-project-detail-page .section-container > .section-header { margin-bottom: 0 !important; }

    .nrs-project-detail-page .section-container > .section-header + .journey-grid,
    .nrs-project-detail-page .section-container > h2 + .journey-grid,
    .nrs-project-detail-page .section-container > .section-title + .journey-grid {
      margin-top: clamp(20px, 3vw, 36px) !important;
    }

    .nrs-project-detail-page .section-container > .section-header .section-title,
    .nrs-project-detail-page .section-container > h2.section-title,
    .nrs-project-detail-page .section-container > h2 {
      font-size: clamp(2rem, 4vw, 3.4rem) !important;
      line-height: 1.02 !important;
      letter-spacing: 0!important;
      margin-bottom: 0 !important;
    }

    .nrs-project-detail-page .snapshot-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
      gap: 0 !important;
    }

    .nrs-project-detail-page .journey-grid {
      display: grid !important;
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
      gap: clamp(22px, 3vw, 34px) !important;
      align-items: stretch !important;
      padding-top: clamp(10px, 1.8vw, 24px) !important;
      margin-top: 0 !important;
      min-width: 0 !important;
      counter-reset: focus-card;
    }

    .nrs-project-detail-page .journey-card,
    .nrs-project-detail-page .prototype-link-card {
      display: grid !important;
      grid-template-columns: 1fr !important;
      align-content: start !important;
      gap: var(--nrs-card-gap) !important;
      min-width: 0 !important;
      min-height: clamp(230px, 22vw, 280px) !important;
      padding: var(--nrs-card-pad) !important;
      border-radius: var(--radius-xl) !important;
      overflow: hidden !important;
    }

    .nrs-project-detail-page .journey-card::before {
      position: static !important;
      margin: 0 0 clamp(8px, 1vw, 12px) 0 !important;
      align-self: start !important;
      justify-self: start !important;
    }

    .nrs-project-detail-page .journey-card h3,
    .nrs-project-detail-page .prototype-link-card h3 {
      margin: 0 !important;
      max-width: 100% !important;
      overflow-wrap: anywhere;
      line-height: 1.16 !important;
    }

    .nrs-project-detail-page .journey-card p,
    .nrs-project-detail-page .prototype-link-card p {
      margin: 0 !important;
      max-width: 66ch !important;
      line-height: 1.68 !important;
    }

    .nrs-project-detail-page iframe {
      width: 100% !important;
      min-height: min(620px, 72vh);
      border-radius: 18px;
    }

    @media (max-width: 920px) {
      :root {
        --max-width: calc(100vw - 40px) !important;
        --nrs-site-width: calc(100vw - 40px);
      }

      .clarity-snapshot,
      .clarity-steps,
      .clarity-pill-grid,
      .nrs-contact-page .form-grid,
      .nrs-project-detail-page .section-container,
      .nrs-project-detail-page .snapshot-grid,
      .nrs-project-detail-page .journey-grid,
      .nrs-project-detail-page .journey-card,
      .nrs-project-detail-page .prototype-link-card {
        grid-template-columns: 1fr !important;
      }

      .clarity-section { grid-template-columns: 1fr !important; gap: 16px; }

      .clarity-section-label,
      .nrs-project-detail-page .section-container > .case-label,
      .nrs-project-detail-page .section-container > .eyebrow,
      .nrs-project-detail-page .section-container > .section-header > .eyebrow {
        position: static !important;
      }

      .clarity-snapshot div,
      .clarity-pill-grid span,
      .clarity-steps article { border-right: 0; }

      .nrs-project-detail-page .section-container > .case-label,
      .nrs-project-detail-page .section-container > .eyebrow,
      .nrs-project-detail-page .section-container > .section-header > .eyebrow,
      .nrs-project-detail-page .section-container > h2,
      .nrs-project-detail-page .section-container > .section-title,
      .nrs-project-detail-page .section-container > p,
      .nrs-project-detail-page .section-container > .body-large,
      .nrs-project-detail-page .section-container > ul,
      .nrs-project-detail-page .section-container > .case-list,
      .nrs-project-detail-page .section-container > .journey-grid,
      .nrs-project-detail-page .section-container > .snapshot-grid,
      .nrs-project-detail-page .section-container > .prototype-link-list,
      .nrs-project-detail-page .section-container > .embed-frame-wrapper,
      .nrs-project-detail-page .section-container > .section-header,
      .nrs-project-detail-page .section-container > div:not(.case-label) {
        grid-column: 1 !important;
      }
    }

    @media (max-width: 760px) {
      :root {
        --max-width: calc(100vw - 40px) !important;
        --nrs-site-width: calc(100vw - 40px);
      }

      .nrs-clarity-page .hero-title,
      .nrs-inner-page .hero-title {
        font-size: clamp(2.2rem, 12vw, 3.35rem) !important;
      }

      .nrs-inner-page main.container { padding-top: 94px !important; }

      .clarity-row-list article,
      .clarity-row-list article.nrs-article.blog-prose,
      .nrs-article.blog-prose,
      .nrs-project-detail-page .journey-card,
      .nrs-project-detail-page .prototype-link-card {
        grid-template-columns: 1fr !important;
        gap: 12px !important;
        padding: clamp(22px, 6vw, 30px) !important;
        min-height: auto !important;
      }

      .nrs-blog-detail-page main.container {
        width: calc(100vw - 40px) !important;
        max-width: calc(100vw - 40px) !important;
        padding-top: 96px !important;
      }

      .nrs-blog-detail-page article.section-container > .hero-title,
      .nrs-blog-detail-page article.section-container > h1,
      .nrs-blog-detail-page .nrs-article-frame > .hero-title,
      .nrs-blog-detail-page .nrs-article-frame > h1 {
        font-size: clamp(2.45rem, 12vw, 3.6rem) !important;
      }

      .nrs-project-detail-page .journey-grid { padding-top: clamp(12px, 4vw, 24px) !important; }

      .clarity-actions,
      .hero-actions,
      .form-actions {
        display: grid !important;
        grid-template-columns: 1fr !important;
        width: 100% !important;
      }

      .clarity-actions .btn,
      .hero-actions .btn,
      .form-actions .btn { width: 100% !important; }

      .nrs-project-detail-page iframe { min-height: 420px; }
    }
  `,document.head.appendChild(t)}function o(){e(),i()}export{o as polishSiteConsistency};
