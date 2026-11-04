#!/usr/bin/env python3
"""Verify MCP PNG transport identity and restore exact original native PNG bytes.

Purpose: Resume exports safely without relying on attachment order or temporary URLs.
Responsibilities: Check PNG CRCs, source identity, byte length, full decoding and dimensions.
Execution context: Private archive operator; stdin supplies expected frames and base64 file paths.
Connected files: native-batch.cjs, export.py, ignored artifacts/figma-exports.
Maintenance: Never publish originals or turn successful export into permission to publish.
"""
import base64, hashlib, io, json, math, pathlib, struct, sys, zlib
from PIL import Image


def restore_native(data):
    """Restore original bytes and optional current bounds; accept legacy identity-only exports."""
    if data[:8] != b'\x89PNG\r\n\x1a\n': raise ValueError('Not PNG')
    original = bytearray(data[:8]); offset = 8; identity = None
    while offset < len(data):
        size = struct.unpack('>I', data[offset:offset+4])[0]
        chunk = data[offset:offset+size+12]
        if len(chunk) != size+12: raise ValueError('Truncated PNG')
        kind, body = chunk[4:8], chunk[8:-4]
        if zlib.crc32(kind+body) & 0xffffffff != struct.unpack('>I', chunk[-4:])[0]: raise ValueError('PNG CRC mismatch')
        if kind == b'tEXt' and body.startswith(b'NS_SOURCE\0'):
            if identity is not None: raise ValueError('Multiple identities')
            identity = body.split(b'\0', 1)[1].decode('ascii').split('|')
        else: original.extend(chunk)
        offset += size+12
    if not identity or len(identity) not in (4, 5) or len(original) != int(identity[3]): raise ValueError('Missing identity or original length mismatch')
    proof = json.loads(identity[4]) if len(identity) == 5 else None
    if proof is not None and not isinstance(proof, dict): raise ValueError('Invalid source bounds proof')
    return identity[:3], bytes(original), proof


def matches_bounds(width, height, bounds):
    """Compare decoded PNG dimensions with finite source frame or rendered pixel extents."""
    if not isinstance(bounds, dict): return False
    values = [bounds.get(k) for k in ('width', 'height')]
    if not all(isinstance(v, (int, float)) and math.isfinite(v) and v > 0 for v in values): return False
    expected_width, expected_height = values
    if 'x' in bounds and 'y' in bounds:
        if not all(isinstance(bounds[k], (int, float)) and math.isfinite(bounds[k]) for k in ('x', 'y')): return False
        expected_width = math.ceil(bounds['x'] + bounds['width']) - math.floor(bounds['x'])
        expected_height = math.ceil(bounds['y'] + bounds['height']) - math.floor(bounds['y'])
    return abs(width-expected_width) <= 1 and abs(height-expected_height) <= 1


def main():
    """Accept one bounded batch, save native files atomically and append private proof records."""
    request = json.load(sys.stdin)
    root = pathlib.Path(request['repo']).resolve()
    expected = {(r['fileKey'], r['pageId'], r['nodeId']): r for r in request['frames']}
    seen = set(); records = []
    for filename in request['images']:
        temporary = pathlib.Path(filename)
        identity, data, proof = restore_native(base64.b64decode(temporary.read_bytes().strip(), validate=True))
        key = tuple(identity)
        if key not in expected or key in seen: raise ValueError('Unknown or repeated frame identity')
        seen.add(key); frame = expected[key]
        with Image.open(io.BytesIO(data)) as image: image.load(); width, height = image.size
        target = (root/frame['path']).resolve()
        if not target.is_relative_to(root/'artifacts/figma-exports'): raise ValueError('Output outside private archive')
        target.parent.mkdir(parents=True, exist_ok=True)
        inventory_match = matches_bounds(width, height, frame)
        source_frame_match = proof is not None and matches_bounds(width, height, proof.get('frame'))
        render_match = proof is not None and matches_bounds(width, height, proof.get('render'))
        good = inventory_match or source_frame_match or render_match
        pending = target.with_suffix('.pending'); pending.write_bytes(data)
        if good: pending.replace(target)
        record = dict(frame, status='PNG_PERSISTED' if good else 'DIMENSION_REVIEW', actual_width=width, actual_height=height, sha256=hashlib.sha256(data).hexdigest(), native_bytes=len(data))
        if proof is not None: record.update(sourceRenderProof=proof, dimension_basis='INVENTORY_FRAME_BOUNDS' if inventory_match else 'SOURCE_FRAME_BOUNDS' if source_frame_match else 'SOURCE_RENDER_BOUNDS' if render_match else 'UNRESOLVED')
        records.append(record); temporary.unlink()
        with (root/'artifacts/figma-exports/native-mcp-export.jsonl').open('a') as log: log.write(json.dumps(record)+'\n')
    if seen != set(expected): raise ValueError('One or more frame attachments missing')
    print(json.dumps(records))


if __name__ == '__main__': main()
