export interface TimelineEntry { org: string; role: string; period: string; points: string[] }
export interface SkillGroupData { label: string; items: string[] }

export const bio: string[] = [
  "I’m an engineer and builder. As Co-Founder & CTO of MetEngine, I led the backend end-to-end — high-throughput data pipelines and real-time analytics on Solana, and a zero-slot-latency automated copy-LPing experience that drove $4.3M+ in yield for 8.5K+ users and scaled total volume past $114M+. I also built x402/MPP data APIs (Polymarket, Hyperliquid, market making; 6,000+ txns) and a Chrome extension with 2,500+ peak downloads.",
  "Before MetEngine I worked in developer relations at the edge of the wallet and media ecosystems — at WalletConnect (WalletKit), partnering with Jupiter, Backpack, and MetaMask on Solana support and the WalletConnect Certified initiative; and at Huddle01, where I drove 200+ projects onto the SDKs and built FarHouse, a Farcaster audio-spaces client that reached 30K+ users. I got my start in open source as a Google Summer of Code ’22 contributor to the Oppia Foundation.",
  "I’m a serial hackathon winner (30+ wins, ETHGlobal Finalist, Colosseum Accelerator Cohort 3) and have spoken at 25+ conferences.",
]

export const timeline: TimelineEntry[] = [
  { org: 'MetEngine', role: 'Co-Founder & CTO', period: 'Feb 2025 – Jun 2026', points: [
    'Led the backend end-to-end: high-throughput data pipelines and real-time analytics on Solana.',
    'Built zero-slot-latency automated copy-LPing → $4.3M+ yield, 8.5K+ users, $114M+ volume.',
    'Built x402 + MPP data APIs for Polymarket, Hyperliquid, and market making (6,000+ txns).',
    'Shipped a Chrome extension (2,500+ peak downloads) with richer analytics.',
  ] },
  { org: 'WalletConnect', role: 'DevRel Engineer (WalletKit)', period: 'Nov 2024 – May 2025', points: [
    'Worked with Jupiter, Backpack, and MetaMask on WalletConnect integration with Solana support.',
    'Wrote docs, guides, and sample apps; helped onboard wallets to the WalletConnect Certified initiative.',
  ] },
  { org: 'Huddle01', role: 'DevRel Engineer', period: 'Apr 2023 – Aug 2024', points: [
    'Docs, blogs, sample apps, and SDK contributions → 200+ projects built on Huddle01.',
    'Built FarHouse (30K+ MAUs); grew the Discord community from 2K to 13K+.',
  ] },
  { org: 'Google Summer of Code ‘22', role: 'Open-Source Contributor, Oppia Foundation', period: '2022', points: [
    'Merged 30+ PRs improving accessibility in the Oppia Android app.',
  ] },
]

export const skills: SkillGroupData[] = [
  { label: 'Languages', items: ['TypeScript', 'JavaScript', 'Solidity', 'Python', 'Rust (familiar)'] },
  { label: 'Backend', items: ['Node.js', 'PostgreSQL', 'Supabase', 'Firebase', 'Redis', 'AWS', 'Clickhouse'] },
  { label: 'Web3', items: ['Solana', 'EVM', 'Ethers.js', 'Web3.js', 'solanakit', 'Wagmi/Viem', 'Dune'] },
  { label: 'DevRel & Solutions', items: ['Technical docs', 'SDK integration', 'Sample apps & demos', 'Community & speaking'] },
]

export const achievements: string[] = [
  '2nd prize, DeFi track, Colosseum Breakout Hackathon; selected for Colosseum Accelerator Cohort 3 (YC for Solana).',
  'ETHGlobal Finalist; winner of 30+ hackathons; builder grants from Base and Superteam.',
  'Speaker at 25+ conferences; mentor at ETHIndia and HackFS.',
]
