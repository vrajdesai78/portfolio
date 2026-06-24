import { Link, NavLink } from 'react-router-dom'
import { site } from '../config/site'
import Container from './Container'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  return (
    <header className="border-b border-border">
      <Container wide>
        <nav aria-label="Main navigation" className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 min-h-14 py-2">
          <Link to="/" className="font-mono font-semibold tracking-tight">vrajdesai.dev</Link>
          <div className="flex items-center gap-4">
            {site.nav.map((n) => (
              <NavLink key={n.path} to={n.path}
                className={({ isActive }) =>
                  `font-mono text-xs uppercase tracking-wider hover:text-accent ${isActive ? 'text-fg' : 'text-muted'}`}>
                {n.label}
              </NavLink>
            ))}
            <ThemeToggle />
          </div>
        </nav>
      </Container>
    </header>
  )
}
