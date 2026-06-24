# vrajdesai.dev — Design Spec

> Personal website, portfolio, and future host for AI demos. Built as a minimal,
> statically-generated Vite + React site. This is the validated design; the
> implementation plan follows separately.

Status: **Approved design** · Date: 2026-06-23 · Owner: Vraj Desai

---

## 1. Overview & goals

A fast, minimal site at **vrajdesai.dev** that works as (1) a 30-second recruiter
scan, (2) a portfolio of shipped products with real metrics, and (3) a scalable
home for future AI demos. It must support a build-in-public workflow: adding a
project or post is a single Markdown file.

Primary audiences: recruiters/hiring managers (AI + crypto), developer peers,
future collaborators.

**Non-goals (v1):** no CMS, auth, or database; no comments/newsletter; do not
build the AI demos themselves — only the architecture and placeholder routes.

---

## 2. Locked decisions

| Decision | Choice | Rationale |
|---|---|---|
| Framework | **Vite + React 18 + TypeScript** | Minimal, fast, no Next.js (per owner directive). |
| Rendering | **`vite-react-ssg`** (static HTML per route, light hydration) | Meets per-page OG, SEO, no-JS content, Lighthouse ≥95 while staying "minimal Vite". |
| Styling | **Tailwind CSS v4** (Vite plugin) | Fast, utility-first, tiny output. |
| Content | **MDX** (`@mdx-js/rollup`) + frontmatter | Add a project/post = one file. |
| Theme | **System default** + manual toggle, persisted | `prefers-color-scheme` with override; no-flash inline script. |
| OG images | **Auto-generated per page** (`satori` + `@resvg/resvg-js`) | Unique social preview per route/project. |
| Resume | `~/Downloads/vraj-resume-2026.pdf` → `public/vraj-desai-resume.pdf` | Embed + download. |
| Aesthetic | **Technical / metrics-forward** | Mono+sans, hairline borders/grid, numbers as heroes. |
| Avatar | **Photo slot** (owner provides later) | Placeholder until image supplied. |
| Hero tagline | PRD wording (see §7) | Approved. |
| Deploy | **Vercel** (static), Cloudflare Pages documented | Connect `vrajdesai.dev`. |
| Analytics | **`@vercel/analytics`** (prod only) | Lightweight, privacy-respecting. |

---

## 3. Tech stack

- **Build/dev:** Vite, `vite-react-ssg` for SSG + routing.
- **UI:** React 18, TypeScript (strict).
- **Styling:** Tailwind CSS v4, CSS variables for theming.
- **Content:** MDX via `@mdx-js/rollup`; frontmatter parsed at build; loaded with
  `import.meta.glob`.
- **Head/meta:** `@unhead/react` (the head solution `vite-react-ssg` documents);
  fall back to `react-helmet-async` if version compatibility requires it.
- **OG generation:** `satori` (JSX → SVG) + `@resvg/resvg-js` (SVG → PNG), run as
  a build step. Fonts loaded from `scripts/og-fonts/` (build-only, not shipped).
- **Testing:** Vitest (+ Testing Library for the few interactive components).
- **Analytics:** `@vercel/analytics`.
- **Tooling:** ESLint + Prettier, TypeScript strict.

---

## 4. Architecture & project structure

Single source of truth for identity (`config/site.ts`); content as files
(`content/**`); pure build scripts that read the same metadata.

