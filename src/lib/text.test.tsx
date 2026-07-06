import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { boldify } from './text'

describe('boldify', () => {
  it('renders **segments** as <strong>', () => {
    render(<p>{boldify('drove **$4.3M+** in yield')}</p>)
    const strong = screen.getByText('$4.3M+')
    expect(strong.tagName).toBe('STRONG')
  })
  it('renders plain text unchanged when no markers', () => {
    render(<p>{boldify('no metrics here')}</p>)
    expect(screen.getByText('no metrics here')).toBeInTheDocument()
  })
  it('handles multiple bold segments', () => {
    render(<p>{boldify('**8.5K+** users and **$114M+** volume')}</p>)
    expect(screen.getByText('8.5K+').tagName).toBe('STRONG')
    expect(screen.getByText('$114M+').tagName).toBe('STRONG')
  })
})
