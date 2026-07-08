import { join } from 'node:path'
import { Document, Font, Link, Page, StyleSheet, Text, View, renderToFile } from '@react-pdf/renderer'
import { site } from '../src/config/site'
import { achievements, education, projectsData, skills, work } from '../src/data/content'

const interDir = join('scripts', 'resume-fonts')
const monoDir = join('scripts', 'og-fonts')
Font.register({
  family: 'Inter',
  fonts: [
    { src: join(interDir, 'Inter_400Regular.ttf'), fontWeight: 400 },
    { src: join(interDir, 'Inter_600SemiBold.ttf'), fontWeight: 600 },
    { src: join(interDir, 'Inter_700Bold.ttf'), fontWeight: 700 },
  ],
})
Font.register({
  family: 'JetBrains Mono',
  fonts: [
    { src: join(monoDir, 'JetBrainsMono-Regular.ttf'), fontWeight: 400 },
    { src: join(monoDir, 'JetBrainsMono-Bold.ttf'), fontWeight: 700 },
  ],
})
Font.registerHyphenationCallback((word) => [word])

const ACCENT = '#0e9f6e'

const s = StyleSheet.create({
  page: { fontFamily: 'Inter', fontSize: 9.5, color: '#1a1a1a', paddingVertical: 20, paddingHorizontal: 38 },
  name: { fontFamily: 'JetBrains Mono', fontSize: 17, fontWeight: 700, textAlign: 'center', lineHeight: 1.2 },
  contact: { fontSize: 9, color: '#3a3a3a', textAlign: 'center', marginTop: 4, lineHeight: 1.4 },
  status: { fontFamily: 'JetBrains Mono', fontSize: 7.5, letterSpacing: 1, color: '#555555', textAlign: 'center', marginTop: 3, lineHeight: 1.3 },
  statusDot: { color: ACCENT },
  link: { color: '#1a1a1a', textDecoration: 'none' },
  section: { fontFamily: 'JetBrains Mono', fontSize: 9, fontWeight: 700, letterSpacing: 1.2, lineHeight: 1.2, marginTop: 6, marginBottom: 3, paddingBottom: 2, borderBottomWidth: 1, borderBottomColor: ACCENT },
  entryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 4 },
  org: { fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 700, lineHeight: 1.3 },
  orgRole: { fontFamily: 'Inter', fontSize: 9.5, fontWeight: 400, color: '#3a3a3a' },
  period: { fontFamily: 'JetBrains Mono', fontSize: 8, color: '#555555', lineHeight: 1.3 },
  fieldRow: { fontFamily: 'JetBrains Mono', fontSize: 7.5, letterSpacing: 0.6, marginTop: 2, lineHeight: 1.3 },
  fieldLabel: { color: ACCENT },
  fieldValue: { color: '#1a1a1a' },
  bulletRow: { flexDirection: 'row', marginTop: 2 },
  bulletMark: { width: 10, fontSize: 9.25, lineHeight: 1.3 },
  bulletText: { flex: 1, fontSize: 9.25, color: '#2a2a2a', lineHeight: 1.3 },
  strong: { fontWeight: 600, color: '#111111' },
  projectName: { fontFamily: 'JetBrains Mono', fontSize: 9.5, fontWeight: 700 },
  projectOneliner: { fontSize: 9.25, fontWeight: 400, color: '#2a2a2a' },
  skillRow: { marginTop: 2, fontSize: 9.25, lineHeight: 1.3 },
})

const bold = (text: string) =>
  text.split(/\*\*(.+?)\*\*/).map((part, i) => (i % 2 === 1 ? <Text key={i} style={s.strong}>{part}</Text> : part))

const contactParts = [
  { label: site.email, href: `mailto:${site.email}` },
  ...site.socials
    .filter((so) => so.label !== 'Email')
    .map((so) => ({ label: so.href.replace('https://', ''), href: so.href })),
]

const FieldLine = ({ label, values }: { label: string; values: string[] }) => (
  <Text style={s.fieldRow}>
    <Text style={s.fieldLabel}>{label.toUpperCase()}  </Text>
    <Text style={s.fieldValue}>{values.join(' · ').toLowerCase()}</Text>
  </Text>
)

const Resume = () => (
  <Document
    title={`${site.name} · Resume`}
    author={site.name}
    subject="Resume"
    creator={site.baseUrl}
  >
    <Page size="LETTER" style={s.page}>
      <Text style={s.name}>{site.name}</Text>
      <Text style={s.contact}>
        {contactParts.map((c, i) => (
          <Text key={c.href}>
            {i > 0 ? '  |  ' : ''}
            <Link src={c.href} style={s.link}>{c.label}</Link>
          </Text>
        ))}
      </Text>
      <Text style={s.status}>
        <Text style={s.statusDot}>● </Text>
        {site.statusLine.toUpperCase()} · {site.location.toUpperCase()}
      </Text>

      <Text style={s.section}>EXPERIENCE</Text>
      {work.map((w) => (
        <View key={w.org}>
          <View style={s.entryRow}>
            <Text style={s.org}>
              {w.url ? <Link src={w.url} style={s.link}>{w.org}</Link> : w.org}
              <Text style={s.orgRole}>  ·{w.role}</Text>
            </Text>
            <Text style={s.period}>{w.period}</Text>
          </View>
          {w.clients && <FieldLine label="clients" values={w.clients} />}
          {w.stack && <FieldLine label="stack" values={w.stack} />}
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
        <View key={p.name} style={{ marginTop: 2 }} wrap={false}>
          <Text>
            <Text style={s.projectName}>
              {p.url ? <Link src={p.url} style={s.link}>{p.name}</Link> : p.name}
            </Text>
            <Text style={s.projectOneliner}>  ·{bold(p.oneliner)}</Text>
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
