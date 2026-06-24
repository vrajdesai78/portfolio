import '@testing-library/jest-dom'
import { vi } from 'vitest'

vi.mock('vite-react-ssg', () => ({
  Head: ({ children }: { children?: unknown }) => children,
}))

// jsdom does not implement window.matchMedia; stub it for all tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
})
