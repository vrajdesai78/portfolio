// src/components/Timeline.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Timeline from './Timeline'

describe('Timeline', () => {
  it('renders org, role, period and bullet points', () => {
    render(<Timeline entries={[{ org: 'MetEngine', role: 'CTO', period: 'Feb 2025 – Jun 2026', points: ['Led backend'] }]} />)
    expect(screen.getByText('MetEngine')).toBeInTheDocument()
    expect(screen.getByText('Feb 2025 – Jun 2026')).toBeInTheDocument()
    expect(screen.getByText('Led backend')).toBeInTheDocument()
  })
})
