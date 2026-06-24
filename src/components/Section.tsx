import type { ReactNode } from 'react'
export default function Section({ title, id, children }: { title?: string; id?: string; children: ReactNode }) {
  return (
    <section id={id} className="py-10 border-t border-border first:border-t-0">
      {title && (
        <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-muted mb-6">{title}</h2>
      )}
      {children}
    </section>
  )
}
