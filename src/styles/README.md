# `src/styles/`

Authored stylesheet source with explicit ownership.

- `style.css`: canonical assembled/global production stylesheet required by the mature build contract.
- `systems/`: reusable authored stylesheet systems.
- `fragments/agent/`: composable agent-era fragments assembled by the stylesheet compiler; names describe responsibility instead of historical sequence numbers.

Do not add patch/version stylesheets. `scripts/compile-single-stylesheet.cjs` remains the assembly owner and CSS audits enforce the production contract.
