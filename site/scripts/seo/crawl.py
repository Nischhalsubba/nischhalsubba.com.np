#!/usr/bin/env python3
"""Reproduce public HTTP and static-HTML evidence without executing page scripts.

Purpose: Separate current production responses from build readiness and Google data.
Responsibilities: Crawl canonical routes, historic redirects and explicit edge cases.
Execution context: Python CLI, opt-in network checks; no forms or account mutations.
Connected files: config/canonical-routes.json, docs/seo/URL_INVENTORY.csv.
Maintenance: A timeout is an unverified response, never a fabricated HTTP status.
"""
import argparse, concurrent.futures, csv, datetime, html.parser, json, pathlib, re, urllib.error, urllib.parse, urllib.request


class Document(html.parser.HTMLParser):
    """Extract crawler-visible text, metadata, schema and crawlable links."""
    def __init__(self):
        super().__init__(); self.meta={}; self.canonical=''; self.links=[]; self.ids=[]; self.text=[]; self.title=[]; self.h1=[]; self.schema=[]; self.context=[]
    def handle_starttag(self, tag, attrs):
        """Collect attributes and maintain small text contexts for title and headings."""
        a=dict(attrs)
        if tag=='meta': self.meta[a.get('name',a.get('property',''))]=a.get('content','')
        if tag=='link' and a.get('rel')=='canonical': self.canonical=a.get('href','')
        if tag=='a' and a.get('href'): self.links.append(a['href'])
        if a.get('id'): self.ids.append(a['id'])
        if tag in ('title','h1','script','style'): self.context.append((tag,a.get('type','')))
    def handle_endtag(self, tag):
        """End a matching extraction context without relying on optional HTML tags."""
        if self.context and self.context[-1][0]==tag:self.context.pop()
    def handle_data(self, data):
        """Record visible server text and independently parse JSON-LD when valid."""
        tag,kind=self.context[-1] if self.context else ('','')
        if tag=='title':self.title.append(data)
        if tag=='h1':self.h1.append(data)
        if tag=='script' and kind=='application/ld+json':
            try:
                value=json.loads(data);self.schema.extend(n.get('@type','') for n in value.get('@graph',[value]))
            except (ValueError,AttributeError):pass
        if tag not in ('script','style'):self.text.append(data)


class NoRedirect(urllib.request.HTTPRedirectHandler):
    """Expose each original redirect response rather than hiding its status."""
    def redirect_request(self, request, fp, code, msg, headers, newurl):
        """Decline automatic follow-up so the destination remains auditable."""
        return None


def fetch(url):
    """Fetch one public GET with a bounded timeout and preserve errors as evidence."""
    try:
        opener=urllib.request.build_opener(NoRedirect)
        try: response=opener.open(urllib.request.Request(url,headers={'User-Agent':'Portfolio-SEO-Verification/1.0'}), timeout=25)
        except urllib.error.HTTPError as error: response=error
        with response:
            body=response.read(); headers=dict(response.headers.items()); status=response.code
        return dict(url=url,status=status,headers=headers,body=body.decode('utf-8',errors='replace'),error='')
    except Exception as error:return dict(url=url,status='',headers={},body='',error=repr(error))


def main():
    """Write a dated, per-URL baseline and crawl-link counts from actual responses."""
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--repo',type=pathlib.Path,default=pathlib.Path(__file__).resolve().parents[3]);parser.add_argument('--base',default='https://nischhalsubba.com.np');args=parser.parse_args()
    repo=args.repo;manifest=json.loads((repo/'site/config/canonical-routes.json').read_text());base=args.base.rstrip('/');stamp=datetime.datetime.now(datetime.timezone.utc).isoformat()
    paths=['/' if f=='index.html' else '/blog/' if f=='blog/index.html' else '/'+f[:-5] for f in manifest['html']]
    extra=['/robots.txt','/sitemap.xml','/assets/resume.pdf','/does-not-exist-seo-check-2026-11','/project-yarsha.html?ref=seo-audit','/projects/','/blog','/project-mokshya.html']
    historical=list(csv.DictReader((repo/'docs/audits/source-crawl.csv').open(encoding='utf-8-sig')))
    urls=sorted(set([base+p for p in paths+extra]+[r['Address'] for r in historical if r['Status Code']=='307']+['http://nischhalsubba.com.np/project-yarsha.html','https://www.nischhalsubba.com.np/project-yarsha.html']))
    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool: responses=list(pool.map(fetch,urls))
    docs={};rows=[]
    for result in responses:
        doc=Document();doc.feed(result['body']);docs[result['url']]=doc
        headers={k.lower():v for k,v in result['headers'].items()}
        row=dict(url=result['url'],status=result['status'],redirect_destination=headers.get('location',''),indexable=result['status']==200 and 'text/html' in headers.get('content-type','') and 'noindex' not in (doc.meta.get('robots','')+headers.get('x-robots-tag','')),robots=doc.meta.get('robots','')+'; '+headers.get('x-robots-tag',''),canonical=doc.canonical,title=' '.join(doc.title),meta_description=doc.meta.get('description',''),h1=' | '.join(doc.h1),word_count=len(' '.join(doc.text).split()),internal_inlinks=0,in_sitemap=result['url'] in [base+p for p in paths],schema_types=';'.join(map(str,doc.schema)),production_verified_at=stamp,gsc_inspection_status='NOT_INSPECTED',source='production',error=result['error'])
        rows.append(row)
    for row in rows:
        row['internal_inlinks']=sum(any(urllib.parse.urljoin(url,link).split('#')[0]==row['url'] for link in doc.links) for url,doc in docs.items())
    out=repo/'docs/seo';out.mkdir(parents=True,exist_ok=True)
    with (out/'URL_INVENTORY.csv').open('w',newline='') as stream:
        writer=csv.DictWriter(stream,fieldnames=list(rows[0]));writer.writeheader();writer.writerows(rows)
    # Exclude rendered HTML and incidental CDN request IDs from the public evidence log.
    safe=[{k:v for k,v in r.items() if k!='body'} for r in responses]
    (repo/'docs/audits/live-http-baseline.json').write_text(json.dumps(safe,indent=2)+'\n')
    print(json.dumps(dict(requested=len(urls),responses=sum(bool(r['status']) for r in rows),timeouts=sum(bool(r['error']) for r in rows),status_counts={str(s):sum(r['status']==s for r in rows) for s in sorted(set(r['status'] for r in rows),key=str)})))


if __name__=='__main__':main()
