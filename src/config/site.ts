export interface Social { label: string; href: string }
export interface Stat { value: string; label: string }
export interface NavItem { label: string; path: string }
export interface SiteConfig {
  name: string; role: string; tagline: string; currently: string;
  email: string; baseUrl: string; resumePath: string;
  socials: Social[]; stats: Stat[]; nav: NavItem[];
}

export const site: SiteConfig = {
  name: 'Vraj Desai',
  role: 'Engineer & builder',
  tagline:
    'Engineer & builder. Co-founded a Solana DeFi platform that did $114M+ in volume.',
  currently:
    'Building high-throughput backend and data systems on Solana.',
  email: 'vrajdesai78@gmail.com',
  baseUrl: 'https://vrajdesai.dev',
  resumePath: '/vraj-desai-resume.pdf',
  socials: [
    { label: 'GitHub', href: 'https://github.com/vrajdesai78' },
    { label: 'X', href: 'https://x.com/vrajdesai78' },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/vrajdesai78' },
    { label: 'Email', href: 'mailto:vrajdesai78@gmail.com' },
  ],
  stats: [
    { value: '$114M+', label: 'volume' },
    { value: '8.5K+', label: 'users' },
    { value: '30+', label: 'hackathon wins' },
    { value: 'Colosseum', label: 'accelerator' },
  ],
  nav: [
    { label: 'About', path: '/about' },
    { label: 'Projects', path: '/projects' },
    { label: 'Writing', path: '/writing' },
    { label: 'Resume', path: '/resume' },
  ],
}
