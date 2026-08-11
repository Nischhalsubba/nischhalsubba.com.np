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
 * Inputs: `directory`, `files`
 * Side effects: reads filesystem state
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
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
 * Inputs: `relativePath`
 * Side effects: reads filesystem state
 * Returns: The requested file; explicit early-return branches define empty/fallback behavior.
 */
function readFile(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}


/**
 * Function contract: readRedirects
 * Purpose: Return redirects from the supplied inputs or current check links repository tool state.
 * Inputs: None; derives required state from its enclosing module/runtime context.
 * Side effects: reads filesystem state
 * Returns: The requested redirects; explicit early-return branches define empty/fallback behavior.
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
 * Inputs: `html`, `name`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function extractAttributes(html, name) {
  const pattern = new RegExp(`\\b${name}=["']([^"']+)["']`, 'g');
  return [...html.matchAll(pattern)].map(   /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `match` Side effects: No direct external side effect beyond invoked dependencies. Returns: Computed expression result consumed by the enclosing operation. */ (match) => match[1]);
}



/**
 * Function contract: extractIds
 * Purpose: Convert ids into the structured representation consumed by the check links repository tool.
 * Inputs: `html`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function extractIds(html) {
  return new Set(extractAttributes(html, 'id'));
}



/**
 * Function contract: extractNavLinks
 * Purpose: Convert nav links into the structured representation consumed by the check links repository tool.
 * Inputs: `html`, `className`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function extractNavLinks(html, className) {
  const pattern = new RegExp(`<nav[^>]*class=["'][^"']*${className}[^"']*["'][^>]*>([\\s\\S]*?)<\\/nav>`, 'g');
  return [...html.matchAll(pattern)].flatMap( /** Callback contract: Perform the local callback step required by the immediately enclosing check links repository tool operation. Inputs: `match` Side effects: No direct external side effect beyond invoked dependencies. Returns: Computed expression result consumed by the enclosing operation. */ (match) => extractAttributes(match[1], 'href'));
}


/**
 * Function contract: isExternal
 * Purpose: Determine whether external satisfies the condition represented by this check links repository tool.
 * Inputs: `value`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Boolean indicating whether external satisfies the documented condition.
 */
function isExternal(value) {
  return /^(?:https?:)?\/\//.test(value) || /^(?:mailto|tel|data|javascript):/.test(value);
}


/**
 * Function contract: stripQueryAndHash
 * Purpose: Remove query and hash without disturbing required surrounding check links repository tool state.
 * Inputs: `value`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function stripQueryAndHash(value) {
  return value.split('#')[0].split('?')[0];
}


/**
 * Function contract: normalizeSlashes
 * Purpose: Apply slashes consistently while preserving the surrounding check links repository tool contract.
 * Inputs: `value`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function normalizeSlashes(value) {
  return value.replaceAll(path.sep, '/').replace(/^\.\//, '');
}


/**
 * Function contract: sourceCandidates
 * Purpose: Implement the source candidates responsibility owned by the check links repository tool.
 * Inputs: `value`, `sourceFile`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
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
 * Purpose: Resolve internal target from the supplied inputs and current check links repository tool context.
 * Inputs: `value`, `sourceFile`
 * Side effects: reads filesystem state
 * Returns: The requested internal target; explicit early-return branches define empty/fallback behavior.
 */
function resolveInternalTarget(value, sourceFile) {
  return sourceCandidates(value, sourceFile).find(   /** Callback contract: Identify whether the current item matches the lookup condition for the enclosing search. Inputs: `candidate` Side effects: reads filesystem state Returns: Boolean predicate result consumed by the enclosing collection lookup/filter. */ (candidate) => fs.existsSync(path.join(root, candidate))) || null;
}



/**
 * Function contract: hasRedirect
 * Purpose: Determine whether redirect satisfies the condition represented by this check links repository tool.
 * Inputs: `value`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Boolean indicating whether redirect satisfies the documented condition.
 */
function hasRedirect(value) {
  const clean = stripQueryAndHash(value);
  return Boolean(clean && (redirects.has(clean) || (!clean.startsWith('/') && redirects.has(`/${clean}`))));
}



/**
 * Function contract: canonicalNavPath
 * Purpose: Implement the canonical nav path responsibility owned by the check links repository tool.
 * Inputs: `value`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
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
 * Purpose: Validate links and surface actionable failures when the check links repository tool contract is violated.
 * Inputs: `htmlFiles`
 * Side effects: reads filesystem state
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
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
 * Purpose: Validate canonical navigation and surface actionable failures when the check links repository tool contract is violated.
 * Inputs: None; derives required state from its enclosing module/runtime context.
 * Side effects: reads filesystem state
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function checkCanonicalNavigation() {
  const canonicalFiles = routeManifest.html.filter(   /** Callback contract: Decide whether the current item remains in the filtered result consumed by the enclosing operation. Inputs: `file` Side effects: reads filesystem state Returns: Boolean predicate result consumed by the enclosing collection lookup/filter. */ (file) => fs.existsSync(path.join(root, file)));
  const baselineHtml = readFile('index.html');
  const baselineDesktop = new Set(extractNavLinks(baselineHtml, 'nav-wrapper').filter(   /** Callback contract: Decide whether the current item remains in the filtered result consumed by the enclosing operation. Inputs: `href` Side effects: No direct external side effect beyond invoked dependencies. Returns: Boolean predicate result consumed by the enclosing collection lookup/filter. */ (href) => !isExternal(href)).map(canonicalNavPath));
  const baselineMobile = new Set(extractNavLinks(baselineHtml, 'mobile-nav-links').filter(   /** Callback contract: Decide whether the current item remains in the filtered result consumed by the enclosing operation. Inputs: `href` Side effects: No direct external side effect beyond invoked dependencies. Returns: Boolean predicate result consumed by the enclosing collection lookup/filter. */ (href) => !isExternal(href)).map(canonicalNavPath));
  const issues = [];

  for (const file of canonicalFiles) {
    const html = readFile(file);
    const desktop = new Set(extractNavLinks(html, 'nav-wrapper').filter(   /** Callback contract: Decide whether the current item remains in the filtered result consumed by the enclosing operation. Inputs: `href` Side effects: No direct external side effect beyond invoked dependencies. Returns: Boolean predicate result consumed by the enclosing collection lookup/filter. */ (href) => !isExternal(href)).map(canonicalNavPath));
    const mobile = new Set(extractNavLinks(html, 'mobile-nav-links').filter(   /** Callback contract: Decide whether the current item remains in the filtered result consumed by the enclosing operation. Inputs: `href` Side effects: No direct external side effect beyond invoked dependencies. Returns: Boolean predicate result consumed by the enclosing collection lookup/filter. */ (href) => !isExternal(href)).map(canonicalNavPath));
    if (desktop.size === 0 && mobile.size === 0) continue;
    for (const link of baselineDesktop) if (!desktop.has(link)) issues.push(`${file}: desktop nav missing ${link}`);
    for (const link of baselineMobile) if (!mobile.has(link)) issues.push(`${file}: mobile nav missing ${link}`);
  }
  return issues;
}



/**
 * Function contract: main
 * Purpose: Implement the main responsibility owned by the check links repository tool.
 * Inputs: None; derives required state from its enclosing module/runtime context.
 * Side effects: emits diagnostics or changes process failure state
 * Returns: Undefined; the function exists for the documented side effects, validation, or orchestration.
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
