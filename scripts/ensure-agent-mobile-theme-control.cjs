const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');

if (!fs.existsSync(dist)) {
  throw new Error('[agent-mobile-theme] dist is missing');
}

const files = [];
(function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(absolute);
    else if (entry.isFile() && entry.name.endsWith('.html')) files.push(absolute);
  }
})(dist);

const control = '<button class="agent-mobile-theme-toggle" type="button" aria-label="Switch color theme"><span>Theme</span><span aria-hidden="true">Light ↔ dark</span></button>';
let updated = 0;

for (const file of files) {
  let html = fs.readFileSync(file, 'utf8');
  if (!html.includes('agent-portfolio') || !html.includes('mobile-nav-overlay')) continue;
  if (html.includes('agent-mobile-theme-toggle')) continue;

  const marker = '</nav></div><nav class="nav-wrapper"';
  if (!html.includes(marker)) continue;

  html = html.replace(marker, `</nav>${control}</div><nav class="nav-wrapper"`);
  fs.writeFileSync(file, html, 'utf8');
  updated += 1;
}

console.log(`[agent-mobile-theme] Added the drawer theme control to ${updated} route(s).`);
