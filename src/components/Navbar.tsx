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
    <header className="sticky top-0 z-40 border-b border-border bg-bg/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">

        {/* Logo */}
        <span className="font-mono text-sm font-bold tracking-widest text-white uppercase flex-shrink-0">
          Skills<span className="text-purple-400">.</span>
        </span>

        {/* Tabs — hidden on mobile, shown sm+ */}
        <nav className="hidden sm:flex items-center gap-1 flex-1">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => onTab(t.id)}
              className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                tab === t.id
                  ? 'bg-white/8 text-white tab-active'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onNew}
            className="hidden sm:flex px-3 py-1.5 rounded-lg border border-border hover:border-zinc-600 text-zinc-400 hover:text-white text-sm transition-colors items-center gap-1.5"
          >
            <span className="text-base leading-none">+</span> List skill
          </button>
          <WalletButton onConnect={onConnect} onError={onError} />
        </div>

      </div>
    </header>
  )
}
