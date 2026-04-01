'use client'
import { useState } from 'react'
import type { Skill } from '@/types'
import { CATEGORIES } from '@/types'
import { Connection, Transaction, SystemProgram, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js'

const RPC = process.env.NEXT_PUBLIC_SOLANA_NETWORK === 'mainnet-beta'
  ? 'https://api.mainnet-beta.solana.com'
  : 'https://api.devnet.solana.com'

interface Props {
  skill: Skill
  publicKey: string | null
  isPurchased: boolean
  isMine: boolean
  onClose: () => void
  onBuy: (txId: string) => Promise<void>
  onError: (msg: string) => void
  onConnect: () => Promise<void>
}

export function DetailModal({ skill, publicKey, isPurchased, isMine, onClose, onBuy, onError, onConnect }: Props) {
  const [buying,     setBuying]     = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [copied,     setCopied]     = useState(false)
  const cat = CATEGORIES.find(c => c.id === skill.cat) ?? CATEGORIES[0]

  const copy = () => {
    navigator.clipboard.writeText(skill.seller)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const handleConnect = async () => {
    setConnecting(true)
    try { await onConnect() } catch (e) { onError(e instanceof Error ? e.message : 'Failed') }
    finally { setConnecting(false) }
  }

  const buy = async () => {
    if (!publicKey || !window.solana) return
    setBuying(true)
    try {
      const conn = new Connection(RPC, 'confirmed')
      const tx = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: new PublicKey(publicKey),
          toPubkey:   new PublicKey(skill.seller),
          lamports:   Math.round(skill.price * LAMPORTS_PER_SOL),
        })
      )
      const { blockhash } = await conn.getLatestBlockhash()
      tx.recentBlockhash = blockhash
      tx.feePayer = new PublicKey(publicKey)
      const signed = await window.solana.signTransaction(tx)
      const txId   = await conn.sendRawTransaction(signed.serialize())
      await conn.confirmTransaction(txId)
      await onBuy(txId)
    } catch (e) {
      onError(e instanceof Error ? e.message : 'Transaction failed')
    } finally {
      setBuying(false)
    }
  }

  const short = (s: string) => `${s.slice(0, 8)}...${s.slice(-8)}`

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-surface border border-border border-b-0 sm:border-b rounded-t-3xl sm:rounded-2xl w-full sm:max-w-md animate-slide-up shadow-2xl overflow-hidden">

        {/* Drag handle (mobile only) */}
        <div className="pt-3 pb-0 sm:hidden flex justify-center">
          <div className="sheet-handle" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="text-xl">{cat.emoji}</span>
            <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">{cat.label}</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl text-zinc-600 hover:text-white hover:bg-white/8 transition-colors"
          >✕</button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 overflow-y-auto max-h-[55vh] sm:max-h-none">
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-lg font-semibold text-white leading-tight flex-1">{skill.title}</h2>
            <p className="font-mono text-2xl font-bold text-green-400 flex-shrink-0">{skill.price}<span className="text-base ml-1">SOL</span></p>
          </div>

          <p className="text-sm text-zinc-400 leading-relaxed">{skill.description}</p>

          {skill.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {skill.tags.map(t => (
                <span key={t} className="text-[10px] font-mono text-zinc-600 bg-white/[0.04] border border-white/[0.06] rounded-md px-2 py-1">#{t}</span>
              ))}
            </div>
          )}

          <div>
            <p className="text-[10px] text-zinc-600 uppercase tracking-wider font-semibold mb-1.5">Seller</p>
            <div className="flex items-center justify-between bg-bg border border-border rounded-xl px-3 py-2.5 gap-2">
              <span className="font-mono text-xs text-zinc-400 truncate">{short(skill.seller)}</span>
              <button onClick={copy} className="text-xs text-zinc-500 hover:text-white transition-colors flex-shrink-0 px-1">
                {copied ? '✅' : '📋'}
              </button>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="px-5 pb-5 pt-4 border-t border-border" style={{ paddingBottom: 'max(1.25rem, env(safe-area-inset-bottom))' }}>
          {isMine ? (
            <div className="w-full py-3.5 rounded-xl border border-border text-zinc-500 text-sm text-center">
              Your listing
            </div>
          ) : isPurchased ? (
            <div className="w-full py-3.5 rounded-xl border border-green-500/20 bg-green-500/5 text-green-400 text-sm text-center font-medium">
              ✅ Already purchased
            </div>
          ) : !publicKey ? (
            <button
              onClick={handleConnect}
              disabled={connecting}
              className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 active:bg-purple-700 disabled:opacity-50 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2"
            >
              {connecting
                ? <><span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> Connecting...</>
                : <><span>👻</span> Connect to buy</>
              }
            </button>
          ) : (
            <button
              onClick={buy}
              disabled={buying}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-green-500 hover:opacity-90 active:opacity-80 disabled:opacity-50 text-black font-bold text-sm transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20"
            >
              {buying
                ? <><span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" /> Processing...</>
                : `⚡ Buy for ${skill.price} SOL`
              }
            </button>
          )}
        </div>

      </div>
    </div>
  )
}
