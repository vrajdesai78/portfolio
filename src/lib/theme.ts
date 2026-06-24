export type Theme = 'light' | 'dark' | 'system'
export const THEME_KEY = 'theme'

export function systemPrefersDark(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
}
export function resolveTheme(theme: Theme, systemDark: boolean): 'light' | 'dark' {
  if (theme === 'system') return systemDark ? 'dark' : 'light'
  return theme
}
export function cycleTheme(current: Theme): Theme {
  return current === 'system' ? 'light' : current === 'light' ? 'dark' : 'system'
}
export function applyTheme(resolved: 'light' | 'dark'): void {
  document.documentElement.classList.toggle('dark', resolved === 'dark')
}
export function getStoredTheme(): Theme {
  if (typeof localStorage === 'undefined') return 'system'
  const t = localStorage.getItem(THEME_KEY)
  return t === 'light' || t === 'dark' || t === 'system' ? t : 'system'
}
export function setStoredTheme(t: Theme): void {
  try { localStorage.setItem(THEME_KEY, t) } catch { /* ignore */ }
}
