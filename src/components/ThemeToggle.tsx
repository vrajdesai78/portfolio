import { useEffect, useState } from 'react'
import {
  applyTheme, cycleTheme, getStoredTheme, resolveTheme, setStoredTheme,
  systemPrefersDark, type Theme,
} from '../lib/theme'

const LABEL: Record<Theme, string> = { system: 'System', light: 'Light', dark: 'Dark' }

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('system')
  useEffect(() => { setTheme(getStoredTheme()) }, [])
  useEffect(() => {
    if (typeof window === 'undefined') return
    applyTheme(resolveTheme(theme, systemPrefersDark()))
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => { if (getStoredTheme() === 'system') applyTheme(resolveTheme('system', mq.matches)) }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [theme])

  const next = () => { const n = cycleTheme(theme); setTheme(n); setStoredTheme(n) }
  return (
    <button
      type="button" onClick={next}
      aria-label={`Theme: ${LABEL[theme]}. Click to change.`}
      className="font-mono text-xs lowercase tracking-wider text-muted transition-colors duration-150 hover:text-accent"
    >
      {LABEL[theme]}
    </button>
  )
}
