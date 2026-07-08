import { site } from '../src/config/site'

export interface RouteMeta {
  path: string
  eyebrow: string
  title: string
  subtitle?: string
  metric?: string
}

export function listRoutes(): RouteMeta[] {
  return [
    {
      path: '/',
      eyebrow: site.statusLine.toUpperCase(),
      title: site.name,
      subtitle: 'MetEngine · WalletConnect · Huddle01',
      metric: '10K+ users · $114M+ volume',
    },
    { path: '/resume', eyebrow: 'RESUME', title: site.name },
  ]
}
