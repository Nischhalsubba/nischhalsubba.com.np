/**
 * @fileoverview scripts/ensure-reveal-visibility.cjs
 * Purpose: Node-based build, content transformation, QA, or maintenance tool for ensure reveal visibility.
 * Responsibilities:
 * - Own the behavior/content implied by this file's single responsibility.
 * - Keep public routes, build contracts, and imported module boundaries stable unless the connected owners are updated together.
 * Execution context: Node.js CLI during local development, CI, build, or maintenance.
 * Connected files:
 * - docs/repository/file-catalog.md
 * - docs/reveal-visibility-hotfix.md
 * - scripts/build-dist.cjs
 * - scripts/generate-source.cjs
 * Maintenance: Update this header when responsibility or dependencies change; generated/vendor files are documented at their source instead.
 */
const fs = require('node:fs');
const path = require('node:path');

const repositoryRoot = path.resolve(__dirname, '..');
const useDist = process.argv.includes('--dist');
const base = useDist ? path.join(repositoryRoot, 'dist') : repositoryRoot;

const runtimeFiles = [
  path.join(base, 'src', 'scripts', 'features', 'agent-portfolio.js'),
  path.join(base, 'script.js'),
];

const styleFiles = useDist
  ? [path.join(base, 'style.css')]
  : [
      path.join(repositoryRoot, 'style.css'),
      path.join(repositoryRoot, 'src', 'styles', 'agent-portfolio-3.cssfrag'),
    ];

const motionReadyCall = /\s*root\.classList\.add\(['"]agent-motion-ready['"]\);/g;
const dangerousRevealRule = /\.agent-portfolio\.agent-motion-ready\s+\[data-agent-reveal\]\s*\{\s*opacity\s*:\s*0\s*;\s*transform\s*:\s*translateY\(1\.25rem\)\s*;\s*\}/g;
const safeRevealRule = `.agent-portfolio.agent-motion-ready [data-agent-reveal] {
  opacity: 1;
  transform: none;
}`;

let runtimePatched = 0;
let stylePatched = 0;

for (const file of runtimeFiles) {
  if (!fs.existsSync(file)) continue;
  const before = fs.readFileSync(file, 'utf8');
  const after = before.replace(motionReadyCall, '');
  if (after !== before) {
    fs.writeFileSync(file, after, 'utf8');
    runtimePatched += 1;
  }
}

for (const file of styleFiles) {
  if (!fs.existsSync(file)) continue;
  const before = fs.readFileSync(file, 'utf8');
  const after = before.replace(dangerousRevealRule, safeRevealRule);
  if (after !== before) {
    fs.writeFileSync(file, after, 'utf8');
    stylePatched += 1;
  }
}

const failures = [];
for (const file of runtimeFiles) {
  if (!fs.existsSync(file)) continue;
  const source = fs.readFileSync(file, 'utf8');
  if (/root\.classList\.add\(['"]agent-motion-ready['"]\)/.test(source)) {
    failures.push(`${path.relative(repositoryRoot, file)} still enables the global motion-ready hiding state.`);
  }
}
for (const file of styleFiles) {
  if (!fs.existsSync(file)) continue;
  const source = fs.readFileSync(file, 'utf8');
  if (dangerousRevealRule.test(source)) {
    failures.push(`${path.relative(repositoryRoot, file)} can still hide all reveal targets after animation cleanup.`);
  }
  dangerousRevealRule.lastIndex = 0;
}

if (failures.length) {
  console.error('[reveal-visibility] Failed:\n- ' + failures.join('\n- '));
  process.exit(1);
}

console.log(`[reveal-visibility] Safe reveal contract applied (${runtimePatched} runtime, ${stylePatched} style file${stylePatched === 1 ? '' : 's'} patched) for ${useDist ? 'dist' : 'source'}.`);
