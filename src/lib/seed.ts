import { supabase } from './supabase'

const SEED_SKILLS = [
  {
    title: 'Anchor Smart Contract Audit',
    cat: 'security',
    description: 'Full security audit of your Anchor program. Detailed vulnerability report with severity levels and fix recommendations. Includes re-audit after fixes.',
    price: 2.5,
    tags: ['anchor', 'rust', 'audit', 'solana'],
    seller: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
  },
  {
    title: 'Web3 Landing Page — Next.js',
    cat: 'frontend',
    description: 'Premium landing page for your Web3 project. Wallet connect integration, custom animations, responsive. Delivered in 3 days.',
    price: 1.2,
    tags: ['nextjs', 'react', 'wagmi', 'tailwind'],
    seller: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
  },
  {
    title: 'Jupiter DEX Trading Bot',
    cat: 'trading',
    description: 'Automated trading bot on Jupiter aggregator. DCA + grid trading strategy. Includes setup guide and 30-day support.',
    price: 3.0,
    tags: ['jupiter', 'dex', 'bot', 'typescript'],
    seller: 'FwENLkAFMhMwkBQJTy7bQhRRXxLknH7FZbSFJV6UMgQk',
  },
  {
    title: '10k Generative NFT Collection',
    cat: 'nft',
    description: 'Full generative NFT collection — 10,000 unique pieces with weighted traits. Metaplex metadata + IPFS upload included.',
    price: 5.0,
    tags: ['metaplex', 'generative', 'ipfs', 'candy-machine'],
    seller: '3FZbgi29cpjq2GjdwV8eyHuJJnkLtktZc5oDezEBTn87',
  },
  {
    title: 'Web3 Growth Strategy',
    cat: 'marketing',
    description: 'Full go-to-market strategy for Solana projects. Twitter growth, Discord setup, KOL partnerships, community playbook. Deployed on 5+ live projects.',
    price: 0.8,
    tags: ['twitter', 'discord', 'kol', 'community'],
    seller: 'BrEqc6zHVR99qZmGkBpLXWDrTFHXvfY8JDpfXBMVNW5G',
  },
  {
    title: 'Raydium CLMM LP Setup',
    cat: 'defi',
    description: 'Full liquidity pool setup on Raydium Concentrated Liquidity. Optimal range strategy + fee tier selection + rebalancing guide.',
    price: 1.5,
    tags: ['raydium', 'clmm', 'defi', 'lp'],
    seller: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJe1b55',
  },
  {
    title: 'Solana dApp UI Kit — Figma',
    cat: 'design',
    description: 'Complete Figma UI kit for Solana dApps. 80+ components, dark/light themes, wallet modal, token lists, charts. Auto layout + variables.',
    price: 0.6,
    tags: ['figma', 'ui-kit', 'design-system', 'components'],
    seller: 'DRiP2Pn2K6fuMLKQmt5rZWyHiUZ6WK3GChEySUpHSS4',
  },
  {
    title: 'Tokenomics Model + Whitepaper',
    cat: 'writing',
    description: 'Professional tokenomics design and whitepaper writing. Supply schedule, vesting, incentive mechanisms, full economic model. PDF + Notion delivered.',
    price: 2.0,
    tags: ['tokenomics', 'whitepaper', 'economics'],
    seller: 'So11111111111111111111111111111111111111112',
  },
]

export async function seedIfEmpty() {
  const { count } = await supabase
    .from('skills')
    .select('*', { count: 'exact', head: true })
  if ((count ?? 0) === 0) {
    await supabase.from('skills').insert(SEED_SKILLS)
  }
}
