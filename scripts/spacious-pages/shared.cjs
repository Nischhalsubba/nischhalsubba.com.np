const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '../..');
const targetRoot = process.argv.includes('--dist') ? path.join(root, 'dist') : root;
const email = 'hinischalsubba@gmail.com';

function addBodyClasses(html, classes) {
  return html.replace(/<body(?:\s+class="([^"]*)")?([^>]*)>/i, (_match, current = '', rest = '') => {
    const all = new Set(`${current} ${classes}`.trim().split(/\s+/).filter(Boolean));
    return `<body class="${[...all].join(' ')}"${rest}>`;
  });
}

function replaceMain(file, markup, classes) {
  const target = path.join(targetRoot, file);
  if (!fs.existsSync(target)) throw new Error(`Missing target page: ${path.relative(root, target)}`);

  let html = fs.readFileSync(target, 'utf8');
  if (!/<main\b[\s\S]*?<\/main>/i.test(html)) throw new Error(`Missing main element in ${file}`);

  html = html.replace(/<main\b[\s\S]*?<\/main>/i, markup.trim());
  html = addBodyClasses(html, `nrs-inner-page ${classes}`);
  fs.writeFileSync(target, html, 'utf8');
}

const actions = '<div class="nrs-actions"><a class="btn btn-primary" href="/projects">View selected work</a><a class="btn btn-secondary" href="/contact">Start a conversation</a></div>';

module.exports = { email, replaceMain, actions };
