import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import matter from 'gray-matter'
import { site } from '../src/config/site'

export interface RouteMeta {
  path: string
  eyebrow: string
  title: string
  subtitle?: string
  metric?: string
}

const readDir = (dir: string) =>
  existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith('.mdx')) : []

function projectRoutes(): RouteMeta[] {
  const dir = join('src', 'content', 'projects')
  return readDir(dir).flatMap((file) => {
    const { data } = matter(readFileSync(join(dir, file), 'utf8'))
    if (data.draft) return []
    const slug = (data.slug as string) ?? file.replace(/\.mdx$/, '')
    const metric =
      Array.isArray(data.metrics) && data.metrics[0]
        ? `${data.metrics[0].value} ${data.metrics[0].label}`
        : undefined
    return [
      {
        path: `/projects/${slug}`,
        eyebrow: 'PROJECT',
        title: data.title as string,
        subtitle: data.oneliner as string,
        metric,
      },
    ]
  })
}

function postRoutes(): RouteMeta[] {
  const dir = join('src', 'content', 'writing')
  return readDir(dir).flatMap((file) => {
    const { data } = matter(readFileSync(join(dir, file), 'utf8'))
    if (data.draft) return []
    const slug = (data.slug as string) ?? file.replace(/\.mdx$/, '')
    return [
      {
        path: `/writing/${slug}`,
        eyebrow: 'WRITING',
        title: data.title as string,
        subtitle: data.summary as string,
      },
    ]
  })
}

export function listRoutes(): RouteMeta[] {
  return [
    {
      path: '/',
      eyebrow: site.role.toUpperCase(),
      title: site.name,
      subtitle: 'Solana DeFi → AI',
      metric: '$114M+ volume · 8.5K+ users',
    },
    { path: '/about', eyebrow: 'ABOUT', title: site.name, subtitle: site.role },
    {
      path: '/projects',
      eyebrow: 'PROJECTS',
      title: 'Projects',
      subtitle: 'Solana · Farcaster/Base · AI',
    },
    {
      path: '/writing',
      eyebrow: 'WRITING',
      title: 'Writing',
      subtitle: 'Building in public',
    },
    { path: '/resume', eyebrow: 'RESUME', title: site.name, subtitle: site.role },
    ...projectRoutes(),
    ...postRoutes(),
  ]
}
