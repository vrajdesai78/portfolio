import type { ReactNode } from 'react'

export function boldify(text: string): ReactNode {
  const parts = text.split(/\*\*(.+?)\*\*/g)
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold text-fg">{part}</strong>
    ) : (
      part
    ),
  )
}
