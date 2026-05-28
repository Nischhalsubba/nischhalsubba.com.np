const fs = require('node:fs');
const path = require('node:path');

const rootDir = path.resolve(__dirname, '..');
const sourceDir = path.join(rootDir, 'assets');
const targetDir = path.join(rootDir, 'dist', 'assets');

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

copyDirectory(sourceDir, targetDir);
console.log('Copied static assets to dist/assets.');
