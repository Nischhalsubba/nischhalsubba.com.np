const fs = require('node:fs');
const path = require('node:path');

const rootDir = path.resolve(__dirname, '..');
const binDir = path.join(rootDir, 'node_modules', '.bin');

const shimBody = `#!/usr/bin/env node
const { spawnSync } = require('node:child_process');
const args = process.argv.slice(2);

if (args[0] !== 'build') {
  console.error('This project is a Vite site, not a Next.js app. Only next build is shimmed for Cloudflare builds.');
  process.exit(1);
}

console.log('Cloudflare compatibility: redirecting npx next build to npm run build.');
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const result = spawnSync(npmCommand, ['run', 'build'], { stdio: 'inherit' });
process.exit(result.status ?? 1);
`;

fs.mkdirSync(binDir, { recursive: true });

if (process.platform === 'win32') {
  const shimPath = path.join(binDir, 'next-vite-shim.cjs');
  const cmdPath = path.join(binDir, 'next.cmd');

  fs.writeFileSync(shimPath, shimBody, 'utf8');
  fs.writeFileSync(cmdPath, '@ECHO OFF\r\nnode "%~dp0\\next-vite-shim.cjs" %*\r\n', 'utf8');
} else {
  const nextBin = path.join(binDir, 'next');

  fs.writeFileSync(nextBin, shimBody, 'utf8');
  fs.chmodSync(nextBin, 0o755);
}

console.log('Installed Cloudflare Next build compatibility shim.');
