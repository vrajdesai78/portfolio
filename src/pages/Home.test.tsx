import { describe, it, expect } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import { Component as Home } from './Home'

describe('Home', () => {
  it('renders name, availability line, work, and projects', () => {
    render(<MemoryRouter><Home /></MemoryRouter>)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Vraj Desai')
    expect(screen.getByText(/looking for my next role/i)).toBeInTheDocument()
    expect(screen.getAllByText('MetEngine').length).toBeGreaterThan(0)
    expect(screen.getByText('Stackit')).toBeInTheDocument()
    expect(screen.getByText('Feb 2025 – Jun 2026')).toBeInTheDocument()
    expect(screen.getByText(/Languages/)).toBeInTheDocument()
  })
})
