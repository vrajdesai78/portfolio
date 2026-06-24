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
      <Seo title={`Projects — ${site.name}`} description="Shipped products across Solana, Farcaster/Base, and AI." path="/projects" />
      <Section title="Projects">
        <div className="grid sm:grid-cols-2 gap-4">
          {projects.map((p) => <ProjectCard key={p.slug} project={p} />)}
          <article className="border border-dashed border-border p-5 flex flex-col justify-center">
            <h3 className="font-mono text-lg">AI — building in public</h3>
            <p className="text-sm text-muted mt-1">7-day-sprint AI demos land here as they ship. Each will link to a write-up with stack, learnings, and eval results.</p>
          </article>
        </div>
      </Section>
    </Container>
  )
}
