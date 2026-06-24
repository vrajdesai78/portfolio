// src/pages/ProjectDetail.tsx
import { useParams, Link } from 'react-router-dom'
import type { MDXContent } from 'mdx/types'
import { getProjectBySlug } from '../lib/content'
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
  const MDXBody = Body as unknown as MDXContent
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
            {Object.entries(f.links)
              .filter((e): e is [string, string] => typeof e[1] === 'string')
              .map(([k, href]) => (
                <a key={k} href={href} target="_blank" rel="noopener noreferrer" className="font-mono text-xs uppercase tracking-wider text-accent hover:underline">{k} ↗</a>
              ))}
          </div>
        )}
        <div className="mt-8"><MDXBody components={mdxComponents} /></div>
      </article>
    </Container>
  )
}

