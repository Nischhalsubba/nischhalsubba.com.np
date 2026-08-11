/**
 * @fileoverview scripts/repository/generate-file-catalog.cjs
 * Purpose: Generate a maintainer-friendly catalog of tracked repository files, their responsibilities, and a small set of useful connections.
 * Responsibilities:
 * - Read the tracked Git tree rather than maintaining a separate file inventory.
 * - Classify files by repository ownership and ecosystem role.
 * - Find lightweight textual references for useful dependency hints.
 * - Write `docs/repository/file-catalog.md` deterministically.
 * Execution context: Node.js repository-maintenance command exposed through `npm run docs:file-catalog` and the validation workflow.
 * Connected files:
 * - docs/repository/file-catalog.md
 * - docs/repository/file-map.md
 * - config/repository/root-policy.json
 * - package.json
 * Maintenance: Keep classification rules broad and responsibility-based. Add exact special cases only when they materially improve the catalog and represent current repository architecture.
 */
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '../..');
const OUTPUT = 'docs/repository/file-catalog.md';
const MAX_SCAN_BYTES = 512 * 1024;
const TEMPORARY_HELPERS = new Set([
  '.github/workflows/generate-file-catalog.yml',
  '.github/workflows/generate-file-catalog-pr.yml',
]);
const TEXT_EXTENSIONS = new Set([
  '.css', '.cssfrag', '.html', '.js', '.jsx', '.cjs', '.mjs', '.json', '.jsonc', '.md', '.ts', '.tsx',
  '.txt', '.xml', '.yml', '.yaml', '.toml', '.svg', '.webmanifest',
]);
const TEXT_BASENAMES = new Set([
  '.editorconfig', '.gitignore', '_headers', '_redirects', 'robots.txt', 'sitemap.xml',
]);

/**
 * Function contract: gitTrackedFiles
 * Purpose: Read the exact tracked file list for the current Git checkout.
 * Inputs: None.
 * Side effects: Runs `git ls-files` in the repository root.
 * Returns: Sorted array of repository-relative tracked file paths.
 */
function gitTrackedFiles() {
  const result = spawnSync('git', ['ls-files', '-z'], { cwd: ROOT, encoding: 'utf8' });
  if (result.status !== 0) {
    throw new Error(`git ls-files failed: ${result.stderr || result.stdout}`);
  }
  return result.stdout.split('\0').filter(Boolean).sort();
}

/**
 * Function contract: humanize
 * Purpose: Convert a filename or identifier into a readable title used in generated descriptions.
 * Inputs: `value` - Filename, path basename, or identifier.
 * Side effects: None.
 * Returns: Space-separated title-cased text with common route prefixes and punctuation removed.
 */
function humanize(value) {
  const normalized = value
    .replace(/\.[^.]+$/, '')
    .replace(/^blog-/, '')
    .replace(/^project-/, '')
    .replace(/[-_]+/g, ' ')
    .trim();

  const words = normalized.split(/\s+/);
  for (let index = 0; index < words.length; index += 1) {
    const word = words[index];
    if (!word) continue;
    words[index] = `${word.charAt(0).toUpperCase()}${word.slice(1)}`;
  }
  return words.join(' ');
}

/**
 * Function contract: isTextFile
 * Purpose: Determine whether a tracked file is safe and useful to scan as UTF-8 text for dependency hints.
 * Inputs: `file` - Repository-relative file path.
 * Side effects: None.
 * Returns: `true` for recognized text files and `false` otherwise.
 */
function isTextFile(file) {
  const base = path.posix.basename(file);
  const extension = path.posix.extname(file).toLowerCase();
  return TEXT_BASENAMES.has(base) || TEXT_EXTENSIONS.has(extension);
}

/**
 * Function contract: readText
 * Purpose: Read a reasonably sized text file for reference scanning while skipping binary or unusually large files.
 * Inputs: `file` - Repository-relative file path.
 * Side effects: Reads file metadata and optionally file contents from disk.
 * Returns: UTF-8 contents when eligible, otherwise `null`.
 */
