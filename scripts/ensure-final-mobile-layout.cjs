const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const targetRoot = process.argv.includes('--dist') ? path.join(root, 'dist') : root;
const stylesheetPath = path.join(targetRoot, 'style.css');
const marker = '/* nrs-final-mobile-layout-v2 */';

if (!fs.existsSync(stylesheetPath)) {
  throw new Error(`Missing stylesheet: ${path.relative