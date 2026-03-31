import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Skills Marketplace',
  description: 'Buy and sell Web3 skills on Solana',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
