import { readFileSync, existsSync } from 'node:fs'

const checks: { file: string; must: string[] }[] = [
  { file: 'dist/index.html', must: ['<title', 'og:image', 'application/ld+json', 'MetEngine', 'looking for my next role'] },
  { file: 'dist/resume.html', must: ['<title', 'og:image'] },
  { file: 'dist/og/home.png', must: [] },
  { file: 'dist/og/resume.png', must: [] },
  { file: 'dist/sitemap.xml', must: ['<loc>'] },
]

let failed = false
for (const c of checks) {
  if (!existsSync(c.file)) { console.error('MISSING:', c.file); failed = true; continue }
  const html = c.must.length ? readFileSync(c.file, 'utf8') : ''
  for (const token of c.must) {
    if (!html.includes(token)) { console.error(`MISSING "${token}" in ${c.file}`); failed = true }
  }
}
if (failed) { console.error('check-build FAILED'); process.exit(1) }
console.log('check-build OK')
