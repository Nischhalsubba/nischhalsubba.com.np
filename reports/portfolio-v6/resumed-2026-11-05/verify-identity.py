"""Independent final-HTML/byte acceptance for current biography and deterministic favicon delivery."""
from pathlib import Path
from html.parser import HTMLParser
import hashlib,json,re,struct
ROOT=Path(__file__).resolve().parents[3]/'site'
class Head(HTMLParser):
 def __init__(self):super().__init__();self.links=[];self.meta={}
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=='link':self.links.append(a)
  if tag=='meta':self.meta[a.get('name',a.get('property',''))]=a.get('content','')
manifest=json.loads((ROOT/'config/canonical-routes.json').read_text());expected={'/favicon.ico','/favicon-48.png','/favicon.svg','/favicon-180.png'}
for file in manifest['html']:
 html=(ROOT/'dist'/file).read_text();assert not re.search(r'#3 · Uxcel 2023|Third place in.{0,50}Product Designer',html),(file,'unsupported exact 2023 place');h=Head();h.feed(html);icons={a.get('href')for a in h.links if 'icon'in a.get('rel','')};assert expected<=icons,(file,icons)
 for key in ['description','og:description','twitter:description']:assert not re.search(r'based in Kathmandu|Kathmandu-based',h.meta.get(key,'')),(file,key)
for size in [16,32,48,180,192,512]:
 name=f'favicon-{size}.png';src=(ROOT/'src/workspace-home/assets'/name).read_bytes();dest=(ROOT/'dist'/name).read_bytes();assert hashlib.sha256(src).digest()==hashlib.sha256(dest).digest();assert dest[:8]==b'\x89PNG\r\n\x1a\n';assert struct.unpack('>II',dest[16:24])==(size,size)
ico=(ROOT/'dist/favicon.ico').read_bytes();assert struct.unpack('<HHH',ico[:6])==(0,1,3)
for n,size in enumerate([16,32,48]):
 width,height,colors,reserved,planes,bits,length,offset=struct.unpack('<BBBBHHII',ico[6+n*16:22+n*16]);assert(width,height)==(size,size);png=ico[offset:offset+length];assert png[:8]==b'\x89PNG\r\n\x1a\n';assert struct.unpack('>II',png[16:24])==(size,size)
assert (ROOT/'dist/favicon.svg').read_bytes()==(ROOT/'src/workspace-home/assets/favicon.svg').read_bytes()
humans=(ROOT/'dist/humans.txt').read_text();assert 'Location: Nepal'in humans;assert 'Role: Senior Product Designer'in humans
about=(ROOT/'dist/about.html').read_text();assert 'Nepal-based product designer working remotely'in about;assert 'The résumé behind 7+ years'in about

contact=(ROOT/'dist/contact.html').read_text()
assert 'Based in</span><p>Nepal' in contact or 'Nepal · remote-friendly' in contact, 'Contact current location must use Nepal'
assert not re.search(r'<strong>KTM</strong>|Kathmandu, Nepal · remote-friendly|Kathmandu · remote-friendly',about+contact), 'Current location labels must not reintroduce Kathmandu/KTM'
assert not re.search(r'#3 · Uxcel 2023|Third place in.{0,50}Product Designer', (ROOT/'src/workspace-home/index.html').read_text()+(ROOT/'scripts/spacious-pages/about.cjs').read_text()), 'Source statements must preserve only verified Top 10 placement'
print('Identity contract passed: 54 canonical icon declarations and current descriptions; six PNG sizes, three ICO frames, SVG source parity, current biography and humans.txt.')
