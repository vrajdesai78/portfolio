export interface Social { label: string; href: string }
export interface SiteConfig {
  name: string; role: string; roleLine: string; statusLine: string; tagline: string;
  availability: string;
  location: string; email: string; baseUrl: string; resumePath: string;
  socials: Social[];
}

export const site: SiteConfig = {
  name: 'Vraj Desai',
  role: 'Forward Deployed Engineer',
  roleLine: 'forward deployed engineer',
  statusLine: 'available for deployment',
  tagline:
    'Forward deployed engineer. Co-founded MetEngine (Colosseum-backed) — $114M+ volume, 8.5K+ users. Worked with Jupiter, Backpack, and MetaMask at WalletConnect.',
  availability:
    "I'm currently looking for my next role — forward deployed or solutions engineering.",
  location: 'Vadodara, India (UTC+5:30)',
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
