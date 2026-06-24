import { Head } from 'vite-react-ssg'
import { buildSeo, type SeoInput } from '../lib/seo'

interface Props extends SeoInput { jsonLd?: object }

export default function Seo({ jsonLd, ...input }: Props) {
  const t = buildSeo(input)
  return (
    <Head>
      <meta charSet="UTF-8" />
      <title>{t.title}</title>
      <meta name="description" content={t.description} />
      <link rel="canonical" href={t.canonical} />
      <meta property="og:title" content={t.ogTitle} />
      <meta property="og:description" content={t.ogDescription} />
      <meta property="og:type" content={t.ogType} />
      <meta property="og:url" content={t.ogUrl} />
      <meta property="og:image" content={t.ogImage} />
      <meta name="twitter:card" content={t.twitterCard} />
      <meta name="twitter:title" content={t.ogTitle} />
      <meta name="twitter:description" content={t.ogDescription} />
      <meta name="twitter:image" content={t.ogImage} />
      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Head>
  )
}
