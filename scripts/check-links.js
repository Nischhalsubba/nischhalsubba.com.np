/* eslint-disable no-console */
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const ignoredDirs = new Set([".git", "node_modules", "dist", ".wrangler"]);
const existingRedirects = readRedirects();

function walk(dir = root, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ignoredDirs.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, files);
      continue;
    }
    if (entry.isFile() && entry.name.endsWith(".html")) {
      files.push(path.relative(root, fullPath).replaceAll(path.sep, "/"));
    }
  }
  return files;
}

function listHtmlFiles() {
  return walk().sort();
}

function readFile(relPath) {
  return fs.readFileSync(path.join(root, relPath), "utf8");
}

function readRedirects() {
  const files = ["_redirects", "public/_redirects"];
  const redirects = new Map();

  for (const file of files) {
    const filePath = path.join(root, file);
    if (!fs.existsSync(filePath)) continue;
    const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
    for (const line of lines) {
      const clean = line.trim();
      if (!clean || clean.startsWith("#")) continue;
      const [from, to] = clean.split(/\s+/);
      if (from && to) redirects.set(from, to);
    }
  }

  return redirects;
}

function extractIds(html) {
  const ids = new Set();
  const re = /\bid="([^"]+)"/g;
  let m;
  while ((m = re.exec(html))) {
    ids.add(m[1]);
  }
  return ids;
}

function extractAttributes(html, attributeName) {
  const values = [];
  const re = new RegExp(`\\b${attributeName}="([^"]+)"`, "g");
  let m;
  while ((m = re.exec(html))) {
    values.push(m[1]);
  }
  return values;
}

function extractHrefs(html) {
  return extractAttributes(html, "href");
}

function extractSrcs(html) {
  return extractAttributes(html, "src");
}

function extractNavLinks(html, className) {
  const re = new RegExp(
    `<nav[^>]*class="[^"]*${className}[^"]*"[^>]*>([\\s\\S]*?)<\\/nav>`,
    "g"
  );
  const links = [];
  let m;
  while ((m = re.exec(html))) {
    links.push(...extractHrefs(m[1]));
  }
  return links;
}

function isExternal(url) {
  return (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("//") ||
    url.startsWith("mailto:") ||
    url.startsWith("tel:") ||
    url.startsWith("data:") ||
    url.startsWith("javascript:")
  );
}

function stripQuery(url) {
  const [clean] = url.split("?");
  return clean;
}

function normalizeInternalPath(url, sourceFile) {
  const clean = stripQuery(url).split("#")[0];
  if (!clean || clean === "/") return "index.html";

  if (clean.startsWith("/")) {
    const withoutSlash = clean.slice(1);
    if (!withoutSlash) return "index.html";
    if (withoutSlash.endsWith("/")) return `${withoutSlash}index.html`;
    return withoutSlash;
  }

  const sourceDir = path.dirname(sourceFile);
  const relative = path.normalize(path.join(sourceDir === "." ? "" : sourceDir, clean));
  return relative.replaceAll(path.sep, "/");
}

function existsAsFileOrDirectoryIndex(relativePath) {
  const filePath = path.join(root, relativePath);
  if (fs.existsSync(filePath)) return true;
  const indexPath = path.join(root, relativePath, "index.html");
  if (fs.existsSync(indexPath)) return true;
  return false;
}

function hasRedirect(url) {
  const clean = stripQuery(url).split("#")[0];
  if (!clean) return false;
  if (existingRedirects.has(clean)) return true;
  if (!clean.startsWith("/") && existingRedirects.has(`/${clean}`)) return true;
  return false;
}

function checkLinks() {
  const htmlFiles = listHtmlFiles();
  const byFile = new Map();
  const issues = [];

  for (const file of htmlFiles) {
    const html = readFile(file);
    byFile.set(file, {
      html,
      ids: extractIds(html),
    });
  }

  for (const file of htmlFiles) {
    const { html, ids } = byFile.get(file);
    const hrefs = extractHrefs(html);
    const srcs = extractSrcs(html);

    for (const href of hrefs) {
      if (isExternal(href)) continue;
      if (href.startsWith("#")) {
        const anchor = href.slice(1);
        if (anchor && !ids.has(anchor)) {
          issues.push(`${file}: missing anchor #${anchor}`);
        }
        continue;
      }

      const [targetFileRaw, anchor] = href.split("#");
      const normalizedTarget = normalizeInternalPath(targetFileRaw, file);

      if (!existsAsFileOrDirectoryIndex(normalizedTarget) && !hasRedirect(targetFileRaw)) {
        issues.push(`${file}: missing target ${href}`);
        continue;
      }

      if (anchor) {
        const target = byFile.get(normalizedTarget);
        if (target && !target.ids.has(anchor)) {
          issues.push(`${file}: missing anchor ${normalizedTarget}#${anchor}`);
        }
      }
    }

    for (const src of srcs) {
      if (isExternal(src)) continue;
      const normalizedSrc = normalizeInternalPath(src, file);
      if (!existsAsFileOrDirectoryIndex(normalizedSrc)) {
        issues.push(`${file}: missing asset ${src}`);
      }
    }
  }

  return { htmlFiles, issues };
}

function checkNavConsistency(htmlFiles) {
  const baselineFile = "index.html";
  const baselineHtml = readFile(baselineFile);
  const baselineDesktop = new Set(
    extractNavLinks(baselineHtml, "nav-wrapper").filter((h) => !isExternal(h))
  );
  const baselineMobile = new Set(
    extractNavLinks(baselineHtml, "mobile-nav-links").filter((h) => !isExternal(h))
  );

  const diffs = [];

  for (const file of htmlFiles) {
    const html = readFile(file);
    const desktopLinks = extractNavLinks(html, "nav-wrapper").filter(
      (h) => !isExternal(h)
    );
    const mobileLinks = extractNavLinks(html, "mobile-nav-links").filter(
      (h) => !isExternal(h)
    );

    if (desktopLinks.length === 0 && mobileLinks.length === 0) continue;

    const desktopSet = new Set(desktopLinks);
    const mobileSet = new Set(mobileLinks);

    for (const link of baselineDesktop) {
      if (!desktopSet.has(link)) {
        diffs.push(`${file}: desktop nav missing ${link}`);
      }
    }
    for (const link of baselineMobile) {
      if (!mobileSet.has(link)) {
        diffs.push(`${file}: mobile nav missing ${link}`);
      }
    }
  }

  return diffs;
}

function main() {
  const { htmlFiles, issues } = checkLinks();
  const navDiffs = checkNavConsistency(htmlFiles);

  if (issues.length === 0 && navDiffs.length === 0) {
    console.log("OK: no broken links/assets or nav inconsistencies found.");
    return;
  }

  if (issues.length > 0) {
    console.log("Broken links/assets:");
    for (const issue of issues) console.log(`- ${issue}`);
  }
  if (navDiffs.length > 0) {
    console.log("Nav inconsistencies:");
    for (const diff of navDiffs) console.log(`- ${diff}`);
  }

  process.exitCode = 1;
}

main();
