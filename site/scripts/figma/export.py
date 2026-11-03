#!/usr/bin/env python3
"""Resume private, native-resolution PNG exports through the official Figma REST API.

Purpose: Provide a usable bulk alternative when MCP image transport or plan limits block exports.
Responsibilities: Read known-node inventory, retry bounded 429/5xx failures, persist PNGs and hashes.
Execution context: Private operator machine with an already authorized scoped FIGMA_ACCESS_TOKEN.
Connected files: inventory.py, docs/audits/figma-screen-inventory.csv, artifacts/figma-exports.
Maintenance: Never commit tokens, temporary URLs or originals; export does not grant publication rights.
"""
import argparse, csv, hashlib, json, os, pathlib, re, struct, time, urllib.error, urllib.parse, urllib.request


def request(url, token=None):
    """Fetch with bounded backoff, authenticating only the official REST origin."""
    for attempt in range(5):
        try:
            headers={'X-Figma-Token':token} if token and url.startswith('https://api.figma.com/') else {}
            with urllib.request.urlopen(urllib.request.Request(url,headers=headers),timeout=45) as response:
                if response.status!=200:raise RuntimeError(f'Expected HTTP 200, received {response.status}')
                return response.read()
        except urllib.error.HTTPError as error:
            if error.code not in (429,500,502,503,504) or attempt==4:raise RuntimeError(f'HTTP {error.code}; check authorized file access/plan') from None
            retry=error.headers.get('Retry-After','')
            delay=min(60,int(retry)) if retry.isdigit() else min(60,2**attempt*2)
            time.sleep(delay)
    raise RuntimeError('Export retry budget exhausted')


def main():
    """Export only inventoried nodes into ignored storage; save a resumable JSONL log."""
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--inventory',type=pathlib.Path,default=pathlib.Path('docs/audits/figma-screen-inventory.csv'))
    parser.add_argument('--output',type=pathlib.Path,default=pathlib.Path('artifacts/figma-exports-rest'))
    parser.add_argument('--file-key',action='append');parser.add_argument('--limit',type=int);parser.add_argument('--execute',action='store_true')
    args=parser.parse_args();rows=[r for r in csv.DictReader(args.inventory.open()) if r['export_intent']=='PRIVATE_ARCHIVE' and (not args.file_key or r['fileKey'] in args.file_key)]
    if args.limit:rows=rows[:args.limit]
    if not args.execute:
        print(json.dumps({'mode':'DRY_RUN','candidate_nodes':len(rows),'files':len(set(r['fileKey'] for r in rows)),'publication':'NOT_AUTHORIZED_BY_EXPORT','next':'Run --execute only with an already authorized scoped token in the environment.'}));return
    token=os.environ.get('FIGMA_ACCESS_TOKEN')
    if not token:raise SystemExit('BLOCKED: no scoped FIGMA_ACCESS_TOKEN in the private environment. No export was attempted. Do not paste tokens into chat or commit them.')
    args.output.mkdir(parents=True,exist_ok=True)
    exported=skipped=failed=0
    with (args.output/'export-log.jsonl').open('a') as log:
        for file_key in sorted(set(r['fileKey'] for r in rows)):
            selected=[r for r in rows if r['fileKey']==file_key]
            for offset in range(0,len(selected),20):
                batch=selected[offset:offset+20];pending=[]
                for row in batch:
                    target=args.output/file_key/row['page_id'].replace(':','-')/(row['screen_node_id'].replace(':','-')+'.png')
                    if target.exists() and target.read_bytes()[:8]==b'\x89PNG\r\n\x1a\n':skipped+=1
                    else:pending.append((row,target))
                if not pending:continue
                params=urllib.parse.urlencode({'ids':','.join(r['screen_node_id'] for r,_ in pending),'format':'png','scale':'1'})
                try:
                    result=json.loads(request(f'https://api.figma.com/v1/images/{file_key}?{params}',token))
                    if result.get('err'):raise RuntimeError(str(result['err']))
                except Exception as error:
                    failed+=len(pending);log.write(json.dumps({'fileKey':file_key,'ids':[r['screen_node_id'] for r,_ in pending],'status':'BLOCKED','error':str(error)})+'\n');log.flush();continue
                for row,target in pending:
                    record={'fileKey':file_key,'nodeId':row['screen_node_id']}
                    try:
                        url=result.get('images',{}).get(row['screen_node_id'])
                        if not url or not url.startswith('https://'):raise RuntimeError('No HTTPS render returned')
                        data=request(url)
                        if data[:8]!=b'\x89PNG\r\n\x1a\n':raise RuntimeError('Downloaded bytes are not PNG')
                        width,height=struct.unpack('>II',data[16:24])
                        if abs(width-float(row['width']))>1 or abs(height-float(row['height']))>1:raise RuntimeError('Native-resolution dimensions differ from inventory; review before accepting')
                        target.parent.mkdir(parents=True,exist_ok=True);target.write_bytes(data)
                        record.update(status='PNG_PERSISTED',width=width,height=height,sha256=hashlib.sha256(data).hexdigest(),local_path=str(target));exported+=1
                    except Exception as error:record.update(status='FAILED',error=str(error));failed+=1
                    log.write(json.dumps(record)+'\n');log.flush()
    print(json.dumps(dict(persisted=exported,resumed_existing=skipped,failed=failed)))
    if failed:raise SystemExit(1)


if __name__=='__main__':main()
