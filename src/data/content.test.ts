import { describe, it, expect } from 'vitest'
import { work, projectsData, achievements, skills } from './content'

describe('content data (mirrors July 2026 resume)', () => {
  it('has four work entries in reverse-chronological order', () => {
    expect(work.map((w) => w.org)).toEqual([
      'MetEngine', 'WalletConnect', 'Huddle01', "Google Summer of Code '22",
    ])
  })
  it('gives every work entry a period and 1-4 points', () => {
    for (const w of work) {
      expect(w.period).toBeTruthy()
      expect(w.points.length).toBeGreaterThanOrEqual(1)
      expect(w.points.length).toBeLessThanOrEqual(4)
    }
  })
  it('lists exactly the four resume projects', () => {
    expect(projectsData.map((p) => p.name)).toEqual([
      'Stackit', 'Farview.id', 'Capital Finance', 'WiseBets',
    ])
  })
  it('every project has a oneliner and an award', () => {
    for (const p of projectsData) {
      expect(p.oneliner).toBeTruthy()
      expect(p.award).toMatch(/Won/)
    }
  })
  it('has three achievement lines', () => {
    expect(achievements).toHaveLength(3)
  })
  it('has the four resume skill groups', () => {
    expect(skills.map((s) => s.label)).toEqual([
      'Languages', 'Backend & Data', 'Web3', 'Solutions & Integration',
    ])
  })
})
