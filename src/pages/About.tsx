// src/pages/About.tsx
import { site } from '../config/site'
import { bio, timeline, skills, achievements } from '../data/about'
import Container from '../components/Container'
import Section from '../components/Section'
import Seo from '../components/Seo'
import Timeline from '../components/Timeline'
import SkillGroup from '../components/SkillGroup'
import AchievementList from '../components/AchievementList'

export function Component() {
  return (
    <Container>
      <Seo title={`About — ${site.name}`} description="Founder, DevRel, and backend/data engineer." path="/about" />
      <Section title="About">
        {/* TODO(owner): drop a headshot into public/ and add an <img> here (hero/about photo slot). */}
        <div className="space-y-4 text-[15px] leading-relaxed">
          {bio.map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </Section>
      <Section title="Experience"><Timeline entries={timeline} /></Section>
      <Section title="Skills">
        <div>{skills.map((g) => <SkillGroup key={g.label} group={g} />)}</div>
      </Section>
      <Section title="Achievements"><AchievementList items={achievements} /></Section>
    </Container>
  )
}
