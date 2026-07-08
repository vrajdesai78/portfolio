export const SECTIONS = ['work', 'projects', 'achievements', 'skills'] as const

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function scrollToSection(id: string, smooth = true): boolean {
  const el = typeof document !== 'undefined' ? document.getElementById(id) : null
  if (!el) return false
  el.scrollIntoView({ behavior: smooth && !prefersReducedMotion() ? 'smooth' : 'instant', block: 'start' })
  return true
}
