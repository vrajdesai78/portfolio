// src/pages/Projects.tsx
import { site } from '../config/site'
import { projects } from '../lib/content'
import Container from '../components/Container'
import Section from '../components/Section'
import Seo from '../components/Seo'
import ProjectCard from '../components/ProjectCard'

export function Component() {
  return (
    <Container wide>
      <Seo title={`Projects — ${site.name}`} description="Shipped products across Solana, Farcaster, and Base." path="/projects" />
      <Section title="Projects">
        <div className="grid sm:grid-cols-2 gap-4">
          {projects.map((p) => <ProjectCard key={p.slug} project={p} />)}
        </div>
      </Section>
    </Container>
  )
}
