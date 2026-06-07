const fs = require('node:fs');
const path = require('node:path');

const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const requestedPortraitUrl = 'https://i.imgur.com/oFHdPUS.png';

/**
 * Files that must exist in the final Cloudflare Pages output.
 *
 * This list protects the site from silent regressions where Vite builds but
 * important static files, runtime modules, resume assets, or AI/search discovery
 * files are missing from dist. Silent success is how websites become haunted.
 */
const requiredFiles = [
  'index.html',
  'home-v2.html',
  'projects.html',
  'blog/index.html',
  'script.js',
  'src/scripts/features/theme.js',
  'src/scripts/features/portfolio-upgrades.js',
  'assets/resume.pdf',
  'robots.txt',
  'sitemap.xml',
  'llms.txt',
  'ai-profile.json',
  'seo-ui-enhancements.css',
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

if (!fs.existsSync(distDir)) {
  fail('dist directory does not exist. Run the build before auditing.');
} else {
  // Required output contract for deployment.
  for (const relativePath of requiredFiles) {
    const filePath = path.join(distDir, relativePath);
    if (!fs.existsSync(filePath)) fail(`Missing required build output: ${relativePath}`);
  }

  // Keep build-time helper content from leaking into the visible UI.
  for (const htmlFile of walkFiles(distDir, (file) => file.endsWith('.html'))) {
    const html = fs.readFileSync(htmlFile, 'utf8');
    for (const marker of forbiddenHtmlMarkers) {
      if (html.includes(marker)) {
        fail(`Visible SEO helper marker found in ${path.relative(distDir, htmlFile)}: ${marker}`);
      }
    }
  }

  // Homepage positioning must remain clear for humans, search engines, and AI agents.
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

  // The portrait can be present directly in HTML or injected by runtime modules.
  const portraitIsAvailable =
    indexHtml.includes(requestedPortraitUrl) ||
    fileContains('src/scripts/features/theme.js', requestedPortraitUrl) ||
    fileContains('src/scripts/features/portfolio-upgrades.js', requestedPortraitUrl);

  if (!portraitIsAvailable) fail('Build is missing the requested portrait image URL.');

  const resumePath = path.join(distDir, 'assets', 'resume.pdf');
  if (fs.existsSync(resumePath) && fs.statSync(resumePath).size < 10_000) {
    fail('Generated resume PDF looks too small.');
  }
}

if (process.exitCode) {
  process.exit(process.exitCode);
}

console.log('[build-audit] Build output checks passed.');
