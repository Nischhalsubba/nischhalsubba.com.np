const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const targetRoot = process.argv.includes('--dist') ? path.join(root, 'dist') : root;
const stylePath = path.join(targetRoot, 'style.css');
const styleVersion = '43.0';
const scriptVersion = '33.0';

const css = `

/* nrs-mobile-header-polish-v43 */
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

@media (max-width: 390px) {
  .mobile-logo {
    max-width: calc(100vw - 176px - env(safe-area-inset-left, 0px) - env(safe-area-inset-right, 0px)) !important;
    padding-inline: 12px !important;
    font-size: .84rem !important;
  }
}
`;

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else files.push(full);
  }
  return files;
}

function updateHtmlVersions() {
  for (const file of walk(targetRoot).filter((filePath) => filePath.endsWith('.html'))) {
    const before = fs.readFileSync(file, 'utf8');
    const after = before
      .replace(/\/style\.css\?v=[0-9.]+/g, `/style.css?v=${styleVersion}`)
      .replace(/\/script\.js\?v=[0-9.]+/g, `/script.js?v=${scriptVersion}`);
    if (after !== before) fs.writeFileSync(file, after, 'utf8');
  }
}

function updateStyle() {
  if (!fs.existsSync(stylePath)) return;
  let style = fs.readFileSync(stylePath, 'utf8');
  style = style.replace(/Version:\s*[0-9.]+/i, `Version: ${styleVersion}`);
  style = style.replace(/\/\* nrs-mobile-header-polish-v\d+ \*\/[\s\S]*$/g, '');
  style += css;
  fs.writeFileSync(stylePath, style, 'utf8');
}

updateHtmlVersions();
updateStyle();

console.log('Applied mobile header polish and cache-bumped style/runtime assets.');
