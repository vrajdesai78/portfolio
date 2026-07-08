// src/config/site.test.ts
import { describe, it, expect } from 'vitest'
import { site } from './site'

describe('site config', () => {
  it('uses https base url with no trailing slash', () => {
    expect(site.baseUrl).toBe('https://vrajdesai.dev')
  })
  it('uses the correct public email', () => {
    expect(site.email).toBe('vrajdesai78@gmail.com')
  })
  it('has GitHub, X, LinkedIn, email socials and NO Farcaster', () => {
    const labels = site.socials.map((s) => s.label.toLowerCase())
    expect(labels).toEqual(expect.arrayContaining(['github', 'x', 'linkedin', 'email']))
    expect(labels).not.toContain('farcaster')
  })
  it('positions for solutions engineering with an explicit availability line', () => {
    expect(site.role).toBe('Solutions Engineer')
    expect(site.availability).toMatch(/looking for my next role/i)
  })
})
