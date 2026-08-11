const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

/*
 * Generates docs/repository/file-catalog.md from the tracked repository tree.
 *
 * Every tracked file receives a concise purpose and a small set of meaningful
 * connections. Connections prefer direct textual references when they exist and
 * fall back to the owning build/runtime/documentation system for assets or files
 * that are discovered by convention.
 *
 * Connected files:
 * - docs/repository/file-catalog.md: generated human-readable catalog.
 * - docs/repository/file-map.md: architectural overview and folder ownership.
 * - config/repository/root-policy.json: repository organization policy.
 * - package.json: exposes npm run docs:file-catalog and validation integration.
 */

const ROOT = path.resolve(__dirname, '../..');
const OUTPUT = 'docs/repository/file-catalog.md';
const TEMPORARY_HELPERS = new Set([
  '.github/workflows/generate-file-catalog.yml',
  '.github/workflows/generate-file-catalog-pr.yml',
]);
const MAX_SCAN_BYTES = 512 * 1024;
const TEXT_EXTENSIONS = new Set([
  '.css', '.html', '.js', '.cjs', '.mjs', '.json', '.jsonc', '.md', '.ts', '.tsx',
  '.txt', '.xml', '.yml', '.yaml', '.toml', '.svg', '.webmanifest',
]);
const TEXT_BASENAMES = new Set([
  '.editorconfig', '.gitignore', '_headers', '_redirects', 'robots.txt', 'sitemap.xml',
]);

function gitTrackedFiles() {
  const result = spawnSync('git', ['ls-files', '-z'], { cwd: ROOT, encoding: 'utf8' });
  if (result.status !== 0) throw new Error(`git ls-files failed: ${result.stderr || result.stdout}`);
  return result.stdout.split('\0').filter(Boolean).sort();
}

