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
