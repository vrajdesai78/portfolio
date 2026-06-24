# vrajdesai.dev Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a fast, statically-generated personal site at vrajdesai.dev (portfolio + future AI-demo host) on minimal Vite + React, where adding a project is one MDX file.

**Architecture:** Vite + React 18 + TypeScript, pre-rendered to static HTML per route by `vite-react-ssg` (light hydration). Content is MDX files loaded via `import.meta.glob`; identity lives in one typed `site.ts`. Per-page OG PNGs and `sitemap.xml` are emitted by Node build scripts that read the same content from disk. Design is hand-built (no template fork), borrowing specific patterns from reference sites.

**Tech Stack:** Vite, `vite-react-ssg`, React 18, TypeScript (strict), Tailwind CSS v4 (`@tailwindcss/vite`), MDX (`@mdx-js/rollup` + `remark-frontmatter` + `remark-mdx-frontmatter`), `satori` + `@resvg/resvg-js` (OG), `gray-matter` (build-time frontmatter), Vitest + Testing Library, `@vercel/analytics`.

## Global Constraints

These apply to EVERY task.

- **No Next.js.** Vite only. Static generation via `vite-react-ssg`.
- **Package manager: pnpm** (NOT npm/npx). Install with `pnpm add` / `pnpm add -D`, run scripts with `pnpm <script>` (e.g. `pnpm typecheck`), run binaries with `pnpm exec` (e.g. `pnpm exec vitest run …`). Dependency build approvals live in `pnpm-workspace.yaml` (already set: `allowBuilds: { esbuild: true }`).
- **Versions — ACTUAL installed (Task 1 resolved peers):** `react`/`react-dom` 18.3 · **`react-router-dom` 6.30 (vite-react-ssg 0.9 requires v6 — use v6 APIs)** · `vite-react-ssg` 0.9 · `vite` 7.3 · `@vitejs/plugin-react` 5.2 · `tailwindcss` + `@tailwindcss/vite` 4.3 · `@mdx-js/rollup` 3.1 · `remark-frontmatter` 5 · `remark-mdx-frontmatter` 5 · `satori` 0.26 · `@resvg/resvg-js` 2.6 · `gray-matter` 4 · `@types/react`/`@types/react-dom` 18.3 · `typescript-eslint` 8 (flat `eslint.config.js`).
- **Tailwind v4 specifics:** no `tailwind.config.js`; CSS entry is `@import "tailwindcss";`; dark mode via `@custom-variant dark (&:where(.dark, .dark *));`; design tokens via `@theme`.
- **vite-react-ssg specifics:** entry must `export const createRoot = ViteReactSSG({ routes })`; routes are React-Router `RouteRecord[]`; lazy route modules export `Component` (not default); **`getStaticPaths()` returns relative full paths WITHOUT a leading slash** (e.g. `'projects/metengine'`); head via the bundled `<Head>` component (a React-Helmet wrapper) imported from `vite-react-ssg`.
- **satori gotcha:** it throws if text is rendered without a matching font; use a **static** (non-variable) `.ttf` and ensure the font `name` matches the `fontFamily` in styles.
- **Content copy is authoritative from the resume** (see Task 15). Metrics verbatim: `$114M+` volume, `8.5K+` users, `$4.3M+` yield, `6,000+` txns, `2,500+` ext. downloads, `30K+` MAUs (FarHouse), `6K+` users / `12K+` Frame interactions (Farview), `200+` projects (Huddle01), `30+` PRs (GSoC), `30+` hackathon wins, `25+` talks.
- **Link rules:** footer socials = GitHub, X, LinkedIn, email only (NO Farcaster). MetEngine and Stackit have NO links. Farview.id → `https://farview.id`, FarHouse → `https://farhouse.club`. Email: `vrajdesai78@gmail.com`. All external links open in new tab with `rel="noopener noreferrer"`.
- **Design steal-list (apply when styling):** StatStrip ← Tailwind Plus *Studio* big mono stat blocks + hairline dividers; `/about` timeline ← *brittanychiang.com* dated experience rows; project rows ← *emilkowal.ski* / *paco.me* annotated one-line rows; dark/light discipline ← *joshwcomeau.com*; mono restraint ← *rauno.me* / *paco.me*. Aesthetic: monochrome + one accent, mono labels (uppercase, letter-spaced) with hairline rules, numbers large in mono.
- **Quality bar:** TypeScript strict; core content renders without JS; Lighthouse ≥95 (Perf/A11y/Best/SEO) on `/`, `/about`, `/projects`; no CLS; `prefers-reduced-motion` respected; AA contrast.
- **Process:** TDD for all pure logic; commit after every passing task; never commit `Co-Authored-By` trailers.

## File Structure

```
public/
  vraj-desai-resume.pdf       favicon.svg  apple-touch-icon.png
  manifest.webmanifest        robots.txt
  fonts/JetBrainsMono-Variable.woff2   (subset, served + preloaded)
src/
  config/site.ts              # identity: name, tagline, socials, email, stats, currently, nav, baseUrl
  content/
    projects/*.mdx            # one file per project
    writing/*.mdx             # one file per post
  lib/
    content.ts                # glob → typed, sorted, draft-filtered lists + getBySlug (+ pure parse fns)
    seo.ts                    # pure: buildSeo(), personJsonLd()
    og.ts                     # pure: ogImagePath(), ogCard()  (no import.meta.glob — node-safe)
    theme.ts                  # pure: resolveTheme(), cycleTheme(), storage + apply
  components/
    Layout.tsx  Header.tsx  Footer.tsx  SkipLink.tsx  Container.tsx  Section.tsx
    Seo.tsx  ThemeToggle.tsx
    StatStrip.tsx  ProjectCard.tsx  ProjectRow.tsx
    Timeline.tsx  SkillGroup.tsx  AchievementList.tsx  MDXComponents.tsx
  pages/
    Home.tsx  About.tsx  Projects.tsx  ProjectDetail.tsx
    Writing.tsx  PostDetail.tsx  Resume.tsx  NotFound.tsx
  test/setup.ts
  App.tsx                     # routes table
  main.tsx                    # ViteReactSSG createRoot
  index.css                   # @import tailwindcss + @custom-variant + @theme + tokens
  mdx.d.ts  vite-env.d.ts
scripts/
  content-fs.ts               # node-side: read content dir via gray-matter → route list
  generate-og.tsx             # satori + resvg → dist/og/*.png
  generate-sitemap.ts         # → dist/sitemap.xml
  check-build.ts              # assert dist HTML has title/og/jsonld
  og-fonts/                   # Inter + JetBrains Mono .ttf (build-only, not shipped)
index.html                    # no-flash theme script, font preload
vite.config.ts  vitest.config.ts  tsconfig.json  tsconfig.node.json
.eslintrc.cjs  .prettierrc  package.json  README.md
```

---

### Task 1: Project scaffold & toolchain

**Files:**
- Create: `package.json`, `vite.config.ts`, `vitest.config.ts`, `tsconfig.json`, `tsconfig.node.json`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/index.css`, `src/vite-env.d.ts`, `src/mdx.d.ts`, `src/test/setup.ts`, `src/components/Layout.tsx`, `src/pages/Home.tsx`, `.prettierrc`, `.eslintrc.cjs`

**Interfaces:**
- Produces: `routes` (exported from `src/App.tsx`), `createRoot` (exported from `src/main.tsx`). A working `pnpm run dev`, `pnpm run build`, `pnpm test`, `pnpm run typecheck`.

- [ ] **Step 1: Init package + install deps**

```bash
cd /Users/vrajdesai/Development/personal/portfolio
pnpm init
pnpm add react@^18.3 react-dom@^18.3 react-router-dom@^7 vite-react-ssg @vercel/analytics
pnpm add -D vite @vitejs/plugin-react typescript @types/react @types/react-dom @types/node \
  @tailwindcss/vite tailwindcss \
  @mdx-js/rollup @mdx-js/react @types/mdx remark-frontmatter remark-mdx-frontmatter \
  vitest @testing-library/react @testing-library/jest-dom jsdom \
  tsx satori @resvg/resvg-js gray-matter \
  eslint prettier
```

Expected: installs without ERESOLVE. If peer conflicts appear, align `vite` / `react-router-dom` to `vite-react-ssg`'s peer ranges (re-run with the version it names).

- [ ] **Step 2: Write `package.json` scripts block** (merge into the generated file)

```json
{
  "name": "vrajdesai-dev",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite-react-ssg dev",
    "build": "vite-react-ssg build && tsx scripts/generate-og.tsx && tsx scripts/generate-sitemap.ts && tsx scripts/check-build.ts",
    "build:app": "vite-react-ssg build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest",
    "typecheck": "tsc --noEmit",
    "lint": "eslint . --ext .ts,.tsx"
  }
}
```

- [ ] **Step 3: Write `tsconfig.json` and `tsconfig.node.json`**

```jsonc
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": false,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "types": ["vite/client", "vitest/globals", "@testing-library/jest-dom"]
  },
  "include": ["src", "scripts"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

```jsonc
// tsconfig.node.json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true
  },
  "include": ["vite.config.ts", "vitest.config.ts"]
}
```

- [ ] **Step 4: Write `vite.config.ts`** (MDX `enforce:'pre'` BEFORE react; react `include` covers mdx)

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mdx from '@mdx-js/rollup'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    { enforce: 'pre', ...mdx({ remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter] }) },
    react({ include: /\.(jsx|js|mdx|md|tsx|ts)$/ }),
    tailwindcss(),
  ],
})
```

- [ ] **Step 5: Write `vitest.config.ts`** (jsdom; no mdx/tailwind plugins needed for tests)

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: { environment: 'jsdom', globals: true, setupFiles: ['./src/test/setup.ts'] },
})
```

```ts
// src/test/setup.ts
import '@testing-library/jest-dom'
```

- [ ] **Step 6: Write type declarations**

```ts
// src/vite-env.d.ts
/// <reference types="vite/client" />
```

```ts
// src/mdx.d.ts
declare module '*.mdx' {
  import type { ComponentType } from 'react'
  const MDXComponent: ComponentType<Record<string, unknown>>
  export default MDXComponent
  export const frontmatter: Record<string, unknown>
}
```

- [ ] **Step 7: Write `src/index.css`** (Tailwind v4 entry + dark variant + tokens; runtime vars flip on `.dark`)

```css
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

@font-face {
  font-family: "JetBrains Mono";
  src: url("/fonts/JetBrainsMono-Variable.woff2") format("woff2");
  font-weight: 100 800;
  font-display: swap;
}

/* Map semantic tokens to runtime CSS vars so utilities (bg-bg, text-fg…) flip at runtime */
@theme {
  --color-bg: var(--bg);
  --color-surface: var(--surface);
  --color-fg: var(--fg);
  --color-muted: var(--muted);
  --color-border: var(--border);
  --color-accent: var(--accent);
  --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
  --font-sans: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

:root {
  --bg: #ffffff; --surface: #fafafa; --fg: #0a0a0b;
  --muted: #5b616e; --border: #e6e7eb; --accent: #0e9f6e;
}
.dark {
  --bg: #0a0a0b; --surface: #111114; --fg: #f5f6f7;
  --muted: #9aa0ac; --border: #26262b; --accent: #16db95;
}

html { color-scheme: light dark; }
body { background: var(--bg); color: var(--fg); font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased; }
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
```

- [ ] **Step 8: Write `index.html`** (no-flash theme script runs before paint; font preload)

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="preload" href="/fonts/JetBrainsMono-Variable.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="manifest" href="/manifest.webmanifest" />
    <script>
      (function () {
        try {
          var t = localStorage.getItem('theme');
          var sysDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          var dark = t === 'dark' || ((t === 'system' || !t) && sysDark);
          document.documentElement.classList.toggle('dark', dark);
        } catch (e) {}
      })();
    </script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 9: Write `src/main.tsx`, `src/App.tsx`, minimal `Layout` + `Home`**

