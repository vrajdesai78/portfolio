// src/lib/seo.test.ts
import { describe, it, expect } from 'vitest'
import { buildSeo, personJsonLd } from './seo'

describe('buildSeo', () => {
  it('builds absolute canonical + og url from path', () => {
    const t = buildSeo({ title: 'Projects', description: 'd', path: '/projects' })
    expect(t.canonical).toBe('https://vrajdesai.dev/projects')
    expect(t.ogUrl).toBe('https://vrajdesai.dev/projects')
  })
  it('defaults og image from path and uses summary_large_image', () => {
    const t = buildSeo({ title: 'About', description: 'd', path: '/about' })
    expect(t.ogImage).toBe('https://vrajdesai.dev/og/about.png')
    expect(t.twitterCard).toBe('summary_large_image')
  })
  it('respects an explicit absolute image', () => {
    const t = buildSeo({ title: 'x', description: 'd', path: '/', image: 'https://cdn/x.png' })
    expect(t.ogImage).toBe('https://cdn/x.png')
  })
  it('defaults ogType to website', () => {
    expect(buildSeo({ title: 'x', description: 'd', path: '/' }).ogType).toBe('website')
  })
})

describe('personJsonLd', () => {
  it('is a schema.org Person with sameAs links', () => {
    const ld = personJsonLd() as Record<string, unknown>
    expect(ld['@type']).toBe('Person')
    expect(ld.name).toBe('Vraj Desai')
    expect(Array.isArray(ld.sameAs)).toBe(true)
    expect((ld.sameAs as string[]).some((s) => s.startsWith('mailto:'))).toBe(false)
    expect(ld.sameAs).toContain('https://github.com/vrajdesai78')
  })
})
