from pathlib import Path
from PIL import Image
import json,hashlib,shutil
root=Path(__file__).resolve().parents[3];capture=root/'reports/portfolio-v6/acquisition/hamro-live-20261105';out=root/'site/assets/images/site-captures';out.mkdir(exist_ok=True)
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
viewport=capture/'viewport-1440.png';im=Image.open(viewport).convert('RGB');prefix='hamro-current-demo-'+sha(viewport)[:12];variants=[]
for width in [640,960,1440]:
 height=round(im.height*width/im.width);file=out/f'{prefix}-{width}.webp';im.resize((width,height),Image.Resampling.LANCZOS).save(file,'WEBP',quality=88,method=6);variants.append({'src':'/assets/images/site-captures/'+file.name,'width':width,'height':height,'sha256':sha(file),'bytes':file.stat().st_size})
png=out/f'{prefix}-1440.png';shutil.copyfile(viewport,png)
original=capture/'1440.png';full=out/('hamro-current-demo-full-'+sha(original)[:12]+'.png');shutil.copyfile(original,full)
record={'id':'hamro-current-demo','route':'/project-hamro-idea','sourceUrl':'https://hamro-idea-website.vercel.app/','capturedAt':json.load(open(str(viewport)+'.json'))['capturedAt'],'sourceViewport':{'width':1440,'height':900},'sourceSha256':sha(viewport),'fullOriginalSha256':sha(original),'permission':'OWNER_REQUESTED_PUBLIC_DEMO_CAPTURE','roleBoundary':'Current public demo; separate from earlier studio contribution. This capture does not establish historical authorship.','alt':'Current Hamro Idea public demo showing its navigation, blue gradient hero, service positioning and project-call actions.','caption':'Current public Hamro Idea demo, independently captured on 5 November 2026. Earlier studio work is described separately in this case.','variants':variants,'socialSrc':'/assets/images/site-captures/'+png.name,'fullOriginal':'/assets/images/site-captures/'+full.name,'processing':'Whole viewport resized and encoded as WebP; no cropping, drawing, redaction or UI content changes. Original viewport PNG and full-page PNG retained.'}
(root/'site/src/content/public-site-captures.json').write_text(json.dumps([record],indent=2)+'\n')
print('Exported variants:',[(v['width'],v['bytes'])for v in variants])
