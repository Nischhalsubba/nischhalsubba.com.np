/**
 * @fileoverview src/scripts/features/accessibility/audit-remediations.js
 * Purpose: Implement audit remediations behavior inside the accessibility browser-runtime domain.
 * Responsibilities:
 * - Own the accessibility behavior represented by this module and keep unrelated domains outside the file.
 * - Read or update only the DOM/runtime state needed for this feature and preserve accessibility semantics.
 * - Expose stable initializer/helper exports consumed by runtime entrypoints or closely related features.
 * Execution context: Browser ES module loaded through the portfolio runtime.
 * Connected files:
 * - src/runtime/script.js
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
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
 * Purpose: Return canonical pathname from the supplied inputs or current audit remediations browser feature state.
 * Inputs: None; derives required state from the enclosing module/runtime context.
 * Side effects: reads or updates DOM/browser state.
 * Returns: The requested canonical pathname; early-return/empty-state behavior follows the explicit branches in this function.
 */
function getCanonicalPathname() {
  const pathname = window.location.pathname || "/";
  if (pathname === "/") return "/";
  return pathname.replace(/\/+$/, "").replace(/\.html$/, "") || "/";
}

/**
 * Function contract: normalizeResponsivePageClasses
 * Purpose: Apply responsive page classes consistently while preserving the surrounding audit remediations browser feature contract.
 * Inputs: None; derives required state from the enclosing module/runtime context.
 * Side effects: reads or updates DOM/browser state.
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
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
 * Purpose: Apply stylesheet consistently while preserving the surrounding audit remediations browser feature contract.
 * Inputs: `path`: path identifying the resource being processed; `version`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
 */
function ensureStylesheet(path, version) {
  // Audit and responsive rules are compiled into /style.css.
  void path;
  void version;
}

/**
 * Function contract: ensureAuditStylesheet
 * Purpose: Apply audit stylesheet consistently while preserving the surrounding audit remediations browser feature contract.
 * Inputs: None; derives required state from the enclosing module/runtime context.
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
 */
function ensureAuditStylesheet() {
  ensureStylesheet("audit-remediations.css", "1.2");
}

/**
 * Function contract: ensureResponsiveStylesheet
 * Purpose: Apply responsive stylesheet consistently while preserving the surrounding audit remediations browser feature contract.
 * Inputs: None; derives required state from the enclosing module/runtime context.
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
 */
function ensureResponsiveStylesheet() {
  ensureStylesheet("responsive-inner-pages.css", "1.1");
}

/**
 * Function contract: ensureMobileInnerPageReset
 * Purpose: Apply mobile inner page reset consistently while preserving the surrounding audit remediations browser feature contract.
 * Inputs: None; derives required state from the enclosing module/runtime context.
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
 */
function ensureMobileInnerPageReset() {
  ensureStylesheet("mobile-inner-page-reset.css", "1.0");
}

/**
 * Function contract: ensureFinalUiFixes
 * Purpose: Apply final ui fixes consistently while preserving the surrounding audit remediations browser feature contract.
 * Inputs: None; derives required state from the enclosing module/runtime context.
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
 */
function ensureFinalUiFixes() {
  ensureStylesheet("final-ui-fixes.css", "1.0");
}

