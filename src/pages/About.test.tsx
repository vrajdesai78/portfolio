// src/pages/About.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Component as About } from './About'

describe('About', () => {
  it('renders bio, experience, skills, achievements sections', () => {
    render(<About />)
    expect(screen.getAllByText(/Experience/i).length).toBeGreaterThan(0)
    expect(screen.getByText('MetEngine')).toBeInTheDocument()
    expect(screen.getByText(/TypeScript/)).toBeInTheDocument()
    expect(screen.getAllByText(/ETHGlobal Finalist/).length).toBeGreaterThan(0)
  })
})
