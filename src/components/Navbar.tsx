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
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-6">

        {/* Logo */}
        <div className="flex items-center gap-6">
          <span className="font-mono text-sm font-bold tracking-widest text-white uppercase">
            Skills<span className="text-purple-400">.</span>
          </span>

          {/* Tabs */}
          <nav className="hidden sm:flex items-center gap-1">
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
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <button
            onClick={onNew}
            className="px-3 py-1.5 rounded-lg border border-border hover:border-zinc-600 text-zinc-400 hover:text-white text-sm transition-colors"
          >
            + List skill
          </button>
          <WalletButton onConnect={onConnect} onError={onError} />
        </div>

      </div>
    </header>
  )
}
