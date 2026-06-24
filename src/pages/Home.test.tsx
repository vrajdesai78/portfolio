import { describe, it, expect } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import { Component as Home } from './Home'

describe('Home', () => {
  it('renders name, tagline, stat strip, and currently line', () => {
    render(<MemoryRouter><Home /></MemoryRouter>)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Vraj Desai')
    expect(screen.getAllByText(/\$114M\+/).length).toBeGreaterThan(0)
    expect(screen.getByText('Featured')).toBeInTheDocument()
  })
})
