/**
 * @fileoverview scripts/write-build-metadata.cjs
 * Purpose: Generate or assemble write build metadata deterministically as part of the production toolchain.
 * Responsibilities:
 * - Operate deterministically on canonical source or build output so repeated runs produce stable results.
 * - Surface invalid input or contract drift as explicit failures instead of silently masking it.
 * - Keep path assumptions synchronized with repository manifests and source-layout ownership.
 * Execution context: Node.js CLI during development, generation, build, CI, or repository maintenance.
 * Connected files:
 * - docs/production-delivery.md
 * - package.json
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');

if (!fs.existsSync(dist)) {
  console.error('[build-metadata] dist missing');
  process.exit(1);
}

const commit = process.env.WORKERS_CI_COMMIT_SHA
  || process.env.CF_PAGES_COMMIT_SHA
  || process.env.GITHUB_SHA
  || process.env.VERCEL_GIT_COMMIT_SHA
  || 'local';
const branch = process.env.WORKERS_CI_BRANCH
  || process.env.CF_PAGES_BRANCH
  || process.env.GITHUB_REF_NAME
  || process.env.VERCEL_GIT_COMMIT_REF
  || 'local';
const provider = process.env.WORKERS_CI === '1'
  ? 'cloudflare-workers'
  : process.env.CF_PAGES === '1'
    ? 'cloudflare-pages'
    : process.env.GITHUB_ACTIONS === 'true'
      ? 'github-actions'
      : process.env.VERCEL === '1'
        ? 'vercel'
        : 'local';
const data = { commit, branch, provider };

fs.writeFileSync(
  path.join(dist, 'build-info.json'),
  `${JSON.stringify(data, null, 2)}\n`,
  'utf8',
);

const marker = `<meta name="nrs-build-commit" content="${commit}">`;



/**
 * Function contract: walk
 * Purpose: Implement the walk responsibility owned by the write build metadata repository tool.
 * Inputs: `directory`
 * Side effects: writes filesystem state
 * Returns: Undefined; the function exists for the documented side effects, validation, or orchestration.
 */
function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      walk(absolute);
      continue;
    }
    if (!entry.name.endsWith('.html')) continue;

    let html = fs.readFileSync(absolute, 'utf8');
    html = html.replace(/<meta name="nrs-build-(?:commit|time)"[^>]*>/g, '');
    html = html.replace(/<\/head>/i, `${marker}</head>`);
    fs.writeFileSync(absolute, html, 'utf8');
  }
}

walk(dist);
console.log(`[build-metadata] ${commit} on ${branch} via ${provider}`);
