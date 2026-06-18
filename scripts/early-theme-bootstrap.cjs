const EARLY_THEME_BOOTSTRAP = `<script id="nrs-early-theme-bootstrap">
(function () {
  var storageKey = "theme";
  var root = document.documentElement;
  var theme = "dark";
  try {
    var saved = localStorage.getItem(storageKey);
    if (saved === "light" || saved === "dark") {
      theme = saved;
    } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
      theme = "light";
    }
  } catch (error) {}
  root.setAttribute("data-theme", theme);
  root.style.colorScheme = theme;

  var style = document.createElement("style");
  style.id = "nrs-first-paint-theme";
  style.textContent = [
    ":root{--nrs-first-bg:#111111;--nrs-first-text:#f2f2f2;--nrs-progress:#eeeeee;color-scheme:dark;}",
    "html[data-theme='light']{--nrs-first-bg:#ffffff;--nrs-first-text:#171717;--nrs-progress:#171717;color-scheme:light;}",
    "html,body{background:var(--nrs-first-bg)!important;background-color:var(--nrs-first-bg)!important;background-image:none!important;color:var(--nrs-first-text)!important;}",
    "body::before,body::after{background:none!important;opacity:0!important;}",
    "#nrs-scroll-progress{position:fixed;top:0;left:0;width:100%;height:4px;z-index:2147483647;pointer-events:none;background:transparent!important;opacity:1!important;transform:none!important;}",
    "#nrs-scroll-progress::before{content:'';display:block;width:100%;height:100%;background:var(--nrs-progress);transform:scaleX(var(--nrs-scroll-progress-scale,0.015));transform-origin:left center;transition:transform 80ms linear;}",
    "@media (prefers-reduced-motion: reduce){#nrs-scroll-progress::before{transition:none!important;}}"
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
    var value = Math.max(0.015, Math.min(1, window.scrollY / scrollable));
    root.style.setProperty("--nrs-scroll-progress-scale", String(value));
  }

  ensureProgressBar();
  updateProgress();
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
  window.addEventListener("pageshow", updateProgress);
})();
</script>`;

module.exports = { EARLY_THEME_BOOTSTRAP };
