const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const ts = require('typescript');

/**
 * @fileoverview One-shot semantic documentation refinement for the organized source tree.
 *
 * Purpose:
 * Replace mechanically generated documentation with comments that explain intent, inputs,
 * side effects, return behavior, execution context, and real final-tree dependencies.
 *
 * Responsibilities:
 * - Rebuild file headers from the final responsibility-based architecture instead of migration-time references.
 * - Rewrite generated function contracts with verb-aware, module-aware explanations.
 * - Rewrite inline callback contracts from their calling context (events, promises, array methods, animation frames, lazy imports).
 * - Preserve authored non-generated comments and all executable behavior byte-for-byte apart from comment placement.
 * - Exclude generated/vendor output and temporary refinement machinery from documentation/reference discovery.
 *
 * Execution context: Node.js in a temporary PR-only GitHub Actions workflow.
 * Connected files:
 * - config/repository/code-documentation-policy.json
 * - scripts/repository/audit-code-documentation.cjs
 * - docs/repository/file-catalog.md
 *
 * Maintenance: This file is deleted before the refinement commit is published. Future source must follow the permanent documentation audit.
 */

const ROOT = path.resolve(__dirname, '../..');
const POLICY = JSON.parse(fs.readFileSync(path.join(ROOT, 'config/repository/code-documentation-policy.json'), 'utf8'));
const TEMPORARY_PATHS = new Set([
  'scripts/repository/refine-code-documentation.cjs',
  '.github/workflows/refine-code-documentation.yml',
]);
const TEXT_EXTENSIONS = new Set([
  '.cjs', '.css', '.cssfrag', '.html', '.js', '.jsx', '.json', '.jsonc', '.md', '.mjs',
  '.ts', '.tsx', '.txt', '.xml', '.yaml', '.yml', '.webmanifest',
]);
const FUNCTION_EXTENSIONS = new Set(POLICY.functionExtensions);
const HEADER_EXTENSIONS = new Set(POLICY.headerExtensions);
const GENERATED_CONTRACT_RE = /\/\*\*[\s\S]*?(?:Function contract|Callback contract):[\s\S]*?\*\/\s*/g;

const FUNCTION_PURPOSE_OVERRIDES = new Map(Object.entries({
  getFocusableElements: 'Collect descendants of the supplied overlay that are actually rendered, visible, and eligible for keyboard focus.',
  setBackgroundInert: 'Apply or restore inert state on background page elements while the mobile navigation overlay is open, preserving any pre-existing inert state.',
  syncOpenState: 'Synchronize menu classes, data attributes, labels, and ARIA state with the requested open/closed value.',
  setMenuState: 'Open or close the mobile navigation, coordinate inert background behavior, and move focus at safe animation-frame boundaries.',
  trapFocus: 'Keep Tab and Shift+Tab focus inside the open mobile navigation overlay, including the empty-focusable fallback.',
  initMobileMenu: 'Initialize the mobile navigation once, establish its accessibility contract, and attach the click/keyboard/resize/navigation listeners that control it.',
  pageSpecificFeatures: 'Choose the lazy feature-definition list that applies to the current canonical route.',
  loadAndRunFeatures: 'Load feature initializers in parallel, isolate individual load failures, then execute each successfully resolved initializer.',
  organizedPageSource: 'Resolve a historical root-compatible HTML filename to its canonical core, project, or service source folder.',
  sourceForRootTarget: 'Resolve a root-compatible target filename through the materialization mapping instead of duplicating source-folder assumptions.',
  walkCssFiles: 'Recursively discover authored CSS files so nested style systems remain inside the architecture audit.',
  relativeStylePath: 'Normalize an absolute stylesheet path into a stable forward-slash path relative to the style source root.',
  readCommitted: 'Read the committed version of a compatibility stylesheet when available so generated working-tree mutations cannot hide architecture regressions.',
  withoutComments: 'Remove CSS block comments before selector and declaration policy checks to avoid false positives from commented examples.',
  onReady: 'Run the supplied initializer after the DOM is ready, or immediately when document parsing has already completed.',
  runStages: 'Execute the ordered build-stage definitions sequentially, surface the active stage in logs, and stop immediately when a stage fails.',
}));

/**
 * Returns the final tracked repository paths used for ownership, connection, and documentation discovery.
 *
 * Inputs: none.
 * Side effects: executes the read-only `git ls-files` command.
 * Returns: sorted repository-relative tracked paths.
 */
function trackedFiles() {
  const result = spawnSync('git', ['ls-files', '-z'], { cwd: ROOT, encoding: 'utf8' });
  if (result.status !== 0) throw new Error(`git ls-files failed: ${result.stderr || result.stdout}`);
  return result.stdout.split('\0').filter(Boolean).sort();
}

/**
 * Determines whether a path is outside the hand-authored documentation contract.
 *
 * Inputs: repository-relative file path.
 * Side effects: none.
 * Returns: true for generated/vendor/machine-owned or temporary refinement paths.
 */
function isExcluded(file) {
  if (TEMPORARY_PATHS.has(file)) return true;
  if (POLICY.excludedFiles.includes(file)) return true;
  return POLICY.excludedPrefixes.some((prefix) => file.startsWith(prefix));
}

/**
 * Determines whether a tracked file belongs to an authored root controlled by the documentation policy.
 *
 * Inputs: repository-relative file path.
 * Side effects: none.
 * Returns: true when the file is an authored code/document source eligible for headers/contracts.
 */
