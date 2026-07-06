# Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild vrajdesai.dev as a single-page, typography-first job-hunting portfolio mirroring the July 2026 resume, per the approved spec at `docs/superpowers/specs/2026-07-06-portfolio-redesign-design.md`.

**Architecture:** Rework in place. Keep Vite + vite-react-ssg + Tailwind v4 + vitest. Everything collapses into one scrolling Home page plus `/resume` and a 404. The MDX content pipeline is deleted; all copy becomes plain TypeScript data. New visual language: Inter Variable body, JetBrains Mono demoted to metadata, no boxed cards, one staggered ease-out entrance.

**Tech Stack:** React 18, vite-react-ssg, Tailwind CSS v4 (CSS-first config in `src/index.css`), vitest + testing-library, satori/resvg for OG images, Vercel hosting.

## Global Constraints

- Package manager is **pnpm only** (`pnpm test`, `pnpm typecheck`, `pnpm lint`, `pnpm build`). Never npm/yarn/bun.
- **Never add `Co-Authored-By` trailers to commits.** Plain commit messages only.
- Copy rules: first person, terse, no buzzwords. Bold (`**…**`) reserved for metrics and names. Section labels lowercase mono.
- Colors/typography come from the CSS vars in `src/index.css` (`--bg/--surface/--fg/--muted/--border/--accent`); use the mapped utilities (`text-fg`, `text-muted`, `bg-bg`, `border-border`, `text-accent`), never raw hex in components.
- `prefers-reduced-motion` rule in `src/index.css:36-38` must keep neutralizing all animation.
- Every task ends with `pnpm test` green and a commit.
- Resume PDF (`public/vraj-desai-resume.pdf`) is replaced by the user separately; nothing here blocks on it.

---

### Task 1: Inter font + design tokens + motion CSS

**Files:**
- Modify: `src/index.css`
- Modify: `index.html` (font preload)
- Create: `public/fonts/Inter-Variable.woff2` (copied from node_modules)
- Modify: `package.json` (add `@fontsource-variable/inter` devDependency)

**Interfaces:**
- Produces: CSS utility class `animate-enter` driven by `--stagger` custom property; `--font-sans` resolving to Inter. Later tasks apply `className="animate-enter"` and `style={{ '--stagger': n }}`.

- [ ] **Step 1: Install Inter and copy the variable font file**

```bash
pnpm add -D @fontsource-variable/inter
cp node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2 public/fonts/Inter-Variable.woff2
```

- [ ] **Step 2: Update `src/index.css`**

Add an Inter `@font-face` after the JetBrains Mono one, point `--font-sans` at Inter, and add the entrance keyframes. The file becomes:

```css
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

@font-face {
  font-family: "JetBrains Mono";
  src: url("/fonts/JetBrainsMono-Variable.woff2") format("woff2");
  font-weight: 100 800;
  font-display: swap;
}

@font-face {
  font-family: "Inter";
  src: url("/fonts/Inter-Variable.woff2") format("woff2-variations");
  font-weight: 100 900;
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
  --font-sans: "Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
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

@keyframes enter {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-enter {
  animation: enter 350ms ease-out both;
  animation-delay: calc(var(--stagger, 0) * 50ms);
}

@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
```

- [ ] **Step 3: Preload Inter in `index.html`**

After the existing JetBrains Mono preload line (`index.html:7`), add:

```html
    <link rel="preload" href="/fonts/Inter-Variable.woff2" as="font" type="font/woff2" crossorigin />
```

- [ ] **Step 4: Verify build and tests**

Run: `pnpm test && pnpm build:app`
Expected: all existing tests pass; build succeeds with no CSS errors.

- [ ] **Step 5: Commit**

```bash
git add package.json pnpm-lock.yaml public/fonts/Inter-Variable.woff2 src/index.css index.html
git commit -m "feat: add Inter variable font, sans-first tokens, entrance animation"
```

---

### Task 2: `boldify` text helper

**Files:**
- Create: `src/lib/text.tsx`
- Test: `src/lib/text.test.tsx`

**Interfaces:**
- Produces: `boldify(text: string): ReactNode` — renders `**…**` spans as `<strong className="font-semibold text-fg">…</strong>`, everything else as plain text. Consumed by `WorkItem`, `ProjectItem`, `AchievementItem`, and `Home`.

- [ ] **Step 1: Write the failing test**