```
portfolio/
  public/
    vraj-desai-resume.pdf
    favicon.svg  apple-touch-icon.png  manifest.webmanifest
    robots.txt
    fonts/                    # subset JetBrains Mono woff2 (served + preloaded)
  src/
    config/
      site.ts                 # name, tagline, socials, email, stat strip, "currently", baseUrl
      nav.ts                  # nav + route registry
    content/
      projects/*.mdx          # one file per project (frontmatter + body)
      writing/*.mdx           # one file per post
    lib/
      content.ts              # import.meta.glob → typed, sorted lists + by-slug lookup
      seo.ts                  # per-route meta/OG/JSON-LD builders
    components/
      Layout.tsx  Header.tsx  Footer.tsx  ThemeToggle.tsx
      Seo.tsx                 # emits <head> tags (title/desc/OG/twitter/canonical/JSON-LD)
      ProjectCard.tsx  StatStrip.tsx  Timeline.tsx  SkillGroup.tsx
      Section.tsx             # mono section-label + hairline rule wrapper
      MDXComponents.tsx       # styled elements for MDX bodies
    pages/
      Home.tsx  About.tsx
      Projects.tsx  ProjectDetail.tsx
      Writing.tsx  PostDetail.tsx
      Resume.tsx  NotFound.tsx
    styles/index.css          # Tailwind + theme variables + base
    routes.tsx                # vite-react-ssg route table (incl. dynamic slugs)
    main.tsx
  scripts/
    og-fonts/                 # ttf fonts for satori (build-only, not shipped)
    generate-og.tsx           # build-time OG PNGs from site + content metadata
    generate-sitemap.ts       # sitemap.xml from route registry + content slugs
    check-build.ts            # post-build assertions (meta/OG/JSON-LD present in dist HTML)
  index.html                  # no-flash theme script, font preload
  vite.config.ts
  tsconfig.json
  package.json
  README.md                   # AI-demo subdomain pattern + "how to add a project"
  docs/superpowers/specs/...  # this spec
```

**Units (each understandable and testable in isolation):**

- `config/site.ts` — typed constants; no logic. The one place to edit identity.
- `lib/content.ts` — pure: glob modules → validated, typed, sorted arrays; throws
  loudly on malformed/missing frontmatter. Inputs: glob modules. Output: typed
  lists + `getBySlug`. No React.
- `lib/seo.ts` — pure: `(route, data) → { title, description, ogImage, jsonLd }`.
- `Seo.tsx` — thin React wrapper that renders `lib/seo.ts` output into head.
- `ProjectCard` / `StatStrip` / `Timeline` / `SkillGroup` — presentational,
  props-in/markup-out, reused across pages.
- `scripts/generate-og.tsx` — pure metadata → PNG files; shares the same route
  list and `site.ts` as the app.
- `scripts/generate-sitemap.ts` — route registry + slugs → `sitemap.xml`.

---

## 5. Content model

### Project frontmatter (`src/content/projects/*.mdx`)

```yaml
---
title: "MetEngine"
slug: "metengine"            # also derived from filename; explicit wins
oneliner: "Solana liquidity & yield platform."
tags: ["Solana", "DeFi", "Backend", "Data"]
role: "Co-Founder & CTO"      # optional
period: "Feb 2025 – Jun 2026" # optional
metrics:                      # rendered as a small stat row on card + detail
  - { label: "volume",  value: "$114M+" }
  - { label: "users",   value: "8.5K+" }
  - { label: "yield",   value: "$4.3M+" }
links:                        # any subset; omitted keys render no button
  live: "https://..."         # optional
  github: "https://..."       # optional (omit for private repos)
  video: "https://..."        # optional
featured: true                # surfaces on Home
order: 1                      # sort within grid (asc); fallback to title
draft: false
---
<!-- MDX body: the write-up (problem, what I built, stack, outcomes/learnings) -->
```

### Post frontmatter (`src/content/writing/*.mdx`)

```yaml
---
title: "Switching from crypto to AI — building in public"
slug: "crypto-to-ai"
date: "2026-06-23"
summary: "Why I'm pivoting, and what I'm shipping."
tags: ["build-in-public", "AI"]
draft: true
---
```

`content.ts` rules: ignore `draft: true` in production builds; sort projects by
`order` then `title`; sort posts by `date` desc; validate required keys and throw
a clear error at build if missing (fail loud, never silently render blanks).

---

## 6. Routing & SSG

`vite-react-ssg` pre-renders every route below to its own `index.html`:

| Route | Page | Source |
|---|---|---|
| `/` | Home | `site.ts` + featured projects |
| `/about` | About | static copy (§7) + timeline/skills/achievements data |
| `/projects` | Projects grid | all non-draft projects |
| `/projects/:slug` | Project detail | per-project MDX (slugs enumerated at build) |
| `/writing` | Writing index | all non-draft posts |
| `/writing/:slug` | Post detail | per-post MDX |
| `/resume` | Resume | embedded PDF |
| `*` | NotFound (404) | — |

