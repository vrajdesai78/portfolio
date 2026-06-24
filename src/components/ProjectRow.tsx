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
