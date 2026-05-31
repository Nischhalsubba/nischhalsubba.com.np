# Deployment guard

Cloudflare Pages should use the resilient production build:

```txt
npm run build
```

That command now only runs the steps needed to produce deployable output:

```txt
vite build
node scripts/copy-static-assets.cjs
node scripts/generate-resume-pdf.cjs
```

QA audits are intentionally separate so small marker mistakes do not block Cloudflare deployments:

```txt
npm run verify
```

Strict local/CI validation can still run:

```txt
npm run build:strict
```

## Why this exists

Cloudflare deployments previously failed after the real site build succeeded because an audit script looked for an exact text marker inside CSS. The site output was already created, but the audit exited with an error and Cloudflare marked the deploy as failed.

To prevent this class of failure:

- production build should create deployable files only
- QA/contrast audits should run separately through `npm run verify`
- audit markers should check durable design tokens, not fragile comments or exact wording

## Cloudflare settings

Build command:

```txt
npm run build
```

Output directory:

```txt
dist
```

Do not use:

```txt
npx next build
```

This project is a Vite/static portfolio, not a Next.js app.