Dynamic slugs are provided to `vite-react-ssg` via `getStaticPaths`-style export
that reads `content.ts`. Core content renders in the static HTML (no JS needed);
hydration powers only the theme toggle, nav interactivity, and analytics.

---

## 7. Pages & content (verbatim from resume — authoritative)

> Content cross-checked against `vraj-resume-2026.pdf`. Metrics and naming below
> are the source of truth and override looser PRD phrasings.

### Home `/`
- **Hero:** "Vraj Desai" + tagline:
  *"Engineer & builder. Co-founded a Solana DeFi platform that did $114M+ in
  volume. Now building in AI."* + photo slot.
- **CTAs:** View Projects · Resume · GitHub.
- **StatStrip** (configurable in `site.ts`; default 4):
  `$114M+ volume` · `8.5K+ users` · `30+ hackathon wins` · `Colosseum Accelerator (YC for Solana)`.
  (Other available stats for swapping: `$4.3M+ yield`, `25+ talks`, `ETHGlobal Finalist`.)
- **Featured projects:** MetEngine, Farview.id, and an **"AI — building in
  public"** teaser card (becomes the first AI project once shipped).
- **"Currently"** line (editable, `site.ts`): default
  *"Wrapping up MetEngine and going deep on AI engineering — building in public."*
- **Footer:** GitHub, X, LinkedIn, email.
- **JSON-LD** `Person` (name, url, jobTitle, sameAs[socials]).

### About `/about`
Photo slot + 3-paragraph bio (default copy, editable):

1. Vraj Desai is an engineer and builder. As Co-Founder & CTO of **MetEngine**, he
   led the backend end-to-end — high-throughput data pipelines and real-time
   analytics on Solana, and a zero-slot-latency automated copy-LPing experience
   that drove **$4.3M+ in yield** for **8.5K+ users** and scaled total volume past
   **$114M+**. He also built x402/MPP data APIs (Polymarket, Hyperliquid, market
   making; 6,000+ txns) and a Chrome extension with 2,500+ peak downloads.
2. Before MetEngine he worked in developer relations at the edge of the wallet and
   media ecosystems — at **WalletConnect (WalletKit)**, partnering with Jupiter,
   Backpack, and MetaMask on Solana support and the WalletConnect Certified
   initiative; and at **Huddle01**, where he drove 200+ projects onto the SDKs and
   built **FarHouse**, a Farcaster audio-spaces client that reached 30K+ users. He
   got his start in open source as a **Google Summer of Code '22** contributor to
   the Oppia Foundation.
3. He's a serial hackathon winner (**30+ wins**, **ETHGlobal Finalist**,
   **Colosseum Accelerator Cohort 3**) and has spoken at **25+ conferences**. Now
   he's going deep on **AI engineering** — building in public and shipping demos
   here.

**Timeline** (reverse chronological):
- **MetEngine** — Co-Founder & CTO · Feb 2025 – Jun 2026. Led backend end-to-end:
  high-throughput data pipelines + real-time analytics on Solana; zero-slot-latency
  automated copy-LPing → $4.3M+ yield, 8.5K+ users, $114M+ volume; x402 + MPP data
  APIs for Polymarket/Hyperliquid/market making (6,000+ txns); Chrome extension
  (2,500+ peak downloads).
- **WalletConnect** — DevRel Engineer (WalletKit) · Nov 2024 – May 2025. Worked
  with Jupiter, Backpack, MetaMask on WalletConnect integration with Solana
  support; docs, guides, sample apps; helped onboard wallets to WalletConnect
  Certified.
- **Huddle01** — DevRel Engineer · Apr 2023 – Aug 2024. Docs, blogs, sample apps,
  SDK contributions → 200+ projects built; built FarHouse (30K+ MAUs); grew Discord
  2K → 13K+.
- **Google Summer of Code '22** — Oppia Foundation · 2022. Merged 30+ PRs improving
  accessibility in the Oppia Android app.

**Skills** (from resume):
- **Languages:** TypeScript, JavaScript, Solidity, Python, Rust (familiar)
- **Backend:** Node.js, PostgreSQL, Supabase, Firebase, Redis, AWS, Clickhouse
- **Web3:** Solana, EVM, Ethers.js, Web3.js, solanakit, Wagmi/Viem, Dune
- **DevRel & Solutions:** technical docs, SDK integration support, sample apps &
  demos, client/customer support, developer community & conference speaking

