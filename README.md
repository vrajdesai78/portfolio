# vrajdesai.dev

Personal site + portfolio, statically generated with Vite + React.

## Stack
Vite · vite-react-ssg (static HTML per route) · React 18 + TS · Tailwind CSS v4 ·
MDX content · satori OG images · Vitest.

## Develop
```bash
pnpm install
pnpm dev            # http://localhost:5173
pnpm test           # unit tests
pnpm build          # SSG + OG images + sitemap + build checks → dist/
pnpm preview        # serve dist/
```

## Add a project (no code changes)
Create `src/content/projects/<slug>.mdx`:
```mdx
---
title: "My Project"
oneliner: "One line about it."
tags: ["Solana"]
metrics: [{ label: "users", value: "1K+" }]
links: { live: "https://..." }   # omit for none
featured: true                   # show on Home
order: 5
---
Write-up in MDX…
```
It auto-appears in the grid, gets its own static page, OG image, and sitemap entry.
Set `draft: true` to keep it out of production. Posts work the same in `src/content/writing/`.

## Deploy (Vercel)
- Framework preset: **Other**; Build: `pnpm build`; Output dir: `dist`.
- Add domain `vrajdesai.dev`. (Cloudflare Pages works identically: build `pnpm build`, output `dist`.)
- `vercel.json` sets `cleanUrls: true` and `trailingSlash: false` so the flat HTML output
  (e.g. `dist/about.html`) is served at clean paths (`/about`) with no redirect overhead.
- Analytics via `@vercel/analytics` (production only).
