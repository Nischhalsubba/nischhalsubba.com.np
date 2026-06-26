const fs = require('node:fs');
const path = require('node:path');
const { EARLY_THEME_BOOTSTRAP } = require('./early-theme-bootstrap.cjs');

const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const styleHref = '/style.css?v=41.0';
const scriptSrc = '/script.js?v=32.0';

function copyDirectory(source, target) {
  if (!fs.existsSync(source)) return;

  fs.mkdirSync(target, { recursive: true });

  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    const sourcePath = path.join(source, entry.name);
    const targetPath = path.join(target, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(sourcePath, targetPath);
      continue;
    }

    fs.copyFileSync(sourcePath, targetPath);
  }
}

function copyFile(source, target) {
  if (!fs.existsSync(source)) return;
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
}

function copyRootFile(fileName) {
  copyFile(path.join(rootDir, fileName), path.join(distDir, fileName));
}

function walkFiles(directory, matcher, files = []) {
  if (!fs.existsSync(directory)) return files;

  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      walkFiles(fullPath, matcher, files);
      continue;
    }
    if (matcher(fullPath)) files.push(fullPath);
  }

  return files;
}

function stripVisibleSeoHelperBlocks(html) {
  const helperBlockClasses = [
    'nrs-static-project-context',
    'nrs-static-related-links',
    'nrs-static-faq',
  ];

  let output = html;
  for (const className of helperBlockClasses) {
    const pattern = new RegExp(`<section[^>]*\\b${className}\\b[^>]*>[\\s\\S]*?<\\/section>`, 'g');
    output = output.replace(pattern, '');
  }

  return output;
}

function stripUnusedVendorScripts(html) {
  return html
    .replace(/\s*<script\s+src="\/assets\/vendor\/gsap\.min\.js"\s+defer><\/script>/g, '')
    .replace(/\s*<script\s+src="\/assets\/vendor\/ScrollTrigger\.min\.js"\s+defer><\/script>/g, '');
}

function removeLegacyPatchAssets(html) {
  return html
    .replace(/\s*<link\s+rel="stylesheet"\s+href="\/(?!style\.css)[^"]+\.css[^"]*"\s*\/?>/g, '')
    .replace(/\s*<script\s+src="\/(?!script\.js|assets\/)[^"]+\.js[^"]*"(?:\s+defer)?><\/script>/g, '');
}

function ensureStylesheet(html) {
  if (html.includes('/style.css')) return html.replace(/\/style\.css\?v=[0-9.]+/g, styleHref);
  if (!html.includes('</head>')) return html;
  return html.replace('</head>', `    <link rel="stylesheet" href="${styleHref}" />\n  </head>`);
}

function ensureRuntimeScript(html) {
  if (html.includes('/script.js') || /<script\s+[^>]*src=["']\/assets\/[^"]+\.js["'][^>]*><\/script>/i.test(html)) return html;
  return html.replace('</body>', `  <script type="module" src="${scriptSrc}"></script>\n  </body>`);
}

function ensureEarlyThemeBootstrap(html) {
  const cleaned = html.replace(/\s*<script id="nrs-early-theme-bootstrap">[\s\S]*?<\/script>/, '');
  if (!cleaned.includes('</head>')) return html;
  return cleaned.replace('</head>', `    ${EARLY_THEME_BOOTSTRAP}\n  </head>`);
}

function optimizeHtmlOutput() {
  for (const filePath of walkFiles(distDir, (file) => file.endsWith('.html'))) {
    const original = fs.readFileSync(filePath, 'utf8');
    const optimized = ensureRuntimeScript(ensureStylesheet(ensureEarlyThemeBootstrap(removeLegacyPatchAssets(stripUnusedVendorScripts(stripVisibleSeoHelperBlocks(original))))));

    if (optimized !== original) {
      fs.writeFileSync(filePath, optimized, 'utf8');
    }
  }
}

copyDirectory(path.join(rootDir, 'assets'), path.join(distDir, 'assets'));
copyDirectory(path.join(rootDir, 'public'), distDir);
copyDirectory(path.join(rootDir, 'src', 'scripts'), path.join(distDir, 'src', 'scripts'));
copyFile(path.join(rootDir, 'script.js'), path.join(distDir, 'script.js'));
copyFile(path.join(rootDir, 'style.css'), path.join(distDir, 'style.css'));

for (const fileName of [
  'robots.txt',
  'sitemap.xml',
  'llms.txt',
  'ai-profile.json',
  'site.webmanifest',
]) {
  copyRootFile(fileName);
}

optimizeHtmlOutput();

console.log('Copied static assets, public files, source runtime modules, root stylesheet, discovery files, runtime entry, manifest, stripped legacy CSS/JS assets, preserved Vite bundles, and removed visible SEO helper blocks from dist.');
