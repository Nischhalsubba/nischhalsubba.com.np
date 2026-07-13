const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const dir = path.join(root, 'src', 'styles');
const legacyName = 'inner-page-system.css';
const legacyBudget = 163;
const files = fs.readdirSync(dir).filter((name) => name.endsWith('.css') && name !== legacyName);
const issues = [];

function readCommitted(relativePath, fallbackPath) {
  const result = spawnSync('git', ['show', `HEAD:${relativePath}`], {
    cwd: root,
    encoding: 'utf8',
  });
  if (result.status === 0 && result.stdout) return result.stdout;
  return fs.readFileSync(fallbackPath, 'utf8');
}

for (const name of files) {
  const css = fs.readFileSync(path.join(dir, name), 'utf8');
  if (css.includes('!important')) issues.push(`${name}: !important is forbidden in modular CSS`);
  if (/@import\s+(?:url\()?['"]?https?:/i.test(css)) issues.push(`${name}: remote CSS imports are forbidden`);
  if (/url\(['"]?data:/i.test(css)) issues.push(`${name}: inline data URLs are forbidden`);
  if (/(^|[}\n])\s*(?:html|body|\*)\s*(?:[,>{.:#\[])/m.test(css)) issues.push(`${name}: global document selectors are forbidden`);
}

const legacyPath = path.join(dir, legacyName);
if (!fs.existsSync(legacyPath)) {
  issues.push(`${legacyName}: compatibility stylesheet is missing`);
} else {
  const committedCss = readCommitted(`src/styles/${legacyName}`, legacyPath);
  const count = (committedCss.match(/!important/g) || []).length;
  if (count > legacyBudget) issues.push(`${legacyName}: ${count} committed !important rules exceed budget ${legacyBudget}`);
  console.log(`[css-architecture] committed legacy override budget ${count}/${legacyBudget}.`);
}

if (!files.length) issues.push('No modular CSS files found');
if (issues.length) {
  console.error('[css-architecture] Failed\n' + issues.map((issue) => `- ${issue}`).join('\n'));
  process.exit(1);
}
console.log(`[css-architecture] ${files.length} modular stylesheet(s) passed.`);