**Achievements** (from resume):
- 2nd prize, DeFi track, **Colosseum Breakout Hackathon**; selected for
  **Colosseum Accelerator Cohort 3** (YC for Solana).
- **ETHGlobal Finalist**; winner of **30+ hackathons**; builder grants from Base
  and Superteam.
- **Speaker at 25+ conferences**; mentor at ETHIndia and HackFS.

### Projects `/projects` + `/projects/:slug`
Seeded MDX (one file each):

1. **MetEngine** *(featured)* — "Solana liquidity & yield platform." Tags: Solana,
   DeFi, Backend, Data. Metrics: $114M+ volume, 8.5K+ users, $4.3M+ yield. Role:
   Co-Founder & CTO. Links: none (no public URL; private repo).
2. **Stackit** — "Theme-based investable baskets of tokens." Built at Solana
   Startup Village; curated baskets with fund analytics + referral program. Won 2nd
   prize at Solana Hacker House + Superteam grant. Tags: Solana, DeFi, Hackathon.
   Links: none.
3. **Farview.id** — "Personalized Farcaster & Base profile pages." Surfaces
   Farcaster + on-chain activity; 6K+ users, 12K+ Frame interactions. Won the
   Social track at Base On-chain Summer Buildathon + Base builder grant.
   `live` = https://farview.id. Tags: Farcaster, Base, Frames.
4. **FarHouse** — "Farcaster audio-spaces client with in-app tipping." 30K+ MAUs.
   `live` = https://farhouse.club. Tags: Farcaster, Audio, Social.

Plus a styled **"AI projects — building in public / coming soon"** block at the top
or bottom of the grid, trivially replaced by real MDX files as the 7-day-sprint
demos ship.

### Writing `/writing` + `/writing/:slug`
Scaffolded. Seeded with one **draft** placeholder post:
"Switching from crypto to AI — building in public." (Hidden in prod while
`draft: true`; visible in dev.)

### Resume `/resume`
Embed `public/vraj-desai-resume.pdf` (`<object>`/`<iframe>`, lazy) + a prominent
Download button. PDF path configurable in `site.ts`.

### 404 `*`
On-brand not-found with a link home.

---

## 8. Design system — "Technical / metrics-forward"

- **Type:** system sans stack for body/headings (`-apple-system, …`); **one
  webfont** — **JetBrains Mono** (variable, self-hosted, subset, preloaded) for
  labels, stats, code, and accents. Satisfies PRD "system fonts or one optimized
  webfont."
- **Section labels:** mono, uppercase, letter-spaced, paired with a hairline rule
  (e.g. `EXPERIENCE`, `PROJECTS`).
- **Color:** monochrome neutral scale + **one accent** (default: signal green),
  defined as CSS variables so a retheme is a one-line change. Variables:
  `--bg --surface --fg --muted --border --accent --accent-fg`. Both themes defined;
  contrast AA+ (body ≥ 4.5:1).
- **Layout:** content max-width ~ 760px; project grid wider/responsive. Hairline
  1px low-contrast borders; visible structure/grid as the motif. Generous vertical
  rhythm. Numbers rendered large in mono.
- **Theme:** system default via `prefers-color-scheme`; toggle cycles
  **System → Light → Dark**, persisted to `localStorage["theme"]`. No-flash inline
  script in `index.html` sets `data-theme`/class on `<html>` before first paint.
  Tailwind v4 dark variant keyed off that.
- **Motion:** subtle only — short fade/translate on scroll-in, card hover (border →
  accent), optional hero cursor blink. All gated by `prefers-reduced-motion`.
- **Responsive:** mobile-first; verified at 360 / 768 / 1280.

---

## 9. SEO / OG / metadata

- Per-route `<title>` + meta description via `Seo.tsx` (driven by `lib/seo.ts`).
- Open Graph + Twitter `summary_large_image` tags; `og:image` = the per-route PNG
  (absolute URL from `site.baseUrl`).
