// src/components/StatStrip.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import StatStrip from './StatStrip'

describe('StatStrip', () => {
  it('renders each stat value and label', () => {
    render(<StatStrip stats={[{ value: '$114M+', label: 'volume' }, { value: '8.5K+', label: 'users' }]} />)
    expect(screen.getByText('$114M+')).toBeInTheDocument()
    expect(screen.getByText('users')).toBeInTheDocument()
  })
})
