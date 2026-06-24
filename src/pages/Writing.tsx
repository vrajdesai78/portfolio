import { Link } from 'react-router-dom'
import { site } from '../config/site'
import { posts } from '../lib/content'
import Container from '../components/Container'
import Section from '../components/Section'
import Seo from '../components/Seo'

export function Component() {
  return (
    <Container>
      <Seo title={`Writing — ${site.name}`} description="Notes on building in public, crypto, and AI." path="/writing" />
      <Section title="Writing">
        {posts.length === 0 ? (
          <p className="text-muted">First posts coming soon.</p>
        ) : (
          <ul className="divide-y divide-border">
            {posts.map((p) => (
              <li key={p.slug} className="py-4">
                <Link to={`/writing/${p.slug}`} className="font-mono hover:text-accent">{p.frontmatter.title}</Link>
                <p className="text-sm text-muted mt-1">{p.frontmatter.summary}</p>
                <time className="font-mono text-xs text-muted">{p.frontmatter.date}</time>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </Container>
  )
}
