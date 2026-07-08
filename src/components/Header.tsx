import type { MouseEvent } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Container from './Container'
import ThemeToggle from './ThemeToggle'
import { SECTIONS, scrollToSection } from '../lib/scroll'

const linkClass =
  'font-mono text-xs lowercase tracking-wider text-muted transition-colors duration-150 hover:text-accent'

export default function Header() {
  const onHome = useLocation().pathname === '/'

  // Native hash navigation races SSG hydration and the router resets scroll,
  // so drive the scroll directly and update the hash without a history event.
  const jump = (id: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    if (!scrollToSection(id)) return
    e.preventDefault()
    window.history.replaceState(null, '', `#${id}`)
  }

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-bg/85 backdrop-blur">
      <Container>
        <nav aria-label="Main navigation" className="flex items-center justify-between gap-4 py-4">
          <Link to="/" className="font-mono text-sm text-muted transition-colors duration-150 hover:text-accent">
            vrajdesai.dev
          </Link>
          <div className="flex items-center gap-5">
            {onHome && (
              <ul className="hidden items-center gap-5 sm:flex">
                {SECTIONS.map((s) => (
                  <li key={s}>
                    <a href={`#${s}`} onClick={jump(s)} className={linkClass}>{s}</a>
                  </li>
                ))}
              </ul>
            )}
            <Link to="/resume" className={linkClass}>resume</Link>
            <ThemeToggle />
          </div>
        </nav>
      </Container>
    </header>
  )
}
