/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");

const root = process.cwd();

function listHtmlFiles() {
  return fs
    .readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".html"))
    .map((entry) => entry.name);
}

function readFile(relPath) {
  return fs.readFileSync(path.join(root, relPath), "utf8");
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

function extractHrefs(html) {
  const hrefs = [];
  const re = /\bhref="([^"]+)"/g;
  let m;
  while ((m = re.exec(html))) {
    hrefs.push(m[1]);
  }
  return hrefs;
}

function extractSrcs(html) {
  const srcs = [];
  const re = /\bsrc="([^"]+)"/g;
  let m;
  while ((m = re.exec(html))) {
    srcs.push(m[1]);
  }
  return srcs;
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
      const targetFile = stripQuery(targetFileRaw);
      const targetPath = path.join(root, targetFile);
      if (!fs.existsSync(targetPath)) {
        issues.push(`${file}: missing target ${href}`);
        continue;
      }
      if (anchor) {
        const target = byFile.get(targetFile);
        if (!target || !target.ids.has(anchor)) {
          issues.push(`${file}: missing anchor ${targetFile}#${anchor}`);
        }
      }
    }

    for (const src of srcs) {
      if (isExternal(src)) continue;
      const clean = stripQuery(src);
      const srcPath = path.join(root, clean);
      if (!fs.existsSync(srcPath)) {
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
