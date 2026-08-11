/**
 * @fileoverview scripts/check-links.js
 * Purpose: Node-based build, content transformation, QA, or maintenance tool for check links.
 * Responsibilities:
 * - Own the behavior/content implied by this file's single responsibility.
 * - Keep public routes, build contracts, and imported module boundaries stable unless the connected owners are updated together.
 * Execution context: Node.js CLI during local development, CI, build, or maintenance.
 * Connected files:
 * - docs/repository/file-catalog.md
 * - package.json
 * - scripts/build-dist.cjs
 * Maintenance: Update this header when responsibility or dependencies change; generated/vendor files are documented at their source instead.
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
 * Purpose: Implements the walk responsibility for this module.
 * Inputs: directory, files.
 * Side effects: may read or write repository/filesystem state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
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
 * Purpose: Retrieves read file and returns it in the form expected by its caller.
 * Inputs: relativePath.
 * Side effects: may read or write repository/filesystem state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function readFile(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

/**
 * Function contract: readRedirects
 * Purpose: Retrieves read redirects and returns it in the form expected by its caller.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may read or write repository/filesystem state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
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
 * Purpose: Implements the extract attributes responsibility for this module.
 * Inputs: html, name.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function extractAttributes(html, name) {
  const pattern = new RegExp(`\\b${name}=["']([^"']+)["']`, 'g');
  return [...html.matchAll(pattern)].map(/** Callback contract: Processes the callback step for [...html.match all(pattern)] without leaking orchestration details to the caller. Inputs: match. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (match) => match[1]);
}

/**
 * Function contract: extractIds
 * Purpose: Implements the extract ids responsibility for this module.
 * Inputs: html.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
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
function extractNavLinks(html, className) {
  const pattern = new RegExp(`<nav[^>]*class=["'][^"']*${className}[^"']*["'][^>]*>([\\s\\S]*?)<\\/nav>`, 'g');
  return [...html.matchAll(pattern)].flatMap(/** Callback contract: Processes the callback step for [...html.match all(pattern)] without leaking orchestration details to the caller. Inputs: match. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (match) => extractAttributes(match[1], 'href'));
}

/**
 * Function contract: isExternal
 * Purpose: Implements the is external responsibility for this module.
 * Inputs: value.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function isExternal(value) {
  return /^(?:https?:)?\/\//.test(value) || /^(?:mailto|tel|data|javascript):/.test(value);
}

/**
 * Function contract: stripQueryAndHash
 * Purpose: Implements the strip query and hash responsibility for this module.
 * Inputs: value.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function stripQueryAndHash(value) {
  return value.split('#')[0].split('?')[0];
}

/**
 * Function contract: normalizeSlashes
 * Purpose: Applies normalize slashes while preserving the surrounding repository/runtime contract.
 * Inputs: value.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function normalizeSlashes(value) {
  return value.replaceAll(path.sep, '/').replace(/^\.\//, '');
}

/**
 * Function contract: sourceCandidates
 * Purpose: Implements the source candidates responsibility for this module.
 * Inputs: value, sourceFile.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
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
function resolveInternalTarget(value, sourceFile) {
  return sourceCandidates(value, sourceFile).find(/** Callback contract: Processes the callback step for source candidates(value, source file) without leaking orchestration details to the caller. Inputs: candidate. Side effects: may read or write repository/filesystem state. No explicit return contract. */ (candidate) => fs.existsSync(path.join(root, candidate))) || null;
}

/**
 * Function contract: hasRedirect
 * Purpose: Implements the has redirect responsibility for this module.
 * Inputs: value.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
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
function checkCanonicalNavigation() {
  const canonicalFiles = routeManifest.html.filter(/** Callback contract: Processes the callback step for route manifest.html without leaking orchestration details to the caller. Inputs: file. Side effects: may read or write repository/filesystem state. No explicit return contract. */ (file) => fs.existsSync(path.join(root, file)));
  const baselineHtml = readFile('index.html');
  const baselineDesktop = new Set(extractNavLinks(baselineHtml, 'nav-wrapper').filter(/** Callback contract: Processes the callback step for extract nav links(baseline html, 'nav wrapper') without leaking orchestration details to the caller. Inputs: href. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (href) => !isExternal(href)).map(canonicalNavPath));
  const baselineMobile = new Set(extractNavLinks(baselineHtml, 'mobile-nav-links').filter(/** Callback contract: Processes the callback step for extract nav links(baseline html, 'mobile nav links') without leaking orchestration details to the caller. Inputs: href. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (href) => !isExternal(href)).map(canonicalNavPath));
  const issues = [];

  for (const file of canonicalFiles) {
    const html = readFile(file);
    const desktop = new Set(extractNavLinks(html, 'nav-wrapper').filter(/** Callback contract: Processes the callback step for extract nav links(html, 'nav wrapper') without leaking orchestration details to the caller. Inputs: href. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (href) => !isExternal(href)).map(canonicalNavPath));
    const mobile = new Set(extractNavLinks(html, 'mobile-nav-links').filter(/** Callback contract: Processes the callback step for extract nav links(html, 'mobile nav links') without leaking orchestration details to the caller. Inputs: href. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (href) => !isExternal(href)).map(canonicalNavPath));
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
