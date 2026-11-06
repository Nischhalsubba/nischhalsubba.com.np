# Contact recovery — 2026-11-06

Both homepage and contact page now use one delivery helper. Retry only an explicit first-party 503 (configuration unavailable before sending). Do not retry validation, challenge rejection, provider uncertainty or network failure. Preserve submitted values on failure; never forward the Turnstile response to FormSubmit. Clone form values to isolate requests. Count conversions only after explicit provider acceptance; discard honeypot requests without network traffic or a conversion.

Validation: contact security, handler and delivery regressions; code documentation audit; production build and workspace home/inner/SEO audits. See release PR for final results.

Live limitation: read-only config returned an empty site key. Earlier owner-inbox messages establish historical fallback use only. Automatic approval review blocked the concrete live POST because it disclosed an email address/message to the external provider and could trigger email. No retry, current delivery, inbox receipt or first-party configuration success is claimed. T07 and T26 remain open; overall count remains 73 verified, four waived, 30 open.
