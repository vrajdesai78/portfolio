import { describe, it, expect } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import { Component as Writing } from './Writing'

describe('Writing index', () => {
  it('renders a Writing heading', () => {
    render(<MemoryRouter><Writing /></MemoryRouter>)
    expect(screen.getByRole('heading', { name: /writing/i })).toBeInTheDocument()
  })
})
