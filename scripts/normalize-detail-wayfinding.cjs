const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const targetRoot = process.argv.includes('--dist') ? path.join(root, 'dist') : root;
const serviceFiles = new Set([
  'product-design-nepal.html', 'web3-ux-designer.html', 'saas-ux-designer.html',
  'website-ux-design.html', 'figma-design-systems.html', 'ux-audit.html',
]);

function walk(dir, files = []) {