function humanize(value) {
  return value
    .replace(/\.[^.]+$/, '')
    .replace(/^blog-/, '')
    .replace(/^project-/, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function isTextFile(file) {
  const base = path.posix.basename(file);
  return TEXT_BASENAMES.has(base) || TEXT_EXTENSIONS.has(path.posix.extname(file).toLowerCase());
}

function readText(file) {
  const absolute = path.join(ROOT, file);
  const stat = fs.statSync(absolute);
  if (stat.size > MAX_SCAN_BYTES || !isTextFile(file)) return null;
  return fs.readFileSync(absolute, 'utf8');
}

function purposeFor(file) {
  const base = path.posix.basename(file);
  const ext = path.posix.extname(file).toLowerCase();

  const exact = {
    '.editorconfig': 'Editor formatting defaults shared across contributors.',
    '.gitignore': 'Git ignore policy, including generated build output and temporary root compatibility sources.',
    'AGENTS.md': 'Automation and deployment safety contract for repository-changing agents.',
    'README.md': 'GitHub-facing repository overview and project entry documentation.',
    'package.json': 'Node dependency declarations and the authoritative development, build, audit, and QA command surface.',
    'package-lock.json': 'Reproducible npm dependency graph consumed by npm ci and dependency security checks.',
    'tsconfig.json': 'TypeScript/editor compiler configuration used by Vite configuration and development tooling.',
    'vercel.json': 'Secondary Vercel deployment compatibility configuration.',
    'vite.config.ts': 'Vite multi-page build, asset, canonical URL, and HTML transformation configuration.',
    'wrangler.jsonc': 'Cloudflare Worker/static asset deployment and binding configuration.',
    'src/worker.js': 'Cloudflare Worker request router for static delivery, redirects, and API behavior.',
    'src/runtime/script.js': 'Stable browser runtime compatibility entry that loads the modular source runtime.',
    'src/styles/style.css': 'Canonical global production stylesheet source.',
    'config/canonical-routes.json': 'Canonical route and legacy redirect contract shared by build, SEO, and Worker tooling.',
    'config/repository/root-policy.json': 'Machine-enforced repository-root allow-list and documentation policy.',
    'docs/repository/file-map.md': 'Architectural ownership map for root files, source folders, build folders, and compatibility behavior.',
  };
  if (exact[file]) return exact[file];

  if (file.startsWith('.github/workflows/')) return `GitHub Actions workflow for ${humanize(base)} automation and QA.`;
  if (file.startsWith('src/pages/')) {
    if (base === 'index.html') return 'Canonical homepage HTML source.';
    if (base.startsWith('project-')) return `Canonical ${humanize(base)} project case-study HTML source.`;
    return `Canonical ${humanize(base)} top-level page HTML source.`;
  }
  if (file.startsWith('src/compat/legacy-pages/')) return `Build-only legacy ${humanize(base)} HTML input retained for current Vite compatibility and removed from production output.`;
  if (file.startsWith('blog/') && ext === '.html') return base === 'index.html' ? 'Canonical writing/blog index HTML source.' : `Canonical ${humanize(base)} writing/article HTML source.`;
  if (file.startsWith('src/scripts/') && ['.js', '.mjs'].includes(ext)) return `Modular browser-runtime feature for ${humanize(base)} behavior.`;
  if (file.startsWith('src/styles/') && ext === '.css') return `Frontend stylesheet module for ${humanize(base)}.`;
  if (file.startsWith('src/discovery/')) return `Search, crawler, AI-discovery, browser-manifest, or response-header source: ${base}.`;
  if (file.startsWith('src/generated/')) return `Generated runtime source consumed by production code: ${humanize(base)}.`;
  if (file.startsWith('scripts/repository/')) return `Repository architecture/documentation utility for ${humanize(base)}.`;
  if (file.startsWith('scripts/')) {
    if (/audit|check|verify|validate|smoke|test/.test(base)) return `Build/QA verification script for ${humanize(base)}.`;
    if (/generate|compose|copy|build|compile/.test(base)) return `Build-generation script for ${humanize(base)}.`;
    if (/apply|finalize|normalize|enforce|fix|polish|rewrite|restore|repair|redesign|lock/.test(base)) return `Deterministic production transformation stage for ${humanize(base)}.`;
    return `Build or maintenance utility for ${humanize(base)}.`;
  }
  if (file.startsWith('config/')) return `Structured repository/build configuration for ${humanize(base)}.`;
  if (file.startsWith('data/')) return `Structured content/data input for ${humanize(base)} generation or runtime use.`;
  if (file.startsWith('tests/')) return `Automated QA fixture, baseline, helper, or evidence file for ${humanize(base)}.`;
  if (file.startsWith('assets/')) {
    if (['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg', '.avif'].includes(ext)) return `Authored visual asset used by portfolio pages or generated presentation surfaces: ${humanize(base)}.`;
    if (['.pdf', '.docx'].includes(ext)) return `Downloadable document asset: ${humanize(base)}.`;
    return `Authored static asset for ${humanize(base)}.`;
  }
  if (file.startsWith('public/')) return `Static passthrough deployment asset/configuration for ${humanize(base)}.`;
  if (file.startsWith('api/')) return `Deployment-compatible API handler/module for ${humanize(base)}.`;
  if (file.startsWith('functions/api/')) return `Cloudflare Functions-compatible API handler for ${humanize(base)}.`;
  if (file.startsWith('docs/')) return `Repository documentation for ${humanize(base)}.`;
  if (base === 'README.md') return `Folder-level ownership and usage documentation for ${path.posix.dirname(file) || 'repository root'}.`;
  if (ext === '.md') return `Project documentation for ${humanize(base)}.`;
  if (ext === '.json' || ext === '.jsonc') return `Structured configuration/data file for ${humanize(base)}.`;
  if (['.js', '.cjs', '.mjs', '.ts', '.tsx'].includes(ext)) return `Executable source/tooling module for ${humanize(base)}.`;
  if (ext === '.css') return `Stylesheet source for ${humanize(base)}.`;
  if (ext === '.html') return `HTML content/source file for ${humanize(base)}.`;
  return `Repository asset/support file for ${humanize(base) || base}.`;
}

function defaultConnections(file) {
  if (file.startsWith('src/pages/')) return ['config/canonical-routes.json', 'scripts/repository/source-layout.cjs', 'vite.config.ts'];
  if (file.startsWith('src/compat/legacy-pages/')) return ['vite.config.ts', 'scripts/clean-vite-public-output.cjs', 'scripts/repository/source-layout.cjs'];
  if (file.startsWith('blog/')) return ['config/canonical-routes.json', 'vite.config.ts', 'scripts/build-dist.cjs'];
  if (file.startsWith('src/scripts/')) return ['src/scripts/main.js', 'src/runtime/script.js'];
  if (file.startsWith('src/styles/')) return ['scripts/compile-single-stylesheet.cjs', 'scripts/audit-css-architecture.cjs'];
  if (file.startsWith('src/discovery/')) return ['scripts/generate-seo-discovery.cjs', 'scripts/copy-static-assets.cjs'];
  if (file.startsWith('src/generated/')) return ['scripts/generate-seo-discovery.cjs', 'src/worker.js'];
  if (file.startsWith('scripts/repository/')) return ['package.json', 'config/repository/root-policy.json'];
  if (file.startsWith('scripts/')) return ['scripts/build-dist.cjs', 'package.json'];
  if (file.startsWith('.github/workflows/')) return ['package.json', 'scripts/'];
  if (file.startsWith('config/')) return ['scripts/', 'package.json'];
  if (file.startsWith('data/')) return ['scripts/', 'src/'];
  if (file.startsWith('tests/')) return ['.github/workflows/', 'scripts/'];
  if (file.startsWith('assets/')) return ['scripts/copy-static-assets.cjs', 'src/pages/ or blog/'];
  if (file.startsWith('public/')) return ['scripts/copy-static-assets.cjs', 'deployment output'];
  if (file.startsWith('api/') || file.startsWith('functions/api/')) return ['src/worker.js', 'contact form/runtime'];
  if (file.startsWith('docs/')) return ['README.md', 'related source/tooling folder'];
  return ['docs/repository/file-map.md'];
}

function escapeCell(value) {
  return String(value).replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');
}

const files = gitTrackedFiles().filter((file) => file !== OUTPUT && !TEMPORARY_HELPERS.has(file));
const basenameCounts = new Map();
for (const file of files) {
  const base = path.posix.basename(file);
  basenameCounts.set(base, (basenameCounts.get(base) || 0) + 1);
}

const text = new Map();
for (const file of files) {
  try {
    const content = readText(file);
    if (content !== null) text.set(file, content);
  } catch {
    // Binary, deleted during generation, or unsupported files rely on ownership connections.
  }
}

function directConnections(file) {
  const base = path.posix.basename(file);
  const uniqueBase = basenameCounts.get(base) === 1 && base.length >= 5;
  const matches = [];
  for (const [candidate, content] of text) {
    if (candidate === file) continue;
    if (content.includes(file) || (uniqueBase && content.includes(base))) matches.push(candidate);
    if (matches.length >= 4) break;
  }
  return matches;
}

const rows = files.map((file) => {
  const direct = directConnections(file);
  const connections = [...new Set([...direct, ...defaultConnections(file)])]
    .filter((item) => item !== file)
    .slice(0, 4);
  return `| \`${escapeCell(file)}\` | ${escapeCell(purposeFor(file))} | ${connections.map((item) => `\`${escapeCell(item)}\``).join(', ')} |`;
});

const output = [
  '# Tracked file catalog',
  '',
  '> Generated by `scripts/repository/generate-file-catalog.cjs`. Do not maintain rows by hand. Run `npm run docs:file-catalog` after adding, moving, or removing tracked files.',
  '',
  `Cataloged **${files.length} Git-tracked files**. The catalog file itself is excluded to avoid self-referential generation.`,
  '',
  'Connections list direct textual references when available, then ownership/build-system relationships. For architectural rationale, see `docs/repository/file-map.md`.',
  '',
  '| File | What it does | Connected to |',
  '|---|---|---|',
  ...rows,
  '',
].join('\n');

const target = path.join(ROOT, OUTPUT);
fs.mkdirSync(path.dirname(target), { recursive: true });
fs.writeFileSync(target, output, 'utf8');
console.log(`[file-catalog] Documented ${files.length} tracked file(s) in ${OUTPUT}.`);
