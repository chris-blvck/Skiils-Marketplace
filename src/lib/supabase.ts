import { createClient } from '@supabase/supabase-js'
import type { Skill, Purchase } from '@/types'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(url, key)

export async function fetchSkills(): Promise<Skill[]> {
  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function fetchPurchases(): Promise<Purchase[]> {
  const { data, error } = await supabase.from('purchases').select('*')
  if (error) throw error
  return data ?? []
}

export async function insertSkill(skill: Omit<Skill, 'id' | 'created_at'>): Promise<Skill> {
  const { data, error } = await supabase
    .from('skills').insert(skill).select().single()
  if (error) throw error
  return data
}

export async function insertPurchase(p: Omit<Purchase, 'id' | 'created_at'>): Promise<Purchase> {
  const { data, error } = await supabase
    .from('purchases').insert(p).select().single()
  if (error) throw error
  return data
}

export async function deleteSkill(id: string): Promise<void> {
  const { error } = await supabase.from('skills').delete().eq('id', id)
  if (error) throw error
}
