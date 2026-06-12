const fs = require('node:fs');
const path = require('node:path');

const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

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
    .replace(/\s*<link\s+rel="stylesheet"\s+href="\/production-fixes\.css[^\"]*"\s*\/?>/g, '')
    .replace(/\s*<link\s+rel="stylesheet"\s+href="\/light-theme-polish\.css[^\"]*"\s*\/?>/g, '')
    .replace(/\s*<link\s+rel="stylesheet"\s+href="\/blog-experience\.css[^\"]*"\s*\/?>/g, '')
    .replace(/\s*<link\s+rel="stylesheet"\s+href="\/design-system-repair\.css[^\"]*"\s*\/?>/g, '');
}

function ensureRuntimeScript(html) {
  if (html.includes('/site-experience.js')) return html;
  return html.replace('</body>', '  <script src="/site-experience.js?v=20260612" defer></script>\n  </body>');
}

function optimizeHtmlOutput() {
  for (const filePath of walkFiles(distDir, (file) => file.endsWith('.html'))) {
    const original = fs.readFileSync(filePath, 'utf8');
    const optimized = ensureRuntimeScript(removeLegacyPatchAssets(stripUnusedVendorScripts(stripVisibleSeoHelperBlocks(original))));

    if (optimized !== original) {
      fs.writeFileSync(filePath, optimized, 'utf8');
    }
  }
}

copyDirectory(path.join(rootDir, 'assets'), path.join(distDir, 'assets'));
copyDirectory(path.join(rootDir, 'src', 'scripts'), path.join(distDir, 'src', 'scripts'));
copyDirectory(path.join(rootDir, 'public'), distDir);
copyFile(path.join(rootDir, 'script.js'), path.join(distDir, 'script.js'));
copyFile(path.join(rootDir, 'style.css'), path.join(distDir, 'style.css'));

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

optimizeHtmlOutput();

console.log('Copied static assets, public files, root stylesheet, discovery files, runtime files, manifest, stripped legacy patch CSS, stripped unused vendor scripts, and removed visible SEO helper blocks from dist.');
