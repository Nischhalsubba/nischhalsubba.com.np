# `src/styles/`

Owns authored production CSS.

`style.css` is the single stylesheet source of truth. It is materialized to `/style.css` for the mature build pipeline, then copied to `dist/style.css` by `scripts/copy-static-assets.cjs`.

Connected files:

- HTML pages that reference `/style.css`;
- `scripts/compile-single-stylesheet.cjs` and CSS/design-system audits;
- `scripts/repository/source-layout.cjs` for compatibility materialization.

Do not add patch/version stylesheets. The build audits intentionally enforce one production stylesheet contract.