function readText(file) {
  const absolute = path.join(ROOT, file);
  const stat = fs.statSync(absolute);
  if (stat.size > MAX_SCAN_BYTES || !isTextFile(file)) return null;
  return fs.readFileSync(absolute, 'utf8');
}

/**
 * Function contract: purposeFor
 * Purpose: Describe the primary repository responsibility of one tracked file using current folder ownership rules.
 * Inputs: `file` - Repository-relative tracked file path.
 * Side effects: None.
 * Returns: Concise human-readable purpose statement.
 */
function purposeFor(file) {
  const base = path.posix.basename(file);
  const extension = path.posix.extname(file).toLowerCase();

  const exact = {
    '.editorconfig': 'Shared editor formatting defaults.',
    '.gitignore': 'Git ignore rules for dependencies, generated output, local files, and temporary compatibility source.',
    'README.md': 'Repository overview, development workflow, architecture, validation, and deployment guidance.',
    'package.json': 'Node dependency declarations and the authoritative development, build, audit, and QA command surface.',
    'package-lock.json': 'Locked npm dependency graph used for reproducible installs.',
    'tsconfig.json': 'TypeScript and editor compiler configuration.',
    'vercel.json': 'Secondary Vercel deployment compatibility configuration.',
    'vite.config.ts': 'Vite multi-page build configuration.',
    'wrangler.jsonc': 'Cloudflare Worker, static-asset, and binding configuration.',
    'src/worker.js': 'Cloudflare Worker request router for static delivery, redirects, and API behavior.',
    'src/runtime/script.js': 'Stable browser runtime compatibility entry that loads the organized runtime.',
    'src/styles/style.css': 'Canonical production stylesheet source.',
    'config/canonical-routes.json': 'Canonical public route and legacy redirect contract.',
    'config/repository/root-policy.json': 'Repository-root allow-list and required documentation policy.',
    'docs/repository/file-map.md': 'Human-maintained ownership map for repository folders and compatibility behavior.',
    'docs/repository/file-catalog.md': 'Generated catalog of tracked files, responsibilities, and useful connections.',
    'docs/deployment-safety.md': 'Production deployment and homepage safety constraints.',
  };
  if (exact[file]) return exact[file];

  if (file.startsWith('.github/workflows/')) return `GitHub Actions workflow for ${humanize(base)}.`;
  if (file.startsWith('src/pages/core/')) return `Canonical ${humanize(base)} primary-page HTML source.`;
  if (file.startsWith('src/pages/projects/')) return `Canonical ${humanize(base)} project or case-study HTML source.`;
  if (file.startsWith('src/pages/services/')) return `Canonical ${humanize(base)} service-page HTML source.`;
  if (file.startsWith('src/compat/legacy-pages/')) return `Historical ${humanize(base)} page source retained for active build compatibility.`;
  if (file.startsWith('blog/') && extension === '.html') {
    return base === 'index.html' ? 'Canonical writing index HTML source.' : `Canonical ${humanize(base)} article HTML source.`;
  }

  if (file.startsWith('src/scripts/entrypoints/')) return `Browser runtime entrypoint for ${humanize(base)} initialization.`;
  if (file.startsWith('src/scripts/features/')) return `Browser feature module for ${humanize(base)} behavior.`;
  if (file.startsWith('src/scripts/shared/')) return `Shared browser helper for ${humanize(base)}.`;
  if (file.startsWith('src/styles/systems/')) return `Reusable style-system source for ${humanize(base)}.`;
  if (file.startsWith('src/styles/fragments/')) return `Composable style fragment for ${humanize(base)}.`;
  if (file.startsWith('src/styles/')) return `Frontend style source for ${humanize(base)}.`;
  if (file.startsWith('src/content/')) return `Structured content source for ${humanize(base)}.`;
  if (file.startsWith('src/discovery/')) return `Crawler, deployment-header, manifest, or ownership source: ${base}.`;
  if (file.startsWith('src/generated/')) return `Generated source consumed by the runtime or deployment pipeline: ${humanize(base)}.`;

  if (file.startsWith('scripts/repository/')) return `Repository structure and documentation utility for ${humanize(base)}.`;
  if (file.startsWith('scripts/')) {
    if (/audit|check|verify|validate|smoke|test/.test(base)) return `Quality or verification script for ${humanize(base)}.`;
    if (/generate|compose|copy|build|compile/.test(base)) return `Build or generation script for ${humanize(base)}.`;
    if (/apply|finalize|normalize|enforce|fix|polish|rewrite|restore|repair|redesign|lock|ensure/.test(base)) return `Deterministic transformation or maintenance stage for ${humanize(base)}.`;
    return `Build or maintenance utility for ${humanize(base)}.`;
  }

  if (file.startsWith('config/')) return `Structured repository or build configuration for ${humanize(base)}.`;
  if (file.startsWith('data/')) return `Structured data input for ${humanize(base)}.`;
  if (file.startsWith('tests/')) return `Automated QA fixture, baseline, helper, or test for ${humanize(base)}.`;

  if (file.startsWith('assets/')) {
    if (['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg', '.avif'].includes(extension)) {
      return `Authored visual asset used by portfolio or generated presentation surfaces: ${humanize(base)}.`;
    }
    if (['.pdf', '.docx'].includes(extension)) return `Downloadable document asset: ${humanize(base)}.`;
    return `Authored static asset for ${humanize(base)}.`;
  }

  if (file.startsWith('public/')) return `Static passthrough deployment resource for ${humanize(base)}.`;
  if (file.startsWith('api/')) return `Deployment-compatible API module for ${humanize(base)}.`;
  if (file.startsWith('functions/api/')) return `Cloudflare-compatible API handler for ${humanize(base)}.`;
  if (file.startsWith('docs/')) return `Repository documentation for ${humanize(base)}.`;

  if (base === 'README.md') return `Folder-level ownership and usage documentation for ${path.posix.dirname(file) || 'repository root'}.`;
  if (extension === '.md') return `Project documentation for ${humanize(base)}.`;
  if (extension === '.json' || extension === '.jsonc') return `Structured configuration or data for ${humanize(base)}.`;
  if (['.js', '.jsx', '.cjs', '.mjs', '.ts', '.tsx'].includes(extension)) return `Executable source or tooling module for ${humanize(base)}.`;
  if (extension === '.css' || extension === '.cssfrag') return `Style source for ${humanize(base)}.`;
  if (extension === '.html') return `HTML source for ${humanize(base)}.`;
  return `Repository support file for ${humanize(base) || base}.`;
}

