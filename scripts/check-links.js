/* eslint-disable no-console */
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const ignoredDirs = new Set(['.git', 'node_modules', 'dist', '.wrangler']);
const existingRedirects = readRedirects();

function walk(dir = root, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ignoredDirs.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, files);
      continue;
    }
    if (entry.isFile() && entry.name.endsWith('.html')) {
      files.push(path.relative(root, fullPath).replaceAll(path.sep, '/'));
    }
  }
  return files;
}

function listHtmlFiles() {
  return walk().sort();
}

function readFile(relPath) {
  return fs.readFileSync(path.join(root, relPath), 'utf8');
}

function readRedirects() {
  const files = ['_redirects', 'public/_redirects'];
  const redirects = new Map();

  for (const file of files) {
    const filePath = path.join(root, file);
    if (!fs.existsSync(filePath)) continue;
    const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
    for (const line of lines) {
      const clean = line.trim();
      if (!clean || clean.startsWith('#')) continue;
      const [from, to] = clean.split(/\s+/);
      if (from && to) redirects.set(from, to);
    }
  }

  return redirects;
}

function extractIds(html) {
  return new Set([...html.matchAll(/\bid=["']([^"']+)["']/g)].map((match) => match[1]));
}

function extractAttributes(html, attributeName) {
  const expression = new RegExp(`\\b${attributeName}=["']([^"']+)["']`, 'g');
  return [...html.matchAll(expression)].map((match) => match[1]);
}

function extractNavLinks(html, className) {
  const expression = new RegExp(`<nav[^>]*class=["'][^"']*${className}[^"']*["'][^>]*>([\\s\\S]*?)<\\/nav>`, 'g');
  return [...html.matchAll(expression)].flatMap((match) => extractAttributes(match[1], 'href'));
}

function isExternal(url) {
  return /^(?:https?:)?\/\//.test(url) || /^(?:mailto|tel|data|javascript):/.test(url);
}

function stripQueryAndHash(url) {
  return url.split('#')[0].split('?')[0];
}

function normalizeSlashes(value) {
  return value.replaceAll(path.sep, '/').replace(/^\.\//, '');
}

function sourceCandidates(url, sourceFile) {
  const clean = stripQueryAndHash(url);
  if (!clean || clean === '/') return ['index.html'];

  const sourceDir = path.dirname(sourceFile);
  const relative = clean.startsWith('/')
    ? clean.slice(1)
    : normalizeSlashes(path.join(sourceDir === '.' ? '' : sourceDir, clean));

  const withoutTrailingSlash = relative.replace(/\/$/, '');
  const candidates = new Set();

  if (!withoutTrailingSlash) candidates.add('index.html');
  if (relative.endsWith('/')) candidates.add(`${relative}index.html`);

  candidates.add(relative);

  if (!path.extname(withoutTrailingSlash)) {
    candidates.add(`${withoutTrailingSlash}.html`);
    candidates.add(`${withoutTrailingSlash}/index.html`);
  }

  // Files in public/ are copied to the deployment root by the build.
  for (const candidate of [...candidates]) candidates.add(`public/${candidate}`);

  return [...candidates].map(normalizeSlashes);
}

function resolveInternalTarget(url, sourceFile) {
  return sourceCandidates(url, sourceFile).find((candidate) => fs.existsSync(path.join(root, candidate))) || null;
}

function hasRedirect(url) {
  const clean = stripQueryAndHash(url);
  if (!clean) return false;
  return existingRedirects.has(clean) || (!clean.startsWith('/') && existingRedirects.has(`/${clean}`));
}

function canonicalNavPath(url) {
  if (isExternal(url)) return url;
  const clean = stripQueryAndHash(url);
  if (!clean || clean === '/index.html') return '/';
  const absolute = clean.startsWith('/') ? clean : `/${clean}`;
  return absolute
    .replace(/\/index\.html$/, '/')
    .replace(/\.html$/, '')
    .replace(/\/$/, '') || '/';
}

function checkLinks() {
  const htmlFiles = listHtmlFiles();
  const byFile = new Map();
  const issues = [];

  for (const file of htmlFiles) {
    const html = readFile(file);
    byFile.set(file, { html, ids: extractIds(html) });
  }

  for (const file of htmlFiles) {
    const { html, ids } = byFile.get(file);
    const hrefs = extractAttributes(html, 'href');
    const srcs = extractAttributes(html, 'src');

    for (const href of hrefs) {
      if (isExternal(href)) continue;

      if (href.startsWith('#')) {
        const anchor = href.slice(1);
        if (anchor && !ids.has(anchor)) issues.push(`${file}: missing anchor #${anchor}`);
        continue;
      }

      const anchor = href.includes('#') ? href.split('#')[1] : '';
      const targetFile = resolveInternalTarget(href, file);

      if (!targetFile && !hasRedirect(href)) {
        issues.push(`${file}: missing target ${href}`);
        continue;
      }

      if (anchor && targetFile) {
        const targetHtml = byFile.get(targetFile)?.html || readFile(targetFile);
        if (!extractIds(targetHtml).has(anchor)) issues.push(`${file}: missing anchor ${targetFile}#${anchor}`);
      }
    }

    for (const src of srcs) {
      if (isExternal(src)) continue;
      if (!resolveInternalTarget(src, file)) issues.push(`${file}: missing asset ${src}`);
    }
  }

  return { htmlFiles, issues };
}

function checkNavConsistency(htmlFiles) {
  const baselineHtml = readFile('index.html');
  const baselineDesktop = new Set(extractNavLinks(baselineHtml, 'nav-wrapper').filter((href) => !isExternal(href)).map(canonicalNavPath));
  const baselineMobile = new Set(extractNavLinks(baselineHtml, 'mobile-nav-links').filter((href) => !isExternal(href)).map(canonicalNavPath));
  const diffs = [];

  for (const file of htmlFiles) {
    const html = readFile(file);
    const desktop = new Set(extractNavLinks(html, 'nav-wrapper').filter((href) => !isExternal(href)).map(canonicalNavPath));
    const mobile = new Set(extractNavLinks(html, 'mobile-nav-links').filter((href) => !isExternal(href)).map(canonicalNavPath));

    if (desktop.size === 0 && mobile.size === 0) continue;

    for (const link of baselineDesktop) if (!desktop.has(link)) diffs.push(`${file}: desktop nav missing ${link}`);
    for (const link of baselineMobile) if (!mobile.has(link)) diffs.push(`${file}: mobile nav missing ${link}`);
  }

  return diffs;
}

function main() {
  const { htmlFiles, issues } = checkLinks();
  const navDiffs = checkNavConsistency(htmlFiles);

  if (issues.length === 0 && navDiffs.length === 0) {
    console.log('OK: no broken links/assets or navigation inconsistencies found.');
    return;
  }

  if (issues.length) {
    console.log('Broken links/assets:');
    for (const issue of issues) console.log(`- ${issue}`);
  }

  if (navDiffs.length) {
    console.log('Navigation inconsistencies:');
    for (const diff of navDiffs) console.log(`- ${diff}`);
  }

  process.exitCode = 1;
}

main();