```tsx
// src/main.tsx
import { ViteReactSSG } from 'vite-react-ssg'
import { routes } from './App'
import './index.css'

export const createRoot = ViteReactSSG({ routes })
```

```tsx
// src/App.tsx
import type { RouteRecord } from 'vite-react-ssg'
import Layout from './components/Layout'

export const routes: RouteRecord[] = [
  {
    path: '/',
    element: <Layout />,
    children: [{ index: true, lazy: () => import('./pages/Home') }],
  },
]
```

```tsx
// src/components/Layout.tsx
import { Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <div className="min-h-screen">
      <main>
        <Outlet />
      </main>
    </div>
  )
}
```

```tsx
// src/pages/Home.tsx
export function Component() {
  return <h1 className="font-mono p-8 text-2xl">Vraj Desai</h1>
}
```

- [ ] **Step 10: Verify the toolchain runs, then commit**

```bash
pnpm run typecheck          # Expected: no errors
pnpm test                   # Expected: "No test files found" (exit 0) — acceptable at this stage
pnpm run build:app          # Expected: dist/ created with index.html containing "Vraj Desai"
test -f dist/index.html && grep -q "Vraj Desai" dist/index.html && echo "SSG OK"
git add -A && git commit -m "chore: scaffold Vite + React SSG + Tailwind v4 toolchain"
```

Expected final: `SSG OK` prints; commit succeeds.

---

### Task 2: Site config + types

**Files:**
- Create: `src/config/site.ts`, `src/config/site.test.ts`

**Interfaces:**
- Produces: `site` object and types `Social`, `Stat`, `NavItem`, `SiteConfig`. Consumed by Layout, Home, Seo, OG, sitemap.
  - `site.baseUrl: string` · `site.name: string` · `site.role: string` · `site.tagline: string` · `site.currently: string` · `site.email: string` · `site.resumePath: string` · `site.socials: Social[]` (`{label, href}`) · `site.stats: Stat[]` (`{value, label}`) · `site.nav: NavItem[]` (`{label, path}`).

- [ ] **Step 1: Write the failing test**

```ts
// src/config/site.test.ts
import { describe, it, expect } from 'vitest'
import { site } from './site'

describe('site config', () => {
  it('uses https base url with no trailing slash', () => {
    expect(site.baseUrl).toBe('https://vrajdesai.dev')
  })
  it('uses the correct public email', () => {
    expect(site.email).toBe('vrajdesai78@gmail.com')
  })
  it('has GitHub, X, LinkedIn, email socials and NO Farcaster', () => {
    const labels = site.socials.map((s) => s.label.toLowerCase())
    expect(labels).toEqual(expect.arrayContaining(['github', 'x', 'linkedin', 'email']))
    expect(labels).not.toContain('farcaster')
  })
  it('exposes exactly four hero stats', () => {
    expect(site.stats).toHaveLength(4)
    expect(site.stats[0].value).toBe('$114M+')
  })
  it('nav covers the core routes', () => {
    expect(site.nav.map((n) => n.path)).toEqual(['/about', '/projects', '/writing', '/resume'])
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest run src/config/site.test.ts`
Expected: FAIL — `Cannot find module './site'`.

- [ ] **Step 3: Write `src/config/site.ts`**

```ts
export interface Social { label: string; href: string }
export interface Stat { value: string; label: string }
export interface NavItem { label: string; path: string }
export interface SiteConfig {
  name: string; role: string; tagline: string; currently: string;
  email: string; baseUrl: string; resumePath: string;
  socials: Social[]; stats: Stat[]; nav: NavItem[];
}

export const site: SiteConfig = {
  name: 'Vraj Desai',
  role: 'Engineer & builder',
  tagline:
    'Engineer & builder. Co-founded a Solana DeFi platform that did $114M+ in volume. Now building in AI.',
  currently:
    'Wrapping up MetEngine and going deep on AI engineering — building in public.',
  email: 'vrajdesai78@gmail.com',
  baseUrl: 'https://vrajdesai.dev',
  resumePath: '/vraj-desai-resume.pdf',
  socials: [
    { label: 'GitHub', href: 'https://github.com/vrajdesai78' },
    { label: 'X', href: 'https://x.com/vrajdesai78' },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/vrajdesai78' },
    { label: 'Email', href: 'mailto:vrajdesai78@gmail.com' },
  ],
  stats: [
    { value: '$114M+', label: 'volume' },
    { value: '8.5K+', label: 'users' },
    { value: '30+', label: 'hackathon wins' },
    { value: 'Colosseum', label: 'accelerator' },
  ],
  nav: [
    { label: 'About', path: '/about' },
    { label: 'Projects', path: '/projects' },
    { label: 'Writing', path: '/writing' },
    { label: 'Resume', path: '/resume' },
  ],
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm exec vitest run src/config/site.test.ts`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add src/config/site.ts src/config/site.test.ts
git commit -m "feat: add typed site config (identity, socials, stats, nav)"
```

---

### Task 3: Content loader (TDD)

**Files:**
- Create: `src/lib/content.ts`, `src/lib/content.test.ts`

**Interfaces:**
- Consumes: MDX modules shaped `{ default: ComponentType, frontmatter: ProjectFrontmatter | PostFrontmatter }`.
- Produces:
  - Types `ProjectFrontmatter`, `Project`, `PostFrontmatter`, `Post`, `MetricItem`, `ProjectLinks`.
  - `parseProjects(modules, opts): Project[]` and `parsePosts(modules, opts): Post[]` (pure).
  - `projects: Project[]`, `posts: Post[]` (glob-backed live data).
  - `getProjectBySlug(slug): Project | undefined`, `getPostBySlug(slug): Post | undefined`.
  - `projectStaticPaths(): string[]` and `postStaticPaths(): string[]` → e.g. `['projects/metengine', …]`.

- [ ] **Step 1: Write the failing test**

```ts
// src/lib/content.test.ts
import { describe, it, expect } from 'vitest'
import { parseProjects, parsePosts, type ProjectFrontmatter } from './content'

const Comp = () => null
const mod = (frontmatter: Partial<ProjectFrontmatter>) => ({ default: Comp, frontmatter: frontmatter as ProjectFrontmatter })

describe('parseProjects', () => {
  const modules = {
    '../content/projects/metengine.mdx': mod({ title: 'MetEngine', oneliner: 'x', tags: ['Solana'], order: 1 }),
    '../content/projects/farview.mdx': mod({ title: 'Farview.id', oneliner: 'y', tags: ['Base'], order: 2 }),
    '../content/projects/wip.mdx': mod({ title: 'WIP', oneliner: 'z', tags: ['AI'], order: 3, draft: true }),
  }
  it('derives slug from filename', () => {
    const p = parseProjects(modules, { includeDrafts: true })
    expect(p.map((x) => x.slug)).toContain('metengine')
  })
  it('sorts by order ascending', () => {
    const p = parseProjects(modules, { includeDrafts: false })
    expect(p.map((x) => x.slug)).toEqual(['metengine', 'farview'])
  })
  it('hides drafts when includeDrafts is false', () => {
    expect(parseProjects(modules, { includeDrafts: false }).some((x) => x.slug === 'wip')).toBe(false)
    expect(parseProjects(modules, { includeDrafts: true }).some((x) => x.slug === 'wip')).toBe(true)
  })
  it('throws on missing required frontmatter', () => {
    const bad = { '../content/projects/bad.mdx': mod({ title: 'No oneliner', tags: [] } as never) }
    expect(() => parseProjects(bad, { includeDrafts: true })).toThrow(/oneliner/)
  })
})

