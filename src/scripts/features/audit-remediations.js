const FIGMA_HOSTS = new Set(["www.figma.com", "figma.com", "embed.figma.com"]);

const SERVICE_PATHS = new Set([
  "/services",
  "/product-design-nepal",
  "/web3-ux-designer",
  "/saas-ux-designer",
  "/website-ux-design",
  "/figma-design-systems",
  "/ux-audit",
]);

function getCanonicalPathname() {
  const pathname = window.location.pathname || "/";
  if (pathname === "/") return "/";
  return pathname.replace(/\/+$/, "").replace(/\.html$/, "") || "/";
}

function normalizeResponsivePageClasses() {
  const path = getCanonicalPathname();
  const isHome = path === "/";
  const isProjectDetail = /^\/project-[^/]+$/.test(path);
  const isBlogListing = path === "/blog";
  const isBlogDetail = path.startsWith("/blog/") && !isBlogListing;
  const isServicePage = SERVICE_PATHS.has(path);

  document.body.classList.toggle("nrs-home-page", isHome);
  document.body.classList.toggle("nrs-inner-page", !isHome);
  document.body.classList.toggle("nrs-project-detail-page", isProjectDetail);
  document.body.classList.toggle(
    "nrs-blog-page",
    isBlogListing || isBlogDetail,
  );
  document.body.classList.toggle("nrs-blog-detail-page", isBlogDetail);
  document.body.classList.toggle("nrs-service-page", isServicePage);
  document.body.classList.toggle("nrs-work-page", path === "/projects");
  document.body.classList.toggle("nrs-about-page", path === "/about");
  document.body.classList.toggle("nrs-contact-page", path === "/contact");
}

function ensureStylesheet(path, version) {
  // Audit and responsive rules are compiled into /style.css.
  void path;
  void version;
}

function ensureAuditStylesheet() {
  ensureStylesheet("audit-remediations.css", "1.2");
}

function ensureResponsiveStylesheet() {
  ensureStylesheet("responsive-inner-pages.css", "1.1");
}

function ensureMobileInnerPageReset() {
  ensureStylesheet("mobile-inner-page-reset.css", "1.0");
}

function ensureFinalUiFixes() {
  ensureStylesheet("final-ui-fixes.css", "1.0");
}

function ensureSkipLink() {
  const main = document.querySelector("main");
  if (!main) return;
  if (!main.id) main.id = "main-content";

  let skipLink = document.querySelector(".skip-link");
  if (!skipLink) {
    skipLink = document.createElement("a");
    skipLink.className = "skip-link";
    skipLink.textContent = "Skip to main content";
    document.body.prepend(skipLink);
  }
  skipLink.setAttribute("href", `#${main.id}`);
}

function normalizeFigmaEmbedUrl(rawUrl) {
  try {
    const current = new URL(rawUrl, window.location.href);
    if (!FIGMA_HOSTS.has(current.hostname)) return rawUrl;

    if (
      current.hostname !== "embed.figma.com" &&
      current.pathname === "/embed"
    ) {
      const nested = current.searchParams.get("url");
      if (!nested) return rawUrl;
      const target = new URL(nested);
      target.hostname = "embed.figma.com";
      target.searchParams.delete("m");
      target.searchParams.set("embed-host", "share");
      return target.toString();
    }

    if (
      current.hostname === "www.figma.com" ||
      current.hostname === "figma.com"
    )
      current.hostname = "embed.figma.com";
    current.searchParams.delete("m");
    current.searchParams.set("embed-host", "share");
    return current.toString();
  } catch {
    return rawUrl;
  }
}

function getPublicFigmaUrl(rawUrl) {
  try {
    const url = new URL(normalizeFigmaEmbedUrl(rawUrl));
    url.hostname = "www.figma.com";
    url.searchParams.delete("embed-host");
    return url.toString();
  } catch {
    return rawUrl;
  }
}

function markFigmaUnavailable(frame, fallback, message) {
  frame.hidden = true;
  frame.setAttribute("aria-hidden", "true");
  fallback.classList.add("is-active");
  const status = fallback.querySelector("[data-figma-status]");
  if (status) status.textContent = message;
}

