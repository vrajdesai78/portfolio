// src/pages/Resume.tsx
import { site } from '../config/site'
import Container from '../components/Container'
import Section from '../components/Section'
import Seo from '../components/Seo'

export function Component() {
  return (
    <Container wide>
      <Seo title={`Resume — ${site.name}`} description="Vraj Desai — resume / CV." path="/resume" />
      <Section title="Resume">
        <a href={site.resumePath} download className="font-mono text-sm border border-border px-4 py-2 inline-block hover:border-accent hover:text-accent">Download PDF ↓</a>
        <div className="mt-6 border border-border">
          <object data={site.resumePath} type="application/pdf" className="w-full h-[80vh]" aria-label="Resume PDF">
            <p className="p-4 text-muted">Your browser can't display PDFs. <a className="text-accent" href={site.resumePath}>Get the PDF</a>.</p>
          </object>
        </div>
      </Section>
    </Container>
  )
}
