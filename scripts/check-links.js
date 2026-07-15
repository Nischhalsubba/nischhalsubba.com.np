/* eslint-disable no-console */
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const ignoredDirs = new Set(['.git', 'node_modules', 'dist', '.wrangler']);
const routeManifest = JSON.parse(fs.readFileSync(path.join(root, 'config', 'canonical-routes.json'), 'utf8'));
const redirects = readRedirects();

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

function readFile(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

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

function extractAttributes(html, name) {
  const pattern = new RegExp(`\\b${name}=["']([^"']+)["']`, 'g');
  return [...html.matchAll(pattern)].map((match) => match[1]);
}

function extractIds(html) {
  return new Set(extractAttributes(html, 'id'));
}

function extractNavLinks(html, className) {
  const pattern = new RegExp(`<nav[^>]*class=["'][^"']*${className}[^"']*["'][^>]*>([\\s\\S]*?)<\\/nav>`, 'g');
  return [...html.matchAll(pattern)].flatMap((match) => extractAttributes(match[1], 'href'));
}

function isExternal(value) {
  return /^(?:https?:)?\/\//.test(value) || /^(?:mailto|tel|data|javascript):/.test(value);
}

function stripQueryAndHash(value) {
  return value.split('#')[0].split('?')[0];
}

function normalizeSlashes(value) {
  return value.replaceAll(path.sep, '/').replace(/^\.\//, '');
}

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

function resolveInternalTarget(value, sourceFile) {
  return sourceCandidates(value, sourceFile).find((candidate) => fs.existsSync(path.join(root, candidate))) || null;
}

function hasRedirect(value) {
  const clean = stripQueryAndHash(value);
  return Boolean(clean && (redirects.has(clean) || (!clean.startsWith('/') && redirects.has(`/${clean}`))));
}

function canonicalNavPath(value) {
  if (isExternal(value)) return value;
  const clean = stripQueryAndHash(value);
  if (!clean || clean === '/index.html') return '/';
  const absolute = clean.startsWith('/') ? clean : `/${clean}`;
  return absolute.replace(/\/index\.html$/, '/').replace(/\.html$/, '').replace(/\/$/, '') || '/';
}

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

function checkCanonicalNavigation() {
  const canonicalFiles = routeManifest.html.filter((file) => fs.existsSync(path.join(root, file)));
  const baselineHtml = readFile('index.html');
  const baselineDesktop = new Set(extractNavLinks(baselineHtml, 'nav-wrapper').filter((href) => !isExternal(href)).map(canonicalNavPath));
  const baselineMobile = new Set(extractNavLinks(baselineHtml, 'mobile-nav-links').filter((href) => !isExternal(href)).map(canonicalNavPath));
  const issues = [];

  for (const file of canonicalFiles) {
    const html = readFile(file);
    const desktop = new Set(extractNavLinks(html, 'nav-wrapper').filter((href) => !isExternal(href)).map(canonicalNavPath));
    const mobile = new Set(extractNavLinks(html, 'mobile-nav-links').filter((href) => !isExternal(href)).map(canonicalNavPath));
    if (desktop.size === 0 && mobile.size === 0) continue;
    for (const link of baselineDesktop) if (!desktop.has(link)) issues.push(`${file}: desktop nav missing ${link}`);
    for (const link of baselineMobile) if (!mobile.has(link)) issues.push(`${file}: mobile nav missing ${link}`);
  }
  return issues;
}

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
