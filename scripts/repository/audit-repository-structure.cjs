const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { ROOT, ROOT_PAGE_NAMES, DISCOVERY_NAMES } = require('./source-layout.cjs');

/*
 * Repository structure audit.
 *
 * Purpose: fail CI when tracked production source drifts back into repository root,
 * when retired WordPress material returns, or when the structure documentation is
 * removed. It validates the organization contract introduced by the repository
 * cleanup without caring about temporary git-ignored compatibility files.
 *
 * Connected files:
 * - config/repository/root-policy.json: allowed root and documentation policy.
 * - config/canonical-routes.json: canonical page inventory via source-layout.cjs.
 * - package.json: exposes this audit as npm run audit:repo-structure.
 */

const policyPath = path.join(ROOT, 'config', 'repository', 'root-policy.json');
const policy = JSON.parse(fs.readFileSync(policyPath, 'utf8'));
const result = spawnSync('git', ['ls-files', '-z'], { cwd: ROOT, encoding: 'utf8' });
if (result.status !== 0) throw new Error(`git ls-files failed: ${result.stderr || result.stdout}`);

const tracked = result.stdout.split('\0').filter(Boolean);
const rootFiles = tracked.filter((file) => !file.includes('/')).sort();
const unexpectedRoot = rootFiles.filter((file) => !policy.allowedRootFiles.includes(file));
const failures = [];

if (unexpectedRoot.length) failures.push(`Unexpected tracked root file(s): ${unexpectedRoot.join(', ')}`);

for (const prefix of policy.forbiddenTrackedPrefixes) {
  const matches = tracked.filter((file) => file.startsWith(prefix));
  if (matches.length) failures.push(`Forbidden tracked prefix ${prefix}: ${matches.length} file(s)`);
}

for (const page of ROOT_PAGE_NAMES) {
  const source = `src/pages/${page}`;
  if (!tracked.includes(source)) failures.push(`Missing canonical page source: ${source}`);
}

for (const name of ['home.html', 'home-v2.html', 'blog.html']) {
  const source = `src/compat/legacy-pages/${name}`;
  if (!tracked.includes(source)) failures.push(`Missing Vite compatibility page source: ${source}`);
}

if (!tracked.includes('src/styles/style.css')) failures.push('Missing canonical stylesheet source: src/styles/style.css');
if (!tracked.includes('src/runtime/script.js')) failures.push('Missing canonical runtime entry template: src/runtime/script.js');
for (const name of DISCOVERY_NAMES) {
  const source = `src/discovery/${name}`;
  if (!tracked.includes(source)) failures.push(`Missing discovery source: ${source}`);
}

for (const doc of policy.requiredDocumentation) {
  if (!tracked.includes(doc)) failures.push(`Missing repository documentation: ${doc}`);
}

if (failures.length) {
  console.error(`[repository-structure] ${failures.length} failure(s)\n${failures.map((item) => `- ${item}`).join('\n')}`);
  process.exit(1);
}

console.log(`[repository-structure] Root policy passed with ${rootFiles.length} tracked root file(s), ${ROOT_PAGE_NAMES.length} organized canonical root page source(s), and ${DISCOVERY_NAMES.length} organized discovery source(s).`);