/**
 * Function contract: ensureSkipLink
 * Purpose: Apply skip link consistently while preserving the surrounding audit remediations browser feature contract.
 * Inputs: None; derives required state from the enclosing module/runtime context.
 * Side effects: reads or updates DOM/browser state.
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
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
/**
 * Function contract: normalizeFigmaEmbedUrl
 * Purpose: Apply figma embed url consistently while preserving the surrounding audit remediations browser feature contract.
 * Inputs: `rawUrl`: input consumed by this operation
 * Side effects: reads or updates DOM/browser state.
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
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
/**
 * Function contract: getPublicFigmaUrl
 * Purpose: Return public figma url from the supplied inputs or current audit remediations browser feature state.
 * Inputs: `rawUrl`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: The requested public figma url; early-return/empty-state behavior follows the explicit branches in this function.
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
/**
 * Function contract: markFigmaUnavailable
 * Purpose: Implement the mark figma unavailable responsibility owned by the audit remediations browser feature.
 * Inputs: `frame`: input consumed by this operation; `fallback`: input consumed by this operation; `message`: input consumed by this operation
 * Side effects: reads or updates DOM/browser state.
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
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
/**
 * Function contract: enhanceFigmaEmbeds
 * Purpose: Implement the enhance figma embeds responsibility owned by the audit remediations browser feature.
 * Inputs: None; derives required state from the enclosing module/runtime context.
 * Side effects: registers or removes browser event listeners; reads or updates DOM/browser state.
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
 */
