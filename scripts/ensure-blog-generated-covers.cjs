const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const SITE_URL = 'https://nischhalsubba.com.np';

const COVER_BY_TOPIC = [
  {
    match: /saas|dashboard|empty-state|empty-states|enterprise|metric|data-dense/i,
    src: '/assets/images/blog-saas-empty-states-cover.png',
    alt: 'Generated product design cover showing SaaS dashboard empty states and product clarity artifacts',
  },
  {
    match: /handoff|figma|design-system|design-systems|front-end|developer/i,
    src: '/assets/images/blog-design-systems-handoff-cover.png',
    alt: 'Generated product design cover showing design system components, handoff notes, and interface states',
  },
  {
    match: /web3|wallet|crypto|transaction|governance/i,
    src: '/assets/images/blog-web3-wallet-ux-cover.png',
    alt: 'Generated product design cover showing Web3 wallet review, permissions, and trust-focused interface states',
  },
  {
    match: /audit|accessibility|research|redesign|emerging/i,
    src: '/assets/images/blog-ux-audit-research-cover.png',
    alt: 'Generated product design cover showing UX audit boards, research notes, and prioritization artifacts',
  },
  {
    match: /service|website|pricing|plans|software-companies|business/i,
    src: '/assets/images/blog-service-pricing-ux-cover.png',
    alt: 'Generated product design cover showing service website structure, pricing panels, and conversion paths',
  },
];

const DEFAULT_COVER = COVER_BY_TOPIC[1];

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(fullPath);
    return entry.isFile() && entry.name.endsWith('.html') ? [fullPath] : [];
  });
}

function pageKey(filePath, html) {
  const title = html.match(/<title>(.*?)<\/title>/is)?.[1] || '';
  const h1 = html.match(/<h1[^>]*>(.*?)<\/h1>/is)?.[1] || '';
  return `${filePath} ${title} ${h1}`.replace(/<[^>]*>/g, ' ');
}

function pickCover(filePath, html) {
  const key = pageKey(filePath, html);
  return COVER_BY_TOPIC.find((cover) => cover.match.test(key)) || DEFAULT_COVER;
}

function absolute(src) {
  return `${SITE_URL}${src}`;
}

function upsertMeta(html, selector, attrs) {
  const attrText = Object.entries(attrs).map(([key, value]) => `${key}="${value}"`).join(' ');
  const tag = `<meta ${attrText}>`;
  const regex = selector === 'og:image'
    ? /<meta[^>]+property=["']og:image["'][^>]*>/i
    : /<meta[^>]+name=["']twitter:image["'][^>]*>/i;

  if (regex.test(html)) return html.replace(regex, tag);
  return html.replace(/<\/head>/i, `${tag}</head>`);
}

function updateJsonLdImages(html, cover) {
  return html.replace(/<script type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi, (match, rawJson) => {
    try {
      const data = JSON.parse(rawJson.trim());
      const setImage = (node) => {
        if (node && typeof node === 'object') {
          if (['Article', 'BlogPosting'].includes(node['@type']) || node.headline) {
            node.image = absolute(cover.src);
          }
          Object.values(node).forEach((value) => {
            if (Array.isArray(value)) value.forEach(setImage);
            else setImage(value);
          });
        }
      };
      setImage(data);
      return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
    } catch {
      return match;
    }
  });
}

function replaceExistingCover(html, cover) {
  const imgRegex = /<img\b([^>]*?)\bsrc=["']([^"']*(?:unsplash|blog-[^"']+\.(?:svg|png))[^"']*)["']([^>]*)>/i;
  if (!imgRegex.test(html)) return html;

  return html.replace(imgRegex, (match, before, _src, after) => {
    let next = match
      .replace(/\bsrc=["'][^"']+["']/i, `src="${cover.src}"`)
      .replace(/\balt=["'][^"']*["']/i, `alt="${cover.alt}"`);

    if (!/\balt=/i.test(next)) next = next.replace('<img ', `<img alt="${cover.alt}" `);
    if (!/\bclass=/i.test(next)) next = next.replace('<img ', '<img class="nrs-blog-cover-img" ');
    if (!/\bloading=/i.test(next)) next = next.replace('<img ', '<img loading="eager" ');
    if (!/\bdecoding=/i.test(next)) next = next.replace('<img ', '<img decoding="async" ');
    if (!/\bwidth=/i.test(next)) next = next.replace('<img ', '<img width="1600" ');
    if (!/\bheight=/i.test(next)) next = next.replace('<img ', '<img height="900" ');
    return next;
  });
}

function insertCover(html, cover) {
  if (/<img\b[^>]+src=["'][^"']*blog-[^"']+\.(?:png|svg)["']/i.test(html)) return html;

  const figure = `<figure class="nrs-blog-cover"><img class="nrs-blog-cover-img" src="${cover.src}" alt="${cover.alt}" width="1600" height="900" loading="eager" decoding="async"></figure>`;

  if (/<p class=["']body-large["'][^>]*>[\s\S]*?<\/p>/i.test(html)) {
    return html.replace(/(<p class=["']body-large["'][^>]*>[\s\S]*?<\/p>)/i, `$1${figure}`);
  }

  if (/<h1[^>]*>[\s\S]*?<\/h1>/i.test(html)) {
    return html.replace(/(<h1[^>]*>[\s\S]*?<\/h1>)/i, `$1${figure}`);
  }

  return html;
}

function processFile(filePath) {
  if (path.basename(filePath) === 'index.html') return false;

  const original = fs.readFileSync(filePath, 'utf8');
  if (!/<article\b/i.test(original) && !/blog/i.test(filePath)) return false;

  const cover = pickCover(filePath, original);
  let html = original;
  html = upsertMeta(html, 'og:image', { property: 'og:image', content: absolute(cover.src) });
  html = upsertMeta(html, 'twitter:image', { name: 'twitter:image', content: absolute(cover.src) });
  html = updateJsonLdImages(html, cover);
  html = replaceExistingCover(html, cover);
  html = insertCover(html, cover);

  if (html === original) return false;
  fs.writeFileSync(filePath, html);
  return true;
}

const files = [
  ...walk(path.join(ROOT, 'blog')),
  ...walk(path.join(ROOT, 'public', 'blog')),
  ...fs.readdirSync(ROOT)
    .filter((name) => /^blog-.+\.html$/.test(name))
    .map((name) => path.join(ROOT, name)),
];

let changed = 0;
for (const file of files) {
  if (processFile(file)) changed += 1;
}

const tempPost = path.join(ROOT, 'blog', 'test-empty-state-temp.html');
if (fs.existsSync(tempPost)) {
  fs.unlinkSync(tempPost);
  changed += 1;
}

console.log(`Ensured generated blog covers on ${changed} file(s).`);
