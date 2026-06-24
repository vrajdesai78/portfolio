// src/components/ProjectCard.test.tsx
import { describe, it, expect } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import ProjectCard from './ProjectCard'
import type { Project } from '../lib/content'

const make = (over: Partial<Project['frontmatter']> = {}): Project => ({
  slug: 'metengine', Component: () => null,
  frontmatter: { title: 'MetEngine', oneliner: 'Solana liquidity & yield platform.', tags: ['Solana', 'DeFi'],
    metrics: [{ label: 'volume', value: '$114M+' }], ...over },
})

const wrap = (ui: React.ReactNode) => render(<MemoryRouter>{ui}</MemoryRouter>)

describe('ProjectCard', () => {
  it('renders title, oneliner, tags, metrics', () => {
    wrap(<ProjectCard project={make()} />)
    expect(screen.getByText('MetEngine')).toBeInTheDocument()
    expect(screen.getByText('Solana')).toBeInTheDocument()
    expect(screen.getByText('$114M+')).toBeInTheDocument()
  })
  it('renders NO external link buttons when links are absent', () => {
    wrap(<ProjectCard project={make()} />)
    expect(screen.queryByRole('link', { name: /live|github|video/i })).toBeNull()
  })
  it('renders a Live button when a live link exists', () => {
    wrap(<ProjectCard project={make({ links: { live: 'https://farview.id' } })} />)
    const live = screen.getByRole('link', { name: /live/i })
    expect(live).toHaveAttribute('href', 'https://farview.id')
    expect(live).toHaveAttribute('target', '_blank')
  })
})
