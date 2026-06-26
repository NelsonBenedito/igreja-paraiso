'use server'

import { adminListRegistrations, isAdminApiConfigured } from '@/lib/admin-api/client'
import { createClient } from '@/utils/supabase/server'

async function assertAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Não autorizado')
}

export async function fetchAdminRegistrationsAction() {
  await assertAdmin()
  if (!isAdminApiConfigured()) return { items: [], useFallback: true }
  try {
    const items = await adminListRegistrations()
    return { items, useFallback: false }
  } catch (e) {
    console.error('[admin/inscricoes]', e)
    return { items: [], useFallback: true, error: String(e) }
  }
}
