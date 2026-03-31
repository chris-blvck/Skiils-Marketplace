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
      {/* Search + Sort row */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search skills, tags, tech..."
            value={search}
            onChange={e => onSearch(e.target.value)}
            className="w-full bg-surface border border-border rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none focus:border-zinc-600 transition-colors"
          />
        </div>
        <select
          value={sort}
          onChange={e => onSort(e.target.value as Sort)}
          className="bg-surface border border-border rounded-xl px-3 py-2.5 text-sm text-zinc-400 outline-none cursor-pointer focus:border-zinc-600 transition-colors"
        >
          <option value="newest">Newest</option>
          <option value="price_asc">Price ↑</option>
          <option value="price_desc">Price ↓</option>
        </select>
      </div>

      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {CATEGORIES.map(c => (
          <button
            key={c.id}
            onClick={() => onChange(c.id)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              active === c.id
                ? 'bg-purple-500/15 border border-purple-500/30 text-purple-300'
                : 'bg-surface border border-border text-zinc-500 hover:text-zinc-300 hover:border-zinc-600'
            }`}
          >
            <span>{c.emoji}</span>
            <span>{c.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
