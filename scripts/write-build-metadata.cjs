const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');

if (!fs.existsSync(dist)) {
  console.error('[build-metadata] dist missing');
  process.exit(1);
}

const commit = process.env.CF_PAGES_COMMIT_SHA
  || process.env.GITHUB_SHA
  || process.env.VERCEL_GIT_COMMIT_SHA
  || 'local';
const branch = process.env.CF_PAGES_BRANCH
  || process.env.GITHUB_REF_NAME
  || process.env.VERCEL_GIT_COMMIT_REF
  || 'local';
const data = { commit, branch };

fs.writeFileSync(
  path.join(dist, 'build-info.json'),
  `${JSON.stringify(data, null, 2)}\n`,
  'utf8',
);

const marker = `<meta name="nrs-build-commit" content="${commit}">`;

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      walk(absolute);
      continue;
    }
    if (!entry.name.endsWith('.html')) continue;

    let html = fs.readFileSync(absolute, 'utf8');
    html = html.replace(/<meta name="nrs-build-(?:commit|time)"[^>]*>/g, '');
    html = html.replace(/<\/head>/i, `${marker}</head>`);
    fs.writeFileSync(absolute, html, 'utf8');
  }
}

walk(dist);
console.log(`[build-metadata] ${commit} on ${branch}`);