Create `src/lib/text.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { boldify } from './text'

describe('boldify', () => {
  it('renders **segments** as <strong>', () => {
    render(<p>{boldify('drove **$4.3M+** in yield')}</p>)
    const strong = screen.getByText('$4.3M+')
    expect(strong.tagName).toBe('STRONG')
  })
  it('renders plain text unchanged when no markers', () => {
    render(<p>{boldify('no metrics here')}</p>)
    expect(screen.getByText('no metrics here')).toBeInTheDocument()
  })
  it('handles multiple bold segments', () => {
    render(<p>{boldify('**8.5K+** users and **$114M+** volume')}</p>)
    expect(screen.getByText('8.5K+').tagName).toBe('STRONG')
    expect(screen.getByText('$114M+').tagName).toBe('STRONG')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run src/lib/text.test.tsx`
Expected: FAIL — cannot resolve `./text`

- [ ] **Step 3: Implement `src/lib/text.tsx`**

```tsx
import type { ReactNode } from 'react'

export function boldify(text: string): ReactNode {
  const parts = text.split(/\*\*(.+?)\*\*/g)
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold text-fg">{part}</strong>
    ) : (
      part
    ),
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest run src/lib/text.test.tsx`
Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add src/lib/text.tsx src/lib/text.test.tsx
git commit -m "feat: add boldify helper for metric emphasis in copy"
```

---

### Task 3: Resume-mirrored content data

**Files:**
- Create: `src/data/content.ts`
- Test: `src/data/content.test.ts`

**Interfaces:**
- Produces:
  - `interface WorkEntry { org: string; url?: string; role: string; period: string; points: string[] }`
  - `interface ProjectEntry { name: string; oneliner: string; award: string }`
  - `interface SkillGroupData { label: string; items: string[] }`
  - `export const work: WorkEntry[]`, `export const projectsData: ProjectEntry[]`, `export const achievements: string[]`, `export const skills: SkillGroupData[]`
- Consumed by `Home` (Task 5). The old `src/data/about.ts` is left untouched here and deleted in Task 7.

- [ ] **Step 1: Write the failing test**

Create `src/data/content.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { work, projectsData, achievements, skills } from './content'

