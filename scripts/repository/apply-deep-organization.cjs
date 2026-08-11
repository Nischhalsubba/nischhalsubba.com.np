const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const ts = require('typescript');

/**
 * @fileoverview One-shot migration for the repository's second organization pass.
 *
 * Responsibilities:
 * - Split broad page, runtime-feature, and stylesheet buckets into responsibility-based subfolders.
 * - Rewrite relative module imports and literal repository-path references after every move.
 * - Add structured file headers to authored code without modifying generated/vendor outputs.
 * - Add explanatory contracts to JavaScript/TypeScript functions and callbacks using syntax-aware parsing.
 * - Refresh folder documentation and wire a permanent documentation audit into normal validation.
 *
 * Connected files:
 * - config/repository/code-documentation-policy.json: permanent documentation ownership rules.
 * - scripts/repository/audit-code-documentation.cjs: permanent CI enforcement after this migration is removed.
 * - scripts/repository/source-layout.cjs: consumes organized page/style/runtime paths for build compatibility.
 * - package.json: receives the permanent `audit:code-docs` validation command.
 *
 * Execution context: Node.js in a temporary GitHub Actions migration workflow on a dedicated branch.
 * Maintenance notes: This script is intentionally deleted after it completes. Future organization changes belong in normal reviewed code.
 */

const ROOT = path.resolve(__dirname, '../..');
const POSIX = path.posix;
const TEXT_EXTENSIONS = new Set([
  '.cjs', '.css', '.cssfrag', '.html', '.js', '.jsx', '.json', '.jsonc', '.md', '.mjs',
  '.ts', '.tsx', '.txt', '.xml', '.yaml', '.yml', '.webmanifest',
]);
const CODE_HEADER_EXTENSIONS = new Set([
  '.cjs', '.css', '.cssfrag', '.html', '.js', '.jsx', '.mjs', '.ts', '.tsx', '.yaml', '.yml',
]);
const FUNCTION_EXTENSIONS = new Set(['.cjs', '.js', '.jsx', '.mjs', '.ts', '.tsx']);
const EXCLUDED_PREFIXES = [
  'assets/', 'dist/', 'node_modules/', 'public/', 'src/generated/', 'tests/visual/baselines/',
];
const HEADER_MARKER = '@fileoverview';

const FEATURE_CATEGORY_BY_NAME = new Map(Object.entries({
  'about-contact-standards': 'accessibility',
  'audit-remediations': 'accessibility',
  'ui-audit-resolutions': 'accessibility',
  'analytics-events': 'analytics',
  'article-layout': 'content',
  'blog-visuals': 'content',
  'content-polish': 'content',
  'editorial-design': 'content',
  'filters': 'content',
  'list-spacing': 'content',
  'microcopy-polish': 'content',
  'contact-form': 'forms',
  'agent-browser-contract': 'system',
  'design-system-standards': 'system',
  'experience-system': 'system',
  'agent-portfolio': 'portfolio',
  'portfolio-case-studies': 'portfolio',
  'portfolio-case-study-coverage': 'portfolio',
  'portfolio-upgrades': 'portfolio',
  'project-images': 'portfolio',
  'case-study-layout-fixes': 'layout',
  'contact-page-polish': 'layout',
  'final-spacing-nav-proof': 'layout',
  'global-styles': 'layout',
  'layout-integrity': 'layout',
  'layout-rescue': 'layout',
  'layout-system-uniformity': 'layout',
  'light-palette-lock': 'layout',
  'mobile-header-icon-proof': 'layout',
  'page-experience': 'layout',
  'section-rhythm-fix': 'layout',
  'site-consistency': 'layout',
  'site-footer': 'layout',
  'typography-refinement': 'layout',
  'viewport-responsive-polish': 'layout',
  'mobile-menu': 'navigation',
  'nav-consistency': 'navigation',
  'navigation': 'navigation',
  'page-transitions': 'navigation',
  'resume': 'navigation',
  'share': 'navigation',
  'theme': 'navigation',
  'grid-canvas': 'motion',
  'motion-system': 'motion',
  'motion': 'motion',
  'pointer-glow': 'motion',
  'signal-portrait': 'motion',
}));

const STYLE_RENAMES = new Map([
  ['src/styles/agent-compat.cssfrag', 'src/styles/fragments/agent/compatibility.cssfrag'],
  ['src/styles/agent-polish.cssfrag', 'src/styles/fragments/agent/polish.cssfrag'],
  ['src/styles/agent-portfolio-1.cssfrag', 'src/styles/fragments/agent/portfolio-foundation.cssfrag'],
  ['src/styles/agent-portfolio-2.cssfrag', 'src/styles/fragments/agent/portfolio-components.cssfrag'],
  ['src/styles/agent-portfolio-3.cssfrag', 'src/styles/fragments/agent/portfolio-finishing.cssfrag'],
  ['src/styles/agent-responsive-hardening.cssfrag', 'src/styles/fragments/agent/responsive-hardening.cssfrag'],
  ['src/styles/agent-sticky-cascade-lock.cssfrag', 'src/styles/fragments/agent/sticky-cascade-lock.cssfrag'],
  ['src/styles/case-study-system.css', 'src/styles/systems/case-study.css'],
  ['src/styles/inner-page-system.css', 'src/styles/systems/inner-pages.css'],
]);

/**
 * Executes a Git command in the repository root and returns stdout.
 *
 * Inputs: Git CLI arguments.
 * Side effects: may read or mutate the working tree depending on the command.
 * Returns: trimmed stdout. Throws when Git exits unsuccessfully.
 */
