const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const jsExtensions = new Set(['.js', '.cjs', '.mjs']);
const jsRoots = [path.join(root, 'scripts'), path.join(root, 'src', 'scripts')];
const cssRoots = [path.join(root, 'src', 'styles')];
const failures = [];
const checked = { javascript: 0, css: 0, production: 0 };

function walk(directory, predicate, output = []) {
  if (!fs.existsSync(directory)) return output;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === 'dist') continue;
      walk(fullPath, predicate, output);
    } else if (predicate(fullPath)) {
      output.push(fullPath);
    }
  }
  return output;
}

function relative(file) {
  return path.relative(root, file).replaceAll(path.sep, '/');
}

function addFailure(file, message) {
  failures.push(`${relative(file)}: ${message}`);
}

function hasBalancedBraces(source) {
  let depth = 0;
  let quote = '';
  let inComment = false;
  let escaped = false;

  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    const next = source[index + 1];

    if (inComment) {
      if (char === '*' && next === '/') {
        inComment = false;
        index += 1;
      }
      continue;
    }

    if (quote) {
      if (escaped) {
        escaped = false;
      } else if (char === '\\') {
        escaped = true;
      } else if (char === quote) {
        quote = '';
      }
      continue;
    }

    if (char === '/' && next === '*') {
      inComment = true;
      index += 1;
      continue;
    }

    if (char === '"' || char === "'") {
      quote = char;
      continue;
    }

    if (char === '{') depth += 1;
    if (char === '}') depth -= 1;
    if (depth < 0) return false;
  }

  return depth === 0 && !quote && !inComment;
}

const jsFiles = [...new Set(jsRoots.flatMap((directory) => walk(directory, (file) => jsExtensions.has(path.extname(file)))))]
  .sort();

for (const file of jsFiles) {
  checked.javascript += 1;
  const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
  if (result.status !== 0) {
    addFailure(file, `${result.stdout || ''}${result.stderr || ''}`.trim() || 'JavaScript syntax check failed');
  }
}

const cssFiles = [...new Set(cssRoots.flatMap((directory) => walk(directory, (file) => /\.css(?:frag)?$/i.test(file))))]
  .sort();

for (const file of cssFiles) {
  checked.css += 1;
  const source = fs.readFileSync(file, 'utf8');
  if (path.extname(file) === '.css' && !hasBalancedBraces(source)) {
    addFailure(file, 'unbalanced CSS braces/comments/strings');
  }
  if (/transition\s*:\s*all\b/i.test(source)) {
    addFailure(file, 'avoid `transition: all`; transition only the properties that move');
  }
}

const agentFragments = cssFiles
  .filter((file) => /^agent-portfolio-\d+\.cssfrag$/i.test(path.basename(file)))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
if (agentFragments.length) {
  const combined = agentFragments.map((file) => fs.readFileSync(file, 'utf8')).join('\n');
  if (!hasBalancedBraces(combined)) {
    addFailure(agentFragments[0], 'combined agent portfolio CSS fragments are not structurally balanced');
  }
}

const productionChecks = [
  {
    file: path.join(root, 'dist', 'style.css'),
    rules: [
      [/\.agent-portfolio\.agent-motion-ready\s+\[data-agent-reveal\][^{]*\{[^}]*opacity\s*:\s*0/si, 'production CSS can globally hide reveal content'],
      [/transition\s*:\s*all\b/i, 'production CSS contains `transition: all`'],
      [/\.agent-portfolio\s+\.agent-case-title-wrap\s*\{/i, null],
      [/\.agent-portfolio\s+\.agent-page-hero-grid\s*>\s*div:first-child\s*\{/i, null]
    ]
  },
  {
    file: path.join(root, 'dist', 'script.js'),
    rules: [
      [/root\.classList\.add\(['"]agent-motion-ready['"]\)/, 'production runtime still enables the global reveal-hiding state']
    ]
  }
];

for (const check of productionChecks) {
  if (!fs.existsSync(check.file)) continue;
  checked.production += 1;
  const source = fs.readFileSync(check.file, 'utf8');
  for (const [pattern, failureMessage] of check.rules) {
    const matches = pattern.test(source);
    if (failureMessage && matches) addFailure(check.file, failureMessage);
    if (!failureMessage && !matches) addFailure(check.file, `required interface-polish contract missing: ${pattern}`);
  }
}

if (failures.length) {
  console.error(`[lint] ${failures.length} failure(s):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`[lint] Passed: ${checked.javascript} JavaScript files, ${checked.css} CSS source files, ${checked.production} production artifact checks.`);
