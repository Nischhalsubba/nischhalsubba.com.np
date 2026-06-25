const fs = require('node:fs');
const path = require('node:path');

const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const requestedPortraitUrl = 'https://i.imgur.com/oFHdPUS.png';

/**
 * Files that must exist in the final Cloudflare Pages output.
 *
 * The public website contract is intentionally simple:
 * - one frontend stylesheet: /style.css
 * - one frontend runtime entry: /script.js or Vite's generated /assets/*.js
 * - build/package scripts remain separate tooling and are not public runtime files
 */
const requiredFiles = [
  'index.html',
  'home-v2.html',
  'projects.html',
  'blog/index.html',
  'contact.html',
  'style.css',
  'script.js',
  'assets/resume.pdf',
  'robots.txt',
  'sitemap.xml',
  'llms.txt',
  'ai-profile.json',
  'site.webmanifest',
];

/**
 * Build-time SEO helper sections should not be visible in rendered pages.
 * The JSON-LD/schema can stay, but the helper UI blocks must be stripped.
 */
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

function hasPortraitAsset() {
  const assetDir = path.join(distDir, 'assets');
  if (!fs.existsSync(assetDir)) return false;
  return fs.readdirSync(assetDir).some((fileName) => /^portrait[-\w]*\.(png|jpg|jpeg|webp)$/i.test(fileName));
}

function htmlUsesAllowedRuntime(html) {
  return html.includes('/script.js') || /<script\s+[^>]*src=["']\/assets\/[^"]+\.js["'][^>]*><\/script>/i.test(html);
}

if (!fs.existsSync(distDir)) {
  fail('dist directory does not exist. Run the build before auditing.');
} else {
  for (const relativePath of requiredFiles) {
    const filePath = path.join(distDir, relativePath);
    if (!fs.existsSync(filePath)) fail(`Missing required build output: ${relativePath}`);
  }

  for (const relativePath of forbiddenPublicAssets) {
    const filePath = path.join(distDir, relativePath);
    if (fs.existsSync(filePath)) fail(`Removed frontend asset still exists in dist: ${relativePath}`);
  }

  for (const htmlFile of walkFiles(distDir, (file) => file.endsWith('.html'))) {
    const html = fs.readFileSync(htmlFile, 'utf8');
    const rel = path.relative(distDir, htmlFile).replaceAll(path.sep, '/');

    for (const marker of forbiddenHtmlMarkers) {
      if (html.includes(marker)) fail(`Visible SEO helper marker found in ${rel}: ${marker}`);
    }

    if (html.includes('Playfair Display') || html.includes('Playfair+Display')) fail(`${rel} contains legacy Playfair font reference`);
    if (html.includes('/seo-ui-enhancements.css')) fail(`${rel} links removed SEO UI stylesheet`);
    if (!html.includes('/style.css')) fail(`${rel} is missing the single stylesheet /style.css`);
    if (!htmlUsesAllowedRuntime(html)) fail(`${rel} is missing the website runtime script`);
  }

  const indexHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');
  const homepagePositioningChecks = [
    'Product Designer',
    'Web3',
    'SaaS',
    'fintech',
    'developer-ready handoff',
    'llms.txt',
    'ai-profile.json',
  ];

  for (const phrase of homepagePositioningChecks) {
    if (!indexHtml.includes(phrase)) fail(`Homepage is missing positioning phrase: ${phrase}`);
  }

  if (indexHtml.includes('center-aligned-hero nrs-home-hero')) fail('Homepage still uses the old centered hero class combination.');
  if (indexHtml.includes('margin-left:auto;margin-right:auto')) fail('Homepage hero still contains centered inline headline margins.');
  if (indexHtml.includes('justify-content:center')) fail('Homepage hero still contains centered inline CTA alignment.');

  const portraitIsAvailable =
    indexHtml.includes(requestedPortraitUrl) ||
    fileContains('style.css', requestedPortraitUrl) ||
    fileContains('script.js', requestedPortraitUrl) ||
    hasPortraitAsset();

  if (!portraitIsAvailable) fail('Build is missing the requested portrait image or local portrait asset.');

  const resumePath = path.join(distDir, 'assets', 'resume.pdf');
  if (fs.existsSync(resumePath) && fs.statSync(resumePath).size < 10_000) {
    fail('Generated resume PDF looks too small.');
  }
}

if (process.exitCode) {
  process.exit(process.exitCode);
}

console.log('[build-audit] Build output checks passed.');
