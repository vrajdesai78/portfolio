import type { CSSProperties, ReactNode } from 'react'

interface Props { title?: string; id?: string; stagger?: number; children: ReactNode }

export default function Section({ title, id, stagger = 0, children }: Props) {
  return (
    <section
      id={id}
      className="animate-enter"
      style={{ '--stagger': stagger } as CSSProperties}
    >
      {title && (
        <h2 className="mb-5 font-mono text-xs lowercase tracking-[0.18em] text-muted">{title}</h2>
      )}
      {children}
    </section>
  )
}
