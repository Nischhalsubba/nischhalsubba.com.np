/**
 * @fileoverview Consistent workspace favicon publishing.
 * Purpose: Match browser and installed-app icons to the portfolio identity.
 * Responsibilities: Copy original vector/raster icons, unify canonical head links and write the web manifest.
 * Execution context: Final workspace SEO build stage.
 * Connected files: finalize-workspace-seo.cjs and src/workspace-home/assets/favicon*.
 * Maintenance: Keep square icon sizes and stable public paths; no remote assets or font dependencies.
 */
const fs = require('node:fs');
const path = require('node:path');
/** Function contract: publishIcons
 * Purpose: Install one consistent icon family across final canonical pages.
 * Inputs: site root, build directory and canonical filenames. Side effects: writes build assets and head metadata. Returns: void.
 */
function publishIcons(root, dist, files) {
  const source = path.join(root, 'src/workspace-home/assets');
  for (const name of ['favicon.svg','favicon.ico',...['16','32','48','180','192','512'].map(size => `favicon-${size}.png`)]) fs.copyFileSync(path.join(source,name),path.join(dist,name));
  for (const name of ['favicon-light.svg','favicon-dark.svg']) fs.copyFileSync(path.join(source,'favicon.svg'),path.join(dist,name));
  const manifest = {name:'Nischhal Raj Subba — Product Design Portfolio',short_name:'Nischhal',description:'Product design portfolio of Nischhal Raj Subba, Nepal.',start_url:'/',scope:'/',display:'standalone',background_color:'#07070a',theme_color:'#07070a',icons:[{src:'/favicon-192.png',sizes:'192x192',type:'image/png',purpose:'any'},{src:'/favicon-512.png',sizes:'512x512',type:'image/png',purpose:'any'}]};
  fs.writeFileSync(path.join(dist,'site.webmanifest'),JSON.stringify(manifest,null,2)+'\n');
  const links = '<link rel="icon" href="/favicon.ico" sizes="16x16 32x32 48x48"><link rel="icon" type="image/png" sizes="48x48" href="/favicon-48.png"><link rel="icon" type="image/svg+xml" sizes="any" href="/favicon.svg"><link rel="apple-touch-icon" sizes="180x180" href="/favicon-180.png"><link rel="manifest" href="/site.webmanifest">';
  for (const file of files) {
    const target=path.join(dist,file);let html=fs.readFileSync(target,'utf8');
    html=html.replace(/\s*<link\b[^>]*rel=["'](?:shortcut\s+icon|icon|apple-touch-icon|apple-touch-icon-precomposed|mask-icon|manifest)["'][^>]*>/gi,'');
    fs.writeFileSync(target,html.replace('</head>',links+'\n</head>'));
  }
}
module.exports = { publishIcons };
