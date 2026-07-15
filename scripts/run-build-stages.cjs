const { spawnSync } = require('node:child_process');

function runStages(stages, scope) {
  for (const [label, [command, ...args]] of stages) {
    console.log(`\n[${scope}] ${label}`);
    const result = spawnSync(command, args, {
      stdio: 'inherit',
      shell: process.platform === 'win32',
    });
    if (result.error) {
      console.error(`[${scope}] Could not start ${label}:`, result.error.message);
      process.exit(1);
    }
    if (result.status !== 0) {
      console.error(`[${scope}] ${label} failed with exit code ${result.status}.`);
      process.exit(result.status || 1);
    }
  }
}

module.exports = { runStages };
