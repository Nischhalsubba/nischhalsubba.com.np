/**
 * @fileoverview scripts/check-links.js
 * Purpose: Validate check links and fail with actionable diagnostics when the production contract is violated.
 * Responsibilities:
 * - Operate deterministically on canonical source or build output so repeated runs produce stable results.
 * - Surface invalid input or contract drift as explicit failures instead of silently masking it.
 * - Keep path assumptions synchronized with repository manifests and source-layout ownership.
 * Execution context: Node.js CLI during development, generation, build, CI, or repository maintenance.
 * Connected files:
 * - package.json
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
/* eslint-disable no-console */
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const ignoredDirs = new Set(['.git', 'node_modules', 'dist', '.wrangler']);
const routeManifest = JSON.parse(fs.readFileSync(path.join(root, 'config', 'canonical-routes.json'), 'utf8'));
const redirects = readRedirects();

/**
 * Function contract: walk
 * Purpose: Implement the walk responsibility owned by the check links repository tool.
 * Inputs: `directory`: input consumed by this operation; `files`: input consumed by this operation
 * Side effects: reads repository/filesystem state.
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function walk(directory = root, files = []) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (ignoredDirs.has(entry.name)) continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(absolute, files);
    else if (entry.isFile() && entry.name.endsWith('.html')) {
      files.push(path.relative(root, absolute).replaceAll(path.sep, '/'));
    }
  }
  return files;
}

/**
 * Function contract: readFile
 * Purpose: Return file from the supplied inputs or current check links repository tool state.
 * Inputs: `relativePath`: input consumed by this operation
 * Side effects: reads repository/filesystem state.
 * Returns: The requested file; early-return/empty-state behavior follows the explicit branches in this function.
 */
