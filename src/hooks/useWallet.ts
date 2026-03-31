'use client'
import { useState, useCallback, useEffect } from 'react'
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js'

const RPC = process.env.NEXT_PUBLIC_SOLANA_NETWORK === 'mainnet-beta'
  ? 'https://api.mainnet-beta.solana.com'
  : 'https://api.devnet.solana.com'

const phantom = () => (typeof window !== 'undefined' ? window.solana : undefined)

async function getBalance(pk: string): Promise<number> {
  const conn = new Connection(RPC, 'confirmed')
  const bal  = await conn.getBalance(new PublicKey(pk))
  return bal / LAMPORTS_PER_SOL
}

export function useWallet() {
  const [publicKey, setPublicKey] = useState<string | null>(null)
  const [balance,   setBalance]   = useState<number | null>(null)
  const [loading,   setLoading]   = useState(false)

  const refreshBalance = useCallback(async (pk: string | null) => {
    if (!pk) return
    try { setBalance(await getBalance(pk)) } catch { /* silent */ }
  }, [])

  const connect = useCallback(async () => {
    const p = phantom()
    if (!p?.isPhantom) throw new Error('Phantom not found — install it at phantom.app')
    setLoading(true)
    try {
      const { publicKey: pk } = await p.connect()
      const addr = pk.toString()
      setPublicKey(addr)
      setBalance(await getBalance(addr))
    } finally {
      setLoading(false)
    }
  }, [])

  const disconnect = useCallback(async () => {
    await phantom()?.disconnect()
    setPublicKey(null)
    setBalance(null)
  }, [])

  // Auto-reconnect on mount (trusted only)
  useEffect(() => {
    const p = phantom()
    if (!p?.isPhantom) return
    p.connect({ onlyIfTrusted: true })
      .then(async ({ publicKey: pk }) => {
        const addr = pk.toString()
        setPublicKey(addr)
        setBalance(await getBalance(addr))
      })
      .catch(() => {})
  }, [])

  return { publicKey, balance, loading, connect, disconnect, refreshBalance }
}
