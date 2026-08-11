/**
 * @fileoverview scripts/audit-build-provenance.cjs
 * Purpose: Validate audit build provenance and fail with actionable diagnostics when the production contract is violated.
 * Responsibilities:
 * - Operate deterministically on canonical source or build output so repeated runs produce stable results.
 * - Surface invalid input or contract drift as explicit failures instead of silently masking it.
 * - Keep path assumptions synchronized with repository manifests and source-layout ownership.
 * Execution context: Node.js CLI during development, generation, build, CI, or repository maintenance.
 * Connected files:
 * - package.json
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
const fs = require('node:fs');
const path = require('node:path');

const dist = path.resolve(__dirname, '..', 'dist');
const infoPath = path.join(dist, 'build-info.json');
const issues = [];

if (!fs.existsSync(infoPath)) {
  console.error('[provenance] build-info.json missing');
  process.exit(1);
}

let info;
try {
  info = JSON.parse(fs.readFileSync(infoPath, 'utf8'));
} catch {
  console.error('[provenance] invalid build-info.json');
  process.exit(1);
}

if (!info.commit || !info.branch) issues.push('build metadata is incomplete');
if ('builtAt' in info) issues.push('build metadata contains non-deterministic builtAt data');


/**
 * Function contract: walk
 * Purpose: Implement the walk responsibility owned by the audit build provenance repository tool.
 * Inputs: `directory`
 * Side effects: reads filesystem state
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

    const html = fs.readFileSync(absolute, 'utf8');
    const marker = html.match(/<meta name="nrs-build-commit" content="([^"]+)">/);
    const relative = path.relative(dist, absolute);
    if (!marker) issues.push(`${relative}: missing commit marker`);
    else if (marker[1] !== info.commit) issues.push(`${relative}: commit marker mismatch`);
    if (/name="nrs-build-time"/.test(html)) issues.push(`${relative}: contains non-deterministic build time marker`);
  }
}

walk(dist);

if (issues.length) {
  console.error(`[provenance] Failed\n${issues.map( /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `issue` Side effects: No direct external side effect beyond invoked dependencies. Returns: Computed expression result consumed by the enclosing operation. */ (issue) => `- ${issue}`).join('\n')}`);
  process.exit(1);
}

console.log(`[provenance] ${info.commit} on ${info.branch} verified without wall-clock data.`);
