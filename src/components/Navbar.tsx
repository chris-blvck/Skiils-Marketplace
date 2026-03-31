'use client'
import type { Tab } from '@/types'
import { WalletButton } from './WalletButton'

interface Props {
  tab: Tab
  onTab: (t: Tab) => void
  onConnect: () => Promise<void>
  onError: (msg: string) => void
  onNew: () => void
}

const TABS: { id: Tab; label: string }[] = [
  { id: 'all',       label: 'Marketplace' },
  { id: 'mine',      label: 'My Store'    },
  { id: 'purchases', label: 'Purchases'   },
]

export function Navbar({ tab, onTab, onConnect, onError, onNew }: Props) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#08080A]/80 backdrop-blur-2xl">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">

        {/* Logo */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 0L11.5 7H18L12.5 11L14.5 18L9 14L3.5 18L5.5 11L0 7H6.5L9 0Z" fill="url(#logo-grad)"/>
            <defs>
              <linearGradient id="logo-grad" x1="0" y1="0" x2="18" y2="18">
                <stop offset="0%" stopColor="#B06EFF"/>
                <stop offset="100%" stopColor="#14F195"/>
              </linearGradient>
            </defs>
          </svg>
          <span className="font-mono text-sm font-black tracking-[0.18em] text-white uppercase">
            Skills
          </span>
        </div>

        {/* Tabs — desktop only */}
        <nav className="hidden sm:flex items-center gap-0.5 flex-1">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => onTab(t.id)}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                tab === t.id
                  ? 'bg-white/[0.07] text-white tab-active'
                  : 'text-zinc-600 hover:text-zinc-300 hover:bg-white/[0.04]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-2">
          <button
            onClick={onNew}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-white/[0.08] hover:border-white/[0.16] bg-white/[0.03] hover:bg-white/[0.06] text-zinc-400 hover:text-white text-sm font-medium transition-all"
          >
            <span className="text-purple-400 font-bold">+</span> List skill
          </button>
          <WalletButton onConnect={onConnect} onError={onError} />
        </div>

      </div>
    </header>
  )
}