- **OG generation** (`scripts/generate-og.tsx`): satori renders a branded card
  (name + page/project title + key metric) → SVG → PNG via resvg. Outputs:
  `dist/og/home.png`, `…/about.png`, `…/projects.png`, `…/projects-<slug>.png`,
  `…/writing-<slug>.png`. Runs in the build pipeline; fails build if a route's card
  can't render.
- `sitemap.xml` (generated from route registry + content slugs), `robots.txt`
  (static, references sitemap), `favicon.svg`, `apple-touch-icon`,
  `manifest.webmanifest`.
- **JSON-LD `Person`** on Home.
- All external/social/email links: `target="_blank" rel="noopener noreferrer"`.

---

## 10. Performance & accessibility bar

- **Lighthouse ≥ 95** on Performance, Accessibility, Best Practices, SEO for `/`,
  `/about`, `/projects`.
- Static generation; minimal hydration; route-level code splitting; font preload +
  `font-display: swap`; images lazy with explicit `width`/`height` (no CLS).
- Core content readable with **JavaScript disabled**.
- **A11y:** semantic landmarks, skip-to-content link, visible `:focus-visible`
  rings, labeled theme toggle (`aria-*`), alt text, full keyboard nav,
  reduced-motion support.

---

## 11. AI demos hosting architecture (documented in README)

- **One brand, many demos.** Pattern: `https://<project>.vrajdesai.dev` (Vercel
  subdomain) per standalone demo; or `/projects/<slug>/demo` for lightweight ones.
- Each demo links back to its `/projects/<slug>` write-up (problem, stack,
  learnings, eval results).
- **Secrets:** all API keys server-side via environment variables; never exposed in
  client bundles.
- **Working placeholder (acceptance):** ship the "AI — building in public" block
  plus a documented reserved route, so the pattern is demonstrably live and a new
  demo is a documented, repeatable step.

---

## 12. Analytics

`@vercel/analytics` mounted at the app root, **production only**. Privacy-respecting,
no cookie banner needed. Plausible documented as a drop-in alternative in README.

---

## 13. Testing & verification ("prove it works")

**TDD for pure logic** (write tests first):
- `lib/content.ts` — parses/validates frontmatter, hides drafts in prod, sorts
  projects (order→title) and posts (date desc), `getBySlug` hit/miss.
- `lib/seo.ts` — route+data → correct title/description/ogImage/JSON-LD.
- OG metadata mapper — route → expected card fields.

**Build verification:**
- `tsc --noEmit` clean; `vite build` succeeds.
- `generate-og` and `generate-sitemap` emit all expected files.
- `scripts/check-build.ts` asserts each route's `dist/**/index.html` contains the
  expected `<title>`, `og:image`, and (home) JSON-LD — i.e. present **without JS**.

**Manual/Visual:**
- Lighthouse ≥ 95 on the three target routes.
- Browser pass (Claude-in-Chrome) on dev server: theme toggle + no-flash,
  responsive at 360/768/1280, links open in new tabs.
- Confirm a sample OG PNG renders correctly.
- **"Add a project" proof:** drop one new MDX file → it appears in the grid and
  gets its own static page + OG image, with zero code changes.

---

## 14. Acceptance criteria (from PRD §13)

- [ ] Deploys to vrajdesai.dev over HTTPS.
- [ ] Home, About, Projects, Projects/:slug, Resume render and are responsive.
- [ ] All resume content present and accurate (per §7).
- [ ] Adding a project = one MDX file, no code changes.
- [ ] Dark/light (+ system) toggle works; Lighthouse ≥ 95 across categories.
- [ ] OG images render correctly when shared on X/Farcaster.
- [ ] AI-demo subdomain/route pattern documented in README with a working
      placeholder.
- [ ] All social/email links correct and open in new tabs.

---

## 15. Out of scope / future

- v2: ship 7-day-sprint AI demos to subdomains; link from `/projects`.
- v3: `/writing` build-in-public posts with RSS.
- v4: optional `vraj.sh` short-link redirecting to vrajdesai.dev.

---

## 16. Open items (owner to provide; placeholders until then)

- **Profile photo** (hero + about) — slot ships with placeholder.
- Any project **demo videos**.
- Final wording for the **"Currently"** line (sensible default shipped).
- Real **AI project** content as the sprint demos ship.
