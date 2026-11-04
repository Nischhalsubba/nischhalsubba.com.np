#!/usr/bin/env python3
"""Reproduce Latin workspace font subsets from retained original TTFs.

Purpose: Reduce measured initial font transfer without changing supported English glyph metrics.
Responsibilities: Preserve Latin, punctuation, arrows and symbols; content-address WOFF2 outputs.
Execution context: Maintainer Python CLI with fontTools and Brotli; outputs committed for Node builds.
Connected files: workspace-home font CSS, font-subsets.json and homepage/inner preload owners.
Maintenance: Add language subsets before introducing another supported writing system.
"""
import hashlib
import json
import pathlib
import re
from fontTools import subset
from fontTools.ttLib import TTFont


def main():
    """Generate deterministic subsets and update the exact CSS/preload references."""
    root = pathlib.Path(__file__).resolve().parents[1]
    directory = root / 'src/workspace-home/vendor/fonts.gstatic.com'
    manifest_path = root / 'src/content/font-subsets.json'
    previous = json.loads(manifest_path.read_text()) if manifest_path.exists() else []
    rows = []
    licenses = {}
    for source in sorted(directory.glob('*.ttf')):
        original = TTFont(source)
        family = original['name'].getDebugName(1)
        licenses[family] = dict(license=original['name'].getDebugName(13), url=original['name'].getDebugName(14))
        options = subset.Options()
        options.flavor = 'woff2'
        options.recalc_timestamp = False
        options.canonical_order = True
        worker = subset.Subsetter(options=options)
        # Current English pages use ASCII plus these reviewed punctuation/symbols.
        # Other original glyphs retain a separate unicode-range fallback face.
        allowed = set(range(0x80)) | {0xA0,0xA9,0xB7,0xD7,0xE9,0x2011,0x2013,0x2014,0x2018,0x2019,0x201C,0x201D,0x2022,0x2026,0x2192,0x2194,0x2197,0x21E3,0x2317,0x25CE}
        required = set(original.getBestCmap()) & allowed
        worker.populate(unicodes=required)
        worker.subset(original)
        original.flavor = 'woff2'
        temporary = directory / (source.stem + '-subset.tmp')
        original.save(temporary, reorderTables=True)
        data = temporary.read_bytes()
        sha = hashlib.sha256(data).hexdigest()
        output = directory / ('latin-' + source.stem + '-' + sha[:12] + '.woff2')
        temporary.replace(output)
        # Verify that every selected codepoint retains its horizontal advance.
        baseline, final = TTFont(source), TTFont(output)
        for point in required:
            assert baseline['hmtx'][baseline.getBestCmap()[point]][0] == final['hmtx'][final.getBestCmap()[point]][0]
        old = directory / (source.stem + '.woff2')
        primary_range = ','.join('U+'+format(point,'X') for point in sorted(required))
        fallback_range = ','.join('U+'+format(point,'X') for point in sorted(set(baseline.getBestCmap())-required))
        rows.append(dict(original=source.stem + '.woff2', source=source.name, output=output.name, family=family, glyphs=len(final.getBestCmap()), unicodeRange=primary_range, fallbackUnicodeRange=fallback_range, bytes=len(data), originalBytes=old.stat().st_size if old.exists() else next((r['originalBytes'] for r in previous if r['source']==source.name), None), sha256=sha))
    owners = [root/'src/workspace-home/index.html', root/'src/workspace-home/vendor/fonts.googleapis.com/ceaca49b99bd7ce7.css', root/'scripts/install-workspace-inner.cjs']
    for owner in owners:
        text = owner.read_text()
        for row in rows:
            text = text.replace(row['original'], row['output'])
            for old_row in previous:
                if old_row['source'] == row['source']:
                    text = text.replace(old_row['output'], row['output'])
        owner.write_text(text)
    css_path = owners[1]
    css = css_path.read_text().split('/* FULL-GLYPH FALLBACKS */')[0]
    fallback_blocks = []
    for row in rows:
        pattern = r'@font-face\s*\{[^}]*'+re.escape(row['output'])+r'[^}]*\}'
        block = re.search(pattern, css)[0]
        clean = re.sub(r'\s*unicode-range:[^;]+;', '', block)
        primary = clean.replace('}', '  unicode-range: '+row['unicodeRange']+';\n}')
        fallback = clean.replace(row['output'], row['original']).replace('}', '  unicode-range: '+row['fallbackUnicodeRange']+';\n}')
        css = css.replace(block, primary)
        fallback_blocks.append(fallback)
    css_path.write_text(css.rstrip()+'\n\n/* FULL-GLYPH FALLBACKS */\n'+ '\n'.join(fallback_blocks)+'\n')
    manifest_path.write_text(json.dumps(rows, indent=2) + '\n')
    license_path = root/'src/workspace-home/vendor/FONT-LICENSES.md'
    license_path.write_text('# Retained font license metadata\n\nFont-family license statements below are read from the original retained TTF name tables. Latin subsets retain the original glyph metrics for their supported codepoints.\n\n' + '\n\n'.join('## '+family+'\n\n'+str(value['license'])+'\n\n'+str(value['url']) for family,value in licenses.items())+'\n')
    print(json.dumps(dict(files=len(rows), originalBytes=sum(r['originalBytes'] or 0 for r in rows), subsetBytes=sum(r['bytes'] for r in rows), glyphMetricChecks='PASS')))


if __name__ == '__main__':
    main()
