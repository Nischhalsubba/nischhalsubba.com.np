/**
 * @fileoverview scripts/audit-build-provenance.cjs
 * Purpose: Node-based build, content transformation, QA, or maintenance tool for audit build provenance.
 * Responsibilities:
 * - Own the behavior/content implied by this file's single responsibility.
 * - Keep public routes, build contracts, and imported module boundaries stable unless the connected owners are updated together.
 * Execution context: Node.js CLI during local development, CI, build, or maintenance.
 * Connected files:
 * - docs/repository/file-catalog.md
 * - package.json
 * - scripts/build-dist.cjs
 * Maintenance: Update this header when responsibility or dependencies change; generated/vendor files are documented at their source instead.
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
 * Purpose: Implements the walk responsibility for this module.
 * Inputs: directory.
 * Side effects: may read or write repository/filesystem state.
 * Returns: no explicit value unless an invoked dependency throws/rejects.
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
  console.error(`[provenance] Failed\n${issues.map(/** Callback contract: Processes the callback step for issues without leaking orchestration details to the caller. Inputs: issue. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (issue) => `- ${issue}`).join('\n')}`);
  process.exit(1);
}

console.log(`[provenance] ${info.commit} on ${info.branch} verified without wall-clock data.`);
