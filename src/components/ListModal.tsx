'use client'
import { useState } from 'react'
import type { Category } from '@/types'
import { CATEGORIES } from '@/types'

interface FormState {
  title: string
  cat: Category
  description: string
  price: string
  tags: string
}

interface Props {
  onClose: () => void
  onSubmit: (data: Omit<FormState, 'price'> & { price: number }) => Promise<void>
}

export function ListModal({ onClose, onSubmit }: Props) {
  const [form, setForm] = useState<FormState>({ title: '', cat: 'smart', description: '', price: '', tags: '' })
  const [loading, setLoading] = useState(false)
  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm(f => ({ ...f, [k]: v }))

  const submit = async () => {
    if (!form.title.trim() || !form.description.trim() || !form.price || parseFloat(form.price) <= 0) return
    setLoading(true)
    try {
      await onSubmit({ ...form, price: parseFloat(form.price) })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-surface border border-border rounded-2xl w-full max-w-md animate-slide-up overflow-hidden shadow-2xl">

        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="font-semibold text-white">List a Skill</h2>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-500 hover:text-white hover:bg-white/8 transition-colors text-sm">✕</button>
        </div>

        <div className="p-5 space-y-4">
          <Field label="Title">
            <input className={input} placeholder="e.g. Solana Smart Contract Audit" value={form.title} onChange={e => set('title', e.target.value)} />
          </Field>

          <Field label="Category">
            <select className={input} value={form.cat} onChange={e => set('cat', e.target.value as Category)}>
              {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>
              ))}
            </select>
          </Field>

          <Field label="Description">
            <textarea className={`${input} h-24 resize-none`} placeholder="Describe what you're offering, deliverables, timeline..." value={form.description} onChange={e => set('description', e.target.value)} />
          </Field>

          <Field label="Price">
            <div className="relative">
              <input className={`${input} pr-14`} type="number" step="0.01" min="0.001" placeholder="0.50" value={form.price} onChange={e => set('price', e.target.value)} />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-green-400">SOL</span>
            </div>
          </Field>

          <Field label="Tags (comma separated)">
            <input className={input} placeholder="anchor, rust, defi" value={form.tags} onChange={e => set('tags', e.target.value)} />
          </Field>
        </div>

        <div className="flex gap-3 p-5 border-t border-border">
          <button onClick={onClose} className="px-4 py-2.5 rounded-xl border border-border text-zinc-400 hover:text-white text-sm transition-colors">
            Cancel
          </button>
          <button onClick={submit} disabled={loading} className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-sm font-medium transition-colors flex items-center justify-center gap-2">
            {loading ? <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : '🚀'}
            Publish
          </button>
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1.5">{label}</label>
      {children}
    </div>
  )
}

const input = 'w-full bg-bg border border-border rounded-xl px-3 py-2.5 text-sm text-white placeholder-zinc-600 outline-none focus:border-zinc-600 transition-colors'
