/**
 * @fileoverview src/scripts/features/accessibility/audit-remediations.js
 * Purpose: Browser runtime feature in the accessibility domain responsible for audit remediations behavior.
 * Responsibilities:
 * - Own the behavior/content implied by this file's single responsibility.
 * - Keep public routes, build contracts, and imported module boundaries stable unless the connected owners are updated together.
 * Execution context: Browser ES module loaded by the portfolio runtime.
 * Connected files:
 * - docs/repository/file-catalog.md
 * - src/scripts/entrypoints/main.js
 * - src/runtime/script.js
 * Maintenance: Update this header when responsibility or dependencies change; generated/vendor files are documented at their source instead.
 */
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

/**
 * Function contract: getCanonicalPathname
 * Purpose: Retrieves get canonical pathname and returns it in the form expected by its caller.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may read or update browser DOM/state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function getCanonicalPathname() {
  const pathname = window.location.pathname || "/";
  if (pathname === "/") return "/";
  return pathname.replace(/\/+$/, "").replace(/\.html$/, "") || "/";
}

/**
 * Function contract: normalizeResponsivePageClasses
 * Purpose: Applies normalize responsive page classes while preserving the surrounding repository/runtime contract.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may read or update browser DOM/state.
 * Returns: no explicit value unless an invoked dependency throws/rejects.
 */
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

/**
 * Function contract: ensureStylesheet
 * Purpose: Applies ensure stylesheet while preserving the surrounding repository/runtime contract.
 * Inputs: path, version.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: no explicit value unless an invoked dependency throws/rejects.
 */
function ensureStylesheet(path, version) {
  // Audit and responsive rules are compiled into /style.css.
  void path;
  void version;
}

/**
 * Function contract: ensureAuditStylesheet
 * Purpose: Applies ensure audit stylesheet while preserving the surrounding repository/runtime contract.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: no explicit value unless an invoked dependency throws/rejects.
 */
function ensureAuditStylesheet() {
  ensureStylesheet("audit-remediations.css", "1.2");
}

/**
 * Function contract: ensureResponsiveStylesheet
 * Purpose: Applies ensure responsive stylesheet while preserving the surrounding repository/runtime contract.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: no explicit value unless an invoked dependency throws/rejects.
 */
function ensureResponsiveStylesheet() {
  ensureStylesheet("responsive-inner-pages.css", "1.1");
}

/**
 * Function contract: ensureMobileInnerPageReset
 * Purpose: Applies ensure mobile inner page reset while preserving the surrounding repository/runtime contract.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: no explicit value unless an invoked dependency throws/rejects.
 */
function ensureMobileInnerPageReset() {
  ensureStylesheet("mobile-inner-page-reset.css", "1.0");
}

/**
 * Function contract: ensureFinalUiFixes
 * Purpose: Applies ensure final ui fixes while preserving the surrounding repository/runtime contract.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: no explicit value unless an invoked dependency throws/rejects.
 */
function ensureFinalUiFixes() {
  ensureStylesheet("final-ui-fixes.css", "1.0");
}

/**
 * Function contract: ensureSkipLink
 * Purpose: Applies ensure skip link while preserving the surrounding repository/runtime contract.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may read or update browser DOM/state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
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

/**
 * Function contract: normalizeFigmaEmbedUrl
 * Purpose: Applies normalize figma embed url while preserving the surrounding repository/runtime contract.
 * Inputs: rawUrl.
 * Side effects: may read or update browser DOM/state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
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

/**
 * Function contract: getPublicFigmaUrl
 * Purpose: Retrieves get public figma url and returns it in the form expected by its caller.
 * Inputs: rawUrl.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
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

/**
 * Function contract: markFigmaUnavailable
 * Purpose: Implements the mark figma unavailable responsibility for this module.
 * Inputs: frame, fallback, message.
 * Side effects: may read or update browser DOM/state.
 * Returns: no explicit value unless an invoked dependency throws/rejects.
 */
function markFigmaUnavailable(frame, fallback, message) {
  frame.hidden = true;
  frame.setAttribute("aria-hidden", "true");
  fallback.classList.add("is-active");
  const status = fallback.querySelector("[data-figma-status]");
  if (status) status.textContent = message;
}

