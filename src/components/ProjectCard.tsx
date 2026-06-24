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
          {Object.entries(f.links)
            .filter((e): e is [string, string] => typeof e[1] === 'string')
            .map(([k, href]) => (
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
