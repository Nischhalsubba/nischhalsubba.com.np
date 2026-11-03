# Resumable native MCP export

Use `native-batch.cjs` to generate a read-only Plugin API script for one page and up to five known screen IDs. Follow the current Figma use skill before each call. Run the returned script through the authorized Figma connection, preserving the existing session ID. It changes page context and exports images; it never edits design nodes, permissions or sharing.

Do not add a text return to the generated script: it can suppress image attachments. Each exported PNG contains a temporary, CRC-protected source-identity text chunk, so attachment order is irrelevant even with parallel rendering. Save image-content base64 into private temporary files and pass this JSON to `accept-native-batch.py` on stdin:

```json
{"repo":"/absolute/repository","frames":[{"fileKey":"known-file-key","pageId":"0:1","nodeId":"1:2","path":"artifacts/figma-exports/project/file/page/node.png","width":1440,"height":1050}],"images":["/private/image.b64"]}
```

The receiver verifies every PNG chunk CRC, the embedded file/page/frame identity, original byte length, full image decoding and expected dimensions. It removes only the transport chunk, restoring the exact native PNG bytes. Accepted files are written atomically. Dimension exceptions remain `.pending` and are excluded from successful-export counts. A private JSONL log retains frame IDs, dimensions and SHA-256 proof.

Never infer successful export from metadata, an attachment count, an expiring URL, or an interrupted operation. Rebuild the next batch by checking actual saved PNGs against the inventory. Pause a source on access/plan errors; do not change billing or sharing or switch identities to evade a limit. Keep raw originals out of git and deployed output. Export is not publication clearance.

New batches include current source frame/render bounds and visibility in the reversible identity chunk. The receiver also accepts older identity-only batches. It can verify native overflow or shadow extents against those observed render bounds instead of mistaking a frame-box difference for a failed export. Original PNG bytes remain unchanged. Unmatched dimensions still stay pending; no bounds are inferred from the image itself. Bound read/export waits, retain verified partial attachments and pause an unresponsive source rather than retrying indefinitely.
