'use client'
import type { Skill } from '@/types'
import { CATEGORIES } from '@/types'
import { useRef, useState } from 'react'

interface Props {
  skill: Skill
  isPurchased: boolean
  isMine: boolean
  onClick: () => void
  onDelete?: () => Promise<void>
  style?: React.CSSProperties
}

export function SkillCard({ skill, isPurchased, isMine, onClick, onDelete, style }: Props) {
  const cat = CATEGORIES.find(c => c.id === skill.cat) ?? CATEGORIES[0]
  const ref = useRef<HTMLDivElement>(null)
  const [deleting, setDeleting] = useState(false)
  const short = (s: string) => `${s.slice(0, 4)}\u2026${s.slice(-4)}`

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = ref.current!.getBoundingClientRect()
    ref.current!.style.setProperty('--x', `${((e.clientX - r.left) / r.width * 100).toFixed(1)}%`)
    ref.current!.style.setProperty('--y', `${((e.clientY - r.top) / r.height * 100).toFixed(1)}%`)
  }

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!onDelete || !confirm('Remove this listing?')) return
    setDeleting(true)
    try { await onDelete() } finally { setDeleting(false) }
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      style={{ '--x': '50%', '--y': '50%', ...style } as React.CSSProperties}
      onClick={onClick}
      className="stagger card-glow group relative bg-[#0F0F13] border border-white/[0.07] rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-2xl hover:shadow-purple-900/20 flex flex-col gap-3.5 overflow-hidden"
    >
      {/* Mouse-tracking inner glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
        style={{ background: 'radial-gradient(circle at var(--x) var(--y), rgba(153,69,255,0.10), transparent 50%)' }}
      />

      {/* Status badges */}
      {isPurchased && !isMine && (
        <span className="absolute top-3.5 right-3.5 text-[10px] font-bold px-2 py-0.5 rounded-md bg-green-500/10 text-green-400 border border-green-500/20 tracking-widest uppercase">
          Purchased
        </span>
      )}
      {isMine && (
        <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20 tracking-widest uppercase">
            Yours
          </span>
          {onDelete && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="w-5 h-5 flex items-center justify-center rounded-md bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 transition-colors disabled:opacity-40 text-[10px]"
            >
              {deleting ? '\u2026' : '\u2715'}
            </button>
          )}
        </div>
      )}

      {/* Top: emoji + category */}
      <div className="flex items-center gap-2.5">
        <span className="text-2xl">{cat.emoji}</span>
        <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.15em]">
          {cat.label}
        </span>
      </div>

      {/* Title + description */}
      <div className="flex-1 space-y-1.5">
        <h3 className="text-sm font-semibold text-white leading-snug group-hover:text-purple-100 transition-colors line-clamp-2">
          {skill.title}
        </h3>
        <p className="text-xs text-zinc-600 leading-relaxed line-clamp-2">{skill.description}</p>
      </div>

      {/* Tags */}
      {skill.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {skill.tags.slice(0, 3).map(t => (
            <span key={t} className="text-[10px] font-mono text-zinc-700 bg-white/[0.03] border border-white/[0.05] rounded-md px-2 py-0.5 group-hover:border-white/[0.08] transition-colors">
              #{t}
            </span>
          ))}
          {skill.tags.length > 3 && (
            <span className="text-[10px] font-mono text-zinc-800">+{skill.tags.length - 3}</span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3.5 border-t border-white/[0.06] mt-auto">
        <div>
          <span className="font-mono text-lg font-black text-white">{skill.price}</span>
          <span className="font-mono text-xs font-bold text-green-400 ml-1.5">SOL</span>
        </div>
        <div className="relative h-5 overflow-hidden">
          <span className="font-mono text-[10px] text-zinc-700 absolute inset-0 flex items-center justify-end group-hover:opacity-0 transition-opacity">
            {short(skill.seller)}
          </span>
          <span className="text-xs font-semibold text-purple-400 absolute inset-0 flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity gap-1">
            View details <span>\u2192</span>
          </span>
        </div>
      </div>
    </div>
  )
}
