const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const dir = path.join(root, 'src', 'styles');
const compatibilityName = 'inner-page-system.css';
const files = fs.readdirSync(dir).filter((name) => name.endsWith('.css'));
const issues = [];

function readCommitted(relativePath, fallbackPath) {
  const result = spawnSync('git', ['show', `HEAD:${relativePath}`], {
    cwd: root,
    encoding: 'utf8',
  });
  if (result.status === 0 && result.stdout) return result.stdout;
  return fs.readFileSync(fallbackPath, 'utf8');
}

function withoutComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, '');
}

for (const name of files) {
  const filePath = path.join(dir, name);
  const css = name === compatibilityName
    ? readCommitted(`src/styles/${name}`, filePath)
    : fs.readFileSync(filePath, 'utf8');
  const declarations = withoutComments(css);
  const importantCount = (declarations.match(/!\s*important\b/gi) || []).length;

  if (importantCount) issues.push(`${name}: ${importantCount} importance declaration(s) are forbidden`);
  if (/@import\s+(?:url\()?['"]?https?:/i.test(declarations)) issues.push(`${name}: remote CSS imports are forbidden`);
  if (/url\(['"]?data:/i.test(declarations)) issues.push(`${name}: inline data URLs are forbidden`);

  if (name !== compatibilityName && /(^|[}\n])\s*(?:html|body|\*)\s*(?:[,>{.:#\[])/m.test(declarations)) {
    issues.push(`${name}: global document selectors are forbidden in modular CSS`);
  }
}

if (!files.includes(compatibilityName)) issues.push(`${compatibilityName}: compatibility stylesheet is missing`);
if (!files.length) issues.push('No CSS source files found');

if (issues.length) {
  console.error('[css-architecture] Failed\n' + issues.map((issue) => `- ${issue}`).join('\n'));
  process.exit(1);
}

console.log(`[css-architecture] ${files.length} source stylesheet(s) passed with zero importance declarations.`);
