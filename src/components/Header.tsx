import { Link, NavLink } from 'react-router-dom'
import { site } from '../config/site'
import Container from './Container'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  return (
    <header className="border-b border-border">
      <Container wide>
        <nav className="flex items-center justify-between h-14">
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