function enhanceFigmaEmbeds() {
  const frames = [...document.querySelectorAll('iframe[src*="figma.com"]')];

  frames.forEach(/** Callback contract: Processes the callback step for frames without leaking orchestration details to the caller. Inputs: frame, index. Side effects: may read or update browser DOM/state. Returns a value to the invoking API. */ /** Callback contract: Apply the enclosing side-effect operation to the current collection item. Inputs: `frame`, `index`. Side effects: registers or removes browser event listeners; reads or updates DOM/browser state. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Apply the enclosing side-effect operation to the current collection item. Inputs: `frame`, `index`. Side effects: registers or removes browser listeners; reads or updates DOM/browser state. Returns: undefined; callback is side-effect-only. */ (frame, index) => {
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
    const timeout = window.setTimeout(/** Callback contract: Processes the callback step for window without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Perform the local callback step required by the enclosing audit remediations browser feature operation. Inputs: none. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Perform the local callback step required by the immediately enclosing operation. Inputs: none. Side effects: no direct external side effect beyond invoked dependencies. Returns: undefined; callback is side-effect-only. */ () => {
      if (!loaded)
        markFigmaUnavailable(
          frame,
          fallback,
          "The embedded preview did not become available. Use the Figma link instead.",
        );
    }, 9000);

    frame.addEventListener(
      "load",
      /** Callback contract: Processes the callback step for frame without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: may read or update browser DOM/state. No explicit return contract. */ /** Callback contract: Handle the load event for `frame` and apply this module's related state update. Inputs: none. Side effects: reads or updates DOM/browser state. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Handle the load event for `frame` and apply the related local state update. Inputs: none. Side effects: reads or updates DOM/browser state. Returns: undefined; callback is side-effect-only. */ () => {
        loaded = true;
        window.clearTimeout(timeout);
        fallback.classList.add("is-ready");
      },
      { once: true },
    );

    frame.addEventListener(
      "error",
      /** Callback contract: Processes the callback step for frame without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: may read or update browser DOM/state. No explicit return contract. */ /** Callback contract: Handle the error event for `frame` and apply this module's related state update. Inputs: none. Side effects: reads or updates DOM/browser state. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Handle the error event for `frame` and apply the related local state update. Inputs: none. Side effects: reads or updates DOM/browser state. Returns: undefined; callback is side-effect-only. */ () => {
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
/**
 * Function contract: protectExternalLinks
 * Purpose: Implement the protect external links responsibility owned by the audit remediations browser feature.
 * Inputs: None; derives required state from the enclosing module/runtime context.
 * Side effects: reads or updates DOM/browser state.
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
 */
function protectExternalLinks() {
  document.querySelectorAll('a[target="_blank"]').forEach(/** Callback contract: Processes the callback step for document.query selector all('a[target=" blank"]') without leaking orchestration details to the caller. Inputs: link. Side effects: may read or update browser DOM/state. No explicit return contract. */ /** Callback contract: Apply the enclosing side-effect operation to the current collection item. Inputs: `link`. Side effects: reads or updates DOM/browser state. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Apply the enclosing side-effect operation to the current collection item. Inputs: `link`. Side effects: reads or updates DOM/browser state. Returns: undefined; callback is side-effect-only. */ (link) => {
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
/**
 * Function contract: initFloatingResumeVisibility
 * Purpose: Initialize floating resume visibility for the audit remediations browser feature, including the listeners/state needed for safe runtime use.
 * Inputs: None; derives required state from the enclosing module/runtime context.
 * Side effects: reads or updates DOM/browser state.
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
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
  /**
   * Function contract: update
   * Purpose: Apply module behavior consistently while preserving the surrounding audit remediations browser feature contract.
   * Inputs: None; derives required state from the enclosing module/runtime context.
   * Side effects: reads or updates DOM/browser state.
   * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
   */
  const update = () =>
    button.classList.toggle("is-obscured", !pastHero || nearFooter);

  if (hero && "IntersectionObserver" in window) {
    const heroObserver = new IntersectionObserver(
      /** Callback contract: Processes the callback step for anonymous without leaking orchestration details to the caller. Inputs: [entry]. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Perform the local callback step required by the enclosing audit remediations browser feature operation. Inputs: `[entry]`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Perform the local callback step required by the immediately enclosing operation. Inputs: `[entry]`. Side effects: no direct external side effect beyond invoked dependencies. Returns: undefined; callback is side-effect-only. */ ([entry]) => {
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
      /** Callback contract: Processes the callback step for anonymous without leaking orchestration details to the caller. Inputs: [entry]. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Perform the local callback step required by the enclosing audit remediations browser feature operation. Inputs: `[entry]`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Perform the local callback step required by the immediately enclosing operation. Inputs: `[entry]`. Side effects: no direct external side effect beyond invoked dependencies. Returns: undefined; callback is side-effect-only. */ ([entry]) => {
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
/**
 * Function contract: improveImageDefaults
 * Purpose: Implement the improve image defaults responsibility owned by the audit remediations browser feature.
 * Inputs: None; derives required state from the enclosing module/runtime context.
 * Side effects: reads or updates DOM/browser state.
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
 */
function improveImageDefaults() {
  document.querySelectorAll("img").forEach(/** Callback contract: Processes the callback step for document.query selector all("img") without leaking orchestration details to the caller. Inputs: image. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Apply the enclosing side-effect operation to the current collection item. Inputs: `image`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Apply the enclosing side-effect operation to the current collection item. Inputs: `image`. Side effects: no direct external side effect beyond invoked dependencies. Returns: undefined; callback is side-effect-only. */ (image) => {
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
/**
 * Function contract: addAnchorOffsetTargets
 * Purpose: Implement the add anchor offset targets responsibility owned by the audit remediations browser feature.
 * Inputs: None; derives required state from the enclosing module/runtime context.
 * Side effects: reads or updates DOM/browser state.
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
 */
function addAnchorOffsetTargets() {
  document
    .querySelectorAll("main [id]")
    .forEach(/** Callback contract: Processes the callback step for document
    .query selector all("main [id]") without leaking orchestration details to the caller. Inputs: element. Side effects: may read or update browser DOM/state. No explicit return contract. */ /** Callback contract: Apply the enclosing side-effect operation to the current collection item. Inputs: `element`. Side effects: reads or updates DOM/browser state. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Apply the enclosing side-effect operation to the current collection item. Inputs: `element`. Side effects: reads or updates DOM/browser state. Returns: computed expression result consumed by the enclosing operation. */ (element) => element.classList.add("nrs-anchor-target"));
}

/**
 * Function contract: applyAuditRemediations
 * Purpose: Applies apply audit remediations while preserving the surrounding repository/runtime contract.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: no explicit value unless an invoked dependency throws/rejects.
 */
/**
 * Function contract: applyAuditRemediations
 * Purpose: Apply audit remediations consistently while preserving the surrounding audit remediations browser feature contract.
 * Inputs: None; derives required state from the enclosing module/runtime context.
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
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
