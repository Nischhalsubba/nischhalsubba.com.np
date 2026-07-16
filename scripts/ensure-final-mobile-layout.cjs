const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const targetRoot = process.argv.includes('--dist') ? path.join(root, 'dist') : root;
const stylesheetPath = path.join(targetRoot, 'style.css');
const marker = '/* nrs-final-mobile-layout-v1 */';

if (!fs.existsSync(stylesheetPath)) {
  throw new Error(`Missing stylesheet: ${path.relative(root, stylesheetPath)}`);
}

const rules = `${marker}
@media (max-width: 850px) {
  body main.container > .hero-section:first-child,
  body main.container > .nrs-home-hero:first-child,
  body main.container > .nrs-home-hero-clean:first-child {
    display: grid !important;
    min-height: 0 !important;
    height: auto !important;
    margin-top: 0 !important;
    padding-top: 96px !important;
    padding-bottom: 48px !important;
    align-content: start !important;
    align-items: start !important;
    justify-content: initial !important;
    place-content: start !important;
  }

  body main.container > .hero-section:first-child > :first-child,
  body main.container > .nrs-home-hero:first-child > :first-child,
  body main.container > .nrs-home-hero-clean:first-child > :first-child {
    margin-top: 0 !important;
  }

  body main.container > .hero-section:first-child h1,
  body main.container > .nrs-home-hero:first-child h1,
  body main.container > .nrs-home-hero-clean:first-child h1 {
    margin-top: 0 !important;
  }
}
`;

let stylesheet = fs.readFileSync(stylesheetPath, 'utf8');
stylesheet = stylesheet
  .replace(/\/\* nrs-final-mobile-layout-v\d+ \*\/[\s\S]*$/g, '')
  .trimEnd();
stylesheet += `\n\n${rules}`;
fs.writeFileSync(stylesheetPath, stylesheet, 'utf8');
console.log(`Applied final mobile layout contract to ${path.relative(root, stylesheetPath)}.`);