function runGit(args) {
  const result = spawnSync('git', args, { cwd: ROOT, encoding: 'utf8' });
  if (result.status !== 0) {
    throw new Error(`git ${args.join(' ')} failed:\n${result.stderr || result.stdout}`);
  }
  return result.stdout.trim();
}

/**
 * Lists tracked repository files in deterministic order.
 *
 * Inputs: none.
 * Side effects: executes `git ls-files`.
 * Returns: sorted repository-relative paths.
 */
function trackedFiles() {
  const output = runGit(['ls-files', '-z']);
  return output.split('\0').filter(Boolean).sort();
}

/**
 * Converts a filename or symbol into readable words for generated documentation.
 *
 * Inputs: filename, path segment, or identifier.
 * Side effects: none.
 * Returns: title-cased human-readable phrase.
 */
function humanize(value) {
  return String(value)
    .replace(/\.[^.]+$/, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[-_]+/g, ' ')
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

/**
 * Infers a runtime-feature category for files not explicitly listed in the curated map.
 *
 * Inputs: feature basename without extension.
 * Side effects: none.
 * Returns: stable domain folder name.
 */
function inferFeatureCategory(name) {
  if (/audit|accessib|contrast|standard/.test(name)) return 'accessibility';
  if (/analytic|event/.test(name)) return 'analytics';
  if (/contact|form/.test(name)) return 'forms';
  if (/portfolio|project|case-study/.test(name)) return 'portfolio';
  if (/nav|menu|theme|resume|share|transition/.test(name)) return 'navigation';
  if (/motion|canvas|pointer|signal/.test(name)) return 'motion';
  if (/blog|article|content|editorial|copy|filter|list/.test(name)) return 'content';
  if (/layout|spacing|responsive|typography|palette|header|footer|site/.test(name)) return 'layout';
  return 'system';
}

/**
 * Builds the complete path-move plan for pages, runtime entrypoints/features, shared helpers, and styles.
 *
 * Inputs: current tracked file list.
 * Side effects: none.
 * Returns: Map of old repository paths to new repository paths.
 */
function buildMoveMap(files) {
  const moves = new Map(STYLE_RENAMES);

  for (const file of files) {
    if (file === 'src/scripts/main.js') moves.set(file, 'src/scripts/entrypoints/main.js');
    if (file === 'src/scripts/agent-main.js') moves.set(file, 'src/scripts/entrypoints/agent-main.js');
    if (file === 'src/scripts/utils/dom.js') moves.set(file, 'src/scripts/shared/dom.js');

    const featureMatch = file.match(/^src\/scripts\/features\/([^/]+)\.js$/);
    if (featureMatch) {
      const featureName = featureMatch[1];
      const category = FEATURE_CATEGORY_BY_NAME.get(featureName) || inferFeatureCategory(featureName);
      moves.set(file, `src/scripts/features/${category}/${featureName}.js`);
    }

    const pageMatch = file.match(/^src\/pages\/([^/]+\.html)$/);
    if (pageMatch) {
      const basename = pageMatch[1];
      if (basename.startsWith('project-')) {
        moves.set(file, `src/pages/projects/${basename}`);
      } else if (/^(figma-design-systems|product-design-nepal|saas-ux-designer|ux-audit|web3-ux-designer|website-ux-design)\.html$/.test(basename)) {
        moves.set(file, `src/pages/services/${basename}`);
      } else if (basename !== 'README.md') {
        moves.set(file, `src/pages/core/${basename}`);
      }
    }
  }

  return moves;
}

/**
 * Applies one tracked-file move while creating its destination directory first.
 *
 * Inputs: source and destination repository paths.
 * Side effects: creates directories and executes `git mv`.
 * Returns: nothing.
 */
function moveTrackedFile(from, to) {
  const source = path.join(ROOT, from);
  if (!fs.existsSync(source)) return;
  fs.mkdirSync(path.dirname(path.join(ROOT, to)), { recursive: true });
  runGit(['mv', from, to]);
}

/**
 * Resolves a relative module specifier against the file's pre-migration location.
 *
 * Inputs:
 * - oldFile: source path before moves.
 * - specifier: import/require string.
 * - moveMap: old-to-new path map.
 * - originalFiles: set of original tracked files.
 * Side effects: none.
 * Returns: old target path, or null when the specifier is external/unresolved.
 */
function resolveOldModuleTarget(oldFile, specifier, moveMap, originalFiles) {
  if (!specifier.startsWith('.')) return null;
  const rawTarget = POSIX.normalize(POSIX.join(POSIX.dirname(oldFile), specifier));
  const candidates = [
    rawTarget,
    `${rawTarget}.js`, `${rawTarget}.mjs`, `${rawTarget}.cjs`, `${rawTarget}.ts`, `${rawTarget}.tsx`,
    POSIX.join(rawTarget, 'index.js'), POSIX.join(rawTarget, 'index.ts'),
  ];
  return candidates.find((candidate) => originalFiles.has(candidate) || moveMap.has(candidate)) || null;
}

/**
 * Computes the new relative module specifier after caller and/or target files move.
 *
 * Inputs: new caller path and new target path.
 * Side effects: none.
 * Returns: normalized relative specifier beginning with `./` or `../`.
 */
function relativeSpecifier(newFile, newTarget) {
  let value = POSIX.relative(POSIX.dirname(newFile), newTarget);
  if (!value.startsWith('.')) value = `./${value}`;
  return value;
}

/**
 * Rewrites static imports, dynamic imports, and CommonJS require calls after path moves.
 *
 * Inputs: source text, old/new caller paths, move map, and original tracked-file set.
 * Side effects: none.
 * Returns: rewritten source text.
 */
function rewriteModuleSpecifiers(source, oldFile, newFile, moveMap, originalFiles) {
  const patterns = [
    /(\bfrom\s*['"])([^'"]+)(['"])/g,
    /(\bimport\s*\(\s*['"])([^'"]+)(['"]\s*\))/g,
    /(\brequire\s*\(\s*['"])([^'"]+)(['"]\s*\))/g,
    /(\bimport\s*['"])([^'"]+)(['"])/g,
  ];

  let output = source;
  for (const pattern of patterns) {
    output = output.replace(pattern, (whole, prefix, specifier, suffix) => {
      const oldTarget = resolveOldModuleTarget(oldFile, specifier, moveMap, originalFiles);
      if (!oldTarget) return whole;
      const newTarget = moveMap.get(oldTarget) || oldTarget;
      return `${prefix}${relativeSpecifier(newFile, newTarget)}${suffix}`;
    });
  }
  return output;
}

/**
 * Rewrites literal repository paths mentioned by build scripts, docs, configuration, and tests.
 *
 * Inputs: source text and path move map.
 * Side effects: none.
 * Returns: text with exact old repository paths replaced by their new canonical paths.
 */
function rewriteLiteralPaths(source, moveMap) {
  let output = source;
  const ordered = [...moveMap.entries()].sort((a, b) => b[0].length - a[0].length);
  for (const [from, to] of ordered) output = output.split(from).join(to);
  return output;
}

/**
 * Determines whether a file is safe and useful to treat as plain text during migration.
 *
 * Inputs: repository-relative path.
 * Side effects: none.
 * Returns: true for supported text formats and conventional text basenames.
 */
function isTextFile(file) {
  const extension = path.extname(file).toLowerCase();
  return TEXT_EXTENSIONS.has(extension) || ['.gitignore', '.editorconfig', '_headers', '_redirects'].includes(path.basename(file));
}

/**
 * Determines whether the file belongs to generated/vendor output excluded from manual documentation.
 *
 * Inputs: repository-relative path.
 * Side effects: none.
 * Returns: true for excluded prefixes.
 */
function isDocumentationExcluded(file) {
  return EXCLUDED_PREFIXES.some((prefix) => file.startsWith(prefix));
}

/**
 * Generates a concise, file-specific purpose sentence used in structured headers.
 *
 * Inputs: repository-relative path after migration.
 * Side effects: none.
 * Returns: purpose sentence ending in a period.
 */
function purposeFor(file) {
  const base = path.basename(file);
  const label = humanize(base);
  const exact = {
    'src/scripts/entrypoints/main.js': 'Bootstraps the standard browser runtime and loads global/page-specific feature modules in a controlled order.',
    'src/scripts/entrypoints/agent-main.js': 'Bootstraps the agent-redesign browser runtime and conditionally loads contact and portfolio enhancement modules.',
    'src/scripts/shared/dom.js': 'Provides shared DOM readiness and browser-element helpers used by runtime feature modules.',
    'src/runtime/script.js': 'Stable compatibility entrypoint that connects historical page references to the organized browser runtime.',
    'src/worker.js': 'Routes Cloudflare Worker requests for static assets, canonical redirects, and API behavior.',
    'scripts/build-dist.cjs': 'Defines the ordered production build pipeline and invokes every deterministic transformation stage.',
    'scripts/run-build-stages.cjs': 'Runs named build/generation stages with consistent logging, error handling, and process execution.',
    'vite.config.ts': 'Configures the Vite multi-page build, canonical URL transformations, and production asset behavior.',
  };
  if (exact[file]) return exact[file];
  if (file.startsWith('src/pages/core/')) return `Canonical HTML source for the ${label} core site route.`;
  if (file.startsWith('src/pages/projects/')) return `Canonical HTML source for the ${label} portfolio project case study.`;
  if (file.startsWith('src/pages/services/')) return `Canonical HTML source for the ${label} service/SEO landing page.`;
  const feature = file.match(/^src\/scripts\/features\/([^/]+)\/([^/]+)\.js$/);
  if (feature) return `Browser runtime feature in the ${feature[1]} domain responsible for ${humanize(feature[2]).toLowerCase()} behavior.`;
  if (file.startsWith('src/styles/fragments/')) return `Composable stylesheet fragment for ${label.toLowerCase()} rules assembled into the production stylesheet.`;
  if (file.startsWith('src/styles/systems/')) return `Reusable stylesheet system for ${label.toLowerCase()} surfaces.`;
  if (file === 'src/styles/style.css') return 'Canonical global stylesheet assembled and validated for all production routes.';
  if (file.startsWith('scripts/repository/')) return `Repository architecture and maintenance utility for ${label.toLowerCase()}.`;
  if (file.startsWith('scripts/')) return `Node-based build, content transformation, QA, or maintenance tool for ${label.toLowerCase()}.`;
  if (file.startsWith('api/') || file.startsWith('functions/api/')) return `Server-side API handler for ${label.toLowerCase()} behavior.`;
  if (file.startsWith('tests/')) return `Automated quality-assurance source for ${label.toLowerCase()}.`;
  if (file.startsWith('.github/workflows/')) return `GitHub Actions workflow orchestrating ${label.toLowerCase()}.`;
  if (file.startsWith('src/components/')) return `Reusable UI component implementing ${label}.`;
  if (file.startsWith('src/content/')) return `Structured content module providing ${label.toLowerCase()} data to generators/runtime code.`;
  if (file.startsWith('blog/') && file.endsWith('.html')) return `Canonical article HTML source for ${label}.`;
  return `Authored source file responsible for ${label}.`;
}

/**
 * Describes the execution/build context for a file so maintainers know where its behavior runs.
 *
 * Inputs: repository-relative path.
 * Side effects: none.
 * Returns: execution-context sentence.
 */
function executionContextFor(file) {
  if (file.startsWith('.github/workflows/')) return 'GitHub Actions automation.';
  if (file.startsWith('scripts/')) return 'Node.js CLI during local development, CI, build, or maintenance.';
  if (file === 'src/worker.js') return 'Cloudflare Workers runtime.';
  if (file.startsWith('api/') || file.startsWith('functions/api/')) return 'Serverless/API runtime.';
  if (file.startsWith('tests/')) return 'Automated test/audit runtime.';
  if (file.startsWith('src/scripts/')) return 'Browser ES module loaded by the portfolio runtime.';
  if (file.endsWith('.html')) return 'Static HTML source transformed/copy-built into production routes.';
  if (file.endsWith('.css') || file.endsWith('.cssfrag')) return 'Stylesheet source assembled or copied into production CSS.';
  return 'Repository build or application source.';
}

/**
 * Builds a reference index so file headers can list real connections rather than invented relationships.
 *
 * Inputs: tracked file list after moves.
 * Side effects: reads supported text files from disk.
 * Returns: Map of file path to source text.
 */
function buildTextIndex(files) {
  const index = new Map();
  for (const file of files) {
    if (!isTextFile(file) || isDocumentationExcluded(file)) continue;
    const absolute = path.join(ROOT, file);
    if (!fs.existsSync(absolute)) continue;
    const stat = fs.statSync(absolute);
    if (stat.size > 1024 * 1024) continue;
    index.set(file, fs.readFileSync(absolute, 'utf8'));
  }
  return index;
}

/**
 * Finds direct repository files that refer to a target path or its unique basename.
 *
 * Inputs: target file, tracked list, and text index.
 * Side effects: none.
 * Returns: up to four meaningful connected file paths.
 */
function connectionsFor(file, files, textIndex) {
  const basename = POSIX.basename(file);
  const sameBasenameCount = files.filter((candidate) => POSIX.basename(candidate) === basename).length;
  const references = [];
  for (const [candidate, source] of textIndex) {
    if (candidate === file) continue;
    if (source.includes(file) || (basename.length >= 6 && sameBasenameCount === 1 && source.includes(basename))) {
      references.push(candidate);
    }
    if (references.length >= 4) break;
  }

  const defaults = [];
  if (file.startsWith('src/scripts/')) defaults.push('src/runtime/script.js', 'src/scripts/entrypoints/main.js');
  if (file.startsWith('src/pages/')) defaults.push('config/canonical-routes.json', 'scripts/repository/source-layout.cjs');
  if (file.startsWith('src/styles/')) defaults.push('scripts/compile-single-stylesheet.cjs', 'scripts/audit-css-architecture.cjs');
  if (file.startsWith('scripts/')) defaults.push('package.json', 'scripts/build-dist.cjs');
  if (file.startsWith('tests/')) defaults.push('.github/workflows/browser-audit.yml');

  return [...new Set([...references, ...defaults])].filter((candidate) => candidate !== file).slice(0, 4);
}

/**
 * Builds the structured file header body shared across source languages.
 *
 * Inputs: file path and direct/ownership connections.
 * Side effects: none.
 * Returns: array of human-readable header lines without comment syntax.
 */
function headerLines(file, connections) {
  const purpose = purposeFor(file);
  return [
    `${HEADER_MARKER} ${file}`,
    `Purpose: ${purpose}`,
    'Responsibilities:',
    `- Own the behavior/content implied by this file's single responsibility.`,
    '- Keep public routes, build contracts, and imported module boundaries stable unless the connected owners are updated together.',
    `Execution context: ${executionContextFor(file)}`,
    'Connected files:',
    ...(connections.length ? connections.map((item) => `- ${item}`) : ['- No direct tracked-file reference was detected; ownership is folder/convention based.']),
    'Maintenance: Update this header when responsibility or dependencies change; generated/vendor files are documented at their source instead.',
  ];
}

/**
 * Adds or refreshes a structured file header while preserving shebangs, doctypes, and CSS charset rules.
 *
 * Inputs: file path, current source text, and connected-file paths.
 * Side effects: none.
 * Returns: source text with one standardized header near the start.
 */
function addFileHeader(file, source, connections) {
  if (source.slice(0, 5000).includes(HEADER_MARKER)) return source;
  const extension = path.extname(file).toLowerCase();
  const lines = headerLines(file, connections);
  let header;

  if (extension === '.html') {
    header = `<!--\n  ${lines.join('\n  ')}\n-->\n`;
    const doctype = source.match(/^<!DOCTYPE html>\s*/i);
    if (doctype) return `${doctype[0]}${header}${source.slice(doctype[0].length)}`;
    return `${header}${source}`;
  }

  if (extension === '.yaml' || extension === '.yml') {
    header = `${lines.map((line) => `# ${line}`).join('\n')}\n`;
    return `${header}${source}`;
  }

  header = `/**\n * ${lines.join('\n * ')}\n */\n`;
  if (source.startsWith('#!')) {
    const newline = source.indexOf('\n');
    return `${source.slice(0, newline + 1)}${header}${source.slice(newline + 1)}`;
  }
  if ((extension === '.css' || extension === '.cssfrag') && source.startsWith('@charset')) {
    const newline = source.indexOf('\n');
    return `${source.slice(0, newline + 1)}${header}${source.slice(newline + 1)}`;
  }
  return `${header}${source}`;
}

/**
 * Maps a filename to the TypeScript compiler parser mode used for syntax-aware function discovery.
 *
 * Inputs: repository-relative source path.
 * Side effects: none.
 * Returns: TypeScript ScriptKind.
 */
function scriptKindFor(file) {
  if (file.endsWith('.tsx')) return ts.ScriptKind.TSX;
  if (file.endsWith('.ts')) return ts.ScriptKind.TS;
  if (file.endsWith('.jsx')) return ts.ScriptKind.JSX;
  return ts.ScriptKind.JS;
}

/**
 * Returns a stable source label for a function-like AST node, including anonymous callback context.
 *
 * Inputs: function node, parent node, source file, and original source text.
 * Side effects: none.
 * Returns: readable function/callback label.
 */
function functionLabel(node, parent, sourceFile) {
  if (node.name && node.name.getText) return node.name.getText(sourceFile);
  if (ts.isConstructorDeclaration(node)) return 'constructor';
  if (parent && ts.isVariableDeclaration(parent) && parent.name) return parent.name.getText(sourceFile);
  if (parent && ts.isPropertyAssignment(parent) && parent.name) return parent.name.getText(sourceFile);
  if (parent && ts.isCallExpression(parent)) return `${parent.expression.getText(sourceFile)} callback`;
  if (parent && ts.isJsxExpression(parent) && parent.parent && ts.isJsxAttribute(parent.parent)) {
    return `${parent.parent.name.getText(sourceFile)} handler`;
  }
  return 'anonymous callback';
}

/**
 * Turns a function label into an intent sentence using common naming conventions.
 *
 * Inputs: function/callback label.
 * Side effects: none.
 * Returns: concise behavior sentence.
 */
function functionPurpose(label) {
  const plain = humanize(label.replace(/ callback$| handler$/i, ''));
  const lower = label.toLowerCase();
  if (lower.includes(' callback')) return `Processes the callback step for ${plain.toLowerCase()} without leaking orchestration details to the caller.`;
  if (lower.includes(' handler') || /^handle|^on[A-Z]/.test(label)) return `Handles ${plain.toLowerCase()} and coordinates the required state or UI response.`;
  if (/^get|^read|^load|^fetch/.test(lower)) return `Retrieves ${plain.toLowerCase()} and returns it in the form expected by its caller.`;
  if (/^set|^write|^update|^apply|^ensure|^enforce|^normalize|^polish|^finalize|^configure/.test(lower)) return `Applies ${plain.toLowerCase()} while preserving the surrounding repository/runtime contract.`;
  if (/^create|^build|^generate|^compose|^compile/.test(lower)) return `Creates ${plain.toLowerCase()} from the supplied inputs and repository state.`;
  if (/^audit|^validate|^verify|^check|^test/.test(lower)) return `Validates ${plain.toLowerCase()} and reports violations instead of silently accepting invalid state.`;
  if (/^remove|^clean|^delete/.test(lower)) return `Removes or cleans ${plain.toLowerCase()} while keeping required outputs intact.`;
  if (/^parse/.test(lower)) return `Parses ${plain.toLowerCase()} into the structured form consumed by downstream logic.`;
  if (/^resolve|^find|^locate/.test(lower)) return `Resolves ${plain.toLowerCase()} using the current inputs and repository/runtime context.`;
  return `Implements the ${plain.toLowerCase()} responsibility for this module.`;
}

/**
 * Summarizes observable side-effect categories from a function body without pretending to prove purity.
 *
 * Inputs: function body source text.
 * Side effects: none.
 * Returns: conservative side-effect summary.
 */
function sideEffectSummary(bodyText) {
  const effects = [];
  if (/\b(document|window)\b|classList|setAttribute|appendChild|innerHTML|textContent/.test(bodyText)) effects.push('may read or update browser DOM/state');
  if (/\bfs\.|writeFile|mkdir|rename|unlink|copyFile/.test(bodyText)) effects.push('may read or write repository/filesystem state');
  if (/\bfetch\s*\(|XMLHttpRequest|https?\./.test(bodyText)) effects.push('may perform network I/O');
  if (/localStorage|sessionStorage|cookie/.test(bodyText)) effects.push('may read or update browser persistence');
  if (/console\.|process\./.test(bodyText)) effects.push('may emit diagnostics or inspect process state');
  return effects.length ? effects.join('; ') : 'no obvious external side effect beyond invoked dependencies';
}

/**
 * Selects the most natural comment insertion position for a function-like AST node.
 *
 * Named variable functions are documented above their single-declaration statement; inline callbacks stay beside the expression.
 *
 * Inputs: function node and source file.
 * Side effects: none.
 * Returns: zero-based source offset.
 */
function documentationPosition(node, sourceFile) {
  let parent = node.parent;
  if (parent && ts.isVariableDeclaration(parent) && parent.parent && ts.isVariableDeclarationList(parent.parent)) {
    const declarations = parent.parent.declarations;
    if (declarations.length === 1 && parent.parent.parent) return parent.parent.parent.getStart(sourceFile);
  }
  return node.getStart(sourceFile);
}

/**
 * Detects whether the generated contract marker already precedes a function/documentation position.
 *
 * Inputs: source text and zero-based position.
 * Side effects: none.
 * Returns: true when a prior migration/documented contract is immediately nearby.
 */
function hasFunctionContract(source, position) {
  const prefix = source.slice(Math.max(0, position - 1600), position);
  return /(?:Function contract|Callback contract):[\s\S]*?(?:\*\/|\n\s*\/\/[^\n]*)\s*$/.test(prefix);
}

/**
 * Generates a detailed function contract for named functions or a compact contract for inline callbacks.
 *
 * Inputs: AST node, label, source file, source text, and indentation string.
 * Side effects: none.
 * Returns: comment text ready for insertion.
 */
function functionComment(node, label, sourceFile, source, indent) {
  const params = node.parameters ? node.parameters.map((param) => param.name.getText(sourceFile)).join(', ') : '';
  const bodyText = node.body ? source.slice(node.body.pos, node.body.end) : '';
  const hasReturn = /\breturn\b/.test(bodyText);
  const isInline = /callback|handler/i.test(label) && !(node.parent && ts.isVariableDeclaration(node.parent));
  const purpose = functionPurpose(label);
  const effects = sideEffectSummary(bodyText);

  if (isInline) {
    const inputText = params || 'no explicit parameters';
    return `/** Callback contract: ${purpose} Inputs: ${inputText}. Side effects: ${effects}. ${hasReturn ? 'Returns a value to the invoking API.' : 'No explicit return contract.'} */ `;
  }

  const lines = [
    '/**',
    ` * Function contract: ${label}`,
    ` * Purpose: ${purpose}`,
    ` * Inputs: ${params || 'none; the function derives state from its enclosing module/runtime context'}.`,
    ` * Side effects: ${effects}.`,
    ` * Returns: ${hasReturn ? 'a value consumed by the caller; inspect the implementation for the exact shape' : 'no explicit value unless an invoked dependency throws/rejects'}.`,
    ' */',
    '',
  ];
  return lines.map((line, index) => index === 0 ? line : `${indent}${line}`).join('\n');
}

/**
 * Adds syntax-aware contracts to every function-like node that does not already have a generated contract.
 *
 * Inputs: repository-relative file path and current source text.
 * Side effects: parses source through the TypeScript compiler API.
 * Returns: source text with function/callback comments inserted in reverse-offset order.
 */
function addFunctionDocumentation(file, source) {
  const sourceFile = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, scriptKindFor(file));
  const insertions = [];
  const seenPositions = new Set();

  /**
   * Recursively visits every syntax node to collect documentation insertion points for executable functions.
   *
   * Inputs: current AST node.
   * Side effects: appends insertion records to the enclosing collection.
   * Returns: nothing.
   */
  function visit(node) {
    const isFunction = ts.isFunctionDeclaration(node) || ts.isFunctionExpression(node) || ts.isArrowFunction(node) ||
      ts.isMethodDeclaration(node) || ts.isConstructorDeclaration(node) || ts.isGetAccessorDeclaration(node) ||
      ts.isSetAccessorDeclaration(node);

    if (isFunction && node.body) {
      const position = documentationPosition(node, sourceFile);
      if (!hasFunctionContract(source, position)) {
        const lineStart = source.lastIndexOf('\n', position - 1) + 1;
        const indent = source.slice(lineStart, position).match(/^\s*/)?.[0] || '';
        const label = functionLabel(node, node.parent, sourceFile);
        const key = `${position}:${label}`;
        if (!seenPositions.has(key)) {
          seenPositions.add(key);
          insertions.push({ position, text: functionComment(node, label, sourceFile, source, indent) });
        }
      }
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  insertions.sort((a, b) => b.position - a.position);
  let output = source;
  for (const insertion of insertions) output = `${output.slice(0, insertion.position)}${insertion.text}${output.slice(insertion.position)}`;
  return output;
}

/**
 * Writes a text file only when its content changed, minimizing migration noise.
 *
 * Inputs: repository-relative path and replacement text.
 * Side effects: writes the file and creates parent directories when necessary.
 * Returns: true when content changed.
 */
function writeIfChanged(file, content) {
  const absolute = path.join(ROOT, file);
  fs.mkdirSync(path.dirname(absolute), { recursive: true });
  const current = fs.existsSync(absolute) ? fs.readFileSync(absolute, 'utf8') : null;
  if (current === content) return false;
  fs.writeFileSync(absolute, content, 'utf8');
  return true;
}

/**
 * Creates responsibility-level README files for newly organized page/runtime/style folders.
 *
 * Inputs: none.
 * Side effects: writes Markdown documentation files.
 * Returns: nothing.
 */
function writeFolderDocumentation() {
  const docs = new Map([
    ['src/pages/README.md', `# \`src/pages/\`\n\nCanonical static page source grouped by route responsibility.\n\n- \`core/\`: homepage and primary navigation routes (about, contact, projects, services, privacy).\n- \`projects/\`: individual project/case-study pages.\n- \`services/\`: specialist service and search-intent landing pages.\n\nThese files are materialized to historical root filenames by \`scripts/repository/source-layout.cjs\` so public URLs and the mature build pipeline remain stable. Every HTML file carries an \`@fileoverview\` source comment near its doctype.\n`],
    ['src/pages/core/README.md', `# Core pages\n\nPrimary site routes and navigation destinations. Keep route identity aligned with \`config/canonical-routes.json\` and compatibility materialization in \`scripts/repository/source-layout.cjs\`.\n`],
    ['src/pages/projects/README.md', `# Project pages\n\nCanonical project/case-study HTML sources. Filenames intentionally preserve public project identifiers while the folder provides clear ownership.\n`],
    ['src/pages/services/README.md', `# Service pages\n\nCanonical service and search-intent landing pages for product design, UX audit, design systems, Web3, SaaS, and website UX.\n`],
    ['src/scripts/README.md', `# Browser runtime\n\nThe browser runtime is split by responsibility rather than one catch-all features directory.\n\n- \`entrypoints/\`: runtime bootstraps only.\n- \`shared/\`: dependency-light helpers shared across domains.\n- \`features/accessibility/\`: accessibility and audit remediation behavior.\n- \`features/analytics/\`: analytics/event instrumentation.\n- \`features/content/\`: article, blog, filtering, copy, and content presentation behavior.\n- \`features/forms/\`: form interaction and submission behavior.\n- \`features/layout/\`: layout, typography, responsive, shell, and spacing behavior.\n- \`features/motion/\`: animation, pointer, canvas, and portrait interaction behavior.\n- \`features/navigation/\`: navigation, menu, theme, transitions, share, and resume controls.\n- \`features/portfolio/\`: project/case-study presentation and portfolio upgrades.\n- \`features/system/\`: cross-cutting design/experience contracts.\n\nEvery authored JS module has an \`@fileoverview\` header and every function/callback has a function contract enforced by \`npm run audit:code-docs\`.\n`],
    ['src/scripts/entrypoints/README.md', `# Runtime entrypoints\n\nThin orchestration modules. Entrypoints may choose which domain features load, but domain logic belongs in \`features/\` and shared primitives belong in \`shared/\`.\n`],
    ['src/scripts/shared/README.md', `# Shared runtime helpers\n\nSmall dependency-light helpers used by more than one browser feature domain. Keep this folder generic and avoid page-specific behavior.\n`],
    ['src/styles/README.md', `# \`src/styles/\`\n\nAuthored stylesheet source with explicit ownership.\n\n- \`style.css\`: canonical assembled/global production stylesheet required by the mature build contract.\n- \`systems/\`: reusable authored stylesheet systems.\n- \`fragments/agent/\`: composable agent-era fragments assembled by the stylesheet compiler; names describe responsibility instead of historical sequence numbers.\n\nDo not add patch/version stylesheets. \`scripts/compile-single-stylesheet.cjs\` remains the assembly owner and CSS audits enforce the production contract.\n`],
    ['src/styles/systems/README.md', `# Stylesheet systems\n\nReusable authored CSS systems with clear surface ownership. These modules are assembled/validated by the production stylesheet toolchain.\n`],
    ['src/styles/fragments/README.md', `# Stylesheet fragments\n\nComposable CSS fragments that are not independently served. Subfolders identify the owning design lineage/domain.\n`],
    ['src/styles/fragments/agent/README.md', `# Agent design fragments\n\nCompatibility and finishing fragments from the agent-led portfolio redesign. Filenames now describe responsibility rather than chronological patch numbers.\n`],
  ]);

  for (const category of ['accessibility', 'analytics', 'content', 'forms', 'layout', 'motion', 'navigation', 'portfolio', 'system']) {
    docs.set(`src/scripts/features/${category}/README.md`, `# ${humanize(category)} runtime features\n\nBrowser modules whose primary responsibility belongs to the **${humanize(category).toLowerCase()}** domain. Keep cross-domain orchestration in \`src/scripts/entrypoints/\` and shared primitives in \`src/scripts/shared/\`.\n`);
  }

  for (const [file, content] of docs) writeIfChanged(file, content);
}

/**
 * Updates repository policy/docs so the new deeper folder structure and documentation standard are discoverable and enforced.
 *
 * Inputs: none.
 * Side effects: rewrites package.json, root policy, src overview, and codebase-structure documentation.
 * Returns: nothing.
 */
function updateRepositoryContracts() {
  const packagePath = path.join(ROOT, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  pkg.scripts['audit:code-docs'] = 'node scripts/repository/audit-code-documentation.cjs';
  if (!pkg.scripts.validate.includes('audit:code-docs')) {
    pkg.scripts.validate = pkg.scripts.validate.replace('npm run audit:repo-structure', 'npm run audit:repo-structure && npm run audit:code-docs');
  }
  fs.writeFileSync(packagePath, `${JSON.stringify(pkg, null, 2)}\n`, 'utf8');

  const rootPolicyPath = path.join(ROOT, 'config/repository/root-policy.json');
  const rootPolicy = JSON.parse(fs.readFileSync(rootPolicyPath, 'utf8'));
  const required = new Set(rootPolicy.requiredDocumentation || []);
  [
    'config/repository/code-documentation-policy.json',
    'src/scripts/README.md',
    'src/scripts/entrypoints/README.md',
    'src/scripts/shared/README.md',
    'src/styles/systems/README.md',
    'src/styles/fragments/README.md',
  ].forEach((item) => required.add(item));
  rootPolicy.requiredDocumentation = [...required].sort();
  fs.writeFileSync(rootPolicyPath, `${JSON.stringify(rootPolicy, null, 2)}\n`, 'utf8');

  writeIfChanged('src/README.md', `# \`src/\`\n\nPrimary production source tree.\n\n- \`pages/\` owns canonical HTML grouped into \`core/\`, \`projects/\`, and \`services/\`.\n- \`styles/\` owns the canonical stylesheet plus reusable systems and composable fragments.\n- \`runtime/\` owns the stable compatibility browser entry template.\n- \`scripts/\` owns browser code split into entrypoints, shared helpers, and responsibility-based feature domains.\n- \`content/\` owns structured content used by generators/runtime code.\n- \`discovery/\` owns crawler, SEO, AI-discovery, manifest, and header source files.\n- \`compat/\` contains explicitly documented build-only legacy inputs.\n- \`worker.js\` is the Cloudflare Worker/API router.\n- \`generated/\` contains machine-generated runtime modules and is excluded from hand-documentation.\n\nEvery authored code file is governed by \`config/repository/code-documentation-policy.json\`. See \`docs/repository/file-map.md\` and \`docs/repository/file-catalog.md\` for ownership and dependency connections.\n`);

  writeIfChanged('docs/codebase-structure.md', `# Codebase Structure\n\nThis project is a static multi-page Vite portfolio deployed through Cloudflare Workers/static assets. Source organization is responsibility-first while compatibility materialization preserves the mature public/build contract.\n\n## Canonical page source\n\n\`src/pages/\` is grouped by route responsibility:\n\n\`\`\`txt\nsrc/pages/\n├── core/       # Homepage and primary navigation routes\n├── projects/   # Individual project/case-study pages\n└── services/   # Specialist service/search landing pages\n\`\`\`\n\nThe build materializer maps these files to historical root filenames only during development/build. Tracked source does not return to the repository root.\n\n## Browser runtime\n\n\`src/scripts/\` is grouped by responsibility:\n\n\`\`\`txt\nsrc/scripts/\n├── entrypoints/\n├── shared/\n└── features/\n    ├── accessibility/\n    ├── analytics/\n    ├── content/\n    ├── forms/\n    ├── layout/\n    ├── motion/\n    ├── navigation/\n    ├── portfolio/\n    └── system/\n\`\`\`\n\nEntrypoints orchestrate. Feature modules own one behavioral domain. Shared helpers remain dependency-light.\n\n## Styles\n\n\`src/styles/style.css\` remains the canonical production stylesheet because build/audit contracts intentionally enforce one served stylesheet. Supporting authored source is organized under \`src/styles/systems/\` and \`src/styles/fragments/\`.\n\n## Build tooling\n\n\`scripts/\` is an ordered transformation pipeline. Many historical stages compute repository paths relative to their own location, so they are not bulk-moved merely for aesthetics. Existing safe subdomains such as \`scripts/repository/\` and \`scripts/spacious-pages/\` remain grouped; new tooling should prefer responsibility folders when it does not depend on historical relative-path behavior.\n\n## Documentation contract\n\nAuthored JS/TS/CSS/HTML/workflow files begin with a structured \`@fileoverview\` comment describing purpose, responsibilities, execution context, connected files, and maintenance constraints. JS/TS functions and callbacks carry function contracts describing purpose, inputs, side effects, and return behavior.\n\nRun:\n\n\`\`\`bash\nnpm run audit:code-docs\nnpm run validate\n\`\`\`\n\nGenerated/vendor code is excluded and documented at its source/generator instead of being hand-edited.\n`);
}

/**
 * Runs the complete one-shot migration in a deterministic order.
 *
 * Inputs: none; operates on the current Git checkout.
 * Side effects: moves tracked files, rewrites source/docs/configuration, and adds documentation comments.
 * Returns: nothing. Throws on syntax/path failures so the workflow cannot commit a partial migration.
 */
function main() {
  const originalFiles = trackedFiles();
  const originalSet = new Set(originalFiles);
  const moveMap = buildMoveMap(originalFiles);
  const reverseMoveMap = new Map([...moveMap.entries()].map(([from, to]) => [to, from]));

  console.log(`[deep-organize] Moving ${moveMap.size} tracked source file(s).`);
  for (const [from, to] of moveMap) moveTrackedFile(from, to);

  const afterMoves = trackedFiles();
  for (const newFile of afterMoves) {
    if (!isTextFile(newFile)) continue;
    const absolute = path.join(ROOT, newFile);
    if (!fs.existsSync(absolute)) continue;
    const stat = fs.statSync(absolute);
    if (stat.size > 2 * 1024 * 1024) continue;

    const oldFile = reverseMoveMap.get(newFile) || newFile;
    let source = fs.readFileSync(absolute, 'utf8');
    if (FUNCTION_EXTENSIONS.has(path.extname(newFile).toLowerCase())) {
      source = rewriteModuleSpecifiers(source, oldFile, newFile, moveMap, originalSet);
    }
    source = rewriteLiteralPaths(source, moveMap);
    fs.writeFileSync(absolute, source, 'utf8');
  }

  writeFolderDocumentation();
  updateRepositoryContracts();

  const documentedFiles = trackedFiles();
  const textIndex = buildTextIndex(documentedFiles);
  let headerCount = 0;
  let functionFileCount = 0;

  for (const file of documentedFiles) {
    if (isDocumentationExcluded(file)) continue;
    const extension = path.extname(file).toLowerCase();
    if (!CODE_HEADER_EXTENSIONS.has(extension) && !FUNCTION_EXTENSIONS.has(extension)) continue;
    const absolute = path.join(ROOT, file);
    if (!fs.existsSync(absolute)) continue;
    const stat = fs.statSync(absolute);
    if (stat.size > 2 * 1024 * 1024) continue;

    let source = fs.readFileSync(absolute, 'utf8');
    if (FUNCTION_EXTENSIONS.has(extension)) {
      source = addFunctionDocumentation(file, source);
      functionFileCount += 1;
    }
    if (CODE_HEADER_EXTENSIONS.has(extension)) {
      source = addFileHeader(file, source, connectionsFor(file, documentedFiles, textIndex));
      headerCount += 1;
    }
    fs.writeFileSync(absolute, source, 'utf8');
  }

  console.log(`[deep-organize] Added/verified structured headers for ${headerCount} authored code files.`);
  console.log(`[deep-organize] Added/verified function contracts across ${functionFileCount} JavaScript/TypeScript files.`);
  console.log('[deep-organize] Migration complete. Run audits before committing.');
}

main();
