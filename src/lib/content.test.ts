// src/lib/content.test.ts
import { describe, it, expect } from 'vitest'
import { parseProjects, type ProjectFrontmatter } from './content'

const Comp = () => null
const mod = (frontmatter: Partial<ProjectFrontmatter>) => ({ default: Comp, frontmatter: frontmatter as ProjectFrontmatter })

describe('parseProjects', () => {
  const modules = {
    '../content/projects/metengine.mdx': mod({ title: 'MetEngine', oneliner: 'x', tags: ['Solana'], order: 1 }),
    '../content/projects/farview.mdx': mod({ title: 'Farview.id', oneliner: 'y', tags: ['Base'], order: 2 }),
    '../content/projects/wip.mdx': mod({ title: 'WIP', oneliner: 'z', tags: ['Web3'], order: 3, draft: true }),
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
