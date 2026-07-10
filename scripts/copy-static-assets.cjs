const fs = require('node:fs');
const path = require('node:path');
const { EARLY_THEME_BOOTSTRAP } = require('./early-theme-bootstrap.cjs');

const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const styleHref = '/style.css?v=41.0';
const remediationStyleHref = '/audit-remediations.css?v=1.0';
const stableLayoutStyleHref = '/stable-layout.css?v=1.0';
const scriptSrc = '/script.js?v=33.0';

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

function copyTextFile(source, target, transform = (value) => value) {
  if (!fs.existsSync(source)) return;
  fs.mkdirSync(path.dirname(target), { recursive: true });
  const content = fs.readFileSync(source, 'utf8');
  fs.writeFileSync(target, transform(content), 'utf8');
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
    .replace(/\s*<link\s+rel="stylesheet"\s+href="\/(?!style\.css|audit-remediations\.css|stable-layout\.css)[^"]+\.css[^"]*"\s*\/?>/g, '')
    .replace(/\s*<script\s+src="\/(?!script\.js|assets\/)[^"]+\.js[^"]*"(?:\s+defer)?><\/script>/g, '');
}

function removeRemoteFontDependencies(html) {
  return html
    .replace(/\s*<link[^>]+rel=["']preconnect["'][^>]+href=["']https:\/\/fonts\.(?:googleapis|gstatic)\.com[^"']*["'][^>]*>/gi, '')
    .replace(/\s*<link[^>]+href=["']https:\/\/fonts\.googleapis\.com\/[^"']+["'][^>]*>/gi, '');
}

function ensureStylesheets(html) {
  let output = html;

  if (output.includes('/style.css')) {
    output = output.replace(/\/style\.css\?v=[0-9.]+/g, styleHref);
  } else if (output.includes('</head>')) {
    output = output.replace('</head>', `    <link rel="stylesheet" href="${styleHref}" />\n  </head>`);
  }

  if (!output.includes('/audit-remediations.css') && output.includes('</head>')) {
    output = output.replace('</head>', `    <link rel="stylesheet" href="${remediationStyleHref}" />\n  </head>`);
  }

  if (!output.includes('/stable-layout.css') && output.includes('</head>')) {
    output = output.replace('</head>', `    <link rel="stylesheet" href="${stableLayoutStyleHref}" />\n  </head>`);
  }

  return output;
}

function ensureRuntimeScript(html) {
  if (html.includes('/script.js') || /<script\s+[^>]*src=["']\/assets\/[^"']+\.js["'][^>]*><\/script>/i.test(html)) return html;
  return html.replace('</body>', `  <script type="module" src="${scriptSrc}"></script>\n  </body>`);
}

function ensureEarlyThemeBootstrap(html) {
  const cleaned = html.replace(/\s*<script id="nrs-early-theme-bootstrap">[\s\S]*?<\/script>/, '');
  if (!cleaned.includes('</head>')) return html;
  return cleaned.replace('</head>', `    ${EARLY_THEME_BOOTSTRAP}\n  </head>`);
}

function ensureSkipLinkAndMainTarget(html) {
  if (!html.includes('<body') || !html.includes('<main')) return html;

  let output = html;
  if (!/\bmain[^>]*\bid=["']main-content["']/i.test(output)) {
    output = output.replace(/<main\b([^>]*)>/i, '<main id="main-content"$1>');
  }

  if (!output.includes('class="skip-link"') && !output.includes("class='skip-link'")) {
    output = output.replace(/(<body\b[^>]*>)/i, '$1\n    <a class="skip-link" href="#main-content">Skip to main content</a>');
  }

  return output;
}

function normalizeFigmaFrames(html) {
  return html.replace(/<iframe\b([^>]*figma\.com[^>]*)>/gi, (match, attributes) => {
    let next = attributes
      .replace(/\sloading=["']eager["']/i, '')
      .replace(/\sloading=["']lazy["']/i, '');

    if (!/\stitle=["']/i.test(next)) next += ' title="Interactive Figma project preview"';
    if (!/\sreferrerpolicy=["']/i.test(next)) next += ' referrerpolicy="strict-origin-when-cross-origin"';
    return `<iframe${next} loading="lazy">`;
  });
}

function stripRemoteFontImports(css) {
  return css
    .replace(/@import\s+url\(["']?https:\/\/fonts\.googleapis\.com\/[^;]+;\s*/gi, '')
    .replace(/--font-sans:\s*Manrope,\s*/g, '--font-sans: ');
}

function optimizeHtmlOutput() {
  for (const filePath of walkFiles(distDir, (file) => file.endsWith('.html'))) {
    const original = fs.readFileSync(filePath, 'utf8');
    const optimized = ensureRuntimeScript(
      ensureStylesheets(
        ensureEarlyThemeBootstrap(
          ensureSkipLinkAndMainTarget(
            normalizeFigmaFrames(
              removeRemoteFontDependencies(
                removeLegacyPatchAssets(
                  stripUnusedVendorScripts(
                    stripVisibleSeoHelperBlocks(original),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );

    if (optimized !== original) fs.writeFileSync(filePath, optimized, 'utf8');
  }
}

copyDirectory(path.join(rootDir, 'assets'), path.join(distDir, 'assets'));
copyDirectory(path.join(rootDir, 'public'), distDir);
copyDirectory(path.join(rootDir, 'src', 'scripts'), path.join(distDir, 'src', 'scripts'));
copyFile(path.join(rootDir, 'script.js'), path.join(distDir, 'script.js'));
copyTextFile(path.join(rootDir, 'style.css'), path.join(distDir, 'style.css'), stripRemoteFontImports);

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

console.log('Copied production assets, removed remote font dependencies, normalized Figma loading, added skip links, loaded static layout rules, preserved the canonical runtime, and stripped legacy output patches.');
