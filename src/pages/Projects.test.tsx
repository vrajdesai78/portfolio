import { describe, it, expect } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import { Component as Projects } from './Projects'

describe('Projects index', () => {
  it('renders a Projects heading and the AI building-in-public block', () => {
    render(<MemoryRouter><Projects /></MemoryRouter>)
    expect(screen.getByRole('heading', { name: /projects/i })).toBeInTheDocument()
    expect(screen.getByText(/building in public/i)).toBeInTheDocument()
  })
})
