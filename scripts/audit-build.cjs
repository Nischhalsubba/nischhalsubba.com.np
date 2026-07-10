const fs = require('node:fs');
const path = require('node:path');

const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

const requiredFiles = [
  'index.html',
  'projects.html',
  'services.html',
  'about.html',
  'contact.html',
  'blog/index.html',
  'style.css',
  'audit-remediations.css',
  'script.js',
  'assets/resume.pdf',
  'robots.txt',
  'sitemap.xml',
  'site.webmanifest',
  '_headers',
  '_redirects',
];

const forbiddenHtmlMarkers = [
  'nrs-static-project-context',
  'nrs-static-related-links',
  'nrs-static-faq',
];

const forbiddenPublicAssets = [
  'seo-ui-enhancements.css',
  'site-design-system.css',
  'contact-redesign.css',
  'services-redesign.css',
  'services-process-redesign.css',
  'style-1.css',
  'assets/styles/main.css',
  'blog-index.js',
  'site-experience.js',
  'portfolio-improvements.js',
];

function fail(message) {
  console.error(`[build-audit] ${message}`);
  process.exitCode = 1;
}

function warn(message) {
  console.warn(`[build-audit] ${message}`);
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

function fileContains(relativePath, value) {
  const filePath = path.join(distDir, relativePath);
  return fs.existsSync(filePath) && fs.readFileSync(filePath, 'utf8').includes(value);
}

function stylesheetHrefs(html) {
  return Array.from(html.matchAll(/<link\s+[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*>/gi)).map((match) => match[1]);
}

function canonicalHref(html) {
  return html.match(/<link\s+[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i)?.[1] || '';
}

function htmlUsesAllowedRuntime(html) {
  return html.includes('/script.js') || /<script\s+[^>]*src=["']\/assets\/[^"']+\.js["'][^>]*><\/script>/i.test(html);
}

function hasLocalPortraitAsset() {
  const assetDir = path.join(distDir, 'assets', 'images');
  if (!fs.existsSync(assetDir)) return false;
  return walkFiles(assetDir, (filePath) => /^portrait[-\w]*\.(png|jpg|jpeg|webp|avif|svg)$/i.test(path.basename(filePath))).length > 0;
}

if (!fs.existsSync(distDir)) {
  fail('dist directory does not exist. Run the build before auditing.');
} else {
  for (const relativePath of requiredFiles) {
    if (!fs.existsSync(path.join(distDir, relativePath))) fail(`Missing required build output: ${relativePath}`);
  }

  for (const relativePath of forbiddenPublicAssets) {
    if (fs.existsSync(path.join(distDir, relativePath))) fail(`Removed frontend asset still exists in dist: ${relativePath}`);
  }

  const indexPath = path.join(distDir, 'index.html');
  const indexHtml = fs.existsSync(indexPath) ? fs.readFileSync(indexPath, 'utf8') : '';
  const homepageStylesheets = stylesheetHrefs(indexHtml);

  if (!homepageStylesheets.some((href) => href.startsWith('/style.css'))) fail('Homepage is missing /style.css.');

  for (const htmlFile of walkFiles(distDir, (file) => file.endsWith('.html'))) {
    const html = fs.readFileSync(htmlFile, 'utf8');
    const rel = path.relative(distDir, htmlFile).replaceAll(path.sep, '/');
    const stylesheets = stylesheetHrefs(html);

    for (const marker of forbiddenHtmlMarkers) {
      if (html.includes(marker)) fail(`Visible SEO helper marker found in ${rel}: ${marker}`);
    }

    if (!stylesheets.some((href) => href.startsWith('/style.css'))) fail(`${rel} is missing /style.css.`);
    if (html.includes('Playfair Display') || html.includes('Playfair+Display')) fail(`${rel} contains legacy Playfair font reference.`);
    if (html.includes('https://i.imgur.com/oFHdPUS.png')) fail(`${rel} still depends on the external Imgur portrait.`);
    if (!htmlUsesAllowedRuntime(html)) fail(`${rel} is missing the website runtime script.`);
    if (!html.includes('class="site-footer"') && !html.includes('class="floating-resume-btn"')) warn(`${rel} has neither an authored footer nor the floating resume control.`);

    const canonical = canonicalHref(html);
    if (canonical && canonical.endsWith('.html')) fail(`${rel} uses a .html canonical URL: ${canonical}`);

    const eagerFigmaFrame = /<iframe[^>]+figma\.com[^>]+loading=["']eager["']/i.test(html);
    if (eagerFigmaFrame) fail(`${rel} eagerly loads a Figma embed.`);
  }

  const positioningChecks = ['Product Designer', 'Web3', 'SaaS', 'fintech', 'developer-ready handoff'];
  for (const phrase of positioningChecks) {
    if (!indexHtml.includes(phrase)) fail(`Homepage is missing positioning phrase: ${phrase}`);
  }

  if (!hasLocalPortraitAsset()) warn('No local portrait asset was detected. Pages must not fall back to a third-party portrait URL.');
  if (fileContains('style.css', 'fonts.googleapis.com')) fail('style.css still imports Google Fonts.');

  const resumePath = path.join(distDir, 'assets', 'resume.pdf');
  if (fs.existsSync(resumePath) && fs.statSync(resumePath).size < 10_000) fail('Generated resume PDF looks too small.');
}

if (process.exitCode) process.exit(process.exitCode);
console.log('[build-audit] Build output checks passed.');
