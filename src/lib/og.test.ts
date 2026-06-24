// src/lib/og.test.ts
import { describe, it, expect } from 'vitest'
import { ogImagePath } from './og'

describe('ogImagePath', () => {
  it('maps home to og/home.png', () => expect(ogImagePath('/')).toBe('/og/home.png'))
  it('maps /about', () => expect(ogImagePath('/about')).toBe('/og/about.png'))
  it('flattens nested project paths', () =>
    expect(ogImagePath('/projects/metengine')).toBe('/og/projects-metengine.png'))
  it('flattens writing paths', () =>
    expect(ogImagePath('/writing/crypto-to-ai')).toBe('/og/writing-crypto-to-ai.png'))
})
