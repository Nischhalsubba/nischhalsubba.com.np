const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.resolve(__dirname);
const extensions = new Set(['.cjs', '.js', '.mjs']);
const files = [];

function collect(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) collect(fullPath);
    else if (extensions.has(path.extname(entry.name))) files.push(fullPath);
  }
}

collect(root);
files.sort();

const failures = [];
for (const file of files) {
  const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
  if (result.status !== 0) {
    failures.push({
      file: path.relative(path.resolve(root, '..'), file),
      output: `${result.stdout || ''}${result.stderr || ''}`.trim(),
    });
  }
}

if (failures.length) {
  console.error('[preflight] Build-script syntax validation failed:');
  for (const failure of failures) {
    console.error(`\n- ${failure.file}`);
    console.error(failure.output);
  }
  process.exit(1);
}

console.log(`[preflight] Syntax checked ${files.length} build script(s).`);
