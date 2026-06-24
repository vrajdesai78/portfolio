import { Link } from 'react-router-dom'
import { site } from '../config/site'
import { featuredProjects } from '../lib/content'
import { personJsonLd } from '../lib/seo'
import Container from '../components/Container'
import Section from '../components/Section'
import Seo from '../components/Seo'
import StatStrip from '../components/StatStrip'
import ProjectCard from '../components/ProjectCard'

export function Component() {
  return (
    <Container wide>
      <Seo title={`${site.name} — ${site.role}`} description={site.tagline} path="/" jsonLd={personJsonLd()} />
      <section className="py-16">
        <h1 className="font-mono text-4xl sm:text-5xl tracking-tight">{site.name}</h1>
        <p className="text-lg text-muted mt-4 max-w-2xl">{site.tagline}</p>
        <div className="flex flex-wrap gap-3 mt-8">
          <Link to="/projects" className="font-mono text-sm border border-border px-4 py-2 hover:border-accent hover:text-accent">View Projects</Link>
          <Link to="/resume" className="font-mono text-sm border border-border px-4 py-2 hover:border-accent hover:text-accent">Resume</Link>
          <a href="https://github.com/vrajdesai78" target="_blank" rel="noopener noreferrer" className="font-mono text-sm border border-border px-4 py-2 hover:border-accent hover:text-accent">GitHub ↗</a>
        </div>
        <div className="mt-10"><StatStrip stats={site.stats} /></div>
      </section>

      <Section title="Featured">
        <div className="grid sm:grid-cols-2 gap-4">
          {featuredProjects.map((p) => <ProjectCard key={p.slug} project={p} />)}
          <article className="border border-dashed border-border p-5 flex flex-col justify-center">
            <h3 className="font-mono text-lg">AI — building in public</h3>
            <p className="text-sm text-muted mt-1">7-day-sprint AI demos are shipping here soon.</p>
            <Link to="/projects" className="font-mono text-xs uppercase tracking-wider text-accent mt-4 hover:underline">See all projects →</Link>
          </article>
        </div>
      </Section>

      <Section title="Currently">
        <p className="text-muted">{site.currently}</p>
      </Section>
    </Container>
  )
}
