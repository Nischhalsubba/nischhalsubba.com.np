const fs = require('node:fs');
const path = require('node:path');

const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

/**
 * Recursively copy a directory into dist.
 *
 * Vite handles bundled assets, but this site also serves several root-level
 * runtime and discovery files directly. Keeping this copy layer explicit makes
 * the final Cloudflare output predictable instead of relying on accidental
 * bundler behavior. Thrilling, I know.
 */
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

/** Copy a single file if it exists. Missing optional files are ignored. */
function copyFile(source, target) {
  if (!fs.existsSync(source)) return;
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
}

/** Copy a file that must be served from the web root, for example /robots.txt. */
function copyRootFile(fileName) {
  copyFile(path.join(rootDir, fileName), path.join(distDir, fileName));
}

/** Walk files under a directory and return only the files accepted by matcher. */
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

/**
 * Remove build-time SEO helper sections from visible HTML output.
 *
 * The Vite HTML plugin injects static context/schema for crawlers. The schema
 * should remain, but the visible helper sections should not appear in the UI.
 */
function stripVisibleSeoHelperBlocks() {
  const helperBlockClasses = [
    'nrs-static-project-context',
    'nrs-static-related-links',
    'nrs-static-faq',
  ];

  for (const filePath of walkFiles(distDir, (file) => file.endsWith('.html'))) {
    let html = fs.readFileSync(filePath, 'utf8');
    const original = html;

    for (const className of helperBlockClasses) {
      const pattern = new RegExp(`<section[^>]*\\b${className}\\b[^>]*>[\\s\\S]*?<\\/section>`, 'g');
      html = html.replace(pattern, '');
    }

    if (html !== original) {
      fs.writeFileSync(filePath, html, 'utf8');
    }
  }
}

// Copy source assets and runtime modules needed by root-level HTML files.
copyDirectory(path.join(rootDir, 'assets'), path.join(distDir, 'assets'));
copyDirectory(path.join(rootDir, 'src', 'scripts'), path.join(distDir, 'src', 'scripts'));
copyFile(path.join(rootDir, 'script.js'), path.join(distDir, 'script.js'));

// Copy root-served discovery and metadata files. These are intentionally kept
// at repository root because their public URLs are root URLs.
for (const fileName of [
  'robots.txt',
  'sitemap.xml',
  'llms.txt',
  'ai-profile.json',
  'seo-ui-enhancements.css',
  'site.webmanifest',
]) {
  copyRootFile(fileName);
}

stripVisibleSeoHelperBlocks();

console.log('Copied static assets, AI discovery files, runtime files, manifest, and removed visible SEO helper blocks from dist.');
