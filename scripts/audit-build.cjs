const fs = require('node:fs');
const path = require('node:path');

const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const requestedPortraitUrl = 'https://i.imgur.com/oFHdPUS.png';
const requiredFiles = [
  'index.html',
  'home-v2.html',
  'projects.html',
  'blog/index.html',
  'script.js',
  'assets/styles/portfolio-system.css',
  'src/scripts/features/atelier-pages.js',
  'src/scripts/features/custom-cursor.js',
  'assets/resume.pdf',
  'llms.txt',
  'ai-index.json',
  'sitemap.xml',
];
const requiredHomepageMarkers = [
  'Senior UI/Product Designer',
  'Product Design',
];
const requiredRuntimeMarkers = [
  'portfolio-system.css',
  'Senior Product Designer',
  'Email me',
];
const requiredSystemMarkers = [
  '--ratio: 1.618',
  '--space-xl',
  '.work-grid',
  '.project-grid',
  '.writing-grid',
  '.nrs-cursor-dot',
  '#005bb5',
];
const requiredCursorMarkers = [
  'initCustomCursor',
  'nrs-cursor-ready',
  'nrs-cursor-hover',
  'requestAnimationFrame',
];
const requiredAiMarkers = [
  'Senior UI/Product Designer',
  'Web3 UX',
  'SaaS dashboards',
  'Design systems',
  'Yarsha',
  'Mokshya.io',
];
const forbiddenHtmlMarkers = [
  'nrs-static-project-context',
  'nrs-static-related-links',
  'nrs-static-faq',
  'worldclass.css',
  'open-design-overrides.css',
  'Products</h5><a href="/products/ui-kit.html"',
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

function readDistFile(relativePath) {
  const filePath = path.join(distDir, relativePath);
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : '';
}

function fileContains(relativePath, value) {
  return readDistFile(relativePath).includes(value);
}

if (!fs.existsSync(distDir)) {
  fail('dist directory does not exist. Run the build before auditing.');
} else {
  for (const relativePath of requiredFiles) {
    const filePath = path.join(distDir, relativePath);
    if (!fs.existsSync(filePath)) fail(`Missing required build output: ${relativePath}`);
  }

  for (const htmlFile of walkFiles(distDir, (file) => file.endsWith('.html'))) {
    const html = fs.readFileSync(htmlFile, 'utf8');
    for (const marker of forbiddenHtmlMarkers) {
      if (html.includes(marker)) {
        fail(`Forbidden or obsolete marker found in ${path.relative(distDir, htmlFile)}: ${marker}`);
      }
    }
  }

  const indexHtml = readDistFile('index.html');
  for (const marker of requiredHomepageMarkers) {
    if (!indexHtml.includes(marker)) fail(`Homepage is missing required marker: ${marker}`);
  }

  const compatibilityEntrypoint = readDistFile('script.js');
  if (!compatibilityEntrypoint.includes('./src/scripts/main.js')) {
    fail('Compatibility script.js is not importing the runtime entrypoint.');
  }

  const atelierRuntime = readDistFile('src/scripts/features/atelier-pages.js');
  for (const marker of requiredRuntimeMarkers) {
    if (!atelierRuntime.includes(marker)) fail(`Atelier runtime is missing required marker: ${marker}`);
  }

  const systemCss = readDistFile('assets/styles/portfolio-system.css');
  for (const marker of requiredSystemMarkers) {
    if (!systemCss.includes(marker)) fail(`portfolio-system.css is missing required marker: ${marker}`);
  }

  const cursorRuntime = readDistFile('src/scripts/features/custom-cursor.js');
  for (const marker of requiredCursorMarkers) {
    if (!cursorRuntime.includes(marker)) fail(`custom-cursor.js is missing required marker: ${marker}`);
  }

  const llms = readDistFile('llms.txt');
  const aiIndex = readDistFile('ai-index.json');
  for (const marker of requiredAiMarkers) {
    if (!llms.includes(marker) && !aiIndex.includes(marker)) fail(`AI/SEO discovery files are missing required marker: ${marker}`);
  }

  const portraitIsAvailable =
    indexHtml.includes(requestedPortraitUrl) ||
    fileContains('src/scripts/features/theme.js', requestedPortraitUrl) ||
    fileContains('src/scripts/features/atelier-pages.js', requestedPortraitUrl);

  if (!portraitIsAvailable) fail('Build is missing the requested portrait image URL.');

  const resumePath = path.join(distDir, 'assets', 'resume.pdf');
  if (fs.existsSync(resumePath) && fs.statSync(resumePath).size < 10_000) {
    fail('Generated resume PDF looks too small.');
  }
}

if (process.exitCode) {
  process.exit(process.exitCode);
}

console.log('[build-audit] Portfolio system, SEO, AI, and accessibility output checks passed.');
