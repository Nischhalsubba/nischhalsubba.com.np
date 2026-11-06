# First-party contact delivery configuration — not applied

Confirmed in an unmodified Chromium browser on November 5, 2026:
- GET /api/contact/config returned 200 with an empty public site key.
- An empty invalid POST /api/contact returned 503: “The anti-spam service is not configured.” No email could be sent by that probe.
- The source handler checks TURNSTILE_SECRET_KEY before validation/delivery. This establishes missing first-party anti-spam configuration, not a working protected delivery path.
- The frontend intentionally has a FormSubmit provider fallback. Its presence is not proof of inbox delivery, and no valid message was sent in this diagnostic.
- Raw non-browser endpoint requests separately received Cloudflare error 1010; that must not be conflated with the actual browser result above.

Required configuration in the real Cloudflare account hosting portfolio-website-2026:
1. A Turnstile widget allowing nischhalsubba.com.np (and www when its DNS is corrected).
2. Public TURNSTILE_SITE_KEY on the Worker; the existing /api/contact/config route supplies it to the browser. A build variable is also supported but is not a substitute for the runtime secret.
3. Matching TURNSTILE_SECRET_KEY as a Worker secret, entered securely in Cloudflare settings or through an authorized provider API session. Do not put either credential into chat, source files or audit logs. The site key is public, but the secret is not.
4. Preserve the CONTACT_EMAIL binding declared in wrangler.jsonc; verify its availability after anti-spam configuration is fixed. Do not invent an SMTP key or duplicate bindings.

After configuration: confirm the real widget loads, perform one owner-authorized QA submission with a unique test reference, verify the first-party accepted response and actual receipt in the owner's inbox, then exclude that test from legitimate lead reporting. Retain accessible failure/retry states and fixed-recipient protections.

The existing Cloudflare token is active but cannot read this account's Worker/build or list the zone. Correct account-scoped access and explicit approval of the external configuration change are required before applying it. No guards were disabled, no live secrets were changed and no delivery claim was made.
