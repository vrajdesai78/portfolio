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
      eyebrow: site.role.toUpperCase(),
      title: site.name,
      subtitle: 'MetEngine · WalletConnect · Huddle01',
      metric: '$114M+ volume · 8.5K+ users',
    },
    { path: '/resume', eyebrow: 'RESUME', title: site.name, subtitle: site.role },
  ]
}
