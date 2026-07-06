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
})
