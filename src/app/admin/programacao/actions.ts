'use server'

import {
  adminListSchedules,
  adminCreateSchedule,
  adminUpdateSchedule,
  adminDeleteSchedule,
  isAdminApiConfigured,
  type CreateAdminScheduleBody,
} from '@/lib/admin-api/client'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

async function assertAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Não autorizado')
}

export async function fetchAdminSchedulesAction() {
  await assertAdmin()
  if (!isAdminApiConfigured()) return { items: [], useFallback: true }
  try {
    const items = await adminListSchedules()
    return { items, useFallback: false }
  } catch (e) {
    console.error('[admin/programacao]', e)
    return { items: [], useFallback: true, error: String(e) }
  }
}

export async function createScheduleAction(body: CreateAdminScheduleBody) {
  await assertAdmin()
  const schedule = await adminCreateSchedule(body)
  revalidatePath('/admin/programacao')
  revalidatePath('/')
  return schedule
}

export async function updateScheduleAction(id: string, body: Partial<CreateAdminScheduleBody>) {
  await assertAdmin()
  const schedule = await adminUpdateSchedule(id, body)
  revalidatePath('/admin/programacao')
  revalidatePath('/')
  return schedule
}

export async function deleteScheduleAction(id: string) {
  await assertAdmin()
  await adminDeleteSchedule(id)
  revalidatePath('/admin/programacao')
  revalidatePath('/')
}
