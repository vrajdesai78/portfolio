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
