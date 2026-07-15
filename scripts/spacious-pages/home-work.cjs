const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '../..');
const targetRoot = process.argv.includes('--dist') ? path.join(root, 'dist') : root;

const proofSection = `<section id="homepage-proof-discovery" class="nrs-home-proof-v49 reveal-on-scroll" aria-labelledby="site-proof-heading">
  <div class="nrs-home-proof-v49__intro">
    <p class="eyebrow">