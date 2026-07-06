import { site } from '../config/site'
import Container from './Container'

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-border py-10">
      <Container>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="font-mono text-xs text-muted">© {site.name}</p>
          <ul className="flex flex-wrap gap-4">
            {site.socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target={s.href.startsWith('mailto:') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  className="font-mono text-xs lowercase tracking-wider text-muted transition-colors duration-150 hover:text-accent"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  )
}
