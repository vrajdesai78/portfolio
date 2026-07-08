// src/pages/Resume.tsx
import { site } from '../config/site'
import Container from '../components/Container'
import Section from '../components/Section'
import Seo from '../components/Seo'

export function Component() {
  return (
    <Container>
      <Seo title={`Resume · ${site.name}`} description="Vraj Desai, resume / CV." path="/resume" />
      <div className="py-14">
        <Section title="resume">
          <a
            href={site.resumePath}
            download
            className="font-mono text-sm underline decoration-border underline-offset-4 transition-colors duration-150 hover:decoration-accent hover:text-accent"
          >
            Download PDF ↓
          </a>
          <div className="mt-6 border border-border">
            <object data={site.resumePath} type="application/pdf" className="h-[80vh] w-full" aria-label="Resume PDF">
              <p className="p-4 text-muted">
                Your browser can't display PDFs.{' '}
                <a className="underline underline-offset-4" href={site.resumePath}>Get the PDF</a>.
              </p>
            </object>
          </div>
        </Section>
      </div>
    </Container>
  )
}
