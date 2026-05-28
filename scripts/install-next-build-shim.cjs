const fs = require('node:fs');
const path = require('node:path');

const rootDir = path.resolve(__dirname, '..');
const binDir = path.join(rootDir, 'node_modules', '.bin');
const cloudflareProjectName = 'portfolio-website-2026';

function writeExecutable(filePath, body) {
  fs.writeFileSync(filePath, body, 'utf8');
  if (process.platform !== 'win32') fs.chmodSync(filePath, 0o755);
}

function writeWindowsCmd(commandName, targetFileName) {
  const cmdPath = path.join(binDir, `${commandName}.cmd`);
  fs.writeFileSync(cmdPath, `@ECHO OFF\r\nnode "%~dp0\\${targetFileName}" %*\r\n`, 'utf8');
}

const nextShimBody = `#!/usr/bin/env node
const { spawnSync } = require('node:child_process');
const args = process.argv.slice(2);

if (args[0] !== 'build') {
  console.error('This project is a Vite site, not a Next.js app. Only next build is shimmed for Cloudflare Pages.');
  process.exit(1);
}

console.log('Cloudflare Pages compatibility: redirecting npx next build to npm run build.');
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const result = spawnSync(npmCommand, ['run', 'build'], { stdio: 'inherit' });
process.exit(result.status ?? 1);
`;

const wranglerShimBody = `#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const args = process.argv.slice(2);
const rootDir = path.resolve(__dirname, '..', '..');
const distDir = path.join(rootDir, 'dist');
const cloudflareProjectName = '${cloudflareProjectName}';

function findRealWrangler() {
  const pathEntries = (process.env.PATH || '').split(path.delimiter);
  const localBin = path.resolve(rootDir, 'node_modules', '.bin');
  const executableNames = process.platform === 'win32' ? ['wrangler.cmd', 'wrangler.exe', 'wrangler'] : ['wrangler'];

  for (const entry of pathEntries) {
    if (!entry || path.resolve(entry) === localBin) continue;
    for (const executable of executableNames) {
      const candidate = path.join(entry, executable);
      if (fs.existsSync(candidate)) return candidate;
    }
  }

  return null;
}

if (args[0] === 'deploy') {
  console.log('Cloudflare Pages compatibility: redirecting wrangler deploy to wrangler pages deploy dist for ' + cloudflareProjectName + '.');

  const realWrangler = findRealWrangler();
  if (!realWrangler) {
    console.warn('Could not find the platform wrangler binary. Skipping the incorrect deploy command so Pages can continue.');
    process.exit(0);
  }

  const pagesArgs = ['pages', 'deploy', distDir, '--project-name', cloudflareProjectName];
  const result = spawnSync(realWrangler, pagesArgs, { stdio: 'inherit' });
  process.exit(result.status ?? 1);
}

console.error('This local wrangler shim only handles the incorrect Cloudflare Pages deploy command: wrangler deploy.');
process.exit(1);
`;

fs.mkdirSync(binDir, { recursive: true });

if (process.platform === 'win32') {
  writeExecutable(path.join(binDir, 'next-vite-shim.cjs'), nextShimBody);
  writeWindowsCmd('next', 'next-vite-shim.cjs');

  writeExecutable(path.join(binDir, 'wrangler-pages-shim.cjs'), wranglerShimBody);
  writeWindowsCmd('wrangler', 'wrangler-pages-shim.cjs');
} else {
  writeExecutable(path.join(binDir, 'next'), nextShimBody);
  writeExecutable(path.join(binDir, 'wrangler'), wranglerShimBody);
}

console.log('Installed Cloudflare Pages compatibility shims for Next and Wrangler.');