/**
 * Function contract: defaultConnections
 * Purpose: Provide architecture-based fallback connections when a file has few or no direct textual references.
 * Inputs: `file` - Repository-relative tracked file path.
 * Side effects: None.
 * Returns: Array of related paths or ownership surfaces.
 */
function defaultConnections(file) {
  if (file.startsWith('src/pages/')) return ['config/canonical-routes.json', 'scripts/repository/source-layout.cjs', 'vite.config.ts'];
  if (file.startsWith('src/compat/legacy-pages/')) return ['vite.config.ts', 'scripts/clean-vite-public-output.cjs', 'scripts/repository/source-layout.cjs'];
  if (file.startsWith('blog/')) return ['config/canonical-routes.json', 'scripts/build-dist.cjs'];
  if (file.startsWith('src/scripts/')) return ['src/scripts/entrypoints/main.js', 'src/runtime/script.js'];
  if (file.startsWith('src/styles/')) return ['scripts/compile-single-stylesheet.cjs', 'scripts/audit-css-architecture.cjs'];
  if (file.startsWith('src/content/')) return ['scripts/', 'src/pages/'];
  if (file.startsWith('src/discovery/')) return ['scripts/generate-seo-discovery.cjs', 'scripts/copy-static-assets.cjs'];
  if (file.startsWith('src/generated/')) return ['scripts/generate-seo-discovery.cjs', 'src/worker.js'];
  if (file.startsWith('scripts/repository/')) return ['package.json', 'config/repository/root-policy.json'];
  if (file.startsWith('scripts/')) return ['scripts/build-dist.cjs', 'package.json'];
  if (file.startsWith('.github/workflows/')) return ['package.json', 'scripts/'];
  if (file.startsWith('config/')) return ['scripts/', 'package.json'];
  if (file.startsWith('data/')) return ['scripts/', 'src/content/'];
  if (file.startsWith('tests/')) return ['.github/workflows/', 'scripts/'];
  if (file.startsWith('assets/')) return ['scripts/copy-static-assets.cjs', 'src/pages/'];
  if (file.startsWith('public/')) return ['scripts/copy-static-assets.cjs', 'deployment output'];
  if (file.startsWith('api/') || file.startsWith('functions/api/')) return ['src/worker.js', 'contact form/runtime'];
  if (file.startsWith('docs/')) return ['README.md', 'related source or tooling owner'];
  return ['docs/repository/file-map.md'];
}

