/**
 * @fileoverview scripts/early-theme-bootstrap.cjs
 * Purpose: Node-based build, content transformation, QA, or maintenance tool for early theme bootstrap.
 * Responsibilities:
 * - Own the behavior/content implied by this file's single responsibility.
 * - Keep public routes, build contracts, and imported module boundaries stable unless the connected owners are updated together.
 * Execution context: Node.js CLI during local development, CI, build, or maintenance.
 * Connected files:
 * - docs/repository/file-catalog.md
 * - scripts/copy-static-assets.cjs
 * - scripts/ensure-contact-redesign.cjs
 * - scripts/ensure-seo-growth-assets.cjs
 * Maintenance: Update this header when responsibility or dependencies change; generated/vendor files are documented at their source instead.
 */
const EARLY_THEME_BOOTSTRAP = `<script id="nrs-early-theme-bootstrap">
(function () {
  var root = document.documentElement;
  var theme = "dark";
  try {
    var override = sessionStorage.getItem("nrs-theme-override");
    if (override === "light" || override === "dark") theme = override;
    else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) theme = "light";
    localStorage.removeItem("theme");
  } catch (error) {
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) theme = "light";
  }
  root.setAttribute("data-theme", theme);
  root.style.colorScheme = theme;
  root.setAttribute("data-theme-source", "system");

  var style = document.createElement("style");
  style.id = "nrs-first-paint-theme";
  style.textContent = [
    ":root{--nrs-first-bg:#0c0f0b;--nrs-first-text:#f3f6ea;--nrs-progress:#d8ff48;color-scheme:dark;}",
    "html[data-theme='light']{--nrs-first-bg:#f4efe4;--nrs-first-text:#141410;--nrs-progress:#141410;color-scheme:light;}",
    "html,body{background:var(--nrs-first-bg)!important;background-color:var(--nrs-first-bg)!important;color:var(--nrs-first-text)!important;}",
    "#nrs-scroll-progress{position:fixed!important;top:0!important;left:0!important;width:100%!important;height:4px!important;z-index:2147483647!important;pointer-events:none!important;background:transparent!important;opacity:0!important;overflow:hidden!important;transition:opacity 160ms ease!important;}",
    "html[data-nrs-scrolled='true'] #nrs-scroll-progress{opacity:1!important;}",
    "#nrs-scroll-progress::before{content:'';display:block;width:100%;height:100%;background:var(--nrs-progress)!important;transform:scaleX(var(--nrs-scroll-progress-scale,0));transform-origin:left center;transition:transform 80ms linear;}",
    "@media (prefers-reduced-motion: reduce){#nrs-scroll-progress,#nrs-scroll-progress::before{transition:none!important;}}"
  ].join("");
  document.head.appendChild(style);

  function ensureProgressBar() {
    if (document.getElementById("nrs-scroll-progress")) return;
    var bar = document.createElement("div");
    bar.id = "nrs-scroll-progress";
    bar.setAttribute("aria-hidden", "true");
    if (document.body) document.body.prepend(bar);
    else document.addEventListener("DOMContentLoaded", ensureProgressBar, { once: true });
  }

  function updateProgress() {
    var scrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    var value = Math.max(0, Math.min(1, window.scrollY / scrollable));
    root.style.setProperty("--nrs-scroll-progress-scale", String(value));
    if (window.scrollY > 4) root.setAttribute("data-nrs-scrolled", "true");
    else root.removeAttribute("data-nrs-scrolled");
  }

  ensureProgressBar();
  updateProgress();
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
  window.addEventListener("pageshow", updateProgress);
})();
</script>`;

module.exports = { EARLY_THEME_BOOTSTRAP };
