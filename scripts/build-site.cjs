const { spawnSync } = require('node:child_process');

for (const script of ['scripts/generate-source.cjs', 'scripts/build-dist.cjs']) {
  const result = spawnSync('node', [script], {
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });
  if (result.error) {
    console.error(`[build] Could not start ${script}:`, result.error.message);
    process.exit(1);
  }
  if (result.status !== 0) process.exit(result.status || 1);
}

console.log('\n[build] Source generation and production build completed successfully.');
