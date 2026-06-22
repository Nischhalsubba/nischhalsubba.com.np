const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const targets = ['index.html', 'home-v2.html'];

const section = `
      <section class="section-container reveal-on-scroll" aria-labelledby="site-proof-heading" style="border-top:1px solid var(--border-faint);">
        <div style="max-width:900px;margin:0 auto;text-align:center;">
          <p class="eyebrow" style="color:var(--text-tertiary);text-transform:uppercase;letter-spacing:.14em;">Proof and discovery</p>
          <h2 id="site-proof-heading" class="section-title">Clear product design, developer-ready handoff, and machine-readable profile data.</h2>
          <p class="section-lead" style="margin:18px auto 0;">This portfolio includes human-readable case studies plus discovery files such as <a href="/llms.txt">llms.txt</a> and <a href="/ai-profile.json">ai-profile.json</a> so search engines, AI tools, and hiring teams can understand the site structure, project scope, and contact information without guessing.</p>
        </div>
      </section>`;

for (const target of targets) {
  const filePath = path.join(root, target);
  if (!fs.existsSync(filePath)) continue;

  let html = fs.readFileSync(filePath, 'utf8');
  if (!html.includes('developer-ready handoff')) {
    html = html.replace('      <section class="section-container reveal-on-scroll" style="text-align:center;padding-bottom:110px;">', `${section}\n      <section class="section-container reveal-on-scroll" style="text-align:center;padding-bottom:110px;">`);
  }
  fs.writeFileSync(filePath, html, 'utf8');
}

console.log('Ensured homepage audit positioning copy.');
