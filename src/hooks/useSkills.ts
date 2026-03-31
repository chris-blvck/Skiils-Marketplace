'use client'
import { useState, useEffect, useCallback } from 'react'
import type { Skill, Purchase } from '@/types'
import { fetchSkills, fetchPurchases, deleteSkill as dbDelete } from '@/lib/supabase'
import { seedIfEmpty } from '@/lib/seed'

export function useSkills() {
  const [skills,    setSkills]    = useState<Skill[]>([])
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      await seedIfEmpty()
      const [s, p] = await Promise.all([fetchSkills(), fetchPurchases()])
      setSkills(s)
      setPurchases(p)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const addSkill    = (s: Skill)    => setSkills(prev => [s, ...prev])
  const addPurchase = (p: Purchase) => setPurchases(prev => [...prev, p])

  const removeSkill = useCallback(async (id: string) => {
    await dbDelete(id)
    setSkills(prev => prev.filter(s => s.id !== id))
  }, [])

  const purchasedIds  = purchases.map(p => p.skill_id)
  const totalVolume   = purchases.reduce((sum, p) => sum + p.price, 0)

  return {
    skills, purchases, purchasedIds, totalVolume,
    loading, error, reload: load,
    addSkill, addPurchase, removeSkill,
  }
}
