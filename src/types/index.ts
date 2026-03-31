export interface Skill {
  id: string
  title: string
  cat: Category
  description: string
  price: number
  tags: string[]
  seller: string
  created_at: string
}

export interface Purchase {
  id: string
  skill_id: string
  buyer: string
  tx_id: string
  price: number
  created_at: string
}

export type Category =
  | 'smart'
  | 'frontend'
  | 'design'
  | 'marketing'
  | 'trading'
  | 'defi'
  | 'nft'
  | 'security'
  | 'writing'
  | 'data'

export type Tab = 'all' | 'mine' | 'purchases'
export type Sort = 'newest' | 'price_asc' | 'price_desc'

export interface Toast {
  id: number
  message: string
  type: 'success' | 'error' | 'info'
}

export const CATEGORIES: { id: Category | 'all'; label: string; emoji: string }[] = [
  { id: 'all',       label: 'All',             emoji: '✦'  },
  { id: 'smart',     label: 'Smart Contracts', emoji: '🔒' },
  { id: 'frontend',  label: 'Frontend',        emoji: '💻' },
  { id: 'design',    label: 'Design',          emoji: '🎨' },
  { id: 'marketing', label: 'Marketing',       emoji: '📣' },
  { id: 'trading',   label: 'Trading',         emoji: '📈' },
  { id: 'defi',      label: 'DeFi',            emoji: '🏦' },
  { id: 'nft',       label: 'NFT',             emoji: '🖼️' },
  { id: 'security',  label: 'Security',        emoji: '🛡️' },
  { id: 'writing',   label: 'Writing',         emoji: '✍️' },
  { id: 'data',      label: 'Data',            emoji: '📊' },
]
