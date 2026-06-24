// src/components/Timeline.tsx
import type { TimelineEntry } from '../data/about'
export default function Timeline({ entries }: { entries: TimelineEntry[] }) {
  return (
    <ol className="space-y-8">
      {entries.map((e) => (
        <li key={e.org} className="grid sm:grid-cols-[1fr_2fr] gap-1 sm:gap-6">
          <div className="font-mono text-xs uppercase tracking-wider text-muted">{e.period}</div>
          <div>
            <h3 className="font-mono"><span className="text-fg">{e.org}</span> <span className="text-muted">· {e.role}</span></h3>
            <ul className="mt-2 space-y-1 text-sm text-muted list-disc pl-4">
              {e.points.map((p) => <li key={p}>{p}</li>)}
            </ul>
          </div>
        </li>
      ))}
    </ol>
  )
}
