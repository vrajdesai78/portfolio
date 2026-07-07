import { join } from 'node:path'
import { Document, Font, Link, Page, StyleSheet, Text, View, renderToFile } from '@react-pdf/renderer'
import { site } from '../src/config/site'
import { achievements, education, projectsData, skills, work } from '../src/data/content'

const fontDir = join('scripts', 'resume-fonts')
Font.register({
  family: 'Inter',
  fonts: [
    { src: join(fontDir, 'Inter_400Regular.ttf'), fontWeight: 400 },
    { src: join(fontDir, 'Inter_600SemiBold.ttf'), fontWeight: 600 },
    { src: join(fontDir, 'Inter_700Bold.ttf'), fontWeight: 700 },
  ],
})
Font.registerHyphenationCallback((word) => [word])

const s = StyleSheet.create({
  page: { fontFamily: 'Inter', fontSize: 9.5, color: '#1a1a1a', paddingVertical: 24, paddingHorizontal: 38 },
  name: { fontSize: 19, fontWeight: 700, textAlign: 'center', lineHeight: 1.2 },
  role: { fontSize: 10.5, fontWeight: 600, color: '#3a3a3a', textAlign: 'center', marginTop: 2, lineHeight: 1.3 },
  contact: { fontSize: 9, color: '#3a3a3a', textAlign: 'center', marginTop: 3, lineHeight: 1.4 },
  link: { color: '#1a1a1a', textDecoration: 'none' },
  section: { fontSize: 10, fontWeight: 700, letterSpacing: 0.8, lineHeight: 1.2, marginTop: 7, marginBottom: 3, paddingBottom: 2, borderBottomWidth: 0.75, borderBottomColor: '#8a8a8a' },
  entryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 4 },
  org: { fontSize: 10.5, fontWeight: 700, lineHeight: 1.3 },
  orgRole: { fontSize: 10, fontWeight: 400, color: '#3a3a3a' },
  period: { fontSize: 9, color: '#555555', lineHeight: 1.3 },
  bulletRow: { flexDirection: 'row', marginTop: 2 },
  bulletMark: { width: 10, fontSize: 9.25, lineHeight: 1.32 },
  bulletText: { flex: 1, fontSize: 9.25, color: '#2a2a2a', lineHeight: 1.32 },
  strong: { fontWeight: 600, color: '#111111' },
  projectName: { fontSize: 10, fontWeight: 700 },
  projectOneliner: { fontSize: 9.25, fontWeight: 400, color: '#2a2a2a' },
  skillRow: { marginTop: 2, fontSize: 9.25, lineHeight: 1.32 },
})

const bold = (text: string) =>
  text.split(/\*\*(.+?)\*\*/).map((part, i) => (i % 2 === 1 ? <Text key={i} style={s.strong}>{part}</Text> : part))

const contactParts = [
  { label: site.email, href: `mailto:${site.email}` },
  ...site.socials
    .filter((so) => so.label !== 'Email')
    .map((so) => ({ label: so.href.replace('https://', ''), href: so.href })),
]

const Resume = () => (
  <Document
    title={`${site.name} — ${site.role}`}
    author={site.name}
    subject={`${site.role} resume`}
    creator={site.baseUrl}
  >
    <Page size="LETTER" style={s.page}>
      <Text style={s.name}>{site.name}</Text>
      <Text style={s.role}>{site.role} · {site.location}</Text>
      <Text style={s.contact}>
        {contactParts.map((c, i) => (
          <Text key={c.href}>
            {i > 0 ? '  |  ' : ''}
            <Link src={c.href} style={s.link}>{c.label}</Link>
          </Text>
        ))}
      </Text>

      <Text style={s.section}>EXPERIENCE</Text>
      {work.map((w) => (
        <View key={w.org}>
          <View style={s.entryRow}>
            <Text style={s.org}>
              {w.url ? <Link src={w.url} style={s.link}>{w.org}</Link> : w.org}
              <Text style={s.orgRole}>  —  {w.role}</Text>
            </Text>
            <Text style={s.period}>{w.period}</Text>
          </View>
          {w.points.map((p, i) => (
            <View key={i} style={s.bulletRow} wrap={false}>
              <Text style={s.bulletMark}>•</Text>
              <Text style={s.bulletText}>{bold(p)}</Text>
            </View>
          ))}
        </View>
      ))}

      <Text style={s.section}>PROJECTS</Text>
      {projectsData.map((p) => (
        <View key={p.name} style={{ marginTop: 3 }} wrap={false}>
          <Text>
            <Text style={s.projectName}>
              {p.url ? <Link src={p.url} style={s.link}>{p.name}</Link> : p.name}
            </Text>
            <Text style={s.projectOneliner}>  —  {bold(p.oneliner)}</Text>
          </Text>
          <View style={s.bulletRow}>
            <Text style={s.bulletMark}>•</Text>
            <Text style={s.bulletText}>{bold(p.award)}</Text>
          </View>
        </View>
      ))}

      <Text style={s.section}>SKILLS</Text>
      {skills.map((g) => (
        <Text key={g.label} style={s.skillRow}>
          <Text style={s.strong}>{g.label}: </Text>
          <Text style={{ color: '#2a2a2a' }}>{g.items.join(', ')}</Text>
        </Text>
      ))}

      <Text style={s.section}>ACHIEVEMENTS</Text>
      {achievements.map((a, i) => (
        <View key={i} style={s.bulletRow} wrap={false}>
          <Text style={s.bulletMark}>•</Text>
          <Text style={s.bulletText}>{bold(a)}</Text>
        </View>
      ))}

      {education.length > 0 && (
        <>
          <Text style={s.section}>EDUCATION</Text>
          {education.map((e, i) => (
            <View key={i} style={s.bulletRow} wrap={false}>
              <Text style={s.bulletMark}>•</Text>
              <Text style={s.bulletText}>{bold(e)}</Text>
            </View>
          ))}
        </>
      )}
    </Page>
  </Document>
)

const out = join('public', site.resumePath.replace(/^\//, ''))
renderToFile(<Resume />, out).then(() => console.log('resume:', out))
