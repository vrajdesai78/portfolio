import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ThemeToggle from './ThemeToggle'

beforeEach(() => localStorage.clear())

describe('ThemeToggle', () => {
  it('defaults to System and cycles to Light on click', () => {
    render(<ThemeToggle />)
    const btn = screen.getByRole('button')
    expect(btn).toHaveTextContent('System')
    fireEvent.click(btn)
    expect(btn).toHaveTextContent('Light')
    expect(localStorage.getItem('theme')).toBe('light')
  })
})