function enhanceFigmaEmbeds() {
  const frames = [...document.querySelectorAll('iframe[src*="figma.com"]')];

  frames.forEach((frame, index) => {
    if (frame.dataset.auditEnhanced === "true") return;
    frame.dataset.auditEnhanced = "true";

    const originalSrc = frame.getAttribute("src") || "";
    const normalizedSrc = normalizeFigmaEmbedUrl(originalSrc);
    if (normalizedSrc && normalizedSrc !== originalSrc)
      frame.src = normalizedSrc;

    frame.loading = "lazy";
    frame.referrerPolicy = "strict-origin-when-cross-origin";
    frame.setAttribute(
      "title",
      frame.getAttribute("title") ||
        `Interactive Figma project preview ${index + 1}`,
    );
    frame.setAttribute("allow", "fullscreen");

    const wrapper =
      frame.closest(".embed-frame-wrapper") || frame.parentElement;
    if (!wrapper) return;
    wrapper.classList.add("figma-embed-enhanced");

    let fallback = wrapper.querySelector(".figma-embed-fallback");
    if (!fallback) {
      fallback = document.createElement("div");
      fallback.className = "figma-embed-fallback";
      fallback.innerHTML = `
        <div>
          <strong>Project prototype</strong>
          <span data-figma-status>The interactive preview is optional. Open the source directly if your browser blocks third-party embeds.</span>
        </div>
        <a class="btn btn-secondary" href="${getPublicFigmaUrl(normalizedSrc || originalSrc)}" target="_blank" rel="noopener noreferrer">Open in Figma</a>
      `;
      wrapper.appendChild(fallback);
    }

    let loaded = false;
    const timeout = window.setTimeout(() => {
      if (!loaded)
        markFigmaUnavailable(
          frame,
          fallback,
          "The embedded preview did not become available. Use the Figma link instead.",
        );
    }, 9000);

    frame.addEventListener(
      "load",
      () => {
        loaded = true;
        window.clearTimeout(timeout);
        fallback.classList.add("is-ready");
      },
      { once: true },
    );

    frame.addEventListener(
      "error",
      () => {
        window.clearTimeout(timeout);
        markFigmaUnavailable(
          frame,
          fallback,
          "The embedded preview failed to load. Use the Figma link instead.",
        );
      },
      { once: true },
    );
  });
}

function protectExternalLinks() {
  document.querySelectorAll('a[target="_blank"]').forEach((link) => {
    const rel = new Set(
      (link.getAttribute("rel") || "").split(/\s+/).filter(Boolean),
    );
    rel.add("noopener");
    rel.add("noreferrer");
    link.setAttribute("rel", [...rel].join(" "));
  });
}

function initFloatingResumeVisibility() {
  const button = document.querySelector(".floating-resume-btn");
  if (!button || button.dataset.auditVisibilityReady === "true") return;
  button.dataset.auditVisibilityReady = "true";
  button.classList.add("is-obscured");

  const path = getCanonicalPathname();
  if (path === "/contact" || path === "/privacy") return;

  const hero = document.querySelector(
    ".hero-section, .nrs-about-v2-hero, .nrs-services-hero",
  );
  const footerTarget = document.querySelector(
    "footer, .nrs-services-cta, .nrs-about-v2-cta, .nrs-contact-v2-footer-cta",
  );
  let pastHero = !hero;
  let nearFooter = false;

  const update = () =>
    button.classList.toggle("is-obscured", !pastHero || nearFooter);

  if (hero && "IntersectionObserver" in window) {
    const heroObserver = new IntersectionObserver(
      ([entry]) => {
        pastHero = !entry.isIntersecting && entry.boundingClientRect.bottom < 0;
        update();
      },
      { threshold: 0 },
    );
    heroObserver.observe(hero);
  } else {
    pastHero = true;
  }

  if (footerTarget && "IntersectionObserver" in window) {
    const footerObserver = new IntersectionObserver(
      ([entry]) => {
        nearFooter = entry.isIntersecting;
        update();
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.02 },
    );
    footerObserver.observe(footerTarget);
  }

  update();
}

function improveImageDefaults() {
  document.querySelectorAll("img").forEach((image) => {
    if (!image.hasAttribute("decoding")) image.decoding = "async";
    if (
      !image.hasAttribute("loading") &&
      !image.closest(".hero-section, .nrs-about-v2-hero, .nrs-services-hero")
    )
      image.loading = "lazy";
  });
}

function addAnchorOffsetTargets() {
  document
    .querySelectorAll("main [id]")
    .forEach((element) => element.classList.add("nrs-anchor-target"));
}

export function applyAuditRemediations() {
  normalizeResponsivePageClasses();
  ensureAuditStylesheet();
  ensureResponsiveStylesheet();
  ensureMobileInnerPageReset();
  ensureFinalUiFixes();
  ensureSkipLink();
  enhanceFigmaEmbeds();
  protectExternalLinks();
  initFloatingResumeVisibility();
  improveImageDefaults();
  addAnchorOffsetTargets();
}
