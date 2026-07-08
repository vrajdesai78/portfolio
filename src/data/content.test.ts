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
  it('lists exactly the two resume projects', () => {
    expect(projectsData.map((p) => p.name)).toEqual(['Stackit', 'Farview.id'])
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
  it('has the three resume skill groups', () => {
    expect(skills.map((s) => s.label)).toEqual([
      'Languages', 'Backend & Data', 'Solutions & Integration',
    ])
  })
  it('keeps the MetEngine metrics intact', () => {
    const text = work[0].points.join(' ')
    expect(text).toContain('$114M+')
    expect(text).toContain('8.5K+')
    expect(text).toContain('$4.3M+')
    expect(text).toContain('$375K')
  })
  it('keeps the Farview.id metrics and award intact', () => {
    const farview = projectsData.find((p) => p.name === 'Farview.id')!
    const text = `${farview.oneliner}${farview.award}`
    expect(text).toContain('6K+')
    expect(text).toContain('Social track')
  })
  it('keeps the Colosseum achievement metric intact', () => {
    expect(achievements.some((a) => a.includes('1,412 projects'))).toBe(true)
  })
  it('uses no em dashes anywhere in the copy', () => {
    const copy = [
      ...work.flatMap((w) => [w.org, w.role, ...w.points]),
      ...projectsData.flatMap((p) => [p.name, p.oneliner, p.award]),
      ...achievements,
      ...skills.flatMap((s) => [s.label, ...s.items]),
    ]
    for (const line of copy) expect(line).not.toContain('—')
  })
})
