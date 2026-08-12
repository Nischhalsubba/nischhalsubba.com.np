/**
 * @fileoverview scripts/enforce-canonical-routes.cjs
 * Purpose: Apply the enforce canonical routes production transformation or maintenance step while preserving canonical source/build contracts.
 * Responsibilities:
 * - Operate deterministically on canonical source or build output so repeated runs produce stable results.
 * - Surface invalid input or contract drift as explicit failures instead of silently masking it.
 * - Keep path assumptions synchronized with repository manifests and source-layout ownership.
 * Execution context: Node.js CLI during development, generation, build, CI, or repository maintenance.
 * Connected files:
 * - package.json
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
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
