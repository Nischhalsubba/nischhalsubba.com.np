# Inner-page workspace design

The approved homepage design now owns the presentation of every public route, including 14 project cases, the writing index, 26 articles, About, Contact, Privacy, Services and six service details (52 inner pages).

`install-workspace-inner.cjs` runs after the historical content build and the homepage installer. It preserves each complete main landmark and its metadata, then replaces the retired visual shell and style/runtime dependencies. The homepage's actual font, token, navigation, icon and footer sources are reused. `src/workspace-inner` owns responsive editorial layouts, case-study evidence frames, cards, contact fields, reading progress, keyboard/mobile navigation and reduced-motion behavior. The homepage itself is unchanged.

The secure contact form imports its existing isolated feature and retains the first-party API, validation, fallback and Turnstile behavior. The historical global runtime is intentionally omitted because it rewrites the retired shell.

Validation checks all 52 routes, content hashes and local dependencies. CI browser checks cover every inner route at 360, 768 and 1440px, including image loading, overflow, shared identity and mobile-menu state. Contact interaction and text-contrast audits remain separate. Old shell, theme-toggle and pixel baselines have been superseded by the approved redesign; current screenshots are uploaded as review evidence. Repeated specialized steps use seven representative routes to avoid duplicating the full matrix.

The earlier website remains in `backup/pre-workspace-redesign-2026-11-02`.