function readFile(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

/**
 * Function contract: readRedirects
 * Purpose: Return redirects from the supplied inputs or current check links repository tool state.
 * Inputs: None; derives required state from the enclosing module/runtime context.
 * Side effects: reads repository/filesystem state.
 * Returns: The requested redirects; early-return/empty-state behavior follows the explicit branches in this function.
 */
function readRedirects() {
  const result = new Map();
  for (const relativePath of ['_redirects', 'public/_redirects']) {
    const absolute = path.join(root, relativePath);
    if (!fs.existsSync(absolute)) continue;
    for (const line of fs.readFileSync(absolute, 'utf8').split(/\r?\n/)) {
      const clean = line.trim();
      if (!clean || clean.startsWith('#')) continue;
      const [from, to] = clean.split(/\s+/);
      if (from && to) result.set(from, to);
    }
  }
  return result;
}

/**
 * Function contract: extractAttributes
 * Purpose: Convert attributes into the structured representation consumed by the check links repository tool.
 * Inputs: `html`: input consumed by this operation; `name`: stable identifier or label for the current item
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Boolean predicate result consumed by the caller.
 */
function extractAttributes(html, name) {
  const pattern = new RegExp(`\\b${name}=["']([^"']+)["']`, 'g');
  return [...html.matchAll(pattern)].map(/** Callback contract: Processes the callback step for [...html.match all(pattern)] without leaking orchestration details to the caller. Inputs: match. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `match`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `match`. Side effects: no direct external side effect beyond invoked dependencies. Returns: computed expression result consumed by the enclosing operation. */ (match) => match[1]);
}

/**
 * Function contract: extractIds
 * Purpose: Implements the extract ids responsibility for this module.
 * Inputs: html.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: extractIds
 * Purpose: Convert ids into the structured representation consumed by the check links repository tool.
 * Inputs: `html`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function extractIds(html) {
  return new Set(extractAttributes(html, 'id'));
}

/**
 * Function contract: extractNavLinks
 * Purpose: Implements the extract nav links responsibility for this module.
 * Inputs: html, className.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: extractNavLinks
 * Purpose: Convert nav links into the structured representation consumed by the check links repository tool.
 * Inputs: `html`: input consumed by this operation; `className`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Boolean predicate result consumed by the caller.
 */
function extractNavLinks(html, className) {
  const pattern = new RegExp(`<nav[^>]*class=["'][^"']*${className}[^"']*["'][^>]*>([\\s\\S]*?)<\\/nav>`, 'g');
  return [...html.matchAll(pattern)].flatMap(/** Callback contract: Perform the local callback step required by the immediately enclosing operation. Inputs: `match`. Side effects: no direct external side effect beyond invoked dependencies. Returns: computed expression result consumed by the enclosing operation. */ (match) => extractAttributes(match[1], 'href'));
}

/**
 * Function contract: isExternal
 * Purpose: Determine whether external satisfies the condition represented by this check links repository tool.
 * Inputs: `value`: input value being transformed or evaluated
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Boolean indicating whether external satisfies the documented condition.
 */
function isExternal(value) {
  return /^(?:https?:)?\/\//.test(value) || /^(?:mailto|tel|data|javascript):/.test(value);
}

/**
 * Function contract: stripQueryAndHash
 * Purpose: Remove query and hash without disturbing required surrounding check links repository tool state.
 * Inputs: `value`: input value being transformed or evaluated
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function stripQueryAndHash(value) {
  return value.split('#')[0].split('?')[0];
}

/**
 * Function contract: normalizeSlashes
 * Purpose: Apply slashes consistently while preserving the surrounding check links repository tool contract.
 * Inputs: `value`: input value being transformed or evaluated
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function normalizeSlashes(value) {
  return value.replaceAll(path.sep, '/').replace(/^\.\//, '');
}

/**
 * Function contract: sourceCandidates
 * Purpose: Implement the source candidates responsibility owned by the check links repository tool.
 * Inputs: `value`: input value being transformed or evaluated; `sourceFile`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Array containing the values selected or transformed by this function.
 */
function sourceCandidates(value, sourceFile) {
  const clean = stripQueryAndHash(value);
  if (!clean || clean === '/') return ['index.html'];

  const sourceDirectory = path.dirname(sourceFile);
  const relative = clean.startsWith('/')
    ? clean.slice(1)
    : normalizeSlashes(path.join(sourceDirectory === '.' ? '' : sourceDirectory, clean));
  const withoutTrailingSlash = relative.replace(/\/$/, '');
  const candidates = new Set([relative]);

  if (relative.endsWith('/')) candidates.add(`${relative}index.html`);
  if (!path.extname(withoutTrailingSlash)) {
    candidates.add(`${withoutTrailingSlash}.html`);
    candidates.add(`${withoutTrailingSlash}/index.html`);
  }
  for (const candidate of [...candidates]) candidates.add(`public/${candidate}`);
  return [...candidates].map(normalizeSlashes);
}

/**
 * Function contract: resolveInternalTarget
 * Purpose: Resolves resolve internal target using the current inputs and repository/runtime context.
 * Inputs: value, sourceFile.
 * Side effects: may read or write repository/filesystem state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: resolveInternalTarget
 * Purpose: Resolve internal target from the supplied inputs and the current repository/runtime context.
 * Inputs: `value`: input value being transformed or evaluated; `sourceFile`: input consumed by this operation
 * Side effects: reads repository/filesystem state.
 * Returns: The requested internal target; early-return/empty-state behavior follows the explicit branches in this function.
 */
function resolveInternalTarget(value, sourceFile) {
  return sourceCandidates(value, sourceFile).find(/** Callback contract: Processes the callback step for source candidates(value, source file) without leaking orchestration details to the caller. Inputs: candidate. Side effects: may read or write repository/filesystem state. No explicit return contract. */ /** Callback contract: Return true for the first collection item matching the lookup condition used by the enclosing operation. Inputs: `candidate`. Side effects: reads repository/filesystem state. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Identify whether the current item matches the lookup condition for the enclosing search. Inputs: `candidate`. Side effects: reads filesystem state. Returns: computed expression result consumed by the enclosing operation. */ (candidate) => fs.existsSync(path.join(root, candidate))) || null;
}

/**
 * Function contract: hasRedirect
 * Purpose: Implements the has redirect responsibility for this module.
 * Inputs: value.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: hasRedirect
 * Purpose: Determine whether redirect satisfies the condition represented by this check links repository tool.
 * Inputs: `value`: input value being transformed or evaluated
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Boolean indicating whether redirect satisfies the documented condition.
 */
function hasRedirect(value) {
  const clean = stripQueryAndHash(value);
  return Boolean(clean && (redirects.has(clean) || (!clean.startsWith('/') && redirects.has(`/${clean}`))));
}

/**
 * Function contract: canonicalNavPath
 * Purpose: Implements the canonical nav path responsibility for this module.
 * Inputs: value.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: canonicalNavPath
 * Purpose: Implement the canonical nav path responsibility owned by the check links repository tool.
 * Inputs: `value`: input value being transformed or evaluated
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function canonicalNavPath(value) {
  if (isExternal(value)) return value;
  const clean = stripQueryAndHash(value);
  if (!clean || clean === '/index.html') return '/';
  const absolute = clean.startsWith('/') ? clean : `/${clean}`;
  return absolute.replace(/\/index\.html$/, '/').replace(/\.html$/, '').replace(/\/$/, '') || '/';
}

/**
 * Function contract: checkLinks
 * Purpose: Validates check links and reports violations instead of silently accepting invalid state.
 * Inputs: htmlFiles.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: checkLinks
 * Purpose: Validate links and surface actionable failures when the check links repository tool contract is violated.
 * Inputs: `htmlFiles`: input consumed by this operation
 * Side effects: reads repository/filesystem state.
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function checkLinks(htmlFiles) {
  const parsed = new Map();
  const issues = [];
  for (const file of htmlFiles) {
    const html = readFile(file);
    parsed.set(file, { html, ids: extractIds(html) });
  }

  for (const file of htmlFiles) {
    const { html, ids } = parsed.get(file);
    for (const href of extractAttributes(html, 'href')) {
      if (isExternal(href)) continue;
      if (href.startsWith('#')) {
        const anchor = href.slice(1);
        if (anchor && !ids.has(anchor)) issues.push(`${file}: missing anchor #${anchor}`);
        continue;
      }

      const anchor = href.includes('#') ? href.split('#')[1] : '';
      const target = resolveInternalTarget(href, file);
      if (!target && !hasRedirect(href)) {
        issues.push(`${file}: missing target ${href}`);
        continue;
      }
      if (anchor && target) {
        const targetHtml = parsed.get(target)?.html || readFile(target);
        if (!extractIds(targetHtml).has(anchor)) issues.push(`${file}: missing anchor ${target}#${anchor}`);
      }
    }

    for (const source of extractAttributes(html, 'src')) {
      if (!isExternal(source) && !resolveInternalTarget(source, file)) {
        issues.push(`${file}: missing asset ${source}`);
      }
    }
  }
  return issues;
}

/**
 * Function contract: checkCanonicalNavigation
 * Purpose: Validates check canonical navigation and reports violations instead of silently accepting invalid state.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may read or write repository/filesystem state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: checkCanonicalNavigation
 * Purpose: Validate canonical navigation and surface actionable failures when the check links repository tool contract is violated.
 * Inputs: None; derives required state from the enclosing module/runtime context.
 * Side effects: reads repository/filesystem state.
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function checkCanonicalNavigation() {
  const canonicalFiles = routeManifest.html.filter(/** Callback contract: Processes the callback step for route manifest.html without leaking orchestration details to the caller. Inputs: file. Side effects: may read or write repository/filesystem state. No explicit return contract. */ /** Callback contract: Decide whether the current item should remain in the filtered result used by the enclosing operation. Inputs: `file`. Side effects: reads repository/filesystem state. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Decide whether the current item remains in the filtered result consumed by the enclosing operation. Inputs: `file`. Side effects: reads filesystem state. Returns: computed expression result consumed by the enclosing operation. */ (file) => fs.existsSync(path.join(root, file)));
  const baselineHtml = readFile('index.html');
  const baselineDesktop = new Set(extractNavLinks(baselineHtml, 'nav-wrapper').filter(/** Callback contract: Processes the callback step for extract nav links(baseline html, 'nav wrapper') without leaking orchestration details to the caller. Inputs: href. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Decide whether the current item should remain in the filtered result used by the enclosing operation. Inputs: `href`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Decide whether the current item remains in the filtered result consumed by the enclosing operation. Inputs: `href`. Side effects: no direct external side effect beyond invoked dependencies. Returns: boolean predicate result. */ (href) => !isExternal(href)).map(canonicalNavPath));
  const baselineMobile = new Set(extractNavLinks(baselineHtml, 'mobile-nav-links').filter(/** Callback contract: Processes the callback step for extract nav links(baseline html, 'mobile nav links') without leaking orchestration details to the caller. Inputs: href. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Decide whether the current item should remain in the filtered result used by the enclosing operation. Inputs: `href`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Decide whether the current item remains in the filtered result consumed by the enclosing operation. Inputs: `href`. Side effects: no direct external side effect beyond invoked dependencies. Returns: boolean predicate result. */ (href) => !isExternal(href)).map(canonicalNavPath));
  const issues = [];

  for (const file of canonicalFiles) {
    const html = readFile(file);
    const desktop = new Set(extractNavLinks(html, 'nav-wrapper').filter(/** Callback contract: Processes the callback step for extract nav links(html, 'nav wrapper') without leaking orchestration details to the caller. Inputs: href. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Decide whether the current item should remain in the filtered result used by the enclosing operation. Inputs: `href`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Decide whether the current item remains in the filtered result consumed by the enclosing operation. Inputs: `href`. Side effects: no direct external side effect beyond invoked dependencies. Returns: boolean predicate result. */ (href) => !isExternal(href)).map(canonicalNavPath));
    const mobile = new Set(extractNavLinks(html, 'mobile-nav-links').filter(/** Callback contract: Processes the callback step for extract nav links(html, 'mobile nav links') without leaking orchestration details to the caller. Inputs: href. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Decide whether the current item should remain in the filtered result used by the enclosing operation. Inputs: `href`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Decide whether the current item remains in the filtered result consumed by the enclosing operation. Inputs: `href`. Side effects: no direct external side effect beyond invoked dependencies. Returns: boolean predicate result. */ (href) => !isExternal(href)).map(canonicalNavPath));
    if (desktop.size === 0 && mobile.size === 0) continue;
    for (const link of baselineDesktop) if (!desktop.has(link)) issues.push(`${file}: desktop nav missing ${link}`);
    for (const link of baselineMobile) if (!mobile.has(link)) issues.push(`${file}: mobile nav missing ${link}`);
  }
  return issues;
}

/**
 * Function contract: main
 * Purpose: Implements the main responsibility for this module.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may emit diagnostics or inspect process state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: main
 * Purpose: Implement the main responsibility owned by the check links repository tool.
 * Inputs: None; derives required state from the enclosing module/runtime context.
 * Side effects: emits diagnostics or changes process failure state.
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
 */
function main() {
  const htmlFiles = walk().sort();
  const linkIssues = checkLinks(htmlFiles);
  const navIssues = checkCanonicalNavigation();
  if (!linkIssues.length && !navIssues.length) {
    console.log(`OK: checked ${htmlFiles.length} HTML files and canonical navigation on ${routeManifest.html.length} routes.`);
    return;
  }
  if (linkIssues.length) {
    console.log('Broken links/assets:');
    for (const issue of linkIssues) console.log(`- ${issue}`);
  }
  if (navIssues.length) {
    console.log('Canonical navigation inconsistencies:');
    for (const issue of navIssues) console.log(`- ${issue}`);
  }
  process.exitCode = 1;
}

main();
