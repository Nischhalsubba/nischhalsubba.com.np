const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const base = process.argv.includes('--dist') ? path.join(root, 'dist') : root;
const stylePath = path.join(base, 'style.css');
if (!fs.existsSync(stylePath)) throw new Error('[service-containment-v9] Missing style.css');

const start = '/* nrs-service-containment-v9:start */';
const end = '/* nrs-service-containment-v9:end */';
const marker = /\/\* nrs-service-containment-v\d+:start \*\/[\s\S]*?\/\* nrs-service-containment-v\d+:end \*\//g;

const css = `${start}
/* The Services action rows used max-content sizing from an older layer. Keep links
   readable, but let them wrap inside the service column instead of widening the page. */
html,
body.agent-portfolio {
  max-width: 100% !important;
  overflow-x: clip !important;
}
.agent-portfolio .nrs-editorial-services,
.agent-portfolio .nrs-editorial-services > *,
.agent-portfolio .nrs-editorial-services .agent-frame,
.agent-portfolio .nrs-editorial-services .agent-service-grid,
.agent-portfolio .nrs-editorial-services .agent-service {
  box-sizing: border-box !important;
  min-width: 0 !important;
  max-width: 100% !important;
}
.agent-portfolio .nrs-editorial-services .agent-service-grid {
  width: 100% !important;
  overflow: hidden !important;
}
.agent-portfolio .nrs-editorial-services .agent-service-actions {
  display: flex !important;
  flex-wrap: wrap !important;
  align-items: baseline !important;
  gap: .55rem 1rem !important;
  width: 100% !important;
  min-width: 0 !important;
  max-width: 100% !important;
}
.agent-portfolio .nrs-editorial-services :is(.agent-service-link,.agent-service-proof) {
  display: inline-flex !important;
  min-width: 0 !important;
  max-width: 100% !important;
  white-space: normal !important;
  overflow-wrap: anywhere !important;
  word-break: normal !important;
}
.agent-portfolio .nrs-editorial-services .agent-service-proof {
  flex: 1 1 12rem !important;
}
.agent-portfolio .nrs-editorial-services .agent-service-link {
  flex: 0 1 auto !important;
}
.agent-portfolio .nrs-editorial-services .agent-page-hero-grid > *,
.agent-portfolio .nrs-editorial-services .agent-capabilities > *,
.agent-portfolio .nrs-editorial-services .agent-contact-strip > * {
  min-width: 0 !important;
  max-width: 100% !important;
}
@media (max-width: 700px) {
  .agent-portfolio .nrs-editorial-services .agent-service-actions {
    display: grid !important;
    grid-template-columns: minmax(0, 1fr) !important;
    gap: .45rem !important;
  }
  .agent-portfolio .nrs-editorial-services :is(.agent-service-link,.agent-service-proof) {
    width: fit-content !important;
    max-width: 100% !important;
  }
}
${end}`;

let style = fs.readFileSync(stylePath, 'utf8');
style = style.replace(marker, '').trimEnd();
style += `\n\n${css}\n`;
fs.writeFileSync(stylePath, style, 'utf8');
console.log('[service-containment-v9] Locked Services to the viewport and made action links wrap safely.');
