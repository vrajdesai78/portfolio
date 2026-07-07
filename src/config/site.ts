export interface Social { label: string; href: string }
export interface SiteConfig {
  name: string; role: string; roleLine: string; tagline: string; availability: string;
  location: string; email: string; baseUrl: string; resumePath: string;
  socials: Social[];
}

export const site: SiteConfig = {
  name: 'Vraj Desai',
  role: 'Solutions & DevRel Engineer',
  roleLine: 'solutions & devrel engineer',
  tagline:
    'Solutions & DevRel engineer. Embedded with Jupiter, Backpack, and MetaMask at WalletConnect. Co-founded MetEngine — $114M+ volume, 8.5K+ users.',
  availability:
    "I'm currently looking for my next role — solutions engineering or DevRel, where I own customer integrations end-to-end and stay close to the backend.",
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
