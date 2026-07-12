const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const targetRoot = process.argv.includes('--dist') ? path.join(root, 'dist') : root;
const stylesheetPath = path.join(targetRoot, 'style.css');
const fragmentPath = path.join(root, 'src', 'styles', 'inner-page-system.css');
const startMarker = '/* nrs-single-source-inner-pages-v50:compiled:start */';
const endMarker = '/* nrs-single-source-inner-pages-v50:compiled