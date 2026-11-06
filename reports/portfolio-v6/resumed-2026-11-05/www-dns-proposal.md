# Proposed www DNS correction — approval and correct account access required

Observed November 5, 2026:
- The apex portfolio serves main commit 8ac11e4 and all 54 canonical routes.
- `www.nischhalsubba.com.np` cannot be reached from this runtime (CONNECT 403).
- Independent public DNS queries returned NOERROR/NODATA for A, AAAA and CNAME, with the domain's Cloudflare SOA in authority. This is distinct from asserting a server-side 503.
- Wrangler already declares both apex and www routes. Canonical-host logic and permanent redirect tests exist. A DNS record is needed before normal browsers can reach that logic on www.
- The provided Cloudflare token is active but lists no accessible account/zone and returns 403 for the Worker/build in the account identified by the existing Cloudflare GitHub check. No record was changed.

Concrete proposal, after verifying current zone contents with correctly scoped access:

```json
{
  "type": "CNAME",
  "name": "www",
  "content": "nischhalsubba.com.np",
  "proxied": true,
  "ttl": 1
}
```

Do not replace an existing record blindly. Read the actual zone first, preserve any existing service requirements, and confirm Worker route coverage. Required outcome: one permanent hop from `https://www.nischhalsubba.com.np/about.html?audit=6` to `https://nischhalsubba.com.np/about?audit=6`, with valid TLS and no 5xx.

This is a proposed external DNS change, not part of the automatic source merge authorization. The original program requires explicit approval for DNS changes. No DNS modification was executed.