describe('content data (mirrors July 2026 resume)', () => {
  it('has four work entries in reverse-chronological order', () => {
    expect(work.map((w) => w.org)).toEqual([
      'MetEngine', 'WalletConnect', 'Huddle01', "Google Summer of Code '22",
    ])
  })
  it('gives every work entry a period and 1-4 points', () => {
    for (const w of work) {
      expect(w.period).toBeTruthy()
      expect(w.points.length).toBeGreaterThanOrEqual(1)
      expect(w.points.length).toBeLessThanOrEqual(4)
    }
  })
  it('lists exactly the four resume projects', () => {
    expect(projectsData.map((p) => p.name)).toEqual([
      'Stackit', 'Farview.id', 'Capital Finance', 'WiseBets',
    ])
  })
  it('every project has a oneliner and an award', () => {
    for (const p of projectsData) {
      expect(p.oneliner).toBeTruthy()
      expect(p.award).toMatch(/Won/)
    }
  })
  it('has three achievement lines', () => {
    expect(achievements).toHaveLength(3)
  })
  it('has the four resume skill groups', () => {
    expect(skills.map((s) => s.label)).toEqual([
      'Languages', 'Backend & Data', 'Web3', 'Solutions & Integration',
    ])
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run src/data/content.test.ts`
Expected: FAIL — cannot resolve `./content`

- [ ] **Step 3: Implement `src/data/content.ts`**

```ts
export interface WorkEntry { org: string; url?: string; role: string; period: string; points: string[] }
export interface ProjectEntry { name: string; oneliner: string; award: string }
export interface SkillGroupData { label: string; items: string[] }

export const work: WorkEntry[] = [
  {
    org: 'MetEngine', url: 'https://metengine.xyz', role: 'Co-Founder & CTO',
    period: 'Feb 2025 – Jun 2026',
    points: [
      'Built a zero-slot-latency automated copy-LPing engine that drove **$4.3M+** in yield for **8.5K+** users and scaled total volume past **$114M+**.',
      'Led the backend end-to-end: high-throughput data pipelines and real-time analytics on Solana (Node.js, ClickHouse, Redis) in production on AWS, with a real-time indexer across Meteora and other DeFi protocols.',
      'Built x402/MPP data APIs for Polymarket, Hyperliquid, and market making (**6,000+** transactions) and a Chrome extension with **2,500+** peak downloads.',
      'Raised **$375K** pre-seed from Colosseum, Balaji Srinivasan, and MonkeFoundry; drove the product 0 → 1 across architecture, hiring, and go-to-market.',
    ],
  },
  {
    org: 'WalletConnect', role: 'DevRel / Solutions Engineer, WalletKit',
    period: 'Nov 2024 – May 2025',
    points: [
      'Embedded with **Jupiter, Backpack, and MetaMask** to integrate WalletKit and add Solana support, debugging their integrations directly.',
      'Technical point of contact for wallet clients — triaged issues, reproduced bugs, and turned customer feedback into product fixes.',
      'Wrote docs, integration guides, and sample apps; onboarded wallets to WalletConnect Certified.',
    ],
  },
  {
    org: 'Huddle01', role: 'DevRel Engineer',
    period: 'Apr 2023 – Aug 2024',
    points: [
      'Drove **200+** projects to integrate the SDK through docs, sample apps, and hands-on support; contributed to the core SDKs.',
      'Built FarHouse, an audio-spaces client on Farcaster with in-app tipping — **30K+** MAUs; grew the Discord community from 2K to **13K+**.',
    ],
  },
  {
    org: "Google Summer of Code '22", role: 'Open-Source Contributor, Oppia Foundation',
    period: '2022',
    points: [
      'Merged **30+** PRs improving accessibility in the Oppia Android app.',
    ],
  },
]

export const projectsData: ProjectEntry[] = [
  {
    name: 'Stackit',
    oneliner: 'Theme-based investable baskets of tokens with fund analytics and referrals.',
    award: 'Won **2nd prize** at Solana Hacker House; received a Superteam grant.',
  },
  {
    name: 'Farview.id',
    oneliner: 'Personalized profile pages for Farcaster & Base users — **6K+** users, **12K+** Frame interactions.',
    award: 'Won the **Social track** at Base Onchain Summer Buildathon; Base builder grant.',
  },
  {
    name: 'Capital Finance',
    oneliner: 'Cross-chain yield aggregator on the Superchain, auto-routing funds to the highest yield via Chainlink CCIP.',
    award: 'Won **Best Trading App on Base** and Best Use of Goldsky at ETHGlobal SuperHack.',
  },
  {
    name: 'WiseBets',
    oneliner: 'Multi-chain opinion-trading platform with shareable Frames, built on Chainlink CCIP.',
    award: 'Won **zkSync, Polygon & Scroll prizes** at Chainlink Block Magic.',
  },
]

export const achievements: string[] = [
  '**2nd prize**, DeFi track, Colosseum Breakout Hackathon — out of **1,412 projects** from 10K+ builders; selected for **Colosseum Accelerator Cohort 3**.',
  '**ETHGlobal finalist** and winner of **30+ hackathons**; builder grants from Base and Superteam.',
  'Speaker at **25+ conferences**; mentored at ETHIndia and HackFS.',
]

export const skills: SkillGroupData[] = [
  { label: 'Languages', items: ['TypeScript', 'JavaScript', 'Solidity', 'Python', 'Rust (familiar)'] },
  { label: 'Backend & Data', items: ['Node.js', 'REST APIs', 'data pipelines & real-time analytics', 'PostgreSQL', 'ClickHouse', 'Redis', 'Supabase', 'Firebase', 'AWS'] },
  { label: 'Web3', items: ['Solana', 'EVM', 'Ethers.js', 'Web3.js', 'SolanaKit', 'Wagmi/Viem', 'WalletConnect', 'Chainlink CCIP', 'Dune'] },
  { label: 'Solutions & Integration', items: ['API & SDK integration', 'integration debugging', 'customer onboarding & support', 'technical docs', 'sample apps & demos', 'community & speaking'] },
]
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest run src/data/content.test.ts`
Expected: PASS (6 tests)

- [ ] **Step 5: Commit**

```bash
git add src/data/content.ts src/data/content.test.ts
git commit -m "content: add resume-mirrored work/projects/achievements/skills data"
```

---

### Task 4: List components — WorkItem, ProjectItem, reworked Section

**Files:**
- Create: `src/components/WorkItem.tsx`
- Create: `src/components/ProjectItem.tsx`
- Modify: `src/components/Section.tsx`
- Test: `src/components/WorkItem.test.tsx`, `src/components/ProjectItem.test.tsx`

**Interfaces:**
- Consumes: `WorkEntry`, `ProjectEntry` from `src/data/content.ts` (Task 3); `boldify` from `src/lib/text.tsx` (Task 2).
- Produces:
  - `WorkItem({ entry }: { entry: WorkEntry })` — default export
  - `ProjectItem({ project }: { project: ProjectEntry })` — default export
  - `Section({ title, id, stagger, children }: { title?: string; id?: string; stagger?: number; children: ReactNode })` — default export; lowercase mono label, no borders, applies `animate-enter` with `--stagger`.

- [ ] **Step 1: Write the failing tests**

Create `src/components/WorkItem.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import WorkItem from './WorkItem'
import type { WorkEntry } from '../data/content'

const entry: WorkEntry = {
  org: 'MetEngine', url: 'https://metengine.xyz', role: 'Co-Founder & CTO',
  period: 'Feb 2025 – Jun 2026',
  points: ['Drove **$4.3M+** in yield.'],
}

describe('WorkItem', () => {
  it('renders org as external link, role, period, and bolded points', () => {
    render(<WorkItem entry={entry} />)
    const link = screen.getByRole('link', { name: 'MetEngine' })
    expect(link).toHaveAttribute('href', 'https://metengine.xyz')
    expect(link).toHaveAttribute('target', '_blank')
    expect(screen.getByText(/Co-Founder & CTO/)).toBeInTheDocument()
    expect(screen.getByText('Feb 2025 – Jun 2026')).toBeInTheDocument()
    expect(screen.getByText('$4.3M+').tagName).toBe('STRONG')
  })
  it('renders org as plain text when there is no url', () => {
    render(<WorkItem entry={{ ...entry, org: 'Huddle01', url: undefined }} />)
    expect(screen.queryByRole('link', { name: 'Huddle01' })).toBeNull()
    expect(screen.getByText('Huddle01')).toBeInTheDocument()
  })
})
```

Create `src/components/ProjectItem.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ProjectItem from './ProjectItem'
import type { ProjectEntry } from '../data/content'

const project: ProjectEntry = {
  name: 'Stackit',
  oneliner: 'Theme-based investable baskets of tokens.',
  award: 'Won **2nd prize** at Solana Hacker House.',
}

describe('ProjectItem', () => {
  it('renders name, oneliner, and bolded award', () => {
    render(<ProjectItem project={project} />)
    expect(screen.getByText('Stackit')).toBeInTheDocument()
    expect(screen.getByText(/investable baskets/)).toBeInTheDocument()
    expect(screen.getByText('2nd prize').tagName).toBe('STRONG')
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm vitest run src/components/WorkItem.test.tsx src/components/ProjectItem.test.tsx`
Expected: FAIL — cannot resolve `./WorkItem` / `./ProjectItem`

- [ ] **Step 3: Implement the components**

Create `src/components/WorkItem.tsx`:

```tsx
import type { WorkEntry } from '../data/content'
import { boldify } from '../lib/text'

export default function WorkItem({ entry }: { entry: WorkEntry }) {
  return (
    <article>
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="text-[15px] font-semibold">
          {entry.url ? (
            <a
              href={entry.url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-border underline-offset-4 transition-colors duration-150 hover:decoration-accent hover:text-accent"
            >
              {entry.org}
            </a>
          ) : (
            entry.org
          )}
          <span className="font-normal text-muted"> — {entry.role}</span>
        </h3>
        <span className="shrink-0 font-mono text-xs text-muted">{entry.period}</span>
      </div>
      <ul className="mt-2 space-y-1.5">
        {entry.points.map((p, i) => (
          <li
            key={i}
            className="relative pl-4 text-[15px] leading-relaxed text-muted before:absolute before:left-0 before:content-['–']"
          >
            {boldify(p)}
          </li>
        ))}
      </ul>
    </article>
  )
}
```

Create `src/components/ProjectItem.tsx`:

```tsx
import type { ProjectEntry } from '../data/content'
import { boldify } from '../lib/text'

export default function ProjectItem({ project }: { project: ProjectEntry }) {
  return (
    <article>
      <h3 className="text-[15px] font-semibold">
        {project.name}
        <span className="font-normal text-muted"> — {boldify(project.oneliner)}</span>
      </h3>
      <p className="mt-1 text-[15px] leading-relaxed text-muted">{boldify(project.award)}</p>
    </article>
  )
}
```

Replace `src/components/Section.tsx` with:

```tsx
import type { CSSProperties, ReactNode } from 'react'

interface Props { title?: string; id?: string; stagger?: number; children: ReactNode }

export default function Section({ title, id, stagger = 0, children }: Props) {
  return (
    <section
      id={id}
      className="animate-enter"
      style={{ '--stagger': stagger } as CSSProperties}
    >
      {title && (
        <h2 className="mb-5 font-mono text-xs lowercase tracking-[0.18em] text-muted">{title}</h2>
      )}
      {children}
    </section>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm vitest run src/components/WorkItem.test.tsx src/components/ProjectItem.test.tsx && pnpm test`
Expected: new tests PASS; full suite still green (old pages still compile against old Section signature — `stagger` is optional and borders were only cosmetic).

- [ ] **Step 5: Commit**

```bash
git add src/components/WorkItem.tsx src/components/WorkItem.test.tsx src/components/ProjectItem.tsx src/components/ProjectItem.test.tsx src/components/Section.tsx
git commit -m "feat: add WorkItem/ProjectItem list components; rework Section (no borders, stagger)"
```

---

### Task 5: Site config rewrite + single-page Home

**Files:**
- Modify: `src/config/site.ts`
- Modify: `src/config/site.test.ts`
- Modify: `src/pages/Home.tsx`

**Interfaces:**
- Consumes: `work`, `projectsData`, `achievements`, `skills` (Task 3); `WorkItem`, `ProjectItem`, `Section` (Task 4); `boldify` (Task 2).
- Produces: `SiteConfig` without `stats`/`nav`/`currently`, with new field `availability: string` and `roleLine: string`. `site.role = 'Backend & Solutions Engineer'`. Header (Task 6) stops consuming `site.nav`.

**Note on ordering:** `site.stats` and `site.nav` are still consumed by `Header.tsx`, `Home.tsx` (old version) until this task and Task 6 land. This task rewrites Home and site config together; Header still compiles because this task keeps `nav` temporarily — it is removed in Task 6 with the Header rewrite.

- [ ] **Step 1: Update the failing site config test**

Replace the body of `src/config/site.test.ts` with:

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
  it('positions for solutions engineering with an explicit availability line', () => {
    expect(site.role).toBe('Backend & Solutions Engineer')
    expect(site.availability).toMatch(/looking for my next role/i)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run src/config/site.test.ts`
Expected: FAIL — `site.availability` undefined, role mismatch

- [ ] **Step 3: Rewrite `src/config/site.ts`**

```ts
export interface Social { label: string; href: string }
export interface NavItem { label: string; path: string }
export interface SiteConfig {
  name: string; role: string; roleLine: string; tagline: string; availability: string;
  email: string; baseUrl: string; resumePath: string;
  socials: Social[]; nav: NavItem[];
}

export const site: SiteConfig = {
  name: 'Vraj Desai',
  role: 'Backend & Solutions Engineer',
  roleLine: 'backend & solutions engineer',
  tagline:
    'Backend & solutions engineer. Co-founded MetEngine — $114M+ volume, 8.5K+ users. Previously WalletConnect and Huddle01. Looking for my next role.',
  availability:
    "I'm currently looking for my next role — solutions engineering, DevRel, or backend.",
  email: 'vrajdesai78@gmail.com',
  baseUrl: 'https://vrajdesai.dev',
  resumePath: '/vraj-desai-resume.pdf',
  socials: [
    { label: 'GitHub', href: 'https://github.com/vrajdesai78' },
    { label: 'X', href: 'https://x.com/vrajdesai78' },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/vrajdesai78' },
    { label: 'Email', href: 'mailto:vrajdesai78@gmail.com' },
  ],
  nav: [],
}
```

(`nav` stays as an empty array so `Header.tsx` still compiles; both are removed in Task 6. `stats` and `currently` are gone — the old `Home.tsx` that used them is rewritten in this task.)

- [ ] **Step 4: Rewrite `src/pages/Home.tsx`**

```tsx
import { Link } from 'react-router-dom'
import { site } from '../config/site'
import { work, projectsData, achievements, skills } from '../data/content'
import { boldify } from '../lib/text'
import { personJsonLd } from '../lib/seo'
import Container from '../components/Container'
import Section from '../components/Section'
import Seo from '../components/Seo'
import WorkItem from '../components/WorkItem'
import ProjectItem from '../components/ProjectItem'

const linkClass =
  'underline decoration-border underline-offset-4 transition-colors duration-150 hover:decoration-accent hover:text-accent'

export function Component() {
  return (
    <Container>
      <Seo title={`${site.name} — ${site.role}`} description={site.tagline} path="/" jsonLd={personJsonLd()} />
      <div className="space-y-14 py-14">
        <header className="animate-enter">
          <div className="flex items-center gap-4">
            <img
              src="/vraj-desai.jpg"
              alt="Vraj Desai"
              width={640}
              height={640}
              className="h-14 w-14 rounded-full object-cover"
            />
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">{site.name}</h1>
              <p className="mt-0.5 font-mono text-sm text-muted">{site.roleLine}</p>
            </div>
          </div>
          <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-muted">
            <p>
              I build end-to-end and work directly with customers — backend, integrations, and
              developer-facing solutions. Most recently co-founded{' '}
              <a href="https://metengine.xyz" target="_blank" rel="noopener noreferrer" className={`text-fg ${linkClass}`}>
                MetEngine
              </a>
              : {boldify('**$114M+** volume, **8.5K+** users, **$375K** raised from Colosseum and Balaji Srinivasan.')}
            </p>
            <p className="text-fg">
              <span className="mr-2 inline-block h-2 w-2 animate-pulse rounded-full bg-accent" aria-hidden="true" />
              {site.availability}{' '}
              <a href={`mailto:${site.email}`} className={linkClass}>
                Get in touch →
              </a>
            </p>
          </div>
          <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs lowercase text-muted">
            {site.socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target={s.href.startsWith('mailto:') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  {s.label}
                </a>
              </li>
            ))}
            <li>
              <Link to="/resume" className={linkClass}>Resume</Link>
            </li>
          </ul>
        </header>

        <Section title="work" stagger={1}>
          <div className="space-y-8">
            {work.map((w) => <WorkItem key={w.org} entry={w} />)}
          </div>
        </Section>

        <Section title="projects" stagger={2}>
          <div className="space-y-6">
            {projectsData.map((p) => <ProjectItem key={p.name} project={p} />)}
          </div>
        </Section>

        <Section title="achievements" stagger={3}>
          <ul className="space-y-2">
            {achievements.map((a, i) => (
              <li
                key={i}
                className="relative pl-4 text-[15px] leading-relaxed text-muted before:absolute before:left-0 before:content-['–']"
              >
                {boldify(a)}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="skills" stagger={4}>
          <dl className="space-y-2 text-[15px] leading-relaxed">
            {skills.map((g) => (
              <div key={g.label}>
                <dt className="inline font-semibold">{g.label}: </dt>
                <dd className="inline text-muted">{g.items.join(', ')}</dd>
              </div>
            ))}
          </dl>
        </Section>
      </div>
    </Container>
  )
}
```

- [ ] **Step 5: Run the suite and check the page renders**

Run: `pnpm test && pnpm typecheck`
Expected: PASS. (`StatStrip`/`ProjectCard` and their tests still exist and pass — deleted in Task 6.)

Run: `pnpm build:app`
Expected: build succeeds; `dist/index.html` contains "looking for my next role".

- [ ] **Step 6: Commit**

```bash
git add src/config/site.ts src/config/site.test.ts src/pages/Home.tsx
git commit -m "feat: single-page home mirroring resume; explicit availability positioning"
```

---

### Task 6: Minimal Header, Footer restyle, ThemeToggle restyle

**Files:**
- Modify: `src/components/Header.tsx`
- Modify: `src/components/Footer.tsx`
- Modify: `src/components/ThemeToggle.tsx` (class changes only)
- Modify: `src/config/site.ts` (remove `nav` + `NavItem`)
- Test: existing `src/components/Footer.test.tsx`, `src/components/ThemeToggle.test.tsx` must stay green

**Interfaces:**
- Consumes: `site` from Task 5.
- Produces: `SiteConfig` loses `nav` and `NavItem`. No component consumes them after this task.

- [ ] **Step 1: Rewrite `src/components/Header.tsx`**

```tsx
import { Link } from 'react-router-dom'
import Container from './Container'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  return (
    <header>
      <Container>
        <nav aria-label="Main navigation" className="flex items-center justify-between py-6">
          <Link to="/" className="font-mono text-sm text-muted transition-colors duration-150 hover:text-accent">
            vrajdesai.dev
          </Link>
          <div className="flex items-center gap-5">
            <Link
              to="/resume"
              className="font-mono text-xs lowercase tracking-wider text-muted transition-colors duration-150 hover:text-accent"
            >
              resume
            </Link>
            <ThemeToggle />
          </div>
        </nav>
      </Container>
    </header>
  )
}
```

- [ ] **Step 2: Remove `nav`/`NavItem` from `src/config/site.ts`**

Delete the `NavItem` interface, the `nav: NavItem[]` field from `SiteConfig`, and the `nav: []` entry from the `site` object.

- [ ] **Step 3: Restyle `src/components/Footer.tsx`**

```tsx
import { site } from '../config/site'
import Container from './Container'

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-border py-10">
      <Container>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="font-mono text-xs text-muted">© {site.name}</p>
          <ul className="flex flex-wrap gap-4">
            {site.socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target={s.href.startsWith('mailto:') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  className="font-mono text-xs lowercase tracking-wider text-muted transition-colors duration-150 hover:text-accent"
                >
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

(Labels keep their original casing in the DOM — `lowercase` is CSS — so `Footer.test.tsx` still passes.)

- [ ] **Step 4: Restyle the `ThemeToggle` button**

In `src/components/ThemeToggle.tsx`, replace the button `className` (line 26) with:

```tsx
      className="font-mono text-xs lowercase tracking-wider text-muted transition-colors duration-150 hover:text-accent"
```

- [ ] **Step 5: Run the suite**

Run: `pnpm test && pnpm typecheck`
Expected: PASS — Footer and ThemeToggle tests assert text/attributes, not classes.

- [ ] **Step 6: Commit**

```bash
git add src/components/Header.tsx src/components/Footer.tsx src/components/ThemeToggle.tsx src/config/site.ts
git commit -m "feat: minimal header (name/resume/theme), quiet footer and toggle; drop nav config"
```

---

### Task 7: Delete the old world — routes, MDX pipeline, unused components

**Files:**
- Modify: `src/App.tsx`
- Modify: `vite.config.ts`
- Modify: `src/pages/Resume.tsx`, `src/pages/NotFound.tsx` (restyle links)
- Delete: `src/pages/About.tsx`, `src/pages/Projects.tsx`, `src/pages/ProjectDetail.tsx`
- Delete: `src/content/projects/` (all four `.mdx`), `src/mdx.d.ts`
- Delete: `src/lib/content.ts`, `src/lib/content.test.ts`
- Delete: `src/data/about.ts`
- Delete: `src/components/ProjectCard.tsx`, `ProjectCard.test.tsx`, `StatStrip.tsx`, `StatStrip.test.tsx`, `Timeline.tsx`, `Timeline.test.tsx`, `SkillGroup.tsx`, `AchievementList.tsx`, `ProjectRow.tsx`, `MDXComponents.tsx`
- Modify: `package.json` (remove MDX deps)

**Interfaces:**
- Consumes: nothing new.
- Produces: routes are exactly `/`, `/resume`, `*` (404). No module imports MDX, `gray-matter` (app side), or the deleted components.

- [ ] **Step 1: Rewrite `src/App.tsx`**

```tsx
import type { RouteRecord } from 'vite-react-ssg'
import Layout from './components/Layout'

export const routes: RouteRecord[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, lazy: () => import('./pages/Home') },
      { path: 'resume', lazy: () => import('./pages/Resume') },
      { path: '*', lazy: () => import('./pages/NotFound') },
    ],
  },
]
```

- [ ] **Step 2: Remove the MDX plugin from `vite.config.ts`**

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

- [ ] **Step 3: Restyle `src/pages/Resume.tsx` (bordered button → underlined link)**

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
      <div className="py-14">
        <Section title="resume">
          <a
            href={site.resumePath}
            download
            className="font-mono text-sm underline decoration-border underline-offset-4 transition-colors duration-150 hover:decoration-accent hover:text-accent"
          >
            Download PDF ↓
          </a>
          <div className="mt-6 border border-border">
            <object data={site.resumePath} type="application/pdf" className="h-[80vh] w-full" aria-label="Resume PDF">
              <p className="p-4 text-muted">
                Your browser can't display PDFs.{' '}
                <a className="underline underline-offset-4" href={site.resumePath}>Get the PDF</a>.
              </p>
            </object>
          </div>
        </Section>
      </div>
    </Container>
  )
}
```

- [ ] **Step 4: Restyle `src/pages/NotFound.tsx` link**

Replace line 13 (`<Link to="/" ...>← Home</Link>`) with:

```tsx
        <Link to="/" className="mt-6 inline-block font-mono text-sm underline decoration-border underline-offset-4 transition-colors duration-150 hover:decoration-accent hover:text-accent">← Home</Link>
```

- [ ] **Step 5: Delete dead files**

```bash
git rm -r src/content src/mdx.d.ts src/lib/content.ts src/lib/content.test.ts src/data/about.ts \
  src/pages/About.tsx src/pages/Projects.tsx src/pages/ProjectDetail.tsx \
  src/components/ProjectCard.tsx src/components/ProjectCard.test.tsx \
  src/components/StatStrip.tsx src/components/StatStrip.test.tsx \
  src/components/Timeline.tsx src/components/Timeline.test.tsx \
  src/components/SkillGroup.tsx src/components/AchievementList.tsx \
  src/components/ProjectRow.tsx src/components/MDXComponents.tsx
```

- [ ] **Step 6: Remove MDX dependencies**

```bash
pnpm remove @mdx-js/react @mdx-js/rollup @types/mdx remark-frontmatter remark-mdx-frontmatter
```

(Keep `gray-matter` for now — `scripts/content-fs.ts` still imports it until Task 8.)

- [ ] **Step 7: Verify everything still works**

Run: `pnpm test && pnpm typecheck && pnpm lint && pnpm build:app`
Expected: all green. `dist/` contains `index.html`, `resume.html`, no `about.html`/`projects/`.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "refactor: collapse to single page; remove MDX pipeline and dead components"
```

---

### Task 8: Scripts — OG routes, sitemap, check-build; drop gray-matter

**Files:**
- Modify: `scripts/content-fs.ts`
- Modify: `scripts/check-build.ts`
- Modify: `package.json` (remove `gray-matter`)
- Test: existing `scripts/sitemap.test.ts` must stay green

**Interfaces:**
- Consumes: `site` from `src/config/site.ts`.
- Produces: `listRoutes(): RouteMeta[]` returning exactly `/` and `/resume`. `generate-og.tsx` and `generate-sitemap.ts` keep consuming `listRoutes()` unchanged.

- [ ] **Step 1: Rewrite `scripts/content-fs.ts`**

```ts
import { site } from '../src/config/site'

export interface RouteMeta {
  path: string
  eyebrow: string
  title: string
  subtitle?: string
  metric?: string
}

export function listRoutes(): RouteMeta[] {
  return [
    {
      path: '/',
      eyebrow: site.role.toUpperCase(),
      title: site.name,
      subtitle: 'MetEngine · WalletConnect · Huddle01',
      metric: '$114M+ volume · 8.5K+ users',
    },
    { path: '/resume', eyebrow: 'RESUME', title: site.name, subtitle: site.role },
  ]
}
```

- [ ] **Step 2: Update `scripts/check-build.ts` checks**

```ts
import { readFileSync, existsSync } from 'node:fs'

const checks: { file: string; must: string[] }[] = [
  { file: 'dist/index.html', must: ['<title', 'og:image', 'application/ld+json', 'MetEngine', 'looking for my next role'] },
  { file: 'dist/resume.html', must: ['<title', 'og:image'] },
  { file: 'dist/og/home.png', must: [] },
  { file: 'dist/og/resume.png', must: [] },
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

- [ ] **Step 3: Remove gray-matter**

```bash
pnpm remove gray-matter
```

- [ ] **Step 4: Run the full production build**

Run: `pnpm test && pnpm build`
Expected: build, OG generation (`OG: dist/og/home.png`, `OG: dist/og/resume.png`), sitemap, and `check-build OK` all succeed.

- [ ] **Step 5: Commit**

```bash
git add scripts/content-fs.ts scripts/check-build.ts package.json pnpm-lock.yaml
git commit -m "build: OG/sitemap/check-build for single-page routes; drop gray-matter"
```

---

### Task 9: Redirects for removed routes

**Files:**
- Modify: `vercel.json`

**Interfaces:** none.

- [ ] **Step 1: Add redirects**

```json
{
  "cleanUrls": true,
  "trailingSlash": false,
  "redirects": [
    { "source": "/about", "destination": "/", "permanent": true },
    { "source": "/projects", "destination": "/", "permanent": true },
    { "source": "/projects/:slug", "destination": "/", "permanent": true }
  ]
}
```

- [ ] **Step 2: Validate JSON**

Run: `node -e "JSON.parse(require('fs').readFileSync('vercel.json','utf8')); console.log('valid')"`
Expected: `valid`

- [ ] **Step 3: Commit**

```bash
git add vercel.json
git commit -m "build: redirect removed /about and /projects routes to /"
```

---

### Task 10: Final verification

**Files:** none (verification only).

- [ ] **Step 1: Full gate**

Run: `pnpm test && pnpm typecheck && pnpm lint && pnpm build`
Expected: everything green, `check-build OK`.

- [ ] **Step 2: Verify the built page content**

```bash
grep -o 'looking for my next role[^<]*' dist/index.html | head -1
grep -c 'WiseBets\|Capital Finance\|Stackit\|Farview.id' dist/index.html
grep -o '<loc>[^<]*</loc>' dist/sitemap.xml
```

Expected: availability line present; project count ≥ 4; sitemap lists exactly `https://vrajdesai.dev/` and `https://vrajdesai.dev/resume`.

- [ ] **Step 3: Visual check in the browser**

Run: `pnpm preview` and open the served URL. Verify against the spec: single column ~672px, Inter body with mono labels, staggered fade-up entrance, pulsing green availability dot, no boxed cards, both themes via the toggle, `/resume` renders the PDF, an unknown path shows 404.

- [ ] **Step 4: Report**

Summarize what shipped and remind the user to replace `public/vraj-desai-resume.pdf` with the freshly compiled LaTeX resume.
