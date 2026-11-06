"""Replay uncropped owner-source image exports with explicit capture precision and functionality limits."""
from pathlib import Path
from PIL import Image
import hashlib,json,shutil,datetime
root=Path(__file__).resolve().parents[3];reports=root/'reports/portfolio-v6';out=root/'site/assets/images/site-captures'
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
items=[
 ('neverwinter-public-setup','neverwinter-public-setup-20261105','/project-neverwinter-parser','Public browser setup state','Neverwinter Live Parser public browser setup screen shows idle status, no connected combat log and a browser-mode notice that live monitoring requires Electron.','This independently captured public browser view is idle, with no player or combat log connected. Recorded-log analysis is offered; live folder monitoring and auto-detect require the Electron desktop app. No gameplay, Windows integration or performance outcome was verified.'),
 ('sass-public-code','sass-source-browser-20261105','/project-sassboilerplate','Public source artifact','Owner SassBoilerplate repository shows the archived app.sass entry point and its shared includes import in the actual GitHub source viewer.','This is the actual public source-code viewer for the archived Sass entry point, not a running application or evidence that the current starter builds. GitHub interface styling is not my product design.')]
records=[]
for ident,folder,route,heading,alt,boundary in items:
 source=reports/'acquisition'/folder/'1440.png';m=json.loads((source.parent/'manifest.json').read_text())[0]
 assert not m['errors'] and not m['failedResources'] and m['layoutOverflow']==0
 date=datetime.datetime.fromisoformat(m['capturedAt'].replace('Z','+00:00')).astimezone(datetime.timezone(datetime.timedelta(hours=5,minutes=45))).strftime('%-d %B %Y')
 records.append((source,{'id':ident,'kind':'OWNER_PUBLIC_SOURCE_CAPTURE','route':route,'sourceUrl':m['source'],'capturedAt':m['capturedAt'],'sourceViewport':m['viewport'],'previewHeading':heading,'evidenceLabel':heading,'sourceLinkLabel':'Open the actual public source','originalLinkLabel':'Open the complete original viewport','permission':'OWNER_REQUESTED_PUBLIC_PROJECT_CAPTURE','roleBoundary':boundary,'sourceDiagnostics':{'errors':m['errors'],'failedResources':m['failedResources'],'layoutOverflow':m['layoutOverflow']},'alt':alt,'caption':heading+', independently captured on '+date+'. '+boundary}))
source=reports/'resumed-2026-11-05/production-browser/evidence/index-1440.png'
assert sha(source)=='d80cfa9926281673059723fd1ce4d20918bfada5c0ebadd6d913062526a97a6e'
records.append((source,{'id':'portfolio-published-baseline','kind':'REUSED_VERIFIED_OWNER_CAPTURE','route':'/blog/blog-portfolio-product','sourceUrl':'https://nischhalsubba.com.np/','capturedAt':'2026-11-05T12:54:58.015Z','captureTimestampPrecision':'Timestamp of the completed production-browser batch manifest, not an exact shutter timestamp.','sourceViewport':{'width':1440,'height':900},'permission':'OWNER_REQUESTED_PUBLIC_PROJECT_CAPTURE','sourceLinkLabel':'Open the current portfolio (may differ from this dated view)','originalLinkLabel':'Open the complete original published-site viewport','roleBoundary':'Dated first-party portfolio homepage reference from the verified published baseline. It is not independent proof of historical product authorship, résumé duration or a newly deployed review branch.','alt':'Published Nischhal portfolio homepage showing the approved dark visual identity, portrait, name, product designer role and opening portfolio introduction.','caption':'My published portfolio homepage, captured in the 5 November 2026 production-browser batch. This dated first-party reference shows the approved presentation before the current review changes; it is not independent proof of experience or historical project authorship.'}))
p=root/'site/src/content/public-site-captures.json';data=json.loads(p.read_text())
for source,record in records:
 im=Image.open(source).convert('RGB');prefix=record['id']+'-'+sha(source)[:12];variants=[]
 for width in [640,960,1440]:
  height=round(im.height*width/im.width);dest=out/f'{prefix}-{width}.webp';im.resize((width,height),Image.Resampling.LANCZOS).save(dest,'WEBP',quality=78 if record['id']=='portfolio-published-baseline' else 88,method=6);variants.append({'src':'/assets/images/site-captures/'+dest.name,'width':width,'height':height,'sha256':sha(dest),'bytes':dest.stat().st_size})
 dest=out/f'{prefix}-original.png';shutil.copyfile(source,dest)
 record.update({'variants':variants,'sourceSha256':sha(source),'fullOriginalSha256':sha(source),'socialSrc':'/assets/images/site-captures/'+dest.name,'fullOriginal':'/assets/images/site-captures/'+dest.name,'processing':'Reused unchanged full-viewport PNG; WebP variants resize and encode its complete composition. No UI or image content altered.'})
 found=any(r['id']==record['id'] for r in data);data=[record if r['id']==record['id'] else r for r in data];data=data if found else data+[record]
 print(record['id'],[(v['width'],v['bytes'])for v in variants])
p.write_text(json.dumps(data,indent=2)+'\n')
