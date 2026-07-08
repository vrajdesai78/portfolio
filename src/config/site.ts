export interface Social { label: string; href: string }
export interface SiteConfig {
  name: string; statusLine: string; tagline: string;
  availability: string;
  location: string; email: string; baseUrl: string; resumePath: string;
  socials: Social[];
}

export const site: SiteConfig = {
  name: 'Vraj Desai',
  statusLine: 'open to opportunities',
  tagline:
    'Co-founded MetEngine, a DeFi product on Solana with 10K+ users and $114M+ in volume processed. Previously worked with Jupiter, Backpack, and MetaMask at WalletConnect.',
  availability:
    "I'm looking for my next role: something technical and customer-facing, where I build and work closely with the people using it.",
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
