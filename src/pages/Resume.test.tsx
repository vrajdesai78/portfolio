// src/pages/Resume.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Component as Resume } from './Resume'

describe('Resume', () => {
  it('renders a download link to the PDF', () => {
    render(<Resume />)
    const dl = screen.getByRole('link', { name: /download/i })
    expect(dl).toHaveAttribute('href', '/vraj-desai-resume.pdf')
  })
})
