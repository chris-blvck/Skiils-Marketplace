import type { Transaction, PublicKey } from '@solana/web3.js'

interface PhantomProvider {
  isPhantom: boolean
  publicKey: PublicKey | null
  isConnected: boolean
  connect(opts?: { onlyIfTrusted?: boolean }): Promise<{ publicKey: PublicKey }>
  disconnect(): Promise<void>
  signTransaction(tx: Transaction): Promise<Transaction>
  signAllTransactions(txs: Transaction[]): Promise<Transaction[]>
  on(event: string, handler: (args: unknown) => void): void
  off(event: string, handler: (args: unknown) => void): void
}

declare global {
  interface Window {
    solana?: PhantomProvider
  }
}
