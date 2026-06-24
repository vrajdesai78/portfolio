// src/lib/og.test.ts
import { describe, it, expect } from 'vitest'
import { ogImagePath, ogCard } from './og'

describe('ogImagePath', () => {
  it('maps home to og/home.png', () => expect(ogImagePath('/')).toBe('/og/home.png'))
  it('maps /about', () => expect(ogImagePath('/about')).toBe('/og/about.png'))
  it('flattens nested project paths', () =>
    expect(ogImagePath('/projects/metengine')).toBe('/og/projects-metengine.png'))
  it('flattens writing paths', () =>
    expect(ogImagePath('/writing/my-post')).toBe('/og/writing-my-post.png'))
})

describe('ogCard', () => {
  it('ogCard passes through its fields', () => {
    expect(ogCard({ eyebrow: 'e', title: 't', subtitle: 's', metric: 'm' }))
      .toEqual({ eyebrow: 'e', title: 't', subtitle: 's', metric: 'm' })
  })
})
