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
  'site.webmanifest',
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

function hasPortraitAsset() {
  const assetDir = path.join(distDir, 'assets');
  if (!fs.existsSync(assetDir)) return false;

  return walkFiles(assetDir, (filePath) => {
    const fileName = path.basename(filePath);
    return /^portrait[-\w]*\.(png|jpg|jpeg|webp)$/i.test(fileName);
  }).length > 0;
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

  const indexHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');
  const homepageStylesheets = stylesheetHrefs(indexHtml);
  const homepageStylesheet = homepageStylesheets[0];

  if (homepageStylesheets.length !== 1) fail(`Homepage should have exactly one stylesheet link, found ${homepageStylesheets.length}.`);
  if (homepageStylesheet && !homepageStylesheet.startsWith('/style.css')) fail(`Homepage stylesheet should be /style.css, found ${homepageStylesheet}.`);

  for (const htmlFile of walkFiles(distDir, (file) => file.endsWith('.html'))) {
    const html = fs.readFileSync(htmlFile, 'utf8');
    const rel = path.relative(distDir, htmlFile).replaceAll(path.sep, '/');
    const stylesheets = stylesheetHrefs(html);

    for (const marker of forbiddenHtmlMarkers) {
      if (html.includes(marker)) fail(`Visible SEO helper marker found in ${rel}: ${marker}`);
    }

    if (stylesheets.length !== 1) fail(`${rel} should have exactly one stylesheet link, found ${stylesheets.length}.`);
    if (homepageStylesheet && stylesheets[0] !== homepageStylesheet) fail(`${rel} stylesheet ${stylesheets[0]} does not match homepage stylesheet ${homepageStylesheet}.`);
    if (html.includes('Playfair Display') || html.includes('Playfair+Display')) fail(`${rel} contains legacy Playfair font reference`);
    if (/\bAI\b/.test(html)) fail(`${rel} contains visible AI wording`);
    if (html.includes('/seo-ui-enhancements.css')) fail(`${rel} links removed SEO UI stylesheet`);
    if (!htmlUsesAllowedRuntime(html)) fail(`${rel} is missing the website runtime script`);
    if (!html.includes('class="site-footer"')) fail(`${rel} is missing the site footer`);
    if (!html.includes('floating-resume-btn')) fail(`${rel} is missing the floating resume button`);
  }

  const homepagePositioningChecks = [
    'Product Designer',
    'Web3',
    'SaaS',
    'fintech',
    'developer-ready handoff',
  ];

  for (const phrase of homepagePositioningChecks) {
    if (!indexHtml.includes(phrase)) fail(`Homepage is missing positioning phrase: ${phrase}`);
  }

  if (indexHtml.includes('center-aligned-hero nrs-home-hero')) fail('Homepage still uses the old centered hero class combination.');
  if (indexHtml.includes('margin-left:auto;margin-right:auto')) fail('Homepage hero still contains centered inline headline margins.');
  if (indexHtml.includes('justify-content:center')) fail('Homepage hero still contains centered inline CTA alignment.');

  const homepageReferencesPortrait =
    indexHtml.includes(requestedPortraitUrl) ||
    /assets\/images\/portrait\.(png|jpg|jpeg|webp)/i.test(indexHtml) ||
    /<img[^>]+portrait[-\w]*\.(png|jpg|jpeg|webp)/i.test(indexHtml);

  const portraitIsAvailable =
    indexHtml.includes(requestedPortraitUrl) ||
    fileContains('style.css', requestedPortraitUrl) ||
    fileContains('script.js', requestedPortraitUrl) ||
    hasPortraitAsset();

  if (homepageReferencesPortrait && !portraitIsAvailable) {
    fail('Homepage references a portrait image, but no matching portrait asset was found in dist.');
  } else if (!portraitIsAvailable) {
    warn('No portrait image detected in dist. This is allowed because the clean homepage hero no longer requires it.');
  }

  const resumePath = path.join(distDir, 'assets', 'resume.pdf');
  if (fs.existsSync(resumePath) && fs.statSync(resumePath).size < 10_000) {
    fail('Generated resume PDF looks too small.');
  }
}

if (process.exitCode) {
  process.exit(process.exitCode);
}

console.log('[build-audit] Build output checks passed.');
