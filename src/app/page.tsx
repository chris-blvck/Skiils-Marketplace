'use client'
import { useState, useCallback, useMemo } from 'react'
import type { Category, Sort, Tab, Toast, Skill } from '@/types'
import { useWallet }        from '@/hooks/useWallet'
import { useSkills }        from '@/hooks/useSkills'
import { insertSkill, insertPurchase } from '@/lib/supabase'
import { Navbar }           from '@/components/Navbar'
import { CategoryFilter }   from '@/components/CategoryFilter'
import { SkillCard }        from '@/components/SkillCard'
import { ListModal }        from '@/components/ListModal'
import { DetailModal }      from '@/components/DetailModal'
import { ToastContainer }   from '@/components/Toast'

const MOBILE_TABS: { id: Tab; icon: string; label: string }[] = [
  { id: 'all',       icon: '✦',  label: 'Market'    },
  { id: 'mine',      icon: '📦', label: 'Store'     },
  { id: 'purchases', icon: '🛒', label: 'Purchases' },
]

export default function HomePage() {
  const wallet  = useWallet()
  const store   = useSkills()

  const [tab,      setTab]      = useState<Tab>('all')
  const [cat,      setCat]      = useState<Category | 'all'>('all')
  const [search,   setSearch]   = useState('')
  const [sort,     setSort]     = useState<Sort>('newest')
  const [listOpen, setListOpen] = useState(false)
  const [selected, setSelected] = useState<Skill | null>(null)
  const [toasts,   setToasts]   = useState<Toast[]>([])

  const toast = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = Date.now()
    setToasts(t => [...t, { id, message, type }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4000)
  }, [])

  const displayed = useMemo(() => {
    let list = store.skills.filter(s => {
      if (tab === 'mine'      && s.seller !== wallet.publicKey)      return false
      if (tab === 'purchases' && !store.purchasedIds.includes(s.id)) return false
      if (cat !== 'all'       && s.cat !== cat)                      return false
      if (search) {
        const q = search.toLowerCase()
        if (
          !s.title.toLowerCase().includes(q) &&
          !s.description.toLowerCase().includes(q) &&
          !s.tags.join(' ').toLowerCase().includes(q)
        ) return false
      }
      return true
    })
    if (sort === 'price_asc')  list = [...list].sort((a, b) => a.price - b.price)
    if (sort === 'price_desc') list = [...list].sort((a, b) => b.price - a.price)
    return list
  }, [store.skills, store.purchasedIds, tab, cat, search, sort, wallet.publicKey])

  const openList = () => {
    if (!wallet.publicKey) { toast('Connect your wallet first', 'error'); return }
    setListOpen(true)
  }

  const handleList = async (data: { title: string; cat: Category; description: string; price: number; tags: string }) => {
    if (!wallet.publicKey) return
    try {
      const tags  = data.tags.split(',').map(t => t.trim()).filter(Boolean)
      const skill = await insertSkill({ ...data, tags, seller: wallet.publicKey })
      store.addSkill(skill)
      setListOpen(false)
      toast('Skill published! 🚀', 'success')
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Failed to publish', 'error')
    }
  }

  const handleBuy = async (txId: string) => {
    if (!selected || !wallet.publicKey) return
    const purchase = await insertPurchase({
      skill_id: selected.id,
      buyer:    wallet.publicKey,
      tx_id:    txId,
      price:    selected.price,
    })
    store.addPurchase(purchase)
    setSelected(null)
    wallet.refreshBalance(wallet.publicKey)
    toast(`Purchased! TX: ${txId.slice(0, 12)}...`, 'success')
  }

  const handleDelete = async (id: string) => {
    try {
      await store.removeSkill(id)
      toast('Listing removed', 'success')
    } catch {
      toast('Failed to remove listing', 'error')
    }
  }

  const myListings = store.skills.filter(s => s.seller === wallet.publicKey)
  const sellers    = new Set(store.skills.map(s => s.seller)).size

  const statsBar: { label: string; value: string | number; color: string }[] = [
    { label: 'Skills',       value: store.skills.length,                   color: 'text-white'      },
    { label: 'Sellers',      value: sellers,                               color: 'text-purple-400' },
    { label: 'Volume',       value: `${store.totalVolume.toFixed(1)} SOL`, color: 'text-green-400'  },
    { label: 'My listings',  value: myListings.length,                     color: 'text-yellow-400' },
    { label: 'My purchases', value: store.purchasedIds.length,             color: 'text-green-400'  },
  ]

  const emptyState = {
    all: { icon: '🔍', title: 'No skills found', sub: 'Try adjusting your search or filters' },
    mine: wallet.publicKey
      ? { icon: '📦', title: 'No listings yet', sub: 'List your first skill and start earning SOL' }
      : { icon: '👻', title: 'Connect your wallet', sub: 'Connect Phantom to see your listings' },
    purchases: wallet.publicKey
      ? { icon: '🛒', title: 'No purchases yet', sub: 'Browse the marketplace and buy your first skill' }
      : { icon: '👻', title: 'Connect your wallet', sub: 'Connect Phantom to see your purchases' },
  }[tab]

  const switchTab = (t: Tab) => { setTab(t); setCat('all'); setSearch('') }

  return (
    <div className="min-h-screen">
      <Navbar
        tab={tab}
        onTab={switchTab}
        onConnect={wallet.connect}
        onError={msg => toast(msg, 'error')}
        onNew={openList}
      />

      <main className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-5 sm:space-y-6 pb-nav sm:pb-8">

        {tab === 'all' && !search && cat === 'all' && (
          <div className="relative dot-grid rounded-2xl overflow-hidden text-center py-10 sm:py-16 px-4 space-y-4 border border-border">
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(153,69,255,0.06) 0%, transparent 70%)' }}
            />
            <div className="relative space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-[11px] font-semibold text-purple-400 uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                Live on Solana Devnet
              </div>
              <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
                Web3 Skills,{' '}
                <span className="gradient-text">Paid in SOL</span>
              </h1>
              <p className="text-zinc-500 text-sm sm:text-base max-w-xs sm:max-w-sm mx-auto leading-relaxed">
                The peer-to-peer marketplace for Solana builders. Buy and sell dev skills, design, and strategy — no middlemen.
              </p>
              {!wallet.publicKey && (
                <button
                  onClick={async () => { try { await wallet.connect() } catch (e) { toast(e instanceof Error ? e.message : 'Failed', 'error') } }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white font-semibold text-sm transition-all hover:scale-[1.02] shadow-lg shadow-purple-500/25"
                >
                  <span>👻</span> Connect Phantom to start
                </button>
              )}
            </div>
          </div>
        )}

        {/* Stats bar — horizontal scroll on mobile */}
        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide sm:grid sm:grid-cols-3 lg:grid-cols-5">
          {statsBar.map(stat => (
            <div
              key={stat.label}
              className="flex-shrink-0 w-32 sm:w-auto bg-surface border border-border rounded-xl p-4 hover:border-zinc-700 transition-colors"
            >
              <p className={`font-mono text-xl sm:text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-[10px] text-zinc-600 mt-0.5 uppercase tracking-wide">{stat.label}</p>
            </div>
          ))}
        </div>

        <CategoryFilter
          active={cat}
          onChange={setCat}
          search={search}
          onSearch={setSearch}
          sort={sort}
          onSort={setSort}
        />

        {store.loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-surface border border-border rounded-2xl h-52 animate-pulse" />
            ))}
          </div>
        ) : store.error ? (
          <div className="text-center py-20">
            <p className="text-3xl mb-3">⚠️</p>
            <p className="text-zinc-500 text-sm">{store.error}</p>
            <button onClick={store.reload} className="mt-4 text-xs text-purple-400 hover:text-purple-300 underline">Try again</button>
          </div>
        ) : displayed.length === 0 ? (
          <div className="text-center py-20 space-y-3">
            <p className="text-5xl">{emptyState.icon}</p>
            <p className="text-white font-semibold">{emptyState.title}</p>
            <p className="text-zinc-500 text-sm max-w-xs mx-auto">{emptyState.sub}</p>
            {tab === 'mine' && wallet.publicKey && (
              <button onClick={openList} className="mt-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium transition-colors">
                List a skill
              </button>
            )}
            {(tab === 'mine' || tab === 'purchases') && !wallet.publicKey && (
              <button
                onClick={async () => { try { await wallet.connect() } catch (e) { toast(e instanceof Error ? e.message : 'Failed', 'error') } }}
                className="mt-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium transition-colors inline-flex items-center gap-2"
              >
                <span>👻</span> Connect Phantom
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {displayed.map(s => (
              <SkillCard
                key={s.id}
                skill={s}
                isPurchased={store.purchasedIds.includes(s.id)}
                isMine={s.seller === wallet.publicKey}
                onClick={() => setSelected(s)}
                onDelete={s.seller === wallet.publicKey ? () => handleDelete(s.id) : undefined}
              />
            ))}
          </div>
        )}

      </main>

      {/* Mobile bottom nav */}
      <nav
        className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-bg/95 backdrop-blur-2xl border-t border-border grid grid-cols-4"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        {MOBILE_TABS.map(t => (
          <button
            key={t.id}
            onClick={() => switchTab(t.id)}
            className={`flex flex-col items-center justify-center gap-0.5 py-3 text-[10px] font-semibold uppercase tracking-wider transition-colors ${
              tab === t.id ? 'text-purple-400' : 'text-zinc-600'
            }`}
          >
            <span className={`text-lg leading-tight transition-transform ${tab === t.id ? 'scale-110' : ''}`}>
              {t.icon}
            </span>
            {t.label}
          </button>
        ))}
        <button
          onClick={openList}
          className="flex flex-col items-center justify-center gap-0.5 py-3 text-[10px] font-semibold uppercase tracking-wider text-zinc-600 active:text-white transition-colors"
        >
          <span className="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center text-white text-lg leading-none -mt-0.5">+</span>
          List
        </button>
      </nav>

      {/* FAB — desktop only */}
      {wallet.publicKey && (
        <button
          onClick={openList}
          title="List a skill"
          className="hidden sm:flex fixed bottom-6 right-6 w-12 h-12 rounded-full bg-purple-600 hover:bg-purple-500 text-white text-xl shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transition-all hover:scale-105 items-center justify-center z-30"
        >+</button>
      )}

      {listOpen && <ListModal onClose={() => setListOpen(false)} onSubmit={handleList} />}

      {selected && (
        <DetailModal
          skill={selected}
          publicKey={wallet.publicKey}
          isPurchased={store.purchasedIds.includes(selected.id)}
          isMine={selected.seller === wallet.publicKey}
          onClose={() => setSelected(null)}
          onBuy={handleBuy}
          onError={msg => toast(msg, 'error')}
          onConnect={wallet.connect}
        />
      )}

      <ToastContainer toasts={toasts} />
    </div>
  )
}
