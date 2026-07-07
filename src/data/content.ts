export interface WorkEntry { org: string; url?: string; role: string; period: string; points: string[] }
export interface ProjectEntry { name: string; url?: string; oneliner: string; award: string }
export interface SkillGroupData { label: string; items: string[] }

export const work: WorkEntry[] = [
  {
    org: 'MetEngine', url: 'https://metengine.xyz', role: 'Co-Founder & CTO',
    period: 'Feb 2025 – Jun 2026',
    points: [
      'Built an automated copy-LPing engine on Solana that drove **$4.3M+** in yield for **8.5K+** users and scaled total volume past **$114M+**.',
      'Led the backend end-to-end: high-throughput data pipelines and real-time analytics on Solana (Node.js, ClickHouse, Redis) in production on AWS, with a real-time indexer across Meteora and other DeFi protocols.',
      'Built x402-metered data APIs serving Polymarket, Hyperliquid, and market-making feeds, plus a Chrome extension with richer trading analytics.',
      'Raised **$375K** pre-seed from Colosseum, Balaji Srinivasan, and MonkeFoundry; drove the product 0 → 1 across architecture, hiring, and go-to-market.',
    ],
  },
  {
    org: 'WalletConnect', role: 'DevRel / Solutions Engineer, WalletKit',
    period: 'Nov 2024 – May 2025',
    points: [
      'Embedded with **Jupiter, Backpack, and MetaMask** to integrate WalletKit and add Solana support, debugging their integrations directly.',
      'Technical point of contact for wallet clients — triaged issues, reproduced bugs, and turned customer feedback into product fixes.',
      'Wrote docs, integration guides, and sample apps; onboarded wallets to WalletConnect Certified.',
    ],
  },
  {
    org: 'Huddle01', role: 'DevRel Engineer',
    period: 'Apr 2023 – Aug 2024',
    points: [
      'Drove **200+** projects to integrate the SDK through docs, sample apps, and hands-on support; contributed to the core SDKs.',
      'Built FarHouse, an audio-spaces client on Farcaster with in-app tipping — **30K+** MAUs; grew the Discord community from 2K to **13K+**.',
    ],
  },
  {
    org: "Google Summer of Code '22", role: 'Open-Source Contributor, Oppia Foundation',
    period: '2022',
    points: [
      'Merged **30+** PRs improving accessibility in the Oppia Android app.',
    ],
  },
]

export const projectsData: ProjectEntry[] = [
  {
    name: 'Stackit',
    oneliner: 'Theme-based investable baskets of tokens with fund analytics and referrals.',
    award: 'Won **2nd prize** at Solana Hacker House; received a Superteam grant.',
  },
  {
    name: 'Farview.id',
    url: 'https://github.com/vrajdesai78/Farview.id',
    oneliner: 'Personalized profile pages for Farcaster & Base users — **6K+** users, **12K+** Frame interactions.',
    award: 'Won the **Social track** at Base Onchain Summer Buildathon; Base builder grant.',
  },
  {
    name: 'Capital Finance',
    oneliner: 'Cross-chain yield aggregator on the Superchain, auto-routing funds to the highest yield via Chainlink CCIP.',
    award: 'Won **Best Trading App on Base** and Best Use of Goldsky at ETHGlobal SuperHack.',
  },
  {
    name: 'WiseBets',
    url: 'https://github.com/vrajdesai78/WiseBets',
    oneliner: 'Multi-chain opinion-trading platform with shareable Frames, built on Chainlink CCIP.',
    award: 'Won **zkSync, Polygon & Scroll prizes** at Chainlink Block Magic.',
  },
]

export const achievements: string[] = [
  '**2nd prize**, DeFi track, Colosseum Breakout Hackathon — out of **1,412 projects** from 10K+ builders; selected for **Colosseum Accelerator Cohort 3** (YC for Solana).',
  '**ETHGlobal finalist** and winner of **30+ hackathons**; builder grants from Base and Superteam.',
  'Speaker at **25+ conferences**; mentored at ETHIndia and HackFS.',
]

export const education: string[] = []

export const skills: SkillGroupData[] = [
  { label: 'Languages', items: ['TypeScript', 'JavaScript', 'Solidity', 'Python', 'Rust (familiar)'] },
  { label: 'Backend & Data', items: ['Node.js', 'REST APIs', 'data pipelines & real-time analytics', 'PostgreSQL', 'ClickHouse', 'Redis', 'Supabase', 'Firebase', 'AWS'] },
  { label: 'Web3', items: ['Solana', 'EVM', 'Ethers.js', 'Web3.js', 'SolanaKit', 'Wagmi/Viem', 'WalletConnect', 'Chainlink CCIP', 'Dune'] },
  { label: 'Solutions & Integration', items: ['API & SDK integration', 'integration debugging', 'customer onboarding & support', 'technical docs', 'sample apps & demos', 'community & speaking'] },
]
