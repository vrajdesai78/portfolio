import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import WorkItem from './WorkItem'
import type { WorkEntry } from '../data/content'

const entry: WorkEntry = {
  org: 'MetEngine', url: 'https://metengine.xyz', role: 'Co-Founder & CTO',
  period: 'Feb 2025 – Jun 2026',
  points: ['Drove **$4.3M+** in yield.'],
}

describe('WorkItem', () => {
  it('renders org as external link, role, period, and bolded points', () => {
    render(<WorkItem entry={entry} />)
    const link = screen.getByRole('link', { name: 'MetEngine' })
    expect(link).toHaveAttribute('href', 'https://metengine.xyz')
    expect(link).toHaveAttribute('target', '_blank')
    expect(screen.getByText(/Co-Founder & CTO/)).toBeInTheDocument()
    expect(screen.getByText('Feb 2025 – Jun 2026')).toBeInTheDocument()
    expect(screen.getByText('$4.3M+').tagName).toBe('STRONG')
  })
  it('renders org as plain text when there is no url', () => {
    render(<WorkItem entry={{ ...entry, org: 'Huddle01', url: undefined }} />)
    expect(screen.queryByRole('link', { name: 'Huddle01' })).toBeNull()
    expect(screen.getByText('Huddle01')).toBeInTheDocument()
  })
})
