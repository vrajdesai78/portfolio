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
    'Forward deployed engineer. Guided Jupiter, Backpack, and MetaMask through WalletConnect integrations; co-founded MetEngine — $114M+ volume, 8.5K+ users.',
  availability:
    "I'm currently looking for my next role — forward deployed or solutions engineering, working directly with customers on their integrations.",
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