function isAuthored(file) {
  if (isExcluded(file)) return false;
  return POLICY.codeRoots.some((root) => file === root || file.startsWith(`${root}/`));
}

/**
 * Converts a source path or identifier into readable words while retaining useful acronym casing when practical.
 *
 * Inputs: path segment, filename, or identifier.
 * Side effects: none.
 * Returns: a space-separated phrase suitable for prose comments.
 */
function humanize(value) {
  return String(value)
    .replace(/\.[^.]+$/, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Returns a stable subject phrase for the module containing a documented function.
 *
 * Inputs: repository-relative file path.
 * Side effects: none.
 * Returns: concise lowercase module subject.
 */
function moduleSubject(file) {
  const base = humanize(path.basename(file)).toLowerCase();
  if (file.startsWith('src/scripts/features/')) return `${base} browser feature`;
  if (file.startsWith('src/scripts/entrypoints/')) return `${base} runtime entrypoint`;
  if (file.startsWith('scripts/')) return `${base} repository tool`;
  if (file.startsWith('tests/')) return `${base} quality check`;
  if (file.startsWith('api/') || file.startsWith('functions/api/')) return `${base} API handler`;
  return `${base} module`;
}

/**
 * Produces a file-specific purpose sentence from its architectural location and name.
 *
 * Inputs: repository-relative file path.
 * Side effects: none.
 * Returns: one clear purpose sentence.
 */
function filePurpose(file) {
  const base = humanize(path.basename(file));
  const exact = {
    'src/scripts/entrypoints/main.js': 'Bootstrap the standard browser runtime, select route-appropriate feature modules, and initialize them after DOM readiness.',
    'src/scripts/entrypoints/agent-main.js': 'Bootstrap agent-era enhancement modules while keeping optional contact and portfolio behavior route-scoped.',
    'src/scripts/shared/dom.js': 'Provide small dependency-light DOM query and readiness helpers shared by browser feature domains.',
    'src/runtime/script.js': 'Preserve the stable browser entry URL while delegating behavior to the organized runtime entrypoint.',
    'src/worker.js': 'Route Cloudflare Worker requests across canonical redirects, static assets, and server-side API behavior.',
    'src/styles/style.css': 'Define the canonical global production stylesheet, including shared tokens, layout primitives, and sitewide component rules.',
    'scripts/build-dist.cjs': 'Declare the deterministic production build pipeline and the exact order of every transformation and validation stage.',
    'scripts/run-build-stages.cjs': 'Execute named build stages consistently with readable diagnostics and fail-fast process handling.',
    'scripts/repository/source-layout.cjs': 'Define the canonical organized-source to historical-root compatibility mappings used by development and build tooling.',
    'scripts/repository/audit-repository-structure.cjs': 'Enforce repository ownership boundaries, canonical source mappings, and required architecture documentation.',
    'scripts/repository/audit-code-documentation.cjs': 'Enforce structured file and function documentation across authored application and tooling code.',
    'vite.config.ts': 'Configure Vite multi-page inputs, canonical URL transforms, source materialization expectations, and production asset output.',
  };
  if (exact[file]) return exact[file];

  if (file.startsWith('src/pages/core/')) return `Define the canonical semantic HTML source for the primary ${base.toLowerCase()} site route.`;
  if (file.startsWith('src/pages/projects/')) return `Define the canonical semantic HTML source for the ${base.toLowerCase()} project case study.`;
  if (file.startsWith('src/pages/services/')) return `Define the canonical semantic HTML source for the ${base.toLowerCase()} service/search landing page.`;

  const feature = file.match(/^src\/scripts\/features\/([^/]+)\/([^/]+)\.js$/);
  if (feature) {
    return `Implement ${humanize(feature[2]).toLowerCase()} behavior inside the ${feature[1]} browser-runtime domain.`;
  }

  if (file.startsWith('src/styles/systems/')) return `Define reusable ${base.toLowerCase()} stylesheet rules consumed by the production single-stylesheet build.`;
  if (file.startsWith('src/styles/fragments/')) return `Define composable ${base.toLowerCase()} CSS rules that are assembled into the production stylesheet rather than served independently.`;
  if (file.startsWith('src/components/')) return `Implement the reusable ${base} UI component and its local rendering/interaction contract.`;
  if (file.startsWith('src/content/')) return `Provide structured ${base.toLowerCase()} content consumed by generators or runtime presentation code.`;
  if (file.startsWith('scripts/repository/')) return `Maintain the repository architecture, generated documentation, or structural policy for ${base.toLowerCase()}.`;
  if (file.startsWith('scripts/')) {
    if (/audit|check|verify|validate|test|smoke/i.test(path.basename(file))) return `Validate ${base.toLowerCase()} and fail with actionable diagnostics when the production contract is violated.`;
    if (/generate|build|compile|compose|copy/i.test(path.basename(file))) return `Generate or assemble ${base.toLowerCase()} deterministically as part of the production toolchain.`;
    return `Apply the ${base.toLowerCase()} production transformation or maintenance step while preserving canonical source/build contracts.`;
  }
  if (file.startsWith('tests/')) return `Exercise ${base.toLowerCase()} behavior and fail CI when the expected user-facing or build contract regresses.`;
  if (file.startsWith('api/') || file.startsWith('functions/api/')) return `Handle ${base.toLowerCase()} server-side requests with validation and deployment-compatible response behavior.`;
  if (file.startsWith('blog/') && file.endsWith('.html')) return `Define the canonical article HTML source for ${base}.`;
  return `Own the authored ${base.toLowerCase()} source for this repository.`;
}

/**
 * Returns responsibility bullets tailored to the file's architectural domain.
 *
 * Inputs: repository-relative file path.
 * Side effects: none.
 * Returns: array of concrete maintenance responsibilities.
 */
function responsibilitiesFor(file) {
  if (file.startsWith('src/pages/')) {
    return [
      'Keep route content, headings, metadata, canonical URL, and structured data aligned with the route contract.',
      'Reference the shared production stylesheet/runtime instead of creating page-local parallel systems.',
      'Preserve semantic and accessible document structure so build and browser audits remain meaningful.',
    ];
  }
  if (file.startsWith('src/scripts/entrypoints/')) {
    return [
      'Orchestrate feature loading and initialization order without absorbing feature-domain implementation details.',
      'Keep route checks and lazy imports explicit so optional code runs only where it is needed.',
      'Isolate one feature failure from unrelated features while still surfacing diagnostics.',
    ];
  }
  if (file.startsWith('src/scripts/shared/')) {
    return [
      'Expose small dependency-light primitives that can be reused across feature domains.',
      'Avoid page-specific policy, feature state, or styling decisions in shared helpers.',
    ];
  }
  if (file.startsWith('src/scripts/features/')) {
    const category = file.split('/')[3];
    return [
      `Own the ${category} behavior represented by this module and keep unrelated domains outside the file.`,
      'Read or update only the DOM/runtime state needed for this feature and preserve accessibility semantics.',
      'Expose stable initializer/helper exports consumed by runtime entrypoints or closely related features.',
    ];
  }
  if (file.startsWith('src/styles/')) {
    return [
      'Own visual rules only; behavior and state transitions remain in browser runtime modules.',
      'Respect the single-stylesheet production architecture and existing design-system/accessibility audits.',
      'Keep selectors scoped to the intended surface unless this is the canonical global stylesheet.',
    ];
  }
  if (file.startsWith('scripts/')) {
    return [
      'Operate deterministically on canonical source or build output so repeated runs produce stable results.',
      'Surface invalid input or contract drift as explicit failures instead of silently masking it.',
      'Keep path assumptions synchronized with repository manifests and source-layout ownership.',
    ];
  }
  if (file.startsWith('tests/')) {
    return [
      'Exercise the documented production/user-facing contract with deterministic assertions.',
      'Emit actionable evidence or diagnostics when a regression is detected.',
    ];
  }
  if (file.startsWith('api/') || file.startsWith('functions/api/')) {
    return [
      'Validate request data before performing server-side work.',
      'Return predictable status, error, and success responses compatible with the deployed client.',
    ];
  }
  return [
    'Keep this file focused on its stated responsibility and stable public/build interfaces.',
    'Update connected owners whenever this file changes a shared contract.',
  ];
}

/**
 * Describes where a source file executes or how it enters production.
 *
 * Inputs: repository-relative file path.
 * Side effects: none.
 * Returns: execution/build-context sentence.
 */
function executionContext(file) {
  if (file.startsWith('src/scripts/')) return 'Browser ES module loaded through the portfolio runtime.';
  if (file === 'src/worker.js') return 'Cloudflare Workers runtime.';
  if (file.startsWith('scripts/')) return 'Node.js CLI during development, generation, build, CI, or repository maintenance.';
  if (file.startsWith('tests/')) return 'Node.js/Playwright quality-assurance runtime in local or CI validation.';
  if (file.startsWith('api/') || file.startsWith('functions/api/')) return 'Serverless/API runtime used by supported deployment targets.';
  if (file.endsWith('.html')) return 'Static HTML source transformed and copied into canonical production routes.';
  if (file.endsWith('.css') || file.endsWith('.cssfrag')) return 'Authored stylesheet source assembled or copied into the canonical production CSS.';
  if (file.endsWith('.tsx') || file.endsWith('.ts')) return 'TypeScript source consumed by build/runtime tooling.';
  return 'Repository application or build source.';
}

/**
 * Identifies text files small enough to inspect for import/path connections.
 *
 * Inputs: repository-relative file path.
 * Side effects: none.
 * Returns: true for supported text formats.
 */
function isTextFile(file) {
  return TEXT_EXTENSIONS.has(path.extname(file).toLowerCase()) || ['.gitignore', '.editorconfig', '_headers', '_redirects'].includes(path.basename(file));
}

/**
 * Resolves a relative import/require specifier to a tracked source path.
 *
 * Inputs: importing file, relative specifier, and set of tracked paths.
 * Side effects: none.
 * Returns: resolved repository-relative tracked path or null.
 */
function resolveRelativeModule(file, specifier, trackedSet) {
  if (!specifier.startsWith('.')) return null;
  const raw = path.posix.normalize(path.posix.join(path.posix.dirname(file), specifier));
  const candidates = [
    raw,
    `${raw}.js`, `${raw}.mjs`, `${raw}.cjs`, `${raw}.ts`, `${raw}.tsx`,
    path.posix.join(raw, 'index.js'), path.posix.join(raw, 'index.ts'),
  ];
  return candidates.find((candidate) => trackedSet.has(candidate)) || null;
}

/**
 * Finds meaningful final-tree connections for a file, prioritizing outbound imports/requires over generic ownership relationships.
 *
 * Inputs: file path, its source text, final tracked path list, tracked set, and a lightweight inbound reference index.
 * Side effects: none.
 * Returns: up to four repository-relative connected paths.
 */
function connectionsFor(file, source, files, trackedSet, inboundIndex) {
  const connections = [];
  const modulePattern = /(?:\bfrom\s*['"]|\bimport\s*\(\s*['"]|\brequire\s*\(\s*['"]|\bimport\s*['"])([^'"]+)/g;
  let match;
  while ((match = modulePattern.exec(source))) {
    const resolved = resolveRelativeModule(file, match[1], trackedSet);
    if (resolved && !isExcluded(resolved)) connections.push(resolved);
  }

  const inbound = inboundIndex.get(file) || [];
  connections.push(...inbound);

  if (file.startsWith('src/pages/')) connections.push('config/canonical-routes.json', 'scripts/repository/source-layout.cjs');
  if (file.startsWith('src/scripts/')) connections.push('src/runtime/script.js');
  if (file.startsWith('src/styles/')) connections.push('scripts/compile-single-stylesheet.cjs', 'scripts/audit-css-architecture.cjs');
  if (file.startsWith('scripts/')) connections.push('package.json');
  if (file.startsWith('tests/')) connections.push('.github/workflows/browser-audit.yml');

  return [...new Set(connections)]
    .filter((candidate) => candidate !== file && trackedSet.has(candidate) && !TEMPORARY_PATHS.has(candidate))
    .slice(0, 4);
}

/**
 * Builds a lightweight inbound exact-path reference index while deliberately ignoring generated catalogs and temporary migration helpers.
 *
 * Inputs: final tracked files and tracked set.
 * Side effects: reads eligible text files from disk.
 * Returns: Map from referenced tracked path to up to a few inbound owners.
 */
function buildInboundIndex(files, trackedSet) {
  const index = new Map();
  const candidates = files.filter((file) => {
    if (isExcluded(file) || TEMPORARY_PATHS.has(file) || !isTextFile(file)) return false;
    if (file.startsWith('docs/repository/')) return false;
    const absolute = path.join(ROOT, file);
    return fs.existsSync(absolute) && fs.statSync(absolute).size <= 512 * 1024;
  });

  for (const owner of candidates) {
    const source = fs.readFileSync(path.join(ROOT, owner), 'utf8');
    for (const target of files) {
      if (target === owner || !trackedSet.has(target) || target.length < 8) continue;
      if (!source.includes(target)) continue;
      const list = index.get(target) || [];
      if (list.length < 3) list.push(owner);
      index.set(target, list);
    }
  }
  return index;
}

/**
 * Removes only comments generated by the previous documentation migration, preserving unrelated authored comments.
 *
 * Inputs: repository-relative path and complete source text.
 * Side effects: none.
 * Returns: source with generated file/function/callback comments removed.
 */
function stripGeneratedDocumentation(file, source) {
  let output = source.replace(GENERATED_CONTRACT_RE, '');
  const extension = path.extname(file).toLowerCase();

  if (extension === '.html') {
    output = output.replace(/^(<!DOCTYPE html>\s*)?<!--[\s\S]{0,7000}?@fileoverview[\s\S]{0,7000}?-->\s*/i, (whole, doctype) => doctype || '');
  } else {
    const headerMatch = output.slice(0, 12000).match(/\/\*\*[\s\S]*?@fileoverview[\s\S]*?\*\/\s*/);
    if (headerMatch && headerMatch.index !== undefined && headerMatch.index < 2000) {
      output = output.slice(0, headerMatch.index) + output.slice(headerMatch.index + headerMatch[0].length);
    }
  }

  return output;
}

/**
 * Creates a detailed file header from final-tree ownership and dependency information.
 *
 * Inputs: file path and final connected paths.
 * Side effects: none.
 * Returns: comment text using the syntax appropriate for the file type.
 */
function buildFileHeader(file, connections) {
  const lines = [
    `@fileoverview ${file}`,
    `Purpose: ${filePurpose(file)}`,
    'Responsibilities:',
    ...responsibilitiesFor(file).map((item) => `- ${item}`),
    `Execution context: ${executionContext(file)}`,
    'Connected files:',
    ...(connections.length ? connections.map((item) => `- ${item}`) : ['- No direct tracked-file dependency; ownership is defined by this folder and its build/runtime convention.']),
    'Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.',
  ];

  if (file.endsWith('.html')) return `<!--\n  ${lines.join('\n  ')}\n-->\n`;
  return `/**\n * ${lines.join('\n * ')}\n */\n`;
}

/**
 * Inserts a detailed file header after syntax-sensitive prologues such as DOCTYPE, shebang, or CSS charset declarations.
 *
 * Inputs: file path, source text without generated docs, and connected paths.
 * Side effects: none.
 * Returns: source with the rebuilt header near the start.
 */
function addFileHeader(file, source, connections) {
  const header = buildFileHeader(file, connections);
  if (file.endsWith('.html')) {
    const doctype = source.match(/^<!DOCTYPE html>\s*/i);
    if (doctype) return `${doctype[0]}${header}${source.slice(doctype[0].length)}`;
    return `${header}${source}`;
  }
  if (source.startsWith('#!')) {
    const newline = source.indexOf('\n');
    return `${source.slice(0, newline + 1)}${header}${source.slice(newline + 1)}`;
  }
  if ((file.endsWith('.css') || file.endsWith('.cssfrag')) && source.startsWith('@charset')) {
    const newline = source.indexOf('\n');
    return `${source.slice(0, newline + 1)}${header}${source.slice(newline + 1)}`;
  }
  return `${header}${source}`;
}

/**
 * Chooses the TypeScript compiler parser mode needed for JavaScript, JSX, TypeScript, and TSX files.
 *
 * Inputs: repository-relative source path.
 * Side effects: none.
 * Returns: TypeScript ScriptKind value.
 */
function scriptKindFor(file) {
  if (file.endsWith('.tsx')) return ts.ScriptKind.TSX;
  if (file.endsWith('.ts')) return ts.ScriptKind.TS;
  if (file.endsWith('.jsx')) return ts.ScriptKind.JSX;
  return ts.ScriptKind.JS;
}

/**
 * Determines whether an AST node is executable function-like syntax requiring documentation.
 *
 * Inputs: TypeScript AST node.
 * Side effects: none.
 * Returns: true for declarations, expressions, arrows, methods, constructors, getters, and setters with bodies.
 */
function isFunctionLike(node) {
  return ts.isFunctionDeclaration(node) || ts.isFunctionExpression(node) || ts.isArrowFunction(node) ||
    ts.isMethodDeclaration(node) || ts.isConstructorDeclaration(node) || ts.isGetAccessorDeclaration(node) ||
    ts.isSetAccessorDeclaration(node);
}

/**
 * Resolves the stable name and natural comment owner for a named/assigned function.
 *
 * Inputs: function-like node and parsed source file.
 * Side effects: none.
 * Returns: object containing `name`, `owner`, and whether the function is an inline callback.
 */
function functionIdentity(node, sourceFile) {
  if (node.name && node.name.getText) return { name: node.name.getText(sourceFile), owner: node, inline: false };
  if (ts.isConstructorDeclaration(node)) return { name: 'constructor', owner: node, inline: false };

  const parent = node.parent;
  if (parent && ts.isVariableDeclaration(parent) && parent.name) {
    const owner = parent.parent && ts.isVariableDeclarationList(parent.parent) && parent.parent.declarations.length === 1 && parent.parent.parent
      ? parent.parent.parent
      : parent;
    return { name: parent.name.getText(sourceFile), owner, inline: false };
  }
  if (parent && ts.isPropertyAssignment(parent) && parent.name) {
    return { name: parent.name.getText(sourceFile), owner: parent, inline: false };
  }
  return { name: '', owner: node, inline: true };
}

/**
 * Splits a function identifier into verb and object phrase for readable intent generation.
 *
 * Inputs: function identifier.
 * Side effects: none.
 * Returns: object containing lowercase verb and readable remainder phrase.
 */
function splitFunctionName(name) {
  const words = humanize(name).split(' ').filter(Boolean);
  return {
    verb: (words.shift() || '').toLowerCase(),
    object: words.join(' ').toLowerCase() || 'module behavior',
  };
}

/**
 * Generates a concrete purpose sentence for a named function using overrides, naming verbs, and module context.
 *
 * Inputs: function name and repository-relative file path.
 * Side effects: none.
 * Returns: intent-focused sentence.
 */
function namedFunctionPurpose(name, file) {
  if (FUNCTION_PURPOSE_OVERRIDES.has(name)) return FUNCTION_PURPOSE_OVERRIDES.get(name);
  const { verb, object } = splitFunctionName(name);
  const subject = moduleSubject(file);

  if (['init', 'initialize', 'setup', 'mount'].includes(verb)) return `Initialize ${object} for the ${subject}, including the listeners/state needed for safe runtime use.`;
  if (['get', 'read', 'load', 'fetch', 'collect', 'list', 'select'].includes(verb)) return `Return ${object} from the supplied inputs or current ${subject} state.`;
  if (['find', 'locate', 'resolve'].includes(verb)) return `Resolve ${object} from the supplied inputs and the current repository/runtime context.`;
  if (['is', 'has', 'can', 'should'].includes(verb)) return `Determine whether ${object} satisfies the condition represented by this ${subject}.`;
  if (['set', 'sync', 'toggle'].includes(verb)) return `Synchronize ${object} with the requested state while preserving related ${subject} invariants.`;
  if (['apply', 'update', 'ensure', 'enforce', 'normalize', 'polish', 'finalize', 'configure', 'restore', 'repair'].includes(verb)) return `Apply ${object} consistently while preserving the surrounding ${subject} contract.`;
  if (['create', 'build', 'generate', 'compose', 'compile', 'make'].includes(verb)) return `Build ${object} from the supplied inputs in the form expected by downstream ${subject} consumers.`;
  if (['audit', 'validate', 'verify', 'check', 'test'].includes(verb)) return `Validate ${object} and surface actionable failures when the ${subject} contract is violated.`;
  if (['remove', 'delete', 'clean', 'strip'].includes(verb)) return `Remove ${object} without disturbing required surrounding ${subject} state.`;
  if (['parse', 'extract'].includes(verb)) return `Convert ${object} into the structured representation consumed by the ${subject}.`;
  if (['handle', 'on'].includes(verb)) return `Handle ${object} and coordinate the resulting ${subject} state changes.`;
  if (['run', 'execute'].includes(verb)) return `Execute ${object} in the required order and propagate failures through the ${subject} contract.`;
  return `Implement the ${humanize(name).toLowerCase()} responsibility owned by the ${subject}.`;
}

/**
 * Describes common parameter names so function contracts explain data roles rather than merely repeat identifiers.
 *
 * Inputs: parameter source text.
 * Side effects: none.
 * Returns: short human-readable parameter role.
 */
function parameterRole(parameterText) {
  const name = parameterText.replace(/\s*=.*$/, '').replace(/\?.*$/, '').trim();
  const roles = {
    event: 'browser/DOM event being handled',
    element: 'DOM element currently being evaluated or updated',
    button: 'interactive trigger/control element',
    overlay: 'navigation overlay/container element',
    open: 'desired boolean open state',
    source: 'source text or source object being processed',
    file: 'repository-relative or absolute file path being processed',
    path: 'path identifying the resource being processed',
    definitions: 'feature label/loader definitions to resolve and execute',
    root: 'repository or processing root directory',
    options: 'optional behavior/configuration overrides',
    config: 'configuration values controlling this operation',
    value: 'input value being transformed or evaluated',
    name: 'stable identifier or label for the current item',
    url: 'URL being inspected, normalized, or requested',
    request: 'incoming request object',
    response: 'response object/value being produced or inspected',
  };
  return roles[name] || 'input consumed by this operation';
}

/**
 * Builds the Inputs field for a function contract from parsed parameter syntax.
 *
 * Inputs: function-like node and parsed source file.
 * Side effects: none.
 * Returns: readable parameter list with roles, or an explicit no-argument statement.
 */
function inputSummary(node, sourceFile) {
  if (!node.parameters || !node.parameters.length) return 'None; derives required state from the enclosing module/runtime context.';
  return node.parameters.map((param) => {
    const text = param.name.getText(sourceFile);
    return `\`${text}\`: ${parameterRole(text)}`;
  }).join('; ');
}

/**
 * Conservatively summarizes observable side-effect categories from a function body.
 *
 * Inputs: function body source text.
 * Side effects: none beyond inspecting text.
 * Returns: semicolon-separated side-effect statement or an explicit no-obvious-side-effect statement.
 */
function sideEffectSummary(bodyText) {
  const effects = [];
  if (/addEventListener|removeEventListener/.test(bodyText)) effects.push('registers or removes browser event listeners');
  if (/\b(document|window)\b|classList|setAttribute|removeAttribute|appendChild|replaceChildren|innerHTML|textContent|\.focus\s*\(/.test(bodyText)) effects.push('reads or updates DOM/browser state');
  if (/\bfs\.(?:write|append|mkdir|rename|unlink|copy|rm)|writeFile|mkdirSync|renameSync|unlinkSync|copyFile/.test(bodyText)) effects.push('writes repository/filesystem state');
  else if (/\bfs\.(?:read|stat|exists|readdir)|readFile|statSync|existsSync|readdirSync/.test(bodyText)) effects.push('reads repository/filesystem state');
  if (/spawnSync|spawn\s*\(|execFile|execSync/.test(bodyText)) effects.push('spawns child processes');
  if (/\bfetch\s*\(|XMLHttpRequest/.test(bodyText)) effects.push('performs network I/O');
  if (/localStorage|sessionStorage|document\.cookie/.test(bodyText)) effects.push('reads or updates browser persistence');
  if (/console\.(?:log|warn|error)|process\.exit|process\.exitCode/.test(bodyText)) effects.push('emits diagnostics or changes process failure state');
  return effects.length ? effects.join('; ') : 'No obvious external side effect beyond calls to supplied/imported dependencies.';
}

/**
 * Collects return statements from one function body while deliberately skipping nested functions.
 *
 * Inputs: function-like node.
 * Side effects: none.
 * Returns: return statement nodes belonging to this function only.
 */
function ownReturnStatements(node) {
  const returns = [];
  const rootBody = node.body;
  if (!rootBody) return returns;

  function visit(current) {
    if (current !== rootBody && isFunctionLike(current)) return;
    if (ts.isReturnStatement(current)) returns.push(current);
    ts.forEachChild(current, visit);
  }
  visit(rootBody);
  return returns;
}

/**
 * Describes the observable return contract using syntax and function naming conventions.
 *
 * Inputs: function-like node, function name, and parsed source file.
 * Side effects: none.
 * Returns: concrete return-behavior sentence.
 */
function returnSummary(node, name, sourceFile) {
  const returns = ownReturnStatements(node);
  const valued = returns.filter((item) => item.expression);
  const asyncModifier = node.modifiers && node.modifiers.some((modifier) => modifier.kind === ts.SyntaxKind.AsyncKeyword);
  const { verb, object } = splitFunctionName(name || '');

  if (asyncModifier) {
    if (!valued.length) return 'Promise that resolves when the asynchronous side effects complete.';
    return 'Promise resolving to the computed result used by the caller; failure is propagated or handled inside the function as implemented.';
  }
  if (!valued.length) return 'Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.';
  if (['is', 'has', 'can', 'should'].includes(verb)) return `Boolean indicating whether ${object} satisfies the documented condition.`;
  if (['get', 'read', 'load', 'fetch', 'find', 'locate', 'resolve', 'collect', 'list', 'select'].includes(verb)) return `The requested ${object}; early-return/empty-state behavior follows the explicit branches in this function.`;

  const expressionTexts = valued.map((item) => item.expression.getText(sourceFile));
  if (expressionTexts.every((text) => /^(?:true|false|!|Boolean\(|.*(?:===|!==|<=|>=|<|>|&&|\|\|).*)/.test(text))) {
    return 'Boolean predicate result consumed by the caller.';
  }
  if (expressionTexts.some((text) => text.startsWith('['))) return 'Array containing the values selected or transformed by this function.';
  return 'Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.';
}

/**
 * Returns the text of a function body for intent/side-effect inspection.
 *
 * Inputs: function-like node and complete source text.
 * Side effects: none.
 * Returns: body source text or an empty string.
 */
function functionBodyText(node, source) {
  return node.body ? source.slice(node.body.pos, node.body.end) : '';
}

/**
 * Produces a context-aware purpose for an anonymous inline callback.
 *
 * Inputs: callback node, parsed source file, source text, and containing file.
 * Side effects: none.
 * Returns: concise semantic callback purpose.
 */
function callbackPurpose(node, sourceFile, source, file) {
  const parent = node.parent;
  const bodyText = functionBodyText(node, source);

  const importMatch = bodyText.match(/import\(\s*['"]([^'"]+)['"]\s*\)/);
  if (importMatch) {
    const feature = humanize(path.posix.basename(importMatch[1])).toLowerCase();
    const exportMatch = bodyText.match(/\.then\s*\([^=]*=>\s*[^.]+\.([A-Za-z_$][\w$]*)/);
    return `Lazy-load the ${feature} module${exportMatch ? ` and resolve its \`${exportMatch[1]}\` initializer` : ''}.`;
  }

  if (parent && ts.isCallExpression(parent)) {
    const expression = parent.expression;
    const callText = expression.getText(sourceFile);
    const method = ts.isPropertyAccessExpression(expression) ? expression.name.text : callText;

    if (method === 'addEventListener') {
      const eventName = parent.arguments[0] && ts.isStringLiteralLike(parent.arguments[0]) ? parent.arguments[0].text : 'browser';
      if (/setMenuState/.test(bodyText) && eventName === 'click') return 'Handle the click by preventing conflicting default behavior and toggling the mobile-menu state.';
      if (/trapFocus|Escape|event\.key/.test(bodyText) && /key/.test(eventName)) return `Handle ${eventName} input for Escape/Tab behavior and keyboard focus containment.`;
      return `Handle the ${eventName} event for \`${ts.isPropertyAccessExpression(expression) ? expression.expression.getText(sourceFile) : 'the target'}\` and apply this module's related state update.`;
    }
    if (method === 'requestAnimationFrame') {
      if (/\.focus\s*\(/.test(bodyText)) return 'Defer visibility/layout-dependent focus movement until the browser has applied the preceding DOM state change.';
      return 'Defer the enclosed DOM update until the next animation frame so layout/state changes apply in a stable order.';
    }
    if (method === 'then') {
      const param = node.parameters[0] ? node.parameters[0].name.getText(sourceFile) : 'value';
      const bodyExpression = ts.isArrowFunction(node) && !ts.isBlock(node.body) ? node.body.getText(sourceFile) : '';
      const memberMatch = bodyExpression.match(new RegExp(`^${param.replace(/[$]/g, '\\$&')}\\.([A-Za-z_$][\\w$]*)$`));
      if (memberMatch) return `Select the \`${memberMatch[1]}\` export/value from the resolved \`${param}\`.`;
      return 'Transform the resolved promise value into the result required by the next asynchronous step.';
    }
    if (method === 'catch') return 'Convert or report the rejected asynchronous operation according to this module’s failure-handling policy.';
    if (method === 'filter') {
      if (/getComputedStyle|getBoundingClientRect|visibility|display/.test(bodyText)) return 'Keep only elements that are rendered, visible, and eligible for the surrounding focus/layout operation.';
      return 'Decide whether the current item should remain in the filtered result used by the enclosing operation.';
    }
    if (method === 'map') return 'Transform the current item into the representation consumed by the enclosing collection operation.';
    if (method === 'forEach') {
      if (/\.inert|wasInert/.test(bodyText)) return 'Apply or restore inert state for each background element while preserving its prior inert value.';
      return 'Apply the enclosing side-effect operation to the current collection item.';
    }
    if (method === 'find') return 'Return true for the first collection item matching the lookup condition used by the enclosing operation.';
    if (method === 'some') return 'Evaluate whether the current item satisfies the condition needed for the enclosing existential check.';
    if (method === 'every') return 'Evaluate whether the current item satisfies the condition required by the enclosing all-items check.';
    if (method === 'sort') return 'Compare two collection items and return their deterministic ordering for the enclosing sort.';
    if (method === 'reduce') return 'Fold the current item into the accumulator used by the enclosing reduction.';
    if (callText === 'onReady') return `Start the ${moduleSubject(file)} after DOM readiness so required elements exist before initialization.`;
  }

  if (/event\.(?:preventDefault|stopPropagation)/.test(bodyText)) return `Handle the local browser event and prevent conflicting default/bubbling behavior before applying ${moduleSubject(file)} state changes.`;
  return `Perform the local callback step required by the enclosing ${moduleSubject(file)} operation.`;
}

/**
 * Returns the most natural source position for a detailed named-function contract.
 *
 * Inputs: function identity and parsed source file.
 * Side effects: none.
 * Returns: zero-based character offset.
 */
function namedDocumentationPosition(identity, sourceFile) {
  return identity.owner.getStart(sourceFile);
}

/**
 * Builds a multi-line named-function contract with purpose, inputs, side effects, and return behavior.
 *
 * Inputs: function node, function name, parsed source file, source text, containing file, and indentation.
 * Side effects: none.
 * Returns: formatted JSDoc-style contract.
 */
function namedFunctionComment(node, name, sourceFile, source, file, indent) {
  const lines = [
    '/**',
    ` * Function contract: ${name}`,
    ` * Purpose: ${namedFunctionPurpose(name, file)}`,
    ` * Inputs: ${inputSummary(node, sourceFile)}`,
    ` * Side effects: ${sideEffectSummary(functionBodyText(node, source))}.`,
    ` * Returns: ${returnSummary(node, name, sourceFile)}`,
    ' */',
    '',
  ];
  return lines.map((line, index) => index === 0 ? line : `${indent}${line}`).join('\n');
}

/**
 * Builds a concise but semantic contract for an inline callback whose local call/array context is already visible in code.
 *
 * Inputs: callback node, parsed source file, source text, containing file.
 * Side effects: none.
 * Returns: compact inline JSDoc comment.
 */
function callbackComment(node, sourceFile, source, file) {
  const parameters = node.parameters && node.parameters.length
    ? node.parameters.map((param) => `\`${param.name.getText(sourceFile)}\``).join(', ')
    : 'none';
  const returns = returnSummary(node, '', sourceFile);
  const sideEffects = sideEffectSummary(functionBodyText(node, source));
  return `/** Callback contract: ${callbackPurpose(node, sourceFile, source, file)} Inputs: ${parameters}. Side effects: ${sideEffects}. Returns: ${returns} */ `;
}

/**
 * Inserts semantic contracts before every function-like node in one JS/TS source file.
 *
 * Inputs: repository-relative file path and source text with prior generated contracts removed.
 * Side effects: parses source with the TypeScript compiler API.
 * Returns: source with named and inline function contracts inserted in reverse-offset order.
 */
function addFunctionDocumentation(file, source) {
  const sourceFile = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, scriptKindFor(file));
  const insertions = [];
  const seen = new Set();

  function visit(node) {
    if (isFunctionLike(node) && node.body) {
      const identity = functionIdentity(node, sourceFile);
      const position = identity.inline ? node.getStart(sourceFile) : namedDocumentationPosition(identity, sourceFile);
      const lineStart = source.lastIndexOf('\n', position - 1) + 1;
      const indent = source.slice(lineStart, position).match(/^\s*/)?.[0] || '';
      const key = `${position}:${identity.name}:${identity.inline}`;
      if (!seen.has(key)) {
        seen.add(key);
        insertions.push({
          position,
          text: identity.inline
            ? callbackComment(node, sourceFile, source, file)
            : namedFunctionComment(node, identity.name, sourceFile, source, file, indent),
        });
      }
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  insertions.sort((a, b) => b.position - a.position);
  let output = source;
  for (const insertion of insertions) {
    output = `${output.slice(0, insertion.position)}${insertion.text}${output.slice(insertion.position)}`;
  }
  return output;
}

/**
 * Writes content only when it differs from the current file, keeping the refinement deterministic and reviewable.
 *
 * Inputs: repository-relative path and replacement text.
 * Side effects: writes one file when content changed.
 * Returns: true when the file changed.
 */
function writeIfChanged(file, content) {
  const absolute = path.join(ROOT, file);
  const current = fs.readFileSync(absolute, 'utf8');
  if (current === content) return false;
  fs.writeFileSync(absolute, content, 'utf8');
  return true;
}

/**
 * Runs the full semantic documentation refinement against final tracked authored code.
 *
 * Inputs: none.
 * Side effects: rewrites documentation comments in authored source files and prints a summary.
 * Returns: nothing; throws on unreadable/invalid source so the workflow cannot publish a partial pass.
 */
function main() {
  const files = trackedFiles();
  const finalFiles = files.filter((file) => !TEMPORARY_PATHS.has(file));
  const trackedSet = new Set(finalFiles);
  const inboundIndex = buildInboundIndex(finalFiles, trackedSet);
  let headerFiles = 0;
  let functionFiles = 0;
  let changedFiles = 0;

  for (const file of finalFiles) {
    if (!isAuthored(file)) continue;
    const extension = path.extname(file).toLowerCase();
    const needsHeader = HEADER_EXTENSIONS.has(extension);
    const needsFunctions = FUNCTION_EXTENSIONS.has(extension);
    if (!needsHeader && !needsFunctions) continue;

    const absolute = path.join(ROOT, file);
    if (!fs.existsSync(absolute)) continue;
    const stat = fs.statSync(absolute);
    if (stat.size > 2 * 1024 * 1024) continue;

    let source = fs.readFileSync(absolute, 'utf8');
    source = stripGeneratedDocumentation(file, source);
    if (needsFunctions) {
      source = addFunctionDocumentation(file, source);
      functionFiles += 1;
    }
    if (needsHeader) {
      source = addFileHeader(file, source, connectionsFor(file, source, finalFiles, trackedSet, inboundIndex));
      headerFiles += 1;
    }
    if (writeIfChanged(file, source)) changedFiles += 1;
  }

  console.log(`[code-doc-refine] Refined ${changedFiles} authored file(s): ${headerFiles} detailed file headers and ${functionFiles} JS/TS function-documentation surfaces processed.`);
}

main();
