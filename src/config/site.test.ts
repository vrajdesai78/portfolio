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
  it('has no role tag and an explicit availability line', () => {
    expect('role' in site).toBe(false)
    expect(site.availability).toMatch(/looking for my next role/i)
  })
  it('uses no em dashes in the tagline or availability line', () => {
    expect(site.tagline).not.toContain('—')
    expect(site.availability).not.toContain('—')
  })
})
