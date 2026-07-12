const fs = require('node:fs');
const path = require('node:path');

const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

const requiredFiles = [
  'index.html',
  'projects.html',
  'services.html',
  'about.html',
  'contact.html',
  'blog/index.html',
  'style.css',
  'script.js',
  'assets/resume.pdf',
  'robots.txt