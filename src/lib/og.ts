export interface OgCard { eyebrow: string; title: string; subtitle?: string; metric?: string }
export interface OgCardInput { eyebrow: string; title: string; subtitle?: string; metric?: string }

export function ogImagePath(path: string): string {
  if (path === '/') return '/og/home.png'
  const slug = path.replace(/^\/+/, '').replace(/\/+$/, '').replace(/\//g, '-')
  return `/og/${slug}.png`
}

export function ogCard(input: OgCardInput): OgCard {
  return { eyebrow: input.eyebrow, title: input.title, subtitle: input.subtitle, metric: input.metric }
}
