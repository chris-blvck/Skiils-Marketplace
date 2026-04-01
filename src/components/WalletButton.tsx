'use client'
import { useState } from 'react'
import { useWallet } from '@/hooks/useWallet'

interface Props {
  onConnect: () => Promise<void>
  onError: (msg: string) => void
}

export function WalletButton({ onConnect, onError }: Props) {
  const { publicKey, balance, loading, disconnect } = useWallet()
  const [open, setOpen] = useState(false)
  const short = (s: string) => `${s.slice(0, 4)}\u2026${s.slice(-4)}`

  if (publicKey) {
    return (
      <div className="relative">
        <button
          onClick={() => setOpen(o => !o)}
          className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg bg-surface border border-border hover:border-zinc-600 transition-colors"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
          <span className="font-mono text-xs text-zinc-300">{short(publicKey)}</span>
          <span className="font-mono text-xs text-purple-400 hidden sm:inline">
            {balance !== null ? `${balance.toFixed(2)} SOL` : '\u2026'}
          </span>
          <svg
            className={`w-3 h-3 text-zinc-500 transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <div className="absolute right-0 top-full mt-2 z-20 w-56 bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
              <div className="px-4 py-3 border-b border-border space-y-0.5">
                <p className="text-[10px] text-zinc-600 uppercase tracking-wider font-semibold">Connected</p>
                <p className="font-mono text-[11px] text-zinc-400 break-all leading-snug">{publicKey}</p>
              </div>
              <div className="px-4 py-2.5 border-b border-border flex items-center justify-between">
                <span className="text-xs text-zinc-500">Balance</span>
                <span className="font-mono text-sm font-bold text-purple-400">
                  {balance !== null ? `${balance.toFixed(4)} SOL` : '\u2014'}
                </span>
              </div>
              <button
                onClick={() => { disconnect(); setOpen(false) }}
                className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/8 transition-colors flex items-center gap-2"
              >
                <span className="text-base">\u23cf</span> Disconnect
              </button>
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <button
      onClick={async () => {
        try { await onConnect() }
        catch (e) { onError(e instanceof Error ? e.message : 'Connection failed') }
      }}
      disabled={loading}
      className="flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white text-sm font-medium transition-colors disabled:opacity-50"
    >
      {loading
        ? <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        : <span>\ud83d\udc7b</span>
      }
      <span className="hidden sm:inline">Connect</span>
    </button>
  )
}
