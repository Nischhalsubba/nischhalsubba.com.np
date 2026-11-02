/**
 * @fileoverview Install the approved November 2026 workspace homepage after historical transformations.
 * Purpose: Publish the self-contained homepage without altering retained case studies, blog or contact API.
 * Responsibilities: Keep the approved homepage, dependency paths and retained routes coherent.
 * Execution context: Node build command, after the legacy multi-page pipeline.
 * Connected files: src/workspace-home, package.json, scripts/audit-workspace-home.cjs.
 * Maintenance: This final installer supersedes earlier homepage composition stages. It is idempotent.
 */
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const source = path.join(root, 'src/workspace-home');
const dist = path.join(root, 'dist');
if (!fs.existsSync(path.join(dist, 'project-yarsha.html'))) throw new Error('Build retained routes before installing the homepage.');
fs.cpSync(source, path.join(dist, 'workspace-home'), { recursive: true });
// These small stylesheets are required for the first frame. Inline them in their
// original cascade position to avoid three serial requests on slow connections.
// Resolve font URLs against their original stylesheet, not the document URL.
let homepage = fs.readFileSync(path.join(source, 'index.html'), 'utf8').replace(
  /<link rel="stylesheet" href="(\/workspace-home\/[^"]+\.css)">/g,
  /** Callback contract: Inline critical CSS at its original cascade position. Inputs: link markup and asset URL. Side effects: reads CSS. Returns: equivalent style element. */ (link, href) => {
    const css = fs.readFileSync(path.join(dist, href), 'utf8').replace(
      /url\(([^)]+)\)/g,
      /** Callback contract: Rebase relative CSS resources. Inputs: URL token and value. Side effects: none. Returns: root-relative URL token. */ (reference, value) => {
        const resource = value.trim().replace(/^['"]|['"]$/g, '');
        if (/^(?:data:|https?:|\/|#)/.test(resource)) return reference;
        return `url("${new URL(resource, 'https://portfolio.invalid' + href).pathname}")`;
      }
    );
    return `<style data-workspace-inline="${href}">${css}</style>`;
  }
);
// The original monolithic initializer monopolizes one parser task. Keep its
// lexical scope and initialization order, but let input/rendering run between
// independent section initializers. The animation loop starts only at the end.
const startup = '(() => {\n  const reduce = matchMedia';
if (!homepage.includes(startup)) throw new Error('Homepage startup boundary changed.');
homepage = homepage.replace(startup, '(async () => {\n  const yieldStartup = () => new Promise(resolve => setTimeout(resolve, 0));\n  const reduce = matchMedia');
for (const section of [
  '  /* ---------- experience:',
  '  /* ---------- work:',
  '  /* ---------- services: plate',
  '  /* ---- spring (',
  '  /* ---- footer: the name again',
  '  /* ---------- process:',
  '  /* ---------- project scope:',
  '  /* ---------- clock ----------',
]) {
  if (!homepage.includes(section)) throw new Error(`Missing startup section: ${section}`);
  homepage = homepage.replace(section, '  await yieldStartup();\n' + section);
}
fs.writeFileSync(path.join(dist, 'index.html'), homepage);
// Keep historical home aliases on the approved homepage while preserving canonical route behavior.
for (const alias of ['home.html', 'home-v2.html']) {
  if (fs.existsSync(path.join(dist, alias))) fs.writeFileSync(path.join(dist, alias), homepage);
}
console.log('[workspace-home] Installed approved homepage and local assets.');
