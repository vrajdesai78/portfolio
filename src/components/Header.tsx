import { Link } from 'react-router-dom'
import Container from './Container'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  return (
    <header>
      <Container>
        <nav aria-label="Main navigation" className="flex items-center justify-between py-6">
          <Link to="/" className="font-mono text-sm text-muted transition-colors duration-150 hover:text-accent">
            vrajdesai.dev
          </Link>
          <div className="flex items-center gap-5">
            <Link
              to="/resume"
              className="font-mono text-xs lowercase tracking-wider text-muted transition-colors duration-150 hover:text-accent"
            >
              resume
            </Link>
            <ThemeToggle />
          </div>
        </nav>
      </Container>
    </header>
  )
}
