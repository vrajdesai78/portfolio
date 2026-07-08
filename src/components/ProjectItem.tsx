import type { ProjectEntry } from '../data/content'
import { boldify } from '../lib/text'

export default function ProjectItem({ project }: { project: ProjectEntry }) {
  return (
    <article>
      <h3 className="text-[15px] font-semibold">
        {project.url ? (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-border underline-offset-4 transition-colors duration-150 hover:decoration-accent hover:text-accent"
          >
            {project.name}
          </a>
        ) : (
          project.name
        )}
        <span className="font-normal text-muted"> · {boldify(project.oneliner)}</span>
      </h3>
      <p className="mt-1 text-[15px] leading-relaxed text-muted">
        <span aria-hidden="true" className="mr-1.5 font-mono text-xs text-accent">★</span>
        {boldify(project.award)}
      </p>
    </article>
  )
}
