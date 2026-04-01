'use client'
import type { Toast as ToastType } from '@/types'

export function ToastContainer({ toasts }: { toasts: ToastType[] }) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`animate-slide-right flex items-start gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl text-sm max-w-sm shadow-xl pointer-events-auto ${
            t.type === 'success'
              ? 'bg-zinc-900/90 border-green-500/30 text-white'
              : t.type === 'error'
              ? 'bg-zinc-900/90 border-red-500/30 text-white'
              : 'bg-zinc-900/90 border-zinc-700 text-white'
          }`}
        >
          <span className="mt-0.5 flex-shrink-0">
            {t.type === 'success' ? '✅' : t.type === 'error' ? '❌' : 'ℹ️'}
          </span>
          <span className="text-zinc-300 leading-snug">{t.message}</span>
        </div>
      ))}
    </div>
  )
}
