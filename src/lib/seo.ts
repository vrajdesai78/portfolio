import { site } from '../config/site'
import { ogImagePath } from './og'

export interface SeoInput {
  title: string; description: string; path: string;
  ogType?: 'website' | 'article'; image?: string;
}
export interface SeoTags {
  title: string; description: string; canonical: string;
  ogTitle: string; ogDescription: string; ogType: string; ogUrl: string; ogImage: string;
  twitterCard: string;
}

const abs = (p: string) => `${site.baseUrl}${p.startsWith('/') ? p : `/${p}`}`

export function buildSeo(input: SeoInput): SeoTags {
  const url = abs(input.path)
  return {
    title: input.title,
    description: input.description,
    canonical: url,
    ogTitle: input.title,
    ogDescription: input.description,
    ogType: input.ogType ?? 'website',
    ogUrl: url,
    ogImage: input.image ?? abs(ogImagePath(input.path)),
    twitterCard: 'summary_large_image',
  }
}

export function personJsonLd(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: site.name,
    url: site.baseUrl,
    email: `mailto:${site.email}`,
    sameAs: site.socials.filter((s) => s.label !== 'Email').map((s) => s.href),
  }
}
