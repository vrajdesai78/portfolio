// src/components/StatStrip.tsx
import type { Stat } from '../config/site'
export default function StatStrip({ stats }: { stats: Stat[] }) {
  return (
    <dl className="grid grid-cols-2 sm:grid-cols-4 border border-border divide-x divide-y sm:divide-y-0 divide-border">
      {stats.map((s) => (
        <div key={s.label} className="p-4">
          <dt className="font-mono text-2xl sm:text-3xl text-fg">{s.value}</dt>
          <dd className="font-mono text-[11px] uppercase tracking-wider text-muted mt-1">{s.label}</dd>
        </div>
      ))}
    </dl>
  )
}
