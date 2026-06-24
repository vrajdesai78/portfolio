import { Link } from 'react-router-dom'
import Container from '../components/Container'
import Seo from '../components/Seo'
import { site } from '../config/site'

export function Component() {
  return (
    <Container>
      <Seo title="404 — Not found · Vraj Desai" description="Page not found." path="/404" image={`${site.baseUrl}/og/home.png`} />
      <div className="py-24 text-center">
        <p className="font-mono text-5xl">404</p>
        <p className="text-muted mt-3">That page doesn't exist.</p>
        <Link to="/" className="font-mono text-sm text-accent hover:underline mt-6 inline-block">← Home</Link>
      </div>
    </Container>
  )
}