/**
 * Function contract: enhanceFigmaEmbeds
 * Purpose: Implements the enhance figma embeds responsibility for this module.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may read or update browser DOM/state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function enhanceFigmaEmbeds() {
  const frames = [...document.querySelectorAll('iframe[src*="figma.com"]')];

  frames.forEach(/** Callback contract: Processes the callback step for frames without leaking orchestration details to the caller. Inputs: frame, index. Side effects: may read or update browser DOM/state. Returns a value to the invoking API. */ (frame, index) => {
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
    const timeout = window.setTimeout(/** Callback contract: Processes the callback step for window without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ () => {
      if (!loaded)
        markFigmaUnavailable(
          frame,
          fallback,
          "The embedded preview did not become available. Use the Figma link instead.",
        );
    }, 9000);

    frame.addEventListener(
      "load",
      /** Callback contract: Processes the callback step for frame without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: may read or update browser DOM/state. No explicit return contract. */ () => {
        loaded = true;
        window.clearTimeout(timeout);
        fallback.classList.add("is-ready");
      },
      { once: true },
    );

    frame.addEventListener(
      "error",
      /** Callback contract: Processes the callback step for frame without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: may read or update browser DOM/state. No explicit return contract. */ () => {
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

/**
 * Function contract: protectExternalLinks
 * Purpose: Implements the protect external links responsibility for this module.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may read or update browser DOM/state.
 * Returns: no explicit value unless an invoked dependency throws/rejects.
 */
function protectExternalLinks() {
  document.querySelectorAll('a[target="_blank"]').forEach(/** Callback contract: Processes the callback step for document.query selector all('a[target=" blank"]') without leaking orchestration details to the caller. Inputs: link. Side effects: may read or update browser DOM/state. No explicit return contract. */ (link) => {
    const rel = new Set(
      (link.getAttribute("rel") || "").split(/\s+/).filter(Boolean),
    );
    rel.add("noopener");
    rel.add("noreferrer");
    link.setAttribute("rel", [...rel].join(" "));
  });
}

/**
 * Function contract: initFloatingResumeVisibility
 * Purpose: Implements the init floating resume visibility responsibility for this module.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may read or update browser DOM/state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
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

  /**
   * Function contract: update
   * Purpose: Applies update while preserving the surrounding repository/runtime contract.
   * Inputs: none; the function derives state from its enclosing module/runtime context.
   * Side effects: may read or update browser DOM/state.
   * Returns: no explicit value unless an invoked dependency throws/rejects.
   */
  const update = () =>
    button.classList.toggle("is-obscured", !pastHero || nearFooter);

  if (hero && "IntersectionObserver" in window) {
    const heroObserver = new IntersectionObserver(
      /** Callback contract: Processes the callback step for anonymous without leaking orchestration details to the caller. Inputs: [entry]. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ ([entry]) => {
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
      /** Callback contract: Processes the callback step for anonymous without leaking orchestration details to the caller. Inputs: [entry]. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ ([entry]) => {
        nearFooter = entry.isIntersecting;
        update();
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.02 },
    );
    footerObserver.observe(footerTarget);
  }

  update();
}

/**
 * Function contract: improveImageDefaults
 * Purpose: Implements the improve image defaults responsibility for this module.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may read or update browser DOM/state.
 * Returns: no explicit value unless an invoked dependency throws/rejects.
 */
function improveImageDefaults() {
  document.querySelectorAll("img").forEach(/** Callback contract: Processes the callback step for document.query selector all("img") without leaking orchestration details to the caller. Inputs: image. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (image) => {
    if (!image.hasAttribute("decoding")) image.decoding = "async";
    if (
      !image.hasAttribute("loading") &&
      !image.closest(".hero-section, .nrs-about-v2-hero, .nrs-services-hero")
    )
      image.loading = "lazy";
  });
}

/**
 * Function contract: addAnchorOffsetTargets
 * Purpose: Implements the add anchor offset targets responsibility for this module.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may read or update browser DOM/state.
 * Returns: no explicit value unless an invoked dependency throws/rejects.
 */
function addAnchorOffsetTargets() {
  document
    .querySelectorAll("main [id]")
    .forEach(/** Callback contract: Processes the callback step for document
    .query selector all("main [id]") without leaking orchestration details to the caller. Inputs: element. Side effects: may read or update browser DOM/state. No explicit return contract. */ (element) => element.classList.add("nrs-anchor-target"));
}

/**
 * Function contract: applyAuditRemediations
 * Purpose: Applies apply audit remediations while preserving the surrounding repository/runtime contract.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: no explicit value unless an invoked dependency throws/rejects.
 */
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