/**
 * Function contract: directConnections
 * Purpose: Find a small set of tracked text files that directly mention a file path or uniquely named basename.
 * Inputs: `file` - Target tracked file; `textFiles` - Map of scanned file contents; `basenameCounts` - occurrence counts for basenames.
 * Side effects: None.
 * Returns: Up to four repository-relative files containing a likely direct reference.
 */
function directConnections(file, textFiles, basenameCounts) {
  const base = path.posix.basename(file);
  const uniqueBase = basenameCounts.get(base) === 1 && base.length >= 5;
  const matches = [];

  for (const [candidate, content] of textFiles) {
    if (candidate === file) continue;
    if (content.includes(file) || (uniqueBase && content.includes(base))) {
      matches.push(candidate);
      if (matches.length >= 4) break;
    }
  }

  return matches;
}

/**
 * Function contract: escapeCell
 * Purpose: Escape table-sensitive characters before writing generated Markdown cells.
 * Inputs: `value` - Cell value to serialize.
 * Side effects: None.
 * Returns: Single-line Markdown-table-safe text.
 */
function escapeCell(value) {
  return String(value).replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');
}

/**
 * Function contract: main
 * Purpose: Build the tracked-file inventory, derive purposes and connections, and write the generated Markdown catalog.
 * Inputs: None.
 * Side effects: Runs Git, reads eligible tracked files, and writes `docs/repository/file-catalog.md`.
 * Returns: Nothing.
 */
function main() {
  const tracked = gitTrackedFiles();
  const files = [];
  for (const file of tracked) {
    if (file === OUTPUT || TEMPORARY_HELPERS.has(file)) continue;
    files.push(file);
  }

  const basenameCounts = new Map();
  for (const file of files) {
    const base = path.posix.basename(file);
    basenameCounts.set(base, (basenameCounts.get(base) || 0) + 1);
  }

  const textFiles = new Map();
  for (const file of files) {
    try {
      const content = readText(file);
      if (content !== null) textFiles.set(file, content);
    } catch {
      // Files that cannot be scanned still receive architecture-based connections.
    }
  }

  const rows = [];
  for (const file of files) {
    const connections = [];
    const seen = new Set();
    const direct = directConnections(file, textFiles, basenameCounts);
    const defaults = defaultConnections(file);

    for (const item of direct) {
      if (item === file || seen.has(item)) continue;
      seen.add(item);
      connections.push(item);
    }
    for (const item of defaults) {
      if (item === file || seen.has(item)) continue;
      seen.add(item);
      connections.push(item);
    }

    const connectionCells = [];
    for (let index = 0; index < connections.length && index < 4; index += 1) {
      connectionCells.push(`\`${escapeCell(connections[index])}\``);
    }

    rows.push(`| \`${escapeCell(file)}\` | ${escapeCell(purposeFor(file))} | ${connectionCells.join(', ')} |`);
  }

  const output = [
    '# Tracked File Catalog',
    '',
    '> Generated by `scripts/repository/generate-file-catalog.cjs` from the tracked Git tree. Update source ownership or generator rules rather than editing catalog rows by hand.',
    '',
    `Tracked files cataloged: ${files.length}`,
    '',
    '| File | Purpose | Useful connections |',
    '|---|---|---|',
    ...rows,
    '',
  ].join('\n');

  fs.mkdirSync(path.dirname(path.join(ROOT, OUTPUT)), { recursive: true });
  fs.writeFileSync(path.join(ROOT, OUTPUT), output, 'utf8');
  console.log(`[file-catalog] Wrote ${OUTPUT} with ${files.length} tracked files.`);
}

main();
