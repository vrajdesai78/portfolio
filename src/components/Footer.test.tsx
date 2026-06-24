import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Footer from './Footer'

describe('Footer', () => {
  it('renders GitHub/X/LinkedIn/Email and NOT Farcaster', () => {
    render(<Footer />)
    expect(screen.getByText('GitHub')).toBeInTheDocument()
    expect(screen.getByText('Email').closest('a')).toHaveAttribute('href', 'mailto:vrajdesai78@gmail.com')
    expect(screen.queryByText(/farcaster/i)).toBeNull()
  })
})
