/*
 * Nischhal Portfolio Global UI
 * Handles theme, mobile navigation, search/filter, light page transitions,
 * share actions, contact mailto behavior, and optional canvas grid.
 *
 * Detail page previous/next navigation lives in /public/detail-navigation.js.
 * SEO/schema/FAQ/performance enhancements live in /public/seo-enhancements.js.
 */

(() => {
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;

  // --- 0. THEME HANDLING ---
  const themeBtn = document.getElementById("theme-toggle");
  const htmlEl = document.documentElement;

  // Images
  const DARK_IMG = "https://i.imgur.com/ixsEpYM.png";
  const LIGHT_IMG = "https://i.imgur.com/oFHdPUS.png";

  const sunIcon = `<svg viewBox="0 0 24 24"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 00-1.41 0 .996.996 0 000 1.41l1.29 1.29c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L5.99 4.58zm12.37 12.37a.996.996 0 00-1.41 0 .996.996 0 000 1.41l1.29 1.29c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41l-1.29-1.29zm1.41-13.78c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41l1.29 1.29c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41l-1.29-1.29zM7.28 17.28c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41l1.29 1.29c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41l-1.29-1.29z"/></svg>`;
  const moonIcon = `<svg viewBox="0 0 24 24"><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-3.03 0-5.5-2.47-5.5-5.5 0-1.82.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/></svg>`;

  function updateImages(theme) {
    const targetSrc = theme === "light" ? LIGHT_IMG : DARK_IMG;

    const heroImg = document.querySelector(".hero-portrait-img");
    if (heroImg) heroImg.src = targetSrc;

    const footerImg = document.querySelector(".footer-portrait-img");
    if (footerImg) footerImg.src = targetSrc;

    const aboutImg = document.querySelector(".profile-img");
    if (aboutImg) aboutImg.src = targetSrc;
  }

  function setTheme(theme) {
    htmlEl.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    if (themeBtn) {
      themeBtn.innerHTML = theme === "light" ? moonIcon : sunIcon;
      themeBtn.setAttribute(
        "aria-label",
        theme === "light" ? "Switch to dark theme" : "Switch to light theme",
      );
    }
    updateImages(theme);
  }

  // Initialize Theme
  const savedTheme = localStorage.getItem("theme");
  const systemPrefersLight = window.matchMedia(
    "(prefers-color-scheme: light)",
  ).matches;

  if (savedTheme) {
    setTheme(savedTheme);
  } else if (systemPrefersLight) {
    setTheme("light");
  } else {
    setTheme("dark");
  }

  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const currentTheme = htmlEl.getAttribute("data-theme") || "dark";
      const newTheme = currentTheme === "light" ? "dark" : "light";
      setTheme(newTheme);
    });
  }

  function initMobileMenu() {
    const button = document.querySelector(".mobile-nav-toggle");
    if (!button) return;

    const overlay = document.querySelector(".mobile-nav-overlay");
    if (overlay && !overlay.id) overlay.id = "mobile-nav-overlay";
    if (overlay) button.setAttribute("aria-controls", overlay.id);
    button.setAttribute("aria-expanded", "false");

    button.addEventListener("click", () => {
      const open = document.body.classList.toggle("menu-open");
      button.setAttribute("aria-expanded", String(open));
    });

    document.querySelectorAll(".mobile-nav-links a").forEach((link) => {
      link.addEventListener("click", () => {
        document.body.classList.remove("menu-open");
        button.setAttribute("aria-expanded", "false");
      });
    });
  }

  function initGridCanvas() {
    const canvas = document.getElementById("grid-canvas");
    if (!canvas || reducedMotion || isTouch || window.innerWidth < 900) return;

    const ctx = canvas.getContext("2d");
    let width = 0;
    let height = 0;
    let mouse = { x: -1000, y: -1000 };

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);
      const light =
        document.documentElement.getAttribute("data-theme") === "light";
      const grid = 60;

      ctx.strokeStyle = light ? "rgba(0,0,0,.045)" : "rgba(255,255,255,.045)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x <= width; x += grid) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y <= height; y += grid) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      const gradient = ctx.createRadialGradient(
        mouse.x,
        mouse.y,
        0,
        mouse.x,
        mouse.y,
        320,
      );
      gradient.addColorStop(
        0,
        light ? "rgba(12,140,233,.12)" : "rgba(59,130,246,.14)",
      );
      gradient.addColorStop(1, "rgba(59,130,246,0)");
      ctx.strokeStyle = gradient;
      ctx.beginPath();
      for (let x = 0; x <= width; x += grid) {
        ctx.moveTo(x, Math.max(0, mouse.y - 320));
        ctx.lineTo(x, Math.min(height, mouse.y + 320));
      }
      for (let y = 0; y <= height; y += grid) {
        ctx.moveTo(Math.max(0, mouse.x - 320), y);
        ctx.lineTo(Math.min(width, mouse.x + 320), y);
      }
      ctx.stroke();

      requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener(
      "mousemove",
      (event) => {
        mouse = { x: event.clientX, y: event.clientY };
      },
      { passive: true },
    );
    draw();
  }

  function initActiveNavigation() {
    const path = window.location.pathname;
    document
      .querySelectorAll(".nav-link, .mobile-nav-links a")
      .forEach((link) => {
        const href = new URL(link.getAttribute("href"), window.location.origin)
          .pathname;
        const active =
          (path === "/" && href === "/") ||
          (path.startsWith("/project-") && href.includes("projects")) ||
          (path.includes("/blog") && href.includes("blog")) ||
          path === href;
        link.classList.toggle("active", active);
      });
  }

  function initFilters() {
    const searchWork = document.getElementById("search-work");
    const searchBlog = document.getElementById("search-blog");
    const filterButtons = document.querySelectorAll(
      ".filter-btn, .blog-filter-btn",
    );

    function apply(scope = document) {
      const activeFilter =
        document.querySelector(".filter-btn.active, .blog-filter-btn.active")
          ?.dataset.filter || "all";
      const query = (searchWork?.value || searchBlog?.value || "")
        .toLowerCase()
        .trim();

      scope.querySelectorAll(".project-card, .writing-item").forEach((item) => {
        const tags = (item.dataset.category || "").toLowerCase();
        const text = item.textContent.toLowerCase();
        const matchesFilter =
          activeFilter === "all" || tags.includes(activeFilter);
        const matchesQuery = !query || text.includes(query);
        item.style.display = matchesFilter && matchesQuery ? "" : "none";
      });
    }

    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const group = button.classList.contains("blog-filter-btn")
          ? ".blog-filter-btn"
          : ".filter-btn";
        document
          .querySelectorAll(group)
          .forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");
        apply();
      });
    });

    [searchWork, searchBlog]
      .filter(Boolean)
      .forEach((input) => input.addEventListener("input", () => apply()));
    document.getElementById("clear-work")?.addEventListener("click", () => {
      if (searchWork) {
        searchWork.value = "";
        apply();
        searchWork.focus();
      }
    });
  }

  function initResumeDownload() {
    document
      .querySelectorAll('a[href$="resume.pdf"], .floating-resume-btn')
      .forEach((link) => {
        link.setAttribute("href", "/assets/resume.pdf");
        link.setAttribute("download", "Nischhal-Raj-Subba-Resume.pdf");
      });
  }

  function initShareButtons() {
    document.querySelectorAll("[data-share]").forEach((button) => {
      button.addEventListener("click", async (event) => {
        event.preventDefault();
        const platform = button.dataset.share;
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent(
          document.querySelector("h1")?.innerText || document.title,
        );

        if (platform === "copy" && navigator.clipboard) {
          await navigator.clipboard.writeText(window.location.href);
          button.classList.add("copied");
          setTimeout(() => button.classList.remove("copied"), 1600);
          return;
        }

        if (platform === "native" && navigator.share) {
          await navigator
            .share({ title: document.title, url: window.location.href })
            .catch(() => {});
          return;
        }

        const targets = {
          x: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
          linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
        };

        if (targets[platform])
          window.open(targets[platform], "_blank", "noopener,noreferrer");
      });
    });
  }

  function initContactForm() {
    const form = document.getElementById("contact-form");
    if (!form) return;

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const button = form.querySelector('button[type="submit"], button');
      const name = form.querySelector('[name="name"]')?.value || "";
      const email = form.querySelector('[name="email"]')?.value || "";
      const message = form.querySelector('[name="message"]')?.value || "";
      const subject = encodeURIComponent(
        `Portfolio inquiry from ${name || "website visitor"}`,
      );
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\nProject brief:\n${message}`,
      );
      if (button) button.textContent = "Opening email...";
      window.location.href = `mailto:hinischalsubba@gmail.com?subject=${subject}&body=${body}`;
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    injectGlobalStyles();
    initTheme();
    initMobileMenu();
    initGridCanvas();
    initActiveNavigation();
    initFilters();
    initPageTransition();
    initResumeDownload();
    initShareButtons();
    initContactForm();
  });
})();
