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