describe('parsePosts', () => {
  it('sorts by date descending and hides drafts', () => {
    const modules = {
      '../content/writing/a.mdx': { default: Comp, frontmatter: { title: 'A', date: '2026-01-01', summary: 's' } },
      '../content/writing/b.mdx': { default: Comp, frontmatter: { title: 'B', date: '2026-03-01', summary: 's' } },
      '../content/writing/c.mdx': { default: Comp, frontmatter: { title: 'C', date: '2026-02-01', summary: 's', draft: true } },
    }
    const posts = parsePosts(modules, { includeDrafts: false })
    expect(posts.map((p) => p.slug)).toEqual(['b', 'a'])
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest run src/lib/content.test.ts`
Expected: FAIL — `Cannot find module './content'`.

- [ ] **Step 3: Write `src/lib/content.ts`**

```ts
import type { ComponentType } from 'react'

export interface MetricItem { label: string; value: string }
export interface ProjectLinks { live?: string; github?: string; video?: string }
export interface ProjectFrontmatter {
  title: string; slug?: string; oneliner: string; tags: string[];
  role?: string; period?: string; metrics?: MetricItem[]; links?: ProjectLinks;
  featured?: boolean; order?: number; draft?: boolean;
}
export interface PostFrontmatter {
  title: string; slug?: string; date: string; summary: string; tags?: string[]; draft?: boolean;
}
export interface Project { slug: string; Component: ComponentType; frontmatter: ProjectFrontmatter }
export interface Post { slug: string; Component: ComponentType; frontmatter: PostFrontmatter }

interface Mod<F> { default: ComponentType; frontmatter: F }
type Modules<F> = Record<string, Mod<F>>
interface ParseOpts { includeDrafts: boolean }

const slugFromPath = (path: string) => path.split('/').pop()!.replace(/\.mdx$/, '')

export function parseProjects(modules: Modules<ProjectFrontmatter>, opts: ParseOpts): Project[] {
  return Object.entries(modules)
    .map(([path, mod]) => {
      const fm = mod.frontmatter
      if (!fm?.title) throw new Error(`Project ${path}: missing "title"`)
      if (!fm.oneliner) throw new Error(`Project ${path}: missing "oneliner"`)
      if (!Array.isArray(fm.tags) || fm.tags.length === 0) throw new Error(`Project ${path}: missing "tags"`)
      return { slug: fm.slug ?? slugFromPath(path), Component: mod.default, frontmatter: fm }
    })
    .filter((p) => opts.includeDrafts || !p.frontmatter.draft)
    .sort((a, b) =>
      (a.frontmatter.order ?? 999) - (b.frontmatter.order ?? 999) ||
      a.frontmatter.title.localeCompare(b.frontmatter.title))
}

export function parsePosts(modules: Modules<PostFrontmatter>, opts: ParseOpts): Post[] {
  return Object.entries(modules)
    .map(([path, mod]) => {
      const fm = mod.frontmatter
      if (!fm?.title) throw new Error(`Post ${path}: missing "title"`)
      if (!fm.date) throw new Error(`Post ${path}: missing "date"`)
      if (!fm.summary) throw new Error(`Post ${path}: missing "summary"`)
      return { slug: fm.slug ?? slugFromPath(path), Component: mod.default, frontmatter: fm }
    })
    .filter((p) => opts.includeDrafts || !p.frontmatter.draft)
    .sort((a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime())
}

const includeDrafts = import.meta.env.DEV

const projectModules = import.meta.glob<Mod<ProjectFrontmatter>>('../content/projects/*.mdx', { eager: true })
const postModules = import.meta.glob<Mod<PostFrontmatter>>('../content/writing/*.mdx', { eager: true })

export const projects: Project[] = parseProjects(projectModules, { includeDrafts })
export const posts: Post[] = parsePosts(postModules, { includeDrafts })
export const featuredProjects = projects.filter((p) => p.frontmatter.featured)

export const getProjectBySlug = (slug: string) => projects.find((p) => p.slug === slug)
export const getPostBySlug = (slug: string) => posts.find((p) => p.slug === slug)

// SSG runs at build (production) so drafts are excluded from prerender.
export const projectStaticPaths = () =>
  parseProjects(projectModules, { includeDrafts: false }).map((p) => `projects/${p.slug}`)
export const postStaticPaths = () =>
  parsePosts(postModules, { includeDrafts: false }).map((p) => `writing/${p.slug}`)
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm exec vitest run src/lib/content.test.ts`
Expected: PASS (6 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/content.ts src/lib/content.test.ts
git commit -m "feat: add MDX content loader with validation, sorting, draft filtering"
```

---

### Task 4: SEO + OG metadata libs (TDD)

**Files:**
- Create: `src/lib/seo.ts`, `src/lib/seo.test.ts`, `src/lib/og.ts`, `src/lib/og.test.ts`

**Interfaces:**
- `og.ts` (no glob; node-safe): `ogImagePath(path: string): string`; `ogCard(input: OgCardInput): OgCard` where `OgCard = { eyebrow: string; title: string; subtitle?: string; metric?: string }`.
- `seo.ts`: `buildSeo(input: SeoInput): SeoTags`; `personJsonLd(): object`.
  - `SeoInput = { title: string; description: string; path: string; ogType?: 'website' | 'article'; image?: string }`
  - `SeoTags = { title; description; canonical; ogTitle; ogDescription; ogType; ogUrl; ogImage; twitterCard }` (all strings).

- [ ] **Step 1: Write failing tests**

```ts
// src/lib/og.test.ts
import { describe, it, expect } from 'vitest'
import { ogImagePath } from './og'

describe('ogImagePath', () => {
  it('maps home to og/home.png', () => expect(ogImagePath('/')).toBe('/og/home.png'))
  it('maps /about', () => expect(ogImagePath('/about')).toBe('/og/about.png'))
  it('flattens nested project paths', () =>
    expect(ogImagePath('/projects/metengine')).toBe('/og/projects-metengine.png'))
  it('flattens writing paths', () =>
    expect(ogImagePath('/writing/crypto-to-ai')).toBe('/og/writing-crypto-to-ai.png'))
})
```

```ts
// src/lib/seo.test.ts
import { describe, it, expect } from 'vitest'
import { buildSeo, personJsonLd } from './seo'

describe('buildSeo', () => {
  it('builds absolute canonical + og url from path', () => {
    const t = buildSeo({ title: 'Projects', description: 'd', path: '/projects' })
    expect(t.canonical).toBe('https://vrajdesai.dev/projects')
    expect(t.ogUrl).toBe('https://vrajdesai.dev/projects')
  })
  it('defaults og image from path and uses summary_large_image', () => {
    const t = buildSeo({ title: 'About', description: 'd', path: '/about' })
    expect(t.ogImage).toBe('https://vrajdesai.dev/og/about.png')
    expect(t.twitterCard).toBe('summary_large_image')
  })
  it('respects an explicit absolute image', () => {
    const t = buildSeo({ title: 'x', description: 'd', path: '/', image: 'https://cdn/x.png' })
    expect(t.ogImage).toBe('https://cdn/x.png')
  })
  it('defaults ogType to website', () => {
    expect(buildSeo({ title: 'x', description: 'd', path: '/' }).ogType).toBe('website')
  })
})

describe('personJsonLd', () => {
  it('is a schema.org Person with sameAs links', () => {
    const ld = personJsonLd() as Record<string, unknown>
    expect(ld['@type']).toBe('Person')
    expect(ld.name).toBe('Vraj Desai')
    expect(Array.isArray(ld.sameAs)).toBe(true)
  })
})
```

- [ ] **Step 2: Run to verify they fail**

Run: `pnpm exec vitest run src/lib/og.test.ts src/lib/seo.test.ts`
Expected: FAIL — modules not found.

- [ ] **Step 3: Write `src/lib/og.ts`**

```ts
export interface OgCard { eyebrow: string; title: string; subtitle?: string; metric?: string }
export interface OgCardInput { eyebrow: string; title: string; subtitle?: string; metric?: string }

export function ogImagePath(path: string): string {
  if (path === '/') return '/og/home.png'
  const slug = path.replace(/^\/+/, '').replace(/\/+$/, '').replace(/\//g, '-')
  return `/og/${slug}.png`
}

export function ogCard(input: OgCardInput): OgCard {
  return { eyebrow: input.eyebrow, title: input.title, subtitle: input.subtitle, metric: input.metric }
}
```

- [ ] **Step 4: Write `src/lib/seo.ts`**

```ts
import { site } from '../config/site'
import { ogImagePath } from './og'

export interface SeoInput {
  title: string; description: string; path: string;
  ogType?: 'website' | 'article'; image?: string;
}
export interface SeoTags {
  title: string; description: string; canonical: string;
  ogTitle: string; ogDescription: string; ogType: string; ogUrl: string; ogImage: string;
  twitterCard: string;
}

const abs = (p: string) => `${site.baseUrl}${p.startsWith('/') ? p : `/${p}`}`

export function buildSeo(input: SeoInput): SeoTags {
  const url = abs(input.path)
  return {
    title: input.title,
    description: input.description,
    canonical: url,
    ogTitle: input.title,
    ogDescription: input.description,
    ogType: input.ogType ?? 'website',
    ogUrl: url,
    ogImage: input.image ?? abs(ogImagePath(input.path)),
    twitterCard: 'summary_large_image',
  }
}

export function personJsonLd(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: site.name,
    url: site.baseUrl,
    jobTitle: site.role,
    email: `mailto:${site.email}`,
    sameAs: site.socials.filter((s) => s.label !== 'Email').map((s) => s.href),
  }
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `pnpm exec vitest run src/lib/og.test.ts src/lib/seo.test.ts`
Expected: PASS (8 tests).

- [ ] **Step 6: Commit**

```bash
git add src/lib/og.ts src/lib/og.test.ts src/lib/seo.ts src/lib/seo.test.ts
git commit -m "feat: add SEO tag + OG metadata builders"
```

---

### Task 5: Theme system (TDD + component)

**Files:**
- Create: `src/lib/theme.ts`, `src/lib/theme.test.ts`, `src/components/ThemeToggle.tsx`, `src/components/ThemeToggle.test.tsx`

**Interfaces:**
- `theme.ts`: `type Theme = 'light' | 'dark' | 'system'`; `THEME_KEY = 'theme'`; `resolveTheme(theme, systemDark): 'light'|'dark'`; `cycleTheme(current): Theme`; `applyTheme(resolved)`; `getStoredTheme(): Theme`; `setStoredTheme(t)`; `systemPrefersDark(): boolean`.
- `ThemeToggle`: default-exported React component; cycles system→light→dark; sets `.dark` and persists.

- [ ] **Step 1: Write failing test**

```ts
// src/lib/theme.test.ts
import { describe, it, expect } from 'vitest'
import { resolveTheme, cycleTheme } from './theme'

describe('resolveTheme', () => {
  it('system follows the OS preference', () => {
    expect(resolveTheme('system', true)).toBe('dark')
    expect(resolveTheme('system', false)).toBe('light')
  })
  it('explicit choice overrides the OS', () => {
    expect(resolveTheme('light', true)).toBe('light')
    expect(resolveTheme('dark', false)).toBe('dark')
  })
})

describe('cycleTheme', () => {
  it('cycles system → light → dark → system', () => {
    expect(cycleTheme('system')).toBe('light')
    expect(cycleTheme('light')).toBe('dark')
    expect(cycleTheme('dark')).toBe('system')
  })
})
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm exec vitest run src/lib/theme.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Write `src/lib/theme.ts`**

```ts
export type Theme = 'light' | 'dark' | 'system'
export const THEME_KEY = 'theme'

export function systemPrefersDark(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
}
export function resolveTheme(theme: Theme, systemDark: boolean): 'light' | 'dark' {
  if (theme === 'system') return systemDark ? 'dark' : 'light'
  return theme
}
export function cycleTheme(current: Theme): Theme {
  return current === 'system' ? 'light' : current === 'light' ? 'dark' : 'system'
}
export function applyTheme(resolved: 'light' | 'dark'): void {
  document.documentElement.classList.toggle('dark', resolved === 'dark')
}
export function getStoredTheme(): Theme {
  if (typeof localStorage === 'undefined') return 'system'
  const t = localStorage.getItem(THEME_KEY)
  return t === 'light' || t === 'dark' || t === 'system' ? t : 'system'
}
export function setStoredTheme(t: Theme): void {
  try { localStorage.setItem(THEME_KEY, t) } catch { /* ignore */ }
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `pnpm exec vitest run src/lib/theme.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Write `ThemeToggle` + its test**

```tsx
// src/components/ThemeToggle.tsx
import { useEffect, useState } from 'react'
import {
  applyTheme, cycleTheme, getStoredTheme, resolveTheme, setStoredTheme,
  systemPrefersDark, type Theme,
} from '../lib/theme'

const LABEL: Record<Theme, string> = { system: 'System', light: 'Light', dark: 'Dark' }

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('system')
  useEffect(() => { setTheme(getStoredTheme()) }, [])
  useEffect(() => {
    applyTheme(resolveTheme(theme, systemPrefersDark()))
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => { if (getStoredTheme() === 'system') applyTheme(resolveTheme('system', mq.matches)) }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [theme])

  const next = () => { const n = cycleTheme(theme); setTheme(n); setStoredTheme(n) }
  return (
    <button
      type="button" onClick={next}
      aria-label={`Theme: ${LABEL[theme]}. Click to change.`}
      className="font-mono text-xs uppercase tracking-wider px-2 py-1 border border-border rounded hover:text-accent"
    >
      {LABEL[theme]}
    </button>
  )
}
```

```tsx
// src/components/ThemeToggle.test.tsx
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ThemeToggle from './ThemeToggle'

beforeEach(() => localStorage.clear())

describe('ThemeToggle', () => {
  it('defaults to System and cycles to Light on click', () => {
    render(<ThemeToggle />)
    const btn = screen.getByRole('button')
    expect(btn).toHaveTextContent('System')
    fireEvent.click(btn)
    expect(btn).toHaveTextContent('Light')
    expect(localStorage.getItem('theme')).toBe('light')
  })
})
```

- [ ] **Step 6: Run, verify pass, commit**

```bash
pnpm exec vitest run src/lib/theme.test.ts src/components/ThemeToggle.test.tsx   # Expected: PASS
git add src/lib/theme.ts src/lib/theme.test.ts src/components/ThemeToggle.tsx src/components/ThemeToggle.test.tsx
git commit -m "feat: add theme system (system default + cycling toggle, no-flash)"
```

---

### Task 6: Seo component + Layout shell

**Files:**
- Create: `src/components/Seo.tsx`, `src/components/Container.tsx`, `src/components/Section.tsx`, `src/components/SkipLink.tsx`, `src/components/Header.tsx`, `src/components/Footer.tsx`, `src/components/Footer.test.tsx`
- Modify: `src/components/Layout.tsx`

**Interfaces:**
- Consumes: `site` (Task 2), `buildSeo`/`personJsonLd` (Task 4), `ThemeToggle` (Task 5).
- Produces: `<Seo title description path ogType? image? jsonLd?>`; `<Container>`, `<Section title? id?>`, `<SkipLink>`, `<Header>`, `<Footer>`. `Layout` renders Header + `<main id="main">` Outlet + Footer.

- [ ] **Step 1: Write `Seo.tsx`** (uses vite-react-ssg `<Head>`; emits OG/twitter/canonical + optional JSON-LD)

```tsx
// src/components/Seo.tsx
import { Head } from 'vite-react-ssg'
import { buildSeo, type SeoInput } from '../lib/seo'

interface Props extends SeoInput { jsonLd?: object }

export default function Seo({ jsonLd, ...input }: Props) {
  const t = buildSeo(input)
  return (
    <Head>
      <title>{t.title}</title>
      <meta name="description" content={t.description} />
      <link rel="canonical" href={t.canonical} />
      <meta property="og:title" content={t.ogTitle} />
      <meta property="og:description" content={t.ogDescription} />
      <meta property="og:type" content={t.ogType} />
      <meta property="og:url" content={t.ogUrl} />
      <meta property="og:image" content={t.ogImage} />
      <meta name="twitter:card" content={t.twitterCard} />
      <meta name="twitter:title" content={t.ogTitle} />
      <meta name="twitter:description" content={t.ogDescription} />
      <meta name="twitter:image" content={t.ogImage} />
      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Head>
  )
}
```

- [ ] **Step 2: Write layout primitives**

```tsx
// src/components/Container.tsx
import type { ReactNode } from 'react'
export default function Container({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
  return <div className={`mx-auto w-full px-5 ${wide ? 'max-w-5xl' : 'max-w-2xl'}`}>{children}</div>
}
```

```tsx
// src/components/Section.tsx
import type { ReactNode } from 'react'
export default function Section({ title, id, children }: { title?: string; id?: string; children: ReactNode }) {
  return (
    <section id={id} className="py-10 border-t border-border first:border-t-0">
      {title && (
        <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-muted mb-6">{title}</h2>
      )}
      {children}
    </section>
  )
}
```

```tsx
// src/components/SkipLink.tsx
export default function SkipLink() {
  return (
    <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-surface focus:px-3 focus:py-2 focus:border focus:border-border">
      Skip to content
    </a>
  )
}
```

- [ ] **Step 3: Write `Header.tsx` and `Footer.tsx`**

```tsx
// src/components/Header.tsx
import { Link, NavLink } from 'react-router-dom'
import { site } from '../config/site'
import Container from './Container'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  return (
    <header className="border-b border-border">
      <Container wide>
        <nav className="flex items-center justify-between h-14">
          <Link to="/" className="font-mono font-semibold tracking-tight">vrajdesai.dev</Link>
          <div className="flex items-center gap-4">
            {site.nav.map((n) => (
              <NavLink key={n.path} to={n.path}
                className={({ isActive }) =>
                  `font-mono text-xs uppercase tracking-wider hover:text-accent ${isActive ? 'text-fg' : 'text-muted'}`}>
                {n.label}
              </NavLink>
            ))}
            <ThemeToggle />
          </div>
        </nav>
      </Container>
    </header>
  )
}
```

```tsx
// src/components/Footer.tsx
import { site } from '../config/site'
import Container from './Container'

export default function Footer() {
  return (
    <footer className="border-t border-border mt-16 py-10">
      <Container wide>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="font-mono text-xs text-muted">© {site.name}</p>
          <ul className="flex flex-wrap gap-4">
            {site.socials.map((s) => (
              <li key={s.label}>
                <a href={s.href}
                  target={s.href.startsWith('mailto:') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  className="font-mono text-xs uppercase tracking-wider text-muted hover:text-accent">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  )
}
```

```tsx
// src/components/Footer.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Footer from './Footer'

describe('Footer', () => {
  it('renders GitHub/X/LinkedIn/Email and NOT Farcaster', () => {
    render(<Footer />)
    expect(screen.getByText('GitHub')).toBeInTheDocument()
    expect(screen.getByText('Email').closest('a')).toHaveAttribute('href', 'mailto:vrajdesai78@gmail.com')
    expect(screen.queryByText(/farcaster/i)).toBeNull()
  })
})
```

- [ ] **Step 4: Rewrite `Layout.tsx`**

```tsx
// src/components/Layout.tsx
import { Outlet } from 'react-router-dom'
import SkipLink from './SkipLink'
import Header from './Header'
import Footer from './Footer'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <SkipLink />
      <Header />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
```

- [ ] **Step 5: Verify, then commit**

Run: `pnpm exec vitest run src/components/Footer.test.tsx` → Expected: PASS.
Run: `pnpm run typecheck` → Expected: no errors.

```bash
git add src/components/*.tsx
git commit -m "feat: add Seo component + layout shell (header, footer, section, skip link)"
```

---

### Task 7: Display components — StatStrip, ProjectCard, ProjectRow (TDD)

**Files:**
- Create: `src/components/StatStrip.tsx`, `src/components/ProjectCard.tsx`, `src/components/ProjectRow.tsx`, `src/components/ProjectCard.test.tsx`, `src/components/StatStrip.test.tsx`

**Interfaces:**
- Consumes: `Stat` (Task 2), `Project` (Task 3).
- Produces: `<StatStrip stats={Stat[]} />`; `<ProjectCard project={Project} />`; `<ProjectRow project={Project} />`. ProjectCard renders metrics + tag chips; renders link buttons ONLY for present links (none for MetEngine/Stackit).

- [ ] **Step 1: Write failing tests**

```tsx
// src/components/StatStrip.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import StatStrip from './StatStrip'

describe('StatStrip', () => {
  it('renders each stat value and label', () => {
    render(<StatStrip stats={[{ value: '$114M+', label: 'volume' }, { value: '8.5K+', label: 'users' }]} />)
    expect(screen.getByText('$114M+')).toBeInTheDocument()
    expect(screen.getByText('users')).toBeInTheDocument()
  })
})
```

```tsx
// src/components/ProjectCard.test.tsx
import { describe, it, expect } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import ProjectCard from './ProjectCard'
import type { Project } from '../lib/content'

const make = (over: Partial<Project['frontmatter']> = {}): Project => ({
  slug: 'metengine', Component: () => null,
  frontmatter: { title: 'MetEngine', oneliner: 'Solana liquidity & yield platform.', tags: ['Solana', 'DeFi'],
    metrics: [{ label: 'volume', value: '$114M+' }], ...over },
})

const wrap = (ui: React.ReactNode) => render(<MemoryRouter>{ui}</MemoryRouter>)

describe('ProjectCard', () => {
  it('renders title, oneliner, tags, metrics', () => {
    wrap(<ProjectCard project={make()} />)
    expect(screen.getByText('MetEngine')).toBeInTheDocument()
    expect(screen.getByText('Solana')).toBeInTheDocument()
    expect(screen.getByText('$114M+')).toBeInTheDocument()
  })
  it('renders NO external link buttons when links are absent', () => {
    wrap(<ProjectCard project={make()} />)
    expect(screen.queryByRole('link', { name: /live|github|video/i })).toBeNull()
  })
  it('renders a Live button when a live link exists', () => {
    wrap(<ProjectCard project={make({ links: { live: 'https://farview.id' } })} />)
    const live = screen.getByRole('link', { name: /live/i })
    expect(live).toHaveAttribute('href', 'https://farview.id')
    expect(live).toHaveAttribute('target', '_blank')
  })
})
```

- [ ] **Step 2: Run to verify they fail**

Run: `pnpm exec vitest run src/components/StatStrip.test.tsx src/components/ProjectCard.test.tsx`
Expected: FAIL — modules not found.

- [ ] **Step 3: Write the components**

```tsx
// src/components/StatStrip.tsx
import type { Stat } from '../config/site'
export default function StatStrip({ stats }: { stats: Stat[] }) {
  return (
    <dl className="grid grid-cols-2 sm:grid-cols-4 border border-border divide-x divide-y sm:divide-y-0 divide-border">
      {stats.map((s) => (
        <div key={s.label} className="p-4">
          <dt className="font-mono text-2xl sm:text-3xl text-fg">{s.value}</dt>
          <dd className="font-mono text-[11px] uppercase tracking-wider text-muted mt-1">{s.label}</dd>
        </div>
      ))}
    </dl>
  )
}
```

```tsx
// src/components/ProjectCard.tsx
import { Link } from 'react-router-dom'
import type { Project } from '../lib/content'

const LINK_LABELS: Record<string, string> = { live: 'Live', github: 'GitHub', video: 'Video' }

export default function ProjectCard({ project }: { project: Project }) {
  const { slug, frontmatter: f } = project
  return (
    <article className="border border-border p-5 hover:border-accent transition-colors">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-mono text-lg">
          <Link to={`/projects/${slug}`} className="hover:text-accent">{f.title}</Link>
        </h3>
      </div>
      <p className="text-sm text-muted mt-1">{f.oneliner}</p>
      {f.metrics && f.metrics.length > 0 && (
        <ul className="flex flex-wrap gap-x-5 gap-y-1 mt-3">
          {f.metrics.map((m) => (
            <li key={m.label} className="font-mono text-sm">
              <span className="text-fg">{m.value}</span>{' '}
              <span className="text-muted text-xs uppercase tracking-wider">{m.label}</span>
            </li>
          ))}
        </ul>
      )}
      <div className="flex flex-wrap gap-2 mt-4">
        {f.tags.map((t) => (
          <span key={t} className="font-mono text-[11px] uppercase tracking-wider text-muted border border-border px-2 py-0.5">{t}</span>
        ))}
      </div>
      {f.links && Object.keys(f.links).length > 0 && (
        <div className="flex gap-3 mt-4">
          {(Object.entries(f.links) as [string, string][]).map(([k, href]) => (
            <a key={k} href={href} target="_blank" rel="noopener noreferrer"
              className="font-mono text-xs uppercase tracking-wider text-accent hover:underline">
              {LINK_LABELS[k] ?? k} ↗
            </a>
          ))}
        </div>
      )}
    </article>
  )
}
```

```tsx
// src/components/ProjectRow.tsx
import { Link } from 'react-router-dom'
import type { Project } from '../lib/content'

export default function ProjectRow({ project }: { project: Project }) {
  const { slug, frontmatter: f } = project
  return (
    <Link to={`/projects/${slug}`}
      className="group flex items-baseline justify-between gap-4 py-3 border-b border-border hover:text-accent">
      <span className="font-mono">{f.title}</span>
      <span className="text-sm text-muted truncate group-hover:text-accent">{f.oneliner}</span>
    </Link>
  )
}
```

- [ ] **Step 4: Run to verify they pass**

Run: `pnpm exec vitest run src/components/StatStrip.test.tsx src/components/ProjectCard.test.tsx`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/StatStrip.tsx src/components/ProjectCard.tsx src/components/ProjectRow.tsx src/components/*.test.tsx
git commit -m "feat: add StatStrip, ProjectCard, ProjectRow components"
```

---

### Task 8: About components — Timeline, SkillGroup, AchievementList (TDD)

**Files:**
- Create: `src/components/Timeline.tsx`, `src/components/SkillGroup.tsx`, `src/components/AchievementList.tsx`, `src/components/Timeline.test.tsx`
- Create: `src/data/about.ts` (typed about-page data: timeline, skills, achievements, bio)

**Interfaces:**
- `src/data/about.ts` produces: `bio: string[]`; `timeline: TimelineEntry[]` (`{ org, role, period, points: string[] }`); `skills: SkillGroupData[]` (`{ label, items: string[] }`); `achievements: string[]`.
- Components: `<Timeline entries />`, `<SkillGroup group />`, `<AchievementList items />`.

- [ ] **Step 1: Write `src/data/about.ts`** (copy authoritative from resume; see Task 15 for source)

```ts
export interface TimelineEntry { org: string; role: string; period: string; points: string[] }
export interface SkillGroupData { label: string; items: string[] }

export const bio: string[] = [
  'Vraj Desai is an engineer and builder. As Co-Founder & CTO of MetEngine, he led the backend end-to-end — high-throughput data pipelines and real-time analytics on Solana, and a zero-slot-latency automated copy-LPing experience that drove $4.3M+ in yield for 8.5K+ users and scaled total volume past $114M+. He also built x402/MPP data APIs (Polymarket, Hyperliquid, market making; 6,000+ txns) and a Chrome extension with 2,500+ peak downloads.',
  'Before MetEngine he worked in developer relations at the edge of the wallet and media ecosystems — at WalletConnect (WalletKit), partnering with Jupiter, Backpack, and MetaMask on Solana support and the WalletConnect Certified initiative; and at Huddle01, where he drove 200+ projects onto the SDKs and built FarHouse, a Farcaster audio-spaces client that reached 30K+ users. He got his start in open source as a Google Summer of Code ’22 contributor to the Oppia Foundation.',
  'He’s a serial hackathon winner (30+ wins, ETHGlobal Finalist, Colosseum Accelerator Cohort 3) and has spoken at 25+ conferences. Now he’s going deep on AI engineering — building in public and shipping demos here.',
]

export const timeline: TimelineEntry[] = [
  { org: 'MetEngine', role: 'Co-Founder & CTO', period: 'Feb 2025 – Jun 2026', points: [
    'Led the backend end-to-end: high-throughput data pipelines and real-time analytics on Solana.',
    'Built zero-slot-latency automated copy-LPing → $4.3M+ yield, 8.5K+ users, $114M+ volume.',
    'Built x402 + MPP data APIs for Polymarket, Hyperliquid, and market making (6,000+ txns).',
    'Shipped a Chrome extension (2,500+ peak downloads) with richer analytics.',
  ] },
  { org: 'WalletConnect', role: 'DevRel Engineer (WalletKit)', period: 'Nov 2024 – May 2025', points: [
    'Worked with Jupiter, Backpack, and MetaMask on WalletConnect integration with Solana support.',
    'Wrote docs, guides, and sample apps; helped onboard wallets to the WalletConnect Certified initiative.',
  ] },
  { org: 'Huddle01', role: 'DevRel Engineer', period: 'Apr 2023 – Aug 2024', points: [
    'Docs, blogs, sample apps, and SDK contributions → 200+ projects built on Huddle01.',
    'Built FarHouse (30K+ MAUs); grew the Discord community from 2K to 13K+.',
  ] },
  { org: 'Google Summer of Code ’22', role: 'Open-Source Contributor, Oppia Foundation', period: '2022', points: [
    'Merged 30+ PRs improving accessibility in the Oppia Android app.',
  ] },
]

export const skills: SkillGroupData[] = [
  { label: 'Languages', items: ['TypeScript', 'JavaScript', 'Solidity', 'Python', 'Rust (familiar)'] },
  { label: 'Backend', items: ['Node.js', 'PostgreSQL', 'Supabase', 'Firebase', 'Redis', 'AWS', 'Clickhouse'] },
  { label: 'Web3', items: ['Solana', 'EVM', 'Ethers.js', 'Web3.js', 'solanakit', 'Wagmi/Viem', 'Dune'] },
  { label: 'DevRel & Solutions', items: ['Technical docs', 'SDK integration', 'Sample apps & demos', 'Community & speaking'] },
]

export const achievements: string[] = [
  '2nd prize, DeFi track, Colosseum Breakout Hackathon; selected for Colosseum Accelerator Cohort 3 (YC for Solana).',
  'ETHGlobal Finalist; winner of 30+ hackathons; builder grants from Base and Superteam.',
  'Speaker at 25+ conferences; mentor at ETHIndia and HackFS.',
]
```

- [ ] **Step 2: Write failing test for Timeline**

```tsx
// src/components/Timeline.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Timeline from './Timeline'

describe('Timeline', () => {
  it('renders org, role, period and bullet points', () => {
    render(<Timeline entries={[{ org: 'MetEngine', role: 'CTO', period: 'Feb 2025 – Jun 2026', points: ['Led backend'] }]} />)
    expect(screen.getByText('MetEngine')).toBeInTheDocument()
    expect(screen.getByText('Feb 2025 – Jun 2026')).toBeInTheDocument()
    expect(screen.getByText('Led backend')).toBeInTheDocument()
  })
})
```

- [ ] **Step 3: Run to verify it fails**

Run: `pnpm exec vitest run src/components/Timeline.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 4: Write the three components**

```tsx
// src/components/Timeline.tsx
import type { TimelineEntry } from '../data/about'
export default function Timeline({ entries }: { entries: TimelineEntry[] }) {
  return (
    <ol className="space-y-8">
      {entries.map((e) => (
        <li key={e.org} className="grid sm:grid-cols-[1fr_2fr] gap-1 sm:gap-6">
          <div className="font-mono text-xs uppercase tracking-wider text-muted">{e.period}</div>
          <div>
            <h3 className="font-mono"><span className="text-fg">{e.org}</span> <span className="text-muted">· {e.role}</span></h3>
            <ul className="mt-2 space-y-1 text-sm text-muted list-disc pl-4">
              {e.points.map((p) => <li key={p}>{p}</li>)}
            </ul>
          </div>
        </li>
      ))}
    </ol>
  )
}
```

```tsx
// src/components/SkillGroup.tsx
import type { SkillGroupData } from '../data/about'
export default function SkillGroup({ group }: { group: SkillGroupData }) {
  return (
    <div className="grid sm:grid-cols-[1fr_2fr] gap-1 sm:gap-6 py-3 border-b border-border">
      <div className="font-mono text-xs uppercase tracking-wider text-muted">{group.label}</div>
      <div className="flex flex-wrap gap-2">
        {group.items.map((i) => <span key={i} className="font-mono text-xs text-fg">{i}</span>)}
      </div>
    </div>
  )
}
```

```tsx
// src/components/AchievementList.tsx
export default function AchievementList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 text-sm text-muted list-disc pl-4">
      {items.map((i) => <li key={i}>{i}</li>)}
    </ul>
  )
}
```

- [ ] **Step 5: Run, verify pass, commit**

```bash
pnpm exec vitest run src/components/Timeline.test.tsx   # Expected: PASS
git add src/data/about.ts src/components/Timeline.tsx src/components/SkillGroup.tsx src/components/AchievementList.tsx src/components/Timeline.test.tsx
git commit -m "feat: add About data + Timeline, SkillGroup, AchievementList components"
```

---

### Task 9: Routes wiring + Home + NotFound

**Files:**
- Modify: `src/App.tsx`
- Create: `src/pages/NotFound.tsx`
- Rewrite: `src/pages/Home.tsx`
- Create: `src/pages/Home.test.tsx`

**Interfaces:**
- Consumes: `site`, `featuredProjects` (Task 3), `StatStrip`, `ProjectCard` (Task 7), `Seo` (Task 6), `personJsonLd` (Task 4).
- Produces: full `routes` table (all routes referencing pages built in later tasks). Each page module exports `Component`.

- [ ] **Step 1: Wire all routes in `src/App.tsx`**

```tsx
// src/App.tsx
import type { RouteRecord } from 'vite-react-ssg'
import Layout from './components/Layout'
import { projectStaticPaths, postStaticPaths } from './lib/content'

export const routes: RouteRecord[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, lazy: () => import('./pages/Home') },
      { path: 'about', lazy: () => import('./pages/About') },
      { path: 'projects', lazy: () => import('./pages/Projects') },
      { path: 'projects/:slug', lazy: () => import('./pages/ProjectDetail'), getStaticPaths: projectStaticPaths },
      { path: 'writing', lazy: () => import('./pages/Writing') },
      { path: 'writing/:slug', lazy: () => import('./pages/PostDetail'), getStaticPaths: postStaticPaths },
      { path: 'resume', lazy: () => import('./pages/Resume') },
      { path: '*', lazy: () => import('./pages/NotFound') },
    ],
  },
]
```

> NOTE: This references pages created in Tasks 10–13. Create stub `Component` exports for any not-yet-built page if you run `dev` before those tasks (e.g. `export function Component() { return null }`), or implement Tasks 9–13 before the next `pnpm run build`.

- [ ] **Step 2: Write `NotFound.tsx`**

```tsx
// src/pages/NotFound.tsx
import { Link } from 'react-router-dom'
import Container from '../components/Container'
import Seo from '../components/Seo'

export function Component() {
  return (
    <Container>
      <Seo title="404 — Not found · Vraj Desai" description="Page not found." path="/404" />
      <div className="py-24 text-center">
        <p className="font-mono text-5xl">404</p>
        <p className="text-muted mt-3">That page doesn’t exist.</p>
        <Link to="/" className="font-mono text-sm text-accent hover:underline mt-6 inline-block">← Home</Link>
      </div>
    </Container>
  )
}
```

- [ ] **Step 3: Write failing test for Home**

```tsx
// src/pages/Home.test.tsx
import { describe, it, expect } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import { Component as Home } from './Home'

describe('Home', () => {
  it('renders name, tagline, stat strip, and currently line', () => {
    render(<MemoryRouter><Home /></MemoryRouter>)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Vraj Desai')
    expect(screen.getByText(/\$114M\+/)).toBeInTheDocument()
    expect(screen.getByText(/building in public/i)).toBeInTheDocument()
  })
})
```

- [ ] **Step 4: Run to verify it fails**

Run: `pnpm exec vitest run src/pages/Home.test.tsx`
Expected: FAIL — current Home has no tagline/stats.

- [ ] **Step 5: Rewrite `src/pages/Home.tsx`**

```tsx
// src/pages/Home.tsx
import { Link } from 'react-router-dom'
import { site } from '../config/site'
import { featuredProjects } from '../lib/content'
import { personJsonLd } from '../lib/seo'
import Container from '../components/Container'
import Section from '../components/Section'
import Seo from '../components/Seo'
import StatStrip from '../components/StatStrip'
import ProjectCard from '../components/ProjectCard'

export function Component() {
  return (
    <Container wide>
      <Seo title={`${site.name} — ${site.role}`} description={site.tagline} path="/" jsonLd={personJsonLd()} />
      <section className="py-16">
        <h1 className="font-mono text-4xl sm:text-5xl tracking-tight">{site.name}</h1>
        <p className="text-lg text-muted mt-4 max-w-2xl">{site.tagline}</p>
        <div className="flex flex-wrap gap-3 mt-8">
          <Link to="/projects" className="font-mono text-sm border border-border px-4 py-2 hover:border-accent hover:text-accent">View Projects</Link>
          <Link to="/resume" className="font-mono text-sm border border-border px-4 py-2 hover:border-accent hover:text-accent">Resume</Link>
          <a href="https://github.com/vrajdesai78" target="_blank" rel="noopener noreferrer" className="font-mono text-sm border border-border px-4 py-2 hover:border-accent hover:text-accent">GitHub ↗</a>
        </div>
        <div className="mt-10"><StatStrip stats={site.stats} /></div>
      </section>

      <Section title="Featured">
        <div className="grid sm:grid-cols-2 gap-4">
          {featuredProjects.map((p) => <ProjectCard key={p.slug} project={p} />)}
          <article className="border border-dashed border-border p-5 flex flex-col justify-center">
            <h3 className="font-mono text-lg">AI — building in public</h3>
            <p className="text-sm text-muted mt-1">7-day-sprint AI demos are shipping here soon.</p>
            <Link to="/projects" className="font-mono text-xs uppercase tracking-wider text-accent mt-4 hover:underline">See all projects →</Link>
          </article>
        </div>
      </Section>

      <Section title="Currently">
        <p className="text-muted">{site.currently}</p>
      </Section>
    </Container>
  )
}
```

- [ ] **Step 6: Run, verify pass, commit**

```bash
pnpm exec vitest run src/pages/Home.test.tsx    # Expected: PASS
pnpm run typecheck                          # NOTE: will fail until Tasks 10–13 pages exist; if so, add temporary stubs as in Step 1 NOTE, then re-run
git add src/App.tsx src/pages/Home.tsx src/pages/NotFound.tsx src/pages/Home.test.tsx
git commit -m "feat: wire routes; build Home (hero, stats, featured, currently) + 404"
```

---

### Task 10: About page

**Files:**
- Create: `src/pages/About.tsx`, `src/pages/About.test.tsx`

**Interfaces:**
- Consumes: `bio`, `timeline`, `skills`, `achievements` (Task 8), `Timeline`/`SkillGroup`/`AchievementList`, `Seo`, `Section`, `Container`.

- [ ] **Step 1: Write failing test**

```tsx
// src/pages/About.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Component as About } from './About'

describe('About', () => {
  it('renders bio, experience, skills, achievements sections', () => {
    render(<About />)
    expect(screen.getByText(/Experience/i)).toBeInTheDocument()
    expect(screen.getByText('MetEngine')).toBeInTheDocument()
    expect(screen.getByText(/TypeScript/)).toBeInTheDocument()
    expect(screen.getByText(/ETHGlobal Finalist/)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm exec vitest run src/pages/About.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Write `src/pages/About.tsx`**

```tsx
// src/pages/About.tsx
import { site } from '../config/site'
import { bio, timeline, skills, achievements } from '../data/about'
import Container from '../components/Container'
import Section from '../components/Section'
import Seo from '../components/Seo'
import Timeline from '../components/Timeline'
import SkillGroup from '../components/SkillGroup'
import AchievementList from '../components/AchievementList'

export function Component() {
  return (
    <Container>
      <Seo title={`About — ${site.name}`} description="Founder, DevRel, backend/data engineer — now building in AI." path="/about" />
      <Section title="About">
        {/* TODO(owner): drop a headshot into public/ and add an <img> here (hero/about photo slot). */}
        <div className="space-y-4 text-[15px] leading-relaxed">
          {bio.map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </Section>
      <Section title="Experience"><Timeline entries={timeline} /></Section>
      <Section title="Skills">
        <div>{skills.map((g) => <SkillGroup key={g.label} group={g} />)}</div>
      </Section>
      <Section title="Achievements"><AchievementList items={achievements} /></Section>
    </Container>
  )
}
```

- [ ] **Step 4: Run, verify pass, commit**

```bash
pnpm exec vitest run src/pages/About.test.tsx    # Expected: PASS
git add src/pages/About.tsx src/pages/About.test.tsx
git commit -m "feat: build About page (bio, timeline, skills, achievements)"
```

---

### Task 11: Projects index + ProjectDetail + MDXComponents

**Files:**
- Create: `src/components/MDXComponents.tsx`, `src/pages/Projects.tsx`, `src/pages/ProjectDetail.tsx`, `src/pages/Projects.test.tsx`

**Interfaces:**
- Consumes: `projects`, `getProjectBySlug`, `projectStaticPaths` (Task 3), `ProjectCard` (Task 7), `Seo`.
- Produces: `mdxComponents` (styled element map for MDX bodies); `Projects` index; `ProjectDetail` exporting `Component` + `getStaticPaths`.

- [ ] **Step 1: Write `MDXComponents.tsx`**

```tsx
// src/components/MDXComponents.tsx
import type { ComponentProps } from 'react'

export const mdxComponents = {
  h2: (p: ComponentProps<'h2'>) => <h2 className="font-mono text-lg mt-8 mb-2" {...p} />,
  h3: (p: ComponentProps<'h3'>) => <h3 className="font-mono mt-6 mb-2" {...p} />,
  p: (p: ComponentProps<'p'>) => <p className="text-[15px] leading-relaxed text-muted my-3" {...p} />,
  ul: (p: ComponentProps<'ul'>) => <ul className="list-disc pl-5 my-3 text-muted space-y-1" {...p} />,
  a: (p: ComponentProps<'a'>) => <a className="text-accent hover:underline" target="_blank" rel="noopener noreferrer" {...p} />,
  code: (p: ComponentProps<'code'>) => <code className="font-mono text-sm bg-surface px-1 py-0.5 border border-border" {...p} />,
}
```

- [ ] **Step 2: Write failing test for Projects index**

```tsx
// src/pages/Projects.test.tsx
import { describe, it, expect } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import { Component as Projects } from './Projects'

describe('Projects index', () => {
  it('renders a Projects heading and the AI building-in-public block', () => {
    render(<MemoryRouter><Projects /></MemoryRouter>)
    expect(screen.getByRole('heading', { name: /projects/i })).toBeInTheDocument()
    expect(screen.getByText(/building in public/i)).toBeInTheDocument()
  })
})
```

- [ ] **Step 3: Run to verify it fails**

Run: `pnpm exec vitest run src/pages/Projects.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 4: Write `Projects.tsx` and `ProjectDetail.tsx`**

```tsx
// src/pages/Projects.tsx
import { site } from '../config/site'
import { projects } from '../lib/content'
import Container from '../components/Container'
import Section from '../components/Section'
import Seo from '../components/Seo'
import ProjectCard from '../components/ProjectCard'

export function Component() {
  return (
    <Container wide>
      <Seo title={`Projects — ${site.name}`} description="Shipped products across Solana, Farcaster/Base, and AI." path="/projects" />
      <Section title="Projects">
        <div className="grid sm:grid-cols-2 gap-4">
          {projects.map((p) => <ProjectCard key={p.slug} project={p} />)}
          <article className="border border-dashed border-border p-5 flex flex-col justify-center">
            <h3 className="font-mono text-lg">AI — building in public</h3>
            <p className="text-sm text-muted mt-1">7-day-sprint AI demos land here as they ship. Each will link to a write-up with stack, learnings, and eval results.</p>
          </article>
        </div>
      </Section>
    </Container>
  )
}
```

```tsx
// src/pages/ProjectDetail.tsx
import { useParams, Link } from 'react-router-dom'
import { getProjectBySlug, projectStaticPaths } from '../lib/content'
import { mdxComponents } from '../components/MDXComponents'
import Container from '../components/Container'
import Seo from '../components/Seo'

export function Component() {
  const { slug } = useParams()
  const project = slug ? getProjectBySlug(slug) : undefined
  if (!project) return (
    <Container><div className="py-24"><p className="font-mono">Project not found.</p>
      <Link to="/projects" className="text-accent">← Projects</Link></div></Container>
  )
  const { frontmatter: f, Component: Body } = project
  return (
    <Container>
      <Seo title={`${f.title} — ${f.oneliner}`} description={f.oneliner} path={`/projects/${project.slug}`} ogType="article" />
      <article className="py-12">
        <Link to="/projects" className="font-mono text-xs uppercase tracking-wider text-muted hover:text-accent">← Projects</Link>
        <h1 className="font-mono text-3xl mt-4">{f.title}</h1>
        <p className="text-muted mt-2">{f.oneliner}</p>
        {f.metrics && (
          <ul className="flex flex-wrap gap-x-6 gap-y-1 mt-4">
            {f.metrics.map((m) => <li key={m.label} className="font-mono text-sm"><span>{m.value}</span> <span className="text-muted text-xs uppercase">{m.label}</span></li>)}
          </ul>
        )}
        <div className="flex flex-wrap gap-2 mt-4">
          {f.tags.map((t) => <span key={t} className="font-mono text-[11px] uppercase tracking-wider text-muted border border-border px-2 py-0.5">{t}</span>)}
        </div>
        {f.links && Object.keys(f.links).length > 0 && (
          <div className="flex gap-4 mt-4">
            {(Object.entries(f.links) as [string, string][]).map(([k, href]) => (
              <a key={k} href={href} target="_blank" rel="noopener noreferrer" className="font-mono text-xs uppercase tracking-wider text-accent hover:underline">{k} ↗</a>
            ))}
          </div>
        )}
        <div className="mt-8"><Body components={mdxComponents} /></div>
      </article>
    </Container>
  )
}

export const getStaticPaths = projectStaticPaths
```

- [ ] **Step 5: Run, verify pass, commit**

```bash
pnpm exec vitest run src/pages/Projects.test.tsx    # Expected: PASS
git add src/components/MDXComponents.tsx src/pages/Projects.tsx src/pages/ProjectDetail.tsx src/pages/Projects.test.tsx
git commit -m "feat: build Projects index + ProjectDetail (MDX render, getStaticPaths)"
```

---

### Task 12: Writing index + PostDetail

**Files:**
- Create: `src/pages/Writing.tsx`, `src/pages/PostDetail.tsx`, `src/pages/Writing.test.tsx`

**Interfaces:**
- Consumes: `posts`, `getPostBySlug`, `postStaticPaths` (Task 3), `mdxComponents` (Task 11), `Seo`.

- [ ] **Step 1: Write failing test**

```tsx
// src/pages/Writing.test.tsx
import { describe, it, expect } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import { Component as Writing } from './Writing'

describe('Writing index', () => {
  it('renders a Writing heading', () => {
    render(<MemoryRouter><Writing /></MemoryRouter>)
    expect(screen.getByRole('heading', { name: /writing/i })).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm exec vitest run src/pages/Writing.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Write `Writing.tsx` and `PostDetail.tsx`**

```tsx
// src/pages/Writing.tsx
import { Link } from 'react-router-dom'
import { site } from '../config/site'
import { posts } from '../lib/content'
import Container from '../components/Container'
import Section from '../components/Section'
import Seo from '../components/Seo'

export function Component() {
  return (
    <Container>
      <Seo title={`Writing — ${site.name}`} description="Notes on building in public, crypto, and AI." path="/writing" />
      <Section title="Writing">
        {posts.length === 0 ? (
          <p className="text-muted">First posts coming soon.</p>
        ) : (
          <ul className="divide-y divide-border">
            {posts.map((p) => (
              <li key={p.slug} className="py-4">
                <Link to={`/writing/${p.slug}`} className="font-mono hover:text-accent">{p.frontmatter.title}</Link>
                <p className="text-sm text-muted mt-1">{p.frontmatter.summary}</p>
                <time className="font-mono text-xs text-muted">{p.frontmatter.date}</time>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </Container>
  )
}
```

```tsx
// src/pages/PostDetail.tsx
import { useParams, Link } from 'react-router-dom'
import { getPostBySlug, postStaticPaths } from '../lib/content'
import { mdxComponents } from '../components/MDXComponents'
import Container from '../components/Container'
import Seo from '../components/Seo'

export function Component() {
  const { slug } = useParams()
  const post = slug ? getPostBySlug(slug) : undefined
  if (!post) return (
    <Container><div className="py-24"><p className="font-mono">Post not found.</p>
      <Link to="/writing" className="text-accent">← Writing</Link></div></Container>
  )
  const { frontmatter: f, Component: Body } = post
  return (
    <Container>
      <Seo title={`${f.title} — ${site.name}`} description={f.summary} path={`/writing/${post.slug}`} ogType="article" />
      <article className="py-12">
        <Link to="/writing" className="font-mono text-xs uppercase tracking-wider text-muted hover:text-accent">← Writing</Link>
        <h1 className="font-mono text-3xl mt-4">{f.title}</h1>
        <time className="font-mono text-xs text-muted">{f.date}</time>
        <div className="mt-8"><Body components={mdxComponents} /></div>
      </article>
    </Container>
  )
}

export const getStaticPaths = postStaticPaths
```

> NOTE: `PostDetail.tsx` references `site` in `Seo` title — add `import { site } from '../config/site'` at the top.

- [ ] **Step 4: Run, verify pass, commit**

```bash
pnpm exec vitest run src/pages/Writing.test.tsx    # Expected: PASS
pnpm run typecheck                             # Expected: no errors
git add src/pages/Writing.tsx src/pages/PostDetail.tsx src/pages/Writing.test.tsx
git commit -m "feat: build Writing index + PostDetail (getStaticPaths)"
```

---

### Task 13: Resume page

**Files:**
- Create: `src/pages/Resume.tsx`, `src/pages/Resume.test.tsx`

**Interfaces:**
- Consumes: `site.resumePath`, `Seo`, `Container`.

- [ ] **Step 1: Write failing test**

```tsx
// src/pages/Resume.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Component as Resume } from './Resume'

describe('Resume', () => {
  it('renders a download link to the PDF', () => {
    render(<Resume />)
    const dl = screen.getByRole('link', { name: /download/i })
    expect(dl).toHaveAttribute('href', '/vraj-desai-resume.pdf')
  })
})
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm exec vitest run src/pages/Resume.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Write `src/pages/Resume.tsx`**

```tsx
// src/pages/Resume.tsx
import { site } from '../config/site'
import Container from '../components/Container'
import Section from '../components/Section'
import Seo from '../components/Seo'

export function Component() {
  return (
    <Container wide>
      <Seo title={`Resume — ${site.name}`} description="Vraj Desai — resume / CV." path="/resume" />
      <Section title="Resume">
        <a href={site.resumePath} download className="font-mono text-sm border border-border px-4 py-2 inline-block hover:border-accent hover:text-accent">Download PDF ↓</a>
        <div className="mt-6 border border-border">
          <object data={site.resumePath} type="application/pdf" className="w-full h-[80vh]" aria-label="Resume PDF">
            <p className="p-4 text-muted">Your browser can’t display PDFs. <a className="text-accent" href={site.resumePath}>Download the resume</a>.</p>
          </object>
        </div>
      </Section>
    </Container>
  )
}
```

- [ ] **Step 4: Run, verify pass, commit**

```bash
pnpm exec vitest run src/pages/Resume.test.tsx    # Expected: PASS
git add src/pages/Resume.tsx src/pages/Resume.test.tsx
git commit -m "feat: build Resume page (embedded PDF + download)"
```

---

### Task 14: MDX content files

**Files:**
- Create: `src/content/projects/metengine.mdx`, `farview.mdx`, `stackit.mdx`, `farhouse.mdx`
- Create: `src/content/writing/crypto-to-ai.mdx`

**Interfaces:**
- Consumes: frontmatter schema from Task 3. No code; data only.

- [ ] **Step 1: Write the four project MDX files** (frontmatter authoritative from resume; MetEngine & Stackit have NO `links`)

````mdx
---
title: "MetEngine"
oneliner: "Solana liquidity & yield platform."
tags: ["Solana", "DeFi", "Backend", "Data"]
role: "Co-Founder & CTO"
period: "Feb 2025 – Jun 2026"
metrics:
  - { label: "volume", value: "$114M+" }
  - { label: "users", value: "8.5K+" }
  - { label: "yield", value: "$4.3M+" }
featured: true
order: 1
---

As Co-Founder & CTO, I led the backend end-to-end: high-throughput data-processing
pipelines and real-time analytics on Solana.

## What I built

- A zero-slot-latency automated copy-LPing experience that drove **$4.3M+ in yield**
  for **8.5K+ users** and scaled total volume past **$114M+**.
- **x402** and **MPP**-based data APIs for Polymarket, Hyperliquid, and market making,
  serving **6,000+ transactions** on Solana.
- A Chrome extension (**2,500+ peak downloads**) delivering richer analytics for
  Polymarket, Hyperliquid, and Solana market making.
````

````mdx
---
title: "Stackit"
oneliner: "Theme-based investable baskets of tokens."
tags: ["Solana", "DeFi", "Hackathon"]
order: 2
---

A portfolio tool to invest in curated token baskets, with fund analytics and a referral
program — built during **Solana Startup Village**.

- Won **2nd prize** at Solana Hacker House and received a **Superteam grant**.
````

````mdx
---
title: "Farview.id"
oneliner: "Personalized profile pages for Farcaster & Base users."
tags: ["Farcaster", "Base", "Frames"]
metrics:
  - { label: "users", value: "6K+" }
  - { label: "frame interactions", value: "12K+" }
links:
  live: "https://farview.id"
featured: true
order: 3
---

Surfaced each user's Farcaster and on-chain activity in a personalized profile page.

- **6K+ users** and **12K+ Frame interactions**.
- Won the **Social track** at Base On-chain Summer Buildathon and received a
  **Base builder grant**.
````

````mdx
---
title: "FarHouse"
oneliner: "Farcaster audio-spaces client with in-app tipping."
tags: ["Farcaster", "Audio", "Social"]
metrics:
  - { label: "MAUs", value: "30K+" }
links:
  live: "https://farhouse.club"
order: 4
---

An audio-spaces client on Farcaster with in-app tipping, built during my time at Huddle01.

- Reached **30K+ monthly active users**.
````

- [ ] **Step 2: Write the seed writing post (draft)**

````mdx
---
title: "Switching from crypto to AI — building in public"
date: "2026-06-23"
summary: "Why I'm pivoting from crypto engineering to AI, and what I'm shipping next."
tags: ["build-in-public", "AI"]
draft: true
---

Placeholder post. Drafting in public — full content coming soon.
````

- [ ] **Step 3: Verify content loads in a build, then commit**

```bash
pnpm run build:app
# Expected: dist/projects/metengine.html etc. exist (draft post NOT prerendered)
test -f dist/projects/metengine.html && echo "project pages prerendered"
test ! -d dist/writing/crypto-to-ai && echo "draft correctly excluded"
git add src/content
git commit -m "content: add project MDX (MetEngine, Stackit, Farview, FarHouse) + seed post"
```

---

### Task 15: Static assets, fonts & finalize head

**Files:**
- Create: `public/vraj-desai-resume.pdf`, `public/favicon.svg`, `public/apple-touch-icon.png`, `public/manifest.webmanifest`, `public/robots.txt`, `public/fonts/JetBrainsMono-Variable.woff2`, `scripts/og-fonts/Inter-Regular.ttf`, `scripts/og-fonts/JetBrainsMono-Regular.ttf`

**Interfaces:**
- Produces: served static assets the app + scripts reference (`site.resumePath`, font preload, OG fonts).

- [ ] **Step 1: Copy the resume PDF into public/**

```bash
cp ~/Downloads/vraj-resume-2026.pdf public/vraj-desai-resume.pdf
test -f public/vraj-desai-resume.pdf && echo "resume copied"
```

- [ ] **Step 2: Add fonts** (download static TTFs for satori + a subset/variable woff2 for the site)

```bash
mkdir -p public/fonts scripts/og-fonts
# JetBrains Mono (site webfont, variable woff2) and static TTFs for satori OG rendering.
# Source: https://github.com/JetBrains/JetBrainsMono/releases (OFL) and
#         https://github.com/rsms/inter/releases (OFL) for Inter-Regular.ttf
# Place: public/fonts/JetBrainsMono-Variable.woff2
#        scripts/og-fonts/JetBrainsMono-Regular.ttf
#        scripts/og-fonts/Inter-Regular.ttf
ls public/fonts/JetBrainsMono-Variable.woff2 scripts/og-fonts/*.ttf
```

Expected: all three font files listed. (If `curl` from the release URLs, verify non-zero size.)

- [ ] **Step 3: Write `favicon.svg`, `manifest.webmanifest`, `robots.txt`**

```xml
<!-- public/favicon.svg -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="6" fill="#0a0a0b"/>
  <text x="16" y="22" font-family="monospace" font-size="16" font-weight="700" fill="#16db95" text-anchor="middle">VD</text>
</svg>
```

```json
// public/manifest.webmanifest
{
  "name": "Vraj Desai",
  "short_name": "Vraj Desai",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0a0a0b",
  "theme_color": "#0a0a0b",
  "icons": [{ "src": "/apple-touch-icon.png", "sizes": "180x180", "type": "image/png" }]
}
```

```
# public/robots.txt
User-agent: *
Allow: /
Sitemap: https://vrajdesai.dev/sitemap.xml
```

For `apple-touch-icon.png` (180×180), generate from the favicon (e.g. `rsvg-convert -w 180 -h 180 public/favicon.svg -o public/apple-touch-icon.png`, or any SVG→PNG tool). Verify it exists and is 180×180.

- [ ] **Step 4: Verify build picks up assets, commit**

```bash
pnpm run build:app
test -f dist/vraj-desai-resume.pdf && test -f dist/fonts/JetBrainsMono-Variable.woff2 && echo "assets in dist"
git add public scripts/og-fonts
git commit -m "chore: add resume PDF, fonts, favicon, manifest, robots"
```

---

### Task 16: OG image generation script

**Files:**
- Create: `scripts/content-fs.ts`, `scripts/generate-og.tsx`

**Interfaces:**
- `content-fs.ts` (node, uses `gray-matter` + `node:fs`): `listRoutes(): RouteMeta[]` where `RouteMeta = { path: string; eyebrow: string; title: string; subtitle?: string; metric?: string }` — static routes + non-draft project/post routes.
- `generate-og.tsx`: reads `listRoutes()`, renders each via satori→resvg→`dist/og/<name>.png` using `ogImagePath` for the filename.

- [ ] **Step 1: Write `scripts/content-fs.ts`**

```ts
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import matter from 'gray-matter'
import { site } from '../src/config/site'

export interface RouteMeta { path: string; eyebrow: string; title: string; subtitle?: string; metric?: string }

const readDir = (dir: string) =>
  existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith('.mdx')) : []

function projectRoutes(): RouteMeta[] {
  const dir = join('src', 'content', 'projects')
  return readDir(dir).flatMap((file) => {
    const { data } = matter(readFileSync(join(dir, file), 'utf8'))
    if (data.draft) return []
    const slug = (data.slug as string) ?? file.replace(/\.mdx$/, '')
    const metric = Array.isArray(data.metrics) && data.metrics[0] ? `${data.metrics[0].value} ${data.metrics[0].label}` : undefined
    return [{ path: `/projects/${slug}`, eyebrow: 'PROJECT', title: data.title as string, subtitle: data.oneliner as string, metric }]
  })
}

function postRoutes(): RouteMeta[] {
  const dir = join('src', 'content', 'writing')
  return readDir(dir).flatMap((file) => {
    const { data } = matter(readFileSync(join(dir, file), 'utf8'))
    if (data.draft) return []
    const slug = (data.slug as string) ?? file.replace(/\.mdx$/, '')
    return [{ path: `/writing/${slug}`, eyebrow: 'WRITING', title: data.title as string, subtitle: data.summary as string }]
  })
}

export function listRoutes(): RouteMeta[] {
  return [
    { path: '/', eyebrow: site.role.toUpperCase(), title: site.name, subtitle: 'Solana DeFi → AI', metric: '$114M+ volume · 8.5K+ users' },
    { path: '/about', eyebrow: 'ABOUT', title: site.name, subtitle: site.role },
    { path: '/projects', eyebrow: 'PROJECTS', title: 'Projects', subtitle: 'Solana · Farcaster/Base · AI' },
    { path: '/writing', eyebrow: 'WRITING', title: 'Writing', subtitle: 'Building in public' },
    { path: '/resume', eyebrow: 'RESUME', title: site.name, subtitle: site.role },
    ...projectRoutes(),
    ...postRoutes(),
  ]
}
```

- [ ] **Step 2: Write `scripts/generate-og.tsx`** (object-form satori element; static TTFs; write to `dist/og`)

```tsx
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import satori from 'satori'
import { Resvg } from '@resvg/resvg-js'
import { listRoutes } from './content-fs'
import { ogImagePath } from '../src/lib/og'

const mono = readFileSync(join('scripts', 'og-fonts', 'JetBrainsMono-Regular.ttf'))
const sans = readFileSync(join('scripts', 'og-fonts', 'Inter-Regular.ttf'))

const card = (r: { eyebrow: string; title: string; subtitle?: string; metric?: string }) => ({
  type: 'div',
  props: {
    style: { width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      padding: '64px', backgroundColor: '#0a0a0b', color: '#f5f6f7', fontFamily: 'Inter' },
    children: [
      { type: 'div', props: { style: { fontFamily: 'JetBrains Mono', fontSize: 24, letterSpacing: 4, color: '#16db95' }, children: r.eyebrow } },
      { type: 'div', props: { style: { display: 'flex', flexDirection: 'column' }, children: [
        { type: 'div', props: { style: { fontSize: 76, fontWeight: 700 }, children: r.title } },
        ...(r.subtitle ? [{ type: 'div', props: { style: { fontSize: 32, color: '#9aa0ac', marginTop: 8 }, children: r.subtitle } }] : []),
      ] } },
      { type: 'div', props: { style: { fontFamily: 'JetBrains Mono', fontSize: 28, color: '#9aa0ac', display: 'flex', justifyContent: 'space-between' },
        children: [ { type: 'div', props: { children: 'vrajdesai.dev' } }, { type: 'div', props: { children: r.metric ?? '' } } ] } },
    ],
  },
})

const run = async () => {
  mkdirSync(join('dist', 'og'), { recursive: true })
  for (const r of listRoutes()) {
    const svg = await satori(card(r), { width: 1200, height: 630, fonts: [
      { name: 'Inter', data: sans, weight: 400, style: 'normal' },
      { name: 'JetBrains Mono', data: mono, weight: 400, style: 'normal' },
    ] })
    const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng()
    const file = join('dist', ogImagePath(r.path)) // ogImagePath returns '/og/...png'
    writeFileSync(file, png)
    console.log('OG:', file)
  }
}
run().catch((e) => { console.error(e); process.exit(1) })
```

- [ ] **Step 3: Run it against a prior app build, verify a PNG exists**

```bash
pnpm run build:app && pnpm exec tsx scripts/generate-og.tsx
test -f dist/og/home.png && test -f dist/og/projects-metengine.png && echo "OG generated"
```

Expected: `OG: dist/og/home.png` … logs; `OG generated` prints.

- [ ] **Step 4: Commit**

```bash
git add scripts/content-fs.ts scripts/generate-og.tsx
git commit -m "feat: generate per-route OG images with satori + resvg"
```

---

### Task 17: Sitemap script (TDD)

**Files:**
- Create: `scripts/sitemap.ts` (pure builder), `scripts/sitemap.test.ts`, `scripts/generate-sitemap.ts` (fs writer)

**Interfaces:**
- `sitemap.ts`: `buildSitemap(paths: string[], baseUrl: string): string` (pure → XML).
- `generate-sitemap.ts`: uses `listRoutes()` + `buildSitemap` → writes `dist/sitemap.xml`.

- [ ] **Step 1: Write failing test**

```ts
// scripts/sitemap.test.ts
import { describe, it, expect } from 'vitest'
import { buildSitemap } from './sitemap'

describe('buildSitemap', () => {
  it('emits one <loc> per absolute url', () => {
    const xml = buildSitemap(['/', '/about'], 'https://vrajdesai.dev')
    expect(xml).toContain('<loc>https://vrajdesai.dev/</loc>')
    expect(xml).toContain('<loc>https://vrajdesai.dev/about</loc>')
    expect(xml.trim().startsWith('<?xml')).toBe(true)
  })
})
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm exec vitest run scripts/sitemap.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Write `scripts/sitemap.ts` and `scripts/generate-sitemap.ts`**

```ts
// scripts/sitemap.ts
export function buildSitemap(paths: string[], baseUrl: string): string {
  const urls = paths
    .map((p) => `  <url><loc>${baseUrl}${p === '/' ? '/' : p}</loc></url>`)
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
}
```

```ts
// scripts/generate-sitemap.ts
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { buildSitemap } from './sitemap'
import { listRoutes } from './content-fs'
import { site } from '../src/config/site'

const xml = buildSitemap(listRoutes().map((r) => r.path), site.baseUrl)
writeFileSync(join('dist', 'sitemap.xml'), xml)
console.log('sitemap.xml written')
```

- [ ] **Step 4: Run, verify pass, commit**

```bash
pnpm exec vitest run scripts/sitemap.test.ts    # Expected: PASS
git add scripts/sitemap.ts scripts/sitemap.test.ts scripts/generate-sitemap.ts
git commit -m "feat: generate sitemap.xml at build"
```

---

### Task 18: Build pipeline + check-build + full build

**Files:**
- Create: `scripts/check-build.ts`

**Interfaces:**
- `check-build.ts`: asserts key routes' `dist/**/index.html` contain `<title>`, `og:image`, and (home) `application/ld+json`. Exits non-zero on failure. Wired last in `pnpm run build` (already set in Task 1).

- [ ] **Step 1: Write `scripts/check-build.ts`**

```ts
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const checks: { file: string; must: string[] }[] = [
  { file: 'dist/index.html', must: ['<title>', 'og:image', 'application/ld+json'] },
  { file: 'dist/about.html', must: ['<title>', 'og:image'] },
  { file: 'dist/projects.html', must: ['<title>', 'og:image'] },
  { file: 'dist/projects/metengine.html', must: ['<title>', 'og:image', 'MetEngine'] },
  { file: 'dist/og/home.png', must: [] },
  { file: 'dist/sitemap.xml', must: ['<loc>'] },
]

let failed = false
for (const c of checks) {
  if (!existsSync(c.file)) { console.error('MISSING:', c.file); failed = true; continue }
  const html = c.must.length ? readFileSync(c.file, 'utf8') : ''
  for (const token of c.must) {
    if (!html.includes(token)) { console.error(`MISSING "${token}" in ${c.file}`); failed = true }
  }
}
if (failed) { console.error('check-build FAILED'); process.exit(1) }
console.log('check-build OK')
```

- [ ] **Step 2: Run the FULL build pipeline end-to-end**

Run: `pnpm run build`
Expected: `vite-react-ssg` prerenders → OG logs → `sitemap.xml written` → `check-build OK`. Non-zero exit if any assertion fails.

- [ ] **Step 3: Confirm no-JS content + meta in built HTML**

```bash
grep -q "Engineer & builder" dist/index.html && echo "hero content in static HTML (no JS needed)"
grep -q 'application/ld+json' dist/index.html && echo "JSON-LD present"
grep -q 'og:image' dist/projects/metengine.html && echo "per-page OG present"
```

Expected: all three confirmations print.

- [ ] **Step 4: Commit**

```bash
git add scripts/check-build.ts
git commit -m "feat: add post-build verification (meta/OG/JSON-LD assertions)"
```

---

### Task 19: README (architecture, add-a-project, AI demos, deploy)

**Files:**
- Create: `README.md`

**Interfaces:** documentation only. Must document the AI-demo subdomain/route pattern with the working placeholder (acceptance criterion).

- [ ] **Step 1: Write `README.md`**

````markdown
# vrajdesai.dev

Personal site + portfolio, statically generated with Vite + React.

## Stack
Vite · vite-react-ssg (static HTML per route) · React 18 + TS · Tailwind CSS v4 ·
MDX content · satori OG images · Vitest.

## Develop
```bash
pnpm install
pnpm run dev        # http://localhost:5173
pnpm test           # unit tests
pnpm run build      # SSG + OG images + sitemap + build checks → dist/
pnpm run preview    # serve dist/
```

## Add a project (no code changes)
Create `src/content/projects/<slug>.mdx`:
```mdx
---
title: "My Project"
oneliner: "One line about it."
tags: ["AI"]
metrics: [{ label: "users", value: "1K+" }]
links: { live: "https://..." }   # omit for none
featured: true                   # show on Home
order: 5
---
Write-up in MDX…
```
It auto-appears in the grid, gets its own static page, OG image, and sitemap entry.
Set `draft: true` to keep it out of production. Posts work the same in `src/content/writing/`.

## AI demos — hosting pattern
One brand, many demos:
- **Subdomain per standalone demo:** `https://<project>.vrajdesai.dev` (separate Vercel project).
- **Lightweight inline demos:** `/projects/<slug>/demo`, linked from the write-up.
- Each demo links back to its `/projects/<slug>` write-up (problem, stack, learnings, evals).
- **Secrets stay server-side** (env vars); never ship API keys in client bundles.
- **Working placeholder:** the "AI — building in public" block on Home and `/projects`
  reserves the pattern today; adding a real demo is the documented step above.

## Deploy (Vercel)
- Framework preset: **Other**; Build: `pnpm run build`; Output dir: `dist`.
- Add domain `vrajdesai.dev`. (Cloudflare Pages works identically: build `pnpm run build`, output `dist`.)
- Analytics via `@vercel/analytics` (production only).
````

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: add README (dev, add-a-project, AI-demo pattern, deploy)"
```

---

### Task 20: Final verification + analytics

**Files:**
- Modify: `src/components/Layout.tsx` (mount `@vercel/analytics` in production)

**Interfaces:** verification task; no new public interfaces.

- [ ] **Step 1: Mount analytics (production only)**

```tsx
// add to src/components/Layout.tsx imports
import { Analytics } from '@vercel/analytics/react'
// …and before </div> at the end of the returned tree:
{import.meta.env.PROD && <Analytics />}
```

- [ ] **Step 2: Full gate — tests, types, build**

```bash
pnpm test && pnpm run typecheck && pnpm run build
```
Expected: all tests pass, no type errors, `check-build OK`.

- [ ] **Step 3: Lighthouse on the built site** (use the run/verify skill or Chrome)

```bash
pnpm run preview &     # serves dist on a local port
```
Open `/`, `/about`, `/projects` and run Lighthouse (Chrome DevTools or `pnpm exec @lhci/cli autorun`).
Expected: **≥95** Performance, Accessibility, Best Practices, SEO. Fix regressions (contrast, image dims, meta) before done.

- [ ] **Step 4: Browser pass** (Claude-in-Chrome on the preview URL)
  - Theme: confirm system default + no flash; cycle System→Light→Dark persists across reload.
  - Responsive at 360 / 768 / 1280.
  - Footer has GitHub/X/LinkedIn/Email (NO Farcaster); externals open in new tab.
  - MetEngine & Stackit show NO link buttons; Farview/FarHouse show Live.

- [ ] **Step 5: "Add a project" proof**
```bash
printf -- '---\ntitle: "Proof"\noneliner: "temp"\ntags: ["AI"]\norder: 9\n---\nbody\n' > src/content/projects/_proof.mdx
pnpm run build && test -f dist/projects/_proof.html && test -f dist/og/projects-_proof.png && echo "ADD-A-PROJECT OK"
rm src/content/projects/_proof.mdx
```
Expected: `ADD-A-PROJECT OK`; then remove the temp file.

- [ ] **Step 6: Commit**
```bash
git add src/components/Layout.tsx
git commit -m "feat: add Vercel Analytics (prod) + final verification pass"
```

---

## Self-Review

**Spec coverage** (against `2026-06-23-vrajdesai-dev-design.md`):
- Stack/rendering (Vite+SSG, Tailwind v4, MDX, satori OG, analytics, Vercel) → Tasks 1, 16, 20. ✓
- Architecture/units (site.ts, content.ts, seo.ts, og.ts, theme.ts, components, scripts) → Tasks 2–8, 16–18. ✓
- All pages (Home/About/Projects/[slug]/Writing/[slug]/Resume/404) → Tasks 9–13. ✓
- Content verbatim from resume (timeline/skills/achievements/metrics) → Tasks 8, 14. ✓
- Aesthetic (mono+sans, hairline grid, stats-as-heroes, steal-list) → Global Constraints + Tasks 7–9 styling. ✓
- SEO/OG/JSON-LD/sitemap/robots/manifest/favicon → Tasks 6, 15, 16, 17, 18. ✓
- Theme system (system default + toggle + no-flash) → Tasks 1, 5. ✓
- Perf/a11y/no-JS + Lighthouse ≥95 → Tasks 1, 6, 18, 20. ✓
- AI-demo pattern + working placeholder → Tasks 9, 11, 19. ✓
- Link rules (no Farcaster; MetEngine/Stackit no links; email) → Tasks 2, 6, 7, 14 (+ tests). ✓
- "Add one MDX file" → Task 20 Step 5 proof. ✓

**Type consistency:** `Project`/`Post`/`ProjectFrontmatter` (Task 3) used identically in Tasks 7, 11, 12, 16. `Stat` (Task 2) ↔ StatStrip (Task 7). `getStaticPaths` returns `projects/<slug>` / `writing/<slug>` (no leading slash) consistently (Tasks 3, 9, 11, 12). `ogImagePath` shared by `seo.ts`, `generate-og.tsx`, naming matches `check-build` (Tasks 4, 16, 18). Pages export `Component` (+ `getStaticPaths` on detail pages) per vite-react-ssg lazy convention (Tasks 9–13).

**Placeholder scan:** No TBD/TODO left except the intentional owner photo slot (Task 10, flagged) — acceptable, not a logic gap. All code/test/content blocks are complete.

**Known risk flagged:** `vite-react-ssg` is pre-1.0 and `getStaticPaths` leading-slash behavior for top-level dynamic routes was not 100% confirmable; our routes are nested (`projects/:slug`), where the relative-full-path form is unambiguous. If the SSG build emits dynamic pages at the wrong path, adjust the `getStaticPaths` return prefix and re-run Task 18.
