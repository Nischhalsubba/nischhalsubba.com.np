"""Read-only production HTTP audit; preserve fetched evidence and redirect hops."""
import concurrent.futures,datetime,hashlib,json,pathlib,urllib.request,urllib.error,urllib.parse,xml.etree.ElementTree as ET
from html.parser import HTMLParser
BASE='https://nischhalsubba.com.np'; OUT=pathlib.Path(__file__).resolve().parent
class HTML(HTMLParser):
 def __init__(self):super().__init__(convert_charrefs=True);self.meta={};self.links=[];self.images=[];self.h1=[];self.title='';self.current=None;self.schema=[];self.buf=''
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=='meta':self.meta[a.get('name',a.get('property',''))]=a.get('content','')
  if tag=='link'and a.get('rel')=='canonical':self.canonical=a.get('href')
  if tag=='link'and 'icon'in a.get('rel',''):self.links.append({'kind':'icon','href':a.get('href')})
  if tag=='a':self.links.append({'kind':'anchor','href':a.get('href')})
  if tag=='img':self.images.append(a)
  if tag in ['h1','title']or(tag=='script'and a.get('type')=='application/ld+json'):self.current=tag;self.buf=''
 def handle_data(self,data):
  if self.current:self.buf+=data
 def handle_endtag(self,tag):
  if tag!=self.current:return
  if tag=='h1':self.h1.append(self.buf.strip())
  elif tag=='title':self.title=self.buf.strip()
  elif tag=='script':
   try:self.schema.append(json.loads(self.buf))
   except:self.schema.append({'invalid_json':True})
  self.current=None;self.buf=''
class Redirects(urllib.request.HTTPRedirectHandler):
 def __init__(self):self.hops=[]
 def redirect_request(self,req,fp,code,msg,headers,newurl):self.hops.append({'url':req.full_url,'status':code,'location':newurl});return super().redirect_request(req,fp,code,msg,headers,newurl)
def fetch(url):
 h=Redirects();opener=urllib.request.build_opener(h);req=urllib.request.Request(url,headers={'User-Agent':'NischhalPortfolioQA/6.1 (owner-authorized read-only audit)'})
 try:
  with opener.open(req,timeout=35)as r:return {'requested':url,'url':r.url,'status':r.status,'headers':dict(r.headers),'hops':h.hops,'body':r.read()}
 except Exception as e:return {'requested':url,'error':str(e),'hops':h.hops}
def audit(file):
 route='/'if file=='index.html'else '/blog/'if file=='blog/index.html'else '/'+file.removesuffix('.html');r=fetch(BASE+route);body=r.pop('body',b'');r['sha256']=hashlib.sha256(body).hexdigest();r['bytes']=len(body);r['file']=file
 if body:
  p=HTML();p.feed(body.decode('utf-8'));r.update(title=p.title,meta=p.meta,canonical=getattr(p,'canonical',None),h1=p.h1,schemas=p.schema,images=p.images,links=p.links)
 return r
manifest=json.load(open('site/config/canonical-routes.json'))
with concurrent.futures.ThreadPoolExecutor(max_workers=6)as pool:pages=list(pool.map(audit,manifest['html']))
paths=['/build-info.json','/sitemap.xml','/robots.txt','/humans.txt','/favicon.ico','/favicon-48.png','/favicon.svg','/assets/resume.pdf','/workspace-home/assets/resume.pdf','/blog-design-systems-front-end.html','/about.html']
resources=[];sitemap_urls=[]
for path in paths:
 r=fetch(BASE+path);body=r.pop('body',b'');r.update(bytes=len(body),sha256=hashlib.sha256(body).hexdigest())
 if path.endswith('.json')or path.endswith('.txt'):r['text']=body.decode('utf-8',errors='replace')
 if path=='/sitemap.xml'and body:
  root=ET.fromstring(body);sitemap_urls=[x.text for x in root.findall('{http://www.sitemaps.org/schemas/sitemap/0.9}url/{http://www.sitemaps.org/schemas/sitemap/0.9}loc')]
 resources.append(r)
r=fetch('https://www.nischhalsubba.com.np/about.html?audit=6');r.pop('body',None);resources.append(r)
expected={BASE+('/'if f=='index.html'else '/blog/'if f=='blog/index.html'else '/'+f.removesuffix('.html'))for f in manifest['html']}
failures=[{'route':p['requested'],'error':p.get('error'),'status':p.get('status'),'canonical':p.get('canonical'),'h1_count':len(p.get('h1',[]))}for p in pages if p.get('status')!=200 or p.get('canonical')!=p['requested']or len(p.get('h1',[]))!=1 or not p.get('title')or not p.get('meta',{}).get('description')]
report={'observedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'pages':pages,'resources':resources,'sitemap':{'count':len(sitemap_urls),'missing':sorted(expected-set(sitemap_urls)),'extra':sorted(set(sitemap_urls)-expected)},'failures':failures}
(OUT/'production-http.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps({'pages':len(pages),'sitemap':report['sitemap'],'failures':failures,'redirects':[r for r in resources if r['hops']]},indent=2));raise SystemExit(bool(failures or report['sitemap']['missing']or report['sitemap']['extra']))
