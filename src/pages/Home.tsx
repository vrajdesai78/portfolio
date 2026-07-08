import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { site } from '../config/site'
import { work, projectsData, achievements, skills } from '../data/content'
import { boldify } from '../lib/text'
import { personJsonLd } from '../lib/seo'
import { scrollToSection } from '../lib/scroll'
import Container from '../components/Container'
import Section from '../components/Section'
import Seo from '../components/Seo'
import WorkItem from '../components/WorkItem'
import ProjectItem from '../components/ProjectItem'

const linkClass =
  'underline decoration-border underline-offset-4 transition-colors duration-150 hover:decoration-accent hover:text-accent'

export function Component() {
  // A hash in the initial URL is applied before hydration finishes, landing in the
  // wrong place; re-apply it once the section positions are final.
  useEffect(() => {
    const id = window.location.hash.slice(1)
    if (id) requestAnimationFrame(() => scrollToSection(id, false))
  }, [])

  return (
    <Container>
      <Seo title={site.name} description={site.tagline} path="/" jsonLd={personJsonLd()} />
      <div className="space-y-20 py-16">
        <header className="animate-enter">
          <div className="flex items-center gap-4">
            <img
              src="/vraj-desai.jpg"
              alt="Vraj Desai"
              width={640}
              height={640}
              className="h-14 w-14 rounded-full object-cover"
            />
            <div>
              <h1 className="font-mono text-2xl font-bold lowercase tracking-tight">
                {site.name}
                <span aria-hidden="true" className="animate-blink ml-1.5 inline-block h-[1.05em] w-[0.55ch] translate-y-[0.18em] bg-accent" />
              </h1>
            </div>
          </div>

          <p className="mt-5 font-mono text-xs lowercase tracking-[0.14em]">
            <span aria-hidden="true" className="mr-2 inline-block h-2 w-2 animate-pulse rounded-full bg-accent" />
            <span className="text-accent">{site.statusLine}</span>
          </p>

          <div className="mt-7 space-y-5 text-[15px] leading-7 text-muted">
            <p>
              For the last 18 months I was co-founder and CTO of{' '}
              <a href="https://metengine.xyz" target="_blank" rel="noopener noreferrer" className={`text-fg ${linkClass}`}>
                MetEngine
              </a>
              , a DeFi product on Solana that automates copy-LPing and yield strategies. We took it
              from an idea to {boldify('**10K+** users and **$114M+** in volume processed')}, and
              raised a pre-seed along the way. Before that, at WalletConnect, I worked directly with{' '}
              {boldify('**Jupiter, Backpack, and MetaMask**')} on their WalletKit and Solana
              integrations.
            </p>
            <p className="text-fg">
              {site.availability}{' '}
              <a href={`mailto:${site.email}`} className={linkClass}>
                Get in touch →
              </a>
            </p>
          </div>
          <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2 font-mono text-xs lowercase text-muted">
            {site.socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target={s.href.startsWith('mailto:') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  {s.label}
                </a>
              </li>
            ))}
            <li>
              <Link to="/resume" className={linkClass}>Resume</Link>
            </li>
          </ul>
        </header>

        <Section id="work" cmd="work" stagger={1}>
          <div className="space-y-7">
            {work.map((w) => <WorkItem key={w.org} entry={w} />)}
          </div>
        </Section>

        <Section id="projects" cmd="projects" stagger={2}>
          <div className="space-y-8">
            {projectsData.map((p) => <ProjectItem key={p.name} project={p} />)}
          </div>
        </Section>

        <Section id="achievements" cmd="achievements" stagger={3}>
          <ul className="space-y-3">
            {achievements.map((a, i) => (
              <li
                key={i}
                className="relative pl-4 text-[15px] leading-7 text-muted before:absolute before:left-0 before:content-['–']"
              >
                {boldify(a)}
              </li>
            ))}
          </ul>
        </Section>

        <Section id="skills" cmd="skills" stagger={4}>
          <dl className="space-y-3.5 text-[15px] leading-7">
            {skills.map((g) => (
              <div key={g.label}>
                <dt className="inline font-semibold">{g.label}: </dt>
                <dd className="inline text-muted">{g.items.join(', ')}</dd>
              </div>
            ))}
          </dl>
        </Section>
      </div>
    </Container>
  )
}
