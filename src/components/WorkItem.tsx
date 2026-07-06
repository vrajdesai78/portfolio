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
