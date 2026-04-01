'use client'
// Force dynamic rendering — page needs wallet + Supabase at runtime
export const dynamic = 'force-dynamic'

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
  { id: 'all',       icon: '\u2726',  label: 'Market'    },
  { id: 'mine',      icon: '\ud83d\udce6', label: 'Store'     },
  { id: 'purchases', icon: '\ud83d\uded2', label: 'Purchases' },
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
      toast('Skill published! \ud83d\ude80', 'success')
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
    all: { icon: '\ud83d\udd0d', title: 'No skills found', sub: 'Try adjusting your search or filters' },
    mine: wallet.publicKey
      ? { icon: '\ud83d\udce6', title: 'No listings yet', sub: 'List your first skill and start earning SOL' }
      : { icon: '\ud83d\udc7b', title: 'Connect your wallet', sub: 'Connect Phantom to see your listings' },
    purchases: wallet.publicKey
      ? { icon: '\ud83d\uded2', title: 'No purchases yet', sub: 'Browse the marketplace and buy your first skill' }
      : { icon: '\ud83d\udc7b', title: 'Connect your wallet', sub: 'Connect Phantom to see your purchases' },
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
          <section className="relative text-center pt-8 pb-4 sm:pt-14 sm:pb-8 overflow-hidden">
            <div className="absolute inset-0 pointer-events-none overflow-hidden -mx-4">
              <div className="orb-pulse absolute -top-20 left-1/4 w-[480px] h-[480px] bg-purple-600/10 rounded-full blur-[80px]" />
              <div className="orb-pulse-delay absolute -bottom-20 right-1/4 w-[320px] h-[320px] bg-green-500/8 rounded-full blur-[60px]" />
            </div>
            <div className="relative space-y-5 sm:space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                <span className="text-[11px] font-bold text-purple-300 uppercase tracking-[0.15em]">Live \u00b7 Solana Devnet</span>
              </div>
              <h1 className="text-[2.6rem] sm:text-[4.5rem] lg:text-[5.5rem] font-black text-white tracking-[-0.03em] leading-[0.92]">
                The Skills Market<br />
                <span className="gradient-text">for Web3 Builders</span>
              </h1>
              <p className="text-zinc-500 text-sm sm:text-base max-w-sm mx-auto leading-relaxed">
                Buy and sell dev skills, design & strategy.<br className="hidden sm:block" />
                Paid in SOL. No fees. No middlemen.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                {!wallet.publicKey ? (
                  <button
                    onClick={async () => { try { await wallet.connect() } catch (e) { toast(e instanceof Error ? e.message : 'Failed', 'error') } }}
                    className="inline-flex items-center gap-2.5 px-7 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white font-bold text-sm transition-all hover:scale-[1.03] shadow-xl shadow-purple-500/25"
                  >
                    <span>\ud83d\udc7b</span> Connect Phantom
                  </button>
                ) : (
                  <button
                    onClick={openList}
                    className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm transition-all hover:scale-[1.02]"
                  >
                    <span className="text-base font-black">+</span> List your skill
                  </button>
                )}
                <div className="flex items-center gap-2 text-zinc-700 text-xs font-mono">
                  <span className="w-1 h-1 rounded-full bg-zinc-700" />
                  {store.skills.length} skills \u00b7 {new Set(store.skills.map(s => s.seller)).size} sellers
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Stats bar \u2014 horizontal scroll on mobile */}
        <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-hide sm:grid sm:grid-cols-3 lg:grid-cols-5">
          {statsBar.map(stat => (
            <div
              key={stat.label}
              className="flex-shrink-0 w-[130px] sm:w-auto bg-[#0F0F13] border border-white/[0.06] rounded-xl p-4 hover:border-white/[0.10] transition-colors"
            >
              <p className={`font-mono text-xl sm:text-2xl font-black ${stat.color}`}>{stat.value}</p>
              <p className="text-[10px] text-zinc-700 mt-1 uppercase tracking-[0.12em] font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Sticky filter bar */}
        <div className="sticky top-14 z-30 -mx-4 px-4 py-3 bg-[#08080A]/85 backdrop-blur-xl border-b border-white/[0.04]">
          <CategoryFilter
            active={cat}
            onChange={setCat}
            search={search}
            onSearch={setSearch}
            sort={sort}
            onSort={setSort}
          />
        </div>

        {store.loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton rounded-2xl h-52" />
            ))}
          </div>
        ) : store.error ? (
          <div className="text-center py-20">
            <p className="text-3xl mb-3">\u26a0\ufe0f</p>
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
                <span>\ud83d\udc7b</span> Connect Phantom
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {displayed.map((s, i) => (
              <SkillCard
                key={s.id}
                skill={s}
                isPurchased={store.purchasedIds.includes(s.id)}
                isMine={s.seller === wallet.publicKey}
                onClick={() => setSelected(s)}
                onDelete={s.seller === wallet.publicKey ? () => handleDelete(s.id) : undefined}
                style={{ animationDelay: `${i * 40}ms`, animationFillMode: 'both' } as React.CSSProperties}
              />
            ))}
          </div>
        )}

      </main>

      {/* Mobile bottom nav */}
      <nav
        className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-[#08080A]/95 backdrop-blur-2xl border-t border-white/[0.06] grid grid-cols-4"
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

      {/* FAB \u2014 desktop only */}
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
