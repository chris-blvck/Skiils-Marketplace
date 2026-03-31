'use client'
import { CATEGORIES } from '@/types'
import type { Category, Sort } from '@/types'

interface Props {
  active: Category | 'all'
  onChange: (c: Category | 'all') => void
  search: string
  onSearch: (s: string) => void
  sort: Sort
  onSort: (s: Sort) => void
}

export function CategoryFilter({ active, onChange, search, onSearch, sort, onSort }: Props) {
  return (
    <div className="space-y-3">
      <div className="flex gap-2.5">
        <div className="relative flex-1">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search skills, tags, tech..."
            value={search}
            onChange={e => onSearch(e.target.value)}
            className="w-full bg-[#0F0F13] border border-white/[0.07] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-700 outline-none focus:border-purple-500/40 focus:bg-[#13131A] transition-all"
          />
          {search && (
            <button
              onClick={() => onSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center rounded-full bg-zinc-700 hover:bg-zinc-600 text-zinc-400 text-[10px] transition-colors"
            >\u2715</button>
          )}
        </div>
        <select
          value={sort}
          onChange={e => onSort(e.target.value as Sort)}
          className="bg-[#0F0F13] border border-white/[0.07] rounded-xl px-3 py-2.5 text-sm text-zinc-500 outline-none cursor-pointer focus:border-purple-500/40 transition-all"
        >
          <option value="newest">Newest</option>
          <option value="price_asc">Price \u2191</option>
          <option value="price_desc">Price \u2193</option>
        </select>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {CATEGORIES.map(c => (
          <button
            key={c.id}
            onClick={() => onChange(c.id)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              active === c.id
                ? 'bg-purple-500/15 border border-purple-500/35 text-purple-300 shadow-sm shadow-purple-500/10'
                : 'bg-white/[0.03] border border-white/[0.06] text-zinc-600 hover:text-zinc-300 hover:border-white/[0.12] hover:bg-white/[0.05]'
            }`}
          >
            <span className="text-sm leading-none">{c.emoji}</span>
            <span className="tracking-wide">{c.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
