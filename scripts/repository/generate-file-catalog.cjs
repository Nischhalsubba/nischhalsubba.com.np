/**
 * @fileoverview scripts/repository/generate-file-catalog.cjs
 * Purpose: Maintain the repository architecture, generated documentation, or structural policy for generate file catalog.
 * Responsibilities:
 * - Operate deterministically on canonical source or build output so repeated runs produce stable results.
 * - Surface invalid input or contract drift as explicit failures instead of silently masking it.
 * - Keep path assumptions synchronized with repository manifests and source-layout ownership.
 * Execution context: Node.js CLI during development, generation, build, CI, or repository maintenance.
 * Connected files:
 * - config/repository/root-policy.json
 * - package.json
 * - scripts/clean-vite-public-output.cjs
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
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

/**
 * Function contract: gitTrackedFiles
 * Purpose: Implement the git tracked files responsibility owned by the generate file catalog repository tool.
 * Inputs: None; derives required state from the enclosing module/runtime context.
 * Side effects: spawns child processes.
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function gitTrackedFiles() {
  const result = spawnSync('git', ['ls-files', '-z'], { cwd: ROOT, encoding: 'utf8' });
  if (result.status !== 0) throw new Error(`git ls-files failed: ${result.stderr || result.stdout}`);
  return result.stdout.split('\0').filter(Boolean).sort();
}

/**
 * Function contract: humanize
 * Purpose: Implements the humanize responsibility for this module.
 * Inputs: value.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: humanize
 * Purpose: Implement the humanize responsibility owned by the generate file catalog repository tool.
 * Inputs: `value`: input value being transformed or evaluated
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function humanize(value) {
  return value
    .replace(/\.[^.]+$/, '')
    .replace(/^blog-/, '')
    .replace(/^project-/, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, /** Callback contract: Processes the callback step for value
    .replace(/\.[^.]+$/, '')
    .replace(/^blog /, '')
    .replace(/^project /, '')
    .replace(/[ ]+/g, ' ') without leaking orchestration details to the caller. Inputs: letter. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Perform the local callback step required by the enclosing generate file catalog repository tool operation. Inputs: `letter`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ (letter) => letter.toUpperCase());
}

/**
 * Function contract: isTextFile
 * Purpose: Implements the is text file responsibility for this module.
 * Inputs: file.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: isTextFile
 * Purpose: Determine whether text file satisfies the condition represented by this generate file catalog repository tool.
 * Inputs: `file`: repository-relative or absolute file path being processed
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Boolean indicating whether text file satisfies the documented condition.
 */
function isTextFile(file) {
  const base = path.posix.basename(file);
  return TEXT_BASENAMES.has(base) || TEXT_EXTENSIONS.has(path.posix.extname(file).toLowerCase());
}

/**
 * Function contract: readText
 * Purpose: Retrieves read text and returns it in the form expected by its caller.
 * Inputs: file.
 * Side effects: may read or write repository/filesystem state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: readText
 * Purpose: Return text from the supplied inputs or current generate file catalog repository tool state.
 * Inputs: `file`: repository-relative or absolute file path being processed
 * Side effects: reads repository/filesystem state.
 * Returns: The requested text; early-return/empty-state behavior follows the explicit branches in this function.
 */
function readText(file) {
  const absolute = path.join(ROOT, file);
  const stat = fs.statSync(absolute);
  if (stat.size > MAX_SCAN_BYTES || !isTextFile(file)) return null;
  return fs.readFileSync(absolute, 'utf8');
}

/**
 * Function contract: purposeFor
 * Purpose: Implements the purpose for responsibility for this module.
 * Inputs: file.
 * Side effects: may read or update browser DOM/state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: purposeFor
 * Purpose: Implement the purpose for responsibility owned by the generate file catalog repository tool.
 * Inputs: `file`: repository-relative or absolute file path being processed
 * Side effects: reads or updates DOM/browser state.
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
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

/**
 * Function contract: defaultConnections
 * Purpose: Implements the default connections responsibility for this module.
 * Inputs: file.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: defaultConnections
 * Purpose: Implement the default connections responsibility owned by the generate file catalog repository tool.
 * Inputs: `file`: repository-relative or absolute file path being processed
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Array containing the values selected or transformed by this function.
 */
function defaultConnections(file) {
  if (file.startsWith('src/pages/')) return ['config/canonical-routes.json', 'scripts/repository/source-layout.cjs', 'vite.config.ts'];
  if (file.startsWith('src/compat/legacy-pages/')) return ['vite.config.ts', 'scripts/clean-vite-public-output.cjs', 'scripts/repository/source-layout.cjs'];
  if (file.startsWith('blog/')) return ['config/canonical-routes.json', 'vite.config.ts', 'scripts/build-dist.cjs'];
  if (file.startsWith('src/scripts/')) return ['src/scripts/entrypoints/main.js', 'src/runtime/script.js'];
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

/**
 * Function contract: escapeCell
 * Purpose: Implements the escape cell responsibility for this module.
 * Inputs: value.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: escapeCell
 * Purpose: Implement the escape cell responsibility owned by the generate file catalog repository tool.
 * Inputs: `value`: input value being transformed or evaluated
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function escapeCell(value) {
  return String(value).replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');
}

const files = gitTrackedFiles().filter(/** Callback contract: Processes the callback step for git tracked files() without leaking orchestration details to the caller. Inputs: file. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Decide whether the current item should remain in the filtered result used by the enclosing operation. Inputs: `file`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ (file) => file !== OUTPUT && !TEMPORARY_HELPERS.has(file));
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

/**
 * Function contract: directConnections
 * Purpose: Implements the direct connections responsibility for this module.
 * Inputs: file.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: directConnections
 * Purpose: Implement the direct connections responsibility owned by the generate file catalog repository tool.
 * Inputs: `file`: repository-relative or absolute file path being processed
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
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

const rows = files.map(/** Callback contract: Processes the callback step for files without leaking orchestration details to the caller. Inputs: file. Side effects: no obvious external side effect beyond invoked dependencies. Returns a value to the invoking API. */ /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `file`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Boolean predicate result consumed by the caller. */ (file) => {
  const direct = directConnections(file);
  const connections = [...new Set([...direct, ...defaultConnections(file)])]
    .filter(/** Callback contract: Processes the callback step for [...new set([...direct, ...default connections(file)])] without leaking orchestration details to the caller. Inputs: item. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Decide whether the current item should remain in the filtered result used by the enclosing operation. Inputs: `item`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ (item) => item !== file)
    .slice(0, 4);
  return `| \`${escapeCell(file)}\` | ${escapeCell(purposeFor(file))} | ${connections.map(/** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `item`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ (item) => `\`${escapeCell(item)}\``).join(', ')} |`;
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
