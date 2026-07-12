const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const targetRoot = process.argv.includes('--dist') ? path.join(root, 'dist') : root;
const stylesheetPath = path.join(targetRoot, 'style.css');
const fragmentFiles = [
  path.join(root, 'src', 'styles', 'inner-page-system.css'),
  path.join(root, 'src', 'styles', 'case-study-system.css'),
];
const startMarker = '/* nrs-single-source-inner-pages-v50:compiled:start */';
const endMarker = '/* nrs-single-source-inner-pages-v50:compiled:end */';

let stylesheet = fs.readFileSync(stylesheetPath, 'utf8');
const fragments = fragmentFiles
  .filter((file) => fs.existsSync(file))
  .map((file) => fs.readFileSync(file, 'utf8').trim())
  .filter(Boolean)
  .join('\n\n');

stylesheet = stylesheet
  .replace(/^\s*500;600;700;800&display=swap'\);\s*$/m, '')
  .replace(/Version:\s*[0-9.]+/, 'Version: 50.0')
  .replace(/\/\* nrs-single-source-inner-pages-v\d+:compiled:start \*\/[\s\S]*?\/\* nrs-single-source-inner-pages-v\d+:compiled:end \*\/\s*/g, '')
  .trimEnd();

stylesheet += `\n\n${startMarker}\n${fragments}\n${endMarker}\n`;
fs.writeFileSync(stylesheetPath, stylesheet, 'utf8');
console.log(`Compiled the redesigned visual system into ${path.relative(root, stylesheetPath) || 'style.css'}.`);
