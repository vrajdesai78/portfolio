# Portfolio Redesign — Single-Page Typographic Minimal (2026-07-06)

## Goal

Reposition vrajdesai.dev to land a full-time role (solutions engineering, DevRel, or
backend) using the July 2026 resume as the source of truth for all content. Replace the
mono/bordered multi-page UI with a single-page, typography-first design in the style of
minimal reference portfolios (Sarthak Shah's site; Emil Kowalski's motion/design
principles).

## Decisions (user-approved)

- **Goal**: optimize for recruiters/hiring managers; wording mirrors the resume's
  customer-facing positioning.
- **UI**: full redesign toward references — single column, lists over boxed cards,
  sans-serif body, subtle ease-out motion.
- **Structure**: single scrolling page + `/resume` route. Project MDX detail pages are
  removed.
- **Availability**: explicit — a clear "looking for my next role" line near the top with
  email as the primary CTA.
- **Approach**: rework in place. Keep Vite + vite-react-ssg + Tailwind v4, tests, and
  the SEO/OG/sitemap infrastructure.

## Page structure & wording

One scrolling page at `/`, sections in this order:

### 1. Intro
- Name (~24–30px semibold) with small headshot (~56–64px, rounded) beside it.
- Role line in muted mono, lowercase: `backend & solutions engineer`.
- Para 1: "I build end-to-end and work directly with customers — backend, integrations,
  and developer-facing solutions. Most recently co-founded MetEngine: $114M+ volume,
  8.5K+ users, $375K raised from Colosseum and Balaji Srinivasan." (MetEngine links to
  metengine.xyz.)
- Para 2 (availability): "I'm currently looking for my next role — solutions
  engineering, DevRel, or backend. Get in touch →" with a small pulsing green status
  dot and a mailto CTA.
- Inline links: github · x · linkedin · email · resume.

### 2. Work
List layout: company — role on the left, dates right-aligned in muted mono; 2–4 tight
bullets per entry. Content per the resume:

- **MetEngine — Co-Founder & CTO** (Feb 2025 – Jun 2026)
  - Zero-slot-latency automated copy-LPing engine → **$4.3M+** yield for **8.5K+**
    users; **$114M+** total volume.
  - High-throughput data pipelines and real-time analytics on Solana (Node.js,
    ClickHouse, Redis) in production on AWS; real-time indexer across Solana DeFi
    protocols (Meteora and others).
  - x402/MPP data APIs for Polymarket, Hyperliquid, and market making (**6,000+**
    transactions); Chrome extension with **2,500+** peak downloads.
  - Raised **$375K** pre-seed from Colosseum, Balaji Srinivasan, and MonkeFoundry;
    drove the product 0 → 1.
- **WalletConnect — DevRel / Solutions Engineer, WalletKit** (Nov 2024 – May 2025)
  - Embedded with Jupiter, Backpack, and MetaMask to integrate WalletKit and add
    Solana support; debugged integrations directly.
  - Technical point of contact for wallet clients — triaged issues, reproduced bugs,
    turned feedback into fixes.
  - Docs, integration guides, sample apps; onboarded wallets to WalletConnect
    Certified.
- **Huddle01 — DevRel Engineer** (Apr 2023 – Aug 2024)
  - Drove **200+** projects to integrate the SDK via docs, sample apps, and hands-on
    support; contributed to the core SDKs.
  - Built FarHouse, a Farcaster audio-spaces client → **30K+** MAUs; grew Discord from
    2K to **13K+**.
- **Google Summer of Code '22 — Oppia Foundation** (2022)
  - Merged **30+** PRs improving accessibility in the Oppia Android app.

### 3. Projects
Mirrors the resume exactly — Stackit, Farview.id, Capital Finance, WiseBets. One-liner
plus award line each. FarHouse lives in the Huddle01 work bullet, not here. MetEngine is
work, not a project.

- **Stackit** — theme-based investable baskets of tokens. Won 2nd prize at Solana
  Hacker House; Superteam grant.
- **Farview.id** — personalized profile pages for Farcaster & Base users; 6K+ users,
  12K+ Frame interactions. Won the Social track at Base On-chain Summer Buildathon;
  Base builder grant.
- **Capital Finance** — cross-chain yield aggregator on the Superchain via Chainlink
  CCIP. Won Best Trading App on Base and Best Use of Goldsky (SuperHack, ETHGlobal).
- **WiseBets** — multi-chain opinion-trading platform on CCIP. Won zkSync, Polygon &
  Scroll prizes at Chainlink's Block Magic Hackathon.

