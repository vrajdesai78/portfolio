export interface Social { label: string; href: string }
export interface SiteConfig {
  name: string; role: string; roleLine: string; tagline: string; availability: string;
  email: string; baseUrl: string; resumePath: string;
  socials: Social[];
}

export const site: SiteConfig = {
  name: 'Vraj Desai',
  role: 'Backend & Solutions Engineer',
  roleLine: 'backend & solutions engineer',
  tagline:
    'Backend & solutions engineer. Co-founded MetEngine — $114M+ volume, 8.5K+ users. Previously WalletConnect and Huddle01. Looking for my next role.',
  availability:
    "I'm currently looking for my next role — solutions engineering, DevRel, or backend.",
  email: 'vrajdesai78@gmail.com',
  baseUrl: 'https://vrajdesai.dev',
  resumePath: '/vraj-desai-resume.pdf',
  socials: [
    { label: 'GitHub', href: 'https://github.com/vrajdesai78' },
    { label: 'X', href: 'https://x.com/vrajdesai78' },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/vrajdesai78' },
    { label: 'Email', href: 'mailto:vrajdesai78@gmail.com' },
  ],
}
