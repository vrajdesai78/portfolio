import type { WorkEntry } from '../data/content'
import { boldify } from '../lib/text'

function FieldRow({ label, values }: { label: string; values: string[] }) {
  return (
    <p className="font-mono text-xs leading-relaxed">
      <span className="uppercase tracking-[0.14em] text-accent">{label}</span>
      <span className="lowercase text-fg"> {values.join(' · ')}</span>
    </p>
  )
}

export default function WorkItem({ entry }: { entry: WorkEntry }) {
  return (
    <article className="overflow-hidden rounded-sm border border-border">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-border bg-surface px-4 py-2.5">
        <h3 className="font-mono text-sm font-semibold">
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
          <span className="font-normal text-muted"> · {entry.role}</span>
        </h3>
        <span className="ml-auto shrink-0 font-mono text-xs text-muted">{entry.period}</span>
      </div>
      <div className="space-y-2 px-4 py-3">
        {entry.clients && <FieldRow label="clients" values={entry.clients} />}
        {entry.stack && <FieldRow label="stack" values={entry.stack} />}
        <ul className="space-y-1.5">
          {entry.points.map((p, i) => (
            <li
              key={i}
              className="relative pl-4 text-[15px] leading-relaxed text-muted before:absolute before:left-0 before:content-['–']"
            >
              {boldify(p)}
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}
