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
  'src/scripts/features/theme.js',
  'src/scripts/features/portfolio-upgrades.js',
  'assets/resume.pdf',
];
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
  for (const relativePath of requiredFiles) {
    const filePath = path.join(distDir, relativePath);
    if (!fs.existsSync(filePath)) fail(`Missing required build output: ${relativePath}`);
  }

  for (const htmlFile of walkFiles(distDir, (file) => file.endsWith('.html'))) {
    const html = fs.readFileSync(htmlFile, 'utf8');
    for (const marker of forbiddenHtmlMarkers) {
      if (html.includes(marker)) {
        fail(`Visible SEO helper marker found in ${path.relative(distDir, htmlFile)}: ${marker}`);
      }
    }
  }

  const indexHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');
  if (!indexHtml.includes('Senior UI/Product Designer')) fail('Homepage is missing senior designer positioning.');

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
