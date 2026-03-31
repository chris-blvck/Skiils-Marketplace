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
}

export function SkillCard({ skill, isPurchased, isMine, onClick, onDelete }: Props) {
  const cat = CATEGORIES.find(c => c.id === skill.cat) ?? CATEGORIES[0]
  const ref = useRef<HTMLDivElement>(null)
  const [deleting, setDeleting] = useState(false)
  const short = (s: string) => `${s.slice(0, 4)}...${s.slice(-4)}`

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = ref.current!.getBoundingClientRect()
    ref.current!.style.setProperty('--x', `${((e.clientX - r.left) / r.width * 100).toFixed(1)}%`)
    ref.current!.style.setProperty('--y', `${((e.clientY - r.top)  / r.height * 100).toFixed(1)}%`)
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
      className="group relative bg-surface border border-border rounded-2xl p-5 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:border-zinc-700 hover:shadow-xl hover:shadow-black/40 flex flex-col gap-3 overflow-hidden"
      style={{ '--x': '50%', '--y': '50%' } as React.CSSProperties}
      onClick={onClick}
    >
      {/* Mouse glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
        style={{ background: 'radial-gradient(circle at var(--x) var(--y), rgba(153,69,255,0.07), transparent 60%)' }}
      />

      {/* Status badge */}
      {isPurchased && !isMine && (
        <span className="absolute top-3 right-3 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-green-500/10 text-green-400 border border-green-500/20 tracking-wide">
          PURCHASED
        </span>
      )}

      {/* My listing controls */}
      {isMine && (
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 tracking-wide">
            YOURS
          </span>
          {onDelete && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="w-5 h-5 flex items-center justify-center rounded bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 transition-colors disabled:opacity-40 text-[10px]"
              title="Remove listing"
            >
              {deleting ? '…' : '✕'}
            </button>
          )}
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between">
        <span className="text-2xl">{cat.emoji}</span>
        <span className="text-[10px] font-semibold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded uppercase tracking-wider mr-16">
          {cat.label}
        </span>
      </div>

      {/* Content */}
      <div>
        <h3 className="text-sm font-semibold text-white leading-snug mb-1.5">{skill.title}</h3>
        <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2">{skill.description}</p>
      </div>

      {/* Tags */}
      {skill.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {skill.tags.slice(0, 3).map(t => (
            <span key={t} className="text-[10px] font-mono text-zinc-600 bg-white/[0.04] border border-white/[0.06] rounded px-1.5 py-0.5">
              #{t}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
        <span className="font-mono text-base font-bold text-green-400">{skill.price} SOL</span>
        <span className="font-mono text-[10px] text-zinc-600">{short(skill.seller)}</span>
      </div>
    </div>
  )
}
