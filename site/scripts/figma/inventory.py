#!/usr/bin/env python3
"""Build an honest, resumable screen inventory from private Figma MCP metadata.

Purpose: Keep public evidence counts independent from renders and failed downloads.
Responsibilities: Classify outer screen candidates, record page blockers, and hash real PNGs.
Execution: Python CLI; raw metadata and originals stay outside deployment and git.
Connected files: docs/audits/figma-*.csv and artifacts/figma-exports.
Maintenance: Size/name heuristics identify candidates, never publication approval.
"""
import argparse, csv, hashlib, json, pathlib, re, struct
import xml.etree.ElementTree as ET


def write_csv(path, rows, fields):
    """Write a complete UTF-8 CSV, including empty inventories with their schema."""
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open('w', newline='', encoding='utf-8') as stream:
        writer = csv.DictWriter(stream, fieldnames=fields, extrasaction='ignore')
        writer.writeheader()
        writer.writerows(rows)


def inspect_page(job, response):
    """Parse one observed page; strip invalid XML control characters, retaining IDs."""
    text = '\n'.join(c.get('text', '') for c in response.get('value', {}).get('content', []) if c.get('type') == 'text')
    if '<canvas' not in text:
        return None, text or str(response.get('reason', 'No metadata returned'))
    text = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f]', '', text)
    try:
        return ET.fromstring(text[text.index('<canvas'):text.rfind('</canvas>') + 9]), ''
    except ET.ParseError as error:
        return None, str(error)


