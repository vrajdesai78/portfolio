import { describe, it, expect } from 'vitest'
import { resolveTheme, cycleTheme, getStoredTheme } from './theme'

describe('resolveTheme', () => {
  it('system follows the OS preference', () => {
    expect(resolveTheme('system', true)).toBe('dark')
    expect(resolveTheme('system', false)).toBe('light')
  })
  it('explicit choice overrides the OS', () => {
    expect(resolveTheme('light', true)).toBe('light')
    expect(resolveTheme('dark', false)).toBe('dark')
  })
})

describe('cycleTheme', () => {
  it('cycles system → light → dark → system', () => {
    expect(cycleTheme('system')).toBe('light')
    expect(cycleTheme('light')).toBe('dark')
    expect(cycleTheme('dark')).toBe('system')
  })
})

describe('getStoredTheme', () => {
  it('defaults to system for missing or invalid stored values', () => {
    localStorage.clear()
    expect(getStoredTheme()).toBe('system')
    localStorage.setItem('theme', 'bogus')
    expect(getStoredTheme()).toBe('system')
  })
})
