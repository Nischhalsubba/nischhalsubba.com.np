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

copyDirectory(path.join(rootDir, 'assets'), path.join(distDir, 'assets'));
copyDirectory(path.join(rootDir, 'src', 'scripts'), path.join(distDir, 'src', 'scripts'));
copyFile(path.join(rootDir, 'script.js'), path.join(distDir, 'script.js'));
stripVisibleSeoHelperBlocks();

console.log('Copied static assets/runtime files and removed visible SEO helper blocks from dist.');
