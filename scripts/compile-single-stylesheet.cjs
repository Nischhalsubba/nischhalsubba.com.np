const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const targetRoot = process.argv.includes('--dist') ? path.join(root, 'dist') : root;
const stylesheetPath = path.join(targetRoot, 'style.css');
const fragmentPath = path.join(root, 'src', 'styles', 'inner-page-system.css');
const startMarker = '/* nrs-single-source-inner-pages-v47:compiled:start */';
const endMarker = '/* nrs-single-source-inner-pages-v47:compiled:end */';

let stylesheet = fs.readFileSync(stylesheetPath, 'utf8');
const fragment = fs.readFileSync(fragmentPath, 'utf8').trim();

stylesheet = stylesheet
  .replace(/^\s*500;600;700;800&display=swap'\);\s*$/m, '')
  .replace(/Version:\s*[0-9.]+/, 'Version: 47.0')
  .replace(new RegExp(`${startMarker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\\s\\S]*?${endMarker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*`, 'g'), '')
  .trimEnd();

stylesheet += `\n\n${startMarker}\n${fragment}\n${endMarker}\n`;
fs.writeFileSync(stylesheetPath, stylesheet, 'utf8');

console.log(`Compiled the inner-page design system into ${path.relative(root, stylesheetPath) || 'style.css'}.`);
