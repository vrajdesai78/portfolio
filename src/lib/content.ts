import type { ComponentType } from 'react'

export interface MetricItem { label: string; value: string }
export interface ProjectLinks { live?: string; github?: string; video?: string }
export interface ProjectFrontmatter {
  title: string; slug?: string; oneliner: string; tags: string[];
  role?: string; period?: string; metrics?: MetricItem[]; links?: ProjectLinks;
  featured?: boolean; order?: number; draft?: boolean;
}
export interface Project { slug: string; Component: ComponentType; frontmatter: ProjectFrontmatter }

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

const includeDrafts = import.meta.env.DEV

const projectModules = import.meta.glob<Mod<ProjectFrontmatter>>('../content/projects/*.mdx', { eager: true })

export const projects: Project[] = parseProjects(projectModules, { includeDrafts })
export const featuredProjects = projects.filter((p) => p.frontmatter.featured)

export const getProjectBySlug = (slug: string) => projects.find((p) => p.slug === slug)

// SSG runs at build (production) so drafts are excluded from prerender.
export const projectStaticPaths = () =>
  parseProjects(projectModules, { includeDrafts: false }).map((p) => `projects/${p.slug}`)
