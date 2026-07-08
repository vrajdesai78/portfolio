import type { CSSProperties, ReactNode } from 'react'

interface Props { title?: string; cmd?: string; id?: string; stagger?: number; children: ReactNode }

export default function Section({ title, cmd, id, stagger = 0, children }: Props) {
  return (
    <section
      id={id}
      className="animate-enter scroll-mt-20"
      style={{ '--stagger': stagger } as CSSProperties}
    >
      {cmd ? (
        <h2 className="mb-7 font-mono text-xs tracking-[0.18em] text-muted">
          <span aria-hidden="true" className="text-accent">$ </span>
          {cmd}
        </h2>
      ) : (
        title && (
          <h2 className="mb-7 font-mono text-xs lowercase tracking-[0.18em] text-muted">{title}</h2>
        )
      )}
      {children}
    </section>
  )
}
