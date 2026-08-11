/**
 * @fileoverview scripts/enforce-canonical-routes.cjs
 * Purpose: Node-based build, content transformation, QA, or maintenance tool for enforce canonical routes.
 * Responsibilities:
 * - Own the behavior/content implied by this file's single responsibility.
 * - Keep public routes, build contracts, and imported module boundaries stable unless the connected owners are updated together.
 * Execution context: Node.js CLI during local development, CI, build, or maintenance.
 * Connected files:
 * - docs/repository/file-catalog.md
 * - package.json
 * - scripts/build-dist.cjs
 * Maintenance: Update this header when responsibility or dependencies change; generated/vendor files are documented at their source instead.
 */
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const dist=path.join(root,'dist');
const publicDir=path.join(root,'public');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'config','canonical-routes.json'),'utf8'));
const errors=[];

for(const file of manifest.legacy){
  const target=path.join(dist,file);
  if(fs.existsSync(target))fs.rmSync(target,{force:true});
}
for(const file of manifest.html){
  if(!fs.existsSync(path.join(root,file)))errors.push(`Missing canonical source: ${file}`);
  if(!fs.existsSync(path.join(dist,file)))errors.push(`Missing production route: ${file}`);
  if(fs.existsSync(path.join(publicDir,file)))errors.push(`Public copy duplicates canonical route: public/${file}`);
}
for(const file of manifest.legacy){
  if(fs.existsSync(path.join(dist,file)))errors.push(`Legacy route survived build: ${file}`);
}
for(const name of ['audit-remediations.css','stable-layout.css','final-ui-fixes.css','layout-integrity.css']){
  if(fs.existsSync(path.join(dist,name)))errors.push(`Retired stylesheet survived build: ${name}`);
}
if(errors.length){
  console.error('Canonical route audit failed:\n- '+errors.join('\n- '));
  process.exit(1);
}
console.log(`Canonical route audit passed for ${manifest.html.length} routes; ${manifest.legacy.length} legacy outputs removed.`);
