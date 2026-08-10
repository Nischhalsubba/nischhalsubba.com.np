const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const base = process.argv.includes('--dist') ? path.join(root, 'dist') : root;
const stylePath = path.join(base, 'style.css');

if (!fs.existsSync(base) || !fs.existsSync(stylePath)) {
  throw new Error('[experience-links-v25] Missing build output or style.css.');
}

const companies = [
  ['Idealaya', 'https://idealaya.com/'],
  ['Mokshya Protocol', 'https://mokshya.io/'],
  ['Tegzy', 'https://www.tegzy.com.au/'],
  ['ESR Tech', 'https://esrtech.io/'],
  ['ThemeGrill', 'https://themegrill.com/'],
  ['Gurzu', 'https://gurzu.com/'],
];

function htmlFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return htmlFiles(full);
    return entry.isFile() && entry.name.endsWith('.html') ? [full] : [];
  });
}

let linkedFiles = 0;
for (const file of htmlFiles(base)) {
  let html = fs.readFileSync(file, 'utf8');
  if (!html.includes('nrs-experience-list')) continue;

  const before = html;
  for (const [name, url] of companies) {
    const plain = `<strong>${name}</strong>`;
    const linked = `<a class="nrs-company-link" href="${url}" target="_blank" rel="noopener noreferrer external" aria-label="${name} official website, opens in a new tab"><strong>${name}</strong><span class="nrs-company-link-arrow" aria-hidden="true">↗</span></a>`;
    if (html.includes(plain)) html = html.replace(plain, linked);
  }

  if (html !== before) {
    for (const [name, url] of companies) {
      if (!html.includes(`href="${url}"`) || !html.includes(`<strong>${name}</strong>`)) {
        throw new Error(`[experience-links-v25] Failed to link ${name} in ${file}.`);
      }
    }
    fs.writeFileSync(file, html, 'utf8');
    linkedFiles += 1;
  }
}

if (linkedFiles === 0) {
  throw new Error('[experience-links-v25] Experience section was not found in any HTML output.');
}

let css = fs.readFileSync(stylePath, 'utf8');
const marker = /\/\* nrs-experience-links-v25:start \*\/[\s\S]*?\/\* nrs-experience-links-v25:end \*\//g;
css = css.replace(marker, '').trimEnd();
css += `

/* nrs-experience-links-v25:start */
.nrs-experience-list .nrs-company-link{
  display:inline-flex!important;
  align-items:baseline!important;
  gap:.42rem!important;
  width:max-content!important;
  max-width:100%!important;
  color:inherit!important;
  text-decoration:none!important;
  text-underline-offset:.22em!important;
  text-decoration-thickness:1px!important;
  transition:color .16s cubic-bezier(.2,0,0,1)!important;
}
.nrs-experience-list .nrs-company-link strong{color:inherit!important}
.nrs-experience-list .nrs-company-link-arrow{
  display:inline-block!important;
  color:var(--accent,#ef6a2c)!important;
  font-size:.72em!important;
  line-height:1!important;
  opacity:.72!important;
  transform:translateY(-.05em)!important;
  transition:transform .16s cubic-bezier(.2,0,0,1),opacity .16s ease!important;
}
@media(hover:hover) and (pointer:fine){
  .nrs-experience-list .nrs-company-link:hover{
    color:var(--accent,#ef6a2c)!important;
    text-decoration:underline!important;
  }
  .nrs-experience-list .nrs-company-link:hover .nrs-company-link-arrow{
    opacity:1!important;
    transform:translate(.16em,-.16em)!important;
  }
}
.nrs-experience-list .nrs-company-link:focus-visible{
  color:var(--accent,#ef6a2c)!important;
  outline:2px solid var(--accent,#ef6a2c)!important;
  outline-offset:5px!important;
  border-radius:2px!important;
}
@media(prefers-reduced-motion:reduce){
  .nrs-experience-list .nrs-company-link,
  .nrs-experience-list .nrs-company-link-arrow{transition:none!important}
}
/* nrs-experience-links-v25:end */
`;
fs.writeFileSync(stylePath, css, 'utf8');
console.log(`[experience-links-v25] Linked ${companies.length} official company websites in ${linkedFiles} experience page(s).`);
