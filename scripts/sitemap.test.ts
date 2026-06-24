import { describe, it, expect } from 'vitest'
import { buildSitemap } from './sitemap'

describe('buildSitemap', () => {
  it('emits one <loc> per absolute url', () => {
    const xml = buildSitemap(['/', '/about'], 'https://vrajdesai.dev')
    expect(xml).toContain('<loc>https://vrajdesai.dev/</loc>')
    expect(xml).toContain('<loc>https://vrajdesai.dev/about</loc>')
    expect(xml.trim().startsWith('<?xml')).toBe(true)
  })
})
