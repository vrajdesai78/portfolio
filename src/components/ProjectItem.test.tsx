import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ProjectItem from './ProjectItem'
import type { ProjectEntry } from '../data/content'

const project: ProjectEntry = {
  name: 'Stackit',
  oneliner: 'Theme-based investable baskets of tokens.',
  award: 'Won **2nd prize** at Solana Hacker House.',
}

describe('ProjectItem', () => {
  it('renders name, oneliner, and bolded award', () => {
    render(<ProjectItem project={project} />)
    expect(screen.getByText('Stackit')).toBeInTheDocument()
    expect(screen.getByText(/investable baskets/)).toBeInTheDocument()
    expect(screen.getByText('2nd prize').tagName).toBe('STRONG')
  })

  it('renders the name as an external link when url is set', () => {
    render(<ProjectItem project={{ ...project, url: 'https://github.com/vrajdesai78/Farview.id' }} />)
    const link = screen.getByRole('link', { name: 'Stackit' })
    expect(link).toHaveAttribute('href', 'https://github.com/vrajdesai78/Farview.id')
    expect(link).toHaveAttribute('target', '_blank')
  })

  it('renders a plain name without url', () => {
    render(<ProjectItem project={project} />)
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })
})
