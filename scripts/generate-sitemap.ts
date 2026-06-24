import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { buildSitemap } from './sitemap'
import { listRoutes } from './content-fs'
import { site } from '../src/config/site'

const xml = buildSitemap(listRoutes().map((r) => r.path), site.baseUrl)
writeFileSync(join('dist', 'sitemap.xml'), xml)
console.log('sitemap.xml written')