def main():
    """Inspect every supplied page record and write public inventory plus private index."""
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--intake', type=pathlib.Path, required=True)
    parser.add_argument('--metadata', type=pathlib.Path, required=True)
    parser.add_argument('--jobs', type=pathlib.Path, required=True)
    parser.add_argument('--repo', type=pathlib.Path, default=pathlib.Path(__file__).resolve().parents[3])
    args = parser.parse_args()
    registry = {row['file_key']: row for row in csv.DictReader((args.intake / 'figma_source_registry.csv').open())}
    aliases = {'Orkest HQ':'orkest','Zapp Today':'zapp','Masteriyo LMS':'masteriyo','Morajaa':'morajaa','piHub':'pihub','Yarsha':'yarsha','Reconwithme':'reconwithme'}
    jobs = json.loads(args.jobs.read_text())
    rows, pages = [], []
    archive = args.repo / 'artifacts/figma-exports'
    for job in jobs:
        file_key, page_id = job['fileKey'], job['nodeId']
        source = registry[file_key]
        filename = f"{file_key}_{page_id.replace(':', '-')}.json"
        observed = args.metadata / filename
        response = json.loads(observed.read_text()) if observed.exists() else {}
        root, error = inspect_page(job, response)
        pages.append(dict(file_key=file_key, project=source['project'], page_id=page_id, page_name=job['page'], status='TRAVERSED' if root is not None else 'BLOCKED', evidence=error))
        if root is None:
            continue

        def walk(parent, ancestors=(), enclosing_screen=False, section=None):
            """Find outer screen-sized nodes; components inside a screen are not screens."""
            for node in parent:
                width, height = float(node.get('width', 0)), float(node.get('height', 0))
                current_section = node if node.tag == 'section' else section
                large = node.tag in ('frame', 'symbol', 'instance') and width >= 300 and height >= 450
                board = width > 2560 or height > 30000
                device_width = round(width) in {320,360,375,390,393,402,412,414,428,430,440,480,600,640,744,768,800,810,820,834,1024,1170,1200,1279,1280,1366,1410,1440,1441,1512,1600,1728,1920,2560}
                block_name = bool(re.match(r'^(image(?: left| right)?|hero|footer|counters|card|content|assets|UI|left box|right box|top bar(?: for group chat)?|input message field|navbar|\d+ (?:video box|testimonials|about us|how it|faq))$', node.get('name',''), re.I))
                marketing_section = source['project'] in ('Morajaa','Reconwithme') and width >= 1000 and height < 1200
                is_screen = large and not board and device_width and not block_name and not marketing_section
                if large and not enclosing_screen:
                    name = node.get('name', '')
                    path_names = ' / '.join([job['page']] + [n.get('name', '') for n in ancestors] + [name])
                    flags = []
                    if board: flags.append('LAYOUT_BOARD_NOT_SCREEN')
                    if not device_width: flags.append('NON_DEVICE_BLOCK_CANDIDATE')
                    if marketing_section: flags.append('SECTION_OR_BLOCK')
                    if any(n.get('hidden') == 'true' for n in ancestors + (node,)):
                        flags.append('HIDDEN')
                    for label, pattern in [('ARCHIVE', r'archive|graveyard|superseded'), ('QA_ONLY', r'QA ONLY|QA ·|QA /|QA inventory|scenario launcher|handoff|release evidence|workflow ledger'), ('WIP', r'WIP|staging|redesign lab|draft|experiment'), ('LIBRARY_OR_PRESENTATION', r'design system|foundation|component|thumbnail|moodboard|style guide|presentation')]:
                        if re.search(pattern, path_names, re.I):
                            flags.append(label)
                    block = block_name
                    if block:
                        flags.append('SECTION_OR_BLOCK')
                    project = aliases[source['project']]
                    local = archive / project / file_key / page_id.replace(':', '-') / (node.get('id').replace(':', '-') + '.png')
                    exported = local.exists() and local.read_bytes()[:8] == b'\x89PNG\r\n\x1a\n'
                    checksum = hashlib.sha256(local.read_bytes()).hexdigest() if exported else ''
                    intent = 'EXCLUDE_NON_SCREEN_OR_REFERENCE' if any(f in flags for f in ('HIDDEN','ARCHIVE','QA_ONLY','LIBRARY_OR_PRESENTATION','SECTION_OR_BLOCK','LAYOUT_BOARD_NOT_SCREEN','NON_DEVICE_BLOCK_CANDIDATE')) else 'PRIVATE_ARCHIVE'
                    row = dict(project=source['project'], file_title=source['project'], fileKey=file_key,
                        source_priority=source['source_priority'], page_id=page_id, page_name=job['page'],
                        section_id=current_section.get('id','') if current_section is not None else '',
                        section_name=current_section.get('name','') if current_section is not None else '',
                        screen_node_id=node.get('id'), screen_name=name, width=width, height=height, type=node.tag,
                        role='screen candidate' if not block else 'section/block candidate', platform='mobile' if width < 600 else 'tablet' if width < 1100 else 'desktop',
                        version_revision=source['source_priority'] + ('; Current label' if '/ Current' in name else '; approval unverified'),
                        hidden_wip_archive_private_status=';'.join(flags) or 'NO_FLAG_OBSERVED',
                        publication_permission='REVIEW_REQUIRED', contains_personal_client_information='NOT_REVIEWED', language='NOT_REVIEWED',
                        export_intent=intent, target_pages='', source_url=f'https://www.figma.com/design/{file_key}/?node-id={node.get("id").replace(":","-")}',
                        export_status='PNG_PERSISTED' if exported else 'EXCLUDED' if intent.startswith('EXCLUDE') else 'QUEUED_NOT_EXPORTED',
                        quality_qa='PNG_SIGNATURE_CHECKED;VISUAL_REVIEW_PENDING' if exported else 'NOT_EXPORTED', sha256=checksum,
                        local_path=str(local.relative_to(args.repo)) if exported else '', last_checked='2026-11-03')
                    rows.append(row)
                walk(node, ancestors + (node,), enclosing_screen or is_screen, current_section)
        walk(root)
    rows.sort(key=lambda r: (r['fileKey'], r['page_id'], r['screen_node_id']))
    out = args.repo / 'docs/audits'
    # The repository is public. Full private/draft labels remain in the private archive.
    public_images = json.loads((args.repo / 'site/src/content/portfolio-evidence-images.json').read_text())
    cleared = {(image['fileKey'],image['nodeId']) for image in public_images}
    public_rows = []
    for row in rows:
        public_row = dict(row)
        if (row['fileKey'],row['screen_node_id']) not in cleared:
            public_row.update(screen_name='WITHHELD — see private inventory',section_name='WITHHELD',source_url='')
        else:
            public_row.update(publication_permission='OWNER_AUTHORIZED_REVIEW_BRANCH',contains_personal_client_information='PUBLIC_DERIVATIVE_REDACTED_OR_CLEAR')
        public_rows.append(public_row)
    write_csv(out / 'figma-screen-inventory.csv', public_rows, list(rows[0]) if rows else ['fileKey','screen_node_id','export_status'])
    write_csv(out / 'figma-page-access.csv', pages, ['file_key','project','page_id','page_name','status','evidence'])
    summary = dict(known_files=len(registry), pages_discovered=len(jobs), pages_traversed=sum(p['status']=='TRAVERSED' for p in pages), pages_blocked=sum(p['status']=='BLOCKED' for p in pages),
        outer_candidates=len(rows), private_archive_candidates=sum(r['export_intent']=='PRIVATE_ARCHIVE' for r in rows),
        persisted_screen_originals=sum(r['export_status']=='PNG_PERSISTED' for r in rows), queued=sum(r['export_status']=='QUEUED_NOT_EXPORTED' for r in rows),
        excluded=sum(r['export_status']=='EXCLUDED' for r in rows), account_wide_complete=False)
    (out / 'figma-export-summary.json').write_text(json.dumps(summary, indent=2)+'\n')
    archive.mkdir(parents=True, exist_ok=True)
    (archive / 'inventory.json').write_text(json.dumps(rows, indent=2)+'\n')
    write_csv(archive / 'figma-screen-inventory-private.csv', rows, list(rows[0]))
    print(json.dumps(summary))


if __name__ == '__main__':
    main()
