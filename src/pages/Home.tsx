import { Link } from 'react-router-dom'
import { site } from '../config/site'
import { work, projectsData, achievements, skills } from '../data/content'
import { boldify } from '../lib/text'
import { personJsonLd } from '../lib/seo'
import Container from '../components/Container'
import Section from '../components/Section'
import Seo from '../components/Seo'
import WorkItem from '../components/WorkItem'
import ProjectItem from '../components/ProjectItem'

const linkClass =
  'underline decoration-border underline-offset-4 transition-colors duration-150 hover:decoration-accent hover:text-accent'

export function Component() {
  return (
    <Container>
      <Seo title={site.name} description={site.tagline} path="/" jsonLd={personJsonLd()} />
      <div className="space-y-14 py-14">
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

          <p className="mt-4 font-mono text-xs lowercase tracking-[0.14em]">
            <span aria-hidden="true" className="mr-2 inline-block h-2 w-2 animate-pulse rounded-full bg-accent" />
            <span className="text-accent">{site.statusLine}</span>
          </p>

          <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-muted">
            <p>
              I spent the last 18 months co-founding{' '}
              <a href="https://metengine.xyz" target="_blank" rel="noopener noreferrer" className={`text-fg ${linkClass}`}>
                MetEngine
              </a>
              , a DeFi product on Solana that automates copy-LPing and yield strategies — we grew it
              to {boldify('**10K+** users and **$114M+** in volume processed')}. I decided to leave
              in June. Before that I was at WalletConnect, working directly with{' '}
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
          <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs lowercase text-muted">
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

        <Section cmd="deployments --log" stagger={1}>
          <div className="space-y-5">
            {work.map((w) => <WorkItem key={w.org} entry={w} />)}
          </div>
        </Section>

        <Section cmd="projects" stagger={2}>
          <div className="space-y-6">
            {projectsData.map((p) => <ProjectItem key={p.name} project={p} />)}
          </div>
        </Section>

        <Section cmd="achievements" stagger={3}>
          <ul className="space-y-2">
            {achievements.map((a, i) => (
              <li
                key={i}
                className="relative pl-4 text-[15px] leading-relaxed text-muted before:absolute before:left-0 before:content-['–']"
              >
                {boldify(a)}
              </li>
            ))}
          </ul>
        </Section>

        <Section cmd="skills" stagger={4}>
          <dl className="space-y-2 text-[15px] leading-relaxed">
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