### 4. Achievements
Three terse lines:
- 2nd prize, DeFi track, Colosseum Breakout Hackathon (1,412 projects, 10K+ builders);
  selected for Colosseum Accelerator Cohort 3.
- ETHGlobal finalist; 30+ hackathon wins; builder grants from Base and Superteam.
- Speaker at 25+ conferences; mentor at ETHIndia and HackFS.

### 5. Skills
Four compact groups matching the resume, one line each, no pill boxes:
- **Languages**: TypeScript, JavaScript, Solidity, Python, Rust (familiar)
- **Backend & Data**: Node.js, REST APIs, data pipelines & real-time analytics,
  PostgreSQL, ClickHouse, Redis, Supabase, Firebase, AWS
- **Web3**: Solana, EVM, Ethers.js, Web3.js, SolanaKit, Wagmi/Viem, WalletConnect,
  Chainlink CCIP, Dune
- **Solutions & Integration**: API & SDK integration, integration debugging, customer
  onboarding & support, technical docs, sample apps & demos, community & speaking

### 6. Footer
Email, socials, resume link.

### /resume route
Unchanged in purpose: download button + embedded PDF.

**Wording rules**: first person, terse, no buzzwords. Bold reserved for metrics and
names so numbers pop on scan.

## Visual design

- **Layout**: one centered column, ~672px max width. Hierarchy from type and spacing —
  no boxed cards, no bordered buttons. Big gaps between sections, tight within.
- **Typography**: Inter Variable for body and headings, self-hosted in `public/fonts`
  with `@font-face` (same pattern as JetBrains Mono today). JetBrains Mono demoted to
  metadata: dates, lowercase section labels, role line. Body 15–16px, relaxed leading.
- **Color**: near-black on white; dark mode inverted; theme toggle stays. Green accent
  demoted to two uses: the pulsing availability status dot and link hover. Links are
  underlined with muted decoration, sharpening on hover.
- **Motion**: single staggered entrance on load — sections fade up 8px, ease-out,
  ~350ms, ~50ms stagger. Hover transitions 150ms. Status dot pulse is the only loop.
  `prefers-reduced-motion` disables all of it (existing CSS rule kept).
- **Removed**: StatStrip (metrics live inline in prose), ProjectCard boxes, bordered
  button styles, boxed nav. Header becomes minimal: name, resume link, theme toggle.

## Technical changes

- **Routes**: `/`, `/resume`, 404. Remove `/about`, `/projects`, `/projects/:slug`.
  Add redirects for the removed paths → `/` in `vercel.json`.
- **Content model**: delete the four project MDX files and the MDX pipeline
  (`@mdx-js/*`, `remark-*` plugins, `src/lib/content.ts` MDX loading, `mdx.d.ts`).
  Update `scripts/` (OG generation, sitemap, content-fs, check-build) to stop reading
  MDX content and to cover only the remaining routes. Projects become plain data
  objects. All copy lives in `src/config/site.ts` and `src/data/`.
- **Components**: remove `ProjectCard`, `StatStrip`, `Timeline`, `SkillGroup`,
  `AchievementList`, `ProjectRow`, MDX components. Add small list components
  (`WorkItem`, `ProjectItem`) and keep a simplified `Section`, `Container`, `Seo`,
  `ThemeToggle`, `SkipLink`, `Footer`, `Header`.
- **SEO/OG**: keep `Seo`, person JSON-LD, OG generation (regenerate with the new
  tagline), sitemap (fewer URLs), check-build script, Vercel analytics.
- **Tests**: delete tests for removed components; add/update tests for new data shapes
  and components. `pnpm test`, `pnpm typecheck`, `pnpm lint` green at completion.
- **Resume PDF**: no TeX toolchain on this machine (checked: no tectonic/latexmk/
  pdflatex). The user must compile the updated LaTeX and replace
  `public/vraj-desai-resume.pdf`. The site work does not block on this.

## Out of scope

- No blog/writing section, no cmd-K palette, no shadcn/ui dependency, no Next.js
  migration, no new pages beyond `/` and `/resume`.

## Success criteria

- Site reads as a job-hunting portfolio: availability obvious above the fold, resume
  content mirrored exactly, metrics scannable.
- Visual output no longer reads as boxed/templated; matches the reference aesthetic.
- Build, tests, lint, typecheck all pass; OG image and sitemap regenerate correctly;
  removed routes redirect.
